var serverHost = "bobo.yimwing.com"
var socketHost = "bobo.yimwing.com:9019";
// var socketHost = "127.0.0.1:9019";

var pushCount = 0;
var pullCount = 0;
var client =null;//连接
var rejoinResponse=null;

var roomID = 0;
var userInfo = {
	is_vip:1,
	nickname:"A.rea",
	pic:"http://bobo-upload.oss-cn-beijing.aliyuncs.com/robot/zxpldraquk5.jpg",
	uid:3862496,
	join_uid:3862496
}
function joinRoom(){
	var user_id = document.getElementById("user_id").value;
	var room_id = document.getElementById("room_id").value;
	var user_name = document.getElementById("user_name").value;
	
	room_id = parseInt(room_id);
	user_id = parseInt(user_id);
	if(room_id>0 && user_id>0 ){
		roomID = ""+room_id+"push"
		userInfo["room_id"] = roomID;
		userInfo["uid"] = user_id;
		userInfo["join_uid"] = room_id;
		userInfo["username"] = user_name;
		if(client){
			client.emit('join',userInfo);
		}else{
			console.log("没有链路")
            client =  io.connect('http://'+socketHost+"/chat"	);
            
			client.on('rejoin', (data) => {
				client.emit('join',userInfo);
				console.log("action"+JSON.stringify(data));
				// console.log(data)
				rejoinResponse=data.code

			});
			client.on("init_room_user_list", (data) => {
				console.log("init_room_user_list"+JSON.stringify(data));
			});


			// 接收消息(客户端处理)
			client.on("message",function(data){
				pullCount++;
				console.log(data);
				var strAddMessageHtml="<li><span style='color:red'>"+ data.username+":</span><span>"+ data.content+"</span></li>"
				$('.socket_body_ul').append(strAddMessageHtml)
			});
			client.on("join",function(data){
				console.log(data);
				var strAddJoinHtml="<li><span style='color:blue'>"+data.data.user.username+"：</span><span>&nbsp;进入房间</span></li>"
				$('.socket_body_ul').append(strAddJoinHtml)
			});
			
			client.on("heartbeat",function(data){
				pullCount++;
				// console.log(data);
			});
		}
	}
}
function leaveRoom(){
	var user_id = document.getElementById("user_id").value;
	var room_id = document.getElementById("room_id").value;
	if(client){
		console.log("离开房间")
		client.emit("leave",{uid:user_id,"room_id":room_id})
	}
}
setInterval(function(){
	if(client){
		pushCount++;
		client.emit("heartbeat","heartbeat")
	}
},5000)
setInterval(function(){
	console.log("发送信息："+pushCount+"，接收信息："+pullCount)
},20000)



