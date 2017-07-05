/**
页面居中
简单使用：
$('#cbox1').center();
不是所有人都喜欢让某元素垂直居中，同时想要它跟随屏幕滚动的话，可以这样配置(所有在此合理配置的CSS样式都将被应用)：
$('#cbox2').center();
要让#cobx1脱离父容器(假定它是静态定位)的话：
$('#cbox1').center();
*/
;(function($) {
	$.fn.center = function(f) {
	    return this.each(function() {
	        var p = f === false ? document.body : this.parentNode;
	        if (p.nodeName.toLowerCase() != "body" && jQuery.css(p, "position") == 'static')
	            p.style.position = 'relative';
	        var s = this.style;
	        s.position = 'absolute';
	        if (p.nodeName.toLowerCase() == "body")
	            var w = $(window);
	        if (!f || f == "horizontal") {
	            s.left = "0px";
	            if (p.nodeName.toLowerCase() == "body") {
	                var clientLeft = w.scrollLeft() - 10 + (w.width() - parseInt(jQuery.css(this, "width"))) / 2;
	                s.left = Math.max(clientLeft, 0) + "px";
	            } else if (((parseInt(jQuery.css(p, "width")) - parseInt(jQuery.css(this, "width"))) / 2) > 0)
	                s.left = ((parseInt(jQuery.css(p, "width")) - parseInt(jQuery.css(this, "width"))) / 2) + "px";
	        }
	        if (!f || f == "vertical") {
	            s.top = "0px";
	            if (p.nodeName.toLowerCase() == "body") {
	                var clientHeight = w.scrollTop() - 10 + (w.height() - parseInt(jQuery.css(this, "height"))) / 2;
	                s.top = Math.max(clientHeight, 0) + "px";
	            } else if (((parseInt(jQuery.css(p, "height")) - parseInt(jQuery.css(this, "height"))) / 2) > 0)
	                s.top = ((parseInt(jQuery.css(p, "height")) - parseInt(jQuery.css(this, "height"))) / 2) + "px";
	        }
	    });
	}
})(jQuery);


