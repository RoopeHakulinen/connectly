resource "aws_db_instance" "app" {
  allocated_storage         = 10
  engine                    = "postgres"
  engine_version            = "17.1"
  instance_class            = "db.t3.micro"
  db_name                   = "app"
  username                  = "app"
  password                  = random_password.password.result
  vpc_security_group_ids    = [aws_security_group.database.id]
  db_subnet_group_name      = aws_db_subnet_group.app.name
  final_snapshot_identifier = "app-${var.environment}"
  backup_retention_period   = 7
}

resource "random_password" "password" {
  length  = 16
  special = false
}