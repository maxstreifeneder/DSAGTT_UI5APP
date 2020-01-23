/* global Msal */
sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/ui/model/json/JSONModel", "demo/sap/msgraph/libs/msal"],
	function (Controller, MessageToast, JSONModel, msal) {
		"use strict";

		return Controller.extend("demo.sap.msgraph.controller.View", {

			//INSERT GRAPH JAVASCRIPT CODING

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