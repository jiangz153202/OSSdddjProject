;+(function(mui,doc,window){
	var map = new BMap.Map('template-maps');
	var model={
		init:function(options){
			options = this.setOptions(options || {});
			
			common.insertHTML(options.content,'afterbegin',options.tmplLoading);
			map.centerAndZoom(new BMap.Point(116.404, 39.915), options.zoomGroup);
			//初始化地图
			this.initGeoMap(options);
			
		},
		setOptions:function(options){
			options.this=this;
			options.getPois=common.config.appPath+'/api/getPois';
			options.locationStoresUrl=common.config.appPath+'/api/locationStores';
			
			options.content=doc.querySelector('.mui-content');
			options.listContainer=doc.getElementById('list-container');
			
			options.tmplLoading=doc.getElementById('tmpl-model-loading').innerHTML;
			options.tmplEmpty  =doc.getElementById('tmpl-model-null').innerHTML;
			options.tmplModel  =doc.getElementById('tmpl-model');
			
			options.templateMaps=doc.getElementById('template-maps');  //百度地图
			
			options.templateInput=doc.getElementById('template-input');
			options.templateMarker=doc.getElementById('template-marker');
			options.templateMenus=doc.getElementById('template-menus'); //左下菜单栏
			options.templateStore=doc.getElementById('template-store'); //门店列表
			options.templateSearch=doc.getElementById('template-search'); //左下菜单栏
			
			
			options.defaultStoreImgUrl="/framwork/global_icon/lazyload/mapUser.png";
			options.selfImgUrl="/framwork/global_icon/lazyload/baidumap.png";
			options.point =null;
			options.zoomGroup  = 14;
			options.poiWidth=30000;
			options.mapDistance=5000;
			return options;
		},
		initGeoMap:function(options){
			options.this.initGeolocation(options,function(){
				
				options.templateMaps.style.height=(window.innerHeight) +"px";
				
				options.this._execAds(options);
				options.this.initMap(options);
				options.this.initPage(options);
			});
		},
		initPage:function(options){
			options.templateInput.addEventListener('keypress',function(e){
				if(e.keyCode === 13) {
					// 处理相关逻辑 回车
				 	if(options.templateInput.value == '')
		    			return false;
		    		options.this._execPot(options);
				}
			});
			options.templateSearch.addEventListener('tap',function(e){
				
				// 处理相关逻辑 回车
			 	if(options.templateInput.value == '')
	    			return false;
	    		options.this._execPot(options);
				
			});
			
			options.templateMenus.addEventListener('tap',function(e){
				setTimeout(function(){
					options.listContainer.innerHTML='';
					map.clearOverlays();
					
					options.this.initGeoMap(options);
					
				},300);
			});
		},
		//初始化地图位置
		initGeolocation:function(options,onCallback){
			//1.0.0 获取当前位置
			var geolocation = new BMap.Geolocation();
			geolocation.getCurrentPosition(function(r){
				if(this.getStatus() == BMAP_STATUS_SUCCESS){
					//1.0.1 确认当前位置
					options.point=r.point;
					//1.0.2 开始转化地理位置
					
					typeof onCallback === 'function' && onCallback();
					
				}else {
					common.alert({
						msg:"地理位置获取失败",
						onHidden:function(){
							map.centerAndZoom(new BMap.Point(116.404, 39.915), options.zoomGroup);
						}
					});
					
					//yuki.msg('failed'+this.getStatus());
				}        
			},{enableHighAccuracy: true});
		},
		initMap:function(options){
			
			
			//alert('maps的'+options.templateMaps.style.height);
			//清除options.list
			options.listContainer.innerHTML='';
			
			//设置中心点
			map.centerAndZoom(options.point, options.zoomGroup);
			console.log('当前位置'+JSON.stringify(options.point));
			//获取自己的位置
			var _selfMarker = options._selfMarker =options.this._createMarker(options.point,options.selfImgUrl,options);
			
			map.addOverlay(_selfMarker); //把自己添加到地图中
			
			setTimeout(function(){
				map.centerAndZoom(options.point, 16); 
				map.panTo(options.point);   //4秒后移动到当前地点
				/*map.addEventListener('dragstart',function(){
					options.this._hidehalo(options);
				});*/
				map.addEventListener('dragend', function(){    //移动结束后定位
		            _selfMarker.setPosition(map.getCenter());
		            
		            options.point=_selfMarker.getPosition();
		            //console.log('更新后的'+JSON.stringify(options.point));
		            //限制器
					function debounce(method, context) {
						clearTimeout(method.tId);
						method.tId = setTimeout(function() {
						    method.call(context);
						}, 1000);
					}
					function print() {
						//加载附近的
						//console.log('加载附近');
						options.this._execAds(options);
						options.this._searchPanl(options);
					}
					debounce(print);
		            
		        });
		        options.this._execAds(options);
				options.this._searchPanl(options);
				
			},4000);
			
			options.this._showhalo(options);
			
			//隐藏加载状态
			doc.querySelector('.spinner-child').classList.add('mui-hide');	
			
			//监听
			map.addEventListener('touchstart',function(){
				options.templateInput.blur();
			});
		},
		_createMarker:function(baiduPoint,_autoImgUrl,options){
			var _selfMarker = new BMap.Marker(baiduPoint,{
				icon: new BMap.Icon(_autoImgUrl || options.selfUserIconUrl, new BMap.Size(28,35))
			});
			options.this._createSelfLabel(options,_selfMarker);
			
			return _selfMarker;
		},
		_createSelfLabel:function(options,_selfMarker){
			//创建自己正在加载中
			var content = 
				'<div class="self-label">'+
					'<span class="self-label-loadding ball-pulse">'+
					 	'<i></i>'+
					 	'<i></i>'+
					 	'<i></i>'+
					'</span> '+
					'<span>'+
					 	'正在定位中'+
					'</span>'+
				'</div>';
				
			var baidulabel=new BMap.Label(content,{
				offset   : new BMap.Size(-47,-49)    //设置文本偏移量
			});
			baidulabel.setStyle({
				backgroundColor :"0.05",
				border :"0"
			})
			_selfMarker.setLabel(baidulabel);
			
		},
		_setSelfMarkerOptions:function(options,result){
			//设置自己当前是否定位成功
			var data='<i>暂无数据</i>';
			var _x= -52;
			if(result.data != null && result.data.content.length > 0){
				var firstPointData=result.data.content[0];
				var firstStoreLngLatPoint=new BMap.Point(firstPointData.longitude,firstPointData.latitude);
				
				var distance= map.getDistance(firstStoreLngLatPoint,options.point).toFixed(2);
				
				var countDistance = distance - 1000;
				var rd = countDistance / 1000;
				var vals = 9;
				if(rd > 0){
					vals = 9 + Math.round(rd * 8);
				}
				
				data='<i>'+vals+'</i><i>分钟</i>'
				 _x= -43;
			}
			
			var content = 
				'<div class="self-label">'+
					'<span class="self-label-loadding default-abs-color">'+
					 	data+
					'</span> '+
					'<span>'+
					 	'您的位置'+
					'</span>'+
				'</div>';
				
			var baidulabel=new BMap.Label(content,{
				offset   : new BMap.Size(_x,-49)    //设置文本偏移量
			});
			baidulabel.setStyle({
				backgroundColor :"0.05",
				border :"0"
			})
			options._selfMarker.setLabel(baidulabel);
			
			
		},
		_createStoreLabel:function(options,Marker,data){
			//创建商家的地址
			
			var content = 
				'<div class="self-label">'+
					'<span class="self-label-loadding default-abs-color">'+
					 	'<i>DD商家</i>'+
					'</span> '+
					'<span>'+
					data.name.substr(0,5)+'...'+
					'</span>'+
				'</div>';
				
			var baidulabel=new BMap.Label(content,{
				offset   : new BMap.Size(-47,-49)    //设置文本偏移量
			});
			baidulabel.setStyle({
				backgroundColor :"0.05",
				border :"0"
			})
			Marker.setLabel(baidulabel);
			
		},
		createStoreMaps:function(options,result){
			
			options.storeMarkerLists=[]
			for (var i = 0; i < result.data.content.length; i++) {
				var point=new BMap.Point(result.data.content[i].longitude,result.data.content[i].latitude);
				var vectorMarker = options.this._createMarker(point,options.defaultStoreImgUrl,options);
				options.this._createStoreLabel(options,vectorMarker,result.data.content[i]);
				
				map.addOverlay(vectorMarker); // 将标注添加到地图中
				
				options.storeMarkerLists.push(vectorMarker);
			}
			//绑定点击事件
			mui.each(options.storeMarkerLists,function(index,item){
				
				item.addEventListener('click',function(){
					mui('#slider').slider().gotoItem(index);
				});
				
				var itemLabel=item.getLabel();
				itemLabel.addEventListener('click',function(){
					mui('#slider').slider().gotoItem(index);
				});
			});
			
		},
		_showhalo:function(options){
			options.templateMarker.classList.remove('mui-hide');
		},
		_hidehalo:function(options){
			options.templateMarker.classList.add('mui-hide');
		},
		/*地址类方法*/
		_execAds:function(options){
			
			options.templateInput.placeholder='正在定位中...';
			
			var geoc = new BMap.Geocoder(); 
			geoc.getLocation(options.point,function(rs){
				var addComp = rs.addressComponents;
				//alert(JSON.stringify(addComp));
				options.templateInput.placeholder=addComp.city+addComp.district+addComp.street;
				//options.searchText.innerHTML= addComp.district + " " + addComp.street + " " + addComp.streetNumber;
			});
		},
		_execPot:function(options){
			options.templateInput.blur();
			
			var geoc = new BMap.Geocoder(); 
			geoc.getPoint(options.templateInput.value,function(point){
				if(point){
					options.point=point;
					//移除所有的点
					map.clearOverlays();
					options.templateInput.value="";
					options.templateInput.blur();
					
					options.this.initMap(options);
				}else{
					common.alert({
						msg:'你输入的位置百度找不到!'
					})
				};
				
			},AjaxCommon.cookieItem.getCookie('dddjsname'));
			
			
		},
		_searchPanl:function(options){
			options.templateInput.blur();
			//console.log('开始检索附近的');
	      	var data=null;
			var optObjs={
				urlPath:options.locationStoresUrl,
				data:{
					distance:options.mapDistance,
					sid: 1,
					longitude:options.point.lng,
					latitude:options.point.lat,
					status:1
				},
				isHeader:false,
				onBeforeSend:function(){
					options.this._showhalo(options);
					options.listContainer.innerHTML="";
					
					map.removeOverlay(options._selfMarker.getLabel());
					options.this._createSelfLabel(options,options._selfMarker);
					
				},
				onSuccess:function(result){
					
					if(result.data != null && result.data.content.length > 0){
						var list=[];
						for (var i = 0; i < result.data.content.length; i++) {
							var content = result.data.content[i];
							if(content.status != 0){
								list.push(content);
							}
						}
						result.data.content=list;
						data=result;
					}
					
				
					if(result.status == 0 && result.data != null && result.data.content.length > 0){
						
						
						
						var html = template('tmpl-model', result.data);
						options.listContainer.innerHTML = html;
						
						mui(options.listContainer).on('tap','.mui-media-object',function(){
							var $thisHref=this.dataset.href;
							setTimeout(function(){
								window.location.href= $thisHref;
							},300);
						});
						
						options.this.createStoreMaps(options,result);
						mui('.mui-slider').slider();
						
					}else{
						options.listContainer.innerHTML = doc.getElementById('tmpl-model-null').innerHTML;
						for (var i = 0; i < options.storeMarkerLists.length; i++) {
							map.removeOverlay(options.storeMarkerLists[i]);
						}
					}
				},
				onComplete:function(){
					//console.log('加载完成');
					setTimeout(function(){
						options.this._hidehalo(options);
						map.removeOverlay(options._selfMarker.getLabel());
						if(data != null){
							options.this._setSelfMarkerOptions(options,data);
						}
						//var baiduLabel=options._selfMarker.getLabel();
						//options._selfMarker.removeLa;
					},2400);
				},
				onError:function(){
					console.log('失败回调');
				}
			};
			AjaxCommon.getAjaxRequestJson(optObjs);
			
		}
		
	};
	window._storemap=model;
	
}(mui,document,window));	
