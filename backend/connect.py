import mysql.connector


DB_NAME= 'real_estate'
DB_USER= 'root' 
DB_PASSWORD="Udechukwu2002."
DB_HOST="localhost"
DB_PORT="3306"


def get_db_connection(db_name=DB_NAME):
    conn = mysql.connector.connect(
        database=db_name,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    return conn


try: 
    #connect to the default 'postgres' database to check for the existence of the target database
    conn = get_db_connection(db_name='mysql')
    conn.autocommit = True
    cursor = conn.cursor()

    #check if the target database exixts 
    cursor.execute(f"SELECT 1 FROM information_schema.schemata WHERE schema_name = '{DB_NAME}'")
    exists = cursor.fetchone()
    if not exists:
        cursor.execute(f'CREATE DATABASE {DB_NAME}')
        print(f"Database {DB_NAME} created successfully.")
    else:
        print(f"Database {DB_NAME} already exists. ")    

    cursor.close()    
    conn.close()

    #connect to the new database to create the table and insert data 
    conn = get_db_connection()
    cursor = conn.cursor()

    #create the db for realestate if it doesn't exist 
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS valerie (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            username VARCHAR(100),
            email VARCHAR(100) unique(True),
            password VARCHAR(255),
            phone VARCHAR(100),
            role ENUM('user', 'admin', 'agent') DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
    ''')

    cursor.execute('''

        CREATE TABLE IF NOT EXISTS properties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        price DECIMAL(15,2) NOT NULL,
        location VARCHAR(100) NOT NULL,
        address VARCHAR(255),
        description TEXT,
        category ENUM('rent', 'land', 'airbnb', 'sell', 'buy') NOT NULL DEFAULT 'sell',
        status ENUM('active', 'sold', 'rented', 'occupied') NOT NULL DEFAULT 'active',
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
                   
    ''')     


    cursor.execute('''

        CREATE TABLE IF NOT EXISTS property_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        property_id INT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
        )           
                   
    ''')
    

#     properties = [
#     {
#         "id": 1,
#         "title": "Luxury Apartment",
#         "price": 120000,
#         "location": "Lagos",
#         "image_url": "http://example.com/apt.jpg",
#         "description": "3-bedroom flat in Lekki"
#     },
#     {
#         "id": 2,
#         "title": "Duplex",
#         "price": 250000,
#         "location": "Abuja",
#         "image_url": "http://example.com/duplex.jpg",
#         "description": "5-bedroom duplex in Maitama"
#     }

# INSERT INTO properties (title, description, price, location)
# VALUES 
# ("Luxury Apartment", "3-bedroom apartment with sea view", 250000.00, "Lagos"),
# ("Cozy Bungalow", "2-bedroom bungalow in a quiet area", 85000.00, "Abuja");
# ]

    #commit the transaction
    conn.commit()        


except Exception as e:
    print(f"Error: {e}")
 

