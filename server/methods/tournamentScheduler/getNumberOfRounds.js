import {
    MatchCollectionDB
}
from '../../publications/MatchCollectionDb.js';
import {
    teamMatchCollectionDB
}
from '../../publications/MatchCollectionDbTeam.js';

Meteor.methods({
    'getDatesStartEnd': function(startDate, stopDate) {
	    try{
		   	var dateArray = [];
		  	var currentDate = moment(new Date(startDate));
		    var stopDate = moment(new Date(stopDate));
		    while (currentDate <= stopDate) {
		        dateArray.push( moment(new Date(currentDate)).format('DD MMM YYYY') )
		        currentDate = moment(new Date(currentDate)).add(1, 'days');
		    }
	    	return dateArray;
	    }catch(e){
	    }
	}
});

Meteor.methods({
    'getMaxEventPartsCount': function(tournId) {
        try {
            if (tournId) {
            	if(events.findOne({"tournamentId":tournId})){
                	var eveParts = events.aggregate([{
                        $match: {
                            tournamentId: tournId,
                            tournamentEvent: false
                        }
                    }, {
                        $project: {
                            "num": {
                                "$cond": [{
                                    $or: [{
                                        "$eq": ["$eventParticipants", undefined]
                                    }, {
                                        "$eq": ["$eventParticipants", null]
                                    }]
                                }, 0, {
                                    $size: {
                                        "$ifNull": ["$eventParticipants", []]
                                    }
                                }]
                            },
                            "abbName": "$abbName",
                            "eventName": "$eventName",
                            "_id":"$_id"

                        }
                    }, {
                        $sort: {
                            num: -1
                        }
                    }])
                	return eveParts    
                } 
                else if(pastEvents.findOne({"tournamentId":tournId})){
                	var eveParts = pastEvents.aggregate([{
                        $match: {
                            tournamentId: tournId,
                            tournamentEvent: false
                        }
                    }, {
                        $project: {
                            "num": {
                                "$cond": [{
                                    $or: [{
                                        "$eq": ["$eventParticipants", undefined]
                                    }, {
                                        "$eq": ["$eventParticipants", null]
                                    }]
                                }, 0, {
                                    $size: {
                                        "$ifNull": ["$eventParticipants", []]
                                    }
                                }]
                            },
                            "abbName": "$abbName",
                            "eventName": "$eventName",
                            "_id":"$_id"

                        }
                    }, {
                        $sort: {
                            num: -1
                        }
                    }])
                	return eveParts    
                }           
            }
        } catch (e) {
        }
    }
});

Meteor.methods({
    'getTournsPartsCount':function(type) {
		try {
			if(type=="new"){
				var lData = events.find({tournamentEvent:true},{fields:{
			    	eventName : 1,
					projectId : 1,
					eventStartDate : 1,
					eventEndDate : 1,
					eventSubscriptionLastDate : 1,
					domainId : 1,
					abbName : 1,
					prize : 1,
					projectType : 1,
					eventOrganizer : 1,
					domainName : 1,
					projectName : 1,
					eventStartDate1 : 1,
					eventEndDate1 : 1,
					eventSubscriptionLastDate1 : 1,
					tournamentId : 1
			    }});
			    if(lData){
			        return lData.fetch()
			    }
			}
			else if(type == "past"){
				var lData = pastEvents.find({tournamentEvent:true},{fields:{
			    	eventName : 1,
					projectId : 1,
					eventStartDate : 1,
					eventEndDate : 1,
					eventSubscriptionLastDate : 1,
					domainId : 1,
					abbName : 1,
					prize : 1,
					projectType : 1,
					eventOrganizer : 1,
					domainName : 1,
					projectName : 1,
					eventStartDate1 : 1,
					eventEndDate1 : 1,
					eventSubscriptionLastDate1 : 1,
					tournamentId : 1
			    }});
			    if(lData){
			        return lData.fetch()
			    }
			}
		} catch (e) {

	    }   
    } 	
})

Meteor.methods({
	"getRoundNumbersTournScheduler":function(numberOfSubscribers,eventName){
		try{
			var rounds = []
			
			if(numberOfSubscribers > 1){
				let s = getNumMatchesByEvent(numberOfSubscribers,eventName)
				var key = ["Finals", "SF", "QF", "PQF", "R32", "R64", "R128", "R256",
				"R512"]
				//var k = JSON.parse(JSON.stringify(s, key, 18));
				//rounds = _.keys(k);
				return s
			}	
		}catch(e){
		}
	}
})

function getNext2PowN (e) {
  var x = 0;
  var v = 1;
  while (e > v) {
    v = v * 2;
    if (e == v) {
      return e;
    }
  }
  return v;
}

function getNumMatches (e,eventName) {
  var rname = ["Finals", "SF", "QF", "PQF", "R32", "R64", "R128", "R256",
	"R512"];
  var matches = {"R512":0, "R256":0, "R128":0, "R64":0, "R32":0, "PQF":0, "QF":0, "SF":0,
	"Finals":0, "eventName":eventName, "R512a":[], "R256a":[], "R128a":[], "R64a":[], "R32a":[], "PQFa":[], "QFa":[], "SFa":[],
	"Finalsa":[],"startRound":""}
  var n = getNext2PowN (e);
  var diff = n - e;
  var tmp = (n/2) - diff;
  var p = 1;
  var i = 0;
  while (p*2 < (e-1)) {
    matches[rname[i]] = p;
    p = p*2;
    i ++;
  }
  matches[rname[i]] = tmp;
  return matches;
}

function getNumMatchesByEvent (t,eventName) {

  var entries = /*schedulerInput[t]; eg. "U14Boys"; */ t;
  if((Math.log(entries)/Math.log(entries)) % 2){
  	entries = Math.pow(2, Math.ceil(Math.log(entries)/Math.log(2)));
  }
  var numMatchesPerRound = getNumMatches (entries,eventName);
  var i = 0
  var j = 0
  for (var rounds in numMatchesPerRound) {
     
      if( numMatchesPerRound[rounds] != 0){
        if(i==0){
          if(numMatchesPerRound[rounds+"a"]){
          	numMatchesPerRound[rounds+"a"] = [parseInt(1)+"-"+parseInt(numMatchesPerRound[rounds])]
          	i = numMatchesPerRound[rounds] 
          	numMatchesPerRound["startRound"] = rounds
          }
        }
        else{
          if(numMatchesPerRound[rounds+"a"]){
          	numMatchesPerRound[rounds+"a"] =  [parseInt(1 + parseInt(i))+"-"+parseInt(numMatchesPerRound[rounds]+i)]
          	i = numMatchesPerRound[rounds] + i
          }
        }
        
        j = j + 1
                 
      }
  }

  return numMatchesPerRound;
}


