//获取所有说说
function get_all_words(){
	let url="http://10.3.139.113:8000/social/api/get_all_words/";
	$.get(url, function(data){
		if(data.code==4004){
			alert("请先登录");
			window.location.href="/page/login/";
		}
		else if(data.code==0){
			all_words = data.data;
			if(data.data!=null){
				for(i in all_words){

					let tag="<div class='one_message_box'><img src="+
						all_words[i].avatar+"><p class='message' mid="+
						all_words[i].mid+">"+
						all_words[i].message+"</p><p class='message_footer'><button class='prise' mid="+
						all_words[i].mid+">赞: "+
						all_words[i].praise+"</button><span class='stime'>"+
						all_words[i].stime+"</span></p></div>";

					$("#message_box").append($(tag));
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

		    	//查看用户是否匿名，否或互为好友或是自己的信息，跳转到用户页面
				$(".message").click(function(){
					let url="http://10.3.139.113:8000/social/api/check_mid_anonymous/";
					let this_mes=this
					let mid=$(this_mes).attr("mid");
					$.get(url, data={"mid":mid},function(data){
						if(data.code==4004){
							alert("请先登录");
		    				window.location.href="/page/login/";
						}
						else if(data.code==4008){
							alert("匿名信息");
						}
						else if(data.code==0){
							mid=$(this_mes).attr("mid");
							window.location.href="/page/person/?mid="+mid;
						}
						else{
							alert("请刷新页面重试")
						}

					})

		    	})

			}
		}
		else{
			alert("请刷新重试");
		}

		
	})
}

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
	
	if (window.s) {window.s.close()}
    //创建socket连接
    var socket = new WebSocket("ws://10.3.139.113:8000/social/api/information/");
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


    get_all_words();
	get_no_read();



	$("#logout").click(function(){
		let url = "http://10.3.139.113:8000/user/api/logout/";
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
