Template.teams34Format.onRendered(function(){

})

Template.teams34Format.onCreated(function(){

})

Template.teams34Format.onDestroyed(function(){
	Session.set("thirdFourTournamnetId",undefined)
	Session.set("thirdFourEventName",undefined)
})

Template.teams34Format.helpers({
	"fetchLosersTeamId":function(){
		try{
			if(Session.get("thirdFourEventName") && Session.get("thirdFourTournamnetId")){
				var data = {
					tournamentId:Session.get("thirdFourTournamnetId"),
					eventName:Session.get("thirdFourEventName")
				}
				var s = ReactiveMethod.call("fetchLoserForBMRoundData",data)
				if(s && s.status==SUCCESS_STATUS && s.data){
					return s.data
				}
				else{
					return false
				}
			}
		}catch(e){}
	},
	"dataForScoresA":function(){
		try{
			
			if(Session.get("scoreDetailsthirdFour") && Session.get("scoreDetailsthirdFour").length && 
				Session.get("scoreDetailsthirdFour")[0] && Session.get("scoreDetailsthirdFour")[0].matchRecords.scores && 
				Session.get("scoreDetailsthirdFour")[0].matchRecords.scores.setScoresA && 
				Session.get("scoreDetailsthirdFour")[0].matchRecords.scores.setScoresB){
				return Session.get("scoreDetailsthirdFour")[0].matchRecords.scores.setScoresA
			}
		}catch(e){}
	},
	"dataForScoresB":function(){
		try{
			if(Session.get("scoreDetailsthirdFour") && Session.get("scoreDetailsthirdFour").length && 
				Session.get("scoreDetailsthirdFour")[0] && Session.get("scoreDetailsthirdFour")[0].matchRecords.scores && 
				Session.get("scoreDetailsthirdFour")[0].matchRecords.scores.setScoresA && 
				Session.get("scoreDetailsthirdFour")[0].matchRecords.scores.setScoresB){
				return Session.get("scoreDetailsthirdFour")[0].matchRecords.scores.setScoresB
			}
		}catch(e){}
	},
	setScoresLength:function(){
        try{
            if((Session.get("scoreDetailsthirdFour")[0].matchRecords.scores
             && Session.get("scoreDetailsthirdFour")[0].matchRecords.scores.setScoresB &&
                Session.get("scoreDetailsthirdFour")[0].matchRecords.scores.setScoresB.length>7)
                ||(Session.get("scoreDetailsthirdFour")[0].matchRecords.scores && 
                	Session.get("scoreDetailsthirdFour")[0].matchRecords.scores.setScoresA &&
                Session.get("scoreDetailsthirdFour")[0].matchRecords.scores.setScoresA.length>7)){
                return true
            }
            else{
                return false
            }
        }catch(e){
        }
    },
    statusString:function(){
    	try{
            if(Session.get("scoreDetailsthirdFour") && Session.get("scoreDetailsthirdFour").length && 
				Session.get("scoreDetailsthirdFour")[0] && Session.get("scoreDetailsthirdFour")[0].matchRecords.status){
                return Session.get("scoreDetailsthirdFour")[0].matchRecords.status
            }
            else{
                return false
            }
        }catch(e){
        }
    },
    winnerTeamA:function(){
    	try{
    		if(Session.get("scoreDetailsthirdFour")[0].matchRecords.winnerID == 
    				Session.get("scoreDetailsthirdFour")[0].matchRecords.teamsID.teamAId){
    			return true
    		}
    	}catch(e){}
    },
    winnerTeamB:function(){
		try{
			if(Session.get("scoreDetailsthirdFour")[0].matchRecords.winnerID == 
    				Session.get("scoreDetailsthirdFour")[0].matchRecords.teamsID.teamBId){
    			return true
    		}
    	}catch(e){}
    }
})

