Module.register("recognizer",{
  start() {
    this.sendSocketNotification("CONNECT");
    return;
  },

  socketNotificationReceived: function(notification) {
    if (notification === "RECOGNIZER_CONNECTED"){
      console.log("Recognizer initialized, awaiting Activation");
      return;
    }

    if(notification === "login") {
      
      sendSocketNotification();
    }
	}



});
