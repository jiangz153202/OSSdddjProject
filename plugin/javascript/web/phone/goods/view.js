; + (function(mui, doc) {
	var model = {
		init: function(options) {
			options = this.setOptions(options || {});
			if(options.catId == '') {
				common.alert({
					msg: "请求出错"
				});
				mui.init();
				setTimeout(function() {
					window.history.go(-1)
				}, 1500);
				retrun
			};
			AjaxCommon.cookieItem.getCookie('dddjsid', function(sid) {
				options.sid = sid;
				options.this.initPage(options)
			});
		},
		setOptions: function(options) {
			options.this = this;
			options.data = null;
			options.bodyContainer = doc.getElementById('body-container');
			options.footer = doc.getElementById('tmpl-footer');
			options.tmplEmpty = doc.getElementById('tmpl-model-null').innerHTML;
			options.tmplLoading = doc.getElementById('tmpl-model-loading').innerHTML;
			options.pullrefresh = mui('#pullrefresh');
			options.catId = common.queryToJSON().catId == undefined ? "492" : common.queryToJSON().catId;
			options.defaultCartPopover = "popover-cart";
			options.goodsDetailUrl = common.config.appPath + "/api/goods/detail";
			options.goodsDetailViewUrl = common.config.appPath + "/api/goods/desc";
			options.findCommentCountUrl = common.config.appPath + "/api/goods/listReviews";
			options.findByGoodsUrl = common.config.appPath + "/goods/comment/findByGoods.json";
			options.findByGoodsImagesUrl = common.config.appPath + "/goods/comment/image/list.json";
			options.addCartUrl = common.config.appPath + "/api/cart/add";
			options.subOrderUrl = common.config.rootPath + "/order/order.html";
			options.subCartUrl = common.config.rootPath + "/cart/index.html";
			options.getGuessUrl = common.config.appPath + '/api/goods/list';
			options.limit = 20;
			options.lazyLoad = mui(options.bodyContainer).imageLazyload({ autoDestroy: false});
			return options
		},
		initPage: function(options) {
			var optObjs = {
				urlPath: options.goodsDetailUrl,
				data: {
					id: options.gid,
					sid: options.sid
				},
				onSuccess: function(result) {
					if(result.status == 0) {
						options.result = result;
						options.this.tmplBody(options)
					} else {
						common.alert({
							msg: result.msg || '读取出错'
						})
					}
				},
				onError: function() {
					doc.body.innerHTML = options.tmplEmpty;
					console.log('失败回调')
				}
			};
			AjaxCommon.getAjaxRequestJson(optObjs)
		},
		tmplBody: function(options) {
			var share = {
				title: options.result.data.name,
				link: window.location.href.split("#")[0],
				imgUrl: options.result.data.imgUrl,
				desc: "DD订酒,随手就有,最快19分钟送达!"
			};
			var _options = {
				shareData: share
			};
			_wxShareApi.wechatConfig(_options, function() {
				_wxShareApi.shareWx(_options, share)
			});
			var html = template('tmpl-model', options.result.data);
			options.bodyContainer.innerHTML = html;
			var footerHTML = template('tmpl-footer', options.result.data);
			common.insertHTML(options.bodyContainer, 'beforebegin', footerHTML);
			for(var i = 0; i < options.result.data.activities.length; i += 1) {
				if(options.result.data.activities[i].timeLimit != null) {
					var timelimit = options.result.data.activities[i].timeLimit;
					options.this.initTimelimit(options, timelimit)
				}
			}
			if(options.result.data.activities[0].dailySeckill != null) {
				options.this.initDaliyItems(options)
			} else {
				options.this.initPopoverCartItem(options)
			}
			options.this.initcomponents(options)
		},
		initcomponents: function(options) {
			var deceleration = mui.os.ios ? 0.003 : 0.0009;
			mui('.mui-scroll-wrapper').scroll({
				bounce: false,
				indicators: false,
				deceleration: deceleration
			});
			mui('.mui-slider').slider({
				interval: 1500
			});
			document.body.dataset.pageindex == 0;
			mui.init();
			options.lazyLoad.refresh(true);
			AjaxCommon.pageInit('.taobap-footer');
			var review_status = false;
			mui('#segmentedControl').on('tap', '.mui-control-item', function() {
				var $this = this;
				if(($this.innerText.trim()).indexOf('商品详情') > 0){
					mui('#item1mobile')[0].classList.add('mui-active');
					mui('#item2mobile')[0].classList.remove('mui-active');
				}else if(($this.innerText.trim()).indexOf('评价') > 0){
					mui('#item1mobile')[0].classList.remove('mui-active');
					mui('#item2mobile')[0].classList.add('mui-active');
					if(!review_status) {
						console.log('已经加载过了');
						review_status = true;
						options.this.pullUpLoadGoodsGroup(options, null)
					}
				}
			});
			options.this.loadForGoodsView(options);
			options.this.loadGuessLike(options)
		},
		loadGuessLike: function(options) {
			options.guessContainer = doc.getElementById('guess-container');
			var optObjs = {
				urlPath: options.getGuessUrl,
				data: {
					pageIndex: 1,
					pageSize: 6,
					sid: options.sid
				},
				onBeforeSend: function() {},
				onSuccess: function(result) {
					if(result.status == 0) {
						var html = template('tmpl-guess', result.data);
						options.guessContainer.innerHTML += html;
						options.lazyLoad.refresh(true);
					}
				},
				onError: function() {
					console.log('失败回调')
				}
			};
			AjaxCommon.getAjaxRequestJson(optObjs)
		},
		loadForGoodsView: function(options) {
			var listContainer = doc.getElementById('details-container');
			var optObjs = {
				urlPath: options.goodsDetailViewUrl,
				data: {
					id: options.gid,
					sid: options.sid
				},
				isHeader: false,
				onBeforeSend: function() {
					listContainer.innerHTML = options.tmplLoading
				},
				onSuccess: function(result) {
					if(result != 'fail') {
						if(result.status == 0) {
							listContainer.innerHTML = result.data;
							options.lazyLoad.refresh(true);
						} else {
							if(result.data.length == 0 && listContainer.innerHTML.trim() == '') {
								listContainer.innerHTML = options.tmplEmpty
							}
						}
					} else {
						listContainer.innerHTML = options.tmplEmpty
					}
				},
				onError: function() {
					console.log('失败回调')
				}
			};
			AjaxCommon.getAjaxRequestJson(optObjs)
		},
		loadCommentUrl: function(options) {
			var result = {
				data: [{
					"name": "好评",
					"count": 0,
					"commentType": 5
				}]
			};
			var reviewContainer = document.querySelector('#item3mobile');
			var html = template('tmpl-comment', result);
			reviewContainer.innerHTML = html;
			var reviewHeader = reviewContainer.querySelector('.review-header');
			reviewHeader.classList.add('mui-hide');
			var reviewContainers = options.bodyContainer.querySelectorAll('#item3mobile .review-container');
			var reviewListContainers = options.bodyContainer.querySelectorAll('#item3mobile .review-container .list-container');
			for(var int = 0; int < reviewContainers.length; int += 1) {
				var array_element = reviewContainers[int];
				array_element.style.minHeight = (window.screen.height - 44 - 42 - 60) + "px";
				reviewListContainers[int].style.minHeight = (window.screen.height - 44 - 42 - 60) + "px"
			};
			var deceleration = mui.os.ios ? 0.003 : 0.0009;
			mui('.mui-scroll-wrapper').scroll({
				bounce: false,
				indicators: false,
				deceleration: deceleration
			});
			mui.each(options.this.getScrollContainers(), function(index, pullRefreshEl) {
				mui(pullRefreshEl).pullToRefresh({
					up: {
						callback: function() {
							var self = this;
							options.this.pullUpLoadGoodsGroup(options, self)
						}
					}
				})
			});
			if(mui.os.plus) {
				mui.plusReady(function() {
					setTimeout(function() {
						options.this.pullUpLoading(options)
					}, 1000)
				})
			} else {
				mui.ready(function() {
					options.this.pullUpLoading(options)
				})
			}
			mui('#item3mobile').on('tap', '.mui-control-item', function() {
				setTimeout(function() {
					options.this.pullUpLoading(options)
				}, 300)
			})
		},
		findByGoods: function(options) {
			var Container = document.querySelector('#item3mobile .list-container');
			pluginTmpl.appendTmplByBody(Container, reviewResult)
		},
		pullUpLoading: function(options) {
			var ProductContainer = options.this.getActiveProductContainer();
			var scrollContainers = options.this.getScrollContainers();
			var activeContainer = ProductContainer.querySelector('.list-container');
			if(activeContainer.innerHTML.trim() === '' && activeContainer.dataset.pageindex == '0') {
				var _thisIndex = activeContainer.dataset.index;
				mui(scrollContainers[_thisIndex]).pullToRefresh().pullUpLoading()
			}
		},
		getActiveProductContainer: function() {
			return doc.querySelector('#item3mobile .mui-control-content.mui-active')
		},
		getScrollContainers: function() {
			return mui(document.querySelectorAll('#item3mobile .mui-scroll'))
		},
		pullUpLoadGoodsGroup: function(options, _selfPullRefresh) {
			var listContainer = doc.getElementById('item2mobile');
			var optObjs = {
				urlPath: options.findCommentCountUrl,
				data: {
					id: options.gid,
					sid: options.sid,
					pageIndex: 1,
					pageSize: 100
				},
				isHeader: false,
				onSuccess: function(result) {
					if(result.status == 0) {
						var html = template('tmpl-comment-item', result);
						listContainer.innerHTML += html;
						AjaxCommon.lazyloadTmpl(listContainer);
						if(result.data.content.length == 0) {
							listContainer.innerHTML = options.tmplEmpty
						}
						if(listContainer.querySelector('.spinner-child') != null) {
							listContainer.querySelector('.spinner-child').classList.add('mui-hide')
						}
					} else {}
				},
				onError: function() {
					console.log('失败回调')
				}
			};
			AjaxCommon.getAjaxRequestJson(optObjs)
		},
		initPopoverCartItem: function(options) {
			var html = template('tmpl-cart', options.result.data);
			var muiContent = doc.querySelector('.mui-content');
			common.insertHTML(muiContent, 'afterend', html);
			
			mui(options.bodyContainer).imageLazyload();
			mui('body').on('tap', '.footerbuy,.mui-table-view-cart', function() {
				mui("#" + options.defaultCartPopover).popover('toggle')
			});
			doc.querySelector('.mui-sku-close').addEventListener('tap', function() {
				mui("#" + options.defaultCartPopover).popover('toggle')
			});
			options.this.initPopoverCart(options);
			options.this.set$thisGroup(options);
			options.this.initSubmit(options);
		},
		checkData: function(options) {
			var status = true;
			if(options.result.data.skus != null && options.result.data.skus.size > 0 && options.result.data.skus.short_vals != undefined) {
				var selectedSkuBtns = doc.querySelectorAll('#popover-cart .mui-sku-attr button.mui-active');
				if(options.result.data.skus.short_vals.length != selectedSkuBtns.length) {
					common.alert({
						msg: doc.querySelector('.sku-attrStr').innerHTML
					});
					status = false
				}
			}
			var _this_input_group = options.this.getThisBtn()[0];
			var _this_input_group_value = _this_input_group.dataset.stock;
			if(_this_input_group_value == 0) {
				common.alert({
					msg: "库存不足"
				});
				status = false
			}
			return status
		},
		submitToOrder: function(options) {
			var _this_input_group = options.this.getThisBtn()[0];
			var _this_input_group_value = parseInt(_this_input_group.querySelector('input').value);
			var sku = options.result.data.id + "-" + (_this_input_group.dataset.goodsattrid == 'undefined' ? '' : _this_input_group.dataset.goodsattrid) + "-" + _this_input_group_value;
			var rootPathUrl = options.subOrderUrl + "?orderStr=" + sku;
			setTimeout(function() {
				window.location.href = rootPathUrl
			}, 300)
		},
		submitOrderOrCart: function(options) {
			var _this_input_group = options.this.getThisBtn()[0];
			var _this_input_group_value = parseInt(_this_input_group.querySelector('input').value);
			var sku = options.result.data.id + "-" + (_this_input_group.dataset.goodsattrid == 'undefined' ? '' : _this_input_group.dataset.goodsattrid) + "-" + _this_input_group_value;
			var dataCallback = null;
			dataCallback = function(result) {
				mui.toast('加入购物车成功!')
			};
			var optObjs = {
				urlPath: options.addCartUrl,
				data: {
					itemStr: sku
				},
				onSuccess: function(result) {
					console.log(JSON.stringify(result));
					if(result.status == 0) {
						dataCallback && typeof(dataCallback) === "function" && dataCallback(result)
					} else {
						common.alert({
							msg: '提交出错'
						})
					}
				},
				onError: function() {
					console.log('失败回调')
				},
				onComplete: function() {
					mui("#" + options.defaultCartPopover).popover('toggle')
				}
			};
			AjaxCommon.getAjaxRequestJson(optObjs)
		},
		initSubmit: function(options) {
			mui('.mui-sku-footer').on('tap', '.mui-sku-btn', function() {
				var $this = this;
				switch($this.dataset.type) {
					case "cart":
						var data = options.this.checkData(options);
						data && options.this.submitOrderOrCart(options);
						break;
					case "order":
						var data = options.this.checkData(options);
						data && options.this.submitToOrder(options);
						break;
					default:
						console.log('默认操作');
						break
				}
			})
		},
		initPopoverCart: function(options) {
			if(options.result.data.skus != null) {
				var skuattrs = doc.querySelectorAll('.mui-sku-attr');
				var sukDatas = options.result.data.skus.vals;
				var sukcache = [];
				sukDatas.forEach(function(item,index){
					if(item.stock >　0){
						sukcache.push(item);
					}
				})
				if(skuattrs.length > 0) {
					var $this=null;
					switch (skuattrs.length){
						case 1:
							/*如果是单个*/
							$this = document.querySelector('button[data-itemid="'+sukcache[0].id_01+'"]');
							$this.classList.add('mui-active');
							break;
						case 2:
							/*如果是两个*/
							$this = document.querySelector('button[data-itemid="'+sukcache[0].id_01+'"]');
							$this.classList.add('mui-active');
							document.querySelector('button[data-itemid="'+sukcache[0].id_02+'"]').classList.add('mui-active');
							break;
						default:
							break;
					}
					options.this.checkPopover(options, $this)
				}
			}
			
			
			mui('#popover-cart').on('tap', '.mui-button', function() {
				var $this = this;
				var $this_attr = this.parentNode;
				var $childs_btn = $this_attr.querySelectorAll('.mui-button');
				for(var i = 0; i < $childs_btn.length; i += 1) {
					if($this != $childs_btn[i]) {
						$childs_btn[i].classList.remove('mui-active')
					}
				};
				this.classList.toggle('mui-active');
				var result_ids = options.this.getIsAllCheck();
				if($this.classList.contains('mui-active')) {
					options.this.checkPopover(options, $this);
				} else {
					var attrItem = {
						price: options.result.data.price,
						stock: options.result.data.stock
					};
					var _attrItemName = "请选择 " + $this_attr.querySelector('.mui-sku-attrname').innerHTML;
					options.this.setSkuCartStatus(options, attrItem, _attrItemName)
				}
			});
			if(options.result.data.skus == null) {
				var attrItem = {
					price: options.result.data.price,
					stock: options.result.data.stock
				};
				var _attrItemName = "请选择购买数量";
				options.this.setSkuCartStatus(options, attrItem, _attrItemName)
			}
		},
		checkPopover: function(options, $this) {
			var result_ids = options.this.getIsAllCheck();
			var size = options.result.data.skus.size;
			var vals = options.result.data.skus.vals;
			for(var i = 0; i < vals.length; i += 1) {
				switch(size) {
					case 1:
						if(vals[i].id_01 == result_ids[0]) {
							var attrItemName = $this.innerHTML.trim();
							options.this.setSkuCartStatus(options, vals[i], attrItemName)
						}
						break;
					case 2:
						if(vals[i].id_01 == result_ids[0] && vals[i].id_02 == result_ids[1]) {
							var attrItemName = vals[i].name_01 + " " + vals[i].name_02;
							options.this.setSkuCartStatus(options, vals[i], attrItemName)
						}
						break;
					default:
						console.log('检测sku错误');
						break
				}
			}
		},
		getIsAllCheck: function() {
			var skuattrs = doc.querySelectorAll('.mui-sku-attr');
			if(skuattrs.length > 0) {
				var ids = [skuattrs.length];
				for(var a = 0; a < skuattrs.length; a += 1) {
					var skuButtons = skuattrs[a].querySelectorAll('.mui-button');
					for(var b = 0; b < skuButtons.length; b += 1) {
						if(skuButtons[b].classList.contains('mui-active')) {
							ids[a] = skuButtons[b].dataset.itemid
						}
					}
				}
				//console.log(ids);
				return ids
			}
			return null
		},
		setSkuCartStatus: function(options, attrItem, attrItemName) {
			var popoVerCartItem = options.this.getSkuOpts();
			popoVerCartItem.skuPrice.innerHTML = attrItem.price;
			popoVerCartItem.skuStock.innerHTML = attrItem.stock;
			for(var i in popoVerCartItem.skuAttrs) {
				popoVerCartItem.skuAttrs[i].innerHTML = attrItemName
			}
			if(attrItem.imgUrl != undefined){
				popoVerCartItem.skuImg.setAttribute('src',attrItem.imgUrl);
			}
			for(var i = 0; i < options.this.getThisBtn().length; i += 1) {
				var _selfGroup = options.this.getThisBtn()[i];
				_selfGroup.dataset.price = attrItem.price;
				_selfGroup.dataset.stock = attrItem.stock;
				_selfGroup.dataset.goodsattrid = attrItem.id;
				if(attrItem.stock < _selfGroup.dataset.qty) {
					_selfGroup.dataset.qty = attrItem.stock
				}
			}
			options.this.set$thisGroup(options)
		},
		setCountStock: function(options) {
			var countStock = 0;
			var datas = options.result.data.goodsAttributes;
			for(var i = 0; i < datas.length; i += 1) {
				countStock += datas[i].stock
			}
			return countStock
		},
		getSkusCount: function(options) {
			return options.result.data.skus.size
		},
		getSkuOpts: function() {
			var data = {
				skuImg: doc.querySelector('#popover-cart .mui-sku-object'),
				skuPrice: doc.querySelector('#popover-cart .sku-price'),
				skuStock: doc.querySelector('#popover-cart .sku-stock'),
				skuAttrs: doc.querySelectorAll('.sku-attrStr'),
				skuAttrId: 0,
				skuGoodsId: 0
			};
			return data
		},
		getThisBtn: function() {
			return doc.querySelectorAll('._self-group')
		},
		set$thisGroup: function(options) {
			var btnGroups = options.this.getThisBtn();
			for(var i = 0; i < btnGroups.length; i += 1) {
				mui(btnGroups[i]).plusMinusBtn({
					max: btnGroups[i].getAttribute('data-stock'),
					buyQty: btnGroups[i].getAttribute('data-qty'),
					quantity: btnGroups[i].getAttribute('data-quantity'),
					btnClass: 'input-group-btn mui-btn',
					btnCssText: '',
					buyNumberCssText: '',
					buyNumberClass: 'mui-input-group',
					stockClass: 'shop-stock mui-color-000',
					isShowStock: false,
					min: 1,
					onPlus: function(e) {
						e.btnGroup.setAttribute('data-qty', e.getBuyNum());
					},
					onMinus: function(e) {
						e.btnGroup.setAttribute('data-qty', e.getBuyNum());
					},
					onChange: function(e) {
						e.btnGroup.setAttribute('data-qty', e.getBuyNum());
					}
				}, true)
			}
		},
		initTimelimit: function(options, timelimit) {
			options.seckillBtn = doc.getElementById('seckill-btn');
			var timestamp = doc.querySelector('.timer');
			var starttime = timestamp.dataset.starttime;
			var endtime = timestamp.dataset.endtime;
			var startDate = new Date(starttime.replace(new RegExp("-", "gm"), "/"));
			var endDate = new Date(endtime.replace(new RegExp("-", "gm"), "/"));
			var nowTime = new Date().getTime();
			var $this_time_status = timestamp.querySelector('.time-status');
			var $this_time_h = timestamp.querySelector('.time-h');
			var $this_time_m = timestamp.querySelector('.time-m');
			var $this_time_s = timestamp.querySelector('.time-s');
			if(startDate.getTime() > nowTime) {
				$this_time_status.innerText = "距限时抢购开始";
				options.seckillBtn.classList.add('qc-bg-color-888-img');
				options.seckillBtn.classList.add("mui-disabled");
				options.seckillBtn.innerHTML = "还未开始";
				options.this.shutdown(startDate.getTime(), function(data) {
					$this_time_h.innerHTML = data.h;
					$this_time_m.innerHTML = data.m;
					$this_time_s.innerHTML = data.s;
				});
			} else if(nowTime > startDate.getTime() && nowTime < endDate.getTime()) {
				console.log('活动进行中');
				$this_time_status.innerText = "距限时抢购结束";
				options.this.shutdown(endDate.getTime(), function(data) {
					$this_time_h.innerHTML = data.h;
					$this_time_m.innerHTML = data.m;
					$this_time_s.innerHTML = data.s
				});
			} else if(nowTime > endDate.getTime()) {
				console.log('已结束');
				$this_time_status.innerText = "限时抢购已结束";
				options.seckillBtn.classList.add('qc-bg-color-888-img');
				options.seckillBtn.classList.add("mui-disabled");
				options.seckillBtn.innerHTML = "限时抢购已结束";
				timestamp.innerHTML = "当前活动未到时间";
				timestamp.classList.add('mui-badge')
			}
			var optObjs = {
				urlPath: common.config.appPath + '/api/order/leftCountToday',
				data: {
					gid: options.gid
				},
				onSuccess: function(result) {
					var restDailtNumber = result;
					var muiBoxs = doc.querySelector('.qc-bar-navs .mui-numbox ');
					muiBoxs.setAttribute('data-numbox-step', 1);
					muiBoxs.setAttribute('data-numbox-min', restDailtNumber == 0 ? 0 : 1);
					muiBoxs.setAttribute('data-numbox-max', restDailtNumber);
					mui('.mui-numbox').numbox();
					var resets = doc.querySelectorAll('.reset-number');
					for(var i = 0; i < resets.length; i += 1) {
						resets[i].innerHTML = restDailtNumber
					}
					if(restDailtNumber == 0) {
						options.seckillBtn.classList.add('qc-bg-color-888-img');
						options.seckillBtn.classList.add("mui-disabled");
						options.seckillBtn.innerHTML = "暂无资格"
					} else {
						options.seckillBtn.addEventListener('tap', function() {
							var sku = options.gid + '--' + mui('.mui-numbox').numbox().getValue();
							if(!options.seckillBtn.classList.contains('mui-disabled')) {
								var rootPathUrl = options.subOrderUrl + "?orderStr=" + sku;
								setTimeout(function() {
									window.location.href = rootPathUrl
								}, 300)
							}
						})
					}
				},
				onError: function() {
					console.log('失败回调');
					options.seckillBtn.classList.add('qc-bg-color-888-img');
					options.seckillBtn.classList.add("mui-disabled");
					options.seckillBtn.innerHTML = "暂无资格"
				},
				onComplete: function() {}
			};
			AjaxCommon.getAjaxRequestJson(optObjs)
		},
		initDaliyItems: function(options) {
			options.seckillBtn = doc.getElementById('seckill-btn');
			var timestamp = doc.querySelector('.timer');
			options.this.timestamp(options, timestamp);
			var optObjs = {
				urlPath: common.config.appPath + '/api/dailySeck/countToday',
				data: {
					gid: options.gid
				},
				onSuccess: function(result) {
					console.log(JSON.stringify(result));
					var dailyGoods = options.result.data.activities[0].dailySeckill;
					var restDailtNumber = dailyGoods.everyDayAmount - result;
					var muiBoxs = doc.querySelector('.qc-bar-navs .mui-numbox ');
					muiBoxs.setAttribute('data-numbox-step', dailyGoods.origin);
					muiBoxs.setAttribute('data-numbox-min', restDailtNumber == 0 ? 0 : dailyGoods.origin);
					muiBoxs.setAttribute('data-numbox-max', restDailtNumber);
					mui('.mui-numbox').numbox();
					var resets = doc.querySelectorAll('.reset-number');
					for(var i = 0; i < resets.length; i += 1) {
						resets[i].innerHTML = restDailtNumber
					}
					if(restDailtNumber == 0) {
						options.seckillBtn.classList.add('qc-bg-color-888-img');
						options.seckillBtn.classList.add("mui-disabled");
						options.seckillBtn.innerHTML = "暂无资格"
					} else {
						options.seckillBtn.addEventListener('tap', function() {
							var sku = options.gid + '--' + mui('.mui-numbox').numbox().getValue();
							if(!options.seckillBtn.classList.contains('mui-disabled')) {
								var rootPathUrl = options.subOrderUrl + "?orderStr=" + sku;
								setTimeout(function() {
									window.location.href = rootPathUrl
								}, 300)
							}
						})
					}
				},
				onError: function() {
					console.log('失败回调')
				},
				onComplete: function() {}
			};
			AjaxCommon.getAjaxRequestJson(optObjs);
		},
		timestamp: function(options, timestamp) {
			var $this = timestamp;
			var $this_time_status = $this.querySelector('.time-status');
			var $this_time_h = $this.querySelector('.time-h');
			var $this_time_m = $this.querySelector('.time-m');
			var $this_time_s = $this.querySelector('.time-s');
			setTimeout(function() {
				var starttime = $this.dataset.starttime;
				var endtime = $this.dataset.endtime;
				var startArray = starttime.split(':');
				var endArray = endtime.split(':');
				var startDate = new Date();
				var endDate = new Date();
				if(startArray[0] != undefined) {
					startDate.setHours(startArray[0])
				}
				if(startArray[1] != undefined) {
					startDate.setMinutes(startArray[1])
				}
				if(startArray[2] != undefined) {
					startDate.setSeconds(startArray[2])
				}
				if(endArray[0] != undefined) {
					endDate.setHours(endArray[0])
				}
				if(endArray[1] != undefined) {
					endDate.setMinutes(endArray[1])
				}
				if(endArray[2] != undefined) {
					endDate.setSeconds(endArray[2])
				}
				var nowTime = new Date().getTime();
				if(startDate.getTime() > nowTime) {
					$this_time_status.innerText = "距今日开始";
					options.seckillBtn.classList.add('qc-bg-color-888-img');
					options.seckillBtn.classList.add("mui-disabled");
					options.seckillBtn.innerHTML = "还未开始";
					options.this.shutdown(startDate.getTime(), function(data) {
						$this_time_h.innerHTML = data.h;
						$this_time_m.innerHTML = data.m;
						$this_time_s.innerHTML = data.s;
					});
				} else if(nowTime > startDate.getTime() && nowTime < endDate.getTime()) {
					console.log('活动进行中');
					$this_time_status.innerText = "距今日结束";
					options.this.shutdown(endDate.getTime(), function(data) {
						$this_time_h.innerHTML = data.h;
						$this_time_m.innerHTML = data.m;
						$this_time_s.innerHTML = data.s
					});
				} else if(nowTime > endDate.getTime()) {
					console.log('已结束');
					$this_time_status.innerText = "今日已结束";
					options.seckillBtn.classList.add('qc-bg-color-888-img');
					options.seckillBtn.classList.add("mui-disabled");
					options.seckillBtn.innerHTML = "今日已结束";
					timestamp.innerHTML = "当前活动未到时间";
					timestamp.classList.add('mui-badge')
				}
			}, 100)
		},
		shutdown: function(timestamp, onCallBack) {
			var time_i = setInterval(function() {
				var result_timestamp = timestamp - (new Date().getTime());
				if(result_timestamp < 1000) {
					clearInterval(time_i);
					window.location.reload();
					return
				}
				var hh = parseInt(result_timestamp / 1000 / 60 / 60 % 24, 10);
				var mm = parseInt(result_timestamp / 1000 / 60 % 60, 10);
				var ss = parseInt(result_timestamp / 1000 % 60, 10);
				var data = {
					h: hh < 10 ? "0" + hh : hh,
					m: mm < 10 ? "0" + mm : mm,
					s: ss < 10 ? "0" + ss : ss
				};
				typeof onCallBack === 'function' && onCallBack(data)
			}, 1000)
		}
	};
	window.goodsview = model
})(mui, document);