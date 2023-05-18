<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_FILES["image"])) {
        $file = $_FILES["image"];

        // Specify the directory where the file will be saved
        $uploadDirectory = "assets/images/uploads/";

        // Generate a unique filename for the uploaded image
        $filename = uniqid() . "_" . $file["name"];

        // Move the uploaded file to a temporary location
        $tempPath = $file["tmp_name"];

        // Load the image from the temporary path
        $image = imagecreatefromstring(file_get_contents($tempPath));

        // Set the text for the watermark
        $text = "www.abilityclassifieds.com";

        // Set the watermark text color and transparency
        $textColor = imagecolorallocate($image, 255, 255, 0);

         // Set the background color for the watermark text
         $backgroundColor = imagecolorallocatealpha($image, 0, 0, 0,50);

        // Set the font size for the watermark text
        $fontSize = 5;

        // Get the image dimensions
        $imageWidth = imagesx($image);
        $imageHeight = imagesy($image);

        // Calculate the position to place the watermark text
        $textWidth = strlen($text) * imagefontwidth($fontSize) + 20;
        $textHeight = imagefontheight($fontSize) + 20;
        $x = $imageWidth - $textWidth - 10; // 10 pixels from the right edge
        $y = $imageHeight - imagefontheight($fontSize) - 10; // 10 pixels from the bottom edge

         // Add the background color rectangle
         imagefilledrectangle($image, $x, $y, $x + $textWidth, $y + $textHeight, $backgroundColor);

        // Add the text watermark to the image
        imagestring($image, $fontSize, $x, $y, $text, $textColor);

        // Save the watermarked image to the upload directory
        $targetPath = $uploadDirectory . $filename;
        imagepng($image, $targetPath);
        imagedestroy($image);

        // Remove the temporary file
        unlink($tempPath);

        // Display the filename
        echo json_encode(array('status'=>200,'image_path'=>$targetPath));
    } else {
        // No image file was received
        echo "No image file received.";
    }
} else {
    // Invalid request method
    echo "Invalid request.";
}
?>
