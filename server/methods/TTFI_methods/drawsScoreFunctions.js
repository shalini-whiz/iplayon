import { setJson } from './draws_functions.js';
import { MatchCollectionDB } from '../../publications/MatchCollectionDb.js';




export const calcKnockOutindividualScore = function(data)
{
    try{
        var resultJson = {};
        var errorMsg = [];
        var tournamentId = data.tournamentId;
        var eventName = data.eventName;
        var matchNumber = data.matchNumber;
        var roundNumber = data.roundNumber;
        var status = data.status;
        var playersID = data.playersID;
        var completedscores = data.completedscores;
        var winnerID = data.winnerID;

        var matchInfo = MatchCollectionDB.findOne({
            "tournamentId": tournamentId,
            "eventName":eventName,
            "matchRecords.matchNumber": matchNumber
        }, {fields: {
            _id: 0,
            matchRecords: {
                $elemMatch: {
                    "matchNumber": matchNumber
                }
            }
        }});

        var configInfo = MatchCollectionConfig.findOne({
            "tournamentId": tournamentId,
            "eventName":eventName,
            "roundValues.roundNumber":roundNumber.toString()
        },{fields: {
            _id: 0,
            roundValues: {
                $elemMatch: {
                    "roundNumber": roundNumber.toString()
                    }
                }
            }}
        );

        var roundInfo = MatchCollectionConfig.findOne({
            "tournamentId": tournamentId,
            "eventName":eventName
        })
        if (configInfo && configInfo.roundValues && 
            configInfo.roundValues.length > 0 && 
            configInfo.roundValues[0].noofSets && matchInfo &&  
            matchInfo.matchRecords && matchInfo.matchRecords.length > 0 && 
            matchInfo.matchRecords[0] && matchInfo.matchRecords[0].players) 
        {
            //console.log("matchInfo .. "+JSON.stringify(matchInfo));

            var players = matchInfo.matchRecords[0].players;
            var matchPlayerId = matchInfo.matchRecords[0].playersID;
            var sets = parseInt(configInfo.roundValues[0].noofSets);
            var minDifference = parseInt(configInfo.roundValues[0].minDifference);
            var minScoresToWin  = parseInt(configInfo.roundValues[0].minScores);
            var byeWalkoverSets = parseInt(configInfo.roundValues[0].noofSets);
            var roundPoints = configInfo.roundValues[0].points;
            var mx = parseInt(roundInfo.roundValues.length) - parseInt(1);
            var finalRound = roundInfo.roundValues[mx - 1].roundNumber;
            var finalPoints = roundInfo.roundValues[mx].points;
            var matchRecords = {};
            matchRecords["tournamentId"] = tournamentId;
            matchRecords["eventName"] = eventName;
            matchRecords["roundNumber"] = roundNumber;
            matchRecords["matchNumber"] = matchNumber;                               
            matchRecords["status"] = status;
            matchRecords["nextMatchNumber"] = matchInfo.matchRecords[0].nextMatchNumber;
            matchRecords["nextSlot"] = matchInfo.matchRecords[0].nextSlot;
            matchRecords["finalRound"] = finalRound;
            matchRecords["finalPoints"] = finalPoints;
            matchRecords["roundPoints"] = roundPoints;
            matchRecords["winnerID"] = winnerID;

            var defaultCompletedSet = [];
            if(playersID.playerAId != matchPlayerId.playerAId || 
                playersID.playerBId != matchPlayerId.playerBId)
                errorMsg.push("Invalid player id");

            if(status == "bye" || status == "walkover")
            {
                for(var m=0; m<sets;m++)
                {
                    defaultCompletedSet.push("0");
                }

                var setScoresA = ["0","0","0","0","0","0","0"];
                var setScoresB = ["0","0","0","0","0","0","0"];
                var scores = {};
                scores["setScoresA"] = setScoresA;
                scores["setScoresB"] = setScoresB;
                matchRecords["scores"] = scores;
                matchRecords["completedscores"] = defaultCompletedSet;
                matchRecords["setWins"] ={"playerA":0,"playerB":0}
            }

            if(status == "bye")
            {   
                //console.log(winnerID+" ... "+playersID.playerAId+" ... "+playersID.playerBId)                           
                if(winnerID == playersID.playerAId)
                {
                    matchRecords.winner = players.playerA;
                    matchRecords.loserID = playersID.playerBId;
                    matchRecords.getStatusColorA = "ip_input_box_type_pName";
                    matchRecords.getStatusColorB = "ip_input_box_type_pNameBye";
                }
                else if(winnerID == playersID.playerBId)
                {
                    matchRecords.winner = players.playerB;
                    matchRecords.loserID = playersID.playerAId;
                    matchRecords.getStatusColorA = "ip_input_box_type_pNameBye";
                    matchRecords.getStatusColorB = "ip_input_box_type_pName";
                }
                else
                {
                    errorMsg.push("Invalid winner")
                }
            }
            else if(status == "walkover")
            {
                if(winnerID == playersID.playerAId)
                {
                    matchRecords.winner = players.playerA;
                    matchRecords.loserID = playersID.playerBId;
                    matchRecords.getStatusColorA = "ip_input_box_type_pName";
                    matchRecords.getStatusColorB = "ip_input_box_type_pNameWalkover";
                }
                else if(winnerID == playersID.playerBId)
                {
                    matchRecords.winner = players.playerB;
                    matchRecords.loserID = playersID.playerAId;
                    matchRecords.getStatusColorA = "ip_input_box_type_pNameWalkover";
                    matchRecords.getStatusColorB = "ip_input_box_type_pName";
                }
                else
                {
                    errorMsg.push("Invalid winner")
                }
            }
            else if(status == "completed")
            {
                //console.log("Completed Scores size .. "+completedscores.length)
                if(completedscores.length < sets.length || completedscores.length > sets.length)
                    errorMsg.push("Completed Scores size should be of "+sets)
                                     
                var sets = {};
                var scoreSet = [];
                for(var n=0; n< completedscores.length; n++)
                {
                    var h = n+1;
                    var setVal = completedscores[n];
                    if(setVal != undefined && setVal.trim().length > 0)
                    {
                        if(setVal != -0 || setVal != "-0")                  
                            setVal = parseInt(setVal);
                    }
                    sets["set"+h] = setVal;
                    scoreSet.push(setVal);                                        
                }

                //console.log("111")
                var dataJson = setJson(sets, minDifference, minScoresToWin, byeWalkoverSets);
                var completedScores = [];
                var completedSetScores  = [];

                for(var b=0; b< scoreSet.length;b++)
                {
                    var scoreVal = scoreSet[b];
                    if (scoreVal != undefined) 
                    {
                        completedScores.push(scoreVal);
                        completedSetScores.push(scoreVal.toString());
                    }
                }
                                     
                var numSetWinsReqd = parseInt((parseInt(byeWalkoverSets) + 1) / 2);
                var setScoresA = JSON.parse(JSON.stringify(dataJson)).scores.setScoresA;
                var setScoresB = JSON.parse(JSON.stringify(dataJson)).scores.setScoresB;

                if (setScoresA.length < numSetWinsReqd) 
                    errorMsg.push("Invalid set");
                if (setScoresA.length != setScoresB.length) 
                    errorMsg.push("Invalid set");

                var winsA = 0;
                var winsB = 0;

                for (var j = 0; j < completedScores.length; j++) 
                {
                    if(completedScores[j].toString().trim() != "" && completedScores[j] != undefined)
                    {        
                        if(typeof completedScores[j] == "number")
                        {
                            if (completedScores[j] > 0 || completedScores[j] == 0)       
                            {
                                winsA++;
                            }          
                            else if (completedScores[j] < 0)
                            {
                                winsB++;
                            }
                        }
                        else if(typeof completedScores[j] == "string")
                        {
                            if(completedScores[j] == "-0")
                            {
                                winsB++;
                            }
                        }
                                               
                    }
                }

                if (winsA != numSetWinsReqd && winsB != numSetWinsReqd)
                    errorMsg.push("Incomplete Set");
                else if(winsA == numSetWinsReqd)
                {
                    matchRecords.winner = players.playerA;
                    matchRecords.winnerID = playersID.playerAId;
                    matchRecords.loserID = playersID.playerBId;
                    matchRecords.getStatusColorA = "ip_input_box_type_pName";
                    matchRecords.getStatusColorB = "ip_input_box_type_pNameLost";
                }
                else if(winsB == numSetWinsReqd)
                {
                    matchRecords.winner = players.playerB;
                    matchRecords.winnerID = players.playerBId;
                    matchRecords.loserID = playersID.playerAId;
                    matchRecords.getStatusColorA = "ip_input_box_type_pNameLost";
                    matchRecords.getStatusColorB = "ip_input_box_type_pName";
                }
                else
                {
                    errorMsg.push("Invalid winner")
                }
                matchRecords["completedscores"] = completedSetScores;
                matchRecords["scores"] = JSON.parse(JSON.stringify(dataJson)).scores;
            }

            if(errorMsg.length > 0)
            {
                var resultJson={};
                resultJson["status"] = "failure";
                resultJson["errorMsg"] = errorMsg;
                resultJson["message"] = "Could not fetch tournament match details";
                return resultJson;
            }
            else
            {
                var resultJson={};
                resultJson["status"] = "success";
                resultJson["matchRecords"] = matchRecords;
                return resultJson;
            }
                                        
        }
        else
        {
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["message"] = "Invalid configuration details";
            return resultJson;
        }
    }catch(e){
        //console.log("hellpo ..."+e)
        var resultJson = {};
        resultJson["status"] = "failure";
        resultJson["message"] = "Could not fetch tournament match details "+e;
        return resultJson;
    }
}

