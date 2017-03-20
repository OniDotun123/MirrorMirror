var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

    start: function(){
      console.log(this.name + " helper started...")
    },

    socketNotificationReceived: function(notification, payload){
      if (notification === "LISTEN_YOUTUBE"){
        console.log("listening for youtube...");
        this.sendSocketNotification("CONNECTED");
      }else if(notification === "PLAY_YOUTUBE"){
        console.log("getting video...");
        this.onYoutubeIframeAPIReady()
      }
    },

    this.player,

    onYouTubeIframeAPIReady: function() {
      this.player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: 'M7lc1UVf-VE',
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    },

    onPlayerReady: function(event){
      event.target.playVideo();
    },

    this.done: false,
    onPlayerStateChange: function(event){
      if(event.data == YT.PlayerState.PLAYING && !this.done){
        setTimeout(stopVideo, 10000);
        this.done = true
      }

    },

    stopVideo: function(){
      player.stopVideo();
    }


})
