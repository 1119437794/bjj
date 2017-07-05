var mtui = {};

mtui.$doc = $(document);
/**
*	获取url的值
*/
mtui.getQueryString = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]); return null;
};
mtui.parseUrl = function() {
    var args = new Object();
    var query = location.search.substring(1);
    var pairs = query.split("&");
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('=');
        if (pos == -1) continue;
        var argname = pairs[i].substring(0, pos);
        var value = pairs[i].substring(pos + 1);
        value = decodeURIComponent(value);
        args[argname] = value;
    }
    return args;
};

/**
*	checkbox
*/
mtui.mtCheckBox = function(){
	//checkbox 选框
	$(document).on('change',":checkbox", function(event) {
		var $this = $(this);
		//选中了
		if($this.is(':checked')){
			$this.closest('.mt-checkbox').addClass('mt-checkbox-active');
		}else{
			$this.closest('.mt-checkbox').removeClass('mt-checkbox-active');
		}
	});
};

/**
*	select
*/
mtui.select = function(){
	if(!$(".mt-select-new")[0]) return;
	var speed = 200;
	var maxHeight = 260;
	mtui.$doc.on('click', '.mt-select-new', function(e) {
		var $this = $(this);

		//如果是mt-select-disabled
		if($this[0].className.indexOf("mt-select-disabled") != -1){
			return
		}

		var $thisUl = $(this).find(".mt-select-box");

		//设置value
		if(e.target.className.indexOf("option") != -1){
			$(this).find(".mt-select-title").html(e.target.outerText).attr("data-val",$(e.target.outerHTML).attr("data-val"));
		}else{
			//return;
			//console.log(e.target.className);
			if(e.target.className.indexOf("mt-select-title") == -1 && e.target.className.indexOf("icon-xia") == -1 && e.target.className.indexOf("mt-select-new")){
				return
			}
		}

		//如果有其他下拉框，先关闭其他下拉框
		if($this[0].className.indexOf("mt-selected") == -1){
			if($(".mt-selected").length != 0){
				$(".mt-selected").trigger('click');
			}
		}

		//设置参数
		if($thisUl.data("height") == undefined){
			var hei = $thisUl.height()+12;
			$thisUl.data("height",hei);
			// $thisUl.height(0);
			//解决谷歌因为滚动条留个空白的BUG
			if(maxHeight > hei){
				$thisUl.css("overflow","hidden");
			}
			//初始化mt-select的宽度
			$this.width($this.width());
		}

		//执行动画
		if($thisUl.is(":hidden")){

			//清空列表中的input
			if($this.find(".mt-select-add")[0]){
				$this.find(".mt-select-add .mt-add-select-val").val("");
			}
			$this.addClass('mt-selected');
			$thisUl.css({
				'z-index':9999
			}).slideDown(speed);
		}else{
			$this.removeClass('mt-selected');
			$thisUl.slideUp(speed,function(){
				$thisUl.css({
					'z-index':'inherit'
				});
			});
		}

	}).on('click', '.mt-add-select-btn', function(e) {//绑定select中的 add方法
		var $this = $(this);
		var $input = $this.siblings(".mt-add-select-val");
		var $selectBox = $(this).closest('.mt-select-box');
		var $addDiv = $this.parent();
		var $li = $addDiv.prev(".option");
		var val = $input.val();
		var hei = $selectBox.data("height")+$li.height();

		//设置高度
		if(hei <= maxHeight){
			$selectBox.css('height',hei);
			$selectBox.data("height",hei);
		}else{
			$selectBox.css({
				height:maxHeight,
				overflow:'auto'
			});
		}

		//设置新的li标签
		$input.val("");
		$addDiv.before('<li class="option" data-val="'+val+'">'+val+'</li>');
	});
};


