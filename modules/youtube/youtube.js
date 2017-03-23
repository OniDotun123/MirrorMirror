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
    this.src = null;
    this.sendSocketNotification("LISTEN_MUSIC");
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
    }else{
      var div = document.createElement("DIV");
        return div;
    }
  },

  notificationReceived: function(notification){

    if (notification.split(" ").includes("stop")){
      this.sendSocketNotification("STOP_MEDIA");
    }else if(notification.split(" ").includes("stopped")){
      this.sendSocketNotification("STOP_MEDIA");
    }else if(notification.split(" ").includes("music")){
      console.log("========== music request ==========");
      this.sendSocketNotification("PLAY_MUSIC");
      this.show();
    }else if(notification.split(" ").includes("motivation")){
      console.log("========== motivation request ==========");
      this.sendSocketNotification("PLAY_MOTIVATION");
      this.show();
    }else if(notification.split(" ").includes("entertain")){
      console.log("========== entertainment request ==========");
      this.sendSocketNotification("PLAY_ENTERTAINMENT");
      this.show();
    }else if(notification.split(" ").includes("entertainment")){
      console.log("========== entertainment request ==========");
      this.sendSocketNotification("PLAY_ENTERTAINMENT");
      this.show();
    }
  },

  socketNotificationReceived: function(notification){

    if(notification === "MUSIC_PLAYBACK"){
      this.videoGetter("M");
    }else if(notification === "MOTIVATION_PLAYBACK"){
      this.videoGetter("O");
    }else if(notification === "ENTERTAINMENT_PLAYBACK"){
      this.videoGetter("E");
    }else if(notification === "STOP_MEDIA"){
      this.videoGetter("BLANK");
    }
  },

  getData: function(){

    this.width = "853";
    this.height = "480";
    this.vidIdRequested = this.vidIdRequested
    this.src = "https://www.youtube.com/embed/" + this.vidIdRequested + "?enablejsapi=1&" + this.defaults.autoPlay;
    this.frameBorder = "0";
    this.border = "solid 4px #37474F";

    this.updateDom();
  },

  stopData: function(){

    this.width = null;
    this.height = null;
    this.vidIdRequested = null
    this.src = null
    this.frameBorder = null;
    this.border = null;

    this.updateDom();
  },

  videoGetter: function(identifier){

    if (identifier === "M"){
      var musicVidID = ["0KSOMA3QBU0", "31crA53Dgu0", "34Na4j8AVgA", "0zGcUoRlhmw", "kOkQ4T5WO9E", "avjDmeudqbo", "sTUNQC6ep18", "JzSUgOmP66Q", "niJwjCQ-pAI", "gHeSsEaTJAg", "4NJlUribp3c"];

      var length = musicVidID.length,
          roundedRandom = Math.floor(Math.random()*(length));
          this.vidIdRequested = musicVidID[roundedRandom]
          this.getData();

    }else if(identifier === "O"){
      var motivationVidID = ["ZXsQAXx_ao0", "ZXsQAXx_ao0", "ZXsQAXx_ao0", "ZXsQAXx_ao0", "ZXsQAXx_ao0"];

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

    }else if(identifier === "BLANK"){
      this.stopData();
    }
  }
});
