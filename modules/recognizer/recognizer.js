Module.register("recognizer",{
  start() {
    console.log("Recognizer started");
    this.sendSocketNotification("CONNECT");
    return;
  },

  socketNotificationReceived: function(notification) {
    console.log("Recognizer recieved a notification: " + notification)

    if (notification === "RECOGNIZER_CONNECTED"){
      console.log("Recognizer initialized, awaiting Activation");
      return;
    }

    if(notification === "login") {
      sendSocketNotification("TAKE_SELFIE");
      return;
    }
	}



});
