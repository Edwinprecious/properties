import os
from werkzeug.utils import secure_filename
from PIL import Image
import uuid

# Configuration
UPLOAD_FOLDER ='static/uploads/properties'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
MAX_IMAGE_DIMENSION = 1920  # Max width/height

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def optimize_image(image_path, max_dimension=MAX_IMAGE_DIMENSION):
    """Optimize and resize image"""
    try:
        img = Image.open(image_path)
        
        # Convert RGBA to RGB if necessary
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        
        # Resize if too large
        if img.width > max_dimension or img.height > max_dimension:
            img.thumbnail((max_dimension, max_dimension), Image.Resampling.LANCZOS)
        
        # Save optimized image
        img.save(image_path, quality=85, optimize=True)
        
        return True
    except Exception as e:
        print(f"Error optimizing image: {e}")
        return False

def save_uploaded_image(file):
    """
    Save uploaded image and return the file path
    Returns: (success, message/filepath)
    """
    try:
        # Check if file exists
        if not file:
            return False, "No file provided"
        
        # Check file size
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        
        if file_size > MAX_FILE_SIZE:
            return False, f"File too large. Max size is {MAX_FILE_SIZE / (1024*1024)}MB"
        
        # Check file extension
        if not allowed_file(file.filename):
            return False, f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        
        # Generate unique filename
        original_filename = secure_filename(file.filename)
        file_extension = original_filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
        
        # Ensure upload directory exists
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        
        # Save file
        file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
        file.save(file_path)
        
        # Optimize image
        optimize_image(file_path)
        
        # Return relative path for database storage
        return True, f"/uploads/properties/{unique_filename}"
    
    except Exception as e:
        print(f"Error saving image: {e}")
        return False, "Error saving image"

def delete_image(image_path):
    """Delete an image file"""
    try:
        # Remove leading slash if present
        if image_path.startswith('/'):
            image_path = image_path[1:]
        
        full_path = os.path.join(os.getcwd(), image_path)
        
        if os.path.exists(full_path):
            os.remove(full_path)
            return True
        return False
    except Exception as e:
        print(f"Error deleting image: {e}")
        return False