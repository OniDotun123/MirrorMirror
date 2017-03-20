Module.register("trafficincidents", {

  defaults: {
    baseUrl: "http://www.mapquestapi.com/traffic/v2/incidents?key=",
    CK: "0MfvxPkvBhP7qwk0n7uNKAxVZzlSBXkQ",
    TL: "40.71",
    TR: "-73.999",
    BL: "40.69",
    BR: "-74.02"
  },

  getHeader: function(){
    return this.data.header //This is gonna be added in config.js file
  },

  getTranslations: function(){
    return false;
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
    if(notification === "traffic"){
      this.sendSocketNotification("NEED_UPDATES", this.defaults)
    }
  },

  socketNotificationReceived: function(notification, payload){
    Log.log("This is for testing");
    if(notification === "TRAFFIC_ALERTS"){
      var parsedData = payload;
        for(i=0; i<3; i++){
          this.incidents.push(parsedData["incidents"][i]["fullDesc"])
        }
      this.updateDom(0);
    }
  },

});
