$(document).ready(function(){
	var searchsongw=$("#songplay_bg .songlist_bg .searchsong_bg .songkeyword");
	var searchsongt=$("#songplay_bg .songlist_bg .searchsong_bg .sousuo");
	var randsong=$("#songplay_bg .songlist_bg .searchsong_bg .randsong");
	var playb1=$("#songplay_bg .control_bg .songheader .playb1");
	var playq=$("#songplay_bg #play")[0];//js操作获得的是audio对象，jquery选择器获得的是jquery对象，0对象的才是对应的节点对象。
	var last=$("#songplay_bg .control_bg .control .annius_last");
	var playb2=$("#songplay_bg .control_bg .control .annius_ps");
	var next=$("#songplay_bg .control_bg .control .annius_next");
	var jindu=$("#songplay_bg .control_bg .progressbar_bg .jindu_t");
	var now_jindu=$("#songplay_bg .control_bg .progressbar_bg .jindu_t .nowjindu");
	var header_img=$("#songplay_bg .control_bg .songheader .songpic");
	playb1.click(function(){
		
		playmp3();
		
	});
	playb2.click(function(){
		
		playmp3();
	});
	next.click(function(){
		add_num();
	});
	last.click(function(){
		sub_num();
	});
	jindu.click(function(e){
		change_time((e.pageX-$(this).offset().left));
	});
	//监控音乐播放完成
	playq.addEventListener("ended",function(){
		add_num();//跳到下一首
	});
	//监控播放开始
	playq.addEventListener("play",function(){
		header_img.addClass("rotate");
		playb1.css({
					"background-image":"url(./images/index_12.png)"
		});
		playb2.css({
			"background-image":"url(./images/index_12-12.png)"
		});
	});
	/*playq.addEventListener("pause",function(){
		alert("停止了");
	});*/
	searchsongw.keydown(function(event){
		if(event.which==13){
			if(searchsongw.val()==""){
				alert("输入框不能为空哦！");
				return;
			}
			get_song_json(searchsongw.val());
		}
			
	});
	searchsongt.click(function(){
		if(searchsongw.val()==""){
				alert("输入框不能为空哦！");
				return;
			}
		get_song_json(searchsongw.val());

	});
	randsong.click(function(){
		getrand_host_songs();//换一批热歌
	});
	$("#songplay_bg").mousedown(function(e){
		e.stopPropagation();//阻止事件冒泡(函数里返回假也可以达到效果)
		if(e.button==2){
			$(this).contextmenu(function(event){//禁用右键菜单
				
				return false;
			});
			alert("you and me 欢迎你的静听\n作者:bluemoon\n联系:QQ:1752295326\n邮箱:1752295326@qq.com");
		}
	});
	//get_song_json("dj");//初始化音乐
	//get_song_json("舞曲");
	getrand_host_songs();//初始化时加载热门歌曲
	//play(0);
});

  var result=null;//用于存储每次搜到数据
  var num_type=1;//用来规定取歌曲类型数据 0压缩 1标准 2高品质
  var num_song=0;//用来规定播放第几首歌
  var getpic=null;
  var readLrc=null;//解析歌词
  var play_now_data={//定义存储当前播放的音乐资料
		song_name:"unkown",
		singer_name:"未知",
		song_size:"未知",
		song_long:"00:00",
		song_url:"",
		singer_pic:"",
		song_lrc:"",
	}

	//按钮监控
	function playmp3(){

		var ve=null;
		var ve2=null;
		var playb1=$("#songplay_bg .control_bg .songheader .playb1");
		var playq=$("#songplay_bg #play")[0];//js操作获得的是audio对象，jquery选择器获得的是jquery对象，0对象的才是对应的节点对象。
		
		var playb2=$("#songplay_bg .control_bg .control .annius_ps");
		
		var header_img=$("#songplay_bg .control_bg .songheader .songpic");
		
		if(playq.paused){//如果暂停
			if(playq.src==window.location||playq.src==""){//为什么playq.src!='' ???
				play(0);//播放第一首
			}else{
				playq.play();
				playb1.css({
					"background-image":"url(./images/index_12.png)"
				});
				playb2.css({
					"background-image":"url(./images/index_12-12.png)"
				});
				playq.volume=0;
				var v=0;
				ve=setInterval(function(){
					playq.volume=v.toFixed(3);
					v+=0.005;
					if(v.toFixed(3)>=1.000){
						 ve=clearInterval(ve);
					}
				},10);
				updata_progressbar();//触发监控进度
				//header_img.attr("class":"")
				header_img.addClass("rotate");
			}
		}else{
			//getpic=clearInterval(getpic);//停止ajax获取singer_pic
			playq.pause();
			playb1.css({
				"background-image":"url(./images/index_10.png)"
			});
			playb2.css({
				"background-image":"url(./images/index_12-14.png)"
			});
			header_img.removeClass("rotate");
		}
	}
