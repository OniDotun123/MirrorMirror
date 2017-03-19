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

    if (notification === "RECOGNIZER_CONNECTED"){
      console.log("Recognizer initialized, awaiting Activation");

    }
  },

  notificationReceived: function(notification) {
    if(notification === "picture") {
      console.log("==========pic request===================");
      this.sendSocketNotification("TAKE_SELFIE");
      
    }
	}

});
