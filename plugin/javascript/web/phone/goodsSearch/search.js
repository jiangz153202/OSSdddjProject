+function(e,t){var n={init:function(e){e=this.setOptions(e||{}),this.setPageInit(e),this.initPage(e)},setOptions:function(n){return n.this=this,n.pullrefresh=e("#pullrefresh"),n.listContainer=t.getElementById("list-container"),n.searchInput=document.getElementById("store-search"),n.searchBtn=document.getElementById("search-btn"),n.searchInputClear=document.querySelector(".mui-icon-clear"),n.contents=document.querySelectorAll(".mui-control-content"),n.addCartUrl=common.config.rootPath+"/api/cart/add",n.getKeywordUrl=common.config.rootPath+"/api/goods/search",n.defaultHideClassName="mui-hidden",n.clearStorage=t.querySelectorAll(".clearStorage"),n.clearStorageContent=t.querySelector(".clearStorage-content"),n},setPageInit:function(n){n.this.setDefaultContent(n),n.searchInput.addEventListener("keyup",function(){n.this.updateInputPageStatus(n,this)}),n.searchInputClear.addEventListener("tap",function(){n.searchInput.value="",n.this.updateInputPageStatus(n,n.searchInput),n.this.setDefaultContent(n)}),n.searchBtn.addEventListener("tap",function(){if(""==n.searchInput.value)return common.alert({msg:"请输入要搜索的商品名称"}),!1;n.pullrefresh.pullRefresh().scrollTo(0,0,100),document.body.setAttribute("data-pageIndex",0),n.listContainer.innerHTML="",n.this.setDefaultContent(n,n.contents.length-1),void 0!=n.pullrefresh.pullRefresh().finished&&(console.log("重启一下"),n.pullrefresh.pullRefresh().refresh(!0)),e.os.plus?e.plusReady(function(){setTimeout(function(){n.pullrefresh.pullRefresh().pullupLoading()},1e3)}):e.ready(function(){n.pullrefresh.pullRefresh().pullupLoading()})}),n.this.updateSearchTmpl(n),n.this.initSearchBadges(n);for(var a=0;a<n.clearStorage.length;a++){n.clearStorage[a].addEventListener("tap",function(){null!=window.localStorage.getItem("seesionBySearch")&&window.localStorage.removeItem("seesionBySearch"),null==window.localStorage.getItem("seesionBySearch")&&(n.clearStorageContent.innerHTML=t.getElementById("tmpl-empty2").innerHTML)})}},initSearchBadges:function(t){e(".mui-content").off("tap",".mui-badge-search"),e(".mui-content").on("tap",".mui-badge-search",function(){""!=this.innerText&&(t.searchInput.value=this.innerText,t.this.updateInputPageStatus(t,t.searchInput))})},setDefaultContent:function(e,t){null!=t&&void 0!=t||(t=0),""!=e.listContainer.innerHTML.trim()&&0==t&&(document.body.setAttribute("data-pageIndex",0),e.listContainer.innerHTML="");for(var n=0;n<e.contents.length;n++)e.contents[n].classList.remove("mui-active");e.contents[t].classList.add("mui-active")},initPage:function(t){e.init({pullRefresh:{container:"#pullrefresh",up:{contentrefresh:"正在加载...",contentnomore:"没有更多了...",callback:function(){t.this.pullupRefresh(t)}}}}),document.body.setAttribute("data-pageIndex",0),e(".dddj-menu").on("tap",".menu-backtop",function(){t.this.pullUpToRefreshScrollToTop(t)}),t.pullrefresh[0].style.height=(window.screen.availHeight||window.screen.height)-document.querySelector("header").clientHeight+"px",e(".mui-scroll-wrapper").scroll(),e.init(),_fn.pageInit(),_fn.hide()},pullupRefresh:function(t){var n=document.body.getAttribute("data-pageIndex");n=parseInt(n)+1,document.body.setAttribute("data-pageIndex",n);var a=t.searchInput.value.trim();t.this.addLocalStorage(a,t);var r={pageIndex:n,keyword:a};e.post(t.getKeywordUrl,r,function(n){if("function"==typeof template)if(0==n.status&&n.data.length>0){var a=template("tmpl-model",n);t.listContainer.innerHTML+=a,t.listContainer.removeAttribute("data-imageLazyload"),e(t.listContainer).imageLazyload(),t.this.initParabola(t),t.pullrefresh.pullRefresh().endPullupToRefresh(0===n.data.length)}else""==t.listContainer.innerHTML.trim()&&(t.listContainer.innerHTML=document.getElementById("tmpl-empty").innerHTML),t.pullrefresh.pullRefresh().endPullupToRefresh(!0);else common.alert({msg:"模板js文件未引用"})},"json")},updateInputPageStatus:function(e,t){""===t.value.trim()?e.searchInputClear.classList.add(e.defaultHideClassName):e.searchInputClear.classList.remove(e.defaultHideClassName)},initParabola:function(e){var t=document.querySelector("#flyItem"),n=document.querySelector("#shopCart"),a=parseInt(n.querySelector(".mui-badge").innerHTML.trim()),r=funParabola(t,n,{speed:400,curvature:.02,complete:function(){t.style.visibility="hidden",n.querySelector(".mui-badge").innerHTML=++a}});t&&n&&[].slice.call(document.getElementsByClassName("mui-add-cart")).forEach(function(n){n.addEventListener("tap",function(n){var a=this,o=a.getBoundingClientRect();t.style.left=o.left+"px",t.style.top=o.top+"px",t.style.visibility="visible";var i=a.id+"--1";e.this.addCart(e,i),r.position().move()})})},addCart:function(t,n){e.post(t.addCartUrl,{sid:t.sid,itemStr:n},function(e){},"json")},pullUpToRefreshScrollToTop:function(t,n){e(t.this.getActiveProductContainer().querySelector(".mui-scroll-wrapper")).pullRefresh().scrollTo(0,0,n||1500)},getActiveProductContainer:function(){return t.querySelector(".mui-control-content.mui-active")},addLocalStorage:function(e,t){var n=[];if(null==window.localStorage.getItem("seesionBySearch"))n=[e],window.localStorage.setItem("seesionBySearch",JSON.stringify(n));else{var a=window.localStorage.getItem("seesionBySearch");n=JSON.parse(a);for(var r=0;r<n.length;r++){n[r].trim()===e.trim()&&n.splice(r,1)}n.push(e.trim()),window.localStorage.setItem("seesionBySearch",JSON.stringify(n))}t.this.updateSearchTmpl(t),console.log()},updateSearchTmpl:function(e){if(null==window.localStorage.getItem("seesionBySearch")&&(e.clearStorageContent.innerHTML=t.getElementById("tmpl-empty2").innerHTML),null!=window.localStorage.getItem("seesionBySearch")){var n={data:JSON.parse(window.localStorage.getItem("seesionBySearch"))},a=template("tmpl-model2",n);e.clearStorageContent.innerHTML=a,e.this.initSearchBadges(e)}}};window.goodsSearch=n}(mui,document);