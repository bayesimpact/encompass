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

terraform {
  backend "s3" {
    bucket     = "network-adequacy-terraform"
    key        = "na-testing/terraform.tfstate"
    region     = "us-west-1"

    # ddb table to hold tfstate locks.
    dynamodb_table = "tflock"
  }
}
