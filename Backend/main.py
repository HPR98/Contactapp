from flask import Flask, request
from flask_cors import CORS
import sqlite3


app = Flask("__name__")
CORS(app)

@app.route("/get_contacts", methods=["GET"])
def add_contact():
    
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM contacts")
    data = cursor.fetchall()
    
    conn.commit()
    conn.close()
    
    object = {}
    for element in data:
        object[element[0]] = {
            "first_name": element[1],
            "last_name": element[2],
            "email": element[3]
        }
    
    print(object)
    return object, 200





if __name__ == "__main__":
    app.run(debug=True)