; + (function(mui, doc) {
	var model = {
		init: function(options) {
			options = this.setOptions(options || {});
			
			if(options.storeId == ""){
				common.alert({
					msg:"门店地址无效"
				});
				return false;
			};
			if(options.sid == ''){
				console.log('无sid');
				AjaxCommon.cookieItem.getCookie('dddjsid',function(sid){
					options.sid=sid;
					//options.this.initPage(options);
				
					
					options.this.createInitPage(options);
				});
				
				
			}else{
				console.log('有sid');
				options.this.createInitPage(options);
			}
		},
		setOptions: function(options) {
			options.this = this;
			options.data = null; //缓存数据
			options.bodyContainer = doc.getElementById('body-container');
			options.pullrefresh=mui('#pullrefresh');
			options.gettagsUrl=common.config.appPath+'/api/goods/getGroups';
			options.sid= common.queryToJSON().sid == undefined ? "" : common.queryToJSON().sid;
			options.storeId = common.queryToJSON().storeId == undefined ? "" : common.queryToJSON().storeId;
			options.storeDetailUrl = common.config.appPath + "/api/store/detail";
			options.storeListGoodsUrl=common.config.appPath + "/api/goods/listCustomerGoods";//listStoreGoods
			options.subOrderUrl = common.config.rootPath + "/order/order.html"; //提交订单
			
			options.gettagsUrl=common.config.appPath+'/api/goods/getGroups';
			return options;
		},
		createInitPage:function(options){
			var optObjs = {
				urlPath: options.storeDetailUrl,
				data: {
					id:options.storeId,
					sid:options.sid
				},
				isHeader:false,
				onBeforeSend: function() {
				},
				onSuccess: function(result) {
					if(result.status == 0 && result.data != null) {
						options.result=result;
						var html = template('tmpl-body',result.data);
						options.bodyContainer.innerHTML = html;
						common.insertHTML(doc.getElementById('pullrefresh'),'beforebegin',doc.getElementById('tmpl-tab-nav').innerHTML);
						
					
						
						var model = doc.getElementById('storeMobile');
						if(model != null){
							model.addEventListener('tap',function(){
								var telNumber = this.dataset.tel;
								//mui.alert('点击事件'+this.dataset.tel);
								setTimeout(function(){
									window.location.href="tel:"+telNumber;
								},300);
							});
						}
						
						var model = doc.getElementById('storeMap');
						if(storeMap != null){
							var mapUrl = "http://api.map.baidu.com/marker?location="+result.data.latitude+","+result.data.longitude+"&title="+result.data.name+"&content="+result.data.address+"&output=html";
							storeMap.addEventListener('tap',function(){
								window.location.href=mapUrl;
							});
						
						}
						
						
						options.this.createMenus(options);
					} else {
						common.alert({
							msg: result.message || '读取出错'
							,onHidden:function(){
								options.bodyContainer.innerHTML =document.getElementById('tmpl-model-null').innerHTML;
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
		createMenus:function(options){
			var optObjs = {
				urlPath: options.storeListGoodsUrl,
				data: {
					sid:options.sid,
					storeId:options.storeId,
					isInStock:true
				},
				isHeader:false,
				onBeforeSend: function() {
					
				},
				onSuccess: function(result) {
					if(result.status == 0 && result.data != null) {
						
						var html = template('tmpl-left',result);
						var model1 =doc.getElementById('item1mobile');
						model1.innerHTML = html;
						
						if(result.data.length > 0){
							options.this.createLeftMenu(options);
							doc.querySelector('.qc-bar-nav').classList.remove('mui-hide');
							//document.body.removeAttribute('data-imagelazyload');
							AjaxCommon.lazyloadTmpl(model1);
						}else{
							doc.getElementById('item1mobile').innerHTML =document.getElementById('tmpl-model-null').innerHTML;
							
						}
						
						

					} else {
						common.alert({
							msg: result.message || '读取出错'
							,onHidden:function(){
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
		createLeftMenu:function(options){
			var controls = document.getElementById("segmentedControls");
			var contents = document.getElementById("segmentedControlContents");
			//默认选中第一个
			controls.querySelector('.mui-control-item').classList.add('mui-active');
			contents.querySelector('.mui-control-content').classList.add('mui-active');

			var controlsElem = document.getElementById("segmentedControls");
			var contentsElem = document.getElementById("segmentedControlContents");
			var contentsElems = contents.querySelectorAll('.mui-control-content')
			var mui_store_head = document.querySelector('.mui-store-head').clientHeight;
			var segmentedControlHeight = document.getElementById('segmentedControl').clientHeight;
			var setHeightNumber = document.documentElement.clientHeight - mui_store_head - segmentedControlHeight -50;
			controlsElem.parentNode.style.cssText="height:"+setHeightNumber+"px;padding-bottom:50px;";
		
			controlsElem.parentNode.style.overflow = "scroll";
			if(contentsElems != null){
				for (var i = 0; i < contentsElems.length; i++) {
					contentsElems[i].style.cssText="height:"+setHeightNumber+"px;padding-bottom:50px;";
				}
			}
			
//			mui("#segmentedControls").on('tap','a',function(){
//				var $id = "#content"+parseInt(this.dataset.index);
//				console.log('执行');
//				
//				setTimeout(function(){
//					document.body.removeAttribute('data-imagelazyload');
//					AjaxCommon.lazyloadTmpl(document.body);
//				},500);
//			})
			
			//mui.alert('当前'+document.getElementById('item1mobile').offsetTop+"屏幕高度"+window.screen.availHeight+"~~"+document.body.offsetHeight+"~~"+window.screen.clientHeight+"~~"+document.body.clientHeight);
			//					
			//					setTimeout(function(){
			//						alert('当前'+document.getElementById('item1mobile').offsetTop+"屏幕高度"+window.screen.availHeight+"~~"+document.body.offsetHeight+"~~"+window.screen.clientHeight+"~~"+document.body.clientHeight);
			//					
			//						
			//					},1500);
			var deceleration = mui.os.ios ? 0.003 : 0.0009;
			mui('.mui-scroll-wrapper').scroll({
				bounce: false,
				indicators: true, //是否显示滚动条
				deceleration: deceleration
			});
			
			//再次options一次底部菜单
   	   	    options.cartBuy=doc.querySelector('.bar-cart');
   	   	    options.cartBuyNumber=doc.querySelector('.bar-cart .mui-badge');
   	   	    options.cartPriceText=doc.getElementById('bar-nav-price');
   	   	    options.cartBuyBtn=doc.querySelector('.bar-button');
   	   	    options.skuPopover=doc.getElementById('sku-popover');
   	   	    //购物车
   	   	    options.cartGroups=[];
   	   	    options.clearAll=doc.getElementById('mui-clear-cart');
   	   	    options.skuContainer=doc.getElementById('sku-container');
   	   	    options.skuPopover=doc.getElementById('sku-popover');
			
			 //把购物车的循环一边，然后查找，如果有就赋值
            for (var int = 0; int < options.cartGroups.length; int++) {
				var array_element = options.cartGroups[int];
				var btnGroupName=".js-plusBtn"+array_element.gid;
				if(doc.querySelector(btnGroupName) != undefined){
					doc.querySelector(btnGroupName).dataset.qty=array_element.qty;
				}
			}
           
            options.this._initGoodsTmpl(options);
            options.this._initPlusMin(options);
            
            options.this._initPageNav(options);
			
		},
		initcomponents: function(options) {

			options.this.leftRollInit(options);
			options.this._initPageNav(options);
		},
		leftRollInit:function(options){
			var r1,r2,r3,timer;
			r1=doc.getElementById('roll1');
			r2=doc.getElementById('roll2');
			r3=doc.getElementById('roll3');
			if(r2 != null){
				r3.innerHTML=r2.innerHTML;
				/*timer是清除定时的时间，但是这里暂时不需要*/
				setInterval(function(){
					if (r2.offsetWidth <= r1.scrollLeft) {
						r1.scrollLeft-=r2.offsetWidth;
					} else{
						r1.scrollLeft++;
					}
				},32);
			}
			
		},_initPageNav:function(options){
   	    	//购物车操作
   	    	options.cartBuy.addEventListener('tap',function(){
   	    		if(options.skuContainer.children.length > 0){
	    			mui(options.skuPopover).popover('toggle');
	   	    		var height=document.getElementById('sku-container').clientHeight+43;
	   	    		options.skuPopover.style.height=(height > 300 ? 300 : height)+'px';
   		    	}
   	    	});
   	    	options.clearAll.addEventListener('tap',function(){
   	    		var btnArray = ['确认', '取消'];
				mui.confirm('你是否确认要清空购物车', '小提示', btnArray, function(e) {
					if (e.index == 0) {
						mui(options.skuPopover).popover('hide');
   	    				options.this.clearAll(options);
   	    				
   	    				var listContainerGroup =options.this.getBtnGroups(options);
   	    		    	if(listContainerGroup.length > 0){
   	    		    		for (var int = 0; int < listContainerGroup.length; int++) {
   	    						var array_element = listContainerGroup[int];
   	    						array_element.dataset.qty=0;
   	    					}
   	    			    	options.this._initGoodsPlusMinsBtn(options,listContainerGroup);
   	    		    	}
   	    		    	options.this.setTotal(options);
					} 
				});
   	    		
   	    	});
   	    	
   	    	mui('body').on('shown', '#sku-popover', function(e) {
                //console.log('shown', e.detail.id);//detail为当前popover元素
   	    		options.cartBuy.parentNode.style.zIndex="1000";
            });
            mui('body').on('hidden', '#sku-popover', function(e) {
                //console.log('hidden', e.detail.id);//detail为当前popover元素
            	options.cartBuy.parentNode.style.cssText ="";
            });
            
          
            if(options.cartBuyBtn != null){
            	options.cartBuyBtn.addEventListener('tap',function(){
            		if(!options.cartBuyBtn.classList.contains('mui-disabled')){
            			var data=options.this._checkData(options);
            			data && options.this.submit(options,data);
            		}
            	});
            }
           
   	    	
   	    },
   	    _checkData:function(options){
   	    	
   	    	if(options.cartGroups.length == 0){
   	    		common.alert({msg:"您的购物车为空!"});
   	    		return false;
   	    	}
   	    	/*if(options.storeId == "" && options.ddpointId == ""){
   	    		common.alert({msg:"未选择门店"});
   	    		return false;
   	    	}*/
   	    	var orderStr="";
   	    	for (var int = 0; int < options.cartGroups.length; int++) {
				var array_element = options.cartGroups[int];
				orderStr+=array_element.gid+"--"+array_element.qty+"/";
			}
   	    	//去掉最后一个/
   	    	orderStr=orderStr.substr(0,orderStr.length-1);
   	    	
   	    	var data={
   	    		storeId:options.storeId,
   	    		orderStr:orderStr,
   	    		
   	    	}
   	    	return data;
   	    },
   	    submit:function(options,data){
   	    	//判断提交的类型
// 	    	var storeData={
// 	    		lng:options.result.data.longitude,
// 	    		lat:options.result.data.latitude,
// 	    		storeId:options.result.data.id,
// 	    		name:options.result.data.name
// 	    	}
// 	    	console.log(window.encodeURIComponent(JSON.stringify(storeData)));
    	    setTimeout(function(){
    		   var url=options.subOrderUrl+"?orderStr="+data.orderStr+"&storeId="+options.result.data.id
    		   window.location.href=url;
    	    },300);
   	    	/*} else{
   	    	   //酒急送订单
   	    	   //console.log('跳转到全民酒仓订单');
   	    	   setTimeout(function(){
 	    		   var url=options.ddorderSubUrl+"?orderStr="+data.orderStr+"&storeId="+data.storeId+"&ddpointId="+data.ddpointId;
 	    		   window.location.href=url;
 	    	   },300);
   	    	}*/
   	    	
   	    },
		_initGoodsTmpl:function(options){
			AjaxCommon.pageInit('#segmentedControlContents');
			mui('#segmentedControlContents').off('tap','.mui-cart-sku');//.mui-media-body
   	    	mui('#segmentedControlContents').on('tap','.mui-cart-sku',function(e){
   	    		//阻止A标签的冒泡
				e.preventDefault(e)
				e.stopPropagation(e);
   	    	});
   	    },
		 //获取内容页里面的按钮组
	    getBtnGroups: function () {
	        return document.querySelectorAll('#segmentedControlContents .input-group');
	    },
	    //获取购物车里面的按钮组
	    getCartBtnGroups:function(){
	    	return document.querySelectorAll('#sku-container .input-group');
	    },
	    _initPlusMin:function(options){
	    	var btnGroups=options.this.getBtnGroups();
	    	options.this._initGoodsPlusMinsBtn(options,btnGroups);
	    },
   	    _initGoodsPlusMinsBtn:function(options,btnGroups){
   	    	
   	    	
   	    	for (var i = 0; i < btnGroups.length; i++) {
   	    		if(btnGroups[i].getAttribute('data-qty') == 0){
		    		btnGroups[i].classList.add('animate-btn');
		    	}else{
		    		if(btnGroups[i].classList.contains('animate-btn')){
		    			btnGroups[i].classList.remove('animate-btn');
		    		}
		    	}
                mui(btnGroups[i]).plusMinusBtn({
                	max: btnGroups[i].getAttribute('data-stock'),
					buyQty: btnGroups[i].getAttribute('data-qty'),
					quantity: btnGroups[i].getAttribute('data-quantity'),
					btnClass: 'input-group-btn mui-btn',
					btnCssText: '',
					buyNumberCssText: ' margin-bottom: 0;padding:0;text-align:center;ime-mode:disabled',
					buyNumberClass: 'mui-input-group',
					stockClass: 'shop-stock mui-color-000',
					isShowStock: false,
                    min:0,
                    onPlus: function (e) {
                       options.this.updateCartAndGroup(options,e);
                    },
                    onMinus: function (e) {
                       options.this.updateCartAndGroup(options,e);
                    },
                    onChange: function(e){
                       options.this.updateCartAndGroup(options,e);
                    }	
                },true);
            }
   	    	
   	    },
	    updateCartAndGroup:function(options,e){
	    	
	    	if(e.buyNumber.value == 0){
	    		e.btnGroup.classList.add('animate-btn');
	    	}else{
	    		if(e.btnGroup.classList.contains('animate-btn')){
	    			e.btnGroup.classList.remove('animate-btn');
	    		}
	    	}
	    	switch (e.btnGroup.dataset.type) {
				case "group":
					//执行group的方法
					options.this.updateGroup(options,e);
					break;
				case "cart":
					//执行购物车的方法
					options.this.updateCart(options,e);
					break;
				default:
					break;
			}
	    },updateGroup:function(options,e){
	    	//检查购物车options.cartGroups
	    	
	    	e.btnGroup.dataset.qty=e.buyNumber.value;
	    	
			
    		//不符合,就设置
			var data={
				name:e.btnGroup.parentNode.parentNode.parentNode.querySelector('.qc-title').innerText,
				stock:e.btnGroup.dataset.stock,
				qty:e.btnGroup.dataset.qty,
				price:e.btnGroup.dataset.price,
				gid:e.btnGroup.dataset.gid
			}
	    	if(options.cartGroups.length > 0){
	    		var isNewData=true;
	    		for (var int = 0; int < options.cartGroups.length; int++) {
					 var array_element = options.cartGroups[int];
					 if( array_element.gid == data.gid){
						 if(data.qty > 0){
							 array_element.qty=data.qty;
						 }else{
							 options.cartGroups.splice(int,1);
						 }
						 isNewData=false;
					 }
				}
	    		
	    		if(isNewData){
	    		   options.cartGroups.push(data);
		    	}
	    	}else{
				options.cartGroups.push(data);
	    	}
			
			//更新一下
			options.this.tmplByCart(options);
	    },
	    updateCart:function(options,e){
	    	if(e.buyNumber.value > 0){
	    		e.btnGroup.dataset.qty=e.buyNumber.value;
	    	}else{
	    		options.skuContainer.removeChild(e.btnGroup.parentNode.parentNode);
	    		var height=document.getElementById('sku-container').clientHeight+43;
   	    		options.skuPopover.style.height=(height > 300 ? 300 : height)+'px';
	    	}
	    	//移除同时需要更新
	    	for (var int = 0; int < options.cartGroups.length; int++) {
				 var array_element = options.cartGroups[int];
				 if( array_element.gid == e.btnGroup.dataset.gid){
					 //更新qty参数
					 if(e.buyNumber.value > 0){
						 array_element.qty = e.buyNumber.value;
					 }else{
						 options.cartGroups.splice(int,1);
					 }
				 }
			}
	    	
	    	console.log(JSON.stringify(options.cartGroups));
	    	
	    	//if 没有了
	    	if(options.skuContainer.children.length == 0){
	    	   mui(options.skuPopover).popover('hide');
	    	}
	    	var id=e.btnGroup.dataset.gid;
	    	//同时更新
	    	var className=".js-plusBtn"+id;
	    	var listContainerGroup = doc.querySelectorAll(className);
	    	if(listContainerGroup.length > 0){
	    		for (var int = 0; int < listContainerGroup.length; int++) {
					var array_element = listContainerGroup[int];
					
					array_element.dataset.qty=e.buyNumber.value;
					
					
				}
		    	options.this._initGoodsPlusMinsBtn(options,listContainerGroup);
	    	}
	    	mui('.mui-scroll-wrapper.mui-not-scroll').scroll({bounce:false});
	    	//更新
	    	options.this.setTotal(options);
	    },
	    setTotal:function(options){
	    	//计算购物车的价钱
	    	var BtnGroups = options.this.getCartBtnGroups(),
	            price = 0,
	            qty = 0,
	            totalPrice = 0,
	            totalNumber=0;
	            
	        for (var i = 0; i < BtnGroups.length; i++) {
	         	price = BtnGroups[i].getAttribute('data-price');
	            qty = BtnGroups[i].getAttribute('data-qty');
	            totalNumber+=parseInt(qty);
	            totalPrice += parseFloat(price) * parseFloat(qty);
	        }
	        options.cartPriceText.innerText = totalPrice.toFixed(2);
	        options.cartBuyNumber.innerText = totalNumber;
	        /*if(totalNumber <= 0){
	        	options.myCart.classList.add(options.defaultHideClassName);
	        }*/
	    },
	    tmplByCart:function(options){
	    	
	    	var result={data:options.cartGroups};
	    	var html=template('tmpl-cart',result);
	    	options.skuContainer.innerHTML=html;
	    	mui('.mui-scroll-wrapper.mui-not-scroll').scroll({bounce:false});
	    	//初始化
	    	var cartGroups=options.this.getCartBtnGroups(options);
	    	options.this._initGoodsPlusMinsBtn(options,cartGroups);
	    	
	    	//更新
	    	options.this.setTotal(options);
	    },
	    clearAll:function(options){
    		options.cartGroups=[];
    		options.skuContainer.innerHTML="";
			//初始化
	    	var btnGroups=options.this.getBtnGroups(options);
	    	for (var int = 0; int < btnGroups.length; int++) {
				var array_element = btnGroups[int];
				array_element.dataset.qty=0;
				if(int == btnGroups.length-1){
					options.this._initGoodsPlusMinsBtn(options,btnGroups);
				}
			}
	    	options.this.setTotal(options);
	    }
	};
	window.storeView = model;
})(mui, document);