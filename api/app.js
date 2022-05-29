const express = require('express');
var bodyParser = require('body-parser')
const path = require('path');
const { MongoClient,ObjectId } = require('mongodb');
const app = express();
const root = path.resolve(__dirname, '..');
const urlMongo = ""; //ACÁ PONER URL DEL MONGO Y VER DONDE PONERLA EN LAS ENV
var jsonParser = bodyParser.json()
const axios = require('axios');
// Log invocations
app.use(function (req, res, next) { console.log(req.url); next(); });

const { Console } = require('console');
const https = require('https');
const querystring = require("querystring")


// Directly serve static content from /client
app.use(express.static(root + '/client'));

//Api que retorna en wikidata según texto
app.get('/api/entitieswiki/:id', async (req, res) => {

  try {

    // const queryParams = new URLSearchParams(
    //   //[['query', `select * where { wd:Q${req.params.id} rdfs:label $label . FILTER (lang($label) = 'es')}`],

    //   [['query', 'SELECT ?item ?itemLabel ?_image WHERE { ?item wdt:P279 wd:Q28803. SERVICE wikibase:label { bd:serviceParam wikibase:language "es". } OPTIONAL { ?item wdt:P18 ?_image. }}  LIMIT 100'],


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
      res.send(500, { response: 'Debe ingresar un key' });

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
      res.send(500, { response: 'Debe ingresar un key existente' });

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
app.get('/api/entities/:desc', async (req, res) => {
  try {
    var url = urlMongo;
    const db = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("saw_21_2");
    var filter = {};
    
    if (req.params.desc != 0)
      filter = {'_id': new ObjectId(req.params.desc)}

    var entities = await dbo.collection('entities').find(filter).toArray();

    res.status(200).send(entities)
  } catch (error) {
    res.send(500, { response: 'Ha ocurrido un error: ' + error })
  }
});

module.exports = app;