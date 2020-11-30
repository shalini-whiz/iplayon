Meteor.publish('apiUsersPub', function() {
    try{
        var lData = apiUsers.find({});
        return lData
    }catch(e){
    }   
});

Meteor.publish('calendarEventsPub', function() {
    try{
        var lData = calenderEvents.find({});
        return lData
    }catch(e){
    }   
});

Meteor.publish('upcomingEventsPub', function() {
    try{
        var lData = events.find({"tournamentEvent":true});
        return lData
    }catch(e){
    }   
});

Meteor.publish('pastEventsPub', function() {
    try{
        var lData = pastEvents.find({"tournamentEvent":true});
        return lData
    }catch(e){
    }   
});


Meteor.publish('upcomingEventsNamePub', function() {
    try{
        //var lData = events.find({"tournamentEvent":true},{fields:{"_id":1,"eventName":1}});
        var lData = events.find({"tournamentEvent":true});
        return lData
    }catch(e){
    }   
});

Meteor.publish('pastEventsNamePub', function() {
    try{
        //var lData = pastEvents.find({"tournamentEvent":true},{fields:{"_id":1,"eventName":1}});
        var lData = pastEvents.find({"tournamentEvent":true});
        return lData
    }catch(e){
    }   
});






Meteor.publish('liveEventsOrganizerPub', function() {
    try{
        var lData = events.find({"tournamentEvent":true,"eventOrganizer":Meteor.userId()});
        return lData
    }catch(e){
    }   
});

Meteor.publish('pastEventsOrganizerPub', function() {
    try{
        var lData = pastEvents.find({"tournamentEvent":true,eventOrganizer:Meteor.userId()});
        return lData
    }catch(e){
    }   
});



Meteor.publish('teamPointsPub',function(){
    try{
        var lData = teamPoints.find({});
        return lData
    }catch(e){
    } 

})

Meteor.publish('tourTeamSchedulePub',function(){
    try{

        var lData = tourTeamSchedule.find({});
        return lData
    }catch(e){
        errorLog(e)
    } 

})


Meteor.publish('eventSchedulePub',function(){
    try{

        var lData = eventSchedule.find({});
        return lData
    }catch(e){
        errorLog(e)
    } 

})


Meteor.publish('eventScheduleOrganizerPub',function(){
    try{

        var raw1 = pastEvents.rawCollection();
        var distinct1 = Meteor.wrapAsync(raw1.distinct, raw1);                
        var pastTourList = distinct1('_id',{eventOrganizer:Meteor.userId(),tournamentEvent:true});

        var raw2 = events.rawCollection();
        var distinct2 = Meteor.wrapAsync(raw2.distinct, raw2);                
        var liveTourList = distinct2('_id',{eventOrganizer:Meteor.userId(),tournamentEvent:true});


        var tourList = pastTourList.concat(liveTourList)
        var lData = eventSchedule.find({"tournamentId":{$in:tourList}});
        return lData
    }catch(e){
        errorLog(e)
    } 

})




Meteor.publish('registrationValidityPub',function(){
    try{
        var lData = registrationValidity.find({});
        return lData
    }catch(e){
    } 

})

Meteor.publish('liveLinksPub', function() {
    try{
        var lData = liveLinks.find({});
        return lData
    }catch(e){
    }   
});




Meteor.publish('apiUsersListPub', function() {
    try{
        var raw = apiUsers.rawCollection();
        var distinct = Meteor.wrapAsync(raw.distinct, raw);                
        var userIdList = distinct('userId');
        var lData = Meteor.users.find({"userId":{$in:userIdList}});
        return lData
    }catch(e){
    }   
});

Meteor.publish('playerPointsOrganizerPub', function() {
    try{
        var raw = PlayerPoints.rawCollection();
        var distinct = Meteor.wrapAsync(raw.distinct, raw);                
        var userIdList = distinct('organizerId');
        var lData = Meteor.users.find({"userId":{$in:userIdList}});
        return lData
    }catch(e){
    }   
});


Meteor.publish('certificationPub', function() {
    try{
        var lData = certification.find({});
        return lData
    }catch(e){
    }   
});

Meteor.publish('sportPub', function() {
    try{
        var lData = tournamentEvents.find({},{fields:{
        	"_id":1,
        	"projectMainName":1
        }});
        return lData
    }catch(e){
    }   
});



Meteor.publish('pubNIBasedCountry', function(searchValue) {
    try{
        var lData = customDataDB.find({
        	"type" : "nationalIdentity",
            "customKeyData.country": searchValue
			},
        	{
                fields: {
                    "_id": 1,
                    "type":1,
                    "customKeyData": {
                        $elemMatch: {
                            "country": searchValue
                        }
                    }
                }
            });
        return lData
    }catch(e){
    }   
});



Meteor.publish('fitBitPub', function() {
    try{

        var lData = fitbitTokens.find({});
        return lData
    }catch(e){
    }   
});