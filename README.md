# graph-integration-cf
This application is running on SAP Cloud Platform Cloud Foundry. The UI5 App shows data coming from the ES5 system (Gateway Demo system) and integrates with MS Graph. This simple scenario shows how to query the MS Graph API to display certain mails of your Office365 Outlook mailbox. 

# How to get up and running

1) Create an account on the ES5 Gateway system: https://developers.sap.com/tutorials/gateway-demo-signup.html
2) Create an OData Destination in SAP Cloud Platform https://developers.sap.com/tutorials/cp-ui5-ms-graph-create-destination.html
3) Clone this repo
4) Register your app in the Azure Portal and adjust the configuration in the `ui/webapp/controller/View.controller.js` file (lines 9-15). 
5) Execute `mbt build -p=cf` to build the MTA Archive.
6) Deploy the MTA Archive of step 5 with cf deploy mta_archives/{mta_archive_name}
7) Adjust the redirect URL in the Azure application registry with the actual url of the application (ends with `.com/ui/`).
