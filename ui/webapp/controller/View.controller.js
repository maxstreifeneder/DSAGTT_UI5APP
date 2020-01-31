/* global Msal */
sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/ui/model/json/JSONModel", "demo/sap/msgraph/libs/msal"],
	function (Controller, MessageToast, JSONModel, msal) {
		"use strict";

		return Controller.extend("demo.sap.msgraph.controller.View", {

			config: {
				msalConfig: {
					auth: {
						clientId: "59140526-7c63-4d3c-b507-cfe065ef2f99"
					},
					cache: {
						cacheLocation: 'localStorage',
						storeAuthStateInCookie: true
					}
				},
				graphBaseEndpoint: "https://graph.microsoft.com/v1.0/",
				userInfoSuffix: "me/",
				queryMessagesSuffix: "me/messages?$search=\"$1\"&$top=150",
				scopeConfig: {
					scopes: ['User.Read', 'Mail.Read']
				}
			},

			onInit: function () {
				this.oMsalClient = new Msal.UserAgentApplication(this.config.msalConfig);
				//check if the user is already signed in
				if (!this.oMsalClient.getAccount()) {
					this.oMsalClient.loginPopup(this.config.scopeConfig).then(this.fetchUserInfo.bind(this));
				} else {
					this.fetchUserInfo();
				}
			},

			//************* MSAL functions *****************//
			onLogout: function (oEvent) {
				var oSessionModel = oEvent.getSource().getModel('session');
				var bIsLoggedIn = oSessionModel.getProperty('/userPrincipalName');
				if (bIsLoggedIn) {
					this.oMsalClient.logout();
					return;
				}
				this.fetchUserInfo();
			},
			// INSERT CODE IN SUB-STEP 2 HERE

			fetchUserInfo: function () {
				this.callGraphApi(this.config.graphBaseEndpoint + this.config.userInfoSuffix, function (response) {
					$.sap.log.info("Logged in successfully!", response);
					this.getView().getModel("session").setData(response);
				}.bind(this));
			},
			// INSERT CODE IN SUB-STEP 3 HERE

			callGraphApi: function (sEndpoint, fnCb) {
				this.oMsalClient.acquireTokenSilent(this.config.scopeConfig)
					.then(function (token) {
						$.ajax({
							url: sEndpoint,
							type: "GET",
							beforeSend: function (xhr) {
								xhr.setRequestHeader("Authorization", "Bearer " + token.accessToken);
							}
						})
							.then(fnCb)
							.fail(function (error) {
								MessageToast.show("Error, please check the log for details");
								$.sap.log.error(JSON.stringify(error.responseJSON.error));
							});
					}.bind(this));
			},

			onPressLink: function (oEvent) {
				var sLinkText = oEvent.getSource().getText();
				var oApp = this.getView().getContent()[0];
				this.callGraphApi(this.config.graphBaseEndpoint + this.config.queryMessagesSuffix.replace("$1", sLinkText), function (results) {
					results.value = results.value.map(function (o) {
						o.bodyPreview = o.bodyPreview.replace(sLinkText, "<strong>" + sLinkText + "</strong>");
						return o;
					});
					var oResultsPage = oApp.getPages()[2].setModel(new JSONModel(results), "msData");
					oApp.to(oResultsPage.getId());
				});
			},

			onOpenEmail: function (oEvent) {
				var sEmail = oEvent.getSource().getBindingContext("msData").getProperty("webLink");
				window.open(sEmail, "_blank");
			},

			onProductClick: function (oEvent) {
				var oApp = this.getView().byId("idAppControl");
				var sBindingPath = oEvent.getSource().getBindingContext().getPath();
				var oDetailsPage = oApp.getPages()[1].bindElement(sBindingPath);
				oApp.to(oDetailsPage.getId());
			},

			onNavButtonPress: function (oEvent) {
				var oApp = this.getView().byId("idAppControl");
				var oStartPage = oApp.getPages()[0];
				oApp.back(oStartPage.getId());
			}
		});
	});