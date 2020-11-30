import { MatchCollectionDB} from '../../publications/MatchCollectionDb.js';
import { teamMatchCollectionDB} from '../../publications/MatchCollectionDbTeam.js';

MatchCollectionDB.after.insert(function (userId, doc) {
	try{
	}catch(e){
	}
});

MatchCollectionDB.after.update(function (userId, doc, fieldNames, modifier) {
    /*try{
        if(doc){
			//sendNotificationsMatchColl(doc.eventName,doc.tournamentId,31,5)
        }
    }catch(e){
    }*/
});

teamMatchCollectionDB.after.update(function (userId, doc, fieldNames, modifier) {
    /*try{
        if(doc){
			sendNotificationsMatchColl(doc.eventName,doc.tournamentId,9,2)
        }
    }catch(e){
    }*/
});

Meteor.methods({
	"getFirstMatchNumberMatchCol":function(xData){
		try{
			if(xData && xData.tournamentId && xData.eventName && 
				xData.roundNumber && xData.db){

				if(xData.db == "teamMatchCollectionDB"){
					var que = teamMatchCollectionDB.aggregate([
							{
								$match:{
									"tournamentId": xData.tournamentId,
	        						"eventName": xData.eventName
								}
							},{
							 	$unwind: {
							        "path": "$matchRecords"
							    }
							},{
							    $match: {
							        "matchRecords.roundNumber": parseInt(xData.roundNumber)
							    }
							}, {
							    $project: {
							      "matcNum":"$matchRecords.matchNumber"
							    }
							}
						])
					if(que && que.length && que[0] && que[0].matcNum){
						return que[0].matcNum
					}else{
						return false
					}
				}else if(xData.db=="MatchCollectionDB"){
					var que = MatchCollectionDB.aggregate([
							{
								$match:{
									"tournamentId": xData.tournamentId,
	        						"eventName": xData.eventName
								}
							},{
							 	$unwind: {
							        "path": "$matchRecords"
							    }
							},{
							    $match: {
							        "matchRecords.roundNumber": parseInt(xData.roundNumber)
							    }
							}, {
							    $project: {
							      "matcNum":"$matchRecords.matchNumber"
							    }
							}
						])
					if(que && que.length && que[0] && que[0].matcNum){
						return que[0].matcNum
					}else{
						return false
					}
				}
			}else{
				return false
			}
		}catch(e){
			return false
		}
	}
})

function instanceForTopicss(){
	if(Meteor.absoluteUrl()=="http://192.168.0.99:9090/"){
		return "1"
	}else if(Meteor.absoluteUrl()=="http://192.168.0.50:9080/"){
		return "2"
	}else if(Meteor.absoluteUrl()=="http://192.168.0.73:3000/"){
		return "3"
	}else if(Meteor.absoluteUrl()=="http://wwww.iplayon.in/"){
		return "4"
	}else{
		return "4"
	}
}

Meteor.methods({
	"notifyAppMatchRecord":async function(xData){
		var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": FAIL_NOTIFICATION
        }
		try{
			if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }
            if (xData) {
                var sDraws = new DrawsResults(xData)
                //validations
                var nullTournamentId = sDraws.nullUndefinedEmpty("tournamentId")
                var nullRoundNumber = sDraws.nullUndefinedEmpty("roundNumber")
                var nullMatchNumber = sDraws.nullUndefinedEmpty("matchNumber")
                var nulleventOrg = sDraws.nullUndefinedEmpty("eventOrganizer")

                if(nulleventOrg=="1"){
	                if(nullMatchNumber=="1"){
	                	if(nullRoundNumber=="1"){
			                if(nullTournamentId=="1"){
					            var nullEventName = sDraws.nullUndefinedEmpty("eventName")
					            if(nullEventName =="1"){
					            	var checkTournamentEventDet = sDraws.checkTournamentEvent("events")

					              	var db;
					              	var getTopics = ""
					              	if(checkTournamentEventDet == "1"){
					              	  	//get draws with rounds for that tournament
					              	  	//check other event names are required
					              	 	db = "events"
					              	}
					              	else{
					              	  	var checkTournamentEventDetPast = sDraws.checkTournamentEvent("pastEvents")
					              	  	if(checkTournamentEventDetPast=="1"){
					              	  		//get draws with rounds for that tournament
					              	  		//check other event names are required
					              	  		db = "pastEvents"

					              	  	}else{
					              	  		res.message = checkTournamentEventDetPast
					              	  	}
					              	}
					              	if(db){
					              		getTopics = stateAssociationsForState.findOne({
					              			"stateAssocIds":xData.eventOrganizer
					              		})

					              		if(getTopics && getTopics.stateId && getTopics.stateId == "11sports"){
					              			var topic = instanceForTopicss()+"MatchCollection"+getTopics.stateId
					              			var roundNot = false
					              			if(xData.roundNot==true){
					              				roundNot = true
					              			}
					              			sendNotificationsMatchColl(xData.eventName,xData.tournamentId,xData.matchNumber,xData.roundNumber,topic,roundNot)
					              			res.status = SUCCESS_STATUS
					              			res.message = SUCCESS_NOTIFICATION
					              		}else if(getTopics && getTopics.stateAssocIds){

					              			var topic = instanceForTopicss()+"MatchCollection"+getTopics.stateAssocIds
					              			var roundNot = false
					              			if(xData.roundNot==true){
					              				roundNot = true
					              			}
					              			sendNotificationsMatchColl(xData.eventName,xData.tournamentId,xData.matchNumber,xData.roundNumber,topic,roundNot)
					              			res.status = SUCCESS_STATUS
					              			res.message = SUCCESS_NOTIFICATION
					              		}
					              	}
					            }else{
					            	res.message = nullEventName
					            }
					        }else{
					        	res.message = nullTournamentId
					        }
				    	}else{
				    		res.message = nullRoundNumber
				    	}
			    	}else{
			    		res.message = nullMatchNumber
			    	}
		    	}else{
		    		res.message = nulleventOrg
		    	}
            }else {
                res.message = "parameters  " + ARE_NULL_MSG
            }
            return res
		}catch(e){
			res.message = e
            if (e && e.toString()) {
                res.error = e.toString()
            }
            return res
		}
	}
})

