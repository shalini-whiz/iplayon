/**
 * @PublicationName : events
 * @CollectionName : events
 * @publishDescription : to get the list of events for given userId
 */
//userDetailsTTUsed

import {
    playerDBFind
}
from '../methods/dbRequiredRole.js'

Meteor.publish( 'mEventsLimit', function(limit){
         check(limit,Number);
         if(this.userId!==undefined){
         var userId = Meteor.users.findOne({"_id":this.userId})
         if(userId!=undefined){
         var lData = myUpcomingEvents.find({"eventOrganizer":userId.userId.toString()},{limit:limit});
         if(lData!=undefined){
             return lData;
         }
         else return this.ready(); 
        }
    }
         else return this.ready(); 
});
/*Meteor.publish( 'mEventsLimitP', function(limit){
         check(limit,Number);
         if(this.userId!==undefined){
         var userId = Meteor.users.findOne({"_id":this.userId})
         if(userId!==undefined){
         var lData = events.find({"eventOrganizer":userId.userId.toString(),tournamentEvent:true},{sort:{eventName:1},limit:limit});
         if(lData){
             return lData;
         }
          else return this.ready(); 
        }
        }
         else return this.ready(); 
});
Meteor.publish( 'mEventsLimitE', function(limit){
         check(limit,Number);
          if(this.userId!==undefined){
          var userId = Meteor.users.findOne({"_id":this.userId})
           if(userId!==undefined){
         var lData = events.find({"eventOrganizer":userId.userId.toString(),tournamentEvent:true},{sort:{eventStartDate1:1},limit:limit});
         if(lData){
             return lData;
         }
          else return this.ready(); 
        }
         else return this.ready(); 
       }
});
Meteor.publish( 'mEventsLimitD', function(limit){
         check(limit,Number);
           if(this.userId!==undefined){
           var userId = Meteor.users.findOne({"_id":this.userId})
            if(userId!==undefined){
         var lData = events.find({"eventOrganizer":userId.userId.toString(),tournamentEvent:true},{sort:{domainName:1},limit:limit});
         if(lData){
             return lData;
         }
          else return this.ready(); 
        }
         else return this.ready(); 
       }
});*/



Meteor.publish( 'mpastEventsLimit', function(limit){
         check(limit,Number);
         if(this.userId!==undefined){
         var userId = Meteor.users.findOne({"_id":this.userId})
         if(userId!=undefined){
         var lData = myPastEvents.find({"eventOrganizer":userId.userId.toString()},{limit:limit});
         if(lData!=undefined){
             return lData;
         }
         else return this.ready(); 
        }
    }
         else return this.ready(); 
});

Meteor.publish('pastEventsID',function(param){
    if(param){
        var lData = pastEvents.find({"_id":param});
        if(lData){
            return lData
        }
        else return this.ready(); 
    }
});
Meteor.publish('pasteventsLISTTorunament',function(param){
  if(param){
        var lData = pastEvents.findOne({"_id":param});
        if(lData&&lData.tournamentId){
            var lDataToRet = pastEvents.find({"_id":lData.tournamentId})
            if(lDataToRet)
              return lDataToRet
        }
        else return this.ready(); 
  }
});
Meteor.publish('upeventsLISTTorunament',function(param){
  if(param){
        var lData = events.findOne({"_id":param});
        if(lData&&lData.tournamentId){
            var lDataToRet = events.find({"_id":lData.tournamentId})
            if(lDataToRet)
              return lDataToRet
        }
        else return this.ready(); 
  }
});
Meteor.publish("tournamentCategories",function(param){
    var lData = pastEvents.findOne({"_id":param});
    if(lData)
    {
      var tourDetails = pastEvents.find({$or:[
        {"_id":param},
        {"tournamentId":param}]
      });
      if(tourDetails)
      {
        return tourDetails;
      }


    }
    else
    {
      var lData = events.findOne({"_id":param});
      if(lData)
      {
        var tourDetails = events.find({$or:[
          {"_id":param},
          {"tournamentId":param}]
        });
        if(tourDetails){
          return tourDetails;
        }
      }
    }

})
Meteor.publish('pastEventsIDCategories',function(param){
    if(param){
        var lData = pastEvents.find({"tournamentId":param});
        if(lData){

            return lData
        }
        else return this.ready(); 
    }
});

Meteor.publish('upEventsID',function(param){
    if(param){
        var lData = events.find({"_id":param});
        if(lData){
            return lData
        }
        else return this.ready(); 
    }
});

