module "stack" {
  source        = "../../template"

  # this can be for my test environment
  env_name = "prod"
}

terraform {
  backend "s3" {
    bucket     = "network-adequacy-terraform"
    key        = "na-philip-test/terraform.tfstate"
    region     = "us-west-1"

    # ddb table to hold tfstate locks
    dynamodb_table = "tflock"
  }
}
