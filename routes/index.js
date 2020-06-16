var express = require("express");
var app = express();
var router = express.Router();
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});


// var mosca = require("mosca"); //
// var mqtt = require("mqtt"); //https://www.npmjs.com/package/mqtt
// var Topic = "home01";
// var Broker_URL = "mqtt://192.168.1.9:1883";
// var options = {
//   clientId: "MyMQTT",
//   port: 1883
//   //username: 'mqtt_user',
//   //password: 'mqtt_password',
//   // keepalive : 60
// };

// var message = "hello world"
// var client = mqtt.connect(Broker_URL, options);

// var sql = `SELECT * FROM house where id = '1'`
// connection.query(sql,function(err,result){
//     if(err) throw err;
//     console.log("complete!");
//     if(result[0].status_heater == 'on'){
//       var sent = result[0].temp;
//     }else if (result[0].status_heater == 'off'){
//       var sent = '';
//     }

// client.on('xxx',()=>{
//   setInterval(()=>{
//     client.publish(Topic,`${sent}`)
//     },5000);

//   });

// });
// var midlewareadmin = require('../authen/authen_admin');
/* GET home page. */
const {
  ensureAuthenticated,
  forwardAuthenticated
} = require("../config/local_authen/authen");
//หน้า rander
router.get("/", ensureAuthenticated, function (req, res, next) {


  var sqlhouse = `SELECT * FROM house ORDER BY topic`
  connection.query(sqlhouse, function (err, house) {
    if (err) throw err;

    var sqllog = `SELECT * FROM loghouse  ORDER BY house_quntity,time DESC`

    connection.query(sqllog, function (err, loghouse) {
      if (err) throw err;

      res.render("index", {
        title: 'Express',
        user: req.user.username,
        numhouse: house, log: loghouse
      }); //view index


    });
  });
});

router.get("/adduser", ensureAuthenticated, function (req, res, next) {
  var sql = `SELECT * FROM house ORDER BY topic`
  connection.query(sql, (err, result) => {

      var acc =  `SELECT * FROM accounts ORDER BY id DESC LIMIT 1`
    connection.query(acc, (err, dataacc) => {
    res.render("useradd", { title: 'Express', user: req.user.username, houseadduser: result,dataacc:dataacc }); //view index
      })
    })
});

function GetAccount(){
  return new Promise(function(resolve,reject){
    var sql = `SELECT * FROM accounts where username != 'admin'`
    connection.query(sql, function (err, result) {
      if(err){
        return reject(err);
      }
      return resolve(result);
    })
  })
}

router.get("/member", ensureAuthenticated, function (req, res, next) {

  var sql = `select accounts.* , GROUP_CONCAT(house.house_quntity ORDER BY house.id ASC) AS name_care_house
  from accounts
  left join logusercare on accounts.id = logusercare.namecare
  left join house on logusercare.house = house.id
  where username != 'admin'
  group by accounts.id`
  connection.query(sql, function (err, result) {
    
    var sql_house = `SELECT * FROM house ORDER BY topic`
    connection.query(sql_house, function (err, result_house) {
      if (err) throw err;
        res.render("member", { data: result,user: req.user.username,result_house: result_house})
    })
  })
})







  // router.get("/test",ensureAuthenticated, function(req, res, next) {

  //   var sql = `SELECT * FROM accounts where username != 'admin'`
  //   connection.query(sql,function(err,result){
  //       if(err) throw err;


  //       var sql_house = `SELECT * FROM house ORDER BY topic`
  //       connection.query(sql_house,function(err,result_house){
  //           if(err) throw err;


  //           var sql_namelog = `SELECT * FROM logusercare`
  //           connection.query(sql_namelog,function(err,sql_namelog){
  //               if(err) throw err;


  //           // res.render("member", { result_house: result_house  }); //view index   
  //           // });
  //           res.render("test", { data: result,result_house:result_house,sess: req.session,sql_namelog:sql_namelog,user:req.user.username}); //view index   

  //           });
  //         });
  //       });

  // });

  router.get("/addhouse", ensureAuthenticated, function (req, res, next) {
    var sql = `SELECT * FROM house ORDER BY topic`
    connection.query(sql, function (err, housecare) {
      if (err) throw err;

      res.render("addhouse", {
        title: 'Express',
        user: req.user.username,
        housecare: housecare
      }); //view index
    });
  });
  router.post('/pub', (req, res, next) => {
    const xxx = req.body;

    console.log(xx);

    res.redirect('/login');
  })

  router.post
  module.exports = router;
