$(function(){
	let url="http://127.0.0.1:8000/friend/api/get_friend_list/";
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
			} 

			//点击好友进入聊天页面
			$("#one_friend").click(function(){
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
		let url = "http://127.0.0.1:8000/user/api/logout/";
		$.get(url, function(data){
			window.location.href="/page/login/";
		})
	})

    $("#write").click(function(){
    	window.location.href="/page/write/";
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