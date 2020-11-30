 import {nameToCollection} from '../methods/dbRequiredRole.js'


 Meteor.publish('associations', function() {
	var lData = associations.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});

Meteor.publish('academies', function() {
	var lData = academies.find({},{fields:{"_id" : 1, "academyId" : 1, "academyName" : 1}});
	if (lData) {
		return lData;
	}
	return this.ready();
});


 Meteor.publish('associationDetails', function() {
	var lData = associationDetails.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});


Meteor.publish('academyDetails', function() {
	var lData = academyDetails.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});

Meteor.publish('otherUsers', function() {
	var lData = otherUsers.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});


Meteor.publish('eventOrganizerRanking', function() {
    try{
    	var raw = PlayerPoints.rawCollection();
        var distinct = Meteor.wrapAsync(raw.distinct, raw);                
        var userIdList = distinct('organizerId');
        var lData = Meteor.users.find({"userId":{$in:userIdList}});
        return lData
    }catch(e){
    }   
});

Meteor.publish('getPlayersBasedOnSport', function(sportID) {
    try{

        var lData = nameToCollection(sportID).find({});
        return lData
    }catch(e){
    }   
});

Meteor.publish('onlyPlayers', function() {
    try{

        var lData = Meteor.users.find({"role":"Player"},{fields:{"userName":1,"userId":1}});
        return lData
    }catch(e){
    }   
});