var sendNotificationsMatchColl = async function(eventName,tournamentId,matchNum,roundNum,topic,roundNot){
	try{
		
		var xData = {
			resultsFor:"all",
			roundNumber:roundNum,
			tournamentId:tournamentId,
			eventName:eventName
		}

		var getRecordData = Meteor.call("getMatchRecordsforEventAndRound",xData)

		if(getRecordData && getRecordData.status == SUCCESS_STATUS){
			var findEveName = events.findOne({
				"_id":getRecordData.data.tournamentId
			})

			var tournName = ""
			var roundNamet = ""

			if(findEveName==undefined){
				findEveName = pastEvents.findOne({
					"_id":getRecordData.data.tournamentId
				})
			}

			if(findEveName && findEveName.eventName){
				tournName = findEveName.eventName
			}
		
			if(getRecordData.data && getRecordData.data.roundValues && getRecordData.data.roundValues.length){

				var getrou = _.findWhere(getRecordData.data.roundValues, {roundNumber: roundNum.toString()});
				if(getrou && getrou.roundHeader){
					roundNamet = getrou.roundHeader
				}
			}

			var diseve = eventName

			var schoolChangeAbbName = schoolEventsToFind.findOne({})
            if(schoolChangeAbbName && schoolChangeAbbName.teamEventNAME 
                && schoolChangeAbbName.dispNamesTeam){
                var namesInd = _.indexOf(
                    schoolChangeAbbName.teamEventNAME,diseve
                    )
                if(namesInd>=0){
                    diseve = schoolChangeAbbName.dispNamesTeam[namesInd]
                }
            }


			var data = {
				"title":"Scores Updated For " + tournName, 
			    "body": diseve + ", Match No - " + matchNum + ", Round - " + roundNamet, 
			    "sound":"default", 
			    "badge": "0",
			    "topic":topic,
			    "categoryIdentifier":"MatchCollection"
			}

			if(roundNot){
				data.body = diseve + ", Round - " + roundNamet
			}
			var types = ""
			var year = ""
			var co = ""
			if(findEveName && findEveName.tournamentType){
				var tt = schoolEventsToFind.aggregate([{
				    $match: {
				        "key": "School"
				    }
				}, {
				    $unwind: {
				        "path": "$tournamentTypes"
				    }
				}, {
				    $match: {
				        "tournamentTypes.name": findEveName.tournamentType
				    }
				}, {
				    $project: {
				        "types": "$tournamentTypes.type",
				        "year":"$tournamentTypes.year",
				        "co":"$tournamentTypes.co"
				    }
				}])
				if(tt && tt.length && tt[0] && tt[0].types){
					types = tt[0].types
					year = tt[0].year
					co = tt[0].co
				}
			}
			var data2 = {
				"tournamentId":tournamentId,
				"eventName":eventName,
				"roundValues":getRecordData.data.roundValues,
				"matchNumber":matchNum,
				"roundNumber":roundNum.toString(),
				"indexPath":parseInt(roundNum-1),
				"types":types,
				"co":co,
				"year":year

			}
			var topictype = 1
			Meteor.call("sendNotification",data,data2,topictype,function(e,res){})
		}
	}catch(e){
		console.log(e)
	}
}