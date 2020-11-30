Template.Teamdraws.onRendered(function(){
    Session.set("teamDrawsDetTeamFormatId",undefined)
})

Template.Teamdraws.onDestroyed(function(){
    Session.set("teamDrawsDetTeamFormatId",undefined)
})

Template.Teamdraws.helpers({
    drawsEventName_team: function() {
        return Session.get("eventName");
    },
    tourIdDraws_team: function() {
        //var userId = Meteor.userId();
        return Router.current().params._id;
    },
    lRoundNum_team: function() {
        return (Session.get("selectedRound"));
    },
    leftRMatches_team: function() {
        return Session.get("leftRMatches_team");
    },
    rRoundNum_team: function() {
        return (1 + Session.get("selectedRound"));
    },
    rightRMatches_team: function() {
        return (Session.get("rightRMatches_team"));
    },
    matchNumber1_team: function() {
        return (this.matchNumber);
    },
    "teamANo":function()
    {
        if(this.teamsNo && this.teamsNo.teamANo)
            return this.teamsNo.teamANo;
    },
    playerA_team: function() {
        if (this.teams && this.teams.teamA)
            return (this.teams.teamA);
    },
    AS1_team: function() {
        return (this.scores.setScoresA[0]);
    },
    AS2_team: function() {
        return (this.scores.setScoresA[1]);
    },
    AS3_team: function() {
        return (this.scores.setScoresA[2]);
    },
    AS4_team: function() {
        return (this.scores.setScoresA[3]);
    },
    AS5_team: function() {
        return (this.scores.setScoresA[4]);
    },
    AS6_team: function() {
        if (this.scores.setScoresA.length < 6)
            return 0;
        return (this.scores.setScoresA[5]);
    },
    AS7_team: function() {
        if (this.scores.setScoresA.length < 7)
            return 0;
        return (this.scores.setScoresA[6]);
    },
    "teamBNo":function()
    {
        if(this.teamsNo && this.teamsNo.teamBNo)
            return this.teamsNo.teamBNo;
    },
    playerB_team: function() {
        if (this.teams && this.teams.teamB)
            return (this.teams.teamB);
    },
    BS1_team: function() {
        return (this.scores.setScoresB[0]);
    },
    BS2_team: function() {
        return (this.scores.setScoresB[1]);
    },
    BS3_team: function() {
        return (this.scores.setScoresB[2]);
    },
    BS4_team: function() {
        return (this.scores.setScoresB[3]);
    },
    BS5_team: function() {
        return (this.scores.setScoresB[4]);
    },
    BS6_team: function() {
        if (this.scores.setScoresB.length < 6)
            return 0;
        return (this.scores.setScoresB[5]);
    },
    BS7_team: function() {
        if (this.scores.setScoresB.length < 7)
            return 0;
        return (this.scores.setScoresB[6]);
    },
    AS1_teamSettings: function() {
        if (parseInt(this.scores.setScoresA[0]) != 0) {
            if (parseInt(this.scores.setScoresA[0]) < parseInt(this.scores.setScoresB[0])) {
                return "background:#EEEAEA !important";

            } else {
                return "background:#9DB68C !important;color:white";

            }
        }
    },
    AS2_teamSettings: function() {
        if (parseInt(this.scores.setScoresA[1]) != 0) {
            if (parseInt(this.scores.setScoresA[1]) < parseInt(this.scores.setScoresB[1]))
                return "background:#EEEAEA !important";
            else
                return "background:#9DB68C !important;color:white";
        }
    },
    AS3_teamSettings: function() {
        if (parseInt(this.scores.setScoresA[2]) != 0) {
            if (parseInt(this.scores.setScoresA[2]) < parseInt(this.scores.setScoresB[2]))
                return "background:#EEEAEA !important";
            else
                return "background:#9DB68C !important;color:white";
        }
    },
    AS4_teamSettings: function() {
        if (parseInt(this.scores.setScoresA[3]) != 0) {
            if (parseInt(this.scores.setScoresA[3]) < parseInt(this.scores.setScoresB[3]))
                return "background:#EEEAEA !important";
            else
                return "background:#9DB68C !important;color:white";
        }
    },
    AS5_teamSettings: function() {
        if (parseInt(this.scores.setScoresA[4]) != 0) {
            if (parseInt(this.scores.setScoresA[4]) < parseInt(this.scores.setScoresB[4]))
                return "background:#EEEAEA !important";
            else
                return "background:#9DB68C !important;color:white";
        }
    },
    AS6_teamSettings: function() {
        if (this.scores.setScoresA.length < 6)
            return "";
        else if (parseInt(this.scores.setScoresA[5]) != 0) {
            if (parseInt(this.scores.setScoresA[5]) < parseInt(this.scores.setScoresB[5]))
                return "background:#EEEAEA !important";
            else
                return "background:#9DB68C !important;color:white";
        }
    },
    AS7_teamSettings: function() {
        if (this.scores.setScoresA.length < 7)
            return "";
        else if (parseInt(this.scores.setScoresA[6]) != 0) {
            if (parseInt(this.scores.setScoresA[6]) < parseInt(this.scores.setScoresB[6]))
                return "background:#EEEAEA !important";
            else
                return "background:#9DB68C !important;color:white";
        }
    },
    BS1_teamSettings: function() {
        if (parseInt(this.scores.setScoresB[0]) != 0) {
            if (parseInt(this.scores.setScoresA[0]) > parseInt(this.scores.setScoresB[0]))
                return "background:#EEEAEA !important";
            else
                return "background:#9DB68C !important;color:white";
        }
    },
    BS2_teamSettings: function() {
        if (parseInt(this.scores.setScoresB[1]) != 0) {
            if (parseInt(this.scores.setScoresA[1]) > parseInt(this.scores.setScoresB[1]))
                return "background:#EEEAEA !important";
            else
                return "background:#9DB68C !important;color:white";
        }
    },
    BS3_teamSettings: function() {
        if (parseInt(this.scores.setScoresB[2]) != 0) {
            if (parseInt(this.scores.setScoresA[2]) > parseInt(this.scores.setScoresB[2]))
                return "background:#EEEAEA !important";
            else
                return "background:#9DB68C !important;color:white";
        }
    },
    BS4_teamSettings: function() {
        if (parseInt(this.scores.setScoresB[3]) != 0) {
            if (parseInt(this.scores.setScoresA[3]) > parseInt(this.scores.setScoresB[3]))
                return "background:#EEEAEA !important";
            else
                return "background:#9DB68C !important;color:white";
        }
    },
    BS5_teamSettings: function() {

        if (parseInt(this.scores.setScoresB[4]) != 0) {
            if (parseInt(this.scores.setScoresA[4]) > parseInt(this.scores.setScoresB[4]))
                return "background:#EEEAEA !important";
            else
                return "background:#9DB68C !important;color:white";
        }
    },
    BS6_teamSettings: function() {
        if (this.scores.setScoresB.length < 6)
            return "";

        else if (parseInt(this.scores.setScoresB[5]) != 0) {
            if (parseInt(this.scores.setScoresA[5]) > parseInt(this.scores.setScoresB[5]))
                return "background:#EEEAEA !important";
            else
                return "background:#9DB68C !important;color:white";
        }
    },
    BS7_teamSettings: function() {
        if (this.scores.setScoresB.length < 7)
            return "";
        else if (parseInt(this.scores.setScoresB[6]) != 0) {
            if (parseInt(this.scores.setScoresA[6]) > parseInt(this.scores.setScoresB[6]))
                return "background:#EEEAEA !important";
            else
                return "background:#9DB68C !important;color:white";
        }
    },
    setScoresLength:function(){
        try{
            if((this.scores && this.scores.setScoresB &&
                this.scores.setScoresB.length>7)||(this.scores && this.scores.setScoresA &&
                this.scores.setScoresA.length>7)){
                return true
            }
            else{
                return false
            }
        }catch(e){
        }
    },
    getStatusColorA_team: function() {
        return this.getStatusColorA;
    },
    getStatusColorB_team: function() {
        return this.getStatusColorB;
    },
    matchNumber_team: function() {
        return this.matchNumber;
    },
    matchSettingsA_team: function() {
        if (this.roundNumber == 1 && this.status2 == "bye" && this.teamsID.teamAId.trim() == "")
            {
                //return "visibility:hidden"
                return "";
            }
    },
    matchSettingsB_team: function() {
        if (this.roundNumber == 1 && this.status2 == "bye" && this.teamsID.teamBId.trim() == "")
            {
                return "";
                //return "visibility:hidden";
            }
    },
    matchSettingsB_teamSettings: function() {
        if (this.roundNumber == 1 && this.status2 == "bye")
            return "font-size: 12px;visibility:hidden!important;display:hidden;";
        else
            return "font-size: 12px;cursor: pointer;";
    },
    matchSettingsB_teamScore: function() {
        if (this.roundNumber == 1 && this.status2 == "bye" && (this.teamsID.teamAId.trim() == "" || this.teamsID.teamBId.trim() == "")){
            {
                return "";
                //return "visibility:hidden";
            }
        }            
    },
    matchSettingsA_teamScore: function() {
        if (this.roundNumber == 1 && this.status2 == "bye" && this.teamsID.teamBId.trim() == ""){
            {
                return "";
                //return "visibility:hidden";
            }
        }           
    },

});

