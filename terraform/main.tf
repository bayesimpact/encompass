provider "aws" {
  region = "us-west-1"
}

terraform {
  backend "s3" {
    bucket     = "network-adequacy-terraform"
    key        = "na-testing/terraform.tfstate"
    region     = "us-west-1"

    # ddb table to hold tfstate locks
    dynamodb_table = "tflock"
  }
}

# this is the ec2 instance representing the default app server
resource "aws_instance" "na_app" {
  # these two attributes are required
  instance_type                   = "m4.large"
  ami                             = "ami-1a033c7a"

  ebs_optimized                   = true
  associate_public_ip_address     = "true"
  availability_zone               = "us-west-1b"
  key_name                        = "na-server"
  monitoring                      = false
  tenancy                         = "default"

  tags { Name = "na-teddy" }
}
