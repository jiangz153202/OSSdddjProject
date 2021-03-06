+ function(t, e) {
	"use strict";
	var n = {
		init: function(t) {
			t = this.setOptions(t || {}), AjaxCommon.cookieItem.getCookie("dddjsid", function(e) {
				t.sid = e, t.this.initPage(t)
			})
		},
		tmplBody: function(n) {
			if(n.chks = this.getCheckedBoxs(), 1 == n.type && (document.querySelector(".mui-title").innerHTML = "门店购物车", n.btnOrder.addEventListener("tap", function() {
					this.classList.contains("mui-disabled") || n.this.storeSubmit(n)
				}), null != n.cartIntegral && n.cartIntegral.classList.remove("mui-hide")), 0 === n.itemLen) {
				var o = n.chkAll.querySelector("input");
				return o.checked = !1, o.setAttribute("disabled", "disabled"), n.btnOrder.classList.add("mui-disabled"), void this.setEmpty(n)
			}
			this.setBtnGroups(n), this.singleClick(n), this.allClick(n), this.setPage(n), t("ul").on("tap", ".shop-del-icon", function() {
				n.this.delCart(n, this)
			});
			n.pluginCart.classList.remove("mui-hide"), t.init()
		},
		initPage: function(t) {
			var n = {
				urlPath: t.getCartListUrl,
				data: {},
				onBeforeSend: function() {
					t.listContainer.innerHTML = t.tmplLoading.innerHTML
				},
				onSuccess: function(n) {
					if(0 == n.status) {
						var o = "";
						t.itemLen = n.data.length, o = n.data.length > 0 ? template("tmpl-model", n.data) : t.tmplNull.innerHTML, t.listContainer.innerHTML = o, setTimeout(function() {
							t.this.tmplBody(t)
							
							//配置上拉加载
							var deceleration = mui.os.ios ? 0.003 : 0.0009;
							mui('.mui-scroll-wrapper').scroll({
								bounce: false,
								indicators: false, //是否显示滚动条
								deceleration: deceleration
							});
						}, 400)
					} else {
						common.alert({
							msg: "读取出错",
							onHidden: function() {
								t.listContainer.innerHTML = t.tmplNull.innerHTML, e.getElementById("cart-null").addEventListener("tap", function() {
									window.location.href = common.config.homeUrl
								})
							}
						})
					}
				},
				onError: function() {
					console.log("失败回调")
				}
			};
			AjaxCommon.getAjaxRequestJson(n)
		},
		setOptions: function(t) {
			return t.this = this, t.pluginCart = e.querySelector(".plugin-cart"), t.totalPriceDiv = e.getElementById("total"), t.btnOrder = e.getElementById("btn-order"), t.chkAll = e.getElementById("chkAll"), t.tmplEmpty = e.getElementById("tmpl-empty"), t.container = e.getElementById("container"), t.delUrl = common.config.appPath + "/api/cart/remove", t.orderUrl = common.config.rootPath + "/order/order.html?orderStr=", t.updateCartUrl = common.config.appPath + "/api/cart/modify", t.storeCartUrl = common.config.appPath + "/api/store/submit", t.getCartListUrl = common.config.appPath + "/api/cart/listItems", t.payUrl = common.config.rootPath + "/order/pay/index.html", t.orderList = "", t.type = void 0 == common.queryToJSON().type ? "" : common.queryToJSON().type, t.cartIntegral = e.getElementById("cart-integral"), t.getNewProductShownUrl = common.config.appPath + "/api/goods/getHots", t.hotsContainer = e.getElementById("hots-container"), t.tmplNull = e.getElementById("tmpl-model-null"), t.tmplLoading = e.getElementById("tmpl-model-loading"), t.listContainer = e.getElementById("list-container"), t
		},
		newProductShown: function(t) {
			var n = {
				urlPath: t.getNewProductShownUrl,
				data: {
					pageSize: 6
				},
				onBeforeSend: function() {},
				onSuccess: function(n) {
					if("function" == typeof template) {
						if(0 == n.status && n.data.length > 0) {
							var o = template("tmpl-hots", n);
							t.hotsContainer.innerHTML = o, t.this.lazyloadTmpl(t.hotsContainer);
							var r = e.getElementById("demo-container");
							null != r && 1 != t.type && r.classList.remove("mui-hide")
						}
					} else {
						common.alert({
							msg: "模板js文件未引用"
						})
					}
				},
				onError: function() {
					console.log("失败回调")
				}
			};
			AjaxCommon.getAjaxRequestJson(n)
		},
		lazyloadTmpl: function(e) {
			e.removeAttribute("data-imagelazyload"), t(e).imageLazyload()
		},
		setBtnGroups: function(e) {
			for(var n = this.getBtnGroups(), o = 0; o < n.length; o += 1) {
				t(n[o]).plusMinusBtn({
					max: n[o].getAttribute("data-stock"),
					buyQty: n[o].getAttribute("data-qty"),
					btnClass: "input-group-btn mui-btn",
					btnCssText: "",
					buyNumberClass: "",
					buyNumberCssText: "width: 38px;height: 33px;text-align: center;border-radius: 0px;padding: 0px;margin: 0px;border: 1px solid rgb(239, 239, 239) !important;",
					stockClass: "shop-stock",
					isShowStock: !1,
					onPlus: function(t) {
						var n = t.btnGroup.getAttribute("data-cart-id"),
							o = parseInt(t.buyNumber.value);
						o <= parseInt(t.options.max) && e.this.updateCart(e, n, o), t.btnGroup.parentNode.querySelector(".shop-price").innerHTML = "&yen;" + (o * parseFloat(t.btnGroup.dataset.price)).toFixed(2), e.this.setPage(e)
					},
					onMinus: function(t) {
						var n = t.btnGroup.getAttribute("data-cart-id"),
							o = parseInt(t.buyNumber.value);
						o > 0 && e.this.updateCart(e, n, o), t.btnGroup.parentNode.querySelector(".shop-price").innerHTML = "&yen;" + (o * parseFloat(t.btnGroup.dataset.price)).toFixed(2), e.this.setPage(e)
					},
					onChange: function(t) {
						var n = t.btnGroup.getAttribute("data-cart-id"),
							o = parseInt(t.buyNumber.value);
						o > 0 && e.this.updateCart(e, n, o), t.btnGroup.parentNode.querySelector(".shop-price").innerHTML = "&yen;" + (o * parseFloat(t.btnGroup.dataset.price)).toFixed(2), e.this.setPage(e)
					}
				})
			}
		},
		setOrderUrl: function(t) {
			var e = "",
				n = "",
				o = null,
				r = 0,
				i = this.getBtnGroups();
			for(r; r < i.length; r += 1) {
				o = i[r].querySelector("input"), n = String.format("{0}-{1}-{2}", i[r].getAttribute("data-itemid"), i[r].getAttribute("data-skuid"), o.value), e += n, r !== i.length - 1 && (e += "/"), i[r].setAttribute("data-itemlist", n), i[r].setAttribute("data-qty", o.value)
			}
			1 == t.type || "" == e ? t.btnOrder.href = "javascript:;" : t.btnOrder.href = t.orderUrl + e + "&from=cart&sid=" + t.sid + "&type=" + t.type, t.orderList = e
		},
		setTotalPrice: function(t) {
			for(var e = this.getCheckedLi(), n = 0, o = 0, r = 0; r < e.length; r += 1) {
				n = e[r].querySelector("p.shop-price").innerText.replace("¥", "").trim(), o += parseFloat(n)
			}
			t.totalPriceDiv.innerText = "合计：¥" + o.toFixed(2) + " 元"
		},
		setTotalQty: function(t) {
			for(var e = this.getCheckedLi(), n = 0, o = 0; o < e.length; o += 1) {
				n += parseInt(e[o].querySelector('.input-group [type="text"]').value)
			}
			t.btnOrder.innerText = "去结算(" + n + ")"
		},
		setOrdetBtnStatu: function(t, e) {
			e ? t.btnOrder.classList.remove("mui-disabled") : t.btnOrder.classList.add("mui-disabled")
		},
		updateCart: function(t, e, n) {
			var o = {
				urlPath: t.updateCartUrl,
				data: {
					itemId: e,
					quantity: n,
					type: t.type
				},
				onBeforeSend: function() {},
				onSuccess: function(t) {
					0 == t.status ? console.log("成功") : common.alert({
						msg: "数据交互出错,请重试...",
						callback: function() {}
					})
				},
				onError: function() {
					console.log("失败回调")
				}
			};
			AjaxCommon.getAjaxRequestJson(o)
		},
		setPage: function(t) {
			this.setOrderUrl(t), this.setTotalPrice(t), this.setTotalQty(t), this.setEmpty(t)
		},
		setEmpty: function(t) {
			0 === this.getAllCheckBoxs().length && (t.listContainer.innerHTML = t.tmplNull.innerHTML, e.getElementById("cart-null").addEventListener("tap", function() {
				window.location.href = common.config.homeUrl
			}), t.chkAll.querySelector("input[type='checkbox']").checked = !1, t.btnOrder.classList.add("mui-disabled"))
		},
		getBtnGroups: function() {
			var t = [],
				e = 0,
				n = this.getCheckedLi();
			for(e; e < n.length; e += 1) {
				t.push(n[e].querySelector("div.input-group"))
			}
			return t
		},
		getAllCheckBoxs: function() {
			return e.querySelectorAll('.js-goods [type="checkbox"]')
		},
		getCheckedBoxs: function() {
			var t = [],
				e = 0,
				n = this.getAllCheckBoxs();
			for(e; e < n.length; e += 1) {
				n[e].checked && t.push(n[e])
			}
			return t
		},
		getCheckedLi: function() {
			var t = e.querySelectorAll("li.js-goods"),
				n = [],
				o = 0;
			for(o; o < t.length; o += 1) {
				null !== t[o].querySelector("input:checked") && n.push(t[o])
			}
			return n
		},
		singleClick: function(t) {
			for(var e = 0; e < t.chks.length; e += 1) {
				t.chks[e].addEventListener("click", function(e) {
					var n = t.this.getAllCheckBoxs().length,
						o = t.this.getCheckedBoxs().length;
					t.chkAll.querySelector("input").checked = n === o, t.this.setOrdetBtnStatu(t, 0 !== o), t.this.setPage(t)
				})
			}
		},
		allClick: function(t) {
			t.chkAll.addEventListener("click", function(e) {
				for(var n in t.chks) {
					t.chks[n].checked = e.target.checked
				}
				t.this.setOrdetBtnStatu(t, e.target.checked), t.this.setPage(t)
			})
		},
		delCart: function(t, e) {
			alertOptions.msg = "正在删除，请稍后...", alertOptions.callback = function(n) {
				var o = e.getAttribute("data-cart-id"),
					r = {
						urlPath: t.delUrl,
						data: {
							itemId: o
						},
						onBeforeSend: function() {},
						onSuccess: function(o) {
							0 === o.status ? (n.setMsg("删除成功！"), e.parentNode.parentNode.removeChild(e.parentNode), t.this.setPage(t)) : n.setMsg(o.message || "删除失败！"), n.hide()
						},
						onError: function() {
							console.log("失败回调")
						}
					};
				AjaxCommon.getAjaxRequestJson(r)
			}, common.alert(alertOptions)
		},
		storeSubmit: function(t) {
			alertOptions.msg = "正在请求中，请稍后...", alertOptions.callback = function(e) {
				var n = {
					urlPath: t.storeCartUrl,
					data: {
						from: "cart",
						orderStr: t.orderList
					},
					onBeforeSend: function() {},
					onSuccess: function(n) {
						0 === n.status ? (e.setMsg("请求成功！"), e.hide(), window.location.href = t.payUrl + n.data) : (e.setMsg(n.message || "请求失败！"), e.hide()), e.hide()
					},
					onError: function() {
						console.log("失败回调")
					}
				};
				AjaxCommon.getAjaxRequestJson(n)
			}, common.alert(alertOptions)
		}
	};
	window.cart = n
}(mui, document);