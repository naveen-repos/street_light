#lambda iam role
resource "aws_iam_role" "street_light" {
  name = "street_light_role"
  assume_role_policy = file("lambda_policy.json")
}
resource "aws_iam_role_policy_attachment" "db_policy_attachment" {
  role = aws_iam_role.street_light.id
  policy_arn = var.dynamo_db_policy_arn
}
resource "aws_iam_role_policy_attachment" "lambda_basic_excution_policy_attachment" {
  role = aws_iam_role.street_light.id
  policy_arn = var.aws_lambda_basic_excution_policy
}
resource "aws_iam_role_policy_attachment" "cognitoPoweruser" {
  role = aws_iam_role.street_light.id
  policy_arn = var.cognito_power_user_arn
}

resource "aws_iam_role_policy_attachment" "s3_lambda_s3_fullAccess" {
  role = aws_iam_role.street_light.id
  policy_arn = var.s3_policy_arn
}

#api gateway lambda
resource "aws_iam_role" "street_light_api_role" {
      name = "street_light_api_role"
      assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
    {
        "Effect": "Allow",
        "Principal": {
        "Service": "apigateway.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
    }
    ]
}
EOF
}

resource "aws_iam_policy" "street_light_api_policy" {
  name        = "street_light_api_policy"
  description = "Policy For Api Gateway"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "lambda:InvokeFunction"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "api-role-attach" {
  role       = aws_iam_role.street_light_api_role.name
  policy_arn = aws_iam_policy.street_light_api_policy.arn
}