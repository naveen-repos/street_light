resource "aws_api_gateway_rest_api" "street_light_api" {
  name        = "street_light_api"
  description = "This is street_light API for demonstration purposes"
  body        = data.template_file.api_swagger.rendered
}

data "template_file" "api_swagger" {
  template = file("api.yaml")
  vars = {
    execution_role     = aws_iam_role.street_light_api_role.arn
    add_pole          = aws_lambda_function.add_pole.invoke_arn
    get_poles       = aws_lambda_function.get_poles.invoke_arn
    pre_signed_urls  = aws_lambda_function.pre_signed_urls.invoke_arn
    get_villages  =aws_lambda_function.get_villages.invoke_arn
    user_pool_arn = "arn:aws:cognito-idp:ap-south-1:883162859539:userpool/ap-south-1_p95dAzf0l"
  }
}

resource "aws_api_gateway_deployment" "v1" {
  rest_api_id = aws_api_gateway_rest_api.street_light_api.id
  stage_name  = "v1"
  lifecycle {
    create_before_destroy = true
  }
  stage_description = filemd5("api.yaml")
  variables = {
    file_hash = filemd5("api.tf")
  }
}