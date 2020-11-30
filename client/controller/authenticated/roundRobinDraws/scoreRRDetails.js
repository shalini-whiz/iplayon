

Template.scoreRRDetails.onCreated(function bodyOnCreated() {
    
});

Template.scoreRRDetails.onRendered(function () {
    
});


Template.scoreRRDetails.helpers({

    upcomingTournamentDraw: function() {
        if (Router.current().params._eventType && Router.current().params._eventType == "past")
            return false;
        else
            return true;
    },
	"fetchDetailScore":function()
    {
        if(Session.get("currentPlayerMatchDetails"))
        {
            return Session.get("currentPlayerMatchDetails")
        }

    },
    checkOnlyEventOrganizer: function() {
        try {

            var tournamentId = Session.get("tournamentId");
            if (Router.current().params._eventType == "past") {
                var eventOr = pastEvents.findOne({
                    "tournamentId": tournamentId
                });

            } else {
                var eventOr = events.findOne({
                    "tournamentId": tournamentId
                });
            }
            if (eventOr && eventOr.eventOrganizer) {
                var roleID = eventOr.eventOrganizer;
                if ((roleID == Meteor.userId())) {
                	return true;      
                }
            }
        }catch(e){

        }
    },
    displayPlayerName:function(playerId)
    {
    	try{
    		var userInfo = ReactiveMethod.call("findDetailsUsersTeams",playerId)
    		if(userInfo)
    			return userInfo.userName;
    	}catch(e){

    	}
    },
    checkWinner:function(playerId,winnerID){
    	try{
    		if(playerId == winnerID)
    		{
    			return "checked";
    		}

    	}catch(e){

    	}
    },
     checkWinnerType:function(data1,data2){
        try{
            if(data1.toString().trim() == data2.toString().trim())
            {
                return "checked";
            }

        }catch(e){

        }
    }
});


