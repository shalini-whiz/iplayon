
Template.tournScheduleMainMenu.onCreated(function() {
    this.subscribe("onlyLoggedIn")
    this.subscribe("authAddress");
    var self = this;
    self.autorun(function() {
    });
})
Template.tournScheduleMainMenu.onRendered(function() {
})
Template.tournScheduleMainMenu.onDestroyed(function() {})
Template.tournScheduleMainMenu.helpers({
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
        } catch (e) {}
    },
})
Template.tournScheduleMainMenu.events({
    "change #featureArticles": function(e) {
        try {
            e.preventDefault();
            var selectedId = $("#featureArticles").val();
            if (selectedId == 1) {
                Router.go("/tournScheduler");
            } else if (selectedId == 2) {
                Router.go("/tournSchedulerEdit")
            } else if (selectedId == 3) {
                Router.go("/tournSchedulerView")
            } 
            else if (selectedId == 4) {
                Router.go("/tournSchedulerPastEvents")
            } 
            else if (selectedId == 5) {
                Router.go("/tournSchedulerEditPast")
            } 
            else if (selectedId == 6) {
                Router.go("/tournSchedulerPastEventsView")
            } 
        } catch (e) {

        }
    },
})


Template.tournScheduler.onCreated(function() {
    this.subscribe("onlyLoggedIn")
    this.subscribe("authAddress");
    this.subscribe("eventsTournamentscheduler")
    var self = this;
    self.autorun(function() {
        self.subscribe("eventsLISTForTournScheduler", Session.get("selectedTournId"));
    })
})

var eventsSelectedInOrderWithRounds = []
var orders = []

Template.tournScheduler.onRendered(function() {
    Session.set("selectedTournIdDet", undefined)
    Session.set("selectedTournId", undefined)
    Session.set("eventsSelectedInOrderWithRounds",undefined)
    Session.set("eventListSchedule",undefined)
    Session.set("getOrdersCountSess",undefined)
    Session.set("getMaxEventPartsCountroSess",undefined)
    eventsSelectedInOrderWithRounds = []
    orders = []
})

Template.tournScheduler.onDestroyed(function() {

})

Template.tournScheduler.helpers({
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
        } catch (e) {}
    },
    tournamentList: function() {
        try {
            var fetchTourns = ReactiveMethod.call("getTournsPartsCount","new")
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
    eventsList: function() {
        try {
            if ( Session.get("eventListSchedule") != undefined && Session.get("eventListSchedule") != null) {
                return Session.get("eventListSchedule")
            }
        } catch (e) {
            alert(e)
        }
    },
    listDates: function() {
        try {
            if (Session.get("selectedTournId") != undefined && Session.get("selectedTournId") != null) {
                var eve = events.findOne({
                    "_id": Session.get("selectedTournId")
                });
                if (eve && eve.eventStartDate && eve.eventEndDate) {
                    let s = ReactiveMethod.call("getDatesStartEnd", eve.eventStartDate, eve.eventEndDate)
                    return s
                }
            }
        } catch (e) {
            alert(e)
        }
    },
    getMaxEventPartsCountro: function() {
        try {
            if (Session.get("getMaxEventPartsCountroSess") && Session.get("selectedTournId") != undefined && Session.get("selectedTournId") != null) {
                let s = Session.get("getMaxEventPartsCountroSess")//ReactiveMethod.call("getRoundNumbersTournScheduler", this.num, this.eventName)
                if (s) {
                    let s1 = _.findWhere(s, {"eventName":this.eventName})
                    if(s1!=undefined && s1!=null){
                        var k = {}
                        
                        var key = ["R512","R256","R128",  "R64", "R32","PQF", "QF", "SF","Finals"];
                        var ks = JSON.parse(JSON.stringify(s1, key, 18));
                        var rounds = _.keys(ks);
                        var values = _.values(ks)
                        var rouVal = ks


                        k.rounds = rounds
                        k.values = values
                        k.rouVal = rouVal

                        var toRet = []
                        toRet.push(k)
                        return toRet
                    }
                }
            }
        } catch (e) {
            alert(e)
        }
    },
    getOrdersCount: function() {
        try {
            if (Session.get("getOrdersCountSess") && Session.get("selectedTournId") != undefined && Session.get("selectedTournId") != null && Session.get("eventListSchedule")) {
                return Session.get("getOrdersCountSess")
            }
        } catch (e) {
            alert(e)
        }
    },
    matchNumbersFound:function(eventName,round,eveId){
        try{
            if(Session.get("selectedTournId")){
                var callMethod = ReactiveMethod.call("matchNumbersOfGivenSchedule",Session.get("selectedTournId"))
                if(callMethod){
                     let s1 = _.findWhere(callMethod, {"_id":eventName})
                     if(s1 && s1.rou){
                        let s2 = _.contains(s1.rou, round)
                        if(s2){
                            return false
                        }
                        else{
                            return true
                        }
                     }
                     else{
                        return true
                     }
                }else{
                    return true
                }
            }

        }catch(e){

        }
    }
})




