+ function(e, t, o) {
	"use strict";
	var n = {
		init: function(e) {
			if(e = this.setOptions(e || {}), "" == e.orderNumber) return common.alert({
				msg: "订单信息出错啦!"
			}), !1;
			e.this.initPage(e)
		},
		setOptions: function(e) {
			return e.this = this, e.orderNumber = common.queryToJSON().orderNumber == o ? "" : common.queryToJSON().orderNumber, e.createPayOrderUrl = common.config.appPath + "/api/order/detail", e.getWxPayInfo = common.config.appPath + "/api/order/getPayInfo", e.getOfflinePayInfo = common.config.appPath + "/store/api/order/offlinePay", e.toFindStoreUrl = common.config.rootPath + "/order/findstore.html", e.listContainer = t.getElementById("list-container"), e.orderType = 0, e.callback = common.queryToJSON().callback == o ? "" : common.queryToJSON().callback, e
		},
		getSelectedPm: function() {
			var e = t.getElementById("pay-container"),
				o = "JSAPI",
				n = e.querySelector(".mui-selected");
			return null != n && (o = n.dataset.pm), o
		},
		initPage: function(e) {
			var o = {
				urlPath: e.createPayOrderUrl,
				data: {
					orderNumber: e.orderNumber
				},
				onBeforeSend: function() {
					var o = t.getElementById("tmpl-model-loading").innerHTML;
					e.listContainer.innerHTML = o
				},
				onSuccess: function(t) {
					if(0 == t.status)
						if(null != t.data.store) {
							var o = template("tmpl-model", t.data);
							e.listContainer.innerHTML = o, e.this.initBody(e)
						} else setTimeout(function() {
							window.location.href = e.toFindStoreUrl + "?orderNumber=" + e.orderNumber
						}, 300);
					else common.alert({
						msg: t.msg || "读取出错"
					})
				},
				onError: function() {
					console.log("失败回调")
				}
			};
			AjaxCommon.getAjaxRequestJson(o)
		},
		initBody: function(o) {
			e.init(), o.paySubmit = t.getElementById("pay-submit"), null != o.paySubmit && o.paySubmit.addEventListener("tap", function() {
				o.paySubmit.classList.contains("mui-disabled") || o.this.getPayInfo(o)
			}), o.offlineSubmit = t.getElementById("offline-submit"), null != o.offlineSubmit && o.offlineSubmit.addEventListener("tap", function() {
				o.offlineSubmit.classList.contains("mui-disabled") || o.this.getOfflinePayInfo(o)
			})
		},
		getPayInfo: function(e) {
			e.paySubmit.classList.add("mui-disabled"), alertOptions.msg = "正在请求中...", alertOptions.callback = function(t) {
				var o = e.this.getSelectedPm(),
					n = {
						urlPath: e.getWxPayInfo,
						data: {
							orderNumber: e.orderNumber,
							paymentMethod: o
						},
						onSuccess: function(o) {
							0 == o.status ? (t.setMsg("请求成功,正在调用支付..."), t.hide(), WechatPay.pay(o.data, function(o) {
								"get_brand_wcpay_request:ok" == o.err_msg ? common.alert({
									msg: "正在跳转中...",
									onHidden: function() {
										switch(e.orderType) {
											case "6":
												var t = common.config.rootPath + "/order/view/" + e.orderNumber;
												window.location.href = t;
												break;
											case "2":
												var t = common.config.rootPath + "/p/order/storeorders?status=3";
												window.location.href = t;
												break;
											default:
												if("" != e.callback) window.location.href = e.callback;
												else {
													var t = common.config.rootPath + "/order/status?orderNumber=" + e.orderNumber;
													window.location.href = t
												}
										}
									}
								}) : (t.setMsg(o.err_msg), t.hide(), e.paySubmit.classList.remove("mui-disabled"))
							})) : (t.setMsg("调用支付失败,请重试!"), t.hide(), e.paySubmit.classList.remove("mui-disabled"))
						},
						onError: function() {
							console.log("失败回调"), t.setMsg("调用支付失败,请重试!"), t.hide(), e.paySubmit.classList.remove("mui-disabled")
						},
						onComplete: function() {
							
						}
					};
				AjaxCommon.getAjaxRequestJson(n)
			}, common.alert(alertOptions)
		},
		getOfflinePayInfo: function(e) {
			e.offlineSubmit.classList.add("mui-disabled"), alertOptions.msg = "正在请求中...", alertOptions.callback = function(t) {
				var o = {
					urlPath: e.getOfflinePayInfo,
					data: {
						orderNumber: e.orderNumber,
						paymentMethod: "OFFLINE_PAY"
					},
					onSuccess: function(o) {
						if(0 == o.status) {
							t.setMsg("请求成功,正在调用支付..."), t.hide();
							var n = "http://s.dddingjiu.com/views/home.html?type=delivery&orderNumber=" + e.orderNumber;
							window.location.href = n
						} else t.setMsg("调用支付失败,请重试!"), t.hide(), e.offlineSubmit.classList.remove("mui-disabled")
					},
					onError: function() {
						console.log("失败回调"), t.setMsg("调用支付失败,请重试!"), t.hide(), e.offlineSubmit.classList.remove("mui-disabled")
					},
					onComplete: function() {}
				};
				AjaxCommon.getAjaxRequestJson(o)
			}, common.alert(alertOptions)
		}
	};
	window.payIndex = n
}(mui, document, void 0);