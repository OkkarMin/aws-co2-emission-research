from typing import Dict
import boto3
import os


def _get_color_table():
    """
    Returns a boto3 client for the DynamoDB table.
    """
    ddb = boto3.resource("dynamodb")

    return ddb.Table(os.environ["DDB_TABLE_NAME"])


def get_all_items() -> Dict:
    """
    Gets all items from the table.
    """
    table = _get_color_table()
    response = table.scan()

    return response


def get_item(color: str) -> Dict:
    """
    Gets an item from the table.
    """
    table = _get_color_table()
    response = table.get_item(Key={"color": color})

    return response


def put_item(item: Dict):
    """
    Adds a new item to the table.
    """
    table = _get_color_table()
    table.put_item(Item=item)


def delete_item(color: str):
    """
    Deletes an item from the table.
    """
    table = _get_color_table()
    table.delete_item(Key={"color": color})
