var express = require("express");
const md5 = require("md5");
var mysql = require("mysql");
var connection = mysql.createConnection({
host: "localhost",
user: "root",
password: "",
database: "mydb"
});

var router = express.Router();
const {
  ensureAuthenticated,
  forwardAuthenticated

} = require("../config/local_authen/authen");

router.get("/", ensureAuthenticated, function(req, res, next) {
/*   var sqlhouse = `SELECT
  house.id,
  house.house_quntity,
  house.note,
  house.topic,
  house.temp,
  house.pump,
  house.fan,
  house.status_heater,
  house.status_pump,
  house.status_fan,
  house.status_system,
  logusercare.namecare,
  house.heaterres,
  house.pumpres,
  house.fanres
  FROM
  logusercare
  LEFT JOIN house ON logusercare.house = house.house_quntity
  WHERE namecare = '${req.user.id}'
  ORDER BY topic ASC` */
  var sqlhouse = `SELECT
  logusercare.namecare,
  logusercare.house,
  house.id,
  house.house_quntity,
  house.note,
  house.topic,
  house.temp,
  house.pump,
  house.fan,
  house.status_heater,
  house.heaterres,
  house.status_pump,
  house.pumpres,
  house.status_fan,
  house.fanres,
  house.status_system
  FROM
  logusercare
  INNER JOIN house ON house.id = logusercare.house
  WHERE namecare = '${req.user.id}'
  ORDER BY topic ASC
  `
 
  connection.query(sqlhouse,function(err,house){
    if(err) throw err;


        res.render("user", { title: "Express",user:req.user.username,numhouse:house });
  });

    //view index
  });

  router.get("/user_home", ensureAuthenticated, function(req, res, next) {
    res.render("user_home", { title: "Express",user:req.user.username });
    //view index
  });


module.exports = router;
