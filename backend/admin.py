from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import mysql.connector

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
    identity = get_jwt_identity()
    return identity and identity.get("role") == "admin"

# ==================================
# Admin Routes
# ==================================

# Create property
@admin_bp.route("/api/admin/properties", methods=["POST"])
@jwt_required()
def create_property():
    if not is_admin():
        return jsonify({"error": "Admins only!"}), 403

    # data = request.json
    # title = data.get("title")
    # location = data.get("location")
    # price = data.get("price")
    # address = data.get("address")
    # description = data.get("description")
    # cover_image = data.get("cover_image")  # single cover image
    # images = data.get("images", [])        # list of extra images


    # if not title or not location or not price:
    #     return jsonify({"error": "Missing required fields"}), 400

    # conn = get_db_connection()
    # cursor = conn.cursor()
    # cursor.execute("""
    #     INSERT INTO properties (title, location, price, description, address, image_url)
    #     VALUES (%s, %s, %s, %s)
    # """, (title, location, price, description, address, cover_image))
    # conn.commit()
    # cursor.close()
    # conn.close()

    # return jsonify({"message": "Property created successfully!"}), 201


    try:
        data = request.json
        title = data.get("title")
        price = data.get("price")
        location = data.get("location")
        address = data.get("address")
        description = data.get("description")
        cover_image = data.get("cover_image")   # single cover image URL
        images = data.get("images", [])         # list of extra image URLs

        # basic validation
        if not title or price is None or not location:
            return jsonify({"error": "title, price and location are required"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # insert property, include cover_image into image_url column
        cursor.execute("""
            INSERT INTO properties (title, price, location, address, description, image_url)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (title, price, location, address, description, cover_image))

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

    # data = request.json
    # title = data.get("title")
    # location = data.get("location")
    # price = data.get("price")
    # description = data.get("description")

    # conn = get_db_connection()
    # cursor = conn.cursor()
    # cursor.execute("""
    #     UPDATE properties 
    #     SET title=%s, location=%s, price=%s, description=%s
    #     WHERE id=%s
    # """, (title, location, price, description, prop_id))
    # conn.commit()
    # cursor.close()
    # conn.close()

    # return jsonify({"message": "Property updated successfully!"}), 200


    try:
        data = request.get_json() or {}
        title = data.get("title")
        location = data.get("location")
        address = data.get("address")
        price = data.get("price")
        description = data.get("description")
        cover_image = data.get("cover_image")  # cover image URL (saved in properties table)
        images = data.get("images", [])        # extra images list for property_images table

        # Validation
        if not title or not location or price is None:
            return jsonify({"error": "title, location and price are required"}), 400

        # Connect to DB
        conn = get_db_connection()
        cursor = conn.cursor()

        # Update the main property record
        cursor.execute("""
            UPDATE properties 
            SET title=%s, location=%s, address=%s, price=%s, description=%s, image_url=%s
            WHERE id=%s
        """, (title, location, address, price, description, cover_image, prop_id))

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