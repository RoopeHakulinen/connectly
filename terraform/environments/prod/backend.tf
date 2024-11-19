terraform {
  backend "s3" {
    bucket = "connectly-terraform-state"
    key    = "prod"
    region = "eu-west-1"
  }
}