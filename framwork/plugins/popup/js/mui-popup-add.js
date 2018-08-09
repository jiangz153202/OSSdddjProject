;+(function($,doc,window){
	'use strict';
	
	var _tmpl = function(){};
	
	var _default_width=window.screen.width;
	var _default_height=window.screen.availHeight ;
	var _default_proportion_w=0.80;
	var _default_proportion_h=0.65;
	var DEFAULT_ID='mui-popup-DIY';
	var DEFAULT_CSSLINK='/framwork/plugins/popup/css/popup.css';
	var source=
	'<div class="'+DEFAULT_ID+'" id="'+DEFAULT_ID+'">'+
		'<div class="mui-popup-action">'+
			'<span class="mui-icon mui-icon-closeempty" style="font-size:28px;"></span>'+
		'</div>'+
		'<div id="mui-popup-slider" class="mui-slider" >'+
		    '<div class="mui-slider-group mui-slider-loop">'+
			'<div class="mui-slider-item mui-slider-item-duplicate">'+
				'<a href="{{$data[$data.length-1].href}}">'+
					'<img src="{{$data[$data.length-1].imgUrl}}" />'+
				'</a>'+
			'</div>'+
			'{{each $data as $value i}}'+
			'<div class="mui-slider-item">'+
				'<a href="{{$value.href}}" >'+
					'<img src="{{$value.imgUrl}}"  />'+
				'</a>'+
			'</div>'+
			'{{/each}}'+
			'<div class="mui-slider-item mui-slider-item-duplicate">'+
				'<a href="javascript:;" >'+
					'<img src="{{$data[0].imgUrl}}" />'+
				'</a>'+
			'</div>'+
		'</div>'+
			'{{if $data.length > 1}}'+
				'<div class="mui-slider-indicator" >'+
					'{{each $data as $value i}}'+
					'<div class="mui-indicator {{if i == 0}}mui-active{{/if}}"></div>'+
					'{{/each}}'+
				'</div>'+
			'{{/if}}'+
		'</div>'+
	'</div>'
	var defaults = {
	 	width:_default_width,
	 	height:_default_height,
	 	proportion_w:_default_proportion_w,
	 	proportion_h:_default_proportion_h,
        onShowBefor: null,                                 //显示前
        onHideAfter: null,                              //隐藏后
        onChange: null
    };
	
	_tmpl.createTmplByReview = function(parentElement,data,options){
		var head = document.getElementsByTagName("head");
        var cssLink = document.createElement("link");
        cssLink.href = DEFAULT_CSSLINK;
        cssLink.type = "text/css";
        cssLink.rel = "stylesheet";
        //绑定引入
        head[0].appendChild(cssLink);
        
		
		var render  = template.compile(source);
		var html=render(data);
		common.insertHTML(parentElement,'afterend',html);
		
		var slider_width=options.width * options.proportion_w;
        var slider_height=options.height * options.proportion_h;
		//获取各个元素
        var popuhslider=doc.getElementById('mui-popup-slider');
        var popupaction=doc.querySelector('.mui-popup-action');
        var _popupactionHeight=popupaction.clientHeight+20;
        
        var popupactionStr='top:'+((options.height-slider_height)/2 -_popupactionHeight * 1.7)+'px;right:'+((options.width-slider_width)/2 + 10)+'px;';
        //alert(popupactionStr+"高度"+slider_height+"_popupactionHeight"+_popupactionHeight+"options.height-slider_height"+(options.height-slider_height));
        var popupStr="width:"+slider_width+"px;height:"+slider_height+"px;margin-left:-"+slider_width/2+"px;margin-top:-"+slider_height/2+"px";
        popuhslider.style.cssText=popupStr;
        popupaction.style.cssText=popupactionStr;
		
		//绑定事件
		//console.log('绑定事件先');
		
		mui('.'+DEFAULT_ID).off();
		
		mui('.'+DEFAULT_ID)[0].addEventListener('tap',function(e){
			if(e.target == document.getElementById(DEFAULT_ID)){
				setTimeout(function(){
					_tmpl.toggleTmpl();
					e.preventDefault(e);
   	    			e.stopPropagation(e);
			
				},400);
			}
		});
		
		setTimeout(function(){
			var slider = mui('#mui-popup-slider');
			if(data.length > 1){
				slider.slider({
					interval: 5000
				});
			}else{
				slider.slider({
					interval: 0
				});
			}
		},1000);
		
		mui('.'+DEFAULT_ID).on('tap','a',function(e){
			var $this=this;
			setTimeout(function(){
					window.location.href=$this.href;
					e.preventDefault(e);
   	    			e.stopPropagation(e);
			},400);
		});
		
		mui('.'+DEFAULT_ID).on('tap','.mui-popup-action',function(e){
			console.log('跳转到更多');
			_tmpl.toggleTmpl();
			e.stopPropagation(e);
			e.preventDefault(e);
		});
		
		
	}
	_tmpl.toggleTmpl=function(){
		doc.getElementById(DEFAULT_ID).classList.toggle('mui-hide');
	}
	_tmpl.init=function(data,option){
		var popoverNode=doc.getElementById(DEFAULT_ID);
		if(popoverNode == null){
			var parentElement=doc.querySelector('.mui-content');
			var options = typeof option === 'object' && option;
			
			options = $.extend({}, defaults, options);
			//console.log(JSON.stringify(options));
			_tmpl.createTmplByReview(parentElement,data,options);
			
		}else{
			_tmpl.toggleTmpl();
		}	
	}
	window.muiPopupAdd=_tmpl;
})(mui,document,window);