Template.tournScheduler.events({
    "change #tournamentList": function() {
        try {
            Session.set("selectedTournIdDet", undefined)
            Session.set("selectedTournId", undefined)
            Session.set("eventsSelectedInOrderWithRounds",undefined)
            Session.set("eventListSchedule",undefined)
            Session.set("getOrdersCountSess",undefined)
            Session.set("getMaxEventPartsCountroSess",undefined)
            eventsSelectedInOrderWithRounds = []
            orders = []
            
            var selectedTournId = $("#tournamentList").val()
            Session.set("selectedTournIdDet", undefined)
            Session.set("selectedTournId", undefined)
            if (selectedTournId) {
                var eve = events.findOne({
                    "_id": selectedTournId
                });
                Session.set("selectedTournIdDet", eve)
                Session.set("selectedTournId", selectedTournId)
                Meteor.call("getMaxEventPartsCount", Session.get("selectedTournId"),function(e,res){
                    if(res){
                        Session.set("eventListSchedule", res)
                        var k = []
                        var lm = []
                        if(res){
                            for(var i=0;i<res.length;i++){
                                Meteor.call("getRoundNumbersTournScheduler", res[i].num, res[i].eventName, function(e,resp){
                                    if(resp){
                                        lm.push(resp)
                                        Session.set("getMaxEventPartsCountroSess",lm)
                                        var rounds = _.keys(resp);
                                        var values = _.values(resp)
                                        for(var j=0;j<rounds.length-1;j++){
                                            if(values[j]!=0){
                                                k.push(rounds[j])
                                                Session.set("getOrdersCountSess",k)
                                            }
                                        }
                                    }else if(e){
                                        alert(e)
                                    }
                                })
                            }
                        }
                    }else if(e){
                        alert(e)
                    }
                })
            }
        } catch (e) {
            alert(e)
        }
    },
    "keyup #noofTables": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8) {
            return true
        }
        if (event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return false;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
    "keyup #R512Time": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8) {
            return true
        }
        if (event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return false;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
    "keyup #R256Time": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8) {
            return true
        }
        if (event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return false;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
    "keyup #R64Time": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8) {
            return true
        }
        if (event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return false;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
    "keyup #R32Time": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8) {
            return true
        }
        if (event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return false;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
    "keyup #PQFTime": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8) {
            return true
        }
        if (event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return false;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
    "keyup #QFTime": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8) {
            return true
        }
        if (event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return false;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
    "keyup #SFTime": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8) {
            return true
        }
        if (event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return false;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
    "keyup #FinalsTime": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8) {
            return true
        }
        if (event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return false;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
    "keyup #R128Time": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8) {
            return true
        }
        if (event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return false;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
    "change select[id^=getOrdersOfEvent]":function(e){
        try{

            var data = {
                "order":parseInt($("#"+e.target.id+" option:selected").attr("order")),
                "eventName":$("#"+e.target.id+" option:selected").attr("event")+"||"+$("#"+e.target.id).attr("roundName")
            }
            
            
            if (_.findWhere(orders, {"order":data.order}) == null || _.findWhere(orders, {"order":data.order}) == undefined) {
                if (_.findWhere(orders, {"eventName":data.eventName}) != null && _.findWhere(orders, {"eventName":data.eventName}) != undefined) {
                    orders = _.without(orders, _.findWhere(orders, {
                      "eventName":data.eventName
                    }));
                }
                orders.push(data)
            }
            else{
                if (_.findWhere(orders, {"eventName":data.eventName}) != null && _.findWhere(orders, {"eventName":data.eventName}) != undefined) {
                    orders = _.without(orders, _.findWhere(orders, {
                      "eventName":data.eventName
                    }));
                }

                $("#"+e.target.id).val('Select Order');
                alert("already selected this order")
                $("#selectEventName"+$("#"+e.target.id).attr("eventId")+$("#"+e.target.id).attr("roundName")).attr('checked', false);
                $("#"+e.target.id).attr('disabled', true)
            }
        }catch(e){
            alert(e)
        }
    },
    "change input[id^=selectEventName]":function(e){
        var id = e.target.id
        if($(e.target).is(":checked")){
            var eveN = $("#"+id).attr("eventName")
            var rou = $("#"+id).attr("roundName")
            var eveid = $("#"+id).attr("eventId")
            $("#getOrdersOfEvent"+eveid+rou).attr('disabled', false);
        }
        else{
            var eveN = $("#"+id).attr("eventName")
            var rou = $("#"+id).attr("roundName")
            var eveid = $("#"+id).attr("eventId")
            var data = {
                "eventName":eveN+"||"+rou
            }
            if (_.findWhere(orders, {"eventName":data.eventName}) != null && _.findWhere(orders, {"eventName":data.eventName}) != undefined) {
                orders = _.without(orders, _.findWhere(orders, {
                    "eventName":data.eventName
                }));
            }
            $("#"+eveid+rou).val('Select Order');
            $("#getOrdersOfEvent"+eveid+rou).attr('disabled', true);
        }
       

    },
    "click #generateScheduleForTour":function(e){
        try{
            var check = checkBasictimeValid()
            if(check){
                var data = {
                    selectedDate:selectedDate,
                    startTime:startTime,
                    endTime:endTime,
                    break1St:break1St,
                    break1End:break1End,
                    break2St:break2St,
                    break2End:break2End,
                    noOfTablesPerDay:noOfTablesPerDay,
                    durationRound:durationRound,
                    tournamentId:Session.get("selectedTournId"),
                    type:"create"
                }

                Meteor.call("validateDateTimeDuration",data,function(e,res){
                    if(res){
                        if(res.result != undefined && res.result != null && res.result == true){
                            var ordersSort = _.sortBy(orders, function(o) { return o.order; })

                            var dataToSend =  []
                            if(Session.get("getMaxEventPartsCountroSess")){
                                dataToSend =  Session.get("getMaxEventPartsCountroSess")
                            }

                            data.eventsSelectedInOrderWithRounds = ordersSort
                            data.datas = dataToSend

                            Meteor.call("scheduleTimer", data,function(e,res){
                                if(e){
                                    alert(e)
                                }
                                else{
                                    alert(JSON.stringify(res))
                                }
                            })

                        }else {
                            if(res.result != undefined && res.result != null && res.result == false){
                                if(res.message){
                                    alert(res.message)
                                }
                            }
                        }
                    }else if(e){
                        alert(e)
                    }
                })
            }else{
            }
            

            
        }catch(e){
            alert(e)
        }
    }
})

