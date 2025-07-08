const startButton = document.getElementById('start-camera');
const snapButton = document.getElementById('snap');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Only start camera when user clicks "Show Camera"
startButton.addEventListener('click', () => {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
      video.style.display = 'block';       // Show the video
      snapButton.style.display = 'inline'; // Show the "Take Picture" button
    })
    .catch((err) => {
      console.error('Error accessing the camera:', err);
    });
});

// Take snapshot
snapButton.addEventListener('click', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  canvas.style.display = 'block'; // Show the captured image
});
