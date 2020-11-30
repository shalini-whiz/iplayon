
  /* shalini codes starts here */

  Template.result_RR.onCreated(function(){

  })
  Template.result_RR.helpers({
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

  Template.result_RR.events ({

  


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
      try{
         e.preventDefault();
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
        methodCallName = "individualResultsOfRR";
      }
      else if(eventDetails&&eventDetails.projectType&&parseInt(eventDetails.projectType)==2){
        methodCallName = "teamResultsOfRR";
      }
        Meteor.call(methodCallName, Session.get("tournamentId"), sEvent,comment,function (error, result) {
        if (error) {
        }
        else {
          if(result)
          {
            if(result.status)
            {
              if(result.status == "success")
              {
                if(result.message)
                  displayMessage(result.message);
                  $("#resultsPopUp_RR").modal('hide');                  
                  $("#resultsPopUp_RR").empty();
                  $('.modal-backdrop').remove();
              }
              else
              {
                if(result.message)
                  displayMessage(result.message)
              }
            }
          }
         
        
        }
        });
      }
      else
        $("#impMsg").text("* Event selection required");
      }catch(e)
      {
        
      }
     
     
    },
    'click #closeResult':function(e)
    {     
          $("#resultsPopUp_RR").modal('hide');
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