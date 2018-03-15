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
  ssl_certificate_arn = "arn:aws:acm:us-west-2:951168128976:certificate/8e85a5c7-4540-4fd5-b4e2-913fc085243a"
}

# Backend definition can't have interpolation, so unfortunately this does need to be
# duplicated between environment definitions. It also needs hardcoded values, hence
# why we can't use the aws_region variable.
terraform {
  backend "s3" {
    bucket     = "encompass-terraform"
    key        = "demo/terraform.tfstate"
    region     = "us-west-2"

    # ddb table to hold tfstate locks.
    dynamodb_table = "tflock"
  }
}
