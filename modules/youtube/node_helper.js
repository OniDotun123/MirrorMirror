var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

    start: function(){
      console.log(this.name + " helper started...");
    },

    socketNotificationReceived: function(notification){
      if (notification === "LISTEN_YOUTUBE"){
        console.log("listening for youtube...");
        this.sendSocketNotification("CONNECTED");
      }else if(notification === "PLAY_MUSIC"){
        console.log("getting music...");
        this.sendSocketNotification("MUSIC_PLAYBACK")
      }else if(notification === "PLAY_MOTIVATION"){
        console.log("getting motivation...");
        this.sendSocketNotification("MOTIVATION_PLAYBACK")
      }else if(notification === "PLAY_ENTERTAINMENT"){
        console.log("getting entertainment...");
        this.sendSocketNotification("ENTERTAINMENT_PLAYBACK");
      }else if(notification === "STOP_MEDIA"){
        console.log("stopping media...");
        this.sendSocketNotification("STOP_MEDIA");
      }
    }


})
