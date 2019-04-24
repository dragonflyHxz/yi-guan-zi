$(function(){
	//说说页面不进行websocket连接，节约资源

	//实时显示输入的值
	$("#write_words").keyup(function(){
		$("#commit_words").val($(this).val())
	})

	//返回
	$("#reback").click(function(){
		window.location.href="/page/index/"
	})


	//建立websocket连接
	if (window.s){
        window.s.close()
    }
    //创建socket连接
    var socket = new WebSocket("ws://10.3.139.113:8000/social/api/information/");
    socket.onopen = function () {
        console.log('WebSocket open');//成功连接上Websocket
    };
    //服务端返回过来的数据
    socket.onmessage = function (e) {
		console.log(e.data);
    };


    // 如果已建立socket连接，直接打开
    if (socket.readyState == WebSocket.OPEN)
        socket.onopen();
    window.s = socket;

    window.onunload = function () {
        window.s.close();//关闭websocket
        console.log('websocket已关闭');
    }





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
				let url = "http://10.3.139.113:8000/social/api/send_words/";
				let message=$("#commit_words").val()
				let anonymous = 0;
				if($(this).attr("id")=="yes"){
					anonymous = 1;
				}
				$.post(url, data={"message":message, "anonymous":anonymous}, function(data){
					if(data.code==4004){
						window.location.href="/page/login/";
					}
					else if (data.code==4006) {
						alert("说说内容不可以为空");
					}
					else if(data.code==0){
						alert("发布成功");
						socket.send("s_s");
						window.location.href="/page/index/";
					}
					else{
						alert("请刷新重试，刷新前请另存一下您的说说");
					}
				})
			}
		})
	})

})