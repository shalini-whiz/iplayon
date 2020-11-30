
function computeDateFilter(dateFilter)
{
  var lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() -7);

  var lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() -1);

  var lastThreeMonths = new Date();
  lastThreeMonths.setMonth(lastThreeMonths.getMonth() - 3);

  var lastTwoMonths = new Date();
  lastTwoMonths.setMonth(lastTwoMonths.getMonth() - 2);

  var lastYear = new Date();
  lastYear.setFullYear(lastYear.getFullYear()  - 1);

  var lastDay = new Date();
  lastDay.setDate(lastDay.getDate() - 1);
     
  
  var dateQuery = "";
  if(dateFilter == "Since" || dateFilter == "None" || dateFilter == "Any time")
    dateQuery = "";
  else if(dateFilter == "Beginning")
    dateQuery = "";
  else if(dateFilter == "Last Day")
    dateQuery = lastDay;
  else if(dateFilter == "Last Week")
    dateQuery = lastWeek;
  else if(dateFilter == "Last Month")
    dateQuery = lastMonth;
  else if(dateFilter == "Last 2 Months")
    dateQuery = lastTwoMonths;
  else if(dateFilter == "Last 3 Months")
    dateQuery = lastThreeMonths;
  else if(dateFilter == "Last Year")
    dateQuery = lastYear;
  return dateQuery;

}

