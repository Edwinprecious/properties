import traceback
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import mysql.connector
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from utils import get_unique_slug  # Add this import at the top
from image_handler import save_uploaded_image, delete_image  # Add this import

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
    if not is_admin():
        return jsonify({"error": "Admins only!"}), 403

    try:
        data = request.json
        title = data.get("title")
        price = data.get("price")
        location = data.get("location")
        address = data.get("address")
        description = data.get("description")
        category = data.get("category")
        status = data.get("status", "active")
        bedrooms = data.get("bedrooms")  # NEW
        bathrooms = data.get("bathrooms")  # NEW
        cover_image = data.get("cover_image")
        images = data.get("images", [])

        # Validation
        if not title or price is None or not location or not category:
            return jsonify({"error": "title, price, category and location are required"}), 400

        # Validate category
        valid_categories = ['rent', 'land', 'airbnb', 'sell', 'buy']
        if category not in valid_categories:
            return jsonify({"error": f"Invalid category. Must be one of: {', '.join(valid_categories)}"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Generate unique slug
        slug = get_unique_slug(title, conn=conn)

        # Insert property with bedrooms and bathrooms
        cursor.execute("""
            INSERT INTO properties (title, slug, price, location, address, description, category, status, bedrooms, bathrooms, image_url)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (title, slug, price, location, address, description, category, status, bedrooms, bathrooms, cover_image))

        prop_id = cursor.lastrowid

        # Insert extra images
        if images:
            cursor.executemany(
                "INSERT INTO property_images (property_id, image_url) VALUES (%s, %s)",
                [(prop_id, img_url) for img_url in images]
            )

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({
            "status": "success", 
            "property_id": prop_id,
            "slug": slug
        }), 201

    except Exception as e:
        print("Error creating property:", e)
        return jsonify({"error": "Something went wrong"}), 500

# Update property
@admin_bp.route("/api/admin/properties/<int:prop_id>", methods=["PUT"])
@jwt_required()
def update_property(prop_id):
    if not is_admin():
        return jsonify({"error": "Admins only!"}), 403

    try:
        data = request.get_json() or {}
        title = data.get("title")
        location = data.get("location")
        address = data.get("address")
        price = data.get("price")
        description = data.get("description")
        category = data.get("category")
        status = data.get("status")
        bedrooms = data.get("bedrooms")  # NEW
        bathrooms = data.get("bathrooms")  # NEW
        cover_image = data.get("cover_image")
        images = data.get("images", [])

        # Validation
        if not title or not location or price is None or not category:
            return jsonify({"error": "title, location, price and category are required"}), 400

        # Validate category
        valid_categories = ['rent', 'land', 'airbnb', 'sell', 'buy']
        if category not in valid_categories:
            return jsonify({"error": f"Invalid category. Must be one of: {', '.join(valid_categories)}"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Generate unique slug
        slug = get_unique_slug(title, property_id=prop_id, conn=conn)

        # Update property with bedrooms and bathrooms
        cursor.execute("""
            UPDATE properties 
            SET title=%s, slug=%s, location=%s, address=%s, price=%s, description=%s, category=%s, status=%s, bedrooms=%s, bathrooms=%s, image_url=%s
            WHERE id=%s
        """, (title, slug, location, address, price, description, category, status, bedrooms, bathrooms, cover_image, prop_id))

        # Replace images
        cursor.execute("DELETE FROM property_images WHERE property_id = %s", (prop_id,))
        if images:
            cursor.executemany(
                "INSERT INTO property_images (property_id, image_url) VALUES (%s, %s)",
                [(prop_id, img_url) for img_url in images]
            )

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({
            "status": "success", 
            "message": "Property updated successfully!",
            "slug": slug
        }), 200

    except Exception as e:
        print("Error updating property:", e)
        return jsonify({"error": "Something went wrong on the server"}), 500

# Delete property
@admin_bp.route("/api/admin/properties/<int:prop_id>", methods=["DELETE"])
@jwt_required()
def delete_property(prop_id):
    if not is_admin():
        return jsonify({"error": "Admins only!"}), 403

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
    

# ==================================
# Admin Inquiry Management Routes
# ==================================

# Get all inquiries (admin only)
@admin_bp.route("/api/admin/inquiries", methods=["GET"])
@jwt_required()
def get_all_inquiries():
    if not is_admin():
        return jsonify({"error": "Admins only!"}), 403

    try:
        status = request.args.get('status')  # Filter by status: pending, responded, closed
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        if status:
            cursor.execute("""
                SELECT 
                    i.*,
                    p.title as property_title,
                    p.location as property_location,
                    u.name as user_name_db,
                    u.email as user_email_db
                FROM inquiries i
                JOIN properties p ON i.property_id = p.id
                JOIN valerie u ON i.user_id = u.id
                WHERE i.status = %s
                ORDER BY i.created_at DESC
            """, (status,))
        else:
            cursor.execute("""
                SELECT 
                    i.*,
                    p.title as property_title,
                    p.location as property_location,
                    u.name as user_name_db,
                    u.email as user_email_db
                FROM inquiries i
                JOIN properties p ON i.property_id = p.id
                JOIN valerie u ON i.user_id = u.id
                ORDER BY i.created_at DESC
            """)
        
        inquiries = cursor.fetchall()
        cursor.close()
        conn.close()

        return jsonify({"data": inquiries}), 200

    except Exception as e:
        print("Error fetching inquiries:", e)
        return jsonify({"error": "Something went wrong"}), 500


# Update inquiry status (admin only)
@admin_bp.route("/api/admin/inquiries/<int:inquiry_id>", methods=["PUT"])
@jwt_required()
def update_inquiry_status(inquiry_id):
    if not is_admin():
        return jsonify({"error": "Admins only!"}), 403

    try:
        data = request.json
        status = data.get("status")

        # Validate status
        valid_statuses = ['pending', 'responded', 'closed']
        if status not in valid_statuses:
            return jsonify({"error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "UPDATE inquiries SET status = %s WHERE id = %s",
            (status, inquiry_id)
        )

        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            return jsonify({"error": "Inquiry not found"}), 404

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({
            "status": "success",
            "message": "Inquiry status updated successfully"
        }), 200

    except Exception as e:
        print("Error updating inquiry:", e)
        return jsonify({"error": "Something went wrong"}), 500


# Delete inquiry (admin only)
@admin_bp.route("/api/admin/inquiries/<int:inquiry_id>", methods=["DELETE"])
@jwt_required()
def admin_delete_inquiry(inquiry_id):
    if not is_admin():
        return jsonify({"error": "Admins only!"}), 403

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM inquiries WHERE id = %s", (inquiry_id,))

        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            return jsonify({"error": "Inquiry not found"}), 404

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({
            "status": "success",
            "message": "Inquiry deleted successfully"
        }), 200

    except Exception as e:
        print("Error deleting inquiry:", e)
        return jsonify({"error": "Something went wrong"}), 500    
    

# ==================================
# Admin Dashboard Statistics
# ==================================

@admin_bp.route("/api/admin/dashboard/stats", methods=["GET"])
@jwt_required()
def get_dashboard_stats():
    if not is_admin():
        return jsonify({"error": "Admins only!"}), 403

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # ========== PROPERTY STATISTICS ==========
        
        # Total properties
        cursor.execute("SELECT COUNT(*) as total FROM properties")
        total_properties = cursor.fetchone()['total']

        # Properties by category
        cursor.execute("""
            SELECT category, COUNT(*) as count 
            FROM properties 
            GROUP BY category
        """)
        properties_by_category = cursor.fetchall()

        # Properties by status
        cursor.execute("""
            SELECT status, COUNT(*) as count 
            FROM properties 
            GROUP BY status
        """)
        properties_by_status = cursor.fetchall()

        # Total property value
        cursor.execute("SELECT SUM(price) as total_value FROM properties WHERE status = 'active'")
        total_property_value = cursor.fetchone()['total_value'] or 0

        # ========== USER STATISTICS ==========
        
        # Total users
        cursor.execute("SELECT COUNT(*) as total FROM valerie")
        total_users = cursor.fetchone()['total']

        # Users by role
        cursor.execute("""
            SELECT role, COUNT(*) as count 
            FROM valerie 
            GROUP BY role
        """)
        users_by_role = cursor.fetchall()

        # Recent users (last 5)
        cursor.execute("""
            SELECT id, name, email, role, created_at 
            FROM valerie 
            ORDER BY created_at DESC 
            LIMIT 5
        """)
        recent_users = cursor.fetchall()

        # ========== INQUIRY STATISTICS ==========
        
        # Total inquiries
        cursor.execute("SELECT COUNT(*) as total FROM inquiries")
        total_inquiries = cursor.fetchone()['total']

        # Inquiries by status
        cursor.execute("""
            SELECT status, COUNT(*) as count 
            FROM inquiries 
            GROUP BY status
        """)
        inquiries_by_status = cursor.fetchall()

        # Recent inquiries (last 5)
        cursor.execute("""
            SELECT 
                i.id,
                i.message,
                i.status,
                i.created_at,
                u.name as user_name,
                u.email as user_email,
                p.title as property_title
            FROM inquiries i
            JOIN valerie u ON i.user_id = u.id
            JOIN properties p ON i.property_id = p.id
            ORDER BY i.created_at DESC
            LIMIT 5
        """)
        recent_inquiries = cursor.fetchall()

        # ========== FAVORITES STATISTICS ==========
        
        # Total favorites
        cursor.execute("SELECT COUNT(*) as total FROM favorites")
        total_favorites = cursor.fetchone()['total']

        # Most favorited properties
        cursor.execute("""
            SELECT 
                p.id,
                p.title,
                p.location,
                p.price,
                p.slug,
                COUNT(f.id) as favorite_count
            FROM properties p
            JOIN favorites f ON p.id = f.property_id
            GROUP BY p.id
            ORDER BY favorite_count DESC
            LIMIT 5
        """)
        most_favorited_properties = cursor.fetchall()

        # ========== LOCATION STATISTICS ==========
        
        # Properties by location
        cursor.execute("""
            SELECT location, COUNT(*) as count 
            FROM properties 
            GROUP BY location 
            ORDER BY count DESC 
            LIMIT 10
        """)
        properties_by_location = cursor.fetchall()

        # ========== RECENT ACTIVITIES ==========
        
        # Recent properties (last 5)
        cursor.execute("""
            SELECT id, title, slug, price, location, category, status, created_at 
            FROM properties 
            ORDER BY created_at DESC 
            LIMIT 5
        """)
        recent_properties = cursor.fetchall()

        cursor.close()
        conn.close()

        # ========== BUILD RESPONSE ==========
        return jsonify({
            "properties": {
                "total": total_properties,
                "by_category": properties_by_category,
                "by_status": properties_by_status,
                "total_value": float(total_property_value),
                "recent": recent_properties
            },
            "users": {
                "total": total_users,
                "by_role": users_by_role,
                "recent": recent_users
            },
            "inquiries": {
                "total": total_inquiries,
                "by_status": inquiries_by_status,
                "recent": recent_inquiries
            },
            "favorites": {
                "total": total_favorites,
                "most_favorited": most_favorited_properties
            },
            "locations": {
                "top_locations": properties_by_location
            }
        }), 200

    except Exception as e:
        print("Error fetching dashboard stats:", e)
        return jsonify({"error": "Something went wrong"}), 500


# ==================================
# Additional Admin Stats Endpoints
# ==================================

# Get monthly statistics (growth over time)
@admin_bp.route("/api/admin/dashboard/monthly-stats", methods=["GET"])
@jwt_required()
def get_monthly_stats():
    if not is_admin():
        return jsonify({"error": "Admins only!"}), 403

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Properties added per month (last 6 months)
        cursor.execute("""
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m') as month,
                COUNT(*) as count
            FROM properties
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY month
            ORDER BY month ASC
        """)
        properties_per_month = cursor.fetchall()

        # Users registered per month (last 6 months)
        cursor.execute("""
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m') as month,
                COUNT(*) as count
            FROM valerie
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY month
            ORDER BY month ASC
        """)
        users_per_month = cursor.fetchall()

        # Inquiries per month (last 6 months)
        cursor.execute("""
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m') as month,
                COUNT(*) as count
            FROM inquiries
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY month
            ORDER BY month ASC
        """)
        inquiries_per_month = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify({
            "properties_growth": properties_per_month,
            "users_growth": users_per_month,
            "inquiries_growth": inquiries_per_month
        }), 200

    except Exception as e:
        print("Error fetching monthly stats:", e)
        return jsonify({"error": "Something went wrong"}), 500


# Get specific property statistics
@admin_bp.route("/api/admin/dashboard/property-stats/<int:prop_id>", methods=["GET"])
@jwt_required()
def get_property_stats(prop_id):
    if not is_admin():
        return jsonify({"error": "Admins only!"}), 403

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Get property details
        cursor.execute("SELECT * FROM properties WHERE id = %s", (prop_id,))
        property_data = cursor.fetchone()

        if not property_data:
            cursor.close()
            conn.close()
            return jsonify({"error": "Property not found"}), 404

        # Count favorites
        cursor.execute(
            "SELECT COUNT(*) as favorite_count FROM favorites WHERE property_id = %s",
            (prop_id,)
        )
        favorite_count = cursor.fetchone()['favorite_count']

        # Count inquiries
        cursor.execute(
            "SELECT COUNT(*) as inquiry_count FROM inquiries WHERE property_id = %s",
            (prop_id,)
        )
        inquiry_count = cursor.fetchone()['inquiry_count']

        # Get recent inquiries for this property
        cursor.execute("""
            SELECT 
                i.id,
                i.message,
                i.status,
                i.created_at,
                u.name as user_name,
                u.email as user_email
            FROM inquiries i
            JOIN valerie u ON i.user_id = u.id
            WHERE i.property_id = %s
            ORDER BY i.created_at DESC
            LIMIT 5
        """, (prop_id,))
        recent_inquiries = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify({
            "property": property_data,
            "stats": {
                "favorite_count": favorite_count,
                "inquiry_count": inquiry_count
            },
            "recent_inquiries": recent_inquiries
        }), 200

    except Exception as e:
        print("Error fetching property stats:", e)
        return jsonify({"error": "Something went wrong"}), 500


# Get user activity stats
@admin_bp.route("/api/admin/dashboard/user-stats/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user_stats(user_id):
    if not is_admin():
        return jsonify({"error": "Admins only!"}), 403

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Get user details
        cursor.execute("SELECT id, name, email, phone, role, created_at FROM valerie WHERE id = %s", (user_id,))
        user_data = cursor.fetchone()

        if not user_data:
            cursor.close()
            conn.close()
            return jsonify({"error": "User not found"}), 404

        # Count favorites
        cursor.execute(
            "SELECT COUNT(*) as favorite_count FROM favorites WHERE user_id = %s",
            (user_id,)
        )
        favorite_count = cursor.fetchone()['favorite_count']

        # Count inquiries
        cursor.execute(
            "SELECT COUNT(*) as inquiry_count FROM inquiries WHERE user_id = %s",
            (user_id,)
        )
        inquiry_count = cursor.fetchone()['inquiry_count']

        # Get user's favorites with property details
        cursor.execute("""
            SELECT 
                p.id,
                p.title,
                p.slug,
                p.price,
                p.location,
                f.created_at as favorited_at
            FROM favorites f
            JOIN properties p ON f.property_id = p.id
            WHERE f.user_id = %s
            ORDER BY f.created_at DESC
            LIMIT 5
        """, (user_id,))
        recent_favorites = cursor.fetchall()

        # Get user's inquiries
        cursor.execute("""
            SELECT 
                i.id,
                i.message,
                i.status,
                i.created_at,
                p.title as property_title,
                p.slug as property_slug
            FROM inquiries i
            JOIN properties p ON i.property_id = p.id
            WHERE i.user_id = %s
            ORDER BY i.created_at DESC
            LIMIT 5
        """, (user_id,))
        recent_inquiries = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify({
            "user": user_data,
            "stats": {
                "favorite_count": favorite_count,
                "inquiry_count": inquiry_count
            },
            "recent_favorites": recent_favorites,
            "recent_inquiries": recent_inquiries
        }), 200

    except Exception as e:
        print("Error fetching user stats:", e)
        return jsonify({"error": "Something went wrong"}), 500    
    
# Upload single image
@admin_bp.route("/api/admin/upload-image", methods=["POST"])
@jwt_required()
def upload_image():
    if not is_admin():
        return jsonify({"error": "Admins only!"}), 403
    
    try:
        # Check if file is in request
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
        
        file = request.files['image']
        
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Save image
        success, result = save_uploaded_image(file)
        
        if success:
            return jsonify({
                "status": "success",
                "message": "Image uploaded successfully",
                "image_url": result
            }), 201
        else:
            return jsonify({"error": result}), 400
    
    except Exception as e:
        print("Error uploading image:", e)
        return jsonify({"error": "Something went wrong"}), 500


# Upload multiple images
@admin_bp.route("/api/admin/upload-images", methods=["POST"])
@jwt_required()
def upload_multiple_images():
    if not is_admin():
        return jsonify({"error": "Admins only!"}), 403
    
    try:
        # Check if files are in request
        if 'images' not in request.files:
            return jsonify({"error": "No image files provided"}), 400
        
        files = request.files.getlist('images')
        
        if not files:
            return jsonify({"error": "No files selected"}), 400
        
        uploaded_images = []
        errors = []
        
        for file in files:
            if file.filename == '':
                continue
            
            success, result = save_uploaded_image(file)
            
            if success:
                uploaded_images.append(result)
            else:
                errors.append(f"{file.filename}: {result}")
        
        if uploaded_images:
            return jsonify({
                "status": "success",
                "message": f"Uploaded {len(uploaded_images)} image(s)",
                "image_urls": uploaded_images,
                "errors": errors if errors else None
            }), 201
        else:
            return jsonify({
                "error": "No images were uploaded",
                "details": errors
            }), 400
    
    except Exception as e:
        print("Error uploading images:", e)
        return jsonify({"error": "Something went wrong"}), 500


# Delete image
@admin_bp.route("/api/admin/delete-image", methods=["DELETE"])
@jwt_required()
def delete_uploaded_image():
    if not is_admin():
        return jsonify({"error": "Admins only!"}), 403
    
    try:
        data = request.json
        image_url = data.get("image_url")
        
        if not image_url:
            return jsonify({"error": "image_url is required"}), 400
        
        success = delete_image(image_url)
        
        if success:
            return jsonify({
                "status": "success",
                "message": "Image deleted successfully"
            }), 200
        else:
            return jsonify({"error": "Image not found or already deleted"}), 404
    
    except Exception as e:
        print("Error deleting image:", e)
        return jsonify({"error": "Something went wrong"}), 500
