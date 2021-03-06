# servicenow-export-email
Adds an UI action on the `sys_email` table to export an email to an .EML file.

The UI action creates the .EML file as a ServiceNow attachment (`sys_attachment` table) and then downloads it.

####Uses
Useful for non-prod environments where outgoing emails are generally disabled.

####Compatibility
This has been tested with ServiceNow Fuji version and should work on Geneva too. This has not been tested on versions prior to Fuji.                                         

Email clients: exported EML files have been tested with Thunderbird and Microsoft Outlook.

####Installing and using
Download the update set file from the respository and import it in your ServiceNow instance. 

Usage:
- From email list (`sys_email`): right click on any email > 'Export Email to EML' (below the 'Preview HTML body' option).
- From the email form (`sys_email`): click on 'Export Email to EML' under Related Links.

####Screenshots

![export-to-eml-list-action](https://cloud.githubusercontent.com/assets/2044493/13727323/1147b6c4-e942-11e5-8daa-45661f70d2cc.png)

![export-to-eml-form-related-link](https://cloud.githubusercontent.com/assets/2044493/13727322/113a4db8-e942-11e5-9598-8907884c437b.png)

