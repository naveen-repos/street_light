resource "aws_dynamodb_table" "street_lights"{
  name = "street_lights"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "PK"
  range_key      = "SK"

  attribute {
    name = "PK"
    type = "S"
  }
  attribute {
    name = "SK"
    type = "S"
  }
#   attribute{
#     name = "createdBy"
#     type = "S"
#   }

#   global_secondary_index {
#     name               = "userName-index"
#     hash_key           = "createdBy"
#     range_key          = "SK"
#     write_capacity     = 0
#     read_capacity      = 0
#     projection_type    = "ALL"
#   }
}