<?php
/**
 * Created by Stayshine Web Development.
 * Author: Michael Rosata
 * Date: 7/10/15
 */
define('SEND_EMAIL_TO', 'PFeeney13@verizon.net');
define('EMAIL_SUBJECT_LINE', 'Contact from Feeney Welding and Fence form.');


$result = array('success'=>0);

/**
 * Limit tries
 */
if (session_id() == null) {
    session_start();
    //todo: should get IP here too for IP blocking but we don't have time atm.
    $_SESSION['tries'] = 1;
} else {
    $tries = (int)$_SESSION['tries'];
    if ($tries > 9) {
        ob_clean();
        echo json_encode($result);
        exit;
    } else {
        $tries = $tries++;
        $_SESSION['tries'] = $tries;
    }
}
/**
 * My own little honey-pot, try to trip up spammers
 */
if ((isset($_POST['birth-name'])
    && $_POST['birth-name'] != '')) {
    // There is a good chance that this is spam. So lie and tell them successful and special thanks for getting caught!
    ob_clean();
    $result['success'] = 1;
    $result['message']  = 'special thanks!';
} elseif (   isset($_POST['senderFirstName'])
    && isset($_POST['senderLastName'])
    && isset($_POST['senderEmail'])
    && isset($_POST['senderPhone'])
    && isset($_POST['message'])) {

    $sender_first_name = $_POST['senderFirstName'];
    $sender_last_name = $_POST['senderLastName'];
    $sender_email = $_POST['senderEmail'];
    $sender_phone = $_POST['senderPhone'];
    $message = $_POST['message'];

    $email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';
    $string_exp = "/^[A-Za-z .'-]+$/";
    if(!preg_match($email_exp, $sender_email)) {
        $error_message .= 'The Email Address you entered does not appear to be correct.<br />';
    }
    if(!preg_match($string_exp, $sender_first_name)) {
        $error_message .= 'The First Name you entered does not appear to be correct.<br />';
    }
    if(!preg_match($string_exp,$sender_last_name)) {
        $error_message .= 'The Last Name you entered does not appear to be correct.<br />';
    }
    if(strlen($message) < 5) {
        $error_message .= 'The message you send appears to be too short.<br />';
    }

    if(strlen($error_message) > 0) {
        died($error_message);
    }

    $contact_msg = "Someone has reached out through Feeney Welding and Fence\n The form they submitted is below.\n\n";

    function clean_string($string) {
        $bad = array("content-type","bcc:","to:","cc:","href");
        return str_replace($bad,"",$string);
    }

    $contact_msg .= "First Name: ".clean_string($sender_first_name)."\n";
    $contact_msg .= "Last Name: ".clean_string($sender_last_name)."\n";
    $contact_msg .= "Email: ".clean_string($sender_email)."\n";
    $contact_msg .= "Telephone: ".clean_string($sender_phone)."\n";
    $contact_msg .= "Comments: ".clean_string($message)."\n";



// create email headers
    $headers = 'From: '.$email_from."\r\n".
        'Reply-To: '.$email_from."\r\n" .
        'X-Mailer: PHP/' . phpversion();

    if (@mail(SEND_EMAIL_TO, EMAIL_SUBJECT_LINE, $contact_msg, $headers)) {
        // Mail sent!
        $result['success'] = 1;
        $result['message'] = "Thanks so much! We appreciate your time and someone will get in touch with you very shortly.";
    } else {
        // It did not
        $result['success'] = 0;
        $result['message'] = "Sorry, we are having trouble with our email server. Feel free to pick up the phone and call us!";
    }


} else {
    $result['success'] = 0;
    $result['message'] = 'There was not enough form data';
}

ob_clean();
echo json_encode($result);
exit;