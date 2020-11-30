import { MatchCollectionDB } from '../../publications/MatchCollectionDb.js';
import { teamMatchCollectionDB } from '../../publications/MatchCollectionDbTeam.js';
import { fetchLiveIndividual } from './reporterFunc.js';
import { fetchLiveTeam } from './reporterFunc.js';
import {fetchLiveRRTeam} from './reporterFunc.js'



Meteor.methods({

	/**
     * Meteor Method to fetch all past tournaments
     * @collectionName : pastEvents 
     * @passedByValues : userId   
     * @dataType : String 
     * @dbQuery : fetch all past tournaments
     * @methodDescription :  fetch all past tournaments
     * @returnValue : json with status(success/failue), message, 
       data - array of tournaments with events(events having draws)   
     * Usage - Reporter    
    */
	allPastTournaments:function(userId)
	{
		try{
			var resultJson = {};
			var userInfo = Meteor.users.findOne({"userId":userId});
			if(userInfo)
			{
				//var tourID = ["oR38jsdbEdrCH8tg8","2GCLyCM9qw2PqAXXM"]
				var tournamentInfo = pastEvents.find({
                    "tournamentEvent":true
                  //  "_id":{$in:tourID}
                	},
                    {fields:{
                    	"eventName":1,
                    	"eventStartDate":1,
                    	"eventEndDate":1,
                    	"eventSubscriptionLastDate":1,
                    	"domainName":1,
                    	"projectName":1,
                    	"subscriptionTypeDirect":1,
                    	"subscriptionTypeHyper":1,
						"hyperLinkValue" : 1,
                    }}).fetch();

				for(var i=0;i<tournamentInfo.length;i++)
				{
					var tournamentId = tournamentInfo[i]._id;
					var raw1 = MatchCollectionDB.rawCollection();
		    		var distinct1 = Meteor.wrapAsync(raw1.distinct, raw1);
		    		var eventList1 =  distinct1('eventName',{"tournamentId":tournamentId});

		    		var raw2 = teamMatchCollectionDB.rawCollection();
		    		var distinct2 = Meteor.wrapAsync(raw2.distinct, raw2);
		    		var eventList2 =  distinct2('eventName',{"tournamentId":tournamentId});
		    
		    		var eventList = eventList1.concat(eventList2);
		    		tournamentInfo[i]["drawEvents"] = eventList;

				}
				resultJson["status"] = "success";
				resultJson["message"] = "Tournament List";
				resultJson["data"] = tournamentInfo;
			}
			else
			{
				resultJson["status"] = "failure";
				resultJson["message"] = "Invalid User!!"
			}
			return resultJson;

		}catch(e){
		}
	},
	/**
     * Meteor Method to fetch all upcoming tournaments
     * @collectionName : events (if upcoming tournament)
     * @passedByValues : userId   
     * @dataType : String 
     * @dbQuery : fetch all upcoming tournaments
     * @methodDescription :  fetch all upcoming tournaments
     * @returnValue : json with status(success/failue), message, 
       data - array of tournaments with events(events having draws)   
     * Usage - Reporter    
    */
	allUpcomingTournaments:function(userId)
	{
		try{
			var resultJson = {};
			var userInfo = Meteor.users.findOne({"userId":userId});
			if(userInfo)
			{
				var tournamentInfo = events.find({
                    "tournamentEvent":true},
                    {fields:{
                    	"eventName":1,
                    	"eventStartDate":1,
                    	"eventEndDate":1,
                    	"eventSubscriptionLastDate":1,
                    	"domainName":1,
                    	"projectName":1,
                    	"subscriptionTypeDirect":1,
                    	"subscriptionTypeHyper":1,
						"hyperLinkValue" : 1,
                    }}).fetch();

				for(var i=0;i<tournamentInfo.length;i++)
				{
					var tournamentId = tournamentInfo[i]._id;

					var swapInfo = customCollection.findOne({"key":tournamentId,"send":true})
					var eventList1 = [];
					var eventList2 = [];

					if(swapInfo)
					{
						var raw1 = roundRobinEvents.rawCollection();
			    		var distinct1 = Meteor.wrapAsync(raw1.distinct, raw1);
			    		eventList1 =  distinct1('eventName',{"tournamentId":tournamentId});

			    		var raw2 = roundRobinTeamEvents.rawCollection();
			    		var distinct2 = Meteor.wrapAsync(raw2.distinct, raw2);
			    		eventList2 =  distinct2('eventName',{"tournamentId":tournamentId});
					}
					else
					{
						var raw1 = MatchCollectionDB.rawCollection();
			    		var distinct1 = Meteor.wrapAsync(raw1.distinct, raw1);
			    		eventList1 =  distinct1('eventName',{"tournamentId":tournamentId});

			    		var raw2 = teamMatchCollectionDB.rawCollection();
			    		var distinct2 = Meteor.wrapAsync(raw2.distinct, raw2);
			    		eventList2 =  distinct2('eventName',{"tournamentId":tournamentId});
					}



					
		    
		    		eventList = eventList1.concat(eventList2);
		    		tournamentInfo[i]["drawEvents"] = eventList;

				}
				resultJson["status"] = "success";
				resultJson["message"] = "Tournament List";
				resultJson["data"] = tournamentInfo;

			}
			else
			{
				resultJson["status"] = "failure";
				resultJson["message"] = "Invalid User!!"
			}

			return resultJson;

		}catch(e)
		{
		}
	},

	/**
     * Meteor Method to fetch match details of specified match number
     * @collectionName : events (if upcoming tournament),pastEvents(if past tournament)
     	teamMatchCollectionDB (if team event), MatchCollectionDB ( if individual event)
     * @passedByValues : data  (contains tournamentId, eventName,matchNumber) 
     * @dataType : json 
     * @dbQuery : fetch match details of specified match number
     * @methodDescription :  fetch match details of specified match number of any past/upcoming
       tournament of any individual/team event
     * @returnValue : json with status(success/failue), message, 
       matchList(array of matchnumbers),matchRecord (details of specified matchnumber)
       data - array of tournaments with events(events having draws)   
     * Usage - Reporter    
    */
	fetchDefaultMatchRecord:async function(data)
	{
		try{

			var resultJson = {};
			var xData = data;
			var tournamentId = xData.tournamentId;
			var eventName = xData.eventName;
			var matchNumber;
			var checkEvent = events.findOne({
				"tournamentId":tournamentId,
				"eventName":eventName});
			if(checkEvent)
			{
				if(checkEvent.projectType)
				{
					if(checkEvent.projectType == 2)
					{
						var raw = teamMatchCollectionDB.rawCollection();
      					var distinct = Meteor.wrapAsync(raw.distinct, raw);
      					var matchList = distinct('matchRecords.matchNumber',{"tournamentId":tournamentId,"eventName":eventName});
      					if(matchList.length > 0)
      					{
      						if(xData.matchNumber)
								matchNumber = parseInt(xData.matchNumber);
							else
								matchNumber = matchList[0];

	      					var matchRecordInfo = teamMatchCollectionDB.findOne({
	                			"tournamentId": tournamentId,
				    			"eventName": eventName,
	                			"matchRecords.matchNumber": matchNumber
					            }, {
					                fields: {
					                    _id: 0,
					                    matchRecords: {
					                        $elemMatch: {
					                            "matchNumber":  matchNumber
					                        }
					                    }
					                }
					            });

	      					var matchRecord = [];
	      					var teamAId = "";
	      					var teamBId = "";
	      					if(matchRecordInfo)
	      					{
	      						if(matchRecordInfo.matchRecords && matchRecordInfo.matchRecords.length > 0)
	      						{
	      							matchRecord = matchRecordInfo.matchRecords[0];
	      							if(matchRecord.teamsID)
	      							{
	      								if(matchRecord.teamsID.teamAId)
	      								{
	      									teamAId = matchRecord.teamsID.teamAId;
	      									var userInfo = playerTeams.findOne({"_id":matchRecord.teamsID.teamAId});
	      									if(userInfo)
	      									{
	      										matchRecord["playerA"] = userInfo.teamName;
	      										if(matchRecord.winnerID == matchRecord.teamsID.teamAId)
	      											matchRecord["winner"] = userInfo.teamName;
	      									}
	      								}
	      								if(matchRecord.teamsID.teamBId)
	      								{
	      									teamBId = matchRecord.teamsID.teamBId;
	      									var userInfo = playerTeams.findOne({"_id":matchRecord.teamsID.teamBId});
	      									if(userInfo)
	      									{
	      										matchRecord["playerB"] = userInfo.teamName;
	      										if(matchRecord.winnerID == matchRecord.teamsID.teamBId)
	      											matchRecord["winner"] = userInfo.teamName;
	      									}
	      								}
	      								
	      							}
	      						}
	      					}

	      					var teamAPlayers = await Meteor.call("teamPlayersFetch", teamAId, tournamentId);
	      					var teamBPlayers = await Meteor.call("teamPlayersFetch", teamBId, tournamentId);


	      					
                        	var teamSpec = teamDrawsSpec.aggregate([
								{$match:{
									"tournamentId" : tournamentId, 
	                            	"eventName" : eventName			
								}},
								{$unwind:"$teamDet"},
								{$match:{
									"teamDet.matchNumber":matchNumber
								}},
								{$group:{"_id":"$_id",
				        			"tournamentId": { "$first": "$tournamentId"},
				        			"eventName": { "$first": "$eventName"},
				        			"teamDet": { "$push": "$teamDet"},
				    			}}
				    		]);	




							var teamScores = teamDetailedScores.aggregate([
								{$match:{
									"tournamentId" : tournamentId, 
	                            	"eventName" : eventName			
								}},
								{$unwind:"$teamDetScore"},
								{$match:{
									"teamDetScore.matchNumber":matchNumber
								}},
								{$group:{"_id":"$_id",
				        			"tournamentId": { "$first": "$tournamentId"},
				        			"eventName": { "$first": "$eventName"},
				        			"teamDet": { "$push": "$teamDetScore"},
				    			}}
				    		]);	


							var matchFormatInfo = MatchTeamCollectionConfig.findOne({"tournamentId":tournamentId,"eventName":eventName});
		      				if(matchFormatInfo && matchFormatInfo.teamFormatId)
		      				{
								var formatInfo = orgTeamMatchFormat.findOne({"_id":matchFormatInfo.teamFormatId})
		      					if(formatInfo && formatInfo.specifications)
		      						resultJson["matchSet"] = formatInfo.specifications.length;
		      				
		      				}

		      				if(matchRecord.scores.setScoresA.length != resultJson.matchSet)
		      				{
		      					var scoreLen = matchRecord.scores.setScoresA.length;
		      					for(i = scoreLen; i< resultJson.matchSet; i++)
		      					{
		      						matchRecord.scores.setScoresA.push("0");
		      						matchRecord.scores.setScoresB.push("0");
		      					}
		      				}


	      					resultJson["status"] = "success";
	      					resultJson["matchList"] = matchList;
	      					resultJson["matchRecord"] = matchRecord;
	      					resultJson["teamAPlayers"] = teamAPlayers;
	      					resultJson["teamBPlayers"] = teamBPlayers;
	      					resultJson["teamSpec"] = teamSpec;
	      					if(teamScores.length > 0 && teamScores[0] && 
	      						teamScores[0].teamDet && teamScores[0].teamDet.length > 0 && 
	      						teamScores[0].teamDet[0])
	      						resultJson["teamScores"] = teamScores[0].teamDet[0];
	      					resultJson["projectType"] = checkEvent.projectType;


	      					
	      					return resultJson;

      					}
					}
					else if(checkEvent.projectType == 1)
					{
						
						var raw = MatchCollectionDB.rawCollection();
      					var distinct = Meteor.wrapAsync(raw.distinct, raw);
      					var matchList = distinct('matchRecords.matchNumber',{"tournamentId":tournamentId,"eventName":eventName});
      					if(matchList.length > 0)
      					{

      						if(xData.matchNumber)
								matchNumber = parseInt(xData.matchNumber);
							else
								matchNumber = parseInt(matchList[0]);


	      					var matchRecordInfo = MatchCollectionDB.findOne({
	                			"tournamentId": tournamentId,
				    			"eventName": eventName,
	                			"matchRecords.matchNumber": matchNumber
					            }, {
					                fields: {
					                    _id: 0,
					                    matchRecords: {
					                        $elemMatch: {
					                            "matchNumber":  matchNumber
					                        }
					                    }
					                }
					            });

	      					var matchRecord = [];
	      					if(matchRecordInfo)
	      					{
	      						if(matchRecordInfo.matchRecords && matchRecordInfo.matchRecords.length > 0)
	      						{
	      							matchRecord = matchRecordInfo.matchRecords[0];
	      							if(matchRecord.playersID)
	      							{
	      								if(matchRecord.playersID.playerAId)
	      								{
	      									var userInfo = Meteor.users.findOne({"userId":matchRecord.playersID.playerAId});
	      									if(userInfo)
	      									{
	      										matchRecord["playerA"] = userInfo.userName;
	      										if(matchRecord.winnerID == matchRecord.playersID.playerAId)
	      											matchRecord["winner"] = userInfo.userName;
	      									}
	      								}
	      								if(matchRecord.playersID.playerBId)
	      								{
	      									var userInfo = Meteor.users.findOne({"userId":matchRecord.playersID.playerBId});
	      									if(userInfo){
	      										matchRecord["playerB"] = userInfo.userName;
	      										if(matchRecord.winnerID == matchRecord.playersID.playerBId)
	      											matchRecord["winner"] = userInfo.userName;
	      									}
	      								}
	      								
	      							}
	      						}
	      					}
	      					resultJson["status"] = "success";
	      					resultJson["matchList"] = matchList;
	      					resultJson["matchRecord"] = matchRecord;
	      					resultJson["projectType"] = checkEvent.projectType;
	      					return resultJson;

      					}
						
					}
				}
			}
			else
			{
				checkEvent = pastEvents.findOne({
					"tournamentId":tournamentId,
					"eventName":eventName
				})
				if(checkEvent)
				{
					if(checkEvent.projectType)
					{
						if(checkEvent.projectType == 2)
						{
							var raw = teamMatchCollectionDB.rawCollection();
      						var distinct = Meteor.wrapAsync(raw.distinct, raw);
      						var matchList = distinct('matchRecords.matchNumber',{"tournamentId":tournamentId,"eventName":eventName});
	      					if(matchList.length > 0)
	      					{
	      						if(xData.matchNumber)
									matchNumber = parseInt(xData.matchNumber);
								else
									matchNumber = matchList[0];

		      					var matchRecordInfo = teamMatchCollectionDB.findOne({
		                			"tournamentId": tournamentId,
					    			"eventName": eventName,
		                			"matchRecords.matchNumber": matchNumber
						            }, {
						                fields: {
						                    _id: 0,
						                    matchRecords: {
						                        $elemMatch: {
						                            "matchNumber":  matchNumber
						                        }
						                    }
						                }
						            });

		      					var matchRecord = [];
		      					var teamAId = "";
	      						var teamBId = "";
		      					if(matchRecordInfo)
		      					{
		      						if(matchRecordInfo.matchRecords && matchRecordInfo.matchRecords.length > 0)
		      						{
		      							matchRecord = matchRecordInfo.matchRecords[0];
		      							if(matchRecord.teamsID)
		      							{
		      								if(matchRecord.teamsID.teamAId)
		      								{
		      									teamAId = matchRecord.teamsID.teamAId;
		      									var userInfo = playerTeams.findOne({"_id":matchRecord.teamsID.teamAId});
		      									if(userInfo)
		      									{
		      										matchRecord["playerA"] = userInfo.teamName;
		      										if(matchRecord.winnerID == matchRecord.teamsID.teamAId)
		      											matchRecord["winner"] = userInfo.teamName;
		      									}
		      								}
		      								if(matchRecord.teamsID.teamBId)
		      								{
		      									teamBId = matchRecord.teamsID.teamBId;
		      									var userInfo = playerTeams.findOne({"_id":matchRecord.teamsID.teamBId});
		      									if(userInfo){
		      										matchRecord["playerB"] = userInfo.teamName;
		      										if(matchRecord.winnerID == matchRecord.teamsID.teamBId)
		      											matchRecord["winner"] = userInfo.teamName;
		      									}
		      								}
		      								
		      							}
		      						}
		      					}

		      					var teamAPlayers = await Meteor.call("teamPlayersFetch", teamAId, tournamentId);
	      						var teamBPlayers = await Meteor.call("teamPlayersFetch", teamBId, tournamentId);


	      					
                        	var teamSpec = teamDrawsSpec.aggregate([
								{$match:{
									"tournamentId" : tournamentId, 
	                            	"eventName" : eventName			
								}},
								{$unwind:"$teamDet"},
								{$match:{
									"teamDet.matchNumber":matchNumber
								}},
								{$group:{"_id":"$_id",
				        			"tournamentId": { "$first": "$tournamentId"},
				        			"eventName": { "$first": "$eventName"},
				        			"teamDet": { "$push": "$teamDet"},
				    			}}
				    		]);	




							var teamScores = teamDetailedScores.aggregate([
								{$match:{
									"tournamentId" : tournamentId, 
	                            	"eventName" : eventName			
								}},
								{$unwind:"$teamDetScore"},
								{$match:{
									"teamDetScore.matchNumber":matchNumber
								}},
								{$group:{"_id":"$_id",
				        			"tournamentId": { "$first": "$tournamentId"},
				        			"eventName": { "$first": "$eventName"},
				        			"teamDet": { "$push": "$teamDetScore"},
				    			}}
				    		]);	


							var matchFormatInfo = MatchTeamCollectionConfig.findOne({"tournamentId":tournamentId,"eventName":eventName});
		      				if(matchFormatInfo && matchFormatInfo.teamFormatId)
		      				{
								var formatInfo = orgTeamMatchFormat.findOne({"_id":matchFormatInfo.teamFormatId})
		      					if(formatInfo && formatInfo.specifications)
		      						resultJson["matchSet"] = formatInfo.specifications.length;
		      				
		      				}

		      				if(matchRecord.scores.setScoresA.length != resultJson.matchSet)
		      				{
		      					var scoreLen = matchRecord.scores.setScoresA.length;
		      					for(i = scoreLen; i< resultJson.matchSet; i++)
		      					{
		      						matchRecord.scores.setScoresA.push("0");
		      						matchRecord.scores.setScoresB.push("0");
		      					}
		      				}


	      					resultJson["status"] = "success";
	      					resultJson["matchList"] = matchList;
	      					resultJson["matchRecord"] = matchRecord;
	      					resultJson["teamAPlayers"] = teamAPlayers;
	      					resultJson["teamBPlayers"] = teamBPlayers;
	      					resultJson["teamSpec"] = teamSpec;
	      					if(teamScores.length > 0 && teamScores[0] && 
	      						teamScores[0].teamDet && teamScores[0].teamDet.length > 0 && 
	      						teamScores[0].teamDet[0])
	      						resultJson["teamScores"] = teamScores[0].teamDet[0];
	      					resultJson["projectType"] = checkEvent.projectType;


		      					//resultJson["status"] = "success";
		      					//resultJson["matchList"] = matchList;
		      					//resultJson["matchRecord"] = matchRecord;
		      					//resultJson["projectType"] = checkEvent.projectType

		      					return resultJson;

	      					}
						}
						else if(checkEvent.projectType == 1)
						{
							
							var raw = MatchCollectionDB.rawCollection();
	      					var distinct = Meteor.wrapAsync(raw.distinct, raw);
	      					var matchList = distinct('matchRecords.matchNumber',{"tournamentId":tournamentId,"eventName":eventName});
	      					if(matchList.length > 0)
	      					{
	      						if(xData.matchNumber)
									matchNumber = parseInt(xData.matchNumber);
								else
									matchNumber = matchList[0];

		      					var matchRecordInfo = MatchCollectionDB.findOne({
		                			"tournamentId": tournamentId,
					    			"eventName": eventName,
		                			"matchRecords.matchNumber": matchNumber
						            }, {
						                fields: {
						                    _id: 0,
						                    matchRecords: {
						                        $elemMatch: {
						                            "matchNumber":  matchNumber
						                        }
						                    }
						                }
						            });

		      					var matchRecord = [];
		      					if(matchRecordInfo)
		      					{
		      						if(matchRecordInfo.matchRecords && matchRecordInfo.matchRecords.length > 0)
		      						{
		      							matchRecord = matchRecordInfo.matchRecords[0];
		      							if(matchRecord.playersID)
		      							{
		      								if(matchRecord.playersID.playerAId)
		      								{
		      									var userInfo = Meteor.users.findOne({"userId":matchRecord.playersID.playerAId});
		      									if(userInfo)
		      									{
		      										matchRecord["playerA"] = userInfo.userName;
		      										if(matchRecord.winnerID == matchRecord.playersID.playerAId)
		      											matchRecord["winner"] = userInfo.userName;
		      									}
		      								}
		      								if(matchRecord.playersID.playerBId)
		      								{
		      									var userInfo = Meteor.users.findOne({"userId":matchRecord.playersID.playerBId});
		      									if(userInfo){
		      										matchRecord["playerB"] = userInfo.userName;
		      										if(matchRecord.winnerID == matchRecord.playersID.playerBId)
		      											matchRecord["winner"] = userInfo.userName;
		      									}
		      								}
		      								
		      							}
		      						}
		      					}
		      					resultJson["status"] = "success";
		      					resultJson["matchList"] = matchList;
		      					resultJson["matchRecord"] = matchRecord;
		      					resultJson["projectType"] = checkEvent.projectType;


		      					return resultJson;

	      					}
							
						}
					}
				}
				else
				{
					resultJson["status"] = "failure";
					resultJson["response"] = "Invalid data";
					return resultJson;
				}
			}




		}catch(e){

			errorLog(e)
			var resultJson = {};
			resultJson["status"] = "failure";
			resultJson["message"] = "Could not set fetch record "+e;
			return resultJson;

		}
	},
	
	/**
     * Meteor Method to send matchdetails of specified match number as an 
       email to eventOrganizer by loggedIn reporter
     * @collectionName : events (if upcoming tournament),pastEvents(if past tournament)
     	teamMatchCollectionDB (if team event), MatchCollectionDB ( if individual event)
     * @passedByValues : data  (contains userId, tournamentId,eventName,matchnumber ... so on) 
     * @dataType : json 
     * @dbQuery : fetch/composed matchdetails of a match number
     * @methodDescription :  compose email and send match deatails along with added attachments
     * @returnValue : boolean
     * Usage - Reporter    
    */
	emailMatchReport: async function(data)
	{
		try{
			var json_Data = {};
			var eventOrganizerID = "";
			var eventOrganizerMail = "";
			var reporterUserMail = "";
			if(data.userId)
			{
				var reporterInfo = Meteor.users.findOne({"userId":data.userId});
				if(reporterInfo)
					reporterUserMail = reporterInfo.emailAddress;
			}

			var tourInfo = undefined;
			tourInfo = pastEvents.findOne({"tournamentEvent":true,"_id":data.tournamentId});
			if(tourInfo == undefined)
			{
				tourInfo = events.findOne({"tournamentEvent":true,"_id":data.tournamentId});
			}
          
          	if(tourInfo != undefined)
          	{
          		eventOrganizerID = tourInfo.eventOrganizer;
          		json_Data["tournamentName"] = tourInfo.eventName;
          		json_Data["sponsorLogo"] = tourInfo.sponsorLogo;
				var sponsorLogoURL = eventUploads.find({"_id":tourInfo.sponsorLogo}).fetch();
          		json_Data["sponsorLogoURL"] = sponsorLogoURL;
          		if(tourInfo.domainName)
          			json_Data["tournamentAddress"] = tourInfo.domainName;

          		if(tourInfo.eventStartDate)
          			json_Data["tournamentStartDate"] = tourInfo.eventStartDate;

          		if(tourInfo.eventEndDate)
          			json_Data["tournamentEndDate"] = tourInfo.eventEndDate;
          		if(tourInfo.domainName)
          			json_Data["domainName"]  = tourInfo.domainName;
          	}


    		var absoluteUrl = Meteor.absoluteUrl().toString();
    		var absoluteUrlString = absoluteUrl.substring(0,absoluteUrl.lastIndexOf("/"));
          	json_Data["eventName"] = data.eventName;
          	json_Data["matchNumber"] = data.matchNumber;
          	json_Data["imageURL"] = absoluteUrlString+"/logo.png";
          	json_Data["pathURL"] =absoluteUrlString+"/"
          	json_Data["eventName"] = data.eventName;
          	json_Data["playerA"] = data.player1Name;
          	json_Data["playerB"] = data.player2Name;
          	json_Data["playerAScore"] = data.playerAScore;
          	json_Data["playerBScore"] = data.playerBScore;
          	if(data.teamMatches)
          		json_Data["teamMatches"] = data.teamMatches;
          	if(data.winnerName)
          		json_Data["winnerName"] = data.winnerName;


          	json_Data["logoURL"] = absoluteUrlString+"/logo.png";
            var css = Assets.getText('printTeamDetailedDraws.css');

          	
          
            SSR.compileTemplate('matchReport', Assets.getText('matchReport.html'));	       
           	Template.matchReport.helpers({
                    getDocType: function() {
                        return "<!DOCTYPE html>";
                    },
                    fetchMatchType: function(matchType) {
                    	if(matchType.trim().toLowerCase() == "doubles")
                        	return true;
                        else
                        	return false;
                    }
                });

           	var fs = Npm.require('fs');
            var Future = Npm.require('fibers/future');
            var fut = new Future();

            var fileAttachments = [];
            if(data.files)
            {
            	for(var v=0;v<data.files.length;v++)
            	{
            		var fileInfo = data.files[v];
            		if(fileInfo.filePath)
            		{

            			let fileName = 'image.png'
            			if(fileInfo.fileName)
            				fileName = fileInfo.fileName+".png";
            		
            			fs.writeFile(fileName, fileInfo.filePath, 'base64', function (err, res) {
			    			if (err) {
			    			}
						});

						fileAttachments.push({"path":fileName});
            	
            		}
            	}
            }

            
            var eventOrganizerInfo = Meteor.users.findOne({"userId":eventOrganizerID});
            if(eventOrganizerInfo)
            	eventOrganizerMail = eventOrganizerInfo.emailAddress;
            var html_string = SSR.render('matchReport', json_Data);
            var ccMailID = [eventOrganizerMail,reporterUserMail];

         

			var fromMail = "iplayon.in@gmail.com";
 			var fromMailInfo = customCollection.findOne({
                "key" : "reportermail"
            })
            if(fromMailInfo && fromMailInfo.mailId)
            	fromMail = fromMailInfo.mailId;


            var options = {
                from: "iplayon.in@gmail.com",
                to:"reports@iplayon.in",
                cc: ccMailID,
                //to:"shalini.krishnan90@gmail.com",
                subject: "iPlayOn:Results ",
                html: html_string,
                attachments: fileAttachments,
                siteType: 'html'

            }
            var re =  await Meteor.call("sendShareEmail", options) 
            if (re) {
            	return true;
            } 
            else 
            {
             	return false;
            }

		}catch(e){
			return false;
		}
	},


	/**
     * Meteor Method to fetch data to enter live score of a particular tournament-event-matchNumber 
     	(applicable to only live tournament)
     * @collectionName : events (if upcoming tournament)
     	teamMatchCollectionDB (if team event), MatchCollectionDB ( if individual event)
     * @passedByValues : data (contains  tournamentId)
     * @optionalParams : data (contains eventName,match number) 
     * @dataType : json 
     * @dbQuery : insert/update match specific live score
     * @methodDescription :  To enter live score, on selection of tournament, 
     	list of events(which has draws), 
     	list of match number who are yet to play are returned
     	by default first event and first match number will be auto set.
     	Match details containing(players, player score) returned
     * @returnValue : json containing status of the method execution, message
     * Usage - Reporter    
    */
	fetchForLive:async function(data)
	{
		try{
			var resultJson = {};
			var xData = data;
			var tournamentId = xData.tournamentId;
			var matchNumber;
			var tourType = "";
			var checkEvent = events.findOne({"_id":tournamentId});
			if(checkEvent)
				tourType = "upcoming";
			if(checkEvent == undefined)
			{
				checkEvent = pastEvents.findOne({"_id":tournamentId});
				if(checkEvent)
					tourType = "past";
			}

			if(checkEvent)
			{
				var swapInfo = customCollection.findOne({"key":tournamentId,"send":true})
				var eventList1 = [];
				var eventList2 = [];
				if(swapInfo)
				{
					var raw1 = roundRobinEvents.rawCollection();
      				var distinct1 = Meteor.wrapAsync(raw1.distinct, raw1);
					eventList1 = distinct1('eventName',{"tournamentId":tournamentId,"groupDetails.status":"yetToPlay"});

					var raw2 = roundRobinTeamEvents.rawCollection();
      				var distinct2 = Meteor.wrapAsync(raw2.distinct, raw2);
					eventList2 = distinct2('eventName',{"tournamentId":tournamentId,"groupDetails.status":"yetToPlay"});
				}
				else
				{
					var raw1 = teamMatchCollectionDB.rawCollection();
      				var distinct1 = Meteor.wrapAsync(raw1.distinct, raw1);
					eventList1 = distinct1('eventName',{"tournamentId":tournamentId,"matchRecords.status":"yetToPlay"});

					var raw2 = MatchCollectionDB.rawCollection();
      				var distinct2 = Meteor.wrapAsync(raw2.distinct, raw2);
					eventList2 = distinct2('eventName',{"tournamentId":tournamentId,"matchRecords.status":"yetToPlay"});
				}


			

				var eventList3 = eventList1.concat(eventList2);

				var eventList = [];
				if(tourType.toLowerCase() == "upcoming")
				{
					eventList = events.find({"tournamentId":tournamentId,"eventName":{$in:eventList3}},{fields:{"eventName":1,"projectType":1,"tournamentId":1}}).fetch()
				}
				else if(tourType.toLowerCase() == "past")
				{
					eventList = pastEvents.find({"tournamentId":tournamentId,"eventName":{$in:eventList3}},{fields:{"eventName":1,"projectType":1,"tournamentId":1}}).fetch()
				}

				if(eventList.length > 0)
				{
					var curEvent;
					var eventName
					curEvent = eventList[0];
					eventName = curEvent.eventName;


					if(xData.eventName)
					{
						var eventInfo
						if(tourType.toLowerCase() == "upcoming")
						{
							eventInfo = events.findOne({"tournamentId":tournamentId,"eventName":{$in:[xData.eventName]}},{fields:{"eventName":1,"projectType":1,"tournamentId":1}})
						}
						else if(tourType.toLowerCase() == "past")
						{
							eventInfo = pastEvents.findOne({"tournamentId":tournamentId,"eventName":{$in:[xData.eventName]}},{fields:{"eventName":1,"projectType":1,"tournamentId":1}});
						}
						if(eventInfo)
						{
							curEvent = eventInfo;
							eventName = curEvent.eventName;
						}
					}
					

					
					
					
					if(curEvent.projectType && curEvent.projectType == 2)
					{
						var paramData = {};
						paramData["tournamentId"] = tournamentId;
						paramData["eventName"] = eventName;
						if(xData.matchNumber)
							paramData["matchNumber"] = xData.matchNumber
						if(xData.teamSelectionID)
							paramData["teamSelectionID"] = xData.teamSelectionID

					
						if(swapInfo)
						{
							var resultData = fetchLiveRRTeam(paramData);
							if(resultData && resultData.matchRecordInfo && resultData.matchList)
							{
								var matchRecordInfo = resultData.matchRecordInfo;
								var matchList = resultData.matchList;

								var teamAId = "";
								var teamBId = "";
								if(matchRecordInfo.playerAID)
									teamAId = matchRecordInfo.playerAID;
								if(matchRecordInfo.playerBID)
									teamBId = matchRecordInfo.playerBID;
								var teamAPlayers = await Meteor.call("teamPlayersFetch", teamAId, tournamentId);
				      			var teamBPlayers = await Meteor.call("teamPlayersFetch", teamBId, tournamentId);

				      			var liveScoresInfo = liveScores.findOne({
				      				"tournamentId":tournamentId,"eventName":eventName,
				      				"matchNumber":matchNumber,"playerAId":teamAId,"playerBId":teamBId});
								if(liveScoresInfo)
								{
									matchRecordInfo["liveStatus"] = true;
									if(liveScoresInfo.scoresA)
										matchRecordInfo.scoresA = liveScoresInfo.scoresA;
									if(liveScoresInfo.scoresB)
										matchRecordInfo.scoresB = liveScoresInfo.scoresB;
									if(liveScoresInfo.teamMatchDetails)
										matchRecordInfo.teamMatchDetails = liveScoresInfo.teamMatchDetails
								} 
								else
								{
									matchRecordInfo["liveStatus"] = false;

									var rrConfig = roundRobinTemp.findOne({
						                "tournamentId": tournamentId,
						                "eventName":eventName,
						                "teamAID": teamAId,
						                "teamBID":teamBId}
						            );

						            if (rrConfig && rrConfig.matchDetails && rrConfig.matchDetails.length > 0 ) {
											matchRecordInfo.teamMatchDetails = rrConfig.matchDetails;
										var scoreSet = ["0","0","0","0","0","0","0"];
										matchRecordInfo.scoresA =scoreSet;
										matchRecordInfo.scoresB = scoreSet;
						            }

								}

								/*var liveStatusInfo = liveScores.findOne({"tournamentId":tournamentId,"eventName":eventName,"matchNumber":matchNumber,"status":"inprogress"});
								if(liveStatusInfo)
									matchRecordInfo["liveStatus"] = true;
								else 
									matchRecordInfo["liveStatus"] = false;
								*/



								matchRecordInfo["tournamentId"] = tournamentId;
								matchRecordInfo["eventName"] = eventName;
								var selectedTeamID = "";
								if(resultData.selectedTeamID)
									selectedTeamID = resultData.selectedTeamID;

			      				resultJson["status"] = "success";
			      				resultJson["teamIDList"] = matchList;
			      				resultJson["matchRecord"] = matchRecordInfo;
			      				resultJson["eventList"] = eventList;
			      				resultJson["matchNumber"] = matchNumber;
			      				resultJson["selectedTeamID"] = selectedTeamID
			      				resultJson["teamAPlayers"] = teamAPlayers;
			      				resultJson["teamBPlayers"] = teamBPlayers;      				
			      				resultJson["projectType"] = curEvent.projectType;
			      				resultJson["matchSet"] = 7;


			      		

			      				if(matchRecordInfo.scoresA.length != resultJson.matchSet)
			      				{
			      					var scoreLen = matchRecordInfo.scoresA.length;
			      					for(i = scoreLen; i< resultJson.matchSet; i++)
			      					{
			      						matchRecordInfo.scoresA.push("0");
			      						matchRecordInfo.scoresB.push("0");
			      					}
			      				}

			      				resultJson["drawType"] = "roundrobin"

			      				return resultJson;

				      		}
						}
						else
						{
						var resultData = fetchLiveTeam(paramData);

							if(resultData && resultData.matchRecordInfo && resultData.matchList)
							{

								var matchRecordInfo = resultData.matchRecordInfo;
								var matchList = resultData.matchList;
								var teamAId = "";
								var teamBId = "";
								if(matchRecordInfo.playerAID)
									teamAId = matchRecordInfo.playerAID;
								if(matchRecordInfo.playerBID)
									teamBId = matchRecordInfo.playerBID;
								var teamAPlayers = await Meteor.call("teamPlayersFetch", teamAId, tournamentId);
			      				var teamBPlayers = await Meteor.call("teamPlayersFetch", teamBId, tournamentId);
		                    
			                    if(data.matchNumber)
									matchNumber = parseInt(data.matchNumber);
								else
									matchNumber = parseInt(matchList[0]);

								//var liveScoresInfo = liveScores.findOne({"tournamentId":tournamentId,"eventName":eventName,"matchNumber":matchNumber,"status":"inprogress"});

								var liveScoresInfo = liveScores.findOne({"tournamentId":tournamentId,"eventName":eventName,"matchNumber":matchNumber});
								if(liveScoresInfo)
								{
									matchRecordInfo["liveStatus"] = true;
									if(liveScoresInfo.scoresA)
										matchRecordInfo.scoresA = liveScoresInfo.scoresA;
									if(liveScoresInfo.scoresB)
										matchRecordInfo.scoresB = liveScoresInfo.scoresB;
									if(liveScoresInfo.teamMatchDetails)
										matchRecordInfo.teamMatchDetails = liveScoresInfo.teamMatchDetails
								} 
								else
									matchRecordInfo["liveStatus"] = false;

								var liveStatusInfo = liveScores.findOne({"tournamentId":tournamentId,"eventName":eventName,"matchNumber":matchNumber,"status":"inprogress"});
								if(liveStatusInfo)
									matchRecordInfo["liveStatus"] = true;
								else 
									matchRecordInfo["liveStatus"] = false;

								matchRecordInfo["tournamentId"] = tournamentId;
								matchRecordInfo["eventName"] = eventName;


			      				resultJson["status"] = "success";
			      				resultJson["matchList"] = matchList;
			      				resultJson["matchRecord"] = matchRecordInfo;
			      				resultJson["eventList"] = eventList;
			      				resultJson["matchNumber"] = matchNumber;
			      				resultJson["teamAPlayers"] = teamAPlayers;
			      				resultJson["teamBPlayers"] = teamBPlayers;      				
			      				resultJson["projectType"] = curEvent.projectType;
			      				resultJson["matchSet"] = 7;


			      				var matchFormatInfo = MatchTeamCollectionConfig.findOne({"tournamentId":tournamentId,"eventName":eventName});
			      				if(matchFormatInfo && matchFormatInfo.teamFormatId)
			      				{
									var formatInfo = orgTeamMatchFormat.findOne({"_id":matchFormatInfo.teamFormatId})
			      					if(formatInfo && formatInfo.specifications)
			      						resultJson["matchSet"] = formatInfo.specifications.length;
			      				
			      				}

			      				if(matchRecordInfo.scoresA.length != resultJson.matchSet)
			      				{
			      					var scoreLen = matchRecordInfo.scoresA.length;
			      					for(i = scoreLen; i< resultJson.matchSet; i++)
			      					{
			      						matchRecordInfo.scoresA.push("0");
			      						matchRecordInfo.scoresB.push("0");
			      					}
			      				}

			      				return resultJson;

							}	

						}


								
					}
					else if(curEvent.projectType && curEvent.projectType == 1)
					{				
						var paramData = {};
						paramData["tournamentId"] = tournamentId;
						paramData["eventName"] = eventName;
						if(xData.matchNumber)
							paramData["matchNumber"] = xData.matchNumber
						var resultData = fetchLiveIndividual(paramData);

						var matchRecordInfo;
						var matchList = [];
						if(resultData && resultData.matchRecordInfo)
							matchRecordInfo = resultData.matchRecordInfo;
						if(resultData && resultData.matchList)
							matchList = resultData.matchList;

						if(data.matchNumber)
							matchNumber = parseInt(data.matchNumber);
						else
							matchNumber = parseInt(matchList[0]);


						if(matchRecordInfo)
						{
							//var liveScoresInfo = liveScores.findOne({"tournamentId":tournamentId,"eventName":eventName,"matchNumber":matchNumber,"status":"inprogress"});
							var liveScoresInfo = liveScores.findOne({"tournamentId":tournamentId,"eventName":eventName,"matchNumber":matchNumber});
							if(liveScoresInfo)
							{
								matchRecordInfo["liveStatus"] = true;
								if(liveScoresInfo.scoresA)
									matchRecordInfo.scoresA = liveScoresInfo.scoresA;
								if(liveScoresInfo.scoresB)
									matchRecordInfo.scoresB = liveScoresInfo.scoresB;
								if(liveScoresInfo.teamMatchDetails)
									matchRecordInfo.teamMatchDetails = liveScoresInfo.teamMatchDetails
							} 
							else
								matchRecordInfo["liveStatus"] = false;

							var liveStatusInfo = liveScores.findOne({"tournamentId":tournamentId,"eventName":eventName,"matchNumber":matchNumber,"status":"inprogress"});
							if(liveStatusInfo)
								matchRecordInfo["liveStatus"] = true;
							else 
								matchRecordInfo["liveStatus"] = false;


							matchRecordInfo["tournamentId"] = tournamentId;
							matchRecordInfo["eventName"] = eventName;
							resultJson["status"] = "success";
		      				resultJson["matchList"] = matchList;
		      				resultJson["eventList"] =eventList;
		      				resultJson["matchRecord"] = matchRecordInfo;
		      				resultJson["projectType"] = curEvent.projectType;
		      				resultJson["matchNumber"] = matchNumber;
		      				
		      				return resultJson;
						}		
					}
				}
			}
	
		}catch(e){

			errorLog(e)
			var resultJson = {};
			resultJson["status"] = "failure";
			resultJson["message"] = "Could not fetch live data "+e;
			return resultJson;

		}
	},



	/**
     * Meteor Method to add/update live score of a particular tournament-event-matchNumber 
     	(applicable to only live tournament)
     * @collectionName : events (if upcoming tournament)
     	teamMatchCollectionDB (if team event), MatchCollectionDB ( if individual event)
     * @passedByValues : data  (contains  tournamentId,eventName,matchnumber .. so on) 
     * @dataType : json 
     * @dbQuery : insert/update match specific live score
     * @methodDescription :  Reporter can enter match specific live score based on 
     	tournament events and make it live to the entire users
     * @returnValue : json containing status of the method execution, message
     * Usage - Reporter    
    */

	"setLiveScore":function(data)
	{
		var successJson = succesData();
		var failureJson = failureData();
		try{
			if(data)
			{
				var objCheck = Match.test(data, {
					"tournamentId": String,"eventName":String,
					"matchNumber":Number,"roundNumber":Number,
					"status":String,
					"playerAId":String,"playerBId":String,
					"scoresA":[String],"scoresB":[String],
					"teamMatchDetails":Match.Maybe([{
						"matchStatus":String,"matchTitle":String,
						"matchType":String,
						"scoresA":[String],"scoresB":[String],
						"teamAPlayerAID":String,"teamAPlayerAName":String,
						"teamAPlayerBID":String,"teamAPlayerBName":String,
						"teamBPlayerAID":String,"teamBPlayerAName":String,
						"teamNPlayerBID":String,"teamBPlayerBName":String,
					}])
				});
				

				objCheck = true;
				if(objCheck)
				{

					var tourInfo = events.findOne({"_id":data.tournamentId});
					if(tourInfo == undefined)
						tourInfo = pastEvents.findOne({"_id":data.tournamentId});

					if(tourInfo)
					{
						var tournamentId = data.tournamentId.trim();
						var eventName = data.eventName.trim();
						var matchNumber = data.matchNumber;
						var roundNumber = data.roundNumber;
						var roundName = data.roundName.trim();

						var liveScoreExists = liveScores.findOne({
							"tournamentId":tournamentId,
							"eventName":eventName,"matchNumber":matchNumber,
							"roundNumber":roundNumber,"roundName":roundName

						});


						var result = false;
						if(liveScoreExists)
						{
							var dataJson = {};
							dataJson["scoresA"] = data.scoresA;
							dataJson["scoresB"] = data.scoresB;
							dataJson["playerAId"] = data.playerAId;
							dataJson["playerBId"] = data.playerBId;
							dataJson["status"] = data.status;
							if(data.teamMatchDetails)
								dataJson["teamMatchDetails"] = data.teamMatchDetails;
							result =  liveScores.update({"tournamentId":tournamentId,
								"eventName":eventName,
								"matchNumber":matchNumber,
								"roundNumber":roundNumber,"roundName":roundName},
								{$set:dataJson})
							
						}
						else
						{

							var eventInfo = events.findOne({"tournamentId":data.tournamentId,"eventName":data.eventName});
							if(eventInfo == undefined)
								eventInfo = pastEvents.findOne({"tournamentId":data.tournamentId,"eventName":data.eventName});


							if(eventInfo && eventInfo.projectType)
							{
								var dataJson = {};
								dataJson["tournamentId"] = data.tournamentId;
								dataJson["eventName"] = data.eventName;
								dataJson["eventOrganizer"] = tourInfo.eventOrganizer;
								dataJson["projectType"] = eventInfo.projectType;
								dataJson["matchNumber"] = data.matchNumber;
								dataJson["roundNumber"] = data.roundNumber;
								dataJson["roundName"] = data.roundName;
								dataJson["playerAId"] = data.playerAId;
								dataJson["playerBId"] = data.playerBId;
								dataJson["status"] = data.status;
								dataJson["scoresA"] = data.scoresA;
								dataJson["scoresB"] = data.scoresB;
							
								if(data.teamMatchDetails)
									dataJson["teamMatchDetails"] = data.teamMatchDetails;

								

								result = liveScores.insert(dataJson);
							}
							else
							{
								failureJson["message"] = "Invalid tournament event";
								return failureJson;
							}
							
							
						}

						if(result)
						{
							successJson["message"] = "Live Score Updated";
							return successJson;
						}
						else
						{
							failureJson["message"] = "Could not push live score";
							return failureJson;
						}

					}
					else
					{
						failureJson["message"] = "Invalid tournament";
						return failureJson;
					}
				}
				else
				{
					failureJson["message"] = "Require all parameters";
					return failureJson;
				}
			}
			else
			{
				failureJson["message"] = "Require all parameters";
				return failureJson;

			}

		}
		catch(e)
		{
			errorLog(e)
			failureJson["message"] = "Could not set live score"+e;
			return failureJson;
		}
		

		
		
	},

	/**
     * Meteor Method to remove live score of a particular tournament-event-matchNumber 
     	(applicable to only live tournament)
     * @collectionName : events (if upcoming tournament)
     	teamMatchCollectionDB (if team event), MatchCollectionDB ( if individual event)
     * @passedByValues : data  (contains  tournamentId,eventName,matchnumber,status) 
     * @dataType : json 
     * @dbQuery : set match status as completed(inactive) in order to remove from live score
     * @methodDescription :  Reporter would have entered live score on each match (matchnumber) based on 
     	tournament events and once event is been completed, reporter need to remove completed event from live score
     * @returnValue : json containing status of the method execution, message
     * Usage - Reporter    
    */

	"setLiveStatus":function(data)
	{
		var successJson = succesData();
		var failureJson = failureData();
		try{
			if(data)
			{
				var objCheck = Match.test(data, {
					"tournamentId": String,"eventName":String,
					"matchNumber":Number,"status":String,
					"roudName":String
				});
				if(objCheck)
				{
					var tournamentId = data.tournamentId.trim();
					var eventName = data.eventName.trim();
					var matchNumber = data.matchNumber;
					var roudName = data.roudName.trim();

					var liveScoreExists = liveScores.findOne({"tournamentId":tournamentId,
						"eventName":eventName,"matchNumber":matchNumber,"roudName":roudName});
					if(liveScoreExists)
					{
						var result =  liveScores.update({"tournamentId":tournamentId,
							"eventName":eventName,"matchNumber":matchNumber,"roudName":roundName},
							{$set:{"status":data.status}});
						if(result)
						{
							successJson["message"] = "Live score status updated";
							return successJson;
						}
						else
						{
							failureJson["message"] = "Could not update Live score status";
							return failureJson;
						}
					}
					else
					{
						failureJson["message"] = "Live score doesnt exist";
						return failureJson;
					}

				}
				else
				{
					failureJson["message"] = "Require all parameters";
					return failureJson;
				}
			}
			else
			{
				failureJson["message"] = "Require all parameters";
				return failureJson;
			}

		}catch(e)
		{
			failureJson["message"] = "Could not set live status"+e;
			return failureJson;
		}
	}

	

});
