$(function(){
	//获取所有申请信息
	let url="http://127.0.0.1:8000/friend/api/get_all_apply/";
	$.get(url, function(data){
		if(data.code==4004) {
			alert("请先登录");
			window.location.href="/page/login/";
		}
		else if(data.code==4011) {
			;
		}
		else if(data.code==0) {
			let apply_list=data.data.apply_list;
			for(i in apply_list){
				//已读
				if(apply_list[i].is_read==1){
					//是否为申请者
					if(apply_list[i].u_apply==1){
						let tag="<div class='one_information' apply_id="+
						apply_list[i].apply_id+"><span class='message'>发送给"+
						apply_list[i].nickname+"的好友申请</span><span class='stime'>"+
						apply_list[i].stime+"</span></div>";

					}
					else if(apply_list[i].u_apply==0){
						let tag="<div class='one_information' apply_id="+
						apply_list[i].apply_id+"><span class='message'>来自"+
						apply_list[i].nickname+"的好友申请</span><span class='stime'>"+
						apply_list[i].stime+"</span></div>";
					}
				}
				//未读
				else if(apply_list[i].is_read==0){
					if(apply_list[i].u_apply==1){
						let tag="<div class='one_information' apply_id="+
						apply_list[i].apply_id+"><span class='message'>发送给"+
						apply_list[i].nickname+"的好友申请</span><span class='stime'>"+
						apply_list[i].stime+"</span><span class='have_no_read'></span></div>";
					}
					else if(apply_list[i].u_apply==0){
						let tag="<div class='one_information' apply_id="+
						apply_list[i].apply_id+"><span class='message'>来自"+
						apply_list[i].nickname+"的好友申请</span><span class='stime'>"+
						apply_list[i].stime+"</span><span class='have_no_read'></span></div>";
					}
				}

				$("#information_box").append($(tag));
			}

			//消息点击，跳转到这条消息页面
			$(".one_information").click(function(){
				let apply_id=$(this).attr("apply_id");
				//还没写 
				//window.location.href=".html/?apply_id="+apply_id

			})

		}
		else{
			alert("请刷新重试");
		}

	})

})