//搜索歌曲请求
function get_song_json(keyword){
	$.ajax({
			url:"http://so.ard.iyyin.com/s/song_with_out",
			type:"GET",
			dataType:"jsonp",
			jsonp: 'jsoncallback',
			async: false,
			timeout: 5000,//请求超时
			data:{
				"q":keyword,
				"page":1,//第一页
				"size":100,//加载100
				"callback":"ttpodsdata",//回调函数名
			},
			success: function (json) {
	        },
	        error: function (xhr) {
	        }
		});
}
function ttpodsdata(tdata){
	//alert(tdata.data.length);//
	result=tdata;//结果集赋值全局变量
	display(tdata);
}

function getrand_host_songs(){
	$.ajax({
		url:"http://v1.ard.h.itlily.com/plaza/newest/200/jsonp_plaza",//可以通过改变中间数字得到更多歌曲
		tpye:"GET",
		data:{"callback":"jsonp_plaza"},
		dataType:"jsonp",
		jsonp: 'jsoncallback',
		async: false,
		timeout: 5000,//请求超时

		success: function (json) {
        },
        error: function (xhr) {
        }
	});
}
//数据源返回函数（固定？？）
function jsonp_plaza(rand_song_data){
	if(rand_song_data.msg=="ok"){
		result=rand_song_data;//结果集赋值全局变量
		display(rand_song_data);
	}else{
		alert("抱歉，没有搜到歌曲！");
	}
}
//打印随机获取的热歌
function display(rdata){
	var song=$("#songplay_bg .songlist_bg .songlist");
	var datalen=rdata.data.length;
	var str="";
	for(var i=0;i<datalen;i++)
	{			
		str+="<div class='songs'>";
		str+="<div class='song_name'><span>"+(i+1)+". </span>"+rdata.data[i].song_name+"</div>";
		str+="<div class='song_long'>"+rdata.data[i].pick_count+"</div>";
		str+="<div class='song_size'>人气</div>";
		str+="<div class='singer_name'>"+rdata.data[i].singer_name+"</div>";
		str+="</div>";	
	}
	song.html(str);
	song_list=$("#songplay_bg .songlist_bg .songlist .songs");//需要重新获取对象
	song_list.click(function(){
	num_song=$(this).index();//赋值全局变量目前播放第几首歌
	play($(this).index());

	});
}
//指定播放第几首歌曲
function play(num){
	getsong_url(result.data[num].song_id);//获取歌曲详细
	//getsinger_pic(result.data[num].singer_name);//获取图片
	//alert(play_now_data.singer_pic);
	//playnow(play_now_data);//传入播放数据*/
};

