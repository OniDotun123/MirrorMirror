Module.register("recognizer",{

  getScripts: function() {
    return ["webcam.js"];
  },

  start() {
    this.display = false;
    this.image = "";
    console.log("Recognizer started");
    this.sendSocketNotification("RECOGNIZER_STARTUP");
    return;
  },

  socketNotificationReceived: function(notification) {
    console.log("Recognizer recieved a notification: " + notification)

    if (notification === "RECOGNIZER_CONNECTED") {
      console.log("Recognizer initialized, awaiting Activation");
    }
    // else if (notification === "SELFIE_IS_GO") {
    //   console.log("Begin Display Selfie");
    //   this.updateDom(500);
    // }
  },

  notificationReceived: function(notification) {
    if(notification === "picture") {
      console.log("========== pic request ===================");
      // this.sendSocketNotification("TAKE_SELFIE");
      this.takeSelfie();
    }
	},

  getDom: function() {
    if (this.display) {
      var wrapper = document.createElement("div");
      wrapper.innerHTML = '<img id="selfie" src="' + this.image + '" />';
      return wrapper;
    }
  },

  takeSelfie: function () {
    Webcam.snap(function (data_uri, canvas, context) {
      var data = data_uri;
      console.log(data_uri);
      this.image = data_uri;
      this.diplay = true;
    }
  }

});

//this should cause a change