Meteor.methods({
	"scheduleTimer": function(xDAta){
	try{

	var eventsSelectedInOrderWithRounds = xDAta.eventsSelectedInOrderWithRounds
	
	
	var data = xDAta.datas

	var data2 = []
	

	//split into match ids
	for(var i=0; i<eventsSelectedInOrderWithRounds.length; i++){
		if(eventsSelectedInOrderWithRounds[i]&&eventsSelectedInOrderWithRounds[i]["eventName"]){
			//split selected events on "-"
			var selectedName = eventsSelectedInOrderWithRounds[i]["eventName"].split("||")
			//check for proper split

			if(selectedName && selectedName.length == 2 && selectedName[0] && selectedName[1]){
				//get evename and rou name
				var seleventName = selectedName[0]
				var selroundName = selectedName[1]


				//search for selected eve name and matches count in that round
				var findInd = _.findWhere(data, {eventName: seleventName});

				if (findInd != null) {


                    if(findInd[selroundName] != null){
                    	let selectedRowOfData = findInd
                    	var checkkey = _.keys(selectedRowOfData);
                    	var nextInd = checkkey.indexOf(selroundName) + 1
                    	var nextItem = checkkey[nextInd]

                    	var arrayStartVal = 0
                    	for(var j=nextInd ; j<checkkey.length-1; j++){
                    		if(nextItem != undefined && nextItem != null){
                    			if(findInd[nextItem]  != undefined && findInd[nextItem] != null){
                    				arrayStartVal = parseInt(arrayStartVal + parseInt(findInd[nextItem]))
                    			}
                    			else{
                    			}
                    		}
                    		else{
                    		}
                    		nextInd = j+1
                    		nextItem = checkkey[nextInd]
                    		
                    	}

                    	var createMatchIds = _.range(parseInt(arrayStartVal + 1) , parseInt(findInd[selroundName]+arrayStartVal+1))

                    	var eveDet = events.findOne({"tournamentId":xDAta.tournamentId,eventName:seleventName})
                    	var projectType = 0
                    	var eventId = ""
                    	if(eveDet && eveDet._id && eveDet.projectType != undefined && eveDet.projectType != null){
                    		projectType = eveDet.projectType
                    		eventId = eveDet._id
                    	}else{
                    		eveDet = pastEvents.findOne({"tournamentId":xDAta.tournamentId,eventName:seleventName})
							if(eveDet && eveDet._id && eveDet.projectType != undefined && eveDet.projectType != null){
                    			projectType = eveDet.projectType
                    			eventId = eveDet._id
                    		}
                    	}

                    	if(projectType &&  parseInt(projectType)==2){
                    		var checkForBye = teamMatchCollectionDB.aggregate([{
							    $match: {
							        tournamentId: xDAta.tournamentId,
							        eventName: seleventName
							    }
							}, {
							    $unwind: "$matchRecords"
							}, {
							    $match: {
							        "matchRecords.matchNumber": {
							            $in: createMatchIds
							        }
							    }
							}, {
							    $project: {
							        m: {
							            "$cond": {
							                "if": {
							                    "$ne": ["$matchRecords.status", "bye"]
							                },
							                "then": "$matchRecords.matchNumber",
							                else: "$noval"
							            }
							        }
							    }
							},{
							    '$sort':{
							        m:1
							    }
							}, 
							{
							    $group: {
							        "_id": null,
							        e: {
							            $addToSet: "$m",
							        }
							    }
							}])
							if(checkForBye && checkForBye[0] && checkForBye[0].e){
								createMatchIds = checkForBye[0].e
							}
                    	}
                    	else if(projectType &&  parseInt(projectType)==1){
                    		var checkForBye = MatchCollectionDB.aggregate([{
							    $match: {
							        tournamentId: xDAta.tournamentId,
							        eventName: seleventName
							    }
							}, {
							    $unwind: "$matchRecords"
							}, {
							    $match: {
							        "matchRecords.matchNumber": {
							            $in: createMatchIds
							        }
							    }
							}, {
							    $project: {
							        m: {
							            "$cond": {
							                "if": {
							                    "$ne": ["$matchRecords.status", "bye"]
							                },
							                "then": "$matchRecords.matchNumber",
							                else: "$noval"
							            }
							        }
							    }
							},{
							    '$sort':{
							        m:1
							    }
							}, 
							{
							    $group: {
							        "_id": null,
							        e: {
							            $addToSet: "$m",
							        }
							    }
							}])
							if(checkForBye && checkForBye[0] && checkForBye[0].e){
								createMatchIds = checkForBye[0].e
							}
                    	}

                    	var splitMap = {
                    		eventName:seleventName,
                    		order:eventsSelectedInOrderWithRounds[i]["order"]
                    	}
                    	
                    	splitMap[selroundName] = _.sortBy(createMatchIds, function(num){ return parseInt(num); });
                    	
                    	splitMap["projectType"] = projectType
                    	splitMap["eventId"] = eventId
                    	data2.push(splitMap)
                    			
                    			

                    }else{
                    }

                }else{
                }

			}else{
				//cannot split
			}
		}
	}
	xDAta.datas = data2
	var retData = splitToTables(xDAta)
	return retData
	}catch(e){
	}
}
})

