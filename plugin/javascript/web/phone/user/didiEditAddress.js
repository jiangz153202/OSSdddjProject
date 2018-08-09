;+(function(mui,doc){
	"use strict";
	
	var model={
			editaddress:{
				init:function(options){
					options=this.setOptions(options || {});
					mui.init();
					
					if(options.AddressId != "") {
						options.this.initPage(options);
					} else {
						//新增
						options.this.tmplBody(options, {});
					}
					
				},
				initPage:function(options){
					//初始化获取当页参数
					var optObjs = {
						urlPath: options.getAdrsUrl,
						data: {
							id:options.AddressId
						},
						onBeforeSend: function() {
	
							doc.querySelector('.mui-inner-wrap').innerHTML = doc.getElementById('tmpl-model-loading').innerHTML;
							//如果是上拉加载的，就要把相对定位的样式去掉
							
						},
						onSuccess: function(result) {
							if(result.status == 0 && result.data != null) {
								options.this.tmplBody(options,result.data);
							}else {
								document.body.dataset.status == 1;
								common.alert({
									msg: result.message || '读取出错',
									onHidden:function(){
										var offCanvasInner = mui('.mui-off-canvas-wrap')[0].querySelector('.mui-inner-wrap');
										offCanvasInner.addEventListener('drag', function(event) {
										    event.stopPropagation();
										});
										doc.querySelector('.mui-inner-wrap').innerHTML = doc.getElementById('tmpl-model-null').innerHTML;
									
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
				tmplBody: function(options, data) {
					
					//传入data
					var html = template('tmpl-model', data);
					var offCanvasInner=doc.querySelector('.mui-inner-wrap');
					offCanvasInner.innerHTML = html;
					
					
					//设置状态
					var body=doc.body;
					body.dataset.lng=data.longitude;
					body.dataset.lat=data.latitude;
					body.dataset.status = 0;
					//console.log(body.dataset);
					options.this.initForms(options);
					
					if(options.formBtnSub != null){
						options.formBtnSub.addEventListener('tap',function(){
							options.this.saveAdrs(options);
						});
					}
					
					if(options.formBtnDel != null){
						options.formBtnDel.addEventListener('tap',function(){
							options.this.deleteAdrs(options);
						});
					};
					if(options.formStreet != null){
						options.formStreet.addEventListener('tap',function(){
							//do something
							document.body.dataset.firstShow='1';
							if(document.body.dataset.status == 0){
								window.aboutAddress.addressShow();
							}else{
								common.alert({msg:'正在初始化地图,请稍等！'});
							}
							
						});
					}
					
				},
				hideMask:function(){
					var mask = document.querySelector('.mui-backdrop');
					if(mask != null){
						setTimeout(function(){
							
							document.body.removeChild(mask);
						},1000);
					}
				},
				setOptions:function(options){
					options.this=this;
					options.saveAdrsUrl = common.config.appPath + '/api/user/editAddress';//保存新加地址
	                options.deleteAdrsUrl = common.config.appPath + '/api/user/deleteAddress';//删除地址
	                options.getAdrsUrl = common.config.appPath + '/api/user/address';//获取用户地址
	                options.getAddressListUrl = common.config.appPath + "/api/user/addresses";
				
					options.AddressId = common.queryToJSON().addressId == undefined ? '' : common.queryToJSON().addressId;
					
					options.callbackUrl= common.queryToJSON().callback == undefined ? '' : common.queryToJSON().callback;
	                
	                options.defaultUrl=common.config.rootPath+"/user/address.html";
					
					return options;
				},
				initForms:function(options){
					options.formSelectConatiner = doc.getElementById('form-select-container');
	                options.formId = doc.getElementById('id');
	                options.formName = doc.getElementById('form-name');
	                options.formMobile = doc.getElementById('form-mobile');
	                options.formAddress = doc.getElementById('form-textarea');
	                options.formPro= doc.getElementById('form-province');
	                options.formCity= doc.getElementById('form-city');
	                options.formStreet=doc.getElementById('form-street');
	                options.formTown = doc.getElementById('form-town');
	                options.formBtnSub = doc.getElementById('form-submit');
	                options.formBtnDel = doc.getElementById('form-btn-del');
	                options.mySwitch=doc.getElementById('mySwitch');
					
					
					//事件初始化
					mui(".mui-switch").switch();
				},
	            //添加或者修改地址是，收集并且验证表单数据
	            getFormData: function (options) {
	            	//
	            	//
	            	//
	                var address = {
	                    id: options.formBtnSub.dataset.aid,
	                    name: options.formName.value.trim(),
	                    mobile: options.formMobile.value.trim(),
	                    province: options.formPro.value.trim(),
	                    city: options.formCity.value.trim(),
	                    town: options.formTown.value.trim(),
	                    address: options.formAddress.value.trim(),
	                    street:options.formStreet.value.trim(),
	                    longitude:document.body.dataset.lng == undefined ? '' : document.body.dataset.lng,
	                    latitude:document.body.dataset.lat == undefined ? '' : document.body.dataset.lat,
	                    sex: document.querySelector('input[name="radio-select"]:checked').dataset.sex,
	                    selected:options.mySwitch.classList.contains('mui-active') ? 1 : 0
	                };
	                if (address.name === '') {
	                    common.alert({ msg: options.formName.getAttribute('placeholder') });
	                    return;
	                }
	                if (address.mobile === '') {
	                    common.alert({ msg: options.formMobile.getAttribute('placeholder') });
	                    return;
	                }
	                
	                 var telReg = !!address.mobile.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
	                //如果手机号码不能通过验证
	                 if(telReg == false){
	                 	 common.alert({ msg: "手机号码格式不正确" });
	                      return;
	                }
	                
	                if (address.street === '') {
	                    common.alert({ msg: '请'+options.formStreet.getAttribute('placeholder') });
	                    return;
	                }
	                
	               
	                
	                /*if (address.province === '省份') {
	                    common.alert({ msg: '请选择省份！' });
	                    return;
	                }
	                if (address.city === '城市') {
	                    common.alert({ msg: '请选择城市！' });
	                    return;
	                }*/
	                /*if (address.town === '地区') {
	                    common.alert({ msg: '请选择地区！' });
	                    return;
	                }*/
	                /*if (address.address === '') {
	                    common.alert({ msg: options.formAddress.getAttribute('placeholder') });
	                    return;
	                }*/
	                if (address.id === "" || address.id === undefined) {
	                    address.id = 0;
	                }
	                
	                console.log(JSON.stringify(address));
	                //address
	                return address;
	            },
	            //保存地址
	            saveAdrs: function (options) {
	                alertOptions.msg = '正在保存，请稍后...';
	                alertOptions.callback = function (alertContext) {
	                    var address = options.this.getFormData(options);
	                    
	                    //初始化获取当页参数
						var optObjs = {
							urlPath: options.saveAdrsUrl,
							data:address,
							onBeforeSend: function() {
							},
							onSuccess: function(result) {
								if (result.status === 0) {
		                            alertContext.setMsg('修改成功！');
		                            var url="";
		                            if(options.callbackUrl == ""){
		                            	url=options.defaultUrl;
		                            	console.log(address.id+"id1");
		                            }else{
		                            	var str = window.decodeURIComponent(options.callbackUrl);
		                            	
		                            	url=options.callbackUrl;
		                            }
		                            window.location.href=url;
		                        } else {
		                            alertContext.setMsg(result.message || '地址保存失败');
		                        }
		                        alertContext.hide();
							},
							onError: function() {
								console.log('失败回调');
							}
						};
						address &&	AjaxCommon.getAjaxRequestJson(optObjs);
						
	                };
	                common.alert(alertOptions);
	                options.this.hideMask();
	            },
	            //删除地址
	            deleteAdrs: function (options) {
	                alertOptions.msg = '正在删除，请稍后...';
	                alertOptions.callback = function (alertContext) {
	                	
	                		                    //初始化获取当页参数
						var optObjs = {
							urlPath: options.deleteAdrsUrl,
							data: {
								id:options.formBtnSub.dataset.aid
							},
							onBeforeSend: function() {
								
							},
							onSuccess: function(result) {
								  if (result.status === 0) {
		                            alertContext.setMsg('删除成功！');
		                            alertContext.hide();
		                            var url="";
		                            if(options.callbackUrl == ""){
		                            	
		                            	url=options.defaultUrl;
		                            	window.location.href=url;
		                            }else{
		                            	if(window.decodeURIComponent(options.callbackUrl).indexOf('orderStr') > 0){
		                            		//判断还有没有
		                            	
		                            		options.this.selectedAds(options,function(count){
		                            			console.log('数量'+count);
		                            			if(count > 0){
		                            				url = window.decodeURIComponent(options.callbackUrl).split('callback=')[1];
		                            				window.location.href=url;
		                            			}else{
		                            				var cUrl=window.decodeURIComponent(options.callbackUrl).split('callback=')[1];
		                            				url = cUrl.split('&')[0];
		                            				window.location.href=url;
		                            			}
		                            		});
		                            	}else{
		                            		url=options.callbackUrl;
		                            		window.location.href=url;
		                            	}
		                            	
		                            }
		                            //console.log(url);
		                           
		                           
		                        } else {
		                            alertContext.setMsg(result.message || '地址删除失败');
		                        }
							},
							onError: function() {
								console.log('失败回调');
							}
						};
						AjaxCommon.getAjaxRequestJson(optObjs);
	                   
	                };
	                common.alert(alertOptions);
	                options.this.hideMask();
	            },
	            selectedAds:function(options,callback){
						var optObjs = {
							urlPath: options.getAddressListUrl,
							data: {
							},
							onSuccess: function(result) {
								
								if(result.status == 0) {
									
									typeof (callback) === "function" && callback(result.data.length);
									
								}else{
									typeof (callback) === "function" && callback(0);
								}
							},
							onError: function() {
								console.log('失败回调');
								typeof (callback) === "function" && callback(0);
							}
						};
						AjaxCommon.getAjaxRequestJson(optObjs);
				}		
		}
	};
	window.didiEditAddress=model;
}(mui,document));