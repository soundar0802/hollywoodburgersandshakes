<?php
/**
 * send-franchise-enquiry.php
 * Receives the "Request Franchise Information" form and emails it via SMTP.
 *
 * Place this file in the SAME folder as the page that holds the form,
 * so the form's  action="send-franchise-enquiry.php"  resolves correctly.
 *
 * It returns JSON when called with fetch/AJAX (recommended, see the JS file),
 * and falls back to a redirect if JavaScript is off.
 */

/* ------------------------------------------------------------------
   1) LOAD PHPMailer
   Recommended:  run  `composer require phpmailer/phpmailer`  in your
   project root — that creates the vendor/ folder used below.
   No Composer?  Download PHPMailer from github.com/PHPMailer/PHPMailer
   and drop its /src files into  ./PHPMailer/src/  next to this file.
------------------------------------------------------------------- */
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require __DIR__ . '/vendor/autoload.php';
} else {
    require __DIR__ . '/PHPMailer/src/Exception.php';
    require __DIR__ . '/PHPMailer/src/PHPMailer.php';
    require __DIR__ . '/PHPMailer/src/SMTP.php';
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

/* ==================================================================
   2) CONFIG  — edit these to match your mailbox / provider
   ================================================================== */
$SMTP_HOST   = 'smtp.yourprovider.com';   // Gmail: smtp.gmail.com | O365: smtp.office365.com | cPanel: mail.yourdomain.com
$SMTP_PORT   = 587;                        // 587 = STARTTLS, 465 = SMTPS
$SMTP_SECURE = PHPMailer::ENCRYPTION_STARTTLS; // use ENCRYPTION_SMTPS if you set port 465
$SMTP_USER   = 'noreply@hollywoodburgers.co.uk';       // mailbox login
$SMTP_PASS   = 'your-mailbox-or-app-password';         // NEVER commit this to a public repo

$MAIL_FROM       = 'noreply@hollywoodburgers.co.uk';   // usually same as SMTP_USER
$MAIL_FROM_NAME  = 'Hollywood Franchise Enquiries';
$MAIL_TO         = 'franchise@hollywoodburgers.co.uk'; // where enquiries land
$MAIL_TO_NAME    = 'Franchise Team';

$REDIRECT_PAGE   = 'index.html';           // no-JS fallback: where to send the visitor back to
/* ================================================================== */

/* ---- detect AJAX (fetch) vs normal form post ---- */
$isAjax = (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest');

function respond($ok, $message, $isAjax, $redirect) {
    if ($isAjax) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'message' => $message]);
    } else {
        header('Location: ' . $redirect . ($ok ? '?enquiry=sent' : '?enquiry=error'));
    }
    exit;
}

/* ---- only accept POST ---- */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Invalid request.', $isAjax, $REDIRECT_PAGE);
}

/* ---- honeypot: bots fill the hidden "website" field; real users don't ---- */
if (!empty($_POST['website'])) {
    respond(true, 'Thanks! Your enquiry has been sent.', $isAjax, $REDIRECT_PAGE); // drop silently
}

/* ---- helpers ---- */
function field($k) { return isset($_POST[$k]) ? trim($_POST[$k]) : ''; }
function clean($v) { return htmlspecialchars($v, ENT_QUOTES, 'UTF-8'); }

/* ---- collect ---- */
$fullName   = field('fullName');
$email      = field('email');
$mobile     = field('mobile');
$address    = field('address');
$city       = field('city');
$county     = field('county');
$postcode   = field('postcode');
$occupation = field('occupation');
$capital    = field('capital');
$loc1       = field('loc1');
$loc2       = field('loc2');
$franchiseExp   = field('franchiseExp');
$fnbExp         = field('fnbExp');
$ukResident     = field('ukResident');
$hearAbout      = field('hearAbout');
$hearAboutOther = field('hearAboutOther');
$marketing      = isset($_POST['marketingConsent']) ? 'Yes' : 'No';

