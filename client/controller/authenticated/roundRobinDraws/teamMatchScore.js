//teamMatchScore

Template.teamMatchScore.onCreated(function() {
 	if(Session.get("tournamentId") && Session.get("eventName"))
	{
		this.subscribe("teamRRConfig",Session.get("tournamentId"),Session.get("eventName"))
    	//this.subscribe("matchFormatConfigPub",Session.get("tournamentId"),Session.get("eventName"))
    	this.subscribe("roundRobinMatchScorePub",Session.get("tournamentId"),Session.get("eventName"));
	} 
	var self = this;
	self.autorun(function () {
     	if(Session.get("matchFormatId")){
     		self.subscribe("matchFormatConfigPub", Session.get("matchFormatId"));
     	}
     	if(Session.get("teamAIDMatch") && Session.get("teamBIDMatch"))
     		self.subscribe("fetchTeamUsers",Session.get("tournamentId"),Session.get("teamAIDMatch"),Session.get("teamBIDMatch"))
         
    });
  
});

Template.teamMatchScore.onRendered(function () {
	Session.set("matchFormatId",undefined );
	Session.set("teamAIDMatch",undefined);
	Session.set("teamBIDMatch",undefined);
	Session.set("matchplayer",undefined);
	Session.set("teamMatchType",undefined);
	Session.set("finalTeamWinner",undefined);
	
    
});

