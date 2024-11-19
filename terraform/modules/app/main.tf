locals {
  top_level_domain   = "myconnectlyapp.com"
  environment_domain = "${var.environment}.${local.top_level_domain}"
}