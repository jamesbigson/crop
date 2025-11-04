from flask import Flask, json, request, jsonify
from flask_mysqldb import MySQL
import MySQLdb.cursors
import pandas as pd
import joblib
import os
import json
from io import BytesIO

from flask_cors import CORS
import easyocr
from PIL import Image
import io
import google.generativeai as genai
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

# MySQL config
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'james'
app.config['MYSQL_DB'] = 'crop_yeild'

mysql = MySQL(app)

# Load model once at startup
model = joblib.load('crop_yield_model.joblib')

load_dotenv()
# gemini_api_key = os.getenv('GOOGLE_API_KEY')


genai.configure(api_key="AIzaSyCPdsiYh1KeKHbej8VW7HmmCVnd5vABLn8")

# Generation configuration for the Gemini model
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

# Create the Gemini model with your desired settings
model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    generation_config=generation_config,
)

  # allow cross-origin requests from React

# Initialize EasyOCR once
reader = easyocr.Reader(['en'])

def get_top3_crops_json(input_dict, crop_list, pipeline):
    results = []
    for crop in crop_list:
        test_input = input_dict.copy()
        test_input['Crop'] = crop
        sample_df = pd.DataFrame([test_input])
        pred_yield = pipeline.predict(sample_df)[0]
        results.append({'crop': crop, 'predicted_yield': float(pred_yield)})
    # Sort by predicted yield descending and get top 3
    top3 = sorted(results, key=lambda x: x['predicted_yield'], reverse=True)[:3]
    return json.dumps({'top3': top3}, indent=2)


@app.route('/register', methods=['POST'])
def register():
    data = request.json
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    email = data.get('email')
    state = data.get('state')
    password = data.get('password')
    usertype = data.get('usertype')  # e.g., 'farmer', 'policy maker'
    
    cursor = mysql.connection.cursor()

    cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
    account = cursor.fetchone()
    if account:
        return jsonify({'message': 'Account already exists!'}), 409
    cursor.execute('INSERT INTO users (firstname, lastname, email, state, password, usertype) VALUES (%s, %s, %s, %s, %s, %s)',
                   (firstname, lastname, email, state, password, usertype))
    mysql.connection.commit()
    return jsonify({'message': 'Registered successfully!'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute('SELECT * FROM users WHERE email = %s AND password = %s', (email, password))
    account = cursor.fetchone()
    if account:
        return jsonify({'message': 'Login successful!'}), 200
    else:
        return jsonify({'message': 'Invalid credentials!'}), 401

@app.route('/predict', methods=['POST'])
def predict():
    crop_list = ['Small millets', 'Arhar/Tur', 'Bajra', 'Banana', 'Cashewnut',
       'Castor seed', 'Coconut ', 'Coriander', 'Cotton(lint)',
       'Dry chillies', 'Groundnut', 'Jowar', 'Maize', 'Moong(Green Gram)',
       'Onion', 'Ragi', 'Sesamum', 'Sunflower', 'Sweet potato', 'Tapioca',
       'Turmeric', 'Urad', 'Horse-gram', 'Tobacco', 'Black pepper',
       'Cardamom', 'Gram', 'Pulses total', 'Total foodgrain', 'Wheat',
       'Sannhamp', 'Korra', 'Samai', 'Other Cereals & Millets',
       'Other Kharif pulses', 'Rapeseed &Mustard', 'Rice', 'Varagu',
       'Bhindi', 'Brinjal', 'Citrus Fruit', 'Garlic', 'Grapes',
       'Jack Fruit', 'Orange', 'Pome Fruit', 'Cabbage', 'Mango',
       'Dry ginger', 'Arecanut', 'Tomato', 'Potato', 'Pineapple', 'Mesta',
       'Drum Stick', 'Sugarcane', 'Other Vegetables', 'Guar seed']
    
    input_dict = request.json
    json_result = get_top3_crops_json(input_dict, crop_list, model)
    return json_result


# genai.configure(api_key='AIzaSyD4DvfGt1M_gok61Jo3AQELmxZ8QIUGcYw')



# @app.route('/extract-text', methods=['POST'])

@app.route('/capture-text', methods=['POST'])
def extract_text():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    image = request.files['image']
    image_bytes = image.read()
    
    # Open with PIL and ensure RGB
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')

    # Convert PIL Image to NumPy array for EasyOCR
    import numpy as np
    img_np = np.array(img)

    # OCR extraction
    result = reader.readtext(img_np, detail=0)
    text_output = " ".join(result) if result else "No text detected"

    # Get the summary from the Gemini model
    summary = summarize_text(text_output)

    return jsonify({'text': summary})



# Function to summarize text using the Gemini API
def summarize_text(text):
    chat_session = model.start_chat(
        history=[
            {
                "role": "user",
                "parts": [
                    '''You are an agricultural fertilizer expert. You will analyze text extracted from a fertilizer bottle or packaging. 
Your job is to create a helpful bilingual summary for farmers in bullet points.

EVEN IF the label text does not mention some details, you should use your expert agronomy knowledge to include missing information based on:
- Nutrient composition (N, P, K, micronutrients like Zn, Fe, B, etc.)
- Typical crop uses
- Benefits on plant growth and yield
- Deficiency symptoms that the fertilizer helps prevent
- Standard application methods (foliar / soil / drip)
- Typical safety and storage advice

OUTPUT FORMAT (strictly plain text):
First provide 6–10 bullet points in English.
Then provide the same 6–10 bullet points in Tamil.

EACH English point should cover ONE of the following:
• Product name and fertilizer type
• Crops typically used on (e.g., paddy, wheat, vegetables, fruits, cotton)
• Nutrients present and what they do in plants
• Plant benefits (growth, chlorophyll, flowering, yield, quality, rooting)
• Deficiency solved by this fertilizer
• General recommended application method (if unknown: “foliar spray or soil application”)
• General dosage guidance (if unknown: “use as per local expert advice”)
• Basic safety instructions
• Safe storage advice

Tamil bullet points = Simple translation for farmers — same number of points.

RULES:
• No headings like "English" or "Tamil"
• No numbering, only bullet points using "•"
• No marketing claims
• Only useful farmer guidance
• Keep language simple and short

Now analyze the fertilizer label text below and produce the bullet-point summary as specified.'''
                ],
            },
        ],
    )
    response = chat_session.send_message(text)
    return response.text


if __name__ == '__main__':
    app.run(port=5001)


# if __name__ == '__main__':
#     app.run(debug=True)