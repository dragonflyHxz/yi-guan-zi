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
    get_no_read();

	let l_url= window.location.href;
	let mid = l_url.substring(l_url.lastIndexOf('=') + 1);

	let url = "http://10.3.139.113:8000/social/api/get_person_by_words/";

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

			if (window.s) {window.s.close()}
			//创建socket连接
			var socket = new WebSocket("ws://10.3.139.113:8000/social/api/information/?gid="+ person.pid);
			socket.onopen = function () {
				console.log('WebSocket open');//成功连接上Websocket
			};

			//服务端返回过来的数据
			socket.onmessage = function (e) {
				//有人发了一条新的说说
				if(e.data=='40000'){
					$("#message_box").html('')
					get_all_words()
				}
				//新的未读好友申请
				else if(e.data=='40001'){
					//为了简单，刷新页面，但增加了数据库操作
					// window.location.reload();
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



			//点赞或者取消
		    $(".prise").click(function(){
		    	let url="http://10.3.139.113:8000/social/api/like/";
		    	let like=this;
		    	let mid=$(like).attr("mid");
		    	$.post(url,data={"mid":mid},function(data){
		    		if(data.code==4004) {
		    			alert("请先登录");
		    			window.location.href="/page/login/";
		    		}
		    		else if(data.code==0) {
		    			$(like).html("赞: "+data.data.praise);
		    		}
		    		else{
						alert("请刷新页面重试");
					}
		    	})
		    })

		    //发送好友申请
			$("#send_apply").click(function(){
				let url="http://10.3.139.113:8000/friend/api/friend_apply/";
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
						socket.send("a_f");
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