const imageUpload = document.getElementById('imageUpload');
const preview = document.getElementById('uploadedImagePreview');
const sealImage = document.getElementById('sealImage');

imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file) {
        // Show uploaded image
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Uploaded Image"/>`;
        };
        reader.readAsDataURL(file);

        // Simulate model response by animating seal image to swipe left
        sealImage.classList.remove("animate__animated", "animate__slideOutLeft"); // reset if already animated
        void sealImage.offsetWidth; // reflow trick
        sealImage.classList.add("animate__animated", "animate__slideOutLeft");
    }
});

