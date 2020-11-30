import {
    playerDBFind
}
from '../methods/dbRequiredRole.js'
import { initDBS } from '../methods/dbRequiredRole.js'

//userDetailsTTUsed

Meteor.publish( 'fetchGroupMemberInfo', function(tournamentId,eventName){
	var raw = roundRobinEvents.rawCollection();
    var distinct = Meteor.wrapAsync(raw.distinct, raw);
    var playerList =  distinct('groupDetails.playersID.playerAId',{"tournamentId":tournamentId,"eventName":eventName});
	var toret = "userDetailsTT"

	if(playerList.length){
		var userret = Meteor.users.findOne({
			userId:playerList[0]
		})

		if(userret && userret.interestedProjectName && 
			userret.interestedProjectName.length){
			var dname = playerDBFind(userret.interestedProjectName[0])
			if(dname){
				toret = dname
			}
			var lData = global[toret].find({"userId":{$in:playerList}});
			if(lData){
				return lData;
			}
			return this.ready(); 
		}
	}

	
});




Meteor.publish( 'fetchGroupMemberTeamInfo', function(tournamentId,eventName){

	var raw = roundRobinTeamEvents.rawCollection();
    var distinct = Meteor.wrapAsync(raw.distinct, raw);
    var playerList =  distinct('groupDetails.teamsID.teamAId',{"tournamentId":tournamentId,"eventName":eventName});
	var lData = playerTeams.find({"_id":{$in:playerList}});
	if(lData){
		return lData;
	}
	return this.ready(); 
});



Meteor.publish('teamRRConfig', function(tournamentId,eventName)
{

	var lData = roundRobinTeamConfig.find({"tournamentId":tournamentId,"eventName":eventName});
	if (lData) {
		return lData;
	}
	return this.ready();
});
Meteor.publish('matchFormatConfigPub', function(matchFormatId)
{
	
		var lData = orgTeamMatchFormat.find({"_id":matchFormatId});
		if (lData) {
			return lData;
		}
	
	
	return this.ready();
});

Meteor.publish('roundRobinMatchScorePub', function(tournamentId,eventName)
{
	var lData = roundRobinMatchScore.find({"tournamentId":tournamentId,"eventName":eventName});
	if (lData) {
		return lData;
	}
	return this.ready();
});

Meteor.publish('fetchTeamUsers', function(tournamentId,teamAId,teamBId)
{
		var dbsrequired = ["userDetailsTT", "playerTeams"]
		var userDetailsTT = "userDetailsTT"
		var playerTeams = "playerTeams"
		var considerTeamEventBool = null
	       	
		var res = Meteor.call("changeDbNameForDraws", tournamentId, dbsrequired)
	    try {
	        if (res) {
	            if (res.changeDb && res.changeDb == true) 
	            {
	                if (res.changedDbNames.length != 0) {
	                    userDetailsTT = res.changedDbNames[0]
	                    playerTeams = res.changedDbNames[1]
	                    considerTeamEventBool = true
	                    var playersDB = initDBS("playersDB")
	                    if(_.contains(playersDB,userDetailsTT)){
	                        considerTeamEventBool = null
	                    }
	                }
	            }
	        }
	    }catch(e){
	    }

	    var teamAPlayers = global[playerTeams].aggregate([
	       	{ $match: {"_id": teamAId}}, 
	        {$unwind: "$teamMembers"}, 
	        {$match: {"teamMembers.teamEvent": considerTeamEventBool}}, 
	        {$project: {playerId: "$teamMembers.playerId"}}, 
	        {$group: {
	        	"_id": null,
	            players: {$push: "$playerId"}
	        }}
	    ]);

	    var teamBPlayers = global[playerTeams].aggregate([
	       	{ $match: {"_id": teamBId}}, 
	        {$unwind: "$teamMembers"}, 
	        {$match: {"teamMembers.teamEvent": considerTeamEventBool}}, 
	        {$project: {playerId: "$teamMembers.playerId"}}, 
	        {$group: {
	        	"_id": null,
	            players: {$push: "$playerId"}
	        }}
	    ]);
	    var teamAList = [];
	    var teamBList = [];
	    var playerId = [];
	    if (teamAPlayers && teamAPlayers[0] && teamAPlayers[0].players) 	    
            teamAList = teamAPlayers[0].players;
            
	    if (teamBPlayers && teamBPlayers[0] && teamBPlayers[0].players) 	    
	    	teamBList = teamBPlayers[0].players;
	    
	    playerId = teamAList.concat(teamBList);
	    var lData = Meteor.users.find({"userId":{$in:playerId}});
            if(lData)
            	return lData;

		
		return this.ready();
});


