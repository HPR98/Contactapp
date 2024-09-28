from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3


app = Flask("__name__")
CORS(app)

@app.route("/get_contacts", methods=["GET"])
def get_contacts():
    
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

    return object, 200

@app.route("/add_contact", methods=["POST"])
def add_contact():
    first_name  = request.json.get("first_name")
    last_name = request.json.get("last_name")
    email = request.json.get("email")
    
    print(first_name, last_name, email)
    
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    
    table = "INSERT INTO contacts (first_name, last_name, email) VALUES (?,?,?)"
    
    cursor.execute(table, (first_name, last_name, email))
    
    conn.commit()
    conn.close()
    
    return jsonify({"message": "Contact succesfully added to server"}), 200

@app.route("/delete_contact", methods=["POST"])
def delete_contact():
    data = int(request.json.get("key"))
    
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM contacts WHERE id = ?", (data,))
    
    conn.commit()
    conn.close()
    
    return jsonify({"message": "Contact successfully deleted!"}), 200

@app.route("/edit_contact", methods=["POST"])
def edit_contact():
    key = request.json.get("key")
    first_name = request.json.get("first_name")
    last_name = request.json.get("last_name")
    email = request.json.get("email")
    
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    
    table = f"UPDATE contacts SET first_name = ?, last_name = ?, email = ? WHERE id = {key}"
    
    cursor.execute(table, (first_name, last_name, email))
    conn.commit()
    conn.close()
    
    return jsonify({"message": "Contact succesfully updated!"}), 200


if __name__ == "__main__":
    app.run(debug=True)