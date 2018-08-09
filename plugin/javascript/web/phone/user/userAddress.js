; + (function(mui, doc) {
	var model = {
		list: {

			init: function(options) {
				options = this.setOptions(options || {});

				/*	_fn.wechatConfig(options,function(options){
	            	wx.ready(function(){
	            		_fn.shareWx(options,options.shareData);
	            	});
		        });*/
				
				options.this.initPage(options);
				
			},
			setOptions: function(options) {
				options.this = this;
				options.listContainer = doc.getElementById('list-container');
				options.editAddressBtn = doc.getElementById('edit-address-btn');

				options.editAdsUrl = common.config.rootPath + "/user/editAddress.html";

				options.getAddressListUrl = common.config.appPath + "/api/user/listAddresses";

				options.setDefaultAddressUrl = common.config.appPath + "/api/user/setDefaultAddress";

				options.addAddressUrl = common.config.appPath + "/api/user/address/add";

				options.deleteAddressUrl = common.config.appPath + "/api/user/deleteAddress";

				return options;
			},
			initPage: function(options) {
				//初始化获取当页参数
				var optObjs = {
					urlPath: options.getAddressListUrl,
					data: {},
					onBeforeSend: function() {

						options.listContainer.innerHTML = doc.getElementById('tmpl-model-loading').innerHTML;
						//如果是上拉加载的，就要把相对定位的样式去掉
						document.querySelector('.spinner-child').classList.remove('spinner-child-fixed');
					},
					onSuccess: function(result) {
						if(result.status == 0 && result.data.length > 0) {
							options.result = result;
							//初始化主体
							options.this.tmplBody(options);

						}else if(result.data.length == 0){
							options.listContainer.innerHTML = doc.getElementById('tmpl-model-null').innerHTML;
						}else {
							common.alert({
								msg: result.message || '读取出错'
							});
						}
					},
					onError: function() {
						console.log('失败回调');
					}
				};
				if(options.editAddressBtn != null) {
					options.editAddressBtn.addEventListener('tap', function() {
						options.this.editUserAddress(options);
					});
				}
				AjaxCommon.getAjaxRequestJson(optObjs);
			},
			tmplBody: function(options) {
				//生成主体
				var html = "";
				if(options.result.data.length > 0) {
					html = template('tmpl-model', options.result.data);
				} else {
					html = doc.getElementById('tmpl-model-null').innerHTML;
				}
				options.listContainer.innerHTML = html;

				options.this.initEvent(options);
				var deceleration = mui.os.ios ? 0.003 : 0.0009;
				mui('.mui-scroll-wrapper').scroll({
					bounce: false,
					indicators: false, //是否显示滚动条
					deceleration: deceleration
				});
				mui.init();
			},
			checkExg:function(callBackUrl,ExgStr){
				var locationSearchSlice = callBackUrl.substr(callBackUrl.indexOf('?')+1,callBackUrl.length)
				var pairs=locationSearchSlice.split('&');
		        var result = true;
		        pairs.forEach(function (pair) {
		            pair = pair.split('=');
		            
		            if(pair[0].trim() == ExgStr.trim()){
		            	result=false;
		            }
		            
		        });
		        return result;
			},
			initEvent: function(options) {
				mui(options.listContainer).off('tap');
				
				mui(options.listContainer).on('tap', '.mui-media:not(.no_pd)', function(e) {
					//console.log('这是回调'+this.dataset.aid);
					var _self=this;
					if(_self.parentNode.classList.contains('callback-item')){
						_self=_self.parentNode;
					}
					if(common.queryToJSON().callback != undefined){
						var callBackUrl=common.queryToJSON().callback;
						
						if(callBackUrl.indexOf('?') != -1){
							
							if(options.this.checkExg(callBackUrl,'userAddressId')){
								callBackUrl+="&userAddressId="+_self.dataset.aid;
							}else{
								//如果有那么应该从新拼接
								var urlStr="";
								for (var i = 0; i < callBackUrl.split('&').length; i++) {
									var data=callBackUrl.split('&')[i];
									if(data.split('=')[0] == 'userAddressId'){
										urlStr+=data.split('=')[0]+'='+_self.dataset.aid;
									}else{
										urlStr+=data
									}
									if(i != callBackUrl.split('&').length -1){
										urlStr+="&";
									}
								}
								callBackUrl=urlStr;
								
							}
							
						}else{
							callBackUrl+="?userAddressId="+_self.dataset.aid;
						}
					
						setTimeout(function(){
							window.location.href=callBackUrl;
						},100);
					}
				});
				
				mui(options.listContainer).on('tap', '.update-address-icon', function() {
					//console.log('这是修改'+this.dataset.aid);
					options.this.editUserAddress(options, this.dataset.aid);
				});
				
				
				mui(options.listContainer).on('tap', '.delete-address-icon', function() {
					var _selfThis = this;
					mui.confirm("您确定删除该地址吗？", " ", ["确定", "取消"], function(e) {
						if(e.index == 0) {
							options.this.sendRequest(options, _selfThis.dataset.aid, options.deleteAddressUrl, function() {
								//回调
								var items = options.result.data;
								for(var i = 0; i < items.length; i++) {
									if(items[i].id == _selfThis.dataset.aid) {
										items.splice(i, 1);
										/*console.log(JSON.stringify(options.result.data.items));*/
									}
								};
								options.listContainer.innerHTML = "";
								options.this.tmplBody(options);

							});
						}
					});
				});

				mui(options.listContainer).on('tap', 'label,input[name="radio-select"]', function() {
					var _selfThis = this;
					if(this.parentElement.querySelector('input[name="radio-select"]').checked == false) {
						options.this.sendRequest(options, _selfThis.dataset.aid, options.setDefaultAddressUrl, function() {
							//
							var items = options.result.data;
							for(var i = 0; i < items.length; i++) {
								if(items[i].addressId == _selfThis.dataset.aid) {
									items[i].selected = true;

								} else {
									items[i].selected = false;
								}
							};
							//console.log(JSON.stringify(options.result.data.items));
						});
					} else {
						console.log('这个之前就是默认的，就不改了');
					}
				});
			},
			sendRequest: function(options, aid, urlPath, onCallBack) {
				alertOptions.msg = '正在请求中',
					alertOptions.callback = function(alertContext) {
						var opts = {
							urlPath: urlPath,
							data: {
								"id": aid
							},
							onSuccess: function(result) {
								if(result.status == 0) {
									alertContext.setMsg('请求成功');
									alertContext.hide();
                                     
									//如果请求成功
									onCallBack && typeof(onCallBack) == 'function' && onCallBack();
								    window.location.reload();//刷新页面

								} else {
									alertContext.setMsg('请求失败');
									alertContext.hide();
								}
							},
							onError: function() {
								alertContext.setMsg('请求失败');
								alertContext.hide();
							}
						}

						AjaxCommon.getAjaxRequestJson(opts);
					}
				common.alert(alertOptions);
			},
			editUserAddress: function(options, addressId) {
				var callbackUrl = window.encodeURIComponent(window.location.href);
				var addressId = addressId === undefined ? "" : addressId;
				var urlPath = options.editAdsUrl + "?callback=" + callbackUrl + "&addressId=" + addressId;
				mui.later(function() {
					window.location.href = urlPath;
				}, 300);

			}

			/*list End*/
		},
		edit: {
			init: function(options) {
				options = this.setOptions(options || {});
			
			
				if(options.AddressId != "") {
					options.this.initPage(options);
				} else {
					//新增
					options.this.tmplBody(options, {});
				}

				
				//this.initPage(options);
			},
			setOptions: function(options) {
				options.this = this;

				options.getAddressListUrl = common.config.appPath + "/api/user/getUserAddresses";
				options.updateAddressUrl = common.config.appPath + "/api/user/editUserAddress";
			
				options.AddressId = common.queryToJSON().addressId == undefined ? '' : common.queryToJSON().addressId;
				
				options.callback= common.queryToJSON().callback == undefined ? '' : common.queryToJSON().callback;
				return options;
			},
			initPage: function(options) {
				//初始化获取当页参数
				var optObjs = {
					urlPath: options.getAddressListUrl,
					data: {},
					onBeforeSend: function() {
						common.insertHTML(doc.body, 'afterbefore', doc.getElementById('tmpl-model-loading').innerHTML);
					},
					onSuccess: function(result) {
						if(result.status == 0) {
							for(var i = 0; i < result.data.length; i++) {
								var item = result.data[i];
								if(item.addressId == options.AddressId) {

									options.this.tmplBody(options, item);
								}
							}
						} else {
							common.alert({
								msg: "提交出错,请稍后再试"
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
				doc.body.innerHTML = html;
				

				options.this.eventNode(options);
			},
			eventNode: function(options) {
                options.formName = doc.getElementById('from-name');
                options.formMobile = doc.getElementById('from-mobile');
				options.formFullPath = doc.getElementById('from-fullPath');
                options.formAddress = doc.getElementById('from-textarea');
                options.mySwitch=doc.getElementById('mySwitch');
                options.formBtnSub = doc.getElementById('from-submit');
				
				//事件初始化
				mui(".mui-switch").switch();
				
				mui.init();
				
				if(options.formFullPath != null){
					options.this.initPicker(options);
				}
				
				if(options.formBtnSub != null) {
					options.formBtnSub.addEventListener('tap', function() {
						var data = options.this.checkData(options);
						data && options.this.submitAds(options,data);
					});
				};
			},
			submitAds:function(options,data){
				var url="";
				if(data.addressId == 0){
					//
					url=options.addAddressUrl;
					//移除id属性
					delete data.addressId;
					
				}else{
					url=options.updateAddressUrl;
				}
				var optObjs = {
					urlPath: url,
					data: data,
					onBeforeSend: function() {
						
					},
					onSuccess: function(result) {
						
						if(result.data.result) {
							mui.toast("提交成功");
							
							if(options.callback != ''){
								setTimeout(function(){
									window.location.href=options.callback;
								},300);
							}
							

						} else {
							common.alert({
								msg: result.head.bmessage || '读取出错'
							});
						}

					},
					onError: function() {
						console.log('失败回调');
					}
				};
				AjaxCommon.getAjaxRequestJson(optObjs);
				
				console.log("提交事件");
			},
			checkData: function(options) {
				//添加收获地址
				//options.mySwitch.classList.contains('mui-active') ? 1 : 0
				var address = {
					"address": options.formAddress.value.trim(),
			        "areaId" :  options.formFullPath.dataset.areaid == undefined ? "" : options.formFullPath.dataset.areaid,
			        "isDefault": 1,
			        "postCode": "000000",
			        "sex": document.querySelector('input[name="radio-select"]:checked').dataset.sex,
			        "userName": options.formName.value.trim(),
			        "userPhone": options.formMobile.value.trim(),
			        "addressId": options.formBtnSub.dataset.aid
			        
                };
                
                if (address.userName === '') {
                    common.alert({ msg: options.formName.getAttribute('placeholder') });
                    return;
                }
                if (address.userPhone === '') {
                    common.alert({ msg: options.formMobile.getAttribute('placeholder') });
                    return;
                }
                
                var telReg = !!address.userPhone.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
                //如果手机号码不能通过验证
                if(telReg == false){
                 	common.alert({ msg: "手机号码格式不正确" });
                    return;
                }
                
                if (address.areaId === '') {
                    common.alert({ msg: options.formFullPath.getAttribute('placeholder') });
                    return;
                }
                
                if (address.address === '') {
                    common.alert({ msg: options.formAddress.getAttribute('placeholder') });
                    return;
                }
               
                if (address.address.length < 5) {
                    common.alert({ msg: "详细地址不足5个字" });
                    return;
                }
                if (address.addressId === "" || address.addressId === undefined) {
                    address.addressId = 0;
                }
                return address;
			},
			initPicker:function(options){
				//-----------------------------------------
				//					//3级联示例
				var cityPicker3 = new mui.PopPicker({
					layer: 3
				});
				cityPicker3.setData(cityData3);
				
				//设置默认参数
//				var seletedItems = new Array(options.provinceId,options.cityId,options.townId);
//				cityPicker3.setValue(seletedItems);
				
				options.formFullPath.addEventListener('tap', function(event) {
					/*var inputs = document.getElementsByTagName('input');
					for (var i=0;i<inputs.length;i++) {
						var input = inputs[i];
						if (!input.readOnly)
							inputs[i].blur();
					}*/
					cityPicker3.show(function(items) {
						var townText=(items[2] || {}).text == undefined ? '' :(items[2] || {}).text;
						options.formFullPath.value = (items[0] || {}).text + " " + (items[1] || {}).text + " " + townText;
						if(townText != ""){
							options.formFullPath.dataset.areaid=(items[2] || {}).value;
						}else{
							options.formFullPath.dataset.areaid=(items[1] || {}).value;
						}
//						options.formPro.value=(items[0] || {}).text;
//						options.formCity.value=(items[1] || {}).text;
//						options.formTown.value=(items[2] || {}).text == undefined ? '' :(items[2] || {}).text;
						//返回 false 可以阻止选择框的关闭
						//return false;
					});
				}, false);
			}
		}
	};
	window.userAddress = model;
})(mui, document);