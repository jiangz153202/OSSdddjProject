+function(t,i){var e={init:function(t){t=this.setOptions(t||{}),this.initPage(t)},setOptions:function(e){return e.this=this,e.listContainer=i.getElementById("list-container"),e.getArticleUrl=common.config.appPath+"/api/article/detail",e.aid=void 0==common.queryToJSON().aid?"":common.queryToJSON().aid,e.pullrefresh=t("#pullrefresh"),e},initPage:function(i){t.init();var e={title:"粽意醉好-迎端午,DD订酒酒水钜惠",link:window.location.href.split("#")[0],imgUrl:"http://dddingjiu.com/images/1/20160722/1469171133190010721.jpg",desc:"活动期间,原价418元/瓶的马爹利名仕 700ML,现价仅需398元,还有精选秒杀红酒等你来抢！ "},a={shareData:e};_wxShareApi.wechatConfig(a,function(){_wxShareApi.shareWx(a,e)}),i.resultData={data:[]};for(var n=1;n<10;n++){var o="/framwork/activities/act170529/端午活动页_0"+n+".png",r="";switch(n){case 3:r="/p/goods/view/50";break;case 4:r="/p/goods/view/262";break;case 5:r="/p/goods/view/5";break;case 7:r="/p/goods/view/35";break;case 8:r="/p/goods/view/12"}i.resultData.data.push({imgUrl:o,href:r})}console.log(JSON.stringify(i.resultData.data)),i.resultData.data.push({imgUrl:"/framwork/activities/act170529/端午活动页_10.png",href:""});var s=template("tmpl-model",i.resultData);i.listContainer.innerHTML=s,t(i.listContainer).imageLazyload()},articleDetail:function(i){var e={urlPath:i.getArticleUrl,data:{id:i.aid,sid:AjaxCommon.cookieItem.getCookie("dddjsid")},onBeforeSend:function(){},onSuccess:function(e){if(0==e.status){e.data.content=htmlContent;var a=template("tmpl-model",e.data);i.listContainer.innerHTML+=a,t(i.listContainer).imageLazyload();var n={};if(void 0!=t.os.wechat){var n={title:"名品折扣日-519马爹利名仕钜惠",link:window.location.href.split("#")[0],imgUrl:"http://dddingjiu.com/images/1/20160722/1469171133190010721.jpg",desc:"活动期间,原价418元/瓶的马爹利名仕 700ML,现价仅需398元 "},o={shareData:n},o={shareData:n};_wxShareApi.wechatConfig(o,function(){_wxShareApi.shareWx(o,n)})}}else if(""==i.listContainer.innerHTML.trim()){i.listContainer.innerHTML=document.getElementById("tmpl-model-null").innerHTML;var a='<div class="weui-toptips weui-toptips_warn js_tooltips">文章不存在</div>';i.listContainer.parentNode.innerHTML+=a}},onError:function(){console.log("失败回调"),""==i.listContainer.innerHTML.trim()&&(i.listContainer.innerHTML=document.getElementById("tmpl-model-null").innerHTML)}};AjaxCommon.getAjaxRequestJson(e)}};window.act=e}(mui,document);