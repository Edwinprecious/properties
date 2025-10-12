from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
import mysql.connector

#cursor.lastrowid: this is the id of the last row inserted

# ==================================
# Blueprint for user routes
# ==================================
user_bp = Blueprint("user", __name__)

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
# Get current user ID from JWT
# ==================================
def get_current_user_id():
    """
    Extract user ID from JWT token.
    identity = email (from "sub" claim)
    We need to fetch user_id from database using the email
    """
    email = get_jwt_identity()  # This is the email
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id FROM valerie WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if user:
        return user["id"]
    else:
        return None
    


def get_current_user_role():
    """Get user role from JWT claims"""
    claims = get_jwt()
    return claims.get("role")

def get_current_user_info():
    """Get both user_id and role from JWT"""
    email = get_jwt_identity()
    claims = get_jwt()
    role = claims.get("role")


    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, name, email, role FROM valerie WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()


    if user:
        user["role"] = role  # Include JWT role for comparison or logging

    return user
    
      


# ==================================
#  Restrict certain actions by role
# ==================================
def is_user_or_above():
    """Check if user has 'user', 'agent', or 'admin' role"""
    role = get_current_user_role()
    return role in ['user', 'agent', 'admin']

def is_agent_or_above():
    """Check if user has 'agent' or 'admin' role"""
    role = get_current_user_role()
    return role in ['agent', 'admin']

def is_admin():
    """Check if user is admin (same as in admin.py)"""
    claims = get_jwt()
    return claims.get("role") == "admin"



# ==================================
# Favorites Routes
# ==================================

# Add property to favorites
@user_bp.route("/api/favorites", methods=["POST"])
@jwt_required()
def add_favorite():
    try:
        user_id = get_current_user_id()
        role = get_current_user_role()  # Get role from JWT
        
        if not user_id:
            return jsonify({"error": "User not found"}), 404

        data = request.json
        property_id = data.get("property_id")

        if not property_id:
            return jsonify({"error": "property_id is required"}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if property exists
        cursor.execute("SELECT id FROM properties WHERE id = %s", (property_id,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"error": "Property not found"}), 404

        # Add to favorites (UNIQUE constraint will prevent duplicates)
        try:
            cursor.execute(
                "INSERT INTO favorites (user_id, property_id) VALUES (%s, %s)",
                (user_id, property_id)
            )
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({
                "status": "success", 
                "message": "Property added to favorites",
                "user_role": role  # Optional: include role in response
            }), 201
        except mysql.connector.IntegrityError:
            cursor.close()
            conn.close()
            return jsonify({"status": "info", "message": "Property already in favorites"}), 200
        
    except Exception as e:
        print("Error adding favorite:", e)
        return jsonify({"error": "Something went wrong"}), 500
    

# Get user's favorite properties
@user_bp.route("/api/favorites", methods=["GET"])
@jwt_required()
def get_favorites():
    try:
        user_id = get_current_user_id()
        role = get_current_user_role()  # Get role from JWT
        
        if not user_id:
            return jsonify({"error": "User not found"}), 404

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

         # Get all favorited properties with details
        cursor.execute("""
            SELECT p.*, f.created_at as favorited_at
            FROM favorites f
            JOIN properties p ON f.property_id = p.id
            WHERE f.user_id = %s
            ORDER BY f.created_at DESC
        """, (user_id,))
        
        favorites = cursor.fetchall()

         # Attach images for each property
        for prop in favorites:
            cursor.execute(
                "SELECT image_url FROM property_images WHERE property_id = %s",
                (prop["id"],)
            )
            images = cursor.fetchall()
            prop["images"] = [img["image_url"] for img in images]

        cursor.close()
        conn.close()

        return jsonify({
            "data": favorites,
        }), 200
    
    except Exception as e:
        print("Error fetching favorites:", e)
        return jsonify({"error": "Something went wrong"}), 500
    

# Remove property from favorites
@user_bp.route("/api/favorites/<int:property_id>", methods=["DELETE"])
@jwt_required()
def remove_favorite(property_id):
    try:
        user_id = get_current_user_id()
        role = get_current_user_role()  # Get role from JWT
        
        if not user_id:
            return jsonify({"error": "User not found"}), 404

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "DELETE FROM favorites WHERE user_id = %s AND property_id = %s",
            (user_id, property_id)
        )

        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            return jsonify({"error": "Favorite not found"}), 404

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({
            "status": "success", 
            "message": "Property removed from favorites",
            "user_role": role  # Optional: include role in response
        }), 200

    except Exception as e:
        print("Error removing favorite:", e)
        return jsonify({"error": "Something went wrong"}), 500


# Check if a property is favorited by user
@user_bp.route("/api/favorites/check/<int:property_id>", methods=["GET"])
@jwt_required()
def check_favorite(property_id):
    try:
        user_id = get_current_user_id()
        
        if not user_id:
            return jsonify({"error": "User not found"}), 404

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "SELECT id FROM favorites WHERE user_id = %s AND property_id = %s",
            (user_id, property_id)
        )
        
        is_favorited = cursor.fetchone() is not None
        
        cursor.close()
        conn.close()

        return jsonify({"is_favorited": is_favorited}), 200

    except Exception as e:
        print("Error checking favorite:", e)
        return jsonify({"error": "Something went wrong"}), 500


# ==================================
# User Profile Routes (Bonus)
# ==================================

# Get current user profile
@user_bp.route("/api/user/profile", methods=["GET"])
@jwt_required()
def get_user_profile():
    try:
        user_info = get_current_user_info()
        
        if not user_info:
            return jsonify({"error": "User not found"}), 404

        # Remove sensitive data
        user_info.pop("password", None)
        
        return jsonify({"data": user_info}), 200


    except Exception as e:
        print("Error fetching profile:", e)
        return jsonify({"error": "Something went wrong"}), 500        