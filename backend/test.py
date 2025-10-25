import smtplib

try:
    server = smtplib.SMTP("smtp.office365.com", 587, timeout=10)
    server.starttls()
    server.login("Duffhan0772@hotmail.com", "trrskgckgejgbixl")
    print("SMTP connection successful!")
    server.quit()
except Exception as e:
    print("SMTP connection failed:", e)
