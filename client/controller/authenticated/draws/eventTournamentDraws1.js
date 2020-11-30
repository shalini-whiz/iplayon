Session.set("selectedSport", "Table Tennis");
Session.set("eventName", false);
Session.set("selectedRound", 1);
Session.set("showDraws", false);
Session.set("matchCollection", "");
Session.set("maxRoundNum", 1);
Session.set("maxGroupNum", 1);
Session.set("tourEventType",undefined);

Template.eventTournamentDraws1.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
   // this.subscribe("tournamentCategories",Router.current().params._id)
    var self = this;
    self.autorun(function () {
     self.subscribe("tournamentCategories", Session.get("tournamentId"));
    });

});

Template.eventTournamentDraws1.onRendered(function() {
    Session.set("tournamentId", Router.current().params._id);
    Session.set("tourEventName",undefined);
    Session.set("projectTypeOfEventView", undefined)
});


Template.eventTournamentDraws1.events({

    "change #selectWhich": function(event, template) {
        event.preventDefault();
        var selectedEvent = event.target.value;
        Session.set("tourEventName",selectedEvent);
        Session.set("selectedRound", 1);

         var eventDetails = events.findOne({
                "tournamentId": Session.get("tournamentId"),
                eventName: Session.get("tourEventName")
            });
            if (eventDetails == undefined) 
            {
                eventDetails = pastEvents.findOne({
                    "tournamentId": Session.get("tournamentId"),
                    eventName: Session.get("tourEventName")
                });
            }
            if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 1) {
                fnGetMatches();
            } else if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 2) {
                fnGetTeamMatches();
            }

    }
});





Template.eventTournamentDraws1.helpers({
     tournamentName:function(){
        var data = events.findOne({"_id":Session.get("tournamentId")});
        if(data)
            return data.eventName
        else 
        {
            data = pastEvents.findOne({"_id":Session.get("tournamentId")});
            if(data)
                return data.eventName
        }
    },
     drawEvents:function(){
        try{
            var result = ReactiveMethod.call('drawsEvents',Session.get("tournamentId"));
            if(result)
            {
                if(Session.get("tourEventName") == undefined)
                {
                    Session.set("tourEventName",result[0]);
                    
                    var x = events.find({}).fetch();

                    var eventDetails = events.findOne({
                        "tournamentId": Session.get("tournamentId"),
                        eventName: Session.get("tourEventName")});
                    if(eventDetails == undefined) 
                    {
                        eventDetails = pastEvents.findOne({
                            "tournamentId": Session.get("tournamentId"),
                            eventName: Session.get("tourEventName")
                        });
                    }

                    if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 1) {
                        fnGetMatches();
                    } else if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 2) {

                        fnGetTeamMatches();
                    }

                }
               
                return result;
            }
               
        }catch(e){
        }
    },
     setEvent:function(eventName)
    {
        if(Session.get("eventName") && Session.get("eventName") == eventName)
            return "selected"
    }
});

Template.draws.helpers({
    drawsEventName: function() {
        return Session.get("tourEventName");
    }

})

