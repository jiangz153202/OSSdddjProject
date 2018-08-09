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
			//console.log('加载完成iframe');
			
			options.this.initPage(options);
				
		},
		setOptions: function(options) {
			options.this = this;
			options.data = null; //缓存数据
			options.bodyContainer = doc.getElementById('body-container');
			options.listContainer = doc.getElementById('list-container');
			//options.orderNumber = common.queryToJSON().orderId == undefined ? "" : common.queryToJSON().orderId;
			options.orderDetailUrl = common.config.appPath + "/api/order/detail";
			
			options.toAdsUrl=common.config.rootPath+"/phone/user/address.html";
			options.payOrderUrl=common.config.rootPath+'/pay/index.html';
			options.reviewOrderUrl=common.config.rootPath+'/order/review.html';
			
			options.unpaidCancelUrl=common.config.appPath+'/api/order/cancel';//未支付前取消
			options.confirmOrder =common.config.appPath+'/api/order/confirm';
			
			options.confirmStatusUrl=common.config.appPath+'/api/order/confirmStatus'; //检测订单状态
			options.confirmQrcodeUrl=common.config.appPath+'/api/order/confirmQrcode'; //拉取二维码
			return options;
		},
		initPage: function(options) {
			//console.log(data);
			//初始化获取当页参数
			var optObjs = {
				urlPath: options.orderDetailUrl,
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
						/*var _nav_html = template('tmpl-tab-nav',result.data);
						common.insertHTML(options.listContainer,'beforebegin',_nav_html);*/
						var storeMap = doc.getElementById('storeMap');
						if(storeMap != null){
							var mapUrl = "http://api.map.baidu.com/marker?location="+result.data.store.latitude+","+result.data.store.longitude+"&title="+result.data.store.name+"&content="+result.data.store.address+"&output=html";
							storeMap.addEventListener('tap',function(){
								window.location.href=mapUrl;
							});
						
						}
						
						
						var phone = document.querySelector('.mui-phone-model');
						if(phone.classList.contains('mui-selected')){
							phone.addEventListener('tap',function(){
								//如果含有
								var data={
									str:"",
									mobile:""
								}
								if(result.data.deliveryLog.name && result.data.status != 6){
									console.log('拨打配送员电话')
									data.str="配送员:"+result.data.deliveryLog.name+"正在为您配送中,是否联系配送员?";
									data.mobile=result.data.deliveryLog.mobile;
								}else{
									data.str="DD订酒"+result.data.store.name+"正在为您处理订单,是否联系店家？";
									data.mobile=result.data.store.tel;
								}
								
								var btnArray = ['确认', '取消'];
								mui.confirm(data.str, '拨打提示', btnArray, function(e) {
									if (e.index == 0) {
										window.location.href="tel:"+data.mobile;
									}
								})
							});
						}
						
						
						if(result.data.shipping == 1 && result.data.status != 7){
							//到店自提状态检测
							options.this.checkConfirmStatus(options,function(){
								options.this.getConfirmQrcode(options);
								
								setTimeout(function(){
									console.log('更新');
									options.this.getConfirmQrcode(options);
									doc.getElementById('ship-qrcode').parentNode.innerHTML += '<p class="qc-font-size12 mui-text-center qc-color-333">二维码已更新</p>';
									
								},1000 * 120);
							});
							
							
						}
			
						
						
						options.this.tmplBody(options);
					} else {
						common.alert({
							msg: result.message || '读取出错'
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
		checkConfirmStatus:function(options,cb){
			var status = false;
			var optObjs = {
				urlPath: options.confirmStatusUrl,
				data: {
					orderNumber:options.orderNumber
				},
				onBeforeSend: function() {
					
				},
				onSuccess: function(result) {
					if(result.status == 0) {
						
						cb();
					} else {
						common.alert({
							msg: result.message || '读取出错'
						});
						
					}
					
				},
				onError: function() {
					console.log('失败回调');
					
				}
			};
			AjaxCommon.getAjaxRequestJson(optObjs);
		},
		getConfirmQrcode:function(options){
			
			doc.getElementById('ship-qrcode').src = options.confirmQrcodeUrl+"?orderNumber="+options.orderNumber;
			
			
		},
		tmplBody: function(options) {
			//生成主体
			//options.totalpay.innerHTML=options.result.data.totalPayFee;
			if(options.totalSubmit != null){
				options.totalSubmit.addEventListener('tap',function(){
					var data=options.this.checkData(options);
					data &&	options.this.createOrder(options);
				});
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
			mui.init();
			
			options.this.initEvent(options);

		},
		initEvent:function(options){
			
			
			
			mui('.mui-table-view').on('tap','.mui-media-body',function(e){
				console.log('禁止冒泡');
				event.stopPropagation(); 
				event.preventDefault(); 
			});
			
			options.payBtn=doc.getElementById('pay-Order');
			options.cancelBtn=doc.getElementById('cancel-Order');
			options.confirmBtn=doc.getElementById('confirm-Order');
			options.reviewBtn=doc.getElementById('review-Order');
			if(options.payBtn != null){
				options.payBtn.addEventListener('tap',function(){
					options.this.pay(options);
				});
			}
			if(options.cancelBtn != null){
				options.cancelBtn.addEventListener('tap',function(){
					options.this.cancelOrder(options);
				});
			}
			if(options.confirmBtn != null){
				options.confirmBtn.addEventListener('tap',function(){
					options.this.confirm(options);
				});
			}
			if(options.reviewBtn != null){
				options.reviewBtn.addEventListener('tap',function(){
					options.this.review(options);
				});
			}
			
			
		},
		pay:function(options){
			//跳转到支付
			setTimeout(function(){
				window.location.href =options.payOrderUrl+"?orderNumber="+options.orderNumber;
			},300);
			
		},
		review:function(options){
			//跳转到评论
			setTimeout(function(){
				window.location.href =options.reviewOrderUrl+"?orderNumber="+options.orderNumber;
			},300);
		},
		confirm:function(options){
			//确认收货
			
			alertOptions.msg = '确认收货中...';
            alertOptions.callback = function (alertContext) {
            	var optObjs = {
					urlPath: options.confirmOrder,
					data: {
						orderNumber:options.orderNumber
					},
					onSuccess: function(result) {
						if(result.status == 0) {
							//删除当前元素，1.拿到当前页面的
							alertContext.setMsg('确认收货成功！');
           				    alertContext.hide();
           				    
           				    setTimeout(function(){
           				    	window.location.href=window.location.href+"&_hashMap="+(new Date()).getTime();
           				    },300);
           				    
						} else {
							alertContext.setMsg('确认收货失败！');
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
          
		},
		deleteOrder:function(options,$this){
//			只有：
//			1.已经取消的订单可以删除
//			2.已经确认收货的订单可以删除
//			3.如果有售后，则需要等到售后完成后再可以删除
			//删除订单
			var oid= $this.getAttribute('data-oid');
			
			alertOptions.msg = '正在删除中...';
            alertOptions.callback = function (alertContext) {
            	var optObjs = {
					urlPath: options.deleteUrl,
					data: {
							orderNumber:options.orderNumber
					},
					onSuccess: function(result) {
						if(result.head.bcode == 1) {
							//如果删除成功之后 返回前页
							alertContext.setMsg('删除成功...');
           				    alertContext.hide();
           				    
           				    setTimeout(function(){
           				    	window.history.go(-1);
           				    },300);
						} else {
							alertContext.setMsg('删除失败');
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
		},
		cancelOrder:function(options){
			 //关闭订单
			 //			只有：
//			1.已经取消的订单可以删除
//			2.已经确认收货的订单可以删除
//			3.如果有售后，则需要等到售后完成后再可以删除
			var urlPath=options.unpaidCancelUrl;
			/*if(payStatus == 100){
				console.log('已支付取消')
				urlPath=options.afterPaidCancelUrl;
			}*/
			var btnArray = ['确认', '取消'];
			mui.confirm('是否取消当前订单', '小提示', btnArray, function(e) {
				if (e.index == 0) {
					alertOptions.msg = '正在取消中...';
		            alertOptions.callback = function (alertContext) {
		            	var optObjs = {
							urlPath: urlPath,
							data: {
								orderNumber:options.orderNumber
							},
							onSuccess: function(result) {
								if(result.status == 0) {
									//取消成功
									
									alertContext.setMsg('取消成功...');
		           				    alertContext.hide();
		           				    
		           				    //如果取消成功之后 变成删除好了
		           				    setTimeout(function(){
		           				    	window.location.reload();
		           				    },300);
		           				    
								} else {
									alertContext.setMsg('取消失败');
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
			});
		}
	};
	window.orderView = model;
})(mui, document);