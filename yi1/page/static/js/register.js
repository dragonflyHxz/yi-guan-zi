$(function(){
	$('#commit').click(function(){
		let nickname = $('#nickname').val()
		let password = $('#password').val()
		let re_password = $('#re_password').val()

		if(nickname!=''&&password!=''&&re_password!=''){
			var url = "http://10.3.139.113:8000/user/api/register/"
			$.post(url, data={'nickname':nickname, 'password':password, 're_password':re_password}, function(data){
					if (data.code==0){
				  		window.location.href='index.html'
					}
					else{
				  		alert(data.data)
					}	
				}) 
			}
		else{
				alert('用户名与密码不能为空')
		}	
	})
})