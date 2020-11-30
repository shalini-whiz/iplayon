

Template.tournSchedulerPastEventsView.onCreated(function() {
    this.subscribe("onlyLoggedIn")
    this.subscribe("authAddress");
    this.subscribe("eventsTournamentschedulerPast")
    var self = this;
    self.autorun(function() {
        self.subscribe("eventsLISTForTournSchedulerPast", Session.get("selectedTournId"));
    })
})

var eventsSelectedInOrderWithRounds = []
var orders = []
var from = 0
var to = 20

Template.tournSchedulerPastEventsView.onRendered(function() {
    Session.set("selectedTournIdDet", undefined)
    Session.set("selectedTournId", undefined)
    Session.set("selectedEventId",undefined)
    Session.set("eventListSchedule",undefined)
    Session.set("getOrdersCountSess",undefined)
    Session.set("getMaxEventPartsCountroSess",undefined)
    Session.set("editDataRes",undefined)
    Session.set("dataDetails",undefined)
    Session.set("showtournsOnly",false)
    Session.set("dataDetailsTour",undefined)
    Session.set("selectedDate",undefined)
    Session.set("dataDetailsDate",undefined)
    Session.set("showloader",false)

    Session.set("fetchMatchColl",undefined)
    Session.set("mergedListSess",undefined)
    eventsSelectedInOrderWithRounds = []
    Session.set("from",0)
    Session.set("to",20)
    orders = []
    from = 0
    to = 20
})

Template.tournSchedulerPastEventsView.onDestroyed(function() {

})