var selectedDate = ""
var startTime = ""
var endTime = ""
var break1St = "0"
var break1End = "0"
var break2St = "0"
var break2End = "0"

var noOfTablesPerDay = ""
var durationRound = {
    Finals:"0",
    SF:"0",
    QF:"0",
    PQF:"0",
    R32:"0",
    R64:"0",
    R128:"0",
    R256:"0",
    R512:"0"
}

checkBasicDurationValid = function(){

    if($("#FinalsTime").val() == undefined || $("#FinalsTime").val() == null 
        || $("#FinalsTime").val().trim().length == 0)
        durationRound.Finals = 0
    else
        durationRound.Finals = $("#FinalsTime").val()

    if($("#SFTime").val() == undefined || $("#SFTime").val() == null 
        || $("#SFTime").val().trim().length == 0)
        durationRound.SF = 0
    else
        durationRound.SF = $("#SFTime").val()

    if($("#QFTime").val() == undefined || $("#QFTime").val() == null
     || $("#QFTime").val().trim().length == 0)
        durationRound.QF = 0
    else
        durationRound.QF = $("#QFTime").val()

    if($("#PQFTime").val() == undefined || $("#PQFTime").val() == null 
        || $("#PQFTime").val().trim().length == 0)
        durationRound.PQF = 0
    else
        durationRound.PQF = $("#PQFTime").val()

    if($("#R32Time").val() == undefined || $("#R32Time").val() == null 
        || $("#R32Time").val().trim().length == 0)
        durationRound.R32 = 0
    else
        durationRound.R32 = $("#R32Time").val()

    if($("#R64Time").val() == undefined || $("#R64Time").val() == null 
        || $("#R64Time").val().trim().length == 0)
        durationRound.R64 = 0
    else
        durationRound.R64 = $("#R64Time").val()

    if($("#R128Time").val() == undefined || $("#R128Time").val() == null 
        || $("#R128Time").val().trim().length == 0)
        durationRound.R128 = 0
    else
        durationRound.R128 = $("#R128Time").val()

    if($("#R256Time").val() == undefined || $("#R256Time").val() == null
        || $("#R256Time").val().trim().length == 0)
        durationRound.R256 = 0
    else
        durationRound.R256 = $("#R256Time").val()
   
    if($("#R512Time").val() == undefined || $("#R512Time").val() == null 
        || $("#R512Time").val().trim().length == 0)
        durationRound.R512 = 0
    else
        durationRound.R512 = $("#R512Time").val()


    if(durationRound.Finals !=undefined && durationRound.Finals!=null ){
        if(durationRound.SF !=undefined && durationRound.SF!=null ){
            if(durationRound.QF !=undefined && durationRound.QF!=null ){
                if(durationRound.PQF !=undefined && durationRound.PQF!=null ){
                    if(durationRound.R32 !=undefined && durationRound.R32!=null ){
                        if(durationRound.R64 !=undefined && durationRound.R64!=null ){
                            if(durationRound.R128 !=undefined && durationRound.R128!=null ){
                                if(durationRound.R256 !=undefined && durationRound.R256!=null ){
                                    if(durationRound.R512 !=undefined && durationRound.R512!=null ){
                                        return true
                                    }else{
                                        alert("enter valid duration for R512")
                                    }
                                }else{
                                    alert("enter valid duration for R256")
                                }
                            }else{
                                alert("enter valid duration for R32")
                            }
                        }else{
                            alert("enter valid duration for R32")
                        }
                    }else{
                        alert("enter valid duration for R32")
                    }
                }else{
                    alert("enter valid duration for PQF")
                }
            }else{
                alert("enter valid duration for QF")
            }
        }else{
            alert("enter valid duration for SF")
        }
    }else{
        alert("enter valid duration for Finals")
    }
}

