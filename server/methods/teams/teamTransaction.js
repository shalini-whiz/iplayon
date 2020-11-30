
import {playerDBFind} from '../dbRequiredRole.js'
//userDetailsTTUsed

Meteor.methods({
	"checkTeamEntryTour":function(id)
	{
		var subscribedTour = playerTeamEntries.find({"subscribedTeamID":{$in:[id]}}).fetch();
		if(subscribedTour.length > 0)
			return false;
		else
			return true;

	},
	"deleteTeam":function(id)
	{
		try
		{
			var deleteTeamEntry = playerTeams.remove({"_id":id}); 
			return deleteTeamEntry;
		}catch(e){}
	},
	fetchTeamDetails:function(id)
	{ 
		var teamInfo;
		var teamInfoArr = playerTeams.aggregate([
			{$match:{"_id":id}},
			{$unwind: "$teamMembers"}, 
  			{$sort: {"teamMembers.playerNumber":1}}, 
  			{$group: {_id:"$_id", 
  			teamMembers: {$push:"$teamMembers"},
  			"teamFormatId": { "$first": "$teamFormatId"},
			}}
		])

		if(teamInfoArr.length > 0)
			teamInfo = teamInfoArr[0];
		if(teamInfo)
		{
			var teamPlayerArray = teamInfo.teamMembers;
	        for(var i = 0; i< teamPlayerArray.length; i++)
	        {
	        	var k = parseInt(i)+1;
	        	var teamPlayerIndex = teamInfo.teamMembers[i].playerNumber;
	        	var teamPlayerId = teamInfo.teamMembers[i].playerId;
	        	
	        	var toret = "userDetailsTT"

	            var usersMet = Meteor.users.findOne({
	                userId: teamPlayerId
	            })

	            if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
	                var dbn = playerDBFind(usersMet.interestedProjectName[0])
	                if (dbn) {
	                    toret = dbn
	                }
	            }

	        	var playerInfo = global[toret].findOne({"userId":teamPlayerId});
	        	if(playerInfo)
	        		teamInfo.teamMembers[i].playerName =  playerInfo.userName;
	        	else
	        		teamInfo.teamMembers[i].playerName = "";

	        	var teamFormatInfo = teamsFormat.findOne(
	        		{"playerFormatArray.playerNo": teamPlayerIndex,"_id":teamInfo.teamFormatId},
	        		{fields:{_id: 0, playerFormatArray: {$elemMatch: {playerNo: teamPlayerIndex}}}});

	        	if(teamFormatInfo)
	        	{
	        		teamPlayerArray[i].criteria = teamFormatInfo.playerFormatArray[0];
	        	}
	        	teamPlayerArray[i].indexNumber = k;

	        }
	        return teamInfo.teamMembers;
		}
	        	
	},
	teamDetailValidation:function(id)
	{
		var teamManagerRole = "";
		var teamInfo = playerTeams.findOne({"_id":id});
		if(teamInfo)
		{
			var teamPlayerArray = teamInfo.teamMembers;
			var teamManagerId  = teamInfo.teamManager;
			var teamManagerInfo = Meteor.users.findOne({"userId":teamManagerId});
			if(teamManagerInfo)
			{
				teamManagerRole = teamManagerInfo.role;
			}
	        for(var i = 0; i< teamPlayerArray.length; i++)
	        {
	        	var genderStatus = false;
	        	var dobStatus = false;
	        	var locStatus = false;
	        	var affilationStatus = false;
	        	var playerStatus = false;
	        	var k = parseInt(i)+1;
	        	var teamPlayerIndex = teamInfo.teamMembers[i].playerNumber;
	        	var teamPlayerId = teamInfo.teamMembers[i].playerId;

	        	var toret = "userDetailsTT"

	            var usersMet = Meteor.users.findOne({
	                userId: teamPlayerId
	            })

	            if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
	                var dbn = playerDBFind(usersMet.interestedProjectName[0])
	                if (dbn) {
	                    toret = dbn
	                }
	            }

	        	var playerInfo = global[toret].findOne({"userId":teamPlayerId});

	        	if(playerInfo)
	        		teamInfo.teamMembers[i].playerName =  playerInfo.userName;
	        	else
	        		teamInfo.teamMembers[i].playerName = "";



	        	var teamFormatInfo = teamsFormat.findOne({"playerFormatArray.playerNo": teamPlayerIndex,
	        		"_id":teamInfo.teamFormatId},{fields:{_id: 0, playerFormatArray: {$elemMatch: 
	        		{playerNo: teamPlayerIndex}}}});
	        	if(teamFormatInfo)
	        	{
	        		teamPlayerArray[i].criteria = teamFormatInfo.playerFormatArray[0];
	        		var genderCriteria = teamFormatInfo.playerFormatArray[0].gender;
	        		var dobCriteria = teamFormatInfo.playerFormatArray[0].dateType;
	        		var dobValue = "";
	        		if(teamFormatInfo.playerFormatArray[0].dateValue)
	        			dobValue = teamFormatInfo.playerFormatArray[0].dateValue;
	        		var locCriteria = teamFormatInfo.playerFormatArray[0].locationType;

	        		if(playerInfo.affiliationId)
	        		{
	        			if(playerInfo.affiliationId != null && playerInfo.affiliationId != "other" && playerInfo.affiliationId != undefined)
	        				affilationStatus = true;
	        			else
	        				affilationStatus = false;
	        		}

	        		if(playerInfo.statusOfUser)
	        		{
	        			if(playerInfo.statusOfUser == "Active")
	        				playerStatus = true;
	        			else
	        				playerStatus = false;
	        		}
	        		
	        		if(genderCriteria != "any")
	        		{
	        			if(genderCriteria == playerInfo.gender)	        			
	        				genderStatus = true;	        		
	        			else
	        				genderStatus = false;
	        		}

	        		if(locCriteria != "any")
	        		{
	        			if (teamManagerRole == "Player") 
		        		{
		        			var toret = "userDetailsTT"

			                var usersMet = Meteor.users.findOne({
			                    userId: teamManagerId
			                })

			                if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
			                    var dbn = playerDBFind(usersMet.interestedProjectName[0])
			                    if (dbn) {
			                        toret = dbn
			                    }
			                }

			                var userDetails = global[toret].findOne({"userId": teamManagerId});
	                		if (userDetails &&userDetails.affiliatedTo) 
	                		{
			                    if(userDetails.affiliatedTo=="stateAssociation"&&userDetails.associationId&&userDetails.associationId!="other")
			                    {
			                        managerAssociationId = userDetails.associationId;
			                        if(locCriteria == "local" && playerInfo.affiliatedTo && playerInfo.associationId && playerInfo.associationId != "other")
			                        {
			                        	if(playerInfo.affiliatedTo == userDetails.affiliatedTo && playerInfo.associationId == managerAssociationId)
			                        		locStatus = true;
			                        	else
			                        		locStatus = false;
			                        }
			                        else if(locCriteria == "imported" && playerInfo.affiliatedTo && playerInfo.associationId && playerInfo.associationId != "other")
			                        {
			                        	if(playerInfo.affiliatedTo == userDetails.affiliatedTo && playerInfo.associationId != managerAssociationId)
			                        		locStatus = true;
			                        	else
			                        		locStatus = false;
			                        }               			                 
			                    }
			                    else if(userDetails.affiliatedTo=="districtAssociation"&&userDetails.associationId&&userDetails.associationId!="other")
			                    {
			                    	managerAssociationId = userDetails.associationId;
  									if(locCriteria == "local" && playerInfo.affiliatedTo && playerInfo.associationId && playerInfo.associationId != "other")
			                        {
			                        	if(playerInfo.affiliatedTo == userDetails.affiliatedTo && playerInfo.associationId == managerAssociationId)
			                        		locStatus = true;
			                        	else
			                        		locStatus = false;
			                        }
			                        else if(locCriteria == "imported" && playerInfo.affiliatedTo && playerInfo.associationId && playerInfo.associationId != "other")
			                        {
			                        	if(playerInfo.affiliatedTo == userDetails.affiliatedTo && playerInfo.associationId != managerAssociationId)
			                        		locStatus = true;
			                        	else
			                        		locStatus = false;
			                        }			                       
			                    }
			                    else if(userDetails.affiliatedTo=="academy"&&userDetails.clubNameId&&userDetails.clubNameId!="other")
			                    {
			                    	managerClubNameId = userDetails.clubNameId; 		                  
  									if(locCriteria == "local" && playerInfo.affiliatedTo && playerInfo.clubNameId && playerInfo.clubNameId != "other")
			                        {
			                        	if(playerInfo.affiliatedTo == userDetails.affiliatedTo && playerInfo.clubNameId == managerClubNameId)
			                        		locStatus = true;
			                        	else
			                        		locStatus = false;
			                        }
			                        else if(locCriteria == "imported" && playerInfo.affiliatedTo && playerInfo.clubNameId && playerInfo.clubNameId != "other")
			                        {
			                        	if(playerInfo.affiliatedTo == userDetails.affiliatedTo && playerInfo.clubNameId != managerClubNameId)
			                        		locStatus = true;
			                        	else
			                        		locStatus = false;
			                        }		
			                    }
	                		}
	           			}
	           			else if (teamManagerRole == "Association") 
            			{
			                var assocFind = associationDetails.findOne({"userId": teamManagerId});
			                if (assocFind   ) 
			                {
			                    if (locCriteria == "local") 
			                    {
				                    if(assocFind.associationType=="State/Province/County")
				                    {			                    			                    
				                    	if(playerInfo.affiliatedTo == "stateAssociation" && playerInfo.associationId && playerInfo.associationId == teamManagerId)
				                    		locStatus = true;
				                    	else if(playerInfo.affiliatedTo == "districtAssociation" && playerInfo.parentAssociationId && playerInfo.parentAssociationId == teamManagerId)
				                    		locStatus = true;
				                    }
				                    else if(lUserId.associationType=="District/City")
				                    {
				                    	if(playerInfo.associationId && playerInfo.associationId == teamManagerId)
				                    		locStatus = true;				                   
				                    }
			                	}
			                	else if(locCriteria == "imported")
			                	{
			                		if(assocFind.associationType=="State/Province/County")
				                    {				                    
				                    	if(playerInfo.affiliatedTo == "stateAssociation" && playerInfo.associationId && playerInfo.associationId != teamManagerId)
				                    		locStatus = true;
				                    	else if(playerInfo.affiliatedTo == "districtAssociation" && playerInfo.parentAssociationId && playerInfo.parentAssociationId != teamManagerId)
				                    		locStatus = true;
				                    }
				                    else if(lUserId.associationType=="District/City")
				                    {
				                    	if(playerInfo.associationId && playerInfo.parentAssociationId)
				                    	{
				                    		if(playerInfo.associationId != teamManagerId && playerInfo.parentAssociationId == assocFind.parentAssociationId)
				                    			locStatus = true;
				                    	}				                    					                    
				                    }
			                	}
			                }			               			                
            			}
            			else if(teamManagerRole == "Academy")
            			{
            				var acadDetails = academyDetails.findOne({"userId": teamManagerId});
			                if (acadDetails) 
			                {
			                    if(locCriteria == "local")
			                    {
			                    	if(playerInfo.clubNameId && playerInfo.clubNameId != "other")
			                    	{
			                    		if(playerInfo.affiliateTo == "academy" && playerInfo.clubNameId == teamManagerId)
			                    			locStatus = true;
			                    		else
			                    			locStatus = false;
			                    	}
			                    }
			                    else if(locCriteria == "imported")
			                    {
			                    	if(acadDetails.associationId)
			                    	{
			                    		if(playerInfo.clubNameId && playerInfo.associationId)
			                    		{
			                    			if(playerInfo.affiliateTo == "academy" && playerInfo.clubNameId != teamManagerId && playerInfo.associationId == acadDetails.associationId)
			                    				locStatus = true;
			                    			else
			                    				locStatus = false;
			                    		}

			                    	}
			                    }
			                }                     
            			}
	        		}

	        		if(dobCriteria != "any")
	        		{
	        			if(playerInfo.dateOfBirth)
	        			{
	        				var playerDOB = moment(moment(new Date(playerInfo.dateOfBirth)).format("YYYY-MM-DD"));
	        				var dobValue_mom = moment(moment(new Date(dobValue)).format("YYYY-MM-DD"));

	        				if(dobCriteria == "onBefore")
	        				{
	        					if(playerDOB <= dobValue_mom)
	        						dobStatus = true;
	        					else
	        						dobStatus = false;
	        				}
	        				else if(dobCriteria == "before")
	        				{
	        					if(playerDOB < dobValue_mom)
	        						dobStatus = true;
	        					else
	        						dobStatus = false;
	        				}
	        				else if(dobCriteria=="onAfter")
	        				{
	        					if(playerDOB >= dobValue_mom)
	        						dobStatus = true;
	        					else
	        						dobStatus = false;
	        				}
	        				else if(dobCriteria=="after")
	        				{
	        					if(playerDOB > dobValue_mom)
	        						dobStatus = true;
	        					else
	        						dobStatus = false;
	        				}
	        			}
	        		}
		        		

	        	}
	        	teamPlayerArray[i].indexNumber = k;

	        }
		}

	},
	teamMemberValidation:function(playerNumber,playerId,teamFormatId,managerId)
	{
		var affilationStatus = false;
		var playerStatus = false;
		var genderStatus = false;
		var dobStatus = false;
		var locStatus = false;
		var mandatoryStatus = false;
		var teamManagerRole = "";
		var teamRanked="";

		var validTeamInfo = teamsFormat.findOne({"_id":teamFormatId});
		if(validTeamInfo)
		{
			if(validTeamInfo.rankedOrNot)
				teamRanked = validTeamInfo.rankedOrNot;
		}

		var teamFormatInfo = teamsFormat.findOne({"playerFormatArray.playerNo": playerNumber,
	        "_id":teamFormatId},{fields:{_id: 0, playerFormatArray: {$elemMatch: 
	        {playerNo: playerNumber}}}});

		var teamManagerId  = managerId;
		var teamManagerInfo = Meteor.users.findOne({"userId":teamManagerId});
		if(teamManagerInfo)
		{
			teamManagerRole = teamManagerInfo.role;
		}

		if(teamFormatInfo)
		{
			var genderCriteria = teamFormatInfo.playerFormatArray[0].gender;
	        var dobCriteria = teamFormatInfo.playerFormatArray[0].dateType;
	        var dobValue = "";
	        if(teamFormatInfo.playerFormatArray[0].dateValue)
	        	dobValue = teamFormatInfo.playerFormatArray[0].dateValue;
	        var locCriteria = teamFormatInfo.playerFormatArray[0].locationType;
	        var mandatory = teamFormatInfo.playerFormatArray[0].mandatory;
	        if(mandatory == "no" && playerId == "")
	        	mandatoryStatus = true;

	        var toret = "userDetailsTT"

			var usersMet = Meteor.users.findOne({
			    userId: playerId
			})

			if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
			    var dbn = playerDBFind(usersMet.interestedProjectName[0])
			    if (dbn) {
			        toret = dbn
			    }
			}

	        var playerInfo = global[toret].findOne({"userId":playerId});

	        if(playerInfo)
	        {
	        	if(mandatory == "yes")
	        		mandatoryStatus = true;
	        	if(mandatory == "no")
	        		mandatoryStatus = true;
        		if(teamRanked == "yes")
        		{
        			if(playerInfo.affiliationId)
	        		{
	        			if(playerInfo.affiliationId != null && playerInfo.affiliationId != "other" && playerInfo.affiliationId != undefined)
	        				affilationStatus = true;	        			
	        		}
        		}
        		else if(teamRanked == "no")
        			affilationStatus = true;
	        	

	        	if(playerInfo.statusOfUser)
	        	{
	        		if(playerInfo.statusOfUser == "Active")
	        			playerStatus = true;	        	
	        	}

	        	if(genderCriteria != "any")
	        	{
	        		if(genderCriteria.toLowerCase() == playerInfo.gender.toLowerCase())	        			
	        			genderStatus = true;	        			        		
	        	}
	        	else
	        		genderStatus = true;


	        	if(dobCriteria != "any")
	        	{
	        		if(playerInfo.dateOfBirth)
	        		{
	        			var playerDOB = moment(moment(new Date(playerInfo.dateOfBirth)).format("YYYY-MM-DD"));
	        			var dobValue_mom = moment(moment(new Date(dobValue)).format("YYYY-MM-DD"));

	        			if(dobCriteria == "onBefore")
	        			{
	        				if(playerDOB <= dobValue_mom)
	        					dobStatus = true;	        					
	        			}
	        			else if(dobCriteria == "before")
	        			{
	        				if(playerDOB < dobValue_mom)
	        					dobStatus = true;
	        					
	        			}
	        			else if(dobCriteria=="onAfter")
	        			{
	        				if(playerDOB >= dobValue_mom)
	        					dobStatus = true;	        					
	        			}
	        			else if(dobCriteria=="after")
	        			{
	        				if(playerDOB > dobValue_mom)
	        					dobStatus = true;
	        					
	        			}
	        		}
	        	}
	        	else 
	        		dobStatus = true;


	        	if(locCriteria != "any")
	        	{
	        		if (teamManagerRole == "Player") 
		        	{
		        		var toret = "userDetailsTT"

						var usersMet = Meteor.users.findOne({
						    userId: teamManagerId
						})

						if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
						    var dbn = playerDBFind(usersMet.interestedProjectName[0])
						    if (dbn) {
						        toret = dbn
						    }
						}

			            var userDetails = global[toret].findOne({"userId": teamManagerId});
	                	if (userDetails &&userDetails.affiliatedTo) 
	                	{
			                if(userDetails.affiliatedTo=="stateAssociation"&&userDetails.associationId&&userDetails.associationId!="other")
			                {
			                    managerAssociationId = userDetails.associationId;
			                    if(locCriteria == "local" && playerInfo.affiliatedTo && playerInfo.associationId && playerInfo.associationId != "other")
			                    {
			                       	if(playerInfo.affiliatedTo == userDetails.affiliatedTo && playerInfo.associationId == managerAssociationId)
			                        	locStatus = true;			                       
			                    }
			                    else if(locCriteria == "imported" && playerInfo.affiliatedTo && playerInfo.associationId && playerInfo.associationId != "other")
			                    {
			                        if(playerInfo.affiliatedTo == userDetails.affiliatedTo && playerInfo.associationId != managerAssociationId)
			                        	locStatus = true;			                        
			                    }               			                 
			                }
			                else if(userDetails.affiliatedTo=="districtAssociation"&&userDetails.associationId&&userDetails.associationId!="other")
			                {
			                   	managerAssociationId = userDetails.associationId;
  								if(locCriteria == "local" && playerInfo.affiliatedTo && playerInfo.associationId && playerInfo.associationId != "other")
			                    {
			                        if(playerInfo.affiliatedTo == userDetails.affiliatedTo && playerInfo.associationId == managerAssociationId)
			                        	locStatus = true;
			                        
			                    }
			                    else if(locCriteria == "imported" && playerInfo.affiliatedTo && playerInfo.associationId && playerInfo.associationId != "other")
			                    {
			                       	if(playerInfo.affiliatedTo == userDetails.affiliatedTo && playerInfo.associationId != managerAssociationId)
			                        	locStatus = true;			                        	
			                     }			                       
			                }
			                else if(userDetails.affiliatedTo=="academy"&&userDetails.clubNameId&&userDetails.clubNameId!="other")
			                {
			                    managerClubNameId = userDetails.clubNameId; 		                  
  								if(locCriteria == "local" && playerInfo.affiliatedTo && playerInfo.clubNameId && playerInfo.clubNameId != "other")
			                    {
			                        if(playerInfo.affiliatedTo == userDetails.affiliatedTo && playerInfo.clubNameId == managerClubNameId)
			                        	locStatus = true;
			                        	
			                    }
			                    else if(locCriteria == "imported" && playerInfo.affiliatedTo && playerInfo.clubNameId && playerInfo.clubNameId != "other")
			                    {
			                        if(playerInfo.affiliatedTo == userDetails.affiliatedTo && playerInfo.clubNameId != managerClubNameId)
			                        	locStatus = true;			                        	
			                    }		
			                }
			                else if(userDetails.affiliatedTo == "other")
			                {
			                	if(playerInfo.affiliatedTo == userDetails.affiliatedTo)
			                        locStatus = true;
			                }

	                	}
	           		}
	           		else if (teamManagerRole == "Association") 
            		{
			            var assocFind = associationDetails.findOne({"userId": teamManagerId});
			            if (assocFind) 
			            {
			                if (locCriteria == "local") 
			                {
				                if(assocFind.associationType=="State/Province/County")
				                {			                    			                    
				                   	if(playerInfo.affiliatedTo == "stateAssociation" && playerInfo.associationId && playerInfo.associationId == teamManagerId)
				                    	locStatus = true;
				                    else if(playerInfo.affiliatedTo == "districtAssociation" && playerInfo.parentAssociationId && playerInfo.parentAssociationId == teamManagerId)
				                    		locStatus = true;
				                }
				                else if(lUserId.associationType=="District/City")
				                {
				                    if(playerInfo.associationId && playerInfo.associationId == teamManagerId)
				                    	locStatus = true;				                   
				                }
			                }
			                else if(locCriteria == "imported")
			                {
			                	if(assocFind.associationType=="State/Province/County")
				                {				                    
				                   	if(playerInfo.affiliatedTo == "stateAssociation" && playerInfo.associationId && playerInfo.associationId != teamManagerId)
				                    	locStatus = true;
				                    else if(playerInfo.affiliatedTo == "districtAssociation" && playerInfo.parentAssociationId && playerInfo.parentAssociationId != teamManagerId)
				                    	locStatus = true;
				                }
				                else if(lUserId.associationType=="District/City")
				                {
				                    if(playerInfo.associationId && playerInfo.parentAssociationId)
				                    {
				                    	if(playerInfo.associationId != teamManagerId && playerInfo.parentAssociationId == assocFind.parentAssociationId)
				                    		locStatus = true;
				                    }				                    					                    
				                }
			                }
			                
			            }			               			                
            		}
            		else if(teamManagerRole == "Academy")
            		{
            			var acadDetails = academyDetails.findOne({"userId": teamManagerId});
			            if (acadDetails) 
			            {
			                if(locCriteria == "local")
			                {
			                   	if(playerInfo.clubNameId && playerInfo.clubNameId != "other")
			                    {
			                    	if(playerInfo.affiliateTo == "academy" && playerInfo.clubNameId == teamManagerId)
			                    		locStatus = true;
			                    		
			                    }
			                }
			                else if(locCriteria == "imported")
			                {
			                    if(acadDetails.associationId)
			                    {
			                    	if(playerInfo.clubNameId && playerInfo.associationId)
			                    	{
			                    		if(playerInfo.affiliateTo == "academy" && playerInfo.clubNameId != teamManagerId && playerInfo.associationId == acadDetails.associationId)
			                    			locStatus = true;
			                    			
			                    	}

			                    }
			                }
			               
			            }                     
            		}
	        	}
	        	else
	        		locStatus = true;        	
	        }
		}
		
		if(mandatoryStatus && affilationStatus && playerStatus && genderStatus && dobStatus && locStatus)
			return "valid";
		else
			return "invalid";
	
	},
	getTeamInfo:function(idArray)
	{
		var teamMember = [];
		for(var i=0; i<idArray.length; i++)
		{
			var teamInfo = playerTeams.findOne({"_id":idArray[i]});
			if(teamInfo)
			{
				var teamPlayerArray = teamInfo.teamMembers;
				var manager = "";
				var teamEvent = "";
				var managerInfo = Meteor.users.findOne({"userId":teamInfo.teamManager});
				if(managerInfo)
					manager = managerInfo.userName;
				var teamFormatInfo = teamsFormat.findOne(
	        		{"_id":teamInfo.teamFormatId});
				if(teamFormatInfo)
					teamEvent = teamFormatInfo.teamFormatName;

				var teamMemberList = [];

				for(var k = 0; k< teamPlayerArray.length; k++)
	        	{
	        		var teamPlayerId = teamInfo.teamMembers[k].playerId;
	        		var toret = "userDetailsTT"

	                var usersMet = Meteor.users.findOne({
	                    userId: teamPlayerId
	                })

	                if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
	                    var dbn = playerDBFind(usersMet.interestedProjectName[0])
	                    if (dbn) {
	                        toret = dbn
	                    }
	                }

	        		var playerInfo = global[toret].findOne({"userId":teamPlayerId});
	        		if(playerInfo)
	        		{
	        			teamMemberList.push(playerInfo.userName);
	        		}
	        			
	        		        		
	        	}
	        	var newJson = {};
	        	newJson["teamEvent"] = teamEvent;
	        	newJson["teamName"] = teamInfo.teamName;
           	 	newJson["teamManager"] = manager;
            	newJson["teamMemberList"] = teamMemberList;
            	teamMember.push(newJson);
			}
		}
		return teamMember;
	},
	"MandatoryValidationMethod":function(teamId,teamFormatId){
		var setArray = playerTeams.findOne({"_id":teamId});
		var arrayMAndPlayers = [];
		if(setArray&&setArray.teamMembers&&setArray.teamFormatId){
			var find = teamsFormat.findOne({"_id":setArray.teamFormatId});
     		var teamMembers = setArray.teamMembers;
            for(var j=0;j<setArray.teamMembers.length;j++){
                var indexOfP;
                if(find&&find.mandatoryPlayersArray){
                   indexOfP = find.mandatoryPlayersArray.indexOf(teamMembers[j].playerNumber)
                }
                if(indexOfP!==-1){
                    arrayMAndPlayers.push(teamMembers[j].playerNumber);
                }
                
            }
     		if(find&&find.mandatoryPlayersArray){
     			var mandPlayers = find.mandatoryPlayersArray.sort();
	            var addedPlayers = arrayMAndPlayers.sort();
	            if(mandPlayers.length !== addedPlayers.length){
	                return true;
	            }
	            if(mandPlayers.length!=0){
	                for(var i = mandPlayers.length; i--;) {
	                    if(mandPlayers[i] !== addedPlayers[i]){
	                        return true;
	                    }
	                    else{
	                        if(i==0){
	                            if(mandPlayers[i] !== addedPlayers[i]){
	                                return true;
	                            } 
	                            else{
	                                return false
	                            }
	                        }
	                    }
	                }
	            }
	            else{
	                return false
	            }
     		}

        }
	},

	


});