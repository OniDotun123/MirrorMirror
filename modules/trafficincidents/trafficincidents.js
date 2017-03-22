Module.register("trafficincidents", {

  defaults: {
    baseUrl: "http://www.mapquestapi.com/traffic/v2/incidents?key=",
    CK: "0MfvxPkvBhP7qwk0n7uNKAxVZzlSBXkQ",
    TL: "40.77",
    TR: "-73.92",
    BL: "40.67",
    BR: "-74.02"
  },

  getHeader: function(){
    return this.data.header //This is gonna be added in config.js file
  },

  getStyles: function(){
    return ['trafficincidents.css']
  },

  start: function(){

    Log.info("Starting module: " + this.name);

    moment.locale(config.language);

    this.fullDescription = null; // fullDesc
    this.incidents = [];

    this.sendSocketNotification("TRAFFIC_REQUEST");
    this.loaded = false;
  },



  getDom: function(){


    var div = document.createElement("div")
    div.className = "traffic-display"

    var ol = document.createElement("ol");
    ol.className = "traffic-incidents"

    for(i=0; i < this.incidents.length; i++){
      var li = document.createElement("li");

        li.className = "traffic-incident-" + i;
        li.innerHTML = this.incidents[i];
        ol.appendChild(li);
    }
    div.appendChild(ol);
    return div;
  },

  notificationReceived: function(notification){
    var notArr = notification.split(" ");
    if(notArr.includes("traffic")){
      this.sendSocketNotification("NEED_UPDATES", this.defaults);
      this.show();
    }else{
      this.hide();
    }
  },

  socketNotificationReceived: function(notification, payload){
    Log.log("This is for testing");
    if(notification === "TRAFFIC_ALERTS"){
      var parsedData = payload;
      if(parsedData["incidents"].length === 0){
        this.incidents.push("There are no alerts for traffic in the nearby area")
      }else if(parsedData["incidents"].length < 5){
        for(i=0; i < parsedData["incidents"].length; i++){
          this.incidents.push(parsedData["incidents"][i]["shortDesc"])
      }}else{
        for(i=0; i<5; i++){
          this.incidents.push(parsedData["incidents"][i]["shortDesc"])
        }
      }
      this.updateDom(0);
      this.incidents = []
    }
  },

});
