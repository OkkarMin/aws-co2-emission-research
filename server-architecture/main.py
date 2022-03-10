from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel
import os
import psycopg

load_dotenv()
app = FastAPI()

conn_kwargs = {
    "host": os.getenv("HOST"),
    "dbname": os.getenv("DBNAME"),
    "user": os.getenv("USER"),
    "password": os.getenv("PASSWORD"),
    "port": os.getenv("PORT"),
}

connection = psycopg.connect(**conn_kwargs)
cursor = connection.cursor()
cursor.execute(
    """
    CREATE TABLE IF NOT EXISTS colors (
        color varchar (45) NOT NULL,
        rgb varchar (90) NOT NULL,
        PRIMARY KEY (color)
    )
    """
)


class Color(BaseModel):
    color: str
    rgb: str


@app.put("/colors")
def add_color(color: Color):
    cursor.execute(
        "INSERT INTO colors (color, rgb) VALUES (%s, %s)",
        (color.color, color.rgb),
    )

    connection.commit()

    return {
        "color": color.color,
        "rgb": color.rgb,
    }


@app.get("/colors/{color}")
def get_one_color(color: str) -> Color:
    result = cursor.execute(
        "SELECT * FROM colors WHERE color = %s",
        (color,),
    ).fetchone()

    if result is None:
        return ("Not found",)

    color, rgb = result
    return {
        "color": color,
        "rgb": rgb,
    }


@app.get("/colors")
def get_all_color():
    result = []
    rows = cursor.execute("SELECT * FROM colors").fetchall()

    for row in rows:
        color, rgb = row
        result.append(
            {
                "color": color,
                "rgb": rgb,
            }
        )

    return result