Template.Teamdraws.events({
    "click #closeTeamPopupIplayon":function(e){
        e.preventDefault();
        $("#renderbyeWalkOverTeams").empty();
        $("#renderTeamSpecForm").empty();
        $( '.modal-backdrop' ).remove();
        Blaze.render(Template.SettingsTeamDraws, $("#renderbyeWalkOverTeams")[0]);
        $("#SettingsTeamDraws").modal({
            backdrop: 'static',
            keyboard: false
        });    
    },
    "click #closeTeamPopupIplayonMain":function(e){
        e.preventDefault();
        $("#renderbyeWalkOverTeams").empty();
        $("#renderTeamSpecForm").empty();
        $( '.modal-backdrop' ).remove();
        $("#SettingsTeamDraws").modal('hide');
    },
    "click #cancelTeamSpecForm":function(e){
        e.preventDefault();
        $("#renderbyeWalkOverTeams").empty();
        $("#renderTeamSpecForm").empty();
        $( '.modal-backdrop' ).remove();
        Blaze.render(Template.SettingsTeamDraws, $("#renderbyeWalkOverTeams")[0]);
        $("#SettingsTeamDraws").modal({
            backdrop: 'static',
            keyboard: false
        });    
    },
    "click #byeWalkOverPlayerBL_team": async function(e) {
        e.preventDefault();
        var det = this
        det.roundBM = false
        Session.set("teamDetailedDraws",det)
        $("#renderbyeWalkOverTeams").empty();        
        //get type of team detailed draws
        var data = {
            tournamentId:Session.get("tournamentId"),
            "eventName": Session.get("eventName")
        }

        var res = await Meteor.callPromise("getTeamFormatIdForOtherFormats",data)
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
                     tournamentId:Session.get("tournamentId"),
                    "eventName": Session.get("eventName"),
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
                
                Blaze.render(Template.tossDetailedDraws, $("#renderbyeWalkOverTeams")[0]);

                $("#tossDetailedDraws").modal({
                    backdrop: 'static',
                    keyboard: false
                }); 
            }else {
                Blaze.render(Template.SettingsTeamDraws, $("#renderbyeWalkOverTeams")[0]);

                $("#SettingsTeamDraws").modal({
                    backdrop: 'static',
                    keyboard: false
                });       
            }
        }catch(e){
            alert(e)
        }
         
    },
    'click #byeWalkOverPlayerBR_team': async function(e) {
        e.preventDefault();
        var det = this
        det.roundBM = false
        Session.set("teamDetailedDraws",det)
        $("#renderbyeWalkOverTeams").empty();        
        //get type of team detailed draws
        var data = {
            tournamentId:Session.get("tournamentId"),
            "eventName": Session.get("eventName")
        }

        var res = await Meteor.callPromise("getTeamFormatIdForOtherFormats",data)
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
                     tournamentId:Session.get("tournamentId"),
                    "eventName": Session.get("eventName"),
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
                
                Blaze.render(Template.tossDetailedDraws, $("#renderbyeWalkOverTeams")[0]);

                $("#tossDetailedDraws").modal({
                    backdrop: 'static',
                    keyboard: false
                }); 
            }else {
                Blaze.render(Template.SettingsTeamDraws, $("#renderbyeWalkOverTeams")[0]);

                $("#SettingsTeamDraws").modal({
                    backdrop: 'static',
                    keyboard: false
                });       
            }
        }catch(e){
            alert(e)
        }
    },
    "click #viewTeamSpecification":function(e){
        e.preventDefault();
        $("#SettingsTeamDraws").modal('hide')
        $( '.modal-backdrop' ).remove();
        $("#renderTeamSpecForm").empty();        
        Blaze.render(Template.teamSpecFormModal, $("#renderTeamSpecForm")[0]);
        $("#teamSpecFormModal").modal({
            backdrop: 'static',
            keyboard: false
        });
    },
    "click #viewDetailedScore":function(e){
        e.preventDefault();
        var tournamentId = Session.get("tournamentId");
        var det = Session.get("teamDetailedDraws");
        var eventName = Session.get("eventName");
        var round = det.roundNumber;
        var match = det.matchNumber;
        Meteor.call("teamDrawsSpecIsSetOrNot",tournamentId,eventName,round,match,function(e,res){
            if(res==true){
                $("#SettingsTeamDraws").modal('hide')
                $( '.modal-backdrop' ).remove();
                $("#renderTeamSpecForm").empty();   
                Blaze.render(Template.detailedScoresTeamDraws,$("#renderTeamSpecForm")[0])
                $("#detailedScoresTeamDraws").modal({
                    backdrop: 'static',
                    keyboard: false
                });
            }
            else{
                alert("Team Specification for this match is not set");
            }
        });        
    },
    "click #openMoreScores":function(e){
        var det = this
        Session.set("teamDetailedDraws",det)
        $("#renderbyeWalkOverTeams").empty();
        Blaze.render(Template.teamsMorescores, $("#renderbyeWalkOverTeams")[0]);

        $("#teamsMorescores").modal({
            backdrop: 'static',
            keyboard: false
        });
    },
    "click #addBMRound":async function(e){
        var data = {
                tournamentId:Session.get("tournamentId"),
                "eventName": Session.get("eventName"),
                "matchNumber":1
            }

        var dataSavedForDet = await Meteor.callPromise("getTeamDetailedDrawsForTossWM",data)
        if(dataSavedForDet && dataSavedForDet.status==SUCCESS_STATUS){
            $("#render34round").empty();
            Blaze.render(Template.teams34Format, $("#render34round")[0]);
            var tournamentId = Session.get("tournamentId");
            var eventName = Session.get("eventName");

            Session.set("thirdFourTournamnetId",tournamentId)
            Session.set("thirdFourEventName",eventName)
            Session.set("scoreDetailsthirdFour",[])
            var data = {
                tournamentId:tournamentId,
                eventName:eventName
            }

            var findBMRes = await Meteor.callPromise("findInsertedRoundBMTeam",data)
            if(findBMRes.status==SUCCESS_STATUS && findBMRes.data){
                Session.set("scoreDetailsthirdFour",findBMRes.data)
            }
            else{
                Session.set("scoreDetailsthirdFour",[])
            }
            
            $("#teams34Format").modal({
                backdrop: 'static',
                keyboard: false
            });

        } else{
            alert("Reset Draws .. ! this option is only for new teams format")
        }
        

    } 
});