/* ---- server-side validation (mirrors the required fields) ---- */
$errors = [];
if ($fullName === '')                                              $errors[] = 'full name';
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL))   $errors[] = 'a valid email address';
if ($mobile === '')                                                $errors[] = 'mobile number';
if ($address === '')                                               $errors[] = 'address';
if ($city === '')                                                  $errors[] = 'city';
if ($postcode === '')                                              $errors[] = 'postcode';
if ($occupation === '')                                            $errors[] = 'current occupation';
if ($capital === '')                                               $errors[] = 'liquid capital';
if ($loc1 === '')                                                  $errors[] = 'preferred location 1';
if ($loc2 === '')                                                  $errors[] = 'preferred location 2';

if ($errors) {
    respond(false, 'Please complete: ' . implode(', ', $errors) . '.', $isAjax, $REDIRECT_PAGE);
}

/* ---- strip line breaks from anything used in mail headers (injection guard) ---- */
$safeName  = str_replace(["\r", "\n"], ' ', $fullName);
$safeEmail = str_replace(["\r", "\n"], '',  $email);

/* ---- build the email ---- */
$rows = [
    'Full Name'                  => $fullName,
    'Email'                      => $email,
    'Mobile'                     => $mobile,
    'Address'                    => $address,
    'City'                       => $city,
    'County'                     => $county !== '' ? $county : '—',
    'Postcode'                   => $postcode,
    'Current Occupation'         => $occupation,
    'Liquid Capital Available'   => $capital,
    'Preferred Location 1'       => $loc1,
    'Preferred Location 2'       => $loc2,
    'Franchise experience?'      => $franchiseExp !== '' ? ucfirst($franchiseExp) : '—',
    'F&B operations experience?' => $fnbExp !== '' ? ucfirst($fnbExp) : '—',
    'UK resident?'               => $ukResident !== '' ? ucfirst($ukResident) : '—',
    'Where did you hear about us'=> $hearAbout !== '' ? $hearAbout : '—',
    'If other'                   => $hearAboutOther !== '' ? $hearAboutOther : '—',
    'Marketing consent'          => $marketing,
];

$html = '<h2 style="font-family:Arial,sans-serif;color:#0B1533">New Franchise Enquiry</h2>'
      . '<table cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">';
foreach ($rows as $label => $val) {
    $html .= '<tr>'
           . '<td style="border:1px solid #e2e2e2;background:#f6f7fb;font-weight:bold;white-space:nowrap">' . clean($label) . '</td>'
           . '<td style="border:1px solid #e2e2e2">' . nl2br(clean($val)) . '</td>'
           . '</tr>';
}
$html .= '</table>';

$plain = "New Franchise Enquiry\n\n";
foreach ($rows as $label => $val) { $plain .= "$label: $val\n"; }

/* ---- send via SMTP ---- */
$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host       = $SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = $SMTP_USER;
    $mail->Password   = $SMTP_PASS;
    $mail->SMTPSecure = $SMTP_SECURE;
    $mail->Port       = $SMTP_PORT;
    $mail->CharSet    = 'UTF-8';
    // $mail->SMTPDebug = \PHPMailer\PHPMailer\SMTP::DEBUG_SERVER; // uncomment to troubleshoot

    $mail->setFrom($MAIL_FROM, $MAIL_FROM_NAME);
    $mail->addAddress($MAIL_TO, $MAIL_TO_NAME);
    $mail->addReplyTo($safeEmail, $safeName); // replies go straight to the enquirer

    $mail->isHTML(true);
    $mail->Subject = 'New Franchise Enquiry - ' . $safeName;
    $mail->Body    = $html;
    $mail->AltBody = $plain;

    $mail->send();
    respond(true, 'Thanks! Your enquiry has been sent — our franchise team will be in touch.', $isAjax, $REDIRECT_PAGE);

} catch (Exception $e) {
    error_log('Franchise enquiry mail failed: ' . $mail->ErrorInfo); // logged server-side
    respond(false, 'Sorry, something went wrong sending your enquiry. Please try again.', $isAjax, $REDIRECT_PAGE);
}
