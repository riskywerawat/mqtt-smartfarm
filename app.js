var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var loginRouter = require("./routes/login");
var logoutRouter = require("./routes/logout");
var checkloginRouter = require("./routes/checklogin");
var gettokenRouter = require("./routes/gettoken");
var detailuser = require('./routes/getuser');
var saveuser = require("./routes/saveuser");
var indexuser = require("./routes/indexuser");

var flash = require("connect-flash");
var passport = require("passport");
var app = express();
var passport = require("passport");
var session = require("express-session");
var mosca = require("mosca"); //
var mqtt = require("mqtt"); //https://www.npmjs.com/package/mqtt
///topic
var Topic = "home"; //subscribe to all topics
var Topic2 = "home02";
var Topic3 = "home03";
var Broker_URL = "mqtt://192.168.1.110:1883";
var Database_URL = "localhost";
var bodyParser = require("body-parser");
const server = require("http").createServer(app); //
const io = require("socket.io")(server);
const port = 3000; //


var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});
//------------------------------------- connect mqtt -----------------------------
var options = {
  clientId: "MyMQTT",
  port: 1883
  //username: 'mqtt_user',
  //password: 'mqtt_password',
  // keepalive : 60
};
const broker = new mosca.Server(options);
broker.on("ready", () => {
  console.log("broker is ready");
});
broker.on("published", pack => {
  message = pack.payload.toString();
  // console.log(message);
});
var client = mqtt.connect(Broker_URL, options);
client.on("connect", mqtt_connect);
client.on("reconnect", mqtt_reconnect);
client.on("error", mqtt_error);
client.on("message", mqtt_messsageReceived);
client.on("close", mqtt_close);
client.on("subscribe", subscribe);

client.on("publish", publish);



/* setInterval(() => {
  mqtt_connect();
}, 1000) */


let object_topic = new Array();
var sqlsub = `SELECT * FROM house ORDER BY topic`
connection.query(sqlsub, (sqlsub , datasqlsub)=>{
for(let i = 0; i < 100 ; i++){ 
object_topic[i] = {chk : 0,  datahouse1 : 0 ,datahouse2 : 0}
object_topic[i].chk += 1
// console.log(datasqlsub[i].topic);
  }
});


function mqtt_connect() {
  console.log("Connecting MQTT");

  /* try {
    var result = await sqlhouse();
    result.forEach(function (dataresult, num) {
      var numhouse = num+1;
      // console.log(Topic+dataresult.id);
      // console.log(Topic + numhouse);
    
      // console.log(object_topic[num].chk);
      if(object_topic[num].chk == 0 ){
        object_topic[num].datahouse1 = dataresult.topic ;
      
        }else if(object_topic[num].datahouse1 != dataresult.topic){
          object_topic[num].datahouse1 = dataresult.topic;
          object_topic[num].datahouse2 = dataresult.topic;
         
        }

      console.log(object_topic[num].datahouse2);
      
       
        if(object_topic[num].chk == 0  || object_topic[num].datahouse2 != "" && object_topic[num].datahouse2 != null){
        client.subscribe(dataresult.topic, mqtt_subscribe);
        console.log(dataresult.topic);
        }
        object_topic[num].datahouse2 = '';

         

    });

  } catch (err) {

  }

  io.on("connection", socket => {
    client.on("message", function (topic, message, packet) {
      socket.emit(topic, message.toString()); //emit server to cliend //topic 2 คือ event
    });
  }); */
}

setInterval(() => {
  subscribe();
}, 1000)
async function subscribe() {
  try {
    var result = await sqlhouse();
    result.forEach(function (dataresult, num) {
      var numhouse = num+1;

      
      if(object_topic[num].chk == 0){
        object_topic[num].datahouse1 =  dataresult.topic ;
      
        }else if(object_topic[num].datahouse1 !=  dataresult.topic){
          object_topic[num].datahouse1 =  dataresult.topic;
          object_topic[num].datahouse2 =  dataresult.topic;
         
        }
       
        if(object_topic[num].chk == 0  || object_topic[num].datahouse2 != "" && object_topic[num].datahouse2 != null){
           client.subscribe(dataresult.topic, mqtt_subscribe);
           
        }
        
        object_topic[num].datahouse2 = '';

         

    });

  } catch (err) {

  }

  io.on("connection", socket => {
    client.on("message", function (topic, message, packet) {
      socket.emit(topic, message.toString()); //emit server to cliend //topic 2 คือ event
    });
  });
}

