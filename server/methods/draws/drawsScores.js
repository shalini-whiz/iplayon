import { MatchCollectionDB} from '../../publications/MatchCollectionDb.js';
import { teamMatchCollectionDB} from '../../publications/MatchCollectionDbTeam.js';
import {nameToCollection} from '../dbRequiredRole.js'

Meteor.methods({

	"setKnockOutScore":function(data)
	{
		try{

			var result = MatchCollectionDB.update({
				"tournamentId":data.tournamentId,
				"eventName":data.eventName,
				"matchRecords": {
                    $elemMatch: {
                        "roundNumber": data.roundNumber,
                        "matchNumber": data.matchNumber
                    }
                }},
				{$set:{
					"matchRecords.$.status":data.status,
					"matchRecords.$.winnerID":data.winnerID,
					"matchRecords.$.getStatusColorA":data.getStatusColorA,
					"matchRecords.$.getStatusColorB":data.getStatusColorB,
					"matchRecords.$.winner":data.winner,
					"matchRecords.$.scores":data.scores,
					"matchRecords.$.completedscores":data.completedscores
				}}
			)
			if(result)
			{
				if (data.nextSlot == "A") 
				{
					var result1 = MatchCollectionDB.update({
						"tournamentId":data.tournamentId,
						"eventName":data.eventName,
						"matchRecords": {
                    		$elemMatch: {
                        		"matchNumber": data.nextMatchNumber
                    		}
                		}},
						{$set:{
							"matchRecords.$.players.playerA":data.winner,
							"matchRecords.$.playersID.playerAId":data.winnerID,
							
						}}
					);
                	//matchRecords[i].players.playerA = matchRecord.winner;
              	 	// matchRecords[i].playersID.playerAId = matchRecord.winnerID;
            	} else {
            		var result1 = MatchCollectionDB.update({
						"tournamentId":data.tournamentId,
						"eventName":data.eventName,
						"matchRecords": {
                    		$elemMatch: {
                        		"matchNumber": data.nextMatchNumber
                    		}
                		}},
						{$set:{
							"matchRecords.$.players.playerB":data.winner,
							"matchRecords.$.playersID.playerBId":data.winnerID,
							
						}}
					);

                	//matchRecords[i].players.playerB = matchRecord.winner;
                	//matchRecords[i].playersID.playerBId = matchRecord.winnerID;
            	}
				return true;
			}
			

		}catch(e)
		{

		}
	}

})