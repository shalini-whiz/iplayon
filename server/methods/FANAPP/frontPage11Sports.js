import {
    MatchCollectionDB
}
from '../../publications/MatchCollectionDb.js';
import {
    teamMatchCollectionDB
}
from '../../publications/MatchCollectionDbTeam.js';


Meteor.methods({
	"getEventListOfNationalKO": function(xData){
		var res = {
			status:FAIL_STATUS,
			data:0,
			message:FAIL_KNOCK_OUT_EVENT_NATIONAL
		}
		try{
			if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }

            if (xData) {
            	var sDraws = new DrawsResults(xData)
            	var eventOrganizerCheck = sDraws.nullUndefinedEmpty("eventOrganizer")
            	if(eventOrganizerCheck == "1"){
            		var checkYear = sDraws.nullUndefinedEmpty("year")

	            	if(checkYear=="1"){
	            		var validYear = sDraws.validateYear()

	            		if(validYear == "1"){
	            			var query = {}
	                    	var query2 = {}
	                    	var message = ""
	                   	 	var db = "events"
	                    	var year = xData.year
	                   		var nextYear = parseInt(year + 1)
	                    	var date1 = new Date(year + "-01-01")
	                    	var date2 = new Date(nextYear + "-01-01")
	                    	var tournamentType = "NITTC-State-"+year
	                    	var tournamentTypeNational = "NITTC-National-"+year
	                   
	                    	var tourTyp = sDraws.nullUndefinedEmpty("types")
	                    	var tourCo = sDraws.nullUndefinedEmpty("co")

	                    	if(tourTyp == "1"){
	                    		if(tourCo=="1"){
	                    			var findTourType = schoolEventsToFind.aggregate([{
									    $match: {
									        key: "School"
									    }
									}, {
									    $unwind: {
									        path: "$tournamentTypes"
									    }
									}, {
									    $match: {
									        "tournamentTypes.type": xData.types,
									        "tournamentTypes.co": xData.co,
									        "tournamentTypes.year": xData.year
									    }
									}, {
									    $project: {
									        "tourNam": "$tournamentTypes.name"
									    }
									}])

	                    			if(findTourType && findTourType.length && findTourType[0].tourNam){
		                    			var query  = {
											"eventEndDate1" : {
												"$gte" :date1,
												"$lt" : date2
											},
											"eventOrganizer" : xData.eventOrganizer,
											"tournamentEvent" : true,
											"tournamentType" : findTourType[0].tourNam
										}
										var getTournamentID = events.findOne(query)
										if(getTournamentID==undefined||getTournamentID==null){
											getTournamentID = pastEvents.findOne(query)
										}
										if(getTournamentID && getTournamentID._id){
											var xData = {
												"tournamentId":getTournamentID._id
											}

											var getListOfEvents = Meteor.call("parametervalidationsForDrawsResultsForTId",xData)
											return getListOfEvents
										}
									}
	                    		}
	                    		else{
	                    			res.message = tourCo
	                    		}
							}else{
								res.message = tourTyp
							}
	                	}else{
	                		res.message = validYear
	                	}

	            	}else{
	            		res.message = checkYear
	            	}
            	}
            	else{
            		res.message = eventOrganizerCheck
            	}
            }
            else {
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


Meteor.methods({
	"getEventListOfNationalRR":  function(xData){
		var res = {
			status:FAIL_STATUS,
			data:0,
			message:FAIL_KNOCK_OUT_EVENT_NATIONAL
		}
		try{
			if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }

            if (xData) {

            	var sDraws = new DrawsResults(xData)
            	var eventOrganizerCheck = sDraws.nullUndefinedEmpty("eventOrganizer")
            	if(eventOrganizerCheck == "1"){
            		var checkYear = sDraws.nullUndefinedEmpty("year")

	            	if(checkYear=="1"){
	            		var validYear = sDraws.validateYear()

	            		if(validYear == "1"){
	            			var query = {}
	                    	var query2 = {}
	                    	var message = ""
	                   	 	var db = "events"
	                    	var year = xData.year
	                   		var nextYear = parseInt(year + 1)
	                    	var date1 = new Date(year + "-01-01")
	                    	var date2 = new Date(nextYear + "-01-01")
	                    	var tournamentType = "NITTC-State-"+year
	                    	var tournamentTypeNational = "NITTC-National-"+year
	                   
	                    	var tourTyp = sDraws.nullUndefinedEmpty("types")
	                    	var tourCo = sDraws.nullUndefinedEmpty("co")

	                    	if(tourTyp == "1"){

	                    		if(tourCo=="1"){

	                    			var findTourType = schoolEventsToFind.aggregate([{
									    $match: {
									        key: "School"
									    }
									}, {
									    $unwind: {
									        path: "$tournamentTypes"
									    }
									}, {
									    $match: {
									        "tournamentTypes.type": xData.types,
									        "tournamentTypes.co": xData.co,
									        "tournamentTypes.year": xData.year
									    }
									}, {
									    $project: {
									        "tourNam": "$tournamentTypes.name"
									    }
									}])

	                    			if(findTourType && findTourType.length && findTourType[0].tourNam){
		                    			var query  = {
											"eventEndDate1" : {
												"$gte" :date1,
												"$lt" : date2
											},
											"eventOrganizer" : xData.eventOrganizer,
											"tournamentEvent" : true,
											"tournamentType" : findTourType[0].tourNam
										}

										var getTournamentID = events.findOne(query)
										if(getTournamentID==undefined||getTournamentID==null){
											getTournamentID = pastEvents.findOne(query)
										}

										if(getTournamentID && getTournamentID._id){
											var xData = {
												"tournamentId":getTournamentID._id
											}

											var getListOfEvents = Meteor.call("fetchRRDrawEvents",xData)
											if(getListOfEvents && getListOfEvents.status==SUCCESS_STATUS && 
												getListOfEvents.data && getListOfEvents.data.length){
						                        var s = eventsmapOrder(getListOfEvents.data, [], 'eventName');
						                        s = s.filter(function( element ) {
						                            return element !== undefined && element !== null;
						                        });
						                        if(s.length==0){
						                        	s = getListOfEvents.data
						                        }
						                        getListOfEvents.data = s


						                        
											}

											return getListOfEvents
										}
									}
	                    		}
	                    		else{
	                    			res.message = tourCo
	                    		}
							}else{
								res.message = tourTyp
							}
	                	}else{
	                		res.message = validYear
	                	}

	            	}else{
	            		res.message = checkYear
	            	}
            	}
            	else{
            		res.message = eventOrganizerCheck
            	}
            }
            else {
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



Meteor.methods({
	"getListOf11SportsTourTypes":function(){
		var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": FAIL_TOURNAMENT_TYPES
        }
		try{
			var findSclF = schoolEventsToFind.findOne({
				"key":"School"
			})
			if(findSclF && findSclF.tournamentTypes && 
				findSclF.cos && findSclF.dispNamesTeam){
				res.status = SUCCESS_STATUS
				res.data = findSclF.tournamentTypes
				res.cos = findSclF.cos
				res.dispNamesTeam = findSclF.dispNamesTeam
				res.teamEventNAME = findSclF.teamEventNAME
				res.message = SUCCESS_TOURNAMENT_TYPES
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

Meteor.methods({
	"getStateListByYearRoundRobin":function(xData){
		var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": GET_STATE_FOR_11Sports_FAIL_MSG
        }

        try {

            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }

            if (xData) {
            	var sDraws = new DrawsResults(xData)
            	var eventOrganizerCheck = sDraws.nullUndefinedEmpty("eventOrganizer")
            	if(eventOrganizerCheck == "1"){
            		var checkYear = sDraws.nullUndefinedEmpty("year")

	            	if(checkYear=="1"){
	            		var validYear = sDraws.validateYear()

	            		if(validYear == "1"){
	            			var query = {}
	                    	var query2 = {}
	                    	var message = ""
	                   	 	var db = "events"
	                    	var year = new Date().getFullYear()
	                   		var nextYear = parseInt(year + 1)
	                    	var date1 = new Date(year + "-01-01")
	                    	var date2 = new Date(nextYear + "-01-01")
	                    	var tournamentType = "NITTC-State-"+year
	                    	var tournamentTypeNational = "NITTC-National-"+year
	                   

	                    	var query  = {
								"eventEndDate1" : {
									"$gte" :date1,
									"$lt" : date2
								},
								"eventOrganizer" : xData.eventOrganizer,
								"tournamentEvent" : true,
								"tournamentType" : tournamentType
							}

							var getDoms =  queryToGetUnDomains(query,"pastEvents","roundRobinEvents",true)
							var getDoms1 = queryToGetUnDomains(query,"events","roundRobinEvents",true)

							var domsForTeam = []
							var domsMatch = []

							var nationalQuery = {
								"eventEndDate1" : {
									"$gte" :date1,
									"$lt" : date2
								},
								"eventOrganizer" : xData.eventOrganizer,
								"tournamentEvent" : true,
								"tournamentType" : tournamentTypeNational
							}

							var getNationalTour1 = queryToGetNationalTournDet(nationalQuery,"events")
							var getNationalTour2 = queryToGetNationalTournDet(nationalQuery,"pastEvents")
							if(getNationalTour1){
								domsMatch = _.union(domsMatch,getNationalTour1)
							}
							if(true){
								if(getNationalTour2){
									domsMatch = _.union(domsMatch,getNationalTour2)
								}
							}


							if(getDoms && getDoms.length && getDoms[0].doms){
								domsForTeam = _.union(domsForTeam,getDoms[0].doms)
							}
							if(getDoms1 && getDoms1.length && getDoms1[0].doms){
								domsForTeam = _.union(domsForTeam,getDoms1[0].doms)
							}

							var getDomList = queryToGetDomainList(query,"events","roundRobinEvents")
							var getDomList1 = queryToGetDomainList(query,"pastEvents","roundRobinEvents")
							var getDomList2 = false
							var getDomList3 = false

							if(domsForTeam.length){
								query = {
									"eventOrganizer" : xData.eventOrganizer,
									"tournamentEvent" : true,
									"tournamentType" : "NITTC-State-2018",
									"_id":{
										"$in":domsForTeam
									}
								}
								getDomList2 = queryToGetDomainList(query,"events","roundRobinTeamEvents")
								getDomList3 = queryToGetDomainList(query,"pastEvents","roundRobinTeamEvents")
							}

							if(getDomList && getDomList.length){
								domsMatch =  _.union(domsMatch,getDomList)
							}
							if(getDomList1 && getDomList1.length){
								domsMatch =  _.union(domsMatch,getDomList1)
							}
							if(getDomList2 && getDomList2.length){
								domsMatch =  _.union(domsMatch,getDomList2)
							}
							if(getDomList3 && getDomList3.length){
								domsMatch =  _.union(domsMatch,getDomList3)
							}

							if(domsMatch.length){
								var schoolEventsFi = schoolEventsToFind.findOne({})
								if(schoolEventsFi && schoolEventsFi.teamEventNAME && 
									schoolEventsFi.dispNamesTeam){
									res.teamEventNamesList = schoolEventsFi.teamEventNAME
									res.displayTeamList =  schoolEventsFi.dispNamesTeam
								}
								res.status = SUCCESS_STATUS
								res.message = GET_STATE_FOR_11Sports_SUCCESS_MSG
								res.data = domsMatch
							}
	                	}else{
	                		res.message = validYear
	                	}

	            	}else{
	            		res.message = checkYear
	            	}

            	}else{
            		res.message = eventOrganizerCheck
            	}
            	
            }
			else {
                res.message = "parameters  " + ARE_NULL_MSG
            }
			return res
        } catch (e) {
            res.message = e
            if (e && e.toString()) {
                res.error = e.toString()
            }
            return res
        }
	}
})

Meteor.methods({
	"getStateListByYearNEW":function(xData){
		var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": GET_STATE_FOR_11Sports_FAIL_MSG
        }

        try {
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }

            if (xData) {
            	var sDraws = new DrawsResults(xData)
            	var eventOrganizerCheck = sDraws.nullUndefinedEmpty("eventOrganizer")
            	if(eventOrganizerCheck == "1"){
            		var checkYear = sDraws.nullUndefinedEmpty("year")

	            	if(checkYear=="1"){
	            		var validYear = sDraws.validateYear()

	            		if(validYear == "1"){
	            			var query = {}
	                    	var query2 = {}
	                    	var message = ""
	                   	 	var db = "events"
	                    	var year = xData.year
	                   		var nextYear = parseInt(year + 1)
	                    	var date1 = new Date(year + "-01-01")
	                    	var date2 = new Date(nextYear + "-01-01")
	                    	var tournamentType = "NITTC-State-"+year
	                    	var tournamentTypeNational = "NITTC-National-"+year
	                   
	                    	var tourTyp = sDraws.nullUndefinedEmpty("types")
	                    	var tourCo = sDraws.nullUndefinedEmpty("co")

	                    	if(tourTyp == "1"){

	                    		if(tourCo=="1"){

	                    			var findTourType = schoolEventsToFind.aggregate([{
									    $match: {
									        key: "School"
									    }
									}, {
									    $unwind: {
									        path: "$tournamentTypes"
									    }
									}, {
									    $match: {
									        "tournamentTypes.type": xData.types,
									        "tournamentTypes.co": xData.co,
									        "tournamentTypes.year": xData.year
									    }
									}, {
									    $project: {
									        "tourNam": "$tournamentTypes.name"
									    }
									}])

	                    			if(findTourType && findTourType.length && findTourType[0].tourNam){

		                    			var query  = {
											"eventEndDate1" : {
												"$gte" :date1,
												"$lt" : date2
											},
											"eventOrganizer" : xData.eventOrganizer,
											"tournamentEvent" : true,
											"tournamentType" : findTourType[0].tourNam
										}

										var getDoms =  queryToGetUnDomains(query,"pastEvents","MatchCollectionDB",true)
										var getDoms1 = queryToGetUnDomains(query,"events","MatchCollectionDB",true)

										var domsForTeam = []
										var domsMatch = []

										/*var nationalQuery = {
											"eventEndDate1" : {
												"$gte" :date1,
												"$lt" : date2
											},
											"eventOrganizer" : xData.eventOrganizer,
											"tournamentEvent" : true,
											"tournamentType" : tournamentTypeNational
										}

										var getNationalTour1 = queryToGetNationalTournDet(nationalQuery,"events")
										var getNationalTour2 = queryToGetNationalTournDet(nationalQuery,"pastEvents")
										if(getNationalTour1){
											domsMatch = _.union(domsMatch,getNationalTour1)
										}
										if(true){
											if(getNationalTour2){
												domsMatch = _.union(domsMatch,getNationalTour2)
											}
										}*/


										if(getDoms && getDoms.length && getDoms[0].doms){
											domsForTeam = _.union(domsForTeam,getDoms[0].doms)
										}
										if(getDoms1 && getDoms1.length && getDoms1[0].doms){
											domsForTeam = _.union(domsForTeam,getDoms1[0].doms)
										}

										var getDomList = queryToGetDomainList(query,"events","MatchCollectionDB")
										var getDomList1 = queryToGetDomainList(query,"pastEvents","MatchCollectionDB")
										var getDomList2 = false
										var getDomList3 = false

										if(domsForTeam.length){
											query = {
												"eventOrganizer" : xData.eventOrganizer,
												"tournamentEvent" : true,
												"tournamentType" : findTourType[0].tourNam,
												"_id":{
													"$in":domsForTeam
												}
											}
											getDomList2 = queryToGetDomainList(query,"events","teamMatchCollectionDB")
											getDomList3 = queryToGetDomainList(query,"pastEvents","teamMatchCollectionDB")
										}

										if(getDomList && getDomList.length){
											domsMatch =  _.union(domsMatch,getDomList)
										}
										if(getDomList1 && getDomList1.length){
											domsMatch =  _.union(domsMatch,getDomList1)
										}
										if(getDomList2 && getDomList2.length){
											domsMatch =  _.union(domsMatch,getDomList2)
										}
										if(getDomList3 && getDomList3.length){
											domsMatch =  _.union(domsMatch,getDomList3)
										}

										if(domsMatch.length){
											var schoolEventsFi = schoolEventsToFind.findOne({})
											if(schoolEventsFi && schoolEventsFi.teamEventNAME && 
												schoolEventsFi.dispNamesTeam){
												res.teamEventNamesList = schoolEventsFi.teamEventNAME
												res.displayTeamList =  schoolEventsFi.dispNamesTeam
											}
											res.status = SUCCESS_STATUS
											res.message = GET_STATE_FOR_11Sports_SUCCESS_MSG

											domsMatch = domsMatch.sort(function(a, b) {
											    var textA = a.domainName.toUpperCase();
											    var textB = b.domainName.toUpperCase();
											    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
											});
											res.data = domsMatch
										}
									}
	                    		}
	                    		else{
	                    			res.message = tourCo
	                    		}
							}else{
								res.message = tourTyp
							}
	                	}else{
	                		res.message = validYear
	                	}

	            	}else{
	            		res.message = checkYear
	            	}

            	}else{
            		res.message = eventOrganizerCheck
            	}
            	
            }
			else {
                res.message = "parameters  " + ARE_NULL_MSG
            }
			return res
        } catch (e) {
            res.message = e
            if (e && e.toString()) {
                res.error = e.toString()
            }
            return res
        }
	}
})


Meteor.methods({
	"getStateListByYear":function(xData){
		var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": GET_STATE_FOR_11Sports_FAIL_MSG
        }

        try {

            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }

            if (xData) {
            	var sDraws = new DrawsResults(xData)
            	var eventOrganizerCheck = sDraws.nullUndefinedEmpty("eventOrganizer")
            	if(eventOrganizerCheck == "1"){
            		var checkYear = sDraws.nullUndefinedEmpty("year")

	            	if(checkYear=="1"){
	            		var validYear = sDraws.validateYear()

	            		if(validYear == "1"){
	            			var query = {}
	                    	var query2 = {}
	                    	var message = ""
	                   	 	var db = "events"
	                    	var year = new Date().getFullYear()
	                   		var nextYear = parseInt(year + 1)
	                    	var date1 = new Date(year + "-01-01")
	                    	var date2 = new Date(nextYear + "-01-01")
	                    	var tournamentType = "NITTC-State-"+year
	                    	var tournamentTypeNational = "NITTC-National-"+year
	                   

	                    	var query  = {
								"eventEndDate1" : {
									"$gte" :date1,
									"$lt" : date2
								},
								"eventOrganizer" : xData.eventOrganizer,
								"tournamentEvent" : true,
								"tournamentType" : tournamentType
							}

							var getDoms =  queryToGetUnDomains(query,"pastEvents","MatchCollectionDB",true)
							var getDoms1 = queryToGetUnDomains(query,"events","MatchCollectionDB",true)

							var domsForTeam = []
							var domsMatch = []

							var nationalQuery = {
								"eventEndDate1" : {
									"$gte" :date1,
									"$lt" : date2
								},
								"eventOrganizer" : xData.eventOrganizer,
								"tournamentEvent" : true,
								"tournamentType" : tournamentTypeNational
							}

							var getNationalTour1 = queryToGetNationalTournDet(nationalQuery,"events")
							var getNationalTour2 = queryToGetNationalTournDet(nationalQuery,"pastEvents")
							if(getNationalTour1){
								domsMatch = _.union(domsMatch,getNationalTour1)
							}
							if(true){
								if(getNationalTour2){
									domsMatch = _.union(domsMatch,getNationalTour2)
								}
							}


							if(getDoms && getDoms.length && getDoms[0].doms){
								domsForTeam = _.union(domsForTeam,getDoms[0].doms)
							}
							if(getDoms1 && getDoms1.length && getDoms1[0].doms){
								domsForTeam = _.union(domsForTeam,getDoms1[0].doms)
							}

							var getDomList = queryToGetDomainList(query,"events","MatchCollectionDB")
							var getDomList1 = queryToGetDomainList(query,"pastEvents","MatchCollectionDB")
							var getDomList2 = false
							var getDomList3 = false

							if(domsForTeam.length){
								query = {
									"eventOrganizer" : xData.eventOrganizer,
									"tournamentEvent" : true,
									"tournamentType" : "NITTC-State-2018",
									"_id":{
										"$in":domsForTeam
									}
								}
								getDomList2 = queryToGetDomainList(query,"events","teamMatchCollectionDB")
								getDomList3 = queryToGetDomainList(query,"pastEvents","teamMatchCollectionDB")
							}

							if(getDomList && getDomList.length){
								domsMatch =  _.union(domsMatch,getDomList)
							}
							if(getDomList1 && getDomList1.length){
								domsMatch =  _.union(domsMatch,getDomList1)
							}
							if(getDomList2 && getDomList2.length){
								domsMatch =  _.union(domsMatch,getDomList2)
							}
							if(getDomList3 && getDomList3.length){
								domsMatch =  _.union(domsMatch,getDomList3)
							}

							if(domsMatch.length){
								var schoolEventsFi = schoolEventsToFind.findOne({})
								if(schoolEventsFi && schoolEventsFi.teamEventNAME && 
									schoolEventsFi.dispNamesTeam){
									res.teamEventNamesList = schoolEventsFi.teamEventNAME
									res.displayTeamList =  schoolEventsFi.dispNamesTeam
								}
								res.status = SUCCESS_STATUS
								res.message = GET_STATE_FOR_11Sports_SUCCESS_MSG
								res.data = domsMatch
							}
	                	}else{
	                		res.message = validYear
	                	}

	            	}else{
	            		res.message = checkYear
	            	}

            	}else{
            		res.message = eventOrganizerCheck
            	}
            	
            }
			else {
                res.message = "parameters  " + ARE_NULL_MSG
            }
			return res
        } catch (e) {
            res.message = e
            if (e && e.toString()) {
                res.error = e.toString()
            }
            return res
        }
	}
})


Meteor.methods({
	"getRRWithEvents":  function(xData){
		var res = {
            "status": FAIL_STATUS,
            "data": 0,
            "message": GET_STATE_FOR_11Sports_FAIL_MSG
        }
		try{
			var res = Meteor.call("fetchRRDraws", xData.tournamentId, xData.eventName)
			var data = {
				tournamentId:xData.tournamentId
			}
			var resEve =  Meteor.call("fetchRRDrawEvents",data)
			if(resEve && resEve.data){
				if(resEve && resEve.status==SUCCESS_STATUS && 
					resEve.data && resEve.data.length){
					var s = eventsmapOrder(resEve.data, [], 'eventName');
					s = s.filter(function( element ) {
						return element !== undefined && element !== null;
					});
					if(s.length==0){
						s = resEve.data
					}
					resEve.data = s
				}
				res["eventsData"] = resEve.data
			}
			return res
		}catch(e){

		}
	}
})



var queryToGetNationalTournDet = function(query,db){
	try{
		

		var tourDet = global[db].aggregate([
			{
				$match:query
			},{
				$project: {
			        "tournamentId": "$_id",
			        "domainId": "$domainId",
			        "domainName": "$domainName",
			        "tournamentType":"$tournamentType"
		    	}
			}, {
		    	$unwind: {
		        	"path": "$domainId"
		    	}
			}
		])
		if(tourDet && tourDet.length){
			return tourDet
		}
		else{
			return false
		}
	}catch(e){
		return false
	}
}

var queryToGetUnDomains = function(query,db,lookup,bools){
	try{
		var getStates = global[db].aggregate([{
		    $match: query
		}, {
		    $project: {
		        "tournamentId": "$_id",
		        "domainId": "$domainId",
		        "domainName": "$domainName"
		    }
		}, {
		    $lookup: {
		        from: lookup,
		        localField: "_id",
		        // name of users table field,
		        foreignField: "tournamentId",
		        as: "usersDet" // alias for userinfo table
		    }
		}, {
		    $project: {
		        "tournamentId": "$tournamentId",
		        "domainId": "$domainId",
		        "domainName": "$domainName",
		        "eid1": {
		            "$cond": [{
		                "$eq": ["$usersDet.tournamentId", []]
		            }, 0, 1]
		        },
		    }
		}, {
		    $match: {
		        "eid1": {
		            $eq: 0
		        }
		    }
		}, {
		    $group: {
		        "_id": null,
		        "doms": {
		            "$push": "$tournamentId"
		        }
		    }
		}]);
	

		if(getStates && getStates.length && getStates[0] && getStates[0].doms){
			return getStates
		}else{
			return false
		}
	}catch(e){
		return false
	}
}

var queryToGetDomainList = function(query,db,lookup){
	try{
		var getStates = global[db].aggregate([{
		    $match: query
		}, {
		    $project: {
		        "tournamentId": "$_id",
		        "domainId": "$domainId",
		        "domainName": "$domainName",
		        "tournamentType":"$tournamentType"
		    }
		}, {
		    $lookup: {
		        from: lookup,
		        localField: "_id",
		        // name of users table field,
		        foreignField: "tournamentId",
		        as: "usersDet" // alias for userinfo table
		    }
		}, {
		    $project: {
		        "tournamentId": "$tournamentId",
		        "domainId": "$domainId",
		        "domainName": "$domainName",
		        "tournamentType":"$tournamentType",
		        "eid1": {
		            "$cond": [{
		                "$eq": ["$usersDet.tournamentId", []]
		            }, 0, 1]
		        },
		    }
		}, {
		    $match: {
		        "eid1": {
		            $eq: 1
		        }
		    }
		}, {
		    $unwind: {
		        "path": "$domainId"
		    }
		},{
			$sort:{
				"domainName":1
			}
		}])
		

		if(getStates && getStates.length){
			return getStates
		}else{
			return false
		}
	}catch(e){
		return false
	}
}