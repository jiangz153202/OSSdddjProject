; + (function(mui, doc) {
	var model = {
		init: function(options) {
			options = this.setOptions(options || {});
			options.sid=AjaxCommon.cookieItem.getCookie('dddjsid');
			
			options.this.initMenus(options);
			options.this.tmplBody(options);
			
		},
		setOptions: function(options) {
			options.this = this;
			options.listContainer = doc.getElementById('list-container');
			options.tmplHtmlModelEmpty= doc.getElementById('tmpl-model-null');
			options.getOrderListUrl = common.config.appPath + "/api/order/list";
			options.getListOrderStatusUrl=common.config.appPath+'/api/order/userStatusCount';
			
			return options;
		},
		tmplBody: function(options) {
			
//			common.insertHTML(doc.querySelector('.mui-content'), 'beforebegin', document.getElementById('tmpl-footer').innerHTML);
//			var jsHtml = document.getElementById('js-footer').outerHTML.trim();
//			AjaxCommon.ajaxJavascript(jsHtml);

			
			options.this.getOrderList(options);
		
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
		

		},
		getOrderList:function(options){
			 var data={
            	"status": 1,
		        "limit": 10,
		        "page": 1,
		        "keyword": ''
            }
            var optObjs = {
				urlPath: options.getOrderListUrl,
				data: data,
				onSuccess: function(result) {
					if(result.status == 0) {
						if(result.data.content.length > 0){
							var html = template('tmpl-model', result.data);
							options.listContainer.innerHTML += html;
							
							
							
							var storeHide =doc.getElementById('store-hide');
						 	if(storeHide != null){
						 		storeHide.addEventListener('tap',function(){
							 		storeHide.parentNode.classList.toggle('mui-active');
							 	});
						 	}
						
						}else{
							if(options.listContainer.innerHTML.trim() == ''){
								options.listContainer.innerHTML=options.tmplHtmlModelEmpty.innerHTML;
							}
							//common.alert({msg:'没有更多了！'});
						}
						
					} else {
						common.alert({
							msg: result.msg || '读取出错'
						});
					}
				},
				onError: function() {
					console.log('失败回调');
				}
			};
			AjaxCommon.getAjaxRequestJson(optObjs);
		},
		initMenus:function(options){
			var data={
				//订单模块
				orderItem:
					{
						'tagId':0,
						'tagName':'全部订单',
						'tagCount':0,
						'isLogined':false,
						'tagUrl':'/order/index.html',
						'childItem':[
							{
								'tagId':2,
								'tagName':'待付款',
								'tagCount':0,
								'tagIcon':'',
								'tagCode':'',
								'iconUrl':'/framwork/global_icon/lazyload/index/icon1.png',
								'isLogined':false
							},
							{
								'tagId':1,
								'tagName':'待接单',
								'tagCount':0,
								'tagIcon':'icon-daijiedan',
								'iconUrl':'/framwork/global_icon/lazyload/index/icon2.png',
								'isLogined':false
							},
							{
								'tagId':3,
								'tagName':'待配送',
								'tagCount':0,
								'tagIcon':'icon-daifahuo ',
								'iconUrl':'/framwork/global_icon/lazyload/index/icon3.png',
								'isLogined':false
							},
							{
								'tagId':9,
								'tagName':'配送中',
								'tagCount':0,
								'tagIcon':'',
								'tagCode':'&#xe68d;',
								'iconUrl':'/framwork/global_icon/lazyload/index/icon4.png',
								'isLogined':false
							},
							{
								'tagId':5,
								'tagName':'写笔记',
								'tagCount':0,
								'tagIcon':'icon-bianji1',
								'iconUrl':'/framwork/global_icon/lazyload/index/icon5.png',
								'isLogined':false
							}
						]
					}
			};
			
			var html=template('tmpl-menus',data);
			document.getElementById('menu-container').innerHTML=html;
			
			
			options.this.setOrderStatus(options);
		},
		setOrderStatus:function(options){
			var optObjs={
				urlPath:options.getListOrderStatusUrl,
				data:{},
				onSuccess:function(result){
					if(result.status == 0 && result.data.length > 0){
						var orderBarList=doc.querySelectorAll('.order-bar li.js-all-goods');
						for (var i = 0; i < orderBarList.length; i++) {
							var orderBadge=orderBarList[i].querySelector('.mui-badge');
							
							for (var j = 0; j < result.data.length; j++) {
								var _self_result = result.data[j];
								//console.log(orderBadge.dataset.status+' || '+ _self_result.status + ' || '+_self_result.count);
								if(orderBadge.dataset.status == _self_result.status && _self_result.count > 0){
									
									orderBadge.innerHTML=_self_result.count;
									orderBadge.classList.remove('mui-hide');
								}
							}
							
							
						}
					}
				},
				onError:function(){
					console.log('我的订单加载失败!');
				}
			};
			AjaxCommon.getAjaxRequestJson(optObjs);
			
		}
	};
	window.summary = model;
})(mui, document);