from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

# DON'T import blueprints yet - we'll add them later
# from admin import admin_bp
# from user import user_bp

app = Flask(__name__)

# CORS - Allow all origins (for development)
CORS(app, resources={r"/*": {"origins": "*"}})

jwt = JWTManager(app)

app.config["SECRET_KEY"] = 'your-super-secret-key-change-this-in-production'
app.config["JWT_SECRET_KEY"] = 'your-super-secret-key-change-this-in-production'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(hours=24)

# DB config
DB_NAME = 'real_estate'
DB_USER = 'root'
DB_PASSWORD = 'chris@33'
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

@app.route("/api/signup", methods=["POST"])
def signup():
    try:
        data = request.json
        name = data.get("name")
        email = data.get("email")
        phone = data.get("phone")
        password = data.get("password")
        confirm_password = data.get("confirm_password")
        role = data.get("role", "user")

        if not name or not email or not password:
            return jsonify({"status": "error", "message": "Missing required fields"}), 400

        if password != confirm_password:
            return jsonify({"status": "error", "message": "Passwords do not match"}), 400
        
        hashed_pw = generate_password_hash(password)
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO valerie (name, email, password, phone, role)
            VALUES (%s, %s, %s, %s, %s)
        """, (name, email, hashed_pw, phone, role))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"status": "success", "message": f"User {name} registered successfully as {role}!"}), 201

    except Exception as e:
        print("Error:", e)
        return jsonify({"status": "error", "message": "Something went wrong"}), 500

@app.route("/api/login", methods=["POST"])  
def login(): 
    data = request.json 
    email = data.get("email") 
    password = data.get("password")
    
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
    
    if check_password_hash(user["password"], password):
        access_token = create_access_token(
            identity=user["email"],
            additional_claims={"role": user["role"]}
        )
        return jsonify({"access_token": access_token, "role": user["role"], "success": True}), 200

    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/properties', methods=['GET'])
def get_properties():
    category = request.args.get('category')
    status = request.args.get('status', 'active')
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if category and status:
        cursor.execute("SELECT * FROM properties WHERE category = %s AND status = %s", (category, status))
    elif category:
        cursor.execute("SELECT * FROM properties WHERE category = %s", (category,))
    elif status:
        cursor.execute("SELECT * FROM properties WHERE status = %s", (status,))
    else:
        cursor.execute("SELECT * FROM properties")
    
    properties = cursor.fetchall()

    for prop in properties:
        cursor.execute("SELECT image_url FROM property_images WHERE property_id = %s", (prop["id"],))
        images = cursor.fetchall()
        prop["images"] = [img["image_url"] for img in images]

    cursor.close()
    conn.close()

    return jsonify({"data": properties})

@app.route('/api/properties/<int:prop_id>', methods=['GET'])
def get_property(prop_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM properties WHERE id = %s", (prop_id,))
    prop = cursor.fetchone()

    if not prop:
        return jsonify({"error": "Property not found"}), 404

    cursor.execute("SELECT image_url FROM property_images WHERE property_id = %s", (prop_id,))
    images = cursor.fetchall()
    prop["images"] = [img["image_url"] for img in images]

    cursor.close()
    conn.close()

    return jsonify({"data": prop})

@app.route('/api/properties/location/<string:location>', methods=['GET'])
def get_properties_by_location(location):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM properties WHERE location = %s", (location,))
    properties = cursor.fetchall()

    if not properties:
        cursor.close()
        conn.close()
        return jsonify({"data": []})

    property_ids = [prop["id"] for prop in properties]
    format_strings = ','.join(['%s'] * len(property_ids))
    query = f"SELECT property_id, image_url FROM property_images WHERE property_id IN ({format_strings})"
    cursor.execute(query, tuple(property_ids))
    images = cursor.fetchall()

    image_map = {}
    for img in images:
        pid = img["property_id"]
        image_map.setdefault(pid, []).append(img["image_url"])

    for prop in properties:
        prop_id = prop["id"]
        prop["images"] = image_map.get(prop_id, [])
        prop["cover_image"] = prop["images"][0] if prop["images"] else None

    cursor.close()
    conn.close()

    return jsonify({"data": properties}), 200

if __name__ == "__main__":
    app.run(debug=True, port=5001, host='127.0.0.1')