Meteor.publish('eventsTournament',function(){
    var lData = events.find({tournamentEvent:true});
    if(lData){
        return lData
    }
    else return this.ready(); 
});

Meteor.publish('pastEventsTournament',function(){
    var lData = pastEvents.find({tournamentEvent:true});
    if(lData){
        return lData
    }
    else return this.ready(); 
});

Meteor.publish('pastEvents',function(){
    var lData = events.find({tournamentEvent:true});
    if(lData){
        return lData
    }
    else return this.ready(); 
});

Meteor.publish('upEventsIDCategories',function(param){
    if(param){
        var lData = events.find({"tournamentId":param});
        if(lData){
            return lData
        }
        else return this.ready(); 
    }
});



Meteor.publish('usersAcademyPAGINAT', function(){
    var lData;
    if(this.userId!==undefined){
        var userId = Meteor.users.findOne({"_id":this.userId})
        if(userId!=undefined){
            lData = Meteor.users.find({"clubNameId":userId.userId.toString()});
            if(lData!=undefined){
                return lData;
            }
            else return this.ready(); 
        }
    }
    else return this.ready(); 
});

Meteor.publish('academyAssocPAGINAT', function(){
    var lData;
    if(this.userId!==undefined){
        var userId = Meteor.users.findOne({"_id":this.userId})
        if(userId!=undefined){
            lData = Meteor.users.find({"associationId":userId.userId.toString(),role:"Academy"});
            if(lData!=undefined){
                return lData;
            }
            else return this.ready(); 
        }
    }
    else return this.ready(); 
});

Meteor.publish('distAssocPAGINAT', function(){
    var lData;
    if(this.userId!==undefined){
        var userId = Meteor.users.findOne({"_id":this.userId})
        if(userId!=undefined){
            lData = Meteor.users.find({"parentAssociationId":userId.userId.toString(),role:"Association","associationType" : "District/City"});
            if(lData!=undefined){
                return lData;
            }
            else return this.ready(); 
        }
    }
    else return this.ready(); 
});
/*Meteor.publish('usersAcademyPAGINATSearch', function(limit,searchValue){
    var lData;
    if(this.userId!==undefined){
        var userId = Meteor.users.findOne({"_id":this.userId})
        if(userId!=undefined){
            var reObj = new RegExp(searchValue, 'i');
            lData = Meteor.users.find({userName: {$regex:reObj}, role:"Player","clubNameId":userId.userId.toString()},{limit:limit});
            if(lData!=undefined){
                return lData;
            }
            else return this.ready(); 
        }
    }
    else return this.ready(); 
});*/

Meteor.publish('usersAcademyOther', function(){
    var lData;
    if(this.userId!==undefined){
        var userId = Meteor.users.findOne({"_id":this.userId})
        if(userId!=undefined){
            lData = Meteor.users.find({"clubNameId":"other",role:"Player"});
            if(lData!=undefined){
                return lData;
            }
            else return this.ready(); 
        }
    }
    else return this.ready(); 
});

Meteor.publish('academyAssocOther', function(){
    var lData;
    if(this.userId!==undefined){
        var userId = Meteor.users.findOne({"_id":this.userId})
        if(userId!=undefined){
            lData = Meteor.users.find({"associationId":"other",role:"Academy"});
            if(lData!=undefined){
                return lData;
            }
            else return this.ready(); 
        }
    }
    else return this.ready(); 
});

Meteor.publish('distAssocAssocOther', function(){
    var lData;
    if(this.userId!==undefined){
        var userId = Meteor.users.findOne({"_id":this.userId})
        if(userId!=undefined){
            lData = Meteor.users.find({"role":"Association","parentAssociationId" : "other", "associationType" : "District/City"});
            if(lData!=undefined){
                return lData;
            }
            else return this.ready(); 
        }
    }
    else return this.ready(); 
});


Meteor.publish('eventFeeSettings', function() {
  var lData = eventFeeSettings.find({});
  if (lData) {
    return lData;
  }
  return this.ready();
});

Meteor.publish('eventFeeSettingsOfTourn', function(param) {
  var lData = eventFeeSettings.find({tournamentId:param});
  if (lData) {
    return lData;
  }
  return this.ready();
});


Meteor.publish('playerEntriesOfTourn', function(param) {
  var lData =playerEntries.find({tournamentId:param},{
      sort:{academyId:1}})
  
  if (lData) {
    return lData;
  }
  return this.ready();
});


