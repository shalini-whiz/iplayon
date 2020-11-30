
  Template.scoreSheetRR.onRendered(function(){
      Session.set("progressBar",undefined);

  })


  Template.scoreSheetRR.helpers({
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
      //var userId = Meteor.userId();
      return Router.current().params._id;
    },
    eventName: function (){
      return (Session.get("eventName"))
    },
    "progressBar":function(){
      if(Session.get("progressBar") != undefined && Session.get("progressBar") == true)
        return true;
    },
    scoreSheetEvents:function()
    {
        try{
        if(Session.get("selectedSportFromLive")!=undefined&&
          Session.get("selectedSportFromLive")!=null){
          if(Session.get("selectedSportFromLive")!==0){
            Session.set("eventName", Session.get("selectedSportFromLive").trim());
            Session.set("showDraws", true);
          }
        }
      }catch(e){
      }
      try{

      var sport = Session.get("selectedSport");
      if(Session.get("uploadedDraws") != undefined)
            return Session.get("uploadedDraws");
       
    }catch(e){
    }
     
    },
    "groupNoList":function()
    {
      try{
        if(Session.get("groupNoList") != undefined)
          return Session.get("groupNoList")
      }catch(e)
      {

      }
    }
  });

  Template.scoreSheetRR.events ({

  

    /*"click #scoresheet_event": function (event, template) {
      event.preventDefault();

      if(Session.get("eventName")!==$(event.currentTarget).html().trim()){
        Session.set("changeFirstUserId",undefined)
      }
      var scoreSheetEvent = $(event.currentTarget).html().trim();

      $("#selectWhich").css("display","block");
      $("#selectWho").html("")
      Session.set("selectedSportFromLive",undefined)
      Session.set("scoreSheetEvent", scoreSheetEvent);

    },*/
    'change [name="scoresheetEventList"]': function(event, template) {
        event.preventDefault();
        var scoreSheetEvent = $("[name='scoresheetEventList']").val();
        Session.set("scoreSheetEvent", scoreSheetEvent);
        Meteor.call("fetchRRGroupList",Session.get("tournamentId"),scoreSheetEvent,function(error,result){
          if(result)
            Session.set("groupNoList",result);

        });

       
    },

    'click #blankSheet': function(e) {
      e.preventDefault();
      var scoreSheetEvent = $("[name='scoresheetEventList']").val();
      var tournamentId = Session.get("tournamentId");

      if(scoreSheetEvent != null)
      {
          var tourType ="";
          if(Router.current().params._eventType)
            tourType = Router.current().params._eventType;

          var eventDetails = events.findOne({"tournamentId":Session.get("tournamentId"),eventName:scoreSheetEvent});
          if(eventDetails==undefined){
            eventDetails = pastEvents.findOne({"tournamentId":Session.get("tournamentId"),eventName:scoreSheetEvent});
          }        
          if(eventDetails&&eventDetails.projectType&&parseInt(eventDetails.projectType)==1){
            methodCallName = "generate_blank_scoreSheet_RR";
          }
          else if(eventDetails&&eventDetails.projectType&&parseInt(eventDetails.projectType)==2){
            methodCallName = "generate_blank_scoreSheet_RR";
          }

          Session.set("progressBar",true);



          Meteor.call(methodCallName,tournamentId,scoreSheetEvent,tourType,function(err, res) {
            Session.set("progressBar",undefined);

            if (err) {
            } else if (res) 
            {
              window.open("data:application/pdf;base64, " + res);
                  $( '.modal-backdrop' ).remove();

                        
            }
        })
      }
      else 
        $("#impMsg").text("* Event Selection required");
      
    },

    'click #generatePDF': function(e) {
      e.preventDefault();
      var scoreSheetEvent = $("[name='scoresheetEventList']").val();
      var groupNoVal =  $("[name='groupNo']").val();
      var tournamentId = Session.get("tournamentId");

      if(groupNoVal == undefined || groupNoVal == null)
        groupNoVal = "";

            
      if(scoreSheetEvent != null)
      {
          var tourType ="";
          if(Router.current().params._eventType)
            tourType = Router.current().params._eventType;

          var eventDetails = events.findOne({"tournamentId":Session.get("tournamentId"),eventName:scoreSheetEvent});
          if(eventDetails==undefined){
            eventDetails = pastEvents.findOne({"tournamentId":Session.get("tournamentId"),eventName:scoreSheetEvent});
          }        
          if(eventDetails&&eventDetails.projectType&&parseInt(eventDetails.projectType)==1){
            methodCallName = "generate_scoreSheet_Individual_RR";
          }
          else if(eventDetails&&eventDetails.projectType&&parseInt(eventDetails.projectType)==2){
            methodCallName = "generate_scoreSheet_Team_RR";
          }

          Session.set("progressBar",true);

          Meteor.call(methodCallName,tournamentId,scoreSheetEvent,tourType,groupNoVal,function(err, res) {
            Session.set("progressBar",undefined);

            if (err) {
            } else if (res) 
            {
              window.open("data:application/pdf;base64, " + res);
                  $( '.modal-backdrop' ).remove();

                        
            }
        })
      }
      else 
        $("#impMsg").text("* Event Selection required");
     
    }
  });


  
    /* shalini codes ends here */