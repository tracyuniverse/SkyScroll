const images = document.querySelectorAll('#imageGrid img');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const startGestureBtn = document.getElementById('startGesture');

let selectedImage = null;
let stream = null;

// Highlight clicked image and prepare for gesture
images.forEach(img => {
  img.addEventListener('click', () => {
    // Deselect others
    images.forEach(i => i.classList.remove('selected'));
    img.classList.add('selected');
    selectedImage = img;

    // Show camera button
    startGestureBtn.style.display = 'inline-block';
  });
});

// Start camera and show video
startGestureBtn.addEventListener('click', () => {
  if (!selectedImage) return;

  navigator.mediaDevices.getUserMedia({ video: true })
    .then((mediaStream) => {
      stream = mediaStream;
      video.srcObject = mediaStream;
      video.style.display = 'block';
      canvas.style.display = 'none';

      // For now, simulate a fake gesture after 3 seconds
      setTimeout(() => {
        handleGesture('swipe up'); // Just a placeholder
      }, 3000);
    })
    .catch((err) => {
      console.error("Camera error:", err);
    });
});

// Placeholder for future model integration
function handleGesture(gesture) {
  console.log(`Detected gesture: ${gesture}`);
  if (!selectedImage) return;

  switch (gesture) {
    case 'swipe up':
      moveImage(selectedImage, 0, -20);
      break;
    case 'swipe down':
      moveImage(selectedImage, 0, 20);
      break;
    case 'zoom in':
      resizeImage(selectedImage, 1.2);
      break;
    case 'zoom out':
      resizeImage(selectedImage, 0.8);
      break;
    default:
      console.log("Unknown gesture");
  }
}

// Move image with CSS transform
function moveImage(img, dx, dy) {
  const prevTransform = img.style.transform || 'translate(0px, 0px)';
  const match = /translate\(([-\d.]+)px, ([-\d.]+)px\)/.exec(prevTransform) || [0, 0, 0];
  const x = parseFloat(match[1]) + dx;
  const y = parseFloat(match[2]) + dy;
  img.style.transform = `translate(${x}px, ${y}px)`;
}

// Resize image
function resizeImage(img, scaleFactor) {
  const prevScale = img.dataset.scale ? parseFloat(img.dataset.scale) : 1;
  const newScale = prevScale * scaleFactor;
  img.dataset.scale = newScale;
  img.style.transform = `scale(${newScale})`;
}
