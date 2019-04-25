//获取是否有未读信息 聊天信息 与好友申请信息
function get_no_read(){
	let url="http://10.3.139.113:8000/social/api/no_read_message/";
	$.get(url, function(data){
		if(data.code==0){
			state = data.data
			if(state.apply){
				$("#information").addClass("no_read");
			}
		}
	})
}


$(function(){
	let url="http://10.3.139.113:8000/friend/api/get_friend_list/";
	$.get(url, function(data){
		if(data.code==4004){
			alert("请先登录");
			window.location.href="/page/login/";
		}
		else if(data.code==0){
			let friends=data.data.friends;

			for(i in friends){
				if(friends[i].no_read==true) {
					tags="<div class='one_friend' name="+
					friends[i].fid+"><img src="+
					friends[i].avatar+"><span class='nickname'>"+
					friends[i].nickname+"</span><span class='have_no_read'></span></div>";
				}
				else if(friends[i].no_read==false) {
					tags="<div class='one_friend' name="+
					friends[i].fid+"><img src="+
					friends[i].avatar+"><span class='nickname'>"+
					friends[i].nickname+"</sapn></div>";
				}
				$("#friend_list").append($(tags));

				get_no_read();

			}

			if (window.s){window.s.close()}
			//创建socket连接
			var socket = new WebSocket("ws://10.3.139.113:8000/social/api/information/");
			socket.onopen = function () {
				console.log("WebSocket open");//成功连接上Websocket
			};
			//服务端返回过来的数据
			socket.onmessage = function (e) {

				if(e.data=="40000"){
					;
				}
				else if(e.data=="40001"){
					get_no_read();
				}
				//有新的好友未读信息
				else{
					window.location.reload();
				}
			};

			// 如果已建立socket连接，直接打开
			if (socket.readyState == WebSocket.OPEN)
				socket.onopen();
			window.s = socket;

			window.onunload = function(){
				window.s.close();//关闭websocket
				console.log('websocket已关闭');
			}


			//点击好友进入聊天页面
			$(".one_friend").click(function(){
				let fid=$(this).attr("name");
				//结合fid进行get请求与好友聊天
				window.location.href="/page/chat/?fid="+fid;
			})

		}

		else if(data.code==4009){
			;
		}
		else {
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