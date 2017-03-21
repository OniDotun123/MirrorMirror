Module.register("recognizer",{

  start() {
    this.displayPicture = false;
    this.displayRecognition = false;
    this.recognitionValue = "";
    console.log("Recognizer listening...");
    this.sendSocketNotification("RECOGNIZER_STARTUP");
    return;
  },

  socketNotificationReceived: function(notification, payload) {
    console.log("Recognizer recieved a notification: " + notification)

    if (notification === "RECOGNIZER_CONNECTED") {
      console.log("Recognizer initialized, awaiting Activation");
    }

    else if (notification === "SELFIE_IS_GO") {
      console.log("Begin Display Selfie");
      this.displayPicture = true;
      this.updateDom(0);
    }
  },

  notificationReceived: function(notification) {
    if(notification === "picture") {
      console.log("========== pic request ===================");
      this.sendSocketNotification("TAKE_SELFIE");
    }
	},

  getDom: function() {
    var wrapper = document.createElement("div");
    wrapper.className = "selfie-display";

    if (this.displayPicture) {
      wrapper.innerHTML = '<img id="selfie" src="./public/webcam_pic.jpg" />';
      return wrapper;
    }
    else if (this.displayRecognition) {
      wrapper.innerHTML = "<h3>" + this.recognitionValue + "</h3>";
      return wrapper;
    }
    return wrapper;
  },




});
