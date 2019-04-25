$(function(){
	//获取与好友的聊天记录	
	let url="http://10.3.139.113:8000/friend/api/get_all_chat_message/";
	let l_url = window.location.href;
	let gid=parseInt(l_url.split("=")[1]);

	if (window.s) {window.s.close()}
    //创建socket连接
    var socket = new WebSocket("ws://10.3.139.113:8000/social/api/information/?gid="+gid);
   	socket.onopen = function () {
    	console.log("WebSocket open");//成功连接上Websocket
    };
    //服务端返回过来的数据
    socket.onmessage = function (e) {

        if(e.data=="40000"){
        	;
        }
        else if(e.data=="40001"){
        	;
		}
		//有新的好友未读信息
        else{
        	now_gid = parseInt(e.data.split("=")[1]);
			if(now_gid==gid){
        		let url="http://10.3.139.113:8000/friend/api/get_message/"
        		$.get(url, data={"sid":gid},function(data){
					let mes_list = data.data
					for(i in mes_list){
						let tag="<div><img src='"+
							mes_list[i].avatar+"' class='friend_img'><span class='friend_mes' mid="+
							mes_list[i].mid+">"+
							mes_list[i].message+"</span><div style='clear: both;'></div></div>";
						$("#chat_box").append($(tag));
					}
					$("#chat_box").scrollTop($("#chat_box")[0].scrollHeight);

                })

			}
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


	$.get(url, data={"gid":gid},function(data){
		if(data.code==4004){
			alert("请先登录");
			window.location.href="/page/login/";
		}
		else if(data.code==4010){
			;
		}
		else if(data.code==0){
			let f_nickname=data.data.f_nickname;
			$("h2").html(f_nickname);
			let mes_list=data.data.mes_list;

			for(i in mes_list){
				let tag;
				if(mes_list[i].gid==gid){
					tag="<div><img src='"+
					mes_list[i].avatar+"' class='you_img'><span class='you_mes' mid="+
					mes_list[i].mid+">"+
					mes_list[i].message+"</span><div style='clear: both;'></div></div>";
				}
				else{
					tag="<div><img src='"+
					mes_list[i].avatar+"' class='friend_img'><span class='friend_mes' mid="+
					mes_list[i].mid+">"+
					mes_list[i].message+"</span><div style='clear: both;'></div></div>";		
				}
				$("#chat_box").append($(tag));
			}
			$("#chat_box").scrollTop($("#chat_box")[0].scrollHeight);

		}
		else{
			alert("请刷新重试")
		}

	})

	$("#goback").click(function(){
		window.location.href="/page/friend/"
	})


	//信息发送
	$("#commit").click(function(){
		message=$("#write_words").val()
		//若为空或空白符
		if(message==false){
			$("#write_words").val("")
		}
		else{
			message = message.trimRight();
			let url="http://10.3.139.113:8000/friend/api/send_message/";
			$.post(url, data={"gid":gid,"message":message}, function(data){
				if(data.code==4004){
					alert("请先登录");
					window.location.href="/page/login/";
				}
				else if(data.code==0){
					let tag="<div><img src='"+
					data.data.avatar+"' class='you_img'><span class='you_mes' mid="+
					data.data.mid+">"+
					message+"</span><div style='clear: both;'></div></div>";

					$("#chat_box").append($(tag));
					$("#write_words").val("");
					$("#chat_box").scrollTop($("#chat_box")[0].scrollHeight);
					socket.send("f_c");
				}
				else{
					alert("请刷新重试")
				}
			})
		}
	})


})