Meteor.methods({
	"scheduleTimerUpdateOLd": function(xDAta){
	try{

	//return true
	/*var eventsSelectedInOrderWithRounds = xDAta.eventsSelectedInOrderWithRounds
	
	
	var data = xDAta.datas

	var data2 = []
	var scheduledDataReturned = []

	var startTime = xDAta.startTime
	var endTime = xDAta.endTime

	var break1St = xDAta.break1St
	var break1End = xDAta.break1End
	var break2St = xDAta.break2St
	var break2End = xDAta.break2End

	var dt1 = moment(startTime, ["h:mm A"]).format("HH:mm:ss");
	var dt2 = moment(endTime, ["h:mm A"]).format("HH:mm:ss");

	var bdt3 = moment(break1St, ["h:mm A"]).format("HH:mm:ss");
	var bdt4 = moment(break1End, ["h:mm A"]).format("HH:mm:ss");

	if(break1St == 0){
		bdt3 = 0
	}
	if(break1End == 0){
		bdt4 = 0
	}

	var bdt5 = moment(break2St, ["h:mm A"]).format("HH:mm:ss");
	var bdt6 = moment(break2End, ["h:mm A"]).format("HH:mm:ss");

	if(break2St == 0){
		bdt5 = 0
	}
	if(break2End == 0){
		bdt6 = 0
	}

	var oldDt1 = dt1
	var noOfTablesPerDay = xDAta.noOfTablesPerDay

	var tableAssignedCount =  parseInt(noOfTablesPerDay)
	var timeCompleted = false
	var table = 0

	//split into match ids
	for(var i=0; i<eventsSelectedInOrderWithRounds.length; i++){
		if(eventsSelectedInOrderWithRounds[i]&&eventsSelectedInOrderWithRounds[i]["everound"]){
			
			//split selected events on "-"
			var selectedName = eventsSelectedInOrderWithRounds[i]["everound"].split("||")
			//check for proper split


			if(selectedName && selectedName.length == 2 && selectedName[0] && selectedName[1]){
				//get evename and rou name
				var seleventName = selectedName[0]
				var selroundName = selectedName[1]

				//search for selected eve name and matches count in that round
				var findInd = _.findWhere(data, {eventName: seleventName});

				if(findInd == undefined || findInd == null){
					Meteor.call("subcribersFromDraws",xDAta.tournamentId,seleventName,"no",function(e,respser){
			            if(respser){
			            Meteor.call("getRoundNumbersTournScheduler", respser, seleventName,function(e,resser){
			                if(resser){
			                    findInd = resser
			                }
			            })
			            }else if(e){
			            }
			        })
				}

				if (findInd != null && findInd != undefined) {

                    if(findInd[selroundName] != null){

                    	let selectedRowOfData = findInd
                    	
                    	
                    	var lUpto = findInd[selroundName + "a"].toString().split("-")
                    	var createMatchIds = _.range(parseInt(parseInt(lUpto[0])), parseInt(parseInt(lUpto[1])  + 1))

                    	var eveDet = events.findOne({"tournamentId":xDAta.tournamentId,eventName:seleventName})
                    	var projectType = 0
                    	var eventId = ""

						if(eveDet && eveDet._id && eveDet.projectType != undefined && eveDet.projectType != null){
                    		projectType = eveDet.projectType
                    		eventId = eveDet._id
                    	}
                    	else{
                    		eveDet = pastEvents.findOne({"tournamentId":xDAta.tournamentId,eventName:seleventName})
                    		if(eveDet && eveDet._id && eveDet.projectType != undefined && eveDet.projectType != null){
                    			projectType = eveDet.projectType
                    			eventId = eveDet._id
                    		}
                    	}


                    	if(projectType &&  parseInt(projectType)==2 && findInd["startRound"] == selroundName){
                    		var checkForBye = teamMatchCollectionDB.aggregate([{
							    $match: {
							        tournamentId: xDAta.tournamentId,
							        eventName: seleventName
							    }
							}, {
							    $unwind: "$matchRecords"
							}, {
							    $match: {
							        "matchRecords.matchNumber": {
							            $in: createMatchIds
							        }
							    }
							}, {
							    $project: {
							        m: {
							            "$cond": {
							                "if": {
							                    "$ne": ["$matchRecords.status", "bye"]
							                },
							                "then": "$matchRecords.matchNumber",
							                else: "$noval"
							            }
							        }
							    }
							},{
							    '$sort':{
							        m:1
							    }
							}, 
							{
							    $group: {
							        "_id": null,
							        e: {
							            $addToSet: "$m",
							        }
							    }
							}])
							if(checkForBye && checkForBye[0] && checkForBye[0].e){
								createMatchIds = checkForBye[0].e
							}
                    	}
                    	else if(projectType &&  parseInt(projectType)==1 && findInd["startRound"] == selroundName){
                    		var checkForBye = MatchCollectionDB.aggregate([{
							    $match: {
							        tournamentId: xDAta.tournamentId,
							        eventName: seleventName
							    }
							}, {
							    $unwind: "$matchRecords"
							}, {
							    $match: {
							        "matchRecords.matchNumber": {
							            $in: createMatchIds
							        }
							    }
							}, {
							    $project: {
							        m: {
							            "$cond": {
							                "if": {
							                    "$ne": ["$matchRecords.status", "bye"]
							                },
							                "then": "$matchRecords.matchNumber",
							                else: "$noval"
							            }
							        }
							    }
							},{
							    '$sort':{
							        m:1
							    }
							}, 
							{
							    $group: {
							        "_id": null,
							        e: {
							            $addToSet: "$m",
							        }
							    }
							}])
							if(checkForBye && checkForBye[0] && checkForBye[0].e){
								createMatchIds = checkForBye[0].e
							}
                    	}

                    	var splitMap = {
                    		eventName:seleventName,
                    		order:eventsSelectedInOrderWithRounds[i]["order"]
                    	}
                    	splitMap[selroundName] = _.sortBy(createMatchIds, function(num){ return parseInt(num); });
                    	splitMap["projectType"] = projectType
                    	splitMap["eventId"] = eventId
                    	data2 = []
                    	data2.push(splitMap)
                    	xDAta.datas = data2
                    	var retData = splitToTables(xDAta,dt1,dt2, bdt3, bdt4, bdt5, bdt6,oldDt1, tableAssignedCount, timeCompleted, table)

                    	if(retData && retData.dt1 != undefined && retData.dt1 != null){
                    		dt1  = retData.dt1
                    	}
                    	if(retData && retData.oldDt1 != undefined && retData.oldDt1 != null){
                    		oldDt1  = retData.oldDt1
                    	}
                    	if(retData && retData.tableAssignedCount != undefined && retData.tableAssignedCount != null){
                    		tableAssignedCount =retData.tableAssignedCount
                    	}
                    	if(retData && retData.timeCompleted != undefined && retData.timeCompleted != null){
                    		timeCompleted = retData.timeCompleted
                    	}
                    	if(retData && retData.table != undefined && retData.table != null){
                    		table = retData.table
                    	}
                    	if(retData && retData.data != undefined && retData.data != null){
                    		scheduledDataReturned = scheduledDataReturned.concat(retData.data)
                    	}
                    	if(timeCompleted == true){
                    		break
                    	}
                    }else{
                    }

                }else{
                }

			}else{
				//cannot split
			}
		}
	}

	var dataWithTourn = {
		"tournamentId":xDAta.tournamentId,
		"selectedDate":xDAta.selectedDate,
		"selectedDateMoment":moment(new Date(xDAta.selectedDate)).format("YYYY-MM-DD"),
		"startTime" : startTime,
		"endTime" : endTime,
		"break1St" :  break1St,
		"break1End":  break1End,
		"break2St":  break2St,
		"break2End":  break2End,
		"duration" :  xDAta.durationRound,
		"scheduledData":scheduledDataReturned,
		"noOfTables":noOfTablesPerDay
	}

	//xDAta.datas = data2	
	//var retData = splitToTables(xDAta)
	//return retData
	/*if(xDAta.type && xDAta.type == "create"){
		//call create schedule
		let createSchedule = createScheduleToDB(dataWithTourn)
		return createSchedule
	}
	else if(xDAta.type && xDAta.type == "update"){
		//call update schedule
		let updateSchedule = updateScheduleToDB(dataWithTourn)
		return updateSchedule
	}*/

	}catch(e){
	}
}
})

