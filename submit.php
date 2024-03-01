<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Récupération des données du formulaire
    $name = $_POST["name"];
    $email = $_POST["email"];
    $message = $_POST["message"];
    
    // Traitement de la pièce jointe
    $attachment = '';
    if (isset($_FILES["attachment"])) {
        $attachment_name = $_FILES["attachment"]["name"];
        $attachment_tmp_name = $_FILES["attachment"]["tmp_name"];
        $attachment_type = $_FILES["attachment"]["type"];
        $attachment_size = $_FILES["attachment"]["size"];
        
        // Vérification et déplacement du fichier téléchargé
        if ($attachment_name && $attachment_size > 0) {
            $upload_dir = 'uploads/';
            $attachment = $upload_dir . basename($attachment_name);
            move_uploaded_file($attachment_tmp_name, $attachment);
        }
    }
    
    // Envoi du message par e-mail
    $to = "votre@email.com";
    $subject = "Nouveau message de $name";
    $headers = "From: $email";
    $body = "Nom: $name\n";
    $body .= "Email: $email\n";
    $body .= "Message:\n$message";
    
    if ($attachment) {
        $file = fopen($attachment, 'rb');
        $data = fread($file, filesize($attachment));
        fclose($file);
        $data = chunk_split(base64_encode($data));
        
        $headers .= "\nMIME-Version: 1.0\n";
        $headers .= "Content-Type: multipart/mixed; boundary=\"separator\"\n";
        $headers .= "Content-Transfer-Encoding: 7bit\n";
        
        $body = "--separator\n";
        $body .= "Content-Type: text/plain; charset
