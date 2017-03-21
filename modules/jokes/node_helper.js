var NodeHelper = require("node_helper");
var request = require("request");

module.exports = NodeHelper.create({

  start: function() {
    console.log(this.name + ' helper started...')
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "DISPLAY_JOKE") {
      console.log("listening for jokes")
      this.sendSocketNotification("CONNECTED");
    }else if (notification === "JOKE") {
        console.log("Currently Retrieving you a joke.")
        this.fetchJoke(payload);
    }
  },

  fetchJoke: function (payload) {
    var url = payload.baseUrl
    var self = this

    request({url: url, method: "GET"}, function(error, response, body) {
      if (!error && response.statusCode === 200) {
          var parsedResult = JSON.parse(body);
          self.sendSocketNotification("JOKE_RESULT", parsedResult);
      }
    })
  }
})
