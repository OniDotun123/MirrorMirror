
const watson = require('watson-developer-cloud'); //to connect to Watson developer cloud
const config = require("./config.js") // to get our credentials and the attention word from the config.js files
// const exec = require('child_process').exec;
const fs = require('fs');
const conversation_response = "";
const attentionWord = config.attentionWord; //you can change the attention word in the config file
const mic = require('mic');
const micInstance = mic({ 'rate': '44100', 'channels': '2', 'debug': false, 'exitOnSilence': 6 });
const micInputStream = micInstance.getAudioStream();

var speech_to_text = watson.speech_to_text({
  username: config.STTUsername,
  password: config.STTPassword,
  version: 'v1'
});

// var conversation = watson.conversation({
//   username: config.ConUsername,
//   password: config.ConPassword,
//   version: 'v1',
//   version_date: '2016-07-11'
// });
//
// var text_to_speech = watson.text_to_speech({
//   username: config.TTSUsername,
//   password: config.TTSPassword,
//   version: 'v1'
// });
var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

  start: function() {
      var self = this;

      console.log("Starting node helper for " + self.name)
      console.log("");

      micInputStream.on('data', function(data) {
        //console.log("Recieved Input Stream: " + data.length);
      });

      micInputStream.on('error', function(err) {
        console.log("Error in Input Stream: " + err);
      });

      micInputStream.on('silence', function() {
        // detect silence.
      });
      micInstance.start();
      console.log("TJBot is listening, you may speak now.");

      var textStream ;

      var recognizeparams = {
        content_type: 'audio/l16; rate=44100; channels=2',
        interim_results: true,
        keywords: [attentionWord],
        smart_formatting: true,
        keywords_threshold: 0.5,
        model: 'en-US_BroadbandModel'  // Specify your language model here
      };


      textStream = micInputStream.pipe(speech_to_text.createRecognizeStream(recognizeparams));

      textStream.setEncoding('utf8');
      console.log("this is the textStream" + textStream)

      var context = {} ; // Save information on conversation context/stage for continous conversation
      textStream.setEncoding('utf8');
      textStream.on('data', function(str){
        console.log(' ===== Speech to Text ===== : ' + str)
      })
  },
});
