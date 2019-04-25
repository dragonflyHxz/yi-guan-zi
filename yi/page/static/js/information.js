//获取是否有未读信息 聊天信息 与好友申请信息
function get_no_read(){
    let url="http://10.3.139.113:8000/social/api/no_read_message/"
    $.get(url, function(data){
        if(data.code==0){
            state = data.data
            if(state.chat){
                $("#friend").addClass("no_read");
            }
        }
    })
}


$(function(){
	if (window.s){
		window.s.close()
	}
	//创建socket连接
	var socket = new WebSocket("ws://10.3.139.113:8000/social/api/information/");
	socket.onopen = function() {
		console.log('WebSocket open');//成功连接上Websocket
	}
	//服务端返回过来的数据
	socket.onmessage = function(e){
		if(e.data=='40000'){
			;
		}
		//新的未读好友申请
		else if(e.data=='40001'){
			window.location.reload();
		}
		//有新的好友未读信息
		else{
			get_no_read();
		}
	}
	// 如果已建立socket连接，直接打开
	if (socket.readyState == WebSocket.OPEN)
		socket.onopen();
	window.s = socket;
	window.onunload = function () {
		window.s.close();//关闭websocket
		console.log('websocket已关闭');
	}




	//获取所有申请信息
	let url="http://10.3.139.113:8000/friend/api/get_all_apply/";
	$.get(url, function(data){
		if(data.code==4004) {
			alert("请先登录");
			window.location.href="/page/login/";
		}
		else if(data.code==4011) {
			;
		}
		else if(data.code==4012) {
			;
		}
		else if(data.code==0) {
			let apply_list=data.data.apply_list;
			for(i in apply_list){
				let tag
				//已读
				if(apply_list[i].is_read==1){
					//是否为申请者
					if(apply_list[i].u_apply==1){
						tag="<div class='one_information' apply_id="+
							apply_list[i].apply_id+"><span class='message'>发送给"+
							apply_list[i].nickname+"的好友申请</span><span class='stime'>"+
							apply_list[i].stime+"</span></div>";

					}
					else if(apply_list[i].u_apply==0){
						tag="<div class='one_information' apply_id="+
							apply_list[i].apply_id+"><span class='message'>来自"+
							apply_list[i].nickname+"的好友申请</span><span class='stime'>"+
							apply_list[i].stime+"</span></div>";
					}
				}
				//未读
				else if(apply_list[i].is_read==0){
					if(apply_list[i].u_apply==1){
						tag="<div class='one_information' apply_id="+
							apply_list[i].apply_id+"><span class='message'>发送给"+
							apply_list[i].nickname+"的好友申请</span><span class='stime'>"+
							apply_list[i].stime+"</span><span class='have_no_read'></span></div>";
					}
					else if(apply_list[i].u_apply==0){
						tag="<div class='one_information' apply_id="+
							apply_list[i].apply_id+"><span class='message'>来自"+
							apply_list[i].nickname+"的好友申请</span><span class='stime'>"+
							apply_list[i].stime+"</span><span class='have_no_read'></span></div>";
					}
				}

				$("#information_box").append($(tag));

				get_no_read();
			}

			//消息点击，跳转到这条消息页面
			$(".one_information").click(function(){
				let apply_id=$(this).attr("apply_id");
				window.location.href="/page/apply_deal/?apply_id="+apply_id
			})

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