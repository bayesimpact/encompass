variable "app_ami" {
  description = "The AMI ID to use for the application server"
  type        = "string"
  default     = "ami-9549f5ed" # TDS Base Image from 2018-1-10 in us-west-2
}

variable "db_snapshot_id" {
  description = "The snapshot ID to use for initialising the DB server"
  type        = "string"
  default     = "encompass-prod-2018-02-07"
}

variable "env_name" {
  description = "The environment identifier e.g. prod"
  type        = "string"
}

variable "db_id" {
  description = "The RDS instance identifier e.g. philip-test"
  type        = "string"
}

variable "instance_name_tag" {
  description = "The EC2 instance Name tag e.g. na-teddy"
  type        = "string"
}

variable "app_security_group_name" {
  description = "The security group name to use for app servers"
  type        = "string"
  default     = "na_app_sg"
}

variable "db_security_group_name" {
  description = "The security group name to use for DB servers"
  type        = "string"
  default     = "na_db_sg"
}

variable "load_balancer_name" {
  # module.stack.aws_lb.na_app_elb: only alphanumeric characters and hyphens allowed in "name"
  description = "The ELB name to use for app servers"
  type        = "string"
  default     = "na-app-alb"
}

variable "default_subnets" {
  description = "Default subnets in us-west-2 for Bayes Impact default VPC"
  type        = "list"
  default     = ["subnet-ac9498ea", "subnet-7a9d531f"]
}

variable "default_vpc_cidr_block" {
  description = "CIDR block for default us-west-2 Bayes Impact VPC"
  type        = "string"
  default     = "172.31.0.0/16"
}

variable "db_password" {
  description = "The password to use for TDS DB access"
  type        = "string"
}

variable "aws_region" {
  description = "The region to use for the AWS provider"
  type        = "string"
  default     = "us-west-2" # Default to Oregon
}

# Default value is for the nonprod wildcard cert.
variable "ssl_certificate_arn" {
  description = "ARN for SSL cert to use in LBs"
  type        = "string"
  default     = "arn:aws:acm:us-west-2:951168128976:certificate/ff93f488-e4a6-4f0c-b494-755cfdade4ee"
}