Meteor.publish('eventsLIST', function(param) {
  var lData =events.find({tournamentId:param},{
      sort:{abbName:1}})
  
  if (lData) {
    return lData;
  }
  return this.ready();
});

Meteor.publish('pasteventsLIST', function(param) {
  var lData =pastEvents.find({tournamentId:param},{
      sort:{abbName:1}})

  if (lData) {
    return lData;
  }
  return this.ready();
});

Meteor.publish('tournamentEVENT', function(param) {
  var lData =events.find({"_id":param})
  
  if (lData) {
    return lData;
  }
  return this.ready();
});

Meteor.publish('playerEntriesOfTournComputeTot', function(param) {
  try{
  var lData =playerEntriesComputeTotal.find({tournamentId:param})
  
  if (lData) {
    return lData;
  }
  return this.ready();
  }catch(e){
  }
});

 Meteor.publish('playerEntries', function() {
        var lData = playerEntries.find({});
        if (lData) {
                return lData;
        }
        return this.ready();
});

 Meteor.publish('academyEntries', function() {
        var lData = academyEntries.find({});
        if (lData) {
                return lData;
        }
        return this.ready();
});


/*Meteor.publish( 'mpastEventsLimitP', function(limit){
         check(limit,Number);
         if(this.userId!==undefined){
         var userId = Meteor.users.findOne({"_id":this.userId})
         if(userId!==undefined){
         var lData = events.find({"eventOrganizer":userId.userId.toString(),tournamentEvent:true},{sort:{eventName:1},limit:limit});
         if(lData){
             return lData;
         }
          else return this.ready(); 
        }
        }
         else return this.ready(); 
});
Meteor.publish( 'mpastEventsLimitE', function(limit){
         check(limit,Number);
          if(this.userId!==undefined){
          var userId = Meteor.users.findOne({"_id":this.userId})
           if(userId!==undefined){
         var lData = events.find({"eventOrganizer":userId.userId.toString(),tournamentEvent:true},{sort:{eventStartDate1:1},limit:limit});
         if(lData){
             return lData;
         }
          else return this.ready(); 
        }
         else return this.ready(); 
       }
});
Meteor.publish( 'mpastEventsLimitD', function(limit){
         check(limit,Number);
           if(this.userId!==undefined){
           var userId = Meteor.users.findOne({"_id":this.userId})
            if(userId!==undefined){
         var lData = events.find({"eventOrganizer":userId.userId.toString(),tournamentEvent:true},{sort:{domainName:1},limit:limit});
         if(lData){
             return lData;
         }
          else return this.ready(); 
        }
         else return this.ready(); 
       }
});*/
/**
 * @PublicationName : events
 * @CollectionName : events
 * @publishDescription : to get the list of events 
 */