export function fnGetMatches() {
     try{
            Session.set("tourEventType","individual");
            var tournamentId = Session.get("tournamentId");
            var eventName = Session.get("tourEventName");
            var roundNumber = Session.get("selectedRound");

            if(tournamentId != null && eventName != null)
            {
                Meteor.call("getMatchesFromDB", tournamentId, eventName, function(error, result) {
                    if (error) {} else {
                        try {
                            //related to dobfilters //
                            var eventInfo;
                            var tourInfo;
                            if (Router.current().params._eventType && Router.current().params._eventType == "past")
                                eventInfo = pastEvents.findOne({
                                    "tournamentId": tournamentId,
                                    "eventName": eventName
                                })
                            else
                                eventInfo = events.findOne({
                                    "tournamentId": tournamentId,
                                    "eventName": eventName
                                })
                            if (eventInfo) {
                                var sportID = "";
                                var eventProjectId = "";
                                var eventOrganizer = ""
                                if (eventInfo.projectId && eventInfo.eventOrganizer) {
                                    eventProjectId = eventInfo.projectId[0];
                                    eventOrganizer = eventInfo.eventOrganizer;
                                    Session.set("eventOrganizer", eventOrganizer);
                                }
                                if (Router.current().params._eventType && Router.current().params._eventType == "past")
                                    tourInfo = pastEvents.findOne({
                                        "_id": tournamentId,
                                        "tournamentEvent": true
                                    });
                                else
                                    tourInfo = events.findOne({
                                        "_id": tournamentId,
                                        "tournamentEvent": true
                                    });

                                if (tourInfo && tourInfo.projectId) {
                                    sportID = tourInfo.projectId[0];
                                    Session.set("sportID", sportID);
                                }

                              
                            }




                            // related to dobfilters//
                            Session.set('matchRecords', result);
                            var leftRMatches = [];
                            var centerRMatches = [];
                            var rightRMatches = [];
                            var lastMatchNum = (result.length) - 1;

                            var maxRoundNum = result[lastMatchNum].roundNumber;
                            Session.set("maxRoundNum", maxRoundNum);
                            for (var i = 0; i < result.length; i++) {
                                if(roundNumber == null)
                                    roundNumber = 1;
                                
                                    if (result[i].roundNumber == roundNumber) {
                                        leftRMatches.push(result[i]);
                                    } 
                                    else if (result[i].roundNumber <= maxRoundNum) {

                                        if (result[i].roundNumber == (roundNumber + 1)) {
                                            // this means, this is not the final round!
                                            centerRMatches.push(result[i]);
                                        }
                                        if (result[i].roundNumber == (roundNumber + 2)) {
                                            // this means, this is not the final round!
                                            rightRMatches.push(result[i]);
                                        }
                                        
                                    }
                               
                               
                            }
                            Session.set("leftRMatches", leftRMatches);
                            Session.set("centerRMatches",centerRMatches);
                            Session.set("rightRMatches", rightRMatches);

                                                return true;

                        } catch (e) {
                            Session.set("maxRoundNum", 1);
                            var leftRMatches = [];
                            var centerRMatches = [];
                            var rightRMatches = [];
                            Session.set("leftRMatches", leftRMatches);
                            Session.set("centerRMatches",centerRMatches);
                            Session.set("rightRMatches", rightRMatches);

                            return true;
                        }
                    }
                }); 
            }
            else
                return false;
           
        }catch(e){
                return false;
        }

}

export function fnGetTeamMatches () {
    try {

        Session.set("tourEventType","team");
        var tournamentId = Session.get("tournamentId");
        var eventName = Session.get("tourEventName");
        var roundNumber = Session.get("selectedRound");
        Session.set("leftRMatches", undefined);
        Session.set("rightRMatches", undefined);
        Meteor.call("getTeamMatchesFromDB", tournamentId, eventName, function(error, result) {
            if (error) {} else if (result.length != 0) {
                try {
                    Session.set('matchRecords', result);
                    var leftRMatches = [];
                    var centerRMatches = [];
                    var rightRMatches = [];
                    var lastMatchNum = (result.length) - 1;
                    var maxRoundNum = result[lastMatchNum].roundNumber;
                    Session.set("maxRoundNum", maxRoundNum);
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].roundNumber == roundNumber) {
                                        leftRMatches.push(result[i]);
                                    } 
                                    else if (result[i].roundNumber <= maxRoundNum) {

                                        if (result[i].roundNumber == (roundNumber + 1)) {
                                            // this means, this is not the final round!
                                            centerRMatches.push(result[i]);
                                        }
                                        if (result[i].roundNumber == (roundNumber + 2)) {
                                            // this means, this is not the final round!
                                            rightRMatches.push(result[i]);
                                        }
                                        
                                    }
                    }
                    Session.set("leftRMatches", leftRMatches);
                    Session.set("centerRMatches",centerRMatches);
                    Session.set("rightRMatches", rightRMatches);
                                                                    return true;

                } catch (e) {}
            }
        });
      
    } catch (e) {}
}