Template.byeWalkOver_team.onRendered(function() {
    var setType = $('input[name=set_team]:checked').val();
    if (setType == "Completed") {
        $("#scoresInfo_team").show();
    }
})
Template.byeWalkOver_team.onCreated(function() {
    this.subscribe("MatchTeamCollectionConfig")
})

Template.byeWalkOver_team.helpers({
    "namePlayerA_team": function() {
        var matchrec = Session.get("byeWalkoverMatchRec_team");
        return Session.get("namePlayerA_team")
    },
    "namePlayerB_team": function() {
        return Session.get("namePlayerB_team")
    },
    "CS0_team": function() {
        var curMatchRecord = Session.get("byeWalkoverMatchRec_team")
        try {
            return (curMatchRecord.completedscores[0]);

        } catch (e) {}
    },
    "lockStatus":function()
    {
        //byeWalkOver
        var tournamentId = Session.get("tournamentId");
        var eventName = Session.get("eventName");
        var result2 = ReactiveMethod.call("getMatchDrawsLock",tournamentId,eventName);
        return result2;
    },
    "possibleScores_team": function() {
        try {
            var findMaxNumberMatches = MatchTeamCollectionConfig.findOne({
                "tournamentId": Session.get("tournamentId"),
                "eventName": Session.get("eventName")
            });
            if (findMaxNumberMatches && findMaxNumberMatches.roundValues) {
                var arrayOfBoxes = [];
                for (var i = 0; i < findMaxNumberMatches.roundValues.length; i++) {
                    var values = findMaxNumberMatches.roundValues[i]
                    if (parseInt(values.roundNumber) == parseInt(Session.get("byeWalkoverRoundNumber_team"))) {
                        Session.set("byeWalkoverSets_NumberMatch", parseInt(values.noofMatches));
                        Session.set("byeWalkoverSets_NumberSets",parseInt(values.noofSets))
                        var roundName =values.roundName;
                        Session.set("byeWalkoverRoundName_team", roundName);
                        if (values.noofMatches) {
                            for (var j = 0; j < parseInt(values.noofMatches); j++) {
                                arrayOfBoxes.push(j)
                            }
                        }
                        break;
                    }
                }
                return arrayOfBoxes;
            }
        } catch (e) {}
    }
});

