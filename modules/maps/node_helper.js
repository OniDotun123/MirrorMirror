var Node_Helper = require("node_helper");
var request = require("request");

module.exports = NodeHelper.create({

  start: function() {
    console.log(this.name + ' helper started...');
  },

  socketNotificationReceived: function(notification, payload){
    if(notification === "LISTEN_MAPS"){
      console.log('listening for maps...');
      this.fetchMap(payload);
    }
  },

  fetchMaps: function(payload){

    var url = payload.baseurl + payload.apikey + '&q=' + payload.origin + '&zoom=15';
    var self = this;

    self.sendSocketNotification('MAPS_RESULT', url);

  }

})

