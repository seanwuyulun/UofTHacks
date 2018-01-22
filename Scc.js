var request = require('request'),
    cheerio = require('cheerio');

request('https://www.eventbrite.ca/e/st-james-campus-orientation-for-new-international-student-january-2018-intake-students-tickets-40848922226?aff=ebdssbcitybrowse',
function(err, resp, body){
  if(!err && resp.statusCode == 200) {
    var $ = cheerio.load(body);
    var location = $('.event-details__data');
    var locationText = location.text();
    locationText.replace(/ /g,'')
    var finalString = locationText.substring((locationText.length) / 2)
    console.log(finalString);
  }
})
