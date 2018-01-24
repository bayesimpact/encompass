variable "db_password" {
  description = "The password to use for TDS DB access"
  type        = "string"
}

module "stack" {
  source        = "../../template"

  env_name = "demo"
  db_id = "demo"
  instance_name_tag = "demo"
  db_password = "${var.db_password}"
}

# Backend definition can't have interpolation, so unfortunately this does need to be
# duplicated between environment definitions.
terraform {
  backend "s3" {
    bucket     = "encompass-terraform"
    key        = "demo/terraform.tfstate"
    region     = "us-west-2"

    # ddb table to hold tfstate locks.
    dynamodb_table = "tflock"
  }
}
