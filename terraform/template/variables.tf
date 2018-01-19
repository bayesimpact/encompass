variable "app_ami" {
  description = "The AMI ID to use for the application server"
  type        = "string"
  default     = "ami-a47477c4" # TDS Base Image from 2018-1-10
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

variable "load_balancer_name" {
  # module.stack.aws_lb.na_app_elb: only alphanumeric characters and hyphens allowed in "name"
  description = "The ELB name to use for app servers"
  type        = "string"
  default     = "na-app-alb"
}

variable "default_subnets" {
  description = "Default subnets in us-west-1 for Bayes Impact default VPC"
  type        = "list"
  default     = ["subnet-825462c4", "subnet-33798e56"]
}

variable "default_vpc_cidr_block" {
  description = "CIDR block for default us-west-1 Bayes Impact VPC"
  type        = "string"
  default     = "172.31.0.0/16"
}

variable "db_password" {
  description = "The password to use for TDS DB access"
  type        = "string"
}
