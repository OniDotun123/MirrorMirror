var NodeHelper = require("node_helper");
var request = require("request");

module.exports = NodeHelper.create({

  start: function() {
    console.log(this.name + ' helper started...');
  },

  socketNotificationReceived: function(notification, payload){
    if(notification === "LISTEN_FB_TIMELINE"){
      console.log('listening for FB timeline...');
      this.sendSocketNotification("CONNECTED");
      this.fetchFbTimeline(payload);
    }
      else if(notification === "FB"){
       console.log("getting fb timeline...")
       this.fetchFbTimeline(payload);
    }
  },

  fetchFbTimeline: function(payload){
    var url = payload.baseurl + payload.page + payload.endPoint;
    this.sendSocketNotification('FB_RESULT', url);
  }

})
