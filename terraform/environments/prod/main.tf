variable "db_password" {
  description = "The password to use for TDS DB access"
  type        = "string"
}

module "stack" {
  source        = "../../template"

  env_name = "prod"
  db_id = "philip-testing"
  instance_name_tag = "na-teddy"
  db_password = "${var.db_password}"
}

# Backend definition can't have interpolation, so unfortunately this does need to be
# duplicated between environment definitions. It also needs hardcoded values, hence
# why we can't use the aws_region variable.
terraform {
  backend "s3" {
    bucket     = "network-adequacy-terraform"
    key        = "na-testing/terraform.tfstate"
    region     = "us-west-2"

    # ddb table to hold tfstate locks.
    dynamodb_table = "tflock"
  }
}
