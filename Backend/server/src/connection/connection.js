const mysql = require('mysql');

const mysqlConnection=mysql.createConnection({

    host:'localhost',
    user:'root',
    password:'Mango123',
    database:'projectCradle',

});

mysqlConnection.connect(function(error){
    if(error){
        console.log(error);
    }else{

        console.log('Connected to the databse : cradle');

    }
});

module.exports = mysqlConnection;

