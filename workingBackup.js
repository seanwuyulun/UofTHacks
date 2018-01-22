'use strict';

const functions = require('firebase-functions'); // Cloud Functions for Firebase library
const DialogflowApp = require('actions-on-google').DialogflowApp; // Google Assistant helper library
const http = require('https');
const request = require('request');
const cheerio = require('cheerio');

var actionMap = new Map();
actionMap.set('welcome.no', app => app.tell('Ok, let me know if you need any help on finding things to do!'));
actionMap.set('welcome.yes', app => app.ask('Would you like to attend a free event?'));
actionMap.set('criteria.free', app => changeCriFree(app));
actionMap.set('criteria.city', app => changeCriCity(app));
actionMap.set('criteria.catagory1.yes', app => changeCriCata(app));
actionMap.set('criteria.catagory1.no', app => changeCriCata1(app));
actionMap.set('criteria.catagory2.yes', app => changeCriCata(app));
actionMap.set('criteria.catagory2.no', app => changeCriCata2(app));
actionMap.set('criteria.catagory3.yes', app => changeCriCata(app));
actionMap.set('aftersearch.yes', app => sendMapLink(app));
actionMap.set('aftersearch.no', app => notInterested(app));
actionMap.set('directsearch', app => directSearch(app));



const eventHost = 'https://www.eventbriteapi.com';
const event_api_token = '';


// var parameters = {
//     'text': 'this is the most amazing API in the world',
//     'features': {
//       'entities': {'emotion': true,'sentiment': true,'limit': 2},
//       'keywords': {'emotion': true,'sentiment': true,'limit': 2}}}

// var iGoogleNewsRSSScraper = require('googlenews-rss-scraper');
// natural_language_understanding.analyze(parameters, function(err, response) {
//   if (err)
//     console.log('REEEEEEEEEEEEEE', err);
//   else
//     console.log(response);
//     emotions = (response["keywords"][0]["emotion"])
//     keyword = (response["keywords"][0]["text"])
//     console.log(keyword);

//     sortable = [];
//     for (var emot in emotions) {
//       sortable.push([emot, emotions[emot]]);
//     }
//     sortable.sort(function(a, b) {
//       return a[1] - b[1];
//     });
//     //console.log(sortable);
//     var strongest = sortable[4]
//     console.log(strongest);

//     var related_act = [];

//     if (strongest[0] == "sadness"){
//       related_act = ["GMO Products", "Sleep Deprevation", "Racism"];
//     }
//     else if (strongest[0] == "joy"){
//       related_act = ["Depression", "Crime", "Middle East"];
//     }
//     else if (strongest[0] == "fear"){
//       related_act = ["Cyptocurrency", "Russia", "Politics"];
//     }
//     else if (strongest[0] == "anger"){
//       related_act = ["Legislation", "Neutrality", "Internet"];
//     }
//     else {
//       related_act = ["Trump", "bitcoin", "America"];
//     }
//     console.log(related_act)
//     var queery = String(related_act);
//     var urlList = [];
//     iGoogleNewsRSSScraper.getGoogleNewsRSSScraperData( {  newsType: 'QUERY', newsTypeTerms: queery }, function(data) {
//       if (!data.error) {
//         var dankmeme = (JSON.stringify(data["newsArray"][1]["cleanURL"], null, 2));
//         dankmeme = dankmeme.replace(/["]+/g, "'");
//         var nohttp = dankmeme.substring(8);
//         //*****************************************************
//         var parameters = {'url': nohttp,'features': {'categories': {}}};

// natural_language_understanding.analyze(parameters, function(err, response) {
//     //console.log(JSON.stringify(response, null, 2));
//     var supermeme = response["categories"][0]["label"];
//     supermeme = supermeme.replace(/[/]+/g, ",");
//     supermeme = supermeme.substring(1);
//     supermeme = supermeme.split(",");
//     var randomValue = supermeme[Math.floor(Math.random() * supermeme.length)];
//     console.log(randomValue);
// });
//         //*****************************************************
//       }
//     });
// });


// for storing last location link
var lastLocationLink;
// for storing search result
var result;
// catagory const
const catagoryID_on_eventapi = {
  music : 103,
  food : 110,
  art : 113,
  media : 104,
  sport : 108,
  outdoor : 109,
  charity : 111,
  other : 199,
  pro: 101
};

// for storing returned event url by eventBrite
var eventBriteUrl;

//this is the default criteria, which could be updated by user input
var oCriteria = {
  free: true,
  location: 'toronto',
  catagory: ['sport', 'food', 'music']
};

// var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
// var natural_language_understanding = new NaturalLanguageUnderstandingV1({
//   'username': '',
//   'password': '',
//   'version_date': '2017-02-27'
// });



// calls EventBrite api and returns result array
// function callEventApi(path) {
//     console.log('callEventApi Invoked');
//   return new Promise((resolve, reject) => {
//       console.log(path);
//     request({
//       url: path,
//       method: 'GET',
//       json: true,
//       function(err, res){
//           console.log('fetch end');
//           console.log(res);
//         if (!err){
//           let response = res.json();
//           result = response.events;
//           resolve(response);
//         }
//         reject(err);
//       }
//     });
//   });
// }

function callEventApi(path) {
  console.log('callEventApi Invoked');
  return new Promise((resolve, reject) => {
    http.get(path, (res) => {
      let body = '';
      res.on('data', (d) => { body += d;});
      res.on('end', () => {
        let response = JSON.parse(body);
        //console.log(response);
        result = response;
        resolve(response);
      });
      res.on('error', (error) => {
        reject(error);
      });
    });
  });
}

