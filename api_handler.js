// exports.findloc = function(req, res) {
// 	var key = req.query.key;
// 	var radius = req.query.radius? req.query.radius : 10000;
// 	var keyword = req.query.keyword? req.query.keyword : null;
// 	//var minprice
// 	//var maxprice
// 	// var opennow
// 	// var rankby;

// 	var https = require('https');
// 	var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" + "key= " ; //+ "&location=" + location + "&radius=" + radius + "&sensor=" + sensor + "&types=" + types + "&keyword=" + keyword;
    
//     https.get(url, function(response) {
//     	var body = '';
//     	response.on('data', function(chunk) {
//     		body += chunk;
//     	});
//     	response.on('end', function() {
//     		var places = JSON.parse(body);
//     		var locations = places.results;
//     		console.log(locations);
//     	});
//     }).on('error', function(e) {
//     	console.log('got error:' + e.message);
//     });
// };


'use strict';

const http = require('https');
const mapHost = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
const map_api_key = 'AIzaSyAvHfkAgdVfJirVplYK4AJm9AlIjfuLCcM';
const eventHost = 'https://www.eventbriteapi.com';
const event_api_token = 'BIULIDSMSLAPALHQXCIY';

// exports.eventWebhook = (req, res) => {
// 	//
// }


// function callMapApi(oCriteria) {
// 	return new Promise((resolve, reject) => {

// 	})
// }


var result;

var catagoryID_on_eventapi = {
	music : 103,
	food : 110,
	art : 113,
	media : 104,
	sport : 108,
	outdoor : 109,
	charity : 111,
	other : 199
}

//this is the default criteria, which could be updated by user input
var oCriteria = {
	free: true,
	location: 'toronto',
	catagory: ['sport', 'food', 'music']
};

//calls EventBrite api and returns result array
function callEventApi(path) {
	return new Promise((resolve, reject) => {
		http.get(path, (res) => {
			let body = '';
			res.on('data', (d) => { body += d;});
			res.on('end', () => {
				let response = JSON.parse(body);
				console.log(response);
				resolve(response);
			});
			res.on('error', (error) => {
				reject(error);
			});
		});
	});
};

//returns best event
function getEvents(oCriteria) {
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
};


getEvents(oCriteria);

