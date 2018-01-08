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

# this is the rds instance representing the default app db
resource "aws_db_instance" "na_db" {
  # these two attributes are required
  identifier                          = "philip-testing"
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
  storage_encrypted                   = false
  storage_type                        = "gp2"
  username                            = "tds"
}