//changes criteria/free
function changeCriFree(app){
  if (app.getArgument('choice') == 'yes'){
      oCriteria.free = true;
  } else {
      oCriteria.free = false;
  }
  console.log(oCriteria.free);
  app.ask('In which city?');
}

//changes criteria/location
function changeCriCity(app){
  oCriteria.location = app.getArgument('location');
  console.log(oCriteria.location);
  app.ask('Do you want to be active?');
}

function directSearch(app){
    if (app.getArgument('catagory') == 'active'){
        oCriteria.catagory = ['sport', 'outdoor'];
    } else if (app.getArgument('catagory') == 'entertainment'){
        oCriteria.catagory = ['music', 'art', 'media', 'food'];
    } else if (app.getArgument('catagory') == 'other'){
        oCriteria.catagory = ['other', 'charity', 'pro'];
    }

    oCriteria.location = app.getArgument('location');

    if (app.getArgument('free') == 'free'){
        oCriteria.free = true;
    } else if (app.getArgument('free') == 'no'){
        oCriteria.free = false;
    }

    pickEvent(app);
}

//changes criteria/catagory
function changeCriCata(app){
  console.log(app.getArgument('catagory'));
  if (app.getArgument('catagory') == 'active'){
    oCriteria.catagory = ['sport', 'outdoor'];
  } else if (app.getArgument('catagory') == 'entertainment'){
    oCriteria.catagory = ['music', 'art', 'media', 'food'];
  }
  pickEvent(app);
}

function changeCriCata1(app){
  app.ask('How about some casual fun?');
}

function changeCriCata2(app){
  oCriteria.catagory = ['other', 'charity', 'pro'];
  app.ask('I will try find you something. Don\'t worry');
  pickEvent(app);
}

//call EventBrite api and returns a json list
function getEvents(oCriteria) {
    console.log('getEvents Invoked');
  var request_url = eventHost + '/v3/events/search/?';
  if((oCriteria.free !== '' ) || oCriteria.location !== '' || oCriteria.catagory.length !== 0) {
    if( oCriteria.free !== '' && (oCriteria.free === true || oCriteria.free === false)  ) {
      request_url += '&price=';
      request_url += oCriteria.free;
    }
    if(oCriteria.location !== '') {
      request_url += '&location.address=';
      request_url += oCriteria.location;
    }
    if(oCriteria.catagory.length !== 0) {
      request_url += '&categories=';
      request_url += catagoryID_on_eventapi[ oCriteria.catagory[0] ];
      for(var i = 1; i < oCriteria.catagory.length; i++ ) {
        request_url += ('%2C' + catagoryID_on_eventapi[ oCriteria.catagory[i] ]);
      }
    }
  }
  request_url += '&start_date.keyword=today'
  request_url += '&token=';
  request_url += event_api_token;

  return callEventApi(request_url);
}

function pickEvent(app) {
    console.log('pickEvent Invoked');
  var greetingList = ['Hey, I found this for you!', 'Check this out!', 'How about this?', 'There you go!'];
  var index = Math.floor((Math.random() * 4));
  getEvents(oCriteria).then((output) => {
    if(output.events.length === 0) {
      app.tell('I am very sorry. I could not find anything for you. I will try to do better next time!');
    } else {
      let one_event = output.events[0];
      var event_text = unescape(one_event.name.text);
      app.ask(`${greetingList[index]} ${event_text}`);
    }
  });
}

function notInterested(app) {
  result.shift();
  var greetingList = ['Hey, I found this for you!', 'Check this out!', 'How about this?', 'There you go!'];
  var index = Math.floor((Math.random() * 4));
  if (result.length === 0) {
    app.tell('Sorry, I cannot find anything anymore. I will try harder next time!');
  } else {
    let one_event = result.events[0];
    var event_text = unescape(one_event.name.text);
    app.ask(`${greetingList[index]} ${event_text}`);
  }
}

var generateMapUrl = (url) => {
  return new Promise((resolve, reject) => {
    request(
      url,
      function(err, resp, body){
        if(!err && resp.statusCode == 200) {
          var $ = cheerio.load(body);
          var location = $('.event-details__data');
          //console.log(location);
          var locationText = location.text();
          var finalString = locationText.substring((locationText.length) / 2);
          var stringArray = finalString.replace(/\s\s+/g, ' ').split(' ');
          var start = stringArray.indexOf('Calendar');
          var end = stringArray.indexOf('View');
          stringArray = stringArray.slice(start + 1, end);
          finalString = stringArray.join(' ');
          var googleMapUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(finalString);
          resolve(googleMapUrl);
        }
      });
    });
  };

  //send more information
  function sendMapLink(app) {
    eventBriteUrl = result.events[0].url;
    generateMapUrl(eventBriteUrl).then((url) => {
      lastLocationLink = url;
      app.ask(app.buildRichResponse()
      .addSimpleResponse({
        speech: 'I just sent more details to your phone, check it out!',
        displayText: `Discription: ${unescape(result.events[0].description.text)}` + '\nHere is the location of the event.'
      })
      //.addSuggestions(['0', '42', '100', 'Never mind'])
      .addSuggestionLink('Google Map', lastLocationLink)
    );
  });
}


exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  const app = new DialogflowApp({request, response});
  app.handleRequest(actionMap);
});
