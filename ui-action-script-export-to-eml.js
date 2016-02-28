exportEmailToEML(current);

function exportEmailToEML(/*GlideRecord (sys_email) */ gr) {
	var emlStr = '';
	emlStr += 'To: ' + gr.recipients + '\n';
	emlStr += 'Subject: ' + gr.subject + '\n';
	emlStr += 'From: ' + gs.getProperty('instance_name') + '@service-now.com\n';
	emlStr += 'Reply-To: ' + gs.getProperty('instance_name') + '@service-now.com\n';
	emlStr += 'Content-Type: ' + gr.content_type + '\n';
	emlStr += 'Date: ' + generateEMLDate(gr) + '\n';
	emlStr += gr.headers + '\n';
	emlStr += '\n\n' + gr.body;
	var emlAttachmentSysId = (new GlideSysAttachment()).write((new GlideRecord('sys_attachment')), gr.subject + '.eml', 'text/plain', emlStr);
	action.setRedirectURL('sys_attachment.do?sys_id=' + emlAttachmentSysId);
}


function generateEMLDate(/*GlideRecord (sys_email) */ gr) {
	// Construct the date string required by the EML format. (Sat, 30 Apr 2005 19:28:29 -0300)
	var gdt = new GlideDateTime(gr.sys_created_on);
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

	var allDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	var allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var emlDateStr = allDays[dayOfWeek]
	 + ", "
	 + ("00".slice(dayOfMonthStr.length) + dayOfMonthStr) + " "
	 + allMonths[month - 1] + " "
	 + year + " "
	 + localTimeStr.slice(11) + " "
	 + tzOffsetHoursSign
	 + ("00".slice(tzOffsetHoursAbsStr.length) + tzOffsetHoursAbsStr) + "00";

	return emlDateStr;
}
