provider "aws" {
  region = "us-west-1"
}

locals {
  security_group_name = "${var.app_security_group_name}-${var.env_name}"
  load_balancer_name = "${var.load_balancer_name}-${var.env_name}"
}

# Bayes Impact Default VPC.
resource "aws_vpc" "main" {
  cidr_block       = "${var.default_vpc_cidr_block}"
  instance_tenancy = "default"
}

# This is the ec2 instance representing the default app server.
resource "aws_instance" "na_app" {
  # These two attributes are required.
  instance_type                   = "m4.large"
  ami                             = "${var.app_ami}"

  ebs_optimized                   = true
  associate_public_ip_address     = "true"
  availability_zone               = "us-west-1b"
  key_name                        = "na-server"
  monitoring                      = false
  tenancy                         = "default"
  security_groups                 = ["${local.security_group_name}"]

  tags { Name = "${var.instance_name_tag}" }
}

# This is the RDS instance representing the default app DB.
resource "aws_db_instance" "na_db" {
  # These two attributes are required.
  identifier                          = "${var.db_id}"
  instance_class                      = "db.t2.large"

  allocated_storage                   = 40
  auto_minor_version_upgrade          = true
  backup_retention_period             = 7
  copy_tags_to_snapshot               = false
  skip_final_snapshot                 = true
  db_subnet_group_name                = "default"
  engine                              = "postgres"
  engine_version                      = "9.6.3"
  iam_database_authentication_enabled = false
  license_model                       = "postgresql-license"
  monitoring_interval                 = 0
  multi_az                            = false
  name                                = "network_adequacy"
  port                                = 5432
  publicly_accessible                 = true
  snapshot_identifier                 = "encompass-prod-17-1"
  storage_encrypted                   = false
  storage_type                        = "gp2"
  username                            = "tds"
  password                            = "${var.db_password}"
}

# Security group for app server.
resource "aws_security_group" "na_app_sg" {
  name        = "${local.security_group_name}"
  description = "Allow inbound traffic on app ports"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8081
    to_port     = 8081
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Permit everything outbound. Needs to be done explicitly.
  egress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    cidr_blocks     = ["0.0.0.0/0"]
  }

  tags {
    Name = "na_app_sg"
  }
}

# Application load balancer for appserver[s]
resource "aws_lb" "na_app_elb" {
  name                       = "${local.load_balancer_name}"
  internal                   = false
  ip_address_type            = "ipv4"
  load_balancer_type         = "application"
  enable_deletion_protection = true
  idle_timeout               = 60
  security_groups            = ["${aws_security_group.na_app_sg.id}"]

  subnets = "${var.default_subnets}"

  tags {
    Environment = "${var.env_name}"
    Name = "${local.load_balancer_name}"
  }
}

resource "aws_lb_target_group" "na_lb_tg_80" {
  name        = "na-app-tg-80-${var.env_name}"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = "${aws_vpc.main.id}"
  target_type = "instance"
}

resource "aws_lb_target_group_attachment" "na_lb_tga_80" {
  target_group_arn = "${aws_lb_target_group.na_lb_tg_80.arn}"
  target_id        = "${aws_instance.na_app.id}"
  port             = 80
}

resource "aws_lb_listener" "na_app_elb_listener_80" {
  load_balancer_arn = "${aws_lb.na_app_elb.arn}"
  port              = "80"
  protocol          = "HTTP"

  default_action {
    target_group_arn = "${aws_lb_target_group.na_lb_tg_80.arn}"
    type             = "forward"
  }
}

resource "aws_lb_target_group" "na_lb_tg_8080" {
  name        = "na-app-tg-8080-${var.env_name}"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = "${aws_vpc.main.id}"
  target_type = "instance"
}

resource "aws_lb_target_group_attachment" "na_lb_tga_8080" {
  target_group_arn = "${aws_lb_target_group.na_lb_tg_8080.arn}"
  target_id        = "${aws_instance.na_app.id}"
  port             = 8080
}

resource "aws_lb_listener" "na_app_elb_listener_8080" {
  load_balancer_arn = "${aws_lb.na_app_elb.arn}"
  port              = "8080"
  protocol          = "HTTP"

  default_action {
    target_group_arn = "${aws_lb_target_group.na_lb_tg_8080.arn}"
    type             = "forward"
  }
}

resource "aws_lb_target_group" "na_lb_tg_8081" {
  name        = "na-app-tg-8081-${var.env_name}"
  port        = 8081
  protocol    = "HTTP"
  vpc_id      = "${aws_vpc.main.id}"
  target_type = "instance"
}

resource "aws_lb_target_group_attachment" "na_lb_tga_8081" {
  target_group_arn = "${aws_lb_target_group.na_lb_tg_8081.arn}"
  target_id        = "${aws_instance.na_app.id}"
  port             = 8081
}

resource "aws_lb_listener" "na_app_elb_listener_8081" {
  load_balancer_arn = "${aws_lb.na_app_elb.arn}"
  port              = "8081"
  protocol          = "HTTP"

  default_action {
    target_group_arn = "${aws_lb_target_group.na_lb_tg_8081.arn}"
    type             = "forward"
  }
}
