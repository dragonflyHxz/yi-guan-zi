$(function(){
	//说说页面不进行websocket连接，节约资源

	//实时显示输入的值
	$("#write_words").keyup(function(){
		console.log($(this).val())
		$("#commit_words").val($(this).val())
	})

	//退出
	$("#logout").click(function(){
		let url = "http://127.0.0.1:8000/user/api/logout/";
		$.get(url, function(data){
			window.location.href="/page/login/";
		})
	})


	$("#commit").click(function(){
		tag = "<div id='choice_box'>\
			<button id='cancle'>取消</button>\
			<p>是否匿名???</p>\
			<button id='yes'>是</button>\
			<button id='no'>否</button></div>";
		$("#words_box").append($(tag));

		$("#choice_box button").click(function(){
			if ($(this).attr("id")=="cancle") {
				$("#choice_box").remove();
			}
			else{
				let url = "http://127.0.0.1:8000/social/api/send_words/";
				let message=$("#commit_words").val()
				let anonymous = 0
				if($(this).attr("id")=="yes"){
					anonymous = 1
				}
				$.post(url, data={"message":message, "anonymous":anonymous}, function(data){
					if(data.code==4004){
						window.location.href="/page/login/"
					}
					else if (data.code==4006) {
						alert("说说内容不可以为空")
					}
					else if(data.code==0){
						alert("发布成功")
						window.location.href="/page/index/"
					}
					else{
						alert("请刷新重试，刷新前请另存一下您的说说")
					}
				})
			}
		})
	})

})