var width = 300, // 日历宽度
	height = 2200, // 日历高度
	cellSize = 40, // 每日的方块大小
	weekDay = ["日", "一", "二", "三", "四", "五", "六"], // 星期号
	monthNo = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]; // 月份

var day = d3.time.format("%w"), // 星期名称 [0, 6]
	week = d3.time.format("%U"), // 周次 [00, 53]
	percent = d3.format(".1%"), // 百分比，保留到小数点后一位
	format = d3.time.format("%Y-%m-%d"); // 日期格式 2014-01-01

/**
 * 使用de.scale的quantize方法，指定了输入域domain，返回相应的输出域range。这里range是由
 * d3.range生成的数组[0~5]，然后调用js的map生成的新数组["q0-11"~"q10-11"]
 */
var color = d3.scale.quantize()
	.domain([1, 10])
	.range(d3.range(6).map(function(d) { return "q" + d + "-6"; }));

// 绘制日历
var svg = d3.select(".container").selectAll("svg")
	.data(d3.range(2013, 2015))
	.enter().append("svg")
	.attr("width", width)
	.attr("height", height)
	.attr("id", function(d) { return "c" + d; })
	.attr("class", "RdYlGn calendar")
	.append("g")
	.attr("transform", "translate(" + (width - cellSize * 7 - 1) + "," + (height - cellSize * 53) / 2 + ")");

// 添加星期号
svg.selectAll("text")
	.data(weekDay)
	.enter().append("text")
	.attr("transform", function(d) { return "translate("+ ((width - cellSize * 7 - 1) + cellSize * weekDay.indexOf(d)) +", -5)";})
	.style("text-anchor", "middle")
	.text(function(d) { return d; });

// 绘制一年的方格
var rect = svg.selectAll(".day")
	.data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
	.enter().append("rect")
	.attr("class", "day")
	.attr("width", cellSize)
	.attr("height", cellSize)
	.attr("x", function(d) { return day(d) * cellSize; })
	.attr("y", function(d) { return week(d) * cellSize; })
	.datum(format);
// 给方格添加title
rect.append("title")
	.text(function(d) { return d; });

// 绘制每个月的轮廓
svg.selectAll(".month")
	.data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
	.enter().append("path")
	.attr("class", "month")
	.attr("d", monthPath);

// 获取日历数据，填充
d3.json("assets/dji.json", function(json) {
	var data = d3.nest()
		.key(function(d) {
				return format(new Date(d.time));
			})
		.rollup(function(leaves) {
				return {
					"length": leaves.length,
					"detail": leaves
				};
			})
		.map(json);

	rect.filter(function(d) { return d in data; })
		.attr("class", function(d) { return "day " + color(data[d].length); })
		.attr("detail", function(d) { return JSON.stringify(data[d].detail); })
		.select("title")
		.text(function(d) { return d + ": " + data[d].length + "次"; });
	}
);

function monthPath(t0) {
	var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
		d0 = +day(t0), w0 = +week(t0),
		d1 = +day(t1), w1 = +week(t1);
	return "M" + d0 * cellSize + "," + (w0 + 1) * cellSize + "H" + 0 * cellSize + "V" + (w1 + 1) * cellSize + "H" + (d1 + 1) * cellSize + "V" + w1 * cellSize + "H" + 7 * cellSize + "V" + w0 * cellSize + "H" + d0 * cellSize + "Z";
}
