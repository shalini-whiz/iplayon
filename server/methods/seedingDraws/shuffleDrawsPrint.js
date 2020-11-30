Meteor.methods({
    "seedingDetailsDownload": function(tournamentId, eventName,dataDetails) {
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
                SSR.compileTemplate('seedingDetails', Assets.getText('seedingDetails.html'));

                var dbsrequired = ["userDetailsTT","playerTeams"]
           
                var userDetailsTT = "userDetailsTT"
                var playerTeams = "playerTeams"


                Template.seedingDetails.helpers({
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
                    tournamentName: function() {
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
                    eventName: function() {
                        try {
                        	if(eventName)
                            return eventName;
                        	else
                        		return false
                        } catch (e) {
                        }
                    },
                    dataDetailsplayers:function(){
                    	try{
                    		return dataDetails
                    	}catch(e){

                    	}
                    }
                    
                });
				
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

                SSR.compileTemplate('matchRecords_report', Assets.getText('seedingDetails.html'));

                var html_string = SSR.render('seedingDetails', {
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
        }
    }
 })