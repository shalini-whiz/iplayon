import { MatchCollectionDB } from '../../publications/MatchCollectionDb.js';
import { teamMatchCollectionDB } from '../../publications/MatchCollectionDbTeam.js';

export const fetchLiveIndividual = function(data)
{
    try{

    	var tournamentId = data.tournamentId.trim();
    	var eventName = data.eventName.trim();

    	var matchData = MatchCollectionDB.aggregate([
			{$match:{"tournamentId":tournamentId,"eventName":eventName}},
			{$unwind:'$matchRecords'}, 
			{$match:{
				"matchRecords.status":"yetToPlay",
				"$and":[
					{"matchRecords.playersID.playerAId":{$nin:["",null]}},
					{"matchRecords.playersID.playerBId":{$nin:["",null]}}
				]									
			}},
			{$group:{
				_id:'null',
				"matchList":{"$push":"$matchRecords.matchNumber"}
			}},
			{$sort:{"matchList":1}}
		]);


		if(matchData && matchData.length > 0 && matchData[0] && matchData[0].matchList)
		{
			var matchList = matchData[0].matchList;
	      	if(matchList.length > 0)
	      	{
	      		if(data.matchNumber)
					matchNumber = parseInt(data.matchNumber);
				else
					matchNumber = parseInt(matchList[0]);

				var matchRecordInfo = MatchCollectionDB.aggregate([
					{$match:{"tournamentId":tournamentId,"eventName":eventName}},
					{$unwind:"$matchRecords"},
					{$match:{"matchRecords.matchNumber":matchNumber}},
					{$group:{
						_id:"$matchRecords.matchNumber",
						"matchRecords":{$first:"$matchRecords"}
					}},
					{$project:{
						"matchNumber":"$matchRecords.matchNumber",
						"roundNumber":"$matchRecords.roundNumber",
						"roundName":"$matchRecords.roundName",
						"playerAID":"$matchRecords.playersID.playerAId",
						"playerBID":"$matchRecords.playersID.playerBId",
						"status":"$matchRecords.status",
						"playerAWin":"$matchRecords.setWins.playerA",
						"playerBWin":"$matchRecords.setWins.playerB",
						"scoresA":"$matchRecords.scores.setScoresA",
						"scoresB":"$matchRecords.scores.setScoresB"
					}},
					{$lookup: {
               			from: "users",
               			localField: "playerAID",
                		foreignField: "userId",
                		as: "playerADetails" 
            		}}, 
            		{$unwind: {
                		path: "$playerADetails",
                		preserveNullAndEmptyArrays: true
            		}},
            		{$lookup: {
               			from: "users",
               			localField: "playerBID",
                		foreignField: "userId",
                		as: "playerBDetails" 
            		}}, 
            		{$unwind: {
                		path: "$playerBDetails",
                		preserveNullAndEmptyArrays: true
            		}},
            		{$project:{
            			"matchNumber":1,"roundNumber":1,"roundName":1,
						"playerAID":1,"playerBID":1,
						"playerAName":"$playerADetails.userName",
						"playerBName":"$playerBDetails.userName",
						"status":1,
						"playerAWin":1,"playerBWin":1,
						"scoresA":1,"scoresB":1,
						"_id":0
            		}}
				])

				if(matchRecordInfo && matchRecordInfo[0])
				{
					var resultData = {};
					resultData["matchRecordInfo"] = matchRecordInfo[0];
					resultData["matchList"] = matchList;
					return resultData;
				}
			}
			else return false;
		}
		else return false;
    }
    catch(e)
    {
    	errorLog(e)
    	return false;
    }   
}


