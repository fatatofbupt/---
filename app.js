var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var p = require('bluebird')

var index = require('./routes/index');
var users = require('./routes/users');
var wechatHandler = require('./routes/wechatHandler');

/////////////////////////////////////////
///message send
var WechatAPI = require('wechat-api');
//var WechatAPI = p.promisifyAll(require('wechat-api'));
var token = "fatcateatrat";
var appid = 'wxb81c19145617ca88';
var appsecret =  '26768d2175092a6aa779645392e7d3e2';
var api = p.promisifyAll(new WechatAPI(appid, appsecret));


/////////////////////////////////////////
///message receive
var wechat = require('wechat');
var config = {
  token: token,
  appid: appid,
//  encodingAESKey: appsecret,
  checkSignature: false // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
};

//////////////////////////////
var menu = {
 "button":[
   {
     "name":"托管项目",
     "sub_button":[
       {
         "type":"view",
         "name":"项目公示",
         "url":"http://www.czzhengtai.com:37077/zt/pages/xmgs.html"
       },
	 {
         "type":"view",
         "name":"进度查询",
         "url":"http://www.czzhengtai.com:37077/zt/pages/xmjd.html"
       }
       ]
     },
{
     "name":"机构概况",
     "sub_button":[
       {
         "type":"view",
         "name":"托管机构",
         "url":"http://www.czzhengtai.com:37077/zt/pages/托管机构.html"
       },
        {
         "type":"view",
         "name":"工作动态",
         "url":"http://www.czzhengtai.com:37077/zt/pages/工作动态.html"
       },
{
         "type":"view",
         "name":"联系我们",
         "url":"http://www.czzhengtai.com:37077/zt/pages/联系我们.html"
       },
       ]
     },
{
     "name":"托管指南",
     "sub_button":[
       {
         "type":"view",
         "name":"托管流程",
         "url":"http://www.czzhengtai.com:37077/zt/pages/托管流程.html"
       },
        {
         "type":"view",
         "name":"常见问题",
         "url":"http://www.czzhengtai.com:37077/zt/pages/常见问题.html"
       },
{
         "type":"view",
         "name":"政策文件",
         "url":"http://www.czzhengtai.com:37077/zt/pages/政策文件.html"
       },

       ]
     }
]
   };
 
api.removeMenuAsync()
.then(function(res){
	console.log("remove menu:");
	console.dir(res);
	return api.createMenuAsync(menu);
})
.then(function(res){
	console.log("create menu:");
	console.dir(res);
})
.catch(function(e){
	console.dir(e);
});
/*
api.removeMenu(function(err, res){
api.createMenu(menu, function(err, res){
console.dir(err);
console.dir(res);
});
});
*/

/////////////
var templateId= 'AauMiH0mJA6gQRlC6tnOmsXymNML8Ya-oNVTBffoqck';
// URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
var url= 'http://www.baidu.com/';
var data = {
   "test1": {
     "value":"参数1！",
     "color":"#173177"
   },
   "test2":{
     "value":"参数2",
     "color":"#173177"
   },
   "test3": {
     "value":"参数3",
     "color":"#173177"
   },
   "test4": {
     "value":"参数4",
     "color":"#173177"
   },
   "remark":{
     "value":"欢迎再次购买！",
     "color":"#173177"
   }
};

var articles = [
 {
   "title":"正泰",
   "description":"测试描述",
   "url":"http://www.baidu.com",
   "picurl":"http://e.hiphotos.baidu.com/image/pic/item/ca1349540923dd54f2f4667bdb09b3de9c82481a.jpg",
 },
 {
   "title":"测试标题1",
   "description":"测试描述1",
   "url":"http://www.163.com",
   "picurl":"http://www.hemenway.com/images/Baby%20Erin.jpg",
 },
{
   "title":"测试标题2",
   "description":"测试描述1",
   "url":"http://www.sina.com",
   "picurl":"https://tse3.mm.bing.net/th?id=OIP.9iPhJa4OQVweA38P3RsnkAEgDY&pid=Api",
 }
];
setInterval(
	function(){
		data.test1.value = new Date();
		console.log(data.test1.value);

		api.getFollowersAsync()
		.then(function(res){
			console.log("getFollowers:");
			console.dir(res);

			if(res.count > 0){
				for(var i in res.data.openid){
					var openid = res.data.openid[i]
					//console.log(openid)
					//return api.sendTemplateAsync( openid, templateId, url, data);

					return api.sendNewsAsync(openid, articles, callback);
				}
			}

		})
		.then(function(res){
			console.log("sendNewsAsync:");
			console.dir(res);
			
		})
		.catch(function(err){
			console.dir(err);
		});
	}, 
3600 * 1000);

//////////

var app = express();

app.use(express.query());
app.use( function(req, res, next) {
console.log("debug:" + req.url);
next();
})
app.use('/wechat', wechat(config, function (req, res, next) {
  // 微信输入信息都在req.weixin上
  var message = req.weixin;
   console.dir(message)
    res.reply(message.Content + ",现在时间:" + new Date());
	return;
  if (message.FromUserName === 'diaosi') {
    // 回复屌丝(普通回复)
    res.reply('hehe');
  } else if (message.FromUserName === 'text') {
    //你也可以这样回复text类型的信息
    res.reply({
      content: 'text object',
      type: 'text'
    });
  } else if (message.FromUserName === 'hehe') {
    // 回复一段音乐
    res.reply({
      type: "music",
      content: {
        title: "来段音乐吧",
        description: "一无所有",
        musicUrl: "http://mp3.com/xx.mp3",
        hqMusicUrl: "http://mp3.com/xx.mp3",
        thumbMediaId: "thisThumbMediaId"
      }
    });
  } else {
    // 回复高富帅(图文回复)
    res.reply([
      {
        title: '你来我家接我吧',
        description: '这是女神与高富帅之间的对话',
        picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
        url: 'http://nodeapi.cloudfoundry.com/'
      }
    ]);
  }
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