Template.byeWalkOver_team.events({
    "change input[type=radio][name=set_team]": function(e) {
        e.preventDefault();
        if (e.target.id == "set_teamWalkover") {
            $("#walkoverA_team").prop("checked", true)
            $("#scoresInfo_team").hide();
            $("#scoresInfo_teamB").hide();
        } else if (e.target.id == "set_teamBye") {
            $("#byeA_team").prop("checked", true);
            $("#scoresInfo_team").hide();
            $("#scoresInfo_teamB").hide();
        }
        /* shalini code starts here*/
        else {
            $("#completedA_team").prop("checked", true);
            $("#scoresInfo_team").show();
            $("#scoresInfo_teamB").show();
        }
    },
    "change input[type=radio][name=byeWalkover_Team_Radio]": function(e) {
        e.preventDefault();
        if (e.target.id == "walkoverA_team" || e.target.id == "walkoverB_team") {
            $("#set_teamWalkover").prop("checked", true);
            $("#scoresInfo_team").hide();
            $("#scoresInfo_teamB").hide();

        } else if (e.target.id == "byeA_team" || e.target.id == "byeB_team") {
            $("#set_teamBye").prop("checked", true)
            $("#scoresInfo_team").hide();
            $("#scoresInfo_teamB").hide();

        } else if (e.target.id == "completedA_team" || e.target.id == "completedB_team") {
            $("#set_teamCompleted").prop("checked", true);
            $("#scoresInfo_team").show();
            $("#scoresInfo_teamB").show();
        }
    },
    "click #cancelbyewalkover_team": function(e) {
        e.preventDefault();
        $("#byeWalkOver_team").modal('hide');
        $("#renderbyeWalkOverTeams").empty();
    },
    "click #savebyewalkover_team_SET": function(e) {
        e.preventDefault();
        $("#editSettingsPopupError").text("");
        var tourType;
        if (Router.current().params._eventType) {
            tourType = Router.current().params._eventType
        }
        var setType = $('input[name=set_team]:checked').val();
        var teamName = $('input[name=byeWalkover_Team_Radio]:checked').val();
        var teamAorB = $('input[name=byeWalkover_Team_Radio]:checked').attr("id");
        var curMatchRecord = Session.get("byeWalkoverMatchRec_team");

        if (setType == "Bye") {
            curMatchRecord.status = 'bye';
            curMatchRecord.winner = teamName;
            if (teamAorB == "byeA_team") {
                curMatchRecord.getStatusColorB = 'ip_input_box_type_pNameBye';
                curMatchRecord.getStatusColorA = 'ip_input_box_type_pName';
            } else if (teamAorB == "byeB_team") {
                curMatchRecord.getStatusColorB = 'ip_input_box_type_pName';
                curMatchRecord.getStatusColorA = 'ip_input_box_type_pNameBye';
            }

            var loserId = "";
            var winnerId = "";
            var winnerNo = "";
            var loser = "";
            var managerAId = "";
            var managerBId = "";
            var roundNumber = Session.get("byeWalkoverRoundNumber_team");
            var eventName = Session.get("eventName");
            if (teamAorB == "byeA_team") {
                loserId = curMatchRecord.teamsID.teamBId;
                loser = curMatchRecord.teams.teamB;
                winnerId = curMatchRecord.teamsID.teamAId;
                curMatchRecord.winnerID = curMatchRecord.teamsID.teamAId;
                curMatchRecord.WinnermanagerId = curMatchRecord.teamsID.managerAId;
                curMatchRecord.winnerNo = "";
                if(curMatchRecord.teamsNo && curMatchRecord.teamsNo.teamANo)
                {
                    curMatchRecord.winnerNo = curMatchRecord.teamsNo.teamANo;
                    winnerNo = curMatchRecord.teamsNo.teamANo;
                }
            } else if (teamAorB == "byeB_team") {
                loserId = curMatchRecord.teamsID.teamAId;
                loser = curMatchRecord.teams.teamA;
                winnerId = curMatchRecord.teamsID.teamBId;
                curMatchRecord.winnerID = curMatchRecord.teamsID.teamBId;
                curMatchRecord.WinnermanagerId = curMatchRecord.teamsID.managerBId;
                curMatchRecord.winnerNo = "";
                if(curMatchRecord.teamsNo && curMatchRecord.teamsNo.teamBNo)
                {
                    winnerNo = curMatchRecord.teamsNo.teamBNo;
                    curMatchRecord.winnerNo = curMatchRecord.teamsNo.teamBNo;
                }
            }

                tournament = Session.get("tournamentId");
                eventN = Session.get("eventName");
                winnerId = curMatchRecord.winnerID;
                winnerNo = curMatchRecord.winnerNo;
                roundNo =  Session.get("byeWalkoverRoundName_team");
                matchNo =  curMatchRecord.matchNumber;
                status = "Bye";
                autoTweet = $("#checkAcceptboxTweett").prop("checked");

        } else if (setType == "Walkover") {
            curMatchRecord.status = 'walkover';
            curMatchRecord.winner = teamName;
            if (teamAorB == "walkoverA_team") {
                curMatchRecord.getStatusColorB = 'ip_input_box_type_pNameWalkover';
                curMatchRecord.getStatusColorA = 'ip_input_box_type_pName';
            } else if (teamAorB == "walkoverB_team") {
                curMatchRecord.getStatusColorB = 'ip_input_box_type_pName';
                curMatchRecord.getStatusColorA = 'ip_input_box_type_pNameWalkover';
            }

            var loserId = "";
            var winnerId = "";
            var winnerNo = "";
            var loser = "";
            var roundNumber = Session.get("byeWalkoverRoundNumber_team");
            var eventName = Session.get("eventName");
            var tournamentId = Session.get("tournamentId");
            if (teamAorB == "walkoverA_team") {
                loserId = curMatchRecord.teamsID.teamBId;
                loser = curMatchRecord.teams.teamB;
                winnerId = curMatchRecord.teamsID.teamAId;
                curMatchRecord.winnerID = curMatchRecord.teamsID.teamAId;
                curMatchRecord.WinnermanagerId = curMatchRecord.teamsID.managerAId;
                curMatchRecord.winnerNo = "";
                if(curMatchRecord.teamsNo && curMatchRecord.teamsNo.teamANo)
                {
                    winnerNo = curMatchRecord.teamsNo.teamANo;
                    curMatchRecord.winnerNo = curMatchRecord.teamsNo.teamANo;
                }
            } else if (teamAorB == "walkoverB_team") {
                loserId = curMatchRecord.teamsID.teamAId;
                loser = curMatchRecord.teams.teamA;
                winnerId = curMatchRecord.teamsID.teamBId;
                curMatchRecord.winnerID = curMatchRecord.teamsID.teamBId;
                curMatchRecord.WinnermanagerId = curMatchRecord.teamsID.managerBId;
                curMatchRecord.winnerNo = "";
                if(curMatchRecord.teamsNo && curMatchRecord.teamsNo.teamBNo)
                {
                    winnerNo = curMatchRecord.teamsNo.teamBNo;
                    curMatchRecord.winnerNo = curMatchRecord.teamsNo.teamBNo;
                }
            }
                tournament = Session.get("tournamentId");
                eventN = Session.get("eventName");
                winnerId = curMatchRecord.winnerID;
                winnerNo = curMatchRecord.winnerNo;
                roundNo =  Session.get("byeWalkoverRoundName_team");
                matchNo =  curMatchRecord.matchNumber;
                status = "Walkover";
                autoTweet = $("#checkAcceptboxTweett").prop("checked");
        } else if (setType == "Completed") {
            try {
                var teamScoreA = {
                    scoresA: []
                };
                var teamScoreB = {
                    scoresB: []
                };
                curMatchRecord.status = 'completed';
                var status = 'completed';
                var winner = teamName;
                curMatchRecord.winner = teamName;
                var set1 = $("#compSet_team0").find("input[name='score_team']").val();
                var set2 = $("#compSet_team1").find("input[name='score_team']").val();
                var set3 = $("#compSet_team2").find("input[name='score_team']").val();
                var set4 = $("#compSet_team3").find("input[name='score_team']").val();
                var set5 = $("#compSet_team4").find("input[name='score_team']").val();
                var set6 = $("#compSet_team5").find("input[name='score_team']").val();
                var set7 = $("#compSet_team6").find("input[name='score_team']").val();
                var setsToBePlayed = Session.get("byeWalkoverSets_NumberMatch");

                var sets = {
                    "set1": set1,
                    "set2": set2,
                    "set3": set3,
                    "set4": set4,
                    "set5": set5,
                    "set6": set6,
                    "set7": set7
                };

                var byeWalkoverSets = Session.get("byeWalkoverSets_NumberMatch");
                var noofSetsToWin = Session.get("byeWalkoverSets_NumberSets")
                var selectedTeam = teamAorB;
                var dataJson = setJsonForTeam(sets, noofSetsToWin, byeWalkoverSets, selectedTeam);

                var completedScores = [];
                if (set1 != undefined) completedScores.push(set1);
                if (set2 != undefined) completedScores.push(set2);
                if (set3 != undefined) completedScores.push(set3);
                if (set4 != undefined) completedScores.push(set4);
                if (set5 != undefined) completedScores.push(set5);
                if (set6 != undefined) completedScores.push(set6);
                if (set7 != undefined) completedScores.push(set7);

                var numSetWinsReqd = parseInt((parseInt(setsToBePlayed) + 1) / 2);
                var setScoresA = JSON.parse(JSON.stringify(dataJson)).scores.setScoresA;
                var setScoresB = JSON.parse(JSON.stringify(dataJson)).scores.setScoresB;



                if (setScoresA.length < numSetWinsReqd) return;
                if (setScoresA.length != setScoresB.length) return;
                let winsA = 0,
                    winsB = 0;

                /*for(var j =0; j< completedScores.length;j++){
                  if(completedScores[j] > 0)
                    winsA++;
                  else if(completedScores[j] < 0)
                    winsB++;
                }*/

                for (var sA = 0; sA < setScoresA.length; sA++) {
                    if (parseInt(setScoresA[sA]) > parseInt(setScoresB[sA])) {
                        winsA++
                    } else if (parseInt(setScoresA[sA]) < parseInt(setScoresB[sA])) {
                        winsB++
                    }
                }

                if (winsA >= winsB) {
                    curMatchRecord.status = 'completed';
                    curMatchRecord.winner = curMatchRecord.teams.teamA
                    teamId = curMatchRecord.teamsID.teamBId;
                    curMatchRecord.loser = curMatchRecord.teams.teamB;
                    curMatchRecord.winner = curMatchRecord.teams.teamA;
                    curMatchRecord.winnerID = curMatchRecord.teamsID.teamAId;

                    curMatchRecord.getStatusColorB = 'ip_input_box_type_pNameLost';
                    curMatchRecord.getStatusColorA = 'ip_input_box_type_pName';
                    curMatchRecord.WinnermanagerId = curMatchRecord.teamsID.managerAId;
                    curMatchRecord.winnerNo = "";
                    if(curMatchRecord.teamsNo && curMatchRecord.teamsNo.teamANo)
                    {
                        curMatchRecord.winnerNo = curMatchRecord.teamsNo.teamANo;
                        winnerNo = curMatchRecord.teamsNo.teamANo;
                    }                  

                    
                    //curMatchRecord.getStatusColorA = 'ip_input_box_type_pNameLost'
                    //curMatchRecord.getStatusColorB = 'ip_input_box_type_pName'
                } else if (winsB >= winsA) {
                    curMatchRecord.status = 'completed';
                    curMatchRecord.winner = curMatchRecord.teams.teamB;
                    teamId = curMatchRecord.teamsID.teamAId;
                    curMatchRecord.winner = curMatchRecord.teams.teamB;
                    curMatchRecord.loser = curMatchRecord.teams.teamA;
                    curMatchRecord.winnerID = curMatchRecord.teamsID.teamBId;
                    curMatchRecord.getStatusColorA = 'ip_input_box_type_pNameLost';
                    curMatchRecord.getStatusColorB = 'ip_input_box_type_pName';
                    curMatchRecord.WinnermanagerId = curMatchRecord.teamsID.managerBId;
                    
                    curMatchRecord.winnerNo = "";
                    if(curMatchRecord.teamsNo && curMatchRecord.teamsNo.teamBNo)
                    {
                        curMatchRecord.winnerNo = curMatchRecord.teamsNo.teamBNo;
                        winnerNo = curMatchRecord.teamsNo.teamBNo;
                    }
                    //curMatchRecord.getStatusColorB = 'ip_input_box_type_pNameLost';
                    //curMatchRecord.getStatusColorA = 'ip_input_box_type_pName';
                } else {
                    $("#editSettingsPopupError").text("* Incomplete set");
                    return false;
                }

                var thisMatchNumber = curMatchRecord.matchNumber;
                curMatchRecord.completedscores = completedScores;
                curMatchRecord.scores = JSON.parse(JSON.stringify(dataJson)).scores;

                if (teamAorB == "completedA_team") {
                    /*teamId = curMatchRecord.teamsID.teamBId;
                    curMatchRecord.loser = curMatchRecord.teams.teamB;
                    curMatchRecord.winner = curMatchRecord.teams.teamA;
                    curMatchRecord.winnerID = curMatchRecord.teamsID.teamAId;
                    curMatchRecord.getStatusColorB = 'ip_input_box_type_pNameLost';
                    curMatchRecord.getStatusColorA = 'ip_input_box_type_pName';
                    curMatchRecord.WinnermanagerId = curMatchRecord.teamsID.managerAId;*/
                    curMatchRecord.selectedID = curMatchRecord.teamsID.teamAId;
                    curMatchRecord.selectedTeamName = curMatchRecord.teams.teamA;
                } else if (teamAorB == "completedB_team") {
                    /*teamId = curMatchRecord.teamsID.teamAId;
                    curMatchRecord.winner = curMatchRecord.teams.teamB;
                    curMatchRecord.loser = curMatchRecord.teams.teamA;
                    curMatchRecord.winnerID = curMatchRecord.teamsID.teamBId;
                    curMatchRecord.getStatusColorA = 'ip_input_box_type_pNameLost';
                    curMatchRecord.getStatusColorB = 'ip_input_box_type_pName';
                    curMatchRecord.WinnermanagerId = curMatchRecord.teamsID.managerBId;*/
                    curMatchRecord.selectedID = curMatchRecord.teamsID.teamBId;
                    curMatchRecord.selectedTeamName = curMatchRecord.teams.teamB;
                }
                tournament = Session.get("tournamentId");
                eventN = Session.get("eventName");
                winnerId = curMatchRecord.winnerID;
                winnerNo = curMatchRecord.winnerNo;
                roundNo =  Session.get("byeWalkoverRoundName_team");
                matchNo =  curMatchRecord.matchNumber;
                status = "Completed";
                autoTweet = $("#checkAcceptboxTweett").prop("checked");

            } catch (e) {}
        }
        if (setType == "Bye" || setType == "Walkover" || setType == "Completed") {
            var thisMatchNumber = curMatchRecord.matchNumber;
            var tmpRec = curMatchRecord;
            var matchRecord = tmpRec;
            var updated = 0;
            var leftRMatches = Session.get("leftRMatches_team");
            var rightRMatches = Session.get("rightRMatches_team");
            var updI = 0;
            var fromLeft = 0;
            var getBMDet = false

            for (let i = 0; i < leftRMatches.length; i++) {
                if (leftRMatches[i].matchNumber == thisMatchNumber && leftRMatches[i].roundName != "BM") {
                    leftRMatches[i] = matchRecord;
                    updI = i;
                    updated = 1;
                    fromLeft = 1;
                    break;
                }
            }
            if (!updated) {
                for (let i = 0; i < rightRMatches.length; i++) {
                    if (rightRMatches[i].matchNumber == thisMatchNumber && rightRMatches[i].roundName != "BM") {
                        rightRMatches[i] = matchRecord;
                        updI = i;
                        break;
                    }
                }
            }

           
            var matchRecords = Session.get("matchRecords");
            matchRecords[thisMatchNumber - 1] = matchRecord;
            Session.set("leftRMatches_team", leftRMatches);
            Session.set("rightRMatches_team", rightRMatches);
            Session.set("matchRecords", matchRecords);
            propogateTeam(matchRecord, fromLeft);
            matchRecords = Session.get("matchRecords");
            var FqfpQFsF = false;

            if(roundNo==Session.get("maxRoundNum")){
                FqfpQFsF = "Finals";
            }
            else if(roundNo==parseInt(Session.get("maxRoundNum")-1)){
                FqfpQFsF = "Semis";
            }
            else if(roundNo==parseInt(Session.get("maxRoundNum")-2)){
                FqfpQFsF = "Quarters";
            }
            else if(roundNo==parseInt(Session.get("maxRoundNum")-3)){
                FqfpQFsF = "Pre-quarters"
            }

            Meteor.call("updateMatchRecordsTeam", Session.get("tournamentId"), Session.get("eventName"), matchRecords,curMatchRecord,function(e,r){
                Meteor.call("mainRoundsCompletedTeam", Session.get("maxRoundNum"), autoTweet, tournament, eventN, winnerId, roundNo, matchNo, status,curMatchRecord.roundNumber, function(e, res){})
                Meteor.call("matchCompletedAutoTweetTeam", autoTweet, tournament, eventN, winnerId, roundNo, matchNo, status, function(e, res) {
                    Meteor.call("nextRoundDecidedForTeam",autoTweet,tournament,eventN,roundNo,matchNo,function(e,r){})
                })
                if(parseInt(curMatchRecord.roundNumber)==parseInt(Session.get("maxRoundNum"))){
                    Meteor.call("matchConlcudedTeam",autoTweet, tournament, eventN, winnerId, roundNo, matchNo, status,function(e,res){})
                }

            });
            $("#byeWalkOver_team").modal('hide')
        }
    }
});

