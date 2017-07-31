/**
 * Created by muzrea on 17-7-27.
 */
var express = require('express');
var app = express();
var redis = require('redis');

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
// redis 链接
var client = redis.createClient('6379', '127.0.0.1');
// redis 链接错误
client.on("error", function(error) {
    console.log(error);
});
client.set('countReq', 0); //新增
app.get('/', function (req, res) {
    client.incrby('countReq',1);
    client.get('countReq', function(err, reply) { //查詢
        res.send(reply);//輸出 countReq
    });
})
app.post('/add-anything',function(req,res){
    client.set('inputData',null);
    client.get('inputData', function(err, reply) { //查詢
        res.send(reply);//輸出 inputData
    });
})