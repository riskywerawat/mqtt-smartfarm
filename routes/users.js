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
//หลังบ้าน
/* GET home page.  */
// router.get("/", ensureAuthenticated, function(req, res, next) {
//   res.render("user", { title: "Express",user:req.user.username });
//   //view index
// });
//add user
router.post('/adduser',(req,res,next)=>{
  const body = req.body;
  
  
  // const test = req.body.user_add;
  const user_add = req.body.user_add.trim();
  const pass_add = req.body.pass_add;
  const pass_addd = md5(req.body.pass_add);
  const priority_add = req.body.priority_add;


  const houseadd = req.body.houseadduser;
  const idacc = req.body.idacc;
  var sql = `insert into accounts (username,password,priority) values('${user_add}','${pass_addd}','${priority_add}')`
              connection.query(sql,function(err,result){
                  if(err) throw err;
                  console.log("complete!");
                  });
  
  for(let k = 0 ; k< houseadd.length;k++){

 var user_care = `insert into logusercare (namecare,house) values('${idacc}','${houseadd[k]}')`
              connection.query(user_care,function(err,result1){
                  if(err) throw err;
                  console.log("complete!");
                  });
                }
   res.redirect('/index/adduser');
})


router.post('/addhouse',(req,res,next)=>{
  const body = req.body;
  const nameadd = req.body.namehouseadd.trim();
  const noteadd = req.body.noteadd.trim();
  const topic = req.body.topic.trim();
  
  var sql = `insert into house (house_quntity,note,topic,status_heater,heaterres,status_pump,pumpres,status_fan,fanres,status_system)
             values('${nameadd}','${noteadd}','${topic}','off','off','off','off','off','off','0')`

  
              connection.query(sql,function(err,result){
                  if(err) throw err;
                  console.log("complete!");
                  });
  

   res.redirect('/index/addhouse');
})
router.post('/deletehouse',(req,res,next)=>{
  const body = req.body;
  const id = req.body.getidhouse;
  

  /* console.log(req.body.loghouse); */
  
  var sql = `DELETE FROM house WHERE id = '${id}'`
              connection.query(sql,function(err,result){
                  if(err) throw err;
                  console.log("complete!");
                  
                });   
                console.log(id);
      
      
    var sqllogusercare = `DELETE FROM logusercare WHERE house = "${id}"`
      connection.query(sqllogusercare,function(err,result1){
          if(err) throw err;
          console.log("complete!");
          
        });   
                
                      
      
                
        
   res.redirect('/index/addhouse');
})
//ให้สิทธิ user ดู แลล
router.post('/member',async (req,res,next)=>{
  const body = req.body;
  
  const option = req.body.house;

  const option_chk = req.body.house;

  const check = req.body.check;

  var id = req.body.getid;
  var name = req.body.username;


 

  var in_de = req.body.in;

  // console.log(id);
  // console.log(option);
  // console.log(check);
  // console.log(name);
/* console.log(in_de); */

  if(in_de == "1"){
      // var sql = `UPDATE accounts SET care = '${option}' WHERE  id ='${id}'`
      // connection.query(sql,function(err,result){
      //   if(err) throw err;
      //   console.log("complete!");
      // });

      var sqldelete = `DELETE FROM logusercare WHERE namecare = '${id}' `
      connection.query(sqldelete,function(err,result){
        if(err) throw err;
        console.log("complete!");
      });    

        if(check > 0){
       
          for(let i = 0 ; i <  option.length ; i++){

            var sqlloghouse = `insert into logusercare (namecare,house) values('${id}','${option[i]}')`;
            connection.query(sqlloghouse,function(err,result){
              if(err) throw err;
              console.log("complete!");
            });
          }
        }
  }else if(in_de == "2"){
  var sql = `DELETE FROM accounts WHERE id = '${id}' `       
    connection.query(sql,function(err,result){
      if(err) throw err;
      console.log("complete!");
    });

    var sql1 = `DELETE FROM logusercare WHERE namecare = '${id}' `       
    connection.query(sql1,function(err,result){
      if(err) throw err;
      console.log("complete!");
    });


  }
 
                
   res.redirect('/index/member');
  
   
})

//รับค่าจากหน้า dashbord admin
router.post("/gettemp", ensureAuthenticated, function(req, res, next) {
 
  var pub = req.body;
  var nameedit = req.user.username;
  var gettemp = req.body.settemp;
  var id = req.body.getidtemp;
  var housename = req.body.gethousetemp;

 console.log(id);
 
  
  //pump
  var logtemp = req.body.logtemp;
  var logtemp = req.body.logtemp
  
  var sqlup =  `UPDATE house SET temp = '${gettemp}' WHERE  id ='${id}'`
  connection.query(sqlup,function(err,result1){
    if(err) throw err;
    console.log("complete!");
  });


  var sql = `insert into loghouse (house_quntity,nameedit,temp) values('${housename}','${nameedit}','${gettemp}')`
  connection.query(sql,function(err,result){
    if(err) throw err;
    console.log("complete!");
  });

  
  console.log(pub);
  
  // console.log(getpump);
  // console.log(id);
  // console.log(nameedit);
  res.redirect('/index');

});


