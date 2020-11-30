Template.SettingsTeamDraws.onCreated(function(){

});

Template.SettingsTeamDraws.onRendered(function(){

});

Template.SettingsTeamDraws.helpers({

});

Template.SettingsTeamDraws.events({

});

Template.teamSpecFormModal.onCreated(function(){
	this.subscribe("teamSPECDetails",Session.get("tournamentId"),Session.get("eventName"))
});

Template.teamSpecFormModal.onRendered(function(){
});

Template.teamSpecFormModal.helpers({
	"readonlyForViewers":function(){
        if(Session.get("viewerOrOrganizerEdit")!=undefined){
            if(Session.get("viewerOrOrganizerEdit")==true)
                return false
            else
                return true
        }
    },
	"getTeamNames":function(){
		try{
			if(Session.get("teamDetailedDraws")){
				var det = Session.get("teamDetailedDraws")
				if(det&&det.teams&&det.teams.teamA){
					return det.teams
				}
			}
		}catch(e){}
	},
	teamIDA:function(){
		try{
			if(Session.get("teamDetailedDraws")){
				var det = Session.get("teamDetailedDraws")
				if(det&&det.teams&&det.teamsID&&det.teamsID.teamAId){
					return det.teamsID.teamAId
				}
			}
		}catch(e){}
	},
	teamIDB:function(){
		try{
			if(Session.get("teamDetailedDraws")){
				var det = Session.get("teamDetailedDraws")
				if(det&&det.teams&&det.teamsID&&det.teamsID.teamBId){
					return det.teamsID.teamBId
				}
			}
		}catch(e){}
	},
	//player A team A
	checkSavedSpecPlayerATeamA:function(){
		try{
			if(Session.get("tournamentId")&&Session.get("eventName")&&Session.get("teamDetailedDraws")){
				var userId = this.userId;
				var tournamentId = Session.get("tournamentId");
				var eventName = Session.get("eventName")
				var det = Session.get("teamDetailedDraws")
				if(det&&det.matchNumber!=undefined&&det.roundNumber!=undefined&&det.teamsID&&det.teamsID.teamAId){
					var s = ReactiveMethod.call("getMatchUserIdTeamSpec",tournamentId,eventName,det.matchNumber,det.roundNumber,det.teamsID.teamAId)
					if(s&&s.teamAPlayerAId){
						if(userId==s.teamAPlayerAId){
							return true
						}
					}
				}
			}

		}catch(e){}
	},
	//player B team a
	checkSavedSpecPlayerBTeamA:function(){
		try{
			if(Session.get("tournamentId")&&Session.get("eventName")&&Session.get("teamDetailedDraws")){
				var userId = this.userId;
				var tournamentId = Session.get("tournamentId");
				var eventName = Session.get("eventName")
				var det = Session.get("teamDetailedDraws")
				if(det&&det.matchNumber!=undefined&&det.roundNumber!=undefined&&det.teamsID&&det.teamsID.teamAId){
					var s = ReactiveMethod.call("getMatchUserIdTeamSpec",tournamentId,eventName,det.matchNumber,det.roundNumber,det.teamsID.teamAId)
					if(s&&s.teamAPlayerBId){
						if(userId==s.teamAPlayerBId){
							return true
						}
					}
				}
			}

		}catch(e){
		}
	},
	//player A team a doub
	checkSavedSpecPlayerATeamADoubles:function(){
		try{
			if(Session.get("tournamentId")&&Session.get("eventName")&&Session.get("teamDetailedDraws")){
				var userId = this.userId;
				var tournamentId = Session.get("tournamentId");
				var eventName = Session.get("eventName")
				var det = Session.get("teamDetailedDraws")
				if(det&&det.matchNumber!=undefined&&det.roundNumber!=undefined&&det.teamsID&&det.teamsID.teamAId){
					var s = ReactiveMethod.call("getMatchUserIdTeamSpec",tournamentId,eventName,det.matchNumber,det.roundNumber,det.teamsID.teamAId)
					if(s&&s.teamADoubles1PlayerId){
						if(userId==s.teamADoubles1PlayerId){
							return true
						}
					}
				}
			}

		}catch(e){}
	},
	//player b team a doub
	checkSavedSpecPlayerBTeamADoubles:function(){
		try{
			if(Session.get("tournamentId")&&Session.get("eventName")&&Session.get("teamDetailedDraws")){
				var userId = this.userId;
				var tournamentId = Session.get("tournamentId");
				var eventName = Session.get("eventName")
				var det = Session.get("teamDetailedDraws")
				if(det&&det.matchNumber!=undefined&&det.roundNumber!=undefined&&det.teamsID&&det.teamsID.teamAId){
					var s = ReactiveMethod.call("getMatchUserIdTeamSpec",tournamentId,eventName,det.matchNumber,det.roundNumber,det.teamsID.teamAId)
					if(s&&s.teamADoubles2PlayerId){
						if(userId==s.teamADoubles2PlayerId){
							return true
						}
					}
				}
			}

		}catch(e){}
	},
	//player a team b
	checkSavedSpecPlayerATeamB:function(){
		try{
			if(Session.get("tournamentId")&&Session.get("eventName")&&Session.get("teamDetailedDraws")){
				var userId = this.userId;
				var tournamentId = Session.get("tournamentId");
				var eventName = Session.get("eventName")
				var det = Session.get("teamDetailedDraws")
				if(det&&det.matchNumber!=undefined&&det.roundNumber!=undefined){
					var s = ReactiveMethod.call("getMatchUserIdTeamSpec",tournamentId,eventName,det.matchNumber,det.roundNumber)
					if(s&&s.teamBPlayerAId){
						if(userId==s.teamBPlayerAId){
							return true
						}
					}
				}
			}

		}catch(e){}
	},
	//player b team b
	checkSavedSpecPlayerBTeamB:function(){
		try{
			if(Session.get("tournamentId")&&Session.get("eventName")&&Session.get("teamDetailedDraws")){
				var userId = this.userId;
				var tournamentId = Session.get("tournamentId");
				var eventName = Session.get("eventName")
				var det = Session.get("teamDetailedDraws")
				if(det&&det.matchNumber!=undefined&&det.roundNumber!=undefined){
					var s = ReactiveMethod.call("getMatchUserIdTeamSpec",tournamentId,eventName,det.matchNumber,det.roundNumber)
					if(s&&s.teamBPlayerBId){
						if(userId==s.teamBPlayerBId){
							return true
						}
					}
				}
			}

		}catch(e){}
	},
	//player a team b doubles
	checkSavedSpecPlayerATeamBDoubles:function(){
		try{
			if(Session.get("tournamentId")&&Session.get("eventName")&&Session.get("teamDetailedDraws")){
				var userId = this.userId;
				var tournamentId = Session.get("tournamentId");
				var eventName = Session.get("eventName")
				var det = Session.get("teamDetailedDraws")
				if(det&&det.matchNumber!=undefined&&det.roundNumber!=undefined){
					var s = ReactiveMethod.call("getMatchUserIdTeamSpec",tournamentId,eventName,det.matchNumber,det.roundNumber)
					if(s&&s.teamBDoubles1PlayerId){
						if(userId==s.teamBDoubles1PlayerId){
							return true
						}
					}
				}
			}

		}catch(e){}
	},
	//player b team b doubles
	checkSavedSpecPlayerBTeamBDoubles:function(){
		try{
			if(Session.get("tournamentId")&&Session.get("eventName")&&Session.get("teamDetailedDraws")){
				var userId = this.userId;
				var tournamentId = Session.get("tournamentId");
				var eventName = Session.get("eventName")
				var det = Session.get("teamDetailedDraws")
				if(det&&det.matchNumber!=undefined&&det.roundNumber!=undefined){
					var s = ReactiveMethod.call("getMatchUserIdTeamSpec",tournamentId,eventName,det.matchNumber,det.roundNumber)
					if(s&&s.teamBDoubles2PlayerId){
						if(userId==s.teamBDoubles2PlayerId){
							return true
						}
					}
				}
			}
		}catch(e){}
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
    "lockStatus":function()
    {
        //byeWalkOver
        var tournamentId = Session.get("tournamentId");
        var eventName = Session.get("eventName");
        var result2 = ReactiveMethod.call("getMatchDrawsLock",tournamentId,eventName);
        return result2;
    }
});

Template.teamSpecFormModal.events({
	"click #saveTeamSpecForm":function(e){
		try{
			e.preventDefault();		
			$("#TeamSpecErrorShow").html("")

			//check both the team contains same players
			//check for team A playerA and playerB of same ID
			if(($("#teamAPlayerA").val().trim()!=="1"&&$("#teamAPlayerB").val().trim()!=="1")&&
				$("#teamAPlayerA").val().trim()==$("#teamAPlayerB").val().trim()){
				$("#TeamSpecErrorShow").html("Player A and Player B of team A cannot be same")
				return false;
			}
			//check for team B playerA and playerB of same ID
			else if(($("#teamBPlayerA").val().trim()!=="1"&&$("#teamBPlayerB").val().trim()!=="1")&&
				($("#teamBPlayerA").val().trim()==$("#teamBPlayerB").val().trim())){
				$("#TeamSpecErrorShow").html("Player X and Player Y of team B cannot be same")
				return false;
			}	
			//check for team A playerA and teamB playerA of same ID
			else if(($("#teamAPlayerA").val().trim()!=="1"&&$("#teamBPlayerA").val().trim()!=="1")&&
				($("#teamAPlayerA").val().trim()==$("#teamBPlayerA").val().trim())){
				$("#TeamSpecErrorShow").html("Player A of team A and Player X of team B cannot be same")
				return false;
			}
			//check for team A playerA and teamB playerB of same ID
			else if(($("#teamAPlayerA").val().trim()!=="1"&&$("#teamBPlayerB").val().trim()!=="1")&&
				($("#teamAPlayerA").val().trim()==$("#teamBPlayerB").val().trim())){
				$("#TeamSpecErrorShow").html("Player A of team A and Player Y of team B cannot be same")
				return false;
			}
			//check for team A playerB and teamB playerB of same ID
			else if(($("#teamAPlayerB").val().trim()!=="1"&&$("#teamBPlayerB").val().trim()!=="1")&&
				($("#teamAPlayerB").val().trim()==$("#teamBPlayerB").val().trim())){
				$("#TeamSpecErrorShow").html("Player B of team A and Player Y of team B cannot be same")
				return false;
			}		
			//check for team A playerB and teamB playerA of same ID
			else if(($("#teamAPlayerB").val().trim()!=="1"&&$("#teamBPlayerA").val().trim()!=="1")&&
				($("#teamAPlayerB").val().trim()==$("#teamBPlayerA").val().trim())){
				$("#TeamSpecErrorShow").html("Player B of team A and Player X of team B cannot be same")
				return false;
			}		
			//check for team A doub playerA and playerB		
			else if(($("#teamAPlayerADoub").val().trim()!=="1"&&$("#teamAPlayerBDoub").val().trim()!=="1")&&
				($("#teamAPlayerADoub").val().trim()==$("#teamAPlayerBDoub").val().trim())){
				$("#TeamSpecErrorShow").html("Doubles-1 Player of team A and Doubles-2 Player of team A cannot be same")
				return false;
			}		
			//check for team A doub playerA and team B doub playerA		
			else if(($("#teamAPlayerADoub").val().trim()!=="1"&&$("#teamBPlayerADoub").val().trim()!=="1")&&
				($("#teamAPlayerADoub").val().trim()==$("#teamBPlayerADoub").val().trim())){
				$("#TeamSpecErrorShow").html("Doubles-1 Player of team A and Doubles-1 Player of team B cannot be same")
				return false;
			}		
			//check for team A doub playerA and team B doub playerB	
			else if(($("#teamAPlayerADoub").val().trim()!=="1"&&$("#teamBPlayerBDoub").val().trim()!=="1")&&
				($("#teamAPlayerADoub").val().trim()==$("#teamBPlayerBDoub").val().trim())){
				$("#TeamSpecErrorShow").html("Doubles-1 Player of team A and Doubles-2 Player of team B cannot be same")
				return false;
			}
			//check for team A doub playerB and team B doub playerA		
			else if(($("#teamAPlayerBDoub").val().trim()!=="1"&&$("#teamBPlayerADoub").val().trim()!=="1")&&
				($("#teamAPlayerBDoub").val().trim()==$("#teamBPlayerADoub").val().trim())){
				$("#TeamSpecErrorShow").html("Doubles-2 Player of team A and Doubles-1 Player of team B cannot be same")
				return false;
			}		
			//check for team A doub playerB and team B doub playerB		
			else if(($("#teamAPlayerBDoub").val().trim()!=="1"&&$("#teamBPlayerBDoub").val().trim()!=="1")&&
				($("#teamAPlayerBDoub").val().trim()==$("#teamBPlayerBDoub").val().trim())){
				$("#TeamSpecErrorShow").html("Doubles-2 Player of team A and Doubles-2 Player of team B cannot be same")
				return false;
			}		
			//check for team B doub playerA and playerB		
			else if(($("#teamBPlayerADoub").val().trim()!=="1"&&$("#teamBPlayerBDoub").val().trim()!=="1")&&
				($("#teamBPlayerADoub").val().trim()==$("#teamBPlayerBDoub").val().trim())){
				$("#TeamSpecErrorShow").html("Doubles-1 Player of team B and Doubles-2 Player of team B cannot be same")
				return false;
			}
			//doubles
			//check for player a of team a doubles1 team b
			else if(($("#teamAPlayerA").val().trim()!=="1"&&$("#teamBPlayerADoub").val().trim()!=="1")&&
				($("#teamAPlayerA").val().trim()==$("#teamBPlayerADoub").val().trim())){
				$("#TeamSpecErrorShow").html("Player A of team A and Doubles-1 Player of team B cannot be same")
				return false;
			}
			//check for player a of team a doubles2 team b
			else if(($("#teamAPlayerA").val().trim()!=="1"&&$("#teamBPlayerBDoub").val().trim()!=="1")&&
				($("#teamAPlayerA").val().trim()==$("#teamBPlayerBDoub").val().trim())){
				$("#TeamSpecErrorShow").html("Player A of team A and Doubles-2 Player of team B cannot be same")
				return false;
			}
			//check for player a of team b doubles1 team a -- d
			else if(($("#teamBPlayerA").val().trim()!=="1"&&$("#teamAPlayerADoub").val().trim()!=="1")&&
				($("#teamBPlayerA").val().trim()==$("#teamAPlayerADoub").val().trim())){
				$("#TeamSpecErrorShow").html("Player X of team B and Doubles-1 Player of team A cannot be same")
				return false;
			}
			//check for player a of team b doubles2 team a -- d
			else if(($("#teamBPlayerA").val().trim()!=="1"&&$("#teamAPlayerBDoub").val().trim()!=="1")&&
				($("#teamBPlayerA").val().trim()==$("#teamAPlayerBDoub").val().trim())){
				$("#TeamSpecErrorShow").html("Player X of team B and Doubles-2 Player of team A cannot be same")
				return false;
			}
			//check for player b of team a doubles1 team b -- d
			else if(($("#teamAPlayerB").val().trim()!=="1"&&$("#teamBPlayerADoub").val().trim()!=="1")&&
				($("#teamAPlayerB").val().trim()==$("#teamBPlayerADoub").val().trim())){
				$("#TeamSpecErrorShow").html("Player B of team A and Doubles-1 Player of team B cannot be same")
				return false;
			}

			//check for player b of team a doubles2 team b -- d
			else if(($("#teamAPlayerB").val().trim()!=="1"&&$("#teamBPlayerBDoub").val().trim()!=="1")&&
				($("#teamAPlayerB").val().trim()==$("#teamBPlayerBDoub").val().trim())){
				$("#TeamSpecErrorShow").html("Player B of team A and Doubles-2 Player of team B cannot be same")
				return false;
			}
			//check for player b of team b doubles1 team a -- d
			else if(($("#teamBPlayerB").val().trim()!=="1"&&$("#teamAPlayerADoub").val().trim()!=="1")&&
				($("#teamBPlayerB").val().trim()==$("#teamAPlayerADoub").val().trim())){
				$("#TeamSpecErrorShow").html("Player Y of team B and Doubles-1 Player of team A cannot be same")
				return false;
			}
			//check for player b of team b doubles2 team a
			else if(($("#teamBPlayerB").val().trim()!=="1"&&$("#teamAPlayerBDoub").val().trim()!=="1")&&
				($("#teamBPlayerB").val().trim()==$("#teamAPlayerBDoub").val().trim())){
				$("#TeamSpecErrorShow").html("Player Y of team B and Doubles-2 Player of team A cannot be same")
				return false;
			}
			else{
				var tournamentId=" ";
				var eventName=" ";
				var teamDet = [];
				var matchNumber;
				var roundNumber;
				var teamAID="1";
				var teamBID="1";
				var teamAPlayerAId="1";
				var teamAPlayerBId="1";
				var teamBPlayerAId="1";
				var teamBPlayerBId="1";
				var teamADoubles1PlayerId="1";
				var teamADoubles2PlayerId="1";
				var teamBDoubles1PlayerId="1";
				var teamBDoubles2PlayerId="1";

				if(Session.get("teamDetailedDraws")){
					var det = Session.get("teamDetailedDraws");

					if($("#teamAPlayerA").val().trim()!=="1"){
						teamAPlayerAId = $("#teamAPlayerA").val().trim()
					}
					if($("#teamAPlayerB").val().trim()!=="1"){
						teamAPlayerBId = $("#teamAPlayerB").val().trim()
					}
					if($("#teamBPlayerA").val().trim()!=="1"){
						teamBPlayerAId = $("#teamBPlayerA").val().trim()
					}
					if($("#teamBPlayerB").val().trim()!=="1"){
						teamBPlayerBId = $("#teamBPlayerB").val().trim()
					}
					if($("#teamAPlayerADoub").val().trim()!=="1"){
						teamADoubles1PlayerId = $("#teamAPlayerADoub").val().trim()
					}
					if($("#teamAPlayerBDoub").val().trim()!=="1"){
						teamADoubles2PlayerId = $("#teamAPlayerBDoub").val().trim()
					}
					if($("#teamBPlayerADoub").val().trim()!=="1"){
						teamBDoubles1PlayerId = $("#teamBPlayerADoub").val().trim()
					}
					if($("#teamBPlayerBDoub").val().trim()!=="1"){
						teamBDoubles2PlayerId = $("#teamBPlayerBDoub").val().trim()
					}
					if(det&&det.matchNumber){
						matchNumber = parseInt(det.matchNumber)
					}
					if(det&&det.roundNumber){
						roundNumber = parseInt(det.roundNumber)
					}
					if(Session.get("tournamentId")){
						tournamentId = Session.get("tournamentId")
					}
					if(Session.get("eventName")){
						eventName = Session.get("eventName")
					}
					if(det&&det.teamsID&&det.teamsID.teamAId){
						teamAID = det.teamsID.teamAId
					}
					if(det&&det.teamsID&&det.teamsID.teamBId){
						teamBID = det.teamsID.teamBId
					}
					var data = {
						teamAID:teamAID,
						teamBID:teamBID,
						teamAPlayerAId:teamAPlayerAId,
						teamAPlayerBId:teamAPlayerBId,
						teamBPlayerAId:teamBPlayerAId,
						teamBPlayerBId:teamBPlayerBId,
						teamADoubles1PlayerId:teamADoubles1PlayerId,
						teamADoubles2PlayerId:teamADoubles2PlayerId,
						teamBDoubles1PlayerId:teamBDoubles1PlayerId,
						teamBDoubles2PlayerId:teamBDoubles2PlayerId,
						matchNumber:matchNumber,
						roundNumber:roundNumber
					}
					//call method to save specification for team details
					Meteor.call("saveTeamSpecFormData",tournamentId,eventName,data,function(e,res){
						if(e){

						}else{
							alert("Data Saved")
						}
					})
				}
			}
		}catch(e){
		}
	},
});

Template.registerHelper("getTeamPlayersListTeamB",function(teamIDB){
	try{
		if(Session.get("teamDetailedDraws")){
			var det = Session.get("teamDetailedDraws")
			if(det&&det.teams&&det.teamsID.teamBId){
				var s = ReactiveMethod.call("teamPlayersFetch",teamIDB,Session.get("tournamentId"));
				if(s){
					return s
				}
			}
		}
	}catch(e){

	}
});

Template.registerHelper("getTeamPlayersListTeamA",function(teamIDA){
	try{
		if(Session.get("teamDetailedDraws")){
			var det = Session.get("teamDetailedDraws")
			if(det&&det.teams&&det.teamsID.teamAId){
				var s = ReactiveMethod.call("teamPlayersFetch",teamIDA,Session.get("tournamentId"));
				if(s){
					return s
				}
			}
		}
	}catch(e){

	}
})

