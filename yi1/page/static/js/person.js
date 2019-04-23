$(function(){
	let l_url= window.location.href;
	let mid = l_url.substring(l_url.lastIndexOf('=') + 1);

	let url = "http://127.0.0.1:8000/social/api/get_person_by_words/";

	console.log(mid)

	$.get(url, data={"mid":mid}, function(data){
		if(data.code==4004){
			alert("请先登录");
		    window.location.href="/page/login/";
		}
		else if(data.code==4008){
			// 匿名信息，防止用户恶意操作
			window.location.href="/page/index/"
		}
		else if(data.code==0){
			let person=data.data.person;
			$("#person_box img").attr("src", person.avatar);
			$("#nickname").html("昵称： "+person.nickname);
			$("#sex").html("性别： "+person.sex);
			$("#send_apply").attr("gid", person.pid);

			let words_list=data.data.words_list;
			for(i in words_list){

				let tag="<div class='one_message_box'><p class='message' mid="+
					words_list[i].mid+">"+
					words_list[i].message+"</p><p class='message_footer'><button class='prise' mid="+
					words_list[i].mid+">赞: "+
					words_list[i].praise+"</button><span class='stime'>"+
					words_list[i].stime+"</span></p></div>";

				$("#mes_box").append($(tag));
			}

			//点赞或者取消
		    $(".prise").click(function(){
		    	let url="http://127.0.0.1:8000/social/api/like/";
		    	let like=this;
		    	let mid=$(like).attr("mid");
		    	$.post(url,data={"mid":mid},function(data){
		    		if(data.code==4004) {
		    			alert("请先登录");
		    			window.location.href="/page/login/";
		    		}
		    		else if(data.code==0) {
		    			$(like).val("赞: "+data.data);
		    		}
		    		else{
						alert("请刷新页面重试");
					}
		    	})
		    })

		    //发送好友申请
			$("#send_apply").click(function(){
				let url="http://127.0.0.1:8000/friend/api/friend_apply/";
				let gid=$(this).attr("gid");
				$.post(url, data={"gid":gid}, function(data){
					if(data.code==4004){
					    alert("请先登录");
						window.location.href='/page/login/';
					}
					else if(data.code==4011){
						alert("已互为好友");
					}
					else if(data.code==0){
						// window.s.send("a_f");//通过websocket发送数据
						alert("已成功发送申请");
					}
					else{
						alert("请刷新页面重试");
					}
				})
			})

		}
		else{
			alert("请刷新页面重试")
		}

	})

	$("#logout").click(function(){
		let url = "http://127.0.0.1:8000/user/api/logout";
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