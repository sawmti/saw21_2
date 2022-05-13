const express = require('express');
var bodyParser = require('body-parser')
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const root = path.resolve(__dirname, '..');
const urlMongo = "mongodb://admin:4%26%24COk0wGRWTygjB%2a%2aG2%2a1hhInstance@18.229.117.60:26033/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"; //ACÁ PONER URL DEL MONGO Y VER DONDE PONERLA EN LAS ENV
var jsonParser = bodyParser.json()
const axios = require('axios');
// Log invocations
app.use(function (req, res, next) { console.log(req.url); next(); });

// Directly serve static content from /client
app.use(express.static(root + '/client'));

//Api que retorna en wikidata según texto
app.get('/api/entitieswiki/:id', async (req, res) => {
  
    try {
        var url = `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${req.params.id}&limit=1`
        var config = {
            method: 'get',
            url: url,
            headers: {}
        };
       
        await  axios(config)
            .then(async function (response) {
             
                res.status(200).send(response.data.pages)
            })
            .catch(function (error) {
                console.log(error);
                res.send(500,{ response: error })
            });
    } catch (error) {
        console.log(error);
        res.send(500,{ response: error })
    }
});


//Apis CRUD al Mongo
//POST
app.post('/api/entities',jsonParser, async function (req, res, next) {

  try{
    var url =urlMongo;
    const db = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("saw_21_2");
    await dbo.collection('entities').insertOne(req.body).then(() =>  db.close());  
        
    res.send(200,{ response: 'Se ha insertado correctamente' })
  }catch(error){
    res.send(500,{ response: 'Ha ocurrido un error: ' + error})
  }
 
});

//PUT
app.put('/api/entities',jsonParser, async function (req, res, next) {

  try{
    var url =urlMongo;
    const db = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("saw_21_2");
    var entitytoupdate = await dbo.collection('entities').findOne({ "key": req.body.key });
    if(!req.body.key || !entitytoupdate){
      //Debe venir este campo para hacer el match y además la orden debe existir
      res.send(500,{ response: 'Debe ingresar un key' });

    }else{
      console.log("esta es la key " + entitytoupdate);
      //Se actualiza con los nuevos campos
      await dbo.collection('entities').updateOne(
            { key:req.body.key },
            { $set: req.body },
            { upsert: false }
      ).then(() => db.close());
      res.send(200,{ response: 'Se ha actualizado correctamente' })
      
    }

  }catch(error){
    res.send(500,{ response: 'Ha ocurrido un error: ' + error})
  }
 
});

//DELETE
app.delete('/api/entities/:id', async (req, res) => {
  
  try{
    var url =urlMongo;
    const db = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("saw_21_2");

    var entitytoupdate = await dbo.collection('entities').findOne({ "key": req.params.id });
    if(!req.params.id || !entitytoupdate){
      //Debe venir este campo para hacer el match y además la orden debe existir
      res.send(500,{ response: 'Debe ingresar un key existente' });

    }else{
      await dbo.collection('entities').deleteOne({key:req.params.id}).then(() =>  db.close());  
        res.send(200,{ response: 'Se ha eliminado correctamente' })
      
    }

  }catch(error){
    res.send(500,{ response: 'Ha ocurrido un error: ' + error})
  }
});

//GET 
app.get('/api/entities/:desc', async (req, res) => {
  try{
    var url =urlMongo;
    const db = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("saw_21_2");
    var filter = {};

    if(req.params.desc != 0)
      filter = {description: req.params.desc }

    var entities = await dbo.collection('entities').find(filter).toArray();
    
    res.status(200).send(entities)
  }catch(error){
    res.send(500,{ response: 'Ha ocurrido un error: ' + error})
  }
});

module.exports = app;