Template.tournSchedulerPastEventsView.helpers({
    notAdmin: function() {
        try {
            var emailAddress = Meteor.user().emails[0].address;
            var boolVal = false
            var auth = authAddress.find({}).fetch();
            if (auth) {
                for (var i = 0; i < auth.length; i++) {
                    if (emailAddress && emailAddress == auth[i].data) {
                        boolVal = false;
                    } else {
                        boolVal = false;
                        break;
                    }
                };
            }
            return boolVal
        } catch (e) {
            alert(e)
        }
    },
    tournamentList: function() {
        try {
            var fetchTourns = ReactiveMethod.call("getTournsPartsCount","past")
            if (fetchTourns) {
                return fetchTourns
            }
        } catch (e) {
            alert(e)
        }
    },
    selectedTorun: function() {
        try {
            if (Session.get("selectedTournIdDet") != undefined && Session.get("selectedTournIdDet") != null) {
                return Session.get("selectedTournIdDet")
            }
        } catch (e) {
            alert(e)
        }
    },
    eventList:function(){
        try{
            if(Session.get("selectedTournId")){
                var r = pastEvents.find({tournamentEvent:false}).fetch()
                return r
            }
        }catch(e){
            alert(e)
        }
    },
    matchNumbers:function(){
        try{
            if(Session.get("selectedEventId") && Session.get("selectedTournId")){
            var res = ReactiveMethod.call("matchNumbersOfGivenSchedule" ,Session.get("selectedTournId"))
            if(res){
                let s1 = _.findWhere(res, {"_id":Session.get("selectedEventId")})
                if(s1 && s1.arr)
                return s1.arr.sort()
            }
            }
        }catch(e){
            alert(e)
        }
    },
    showmatchNumbers:function(){
        try{
            if(Session.get("selectedTournId")){
                return  true
            }
        }catch(e){
            alert(e)
        }
    },  
    showDates:function(){
        try{
            if(Session.get("selectedTournId")){
                var res = ReactiveMethod.call("getSelectedDatesOfTournament" ,Session.get("selectedTournId"))
                if(res){
                    if(res)
                     return res.sort()
                }
            }
        }catch(e){
            alert(e)
        }
    },
    editData:function(){
        try{
        if( Session.get("showtournsOnly") != undefined &&  Session.get("showtournsOnly") != null){
            if(Session.get("selectedEventId") && Session.get("mergedListSess") && Session.get("showtournsOnly")==2){
                var res = Session.get("mergedListSess")
                if(res){
                    if(res && res.length != 0 ){
                        Session.set("showloader",false)
                        return res
                    }
                }
            }
            else if(Session.get("selectedTournId") && Session.get("mergedListSess") && Session.get("showtournsOnly")==1){
                var res = Session.get("mergedListSess")
                if(res){
                    if(res && res.length != 0 ){
                        Session.set("showloader",false)
                        return res
                    }
                }
            }
            else if(Session.get("selectedDate") && Session.get("dataDetailsDate") && Session.get("showtournsOnly")==3){
                var res = Session.get("mergedListSess")
                if(res){
                    if(res && res.length != 0 ){
                        Session.set("showloader",false)
                        return res
                    }
                }
            }
        }
        }catch(e){
            alert(e)
        }
    },
    durationDAta:function(round,duration){
        try{
            if( Session.get("showtournsOnly") != undefined &&  Session.get("showtournsOnly") != null){
            if(Session.get("dataDetails") && Session.get("showtournsOnly")==2){
                var res = Session.get("dataDetails")
                if(res){
                    if(res && res.length != 0 && duration && round){
                        if(duration[round]){
                            return duration[round]
                        }
                    }
                }
            }
            else if(Session.get("dataDetailsTour") && Session.get("showtournsOnly")==1){
                var res = Session.get("dataDetailsTour")
                if(res){
                    if(res && res.length != 0 && duration && round){
                        if(duration[round]){

                            return duration[round]
                        }
                    }
                }
            }
            else if(Session.get("dataDetailsDate") && Session.get("showtournsOnly")==3){
                var res = Session.get("dataDetailsDate")
                if(res){
                    if(res && res.length != 0 && duration && round){
                        if(duration[round]){
                            return duration[round]
                        }
                    }
                }
            }
        }
        }catch(e){
            alert(e)
        }
    },
    matchCollectionData:function(tosend, projectType,matchNumber,eventName){
        try{
            if( Session.get("showtournsOnly") != undefined &&  Session.get("showtournsOnly") != null){
            if(Session.get("dataDetails")  
                && Session.get("showtournsOnly") == 2){
                var res = ReactiveMethod.call("getPlayerMatchDetails",projectType,matchNumber,Session.get("selectedTournId"),eventName)
                if(res){
                    if(res){
                        if(res){
                            if(parseInt(tosend) == 1)
                            return res.playerA
                            if(parseInt(tosend) == 2)
                            return res.playerB
                            if(parseInt(tosend) == 3)
                            return res.status
                            if(parseInt(tosend) == 4)
                            return res.scores
                            if(parseInt(tosend) == 5)
                            return res.winnerId
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
                        return "-"
                }
            }
            else if(Session.get("dataDetailsTour") && 
                Session.get("showtournsOnly")==1 && Session.get("fetchMatchColl")){
                var res = Session.get("fetchMatchColl")//ReactiveMethod.call("getPlayerMatchDetails",projectType,matchNumber,Session.get("selectedTournId"),eventName)
                if(res){
                    if(res){
                        if(res){
                            var res =  _.findWhere(res, {"eventName":this.ev,"matchNumber":parseInt(this.sc.match)})
                            if(res){
                                var res1 = []
                                res1.push(res)
                                Session.set("showloader",false)
                                return res1
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
                        return "-"
                }
            }
            else if(Session.get("dataDetailsDate") && 
                Session.get("showtournsOnly")==3){
                var res = ReactiveMethod.call("getPlayerMatchDetails",projectType,matchNumber,Session.get("selectedTournId"),eventName)
                if(res){
                    if(res){
                        if(res){
                            if(parseInt(tosend) == 1)
                            return res.playerA
                            if(parseInt(tosend) == 2)
                            return res.playerB
                            if(parseInt(tosend) == 3)
                            return res.status
                            if(parseInt(tosend) == 4)
                            return res.scores
                            if(parseInt(tosend) == 5)
                            return res.winnerId
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
                        return "-"
                }
            }
        }
        }catch(e){
            alert(e)
        }
    },
    showloaderSess:function(){
        try{
            if( Session.get("showloader")){
                return true
            }
            else{
                return false
            }
        }catch(e){
            alert(e)
        }
    },



});


Template.tournSchedulerPastEventsView.events({
    "click #prevmatches": function() {
        if (from != 0 && to != 0) {
            from = parseInt(from - 20)
            to = parseInt(to - 20)
            Session.set("from", from)
            Session.set("to", to)
            if(Session.get("showtournsOnly") == 1){
                var mergedList = _.map(Session.get("dataDetailsTour").slice(Session.get("from"), Session.get("to")), function(item) {
                    return _.extend(item, _.findWhere(Session.get("fetchMatchColl"), {
                        "eventName": item.ev,
                        "matchNumber": parseInt(item.sc.match)
                    }));
                });

                Session.set("mergedListSess", mergedList)
            }
            else if(Session.get("showtournsOnly") == 2){
                var mergedList = _.map(Session.get("dataDetails").slice(Session.get("from"), Session.get("to")), function(item) {
                    return _.extend(item, _.findWhere(Session.get("fetchMatchColl"), {
                        "eventName": item.ev,
                        "matchNumber": parseInt(item.sc.match)
                    }));
                });

                Session.set("mergedListSess", mergedList)
            }
            else if(Session.get("showtournsOnly") == 3){
                var mergedList = _.map(Session.get("dataDetailsDate").slice(Session.get("from"), Session.get("to")), function(item) {
                    return _.extend(item, _.findWhere(Session.get("fetchMatchColl"), {
                        "eventName": item.ev,
                        "matchNumber": parseInt(item.sc.match)
                    }));
                });

                Session.set("mergedListSess", mergedList)
            }
        }
    }, 
    "click #nextmatches": function() {
        from = parseInt(from + 20)
        to = parseInt(to + 20)
        Session.set("from", from)
        Session.set("to", to)
        if (Session.get("showtournsOnly") == 1) {
            var mergedList = _.map(Session.get("dataDetailsTour").slice(Session.get("from"), Session.get("to")), function(item) {
                return _.extend(item, _.findWhere(Session.get("fetchMatchColl"), {
                    "eventName": item.ev,
                    "matchNumber": parseInt(item.sc.match)
                }));
            });
            Session.set("mergedListSess", mergedList)
        } else if (Session.get("showtournsOnly") == 2) {
            var mergedList = _.map(Session.get("dataDetails").slice(Session.get("from"), Session.get("to")), function(item) {
                return _.extend(item, _.findWhere(Session.get("fetchMatchColl"), {
                    "eventName": item.ev,
                    "matchNumber": parseInt(item.sc.match)
                }));
            });
            Session.set("mergedListSess", mergedList)
        } else if (Session.get("showtournsOnly") == 3) {
            var mergedList = _.map(Session.get("dataDetailsDate").slice(Session.get("from"), Session.get("to")), function(item) {
                return _.extend(item, _.findWhere(Session.get("fetchMatchColl"), {
                    "eventName": item.ev,
                    "matchNumber": parseInt(item.sc.match)
                }));
            });
            Session.set("mergedListSess", mergedList)
        }
    },
    "change #tournamentList": function() {
        try {
            var selectedTournId = $("#tournamentList").val()
            Session.set("selectedTournIdDet", undefined)
            Session.set("selectedTournId", undefined)
            Session.set("showtournsOnly",undefined)
            Session.set("dataDetails",undefined)
            Session.set("dataDetailsTour",undefined)
            Session.set("from",0)
            Session.set("to",20)
            from = 0
            to = 20
            Session.set("fetchMatchColl",undefined)
            Session.set("mergedListSess",undefined)

            if (selectedTournId) {
                var eve = pastEvents.findOne({
                    "_id": selectedTournId
                });
                Session.set("selectedTournIdDet", eve)
                Session.set("selectedTournId", selectedTournId)
            }
        } catch (e) {
            alert(e)
        }
    },
    "change #eventList":function(){
        try{
            var selectedEventId = $("#eventList").val()
            Session.set("selectedEventId",selectedEventId)
            Session.set("dataDetails",undefined)
            Session.set("dataDetailsTour",undefined)
            Session.set("showtournsOnly",undefined)
            Meteor.call("scheduleOfGivenId",Session.get("selectedTournId"),Session.get("selectedEventId"),function(e,res){
                if(res){
                    if(res && res.length != 0 ){
                        Session.set("dataDetails",res)
                        return res
                    }
                }
            })
            
        }catch(e){
            alert(e)
        }
    },
    "click #showTourn":function(){
        try{
            from = 0
            to = 20
            Session.set("from", from)
            Session.set("to", to)
            var eventIDs = []
            var eventIDs2 = []
            Session.set("showtournsOnly",1)
            Session.set("dataDetails",undefined)
            Session.set("dataDetailsTour",undefined)
            Session.set("showloader",true)
            Session.set("mergedListSess",undefined)
            $("#selectDateList").val("Select Date")
            $("#eventList").val("Select Events")
            Session.set("fetchMatchColl",undefined)

            Meteor.call("scheduleOfGivenIdTourn",Session.get("selectedTournId"),"","",function(e,res){
                if(res){
                    if(res &&  res.data && res.data.length != 0){
                        Session.set("dataDetailsTour",res.data)
                    }
                    if(res && res.data2 && res.data2[0]){
                        if(res.data2[0].e)
                            eventIDs = res.data2[0].e
                        
                        if(res.data2[0].e2)
                            eventIDs2 = res.data2[0].e2

                        if(Session.get("dataDetailsTour")){
                            Meteor.call("getPlayerMatchDetailsComplete",1,1,Session.get("selectedTournId"),eventIDs,eventIDs2,function(e,res){
                                if(res){
                                    var playerDet = res
                                    Session.set("showloader",false)
                                    Session.set("fetchMatchColl",res)

                                    var mergedList = _.map(Session.get("dataDetailsTour").slice(Session.get("from"), Session.get("to")), function(item) {                                    
                                        return _.extend(item, _.findWhere(Session.get("fetchMatchColl"), {
                                            "eventName": item.ev,
                                            "matchNumber": parseInt(item.sc.match)
                                        }));
                                    });
                                    Session.set("mergedListSess",mergedList)
                                }
                            })
                        }
                    }
                }
                else if(e){
                    alert(e)
                }
            })
            
        }catch(e){
            alert(e)
        }
    },
     "click #showEve":function(){
        try{
            from = 0
            to = 20
            Session.set("from", from)
            Session.set("to", to)
            Session.set("showtournsOnly",2)
            Session.set("dataDetails",undefined)
            Session.set("dataDetailsTour",undefined)
            Session.set("showloader",true)
            Session.set("mergedListSess",undefined)
            $("#selectDateList").val("Select Date")
            Session.set("fetchMatchColl",undefined)

            Meteor.call("scheduleOfGivenIdTourn",Session.get("selectedTournId"),Session.get("selectedEventId"),"",function(e,res){
                if(res){
                    if(res &&  res.data && res.data.length != 0){
                        Session.set("dataDetails",res.data)
                    }
                    if(res && res.data2 && res.data2[0]){
                        if(res.data2[0].e)
                            eventIDs = res.data2[0].e
                        
                        if(res.data2[0].e2)
                            eventIDs2 = res.data2[0].e2

                        if(Session.get("dataDetails")){
                            Meteor.call("getPlayerMatchDetailsComplete",1,1,Session.get("selectedTournId"),eventIDs,eventIDs2,function(e,res){
                                if(res){
                                    var playerDet = res
                                    Session.set("showloader",false)
                                    Session.set("fetchMatchColl",res)

                                    var mergedList = _.map(Session.get("dataDetails").slice(Session.get("from"), Session.get("to")), function(item) {                                    
                                        return _.extend(item, _.findWhere(Session.get("fetchMatchColl"), {
                                            "eventName": item.ev,
                                            "matchNumber": parseInt(item.sc.match)
                                        }));
                                    });
                                    Session.set("mergedListSess",mergedList)
                                }
                            })
                        }
                    }
                }
                else if(e){
                    alert(e)
                }
            })
        }catch(e){
            alert(e)
        }
    },
    "click #downloadSched":function(){
        try{
            /*Meteor.call("getPlayerMatchDetailsForPrint",Session.get("selectedTournId"),function(e,res){
                alert(JSON.stringify(res))
            })*/
            if(Session.get("showtournsOnly")==2){
                Meteor.call("scheduleDownload",Session.get("selectedTournId"),Session.get("selectedEventId"),Session.get("dataDetails"),Session.get("showtournsOnly"),Session.get("fetchMatchColl"),function(e,res){
                    if (res) {
                        window.open("data:application/pdf;base64, " + res);
                        $('.modal-backdrop').remove();
                    }
                })
            }
            else if(Session.get("showtournsOnly")==1){
                Meteor.call("scheduleDownload",Session.get("selectedTournId"),Session.get("selectedEventId"),Session.get("dataDetailsTour"),Session.get("showtournsOnly"),Session.get("fetchMatchColl"),function(e,res){
                    if (res) {
                      window.open("data:application/pdf;base64, " + res);
                        $('.modal-backdrop').remove();
                    }
                })
            }
            else if(Session.get("showtournsOnly")==3){
                Meteor.call("scheduleDownload",Session.get("selectedTournId"),Session.get("selectedEventId"),Session.get("dataDetailsDate"),Session.get("showtournsOnly"),Session.get("fetchMatchColl"),function(e,res){
                    if (res) {
                      window.open("data:application/pdf;base64, " + res);
                        $('.modal-backdrop').remove();
                    }
                })
            }
        }catch(e){
            alert(e)
        }
    },
    "click #showByDate":function(){
        try{
            Session.set("showtournsOnly",3)
            Session.set("dataDetails",undefined)
            Session.set("dataDetailsTour",undefined)
            try{
            from = 0
            to = 20
            Session.set("from", from)
            Session.set("to", to)
            Session.set("dataDetailsDate",undefined)
            Session.set("showloader",true)
            Session.set("mergedListSess",undefined)
            $("#eventList").val("Select Events")
            Session.set("fetchMatchColl",undefined)

            Meteor.call("scheduleOfGivenIdTourn",Session.get("selectedTournId"),"",Session.get("selectedDate"),function(e,res){
                if(res){
                    if(res &&  res.data && res.data.length != 0){
                        Session.set("dataDetailsDate",res.data)
                    }
                    if(res && res.data2 && res.data2[0]){
                        if(res.data2[0].e)
                            eventIDs = res.data2[0].e
                        
                        if(res.data2[0].e2)
                            eventIDs2 = res.data2[0].e2

                        if(Session.get("dataDetailsDate")){
                            Meteor.call("getPlayerMatchDetailsComplete",1,1,Session.get("selectedTournId"),eventIDs,eventIDs2,function(e,res){
                                if(res){
                                    var playerDet = res
                                    Session.set("showloader",false)
                                    Session.set("fetchMatchColl",res)

                                    var mergedList = _.map(Session.get("dataDetailsDate").slice(Session.get("from"), Session.get("to")), function(item) {                                    
                                        return _.extend(item, _.findWhere(Session.get("fetchMatchColl"), {
                                            "eventName": item.ev,
                                            "matchNumber": parseInt(item.sc.match)
                                        }));
                                    });
                                    Session.set("mergedListSess",mergedList)
                                }
                            })
                        }
                    }
                }
                else if(e){
                    alert(e)
                }
            })
        }catch(e){
            alert(e)
        }
        }catch(e){
            alert(e)
        }
    },
    "change #selectDateList":function(){
        try{
            var selectedEventId = $("#selectDateList").val()
            Session.set("selectedDate",selectedEventId)
            Session.set("dataDetails",undefined)
            Session.set("dataDetailsTour",undefined)
            Session.set("dataDetailsDate",undefined)
            Session.set("showtournsOnly",undefined)
        }catch(e){
            alert(e)
        }
    },
})