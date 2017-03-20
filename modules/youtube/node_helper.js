var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

    start: function(){
      console.log(this.name + " helper started...");
    },

    socketNotificationReceived: function(notification){
      if (notification === "LISTEN_YOUTUBE"){
        console.log("listening for youtube...");
        this.sendSocketNotification("CONNECTED");
      }else if(notification === "PLAY_YOUTUBE"){
        console.log("getting video...");
        this.sendSocketNotification("YOUTUBE_PLAYBACK")
      }
    }


})
