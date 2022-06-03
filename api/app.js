 require('dotenv').config();
const express = require('express');
var bodyParser = require('body-parser')
const path = require('path');
const { MongoClient,ObjectId } = require('mongodb');
const app = express();
const root = path.resolve(__dirname, '..');
const urlMongo = process.env.mongoconnection; //ACÁ PONER URL DEL MONGO Y VER DONDE PONERLA EN LAS ENV
var jsonParser = bodyParser.json()
const axios = require('axios');
// Log invocations
app.use(function (req, res, next) { console.log(req.url); next(); });

const { Console, count } = require('console');
const https = require('https');
const querystring = require("querystring")


// Directly serve static content from /client
app.use(express.static(root + '/client'));

//Api que retorna en wikidata según texto
app.get('/api/entitieswiki/:id', async (req, res) => {

  try {


    var url = urlMongo;
    const db = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("saw_21_2");
    var data = await dbo.collection('countries').findOne();
    
    if(data.countries.filter(e => e.name_es.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase() === req.params.id.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()).length > 0){
      console.log("Es país");
      var url = `https://es.wikipedia.org/w/rest.php/v1/search/page?q=${req.params.id}&limit=1`
      console.log(url);
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
    }else{
      console.log("No es país");
      res.send(400, { response: "Debe ingresar un país" })
    }

  } catch (error) {
    console.log("!asdsadasd");
    console.log(error);
    res.send(500, { response: error })
  }
});

//Apis CRUD al Mongo
//POST
app.post('/api/entities', jsonParser, async function (req, res, next) {

  try {
    var url = urlMongo;
    const db = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("saw_21_2");
    await dbo.collection('entities').insertOne(req.body).then(() => db.close());

    res.send(200, { response: 'Se ha insertado correctamente' })
  } catch (error) {
    res.send(500, { response: 'Ha ocurrido un error: ' + error })
  }

});

//PUT
app.put('/api/entities', jsonParser, async function (req, res, next) {

  try {
    var url = urlMongo;
    const db = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("saw_21_2");
    var entitytoupdate = await dbo.collection('entities').findOne({'_id': new ObjectId(req.body.id)});
    if (!req.body.id || !entitytoupdate) {
      //Debe venir este campo para hacer el match y además la orden debe existir
      res.send(400, { response: 'Debe ingresar un id' });

    } else {
      console.log(JSON.stringify(req.body));
      //Se actualiza con los nuevos campos
      await dbo.collection('entities').updateOne(
        {'_id':new ObjectId(req.body.id)},
        { $set: req.body },
        { upsert: false }
      ).then(() => db.close());
      res.send(200, { response: 'Se ha actualizado correctamente' })

    }

  } catch (error) {
    res.send(500, { response: 'Ha ocurrido un error: ' + error })
  }

});

//DELETE
app.delete('/api/entities/:id', async (req, res) => {

  try {

    var url = urlMongo;
    const db = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("saw_21_2");
    console.log("Entró al delete con este id: "+ req.params.id);
    var entitytoupdate = await dbo.collection('entities').findOne({'_id': new ObjectId(req.params.id)});
    
    if (!req.params.id || !entitytoupdate) {
      //Debe venir este campo para hacer el match y además la orden debe existir
      res.send(400, { response: 'Debe ingresar un key existente' });

    } else {
      await dbo.collection('entities').deleteOne({'_id':new ObjectId(req.params.id)}).then(() => db.close());
      res.send(200, { response: 'Se ha eliminado correctamente' })
    }

  } catch (error) {
    console.log(error);
    res.send(500, { response: 'Ha ocurrido un error: ' + error })
  }
});

//GET 
app.get('/api/entities/:desc/:typeid', async (req, res) => {
  try {
    var url = urlMongo;
    const db = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("saw_21_2");
    var filter = {};
    var entities;
    if (req.params.typeid == 1){ // == 1 es por id mongo
      if (req.params.desc != 0)
        filter = {'_id': new ObjectId(req.params.desc)}

    entities = await dbo.collection('entities').find(filter).toArray();

    }else{
      filter = {'key': req.params.desc}
      var entities = await dbo.collection('entities').find(filter).toArray();
    }
  
    if (entities.length === 0 ){
      res.send(404, { response: 'País no encontrado' });
    }else{
      res.status(200).send(entities);
    }

  } catch (error) {
    res.send(500, { response: 'Ha ocurrido un error: ' + error })
  }
});

module.exports = app;