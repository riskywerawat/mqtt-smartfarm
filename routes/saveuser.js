
      var express = require("express");
      var bodyParser = require("body-parser");
      const router = express.Router();


      var mysql = require("mysql");
                var connection = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "",
                database: "mydb"
                });
     
        router.post("/tesst", function(req, res, next) {
        let data = {user_add: req.body.user_add, pass_add: req.body.pass_add, priority_add: req.body.priority_add};
        let sql = "INSERT INTO accounts SET ?";
        let query = connection.query(sql,data,(err, results) => {
            if(err) throw err;
            res.send("insert");
        });
    //   var mysql = require("mysql");
    //             var connection = mysql.createConnection({
    //             host: "localhost",
    //             user: "root",
    //             password: "",
    //             database: "mydb"
    //             });

    //             connection.connect(function(err){
    //                 if(err) throw err;
    //                 console.log("connected!");
                    
    //             });
    //             var sql = "insert into `accounts` (username,password,priority) values(${} ,${}, ${})"
    //             connection.query(sql,function(err,result){
    //                 if(err) throw err;
    //                 console.log("complete!");
    //                 });

    //             //     function insert() {
              
 
    //             //         var useradd =  document.getElementById("user_add").value
    //             //         var passadd = md5(document.getElementById("pass_add").value) 
    //             //         var priorityadd =  document.getElementById("priority_add").value
             
    //             //         console.log(useradd);
    //             //         console.log(passadd);   
    //             //         console.log(priorityadd);
             
    //             //    }
                   
               
    });    
    router.post
    module.exports = router;