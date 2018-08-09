+ function(t, e) {
	var r = {
		init: function(t) {
			t = this.setOptions(t || {}), this.initPage(t)
		},
		setOptions: function(r) {
			return r.this = this, r.searchContainer = e.getElementById("search-logs"), r.listContainer = e.getElementById("list-container"), r.getGoodsUrl = common.config.appPath + "/api/goods/search", r.searchInput = e.getElementById("search-input"), r.sv = void 0 === common.queryToJSON().sv ? "" : common.queryToJSON().sv, r.pullrefresh = t("#pullrefresh"), r.goodsDetailUrl = common.config.appPath + "/api/goods/detail", r.addCartUrl = common.config.appPath + "/api/cart/add", r.subOrderUrl = common.config.rootPath + "/order/order", r.subCartUrl = common.config.rootPath + "/cart/index", r.defaultCartPopover = "popover-cart", r
		},
		initPage: function(r) {
			t.init({
				pullRefresh: {
					container: "#pullrefresh",
					up: {
						contentrefresh: "正在加载...",
						contentnomore: "没有更多数据了！",
						callback: function() {
							r.this.pullupRefresh(r)
						}
					}
				}
			}), "" != r.sv && (r.searchInput.value = r.sv, e.querySelector(".mui-search").classList.add("mui-active"), r.this.initPullReFresh(r)), null != r.searchInput && r.searchInput.addEventListener("keypress", function(t) {
				if(13 === t.keyCode) {
					if("" == r.searchInput.value) return common.alert({
						msg: "请输入要搜索的商品名称"
					}), !1;
					r.listContainer.querySelector(".list-container").innerHTML = "", r.pullrefresh.pullRefresh().finished ? r.this.reloadPullReFresh(r) : r.this.initPullReFresh(r)
				}
			})
		},
		initPullReFresh: function(e) {
			document.body.setAttribute("data-pageIndex", 0), t.os.plus ? t.plusReady(function() {
				setTimeout(function() {
					e.pullrefresh.pullRefresh().pullupLoading()
				}, 1e3)
			}) : t.ready(function() {
				e.pullrefresh.pullRefresh().pullupLoading()
			})
		},
		reloadPullReFresh: function(t) {
			document.body.setAttribute("data-pageIndex", 0), t.listContainer.querySelectorAll(".list-container").innerHTML = "", t.pullrefresh.pullRefresh().refresh(!0), t.pullrefresh.pullRefresh().scrollTo(0, 0, 100), setTimeout(function() {
				t.pullrefresh.pullRefresh().pullupLoading()
			}, 300)
		},
		pullupRefresh: function(r) {
			var o = e.body.getAttribute("data-pageIndex");
			o = parseInt(o) + 1, e.body.setAttribute("data-pageIndex", o), console.log("1");
			var n = r.listContainer.querySelector(".list-container"),
				s = {
					urlPath: r.getGoodsUrl,
					data: {
						pageIndex: o,
						pageSize: 10,
						sid: AjaxCommon.cookieItem.getCookie("dddjsid"),
						sval: r.searchInput.value
					},
					isHeader: !1,
					onBeforeSend: function() {
						null != r.listContainer.querySelector(".qc-car-null") && r.listContainer.querySelector(".qc-car-null").classList.add("mui-hide")
					},
					onSuccess: function(e) {
						if(0 == e.status)
							if(null != e.data && e.data.content.length > 0) {
								var o = template("tmpl-goods", e.data);
								n.innerHTML += o, r.pullrefresh.pullRefresh().endPullupToRefresh(!e.data.hasNextPage), n.removeAttribute("data-imagelazyload"), t(n).imageLazyload({
									placeholder: "http://www.dcloud.io/hellomui/images/60x60.gif"
								}), r.this.pullrefreshInit(r)
								r.pullrefresh.pullRefresh().endPullupToRefresh(!0)
							} else r.pullrefresh.pullRefresh().endPullupToRefresh(!0), "" == n.innerHTML.trim() && null == r.listContainer.querySelector(".qc-car-null") ? n.parentNode.innerHTML += document.getElementById("tmpl-model-null").innerHTML : r.listContainer.querySelector(".qc-car-null").classList.remove("mui-hide");
						else common.alert({
							msg: e.msg || "读取出错"
						})
					},
					onError: function() {
						console.log("失败回调"), r.pullrefresh.pullRefresh().endPullupToRefresh(!0), "" == n.innerHTML.trim() && null == r.listContainer.querySelector(".qc-car-null") ? n.parentNode.innerHTML += document.getElementById("tmpl-model-null").innerHTML : r.listContainer.querySelector(".qc-car-null").classList.remove("mui-hide")
					}
				};
			AjaxCommon.getAjaxRequestJson(s)
		},
		pullrefreshInit: function(r) {
			t(".list-container").off("tap"), AjaxCommon.pageInit(".list-container"), t(".list-container").on("tap", ".mui-media-price", function(t) {
				event.stopPropagation(), event.preventDefault()
			}), t(".list-container").on("tap", ".mui-media-cart", function() {
				var o = this.dataset.gid,
					n = {
						urlPath: r.goodsDetailUrl,
						data: {
							id: o,
							sid: AjaxCommon.cookieItem.getCookie("dddjsid")
						},
						onBeforeSend: function() {},
						onSuccess: function(t) {
							0 == t.status ? (r.result = t, r.this.initPopoverCartItem(r)) : common.alert({
								msg: t.msg || "读取出错"
							})
						},
						onError: function() {
							common.alert({
								msg: "读取出错"
							})
						}
					};
				if(void 0 == r.searchGid || void 0 != r.searchGid && r.searchGid != o) {
					console.log(o + "gid" + r.searchGid), r.searchGid = o, console.log("2" + r.searchGid);
					var s = e.getElementById(r.defaultCartPopover);
					null != s && s.parentElement.removeChild(s), AjaxCommon.getAjaxRequestJson(n)
				} else t("#" + r.defaultCartPopover).popover("toggle")
			})
		},
		initPopoverCartItem: function(r) {
			var o = template("tmpl-cart", r.result.data),
				n = e.querySelector(".mui-content");
			common.insertHTML(n, "afterend", o), t("#" + r.defaultCartPopover).popover("toggle"), e.querySelector(".mui-sku-close").addEventListener("tap", function() {
				t("#" + r.defaultCartPopover).popover("toggle")
			}), r.this.initPopoverCart(r), r.this.set$thisGroup(r), r.this.initSubmit(r)
		},
		checkData: function(t) {
			var r = !0;
			if(null != t.result.data.skus && t.result.data.skus.size > 0) {
				var o = e.querySelectorAll("#popover-cart .mui-sku-attr button.mui-active");
				t.result.data.skus.short_vals.length != o.length && (common.alert({
					msg: "请选择规格"
				}), r = !1)
			}
			return 0 == t.this.getThisBtn()[0].dataset.stock && (common.alert({
				msg: "库存不足"
			}), r = !1), r
		},
		submitToOrder: function(t) {
			var e = t.this.getThisBtn()[0],
				r = parseInt(e.querySelector("input").value),
				o = t.result.data.id + "-" + ("undefined" == e.dataset.goodsattrid ? "" : e.dataset.goodsattrid) + "-" + r,
				n = t.subOrderUrl + "?orderStr=" + o;
			setTimeout(function() {
				window.location.href = n
			}, 300)
		},
		submitOrderOrCart: function(e) {
			var r = e.this.getThisBtn()[0],
				o = parseInt(r.querySelector("input").value),
				n = e.result.data.id + "-" + ("undefined" == r.dataset.goodsattrid ? "" : r.dataset.goodsattrid) + "-" + o,
				s = null;
			s = function(e) {
				t.toast("加入购物车成功!")
			};
			var a = {
				urlPath: e.addCartUrl,
				data: {
					itemStr: n
				},
				onSuccess: function(t) {
					console.log(JSON.stringify(t)), 0 == t.status ? s && "function" == typeof s && s(t) : common.alert({
						msg: "提交出错"
					})
				},
				onError: function() {
					console.log("失败回调")
				},
				onComplete: function() {
					t("#" + e.defaultCartPopover).popover("toggle")
				}
			};
			AjaxCommon.getAjaxRequestJson(a)
		},
		initSubmit: function(e) {
			t(".mui-sku-footer").on("tap", ".mui-sku-btn", function() {
				switch(this.dataset.type) {
					case "cart":
						var t = e.this.checkData(e);
						t && e.this.submitOrderOrCart(e);
						break;
					case "order":
						var t = e.this.checkData(e);
						t && e.this.submitToOrder(e);
						break;
					default:
						console.log("默认操作")
				}
			})
		},
		initPopoverCart: function(e) {
			if(t("#popover-cart").on("tap", ".mui-button", function() {
					for(var t = this, r = this.parentNode, o = r.querySelectorAll(".mui-button"), n = 0; n < o.length; n++) t != o[n] && o[n].classList.remove("mui-active");
					this.classList.toggle("mui-active");
					var s = e.this.getIsAllCheck();
					if(this.classList.contains("mui-active"))
						for(var a = e.result.data.skus.size, i = e.result.data.skus.vals, n = 0; n < i.length; n++) switch(a) {
							case 1:
								if(i[n].id_01 == s[0]) {
									console.log("一个个选项的为" + JSON.stringify(i[n]));
									var u = this.innerHTML.trim();
									e.this.setSkuCartStatus(e, i[n], u)
								}
								break;
							case 2:
								if(i[n].id_01 == s[0] && i[n].id_02 == s[1]) {
									console.log("两个选项的为" + JSON.stringify(i[n]));
									var u = i[n].name_01 + " " + i[n].name_02;
									e.this.setSkuCartStatus(e, i[n], u)
								}
								break;
							default:
								console.log("检测sku错误")
						} else {
							var l = {
									price: e.result.data.price,
									stock: e.result.data.stock
								},
								c = "请选择 " + r.querySelector(".mui-sku-attrname").innerHTML;
							e.this.setSkuCartStatus(e, l, c)
						}
				}), null == e.result.data.skus) {
				var r = {
					price: e.result.data.price,
					stock: e.result.data.stock
				};
				e.this.setSkuCartStatus(e, r, "请选择购买数量")
			}
		},
		getIsAllCheck: function() {
			var t = e.querySelectorAll(".mui-sku-attr");
			if(t.length > 0) {
				for(var r = new Array(t.length), o = 0; o < t.length; o++)
					for(var n = t[o].querySelectorAll(".mui-button"), s = 0; s < n.length; s++) n[s].classList.contains("mui-active") && (r[o] = n[s].dataset.itemid);
				return console.log(r), r
			}
			return null
		},
		setSkuCartStatus: function(t, e, r) {
			var o = t.this.getSkuOpts();
			o.skuPrice.innerHTML = e.price, o.skuStock.innerHTML = e.stock;
			for(var n in o.skuAttrs) o.skuAttrs[n].innerHTML = r;
			for(var n = 0; n < t.this.getThisBtn().length; n++) {
				var s = t.this.getThisBtn()[n];
				s.dataset.price = e.price, s.dataset.stock = e.stock, s.dataset.goodsattrid = e.id, e.stock < s.dataset.qty && (s.dataset.qty = e.stock)
			}
			t.this.set$thisGroup(t)
		},
		setCountStock: function(t) {
			for(var e = 0, r = t.result.data.goodsAttributes, o = 0; o < r.length; o++) e += r[o].stock;
			return e
		},
		getSkusCount: function(t) {
			return t.result.data.skus.size
		},
		getSkuOpts: function() {
			return {
				skuImg: e.querySelector("#popover-cart .mui-sku-object"),
				skuPrice: e.querySelector("#popover-cart .sku-price"),
				skuStock: e.querySelector("#popover-cart .sku-stock"),
				skuAttrs: e.querySelectorAll(".sku-attrStr"),
				skuAttrId: 0,
				skuGoodsId: 0
			}
		},
		getThisBtn: function() {
			return e.querySelectorAll("._self-group")
		},
		set$thisGroup: function(e) {
			for(var r = e.this.getThisBtn(), o = 0; o < r.length; o++) t(r[o]).plusMinusBtn({
				max: r[o].getAttribute("data-stock"),
				buyQty: r[o].getAttribute("data-qty"),
				quantity: r[o].getAttribute("data-quantity"),
				btnClass: "input-group-btn mui-btn",
				btnCssText: "",
				buyNumberCssText: "",
				buyNumberClass: "mui-input-group",
				stockClass: "shop-stock mui-color-000",
				isShowStock: !1,
				min: 1,
				onPlus: function(t) {
					t.btnGroup.setAttribute("data-qty", t.getBuyNum())
				},
				onMinus: function(t) {
					t.btnGroup.setAttribute("data-qty", t.getBuyNum())
				},
				onChange: function(t) {
					t.btnGroup.setAttribute("data-qty", t.getBuyNum())
				}
			}, !0)
		}
	};
	window.goodsSearch = r
}(mui, document);