Template.drawsConfiguration.onRendered(function(){
    Session.set("leftRMatches", undefined);
    Session.set("centerRMatches",undefined);
    Session.set("rightRMatches", undefined);

})

Template.drawsConfiguration.events({


    "click #eventIcon":function(event){
       //$("#selectWhich").simulate('mousedown');
         //  $('select#selectWhich').chosen("open");
   },

    "change #selectWhich": function(event, template) {
        event.preventDefault();
        var selectedEvent = event.target.value;
        Session.set("tourEventName",selectedEvent);
        Session.set("selectedRound", 1);

         var eventDetails = events.findOne({
                "tournamentId": Session.get("tournamentId"),
                eventName: Session.get("tourEventName")
            });
            if (eventDetails == undefined) 
            {
                eventDetails = pastEvents.findOne({
                    "tournamentId": Session.get("tournamentId"),
                    eventName: Session.get("tourEventName")
                });
            }
            if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 1) {
                fnGetMatches();
            } else if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 2) {
                fnGetTeamMatches();
            }

    },
    "click [id^=round]":function(event){
        if(this.roundNumber)
        {
            $(event.target).closest("td").siblings().css("border","1px solid #F0F0F0");
            $(event.target).closest("tr").siblings().find("td").siblings().css("border","1px solid #F0F0F0");

            var row = $(event.target).closest('td');
            $(row).css('border', '2px solid #0091d2');
            var selectedRound = parseInt(this.roundNumber);
            Session.set("selectedRound", selectedRound);
            var eventDetails = events.findOne({
                "tournamentId": Session.get("tournamentId"),
                eventName: Session.get("tourEventName")
            });
            if (eventDetails == undefined) 
            {
                eventDetails = pastEvents.findOne({
                    "tournamentId": Session.get("tournamentId"),
                    eventName: Session.get("tourEventName")
                });
            }
            if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 1) {
                fnGetMatches();
            } else if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 2) {
                fnGetTeamMatches();
            }

        }
    },
    "click [id^=match_id]":function(event){
        if(this.roundNumber)
        {
            $(event.target).closest("td").siblings().css("border","1px solid #F0F0F0");
            $(event.target).closest("tr").siblings().find("td").siblings().css("border","1px solid #F0F0F0");

            var row = $(event.target).closest('td');
            $(row).css('border', '2px solid #0091d2');
            var selectedRound = parseInt(this.roundNumber);

            if(selectedRound != Session.get("selectedRound"))
            {
                Session.set("selectedRound", selectedRound);
                var eventDetails = events.findOne({
                    "tournamentId": Session.get("tournamentId"),
                    eventName: Session.get("tourEventName")
                });
                if (eventDetails == undefined) 
                {
                    eventDetails = pastEvents.findOne({
                        "tournamentId": Session.get("tournamentId"),
                        eventName: Session.get("tourEventName")
                    });
                }
                if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 1) {
                    fnGetMatches();
                } else if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 2) {
                    fnGetTeamMatches();
                }
            }
           
            
        }
    }
})

