import { MatchCollectionDB } from '../../publications/MatchCollectionDb.js';
import { teamMatchCollectionDB } from '../../publications/MatchCollectionDbTeam.js';

Meteor.methods({

	'genericMailTemplate': function(tournamentId,eventName,toList,includeResults,message) {

		try{
			

			var sortedMatchColl = [];
	      	var winner = "" ;
	      	var finalSortRecords = {} ;
	     	var finalRound = "0";
	      	var semiFinalRound = "0";
	      	var quarterFinalRound = "0";

	      	var temp1 = MatchCollectionConfig.aggregate([
	            {$match:{
	              "tournamentId":tournamentId,
	              "eventName":eventName,
	            }},
	            {$unwind:"$roundValues"},
	            {$sort: {"roundValues.roundNumber":-1}}, 
	            {$limit:4},
	            {$group:{"_id":"$_id",       
	                  "roundNumber":{$push:"$roundValues.roundNumber"}
	                }},
	            {$project:{
	              "roundNumber":1
	            }}
          	])


	        var roundList = [];
	        if(temp1.length > 0)
	       	{
	            var roundNumberArr = temp1[0].roundNumber;
	            for(var b=0;b<roundNumberArr.length;b++)
	            {
	              roundList.push(parseInt(roundNumberArr[b]))
	            }
	        }

	        var results = "";
	        if(includeResults)
	        {
	        	
	        	var recordsData = MatchCollectionDB.aggregate([
		            {$match:{
		                "tournamentId":tournamentId,
		                        "eventName":eventName,
		                $or:[{
		                          "matchRecords.roundNumber":{$in:roundList}
		                        },{
		                          "matchRecords.roundName":{$in:["QF","SF","F"]}
		                        }]
		            }},
		            {$unwind: "$matchRecords"}, 
		            {$match:{
		              $or:[
			                {"matchRecords.roundNumber":{$in:roundList}},
			                {"matchRecords.roundName":{$in:["QF","SF","F"]}}
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
				var matchConfigInfo = MatchCollectionConfig.findOne({"tournamentId" :tournamentId,"eventName" : eventName},{fields:{"roundValues":1}});
	        	if(matchConfigInfo != undefined)
	        	{
		          	var possibleRounds = [];
		          	var mx = parseInt(matchConfigInfo.roundValues.length) - parseInt(1) ;
		          	if(matchConfigInfo.roundValues[mx-1] != undefined)
		            	finalRound = matchConfigInfo.roundValues[mx-1].roundNumber;
		          	if(matchConfigInfo.roundValues[mx-2] != undefined)
		            	semiFinalRound = matchConfigInfo.roundValues[mx-2].roundNumber;
		          	if(matchConfigInfo.roundValues[mx-3] != undefined)
		            	quarterFinalRound = matchConfigInfo.roundValues[mx-3].roundNumber;
	        	}
				for (var i=0; i<records.length; i++) 
	            {
		            if(records[i].roundNumber != undefined)
		             {
		               	var finalInfo = {};
		                var matchRecords;
		                if(records[i].roundNumber == parseInt(finalRound) || records[i].roundNumber == parseInt(semiFinalRound) || records[i].roundNumber == parseInt(quarterFinalRound))
		                {
			                if(records[i].roundNumber == parseInt(finalRound))
			                {
			                    finalInfo["round"] = "Final";
			                    matchRecords = records[i];
			                    if(matchRecords.status != "yetToPlay")
			                    	winner = matchRecords.winner
			                    	
			                }
			                else if(records[i].roundNumber == parseInt(semiFinalRound))
			                {
			                    finalInfo["round"] = "Semi Final";
			                    matchRecords = records[i];
			                }
			                if(records[i].roundNumber == parseInt(quarterFinalRound))
			                {
			                    finalInfo["round"] = "Quarter Final";
			                    matchRecords = records[i];
			                }

			                if(matchRecords.status != "yetToPlay")
			                {
			                    finalInfo["winner"] = matchRecords.winner;
			                    if(matchRecords.winnerID == matchRecords.playersID.playerAId)
			                    {
			                      	finalInfo["playerInfo"] = matchRecords.winner+" defeated "+matchRecords.players.playerB;
			                      	var scoreInfo="";
			                      	for(var k=0; k< matchRecords.scores.setScoresA.length; k++)
			                      	{
			                        	if(k != 0 && (matchRecords.scores.setScoresA[k] != '0' && matchRecords.scores.setScoresB[k] != '0'))
			                          		scoreInfo += ",";
			                        	if(matchRecords.scores.setScoresA[k] != '0' && matchRecords.scores.setScoresB[k] != '0')
			                          		scoreInfo += matchRecords.scores.setScoresA[k]+" - "+matchRecords.scores.setScoresB[k];
			                      	}
			                    }
				                else
				                {
				                    finalInfo["playerInfo"] = matchRecords.winner+" defeated "+matchRecords.players.playerA;
				                    for(var k=0; k< matchRecords.scores.setScoresB.length; k++)
				                    {
				                        if(k != 0 && (matchRecords.scores.setScoresA[k] != '0' && matchRecords.scores.setScoresB[k] != '0'))
				                          	scoreInfo += ",";
				                        if(matchRecords.scores.setScoresA[k] != '0' && matchRecords.scores.setScoresB[k] != '0')
				                          	scoreInfo += matchRecords.scores.setScoresB[k]+" - "+matchRecords.scores.setScoresA[k];
				                    }
				                }
			                    finalInfo["scoreInfo"] = scoreInfo;
			                    sortedMatchColl.push(finalInfo);
			                }
		                }
	            	}
        		}

        		
          		finalSortRecords["winner"] = winner;
          		var matchInfo = [];
          		var finalplayerInfo=[];
          		var semiplayerInfo=[];
          		var quarterplayerInfo = [];

          		for(var t=sortedMatchColl.length-1; t>0 ; t--)
         	 	{
            		var roundInfo={};
            		if(sortedMatchColl[t].round)
            		{
            			if(sortedMatchColl[t].round == "Final")
			            {
			              	roundInfo["round"] = "Final";
			              	finalplayerInfo.push(sortedMatchColl[t].playerInfo+" "+sortedMatchColl[t].scoreInfo);
			              	roundInfo["playerInfo"] = finalplayerInfo;
			            }
			            if(sortedMatchColl[t].round == "Semi Final")
			            {
			              	roundInfo["round"] = "Semi Final";
			              	semiplayerInfo.push(sortedMatchColl[t].playerInfo+" "+sortedMatchColl[t].scoreInfo);
			              	roundInfo["playerInfo"] = semiplayerInfo;
			            }
			            if(sortedMatchColl[t].round == "Quarter Final")
			            {
			              	roundInfo["round"] = "Quarter Final";
				            quarterplayerInfo.push(sortedMatchColl[t].playerInfo+" "+sortedMatchColl[t].scoreInfo);
				            roundInfo["playerInfo"] = quarterplayerInfo;
			            }
			            if (_.findWhere(matchInfo, roundInfo) == null) {
			              	matchInfo.push(roundInfo);
			            }
            			finalSortRecords["rounds"] = matchInfo;
            		}
          		}     		
	        }
	        var tournamentName = "";

			var tourInfo = undefined;
			tourInfo = pastEvents.findOne({"tournamentEvent":true,"_id":tournamentId});
			if(tourInfo == undefined)
			{
				tourInfo = events.findOne({"tournamentEvent":true,"_id":tournamentId});
			}
          
          	if(tourInfo != undefined)
          	{
          		finalSortRecords["tournamentName"] = tourInfo.eventName;
          		finalSortRecords["sponsorLogo"] = tourInfo.sponsorLogo;
				var sponsorLogoURL = eventUploads.find({"_id":tourInfo.sponsorLogo}).fetch();
          		finalSortRecords["sponsorLogoURL"] = sponsorLogoURL;

          	}

    		var absoluteUrl = Meteor.absoluteUrl().toString();
    		var absoluteUrlString = absoluteUrl.substring(0,absoluteUrl.lastIndexOf("/"));
          	finalSortRecords["eventName"] = eventName;
          	finalSortRecords["imageURL"] = absoluteUrlString;


	       
	        SSR.compileTemplate('mailTemplate', Assets.getText('mailTemplate.html'));	       
            var html_string = SSR.render('mailTemplate', finalSortRecords);


            var toMail = toList.split(",")[0];
            var options = {
                from: "iplayon.in@gmail.com",
                to: toMail,
                cc: toList,                        
                subject: "iPlayOn:Results ",
                html: html_string
            }
            Meteor.call("sendShareEmail", options, function(e, re) {
                if (re) {} else {}
            });
            return true;
		}catch(e)
		{
			return false
		}


	}


})