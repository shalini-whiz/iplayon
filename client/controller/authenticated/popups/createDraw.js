
  /* shalini codes starts here */

  Template.createDraw.onRendered(function(){

  })
  Template.createDraw.helpers({
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
    sportEvents: function () {
      try{
        if(Session.get("selectedSportFromLive")!=undefined&&
          Session.get("selectedSportFromLive")!=null){
          if(Session.get("selectedSportFromLive")!==0){
            Session.set("eventName", Session.get("selectedSportFromLive").trim());
            Session.set("showDraws", true);
          }
        }
      }catch(e){}
      try{
        var sport = Session.get("selectedSport");

        var eveNameVi = events.findOne({"_id":Router.current().params._id});
        if(eveNameVi == undefined)
          eveNameVi = pastEvents.findOne({"_id":Router.current().params._id});
        var sportsUnderTou = [];
        var sportsUnderTouJson = {};
        if(eveNameVi!=undefined){
          for(var i=0; i<eveNameVi.eventsUnderTournament.length; i++)
          {
            eveNam = events.findOne({"_id":eveNameVi.eventsUnderTournament[i]});
            if(eveNam == undefined)
              eveNam = pastEvents.findOne({"_id":eveNameVi.eventsUnderTournament[i]});
            var newJson = {};
            newJson["eventId"] = eveNam.projectId[0];
            newJson["eventName"] = eveNam.eventName;
            sportsUnderTou.push(newJson);
          }
        }

        if(sportsUnderTou.length!=0){
          return sportsUnderTou;
        } 
      }catch(e){}
    }
  });

  Template.createDraw.events ({

   'change [name="configurationList"]': function (event, template) {
      var configurationValue = event.target.value;
      var sEvent = $("[name='eventList']").val();
      if(configurationValue.trim() != null && sEvent != null)
        $("#impMsg").text("");
      else
      {
        if(configurationValue == null && sEvent != null)
          $("#impMsg").text("* Configuration selection required");
        else if(sEvent == null && configurationValue != null)
         $("#impMsg").text("* Event selection required ");
      }

      if($("#infoMsg").text() != "")
      {
        $("#createDrawFlow2").prop('disabled',true);;
        $('#createDrawFlow2').attr('style', 'background:grey !important');

      }



    },

    "click #event_select": function (event, template) {
      event.preventDefault();
      if(Session.get("eventName")!==$(event.currentTarget).html().trim()){
        Session.set("changeFirstUserId",undefined)
      }
      Session.set("uploadedFileData",undefined)
      var sEvent = $(event.currentTarget).html().trim();
      Meteor.call("checkEventDraws",Router.current().params._id,sEvent,function(error,result)
        {
            if(error)
            {
            }
            else
            {
              if(result != undefined)
              {
                $("#infoMsg").text("* Please reset the draws before uploading new csv!!");
                $("#createDrawFlow2").prop('disabled',true);;
                $('#createDrawFlow2').attr('style', 'background:grey !important');
              }
              else
              {
                $("#infoMsg").text("");
                $("#createDrawFlow2").prop('disabled',false);;
                $('#createDrawFlow2').attr('style', 'background:');
              }
            }
        }); 

     

      var configurationValue = $("[name='configurationList']").val();

      $("#selectWhich").css("display","block");
      $("#selectWho").html("")
      Session.set("selectedSportFromLive",undefined)
      Session.set("eventName", sEvent);
      Session.set("showDraws", true);

      if(configurationValue != null && sEvent != null)
        $("#impMsg").text("");
      else
      {
        if(configurationValue == null && sEvent != null)
          $("#impMsg").text("* Configuration selection required");
        else if(sEvent == null && configurationValue != null)
          $("#impMsg").text("* Event selection required ");
      }
      Session.set("leftRMatches", undefined);
      Session.set("rightRMatches", undefined);
      Session.set("leftRMatches_team", undefined);
      Session.set("rightRMatches_team", undefined);
    },

    'click #createDrawFlow2': function(e) {
      e.preventDefault();
      var configurationList = $("[name='configurationList']").val();
      var eventList = $("[name='eventList']").val();

      if(configurationList != null && eventList != null)
      {
        var sEvent = $("[name='eventList']").val();
        var sEventID = $("[name='eventList'] option:selected").attr("name");
        var configurationValue = $("[name='configurationList']").val();
        Session.set("selectedSportFromLive",undefined)
        Session.set("eventName", sEvent);
        Session.set("eventId_Draws",sEventID);
        Session.set("showDraws", true);
        Session.set("configurationValue", configurationValue);
        if(configurationValue.trim() == "Knock Out")
        {
          $("#impMsg").text("");
          $('#createDraw').modal('hide');
          $('#editSettingsDraws').modal('hide');
          $('#pointsPopUp').modal('hide');
            Meteor.call("getTypeOfProject",Router.current().params._id,sEvent.trim(),function(e,res){
                if(res){
                    var eventDetails = res
                    if(eventDetails && eventDetails.projectType && eventDetails.projectType==1){
                      if( $('#knockOutPopUp').is(':empty')) {
                        Blaze.render(Template.knockOut, $("#knockOutPopUp")[0]);
                        $("#knockOut").modal({
                          backdrop: 'static'
                        });
                      }else{
                        $('#knockOut').modal('show');    
                      }
                    }
                    else if(eventDetails && eventDetails.projectType && eventDetails.projectType==2){
                        if( $('#knockOutPopUp').is(':empty')) {
                            Blaze.render(Template.selectTeamFormatsOldNew, $("#knockOutPopUp")[0]);
                            $("#selectTeamFormatsOldNew").modal({
                              backdrop: 'static'
                            });
                        }else{
                            $('#selectTeamFormatsOldNew').modal('show');    
                        }
                    }
           
                }else if(e){
                    alert(JSON.stringify(e))
                }
            })
            
        }
        else
        {
          $('#createDraw').modal('hide');
          $('#knockOut').modal('hide');
          $('#pointsPopUp').modal('hide');

          let tournament = events.findOne ({
            "_id":Router.current().params._id
          });
          if(tournament == undefined)
          {
            tournament = pastEvents.findOne({
              "_id":Router.current().params._id
            })
          }
          if (tournament.eventOrganizer != Meteor.userId()) {
            return false;
          }
          else{
            if( $('#settingsPopUp').is(':empty')) 
            {
              Blaze.render(Template.editSettingsDraws, $("#settingsPopUp")[0]);
                $("#editSettingsDraws").modal({
                backdrop: 'static'
              });
            }
            else
              $('#editSettingsDraws').modal('show');
          }
        }
      }
      else if(configurationList == null && eventList != null)
        $("#impMsg").text("* Configuration selection required");
      else if(configurationList != null && eventList == null)
        $("#impMsg").text("* Event selection required");
      else
        $("#impMsg").text("* Event and Configuration selection required");


    },
    'click #closeCreateDraw':function(e)
    {
          $("#createDrawPopUp").empty();
          $("#knockOutPopUp").empty();
          $("#settingsPopUp").empty();
          $("#pointsPopUp").empty();
          $("#downloadTemplatePopUp").empty();
          var eventDetails = events.findOne({"tournamentId":Session.get("tournamentId"),eventName:Session.get("eventName")});
          if(eventDetails == undefined)
            eventDetails = pastEvents.findOne({"tournamentId":Session.get("tournamentId"),eventName:Session.get("eventName")});
          
          if(eventDetails&&eventDetails.projectType&&parseInt(eventDetails.projectType)==1&&Session.get("uploadedFileData")){
            Meteor.call("removeDraws", Session.get("tournamentId"), Session.get("eventName"));
            Session.set("matchRecords", "");
            Session.set("leftRMatches", "");
            Session.set("rightRMatches", "");
          }
          else if(eventDetails&&eventDetails.projectType&&parseInt(eventDetails.projectType)==2&&Session.get("uploadedFileData")){
            Meteor.call("removeDrawsTeam", Session.get("tournamentId"), Session.get("eventName"));
            Session.set("matchRecords", "");
            Session.set("leftRMatches_team", "");
            Session.set("rightRMatches_team", "");
          }
    }
  });

    /* shalini codes ends here */