/**
*	分页插件 by Mantou 2015/10/19
*	回调函数：callback(nowpage,maxpage);
*	使用方法：$(obj).pageList({callback: fun_name });
*/
;(function($) {
    $.fn.pageList = function(setting) {
        var defaults = {
                callback: null, //默认回调函数为空
                maxCount : 1, //最大条数
                maxpage : 20 //最大页，共 x 页,默认值
        }
        //如果setting为空，就取default的值
        var setting = $.extend(defaults, setting);

        //最大条数
		var maxCount = setting.maxCount; //最大条数
		var shtml = ""; //存放DOM结构
		var maxpage = setting.maxpage; //最大页数，共 x 页
		var $pageList = $(this); //获取当前的pagelist
		var $ul = $pageList.find(".mt-pagelist-page");
		var _this = $(this);
		maxpage = Math.ceil(maxCount/10);

		//组装pagelist的 shtml,需要最大页码，以及当前的页码
		var setPageList = function(nowpage){
			var shtml1 = '<li><a href="javascript:;">{{num1}}</a></li>\
						  <li><a href="javascript:;">{{num2}}</a></li>\
						  <li><a href="javascript:;">{{num3}}</a></li>';
			var shtml2 = '<li>...</li>';
			var shtml3 = '<li><a href="javascript:;">'+maxpage+'</a></li>';
			if(maxpage <= 4){
				shtml2 = "";
				shtml3 = "";
				shtml1 = "";
				for(var i=1; i<=maxpage; i++){
					shtml1 += '<li><a href="javascript:;">'+i+'</a></li>';
				}
			}else{
				if(nowpage <= 1){
					nowpage = 1;
				}
				else if(nowpage <= 2){
					nowpage--;
				}
				else if(nowpage == maxpage){
					nowpage-= 3;
					shtml2 = "";
				}
				else if(nowpage == maxpage-2){
					nowpage-= 1;
					shtml2 = "";
				}
				else if(nowpage == maxpage-1){
					nowpage-= 2;
					shtml2 = "";
				}
				else{
					nowpage--;
				}
				var j = 1;
				for(var i=nowpage; i<nowpage+4; i++){
					shtml1 = shtml1.replace('{{num'+j+'}}',i);
					j++;
				}
			}
			return (shtml1+shtml2+shtml3);
		};

		//设置class on
		var setClassOn = function(nowpage){
			$ul.find("li").each(function(index, el) {
				//console.log(el);
				if($(el).find("a")[0]){
					if(nowpage == $(el).find("a").html()){
						$(el).addClass('on');
						if(setting.callback != null){
							setting.callback(nowpage,maxpage,_this.find(".mt-pagelist-select").val());
						}
						return false;
					}
				}
			});
		};

		//获取当前的 on 的页码
		var getOnNum = function(){
			return parseInt($ul.find(".on a").html());
		};

		//设置分页参数
		$pageList.on('change', ".mt-pagelist-select", function() {
			var $this = $(this);
			maxpage = Math.ceil(maxCount/$this.val());
			//设置
			$this.next("span").find(".mt-pagelist-count").html(maxCount);
			$ul.html(setPageList(1));
			setClassOn(1);
		});

		//点击页码
		$pageList.on('click', 'li', function(event) {
			//console.log("点击页吗~");
			var $this = $(this);
			//点击 ... 的情况
			var $a = $this.find("a");
			if($a[0] == undefined) return false;
			//点击 页码
			var nowpage = $a.html();
			var shtml = setPageList(nowpage);
			$this.parent().html(shtml);
			setClassOn(nowpage);
		});

		//上一页
		$pageList.on('click', '.mt-pagelist-prev', function(event) {
			var num = getOnNum();
			if(num == 1){
				//console.log("已经是一页了！");
				return false;
			}else{
				num--;
				$ul.html(setPageList(num));
				setClassOn(num);
			}
		});

		//下一页
		$pageList.on('click', '.mt-pagelist-next', function(event) {
			var num = getOnNum();
			if(num == maxpage){
				//console.log("已经是最后一页了！");
				return false;
			}else{
				num++;
				$ul.html(setPageList(num));
				setClassOn(num);
			}
		});

		//跳转到首页
		$pageList.on('click', '.mt-pagelist-first', function(event) {
			gotoPage(1);
		});

		//跳转到尾页
		$pageList.on('click', '.mt-pagelist-end', function(event) {
			gotoPage(maxpage);
		});

		//跳转到第几页
		$pageList.on('click', '.mt-pagelist-btn', function(event) {
			var val = $(this).prev('.mt-pagelist-input').find(".mt-input").val();
			if(RegExp('^[1-9]\\d*$').test(val) && val <= maxpage){
				$ul.html(setPageList(val));
				setClassOn(val);
			}else{
				//alert("请输入正确的页码数！");
				if(val > maxpage){
					gotoPage(maxpage);
				}else{
					gotoPage(1);
				}
				//输入错后，直接跳转到第一页去
				
			}
		});

		//跳转到第几页
		var gotoPage = function(num){
			var $input = $pageList.find(".mt-pagelist-input .mt-input");
			$input.val(num);
			$pageList.find(".mt-pagelist-btn").trigger('click');
			$input.val("");
		};

		//初始化 页数,页码
		$(this).find(".mt-pagelist-count").html(maxCount);
		$(this).find(".mt-pagelist-page li").eq(0).trigger('click');

		//重置pageList
        this.refresh = function(count){
        	var pageMax = $(this).find(".mt-pagelist-select").val();
        	maxCount = count;
        	maxpage = Math.ceil(maxCount/pageMax);
        	//初始化 页数,页码
			$(this).find(".mt-pagelist-count").html(maxCount);
			//$(this).find(".mt-pagelist-page li");
			gotoPage(1);
        };

        //跳转到指定的页码
        this.gotoPage = gotoPage;

        //设置count
        this.setCount = function(count,nowpage){
        	var pageMax = $(this).find(".mt-pagelist-select").val();
        	maxCount = count;
        	maxpage = Math.ceil(maxCount/pageMax);
        	//初始化maxCount
			$(this).find(".mt-pagelist-count").html(maxCount);
			$ul.html(setPageList(nowpage));
			//设置on
			$ul.find("li").each(function(index, el) {
				//console.log(el);
				if($(el).find("a")[0]){
					if(nowpage == $(el).find("a").html()){
						$(el).addClass('on');
					}
				}
			});
        }

        return this;

    }
})(jQuery);