Template.teams34Format.events({
	"click #setDetailedScores":async function(e){
		try{
			var data1 = {
				tournamentId:Session.get("thirdFourTournamnetId"),
            	"eventName": Session.get("thirdFourEventName"),
            }
			var getData = await Meteor.callPromise("fetchLoserForBMRoundData",data1)
			if(getData && getData.status == SUCCESS_STATUS && getData.data){
				var data = {
					tournamentId:Session.get("thirdFourTournamnetId"),
	            	"eventName": Session.get("thirdFourEventName"),
	            	"teamAName":getData.data.team1Name,
					"teamBName":getData.data.team2Name,
					"teamAId":getData.data.team1Id,
					"teamBId":getData.data.team2Id,
					"teamAManagerId":getData.data.team1Manager,
					"teamBManagerId":getData.data.team2Manager
				}

				Meteor.call("insertOrUpdateRoundBMTeam",data, async function(e,res1){
					if(e){
						alert(e.reason)
					}
					else{
						if(res1 && res1.status==SUCCESS_STATUS && res1.data){
							res1.data.roundBM = true
							Session.set("teamDetailedDraws",res1.data)
							var res = await Meteor.callPromise("getTeamFormatIdForOtherFormats",data1)
					        try{
					            if(res && res.status==FAIL_STATUS && res.data){
					                Blaze.render(Template.SettingsTeamDraws, $("#renderbyeWalkOverTeams")[0]);

					                $("#SettingsTeamDraws").modal({
					                    backdrop: 'static',
					                    keyboard: false
					                });       
					            }else if(res && res.status==SUCCESS_STATUS && res.data){
					                //call new foramt id
					                var data = {
					                     tournamentId:Session.get("thirdFourTournamnetId"),
					                    "eventName": Session.get("thirdFourEventName"),
					                    "matchNumber":Session.get("teamDetailedDraws").matchNumber
					                }

					                var dataSavedForDet = await Meteor.callPromise("getTeamDetailedDrawsForToss",data)

					                if(dataSavedForDet && dataSavedForDet.status == SUCCESS_STATUS && 
					                    dataSavedForDet.data){
					                    if(dataSavedForDet.data && dataSavedForDet.data.specifications && 
					                        dataSavedForDet.data.specifications.length){
					                        Session.set("arrayOfWinnerIds",dataSavedForDet.data.specifications)
					                    }
					                    else{
					                        Session.set("arrayOfWinnerIds",[])
					                    }

					                    Session.set("winnerIdsBeforeSEt",dataSavedForDet.data)
					                }
					                else{
					                    Session.set("arrayOfWinnerIds",[])
					                    Session.set("winnerIdsBeforeSEt",[])
					                }
					                //call popup
					                Session.set("teamDrawsDetTeamFormatId",res.data)
					                
					                $("#teams34Format").modal('hide')
					                Blaze.render(Template.tossDetailedDraws, $("#renderbyeWalkOverTeamsOth")[0]);

					                $("#tossDetailedDraws").modal({
					                    backdrop: 'static',
					                    keyboard: false
					                }); 
					            }else {
					                Blaze.render(Template.SettingsTeamDraws, $("#renderbyeWalkOverTeamsOth")[0]);
					                $("#teams34Format").modal('hide')

					                $("#SettingsTeamDraws").modal({
					                    backdrop: 'static',
					                    keyboard: false
					                });       
					            }
					        }catch(e){
					            alert(e)
					        }
						}
						else{
							Session.set("teamDetailedDraws",[])
						}
					}
				})

			}
		}catch(e){
			alert(e)
		}
	},
	"click #closeTeamFormatCreate":function(e){
		try{
			$("#teams34Format").modal('hide');
		}catch(e){
			alert(e)
		}
	},
	"click #openMoreScores_34":function(e){
        $("#renderMoreScTeamsOth").empty();
        Blaze.render(Template.teamsMorescores, $("#renderMoreScTeamsOth")[0]);

        $("#teamsMorescores").modal({
            backdrop: 'static',
            keyboard: false
        });
    },
})