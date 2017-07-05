// 所有模块都通过 define 来定义

define(function(require, exports, module) {

	var zrender = require('../zrender/zrender');

	var zr;
	var Circle, Rectangle, Line, Text, Group, Polygon;
	var color, width, height;
	var event;
	//默认正方形的宽度
	var rect_width = 20;
	//默认圆形的半径
	var circle_radius = 10;
	//所有图形的默认zlevel
	var zlevel = 100;
	//默认各层之间的半径差（依赖于画布的高度，同时留了100px的空白。默认设置100，初始化的时候会做修改。）
	var radius = 100;
	// key:公司名，value：node对象
	var main_data;
	// key: category, value:后台传递的node对象
	var category_data;
	// zr图的圆心坐标
	var center_coordinate;
	// 鼠标down时候的坐标
	var zr_mouse_down_coordinate;
	// 鼠标up时候的坐标
	var zr_mouse_up_coordinate;
	// zr图里面的所有zrender节点对象，包括circle，正方形
	var zr_nodes;
	// zr图里面的所有zrender箭头对象，包括line和多边形
	var zr_arrows;
	//////////////////////////////////////////
	// 是否是在图谱的节点上点击
	var zr_node_click;
	// 是否在箭头上面点击
	var zr_arrow_click;
	// 是否高亮显示当前节点，并且不响应其他节点的mouse over事件。
	// 在鼠标click节点的时候设置为true，鼠标click空白图谱的时候，设置为false。
	var zr_node_highlight_lock;
	// 字体显示 显示为true 隐藏为false
	var word_show_flag = true;
	// 点击节点出现扩展按钮、信息按钮
	var node_extend, node_info
		//透明度
	var opacity_hidden = 0;
	var opacity_show = 1;
	var opacity_arrow = 0.25;
	var dyMapWid = $('#dyMapMain').width();
	var checked = true;
	////////////////////////公用对象
	//坐标对象
	var Coordinate = function(x, y) {
		this.x = x;
		this.y = y;

		this.equals = function(new_coordinate) {
			if (new_coordinate != undefined && new_coordinate != null && new_coordinate.x == this.x && new_coordinate.y == y) {
				return true;
			}
			return false;
		}
	}

	/**
	 * 箭头对象
	 */
	var Arrow = function(line, polygon) {
		this.line = line;
		this.polygon = polygon;
	}

	/**
	 * 节点对象
	 * @param name 公司名称
	 * @param symbol 图形：圆形，正方形等等
	 * @param color 节点颜色
	 * @param ins 哪些公司指到本公司
	 * @param outs 指向哪些公司
	 * @param zr_shape zrender的对象
	 * @param category 一级、二级、三级关系
	 * @param addflag 是否是手工添加的节点
	 */
	var Node = function(name, symbol, color, ins, outs, zr_shape, category, addflag) {
		//文字显示位置
		this.textPosition = 'bottom';
		//文字颜色
		this.textColor = '#d9d9d9';
		// this.textColor = '#000';
		//中心点宽度
		this.width = 40;
		//中心点高度
		this.hight = 40;
		//
		this.name = name;
		this.symbol = symbol;
		this.color = color;
		this.ins = ins;
		this.outs = outs;
		this.zr_shape = zr_shape;
		this.category = category;
		this.addflag = addflag;
	}

	/**
	 * 关系对象
	 * @param name 关系中对应的公司名
	 * @param arrow 关系中对应的箭头对象 @see Arrow
	 * @constructor
	 */
	var Relation = function(name, arrow) {
		this.name = name;
		this.arrow = arrow;
	}

	/**
	 * 初始化zrender的js，以及初始画图
	 * @param init  画图的方法
	 * @param radius 画图的半径
	 */
	function js_init(init, radius) {
		//var start = new Date().getTime()
		zr = zrender.init(document.getElementById('dyMap'));
		//
		Line = require("../zrender/shape/Line");
		Rectangle = require("../zrender/shape/Rectangle");
		Circle = require("../zrender/shape/Circle");
		Text = require("../zrender/shape/Text")
		Polygon = require("../zrender/shape/Polygon")
			//
		Group = require("../zrender/Group");
		//
		color = require("../zrender/tool/color");
		width = Math.ceil(zr.getWidth());
		height = Math.ceil(zr.getHeight());
		//
		event = require("../zrender/tool/event")
			// 涉及到重新计算，所以必须在这儿初始化对象。
		main_data = new Object();
		category_data = new Object();
		zr_nodes = [];
		zr_arrows = [];
		zr_node_click = false;
		zr_arrow_click = false;
		zr_node_highlight_lock = false;
		//
		if (init) {
			init(radius)
		}
		//var end = new Date().getTime()
		//console.log("init time:" + (end - start))
	}

	resize_canvas();
	js_init(init, radius);

	/**
	 * 计算圆坐标，矩形坐标是从左上角算起的。
	 * @param center：圆心坐标
	 * @param radius：圆半径
	 * @param angle：角度
	 */
	function cal_coordinate(center, radius, angle) {
		var new_x = center.x + radius * Math.cos(angle * Math.PI / 180);
		var new_y = center.y + radius * Math.sin(angle * Math.PI / 180);
		var c = new Coordinate(new_x, new_y)
		return c;
	}

	/**
	 * 计算正方形坐标，通过圆心坐标做换算就可以了。目前没有用到
	 * @param circle_coordinate，计算出来的圆心坐标
	 * @param height，正方形高度
	 */
	function cal_rect_coordinate(circle_coordinate, height) {
		circle_coordinate.x -= height / 2;
		circle_coordinate.y -= height / 2;
		return circle_coordinate;
	}

	/**
	 * 计算箭头的旋转角度
	 * @param ang
	 * @param startY 起点的Y坐标
	 * @param endY 终点的Y坐标
	 * @returns {number} 旋转的角度
	 */
	function cal_rotate(ang, startY, endY) {
		var rotate = 0;
		ang = Math.atan(ang);
		if (endY - startY >= 0) {
			rotate = -ang;
		} else {
			rotate = Math.PI - ang;
		}
		return rotate;
	}

	/**
	 * 把后端来的数据结构转换成我们需要的数据结构
	 * 并且进行绘图
	 */
	function init(new_radius) {
		//var start = new Date().getTime()
		init_shapes(new_radius)
		init_links()
		init_zrender()
			//var end = new Date().getTime()
			//console.log("render time:" + (end - start))
	}

	function init_shapes(new_radius) {
		//遍历后台传递过来的节点，按照层级分类。有了每层节点数，才能设置它们的坐标，所以这里需要多循环一次。
		for (var i = 0; i < nodes.length; i++) {
			var category = nodes[i].category;
			if (category_data[category] == undefined || category_data[category] == null) {
				category_data[category] = [];
			}
			category_data[category].push(nodes[i]);
		}

		//console.log(category_data);

		//遍历按层分开的数据，用来初始化节点数据，以及形成节点。
		for (var category = 0; category < level + 1; category++) {
			var background_nodes = category_data[category];
			if (!background_nodes) {
				break;
			}
			var nodes_length = background_nodes.length;
			for (var i = 0; i < nodes_length; i++) {
				var background_node = background_nodes[i];
				var name = background_node.name;
				var symbol = background_node.symbol;
				var color = background_node.color;
				var ins = [];
				var outs = [];
				var zr_shape = null;
				var category = background_node.category;
				var addflag = background_node.addflag;
				var isGetCompany = background_nodes[i].isGetCompany;
				// 画图（节点）
				// 圆心
				if (category == 0) {
					center_coordinate = new Coordinate(width / 2, height / 2)
						//
					var center = create_node(symbol, center_coordinate, color, name, isGetCompany);
					zr.addShape(center)
					zr_nodes.push(center)
					zr_shape = center;
				} else {
					var category_radius;
					if (!new_radius) {
						category_radius = radius * category;
					} else {
						category_radius = new_radius * category;
					}
					var angle = (360 * i) / nodes_length
					var coordinate = cal_coordinate(center_coordinate, category_radius, angle);
					var shape = create_node(symbol, coordinate, color, name, isGetCompany);
					zr.addShape(shape)
					zr_nodes.push(shape)
					zr_shape = shape;
				}
				//
				if (main_data[name] == undefined) {
					main_data[name] = new Node(name, symbol, color, ins, outs, zr_shape, category, addflag);
				} else {
					//console.log("axb")
				}


				// if (MAIN_DATA[name] == undefined) {
				//     MAIN_DATA[name] = new Node(name, symbol, color, ins, outs, zr_shape, category, addflag);
				// }
			}
		}

		serches();
		// console.log(nodes);
		//  console.log(main_data);

	}

	function serches() {

		// $(".search-key").keyup(function(e) {
		// 	if (e.keyCode == 40 || e.keyCode == 38 || e.keyCode == 13) return;
		// 	$(".search-result").show();
		// 	$("#static-risk-result").html("");
		// 	var infos = "";
		// 	var resultarr = [];
		// 	var search_key = $(".search-key").val().trim();
		// 	if (search_key != "") {
		// 		$(".select_del").show();
		// 		$(".select_s").hide();
		// 		$.each(nodes, function(item, items) {
		// 			if (resultarr.length >= 10) {
		// 				return;
		// 			}
		// 			if (items.name.indexOf(search_key) != "-1") {
		// 				if (items.symbol == "rect") {
		// 					infos += " <a href='javascript:void(null)' title=" + items.name + " data='rect' class=''>" + items.name + "</a>"
		// 				} else {
		// 					infos += " <a href='javascript:void(null)' data='people' class=''>" + items.name + "</a>"
		// 				}
		// 				var zr_shape = {
		// 					clicktype: "company"
		// 				}
		// 				items["zr_shape"] = zr_shape;
		// 				resultarr.push(items);
		// 			}
		// 		});
		// 		if (resultarr.length == 0) {
		// 			infos = "<span>无相关关联方，请重新输入</span>";
		// 		}
		// 	} else {
		// 		$(".select_del").hide();
		// 		$(".select_s").show();
		// 	}
		// 	$("#static-risk-result").html(infos);
		// })

		$("#static-risk-result").delegate("a", "click mouseover mouseout ", function(e) {
			var type = e.type;
			if (type == "click") {
				var is_company = $(this).attr("data");
				$(".search-key").val($(this).text());
				$("#static-risk-result").hide();
				var s = {
					target: {
						style: {
							text: $(this).text().trim()
						}
					}
				}
				if (is_company == "rect") {
					node_mouse_click(s, "rect");
				} else {
					node_mouse_click(s, "people");
				}
			} else if (type == "mouseover") {
				$(this).addClass("curre");
			} else if (type == "mouseout") {
				$(this).removeClass("curre");
			}
		});
		$("body").click(function() {
			$("#static-risk-result").hide();
		})
		$(".select_del").click(function() {
			$(".search-key").val("");
			$(".select_del").hide();
			$(".select_s").show();
		})
	}

	$(document).on("keydown", ".search-key", function(e) {
		if ($("#static-risk-result").is(':hidden')) return;
		var $result = $("#static-risk-result"),
			$reslutLen = $("#static-risk-result a").length;
		if (e.keyCode == 40) { //down
			if ($result.find(".curre")[0] && $result.find(".curre").index() + 1 < $reslutLen) {
				$result.find(".curre").removeClass("curre").next("a").addClass("curre");
			} else {
				$result.find("a").eq(0).addClass("curre").siblings("a").removeClass("curre");
			}
		} else if (e.keyCode == 38) { //up
			if ($result.find(".curre")[0]) {
				$result.find(".curre").removeClass("curre").prev("a").addClass("curre");
			} else {
				$result.find("a").eq(0).addClass("curre").siblings("a").removeClass("curre");
			}
		} else if (e.keyCode == 13) {
			$result.find(".curre").trigger("click");
		}
	});

	function init_links() {
		// 遍历links，画出箭头
		for (var i = 0; i < links.length; i++) {
			var source = links[i].source;
			var target = links[i].target;
			if (source != undefined && source != null && target != undefined && target != null) {
				if (main_data[source] == undefined || main_data[target] == undefined) {
					continue;
				}
				var start_node_shape = main_data[source].symbol;
				var start_node = main_data[source].zr_shape;
				var end_node_shape = main_data[source].symbol;
				var end_node = main_data[target].zr_shape;
				var start_coordinate = new Coordinate(start_node.style.x, start_node.style.y);
				if (start_node_shape == "rect") {
					start_coordinate.x += rect_width / 2;
					start_coordinate.y += rect_width / 2;
				}
				var end_coordinate = new Coordinate(end_node.style.x, end_node.style.y);
				//if (end_node_shape == "rect") {
				end_coordinate.x += rect_width / 2;
				end_coordinate.y += rect_width / 2;
				// }
				var addflag = (links[i].addflag == "true");
				var arrow = create_arrow(start_coordinate, end_coordinate, links[i].line == "dotted", addflag)
				zr.addShape(arrow.line)
				zr_arrows.push(arrow.line)
					// 如果不是手动添加的，则把箭头加入进去
				if (!addflag) {
					zr.addShape(arrow.polygon)
					zr_arrows.push(arrow.polygon)
				}
				// 添加到对象的ins, outs这两个数组里面。方便后面做遍历
				main_data[links[i].source].outs.push(new Relation(links[i].target, arrow));
				main_data[links[i].target].ins.push(new Relation(links[i].source, arrow));
			} else {
				if (console && console.log) {
					console.log("Empty data:" + links[i])
				}
			}
		}

	}

	function init_zrender() {
		// 支持平移，不使用自身的缩放
		zr.modLayer(zlevel, {
			panable: true,
			zoomable: false
		});
		// 为zrender添加事件
		zr.on("click", zr_mouse_click);
		zr.on("mousedown", zr_mouse_down)
		zr.on("mouseup", zr_mouse_up)
			// 渲染
		zr.render();
	}

	/**
	 * 按照图形、坐标、颜色创建zrender的节点
	 * @param symbol
	 * @param coordinate
	 * @param color
	 * @returns {*}
	 */
	function create_node(symbol, coordinate, color, text, isGetCompany) {
		var zr_node;
		if (symbol == "rect") {
			zr_node = new Rectangle({
				style: {
					x: coordinate.x - rect_width / 2,
					y: coordinate.y - rect_width / 2,
					width: rect_width,
					height: rect_width,
					radius: 0,
					color: color,
					text: text,
					textPosition: "bottom",
					// textColor: "#d9d9d9"
					textColor: "#000"
				},
				hoverable: false,
				zlevel: zlevel,
				z: 100,
				clickable: true,
				onclick: node_mouse_click,
				onmouseout: chart_recover,
				onmouseover: node_mouse_over,
				clicktype: 'company',
				isCompany: isGetCompany
			})
		} else if (symbol == "circle") {
			zr_node = new Circle({
				style: {
					x: coordinate.x,
					y: coordinate.y,
					r: circle_radius,
					color: color,
					text: text,
					textPosition: "bottom",
					textColor: "#000"
				},
				hoverable: false,
				zlevel: zlevel,
				z: 100,
				clickable: true,
				onclick: node_mouse_click,
				onmouseout: chart_recover,
				onmouseover: node_mouse_over,
				clicktype: 'man',
				isGetCompany: isGetCompany
			})
		} else {
			if (console && console.log) {
				console.log("Unknown symbol:" + category);
			}
		}
		return zr_node;
	}

	/**
	 * 创建箭头图形
	 * @param start 起始点坐标
	 * @param end 结束点坐标
	 * @returns {Arrow} arrow对象，包括zrender的线条对象和zrender的多边形对象。
	 */
	function create_arrow(start, end, dotted, addflag) {
		//
		var line = new Line({
			style: {
				xStart: start.x,
				yStart: start.y,
				xEnd: end.x,
				yEnd: end.y,
				lineWidth: 1,
				strokeColor: "#00bced",
				opacity: opacity_arrow,
			},
			scale: [1, 1, 0, 0],
			z: 10,
			zlevel: zlevel,
			hoverable: false,
			draggable: false,
			clickable: true,
			onclick: arrow_mouse_click,
		});
		if (dotted) {
			line.style.lineType = "dashed"
		}

		if (!addflag) {

			var offset = 10;
			var ang = (end.x - start.x) / (end.y - start.y);

			var rotate = cal_rotate(ang, start.y, end.y);

			var polygon = new Polygon({
				style: {
					pointList: [
						[-5 + end.x, -10 + end.y - offset],
						[0 + end.x, -5 + end.y - offset],
						[5 + end.x, -10 + end.y - offset],
						[0 + end.x, 0 + end.y - offset]
					],
					brushType: 'both',
					color: "#52c2e7",
					opacity: opacity_arrow
				},
				scale: [1, 1, 0, 0],
				zlevel: zlevel,
				z: 10,
				hoverable: false,
				draggable: false,
				rotation: [-rotate, end.x, end.y]
			});
			return new Arrow(line, polygon)
		} else {
			return new Arrow(line, undefined)
		}
	}

	/**
	 * 高亮一度关系
	 * 左边列表联动
	 * @param node_name 当前节点的公司名称
	 */
	function highlight_relation(node_name) {
		var node = main_data[node_name];
		//先删除出现的点
		zr.delShape('ext').delShape('detail');

		var highlight = (node.zr_shape.style.opacity != opacity_hidden);
		// 当前节点
		if (highlight) {
			node.zr_shape.style.opacity = opacity_show;
		}
		if (!word_show_flag) {
			node.zr_shape.style.textColor = "#d9d9d9";
		}
		//
		var in_relations = node.ins;
		var out_relations = node.outs;
		var relations = in_relations.concat(out_relations)
		for (var i = 0; i < relations.length; i++) {
			var relation_name = relations[i].name;
			// zr shape
			var zr_shape = main_data[relation_name].zr_shape;
			var zr_arrow = relations[i].arrow;
			var relation_highlight = (zr_shape.style.opacity != opacity_hidden && zr_arrow.line.style.opacity != opacity_hidden)
			if (relation_highlight) {
				// high light
				zr_shape.style.opacity = opacity_show
				zr_arrow.line.style.opacity = opacity_show;
				zr_arrow.line.style.strokeColor = "#80bb5f";
				// 手动添加的没有箭头
				if (zr_arrow.polygon) {
					zr_arrow.polygon.style.opacity = opacity_show;
					zr_arrow.polygon.style.color = "#80bb5f";
				}
			}
			// 判断是否文字被隐藏了
			if (!word_show_flag) {
				zr_shape.style.textColor = "#d9d9d9";
			}
		}
		//console.log("zr_shape:",zr_shape);

		zr.painter.refresh(null, true)
	}



	/**
	 * 高亮路线
	 * @param nodes (路线节点)
	 */
	function highlight_route(nodes) {
		for (var i in nodes) {
			var node = main_data[nodes[i]];
			if (i == 0) {
				//当前节点高亮
				var highlight = (node.zr_shape.style.opacity != opacity_hidden);
				if (highlight) {
					node.zr_shape.style.opacity = opacity_show;
				}
			}
			var in_relations = node.ins;
			var out_relations = node.outs;
			var relations = in_relations.concat(out_relations);
			for (var k in relations) {
				var relation_name = relations[k].name;
				if (nodes[parseInt(i) + 1] && relation_name == nodes[parseInt(i) + 1]) {
					// zr shape
					var zr_shape = main_data[relation_name].zr_shape;
					var zr_arrow = relations[k].arrow;
					// high light
					var highlight_relation = (zr_shape.style.opacity != opacity_hidden && zr_arrow.line.style.opacity != opacity_hidden);
					if (highlight_relation) {
						zr_shape.style.opacity = opacity_show
						zr_arrow.line.style.opacity = opacity_show;
						zr_arrow.line.style.strokeColor = "#80bb5f";
						if (zr_arrow.polygon) {
							zr_arrow.polygon.style.opacity = opacity_show;
							zr_arrow.polygon.style.color = "#80bb5f";
						}
					}
				}

			}
		}
		zr.painter.refresh(null, true);
	}


	/**
	 * 通过设置透明度的方式隐藏所有的节点
	 * 透明度不是0的就变成0.1，透明度是0的就不做改变。
	 */
	function chart_hidden() {
		for (var i = 0; i < zr_nodes.length; i++) {
			var zr_node = zr_nodes[i]
			if (zr_node.style.opacity != opacity_hidden) {
				zr_node.style.opacity = opacity_arrow;
			}
		}
		for (var i = 0; i < zr_arrows.length; i++) {
			var zr_arrow = zr_arrows[i]
			if (zr_arrow.style.opacity != opacity_hidden) {
				zr_arrow.style.opacity = opacity_arrow;
			}
		}
		zr.painter.refresh(null, true)
	}

	/**
	 * 把图谱从高亮恢复成初始模样
	 * 关闭路线和关系框 isshow = false
	 */
	function chart_recover() {
		//存在unchecked状态的checkbox的时候，不恢复
		if (!zr_node_highlight_lock) {
			for (var i = 0; i < zr_nodes.length; i++) {
				var zr_node = zr_nodes[i]
				if (zr_node.style.opacity != opacity_hidden) {
					zr_node.style.opacity = opacity_show;
				}
				if (!word_show_flag) {
					zr_node.style.textColor = 'rgba(0,0,0,0)';
				}
			}
			for (var i = 0; i < zr_arrows.length; i++) {
				var zr_arrow = zr_arrows[i]
				if (zr_arrow.style.opacity != opacity_hidden) {
					zr_arrow.style.opacity = opacity_arrow;
					zr_arrow.style.strokeColor = "#52c2e7"
					zr_arrow.style.color = "#52c2e7"
				}
			}
			//删除扩展按钮、详情按钮
			zr.delShape('ext').delShape('detail');
			//移除关系列表
			$('.relation_template').remove();
			//移除路线列表
			$('.route_template  ').remove();
			//移除基本信息
			$('.connect_bn').empty().hide();
			isshow = false;
			zr.painter.refresh(null, true)
		}
	}

	/////////////////////////页面按钮事件
	var zoom_value = radius;

	function fangda() {
		zoom_value += 10;
		if (zoom_value > 500) {
			zoom_value = 500;
		}
		if (zoom_value < 50) {
			zoom_value = 50
		}
		zr.dispose()
		js_init(init, zoom_value)
	}

	function suoxiao() {
		zoom_value -= 10;
		if (zoom_value > 500) {
			zoom_value = 500;
		}
		if (zoom_value < 50) {
			zoom_value = 50
		}
		zr.dispose()
		js_init(init, zoom_value)
	}
	// $('#btn_bigmore').on("click", function() {
	// 	zoom_value += 10;
	// 	if (zoom_value > 200) {
	// 		zoom_value = 200;
	// 	}
	// 	if (zoom_value < 50) {
	// 		zoom_value = 50
	// 	}
	// 	zr.dispose()
	// 	js_init(init, zoom_value)
	// })

	function resize() {
		//            zoom_value = 100;
		zoom_value = radius;
		zr.dispose()
		js_init(init, zoom_value);
	}

	//窗口大小调整
	// $(window).resize(function() {
	// 	dyMapWid = $('#dyMapMain').width();
	// 	resize_canvas();
	// 	resize();
	// });

	//调整画布大小宽度
	function resize_canvas() {
		//重置各层之间半径大小。
		radius = ($('#dyMap').height() - 100) / 2 / level;
		//$('#dyMap').css('width', window.innerWidth - 450 - 80);
		$('#dyMap').css('width', dyMapWid);
	}

	//右侧缩进按钮事件
	var right_indent_flag = true;
	$(".hn_1").click(function() {
		if (!right_indent_flag) {
			right_indent_flag = true;
			$(this).children("img").attr('src', 'images/you_1.jpg');
			$("#connect_right").animate({
				"left": "toggle"
			}, 50, function() {
				// $('#dyMap').css('width', window.innerWidth - 450 - 80);
				$('#dyMap').css('width', dyMapWid);
				resize();
				$('#connect_tuli').css("right", "300px")
			});
		} else {
			right_indent_flag = false;
			$(this).children("img").attr('src', 'images/zuo_1.jpg');

			$("#connect_right").animate({
				"left": "toggle"
			}, 50, function() {
				// $('#dyMap').css('width', window.innerWidth - 80);
				$('#dyMap').css('width', dyMapWid);
				resize();
				$('#connect_tuli').css("right", "10px")
			});
		}

	});

	//关闭弹窗
	$(".co_xclo").on('click', function(event) {
		$(this).closest("#relation-modal").hide();
	});

	/////////////////////////zr事件
	/**
	 * zrender节点响应的鼠标点击事件
	 * @param e zrender事件
	 */
	function node_mouse_click(e, v) {
		//存在unchecked状态的checkbox的时候，不响应鼠标点击事件
		zr_node_click = true;
		zr_node_highlight_lock = true;
		//高亮
		if (v) {
			var name = e.target.style.text;
		} else {
			var name = this.style.text;
		}
		chart_hidden();
		highlight_relation(name)

		//如果点击公司，有个小弹窗
		if (e.target.isCompany) {

			// 线下，线上环境
			var url = window.location.hostname == "127.0.0.1" ? "http://10.10.20.132" : ""

			$.ajax({
				type: "GET",
				url: url + "/staticCompanyInfo", //查询公司接口详细信息relatedPartyStatistics.do
				data: {
					companyName: name,
					token: sessionStorage.token
				},
				dataType: "json",
				success: function(res) {
					atlasImgCompanyDetail.data = res.data;

					return ;
					data = data.obj;
					// $("#companyNameHtml").html(name);
					var shtml = '<div class="relation-modal"><div class="company-title">' + name + '<span class="iconfont icon-iconfontshequyijujue"></span></div>\
                      <table>\
                        <tbody>\
                          <tr><td>注册资本</td><td>' + data.capital + '</td></tr>\
                          <tr><td>登记状态</td><td>' + data.registation + '</td></tr>\
                          <tr><td>关联方法人节点数</td><td>' + data.legalPersonNodes + '</td></tr>\
                          <tr><td>关联方自然人节点数</td><td>' + data.naturalPersonNode + '</td></tr>\
                          <tr><td>自然人股东数</td><td>' + data.naturalPersonShareholders + '</td></tr>\
                          <tr><td>法人股东数</td><td>' + data.legalPersonShareholders + '</td></tr>\
                          <tr><td>子公司数</td><td>' + data.subsidiarys + '</td></tr>\
                        </tbody>\
                      </table>\
                  </div>';
					$("#relation-modal").html(shtml).show();
					$(".relation-modal .icon-iconfontshequyijujue").on("click", function() {
						$("#relation-modal").hide();
					})
				}
			});
		} else {
			$("#relation-modal").hide();
		}

	}

	/**
	 * zrender扩展节点的鼠标点击事件
	 */
	function ext_node_mouse_click() {
		zr_node_click = true;
		zr_node_highlight_lock = true;
	}

	/**
	 * zrender箭头响应鼠标点击事件
	 * @param e
	 */
	function arrow_mouse_click(e) {
		zr_arrow_click = true;
	}

	function node_mouse_over(e) {
		//存在unchecked状态的checkbox的时候，不高亮
		if (!zr_node_highlight_lock) {
			//高亮
			var name = this.style.text;
			//console.log(name);
			chart_hidden();
			highlight_relation(name)
		}
	}

	/**
	 * 该事件需要分作六种情况：（通过鼠标坐标移动来判断是点击还是移动）
	 * 1.鼠标在zr图谱的节点点击
	 * 2.鼠标在zr图谱的节点点击并且移动
	 * 3.鼠标在zr图谱的空白处点击
	 * 4.鼠标在zr图谱的空白处点击并且移动
	 * 5.鼠标在zr图谱的箭头点击
	 * 6.鼠标在zr图谱的箭头点击并且移动
	 */
	function zr_mouse_click(e) {

		if (!e.target) {
			console.log("点击空白");

			atlasImgCompanyDetail.data = {};
			// return ;
			// $("#relation-modal").hide();
		}

		//判断鼠标是否移动
		var current_coordinate = new Coordinate(e.event.clientX, e.event.clientY);
		//按下的时候的坐标和弹起来的坐标保持一致则为点击，否则为移动
		if (zr_node_click) {
			if (zr_mouse_down_coordinate.equals(zr_mouse_up_coordinate) && current_coordinate.equals(zr_mouse_up_coordinate)) {
				//console.log("mouse zr node click")

			} else {
				//console.log("mouse zr node move")
			}
		} else if (zr_arrow_click) {
			//也算作是空白处点击
			if (zr_mouse_down_coordinate.equals(zr_mouse_up_coordinate) && current_coordinate.equals(zr_mouse_up_coordinate)) {
				//console.log("mouse zr arrow click")
				zr_node_highlight_lock = false;
				chart_recover()
			} else {
				//console.log("mouse zr arrow move")
			}

		} else {
			if (zr_mouse_down_coordinate.equals(zr_mouse_up_coordinate) && current_coordinate.equals(zr_mouse_up_coordinate)) {
				// mouse click
				// console.log("mouse zr blank click");
				//如果左侧有unchecked的checkbox，维持原状，不响应高亮事件
				// 点击空白处，取消高亮
				zr_node_highlight_lock = false;
				chart_recover()
			} else {
				// mouse move
				// console.log("mouse zr blank move");
			}
		}
		// 还原成成默认值
		zr_node_click = false;
		zr_arrow_click = false;
	}

	function zr_mouse_down(e) {
		zr_mouse_down_coordinate = new Coordinate(e.event.clientX, e.event.clientY);
	}

	function zr_mouse_up(e) {
		zr_mouse_up_coordinate = new Coordinate(e.event.clientX, e.event.clientY);
	}

	/**
	 * 文字隐藏
	 */
	$('#btn_hidden_word').click(function() {
		if (word_show_flag) {
			//隐藏处理
			word_show_flag = false;
			for (var i in zr_nodes) {
				zr_nodes[i].style.textColor = 'rgba(0,0,0,0)';
			}
		} else {
			//显示处理
			word_show_flag = true;
			for (var i in zr_nodes) {
				zr_nodes[i].style.textColor = '#d9d9d9';
				// zr_nodes[i].style.textColor = '#000';
			}
		}
		zr.painter.refresh(null, true);
	})


	/**显示关系*/
	$('.ml6').click(function() {
		show_relations($(this), true)
	})
	var relation_template = $('.relation_template').clone().show();
	var tempClick;
	var isshow = false;
	var route_template = $('.route_template').clone().show();
	//显示路线
	function show_route(param) {
		if (tempClick == null) {
			tempClick = param[0];
		}
		if (tempClick == param[0]) {
			//当前点击的与上次点击的相等
			//如果没有显示
			if (isshow) {
				//当前是显示的，点击一下应该关闭
				$('.route_template').remove();
				isshow = false;
				zr_node_highlight_lock = false;
				chart_recover();
			} else {
				$('.relation_template').remove();
				param.parent().after(route_template);
				isshow = true;
				zr_node_highlight_lock = true;
				//关闭弹出框
				$('.connect_bn').empty().hide()
				route_template.empty().html(route_maker(param.attr('companyname')));
			}


		} else {
			//上次点击的与当前点击的不相等
			tempClick = param[0];
			if (isshow) {
				//当前是显示的，点击另外一个 （先remove掉之前显示的，然后再把另外一个显示出来)
				$('.route_template').remove();
				$('.relation_template').remove();
				param.parent().after(route_template);
			} else {
				$('.relation_template').remove();
				param.parent().after(route_template);
				isshow = true;
			}
			zr_node_highlight_lock = true;
			//关闭弹出框
			$('.connect_bn').empty().hide()
			route_template.empty().html(route_maker(param.attr('companyname')));
		}

	}

	//关系
	function show_relations(param) {
		if (tempClick == null) {
			tempClick = param[0];
		}
		if (tempClick == param[0]) {
			//当前点击的与上次点击的相等
			//如果没有显示
			if (isshow) {
				//当前是显示的，点击一下应该关闭
				$('.relation_template').remove();
				isshow = false;

			} else {
				$('.route_template').remove();
				relation_template.show();
				relation_template.children('tbody').html(relation_maker(param.attr('title')));
				param.parent().after(relation_template);
				isshow = true;
			}

		} else {
			//上次点击的与当前点击的不相等
			tempClick = param[0];
			if (isshow) {
				//当前是显示的，点击另外一个 （先remove掉之前显示的，然后再把另外一个显示出来)
				$('.relation_template').remove();
				$('.route_template').remove();
				relation_template.show();
				relation_template.children('tbody').html(relation_maker(param.attr('title')));
				param.parent().after(relation_template);
			} else {
				$('.route_template').remove();
				relation_template.show();
				relation_template.children('tbody').html(relation_maker(param.attr('title')));
				param.parent().after(relation_template);
				isshow = true;
			}
		}
		//高亮路线

		relation_highlight(param.attr('title'));
		//显示先隐藏基本信息
		$('.connect_bn').empty();
		$('.connect_bn').hide();
		//如果是公司 出现基本信息框
		if (main_data[param.attr('title')].symbol == 'rect') {
			base_info(param.attr('title'));
		}
	}

	/**
	 * 返回关系html
	 * @param company_name 公司名称
	 * */
	function relation_maker(company_name) {
		html = '';
		for (var i = 0; i < links.length; i++) {
			if (links[i].source == company_name) {
				html += '<tr><td>' + links[i].target + '</td><td>←</td><td>' + links[i].guanlian + '</td></tr>'
			} else if (links[i].target == company_name) {
				html += '<tr><td>' + links[i].source + '</td><td>→</td><td>' + links[i].guanlian + '</td></tr>'
			}
		}
		return html;
	}

	/**
	 * 图谱关系高亮
	 * @param companyname 公司名称
	 */
	function relation_highlight(companyname) {
		if (isshow) {
			chart_hidden();
			//出现扩展、详情按钮
			zr_node_click = true;
			highlight_relation(companyname);
			//此处设置 是为了让点击空白处的时候消失
			zr_node_click = false;
			zr_node_highlight_lock = true;
		} else {
			zr_node_highlight_lock = false;
			chart_recover();
		}

	}

	/* 滚动条调整 */
	function rollToCompany(companname) {
		$('.relation_template').remove();
		$('.route_template  ').remove();
		var container = $('.connect_guanlian');
		var scrollTo = $('div[companyname="' + companname + '"]');
		container.scrollTop(
			scrollTo.offset().top - container.offset().top + container.scrollTop()
		);
		container.animate({
			scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
		})
		$('div[companyname="' + companname + '"]').children(".fa.fa-link.icon_jx").click();
	};

	//路线
	var route_template = $('.route_template').clone().show();
	$(".fa.fa-link.icon_jx").click(function() {
			show_route($(this))
			zr.delShape("ext").delShape("detail")
			zr.painter.refresh(null, true)
		})
		/**
		 * 返回路线html
		 * @param search 要查询公司名称
		 * */
		//用于保存路线结果
	var route_rst;

	function route_maker(search) {
		html = ''
		$.ajax({
			type: "post",
			url: "relateDpartyDynamicMapRouteSearch.do",
			data: {
				companyName: companyName,
				routeCompany: search,
				level: main_data[search].category
			},
			async: false, //关键
			success: function(data) {
				data = JSON.parse(data);
				route_rst = data.obj;
				for (var i in data.obj) {
					html += '<span style="font-size: 14px;" line="' + i + '">路线' + (parseInt(i) + parseInt(1)) + '</span><br>'
					for (var t in data.obj[i]) {
						html += data.obj[i][t].name + '—&gt;';
					}
					html = html.substr(0, html.length - 5) + '<br><br>';
				}
				route_show();
			},
			error: function(data) {
				layer.alert(data.msg, {
					icon: 2
				});
			}
		});
		return html;
	}

	/**
	 * 路线显示
	 * 默认线路1
	 */
	function route_show(index) {
		var param = [];
		if (index) {
			for (var i in route_rst[index]) {
				param.push(route_rst[index][i].name);
			}
		} else {
			for (var i in route_rst[0]) {
				param.push(route_rst[0][i].name);
			}
		}
		if (isshow) {
			chart_hidden();
			highlight_route(param)
		} else {
			chart_recover();
		}
	}

	/**
	 * 点击路线1 路线2 切换
	 * */
	$('.route_template').on('click', 'span', function(e) {
		route_show($(this).attr('line'));
	});

	/**
	 * 路线列表点击
	 */
	$('.index-search-content .list').on('click', '.list-url', function(e) {
		//先滚动到相关位置 再执行点击操作
		rollToCompany($(this).attr('title'));
		$('.index-search-content').empty();
		$(this).hide();
	});

	/**
	 * //--当前节点是checked状态，其他全checked，取消选中当前节点
	 * 1.找到所有的relations
	 * 2.找到relations对应的节点，隐藏
	 * 3.找到这些节点对应的箭头：ins,outs，隐藏
	 *
	 * //--当前节点是checked状态，其他有unchecked，取消选中当前节点
	 * 1.同第一个步骤，效果叠加
	 *
	 * //--当前节点是unchecked状态，其他全checked，选中当前节点
	 * 1.重绘
	 *
	 * //--当前节点是unchecked状态，其他有unchecked，选中当前节点
	 * 1.找到当前的relation，并显示
	 */

	function check_company(company_name) {
		//var checked = false;
		if (checked) {
			//隐藏
			var relations = getRelationByName(company_name);
			toggle_relations(relations, true)
			relations.push(company_name)
				//check_relation(relations, false)
			checked = false;
		} else {
			//扩展
			var relations = getRelationByName(company_name);
			toggle_relations(relations, false)
			relations.push(company_name)
				//check_relation(relations, true)
			checked = true;
		}
	}

	/**
	 * 除当前节点外是否有节点状态为unchecked。
	 * 注意，判断方法和global_unchecked是有不同的。
	 * @param current
	 * @returns {boolean}
	 */
	function has_unchecked(current) {
		var rows = $(".connect_guanlian").children("div")
		for (var index = 1; index < rows.length; index++) {
			var row = rows[index]
			var checkbox = $(row).children("input[type='checkbox']")
			if (!checkbox.is(current)) {
				var checked = (checkbox.attr("checked") == 'checked')
				if (!checked) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * 是否右侧的checkbox全部都是checked的，把状态记录下来
	 * 如果不是：
	 * 1.node的hover事件
	 * 2.node的out事件
	 * 3.空白处的click事件
	 * 都不响应。
	 * 如果是，则按照目前的逻辑实现。
	 */
	function all_checked() {
		var rows = $(".connect_guanlian").children("div");
		for (var index = 1; index < rows.length; index++) {
			var row = rows[index]
			var checkbox = $(row).children("input[type='checkbox']")
			var checked = (checkbox.attr("checked") == 'checked')
			if (!checked) {
				return false;
			}
		}
		return true;
	}

	/**
	 * 判断当前节点是否被勾选
	 * 如果被勾选返回true
	 * 非勾选返回false
	 * @param current
	 */
	function has_checked_currend(current) {
		if (current.attr("checked") == 'checked') {
			return true
		}
		return false
	}

	function toggle_relations(relations, hide) {

		for (var index in relations) {
			var company_name = relations[index];
			//
			var node = main_data[company_name]
			if (hide) {
				node.zr_shape.style.opacity = opacity_hidden;
			} else {
				node.zr_shape.style.opacity = opacity_show;
			}
			//
			if (node) {
				var ins = node.ins;
				var outs = node.outs;
				var relation_array = ins.concat(outs)
				for (var index in relation_array) {
					if (relation_array[index] != undefined) {
						var arrow = relation_array[index].arrow
						if (hide) {
							arrow.line.style.opacity = opacity_hidden;
							if (arrow.polygon) {
								arrow.polygon.style.opacity = opacity_hidden;
							}
						} else {
							arrow.line.style.opacity = opacity_arrow;
							arrow.line.style.strokeColor = "#52c2e7";
							//
							if (arrow.polygon) {
								arrow.polygon.style.opacity = opacity_arrow;
								arrow.polygon.style.color = "#52c2e7";
							}

						}
					}
				}
			}
		}
		zr.delShape("ext").delShape("detail")
		zr.painter.refresh(null, true)
	}

	/**
	 * 基本信息弹出框
	 * @param companyname
	 */
	function base_info(node_name) {
		console.log("=====>isshow", isshow);
	};

	$(document).on("click", "#fullscreen", function() {
		if ($(".window-show-graph")[0]) {
			dyMapWid = $(window).width() * 0.64
		} else {
			dyMapWid = $(window).width()
		}
		resize_canvas();
		resize();
	})

	//
	exports.resetCanvasSize = function() {
		dyMapWid = $('#dyMapMain').width();
		resize_canvas();
		resize();
	}
	exports.zoomAdd = function() {
		fangda();
	}
	exports.zoomSub = function() {
			suoxiao();
	}
		//重绘
	exports.reDrawCanvas = function() {
		category_data = [];
		// zr图的圆心坐标
		center_coordinate = null;
		// zr图里面的所有zrender节点对象，包括circle，正方形
		zr_nodes = [];
		dyMapWid = $('#dyMapMain').width();
		resize_canvas();
		resize();
	}

}); //end define