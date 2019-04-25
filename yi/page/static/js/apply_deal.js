//获取是否有未读信息 聊天信息 与好友申请信息
function get_no_read(){
	let url="http://10.3.139.113:8000/social/api/no_read_message/";
	$.get(url, function(data){
		if(data.code==0){
			state = data.data
			if(state.chat){
				$("#friend").addClass("no_read");
			}
			if(state.apply){
				$("#information").addClass("no_read");
			}
		}
	})

}

$(function(){

	let l_url= window.location.href;
	let apply_id = l_url.substring(l_url.lastIndexOf('=') + 1);

	//将此申请对用户标为已读
	let url="http://10.3.139.113:8000/friend/api/apply_read_deal/";


	$.post(url, data={"apply_id":apply_id},function(data){
		if(data.code==4004){
			alert("请先登录");
			window.location.href="/page/login/";
		}
		else if(data.code==0){
			let apply_mes=data.data;

			let websocket_conn;

			if (window.s){
				window.s.close()
			}
			//创建socket连接
			let gid=apply_mes.aid;
			var socket = new WebSocket("ws://10.3.139.113:8000/social/api/information/?gid="+gid);
			socket.onopen = function () {
				console.log('WebSocket open');//成功连接上Websocket
			};
			//服务端返回过来的数据
			socket.onmessage = function (e) {

				if(e.data=='40000'){
					get_no_read();
				}
				//新的未读好友申请
				else if(e.data=='40001'){
					get_no_read();
				}
				//有新的好友未读信息
				else{
					get_no_read();
				}
			};

			// 如果已建立socket连接，直接打开
			if (socket.readyState == WebSocket.OPEN)
				socket.onopen();
			window.s = socket;

			window.onunload = function () {
				window.s.close();//关闭websocket
				console.log('websocket已关闭');
			}


			//用户为申请者
			let message;
			let state;
			if(apply_mes.a_user==1){
				message="你给"+apply_mes.receiver+"发送的好友申请";
				if(apply_mes.state=="wait"){
					state="请耐心等待对方应答";
				}
				else if(apply_mes.state=="pass"){
					state="对方已经通过你的好友请求，快去聊天吧";
				}
				else{
					state="对方拒绝了你的好友申请";
				}
			}
			else{
				message=apply_mes.sender+"给你发送的好友申请";
				if(apply_mes.state=="wait"){
					state="等待你的应答";
					let tag="<p id='choice'>\
		 				<button state='fail'>拒绝</button>\
		 				<button state='pass'>通过</button><p>";
		 			$("#apply_box").append($(tag));

		 			$("#choice button").click(function(){
		 				let url="http://10.3.139.113:8000/friend/api/res_friend_invite/";
		 				let state=$(this).attr("state")
		 				$.post(url, data={"apply_id":apply_id, "state":state}, function(data){
		 					if(data.code==4004){
								alert("请先登录");
								window.location.href="/page/login/";
							}
							else if(data.code==0){
								socket.send("a_f");
								window.location.reload()
							}
							else{
								alert("请刷新重试")
							}
		 				})
		 			})

				}
				else{
					state="等待对方查阅"
				}
			}

			$("#message").html(message);
			$("#sender").html("来自： "+apply_mes.sender);
			$("#receiver").html("接收者： "+apply_mes.receiver);
			$("#state").html("状态： "+state);
			$("#stime").html("日期： "+apply_mes.stime);

			//获取是否有未读信息 聊天信息 与好友申请信息
			get_no_read();



		}
		else{
			alert("请刷新重试")
		}
	})

	$("#logout").click(function(){
		let url = "http://10.3.139.113:8000/user/api/logout/";
		$.get(url, function(data){
			window.location.href="/page/login/";
		})
	})

	$("#write").click(function(){
		window.location.href="/page/index/";
	})

	$("#information").click(function(){
		window.location.href="/page/information/";
	})

	$("#friend").click(function(){
		window.location.href="/page/friend/";
	})

	$("#mine").click(function(){
		window.location.href="/page/mine/";
	})


})