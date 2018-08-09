+ function(t, e) {
	var n = {
		init: function(n) {
			if(n = this.setOptions(n || {}), "" != n.selfchoose) {
				console.log("选择地址进入");
				var i = JSON.parse(n.selfchoose);
				n.sid = AjaxCommon.cookieItem.getCookie("dddjsid"), n.point = new BMap.Point(i.lng, i.lat), e.body.dataset.lng = i.lng, e.body.dataset.lat = i.lat, n.positionLab.innerHTML = i.title, n.this.pullupRefresh(n)
			} else _wxShareApi.wechatConfig({}, function() {
				n.this.convert(translateCallback)
			}), t.os.wechat || n.this.initMapCompant(n, function(t) {
				translateCallback(t)
			});
			translateCallback = function(i) {
				if(0 == i.status) {
					n.point = i.points[0], e.body.dataset.lng = n.point.lng, e.body.dataset.lat = n.point.lat;
					var o = new BMap.Point(n.point.lng, n.point.lat);
					(new BMap.Geocoder).getLocation(o, function(t) {
						var e = t.addressComponents;
						"" == e.district && "" == e.street ? n.positionLab.innerHTML = e.city : n.positionLab.innerHTML = e.district + e.street, "" == n.positionLab.innerHTML && (n.positionLab.innerHTML = "定位失败");
						var i = {
							urlPath: common.config.currentShopIdUrl,
							data: {
								city: e.city
							},
							onSuccess: function(t) {
								t ? (AjaxCommon.cookieItem.setCookie("dddjsid", t, 1), AjaxCommon.cookieItem.setCookie("dddjsname", e.city, 1), n.sid = t) : (AjaxCommon.cookieItem.setCookie("dddjsid", 1, 1), AjaxCommon.cookieItem.setCookie("dddjsname", "东莞市", 1)), "function" == typeof callback && callback()
							}
						};
						AjaxCommon.getAjaxRequestJson(i)
					}), n.this.pullupRefresh(n)
				} else t.alert("您的地址获取有问题哟!")
			}, t.init()
		},
		setOptions: function(n) {
			return n.this = this, n.data = null, n.selfchoose = void 0 == common.queryToJSON().selfchoose ? "" : common.queryToJSON().selfchoose, n.positionLab = e.querySelector(".lable-position"), n.isStorage = !1, n.bodyContainer = e.getElementById("body-container"), n.pullrefresh = t("#pullrefresh"), n.homePageInitUrl = common.config.appPath + "/api/goods/getHots", n.getDailyUrl = common.config.appPath + "/api/getDailySeckill?sid=", n.guessContainer = e.getElementById("guess-container"), n.getGuessUrl = common.config.appPath + "/api/goods/list", n.shopContainer = e.getElementById("shop-container"), n.locationStoresUrl = common.config.appPath + "/api/indexStores", n.articleContainer = e.getElementById("article-container"), n.getArticlesUrl = common.config.appPath + "/api/article/list", n.sliderContainer = e.getElementById("slider"), n.getSliderUrl = common.config.appPath + "/api/listCarousels", n.activityContainer = e.getElementById("activity-container"), n.groupContainer = e.getElementById("group-container"), n.getListTagsUrl = common.config.appPath + "/api/goods/listTags", n.getIndexDataUrl = common.config.appPath + "/api/indexData", n.bodyContainer = e.getElementById("body-container"), n.popBoxUrl = common.config.appPath + "/api/popBox", n.sid = 1, n.limit = 20, n
		},
		pullupRefresh: function(t) {
			t.this.initcomponents(t)
		},
		initMapCompant: function(t, e) {
			alertOptions.msg = "正在定位中,请稍等...", alertOptions.callback = function(t) {
				(new BMap.Geolocation).getCurrentPosition(function(n) {
					if(this.getStatus() == BMAP_STATUS_SUCCESS) {
						t.setMsg("定位" + n.address.city + "成功"), t.hide();
						var i = {
								status: 0,
								points: []
							},
							o = {
								lng: n.point.lng,
								lat: n.point.lat
							};
						i.points.push(o), "function" == typeof e && e(i)
					} else t.setMsg("定位失败！"), t.hide()
				}, {
					enableHighAccuracy: !0
				})
			}, common.alert(alertOptions)
		},
		convert: function(t) {
			wx.getLocation({
				success: function(e) {
					var n = new BMap.Point(e.longitude, e.latitude),
						i = new BMap.Convertor,
						o = [];
					o.push(n), i.translate(o, 1, 5, t)
				},
				cancel: function(t) {
					common.alert({
						msg: "用户拒绝授权获取地理位置"
					})
				}
			})
		},
		getIndexData: function(e) {
			var n = {
				urlPath: e.getIndexDataUrl,
				data: {
					sid: e.sid,
					distance: 3e3,
					longitude: e.point.lng,
					latitude: e.point.lat,
					pageSize: 3
				},
				isHeader: !1,
				onBeforeSend: function() {},
				onSuccess: function(n) {
					n.data.caractivity = [{
						tip_pic: "",
						layout_style: "1",
						target_type: 0,
						pic_path: "/framwork/_global_icon/lazyload/index/menu1.jpg",
						title: "8090专区",
						title_ext: "8090专区",
						href: "/p/act/activity?type=8090"
					}, {
						tip_pic: "",
						layout_style: "1",
						target_type: 0,
						pic_path: "/framwork/_global_icon/lazyload/index/menu2.jpg",
						title: "特惠专区",
						title_ext: "特惠专区",
						href: "/p/act/view?actId=13"
					}, {
						tip_pic: "",
						layout_style: "1",
						target_type: 0,
						pic_path: "/framwork/_global_icon/lazyload/index/menu3.jpg",
						title: "优惠礼包",
						title_ext: "优惠礼包",
						href: "/p/act/newExclusive"
					}], n.data.tags.reverse();
					var i = template("tmpl-body", n.data);
					e.bodyContainer.innerHTML = i, e.this.checkLastTime(e), e.this.dailySeckill_Hz(e), n.data.carousels.length > 1 && t("#slider").slider({
						interval: 2e3
					})
				},
				onComplete: function() {},
				onError: function() {
					console.log("失败回调")
				}
			};
			AjaxCommon.getAjaxRequestJson(n)
		},
		popup: function(t) {
			common.insertHTML(document.body, "beforebegin", '<a href="/p/act/view?actId=16"><img src="/framwork/activities/1111/indexStore/buoy.png" class="act_icon"/></a>')
		},
		initcomponents: function(n) {
			n.this.getIndexData(n), common.insertHTML(e.querySelector(".mui-content"), "beforebegin", document.getElementById("tmpl-footer").innerHTML);
			var i = document.getElementById("js-footer").outerHTML.trim();
			AjaxCommon.ajaxJavascript(i), t(".mui-bar-transparent").transparent({
				top: 0,
				offset: 150,
				duration: 16,
				scrollby: document.querySelector(".mui-scroll-wrapper")
			});
			var o = t.os.ios ? .003 : 9e-4;
			t(".mui-scroll-wrapper").scroll({
				bounce: !1,
				indicators: !1,
				deceleration: o
			})
			
			
			showMainPop=function(popContainer){
				popContainer.classList.toggle('hide');
				popContainer.classList.toggle('active');
   				//同时body 设置 overflow
   				if(document.body.style.cssText == ""){
   					document.body.style.overflow = "hidden";
   				}
   				
   				newUserIcon.classList.add('hide');
   				//弹出领取页面
			}
			var popContainer = document.getElementById('new-user-container');
		   	var newUserIcon  = document.getElementById('new_user_icon');
		   	
		  
		   	//如果是新用户
		   	var openNumbers  = window.localStorage.getItem('dddj_openNumbers');
			
			/*新用户领取红包*/
			AjaxCommon.isLogined(
				function(){
					console.log('已登录11');
				   	//获取用户信息
				   	n.userItem=AjaxCommon.getLoginUser();
				   
				   	
				   	//设置新用户 调试 
				   	//n.userItem.isNewOrderUser = true;
				    
				  
				   	var closeBtn = document.getElementById('popup-close');
					closeBtn.addEventListener('click',function(){
						popContainer.classList.toggle('active');
						popContainer.classList.toggle('hide');
						document.body.style.cssText ="";
						
						
						newUserIcon.classList.remove('hide');
						
						
					});
				   	if(n.userItem.isNewOrderUser == true){
				   		console.log('新用户');
				   		//新用户
				   		n.this.isRealNewCoupon(function(state){
				   			//如果为true 就是领取过了，直接显示
				   			if(state){
				   				//新用户  领取过了
				   				newUserIcon.classList.remove('hide');
				   			}else{
				   				//未领取
				   				showMainPop(popContainer);
				   				var cmtBtn = popContainer.querySelector('.popup-cmtButton');
				   				cmtBtn.addEventListener('click',function(){
				   					window.location.href="/user/usercoupon.html";
				   				});
				   			}
				   			
				   		});
				   		
				   		newUserIcon.addEventListener('click',function(event){
							window.location.href="/user/usercoupon.html";
						});
				   		
				   	}else{
				   		//老用户
				   		console.log('老用户');
				   		
				   		if(openNumbers == null){
				   			//代表第一次进来,设置条件 第二次就不进来了。
				   			localStorage.setItem('dddj_openNumbers',true);
				   			showMainPop(popContainer);
				   			
				   			//同时设置点击事件
				   			var cmtBtn = popContainer.querySelector('.popup-cmtButton');
				   			var cmtContainer = popContainer.querySelector('.popup-cmt');
				   			var oldUserContainer = popContainer.querySelector('.old-user-container');
				   			var oldShareBtn = popContainer.querySelector('.mui-old-share');
				   			cmtBtn.addEventListener('click',function(){
				   				//点击事件 。。因为不是
				   				cmtContainer.classList.add('hide');
				   				oldUserContainer.classList.remove('hide');
				   				
				   				//注册分享事件
				   				
				   				var share = {
									title : "DD订酒春季活动",
									link: window.location.href.split("#")[0],
						            imgUrl: "http://dddingjiu.com/images/1/20160722/1469171133190010721.jpg",
						            desc: "新用户获得5元无限制抵用券,快去告诉朋友吧"
						            //wechatShare : wechatShare
								}
								
								var _options={
									shareData:share
								}
								//微信环境分享
								_wxShareApi.wechatConfig(_options,function(){
									//回调
									_wxShareApi.shareWx(_options,share);
								});
								
								newUserIcon.classList.remove('hide');
								
								oldShareBtn.addEventListener('click',function(){
									showMainPop(popContainer);
									newUserIcon.classList.remove('hide');
								});
								
								newUserIcon.addEventListener('click',function(event){
									showMainPop(popContainer);
									newUserIcon.classList.remove('hide');
								});
				   				
				   			});
				   			
				   		}else{
				   			//不在弹出
				   			newUserIcon.classList.remove('hide');
				   			
				   			n.this.isRealNewCoupon(function(state){
					   			//如果为true 就是领取过了，直接显示
					   			if(state){
					   				//新用户  领取过了
					   				newUserIcon.addEventListener('click',function(event){
										window.location.href="/user/coupon.html";
									});
					   			}
					   		});
				   			
				   		}
				   		
				   	}
				   		
			   		
				   		
				   
				   	
				   
					document.body.addEventListener('touchstart',function(e){
						console.log("滚动开始");
						if(popContainer.classList.contains('hide')){
							setTimeout(function(){
								newUserIcon.classList.toggle('cbp-menu-open');
							},300)
						}
						
						
					});
					
					
	
					var timer = null;
					var beforeScrollTop = 0;
					document.addEventListener('scroll',function(event){
						event = event || window.event;
						var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
				        beforeScrollTop = scrollTop;
						timer = setInterval(function(){
							//500毫秒 查询当前状态
							if(beforeScrollTop == scrollTop){
								//滚动结束
								//console.log('滚动结束')
								if(!newUserIcon.classList.contains('cbp-menu-open')){
									newUserIcon.classList.toggle('cbp-menu-open');
								}
								clearInterval(timer);
							}
						},500);
					});
				   	
				   
				
			
				   	
				   	
				   	
				},
				function(){
					console.log('没有登录');
					AjaxCommon.switchTarget.unLogined();
				}
			);
			
			
			
		},
		isRealNewCoupon:function(callback){
			var state = false;
			var optObjs={
				urlPath:common.config.appPath+"/api/coupon/listCoupons",
				data:{
					pageIndex : 1,
					pageSize : 100,
					sid:AjaxCommon.cookieItem.getCookie('dddjsid')
				},
				onBeforeSend: function() {
					//如果是上拉加载的，就要把相对定位的样式去掉
				},
				onSuccess:function(result){
					if(result.status == 0){
						for (var i = 0; i < result.data.content.length; i++) {
							var item = result.data.content[i];
							//新用户优惠券id  临时
							if(item.id ===  21){
							 	state = true;
							}
						}
						
						callback(state);
					}
				},
				onError:function(){
					console.log('失败回调');
					
				}
			};
			
			
			AjaxCommon.getAjaxRequestJson(optObjs);
			
			
			
		},
		getPopBox: function(t) {
			var e = {
				urlPath: t.popBoxUrl,
				data: {
					sid: t.sid
				},
				isHeader: !1,
				onSuccess: function(t) {
					if(t.data.length > 0) {
						for(var e = [], n = 0; n < t.data.length; n++) {
							var i = new Date(t.data[n].startTime.replace(/-/g, "/")),
								o = new Date(t.data[n].endTime.replace(/-/g, "/"));
							i.getTime() < (new Date).getTime() && (new Date).getTime() < o.getTime() && e.push({
								imgUrl: t.data[n].imgUrl,
								href: t.data[n].url
							})
						}
						muiPopupAdd.init(e)
					}
				},
				onError: function() {
					console.log("失败回调")
				}
			};
			AjaxCommon.getAjaxRequestJson(e)
		},
		checkLastTime: function(t) {
			var n = e.getElementById("timeLimits");
			null != n && "" != n.dataset.starttime && t.this.timestamp(t, n)
		},
		shutdown: function(t, e) {
			var n = setInterval(function() {
				var i = t - (new Date).getTime();
				if(i <= 1e3) return void clearInterval(n);
				var o = parseInt(i / 1e3 / 60 / 60 / 24, 10),
					a = parseInt(i / 1e3 / 60 / 60 % 24, 10),
					s = parseInt(i / 1e3 / 60 % 60, 10),
					r = parseInt(i / 1e3 % 60, 10),
					l = {
						d: o < 10 ? "0" + o : o,
						h: a < 10 ? "0" + a : a,
						m: s < 10 ? "0" + s : s,
						s: r < 10 ? "0" + r : r
					},
					l = [l.d, l.h, l.m, l.s];
				"function" == typeof e && e(l)
			}, 1e3)
		},
		timestamp: function(t, e) {
			var n = e,
				i = n.querySelector(".time-status"),
				o = n.querySelectorAll("i.tm"),
				a = n.dataset.starttime,
				s = n.dataset.endtime,
				r = new Date(a.replace(/-/g, "/")),
				l = new Date(s.replace(/-/g, "/")),
				c = (new Date).getTime();
			r.getTime() > c ? (console.log("还没开始"), t.this.shutdown(r.getTime(), function(t) {
				for(var e = 0; e < o.length; e++) {
					o[e].innerHTML = t[e]
				}
			})) : c > r.getTime() && c < l.getTime() ? (console.log("活动进行中"), i.innerText = "距结束还剩：", t.this.shutdown(l.getTime(), function(t) {
				for(var e = 0; e < o.length; e++) {
					o[e].innerHTML = t[e]
				}
			})) : c > l.getTime() && (console.log("已结束"), i.parentNode.innerHTML = "本场秒杀已结束")
		},
		dailySeckill_Hz: function(t) {
			t.dailyContainer = e.getElementById("daily-container");
			var n = {
				urlPath: t.getDailyUrl + t.sid,
				data: {},
				isHeader: !1,
				onSuccess: function(e) {
					if(0 == e.status)
						if("function" == typeof template)
							if(0 == e.status && null != e.data) {
								e.data.items.length > 1 && e.data.items.reverse();
								var n = template("tmpl-daily", e);
								t.dailyContainer.innerHTML = n;
								var i = t.dailyContainer.querySelector(".time-container");
								t.this.timestamp_Hz(t, i)
							} else console.log("限时秒杀没有数据"), t.dailyContainer.classList.add("mui-hide");
					else common.alert({
						msg: "模板js文件未引用"
					});
					else t.dailyContainer.classList.add("mui-hide")
				},
				onError: function() {
					console.log("失败回调")
				}
			};
			AjaxCommon.getAjaxRequestJson(n)
		},
		showtimerresult_Hz: function(t, e, n, i) {
			var o = e.querySelector(".daily-time-container"),
				a = o.querySelectorAll("i");
			n.this.shutdown_Hz(n, t, function(t) {
				for(var e = t.split(""), n = 0; n < a.length; n++) {
					a[n].innerHTML = e[n]
				}
			}, i)
		},
		shutdown_Hz: function(t, e, n, i) {
			var o = setInterval(function() {
				var i = e - (new Date).getTime();
				if(i <= 100) {
					clearInterval(o);
					var a = t.dailyContainer.querySelector(".time-container");
					return void t.this.timestamp_Hz(t, a)
				}
				var s = parseInt(i / 1e3 / 60 / 60 % 24, 10),
					r = parseInt(i / 1e3 / 60 % 60, 10),
					l = parseInt(i / 1e3 % 60, 10),
					c = parseInt(i % 1e3 / 10),
					d = {
						h: s < 10 ? "0" + s : s,
						m: r < 10 ? "0" + r : r,
						s: l < 10 ? "0" + l : l,
						ms: c < 10 ? "0" + c : c
					},
					m = "" + d.h + d.m + d.s + d.ms;
				"function" == typeof n && n(m)
			}, 24)
		},
		timestamp_Hz: function(t, e, n) {
			var i = e,
				o = i.querySelector(".time-status");
			setTimeout(function() {
				var e = i.dataset.starttime,
					a = i.dataset.endtime,
					s = e.split(":"),
					r = a.split(":"),
					l = new Date,
					c = new Date;
				void 0 != s[0] && l.setHours(s[0]), void 0 != s[1] && l.setMinutes(s[1]), void 0 != s[2] && l.setSeconds(s[2]), void 0 != r[0] && c.setHours(r[0]), void 0 != r[1] && c.setMinutes(r[1]), void 0 != r[2] && c.setSeconds(r[2]);
				var d = (new Date).getTime();
				if(l.getTime() > d) console.log("hz还没开始"), o.innerText = "【" + e.substr(0, e.lastIndexOf(":")) + "-" + a.substr(0, a.lastIndexOf(":")) + "】场秒杀活动开始还有", t.this.showtimerresult_Hz(l.getTime(), i, t, n);
				else if(d > l.getTime() && d < c.getTime()) console.log("hz活动进行中"), o.innerText = "【" + e.substr(0, e.lastIndexOf(":")) + "-" + a.substr(0, a.lastIndexOf(":")) + "】场秒杀活动结束还有", t.this.showtimerresult_Hz(c.getTime(), i, t, n);
				else if(d > c.getTime()) {
					var m = i.querySelector(".daily-time-container");
					m.classList.add("mui-hide"), o.innerText = "本场秒杀已结束，敬请期待下一场"
				}
			}, 1e3)
		}
	};
	window.home = n
}(mui, document);