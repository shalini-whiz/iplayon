Template.layoutDefault.onRendered(function() {
    ff();
    Session.set("eventDetails", undefined)
});

Template.layoutDefault.onCreated(function() {
    this.subscribe("scrollableevents");
    this.subscribe("layoutDefaultBottom");
});

Template.layoutDefault.helpers({
    "dynamicEvents": function() {
        try {
            if (Session.get("eventDetails") != undefined)
                return Session.get("eventDetails")
            else return false
        } catch (e) {}
    },

    "layoutDefaultifUpcoming": function() {
        try {
            var layoutDefaultBottoms = layoutDefaultBottom.find({
                "eventsExist": true
            }).fetch()
            if (layoutDefaultBottoms != undefined) {
                return layoutDefaultBottoms
            }
        } catch (e) {}
    },
    "layoutDefaultifNoUpcoming": function() {
        try {
            var layoutDefaultBottoms = layoutDefaultBottom.find({
                "eventsExist": false
            }).fetch()
            if (layoutDefaultBottoms != undefined) {
                return layoutDefaultBottoms
            }
        } catch (e) {}
    }
});

Template.layoutDefault.events({
    'click .container': function(e) {
        Session.set("playerName1Searched_SPA2", undefined);
        Session.set("playerName2Searched_SPA2", undefined);
        Session.set("serviceStrokeSearch", undefined)
        Session.set("destinationStrokesSearch", undefined)
            //e.preventDefault();
        var userDropDown = $("#userDropDown");
        var sortEventsDropDown = $("#sortEventsDropDown");
        var blackListDropDown = $("#blackListDropDown");
        var teamsDropDown = $("#teamsDropDown");
        var fghfdg = $("#selectWhoDropDown");
        var ggg = $("#selectWhoDropDown2");


        var sportsSelectionMenuEntry = $("#sportsSelectionMenu");
        if (!sportsSelectionMenuEntry.is(e.target) // if the target of the click isn't the container...
            &&
            sportsSelectionMenuEntry.has(e.target).length === 0) // ... nor a descendant of the container
        {
            if ($("#sportsSelectionMenu").hasClass("open")) {
                $("#sportsSelectionMenu").removeClass("open");
                $("#sportsSelectionMenu").children("ul").slideUp("fast");
            }
        }

        var filterSelectionMenuEntry = $("#filterSelectionMenu");
        if (!filterSelectionMenuEntry.is(e.target) // if the target of the click isn't the container...
            &&
            filterSelectionMenuEntry.has(e.target).length === 0) // ... nor a descendant of the container
        {
            if ($("#filterSelectionMenu").hasClass("open")) {
                $("#filterSelectionMenu").removeClass("open");
                $("#filterSelectionMenu").children("ul").slideUp("fast");
            }
        }

        var filterDataSelectionMenuEntry = $("#filterDataSelectionMenu");
        if (!filterDataSelectionMenuEntry.is(e.target) // if the target of the click isn't the container...
            &&
            filterDataSelectionMenuEntry.has(e.target).length === 0) // ... nor a descendant of the container
        {
            if ($("#filterDataSelectionMenu").hasClass("open")) {
                $("#filterDataSelectionMenu").removeClass("open");
                $("#filterDataSelectionMenu").children("ul").slideUp("fast");
            }
        }
        var eventsSelectionMenuEntry = $("#eventsSelectionMenu");
        if (!eventsSelectionMenuEntry.is(e.target) // if the target of the click isn't the container...
            &&
            eventsSelectionMenuEntry.has(e.target).length === 0) // ... nor a descendant of the container
        {
            if ($("#eventsSelectionMenu").hasClass("open")) {
                $("#eventsSelectionMenu").removeClass("open");
                $("#eventsSelectionMenu").children("ul").slideUp("fast");
            }
        }

        var drawsSelectionMenuEntry = $("#drawsSelectionMenu");
        if (!drawsSelectionMenuEntry.is(e.target) // if the target of the click isn't the container...
            &&
            drawsSelectionMenuEntry.has(e.target).length === 0) // ... nor a descendant of the container
        {
            if ($("#drawsSelectionMenu").hasClass("open")) {
                $("#drawsSelectionMenu").removeClass("open");
                $("#drawsSelectionMenu").children("ul").slideUp("fast");
            }
        }


        var drawsSelectionMenuEntry_RR = $("#drawsSelectionMenu_RR");
        if (!drawsSelectionMenuEntry_RR.is(e.target) // if the target of the click isn't the container...
            &&
            drawsSelectionMenuEntry_RR.has(e.target).length === 0) // ... nor a descendant of the container
        {
            if ($("#drawsSelectionMenu_RR").hasClass("open")) {
                $("#drawsSelectionMenu_RR").removeClass("open");
                $("#drawsSelectionMenu_RR").children("ul").slideUp("fast");
            }
        }

        var eventSelectionMenuEntry = $("#eventSelectionMenu");
        if (!eventSelectionMenuEntry.is(e.target) // if the target of the click isn't the container...
            &&
            eventSelectionMenuEntry.has(e.target).length === 0) // ... nor a descendant of the container
        {
            if ($("#eventSelectionMenu").hasClass("open")) {
                $("#eventSelectionMenu").removeClass("open");
                $("#eventSelectionMenu").children("ul").slideUp("fast");
            }
        }

        var eventSelectionMenuEntry = $("#eventSelectionMenu_RR");
        if (!eventSelectionMenuEntry.is(e.target) // if the target of the click isn't the container...
            &&
            eventSelectionMenuEntry.has(e.target).length === 0) // ... nor a descendant of the container
        {
            if ($("#eventSelectionMenu_RR").hasClass("open")) {
                $("#eventSelectionMenu_RR").removeClass("open");
                $("#eventSelectionMenu_RR").children("ul").slideUp("fast");
            }
        }

        var stationarySelectionMenuEntry = $("#stationarySelectionMenu");
        if (!stationarySelectionMenuEntry.is(e.target) // if the target of the click isn't the container...
            &&
            stationarySelectionMenuEntry.has(e.target).length === 0) // ... nor a descendant of the container
        {
            if ($("#stationarySelectionMenu").hasClass("open")) {
                $("#stationarySelectionMenu").removeClass("open");
                $("#stationarySelectionMenu").children("ul").slideUp("fast");
            }
        }

        var stationarySelectionMenuEntry_RR = $("#stationarySelectionMenu_RR");
        if (!stationarySelectionMenuEntry_RR.is(e.target) // if the target of the click isn't the container...
            &&
            stationarySelectionMenuEntry_RR.has(e.target).length === 0) // ... nor a descendant of the container
        {
            if ($("#stationarySelectionMenu_RR").hasClass("open")) {
                $("#stationarySelectionMenu_RR").removeClass("open");
                $("#stationarySelectionMenu_RR").children("ul").slideUp("fast");
            }
        }

        var resultsSelectionMenuEntry = $("#resultsSelectionMenu");
        if (!resultsSelectionMenuEntry.is(e.target) // if the target of the click isn't the container...
            &&
            resultsSelectionMenuEntry.has(e.target).length === 0) // ... nor a descendant of the container
        {
            if ($("#resultsSelectionMenu").hasClass("open")) {
                $("#resultsSelectionMenu").removeClass("open");
                $("#resultsSelectionMenu").children("ul").slideUp("fast");
            }
        }


        var resultsSelectionMenuEntry_RR = $("#resultsSelectionMenu_RR");
        if (!resultsSelectionMenuEntry_RR.is(e.target) // if the target of the click isn't the container...
            &&
            resultsSelectionMenuEntry_RR.has(e.target).length === 0) // ... nor a descendant of the container
        {
            if ($("#resultsSelectionMenu_RR").hasClass("open")) {
                $("#resultsSelectionMenu_RR").removeClass("open");
                $("#resultsSelectionMenu_RR").children("ul").slideUp("fast");
            }
        }


        var currentEntriesListDropDown = $("#currentEntriesListDropDown");
        if (!currentEntriesListDropDown.is(e.target) // if the target of the click isn't the container...
            &&
            currentEntriesListDropDown.has(e.target).length === 0) // ... nor a descendant of the container
        {
            if ($("#currentEntriesListDropDown").hasClass("open")) {
                $("#currentEntriesListDropDown").removeClass("open");
                $("#currentEntriesListDropDown").children("ul").slideUp("fast");
            }
        }
        if (!userDropDown.is(e.target) // if the target of the click isn't the container...
            &&
            userDropDown.has(e.target).length === 0) // ... nor a descendant of the container
        {
            if ($("#userDropDown").hasClass("open")) {
                $("#userDropDown").removeClass("open");
                $("#userDropDown").children("ul").slideUp("fast");
            }
        }
        if (!sortEventsDropDown.is(e.target) // if the target of the click isn't the container...
            &&
            sortEventsDropDown.has(e.target).length === 0) // ... nor a descendant of the container
        {
            if ($("#sortEventsDropDown").hasClass("open")) {
                $("#sortEventsDropDown").removeClass("open");
                $("#sortEventsDropDown").children("ul").slideUp("fast");
            }
        }

        if (!blackListDropDown.is(e.target) // if the target of the click isn't the container...
            &&
            blackListDropDown.has(e.target).length === 0) // ... nor a descendant of the container
        {
            if ($("#blackListDropDown").hasClass("open")) {
                $("#blackListDropDown").removeClass("open");
                $("#blackListDropDown").children("ul").slideUp("fast");
                $('#selectTag2').slimScroll({
                    height: '5.4em',
                    color: 'maroon',
                    size: '3px',
                    width: '100%'
                });
            }
        }
        if (!teamsDropDown.is(e.target) // if the target of the click isn't the container...
            &&
            teamsDropDown.has(e.target).length === 0) // ... nor a descendant of the container
        {
            if ($("#teamsDropDown").hasClass("open")) {
                $("#teamsDropDown").removeClass("open");
                $("#teamsDropDown").children("ul").slideUp("fast");
                $('#selectTag1').slimScroll({
                    height: '5.4em',
                    color: 'maroon',
                    size: '3px',
                    width: '100%'
                });
            }
        }
        if (!fghfdg.is(e.target) // if the target of the click isn't the container...
            &&
            fghfdg.has(e.target).length === 0) {
            if ($("#selectWhoDropDown").hasClass("open")) {
                $("#selectWhoDropDown").removeClass("open");
                $("#selectWhoDropDown").children("ul").slideUp("fast");
            }
        }

        var sortEventsDropDown = $("#ipSelectEveDropDown");
        if (!sortEventsDropDown.is(e.target) // if the target of the click isn't the container...
            &&
            sortEventsDropDown.has(e.target).length === 0) // ... nor a descendant of the container
        {
            if ($("#ipSelectEveDropDown").hasClass("open")) {
                $("#ipSelectEveDropDown").removeClass("open");
                $("#ipSelectEveDropDown").children("ul").slideUp("fast");
            }
        }

    }
})

