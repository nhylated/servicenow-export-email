# servicenow-export-email
Adds an UI action on the `sys_email` table to export an email to an .EML file.

Attachments of emails are not exported to the .EML file.

The UI action creates the .EML file as a ServiceNow attachment (`sys_attachment` table) and then downloads it.

Emails with content-type `text/html` and `text/plain` can be exported. Multipart emails are not exported properly currently.

