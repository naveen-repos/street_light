data "archive_file" "add_pole" {
  type        = "zip"
  source_file = "./lambdas/add_pole.js"
  output_path = "./zips/add_pole.zip"
}
data "archive_file" "get_poles" {
  type        = "zip"
  source_file = "./lambdas/get_poles.js"
  output_path = "./zips/get_poles.zip"
}

data "archive_file" "get_villages" {
  type        = "zip"
  source_file = "./lambdas/get_villages.js"
  output_path = "./zips/get_villages.zip"
}
data "archive_file" "pre_signed_urls" {
  type        = "zip"
  source_file = "./lambdas/pre_signed_urls.js"
  output_path = "./zips/pre_signed_urls.zip"
}
data "archive_file" "post_sign_up" {
  type        = "zip"
  source_file = "./lambdas/post_sign_up.js"
  output_path = "./zips/post_sign_up.zip"
}

resource "aws_lambda_function" "add_pole" {
  function_name = "add_pole"
  handler = "add_pole.handler"
  role = aws_iam_role.street_light.arn
  runtime = "nodejs12.x"
  filename = data.archive_file.add_pole.output_path
  source_code_hash = data.archive_file.add_pole.output_base64sha256
  environment {
    variables ={
      TABLE_NAME = aws_dynamodb_table.street_lights.name
    }
  }
}

resource "aws_lambda_function" "get_poles" {
  function_name = "get_poles"
  handler = "get_poles.handler"
  role = aws_iam_role.street_light.arn
  runtime = "nodejs12.x"
  filename = data.archive_file.get_poles.output_path
  source_code_hash = data.archive_file.get_poles.output_base64sha256
  environment {
    variables ={
      TABLE_NAME = aws_dynamodb_table.street_lights.name
    }
  }
}
resource "aws_lambda_function" "get_villages" {
  function_name = "get_villages"
  handler = "get_villages.handler"
  role = aws_iam_role.street_light.arn
  runtime = "nodejs12.x"
  filename = data.archive_file.get_villages.output_path
  source_code_hash = data.archive_file.get_villages.output_base64sha256
  environment {
    variables ={
      TABLE_NAME = aws_dynamodb_table.street_lights.name
    }
  }
}

resource "aws_lambda_function" "pre_signed_urls" {
  function_name = "pre_signed_urls"
  handler = "pre_signed_urls.handler"
  role = aws_iam_role.street_light.arn
  runtime = "nodejs12.x"
  filename = data.archive_file.pre_signed_urls.output_path
  source_code_hash = data.archive_file.pre_signed_urls.output_base64sha256
  environment {
    variables ={
      TABLE_NAME = aws_dynamodb_table.street_lights.name
    }
  }
}


resource "aws_lambda_function" "post_sign_up" {
  function_name = "post_sign_up"
  handler = "post_sign_up.handler"
  role = aws_iam_role.street_light.arn
  runtime = "nodejs12.x"
  filename = data.archive_file.post_sign_up.output_path
  source_code_hash = data.archive_file.post_sign_up.output_base64sha256
  environment {
    variables ={
      TABLE_NAME = aws_dynamodb_table.street_lights.name
    }
  }
}