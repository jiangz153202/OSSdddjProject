!function(){var r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",e=new Array(-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,62,-1,-1,-1,63,52,53,54,55,56,57,58,59,60,61,-1,-1,-1,-1,-1,-1,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,-1,-1,-1,-1,-1,-1,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,-1,-1,-1,-1,-1),t={base64encode:function(e){var t,a,o,c,n,h;for(o=e.length,a=0,t="";a<o;){if(c=255&e.charCodeAt(a++),a==o){t+=r.charAt(c>>2),t+=r.charAt((3&c)<<4),t+="==";break}if(n=e.charCodeAt(a++),a==o){t+=r.charAt(c>>2),t+=r.charAt((3&c)<<4|(240&n)>>4),t+=r.charAt((15&n)<<2),t+="=";break}h=e.charCodeAt(a++),t+=r.charAt(c>>2),t+=r.charAt((3&c)<<4|(240&n)>>4),t+=r.charAt((15&n)<<2|(192&h)>>6),t+=r.charAt(63&h)}return t},base64decode:function(r){var t,a,o,c,n,h,d;for(h=r.length,n=0,d="";n<h;){do{t=e[255&r.charCodeAt(n++)]}while(n<h&&t==-1);if(t==-1)break;do{a=e[255&r.charCodeAt(n++)]}while(n<h&&a==-1);if(a==-1)break;d+=String.fromCharCode(t<<2|(48&a)>>4);do{if(61==(o=255&r.charCodeAt(n++)))return d;o=e[o]}while(n<h&&o==-1);if(o==-1)break;d+=String.fromCharCode((15&a)<<4|(60&o)>>2);do{if(61==(c=255&r.charCodeAt(n++)))return d;c=e[c]}while(n<h&&c==-1);if(c==-1)break;d+=String.fromCharCode((3&o)<<6|c)}return d},utf16to8:function(r){var e,t,a,o;for(e="",a=r.length,t=0;t<a;t++)o=r.charCodeAt(t),o>=1&&o<=127?e+=r.charAt(t):o>2047?(e+=String.fromCharCode(224|o>>12&15),e+=String.fromCharCode(128|o>>6&63),e+=String.fromCharCode(128|o>>0&63)):(e+=String.fromCharCode(192|o>>6&31),e+=String.fromCharCode(128|o>>0&63));return e},utf8to16:function(r){var e,t,a,o,c,n;for(e="",a=r.length,t=0;t<a;)switch((o=r.charCodeAt(t++))>>4){case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:e+=r.charAt(t-1);break;case 12:case 13:c=r.charCodeAt(t++),e+=String.fromCharCode((31&o)<<6|63&c);break;case 14:c=r.charCodeAt(t++),n=r.charCodeAt(t++),e+=String.fromCharCode((15&o)<<12|(63&c)<<6|(63&n)<<0)}return e},CharToHex:function(r){var e,t,a,o,c;for(e="",a=r.length,t=0;t<a;)o=r.charCodeAt(t++),c=o.toString(16),c.length<2&&(c="0"+c),e+="\\x"+c+" ",t>0&&t%8==0&&(e+="\r\n");return e},doEncode:function(r){return t.base64encode(t.utf16to8(r))},doDecode:function(r){return t.utf8to16(t.base64decode(r))}};window.BASE64=t}();