checkBasictimeValid = function(){
    try{
     selectedDate = $("#tournamentListDate").val()
     startTime = $("#startTime").val()
     endTime = $("#endTime").val()

    if($("#break1startTime").val() == undefined || $("#break1startTime").val() == null 
        || $("#break1startTime").val().trim().length == 0)
        break1St = 0
    else
        break1St = $("#break1startTime").val()

    if($("#break1endTime").val() == undefined || $("#break1endTime").val() == null 
        || $("#break1endTime").val().trim().length == 0)
        break1End = 0
    else
        break1End = $("#break1endTime").val()

    if($("#break2startTime").val() == undefined || $("#break2startTime").val() == null
     || $("#break2startTime").val().trim().length == 0)
        break2St = 0
    else
        break2St = $("#break2startTime").val()

    if($("#break2endTime").val() == undefined || $("#break2endTime").val() == null 
        || $("#break2endTime").val().trim().length == 0)
        break2End = 0
    else
        break2End = $("#break2endTime").val()

    if(break1St == undefined || break1St == null){
        break1St = 0
    }
    if(break1End == undefined || break1End == null){
        break1End = 0
    }
    if(break2St == undefined || break2St == null){
        break2St = 0
    }
    if(break2End == undefined || break2End == null){
        break2End = 0
    }
    noOfTablesPerDay = $("#noofTables").val()

    if(selectedDate && selectedDate.trim().length != 0){
        if(startTime && startTime != 0  && startTime.trim().length != 0){
            if(endTime && endTime != 0 && endTime.trim().length != 0){
                if( break1St.toString().trim().length != 0){
                    if( break1End.toString().trim().length != 0){
                        if( break2St.toString().trim().length != 0){
                            if( break2End.toString().trim().length != 0){
                                if(noOfTablesPerDay && noOfTablesPerDay.trim().length != 0){
                                    var check = checkBasicDurationValid()
                                    if(check){
                                        return true
                                    }else{
                                        return false
                                    }
                                }else{
                                    alert("enter no Of Tables Per Day")
                                    return false
                                }
                            }else{
                                break2End = 0
                                alert("enter valid break2End time")
                                return false
                            }
                        }else{
                            break2St = 0
                            alert("enter valid break2start time")
                            return false
                        }
                    }else{
                        break1End = 0
                        alert("enter valid break1End time")
                        return false
                    }
                }else{
                    break1St = 0
                    alert("enter valid break2start time")
                    return false
                }
            }else{
                alert("enter end Time")
                return false
            }
        }else{
            alert("enter start Time")
            return false
        }
    } else{
        alert("select date")
        return false
    }
    }catch(e){
        alert(e)
    }
}

Template.registerHelper("checkNotRound", function(data1, data2) {
    try{
        if (data1 && data2) {
            
            if(data1 == "eventName"){
                return false
            }
            if(data2[data1])
                return true
        }
    }catch(e){}
})

Template.registerHelper("changeToSlNum", function(data) {
    try{
        if(data != undefined && data != null){
            return parseInt(data) + 1
        }
    }catch(e){}
})