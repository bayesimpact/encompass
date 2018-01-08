module "stack" {
  source        = "../../template"

  # this can be for my test environment
  env_name = "philip-test"
  db_id = "philip-test"
  instance_name_tag = "philip-test"
}

# backend definition can't have interpolation, so unfortunately this does need to be
# duplicated between environment definitions.
terraform {
  backend "s3" {
    bucket     = "network-adequacy-terraform"
    key        = "na-philip-test/terraform.tfstate"
    region     = "us-west-1"

    # ddb table to hold tfstate locks
    dynamodb_table = "tflock"
  }
}
