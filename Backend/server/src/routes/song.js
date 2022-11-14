const express = require('express')
//const bcrypt = require('bcrypt')

const Joi =require('joi')
const Router = express.Router()
var mysqlConnection = require('../connection/connection')

const jwt =require('jsonwebtoken')
const  ensureToken  = require('../middleware/authenticate')

// mqtt 
const mqtt= require("mqtt");
var client=mqtt.connect('mqtt://broker.hivemq.com');

Router.post('/', ensureToken,function(req, res) {
  
    //variable pattern to store the swing pattern
    const {device_id,song,state}=req.body;
    console.log(req.body);

    //print pattern
    // 
    console.log("song=",song);
    console.log("state=",state);

    //server side validation

    const schema = Joi.object({
        device_id:Joi.string().pattern(/^[0-9]+$/).required(),
        song:Joi.string().min(0).max(100).required(),
       state:Joi.string().min(0).max(20).required(),
    });

    const result = schema.validate(req.body);

    if(result.error){

        res.status(400).send(result.error.details[0].message);
        return;
    }

    var sql = `SELECT * from DEVICE WHERE device_id = ${device_id} `;

    jwt.verify(req.token,'my_secret_key',function(error,data){

        if(error){
            res.sendStatus(403);

        }else{

            mysqlConnection.query(sql,
                [device_id],(error, result) => {
        
                    if(error){
        
                        console.log(error);

        
                    }
        
                    if(result.length > 0){
                        // valid request

                        const data={
                            speaker_state:state,
                            song_name:song

                        };

                        var pub_data=JSON.stringify(data);
                        //console.log("JSON :",pub_data);

                        // mqtt pub method
                        client.publish('cradle/songs/song_name/state',
                                            'state and song :'+pub_data);

                        return res.status(200).json({
                            success: 1,
                            message:'Successfully updated',
                        });
                                            

                        
                    }
                    else{
                        res.json({Status:'Wrong Device ID'});
                    }
                });
            

        }
    })

})

  module.exports = Router