Meteor.methods({
    'validateDateTimeDuration': function(xDAta) {
		try{
			var dataToSend = {}
			var selectedDate = xDAta.selectedDate
		

			var startTime = xDAta.startTime
			var endTime = xDAta.endTime
			var break1St = xDAta.break1St
			var break1End = xDAta.break1End
			var break2St = xDAta.break2St
			var break2End = xDAta.break2End
			
			var noOfTablesPerDay = xDAta.noOfTablesPerDay

			var duration = xDAta.durationOfEachMatch
		

			//var duration = xDAta.durationRound

			var rname = ["Finals", "SF", "QF", "PQF", "R32", "R64", "R128", "R256",
			"R512"];
			var checkkey = _.keys(rname);

			var regExp = /(\d{1,2})\:(\d{1,2})\:(\d{1,2})/;
		
			var dt1 = moment(startTime, ["h:mm:ss A"]).format("HH:mm:ss");
			var dt2 = moment(endTime, ["h:mm:ss A"]).format("HH:mm:ss");



			var bdt3 = moment(break1St, ["h:mm:ss A"]).format("HH:mm:ss");
			var bdt4 = moment(break1End, ["h:mm:ss A"]).format("HH:mm:ss");

			var bdt5 = moment(break2St, ["h:mm:ss A"]).format("HH:mm:ss");
			var bdt6 = moment(break2End, ["h:mm:ss A"]).format("HH:mm:ss");


			var dif1 = moment(new Date( selectedDate +" "+ dt1))
			var dif2 = moment(new Date( selectedDate +" "+ dt2))

			var ms = dif2.diff(dif1);
			var d = moment.duration(ms);

			var minsGET = d.minutes()

			var minutesGET  = parseInt(d.hours())*60 + parseInt(minsGET) + parseInt(d.seconds()) * 0.0166667
			var r = d.hours()+":"+minsGET+":"+d.seconds()

			if(dt1 == "Invalid date"){
				dataToSend = {
					result:false,
					status:"failure",
					message:"startTime is not valid"
				}
				return dataToSend
			}else if(dt2 == "Invalid date"){
				dataToSend = {
					result:false,
					status:"failure",
					message:"endtime is not valid"
				}
				return dataToSend

			}/*else if(bdt3 == "Invalid date"){
				dataToSend = {
					result:false,
					status:"failure",
					message:"break1 start time is not valid"
				}
				return dataToSend

			}else if(bdt4 == "Invalid date"){
				dataToSend = {
					result:false,
					status:"failure",
					message:"break1 end time is not valid"
				}
				return dataToSend

			}else if(bdt5 == "Invalid date"){
				dataToSend = {
					result:false,
					status:"failure",
					message:"break2 start time is not valid"
				}
				return dataToSend

			}else if(bdt6 == "Invalid date"){
				dataToSend = {
					result:false,
					status:"failure",
					message:"break2 end time is not valid"
				}
				return dataToSend
			}*/
			if(!(parseInt(dt1.replace(regExp, "$1$2$3")) < parseInt(dt2.replace(regExp, "$1$2$3")))){
				dataToSend = {
					result:false,
					status:"failure",
					message:"startTime is not less than endTime valid"
				}
				return dataToSend
			}

			


			//valid selected date
			//valid startTime endTime  break1St break1End break2St break2End
			//start time < end time
			//break1St > start time, < end time, < break1End, < break2St, < break2End
			//break1End < end time, < break2St, < break2End
			//break2St < end time, < break2End
			//break2End < end time
			//duration should be in mins
			// all round duration sholud be within minutes of a day and not more than start time and end time

			/*if((break1St == 0 && break1End != 0) || (break1End == 0 && break1St != 0)){
				dataToSend = {
					result:false,
					status:"failure",
					message:"break1 start and break 1 end is not valid"
				}
				return dataToSend
			}
			if((break2St == 0 && break2End != 0) || (break2End == 0 && break2St != 0)){
				dataToSend = {
					result:false,
					status:"failure",
					message:"break2 start and break 2 end is not valid"
				}
				return dataToSend
			}
			if(moment(new Date(selectedDate)).isValid()==false){
				dataToSend = {
					result:false,
					status:"failure",
					message:"selected date is not valid"
				}
				return dataToSend
			}
			if(moment(new Date( selectedDate +" "+ startTime),"DD MMM YYYY HH:mm:ss", true).isValid()==false){
				dataToSend = {
					result:false,
					status:"failure",
					message:"startTime is not valid"
				}
				return dataToSend
			}
			if(moment(new Date( selectedDate +" "+ endTime),"DD MMM YYYY HH:mm:ss", true).isValid()==false){
				dataToSend = {
					result:false,
					status:"failure",
					message:"endTime is not valid"
				}
				return dataToSend
			}
			if(break1St != 0 && moment(new Date( selectedDate +" "+ break1St),"DD MMM YYYY HH:mm:ss", true).isValid()==false){
				dataToSend = {
					result:false,
					status:"failure",
					message:"break1St is not valid"
				}
				return dataToSend
			}
			if(break1End != 0 && moment(new Date( selectedDate +" "+ break1End),"DD MMM YYYY HH:mm:ss", true).isValid()==false){
				dataToSend = {
					result:false,
					status:"failure",
					message:"break1End is not valid"
				}
				return dataToSend
			}
			if(break2St != 0 && moment(new Date( selectedDate +" "+ break2St),"DD MMM YYYY HH:mm:ss", true).isValid()==false){
				dataToSend = {
					result:false,
					status:"failure",
					message:"break2St is not valid"
				}
				return dataToSend
			}
			if(break2End != 0 && moment(new Date( selectedDate +" "+ break2End),"DD MMM YYYY HH:mm:ss", true).isValid()==false){
				dataToSend = {
					result:false,
					status:"failure",
					message:"break2End is not valid"
				}
				return dataToSend
			}

			//break1St > start time, < end time, < break1End, < break2St, < break2End
			if(break1St != 0 && !(parseInt(dt1.replace(regExp, "$1$2$3")) < parseInt(bdt3.replace(regExp, "$1$2$3")))){
				dataToSend = {
					result:false,
					status:"failure",
					message:"break1 start is not greater than startTime"
				}
				return dataToSend
			}
			if(break1St != 0 && !(parseInt(bdt3.replace(regExp, "$1$2$3")) < parseInt(dt2.replace(regExp, "$1$2$3")))){
				dataToSend = {
					result:false,
					status:"failure",
					message:"break1 start is not less than endtime"
				}
				return dataToSend
			}
			if(break1St !=0 && break1End != 0 && !(parseInt(bdt3.replace(regExp, "$1$2$3")) < parseInt(bdt4.replace(regExp, "$1$2$3")))){
				dataToSend = {
					result:false,
					status:"failure",
					message:"break1 start is not less than break1 endtime"
				}
				return dataToSend
			}
			if(break1St !=0 && break2St != 0 && !(parseInt(bdt3.replace(regExp, "$1$2$3")) < parseInt(bdt5.replace(regExp, "$1$2$3")))){
				dataToSend = {
					result:false,
					status:"failure",
					message:"break1 start is not less than break2 starttime"
				}
				return dataToSend
			}
			if(break1St !=0 && break2End != 0 && !(parseInt(bdt3.replace(regExp, "$1$2$3")) < parseInt(bdt6.replace(regExp, "$1$2$3")))){
				dataToSend = {
					result:false,
					status:"failure",
					message:"break1 start is not less than break2 endtime"
				}
				return dataToSend
			}

			//break1End < end time, < break2St, < break2End
			if(break1End !=0 && !(parseInt(bdt4.replace(regExp, "$1$2$3")) < parseInt(dt2.replace(regExp, "$1$2$3")))){
				dataToSend = {
					result:false,
					status:"failure",
					message:"break1 end is not less than  endtime"
				}
				
				return dataToSend
			}
			if(break1End !=0 && break2St != 0 && !(parseInt(bdt4.replace(regExp, "$1$2$3")) < parseInt(bdt5.replace(regExp, "$1$2$3")))){
				dataToSend = {
					result:false,
					status:"failure",
					message:"break1 end is not less than  break2 start"
				}
				
				return dataToSend
			}
			if(break1End !=0 && break2End != 0 && !(parseInt(bdt4.replace(regExp, "$1$2$3")) < parseInt(bdt6.replace(regExp, "$1$2$3")))){
				dataToSend = {
					result:false,
					status:"failure",
					message:"break1 end is not less than  break2 end"
				}
				
				return dataToSend
			}

			//break2St < end time, < break2End
			if(break2St !=0 && !(parseInt(bdt5.replace(regExp, "$1$2$3")) < parseInt(dt2.replace(regExp, "$1$2$3")))){
				dataToSend = {
					result:false,
					status:"failure",
					message:"break2 start is not less than end time"
				}
				
				return dataToSend
			}
			if(break2St != 0 && break2End != 0 && !(parseInt(bdt5.replace(regExp, "$1$2$3")) < parseInt(bdt6.replace(regExp, "$1$2$3")))){
				dataToSend = {
					result:false,
					status:"failure",
					message:"break2 start is not less than  break2 end"
				}
				
				return dataToSend
			}

			//break2End < end time
			if(break2End != 0 && !(parseInt(bdt6.replace(regExp, "$1$2$3")) < parseInt(dt2.replace(regExp, "$1$2$3")))){
				dataToSend = {
					result:false,
					status:"failure",
					message:"break2 end is not less than end time"
				}
				
				return dataToSend
			}*/

			//duration should be in min

			

			/*if(parseInt(duration.Finals) > parseInt( minutesGET)){
				dataToSend = {
					result:false,
					status:"failure",
					message:"Finals duration is not valid"
				}
				
				return dataToSend
			}
			if(parseInt(duration.SF) > parseInt( minutesGET)){
				dataToSend = {
					result:false,
					status:"failure",
					message:"SF duration is not valid"
				}
				
				return dataToSend
			}
			if(parseInt(duration.QF) > parseInt( minutesGET)){
				dataToSend = {
					result:false,
					status:"failure",
					message:"SF duration is not valid"
				}
				
				return dataToSend
			}
			if(parseInt(duration.PQF) > parseInt(minutesGET)){
				dataToSend = {
					result:false,
					status:"failure",
					message:"PQF duration is not valid"
				}
				
				return dataToSend
			}
			if(parseInt(duration.R32) > parseInt(minutesGET)){
				dataToSend = {
					result:false,
					status:"failure",
					message:"R32 duration is not valid"
				}
				
				return dataToSend
			}
			if(parseInt(duration.R64) > parseInt(minutesGET)){
				dataToSend = {
					result:false,
					status:"failure",
					message:"R64 duration is not valid"
				}
				
				return dataToSend
			}
			if(parseInt(duration.R128) > parseInt( minutesGET)){
				dataToSend = {
					result:false,
					status:"failure",
					message:"R128 duration is not valid"
				}
				
				return dataToSend
			}
			if(parseInt(duration.R256) > parseInt( minutesGET)){
				dataToSend = {
					result:false,
					status:"failure",
					message:"R256 duration is not valid"
				}
				
				return dataToSend
			}
			if(parseInt(duration.R512) > parseInt( minutesGET)){
				dataToSend = {
					result:false,
					status:"failure",
					message:"R512 duration is not valid"
				}
				
				return dataToSend
			}
			if(parseInt(parseInt(duration.R512) + parseInt(duration.R256) + parseInt(duration.R128)
				+ parseInt(duration.R64) + parseInt(duration.R32) + parseInt(duration.PQF)
				 + parseInt(duration.QF) + parseInt(duration.SF) + parseInt(duration.Finals)) > 
				parseInt( minutesGET)){
				dataToSend = {
					result:false,
					status:"failure",
					message:"all round duration exceeds minutes between start and end time"
				}
				
				return dataToSend
			}*/
			if(parseInt(parseInt(duration)) > 
				parseInt( minutesGET)){
				dataToSend = {
					result:false,
					status:"failure",
					message:"duration exceeds minutes between start and end time"
				}
				
				return dataToSend
			}
			else{
				dataToSend = {
					result:true,
					status:"success",
					message:"call next method"
				}
				return dataToSend
			}
		}catch(e){
	
			dataToSend = {
				result:true,
				status:"failure",
				message:e
			}
			return dataToSend
		}
	}
})

