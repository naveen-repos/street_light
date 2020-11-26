provider "aws"{
  region     = var.region
}

  terraform {
  backend "s3" {
    bucket = "tf-backend-state-files"
    key    = "street-light/terraform.tfstate"
    region = "ap-south-1"
  }
}