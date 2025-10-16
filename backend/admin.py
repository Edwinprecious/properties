import traceback
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import mysql.connector
from flask_jwt_extended import verify_jwt_in_request, get_jwt

# ==================================
# Blueprint for admin-only routes
# ==================================
admin_bp = Blueprint("admin", __name__)

# Database connection helper
DB_NAME = 'real_estate'
DB_USER = 'root'
DB_PASSWORD = 'Udechukwu2002.'
DB_HOST = 'localhost'
DB_PORT = '3306'

def get_db_connection(db_name=DB_NAME):
    return mysql.connector.connect(
        database=db_name,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )

# ==================================
# Role-based access control
# ==================================
def is_admin():
    """
    Check if the current user is an admin, the role is stored in a custom claim, 
    called "role" and not in "sub" which is the email.
    get_jwt_identity() returns the email; which is the jwt sub claim because it takes 
    just one claim and the extra claims are stored in a dictionary

    """

    identity = get_jwt_identity()
    claims = get_jwt()
    # print("JWT Claims:", claims, "Identity:", identity)
    return identity and claims.get("role") == "admin"

# ==================================
# Admin Routes
# ==================================

# Create property
@admin_bp.route("/api/admin/properties", methods=["POST"])
@jwt_required(optional=True)
def create_property():
    

    # # DEBUGGING
    # try:
    #     verify_jwt_in_request()
    #     claims = get_jwt()
    #     print("JWT Claims:", claims)
    # except Exception as e:
    #     print("JWT Error:", e)
    #     return jsonify({"error": "Invalid token"}), 401


    if not is_admin():
        return jsonify({"error": "Admins only!"}), 403

    print(request.json)
  

    try:
        data = request.json
        title = data.get("title")
        price = data.get("price")
        location = data.get("location")
        address = data.get("address")
        description = data.get("description")
        category = data.get("category")  # NEW: rent, land, airbnb, sell, buy
        status = data.get("status") # NEW: active, sold, rented, occupied
        cover_image = data.get("cover_image")   # single cover image URL
        images = data.get("images", [])         # list of extra image URLs

        # basic validation
        if not title or price is None or not location or not category :
            return jsonify({"error": "title, price, category and location are required"}), 400
        

        # Validate category
        valid_categories = ['rent', 'land', 'airbnb', 'sell', 'buy']
        if category not in valid_categories:
            return jsonify({"error": f"Invalid category. Must be one of: {', '.join(valid_categories)}"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # insert property, include cover_image into image_url column
        cursor.execute("""
            INSERT INTO properties (title, price, location, address, description, category, status, image_url)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (title, price, location, address, description, category, status, cover_image))

        prop_id = cursor.lastrowid

        # insert extra images (if any)
        if images:
            cursor.executemany(
                "INSERT INTO property_images (property_id, image_url) VALUES (%s, %s)",
                [(prop_id, img_url) for img_url in images]
            )

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"status": "success", "property_id": prop_id}), 201

    except Exception as e:
        # log server-side
        print("Error creating property:", e)
        return jsonify({"error": "Something went wrong"}), 500


# Update property
@admin_bp.route("/api/admin/properties/<int:prop_id>", methods=["PUT"])
@jwt_required()
def update_property(prop_id):
    if not is_admin():
        return jsonify({"error": "Admins only!"}), 403

    try:
        # data = request.get_json() or {}
        data = request.get_json()
        title = data.get("title")
        location = data.get("location")
        address = data.get("address")
        price = data.get("price")
        description = data.get("description")
        category = data.get("category")  # NEW: rent, land, airbnb, sell, buy
        status = data.get("status") # NEW: active, sold, rented, occupied
        cover_image = data.get("cover_image")  # cover image URL (saved in properties table)
        images = data.get("images", [])        # extra images list for property_images table

        # Validation
        if not title or not location or price is None or not category:
            return jsonify({"error": "title, location, price and category are required"}), 400
        

        # Validate category
        valid_categories = ['rent', 'land', 'airbnb', 'sell', 'buy']
        if category not in valid_categories:
            return jsonify({"error": f"Invalid category. Must be one of: {', '.join(valid_categories)}"}), 400

        # Connect to DB
        conn = get_db_connection()
        cursor = conn.cursor()

        # Update the main property record
        # Update property with category
        cursor.execute("""
            UPDATE properties 
            SET title=%s, location=%s, address=%s, price=%s, description=%s, category=%s, status=%s, image_url=%s
            WHERE id=%s
        """, (title, location, address, price, description, category, status, cover_image, prop_id))

        
        # Replace old images in property_images table
        cursor.execute("DELETE FROM property_images WHERE property_id = %s", (prop_id,))
        if images:
            cursor.executemany(
                "INSERT INTO property_images (property_id, image_url) VALUES (%s, %s)",
                [(prop_id, img_url) for img_url in images]
            )

        # Save changes
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"status": "success", "message": "Property updated successfully!"}), 200

    except Exception as e:
        traceback.print
        print("Error updating property:", e)
        return jsonify({"error": "Something went wrong on the server"}), 500


# Delete property
@admin_bp.route("/api/admin/properties/<int:prop_id>", methods=["DELETE"])
@jwt_required()
def delete_property(prop_id):
    if not is_admin():
        return jsonify({"error": "Admins only!"}), 403

    # conn = get_db_connection()
    # cursor = conn.cursor()
    # cursor.execute("DELETE FROM properties WHERE id = %s", (prop_id,))
    # conn.commit()
    # cursor.close()
    # conn.close()

    # return jsonify({"message": "Property deleted successfully!"}), 200

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM properties WHERE id = %s", (prop_id,))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"status": "success", "message": "Property deleted successfully!"}), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Something went wrong"}), 500