function mqtt_subscribe(err, granted) {

  console.log("Subscribed to " + granted[0].topic);
  
  
  if (err) {
    console.log(err);
  }
}

///เช็คการส่งข้อมูล
const sqlhouse = () => {
  var sql = `SELECT * FROM house ORDER BY topic`
  return new Promise((res, rej) => {
    connection.query(sql, (err, data) => {
      if (err) rej(err);
      res(data);
    })
  })
}


/* --------------------------------------------- */


/* let object_data = [
  {house : 1 , chk : 0 , dataheater : 0 , dataheater2 : 0 },
  {house : 2 , chk : 0 , dataheater : 0 , dataheater2 : 0 }
] */



let object_data = new Array();
var sqlnum = `SELECT * FROM house ORDER BY topic`
connection.query(sqlnum,(err , datasql)=>{
  for(let i = 0; i< 100 ; i++){
  object_data[i] = {house : i , chk : 0 , dataheater : 0 , dataheater2 : 0 ,
                                          datapump : 0 , datapump2 : 0,
                                          datafan : 0 , datafan2 : 0,
                                          datasystem : 0 , datasystem2 : 0 }
   object_data[i].chk += 0
  }
})

setInterval(() => {
  publish();
}, 1000)


async function publish() {

  try {
    var result = await sqlhouse();

    result.forEach(function (dataresult, num) {

      //โรง1
      if (result[num].status_heater == 'on' && result[num].status_system == '1') {
        var sendheater1 = result[num].temp;
     
      }else if (result[num].status_heater == 'on' && result[num].status_system == '0'){
        var sendheater1 = '1';
      }else{
        var sendheater1 = '0';
       
      }


      if (result[num].status_pump == 'on' ) {
        var sendpump1 = '1'; //result[0].pump
      } else {
        var sendpump1 = '0';
      }



      if (result[num].status_fan == 'on') {
        var sendfan1 = '1';
      } else {
        var sendfan1 = '0';
      }

      if (result[num].status_system == '1') {
        var sendsystem1 = '1';
      } else {sendpump1
        var sendsystem1 = '0';
      }
        
      /* heater */
      if(object_data[num].chk == 0 ){
        object_data[num].dataheater = sendheater1 ;
      
        }else if(object_data[num].dataheater != sendheater1){
          object_data[num].dataheater = sendheater1;
          object_data[num].dataheater2 = sendheater1;
         
        }

       
        
   
        /* pump */
        if(object_data[num].chk == 0 ){
          object_data[num].datapump = sendpump1 ;
        
          }else if(object_data[num].datapump != sendpump1){
            object_data[num].datapump = sendpump1;
            object_data[num].datapump2 = sendpump1;
           
          }
          /* fan */
          if(object_data[num].chk == 0 ){
            object_data[num].datafan = sendfan1 ;
          
            }else if(object_data[num].datafan != sendfan1){
              object_data[num].datafan = sendfan1;
              object_data[num].datafan2 = sendfan1;
             
            }
       /* system  */
          if(object_data[num].chk == 0 ){
            object_data[num].datasystem = sendsystem1 ;
          
            }else if(object_data[num].datasystem != sendsystem1){
              object_data[num].datasystem = sendsystem1;
              object_data[num].datasystem2 = sendsystem1;
            
            }
          
     object_data[num].chk += 1; 



     
        
        let num1 = num+1;
        // if(result[num].status_system  == '0'){

        if(object_data[num].chk  == 10 || (/* object_data[num].dataheater2 != 0  && */ object_data[num].dataheater2 != null && object_data[num].dataheater2 != "") ||
        (object_data[num].datapump2 != null && object_data[num].datapump2 != "") || (object_data[num].datafan2 != null && object_data[num].datafan2 != "") 
        || (object_data[num].datasystem2 != null && object_data[num].datasystem2 != "")) { 
          //  client.publish(dataresult.topic, '{' + '"systemhouse":' + `${sendsystem1}` + '}');
        client.publish(dataresult.topic +num1 , '{' + '"heaterhouse":' + `${sendheater1}` + ',' + '"pumphouse":' + `${sendpump1}` + ',' + '"fanhouse":' + `${sendfan1}` + ',' + '"systemhouse":' + `${sendsystem1}` +'}', { qos: 1 , retain : true });
        console.log(dataresult.topic +num1,'{' + '"heaterhouse":' + `${sendheater1}` + ',' + '"pumphouse":' + `${sendpump1}` + ',' + '"fanhouse":' + `${sendfan1}` + ',' + '"systemhouse":' + `${sendsystem1}` +'}'); 
      } 

       
        

    
      object_data[num].dataheater2 = ''
      object_data[num].datapump2 = ''
      object_data[num].datafan2 = ''
      object_data[num].datasystem2 = ''
     /*  object_data[num].dataheater4 = '' */
      
        /* Topic + dataresult.id */
      
    });
    
  } catch (err) {

  }

}






