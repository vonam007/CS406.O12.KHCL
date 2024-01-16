document.addEventListener('DOMContentLoaded', () => {
    const cameraContainer = document.getElementById('cameraContainer');
    const cameraFeed = document.getElementById('cameraFeed');
    const capturedCanvas = document.getElementById('capturedCanvas');

    const talkButton = document.getElementById('btn-b');

    const captureAndDisplay = () => {
        // Create a canvas context
        const context = capturedCanvas.getContext('2d');

        // Set canvas dimensions to match the video feed
        capturedCanvas.width = cameraFeed.videoWidth;
        capturedCanvas.height = cameraFeed.videoHeight;

        // Draw the current frame onto the canvas
        context.drawImage(cameraFeed, 0, 0, cameraFeed.videoWidth, cameraFeed.videoHeight);

        // Get the image data from the canvas
        const imageDataURL = capturedCanvas.toDataURL('image/png');
        const base64ImageWithoutHeader = imageDataURL.split(',')[1];
        // Show the captured image in the cameraContainer
        cameraContainer.style.backgroundImage = `url(${imageDataURL})`;
        cameraContainer.style.backgroundSize = 'contain';
        cameraContainer.style.backgroundRepeat = 'no-repeat';
        cameraContainer.style.backgroundPosition = 'center';

        // Stop all video streams
        cameraFeed.srcObject.getVideoTracks().forEach(track => track.stop());

        talkButton.addEventListener('click', () => {
            const BASE = "http://127.0.0.1:5000"; // Replace with your Flask API URL

            const apiUrl = BASE + "/api/process"; // Replace with your Flask API endpoint


            // Chuyển ảnh thành base64
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: base64ImageWithoutHeader }),
            })
                .then(response => response.blob())
                .then(blob => {
                    let audio = document.getElementById('audio');
                    audio.src = URL.createObjectURL(blob);
                    audio.play();
                    setTimeout(() => {
                        closeButton.click();
                        audio.pause();
                        audio.currentTime = 0;
                    },3000);
                })
                .catch(error => console.error('Error:', error));
        }
        );
    };



// Check if the browser supports getUserMedia
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            // Assign the stream to the video element
            cameraFeed.srcObject = stream;
        })
        .catch((error) => {
            console.error('Error accessing camera:', error);
        });
} else {
    console.error('getUserMedia is not supported in this browser');
}

// Add event listener for the camera button
const captureButton = document.getElementById('btn-a');
const closeButton = document.getElementById('close');
captureButton.addEventListener('click', () => {
    captureAndDisplay();
    cameraFeed.style.display = 'none';
    closeButton.style.display = 'block';

});
closeButton.addEventListener('click', () => {
    cameraFeed.style.display = 'block';
    closeButton.style.display = 'none';
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                // Assign the stream to the video element
                cameraFeed.srcObject = stream;
            })
            .catch((error) => {
                console.error('Error accessing camera:', error);
            });
    } else {
        console.error('getUserMedia is not supported in this browser');
    }
});



    // function sendImageToAPI(base64Image) {
    //     const BASE = "http://127.0.0.1:5000"; // Replace with your Flask API URL

    //     const apiUrl = BASE + "/api/process"; // Replace with your Flask API endpoint

    //     const data = {
    //       image: base64Image,
    //     };

    //     const xhr = new XMLHttpRequest();
    //     xhr.open("POST", apiUrl, true);
    //     xhr.setRequestHeader("Content-Type", "application/json");

    //     xhr.onreadystatechange = function () {
    //         if (xhr.readyState === 4 && xhr.status === 200) {
    //           const response = JSON.parse(xhr.responseText);

    //           if (isJSON(response)) {
    //             console.log("Response is a valid JSON.");
    //             const jsonResponse = JSON.parse(response);
    //             console.log(jsonResponse);
    //             // Process the response as needed
    //             // Tải và phát âm thanh từ địa chỉ nhận được từ backend
    //             const audioPlayer = document.getElementById('audioPlayer');
    //             audioPlayer.src = data.audio_file_path;
    //             console.log(data.audio_file_path);

    //           } else {
    //             console.log("Response is not a valid JSON.");
    //             console.log(response);
    //           }

    //         }
    //       };

    //     const jsonData = JSON.stringify(data);
    //     xhr.send(jsonData);
    //   }
      


});