//not used
function splitToTables(xDAta,dt1,dt2, bdt3, bdt4, bdt5, bdt6, oldDt1,tableAssignedCount, timeCompleted, table){
	try{
	var dataToSend = {}
	var selectedDate = xDAta.selectedDate
	var startTime = xDAta.startTime
	var endTime = xDAta.endTime
	var break1St = xDAta.break1St
	var break1End = xDAta.break1End
	var break2St = xDAta.break2St
	var break2End = xDAta.break2End
	
	var noOfTablesPerDay = xDAta.noOfTablesPerDay

	var duration = xDAta.durationRound

	var rname = ["Finals", "SF", "QF", "PQF", "R32", "R64", "R128", "R256",
	"R512"];
	var checkkey = _.keys(rname);

	var regExp = /(\d{1,2})\:(\d{1,2})\:(\d{1,2})/;


	var data = xDAta.datas

	var dt1 = dt1
	var dt2 = dt2

	var oldDt1 = oldDt1
	var oldDt2 = dt2

	var bdt3 = bdt3;
	var bdt4 = bdt4;

	var bdt5 = bdt5;
	var bdt6 = bdt6;

	//duration should be in min

	var ms = moment(new Date( selectedDate +" "+ dt2),"DD/MM/YYYY HH:mm:ss").diff(moment(new Date( selectedDate +" "+ dt1),"DD/MM/YYYY HH:mm:ss"));
	var d = moment.duration(ms);
	var minsGET = d.minutes();
	var minutesGET  = parseInt(d.hours())*60 + parseInt(minsGET) + parseInt(d.seconds()) * 0.0166667

	
	var table = parseInt(0 + table)
	var tableAssignedCount = tableAssignedCount 
	var matchLength = 0
	var matchLengthREd = 0 
	var call = ""
	var roundOLDITEM = true
	var timeCompleted = timeCompleted

	for(var k=0;k<data.length;k++){
		if(data[k].length != 0){
			var item = data[k]
			var itemKeys = _.keys(item)
			var wholeRounds = []			

			
			if(itemKeys.length == 5 && itemKeys[2]){
				var itemData = item[itemKeys[2]]
				var roundITEM = true 
				if(timeCompleted == true){
					roundITEM = false
				}

				for(var j=0; j<itemData.length; j++){
					var tableToAssign = "0"

					if(tableAssignedCount == parseInt(noOfTablesPerDay)){
						call = TimeValidation(dt1,dt2,bdt3,bdt4,bdt5,bdt6,parseInt(duration[itemKeys[2]]),selectedDate)
						roundITEM = false
					}
					else{
						if(roundITEM){
							call = TimeValidation(oldDt1,oldDt2,bdt3,bdt4,bdt5,bdt6,parseInt(duration[itemKeys[2]]),selectedDate)
							roundITEM = false
						}
						//
					}


					if(call && call.endtime != 0){

						oldDt1 = call.oldTime
						dt1 = moment(call.endtime, ["h:mm:ss A"]).format("HH:mm:ss")
						
						
						table =  parseInt(table + 1)
						tableToAssign = "T"+table


						if(table > parseInt(noOfTablesPerDay)){
							table = 1
							tableToAssign = "T"+table
						}
					}
					else{
						dt1 = 0
						table = 0
						tableToAssign = "0"
						timeCompleted = true
					}

					tableAssignedCount = table

					//if(tableAssignedCount != parseInt(noOfTablesPerDay)){
						//oldDt1 = dt1
					//}


					var timeData = {
						round:itemKeys[2],
						match:itemData[j],
						time:call.time,
						endTime:call.endtime,
						table:tableToAssign,
						dateOfEvent:selectedDate,
						dateOfEventMoment:moment(new Date(selectedDate)).format("YYYY-MM-DD"),
						order:data[k]["order"]
					}

					if(call.time == undefined && call.endtime == undefined && parseInt(tableToAssign) == 0){
						timeData["time"] = 0
						timeData["endTime"] = 0
					}

					matchLengthREd = 1

					wholeRounds.push(timeData)
					
					if(timeData["time"] != 0){
						data[k]["lastNonZeroMatch"] = itemData[j]
					}
				}
			}
			data[k]["round"] = itemKeys[2]
			data[k]["matchNumbers"] = data[k][itemKeys[2]]
			data[k]["matchNumbersasString"] = data[k][itemKeys[2]].toString()
			data[k]["order"] = data[k]["order"]
			data[k]["duration"] = duration
			data[k]["everound"] = data[k][itemKeys[0]]+"||"+itemKeys[2]
		}
		
		data[k]["schedule"] = wholeRounds
		data[k]["eventId"] = data[k]["eventId"]
		data[k]["tournamentId"] = xDAta.tournamentId
		data[k]["projectType"] = data[k]["projectType"]
		data[k]["sessionNumber"] = xDAta.sessionNumber
		data[k]["starttimesession"] =  xDAta.starttimesession
		data[k]["endtimesession"] = xDAta.endtimesession
		data[k]["noOfTablessession"] = xDAta.noOfTablessession

	}

	var dataWithTourn = {
		"tournamentId":xDAta.tournamentId,
		"selectedDate":selectedDate,
		"startTime" : startTime,
		"endTime" : endTime,
		"break1St" :  break1St,
		"break1End":  break1End,
		"break2St":  break2St,
		"break2End":  break2End,
		"duration" :  duration,
		"scheduledData":data,
		"noOfTables":noOfTablesPerDay
	}

	var dataTORet = {
		data:data,
		dt1:dt1,
		dt2:dt2,
		oldDt1:oldDt1,
		tableAssignedCount:tableAssignedCount,
		timeCompleted:timeCompleted,
		table:tableAssignedCount
	}

	return dataTORet
	
	}catch(e){
	}
}

