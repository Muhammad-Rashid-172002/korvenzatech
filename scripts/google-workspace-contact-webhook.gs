/**
 * KorvenzaTech website -> Google Workspace contact router.
 *
 * Deploy this as a Google Apps Script Web App from the Google Workspace account
 * that should send website notifications. Then paste the deployment URL into
 * Vercel as CONTACT_WEBHOOK_URL.
 *
 * Deployment: Execute as "Me". Access: "Anyone" (the endpoint accepts only the
 * fields below and always routes to KorvenzaTech-owned inboxes).
 */
function doPost(e) {
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var allowed = ['info@korvenzatech.com', 'sales@korvenzatech.com'];
    var destination = allowed.indexOf(data.destinationEmail) >= 0 ? data.destinationEmail : 'info@korvenzatech.com';
    var ref = clean(data.referenceId || 'KZ-WEB');
    var name = clean(data.fullName || 'Website visitor');
    var visitorEmail = clean(data.email || '');
    var inquiry = clean(data.inquiryType || data.serviceNeeded || 'General Inquiry');
    var subject = '[' + ref + '] ' + inquiry + ' — ' + name;

    var lines = [
      'KorvenzaTech Website Inquiry',
      '',
      'Reference: ' + ref,
      'Name: ' + name,
      'Email: ' + visitorEmail,
      'Company: ' + clean(data.companyName || 'Not provided'),
      'Country: ' + clean(data.country || 'Not provided'),
      'Inquiry: ' + inquiry,
      'Service: ' + clean(data.serviceNeeded || 'Not specified'),
      'Budget: ' + clean(data.budgetRange || 'Not specified'),
      'Preferred contact: ' + clean(data.preferredContact || 'Email'),
      '',
      'Message / project brief:',
      clean(data.ideaDescription || 'No message provided'),
      '',
      'Submitted: ' + clean(data.submittedAt || new Date().toISOString())
    ];

    MailApp.sendEmail({
      to: destination,
      replyTo: visitorEmail,
      subject: subject,
      body: lines.join('\n'),
      name: 'KorvenzaTech Website'
    });

    return ContentService.createTextOutput(JSON.stringify({success:true, destination:destination}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({success:false, error:String(err)}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function clean(value) {
  return String(value == null ? '' : value).replace(/[<>]/g, '').slice(0, 8000);
}
