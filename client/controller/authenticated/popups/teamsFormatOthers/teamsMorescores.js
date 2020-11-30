Template.teamsMorescores.onCreated(function(){

})

Template.teamsMorescores.onRendered(function(){

})

Template.teamsMorescores.helpers({
	"roundNumMatchnumMore":function(e){
		try{
			if(Session.get("teamDetailedDraws")){
				var s = Session.get("teamDetailedDraws")
				if(s && s.roundNumber && s.matchNumber){
					return "Round: "+s.roundNumber+" Match: "+s.matchNumber
				}
			}
		}catch(e){

		}
	},
	teamIDAOthMore:function(){
		try{
			if(Session.get("teamDetailedDraws")){
				var det = Session.get("teamDetailedDraws")
				if(det&&det.teams&&det.teamsID&&det.teamsID.teamAId){
					return det.teamsID.teamAId
				}
			}
		}catch(e){}
	},
	teamIDBOthMore:function(){
		try{
			if(Session.get("teamDetailedDraws")){
				var det = Session.get("teamDetailedDraws")
				if(det&&det.teams&&det.teamsID&&det.teamsID.teamBId){
					return det.teamsID.teamBId
				}
			}
		}catch(e){}
	},
	getTeamsNamesForIdMOre:function(teamId){
		try{
			var data = {
				teamId:teamId,
				tournamentId:Session.get("tournamentId")
			}
			var getDet = ReactiveMethod.call("getTeamDetailsForToss",data)
			if(getDet && getDet.status==SUCCESS_STATUS&& getDet.data && 
				getDet.data.length && getDet.data[0] && getDet.data[0].teamName){
				return getDet.data[0].teamName
			}
		}catch(e){}
	},
	numberOfScoresAndValuesA:function(){
		try{
			if(Session.get("teamDetailedDraws")){
				var det = Session.get("teamDetailedDraws")
				if(det && det.scores.setScoresA && det.scores.setScoresA.length){
					return det.scores.setScoresA
				}
			}
		}catch(e){

		}
	},
	numberOfScoresAndValuesB:function(){
		try{
			if(Session.get("teamDetailedDraws")){
				var det = Session.get("teamDetailedDraws")
				if(det && det.scores.setScoresB && det.scores.setScoresB.length){
					return det.scores.setScoresB
				}
			}
		}catch(e){

		}
	},
	Scores_teamSettingsB: function(ind) {
		try{
			if(Session.get("teamDetailedDraws")){
				var det = Session.get("teamDetailedDraws")
		 		if (parseInt(det.scores.setScoresB[ind]) != 0) {
	            	if (parseInt(det.scores.setScoresA[ind]) > parseInt(det.scores.setScoresB[ind]))
	                	return "background:#EEEAEA !important";
	            	else
	                	return "background:#EEEAEA !important";
	        	}
	    	}
    	}catch(e){
    		alert(e)
    	}
    },
    Scores_teamSettingsA: function(ind) {
		try{
			if(Session.get("teamDetailedDraws")){
				var det = Session.get("teamDetailedDraws")
		 		if (parseInt(det.scores.setScoresA[ind]) != 0) {
	            	if (parseInt(det.scores.setScoresB[ind]) > parseInt(det.scores.setScoresA[ind]))
	                	return "background:#EEEAEA !important";
	            	else
	                	return "background:#EEEAEA !important";
	        	}
	    	}
    	}catch(e){
    		alert(e)
    	}
    },
})

Template.teamsMorescores.events({
	"click #closePopupp":function(){
		$("#teamsMorescores").modal('hide')
        $( '.modal-backdrop' ).remove();
	}
})