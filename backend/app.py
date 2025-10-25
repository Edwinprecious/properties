# import traceback
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
# import jwt
import mysql.connector
from admin import admin_bp
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from user import user_bp
from email_service import init_mail, send_welcome_email, send_password_reset_email, mail
from password_reset import create_reset_token, verify_reset_token, reset_password_with_token
from flask_mail import  Message
from werkzeug.utils import secure_filename
import os
from image_handler import save_uploaded_image


app = Flask(__name__)
CORS(app)  # enable CORS so frontend can connect
# JWTManager(app)
jwt = JWTManager(app)
app.register_blueprint(admin_bp)
app.register_blueprint(user_bp)
init_mail(app) # Initialize email service

# app.config["SECRET_KEY"] = 'hghffjk'

app.config["SECRET_KEY"] = 'your-super-secret-key-change-this-in-production'
app.config["JWT_SECRET_KEY"] = 'your-super-secret-key-change-this-in-production'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(hours=24)  # Token valid for 24 hours
app.config['UPLOAD_FOLDER'] = 'static/images/uploads'
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # 5MB max file size




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
        role = data.get("role", "user")
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
            INSERT INTO valerie (name, email, password, phone, role)
            VALUES (%s, %s, %s, %s, %s)
        """, (name, email, hashed_pw, phone, role))

        conn.commit()
        cursor.close()
        conn.close()

         # Send welcome email (non-blocking)
        try:
            send_welcome_email(email, name)
        except Exception as e:
            print(f"Failed to send welcome email: {e}")
            # Don't fail the signup if email fails

        return jsonify({"status": "success", "message": f"User {name} registered successfully as {role}!"}), 201

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
        # access_token = create_access_token(identity=user["email"])
        # access_token = create_access_token(
        #     identity={"email": str(user["email"]), 
        #         "sub": str(user["email"]), "role": user["role"]})

        access_token = create_access_token(
            identity=user["email"],  # this becomes the "sub"
            additional_claims={"role": user["role"]}  # this becomes a custom claim
        )

        print(access_token)
        return jsonify({"access_token": access_token, "role": user["role"], "success": True}), 200

    return jsonify({"error": "Invalid credentials"}), 401


# Serve uploaded images
@app.route('/uploads/properties/<filename>')
def serve_property_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# =====================================
# PUBLIC ROUTES FOR PROPERTIES FETCHING 
# =====================================
# @app.route('/api/properties2', methods=['GET'])
# def get_properties2():
#     category = request.args.get('category')  # Get category from query params
#     status = request.args.get('status', 'active')  # Default to active properties
    
#     conn = get_db_connection()
#     cursor = conn.cursor(dictionary=True)

#     # Build query based on filters
#     if category and status:
#         cursor.execute("SELECT * FROM properties WHERE category = %s AND status = %s", (category, status))
#     elif category:
#         cursor.execute("SELECT * FROM properties WHERE category = %s", (category,))
#     elif status:
#         cursor.execute("SELECT * FROM properties WHERE status = %s", (status,))
#     else:
#         cursor.execute("SELECT * FROM properties")
    
#     properties = cursor.fetchall()

#     # Attach extra images
#     for prop in properties:
#         cursor.execute("SELECT image_url FROM property_images WHERE property_id = %s", (prop["id"],))
#         images = cursor.fetchall()
#         prop["images"] = [img["image_url"] for img in images]

#     cursor.close()
#     conn.close()

#     return jsonify({"data": properties})


@app.route('/api/properties', methods=['GET'])
def get_properties():
    try:
        # ========== SEARCH PARAMETERS ==========
        search_query = request.args.get('search', '').strip()
        
        # ========== FILTER PARAMETERS ==========
        category = request.args.get('category')  # rent, land, airbnb, sell, buy
        status = request.args.get('status', 'active')  # active, sold, rented, occupied
        location = request.args.get('location')  # Lagos, Abuja, etc.
        
        # Price range
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        
        # Bedrooms and bathrooms
        bedrooms = request.args.get('bedrooms', type=int)
        bathrooms = request.args.get('bathrooms', type=int)
        
        # ========== SORTING PARAMETERS ==========
        sort_by = request.args.get('sort_by', 'created_at')  # price, created_at, title
        sort_order = request.args.get('sort_order', 'DESC')  # ASC or DESC
        
        # Validate sort_order
        if sort_order.upper() not in ['ASC', 'DESC']:
            sort_order = 'DESC'
        
        # Validate sort_by to prevent SQL injection
        allowed_sort_fields = ['price', 'created_at', 'title', 'location']
        if sort_by not in allowed_sort_fields:
            sort_by = 'created_at'
        
        # ========== PAGINATION (OPTIONAL) ==========
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        offset = (page - 1) * per_page
        
        # ========== BUILD QUERY ==========
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Base query
        query = "SELECT * FROM properties WHERE 1=1"
        params = []
        
        # Add search condition
        if search_query:
            query += " AND (title LIKE %s OR description LIKE %s OR location LIKE %s)"
            search_pattern = f"%{search_query}%"
            params.extend([search_pattern, search_pattern, search_pattern])
        
        # Add category filter
        if category:
            query += " AND category = %s"
            params.append(category)
        
        # Add status filter
        if status:
            query += " AND status = %s"
            params.append(status)
        
        # Add location filter
        if location:
            query += " AND location LIKE %s"
            params.append(f"%{location}%")
        
        # Add price range filters
        if min_price is not None:
            query += " AND price >= %s"
            params.append(min_price)
        
        if max_price is not None:
            query += " AND price <= %s"
            params.append(max_price)
        
        # Add bedroom filter
        if bedrooms is not None:
            query += " AND bedrooms >= %s"
            params.append(bedrooms)
        
        # Add bathroom filter
        if bathrooms is not None:
            query += " AND bathrooms >= %s"
            params.append(bathrooms)
        
        # Add sorting
        query += f" ORDER BY {sort_by} {sort_order.upper()}"
        
        # Add pagination
        query += " LIMIT %s OFFSET %s"
        params.extend([per_page, offset])
        
        # Execute query
        cursor.execute(query, params)
        properties = cursor.fetchall()
        
        # Get total count (for pagination info)
        count_query = "SELECT COUNT(*) as total FROM properties WHERE 1=1"
        count_params = []
        
        # Apply same filters to count query
        if search_query:
            count_query += " AND (title LIKE %s OR description LIKE %s OR location LIKE %s)"
            count_params.extend([search_pattern, search_pattern, search_pattern])
        
        if category:
            count_query += " AND category = %s"
            count_params.append(category)
        
        if status:
            count_query += " AND status = %s"
            count_params.append(status)
        
        if location:
            count_query += " AND location LIKE %s"
            count_params.append(f"%{location}%")
        
        if min_price is not None:
            count_query += " AND price >= %s"
            count_params.append(min_price)
        
        if max_price is not None:
            count_query += " AND price <= %s"
            count_params.append(max_price)
        
        if bedrooms is not None:
            count_query += " AND bedrooms >= %s"
            count_params.append(bedrooms)
        
        if bathrooms is not None:
            count_query += " AND bathrooms >= %s"
            count_params.append(bathrooms)
        
        cursor.execute(count_query, count_params)
        total_count = cursor.fetchone()['total']
        
        # Attach images to each property
        for prop in properties:
            cursor.execute("SELECT image_url FROM property_images WHERE property_id = %s", (prop["id"],))
            images = cursor.fetchall()
            prop["images"] = [img["image_url"] for img in images]
        
        cursor.close()
        conn.close()
        
        # Calculate pagination info
        total_pages = (total_count + per_page - 1) // per_page
        
        return jsonify({
            "data": properties,
            "pagination": {
                "current_page": page,
                "per_page": per_page,
                "total_items": total_count,
                "total_pages": total_pages,
                "has_next": page < total_pages,
                "has_prev": page > 1
            }
        }), 200
    
    except Exception as e:
        print("Error fetching properties:", e)
        return jsonify({"error": "Something went wrong"}), 500


# Get property by ID (legacy support)
@app.route('/api/properties/<int:prop_id>', methods=['GET'])
def get_property_by_id(prop_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM properties WHERE id = %s", (prop_id,))
    prop = cursor.fetchone()

    if not prop:
        cursor.close()
        conn.close()
        return jsonify({"error": "Property not found"}), 404

    # Get extra images
    cursor.execute("SELECT image_url FROM property_images WHERE property_id = %s", (prop_id,))
    images = cursor.fetchall()
    prop["images"] = [img["image_url"] for img in images]

    cursor.close()
    conn.close()

    return jsonify({"data": prop})



#get property by slug
@app.route('/api/properties/slug/<string:slug>', methods=['GET'])
def get_property(slug):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM properties WHERE slug = %s", (slug,))
    prop = cursor.fetchone()

    # if not prop:
    #     return jsonify({"error": "Property not found"}), 404
    
    if not prop:
        cursor.close()
        conn.close()
        return jsonify({"error": "Property not found"}), 404

    # get extra images
    cursor.execute("SELECT image_url FROM property_images WHERE property_id = %s", (prop["id"],))
    images = cursor.fetchall()
    prop["images"] = [img["image_url"] for img in images]

    cursor.close()
    conn.close()

    return jsonify({"data": prop})




@app.route('/api/properties/location/<string:location>', methods=['GET'])
def get_properties_by_location(location):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Step 1: Fetch all properties for this location
    cursor.execute("SELECT * FROM properties WHERE location = %s", (location,))
    properties = cursor.fetchall()

    if not properties:
        cursor.close()
        conn.close()
        return jsonify({"data": []})  # No properties found

    # Step 2: Collect all property IDs
    property_ids = [prop["id"] for prop in properties]

    # Step 3: Fetch all images for these properties in one go
    format_strings = ','.join(['%s'] * len(property_ids))
    query = f"SELECT property_id, image_url FROM property_images WHERE property_id IN ({format_strings})"
    cursor.execute(query, tuple(property_ids))
    images = cursor.fetchall()

    # Step 4: Group images by property_id
    image_map = {}
    for img in images:
        pid = img["property_id"]
        image_map.setdefault(pid, []).append(img["image_url"])

    # Step 5: Attach images + cover_image to each property
    for prop in properties:
        prop_id = prop["id"]
        prop["images"] = image_map.get(prop_id, [])
        prop["cover_image"] = prop["images"][0] if prop["images"] else None

    cursor.close()
    conn.close()

    return jsonify({"data": properties}), 200


# Get related/similar properties
@app.route('/api/properties/<int:prop_id>/related', methods=['GET'])
def get_related_properties(prop_id):
    try:
        limit = request.args.get('limit', 6, type=int)  # Default 6 similar properties
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # First, get the current property details
        cursor.execute("SELECT category, location FROM properties WHERE id = %s", (prop_id,))
        current_property = cursor.fetchone()
        
        if not current_property:
            cursor.close()
            conn.close()
            return jsonify({"error": "Property not found"}), 404
        
        category = current_property['category']
        location = current_property['location']
        
        # Find similar properties
        # Priority: Same category AND location > Same category > Same location
        cursor.execute("""
            SELECT *,
                CASE 
                    WHEN category = %s AND location = %s THEN 3
                    WHEN category = %s THEN 2
                    WHEN location = %s THEN 1
                    ELSE 0
                END as relevance_score
            FROM properties 
            WHERE id != %s 
                AND status = 'active'
                AND (category = %s OR location = %s)
            ORDER BY relevance_score DESC, created_at DESC
            LIMIT %s
        """, (category, location, category, location, prop_id, category, location, limit))
        
        related_properties = cursor.fetchall()
        
        # Attach images
        for prop in related_properties:
            cursor.execute("SELECT image_url FROM property_images WHERE property_id = %s", (prop["id"],))
            images = cursor.fetchall()
            prop["images"] = [img["image_url"] for img in images]
        
        cursor.close()
        conn.close()
        
        return jsonify({
            "data": related_properties,
            "total": len(related_properties)
        }), 200
    
    except Exception as e:
        print("Error fetching related properties:", e)
        return jsonify({"error": "Something went wrong"}), 500


# Alternative: Get related properties by slug
@app.route('/api/properties/slug/<string:slug>/related', methods=['GET'])
def get_related_properties_by_slug(slug):
    try:
        limit = request.args.get('limit', 6, type=int)
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get current property by slug
        cursor.execute("SELECT id, category, location FROM properties WHERE slug = %s", (slug,))
        current_property = cursor.fetchone()
        
        if not current_property:
            cursor.close()
            conn.close()
            return jsonify({"error": "Property not found"}), 404
        
        prop_id = current_property['id']
        category = current_property['category']
        location = current_property['location']
        
        # Find similar properties
        cursor.execute("""
            SELECT *,
                CASE 
                    WHEN category = %s AND location = %s THEN 3
                    WHEN category = %s THEN 2
                    WHEN location = %s THEN 1
                    ELSE 0
                END as relevance_score
            FROM properties 
            WHERE id != %s 
                AND status = 'active'
                AND (category = %s OR location = %s)
            ORDER BY relevance_score DESC, created_at DESC
            LIMIT %s
        """, (category, location, category, location, prop_id, category, location, limit))
        
        related_properties = cursor.fetchall()
        
        # Attach images
        for prop in related_properties:
            cursor.execute("SELECT image_url FROM property_images WHERE property_id = %s", (prop["id"],))
            images = cursor.fetchall()
            prop["images"] = [img["image_url"] for img in images]
        
        cursor.close()
        conn.close()
        
        return jsonify({
            "data": related_properties,
            "total": len(related_properties)
        }), 200
    
    except Exception as e:
        print("Error fetching related properties:", e)
        return jsonify({"error": "Something went wrong"}), 500


# Route 1: Request Password Reset (user enters email)
@app.route("/api/forgot-password", methods=["POST"])
def forgot_password():
    """
    User submits their email to request password reset
    
    Frontend sends:
    {
        "email": "user@example.com"
    }
    """
    try:
        data = request.json
        email = data.get("email")
        
        # Validation: Check if email was provided
        if not email:
            return jsonify({"error": "Email is required"}), 400
        
        # Get user from database
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, name FROM valerie WHERE email = %s", (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        
        # Security: Don't reveal if email exists or not
        # Why? Prevents hackers from finding valid emails
        # Always return success message even if email doesn't exist
        if not user:
            return jsonify({
                "status": "success",
                "message": "If that email exists, a reset link has been sent."
            }), 200
        
        # Create reset token
        success, message, token = create_reset_token(email)
        print("Reset token:", token)

        
        if not success:
            return jsonify({"error": message}), 500
        
        # Send reset email
        try:
            send_password_reset_email(email, user['name'], token)
        except Exception as e:
            print(f"Failed to send reset email: {e}")
            return jsonify({"error": "Failed to send reset email"}), 500
        
        
        return jsonify({
            "status": "success",
            "message": "If that email exists, a reset link has been sent. Check your inbox."
        }), 200
    
    
    

    except Exception as e:
        print("Error in forgot password:", e)
        return jsonify({"error": "Something went wrong"}), 500
    




#  Reset Password (user submits new password)
@app.route("/api/reset-password", methods=["POST"])
def reset_password():
    """
    User submits new password with the token
    
    Frontend sends:
    {
        "token": "abc123xyz",
        "new_password": "newPassword123",
        "confirm_password": "newPassword123"
    }
    """
    try:
        data = request.json
        token = data.get("token")
        new_password = data.get("new_password")
        confirm_password = data.get("confirm_password")
        # Validation
        if not token or not new_password or not confirm_password:
            return jsonify({"error": "All fields are required"}), 400
        
        if new_password != confirm_password:
            return jsonify({"error": "Passwords do not match"}), 400
        
        if len(new_password) < 6:
            return jsonify({"error": "Password must be at least 6 characters"}), 400
        
        # Reset password
        success, message = reset_password_with_token(token, new_password)
        
        if success:
            return jsonify({
                "status": "success",
                "message": "Password reset successful. You can now login with your new password."
            }), 200
        else:
            return jsonify({"error": message}), 400
    
    except Exception as e:
        print("Error resetting password:", e)
        return jsonify({"error": "Something went wrong"}), 500


# mail = Mail()

@app.route("/test-email")
def test_email():
    msg = Message(
        subject="Test Email",
        recipients=["your_email@example.com"],  # replace with your email
        body="Hello from Flask!"
    )
    mail.send(msg)
    return "Test email sent!"

if __name__ == "__main__":
    app.run(debug=True, port=5000)


