var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
var natural_language_understanding = new NaturalLanguageUnderstandingV1({
  'username': '66c3b439-9b57-48fe-9c53-e5b82d4289f5',
  'password': 'o0zSfj5pkdzs',
  'version_date': '2017-02-27'
});

var parameters = {
    'text': 'this is the most amazing API in the world',
    'features': {
      'entities': {'emotion': true,'sentiment': true,'limit': 2},
      'keywords': {'emotion': true,'sentiment': true,'limit': 2}}}

var iGoogleNewsRSSScraper = require('googlenews-rss-scraper');
natural_language_understanding.analyze(parameters, function(err, response) {
  if (err)
    console.log('REEEEEEEEEEEEEE', err);
  else
    console.log(response);
    emotions = (response["keywords"][0]["emotion"])
    keyword = (response["keywords"][0]["text"])
    console.log(keyword);

    sortable = [];
    for (var emot in emotions) {
      sortable.push([emot, emotions[emot]]);
    }
    sortable.sort(function(a, b) {
      return a[1] - b[1];
    });
    //console.log(sortable);
    var strongest = sortable[4]
    console.log(strongest);

    var related_act = [];

    if (strongest[0] == "sadness"){
      related_act = ["GMO Products", "Sleep Deprevation", "Racism"];
    }
    else if (strongest[0] == "joy"){
      related_act = ["Depression", "Crime", "Middle East"];
    }
    else if (strongest[0] == "fear"){
      related_act = ["Cyptocurrency", "Russia", "Politics"];
    }
    else if (strongest[0] == "anger"){
      related_act = ["Legislation", "Neutrality", "Internet"];
    }
    else {
      related_act = ["Trump", "bitcoin", "America"];
    }
    console.log(related_act)
    var queery = String(related_act);
    var urlList = [];
    iGoogleNewsRSSScraper.getGoogleNewsRSSScraperData( {  newsType: 'QUERY', newsTypeTerms: queery }, function(data) {
      if (!data.error) {
        var dankmeme = (JSON.stringify(data["newsArray"][1]["cleanURL"], null, 2));
        dankmeme = dankmeme.replace(/["]+/g, "'");
        var nohttp = dankmeme.substring(8);
        //*****************************************************
        var parameters = {'url': nohttp,'features': {'categories': {}}};

natural_language_understanding.analyze(parameters, function(err, response) {
    //console.log(JSON.stringify(response, null, 2));
    var supermeme = response["categories"][0]["label"];
    supermeme = supermeme.replace(/[/]+/g, ",");
    supermeme = supermeme.substring(1);
    supermeme = supermeme.split(",");
    var randomValue = supermeme[Math.floor(Math.random() * supermeme.length)];
    console.log(randomValue);
});
        //*****************************************************
      }
    });
});
