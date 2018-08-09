!function($){"use strict";function n(n,t){var r=(65535&n)+(65535&t);return(n>>16)+(t>>16)+(r>>16)<<16|65535&r}function t(n,t){return n<<t|n>>>32-t}function r(r,e,o,u,c,f){return n(t(n(n(e,r),n(u,f)),c),o)}function e(n,t,e,o,u,c,f){return r(t&e|~t&o,n,t,u,c,f)}function o(n,t,e,o,u,c,f){return r(t&o|e&~o,n,t,u,c,f)}function u(n,t,e,o,u,c,f){return r(t^e^o,n,t,u,c,f)}function c(n,t,e,o,u,c,f){return r(e^(t|~o),n,t,u,c,f)}function f(t,r){t[r>>5]|=128<<r%32,t[14+(r+64>>>9<<4)]=r;var f,i,a,h,d,l=1732584193,g=-271733879,v=-1732584194,m=271733878;for(f=0;f<t.length;f+=16)i=l,a=g,h=v,d=m,l=e(l,g,v,m,t[f],7,-680876936),m=e(m,l,g,v,t[f+1],12,-389564586),v=e(v,m,l,g,t[f+2],17,606105819),g=e(g,v,m,l,t[f+3],22,-1044525330),l=e(l,g,v,m,t[f+4],7,-176418897),m=e(m,l,g,v,t[f+5],12,1200080426),v=e(v,m,l,g,t[f+6],17,-1473231341),g=e(g,v,m,l,t[f+7],22,-45705983),l=e(l,g,v,m,t[f+8],7,1770035416),m=e(m,l,g,v,t[f+9],12,-1958414417),v=e(v,m,l,g,t[f+10],17,-42063),g=e(g,v,m,l,t[f+11],22,-1990404162),l=e(l,g,v,m,t[f+12],7,1804603682),m=e(m,l,g,v,t[f+13],12,-40341101),v=e(v,m,l,g,t[f+14],17,-1502002290),g=e(g,v,m,l,t[f+15],22,1236535329),l=o(l,g,v,m,t[f+1],5,-165796510),m=o(m,l,g,v,t[f+6],9,-1069501632),v=o(v,m,l,g,t[f+11],14,643717713),g=o(g,v,m,l,t[f],20,-373897302),l=o(l,g,v,m,t[f+5],5,-701558691),m=o(m,l,g,v,t[f+10],9,38016083),v=o(v,m,l,g,t[f+15],14,-660478335),g=o(g,v,m,l,t[f+4],20,-405537848),l=o(l,g,v,m,t[f+9],5,568446438),m=o(m,l,g,v,t[f+14],9,-1019803690),v=o(v,m,l,g,t[f+3],14,-187363961),g=o(g,v,m,l,t[f+8],20,1163531501),l=o(l,g,v,m,t[f+13],5,-1444681467),m=o(m,l,g,v,t[f+2],9,-51403784),v=o(v,m,l,g,t[f+7],14,1735328473),g=o(g,v,m,l,t[f+12],20,-1926607734),l=u(l,g,v,m,t[f+5],4,-378558),m=u(m,l,g,v,t[f+8],11,-2022574463),v=u(v,m,l,g,t[f+11],16,1839030562),g=u(g,v,m,l,t[f+14],23,-35309556),l=u(l,g,v,m,t[f+1],4,-1530992060),m=u(m,l,g,v,t[f+4],11,1272893353),v=u(v,m,l,g,t[f+7],16,-155497632),g=u(g,v,m,l,t[f+10],23,-1094730640),l=u(l,g,v,m,t[f+13],4,681279174),m=u(m,l,g,v,t[f],11,-358537222),v=u(v,m,l,g,t[f+3],16,-722521979),g=u(g,v,m,l,t[f+6],23,76029189),l=u(l,g,v,m,t[f+9],4,-640364487),m=u(m,l,g,v,t[f+12],11,-421815835),v=u(v,m,l,g,t[f+15],16,530742520),g=u(g,v,m,l,t[f+2],23,-995338651),l=c(l,g,v,m,t[f],6,-198630844),m=c(m,l,g,v,t[f+7],10,1126891415),v=c(v,m,l,g,t[f+14],15,-1416354905),g=c(g,v,m,l,t[f+5],21,-57434055),l=c(l,g,v,m,t[f+12],6,1700485571),m=c(m,l,g,v,t[f+3],10,-1894986606),v=c(v,m,l,g,t[f+10],15,-1051523),g=c(g,v,m,l,t[f+1],21,-2054922799),l=c(l,g,v,m,t[f+8],6,1873313359),m=c(m,l,g,v,t[f+15],10,-30611744),v=c(v,m,l,g,t[f+6],15,-1560198380),g=c(g,v,m,l,t[f+13],21,1309151649),l=c(l,g,v,m,t[f+4],6,-145523070),m=c(m,l,g,v,t[f+11],10,-1120210379),v=c(v,m,l,g,t[f+2],15,718787259),g=c(g,v,m,l,t[f+9],21,-343485551),l=n(l,i),g=n(g,a),v=n(v,h),m=n(m,d);return[l,g,v,m]}function i(n){var t,r="",e=32*n.length;for(t=0;t<e;t+=8)r+=String.fromCharCode(n[t>>5]>>>t%32&255);return r}function a(n){var t,r=[];for(r[(n.length>>2)-1]=void 0,t=0;t<r.length;t+=1)r[t]=0;var e=8*n.length;for(t=0;t<e;t+=8)r[t>>5]|=(255&n.charCodeAt(t/8))<<t%32;return r}function h(n){return i(f(a(n),8*n.length))}function d(n,t){var r,e,o=a(n),u=[],c=[];for(u[15]=c[15]=void 0,o.length>16&&(o=f(o,8*n.length)),r=0;r<16;r+=1)u[r]=909522486^o[r],c[r]=1549556828^o[r];return e=f(u.concat(a(t)),512+8*t.length),i(f(c.concat(e),640))}function l(n){var t,r,e="0123456789abcdef",o="";for(r=0;r<n.length;r+=1)t=n.charCodeAt(r),o+=e.charAt(t>>>4&15)+e.charAt(15&t);return o}function g(n){return unescape(encodeURIComponent(n))}function v(n){return h(g(n))}function m(n){return l(v(n))}function p(n,t){return d(g(n),g(t))}function s(n,t){return l(p(n,t))}function C(n,t,r){return t?r?p(t,n):s(t,n):r?v(n):m(n)}"function"==typeof define&&define.amd?define(function(){return C}):"object"==typeof module&&module.exports?module.exports=C:$.md5=C}(this);