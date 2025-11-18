import mysql.connector

# Update these with your MySQL credentials
conn = mysql.connector.connect(
    host="localhost",
    user="root",  # Your MySQL username
    password="Udechukwu2002.",  # Your MySQL password
    database="real_estate"  # Your database name
)

cursor = conn.cursor()

try:
    cursor.execute("SELECT id, title, image_url FROM properties")
    properties = cursor.fetchall()
    
    print("\n=== CURRENT PROPERTIES IN DATABASE ===")
    if properties:
        for prop in properties:
            print(f"ID: {prop[0]}")
            print(f"Title: {prop[1]}")
            print(f"Image URL: {prop[2]}")
            print("-" * 50)
    else:
        print("No properties found in database")
        
except Exception as e:
    print(f"Error: {e}")
    print("\nMake sure:")
    print("1. MySQL is running")
    print("2. Database 'real_estate' exists")
    print("3. Table 'properties' exists")

finally:
    cursor.close()
    conn.close()