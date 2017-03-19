Module.register("recognizer",{
  start() {
    console.log("Recognizer started");
    this.sendSocketNotification("RECOGNIZER_STARTUP");
    return;
  },

  socketNotificationReceived: function(notification) {
    console.log("Recognizer recieved a notification: " + notification)

    if (notification === "RECOGNIZER_CONNECTED"){
      console.log("Recognizer initialized, awaiting Activation");
      return;
    }

    if(notification === "selfie") {
      console.log("=============================");
      console.log("recieved request for picture!")
      sendSocketNotification("TAKE_SELFIE");
      return;
    }
	}

});
