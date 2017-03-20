Module.register("recognizer",{

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

    else if (notification === "SELFIE_IS_GO") {
      console.log("Begin Display Selfie");
      this.display = true;
      this.updateDom();

    }

  },

  notificationReceived: function(notification) {
    if(notification === "picture") {
      console.log("========== pic request ===================");
      this.sendSocketNotification("TAKE_SELFIE");
    }
	},

  getDom: function() {
    if (this.display) {
      var wrapper = document.createElement("div");
      wrapper.innerHTML = '<img id="selfie" src="./public/webcam_pic.jpg" />';
      return wrapper;
    }
  },




});

//this should cause a change