Template.scoreRRDetails.events({

	"click #closeRRScorePopUp":function(e){
        e.preventDefault();
        $("#scoreRRDetails").modal('hide');
        $("#setRRScorePopUp").empty();   
        $( '.modal-backdrop' ).remove();
    },
    "click #cancelRRScorePopUp":function(e){
        e.preventDefault();
        $("#scoreRRDetails").modal('hide');
        $("#setRRScorePopUp").empty();   
        $( '.modal-backdrop' ).remove();
    },
    "click #okRRScorePopUp":function(e){
        e.preventDefault();
        $("#scoreRRDetails").modal('hide');
        $("#setRRScorePopUp").empty();   
        $( '.modal-backdrop' ).remove();
    },
    "keypress [id^=playerAScoreRR]":function(event){
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
    "keypress [id^=playerBScoreRR]":function(event){
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
    "click #printRRScoreForm":function(e)
    {
        try{
            var paramJson = {};
            var details = Session.get("currentPlayerMatchDetails");
            paramJson["tournamentId"] = Session.get("tournamentId");
            paramJson["eventName"] = Session.get("eventName");
            paramJson["_id"] = Session.get("currentPlayerMatchID")
            paramJson["rowNo"] = details.rowNo;
            paramJson["colNo"] = details.colNo;

            Meteor.call("printRRIndDetailedDraws",paramJson,function(e,res){
                    if(res)
                    {
                        window.open("data:application/pdf;base64, " + res);
                    }
                })
        }catch(e){
        }
    },
    "click #printRRBlankScoreForm":function(e){
        try{
            var paramJson = {};
            var details = Session.get("currentPlayerMatchDetails");
            paramJson["tournamentId"] = Session.get("tournamentId");
            paramJson["eventName"] = Session.get("eventName");
            paramJson["_id"] = Session.get("currentPlayerMatchID")
            paramJson["rowNo"] = details.rowNo;
            paramJson["colNo"] = details.colNo;

            Meteor.call("printRRBlankIndDetailedDraws",paramJson,function(e,res){
                    if(res)
                    {
                        window.open("data:application/pdf;base64, " + res);
                    }
                })
        }catch(e){
        }
    },
    "click #blankRRScoreForm":function(e)
    {
        try{
            var paramJson = {};
            var details = Session.get("currentPlayerMatchDetails");
            paramJson["tournamentId"] = Session.get("tournamentId");
            paramJson["eventName"] = Session.get("eventName");
            paramJson["_id"] = Session.get("currentPlayerMatchID")
            paramJson["rowNo"] = details.rowNo;
            paramJson["colNo"] = details.colNo;

            Meteor.call("printRRBlankIndDetailedDraws",paramJson,function(e,res){
                    if(res)
                    {
                        window.open("data:application/pdf;base64, " + res);
                    }
                })
        }catch(e){
        }
    },


    "click #saveRRScoreForm":function(e){
    	try{
    		var winnerID = "";
    		var loserID = "";
    		e.preventDefault();
    		var checkedWinner = $("input[name='setRRWinner']:radio:checked").map(function() {
	    	return this.value;
		}).get();

            var checkedWinnerType = $("input[name='setRRWinnerType']:radio:checked").map(function() {
            return this.value;
        }).get();
            
           
        	if(checkedWinner.length > 0 && Session.get("currentPlayerMatchID") && checkedWinnerType.length > 0)
        	{
	    		var details = Session.get("currentPlayerMatchDetails");
	    		var playerAScore1 = $("#playerAScoreRR1").val().trim().replace(/^0+(?!\.|$)/, '')
	            var playerAScore2 = $("#playerAScoreRR2").val().trim().replace(/^0+(?!\.|$)/, '');
	            var playerAScore3 = $("#playerAScoreRR3").val().trim().replace(/^0+(?!\.|$)/, '');
	            var playerAScore4 = $("#playerAScoreRR4").val().trim().replace(/^0+(?!\.|$)/, '');
	            var playerAScore5 = $("#playerAScoreRR5").val().trim().replace(/^0+(?!\.|$)/, '');
	            var playerAScore6 = $("#playerAScoreRR6").val().trim().replace(/^0+(?!\.|$)/, '');
	            var playerAScore7 = $("#playerAScoreRR7").val().trim().replace(/^0+(?!\.|$)/, '');
	            var playerAScore = [playerAScore1, playerAScore2, playerAScore3, playerAScore4, playerAScore5, playerAScore6, playerAScore7];

	            //player B score
	            var playerBScore1 = $("#playerBScoreRR1").val().trim().replace(/^0+(?!\.|$)/, '')
	            var playerBScore2 = $("#playerBScoreRR2").val().trim().replace(/^0+(?!\.|$)/, '');
	            var playerBScore3 = $("#playerBScoreRR3").val().trim().replace(/^0+(?!\.|$)/, '');
	            var playerBScore4 = $("#playerBScoreRR4").val().trim().replace(/^0+(?!\.|$)/, '');
	            var playerBScore5 = $("#playerBScoreRR5").val().trim().replace(/^0+(?!\.|$)/, '');
	            var playerBScore6 = $("#playerBScoreRR6").val().trim().replace(/^0+(?!\.|$)/, '');
	            var playerBScore7 = $("#playerBScoreRR7").val().trim().replace(/^0+(?!\.|$)/, '');
	            var playerBScore = [playerBScore1, playerBScore2, playerBScore3, playerBScore4, playerBScore5, playerBScore6, playerBScore7];
        		
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
	                winnerID = details.playersID.playerAId;
	                loserID = details.playersID.playerBId;
	            }
	            else if(parseInt(playerBWinCount)>parseInt(playerAWinCount)){
	                winnerID = details.playersID.playerBId
	                loserID = details.playersID.playerAId
	            }
                if(checkedWinnerType && checkedWinnerType[0])
                {
                    
                    if(checkedWinnerType[0] == "bye" || checkedWinnerType[0] == "walkover")
                    {
                        playerAWinCount = 0;
                        playerBWinCount = 0;
                        if(checkedWinner && checkedWinner[0] == "playerAId")
                        {
                            winnerID = details.playersID.playerAId;
                            loserID = details.playersID.playerBId;
                            playerAWinCount = 3;
                            playerBWinCount = 0;
                        }
                        else if(checkedWinner && checkedWinner[0] == "playerBId")
                        {
                            winnerID = details.playersID.playerBId;
                            loserID = details.playersID.playerAId;
                            playerBWinCount = 3;
                            playerAWinCount = 0;
                        }
                        playerAScore = ["0", "0", "0", "0", "0", "0", "0"];
                        playerBScore = ["0", "0", "0", "0", "0", "0", "0"];


                    }         
                }

	            if(playerAWinCount == 0 && playerBWinCount == 0 && checkedWinnerType && checkedWinnerType[0] && checkedWinnerType[0] == "completed")
	            {
	            	displayMessage("Please set scores..")
	            }
	            else
	            {
	            	
	            	var data = details;
	            	data.setWins = {"playerA":playerAWinCount,"playerB":playerBWinCount};
	            	data.scores =  {"setScoresA":playerAScore,
	            	"setScoresB":playerBScore};
	            	data.winnerID = winnerID;
	            	data.loserID = loserID;
                    if(checkedWinnerType && checkedWinnerType[0])
                        data.winnerType = checkedWinnerType[0];

	            	var inVersedata = {};
	            	inVersedata.rowNo = data.colNo;
	            	inVersedata.colNo = data.rowNo;
	            	inVersedata.setWins = {"playerA":playerBWinCount,"playerB":playerAWinCount};
					inVersedata.scores =  {"setScoresA":playerBScore,
	            	"setScoresB":playerAScore};
	            	inVersedata.winnerID = winnerID;
	            	inVersedata.loserID = loserID;
                    if(checkedWinnerType && checkedWinnerType[0])
                        inVersedata.winnerType = checkedWinnerType[0];


	            	Meteor.call("updateRRScores",Session.get("currentPlayerMatchID"),data,inVersedata,function(error,result)
	            	{
	            		if(result)
	            		{
	            			Session.set("roundRobinDraws",result);  
	            			$("#scoreRRDetails").modal('hide');
					        $("#setRRScorePopUp").empty();   
					        $( '.modal-backdrop' ).remove();

	            		}
	            	})
	            	
	            }




        	}
        	else
        	{
                if(checkedWinner.length == 0)
        		    displayMessage("Please choose winner")
                else if(checkedWinnerType.length == 0)
                    displayMessage("Please choose bye/walkover/completed")
        	}
    		
    	}catch(e){
    	}
       
    },

    

})