resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "primary" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.1.0/24"
}

resource "aws_db_subnet_group" "app" {
  name       = "app-${var.environment}"
  subnet_ids = [aws_subnet.primary.id]
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
}


resource "aws_route53_record" "app" {
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = local.environment_domain
  type    = "A"
  alias {
    evaluate_target_health = false
    name                   = aws_lb.main.dns_name
    zone_id                = data.aws_route53_zone.primary.zone_id
  }
}

data "aws_route53_zone" "primary" {
  name = local.top_level_domain
}

resource "aws_security_group" "database" {
  vpc_id      = aws_vpc.main.id
  name_prefix = "app-db-${var.environment}"

  revoke_rules_on_delete = true

  ingress {
    protocol    = "TCP"
    from_port   = 5432
    to_port     = 5432
    cidr_blocks = ["10.0.0.0/16"]
  }
}

resource "aws_security_group" "lb" {
  name   = "connectly-alb-security-group-${var.environment}"
  vpc_id = aws_vpc.main.id

  ingress {
    protocol    = "tcp"
    from_port   = 80
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    protocol    = "tcp"
    from_port   = 443
    to_port     = 443
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_acm_certificate" "cert" {
  domain_name               = local.environment_domain
  subject_alternative_names = ["*.${local.environment_domain}"]
  validation_method         = "DNS"
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate_validation" "validation" {
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [for record in aws_route53_record.app : record.fqdn]
}