//拖拽插件 by mantou
;(function($){
	$.fn.dragMt = function(setting){ 
		var defaults = { 
			//drag_callback : null//默认回调函数为空
			down_callback : null,
			move_callback : null,
			up_callback : null,
			dragStartDom : null //默认的拖动触发DOM
		} 
		//如果setting为空，就取default的值
		var setting = $.extend(defaults, setting); 
		this.each(function(){ 
			//插件实现代码 
			var $this = $(this);
			
			//点击事件
			var $dragStartDom = setting.dragStartDom==null?$(document):$(setting.dragStartDom);
			$dragStartDom.off("mousedown").on("mousedown",function(e){
				var ev = {
					x_start : null,
					y_start : null,
					x_move : null,
					y_move : null,
					x_end : null,
					y_end : null,
					left : null,
					top :null
				};
					
				ev.x_start = e.pageX;
				ev.y_start = e.pageY;
				ev.left = $this.position().left + $this.parent().get(0).scrollLeft;
				ev.top = $this.position().top + $this.parent().get(0).scrollTop;

				if(setting.down_callback != null){
					setting.down_callback(ev);
				}
				
				$(document).on("mousemove.dragMt",function(e){
					ev.x_move = e.pageX - ev.x_start + ev.left;
					ev.y_move = e.pageY - ev.y_start + ev.top;
					// if(ev.y_move < 0){
					// 	ev.y_move = 0;	
					// }
					// if(ev.x_move < 0){
					// 	ev.x_move = 0;	
					// }
					if(setting.move_callback != null){
						setting.move_callback(ev,(e.pageX - ev.x_start + e.pageY - ev.y_start));
					}
					$this.css({
						"left" : ev.x_move,
						"top" : ev.y_move
					});
				}).on("mouseup.dragMt",function(e){
					ev.x_end = e.pageX;
					ev.y_end = e.pageY;
					if(setting.up_callback != null){
						setting.up_callback(ev);
					}
					$(document).off("mousemove.dragMt mouseup.dragMt");
				});

			});
		});
	}
})(jQuery);

/**
*   弹窗插件 by mantou
*   弹窗的窗口，对象必须是ID,关闭按钮的class = close
*   页面里面必须有蒙版层 
    <!--蒙版层--> 
    class:showWindow-background
*/
;(function($) {
    $.fn.showWindow = function(setting) {
        var defaults = {
                id: null, //弹窗ID
                speed: 200, //显示速度
                before: null, //弹窗前执行前的函数，return $弹窗，$蒙层
                callback: null, //弹窗后，执行回调函数
                timecolse: null, // 一定时间后，自动关闭 
                closeBack : null //关闭回调函数
            }
            //如果setting为空，就取default的值
        var setting = $.extend(defaults, setting);
        this.each(function() {
            var $this = $(this);
            //插件实现代码 
            if (setting.id == null) {
                alert("showWindow插件必须填入一个name参数，且必须是ID!");
                return
            }
            var timestamp=new Date().getTime();
            var $shtml = $('<div class="showWindow-background" style="position:fixed; background:rgba(0,0,0,.7); opacity:0.7; filter:alpha(opacity=70); -moz-opacity:0.7; width:100%; height:100%; top:0; z-index:10000; display:none;"></div>');
            if(!$(".showWindow-background")[0])$("body").append($shtml);
            var box = "#" + setting.id;
            var speed = setting.speed;
            var $loginBox = $(box);
            $loginBox.css("z-index",11000);
            $this.on('click',function() {
				var $fixedBox = $(".showWindow-background");
                if (setting.before != null) {
                    setting.before($loginBox, $this);
                };

                $fixedBox.fadeIn(speed, function() {
                    if (setting.callback != null) {
                        setting.callback($loginBox,$this);
                    };
                });

                if (setting.timecolse != null) {
                    setTimeout(function() {
                        $loginBox.fadeOut(speed);
                    }, setting.timecolse);
                } else {
                    $loginBox.center().fadeIn(speed).find(".close").off("click").on("click", function(e) {
                    	e.stopPropagation();
                        var $thisbtn = $(this);
                        $thisbtn.closest(box).fadeOut(speed, function() {
                            //$thisbtn.off("click");
                            $fixedBox.fadeOut(speed,function(){
								if (setting.closeBack != null) {
									setting.closeBack($loginBox, $this);
								}
                            });
                        });
                    });
                };

                //点击背景，关闭弹窗
                $fixedBox.on('click', function(event) {
                	event.stopPropagation();
                	$loginBox.find(".close").trigger('click');
                });

            });
        });
    }
})(jQuery);

