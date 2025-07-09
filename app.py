from flask import Flask, render_template, request, jsonify
import torch
from torchvision import transforms
from PIL import Image
import io
import os
import cv2
import tempfile

app = Flask(__name__)

# Dummy model logic (replace this with your actual model)
class DummyModel:
    def eval(self): pass
    def __call__(self, x): return torch.tensor([[0.1, 0.9]])

model = DummyModel()
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

def extract_frames(video_path, frame_count=5):
    cap = cv2.VideoCapture(video_path)
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frames = []

    for i in range(frame_count):
        cap.set(cv2.CAP_PROP_POS_FRAMES, i * total // frame_count)
        ret, frame = cap.read()
        if ret:
            img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            frames.append(transform(img))
    cap.release()
    return frames

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'video' not in request.files:
        return jsonify({'error': 'No video uploaded'})

    video_file = request.files['video']

    with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_vid:
        video_file.save(temp_vid.name)
        frames = extract_frames(temp_vid.name)

    if not frames:
        return jsonify({'error': 'No frames extracted'})

    input_batch = torch.stack(frames)
    with torch.no_grad():
        outputs = model(input_batch)
        avg_output = outputs.mean(dim=0)
        predicted_class = avg_output.argmax().item()

    os.remove(temp_vid.name)
    return jsonify({'prediction': str(predicted_class)})

if __name__ == '__main__':
    app.run(debug=True)
