variable "app_ami" {
  description = "The AMI ID to use for the application server"
  type        = "string"
  default     = "ami-1a033c7a" #todo temp; use something sensible
}

variable "env_name" {
  description = "The environment identifier e.g. prod"
  type        = "string"
}