function getsong_url(song_id){
	
	$.ajax({
		url:"http://ting.hotchanson.com/website/ting",
		type:"GET",
		data:{
			"song_id":song_id,
			"code":getkey(song_id),
			"callback":"get_song_detail",
		},
		dataType:"jsonp",
		jsonp: 'jsoncallback',
		async: true,
		timeout: 5000,//请求超时
		success: function (json) {
        },
        error: function (xhr) {
        }
	});
}
function get_song_detail(song_dateil_data){
	readLrc=clearInterval(readLrc);//
	play_now_data.song_name=song_dateil_data.data[0].song_name,
	play_now_data.singer_name=song_dateil_data.data[0].singer_name,
	play_now_data.song_size=song_dateil_data.data[0].url_list[num_type].size,
	play_now_data.song_long=song_dateil_data.data[0].url_list[num_type].duration,
	play_now_data.song_url=song_dateil_data.data[0].url_list[num_type].url,
	getsinger_pic(play_now_data.singer_name);//第一次设置时存在问题？？
	getsong_lrc(song_dateil_data.data[0].song_name,song_dateil_data.data[0].singer_name,song_dateil_data.data[0].song_id);
	//alert(play_now_data.singer_name);
	playnow(play_now_data);//传入播放数据*/
}
function getsinger_pic(singer_name){
	$.ajax({
		url:"http://lp.music.ttpod.com/pic/down",
		type:"GET",
		data:{
			"artist":singer_name,
			"callback":"returnsinger_pic",
		},
		dataType:"jsonp",
		jsonp: 'jsoncallback',
		async: true,
		timeout: 2000,//请求超时
		success: function (json) {
        },
        error: function (xhr) {
        }
	});
}
//获取图片返回函数
function returnsinger_pic(singer_pic_data){
	if(singer_pic_data.code==2){
		play_now_data.singer_pic=2;//获取图片失败
	}else{
		play_now_data.singer_pic=singer_pic_data.data.singerPic;
	}

};
//获取歌词
function getsong_lrc(song_name,singer_name,song_id){
	$.ajax({
		url:"http://lp.music.ttpod.com/lrc/down",
		type:"GET",
		data:{
			"lrcid":"",
			"artist":singer_name,//歌手
			"title":song_name,//歌名
			"song_id":song_id,//歌曲id
			"code":getkey(song_id),//歌曲key
			"callback":"return_song_lrc",//回调函数名
		},
		dataType:"jsonp",
		jsonp: 'jsoncallback',
		async: true,
		timeout: 2000,//请求超时
		success: function (json) {
        },
        error: function (xhr) {
        }
	});
}
//解析歌词
function return_song_lrc(song_lrc_data){

	var now_song_lrc=$("#songplay_bg .songlrc_bg .lrc_bg .lrc");
	if(!song_lrc_data.data){
		now_song_lrc.html("没有找到歌词...");
		return;
	}
	var lrc_re=/(\[.*\])|(\[\d{2}:\d{2}.\d{2,3}\])/g;//(\[\d{2}:\d{2}.\d{2,3}\])//取有时间部分
	var lrc_ci=song_lrc_data.data.lrc.split(/\[.*\]/);//取得歌词部分
	var re=song_lrc_data.data.lrc.match(lrc_re);
	var strs="";
	for(var i=0;i<lrc_ci.length-1;i++){
			//歌词
		//strs+="<li><span class='time'>"+changet(re[i])+"</span><span>"+lrc_ci[i+1]+"</span><br></li>";
		strs+="<li><span>"+lrc_ci[i+1]+"</span><br></li>";
	}
	now_song_lrc.html(strs);
	var playq=$("#songplay_bg #play")[0];
	var i=0;
	
	readLrc=setInterval(function(){
		var nt=(playq.currentTime).toFixed(2);
		for(i=0;i<lrc_ci.length-5;i++){
			if(re[i])
			if(parseInt(nt)==parseInt(changet(re[i]))){
				//console.log((playq.currentTime).toFixed(2));
				now_song_lrc.animate({
					top:((6-i)*30),
				},200);
				now_song_lrc.children("li").eq(i)[0].className="now_lrc";
				for(var j=0;j<i;j++){
					now_song_lrc.children("li").eq(j)[0].className="";
				}
			}
		}
		//console.log((playq.currentTime).toFixed(2));
	},500);
}

