Module.register("recognizer",{

  start() {
    this.displayPicture = false;
    this.displayRecognition = false;
    this.pictureCount = 0;
    this.picture = '<img src="./public/webcam_pic.jpg" />';
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
      this.picture = '<img src="'+payload+'" />'
      var self = this;
      setTimeout(function() { self.updateDom(1000); }, 2000);
    }

    else if (notification === "RECOGNIZED") {
      console.log("==== RECOGNITION RECEIVED =========")
      console.log("results: " + payload.body.results);
      console.log("results first : " + payload.body.results[0]);
      console.log("this is the confidence: " + payload.body.results[0].confidence);
    }
  },

  notificationReceived: function(notification) {
    if(notification === "picture") {
      console.log("==== pic request ====");
      this.pictureCount++ ;
      this.sendSocketNotification("TAKE_SELFIE", this.pictureCount);
      this.show();
    }else if(notification === "recognize") {
      console.log("==== recognize request ====");
      this.pictureCount++ ;
      this.sendSocketNotification("RECOGNIZE_PICTURE", this.pictureCount);
      this.show();
    }else{
      this.hide();
    }
	},

  getDom: function() {
    var wrapper = document.createElement("div");
    wrapper.className = "selfie-display";

    if (this.displayPicture) {
      wrapper.innerHTML = this.picture;
      return wrapper;
    }

    return wrapper;
  },




});