/*Meteor.publish( 'pEventsLimit', function(limit){
        check(limit,Number);
        if(this.userId!==undefined){   
        lUserId = Meteor.users.find({"_id":this.userId}).fetch();
        if(lUserId){
         var s = events.find({
            $or: [{
                    domainId: {
                        $in: lUserId[0].interestedDomainName
                    }
                }, {
                    subDomain1Name: {
                        $in: lUserId[0].interestedSubDomain1Name
                    }
                }, {
                    subDomain2Name: {
                        $in: lUserId[0].interestedSubDomain2Name
                    }
                }],
                eventEndDate: {
                    //lesser than new date or current date and time
                    $lt: new Date()
                },
                projectId: {
                    $in:lUserId[0].interestedProjectName
                }
         },{limit:limit});
        if(s){
        return s;
        }
        else
            return this.ready()
    }
}        else
            return this.ready()
});
Meteor.publish( 'pEventsLimitD', function(limit){
        check(limit,Number);
        if(this.userId!==undefined){   
        lUserId = Meteor.users.find({"_id":this.userId}).fetch();
        if(lUserId){
         return events.find({
            $or: [{
                    domainId: {
                        $in: lUserId[0].interestedDomainName
                    }
                }, {
                    subDomain1Name: {
                        $in: lUserId[0].interestedSubDomain1Name
                    }
                }, {
                    subDomain2Name: {
                        $in: lUserId[0].interestedSubDomain2Name
                    }
                }],
                eventEndDate: {
                    //lesser than new date or current date and time
                    $lt: new Date()
                },
                projectId: {
                    $in:lUserId[0].interestedProjectName
                }
         },{sort:{domainName:1},limit:limit});
        
    }
        else
            return this.ready()
    }
        else
            return this.ready()
});
Meteor.publish( 'pEventsLimitE', function(limit){
        check(limit,Number);
        if(this.userId!==undefined){   
        lUserId = Meteor.users.find({"_id":this.userId}).fetch();
        if(lUserId){
         return events.find({
            $or: [{
                    domainId: {
                        $in: lUserId[0].interestedDomainName
                    }
                }, {
                    subDomain1Name: {
                        $in: lUserId[0].interestedSubDomain1Name
                    }
                }, {
                    subDomain2Name: {
                        $in: lUserId[0].interestedSubDomain2Name
                    }
                }],
                eventEndDate: {
                    //lesser than new date or current date and time
                    $lt: new Date()
                },
                projectId: {
                    $in:lUserId[0].interestedProjectName
                }
         },{sort:{"eventStartDate":1},limit:limit});
        
    }
        else
            return this.ready()
    }
        else
            return this.ready()

});
Meteor.publish( 'pEventsLimitP', function(limit){
        check(limit,Number);
         if(this.userId!==undefined){   
        lUserId = Meteor.users.find({"_id":this.userId}).fetch();
        if(lUserId){
         return events.find({
            $or: [{
                    domainId: {
                        $in: lUserId[0].interestedDomainName
                    }
                }, {
                    subDomain1Name: {
                        $in: lUserId[0].interestedSubDomain1Name
                    }
                }, {
                    subDomain2Name: {
                        $in: lUserId[0].interestedSubDomain2Name
                    }
                }],
                eventEndDate: {
                    //lesser than new date or current date and time
                    $lt: new Date()
                },
                projectId: {
                    $in:lUserId[0].interestedProjectName
                }
         },{sort:{"projectName":1},limit:limit});
        
    }
        else
            return this.ready()
    }
        else
            return this.ready()

});
Meteor.publish( 'uEventsLimit', function(limit){
        check(limit,Number);
        //check(userId,String)
        if(this.userId!==undefined){
        lUserId = Meteor.users.find({"_id":this.userId}).fetch();

        if(lUserId.length!=0){
         var s = events.find({
            $or: [{
                    domainId: {
                        $in: lUserId[0].interestedDomainName
                    }
                }, {
                    subDomain1Name: {
                        $in: lUserId[0].interestedSubDomain1Name
                    }
                }, {
                    subDomain2Name: {
                        $in: lUserId[0].interestedSubDomain2Name
                    }
                }],
                eventStartDate1: {
                    //lesser than new date or current date and time
                    $gt: new Date()
                },
                projectId: {
                    $in:lUserId[0].interestedProjectName
                }
         },{limit:limit});

        if(s)
            return s;
        else
            return this.ready()
    }
}        else
            return this.ready()

});

Meteor.publish( 'uEventsLimitD', function(limit){
        check(limit,Number);

        if(this.userId!==undefined){
        lUserId = Meteor.users.find({"_id":this.userId}).fetch();
        if(lUserId){
         var s = events.find({
            $or: [{
                    domainId: {
                        $in: lUserId[0].interestedDomainName
                    }
                }, {
                    subDomain1Name: {
                        $in: lUserId[0].interestedSubDomain1Name
                    }
                }, {
                    subDomain2Name: {
                        $in: lUserId[0].interestedSubDomain2Name
                    }
                }],
                eventStartDate1: {
                    //lesser than new date or current date and time
                    $gt: new Date()
                },
                projectId: {
                    $in:lUserId[0].interestedProjectName
                }
         },{sort:{domainName:1},limit:limit});

        return s
    }    
        else
            return this.ready()
    }
        else
            return this.ready()

});
Meteor.publish( 'uEventsLimitE', function(limit){
        check(limit,Number);

        if(this.userId!==undefined){
        lUserId = Meteor.users.find({"_id":this.userId}).fetch();
        if(lUserId){
         return events.find({
            $or: [{
                    domainId: {
                        $in: lUserId[0].interestedDomainName
                    }
                }, {
                    subDomain1Name: {
                        $in: lUserId[0].interestedSubDomain1Name
                    }
                }, {
                    subDomain2Name: {
                        $in: lUserId[0].interestedSubDomain2Name
                    }
                }],
                eventStartDate1: {
                    //lesser than new date or current date and time
                    $gt: new Date()
                },
                projectId: {
                    $in:lUserId[0].interestedProjectName
                }
         },{sort:{"eventStartDate1":1},limit:limit});
        
    }    
        else
            return this.ready()
    }
        else
            return this.ready()
});
Meteor.publish( 'uEventsLimitP', function(limit){
        check(limit,Number);
        if(this.userId!==undefined){
        lUserId = Meteor.users.find({"_id":this.userId}).fetch();

        if(lUserId){
         return events.find({
            $or: [{
                    domainId: {
                        $in: lUserId[0].interestedDomainName
                    }
                }, {
                    subDomain1Name: {
                        $in: lUserId[0].interestedSubDomain1Name
                    }
                }, {
                    subDomain2Name: {
                        $in: lUserId[0].interestedSubDomain2Name
                    }
                }],
                eventStartDate1: {
                    //lesser than new date or current date and time
                    $gt: new Date()
                },
                projectId: {
                    $in:lUserId[0].interestedProjectName
                }
         },{sort:{"projectName":1},limit:limit});
        
    }    
        else
            return this.ready()
    }
        else
            return this.ready()
});

Meteor.publish( 'mEventsGetList', function(){
         if(this.userId!==undefined){
         var userId = Meteor.users.findOne({"_id":this.userId})
         if(userId!=undefined){
         var lData = events.find({"eventOrganizer":userId.userId.toString(),"tournamentEvent":true});
         if(lData!=undefined){
             return lData;
         }
         else return this.ready(); 
        }
    }
         else return this.ready(); 
});*/

