var Node_Helper = require("node_helper");
var request = require("request");

module.exports = NodeHelper.create({

  start: function() {
    console.log(this.name + ' helper started...');
  },

  socketNotificationReceived: function(notification, payload){
    if(notification === "LISTEN_MAPS"){
      console.log('listening for maps...');
      this.sendSocketNotification("CONNECTED");
    }
      else if(notification === "MAP"){
       console.log("getting maps...")
      this.fetchMap(payload);
    }
  },

  fetchMap: function(payload){
    var url = payload.baseurl + payload.apikey + '&q=' + payload.origin + '&zoom=' + payload.zoom ;
    this.sendSocketNotification('MAPS_RESULT', url);
  }

})

