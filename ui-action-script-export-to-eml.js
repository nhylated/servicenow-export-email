/**
 * Author/source: https://github.com/nhylated/servicenow-export-email
 * License: MIT license
 */

var emlAttachmentSysId = exportEmailToEML(current);
action.setRedirectURL('sys_attachment.do?sys_id=' + emlAttachmentSysId);

/**
 * Generates the string content of the .EML file for a given email and creates the EML file as an attachment and returns its sys_id.
 * @param {GlideRecord} sys_email_gr - A sys_email GlideRecord.
 * @return {string} sys_id of the .EML file attachment in the sys_attachment table.
 */
function exportEmailToEML(sys_email_gr) {
    var instanceEmail = gs.getProperty('instance_name') + '@service-now.com';
    var emlStr = '';
    emlStr += 'To: ' + sys_email_gr.recipients + '\n';
    emlStr += 'Subject: ' + sys_email_gr.subject + '\n';
    emlStr += 'From: ' + instanceEmail + '\n';
    emlStr += 'Reply-To: ' + instanceEmail + '\n';
    emlStr += 'Date: ' + generateEMLDate(sys_email_gr) + '\n';

    // Add the content-type and body
    var obj = generateEMLBodyAndContentType(sys_email_gr);
    emlStr += obj.contentType + '\n';
    emlStr += sys_email_gr.headers + '\n';
    emlStr += '\n\n' + obj.body;

    return (new GlideSysAttachment()).write((new GlideRecord('sys_attachment')), sys_email_gr.subject + '.eml', 'text/plain', emlStr);
}

function generateEMLBodyAndContentType(sys_email_gr) {
    var cType = sys_email_gr.content_type.toString();
    if (cType == 'text/html' || cType == 'text/plain') {
        return {
            'contentType': 'Content-Type: ' + sys_email_gr.content_type,
            'body': sys_email_gr.body
        };
    }

    // Process multipart/mixed email.
    // See https://www.w3.org/Protocols/rfc1341/7_2_Multipart.html
    var boundaryStr = Math.random().toString(36).substring(10);
    var boundaryStr2 = Math.random().toString(36).substring(10);
    var contentType = 'Content-Type: ' + sys_email_gr.content_type + '; boundary=' + boundaryStr;

    // Register a separate boundary for the html/text email body content. Attachment content will be dumped under the main boundary listed in the email headers.
    var bodyStr = '--' + boundaryStr + '\n';
    bodyStr += 'Content-Type: multipart/related; boundary=' + boundaryStr2 + '\n\n';

    bodyStr += '--' + boundaryStr2 + '\n';
    bodyStr += 'Content-Type: text/html\n';
    bodyStr += 'Content-Transfer-Encoding: quoted-printable\n';
    bodyStr += '\n';
    bodyStr += sys_email_gr.body + '\n';
    bodyStr += '--' + boundaryStr2 + '--\n\n';

    // Process attachments, if any.
    bodyStr += processEmailAttachmentsForEML(sys_email_gr, boundaryStr);

    // End of EML.
    bodyStr += '\n--' + boundaryStr + '--';

    return {
        'contentType': contentType,
        'body': bodyStr
    };
}

/**
 * Constructs the date string for the EML file for a given email's sys_created_on date. (e.g. Sat, 30 Apr 2005 19:28:29 -0300).
 * @param {GlideRecord} sys_email_gr - A sys_email GlideRecord.
 * @return {string} The sys_created_on date of the email in the format required by the EML file.
 */
function generateEMLDate(sys_email_gr) {
    var gdt = new GlideDateTime(sys_email_gr.sys_created_on);
    var dayOfWeek = gdt.getDayOfWeekLocalTime().toString();
    var dayOfMonthStr = gdt.getDayOfMonthLocalTime().toString();
    var month = gdt.getMonthLocalTime();
    var year = gdt.getYearLocalTime();
    var localTimeStr = gdt.getLocalTime().toString();
    var tzOffset = gdt.getTZOffset();
    var tzOffsetHours = tzOffset / 1000 / 60 / 60;
    var tzOffsetHoursSign = (tzOffsetHours < 0 ? "-" : "");
    var tzOffsetHoursAbs = Math.abs(tzOffsetHours);
    var tzOffsetHoursAbsStr = tzOffsetHoursAbs.toString();

    var ALL_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var ALL_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    var emlDateStr = ALL_DAYS[dayOfWeek] + ", " + ("00".slice(dayOfMonthStr.length) + dayOfMonthStr) + " " + ALL_MONTHS[month - 1] + " " + year + " " + localTimeStr.slice(11) + " " + tzOffsetHoursSign + ("00".slice(tzOffsetHoursAbsStr.length) + tzOffsetHoursAbsStr) + "00";

    return emlDateStr;
}

/**
 * Generates the EML content for attachments of a given email, if any.
 * @param {GlideRecord} sys_email_gr - A sys_email GlideRecord.
 * @param {string} boundaryStr - The boundary being used for the EML file.
 * @return {string} String containing the section of the EML with attachment data. This should be concatenated at the end of the rest of the body of the EML.
 */
function processEmailAttachmentsForEML(sys_email_gr, boundaryStr) {
    if (!sys_email_gr || !boundaryStr) {
        throw new Error('Missing arguments.');
    }

    var attachmentStrForEml = '';

    var grAttach = new GlideRecord('sys_attachment');
    grAttach.addQuery('table_name', 'sys_email');
    grAttach.addQuery('table_sys_id', sys_email_gr.sys_id);
    grAttach.query();
    // NOTE: Important to use toString() when using/concatenating a GlideRecord's field values in a while loop.
    while (grAttach.next()) {
        attachmentStrForEml += '--' + boundaryStr + '\n';
        attachmentStrForEml += 'Content-Type: ' + grAttach.content_type.toString() + '; name="' + grAttach.file_name.toString() + '"\n';
        attachmentStrForEml += 'Content-Transfer-Encoding: base64\n';
        attachmentStrForEml += 'Content-Disposition: attachment; filename="' + grAttach.file_name.toString() + '"\n';
        attachmentStrForEml += '\n';

        // Print attachment's base64 encoded bytes.
        var attBytes = (new GlideSysAttachment()).getBytes(grAttach);
        var base64EncData = GlideStringUtil.base64Encode(attBytes);
        attachmentStrForEml += base64EncData;
        attachmentStrForEml += '\n\n';
    }

    return attachmentStrForEml;
}
