locals {
  region       = "eu-west-1"
  default-zone = "eu-west-1-a"
  images       = {
    app = "441464421690.dkr.ecr.eu-west-1.amazonaws.com/connectly:latest"
  }
}

module "app" {
  source        = "../../modules/app"

  app_image     = local.images.app
  environment   = var.environment
  client_id     = var.client_id
  client_secret = var.client_secret
  vapid_public_key  = var.vapid_public_key
  vapid_private_key = var.vapid_private_key
}