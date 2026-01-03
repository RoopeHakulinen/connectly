resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_subnet" "primary" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = data.aws_availability_zones.available.names[0]
}

resource "aws_subnet" "secondary" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = data.aws_availability_zones.available.names[1]
}

resource "aws_db_subnet_group" "app" {
  name       = "app-${var.environment}"
  subnet_ids = [aws_subnet.primary.id, aws_subnet.secondary.id]
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
}

resource "aws_route_table_association" "primary" {
  subnet_id      = aws_subnet.primary.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "secondary" {
  subnet_id      = aws_subnet.secondary.id
  route_table_id = aws_route_table.public.id
}


resource "aws_route53_record" "app" {
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = local.environment_domain
  type    = "A"
  alias {
    evaluate_target_health = false
    name                   = aws_lb.main.dns_name
    zone_id                = aws_lb.main.zone_id
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

resource "aws_security_group" "ecs_task" {
  name   = "connectly-ecs-task-${var.environment}"
  vpc_id = aws_vpc.main.id

  ingress {
    protocol        = "tcp"
    from_port       = 3000
    to_port         = 3000
    security_groups = [aws_security_group.lb.id]
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

resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.primary.zone_id
}

resource "aws_acm_certificate_validation" "validation" {
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}
