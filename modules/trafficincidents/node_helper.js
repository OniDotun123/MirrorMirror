var NodeHelper = require("node_helper");
var request = require("request");

module.exports = NodeHelper.create({
  start: function() {
    console.log(this.name + ' helper started...');

  },

  socketNotificationReceived: function(notification, payload){
    if(notification === "TRAFFIC_REQUEST"){
      console.log("This is a test...")
    }else if(notification === "NEED_UPDATES"){
      console.log("getting traffic updates");
      this.getTrafficData(payload);
    }
  },

  getTrafficData: function(payload){
    var apiUrl = payload.baseUrl + payload.CK + "&boundingBox=" + payload.TL + "," + payload.TR + "," + payload.BL + "," + payload.BR;

    var self = this;

    request({url: apiUrl, method: "GET"}, function(error, response, body){
      if (!error && response.statusCode === 200){
        var parsedData = JSON.parse(body);
        self.sendSocketNotification("TRAFFIC_ALERTS", parsedData);
      }
    })
  }

})
