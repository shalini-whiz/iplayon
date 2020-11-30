import { MatchCollectionDB} from '../../publications/MatchCollectionDb.js';
import { teamMatchCollectionDB} from '../../publications/MatchCollectionDbTeam.js';
Meteor.methods({

	
	'generate_leaveRequest': function(tournamentId, playerID, player, eventType) {

        if (Meteor.isServer) {
          
            var tournamentName = "";
            var tournamentVenue = "";
            var tournamentAddress = "";
            var tournamentStartDate = "";
            var tournamentEndDate = "";
            var sport = "";

            var tournamentInfo = tourExists(tournamentId)

            if(tournamentInfo)
            {
            	if(tournamentInfo.eventName)
            		tournamentName = tournamentInfo.eventName;
            	if(tournamentInfo.venueAddress)
            		tournamentVenue = tournamentInfo.venueAddress;
            	if(tournamentInfo.domainName)
            		tournamentAddress = tournamentInfo.domainName;
            	if(tournamentInfo.eventStartDate)
            		tournamentStartDate = tournamentInfo.eventStartDate;
            	if(tournamentInfo.eventEndDate)
            		tournamentEndDate = tournamentInfo.eventEndDate;
            	if(tournamentInfo.projectName)
            		sport = tournamentInfo.projectName;

            	var webshot = Meteor.npmRequire('webshot');
	            var fs = Npm.require('fs');
	            var Future = Npm.require('fibers/future');
	            var fut = new Future();
	            var fileName = "matchRecords-report.pdf";
	            var css = Assets.getText('style.css');
	            SSR.compileTemplate('layout', Assets.getText('layout.html'));
	            Template.layout.helpers({
	                getDocType: function() {
	                    return "<!DOCTYPE html>";
	                }
	            });

            	SSR.compileTemplate('leaveRequest', Assets.getText('leaveRequest.html'));
            
            	var data = {
	                "player": player,
	                "tournamentName": tournamentName,
	                "tournamentVenue": tournamentVenue,
	                "tournamentAddress": tournamentAddress,
	                "tournamentStartDate": reverseDate(tournamentStartDate),
	                "tournamentEndDate": reverseDate(tournamentEndDate),
	                "sport": sport
            	}

	            var html_string = SSR.render('layout', {
	                css: css,
	                template: "leaveRequest",
	                data: data
	            });

	            var options = {
                	"paperSize": {
                    "format": "Letter",
                    "orientation": "portrait",
                    "margin": "1cm"
                	},
                	siteType: 'html'
            	};

            	webshot(html_string, fileName, options, function(err) {
	                fs.readFile(fileName, function(err, data) {
	                    if (err) {
	                        return
	                    }
	                    fs.unlinkSync(fileName);
	                    fut.return(data);

	                });
            	});

	            let pdfData = fut.wait();
	            let base64String = new Buffer(pdfData).toString('base64');

	            return base64String;
            }          
        }

    },
    'generate_receipt': async function(tournamentId, playerID, player, eventType) {
        try{
	        if (Meteor.isServer) 
	        {   
	        	var tournamentName = "";
		        var tournamentVenue = "";
		        var tournamentAddress = "";
		        var tournamentStartDate = "";
		        var tournamentEndDate = "";
		        var eventList = [];

		        var tournamentInfo = pastEvents.findOne({
		           	"tournamentEvent": true,
		            '_id': tournamentId
            	})

		        if(tournamentInfo)
		        {
					eventList = pastEvents.find({
		                'tournamentId': tournamentId,
		                "eventParticipants":{"$in":[playerID]},
		                "projectType":1
		            }).fetch();
		        }
		        else if(tournamentInfo == undefined)
		        {
		            tournamentInfo = events.findOne({
		            	"tournamentEvent": true,
		                '_id': tournamentId
		            });
		            if(tournamentInfo)
		            {
		            	eventList = events.find({
		                    'tournamentId': tournamentId,
		                    "eventParticipants":{"$in":[playerID]},
		                    "projectType":1
		                }).fetch();
		            }
		       	}

	            if(tournamentInfo)
	            {

		            
					if(tournamentInfo.eventName)
						tournamentName = tournamentInfo.eventName;
					if(tournamentInfo.venueAddress)
						tournamentVenue = tournamentInfo.venueAddress;
					if(tournamentInfo.domainName)
						tournamentAddress = tournamentInfo.domainName;
					if(tournamentInfo.eventStartDate)
						tournamentStartDate = tournamentInfo.eventStartDate;
					if(tournamentInfo.eventEndDate)
						tournamentEndDate = tournamentInfo.eventEndDate;

	            	var tournamentFind = events.findOne({
	              		"_id": tournamentId
	            	})
		            var dbsrequired = ["playerEntries"]
		            var playerEntries = "playerEntries";

		            var tournamentFind = undefined;


	               	tournamentFind = pastEvents.findOne({'_id': tournamentId})

	                if(tournamentFind == undefined)  
	                {
	                    tournamentFind = events.findOne({'_id': tournamentId})
	                }

	                var res = await Meteor.call("changeDbNameForDraws", tournamentFind, dbsrequired)
	                try {
	                    if (res) {
	                        if (res.changeDb && res.changeDb == true) {
	                            if (res.changedDbNames.length != 0) {
	                               playerEntries = res.changedDbNames[0]
	                            }
	                        }
	                    }
	                }catch(e){
	                    errorLog(e)

	                }

	                var webshot = Meteor.npmRequire('webshot');
		            var fs = Npm.require('fs');
		            var Future = Npm.require('fibers/future');
		            var fut = new Future();
		            var fileName = "matchRecords-report.pdf";
		            var css = Assets.getText('style.css');
		            SSR.compileTemplate('layout', Assets.getText('layout.html'));
		            Template.layout.helpers({
		                getDocType: function() {
		                    return "<!DOCTYPE html>";
		                }
		            });

	            	SSR.compileTemplate('matchRecords_report', Assets.getText('receipt.html'));

	            				
		            var paidRecords = [];
		            var totalAmount = "0";
		            if (eventList) 
		            {
		                for (var i = 0; i < eventList.length; i++) 
		                {
		                    var eventName = eventList[i].eventName;
		                    var price = eventList[i].prize;
		                    if (eventList[i].eventParticipants) 
		                    {
		                        var eventParticipantsList = eventList[i].eventParticipants;
		                        if (eventParticipantsList) 
		                        {                           
		                            var receiptStatus = global[playerEntries].findOne({
			                            "tournamentId": tournamentId,
			                            "playerId": playerID,
			                            "paidOrNot": true
		                            });
		                            if (receiptStatus != undefined) 
		                            {
		                                totalAmount = parseInt(totalAmount) + parseInt(price);
		                                paidRecords.push({
		                                    "eventName": eventName,
		                                    "eventPrice": price
		                                });
		                            }
		                            
		                        }
		                    }
		                }
		            }

		            var player = "";
		            var playerInfo = Meteor.users.findOne({"userId":playerID});
		            if(playerInfo)
		            	player = playerInfo.userName;

		            var data = {
		                "paidRecords": paidRecords,
		               	"player": player,
		                "tournamentName": tournamentName,
		                "tournamentVenue": tournamentVenue,
		                "tournamentAddress": tournamentAddress,
		                "tournamentStartDate": reverseDate(tournamentStartDate),
		                "tournamentEndDate": reverseDate(tournamentEndDate),
		                "totalAmount": totalAmount
            		}

		            var html_string = SSR.render('layout', {
		                css: css,
		                template: "matchRecords_report",
		                data: data
		            });

		            var options = {
		                "paperSize": {
		                    "format": "Letter",
		                    "orientation": "portrait",
		                    "margin": "1cm"
		                },
		                siteType: 'html'
		            };

		            webshot(html_string, fileName, options, function(err) {
		                fs.readFile(fileName, function(err, data) {
		                    if (err) {
		                        return
		                    }

		                    fs.unlinkSync(fileName);
		                    fut.return(data);

		                });
		            });

		            let pdfData = fut.wait();
		            let base64String = new Buffer(pdfData).toString('base64');

            		return base64String;


            	} 
        	}
    	}catch(e){
        	errorLog(e)
    	}
    },


     'sendResultEmail': function(tournamentId, eventName, eventType) {
        try {
        		/*var resultData = drawResults(tournamentId,eventName);
        		return resultData;
        		*/
            var sortedMatchColl = [];
            var winner = "";
            var finalSortRecords = {};
            var finalRound = "0";
            var semiFinalRound = "0";
            var quarterFinalRound = "0";
            var bmRound = "0";

            
            var eventInfoType = events.findOne({"tournamentId":tournamentId,"eventName":eventName});
            if(eventInfoType == undefined)
                eventInfoType = pastEvents.findOne({"tournamentId":tournamentId,"eventName":eventName});
            if(eventInfoType)
            {
                if(eventInfoType.projectType)
                {
                    
                    if(eventInfoType.projectType == "1" || eventInfoType.projectType == 1)
                    {
                        var tourInfo = undefined;
                        tourInfo = pastEvents.findOne({
                            "tournamentEvent": true,
                            "_id": tournamentId 
                        });
                        if(tourInfo == undefined)
                        {
                            tourInfo = events.findOne({
                                "tournamentEvent": true,
                                "_id": tournamentId
                            });
                        }
                                    
                        if (tourInfo != undefined)
                        {
                            finalSortRecords["tournamentName"] = tourInfo.eventName;

                            if(tourInfo.venueAddress)
                                finalSortRecords["tournamentVenue"] = tourInfo.venueAddress;
                            if(tourInfo.domainName)
                                finalSortRecords["tournamentAddress"] = tourInfo.domainName;
                            if(tourInfo.eventStartDate)
                                finalSortRecords["tournamentStartDate"] = tourInfo.eventStartDate;
                            if(tourInfo.eventEndDate)
                                finalSortRecords["tournamentEndDate"] = tourInfo.eventEndDate;
                        }

                        finalSortRecords["eventName"] = eventName;

                        var eventList = MatchCollectionDB.findOne({
                            "tournamentId": tournamentId,
                            "eventName": eventName
                        });

                        if (eventList != undefined) 
                        {

                            var temp1 = MatchCollectionConfig.aggregate([{
                                    $match: {
                                        "tournamentId": tournamentId,
                                        "eventName": eventName,
                                    }
                                }, {
                                    $unwind: "$roundValues"
                                }, {
                                    $sort: {
                                        "roundValues.roundNumber": -1
                                    }
                                }, {
                                    $limit: 4
                                }, {
                                    $group: {
                                        "_id": "$_id",
                                        "roundNumber": {
                                            $push: "$roundValues.roundNumber"
                                        }
                                    }
                                }, {
                                    $project: {
                                        "roundNumber": 1
                                    }
                                },

                            ])

                            var posRounds = [];
                            if (temp1.length > 0) {
                                var roundNumberArr = temp1[0].roundNumber;
                                for (var b = 0; b < roundNumberArr.length; b++) {
                                    posRounds.push(parseInt(roundNumberArr[b]))
                                }
                            }

                            var recordsData = MatchCollectionDB.aggregate([
                                {$match:{
                                    "tournamentId":tournamentId,
                                    "eventName":eventName,
                                    $or:[{
                                              "matchRecords.roundNumber":{$in:posRounds}
                                            },{
                                              "matchRecords.roundName":{$in:["QF","SF","BM","F"]}
                                            }]
                                }},
                                {$unwind: "$matchRecords"}, 
                                {$match:{
                                  $or:[
                                        {"matchRecords.roundNumber":{$in:posRounds}},
                                        {"matchRecords.roundName":{$in:["QF","SF","BM","F"]}}
                                    ]
                                }},
                                {$group:{
                                  "_id": "$_id", 
                                  "matchRecords": {"$push": "$matchRecords"},
                                }},
                                {$project:{
                                  "matchRecords":1,
                                  "_id":0
                                }}
                            ])
                            if(recordsData.length > 0)
                            {
                                if(recordsData[0].matchRecords)
                                    records = recordsData[0].matchRecords;
                            }

                            var matchConfigInfo = MatchCollectionConfig.findOne({
                                "tournamentId": tournamentId,
                                "eventName": eventName
                            }, {
                                fields: {
                                    "roundValues": 1
                                }
                            });
                            if (matchConfigInfo != undefined) 
                            {
                                var possibleRounds = [];
                                var roundValues = matchConfigInfo.roundValues;



                                var qfRoundData = _.filter(roundValues,function(obj){
                                	return (obj.roundName.toLowerCase() == "quarter final" || obj.roundName.toLowerCase() == "quater final")

                                })

                                var semiRoundData = _.filter(roundValues,function(obj){
				        			return (obj.roundName.toLowerCase() == "semi final")
				        		})

				        		var bmRoundData = _.filter(roundValues,function(obj){
				        			return (obj.roundName.toLowerCase() == "bronze medal")
				        		})

				        		var finalRoundData = _.filter(roundValues,function(obj){
				        			return (obj.roundName.toLowerCase() == "final" )

				        		})

                               
                                if(finalRoundData && finalRoundData[0] && finalRoundData[0].roundNumber)
                                	finalRound = finalRoundData[0].roundNumber;

                                if(bmRoundData && bmRoundData[0] && bmRoundData[0].roundNumber)
                                	bmRound = bmRoundData[0].roundNumber;

                                if(semiRoundData && semiRoundData[0] && semiRoundData[0].roundNumber)
                                	semiFinalRound = semiRoundData[0].roundNumber;

                                if(qfRoundData && qfRoundData[0] && qfRoundData[0].roundNumber)
                                	quarterFinalRound = qfRoundData[0].roundNumber;

                                if (records) {
                                    for (var i = 0; i < records.length; i++) {
                                        if (records[i].roundNumber != undefined) {
                                            var finalInfo = {};
                                            var matchRecords;
                                            if (records[i].roundNumber == parseInt(finalRound) || 
                                            	records[i].roundNumber == parseInt(semiFinalRound) || 
                                            	records[i].roundNumber == parseInt(quarterFinalRound) ||
                                            	records[i].roundNumber == parseInt(bmRound)) {


                                                if (records[i].roundNumber == parseInt(finalRound)) {
                                                    finalInfo["round"] = "Final";
                                                    matchRecords = records[i];
                                                    if (matchRecords.status != "yetToPlay") {
                                                        winner = matchRecords.winner
                                                    }
                                                }
                                                if (records[i].roundNumber == parseInt(semiFinalRound)) {
                                                    finalInfo["round"] = "Semi Final";
                                                    matchRecords = records[i];
                                                }
                                                if (records[i].roundNumber == parseInt(quarterFinalRound)) {
                                                    finalInfo["round"] = "Quarter Final";
                                                    matchRecords = records[i];
                                                }
                                                if(records[i].roundNumber == parseInt(bmRound))
                                                {
                                                	finalInfo["round"] = "Bronze Medal";
                                                	matchRecords = records[i];
                                                }

                                                if (matchRecords.status != "yetToPlay") 
                                                {
                                                    finalInfo["winner"] = matchRecords.winner;
                                                    if (matchRecords.winnerID == matchRecords.playersID.playerAId) {
                                                        var scoreInfo = "";

                                                        if(matchRecords.status == "walkover" || matchRecords.status == "bye" )
                                                        {
                                                            var opponentText = "";
                                                            if(matchRecords.players.playerB.trim() != "" && matchRecords.players.playerB.trim() != "()")                    
                                                                opponentText = "against "+matchRecords.players.playerB;
                                                            
                                                            finalInfo["playerInfo"] = matchRecords.winner + " qualified " + "via "+matchRecords.status+" "+opponentText;
                                                        }
                                                        else
                                                        {
                                                            finalInfo["playerInfo"] = matchRecords.winner + " defeated " + matchRecords.players.playerB;
                                                            for (var k = 0; k < matchRecords.scores.setScoresA.length; k++) {
                                                                if (k != 0 && (matchRecords.scores.setScoresA[k] != '0' && matchRecords.scores.setScoresB[k] != '0'))
                                                                    scoreInfo += ",";
                                                                if (matchRecords.scores.setScoresA[k] != '0' && matchRecords.scores.setScoresB[k] != '0')
                                                                    scoreInfo += matchRecords.scores.setScoresA[k] + " - " + matchRecords.scores.setScoresB[k];
                                                            }
                                                        }

                                                        
                                                    } else {
                                                        var scoreInfo = "";
                                                        var opponentText = "";
                                                            if(matchRecords.players.playerA.trim() != "" && matchRecords.players.playerA.trim() != "()")                    
                                                                opponentText = "against "+matchRecords.players.playerA;
                                                        if(matchRecords.status == "walkover" || matchRecords.status == "bye" )
                                                        {
                                                            finalInfo["playerInfo"] = matchRecords.winner + " qualified " + "via "+matchRecords.status+" "+opponentText;
 
                                                        }
                                                        else
                                                        {
                                                            finalInfo["playerInfo"] = matchRecords.winner + " defeated " + matchRecords.players.playerA;
                                                            for (var k = 0; k < matchRecords.scores.setScoresB.length; k++) 
                                                            {
                                                                if (k != 0 && (matchRecords.scores.setScoresA[k] != '0' && matchRecords.scores.setScoresB[k] != '0'))
                                                                    scoreInfo += ",";
                                                                if (matchRecords.scores.setScoresA[k] != '0' && matchRecords.scores.setScoresB[k] != '0')
                                                                    scoreInfo += matchRecords.scores.setScoresB[k] + " - " + matchRecords.scores.setScoresA[k];
                                                            }
                                                        }

                                                        
                                                    }
                                                    finalInfo["scoreInfo"] = scoreInfo;
                                                    sortedMatchColl.push(finalInfo);
                                                }
                                            }
                                        }
                                    }
                                }
                                
                                finalSortRecords["winner"] = winner;

                                var matchInfo = [];
                                var finalplayerInfo = [];
                                var semiplayerInfo = [];
                                var quarterplayerInfo = [];
                                var bmplayerInfo = [];

     

                                for (var t = sortedMatchColl.length-1; t >= 0; t--) {
                                    var roundInfo = {};
                                    if (sortedMatchColl[t].round == "Final") {
                                        roundInfo["round"] = "Final";
                                        roundInfo["sortNo"] = 4;
                                        finalplayerInfo.push(sortedMatchColl[t].playerInfo + " " + sortedMatchColl[t].scoreInfo);
                                        roundInfo["playerInfo"] = finalplayerInfo;
                                    }
                                    if (sortedMatchColl[t].round == "Semi Final") {
                                        roundInfo["round"] = "Semi Final";
                                        roundInfo["sortNo"] = 2;
                                        semiplayerInfo.push(sortedMatchColl[t].playerInfo + " " + sortedMatchColl[t].scoreInfo);
                                        roundInfo["playerInfo"] = semiplayerInfo;
                                    }
                                    if (sortedMatchColl[t].round == "Quarter Final") {
                                        roundInfo["round"] = "Quarter Final";
                                        roundInfo["sortNo"] = 1;
                                        quarterplayerInfo.push(sortedMatchColl[t].playerInfo + " " + sortedMatchColl[t].scoreInfo);
                                        roundInfo["playerInfo"] = quarterplayerInfo;
                                    }
                                    if(sortedMatchColl[t].round == "Bronze Medal"){
                                        roundInfo["round"] = "Bronze Medal";
                                        roundInfo["sortNo"] = 3;
                                        bmplayerInfo.push(sortedMatchColl[t].playerInfo + " " + sortedMatchColl[t].scoreInfo);
                                        roundInfo["playerInfo"] = bmplayerInfo;
                                    }
                                    if (_.findWhere(matchInfo, roundInfo) == null) {
                                        matchInfo.push(roundInfo);
                                    }

                                    finalSortRecords["rounds"] = matchInfo;
                                }
                            }


                        }
                    }

                }
            }

            var sortedRounds = _.sortBy(finalSortRecords.rounds,function(obj){
            	return - obj.sortNo;
            })
            finalSortRecords.rounds = sortedRounds;
            return finalSortRecords;

        } catch (e) {
            errorLog(e)
        }
    },
    
})


