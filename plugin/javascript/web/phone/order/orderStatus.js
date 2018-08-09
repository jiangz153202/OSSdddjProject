; + (function(mui, doc) {
	var model = {
		init: function(options) {
			options = this.setOptions(options || {});
			
			if(options.orderNumber == ""){
				common.alert({
					msg:"订单无效"
				});
				return false;
			};
			
			options.this.initPage(options);
			//this.initcomponents(options);
		},
		setOptions: function(options) {
			options.this = this;
			options.listContainer = doc.getElementById('list-container');
			options.orderNumber = common.queryToJSON().orderNumber == undefined ? "" : common.queryToJSON().orderNumber;
			options.getDetailUrl = common.config.appPath + "/api/order/detail";
		    options.getOrderViewUrl = common.config.rootPath + "/order/view?orderNumber="+options.orderNumber;
		    options.getGuessUrl = common.config.appPath+'/api/goods/list';
			return options;
		},
		initPage: function(options) {
			//console.log(data);
			//初始化获取当页参数
			var optObjs = {
				urlPath: options.getDetailUrl,
				data: {
					orderNumber:options.orderNumber
				},
				onBeforeSend: function() {
					options.listContainer.innerHTML = doc.getElementById('tmpl-model-loading').innerHTML;
					//如果是上拉加载的，就要把相对定位的样式去掉
				},
				onSuccess: function(result) {
					if(result.status == 0) {
						options.result=result;
						
						var html = template('tmpl-model',result.data);
						options.listContainer.innerHTML = html;
						
						
						
						//请求猜你喜欢模块
						options.this.getGuess(options);
			
						options.this.initcomponents(options);
					} else {
						common.alert({
							msg: result.message || '读取出错',
							onHidden:function(){
								options.listContainer.innerHTML = doc.getElementById('tmpl-model-null').innerHTML;
							}
						});
						
					}
				},
				onError: function() {
					console.log('失败回调');
				}
			};
			AjaxCommon.getAjaxRequestJson(optObjs);
		},
		initcomponents: function(options) {
			mui.init();
			//配置上拉加载
			var deceleration = mui.os.ios ? 0.003 : 0.0009;
			mui('.mui-scroll-wrapper').scroll({
				bounce: false,
				indicators: false, //是否显示滚动条
				deceleration: deceleration
			});
			
			mui('.mui-slider').slider({
					interval: 1500
			});
			
			mui(options.listContainer).on('tap','button',function(){
				var $this_type=this.dataset.type;
				switch ($this_type){
					case 'order':
						setTimeout(function(){
							window.location.href=options.getOrderViewUrl;
						},400);
						break;
					case 'home':
						setTimeout(function(){
								window.location.href=common.config.homeUrl;
						},400);
						break;
					default:
						break;
				}
			});
			
			
			
		},
		getGuess:function(options){
			var optObjs = {
				urlPath: options.getGuessUrl,
				data: {
					pageIndex : 1,
					pageSize : 6,
					sid:AjaxCommon.cookieItem.getCookie('dddjsid')
				},
				onBeforeSend: function() {
				},
				onSuccess: function(result) {
					if(result.status == 0) {
						var html = template('tmpl-guess',result.data);
						options.listContainer.innerHTML += html;
						
						AjaxCommon.pageInit(options.listContainer);
					} else {
						common.alert({
							msg: result.message || '读取出错',
							onHidden:function(){
								if(options.listContainer.innerHTML.trim() == ''){
									options.listContainer.innerHTML = doc.getElementById('tmpl-model-null').innerHTML;
								}
							}
						});
					}
				},
				onError: function() {
					console.log('失败回调');
				}
			};
			AjaxCommon.getAjaxRequestJson(optObjs);
		}
	};
	window.orderStatus = model;
})(mui, document);