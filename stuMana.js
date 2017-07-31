/**
 * Created by muzrea on 17-7-31.
 */
'use strict'

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
});
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
});
//添加学生信息
app.post('/student', urlencodedParser, function (req, res) {
    // 输出 JSON 格式
    res.set('Content-Type','text/javascript;charset=UTF-8');
    client.set('sInfos', req.body.sInfo); //新增
    let sInfos = client.getAttribute('sInfos');
    let item = sInfos.slice().split('，');
    let sno=`${item[1]}`;
    client.set(sno, sInfos);
    let s1 =client.getAttribute('sno');
    let str = '学生'+` ${sno}` +'成绩已被添加';
    alert(str);
    var response = {
        "sInfos":req.body.sInfo
    };
    console.log(response);
    res.send(str);
    // res.end(JSON.stringify(response));
});
app.get('/student', urlencodedParser, function (req, res){
    let temp=[];
    let stu=req.body;
    temp.push(stu);
    client.get("students", function(err, val) {
        if(val){
            let students=JSON.parse(val);
            students.push(stu);
            client.set("students",JSON.stringify(students),function (err,reply) {
                //console.log(reply);
            })

        }else {
            client.set("students",JSON.stringify(temp),function (err,reply) {
                //console.log(reply);

            })
        }
    });
    res.send("ok");
});

//查询学生信息