Meteor.publish('eventUpcoming', function(limit){
    var hh = []
    var k;
    var lUserId = Meteor.users.findOne({"_id":this.userId});
    if(lUserId){
      if(lUserId.role=="Association"){
        var assocFind = associationDetails.findOne({"userId":lUserId.userId});
        if(assocFind&&assocFind.interestedDomainName&&assocFind.interestedProjectName){
          lUserId.interestedProjectName = assocFind.interestedProjectName;
          lUserId.interestedDomainName = assocFind.interestedDomainName
        }
      }
      else if(lUserId.role=="Academy"){
        var acadDetails = academyDetails.findOne({"userId":lUserId.userId});
        if(acadDetails&&acadDetails.interestedDomainName&&acadDetails.interestedProjectName){
          lUserId.interestedProjectName = acadDetails.interestedProjectName;
          lUserId.interestedDomainName = acadDetails.interestedDomainName
        }
      }
      else if(lUserId.role=="Player"){
        var userDetails = Meteor.users.findOne({"userId":lUserId.userId});
        if(userDetails&&userDetails.interestedProjectName && userDetails.interestedProjectName.length){
          lUserId.interestedProjectName = userDetails.interestedProjectName;
          
          var toret = playerDBFind(userDetails.interestedProjectName[0])
          if(toret){
            userDetails = global[toret].findOne({userId:lUserId.userId})
            if(userDetails.interestedDomainName){
              lUserId.interestedDomainName = userDetails.interestedDomainName
            }
          }
        }
      }
      else if(lUserId.role=="Umpire"||lUserId.role=="Coach"||lUserId.role=="Organiser"||lUserId.role=="Other"||lUserId.role=="Journalist"){
        var otherDetails = otherUsers.findOne({"userId":lUserId.userId});
        if(otherDetails&&otherDetails.interestedDomainName&&otherDetails.interestedProjectName){
          lUserId.interestedProjectName = otherDetails.interestedProjectName;
          lUserId.interestedDomainName = otherDetails.interestedDomainName
        }
      }
    }
    if(lUserId!=undefined&&lUserId.interestedDomainName&&lUserId.interestedProjectName){
        k = events.find({
                    domainId: {
                        $in: lUserId.interestedDomainName
                    },
                projectId: {
                    $in:lUserId.interestedProjectName
                },
                tournamentEvent:true,
          },{sort:{eventEndDate1:-1},limit:limit});
      if (k) {
          return k;
      }
    return this.ready();
    }
});