function createScheduleToDB(data){
	try{
		if(data && data.tournamentId && data.selectedDate){
			var check = tournamentSchedule.findOne({
				tournamentId:data.tournamentId,
				selectedDate:data.selectedDate
			})
			if(check == undefined){
				let id = tournamentSchedule.insert(data)
				if(id){
					var dataToSend = {
						result:true,
						status:"success",
						message:"inserted",
						data:id
					}
					return dataToSend
				}else{
					var dataToSend = {
						result:false,
						status:"failed",
						message:"cannot insert",
						data:""
					}
					return dataToSend 
				}
			}
			else{
				var dataToSend = {
					result:false,
					status:"failed",
					message:"already exists for this tournamentId and date, Please update",
				}
				return dataToSend 
			}
		}
	}catch(e){
	}

}

function updateScheduleToDB(data){
	try{
		if(data && data.tournamentId && data.selectedDate){
			var check = tournamentSchedule.findOne({
				tournamentId:data.tournamentId,
				selectedDate:data.selectedDate
			})
			if(check !== undefined){
				let id = tournamentSchedule.update({
					tournamentId:data.tournamentId,
					selectedDate:data.selectedDate
				},{
					$set:data
				})
				if(id){
					dataToSend = {
						result:true,
						status:"success",
						message:"updated",
						data:id
					}
					return dataToSend
				}else{
					dataToSend = {
						result:false,
						status:"failed",
						message:"cannot update",
						data:id
					}
					return dataToSend 
				}
			}else{
				let id = tournamentSchedule.insert(data)
				if(id){
					var dataToSend = {
						result:true,
						status:"success",
						message:"inserted",
						data:id
					}
					return dataToSend
				}else{
					var dataToSend = {
						result:false,
						status:"failed",
						message:"cannot insert",
						data:""
					}
					return dataToSend 
				}
			}
		}
	}catch(e){
	}

}


