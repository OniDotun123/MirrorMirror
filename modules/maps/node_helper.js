var Node_Helper = require("node_helper");
var request = require("request");

module.exports = NodeHelper.create({

  start: function() {
    console.log(this.name + ' helper started...');
  },

  socketNotificationReceived: function(notification, payload){
    if(notification === "LISTEN_MAPS"){
      console.log('listening for maps...');
      this.fetchMaps(payload);
    }
  },

  fetchMaps: function(payload){

    var url = payload.articlesEndpoint + payload.source + "&" + payload.sortBy + "&" + payload.apiKey;

    var self = this;

    request({url: url, method: 'GET'}, function(error, response, body){
        if(!error && response.statusCode === 200){
          var parsedResult = JSON.parse(body);
          self.sendSocketNotification('NEWS_RESULT', parsedResult);
        }
    })
  }

})

