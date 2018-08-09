!function($,e,t,n){var i=$.rad2deg=function(e){return e/(Math.PI/180)},r=($.deg2rad=function(e){return e*(Math.PI/180)},navigator.platform.toLowerCase()),a=navigator.userAgent.toLowerCase(),l=(a.indexOf("iphone")>-1||a.indexOf("ipad")>-1||a.indexOf("ipod")>-1)&&(r.indexOf("iphone")>-1||r.indexOf("ipad")>-1||r.indexOf("ipod")>-1),s=$.Picker=function(e,t){var n=this;n.holder=e,n.options=t||{},n.init(),n.initInertiaParams(),n.calcElementItemPostion(!0),n.bindEvent()};s.prototype.findElementItems=function(){var e=this;return e.elementItems=[].slice.call(e.holder.querySelectorAll("li")),e.elementItems},s.prototype.init=function(){var e=this;e.list=e.holder.querySelector("ul"),e.findElementItems(),e.height=e.holder.offsetHeight,e.r=e.height/2-10,e.d=2*e.r,e.itemHeight=e.elementItems.length>0?e.elementItems[0].offsetHeight:40,e.itemAngle=parseInt(e.calcAngle(.8*e.itemHeight)),e.hightlightRange=e.itemAngle/2,e.visibleRange=90,e.beginAngle=0,e.beginExceed=e.beginAngle-30,e.list.angle=e.beginAngle,l&&(e.list.style.webkitTransformOrigin="center center "+e.r+"px")},s.prototype.calcElementItemPostion=function(e){var t=this;e&&(t.items=[]),t.elementItems.forEach(function(n){var i=t.elementItems.indexOf(n);if(t.endAngle=t.itemAngle*i,n.angle=t.endAngle,n.style.webkitTransformOrigin="center center -"+t.r+"px",n.style.webkitTransform="translateZ("+t.r+"px) rotateX("+-t.endAngle+"deg)",e){var r={};r.text=n.innerHTML||"",r.value=n.getAttribute("data-value")||r.text,t.items.push(r)}}),t.endExceed=t.endAngle+30,t.calcElementItemVisibility(t.beginAngle)},s.prototype.calcAngle=function(e){var t=this,n=b=parseFloat(t.r);e=Math.abs(e);var r=180*parseInt(e/t.d);e%=t.d;var a=(n*n+b*b-e*e)/(2*n*b);return r+i(Math.acos(a))},s.prototype.calcElementItemVisibility=function(e){var t=this;t.elementItems.forEach(function(n){var i=Math.abs(n.angle-e);i<t.hightlightRange?n.classList.add("highlight"):i<t.visibleRange?(n.classList.add("visible"),n.classList.remove("highlight")):(n.classList.remove("highlight"),n.classList.remove("visible"))})},s.prototype.setAngle=function(e){var t=this;t.list.angle=e,t.list.style.webkitTransform="perspective(1000px) rotateY(0deg) rotateX("+e+"deg)",t.calcElementItemVisibility(e)},s.prototype.bindEvent=function(){var e=this,t=0,n=null;e.holder.addEventListener("touchstart",function(i){i.preventDefault(),e.list.style.webkitTransition="",n=(i.changedTouches?i.changedTouches[0]:i).pageY,t=e.list.angle,e.updateInertiaParams(i,!0)},!1),e.holder.addEventListener("touchend",function(t){t.preventDefault(),e.startInertiaScroll(t)},!1),e.holder.addEventListener("touchcancel",function(t){t.preventDefault(),e.startInertiaScroll(t)},!1),e.holder.addEventListener("touchmove",function(i){i.preventDefault();var r=(i.changedTouches?i.changedTouches[0]:i).pageY,a=r-n,l=e.calcAngle(a),s=a>0?t-l:t+l;s>e.endExceed&&(s=e.endExceed),s<e.beginExceed&&(s=e.beginExceed),e.setAngle(s),e.updateInertiaParams(i)},!1),e.list.addEventListener("tap",function(t){elementItem=t.target,"LI"==elementItem.tagName&&e.setSelectedIndex(e.elementItems.indexOf(elementItem),200)},!1)},s.prototype.initInertiaParams=function(){var e=this;e.lastMoveTime=0,e.lastMoveStart=0,e.stopInertiaMove=!1},s.prototype.updateInertiaParams=function(e,t){var n=this,i=e.changedTouches?e.changedTouches[0]:e;if(t)n.lastMoveStart=i.pageY,n.lastMoveTime=e.timeStamp||Date.now(),n.startAngle=n.list.angle;else{var r=e.timeStamp||Date.now();r-n.lastMoveTime>300&&(n.lastMoveTime=r,n.lastMoveStart=i.pageY)}n.stopInertiaMove=!0},s.prototype.startInertiaScroll=function(e){var t=this,n=e.changedTouches?e.changedTouches[0]:e,i=e.timeStamp||Date.now(),r=(n.pageY-t.lastMoveStart)/(i-t.lastMoveTime),a=r>0?-1:1,l=6e-4*a*-1,s=Math.abs(r/l),o=r*s/2,c=t.list.angle,g=t.calcAngle(o)*a,d=g;if(c+g<t.beginExceed&&(g=t.beginExceed-c,s=s*(g/d)*.6),c+g>t.endExceed&&(g=t.endExceed-c,s=s*(g/d)*.6),0==g)return void t.endScroll();t.scrollDistAngle(i,c,g,s)},s.prototype.scrollDistAngle=function(e,t,n,i){var r=this;r.stopInertiaMove=!1,function(e,t,n,i){var a=i/13,l=0;!function e(){if(!r.stopInertiaMove){var i=r.quartEaseOut(l,t,n,a);if(r.setAngle(i),++l>a-1||i<r.beginExceed||i>r.endExceed)return void r.endScroll();setTimeout(e,13)}}()}(0,t,n,i)},s.prototype.quartEaseOut=function(e,t,n,i){return-n*((e=e/i-1)*e*e*e-1)+t},s.prototype.endScroll=function(){var e=this;if(e.list.angle<e.beginAngle)e.list.style.webkitTransition="150ms ease-out",e.setAngle(e.beginAngle);else if(e.list.angle>e.endAngle)e.list.style.webkitTransition="150ms ease-out",e.setAngle(e.endAngle);else{var t=parseInt((e.list.angle/e.itemAngle).toFixed(0));e.list.style.webkitTransition="100ms ease-out",e.setAngle(e.itemAngle*t)}e.triggerChange()},s.prototype.triggerChange=function(e){var t=this;setTimeout(function(){var n=t.getSelectedIndex(),i=t.items[n];$.trigger&&(n!=t.lastIndex||e)&&$.trigger(t.holder,"change",{index:n,item:i}),t.lastIndex=n},0)},s.prototype.correctAngle=function(e){var t=this;return e<t.beginAngle?t.beginAngle:e>t.endAngle?t.endAngle:e},s.prototype.setItems=function(e){var t=this;t.items=e||[];var i=[];t.items.forEach(function(e){null!==e&&e!==n&&i.push("<li>"+(e.text||e)+"</li>")}),t.list.innerHTML=i.join(""),t.findElementItems(),t.calcElementItemPostion(),t.setAngle(t.correctAngle(t.list.angle)),t.triggerChange(!0)},s.prototype.getItems=function(){return this.items},s.prototype.getSelectedIndex=function(){var e=this;return parseInt((e.list.angle/e.itemAngle).toFixed(0))},s.prototype.setSelectedIndex=function(e,t){var n=this;n.list.style.webkitTransition="";var i=n.correctAngle(n.itemAngle*e);if(t&&t>0){var r=i-n.list.angle;n.scrollDistAngle(Date.now(),n.list.angle,r,t)}else n.setAngle(i);n.triggerChange()},s.prototype.getSelectedItem=function(){var e=this;return e.items[e.getSelectedIndex()]},s.prototype.getSelectedValue=function(){var e=this;return(e.items[e.getSelectedIndex()]||{}).value},s.prototype.getSelectedText=function(){var e=this;return(e.items[e.getSelectedIndex()]||{}).text},s.prototype.setSelectedValue=function(e,t){var n=this;for(var i in n.items){if(n.items[i].value==e)return void n.setSelectedIndex(i,t)}},$.fn&&($.fn.picker=function(e){return this.each(function(t,n){if(!n.picker)if(e)n.picker=new s(n,e);else{var i=n.getAttribute("data-picker-options"),r=i?JSON.parse(i):{};n.picker=new s(n,r)}}),this[0]?this[0].picker:null},$.ready(function(){$(".mui-picker").picker()}))}(window.mui||window,window,document,void 0);