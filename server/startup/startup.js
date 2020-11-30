
Meteor.startup(function() {
     var dataToret = customCollection.findOne({
        "key" : "mail"
     })
     if(dataToret && dataToret.mail){
        var data = dataToret;
        var url = "smtp://"+dataToret.mailId+"%40gmail.com:"+dataToret.data+"@smtp.gmail.com:587"
         /** Set MAIL_URL variable **/
        process.env.MAIL_URL = url;
    }


     // @=%40  
     // FORMAT:  process.env.MAIL_URL = "smtp://postmaster%40<your-mailgun-address>.mailgun.org:password@smtp.mailgun.org:587";
     //smtp://USERNAME:PASSWORD@HOST:PORT/ 
     //process.env.MAIL_URL = "smtp://postmaster%40sandbox0c67d2758d22431b848dee6717687302.mailgun.org:355e938a0c3013c299cb720a6f2d2594@smtp.mailgun.org:587";
     
     /*
     try{
      SyncedCron.add({
        name: 'Find new matches for a saved user filter and send alerts',
        schedule: function(parser) {
            return parser.recur().on('09:00:00').time();
        },
        job: function() {
          try{
            var userInfo = Meteor.users.findOne({"emailAddress":"ananthanp@arra.ooo"});
            var nowDate = new Date();
            var logDate = moment(new Date()).format("YYYY-MM-DD");
            //Meteor.call("fetchFitbitData",logDate);

          }catch(e){
            console.log(" date exe .. "+e)
          }

      }
      });
      //SyncedCron.start();
     }catch(e){
        console.log("startup "+e)
     }
     */
});