Template.layoutDefault.helpers({
    actualLoadedTemplate: function() {
        var v = Router.current().route.getName();
        if (v == "manageDistrictAssocBystate" || v == "manageAcademiesAssoc" || v == "managePlayersAssocAcad" || v == "adminManagePlayers" ||
            v == "eventTournamentDraws" || v == "roundRobinDraws" || v === "getaboutIplayOn" || v == "aboutIplayOn" || v == "en/terms/index.html" || v === "getListofPlayers" || v === "Activate" || v === "Analytics" || v === "feeList" || v == "RankingAnalytics" || v == "entryFromAcademy" || v == "statistics" || v === "statisticsList" || v === "apiKey" || v == "adminUpload" || v == "adminUploadPoints" || v == "deletePoints" || v == "adminUploadPlayersAssociation" || v == "adminTeamFormat" || v == "adminStrokes" || v == "playerAnalytics" || v == "tweets" || v == "adminManageHashTags" || v == "editHashTags" || v == "playerSequenceMain" || v == "playerAnalyticsRectChart" ||
            v == "testCALENDER" || v == "iplayonHome" || v == "iplayonProfile" || v == "adminManageTournament" || v == "createAdminArticles" || v == "articlesMainMenu" || v == "viewAdminArticles" || v == "createInsertUpdatePacks" || v == "removeInsertedPacks" || v == "createInsertUpdateCategories" || v == "removeInsertedCategories" ||
            v == "testTTFIAPITest" ||
            v == "addPackFeature" || v == "removePackFeature" || v == "testTTFIAPI" ||
            v == "addPackFeature" || v == "removePackFeature" || v == "testTTFIAPI" || v == "testAPI" ||
            v == "tournScheduler" || v == "tournSchedulerEdit" || v == "tournScheduleMainMenu" || v == "tournSchedulerView" || v == "tournSchedulerPastTourn" || v == "tournSchedulerEditPast" || v == "tournSchedulerPastEventsView" || v == "tournSchedulerPastEvents" || v == "adminFinance" || v == "myFinance" || 
            v == "adminCustomAPI" || v == "adminRoleAPI" ||
            v == "approveArticles" || v == "tournamentProjects" ||
            v == "adminAddCategories"|| v == "getUserDetailsForGivenEmailOrPhone" ||
             v == "eventTournamentDraws1" || v == "homeResults" || 
             v == "adminChangeUserDetails" || v== "iPlayOnPolicy" || 
             v == "tournamentEventOrg_FANAPP" ||
             v == "rankPoints" || v == "schoolRegisterUpload" || v == "eventSchedule") 
        {
 
            return true
        }
    },
    backgroundForSequence: function() {
        var v = Router.current().route.getName();
        if (v == "playerSequenceMain" || v == "playerAnalyticsRectChart" ||
            v == "eventTournamentDraws1" || v == "homeResults") {
            return "grad2"
        } else if (v == "iplayonHome" || v == "iplayonProfile") {
            return "grad1"
        } else {
            return "grad3"
        }
    }
});
var ff = function() {
    Meteor.setInterval(function() {
        ttt()
    }, 2400);
}
var ttt = function() {
    var jsonS = []
    try {
        var eve = scrollableevents.find({

        }).fetch().forEach(function(e, i) {
            if (moment(moment(e.eventStartDate1).format("YYYY-MM-DD")) > moment(moment.tz(e.timeZoneName).format("YYYY-MM-DD"))) {
                e.type = 1;
                jsonS.push(e)
            } else if (moment(moment(e.eventEndDate1).format("YYYY-MM-DD")) >= moment(moment.tz(e.timeZoneName).format("YYYY-MM-DD")) && (moment(moment(e.eventStartDate1).format("YYYY-MM-DD")) <= moment(moment.tz(e.timeZoneName).format("YYYY-MM-DD")))) {
                e.type = 0;
                jsonS.push(e)
            }
        })
        var array = jsonS;
        if (array.length !== 0) {
            var randomIndex = Math.floor(Math.random() * array.length);
            var element = array[randomIndex];
            var r = []
            r.push(array[randomIndex])
            Session.set("eventDetails", r)
        } else {
            Session.set("eventDetails", undefined)
        }
    } catch (e) {}
}


/*var ttt = function(){
  Meteor.call("scrollableeventsLIST",function(e,res){
    try{
      if(res){
        var array = res;
        if(array.length!==0){
          var randomIndex = Math.floor( Math.random() * array.length );
          var element = array[randomIndex];
          var r=[]
          r.push(array[randomIndex])
          Session.set("eventDetails",r)
        }
        else{
          Session.set("eventDetails",undefined)
        }
      }
    }catch(e){
    }
  })
}*/