Meteor.publish('eventPast', function(limit){
    var hh = []
    var k;
    var lUserId = Meteor.users.findOne({"_id":this.userId});
    if(lUserId){
      if(lUserId.role=="Association"){
        var assocFind = associationDetails.findOne({"userId":lUserId.userId});
        if(assocFind&&assocFind.interestedDomainName&&assocFind.interestedProjectName){
          lUserId.interestedProjectName = assocFind.interestedProjectName;
          lUserId.interestedDomainName = assocFind.interestedDomainName
        }
      }
      else if(lUserId.role=="Academy"){
        var acadDetails = academyDetails.findOne({"userId":lUserId.userId});
        if(acadDetails&&acadDetails.interestedDomainName&&acadDetails.interestedProjectName){
          lUserId.interestedProjectName = acadDetails.interestedProjectName;
          lUserId.interestedDomainName = acadDetails.interestedDomainName
        }
      }
      else if(lUserId.role=="Player"){
        var userDetails = Meteor.users.findOne({"userId":lUserId.userId});
        if(userDetails&&userDetails.interestedProjectName && userDetails.interestedProjectName.length){
          lUserId.interestedProjectName = userDetails.interestedProjectName;
          
          var toret = playerDBFind(userDetails.interestedProjectName[0])
          if(toret){
            userDetails = global[toret].findOne({userId:lUserId.userId})
            if(userDetails.interestedDomainName){
              lUserId.interestedDomainName = userDetails.interestedDomainName
            }
          }
        }
      }
      else if(lUserId.role=="Umpire"||lUserId.role=="Coach"||lUserId.role=="Organiser"||lUserId.role=="Other"||lUserId.role=="Journalist"){
        var otherDetails = otherUsers.findOne({"userId":lUserId.userId});
        if(otherDetails&&otherDetails.interestedDomainName&&otherDetails.interestedProjectName){
          lUserId.interestedProjectName = otherDetails.interestedProjectName;
          lUserId.interestedDomainName = otherDetails.interestedDomainName
        }
      }
    }
    if(lUserId!=undefined&&lUserId.interestedDomainName&&lUserId.interestedProjectName){
        k = pastEvents.find({ domainId: {
                        $in: lUserId.interestedDomainName
                    },
                projectId: {
                    $in:lUserId.interestedProjectName
                },
                tournamentEvent:true,
          },{limit:limit});
        if (k) {
      return k;
    }
    return this.ready();
    }
});

Meteor.publish('eventsLISTForParam', function(param) {
  var lData =events.find({tournamentId:param})
  if (lData) {
    return lData;
  }
  return this.ready();
});


Meteor.publish('organizerTournaments', function(param) {
  var lData =pastEvents.find({eventOrganizer:this.userId,tournamentEvent:true},{eventName:1})
  if (lData) {
    return lData;
  }
  return this.ready();
});


Meteor.publish('playersOfTournBasedEntries', function(param) {
  var raw = playerEntries.rawCollection();
  var distinct = Meteor.wrapAsync(raw.distinct, raw);
  var playerIndList =  distinct('playerId',{"tournamentId":param});

  var raw = playerTeamEntries.rawCollection();
  var distinct = Meteor.wrapAsync(raw.distinct, raw);
  var playerTeamList =  distinct('playerId',{"tournamentId":param});

  var playerList = playerIndList.concat(playerTeamList);

  var lData = Meteor.users.find({"_id":{$in:playerList}});
  if(lData){
    return lData;
  }
  return this.ready(); 
});

/*Meteor.publish("eventTiming", function() {

  //Transform function
  var transform = function(doc) {
    if(doc.eventEndDate1 >=moment.utc(new Date()).zone(doc.offset))
    return doc;
  }

var self = this;
var lUserId = Meteor.users.findOne({"_id":this.userId});            
var observer = events.find({$or: [{
                        domainId: {
                            $in: lUserId.interestedDomainName
                        }
                    }, {
                        subDomain1Name: {
                            $in: lUserId.interestedSubDomain1Name
                        }
                    }, {
                        subDomain2Name: {
                            $in: lUserId.interestedSubDomain2Name
                        }
                    }],
                    projectId: {
                        $in:lUserId.interestedProjectName
                    },
                    tournamentEvent:true
             },{sort:{eventName:1},}).observe({
      added: function (document) {
        if(document.eventEndDate1 >=moment.utc(new Date()).zone(document.offset)){
      self.added('eventtiming', document._id, document);
      }
    },
    changed: function (newDocument, oldDocument) {
        if(document.eventEndDate1 >=moment.utc(new Date()).zone(newDocument.offset))
      self.changed('eventtiming', newDocument._id, newDocument);
    },
    removed: function (oldDocument) {
      self.removed('eventtiming', oldDocument._id);
    }
  });

  self.onStop(function () {
    observer.stop();
  });

  self.ready();

});*/