Template.registerHelper("checkBye_Team", function(data) {
    try {
        var matchrec = Session.get("byeWalkoverMatchRec_team");
        if (matchrec !== undefined && matchrec.status == "bye") {
            if (data == matchrec.winner) {
                return "checked";
            } else {
                return ""
            }
        }
    } catch (e) {}
});

Template.registerHelper("checkByeLabel_Team", function(data) {
    try {
        var matchrec = Session.get("byeWalkoverMatchRec_team");
        if (matchrec !== undefined && matchrec.status == "bye") {
            return "checked";
        } else {
            return "";
        }
    } catch (e) {}
});


Template.registerHelper("checkWalkoverLabel_Team", function(data) {
    try {
        var matchrec = Session.get("byeWalkoverMatchRec_team");
        if (matchrec !== undefined && matchrec.status == "walkover") {
            return "checked";
        } else {
            return "";
        }
    } catch (e) {}
});

Template.registerHelper("checkWalk_Team", function(data) {
    try {
        var matchrec = Session.get("byeWalkoverMatchRec_team");
        if (matchrec !== undefined && matchrec.status == "walkover") {
            if (data == matchrec.winner) {
                return "checked";
            } else {
                return ""
            }
        }
    } catch (e) {}
});




Template.registerHelper("checkCompletedLabel_Team", function(data) {
    try {
        var matchrec = Session.get("byeWalkoverMatchRec_team");
        if (matchrec !== undefined && matchrec.status == "completed") {
            $("#scoresInfo_team").show();
            return "checked";
        } else {
            return "";
        }
    } catch (e) {}
});

