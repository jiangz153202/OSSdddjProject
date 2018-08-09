+ function(t, e) {
	var a = {
		init: function(t) {
			t = this.setOptions(t || {}), this.initPage(t)
		},
		setOptions: function(t) {
			return t.this = this, t.tmplNull = e.getElementById("tmpl-model-null"), t.tmplLoading = e.getElementById("tmpl-model-loading"), t.listContainer = e.getElementById("list-container"), t.updateCartLink = e.getElementById("update-cart-link"), t.getCartListUrl = common.config.appPath + "/api/cart/getInfo", t.updateCartUrl = common.config.appPath + "/capi/shoppingCart/update/customer/quantity.json", t.deleteCartUrl = common.config.appPath + "/capi/shoppingCart/delete/customer/list.json", t.clearAllCartUrl = common.config.appPath + "/capi/shoppingCart/delete/empty.json", t.subOrderUrl = common.config.rootPath + "/phone/order/orderConfirm.html", t.supplierClassName = "tmpl-model-brand", t.goodsClassName = "tmpl-goods-box", t.attrClassName = "tmpl-goods-attr", t.cartAll = e.querySelector(".tmpl-cart-all"), t.settlement = e.getElementById("settlement"), t.deleteCar = e.getElementById("delete-cart"), t.cartCount = e.querySelector(".qc-bar-tab .cart-count"), t.cartTotal = e.querySelector(".qc-bar-tab .cart-total"), t
		},
		initPage: function(t) {
			var e = {
				urlPath: t.getCartListUrl,
				data: {},
				onBeforeSend: function() {
					t.listContainer.innerHTML = t.tmplLoading.innerHTML
				},
				onSuccess: function(e) {
					0 == e.status ? (t.result = e, t.this.tmplBody(t)) : common.alert({
						msg: e.head.message || "读取出错"
					})
				},
				onError: function() {
					console.log("失败回调")
				}
			};
			AjaxCommon.getAjaxRequestJson(e)
		},
		tmplBody: function(a) {
			var o = "",
				n = a.result;
			o = n.data.length > 0 ? template("tmpl-model", n.data) : a.tmplNull.innerHTML, a.listContainer.innerHTML = o, a.this.set$thisGroup(a), null != a.updateCartLink && a.updateCartLink.addEventListener("tap", function() {
				var t = this;
				document.body.classList.toggle("mui-active"), e.body.classList.contains("mui-active") ? t.querySelector(".mui-bar-title").innerHTML = "完成" : t.querySelector(".mui-bar-title").innerHTML = "编辑"
			});
			var r = e.getElementById("cart-null");
			null != r && r.addEventListener("tap", function() {
				setTimeout(function() {
					window.location.href = common.config.homeUrl
				}, 300)
			}), t(a.listContainer).off(), t(a.listContainer).on("tap", ".brand-list-cart", function() {
				var t = this.dataset.targettype,
					e = this.dataset.targetid,
					a = this;
				AjaxCommon.switchTarget(t, e, a)
			}), t(a.listContainer).on("change", 'input[type="checkbox"]', function(o) {
				var n = this;
				if(n.classList.contains(a.supplierClassName)) {
					var r = n.dataset.supid,
						s = ".sup-" + r,
						i = e.querySelector(s),
						l = t(a.this.findListCheckboxByElement(i));
					o.target.checked ? l.each(function() {
						this.checked = !0
					}) : l.each(function() {
						this.checked = !1
					})
				} else if(n.classList.contains(a.goodsClassName)) {
					var c = n.dataset.gid,
						d = ".goods-" + c,
						u = e.querySelector(d),
						m = t(a.this.findListCheckboxByElement(u)),
						i = u.parentNode,
						h = i.querySelectorAll(".tmpl-goods-box"),
						p = i.querySelector(".tmpl-model-brand");
					if(o.target.checked) {
						m.each(function() {
							this.checked = !0
						});
						var g = !0;
						t(h).each(function() {
							0 == this.checked && (g = !1)
						}), p.checked = g
					} else m.each(function() {
						this.checked = !1
					}), p.checked = !1
				} else if(n.classList.contains(a.attrClassName)) {
					for(var f = this.dataset.attrgid, y = e.querySelector(".goods-" + f), C = y.parentNode.querySelectorAll("." + a.goodsClassName), b = y.parentNode.querySelectorAll("." + a.attrClassName), k = y.parentNode.querySelector("." + a.supplierClassName), L = !0, v = 0; v < C.length; v++) {
						for(var q = C[v], S = !0, A = 0; A < b.length; A++) b[A].dataset.attrgid == q.dataset.gid && 0 == b[A].checked && (S = !1);
						q.checked = S, 0 == q.checked && (L = !1)
					}
					k.checked = L
				}
				for(var N = a.this.findListcheckBox(a), T = !0, v = 0; v < N.length; v++) 0 == N[v].checked && (T = !1);
				a.cartAll.checked = T, setTimeout(function() {
					a.this.reckonCartTotal(a)
				}, 300)
			}), null != a.cartAll && a.cartAll.addEventListener("change", function(e) {
				var o = t(a.this.findListcheckBox(a));
				e.target.checked ? o.each(function() {
					this.checked = !0
				}) : o.each(function() {
					this.checked = !1
				}), setTimeout(function() {
					a.this.reckonCartTotal(a)
				}, 300)
			}), null != a.settlement && a.settlement.addEventListener("tap", function() {
				a.this.submitToOrder(a)
			}), null != a.deleteCar && a.deleteCar.addEventListener("tap", function() {
				var t = "delete";
				a.cartAll.checked && (t = "all"), a.this.deleteCart(a, t, function(t) {
					a.this.deleteAfter(a)
				})
			})
		},
		reckonCartTotal: function(t) {
			var a = e.getElementsByClassName("tmpl-cart-model"),
				o = 0,
				n = 0;
			t.cartIdList = "";
			for(var r = 0; r < a.length; r++) {
				for(var s = a[r], i = 0, l = 0, c = 0, d = s.querySelectorAll(".tmpl-goods-attr"), u = 0; u < d.length; u++) {
					var m = d[u];
					if(m.checked) {
						var h = "._self-group-" + m.dataset.inputattrid,
							p = e.querySelector(h);
						l += parseFloat(p.dataset.qty), c += 1, i += l * parseFloat(p.dataset.price), t.cartIdList += p.dataset.id + ","
					}
				}
				o += i, n += l;
				var g = s.querySelector(".cart-total"),
					f = s.querySelector(".cart-goods");
				s.querySelector(".cart-attr").innerHTML = l, f.innerHTML = c, g.innerHTML = i.toFixed(2)
			}
			t.cartIdList = t.cartIdList.substr(0, t.cartIdList.length - 1), t.cartTotal.innerHTML = o.toFixed(2), t.cartCount.innerHTML = n
		},
		getThisBtn: function() {
			return e.querySelectorAll("._self-group")
		},
		set$thisGroup: function(e) {
			for(var a = e.this.getThisBtn(), o = 0; o < a.length; o++) t(a[o]).plusMinusBtn({
				max: a[o].getAttribute("data-stock"),
				buyQty: a[o].getAttribute("data-qty"),
				quantity: a[o].getAttribute("data-quantity"),
				btnClass: "input-group-btn mui-btn",
				btnCssText: "",
				buyNumberCssText: "",
				buyNumberClass: "mui-input-group",
				stockClass: "shop-stock mui-color-000",
				isShowStock: !1,
				min: parseInt(a[o].getAttribute("data-stock")) > 0 ? 1 : 0,
				onPlus: function(t) {
					t.btnGroup.setAttribute("data-qty", t.getBuyNum()), e.this.udapteCartItems(e, t)
				},
				onMinus: function(t) {
					t.btnGroup.setAttribute("data-qty", t.getBuyNum()), e.this.udapteCartItems(e, t)
				},
				onChange: function(t) {
					t.btnGroup.setAttribute("data-qty", t.getBuyNum()), e.this.udapteCartItems(e, t)
				}
			}, !0)
		},
		udapteCartItems: function(t, e) {
			var a = {
					quantity: e.getBuyNum(),
					id: e.btnGroup.dataset.id
				},
				o = {
					urlPath: t.updateCartUrl,
					data: a,
					onSuccess: function(e) {
						1 == e.head.bcode && e.data.result ? (console.log("修改成功"), setTimeout(function() {
							t.this.reckonCartTotal(t)
						}, 300)) : common.alert({
							msg: e.head.bmessage || "修改出错"
						})
					},
					onError: function() {
						console.log("失败回调")
					}
				};
			AjaxCommon.getAjaxRequestJson(o)
		},
		findListcheckBox: function(t) {
			return t.listContainer.querySelectorAll('input[type="checkbox"]')
		},
		findListCheckboxByElement: function(t) {
			return t.querySelectorAll('input[type="checkbox"]')
		},
		deleteCart: function(t, e, a) {
			var o = "",
				n = {
					idList: t.cartIdList
				};
			"delete" == e ? o = t.deleteCartUrl : "all" == e && (o = t.clearAllCartUrl, n = {});
			var r = {
				urlPath: o,
				data: n,
				onSuccess: function(t) {
					1 == t.head.bcode ? "function" == typeof a && a(n) : common.alert({
						msg: t.head.bmessage || "修改出错"
					})
				},
				onError: function() {
					console.log("失败回调")
				}
			};
			AjaxCommon.getAjaxRequestJson(r)
		},
		deleteAfter: function(a) {
			if(a.cartAll.checked) window.location.reload();
			else {
				t(a.this.findListcheckBox(a)).each(function() {
					var t = this;
					if(t.checked)
						if(t.classList.contains(a.supplierClassName)) {
							var o = t.dataset.supid,
								n = ".sup-" + o,
								r = e.querySelector(n);
							null != r && a.listContainer.removeChild(r)
						} else if(t.classList.contains(a.goodsClassName)) {
						var s = t.dataset.gid,
							i = ".goods-" + s,
							l = e.querySelector(i);
						null != l && l.parentNode.removeChild(l)
					} else if(t.classList.contains(a.attrClassName)) {
						var s = t.dataset.attrgid,
							i = ".goods-" + s,
							c = e.querySelector(i);
						if(null != c) {
							var d = c.querySelectorAll("." + a.goodsClassName);
							d.each(function() {
								s == this.dataset.gid && c.parentNode.removeChild(c)
							})
						}
					}
				})
			}
		},
		submitToOrder: function(t) {
			for(var a = {
					goodsItems: [],
					supplierItems: []
				}, o = e.getElementsByClassName("tmpl-cart-model"), n = 0; n < o.length; n++)
				for(var r = o[n], s = r.querySelectorAll(".tmpl-goods-box"), i = r.querySelectorAll(".tmpl-goods-attr"), l = 0; l < i.length; l++) {
					var c = s[l],
						d = i[l];
					if(d.checked) {
						var u = "._self-group-" + d.dataset.inputattrid,
							m = e.querySelector(u);
						a.goodsItems.push({
							goodsAttributeId: parseFloat(d.dataset.inputattrid),
							goodsId: parseFloat(c.dataset.gid),
							quantity: parseFloat(m.dataset.qty)
						}), a.supplierItems.push({
							isNeedLogistic: 1,
							supplierId: parseFloat(c.dataset.supid)
						})
					}
				}
			var h = t.subOrderUrl + "?orderStr=" + window.encodeURIComponent(JSON.stringify(a));
			setTimeout(function() {
				window.location.href = h
			}, 300)
		}
	};
	window.cart = a
}(mui, document);