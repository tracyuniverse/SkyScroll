from flask import Flask, render_template, request, jsonify
import torch
from torchvision import transforms
from PIL import Image
import io

app = Flask(skyscroll)

# Load your trained model
model = torch.load('Gesture_Recongition_Code.ipynb', map_location=torch.device('cpu'))
model.eval()

# Define the preprocessing to match your training
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'})

    file = request.files['image']
    img_bytes = file.read()
    img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
    img = transform(img).unsqueeze(0)

    with torch.no_grad():
        output = model(img)
        predicted_class = output.argmax(dim=1).item()

    return jsonify({'prediction': str(predicted_class)})

if __name__ == '__main__':
    app.run(debug=True)