function drawResults(tournamentId,eventName)
{
	try{
		var resultJson = {};

		var tourInfo = events.findOne({"tournamentId":tournamentId,"eventName":eventName});
		if(tourInfo == undefined)
			tourInfo = pastEvents.findOne({"tournamentId":tournamentId,"eventName":eventName});
		if(tourInfo)
		{
			if(tourInfo.projectType && (tourInfo.projectType == "1" || tourInfo.project == 1))
			{
				var winner = undefined;
				var recordsData = MatchCollectionDB.aggregate([
               {$match:{
                  "tournamentId": tournamentId,
                  "eventName": eventName,
               }},
               {$unwind: "$matchRecords"},                        
               {$match:{
						"matchRecords.status":{$ne:"yetToPlay"},
						"matchRecords.roundName":{$in:["QF","SF","BM","F"]}
               }},                           
               {$group:{"_id":{"eventName":"$eventName"},
                  "matchDetails":{$push:{
                     "roundNumber":"$matchRecords.roundNumber",
                     "matchNumber":"$matchRecords.matchNumber",
                     "roundName":{$cond:{
                        "if": { "$eq": [ "$matchRecords.roundName", "F" ] }, 
                        "then":"Final",
                        "else":{$cond:{
                           "if": { "$eq": [ "$matchRecords.roundName", "BM" ] }, 
                           "then":"Bronze Medal",
                           "else":{$cond:{
                           	"if": { "$eq": [ "$matchRecords.roundName", "SF" ] }, 
                           	"then":"Semi Final",
                           	"else":{$cond:{
                              	"if": { "$eq": [ "$matchRecords.roundName", "QF" ] }, 
                              	"then":"Quarter Final",
                              	"else":{$concat:["Round ",{$substr:["$matchRecords.roundNumber",0, 10]}]}
                           	}}
                           }}
                        }}
                     }},
                     "roundSort":{$cond:{
                        "if": { "$eq": [ "$matchRecords.roundName", "F" ] }, 
                        "then":4,
                        "else":{$cond:{
                           "if": { "$eq": [ "$matchRecords.roundName", "BM" ] }, 
                           "then":3,
                           "else":{$cond:{
                           	"if": { "$eq": [ "$matchRecords.roundName", "SF" ] }, 
                           	"then":2,
                           	"else":{$cond:{
                              	"if": { "$eq": [ "$matchRecords.roundName", "QF" ] }, 
                              	"then":1,
                              	"else":0
                           	}}
                           }}
                        }}
                     }},
                     "matchStatus":"$matchRecords.status",
                     "winner":"$matchRecords.winnerID",
                     "loser":{$cond:{
                        "if": { "$eq": [ "$matchRecords.winnerID", "$matchRecords.playersID.playerAId" ] }, 
                        "then":"$matchRecords.players.playerBId",
                        "else":"$matchRecords.players.playerAId"
                     }},
                     "winnerScore":{$cond:{
                        "if": { "$eq": [ "$matchRecords.winnerID", "$matchRecords.playersID.playerAId" ] }, 
                        "then":"$matchRecords.scores.setScoresA",
                        "else":"$matchRecords.scores.setScoresB"
                     }},
                     "loserScore":{$cond:{
                        "if": { "$eq": [ "$matchRecords.winnerID", "$matchRecords.playersID.playerAId" ] }, 
                        "then":"$matchRecords.scores.setScoresB",
                        "else":"$matchRecords.scores.setScoresA"
                     }}
                  }}                  
               }},
               {$project:{
                  "eventName":"$_id.eventName",
                  "matchDetails":1,
                  "_id":0
               }},                       
               {$project:{
               	"matchDetails":1,
               	"_id":0
               }},
               {$unwind:"$matchDetails"},
               { $sort: { 'matchDetails.roundSort': -1 }},
               { $group: { _id: {"round":"$matchDetails.roundName"},
               	//"matchData":{$first:{"$matchDetails"}}
               	"round":{$first:"$matchDetails.roundName"},
               	"roundSort":{$first:"$matchDetails.roundSort"},
               	"matchData":{ $push: "$matchDetails" },
               }},
               {$sort:{
               	"roundSort":-1
               }},
               {$project:{
               	"_id":0,
               	"round":1,
               	"matchData":1
               }}


             
                                  
            ])

            var winnerInfo = MatchCollectionDB.findOne({
                "tournamentId": tournamentId,
                "eventName":eventName,
                "matchRecords.roundName": "F"
            }, {
                fields: {
                    _id: 0,
                    "matchRecords": {
                        $elemMatch: {
                            "roundName": "F"
                        }
                    }
                }
            });
            if(winnerInfo && winnerInfo.matchRecords && winnerInfo.matchRecords.length > 0 &&
            	winnerInfo.matchRecords[0] && winnerInfo.matchRecords[0].winnerID
            	)
            		winner = winnerInfo.matchRecords[0].winnerID;
            	resultJson["status"] = "success";
            	resultJson["eventName"] = eventName;
            	resultJson["rounds"] = recordsData;

            	var tourDetails = events.findOne({"_id":tournamentId});
					if(tourDetails == undefined)
						tourDetails = pastEvents.findOne({"_id":tournamentId});

					if(tourDetails)
						resultJson["tournamentName"] = tourDetails.eventName;

            	if(tourInfo.venueAddress)
                  resultJson["tournamentVenue"] = tourInfo.venueAddress;
               if(tourInfo.domainName)
                  resultJson["tournamentAddress"] = tourInfo.domainName;
               if(tourInfo.eventStartDate)
                  resultJson["tournamentStartDate"] = tourInfo.eventStartDate;
               if(tourInfo.eventEndDate)
                  resultJson["tournamentEndDate"] = tourInfo.eventEndDate;
            	if(winner)
            		resultJson["winner"] = winner;
            	return resultJson;
			}
		}

	}catch(e){

		errorLog(e)
	}
}