Template.teamMatchScore.helpers({


	"fetchTeamNameA":function(){
		if(Session.get("currentPlayerMatchDetails"))
		{
			var curMatchDetails = Session.get("currentPlayerMatchDetails");
			if(Session.get("teamDBName") && curMatchDetails && curMatchDetails.teamsID && curMatchDetails.teamsID.teamAId)
			{
				Session.set("teamAIDMatch",curMatchDetails.teamsID.teamAId);
				var result = ReactiveMethod.call("fetchRRUserName_Aca",curMatchDetails.teamsID.teamAId,Session.get("tournamentId"),"team",Session.get("teamDBName"));
            	if(result)
                	return result;
			}
		}
	},
	"fetchTeamNameB":function(){
		try{
			if(Session.get("currentPlayerMatchDetails"))
			{
				var curMatchDetails = Session.get("currentPlayerMatchDetails");
				if(Session.get("teamDBName") && curMatchDetails && curMatchDetails.teamsID && curMatchDetails.teamsID.teamBId)
				{
					Session.set("teamBIDMatch",curMatchDetails.teamsID.teamBId);

					var result = ReactiveMethod.call("fetchRRUserName_Aca",curMatchDetails.teamsID.teamBId,Session.get("tournamentId"),"team",Session.get("teamDBName"));
	            	if(result)
	                	return result;
				}
			}
		}catch(e){
		}
	},
	"teamAIDMatch":function(){
		if(Session.get("teamAIDMatch") != undefined)
			return Session.get("teamAIDMatch");
	},
	"teamBIDMatch":function(){
		if(Session.get("teamBIDMatch") != undefined)
			return Session.get("teamBIDMatch")
	},
	"matchScoreExists":function()
	{
		try{
			
			if(Session.get("tournamentId") != undefined && Session.get("eventName") != undefined)
			{
				var tournamentId = Session.get("tournamentId");
				var eventName = Session.get("eventName");
				var teamRRConfig  = roundRobinTeamConfig.findOne({"tournamentId":tournamentId,"eventName":eventName});
				if(teamRRConfig)
				{
					Session.set("matchFormatId",teamRRConfig.matchFormatId);
					var roundRobinMatchScoreInfo  = roundRobinMatchScore.findOne({"tournamentId":tournamentId,"eventName":eventName});
					if(roundRobinMatchScoreInfo)
						return true;
				}		
			}
			return false;
		}catch(e){
			alert(e)
		}	
	},
	"formatInfo":function(){
		//if(Session.get("matchFormatId") != undefined)
		//{
			var formatInfo = ReactiveMethod.call("fetchTeamDetailScore",Session.get("tournamentId"),Session.get("eventName"),Session.get("currentPlayerMatchDetails"))
			
			if(formatInfo)
			{
				if(formatInfo.status)
				{
					if(formatInfo.status == "success" && formatInfo.specifications)
					{
						if(formatInfo.teamMatchType)
							Session.set("teamMatchType",formatInfo.teamMatchType);
						if(formatInfo.finalTeamWinner)
							Session.set("finalTeamWinner",formatInfo.finalTeamWinner);
						if(formatInfo.specifications)
							Session.set("formatInfo",formatInfo.specifications);

						return Session.get("formatInfo");
						//return formatInfo.specifications;
					}
				}
				
			}
		//}
	
	},
	"eventType":function(eventType){
		if(eventType == 1 || eventType == "1")
			return true;
		else
			return false;
		
	
	},
	checkOnlyEventOrganizer:function(){
        try{
            var s = ReactiveMethod.call("viewerOrOrganizer",Session.get("tournamentId"),Meteor.userId());
            if(s)
                return true
            else
                return false
        }catch(e){

        }
    },
    "matchScoreExists":function()
	{
		try{
			
			if(Session.get("tournamentId") != undefined && Session.get("eventName") != undefined)
			{
				var tournamentId = Session.get("tournamentId");
				var eventName = Session.get("eventName");
				var teamRRConfig  = roundRobinTeamConfig.findOne({"tournamentId":tournamentId,"eventName":eventName});
				if(teamRRConfig)
				{
					Session.set("matchFormatId",teamRRConfig.matchFormatId);
					var roundRobinMatchScoreInfo  = roundRobinMatchScore.findOne({"tournamentId":tournamentId,"eventName":eventName});
					if(roundRobinMatchScoreInfo)
						return true;
				}		
			}
			return false;
		}catch(e){
			alert(e)
		}	
	},
	"winnerExists":function(detailScore,matchType)
	{
		if(detailScore && matchType)
		{
		
			var playerList = [];
			if(matchType == 1)
			{
				if(detailScore.teamAplayerAID != "1")
				{				
					var userInfo = Meteor.users.findOne({"userId":detailScore.teamAplayerAID});
					if(userInfo)
					{
						playerList.push({"userId":detailScore.teamAplayerAID,"userName":userInfo.userName,"teamID":Session.get("teamAIDMatch")});					
					}
				}
				if(detailScore.teamBplayerAID != "1")
				{
					var userInfo = Meteor.users.findOne({"userId":detailScore.teamBplayerAID});
					if(userInfo)
					{
						playerList.push({"userId":detailScore.teamBplayerAID,"userName":userInfo.userName,"teamID":Session.get("teamAIDMatch")});					
					}
				}
			}
			else if(matchType == 2)
			{
				if(detailScore.teamAplayerAID != "1" && detailScore.teamAplayerBID)
				{				
					var userInfo1 = Meteor.users.findOne({"userId":detailScore.teamAplayerAID});
					var userInfo2 = Meteor.users.findOne({"userId":detailScore.teamAplayerBID});

					if(userInfo1 && userInfo2)
					{
						playerList.push({"userId":detailScore.teamAplayerAID+","+detailScore.teamAplayerBID,"userName":userInfo1.userName+","+userInfo2.userName,"teamID":Session.get("teamAIDMatch")});					
					}

				}
				if(detailScore.teamBplayerAID != "1" && detailScore.teamBplayerBID != "1")
				{
					var userInfo1 = Meteor.users.findOne({"userId":detailScore.teamBplayerAID});
					var userInfo2 = Meteor.users.findOne({"userId":detailScore.teamBplayerBID});

					if(userInfo1 && userInfo2)
					{
						playerList.push({"userId":detailScore.teamBplayerAID+","+detailScore.teamBplayerBID,"userName":userInfo1.userName+","+userInfo2.userName,"teamID":Session.get("teamAIDMatch")});					
					}
				}
			}

			return playerList;
		}
		return false;
	},

    "winnerList":function(matchNo,matchType)
    {
    	if(matchNo && matchType && Session.get("matchplayer"))
    	{
    		var winnerList = [];
    		if(matchType == 1)
    		{
    			playerA = $("[name=match"+matchNo+"playerA] option:selected").attr("name");
				playerX = $("[name=match"+matchNo+"playerX] option:selected").attr("name");
				playerAVal = $("[name=match"+matchNo+"playerA]").val();
				playerXVal = $("[name=match"+matchNo+"playerX]").val();
    			if(playerA != "1")
    				winnerList.push({"userId":playerA,"userName":playerAVal,"teamID":Session.get("teamAIDMatch")});
    			if(playerX != "1")
    				winnerList.push({"userId":playerX,"userName":playerXVal,"teamID":Session.get("teamBIDMatch")});

    		}
    		else if(matchType == 2)
    		{
    			playerA = $("[name=match"+matchNo+"playerA] option:selected").attr("name");
    			playerAVal = $("[name=match"+matchNo+"playerA]").val();
				playerB = $("[name=match"+matchNo+"playerB] option:selected").attr("name");
				playerBVal = $("[name=match"+matchNo+"playerB]").val();

				playerX = $("[name=match"+matchNo+"playerX] option:selected").attr("name");
				playerXVal = $("[name=match"+matchNo+"playerX]").val();

				playerY = $("[name=match"+matchNo+"playerY] option:selected").attr("name");
    			playerYVal = $("[name=match"+matchNo+"playerY]").val();


    			if(playerA != "1" && playerB != "1")
    				winnerList.push({"userId":playerA+","+playerB,"userName":playerAVal+","+playerBVal,"teamID":Session.get("teamAIDMatch")});
    			if(playerX != "1" && playerY != "1")
    				winnerList.push({"userId":playerX+","+playerY,"userName":playerXVal+","+playerYVal,"teamID":Session.get("teamBIDMatch")});


    		}
    		return winnerList;
    	}
    },
    "setMatchStatus":function(detailScore,status)
    {
    	if(detailScore && status && detailScore.matchType.toLowerCase() == status.toLowerCase())
    		return true

    },
    "setMatchPlayer":function(placeHolder,detailScore,userId,object)
    {
    	if(detailScore && userId && placeHolder)
    	{
    		if(placeHolder == "playerA")
    		{
    			if(detailScore.teamAplayerAID == userId)
    			{
					object["placeHolder"] = "playerA";
   					Session.set("matchplayer",object);
    				return true;
    			}

    		}
    		else if(placeHolder == "playerB")
    		{
    			if(detailScore.teamAplayerBID == userId){
    				object["placeHolder"] = "playerB";
   					Session.set("matchplayer",object);
    				return true;
    			}
    		}
    		else if(placeHolder == "playerX")
    		{
    			if(detailScore.teamBplayerAID == userId){
    				object["placeHolder"] = "playerX";
   					Session.set("matchplayer",object);
    				return true;
    			}
    		}
    		else if(placeHolder == "playerY")
    		{
    			if(detailScore.teamBplayerBID == userId){
    				object["placeHolder"] = "playerY";
   					Session.set("matchplayer",object);
    				return true;
    			}
    		}
    		return false;
    	}
    },
    "setWinner":function(detailScore,matchType,winnerId)
    {
    	if(detailScore && matchType && winnerId)
    	{
    		if(matchType == 1)
	    	{
	    		if(detailScore.winnerA && detailScore.winnerA == winnerId)
	    			return true;
	    	}
	    	else if(matchType == 2)
	    	{
	    		var winnerData = winnerId.split(",")
				winnerA = winnerData[0];
				winnerB = winnerData[1];
				if(detailScore.winnerA && detailScore.winnerA == winnerA && detailScore.winnerB && detailScore.winnerB == winnerB)				
	    			return true;

	    	}
    	}  	
    },
    "setTeamMatchType":function(matchType)
    {
    	if(Session.get("teamMatchType") && matchType)
    	{
    		if(matchType.toLowerCase() == Session.get("teamMatchType").toLowerCase())
    			return true;
    	}
    },
    "setFinalWinner":function(winnerId)
    {
    	if(Session.get("finalTeamWinner") && winnerId)
    	{
    		if(Session.get("finalTeamWinner") == winnerId)
    			return true;
    	}
    }


})

