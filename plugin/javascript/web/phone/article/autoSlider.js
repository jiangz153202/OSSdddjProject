+function(t,e,n){"use strict";var i={init:function(e){e=this.setOptions(e||{}),t.init(),this.initGetTagsUrl(e)},setOptions:function(t){return t.this=this,t.scale=.56,t.gettagsUrl=common.config.rootPath+"/api/goods/gettags",t.getgroupgoodsUrl=common.config.rootPath+"/api/goods/gettaggoods",t.bodyContainer=e.getElementById("pull-body"),t.tmplHtmlModelEmpty=e.getElementById("tmpl-model-null"),t.addCartUrl=common.config.rootPath+"/api/cart/add",t},initGetTagsUrl:function(e){var n=e.result;if(0==n.status)if("function"==typeof template)if(0==n.status&&n.data.length>0){var i=template("tmpl-menus",n);e.bodyContainer.innerHTML=i;for(var o=e.bodyContainer.querySelectorAll(".list-container"),r=0;r<o.length;r++){var l=o[r];l.style.minHeight=window.screen.height-40-44-90+"px"}var s=t.os.ios?.003:9e-4;t(".mui-scroll-wrapper").scroll({bounce:!1,indicators:!1,deceleration:s}),t(".mui-slider").slider(),e.this.initLeftListEvents(e),t.each(e.this.getScrollContainers(),function(n,i){t(i).pullToRefresh({up:{callback:function(){var t=this;e.this.pullUpLoadGoodsGroup(e,t)}}})}),t.os.plus?t.plusReady(function(){setTimeout(function(){e.this.pullUpLoading(e)},1e3)}):t.ready(function(){e.this.pullUpLoading(e)})}else common.alert({msg:"系统分类获取失败"});else common.alert({msg:"模板js文件未引用"});else common.alert({msg:n.message})},initLeftListEvents:function(t){document.querySelector(".mui-slider").addEventListener("slide",function(e){setTimeout(function(){t.this.pullUpLoading(t)},500)})},pullUpLoading:function(e){var n=e.this.getActiveProductContainer(),i=e.this.getScrollContainers(),o=n.querySelector(".list-container");if(""===o.innerHTML.trim()){t(i[o.dataset.index]).pullToRefresh().pullUpLoading()}},getActiveProductContainer:function(){return e.querySelector(".mui-control-content.mui-active")},getScrollContainers:function(){return t(document.querySelectorAll(".mui-slider-group .mui-scroll"))},pullUpLoadGoodsGroup:function(t,e){var n=t.this.getActiveProductContainer();if(null==n)return common.alert({msg:"获取当前模块出错"}),!1;var i=n.querySelector(".list-container"),o=i.getAttribute("data-pageIndex");o=parseInt(o)+1,i.setAttribute("data-pageIndex",o);var r={tagId:i.dataset.id,pageIndex:o};console.log("这是加载当前"+JSON.stringify(r));var l=template("tmpl-model",t.testModel);i.innerHTML+=l,e.endPullUpToRefresh(!1),null==n.querySelector(".spinner-child")||n.querySelector(".spinner-child").classList.contains("mui-hide")||n.querySelector(".spinner-child").classList.add("mui-hide")},pullUpToRefreshScrollToTop:function(e){t(e.this.getActiveProductContainer().querySelector(".mui-scroll-wrapper")).pullRefresh().scrollTo(0,0,1500)},removeLoading:function(t){document.body.removeChild(t.loading)},htmlReplace:function(t,e,n,i){return t=i?t.replace(new RegExp(e,"gm"),n):t.replace(e,n)},addCart:function(e,n){alertOptions.msg="正在请求中...",alertOptions.callback=function(i){t.post(e.addCartUrl,{sid:e.sid,itemStr:n},function(t){0===t.status?(i.setMsg("加入购物车成功"),i.hide()):(i.setMsg("请求出错"),i.hide())},"json")},common.alert(alertOptions)},bindAddCart:function(t){[].slice.call(document.getElementsByClassName("mui-add-cart")).forEach(function(e){e.addEventListener("tap",function(e){var n=this,i=n.id+"--1";t.this.addCart(t,i)})})}};window.autoSlider=i}(mui,document);