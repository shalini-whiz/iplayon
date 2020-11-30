Meteor.methods({

	"printRRBlankTeamMatchScore":async function(tournamentId, eventName, teamAId, teamBId, teamDetailedDraws) {
        try {
            if (Meteor.isServer) {
                var webshot = Meteor.npmRequire('webshot');
                var fs = Npm.require('fs');
                var Future = Npm.require('fibers/future');
                var fut = new Future();
                var fileName = "matchRecords-report.pdf";
                var css = Assets.getText('drawsStyle.css');
                SSR.compileTemplate('printRRBlankTeamMatchScore', Assets.getText('printRRBlankTeamMatchScore.html'));
              	var matchScore = {};
                if (tournamentId && eventName && teamDetailedDraws) 
                {
                   
                    var det = teamDetailedDraws
                    if (det) {
                        var res = await Meteor.call("fetchTeamDetailScore", tournamentId, eventName, det)
                        try {
                            if (res) {
                                matchScore = res
                            }
                        }catch(e){}
                    }
                }
                Template.printRRBlankTeamMatchScore.helpers({
                    "imageURL": function() {
                        try {
                            var absoluteUrl = Meteor.absoluteUrl().toString();
                            var absoluteUrlString = absoluteUrl.substring(0, absoluteUrl.lastIndexOf("/"));
                            var imageURL = absoluteUrlString;

                            return imageURL;
                        } catch (E) {

                        }
                    },
                    get5sImage: function() {
                        try {
                            var e = events.findOne({
                                "eventName": eventName,
                                "tournamentEvent": false,
                                'tournamentId': tournamentId
                            })
                            if (e == undefined) {
                                e = pastEvents.findOne({
                                    "eventName": eventName,
                                    tournamentId: tournamentId
                                })
                            }
                            if (e && e.sponsorLogo) {
                                sponsorLogo = e.sponsorLogo
                                var sponsorLogoURL = eventUploads.findOne({
                                    "_id": sponsorLogo
                                });
                                if (sponsorLogoURL) {
                                    return sponsorLogoURL
                                } else return false
                            } else return false
                        } catch (e) {}
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
                        } catch (e) {}
                    },
                    eventName_team: function() {
                        try {
                            return eventName;
                        } catch (e) {}
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
                        } catch (e) {}
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
                        } catch (e) {}
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
                                    return reverseDate(tourInfo.eventStartDate) + " - " + reverseDate(tourInfo.eventEndDate);
                            } else {
                                tourInfo = pastEvents.findOne({
                                    "tournamentEvent": true,
                                    '_id': tournamentId
                                });
                                if (tourInfo) {
                                    if (tourInfo.eventStartDate && tourInfo.eventEndDate)
                                        return reverseDate(tourInfo.eventStartDate) + " - " + reverseDate(tourInfo.eventEndDate);
                                }
                            }
                        } catch (e) {}
                    },
                    "teamA":function(){
                    	return teamAId;
                    },
                    "teamB":function(){
                    	return teamBId;
                    },
                    "formatInfo":function(){
                    	try{
                    		if(matchScore)
                    		{
                    			if(matchScore.status == "success" && matchScore.specifications)
                    			{
                    				return matchScore.specifications;
                    			}
                    		}
                    	}catch(e)
                    	{

                    	}
                    },
                    "eventType":function(eventType)
                    {
						if(eventType == 1 || eventType == "1")
							return true;
						else
							return false;
			
					},
					"setPlayerName":function(detailScore,data)
					{
						if (data && detailScore) 
						{	
							var playerID  = "";
							if(data == "playerA" && detailScore.teamAplayerAID)					
								playerID = detailScore.teamAplayerAID;	
							else if(data == "playerB" && detailScore.teamAplayerBID)
								playerID = detailScore.teamAplayerBID;
							else if(data == "playerX" && detailScore.teamBplayerAID)
								playerID = detailScore.teamBplayerAID;
							else if(data == "playerY" && detailScore.teamBplayerBID)
								playerID = detailScore.teamBplayerBID;

	                        var userInfo = Meteor.users.findOne({
	                            "userId": playerID
	                            });
	                        if (userInfo && userInfo.userName) 
	                        {
	  							return userInfo.userName;                         
	                        }
	                    }
	                }


                   
                   
                });

				

                Template.registerHelper("findTheTeamNamedraw", function(data) {
                    try {
                        if (data) {
                            if(tournamentId != undefined && tournamentId != null)
                            {
                                var dbsrequired = ["playerTeams"]
                                var res2 =  Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
                                if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
                                {
                                    teamInfo = global[res2.changedDbNames[0]].findOne({
                                        "_id": data
                                    })
                                    if(teamInfo && teamInfo.teamName)
                                        return teamInfo.teamName;
                                                                                       
                                }
                            }
                            else
                            {
                                var teamName = playerTeams.findOne({
                                    "_id": data
                                });
                                if (teamName) {
                                    var teamDet = teamName
                                    if (teamDet && teamDet.teamName) {
                                        return teamDet.teamName;
                                    }
                                }
                            }
                           
                        }
                    } catch (e) {

                    }
                });

                Template.registerHelper("findThePlayerName", function(data) {
                    try {
                        if (data) {

                            var userName = Meteor.users.findOne({
                                userId: data
                            });
                            if (userName) {
                                var toret = "userDetailsTT"

                                var usersMet = Meteor.users.findOne({
                                    userId:  data
                                })

                                if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                                    var dbn = playerDBFind(usersMet.interestedProjectName[0])
                                    if (dbn) {
                                        toret = dbn
                                    }
                                }
                                if(tournamentId != null && tournamentId != undefined)
                                {
                                    var dbsrequired = ["userDetailsTT"]
                                    var res2 =  Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
                                    if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
                                    {
                                        userInfo = global[res2.changedDbNames[0]].findOne({
                                            "userId":  data
                                        })
                                        if(userInfo && userInfo.userName)
                                            return userInfo.userName;
                                                                                           
                                    }
                                }
                                else
                                {
                                    var useDet = global[toret].findOne({
                                        "userId":  data
                                    });
                                
                                    if (useDet && useDet.userName) {
                                        return useDet.userName;
                                    }
                                }
                               
                            }
                        }
                    } catch (e) {

                    }
                });

                


                SSR.compileTemplate('matchRecords_report', Assets.getText('printRRBlankTeamMatchScore.html'));

                var html_string = SSR.render('printRRBlankTeamMatchScore', {
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

                        fs.unlinkSync(fileName);
                        fut.return(data);

                    });
                });

                let pdfData = fut.wait();
                let base64String = new Buffer(pdfData).toString('base64');
                return base64String;
            }

        } catch (e) {
        	errorLog(e)
        }
    },
    'printRRTeamMatchScore': async function(tournamentId, eventName, teamAId, teamBId, teamDetailedDraws) {
        try {
            if (Meteor.isServer) {
                var webshot = Meteor.npmRequire('webshot');
                var fs = Npm.require('fs');
                var Future = Npm.require('fibers/future');
                var fut = new Future();
                var fileName = "matchRecords-report.pdf";
                var css = Assets.getText('printTeamDetailedDraws.css');
                SSR.compileTemplate('printRRTeamMatchScore', Assets.getText('printRRTeamMatchScore.html'));
                var matchScore = {};

                if (tournamentId && eventName && teamDetailedDraws) 
                {
                    var det = teamDetailedDraws;
                    if (det) {
                        var res = await Meteor.call("fetchTeamDetailScore", tournamentId, eventName, det)
                        try {
                            if (res) {
                                matchScore = res;
                            }
                        }catch(e){}
                    }
                    
                }
                Template.printRRTeamMatchScore.helpers({
                    "imageURL": function() {
                        try {
                            var absoluteUrl = Meteor.absoluteUrl().toString();
                            var absoluteUrlString = absoluteUrl.substring(0, absoluteUrl.lastIndexOf("/"));
                            var imageURL = absoluteUrlString;

                            return imageURL;
                        } catch (E) {

                        }
                    },
                    get5sImage: function() {
                        try {
                            var e = events.findOne({
                                "eventName": eventName,
                                "tournamentEvent": false,
                                'tournamentId': tournamentId
                            })
                            if (e == undefined) {
                                e = pastEvents.findOne({
                                    "eventName": eventName,
                                    tournamentId: tournamentId
                                })
                            }
                            if (e && e.sponsorLogo) {
                                sponsorLogo = e.sponsorLogo
                                var sponsorLogoURL = eventUploads.findOne({
                                    "_id": sponsorLogo
                                });
                                if (sponsorLogoURL) {
                                    return sponsorLogoURL
                                } else return false
                            } else return false
                        } catch (e) {}
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
                        } catch (e) {}
                    },
                    eventName_team: function() {
                        try {
                            return eventName;
                        } catch (e) {}
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
                        } catch (e) {}
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
                        } catch (e) {}
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
                                    return tourInfo.eventStartDate + " between " + tourInfo.eventEndDate;
                            } else {
                                tourInfo = pastEvents.findOne({
                                    "tournamentEvent": true,
                                    '_id': tournamentId
                                });
                                if (tourInfo) {
                                    if (tourInfo.eventStartDate && tourInfo.eventEndDate)
                                        return tourInfo.eventStartDate + " between " + tourInfo.eventEndDate;
                                }
                            }
                        } catch (e) {}
                    },

                    "teamA":function(){
                    	return teamAId;
                    },
                    "teamB":function(){
                    	return teamBId;
                    },
                    "formatInfo":function(){
                    	try{
                    		if(matchScore)
                    		{
                    			if(matchScore.status == "success" && matchScore.specifications)
                    			{
                    				return matchScore.specifications;
                    			}
                    		}
                    	}catch(e)
                    	{

                    	}
                    },
                    "eventType":function(eventType)
                    {
						if(eventType == 1 || eventType == "1")
							return true;
						else
							return false;
			
					},
                	"setMatchStatus":function(detailScore)
                	{
                		if(detailScore && detailScore.matchType)
                		{
                			if(detailScore.matchType.toLowerCase() == "notplayed")
                				return "Not Played";
                			else
                			{
                				return detailScore.matchType.toLowerCase().charAt(0).toUpperCase() + detailScore.matchType.toLowerCase().slice(1);

                			}
                		}
                		return "Not Played"
                	},
					"setPlayerName":function(detailScore,data)
					{
						if (data && detailScore) 
						{	
							var playerID  = "";
							if(data == "playerA" && detailScore.teamAplayerAID)					
								playerID = detailScore.teamAplayerAID;	
							else if(data == "playerB" && detailScore.teamAplayerBID)
								playerID = detailScore.teamAplayerBID;
							else if(data == "playerX" && detailScore.teamBplayerAID)
								playerID = detailScore.teamBplayerAID;
							else if(data == "playerY" && detailScore.teamBplayerBID)
								playerID = detailScore.teamBplayerBID;

	                        var userInfo = Meteor.users.findOne({
	                            "userId": playerID
	                            });
	                        if (userInfo && userInfo.userName) 
	                        {
	  							return userInfo.userName;                         
	                        }
	                    }
	                },
	                "setWinner":function(detailScore,matchType)
				    {
				    	if(detailScore && matchType)
				    	{
				    		if(matchType == 1 && detailScore.winnerA)
					    	{
					    		var userInfo = Meteor.users.findOne({
	                            	"userId": detailScore.winnerA});
		                        if (userInfo && userInfo.userName) 
		                        {
		  							return userInfo.userName;                         
		                        }

					    	}
					    	else if(matchType == 2)
					    	{
								winnerA = detailScore.winnerA;
								winnerB = detailScore.winnerB;
								var userInfo1 = Meteor.users.findOne({"userId": winnerA});
								var userInfo2= Meteor.users.findOne({"userId": winnerB});

								if (userInfo1 && userInfo2 && userInfo1.userName && userInfo2.userName) 
		                        {
		  							return userInfo1.userName+" , "+userInfo2.userName;                        
		                        }

					    	}
				    	}  	
				    },
				    "setTeamType":function()
				    {
                    	try{
                    		
                    		if(matchScore && matchScore.status == "success" && matchScore.teamMatchType)
                    		{
                    			return matchScore.teamMatchType;
                    		}
                    		
                    	}catch(e){

                    	}                   
				    },
				    "setTeamWinner":function(){
				    	try{
                    		
                    		if(matchScore && matchScore.status == "success" && matchScore.finalTeamWinner)
                    		{
                    			if(tournamentId != undefined && tournamentId != null)
	                            {
	                                var dbsrequired = ["playerTeams"]
	                                var res2 =  Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
	                                if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
	                                {
	                                    teamInfo = global[res2.changedDbNames[0]].findOne({
	                                        "_id": matchScore.finalTeamWinner
	                                    })
	                                    if(teamInfo && teamInfo.teamName)
	                                        return teamInfo.teamName;
	                                                                                       
	                                }
	                            }
	                            else
	                            {
	                                var teamName = playerTeams.findOne({
	                                    "_id": matchScore.finalTeamWinner
	                                });
	                                if (teamName) {
	                                    var teamDet = teamName
	                                    if (teamDet && teamDet.teamName) {
	                                        return teamDet.teamName;
	                                    }
	                                }
	                            }
                    		}
                    		
                    	}catch(e){

                    	} 
				    }
                });

                 Template.registerHelper("findTheTeamNamedraw", function(data) {
                    try {
                        if (data) {
                            if(tournamentId != undefined && tournamentId != null)
                            {
                                var dbsrequired = ["playerTeams"]
                                var res2 =  Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
                                if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
                                {
                                    teamInfo = global[res2.changedDbNames[0]].findOne({
                                        "_id": data
                                    })
                                    if(teamInfo && teamInfo.teamName)
                                        return teamInfo.teamName;
                                                                                       
                                }
                            }
                            else
                            {
                                var teamName = playerTeams.findOne({
                                    "_id": data
                                });
                                if (teamName) {
                                    var teamDet = teamName
                                    if (teamDet && teamDet.teamName) {
                                        return teamDet.teamName;
                                    }
                                }
                            }
                           
                        }
                    } catch (e) {

                    }
                });

                Template.registerHelper("findThePlayerName", function(data) {
                    try {
                        if (data) {

                            var userName = Meteor.users.findOne({
                                userId: data
                            });
                            if (userName) {
                                var toret = "userDetailsTT"

                                var usersMet = Meteor.users.findOne({
                                    userId:  data
                                })

                                if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                                    var dbn = playerDBFind(usersMet.interestedProjectName[0])
                                    if (dbn) {
                                        toret = dbn
                                    }
                                }
                                if(tournamentId != null && tournamentId != undefined)
                                {
                                    var dbsrequired = ["userDetailsTT"]
                                    var res2 =  Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
                                    if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
                                    {
                                        userInfo = global[res2.changedDbNames[0]].findOne({
                                            "userId":  data
                                        })
                                        if(userInfo && userInfo.userName)
                                            return userInfo.userName;
                                                                                           
                                    }
                                }
                                else
                                {
                                    var useDet = global[toret].findOne({
                                        "userId":  data
                                    });
                                
                                    if (useDet && useDet.userName) {
                                        return useDet.userName;
                                    }
                                }
                               
                            }
                        }
                    } catch (e) {

                    }
                });


                SSR.compileTemplate('matchRecords_report', Assets.getText('printRRTeamMatchScore.html'));

                var html_string = SSR.render('printRRTeamMatchScore', {
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

                        fs.unlinkSync(fileName);
                        fut.return(data);

                    });
                });

                let pdfData = fut.wait();
                let base64String = new Buffer(pdfData).toString('base64');
                return base64String;
            }

        } catch (e) {}
    },
})