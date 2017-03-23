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
      setTimeout(function() { self.updateDom(1); }, 2000);
    }

    else if (notification === "RECOGNIZED") {
      this.pictureCount++ ;
      console.log("==== RECOGNITION RECEIVED =========")

      if (!payload || payload.charAt(0) === '<') {
        this.picture = '<p> Server is Overloaded, Try again in a minute </p>'
        var self = this;
        setTimeout(function() { self.show(); self.updateDom(1000); }, 2000);
        setTimeout(function() { self.picture = "<p> Recognizing </p>" }, 5000)
      }else {
        json = JSON.parse(payload);
        console.log("== JSON response received ==");

        var user = this.interpretFaceToken(json.results[0].face_token);
        if (json.results[0].confidence > 75 && user) {
          this.picture = '<p> Successfully logged in, Welcome '+user+' </p>';
        }else { this.picture = '<p> Unable to recognize you clearly </p>'; }
      }

      var self = this;
      setTimeout(function() { self.show(); self.updateDom(1000); }, 2000);

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
      this.picture = "Recognizing..."
      this.updateDom();
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
    wrapper.innerHTML = "";
    return wrapper;
  },

  interpretFaceToken: function (faceToken) {
    if (faceToken === "4ff8954b037753c93a97abf1aec05c3c" || faceToken === "d7406353e69aefe176a4f2763b807dbd" || faceToken === "7c025f7fce64282bf80af63d2460e519" || faceToken === "06ccf22eb6b5a68c853d0e0b37fba45f" ) {
      return "Karan";
    } else if (faceToken === "7b2be0194606abf5830562d8c5943dbd" || faceToken === "1db906899f4c71fbffaa07bb1ea360f9" || faceToken === "11b210d08a3d5057e578cd12dddb2e93" || faceToken === "9a037d7e5411e2dd923873079a6119b8" ) {
      return "Jordan";
    } else if (faceToken === "465335005dc7c038b519d055f3cab979" || faceToken === "5560e080d0bc6b59d7de80187ab2de1f" || faceToken === "6f12b3d61fb15cb454fe95e48385713c" || faceToken === "7963fa02a1ecde5284394261bd134531") {
      return "Dotun";
    } else if (faceToken === "8d41b90aabb213b36e06b33afdbf7278" || faceToken === "866d2d0ddf6c0e7616fee1138020d167" || faceToken === "672ccbc7312d1f664b5e2ca17d0310c9" || faceToken === "82111fc4f4c418e95c67d2e2adbf7c9d") {
      return "Tatiana";
    } else if (faceToken === "70623033ceb93bb609b4e6c09006789a" || faceToken === "8be2dda4007bb4ce0802a80a74e51d7d" || faceToken === "c31376c1c9721ba3f207cac08c0878d9" || faceToken === "ac8ab249bd4f713c46b88cb68d91a610") {
      return "Eric";
    }
  }



});
