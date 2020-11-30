
Template.tournSchedulerEdit.onCreated(function() {
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
var korders = 0
var getEveRou = []
//neq
var selectedOrders = []
var selectedData = []
Template.tournSchedulerEdit.onRendered(function() {
    Session.set("selectedTournIdDet", undefined)
    Session.set("selectedTournId", undefined)
    Session.set("eventsSelectedInOrderWithRounds",undefined)
    Session.set("eventListSchedule",undefined)
    Session.set("getOrdersCountSess",undefined)
    Session.set("getMaxEventPartsCountroSess",undefined)
    Session.set("editDataRes",undefined)

    Session.set("numberOFSessions",undefined)
    Session.set("selectedSession",undefined)
    Session.set("showEventsViewSessio",undefined)
    Session.set("showDEtailsOfSelectedEvent",undefined)


    Session.set("selectedEventForSched",undefined)
    Session.set("eventOfThisSess",undefined)
    eventsSelectedInOrderWithRounds = []
    orders = []
    korders = []
    getEveRou = []
    selectedOrders = []
    selectedData = []

    Session.set("ViewAddedSessionTrue",undefined)
    Session.set("ViewAddedSessionDet",undefined)
})

Template.tournSchedulerEdit.onDestroyed(function() {

})

Template.tournSchedulerEdit.helpers({
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
            //alert(e)
        }
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
            if (Session.get("selectedTournId") && Session.get("editDataRes")) {
                var t = ReactiveMethod.call("getEventsForSelectedTounrM", Session.get("selectedTournId"), "new")
                if(t){
                    Session.set("eventListSchedule",t)
                    return t
                }
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
            if ( Session.get("selectedTournId") != undefined && Session.get("selectedTournId") != null &&  Session.get("getMaxEventPartsCountroSess")) {
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
                        k.res = s1
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
            if (Session.get("getOrdersCountSess") && 
                Session.get("selectedTournId") != undefined && Session.get("selectedTournId") != null && Session.get("eventListSchedule")) {
                return Session.get("getOrdersCountSess")
            }
        } catch (e) {
            alert(e)
        }
    },
    editData:function(){
        try{
            var res = Session.get("editDataRes")
            if(res && $("#tournamentListDate").val()){
                var s = _.filter(res,function(i){
                    return i.selectedDate == $("#tournamentListDate").val()
                })
                if(s && s[0] && s[0].duration){
                    return s[0]
                }
            }
        }catch(e){
            alert(e)
        }
    },
    scheduldeDATA:function(eventName,rou){
        try{
            var res = Session.get("editDataRes")
            if(res && res.scheduledData && this){
                let s1 = _.findWhere(res.scheduledData, {"round":rou, "eventName":eventName})
                if(s1 && s1.schedule)
                return s1.schedule
            }
        }catch(e){
            alert(e)
        }
    },
    matchNumbersFound:function(eventName,round,eveId){
        try{
            if(Session.get("selectedTournId")){
                var callMethod = ReactiveMethod.call("matchNumbersOfGivenSchedule",Session.get("selectedTournId"),eventName)
                if(callMethod){
                     let s1 = _.findWhere(callMethod, {"_id":eventName})
                     if(s1 && s1.rou){
                        let s2 = _.contains(s1.rou, round)
                        if(s2){
                            $("#getOrdersOfEvent"+eveId+round).attr('disabled', true)
                            return false
                        }
                        else{
                          //  $("#getOrdersOfEvent"+eveId+round).show()
                            return true
                        }
                     }
                     else{
                      //  $("#getOrdersOfEvent"+eveId+round).show()
                        return true
                     }
                }else{
                   // $("#getOrdersOfEvent"+eveId+round).show()
                    return true
                }
            }

        }catch(e){

        }
    },
    checkForEditSelectedOrder2:function(i){
        try{
        var eve = Template.parentData(3).eventName
        var ord = i
        var rou = Template.parentData()
        if(eve && rou && ord != undefined && ord != null){
            if(orders){
                let s1 = parseInt(ord+1)
                if(_.findWhere(orders, {"eventName":eve, "round":rou, "order":s1})){
                    return true
                }
            }
        }
        }catch(e){}
    },
    sessionSelectBox:function(){
        if(Session.get("numberOFSessions")){
            var count = parseInt(Session.get("numberOFSessions"))
            return _.range(1 , count + 1)
        }
    },
    showSessionSelectBox:function(){
        if(Session.get("numberOFSessions")){
            return true
        }
    },
    showEventsCategories:function(){
        if(Session.get("selectedSession")){
            return true
        }
    },
    showEventsView:function(){
        if(Session.get("showEventsViewSessio")){
            return true
        }
    },
    selectedEventListDATA:function(){
        try{
        if(Session.get("getMaxEventPartsCountroSess")){
            return Session.get("getMaxEventPartsCountroSess")
        }
        }catch(e){
            alert(e)
        }
    },
    scheduledDetailsForthisRound:function(){
        try{
            var round = this.toString()
            if(_.contains(Session.get("eventOfThisSess"), round) && Session.get("selectedEventForSched") && Session.get("selectedTournId")){
                var r = ReactiveMethod.call("detailsForThisRound",Session.get("selectedTournId"),Session.get("selectedEventForSched")
                        ,round)
                if(r && _.contains(Session.get("eventOfThisSess"), round)){
                    return r
                }
            }
        }catch(e){
            alert(e)
        }
    },
    unassigendMatchDetails:function(){
        try{
            var s1 = ""
            var detailsOfThis = Template.parentData(1)
            var round = this.toString()
            if(detailsOfThis && detailsOfThis.res){
                var s = []
                s.push(detailsOfThis.res)
                var rounda = round+"a"
                s1 = detailsOfThis.res[rounda]
            }
            if(_.contains(Session.get("eventOfThisSess"), round) && Session.get("selectedEventForSched") && Session.get("selectedTournId")){
                var checkByes = false
                let s2 = Session.get("getMaxEventPartsCountroSess")
                if(s2){
                    let s3 = _.findWhere(s2, {"eventName": Session.get("selectedEventForSched")})
                    if(s3){
                        if(s3&&round==s3["startRound"]){
                            checkByes = true
                        }
                        var r = ReactiveMethod.call("unAssignedMatchNumbs",Session.get("selectedTournId"),Session.get("selectedEventForSched")
                            ,round,s1,checkByes)
                        if(r && _.contains(Session.get("eventOfThisSess"), round)){
                            return r
                        }
                    }
                }
                
            }
        }catch(e){
            alert(e)
        }
    },
    ViewAddedSessionDEttable:function(){
        if(Session.get("ViewAddedSessionDet") && 
            Session.get("ViewAddedSessionTrue")){
            return Session.get("ViewAddedSessionDet")
        }else{
            return false
        }
    },

})




Template.tournSchedulerEdit.events({
    "change #tournamentList": function() {
        try {
            var selectedTournId = $("#tournamentList").val()

            Session.set("getMaxEventPartsCountroSess",undefined)
            Session.set("showEventsViewSessio",undefined)
            Session.set("selectedTournId",undefined)
            selectedData = []
            Session.set("eventOfThisSess",undefined)
            Session.set("ViewAddedSessionTrue",false)
            Session.set("ViewAddedSessionDet",undefined)
            if (selectedTournId) {
                var eve = events.findOne({
                    "_id": selectedTournId
                });
                Session.set("selectedTournIdDet", eve)
                Session.set("selectedTournId", selectedTournId)
                Meteor.call("getNumberOfOrder",Session.get("selectedTournId"),function(e,res){
                    if(res){
                         Session.set("getOrdersCountSess",res)
                    }
                });
            }
        } catch (e) {
            alert(e)
        }
    },
    "change #viewCategories":function(e){
        var s = $("#viewCategories").val()
        var ev = $("#viewCategories :selected").text()

        Session.set("getMaxEventPartsCountroSess",undefined)
        Session.set("showEventsViewSessio",undefined)
        Session.set("eventOfThisSess",undefined)
        selectedData = []
        Session.set("ViewAddedSessionTrue",false)
        Session.set("ViewAddedSessionDet",undefined)
        Session.set("selectedEventForSched",undefined)

        Meteor.call("subcribersFromDraws",Session.get("selectedTournId"),ev,"no",function(e,resp){
            if(resp){
                Session.set("selectedEventForSched",ev)
                var nums = ""
            if(Session.get("eventListSchedule")){
                var findSubs = _.findWhere(Session.get("eventListSchedule"), {"eventName":ev})
                if(findSubs){
                    if(findSubs.num){
                        nums = findSubs.num
                    }
                }
            }

            Meteor.call("getRoundNumbersTournScheduler", resp, ev,function(e,res){
                if(res){
                    var lm = []
                    if(Session.get("getMaxEventPartsCountroSess") == undefined){
                        res["_id"] = s
                        res["count"] = resp
                        res["num"] = nums
                        lm.push(res)
                        Session.set("showEventsViewSessio",undefined)
                        Session.set("getMaxEventPartsCountroSess",lm)
                        Session.set("showEventsViewSessio",true)
                    }
                    else{
                        lm = []
                        if(_.findWhere(lm, {"eventName":ev})){

                        }
                        else{
                            lm.push(res)
                            Session.set("showEventsViewSessio",undefined)
                            Session.set("getMaxEventPartsCountroSess",lm)
                            Session.set("showEventsViewSessio",true)
                        }
                    }
                }
            })
            }else if(e){
                alert(e)
            }
        })
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
    "keyup #durationOfEachMatch": function(event) {
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
                "everound":$("#"+e.target.id+" option:selected").attr("event")+"||"+$("#"+e.target.id).attr("roundName")
            }
            
            
            if (_.findWhere(orders, {"order":data.order}) == null || _.findWhere(orders, {"order":data.order}) == undefined) {
                if (_.findWhere(orders, {"everound":data.everound}) != null && _.findWhere(orders, {"everound":data.everound}) != undefined) {
                    orders = _.without(orders, _.findWhere(orders, {
                      "everound":data.everound
                    }));
                }
                $("#selectEventName"+$("#"+e.target.id).attr("eventId")+$("#"+e.target.id).attr("roundName")).attr('checked', true);
                orders.push(data)
            }
            else{
                if (_.findWhere(orders, {"everound":data.everound}) != null && _.findWhere(orders, {"everound":data.everound}) != undefined) {
                    orders = _.without(orders, _.findWhere(orders, {
                      "everound":data.everound
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
          //  var ttRange = _.range(parseInt(1) , parseInt($("td[name=toTDLength]").length))

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
                "everound":eveN+"||"+rou
            }
            if (_.findWhere(orders, {"everound":data.everound}) != null && _.findWhere(orders, {"everound":data.everound}) != undefined) {
                orders = _.without(orders, _.findWhere(orders, {
                    "everound":data.everound
                }));
            }
            $("#"+eveid+rou).val('Select Order');
            $("#getOrdersOfEvent"+eveid+rou).attr('disabled', true);
        }
       

    },
    "change #tournamentListDate":function(){
        try{
            
            Session.set("getMaxEventPartsCountroSess",undefined)
            Session.set("showEventsViewSessio",undefined)
            Session.set("eventOfThisSess",undefined)
            selectedData = []
            Session.set("ViewAddedSessionTrue",false)
            Session.set("ViewAddedSessionDet",undefined)
            Meteor.call("getResponseForgivenTournIID",Session.get("selectedTournId"), $("#tournamentListDate").val(),function(e,res){
                if(res && res.result == true && res.data){
                    Session.set("editDataRes",res.data)
                    var s = _.filter(res.data,function(i){
                        return i.selectedDate == $("#tournamentListDate").val()
                    })
                    if(s && s[0] && s[0].scheduledData)
                        orders = s[0].scheduledData
                }
                else{
                    Session.set("editDataRes",[])
                    orders = []
                }   
            })
            
        }catch(e){
            alert(e)
        }
    },
    "click #generateTestScheduleForTour": function(e) {
        try {
            if (Session.get("getMaxEventPartsCountroSess") == undefined || selectedData.length == 0) {
                alert("nothing changed")
            } else {
                var check = checkBasictimeValidEdit()
                if (check) {

                    var data = {
                        selectedDate: selectedDate,
                        startTime: startTime,
                        endTime: endTime,
                        break1St: break1St,
                        break1End: break1End,
                        break2St: break2St,
                        break2End: break2End,
                        noOfTablesPerDay: noOfTablesPerDay,
                        durationOfEachMatch: $("#durationOfEachMatch").val(),
                        tournamentId: Session.get("selectedTournId"),
                        type: "update",
                        starttimesession: startTime,
                        endtimesession: endTime,
                        noOfTablessession: noOfTablesPerDay,
                        tableNumbers: $("#commasepartedTablNos").val(),
                        eventNameSer:Session.get("selectedEventForSched")
                    }

                    Meteor.call("validateDateTimeDuration", data, function(e, res1) {
                        if (res1) {
                            if (res1.result != undefined && res1.result != null && res1.result == true) {
                                var s1 = $("#commasepartedTablNos").val().split(",")
                                Meteor.call("checkForTableNos", s1, data.starttimesession, data.endtimesession,
                                    data.selectedDate, Session.get("selectedTournId"),$("#durationOfEachMatch").val(),
                                    function(e, resforTabl) {
                                        if (resforTabl) {
                                            if (resforTabl.res == false) {
                                                if (resforTabl.toret)
                                                    alert(resforTabl.toret)
                                            } else if (resforTabl.res == true) {

                                                var ordersSort = _.sortBy(selectedData, function(o) {
                                                    return o.order;
                                                })

                                                var dataToSend = []
                                                if (Session.get("getMaxEventPartsCountroSess")) {
                                                    dataToSend = Session.get("getMaxEventPartsCountroSess")
                                                }

                                                data.selectedData = []
                                                data.selectedData = ordersSort
                                                data.datas = dataToSend

                                                $("#savingSchedulePopup").modal({
                                                    backdrop: 'static',
                                                    keyboard: false
                                                });
                                                $("#alreadySubscribedText").text("Checking data ..")
                                                

                                                Meteor.call("scheduleTimerUpdate", data,true, function(e, resp) {
                                                    if (e) {
                                                        alert(e)
                                                    } else {
                                                        durationRound = {
                                                            Finals: 0,
                                                            SF: 0,
                                                            QF: 0,
                                                            PQF: 0,
                                                            R32: 0,
                                                            R64: 0,
                                                            R128: 0,
                                                            R256: 0,
                                                            R512: 0
                                                        }
                                                        
                                                        if (resp && resp.result == true && resp.message) {
                                                            $("#savingSchedulePopup").modal('hide')
                                                            $('.modal-backdrop').remove();
                                                            alert(resp.message)
                                                        } else if (resp && resp.result == false && resp.message) {
                                                            $("#savingSchedulePopup").modal('hide')
                                                            $('.modal-backdrop').remove();
                                                            alert(resp.message)
                                                        }
                                                    }
                                                })


                                            }
                                        }

                                    })

                            } else {
                                if (res1.result != undefined && res1.result != null && res1.result == false) {
                                    if (res1.message) {
                                        alert(res1.message)
                                    }
                                }
                            }
                        } else if (e) {
                            alert(e)
                        }
                    })

                } else {}
            }
        } catch (e) {
            alert(e)
        }
    },
    "click #generateScheduleForTour": function(e) {
        try {
            if (Session.get("getMaxEventPartsCountroSess") == undefined || selectedData.length == 0) {
                alert("nothing changed")
            } else {
                var check = checkBasictimeValidEdit()
                if (check) {

                    var data = {
                        selectedDate: selectedDate,
                        startTime: startTime,
                        endTime: endTime,
                        break1St: break1St,
                        break1End: break1End,
                        break2St: break2St,
                        break2End: break2End,
                        noOfTablesPerDay: noOfTablesPerDay,
                        durationOfEachMatch: $("#durationOfEachMatch").val(),
                        tournamentId: Session.get("selectedTournId"),
                        type: "update",
                        starttimesession: startTime,
                        endtimesession: endTime,
                        noOfTablessession: noOfTablesPerDay,
                        tableNumbers: $("#commasepartedTablNos").val(),
                        eventNameSer:Session.get("selectedEventForSched")
                    }

                    Meteor.call("validateDateTimeDuration", data, function(e, res1) {
                        if (res1) {
                            if (res1.result != undefined && res1.result != null && res1.result == true) {
                                var s1 = $("#commasepartedTablNos").val().split(",")
                                Meteor.call("checkForTableNos", s1, data.starttimesession, data.endtimesession,
                                    data.selectedDate, Session.get("selectedTournId"),$("#durationOfEachMatch").val(),
                                    function(e, resforTabl) {
                                        if (resforTabl) {
                                            if (resforTabl.res == false) {
                                                if (resforTabl.toret)
                                                    alert(resforTabl.toret)
                                            } else if (resforTabl.res == true) {

                                                var ordersSort = _.sortBy(selectedData, function(o) {
                                                    return o.order;
                                                })

                                                var dataToSend = []
                                                if (Session.get("getMaxEventPartsCountroSess")) {
                                                    dataToSend = Session.get("getMaxEventPartsCountroSess")
                                                }

                                                data.selectedData = []
                                                data.selectedData = ordersSort
                                                data.datas = dataToSend

                                                $("#savingSchedulePopup").modal({
                                                    backdrop: 'static',
                                                    keyboard: false
                                                });
                                                $("#alreadySubscribedText").text("Saving data ..")
                                                Meteor.call("scheduleTimerUpdate", data,false, function(e, resp) {
                                                    if (e) {
                                                        alert(e)
                                                    } else {
                                                        durationRound = {
                                                            Finals: 0,
                                                            SF: 0,
                                                            QF: 0,
                                                            PQF: 0,
                                                            R32: 0,
                                                            R64: 0,
                                                            R128: 0,
                                                            R256: 0,
                                                            R512: 0
                                                        }
                                                        
                                                        if (resp && resp.result == true && resp.message) {
                                                            $("#savingSchedulePopup").modal('hide')
                                                            $('.modal-backdrop').remove();
                                                            Session.set("eventOfThisSess", undefined)
                                                            Session.set("ViewAddedSessionTrue",false)
                                                            Session.set("ViewAddedSessionDet",undefined)
                                                             $('input:checkbox').attr('checked',false);
                                                            $("input[id^=selectEventNEW]").attr("checked",false)
                                                            alert(resp.message)
                                                            selectedData = []
                                                        } else if (resp && resp.result == false && resp.message) {
                                                            $("#savingSchedulePopup").modal('hide')
                                                            $('.modal-backdrop').remove();
                                                            alert(resp.message)
                                                            selectedData = []
                                                        }
                                                    }
                                                })


                                            }
                                        }

                                    })

                            } else {
                                if (res1.result != undefined && res1.result != null && res1.result == false) {
                                    if (res1.message) {
                                        alert(res1.message)
                                    }
                                }
                            }
                        } else if (e) {
                            alert(e)
                        }
                    })

                } else {}
            }
        } catch (e) {
            alert(e)
        }
    },
    "keyup #enterNumberOfSessions": function(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8) {
            return true
        }
        if (event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return false;
        } else if (key < 48 || key > 57) {
            return false;
        } else{
            return true;
        } 
    },
    "click #addNewSession":function(e){
        Session.set("selectedSession",undefined)
        Session.set("showEventsViewSessio",undefined)
        Session.set("numberOFSessions",1)
        Session.set("selectedSession",1)
        $("#viewCategories").val("Select Events")

        Session.set("getMaxEventPartsCountroSess",undefined)
        Session.set("showEventsViewSessio",undefined)
        Session.set("eventOfThisSess",undefined)
        selectedData = []
        Session.set("ViewAddedSessionTrue",false)
        Session.set("ViewAddedSessionDet",undefined)
        //ViewAddedSession
    },

    
    "change #selectSessionBox":function(e){
        Session.set("selectedSession",$("#selectSessionBox").val())
        Session.set("showEventsViewSessio",undefined)
    },

    "click input[id^=selectEventNEW]":function(e){
        try{
        var round = this
        var roundSel = this
        var rv = $("#"+e.target.id).attr("eventID")
        var eventABB = $("#"+e.target.id).attr("eventABB")
        var orderss = $("#"+e.target.id).attr("ordersss")
        var idEve =  $("#"+e.target.id).attr("idEve")
        var proj =  $("#"+e.target.id).attr("proj")
        var tar = e.target
        Meteor.call("unAssignedMatchNumbs",Session.get("selectedTournId"),Session.get("selectedEventForSched")
            ,roundSel.toString(),"",false,function(e,restrict){
            if(restrict && restrict[0] && restrict[0].u.trim().length == 0&&$(tar).is(":checked")){
                alert("there are no unassigend matches")
                $("#"+tar.id).attr('checked', false)
            }
            else  if(restrict && restrict[0] && restrict[0].u.trim().length != 0){
                if($(tar).is(":checked")){
                    let s = Session.get("getMaxEventPartsCountroSess")//ReactiveMethod.call("getRoundNumbersTournScheduler", this.num, this.eventName)
                    if (s) {
                        let s1 = _.findWhere(s, {"eventName":rv})
                        if(s1){
                            var findROund = s1[roundSel]
                            var sEveDet = _.findWhere(Session.get("eventListSchedule"),{"eventName":rv})
                            if(sEveDet){
                                if(sEveDet._id){
                                    idEve = sEveDet._id
                                }
                                else{
                                    idEve = ""
                                }

                                if(sEveDet.projectType){
                                    proj = sEveDet.projectType
                                }
                                else{
                                    proj  = 0
                                }

                                if (sEveDet.abbName) {
                                    eventAB = sEveDet.abbName
                                }
                                else{
                                    eventABB = ""
                                }
                            }
                            var selectedDATAS = {
                                eventName: rv,
                                roundName:roundSel.toString(),
                                order:parseInt(orderss),
                                eventId:idEve,
                                abbName:eventABB,
                                projectType:proj
                            }

                            var findMatchnumbersWithoutBye = s1[roundSel+"a"]
                            if(round==s1["startRound"]){
                                var tournamentId = Session.get("selectedTournId")
                                var lUpto = findMatchnumbersWithoutBye.toString().split("-")
                                var seleventName = rv
                                Meteor.call("getOnlyMatchesWithoutBye", tournamentId,seleventName,lUpto,function(e,res){
                                    if(res){
                                        findMatchnumbersWithoutBye = res
                                        selectedDATAS["matchNumbers"] = res
                                    }
                                    else if(e){
                                        alert(e)
                                    }
                                })
                            }
                            else{
                                var lUpto = findMatchnumbersWithoutBye.toString().split("-")
                                findMatchnumbersWithoutBye = _.range(parseInt(parseInt(lUpto[0])), parseInt(parseInt(lUpto[1]) + 1))
                                selectedDATAS["matchNumbers"] = findMatchnumbersWithoutBye
                            }

                            

                            if(selectedData.length==0){
                                selectedData.push(selectedDATAS)
                            }
                            else{
                                if(_.findWhere(selectedData, {"eventName": rv,"roundName":roundSel.toString()})){
                                    selectedData = _.without(selectedData, _.findWhere(selectedData, {"eventName": rv,"roundName":roundSel.toString()}));
                                    selectedData.push(selectedDATAS)
                                }else{
                                    selectedData.push(selectedDATAS)
                                }
                            }
                        }
                    }
                }
            }
            else if(e){
                alert(e)
            }
        })

        if($(e.target).is(":checked") == false){
            if(_.findWhere(selectedData, {"eventName": rv,"roundName":roundSel.toString()})){
                selectedData = _.without(selectedData, _.findWhere(selectedData, {"eventName": rv,"roundName":roundSel.toString()}));
            }
        }

        }catch(e){
            alert(e)
        }
    },
    "click p[id^=showSchedDet]": function(e) {
        try {
            var eventNAme = $("#" + e.target.id).attr("eventID")
            var round = this.toString()

            var r = []
            if (_.contains(r, round) == false) {
                r.push(round)
                Session.set("eventOfThisSess", r)
            }
        } catch (e) {
            alert(e)
        }
    },
    "click #ViewAddedSession":function(e){
        Session.set("ViewAddedSessionTrue",true)
        Meteor.call("getSessionDetails",Session.get("selectedTournId"),$("#tournamentListDate").val(),function(e,res){
            if(res){
                Session.set("ViewAddedSessionDet",res)
            }else if(e){
                alert(e)
            }
        })
    },
    "click #closeSession":function(e){
        Session.set("ViewAddedSessionTrue",false)
        Session.set("ViewAddedSessionDet",undefined)
    },
    "click #deleteScheduleForeve":function(e){
        if($("#tournamentListDate").val()==undefined){
            alert("select date")
            return false
        }
        var tournamentId = Session.get("selectedTournId")
        var selectedDate = $("#tournamentListDate").val()
        var eventName = $("#viewCategories :selected").text()
        var deleteby = 1
        var r = confirm("Delete schedule of "+ eventName + " on "+ selectedDate + " ?");
        if (r == true) { 
            Meteor.call("deleteAnEventOfSchedule",tournamentId,eventName,selectedDate,deleteby,function(e,res){
                if(res == true){
                    alert("deleted")
                    selectedData = []
                    Session.set("eventOfThisSess",undefined)
                    Session.set("ViewAddedSessionTrue",false)
                    Session.set("ViewAddedSessionDet",undefined)
                }
                else if(res == false){
                    alert("cannot delete")
                }
                else if(e){
                    alert(e)
                }
            })
        } else {
           
        }
        
    },
    "click #deleteScheduleForTour":function(e){
        if($("#tournamentListDate").val()==undefined){
            alert("select date")
            return false
        }
        var tournamentId = Session.get("selectedTournId")
        var selectedDate = $("#tournamentListDate").val()
        var eventName = $("#viewCategories :selected").text()
        var deleteby = 2
        var name = ""
        if(Session.get("selectedTournIdDet")){
            var det = Session.get("selectedTournIdDet")
            if(det && det.eventName){
                name = det.eventName
            }
        }
        var r = confirm("Delete schedule of "+ name + " on "+ selectedDate + " ?");
        if (r == true) { 
            Meteor.call("deleteAnEventOfSchedule",tournamentId,eventName,selectedDate,deleteby,function(e,res){
                if(res ==true){
                    alert("deleted")
                    selectedData = []
                    Session.set("eventOfThisSess",undefined)
                    Session.set("ViewAddedSessionTrue",false)
                    Session.set("ViewAddedSessionDet",undefined)
                }
                else if(res == false){
                    alert("cannot delete")
                }
                else if(e){
                    alert(e)
                }
            })
        } else {
           
        }
    }
})





Template.registerHelper("checkForEditSelected",function(eve,rou,eveId){
    try{
        let resp = Session.get("editDataRes")
        if(eve && rou){
            //var res = _.filter(resp,function(i){
            //    return i.selectedDate == $("#tournamentListDate").val()
            //})

            if(orders){
                if(_.findWhere(orders, {"eventName":eve, "round":rou})){
                    return true
                }
                else{
                    $("#getOrdersOfEvent"+eveId+rou).attr('disabled', true)
                    return false
                }
            }
            else{
                $("#getOrdersOfEvent"+eveId+rou).attr('disabled', true)
                return false
            }
        }
        else{
            $("#getOrdersOfEvent"+eveId+rou).attr('disabled', true)
            return false
        }
    }catch(e){
        alert(e)
    }
})

Template.registerHelper("checkForEditSelectedOrder",function(eve,rou,ord,eveId){
    try{
        let res = Session.get("editDataRes")
        if(eve && rou && ord != undefined && ord != null){
            /*var s = _.filter(res,function(i){
                return i.selectedDate == $("#tournamentListDate").val()
            })*/
            if(orders){
                let s1 = parseInt(ord+1)
                //if(_.findWhere(orders, {"eventName":eve, "round":rou, "order":s1})){
                    //return true
                //}
            }
        }
    }catch(e){
        alert(e)
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
    Finals:0,
    SF:0,
    QF:0,
    PQF:0,
    R32:0,
    R64:0,
    R128:0,
    R256:0,
    R512:0
}

export const checkBasicDurationValidEdit = function(){

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

export const checkBasictimeValidEdit = function(){
    try{
     selectedDate = $("#tournamentListDate").val()
     startTime = $("#startTime").val()
     endTime = $("#endTime").val()
    if($("#durationOfEachMatch").val() == undefined || $("#durationOfEachMatch").val() == null 
        || $("#durationOfEachMatch").val().trim().length == 0 || parseInt($("#durationOfEachMatch").val()) == 0)
        break1St = 0
    else{
        break1St = $("#durationOfEachMatch").val()
    }

    /*if($("#break1endTime").val() == undefined || $("#break1endTime").val() == null 
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
    */
    if(break1St == undefined || break1St == null){
        break1St = 0
    }

    /*if(break1End == undefined || break1End == null){
        break1End = 0
    }
    if(break2St == undefined || break2St == null){
        break2St = 0
    }
    if(break2End == undefined || break2End == null){
        break2End = 0
    }*/

    noOfTablesPerDay = $("#commasepartedTablNos").val()

    if(selectedDate && selectedDate.trim().length != 0){
        if(startTime && startTime != 0  && startTime.trim().length != 0 && moment(startTime, 'h:mm:ss A', true).isValid()){
            if(endTime && endTime != 0 && endTime.trim().length != 0 && moment(endTime, 'h:mm:ss A', true).isValid()){
                if( parseInt(break1St) !=  0 && break1St.toString().trim().length != 0){
                    //if( break1End.toString().trim().length != 0){
                       //if( break2St.toString().trim().length != 0){
                            //if( break2End.toString().trim().length != 0){
                                if(noOfTablesPerDay  && noOfTablesPerDay.trim().length != 0){
                                    if(noOfTablesPerDay){
                                        var regex = /^[0-9]+(,[0-9]+)*$/;
                                        if(regex.test(noOfTablesPerDay)){
                                          
                                           var s1  = noOfTablesPerDay.split(",")
                                           var sa = _.uniq(s1)
                                           if(sa.length != s1.length){
                                            alert("table contains repeated nos")
                                            return false
                                           }
                                           else{
                                            return true
                                           }
                                        }
                                        else{
                                            alert("enter valid tables")
                                            return false
                                        }

                                    }
                                    else{
                                        alert("enter no of tables")
                                        return false
                                    }
                                   // var check = checkBasicDurationValidEdit()
                                    //if(check){
                                    //}else{
                                    //    return false
                                    //}
                                }else{
                                    alert("enter no of tables")
                                    return false
                                }
                            /*}else{
                                break2End = 0
                                alert("enter valid break2End time")
                                return false
                            }*/
                        /*}else{
                            break2St = 0
                            alert("enter valid break2start time")
                            return false
                        }*/
                    /*}else{
                        break1End = 0
                        alert("enter valid break1End time")
                        return false
                    }*/
                }else{
                    alert("enter valid duration")
                    return false
                }
            }else{
                alert("end time is not valid")
                return false
            }
        }else{
            alert("start time is not valid")
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