export const calcRRindividualScore = function(data)
{
    try{
        var resultJson = {};
        var errorMsg = [];
        var tournamentId = data.tournamentId;
        var eventName = data.eventName;
        var matchNumber = data.matchNumber;
        var roundNumber = data.roundNumber;
        var status = data.status;
        var playersID = data.playersID;
        var winnerID = data.winnerID;
        var groupID = data.groupID;
        var rowNo = data.rowNo;
        var colNo = data.colNo;
        var matchScore = undefined;
        if(data.scores)
            matchScore  = data.scores;


        var matchInfo = roundRobinEvents.findOne({
            "tournamentId": tournamentId,
            "eventName":eventName,
            "_id":groupID,
            "groupDetails.rowNo": rowNo,
            "groupDetails.colNo" : colNo
        }, {fields: {
            _id: 0,
            groupDetails: {
                $elemMatch: {
                    "rowNo": rowNo,
                    "colNo":colNo
                }
            }
        }});

        //console.log("matchInfo .. "+matchInfo)

       
        if (matchInfo &&  
            matchInfo.groupDetails && matchInfo.groupDetails.length > 0 && 
            matchInfo.groupDetails[0]) 
        {
            //console.log("matchInfo .. "+JSON.stringify(matchInfo));

            var matchPlayerId = matchInfo.groupDetails[0].playersID;

            var matchRecords = {};
            //matchRecords["tournamentId"] = tournamentId;
           // matchRecords["eventName"] = eventName;
            //matchRecords["roundNumber"] = roundNumber;
           // matchRecords["matchNumber"] = matchNumber;                               
           // matchRecords["status"] = status;
           // matchRecords["winnerID"] = winnerID;

           //console.log(playersID.playerAId+" ... "+matchPlayerId.playerAId)
           //console.log(playersID.playerBId+" ... "+matchPlayerId.playerBId)

            if(playersID.playerAId != matchPlayerId.playerAId || 
                playersID.playerBId != matchPlayerId.playerBId)
                errorMsg.push("Invalid player id");

            if(status == "bye" || status == "walkover")
            {
                var setScoresA = ["0","0","0","0","0","0","0"];
                var setScoresB = ["0","0","0","0","0","0","0"];
                var scores = {};
                scores["setScoresA"] = setScoresA;
                scores["setScoresB"] = setScoresB;
                //matchRecords["scores"] = scores;
               // matchRecords["setWins"] ={"playerA":0,"playerB":0};
                if(winnerID == playersID.playerAId)
                {
                   //matchRecords.winner = players.playerA;
                    var  loserID = playersID.playerBId;
                    var data = {};
                    data.rowNo = rowNo;
                    data.colNo = colNo;
                    data.scores =  scores
                    data.setWins ={"playerA":0,"playerB":0};
                    data.winnerID = winnerID;
                    data.loserID = loserID;
                    data.winnerType = status;

                    var inVersedata = {};
                    inVersedata.rowNo = colNo;
                    inVersedata.colNo = rowNo;
                    inVersedata.setWins = {"playerA":0,"playerB":0};
                    inVersedata.scores =  scores;
                    inVersedata.winnerID = winnerID;
                    inVersedata.loserID = loserID;
                    inVersedata.winnerType = status;

                    matchRecords["data"] =  data;
                    matchRecords["inverseData"] = inVersedata;

                }
                else if(winnerID == playersID.playerBId)
                {
                    //matchRecords.winner = players.playerB;
                    var loserID = playersID.playerAId;

                    var data = {};
                    data.rowNo = rowNo;
                    data.colNo = colNo;
                    data.scores =  scores
                    data.setWins ={"playerA":0,"playerB":0};
                    data.winnerID = winnerID;
                    data.loserID = loserID;
                    data.winnerType = status;

                    var inVersedata = {};
                    inVersedata.rowNo = colNo;
                    inVersedata.colNo = rowNo;
                    inVersedata.setWins = {"playerA":0,"playerB":0};
                    inVersedata.scores =  scores;
                    inVersedata.winnerID = winnerID;
                    inVersedata.loserID = loserID;
                    inVersedata.winnerType = status;

                    matchRecords["data"] =  data;
                    matchRecords["inverseData"] = inVersedata;
                }
                else
                {
                    errorMsg.push("Invalid winner")
                }
            }

            else if(status == "completed")
            {
                if(matchScore != undefined && matchScore.setScoresA != undefined && matchScore.setScoresB != undefined)
                {
                    if(matchScore.setScoresA.length != 7 || matchScore.setScoresB.length != 7)
                    {
                        errorMsg.push("7 set of scores need to be provided")
                    }
                    else
                    {
                        var playerAScore = matchScore.setScoresA;
                        var playerBScore = matchScore.setScoresB;
                        var playerAWinCount = 0;
                        var playerBWinCount = 0;
                        for(var m =0; m<playerAScore.length;m++)
                        {
                            if(parseInt(playerAScore[m])>parseInt(playerBScore[m]))
                                playerAWinCount = playerAWinCount + 1;
                            else if(parseInt(playerBScore[m]) > parseInt(playerAScore[m]))
                                playerBWinCount = playerBWinCount + 1;
                            
                        }

                        if(parseInt(playerAWinCount)>parseInt(playerBWinCount)){
                            winnerID = playersID.playerAId;
                            loserID = playersID.playerBId;
                        }
                        else if(parseInt(playerBWinCount)>parseInt(playerAWinCount)){
                            winnerID = playersID.playerBId
                            loserID = playersID.playerAId
                        }
                        if(playerAWinCount == 0 && playerBWinCount == 0 )
                        {
                            errorMsg.push("Please set scores..")
                        }
                        else
                        {
                            var data = {};
                            data.rowNo = rowNo;
                            data.colNo = colNo;
                            data.setWins = {"playerA":playerAWinCount,"playerB":playerBWinCount};
                            data.scores =  {"setScoresA":playerAScore,"setScoresB":playerBScore};
                            data.winnerID = winnerID;
                            data.loserID = loserID;
                            data.winnerType = status;


                            var inVersedata = {};
                            inVersedata.rowNo = colNo;
                            inVersedata.colNo = rowNo;
                            inVersedata.setWins = {"playerA":playerBWinCount,"playerB":playerAWinCount};
                            inVersedata.scores =  {"setScoresA":playerBScore, "setScoresB":playerAScore};
                            inVersedata.winnerID = winnerID;
                            inVersedata.loserID = loserID;
                            inVersedata.winnerType = status;


                            matchRecords["data"] =  data;
                            matchRecords["inverseData"] = inVersedata;
                        }

                    }
                    
                }
                else
                {
                    errorMsg.push("Scores are empty")
                }
     
            }

            if(errorMsg.length > 0)
            {
                var resultJson={};
                resultJson["status"] = "failure";
                resultJson["errorMsg"] = errorMsg;
                resultJson["message"] = "Could not fetch tournament match details";
                return resultJson;
            }
            else
            {
                var resultJson={};
                resultJson["status"] = "success";
                resultJson["matchRecords"] = matchRecords;
                return resultJson;
            }
                                        
        }
        else
        {
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["message"] = "Invalid configuration details";
            return resultJson;
        }
    }catch(e){
        //console.log("hello roundrobin ..."+e)
        var resultJson = {};
        resultJson["status"] = "failure";
        resultJson["message"] = "Could not fetch tournament match details "+e;
        return resultJson;
    }
}