Template.registerHelper("checkCompleted_Team", function(data) {
    try {
        var matchrec = Session.get("byeWalkoverMatchRec_team");
        if (matchrec !== undefined && matchrec.status == "completed") {
            if (data == matchrec.selectedTeamName) {
                $("#scoresInfo_team").show();

                return "checked";
            } else {
                return ""
            }
        }
    } catch (e) {}
});
Template.registerHelper("CS_Team", function(data) {
    var curMatchRecord = Session.get("byeWalkoverMatchRec_team")
    try {
        //$("#scoresInfo").show()
        return curMatchRecord.completedscores[parseInt(data)];

    } catch (e) {}
});


export const propogateTeam = function(matchRecord, fromLeft) {
    var nextMatchNumber = matchRecord.nextMatchNumber;
    var nextSlot = matchRecord.nextSlot;
    var matchRecords = Session.get("matchRecords");
    var thisMatchRecord;
    for (let i = 0; i < matchRecords.length; i++) {
        if (matchRecords[i].matchNumber == nextMatchNumber && matchRecords[i].roundName != "BM") 
        {

            if (nextSlot == "A") {
                matchRecords[i].teams.teamA = matchRecord.winner;
                matchRecords[i].teamsID.teamAId = matchRecord.winnerID;
                matchRecords[i].teamsID.managerAId = matchRecord.WinnermanagerId;
                if((matchRecord.winnerNo != undefined) && 
                    (matchRecords[i].teamsNo != undefined) && 
                    (matchRecords[i].teamsNo.teamANo != undefined))
                {
                    matchRecords[i].teamsNo.teamANo = matchRecord.winnerNo;
  
                }
            } else {
                matchRecords[i].teams.teamB = matchRecord.winner;
                matchRecords[i].teamsID.teamBId = matchRecord.winnerID;
                matchRecords[i].teamsID.managerBId = matchRecord.WinnermanagerId;

                if((matchRecord.winnerNo != undefined) && 
                    (matchRecords[i].teamsNo != undefined) && 
                    (matchRecords[i].teamsNo.teamBNo != undefined))
                {
                    matchRecords[i].teamsNo.teamBNo = matchRecord.winnerNo;
                }
            }
            thisMatchRecord = matchRecords[i];
            Session.set("matchRecords", matchRecords);
            break;
        }
    }
    if (fromLeft) {
        var rightRMatches = Session.get("rightRMatches_team");
        for (let i = 0; i < rightRMatches.length; i++) {
            if (rightRMatches[i].matchNumber == thisMatchRecord.matchNumber
                 && rightRMatches[i].roundName != "BM"
                ) {
                rightRMatches[i] = thisMatchRecord;
                Session.set("rightRMatches_team", rightRMatches);
            }
        }
    }
}