Template.drawsConfiguration.helpers({

    drawEvents:function(){
        try{
            var result = ReactiveMethod.call('drawsEvents',Session.get("tournamentId"));
            if(result)
            {
                if(Session.get("tourEventName") == undefined)
                {
                    Session.set("tourEventName",result[0]);
                    var eventDetails = events.findOne({
                        "tournamentId": Session.get("tournamentId"),
                        eventName: Session.get("tourEventName")});
                    if(eventDetails == undefined) 
                    {
                        eventDetails = pastEvents.findOne({
                            "tournamentId": Session.get("tournamentId"),
                            eventName: Session.get("tourEventName")
                        });
                    }
                    if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 1) {
                        fnGetMatches();
                    } else if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 2) {
                        fnGetTeamMatches();
                    }
                }
               

                return result;
            }
               
        }catch(e){

        }
    },
    setEvent:function(eventName)
    {
        if(Session.get("eventName") && Session.get("eventName") == eventName)
            return "selected"
    },
    drawsConf: function() {

        var eventName =  Session.get("tourEventName");
        var result = ReactiveMethod.call("fetchRounds",Session.get("tournamentId"),eventName);
        if(result)
        {
            return result;
        }
    },

    drawsConfMatches:function(){
        var result = ReactiveMethod.call("fetchRoundMatches",Session.get("tournamentId"),Session.get("tourEventName"))
        if(result)
        {
            if(result)
                Session.set("detScores",result);
            
            return result;
        }
        
    },
    drawsTd:function(){
        var a = new Array(4);
        a[0] = 1;
        a[1] = 2;
        a[2] = 3;
        a[3] = 4;
        a[4] = 5;
        return a;
    },
    
    setTdStyle:function(roundName)
    {
        if(roundName == "SF")
            return "";
        else if(roundName == "F")
            return "";
        else
            return "";

    },
   
   
    generateRoundName:function(roundNumber,roundName)
    {   
        if(roundName == "QF")
            return "QF";
        else if(roundName == "SF")
            return "SF";
        else if(roundName == "F")
            return "F";
        else if(roundName == "PQF")
            return "PQF"
        else 
            return "R"+roundNumber;
    },
  
    drawsEventName:function(){
        return Session.get("tourEventName")
    },
    tournamentName:function(){
        var data = events.findOne({"_id":Session.get("tournamentId")});
        if(data)
            return data.eventName
        else 
        {
            data = pastEvents.findOne({"_id":Session.get("tournamentId")});
            if(data)
                return data.eventName
        }
    },
    "drawsHaul":function(){
        var eventDetails = events.findOne({
                "tournamentId": Session.get("tournamentId"),
                eventName: Session.get("tourEventName")
            });
            if (eventDetails == undefined) 
            {
                eventDetails = pastEvents.findOne({
                    "tournamentId": Session.get("tournamentId"),
                    eventName: Session.get("tourEventName")
                });
            }
            if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 1) {
                fnGetMatches();
            } else if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 2) {
                fnGetTeamMatches();
            }

    },
    tourIdDraws: function() {
        return Router.current().params._id;
    },
    getRoundNumber:function(data){
        return parseInt(data)+1;
    },
    lRoundNum: function() {
        return (Session.get("selectedRound"));
    },
    inc:function(matchIndex,index){
        var m = parseInt(matchIndex) +1;
        return parseInt(m)+parseInt(index);

    },
    checkRowMatch:function(rowIndex,roundName){

        if(roundName == "SF" && (rowIndex == 3 || rowIndex == 4))
            return true;
        else if(roundName == "F" && (rowIndex == 2 || rowIndex == 3 || rowIndex == 4))
            return true;

    },
    fetchMatchNumber:function(parentIndex,currentIndex){
        try {
        var pI = parseInt(parentIndex)+1;
        var cI = parseInt(currentIndex)+1;
        if(Session.get("detScores"))
        {
            var detScores = Session.get("detScores");
            var filtered = _.find(detScores, function (entry) {
                if(entry._id == cI)
                    return entry;
            });
            if(filtered && filtered.dots)
            {
                if(parentIndex == 1)
                    return filtered.startMatchNo;
                else
                {
                    var m =(parseInt(parentIndex) * parseInt(filtered.dots));
                    var mc = ( (parseInt(m) - parseInt(filtered.dots)) + parseInt(filtered.startMatchNo))
                    return mc; 
                }     
            }

        } 
    } catch (e) {
    }
    },
    leftRMatchName:function(){
        if(Session.get("leftRMatches"))
        {
            var matchDetails = Session.get("leftRMatches");
            if(matchDetails && matchDetails.length > 0 && matchDetails[0].roundNumber)
            {
                if(matchDetails[0].roundName)
                {
                    if(matchDetails[0].roundName == "QF")
                        return "Quarter Final ";
                    else if(matchDetails[0].roundName == "SF")
                        return "Semi Final";
                    else if(matchDetails[0].roundName == "F")
                        return "Final"
                    else
                        return "Round "+matchDetails[0].roundNumber;
                }
                else
                {

                }
            }
        }

    },
    centerRMatchName:function(){
        if(Session.get("centerRMatches"))
        {
            var matchDetails = Session.get("centerRMatches");
            if(matchDetails && matchDetails.length > 0 && matchDetails[0].roundNumber)
            {
                if(matchDetails[0].roundName)
                {
                    if(matchDetails[0].roundName == "QF")
                        return "Quarter Final ";
                    else if(matchDetails[0].roundName == "SF")
                        return "Semi Final";
                    else if(matchDetails[0].roundName == "F")
                        return "Final"
                    else
                        return "Round "+matchDetails[0].roundNumber;
                }
                else
                {

                }
            }
        }
    },
    rightRMatchName:function(){
        if(Session.get("rightRMatches"))
        {
            var matchDetails = Session.get("rightRMatches");
            if(matchDetails && matchDetails.length > 0 && matchDetails[0].roundNumber)
            {
                if(matchDetails[0].roundName)
                {
                    if(matchDetails[0].roundName == "QF")
                        return "Quarter Final ";
                    else if(matchDetails[0].roundName == "SF")
                        return "Semi Final";
                    else if(matchDetails[0].roundName == "F")
                        return "Final"
                    else
                        return "Round "+matchDetails[0].roundNumber;
                }
                else
                {

                }
            }
        }
    },
    leftRMatches: function() {
        return Session.get("leftRMatches");
    },
    centerRMatches:function(){
        return Session.get("centerRMatches");
    },
    rRoundNum: function() {
        return (1 + Session.get("selectedRound"));
    },
    rightRMatches: function() {
        return (Session.get("rightRMatches"));
    },
    matchNumber1: function() {
        return (this.matchNumber);
    },
    playerA: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual"){
                if(this.players.playerA != "()")
                    return (this.players.playerA);
            }
            else if(Session.get("tourEventType") == "team")
            {
                 if(this.teams.teamA != "()")
                    return (this.teams.teamA);
            }
            
        }
        
    },
    AS1: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual"){
                if(this.players.playerA)
                {
                    if(this.players.playerA.length > 0)
                        return (this.scores.setScoresA[0]);
                }
            }
            else if(Session.get("tourEventType") == "team"){
                if(this.teams.teamA)
                {
                    if(this.teams.teamA.length > 0)
                        return (this.scores.setScoresA[0]);
                }
            }

        }
    },
    AS2: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual")
            {
                if(this.players.playerA && this.players.playerA.length > 0)
                {
                    return (this.scores.setScoresA[1]);
                }
            }
            else if(Session.get("tourEventType") == "team")
            {
                if(this.teams.teamA && this.teams.teamA.length > 0)
                {
                    return (this.scores.setScoresA[1]);
                }
            }
        }

    },
    AS3: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual")
            {
                if(this.players.playerA && this.players.playerA.length > 0)
                {
                    return (this.scores.setScoresA[2]);
                }
            }
            else if(Session.get("tourEventType") == "team")
            {
                if(this.teams.teamA && this.teams.teamA.length > 0)
                {
                    return (this.scores.setScoresA[2]);
                }
            }
        }
    },
    AS4: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual")
            {
                if(this.players.playerA && this.players.playerA.length > 0)
                {
                    return (this.scores.setScoresA[3]);
                }
            }
            else if(Session.get("tourEventType") == "team")
            {
                if(this.teams.teamA && this.teams.teamA.length > 0)
                {
                    return (this.scores.setScoresA[3]);
                }
            }
        }
    },
    AS5: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual")
            {
                if(this.players.playerA && this.players.playerA.length > 0)
                {
                    return (this.scores.setScoresA[4]);
                }
            }
            else if(Session.get("tourEventType") == "team")
            {
                if(this.teams.teamA && this.teams.teamA.length > 0)
                {
                    return (this.scores.setScoresA[4]);
                }
            }
        }
    },
    AS6: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual")
            {
                if(this.players.playerA && this.players.playerA.length > 0)
                {                 
                    if (this.scores.setScoresA.length < 6)
                        return 0;
                    return (this.scores.setScoresA[5]);
                }
            }
            else  if(Session.get("tourEventType") == "team")
            {
                if(this.teams.teamA && this.teams.teamA.length > 0)
                {             
                    if (this.scores.setScoresA.length < 6)
                        return 0;
                    return (this.scores.setScoresA[5]);
                    
                }
            }
        }
    },
    AS7: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual")
            {
                if(this.players.playerA && this.players.playerA.length > 0)
                {
                    if (this.scores.setScoresA.length < 7)
                        return 0;
                    return (this.scores.setScoresA[6]);
                }
            }
            else if(Session.get("tourEventType") == "team")
            {
                if(this.teams.teamA && this.teams.teamA.length > 0)
                {          
                    if (this.scores.setScoresA.length < 7)
                        return 0;
                    return (this.scores.setScoresA[6]);
                }
            }
        }
    },
    playerB: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual")
            {
                if(this.players.playerB != "()")
                    return (this.players.playerB);
            }
            else if(Session.get("tourEventType") == "team")
            {
                if(this.teams.teamB != "()")
                    return (this.teams.teamB);
            }
        }
    },
    BS1: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual")
            {
                if(this.players.playerB && this.players.playerB.length > 0)
                {
                    return (this.scores.setScoresB[0]);
                }
            }
            else if(Session.get("tourEventType") == "team")
            {
                if(this.teams.teamB && this.teams.teamB.length > 0)
                {
                    return (this.scores.setScoresB[0]);
                }
            }
        }
    },
    BS2: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual")
            {
                if(this.players.playerB && this.players.playerB.length > 0)
                {
                        return (this.scores.setScoresB[1]);
                }
            }
            else if(Session.get("tourEventType") == "team")
            {
                if(this.teams.teamB && this.teams.teamB.length > 0)
                {
                        return (this.scores.setScoresB[1]);
                }
            }
        }
    },
    BS3: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual")
            {
                if(this.players.playerB && this.players.playerB.length > 0)
                {
                        return (this.scores.setScoresB[2]);
                }
            }
            else if(Session.get("tourEventType") == "team")
            {
                if(this.teams.teamB && this.teams.teamB.length > 0)
                {
                        return (this.scores.setScoresB[2]);
                }
            }
        }
    },
    BS4: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual")
            {
                if(this.players.playerB && this.players.playerB.length > 0)
                {
                    return (this.scores.setScoresB[3]);
                }
            }
            else if(Session.get("tourEventType") == "team")
            {
                if(this.teams.teamB && this.teams.teamB.length > 0)
                {
                    return (this.scores.setScoresB[3]);
                }
            }
        }
    },
    BS5: function() {
         if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual")
            {
                if(this.players.playerB && this.players.playerB.length > 0)
                {
                    return (this.scores.setScoresB[4]);
                }
            }
            else if(Session.get("tourEventType") == "team")
            {
                if(this.teams.teamB && this.teams.teamB.length > 0)
                {
                    return (this.scores.setScoresB[4]);
                }
            }
        }
    },
    BS6: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual")
            {
                if(this.players.playerB && this.players.playerB.length > 0)
                {
                    if (this.scores.setScoresB.length < 6)
                        return 0;
                    return (this.scores.setScoresB[5]);
                    
                }
            }
            else if(Session.get("tourEventType") == "team")
            {
                if(this.teams.teamB && this.teams.teamB.length > 0)
                {
                    if (this.scores.setScoresB.length < 6)
                        return 0;
                    return (this.scores.setScoresB[5]);
                    
                }
            }
        }
    },
    BS7: function() {
        if(Session.get("tourEventType"))
        {
            if(Session.get("tourEventType") == "individual")
            {
                if(this.players.playerB && this.players.playerB.length > 0)
                {
                    if (this.scores.setScoresB.length < 7)
                        return 0;
                    return (this.scores.setScoresB[6]);   
                }
            }
            else if(Session.get("tourEventType") == "team")
            {
                if(this.teams.teamB && this.teams.teamB.length > 0)
                {
                    if (this.scores.setScoresB.length < 7)
                        return 0;
                    return (this.scores.setScoresB[6]);   
                }
            }
        }
    },

    AS1Settings: function() {
        if (parseInt(this.scores.setScoresA[0]) != 0) {
            if (parseInt(this.scores.setScoresA[0]) < parseInt(this.scores.setScoresB[0])) {
                return "";

            } else {
                return "font-weight:bold";

            }
        }

    },
    AS2Settings: function() {
        if (parseInt(this.scores.setScoresA[1]) != 0) {
            if (parseInt(this.scores.setScoresA[1]) < parseInt(this.scores.setScoresB[1]))
                return "";
            else
                return "font-weight:bold";
        }

    },
    AS3Settings: function() {
        if (parseInt(this.scores.setScoresA[2]) != 0) {
            if (parseInt(this.scores.setScoresA[2]) < parseInt(this.scores.setScoresB[2]))
                return "";
            else
                return "font-weight:bold";
        }

    },
    AS4Settings: function() {
        if (parseInt(this.scores.setScoresA[3]) != 0) {
            if (parseInt(this.scores.setScoresA[3]) < parseInt(this.scores.setScoresB[3]))
                return "";
            else
                return "font-weight:bold";
        }

    },
    AS5Settings: function() {

        if (parseInt(this.scores.setScoresA[4]) != 0) {
            if (parseInt(this.scores.setScoresA[4]) < parseInt(this.scores.setScoresB[4]))
                return "";
            else
                return "font-weight:bold";
        }

    },
    AS6Settings: function() {
        if (this.scores.setScoresA.length < 6)
            return "";

        else if (parseInt(this.scores.setScoresA[5]) != 0) {
            if (parseInt(this.scores.setScoresA[5]) < parseInt(this.scores.setScoresB[5]))
                return "";
            else
                return "font-weight:bold";
        }

    },
    AS7Settings: function() {
        if (this.scores.setScoresA.length < 7)
            return "";
        else if (parseInt(this.scores.setScoresA[6]) != 0) {
            if (parseInt(this.scores.setScoresA[6]) < parseInt(this.scores.setScoresB[6]))
                return "";
            else
                return "font-weight:bold";
        }

    },
    BS1Settings: function() {
        if (parseInt(this.scores.setScoresB[0]) != 0) {
            if (parseInt(this.scores.setScoresA[0]) > parseInt(this.scores.setScoresB[0]))
                return "";
            else
                return "font-weight:bold";
        }

    },
    BS2Settings: function() {
        if (parseInt(this.scores.setScoresB[1]) != 0) {
            if (parseInt(this.scores.setScoresA[1]) > parseInt(this.scores.setScoresB[1]))
                return "";
            else
                return "font-weight:bold";
        }

    },
    BS3Settings: function() {
        if (parseInt(this.scores.setScoresB[2]) != 0) {
            if (parseInt(this.scores.setScoresA[2]) > parseInt(this.scores.setScoresB[2]))
                return "";
            else
                return "font-weight:bold";
        }

    },
    BS4Settings: function() {
        if (parseInt(this.scores.setScoresB[3]) != 0) {
            if (parseInt(this.scores.setScoresA[3]) > parseInt(this.scores.setScoresB[3]))
                return "";
            else
                return "font-weight:bold";
        }

    },
    BS5Settings: function() {

        if (parseInt(this.scores.setScoresB[4]) != 0) {
            if (parseInt(this.scores.setScoresA[4]) > parseInt(this.scores.setScoresB[4]))
                return "";
            else
                return "font-weight:bold";
        }

    },
    BS6Settings: function() {
        if (this.scores.setScoresB.length < 6)
            return "";

        else if (parseInt(this.scores.setScoresB[5]) != 0) {
            if (parseInt(this.scores.setScoresA[5]) > parseInt(this.scores.setScoresB[5]))
                return "";
            else
                return "font-weight:bold";
        }

    },
    BS7Settings: function() {
        if (this.scores.setScoresB.length < 7)
            return "";
        else if (parseInt(this.scores.setScoresB[6]) != 0) {
            if (parseInt(this.scores.setScoresA[6]) > parseInt(this.scores.setScoresB[6]))
                return "";
            else
                return "font-weight:bold";
        }

    },

    getStatusColorA: function() {
        if (this.roundNumber == 1 && this.status2 == "bye")
        {
            if(this.getStatusColorA == "ip_input_box_type_pNameBye")
                return "pNameBye";
            else
                return "ip_input_box_type_pName"
        }
        else
            return this.getStatusColorA
    },
    getStatusColorB: function() {
        if (this.roundNumber == 1 && this.status2 == "bye")
        {
            if(this.getStatusColorB == "ip_input_box_type_pNameBye")
                return "pNameBye";
            else
                return "ip_input_box_type_pName"
        }
        else
            return this.getStatusColorB
    },
    matchNumber: function() {
        return this.matchNumber;
    },
    matchSettingsA: function() {
        if (this.roundNumber == 1 && this.status2 == "bye" && this.playersID.playerAId.trim() == "")
            {
                //return "visibility:hidden"
                return "";
            }
    },
    matchSettingsB: function() {
        if (this.roundNumber == 1 && this.status2 == "bye" && this.playersID.playerBId.trim() == ""){
            //return "visibility:hidden";
        }
    },
    matchSettingsBSettings: function() {
        if (this.roundNumber == 1 && this.status2 == "bye" && (this.playersID.playerAId.trim() == "" || this.playersID.playerBId.trim() == ""))
            return "font-size: 12px;cursor: pointer;visibility:hidden";
        else
            return "font-size: 12px;cursor: pointer;";
    },
    matchSettingsBScore: function() {
        if (this.roundNumber == 1 && this.status2 == "bye" && (this.playersID.playerAId.trim() == "" || this.playersID.playerBId.trim() == "")){

            //return "visibility:hidden";
        }

    },
    matchSettingsAScore: function() {
        if (this.roundNumber == 1 && this.status2 == "bye" && this.playersID.playerBId.trim() == ""){

            //return "visibility:hidden";
        }

    },


})



Template.registerHelper('checkIndexValue',function(parentIndex,currentIndex){
    try{
    if(parentIndex == 0)
    {
        var pI = parseInt(parentIndex)+1;
        var cI = parseInt(currentIndex)+1;

         if(Session.get("detScores"))
        {
            var detScores = Session.get("detScores");
            var filtered = _.find(detScores, function (entry) {
            if(entry._id == cI)
                return entry;
            });
            if(filtered && filtered.roundName)
            {
                return true;
            }

        }
    }
    else
        return false;
    }catch(e){
    }
})
Template.registerHelper('fetchIndexValue', function(parentIndex,currentIndex) {

    try {
        var pI = parseInt(parentIndex)+1;
        var cI = parseInt(currentIndex)+1;
        if(Session.get("detScores"))
        {
            var detScores = Session.get("detScores");
            var filtered = _.find(detScores, function (entry) {
                if(entry._id == cI)
                    return entry;
            });
            if(filtered && filtered.dots)
            {
                return _.range(filtered.dots);
            }

        } 
    } catch (e) {}
});



