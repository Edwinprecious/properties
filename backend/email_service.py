from flask_mail import Mail, Message
from flask import current_app
# from flask import Flask

# import app

mail = Mail()

def init_mail(app):
    """Initialize Flask-Mail with app"""
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # or your SMTP server
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    app.config['MAIL_USERNAME'] = 'preciouse157@gmail.com'  # Your email
    app.config['MAIL_PASSWORD'] = 'yali fvxd swmo yjhl'  # Your email password or app password
    app.config['MAIL_DEFAULT_SENDER'] = 'preciouse157@gmail.com'
    
    mail.init_app(app)

def send_inquiry_notification(user_data, property_data, inquiry_message):
    """
    Send email notification when a user submits an inquiry
    """
    try:
        # Email to admin
        admin_subject = f"New Inquiry: {property_data['title']}"
        admin_body = f"""
        <h2>New Property Inquiry</h2>
        <p><strong>Property:</strong> {property_data['title']}</p>
        <p><strong>Location:</strong> {property_data['location']}</p>
        <p><strong>Price:</strong> ₦{property_data['price']:,.2f}</p>
        
        <h3>User Details:</h3>
        <p><strong>Name:</strong> {user_data.get('name', 'N/A')}</p>
        <p><strong>Email:</strong> {user_data.get('email', 'N/A')}</p>
        <p><strong>Phone:</strong> {user_data.get('phone', 'N/A')}</p>
        
        <h3>Message:</h3>
        <p>{inquiry_message}</p>
        
        <p><em>Sent from your Real Estate Platform</em></p>
        """
        
        admin_msg = Message(
            subject=admin_subject,
            recipients=['christiandelson293@gmail.com'],  # Admin email
            html=admin_body
        )
        mail.send(admin_msg)
        
        # Confirmation email to user
        user_subject = f"Inquiry Received: {property_data['title']}"
        user_body = f"""
        <h2>Thank You for Your Inquiry!</h2>
        <p>Dear {user_data.get('name', 'Valued Customer')},</p>
        
        <p>We have received your inquiry about the following property:</p>
        
        <h3>{property_data['title']}</h3>
        <p><strong>Location:</strong> {property_data['location']}</p>
        <p><strong>Price:</strong> ₦{property_data['price']:,.2f}</p>
        
        <h3>Your Message:</h3>
        <p>{inquiry_message}</p>
        
        <p>Our team will review your inquiry and get back to you within 24-48 hours.</p>
        
        <p>Best regards,<br>
        Real Estate Team</p>
        """
        
        user_msg = Message(
            subject=user_subject,
            recipients=[user_data.get('email')],
            html=user_body
        )
        mail.send(user_msg)
        
        return True, "Emails sent successfully"
    
    except Exception as e:
        print(f"Error sending email: {e}")
        return False, str(e)

def send_welcome_email(user_email, user_name):
    """Send welcome email to new users"""
    try:
        subject = "Welcome to Our Real Estate Platform!"
        body = f"""
        <h2>Welcome, {user_name}!</h2>
        <p>Thank you for joining our real estate platform.</p>
        
        <h3>What you can do:</h3>
        <ul>
            <li>Browse thousands of properties</li>
            <li>Save your favorite listings</li>
            <li>Contact property owners directly</li>
            <li>Get notified about new properties</li>
        </ul>
        
        <p>Start exploring properties today!</p>
        
        <p>Best regards,<br>
        Real Estate Team</p>
        """
        
        msg = Message(
            subject=subject,
            recipients=[user_email],
            html=body
        )
        mail.send(msg)
        
        return True
    except Exception as e:
        print(f"Error sending welcome email: {e}")
        return False



def send_property_alert(user_email, user_name, property_data):

    """Send email alert about a new property matching user's preferences"""
    try:
        subject = f"New Property Alert: {property_data['title']}"
        body = f"""
        <h2>New Property Matching Your Preferences!</h2>
        <p>Hi {user_name},</p>
        
        <p>A new property has been listed that matches your search criteria:</p>
        
        <h3>{property_data['title']}</h3>
        <p><strong>Location:</strong> {property_data['location']}</p>
        <p><strong>Price:</strong> ₦{property_data['price']:,.2f}</p>
        <p><strong>Category:</strong> {property_data['category'].title()}</p>
        
        {f"<p><strong>Bedrooms:</strong> {property_data.get('bedrooms')}</p>" if property_data.get('bedrooms') else ""}
        {f"<p><strong>Bathrooms:</strong> {property_data.get('bathrooms')}</p>" if property_data.get('bathrooms') else ""}
        
        <p>{property_data.get('description', '')[:200]}...</p>
        
        <p><a href="https://yoursite.com/properties/{property_data['slug']}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Property</a></p>
        
        <p>Best regards,<br>
        Real Estate Team</p>
        """
        
        msg = Message(
            subject=subject,
            recipients=[user_email],
            html=body
        )
        mail.send(msg)
        
        return True
    except Exception as e:
        print(f"Error sending property alert: {e}")
        return False
    

def send_password_reset_email(user_email, user_name, reset_token):
    """
    Send password reset email with reset link
    
    Parameters:
    - user_email: Where to send the email
    - user_name: User's name for personalization
    - reset_token: The unique token for this reset request
    """
    try:
        # Create the reset link
        # In production, use your actual domain
        reset_link = f"http://localhost:5000/reset-password?token={reset_token}"
        
        subject = "Reset Your Password"
        
        # HTML email body
        body = f"""
        <h2>Password Reset Request</h2>
        <p>Hi {user_name},</p>
        
        <p>We received a request to reset your password. Click the button below to reset it:</p>
        
        <p style="margin: 30px 0;">
            <a href="{reset_link}" 
               style="background-color: #4CAF50; 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 5px;
                      display: inline-block;">
                Reset Password
            </a>
        </p>
        
        
        
        <p><strong>This link will expire in 1 hour.</strong></p>
        
        <p>If you didn't request this, please ignore this email.</p>
        
        <p>Best regards,<br>
        Real Estate Team</p>
        """
        
        # Create and send email
        msg = Message(
            subject=subject,
            recipients=[user_email],
            html=body,
            # sender=current_app.config['MAIL_DEFAULT_SENDER']
        )
        mail.send(msg)
        
        return True, "Password reset email sent"
    
    except Exception as e:
        print(f"Error sending password reset email: {e}")
        return False, str(e)    
   