# Infrastructure Management
## Summary
This directory contains configuration files for deploying the Encompass application using AWS resources. This project utilises [Terraform](terraform.io) for managing infrastructure resources.

_TODO: extract references to Bayes Impact specific IDs so that the repo contains a configuration that can be used by others._
## A note on VPCs
When setting up a new environment, it is recommended that you import your existing main VPC:
```bash
terraform import module.stack.aws_vpc.main <your_vpc_arn>
```
