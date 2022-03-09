from chalice import Chalice
from chalice.app import BadRequestError, NotFoundError
from chalicelib import db

app = Chalice(app_name="color-to-rgb")
app.api.cors = True


@app.route(
    "/colors",
    methods=["PUT"],
)
def add_new_color():
    request_body = app.current_request.json_body

    if not request_body:
        raise BadRequestError("Must provide a JSON body")

    color = request_body.get("color")
    rgb = request_body.get("rgb")

    db.put_item({"color": color, "rgb": rgb})

    return request_body


@app.route(
    "/colors",
    methods=["GET"],
)
def get_all_colors():
    result = db.get_all_items()

    try:
        return result["Items"]
    except KeyError:
        raise NotFoundError(
            f"DynamoDB table seems to be empty. Please add some color for items."
        )


@app.route(
    "/colors/{color_in_string}",
    methods=["GET"],
)
def get_color_to_rgb_decimal(color_in_string):
    result = db.get_item(color_in_string)

    try:
        return result["Item"]
    except KeyError:
        raise NotFoundError(f"No color found for {color_in_string}")


@app.route(
    "/colors/{color_in_string}",
    methods=["DELETE"],
)
def remove_color(color_in_string):
    db.delete_item(color_in_string)

    return {"message": f"Successfully deleted {color_in_string}"}
