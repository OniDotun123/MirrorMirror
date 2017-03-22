var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({

  start: function(){
    console.log(this.name + 'helper started...');
  },

  socketNotificationReceived: function(notification){
    if(notification === "LISTEN_WEATHER"){
      console.log('listening for weather...');
    }else if(notification === "WEATHER"){
      console.log('getting weather...');
      this.fetchWeather();
    }
  },

  fetchWeather: function(){

    var baseUrl = "https://query.yahooapis.com/v1/public/yql?q=";
    var yql_query = "select * from weather.forecast where woeid=2459115";
    var yql_url = baseUrl + encodeURIComponent(yql_query) + "&format=json"

    var self = this;

    request({url: yql_url, method: "GET"}, function(error, response, body){
      if(!error && response.statusCode === 200){
        var parsedResult = JSON.parse(body);
        self.sendSocketNotification("NEWS_RESULT", parsedResult);
      }

    })
  }

})
