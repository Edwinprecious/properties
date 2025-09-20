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
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            username VARCHAR(100),
            email VARCHAR(100) unique(True),
            password VARCHAR(100),
            phone VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
    ''')


    

    #commit the transaction
    conn.commit()        


except Exception as e:
    print(f"Error: {e}")
 

