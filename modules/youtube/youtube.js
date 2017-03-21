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
    this.border = null;
    this.frameBorder = null;
    this.vidIdRequested = null;
    this.sendSocketNotification("PLAY_ENTERTAINMENT");
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
    if(notification === "music"){
      console.log("========== music request ==========");
      this.sendSocketNotification("PLAY_MUSIC");
    }else if(notification === "motivation"){
      console.log("========== motivation request ==========");
      this.sendSocketNotification("PLAY_MOTIVATION");
    }else if(notification === "entertain"){
      console.log("========== entertainment request ==========");
      this.sendSocketNotification("PLAY_ENTERTAINMENT");
    }else if(notification === "stop"){
      this.src = null
      this.getDom();
    }

  },

  socketNotificationReceived: function(notification){
    if(notification === "MUSIC_PLAYBACK"){
      this.videoGetter("M");
    }else if(notification === "MOTIVATION_PLAYBACK"){
      this.videoGetter("O");
    }else if(notification === "ENTERTAINMENT_PLAYBACK"){
      this.videoGetter("E");
    }
  },

  getData: function(){
    this.width = "640";
    this.height = "360";
    this.vidIdRequested = this.vidIdRequested
    this.src = "https://www.youtube.com/embed/"+ this.vidIdRequested + "?enablejsapi=1&" + this.defaults.autoPlay;
    this.frameBorder = "0";
    this.border = "solid 4px #37474F";

    this.updateDom();
  },

  videoGetter: function(identifier){
    if (identifier === "M"){
      var musicVidID = ["0KSOMA3QBU0", "31crA53Dgu0", "34Na4j8AVgA", "0zGcUoRlhmw", "kOkQ4T5WO9E", "avjDmeudqbo", "sTUNQC6ep18", "JzSUgOmP66Q", "niJwjCQ-pAI", "gHeSsEaTJAg"];

      var length = musicVidID.length,
          roundedRandom = Math.floor(Math.random()*(length));
          this.vidIdRequested = musicVidID[roundedRandom]
          this.getData();

    }else if(identifier === "O"){
      var motivationVidID = ["ZXsQAXx_ao0", "WxOFvpplvAM", "ZXsQAXx_ao0", "CPQ1budJRIQ", "RXl6QpWQ5xo", "ZXsQAXx_ao0", "ZXsQAXx_ao0", "wzhzkKccBi8", "ZXsQAXx_ao0"];

      var length = motivationVidID.length,
          roundedRandom = Math.floor(Math.random()*(length));
          this.vidIdRequested = motivationVidID[roundedRandom]
          this.getData();

    }else if(identifier === "E"){
      var entertainmentVidID = ["1VuMdLm0ccU", "hpigjnKl7nI", "Dd7FixvoKBw", "WPkMUU9tUqk", "N0gb9v4LI4o", "gneBUA39mnI", "Zce-QT7MGSE", "1VuMdLm0ccU",  "Dd7FixvoKBw", "WPkMUU9tUqk", "N0gb9v4LI4o", "gneBUA39mnI", "Zce-QT7MGSE"]

      var length = entertainmentVidID.length,
          roundedRandom = Math.floor(Math.random()*(length));
          this.vidIdRequested = entertainmentVidID[roundedRandom];
          this.getData();
    }


  }


});
