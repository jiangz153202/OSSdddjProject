!function($){var t=$.className("pull-top-tips");$.PullToRefresh=$.PullToRefresh.extend({init:function(t,n){this._super(t,n),this.options=$.extend(!0,{down:{tips:{colors:["008000","d8ad44","d00324","dc00b8","017efc"],size:200,lineWidth:15,duration:1e3,tail_duration:2500}}},this.options),this.options.down.tips.color=this.options.down.tips.colors[0],this.options.down.tips.colors=this.options.down.tips.colors.map(function(t){return{r:parseInt(t.substring(0,2),16),g:parseInt(t.substring(2,4),16),b:parseInt(t.substring(4,6),16)}})},initPullDownTips:function(){var n=this;$.isFunction(n.options.down.callback)&&(n.pullDownTips=function(){var i=document.querySelector("."+t);return i&&i.parentNode.removeChild(i),i||(i=document.createElement("div"),i.classList.add(t),i.innerHTML='<div class="mui-pull-top-wrapper"><div class="mui-pull-top-canvas"><canvas id="pullDownTips" width="'+n.options.down.tips.size+'" height="'+n.options.down.tips.size+'"></canvas></div></div>',i.addEventListener("webkitTransitionEnd",n),document.body.appendChild(i)),n.pullDownCanvas=document.getElementById("pullDownTips"),n.pullDownCanvasCtx=n.pullDownCanvas.getContext("2d"),n.canvasUtils.init(n.pullDownCanvas,n.options.down.tips),i}())},removePullDownTips:function(){this._super(),this.canvasUtils.stopSpin()},pulling:function(t){var n=Math.min(t/(1.5*this.options.down.height),1),i=Math.min(1,2*n);this.pullDownTips.style.webkitTransform="translate3d(0,"+(t<0?0:t)+"px,0)",this.pullDownCanvas.style.opacity=i,this.pullDownCanvas.style.webkitTransform="rotate("+300*n+"deg)";var s=this.pullDownCanvas,a=this.pullDownCanvasCtx,o=this.options.down.tips.size;a.lineWidth=this.options.down.tips.lineWidth,a.fillStyle="#"+this.options.down.tips.color,a.strokeStyle="#"+this.options.down.tips.color,a.stroke(),a.clearRect(0,0,o,o),s.style.display="none",s.offsetHeight,s.style.display="inherit",this.canvasUtils.drawArcedArrow(a,o/2+.5,o/2,o/4,0*Math.PI,5/3*Math.PI*i,!1,1,2,.7853981633974483,25,this.options.down.tips.lineWidth,this.options.down.tips.lineWidth)},beforeChangeOffset:function(t){},afterChangeOffset:function(t){},dragEndAfterChangeOffset:function(t){t?(this.canvasUtils.startSpin(),this.pullDownLoading()):(this.canvasUtils.stopSpin(),this.endPullDownToRefresh())},canvasUtils:function(){function t(t,n,i,s){return i*t/s+n}function n(t,n,i,s){return(t/=s/2)<1?i/2*t*t+n:-i/2*(--t*(t-2)-1)+n}function i(t,n,i){var s=Math.min(n,i),a=Math.max(n,i);return t<s?s:t>a?s:t}var s=null,a=null,o=200,e=15,r=0,l=0,p=0,h=0,c=0,d=180,u=Math.PI/180,f=1e3,v=2500,M=["35ad0e","d8ad44","d00324","dc00b8","017efc"],w=null,g=function(t,n,i,s,a,o,e,r){"use strict";"string"==typeof n&&(n=parseInt(n)),"string"==typeof i&&(i=parseInt(i)),"string"==typeof s&&(s=parseInt(s)),"string"==typeof a&&(a=parseInt(a)),"string"==typeof o&&(o=parseInt(o)),"string"==typeof e&&(e=parseInt(e));Math.PI;switch(t.save(),t.beginPath(),t.moveTo(n,i),t.lineTo(s,a),t.lineTo(o,e),r){case 0:var l=Math.sqrt((o-n)*(o-n)+(e-i)*(e-i));t.arcTo(s,a,n,i,.55*l),t.fill();break;case 1:t.beginPath(),t.moveTo(n,i),t.lineTo(s,a),t.lineTo(o,e),t.lineTo(n,i),t.fill();break;case 2:t.stroke();break;case 3:var p=(n+s+o)/3,h=(i+a+e)/3;t.quadraticCurveTo(p,h,n,i),t.fill();break;case 4:var c,d,u,f,l;if(o==n)l=e-i,c=(s+n)/2,u=(s+n)/2,d=a+l/5,f=a-l/5;else{l=Math.sqrt((o-n)*(o-n)+(e-i)*(e-i));var v=(n+o)/2,M=(i+e)/2,w=(v+s)/2,g=(M+a)/2,b=(e-i)/(o-n),m=l/(2*Math.sqrt(b*b+1))/5,y=b*m;c=w-m,d=g-y,u=w+m,f=g+y}t.bezierCurveTo(c,d,u,f,n,i),t.fill()}t.restore()},b=function(t,n,i,s,a,o,e,r,l,p,h,c,d){"use strict";r=void 0!==r?r:3,l=void 0!==l?l:1,p=void 0!==p?p:Math.PI/8,c=c||1,d=d||10,h=void 0!==h?h:10,t.save(),t.lineWidth=c,t.beginPath(),t.arc(n,i,s,a,o,e),t.stroke();var u,f,v,M,w;1&l&&(u=Math.cos(a)*s+n,f=Math.sin(a)*s+i,v=Math.atan2(n-u,f-i),e?(M=u+10*Math.cos(v),w=f+10*Math.sin(v)):(M=u-10*Math.cos(v),w=f-10*Math.sin(v)),m(t,u,f,M,w,r,2,p,h)),2&l&&(u=Math.cos(o)*s+n,f=Math.sin(o)*s+i,v=Math.atan2(n-u,f-i),e?(M=u-10*Math.cos(v),w=f-10*Math.sin(v)):(M=u+10*Math.cos(v),w=f+10*Math.sin(v)),m(t,u-d*Math.sin(o),f+d*Math.cos(o),M-d*Math.sin(o),w+d*Math.cos(o),r,2,p,h)),t.restore()},m=function(t,n,i,s,a,o,e,r,l){"use strict";"string"==typeof n&&(n=parseInt(n)),"string"==typeof i&&(i=parseInt(i)),"string"==typeof s&&(s=parseInt(s)),"string"==typeof a&&(a=parseInt(a)),o=void 0!==o?o:3,e=void 0!==e?e:1,r=void 0!==r?r:Math.PI/8,l=void 0!==l?l:10;var p,h,c,d,u="function"!=typeof o?g:o,f=Math.sqrt((s-n)*(s-n)+(a-i)*(a-i)),v=(f-l/3)/f;1&e?(p=Math.round(n+(s-n)*v),h=Math.round(i+(a-i)*v)):(p=s,h=a),2&e?(c=n+(s-n)*(1-v),d=i+(a-i)*(1-v)):(c=n,d=i),t.beginPath(),t.moveTo(c,d),t.lineTo(p,h),t.stroke();var M=Math.atan2(a-i,s-n),w=Math.abs(l/Math.cos(r));if(1&e){var b=M+Math.PI+r,m=s+Math.cos(b)*w,y=a+Math.sin(b)*w,I=M+Math.PI-r,T=s+Math.cos(I)*w,C=a+Math.sin(I)*w;u(t,m,y,s,a,T,C,o)}if(2&e){var b=M+r,m=n+Math.cos(b)*w,y=i+Math.sin(b)*w,I=M-r,T=n+Math.cos(I)*w,C=i+Math.sin(I)*w;u(t,m,y,n,i,T,C,o)}},y=function(n,s){var a=n%s;a<p&&M.push(M.shift());var o=M[0],e=M[1],r=i(t(a,o.r,e.r-o.r,s),o.r,e.r),l=i(t(a,o.g,e.g-o.g,s),o.g,e.g),h=i(t(a,o.b,e.b-o.b,s),o.b,e.b);return p=a,"rgb("+parseInt(r)+","+parseInt(l)+","+parseInt(h)+")"},I=function(i){var p=i||(new Date).getTime();l||(l=p),r=p-l,h=n((r+v/2)%v,0,f,v),c=t((r+h)%f,0,360,f),d=20+Math.abs(t((r+v/2)%v,-300,600,v)),a.lineWidth=e,a.lineCap="round",a.strokeStyle=y(r,f),a.clearRect(0,0,o,o),s.style.display="none",s.offsetHeight,s.style.display="inherit",a.beginPath(),a.arc(o/2,o/2,o/4,parseInt(c-d)%360*u,parseInt(c)%360*u,!1),a.stroke(),w=requestAnimationFrame(I)},T=function(){l=0,p=0,w=requestAnimationFrame(I)},C=function(){w&&cancelAnimationFrame(w)};return{init:function(t,n){s=t,a=s.getContext("2d");var n=$.extend(!0,{},n);M=n.colors,f=n.duration,v=n.tail_duration,o=n.size,e=n.lineWidth},drawArcedArrow:b,startSpin:T,stopSpin:C}}()})}(mui);