export const fetchLiveRRTeam = function(data)
{
    try{


    	var tournamentId = data.tournamentId.trim();
    	var eventName = data.eventName.trim();

    	var subRest = subscriptionRestrictions.findOne({
            tournamentId: tournamentId
        })

        var lookUPTable = ""
        if (subRest && subRest.selectionType &&
            subRest.selectionType.toLowerCase() == "schoolonly") {
            lookUPTable = "schoolTeams"
        } else {
            lookUPTable = "playerTeams"
        }

        
        var matchData = roundRobinTemp.aggregate([
        	{$match:{
        		"tournamentId":tournamentId,"eventName":eventName
        	}},
        	{$group:{
        		"_id":"$_id",
        		"playerAID":{$first:"$teamAID"},
        		"playerBID":{$first:"$teamBID"},
        	}},
        	{$lookup: {
               			from: lookUPTable,
               			localField: "playerAID",
                		foreignField: "_id",
                		as: "playerADetails" 
            		}}, 
            		{$unwind: {
                		path: "$playerADetails",
                		preserveNullAndEmptyArrays: true
            		}},
            		{$lookup: {
               			from: lookUPTable,
               			localField: "playerBID",
                		foreignField: "_id",
                		as: "playerBDetails" 
            		}}, 
            		{$unwind: {
                		path: "$playerBDetails",
                		preserveNullAndEmptyArrays: true
            		}},
            		{$group:{
            			"_id":null,
        				"matchList":{$push:{"_id":"$_id","team": {$concat:["$playerADetails.teamName"," Vs ","$playerBDetails.teamName"]},        				
        			//	"teamCon":{$push:{$concat:[{ "$toLower""$playerADetails.teamName"}," Vs ",{ "$toLower""$playerBDetails.teamName"}]}}

        			}}
            		}},
            		/*{$sort:{
            			"teamCon.team":1
            		}},
            		{$project:{
            			"matchList":1,		
            			//"teamCon":"insensitive": { "$toLower": "$teamCon" },
						"_id":0
            		}},
            		/*{$sort:{
            			"teamCon.team":1
            		}}*/


        	]
		)


		if(matchData && matchData.length > 0 && matchData[0] && matchData[0].matchList)
		{
			var teamSelectionID = "";
			if(data.teamSelectionID)
				teamSelectionID = data.teamSelectionID;
			else
				teamSelectionID = matchData[0].matchList[0]._id;


			var recExists = roundRobinTemp.findOne({"_id":teamSelectionID});
			if(recExists)
			{
				teamAId = recExists.teamAID;
				teamBId = recExists.teamBID;
			}
			//var teamAId = matchData[0].teamAId;
			//var teamBId = matchData[0].teamBId;
			var matchList = matchData[0].matchList;

	      	if(teamAId.length > 0 && teamBId.length > 0)
	      	{
	      		if(data.teamAId && data.teamBId)
	      		{
	      			teamAId = data.teamAId;
	      			teamBId = data.teamBId;
					
	      		}
				
				var matchRecordInfo = roundRobinTeamEvents.aggregate([
					{$match:{"tournamentId":tournamentId,"eventName":eventName}},
					{$unwind:"$groupDetails"},
					{$match:{
						"groupDetails.teamsID.teamAId":teamAId,
						"groupDetails.teamsID.teamBId":teamBId,

					}},
					{$group:{
						_id:{"rowNo":"$groupDetails.rowNo",
							"colNo":"$groupDetails.colNo"},						
						"matchRecords":{$first:"$groupDetails"},
						"groupName":{$first:"$groupName"},
						"groupNumber":{$first:"$groupNumber"}
					}},
					{$project:{
						"matchNumber":"$groupNumber",
						"roundNumber":"$matchRecords.colNo",
						"roundName":"$groupName",
						"playerAID":"$matchRecords.teamsID.teamAId",
						"playerBID":"$matchRecords.teamsID.teamBId",
						"status":"$matchRecords.status",
						"playerAWin":"$matchRecords.setWins.teamA",
						"playerBWin":"$matchRecords.setWins.teamB",
						"scoresA":"$matchRecords.scores.setScoresA",
						"scoresB":"$matchRecords.scores.setScoresB"
					}},
					{$lookup: {
               			from: lookUPTable,
               			localField: "playerAID",
                		foreignField: "_id",
                		as: "playerADetails" 
            		}}, 
            		{$unwind: {
                		path: "$playerADetails",
                		preserveNullAndEmptyArrays: true
            		}},
            		{$lookup: {
               			from: lookUPTable,
               			localField: "playerBID",
                		foreignField: "_id",
                		as: "playerBDetails" 
            		}}, 
            		{$unwind: {
                		path: "$playerBDetails",
                		preserveNullAndEmptyArrays: true
            		}},
            		{$project:{
            			"matchNumber":1,"roundNumber":1,"roundName":1,
						"playerAID":1,"playerBID":1,
						"playerAName":"$playerADetails.teamName",
						"playerBName":"$playerBDetails.teamName",
						"status":1,
						"playerAWin":1,"playerBWin":1,
						"scoresA":1,"scoresB":1,
						"_id":0
            		}}
				])


				if(matchRecordInfo && matchRecordInfo[0])
				{
					var resultData = {};
					resultData["matchRecordInfo"] = matchRecordInfo[0];
					resultData["matchList"] = matchList;
					resultData["selectedTeamID"] = teamSelectionID;


					return resultData;
				}
			}
			else return false;
		}
		else return false;
    }
    catch(e)
    {
    	errorLog("where "+e)
    	return false;
    }   
}


