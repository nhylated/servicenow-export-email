var emlAttachmentSysId = exportEmailToEML(current);
action.setRedirectURL('sys_attachment.do?sys_id=' + emlAttachmentSysId);

/**
 * Generates the string content of the .EML file for a given email and creates the EML file as an attachment and returns its sys_id.
 * @param {GlideRecord} sys_email_gr - A sys_email GlideRecord.
 * @return {string} sys_id of the .EML file attachment in the sys_attachment table.
 */
function exportEmailToEML(sys_email_gr) {
	var emlStr = '';
	emlStr += 'To: ' + sys_email_gr.recipients + '\n';
	emlStr += 'Subject: ' + sys_email_gr.subject + '\n';
	emlStr += 'From: ' + gs.getProperty('instance_name') + '@service-now.com\n';
	emlStr += 'Reply-To: ' + gs.getProperty('instance_name') + '@service-now.com\n';
	emlStr += 'Content-Type: ' + sys_email_gr.content_type + '\n';
	emlStr += 'Date: ' + generateEMLDate(sys_email_gr) + '\n';
	emlStr += sys_email_gr.headers + '\n';
	emlStr += '\n\n' + sys_email_gr.body;
	return (new GlideSysAttachment()).write((new GlideRecord('sys_attachment')), sys_email_gr.subject + '.eml', 'text/plain', emlStr);
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
	var tzOffsetHours = tzOffset/1000/60/60;
	var tzOffsetHoursSign = (tzOffsetHours < 0 ? "-" : "");
	var tzOffsetHoursAbs = Math.abs(tzOffsetHours);
	var tzOffsetHoursAbsStr = tzOffsetHoursAbs.toString();

	var ALL_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	var ALL_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	var emlDateStr = ALL_DAYS[dayOfWeek]
	 + ", "
	 + ("00".slice(dayOfMonthStr.length) + dayOfMonthStr) + " "
	 + ALL_MONTHS[month - 1] + " "
	 + year + " "
	 + localTimeStr.slice(11) + " "
	 + tzOffsetHoursSign
	 + ("00".slice(tzOffsetHoursAbsStr.length) + tzOffsetHoursAbsStr) + "00";

	return emlDateStr;
}
