Module.register("recognizer",{

  getScripts: function() {
    // return ["webcam.js"];
  },

  start() {
    console.log("Recognizer started");
    this.sendSocketNotification("RECOGNIZER_STARTUP");
    return;
  },

  socketNotificationReceived: function(notification) {
    console.log("Recognizer recieved a notification: " + notification)

    if (notification === "RECOGNIZER_CONNECTED") {
      console.log("Recognizer initialized, awaiting Activation");
    }
    else if (notification === "SELFIE_IS_GO") {
      console.log("Begin Display Selfie")
      getDom;
    }
  },

  notificationReceived: function(notification) {
    if(notification === "picture") {
      console.log("==========pic request===================");
      this.sendSocketNotification("TAKE_SELFIE");

    }
	},

  getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.innerHTML = '<img id="selfie" src="./output.jpg" />';
        return wrapper;
    }

});
