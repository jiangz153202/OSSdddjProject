!function($,n,r){var e=0,t=function(){return"mui_jsonp_callback_"+e++},o=r.body,u=function(n){var e=r.createElement("script");return e.src=n,e.async=!0,e.defer=!0,o.appendChild(e),e},i=function(n,r,e,t){e?n=n.replace(e+"=?",e+"="+t):r.callback=t;var o=[];for(var u in r)o.push(u+"="+encodeURIComponent(r[u]));return console.log(n+"?"+r),n+"?"+r},c=function(n){n=n||location.search;var r=n.indexOf("?"),e=n.substr(r+1),t=e.split("&"),o={};for(var u in t){var i=t[u].split("=");o[i[0]]=i[1]}return o},l=function(n){var r=c(n);for(var e in r)if("?"===r[e])return e;return null};$.getJSONP=function(r,e,c){if(!r)throw"mui.getJSONP URL error!";var a=l(r),f=t();e=e||{},c=c||$.noop,r=i(r,e,a,f);var s=null;return n[f]=function(r){c(r),s&&o.removeChild(s),n[f]=null,delete n[f]},console.log(r),s=u(r),$},$.__getJSON=$.getJSON,$.getJSON=function(n,r,e){return null!=l(n)?$.getJSONP(n,r,e):$.__getJSON(n,r,e)}}(mui,window,document);