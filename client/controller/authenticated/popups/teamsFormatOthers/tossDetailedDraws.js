
import { updateTeamDetailedScoresToMatchCollec } from '../../draws/detailedScoresTeamDraws.js'

Template.tossDetailedDraws.onCreated(function(){
})

Template.tossDetailedDraws.onRendered(function(){
	if(Session.get("arrayOfWinnerIds")){
	}
	else{
		Session.set("arrayOfWinnerIds",[])
	}
	$("#errorMsgTeamDet").html("")
})

Template.tossDetailedDraws.onDestroyed(function(){
	Session.set("arrayOfWinnerIds",[])
	$("#errorMsgTeamDet").html("")
})

Template.tossDetailedDraws.helpers({
	"matchesTypes":function(){
		try{
			var s = [{
			 	l:"notPlayed",
			 	d:"Not played"
			}, 
			{
				l:"walkover",
				d:"Walkover"
			}, 
			{	
				l:"bye",
				d:"Bye"
			}, 
			{	
				l:"completed",
				d:"Completed"
			}]
			return s
		}catch(e){}
	},
	"setMatchType":function(no,matchType){
		try{
			if(Session.get("winnerIdsBeforeSEt") 
				 && Session.get("winnerIdsBeforeSEt").specifications &&
				  Session.get("winnerIdsBeforeSEt").specifications.length){
				var arrayDataSessW = Session.get("winnerIdsBeforeSEt").specifications
				var idData = _.findWhere(arrayDataSessW, {no:  no});
				if(idData && idData.matchType && matchType && 
					idData.matchType.toLowerCase()==matchType.toLowerCase()){
					return true
				}else{
					return false
				}
			}else{
				return false
			}
		}catch(e){

		}
	},
	"setPlayerAID":function(no,userId){
		try{
			if(Session.get("winnerIdsBeforeSEt") 
				 && Session.get("winnerIdsBeforeSEt").specifications &&
				  Session.get("winnerIdsBeforeSEt").specifications.length){
				var arrayDataSessW = Session.get("winnerIdsBeforeSEt").specifications
				var idData = _.findWhere(arrayDataSessW, {no:  no});
				if(idData && idData.playerAId==userId){
					return true
				}else{
					return false
				}
			}else{
				return false
			}
		}catch(e){

		}
	},
	"setPlayerBID":function(no,userId){
		try{
			if(Session.get("winnerIdsBeforeSEt") 
				 && Session.get("winnerIdsBeforeSEt").specifications &&
				  Session.get("winnerIdsBeforeSEt").specifications.length){
				var arrayDataSessW = Session.get("winnerIdsBeforeSEt").specifications
				var idData = _.findWhere(arrayDataSessW, {no:  no});
				if(idData && idData.playerBId==userId){
					return true
				}else{
					return false
				}
			}else{
				return false
			}
		}catch(e){

		}
	},
	"setPlayerA1ID":function(no,userId){
		try{
			if(Session.get("winnerIdsBeforeSEt") 
				 && Session.get("winnerIdsBeforeSEt").specifications &&
				  Session.get("winnerIdsBeforeSEt").specifications.length){
				var arrayDataSessW = Session.get("winnerIdsBeforeSEt").specifications
				var idData = _.findWhere(arrayDataSessW, {no:  no});
				if(idData && idData.playerA1Id==userId){
					return true
				}else{
					return false
				}
			}else{
				return false
			}
		}catch(e){

		}
	},
	"setPlayerA2ID":function(no,userId){
		try{
			if(Session.get("winnerIdsBeforeSEt") 
				 && Session.get("winnerIdsBeforeSEt").specifications &&
				  Session.get("winnerIdsBeforeSEt").specifications.length){
				var arrayDataSessW = Session.get("winnerIdsBeforeSEt").specifications
				var idData = _.findWhere(arrayDataSessW, {no:  no});
				if(idData && idData.playerA2Id==userId){
					return true
				}else{
					return false
				}
			}else{
				return false
			}
		}catch(e){

		}
	},
	"setPlayerB1ID":function(no,userId){
		try{
			if(Session.get("winnerIdsBeforeSEt") 
				 && Session.get("winnerIdsBeforeSEt").specifications &&
				  Session.get("winnerIdsBeforeSEt").specifications.length){
				var arrayDataSessW = Session.get("winnerIdsBeforeSEt").specifications
				var idData = _.findWhere(arrayDataSessW, {no:  no});
				if(idData && idData.playerB1Id==userId){
					return true
				}else{
					return false
				}
			}else{
				return false
			}
		}catch(e){

		}
	},
	"setPlayerB2ID":function(no,userId){
		try{
			if(Session.get("winnerIdsBeforeSEt") 
				 && Session.get("winnerIdsBeforeSEt").specifications &&
				  Session.get("winnerIdsBeforeSEt").specifications.length){
				var arrayDataSessW = Session.get("winnerIdsBeforeSEt").specifications
				var idData = _.findWhere(arrayDataSessW, {no:  no});
				if(idData && idData.playerB2Id==userId){
					return true
				}else{
					return false
				}
			}else{
				return false
			}
		}catch(e){

		}
	},
	"setPlayerSinglesWinner":function(no,userId){
		try{
			
			if(Session.get("winnerIdsBeforeSEt") 
				 && Session.get("winnerIdsBeforeSEt").specifications &&
				  Session.get("winnerIdsBeforeSEt").specifications.length){
				var arrayDataSessW = Session.get("winnerIdsBeforeSEt").specifications
				var idData = _.findWhere(arrayDataSessW, {no:  no});

				if(idData && idData.winnerIdPlayer==userId){
					return true
				}else{
					return false
				}
			}else{
				return false
			}
		}catch(e){

		}
	},
	"setPlayerDoublesWinner":function(no,userAId,userBId){
		try{
			if(Session.get("winnerIdsBeforeSEt") 
				 && Session.get("winnerIdsBeforeSEt").specifications &&
				  Session.get("winnerIdsBeforeSEt").specifications.length){
				var arrayDataSessW = Session.get("winnerIdsBeforeSEt").specifications
				var idData = _.findWhere(arrayDataSessW, {no:  no});

				if(idData && idData.winnerD1PlayerId==userAId &&
					idData.winnerD2PlayerId==userBId){
					return true
				}else{
					return false
				}
			}else{
				return false
			}
		}catch(e){

		}
	},
	"roundNumMatchnum":function(e){
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
	"specificationDetails":function(e){
		try{
			if(Session.get("teamDrawsDetTeamFormatId")){
				var data = {
					teamsFormatId:Session.get("teamDrawsDetTeamFormatId")
				}
				var getTeamDet = ReactiveMethod.call("selectedTeamFormatIdDetails",data)
				if(getTeamDet && getTeamDet.status==SUCCESS_STATUS && getTeamDet.data &&
					getTeamDet.data.specifications){
					return getTeamDet.data.specifications
				}else{
					return []
				}
			}else{
				return []	
			}
		}catch(e){}
	},
	checkForType:function(type){
		try{
			if(type && parseInt(type)==1){
				return true
			}
			else if(type && parseInt(type)==2){
				return false
			}
		}catch(e){}
	},
	"getTeamNamesOth":function(){
		try{
			if(Session.get("teamDetailedDraws")){
				var det = Session.get("teamDetailedDraws")
				if(det&&det.teams&&det.teams.teamA){
					return det.teams
				}
			}
		}catch(e){}
	},
	teamIDAOth:function(){
		try{
			if(Session.get("teamDetailedDraws")){
				var det = Session.get("teamDetailedDraws")
				if(det&&det.teams&&det.teamsID&&det.teamsID.teamAId){
					return det.teamsID.teamAId
				}
			}
		}catch(e){}
	},
	teamIDBOth:function(){
		try{
			if(Session.get("teamDetailedDraws")){
				var det = Session.get("teamDetailedDraws")
				if(det&&det.teams&&det.teamsID&&det.teamsID.teamBId){
					return det.teamsID.teamBId
				}
			}
		}catch(e){}
	},
	getTeamsNamesForId:function(teamId){
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
	setWinnersList:function(){
		try{
			if(Session.get("arrayOfWinnerIds") && 
				Session.get("arrayOfWinnerIds").length){
				var arrayDataSess = Session.get("arrayOfWinnerIds")
				var idData = _.findWhere(arrayDataSess, {no:  this.no});
				if(idData && this.no){
					return idData
				}else{
					return false
				}
			}else{
				return false
			}
		}catch(e){}
	},
	"lockStatus":function(){
        //byeWalkOver
        try{
	        var tournamentId = Session.get("tournamentId");
	        var eventName = Session.get("eventName");
	        var result2 = ReactiveMethod.call("getMatchDrawsLock",tournamentId,eventName);
	        return result2;
        }catch(e){}
    },
    /*getUserNameForId:function(userId){
    	
    },*/
    setScoresTempp:function(){
    	try{
    		var s = [{
    			"i":0,
    			"v":"0"
    		},{
    			"i":1,
    			"v":"0"
    		},{
    			"i":2,
    			"v":"0"
    		},{
    			"i":3,
    			"v":"0"
    		},{
    			"i":4,
    			"v":"0"
    		},{
    			"i":5,
    			"v":"0"
    		},{
    			"i":6,
    			"v":"0"
    		}]
    		return s
    	}catch(e){}
    },
    setScoresARender:function(no,index){
    	try{
			if(Session.get("winnerIdsBeforeSEt") 
				 && Session.get("winnerIdsBeforeSEt").specifications &&
				  Session.get("winnerIdsBeforeSEt").specifications.length){
				var arrayDataSessW = Session.get("winnerIdsBeforeSEt").specifications
				var idData = _.findWhere(arrayDataSessW, {no:  no});
				if(idData && idData.setScoresA && idData.setScoresA.length 
					&& idData.setScoresA[parseInt(index)]){
					return idData.setScoresA[parseInt(index)].toString()
				}else{
					return "0"
				}
			}else{
				return "0"
			}
		}catch(e){
			alert(e)
		}
    },
    setScoresBRender:function(no,index){
    	try{
			if(Session.get("winnerIdsBeforeSEt") 
				 && Session.get("winnerIdsBeforeSEt").specifications &&
				  Session.get("winnerIdsBeforeSEt").specifications.length){
				var arrayDataSessW = Session.get("winnerIdsBeforeSEt").specifications
				var idData = _.findWhere(arrayDataSessW, {no:  no});
				if(idData && idData.setScoresB && idData.setScoresB.length 
					&& idData.setScoresB[parseInt(index)]){
					return idData.setScoresB[parseInt(index)].toString()
				}else{
					return "0"
				}
			}else{
				return "0"
			}
		}catch(e){
			alert(e)
		}
    },
    setUltimateWinner:function(teamId){
    	try{
			if(Session.get("winnerIdsBeforeSEt") 
				 && Session.get("winnerIdsBeforeSEt").finalTeamWinner ){
				var arrayDataSessW = Session.get("winnerIdsBeforeSEt")
				var idData = arrayDataSessW
				if(idData && idData.finalTeamWinner && idData.finalTeamWinner==teamId){
					return true
				}else{
					return false
				}
			}else{
				return false
			}
		}catch(e){
			alert(e)
		}
    },
    setUltimateteamMatchType:function(l){
    	try{
			if(Session.get("winnerIdsBeforeSEt") 
				 && Session.get("winnerIdsBeforeSEt").teamMatchType){
				var arrayDataSessW = Session.get("winnerIdsBeforeSEt")
				var idData = arrayDataSessW
				if(idData && idData.teamMatchType && idData.teamMatchType
					&& idData.teamMatchType.toLowerCase()==l.toLowerCase()){
					return true
				}else{
					return false
				}
			}else{
				return false
			}
		}catch(e){
			alert(e)
		}
    },
    checkNotOne:function(id){
    	try{
    		if(id && id!="1"){
    			return true
    		}else{
    			return false
    		}
    	}catch(e){

    	}
    },
    checkFirstMatchOfRound:function(){

    }
})

Template.tossDetailedDraws.events({

	"change [id^=playerOfTeamASingle]":function(e){
		try{
			$("#errorMsgTeamDet").html("")
			if(e.target.value!="1"){
				var sD = this
				if(sD && sD.no){
					var idVal = $("#"+e.target.id+" option:selected").text()
					var arrayData = Session.get("arrayOfWinnerIds")
					var data = {
						no:sD.no,
						playerAId:e.target.value,
						playerAName:idVal
					}

					var searched = _.findWhere(arrayData, {no:  sD.no});
					if(searched){
						arrayData = _.without(arrayData, searched);
						data = searched
						data["playerAId"] = e.target.value
						data["playerAName"] = idVal
					}
					arrayData.push(data)

					Session.set("arrayOfWinnerIds",arrayData)
				}else{

				}
			}else{
				var sD = this
				if(sD && sD.no){
					var arrayData = Session.get("arrayOfWinnerIds")
					var searched = _.findWhere(arrayData, {no:  sD.no});
					if(searched){
						arrayData = _.without(arrayData, searched);
						data = searched
						data["playerAId"] = false
						data["playerAName"] = false
					}
					arrayData.push(data)
					Session.set("arrayOfWinnerIds",arrayData)
				}
			}
		}catch(e){
			alert(e)
		}
	},
	"change [id^=playerOfTeamBSingle]":function(e){
		try{
			$("#errorMsgTeamDet").html("")
			if(e.target.value!="1"){
				var sD = this
				if(sD && sD.no){
					var idVal = $("#"+e.target.id+" option:selected").text()
					var arrayData = Session.get("arrayOfWinnerIds")
					var data = {
						no:sD.no,
						playerBId:e.target.value,
						playerBName:idVal
					}

					var searched = _.findWhere(arrayData, {no:  sD.no});
					if(searched){
						arrayData = _.without(arrayData, searched);
						data = searched
						data["playerBId"] = e.target.value
						data["playerBName"] = idVal
					}
					arrayData.push(data)

					Session.set("arrayOfWinnerIds",arrayData)
				}else{

				}
			}else{
				var sD = this
				if(sD && sD.no){
					var arrayData = Session.get("arrayOfWinnerIds")
					var searched = _.findWhere(arrayData, {no:  sD.no});
					if(searched){
						arrayData = _.without(arrayData, searched);
						data = searched
						data["playerBId"] = false
						data["playerBName"] = false
					}
					arrayData.push(data)
					Session.set("arrayOfWinnerIds",arrayData)
				}
			}
		}catch(e){
			alert(e)
		}
	},
	"change [id^=playerOfTeamA1Doub]":function(e){
		try{
			$("#errorMsgTeamDet").html("")
			$("#errorMsgTeamDet").html("")
			if(e.target.value!="1"){
				var sD = this
				if(sD && sD.no){
					var idVal = $("#"+e.target.id+" option:selected").text()
					var arrayData = Session.get("arrayOfWinnerIds")
					var data = {
						no:sD.no,
						playerA1Id:e.target.value,
						playerA1Name:idVal
					}

					var searched = _.findWhere(arrayData, {no:  sD.no});
					if(searched){
						arrayData = _.without(arrayData, searched);
						data = searched
						data["playerA1Id"] = e.target.value
						data["playerA1Name"] = idVal
					}

					arrayData.push(data)

					Session.set("arrayOfWinnerIds",arrayData)
				}else{

				}
			}else{
				var sD = this
				if(sD && sD.no){
					var arrayData = Session.get("arrayOfWinnerIds")
					var searched = _.findWhere(arrayData, {no:  sD.no});
					if(searched){
						arrayData = _.without(arrayData, searched);
						data = searched
						data["playerA1Id"] = false
						data["playerA1Name"] = false
					}
					arrayData.push(data)
					Session.set("arrayOfWinnerIds",arrayData)
				}
			}
		}catch(e){
			alert(e)
		}
	},
	"change [id^=playerOfTeamB1Doub]":function(e){
		try{
			$("#errorMsgTeamDet").html("")
			if(e.target.value!="1"){
				var sD = this
				if(sD && sD.no){
					var idVal = $("#"+e.target.id+" option:selected").text()
					var arrayData = Session.get("arrayOfWinnerIds")
					var data = {
						no:sD.no,
						playerB1Id:e.target.value,
						playerB1Name:idVal
					}

					var searched = _.findWhere(arrayData, {no:  sD.no});
					if(searched){
						arrayData = _.without(arrayData, searched);
						data = searched
						data["playerB1Id"] = e.target.value
						data["playerB1Name"] = idVal
					}
					arrayData.push(data)
					Session.set("arrayOfWinnerIds",arrayData)
				}else{

				}
			}else{
				var sD = this
				if(sD && sD.no){
					var arrayData = Session.get("arrayOfWinnerIds")
					var searched = _.findWhere(arrayData, {no:  sD.no});
					if(searched){
						arrayData = _.without(arrayData, searched);
						data = searched
						data["playerB1Id"] = false
						data["playerB1Name"] = false
					}
					arrayData.push(data)
					Session.set("arrayOfWinnerIds",arrayData)
				}								
			}
		}catch(e){
			alert(e)
		}
	},
	"change [id^=playerOfTeamA2Doub]":function(e){
		try{
			$("#errorMsgTeamDet").html("")
			if(e.target.value!="1"){
				var sD = this
				if(sD && sD.no){
					var idVal = $("#"+e.target.id+" option:selected").text()
					var arrayData = Session.get("arrayOfWinnerIds")
					var data = {
						no:sD.no,
						playerA2Id:e.target.value,
						playerA2Name:idVal
					}

					var searched = _.findWhere(arrayData, {no:  sD.no});
					if(searched){
						arrayData = _.without(arrayData, searched);
						data = searched
						data["playerA2Id"] = e.target.value
						data["playerA2Name"] = idVal
					}

					arrayData.push(data)

					Session.set("arrayOfWinnerIds",arrayData)
				}else{

				}
			}else{
				var sD = this
				if(sD && sD.no){
					var arrayData = Session.get("arrayOfWinnerIds")
					var searched = _.findWhere(arrayData, {no:  sD.no});
					if(searched){
						arrayData = _.without(arrayData, searched);
						data = searched
						data["playerA2Id"] = false
						data["playerA2Name"] = false
					}
					arrayData.push(data)
					Session.set("arrayOfWinnerIds",arrayData)
				}				
			}
		}catch(e){
			alert(e)
		}
	},
	"change [id^=playerOfTeamB2Doub]":function(e){
		try{
			$("#errorMsgTeamDet").html("")
			if(e.target.value!="1"){
				var sD = this
				if(sD && sD.no){
					var idVal = $("#"+e.target.id+" option:selected").text()
					var arrayData = Session.get("arrayOfWinnerIds")
					var data = {
						no:sD.no,
						playerB2Id:e.target.value,
						playerB2Name:idVal
					}

					var searched = _.findWhere(arrayData, {no:  sD.no});
					if(searched){
						arrayData = _.without(arrayData, searched);
						data = searched
						data["playerB2Id"] = e.target.value
						data["playerB2Name"] = idVal
					}

					arrayData.push(data)

					Session.set("arrayOfWinnerIds",arrayData)
				}else{

				}
			}else{
				var sD = this
				if(sD && sD.no){
					var arrayData = Session.get("arrayOfWinnerIds")
					var searched = _.findWhere(arrayData, {no:  sD.no});
					if(searched){
						arrayData = _.without(arrayData, searched);
						data = searched
						data["playerB2Id"] = false
						data["playerB2Name"] = false
					}
					arrayData.push(data)
					Session.set("arrayOfWinnerIds",arrayData)
				}
			}
		}catch(e){
			alert(e)
		}
	},
	"change [id^=selectedTeamUltimate]":function(e){
		$("#errorMsgTeamDet").html("")
	},
	"change [id^=selectedMatchTypeUltimate]":function(e){
		$("#errorMsgTeamDet").html("")
	},
	"change [id^=selectMatchType_]":function(e){
		$("#errorMsgTeamDet").html("")
	},
	"change [id^=selectWinnerSing_]":function(e){
		$("#errorMsgTeamDet").html("")
	},
	"change [id^=selectWinnerDoub_]":function(e){
		$("#errorMsgTeamDet").html("")
	},

	"click #saveTeamDETailsForm":async function(e){
		try{
			$("#errorMsgTeamDet").html("")
			if(Session.get("teamDrawsDetTeamFormatId")){
				var data1 = {
					tournamentId:Session.get("tournamentId"),
					eventName:Session.get("eventName"),
					orgTeamFormatId:Session.get("teamDrawsDetTeamFormatId"),
					teamsDetScoreOth:{}
				}
				var data2 = {}


				if(Session.get("teamDetailedDraws")){
					var s = Session.get("teamDetailedDraws")
					if(s.roundBM == false){
						data2["thirdFourthRound"] = false
					}
					else if(s.roundBM == true){
						data2["thirdFourthRound"] = true
					}

					if(s && s.matchNumber){
						data2["matchNumber"] = s.matchNumber
						
					}
					if(s && s.roundNumber){
						data2["roundNumber"] = s.roundNumber
					}

					if(s && s.teamsID.teamBId){
						data2["teamBID"] = s.teamsID.teamBId
					}
					else{
						data2["teamBID"] = "1"
					}

					if(s && s.teamsID.teamAId){
						data2["teamAID"] = s.teamsID.teamAId
					}
					else{
						data2["teamAID"] = "1"
					}

					data2["finalTeamWinner"] = $("#selectedTeamUltimate").val()
					data2["teamMatchType"] = $("#selectedMatchTypeUltimate").val()
					data2["matchTeamOth"] = []

					var lData = {
						teamsFormatId:Session.get("teamDrawsDetTeamFormatId")
					}



					var getTeamDet = await Meteor.callPromise("selectedTeamFormatIdDetails",lData)
					if(getTeamDet && getTeamDet.status==SUCCESS_STATUS && getTeamDet.data &&
						getTeamDet.data.specifications){

						var sPecData = getTeamDet.data.specifications
					
						for(var i=0;i<sPecData.length;i++){
							var mData = {
								"no":parseInt(i+1),
								"matchProjectType":sPecData[i].type,
								"label":sPecData[i].label,
								"displayLabel":sPecData[i].displayLabel,
								"order":sPecData[i].order
							}
							var no = mData.no
							mData["matchType"] = $("#selectMatchType_"+no).val()

							if(sPecData[i].type && parseInt(sPecData[i].type)==1){
								mData["playerAId"] = $("#playerOfTeamASingle_"+no).val()
								mData["playerBId"] = $("#playerOfTeamBSingle_"+no).val()

								mData["winnerIdPlayer"] = $("#selectWinnerSing_"+no).val()
								mData["winnerIdTeam"] = $("#selectWinnerSing_"+no+" option:selected").attr("id")

								mData["playerA1Id"] = "1"
								mData["playerA2Id"] = "1"
								mData["playerB1Id"] = "1"
								mData["playerB2Id"] = "1"
								mData["winnerD1PlayerId"] = "1"
								mData["winnerD2PlayerId"] = "1"
								mData["setScoresA"] = []
								mData["setScoresB"] = []

								var setA = []
								setA[0] = $("#setScoresTeamA0_"+no).val()
								setA[1] = $("#setScoresTeamA1_"+no).val()
								setA[2] = $("#setScoresTeamA2_"+no).val()
								setA[3] = $("#setScoresTeamA3_"+no).val()
								setA[4] = $("#setScoresTeamA4_"+no).val()
								setA[5] = $("#setScoresTeamA5_"+no).val()
								setA[6] = $("#setScoresTeamA6_"+no).val()

								var setB = []
								setB[0] = $("#setScoresTeamB0_"+no).val()
								setB[1] = $("#setScoresTeamB1_"+no).val()
								setB[2] = $("#setScoresTeamB2_"+no).val()
								setB[3] = $("#setScoresTeamB3_"+no).val()
								setB[4] = $("#setScoresTeamB4_"+no).val()
								setB[5] = $("#setScoresTeamB5_"+no).val()
								setB[6] = $("#setScoresTeamB6_"+no).val()

								mData["setScoresA"] = setA
								mData["setScoresB"] = setB
							}
							else if(sPecData[i].type && parseInt(sPecData[i].type)==2){
								mData["playerAId"] = "1"
								mData["playerBId"] = "1"

								mData["winnerIdPlayer"] = "1"
								mData["winnerIdTeam"] = $("#selectWinnerDoub_"+no+" option:selected").attr("team")

								mData["playerA1Id"] = $("#playerOfTeamA1Doub_"+no).val()
								mData["playerA2Id"] = $("#playerOfTeamA2Doub_"+no).val()
								mData["playerB1Id"] = $("#playerOfTeamB1Doub_"+no).val()
								mData["playerB2Id"] = $("#playerOfTeamB2Doub_"+no).val()
								mData["winnerD1PlayerId"] = $("#selectWinnerDoub_"+no+" option:selected").attr("value")
								mData["winnerD2PlayerId"] = $("#selectWinnerDoub_"+no+" option:selected").attr("id")
								
								var setA = []
								setA[0] = $("#setScoresTeamA0_"+no).val()
								setA[1] = $("#setScoresTeamA1_"+no).val()
								setA[2] = $("#setScoresTeamA2_"+no).val()
								setA[3] = $("#setScoresTeamA3_"+no).val()
								setA[4] = $("#setScoresTeamA4_"+no).val()
								setA[5] = $("#setScoresTeamA5_"+no).val()
								setA[6] = $("#setScoresTeamA6_"+no).val()

								var setB = []
								setB[0] = $("#setScoresTeamB0_"+no).val()
								setB[1] = $("#setScoresTeamB1_"+no).val()
								setB[2] = $("#setScoresTeamB2_"+no).val()
								setB[3] = $("#setScoresTeamB3_"+no).val()
								setB[4] = $("#setScoresTeamB4_"+no).val()
								setB[5] = $("#setScoresTeamB5_"+no).val()
								setB[6] = $("#setScoresTeamB6_"+no).val()

								mData["setScoresA"] = setA
								mData["setScoresB"] = setB
							}

							data2["matchTeamOth"].push(mData)
							/*var mData = {
								no
								playerAID
								playerBID
								setScoresA
								setScoresB
								winnerIdPlayer
								matchType
								winnerIdTeam
								teamAD1PlayerId
								teamAD2PlayerId
								teamBD1PlayerId
								teamBD2PlayerId
								winnerD1PlayerId
								winnerD2PlayerId
								matchProjectType
							}*/
						}
					}


					data1["teamsDetScoreOth"] = data2

				}
				var res = await Meteor.callPromise("saveTeamDetailedDrawsForTossCalls",data1)
					try{
						if(res && res.status==SUCCESS_STATUS){
							var ccData = {
								specifications:data1.teamsDetScoreOth.matchTeamOth
							}
							var resFind = await Meteor.callPromise("FindScoresFromLengthOfMatch",ccData)
								if(resFind && resFind.status == SUCCESS_STATUS && resFind.data){
									var curMatchRec = Session.get("teamDetailedDraws");
									var setType = $("#selectedMatchTypeUltimate").val().trim().toLowerCase()
									var teamWinnerId = $("#selectedTeamUltimate").val().trim()
									var teamName = $("#selectedTeamUltimate option:selected").html().trim()
									var teamType = $("#selectedTeamUltimate option:selected").attr("teamType").trim()
									if(teamType!="1"){
										var autoTweet = $("#checkAcceptboxTweett").prop("checked");
										updateTeamDetailedScoresToMatchCollec(resFind.data, curMatchRec, setType, teamWinnerId, teamName, teamType,autoTweet,function(updateDraws){
											if(updateDraws && teamType!="1"){
												alert("Data saved")
												//$("#tossDetailedDraws").modal('hide')
												//$( '.modal-backdrop' ).remove();
											}else{
												alert("Cannot save, try again")
												$("#tossDetailedDraws").modal('hide')
												$( '.modal-backdrop' ).remove();
											}
										})
										
									}else{
										alert("Only team detailed draws saved")
									}
									
								}
								else if(resFind && resFind.status==FAIL_STATUS && resFind.message){
									$("#errorMsgTeamDet").html(resFind.message + " Please try again!!")
								}
							
						}
						else if(res && res.status==FAIL_STATUS && res.message){
							$("#errorMsgTeamDet").html(res.message)
						}
					}catch(e){
						alert(e)
					}
			}
		}catch(e){
			alert(e)
		}
	},

	"click #closePopupToss":function(){
		$("#tossDetailedDraws").modal('hide')
		$( '.modal-backdrop' ).remove();
	},

	"click #printDrawsOtherFormats":async function(){
		try{
				var data1 = {
					tournamentId:Session.get("tournamentId"),
					eventName:Session.get("eventName"),
					blank:true
				}
				if(Session.get("teamDetailedDraws")){
					var s = Session.get("teamDetailedDraws")

					if(s && s.matchNumber){
						data1["matchNumber"] = s.matchNumber
					}
					if(s && s.roundNumber){
						data1["roundNumber"] = s.roundNumber
					}
				}
				Meteor.call("callTeamDetailedDrawsPrint",data1,function(e,res){
                    if(res && res.status==SUCCESS_STATUS){
                        window.open("data:application/pdf;base64, " + res.data);
                    }else if(res && res.status==FAIL_STATUS){
                    	alert(res.message)
                    }
                })

				/*var resCheck = await Meteor.call("getTeamDetailedDrawsForOtherFormats",data1)
				if(resCheck){
					alert(JSON.stringify(resCheck))
				}*/
		}catch(e){
			alert(e)
		}
	},
	"click #printDrawsOtherFormatsBlank":async function(){
		try{
				var data1 = {
					tournamentId:Session.get("tournamentId"),
					eventName:Session.get("eventName"),
					blank:false
				}
				if(Session.get("teamDetailedDraws")){
					var s = Session.get("teamDetailedDraws")

					if(s && s.matchNumber){
						data1["matchNumber"] = s.matchNumber
					}
					if(s && s.roundNumber){
						data1["roundNumber"] = s.roundNumber
					}
				}
				Meteor.call("callTeamDetailedDrawsPrint",data1,function(e,res){
                    if(res && res.status==SUCCESS_STATUS){
                        window.open("data:application/pdf;base64, " + res.data);
                    }else if(res && res.status==FAIL_STATUS){
                    	alert(res.message)
                    }
                })

				/*var resCheck = await Meteor.call("getTeamDetailedDrawsForOtherFormats",data1)
				if(resCheck){
					alert(JSON.stringify(resCheck))
				}*/
		}catch(e){
			alert(e)
		}
	},
	"click #notifyApp":function(){
		try{
			var data1 = {
				tournamentId:Session.get("tournamentId"),
				eventName:Session.get("eventName"),
				blank:false,
				eventOrganizer:Meteor.userId()
			}

			if(Session.get("teamDetailedDraws")){
				var s = Session.get("teamDetailedDraws")

				if(s && s.matchNumber){
					data1["matchNumber"] = s.matchNumber
				}
				if(s && s.roundNumber){
					data1["roundNumber"] = s.roundNumber
				}
			}
			alert("notified")
			Meteor.call("notifyAppMatchRecord",data1,function(e,res){

			})

		}catch(e){
			alert(e)
		}
	},
	"click #notifyAppRound":function(){
		try{
			var data1 = {
				tournamentId:Session.get("tournamentId"),
				eventName:Session.get("eventName"),
				blank:false,
				eventOrganizer:Meteor.userId(),
				roundNot:true
			}

			try{
				if(Session.get("teamDetailedDraws") && 
					Session.get("teamDetailedDraws").roundNumber){

	    			var data = {
	    				tournamentId:Session.get("tournamentId"),
	    				eventName:Session.get("eventName"),
	    				db:"teamMatchCollectionDB",
	    				roundNumber:Session.get("teamDetailedDraws").roundNumber
	    			}

		    		Meteor.call("getFirstMatchNumberMatchCol",data,function(e,res){
		    			if(res){
							var s = Session.get("teamDetailedDraws")

							if(s && s.matchNumber){
								data1["matchNumber"] = res
							}
							if(s && s.roundNumber){
								data1["roundNumber"] = s.roundNumber
							}

							Meteor.call("notifyAppMatchRecord",data1,function(e,res){
								alert("notified")
							})

						}
		    		})
	    		}
	    	}catch(e){

	    	}
		}catch(e){
			alert(e)
		}
	}

})

callWithPromise = (method,params) => {

  return new Promise((resolve, reject) => {
    Meteor.call(method, params,(error, result) => {
      if (error) {reject(error)}
      else if(result){
      	resolve(result)
      };
    });
  });
}

Template.registerHelper("getTeamPlayersListTeamBOth",function(teamIDB){
	try{
		if(Session.get("teamDetailedDraws")){
			var det = Session.get("teamDetailedDraws")
			if(det&&det.teams&&det.teamsID.teamBId){
				var s = ReactiveMethod.call("teamPlayersFetch",teamIDB,Session.get("tournamentId"));
				if(s){
					return searched
				}
			}
		}
	}catch(e){

	}
});

Template.registerHelper("getTeamPlayersListTeamAOth",function(teamIDA){
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

Template.registerHelper("getUserNameForId",function(userId){
	try{
    	var data = {
    		playerId:userId
    	}
    	var getUserDet = ReactiveMethod.call("getPlayerDetailsForGivenPlayerId",data)
    	if(getUserDet && getUserDet.status==SUCCESS_STATUS && getUserDet.data
    			&& getUserDet.data.userName){
    		return getUserDet.data.userName
    	}
    	else{
    		return ""
    	}
    }catch(e){

    }
})

Template.registerHelper("readonlyForNonOrganizers",function(){
	try{
		if(Meteor.userId() && Session.get("tournamentId")){
	    	var data = {
	    		tournamentId:Session.get("tournamentId"),
	    		userId:Meteor.userId()
	    	}
	    	var getUserDet = ReactiveMethod.call("getDetailsOfEventOrganizer",data)
	    	if(getUserDet && getUserDet.status==SUCCESS_STATUS && getUserDet.data){
	    		return false
	    	}
	    	else{
	    		return true
	    	}
    	}
    }catch(e){

    }
})