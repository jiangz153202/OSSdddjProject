+function(e,t){var n={init:function(e){e=this.setOptions(e||{}),this.initPage(e)},setOptions:function(n){return n.this=this,n.listContainer=t.getElementById("list-container"),n.getModelUrl=common.config.appPath+"/api/coupon/listCoupons",n.setObtainUrl=common.config.appPath+"/api/coupon/obtain",n.pullrefresh=e("#pullrefresh"),n},initPage:function(t){e.init({pullRefresh:{container:"#pullrefresh",up:{contentrefresh:"正在加载...",contentnomore:"",callback:function(){t.this.pullupRefresh(t)}}}}),document.body.setAttribute("data-pageIndex",0),e.os.plus?e.plusReady(function(){setTimeout(function(){t.pullrefresh.pullRefresh().pullupLoading()},1e3)}):e.ready(function(){t.pullrefresh.pullRefresh().pullupLoading()})},pullupRefresh:function(e){var n=t.body.getAttribute("data-pageIndex");n=parseInt(n)+1,t.body.setAttribute("data-pageIndex",n);var o={urlPath:e.getModelUrl,data:{pageIndex:n,sid:AjaxCommon.cookieItem.getCookie("dddjsid")},onBeforeSend:function(){},onSuccess:function(t){if(0==t.status&&null!=t.data&&t.data.content.length>0){var n=template("tmpl-model",t.data);e.listContainer.innerHTML+=n,e.this.initObtains(e),e.pullrefresh.pullRefresh().endPullupToRefresh(!t.data.hasNextPage)}else e.pullrefresh.pullRefresh().endPullupToRefresh(!0),""==e.listContainer.innerHTML.trim()&&(e.listContainer.innerHTML=document.getElementById("tmpl-model-null").innerHTML)},onError:function(){console.log("失败回调"),e.pullrefresh.pullRefresh().endPullupToRefresh(!0),""==e.listContainer.innerHTML.trim()&&(e.listContainer.innerHTML=document.getElementById("tmpl-model-null").innerHTML)}};AjaxCommon.getAjaxRequestJson(o)},initObtains:function(t){e(t.listContainer).off("tap",".mui-save-coupon"),e(t.listContainer).on("tap",".mui-save-coupon",function(){this.classList.contains("mui-disabled")?common.alert({msg:"已经领取过了!"}):t.this.getCouponObtain(t,this)})},getCouponObtain:function(e,t){var n=t.dataset.couponid;alertOptions.msg="正在请求中...",alertOptions.callback=function(o){var i={urlPath:e.setObtainUrl,data:{couponsId:n},onSuccess:function(e){0==e.status&&1==e.data?(o.setMsg("领取成功!"),o.hide(),t.classList.add("mui-disabled"),t.classList.add("mui-btn-grey"),t.classList.remove("mui-btn-default"),t.innerHTML="已经领取"):(o.setMsg("领取失败,请重试!"),o.hide())},onError:function(){console.log("失败回调"),o.setMsg("领取失败,请重试!"),o.hide()},onComplete:function(){}};AjaxCommon.getAjaxRequestJson(i)},common.alert(alertOptions)}};window.coupons=n}(mui,document);