function setJsonForTeam(sets, minScoresToWin, byeWalkoverSets, teamAorB) {
    var minDifference = 0;
    minScoresToWin = parseInt((minScoresToWin / 2)) + 1
    var jsonObj = JSON.parse(JSON.stringify(sets));
    var aSet1, aSet2, aSet3, aSet4, aSet5, aSet6, aSet7;
    var bSet1, bSet2, bSet3, bSet4, bSet5, bSet6, bSet7;
    var data;
    if (byeWalkoverSets >= 3) {
        var set1 = jsonObj.set1;
        var set2 = jsonObj.set2;
        var set3 = jsonObj.set3;


        var conditionScoreSet1 = Number(Math.abs(set1)) + Number(minDifference);
        var conditionScoreSet2 = Number(Math.abs(set2)) + Number(minDifference);
        var conditionScoreSet3 = Number(Math.abs(set3)) + Number(minDifference);

        if (set1 < 0) {
            aSet1 = Math.abs(set1);
            if (conditionScoreSet1 <= Number(minScoresToWin))
                bSet1 = Number(minScoresToWin);
            else
                bSet1 = Number(conditionScoreSet1);
        } else if (set1 > 0) {
            aSet1 = set1;
            if (conditionScoreSet1 <= Number(minScoresToWin))
                bSet1 = Number(minScoresToWin);
            else
                bSet1 = Number(conditionScoreSet1);
        } else {
            if (set1.trim().length != 0 && set1 == 0) {
                bSet1 = Number(minScoresToWin);
            } else {
                bSet1 = 0
            }

            aSet1 = 0;
        }

        if (set2 < 0) {
            aSet2 = Math.abs(set2);;
            if (conditionScoreSet2 <= Number(minScoresToWin))
                bSet2 = Number(minScoresToWin);
            else
                bSet2 = Number(conditionScoreSet2);
        } else if (set2 > 0) {
            aSet2 = set2;
            if (conditionScoreSet2 <= Number(minScoresToWin))
                bSet2 = Number(minScoresToWin);
            else
                bSet2 = Number(conditionScoreSet2);
        } else {
            if (set2.trim().length != 0 && set2 == 0) {
                bSet2 = Number(minScoresToWin);
            } else {
                bSet2 = 0
            }
            aSet2 = 0;
        }

        if (set3 < 0) {
            aSet3 = Math.abs(set3);
            if (conditionScoreSet3 <= Number(minScoresToWin))
                bSet3 = Number(minScoresToWin);
            else
                bSet3 = Number(conditionScoreSet3);
        } else if (set3 > 0) {
            aSet3 = set3;
            if (conditionScoreSet3 <= Number(minScoresToWin))
                bSet3 = Number(minScoresToWin);
            else
                bSet3 = Number(conditionScoreSet3);
        } else {
            if (set3.trim().length != 0 && set3 == 0) {
                bSet3 = Number(minScoresToWin);
            } else {
                bSet3 = 0
            }
            aSet3 = 0;
        }

        if (set1 == Number(minScoresToWin)) {
            bSet1 = 0;
        }
        if (set2 == Number(minScoresToWin)) {
            bSet2 = 0;
        }
        if (set3 == Number(minScoresToWin)) {
            bSet3 = 0;
        }
        if (set1 == -Number(minScoresToWin)) {
            bSet1 = Number(minScoresToWin);
            aSet1 = 0;
        }
        if (set2 == -Number(minScoresToWin)) {
            bSet2 = Number(minScoresToWin);
            aSet2 = 0;
        }
        if (set3 == -Number(minScoresToWin)) {
            bSet3 = Number(minScoresToWin);
            aSet3 = 0;
        }
        //
        if (set1 > Number(minScoresToWin)) {
            bSet1 = 0;
            aSet1 = Number(minScoresToWin)
        }
        if (set2 > Number(minScoresToWin)) {
            bSet2 = 0;
            aSet2 = Number(minScoresToWin)
        }
        if (set3 > Number(minScoresToWin)) {
            bSet3 = 0;
            aSet3 = Number(minScoresToWin)
        }
        if (set1 < -Number(minScoresToWin)) {
            bSet1 = Number(minScoresToWin);
            aSet1 = 0;
        }
        if (set2 < -Number(minScoresToWin)) {
            bSet2 = Number(minScoresToWin);
            aSet2 = 0;
        }
        if (set3 < -Number(minScoresToWin)) {
            bSet3 = Number(minScoresToWin);
            aSet3 = 0;
        }

        data = {
            scores: {
                "setScoresA": ["" + aSet1 + "", "" + aSet2 + "", "" + aSet3 + "", "0", "0", "0", "0"],
                "setScoresB": ["" + bSet1 + "", "" + bSet2 + "", "" + bSet3 + "", "0", "0", "0", "0"]
            }
        }

    }
    if (byeWalkoverSets >= 5) {
        var set4 = jsonObj.set4;
        var set5 = jsonObj.set5;

        var conditionScoreSet4 = Number(Math.abs(set4)) + Number(minDifference);
        var conditionScoreSet5 = Number(Math.abs(set5)) + Number(minDifference);

        if (set4 < 0) {
            aSet4 = Math.abs(set4);
            if (conditionScoreSet4 <= Number(minScoresToWin))
                bSet4 = Number(minScoresToWin);
            else
                bSet4 = Number(conditionScoreSet4);
        } else if (set4 > 0) {
            aSet4 = set4;
            if (conditionScoreSet4 <= Number(minScoresToWin))
                bSet4 = Number(minScoresToWin);
            else
                bSet4 = Number(conditionScoreSet4);
        } else {
            if (set4.trim().length != 0 && set4 == 0) {
                bSet4 = Number(minScoresToWin);
            } else {
                bSet4 = 0
            }
            aSet4 = 0;
        }

        if (set5 < 0) {
            aSet5 = Math.abs(set5);
            if (conditionScoreSet5 <= Number(minScoresToWin))
                bSet5 = Number(minScoresToWin);
            else
                bSet5 = Number(conditionScoreSet5);
        } else if (set5 > 0) {
            aSet5 = set5;
            if (conditionScoreSet5 <= Number(minScoresToWin))
                bSet5 = Number(minScoresToWin);
            else
                bSet5 = Number(conditionScoreSet5);
        } else {
            if (set5.trim().length != 0 && set5 == 0) {
                bSet5 = Number(minScoresToWin);
            } else {
                bSet5 = 0
            }
            aSet5 = 0;
        }

        if (set4 == Number(minScoresToWin)) {
            bSet4 = 0;
        }
        if (set5 == Number(minScoresToWin)) {
            bSet5 = 0;
        }
        if (set4 == -Number(minScoresToWin)) {
            bSet4 = Number(minScoresToWin);
            aSet4 = 0;
        }
        if (set5 == -Number(minScoresToWin)) {
            bSet5 = Number(minScoresToWin);
            aSet5 = 0;
        }
        //
        if (set4 > Number(minScoresToWin)) {
            bSet4 = 0;
            aSet4 = Number(minScoresToWin);
        }
        if (set5 > Number(minScoresToWin)) {
            bSet5 = 0;
            aSet5 = Number(minScoresToWin);
        }
        if (set4 < -Number(minScoresToWin)) {
            bSet4 = Number(minScoresToWin);
            aSet4 = 0;
        }
        if (set5 < -Number(minScoresToWin)) {
            bSet5 = Number(minScoresToWin);
            aSet5 = 0;
        }


        data = {
            scores: {
                "setScoresA": ["" + aSet1 + "", "" + aSet2 + "", "" + aSet3 + "", "" + aSet4 + "", "" + aSet5 + "", "0", "0"],
                "setScoresB": ["" + bSet1 + "", "" + bSet2 + "", "" + bSet3 + "", "" + bSet4 + "", "" + bSet5 + "", "0", "0"]
            }
        }

    }
    if (byeWalkoverSets == 7) {
        var set6 = jsonObj.set6;
        var set7 = jsonObj.set7;

        var conditionScoreSet6 = Number(Math.abs(set6)) + Number(minDifference);
        var conditionScoreSet7 = Number(Math.abs(set7)) + Number(minDifference);

        if (set6 < 0) {
            aSet6 = Math.abs(set6);
            if (conditionScoreSet6 <= Number(minScoresToWin))
                bSet6 = Number(minScoresToWin);
            else
                bSet6 = Number(conditionScoreSet6);
        } else if (set6 > 0) {
            aSet6 = set6;
            if (conditionScoreSet6 <= Number(minScoresToWin))
                bSet6 = Number(minScoresToWin);
            else
                bSet6 = Number(conditionScoreSet6);
        } else {
            if (set6.trim().length != 0 && set6 == 0) {
                bSet6 = Number(minScoresToWin);
            } else {
                bSet6 = 0
            }
            aSet6 = 0;
        }

        if (set7 < 0) {
            aSet7 = Math.abs(set7);
            if (conditionScoreSet7 <= Number(minScoresToWin))
                bSet7 = Number(minScoresToWin);
            else
                bSet7 = Number(conditionScoreSet7);
        } else if (set7 > 0) {
            aSet7 = set7;
            if (conditionScoreSet7 <= Number(minScoresToWin))
                bSet7 = Number(minScoresToWin);
            else
                bSet7 = Number(conditionScoreSet7);
        } else {
            if (set7.trim().length != 0 && set7 == 0) {
                bSet7 = Number(minScoresToWin);
            } else {
                bSet7 = 0
            }
            aSet7 = 0;
        }

        if (set6 == Number(minScoresToWin)) {
            bSet6 = 0;
        }
        if (set7 == Number(minScoresToWin)) {
            bSet7 = 0;
        }
        if (set6 == -Number(minScoresToWin)) {
            bSet6 = Number(minScoresToWin);
            aSet6 = 0;
        }
        if (set7 == -Number(minScoresToWin)) {
            bSet7 = Number(minScoresToWin);
            aSet7 = 0;
        }
        //
        if (set6 > Number(minScoresToWin)) {
            bSet6 = 0;
            aSet6 = Number(minScoresToWin);
        }
        if (set7 > Number(minScoresToWin)) {
            bSet7 = 0;
            aSet7 = Number(minScoresToWin);
        }
        if (set6 < -Number(minScoresToWin)) {
            bSet6 = Number(minScoresToWin);
            aSet6 = 0;
        }
        if (set7 < -Number(minScoresToWin)) {
            bSet7 = Number(minScoresToWin);
            aSet7 = 0;
        }

        data = {
            scores: {
                "setScoresA": ["" + aSet1 + "", "" + aSet2 + "", "" + aSet3 + "", "" + aSet4 + "", "" + aSet5 + "", "" + aSet6 + "", "" + aSet7 + ""],
                "setScoresB": ["" + bSet1 + "", "" + bSet2 + "", "" + bSet3 + "", "" + bSet4 + "", "" + bSet5 + "", "" + bSet6 + "", "" + bSet7 + ""]
            }
        }

    }
    if (teamAorB == "completedA_team") {
        var setScoresA = JSON.parse(JSON.stringify(data)).scores.setScoresA;
        var setScoresB = JSON.parse(JSON.stringify(data)).scores.setScoresB;
        data = {
            scores: {
                "setScoresA": setScoresA,
                "setScoresB": setScoresB
            }
        }
    } else if (teamAorB == "completedB_team") {
        var setScoresB = JSON.parse(JSON.stringify(data)).scores.setScoresA;
        var setScoresA = JSON.parse(JSON.stringify(data)).scores.setScoresB;
        data = {
            scores: {
                "setScoresA": setScoresA,
                "setScoresB": setScoresB
            }
        }
    }
    return data;

}