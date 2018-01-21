

const express = require('express');
const fs = require('fs');
const request = require('request')

var app = express();

app.use(function(req, res, next){
  console.log(req.method);
  console.log(req.url);
  next();
});

app.get('/', function(req, res){
  console.log(req.method);
  res.json({next: 'next'});
  if (req.method === 'POST'){
    res.send('POST');
  }
});

app.post('/action', function(req, res){
  res.json({post: 'post'});
})

app.listen(3000);
