Module.register("youtube", {

  defaults: {
    autoPlay: "autoplay=1"
  },



  getHeader: function(){
    return this.name;
  },

  start: function(){
    Log.info("Starting module: " + this.name)
    this.width = null;
    this.height = null;
    this.src = null;
    this.border = null;
    this.frameBorder = null;
    this.videoIdRequested = null;
    this.sendSocketNotification("PLAY_YOUTUBE");
    this.loaded = false
  },

  getDom: function(){

    if (this.src !== null){
      var videoFrame = document.createElement("IFRAME");
          videoFrame.id = "youtube-video-holder"
          videoFrame.width = this.width
          videoFrame.height = this.height
          videoFrame.src = this.src
          videoFrame.border = this.frameBorder
          videoFrame.style.border = this.border

        return videoFrame;
    }
  },

  notificationReceived: function(notification){
    if(notification === "play" || notification === "youtube"){
      console.log("========== request ==========");
      this.sendSocketNotification("PLAY_YOUTUBE")
    }else if(notification === "stop"){
      this.src = null
      this.getDom();
    }

  },

  socketNotificationReceived: function(notification){
    if(notification === "YOUTUBE_PLAYBACK"){
      this.getData();
    }
  },

  getData: function(){
    this.width = "640";
    this.height = "360";
    this.videoIdRequested = "WxOFvpplvAM"
    this.src = "https://www.youtube.com/embed/"+ this.videoIdRequested + "?enablejsapi=1&" + this.defaults.autoPlay;
    this.frameBorder = "0";
    this.border = "solid 4px #37474F";
    this.updateDom();

  }

});