/**
*	表单验证方法
*/
mtui.validate_fun = function(type,value){
	//对值进行空格剔除
	var val=value.replace(/(^\s*)|(\s*$)/g, "");
	//表单验证
	var validateRegExp = {
	    decmal: "^([+-]?)\\d*\\.\\d+$",// 浮点数
	    decmal1: "^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*$",// 正浮点数
	    decmal2: "^-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*)$",// 负浮点数
	    decmal3: "^-?([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0)$",// 浮点数
	    decmal4: "^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0$",// 非负浮点数（正浮点数 + 0）
	    decmal5: "^(-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*))|0?.0+|0$",// 非正浮点数（负浮点数 +0
	    intege: "^-?[1-9]\\d*$",// 整数
	    intege1: "^[1-9]\\d*$", // 正整数
	    intege2: "^-[1-9]\\d*$",// 负整数
	    num: "^([+-]?)\\d*\\.?\\d+$",// 数字
	    num1: "^[1-9]\\d*|0$",// 正数（正整数 + 0）
	    num2: "^-[1-9]\\d*|0$",// 负数（负整数 + 0）
	    ascii: "^[\\x00-\\xFF]+$",// 仅ACSII字符
	    chinese: "^[\\u4e00-\\u9fa5]+$",// 仅中文
	    color: "^[a-fA-F0-9]{6}$",// 颜色
	    date: "^\\d{4}(\\-|\\/|\.)\\d{1,2}\\1\\d{1,2}$",// 日期
	    email: "^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$",// 邮件
	    idcard: "^[1-9]([0-9]{14}|[0-9]{17})$",// 身份证
	    ip4: "^(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)$",// ip地址
	    letter: "^[A-Za-z]+$",// 字母
	    letter_l: "^[a-z]+$",// 小写字母
	    letter_u: "^[A-Z]+$",// 大写字母
	    mobile: "^0?(13|15|18|14|17)[0-9]{9}$",// 手机
	    notempty: "^\\S",// 非空
	    password: "^[A-Za-z0-9_]{3,20}$",// 密码
	    rgpassword: "^[A-Za-z0-9_]{6,20}$",// 注册密码
	    fullNumber: "^[0-9]+$",// 数字
	    picture: "(.*)\\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$",// 图片
	    qq: "^[1-9]*[1-9][0-9]*$",// QQ号码
	    rar: "(.*)\\.(rar|zip|7zip|tgz)$",// 压缩文件
	    tel: "^[0-9\-()（）]{7,18}$",// 电话号码的函数(包括验证国内区号,国际区号,分机号)
	    url: "^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&=]*)?$",// url
	    username: "^[a-zA-Z0-9_\.]{3,18}\s*$",// 户名
	    deptname: "^[A-Za-z0-9_()（）\\-\\u4e00-\\u9fa5]+$",// 单位名
	    zipcode: "^\\d{6}$",// 邮编
	    realname: "^[A-Za-z\\u4e00-\\u9fa5]+$",// 真实姓名
	    companyname: "^[A-Za-z0-9_()（）\\-\\u4e00-\\u9fa5]+$",
	    companyaddr: "^[A-Za-z0-9_()（）\\#\\-\\u4e00-\\u9fa5]+$",
	    companysite: "^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&#=]*)?$"
	};
	switch(type){
		case "decmal": return RegExp(validateRegExp.decmal).test(val); break;// 浮点数
		case "decmal1": return RegExp(validateRegExp.decmal1).test(val); break;// 正浮点数
		case "decmal2": return RegExp(validateRegExp.decmal2).test(val); break;// 负浮点数
		case "decmal3": return RegExp(validateRegExp.decmal3).test(val); break;// 浮点数
		case "decmal4": return RegExp(validateRegExp.decmal4).test(val); break;// 非负浮点数（正浮点数 + 0）
		case "decmal5": return RegExp(validateRegExp.decmal5).test(val); break;// 非正浮点数（负浮点数 +0
		case "intege": return RegExp(validateRegExp.intege).test(val); break;// 整数
		case "intege1": return RegExp(validateRegExp.intege1).test(val); break; // 正整数
		case "intege2": return RegExp(validateRegExp.intege2).test(val); break;// 负整数
		case "num": return RegExp(validateRegExp.num).test(val); break;// 数字
		case "num1": return RegExp(validateRegExp.num1).test(val); break;// 正数（正整数 + 0）
		case "num2": return RegExp(validateRegExp.num2).test(val); break;// 负数（负整数 + 0）
		case "ascii": return RegExp(validateRegExp.ascii).test(val); break;// 仅ACSII字符
		case "chinese": return RegExp(validateRegExp.chinese).test(val); break;// 仅中文
		case "color": return RegExp(validateRegExp.color).test(val); break;// 颜色
		case "date": return RegExp(validateRegExp.date).test(val); break;// 日期
		case "email": return RegExp(validateRegExp.email).test(val); break;// 邮件
		case "idcard": return RegExp(validateRegExp.idcard).test(val); break;// 身份证
		case "ip4": return RegExp(validateRegExp.ip4).test(val); break;// ip地址
		case "letter": return RegExp(validateRegExp.letter).test(val); break;// 字母
		case "letter_l": return RegExp(validateRegExp.letter_l).test(val); break;// 小写字母
		case "letter_u": return RegExp(validateRegExp.letter_u).test(val); break;// 大写字母
		case "mobile": return RegExp(validateRegExp.mobile).test(val); break;// 手机
		case "notempty": return RegExp(validateRegExp.notempty).test(val); break;// 非空
		case "password": return RegExp(validateRegExp.password).test(val); break;// 密码
		case "rgpassword": return RegExp(validateRegExp.rgpassword).test(val); break;// 密码
		case "fullNumber": return RegExp(validateRegExp.fullNumber).test(val); break;// 数字
		case "picture": return RegExp(validateRegExp.picture).test(val); break;// 图片
		case "qq": return RegExp(validateRegExp.qq).test(val); break;// QQ号码
		case "rar": return RegExp(validateRegExp.rar).test(val); break;// 压缩文件
		case "tel": return RegExp(validateRegExp.tel).test(val); break;// 电话号码的函数(包括验证国内区号,国际区号,分机号)
		case "url": return RegExp(validateRegExp.url).test(val); break;// url
		case "username": return RegExp(validateRegExp.username).test(val); break;// 户名
		case "deptname": return RegExp(validateRegExp.deptname).test(val); break;// 单位名
		case "zipcode": return RegExp(validateRegExp.zipcode).test(val); break;// 邮编
		case "realname": return RegExp(validateRegExp.realname).test(val); break;// 真实姓名
		case "companyname": return RegExp(validateRegExp.companyname).test(val); break;
		case "companyaddr": return RegExp(validateRegExp.companyaddr).test(val); break;
		case "companysite": return RegExp(validateRegExp.companysite).test(val); break;
	}
};

