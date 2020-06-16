var express = require('express');
var router = express();
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydb"
    });


router.post('/getuserById',async (req,res)=>{

    var id = req.body.id;
        
try{
    console.log(id);
    
  var p1 =  await pro1(id);
//   console.log(p1  ,'this p1');
  var p2 = await pro2();  
  //idhouse
    
    
//   console.log(p2 , ' this p2' );


        res.send({id:id,care:p1,/* name:p1[0].username, */house:p2});

}catch(err){
console.log(err);
}    


})
/*    */
router.post('/gethouseById',async (req,res)=>{

    var id = req.body.id;
     

    var id = req.body.id;
    var body = req.body;
    
    var sql = `SELECT * FROM house WHERE  id ='${id}'`
    connection.query(sql,(err,house)=>{
        if(err) throw err;
        
        res.send({id:id,datahouse:house});
    })
       
})
/*    */
router.post('/usergethouse',async (req,res)=>{
    
try{
    var p5 = await pro5();   
    // console.log(p3, ' this p3' );
    // console.log(p3);

  res.send({namehouse:p5});

  }catch(err){
  console.log(err);
  }    

})
router.post('/getid',async (req,res)=>{

    var id = req.body.id;
    var body = req.body;
    

    
try{
    var p3 = await pro3(id);   
    // console.log(p3, ' this p3' );
    
  res.send({id:id,house:p3[0]});
  }catch(err){
  console.log(err);
  }    

})
//******************************************อุณภูมื เริ่มต้นทำกราฟ************************************************************
router.post('/gettempstart',async (req,res)=>{

    var id = req.body.id;    
    var sql = `SELECT * FROM tbl_messages WHERE topic = 'home1' ORDER BY messageID DESC LIMIT 1`;
    connection.query(sql,(err,data)=>{

        res.send({tempstart:data});
    })  

})
//**************************************************************************************************************** */
router.post('/switch_heater', (req, res) =>{
    var id = req.body.id
    var switch_heater = req.body.status
    
    var sql = `UPDATE house SET status_heater = '${switch_heater}' WHERE  id ='${id}'`;
    var status = '';
    connection.query(sql,(err,data)=>{
        // console.log(data);
        if(data){
            status = 'ok';
        }else{
            status = 'error';
        }
        res.send({message:status});


    })

    
    
})

router.post('/switch_pump', (req, res) =>{
    var id = req.body.id
    var switch_pump = req.body.status

    var sql = `UPDATE house SET status_pump = '${switch_pump}' WHERE  id ='${id}'`;
    var status = '';
    connection.query(sql,(err,data)=>{
        // console.log(data);
        if(data){
            status = 'ok';
        }else{
            status = 'error';
        }
        res.send({message:status});
    })    
})

router.post('/switch_fan', (req, res) =>{
    var id = req.body.id
    var switch_fan = req.body.status

    var sql = `UPDATE house SET status_fan = '${switch_fan}' WHERE  id ='${id}'`;
    var status = '';
    connection.query(sql,(err,data)=>{
        // console.log(data);
        if(data){
            status = 'ok';
        }else{
            status = 'error';
        }
        res.send({message:status});
    })    
})


router.post('/switch_status_system', (req, res) =>{
    var id = req.body.id
    var switch_status_system = req.body.status

    var sql = `UPDATE house SET status_system = '${switch_status_system}' WHERE  id ='${id}'`;
    var status = '';
    connection.query(sql,(err,data)=>{
        // console.log(data);
        if(data){
            status = 'ok';
        }else{
            status = 'error';
        }
        res.send({message:status});
    })    

    if(switch_status_system == '0'  ){
        var chk_default = `UPDATE house SET status_heater = 'off',status_pump = 'off', status_fan = 'off'    WHERE  id ='${id}'`;
        connection.query(chk_default,(err,result) =>{
            if(err) throw err;
        })

     }

     if(switch_status_system == '1' ){
        var chk_default_heater = `UPDATE house SET status_heater = 'on',status_pump = 'on', status_fan = 'on'  WHERE  id ='${id}'`;
        connection.query(chk_default_heater,(err,result) =>{
            if(err) throw err;
        })

     }
})

const pro1 = (id)=>{
    /* var sql = `SELECT
    accounts.id,
    accounts.username,
    accounts.password,
    accounts.priority,
    accounts.care,
    accounts.name,
    GROUP_CONCAT(house.house_quntity ORDER BY house.id ASC) AS name_care_house,
    GROUP_CONCAT(house.id ORDER BY house.id ASC) AS name_care_house_id,
    logusercare.namecare,
    logusercare.house
    from accounts
      left join logusercare on accounts.id = logusercare.namecare
      left join house on logusercare.house = house.id
    where accounts.id = '${id}'
    group by accounts.id` */
    var sql = `SELECT
    accounts.id,
    accounts.username,
    accounts.password,
    accounts.priority,
    accounts.care,
    accounts.name,
    logusercare.namecare,
    logusercare.house
    FROM
    accounts
     LEFT JOIN logusercare ON logusercare.namecare = accounts.id
    WHERE accounts.id = '${id}'
    ORDER BY logusercare.house ASC`
    return new Promise((res,rej)=>{
            connection.query(sql,(err,data)=>{
                if(err) rej(err);
                res(data);
            })
    })
}
const pro2 = ()=>{
    var sql = `SELECT * FROM house ORDER BY topic`
    return new Promise((res,rej)=>{
        connection.query(sql,(err,data)=>{
            if(err) rej(err);
            res(data);
        })
    })
}



//////////////////////dashbordอุณภูมื//////////////////////////
//index เก็บค่า ตั้งอุณหภูมิ
const pro3 = (id)=>{
    var sql = `SELECT * FROM house WHERE  id ='${id}'`

    // var house = `UPDATE house SET care = '${option}' WHERE  id ='${id}'`
    return new Promise((res,rej)=>{
        connection.query(sql,(err,data)=>{
            if(err) rej(err);
            res(data);
        })
    })
}



const pro4 = (id)=>{
    // var sql = `UPDATE house SET temp = '${}' WHERE  id ='${id}'`

    // var house = `UPDATE house SET care = '${option}' WHERE  id ='${id}'`
    return new Promise((res,rej)=>{
        connection.query(sql,(err,data)=>{
            if(err) rej(err);
            res(data);
        })
    })
}

/* user length */
const pro5 = ()=>{
    var sql = `SELECT * FROM house ORDER BY topic DESC`
    return new Promise((res,rej)=>{
        connection.query(sql,(err,data)=>{
            if(err) rej(err);
            res(data);
        })
    })
}


/* pagemember idhouse  */

//onclick index dashbord

//  res.send(option);
module.exports = router;