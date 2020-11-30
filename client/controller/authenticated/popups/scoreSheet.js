
  Template.registerHelper('selectedEventSC', function(v1) {
  if(v1 === Session.get("selectedSportFromLive").trim()) {
    return true;
  }
  return false;
  });

    Template.scoreSheet.onRendered(function(){
      Session.set("progressBar",undefined);

  })


  Template.scoreSheet.helpers({
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
     
    }
  });

  Template.scoreSheet.events ({

   "change input[name=matchNumberList]":function(e){
      e.preventDefault();
      var roundNumber = $("[name='roundNumberList']").val();
      var matchNumber = $("[name='matchNumberList']").val();
      var tournamentId = Session.get("tournamentId");
      var scoreSheetEvent = $("[name='scoresheetEventList']").val();
      $("#impMsg").text("");
      var methodCallName = "";
      var eventDetails = events.findOne({"tournamentId":Session.get("tournamentId"),eventName:scoreSheetEvent});
      if(eventDetails==undefined){
        eventDetails = pastEvents.findOne({"tournamentId":Session.get("tournamentId"),eventName:scoreSheetEvent});
      }        
      if(eventDetails&&eventDetails.projectType&&parseInt(eventDetails.projectType)==1){
        methodCallName = "matchRecords/validMatchNumber";
      }
      else if(eventDetails&&eventDetails.projectType&&parseInt(eventDetails.projectType)==2){
        methodCallName = "matchRecords/validMatchNumberForTeams";
      }
      $("#impMsg").text("");
      $('#scoreSheet').find('#impMsg').html("");

      Meteor.call(methodCallName,tournamentId,scoreSheetEvent,matchNumber,roundNumber,function(err, res) {
          if (err) {
          } 
          else if (res) {
            if(res.length == 0)
            {
              $("#impMsg").text("* Invalid match number");
              $("#generatePDF").prop( "disabled", true );
            }
            else
            {
              $("#impMsg").text("");
              $("#generatePDF").prop( "disabled", false );
            }

          }
        })
    },

    "change [name=roundNumberList]":function(e){
      e.preventDefault();
      $("#generatePDF").prop( "disabled", false );
      $("[name='matchNumberList']").prop( "disabled", false );
      $("[name='matchNumberList']").val("");
      $("#impMsg").text("");
      $('#scoreSheet').find('#impMsg').html("");


    },

    "change #selectWhich": function (event, template) {
      event.preventDefault();
      $("[name='matchNumberList']").val("");

      if(Session.get("eventName")!==$(event.currentTarget).val()){
        Session.set("changeFirstUserId",undefined)
      }
      var scoreSheetEvent = $(event.currentTarget).val();

      $("#selectWhich").css("display","block");
      $("#selectWho").html("")
      Session.set("selectedSportFromLive",undefined)
      Session.set("scoreSheetEvent", scoreSheetEvent);
      var scoreSheetMatchNo = $("[name='matchNumberList']").val();
      var scoreSheetRoundNo = $("[name='roundNumberList']").val();
         $("#impMsg").text("");
      $('#scoreSheet').find('#impMsg').html("");
      
      if(scoreSheetEvent != null)
      {
        var tournamentId = Session.get("tournamentId");
         Meteor.call("matchRecords/validRoundNumber", tournamentId, scoreSheetEvent, function (error, result) {
          if (error) {
          }
          else {
            if(result.length > 0)
            {
              var optionHTML = "<option value='' selected>--select--</option>";
              for(var i=0;i< result.length;i++)
              {
                if(result[i].roundName != "Winner")
                  optionHTML +="<option value="+result[i].roundNumber+">"+result[i].roundName+"</option>";
              }
              $("[name='roundNumberList']").html(optionHTML);       

            }
            else
              $("[name='roundNumberList']").html("");       
          }
        });
      }
      else if(scoreSheetEvent == null)
        $("#impMsg").text("* Event Selection required");
    },

    'click #blankSheet': function(e) {
      e.preventDefault();
      var scoreSheetEvent = $("[name='scoresheetEventList']").val();
      var scoreSheetMatchNo = $("[name='matchNumberList']").val();
      var scoreSheetRoundNo = $("[name='roundNumberList']").val();
      var tournamentId = Session.get("tournamentId");

      if(scoreSheetEvent != null)
      {
          if(scoreSheetRoundNo == null) scoreSheetRoundNo = "";

          var tourType ="";
          if(Router.current().params._eventType)
            tourType = Router.current().params._eventType;
                    Session.set("progressBar",true);


          Meteor.call('matchRecords/generate_blankScoreSheet',tournamentId,scoreSheetEvent,scoreSheetMatchNo,scoreSheetRoundNo,tourType,function(err, res) {
                    Session.set("progressBar",undefined);

          if (err) {
          } else if (res) {
            window.open("data:application/pdf;base64, " + res);
            $( '.modal-backdrop' ).remove();
          }
        })
      }
      else if(scoreSheetEvent == null)
        $("#impMsg").text("* Event Selection required");
      
    },
    'click #blankTeamSheet':function(e){
      e.preventDefault();
      var scoreSheetEvent = $("[name='scoresheetEventList']").val();
      var tournamentId = Session.get("tournamentId");

      if(scoreSheetEvent != null)
      {
          Session.set("progressBar",true);

          Meteor.call('blankTeamDetailScoreSheet',tournamentId,scoreSheetEvent,function(err, res) {
                    Session.set("progressBar",undefined);


          if (err) {
          } else if (res) {
            window.open("data:application/pdf;base64, " + res);
            $( '.modal-backdrop' ).remove();
          }
        })
      }
      else if(scoreSheetEvent == null)
        $("#impMsg").text("* Event Selection required");
    },

    'click #generatePDF': function(e) {
      e.preventDefault();
      var scoreSheetEvent = $("[name='scoresheetEventList']").val();
      var scoreSheetMatchNo = $("[name='matchNumberList']").val();
      var scoreSheetRoundNo = $("[name='roundNumberList']").val();
      var tournamentId = Session.get("tournamentId");
      var methodCallName = "";
      var eventDetails = events.findOne({"tournamentId":Session.get("tournamentId"),eventName:scoreSheetEvent});
      if(eventDetails==undefined){
        eventDetails = pastEvents.findOne({"tournamentId":Session.get("tournamentId"),eventName:scoreSheetEvent});
      }        
      if(eventDetails&&eventDetails.projectType&&parseInt(eventDetails.projectType)==1){
        methodCallName = "matchRecords/generate_scoreSheet";
      }
      else if(eventDetails&&eventDetails.projectType&&parseInt(eventDetails.projectType)==2){
        methodCallName = "matchRecords/generate_scoreSheetForTeamEvents";
      }
      if(scoreSheetEvent != null)
      {
          if(scoreSheetRoundNo == null) scoreSheetRoundNo = "";
          var tourType ="";
          if(Router.current().params._eventType)
            tourType = Router.current().params._eventType;

          Session.set("progressBar",true);

          Meteor.call(methodCallName,tournamentId,scoreSheetEvent,scoreSheetMatchNo,scoreSheetRoundNo,tourType,function(err, res) {
                      Session.set("progressBar",undefined);

          if (err) {
          } else if (res) 
          {
            try{
            var foundEmpty = false;
            var foundDuePlayers = false;
            if(res.due != undefined)
            {
              foundDuePlayers = res.due.length > 0;
            }
            if(res.empty != undefined)
            {
              foundEmpty = res.empty > 0;
            }
            var htmlContent = "";
              if(res == "emptydata")
              {
                if(scoreSheetRoundNo != "")
                  $("#impMsg").text("* empty players ");
                else
                  $("#impMsg").text("* empty players ");

              }
              else if(foundDuePlayers)
              {
                htmlContent += "Players On Due : "+res.due;
                if(foundEmpty)
                  htmlContent += " and Players are waiting for preceding rounds to be completed";
                
              }
              else if(foundEmpty)
              {
                if(foundDuePlayers)
                  htmlContent += "and Players are waiting for preceding rounds to be completed";
                else
                  htmlContent += "Players are waiting for preceding rounds to be completed";
              }
              else
              {
                window.open("data:application/pdf;base64, " + res);
                $( '.modal-backdrop' ).remove();
              }

            if(htmlContent != "")
            {
              $('#scoreSheet').find('#impMsg').html("* "+htmlContent);
              $('#scoreSheet').find('#impMsg').attr("style","overflow-y:scroll !important;height:50px");
              $('#scoreSheet').find('#createDrawSettings').attr("style","background:grey !important");
              //$('#knockOut').find('#createDrawSettings').attr("disabled",true);
            }
            }catch(e){
            }            
          }
        })
      }
      else 
        $("#impMsg").text("* Event Selection required");
     
    }
  });


  
    /* shalini codes ends here */