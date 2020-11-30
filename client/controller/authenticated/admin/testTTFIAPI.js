import {
    HTTP
}
from 'meteor/http'

Template.testTTFIAPI.onCreated(function() {
    this.subscribe("onlyLoggedIn")
    this.subscribe("authAddress");

});

Template.testTTFIAPI.onRendered(function() {

    Session.set("exampleJson", undefined);
    Session.set("resultJson",undefined);
});

Template.testTTFIAPI.helpers({
    "notAdmin": function() {
        try {
            var emailAddress = Meteor.user().emails[0].address;
            var boolVal = false
            var auth = authAddress.find({}).fetch();
            if (auth) {
                for (var i = 0; i < auth.length; i++) {
                    if (emailAddress && emailAddress == auth[i].data) {
                        boolVal = false;
                    } else {
                        boolVal = true;
                        break;
                    }
                };
            }
            return false;
            //return boolVal
        } catch (e) {}
    },
    "apiList": function() {
        try {
            //"viewTeams","deleteTeam",
            var listOfApi = [
            "typeBasedTeams",
            "fetchTeamPoints",
            "fetchTeamSchedule",
            "viewPlayerTeam",
            "validatePromo",
            "liveTourSubscription",
            "diaryAnalysis",
            "diaryPerformAnalysis",
            "fetchFitbitData",
            "upsertDrill","removeDrill","fetchDrill","dataToAssignDrill","assignDrill",
            "createAnalyticsRequest",
            "fetchAnalyticsRequest",
            "cancelAnalyticsRequest",
            "downloadAnalyticsRequestPdf",
            "fetchRequestUser",


            "tourCreationDetails","createTour","fetchTourDetails",
            "deleteTour","modifyTour","fetchTeamFormatList","fetchPlayersOnTeamFormat",
            "createTFTeam",
            "deleteTFTeam","modifyTFTeam","viewTFTeam","fetchTFTeams",
            "downloadTourDraws",
            "fetchTourEventDraw","resetTourEventDraw","fetchEmptyDraws",
            "fetchTourDrawEventList","setRRPoints","setRRStanding",
            "fetchRRWinnerEntries","fetchMatchDetails",
            "setMatchDetails","createRRDraws","createKODraws",
            "fetchBlankScore","fetchScoreSheet",
            "fetchLeaveRequest",
            "fetchPlayerEntries","fetchPlayerTeamEntries",
            "fetchAcademyEntries","fetchDAEntries",
            "entryPayReceipt","fetchPaidPlayers","fetchSubscribers",
            "generateDrawReceipt",
            "getAllTourParticipations",

            ];
            return listOfApi;
        } catch (e) {

        }
    },
    "sampleJson": function() {
        if (Session.get("exampleJson")) {
            return Session.get("exampleJson");
        }

    },
    "resultJson":function()
    {
        if(Session.get("resultJson"))
            return Session.get("resultJson");
    }

});


