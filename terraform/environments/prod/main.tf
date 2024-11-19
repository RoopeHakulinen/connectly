locals {
  region       = "eu-west-1"
  default-zone = "eu-west-1-a"
  images       = {
    app = "441464421690.dkr.ecr.eu-west-1.amazonaws.com/connectly:latest"
  }
}

module "app" {
  source        = "../../modules/app"
  region        = local.region
  zone          = local.default-zone
  app_image     = local.images.app
  environment   = var.environment
  client_id     = var.client_id
  client_secret = var.client_secret
}