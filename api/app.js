const express = require('express');
var bodyParser = require('body-parser')
const path = require('path');
// const https = require('https');
// const querystring = require("querystring")
const MongoClient = require('mongodb').MongoClient;
const app = express();
const root = path.resolve(__dirname, '..');
const urlMongo = ""; //ACÁ PONER URL DEL MONGO Y VER DONDE PONERLA EN LAS ENV
var jsonParser = bodyParser.json()
const axios = require('axios');
// const { Console } = require('console');
// Log invocations
app.use(function (req, res, next) { console.log(req.url); next(); });

// Directly serve static content from /client
app.use(express.static(root + '/client'));

//Simple REST API that returns some entities
// app.get('/api/entities', (req, res) =>
//   res.send({
//     entities:
//       ['Q2887',
//         'Q33986'
//       ]
//   })
// );

//Api que retorna en wikidata según texto
app.get('/api/entitieswiki/:id', async (req, res) => {
  
    try {
        var url = `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${req.params.id}&limit=10`
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


  // const queryParams = new URLSearchParams(
  //   [['query', `select * where { wd:Q${req.params.id} rdfs:label $label . FILTER (lang($label) = 'es')}`],
  //   ['format', 'json']
  //   ]).toString();
  // const options = {
  //   hostname: 'query.wikidata.org',
  //   port: 443,
  //   path: `/sparql?${queryParams}`,
  //   method: 'GET',
  //   headers: { 'User-Agent': 'Example/1.0' }
  // }
  // https.get(options, httpres => {
  //   let data = [];
  //   console.log('Status Code:', httpres.statusCode);
  //   httpres.on('data', chunk => {
  //     data.push(chunk);
  //   });
  //   httpres.on('end', () => {
  //     console.log('Response ended:');
  //     const result = Buffer.concat(data).toString();
  //     console.log(`Result obtained:\n${result}\n---`);
  //     const json = JSON.parse(result);
  //     const bindings = json.results.bindings;
  //     const label = bindings.length > 0 ? bindings[0].label.value : 'Not found';
  //     res.send({
  //       entity: `${req.params.id}`,
  //       label: `${label}`
  //     })
  //   });
  // }).on('error', err => {
  //   console.log('Error: ', err.message);
  // })
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
    var entitytoupdate = await dbo.collection('entities').findOne({ "entity": req.body.entity });
    if(!req.body.entity || !entitytoupdate){
      //Debe venir este campo para hacer el match y además la orden debe existir
      res.send(500,{ response: 'Debe ingresar un entity' });

    }else{
      console.log("esta es la entity " + entitytoupdate);
      //Se actualiza con los nuevos campos
      await dbo.collection('entities').updateOne(
            { entity:req.body.entity },
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

    var entitytoupdate = await dbo.collection('entities').findOne({ "entity": req.params.id });
    if(!req.params.id || !entitytoupdate){
      //Debe venir este campo para hacer el match y además la orden debe existir
      res.send(500,{ response: 'Debe ingresar un entity existente' });

    }else{
      await dbo.collection('entities').deleteOne({entity:req.params.id}).then(() =>  db.close());  
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
