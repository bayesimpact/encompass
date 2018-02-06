# Some variables/constants from the default app module definition are overridden here.
# This is not strictly necessary since we can just reference the variables file in the other directory,
# but this way we relieve some of the knowledge overhead when running Terraform.
locals {
  env_name = "shared-osrm"
  default_vpc_cidr_block = "172.31.0.0/16"
  default_osrm_ami = "ami-ade561d5" # OSRM image made on 2018-02-05
}

# Backend definition can't have interpolation, so unfortunately this does need to be
# duplicated between environment definitions. It also needs hardcoded values, hence
# why we can't use the aws_region variable.
provider "aws" {
  region = "us-west-2"
}
terraform {
  backend "s3" {
    bucket     = "encompass-terraform"
    key        = "shared-osrm/terraform.tfstate"
    region     = "us-west-2"

    # ddb table to hold tfstate locks.
    dynamodb_table = "tflock"
  }
}

# Bayes Impact Default VPC.
resource "aws_vpc" "main" {
  cidr_block       = "${local.default_vpc_cidr_block}"
  instance_tenancy = "default"
  lifecycle {
    prevent_destroy  = true
  }
}

# This is the ec2 instance representing the shared OSRM app server.
resource "aws_instance" "shared_osrm_app" {
  # These two attributes are required.
  instance_type                   = "m4.2xlarge"
  ami                             = "${local.default_osrm_ami}"

  ebs_optimized                   = true
  associate_public_ip_address     = "true"
  availability_zone               = "us-west-2b"
  key_name                        = "na-server"
  monitoring                      = false
  tenancy                         = "default"
  security_groups                 = ["shared-osrm-sg"]

  tags { Name = "${local.env_name}" }
}

resource "aws_security_group" "shared_osrm_sg" {
  name        = "shared-osrm-sg"
  description = "Allow inbound traffic on 80 and 22"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Permit everything outbound. Needs to be done explicitly.
  egress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    cidr_blocks     = ["0.0.0.0/0"]
  }
}
