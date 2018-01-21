var express = require('express');
var path = require('path');
var app = express();
var request = require('request');
var fs = require('fs');
var port = 8080;

var url = "https://ca.indeed.com/viewjob?jk=aa3b5165ed1a57c5&q=software&l=Mississauga%2C+ON&tk=1c4blhcvh0k4a6kl&from=web&advn=2234586402336482&sjdu=XA2wFZaaPuZd2djpknehn6g_t4ayDHJM1fVtjsPDl5MiSpDZLavbfj9ZLJNKUvVO7nnlrdsxYLAmCtKUsmipGXuAID3mR9Gf2FDC3TzFltnXwxTVivFrGvR0j6ARfPRv&acatk=1c4bli06g5t0oetq&pub=4a1b367933fd867b19b072952f68dceb"

request(url, function(err, resp, body) {
  var $ = cheerio.load(body);
  var companyName = $('.company');
  var companyNameText = companyName.text();
  console.log(companyNameText);
});

app.listen(port);
console.log('server running on ' + port);