/**
 * 提示的弹窗 ,
 * str:提示的字符串
 * color:字体的颜色，有4个值：green，yellow，red，default, loading
 * t:显示的时间，如果不传值，不自动关闭 t可以是always 表示不关闭
 *	返回一个对象， obj.close() 关闭弹窗 
 */
;(function($) {
	$.popup = function(setting) {
		var defaults = {
				title:'系统提示',
				h2:'',
				str2 : '',
                str: '', //弹窗文字
                icon : '', //默认标记 有4个值：success，warning，danger，loading
                time : null, //自动关闭,  如果有值，一定时间会自动关闭
                clickback : false ,//点击按钮的回调函数 return :mark,$da
                closeback : false, //关闭时的回调函数  return :$da
                bgshow : true, //是否要显示半透明的黑色背景？
                bgColor: '#000',// 背景黑色 和白色
                fadetime : 500, //渐变动画时间
                showbtn : 1, //是否显示按钮 false,1,2
                width: 300, //弹窗宽度
                height: 160, //弹窗高度
                drag : false, //是否可拖动
                close: true //是否要点击背景关闭？
        }
        //如果setting为空，就取default的值
        var setting = $.extend(defaults, setting);

	    var da = "autowindow_"+new Date().getTime();
		var c = "#666";
		var $da = null;

		//有背景弹窗
		if(setting.bgshow && !$("#autowindow_bg")[0]){
			$("body").append('<div id="autowindow_bg" style="position:fixed; z-index:99999; background:'+setting.color+'; width:100%; height:100%; top:0; left:0; filter:alpha(opacity=70); -moz-opacity:0.7; -khtml-opacity: 0.7; opacity: 0.7; "></div>');
		}

		//关闭弹窗
		var closeDa = function(){
			if(setting.closeback){
				setting.closeback($da);
			}
			$da.fadeOut(setting.fadetime,function(){
				$da.remove();
				if($(".autowindow_always").length == 0 && $("#autowindow_bg")[0]){
					$("#autowindow_bg").hide();
				}

			});
		};

		if($("#autowindow_bg").is(':hidden')){
			$("#autowindow_bg").show();
		}

		if(setting.close){
			$("#autowindow_bg").off('click').on('click', function(event) {
				closeDa();
			});
		}
		
		//副标题设置
		if(setting.h2 != ""){
			setting.h2='<h2 style="color:#333; font-size:14px; text-align:center; padding:10px 0;">'+setting.h2+'</h2>';
		}
		//弹窗图标
		if(setting.icon != ""){
			setting.height = setting.height+20;
			setting.icon = '<i class="autowindow_ico '+setting.icon+'"></i>';
		}
		//弹窗默认文本设置
		if(setting.str != ""){
			setting.str=setting.icon+'<p style="color:#333333; padding:10px 0; font-size:14px;">'+setting.str+'</p>';
		}
		//副标题对应的str2 与副标题一起使用
		if(setting.str2 != ""){
			setting.str2='<p style="color:#999; font-size:12px; text-align:center; padding:10px 0;">'+setting.str2+'</p>';
		}

		//如果高度是outo时
		if(setting.height == "auto"){
			setting.height = 'auto'//(setting.str.length*14/setting.width)*14 + 120;
			//console.log(setting.height);
			//var heistr = 'min-height:'+setting.height+'px'
			var heistr = 'height:auto;'
		}else{
			var heistr = 'height:'+setting.height+'px'
		}

		//显示的弹窗
		var tpls = ' <div  id="'+da+'" class="autowindow_always" style="'+(setting.drag?'cursor: move;':'')+'position:fixed; background:#fff; z-index:100000; width:'+setting.width+'px; '+heistr+';margin-left:-'+setting.width/2+'px; margin-top:-'+setting.height/2+'px; left:50%; top:50%; box-shadow:0 0 10px rgba(0,0,0,0.3); text-align:center;border-radius:2px;overflow: hidden;white-space: normal;">\
					    <!--<a class="autowindow_always_del '+da+'_del" href="javascript:;" style="position:absolute; top:0px; right:5px;"></a>-->\
					    <h1 style="height:35px; line-height:35px; font-size:16px; color:#fff; text-align:center; background:#656d78;">'+setting.title+'</h1>\
					    <div style="margin:20px 10px 10px 10px;">'+setting.h2+setting.str+setting.str2+'</div>';
		if( setting.showbtn == false){
			var tpl = tpls+'<div></div>';
			
		}else if(setting.showbtn == 1){
			var tpl = tpls + '<a style="background:#0393dc; color:#fff;  width:100px; height:30px; line-height:30px; text-align:center; margin:0 10px 20px 10px; display: inline-block;border-radius:2px;" href="javascript:void(0)" class="autowindow_btn_yes '+da+'_del doyes">确定</a></div>\
					    </div>';
		}else{
			var tpl = tpls + '<a style="display:inline-block; color:#666666; background:#dddddd; width:100px; height:30px; line-height:30px; text-align:center; margin:0 10px 20px 10px;border-radius:2px;" href="javascript:void(0)" class="autowindow_btn_del '+da+'_del">取消</a>\
					    <a style="background:#0393dc; color:#fff;  width:100px; height:30px; line-height:30px; text-align:center; margin:0 10px 20px 10px; display: inline-block;border-radius:2px;" href="javascript:void(0)" class="autowindow_btn_yes '+da+'_del doyes">确定</a></div>\
					    </div>';
		};
		$("body").append(tpl);
		$da = $("#"+da);
		$("."+da+"_del").off("click").on("click",function(e){
			closeDa();
			if(e.currentTarget.className.indexOf("doyes") != -1){
				if(setting.clickback){
					setting.clickback(true,$da);
				}
				//return true;
			}else{
				//return false;
				if(setting.clickback){
					setting.clickback(false,$da);
				}
			}
		});
		//自动关闭弹窗
		var autoClose = function(){
			if(setting.time != null && setting.time != "always"){
				setTimeout(function(){
					closeDa();
				},setting.time);
			}
		};

		autoClose();

		//支持拖动
		if(setting.drag){
			$da.dragMt();
		}

		//返回一个对象
		var data = {};
		//关闭弹窗
		data.close = function(){
			closeDa();
		};
		//关闭所有弹窗
		data.closeAll = function(){
			var $p = $(".autowindow_always");
			$p.fadeOut(setting.fadetime,function(){
				$p.remove();
			});
			if(setting.closeback){
				setting.closeback($da);
			}
		};
		return data;
	}
})(jQuery);


