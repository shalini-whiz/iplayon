import {nameToCollection} from '../dbRequiredRole.js'


Meteor.methods({
  "getUpcomingEvents": async function(caller, apiKey, userId) 
  {
    if (apiUsers.findOne({"apiUser": caller}).apiKey != apiKey) 
    {
      return;
    } 
    else
    {
      try 
      {
        var jsonS = []
        var lUserId = Meteor.users.findOne({"_id": userId,"role":"Player"});
        var hh = []
        var k;
        var userDetails;        
        var eventList = [];         
        if(lUserId)
        {
          var playerInfo = nameToCollection(lUserId.userId).findOne({"userId":lUserId.userId})
          if(playerInfo)
          {
            if(playerInfo.interestedDomainName && playerInfo.interestedDomainName.length > 0)
            {
              if(playerInfo.interestedDomainName[0] == null || playerInfo.interestedDomainName[0] == "")
              {
                var raw = tournamentEvents.rawCollection();
                var distinct = Meteor.wrapAsync(raw.distinct, raw);
                var interestedProjectNameList =  distinct('_id');

                var raw = domains.rawCollection();
                var distinct = Meteor.wrapAsync(raw.distinct, raw);
                var interestedDomainNameList =  distinct('_id');

                nameToCollection(lUserId.userId).update({"userId":lUserId.userId},{
                  $set:{
                    //"interestedProjectName":interestedProjectNameList,
                    "interestedDomainName":interestedDomainNameList
                  }
                })

                /*Meteor.users.update({"userId":lUserId.userId},{
                  $set:{
                    "interestedProjectName":interestedProjectNameList
                  }
                })*/
              }
            }
          }

          userDetails = nameToCollection(lUserId.userId).findOne({"userId":lUserId.userId});
          if(userDetails&&userDetails.interestedDomainName&&userDetails.interestedProjectName)
          {
            lUserId.interestedProjectName = userDetails.interestedProjectName;
            lUserId.interestedDomainName = userDetails.interestedDomainName
          }
        }
        if(lUserId!=undefined&&lUserId.interestedDomainName&&lUserId.interestedProjectName)
        {

          eventList = events.find({ domainId: {$in: lUserId.interestedDomainName},
                projectId: {$in:lUserId.interestedProjectName},tournamentEvent:true,
              },{sort:{eventEndDate1:-1}}
              ).fetch();

          //should be on start date

          for(var i =0; i<eventList.length;i++)
          {

            var data = {
              tournamentId: eventList[i]._id,
              subscriberId: userId
            }

            var res = await Meteor.call("individualEventsSubscriptionExternalAPI", data) 
              try {
                if (res) 
                {
                  if(res[0].status)
                  {
                    if(res[0].status == "success")
                      eventList[i]['playerEntry'] = "yes";                
                    else
                      eventList[i]['playerEntry'] = "no";
                  }
                }
              }catch(e){

              }
            
            //subscription date
            if(moment(moment(eventList[i].eventSubscriptionLastDate1).format("YYYY-MM-DD"))>=moment(moment.tz(eventList[i].timeZoneName).format("YYYY-MM-DD")))           
              eventList[i]['subscribeBoolean'] = true;            
            else 
              eventList[i]['subscribeBoolean'] = false;

            var eventFeeSettingsInfo  = eventFeeSettings.findOne({"tournamentId":eventList[i]._id});
            if(eventFeeSettingsInfo)
              eventList[i]['feeSettings'] = eventFeeSettingsInfo;
            else
              eventList[i]['feeSettings'] = {};


          }
          return eventList;
        }

      } catch (e) {} 
    }
  },


  //events under upcoming tournament
  'getListOfEventsUnderTourn':async function(caller, apiKey, tournamentId,userId) 
  {
    if (apiUsers.findOne({"apiUser": caller}).apiKey != apiKey) 
    {
      return;
    }
    else
    {
      try 
      {
        var userDetails = undefined;
        if(nameToCollection(userId))
          userDetails = nameToCollection(userId).findOne({"userId": userId});
        var userGender = "";
        var userDOB = "";
        if(userDetails != undefined)
        {
          userGender = userDetails.gender.toUpperCase();
          userDOB = userDetails.dateOfBirth;
        }

        var tournInfo = events.findOne({"tournamentEvent":true,"_id":tournamentId});
        var tournOrganizer = "";
        var tournSport = "";
        var eventsUnderTournament = [];
        if(tournInfo != undefined)
        {
          tournOrganizer  = tournInfo.eventOrganizer;
          tournSport = tournInfo.projectId[0];
          eventsUnderTournament = tournInfo.eventsUnderTournament;
        }
        var subscribeBoolean = false;
        if(moment(moment(tournInfo.eventSubscriptionLastDate1).format("YYYY-MM-DD"))>=moment(moment.tz(tournInfo.timeZoneName).format("YYYY-MM-DD")))           
          subscribeBoolean = true;            
        else 
          subscribeBoolean = false;



        var eventsUnderTourList = 
        events.find({tournamentEvent: false,tournamentId: tournamentId,
          projectType :{$ne:3}},
          {fields:{"_id": 1,"projectType":1,"subscribeTeams":1,
                  "eventName":1,"abbName":1,"allowSubscription":1,
                  "subscribeBoolean":1,"prize":1,"projectId":1,"eventParticipants":1
                }}).fetch();
        var jsonS = [];
        var sortedData= _.sortBy(eventsUnderTourList, function(obj){ 
            return _.indexOf(eventsUnderTournament, obj._id);
        });
        eventsUnderTourList = sortedData;

        for(var i=0;i<eventsUnderTourList.length;i++)
        {
          var eventUnderTour = eventsUnderTourList[i];
          eventUnderTour['subscribeBoolean'] = subscribeBoolean;
          var filterStatus = false;
          var filterProjectType = eventsUnderTourList[i].projectType;
          var userDate = "";
          var filterDate = "";
          var birthDetails = dobFilterSubscribe.findOne({
                "mainProjectId": tournInfo.projectId.toString(),
                "eventOrganizer": tournInfo.eventOrganizer.toString(),
                "tournamentId": tournamentId,
                "details.eventId":eventUnderTour.projectId.toString()
            },
            {fields:{_id: 1, details: {$elemMatch: {"eventId": eventUnderTour.projectId.toString()}}}});


          if (birthDetails && birthDetails.details) 
          {
            if(birthDetails.details.length > 0)
            {
              var j = 0;     
              var find1 = birthDetails.details[j];

              if(find1.dateOfBirth.trim() == "NA" && find1.eventId == eventUnderTour.projectId.toString())
              {
                filterStatus = true;
              }
              else if(find1.ranking=="yes" && find1.dateOfBirth.trim() != "NA" && find1.eventId == eventUnderTour.projectId.toString())
              {
                if(userDetails.affiliationId!==null&& userDetails.affiliationId!=undefined&& userDetails.affiliationId!="other"&&userDetails.statusOfUser=="Active")
                {
                  if (find1.eventId == eventUnderTour.projectId.toString()) 
                  {
                    filterDate = moment(new Date(find1.dateOfBirth)).format("YYYY/DD/MMM");
                    userDate = moment(new Date(userDetails.dateOfBirth)).format("YYYY/DD/MMM");

                    if (new Date(userDate) >= new Date(filterDate) && find1.gender.toUpperCase() == userDetails.gender.trim().toUpperCase()) 
                      filterStatus =  true
                    else if (new Date(userDate) >= new Date(filterDate) && find1.gender.toUpperCase() == "ALL") 
                      filterStatus =  true
                    else 
                      filterStatus = false  
                  }
                }
                else if(find1.eventId == eventUnderTour.projectId.toString())
                {
                  filterStatus = false;
                }
              }
              else if(find1.ranking=="no" && find1.dateOfBirth.trim() != "NA" && find1.eventId == eventUnderTour.projectId.toString())
              {

                if (find1.eventId == eventUnderTour.projectId.toString()) 
                {
                  filterDate = moment(new Date(find1.dateOfBirth)).format("YYYY/DD/MMM");
                  userDate = moment(new Date(userDetails.dateOfBirth)).format("YYYY/DD/MMM");

                  if(new Date(userDate) >= new Date(filterDate) && find1.gender.toUpperCase() == userDetails.gender.trim().toUpperCase())
                    filterStatus = true;
                  else if(new Date(userDate) >= new Date(filterDate) && find1.gender.toUpperCase() == "ALL")
                    filterStatus = true;
                  else
                    filterStatus = false           
                }
              }
            }
          }
          if(filterStatus)
          {
            var subscribeTeams = [];
            var subscribedTeamNames = [];
            var teamMemberDetails = {};
            eventUnderTour["subscribeTeams"] =subscribeTeams;
            eventUnderTour["subscribedTeamNames"] =subscribedTeamNames;

            if(filterProjectType == 2)
            {
              var teamList = playerTeams.find({"teamManager":userId,"teamFormatId":find1.eventId}).fetch();
              for(var h=0 ;h < teamList.length;h++)
              {
                var result = await Meteor.call("validateExistingTeam",teamList[h]._id)
                try{
                  if(result)
                  {
                    subscribeTeams.push(teamList[h]);
                    subscribedTeamNames.push(teamList[h].teamName);
                    if(result.teamMembers)
                    {
                      //eventUnderTour[teamList[h].teamName] = result.teamMembers;
                      eventUnderTour[teamList[h]._id] = result.teamMembers;
                    }

                      //eventUnderTour[teamList[h].teamName+"id"] = result._id;
                      var playerTeamEntriesInfo = playerTeamEntries.findOne({"playerId":userId,"tournamentId":tournamentId});
                      if(playerTeamEntriesInfo)
                        eventUnderTour["subscribedTeamDetails"] = playerTeamEntriesInfo;



                  }
                }catch(e){
                }

              }
              eventUnderTour["subscribeTeams"] =subscribeTeams;
              eventUnderTour["teamMemberDetails"] =teamMemberDetails;

            }

            jsonS.push(eventUnderTour)


          }

        }

        return jsonS
      } catch (e) {
      }
    }
  },

  //events under upcoming tournament
  'getEventsOfTourn': function(caller, apiKey, tournamentId,userId) 
  {
    if (apiUsers.findOne({"apiUser": caller}).apiKey != apiKey) 
    {
      return;
    }
    else
    {
      try 
      {
        var resultJson = {};
        var userGender = "";
        var userDOB = "";
        
        var tournInfo = events.findOne({"tournamentEvent":true,"_id":tournamentId});
        var tournOrganizer = "";
        var tournSport = "";
        var checkTournament="";
        var eventsUnderTournament = [];
        if(tournInfo != undefined)
        {
          tournOrganizer  = tournInfo.eventOrganizer;
          tournSport = tournInfo.projectId[0];
          eventsUnderTournament = tournInfo.eventsUnderTournament;
          checkTournament = "upcoming";
        }
        else
        {
          var tournInfo = pastEvents.findOne({"tournamentEvent":true,"_id":tournamentId});
          if(tournInfo)
          {
            tournOrganizer  = tournInfo.eventOrganizer;
            tournSport = tournInfo.projectId[0];
            checkTournament = "past";
            eventsUnderTournament = tournInfo.eventsUnderTournament;

          }
        }
        
        if(checkTournament.trim() == "upcoming")
        {
          var eventsUnderTourList = events.find({tournamentEvent: false,tournamentId: tournamentId,projectType :{$ne:3}}
            ).fetch();

          if(eventsUnderTourList.length > 0)
          {
            resultJson["status"] = "success";
            resultJson["data"] = eventsUnderTourList;
          }
          else
          {
            var emptyArray = [];
            resultJson["status"] = "failure";
            resultJson["data"] = emptyArray;
          }
        }
        else
        {
          var eventsUnderTourList = pastEvents.find({tournamentEvent: false,tournamentId: tournamentId,projectType :{$ne:3}}
            ).fetch();
          if(eventsUnderTourList.length > 0)
          {
            resultJson["status"] = "success";
            resultJson["data"] = eventsUnderTourList;
          }
          else
          {
            var emptyArray = [];
            resultJson["status"] = "failure";
            resultJson["data"] = emptyArray;
          }
        }
        
      
       
        var sortedData= _.sortBy(resultJson.data, function(obj){ 
            return _.indexOf(eventsUnderTournament, obj._id);
        });


        resultJson.data = sortedData;
        return resultJson
      } catch (e) {

      }
    }
  },


  

});

Meteor.methods({
  "getFullNameOfStroke":function(strokeShortName){
    if(strokeShortName)
    {
      var findDet = strokes.findOne({"strokeShortCode":strokeShortName})
      if(findDet&&findDet.strokeName){
        return findDet.strokeName
      }
      else return "Unknown"
    }
  }
});

