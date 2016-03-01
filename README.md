# servicenow-export-email
Adds an UI action on the `sys_email` table to export an email to an .EML file.

The UI action creates the .EML file as a ServiceNow attachment (`sys_attachment` table) and then downloads it.

####Shortcomings
- Attachments of emails are not exported to the .EML file.
- Emails with content-type `text/html` and `text/plain` can be exported. Multipart emails are not exported properly currently.

####Uses
This is mostly useful for non-prod environments where outbound emails are generally disabled.

####Compatibility
This has been tested with Fuji and should work on Geneva.
This has not been tested on versions prior to Fuji.                                         
