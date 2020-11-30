
  /* shalini codes starts here */

  Template.result.onCreated(function(){

    this.subscribe("otherUsers");
  })
  Template.result.helpers({
    thiss:function(){
      if(Session.get("eventName"))
        return Session.get("eventName");
      else
        return "Select Event"

    },
    selectedSportOrNot:function(){
      if(Session.get("selectedSportFromLive")!==undefined&&Session.get("selectedSportFromLive")!==null){
        if(Session.get("selectedSportFromLive")===0){
          return false
        }
        else return true
      }
    },
    tourIdDraws:function(){
      return Router.current().params._id;
    },
    eventName: function (){
      return (Session.get("eventName"))
    },
    drawsEvents:function()
    {
       
      try{
      var sport = Session.get("selectedSport");
      if(Session.get("uploadedDraws") != undefined)
            return Session.get("uploadedDraws");
       
    }catch(e){}
     
    }
   
  });

  Template.result.events ({

  


    "click #event_select": function (event, template) {
      event.preventDefault();
      if(Session.get("eventName")!==$(event.currentTarget).html().trim()){
        Session.set("changeFirstUserId",undefined)
      }
      var sEvent = $(event.currentTarget).html().trim();
      $("#selectWhich").css("display","block");
      $("#selectWho").html("")
      Session.set("selectedSportFromLive",undefined)
      Session.set("eventName", sEvent);
      Session.set("showDraws", true);

      if(sEvent != null)
        $("#impMsg").text("");
      else
      {
        $("#impMsg").text("* Event selection required ");
      }
    },

    'click #sendResultEmail': function(e) {
      e.preventDefault();
      var eventType ="";
        if(Router.current().params._eventType)
          eventType = Router.current().params._eventType;

      var configurationList = $("[name='configurationList']").val();
      var eventList = $("[name='eventList']").val();

      var comment = $("[name='comment']").val();
      if(eventList != null)
      {
        var sEvent = $("[name='eventList']").val();
        var eventDetails = events.findOne({"tournamentId":Session.get("tournamentId"),eventName:sEvent});
      if(eventDetails==undefined){
        eventDetails = pastEvents.findOne({"tournamentId":Session.get("tournamentId"),eventName:sEvent});
      }        
      if(eventDetails&&eventDetails.projectType&&parseInt(eventDetails.projectType)==1){
        methodCallName = "sendResultEmail";
      }
      else if(eventDetails&&eventDetails.projectType&&parseInt(eventDetails.projectType)==2){
        methodCallName = "sendResultEmail_Team";
      }

      
        Meteor.call(methodCallName, Session.get("tournamentId"), sEvent, eventType, function (error, result) {
          if (error) {
          }
          else {
            if(result.winner != "")
            {
              var eventDomain = "";
              if(eventDetails.domainId && eventDetails.domainId.length > 0 && eventDetails.domainId[0])
                eventDomain = eventDetails.domainId[0];

              var journalistInfo = otherUsers.find({"role":"Journalist","state":eventDomain}).fetch();
              

              for(var x=0; x<journalistInfo.length; x++)
              {
                var html = Blaze.toHTMLWithData(Template.sendResultsViaMail, result);
                var consolidatedHTML = comment+""+html;
                var options = {
                  from: "iplayon.in@gmail.com",
                  //to: journalistMailID,
                  subject: "Scoresheet Result",
                  html: consolidatedHTML
                }

                var html1 = Blaze.toHTMLWithData(Template.sendSMSResults, result);
                var stripedHtml = html1.replace(/<[^>]+>/g, '');
                var smsTemplate = stripedHtml.replace(/^\s*\n/gm, '');

                smsTemplate = "";

                Meteor.call("sendSMSEmailNotification",journalistInfo[x].userId,smsTemplate,options,[],function(error,result)
                {
                    if(error)
                      displayMessage(error);
                    else if(result)
                    {
                      if(x == 0) displayMessage("Mail sent!!");
                      $("#resultsPopUp").modal('hide');
                      $("#createDrawPopUp").empty();
                      $("#knockOutPopUp").empty();
                      $("#settingsPopUp").empty();
                      $("#pointsPopUp").empty();
                      $("#downloadTemplatePopUp").empty();
                      $("#resultsPopUp").empty();
                      $('.modal-backdrop').remove();
                    }
                });
              }
            }
            else
            {
              displayMessage("Matches incomplete!!")
            }
          
          }
        });

      }
      else
        $("#impMsg").text("* Event selection required");
     
    },
    'click #closeResult':function(e)
    {     
          $("#resultsPopUp").modal('hide');
          $("#createDrawPopUp").empty();
          $("#knockOutPopUp").empty();
          $("#settingsPopUp").empty();
          $("#pointsPopUp").empty();
          $("#downloadTemplatePopUp").empty();
          $("#resultsPopUp").empty();
          $('.modal-backdrop').remove();
    }
  });

    /* shalini codes ends here */


  Template.registerHelper('compareRoundVal', function(v1) {
  if (v1 === '0' || v1 == 0 || v1 === '1' || v1 == 1) 
    return true // do a object comparison
});