export const fetchLiveTeam = function(data)
{
    try{


    	var tournamentId = data.tournamentId.trim();
    	var eventName = data.eventName.trim();

    	var subRest = subscriptionRestrictions.findOne({
            tournamentId: tournamentId
        })

        var lookUPTable = ""
        if (subRest && subRest.selectionType &&
            subRest.selectionType.toLowerCase() == "schoolonly") {
            lookUPTable = "schoolTeams"
        } else {
            lookUPTable = "playerTeams"
        }


    	var matchData = teamMatchCollectionDB.aggregate([
			{$match:{"tournamentId":tournamentId,"eventName":eventName}},
			{$unwind:'$matchRecords'}, 
			{$match:{
				"matchRecords.status":"yetToPlay",
				"$and":[
					{"matchRecords.teamsID.teamAId":{$nin:["",null]}},
					{"matchRecords.teamsID.teamBId":{$nin:["",null]}}
				]									
			}},
			{$group:{
				_id:'null',
				"matchList":{"$push":"$matchRecords.matchNumber"}
			}},
			{$sort:{"matchList":1}}
		]);


		if(matchData && matchData.length > 0 && matchData[0] && matchData[0].matchList)
		{
			var matchList = matchData[0].matchList;
	      	if(matchList.length > 0)
	      	{
	      		if(data.matchNumber)
					matchNumber = parseInt(data.matchNumber);
				else
					matchNumber = parseInt(matchList[0]);

				var matchRecordInfo = teamMatchCollectionDB.aggregate([
					{$match:{"tournamentId":tournamentId,"eventName":eventName}},
					{$unwind:"$matchRecords"},
					{$match:{"matchRecords.matchNumber":matchNumber}},
					{$group:{
						_id:"$matchRecords.matchNumber",
						"matchRecords":{$first:"$matchRecords"}
					}},
					{$project:{
						"matchNumber":"$matchRecords.matchNumber",
						"roundNumber":"$matchRecords.roundNumber",
						"roundName":"$matchRecords.roundName",
						"playerAID":"$matchRecords.teamsID.teamAId",
						"playerBID":"$matchRecords.teamsID.teamBId",
						"status":"$matchRecords.status",
						"playerAWin":"$matchRecords.setWins.teamA",
						"playerBWin":"$matchRecords.setWins.teamB",
						"scoresA":"$matchRecords.scores.setScoresA",
						"scoresB":"$matchRecords.scores.setScoresB"
					}},
					{$lookup: {
               			from: lookUPTable,
               			localField: "playerAID",
                		foreignField: "_id",
                		as: "playerADetails" 
            		}}, 
            		{$unwind: {
                		path: "$playerADetails",
                		preserveNullAndEmptyArrays: true
            		}},
            		{$lookup: {
               			from: lookUPTable,
               			localField: "playerBID",
                		foreignField: "_id",
                		as: "playerBDetails" 
            		}}, 
            		{$unwind: {
                		path: "$playerBDetails",
                		preserveNullAndEmptyArrays: true
            		}},
            		{$project:{
            			"matchNumber":1,"roundNumber":1,"roundName":1,
						"playerAID":1,"playerBID":1,
						"playerAName":"$playerADetails.teamName",
						"playerBName":"$playerBDetails.teamName",
						"status":1,
						"playerAWin":1,"playerBWin":1,
						"scoresA":1,"scoresB":1,
						"_id":0
            		}}
				])

				if(matchRecordInfo && matchRecordInfo[0])
				{
					var resultData = {};
					resultData["matchRecordInfo"] = matchRecordInfo[0];
					resultData["matchList"] = matchList;
					return resultData;
				}
			}
			else return false;
		}
		else return false;
    }
    catch(e)
    {
    	errorLog(e)
    	return false;
    }   
}