Meteor.methods({

  'recordPlayerSequence':function(userId,sequenceData)
  {
    try
    {
      sequenceData = sequenceData.replace("\\", "");
      var obj = JSON.parse(sequenceData);
      obj.playerId = userId;
      obj.player1Name = obj.player1Name.trim();
      obj.player2Name = obj.player2Name.trim();
      obj.winner = obj.winner.trim();
      obj.serviceBy = obj.serviceBy.trim();
      obj.serviceHand = obj.serviceHand.trim();
      obj.serviceDestination = obj.serviceDestination.trim();

      var str = obj.lastShot;
      var res = str.split("-");
      if(res.length == 2)
        obj.lastShotDestination = res[1];
      else
        obj.lastShotDestination = res[2];

      var matchDate = obj.matchDate;
      var from = matchDate.split("/");
      obj.matchDate = moment(new Date("20"+from[2], from[1] - 1, from[0])).format("DD MMM YYYY");



      var sequenceData = {};  
      var sequenceDataTemp = {};
      if(obj.matchTitle == undefined)
        obj.matchTitle = "";
      if(obj.startTime == undefined)
        obj.startTime = "";
      
      sequenceData["matchDate"] = obj.matchDate;
      sequenceData["matchTitle"] = obj.matchTitle;
      sequenceData["startTime"] = obj.startTime;
      sequenceData["rallyType"] = obj.rallyType;
      sequenceData["player1Strokes"] = obj.player1Strokes;
      sequenceData["strokesPlayed"] = obj.strokesPlayed;
      if(obj.rallyType == "partial")
        sequenceData["winner"] = "";
      else
        sequenceData["winner"] = obj.winner;

      sequenceData["playerA"] = obj.playerA;
      sequenceData["playerB"] = obj.playerB;
      sequenceData["combinedStrokes"] = obj.combinedStrokes;
      sequenceData["serviceHand"] = obj.serviceHand;
      sequenceData["serviceDestination"] = obj.serviceDestination;

      var createdDate = new Date();
      var formatedDate = moment(createdDate).format("DD-MM-YYYY");
      sequenceData["sequenceRecordDate"] = createdDate;


      sequenceDataTemp["matchDate"] = obj.matchDate;
      sequenceDataTemp["rallyType"] = "complete";
      sequenceDataTemp["player1Strokes"] = obj.player1Strokes;
      sequenceDataTemp["strokesPlayed"] = obj.strokesPlayed;
      if(obj.rallyType == "partial")
        sequenceDataTemp["winner"] = "";
      else
        sequenceDataTemp["winner"] = obj.winner;
      sequenceDataTemp["combinedStrokes"] = obj.combinedStrokes;
      sequenceDataTemp["serviceHand"] = obj.serviceHand;
      sequenceDataTemp["serviceDestination"] = obj.serviceDestination;
      sequenceDataTemp["sequenceRecordDate"] = createdDate;


      /* analytics cache related */
      var analyticsCache = {};
      analyticsCache.serviceBy = obj.serviceBy;
      if(obj.rallyType == "partial")
        analyticsCache.winner = "";
      else
        analyticsCache.winner = obj.winner;
      analyticsCache.serviceWin = "no";
      analyticsCache.serviceLoss = "no";
      analyticsCache.thirdBall = obj.thirdBall;
      analyticsCache.fourthBall = obj.fourthBall;



      var computedJson = obj.playedStrokes;
      var computedJsonP2 = obj.p2AnalyticsSummary;

      var losingStrokesArr = [];
      var losingStrokesInfo = losingStrokes.findOne({});
      if(losingStrokesInfo)
        losingStrokesArr = losingStrokesInfo.losingStrokes;

      if(losingStrokesArr.indexOf(obj.lastShotDestination) == -1 )
      {
        analyticsCache.sequenceLen = obj.combinedStrokes.length;
        analyticsCache.winStroke = obj.lastShot;
        if(analyticsCache.sequenceLen == 2 && obj.serviceBy == obj.player1Name && obj.winner == obj.player2Name)
          analyticsCache.serviceLoss = "yes";
        else if(analyticsCache.sequenceLen == 2 && obj.serviceBy == obj.player2Name && obj.winner == obj.player1Name)
          analyticsCache.serviceLoss = "yes";
        else if(analyticsCache.sequenceLen == 2 && obj.serviceBy == obj.player2Name && obj.winner == obj.player1Name)
          analyticsCache.receiveWin = "yes";
        else if(analyticsCache.sequenceLen == 1 && obj.serviceBy == obj.player1Name && obj.winner == obj.player1Name)
          analyticsCache.serviceWin = "yes";
        else if(analyticsCache.sequenceLen == 1 && obj.serviceBy == obj.player2Name && obj.winner == obj.player2Name)
          analyticsCache.serviceWin = "yes";
        else if(analyticsCache.sequenceLen == 0 && obj.serviceBy == obj.player1Name && obj.winner == obj.player1Name)
          analyticsCache.serviceWin = "yes";
        else if(analyticsCache.sequenceLen == 0 && obj.serviceBy == obj.player2Name && obj.winner == obj.player2Name)
          analyticsCache.serviceWin = "yes";
        else if(analyticsCache.sequenceLen == 0 && obj.serviceBy == obj.player1Name && obj.winner == obj.player2Name)
          analyticsCache.serviceLoss = "yes";
        else if(analyticsCache.sequenceLen == 0 && obj.serviceBy == obj.player2Name && obj.winner == obj.player1Name)
          analyticsCache.serviceLoss = "yes";


      }
      else
      {
        analyticsCache.sequenceLen = obj.combinedStrokes.length - 1;
        if(obj.combinedStrokes.length > 1)
          analyticsCache.winStroke = obj.combinedStrokes[obj.combinedStrokes.length - 2];
        if(analyticsCache.sequenceLen == 2 && obj.serviceBy == obj.player1Name && obj.winner == obj.player2Name)
          analyticsCache.serviceLoss = "yes";
        else if(analyticsCache.sequenceLen == 2 && obj.serviceBy == obj.player2Name && obj.winner == obj.player1Name)
          analyticsCache.serviceLoss = "yes";
        else if(analyticsCache.sequenceLen == 2 && obj.serviceBy == obj.player2Name && obj.winner == obj.player1Name)
          analyticsCache.receiveWin = "yes";
        else if(analyticsCache.sequenceLen == 1 && obj.serviceBy == obj.player1Name && obj.winner == obj.player1Name)
          analyticsCache.serviceWin = "yes";
        else if(analyticsCache.sequenceLen == 1 && obj.serviceBy == obj.player2Name && obj.winner == obj.player2Name)
          analyticsCache.serviceWin = "yes";
        else if(analyticsCache.sequenceLen == 0 && obj.serviceBy == obj.player1Name && obj.winner == obj.player1Name)
          analyticsCache.serviceWin = "yes";
        else if(analyticsCache.sequenceLen == 0 && obj.serviceBy == obj.player2Name && obj.winner == obj.player2Name)
          analyticsCache.serviceWin = "yes";
        else if(analyticsCache.sequenceLen == 0 && obj.serviceBy == obj.player1Name && obj.winner == obj.player2Name)
          analyticsCache.serviceLoss = "yes";
        else if(analyticsCache.sequenceLen == 0 && obj.serviceBy == obj.player2Name && obj.winner == obj.player1Name)
          analyticsCache.serviceLoss = "yes";

      }
      if(obj.combinedStrokes.length >= 2)
      {
        analyticsCache.secondBallShot = obj.strokesPlayed[1].strokeHand;
        analyticsCache.secondBallDestination = obj.strokesPlayed[1].strokeDestination;
      }


      var player1UserInfo = userDetailsTT.findOne({"userName":obj.player1Name,"userId":obj.player1ID});
      var player2UserInfo = userDetailsTT.findOne({"userName":obj.player2Name,"userId":obj.player2ID});
      var player1UserId="";
      var player2UserId="";
      if(player1UserInfo)
        player1UserId = player1UserInfo.userId;
      if(player2UserInfo)
        player2UserId = player2UserInfo.userId;



        

        var player1RegObj = new RegExp('^' +obj.player1Name+'$',"i");
        var player2RegObj = new RegExp('^' +obj.player2Name+'$',"i");

        if(player1UserId != "")
        {
          var userNameEntryInfo = playerDetailsRecord.findOne({"loggerId" :userId,"playerName":{$regex:player1RegObj},"userId":player1UserId});
          if(userNameEntryInfo == undefined)
          {
            var result = playerDetailsRecord.insert({"loggerId":userId,"playerName":obj.player1Name,"playerHand":"Unknown","userId":player1UserId,"foreHandRT":[],"backHandRT":[]});    
            player1Id = result;
          } 
          else
            player1Id = userNameEntryInfo._id;
        }
        else
        {
          
          var userNameEntryInfo = playerDetailsRecord.findOne({"loggerId" :userId,"playerName":{$regex:player1RegObj}});
          if(userNameEntryInfo == undefined)
          {
            var result = playerDetailsRecord.insert({"loggerId":userId,"playerName":obj.player1Name,"playerHand":"Unknown","foreHandRT":[],"backHandRT":[]});    
            player1Id = result;
          } 
          else
          {
            player1Id = userNameEntryInfo._id;
          }
          
        }
        
        if(player2UserId != "")
        {
          var userNameEntryInfo = playerDetailsRecord.findOne({"loggerId" :userId,"playerName":{$regex:player2RegObj},"userId":player2UserId});
          if(userNameEntryInfo == undefined)
          {
            var result = playerDetailsRecord.insert({"loggerId":userId,"playerName":obj.player2Name,"playerHand":"Unknown","userId":player2UserId,"foreHandRT":[],"backHandRT":[]});
            player2Id = result;
          } 
          else
            player2Id = userNameEntryInfo._id;
        }
        else
        {
          var userNameEntryInfo = playerDetailsRecord.findOne({"loggerId" :userId,"playerName":{$regex:player2RegObj}});
          if(userNameEntryInfo == undefined)
          {
            var result = playerDetailsRecord.insert({"loggerId":userId,"playerName":obj.player2Name,"playerHand":"Unknown","foreHandRT":[],"backHandRT":[]});
            player2Id = result;
          } 
          else
            player2Id = userNameEntryInfo._id;
        }
         


     
       
  
      //var player1Entry = playerDetailsRecord.findOne({"loggerId" :userId,"playerName":obj.player1Name});
      //if(player1Entry)
       // player1Id = player1Entry._id;

      //var player2Entry = playerDetailsRecord.findOne({"loggerId" :userId,"playerName":obj.player2Name});
      //if(player2Entry)
       // player2Id = player2Entry._id;
     


   
      var playerSeqInfo1 = sequenceDataRecord.findOne({"loggerId":userId,
        "player1Name":{$regex:player1RegObj},
        "player2Name":{$regex:player2RegObj}, 
        "player1Id" : player1Id,"player2Id":player2Id});

      var playerSeqInfo2 = sequenceDataRecord.findOne({"loggerId":userId,
        "player1Name":{$regex:player2RegObj},
        "player2Name":{$regex:player1RegObj},
        "player1Id":player2Id,"player2Id":player1Id});

      var sequenceArr = [];
      var strokeSummary = [];
      var p1Shots = [];
      var p2Shots = [];



      for(var f=0;f<obj.player1Strokes.length;f++)
      {
          var newJson = {};
          newJson.strokeKey = obj.player1Strokes[f];
          newJson.p1Count = computedJson[obj.player1Strokes[f]];
          newJson.p1Win = "0";
          newJson.p1Loss ="0";
          newJson.p2Count = "0";
          newJson.p2Win = "0";
          newJson.p2Loss = "0";
              
          if(losingStrokesArr.indexOf(obj.lastShotDestination) == -1)
          {
            if(obj.lastShot == obj.player1Strokes[f] && obj.winner == obj.player1Name)
            {          
              newJson.p1Win = "1";
              newJson.p1Loss = "0";                               
            }                       
            if (_.findWhere(strokeSummary, newJson) == null)
            {
              strokeSummary.push(newJson);
              p1Shots.push(obj.player1Strokes[f]);
            }
          }
          else
          {           
            if(obj.p1lastShot == obj.player1Strokes[f] && obj.winner == obj.player1Name)
            {
              newJson.p1Win = "1";
              newJson.p1Loss = "0";                    
            }           
            else if(obj.p1lastShot == obj.player1Strokes[f] && obj.winner == obj.player2Name)
            {
              newJson.p1Win = "0";
              newJson.p1Loss = "1";
            }
            if (_.findWhere(strokeSummary, newJson) == null)
            {
              strokeSummary.push(newJson);
              p1Shots.push(obj.player1Strokes[f]);
            }
          } 
      }


      for(var f=0;f<obj.player2Strokes.length;f++)
      {
          var newJson = {};
          newJson.strokeKey = obj.player2Strokes[f];
          newJson.p1Count = "0";
          newJson.p1Loss = "0";
          newJson.p1Win = "0";
          newJson.p2Count = computedJsonP2[obj.player2Strokes[f]];
          newJson.p2Win = "0";
          newJson.p2Loss ="0";
             
          if(losingStrokesArr.indexOf(obj.lastShotDestination) == -1)
          {                     
            if(obj.lastShot == obj.player2Strokes[f] && obj.winner == obj.player2Name)
            {
              newJson.p2Win = "1";
              newJson.p2Loss = "0";
            }           
          }
          else
          {          
            if(obj.p2lastShot == obj.player2Strokes[f] && obj.winner == obj.player1Name)
            {
              newJson.p2Win = "0";
              newJson.p2Loss = "1";
            }           
            else if(obj.p2lastShot == obj.player2Strokes[f] && obj.winner == obj.player2Name)
            {
              newJson.p2Win = "1";
              newJson.p2Loss = "0";
            }  
          }

          if (_.findWhere(strokeSummary, newJson) == null)
          {
            if(p1Shots.indexOf(obj.player2Strokes[f]) == -1)
            {
                strokeSummary.push(newJson);
            }
            else
            {
              var index = p1Shots.indexOf(obj.player2Strokes[f]);
              strokeSummary[index].p2Count = newJson.p2Count;
              strokeSummary[index].p2Win = newJson.p2Win;
              strokeSummary[index].p2Loss = newJson.p2Loss;
            }
            p2Shots.push(obj.player2Strokes[f]);
          }             
      }

      if(losingStrokesArr.indexOf(obj.lastShotDestination) == -1 )
      {
        var loser = "";
        if(obj.winner == obj.player1Name)
        {
          loser = obj.player2Name;
          var newJson = {};
          newJson.strokeKey = "Unknown-Unknown";
          newJson.p1Count = "0";
          newJson.p1Win = "0";
          newJson.p1Loss ="0";
          newJson.p2Count = "1";
          newJson.p2Win = "0";
          newJson.p2Loss = "1";
          strokeSummary.push(newJson);
        }
        else
        {
          loser = obj.player1Name;
          var newJson = {};
          newJson.strokeKey = "Unknown-Unknown";
          newJson.p1Count = "1";
          newJson.p1Win = "0";
          newJson.p1Loss ="1";
          newJson.p2Count = "0";
          newJson.p2Win = "0";
          newJson.p2Loss = "0";
          strokeSummary.push(newJson);
        }   
      }
      analyticsCache.strokeSum = strokeSummary;

      if(playerSeqInfo1 == undefined && playerSeqInfo2 == undefined)
      {
        if(analyticsCache.serviceBy.toLowerCase() == obj.player1Name.toLowerCase())
          analyticsCache.serviceBy = player1Id;
        else if(analyticsCache.serviceBy.toLowerCase() == obj.player2Name.toLowerCase())
          analyticsCache.serviceBy = player2Id;

        if(analyticsCache.winner.toLowerCase() == obj.player1Name.toLowerCase())
          analyticsCache.winner = player1Id;
        else if(analyticsCache.winner.toLowerCase() == obj.player2Name.toLowerCase())
          analyticsCache.winner = player2Id;
      }


      sequenceData["analyticsCache"] = analyticsCache;
      sequenceArr.push(sequenceData);


      if(obj.rallyType == "partial")
      {
        analyticsCache.winner = "";
        sequenceData["winner"] = "";
        analyticsCache.serviceWin = "no";
        analyticsCache.serviceLoss = "no";
      }

      if(playerSeqInfo1 == undefined && playerSeqInfo2 == undefined)
      {
        for(var q=0; q< sequenceArr.length; q++)
        {
          var sequenceRow = sequenceArr[q];
          for(var w=0;w<sequenceRow.strokesPlayed.length;w++)
          {
            if(sequenceRow.strokesPlayed[w].strokePlayed.toLowerCase() == obj.player1Name.toLowerCase())
              sequenceRow.strokesPlayed[w].strokePlayed = player1Id;
            else if(sequenceRow.strokesPlayed[w].strokePlayed.toLowerCase() == obj.player2Name.toLowerCase())
              sequenceRow.strokesPlayed[w].strokePlayed = player2Id;
          }
        }

        

        sequenceDataRecord.insert({"loggerId":userId,
          "player1Name":obj.player1Name,"player1Id":player1Id,
          "player2Name":obj.player2Name,"player2Id":player2Id,
          "sequence":sequenceArr});
        
      }
      else if(playerSeqInfo1 != undefined && playerSeqInfo2 == undefined)
      {
        if(obj.rallyType == "partial")
          analyticsCache.winner = "";
        else
        {
          if(obj.player1Name == obj.winner)        
            analyticsCache.winner = playerSeqInfo1.player1Name;         
          else if(obj.player2Name == obj.winner)       
            analyticsCache.winner = playerSeqInfo1.player2Name;
          
          if(obj.player1Name == obj.serviceBy)
            analyticsCache.serviceBy = playerSeqInfo1.player1Name;
          else if(obj.player2Name == obj.serviceBy)
            analyticsCache.serviceBy = playerSeqInfo1.player2Name;
        }

        if(analyticsCache.serviceBy.toLowerCase() == obj.player1Name.toLowerCase())
          analyticsCache.serviceBy = player1Id;
        else if(analyticsCache.serviceBy.toLowerCase() == obj.player2Name.toLowerCase())
          analyticsCache.serviceBy = player2Id;

        if(analyticsCache.winner.toLowerCase() == obj.player1Name.toLowerCase())
          analyticsCache.winner = player1Id;
        else if(analyticsCache.winner.toLowerCase() == obj.player2Name.toLowerCase())
          analyticsCache.winner = player2Id;


        
          for(var w=0;w<sequenceData.strokesPlayed.length;w++)
          {

            if(sequenceData.strokesPlayed[w].strokePlayed.toLowerCase() == obj.player1Name.toLowerCase())
              sequenceData.strokesPlayed[w].strokePlayed = player1Id;
            else if(sequenceData.strokesPlayed[w].strokePlayed.toLowerCase() == obj.player2Name.toLowerCase())
              sequenceData.strokesPlayed[w].strokePlayed = player2Id;
          }
        
        if(sequenceData.winner)
          sequenceData.winner = analyticsCache.winner;

        sequenceDataRecord.update({"loggerId":userId,
          "player1Name":{$regex:player1RegObj},"player2Name":{$regex:player2RegObj},
          "player1Id":player1Id,"player2Id":player2Id},
          {$push:{"sequence":sequenceData}});
        
      }
      else if(playerSeqInfo1 == undefined && playerSeqInfo2 != undefined)
      { 
        sequenceDataTemp["playerA"] = obj.playerB;
        sequenceDataTemp["playerB"] = obj.playerA;

        

        var sequenceArr = [];
        var strokeSummary = [];
        var p1Shots = [];
        var p2Shots = [];

        for(var f=0;f<obj.player1Strokes.length;f++)
        {
          var newJson = {};
          newJson.strokeKey = obj.player1Strokes[f];
          newJson.p2Count = computedJson[obj.player1Strokes[f]];
          newJson.p2Win = "0";
          newJson.p2Loss ="0";
          newJson.p1Count = "0";
          newJson.p1Win = "0";
          newJson.p1Loss = "0";
              
          if(losingStrokesArr.indexOf(obj.lastShotDestination) == -1)
          {
            if(obj.lastShot == obj.player1Strokes[f] && obj.winner == obj.player1Name)
            {          
              newJson.p2Win = "1";
              newJson.p2Loss = "0";                               
            }              
            if (_.findWhere(strokeSummary, newJson) == null)
            {
              strokeSummary.push(newJson);
              p1Shots.push(obj.player1Strokes[f]);
            }
          }
          else
          {           
            if(obj.p1lastShot == obj.player1Strokes[f] && obj.winner == obj.player1Name)
            {
              newJson.p2Win = "1";
              newJson.p2Loss = "0";                    
            }           
            else if(obj.p1lastShot == obj.player1Strokes[f] && obj.winner == obj.player2Name)
            {
              newJson.p2Win = "0";
              newJson.p2Loss = "1";
            }
            if (_.findWhere(strokeSummary, newJson) == null)
            {
              strokeSummary.push(newJson);
              p1Shots.push(obj.player1Strokes[f]);
            }
          } 
        }

        for(var f=0;f<obj.player2Strokes.length;f++)
        {
          var newJson = {};
          newJson.strokeKey = obj.player2Strokes[f];
          newJson.p2Count = "0";
          newJson.p2Loss = "0";
          newJson.p2Win = "0";
          newJson.p1Count = computedJsonP2[obj.player2Strokes[f]];
          newJson.p1Win = "0";
          newJson.p1Loss ="0";
             
          if(losingStrokesArr.indexOf(obj.lastShotDestination) == -1)
          {                   
            if(obj.lastShot == obj.player2Strokes[f] && obj.winner == obj.player2Name)
            {
              newJson.p1Win = "1";
              newJson.p1Loss = "0";
            }           
          }
          else
          {          
            if(obj.p2lastShot == obj.player2Strokes[f] && obj.winner == obj.player1Name)
            {
              newJson.p1Win = "0";
              newJson.p1Loss = "1";
            }           
            else if(obj.p2lastShot == obj.player2Strokes[f] && obj.winner == obj.player2Name)
            {
              newJson.p1Win = "1";
              newJson.p1Loss = "0";
            }  
          }

          if (_.findWhere(strokeSummary, newJson) == null)
          {
            if(p1Shots.indexOf(obj.player2Strokes[f]) == -1)
            {
              strokeSummary.push(newJson);
            }
            else
            {
              var index = p1Shots.indexOf(obj.player2Strokes[f]);
              strokeSummary[index].p1Count = newJson.p1Count;
              strokeSummary[index].p1Win = newJson.p1Win;
              strokeSummary[index].p1Loss = newJson.p1Loss;
            }
            p2Shots.push(obj.player2Strokes[f]);
          }             
        }
        if(losingStrokesArr.indexOf(obj.lastShotDestination) == -1 )
        {
          var loser = "";
          if(obj.winner == obj.player1Name)
          {
            loser = obj.player2Name;
            var newJson = {};
            newJson.strokeKey = "Unknown-Unknown";          
            newJson.p1Count = "1";
            newJson.p1Win = "0";
            newJson.p1Loss = "1";
            newJson.p2Count = "0";
            newJson.p2Win = "0";
            newJson.p2Loss ="0";
            strokeSummary.push(newJson);
          }
          else
          {
            loser = obj.player1Name;
            var newJson = {};
            newJson.strokeKey = "Unknown-Unknown";         
            newJson.p1Count = "0";
            newJson.p1Win = "0";
            newJson.p1Loss = "0";
            newJson.p2Count = "1";
            newJson.p2Win = "0";
            newJson.p2Loss ="1";
            strokeSummary.push(newJson);
          }   
        }

        analyticsCache.strokeSum = strokeSummary;


        if(obj.rallyType == "partial")
        {
          analyticsCache.winner = "";
          sequenceDataTemp["winner"] = "";
          analyticsCache.serviceWin = "no";
          analyticsCache.serviceLoss = "no";
        }
        else
        {

          if(obj.player1Name == obj.winner)         
            analyticsCache.winner = playerSeqInfo2.player2Name;         
          else if(obj.player2Name == obj.winner)          
            analyticsCache.winner = playerSeqInfo2.player1Name;
          
          if(obj.player1Name == obj.serviceBy)
            analyticsCache.serviceBy = playerSeqInfo2.player2Name;
          else if(obj.player2Name == obj.serviceBy)
            analyticsCache.serviceBy = playerSeqInfo2.player1Name;

        }

        if(analyticsCache.serviceBy.toLowerCase() == obj.player1Name.toLowerCase())
            analyticsCache.serviceBy = player1Id;
        else if(analyticsCache.serviceBy.toLowerCase() == obj.player2Name.toLowerCase())
          analyticsCache.serviceBy = player2Id;

        if(analyticsCache.winner.toLowerCase() == obj.player1Name.toLowerCase())
          analyticsCache.winner = player1Id;
        else if(analyticsCache.winner.toLowerCase() == obj.player2Name.toLowerCase())
          analyticsCache.winner = player2Id;

       
        for(var w=0;w<sequenceDataTemp.strokesPlayed.length;w++)
        {
          if(sequenceDataTemp.strokesPlayed[w].strokePlayed.toLowerCase() == obj.player1Name.toLowerCase())
            sequenceDataTemp.strokesPlayed[w].strokePlayed = player1Id;
          else if(sequenceDataTemp.strokesPlayed[w].strokePlayed.toLowerCase() == obj.player2Name.toLowerCase())
            sequenceDataTemp.strokesPlayed[w].strokePlayed = player2Id;
        }
        

        if(sequenceDataTemp.winner)
          sequenceDataTemp.winner = analyticsCache.winner;


        sequenceDataTemp["analyticsCache"] = analyticsCache;


        
        sequenceDataRecord.update({"loggerId":userId,
          "player2Name":{$regex:player1RegObj},"player1Name":{$regex:player2RegObj},
          "player2Id":player1Id,"player1Id":player2Id
        },
          {$push:{"sequence":sequenceDataTemp}});

      }
       
      return true;
    }catch(e){
    }
  },
  viewSequence:function(userId,data)
  {
    try
    {
      var result = [];
      var player1Name = data.player1Name;
      var player2Name = data.player2Name;
      var player1ID =  data.player1ID;
      var player2ID = data.player2ID;
      var sort = data.sortFilterValue;
      var dateFilter = data.dateFilter;
      var dateQuery;
      dateQuery = computeDateFilter(dateFilter);

      var raw = playerDetailsRecord.rawCollection();
      var distinct = Meteor.wrapAsync(raw.distinct, raw);
      var leftHandPlayers =  distinct('_id',{"loggerId":userId,playerHand:"LeftHand"});
      var rightHandPlayers =  distinct('_id',{"loggerId":userId,playerHand:"RightHand"});
      var queryForDate2 = {$nin:[null]};
      if(dateQuery != "")     
        queryForDate2 = {$gte:dateQuery};

      if(player2Name.trim() != "All" && player2Name.trim() != "All L/H" && player2Name.trim() != "All R/H")
      {        
        playerSequenceInfo = sequenceDataRecord.aggregate([ 
          {$match: { 
            "loggerId":userId,
            "player1Name":player1Name,"player2Name":player2Name,
            "player1Id":player1ID,"player2Id":player2ID,
            "sequence.sequenceRecordDate" :  queryForDate2,
          }},
          {$unwind : "$sequence"},
          {$sort:{"sequence.sequenceRecordDate":-1}},
          {$match: { 
            "sequence.sequenceRecordDate" :  queryForDate2,
            "sequence.sequenceRecordDate" :  queryForDate2,
          }}, 
          {$project:{
            "player1Name":1,
            "player2Name":1,           
            //"sequence":"$sequence",
            "sequenceRecordDate":"$sequence.sequenceRecordDate",
            "player1Id":1,
            "player2Id":1,
            "playerA":"$sequence.playerA",
            "playerB":"$sequence.playerB"
          }}                  
        ]);

        playerSequenceInfo1 = sequenceDataRecord.aggregate([ 
          {$match: { 
              "loggerId":userId,
              "player2Name":player1Name,"player1Name":player2Name,
              "player2Id":player1ID,"player1Id":player2ID,
              "sequence.sequenceRecordDate" :  queryForDate2
          }},
          {$unwind : "$sequence"},
          {$sort:{"sequence.sequenceRecordDate":-1}},
          {$match: { 
            "sequence.sequenceRecordDate" :  queryForDate2
          }},
          {$project:{"player1Name":1,
            "player2Name":1,   
            "player1Id":1,
            "player2Id":1,   
            //"sequence":"$sequence",
            "sequenceRecordDate":"$sequence.sequenceRecordDate",

            "playerA":"$sequence.playerB",
            "playerB":"$sequence.playerA",
          }}       
        ]);   

        result = playerSequenceInfo.concat(playerSequenceInfo1);
        return result;              
      }
      else if(player2Name.trim() == "All")
      {        
        result = sequenceDataRecord.aggregate([ 
          {$match: 
            {$or:[
              {
                "loggerId":userId,"player1Name":player1Name,
                "sequence.sequenceRecordDate" :  queryForDate2,
                "player1Id":player1ID,
              },
              {
                "loggerId":userId,"player2Name":player1Name,
                "sequence.sequenceRecordDate" :  queryForDate2,
                "player2Id":player1ID,

              }
            ]}
          },
          {$unwind : "$sequence"},
          {$sort:{ "sequence.sequenceRecordDate" : -1}},
          {$match: { "sequence.sequenceRecordDate" :  queryForDate2} },
          {$project:{"player1Name":1,
              "player2Name":1,
              "player1Id":1,
              "player2Id":1,
              "playerA": { $cond: [ { $eq: [ "$player1Name", player1Name ] },"$sequence.playerA", "$sequence.playerB"]},
              "playerB": { $cond: [ { $eq: [ "$player1Name", player1Name ] },"$sequence.playerB", "$sequence.playerA"]},
              //"sequence":"$sequence"
              "sequenceRecordDate":"$sequence.sequenceRecordDate",

            }} 
          ]);  

        return result;        
      }
      else if(player2Name.trim() == "All L/H")
      {        
        result = sequenceDataRecord.aggregate([ 
          {$match: 
            {$or:[
              {
                "loggerId":userId,"player1Name":player1Name,
                "player2Id":{$in:leftHandPlayers},
                "sequence.sequenceRecordDate" :  queryForDate2   ,
                "player1Id":player1ID,

              },
              {
                "loggerId":userId,"player2Name":player1Name,
                "player1Id":{$in:leftHandPlayers},
                "sequence.sequenceRecordDate" :  queryForDate2 ,
                                "player2Id":player1ID,

              }
            ]}
          },
          {$unwind : "$sequence"},
          {$sort:{ "sequence.sequenceRecordDate" : -1}},
          {$match: { "sequence.sequenceRecordDate" :  queryForDate2} },
          {$project:{"player1Name":1,
              "player2Name":1,
              "player1Id":1,
              "player2Id":1,
              "playerA": { $cond: [ { $eq: [ "$player1Name", player1Name ] },"$sequence.playerA", "$sequence.playerB"]},
              "playerB": { $cond: [ { $eq: [ "$player1Name", player1Name ] },"$sequence.playerB", "$sequence.playerA"]},
              //"sequence":"$sequence"
              "sequenceRecordDate":"$sequence.sequenceRecordDate",

            }} 
          ]); 
             
        return result;        
      }
      else if(player2Name.trim() == "All R/H")
      {
        result = sequenceDataRecord.aggregate([ 
          {$match: 
            {$or:[
              {
                "loggerId":userId,"player1Name":player1Name,
                "player2Id":{$in:rightHandPlayers},
                "sequence.sequenceRecordDate" :  queryForDate2 ,
                "player1Id":player1ID,
  
              },
              {
                "loggerId":userId,"player2Name":player1Name,
                "player1Id":{$in:rightHandPlayers},
                "sequence.sequenceRecordDate" :  queryForDate2 ,
                "player2Id":player1ID,

              }
            ]}
          },
          {$unwind : "$sequence"},
          {$sort:{ "sequence.sequenceRecordDate" : -1}},
          {$match: { "sequence.sequenceRecordDate" :  queryForDate2} },
          {$project:{"player1Name":1,
              "player2Name":1,
              "player1Id":1,
              "player2Id":1,
              "playerA": { $cond: [ { $eq: [ "$player1Name", player1Name ] },"$sequence.playerA", "$sequence.playerB"]},
              "playerB": { $cond: [ { $eq: [ "$player1Name", player1Name ] },"$sequence.playerB", "$sequence.playerA"]},
              //"sequence":"$sequence"
              "sequenceRecordDate":"$sequence.sequenceRecordDate",

            }} 
          ]); 
   
        return result;
           
      }

    }catch(e){

    }
  },

  deleteSequence:async function(userId,data)
  {
    try
    {
      var resultJson = {};
      var player1Name = data.player1Name;
      var player2Name = data.player2Name;
      var player1Id = data.player1Id;
      var player2Id = data.player2Id;
      var momentDate = new Date(data.sequenceDate);

      var result = sequenceDataRecord.update({ "loggerId":userId,"player1Id" : player1Id ,
       "player2Id" :player2Id},
        {$pull : { "sequence":{"sequenceRecordDate":momentDate } }} );
      
      if(result)
      {

        resultJson["status"] = "success";
        resultJson["message"] = "sequence deleted"
      }
      if(result && data.viewSeqParam && typeof data.viewSeqParam == "string")
      {
        if(typeof data.viewSeqParam == "string")
        {
          var  data1 = data.viewSeqParam.replace("\\", "");
          data2 = JSON.parse(data1);
          var seqResult = await Meteor.call("viewSequence",userId,data2);
          resultJson["data"] = seqResult;
        }
        else
        {
          var seqResult = await Meteor.call("viewSequence",userId,data.viewSeqParam);
          resultJson["data"] = seqResult;
        }
        
        
      }

      return resultJson;


      /*
      */
    }catch(e){

      var resultJson = {};
      resultJson["status"] = "failure";
      resultJson["message"] = "could not delete sequence";
      return resultJson;
    }
  },
  fetchSequenceRecord:function(userId,data)
  {
    try
    {
   
      var player1ID = data.player1Id;
      var player2ID = data.player2Id;
      var momentDate = new Date(data.sequenceDate);
      var selectedPlayer1Id = data.selectedPlayer1Id;
      var playerSequenceInfo;
      var checkEntry = sequenceDataRecord.find({
        "loggerId":userId,
        "player1Id":player1ID,
        "player2Id":player2ID,
        "sequence.sequenceRecordDate" :  momentDate
      })
      if(checkEntry)
      {
        playerSequenceInfo = sequenceDataRecord.aggregate([ 
          {$match: { 
            "loggerId":userId,
            "player1Id":player1ID,"player2Id":player2ID,
            "sequence.sequenceRecordDate" :  momentDate,
          }},
          {$unwind : "$sequence"},
          {$match: { 
            "sequence.sequenceRecordDate" :  momentDate,
          }}, 
          {$project:{
            "player1Name": { $cond: [ { $eq: [ "$player1Id", selectedPlayer1Id ] },"$player1Name", "$player2Name"]},
            "player2Name": { $cond: [ { $eq: [ "$player1Id", selectedPlayer1Id ] },"$player2Name", "$player1Name"]},
            "player1Id": { $cond: [ { $eq: [ "$player1Id", selectedPlayer1Id ] },"$player1Id", "$player2Id"]},
            "player2Id": { $cond: [ { $eq: [ "$player1Id", selectedPlayer1Id ] },"$player2Id", "$player1Id"]},
            "playerA": { $cond: [ { $eq: [ "$player1Id", selectedPlayer1Id ] },"$sequence.playerA", "$sequence.playerB"]},
            "playerB": { $cond: [ { $eq: [ "$player1Id", selectedPlayer1Id ] },"$sequence.playerB", "$sequence.playerA"]},
            //"sequence":"$sequence",
            "matchDate":"$sequence.matchDate",
            "rallyType":"$sequence.rallyType",
            "strokesPlayed":"$sequence.strokesPlayed",
            "sequenceRecordDate":"$sequence.sequenceRecordDate",
            "serviceBy":"$sequence.analyticsCache.serviceBy",
            "winner":"$sequence.analyticsCache.winner",



          }}                  
        ]);
      }
      else
      {

        checkEntry = sequenceDataRecord.find({
          "loggerId":userId,
          "player2Id":player1ID,
          "player1Id":player2ID,
          "sequence.sequenceRecordDate" :  momentDate
        });
        if(checkEntry)
          playerSequenceInfo = sequenceDataRecord.aggregate([ 
          {$match: { 
              "loggerId":userId,
              "player2Id":player1ID,"player1Id":player2ID,
              "sequence.sequenceRecordDate" :  momentDate
          }},
          {$unwind : "$sequence"},
          {$match: { 
            "sequence.sequenceRecordDate" :  momentDate
          }},
          {$project:{
            "plere":"$player1Id",
            "player1Name": { $cond: [ { $eq: [ "$player1Id", selectedPlayer1Id ] },"$player1Name", "$player2Name"]},
            "player2Name": { $cond: [ { $eq: [ "$player1Id", selectedPlayer1Id ] },"$player2Name", "$player1Name"]},
            "player1Id": { $cond: [ { $eq: [ "$player1Id", selectedPlayer1Id ] },"$player1Id", "$player2Id"]},
            "player2Id": { $cond: [ { $eq: [ "$player1Id", selectedPlayer1Id ] },"$player2Id", "$player1Id"]},
            "playerA": { $cond: [ { $eq: [ "$player1Id", selectedPlayer1Id ] },"$sequence.playerA", "$sequence.playerB"]},
            "playerB": { $cond: [ { $eq: [ "$player1Id", selectedPlayer1Id ] },"$sequence.playerB", "$sequence.playerA"]},
            //"sequence":"$sequence",
            "matchDate":"$sequence.matchDate",
            "rallyType":"$sequence.rallyType",
            "strokesPlayed":"$sequence.strokesPlayed",
            "sequenceRecordDate":"$sequence.sequenceRecordDate",
            "serviceBy":"$sequence.analyticsCache.serviceBy",
            "winner":"$sequence.analyticsCache.winner",


          }}       
        ]);   


      }

      if(playerSequenceInfo.length > 0)
      {
        var resultJson = {};
        resultJson["status"] = "success";
        resultJson["data"] = playerSequenceInfo[0];

      }
      else
      {
        var resultJson = {};
        resultJson["status"] = "success";
        resultJson["data"] = "No data";
      }

        return resultJson;

    }catch(e){
    }
  },
  shareSequence:async function(sequenceData)
  {
    try
    {
      sequenceData = sequenceData.replace("\\", "");
      var data = JSON.parse(sequenceData);

      var loggerId = data.loggerId;
      var sharedId = data.sharedId;
      var player1Name = data.player1Name;
      var player2Name = data.player2Name;
      var player1ID = data.player1ID;
      var player2ID = data.player2ID;

   
      
      var raw = playerDetailsRecord.rawCollection();
      var distinct = Meteor.wrapAsync(raw.distinct, raw);
      var leftHandPlayers =  distinct('_id',{"loggerId":loggerId,playerHand:"LeftHand"});
      var rightHandPlayers =  distinct('_id',{"loggerId":loggerId,playerHand:"RightHand"});
   
      if(player2Name.trim() == "All" || player2Name.trim() == "All L/H" || player2Name.trim() == "All R/H")
      {
        var resultSet = "";
        var result = await Meteor.call("shareSequenceInHaul",data)
        try
          {
            if(result)
              resultSet = "success";

          }catch(e){

          }
        if(resultSet == "success")
          return true;
        else
          return false;


        var searchPlayers = {$nin:[null,""]};
        if(player2Name.trim() == "All L/H")
          searchPlayers = {$in:leftHandPlayers};
        if(player2Name.trim() == "All R/H")
          searchPlayers = {$in:rightHandPlayers};
        var setOfPlayersResult = sequenceDataRecord.aggregate([
          {$match:
            {$or:[
              { "loggerId":loggerId,
                "player1Id":player1ID,
                "player1Name":player1Name,
                "player2Id":searchPlayers
              },
              {
                "loggerId":loggerId,
                "player2Id" : player1ID,
                "player2Name":player1Name,
                "player1Id":searchPlayers
              }
            ]
          }},
          {$group:{
            _id:{
              "playerName":{
                "$cond": {
                  "if": { "$eq": ["$player1Id",player1ID]}, 
                  "then": "$player2Name", 
                  "else": "$player1Name"
                }
              },
              "userId":{
                "$cond": {
                  "if": { "$eq": ["$player1Id",player1ID]}, 
                  "then": "$player2Id", 
                  "else": "$player1Id"
                }
              }
            }  
          }},
          {$project:{
            "userId":"$_id.userId",
            "playerName":"$_id.playerName",
            "_id":0
          }},
          {$group:{
            _id:null,
            "setOfPlayers":{$push:{"userId":"$userId","playerName":"$playerName"}},
            "idSet":{$push:"$userId"}
          }}
        ]);
        var idSet = [];
        var setOfPlayers = [];
        if(setOfPlayersResult.length > 0)
        {
          idSet = setOfPlayersResult[0].idSet;
          setOfPlayers = setOfPlayersResult[0].setOfPlayers;
        }


        result1 = sequenceDataRecord.update({ "loggerId":loggerId,"player1Id" : player1ID,"player1Name":player1Name},
         {$set:{"loggerId":sharedId}},{multi:true});
        result2 = sequenceDataRecord.update({ "loggerId":loggerId,"player2Id" : player1ID,"player2Name":player1Name},
          {$set:{"loggerId":sharedId}},{multi:true});

        var info = playerDetailsRecord.aggregate([
          {$match:{"loggerId":loggerId,
          "_id":{$in:idSet}
          }},        
          {$project:{
            "loggerId": {$literal: sharedId},
            "playerName":1,
            "playerHand":1,
            "foreHandRT":1,
            "backHandRT":1,
            "userId":1,
            "tempId": "$_id",
            "_id":0
          }}
        ]);

        for(var v=0;v<info.length;v++)
        {
          var userId = null;
          var tempId = null;
          if(info[v].userId != undefined)
            userId = info[v].userId;
          if(info[v].tempId != undefined)
            tempId = info[v].tempId
          var checkEntry = playerDetailsRecord.findOne({"loggerId":sharedId,"playerName":info[v].playerName,"userId":userId});
          var sequenceDataRecordID = "";
          var sequenceDataRecordInfo = sequenceDataRecord.findOne({"loggerId":sharedId,"player1Id" : player1ID,"player2Id":tempId});
          if(sequenceDataRecordInfo)
            sequenceDataRecordID = sequenceDataRecordInfo._id;
          else
          {
            var sequenceDataRecordInfo = sequenceDataRecord.findOne({"loggerId":sharedId,"player2Id" : player1ID,"player1Id":tempId});
            if(sequenceDataRecordInfo)
              sequenceDataRecordID = sequenceDataRecordInfo._id;
          }

          if(checkEntry)
          { 
            var foreHandRT = checkEntry.foreHandRT.concat(info[v].foreHandRT);
            var backHandRT = checkEntry.backHandRT.concat(info[v].backHandRT);
            var foreHandRTList = _.uniq(foreHandRT, v => [v.rubberDate, v.rubberType].join());
            var backHandRTList = _.uniq(backHandRT, v => [v.rubberDate, v.rubberType].join());
            var result = playerDetailsRecord.update({"_id":checkEntry._id},{$set:{
              "playerHand":info[v].playerHand,"foreHandRT":foreHandRTList,"backHandRT":backHandRTList
            }});
            var firstCheck = sequenceDataRecord.findOne({"_id":sequenceDataRecordID,"player2Name":info[v].playerName});
            if(firstCheck)
            {
              sequenceDataRecord.update({"_id":sequenceDataRecordID,"player2Name":info[v].playerName},
              {$set:{"player2Id":checkEntry._id}});
              var entry = firstCheck;
              var oldPlayer2Id = firstCheck.player2Id;
              var seqquenceID = entry._id;
              if(entry)
              {
                  for(var m=0; m<entry.sequence.length;m++)
                  {
                    if(entry.sequence[m].analyticsCache.serviceBy == oldPlayer2Id)
                      entry.sequence[m].analyticsCache.serviceBy = checkEntry._id;
                    if(entry.sequence[m].analyticsCache.winner == oldPlayer2Id)
                      entry.sequence[m].analyticsCache.winner = checkEntry._id;
                    
                    for(var n=0;n<entry.sequence[m].strokesPlayed.length;n++)
                    {
                      if(entry.sequence[m].strokesPlayed[n].strokePlayed == oldPlayer2Id)
                        entry.sequence[m].strokesPlayed[n].strokePlayed = checkEntry._id;
                    }


                    sequenceDataRecord.update({
                    "_id":sequenceDataRecordID,                   
                    "sequence.sequenceRecordDate":entry.sequence[m].sequenceRecordDate
                    },
                    {$set:{
                      "sequence.$.analyticsCache" : entry.sequence[m].analyticsCache,
                      "sequence.$.strokesPlayed":entry.sequence[m].strokesPlayed
                    }}
                    );
                  }
              }
            }
            var secondCheck = sequenceDataRecord.findOne({"_id":sequenceDataRecordID,"player1Name":info[v].playerName});
            if(secondCheck)
            {
              sequenceDataRecord.update({"_id":sequenceDataRecordID,"player1Name":info[v].playerName},
              {$set:{"player1Id":checkEntry._id}});  

              var entry = secondCheck;
              var oldPlayer2Id = secondCheck.player1Id;
              var seqquenceID = entry._id;
              if(entry)
              {
                  for(var m=0; m<entry.sequence.length;m++)
                  {
                    if(entry.sequence[m].analyticsCache.serviceBy == oldPlayer2Id)
                      entry.sequence[m].analyticsCache.serviceBy = checkEntry._id;
                    if(entry.sequence[m].analyticsCache.winner == oldPlayer2Id)
                      entry.sequence[m].analyticsCache.winner = checkEntry._id;
                    
                    for(var n=0;n<entry.sequence[m].strokesPlayed.length;n++)
                    {
                      if(entry.sequence[m].strokesPlayed[n].strokePlayed == oldPlayer2Id)
                        entry.sequence[m].strokesPlayed[n].strokePlayed = checkEntry._id;
                    }


                    sequenceDataRecord.update({
                    "_id":sequenceDataRecordID,                   
                    "sequence.sequenceRecordDate":entry.sequence[m].sequenceRecordDate
                    },
                    {$set:{
                      "sequence.$.analyticsCache" : entry.sequence[m].analyticsCache,
                      "sequence.$.strokesPlayed":entry.sequence[m].strokesPlayed
                    }}
                    );
                  }
              }


            }
                            
          }
          else
          {
            var player_id = playerDetailsRecord.insert(info[v]);  
            var firstCheck = sequenceDataRecord.findOne({"_id":sequenceDataRecordID,"player2Name":info[v].playerName});
            if(firstCheck)
            {
              sequenceDataRecord.update({"_id":sequenceDataRecordID,"player2Name":info[v].playerName},
              {$set:{"player2Id":player_id}});
              var entry = firstCheck;
              var oldPlayer2Id = firstCheck.player2Id;
              var seqquenceID = entry._id;
              if(entry)
              {
                  for(var m=0; m<entry.sequence.length;m++)
                  {
                    if(entry.sequence[m].analyticsCache.serviceBy == oldPlayer2Id)
                      entry.sequence[m].analyticsCache.serviceBy = player_id;
                    if(entry.sequence[m].analyticsCache.winner == oldPlayer2Id)
                      entry.sequence[m].analyticsCache.winner = player_id;
                    
                    for(var n=0;n<entry.sequence[m].strokesPlayed.length;n++)
                    {
                      if(entry.sequence[m].strokesPlayed[n].strokePlayed == oldPlayer2Id)
                        entry.sequence[m].strokesPlayed[n].strokePlayed = player_id;
                    }


                    sequenceDataRecord.update({
                    "_id":sequenceDataRecordID,                   
                    "sequence.sequenceRecordDate":entry.sequence[m].sequenceRecordDate
                    },
                    {$set:{
                      "sequence.$.analyticsCache" : entry.sequence[m].analyticsCache,
                      "sequence.$.strokesPlayed":entry.sequence[m].strokesPlayed
                    }}
                    );
                  }
              }
            }
            var secondCheck = sequenceDataRecord.findOne({"_id":sequenceDataRecordID,"player1Name":info[v].playerName});
            if(secondCheck)
            {
              sequenceDataRecord.update({"_id":sequenceDataRecordID,"player1Name":info[v].playerName},
              {$set:{"player1Id":player_id}}); 
               var entry = secondCheck;
              var oldPlayer2Id = secondCheck.player1Id;
              var seqquenceID = entry._id;
              if(entry)
              {
                  for(var m=0; m<entry.sequence.length;m++)
                  {
                    if(entry.sequence[m].analyticsCache.serviceBy == oldPlayer2Id)
                      entry.sequence[m].analyticsCache.serviceBy = player_id;
                    if(entry.sequence[m].analyticsCache.winner == oldPlayer2Id)
                      entry.sequence[m].analyticsCache.winner = player_id;
                    
                    for(var n=0;n<entry.sequence[m].strokesPlayed.length;n++)
                    {
                      if(entry.sequence[m].strokesPlayed[n].strokePlayed == oldPlayer2Id)
                        entry.sequence[m].strokesPlayed[n].strokePlayed = player_id;
                    }


                    sequenceDataRecord.update({
                    "_id":sequenceDataRecordID,                   
                    "sequence.sequenceRecordDate":entry.sequence[m].sequenceRecordDate
                    },
                    {$set:{
                      "sequence.$.analyticsCache" : entry.sequence[m].analyticsCache,
                      "sequence.$.strokesPlayed":entry.sequence[m].strokesPlayed
                    }}
                    );
                  }
              }

            }

                            
          }
        }
              
        var player1Info = playerDetailsRecord.findOne({"loggerId":loggerId,
          "_id":player1ID});
        if(player1Info)
        {
          var userId = null;
          if(player1Info.userId != undefined)
            userId = player1Info.userId;
          var tempId = player1Info._id
          var checkEntry = playerDetailsRecord.findOne({"loggerId":sharedId,"playerName":player1Info.playerName,"userId":userId});       
          if(checkEntry)
          { 
            var foreHandRT = checkEntry.foreHandRT.concat(player1Info.foreHandRT);
            var backHandRT = checkEntry.backHandRT.concat(player1Info.backHandRT);
            var foreHandRTList = _.uniq(foreHandRT, v => [v.rubberDate, v.rubberType].join());
            var backHandRTList = _.uniq(backHandRT, v => [v.rubberDate, v.rubberType].join());
            var result = playerDetailsRecord.update({"_id":checkEntry._id},{$set:{
              "playerHand":player1Info.playerHand,"foreHandRT":foreHandRTList,"backHandRT":backHandRTList
            }});
                   
            var entryList = sequenceDataRecord.find({"player1Id":player1ID}).fetch();
            for(var b=0;b<entryList.length;b++)
            {
              var entry = entryList[b];
              var sequenceDataRecordID = entry._id;
              var oldPlayer2Id = firstCheck.player2Id;
              if(entry)
              {
                  for(var m=0; m<entry.sequence.length;m++)
                  {
                    if(entry.sequence[m].analyticsCache.serviceBy == player1ID)
                      entry.sequence[m].analyticsCache.serviceBy = checkEntry._id;
                    if(entry.sequence[m].analyticsCache.winner == player1ID)
                      entry.sequence[m].analyticsCache.winner = checkEntry._id;
                    
                    for(var n=0;n<entry.sequence[m].strokesPlayed.length;n++)
                    {
                      if(entry.sequence[m].strokesPlayed[n].strokePlayed == player1ID)
                        entry.sequence[m].strokesPlayed[n].strokePlayed = checkEntry._id;
                    }


                    sequenceDataRecord.update({
                    "_id":sequenceDataRecordID,                   
                    "sequence.sequenceRecordDate":entry.sequence[m].sequenceRecordDate
                    },
                    {$set:{
                      "sequence.$.analyticsCache" : entry.sequence[m].analyticsCache,
                      "sequence.$.strokesPlayed":entry.sequence[m].strokesPlayed
                    }}
                    );
                  }
              }
            }
            sequenceDataRecord.update({"player1Id":player1ID},
              {$set:{"player1Id":checkEntry._id}},{multi:true});



            var entryList = sequenceDataRecord.find({"player2Id":player1ID}).fetch();
            for(var b=0;b<entryList.length;b++)
            {
              var entry = entryList[b];
              var sequenceDataRecordID = entry._id;
              if(entry)
              {
                  for(var m=0; m<entry.sequence.length;m++)
                  {
                    if(entry.sequence[m].analyticsCache.serviceBy == player1ID)
                      entry.sequence[m].analyticsCache.serviceBy = checkEntry._id;
                    if(entry.sequence[m].analyticsCache.winner == player1ID)
                      entry.sequence[m].analyticsCache.winner = checkEntry._id;
                    
                    for(var n=0;n<entry.sequence[m].strokesPlayed.length;n++)
                    {
                      if(entry.sequence[m].strokesPlayed[n].strokePlayed == player1ID)
                        entry.sequence[m].strokesPlayed[n].strokePlayed = checkEntry._id;
                    }


                    sequenceDataRecord.update({
                    "_id":sequenceDataRecordID,                   
                    "sequence.sequenceRecordDate":entry.sequence[m].sequenceRecordDate
                    },
                    {$set:{
                      "sequence.$.analyticsCache" : entry.sequence[m].analyticsCache,
                      "sequence.$.strokesPlayed":entry.sequence[m].strokesPlayed
                    }}
                    );
                  }
              }
            }

            sequenceDataRecord.update({"player2Id":player1ID},
              {$set:{"player2Id":checkEntry._id}},{multi:true});                    
          }
          else
          {
            var player_id = playerDetailsRecord.insert({"playerName":player1Info.playerName,"playerHand":player1Info.playerHand,
              "foreHandRT":player1Info.foreHandRT,"backHandRT":player1Info.backHandRT,"loggerId":sharedId
            });

            var entryList = sequenceDataRecord.find({"player1Id":player1ID}).fetch();
            for(var b=0;b<entryList.length;b++)
            {
              var entry = entryList[b];
              var sequenceDataRecordID = entry._id;
              var oldPlayer2Id = firstCheck.player2Id;
              if(entry)
              {
                  for(var m=0; m<entry.sequence.length;m++)
                  {
                    if(entry.sequence[m].analyticsCache.serviceBy == player1ID)
                      entry.sequence[m].analyticsCache.serviceBy = player_id;
                    if(entry.sequence[m].analyticsCache.winner == player1ID)
                      entry.sequence[m].analyticsCache.winner = player_id;
                    
                    for(var n=0;n<entry.sequence[m].strokesPlayed.length;n++)
                    {
                      if(entry.sequence[m].strokesPlayed[n].strokePlayed == player1ID)
                        entry.sequence[m].strokesPlayed[n].strokePlayed = player_id;
                    }


                    sequenceDataRecord.update({
                    "_id":sequenceDataRecordID,                   
                    "sequence.sequenceRecordDate":entry.sequence[m].sequenceRecordDate
                    },
                    {$set:{
                      "sequence.$.analyticsCache" : entry.sequence[m].analyticsCache,
                      "sequence.$.strokesPlayed":entry.sequence[m].strokesPlayed
                    }}
                    );
                  }
              }
            }

            sequenceDataRecord.update({"player1Id":player1ID},
              {$set:{"player1Id":player_id}},{multi:true});

            /****************************************/

            var entryList = sequenceDataRecord.find({"player2Id":player1ID}).fetch();
            for(var b=0;b<entryList.length;b++)
            {
              var entry = entryList[b];
              var sequenceDataRecordID = entry._id;
              if(entry)
              {
                  for(var m=0; m<entry.sequence.length;m++)
                  {
                    if(entry.sequence[m].analyticsCache.serviceBy == player1ID)
                      entry.sequence[m].analyticsCache.serviceBy = player_id;
                    if(entry.sequence[m].analyticsCache.winner == player1ID)
                      entry.sequence[m].analyticsCache.winner = player_id;
                    
                    for(var n=0;n<entry.sequence[m].strokesPlayed.length;n++)
                    {
                      if(entry.sequence[m].strokesPlayed[n].strokePlayed == player1ID)
                        entry.sequence[m].strokesPlayed[n].strokePlayed = player_id;
                    }


                    sequenceDataRecord.update({
                    "_id":sequenceDataRecordID,                   
                    "sequence.sequenceRecordDate":entry.sequence[m].sequenceRecordDate
                    },
                    {$set:{
                      "sequence.$.analyticsCache" : entry.sequence[m].analyticsCache,
                      "sequence.$.strokesPlayed":entry.sequence[m].strokesPlayed
                    }}
                    );
                  }
              }
            }

            sequenceDataRecord.update({"player2Id":player1ID},
              {$set:{"player2Id":player_id}},{multi:true});               
          }
        }

        var shareCount = parseInt(result1)+parseInt(result2);
        var sharedHistory = {"loggerId":loggerId,
          "sharedId":sharedId,
          "player1Name":player1Name,
          "player2Name":player2Name,
          "sequenceCount":shareCount,
          "playerList":setOfPlayers
        };
        sequenceShareHistory.insert(sharedHistory);
        
      }     
      else
      {
        var resultSet = "";
        var result = await Meteor.call("shareDistinctSequence",data)
        try
          {
            if(result)
              resultSet = "success";

          }catch(e){}
        if(resultSet == "success")
          return true;
        else
          return false;
        var setOfPlayers = [{"userId":player1ID,"playerName":player1Name},{"userId":player2ID,"playerName":player2Name}];
        result1 = sequenceDataRecord.update({ "loggerId":loggerId,"player1Id" : player1ID,"player1Name":player1Name,"player2Id":player2ID,"player2Name":player2Name},
          {$set:{"loggerId":sharedId}});
        result2 = sequenceDataRecord.update({ "loggerId":loggerId,"player1Id" : player2ID,"player1Name":player2Name,"player2Id":player1ID,"player2Name":player1Name},
         {$set:{"loggerId":sharedId}});
        var sequenceDataRecordID = "";
        var sequenceDataRecordInfo = sequenceDataRecord.findOne({"loggerId":sharedId,"player1Id" : player1ID,"player2Id":player2ID});
        if(sequenceDataRecordInfo)
          sequenceDataRecordID = sequenceDataRecordInfo._id;
        else
        {
          var sequenceDataRecordInfo = sequenceDataRecord.findOne({"loggerId":sharedId,"player2Id" : player1ID,"player1Id":player2ID});
          if(sequenceDataRecordInfo)
            sequenceDataRecordID = sequenceDataRecordInfo._id;
        }

       
        var info = playerDetailsRecord.aggregate([
          {$match:{"loggerId":loggerId,_id:{$in:[player1ID,player2ID]}}},
          {$project:{
            "loggerId": {$literal: sharedId},
            "playerName":1,
            "playerHand":1,
            "foreHandRT":1,
            "backHandRT":1,
            "userId":1,
            "tempId": "$_id",
            "_id":0
          }}
        ]);

        var detailsEntry = sequenceDataRecord.findOne({"_id":sequenceDataRecordID});
        if(detailsEntry)
        {
          oldPlayer2Id = detailsEntry.player2Id;
          oldPlayer1Id = detailsEntry.player1Id;
        }

        for(var v=0;v<info.length;v++)
        {
          var userId = null;
          var tempId = null;
          if(info[v].userId != undefined)
            userId = info[v].userId;
          if(info[v].tempId != undefined)
            tempId = info[v].tempId
          var checkEntry = playerDetailsRecord.findOne({"loggerId":sharedId,"playerName":info[v].playerName,"userId":userId});

          if(checkEntry)
          { 
            var foreHandRT = info[v].foreHandRT;
            var backHandRT = info[v].backHandRT;
            if(checkEntry.foreHandRT)
              foreHandRT = checkEntry.foreHandRT.concat(info[v].foreHandRT);
            if(checkEntry.backHandRT)
              backHandRT = checkEntry.backHandRT.concat(info[v].backHandRT);
            var foreHandRTList = _.uniq(foreHandRT, v => [v.rubberDate, v.rubberType].join());
            var backHandRTList = _.uniq(backHandRT, v => [v.rubberDate, v.rubberType].join());
            var result = playerDetailsRecord.update({"_id":checkEntry._id},{$set:{
              "playerHand":info[v].playerHand,"foreHandRT":foreHandRTList,"backHandRT":backHandRTList
            }});

            if(info[v].playerName == player2Name)
            {
              var firstCheck = sequenceDataRecord.findOne({"_id":sequenceDataRecordID,"player2Name":player2Name});
              if(firstCheck)
              {
                sequenceDataRecord.update({"_id":sequenceDataRecordID,"player2Name":player2Name},
                {$set:{"player2Id":checkEntry._id}});

                var entry = firstCheck;
                //var oldPlayer2Id = firstCheck.player2Id;
                var seqquenceID = entry._id;
                if(entry)
                {
                
                  for(var m=0; m<entry.sequence.length;m++)
                  {
                    if(entry.sequence[m].analyticsCache.serviceBy == oldPlayer2Id)
                      entry.sequence[m].analyticsCache.serviceBy = checkEntry._id;
                    if(entry.sequence[m].analyticsCache.winner == oldPlayer2Id)
                      entry.sequence[m].analyticsCache.winner = checkEntry._id;
                    
                    for(var n=0;n<entry.sequence[m].strokesPlayed.length;n++)
                    {
                      if(entry.sequence[m].strokesPlayed[n].strokePlayed == oldPlayer2Id)
                        entry.sequence[m].strokesPlayed[n].strokePlayed = checkEntry._id;
     
                    }


                  sequenceDataRecord.update({
                  "_id":sequenceDataRecordID,                   
                  "sequence.sequenceRecordDate":entry.sequence[m].sequenceRecordDate
                      },
                      {$set:{
                      "sequence.$.analyticsCache" : entry.sequence[m].analyticsCache,
                      "sequence.$.strokesPlayed":entry.sequence[m].strokesPlayed
                      }}
                    );

                  }
                }

              }
              
              var secondCheck = sequenceDataRecord.findOne({"_id":sequenceDataRecordID,"player1Name":player2Name});
              if(secondCheck)
              {
                sequenceDataRecord.update({"_id":sequenceDataRecordID,"player1Name":player2Name},
                {$set:{"player1Id":checkEntry._id}});
                var entry = secondCheck;
                //var oldPlayer2Id = secondCheck.player1Id;
                var seqquenceID = entry._id;


                if(entry)
                {
                  
                  for(var m=0; m<entry.sequence.length;m++)
                  {
                    if(entry.sequence[m].analyticsCache.serviceBy == oldPlayer1Id)
                      entry.sequence[m].analyticsCache.serviceBy = checkEntry._id;
                    if(entry.sequence[m].analyticsCache.winner == oldPlayer1Id)
                      entry.sequence[m].analyticsCache.winner = checkEntry._id;
                    
                    for(var n=0;n<entry.sequence[m].strokesPlayed.length;n++)
                    {
                      if(entry.sequence[m].strokesPlayed[n].strokePlayed == oldPlayer1Id)
                        entry.sequence[m].strokesPlayed[n].strokePlayed = checkEntry._id;
     
                    }


                  sequenceDataRecord.update({
                  "_id":sequenceDataRecordID,                   
                  "sequence.sequenceRecordDate":entry.sequence[m].sequenceRecordDate
                      },
                      {$set:{
                      "sequence.$.analyticsCache" : entry.sequence[m].analyticsCache,
                      "sequence.$.strokesPlayed":entry.sequence[m].strokesPlayed
                      }}
                    );

                  }
                }
              }
              
              
            }
            else if(info[v].playerName == player1Name)
            {
              var firstCheck =sequenceDataRecord.findOne({"_id":sequenceDataRecordID,"player1Name":player1Name})
              if(firstCheck)
              {
                sequenceDataRecord.update({"_id":sequenceDataRecordID,"player1Name":player1Name},
                {$set:{"player1Id":checkEntry._id}});
                var entry = firstCheck;
                //var oldPlayer2Id = firstCheck.player1Id;
                var seqquenceID = entry._id;
                if(entry)
                {
                
                  for(var m=0; m<entry.sequence.length;m++)
                  {
                    if(entry.sequence[m].analyticsCache.serviceBy == oldPlayer1Id)
                      entry.sequence[m].analyticsCache.serviceBy = checkEntry._id;
                    if(entry.sequence[m].analyticsCache.winner == oldPlayer1Id)
                      entry.sequence[m].analyticsCache.winner = checkEntry._id;
                    
                    for(var n=0;n<entry.sequence[m].strokesPlayed.length;n++)
                    {
                      if(entry.sequence[m].strokesPlayed[n].strokePlayed == oldPlayer1Id)
                        entry.sequence[m].strokesPlayed[n].strokePlayed = checkEntry._id;
     
                    }


                  sequenceDataRecord.update({
                  "_id":sequenceDataRecordID,                   
                  "sequence.sequenceRecordDate":entry.sequence[m].sequenceRecordDate
                      },
                      {$set:{
                      "sequence.$.analyticsCache" : entry.sequence[m].analyticsCache,
                      "sequence.$.strokesPlayed":entry.sequence[m].strokesPlayed
                      }}
                    );

                  }
                }
              }

              var secondCheck = sequenceDataRecord.findOne({"_id":sequenceDataRecordID,"player2Name":player1Name});
              if(secondCheck)
              {
                sequenceDataRecord.update({"_id":sequenceDataRecordID,"player2Name":player1Name},
                {$set:{"player2Id":checkEntry._id}});
                var entry = secondCheck;
                //var oldPlayer2Id = secondCheck.player2Id;
                var seqquenceID = entry._id;
                if(entry)
                {
                  


                  for(var m=0; m<entry.sequence.length;m++)
                  {
                    if(entry.sequence[m].analyticsCache.serviceBy == oldPlayer2Id)
                      entry.sequence[m].analyticsCache.serviceBy = checkEntry._id;
                    if(entry.sequence[m].analyticsCache.winner == oldPlayer2Id)
                      entry.sequence[m].analyticsCache.winner = checkEntry._id;
                    
                    for(var n=0;n<entry.sequence[m].strokesPlayed.length;n++)
                    {
                      if(entry.sequence[m].strokesPlayed[n].strokePlayed == oldPlayer2Id)
                        entry.sequence[m].strokesPlayed[n].strokePlayed = checkEntry._id;
     
                    }


                  sequenceDataRecord.update({
                  "_id":sequenceDataRecordID,                   
                  "sequence.sequenceRecordDate":entry.sequence[m].sequenceRecordDate
                      },
                      {$set:{
                      "sequence.$.analyticsCache" : entry.sequence[m].analyticsCache,
                      "sequence.$.strokesPlayed":entry.sequence[m].strokesPlayed
                      }}
                    );

                  }
                }

              }
              

             
            }
          }
          else
          {
            var player_id = playerDetailsRecord.insert(info[v]);

            if(info[v].playerName == player2Name)
            {
             // sequenceDataRecord.update({"_id":sequenceDataRecordID,"player2Name":player2Name},
                //{$set:{"player2Id":player_id}});

              //sequenceDataRecord.update({"_id":sequenceDataRecordID,"player1Name":player2Name},
                //{$set:{"player1Id":player_id}});   

              var firstCheck = sequenceDataRecord.findOne({"_id":sequenceDataRecordID,"player2Name":player2Name});
              if(firstCheck)
              {
                sequenceDataRecord.update({"_id":sequenceDataRecordID,"player2Name":player2Name},
                {$set:{"player2Id":player_id}});
                var entry = firstCheck;
                var oldPlayer2Id = firstCheck.player2Id;
                var seqquenceID = entry._id;
                if(entry)
                {
                  var player1Name = entry.player1Name;
                  var player2Name = entry.player2Name;
                  var player1ID = entry.player1Id;
                  var player2ID = entry.player2Id;


                  for(var m=0; m<entry.sequence.length;m++)
                  {
                    if(entry.sequence[m].analyticsCache.serviceBy == oldPlayer2Id)
                      entry.sequence[m].analyticsCache.serviceBy = player_id;
                    if(entry.sequence[m].analyticsCache.winner == oldPlayer2Id)
                      entry.sequence[m].analyticsCache.winner = cplayer_id;
                    
                    for(var n=0;n<entry.sequence[m].strokesPlayed.length;n++)
                    {
                      if(entry.sequence[m].strokesPlayed[n].strokePlayed == oldPlayer2Id)
                        entry.sequence[m].strokesPlayed[n].strokePlayed = player_id;
     
                    }


                  sequenceDataRecord.update({
                  "_id":sequenceDataRecordID,                   
                  "sequence.sequenceRecordDate":entry.sequence[m].sequenceRecordDate
                      },
                      {$set:{
                      "sequence.$.analyticsCache" : entry.sequence[m].analyticsCache,
                      "sequence.$.strokesPlayed":entry.sequence[m].strokesPlayed
                      }}
                    );

                  }
                }

              }
              
              var secondCheck = sequenceDataRecord.findOne({"_id":sequenceDataRecordID,"player1Name":player2Name});
              if(secondCheck)
              {
                sequenceDataRecord.update({"_id":sequenceDataRecordID,"player1Name":player2Name},
                {$set:{"player1Id":player_id}});
                var entry = secondCheck;
                var oldPlayer2Id = secondCheck.player1Id;
                var seqquenceID = entry._id;
                if(entry)
                {
                  var player1Name = entry.player1Name;
                  var player2Name = entry.player2Name;
                  var player1ID = entry.player1Id;
                  var player2ID = entry.player2Id;


                  for(var m=0; m<entry.sequence.length;m++)
                  {
                    if(entry.sequence[m].analyticsCache.serviceBy == oldPlayer2Id)
                      entry.sequence[m].analyticsCache.serviceBy = player_id;
                    if(entry.sequence[m].analyticsCache.winner == oldPlayer2Id)
                      entry.sequence[m].analyticsCache.winner = player_id;
                    
                    for(var n=0;n<entry.sequence[m].strokesPlayed.length;n++)
                    {
                      if(entry.sequence[m].strokesPlayed[n].strokePlayed == oldPlayer2Id)
                        entry.sequence[m].strokesPlayed[n].strokePlayed = player_id;
     
                    }


                  sequenceDataRecord.update({
                  "_id":sequenceDataRecordID,                   
                  "sequence.sequenceRecordDate":entry.sequence[m].sequenceRecordDate
                      },
                      {$set:{
                      "sequence.$.analyticsCache" : entry.sequence[m].analyticsCache,
                      "sequence.$.strokesPlayed":entry.sequence[m].strokesPlayed
                      }}
                    );

                  }
                }
              }         
            }
            else if(info[v].playerName == player1Name)
            {
             // sequenceDataRecord.update({"_id":sequenceDataRecordID,"player1Name":player1Name},
               // {$set:{"player1Id":player_id}});

              //sequenceDataRecord.update({"_id":sequenceDataRecordID,"player2Name":player1Name},
                //{$set:{"player2Id":player_id}});

              var firstCheck =sequenceDataRecord.findOne({"_id":sequenceDataRecordID,"player1Name":player1Name})
              if(firstCheck)
              {
                sequenceDataRecord.update({"_id":sequenceDataRecordID,"player1Name":player1Name},
                {$set:{"player1Id":player_id}});
               
                var entry = firstCheck;
                var oldPlayer2Id = firstCheck.player1Id;
                var seqquenceID = entry._id;
                if(entry)
                {
                  var player1Name = entry.player1Name;
                  var player2Name = entry.player2Name;
                  var player1ID = entry.player1Id;
                  var player2ID = entry.player2Id;


                  for(var m=0; m<entry.sequence.length;m++)
                  {
                    if(entry.sequence[m].analyticsCache.serviceBy == oldPlayer2Id)
                      entry.sequence[m].analyticsCache.serviceBy = player_id;
                    if(entry.sequence[m].analyticsCache.winner == oldPlayer2Id)
                      entry.sequence[m].analyticsCache.winner = player_id;
                    
                    for(var n=0;n<entry.sequence[m].strokesPlayed.length;n++)
                    {
                      if(entry.sequence[m].strokesPlayed[n].strokePlayed == oldPlayer2Id)
                        entry.sequence[m].strokesPlayed[n].strokePlayed = player_id;
     
                    }


                  sequenceDataRecord.update({
                  "_id":sequenceDataRecordID,                   
                  "sequence.sequenceRecordDate":entry.sequence[m].sequenceRecordDate
                      },
                      {$set:{
                      "sequence.$.analyticsCache" : entry.sequence[m].analyticsCache,
                      "sequence.$.strokesPlayed":entry.sequence[m].strokesPlayed
                      }}
                    );

                  }
                }
              }

              var secondCheck = sequenceDataRecord.findOne({"_id":sequenceDataRecordID,"player2Name":player1Name});
              if(secondCheck)
              {
                sequenceDataRecord.update({"_id":sequenceDataRecordID,"player2Name":player1Name},
                {$set:{"player2Id":player_id}});
               
                var entry = secondCheck;
                var oldPlayer2Id = secondCheck.player2Id;
                var seqquenceID = entry._id;
                if(entry)
                {
                  var player1Name = entry.player1Name;
                  var player2Name = entry.player2Name;
                  var player1ID = entry.player1Id;
                  var player2ID = entry.player2Id;


                  for(var m=0; m<entry.sequence.length;m++)
                  {
                    if(entry.sequence[m].analyticsCache.serviceBy == oldPlayer2Id)
                      entry.sequence[m].analyticsCache.serviceBy = player_id;
                    if(entry.sequence[m].analyticsCache.winner == oldPlayer2Id)
                      entry.sequence[m].analyticsCache.winner = player_id;
                    
                    for(var n=0;n<entry.sequence[m].strokesPlayed.length;n++)
                    {
                      if(entry.sequence[m].strokesPlayed[n].strokePlayed == oldPlayer2Id)
                        entry.sequence[m].strokesPlayed[n].strokePlayed = player_id;
     
                    }


                  sequenceDataRecord.update({
                  "_id":sequenceDataRecordID,                   
                  "sequence.sequenceRecordDate":entry.sequence[m].sequenceRecordDate
                      },
                      {$set:{
                      "sequence.$.analyticsCache" : entry.sequence[m].analyticsCache,
                      "sequence.$.strokesPlayed":entry.sequence[m].strokesPlayed
                      }}
                    );

                  }
                }

              }
            }
          }

        }

       

        var shareCount = parseInt(result1)+parseInt(result2);
        
        var sharedHistory = {"loggerId":loggerId,
          "sharedId":sharedId,
          "player1Name":player1Name,
          "player2Name":player2Name,
          "sequenceCount":shareCount,
          "playerList":setOfPlayers
        };
        sequenceShareHistory.insert(sharedHistory);
       
      }
      
      return true;
    }catch(e){
    }
  },
  
  fetchPlayerProfile:function(userId,player1Name,player2Name,player1Id,player2Id)
  {
    try
    {
      var result = [];
      var newJson = {};
      var queryForPlayer1Id = {$in:[null,""]};
      var queryForPlayer2Id = {$in:[null,""]};
      if(player1Id != "")
        queryForPlayer1Id = player1Id;
      if(player2Id != "")
        queryForPlayer2Id = player2Id;


      var playerInfo = playerDetailsRecord.findOne({"loggerId":userId,
        "playerName":player1Name,
        $or:[
          {"_id":player1Id},
          {"userId":player1Id}
          ]
      });
      if(playerInfo)    
        newJson["player1Profile"] = playerInfo;      
      else   
        newJson["player1Profile"] = {"loggerId":userId,"playerName":player1Name,"playerHand":"Unknown","foreHandRT":[],"backHandRT":[]};

      var playerInfo = playerDetailsRecord.findOne({"loggerId":userId,"playerName":player2Name,
        $or:[
          {"userId":player2Id},
          {"_id":player2Id}
          ]
      });
      if(playerInfo)    
        newJson["player2Profile"] = playerInfo;      
      else   
        newJson["player2Profile"] = {"loggerId":userId,"playerName":player2Name,"playerHand":"Unknown","foreHandRT":[],"backHandRT":[]};

      result.push(newJson);
      return result;
      
    }catch(e){}
  },
  recordPlayerProfile:function(userId,data)
  {
    try
    {
      var obj = JSON.parse(data);
      obj.playerName = obj.playerName.trim();
      obj.playerHand = obj.playerHand;
      obj.playerFH = obj.playerFH;
      obj.playerBH = obj.playerBH;
      obj.playerId = obj.playerId;
      for(var i =0; i< obj.playerFH.length;i++)
      {
        var rubberDate = obj.playerFH[i].rubberDate;
        var from = rubberDate.split("/");
        obj.playerFH[i].rubberDate = moment(new Date("20"+from[2], from[1] - 1, from[0])).format("DD MMM YYYY");
      }

      for(var i =0; i< obj.playerBH.length;i++)
      {
        var rubberDate = obj.playerBH[i].rubberDate;
        var from = rubberDate.split("/");
        obj.playerBH[i].rubberDate = moment(new Date("20"+from[2], from[1] - 1, from[0])).format("DD MMM YYYY");
      }

      
      playerUserId = obj.playerId;
      var playerProfileInfo ;
      if(obj.playerId == "")
        playerProfileInfo = playerDetailsRecord.findOne({"loggerId":userId,"playerName":obj.playerName});
      else
        playerProfileInfo = playerDetailsRecord.findOne({"loggerId":userId,"playerName":obj.playerName,
          
          $or:[{"userId":obj.playerId},{"_id":obj.playerId}]

        });

      if(playerProfileInfo)
      {
        if(obj.playerId == "")
        {
          var result = playerDetailsRecord.update({"loggerId":userId,"playerName":obj.playerName},
            {$set:{"playerHand":obj.playerHand,
            "userId":playerUserId,
            "foreHandRT":obj.playerFH,"backHandRT":obj.playerBH}});
        }
        else
        {
          var result = playerDetailsRecord.update({"loggerId":userId,"playerName":obj.playerName,
            $or:[{"_id":obj.playerId},{"userId":obj.playerId}],
            },
            {$set:{"playerHand":obj.playerHand,"foreHandRT":obj.playerFH,"backHandRT":obj.playerBH}});
        }
      }
      else
      {
        var result = playerDetailsRecord.insert({"loggerId":userId,
          "playerName":obj.playerName,"playerHand":obj.playerHand,
          "userId":playerUserId,
          "foreHandRT":obj.playerFH,"backHandRT":obj.playerBH});

      }
      return true;

    }catch(e){}                 
  },
  getPlayerSetPoints:function(userId,data)
  {
    var player1Name = data.player1Name;
    var player2Name = data.player2Name;

    try
    {
      //var userInfo = sequenceDataRecord.findOne({"loggerId":userId,"player1Name":player1Name,"player2Name":player2Name});
      sequenceDataRecord.aggregate([
        { "$match": { 
          "loggerId": userId,
          "player1Name":player1Name,
          "player2Name":player2Name }},
        { "$unwind": "$sequence" },
        { "$match": {

           }},
        { "$group": {
            "_id": "$id",
            "points": { "$push": "$points" }
        }},
        { "$sort": { "points.ditanceToSpawn": 1 } }         
      ])
    }catch(e){}
  }

});