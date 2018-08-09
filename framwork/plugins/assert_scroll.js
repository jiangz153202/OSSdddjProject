var md_lib = {
    hasClass:function(element,classname){
        return element.className.match(new RegExp('(\\s|^)' + classname + '(\\s|$)')); 
    },
    addClass:function(element,classname){
        if (!this.hasClass(element, classname)) element.className += " " + classname;  
    },
    removeClass:function(element,classname){
        if (this.hasClass(element, classname)) {  
            var reg = new RegExp('(\\s|^)' + classname + '(\\s|$)');  
            element.className = element.className.replace(reg, ' ');  
        } 
    },
    //获取滚动高度
    getScrollTop: function() {
        var scrollTop = 0;
        if(document.documentElement && document.documentElement.scrollTop) {
            scrollTop = document.documentElement.scrollTop;
        } else if(document.body) {
            scrollTop = document.body.scrollTop;
        }
        return scrollTop;
    },
    //获取当前可视高度 
    getClientHeight: function() {
        return document.documentElement.clientHeight;
    },
    //获取文档完整的高度 
    getScrollHeight: function() {
        return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    },
    
    //检查滚动高度是否到了底部，距离底部200时，认为到底，开始加载下一页
    checkScrollHeight:function(){
        return this.getScrollHeight() - this.getClientHeight() - this.getScrollTop() <= 200;
    }
}
