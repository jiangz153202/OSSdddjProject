; + (function(mui, doc) {
	var model = {
		init: function(options) {
			options = this.setOptions(options || {});
			
			if(options.orderStr == ""){
				common.alert({
					msg:"订单提交失败"
				});
				return false;
			};
			
			options.sid=AjaxCommon.cookieItem.getCookie('dddjsid');
			options.this.initPage(options);
			
		},
		setOptions: function(options) {
			options.this = this;
			options.data = null; //缓存数据
			options.bodyContainer = doc.getElementById('body-container');
			options.listContainer = doc.getElementById('list-container');
			options.userAddressId = common.queryToJSON().userAddressId == undefined ? "" : common.queryToJSON().userAddressId;
			options.couponIdList = common.queryToJSON().couponIdList == undefined ? "" : common.queryToJSON().couponIdList;
			options.orderStr = common.queryToJSON().orderStr == undefined ? "" : common.queryToJSON().orderStr;
			options.fromStr = common.queryToJSON().from == undefined ? "" : common.queryToJSON().from;
			options.storeId = common.queryToJSON().storeId == undefined ? "" : common.queryToJSON().storeId;
			
			//检查地址
			options.storeData = common.queryToJSON().storeData == undefined ? "" : JSON.parse(common.queryToJSON().storeData);
			
			options.orderConfirmUrl = common.config.appPath + "/api/order/listOrderStrItem";
			
			options.getAddressListUrl = common.config.appPath + "/api/user/listAddresses";
			
			options.toAdsUrl=common.config.rootPath+"/user/address.html";
			options.toEditAdsUrl=common.config.rootPath+"/user/editAddress.html";
			options.subOrderUrl = common.config.appPath + "/api/order/submit"; //提交订单
			options.toPayUrl=common.config.rootPath+"/pay/index.html";
			options.toFindStoreUrl=common.config.rootPath+"/order/findstore.html";
			
			options.getCouponsUrl=common.config.appPath+"/api/order/listCoupon ";    //我的优惠劵
			options.getOrderStoreUrl=common.config.appPath+"/api/order/listOrderStrStores"; //查询附近的商家
			options.getStoreDetailUrl = common.config.appPath + "/api/storeDetail";   // 查询门店详情
			options.totalpay=doc.getElementById('total-Pay');
			options.totalSubmit=doc.getElementById('total-submit');
			
			options.defaultPayType=2;
			options.limit = 20; //默认20个
			options.isStoreShipping = 1; //到店自提
			return options;
		},
		initPage: function(options) {
			/*var items=JSON.parse(window.decodeURIComponent(options.orderStr));
			var data={
				userAddressId:options.userAddressId,
				goodsItems:items.goodsItems,
				supplierItems:items.supplierItems,
				couponIdList:options.couponIdList
			}*/
			//console.log(data);
			var data={
					orderStr:options.orderStr,
					from:options.fromStr,
					sid:options.sid
			};
			//初始化获取当页参数
			var optObjs = {
				urlPath: options.orderConfirmUrl,
				data:data ,
				onBeforeSend:function(){
					//alert('参数'+JSON.stringify(data)+"URL"+options.orderConfirmUrl);
				},
				onSuccess: function(result) {
					if(result.status == 0) {
						options.result=result;
					
						//初始化主体
						var totalQuantity=0,totalPayFee=0,totalTaxFee=0,totalCouponFee=0,totalCouponNumber=0,usableCouponNumber=0,totalGoodsFee=0;
						for (var i = 0; i <  result.data.length; i++) {
							totalQuantity += result.data[i].quantity;
							totalPayFee +=  result.data[i].price * result.data[i].quantity;
						}
						options.totalPayFee=totalPayFee;
						var html = template('tmpl-model', {
							data:options.result.data,
							totalCouponNumber:totalCouponNumber,
							usableCouponNumber:usableCouponNumber,
							totalCouponFee:totalCouponFee,
							totalTaxFee:totalTaxFee,
							totalPayFee:totalPayFee,
							totalQuantity:totalQuantity,
							totalGoodsFee:totalGoodsFee
						});
						options.listContainer.innerHTML = html;
						
						//
						
						
						//获取收货地址
						options.this.selectedAds(options);
						

						options.this.tmplBody(options);
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
		selectedAds:function(options){
			var optObjs = {
				urlPath: options.getAddressListUrl,
				data: {
				},
				onSuccess: function(result) {
					if(result.status == 0) {
						if(result.data.length > 0){
							options.adsResult=result;
							//设置
							if(options.storeData != ''){
								doc.body.dataset.lng=options.storeData.lng;
								doc.body.dataset.lat=options.storeData.lat;
							}
							var status=0;
							for (var i = 0; i < result.data.length; i++) {
								var ads =result.data[i];
								if(options.userAddressId != '' && options.userAddressId == ads.id || options.userAddressId == '' && ads.selected == true){
									options.this.setAds(options,ads);
									console.log('选择的地址');
								}
							}
							
						
							
						}else{
							if(doc.querySelector('.mui-select-more') != null){
								doc.querySelector('.mui-select-more').classList.add('mui-hide');
							}
							doc.querySelector('.mui-list-store').classList.add('mui-hide');
							
							options.this.getOrderStore(options);
						}
						
						
					} else {
						common.alert({
							msg:'收货地址获取出错,请刷新!'
						});
					}
				},
				onError: function() {
					console.log('失败回调');
				}
			};
			AjaxCommon.getAjaxRequestJson(optObjs);
			
		},
		setAds:function(options,ads){
			
			var defautlAds = template('tmpl-ads',ads);
			//加载主体
			options.adsContainer=doc.getElementById('ads-container');
			options.adsContainer.innerHTML=defautlAds;
			
			//对比距离
			console.log('对比距离');
			
			//没有选择过门店 并且收货地址也要存在
			options.this.getOrderStore(options);
//			if(options.storeData == '' && doc.querySelector('#ads-container a').dataset.aid != 0){
//			}else{
//				options.this.getDetails(options,ads);
//				
//			}
						
		},
		tmplBody: function(options) {
			//生成主体
			
			options.totalpay.innerHTML=parseFloat(options.totalPayFee).toFixed(2);
			if(options.totalSubmit != null){
				options.totalSubmit.addEventListener('tap',function(){
					var data=options.this.checkData(options);
					data &&	options.this.createOrder(options,data);
				});
			}
			
			if(options.storeId == ''){
				mui('#choose_store')[0].querySelectorAll('.mui-input-row')[1].classList.add('mui-hide');
			}
			//初始化
			var bgAddress =doc.querySelector('.mui-bg-address');
			mui('#choose_store').on('change','input[type="radio"]',function(){
				console.log(this.value);
				if(this.value == options.isStoreShipping){
				    bgAddress.classList.add('mui-hide');
				   
				    options.totalSubmit.classList.add('default-abs-bg-color');
				    options.totalSubmit.classList.remove('mui-bg-ccc');
				    options.totalSubmit.classList.remove('mui-disabled');
				    options.totalSubmit.innerHTML = "立即购买";
				   
				    options.this.toStore(options);
				}else{
				   bgAddress.classList.remove('mui-hide');
				   options.this.toStore(options);
				   
				   options.this.checkDistance(options);
				}
			})
			
			
			//计算赠品
			options.this.getAdditional();
			
			
			//获取优惠劵
			options.this.getCoupons(options);
			
			//初始化
			options.this.initcomponents(options);
		},getAdditional:function(){
			var addListDom = document.querySelectorAll('.mui-table-view-cell[data-gact="12"]');
			var map = new Map();
			for (var i = 0; i < addListDom.length; i++) {
				var gid = addListDom[i].dataset.gid;
				var gQuantity =  parseInt(addListDom[i].dataset.quantity);
				if(!map.has(gid)){
					map.set(gid,gQuantity);
				}else{
					map.set(gid,parseInt(map.get(gid))+gQuantity)
				}
			}
			
			for(var [key,value] of map){
				console.log(key + '----' + value);
				var listActDoms = document.querySelectorAll('.mui-table-view-cell[data-gid="'+key+'"]');
				var lastGoodsDom = listActDoms[listActDoms.length -1];
				var data = {
					name:lastGoodsDom.dataset.gname +"口味随机",
					quantity:parseInt(value/2)
				}
				lastGoodsDom.innerHTML += template('tmpl-additional',data);
			}
			
		},
		toStore:function(options){
			//判断id
			var activeArrayByGoodsId = [50,240,262,307,162,67];
			var storeId = document.getElementById('list-stores').querySelector('.mui-selected').dataset.storeid;
			var optObjs = {
				urlPath: common.config.appPath+'/api/coupon/getOrderStoreCouponFlag',
				data: {
					storeId:storeId
				},
				onBeforeSend: function() {
				},
				onSuccess: function(result) {
					if(result.data){
						//分享过后享受优惠价
						
						var radios = doc.querySelector('#choose_store').querySelector('input[type="radio"]:checked')
						options.this.updatePrice(options,activeArrayByGoodsId,radios.value);
					}
				},
				onError: function() {
					console.log('失败回调');
				}
			};
			AjaxCommon.getAjaxRequestJson(optObjs);
		},
		updatePrice:function(options,activeArrayByGoodsId,shipping){
			var listPriceArray = mui('.goods-price');
			var updatePrice = 0;
			listPriceArray.each(function(index,item){
				if(shipping == options.isStoreShipping){
					mui.each(activeArrayByGoodsId,function(index2,item2){
						if(item.dataset.gid == item2){
							var $thisPrice = item.dataset.selfpickupprice > 0 ? item.dataset.selfpickupprice : item.dataset.price;
							item.innerHTML = $thisPrice;
						
							item.parentNode.parentNode.querySelector('.mui-toStore').classList.remove('mui-hide');						
						}
					});
				}else{
					item.innerHTML = item.dataset.price;
					
					item.parentNode.parentNode.querySelector('.mui-toStore').classList.add('mui-hide');		
					
				}
			
			});
			//计算数值
			listPriceArray.each(function(index,item){
				updatePrice += parseFloat(item.innerHTML.trim());
			});
			
			//计算总价
			var couponCards = doc.getElementById('list-table-content').querySelectorAll('.mui-card');
			if(shipping == options.isStoreShipping){
				if(couponCards.length > 0){
		 			options.this.couponSumTotal(options,updatePrice);
				}else{
					mui('.total-pay').each(function(index,item){
		 				item.innerHTML = parseFloat(updatePrice).toFixed(2);
		 			});
				}
				
			}else{
				if(couponCards.length > 0){
		 			options.this.couponSumTotal(options,options.totalPayFee);
				}else{
					mui('.total-pay').each(function(index,item){
		 				item.innerHTML = parseFloat(options.totalPayFee).toFixed(2);
		 			});
				}
			}
			
			
			
			
			
			
			
			
		},
		initcomponents: function(options) {

			//配置上拉加载
			var deceleration = mui.os.ios ? 0.003 : 0.0009;
			mui('.mui-scroll-wrapper').scroll({
				bounce: false,
				indicators: false, //是否显示滚动条
				deceleration: deceleration
			});
			
			document.body.dataset.pageindex == 0
			mui.init();
			
			//监听
			mui('#ads-container').on('tap','a',function(){
				var _selfThis=this;
				setTimeout(function(){
					if(_selfThis.dataset.aid == 0){
						//新建新地址
						window.location.href = options.toEditAdsUrl+"?callback="+window.encodeURIComponent(window.location.href);
					}else{
						window.location.href = options.toAdsUrl+"?callback="+window.encodeURIComponent(window.location.href)+"&aid="+_selfThis.dataset.aid;
					}
				},300);
			});
			
			//加一元多一支活动
			mui('.mui-input-group').on('change','input[type="checkbox"]',function(){
				
					var _this=this;
					var name=this.name;
					var price=this.dataset.price;
					var quantity=1; //暂时数量默认为1
					var _checkId=name.replace('checkbox',"");
					//更新提交链接
					var orderStrArray = options.orderStr.split('/');
					
					options.orderStr="";
					for (var int = 0; int < orderStrArray.length; int++) {
						var array_element = orderStrArray[int];
						var _thisId=array_element.substr(0,array_element.split('/')[0].indexOf('-'));
						
						if(_checkId == _thisId){
							//如果当前这个id 相同 就在后面添加
							//更改选中的数值
							if(_this.checked){
								//如果被选中
								array_element+='-'+quantity;
								
								options.totalpay.innerText=(parseFloat(options.totalpay.innerText) + parseFloat(price)).toFixed(2);
								//console.log('选中 array_element'+array_element);
							}else{
								//如果没有的话.把检测当前是否被选中过
								var arrays = array_element.split('-');
								if(arrays.length == 4){
									//原来就是选中的
									//console.log('原来就是选中的'+array_element);
									//拼接起来
									var _str="";
									for (var j = 0; j < arrays.length - 1; j++) {
										var _array_element = arrays[j];
										_str += _array_element+"-";
									}
									array_element=_str.substr(0,_str.length -1);
									
									//这里是原来选中过
									options.totalpay.innerText=(parseFloat(options.totalpay.innerText) - parseFloat(price)).toFixed(2);
									
								}
							}
							
						}
				
						options.orderStr+=array_element+"/";
					}
					options.orderStr=options.orderStr.substr(0,options.orderStr.length -1);
					
					//console.log('订单链接:'+options.orderStr);
					
				});
				
				
				//优惠劵

		},
		checkData:function(options){
			var adsContainer=doc.querySelector('#ads-container a').dataset.aid;
			
//			var storeId="";
//			if(options.storeData != ''){
//				storeId=options.storeData.storeId
//			}
			var remark=doc.getElementById('order-remark');
		
			var chooseStore =doc.querySelector('#choose_store');
			var radios = chooseStore.querySelector('input[type="radio"]:checked')
			var data={
				aid:adsContainer == undefined ? 0 : adsContainer,
				orderStr:options.orderStr,
				sid:options.sid,
				storeId:document.getElementById('list-stores').querySelector('.mui-selected').dataset.storeid,
				remark:remark != null ? remark.value : '',
				couponIds:doc.querySelector('#list-table-content .mui-card.mui-selected') == null ? "" : doc.querySelector('#list-table-content .mui-card.mui-selected').dataset.couponid,
				shipping:radios.value
			}
			
			//	supplierItems:supplierItems
			
		
			if(data.aid == 0 && radios.value == 0){
				common.alert({msg:'请添加收货地址'});
				return false;
			}
			if(data.orderStr == ''){
				common.alert({msg:'订单提交出错,请退出重试'});
				return false;
			}
			
			if(options.adsContainer != undefined && options.adsContainer.querySelector('a').classList.contains('mui-not-ads') && radios.value == 0){
				common.alert({msg:'填写的地址不在配送范围!'});
				return false;
			}
			if(data.storeId == 0 ){
				common.alert({msg:'附近暂无商家服务!'});
				return false;
			}
			
			//console.log(JSON.stringify(data));
			return data;
		},
		createOrder:function(options,data){
		    var optObjs = {
				urlPath: options.subOrderUrl,
				data: data,
				onSuccess: function(result) {
					if(result.status == 0) {
					 	alertOptions.msg = '订单提交成功,正在进行下一步...';
		                alertOptions.callback = function (alertContext) {
							alertContext.setMsg('请求成功！');
                   			alertContext.hide();
							setTimeout(function(){
								
								//window.location.href=options.toFindStoreUrl+"?orderNumber="+result.data;
								if(data.storeId != 0){
									//跳转到支付页面
									window.location.href=options.toPayUrl+"?orderNumber="+result.data;
								}else{
									//跳转到选择门店
									window.location.href=options.toFindStoreUrl+"?orderNumber="+result.data;
								}
								/*var data={};
								data.amount=result.data.totalCount;
								data.orderIds=result.data.orderIds;
								data.type=options.defaultPayType;
								
								'?data='+window.decodeURIComponent(JSON.stringify(data));*/
							},300);
						};
						common.alert(alertOptions);
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
		getCoupons:function(options){
		    var optObjs = {
				urlPath: options.getCouponsUrl,
				data: {
					sid:options.sid,
					orderStr:options.orderStr
				},
				onSuccess: function(result) {
					if(result.status == 0 && result.data != null) {
						if(result.data.length > 1) 
						{
							result.data.reverse();
						}
						var res = options.result.data.find(item => JSON.stringify(item.activity) != "{}");
						if(res && result.data.length > 0){
							//如果没有才进来
							var filterData = result.data.filter(function(item){
								return item.discountTogether == undefined || item.discountTogether == true
							});
							result.data = filterData;
						}
						
						//进行筛选
						
						
					 	var html=template('tmpl-coupon',result.data);
					 	var container=doc.getElementById('list-table-content');
	 					container.innerHTML=html;
					 	
					 	
					 	mui('#coupon-popover')[0].style.height="300px";
					 	var muiscrollwrapper = doc.querySelector('#coupon-popover .mui-scroll-wrapper');
					 	muiscrollwrapper.style.height="300px";
					 	var totalEle = doc.getElementById('discount-pay'); 
					 	if(result.data.length > 0){
					 		
					 		options.this.couponSumTotal(options,options.totalPayFee);
					 		
					 		mui(container).on('tap','.mui-card',function(){
					 			var amount=this.dataset.amount;
					 			var name = this.dataset.name;
					 			
					 			
					 			
					 			if(container.querySelector('.mui-selected') != null && this.dataset.couponid == container.querySelector('.mui-selected').dataset.couponid){
					 				this.classList.toggle('mui-selected')
					 			}else{
					 				if(container.querySelector('.mui-selected') != null){
						 				container.querySelector('.mui-selected').classList.remove('mui-selected');
						 			}
						 			this.classList.add('mui-selected');
					 			}
					 			
						 		if(amount > 0 && container.querySelector('.mui-selected') != null){
						 			var lastMoney = (options.totalPayFee-amount).toFixed(2);
						 			mui('.total-pay').each(function(index,item){
						 				item.innerHTML = lastMoney;
						 			});
						 			doc.querySelector('.mui-coupon-status').innerHTML=name;
						 			doc.querySelector('.mui-coupon-status').classList.add('default-abs-color');
						 			totalEle.innerHTML="(已优惠"+amount+")元";
						 			
						 		}else{
						 			options.totalpay.innerHTML =  options.totalPayFee.toFixed(2);
						 			doc.querySelector('.mui-coupon-status').innerHTML="未使用";
						 			doc.querySelector('.mui-coupon-status').classList.remove('default-abs-color');
						 			totalEle.innerHTML="";
						 		}
						 		mui('#coupon-popover').popover('toggle');
						 	});
						 	
						 	doc.querySelector('.mui-coupon-amount').innerHTML=result.data.length;
					 	}else{
					 		doc.querySelector('.mui-coupon-amount').parentNode.classList.add('mui-hide');
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
			
			doc.querySelector('.mui-icon-closeempty').addEventListener('tap',function(){
		 		mui('#coupon-popover').popover('toggle');
		 	});
			
		},
		couponSumTotal:function(options,payTotal){
			var container=doc.getElementById('list-table-content');
	 		var totalEle = doc.getElementById('discount-pay'); 
	 		var checkRadio = container.querySelector('.mui-selected');
	 		if(checkRadio != null){
	 			var radioAmount = checkRadio.dataset.amount;
	 			if(radioAmount > 0){
	 				var lastMoney = (payTotal-radioAmount).toFixed(2);
	 				mui('.total-pay').each(function(index,item){
		 				item.innerHTML = lastMoney;
		 			});
		 			
		 			doc.querySelector('.mui-coupon-status').innerHTML=checkRadio.dataset.name;
		 			doc.querySelector('.mui-coupon-status').classList.add('default-abs-color');
		 			totalEle.innerHTML="(已优惠"+radioAmount+"元)";
	 			}
	 		}
		},
		getOrderStore:function(options){
			var container=doc.getElementById('list-stores');//list-store-content
			
			var optObjs = {
				urlPath: options.getOrderStoreUrl,
				data: {
					sid:options.sid,
					storeId:options.storeId,
					orderStr:options.orderStr,
					latitude:doc.querySelector('#ads-container a').dataset.lat == undefined ? "0.0": doc.querySelector('#ads-container a').dataset.lat,
					longtitude:doc.querySelector('#ads-container a').dataset.lng == undefined ? "0.0": doc.querySelector('#ads-container a').dataset.lng
				},
				onSuccess: function(result) {
					if(result.status == 0 && result.data.length > 0) {
					 	var html=template('tmpl-stores',result);
					
					 	container.innerHTML=html;
					 	
					 	var storeHide =doc.getElementById('store-hide');
					 	if(storeHide != null){
					 		storeHide.addEventListener('tap',function(){
						 		storeHide.parentNode.classList.toggle('mui-active');
						 	});
					 	}
					 	options.this.checkDistance(options);
					 	var listStores = container.querySelectorAll('li');
					    mui(container).on('tap','.mui-table-view-cell',function(){
					    	container.querySelector('li.mui-selected').classList.remove('mui-selected');
					    	this.classList.add('mui-selected');
					    	
					    	options.this.checkDistance(options);
					    	
					    });

					 	
					} else {
						container.innerHTML= document.getElementById('tmpl-store-null').innerHTML;
					}
				},
				onError: function() {
					console.log('失败回调');
				}
			};
			AjaxCommon.getAjaxRequestJson(optObjs);
			
			
		},
		getDetails:function(options,ads){
			
			var optObjs = {
				urlPath: options.getStoreDetailUrl,
				data: {
					sid:options.sid,
					storeId:options.storeData.storeId
				},
				onSuccess: function(result) {
					if(result.status == 0 && result.data != null) {
					 	options.this.setDefaultStore(options,result.data,ads);
					 	//doc.querySelector('.mui-select-more').classList.add('mui-hide');
					 	
					} else {
						container.innerHTML= document.getElementById('tmpl-store-null').innerHTML;
					}
				},
				onError: function() {
					console.log('失败回调');
				}
			};
			AjaxCommon.getAjaxRequestJson(optObjs);
			
			
		},
		setDefaultStore:function(options,data,ads){
			var html=template('tmpl-store',data);
		 	var container = document.getElementById('list-stores');
		 	container.innerHTML=html;
		 	
		 	if(ads != undefined){
		 		var map = new BMap.Map();
		
				var selfPoint=new BMap.Point(ads.longitude,ads.latitude);
				var bPoint= new BMap.Point(data.longitude,data.latitude);
				
				var distance= parseInt(map.getDistance(bPoint,selfPoint));
				var selfDistance=(distance/1000).toFixed(2);
				document.querySelector('.qc-store-distance').innerHTML=selfDistance+"KM";
				
				if(selfDistance > (data.distance/1000)){
					console.log('大于配送范围');
					doc.querySelector('#ads-container a').classList.add('mui-not-ads');
				}
		 		
		 	}
			
		},
		checkDistance:function(options){
			var container=doc.getElementById('list-stores');//list-store-content
			var li = container.querySelector('li.mui-selected');
			if(li != null){
				if(li.dataset.distance == 0){
					options.totalSubmit.classList.remove('default-abs-bg-color');
					options.totalSubmit.classList.add('mui-bg-ccc');
					options.totalSubmit.classList.add('mui-disabled');
					options.totalSubmit.innerHTML = "不在配送范围";
					
				}else{
					options.totalSubmit.classList.add('default-abs-bg-color');
					options.totalSubmit.classList.remove('mui-bg-ccc');
					options.totalSubmit.classList.remove('mui-disabled');
					options.totalSubmit.innerHTML = "立即购买";
					
				}
			}
			
			
		}
	};
	window.orderSubmit = model;
})(mui, document);