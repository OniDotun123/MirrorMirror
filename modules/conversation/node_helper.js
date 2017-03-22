const watson = require('watson-developer-cloud'); //to connect to Watson developer cloud
const config = require("./config.js") // to get our credentials and the attention word from the config.js files
const exec = require('child_process').exec;
const fs = require('fs');
const attentionWord = config.attentionWord; //you can change the attention word in the config file
const mic = require('mic');
const micInstance = mic({ 'rate': '44100', 'channels': '2', 'debug': false, 'exitOnSilence': 6 });
const micInputStream = micInstance.getAudioStream();
var conversation_response = "";

var speech_to_text = watson.speech_to_text({
  username: config.STTUsername,
  password: config.STTPassword,
  version: 'v1'
});


var conversation = watson.conversation({
  username: config.ConUsername,
  password: config.ConPassword,
  version: 'v1',
  version_date: '2016-07-11'
});

var text_to_speech = watson.text_to_speech({
  username: config.TTSUsername,
  password: config.TTSPassword,
  version: 'v1'
});

var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

  start() {
    this.started = false;
    console.log("Initialized Node Helper for: " + this.name)
  },

  socketNotificationReceived: function(notification, payload){
    if (notification === "CONNECT"){
      console.log("********** Watson listening *****************")
      this.startWatsonConversation();
      return;
    }
  },

  startWatsonConversation: function() {
    console.log("Initializing Watson");
      var self = this;

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

      var textStream ;

      var recognizeparams = {
        content_type: 'audio/l16; rate=44100; channels=2',
        interim_results: true,
        keywords: [attentionWord],
        smart_formatting: true,
        keywords_threshold: 0.5,
        model: 'en-US_BroadbandModel'
      };


      textStream = micInputStream.pipe(speech_to_text.createRecognizeStream(recognizeparams));

      textStream.setEncoding('utf8');
      console.log("this is the textStream" + textStream)

      var context = {} ; // Save information on conversation context/stage for continous conversation
      textStream.setEncoding('utf8');
      textStream.on('data', function(str){
        console.log(' ===== Speech to Text ===== : ' + str)
        if (str.toLowerCase().indexOf(attentionWord.toLowerCase()) >= 0) {
          var res = str.toLowerCase().replace(attentionWord.toLowerCase(), "");
          console.log("msg sent to conversation:" ,res);

          var resToSocket = res.trim();
          self.sendSocketNotification("KEYWORD_SPOTTED", resToSocket);

          conversation.message({
            workspace_id: config.ConWorkspace,
            input: {'text': res},
            context: context
          },  function(err, response) {
          if (err) {
            console.log('error:', err);
          } else {
            context = response.context ; //update conversation context

            if (Array.isArray(response.output.text)) {

              conversation_response = response.output.text.join(' ').trim();

            } else {
              conversation_response = undefined;
            }

            if (conversation_response){
              var params = {
                text: conversation_response,
                voice: config.voice,
                accept: 'audio/wav'
              };

              console.log("Result from conversation:" ,conversation_response);

              tempStream = text_to_speech.synthesize(params).pipe(fs.createWriteStream('output.wav')).on('close', function() {
                var create_audio = exec('aplay output.wav', function (error, stdout, stderr) {
                  if (error !== null) {
                    console.log('exec error: ' + error);
                  }
                });
              });
            }else {
              console.log("The response (output) text from your conversation is empty. Please check your conversation flow \n" + JSON.stringify( response))
            }

          }

        })
      } else {
        console.log("Waiting to hear", attentionWord);
        }
    });

  textStream.on('error', function(err) {
  console.log("%%%%%% error in input stream %%%%%%")
  console.log(' === Watson Speech to Text : An Error has occurred =====') ; // handle errors
  console.log(err) ;
  console.log("Press <ctrl>+C to exit.") ;
  });

  },
});
