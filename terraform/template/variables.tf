variable "app_ami" {
  description = "The AMI ID to use for the application server"
  type        = "string"
  default     = "ami-1a033c7a" #todo temp; use something sensible
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
