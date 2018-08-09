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
			
			
		},
		setOptions: function(options) {
			options.this = this;
	
		
			options.listContainer = doc.getElementById('list-container');
			options.orderNumber = common.queryToJSON().orderNumber == undefined ? "" : common.queryToJSON().orderNumber;
			options.listStoresUrl = common.config.appPath + "/api/order/listStores";
			options.chooseStoreUrl = common.config.appPath + "/api/order/chooseStore";
			
			options.orderDetailUrl = common.config.appPath + "/api/order/getDetail";
			
			options.payUrl =common.config.rootPath+'/pay/index.html';
			return options;
		},
		initPage: function(options) {
			//console.log(data);
			//初始化获取当页参数
			var optObjs = {
				urlPath: options.listStoresUrl,
				data: {
					orderNumber:options.orderNumber
				},
				onBeforeSend: function() {
					options.listContainer.innerHTML = doc.getElementById('tmpl-model-loading').innerHTML;
					//如果是上拉加载的，就要把相对定位的样式去掉
				},
				onSuccess: function(result) {
					if(result.status == 0 ) {
						options.result=result;
						
						if(result.data.length > 0){
							var html = template('tmpl-model',result);
							options.listContainer.innerHTML = html;
							options.this.initcomponents(options);
						}else{
							
							options.listContainer.innerHTML = doc.getElementById('tmpl-model-null').innerHTML;
							if(options.listContainer.innerHTML.trim() == ''){}
						}
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
					options.listContainer.innerHTML = doc.getElementById('tmpl-model-null').innerHTML;
				}
			};
			AjaxCommon.getAjaxRequestJson(optObjs);
		},
		initcomponents: function(options) {

			//配置上拉加载
			var deceleration = mui.os.ios ? 0.003 : 0.0009;
			mui('.mui-scroll-wrapper').scroll({
				bounce: false,
				indicators: false, //是否显示滚动条
				deceleration: deceleration
			});
			mui.init();
			
			mui(options.listContainer).on('tap','li',function(){
				var $this=this;
				options.this.confirm(options,$this);
			});

		},
		confirm:function(options,$this){
			//选择门店
			var storeId= $this.getAttribute('data-storeid');
			
			alertOptions.msg = '正在请求中...';
            alertOptions.callback = function (alertContext) {
            	var optObjs = {
					urlPath: options.chooseStoreUrl,
					data: {
						orderNumber:options.orderNumber,
						storeId:storeId
					},
					onSuccess: function(result) {
						if(result.status == 0) {
							//删除当前元素，1.拿到当前页面的
							alertContext.setMsg('选择门店成功,准备跳转中...');
           				    alertContext.hide();
           				    
           				    setTimeout(function(){
           				    	window.location.href=options.payUrl+"?orderNumber="+options.orderNumber;
           				    },300);
           				    
						} else {
							alertContext.setMsg('选择门店失败！');
           				    alertContext.hide();
						}
					},
					onError: function() {
						console.log('失败回调');
					}
				};
				AjaxCommon.getAjaxRequestJson(optObjs);
			
            };
            common.alert(alertOptions);
          
		}
	};
	window.findStore = model;
})(mui, document);