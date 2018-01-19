variable "db_password" {
  description = "The password to use for TDS DB access"
  type        = "string"
}

module "stack" {
  source        = "../../template"

  env_name = "tds-qa"
  db_id = "tds-qa"
  instance_name_tag = "tds-qa"
  db_password = "${var.db_password}"
}

# Backend definition can't have interpolation, so unfortunately this does need to be
# duplicated between environment definitions.
terraform {
  backend "s3" {
    bucket     = "network-adequacy-terraform"
    key        = "tds-qa/terraform.tfstate"
    region     = "us-west-1"

    # ddb table to hold tfstate locks.
    dynamodb_table = "tflock"
  }
}
