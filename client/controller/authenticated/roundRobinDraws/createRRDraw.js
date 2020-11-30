
  /* creation of  round robin draw */




  Template.createRRDraw.onCreated(function(){

    this.subscribe("orgTeamMatchFormatPub")

  })
  Template.createRRDraw.onRendered(function(){
      Session.set("uploadRRDrawCheck",true);
      Session.set("progressBar",undefined);
      Session.set("categoryEvent",undefined);
      Session.set("orgFormatData",undefined);
      Session.set("formatType",undefined)

  })

  Template.createRRDraw.helpers({
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
          }
        }
      }catch(e){}
      try{
        var sport = Session.get("selectedSport");

        var eveNameVi = events.findOne({"_id":Router.current().params._id});
        if(eveNameVi == undefined)
        {
          eveNameVi = pastEvents.findOne({"_id":Router.current().params._id});
        }
        var sportsUnderTou = [];
        var sportsUnderTouJson = {};
        if(eveNameVi!=undefined){
          for(var i=0; i<eveNameVi.eventsUnderTournament.length; i++){
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
    },
    "progressBar":function(){
      if(Session.get("progressBar") != undefined && Session.get("progressBar") == true)
        return true;
    },
    "matchFormatList":function(){
      try{
        var matchFormatList = orgTeamMatchFormat.find({}).fetch();
        return matchFormatList;
      }catch(e){

      }
    },
    "enableMatchFormat":function(){
      try{
        if(Session.get("categoryEvent"))
        {
          var categoryEvent = $("[name='eventList']").val();    
          var tourInfo  = events.findOne({"_id":Router.current().params._id});
          if(tourInfo)
          {
            var categoryInfo  = events.findOne({"tournamentId":Router.current().params._id,"eventName":categoryEvent});
            if(categoryInfo && categoryInfo.projectType)
            {
                if(categoryInfo.projectType == 2)
                {
                  return "";
                }
                else
                  return "display:none"
            }
            else
              return "display:none"
           
          }
          else if(tourInfo == undefined)
          {
            var tourInfo  = pastEvents.findOne({"_id":Router.current().params._id});
            if(tourInfo)
            {
              var categoryInfo  = pastEvents.findOne({"tournamentId":Router.current().params._id,"eventName":categoryEvent});
              if(categoryInfo && categoryInfo.projectType)
              {
                  if(categoryInfo.projectType == 2)
                  {
                    return "";
                  }
                  else
                    return "display:none"
              }
              else
                return "display:none"
            }

            
          }
        }
        else
        {
          return "display:none"
        }
      }catch(e){
      }

    },
    "formatType":function(){

      if(Session.get("formatType") != undefined)
      {
        if(Session.get("formatType").toLowerCase() == "other")
        {
          return true;
        }   
        else
        {
          return false;
        }
      }
      else
        return false;

    },
    "fetchFormatData":function(){

      if(Session.get("orgFormatData") != undefined)
      {
        var formatInfo = Session.get("orgFormatData");
        if(formatInfo && formatInfo.specifications)
          return formatInfo.specifications;
      }
    },
    "eventType":function(data1){
      if(data1 == 1)
        return "Singles";
      else if(data1 == 2)
        return "Doubles";
    }
  });

  Template.createRRDraw.events ({

    "keypress #maxMembers": function(event) {
        var keycode = event.which;
        if (!(event.shiftKey == false && (keycode == 0 || keycode == 43 || keycode == 45 || keycode == 46 || keycode == 8 || keycode == 37 || keycode == 39 || (keycode >= 48 && keycode <= 57)))) {
            event.preventDefault();
        }
        else
            return true;  
    },
    'change [name="eventList"]':function(e,template)
    {
      var categoryEvent = $("[name='eventList']").val();    
      Session.set("categoryEvent",categoryEvent)
     
    },
    'change [name="matchFormatList"]':function(e,template)
    {
      var matchFormat = $("[name='matchFormatList']").val();
      if(matchFormat.toLowerCase() == "other")
      {
        Session.set("formatType",matchFormat)
      }
      else
      {
        Session.set("formatType",matchFormat)

        var tourInfo = events.findOne({"_id":Router.current().params._id});
        if(tourInfo == undefined)
        {
          tourInfo = pastEvents.findOne({"_id":Router.current().params._id});
        }

        if(tourInfo && tourInfo.eventOrganizer && tourInfo.projectId)
        {
          var orgFormatInfo = orgTeamMatchFormat.findOne({"formatName":matchFormat,"projectId": tourInfo.projectId[0],"organizerId":tourInfo.eventOrganizer});
          if(orgFormatInfo)
          {
            Session.set("orgFormatData",orgFormatInfo)
          }
        }

      }
    },
    'change [id=maxMembers]':function(e,template){

    },
    'change [name="playersListFilesRR"]': function(event, template){
      try{
        var eventList = $("[name='eventList']").val();
        var maxMembers = $("[name='maxMembers']").val();
        var checkExists = true;
         if(eventList != null & parseInt(maxMembers) > 0)
        {
          var sEvent = eventList;
          Meteor.call("checkRoundRobinDraws",Router.current().params._id,sEvent,function(error,result)
          {
            if(result)
            {
              if(result != undefined)
              {
                checkExists = false;
                $("#infoMsg").text("* Please reset the draws before uploading new csv!!");
                $("#createRoundRobinDraws").prop('disabled',true);;
                $('#createRoundRobinDraws').attr('style', 'background:grey !important');
              }
              
            }
          });
          if(checkExists)
          {
            var sEvent = $("[name='eventList']").val();
            var sEventID = $("[name='eventList'] option:selected").attr("name");
            Session.set("selectedSportFromLive",undefined)
            Session.set("eventName", sEvent);
            Session.set("eventId_Draws",sEventID);
            $("#impMsg").text("");
            var fileHandle = $("#uploadConfigurationFileRR").find('input[type=file]')[0].files[0];

            var matches;
            Papa.parse(fileHandle, {
              header: true,
              keepEmptyRows:false,
              skipEmptyLines: true,
              complete: function(fileData, file){
                var data = fileData.data;
                var obj = _.countBy(data, function(data) { return data.GroupNumber; });
                //var temp = true;

                if (fileData.errors[0]&&fileData.errors[0].row&&fileData.errors[0].row == 1){
                  Bert.alert('Cannot create draws with one player!', 'danger', 'growl-top-right');
                } 
                      
                else{             
                  for (var key in obj){
                    if(parseInt(obj[key]) > maxMembers){
                      Bert.alert('Group exceeds specified maximum members', 'danger', 'growl-top-right');
                      Session.set("uploadRRDrawCheck",false);
                      break;
                    }
                    else if(parseInt(obj[key]) == 1){
                      $("#infoMsg").text("* Group contains just one member");
                      Bert.alert('Group contains just one member', 'warning', 'growl-top-right','200');

                    }
                  }                  
                }
              }
            });


          }
        }
        else
        {
          if(isNaN('maxMembers') && eventList == null)
            $("#impMsg").text("* Event selection and Maximum Members of Group required");
          else if(eventList == null)
            $("#impMsg").text("* Event selection required");
          else if(isNaN(maxMembers))
             $("#impMsg").text("* Maximum Members required");
          else if(parseInt(maxMembers) <=0)
            $("#impMsg").text("* Enter valid Maximum Members required");
        }


      }catch(e){

      }



    },
    "click #event_select": function (event, template) {
     
      var sEvent = $(event.currentTarget).html().trim();
      Meteor.call("checkRoundRobinDraws",Router.current().params._id,sEvent,function(error,result)
      {
        if(result)
        {
          if(result != undefined)
          {
            $("#infoMsg").text("* Please reset the draws before uploading new csv!!");
            $("#createRoundRobinDraws").prop('disabled',true);;
            $('#createRoundRobinDraws').attr('style', 'background:grey !important');
          }
          else
          {

            $("#infoMsg").text("");
            $("#createRoundRobinDraws").prop('disabled',false);;
            $('#createRoundRobinDraws').attr('style', 'background:');
          }
        }
        else if(result == undefined)
        {
            $("#infoMsg").text("");
            $("#createRoundRobinDraws").prop('disabled',false);;
            $('#createRoundRobinDraws').attr('style', 'background:');
        }
      }); 
    },
    

   
   //$("#createRoundRobinDraws").prop('disabled',false);;
            //$('#createRoundRobinDraws').attr('style', 'background:');
    

    'click #createRoundRobinDraws': function(e) {

      try
      {
        e.preventDefault();
        Session.set("uploadRRDrawCheck",true);
        var teamFormatJson = {};

        var eventList = $("[name='eventList']").val();
        var maxMembers = $("[name='maxMembers']").val();
        var checkExists = true;
        var fileHandle = $("#uploadConfigurationFileRR").find('input[type=file]')[0].files[0];
        var eventDetails = events.findOne({"tournamentId":Session.get("tournamentId"),eventName:Session.get("eventName")});
        if(eventDetails == undefined)
          eventDetails = pastEvents.findOne({"tournamentId":Session.get("tournamentId"),eventName:Session.get("eventName")});


        if(eventList != null & parseInt(maxMembers) > 0 && fileHandle != undefined)
        {
          var sEvent = eventList;
          Meteor.call("checkRoundRobinDraws",Router.current().params._id,sEvent,function(error,result)
          {
            if(result)
            {
              if(result != undefined)
              {
                checkExists = false;
                $("#infoMsg").text("* Please reset the draws before uploading new csv!!");
                $("#createRoundRobinDraws").prop('disabled',true);;
                $('#createRoundRobinDraws').attr('style', 'background:grey !important');
              }
              
            }
          });

          if(eventDetails && eventDetails.projectType)
          {
            if(eventDetails.projectType == 2)
            {
              var matchFormat = $("[name='matchFormatList']").val();
              if(matchFormat.toLowerCase() == "other")
              {
                
                var teamFormatName = $("[name='teamFormatName']").val().trim();
                var teamFormatList = Session.get("teamFormatList");

                if(teamFormatName.length > 0 && teamFormatList != undefined && teamFormatList.length > 0)
                {
                  teamFormatJson["matchFormat"] = matchFormat;
                  teamFormatJson["teamFormatName"] = teamFormatName;
                  teamFormatJson["teamFormatList"] = teamFormatList;

                }
                else
                {
                  checkExists = false;
                  $("#infoMsg").text("* TeamFormatName and selecton of atleast one format type mandatory!!");

                }


              }
              else
              {
                var formatInfo = Session.get("orgFormatData");
                if(formatInfo && formatInfo._id)
                {
                  teamFormatJson["matchFormat"] = matchFormat;
                  teamFormatJson["_id"] =formatInfo._id;
                }
                else
                {
                  checkExists = false;
                  $("#infoMsg").text("* Invalid team format!!");

                }

              }
            }
          }
         


          if(checkExists)
          {
            var sEvent = $("[name='eventList'] ").val();
            var sEventID = $("[name='eventList'] option:selected").attr("name");
            Session.set("selectedSportFromLive",undefined)
            Session.set("eventName", sEvent);
            Session.set("eventId_Draws",sEventID);
            $("#impMsg").text("");
            var fileHandle = $("#uploadConfigurationFileRR").find('input[type=file]')[0].files[0];
            var matches;
            Papa.parse(fileHandle, {
              header: true,
              keepEmptyRows:false,
              skipEmptyLines: true,
              complete: function(fileData, file){
                var data = fileData.data;
                var obj = _.countBy(data, function(data) { return data.GroupNumber; });
                //var temp = true;

                if (fileData.errors[0]&&fileData.errors[0].row&&fileData.errors[0].row == 1){
                  Bert.alert('Cannot create draws with one player!', 'danger', 'growl-top-right');
                } 
                      
                else{   
                  $("#infoMsg").text("");
          
                  for (var key in obj){
                    if(parseInt(obj[key]) > maxMembers){
                      Bert.alert('Group exceeds specified maximum members', 'danger', 'growl-top-right');
                      Session.set("uploadRRDrawCheck",false);
                      break;
                    }
                    else if(parseInt(obj[key]) == 1){
                      Bert.alert('Group contains just one member', 'warning', 'growl-top-right','200');
                      $("#infoMsg").text("* Group contains just one member");
                    }
                  }

                  if(Session.get("uploadRRDrawCheck"))
                  {
                    var eventDetails = events.findOne({"tournamentId":Session.get("tournamentId"),eventName:Session.get("eventName")});
                    if(eventDetails == undefined)
                      eventDetails = pastEvents.findOne({"tournamentId":Session.get("tournamentId"),eventName:Session.get("eventName")});
                    if(eventDetails&&eventDetails.projectType)
                      Session.set("projectTypeOfEvent",eventDetails.projectType)
                    
                    if(eventDetails&&eventDetails.projectType&&parseInt(eventDetails.projectType)==1)
                    {            
                      Session.set("uploadedFileData",fileData.data);
                      Session.set("progressBar",true)

                      Meteor.call("initRoundRobinMatchRecords", Session.get("tournamentId"), Session.get("eventName"), Session.get("eventId_Draws"), fileData,
                        maxMembers,function(error, result) {
                        Session.set("progressBar",undefined)

                          if(result){

                            if(result.status){
                              if(result.status.trim() == "failure")
                                Bert.alert(result.message, 'danger', 'growl-top-right');
                                 
                              else{
                                Bert.alert('Upload complete!', 'success', 'growl-top-right');
                                Session.set("roundRobinDraws",result.response); 
                                Session.set("roundRobinTeamDraws",undefined);
                                $("#createRRDraw").modal('hide');
                                $("#createDrawPopUp").empty();     
                                $( '.modal-backdrop' ).remove();

                              }
                            }
                          }
                        });

                       
                    }
                    else if(eventDetails&&eventDetails.projectType&&parseInt(eventDetails.projectType)==2)
                    {
                      Session.set("uploadedFileData",fileData.data);
                      Meteor.call("initRoundRobinMatchTeamRecords", Session.get("tournamentId"), Session.get("eventName"), Session.get("eventId_Draws"), fileData,
                        maxMembers,teamFormatJson,function(error, result) {
                          if(result){

                            if(result.status){
                              if(result.status.trim() == "failure")
                                Bert.alert(result.message, 'danger', 'growl-top-right');
                                 
                              else{
                                Bert.alert('Upload complete!', 'success', 'growl-top-right');
                                Session.set("roundRobinTeamDraws",result.response); 
                                Session.set("roundRobinDraws",undefined);
                                $("#createRRDraw").modal('hide');
                                $("#createDrawPopUp").empty();     
                                $( '.modal-backdrop' ).remove();

                              }
                            }
                          }
                        });
                    }
                  }
                }
              }
            });
          }
        }
        else if(isNaN('maxMembers') && eventList == null)
          $("#impMsg").text("* Event selection and Maximum Members of Group required");
        else if(eventList == null)
          $("#impMsg").text("* Event selection required");
        else if(isNaN(maxMembers))
           $("#impMsg").text("* Maximum Members required");
        else if(parseInt(maxMembers) <=0 || maxMembers == "")
          $("#impMsg").text("* Enter valid Maximum Members required");
        else if(fileHandle == undefined)
          $("#impMsg").text("* Choose file!!");

      }catch(e){
        alert(e)
      }
    },
    
    'click #closeCreateDraw':function(e)
    {
      $("#createDrawPopUp").empty();

    }
  });


