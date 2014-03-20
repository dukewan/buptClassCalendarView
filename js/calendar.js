$(document).ready(function () {
	var calendar = function () {
		this.init = function () {
			$("#c2014").attr("style", "display:block;");
			$("#c2013").attr("style", "display:none;");
			this.bindEvent();
		};

		this.bindEvent = function () {
			$("#tab3").click(function () {
				$("#tab3").attr("class", "tab-item active");
				$("#tab4").attr("class", "tab-item");
				$("#c2013").attr("style", "display:block;");
				$("#c2014").attr("style", "display:none;");
			});

			$("#tab4").click(function () {
				$("#tab4").attr("class", "tab-item active");
				$("#tab3").attr("class", "tab-item");
				$("#c2014").attr("style", "display:block;");
				$("#c2013").attr("style", "display:none;");
			});

			$(".day").click(function () {
				if(!$(this).attr("detail")) {
					return;
				}
				var details = $.parseJSON($(this).attr("detail"));
				var date = details[0].time.split(" ")[0];
				var tArr = [
					'<div class="date">',
					date + ' 的查询消息',
					'</div>'
				];
				var html = tArr.join("");
				for (var i = 0; i < details.length; i++) {
					tArr = [
						'<div class="text">',
							'<span style="color:#fff">' + (i + 1) + '#</span> ' + details[i].content,
						'</div>',
						'<div class="time">',
							'at ' + details[i].time.split(" ")[1],
						'</div>'
					];
					html += tArr.join("");
				}

				$("#content").append(html);
				$("#cover").fadeIn();
			});

			$("#close").click(function () {
				$("#content").html("");
				$("#cover").fadeOut();
			});

			$("#cover").click(function () {
				$("#content").html("");
				$("#cover").fadeOut();
			});
		};
	};

	var cal = new calendar();

	cal.init();
});