router.post("/getpump", ensureAuthenticated, function(req, res, next) {
 
  var pub = req.body;
  var nameedit = req.user.username;
  var getpump = req.body.setpump;
  var id = req.body.getidpump;
  var housename = req.body.gethousepump;

  //temp
  var sql = `insert into loghouse (house_quntity,nameedit,pump) values('${housename}','${nameedit}','${getpump}')`
  connection.query(sql,function(err,result){
    if(err) throw err;
    console.log("complete!");
 
  });
  var sqlup =  `UPDATE house SET pump = '${getpump}' WHERE  id ='${id}'`
  connection.query(sqlup,function(err,result1){
    if(err) throw err;
    console.log("complete!");
  });


  // console.log(gettemp);
  // console.log(id);
  // console.log(nameedit);
  res.redirect('/index');

});



router.post("/getfan", ensureAuthenticated, function(req, res, next) {
 
  var pub = req.body;
  var nameedit = req.user.username;
  var getfan = req.body.setfan;
  var id = req.body.getidfan;
  var housename = req.body.gethousefan;

  //temp
  var sql = `insert into loghouse (house_quntity,nameedit,fan) values('${housename}','${nameedit}','${getfan}')`
  connection.query(sql,function(err,result){
    if(err) throw err;
    console.log("complete!");
 
  });
  var sqlup =  `UPDATE house SET fan = '${getfan}' WHERE  id ='${id}'`
  connection.query(sqlup,function(err,result1){
    if(err) throw err;
    console.log("complete!");
  });


  console.log(getfan);
  // console.log(id);
  // console.log(nameedit);
  res.redirect('/index');

});

///user
router.post("/gettempuser", ensureAuthenticated, function(req, res, next) {
 
  var pub = req.body;
  var nameedit = req.user.username;
  var gettemp = req.body.settemp;
  var id = req.body.getidtemp;
  var housename = req.body.gethousetemp;

 console.log(id);
 
  
  //pump
  var logtemp = req.body.logtemp;
  var logtemp = req.body.logtemp
  
  var sqlup =  `UPDATE house SET temp = '${gettemp}' WHERE  id ='${id}'`
  connection.query(sqlup,function(err,result1){
    if(err) throw err;
    console.log("complete!");
  });


  var sql = `insert into loghouse (house_quntity,nameedit,temp) values('${housename}','${nameedit}','${gettemp}')`
  connection.query(sql,function(err,result){
    if(err) throw err;
    console.log("complete!");
  });

  
  console.log(pub);
  
  // console.log(getpump);
  // console.log(id);
  // console.log(nameedit);
  res.redirect('/indexuser');

});


router.post("/getpumpuser", ensureAuthenticated, function(req, res, next) {
 
  var pub = req.body;
  var nameedit = req.user.username;
  var getpump = req.body.setpump;
  var id = req.body.getidpump;
  var housename = req.body.gethousepump;

  //temp
  var sql = `insert into loghouse (house_quntity,nameedit,pump) values('${housename}','${nameedit}','${getpump}')`
  connection.query(sql,function(err,result){
    if(err) throw err;
    console.log("complete!");
 
  });
  var sqlup =  `UPDATE house SET pump = '${getpump}' WHERE  id ='${id}'`
  connection.query(sqlup,function(err,result1){
    if(err) throw err;
    console.log("complete!");
  });


  // console.log(gettemp);
  // console.log(id);
  // console.log(nameedit);
  res.redirect('/indexuser');

});



router.post("/getfanuser", ensureAuthenticated, function(req, res, next) {
 
  var pub = req.body;
  var nameedit = req.user.username;
  var getfan = req.body.setfan;
  var id = req.body.getidfan;
  var housename = req.body.gethousefan;

  //temp
  var sql = `insert into loghouse (house_quntity,nameedit,fan) values('${housename}','${nameedit}','${getfan}')`
  connection.query(sql,function(err,result){
    if(err) throw err;
    console.log("complete!");
 
  });
  var sqlup =  `UPDATE house SET fan = '${getfan}' WHERE  id ='${id}'`
  connection.query(sqlup,function(err,result1){
    if(err) throw err;
    console.log("complete!");
  });


  console.log(getfan);
  // console.log(id);
  // console.log(nameedit);
  res.redirect('/indexuser');

});
module.exports = router;
