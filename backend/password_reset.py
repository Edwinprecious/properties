import secrets  # Built-in Python module for generating secure random tokens
from datetime import datetime, timedelta
import mysql.connector
from werkzeug.security import generate_password_hash

# Database configuration (same as your other files)
DB_NAME = 'real_estate'
DB_USER = 'root'
DB_PASSWORD = 'Udechukwu2002.'
DB_HOST = 'localhost'
DB_PORT = '3306'

def get_db_connection(db_name=DB_NAME):
    """
    Create and return a database connection
    This is the same function you have in other files
    """
    return mysql.connector.connect(
        database=db_name,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )


def generate_reset_token():
    """
    Generate a secure random token (a long random string)
    
    Example output: "a3f5b9c2d8e1f4g7h0j3k6m9n2p5q8r1s4t7u0v3w6x9y2z5"
    
    How it works:
    - secrets.token_urlsafe(32) creates a random string
    - 32 means 32 bytes of randomness (very secure)
    - urlsafe means it's safe to use in URLs (no special characters that break links)
    """
    return secrets.token_urlsafe(32)


def create_reset_token(email):
    """
    Create a password reset token for a user
    
    Parameters:
    - email: User's email address
    
    Returns:
    - (success: bool, message: str, token: str or None)
    
    Example:
    success, message, token = create_reset_token("user@example.com")
    if success:
        print(f"Token created: {token}")
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Step 1: Check if user exists
        cursor.execute("SELECT id FROM valerie WHERE email = %s", (email,))
        user = cursor.fetchone()
        
        # If user doesn't exist, return error
        if not user:
            cursor.close()
            conn.close()
            return False, "Email not found", None
        
        user_id = user['id']
        
        # Step 2: Delete any old tokens for this user
        # Why? User might have requested reset multiple times
        # We only want the latest token to work
        cursor.execute("DELETE FROM password_reset_tokens WHERE user_id = %s", (user_id,))
        
        # Step 3: Generate new token
        token = generate_reset_token()
        
        # Step 4: Calculate expiry time (1 hour from now)
        expires_at = datetime.now() + timedelta(hours=1)
        
        # Step 5: Save token to database
        cursor.execute("""
            INSERT INTO password_reset_tokens (user_id, token, expires_at)
            VALUES (%s, %s, %s)
        """, (user_id, token, expires_at))
        
        # Step 6: Save changes to database
        conn.commit()
        cursor.close()
        conn.close()
        
        return True, "Reset token created", token
    
    except Exception as e:
        print(f"Error creating reset token: {e}")
        return False, "Something went wrong", None


def verify_reset_token(token):
    """
    Verify if a reset token is valid
    
    Parameters:
    - token: The token from the reset link
    
    Returns:
    - (valid: bool, user_id: int or None, message: str)
    
    A token is valid if:
    1. It exists in the database
    2. It hasn't expired yet
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get token from database
        cursor.execute("""
            SELECT user_id, expires_at 
            FROM password_reset_tokens 
            WHERE token = %s
        """, (token,))
        
        token_data = cursor.fetchone()
        cursor.close()
        conn.close()
        
        # Check if token exists
        if not token_data:
            return False, None, "Invalid token"
        
        # Check if token has expired
        if datetime.now() > token_data['expires_at']:
            return False, None, "Token has expired"
        
        # Token is valid!
        return True, token_data['user_id'], "Token is valid"
    
    except Exception as e:
        print(f"Error verifying token: {e}")
        return False, None, "Something went wrong"


def reset_password_with_token(token, new_password):
    """
    Reset user's password using a valid token
    
    Parameters:
    - token: The token from the reset link
    - new_password: The new password (plain text - will be hashed)
    
    Returns:
    - (success: bool, message: str)
    """
    try:
        # Step 1: Verify token is valid
        valid, user_id, message = verify_reset_token(token)
        
        if not valid:
            return False, message
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Step 2: Hash the new password
        # Why hash? Store passwords securely (never store plain text!)
        hashed_password = generate_password_hash(new_password)
        
        # Step 3: Update user's password
        cursor.execute("""
            UPDATE valerie 
            SET password = %s 
            WHERE id = %s
        """, (hashed_password, user_id))
        
        # Step 4: Delete the used token (can't use same token twice!)
        cursor.execute("""
            DELETE FROM password_reset_tokens 
            WHERE token = %s
        """, (token,))
        
        # Step 5: Save changes
        conn.commit()
        cursor.close()
        conn.close()
        
        return True, "Password reset successful"
    
    except Exception as e:
        print(f"Error resetting password: {e}")
        return False, "Something went wrong"


def clean_expired_tokens():
    """
    Delete all expired tokens from database
    This should run periodically (like a cleanup job)
    
    Why? Keep database clean and remove old unused tokens
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Delete tokens where expires_at is in the past
        cursor.execute("""
            DELETE FROM password_reset_tokens 
            WHERE expires_at < NOW()
        """)
        
        deleted_count = cursor.rowcount
        conn.commit()
        cursor.close()
        conn.close()
        
        print(f"Cleaned up {deleted_count} expired tokens")
        return True
    
    except Exception as e:
        print(f"Error cleaning tokens: {e}")
        return False