///气泡提示
$(function(){
    $(document).on("mouseenter",".mtui-tips-info",function(){
        ////console.log(232);
        var $this = $(this);
        var info = $this.attr("data-info");

        if(info == ""){
            return false;   
        }
        
        $('<span class="tips_info_box" style=" background:#fff; font-size:12px; padding:2px 5px; border-radius:2px; box-shadow:0 0 5px #777777; position: absolute; z-index:20000;">'+info+'</span>').appendTo("body");
        var $tips_info_box   = $(".tips_info_box");
        $(document).off("mousemove.tips_info").on("mousemove.tips_info",function(e){
            $tips_info_box.css({
                "left" :　e.pageX+15,
                "top" : e.pageY-30
            });
        });
    }).on("mouseout",function(e){
        $(".tips_info_box").remove();
        $(document).off("mousemove.tips_info");
    }); 
});

/**
 * * 图片查看器 - 2015/06/30 馒头
 * @return {[type]} [description]
 * css：
 *
    .show-max-pic{ width:100%; height:100%; position:fixed; z-index:20000; top:0; left:0; display:none; background:url(../images/loading.gif) no-repeat center;}
    .show-max-pic .main{ background:#FFF;}
    .show-max-pic a.btn{ width:30px; height:80px; background-image:url(../images/bb_30.png); display:block; position:absolute; top:50%; margin-top:-40px; text-align:center; line-height:95px; border-radius:5px; transition:0.3s;}
    .show-max-pic a.btn:hover{ background-color:#000;}
    .show-max-pic a.prev{ left:-30px;}
    .show-max-pic a.next{ right:-30px;}
    .show-max-pic a.close{ width:40px; height:40px; display:block; position:absolute; right:-40px; top:0; background:#000;}
    .showMaxPicBox_main{ position:absolute; box-shadow:0 0 10px #000000; z-index:100;}
    .showMaxPicBox_main img{ width:100%; height:100%;}
    .closeShowMaxPicBox{ width:100%; height:100%; z-index:0; position:absolute; top:0; left:0;}
 * 
 * HTML ：
 *
 * img div
 *
 *  <img class="imgs" src="a.jpg" _src="b.jpg" />
 * 
 * 弹窗
//如果外层后 show-max-pic-box 包裹 ，就有切换
    $(".imgs").showMaxPicMt();
 */
