Module.register("trafficincidents", {


  getHeader: function(){
    return this.data.header //This is gonna be added in config.js file
  },

  getTranslations: function(){
    return false;
  },

  start: function(){

    Log.info("Starting module: " + this.name);

    moment.locale(config.language);

    this.fullDescription1 = null; // fullDesc
    this.eventText1 = null; // within the parameterizedDexcription object under the eventText key
    this.severity1 = null; //scale of 1-4, 4 being the worst
    // this.fullDescription2 = null;
    // this.eventText2 = null;
    // this.severity2 = null;
    // this.fullDescription3 = null;
    // this.eventText3 = null;
    // this.severity3 = null;
    // this.fullDescription4 = null;
    // this.eventText4 = null;
    // this.severity4 = null;

    this.getTrafficData();
    this.loaded = false;
  },

  getDom: function(){

    var div1 = document.createElement("div");
    div1.className = "traffic-incident-1";

      var fullDescription1Display = document.createElement("span");
      fullDescription1Display.className = "desc-display-1";
      fullDescription1Display.innerHTML = this.fullDescription1;
      div1.appendChild(fullDescription1Display);

      var eventText1Display = document.createElement("span");
      eventText1Display.className = "event-display-1";
      eventText1Display.innerHTML = this.eventText1;
      div1.appendChild(eventText1Display);

      var severity1Display = document.createElement("span");
      severity1Display.className = "severity-display-1";
      severity1Display.innerHTML = this.severity1;
      div1.appendChild(severity1Display);


    // var div2 = document.createElement("div");
    // div2.className = "traffic-incident-2";
    //
    //   var fullDescription2Display = document.createElement("span");
    //   fullDescription2Display.className = "desc-display-2";
    //   fullDescription2Display.innerHTML = this.fullDescription2;
    //   div2.appendChild(fullDescription2Display)
    //
    //   var eventText2Display = document.createElement("span");
    //   eventText2Display.className = "event-display-2";
    //   eventText2Display.innerHTML = this.eventText2;
    //   div2.appendChild(eventText2Display);
    //
    //   var severity2Display = document.createElement("span");
    //   severity2Display.className = "severity-display-2";
    //   severity2Display.innerHTML = this.severity2;
    //   div2.appendChild(severity2Display);
    //
    // var div3 = document.createElement("div");
    // div3.className = "traffic-incident-3";
    //
    //   var fullDescription3Display = document.createElement("span");
    //   fullDescription3Display.className = "desc-display-3";
    //   fullDescription3Display.innerHTML = this.fullDescription3;
    //   div3.appendChild(fullDescription3Display);
    //
    //   var eventText3Display = document.createElement("span");
    //   eventText3Display.className = "event-display-3";
    //   eventText3Display.innerHTML = this.eventText3;
    //   div3.appendChild(eventText3Display);
    //
    //   var severity3Display = document.createElement("span");
    //   severity3Display.className = "severity-display-3";
    //   severity3Display.innerHTML = this.severity3;
    //   div3.appendChild(severity3Display);
    //
    // var div4 = document.createElement("div");
    // div4.className = "traffic-incident-4";
    //
    //   var fullDescription4Display = document.createElement("span");
    //   fullDescription4Display.className = "desc-display-4";
    //   fullDescription4Display.innerHTML = this.fullDescription4;
    //   div4.appendChild(fullDescription4Display);
    //
    //   var eventText4Display = document.createElement("span");
    //   eventText4Display.className = "event-display-4";
    //   eventText4Display.innerHTML = this.eventText4;
    //   div4.appendChild(eventText4Display);
    //
    //   var severity4Display = document.createElement("span");
    //   severity4Display.className = "severity-display-4";
    //   severity4Display.innerHTML = this.severity4;
    //   div4.appendChild(severity4Display);

    return div1
    // return div2
    // return div3
    // return div4
  },

  getTrafficData: function(){
    var baseUrl = "http://www.mapquestapi.com/traffic/v2/incidents?key=";
    var apiUrl = baseUrl + this.config.CK + "&boundingBox=" + this.config.TL + "," + this.config.TR + "," + this.config.BL + "," + this.config.BR;

    var self = this;

    var xhr = new XMLHttpRequest()

    xhr.open("GET", apiUrl);

    xhr.onreadystatechange = function(){
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
  
        self.parsedDataSetter(JSON.parse(this.response));
    }
  }
  xhr.send()
},

parsedDataSetter: function(data){
  this.fullDescription1 = data["incidents"][0]["fullDesc"];
  this.eventText1 = null;
  this.severity1 = null;
  this.fullDescription2 = null;
  this.eventText2 = null;
  this.severity2 = null;
  this.fullDescription3 = null;
  this.eventText3 = null;
  this.severity3 = null;
  this.fullDescription4 = null;
  this.eventText4 = null;
  this.severity4 = null;

  this.updateDom(0)
},

});
