//userDetailsTTUsed

Meteor.methods({
    "scheduleDownload": function(tournamentId, eventName,dataDetails,showtournsOnly,fetchMatchColl) {
    	try {
            if (Meteor.isServer) {

            	if(eventName == null || eventName == undefined){
            		eventName = ""
            	}
                var webshot = Meteor.npmRequire('webshot');
                var fs = Npm.require('fs');
                var Future = Npm.require('fibers/future');
                var fut = new Future();
                var fileName = "scheduler.pdf";
                var css = Assets.getText('scheduler.css');
                SSR.compileTemplate('tournSchedulers', Assets.getText('tournSchedulers.html'));

                var dbsrequired = ["userDetailsTT","playerTeams"]
           
                var userDetailsTT = "userDetailsTT"
                var playerTeams = "playerTeams"


                Template.tournSchedulers.helpers({
                	"eventAbb":function(){
                		try{

                			var e = events.findOne({"eventName":this.ev,"tournamentEvent":false,'tournamentId':tournamentId})
                			if(e && e.abbName){
                				return e.abbName
                			}else{
                				e = pastEvents.findOne({"eventName":this.ev, tournamentId:tournamentId,"tournamentEvent":false})
                				if(e && e.abbName){
                					return e.abbName
                				}
                			}
						}catch(E){
                        }
                	},
                    "imageURL":function(){
                        try{
                            var absoluteUrl = Meteor.absoluteUrl().toString();
                            var absoluteUrlString = absoluteUrl.substring(0,absoluteUrl.lastIndexOf("/"));
                            var imageURL = absoluteUrlString;
                            return imageURL;
                        }catch(E){
                        }
                    },
                    get5sImage:function(){
                        try{
                            var e = events.findOne({"eventName":eventName,"tournamentEvent":false,'tournamentId':tournamentId})
                            if(e==undefined){
                                e = pastEvents.findOne({"eventName":eventName,tournamentId:tournamentId})
                            }
                            if(e&&e.sponsorLogo){
                                sponsorLogo = e.sponsorLogo
                                var sponsorLogoURL = eventUploads.findOne({"_id":sponsorLogo});
                                if(sponsorLogoURL){
                                    return sponsorLogoURL
                                }
                                else return false
                            } else return false
                        }catch(e){

                        }
                    },
                    getDocType: function() {
                        return "<!DOCTYPE html>";
                    },
                    tournamentName_team: function() {
                        try {
                            var tourInfo;
                            tourInfo = events.findOne({
                                "tournamentEvent": true,
                                '_id': tournamentId
                            });
                            if (tourInfo)
                                return tourInfo.eventName;
                            else {
                                tourInfo = pastEvents.findOne({
                                    "tournamentEvent": true,
                                    '_id': tournamentId
                                });
                                if (tourInfo)
                                    return tourInfo.eventName;
                            }
                        } catch (e) {
                        }
                    },
                    eventName_team: function() {
                        try {
                        	if(eventName)
                            return eventName;
                        	else
                        		return false
                        } catch (e) {
                        }
                    },
                    venueAddress_team: function() {
                        try {
                            var tourInfo;
                            tourInfo = events.findOne({
                                "tournamentEvent": true,
                                '_id': tournamentId
                            });
                            if (tourInfo)
                                return tourInfo.venueAddress;
                            else {
                                tourInfo = pastEvents.findOne({
                                    "tournamentEvent": true,
                                    '_id': tournamentId
                                });
                                if (tourInfo)
                                    return tourInfo.venueAddress;
                            }
                        } catch (e) {
                        }
                    },
                    domainName_team: function() {
                        try {
                            var tourInfo;
                            tourInfo = events.findOne({
                                "tournamentEvent": true,
                                '_id': tournamentId
                            });
                            if (tourInfo)
                                return tourInfo.domainName;
                            else {
                                tourInfo = pastEvents.findOne({
                                    "tournamentEvent": true,
                                    '_id': tournamentId
                                });
                                if (tourInfo)
                                    return tourInfo.domainName;
                            }
                        } catch (e) {
                        }
                    },
                    eventDate_team: function() {
                        try {
                            var tourInfo;
                            tourInfo = events.findOne({
                                "tournamentEvent": true,
                                '_id': tournamentId
                            });
                            if (tourInfo) {
                                if (tourInfo.eventStartDate && tourInfo.eventEndDate)
                                    return tourInfo.eventStartDate + " to " + tourInfo.eventEndDate;
                            } else {
                                tourInfo = pastEvents.findOne({
                                    "tournamentEvent": true,
                                    '_id': tournamentId
                                });
                                if (tourInfo) {
                                    if (tourInfo.eventStartDate && tourInfo.eventEndDate)
                                        return tourInfo.eventStartDate + " to " + tourInfo.eventEndDate;
                                }
                            }
                        } catch (e) {
                        }
                    },
                    editData:function(){
				    	try{
				    		if(eventName && dataDetails!=null && showtournsOnly==2){
					    		var res = dataDetails
					    		if(res){
					    			if(res && res.length != 0 ){
					    				return res
					    			}
				    			}
				    		}
				    		else if(dataDetails!= null&& showtournsOnly==1){
					    		var res = dataDetails
					    		if(res){
					    			if(res && res.length != 0 ){
					    				return res
					    			}
				    			}
				    		}
				    		else if(dataDetails!= null&& showtournsOnly==3){
					    		var res = dataDetails
					    		if(res){
					    			if(res && res.length != 0 ){
					    				return res
					    			}
				    			}
				    		}
				    	}catch(e){
				    	}
				    },
				    durationDAta:function(round,duration){
				    	try{
				    		if(dataDetails != null&& showtournsOnly==2){
				    			var res = dataDetails
					    		if(res){
					    			if(res && res.length != 0 && duration && round){
					    				if(duration[round]){
					    					return duration[round]
					    				}
					    			}
				    			}
				    		}
				    		else if(dataDetails != null && showtournsOnly==1){
				    			var res = dataDetails
					    		if(res){
					    			if(res && res.length != 0 && duration && round){
					    				if(duration[round]){
					    					return duration[round]
					    				}
					    			}
				    			}
				    		}
				    		else if(dataDetails != null && showtournsOnly==3){
				    			var res = dataDetails
					    		if(res){
					    			if(res && res.length != 0 && duration && round){
					    				if(duration[round]){
					    					return duration[round]
					    				}
					    			}
				    			}
				    		}
				    	}catch(e){
				    	}
				    },
				    matchCollectionData2:function(){
				    	try{
				    		if(fetchMatchColl){
				    			var s = _.findWhere(fetchMatchColl, {
					                    "eventName": this.ev,
					                    "matchNumber": parseInt(this.sc.match)
					                })
				    			
				    			if(s){
				    				var r = []
				    				r.push(s)
				    				return r
				    			}
				    			
				    		}
				    	}catch(e){
				    	}
				    },
				    matchCollectionData:function(tosend, projectType,matchNumber,eventNamess){
				    	try{
				    		if(dataDetails != null && showtournsOnly==2){
				    			var res = Meteor.call("getPlayerMatchDetails",projectType,matchNumber,tournamentId,eventNamess)
					    		if(res){
					    			if(res){
					    				if(res){
					    					if(parseInt(tosend) == 1)
					    					return res.playerA
					    					if(parseInt(tosend) == 2)
					    					return res.playerB
					    					
					    					if(res.status.toLowerCase() == "completed" && parseInt(tosend) == 4)
					    						return res.scores
					    					else if (parseInt(tosend) == 4){
					    						return res.status
					    					}
					    					if(parseInt(tosend) == 5){
					    						if(res.playerA == res.winnerId && (
					    							res.status.toLowerCase() == "completed" ||
					    							res.status.toLowerCase() == "bye" ||
					    							res.status.toLowerCase() == "walkover"))
					    							return true
					    						else 
					    							return false
					    					}
					    					if(parseInt(tosend) == 6){
					    						if(res.playerB == res.winnerId && (
					    							res.status.toLowerCase() == "completed" ||
					    							res.status.toLowerCase() == "bye" ||
					    							res.status.toLowerCase() == "walkover"))
					    							return true
					    						else 
					    							return false
					    					}
					    				}	
					    			}
				    			}else{
				    				if(parseInt(tosend) == 1)
					    				return "-"
					    			if(parseInt(tosend) == 2)
					    				return "-"
					    			if(parseInt(tosend) == 3)
					    				return "-"
					    			if(parseInt(tosend) == 4)
					    				return "-"
					    			if(parseInt(tosend) == 5)
					    				return false
					    			if(parseInt(tosend) == 6)
					    				return false
				    			}
				    		}
				    		else if(dataDetails != null && showtournsOnly==1){
				    			var res = Meteor.call("getPlayerMatchDetails",projectType,matchNumber,tournamentId,eventNamess)
					    		if(res){
					    			if(res){
					    				if(res){
					    					if(parseInt(tosend) == 1)
					    					return res.playerA
					    					if(parseInt(tosend) == 2)
					    					return res.playerB
					    					
					    					if(res.status.toLowerCase() == "completed" && parseInt(tosend) == 4)
					    						return res.scores
					    					else if (parseInt(tosend) == 4){
					    						return res.status
					    					}
					    					if(parseInt(tosend) == 5){
					    						if(res.playerA == res.winnerId && (
					    							res.status.toLowerCase() == "completed" ||
					    							res.status.toLowerCase() == "bye" ||
					    							res.status.toLowerCase() == "walkover"))
					    							return true
					    						else 
					    							return false
					    					}
					    					if(parseInt(tosend) == 6){
					    						if(res.playerB == res.winnerId && (
					    							res.status.toLowerCase() == "completed" ||
					    							res.status.toLowerCase() == "bye" ||
					    							res.status.toLowerCase() == "walkover"))
					    							return true
					    						else 
					    							return false
					    					}
					    				}	
					    			}
				    			}else{
				    				if(parseInt(tosend) == 1)
					    				return "-"
					    			if(parseInt(tosend) == 2)
					    				return "-"
					    			if(parseInt(tosend) == 3)
					    				return "-"
					    			if(parseInt(tosend) == 4)
					    				return "-"
					    			if(parseInt(tosend) == 5)
					    				return false
					    			if(parseInt(tosend) == 6)
					    				return false
				    			}
				    		}
				    		else if(dataDetails != null && showtournsOnly==3){
				    			var res = Meteor.call("getPlayerMatchDetails",projectType,matchNumber,tournamentId,eventNamess)
					    		if(res){
					    			if(res){
					    				if(res){
					    					if(parseInt(tosend) == 1)
					    					return res.playerA
					    					if(parseInt(tosend) == 2)
					    					return res.playerB
					    					
					    					if(res.status.toLowerCase() == "completed" && parseInt(tosend) == 4)
					    						return res.scores
					    					else if (parseInt(tosend) == 4){
					    						return res.status
					    					}
					    					if(parseInt(tosend) == 5){
					    						if(res.playerA == res.winnerId && (
					    							res.status.toLowerCase() == "completed" ||
					    							res.status.toLowerCase() == "bye" ||
					    							res.status.toLowerCase() == "walkover"))
					    							return true
					    						else 
					    							return false
					    					}
					    					if(parseInt(tosend) == 6){
					    						if(res.playerB == res.winnerId && (
					    							res.status.toLowerCase() == "completed" ||
					    							res.status.toLowerCase() == "bye" ||
					    							res.status.toLowerCase() == "walkover"))
					    							return true
					    						else 
					    							return false
					    					}
					    				}	
					    			}
				    			}else{
				    				if(parseInt(tosend) == 1)
					    				return "-"
					    			if(parseInt(tosend) == 2)
					    				return "-"
					    			if(parseInt(tosend) == 3)
					    				return "-"
					    			if(parseInt(tosend) == 4)
					    				return "-"
					    			if(parseInt(tosend) == 5)
					    				return false
					    			if(parseInt(tosend) == 6)
					    				return false
				    			}
				    		}
				    	}catch(e){
				    	}
				    },
				    checkforWinner:function(winnerId,player){
				    	try{

				    	}catch(e){
				    	}
				    },
				    checkzeroTime:function(){
				    	try{
				    		if(this.sc.time != undefined && this.sc.time != null){
				    			if(parseInt(this.sc.time) == 0){
				    				return "Time exceeds"
				    			}
				    			else{
				    				return this.sc.time
				    			}
				    		}
				    	}catch(e){

				    	}
				    },
				    checkzeroTable:function(){
				    	try{
				    		if(this.sc.table != undefined && this.sc.table != null){
				    			if(parseInt(this.sc.table) == 0){
				    				return "-"
				    			}
				    			else{
				    				return this.sc.table
				    			}
				    		}
				    	}catch(e){

				    	}
				    }
                });
				
				Template.registerHelper("playerWinners",function(status, playerA, playerB, winnerId) {
					try {
					    
					    if(status&&playerA&&playerB&&winnerId){
					    	if (playerA == winnerId && (status.toLowerCase() == "completed" || 
					        	status.toLowerCase() == "bye" || 
					        	status.toLowerCase() == "walkover")) return true
					        else return false
					    }
					} catch (e) {
					}
				})

				Template.registerHelper("backgroundDiv", function(data) {
                    if (data != undefined) {
                        if (parseInt(data) == 0) {
                            return "#D5EEF6"
                        } else if (parseInt(parseInt(data + 1) % 2) == 0) {
                            return "#fff"
                        } else if (parseInt(parseInt(data + 1) % 2) !== 0) {
                            return "#D5EEF6 ";
                        }
                    }
                });

				Template.registerHelper("findDetailsUsersSchedule", function(data) {
				    try{
				        if(data != undefined && data != null){
				           var s = Meteor.call("findDetailsUsersTeams",data)
				           if(s && s.userName){
				            return s.userName
				           }
				           else if(s && s.teamName){
				            return s.teamName
				           }
				           
				        }
				    }catch(e){
				    }
				})

				Template.registerHelper("scoresOfMatch", function(scoresA,scoresB,status,playerA,playerB,winnerId) {
				    try {
				        var scores = ""
				        if(scoresA && scoresB && status && playerA && playerB && winnerId){
					        if (status.toLowerCase() == "completed") {
					            if (scoresA && scoresB) {
					                if (playerA == winnerId) {
					                    var scoreInfo = " ";
					                    for (var k = 0; k < scoresA.length; k++) {
					                        if (parseInt(scoresA[k]) != 0 || parseInt(scoresB[k]) != 0) {
					                            scores = scores + "  " + scoresA[k].toString() + "-" + scoresB[k].toString();
					                        }
					                    }
					                } else if (playerB == winnerId) {
					                    for (var k = 0; k < scoresB.length; k++) {
					                        if (parseInt(scoresA[k]) != 0 || parseInt(scoresB[k]) != 0) {
					                            scores = scores + "  " + scoresB[k].toString() + "-" + scoresA[k].toString();
					                        }
					                    }
					                }
					            }
					            return scores
					        }
					        else{
					            return status
					        }
				    	}
				    	else if(status){
				    		return status
				    	}
				    } catch (e) {
				    }
				})

                SSR.compileTemplate('matchRecords_report', Assets.getText('tournSchedulers.html'));

                var html_string = SSR.render('tournSchedulers', {
                    css: css,
                    template: "matchRecords_report",
                    data: ' '
                });

                var options = {
                    "paperSize": {
                        "format": "Letter",
                        "orientation": "portrait",
                        "margin": "1cm",

                    },
                    siteType: 'html',
                    customCSS: 'table {}'
                };

                webshot(html_string, fileName, options, function(err) {
                    fs.readFile(fileName, function(err, data) {
                        if (err) {
                            return
                        }

                        fs.unlink(fileName,function(err){
                            if(err){
                            }
                            else{
                                fut.return(data); 
                            }    
                        });

                    });
                });

                let pdfData = fut.wait();
                let base64String = new Buffer(pdfData).toString('base64');
                return base64String;

            }

        } catch (e) {
        }
    }
 })