function mqtt_reconnect(err) {
  // console.log("Reconnect MQTT");
  //if (err) {console.log(err);}
  client = mqtt.connect(Broker_URL, options);
}

function mqtt_error(err) {
  //console.log("Error!");
  //if (err) {console.log(err);}
}

function after_publish() {
  //do nothing
}
//topic1
//receive a message from MQTT broker
function mqtt_messsageReceived(topic, message, packet) {


  var message_str = message.toString(); //convert byte array to string
  message_str = message_str.replace(/\n$/, ''); //remove new line



  // payload syntax: clientID,topic,message
  // if (countInstances(message_str) != 1) {
  // 	console.log("Invalid payload");
  // 	} else {
  insert_message(topic, message_str, packet); //insertdatabase
  // publish(topic, message_str, packet);

  console.log(topic + message_str); /// log ค่าอุณหภูมมิ  



  // }
}

// function mqtt_messsageReceived2(topic2, message2, packet2) {
//   var message_str2 = message2.toString(); //convert byte array to string
//   message_str2 = message_str2.replace(/\n$/, ''); //remove new line
//   //payload syntax: clientID,topic,message
//   // if (countInstances(message_str) != 1) {
//   // 	console.log("Invalid payload");
//   // 	} else {
//   	// insert_message(topic, message_str, packet); //insertdatabase
//   console.log("home02"+message_str2); /// log ค่าอุณหภูมมิ

//   // }
// }


function mqtt_close() {
  //console.log("Close MQTT");
}
/////////////////////////////////////////////////////////
//insert a row into the tbl_messages table

/* let object_insert = [{insert : 1 , chk1 : 0 , tempsave : 0 , tempsave2 : 0 }]
object_insert[0].chk +=1 */
 
