import os
import json
import boto3


def lambda_handler(event, context):
    HTTP_METHOD = event["httpMethod"]
    REQUEST_PATH = event["path"]
    isAllColors = not REQUEST_PATH.replace("/colors", "")
    isSingleColor = not isAllColors

    if HTTP_METHOD == "GET" and isAllColors:
        return _200_response(_get_all_colors())

    if HTTP_METHOD == "GET" and isSingleColor:
        color_to_get = REQUEST_PATH.split("/")[2]

        return _200_response(_get_single_color(color_to_get))

    if HTTP_METHOD in ["POST", "PUT"]:
        REQUEST_BODY = json.loads(event["body"])

        _put_color(REQUEST_BODY)

        return _200_response(REQUEST_BODY)


def _200_response(body):
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        "body": json.dumps(body),
    }


def _get_color_table():
    """
    Returns a boto3 client for the DynamoDB table.
    """
    ddb = boto3.resource("dynamodb")

    return ddb.Table(os.environ["DDB_TABLE_NAME"])


def _get_all_colors():
    """
    Gets all items from the table.
    """
    table = _get_color_table()
    response = table.scan()

    return response["Items"]


def _get_single_color(color: str):
    """
    Gets an item from the table.
    """
    table = _get_color_table()
    response = table.get_item(Key={"color": color})

    return response["Item"]


def _put_color(item):
    """
    Adds a new item to the table.
    """
    table = _get_color_table()
    table.put_item(Item=item)


def _delete_color(color: str):
    """
    Deletes an item from the table.
    """
    table = _get_color_table()
    table.delete_item(Key={"color": color})
