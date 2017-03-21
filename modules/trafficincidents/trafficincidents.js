Module.register("trafficincidents", {

  defaults: {
    baseTrafficUrl: "http://www.mapquestapi.com/traffic/v2/incidents?key=",
    baseGeocodeUrl: "http://www.mapquestapi.com/geocoding/v1/address?key=",
    CK: "0MfvxPkvBhP7qwk0n7uNKAxVZzlSBXkQ",
    TL: "40.71",
    TR: "-73.97",
    BL: "40.67",
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
    var notArr = notification.split(" ");
    var regexp = /\d{5}/;

    if(regexp.test(notArr)){
      var zipCode = regexp.exec(notArr)[0]
    };

    if((zipCode !== null) && (notArr.includes("traffic"))){
      this.geoCodeApi(zipCode);
      this.sendSocketNotification("NEED_UPDATES", this.defaults);
      this.show();
    }else if(notArr.includes("traffic")){
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
        for(i=0; i<3; i++){
          this.incidents.push(parsedData["incidents"][i]["fullDesc"])
        }
      this.updateDom(0);
      this.incidents = []
    }
  },

  geoCodeApi: function(zipCode){
    var compUrl = this.defaults.baseGeocodeUrl + this.defaults.CK + "&location=" + zipCode
    var xhr = new XMLHttpRequest();
    var that = this

    xhr.open("GET", compUrl)
    xhr.onreadystatechange = function(){
      if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
        var response = this.responseText;
        var parsedResponse = JSON.parse(response);
        that.coordSetter(parsedResponse);
      }
    }
    xhr.send();
  },

  coordSetter: function(data){
    debugger;
    this.defaults.TL = (data["results"][0]["locations"][0]["latLng"]["lat"] + 0.02);
    this.defaults.TR = (data["results"][0]["locations"][0]["latLng"]["lng"] + 0.02);
    this.defaults.BL = (data["results"][0]["locations"][0]["latLng"]["lat"] - 0.02);
    this.defaults.TL = (data["results"][0]["locations"][0]["latLng"]["lng"] - 0.02);

    return this.defaults;

  },

});