function insert_message(topic, message_str, packet) {
  const datasave = JSON.parse(message_str);
  const tempasave = datasave.TEMP;
  const humsave = datasave.HUMIDI;
  // Try edit message

  const onheater = datasave.HEATERRES;
  const onpump = datasave.PUMPRES;
  const onfan = datasave.FANRES;



  
/*   if(object_insert[0].chk == 0 ){
    object_insert[0].tempsave = tempasave ;
  
    }else if(object_insert[0].tempsave != tempasave){
      object_insert[0].tempsave = tempasave;
      object_insert[0].tempsave2 = tempasave;
     
    }
   */
  
  if (/* (tempasave && humsave != "") && */ (tempasave && humsave  < 100)) {
    //ลงเบส///////

    var sql_1 = `SELECT id,house_quntity,temp,topic,heaterres,pumpres,fanres,status_system FROM house WHERE topic = '${topic}'`
    connection.query(sql_1,function (error, result) {
      if (error) throw error;
  
    
    //   var sql_2 = `UPDATE tbl_messages SET set_temp = '${result[0].temp}'`
    //   connection.query(sql_2, function (error, result1) {
    //     if (error) throw error;

    // });
    if(result[0].status_system == 1){
        var temp_set = result[0].temp;
    }else if(result[0].status_system == 0){
        var temp_set = "manual";
    }

    var sql = `insert into tbl_messages (TEMP,HUMIDI,topic,set_temp,status_heater,status_pump,status_fan) values('${tempasave}','${humsave}',
    '${topic}','${temp_set}','${result[0].heaterres}','${result[0].pumpres}','${result[0].fanres}')`

    // var sql =  `insert into tbl_messages (TEMP,HUMIDI,topic,set_temp,status_heater) SELECT * FROM (SELECT '${tempasave}',
    // '${humsave}','${topic}','${result[0].temp}','${result[0].heaterres}','${result[0].pumpres}','${result[0].fanres}') AS data
    // WHERE NOT EXISTS (SELECT DateTime_created FROM tbl_messages WHERE DateTime_created = '') `

    // var sql =  `insert into tbl_messages (TEMP,HUMIDI,topic,set_temp) SELECT * FROM (SELECT '${tempasave}','${humsave}','${topic}','${result[0].temp}') AS data
    // WHERE NOT EXISTS (SELECT TEMP,HUMIDI FROM tbl_messages WHERE TEMP = '${tempasave}'  ) `

    connection.query(sql, function (error, results) {
      if (error) throw error;
      console.log("Message added: " + message_str);
    });
  });
    // ลงเบส///////
        // var sql = "INSERT INTO ?? (??,??,??) VALUES (?,?,?)";
    // var params = ['tbl_messages', 'TEMP', 'topic', 'HUMIDI', tempasave, topic, humsave];
    // sql = mysql.format(sql, params);	
  } 


   if (onheater) {    // heaterhouse case
    var sql1 = `UPDATE house SET heaterres = '${onheater}' WHERE  topic ='${topic}'`
    connection.query(sql1, function (error, results) {
      if (error) throw error;



      // var sql_uplogdata = `UPDATE tbl_messages SET status_heater = '${onheater}' WHERE  topic ='${topic}'`
      //     connection.query(sql_uplogdata, function (error, results) {
      //   if (error) throw error;
      //   // console.log("Message added: " + message_str);
        
      // });
      
    });
  }else if(onpump){
    var sql1 = `UPDATE house SET pumpres = '${onpump}' WHERE  topic ='${topic}'`
    connection.query(sql1, function (error, results) {
      if (error) throw error;
      // console.log("Message added: " + message_str);

      // var sql_uplogdata = `UPDATE tbl_messages SET status_pump = '${onpump}' WHERE  topic ='${topic}'`
      // connection.query(sql_uplogdata, function (error, results) {
      //   if (error) throw error;
      //   // console.log("Message added: " + message_str);
        
      // });
    });
  }else if(onfan){
    var sql1 = `UPDATE house SET fanres = '${onfan}' WHERE  topic ='${topic}'`
    connection.query(sql1, function (error, results) {
      if (error) throw error;
      // console.log("Message added: " + message_str);
      
      // var sql_uplogdata = `UPDATE tbl_messages SET status_fan = '${onfan}' WHERE  topic ='${topic}'`
      // connection.query(sql_uplogdata, function (error, results) {
      //   if (error) throw error;
      //   // console.log("Message added: " + message_str);
        
      // });
    });
  }

  // var sqlauto = `UPDATE house SET status_pump = 'onoff' WHERE  id ='topic'`

  // connection.query(sqlauto, function (error, resultss) {
  //   if (error) throw error;
  //   console.log("Message added: " + message_str);
  // });
  
};
///////////////-----////////////////////////

// ไม่ได้ใช้ อันนี้ไว้ใช้ตัดเป็น array 
// //split a string into an array of substrings
// function extract_string(message_str) {
// 	var message_arr = message_str.split(","); //convert to array	
// 	return message_arr;
// };	

// //count number of delimiters in a string
// var delimiter = ",";
// function countInstances(message_str) {
// 	var substrings = message_str.split(delimiter);
// 	return substrings.length - 1;
// };

////////////////////////////////////////////////////////
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use("/public", express.static("public"));


// catch 404 and forward to error handler

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});
// error handler
app.use("/login", checkloginRouter);
app.use("/index", indexRouter); // render admin
app.use("/indexuser", indexuser);//rander user
app.use("/users", usersRouter); // หลังบ้าน
app.use("/login", loginRouter);
app.use("/logout", logoutRouter); // render
app.use("/gettoken", gettokenRouter);
app.use("/detailuser", detailuser);

// app.use("/index/useradd",saveuserRouter);




app.use("*", (req, res, next) => {
  res.render("error");
});
// app.listen(3000)
// module.exports = app;
server.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});


