$(function(){
	$('#commit').click(function(){
		let nickname = $('#nickname').val()
		let password = $('#password').val()

		if(nickname!=''&&password!=''){
			var url = "http://127.0.0.1:8000/user/api/login/"
			$.post(url, data={'nickname':nickname, 'password':password}, function(data){ 	
				if (data.code==0){
					window.location.href='/page/index/'}
				else{
				  	alert('用户名或密码错误')}
			}) 
		}
		else{
			alert('用户名与密码不能为空')
		}
	})
})