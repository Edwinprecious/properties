from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # enable CORS so frontend can connect

@app.route("/")
def home():
    return {"message": "Backend running"}

if __name__ == "__main__":
    app.run(debug=True, port=5000)
