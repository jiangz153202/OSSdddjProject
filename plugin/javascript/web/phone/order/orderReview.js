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
			//options.this.initcomponents(options);
		},
		setOptions: function(options) {
			options.this = this;
			options.listContainer = doc.getElementById('list-container');
			
			
			options.orderNumber = common.queryToJSON().orderNumber == undefined ? "" : common.queryToJSON().orderNumber;
			options.uploadsImagesUrl = common.config.appPath + "/api/order/detail";
			options.orderReviewUrl = common.config.appPath + "/api/order/review";
			
			options.payUrl =common.config.rootPath+'/pay/index.html';
			return options;
		},
		initPage: function(options) {
			//console.log(data);
			//初始化获取当页参数
			var optObjs = {
				urlPath: options.uploadsImagesUrl,
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
						
						options.this.initcomponents(options);
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
				}
			};
			AjaxCommon.getAjaxRequestJson(optObjs);
		},
		createPlaceHolder:function(options){
			var placeholder = document.createElement('div');
			placeholder.setAttribute('class', 'image-item space');
			placeholder.setAttribute('id','choose-btn');
			var closeButton = document.createElement('div');
			closeButton.setAttribute('class', 'image-close');
			closeButton.innerHTML = 'X';
			closeButton.addEventListener('click', function(event) {
				event.stopPropagation();
				event.cancelBubble = true;
				setTimeout(function() {
					options.imageList.removeChild(placeholder);
					if(options.imageList.children.length == 0){
						options.this.createPlaceHolder(options);
					}
				}, 0);
				return false;
			}, false);
			placeholder.appendChild(closeButton);
			
			options.imageList.appendChild(placeholder);
			placeholder.addEventListener('tap',function(){
				options.this.loadWx(options);
			});
			
			doc.getElementById('upload-btn').classList.add('mui-hide');
		},
		loadWx:function(options){
			
			doc.getElementById('choose-btn').addEventListener('tap',function(){
				wx.chooseImage({
				    count: 3, // 默认9
				    sizeType: ['original', 'compressed'],//  可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				    success: function (res) {
				    	console.log(res);
				        var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
				        options.localArray.data=res.localIds;
				        var imageContainers= doc.getElementById('image-list');
				        var html = template('tmpl-images',options.localArray);
				        imageContainers.innerHTML=html;
				        mui.each(imageContainers.querySelectorAll('.image-close'),function(index,ele){
				        	ele.addEventListener('tap',function(event){
				        		var placeholder=this.parentNode;
				        		event.stopPropagation();
								event.cancelBubble = true;
								setTimeout(function() {
									options.imageList.removeChild(placeholder);
									if(options.imageList.children.length == 0){
										options.this.createPlaceHolder(options);
									}
								}, 0);
								return false;
				        	});
				        });
				        doc.getElementById('upload-btn').classList.remove('mui-hide');
				    }
				});
			});
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
			
			//初始化评分
			options.this.stars();
			options.images=[];
			options.localArray={data:[]};
		
			//初始化图片上传
			if(mui != null && mui.os.wechat != undefined){
				options.imageList=doc.getElementById('image-list');
				//创建
				options.this.createPlaceHolder(options);
				
				//配置加载图片
				_wxShareApi.wechatConfig(options,function(options){
					
					options.this.loadWx(options);
					
					doc.getElementById('upload-btn').addEventListener('tap',function(){
						
						var i = 0, length = options.localArray.data.length;
        			    function upload() {
        			      wx.uploadImage({
        			        localId: options.localArray.data[i],
        			        isShowProgressTips: 1, // 默认为1，显示进度提示
        			        success: function (res) {
        			          	i++;
        			          	//alert('已上传：' + i + '/' + length);
        			          	options.images.push({'imgUrl':res.serverId});// 返回图片的服务器端ID
        			            if (i < length) {
        			            	upload();
        			            }else{
                  			    	doc.getElementById('upload-btn').classList.add('mui-hide');
        			            }
        			        },
        			        fail: function (res) {
        			          alert(JSON.stringify(res));
        			        }
        			      });
        			    }
        			    upload();
					});
				});
				
				options.reviewSubmit = doc.getElementById('review-submit');
				if(options.reviewSubmit != null){
					options.reviewSubmit.addEventListener('tap',function(){
						//开始提交
						var data= options.this.checkData(options);
						data && options.this.postUpload(options,data);
					})
				}
				
			}else{
				//alert('非微信环境');
				options.this.uploads();
				options.reviewSubmit = doc.getElementById('review-submit');
					if(options.reviewSubmit != null){
						options.reviewSubmit.addEventListener('tap',function(){
							//拿到所有的file
							var files = doc.getElementsByName('logo');
							var fileArray=[];
							for (var i = 0; i < files.length; i++) {
								if(files[i].files[0] != undefined){
									fileArray.push(files[i].files[0])
								}
							}
							
							if(fileArray.length > 0){
								var i=0,length =fileArray.length;
								function upload(){
									alertOptions.msg = '正在上传'+(i+1)+'张';
						            alertOptions.callback = function (alertContext) {
						            	AjaxCommon.uploadFile(fileArray[i],function(result){
						            		if(result.status == 0){
						            			alertContext.setMsg('上传第'+(i+1)+'张成功');
					   				    		alertContext.hide();
					   				    		
					   				    		i++;
					   				    		
					   				    		options.images.push({'imgUrl':result.data});
					   				    		console.log(JSON.stringify(options.images));
					   				    		setTimeout(function(){
							            			if(i < length){
							            				upload();
							            			}else{
							            				//开始提交
						            					var data= options.this.checkData(options);
						            					data && options.this.postUpload(options,data);
							            				
							            			}
						            			},2000);
						            		}else{
						            			alertContext.setMsg('上传第'+(i+1)+'张失败,跳过');
					   				    		alertContext.hide();
					   				    		i++;
					   				    		if(i < length){
						            				upload();
						            			}
						            		}
						            	});	
						            };
						            common.alert(alertOptions);
								}
								upload();
							}else{
								//开始提交
		        				var data= options.this.checkData(options);
		        				data && options.this.postUpload(options,data);
							}
							
							
						});
					}
				
				
			}
			
			
			

			
			
			
		},
		stars:function(){
			
			function getChildrenIndex(ele){ 
				//IE is simplest and fastest 
				if(ele.sourceIndex){ 
					return ele.sourceIndex - ele.parentNode.sourceIndex - 1; 
				} 
				//other browsers 
				var i=0; 
				while(ele = ele.previousElementSibling){ 
					i++;
				} 
				return i; 
			}
			
			var starList=doc.querySelectorAll('.star-list');
			if(starList.length > 0){
				for (var i = 0; i < starList.length; i++) {
					var StarItem=starList[i];
					
					mui(StarItem).on('tap','.comment-ico',function(){
						
						//当前是第几个
						var $this=this;
						var indexVal=getChildrenIndex($this)+1;
						var list=$this.parentNode.children;
						mui(list).each(function(){
							this.classList.remove('comment-ico-active');
						});
						
						for(var o = 0; o < indexVal; o++) {
							list[o].classList.add('comment-ico-active');
						};
						
						//赋值
						var $input=doc.getElementById($this.parentNode.dataset.id);
						if($input){
							//赋值
							$input.setAttribute('value',indexVal);
							
						}else{
							var form=doc.getElementsByTagName('form')[0];
							var inputDoc=document.createElement('input');
							inputDoc.setAttribute('type','hidden');
							inputDoc.setAttribute('id',StarItem.dataset.id);
							inputDoc.setAttribute('name','logo');
							inputDoc.setAttribute('value',indexVal);
							form.appendChild(inputDoc);
						}
						console.log($input.id+"的input的值为"+$input.value);
					});
					
				}
			}
		},
		uploads:function(){
			//初始化获取当页参数
			var head = document.getElementsByTagName("head");
			var oScript = document.createElement("script");
	        oScript.src = "/plugin/javascript/web/phone/uploads/feedback-page.js";
	        oScript.type = "text/javascript";
			head[0].appendChild(oScript);
			oScript.onload=oScript.onreadystatechange=function(){  
			    if(!this.readyState||this.readyState=='loaded'||this.readyState=='complete'){  
			   		console.log(oScript.src+'加载完成');
				}  
				oScript.onload=oScript.onreadystatechange=null;
			} 
		},
		checkData:function(options){
			var data={
				orderNumber:options.orderNumber,
				content:doc.getElementById('textarea-content').value,
				images:JSON.stringify(options.images),
				score:doc.getElementById('input-goods').value
			}
			
			if(mui.os.wechat != undefined){
				//检测
				var items= doc.querySelectorAll('.image-item');
				if(items.length != options.images.length){
					common.alert({
					 	msg:'请上传图片至服务器在提交!'
					});
				}
			}
			
			return data;
		},
		postUpload:function(options,data){
			//alert(JSON.stringify(data));
			alertOptions.msg = '提交评论中...';
            alertOptions.callback = function (alertContext) {
            	var optObjs = {
					urlPath: options.orderReviewUrl,
					data:data,
					onSuccess: function(result) {
						if(result.status == 0) {
							//删除当前元素，1.拿到当前页面的
							alertContext.setMsg('提交成功！');
           				    alertContext.hide();
           				    
           				    setTimeout(function(){
           				    	window.location.href=common.config.homeUrl;
           				    },300);
						} else {
							alertContext.setMsg('提交失败！');
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
	window.orderReview = model;
})(mui, document);