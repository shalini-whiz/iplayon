Session.set("drawsEvents",undefined);


Template.homeResults.onCreated(function bodyOnCreated() {
   

});

Template.homeResults.helpers({

    "drawsEventscheckTour":function(){
        if(Session.get("drawsEvents"))
            return Session.get("drawsEvents")
    },
    "showResults":function(){
        if(Session.get("showResults"))
            return Session.get("showResults")
    },
    "showLResults":function()
    {
        if(Session.get("leftResults"))
            return Session.get("leftResults")
    },
    "showRResults":function(){
        if(Session.get("rightResults"))
            return Session.get("rightResults");
    },
    //Session.set("leftResults",leftMatches);
      //              Session.set("rightResults",rightMatches);


    "checkTour":function(){
        var result = ReactiveMethod.call('fetchUpcomingTournResults');
        if(result)
        {
            return result;
        }
    },
    "checkIndexVal":function(index)
    {
        if(index == 0)
        {
            return true;
        }
        else if(index%2 == 0)
        {
            return true;
        }
        else
            return false;
    },
    "newRow":function(index)
    {
        if(index % 2  == 0)
        {

            return "row";

        }
        else
            return "";
    },
    "closeRow":function(){
        return "</div>";
    },
    playerA: function() {
        
        if(this.players)
        {
           if(this.players.playerA != "()")
                    return (this.players.playerA); 
        }
        else if(this.teams)
        {
             if(this.teams.teamA != "()")
                    return (this.teams.teamA);
        }
 
    },
    imgAffiliationId:function(id){
        if(id != undefined && id != null && id != "")
        {
            
            var result = ReactiveMethod.call('fetchTempAff',id);
            if(result)
            {
                return result;
            }
        }
    },
    playerB: function() {  
        if(this.players)
        {
            if(this.players.playerB != "()")
                return (this.players.playerB);
        }
        else if(this.teams)
        {
            if(this.teams.teamB != "()")
                return (this.teams.teamB);
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
    AS1: function() {
       
            if(this.players){
                if(this.players.playerA)
                {
                    if(this.players.playerA.length > 0)
                        return (this.scores.setScoresA[0]);
                }
            }
            else if(this.teams)
            {
                if(this.teams.teamA)
                {
                    if(this.teams.teamA.length > 0)
                        return (this.scores.setScoresA[0]);
                }
            }

        
    },
    AS2: function() {
        
            if(this.players)
            {
                if(this.players.playerA && this.players.playerA.length > 0)
                {
                    return (this.scores.setScoresA[1]);
                }
            }
            else if(this.teams)
            {
                if(this.teams.teamA && this.teams.teamA.length > 0)
                {
                    return (this.scores.setScoresA[1]);
                }
            }
        

    },
    AS3: function() {
        
            if(this.players)
            {
                if(this.players.playerA && this.players.playerA.length > 0)
                {
                    return (this.scores.setScoresA[2]);
                }
            }
            else if(this.teams)
            {
                if(this.teams.teamA && this.teams.teamA.length > 0)
                {
                    return (this.scores.setScoresA[2]);
                }
            }
        
    },
    AS4: function() {
       
            if(this.players)
            {
                if(this.players.playerA && this.players.playerA.length > 0)
                {
                    return (this.scores.setScoresA[3]);
                }
            }
            else if(this.teams)
            {
                if(this.teams.teamA && this.teams.teamA.length > 0)
                {
                    return (this.scores.setScoresA[3]);
                }
            }
        
    },
    AS5: function() {
        
            if(this.players)
            {
                if(this.players.playerA && this.players.playerA.length > 0)
                {
                    return (this.scores.setScoresA[4]);
                }
            }
            else if(this.teams)
            {
                if(this.teams.teamA && this.teams.teamA.length > 0)
                {
                    return (this.scores.setScoresA[4]);
                }
            }
        
    },
    AS6: function() {
       
            if(this.players)
            {
                if(this.players.playerA && this.players.playerA.length > 0)
                {                 
                    if (this.scores.setScoresA.length < 6)
                        return 0;
                    return (this.scores.setScoresA[5]);
                }
            }
            else  if(this.teams)
            {
                if(this.teams.teamA && this.teams.teamA.length > 0)
                {             
                    if (this.scores.setScoresA.length < 6)
                        return 0;
                    return (this.scores.setScoresA[5]);
                    
                }
            }
        
    },
    AS7: function() {
        
            if(this.players)
            {
                if(this.players.playerA && this.players.playerA.length > 0)
                {
                    if (this.scores.setScoresA.length < 7)
                        return 0;
                    return (this.scores.setScoresA[6]);
                }
            }
            else if(this.teams)
            {
                if(this.teams.teamA && this.teams.teamA.length > 0)
                {          
                    if (this.scores.setScoresA.length < 7)
                        return 0;
                    return (this.scores.setScoresA[6]);
                }
            }
        
    },
    BS1: function() {
       
            if(this.players)
            {
                if(this.players.playerB && this.players.playerB.length > 0)
                {
                    return (this.scores.setScoresB[0]);
                }
            }
            else if(this.teams)
            {
                if(this.teams.teamB && this.teams.teamB.length > 0)
                {
                    return (this.scores.setScoresB[0]);
                }
            }
        
    },
    BS2: function() {
        
            if(this.players)
            {
                if(this.players.playerB && this.players.playerB.length > 0)
                {
                        return (this.scores.setScoresB[1]);
                }
            }
            else if(this.teams)
            {
                if(this.teams.teamB && this.teams.teamB.length > 0)
                {
                        return (this.scores.setScoresB[1]);
                }
            }
        
    },
    BS3: function() {
        
            if(this.players)
            {
                if(this.players.playerB && this.players.playerB.length > 0)
                {
                        return (this.scores.setScoresB[2]);
                }
            }
            else if(this.teams)
            {
                if(this.teams.teamB && this.teams.teamB.length > 0)
                {
                        return (this.scores.setScoresB[2]);
                }
            }
        
    },
    BS4: function() {
        
            if(this.players)
            {
                if(this.players.playerB && this.players.playerB.length > 0)
                {
                    return (this.scores.setScoresB[3]);
                }
            }
            else if(this.teams)
            {
                if(this.teams.teamB && this.teams.teamB.length > 0)
                {
                    return (this.scores.setScoresB[3]);
                }
            }
        
    },
    BS5: function() {
         
            if(this.players)
            {
                if(this.players.playerB && this.players.playerB.length > 0)
                {
                    return (this.scores.setScoresB[4]);
                }
            }
            else if(this.teams)
            {
                if(this.teams.teamB && this.teams.teamB.length > 0)
                {
                    return (this.scores.setScoresB[4]);
                }
            }
        
    },
    BS6: function() {
        
            if(this.players)
            {
                if(this.players.playerB && this.players.playerB.length > 0)
                {
                    if (this.scores.setScoresB.length < 6)
                        return 0;
                    return (this.scores.setScoresB[5]);
                    
                }
            }
            else if(this.teams)
            {
                if(this.teams.teamB && this.teams.teamB.length > 0)
                {
                    if (this.scores.setScoresB.length < 6)
                        return 0;
                    return (this.scores.setScoresB[5]);
                    
                }
            }
        
    },
    BS7: function() {
       
            if(this.players)
            {
                if(this.players.playerB && this.players.playerB.length > 0)
                {
                    if (this.scores.setScoresB.length < 7)
                        return 0;
                    return (this.scores.setScoresB[6]);   
                }
            }
            else if(this.teams)
            {
                if(this.teams.teamB && this.teams.teamB.length > 0)
                {
                    if (this.scores.setScoresB.length < 7)
                        return 0;
                    return (this.scores.setScoresB[6]);   
                }
            }
        
    }
})
Template.homeResults.events({
    'click #tournamentCheck': function(e) {
    var tournamentId = $(e.target).attr("name");
        Meteor.call('drawsEvents', tournamentId, function(err, result) {
            if (err) {} else 
            {
                Session.set("drawsEvents", result);
            }
        })
    },
    "click #tourEvent":function(e){
        var tournamentId = $(e.target).attr("name");
        var tourEvent = $(e.target).attr("group");
        Meteor.call("fetchTourEventResult",tournamentId,tourEvent,function(error,result){
            if(result)
            {
                Session.set("showResults",result);
                var leftMatches = [];
                var rightMatches = [];
                if(result.matchRecords)
                {
                    for(var m=0 ; m< result.matchRecords.length;m++)
                    {
                        if(m%2 == 0)
                            leftMatches.push(result.matchRecords[m])
                        else
                            rightMatches.push(result.matchRecords[m])

                    }
                    Session.set("leftResults",leftMatches);
                    Session.set("rightResults",rightMatches);
                }
            }
        })

    }
});


















