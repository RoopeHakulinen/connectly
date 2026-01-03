resource "aws_ecs_cluster" "main" {
  name = "application-${var.environment}"
}

resource "aws_ecs_task_definition" "app" {
  family                   = "connectly-app"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  container_definitions    = jsonencode([
    {
      name         = "app-container",
      image        = var.app_image,
      memory       = 512,
      cpu          = 256,
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
        }
      ],
      environment = [
        {
          "name"  = "DATABASE_URL",
          "value" = "postgresql://${aws_db_instance.app.username}:${aws_db_instance.app.password}@${aws_db_instance.app.address}:${aws_db_instance.app.port}/${aws_db_instance.app.db_name}?schema=public"
        },
        {
          "name"  = "JWT_SIGNING_KEY",
          "value" = random_password.jwt_signing_key.result
        },
        {
          "name"  = "DOMAIN",
          "value" = local.environment_domain
        }
      ],
      secrets = [
        {
          "name"      = "GOOGLE_CLIENT_ID",
          "valueFrom" = aws_secretsmanager_secret.client_id.arn
        },
        {
          "name"      = "GOOGLE_CLIENT_SECRET",
          "valueFrom" = aws_secretsmanager_secret.client_secret.arn
        }
      ],
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/connectly-app-${var.environment}"
          "awslogs-region"        = "eu-west-1"
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}

resource "aws_cloudwatch_log_group" "app_logs" {
  name              = "/ecs/connectly-app-${var.environment}"
  retention_in_days = 30
}

resource "aws_ecs_service" "app" {
  name            = "connectly-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  force_new_deployment  = true
  wait_for_steady_state = true

  network_configuration {
    subnets          = [aws_subnet.primary.id, aws_subnet.secondary.id]
    security_groups  = [aws_security_group.ecs_task.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.connectly.id
    container_name   = "app-container"
    container_port   = 3000
  }

  depends_on = [aws_lb_listener.connectly]
}

resource "random_password" "jwt_signing_key" {
  length  = 32
  special = false
}

resource "aws_secretsmanager_secret" "client_id" {
  name = "${var.environment}-client-id"
}

resource "aws_secretsmanager_secret_version" "client_id" {
  secret_id     = aws_secretsmanager_secret.client_id.id
  secret_string = var.client_id
}

resource "aws_secretsmanager_secret" "client_secret" {
  name = "${var.environment}-client-secret"
}

resource "aws_secretsmanager_secret_version" "client_secret" {
  secret_id     = aws_secretsmanager_secret.client_secret.id
  secret_string = var.client_secret
}