export const createKODrawValidation = function(data)
{
    try{
        var resultJson = {};
        var errorMsg = [];
        var jsonParam = {};  
        var tournamentId = data.tournamentId;
        var eventName = data.eventName;
        var eventId = data.eventId;
        var fileData = data.fileData;
        var roundValues = data.roundValues;
        var tourSport = data.tourSport;
        var tourOrganizer = data.tourOrganizer;
        var winnerPoints = data.winnerPoints;

                          




        var result =  Meteor.call("initMatchRecords", tournamentId, eventName, eventId, fileData);
        //console.log("result .. "+JSON.stringify(result));
        if (result) 
        {
            if (result.length == 0) 
            {
                erorMsg.push("Could not upload");
            }
            else if (result[0].message == undefined && result.length > 0) 
            {
                matches = result;
                //console.log("matches length .."+matches[matches.length - 1].roundNumber);
                //console.log("matches  group length .."+matches.length / 16);
                //console.log("roundval length .. "+roundValues.length);
                var matchLen = matches[matches.length - 1].roundNumber;
                if(matchLen != roundValues.length)
                    errorMsg.push("Sets/Points should be defined for "+matchLen+" rounds");
                else
                {                                      
                    var validRoundNumber = _.map(roundValues, function(indexData) { 
                        return indexData.roundNumber; });

                    //console.log("validRoundNumber .. "+validRoundNumber)
                    for(var j=1 ; j<= matchLen; j++)
                    {
                        var exists = _.contains(validRoundNumber, j);
                        //console.log(j+" ... "+validRoundNumber+" ... "+exists)
                        if(!exists)
                            errorMsg.push("Round Number "+j+" points/sets need to be defined");
                    }
                }                                                                                
            } 
            else 
            {
                for (var t = 0; t < result.length; t++) 
                {
                    errorMsg.push(result[t].player + " " + result[t].message + " <br>");
                }                                 
            }

            if(errorMsg.length > 0)
            {
                                       
                var result1 =  Meteor.call("resetMatchRecords",tournamentId.trim(),eventName.trim(),tourOrganizer,tourSport) 
                //console.log("result1 reset .. "+result1);

                var resultJson={};
                resultJson["status"] = "failure";
                resultJson["errorMsg"] = errorMsg;
                resultJson["message"] = "Could not create tournament draws";
                return resultJson;
            }
            else
            {
                                            //yet to code
                //console.log("code in case of points and settings")
               

                                        
                var paramData = {};
                paramData["tournamentId"] = tournamentId;
                paramData["eventName"] = eventName;
                paramData["projectId"] = tourSport;

                var winnerJson = {
                    "roundNumber": parseInt(roundValues.length) + 1,
                    "points": winnerPoints,
                    "roundName": "Winner"
                }
                roundValues.push(winnerJson);
                paramData["roundValues"] = roundValues;
                                        
                var configResult =  Meteor.call("setTourPointsSettings",paramData);
                if(configResult)
                {
                    var resultJson={};
                    var dbColl = {};
                    var matchInfo = MatchCollectionDB.findOne({"tournamentId":tournamentId,"eventName":eventName});
                    dbColl["MatchCollectionDB"] = matchInfo;
                    var matchConfigInfo = MatchCollectionConfig.findOne({"tournamentId":tournamentId,"eventName":eventName});
                    dbColl["MatchCollectionConfig"] = matchConfigInfo;
                    resultJson["status"] = "success";
                    resultJson["dbColl"] = dbColl;
                    resultJson["message"] = "Tournament draws created";
                    return resultJson;
                }
                else
                {
                    var result1 =  Meteor.call("resetMatchRecords",tournamentId.trim(),eventName.trim(),tourOrganizer,tourSport) 
                    //console.log("result1 reset .. "+result1);
                    var resultJson={};
                    resultJson["status"] = "failure";
                    resultJson["errorMsg"] = errorMsg;
                    resultJson["message"] = "Could not create tournament draws";
                    return resultJson;
                }
            }
        }

    }catch(e){
        //console.log("hellpo ..."+e);
        var result1 =  Meteor.call("resetMatchRecords",tournamentId.trim(),eventName.trim(),tourOrganizer,tourSport) 
        //console.log("result1 reset .. "+result1);
        var resultJson = {};
        resultJson["status"] = "failure";
        resultJson["message"] = "Could not create tournament draws "+e;
        return resultJson; 
    }
}