;(function($) {
    $.fn.showMaxPicMt = function(settings) {
        var defaults = $.extend({
            callback : null //回调函数
        }, settings || {});
        var setting = $.extend(defaults, setting);

        var speed = 300;
        //主函数
        var $this = $(this);
        var className = $this[0].className;

        //设置num
        $this.each(function(index, el) {
        	$(this).data("num",(index));
        });

        //父元素 ul
        var $parentUl = null;

        var size = {
            rwidth : null,
            rheight : null,
            src : null
        };
        var date = new Date().getTime();
        var shtml = '<div class="show-max-pic" id="showMaxPicBox_'+date+'">\
                        <div class="showMaxPicBox_main" id="showMaxPicBox_main_'+date+'">\
                            <a href="javascript:void(0)" class="del-popup close closeShowMaxPic" id="closeShowMaxPic_'+date+'"><i class="iconfont icon-icon13" style=" font-size: 20px; padding: 10px; color: #fff;"></i></a>\
                            <img src="">\
                        </div>\
                        <div id="closeShowMaxPicBox_'+date+'"></div>\
                    </div>\
                    <div class="show-max-pic-fixedBox" style="position:fixed; display:none; z-index:10000; background:#000; width:100%; height:100%; top:0; left:0; filter:alpha(opacity=70); -moz-opacity:0.7; -khtml-opacity: 0.7; opacity: 0.7; "></div>';
        $("body").append(shtml);

        var win_width = $(window).width();
        var win_height = $(window).height();  
        var $fixedBox = $(".show-max-pic-fixedBox"); //蒙版层
        var $showMaxPicBox = $("#showMaxPicBox_"+date); //弹窗
        var $showMaxPicBox_main = $showMaxPicBox.find("#showMaxPicBox_main_"+date); //主图的框

        //获取图片的真实尺寸 _src
        var getRealSize = function($img){
            ////console.log($img)
            //console.log(num);
            var imgSrc = $img.attr("_src");
            var img = new Image();
            img.src = imgSrc;
            if (img.complete) {
                size.rwidth = img.width;   
                size.rheight = img.height;
                size.src = img.src;
                //console.log("图片加载完成走这里...");
            } else {
                $("<img/>").attr("src",imgSrc).load(function() {
                    size.rwidth = this.width;   
                    size.rheight = this.height;
                    size.src = this.src;
                });
            };
        };
        
        //重置大小后-设置弹窗的尺寸
        var reSize = function(pic){
            $showMaxPicBox_main.css({
                "left" : (win_width - pic.width)/2,
                "top" : (win_height - pic.height)/2,
                "width" : pic.width,
                "height" : pic.height
            }); 
        };
        
        //数据等待 - 刷新数据
        var ifExist = function(){
            if(size.rwidth == null){
                var timeMark = setTimeout(function(){
                    ifExist();
                },500); //0.5秒检测一次
            }
            else{
                //接收到返回的数据
                ////console.log(size);
                var $img = $showMaxPicBox_main.find("img");
                var pic = {
                    width : null,
                    height : null 
                };
                
                if( size.rwidth >= (win_width - 100) && size.rheight < win_height){
                    ////console.log("仅宽度超出");
                    pic.width = win_width - 100;
                    pic.height = pic.width*size.rheight/size.rwidth;
                }
                else if( size.rheight >= (win_height - 100) && size.rwidth < win_width){
                    ////console.log("仅高度超出");
                    pic.height = win_height - 100;
                    pic.width = pic.height*size.rwidth/size.rheight;
                }else if( size.rheight >= win_height && size.rwidth >= win_width){
                    ////console.log("都超出");
                    pic.height = win_height - 100;
                    pic.width = pic.height*size.rwidth/size.rheight;
                    //如果缩放后宽度还超出，再缩100
                    while(pic.width >= win_width){
                        pic.height = pic.height - 100;
                        pic.width = pic.height*size.rwidth/size.rheight;    
                    };
                }
                else{
                    ////console.log("都没超出");    
                    pic.height = size.rheight;
                    pic.width = size.rwidth;
                    //什么都不用变
                }

                reSize(pic);
                $img.attr("src",size.src);
                $showMaxPicBox_main.fadeIn();
                
           }
        };

        //切换图片
        var changeMaxPicSrc = function(dir,$thisimg){
            var $imgs = $parentUl.find('.'+className);
            var num = $thisimg.data("num");
            //图片切换
            if(dir == "prev"){
            	num--;
                if(num < 0){
                    $.popup({
                    	str:'已经是第一张了',
                    	time:2000
                    });
                    return false;
                }
            }
            else {
            	num++;
                if(num > $imgs.length - 1){
                    //alert("已经是最后一张了");
                    $.popup({
                    	str:'已经是最后一张了',
                    	time:2000
                    });
                    return false;
                }   
            }

            var $img = $imgs.eq(num);
            size.src = $img.attr("_src");
            if(size.src == "" || size.src==undefined){
            	$.popup({
                	str:'已经是最后一张了',
                	time:2000
                });
                return false;
            }
            $showMaxPicBox_main.fadeOut(0);
            size.rheight = null;
            size.rwidth = null;
            getRealSize($img);
            ifExist();  
        };
        
        //关闭窗口
        $("#closeShowMaxPic_"+date+",.show-max-pic").off("click").on("click",function(){
        	if($(this)[0].className.indexOf("show-max-pic") != -1){
        		if(!$(this).find(".showMaxPicBox_main").is(':hidden')){
        			return;
        		}
        	}
            $showMaxPicBox.fadeOut(0);
            $fixedBox.fadeOut(0);    
        });

        //上一张
        $(document).on("click",("#showMaxPicBox_main_prev_"+date),function(e){
            e.stopPropagation();
			var  url = $(this).siblings('img').attr("src");
			url = url.replace(window.location.origin,"");
            changeMaxPicSrc("prev",$("."+className+"[_src='"+url+"']"));
        });
        
        //下一张
        $(document).on("click",("#showMaxPicBox_main_next_"+date),function(e){
            e.stopPropagation();
			var  url = $(this).siblings('img').attr("src");
			url = url.replace(window.location.origin,"");
            changeMaxPicSrc("next",$("."+className+"[_src='"+url+"']"));
        });
        
        //改变窗口大小
        $(window).resize(function(){
            win_width = $(window).width();
            win_height = $(window).height();
            ifExist();
        });

        $parentUl = $this.closest('.show-max-pic-box');

        if($parentUl != undefined && $parentUl.find('.'+className).length>1 && !$("#showMaxPicBox_main_prev_"+date)[0]){
        	//添加next ,prev 按钮
        	$showMaxPicBox_main.append('<a href="javascript:void(0)" class="prev btns" id="showMaxPicBox_main_prev_'+date+'"><i class="iconfont icon-zuojiantou"></i></a>\
                     <a href="javascript:void(0)" class="next btns" id="showMaxPicBox_main_next_'+date+'"><i class="iconfont icon-zhankaijiantou"></i></a>');
        }else{
        	$showMaxPicBox_main.find(".prev,.next").remove();
        }
        
        //查看大图 - 启动循环
        var showMaxPic = function(){
            //console.log($this[0].className);
            var $body = $("body");
            $(document).on('click',('.'+className), function() {
                //如果外层后 show-max-pic-box 包裹 ，就有切换

                if($(this).attr("_src") == "" || $(this).attr("_src")==undefined){
                	return;
                }

                //显示弹窗
                $fixedBox.fadeIn(0);
                $showMaxPicBox.fadeIn(speed);
                //启动函数
                size.rwidth = null;
                size.rheight = null;
                getRealSize($(this));
                $showMaxPicBox_main.fadeOut(0);
                ifExist(); //数据等待
            });
        };showMaxPic();

    };
})(jQuery);

/**
*	对象在赋值的时候，只是转移指针。这里用cloneObj对象的方法
*/ 
function deepClone(obj){  
    var o;  
    switch(typeof obj){  
    case 'undefined': break;  
    case 'string'   : o = obj + '';break;  
    case 'number'   : o = obj - 0;break;  
    case 'boolean'  : o = obj;break;  
    case 'object'   :  
        if(obj === null){  
            o = null;  
        }else{  
            if(obj instanceof Array){  
                o = [];  
                for(var i = 0, len = obj.length; i < len; i++){  
                    o.push(deepClone(obj[i]));  
                }  
            }else{  
                o = {};  
                for(var k in obj){  
                    o[k] = deepClone(obj[k]);  
                }  
            }  
        }  
        break;  
    default:          
        o = obj;break;  
    }  
    return o;     
} 