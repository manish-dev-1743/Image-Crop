$('.image-btn').on('change',function(){
    var reader = new FileReader();
    reader.onload = function(){
      var output = document.getElementById('preview');
      output.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
    $('#exampleModal').modal('show');
});
window.addEventListener('DOMContentLoaded', function () {
  var image = document.getElementById('preview');
  var cropBoxData;
  var canvasData;
  var cropper;

  $('#exampleModal').on('shown.bs.modal', function () {
    cropper = new Cropper(image, {
      autoCropArea: 0.8,
      ready: function () {
        cropper.setCropBoxData(cropBoxData).setCanvasData(canvasData);

        document.getElementById('rotateBtn').addEventListener('click', function () {
          cropper.rotate(90); // Rotate the image 90 degrees clockwise
        });

        // Crop button click event
        document.getElementById('cropBtn').addEventListener('click', function () {
          var croppedCanvas = cropper.getCroppedCanvas();
          // You can now use the cropped canvas to perform further operations or submit the data

          // Example: Convert the cropped canvas to base64 data
          var croppedDataUrl = croppedCanvas.toDataURL();
          
          // Submit the cropped data in a form
          sendImage(croppedDataUrl);
        });
      }
    });
  }).on('hidden.bs.modal', function () {
    cropBoxData = cropper.getCropBoxData();
    canvasData = cropper.getCanvasData();
    cropper.destroy();
  });
});

// Helper function to convert data URL to Blob object
function dataURLToBlob(dataUrl) {
  var arr = dataUrl.split(',');
  var mime = arr[0].match(/:(.*?);/)[1];
  var bstr = atob(arr[1]);
  var n = bstr.length;
  var u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type: mime});
} 

function sendImage(dataUrl) {
  // Convert the data URL to a Blob object
  var blob = dataURLToBlob(dataUrl);

  // Create a FormData object and append the blob to it
  var formData = new FormData();
  formData.append('image', blob, 'image.jpg');

  // Send the AJAX request
  $.ajax({
    url: 'submit.php', // Replace with your server endpoint
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    success: function(response) {
      // Request succeeded
      res = JSON.parse(response);
      if(res.status == 200){
        $('#exampleModal').modal('hide');
        $('#ret-img').attr('src',res.image_path);
      }
      console.log('Image uploaded successfully');
    },
    error: function() {
      // Request failed
      console.log('Image upload failed');
    }
  });
}