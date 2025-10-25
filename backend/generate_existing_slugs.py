import mysql.connector
from utils import get_unique_slug

DB_NAME = 'real_estate'
DB_USER = 'root' 
DB_PASSWORD = "Udechukwu2002."
DB_HOST = "localhost"
DB_PORT = "3306"

def get_db_connection(db_name=DB_NAME):
    return mysql.connector.connect(
        database=db_name,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )

try:
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Get all properties without slugs
    cursor.execute("SELECT id, title FROM properties WHERE slug IS NULL OR slug = ''")
    properties = cursor.fetchall()

    print(f"Found {len(properties)} properties without slugs. Generating...")

    for prop in properties:
        slug = get_unique_slug(prop["title"], property_id=prop["id"], conn=conn)
        
        cursor.execute("UPDATE properties SET slug = %s WHERE id = %s", (slug, prop["id"]))
        print(f"✓ Generated slug '{slug}' for property ID {prop['id']}: {prop['title']}")

    conn.commit()
    cursor.close()
    conn.close()
    
    print(f"\n✓ Successfully generated slugs for {len(properties)} properties!")

except Exception as e:
    print(f"✗ Error: {e}")