/*************************************************************/
Template.createRRTeamMatchFormat.onCreated(function(){
  Session.set("teamFormatList",undefined);
})

Template.createRRTeamMatchFormat.helpers({

  "otherTeamFormatList":function()
  {
    if(Session.get("teamFormatList") != undefined)
      return Session.get("teamFormatList");
  },
  "eventType":function(data1){
    if(data1 == 1)
      return "Singles";
    else if(data1 == 2)
      return "Doubles";
  }

})

Template.createRRTeamMatchFormat.events({
  "click #addMatch":function(e){
    var typeName = $("[name='typeName']").val().trim();
    var displayTypeName = $("[name='displayTypeName']").val().trim();
    var matchType = $("[name='matchType']").val();
    var typeID = $("[name='matchType'] option:selected").attr("name");

    if(typeName.length > 0 && displayTypeName.length >0 && matchType != undefined && matchType != null)
    {
      if(Session.get("teamFormatList") == undefined)
      {
        var teamFormatList = [];
        var dataJson = {};
        dataJson["displayLabel"] = displayTypeName;
        dataJson["label"] = typeName;
        dataJson["type"] = parseInt(typeID);
        teamFormatList.push(dataJson);
        Session.set("teamFormatList",teamFormatList);
      }
      else
      {
        var teamFormatList = Session.get("teamFormatList");
        var dataJson = {};
        dataJson["displayLabel"] = displayTypeName;
        dataJson["label"] = typeName;
        dataJson["type"] = parseInt(typeID);
        teamFormatList.push(dataJson);
        Session.set("teamFormatList",teamFormatList);

      }
      $("[name='typeName']").val("");
      $("[name='displayTypeName']").val("");
      $("#matchType").val("Match Type");
    }
    else
    {
      $("#impMsg").text("* Please enter type, display label and match type");

    }



  },
  "click #deleteMatch":function(e){
    try{
      var targetName = $(e.target).attr("name");
      var currentObj = this;
      var teamFormatList = Session.get("teamFormatList");

      for(i=0; i< teamFormatList.length;i++)
      {
        if(teamFormatList[i].displayLabel == currentObj.displayLabel && teamFormatList[i].label == currentObj.label && teamFormatList[i].type == currentObj.type)
        {
          teamFormatList.splice(i,1)
         // delete teamFormatList[currentObj];
           //teamFormatList.remove(i);
        }
      }
      //$("[name=MatchType"+targetName+"]").remove();
      Session.set("teamFormatList",teamFormatList)


    }catch(e){

    }
  }
})
