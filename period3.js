/**
 * Created by muzrea on 17-7-28.
 */
'use strict';
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var redis = require('redis');
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })
// redis 链接
var client = redis.createClient('6379', '127.0.0.1');
// redis 链接错误
client.on("error", function(error) {
    console.log(error);
});
app.use(express.static('public'));
app.get('/index.html', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
})
var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)


})
app.post('/student', urlencodedParser, function (req, res) {
    // 输出 JSON 格式
    res.set('Content-Type','text/javascript;charset=UTF-8');
    client.set('sInfos', req.body.sInfo); //新增
    var response = {
        "sInfos":req.body.sInfo
    };
    // var s = client.getAttribute('sInfos');
    console.log(response);
    res.send(s);
    res.end(JSON.stringify(response));
})

//查询
app.post('/students', urlencodedParser, function (req, res) {
    // 输出 JSON 格式
    res.set('Content-Type','text/javascript;charset=UTF-8');
    client.set('snos', req.body.items);
    var response = {
        "sno":req.body.items
    };
    console.log(response);
    res.end(JSON.stringify(response));
})

// app.get('/students', urlencodedParser, function (req, res){
//     res.set('Content-Type','text/javascript;charset=UTF-8');
//     client.get('sInfos', function(err, reply) { //查詢
//         res.send(reply);//輸出 countReq
//     });
// })




