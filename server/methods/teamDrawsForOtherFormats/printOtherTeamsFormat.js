
Meteor.methods({
    callTeamDetailedDrawsPrint:async function(xData){
        var res = {
            status:FAIL_STATUS,
            message:PRINT_TEAM_DETAILED_DRAWS_FAIL_MSG,
            data:0
        }
        try{
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }
            if (xData) {
                var getTeamDetailedScores = await Meteor.call("getTeamDetailedDrawsForOtherFormats",xData)
                if(getTeamDetailedScores && getTeamDetailedScores.status==SUCCESS_STATUS && 
                    getTeamDetailedScores.data){
                    var getPRintDet = await Meteor.call("teamDrawDetailsOtherPrint",xData.tournamentId,xData.eventName
                        ,xData.roundNumber,xData.matchNumber,getTeamDetailedScores.data,xData.blank)
                    if(getPRintDet){
                        res.status = SUCCESS_STATUS
                        res.data = getPRintDet
                        res.message = PRINT_TEAM_DETAILED_DRAWS_SUCCESS_MSG
                    }
                }
                else if(getTeamDetailedScores && getTeamDetailedScores.status==FAIL_STATUS 
                    && getTeamDetailedScores.message){
                    res.message = getTeamDetailedScores.message
                }
            }else {
                res.message = "parameters  " + ARE_NULL_MSG
            }
            return res
        }catch(e){
            res.message = CATCH_MSG + e
            if (e && e.toString()) {
                res.error = CATCH_MSG + e.toString()
            }
            return res
        }
    }
})

Meteor.methods({
    'teamDrawDetailsOtherPrint': async function(tournamentId, eventName, roundNumber, matchNumber,teamDetailedDraws,blank) {
        try {
            if (Meteor.isServer) {
                var webshot = Meteor.npmRequire('webshot');
                var fs = Npm.require('fs');
                var Future = Npm.require('fibers/future');
                var fut = new Future();
                var fileName = "matchRecords-report.pdf";
                var css = Assets.getText('printTeamDetailedDraws.css');
                SSR.compileTemplate('printTeamDetailsOtherFormat', Assets.getText('printTeamDetailsOtherFormat.html'));

                if(blank==undefined||blank==null){
                    blank = true
                }

                Template.printTeamDetailsOtherFormat.helpers({
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
                            return eventName;
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
                        } catch (e) {
                        }
                    },
                    roundNumber: function(){
                        try{
                            return roundNumber
                        }catch(e){
                        }
                    },
                    matchNumber: function(){
                        try{
                            return matchNumber
                        }catch(e){
                        }
                    },
                    "teamANameGet":function(){
                        try{
                            if(teamDetailedDraws  && 
                                teamDetailedDraws.teamAName){
                                return teamDetailedDraws.teamAName
                            }
                        }catch(e){}
                    },
                    "teamBNameGet":function(){
                        try{
                            if(teamDetailedDraws  && 
                                teamDetailedDraws.teamBName){
                                return teamDetailedDraws.teamBName
                            }
                        }catch(e){}
                    },
                    "specificationsGet":function(){
                        try{
                            if(teamDetailedDraws && teamDetailedDraws.specifications &&
                                teamDetailedDraws.specifications.length){
                                return teamDetailedDraws.specifications
                            }
                        }catch(e){}
                    },
                    checktype:function(typeOfThisMatch){
                        try{
                            if(parseInt(this.matchProjectType)==1){
                                return true
                            }else if(parseInt(this.matchType)==2){
                                return false
                            }
                        }catch(e){}
                    },
                    setScoresTeamTemp:function(){
                        var setTemp = [1,2,3,4,5,6,7]
                        return setTemp
                    },
                    setScoresAGet:function(index1,setScoresA){
                        try{
                            if(setScoresA && setScoresA.length && 
                                setScoresA[parseInt(index1)] && blank){
                                return setScoresA[parseInt(index1)]
                            }
                        }catch(e){}
                    },
                    typeDisp:function(type){
                        try{
                            if(type  && blank){
                                if(type.toLowerCase()=="notplayed"){
                                    return "Yet To Play"
                                }
                                else if(type.toLowerCase()=="walkover"){
                                    return "Walkover"
                                }
                                else if(type.toLowerCase()=="bye"){
                                    return "Bye"
                                }
                                else if(type=="completed"){
                                    return "Completed"
                                }
                            }else{
                                return " "
                            }
                        }catch(e){}
                    },
                    getWinnerNameA:function(winner,playerA,playerB,type){
                        try{
                            if(blank){
                                if(type==1&&winner==playerA){
                                    return this.playerAName
                                }
                                else if(type==1&&winner==playerB){
                                    return this.playerBName
                                }
                                else if(type==2&&winner==playerA&&this.playerA1Name&&
                                    this.playerA2Name){
                                    return this.playerA1Name + " , "+this.playerA2Name
                                }
                                else if(type==2&&winner==playerB&&this.playerB1Name&&
                                    this.playerB2Name){
                                    return this.playerB1Name+ " , "+this.playerB2Name
                                }
                                else{
                                    return " "
                                }
                            }else{
                                return " "
                            }   
                        }catch(e){
                        }
                    },
                    findteamStatusType:function(){
                        try{
                            if(teamDetailedDraws && teamDetailedDraws.teamMatchType && blank){
                                return teamDetailedDraws.teamMatchType
                            }else{
                                return " "
                            }
                        }catch(e){}
                    },
                    findTheTeamNamedraw:function(){
                       try{
                            if(teamDetailedDraws && teamDetailedDraws.finalTeamWinner && blank){
                                if(teamDetailedDraws.teamAName && teamDetailedDraws.teamAID
                                    && teamDetailedDraws.teamAID==teamDetailedDraws.finalTeamWinner){
                                    return teamDetailedDraws.teamAName
                                }else if(teamDetailedDraws.teamBName && teamDetailedDraws.teamBID
                                    && teamDetailedDraws.teamBID==teamDetailedDraws.finalTeamWinner){
                                   return teamDetailedDraws.teamBName
                                }
                            }else{
                                return " "
                            }
                        }catch(e){} 
                    },
                   
                });

                SSR.compileTemplate('matchRecords_report', Assets.getText('printTeamDetailsOtherFormat.html'));

                var html_string = SSR.render('printTeamDetailsOtherFormat', {
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
});