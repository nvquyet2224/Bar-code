const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Access user's webcam
navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(function (stream) {
    video.srcObject = stream;
    video.setAttribute('playsinline', true); // iOS compatibility
    requestAnimationFrame(tick); // Call tick function to process frames
});

// Function to process each video frame and detect QR code
function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // Set canvas dimensions to match video
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;

        // Draw video frame onto canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get image data from canvas
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Use jsQR to detect QR code in the image data
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
        });

        // If QR code is detected, highlight it
        if (code) {
            drawLine(code.location.topLeftCorner, code.location.topRightCorner, '#FF3B58');
            drawLine(code.location.topRightCorner, code.location.bottomRightCorner, '#FF3B58');
            drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, '#FF3B58');
            drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, '#FF3B58');

            // Optionally: Display the decoded text
            ctx.font = '16px Arial';
            ctx.fillStyle = '#FF3B58';
            ctx.fillText(`QR Code: ${code.data}`, code.location.topLeftCorner.x, code.location.topLeftCorner.y - 10);
        }
    }
    requestAnimationFrame(tick); // Continue processing frames
}

// Helper function to draw lines around the QR code
function drawLine(begin, end, color) {
    ctx.beginPath();
    ctx.moveTo(begin.x, begin.y);
    ctx.lineTo(end.x, end.y);
    ctx.lineWidth = 4;
    ctx.strokeStyle = color;
    ctx.stroke();
}
