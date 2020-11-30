import { MatchCollectionDB } from '../../publications/MatchCollectionDb.js';
import { teamMatchCollectionDB } from '../../publications/MatchCollectionDbTeam.js';
import {playerDBFind} from '../dbRequiredRole.js'

Meteor.methods({
    
    'blankTeamDetailScoreSheet': function(tournamentId, eventName) {
        try{
            if (Meteor.isServer) 
            {
                var webshot = Meteor.npmRequire('webshot');
                var fs = Npm.require('fs');
                var Future = Npm.require('fibers/future');
                var fut = new Future();
                var fileName = "blankTeamDetailScoreSheet.pdf";
                var css = Assets.getText('style.css');
                SSR.compileTemplate('layout', Assets.getText('layout.html'));
                Template.layout.helpers({
                    getDocType: function() {
                        return "<!DOCTYPE html>";
                    },

                });

                SSR.compileTemplate('blankTeamDetailScoreSheet', Assets.getText('blankTeamDetailScoreSheet.html'));
                var tournamentInfo = tourExists(tournamentId);

                var tournamentName = "";
                var tournamentVenue = "";
                var tournamentAddress = "";
                var eventStartDate = "";
                var eventEndDate = "";
                var organizer = "";


                if(tournamentInfo)
                {
                    if(tournamentInfo.eventName)
                        tournamentName = tournamentInfo.eventName;
                    if(tournamentInfo.venueAddress)
                        tournamentVenue = tournamentInfo.venueAddress;
                    if(tournamentInfo.domainName)
                        tournamentAddress = tournamentInfo.domainName;
                    if(tournamentInfo.eventStartDate)
                        eventStartDate = tournamentInfo.eventStartDate;
                    if(tournamentInfo.eventEndDate)
                        eventEndDate = tournamentInfo.eventEndDate;
                    if(tournamentInfo.eventOrganizer)
                    {
                        var userInfo = Meteor.users.findOne({"userId":tournamentInfo.eventOrganizer});
                        if(userInfo)
                            organizer = userInfo.userName;
                    }
                   
                    var eventInfo = tourCategoryExists(tournamentId,eventName);

                    
                    if(eventInfo)
                    {
                        if(eventInfo.eventStartDate)
                            eventStartDate =  eventInfo.eventStartDate;
                        if(eventInfo.eventEndDate)
                            eventEndDate = eventInfo.eventEndDate;
                    }
                }

                var data = {
                    "eventName": eventName,
                    "tournamentName": tournamentName,
                    "eventStartDate": reverseDate(eventStartDate),
                    "eventEndDate": reverseDate(eventEndDate),
                    "tournamentVenue": tournamentVenue,
                    "tournamentAddress": tournamentAddress,
                }
                if(organizer != "" && organizer != undefined && organizer != null)
                    data["organizer"] = organizer;
                var html_string = SSR.render('layout', {
                    css: css,
                    template: "blankTeamDetailScoreSheet",
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
                    if(err){
                    }
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
        }catch(e){
            errorLog(e)
        }
    },

	'matchRecords/generate_blankScoreSheet': function(tournamentId, eventName, matchNumber, roundNumber, tourType) {
        try{
        	if (Meteor.isServer) 
        	{
	            var webshot = Meteor.npmRequire('webshot');
	            var fs = Npm.require('fs');
	            var Future = Npm.require('fibers/future');
	            var fut = new Future();
	            var fileName = "printBlankScoreSheet.pdf";
	            var css = Assets.getText('style.css');
	            SSR.compileTemplate('layout', Assets.getText('layout.html'));
	            Template.layout.helpers({
	                getDocType: function() {
	                    return "<!DOCTYPE html>";
	                },

	            });

	            SSR.compileTemplate('printBlankScoreSheet', Assets.getText('printBlankScoreSheet.html'));
	            var tournamentInfo = tourExists(tournamentId);

	            var tournamentName = "";
	            var tournamentVenue = "";
	            var tournamentAddress = "";
	            var eventStartDate = "";
	            var eventEndDate = "";


	            if(tournamentInfo)
	            {
	                if(tournamentInfo.eventName)
	                    tournamentName = tournamentInfo.eventName;
	                if(tournamentInfo.venueAddress)
	                    tournamentVenue = tournamentInfo.venueAddress;
	                if(tournamentInfo.domainName)
	                    tournamentAddress = tournamentInfo.domainName;
	                if(tournamentInfo.eventStartDate)
	                    eventStartDate = tournamentInfo.eventStartDate;
	                if(tournamentInfo.eventEndDate)
	                    eventEndDate = tournamentInfo.eventEndDate;
	               
	                var eventInfo = tourCategoryExists(tournamentId,eventName);
	                if(eventInfo)
	                {
	                    if(eventInfo.eventStartDate)
	                        eventStartDate =  eventInfo.eventStartDate;
	                    if(eventInfo.eventEndDate)
	                        eventEndDate = eventInfo.eventEndDate;
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

	            var matchRecords = [0, 1, 2];
	            var data = {
	                "matchRecords": matchRecords,
	                "eventName": dispEventName,
	                "tournamentName": tournamentName,
	                "eventStartDate": reverseDate(eventStartDate),
	                "eventEndDate": reverseDate(eventEndDate),
	                "tournamentVenue": tournamentVenue,
	                "tournamentAddress": tournamentAddress,
	            }

	            var html_string = SSR.render('layout', {
	                css: css,
	                template: "printBlankScoreSheet",
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
	                if(err){
	                }
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
    	}catch(e){}
    },
    'matchRecords/generate_scoreSheet': async function(tournamentId, eventName, matchNumber, roundNumber, tourType) 
    {
       if (Meteor.isServer) {
            try 
            {
                var dbsrequired = ["playerEntries"]
                var userDetailsTT = "userDetailsTT"
                var playerEntries = "playerEntries"

                if (tournamentId) {

                    var tournamentFind = tourExists(tournamentId);
                   
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
                    }
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
                    },
                    headerName: function() {
                        return "NAME OF THE PLAYER"
                    }
                });

                SSR.compileTemplate('printScoreSheet', Assets.getText('printScoreSheet.html'));
                Template.printScoreSheet.helpers({
                    "fetchRoundName":function(roundNumber,roundName)
                    {
                        if(roundNumber != undefined)
                        {
                            if(roundName != undefined)
                            {
                                if(roundName == "PQF" || roundName == "QF" || roundName == "SF" || roundName == "F")
                                    return roundName;
                                else
                                    return roundNumber;
                            }
                            else
                                return roundNumber;

                        }
                    },
                    "titleCase":function(playerName)
                    {
                        if(strTrim(playerName) == "()")
                            return " ";
                        else
                            return titleCase(playerName);
                    }
                })
            

            
                var matchQuery = {"tournamentId":tournamentId,"eventName":eventName};
                var groupQuery = {};
                    
                if(matchNumber != "" && roundNumber != "")
                {
                    matchQuery["matchRecords.matchNumber"] = parseInt(matchNumber);
                    matchQuery["matchRecords.roundNumber"] = parseInt(roundNumber);

                    groupQuery["matchRecords.matchNumber"] = parseInt(matchNumber);
                    groupQuery["matchRecords.roundNumber"] = parseInt(roundNumber)

                }
                else if (matchNumber == "" && roundNumber != "")
                {
                    matchQuery["matchRecords.roundNumber"] =  parseInt(roundNumber); 
                    groupQuery["matchRecords.roundNumber"] =  parseInt(roundNumber); 
                    groupQuery["matchRecords.status2"] = {$nin:["bye"]};
           
                }
                else if(matchNumber != "" && roundNumber == ""){

                    matchQuery["matchRecords.matchNumber"] = parseInt(matchNumber);
                    groupQuery["matchRecords.matchNumber"] =  parseInt(matchNumber); 

                }
               
                var matchRecords = [];
                if(matchNumber != "" || roundNumber != "")
                {
                    var matchData = MatchCollectionDB.aggregate([
                        {$match:matchQuery},
                        {$unwind:"$matchRecords"},
                        {$match:groupQuery},
                        {$group:{"_id":"$_id",
                             "matchRecords": {$push:"$matchRecords"},
                        }},
                        {$project: {
                            'matchRecords': 1
                        }}
                    ]);
                    if(matchData && matchData.length > 0 && matchData[0].matchRecords)
                        matchRecords = matchData[0].matchRecords;

                }
                else
                {
                    var matchData = MatchCollectionDB.findOne(matchQuery);
                    if(matchData && matchData.matchRecords)
                        matchRecords = matchData.matchRecords;
                }

                if (matchRecords.length == 0)
                    return "emptydata";
                var playersDue = [];
                var emptyPlayers = [];
                for (var s = matchRecords.length - 1; s >= 0; s--) 
                {

                    if(matchRecords[s].roundName=="BM"){
                        matchRecords[s].roundName = "Bronze Round"
                        matchRecords[s].matchNumber = ""
                    }

                    else if(matchRecords[s].roundName  == "PQF" || matchRecords[s].roundName == "QF" || 
                        matchRecords[s].roundName == "SF" || matchRecords[s].roundName == "F")
                    {
                        matchRecords[s].roundName = "Round : " + matchRecords[s].roundName
                        matchRecords[s].matchNumber = "Match : " + matchRecords[s].matchNumber
                    }
                    else{
                        matchRecords[s].roundName = "Round : " + matchRecords[s].roundNumber
                        matchRecords[s].matchNumber = "Match : " + matchRecords[s].matchNumber
                    }
                
                    var players = matchRecords[s].playersID;
                    var playerA;
                    var playerB;

                    var playerADue = global[playerEntries].findOne({
                        "tournamentId": tournamentId,
                        "playerId": players.playerAId,
                        "paidOrNot": true
                    });
                    var playerBDue = global[playerEntries].findOne({
                        "tournamentId": tournamentId,
                        "playerId": players.playerBId,
                        "paidOrNot": true
                    });
                    if (matchRecords[s].status2 == "bye") {
                        var propogatePlayerID = matchRecords[s].propogatePlayerID;
                        var playerDue = global[playerEntries].findOne({
                            "tournamentId": tournamentId,
                            "playerId": propogatePlayerID,
                            "paidOrNot": true
                        });
                        if (playerDue == undefined) {
                            matchRecords.splice(s, 1);
                            if (playerDue == undefined && propogatePlayerID != "") {
                                var propogateplayerInfo = Meteor.users.findOne({
                                    "userId": propogatePlayerID
                                });
                                if (propogateplayerInfo)
                                    playersDue.push(propogateplayerInfo.userName);
                            }
                        }

                    } else if (matchRecords[s].status2 != "bye") {
                        var playerADue = global[playerEntries].findOne({
                            "tournamentId": tournamentId,
                            "playerId": players.playerAId,
                            "paidOrNot": true
                        });
                        var playerBDue = global[playerEntries].findOne({
                            "tournamentId": tournamentId,
                            "playerId": players.playerBId,
                            "paidOrNot": true
                        });
                        if (playerADue == undefined || playerBDue == undefined) {
                            matchRecords.splice(s, 1);
                            var playerAInfo = Meteor.users.findOne({
                                "userId": players.playerAId
                            });
                            var playerBInfo = Meteor.users.findOne({
                                "userId": players.playerBId
                            });
                            if (playerAInfo) playerA = playerAInfo.userName;
                            if (playerBInfo) playerB = playerBInfo.userName;
                            if (playerADue == undefined && players.playerAId != "") playersDue.push(playerA);
                            if (playerBDue == undefined && players.playerBId != "") playersDue.push(playerB);
                            if (playerADue == undefined && players.playerAId == "") emptyPlayers.push(s);
                            if (playerBDue == undefined && players.playerBId == "") emptyPlayers.push(s);
                        }
                    }
                }


                var playersDueJson = {};
                playersDueJson["due"] = playersDue;
                playersDueJson["empty"] = emptyPlayers.length;

                if ((playersDue.length > 0 || emptyPlayers.length > 0) && matchRecords.length == 0)
                    return playersDueJson;

                if (matchRecords.length > 0) {
                   
                    var tournamentName = "";
                    var eventStartDate = "";
                    var eventEndDate = "";
                    var tournamentVenue = "";
                    var tournamentAddress = "";
                    var tournamentInfo = tourExists(tournamentId);
                   
		            if(tournamentInfo)
		            {
		                if(tournamentInfo.eventName)
		                    tournamentName = tournamentInfo.eventName;
		                if(tournamentInfo.venueAddress)
		                    tournamentVenue = tournamentInfo.venueAddress;
		                if(tournamentInfo.domainName)
		                    tournamentAddress = tournamentInfo.domainName;
		                if(tournamentInfo.eventStartDate)
		                    eventStartDate = reverseDate(tournamentInfo.eventStartDate);
		                if(tournamentInfo.eventEndDate)
		                    eventEndDate = reverseDate(tournamentInfo.eventEndDate);
		               
		                var eventInfo = tourCategoryExists(tournamentId,eventName);  
		                if(eventInfo)
		                {
		                    if(eventInfo.eventStartDate)
		                        eventStartDate =  eventInfo.eventStartDate;
		                    if(eventInfo.eventEndDate)
		                        eventEndDate = eventInfo.eventEndDate;
		                }
		            }

                   

                    var data = {
                        "matchRecords": matchRecords,
                        "eventName": eventName,
                        "tournamentName": tournamentName,
                        "eventStartDate": reverseDate(eventStartDate),
                        "eventEndDate": reverseDate(eventEndDate),
                        //venue: venue,
                        //address: address,
                        "tournamentVenue": tournamentVenue,
                        "tournamentAddress":tournamentAddress,
                        "headerName": "NAME OF THE PLAYER"
                    }

                    var html_string = SSR.render('layout', {
                        css: css,
                        template: "printScoreSheet",
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
            } catch (e) {
                errorLog(e)
            }
        }

    },
})