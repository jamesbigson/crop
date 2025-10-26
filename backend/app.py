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

# Configure the API (you may also choose to load the API key from the environment)
# genai.configure(api_key='AIzaSyB0zxlzaUXGX_En1vCLspnZXFq9waUL4a8') 
# backuo api

genai.configure(api_key='AIzaSyB0zxlzaUXGX_En1vCLspnZXFq9waUL4a8')

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
                    '''You are an expert at reading pesticide labels for farmers. When given the pesticide label text (which will be supplied after this instruction), return a single short English sentence in this exact style:

    "<PRODUCT NAME> is used on <crop(s)> to control <pest(s) or purpose>."

    Immediately on the next line, provide a Tamil translation that conveys the same meaning (one short sentence). Return plain text only — no JSON, no markdown, no extra commentary, and no additional sentences.

    output rules:
    -explain in two lines only as specified above.
    -Use simple words and short sentences.
    -explain only the name of the product, crops it is used on, and pests or purpose. and ignore the rest of the information.
    - First provide a very short summary in English (2–4 short sentences). Use simple words and short sentences. Mention key risks, basic safe handling actions, required PPE if present, and one-line emergency action.
- Immediately after the English summary, provide the Tamil translation conveying the same meaning and tone (also 2–4 short sentences) using everyday Tamil suitable for farmers.
- Do not include greetings, introductions, numbered lists, or external links unless explicitly requested.
- Provide a separate explanation in must English first, followed by Tamil.

    Example output:
    Katyayani BHASAM BEAUVERIA BASSIANA is used on rice crops to control insect pests.
    கத்தியானி பகசம் BEAUVERIA BASSIANA அரிசி பயிர்களில் பூச்சிகளை கட்டுப்படுத்த பயன்படுத்தப்படுகிறது.

    Now analyze the following label text and produce the two-line bilingual description as specified.'''
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