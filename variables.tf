# These variables 
variable "region" {
  default = "ap-south-1"
}
variable "dynamo_db_policy_arn" {
  default = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}
variable "aws_lambda_basic_excution_policy" {
  default = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
variable "s3_policy_arn" {
  default = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}

variable "cognito_power_user_arn" {
  default = "arn:aws:iam::aws:policy/AmazonCognitoPowerUser"
}
