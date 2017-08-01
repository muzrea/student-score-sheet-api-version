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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/'));
app.use(express.static('public'));
app.get('/index.html', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
})
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
});

//
app.get('/student', urlencodedParser, function (req, res){
    let items=[];
    let stu=req.body.sInfo;
    items.push(stu);
    client.get("students", function(err, value) {
        if(value){
            let students=JSON.parse(value);
            students.push(stu);
            client.set("students",JSON.stringify(students),function (err,reply) {
                //console.log(reply);
            })
        }else {
            client.set("students",JSON.stringify(items),function (err,reply) {
                //console.log(reply);
            })
        }
        res.send(students);
    });
});

//查询得到要查询的学生学号
app.post('/students', urlencodedParser, function (req, res) {
    // 输出 JSON 格式
    res.set('Content-Type','text/javascript;charset=UTF-8');
    client.set('snos', req.body.items);
    client.get("snos",function(err,val){
        res.send(val);
    });
})

function getStuInfo(){
    let inputSno = document.getElementById("items").value;
    inputSno.split('，');
    for(let i in inputSno){
        document.getElementById('myTable').deleteRow(i+1);
    }
    let allInfo = showStu();
    let requiredItems = {};
    for(let i in inputSno){
        for(let j in allInfo){
            if(inputSno[i]==allInfo[j].snos){
                requiredItems.push(allInfo[j]);
            }
        }
    }
    //在页面显示
    let getRequiredItems = ' ';
    for(let i=0;i<inputSno.length;i++){
        getRequiredItems += "<tr class='active'>" +"<td>" +` ${getRequiredItems[i].name}`+"</td>"
            +"<td>" +` ${getRequiredItems[i].math}`+"</td>"
            +"<td>" +` ${getRequiredItems[i].chinese}`+"</td>"
            +"<td>" +` ${getRequiredItems[i].english}`+"</td>"
            +"<td>" +` ${getRequiredItems[i].code}`+"</td>"
            +"<td><input type='button' value='修改' ></input></td>"
            +"<td><input type='button' value='删除' ></td>"+"</tr>";
    }
    $("#myTable").append(getRequiredItems);
}



