; + (function(mui, doc) {
	var model = {
		init: function(options) {
			options = this.setOptions(options || {});
			if(options.catId == '') {
				common.alert({ msg: "请求出错" });
				mui.init();
				setTimeout(function() {
					window.history.go(-1);
				}, 1500);
				retrun;
			};
			
			if(options.gid == 240){
				var href = window.location.href.replace(/id=240/g,'id=67');
				window.location.href = href;
			}
			
			AjaxCommon.cookieItem.getCookie('dddjsid', function(sid) {
				//console.log('回调成功');
				options.sid = sid;
				options.this.initPage(options);
			});

			//this.tmplBody(options);	
		},
		setOptions: function(options) {
			options.this = this;
			options.data = null; //缓存数据
			options.bodyContainer = doc.getElementById('body-container');
			options.footer = doc.getElementById('tmpl-footer');
			options.tmplEmpty = doc.getElementById('tmpl-model-null').innerHTML;
			options.tmplLoading = doc.getElementById('tmpl-model-loading').innerHTML;

			options.pullrefresh = mui('#pullrefresh');
			options.catId = common.queryToJSON().catId == undefined ? "492" : common.queryToJSON().catId;
			options.gid= common.queryToJSON().id == undefined ? "" : common.queryToJSON().id;
			options.storeId= common.queryToJSON().storeId == undefined ? "" : common.queryToJSON().storeId;
			options.defaultCartPopover = "popover-cart";

			options.goodsDetailUrl = common.config.appPath + "/api/goods/customerDetail";
			options.goodsDetailViewUrl = common.config.appPath + "/api/goods/desc";
			options.findCommentCountUrl = common.config.appPath + "/api/goods/getReviews";
			options.findByGoodsUrl = common.config.appPath + "/goods/comment/findByGoods.json";
			options.findByGoodsImagesUrl = common.config.appPath + "/goods/comment/image/list.json";

			options.addCartUrl = common.config.appPath + "/api/cart/add";
			options.subOrderUrl = common.config.rootPath + "/order/order.html"; //提交订单
			options.subCartUrl = common.config.rootPath + "/cart/index.html"; //提交订单
			
			//猜你喜欢
			options.getGuessUrl = common.config.appPath+'/api/goods/list';
			options.getstoreUrl = common.config.appPath+'/api/storeDetail';
			
			options.storeData = "";
			
			options.limit = 20; //默认20个

			return options;
		},
		initPage: function(options) {
			//初始化获取当页参数
			var optObjs = {
				urlPath: options.goodsDetailUrl,
				data: {
					goodsId: options.gid,
					storeId:options.storeId
				},
				isHeader:false,
				onSuccess: function(result) {
					if(result.status == 0 && result.data != null) {
						options.result = result;
						
						//console.log(JSON.stringify(options.result.data));
						
						options.this.setStoreData(options);
						
						//初始化主体
						options.this.tmplBody(options);
						
					} else {
						common.alert({ msg: result.msg || '读取出错' });
						doc.body.innerHTML = options.tmplEmpty;
					}
				},
				onError: function() {
					doc.body.innerHTML = options.tmplEmpty;
					console.log('失败回调');
				}
			};
			AjaxCommon.getAjaxRequestJson(optObjs);
		},
		setStoreData:function(options){
			
			options.storeData = "&storeId="+options.storeId;
			
//			var optObjs = {
//				urlPath: options.getstoreUrl,
//				data: {
//					sid: options.sid,
//					storeId:options.storeId
//				},
//				onSuccess: function(result) {
//					if(result.status == 0 && result.data != null) {
//						
//						var storeData={
//			   	    		lng:result.data.longitude,
//			   	    		lat:result.data.latitude,
//			   	    		storeId:result.data.id,
//			   	    		name:result.data.name
//			   	    	}
//						options.storeData = "&storeData="+window.encodeURIComponent(JSON.stringify(storeData));
//						console.log(options.storeData);
//						
//					} else {
//						common.alert({ msg: result.msg || '读取出错' });
//						
//					}
//				},
//				onError: function() {
//					console.log('失败回调');
//				}
//			};
//			AjaxCommon.getAjaxRequestJson(optObjs);
		},
		tmplBody: function(options) {
			
			var timestamp=new Date().getTime();
			var wechatShare = {
				url : window.location.href.split('#')[0],
				dataSource : "goods",
				dataId : options.result.data.id,
				identification : timestamp,
				storeId: options.storeId
			}
			var share = {
				title: "819到店自提，四款酒水零利润“庆生价”感恩回馈",
				link: 'http://m.dddingjiu.com/p/article/view?aid=93',
				imgUrl: "http://img2.dddingjiu.com/uploads/1/images/818/111.jpg",
				desc: "DD订酒让你想喝酒不用出门晒",
				wechatShare: wechatShare
			};
			var _options={
				shareData:share
			}
			//微信环境分享
			_wxShareApi.wechatConfig(_options,function(){
				//回调
				_wxShareApi.shareWx(_options,share);
			});
			
			document.title = options.result.data.name;
			//生成主体
			var html = template('tmpl-model', options.result.data);
			options.bodyContainer.innerHTML = html;
			var footerHTML = template('tmpl-footer', options.result.data);
			common.insertHTML(options.bodyContainer, 'beforebegin', footerHTML);
			//生成加入购物车 
			for (var i = 0; i < options.result.data.activities.length; i++) {
				if(options.result.data.activities[i].timeLimit != null){
					var timelimit = options.result.data.activities[i].timeLimit;
					options.this.initTimelimit(options,timelimit);
				}
			}
			
			if(options.result.data.activities[0].dailySeckill != null){
				options.this.initDaliyItems(options);
			}else{
				options.this.initPopoverCartItem(options);
			}
			
			options.shareStoreGoods= doc.getElementById('shareStoreGoods');
			//判断id
			if(options.gid == 50 || options.gid == 240 ||options.gid == 262 ||options.gid == 307 ||options.gid == 67){
				
				var optObjs = {
					urlPath: common.config.appPath+'/api/coupon/getOrderStoreCouponFlag',
					data: {
						storeId:options.storeId
					},
					onBeforeSend: function() {
					},
					onSuccess: function(result) {
						if(!result.data){
							options.shareStoreGoods.classList.remove('mui-hide');
							options.shareStoreGoods.addEventListener('tap',function(){
								mui.alert('分享到朋友圈刷新本页面即刻享受优惠价哦!', '优惠小提示', function() {
								});
							});
						}
					},
					onError: function() {
						console.log('失败回调');
					}
				};
				AjaxCommon.getAjaxRequestJson(optObjs);
			}
			
			
			//初始化
			options.this.initcomponents(options);
		},
		initcomponents: function(options) {

			//配置上拉加载
			var deceleration = mui.os.ios ? 0.003 : 0.0009;
			mui('.mui-scroll-wrapper').scroll({
				bounce: false,
				indicators: false, //是否显示滚动条
				deceleration: deceleration
			});
			
			mui('.mui-slider').slider();
			
			document.body.dataset.pageindex == 0
			mui.init();


			AjaxCommon.lazyloadTmpl(options.bodyContainer);

			options.cartIco = doc.querySelector('.icon-gouwuche');
			if(options.cartIco != null) {
				options.cartIco.addEventListener('tap', function() {

					setTimeout(function() {

						window.location.href = options.subCartUrl;
					}, 300);
				});
			}
			var review_status = false;
			mui('#segmentedControl').on('tap', '.mui-control-item', function() {
				//过滤
				var $this =this;
				if(($this.innerText.trim()).indexOf('评价') > 0){
					if(!review_status){
						console.log('已经加载过了');
						review_status = true;
						options.this.pullUpLoadGoodsGroup(options,null);
					}
					
				}
			});
			
			
			options.this.loadForGoodsView(options);
			//猜你喜欢
			options.this.loadGuessLike(options);
			
		},
		loadGuessLike:function(options){
			options.guessContainer=doc.getElementById('guess-container');
			var optObjs = {
				urlPath: options.getGuessUrl,
				data: {
					pageIndex : 1,
					pageSize : 6,
					sid:options.sid
				},
				isHeader:false,
				onBeforeSend: function() {
				},
				onSuccess: function(result) {
					if(result.status == 0) {
						var html = template('tmpl-guess',result.data);
						options.guessContainer.innerHTML += html;
						
						AjaxCommon.pageInit(options.guessContainer);
					}
				},
				onError: function() {
					console.log('失败回调');
				}
			};
			AjaxCommon.getAjaxRequestJson(optObjs);
		},
		loadForGoodsView: function(options) {
			//加载商品详情
			var listContainer = doc.getElementById('details-container');
			var optObjs = {
				urlPath: options.goodsDetailViewUrl,
				data: {
					id: options.gid,
					sid: options.sid
				},
				onBeforeSend: function() {
					listContainer.innerHTML = options.tmplLoading;
				},
				onSuccess: function(result) {
					if(result.status == 0) {
						listContainer.innerHTML = result.data;

					} else {
						//common.alert({msg:result.head.message || '读取出错'});
						if(result.data.length == 0 && listContainer.innerHTML.trim() == '') {
							listContainer.innerHTML = options.tmplEmpty;
						}

					}
				},
				onError: function() {
					console.log('失败回调');
				}
			};
			AjaxCommon.getAjaxRequestJson(optObjs);
		},
		loadCommentUrl: function(options) {
			//加载评论数
			var result = {
				data: [{
						"name": "好评",
						"count": 0,
						"commentType": 5
					}
				]
			};
			/*,
			{
				"name": "中评",
				"count": 0,
				"commentType": 3
			},
			{
				"name": "差评",
				"count": 0,
				"commentType": 1
			},
			{
				"name": "晒图",
				"count": 0,
				"commentType": 0
			}*/
			var reviewContainer = document.querySelector('#item3mobile');
			var html = template('tmpl-comment', result);
			reviewContainer.innerHTML = html;
			
			var reviewHeader = reviewContainer.querySelector('.review-header');
			reviewHeader.classList.add('mui-hide');
			var reviewContainers = options.bodyContainer.querySelectorAll('#item3mobile .review-container');
			var reviewListContainers = options.bodyContainer.querySelectorAll('#item3mobile .review-container .list-container');
			for(var int = 0; int < reviewContainers.length; int++) {
				var array_element = reviewContainers[int];
				array_element.style.minHeight = (window.screen.height - 44 - 42 -60) + "px";
				reviewListContainers[int].style.minHeight = (window.screen.height - 44 - 42 -60 ) + "px";
			};
			
			//初始化一下里面的
			var deceleration = mui.os.ios ? 0.003 : 0.0009;
			mui('.mui-scroll-wrapper').scroll({
				bounce: false,
				indicators: false, //是否显示滚动条
				deceleration: deceleration
			});
			//循环初始化所有上拉加载。
			mui.each(options.this.getScrollContainers(), function(index, pullRefreshEl) {
				mui(pullRefreshEl).pullToRefresh({
					up: {
						callback: function() {
							//加载数据
							var self = this;
							//console.log('进来了')
							options.this.pullUpLoadGoodsGroup(options, self);
						}
					}
				});
			});

			//开始第一次初始化产品列表/这里因为slider样式跳转有延迟，所以不能初始化了,根据slider事件跑
			if(mui.os.plus) {
				mui.plusReady(function() {
					setTimeout(function() {
						options.this.pullUpLoading(options);
					}, 1000);
				});
			} else {
				mui.ready(function() {
					options.this.pullUpLoading(options);
				});
			}
			//绑定点击切换事件
			mui('#item3mobile').on('tap', '.mui-control-item', function() {
				//过滤
				setTimeout(function() {
					options.this.pullUpLoading(options);
				}, 300);

			});

		},
		findByGoods: function(options) {
			//根据商品查找评论
			var Container = document.querySelector('#item3mobile .list-container');
			pluginTmpl.appendTmplByBody(Container, reviewResult);
		},
		pullUpLoading: function(options) {
			var ProductContainer = options.this.getActiveProductContainer();
			var scrollContainers = options.this.getScrollContainers();
			var activeContainer = ProductContainer.querySelector('.list-container');
			//根据ProductContainer的index下标值  执行对应的上拉加载方法
			if(activeContainer.innerHTML.trim() === '' && activeContainer.dataset.pageindex == '0') {
				//console.log('继续加载？');
				var _thisIndex = activeContainer.dataset.index;
				mui(scrollContainers[_thisIndex]).pullToRefresh().pullUpLoading();
			}
		},
		getActiveProductContainer: function() {
			//获取当前选中的内容对象
			return doc.querySelector('#item3mobile .mui-control-content.mui-active');
		},
		getScrollContainers: function() {
			//获取所有的上拉容器
			return mui(document.querySelectorAll('#item3mobile .mui-scroll'));
		},
		pullUpLoadGoodsGroup: function(options, _selfPullRefresh) {
			//获取当前选中的container容器
//			var activeContainer = options.this.getActiveProductContainer();
//			if(activeContainer == null) {
//				common.alert({ msg: '获取当前模块出错' });
//				return false;
//			}
//	
//			var listContainer = activeContainer.querySelector('.list-container');
//			//执行请求
//			var pageIndex = listContainer.getAttribute('data-pageIndex');
//			pageIndex = parseInt(pageIndex) + 1;
//			listContainer.setAttribute('data-pageIndex', pageIndex);
			//console.log('当前页面'+listContainer.dataset.commenttype);
			var listContainer = doc.getElementById('item2mobile');
			var optObjs = {
				urlPath: options.findCommentCountUrl,
				data: {
					id: options.gid,
					sid: options.sid,
					pageIndex: 1,
					pageSize:100
				},
				onSuccess: function(result) {
					if(result.status == 0) {
						var html = template('tmpl-comment-item', result);
						listContainer.innerHTML += html;
						AjaxCommon.lazyloadTmpl(listContainer);
						
						if(result.data.content.length == 0) {
							listContainer.innerHTML = options.tmplEmpty;
						}
						if(listContainer.querySelector('.spinner-child') != null){
							listContainer.querySelector('.spinner-child').classList.add('mui-hide');
						}
						
//						_selfPullRefresh.endPullUpToRefresh(!result.data.hasNextPage);
//						if(!result.data.hasNextPage) {
//							_selfPullRefresh.pullUpTips.classList.add('mui-hide');
//						}

					} else {
						//common.alert({msg:result.head.message || '读取出错'});
					}
				},
				onError: function() {
					console.log('失败回调');
				}
			};
			AjaxCommon.getAjaxRequestJson(optObjs);
		},
		//生成购物车
		initPopoverCartItem: function(options) {
			var html = template('tmpl-cart', options.result.data);

			var muiContent = doc.querySelector('.mui-content');
			common.insertHTML(muiContent, 'afterend', html);

			mui('body').on('tap', '.footerbuy,.mui-table-view-cart', function() {
				mui("#" + options.defaultCartPopover).popover('toggle');
			});
			doc.querySelector('.mui-sku-close').addEventListener('tap', function() {
				mui("#" + options.defaultCartPopover).popover('toggle');
			});
			//options.this.setCountStock(options);//获取总库存  
			options.this.initPopoverCart(options); //初始化弹出购物车事件
			options.this.set$thisGroup(options); //初始化加减按钮

			options.this.initSubmit(options); //初始化加入购物车 提交订单界面

		},
		checkData: function(options) {
			var status = true;
			//检查是否选中 前提是有规格可以选
			if(options.result.data.skus != null && options.result.data.skus.size > 0 && options.result.data.skus.short_vals != undefined) {
				var selectedSkuBtns = doc.querySelectorAll('#popover-cart .mui-sku-attr button.mui-active');
				if(options.result.data.skus.short_vals.length != selectedSkuBtns.length) {
					common.alert({ msg: "请选择规格" });
					status = false;
				}
			}
			//检查库存 
			var _this_input_group = options.this.getThisBtn()[0];
			var _this_input_group_value = _this_input_group.dataset.stock;
			if(_this_input_group_value == 0) {
				common.alert({ msg: "库存不足" });
				status = false;
			}

			return status;
		},
		submitToOrder: function(options) {
			var _this_input_group = options.this.getThisBtn()[0];
			var _this_input_group_value = parseInt(_this_input_group.querySelector('input').value);
	
			var sku =options.result.data.id+"-"+(_this_input_group.dataset.goodsattrid == 'undefined' ? '' : _this_input_group.dataset.goodsattrid)+"-"+_this_input_group_value;

			var rootPathUrl = options.subOrderUrl + "?orderStr=" + sku+options.storeData;
			setTimeout(function() {
				window.location.href = rootPathUrl;
			}, 300);

		},
		submitOrderOrCart: function(options) {
			
			var _this_input_group = options.this.getThisBtn()[0];
			var _this_input_group_value = parseInt(_this_input_group.querySelector('input').value);

			var sku =options.result.data.id+"-"+(_this_input_group.dataset.goodsattrid == 'undefined' ? '' : _this_input_group.dataset.goodsattrid)+"-"+_this_input_group_value;
			
			
			var dataCallback = null;
		
			dataCallback = function(result) {
				//成功回调
				mui.toast('加入购物车成功!');

			}

			//提交订单 或者 加入购物车
			var optObjs = {
				urlPath: options.addCartUrl,
				data: {
					itemStr:sku
				},
				onSuccess: function(result) {
					console.log(JSON.stringify(result));
					//回调
					if(result.status == 0) {
						dataCallback && typeof(dataCallback) === "function" && dataCallback(result);
					} else {
						common.alert({ msg: '提交出错' });
					}
				},
				onError: function() {
					console.log('失败回调');
				},
				onComplete: function() {
					mui("#" + options.defaultCartPopover).popover('toggle');
				}
			};
			AjaxCommon.getAjaxRequestJson(optObjs);

		},
		initSubmit: function(options) {
			//提交事件
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
						//跳转到提交订单页面
						break;
					default:
						console.log('默认操作');
						break;
				}
			});
		},
		//初始化购物车事件
		initPopoverCart: function(options) {
			//在加载的时候就初始化
			if(options.result.data.skus != null){
				var skuattrs=doc.querySelectorAll('.mui-sku-attr');
				if(skuattrs.length > 0){
					
					for (var a = 0; a < skuattrs.length; a++) {
						var skuButtons=skuattrs[a].querySelectorAll('.mui-button');
						 for (var b = 0; b < skuButtons.length; b++) {
						 	var $this=skuButtons[0];
						 	$this.classList.add('mui-active');
						 }
						 //检查选中状态
							options.this.checkPopover(options,$this);
					}
					
				}
			}
			
			mui('#popover-cart').on('tap', '.mui-button', function() {
				//选中当前
				var $this = this;
				var $this_attr = this.parentNode;
				//移除搜索状态
				var $childs_btn = $this_attr.querySelectorAll('.mui-button');

				for(var i = 0; i < $childs_btn.length; i++) {
					if($this != $childs_btn[i]) {
						$childs_btn[i].classList.remove('mui-active');
					}
				};
				this.classList.toggle('mui-active');
				
				
				var result_ids = options.this.getIsAllCheck();
				
				if($this.classList.contains('mui-active')) {
					//选中状态
					options.this.checkPopover(options,$this);
					/*var itemid = this.dataset.itemid;
					var attrItemName = this.innerHTML.trim();
					for(var i = 0; i < options.result.data.skus.vals.length; i++) {
						if(options.result.data.skus.vals[i].id == itemid) {
							
						}
					}*/
				} else {
					//默认没有选中的状态
					var attrItem = {
						price: options.result.data.price,
						stock: options.result.data.stock
					}//options.this.setCountStock(options)
					var _attrItemName = "请选择 " + $this_attr.querySelector('.mui-sku-attrname').innerHTML;
					options.this.setSkuCartStatus(options, attrItem, _attrItemName);
				}

			});
			
			if(options.result.data.skus == null){
				var attrItem = {
					price: options.result.data.price,
					stock: options.result.data.stock
				}//options.this.setCountStock(options)
				var _attrItemName = "请选择购买数量";
				options.this.setSkuCartStatus(options, attrItem, _attrItemName);
			}
		},
		checkPopover:function(options,$this){
			var result_ids = options.this.getIsAllCheck();
			
			var size = options.result.data.skus.size;
			var vals=options.result.data.skus.vals;
			
			for (var i = 0; i < vals.length; i++) {
				switch (size){
					case 1:
						if(vals[i].id_01 == result_ids[0]){
							//console.log('一个个选项的为'+JSON.stringify(vals[i]));
							var attrItemName = $this.innerHTML.trim();
							options.this.setSkuCartStatus(options, vals[i], attrItemName);
						}
						break;
					case 2:
						if(vals[i].id_01 == result_ids[0] && vals[i].id_02 == result_ids[1]){
							//console.log('两个选项的为'+JSON.stringify(vals[i]));
							var attrItemName=vals[i].name_01+" "+vals[i].name_02
							options.this.setSkuCartStatus(options, vals[i], attrItemName);
						}
						break;
					default:
						console.log('检测sku错误');
						break;
				}
			}
					
		},
		getIsAllCheck:function(){
			
			var skuattrs=doc.querySelectorAll('.mui-sku-attr');
			if(skuattrs.length > 0){
				var ids=new Array(skuattrs.length);
				for (var a = 0; a < skuattrs.length; a++) {
					var skuButtons=skuattrs[a].querySelectorAll('.mui-button');
					 for (var b = 0; b < skuButtons.length; b++) {
					 	 if(skuButtons[b].classList.contains('mui-active')){
					 	 	ids[a]=skuButtons[b].dataset.itemid;
					 	 }
					 }
				}
				console.log(ids);
				return ids;
			}
			return null;
			
		},
		setSkuCartStatus: function(options, attrItem, attrItemName) {

			var popoVerCartItem = options.this.getSkuOpts();
			popoVerCartItem.skuPrice.innerHTML = attrItem.price;
			popoVerCartItem.skuStock.innerHTML = attrItem.stock;
			for(var i in popoVerCartItem.skuAttrs) {
				popoVerCartItem.skuAttrs[i].innerHTML = attrItemName;
			}
			//设置按钮属性
			for(var i = 0; i < options.this.getThisBtn().length; i++) {
				var _selfGroup = options.this.getThisBtn()[i];
				_selfGroup.dataset.price = attrItem.price;
				_selfGroup.dataset.stock = attrItem.stock;

				_selfGroup.dataset.goodsattrid = attrItem.id;
				if(attrItem.stock < _selfGroup.dataset.qty) {
					//如果库存不足则设置按钮参数为最大库存数
					_selfGroup.dataset.qty = attrItem.stock;
				}
			}
			//重新初始化按钮
			options.this.set$thisGroup(options);

		},
		setCountStock: function(options) {
			/*暂时废弃*/
			var countStock = 0;
			var datas = options.result.data.goodsAttributes;
			for(var i = 0; i < datas.length; i++) {
				countStock += datas[i].stock;
			}
			return countStock;
		},
		getSkusCount:function(options){
			return options.result.data.skus.size;
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
			return data;
		},
		getThisBtn: function() {
			return doc.querySelectorAll('._self-group');
		},
		set$thisGroup: function(options) {
			var btnGroups = options.this.getThisBtn();
			for(var i = 0; i < btnGroups.length; i++) {
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
						/*options.this.setTotal(options);*/
					},
					onMinus: function(e) {

						e.btnGroup.setAttribute('data-qty', e.getBuyNum());
						//options.this.setTotal(options);
					},
					onChange: function(e) {

						e.btnGroup.setAttribute('data-qty', e.getBuyNum());
						//options.this.setTotal(options);
					}
				}, true);
			}
		},
		initTimelimit:function(options,timelimit){
			options.seckillBtn=doc.getElementById('seckill-btn');
			
			var timestamp = doc.querySelector('.timer');
			var starttime=timestamp.dataset.starttime;
			var endtime=timestamp.dataset.endtime;
			var startDate = new Date(starttime.replace(new RegExp("-","gm"),"/"));
			var endDate = new Date(endtime.replace(new RegExp("-","gm"),"/"));
			var nowTime=new Date().getTime();
			
			var $this_time_status=timestamp.querySelector('.time-status');
			var $this_time_h=timestamp.querySelector('.time-h');
			var $this_time_m=timestamp.querySelector('.time-m');
			var $this_time_s=timestamp.querySelector('.time-s');
				
			if(startDate.getTime() > nowTime){
				//console.log('还没开始');
				$this_time_status.innerText="距限时抢购开始";
				options.seckillBtn.classList.add('qc-bg-color-888-img');
				options.seckillBtn.classList.add("mui-disabled");
				options.seckillBtn.innerHTML="还未开始";
				options.this.shutdown(startDate.getTime(),function(data){
					$this_time_h.innerHTML=data.h;
					$this_time_m.innerHTML=data.m;
					$this_time_s.innerHTML=data.s;
					//console.log('活动进行中'+result_timestamp);
				});
				//还未开始
			}else if(nowTime > startDate.getTime() && nowTime < endDate.getTime()){
				console.log('活动进行中');
				$this_time_status.innerText="距限时抢购结束";
				options.this.shutdown(endDate.getTime(),function(data){
					$this_time_h.innerHTML=data.h;
					$this_time_m.innerHTML=data.m;
					$this_time_s.innerHTML=data.s;
				});
				//活动进行中
			}else if(nowTime > endDate.getTime()){
				console.log('已结束');
				//已结束
				$this_time_status.innerText="限时抢购已结束";
				options.seckillBtn.classList.add('qc-bg-color-888-img');
				options.seckillBtn.classList.add("mui-disabled");
				options.seckillBtn.innerHTML="限时抢购已结束";
				timestamp.innerHTML="当前活动未到时间";
				timestamp.classList.add('mui-badge');
			}
			
			//提交订单 或者 加入购物车
			var optObjs = {
				urlPath: common.config.appPath+'/api/order/leftCountToday',
				data: {
					gid:options.gid
				},
				onSuccess: function(result) {
					var restDailtNumber = result;
					var muiBoxs=doc.querySelector('.qc-bar-navs .mui-numbox ');
					muiBoxs.setAttribute('data-numbox-step',1);
					muiBoxs.setAttribute('data-numbox-min',restDailtNumber == 0 ? 0 :1);
					muiBoxs.setAttribute('data-numbox-max',restDailtNumber);
					mui('.mui-numbox').numbox();
					//结束掉
					var resets = doc.querySelectorAll('.reset-number');
					
					for (var i = 0; i < resets.length; i++) {
						resets[i].innerHTML=restDailtNumber;
					}
					if(restDailtNumber == 0){
						options.seckillBtn.classList.add('qc-bg-color-888-img');
						options.seckillBtn.classList.add("mui-disabled");
						options.seckillBtn.innerHTML="暂无资格";
					}else{
						options.seckillBtn.addEventListener('tap',function(){
							var sku=options.gid+'--'+mui('.mui-numbox').numbox().getValue();
							if(!options.seckillBtn.classList.contains('mui-disabled')){
								var rootPathUrl = options.subOrderUrl + "?orderStr=" + sku+options.storeData;
								setTimeout(function() {
									window.location.href = rootPathUrl;
								}, 300);
							}
						});
					}
				},
				onError: function() {
					console.log('失败回调');
						options.seckillBtn.classList.add('qc-bg-color-888-img');
					options.seckillBtn.classList.add("mui-disabled");
					options.seckillBtn.innerHTML="暂无资格";
				},
				onComplete: function() {
				
				}
			};
			AjaxCommon.getAjaxRequestJson(optObjs);
			
			
			
		},
		initDaliyItems:function(options){
			options.seckillBtn=doc.getElementById('seckill-btn');
			
			var timestamp = doc.querySelector('.timer');
			options.this.timestamp(options,timestamp);
			
			//提交订单 或者 加入购物车
			var optObjs = {
				urlPath: common.config.appPath+'/api/dailySeck/countToday',
				data: {
					gid:options.gid
				},
				onSuccess: function(result) {
					console.log(JSON.stringify(result));
					//回调
					var dailyGoods = options.result.data.activities[0].dailySeckill;
					
					var restDailtNumber = dailyGoods.everyDayAmount - result;
					var muiBoxs=doc.querySelector('.qc-bar-navs .mui-numbox ');
					muiBoxs.setAttribute('data-numbox-step',dailyGoods.origin);
					muiBoxs.setAttribute('data-numbox-min',restDailtNumber == 0 ? 0 :dailyGoods.origin);
					muiBoxs.setAttribute('data-numbox-max',restDailtNumber);
					mui('.mui-numbox').numbox();
					
					//结束掉
					var resets = doc.querySelectorAll('.reset-number');
					for (var i = 0; i < resets.length; i++) {
						resets[i].innerHTML=restDailtNumber;
					}
					if(restDailtNumber == 0){
						options.seckillBtn.classList.add('qc-bg-color-888-img');
						options.seckillBtn.classList.add("mui-disabled");
						options.seckillBtn.innerHTML="暂无资格";
					}else{
						
						options.seckillBtn.addEventListener('tap',function(){
							var sku=options.gid+'--'+mui('.mui-numbox').numbox().getValue();
							if(!options.seckillBtn.classList.contains('mui-disabled')){
								var rootPathUrl = options.subOrderUrl + "?orderStr=" + sku+options.storeData;
								setTimeout(function() {
									window.location.href = rootPathUrl;
								}, 300);
							}
						});
					}
				},
				onError: function() {
					console.log('失败回调');
				},
				onComplete: function() {
				
				}
			};
			AjaxCommon.getAjaxRequestJson(optObjs);
			//获取进入剩余数量
			
			
		},
		timestamp:function(options,timestamp){
			var $this=timestamp;
			//var $this_
			var $this_time_status=$this.querySelector('.time-status');
			var $this_time_h=$this.querySelector('.time-h');
			var $this_time_m=$this.querySelector('.time-m');
			var $this_time_s=$this.querySelector('.time-s');
			
			setTimeout(function(){
				//延时计算
				var starttime=$this.dataset.starttime;
				var endtime=$this.dataset.endtime;
				
			/*	var startHours=new Date(starttime.substr(0,starttime.indexOf('.')).replace(new RegExp("-","gm"),"/")).getHours();
				var startMinutes=new Date(starttime.substr(0,starttime.indexOf('.')).replace(new RegExp("-","gm"),"/")).getMinutes();
				var startSeconds=new Date(starttime.substr(0,starttime.indexOf('.')).replace(new RegExp("-","gm"),"/")).getSeconds();
				
				var endHours=new Date(endtime.substr(0,endtime.indexOf('.')).replace(new RegExp("-","gm"),"/")).getHours();
				var endMinutes=new Date(endtime.substr(0,endtime.indexOf('.')).replace(new RegExp("-","gm"),"/")).getMinutes();
				var endSeconds=new Date(endtime.substr(0,endtime.indexOf('.')).replace(new RegExp("-","gm"),"/")).getSeconds();*/
				var startArray=starttime.split(':');
				var endArray=endtime.split(':');
				
				var startDate=new Date();
				var endDate=new Date();
				
				if(startArray[0] != undefined)
					startDate.setHours(startArray[0]);
				if(startArray[1] != undefined)
					startDate.setMinutes(startArray[1]);
				if(startArray[2] != undefined)
					startDate.setSeconds(startArray[2]);
				if(endArray[0] != undefined)
					endDate.setHours(endArray[0]);
				if(endArray[1] != undefined)
					endDate.setMinutes(endArray[1]);
				if(endArray[2] != undefined)
					endDate.setSeconds(endArray[2]);
				
				var nowTime=new Date().getTime();
				
				if(startDate.getTime() > nowTime){
					//console.log('还没开始');
					$this_time_status.innerText="距今日开始";
					options.seckillBtn.classList.add('qc-bg-color-888-img');
					options.seckillBtn.classList.add("mui-disabled");
					options.seckillBtn.innerHTML="还未开始";
					options.this.shutdown(startDate.getTime(),function(data){
						$this_time_h.innerHTML=data.h;
						$this_time_m.innerHTML=data.m;
						$this_time_s.innerHTML=data.s;
						//console.log('活动进行中'+result_timestamp);
					});
					//还未开始
				}else if(nowTime > startDate.getTime() && nowTime < endDate.getTime()){
					console.log('活动进行中');
					$this_time_status.innerText="距今日结束";
					options.this.shutdown(endDate.getTime(),function(data){
						$this_time_h.innerHTML=data.h;
						$this_time_m.innerHTML=data.m;
						$this_time_s.innerHTML=data.s;
					});
					//活动进行中
				}else if(nowTime > endDate.getTime()){
					console.log('已结束');
					//已结束
					$this_time_status.innerText="今日已结束";
					options.seckillBtn.classList.add('qc-bg-color-888-img');
					options.seckillBtn.classList.add("mui-disabled");
					options.seckillBtn.innerHTML="今日已结束";
					timestamp.innerHTML="当前活动未到时间";
					timestamp.classList.add('mui-badge');
				}
			},100);
		},
		//倒计时
		shutdown:function(timestamp,onCallBack){
			var time_i=setInterval(function(){
				var result_timestamp=timestamp - (new Date().getTime());//计算剩余的毫秒数  
				if(result_timestamp < 1000){
					clearInterval(time_i);
					window.location.reload();
					return;
				}
				var hh = parseInt(result_timestamp / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数  
	            var mm = parseInt(result_timestamp / 1000 / 60 % 60, 10);//计算剩余的分钟数  
	            var ss = parseInt(result_timestamp / 1000 % 60, 10);//计算剩余的秒数
	            var data={
	            	h: hh < 10 ? "0" + hh : hh,
	            	m: mm < 10 ? "0" + mm : mm,
	            	s: ss < 10 ? "0" + ss : ss 
	            };
	            //console.log(JSON.stringify(data));
				typeof onCallBack === 'function' && onCallBack(data);
			},1000);
		}

	};
	window.storegoodsview = model;
})(mui, document);