Meteor.methods({
    "scheduleDataForAPTTA": async function(tournamentId, eventName, selectedDate, type) {
        try {
            var dataToReturn = false
            var dataDetails = []
            var eventIDs = []
            var eventIDs2 = []
            var fetchMatchColl = []
            var showtournsOnly = 0
            var evenAPI = ""
            if (type) {
                if (tournamentId && tournamentId.trim().length) {
                    if (parseInt(type) == 1) {
                        var res = await Meteor.call("scheduleOfGivenIdTourn", tournamentId, "", "",)
                        try {
                            if (res) {
                                if (res && res.data && res.data.length != 0) {
                                   dataDetails = res.data
                                }
                                if (res && res.data2 && res.data2[0]) {
                                    if (res.data2[0].e) eventIDs = res.data2[0].e
                                    if (res.data2[0].e2) eventIDs2 = res.data2[0].e2
                                    if (dataDetails) {
                                        var respser = await Meteor.call("getPlayerMatchDetailsComplete", 1, 1, tournamentId, eventIDs, eventIDs2)
                                        try {
                                            if (respser) {
                                                var playerDet = respser
                                                fetchMatchColl = respser
                                                showtournsOnly = type
                                                evenAPI = eventName
                                            }
                                        }catch(e){

                                        }
                                    }
                                }
                            } else if (e) {
                            }
                        }catch(e){}
                    } else if (parseInt(type) == 2) {
                        if (eventName && eventName.trim().length) {
                        	var res = await Meteor.call("scheduleOfGivenIdTourn", tournamentId, eventName, "")
                        	try {
	                            if (res) {
	                                if (res && res.data && res.data.length != 0) {
	                                   dataDetails = res.data
	                                }
	                                if (res && res.data2 && res.data2[0]) {
	                                    if (res.data2[0].e) eventIDs = res.data2[0].e
	                                    if (res.data2[0].e2) eventIDs2 = res.data2[0].e2
	                                    if (dataDetails) {
	                                        var respser = await Meteor.call("getPlayerMatchDetailsComplete", 1, 1, tournamentId, eventIDs, eventIDs2)
	                                        try {
	                                            if (respser) {
	                                                var playerDet = respser
	                                                fetchMatchColl = respser
	                                                showtournsOnly = type
	                                                evenAPI = eventName
	                                            }
	                                        }catch(e){}
	                                    }
	                                }
	                            } else if (e) {
	                            	dataToReturn = e
	                            }
	                        }catch(e){
	                        	dataToReturn = e
	                        }
                        } else {
                            dataToReturn = "eventName is invalid"
                        }
                    } else if (parseInt(type) == 3) {
                        if (selectedDate && selectedDate.trim().length) {
                        	var res = await Meteor.call("scheduleOfGivenIdTourn", tournamentId, "", selectedDate)
                        	try {
	                            if (res) {
	                                if (res && res.data && res.data.length != 0) {
	                                   dataDetails = res.data
	                                }
	                                if (res && res.data2 && res.data2[0]) {
	                                    if (res.data2[0].e) eventIDs = res.data2[0].e
	                                    if (res.data2[0].e2) eventIDs2 = res.data2[0].e2
	                                    if (dataDetails) {
	                                        var respser = await Meteor.call("getPlayerMatchDetailsComplete", 1, 1, tournamentId, eventIDs, eventIDs2)
	                                         try {
	                                            if (respser) {
	                                                var playerDet = respser
	                                                fetchMatchColl = respser
	                                                showtournsOnly = type
	                                                evenAPI = ""
	                                            }
	                                        }catch(e){}
	                                    }
	                                }
	                            } else if (e) {
	                            	dataToReturn = e
	                            }
	                        }catch(e){
	                        	dataToReturn = e
	                        }
                        } else {
                            dataToReturn = "selectedDate is invalid"
                        }
                    } else {
                        dataToReturn = "type is invalid"
                    }
                } else {
                    dataToReturn = "tournamentId id is invalid"
                }
            } else {
                dataToReturn = "type is invalid"
            }

            if(fetchMatchColl && dataDetails && showtournsOnly){
            	var res = await Meteor.call("scheduleDownload",tournamentId, evenAPI,
            		dataDetails,showtournsOnly,fetchMatchColl)
            	try{
            			if(res){
            				dataToReturn = res
            			}
            			else if(e){
            				dataToReturn = e
            			}
            	}catch(e){
            		dataToReturn = e
            	}
            }

            return dataToReturn
        } catch (e) {
            return false
        }
    }
})