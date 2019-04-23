$(function(){
	//获取与好友的聊天记录	
	let url="http://127.0.0.1:8000/friend/api/get_all_chat_message/";
	let l_url = window.location.href;
	let gid=parseInt(l_url.split("=")[1]);

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
			// {'mid':id,'sid':sid,'gid':gid,'message':message,'stime':str(stime)}
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
				$('#chat_box').scrollTop( $('#chat_box')[0].scrollHeight);
			}

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
			let url="http://127.0.0.1:8000/friend/api/send_message/";
			$.post(url, data={"gid":gid,"message":message}, function(data){
				if(data.code==4004){
					alert("请先登录");
					window.location.href="/page/login/";
				}
				else if(data.code==0){
					tag="<div><img src='"+
					data.data.avatar+"' class='you_img'><span class='you_mes' mid="+
					data.data.mid+">"+
					message+"</span><div style='clear: both;'></div></div>";
				}
				else{
					alert("请刷新重试")
				}
			})
		}
	})


})