/**
*	表单验证
*/
mtui.autoValidate = function(){
	//表单验证
	$(document).on("keyup focusin focusout",".s-validate",function(e) {
		var $this = $(this);
		//console.log("====>",$this.attr("data-validate"));
		var data = {
			tips : $this.attr("placeholder"),
			validate : eval( "({" + $this.data("validate") + "})" ),
			errorinfo : "", //错误提示
			left : $this.position().left,
			top : $this.position().top + $this.height() + 3,
			wid : $this.width(),
			zIndex : 20000,
			$field : $this.parent()
		};
		//错误提示
		for(i in data.validate){
			if(!mtui.validate_fun(i,$this.val())){
				//console.log(data.validate[i]);
				data.errorinfo+= (data.validate[i]+"#");
			}
		};//END for

		//如果不能为空，就只显示一个不为空的字
		if(data.errorinfo.indexOf('不能为空') != -1){
			var arr = data.errorinfo.split("#");
			console.log(arr);
			data.errorinfo = "";
			for(var i=0; i<arr.length; i++){
				if(arr[i].indexOf('不能为空') != -1){
					data.errorinfo += arr[i];
				}
			}
		}

		//console.log(e.type); 如果是 focusin 不显示不能为空
		if(e.type == 'focusin' && data.errorinfo.indexOf('不能为空') != -1){
			data.errorinfo = "";
		}
		data.errorinfo = data.errorinfo.replace(/\#/g,"");

		if(data.errorinfo != "" && !data.$field.find(".s-validate-error")[0]){ // 第一次显示
			$this.attr("data-validate-error","error");
			data.$field.append('<div class="s-validate-error" style=" width:'+data.wid+'px; top:'+data.top+'px; left:'+data.left+'px; "><i class="s-ico s-ico-arw"></i><i class="s-ico s-ico-ix"></i> '+data.errorinfo+'</div>');
			//data.$field.find(".s-validate-correct").remove();
		}else if(data.errorinfo != "" && data.$field.find(".s-validate-error")[0]){ //第二次显示
			data.$field.find(".s-validate-error").css("left",data.left+"px").html(data.errorinfo);
		}else if( data.errorinfo == "" && !data.$field.find(".s-validate-correct")[0] ){ //删除
			$this.attr("data-validate-error","true");
			data.$field.find(".s-validate-error").remove();
			//data.$field.append('<div class="s-validate-correct" style="text-align:left; position: absolute; top:'+data.top+'px; left:'+data.left+'px; width:'+data.wid+'px; "><i class="s-ico s-ico-iv"></i></div>');	
		}
		
		//}else{
			
			//气泡提示信息
			//data.$field.append('<div class="s-validate-info" style="text-align:left; position: absolute; color:#ff9c00; font-size:12px;width:'+data.wid+'px; top:'+data.top+'px; left:'+data.left+'px; ">'+data.tips+'</div>');	
			//data.$field.find(".s-validate-error").remove();
		//}
		
	}).on("submit",".s-form",function(){
		//提交表单的时候，验证数据
		$(this).find(".s-validate").trigger("focusout");
		if($(this).find(".s-validate-error")[0]){
			return false;
		}
	}).on('click', '.submit', function(event) {
		$(this).closest('.s-form').find(".s-validate").trigger("focusout");
	});
};
/**
 * 自动计算弹出框位置，居中
 * @param $dom
 */
function self_resize($dom){
    var left = ($(window).width() - $dom.width()) / 2;
    var top = ($(window).height() - $dom.height()) / 2;
    $dom.css({position: "fixed", left: left + 'px', top: top + 'px'});

}
/**
* 判断是否登录
*/
mtui.judgeLogin = function(){
	if(!$("#")[0]){
        $("#loginBtn").trigger("click");
        return false;
    }else{
    	return true;
    }
};
/**
* 点击空白区域
*/
mtui.clickblank = function(){
    //点击空白区域
    mtui.$doc.off("click.mtClickblank").on('click.mtClickblank', function(e) {
        //收缩下拉
        if(!$(e.target).closest('.mt-selected')[0]){
            $('.mt-selected').trigger('click'); 
        }
    });
};
$(function(){
	mtui.select();

	mtui.clickblank();
});