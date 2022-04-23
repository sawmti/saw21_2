const express = require('express');
const path = require('path');
const https = require('https');
const querystring = require("querystring")

const app = express();
const root = path.resolve(__dirname, '..');

// Log invocations
app.use(function (req, res, next) { console.log(req.url); next(); });

// Directly serve static content from /client
app.use(express.static(root + '/client'));

// Simple REST API that returns some entities
app.get('/api/entities', (req, res) =>
  res.send({
    entities:
      ['Q2887',
        'Q33986'
      ]
  })
);

app.get('/api/entities/:id', (req, res) => {
  console.log(`Searching ${req.params.id}`);
  const queryParams = new URLSearchParams(
    [['query', `select * where { wd:Q${req.params.id} rdfs:label $label . FILTER (lang($label) = 'es')}`],
    ['format', 'json']
    ]).toString();
  const options = {
    hostname: 'query.wikidata.org',
    port: 443,
    path: `/sparql?${queryParams}`,
    method: 'GET',
    headers: { 'User-Agent': 'Example/1.0' }
  }
  https.get(options, httpres => {
    let data = [];
    console.log('Status Code:', httpres.statusCode);
    httpres.on('data', chunk => {
      data.push(chunk);
    });
    httpres.on('end', () => {
      console.log('Response ended:');
      const result = Buffer.concat(data).toString();
      console.log(`Result obtained:\n${result}\n---`);
      const json = JSON.parse(result);
      const bindings = json.results.bindings;
      const label = bindings.length > 0 ? bindings[0].label.value : 'Not found';
      res.send({
        entity: `${req.params.id}`,
        label: `${label}`
      })
    });
  }).on('error', err => {
    console.log('Error: ', err.message);
  })
});

module.exports = app;
