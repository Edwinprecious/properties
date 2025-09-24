from flask import Flask, request, jsonify
from flask_cors import CORS
# import jwt
import mysql.connector
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity


app = Flask(__name__)
CORS(app)  # enable CORS so frontend can connect
# JWTManager(app)
jwt = JWTManager(app)

app.config["SECRET_KEY"] = 'hghffjk'


# DB config
DB_NAME = 'real_estate'
DB_USER = 'root'
DB_PASSWORD = 'Udechukwu2002.'
DB_HOST = 'localhost'
DB_PORT = '3306'

def get_db_connection(db_name=DB_NAME):
    conn = mysql.connector.connect(
        database=db_name,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    return conn



# @app.route("/")
# def home():
#     return {"message": "Backend running"}


@app.route("/api/signup", methods=["POST"])
def signup():
    try:
        data = request.json
        name = data.get("name")
        email = data.get("email")
        phone = data.get("phone")
        password = data.get("password")
        confirm_password = data.get("confirm_password")
        role = data.get("role")
        print(data)

        # basic validation
        if not name or not email or not password:
            return jsonify({"status": "error", "message": "Missing required fields"}), 400

        if password != confirm_password:
            return jsonify({"status": "error", "message": "Passwords do not match"}), 400
        

        # hash password for security
        hashed_pw = generate_password_hash(password)

        conn = get_db_connection()
        cursor = conn.cursor()

        # insert user into DB
        cursor.execute("""
            INSERT INTO valerie (name, email, password, phone)
            VALUES (%s, %s, %s, %s)
        """, (name, email, hashed_pw, phone))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"status": "success", "message": f"User {name} registered successfully!"}), 201

    except Exception as e:
        print("Error:", e)
        return jsonify({"status": "error", "message": "Something went wrong"}), 500


@app.route("/api/login", methods=["POST"])  
def login(): 
    data = request.json 
    email = data.get("email") 
    password = data.get("password") 
    print(data) 
    if not email or not password: 
        return jsonify({"error": "Email and password required"}), 400 
    conn = get_db_connection() 
    cursor = conn.cursor(dictionary=True) 
    cursor.execute("SELECT * FROM valerie WHERE email = %s", (email,)) 
    user = cursor.fetchone() 
    cursor.close() 
    conn.close() 
    if not user: 
        return jsonify({"error": "User not found"}), 404 
    # check password hash 
    if check_password_hash(user["password"], password):
        access_token = create_access_token(identity=user["email"])
        return jsonify({"access_token": access_token, "success": True}), 200

    return jsonify({"error": "Invalid credentials"}), 401

if __name__ == "__main__":
    app.run(debug=True, port=5000)
