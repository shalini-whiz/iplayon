import {
    playerDBFind
}
from '../dbRequiredRole.js'

import {
    titleize
}
from '../../server.js'
//userDetailsTTUsed

Meteor.methods({
    'printRRIndDetailedDraws':async  function(data) {
        try {

            if (Meteor.isServer) 
            {
                var tournamentId = data.tournamentId;
                var eventName = data.eventName;

                var webshot = Meteor.npmRequire('webshot');
                var fs = Npm.require('fs');
                var Future = Npm.require('fibers/future');
                var fut = new Future();
                var fileName = "printRRIndScoreSheet.pdf";
                var css = Assets.getText('printTeamDetailedDraws.css');
                SSR.compileTemplate('layout', Assets.getText('layout.html'));
                Template.layout.helpers({
                    getDocType: function() {
                        return "<!DOCTYPE html>";
                    }
                });

                SSR.compileTemplate('printRRIndScoreSheet', Assets.getText('printRRIndScoreSheet.html'));
                
                var tournamentName = "";
                var venueAddress = "";
                var domainName = "";
                var tourStartDate  = "";
                var tourEndDate  = "";
                var resultDraws = "";
                var groupName = "";

                var result = await Meteor.call("fetchIndDetailScores", data)
                try {
                    if (result) {
                        if(result.groupName)
                            groupName = result.groupName;
                        if(result.groupDetails)
                            resultDraws = result.groupDetails;
                    }
                }catch(e){};

                

                var tourInfo = events.findOne({"_id":tournamentId});
                if(tourInfo == undefined)
                    tourInfo = pastEvents.findOne({"_id":tournamentId});

                if(tourInfo)
                {
                    if(tourInfo.eventName)
                        tournamentName = tourInfo.eventName;
                    if(tourInfo.venueAddress)
                        venueAddress = tourInfo.venueAddress;
                    if(tourInfo.domainName)
                        domainName = tourInfo.domainName;
                    if(tourInfo.eventStartDate)
                        tourStartDate = tourInfo.eventStartDate;
                    if(tourInfo.eventEndDate)
                        tourEndDate = tourInfo.eventEndDate

                }

                var absoluteUrl = Meteor.absoluteUrl().toString();
                var absoluteUrlString = absoluteUrl.substring(0, absoluteUrl.lastIndexOf("/"));
                var imageURL = absoluteUrlString;

                var dbsrequired = ["userDetailsTT"];
                var dbName = undefined;

                var res2 =  Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
                if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
                {
                    dbName = res2.changedDbNames[0];                                 
                }



                Template.printRRIndScoreSheet.helpers({            
                    displayPlayerName:function(playerId)
                    {
                        try{
                            if(dbName != undefined)
                            {
                                userInfo = global[res2.changedDbNames[0]].findOne({
                                    "userId":playerId
                                })
                                if (userInfo && userInfo.clubNameId) 
                                {
                                    var clubInfo = academyDetails.findOne({
                                        "userId": userInfo.clubNameId,
                                        "role": "Academy"
                                    });
                                    if(clubInfo)
                                    {
                                        userInfo["academyName"] = clubInfo.clubName;
                                    }
                                }
                                else if(userInfo && userInfo.schoolId)
                                {
                                    var clubInfo = schoolDetails.findOne({
                                        "userId": userInfo.schoolId,
                                    });
                                    if(clubInfo&&clubInfo.schoolName)
                                        userInfo["academyName"] = clubInfo.schoolName;
                                }
                                if(userInfo && userInfo.userName)
                                {
                                    var academyName = "";
                                    if(userInfo.academyName)
                                        academyName = " ("+userInfo.academyName.toString().substr(0, 3)+")";
                                    //return userInfo.userName+""+academyName;  
                                    return titleCase(userInfo.userName)+""+academyName.toUpperCase();                                        
                                }
                            }
                            else
                            {
                                var userInfo = Meteor.call("findDetailsUsersTeams",playerId)
                                if(userInfo)
                                {
                                    return titleCase(userInfo.userName);
                                }
                            }
                            

                        }catch(e){

                        }
                    },                      
                });
                

                var dataJson = {};
                dataJson["tournamentName"] = tournamentName;
                dataJson["eventName"] = eventName;
                dataJson["venueAddress"] = venueAddress;
                dataJson["domainName"] = domainName;
                dataJson["tourStartDate"] = reverseDate(tourStartDate);
                dataJson["tourEndDate"] = reverseDate(tourEndDate);
                dataJson["fetchDetailScore"] = resultDraws
                dataJson["imageURL"] = imageURL;
                dataJson["groupName"] = groupName;
    

                var html_string = SSR.render('layout', {
                    css: css,
                    template: "printRRIndScoreSheet",
                    data: dataJson
                });

                var options = {
                    "paperSize": {
                        "format": "A4",
                        "orientation": "landscape",
                        "margin": "1cm"
                    },
                    siteType: 'html'
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
    /*
    'printRRBlankIndDetailedDraws':async  function(data) {
        try {

            if (Meteor.isServer) 
            {
                var tournamentId = data.tournamentId;
                var eventName = data.eventName;

                var webshot = Meteor.npmRequire('webshot');
                var fs = Npm.require('fs');
                var Future = Npm.require('fibers/future');
                var fut = new Future();
                var fileName = "printRRBlankIndScoreSheet.pdf";
                var css = Assets.getText('printTeamDetailedDraws.css');
                SSR.compileTemplate('layout', Assets.getText('layout.html'));
                Template.layout.helpers({
                    getDocType: function() {
                        return "<!DOCTYPE html>";
                    }
                });

                SSR.compileTemplate('printRRIndScoreSheet', Assets.getText('printRRIndScoreSheet.html'));
                
                var tournamentName = "";
                var venueAddress = "";
                var domainName = "";
                var tourStartDate  = "";
                var tourEndDate  = "";
                var resultDraws = "";
                var groupName = "";

                var result = await Meteor.call("fetchIndDetailScores", data)
                try {
                    if (result) {
                        if(result.groupName)
                            groupName = result.groupName;
                        if(result.groupDetails)
                            resultDraws = result.groupDetails;
                    }
                }catch(e){};

                

                var tourInfo = events.findOne({"_id":tournamentId});
                if(tourInfo == undefined)
                    tourInfo = pastEvents.findOne({"_id":tournamentId});

                if(tourInfo)
                {
                    if(tourInfo.eventName)
                        tournamentName = tourInfo.eventName;
                    if(tourInfo.venueAddress)
                        venueAddress = tourInfo.venueAddress;
                    if(tourInfo.domainName)
                        domainName = tourInfo.domainName;
                    if(tourInfo.eventStartDate)
                        tourStartDate = tourInfo.eventStartDate;
                    if(tourInfo.eventEndDate)
                        tourEndDate = tourInfo.eventEndDate

                }

                var absoluteUrl = Meteor.absoluteUrl().toString();
                var absoluteUrlString = absoluteUrl.substring(0, absoluteUrl.lastIndexOf("/"));
                var imageURL = absoluteUrlString;

                var dbsrequired = ["userDetailsTT"];
                var dbName = undefined;

                var res2 =  Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
                if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
                {
                    dbName = res2.changedDbNames[0];                                 
                }



                Template.printRRIndScoreSheet.helpers({            
                    displayPlayerName:function(playerId)
                    {
                        try{
                            if(dbName != undefined)
                            {
                                userInfo = global[res2.changedDbNames[0]].findOne({
                                    "userId":playerId
                                })
                                if (userInfo.clubNameId) 
                                {
                                    var clubInfo = academyDetails.findOne({
                                        "userId": userInfo.clubNameId,
                                        "role": "Academy"
                                    });
                                    if(clubInfo)
                                    {
                                        userInfo["academyName"] = clubInfo.clubName;
                                    }
                                }
                                else if(userInfo.schoolId)
                                {
                                    var clubInfo = schoolDetails.findOne({
                                        "userId": userInfo.schoolId,
                                    });
                                    if(clubInfo&&clubInfo.schoolName)
                                        userInfo["academyName"] = clubInfo.schoolName;
                                }
                                if(userInfo && userInfo.userName)
                                {
                                    if(userInfo.academyName)
                                        academyName = " ("+userInfo.academyName.toString().substr(0, 3)+")";
                                    return userInfo.userName+""+academyName;                                          
                                }
                            }
                            else
                            {
                                var userInfo = Meteor.call("findDetailsUsersTeams",playerId)
                                if(userInfo)
                                {
                                    return userInfo.userName;
                                }
                            }
                            
                        }catch(e){

                        }
                    },                      
                });
                

                var dataJson = {};
                dataJson["tournamentName"] = tournamentName;
                dataJson["eventName"] = eventName;
                dataJson["venueAddress"] = venueAddress;
                dataJson["domainName"] = domainName;
                dataJson["tourStartDate"] = reverseDate(tourStartDate);
                dataJson["tourEndDate"] = reverseDate(tourEndDate);
                dataJson["fetchDetailScore"] = resultDraws
                dataJson["imageURL"] = imageURL;
                dataJson["groupName"] = groupName;
    

                var html_string = SSR.render('layout', {
                    css: css,
                    template: "printRRIndScoreSheet",
                    data: dataJson
                });

                var options = {
                    "paperSize": {
                        "format": "A4",
                        "orientation": "landscape",
                        "margin": "1cm"
                    },
                    siteType: 'html'
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

    },*/
    //printRRBlankIndDetailedDraws
    'printRRBlankIndDetailedDraws':async  function(data) {
        try {

            if (Meteor.isServer) 
            {
                var tournamentId = data.tournamentId;
                var eventName = data.eventName;

                var webshot = Meteor.npmRequire('webshot');
                var fs = Npm.require('fs');
                var Future = Npm.require('fibers/future');
                var fut = new Future();
                var fileName = "printRRBlankIndDetailedDraws.pdf";
                var css = Assets.getText('drawsStyle.css');
                SSR.compileTemplate('layout', Assets.getText('layout.html'));
                Template.layout.helpers({
                    getDocType: function() {
                        return "<!DOCTYPE html>";
                    }
                });

                SSR.compileTemplate('printRRBlankIndDetailedDraws', Assets.getText('printRRBlankIndDetailedDraws.html'));
                
                var tournamentName = "";
                var venueAddress = "";
                var domainName = "";
                var tourStartDate  = "";
                var tourEndDate  = "";
                var resultDraws = "";
                var groupName = "";

                var result = await Meteor.call("fetchIndDetailScores", data)
                try {
                    if (result) {
                        if(result.groupName)
                            groupName = result.groupName;
                        if(result.groupDetails)
                            resultDraws = result.groupDetails;
                    }
                }catch(e){};

                

                var tourInfo = events.findOne({"_id":tournamentId});
                if(tourInfo == undefined)
                    tourInfo = pastEvents.findOne({"_id":tournamentId});

                if(tourInfo)
                {
                    if(tourInfo.eventName)
                        tournamentName = tourInfo.eventName;
                    if(tourInfo.venueAddress)
                        venueAddress = tourInfo.venueAddress;
                    if(tourInfo.domainName)
                        domainName = tourInfo.domainName;
                    if(tourInfo.eventStartDate)
                        tourStartDate = tourInfo.eventStartDate;
                    if(tourInfo.eventEndDate)
                        tourEndDate = tourInfo.eventEndDate

                }

                var absoluteUrl = Meteor.absoluteUrl().toString();
                var absoluteUrlString = absoluteUrl.substring(0, absoluteUrl.lastIndexOf("/"));
                var imageURL = absoluteUrlString;

                var dbsrequired = ["userDetailsTT"];
                var dbName = undefined;

                var res2 =  Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
                if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
                {
                    dbName = res2.changedDbNames[0];                                 
                }


                Template.printRRBlankIndDetailedDraws.helpers({            
                    displayPlayerName:function(playerId)
                    {
                        try{
                            if(dbName != undefined)
                            {
                                userInfo = global[res2.changedDbNames[0]].findOne({
                                    "userId":playerId
                                })
                                if (userInfo && userInfo.clubNameId) 
                                {
                                    var clubInfo = academyDetails.findOne({
                                        "userId": userInfo.clubNameId,
                                        "role": "Academy"
                                    });
                                    if(clubInfo)
                                    {
                                        userInfo["academyName"] = clubInfo.clubName;
                                    }
                                }
                                else if(userInfo && userInfo.schoolId)
                                {
                                    var clubInfo = schoolDetails.findOne({
                                        "userId": userInfo.schoolId,
                                    });
                                    if(clubInfo&&clubInfo.schoolName)
                                        userInfo["academyName"] = clubInfo.schoolName;
                                }
                                if(userInfo && userInfo.userName)
                                {
                                    var academyName = "";
                                    if(userInfo.academyName)
                                        academyName = " ("+userInfo.academyName.toString().substr(0, 3)+")";
                                    return titleize(userInfo.userName)+""+academyName.toUpperCase();                                          
                                }
                            }
                            else
                            {
                                var userInfo = Meteor.call("findDetailsUsersTeams",playerId)
                                if(userInfo)
                                {
                                    return titleize(userInfo.userName);
                                }
                            }
                        }catch(e){

                        }
                    },                      
                });
                

                var dataJson = {};
                dataJson["tournamentName"] = tournamentName;
                dataJson["eventName"] = eventName;
                dataJson["venueAddress"] = venueAddress;
                dataJson["domainName"] = domainName;
                dataJson["tourStartDate"] = reverseDate(tourStartDate);
                dataJson["tourEndDate"] = reverseDate(tourEndDate);
                dataJson["fetchDetailScore"] = resultDraws
                dataJson["imageURL"] = imageURL;
                dataJson["groupName"] = groupName;
    

                var html_string = SSR.render('layout', {
                    css: css,
                    template: "printRRBlankIndDetailedDraws",
                    data: dataJson
                });

                var options = {
                    "paperSize": {
                        "format": "A4",
                        "orientation": "landscape",
                        "margin": "1cm"
                    },
                    siteType: 'html'
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
    'generate_scoreSheet_Individual_RR':async  function(tournamentId, eventName, tourType,groupNoVal) {
        try {

            if (Meteor.isServer) {

                var webshot = Meteor.npmRequire('webshot');
                var fs = Npm.require('fs');
                var Future = Npm.require('fibers/future');
                var fut = new Future();
                var fileName = "matchRecords-report.pdf";
                var css = Assets.getText('printTeamDetailedDraws.css');
                SSR.compileTemplate('printRRScoreSheet', Assets.getText('printRRScoreSheet.html'));
                var resultDraws = "";
                var result = await Meteor.call("getRoundRobinMatchRecords", tournamentId, eventName,groupNoVal)
                try {
                    if (result) {
                        resultDraws = result;
                    }
                }catch(e){}

                Template.printRRScoreSheet.helpers({
                    "imageURL": function() {
                        try {
                            var absoluteUrl = Meteor.absoluteUrl().toString();
                            var absoluteUrlString = absoluteUrl.substring(0, absoluteUrl.lastIndexOf("/"));
                            var imageURL = absoluteUrlString;
                            return imageURL;
                        } catch (E) {

                        }
                    },
                    "logoImg":function(){
                        var tourExists;
                        tourExists = events.findOne({
                                "tournamentEvent": true,
                                '_id': tournamentId
                            });
                        if(tourExists == undefined)
                        {
                            tourExists = pastEvents.findOne({
                                    "tournamentEvent": true,
                                    '_id': tournamentId
                                });                           
                        }

                        if(tourExists && tourExists.eventOrganizer)
                        {
                            eventOrganizer = tourExists.eventOrganizer;
                            var organizerInfo = Meteor.users.findOne({"userId":eventOrganizer});
                            if(organizerInfo) 
                            {
                                var apiInfo = apiUsers.findOne({"userId":eventOrganizer});
                                if(apiInfo && apiInfo.siteImg)
                                {
                                    return apiInfo.siteImg;
                                }
                           
                            }           
                        }
                        return "logo.png";

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
                    loopCount: function(count) {
                        var countArr = [];
                        for (var i = 1; i <= count; i++) {
                            countArr.push(i);
                        }
                        return countArr;
                    },
                    "drawsEventName": function() {
                        return eventName;
                    },
                    "getRoundRobinRecords": function() {
                        return resultDraws;
                    },
                    "orderPlayExists":function(data)
                    {
                        try{
                            if(data.orderPlay)                      
                                return "col-md-9 col-xs-9 col-sm-9 col-lg-9"                      
                            else                       
                                return "col-md-12 col-xs-12 col-sm-12 col-lg-12"
                        
                        }catch(e){
                        }
                    },
                    fetchRowMember: function(rowNumber, groupDetails) {
                        try {
                            var index = rowNumber + 1;
                            var xx = _.where(groupDetails, {
                                "rowNo": index
                            });
                            var response = "";
                            if (xx.length > 0) {
                                var toret = "userDetailsTT"

                                var usersMet = Meteor.users.findOne({
                                    userId: xx[0].playersID.playerAId
                                })

                                if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                                    var dbn = playerDBFind(usersMet.interestedProjectName[0])
                                    if (dbn) {
                                        toret = dbn
                                    }
                                }
                                var dbsrequired = ["userDetailsTT"]

                                var res2 =  Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
                                if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
                                {
                                    userInfo = global[res2.changedDbNames[0]].findOne({
                                      "userId":xx[0].playersID.playerAId
                                    })
                                    if (userInfo && userInfo.clubNameId) 
                                    {
                                        var clubInfo = academyDetails.findOne({
                                            "userId": userInfo.clubNameId,
                                            "role": "Academy"
                                        });
                                        if(clubInfo)
                                        {
                                            userInfo["academyName"] = clubInfo.clubName;

                                        }
                                    }
                                    else if(userInfo && userInfo.schoolId)
                                    {
                                        var clubInfo = schoolDetails.findOne({
                                            "userId": userInfo.schoolId,
                                        });
                                        if(clubInfo&&clubInfo.schoolName)
                                            userInfo["academyName"] = clubInfo.schoolName;
                                    }
                                    if(userInfo && userInfo.userName)
                                    {
                                        if(userInfo.academyName)
                                            academyName = " ("+userInfo.academyName.toString().substr(0, 3)+")";
                                        return titleize(userInfo.userName)+""+academyName.toUpperCase();                                          
                                    }
                                }

                                //var userInfo = global[toret].findOne({
                                    //"userId": xx[0].playersID.playerAId
                               // });
                                //if (userInfo)
                                    //return userInfo.userName;
                            }
                        } catch (e) {}
                    },
                    "fetchRowRecord": function(rowNumber, groupDetails, groupMaxSize) {
                        try {
                            var index = rowNumber + 1;
                            var xx = _.where(groupDetails, {
                                "rowNo": index
                            });
                            if (xx.length == 0) {
                                var arrJson = [];
                                for (var m = 0; m < groupMaxSize; m++) {
                                    var json = {};
                                    json.rowNo = index;
                                    json.colNo = m + 1;
                                    arrJson.push(json);
                                }
                                return arrJson;
                            } else {
                                if (xx.length != groupMaxSize) {
                                    var json = {};
                                    for (var m = xx.length; m < groupMaxSize; m++) {
                                        json.rowNo = index;
                                        json.colNo = m + 1;
                                        xx.push(json);
                                    }
                                }
                                return xx;

                            }
                        } catch (e) {}
                    },


                    "fetchRowPoints": function(rowNumber, groupDetails) {
                        try {
                            var index = rowNumber + 1;
                            var xx = _.where(groupDetails, {
                                "rowNo": index
                            });
                            if (xx.length > 0) {
                                return xx[0].points;
                            }
                            return xx;
                        } catch (e) {}
                    },
                    "fetchRowStandings": function(rowNumber, groupDetails) {
                        try {
                            var index = rowNumber + 1;
                            var xx = _.where(groupDetails, {
                                "rowNo": index
                            });
                            if (xx.length > 0) {
                                return xx[0].groupStanding;
                            }
                            return xx;
                        } catch (e) {}
                    },


                });
                Template.registerHelper('incremented', function(index) {
                    index++;
                    return index;
                });

                Template.registerHelper('compare', function(rowNo, colNo) {
                    if (rowNo == colNo)
                        return true;
                    else
                        return false;
                });

                Template.registerHelper('and', function(playerAId, playerBId) {
                    return playerAId && playerBId
                });

                SSR.compileTemplate('matchRecords_report', Assets.getText('printRRScoreSheet.html'));

                var html_string = SSR.render('printRRScoreSheet', {
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
    'generate_scoreSheet_Team_RR': async function(tournamentId, eventName, tourType,groupNoVal) {
        try {
            if (Meteor.isServer) {

                var webshot = Meteor.npmRequire('webshot');
                var fs = Npm.require('fs');
                var Future = Npm.require('fibers/future');
                var fut = new Future();
                var fileName = "matchRecords-report.pdf";
                var css = Assets.getText('printTeamDetailedDraws.css');
                SSR.compileTemplate('printRRTeamScoreSheet', Assets.getText('printRRTeamScoreSheet.html'));
                var resultDraws = "";
                var result = await Meteor.call("getRoundRobinMatchTeamRecords", tournamentId, eventName,groupNoVal)
                try {
                    if (result) {
                        resultDraws = result;
                    }
                }catch(e){}


                Template.printRRTeamScoreSheet.helpers({
                    "imageURL": function() {
                        try {
                            var absoluteUrl = Meteor.absoluteUrl().toString();
                            var absoluteUrlString = absoluteUrl.substring(0, absoluteUrl.lastIndexOf("/"));
                            var imageURL = absoluteUrlString;
                            return imageURL;
                        } catch (E) {

                        }
                    },
                    "logoImg":function(){
                        var tourExists;
                        tourExists = events.findOne({
                                "tournamentEvent": true,
                                '_id': tournamentId
                            });
                        if(tourExists == undefined)
                        {
                            tourExists = pastEvents.findOne({
                                    "tournamentEvent": true,
                                    '_id': tournamentId
                                });                           
                        }

                        if(tourExists && tourExists.eventOrganizer)
                        {
                            eventOrganizer = tourExists.eventOrganizer;
                            var organizerInfo = Meteor.users.findOne({"userId":eventOrganizer});
                            if(organizerInfo) 
                            {
                                var apiInfo = apiUsers.findOne({"userId":eventOrganizer});
                                if(apiInfo && apiInfo.siteImg)
                                {
                                    return apiInfo.siteImg;
                                }
                           
                            }           
                        }
                        return "logo.png";

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
                    
                    loopCount: function(count) {
                        var countArr = [];
                        for (var i = 1; i <= count; i++) {
                            countArr.push(i);
                        }
                        return countArr;
                    },
                    "drawsEventName": function() {
                        if(eventName != null)
                        {
                            var schoolEvents = schoolEventsToFind.findOne({});
                            if(schoolEvents && schoolEvents.teamEventNAME && schoolEvents.dispNamesTeam)
                            {
                                var indexPos = _.indexOf(schoolEvents.teamEventNAME,eventName);
                                if(indexPos > -1 && schoolEvents.dispNamesTeam[indexPos] != undefined)
                                    return schoolEvents.dispNamesTeam[indexPos];                        
                            }                         
                        }
                       
                        return eventName;
                    },
                    "getRoundRobinRecords": function() {
                        return resultDraws;
                    },
                   "orderPlayExists":function(data)
                    {
                        try{
                            if(data.orderPlay)                      
                                return "col-md-9 col-xs-9 col-sm-9 col-lg-9"                      
                            else                       
                                return "col-md-12 col-xs-12 col-sm-12 col-lg-12"
                        
                        }catch(e){
                        }
                    },
                    fetchRowMember: function(rowNumber, groupDetails) {
                        try {
                            var index = rowNumber + 1;
                            var xx = _.where(groupDetails, {
                                "rowNo": index
                            });
                            var response = "";
                            if (xx.length > 0) {

                                var dbsrequired = ["playerTeams"]

                                var res2 =  Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
                                if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
                                {
                                    userInfo = global[res2.changedDbNames[0]].findOne({
                                      "_id": xx[0].teamsID.teamAId
                                    })
                                    if(userInfo && userInfo.teamName)
                                        return userInfo.teamName;                                          
                                }


                               // var userInfo = playerTeams.findOne({
                                //    "_id": xx[0].teamsID.teamAId
                                //});
                                //if (userInfo)
                                   // return userInfo.teamName;
                            }
                        } catch (e) {}
                    },
                    "fetchRowRecord": function(rowNumber, groupDetails, groupMaxSize) {
                        try {
                            var index = rowNumber + 1;
                            var xx = _.where(groupDetails, {
                                "rowNo": index
                            });
                            if (xx.length == 0) {
                                var arrJson = [];
                                for (var m = 0; m < groupMaxSize; m++) {
                                    var json = {};
                                    json.rowNo = index;
                                    json.colNo = m + 1;
                                    arrJson.push(json);
                                }
                                return arrJson;
                            } else {
                                if (xx.length != groupMaxSize) {
                                    var json = {};
                                    for (var m = xx.length; m < groupMaxSize; m++) {
                                        json.rowNo = index;
                                        json.colNo = m + 1;
                                        xx.push(json);
                                    }
                                }
                                return xx;

                            }
                        } catch (e) {}
                    },


                    "fetchRowPoints": function(rowNumber, groupDetails) {
                        try {
                            var index = rowNumber + 1;
                            var xx = _.where(groupDetails, {
                                "rowNo": index
                            });
                            if (xx.length > 0) {
                                return xx[0].points;
                            }
                            return xx;
                        } catch (e) {}
                    },

                    "fetchRowStandings": function(rowNumber, groupDetails) {
                        try {
                            var index = rowNumber + 1;
                            var xx = _.where(groupDetails, {
                                "rowNo": index
                            });
                            if (xx.length > 0) {
                                return xx[0].groupStanding;
                            }
                            return xx;
                        } catch (e) {}
                    },


                });
                Template.registerHelper('incremented', function(index) {
                    index++;
                    return index;
                });

                Template.registerHelper('compare', function(rowNo, colNo) {
                    if (rowNo == colNo)
                        return true;
                    else
                        return false;
                });

                Template.registerHelper('and', function(playerAId, playerBId) {
                    return playerAId && playerBId
                });

                SSR.compileTemplate('matchRecords_report', Assets.getText('printRRTeamScoreSheet.html'));

                var html_string = SSR.render('printRRTeamScoreSheet', {
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
    'generate_blank_scoreSheet_RR': async function(tournamentId, eventName, tourType, groupId) {
        try {
            if (Meteor.isServer) {
                var webshot = Meteor.npmRequire('webshot');
                var fs = Npm.require('fs');
                var Future = Npm.require('fibers/future');
                var fut = new Future();
                var fileName = "matchRecords-report.pdf";
                var css = Assets.getText('printTeamDetailedDraws.css');
                SSR.compileTemplate('blankScoreSheet_RR', Assets.getText('blankScoreSheet_RR.html'));
                var resultDraws = "";

                var eventDetails = events.findOne({
                    "tournamentId": tournamentId.trim(),
                    "eventName": eventName.trim()
                });
                if (eventDetails == undefined)
                    eventDetails = pastEvents.findOne({
                        "tournamentId": tournamentId.trim(),
                        "eventName": eventName.trim()
                    });

                if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 1) {
                    var result = await Meteor.call("getRoundRobinMatchRecords", tournamentId, eventName)
                    try {
                        if (result) {
                            resultDraws = result;
                        }
                    }catch(e){}

                } else if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 2) {
                    var result = await Meteor.call("getRoundRobinMatchTeamRecords", tournamentId, eventName)
                    try {
                        if (result) {
                            resultDraws = result;
                        }
                    }catch(e){}
                }


                Template.blankScoreSheet_RR.helpers({
                    "imageURL": function() {
                        try {
                            var absoluteUrl = Meteor.absoluteUrl().toString();
                            var absoluteUrlString = absoluteUrl.substring(0, absoluteUrl.lastIndexOf("/"));
                            var imageURL = absoluteUrlString;

                            return imageURL;
                        } catch (E) {

                        }
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
                    loopCount: function(count) {
                        var countArr = [];
                        for (var i = 1; i <= count; i++) {
                            countArr.push(i);
                        }
                        return countArr;
                    },
                    "drawsEventName": function() {
                        return eventName;
                    },
                    "getRoundRobinRecords": function() {
                        return resultDraws;
                    },

                    "fetchRowRecord": function(rowNumber, groupDetails, groupMaxSize) {
                        try {
                            var index = rowNumber + 1;
                            var xx = _.where(groupDetails, {
                                "rowNo": index
                            });
                            if (xx.length == 0) {
                                var arrJson = [];
                                for (var m = 0; m < groupMaxSize; m++) {
                                    var json = {};
                                    json.rowNo = index;
                                    json.colNo = m + 1;
                                    arrJson.push(json);
                                }
                                return arrJson;
                            } else {
                                if (xx.length != groupMaxSize) {
                                    var json = {};
                                    for (var m = xx.length; m < groupMaxSize; m++) {
                                        json.rowNo = index;
                                        json.colNo = m + 1;
                                        xx.push(json);
                                    }
                                }
                                return xx;

                            }
                        } catch (e) {}
                    },


                    "fetchRowPoints": function(rowNumber, groupDetails) {
                        try {
                            var index = rowNumber + 1;
                            var xx = _.where(groupDetails, {
                                "rowNo": index
                            });
                            if (xx.length > 0) {
                                return xx[0].points;
                            }
                            return xx;
                        } catch (e) {}
                    },
                    "fetchRowStandings": function(rowNumber, groupDetails) {
                        try {
                            var index = rowNumber + 1;
                            var xx = _.where(groupDetails, {
                                "rowNo": index
                            });
                            if (xx.length > 0) {
                                return xx[0].groupStanding;
                            }
                            return xx;
                        } catch (e) {}
                    },


                });
                Template.registerHelper('incremented', function(index) {
                    index++;
                    return index;
                });

                Template.registerHelper('compare', function(rowNo, colNo) {
                    if (rowNo == colNo)
                        return true;
                    else
                        return false;
                });



                SSR.compileTemplate('matchRecords_report', Assets.getText('blankScoreSheet_RR.html'));

                var html_string = SSR.render('blankScoreSheet_RR', {
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
    'generate_certificate_RR': async function(tournamentId, eventName, playerID, player, eventType) {
        try {
            if (Meteor.isServer) {

                var webshot = Meteor.npmRequire('webshot');
                var fs = Npm.require('fs');
                var Future = Npm.require('fibers/future');
                var fut = new Future();
                var fileName = "matchRecords-report.pdf";
                var css = Assets.getText('style.css');


                // SSR.compileTemplate('matchRecords_report', Assets.getText('certificate_RR.html'));

                //SSR.compileTemplate('certificate_RR', Assets.getText('certificate_RR.html'));
                var tournamentInfo = "";
                var tournamentVenue = "";
                var tournamentAddress = "";
                var tournamentStartDate = "";
                var tournamentEndDate = "";
                var eventStartDate = "";
                var eventEndDate = "";
                var venue = "";
                var address = "";
                var sponsorLogo = "";
                var rank = "";
                var rankStatus = true;
                var tourExists = undefined;

                if (eventType == "past") {
                    tourExists = pastEvents.findOne({
                        "tournamentEvent": true,
                        '_id': tournamentId
                    });

                    if (pastEvents.findOne({
                            "tournamentEvent": true,
                            '_id': tournamentId
                        }).eventName)
                        tournamentInfo = pastEvents.findOne({
                            "tournamentEvent": true,
                            '_id': tournamentId
                        }).eventName;
                    if (pastEvents.findOne({
                            "tournamentEvent": true,
                            '_id': tournamentId
                        }).venueAddress)
                        tournamentVenue = pastEvents.findOne({
                            "tournamentEvent": true,
                            '_id': tournamentId
                        }).venueAddress;
                    if (pastEvents.findOne({
                            "tournamentEvent": true,
                            '_id': tournamentId
                        }).domainName)
                        tournamentAddress = pastEvents.findOne({
                            "tournamentEvent": true,
                            '_id': tournamentId
                        }).domainName;
                    if (pastEvents.findOne({
                            "tournamentEvent": true,
                            '_id': tournamentId
                        }).eventStartDate)
                        tournamentStartDate = pastEvents.findOne({
                            "tournamentEvent": true,
                            '_id': tournamentId
                        }).eventStartDate;
                    if (pastEvents.findOne({
                            "tournamentEvent": true,
                            '_id': tournamentId
                        }).eventEndDate)
                        tournamentEndDate = pastEvents.findOne({
                            "tournamentEvent": true,
                            '_id': tournamentId
                        }).eventEndDate;
                    if (pastEvents.findOne({
                            "eventName": eventName,
                            "tournamentEvent": false,
                            'tournamentId': tournamentId
                        }).eventStartDate)
                        eventStartDate = pastEvents.findOne({
                            "eventName": eventName,
                            "tournamentEvent": false,
                            'tournamentId': tournamentId
                        }).eventStartDate;
                    if (pastEvents.findOne({
                            "eventName": eventName,
                            "tournamentEvent": false,
                            'tournamentId': tournamentId
                        }).eventEndDate)
                        eventEndDate = pastEvents.findOne({
                            "eventName": eventName,
                            "tournamentEvent": false,
                            'tournamentId': tournamentId
                        }).eventEndDate;
                    if (pastEvents.findOne({
                            "eventName": eventName,
                            "tournamentEvent": false,
                            'tournamentId': tournamentId
                        }).venueAddress)
                        venue = pastEvents.findOne({
                            "eventName": eventName,
                            "tournamentEvent": false,
                            'tournamentId': tournamentId
                        }).venueAddress;
                    if (pastEvents.findOne({
                            "eventName": eventName,
                            "tournamentEvent": false,
                            'tournamentId': tournamentId
                        }).domainName)
                        address = pastEvents.findOne({
                            "eventName": eventName,
                            "tournamentEvent": false,
                            'tournamentId': tournamentId
                        }).domainName;
                    if (pastEvents.findOne({
                            "eventName": eventName,
                            "tournamentEvent": false,
                            'tournamentId': tournamentId
                        }).sponsorLogo)
                        sponsorLogo = pastEvents.findOne({
                            "eventName": eventName,
                            "tournamentEvent": false,
                            'tournamentId': tournamentId
                        }).sponsorLogo;
                } else {
                    tourExists = events.findOne({
                        "tournamentEvent": true,
                        '_id': tournamentId
                    });
                    if (events.findOne({
                            "tournamentEvent": true,
                            '_id': tournamentId
                        }).eventName)
                        tournamentInfo = events.findOne({
                            "tournamentEvent": true,
                            '_id': tournamentId
                        }).eventName;
                    if (events.findOne({
                            "tournamentEvent": true,
                            '_id': tournamentId
                        }).venueAddress)
                        tournamentVenue = events.findOne({
                            "tournamentEvent": true,
                            '_id': tournamentId
                        }).venueAddress;
                    if (events.findOne({
                            "tournamentEvent": true,
                            '_id': tournamentId
                        }).domainName)
                        tournamentAddress = events.findOne({
                            "tournamentEvent": true,
                            '_id': tournamentId
                        }).domainName;
                    if (events.findOne({
                            "tournamentEvent": true,
                            '_id': tournamentId
                        }).eventStartDate)
                        tournamentStartDate = events.findOne({
                            "tournamentEvent": true,
                            '_id': tournamentId
                        }).eventStartDate;
                    if (events.findOne({
                            "tournamentEvent": true,
                            '_id': tournamentId
                        }).eventEndDate)
                        tournamentEndDate = events.findOne({
                            "tournamentEvent": true,
                            '_id': tournamentId
                        }).eventEndDate;
                    if (events.findOne({
                            "eventName": eventName,
                            "tournamentEvent": false,
                            'tournamentId': tournamentId
                        }).eventStartDate)
                        eventStartDate = events.findOne({
                            "eventName": eventName,
                            "tournamentEvent": false,
                            'tournamentId': tournamentId
                        }).eventStartDate;
                    if (events.findOne({
                            "eventName": eventName,
                            "tournamentEvent": false,
                            'tournamentId': tournamentId
                        }).eventEndDate)
                        eventEndDate = events.findOne({
                            "eventName": eventName,
                            "tournamentEvent": false,
                            'tournamentId': tournamentId
                        }).eventEndDate;
                    if (events.findOne({
                            "eventName": eventName,
                            "tournamentEvent": false,
                            'tournamentId': tournamentId
                        }).venueAddress)
                        venue = events.findOne({
                            "eventName": eventName,
                            "tournamentEvent": false,
                            'tournamentId': tournamentId
                        }).venueAddress;
                    if (events.findOne({
                            "eventName": eventName,
                            "tournamentEvent": false,
                            'tournamentId': tournamentId
                        }).domainName)
                        address = events.findOne({
                            "eventName": eventName,
                            "tournamentEvent": false,
                            'tournamentId': tournamentId
                        }).domainName;
                    if (events.findOne({
                            "eventName": eventName,
                            "tournamentEvent": false,
                            'tournamentId': tournamentId
                        }).sponsorLogo)
                        sponsorLogo = events.findOne({
                            "eventName": eventName,
                            "tournamentEvent": false,
                            'tournamentId': tournamentId
                        }).sponsorLogo;
                }

                var eventDetails = events.findOne({
                    "tournamentId": tournamentId.trim(),
                    "eventName": eventName.trim()
                });
                if (eventDetails == undefined)
                    eventDetails = pastEvents.findOne({
                        "tournamentId": tournamentId.trim(),
                        "eventName": eventName.trim()
                    });

                if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 1) {
                    var checkRankInfo = roundRobinEvents.findOne({
                        "tournamentId": tournamentId,
                        "eventName": eventName,
                        "groupStandingInfo.playerId": playerID
                    }, {
                        fields: {
                            _id: 0,
                            groupStandingInfo: {
                                $elemMatch: {
                                    "playerId": playerID
                                }
                            }
                        }
                    });

                    if (checkRankInfo) {
                        if (checkRankInfo.groupStandingInfo && checkRankInfo.groupStandingInfo.length > 0) {
                            if (checkRankInfo.groupStandingInfo[0].groupStanding) {
                                rank = checkRankInfo.groupStandingInfo[0].groupStanding;
                            }

                        }
                    }
                } else if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 2) {
                    var checkRankInfo = roundRobinTeamEvents.findOne({
                        "tournamentId": tournamentId,
                        "eventName": eventName,
                        "groupStandingInfo.teamId": playerID
                    }, {
                        fields: {
                            _id: 0,
                            groupStandingInfo: {
                                $elemMatch: {
                                    "teamId": playerID
                                }
                            }
                        }
                    });
                    if (checkRankInfo) {
                        if (checkRankInfo.groupStandingInfo && checkRankInfo.groupStandingInfo.length > 0) {
                            if (checkRankInfo.groupStandingInfo[0].groupStanding) {
                                rank = checkRankInfo.groupStandingInfo[0].groupStanding;
                            }

                        }
                    }
                }

                if (rank == "")
                    rankStatus = false;


                var sponsorLogoURL = eventUploads.find({
                    "_id": sponsorLogo
                }).fetch();
                var absoluteUrl = Meteor.absoluteUrl().toString();
                var absoluteUrlString = absoluteUrl.substring(0, absoluteUrl.lastIndexOf("/"));
                

                if(eventName != null)
                {
                    var schoolEvents = schoolEventsToFind.findOne({});
                    if(schoolEvents && schoolEvents.teamEventNAME && schoolEvents.dispNamesTeam)
                    {
                        var indexPos = _.indexOf(schoolEvents.teamEventNAME,eventName);
                        if(indexPos > -1 && schoolEvents.dispNamesTeam[indexPos] != undefined)
                            eventName = schoolEvents.dispNamesTeam[indexPos];                        
                    }                         
                }


                var data = {
                    player: player,
                    eventName: eventName,
                    eventStartDate: reverseDate(eventStartDate),
                    eventEndDate: reverseDate(eventEndDate),
                    venue: venue,
                    address: address,
                    tournamentName: tournamentInfo,
                    tournamentVenue: tournamentVenue,
                    tournamentAddress: tournamentAddress,
                    tournamentStartDate: reverseDate(tournamentStartDate),
                    tournamentEndDate: reverseDate(tournamentEndDate),
                    imageURL: absoluteUrlString,
                    sponsorLogoURL: sponsorLogoURL,
                    "rankStatus": rankStatus,
                    "rank": rank
                }

                 var dob = undefined;
                var userInfo = Meteor.users.findOne({"userId":playerID});
                if(userInfo)
                {
                    playerName = userInfo.userName;
                    var dbsrequired = ["userDetailsTT"];

                    var res = await Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
                    if (res && res && res.changedDbNames && res.changedDbNames.length) 
                    {
                        var detailInfo = global[res.changedDbNames[0]].findOne({
                            "userId": playerID 
                        })
                        if(detailInfo && detailInfo.dateOfBirth)
                        {
                            dob = moment(new Date(detailInfo.dateOfBirth)).format("DD MMM YYYY")
                        }

                    }

                }
                if(tourExists.eventOrganizer)
                {
                    eventOrganizer = tourExists.eventOrganizer;
                    var organizerInfo = Meteor.users.findOne({"userId":eventOrganizer});
                    if(organizerInfo) 
                    {
                        data["organizer"] = organizerInfo.userName.toUpperCase();                       
                        var apiInfo = apiUsers.findOne({"userId":eventOrganizer});
                        if(apiInfo && apiInfo.siteImg)
                            data["siteImg"] = apiInfo.siteImg;
                        //else
                          //  data["siteImg"] = "logo.png"

                        //data["siteImg"] = "logo.png"
                    }  
                
                }
                if(dob != undefined)
                {
                    data["playerDOB"] = dob;
                }


                SSR.compileTemplate('certificate_RR', Assets.getText('certificate_RR.html'));
                var html_string = SSR.render('certificate_RR', data);



                // Setup Webshot options
                var options = {
                    "paperSize": {
                        "format": "A4",
                        "orientation": "landscape",
                        "margin": "1cm"
                    },
                    siteType: 'html'
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
    },
    'individualResultsOfRR':async function(tournamentId, eventName, comments) {
        try {
            var resultJson = {};
            var resultRecord = [];

            var roundRobinEventsInfo = roundRobinEvents.find({
                "tournamentId": tournamentId,
                "eventName": eventName
            }, {
                sort: {
                    groupNumber: 1
                }
            }).fetch();


            if (roundRobinEventsInfo) {
                var existsWinner = roundRobinEvents.find({
                    "tournamentId": tournamentId,
                    "eventName": eventName,
                    groupStandingInfo: {
                        $elemMatch: {
                            groupStanding: {
                                $in: [null, "", 0]
                            },
                        }
                    }
                }).fetch();

                if (existsWinner.length > 0) {
                    resultJson["status"] = "failure";
                    resultJson["message"] = "Incomplete match!!"
                } else {
                    var resultSet = [];


                    for (var i = 0; i < roundRobinEventsInfo.length; i++) {
                        var resultData = {};
                        var standingArr = [];
                        var scoreDetailArr = [];
                        resultData["groupName"] = roundRobinEventsInfo[i].groupName;

                        var standingInfo = roundRobinEvents.aggregate([{
                            $match: {
                                "groupName": roundRobinEventsInfo[i].groupName,
                                "tournamentId": tournamentId,
                                "eventName": eventName
                            }
                        }, {
                            $unwind: "$groupStandingInfo"
                        }, {
                            $sort: {
                                "groupStandingInfo.groupStanding": 1
                            }
                        }, {
                            $group: {
                                "_id": "$_id",
                                "tournamentId": {
                                    "$first": "$tournamentId"
                                },
                                "eventName": {
                                    "$first": "$eventName"
                                },
                                "groupNumber": {
                                    "$first": "$groupNumber"
                                },
                                "groupName": {
                                    "$first": "$groupName"
                                },
                                "groupMaxSize": {
                                    "$first": "$groupMaxSize"
                                },
                                "groupDetails": {
                                    "$first": "$groupDetails"
                                },
                                "groupStandingInfo": {
                                    $push: "$groupStandingInfo"
                                }
                            }
                        }]);
                        if (standingInfo.length > 0) {
                            for (var k = 0; k < standingInfo[0].groupStandingInfo.length; k++) {
                                var standInfo = standingInfo[0].groupStandingInfo[k];
                                var rank = standInfo.groupStanding;
                                var playerName = "";
                                if (standInfo.playerId) {
                                    var toret = "userDetailsTT"

                                    var usersMet = Meteor.users.findOne({
                                        userId: standInfo.playerId
                                    })

                                    if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                                        var dbn = playerDBFind(usersMet.interestedProjectName[0])
                                        if (dbn) {
                                            toret = dbn
                                        }
                                    }

                                    var dbsrequired = ["userDetailsTT"];
                                    var userInfo;

                                    var res2 = await Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
                                    if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
                                    {
                                        userInfo = global[res2.changedDbNames[0]].findOne({
                                            "userId": standInfo.playerId
                                        })


                                                                          
                                    }

                                   // //var userInfo = global[toret].findOne({
                                        //"userId": standInfo.playerId
                                    //});
                                    if (userInfo)
                                        playerName = userInfo.userName;
                                    var standingJson = {};
                                    standingJson["rank"] = rank;
                                    standingJson["playerName"] = playerName;

                                    standingArr.push(standingJson);
                                    var teamDeta = roundRobinEvents.aggregate([{
                                        $match: {
                                            "tournamentId": tournamentId,
                                            "eventName": eventName,
                                            "groupName": roundRobinEventsInfo[i].groupName,
                                            "groupDetails.rowNo": standInfo.rowNo,
                                        }
                                    }, {
                                        $unwind: "$groupDetails"
                                    }, {
                                        $match: {
                                            "groupDetails.rowNo": standInfo.rowNo,
                                            "groupDetails.status": {
                                                $ne: "invalid"
                                            }

                                        }
                                    }, {
                                        $group: {
                                            _id: "$_id",
                                            "groupDetails": {
                                                $push: "$groupDetails"
                                            }
                                        }
                                    }, {
                                        $project: {
                                            "groupDetails": 1,
                                            "_id": 1
                                        }
                                    }])

                                    if (teamDeta) {
                                        if (teamDeta.length > 0) {
                                            var scoreDetailJson = {};
                                            scoreDetailJson["firstPlayer"] = playerName;
                                            var groupDetailsInfo = teamDeta[0].groupDetails;
                                            var scoreInfoArr = [];
                                            for (var x = 0; x < groupDetailsInfo.length; x++) {
                                                var scoreInfo = "";
                                                var playerAWin;
                                                var playerBWin;
                                                if (standInfo.playerId == groupDetailsInfo[x].playersID.playerAId) {
                                                    playerAWin = parseInt(groupDetailsInfo[x].setWins.playerA);
                                                    playerBWin = parseInt(groupDetailsInfo[x].setWins.playerB);
                                                    if (playerAWin == 0 && playerBWin == 0)
                                                        scoreInfo += "Yet to play";
                                                    else if (playerAWin > playerBWin)
                                                        scoreInfo += "Defeated ";
                                                    else if (playerBWin > playerAWin)
                                                        scoreInfo += "Lost to ";
                                                    else if (playerAWin == playerBWin && playerAWin != 0 && playerBWin != 0)
                                                        scoreInfo += "Tie up with ";
                                                }


                                                if (!(playerAWin == 0 && playerBWin == 0)) {
                                                    var loserName = "";

                                                    var toret = "userDetailsTT"

                                                    var usersMet = Meteor.users.findOne({
                                                        userId: groupDetailsInfo[x].playersID.playerBId
                                                    })

                                                    if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                                                        var dbn = playerDBFind(usersMet.interestedProjectName[0])
                                                        if (dbn) {
                                                            toret = dbn
                                                        }
                                                    }
                                                    var dbsrequired = ["userDetailsTT"];
                                                    var userInfo;

                                                    var res2 = await Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
                                                    if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
                                                    {
                                                        userInfo = global[res2.changedDbNames[0]].findOne({
                                                            "userId": groupDetailsInfo[x].playersID.playerBId
                                                        })


                                                                                          
                                                    }
                                                    //var userInfo = global[toret].findOne({
                                                    //    "userId": groupDetailsInfo[x].playersID.playerBId
                                                    //});
                                                    if (userInfo)
                                                        loserName = userInfo.userName;
                                                    scoreInfo += loserName + " ";

                                                    for (var m = 0; m < groupDetailsInfo[x].scores.setScoresA.length; m++) {
                                                        if (!(groupDetailsInfo[x].scores.setScoresA[m] == '0' && groupDetailsInfo[x].scores.setScoresB[m] == '0')) {
                                                            if (m != 0)
                                                                scoreInfo += ", ";
                                                            scoreInfo += groupDetailsInfo[x].scores.setScoresA[m] + "-" + groupDetailsInfo[x].scores.setScoresB[m];
                                                        }

                                                    }
                                                    scoreInfoArr.push(scoreInfo);
                                                } else
                                                    scoreInfoArr.push(scoreInfo);




                                            }
                                            scoreDetailJson["matchresults"] = scoreInfoArr;
                                            scoreDetailArr.push(scoreDetailJson);

                                        }
                                    }
                                }

                            }
                            resultData["standings"] = standingArr;
                            resultData["matchresults"] = scoreDetailArr;

                        }

                        resultSet.push(resultData);

                    }

                    var tourInfo;
                    var eventInfo;
                    var tournamentName = "";
                    var sponsorLogoData = "";
                    var tournamentVenue = "";
                    var tournamentAddress = "";
                    var tournamentStartDate = "";
                    var tournamentEndDate = "";
                    tourInfo = events.findOne({
                        "tournamentEvent": true,
                        "_id": tournamentId
                    });
                    if (tourInfo)
                        tournamentName = tourInfo.eventName;
                    else {
                        tourInfo = pastEvents.findOne({
                            "tournamentEvent": true,
                            "_id": tournamentId
                        });
                        if (tourInfo)
                            tournamentName = tourInfo.eventName;
                    }

                    if (tourInfo) {
                        if (tourInfo.venueAddress)
                            tournamentVenue = tourInfo.venueAddress;
                        if (tourInfo.domainName)
                            tournamentAddress = tourInfo.domainName;
                        if (tourInfo.eventStartDate)
                            tournamentStartDate = tourInfo.eventStartDate;
                        if (tourInfo.eventEndDate)
                            tournamentEndDate = tourInfo.eventEndDate;
                    }


                    var eventInfo = events.findOne({
                        "eventName": eventName,
                        "tournamentEvent": false,
                        'tournamentId': tournamentId
                    })
                    if (eventInfo == undefined) {
                        eventInfo = pastEvents.findOne({
                            "eventName": eventName,
                            tournamentId: tournamentId
                        })
                    }

                    if (eventInfo && eventInfo.sponsorLogo) {
                        sponsorLogo = eventInfo.sponsorLogo
                        var sponsorLogoURL = eventUploads.findOne({
                            "_id": sponsorLogo
                        });
                        if (sponsorLogoURL) {
                            sponsorLogoData = sponsorLogoURL
                        }

                    }

                    var imageURL = "";
                    var absoluteUrl = Meteor.absoluteUrl().toString();
                    var absoluteUrlString = absoluteUrl.substring(0, absoluteUrl.lastIndexOf("/"));
                    imageURL = absoluteUrlString;


                    var data = {
                        "tournamentName": tournamentName,
                        "eventName": eventName,
                        "tournamentVenue": tournamentVenue,
                        "tournamentAddress": tournamentAddress,
                        "tournamentStartDate": tournamentStartDate,
                        "tournamentEndDate": tournamentEndDate,
                        "sponsorLogoData": sponsorLogoData,
                        "imageURL": imageURL,
                        "resultSet": resultSet
                    }
                    SSR.compileTemplate('individual_RoundRobinResults', Assets.getText('individual_RoundRobinResults.html'));
                    var html_string = SSR.render('individual_RoundRobinResults', data);


                    var raw = otherUsers.rawCollection();
                    var distinct = Meteor.wrapAsync(raw.distinct, raw);
                    var toList = distinct('emailAddress', {
                        "role": "Journalist"
                    });
                    //toList = ["shalini.krishnan90@gmail.com"]

                    for (var b = 0; b < toList.length; b++) {
                        var options = {
                            from: "iplayon.in@gmail.com",
                            to: toList[b],
                            subject: "iPlayOn:Results ",
                            html: comments + " " + html_string
                        }

                        try {

                            Meteor.call("sendShareEmail", options, function(e, re) {

                                if (re) {} else {

                                }

                            });
                            resultJson["status"] = "success";
                            resultJson["message"] = "Mail Sent!!"

                        } catch (e) {
                            resultJson["status"] = "success";
                            resultJson["message"] = "Could not send mail!!"
                        }

                    }


                }
            } else {
                resultJson["status"] = "failure";
                resultJson["message"] = "Could not find draws!!"
            }
            return resultJson;



        } catch (e) {}
    },
    'teamResultsOfRR': async function(tournamentId, eventName, comments) {
        try {
            var resultJson = {};
            var resultRecord = [];

            var roundRobinEventsInfo = roundRobinTeamEvents.find({
                "tournamentId": tournamentId,
                "eventName": eventName
            }, {
                sort: {
                    groupNumber: 1
                }
            }).fetch();


            if (roundRobinEventsInfo) {
                var existsWinner = roundRobinTeamEvents.find({
                    "tournamentId": tournamentId,
                    "eventName": eventName,
                    groupStandingInfo: {
                        $elemMatch: {
                            groupStanding: {
                                $in: [null, "", 0]
                            },
                        }
                    }
                }).fetch();

                if (existsWinner.length > 0) {
                    resultJson["status"] = "failure";
                    resultJson["message"] = "Incomplete match!!"
                } else {
                    var resultSet = [];


                    for (var i = 0; i < roundRobinEventsInfo.length; i++) {
                        var resultData = {};
                        var standingArr = [];
                        var scoreDetailArr = [];
                        resultData["groupName"] = roundRobinEventsInfo[i].groupName;

                        var standingInfo = roundRobinTeamEvents.aggregate([{
                            $match: {
                                "groupName": roundRobinEventsInfo[i].groupName,
                                "tournamentId": tournamentId,
                                "eventName": eventName
                            }
                        }, {
                            $unwind: "$groupStandingInfo"
                        }, {
                            $sort: {
                                "groupStandingInfo.groupStanding": 1
                            }
                        }, {
                            $group: {
                                "_id": "$_id",
                                "tournamentId": {
                                    "$first": "$tournamentId"
                                },
                                "eventName": {
                                    "$first": "$eventName"
                                },
                                "groupNumber": {
                                    "$first": "$groupNumber"
                                },
                                "groupName": {
                                    "$first": "$groupName"
                                },
                                "groupMaxSize": {
                                    "$first": "$groupMaxSize"
                                },
                                "groupDetails": {
                                    "$first": "$groupDetails"
                                },
                                "groupStandingInfo": {
                                    $push: "$groupStandingInfo"
                                }
                            }
                        }]);
                        if (standingInfo.length > 0) {
                            for (var k = 0; k < standingInfo[0].groupStandingInfo.length; k++) {
                                var standInfo = standingInfo[0].groupStandingInfo[k];
                                var rank = standInfo.groupStanding;
                                var playerName = "";
                                if (standInfo.teamId) 
                                {
                                    var dbsrequired = ["playerTeams"];
                                    var userInfo;

                                    var res2 = await Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
                                    if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
                                    {
                                        userInfo = global[res2.changedDbNames[0]].findOne({
                                            "_id": standInfo.teamId
                                        })                                                                               
                                    }

                                    //var userInfo = playerTeams.findOne({
                                    //    "_id": standInfo.teamId
                                    //});
                                    if (userInfo)
                                        playerName = userInfo.teamName;
                                    var standingJson = {};
                                    standingJson["rank"] = rank;
                                    standingJson["playerName"] = playerName;

                                    standingArr.push(standingJson);
                                    var teamDeta = roundRobinTeamEvents.aggregate([{
                                        $match: {
                                            "tournamentId": tournamentId,
                                            "eventName": eventName,
                                            "groupName": roundRobinEventsInfo[i].groupName,
                                            "groupDetails.rowNo": standInfo.rowNo,
                                        }
                                    }, {
                                        $unwind: "$groupDetails"
                                    }, {
                                        $match: {
                                            "groupDetails.rowNo": standInfo.rowNo,
                                            "groupDetails.status": {
                                                $ne: "invalid"
                                            }

                                        }
                                    }, {
                                        $group: {
                                            _id: "$_id",
                                            "groupDetails": {
                                                $push: "$groupDetails"
                                            }
                                        }
                                    }, {
                                        $project: {
                                            "groupDetails": 1,
                                            "_id": 1
                                        }
                                    }])

                                    if (teamDeta) {
                                        if (teamDeta.length > 0) {
                                            var scoreDetailJson = {};
                                            scoreDetailJson["firstPlayer"] = playerName;
                                            var groupDetailsInfo = teamDeta[0].groupDetails;
                                            var scoreInfoArr = [];
                                            var finalScoreInfoArr = [];
                                            for (var x = 0; x < groupDetailsInfo.length; x++) {
                                                var scoreInfo = "";
                                                var playerAWin;
                                                var playerBWin;
                                                if (standInfo.teamId == groupDetailsInfo[x].teamsID.teamAId) {
                                                    playerAWin = parseInt(groupDetailsInfo[x].setWins.teamA);
                                                    playerBWin = parseInt(groupDetailsInfo[x].setWins.teamB);

                                                    if (playerAWin == 0 && playerBWin == 0) {
                                                        scoreInfo += "Yet to play with ";
                                                        var loserName = "";
                                                        var dbsrequired = ["playerTeams"];
                                                        var userInfo;

                                                        var res2 = await Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
                                                        if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
                                                        {
                                                            userInfo = global[res2.changedDbNames[0]].findOne({
                                                                "_id": groupDetailsInfo[x].teamsID.teamBId
                                                            })                                                                               
                                                        }
                                                        //var userInfo = playerTeams.findOne({
                                                          //  "_id": groupDetailsInfo[x].teamsID.teamBId
                                                        //});
                                                        if (userInfo)
                                                            loserName = userInfo.teamName;
                                                        scoreInfo += loserName + " ";
                                                    } else if (playerAWin > playerBWin)
                                                        scoreInfo += "Defeated ";
                                                    else if (playerBWin > playerAWin)
                                                        scoreInfo += "Lost to ";
                                                    else if (playerAWin == playerBWin && playerAWin != 0 && playerBWin != 0)
                                                        scoreInfo += "Tie up with ";
                                                }


                                                if (!(playerAWin == 0 && playerBWin == 0)) {
                                                    var loserName = "";

                                                    var dbsrequired = ["playerTeams"];
                                                    var userInfo;

                                                    var res2 = await Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
                                                    if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
                                                    {
                                                        userInfo = global[res2.changedDbNames[0]].findOne({
                                                            "_id": groupDetailsInfo[x].teamsID.teamBId
                                                        })                                                                               
                                                    }
                                                    //var userInfo = playerTeams.findOne({
                                                    //    "_id": groupDetailsInfo[x].teamsID.teamBId
                                                    //});
                                                    if (userInfo)
                                                        loserName = userInfo.teamName;
                                                    scoreInfo += loserName + " ";

                                                    for (var m = 0; m < groupDetailsInfo[x].scores.setScoresA.length; m++) {
                                                        if (!(groupDetailsInfo[x].scores.setScoresA[m] == '0' && groupDetailsInfo[x].scores.setScoresB[m] == '0')) {
                                                            if (m != 0)
                                                                scoreInfo += ", ";
                                                            scoreInfo += groupDetailsInfo[x].scores.setScoresA[m] + "-" + groupDetailsInfo[x].scores.setScoresB[m];
                                                        }

                                                    }
                                                    scoreInfoArr.push(scoreInfo);

                                                } else
                                                    scoreInfoArr.push(scoreInfo);




                                                var result = await Meteor.call("resultsOfteamDetailedScoresOfRR", tournamentId, eventName, groupDetailsInfo[x].teamsID.teamAId, groupDetailsInfo[x].teamsID.teamBId)
                                                try {
                                                    if (result) {
                                                        var detailInfo = {};
                                                        detailInfo = result;
                                                        detailInfo["scoreInfo"] = scoreInfo;
                                                        finalScoreInfoArr.push(detailInfo);

                                                    } else if (result == false || result == undefined) {
                                                        var detailInfo = {};
                                                        detailInfo["scoreInfo"] = scoreInfo;
                                                        finalScoreInfoArr.push(detailInfo);
                                                    }

                                                }catch(e){

                                                }



                                            }
                                            //var matchJson = {};
                                            //matchJson["versusInfo"] = scoreInfoArr
                                            scoreDetailJson["matchresults"] = finalScoreInfoArr;


                                            scoreDetailArr.push(scoreDetailJson);

                                        }
                                    }
                                }

                            }
                            resultData["standings"] = standingArr;
                            resultData["matchresults"] = scoreDetailArr;

                        }

                        resultSet.push(resultData);

                    }

                    var tourInfo;
                    var eventInfo;
                    var tournamentName = "";
                    var sponsorLogoData = "";
                    var tournamentVenue = "";
                    var tournamentAddress = "";
                    var tournamentStartDate = "";
                    var tournamentEndDate = "";
                    tourInfo = events.findOne({
                        "tournamentEvent": true,
                        "_id": tournamentId
                    });
                    if (tourInfo)
                        tournamentName = tourInfo.eventName;
                    else {
                        tourInfo = pastEvents.findOne({
                            "tournamentEvent": true,
                            "_id": tournamentId
                        });
                        if (tourInfo)
                            tournamentName = tourInfo.eventName;
                    }

                    if (tourInfo) {
                        if (tourInfo.venueAddress)
                            tournamentVenue = tourInfo.venueAddress;
                        if (tourInfo.domainName)
                            tournamentAddress = tourInfo.domainName;
                        if (tourInfo.eventStartDate)
                            tournamentStartDate = tourInfo.eventStartDate;
                        if (tourInfo.eventEndDate)
                            tournamentEndDate = tourInfo.eventEndDate;
                    }


                    var eventInfo = events.findOne({
                        "eventName": eventName,
                        "tournamentEvent": false,
                        'tournamentId': tournamentId
                    })
                    if (eventInfo == undefined) {
                        eventInfo = pastEvents.findOne({
                            "eventName": eventName,
                            tournamentId: tournamentId
                        })
                    }

                    if (eventInfo && eventInfo.sponsorLogo) {
                        sponsorLogo = eventInfo.sponsorLogo
                        var sponsorLogoURL = eventUploads.findOne({
                            "_id": sponsorLogo
                        });
                        if (sponsorLogoURL) {
                            sponsorLogoData = sponsorLogoURL
                        }

                    }

                    var imageURL = "";
                    var absoluteUrl = Meteor.absoluteUrl().toString();
                    var absoluteUrlString = absoluteUrl.substring(0, absoluteUrl.lastIndexOf("/"));
                    imageURL = absoluteUrlString;


                    var data = {
                        "tournamentName": tournamentName,
                        "eventName": eventName,
                        "tournamentVenue": tournamentVenue,
                        "tournamentAddress": tournamentAddress,
                        "tournamentStartDate": tournamentStartDate,
                        "tournamentEndDate": tournamentEndDate,
                        "sponsorLogoData": sponsorLogoData,
                        "imageURL": imageURL,
                        "resultSet": resultSet
                    }
                    SSR.compileTemplate('team_RoundRobinResults', Assets.getText('team_RoundRobinResults.html'));
                    var html_string = SSR.render('team_RoundRobinResults', data);



                    var raw = otherUsers.rawCollection();
                    var distinct = Meteor.wrapAsync(raw.distinct, raw);
                    var toList = distinct('emailAddress', {
                        "role": "Journalist"
                    });
                    for (var b = 0; b < toList.length; b++) {
                        var options = {
                            from: "iplayon.in@gmail.com",
                            to: toList[b],
                            subject: "iPlayOn:Results ",
                            html: comments + " " + html_string
                        }

                        try {

                            Meteor.call("sendShareEmail", options, function(e, re) {

                                if (re) {} else {

                                }

                            });
                            resultJson["status"] = "success";
                            resultJson["message"] = "Mail Sent!!"

                        } catch (e) {
                            resultJson["status"] = "success";
                            resultJson["message"] = "Could not send mail!!"
                        }

                    }




                }
            } else {
                resultJson["status"] = "failure";
                resultJson["message"] = "Could not find draws!!"
            }

            return resultJson;

        } catch (e) {

        }
    },

    "resultsOfteamDetailedScoresOfRR": function(tournamentId, eventName, teamAId, teamBId) {
        try {
            var rounds = [];
            var playerInfo = "";
            var teamFinalWinner = "";
            var teamInfo = []
            var data = {}


            var teamDETScores = teamRRDetailScore.aggregate([{
                $match: {
                    tournamentId: tournamentId,
                    eventName: eventName
                }
            }, {
                $unwind: "$teamDetailScore"
            }, {
                $match: {
                    "teamDetailScore.teamAID": teamAId,
                    "teamDetailScore.teamBID": teamBId
                }
            }, {
                $project: {
                    teamDetailScore: "$teamDetailScore"
                }
            }]);


            //get the detailed scores
            if (teamDETScores && teamDETScores[0] && teamDETScores[0].teamDetailScore) {
                var details = teamDETScores[0].teamDetailScore;
                var matchAVSXPlayer = "";
                var matchBVsYPlayer = "";
                var matchBVsXPlayer = "";
                var matchAVsYPlayer = "";
                var matchDoubles = "";

                //details of match a vs x
                if (details.matchAVSX) {
                    var scores = "";
                    var playerdetAVSX = details.matchAVSX;
                    if (playerdetAVSX.matchType) {
                        if (playerdetAVSX.winnerIdPlayer && playerdetAVSX.winnerIdPlayer != "1") {
                            var playerWinId;
                            var playerLosId
                            if (playerdetAVSX.winnerIdPlayer == playerdetAVSX.playerAID) {
                                playerWinId = playerdetAVSX.playerAID
                                playerLosId = playerdetAVSX.playerBID
                            } else if (playerdetAVSX.winnerIdPlayer == playerdetAVSX.playerBID) {
                                playerWinId = playerdetAVSX.playerBID
                                playerLosId = playerdetAVSX.playerAID
                            }

                            if (playerWinId && playerLosId) {
                                var playerWINName;
                                var playerLOSName;

                                var playerWINName = Meteor.users.findOne({
                                    userId: playerWinId
                                }).userName
                                var playerLOSName = Meteor.users.findOne({
                                    userId: playerLosId
                                }).userName



                                if (playerdetAVSX.matchType.toLowerCase() == "bye" || playerdetAVSX.matchType.toLowerCase() == "walkover") {
                                    if (playerWINName) {
                                        matchAVSXPlayer = playerWINName + " qualified via " + playerdetAVSX.matchType.toLowerCase();
                                    }
                                    if (playerWINName && playerLOSName) {
                                        matchAVSXPlayer = playerWINName + " qualified via " + playerdetAVSX.matchType.toLowerCase() + " against " + playerLOSName
                                    }
                                }



                                //if status is completed
                                else if (playerdetAVSX.matchType.toLowerCase() == "completed") {
                                    if (playerWINName) {
                                        matchAVSXPlayer = playerWINName + " won by"
                                    }
                                    if (playerWINName && playerLOSName) {
                                        matchAVSXPlayer = playerWINName + " defeated " + playerLOSName + " by "
                                    }

                                    var setAs = playerdetAVSX.setScoresA
                                    var setBs = playerdetAVSX.setScoresB
                                    var scores = "";

                                    if (setAs && setBs) {
                                        if (playerdetAVSX.winnerIdPlayer == playerdetAVSX.playerAID) {
                                            for (var k = 0; k < setAs.length; k++) {
                                                var setA = setAs;
                                                var setB = setBs;
                                                if (parseInt(setA[k]) == 0 && parseInt(setB[k]) == 0) {

                                                } else {
                                                    scores = scores + setA[k] + "-" + setB[k] + " "
                                                }
                                            }
                                        } else if (playerdetAVSX.winnerIdPlayer == playerdetAVSX.playerBID) {
                                            for (var k = 0; k < setBs.length; k++) {
                                                var setA = setAs;
                                                var setB = setBs;
                                                if (parseInt(setA[k]) == 0 && parseInt(setB[k]) == 0) {

                                                } else {
                                                    scores = scores + setB[k] + "-" + setA[k] + " "
                                                }
                                            }
                                        }

                                        matchAVSXPlayer = matchAVSXPlayer + scores

                                    }
                                }

                                if (matchAVSXPlayer && matchAVSXPlayer.trim().length != 0)
                                    matchAVSXPlayer = matchAVSXPlayer;

                            }
                        } else {
                            var playerAName = Meteor.users.findOne({
                                userId: playerdetAVSX.playerAID
                            }).userName
                            var playerBName = Meteor.users.findOne({
                                userId: playerdetAVSX.playerBID
                            }).userName


                            if (playerdetAVSX.matchType.toLowerCase() == "notplayed") {

                                matchAVSXPlayer = playerAName + " yet to play with " + playerBName;

                            }
                        }

                    }
                }

                //details of match b vs y
                if (details.matchBVsY) {
                    var scores = "";
                    var playerdetBVsY = details.matchBVsY
                    if (playerdetBVsY.matchType) {
                        if (playerdetBVsY.winnerIdPlayer && playerdetBVsY.winnerIdPlayer != "1") {
                            var playerWinId;
                            var playerLosId
                            if (playerdetBVsY.winnerIdPlayer == playerdetBVsY.playerAID) {
                                playerWinId = playerdetBVsY.playerAID
                                playerLosId = playerdetBVsY.playerBID
                            } else if (playerdetBVsY.winnerIdPlayer == playerdetBVsY.playerBID) {
                                playerWinId = playerdetBVsY.playerBID
                                playerLosId = playerdetBVsY.playerAID
                            }

                            if (playerWinId && playerLosId) {
                                var playerWINName;
                                var playerLOSName;

                                var playerWINName = Meteor.users.findOne({
                                    userId: playerWinId
                                }).userName;

                                var playerLOSName = Meteor.users.findOne({
                                    userId: playerLosId
                                }).userName

                                //if status if bye
                                if (playerdetBVsY.matchType.toLowerCase() == "bye") {
                                    if (playerWINName)
                                        matchBVsYPlayer = playerWINName + " qualified via bye"

                                    if (playerWINName && playerLOSName)
                                        matchBVsYPlayer = playerWINName + " qualified via bye against " + playerLOSName

                                }

                                //if status if walkover
                                else if (playerdetBVsY.matchType.toLowerCase() == "walkover") {
                                    if (playerWINName)
                                        matchBVsYPlayer = playerWINName + " qualified via walkover"

                                    if (playerWINName && playerLOSName)
                                        matchBVsYPlayer = playerWINName + " qualified via walkover against " + playerLOSName
                                }

                                //if status is completed
                                else if (playerdetBVsY.matchType.toLowerCase() == "completed") {
                                    if (playerWINName)
                                        matchBVsYPlayer = playerWINName + " won by"

                                    if (playerWINName && playerLOSName)
                                        matchBVsYPlayer = playerWINName + " defeated " + playerLOSName + " by "


                                    var setAs = playerdetBVsY.setScoresA
                                    var setBs = playerdetBVsY.setScoresB

                                    if (setAs && setBs) {
                                        if (playerdetBVsY.winnerIdPlayer == playerdetBVsY.playerAID) {
                                            for (var k = 0; k < setAs.length; k++) {
                                                var setA = setAs;
                                                var setB = setBs;
                                                if (parseInt(setA[k]) == 0 && parseInt(setB[k]) == 0) {

                                                } else {
                                                    scores = scores + setA[k] + "-" + setB[k] + " "
                                                }
                                            }
                                        } else if (playerdetBVsY.winnerIdPlayer == playerdetBVsY.playerBID) {
                                            for (var k = 0; k < setBs.length; k++) {
                                                var setA = setAs;
                                                var setB = setBs;
                                                if (parseInt(setA[k]) == 0 && parseInt(setB[k]) == 0) {

                                                } else {
                                                    scores = scores + setB[k] + "-" + setA[k] + " "
                                                }
                                            }
                                        }

                                        matchBVsYPlayer = matchBVsYPlayer + scores

                                    }
                                }


                                if (matchBVsYPlayer && matchBVsYPlayer.trim().length != 0)
                                    matchBVsYPlayer = matchBVsYPlayer;

                            }
                        } else {

                            var playerAName = Meteor.users.findOne({
                                userId: playerdetBVsY.playerAID
                            }).userName
                            var playerBName = Meteor.users.findOne({
                                userId: playerdetBVsY.playerBID
                            }).userName


                            if (playerdetBVsY.matchType.toLowerCase() == "notplayed") {

                                matchBVsYPlayer = playerAName + " yet to play with " + playerBName;

                            }
                        }

                    }
                }

                //details of doubles 
                if (details.matchDoubles) {
                    var scores = "";
                    var playerdetmatchDoubles = details.matchDoubles
                    if (playerdetmatchDoubles.matchType) {
                        if (playerdetmatchDoubles.winnerD1PlayerId && playerdetmatchDoubles.winnerD1PlayerId != "1" &&
                            playerdetmatchDoubles.winnerD2PlayerId && playerdetmatchDoubles.winnerD2PlayerId != "1") {
                            var playerWinId1;
                            var playerWinId2;
                            var playerLosId1;
                            var playerLosId2;


                            if (playerdetmatchDoubles.winnerD1PlayerId == playerdetmatchDoubles.teamAD1PlayerId &&
                                playerdetmatchDoubles.winnerD2PlayerId == playerdetmatchDoubles.teamAD2PlayerId) {
                                playerWinId1 = playerdetmatchDoubles.teamAD1PlayerId
                                playerWinId2 = playerdetmatchDoubles.teamAD2PlayerId

                                playerLosId1 = playerdetmatchDoubles.teamBD1PlayerId
                                playerLosId2 = playerdetmatchDoubles.teamBD2PlayerId

                            } else if (playerdetmatchDoubles.winnerD1PlayerId == playerdetmatchDoubles.teamBD1PlayerId &&
                                playerdetmatchDoubles.winnerD2PlayerId == playerdetmatchDoubles.teamBD2PlayerId) {
                                playerWinId1 = playerdetmatchDoubles.teamBD1PlayerId
                                playerWinId2 = playerdetmatchDoubles.teamBD2PlayerId

                                playerLosId1 = playerdetmatchDoubles.teamAD1PlayerId
                                playerLosId2 = playerdetmatchDoubles.teamAD2PlayerId
                            }


                            if (playerWinId1 && playerWinId2 && playerLosId1 && playerWinId2 && playerLosId2) {
                                var playerWINName = "";
                                var playerLOSName = "";

                                var playerWINName = Meteor.users.findOne({
                                    userId: playerWinId1
                                }).userName

                                playerWINName = playerWINName + "," + Meteor.users.findOne({
                                    userId: playerWinId2
                                }).userName

                                var playerLOSName = Meteor.users.findOne({
                                    userId: playerLosId1
                                }).userName

                                playerLOSName = playerLOSName + "," + Meteor.users.findOne({
                                    userId: playerLosId2
                                }).userName

                                //if status if bye
                                if (playerdetmatchDoubles.matchType.toLowerCase() == "bye") {
                                    if (playerWINName)
                                        matchDoubles = playerWINName + " qualified via bye"

                                    if (playerWINName && playerLOSName)
                                        matchDoubles = playerWINName + " qualified via bye against " + playerLOSName

                                }

                                //if status if walkover
                                else if (playerdetmatchDoubles.matchType.toLowerCase() == "walkover") {
                                    if (playerWINName)
                                        matchDoubles = playerWINName + " qualified via walkover"

                                    if (playerWINName && playerLOSName)
                                        matchDoubles = playerWINName + " qualified via walkover against " + playerLOSName

                                }

                                //if status is completed
                                else if (playerdetmatchDoubles.matchType.toLowerCase() == "completed") {
                                    if (playerWINName)
                                        matchDoubles = playerWINName + " won by"

                                    if (playerWINName && playerLOSName)
                                        matchDoubles = playerWINName + " defeated " + playerLOSName + " by "


                                    var setAs = playerdetmatchDoubles.setScoresA
                                    var setBs = playerdetmatchDoubles.setScoresB

                                    if (setAs && setBs) {
                                        if (playerdetmatchDoubles.winnerD1PlayerId == playerdetmatchDoubles.teamAD1PlayerId &&
                                            playerdetmatchDoubles.winnerD2PlayerId == playerdetmatchDoubles.teamAD2PlayerId) {
                                            for (var k = 0; k < setAs.length; k++) {
                                                var setA = setAs;
                                                var setB = setBs;
                                                if (parseInt(setA[k]) == 0 && parseInt(setB[k]) == 0) {

                                                } else {
                                                    scores = scores + setA[k] + "-" + setB[k] + " "
                                                }
                                            }
                                        } else if (playerdetmatchDoubles.winnerD1PlayerId == playerdetmatchDoubles.teamBD1PlayerId &&
                                            playerdetmatchDoubles.winnerD2PlayerId == playerdetmatchDoubles.teamBD2PlayerId) {
                                            for (var k = 0; k < setBs.length; k++) {
                                                var setA = setAs;
                                                var setB = setBs;
                                                if (parseInt(setA[k]) == 0 && parseInt(setB[k]) == 0) {

                                                } else {
                                                    scores = scores + setB[k] + "-" + setA[k] + " "
                                                }
                                            }
                                        }

                                        matchDoubles = matchDoubles + scores

                                    }
                                }

                                if (matchDoubles && matchDoubles.trim().length != 0)
                                    matchDoubles = matchDoubles;

                            }
                        } else {

                            var teamAplayer1Name = Meteor.users.findOne({
                                userId: playerdetmatchDoubles.teamAD1PlayerId
                            }).userName;

                            var teamAplayer2Name = Meteor.users.findOne({
                                userId: playerdetmatchDoubles.teamAD2PlayerId
                            }).userName;

                            var teamBplayer1Name = Meteor.users.findOne({
                                userId: playerdetmatchDoubles.teamBD1PlayerId
                            }).userName;

                            var teamBplayer2Name = Meteor.users.findOne({
                                userId: playerdetmatchDoubles.teamBD2PlayerId
                            }).userName;


                            if (playerdetmatchDoubles.matchType.toLowerCase() == "notplayed") {

                                matchDoubles = teamAplayer1Name + "," + teamAplayer2Name + " yet to play with " + teamBplayer1Name + "," + teamBplayer2Name;

                            }
                        }

                    }
                }

                //details of BVsX
                if (details.matchBVsX) {
                    var scores = "";
                    var playerdetBVsX = details.matchBVsX
                    if (playerdetBVsX.matchType) {
                        if (playerdetBVsX.winnerIdPlayer && playerdetBVsX.winnerIdPlayer != "1") {
                            var playerWinId;
                            var playerLosId
                            if (playerdetBVsX.winnerIdPlayer == playerdetBVsX.playerAID) {
                                playerWinId = playerdetBVsX.playerAID;
                                playerLosId = playerdetBVsX.playerBID;
                            } else if (playerdetBVsX.winnerIdPlayer == playerdetBVsX.playerBID) {
                                //choose winner based on id
                                playerWinId = playerdetBVsX.playerBID
                                playerLosId = playerdetBVsX.playerAID
                            }

                            if (playerWinId && playerLosId) {
                                var playerWINName;
                                var playerLOSName;

                                var playerWINName = Meteor.users.findOne({
                                    userId: playerWinId
                                }).userName;

                                var playerLOSName = Meteor.users.findOne({
                                    userId: playerLosId
                                }).userName;

                                //if status if bye
                                if (playerdetBVsX.matchType.toLowerCase() == "bye") {
                                    if (playerWINName)
                                        matchBVsXPlayer = playerWINName + " qualified via bye"

                                    if (playerWINName && playerLOSName)
                                        matchBVsXPlayer = playerWINName + " qualified via bye against " + playerLOSName;
                                }

                                //if status if walkover
                                else if (playerdetBVsX.matchType.toLowerCase() == "walkover") {
                                    if (playerWINName)
                                        matchBVsXPlayer = playerWINName + " qualified via walkover"

                                    if (playerWINName && playerLOSName)
                                        matchBVsXPlayer = playerWINName + " qualified via walkover against " + playerLOSName;
                                }

                                //if status is completed
                                else if (playerdetBVsX.matchType.toLowerCase() == "completed") {
                                    if (playerWINName)
                                        matchBVsXPlayer = playerWINName + " won by"

                                    if (playerWINName && playerLOSName)
                                        matchBVsXPlayer = playerWINName + " defeated " + playerLOSName + " by "


                                    var setAs = playerdetBVsX.setScoresA
                                    var setBs = playerdetBVsX.setScoresB

                                    if (setAs && setBs) {
                                        if (playerdetBVsX.winnerIdPlayer == playerdetBVsX.playerAID) {
                                            for (var k = 0; k < setAs.length; k++) {
                                                var setA = setAs;
                                                var setB = setBs;
                                                if (parseInt(setA[k]) == 0 && parseInt(setB[k]) == 0) {

                                                } else {
                                                    scores = scores + setA[k] + "-" + setB[k] + " "
                                                }
                                            }
                                        } else if (playerdetBVsX.winnerIdPlayer == playerdetBVsX.playerBID) {
                                            for (var k = 0; k < setBs.length; k++) {
                                                var setA = setAs;
                                                var setB = setBs;
                                                if (parseInt(setA[k]) == 0 && parseInt(setB[k]) == 0) {

                                                } else {
                                                    scores = scores + setB[k] + "-" + setA[k] + " "
                                                }
                                            }
                                        }

                                        matchBVsXPlayer = matchBVsXPlayer + scores

                                    }
                                }

                                if (matchBVsXPlayer && matchBVsXPlayer.trim().length != 0)
                                    matchBVsXPlayer = matchBVsXPlayer;

                            }
                        } else {

                            var playerAName = Meteor.users.findOne({
                                userId: playerdetBVsX.playerAID
                            }).userName
                            var playerBName = Meteor.users.findOne({
                                userId: playerdetBVsX.playerBID
                            }).userName


                            if (playerdetBVsX.matchType.toLowerCase() == "notplayed") {

                                matchBVsXPlayer = playerAName + " yet to play with " + playerBName;

                            }
                        }

                    }
                }

                //details of AVsY
                if (details.matchAVsY) {
                    var scores = "";
                    var playerdetAVsY = details.matchAVsY
                    if (playerdetAVsY.matchType) {
                        if (playerdetAVsY.winnerIdPlayer && playerdetAVsY.winnerIdPlayer != "1") {
                            var playerWinId;
                            var playerLosId
                            if (playerdetAVsY.winnerIdPlayer == playerdetAVsY.playerAID) {
                                playerWinId = playerdetAVsY.playerAID
                                playerLosId = playerdetAVsY.playerBID
                            } else if (playerdetAVsY.winnerIdPlayer == playerdetAVsY.playerBID) {
                                playerWinId = playerdetAVsY.playerBID
                                playerLosId = playerdetAVsY.playerAID
                            }

                            if (playerWinId && playerLosId) {
                                var playerWINName;
                                var playerLOSName;

                                var playerWINName = Meteor.users.findOne({
                                    userId: playerWinId
                                }).userName;

                                var playerLOSName = Meteor.users.findOne({
                                    userId: playerLosId
                                }).userName;

                                //if status if bye
                                if (playerdetAVsY.matchType.toLowerCase() == "bye") {
                                    if (playerWINName)
                                        matchAVsYPlayer = playerWINName + " qualified via bye"

                                    if (playerWINName && playerLOSName)
                                        matchAVsYPlayer = playerWINName + " qualified via bye against " + playerLOSName

                                }

                                //if status if walkover
                                else if (playerdetAVsY.matchType.toLowerCase() == "walkover") {
                                    if (playerWINName)
                                        matchAVsYPlayer = playerWINName + " qualified via walkover"

                                    if (playerWINName && playerLOSName)
                                        matchAVsYPlayer = playerWINName + " qualified via walkover against " + playerLOSName

                                }

                                //if status is completed
                                else if (playerdetAVsY.matchType.toLowerCase() == "completed") {
                                    if (playerWINName)
                                        matchAVsYPlayer = playerWINName + " won by"

                                    if (playerWINName && playerLOSName)
                                        matchAVsYPlayer = playerWINName + " defeated " + playerLOSName + " by "


                                    var setAs = playerdetAVsY.setScoresA
                                    var setBs = playerdetAVsY.setScoresB

                                    if (setAs && setBs) {
                                        if (playerdetAVsY.winnerIdPlayer == playerdetAVsY.playerAID) {
                                            for (var k = 0; k < setAs.length; k++) {
                                                var setA = setAs;
                                                var setB = setBs;
                                                if (parseInt(setA[k]) == 0 && parseInt(setB[k]) == 0) {

                                                } else {
                                                    scores = scores + setA[k] + "-" + setB[k] + " "
                                                }
                                            }
                                        } else if (playerdetAVsY.winnerIdPlayer == playerdetAVsY.playerBID) {
                                            for (var k = 0; k < setBs.length; k++) {
                                                var setA = setAs;
                                                var setB = setBs;
                                                if (parseInt(setA[k]) == 0 && parseInt(setB[k]) == 0) {

                                                } else {
                                                    scores = scores + setB[k] + "-" + setA[k] + " "
                                                }
                                            }
                                        }

                                        matchAVsYPlayer = matchAVsYPlayer + scores
                                    }
                                }

                                if (matchAVsYPlayer && matchAVsYPlayer.trim().length != 0)
                                    matchAVsYPlayer = matchAVsYPlayer;

                            }
                        } else {

                            var playerAName = Meteor.users.findOne({
                                userId: playerdetAVsY.playerAID
                            }).userName
                            var playerBName = Meteor.users.findOne({
                                userId: playerdetAVsY.playerBID
                            }).userName


                            if (playerdetAVsY.matchType.toLowerCase() == "notplayed") {

                                matchAVsYPlayer = playerAName + " yet to play with " + playerBName;

                            }
                        }

                    }
                }


                var matchAVSX = matchAVSXPlayer;
                var matchBVsY = matchBVsYPlayer;
                var matchDoubles = matchDoubles;
                var matchBVsX = matchBVsXPlayer;
                var matchAVsY = matchAVsYPlayer;

                teamDE = {
                    matchAVSX: matchAVSX,
                    matchBVsY: matchBVsY,
                    matchDoubles: matchDoubles,
                    matchBVsX: matchBVsX,
                    matchAVsY: matchAVsY,
                }

                return teamDE;

            } else
                return false;



        } catch (e) {

        }
    },
    "getGroupMatchRecords":async function(tournamentId,groupID)
    {
        try{
            var successJson = succesData();
            var failureJson = failureData();
            var tourInfo = tourExists(tournamentId);
            if(tourInfo)
            {
                var type = "singles";
                var drawInfo = roundRobinEvents.findOne({"_id":groupID});
                if(drawInfo == undefined){
                    drawInfo = roundRobinTeamEvents.findOne({"_id":groupID});
                    if(drawInfo)
                        type = "team";
                }

                if(drawInfo && drawInfo.groupMaxSize)
                {
                    var drawSet = await groupSet(drawInfo.groupMaxSize);
                    var lookUpDB = "roundRobinEvents";
                    if(type == "team")
                        lookUpDB = "roundRobinTeamEvents";

                    var teamDeta = global[lookUpDB].aggregate([{
                        $match: {
                            "tournamentId": tournamentId,
                            "_id":groupID
                        }}, 
                        {$unwind: "$groupDetails"}, 
                        {$match: {
                            "groupDetails.status": {$ne: "invalid"}

                        }}, 
                        {$group: {
                            _id: "$_id",
                            "tournamentId":{$first:"$tournamentId"},
                            "eventName":{$first:"$eventName"},
                            "groupNumber":{$first:"$groupNumber"},
                            "groupName":{$first:"$groupName"},
                            "groupMaxSize":{$first:"$groupMaxSize"},
                            "groupDetails": {$push: "$groupDetails"},
                            "groupStandingInfo":{$push:"$groupStandingInfo"}
                        }}, 
                        {$project: {
                            "_id": 1,
                            "tournamentId":1,"eventName":1,
                            "groupNumber":1,"groupName":1,
                            "groupMaxSize":1,"groupDetails": 1,
                            "groupStandingInfo":1
                   
                        }}
                    ]);



                    var matchRecords =  _.filter(teamDeta[0].groupDetails, function(a){
                        return _.find(drawSet, function(b){
                            return (b.rowNo === a.rowNo && b.colNo === a.colNo);
                        });
                    });

                   


                   if(teamDeta && teamDeta.length > 0)
                   {
                        updatedMatchRecords = await matchRecords.reduce(async (r, e) =>{

                            var generalInfo = {
                                "groupNumber": teamDeta[0].groupNumber, 
                                "groupName": teamDeta[0].groupName,
                                "groupMaxSize":teamDeta[0].groupMaxSize,
                            }

                            var updated = _.extend(e, generalInfo);
                            if(type == "team")
                            {

                                    const matchScore = await Meteor.call("fetchTeamDetailScore", tournamentId, teamDeta[0].eventName, e)
                                    if (matchScore) 
                                    {
                                        if(matchScore.status == "success" && matchScore.specifications)
                                        {
                                            _.extend (updated,{"specifications":matchScore.specifications});
                                            _.extend (updated,{"teamMatchType":matchScore.teamMatchType});
                                            _.extend (updated,{"finalTeamWinner":matchScore.finalTeamWinner});


                                        }

                                    }
                                
                            }
                           
                            (await r).push(updated);

                            return r;



  
                        }, []);


                        successJson["data"] = updatedMatchRecords;
                        successJson["type"] = type;
                        return successJson

                   }
                   else
                   {
                        failureJson["message"] = "";
                        return failureJson
                   }
              



                 



                }
                else
                {
                    failureJson["message"] = "Invalid group";
                }
            }
            else
            {
                failureJson["message"] = invalidTourMsg;
                return failureJson;
            }
        }catch(e){
            errorLog(e);
            failureJson["message"] = e;
            return failureJson;
        }
    },

    "groupWiseScoreSheet":async function(data)
    {
        try{
             if (Meteor.isServer) {

                var tournamentId = data.tournamentId;
                var eventName = data.eventName;
                var webshot = Meteor.npmRequire('webshot');
                var fs = Npm.require('fs');
                var Future = Npm.require('fibers/future');
                var fut = new Future();
                var fileName = "matchRecords-report.pdf";
                var css = Assets.getText('printTeamDetailedDraws.css');
                SSR.compileTemplate('groupWiseScoreSheet_RR', Assets.getText('groupWiseScoreSheet_RR.html'));
                var resultDraws = [];
                var type = "";

                var result = await Meteor.call("getGroupMatchRecords", data.tournamentId,data.groupID)
                try {
                    if (result) {
                        if(result.status && result.status == "success")
                        {
                            if(result.data)
                                resultDraws = result.data;
                            if(result.type)
                                type = result.type;
                        }
                    }
                }catch(e){}

                var dbsrequired = ["userDetailsTT"];
                var dbName = undefined;

                var res2 =  Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
                if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
                {
                    dbName = res2.changedDbNames[0];                                 
                }

                Template.groupWiseScoreSheet_RR.helpers({
                    "imageURL": function() {
                        try {
                            var absoluteUrl = Meteor.absoluteUrl().toString();
                            var absoluteUrlString = absoluteUrl.substring(0, absoluteUrl.lastIndexOf("/"));
                            var imageURL = absoluteUrlString;
                            return imageURL;
                        } catch (E) {

                        }
                    },
                    "logoImg":function(){
                        var tourInfo = tourExists(tournamentId);
                        if(tourInfo && tourInfo.eventOrganizer)
                        {
                            eventOrganizer = tourInfo.eventOrganizer;
                            var organizerInfo = Meteor.users.findOne({"userId":eventOrganizer});
                            if(organizerInfo) 
                            {
                                var apiInfo = apiUsers.findOne({"userId":eventOrganizer});
                                if(apiInfo && apiInfo.siteImg)
                                {
                                    return apiInfo.siteImg;
                                }
                           
                            }           
                        }
                        return "logo.png";

                    },
                    tournamentName_team: function() {
                        try {
                            var tourInfo = tourExists(tournamentId);
                            if(tourInfo && tourInfo.eventName)
                                return tourInfo.eventName
                            
                        } catch (e) {}
                    },
                    venueAddress_team: function() {
                        try {
                            var tourInfo = tourExists(tournamentId);
                            if(tourInfo && tourInfo.venueAddress)
                                return tourInfo.venueAddress;
                        } catch (e) {}
                    },
                    domainName_team: function() {
                        try {
                            var tourInfo = tourExists(tournamentId);
                            if(tourInfo && tourInfo.domainName)
                                return tourInfo.domainName;                    
                        } catch (e) {}
                    },
                    eventDate_team: function() {
                        try {
                            var tourInfo = tourExists(tournamentId)
                            if (tourInfo && tourInfo.eventStartDate && tourInfo.eventEndDate)
                                return reverseDate(tourInfo.eventStartDate) + " - " + reverseDate(tourInfo.eventEndDate);
                        } catch (e) {}
                    },
                    loopCount: function(count) {
                        var countArr = [];
                        for (var i = 1; i <= count; i++) {
                            countArr.push(i);
                        }
                        return countArr;
                    },
                    "drawsEventName": function() {
                        return eventName;
                    },
                    "type":function(){
                        if(type == "singles")
                            return true;
                    },
                    "scoreType":function(){
                        if(data.type && data.type == "scoresheet")
                            return true;
                    },
                    "fetchDetailScore": function() {
                        return resultDraws;
                    },
                    "orderPlayExists":function(data)
                    {
                        try{
                            if(data.orderPlay)                      
                                return "col-md-9 col-xs-9 col-sm-9 col-lg-9"                      
                            else                       
                                return "col-md-12 col-xs-12 col-sm-12 col-lg-12"
                        
                        }catch(e){
                        }
                    },
                     displayPlayerName:function(playerId)
                    {
                        try{

                            if(dbName != undefined)
                            {
                                userInfo = global[res2.changedDbNames[0]].findOne({
                                    "userId":playerId
                                })
                                if (userInfo && userInfo.clubNameId) 
                                {
                                    var clubInfo = academyDetails.findOne({
                                        "userId": userInfo.clubNameId,
                                        "role": "Academy"
                                    });
                                    if(clubInfo)
                                    {
                                        userInfo["academyName"] = clubInfo.clubName;
                                    }
                                }
                                else if(userInfo && userInfo.schoolId)
                                {
                                    var clubInfo = schoolDetails.findOne({
                                        "userId": userInfo.schoolId,
                                    });
                                    if(clubInfo&&clubInfo.schoolName)
                                        userInfo["academyName"] = clubInfo.schoolName;
                                }
                                if(userInfo && userInfo.userName)
                                {
                                    var academyName = "";
                                    if(userInfo.academyName)
                                        academyName = " ("+userInfo.academyName.toString().substr(0, 3)+")";
                                    return titleCase(userInfo.userName)+""+academyName.toUpperCase();                                          
                                }
                            }
                            else
                            {
                                var userInfo = Meteor.call("findDetailsUsersTeams",playerId)
                                if(userInfo)
                                {
                                    return titleize(userInfo.userName);
                                }
                            }
                        }catch(e){
                            errorLog(e)
                        }
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
                                return titleCase(userInfo.userName);                         
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
                                    return titleCase(userInfo.userName);                         
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
                                    return titleCase(userInfo1.userName+" , "+userInfo2.userName);                        
                                }

                            }
                        }   
                    },
                   
                    "setTeamWinner":function(finalTeamWinner){
                        try{
                            
                                if(tournamentId != undefined && tournamentId != null)
                                {
                                    var dbsrequired = ["playerTeams"]
                                    var res2 =  Meteor.call('changeDbNameForDraws', tournamentId, dbsrequired)
                                    if (res2 && res2 && res2.changedDbNames && res2.changedDbNames.length) 
                                    {
                                        teamInfo = global[res2.changedDbNames[0]].findOne({
                                            "_id": finalTeamWinner
                                        })
                                        if(teamInfo && teamInfo.teamName)
                                            return teamInfo.teamName;
                                                                                           
                                    }
                                }
                                else
                                {
                                    var teamName = playerTeams.findOne({
                                        "_id": finalTeamWinner
                                    });
                                    if (teamName) {
                                        var teamDet = teamName
                                        if (teamDet && teamDet.teamName) {
                                            return teamDet.teamName;
                                        }
                                    }
                                }
                            
                            
                        }catch(e){

                            errorLog("team winner exception : "+e)

                        } 
                    }

                });
                Template.registerHelper('incremented', function(index) {
                    index++;
                    return index;
                });

                Template.registerHelper('compare', function(rowNo, colNo) {
                    if (rowNo == colNo)
                        return true;
                    else
                        return false;
                });

                Template.registerHelper('and', function(playerAId, playerBId) {
                    return playerAId && playerBId
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

                SSR.compileTemplate('matchRecords_report', Assets.getText('groupWiseScoreSheet_RR.html'));

                var html_string = SSR.render('groupWiseScoreSheet_RR', {
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

        }catch(e){

            errorLog(e)

        }
    }


})


async function groupSet(groupMem)
{


    var mem = Array(groupMem).fill(0);
    var matches = [];

    _.each(mem, function(p,index) {
     var row = index + 1;
     var column = index + 2;
     _.range(column, mem.length+1).forEach((current, index, range) => {
        matches.push({"rowNo":row,"colNo":current});
    })

    });
    return matches;

}