import re
import mysql.connector

def generate_slug(title):
    """
    Generate a URL-friendly slug from title
    Example: "Luxury 3-Bedroom Apartment" -> "luxury-3-bedroom-apartment"
    """
    slug = title.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)  # Remove special characters
    slug = re.sub(r'[\s_-]+', '-', slug)  # Replace spaces with hyphens
    slug = re.sub(r'^-+|-+$', '', slug)   # Remove leading/trailing hyphens
    return slug


def get_unique_slug(title, property_id=None, conn=None):
    """
    Generate a unique slug by appending numbers if slug already exists
    Example: "luxury-apartment" -> "luxury-apartment-2" if first one exists
    """
    base_slug = generate_slug(title)
    slug = base_slug
    counter = 1
    
    close_conn = False
    if conn is None:
        DB_NAME = 'real_estate'
        DB_USER = 'root'
        DB_PASSWORD = 'Udechukwu2002.'
        DB_HOST = 'localhost'
        DB_PORT = '3306'
        
        conn = mysql.connector.connect(
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT
        )
        close_conn = True
    
    cursor = conn.cursor()
    
    # Check if slug exists (excluding current property if updating)
    while True:
        if property_id:
            cursor.execute(
                "SELECT id FROM properties WHERE slug = %s AND id != %s",
                (slug, property_id)
            )
        else:
            cursor.execute("SELECT id FROM properties WHERE slug = %s", (slug,))
        
        if cursor.fetchone() is None:
            break
        
        counter += 1
        slug = f"{base_slug}-{counter}"
    
    cursor.close()
    if close_conn:
        conn.close()
    
    return slug