Template.teamMatchScore.events({

	
	"change [id^=matchplayerA]": function (event, template) 
	{
		this["placeHolder"] = "playerA";
   		Session.set("matchplayer",this);
  	},
  	"change [id^=matchplayerB]": function (event, template) 
	{
		this["placeHolder"] = "playerB";
   		Session.set("matchplayer",this);
  	},
  	"change [id^=matchplayerX]": function (event, template) 
	{
		this["placeHolder"] = "playerX";
   		Session.set("matchplayer",this);
  	},
  	"change [id^=matchplayerY]": function (event, template) 
	{
		this["placeHolder"] = "playerY";
   		Session.set("matchplayer",this);
  	},
  	 "keyup [id^=matchScoreA]": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if(event.keyCode===9){
            return true
        } else if(key==45){
            return true
        } else if (key < 48 || key > 57) {
            return false;
        } else 
        	return true;
    },
	"keypress [id^=matchScoreA]":function(event){
        var key = window.event ? event.keyCode : event.which;

        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if(event.keyCode===9){
            return true
        } else if(key==45){
            return true
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;   
    },
   
    "keyup [id^=matchScoreB]":function(event){
        var key = window.event ? event.keyCode : event.which;

        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if(event.keyCode===9){
            return true
        } else if(key==45){
            return true
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;   
    },
    "keypress [id^=matchScoreB]":function(event){
        var key = window.event ? event.keyCode : event.which;

        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if(event.keyCode===9){
            return true
        } else if(key==45){
            return true
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;   
    },
	"click #cancelRRMatchDetails":function(e){
		e.preventDefault();
        $("#teamMatchScore").modal('hide')
		$("#teamDrawsDetailsPopUp").empty();
		$( '.modal-backdrop' ).remove();      
	},
	"click #saveRRTeamMatchDetails":function(e)
	{
		//comMathDetails
		var rowCount = $('#comMathDetails').find("tr").length;
		if(parseInt(rowCount) == 0)
		{
			display("Invalid data")
		}
		else{

			var matchData = [];
			var inverseMatchData = [];
			for(var k =0; k< rowCount; k=k+2)
			{
				var curRow = $("#comMathDetails tr")[k];
				var nextRow = $("#comMathDetails tr")[k+1];
				var matchStatus = $(curRow).find("[name='matchStatus'] option:selected").attr("name");

				var matchType = $(curRow).attr('id');
				var matchNo = $(curRow).attr('name');
				var playerA = "";
				var playerB = "";
				var playerX = "";
				var playerY = "";
				var winner = "";
				var winnerA = "";
				var winnerB = "";
				var winnerTeam = "";

				


	           	var matchStatus = $(curRow).find("[name=match"+matchNo+"Status] option:selected").attr("name");
				if(matchType == 2)
				{
					playerA = $(curRow).find("[name=match"+matchNo+"playerA] option:selected").attr("name");
					playerB = $(curRow).find("[name=match"+matchNo+"playerB] option:selected").attr("name");
					
					playerX = $(nextRow).find("[name=match"+matchNo+"playerX] option:selected").attr("name");
					playerY = $(nextRow).find("[name=match"+matchNo+"playerY] option:selected").attr("name");

					winner = $(curRow).find("[name=match"+matchNo+"Winner] option:selected").attr("name");
					winnerTeam = $(curRow).find("[name=match"+matchNo+"Winner] option:selected").attr("id");

					var winnerData = winner.split(",")
					winnerA = winnerData[0];
					winnerB = winnerData[1];

				}
				else if(matchType == 1)
				{
					playerA = $(curRow).find("[name=match"+matchNo+"playerA] option:selected").attr("name");
					playerX = $(nextRow).find("[name=match"+matchNo+"playerX] option:selected").attr("name");
					winner = $(curRow).find("[name=match"+matchNo+"Winner] option:selected").attr("name");
					winnerTeam = $(curRow).find("[name=match"+matchNo+"Winner] option:selected").attr("id");

				}

				var scoreA1 = $(curRow).find("[name='match"+matchNo+"ScoreA1']").val().trim().replace(/^0+(?!\.|$)/, '').toString();
				var scoreA2 = $(curRow).find("[name='match"+matchNo+"ScoreA2']").val().trim().replace(/^0+(?!\.|$)/, '').toString();
				var scoreA3 = $(curRow).find("[name='match"+matchNo+"ScoreA3']").val().trim().replace(/^0+(?!\.|$)/, '').toString();
				var scoreA4 = $(curRow).find("[name='match"+matchNo+"ScoreA4']").val().trim().replace(/^0+(?!\.|$)/, '').toString();
				var scoreA5 = $(curRow).find("[name='match"+matchNo+"ScoreA5']").val().trim().replace(/^0+(?!\.|$)/, '').toString();
				var scoreA6 = $(curRow).find("[name='match"+matchNo+"ScoreA6']").val().trim().replace(/^0+(?!\.|$)/, '').toString();
				var scoreA7 = $(curRow).find("[name='match"+matchNo+"ScoreA7']").val().trim().replace(/^0+(?!\.|$)/, '').toString();

				var scoreB1 = $(nextRow).find("[name='match"+matchNo+"ScoreB1']").val().trim().replace(/^0+(?!\.|$)/, '').toString();
				var scoreB2 = $(nextRow).find("[name='match"+matchNo+"ScoreB2']").val().trim().replace(/^0+(?!\.|$)/, '').toString();
				var scoreB3 = $(nextRow).find("[name='match"+matchNo+"ScoreB3']").val().trim().replace(/^0+(?!\.|$)/, '').toString();
				var scoreB4 = $(nextRow).find("[name='match"+matchNo+"ScoreB4']").val().trim().replace(/^0+(?!\.|$)/, '').toString();
				var scoreB5 = $(nextRow).find("[name='match"+matchNo+"ScoreB5']").val().trim().replace(/^0+(?!\.|$)/, '').toString();
				var scoreB6 = $(nextRow).find("[name='match"+matchNo+"ScoreB6']").val().trim().replace(/^0+(?!\.|$)/, '').toString();
				var scoreB7 = $(nextRow).find("[name='match"+matchNo+"ScoreB7']").val().trim().replace(/^0+(?!\.|$)/, '').toString();

				if(scoreA1 == undefined ||scoreA1 == null || scoreA1 == "")
					scoreA1 = "0";
				if(scoreA2 == undefined ||scoreA2 == null || scoreA2 == "")
					scoreA2 = "0";
				if(scoreA3 == undefined ||scoreA3 == null || scoreA3 == "")
					scoreA3 = "0";
				if(scoreA4 == undefined ||scoreA4 == null || scoreA4 == "")
					scoreA4 = "0";
				if(scoreA5 == undefined ||scoreA5 == null || scoreA5 == "")
					scoreA5 = "0";
				if(scoreA6 == undefined ||scoreA6 == null || scoreA6 == "")
					scoreA6 = "0";
				if(scoreA7 == undefined ||scoreA7 == null || scoreA7 == "")
					scoreA7 = "0";

				if(scoreB1 == undefined ||scoreB1 == null || scoreB1 == "")
					scoreB1 = "0";
				if(scoreB2 == undefined ||scoreB2 == null || scoreB2 == "")
					scoreB2 = "0";
				if(scoreB3 == undefined ||scoreB3 == null || scoreB3 == "")
					scoreB3 = "0";
				if(scoreB4 == undefined ||scoreB4 == null || scoreB4 == "")
					scoreB4 = "0";
				if(scoreB5 == undefined ||scoreB5 == null || scoreB5 == "")
					scoreB5 = "0";
				if(scoreB6 == undefined ||scoreB6 == null || scoreB6 == "")
					scoreB6 = "0";
				if(scoreB7 == undefined ||scoreB7 == null || scoreB7 == "")
					scoreB7 = "0";



				var setScoresA = [scoreA1,scoreA2,scoreA3,scoreA4,scoreA5,scoreA6,scoreA7];
				var setScoresB = [scoreB1,scoreB2,scoreB3,scoreB4,scoreB5,scoreB6,scoreB7];

 				if(matchType == 1)
 				{

 					var matchJson = {};
					matchJson["no"] = matchNo;
					matchJson["teamAplayerAID"] = playerA;
					matchJson["teamAplayerBID"] = "1";
					matchJson["teamBplayerAID"] = playerX;
					matchJson["teamBplayerBID"] = "1";
					matchJson["matchType"] = matchStatus;
					matchJson["setScoresA"] = setScoresA;
					matchJson["setScoresB"] = setScoresB;
					matchJson["winnerA"] = winner;
					matchJson["winnerB"] = "1";
					matchJson["winnerIdTeam"] = winnerTeam;

					matchData.push(matchJson);

					var invMatchJson = {};
					invMatchJson["no"] = matchNo;
					invMatchJson["teamAplayerAID"] = playerX;
					invMatchJson["teamAplayerBID"] = "1";
					invMatchJson["teamBplayerAID"] = playerA;
					invMatchJson["teamBplayerBID"] = "1";
					invMatchJson["matchType"] = matchStatus;
					invMatchJson["setScoresA"] = setScoresB;
					invMatchJson["setScoresB"] = setScoresA;
					invMatchJson["winnerA"] = winner;
					invMatchJson["winnerB"] = "1";
					invMatchJson["winnerIdTeam"] = winnerTeam;

					inverseMatchData.push(invMatchJson);

 				}
 				else if(matchType == 2)
 				{
 					var matchJson = {};
					matchJson["no"] = matchNo;
					matchJson["teamAplayerAID"] = playerA;
					matchJson["teamAplayerBID"] = playerB;
					matchJson["teamBplayerAID"] = playerX;
					matchJson["teamBplayerBID"] = playerY;
					matchJson["matchType"] = matchStatus;
					matchJson["setScoresA"] = setScoresA;
					matchJson["setScoresB"] = setScoresB;
					matchJson["winnerA"] = winnerA;
					matchJson["winnerB"] = winnerB;
					matchJson["winnerIdTeam"] = winnerTeam;

					matchData.push(matchJson);

					var invMatchJson = {};
					invMatchJson["no"] = matchNo;
					invMatchJson["teamAplayerAID"] = playerX;
					invMatchJson["teamAplayerBID"] = playerY;
					invMatchJson["teamBplayerAID"] = playerA;
					invMatchJson["teamBplayerBID"] = playerB;
					invMatchJson["matchType"] = matchStatus;
					invMatchJson["setScoresA"] = setScoresB;
					invMatchJson["setScoresB"] = setScoresA;
					invMatchJson["winnerA"] = winnerA;
					invMatchJson["winnerB"] = winnerB;
					invMatchJson["winnerIdTeam"] = winnerTeam;

					inverseMatchData.push(invMatchJson);
 				}
 				

 				var teamDET = {
                    "teamAID": Session.get("teamAIDMatch"),
                    "teamBID": Session.get("teamBIDMatch"),
                    "matchData": matchData,              
                    "finalTeamWinner": finalTeamWinner,
                    "teamMatchType": teamMatchType
                }

                var inverse_teamDET = {
                    "teamAID": Session.get("teamBIDMatch"),
                    "teamBID": Session.get("teamAIDMatch"),
                    "matchData": inverseMatchData,              
                    "finalTeamWinner": finalTeamWinner,
                    "teamMatchType": teamMatchType
                }
			}

			var finalTeamWinner = "1";
            var teamMatchType = "notPlayed";
            var teamType = "1";

            if ($("#TeamWinnerId").val().trim()) {
                finalTeamWinner = $("#TeamWinnerId").val().trim();
            }
            if ($("#TeamMatchType").val().trim()) {
                teamMatchType = $("#TeamMatchType").val().trim();
            }
            if($("#TeamWinnerId option:selected").attr("id")){
                teamType = $("#TeamWinnerId option:selected").attr("id").trim()
            }


			var paramJson = {};
			paramJson["tournamentId"] = Session.get("tournamentId"),
			paramJson["eventName"] = Session.get("eventName"),
			paramJson["matchID"] = Session.get("currentPlayerMatchID");
			paramJson["teamAId"] = Session.get("teamAIDMatch"),
			paramJson["teamBId"] = Session.get("teamBIDMatch"),
			paramJson["matchDetails"] = matchData;
			paramJson["invMatchDetails"] = inverseMatchData;
			paramJson["finalTeamWinner"] = finalTeamWinner;
			paramJson["teamMatchType"] = teamMatchType;
			paramJson["teamType"] = teamType;

						//var formatInfo = ReactiveMethod.call("fetchTeamDetailScore",Session.get("tournamentId"),Session.get("eventName"),Session.get("currentPlayerMatchDetails"))

			Meteor.call("matchScoreDetails",paramJson,Session.get("currentPlayerMatchDetails"),function(error,result){
				if(result)
				{
					if(result.status && result.status == "success")
					{
						if(result.message)
							displayMessage(result.message);
						if(result.teamMatchType)
							Session.set("teamMatchType",result.teamMatchType);
						if(result.finalTeamWinner)
							Session.set("finalTeamWinner",result.finalTeamWinner);
						if(result.specifications)
							Session.set("formatInfo",result.specifications);
						if(result.matchRecords)
							Session.set("roundRobinTeamDraws",result.matchRecords);

						$("#teamMatchScore").modal('hide')
                        $( '.modal-backdrop' ).remove();
                        $("#teamDrawsDetailsPopUp").empty(); 

					}
					else if(result.status && result.status == "failure")
					{
						if(result.message)
							displayMessage(result.message);
					}
					else
						displayMessage("could not save!!");
				}
			})

		
		}

	},
	"click #printRRBlankDetailScore":function(e){
        try{

            if(Session.get("tournamentId")&&Session.get("eventName")&&Session.get("currentPlayerMatchDetails")){
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName");
                var det = Session.get("currentPlayerMatchDetails");
                var teamAId = det.teamsID.teamAId;
                var teamBId = det.teamsID.teamBId;
                var teamDetailedDraws = Session.get("currentPlayerMatchDetails");

                Meteor.call("printRRBlankTeamMatchScore",tournamentId,eventName,teamAId,teamBId,teamDetailedDraws,function(e,res){
                    if(res)
                        window.open("data:application/pdf;base64, " + res);
                })
                
            }        
        }catch(e){
        }
    },
     "click #printRRDetailScore":function(e){
        try{

            if(Session.get("tournamentId")&&Session.get("eventName")&&Session.get("currentPlayerMatchDetails")){
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName");
                var det = Session.get("currentPlayerMatchDetails");
                var teamAId = det.teamsID.teamAId;
                var teamBId = det.teamsID.teamBId;
                var teamDetailedDraws = Session.get("currentPlayerMatchDetails")
                //var teamDetailedSCore = Session.get("teamDetailedSCore");


                Meteor.call("printRRTeamMatchScore",tournamentId,eventName,teamAId,teamBId,teamDetailedDraws,function(e,res){
                    if(res)
                        window.open("data:application/pdf;base64, " + res);
                })
            }        
        }catch(e){
        }
    },
})