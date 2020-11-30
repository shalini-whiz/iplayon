import { MatchCollectionDB } from '../../publications/MatchCollectionDb.js';
import { teamMatchCollectionDB } from '../../publications/MatchCollectionDbTeam.js';

Meteor.methods({

	"getAllTourParticipations":function(data)
	{
		try{
			if(data)
			{
				var errorMsg = [];
				var userMsg = "Invalid user";

				var userInfo = undefined;

			
				var objCheck = false;
				
				objCheck = Match.test(data, { 
						userId: String});

				if(objCheck)
				{
					var playerID = data.userId;

					var ind_entry = MatchCollectionDB.aggregate([
	                	{$match:{
	                			$or:[
	                		{"matchRecords.playersID.playerAId":playerID},
	                		{"matchRecords.playersID.playerBId":playerID}]

	                	}},
	                	{$unwind:"$matchRecords"},
	                	{$match:{
	                		$or:[
	                		{"matchRecords.playersID.playerAId":playerID},
	                		{"matchRecords.playersID.playerBId":playerID}]
	                	}},
	                	{$group:{
	                		"_id":"null",
	                		"tournament":{$addToSet:"$tournamentId"},
	                	}},
	                	{$project:{
	                		"_id":1,
	                		"tournament":1,
	                	}}
                	])

				}
				else
				{
					var resultJson={};
					resultJson["status"] = "failure";
					resultJson["message"] = "Require all parameters";
					return resultJson;
				}
			}
			else
			{
				var resultJson={};
				resultJson["status"] = "failure";
				resultJson["message"] = "Require all parameters";
				return resultJson;
			}
		}catch(e){
			var resultJson={};
			resultJson["status"] = "failure";
			resultJson["message"] = "Could not fetch tournament player entries "+e;
			return resultJson;
		}
	}
})