function changet(t){
			var ts=t.match(/\d{2,3}/g);
			if(ts==null)
				return "";
			var str="";
			//[00:56.99]
			for(var j=0;j<ts.length;j++)
			{
				//str+=ts[j]+" ";
			}
			str+=(parseInt(ts[0]*60)+parseInt(ts[1]))+"."+ts[2];
			return str;
}
//改变播放进度
function change_time(time){
	var playq=$("#songplay_bg #play")[0];
	var play_now_jindu=$("#songplay_bg .control_bg .progressbar_bg .jindu_t .nowjindu");
	var play_all_jindu=$("#songplay_bg .control_bg .progressbar_bg .jindu_t").width();
	var mp3_t_long=playq.duration;//音乐时长
	if(time>=play_all_jindu)
		time=play_all_jindu;
	if(time<=0)
		time=0;
	time=Math.ceil((time/play_all_jindu)*mp3_t_long);
	playq.currentTime=time;
	//playq.play();
}

//上一首
function sub_num(){
	if(result==null){
		alert("I am sorry 没找到音乐！");
		return;
	}
	var nums=result.data.length;//获取结果集总歌曲数
	num_song--;
	if(num_song==-1)
	{
		num_song=nums-1;
	}
	play(num_song);
}
//上一首
function add_num(){
	if(result==null){
		alert("I am sorry 没找到音乐！");
		return;
	}
	var nums=result.data.length;//获取结果集总歌曲数
	num_song++;
	if(num_song==nums)
	{
		num_song=0;
	}
	play(num_song);
}

//当前播放数据
function playnow(data){
	var playq=$("#songplay_bg #play")[0];
	var now_song_name=$("#songplay_bg .control_bg .songmessage .songname");
	var now_song_singer=$("#songplay_bg .control_bg .songmessage .songer");
	var now_song_time=$("#songplay_bg .control_bg .progressbar_bg .songtime");
	var now_singer_pic=$("#songplay_bg .control_bg .songheader .songpic");
	now_song_name.html("歌曲："+data.song_name);
	now_song_singer.html("歌手："+data.singer_name);
	now_song_time.html(data.song_long);
	getpic=setTimeout(function(){
		getsinger_pic(data.singer_name);//获取图片
		if(data.singer_pic==2){//play_03.png
			//now_singer_pic.attr("src",data.singer_pic);
		}else{
			now_singer_pic.attr("src",play_now_data.singer_pic);
		}

	},10000);
	
	
	playq.src=data.song_url;
	playq.play();//开启播放
	updata_progressbar();//触发监控进度
	//playmp3();//触发按钮监控
}

//更新进度条
function updata_progressbar(){
	var playq=$("#songplay_bg #play")[0];
	var play_now_jindu=$("#songplay_bg .control_bg .progressbar_bg .jindu_t .nowjindu");
	var play_all_jindu=$("#songplay_bg .control_bg .progressbar_bg .jindu_t").width();
	var efface_line=setInterval(function(){
		if(playq.paused){
			efface_line=clearInterval(efface_line);
		}
			var p_time=playq.currentTime;//当前播放时间
			var mp3_t_long=playq.duration;//音乐时长
			play_now_jindu.css({
				width:Math.ceil((p_time/mp3_t_long)*play_all_jindu)
			});
	},1000);
}
//获取songkey
function getkey(song_id){
		var d = new Array(256);  
		var e, c;  
		var b;  
		for (e = 0; e < 256; e++) {  
			b = e;  
			for (c = 0; c < 8; c++) {  
				if (b & 1) {  
					b = ((b >> 1) & 2147483647) ^ 3988292384;
				} else {  
					b = ((b >> 1) & 2147483647);
				}  
			}  
			d[e] = b;  
		}  
		if (typeof song_id != "string") {  
			song_id = "" + song_id;
		}  
		b = 4294967295;  
		for (e = 0; e < song_id.length; e++) {  
			b = ((b >> 8) & 16777215) ^ d[(b & 255) ^ song_id.charCodeAt(e)]; 
		}  
		b ^= 4294967295;  
		return (b >> 3).toString(16);
}