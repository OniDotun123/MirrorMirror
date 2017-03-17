
var config = {

port: 8080,
language: 'en',
untis: 'imperial',

  modules: [
    {
        module: 'currentweather',
        position: 'top_right',

        config: {
          location: "NYC, NY",
          latitude: "40.73",
          longitude: "-73.94",
          apiBaseURL: "twcservice.mybluemix.net/api/weather/v1/geocode/",
          username: "5a6159b6-edb8-4741-9584-140d1f1506f2",
          password: "",
          endpoint: "observations"

        }
    }
  ]


}
























/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== 'undefined') {module.exports = config;}
