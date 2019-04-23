$(function(){
	let url="http://127.0.0.1:8000/user/api/get_profile/";
	$.get(url, function(data){
		if(data.code==4004) {
			alert("请先登录");
			window.location.href="/page/login/";
		}
		else if(data.code==0){
			let me = data.data.user;
			let avatar = me.avatar;
			let nickname = me.nickname;
			let sex = me.sex;
			let birthday = me.birthday;

			$("#avatar").attr("src", avatar);
			$("#nickname").val(nickname);
			$("sex").val(sex);
			$("birthday").val(birthday);
		}
		else{
			alert("请刷新重试");
		}
	})

	$("#change").click(function(){
		$("#img_choice").attr("disabled", false);
		//允许头像点击预览
		$("#avatar").click(function(){

			$("#img_choice").trigger('click');
		})
		$("#img_choice").change(function(){
			file = this.files[0];
			let fileReader = new FileReader();
			fileReader.onloadend = function(){
				if (fileReader.readyState == fileReader.DONE){
					$("#avatar").attr("src", fileReader.result);
				}
			}
			fileReader.readAsDataURL(file);
		})

		//允许修改昵称
		$("#nickname").removeAttr('readonly'); 

		let sex_tag="<select>\
			  	<option value='保密'>保密</option>\
			  	<option value='男'>男</option>\
			  	<option value='女'>女</option></select>";

		$("#mine_box").find("p:eq(1)").append($(sex_tag));
		$("select").val($("#sex").val());

		let date_tag="<input type='date' id='date_change'>";
		$("#mine_box").find("p:eq(2)").append($(date_tag));
		$("#date_change").val($("#birthday").val())

		$("select").change(function(){
			$("#sex").val($(this).val());
		})
		$("#date_change").change(function(){
			$("#birthday").val($(this).val())
		})

	})

	$("#commit").click(function(){	
		$("#img_choice").attr("disabled", true);
		$("#nickname").attr("readonly", "readonly");
		$("select").remove();
		$("#date_change").remove();

		let url="http://127.0.0.1:8000/user/api/set_profile/";

		let avatar= document.getElementById("img_choice").files[0]; // js 获取文件对象

		let nickname=$("#nickname").val();
		let sex=$("#sex").val();
		let birthday=$("#birthday").val();

		let formFile = new FormData();
		formFile.append("avatar", avatar);
		formFile.append("nickname", nickname);
		formFile.append("sex", sex);
		formFile.append("birthday", birthday);

		var data = formFile;
        $.ajax({
            url: url,
            data: data,
            type: "Post",
            dataType: "json",
            cache: false,//上传文件无需缓存
            processData: false,//用于对data参数进行序列化处理 这里必须false
            contentType: false, //必须
            success: function (data) {
                if(data.code==4004){
                	alert("请先登录");
					window.location.href="/page/login/";
                }
                else if(data.code==4011){
                	alert(data.data);
                }
                else if(data.code==0){
                	alert("提交成功！！！");
                }
                else{
                	alert("请刷新重试");
                }
            },
        })

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