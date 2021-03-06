; + (function(mui, doc) {
	var vm = null;
	var initTime = null;

	function initPageModel(options) {
		options.point = {
			lng: 0,
			lat: 0
		}
		options.this.pullupRefresh(options);
	}

	function tmplCountDownFunc() {
		var countDownDom = document.querySelector('.mod_sale_time');
		var timeDom = countDownDom.querySelector('.mod_sale_time_cmp');
		var titleDom = countDownDom.querySelector('.mod_sale_time_title');

		if(timeDom === undefined || timeDom === null) return;

		var startTimeArrays = timeDom.dataset.start.split(':');
		var endTimeArrays = timeDom.dataset.end.split(':');
		var _thisHours = (new Date).getHours();
		var _thisMinutes = (new Date).getMinutes();

		var a = new Date();
		a.setHours(startTimeArrays[0]);
		a.setMinutes(startTimeArrays[1]);
		a.setSeconds(0);
		console.log(a.toLocaleString());

		var b = new Date();
		b.setHours(endTimeArrays[0]);
		b.setMinutes(endTimeArrays[1]);
		b.setSeconds(0);
		console.log(b.toLocaleString());
		//拼装倒计时
		var startStamp = a.getTime();
		var endStamp = b.getTime();
		var nowStamp = (new Date).getTime();
		if(startStamp > nowStamp) {
			//未开始
			titleDom.innerHTML = "距离本场开始";
			countDownFunc((startStamp - nowStamp), timeDom.querySelectorAll('i'), function() {
				tmplCountDownFunc();
			});

		} else if(nowStamp >= startStamp && nowStamp < endStamp) {
			//进行中
			titleDom.innerHTML = "距离本场结束";
			countDownFunc((endStamp - nowStamp), timeDom.querySelectorAll('i'), function() {
				tmplCountDownFunc();
			});
		} else {
			//已结束
			titleDom.innerHTML = "今日秒杀活动已结束";
			for(var i = 0; i < timeDom.querySelectorAll('i').length; i++) {
				var item = timeDom.querySelectorAll('i')[i];
				item.innerHTML = "0";
			}
		}
	};

	function countDownFunc(times, domList, callback) {
		var timer = null;
		timer = setInterval(function() {
			if(times > 0) {
				var hour = parseInt(times / 1000 / 60 / 60 % 24, 10); //计算剩余的小时数  
				var minute = parseInt(times / 1000 / 60 % 60, 10); //计算剩余的分钟数  
				var second = parseInt(times / 1000 % 60, 10); //计算剩余的秒数

				if(hour <= 9) hour = '0' + hour;
				if(minute <= 9) minute = '0' + minute;
				if(second <= 9) second = '0' + second;
				// console.log('倒计时'+hour+":"+minute+":"+second);

				domList[0].innerText = hour.toString().split('')[0];
				domList[1].innerText = hour.toString().split('')[1];
				domList[2].innerText = minute.toString().split('')[0];
				domList[3].innerText = minute.toString().split('')[1];
				domList[4].innerText = second.toString().split('')[0];
				domList[5].innerText = second.toString().split('')[1];
			}

			times = times - 1000;
			//console.log(times);
			if(times < 0) {
				typeof callback === 'function' && callback();
				console.log('结束了');

				clearInterval(timer);
			}

		}, 1000);

	}

	var model = {
		init: function(options) {
			options = this.setOptions(options || {});
			
			
			var script=document.createElement("script");
			script.type="text/javascript";
			script.src="http://g.tbcdn.cn/mtb/lib-flexible/0.3.4/flexible.js";
			document.getElementsByTagName('head')[0].appendChild(script); 
			if(mui.os.ios){}
			
			
			if(options.selfchoose != '') {
				console.log('选择地址进入');

				var data = JSON.parse(options.selfchoose);
				options.sid = AjaxCommon.cookieItem.getCookie('dddjsid');
				//console.log(options.sid);
				options.point = new BMap.Point(data.lng, data.lat);
				doc.body.dataset.lng = data.lng;
				doc.body.dataset.lat = data.lat;
				options.positionLab.innerHTML=data.title;

				options.this.pullupRefresh(options);

			} else {
				//
				var times = localStorage.getItem('timeStampArrays');
				//如果在5分钟内刷新 那就不用再次定位
				if(times != null) {

					var tiemArrays = times.split('-');
					if(times != null && ((new Date).getTime() - tiemArrays[0]) / 1000 > 0 && ((new Date).getTime() - tiemArrays[0]) / 1000 <= options.maxTime) {
						var transformTime = ((new Date).getTime() - tiemArrays[0]) / 1000;
						//如果没有超过5分钟,那就不需要在重新定时
						console.log('计算过去了多少秒' + transformTime);
						document.body.dataset.lng = tiemArrays[1];
						document.body.dataset.lat = tiemArrays[2];
						options.point = {
							lng: tiemArrays[1],
							lat: tiemArrays[2]
						}
						options.sid = tiemArrays[3];
						options.positionLab.innerHTML = tiemArrays[4];
						options.this.pullupRefresh(options);
						
						

					} else {
						if(mui.os.wechat) {
							_wxShareApi.wechatConfig({}, function() {
								options.this.convert(translateCallback);
							});
						}
						//非微信环境
						if(!mui.os.wechat) {
							options.this.initMapCompant(options, function(data) {
								translateCallback(data);
							});
							//console.log('测试');
						}
					}
				} else {
					if(mui.os.wechat) {
						_wxShareApi.wechatConfig({}, function() {
							options.this.convert(translateCallback);
						});
					}
					//非微信环境
					if(!mui.os.wechat) {
						options.this.initMapCompant(options, function(data) {
							translateCallback(data);
						});
						//console.log('测试');
					}
				}

			}

			translateCallback = function(data) {
				//mui.alert(JSON.stringify(data)+"转换后"+(new Date()).toLocaleTimeString());
				if(data.status == 0) {
					//地址赋值
					options.point = data.points[0];

					doc.body.dataset.lng = options.point.lng;
					doc.body.dataset.lat = options.point.lat;

					//地址转化为
					//转换定位
					var bPoint = new BMap.Point(options.point.lng, options.point.lat);
					var geoc = new BMap.Geocoder();

					geoc.getLocation(bPoint, function(rs) {

						var addComp = rs.addressComponents;
						if(addComp.district == '' && addComp.street == ''){
							options.positionLab.innerHTML = addComp.city;
						}else{
							options.positionLab.innerHTML = addComp.district + addComp.street; // + addComp.street
						}
						if(options.positionLab.innerHTML == ''){
							options.positionLab.innerHTML = '定位失败';
						}
						if(AjaxCommon.cookieItem.getCookie('dddjsname') != addComp.city) {

							var getCurrentShopIdObjs = {
								urlPath: common.config.currentShopIdUrl,
								data: {
									city: addComp.city
								},
								onSuccess: function(result) {
									//console.log('获取地理位置成功,获取city'+result);
									//alert(JSON.stringify(result)+"获取成功"+JSON.stringify(addComp));
									if(result) {
										AjaxCommon.cookieItem.setCookie('dddjsid', result, 1);
										AjaxCommon.cookieItem.setCookie('dddjsname', addComp.city, 1);
										options.sid = result;

									} else {
										//默认设为东莞
										AjaxCommon.cookieItem.setCookie('dddjsid', 1, 1);
										AjaxCommon.cookieItem.setCookie('dddjsname', "东莞市", 1);

									}

									typeof callback === 'function' && callback();

								}
							}
							AjaxCommon.getAjaxRequestJson(getCurrentShopIdObjs);
						} else {

							console.log('跳过重复设置');
							typeof callback === 'function' && callback();
						}

					});

					options.this.pullupRefresh(options);
				} else {
					mui.alert("您的地址获取有问题哟!")
				}
			}

			//设置一个定时器  如果在6秒中获取不到 就直接启动
//			if(mui.os.ios) {
//				//如果是IOS就设置这个任务
//				initTime = setTimeout(function() {
//					console.log('进入定时器任务');
//					initPageModel(options);
//				}, 6000);
//			}

			//初始化获取当页参数
			mui.init();

		},
		setOptions: function(options) {
			options.this = this;
			options.data = null; //缓存数据
			options.maxTime = 300;
			options.selfchoose = common.queryToJSON().selfchoose == undefined ? '' : common.queryToJSON().selfchoose;
			options.positionLab = doc.querySelector('.lable-position');
			options.isStorage = false;
			options.bodyContainer = doc.getElementById('body-container');
			options.pullrefresh = mui('#pullrefresh');

			options.getIndexDataUrl = common.config.appPath + '/api/indexData';

			options.sid = 1;
			options.limit = 20; //默认20个
			return options;
		},
		pullupRefresh: function(options) {
			options.this.initcomponents(options);
		},
		initMapCompant: function(options, callback) {
			//获取当前位置
			alertOptions.msg = '正在定位中,请稍等...';
			alertOptions.callback = function(alertContext) {
				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition(function(r) {
					if(this.getStatus() == BMAP_STATUS_SUCCESS) {
						//console.log(JSON.stringify(r));
						alertContext.setMsg('定位' + r.address.city + '成功');
						alertContext.hide();

						var data = {
							status: 0,
							points: []
						};
						var point = {
							lng: r.point.lng,
							lat: r.point.lat
						}
						data.points.push(point);

						typeof callback === 'function' && callback(data);

					} else {
						alertContext.setMsg('定位失败！');
						alertContext.hide();
						//alert('failed'+this.getStatus());
					}
				}, {
					enableHighAccuracy: true
				});
			};
			common.alert(alertOptions);
		},
		convert: function(translateCallback) {
			wx.getLocation({
				success: function(res) {
					//common.alert({msg:JSON.stringify("微信坐标点" + res)});
					//谷歌坐标
					var ggPoint = new BMap.Point(res.longitude, res.latitude);

					var convertor = new BMap.Convertor(); //坐标转换接口
					var pointArr = [];
					pointArr.push(ggPoint);
					convertor.translate(pointArr, 1, 5, translateCallback)

				},
				cancel: function(res) {
					common.alert({
						msg: '用户拒绝授权获取地理位置'
					});
				},
				fail: function(res) {
					common.alert({
						msg: '获取地理位置失败' + JSON.stringify(res),
						callback: function() {
//							options.this.initMapCompant(options, function(data) {
//								translateCallback(data);
//							});
						}
					});
				}
			});
		},
		getIndexData: function(options) {
//			if(mui.os.ios) {
//				//如果进来这个任务了,就清空掉定时器
//				initTime != null && clearTimeout(initTime);
//			}

			var optObjs = {
				urlPath: options.getIndexDataUrl, //options.getArticlesUrl,
				data: {
					'sid': options.sid,
					'distance': 3000,
					'longitude': options.point.lng, //
					'latitude': options.point.lat, //
					'pageSize': 3
				},
				isHeader: false,
				onBeforeSend: function() {},
				onSuccess: function(result) {
					var times = localStorage.getItem('timeStampArrays');
					//如果在5分钟内刷新 那就不用再次定位
					if(times != null) {
						var tiemArrays = times.split('-');
						var transformTime = ((new Date).getTime() - tiemArrays[0]) / 1000;
						if(transformTime > options.maxTime) {
							//console.log('计算时差'+times+ transformTime);
							//如果没有超过5分钟,那就不需要在重新定时
							var tiemStrs = (new Date()).getTime() + "-" + options.point.lng + "-" + options.point.lat + "-" + options.sid + "-" +options.positionLab.innerHTML;
							localStorage.setItem('timeStampArrays', tiemStrs);
						}
					} else {
						//console.log('首次注册'+times+ transformTime);
						var tiemStrs = (new Date()).getTime() + "-" + options.point.lng + "-" + options.point.lat + "-" + options.sid +"-" +options.positionLab.innerHTML;
						localStorage.setItem('timeStampArrays', tiemStrs);
					}

					//					var tagsData =result.data.tags = tagsData;
					result.data.plate = [{
							bannerName: "百元热销区",
							bannerId: 1,
							href: "/userActivity/recommend.html",
							bannerImgUrl: '/framwork/global_icon/index/staticImg/hotshop@2x.png',
							items: [{
									goodsPrice: "",
									id: 307,
									imgUrl: "/framwork/global_icon/index/staticImg/1.png",
									imgDesc: "",
									name: "(智利)红魔鬼卡本妮苏维翁干红葡萄酒",
									tagDesc: "口感圆润,果味芳香",
									price: 76,
									sold: 507,
									selfRun: false,
								},
								{
									goodsPrice: "",
									id: 310,
									imgUrl: "/framwork/global_icon/index/staticImg/2.png",
									imgDesc: "",
									name: "(智利)干露缘峰卡本妮苏维翁红葡萄酒 ",
									tagDesc: "醉美果香,口感丰富",
									price: 66,
									sold: 507,
									selfRun: false,
								},
								{
									goodsPrice: "",
									id: 263,
									imgUrl: "/framwork/global_icon/index/staticImg/3.png",
									imgDesc: "",
									name: "(法国)奥克奥希耶干红葡萄酒",
									tagDesc: "尊贵口感,原香最美",
									price: 99,
									sold: 507,
									selfRun: false,
								},
								{
									goodsPrice: "",
									id: 204,
									imgUrl: "/framwork/global_icon/index/staticImg/4.png",
									imgDesc: "",
									name: "(法国)帕蒂斯红葡萄酒",
									tagDesc: "热销爆款，节日必囤",
									price: 68,
									sold: 507,
									selfRun: false,
								},
								{
									goodsPrice: "",
									id: 5,
									imgUrl: "/framwork/global_icon/index/staticImg/5.png",
									imgDesc: "",
									name: "(法国)银伯爵干红葡萄酒",
									tagDesc: "酒体圆润，单宁柔和",
									price: 98,
									sold: 507,
									selfRun: false,
								},
								{
									goodsPrice: "",
									id: 6,
									imgUrl: "/framwork/global_icon/index/staticImg/6.png",
									imgDesc: "",
									name: "(法国)白龙毕加龙赤霞珠干红葡萄酒",
									tagDesc: "口感圆润,果味芳香",
									price: 98,
									sold: 507,
									selfRun: false,
								}
							]
						},
						{
							bannerName: "精品特惠区",
							href: "/userActivity/preferential.html",
							bannerId: 2,
							bannerImgUrl: '/framwork/global_icon/index/staticImg/特惠banner@2x.png',
							items: [{
									goodsPrice: "",
									id: 204,
									imgUrl: "/framwork/global_icon/index/staticImg/2_1.png",
									imgDesc: "+1元可换购一瓶",
									name: "(法国)帕蒂斯红葡萄酒",
									tagDesc: "",
									price: 68,
									sold: 507,
									selfRun: false,
								},
								{
									goodsPrice: "",
									id: 307,
									imgUrl: "/framwork/global_icon/index/staticImg/2_2.png",
									imgDesc: "买酒送运动臂带",
									name: "(智利)红魔鬼卡本妮苏维翁干红葡萄酒",
									tagDesc: "",
									price: 76,
									sold: 507,
									selfRun: false,
								},
								{
									goodsPrice: "",
									id: 12,
									imgUrl: "/framwork/global_icon/index/staticImg/2_3.png",
									imgDesc: "买酒送高级冰杯一个",
									name: "(韩国)蓝妹啤酒(bluegirl) 330ml*24",
									tagDesc: "",
									price: 185,
									sold: 507,
									selfRun: false,
								},
								{
									goodsPrice: "",
									id: 314,
									imgUrl: "/framwork/global_icon/index/staticImg/2_4.png",
									imgDesc: "买大瓶送小瓶",
									name: "700ml 福阁5号v.s.o.p 干邑白兰地 (法国)原瓶进口",
									tagDesc: "",
									price: 148,
									sold: 507,
									selfRun: false,
								},
								{
									goodsPrice: "",
									id: 53,
									imgUrl: "/framwork/global_icon/index/staticImg/2_7.png",
									imgDesc: "送五件套杯一套",
									name: "(法国)马爹利蓝带干邑白兰地 ",
									tagDesc: "",
									price: 1080,
									sold: 507,
									selfRun: false,
								},
								{
									goodsPrice: "",
									id: 125,
									imgUrl: "/framwork/global_icon/index/staticImg/2_6.png",
									imgDesc: "买送旅行茶具一套",
									name: "700ml 雷伯斯XO白兰地 40%vol(法国)原瓶进口",
									tagDesc: "",
									price: 398,
									sold: 507,
									selfRun: false,
								}
							]
						},
						{
							bannerName: "80/90专区",
							href: "/act/activity.html?type=8090",
							bannerId: 3,
							bannerImgUrl: '/framwork/global_icon/index/staticImg/8090@2x.png',
							items: [{
									goodsPrice: "",
									id: 262,
									imgUrl: "/framwork/global_icon/index/staticImg/3_1.png",
									imgDesc: "品牌精选",
									name: "(智利)巴斯克精选红葡萄酒 ",
									tagDesc: "",
									price: 168,
									sold: 507,
									selfRun: false,
								},
								{
									goodsPrice: "",
									id: 134,
									imgUrl: "/framwork/global_icon/index/staticImg/3_2.png",
									imgDesc: "清甜优雅",
									name: "(智利)干露开拓者干白葡萄酒 ",
									tagDesc: "",
									price: 138,
									sold: 507,
									selfRun: false,
								},
								{
									goodsPrice: "",
									id: 195,
									imgUrl: "/framwork/global_icon/index/staticImg/3_3.png",
									imgDesc: "优质混酿",
									name: "(智利)红魔鬼魔尊白葡萄酒",
									tagDesc: "",
									price: 208,
									sold: 507,
									selfRun: false,
								},
								{
									goodsPrice: "",
									id: 194,
									imgUrl: "/framwork/global_icon/index/staticImg/3_4.png",
									imgDesc: "传奇红魔鬼",
									name: "(智利)红魔鬼魔尊红葡萄酒",
									tagDesc: "",
									price: 208,
									sold: 507,
									selfRun: false,
								},
								{
									goodsPrice: "",
									id: 133,
									imgUrl: "/framwork/global_icon/index/staticImg/3_5.png",
									imgDesc: "回味甘醇",
									name: "(智利)干露开拓者卡麦妮红葡萄酒 ",
									tagDesc: "",
									price: 138,
									sold: 507,
									selfRun: false,
								}
							]
						}
					];

					var html = template('tmpl-body', result.data);
					options.bodyContainer.innerHTML = html;

					if(result.data.carousels.length > 1) {
						mui('#slider').slider({
							interval: 2000
						});
					}
					
//					//头部滚动栏
					mui('.mui-bar-transparent').transparent({
						top: 0,
						offset: 150,
						duration: 16,
						scrollby: document.querySelector('.mui-scroll-wrapper')
					});
		
					//配置上拉加载
					var deceleration = mui.os.ios ? 0.003 : 0.0009;
					mui('.mui-scroll-wrapper').scroll({
						bounce: false,
						indicators: false, //是否显示滚动条
						deceleration: deceleration
					});

					//var lazyLoad = mui('#refreshContainer').imageLazyload();
					mui(options.bodyContainer).imageLazyload();

					AjaxCommon.pageInit('.mui-bar');

					options.this.couponList(options);

					//初始化倒计时
					tmplCountDownFunc();

				},
				onComplete: function() {

				},
				onError: function() {
					console.log('失败回调');
				}
			};
			AjaxCommon.getAjaxRequestJson(optObjs);
		},

		initcomponents: function(options) {

			options.this.getIndexData(options);

			

		},
		isRealNewCoupon: function(callback) {
			var state = false;
			var optObjs = {
				urlPath: common.config.appPath + "/api/coupon/listCoupon",
				data: {
					pageIndex: 1,
					pageSize: 100,
					sid: AjaxCommon.cookieItem.getCookie('dddjsid')
				},
				onBeforeSend: function() {
					//如果是上拉加载的，就要把相对定位的样式去掉
				},
				onSuccess: function(result) {
					if(result.status == 0) {
						for(var i = 0; i < result.data.content.length; i++) {
							var item = result.data.content[i];
							//新用户优惠券id  临时
							if(item.couponsId === 21) {
								state = true;
							}
						}

						callback(state);
					}
				},
				onError: function() {
					console.log('失败回调');

				}
			};

			AjaxCommon.getAjaxRequestJson(optObjs);

		},
		couponList: function(options) {
			showMainPop = function(popContainer) {
				popContainer.classList.toggle('hide');
				popContainer.classList.toggle('active');
				//同时body 设置 overflow
				if(document.body.style.cssText == "") {
					document.body.style.overflow = "hidden";
				}

				newUserIcon.classList.add('hide');
				//弹出领取页面
			}
			var popContainer = document.getElementById('new-user-container');
			var newUserIcon = document.getElementById('new_user_icon');

			//如果是新用户
			var openNumbers = window.localStorage.getItem('dddj_openNumbers');

			/*新用户领取红包*/
			AjaxCommon.isLogined(
				function() {
					
					//获取用户信息
					options.userItem = AjaxCommon.getLoginUser();

					//设置新用户 调试 
					//options.userItem.isNewOrderUser = true;

					var closeBtn = document.getElementById('popup-close');
					closeBtn.addEventListener('click', function() {
						popContainer.classList.toggle('active');
						popContainer.classList.toggle('hide');
						document.body.style.cssText = "";

						newUserIcon.classList.remove('hide');

					});
					if(options.userItem.isNewOrderUser == true) {
						console.log('新用户');
						//新用户
						options.this.isRealNewCoupon(function(state) {
							//如果为true 就是领取过了，直接显示
							if(state) {
								//新用户  领取过了
								newUserIcon.classList.remove('hide');
							} else {
								//未领取
								showMainPop(popContainer);
								var cmtBtn = popContainer.querySelector('.popup-cmtButton');
								cmtBtn.addEventListener('click', function() {
									window.location.href = "/user/usercoupon.html";
								});
							}

						});

						newUserIcon.addEventListener('click', function(event) {
							window.location.href = "/user/usercoupon.html";
						});

					} else {
						//老用户
						console.log('老用户');
						//注册分享事件

						var share = {
							title: "DD订酒春季活动",
							link: window.location.href.split("#")[0],
							imgUrl: "http://dddingjiu.com/images/1/20160722/1469171133190010721.jpg",
							desc: "新用户获得5元无限制抵用券,快去告诉朋友吧"
							//wechatShare : wechatShare
						}

						var _options = {
							shareData: share
						}
						//微信环境分享
						_wxShareApi.wechatConfig(_options, function() {
							//回调
							_wxShareApi.shareWx(_options, share);
						});
						
						
						if(openNumbers == null) {
							//代表第一次进来,设置条件 第二次就不进来了。
							localStorage.setItem('dddj_openNumbers', true);
							showMainPop(popContainer);
								
							//同时设置点击事件
							var cmtBtn = popContainer.querySelector('.popup-cmtButton');
							var cmtContainer = popContainer.querySelector('.popup-cmt');
							var oldUserContainer = popContainer.querySelector('.old-user-container');
							var oldShareBtn = popContainer.querySelector('.mui-old-share');
							cmtBtn.addEventListener('click', function() {
								//点击事件 。。因为不是
								cmtContainer.classList.add('hide');
								oldUserContainer.classList.remove('hide');
								
								newUserIcon.classList.remove('hide');
								oldShareBtn.addEventListener('click', function() {
									showMainPop(popContainer);
									newUserIcon.classList.remove('hide');
								});
	
								newUserIcon.addEventListener('click', function(event) {
									showMainPop(popContainer);
									newUserIcon.classList.remove('hide');
								});
	
							});
							
						
						} else{
							newUserIcon.classList.remove('hide');
							
							var cmtBtn = popContainer.querySelector('.popup-cmtButton');
							var cmtContainer = popContainer.querySelector('.popup-cmt');
							var oldUserContainer = popContainer.querySelector('.old-user-container');
							var oldShareBtn = popContainer.querySelector('.mui-old-share');
							
							
							cmtContainer.classList.add('hide');
							oldUserContainer.classList.remove('hide');

							

							
							newUserIcon.classList.remove('hide');
							oldShareBtn.addEventListener('click', function() {
								showMainPop(popContainer);
								newUserIcon.classList.remove('hide');
							});

							newUserIcon.addEventListener('click', function(event) {
								showMainPop(popContainer);
								newUserIcon.classList.remove('hide');
							});
						}
						
						options.this.initPageLogoScroll(newUserIcon);

					}
					
					

				},
				function() {
					console.log('没有登录');
					AjaxCommon.switchTarget.unLogined();
				}
			);
		},
		initPageLogoScroll:function(newUserIcon){
			var free_icon = newUserIcon;
			var timer = null; 
			var leave=false; //手指是否离开
			var scrollStop=true;//滚动是否停止
			
			function log(){
			    if(leave==true && scrollStop==true) {
			        if(free_icon){
			            free_icon.classList.add('cbp-menu-open');
			        }
			    }
			};
			document.addEventListener("touchstart",function (event) {
			    leave=false;
			},false);
			
			document.addEventListener("touchmove",function (event) {
			    
			    var now_scroll_top = document.documentElement.scrollTop || document.body.scrollTop;
			    if (now_scroll_top + md_lib.getClientHeight() >= md_lib.getScrollHeight() || now_scroll_top <= 0 ) {
				//如果滚动到顶部或者顶部
			        return false;
			    }
			    if(free_icon){
			        md_lib.removeClass(free_icon,'cbp-menu-open');
			    }
			},false);
			
			document.addEventListener("touchend",function (event) {
			     if(event.touches.length==0||event.touches.length==2){
			        leave=true;
			        log();
			   }
			},false);

			window.onscroll=function(){
			    scrollStop=false;
			    clearTimeout(timer);    
			    timer=setTimeout(function(){
			        scrollStop=true;
			        log();
			    },150);
			}
			


		}

	};
	window.home = model;
})(mui, document);