export const fetchTeamDetailScore = function(data)
{
    try{


    	var tournamentId = data.tournamentId.trim();
    	var eventName = data.eventName.trim();

    	var subRest = subscriptionRestrictions.findOne({
            tournamentId: tournamentId
        })

        var lookUPTable = ""
        if (subRest && subRest.selectionType &&
            subRest.selectionType.toLowerCase() == "schoolonly") {
            lookUPTable = "schoolTeams"
        } else {
            lookUPTable = "playerTeams"
        }


    	var matchData = teamMatchCollectionDB.aggregate([
			{$match:{"tournamentId":tournamentId,"eventName":eventName}},
			{$unwind:'$matchRecords'}, 
			{$match:{
				"matchRecords.status":"yetToPlay",
				"$and":[
					{"matchRecords.teamsID.teamAId":{$nin:["",null]}},
					{"matchRecords.teamsID.teamBId":{$nin:["",null]}}
				]									
			}},
			{$group:{
				_id:'null',
				"matchList":{"$push":"$matchRecords.matchNumber"}
			}},
			{$sort:{"matchList":1}}
		]);


		if(matchData && matchData.length > 0 && matchData[0] && matchData[0].matchList)
		{
			var matchList = matchData[0].matchList;
	      	if(matchList.length > 0)
	      	{
	      		if(data.matchNumber)
					matchNumber = parseInt(data.matchNumber);
				else
					matchNumber = parseInt(matchList[0]);

				var matchRecordInfo = teamMatchCollectionDB.aggregate([
					{$match:{"tournamentId":tournamentId,"eventName":eventName}},
					{$unwind:"$matchRecords"},
					{$match:{"matchRecords.matchNumber":matchNumber}},
					{$group:{
						_id:"$matchRecords.matchNumber",
						"matchRecords":{$first:"$matchRecords"}
					}},
					{$project:{
						"matchNumber":"$matchRecords.matchNumber",
						"roundNumber":"$matchRecords.roundNumber",
						"roundName":"$matchRecords.roundName",
						"playerAID":"$matchRecords.teamsID.teamAId",
						"playerBID":"$matchRecords.teamsID.teamBId",
						"status":"$matchRecords.status",
						"playerAWin":"$matchRecords.setWins.teamA",
						"playerBWin":"$matchRecords.setWins.teamB",
						"scoresA":"$matchRecords.scores.setScoresA",
						"scoresB":"$matchRecords.scores.setScoresB"
					}},
					{$lookup: {
               			from: lookUPTable,
               			localField: "playerAID",
                		foreignField: "_id",
                		as: "playerADetails" 
            		}}, 
            		{$unwind: {
                		path: "$playerADetails",
                		preserveNullAndEmptyArrays: true
            		}},
            		{$lookup: {
               			from: lookUPTable,
               			localField: "playerBID",
                		foreignField: "_id",
                		as: "playerBDetails" 
            		}}, 
            		{$unwind: {
                		path: "$playerBDetails",
                		preserveNullAndEmptyArrays: true
            		}},
            		{$project:{
            			"matchNumber":1,"roundNumber":1,"roundName":1,
						"playerAID":1,"playerBID":1,
						"playerAName":"$playerADetails.teamName",
						"playerBName":"$playerBDetails.teamName",
						"status":1,
						"playerAWin":1,"playerBWin":1,
						"scoresA":1,"scoresB":1,
						"_id":0
            		}}
				])

				if(matchRecordInfo && matchRecordInfo[0])
				{
					var resultData = {};
					resultData["matchRecordInfo"] = matchRecordInfo[0];
					resultData["matchList"] = matchList;

					var formatExists = teamDetailedScoresOthrFormat.findOne({
						"tournamentId":tournamentId,
						"eventName":eventName,
						"teamDetScore.matchNumber":matchNumber
					})

					if(formatExists)
					{

						var formatInfo = teamDetailedScoresOthrFormat.aggregate([
							{$match:{"tournamentId":tournamentId,"eventName":eventName}},
							{$unwind:"$teamDetScore"},
							{$match:{"teamDetScore.matchNumber":matchNumber}},
							{$group:{"_id":null,
								"teamDetScore":{$first:"$teamDetScore"}
							}},
							{$project:{
								"teamDetScore":1
							}}
					         
						])


						
					}
					else
					{
						var teamDetScore = {};
						teamDetScore["thirdFourthRound"] = false;
						teamDetScore["matchNumber"] = matchNumber;
						teamDetScore["roundNumber"] = resultData.matchRecordInfo.roundNumber
						teamDetScore["teamAID"] = resultData.matchRecordInfo.playerAID;
						teamDetScore["teamBID"] = resultData.matchRecordInfo.playerBID;
						teamDetScore["finalTeamWinner"] = "1";
						teamDetScore["teamMatchType"] = "notPlayed";
						teamDetScore["specifications"] = [];


						if(resultData.matchRecordInfo && resultData.matchRecordInfo.roundName == "BM")
						{
							teamDetScore["thirdFourthRound"] = true;
						}
						
						var configInfo = MatchTeamCollectionConfig.findOne({"tournamentId":tournamentId,"eventName":eventName});
						if(configInfo && configInfo.teamFormatId)
						{
							var formatInfo = orgTeamMatchFormat.findOne({"_id":configInfo.teamFormatId})
							if(formatInfo && formatInfo.specifications)
							{
								var specData = formatInfo.specifications;
								for(var i=0;i<specData.length;i++)
								{
									var mData = {
										"no":parseInt(i+1),
										"matchProjectType":specData[i].type,
										"label":specData[i].label,
										"displayLabel":specData[i].displayLabel,
										"order":specData[i].order
									}
									var no = mData.no
									mData["matchType"] = "notPlayed";
									mData["playerAId"] = "1"
									mData["playerBId"] = "1"

									mData["winnerIdPlayer"] = "1"
									mData["winnerIdTeam"] = "1"

									mData["playerA1Id"] = "1"
									mData["playerA2Id"] = "1"
									mData["playerB1Id"] = "1"
									mData["playerB2Id"] = "1"
									mData["winnerD1PlayerId"] = "1"
									mData["winnerD2PlayerId"] = "1"
									mData["setScoresA"] = ["0","0","0","0","0","0","0"]
									mData["setScoresB"] = ["0","0","0","0","0","0","0"]
									teamDetScore.specifications.push(mData)
								}
							}
						}
						resultData["teamDetScore"] = teamDetScore
					}

					return resultData;
				}
			}
			else return false;
		}
		else return false;
    }
    catch(e)
    {
    	errorLog(e)
    	return false;
    }   
}

