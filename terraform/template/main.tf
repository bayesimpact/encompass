provider "aws" {
  region = "us-west-1"
}

locals {
  security_group_name = "${var.app_security_group_name}-${var.env_name}"
}

# this is the ec2 instance representing the default app server
resource "aws_instance" "na_app" {
  # these two attributes are required
  instance_type                   = "m4.large"
  ami                             = "${var.app_ami}"

  ebs_optimized                   = true
  associate_public_ip_address     = "true"
  availability_zone               = "us-west-1b"
  key_name                        = "na-server"
  monitoring                      = false
  tenancy                         = "default"
  security_groups                 = ["${local.security_group_name}"]

  tags { Name = "${var.instance_name_tag}" }
}

# this is the rds instance representing the default app db
resource "aws_db_instance" "na_db" {
  # these two attributes are required
  identifier                          = "${var.db_id}" #fixme
  instance_class                      = "db.t2.large"

  allocated_storage                   = 40
  auto_minor_version_upgrade          = true
  backup_retention_period             = 7
  copy_tags_to_snapshot               = false
  skip_final_snapshot                 = true
  db_subnet_group_name                = "default"
  engine                              = "postgres"
  engine_version                      = "9.6.3"
  iam_database_authentication_enabled = false
  license_model                       = "postgresql-license"
  monitoring_interval                 = 0
  multi_az                            = false
  name                                = "network_adequacy"
  port                                = 5432
  publicly_accessible                 = true
  snapshot_identifier                 = "initial-for-tds-qa"
  storage_encrypted                   = false
  storage_type                        = "gp2"
  username                            = "tds"
  password                            = "${var.db_password}"
}

# security group for app server
resource "aws_security_group" "na_app_sg" {
  name        = "${local.security_group_name}"
  description = "Allow inbound traffic on app ports"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8081
    to_port     = 8081
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # permit everything outbound. needs to be done explicitly
  egress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    cidr_blocks     = ["0.0.0.0/0"]
  }

  tags {
    Name = "na_app_sg"
  }
}
