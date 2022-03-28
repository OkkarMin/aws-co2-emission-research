from fastapi import FastAPI
from pydantic import BaseModel
import sqlite3

app = FastAPI()


class Color(BaseModel):
    color: str
    rgb: str


cursor = sqlite3.connect("colors.db", check_same_thread=False).cursor()
cursor.execute("CREATE TABLE IF NOT EXISTS colors (color TEXT, rgb TEXT)")


@app.put("/colors")
def add_color(color: Color):
    cursor.execute("INSERT INTO colors VALUES (?, ?)", (color.color, color.rgb))

    return {
        "color": color.color,
        "rgb": color.rgb,
    }


@app.get("/colors/{color}")
def get_one_color(color: str) -> Color:
    row = cursor.execute(
        "SELECT color, rgb FROM colors WHERE color = ?", (color,)
    ).fetchone()

    if row is None:
        return ("Not found",)

    color, rgb = row
    return {
        "color": color,
        "rgb": rgb,
    }


@app.get("/colors")
def get_all_color():
    result = []
    rows = cursor.execute("SELECT color, rgb FROM colors").fetchall()

    for row in rows:
        color, rgb = row
        result.append(
            {
                "color": color,
                "rgb": rgb,
            }
        )

    return result