Template.testTTFIAPI.events({

    "change [name=addFile]":function(e)
    {
        var xData = {};
        var apiSelected = $("[name='apiList'] option:selected").attr("name");
        if(apiSelected == "createRRDraws")
        {
            xData = {
                "tournamentId":"LknFBz93BDHfJmEju",
                "eventName":"Cadet Boy's Singles",
                "userId":"ZoXoSjSFC9Zm9XZPw",
                "maxMembers":5,
            }

            var fileHandle = $("#addFile").prop("files")[0];
            Papa.parse(fileHandle, {
              header: true,
              keepEmptyRows:false,
              skipEmptyLines: true,
              complete: function(fileData, file){
                var data = fileData.data;
                console.log("fileData data "+JSON.stringify(data));
                xData["fileData"] = data;
                $("#inputJson").val(JSON.stringify(xData));
                Session.set("exampleJson", JSON.stringify(xData));
              }
            });


        }

       
        else if(apiSelected == "createKODraws")
        {
            xData = {
                "tournamentId":"LknFBz93BDHfJmEju",
                "eventName":"Senior Boy's Singles",
                "userId":"ZoXoSjSFC9Zm9XZPw",
                "knockoutType":"readymade",
            }
            var fileHandle = $("#addFile").prop("files")[0];
            var roundValues = [
            {"roundNumber":1,"roundName":"Quarter Final","noofSets":5,
            "minScores":6,"minDifference":2,"points":10},
            {"roundNumber":2,"roundName":"Semi Final","noofSets":5,
            "minScores":6,"minDifference":2,"points":10},
            {"roundNumber":3,"roundName":"Final","noofSets":5,
            "minScores":6,"minDifference":2,"points":10}];

            Papa.parse(fileHandle, {
              header: true,
              keepEmptyRows:false,
              skipEmptyLines: true,
              complete: function(fileData, file){
                var data = fileData.data;
                console.log("fileData data "+JSON.stringify(data));
                xData["fileData"] = data;
                $("#inputJson").val(JSON.stringify(xData));
                Session.set("exampleJson", JSON.stringify(xData));
                xData["roundValues"] = roundValues;
                xData["winnerPoints"] = 100;

                $("#inputJson").val(JSON.stringify(xData));
                Session.set("exampleJson", JSON.stringify(xData));




              }
            });

        }
        $("#inputJson").val(JSON.stringify(xData));
        Session.set("exampleJson", JSON.stringify(xData));

    },
    "click #apiList": function(e) {
        var apiSelected = $("[name='apiList'] option:selected").attr("name");
        var xData = {};
            Session.set("resultJson",undefined)

        if(apiSelected == "fetchFitbitData")
        {
            xData = {
                "logDate1":"2019-03-05",
                "logDate2":"2019-03-15",
                "userId":"yxgKLfYefg9kZWgk3"

            }
        }

        else if(apiSelected == "typeBasedTeams")
        {
            xData = {
                "teamType":"msl",
                "year":"2019"
            }
        }
        else if(apiSelected == "fetchTeamPoints")
        {
            xData = {
                "year":"2019",
                "tournamentId":"Foj7Eem4M2iSACQSq"
            }
        }
        else if(apiSelected == "fetchTeamSchedule")
        {
             xData = {
                "tournamentId":"5n4CfembF4pLMF6N3"
            }
        }
        else if(apiSelected == "validatePromo")
        {
            xData = {
                "promo":"TTFM19"

            }
        }
         else if(apiSelected == "generateDrawReceipt")
        {
            xData = {
                "tournamentId":"LknFBz93BDHfJmEju",
                "type":"individual",
                "userId":"ZoXoSjSFC9Zm9XZPw",
                "playerId":"EePtJ4LEaygnRtfxQ"
            }
        }
        else if(apiSelected == "liveTourSubscription")
        {
            xData = {
                "country":"India",
                "stateId":"TTFM",
                "userId":"8XwHNBDczvC57HY2y"
            }
        }
        else if(apiSelected == "diaryAnalysis")
        {
            xData = {
                "playerAId":"8XwHNBDczvC57HY2y",
                "playerBId":"gk2Zzj6fdsMB3JFCo",
                "startDate":"01/May/2018",
                "endDate":"30/May/2018"
                
            }
        }
        else if(apiSelected == "diaryPerformAnalysis")
        {
            xData = {
                "playerAId":"8XwHNBDczvC57HY2y",
                "playerBId":"gk2Zzj6fdsMB3JFCo",
                "matchDate":"07/May/2018",
                "type":"win"
                
            }
        }
        else if(apiSelected == "upsertDrill")
        {
            xData = {
                "name": "name1",
                        "description":"sfsdfsdffdfd",
                        "intensity":["low","medium"],
                        "duration":20,"durationType":"min",
                        //"achieved":Number,
                        "type":"tracking",
                        "userId":"",
                        "operation":"create"

            }
        }
        else if(apiSelected == "removeDrill")
        {
            xData = {
                "_id": "rS9GTy7YjH9epv66a","userId":"2Jxg4z3ABToAAg4gr"
            }
        }
        else if(apiSelected == "fetchDrill" || apiSelected == "dataToAssignDrill")
        {
            xData = {
                "type":"tracking","userId":"2Jxg4z3ABToAAg4gr"
            }
        }
        else if(apiSelected == "assignDrill")
        {
            xData = {
                "playerId":"KAd2ZMCizzDPQTfZw",
                "userId":"ztmgE7dS3PMpHdff8",
                "drillId":"9kjjErofgPn8yMnaS",
                "intensity":"low",
                "count":100,
                "status":"partial"
            }
        }
        else if(apiSelected == "createAnalyticsRequest")
        {
             xData = {
                "userId":"22A6YhpcWdLqqiCBc",
                "analystId" : "8XwHNBDczvC57HY2y",
                "title":"Match Title",
                "link":"https://www.youtube.com/watch?v=hFoSzh4sL2Y",
                "matchDate":"31 Jan 2019",
                "description":"hello ",
                "fee":1000            
            }
        }
        else if(apiSelected == "fetchAnalyticsRequest")
        {
             xData = {
                "userId":"22A6YhpcWdLqqiCBc",
                "analystId" : "8XwHNBDczvC57HY2y",
                "status":"active"          
            }
        }
        else if(apiSelected == "cancelAnalyticsRequest")
        {
           xData = {
                "userId":"22A6YhpcWdLqqiCBc",
                "id" : "G6GsybwK3Goy6ERH9",
            } 
        }
        else if(apiSelected == "downloadAnalyticsRequestPdf")
        {
            xData = {
                "userId":"22A6YhpcWdLqqiCBc",
                "id" : "G6GsybwK3Goy6ERH9",
            } 
        
        }
        else if(apiSelected == "fetchRequestUser")
        {
            xData = {
                "userId":"8XwHNBDczvC57HY2y",
            } 
        }
        else if(apiSelected == "downloadTourDraws")
        {
            xData = {
                "tournamentId":"Y6uA4xqvjDPcSSoYh",
                "eventName" : "Sub-junior Boy's Singles",
                "drawsType":"knockout",
                "userId":"ZoXoSjSFC9Zm9XZPw"
            }
        }
        else if(apiSelected == "getAllTourParticipations")
        {
            xData = {
                "userId":"j59pLWP4afF79EvLC"
            }
        }
        else if(apiSelected == "fetchPlayerEntries" || 
            apiSelected == "fetchAcademyEntries" || 
            apiSelected == "fetchDAEntries" ||
            apiSelected == "fetchPlayerTeamEntries")
        {
            xData = {
                "tournamentId":"Y6uA4xqvjDPcSSoYh",
                "userId":"ZoXoSjSFC9Zm9XZPw"
            }
        }
        else if(apiSelected == "entryPayReceipt")
        {
            xData = {
                "tournamentId":"Y6uA4xqvjDPcSSoYh",
                "userId":"ZoXoSjSFC9Zm9XZPw",
                "type":"playerEntry",
                "password":"abcdef"
            }
        }
        else if(apiSelected == "fetchPaidPlayers")
        {
            
            xData = {
                "tournamentId":"Y6uA4xqvjDPcSSoYh",
                "userId":"ZoXoSjSFC9Zm9XZPw",
            }
        }
        else if(apiSelected == "fetchSubscribers")
        {
            xData = {
                "tournamentId":"5n4CfembF4pLMF6N3",
                "eventName":"Men's Singles"
            }
        }
        else if(apiSelected == "createRRDraws")
        {

            /*xData = {
                "tournamentId":"LknFBz93BDHfJmEju",
                "eventName":"Cadet Boy's Singles",
                "userId":"ZoXoSjSFC9Zm9XZPw",
                "maxMembers":5,
            }
            xData.fileData =  $("#addFile").prop("files")[0];
            */
        }
        else if(apiSelected == "fetchLeaveRequest")
        {
            xData = {
                "tournamentId":"Y6uA4xqvjDPcSSoYh",
                "userId":"ZoXoSjSFC9Zm9XZPw",
                "playerId":""
            }
        }
        else if(apiSelected == "fetchBlankScore")
        {
             xData = {
                "tournamentId":"Y6uA4xqvjDPcSSoYh",
                "eventName" : "Sub-junior Boy's Singles",
                "userId":"ZoXoSjSFC9Zm9XZPw",
                "drawsType":"knockout"
            }
        }
        else if(apiSelected == "fetchScoreSheet")
        {
            xData = {
                "tournamentId":"Y6uA4xqvjDPcSSoYh",
                "eventName" : "Sub-junior Boy's Singles",
                "userId":"ZoXoSjSFC9Zm9XZPw",
                "drawsType":"knockout"
            }
        }
        else if(apiSelected == "setMatchDetails")
        {
             xData = {
                "tournamentId":"LknFBz93BDHfJmEju",
                "eventName" : "Junior Boy's Singles",
                "drawsType":"knockout",
                "userId":"ZoXoSjSFC9Zm9XZPw",
                "roundNumber":1,
                "matchNumber":1,
                "status":"bye",
                "playersID" : {
                    "playerAId" : "EHYsSfxNbbLrEs7Fn",
                    "playerBId" : "GcyRDzBcbgF4pPNBT"
                },
                "winnerID":"GcyRDzBcbgF4pPNBT"

            }
        }
        else if(apiSelected == "fetchMatchDetails")
        {
            xData = {
                "tournamentId":"Y6uA4xqvjDPcSSoYh",
                "eventName" : "Sub-junior Boy's Singles",
                "drawsType":"knockout",
                "userId":"ZoXoSjSFC9Zm9XZPw",
                "roundNumber":1,
                "matchNumber":3,
            }
        }
        else if(apiSelected == "fetchRRWinnerEntries")
        {
            xData = {
                "tournamentId":"Y6uA4xqvjDPcSSoYh",
                "eventName" : "Junior Boy's Singles",
                "maxWinners":2,
                "userId":"ZoXoSjSFC9Zm9XZPw"
            }
        }
        else if(apiSelected == "setRRPoints")
        {
            xData = {
                "tournamentId":"zsEawx6D52kt5Bbwc",
                "eventName" : "Cadet Boy's Singles",
                "groupID":"EXsK5D3iPrviZYkgs",
                "userId":"6AwcJJuGHBpBnKMix",
                "rowNo":"1",
                "points":"20",

            }
        }
        else if(apiSelected == "setRRStanding")
        {
            xData = {
                "tournamentId":"zsEawx6D52kt5Bbwc",
                "eventName" : "Cadet Boy's Singles",
                "groupID":"EXsK5D3iPrviZYkgs",
                "userId":"6AwcJJuGHBpBnKMix",
                "rowNo":"1",
                "groupStanding":"20",

            }
        }
        else if(apiSelected == "fetchTourDrawEventList")
        {
            xData = {
                "tournamentId":"Y6uA4xqvjDPcSSoYh",
                "userId":"ZoXoSjSFC9Zm9XZPw"
            }
        }
        else if(apiSelected =="fetchEmptyDraws")
        {
            xData = {
                "userId":"ZoXoSjSFC9Zm9XZPw",
                "numPlayers":14
            }
        }
        else if(apiSelected == "fetchTourEventDraw")
        {
            xData = {
                "tournamentId":"Y6uA4xqvjDPcSSoYh",
                "eventName" : "Sub-junior Boy's Singles",
                "drawsType":"knockout",
                "userId":"ZoXoSjSFC9Zm9XZPw"
            }
        }
        else if(apiSelected == "resetTourEventDraw")
        {
            xData = {
                "tournamentId":"Y6uA4xqvjDPcSSoYh",
                "eventName" : "Sub-junior Boy's Singles",
                "drawsType":"knockout",
                "userId":"ZoXoSjSFC9Zm9XZPw"
            }
        }
        else if(apiSelected == "fetchTeamFormatList")
        {
            xData = {
                "userId" :"3nMBy2C9dmZ7XRzjo",
            } 
        }
        else if(apiSelected == "fetchPlayersOnTeamFormat")
        {
            xData = {
                "userId" :"3nMBy2C9dmZ7XRzjo",
                "teamFormatId":"ugTWCirATaiHcTdFm"
            } 
        }
        else if(apiSelected == "createTFTeam")
        {
            xData = {
                "teamFormatId":"KEb4BKTx5ue4vTunS",
                "teamManager":"EePtJ4LEaygnRtfxQ",
                "teamMembers":[
                    {"playerId":"yTXehA9Cj3z6PgZku","playerNumber":"p1"},
                    {"playerId":"k2navdFPst357iMDA","playerNumber":"p2"}],
                "teamName":"a1"

            }
        }
        else if(apiSelected == "modifyTFTeam")
        {
             xData = {
                "userId":"EePtJ4LEaygnRtfxQ",
                "teamId":"oFiBQBj2fXE4GxASo",
                "teamMembers":[
                    {"playerId":"yTXehA9Cj3z6PgZku","playerNumber":"p1"},
                    {"playerId":"k2navdFPst357iMDA","playerNumber":"p2"}],
            }
        }
        else if(apiSelected == "viewTFTeam")
        {
             xData ={
                "teamId":"oFiBQBj2fXE4GxASo",
            }
        }
        else if(apiSelected =="deleteTFTeam")
        {
            xData ={
                "teamId":"ynYcdupR6KNzxZghK",
                "userId":"EePtJ4LEaygnRtfxQ"
            }
        }
        else if(apiSelected == "fetchTFTeams")
        {
            xData = {
                "userId":"EePtJ4LEaygnRtfxQ"
 
            }
        }
        else if(apiSelected == "tourCreationDetails")
        {
            xData = {
                "userId" :"nGn3Khwt4XXMA7a36",
            }

        }
       
        else if(apiSelected == "createTour")
        {
            xData = { 
                //organizer - nGn3Khwt4XXMA7a36

                //DA affiliated to other - disassoctest123@gmail.com - nQ2M2FjtLwhugCuz7 
                //no selectedIds

                //DA affailiated to SA - district1 - nGecuEkn7omqn89jD
                //"selectedIds":["8YEuh3d6XNKyw5dRP","57pHXeFbNL3FNY5qS","za4dnHp9wWznRt7ah","nGecuEkn7omqn89jD","nGecuEkn7omqn89jD"],

                //academy state affailited - academy1 - zaptNiQf83das8mz4
                //"selectedIds":["jkHWLDoqLdhutMfjd","zaptNiQf83das8mz4","gqYbHjgzqjWxgTpnz","gqYbHjgzqjWxgTpnz"],
                
                //academy district association affiliated - academy2 - EM4c3CarY5TRfDye6
                //"selectedIds":["SvrAFbm4rH5uqZDDR","EM4c3CarY5TRfDye6"],

                //academy not affiliated to anyone - academy5 - fYctwKiBNPi4EEp6r

                "eventName":"t1",
                "eventSubscriptionLastDate":"2018 Aug 31",
                "eventStartDate":"2018 Sep 30",
                "eventEndDate":"2018 Nov 30",
                "projectId":["QvHXDftiwsnc8gyfJ"],
                "domainId":["8va5A8N3EKAeKtmeB"],
                "eventOrganizer":"nGn3Khwt4XXMA7a36",

                "subEvents":[
                    {"eventId":"ksHHDWReSe7N2uux7","prize":"1","projectType":"1",
                    "eventName":"Cadet Boy's Singles","eventEndDate":"2018 Nov 30",
                    "eventStartDate":"2018 Sep 30"},
                    {"eventId":"H8NKgBHk6JYrycCvf","prize":"1","projectType":"1",
                    "eventName":"Sub-junior Boy's Singles","eventEndDate":"2018 Nov 30",
                    "eventStartDate":"2018 Sep 30"}],

                "subEventsFilters":[
                    {"ranking":"no","eventId":"ksHHDWReSe7N2uux7","gender":"Male","dateOfBirth":"1992 Oct 08"},
                    {"ranking":"no","eventId":"H8NKgBHk6JYrycCvf","gender":"Male","dateOfBirth":"1992 Oct 08"}],

                "selectionType":"allExceptSchool",
                "subscriptionTypeDirect":"0",
                "subscriptionTypeMail":"1",
                "subscriptionTypeMailValue":"organizer1@gmail.com",
                "subscriptionTypeHyper":"1",
                "hyperLinkValue":"jhgjhj",

                "timezoneIdEventLat":"0",//optional
                "timezoneIdEventLng":"0",//optional

                "sponsorLogo":"",//optional 
                "sponsorUrl":"",//optional 
                "sponsorPdf":"",//optional 
                "rulesAndRegulations":"",//optional 
            }
        }
        else if(apiSelected == "fetchTourDetails")
        {
            xData = {
                "tournamentId" :"LknFBz93BDHfJmEju",
            }
        }
        else if(apiSelected == "deleteTour")
        {
            xData = {
                "tournamentId" :"RnHzQ5Cqstgkh926o",
            }
        }
        else if(apiSelected == "modifyTour")
        {
            xData = {"tournamentId":"LknFBz93BDHfJmEju",
                "eventName":"Ranking2 Assoc1",
                "eventStartDate":"2018 Sep 29",
                "eventEndDate":"2018 Nov 24",
                "eventSubscriptionLastDate":"2018 Aug 24",
                "domainId":["8va5A8N3EKAeKtmeB"],
                "sponsorPdf":false,
                "sponsorLogo":false,
                "sponsorUrl":"",
                "rulesAndRegulations":false,
                "resultsOfTheEvents":false,
                "prizePdfId":false,
                "venueLatitude":"0", // done
                "venueLongitude":"0", // done
                "timezoneIdEventLat":0, // done
                "timezoneIdEventLng":0, // done
                //subEvents - optional
                //change order 

                //"eventId":"kslkebduo27N2uux7","eventStartDate":"2018 Sep 29","eventEndDate":"2018 Nov 24",

                "subEvents":[
                {"eventId":"kslkebduo27N2uux7","eventStartDate":"2018 Sep 29","eventEndDate":"2018 Nov 24"},
                {"eventId":"kscge09m1u7N2uux7","eventStartDate":"2018 Sep 29","eventEndDate":"2018 Nov 24"},
                {"eventId":"ksHHDWReSe7N2uux7","eventStartDate":"2018 Sep 29","eventEndDate":"2018 Nov 24"},
                {"eventId":"AJ5LtgFtStmL6KgsD","eventStartDate":"2018 Sep 29","eventEndDate":"2018 Nov 24"},
                {"eventId":"H8NKgBHk6JYrycCvf","eventStartDate":"2018 Sep 29","eventEndDate":"2018 Nov 24"},
                {"eventId":"tXpQ4DwgrAfFGR4oj","eventStartDate":"2018 Sep 29","eventEndDate":"2018 Nov 24"},
                {"eventId":"nPnrTCix3yAD3TmAz","eventStartDate":"2018 Sep 29","eventEndDate":"2018 Nov 24"},
                {"eventId":"arGJsShtr9sjRXwyT","eventStartDate":"2018 Sep 29","eventEndDate":"2018 Nov 24"},
                {"eventId":"nPnrTCix3yAD3TmAzz","eventStartDate":"2018 Oct 03","eventEndDate":"2018 Nov 24"},
                {"eventId":"arGJsShtr9sjRXwyTz","eventStartDate":"2018 Oct 04","eventEndDate":"2018 Nov 24"},
                {"eventId":"2XMzYon6GbE9TxmGN","eventStartDate":"2018 Sep 29","eventEndDate":"2018 Nov 24"},
                {"eventId":"5ioxxYpoPuox8huWC","eventStartDate":"2018 Sep 29","eventEndDate":"2018 Nov 24"},
                {"eventId":"Bn9emodsjqgWEi2pK","eventStartDate":"2018 Sep 29","eventEndDate":"2018 Nov 24"},
                {"eventId":"giR4SJEhDJ6mtNGW7","eventStartDate":"2018 Sep 29","eventEndDate":"2018 Nov 24"}
                ],
                "subscriptionTypeDirect":1,
                "subscriptionTypeHyper":0,
                "hyperLinkValue":0,
                "subscriptionTypeMail":1,
            }
        }
           
        
            
        
        $("#inputJson").val(JSON.stringify(xData));

        Session.set("exampleJson", JSON.stringify(xData));

        if(apiSelected == "setMatchDetails")
        {

            xData1 = {
                "tournamentId":"LknFBz93BDHfJmEju",
                "eventName" : "Junior Boy's Singles",
                "drawsType":"knockout",
                "userId":"ZoXoSjSFC9Zm9XZPw",
                "roundNumber":1,
                "matchNumber":1,
                "status":"bye",
                "playersID" : {
                    "playerAId" : "EHYsSfxNbbLrEs7Fn",
                    "playerBId" : "GcyRDzBcbgF4pPNBT"
                },
                "winnerID":"GcyRDzBcbgF4pPNBT",
                "completedscores":["11","11","11","",""],
                "groupID":"",
                "rowNo":"",
                "colNo":""

            }
            Session.set("exampleJson", JSON.stringify(xData1));

        }
    },

    "click #testAPI": function(e) {

        var apiKey = "3b7dfced3428af5e22bf25461c8c54a2";
        var apiSelected = $("[name='apiList'] option:selected").attr("name");
        var inputJSON = $("#inputJson").val();
                var url = Meteor.absoluteUrl().toString();

        try {
            if (
                apiSelected == "typeBasedTeams" || apiSelected == "fetchTeamPoints" || 
                apiSelected == "fetchTeamSchedule" ||
                apiSelected == "liveTourSubscription" || apiSelected == "validatePromo" ||
                apiSelected == "diaryAnalysis" || apiSelected == "diaryPerformAnalysis" ||
                apiSelected == "upsertDrill" || apiSelected == "fetchDrill" || 
                apiSelected == "removeDrill" || 
                apiSelected == "dataToAssignDrill" || apiSelected == "assignDrill" ||
                apiSelected == "fetchFitbitData" ||
                apiSelected == "createAnalyticsRequest" || 
                apiSelected == "fetchAnalyticsRequest" ||
                apiSelected == "cancelAnalyticsRequest" ||
                apiSelected == "downloadAnalyticsRequestPdf" ||
                apiSelected == "fetchRequestUser" ||
                apiSelected == "createTour" || apiSelected == "deleteTour" || 
                apiSelected =="modifyTour" || apiSelected == "fetchTourDetails" ||
                apiSelected =="fetchTeamFormatList" || 
                apiSelected == "fetchPlayersOnTeamFormat" ||
                apiSelected =="createTFTeam" || apiSelected == "deleteTFTeam" || 
                apiSelected == "modifyTFTeam" || apiSelected == "viewTFTeam" ||
                apiSelected == "fetchTFTeams" ||
                apiSelected == "downloadTourDraws" ||
                apiSelected == "fetchTourEventDraw" ||
                apiSelected == "resetTourEventDraw" || 
                apiSelected == "fetchEmptyDraws" ||
                apiSelected == "fetchTourDrawEventList" ||
                apiSelected == "setRRPoints" || apiSelected == "setRRStanding" ||
                apiSelected == "fetchRRWinnerEntries" ||
                apiSelected == "fetchMatchDetails" || 
                apiSelected == "setMatchDetails" ||
                apiSelected == "createRRDraws" ||
                apiSelected == "createKODraws" ||
                apiSelected == "fetchBlankScore" || 
                apiSelected == "fetchScoreSheet" ||
                apiSelected == "fetchLeaveRequest" ||
                apiSelected == "fetchPlayerEntries" ||
                apiSelected == "fetchAcademyEntries" || 
                apiSelected == "fetchDAEntries" ||
                apiSelected == "fetchPlayerTeamEntries" ||
                apiSelected == "entryPayReceipt" ||
                apiSelected == "fetchPaidPlayers" || apiSelected == "fetchSubscribers" ||
                apiSelected == "generateDrawReceipt" ||
                apiSelected == "getAllTourParticipations" ) {

                HTTP.call("POST", url+"/dev/" + apiSelected, {
                
                    data: {
                        caller: "KTTA",
                        apiKey: "3b7dfced3428af5e22bf25461c8c54a2",
                        "data": JSON.parse(inputJSON),
                    }
                }, function(error, result) {
                    if (!error) {
                        Session.set("resultJson",JSON.stringify(result))

                    }
                });
            }
           
            else if(apiSelected == "tourCreationDetails")
            {
                var paramJson = {};
                paramJson["caller"] = "KTTA";
                paramJson["apiKey"] = "3b7dfced3428af5e22bf25461c8c54a2";
                paramJson["data"] = JSON.parse(inputJSON);

                HTTP.call("GET", url+"/dev/" + apiSelected, {
                        params: paramJson
                    }, function(error, result) {
                        if (!error) {
                            Session.set("resultJson",JSON.stringify(result))
                    }
                });
            }
            else if(apiSelected == "viewPlayerTeam")
            {
                var paramJson = {};
                paramJson["caller"] = "KTTA";
                paramJson["apiKey"] = "3b7dfced3428af5e22bf25461c8c54a2";
                paramJson["teamId"] = "aaKXERr8tZYyyXpD7";

                HTTP.call("GET", url+"/dev/" + apiSelected, {
                        params: paramJson
                    }, function(error, result) {
                        if (!error) {
                            Session.set("resultJson",JSON.stringify(result))
                    }
                });
            }
            
        } catch (e) {
        }
    }
})