+function(e,t,a){"use strict";var o=common.config.carAppPath+"/capi/index/carSecretary.json",i=common.config.cdnUrl+"/plugin/style/basic/carSecretary.css?v="+(new Date).getTime(),l=function(){};l.createTmplByReview=function(a,o,c,r){var n=document.getElementsByTagName("head"),s=document.createElement("link");s.href=i,s.type="text/css",s.rel="stylesheet",n[0].appendChild(s);var m=template.compile('<div id="car-mi-popover" class="mui-popover mui-popover-bottom mui-popover-action mui-mi-sku rgba-color-fff"><div class="mui-scroll-wrapper mui-popo-scroll"><div class="mui-scroll"><div class="mui-popo-scroll fn_clearmarginbottombyp">{{each $data as $value i}}<p class="qc-font-size14 qc-color-666 fn_paddingleft10 fn_paddingtop10">{{$value.title}}</p><ul class="mui-table-view mui-grid-view mui-grid-9 fn_clearmargin mui-text-left">{{each $value.childIndexTopicItems as $item i}}<li class="mui-table-view-cell mui-media w25"><a href="javascript:;" data-targetType={{$item.target_type}}><img src="{{$item.pic_path}}" class="mui-pop-img"><div class="mui-pop-text qc-color-666">{{$item.title}}</div></a></li>{{/each}}</ul>{{/each}}</div></div></div><ul class="mui-table-view clearUl mui-popo-bar fn_clearmargin"><li class="mui-table-view-cell fn_font-size14 mui-text-center"><a class="" href="javascript:;"><span class="iconfont icon-close default-abs-color"></span></a></li></ul></div>'),p=m(o);common.insertHTML(a,"afterend",p);var u=e.getElementById("car-mi-popover");u.style.height=t.screen.height+"px";var d=mui.os.ios?.003:9e-4;mui(".mui-scroll-wrapper:not(.mui-not-wrapper)").scroll({bounce:!1,indicators:!1,deceleration:d});var g=u.querySelector(".icon-close").parentNode;null!=g&&g.addEventListener("tap",function(){l.toggleTmpl()}),mui(".mui-popo-scroll").off(),mui(".mui-popo-scroll").on("tap","a",function(){var e=this;AjaxCommon._thisTargetServlet(e)}),"function"==typeof c&&c(),"function"==typeof r&&r(),l.toggleTmpl()},l.createDataBaseByUrl=function(t,a){alertOptions.msg="正在加载中...",alertOptions.callback=function(i){var c={urlPath:o,data:{},onBeforeSend:function(){},onSuccess:function(o){if(1==o.head.bcode){i.setMsg("加载成功!"),i.hide();var c=e.querySelector(".mui-content");null!=c&&l.createTmplByReview(c,o.data,t,a)}else i.setMsg("加载失败!"),i.hide(),common.alert({msg:o.head.bmessage||"读取出错"})},onError:function(){i.setMsg("加载失败!"),i.hide(),console.log("失败回调")}};AjaxCommon.getAjaxRequestJson(c)},common.alert(alertOptions)},l.toggleTmpl=function(){mui("#car-mi-popover").popover("toggle")},l.init=function(t,a){null==e.getElementById("car-mi-popover")?(l.createDataBaseByUrl(t,a),console.log("生成")):l.toggleTmpl()},l.targetServlet=function(e){console.log("标签跳转"+e.dataset.target_global_id+"-"+e.dataset.targettype);var t=e.dataset.targettype==a?0:e.dataset.targettype,o=e.dataset.target_global_id==a?0:e.dataset.target_global_id;AjaxCommon.switchTarget(t,o,e)},t.carSecretaryTmpl=l}(document,window,void 0);