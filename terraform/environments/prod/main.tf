variable "db_password" {
  description = "The password to use for TDS DB access"
  type        = "string"
}

locals {
  env_name = "prod"
}

module "stack" {
  source        = "../../template"

  env_name = "${local.env_name}"
  db_id = "time-distance-database" # This name predates the use of terraform.
  instance_name_tag = "encompass-${local.env_name}"
  db_password = "${var.db_password}"
}

# Backend definition can't have interpolation, so unfortunately this does need to be
# duplicated between environment definitions. It also needs hardcoded values, hence
# why we can't use the aws_region variable.
terraform {
  backend "s3" {
    bucket     = "encompass-terraform"
    key        = "prod/terraform.tfstate"
    region     = "us-west-2"

    # ddb table to hold tfstate locks.
    dynamodb_table = "tflock"
  }
}
