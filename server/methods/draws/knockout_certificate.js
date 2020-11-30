import { MatchCollectionDB }from '../../publications/MatchCollectionDb.js';
import { teamMatchCollectionDB } from '../../publications/MatchCollectionDbTeam.js';

Meteor.methods({

	'participation_certificate': async function(tournamentId,categoryEvent, playerID,player) {
        try {
            if (Meteor.isServer) 
            {
                var webshot = Meteor.npmRequire('webshot');
                var fs = Npm.require('fs');
                var Future = Npm.require('fibers/future');
                var fut = new Future();
                var fileName = "participation_certificate.pdf";
                var css = Assets.getText('style.css');
                SSR.compileTemplate('layout', Assets.getText('layout.html'));
                Template.layout.helpers({
                    getDocType: function() {
                        return "<!DOCTYPE html>";
                    }
                });

                SSR.compileTemplate('participation_certificate', Assets.getText('participation_certificate.html'));
                var tournamentName = "";
                var tournamentInfo = "";
                var tournamentVenue = "";
                var tournamentAddress = "";
                var tournamentStartDate = "";
                var tournamentEndDate = "";
                var eventStartDate = "";
                var eventEndDate = "";
                var venue = "";
                var address = "";
                var sponsorLogo = "";
                var eventOrganizer = "";
                var projectType = undefined;

                tournamentInfo = tourExists(tournamentId);
                
                	
                if(tournamentInfo)
                {
                    eventInfo = tourCategoryExists(tournamentId,categoryEvent)
                   
                    if(eventInfo && eventInfo.projectType)
                    {   
                        projectType = eventInfo.projectType;
                    }
                	if(tournamentInfo.eventName)
                		tournamentName = tournamentInfo.eventName;
					if(tournamentInfo.venueAddress)
					{
						tournamentVenue = tournamentInfo.venueAddress;  
						venue = tournamentInfo.venueAddress;
					}
					if(tournamentInfo.domainName)
					{
						tournamentAddress = tournamentInfo.domainName;
						address = tournamentInfo.domainName;
					}
					if(tournamentInfo.eventStartDate)
					{
						tournamentStartDate = tournamentInfo.eventStartDate;
						eventStartDate = tournamentInfo.eventStartDate;
					}
					if(tournamentInfo.eventEndDate)
					{
						tournamentEndDate = tournamentInfo.eventEndDate;
						eventEndDate = tournamentInfo.eventEndDate;
					}
					if(tournamentInfo.sponsorLogo)
					 	sponsorLogo =tournamentInfo.sponsorLogo;

                }

                var eventResults = [];

                var ind_entry = MatchCollectionDB.aggregate([
                	{$match:{
                		"tournamentId":tournamentId,           
                	}},
                	{$unwind:"$matchRecords"},
                	{$match:{
                		$or:[
                		{"matchRecords.playersID.playerAId":playerID},
                		{"matchRecords.playersID.playerBId":playerID}]
                	}},
                	{$group:{
                		"_id":"$eventName",
                		"eventName":{$first:"$eventName"},
                		"matchNumber":{$last:"$matchRecords.matchNumber"},
                		"roundNumber":{$last:"$matchRecords.roundNumber"},
                		"roundName":{$last:"$matchRecords.roundName"},

                	}},
                	{$project:{
                		"eventName":1,
                		"matchNumber":1,
                		"roundNumber":1,
                		"roundName":1,
                		"_id":0
                	}}
                ])


				var teamList = playerTeams.aggregate([
					{$match:{
						$or:[
							{"teamManager":playerID},
							{
								"teamMembers": { $elemMatch: {"playerId": playerID}},
							}
						]
					}},
					{$group:{"_id":null,
					        "teamID":{$push:"$_id"}

					    }},		
					
	            ]);
                var team_entry = [];
	            if(teamList.length > 0 && teamList[0] && teamList[0].teamID)
	            {
	            	var teamID = teamList[0].teamID;
	            	team_entry = teamMatchCollectionDB.aggregate([
	                	{$match:{
	                		"tournamentId":tournamentId,           
	                	}},
	                	{$unwind:"$matchRecords"},
	                	{$match:{
	                		$or:[
	                		{"matchRecords.teamsID.teamAId":{"$in":teamID}},
	                		{"matchRecords.teamsID.teamBId":{"$in":teamID}}]
	                	}},
	                	{$group:{
	                		"_id":"$eventName",
	                		"eventName":{$first:"$eventName"},
	                		"matchNumber":{$last:"$matchRecords.matchNumber"},
	                		"roundNumber":{$last:"$matchRecords.roundNumber"},
	                		"roundName":{$last:"$matchRecords.roundName"},

	                	}},
	                	{$project:{
	                		"eventName":1,
	                		"matchNumber":1,
	                		"roundNumber":1,
	                		"roundName":1,
	                		"_id":0
	                	}}
                	]);

	            }




               	var eventResults = [];
               	eventResults = ind_entry.concat(team_entry);
               
               
          

                var sponsorLogoURL = eventUploads.find({
                    "_id": sponsorLogo
                }).fetch();
                var absoluteUrl = Meteor.absoluteUrl().toString();
                var absoluteUrlString = absoluteUrl.substring(0, absoluteUrl.lastIndexOf("/"));
                var playerName = "";
                var dob = undefined;
                var userInfo = Meteor.users.findOne({"userId":playerID});
                if(userInfo)
                {
                	playerName = userInfo.userName;
                	var dbsrequired = ["userDetailsTT"];

		            var res = await Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
		            if (res && res && res.changedDbNames && res.changedDbNames.length) 
		            {
		                var detailInfo = global[res.changedDbNames[0]].findOne({
		                    "userId": playerID 
		                })
		                if(detailInfo && detailInfo.dateOfBirth)
		                {
							dob = moment(new Date(detailInfo.dateOfBirth)).format("DD MMM YYYY")
		                }

		            }
                }
                else if(userInfo == undefined)
                {
                    playerName = player;
                }

                if(projectType != undefined)
                {
                    if(projectType == 1 || projectType == "1")
                    {
                        type = "Player";
                    }
                    else if(projectType == 2 || projectType == "2")
                    {
                        type="Team";
                        team_entry = teamMatchCollectionDB.aggregate([
                            {$match:{
                                "tournamentId":tournamentId,           
                            }},
                            {$unwind:"$matchRecords"},
                            {$match:{
                                $or:[
                                {"matchRecords.teamsID.teamAId":{"$in":[playerID]}},
                                {"matchRecords.teamsID.teamBId":{"$in":[playerID]}}]
                            }},
                            {$group:{
                                "_id":"$eventName",
                                "eventName":{$first:"$eventName"},
                                "matchNumber":{$last:"$matchRecords.matchNumber"},
                                "roundNumber":{$last:"$matchRecords.roundNumber"},
                                "roundName":{$last:"$matchRecords.roundName"},

                            }},
                            {$project:{
                                "eventName":1,
                                "matchNumber":1,
                                "roundNumber":1,
                                "roundName":1,
                                "_id":0
                            }}
                        ]);
                        eventResults = ind_entry.concat(team_entry);

                    }
                }

                var eventValues = "";
                for(var x=0; x<eventResults.length;x++)
                {
                    eventValues += eventResults[x].eventName;
                    if(x != (eventResults.length-1))
                        eventValues += ", ";
                }

                var data = {
                    "player": playerName,
                    "tournamentName": tournamentName.toUpperCase(),
                    "eventStartDate": reverseDate(eventStartDate),
                    "eventEndDate": reverseDate(eventEndDate),
                    "venue": venue,
                    "address": address,
                    "imageURL": absoluteUrlString,
                    "sponsorLogoURL": sponsorLogoURL,
                    "eventResults":eventResults,
                    "type":type

                }

                if(eventValues.length > 0)
                {
                    data["eventValues"] = eventValues;
                }

               

                if(tournamentInfo.eventOrganizer)
                {
                	eventOrganizer = tournamentInfo.eventOrganizer;
                	var organizerInfo = Meteor.users.findOne({"userId":eventOrganizer});
                	if(organizerInfo) 
                    {
                        data["organizer"] = organizerInfo.userName.toUpperCase();                       
                        var apiInfo = apiUsers.findOne({"userId":eventOrganizer});
                        if(apiInfo && apiInfo.siteImg)
                            data["siteImg"] = apiInfo.siteImg;
                        //else
                           // data["siteImg"] = "logo.png"

                        //data["siteImg"] = "logo.png"
                    }  
                
                }
                if(dob != undefined)
                {
                	data["playerDOB"] = dob;
                }



                var html_string = SSR.render('layout', {
                    css: css,
                    template: "participation_certificate",
                    data: data
                });

                var options = {
                    "paperSize": {
                        "format": "A4",
                        "orientation": "landscape",
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
        } catch (e) {
            errorLog(e)
        }
    },
    'generate_certificate':async function(tournamentId, eventName, playerID, player, eventType) {
        try 
        {
            if (Meteor.isServer) {
                var webshot = Meteor.npmRequire('webshot');
                var fs = Npm.require('fs');
                var Future = Npm.require('fibers/future');
                var fut = new Future();
                var fileName = "certificate.pdf";
                var css = Assets.getText('style.css');
                SSR.compileTemplate('layout', Assets.getText('layout.html'));
                Template.layout.helpers({
                    getDocType: function() {
                        return "<!DOCTYPE html>";
                    }
                });

                SSR.compileTemplate('certificate', Assets.getText('certificate.html'));
                var tournamentName = "";
                var tournamentVenue = "";
                var tournamentAddress = "";
                var tournamentStartDate = "";
                var tournamentEndDate = "";
                var eventStartDate = "";
                var eventEndDate = "";
                var venue = "";
                var address = "";
                var sponsorLogo = "";
                var eventInfo = undefined;
                var tournamentInfo = tourExists(tournamentId);
                if(tournamentInfo)
                    eventInfo = tourCategoryExists(tournamentId,eventName);


                if(tournamentInfo && eventInfo)
                {
                    if(tournamentInfo.eventName)
                        tournamentName = tournamentInfo.eventName;
                    if(tournamentInfo.venueAddress)
                    {
                        venue = tournamentInfo.venueAddress;
                        tournamentVenue = tournamentInfo.venueAddress;
                    }
                    if(tournamentInfo.domainName){
                        address = tournamentInfo.domainName;
                        venueAddress = tournamentInfo.domainName;
                        tournamentAddress = tournamentInfo.domainName
                    }
                    if(tournamentInfo.eventStartDate)
                        tournamentStartDate = tournamentInfo.eventStartDate;
                    if(tournamentInfo.eventEndDate)
                        tournamentEndDate = tournamentInfo.eventEndDate;
                    if(tournamentInfo.sponsorLogo)
                        sponsorLogo = tournamentInfo.sponsorLogo;

                    if(eventInfo.eventStartDate)
                        eventStartDate = eventInfo.eventStartDate;
                    if(eventInfo.eventEndDate)
                        eventEndDate = eventInfo.eventEndDate;


                    var matchRecordObj = MatchCollectionDB.findOne({
                        "tournamentId": tournamentId,
                        "eventName": eventName
                    });

                
                    if (matchRecordObj) 
                    {
                        var matchRecords = matchRecordObj.matchRecords;
                        var maxRound = "";
                        var maxRoundName = "";
                        var maxWinnerID = "";
                        if (matchRecords) {
                            for (var i = 0; i < matchRecords.length; i++) 
                            {
                                if (matchRecords[i].playersID.playerAId == playerID) {
                                    maxRound = matchRecords[i].roundNumber;
                                    maxWinnerID = matchRecords[i].winnerID;
                                } else if (matchRecords[i].playersID.playerBId == playerID) {
                                    maxRound = matchRecords[i].roundNumber;
                                    maxWinnerID = matchRecords[i].winnerID;
                                }
                            }
                        }
                    }
                    else if(matchRecordObj == undefined)
                    {
                        matchRecordObj = teamMatchCollectionDB.findOne({
                            "tournamentId": tournamentId,
                            "eventName": eventName
                        });
                        if(matchRecordObj)
                        {
                            var matchRecords = matchRecordObj.matchRecords;
                            var maxRound = "";
                            var maxRoundName = "";
                            var maxWinnerID = "";
                            if (matchRecords) {
                                for (var i = 0; i < matchRecords.length; i++) 
                                {
                                    if (matchRecords[i].teamsID.teamAId == playerID) {
                                        maxRound = matchRecords[i].roundNumber;
                                        maxWinnerID = matchRecords[i].winnerID;
                                    } else if (matchRecords[i].teamsID.teamBId == playerID) {
                                        maxRound = matchRecords[i].roundNumber;
                                        maxWinnerID = matchRecords[i].winnerID;
                                    }
                                }
                            }
                        }
                    }


                    var checkType = "";
                    var roundValuesObj = MatchCollectionConfig.findOne({
                        "tournamentId": tournamentId,
                        "eventName": eventName
                    });
                    if(roundValuesObj == undefined)
                    {
                        roundValuesObj = MatchTeamCollectionConfig.findOne({
                            "tournamentId": tournamentId,
                            "eventName": eventName
                        });
                        if(roundValuesObj)
                            checkType = "team";
                    }
                    else
                        checkType = "individual";
                    var mx = "";
                    var posRound = "";
                    var roundValues = "";

                    if (roundValuesObj) 
                    {
                        if(checkType == "individual")
                            roundValues = MatchCollectionConfig.findOne({
                                "tournamentId": tournamentId,
                                "eventName": eventName
                            }).roundValues;
                        else if(checkType == "team")
                            roundValues = MatchTeamCollectionConfig.findOne({
                                "tournamentId": tournamentId,
                                "eventName": eventName
                            }).roundValues;
                        if(roundValues && roundValues.length > 0)
                        {
                            if(checkType == "individual")
                            {
                                mx = parseInt(roundValues.length) - parseInt(1);
                                posRound = roundValues[mx - 1].roundNumber;
                            }
                            else if(checkType == "team")
                            {
                                mx = parseInt(roundValues.length);
                                posRound = roundValues[mx - 1].roundNumber;
                            }
                            
                        }
                        
                    }

                    var playerStatus = "";
                    var winnerTemplate = false;
                    var runnerTemplate = false;
                    var genericTemplate = false;
                    if (maxRound == posRound) {
                        if (maxWinnerID == playerID) {
                            playerStatus = "Winner";
                            winnerTemplate = true;
                        } else {
                            playerStatus = "Runner";
                            runnerTemplate = true;
                        }
                    } else {
                        playerStatus = "General";
                        genericTemplate = true;
                    }

                    for (var i = 0; i < roundValues.length; i++) 
                    {
                        if (roundValues[i].roundNumber == maxRound) {
                            maxRoundName = roundValues[i].roundName;
                        }
                    }

                    var dispEventName = eventName;
                    if(eventName != null)
                    {
                        var schoolEvents = schoolEventsToFind.findOne({});
                        if(schoolEvents && schoolEvents.teamEventNAME && schoolEvents.dispNamesTeam)
                        {
                            var indexPos = _.indexOf(schoolEvents.teamEventNAME,eventName);
                            if(indexPos > -1 && schoolEvents.dispNamesTeam[indexPos] != undefined)
                                dispEventName = schoolEvents.dispNamesTeam[indexPos];                        
                        }                         
                    }


                    var sponsorLogoURL = eventUploads.find({
                        "_id": sponsorLogo
                    }).fetch();
                    var absoluteUrl = Meteor.absoluteUrl().toString();
                    var absoluteUrlString = absoluteUrl.substring(0, absoluteUrl.lastIndexOf("/"));
                    var data = {
                        "player": player,
                        "eventName": dispEventName,
                        "eventStartDate": reverseDate(eventStartDate),
                        "eventEndDate": reverseDate(eventEndDate),
                        "venue": venue,
                        "address": address,
                        "tournamentName": tournamentName.toUpperCase(),
                        "tournamentVenue": tournamentVenue,
                        "tournamentAddress": tournamentAddress,
                        "tournamentStartDate": reverseDate(tournamentStartDate),
                        "tournamentEndDate": reverseDate(tournamentEndDate),
                        "maxRoundName": maxRoundName,
                        "imageURL": absoluteUrlString,
                        "sponsorLogoURL": sponsorLogoURL,
                        "playerStatus": playerStatus,
                        "winnerTemplate": winnerTemplate,
                        "runnerTemplate": runnerTemplate,
                        "genericTemplate": genericTemplate
                    }

                    var dob = undefined;
                    var userInfo = Meteor.users.findOne({"userId":playerID});
                    if(userInfo)
                    {
                        playerName = userInfo.userName;
                        var dbsrequired = ["userDetailsTT"];

                        var res = await Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
                        if (res && res && res.changedDbNames && res.changedDbNames.length) 
                        {
                            var detailInfo = global[res.changedDbNames[0]].findOne({
                                "userId": playerID 
                            })
                            if(detailInfo && detailInfo.dateOfBirth)
                            {
                                dob = moment(new Date(detailInfo.dateOfBirth)).format("DD MMM YYYY")
                            }

                        }

                    }
                    if(tournamentInfo.eventOrganizer)
                    {
                        eventOrganizer = tournamentInfo.eventOrganizer;
                        var organizerInfo = Meteor.users.findOne({"userId":eventOrganizer});
                        if(organizerInfo) 
                        {
                            data["organizer"] = organizerInfo.userName.toUpperCase();                       
                            var apiInfo = apiUsers.findOne({"userId":eventOrganizer});
                            if(apiInfo && apiInfo.siteImg)
                                data["siteImg"] = apiInfo.siteImg;
                            //else
                              // data["siteImg"] = "logo.png"

                            //data["siteImg"] = "logo.png"
                        }  
                    
                    }
                    if(dob != undefined)
                    {
                        data["playerDOB"] = dob;
                    }


                    var html_string = SSR.render('layout', {
                        css: css,
                        template: "certificate",
                        data: data
                    });

                    // Setup Webshot options
                    var options = {
                        "paperSize": {
                            "format": "A4",
                            "orientation": "landscape",
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
        } catch (e) {
            errorLog(e)
        }
    },
})