/*let dt1 be the given start time, dt2 be given the end time,
  bt3 and bt4 first break start and end
  bt5 and bt6 sec break start and end

  let time and endTime be the time to assign for each match
  
  1. for first match assign dt1 to time
	-- validate time with given dt2
		(if time is  greater to dt2, make time as zero, make endTime as zero)
		(if time is less than dt2, add time with duration and assign to endTime, 
		check endTime with dt2, if endTime is greater to dt2, make time as zero, endTime as zero)
		(if time is greater than or equal to bt3, and less than bt4, assign bt4 to time,
		add duration to time and assign to endtime,  
		if time is equals or greater to dt2, make time as zero, make endTime as zero
		if not
		check endTime with dt2, if endTime is greater to dt2, make time as zero, endTime as zero
		if not
		check endTime is greater than or equal to bt5, and less than bt6, assign bt6 to time,
		add duration to time and assign to endtime,  
		if time is greater to dt2, make time as zero, make endTime as zero
		if not
		check endTime with dt2, if endTime is greater to dt2, make time as zero, endTime as zero
		)*/

function TimeValidation(dt1,dt2,bt3,bt4,bt5,bt6,duration,selectedDate){
	try{
	var time = 0
	var endtime = 0
	if(dt1 == 0){
		var data = {
			time:0,
			endtime:0
		}
		return data
	}

	time = moment(dt1, ["h:mm:ss A"]).format("HH:mm:ss");

	var regExp = /(\d{1,2})\:(\d{1,2})\:(\d{1,2})/;

	//if time is  greater to dt2, make time as zero, make endTime as zero
	if(parseInt(time.replace(regExp, "$1$2$3")) > parseInt(dt2.replace(regExp, "$1$2$3"))){
		time = 0
		endtime = 0
	}
	else{
		//add time with duration and assign to endTime, 
		
		var endtimecheck = moment(new Date( selectedDate +" "+ time)).add(duration, 'minutes').format('DD MMM YYYY hh:mm:ss A');

		if(moment(new Date(endtimecheck)).format('YYYY-MM-DD') > moment(new Date(selectedDate)).format('YYYY-MM-DD')){
			var data = {
				time:0,
				endtime:0
			}
			return data
		}

		endtime = moment(new Date( selectedDate +" "+ time)).add(duration, 'minutes').format('hh:mm:ss A');
		endtime = moment(endtime, ["h:mm:ss A"]).format("HH:mm:ss");

		

		//check endTime with dt2, if endTime is greater to dt2, make time as zero, endTime as zero
		if(parseInt(endtime.replace(regExp, "$1$2$3")) > parseInt(dt2.replace(regExp, "$1$2$3"))){
			var data = {
				time:0,
				endtime:0
			}
			return data
		}
		
		//if time is greater than or equal to bt3, and less than bt4, assign bt4 to time
		if( bt3 != 0 && bt4 != 0 && parseInt(time.replace(regExp, "$1$2$3")) >= parseInt(bt3.replace(regExp, "$1$2$3"))
			&& parseInt(time.replace(regExp, "$1$2$3")) < parseInt(bt4.replace(regExp, "$1$2$3"))){
			time = moment(bt4, ["h:mm:ss A"]).format("HH:mm:ss")

			//add duration to time and assign to endtime,  
			
			var endtimecheck = moment(new Date( selectedDate +" "+ time)).add(duration, 'minutes').format('DD MMM YYYY hh:mm:ss A');

			if(moment(new Date(endtimecheck)).format('YYYY-MM-DD') > moment(new Date(selectedDate)).format('YYYY-MM-DD')){
				var data = {
					time:0,
					endtime:0
				}
				return data
			}

			endtime = moment(new Date( selectedDate +" "+ time)).add(duration, 'minutes').format('hh:mm:ss A');
			endtime = moment(endtime, ["h:mm:ss A"]).format("HH:mm:ss");
		}

		if(bt5 != 0 && bt6 != 0 && parseInt(time.replace(regExp, "$1$2$3")) >= parseInt(bt5.replace(regExp, "$1$2$3"))
			&& parseInt(time.replace(regExp, "$1$2$3")) < parseInt(bt6.replace(regExp, "$1$2$3"))){
			time = moment(bt6, ["h:mm:ss A"]).format("HH:mm:ss")

			//add duration to time and assign to endtime,  
			
			var endtimecheck = moment(new Date( selectedDate +" "+ time)).add(duration, 'minutes').format('DD MMM YYYY hh:mm:ss A');

			if(moment(new Date(endtimecheck)).format('YYYY-MM-DD') > moment(new Date(selectedDate)).format('YYYY-MM-DD')){
				var data = {
					time:0,
					endtime:0
				}
				return data
			}

			endtime = moment(new Date( selectedDate +" "+ time)).add(duration, 'minutes').format('hh:mm:ss A');
			endtime = moment(endtime, ["h:mm:ss A"]).format("HH:mm:ss");
		}

		if(bt3 != 0 && bt4 != 0 && parseInt(endtime.replace(regExp, "$1$2$3")) > parseInt(bt3.replace(regExp, "$1$2$3"))
			&& parseInt(endtime.replace(regExp, "$1$2$3")) <= parseInt(bt4.replace(regExp, "$1$2$3"))){
			time = moment(bt4, ["h:mm:ss A"]).format("HH:mm:ss")

			//add duration to time and assign to endtime,  
			var endtimecheck = moment(new Date( selectedDate +" "+ time)).add(duration, 'minutes').format('DD MMM YYYY hh:mm:ss A');

			if(moment(new Date(endtimecheck)).format('YYYY-MM-DD') > moment(new Date(selectedDate)).format('YYYY-MM-DD')){
				var data = {
					time:0,
					endtime:0
				}
				return data
			}

			endtime = moment(new Date( selectedDate +" "+ time)).add(duration, 'minutes').format('hh:mm:ss A');
			endtime = moment(endtime, ["h:mm:ss A"]).format("HH:mm:ss");
		}

		if(bt6 != 0 && bt5 != 0 && parseInt(endtime.replace(regExp, "$1$2$3")) > parseInt(bt5.replace(regExp, "$1$2$3"))
			&& parseInt(endtime.replace(regExp, "$1$2$3")) <= parseInt(bt6.replace(regExp, "$1$2$3"))){
			time = moment(bt6, ["h:mm:ss A"]).format("HH:mm:ss")

			//add duration to time and assign to endtime,  
			
			var endtimecheck = moment(new Date( selectedDate +" "+ time)).add(duration, 'minutes').format('DD MMM YYYY hh:mm:ss A');

			if(moment(new Date(endtimecheck)).format('YYYY-MM-DD') > moment(new Date(selectedDate)).format('YYYY-MM-DD')){
				var data = {
					time:0,
					endtime:0
				}
				return data
			}

			endtime = moment(new Date( selectedDate +" "+ time)).add(duration, 'minutes').format('hh:mm:ss A');
			endtime = moment(endtime, ["h:mm:ss A"]).format("HH:mm:ss");
		}

		if(bt4 != 0 && parseInt(bt4.replace(regExp, "$1$2$3")) >= parseInt(time.replace(regExp, "$1$2$3"))
			&& parseInt(bt4.replace(regExp, "$1$2$3")) <= parseInt(endtime.replace(regExp, "$1$2$3"))){
			time = moment(bt4, ["h:mm:ss A"]).format("HH:mm:ss")

			//add duration to time and assign to endtime,  
			
			var endtimecheck = moment(new Date( selectedDate +" "+ time)).add(duration, 'minutes').format('DD MMM YYYY hh:mm:ss A');

			if(moment(new Date(endtimecheck)).format('YYYY-MM-DD') > moment(new Date(selectedDate)).format('YYYY-MM-DD')){
				var data = {
					time:0,
					endtime:0
				}
				return data
			}

			endtime = moment(new Date( selectedDate +" "+ time)).add(duration, 'minutes').format('hh:mm:ss A');
			endtime = moment(endtime, ["h:mm:ss A"]).format("HH:mm:ss");
		}

		if(bt6 != 0 && parseInt(bt6.replace(regExp, "$1$2$3")) >= parseInt(time.replace(regExp, "$1$2$3"))
			&& parseInt(bt6.replace(regExp, "$1$2$3")) <= parseInt(endtime.replace(regExp, "$1$2$3"))){
			time = moment(bt6, ["h:mm:ss A"]).format("HH:mm:ss")

			//add duration to time and assign to endtime,  
			
			var endtimecheck = moment(new Date( selectedDate +" "+ time)).add(duration, 'minutes').format('DD MMM YYYY hh:mm:ss A');

			if(moment(new Date(endtimecheck)).format('YYYY-MM-DD') > moment(new Date(selectedDate)).format('YYYY-MM-DD')){
				var data = {
					time:0,
					endtime:0
				}
				return data
			}

			endtime = moment(new Date( selectedDate +" "+ time)).add(duration, 'minutes').format('hh:mm:ss A');
			endtime = moment(endtime, ["h:mm:ss A"]).format("HH:mm:ss");
		}

		//if time is greater to dt2, make time as zero, make endTime as zero
		if(parseInt(time.replace(regExp, "$1$2$3")) > parseInt(dt2.replace(regExp, "$1$2$3"))){
			var data = {
				time:0,
				endtime:0
			}
			return data
		}

		//if not
		//check endTime with dt2, if endTime is greater to dt2, make time as zero, endTime as zero
	    if(parseInt(endtime.replace(regExp, "$1$2$3")) > parseInt(dt2.replace(regExp, "$1$2$3"))){
			var data = {
				time:0,
				endtime:0
			}
			return data
		}

	}

	if(time!=0){
		time = moment(time, ["HH:mm:ss"]).format("h:mm:ss A")
	}
	if(endtime!=0){
		endtime = moment(endtime, ["HH:mm:ss"]).format("h:mm:ss A")
	}

	var data = {
		time:time,
		endtime:endtime,
		oldTime:dt1
	}

	return data
	}catch(e){
	}
}