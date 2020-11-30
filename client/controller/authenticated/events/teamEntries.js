var userSubscription = false;

var dbsrequired = ["playerTeamEntries","userDetailsTT"]
var playerTeamEntries = "playerTeamEntries"
var userDetailsTT = "userDetailsTT"

//userDetailsTTUsed

Template.playerTeamWise.onCreated(function() {
    this.subscribe("onlyLoggedIn")
    this.subscribe('eventFeeSettings');

    this.searchBy = new ReactiveVar(undefined);
    this.userNameOfDues = new ReactiveVar(undefined);
    this.userIdOfDues = new ReactiveVar(undefined);
    this.tournDetails = new ReactiveVar(undefined);
    this.SearchByIDData = new ReactiveVar(undefined);
    this.HTMLViewOFFee_player_finance = new ReactiveVar(undefined);



    if (Router.current().params._id) {
        var tournamentId = Router.current().params._id;
        Meteor.call("changeDbNameForDraws", tournamentId,dbsrequired,function(e, res) {
            if(res){
                if(res.changeDb && res.changeDb == true){
                    if(res.changedDbNames.length!=0){
                        playerTeamEntries = res.changedDbNames[0]
                        userDetailsTT = res.changedDbNames[1]
                    }
                }
            }
        });

        var template = this;
        template.autorun(function() {
            var currentPage = parseInt(Router.current().params.page) || 1;
            var skipCount = parseInt(parseInt((currentPage - 1)) * 10);


            if(Template.instance().searchBy.get() == undefined)
            {
                if(userSubscription) userSubscription.stop();
                userSubscription = template.subscribe('getPlayerTeamFinancial', skipCount, Router.current().params._id);
            }
            else
            {
                var affiliationID = $("#searchByAfilID").val();
                if(userSubscription) userSubscription.stop();
                userSubscription = template.subscribe('getPlayerTeamFinancialOnSearch', skipCount, Router.current().params._id,affiliationID);
            }
        });
    }
    
});

var currentPage = function() {
    return parseInt(Router.current().params.page) || 1;
}

var hasMorePages = function() {
    if(Template.instance().searchBy.get() == undefined)
    {
        var totalPlayers = Counts.get('players_team_financial_Count');
        return currentPage() * parseInt(10) < totalPlayers;
    }
    else
    {
        var totalPlayers = Counts.get('players_team_search_financial_Count');
        return currentPage() * parseInt(10) < totalPlayers;
    }
}


Template.playerTeamWise.onRendered(function() {
    Session.set("tournamentSub",undefined);

});

Template.playerTeamWise.helpers({
    data: function() {
        return this.params._PostId;
    },
    prevPage: function() {
        try {
            var currentPage = parseInt(Router.current().params.page) || 1;
            var previousPage = currentPage === 1 ? 1 : parseInt(currentPage - 1);
            //return Router.routes.playerTeamWise.path({
            //    _id: Router.current().params._id,
               // page: previousPage
            //})
            return Router.routes.feeList.path({_id:Router.current().params._id,page:previousPage})


        } catch (e) {}
    },
    nextPage: function() {
        try {
            var currentPage = parseInt(Router.current().params.page) || 1;
            var nextPage = parseInt(currentPage + 1);
            //return Router.routes.playerTeamWise.path({
                //_id: Router.current().params._id,
                //page: nextPage
            //})
            return Router.routes.feeList.path({_id:Router.current().params._id,page:nextPage})

        } catch (e) {}
    },

    prevPageClass: function() {
        return currentPage() <= 1 ? "none" : "";
    },
    nextPageClass: function() {
        return hasMorePages() ? "" : "none";
    },
    "HTMLViewOFFeeData": function() {
        if (Template.instance().SearchByIDData.get() != undefined) {
            return Template.instance().SearchByIDData.get();
        } 
        else 
        {
            try 
            {
                var index = 0;
                if (Router.current().params.page == 1) {
                    index = 1
                } else {
                    index = parseInt(parseInt((Router.current().params.page - 1) * 10) + 1)
                }
                var id = Router.current().params._id;
                var playerEntryCount = global[playerTeamEntries].find({}).fetch();
                var tournamentId = Router.current().params._id;
                var eventList = [];
                var eventFeeList = [];
                var tournamentName = "";
                var tournamentName = ReactiveMethod.call("myeventsTournaments",Router.current().params._id);
                if (tournamentName && tournamentName.eventOrganizer) 
                {
                    if (tournamentName.eventOrganizer == Meteor.userId()) 
                    {
                        Meteor.call("eventSubLastUnderTournHelper_past", tournamentId, function(e, result) {
                            if (e) {

                            } else {
                                    Session.set("tournamentSub",result);
                            }
                        });

                        var eventSettingsInfo = eventFeeSettings.findOne({"tournamentId": tournamentId})
                        if (eventSettingsInfo) 
                        {
                            eventList = eventSettingsInfo.teamEvents;
                            eventFeeList = eventSettingsInfo.eventFees;
                        }

                        var playerListArr1 = [];
                        var playerListArr = [];

                        playerListArr1 = global[playerTeamEntries].find({"tournamentId": tournamentId
                            }).fetch();
                        for (var h = 0; h < playerListArr1.length; h++) 
                        {
                            var playerId = playerListArr1[h].playerId;
                            var academyId = playerListArr1[h].academyId;
                            var total = 0;

                            dataD = {
                                tourID: Router.current().params._id,
                                tournamentName: tournamentName.eventName
                            }

                            var playerEntry = global[playerTeamEntries].findOne({
                                "tournamentId": tournamentId,"playerId": playerId
                                });
                            var userInfo = ReactiveMethod.call("getPlayerDetailToSendReceipt",playerId,userDetailsTT);

                            if (playerEntry && userInfo && playerEntry.subscribedEvents) 
                            {
                                total = playerEntry.totalFee;

                                subscribedEvents = playerEntry.subscribedEvents;

                                teamEventsID = "";
                                if(playerEntry.subscribedTeamID)
                                {
                                    teamEventsID = playerEntry.subscribedTeamID;
                                }
                                var playerName = userInfo.userName;
                                var playerEmail = userInfo.emailAddress;
                                var playerDOB = userInfo.dateOfBirth;
                                if (userInfo.emailAddress == undefined) {
                                    userInfo.emailAddress = "";
                                }
                                if(userInfo.phoneNumber == undefined)
                                    userInfo.phoneNumber = "";
                                var academy = "";
                                var academyMailID = "";
                                var academyContactPerson = "";
                                var academyInfo = ReactiveMethod.call("getAcademyDetail",academyId);
                                dataD["playerMailID"]=userInfo.emailAddress;

                                if (academyInfo) 
                                {
                                    academy = academyInfo.clubName;
                                    academyMailID = academyInfo.emailAddress;
                                    if(academyInfo.contactPerson != undefined)
                                        academyContactPerson = academyInfo.contactPerson;
                                }

                                if(userInfo.affiliatedTo&&userInfo.affiliatedTo.trim() == "school"){
                                    dataD["playerMailID"]="";
                                    if(userInfo.schoolId){
                                        var schoolInfo = ReactiveMethod.call("getSchoolDetailForTeamSendReceipt",userInfo.schoolId);
                                        if (schoolInfo) {
                                            academyId = userInfo.schoolId
                                            academy = schoolInfo.schoolName
                                            academyMailID = schoolInfo.emailAddress
                                        }
                                    }
                                }
                                dataD["playerName"] = userInfo.userName;
                                dataD["playerId"] = playerId,
                                
                                dataD["playerPhoneNo"] = userInfo.phoneNumber;
                                dataD["academyId"] = academyId;
                                dataD["academyName"] = academy;
                                dataD["academyMailID"] = academyMailID;
                                dataD["academyContactPerson"] = academyContactPerson;
                                dataD["phoneNumber"] = userInfo.phoneNumber;
                                dataD["emailAddress"] = userInfo.emailAddress;
                                dataD["dob"] = playerDOB;
                                dataD["total"] = total;
                                dataD["eventNames"] = eventList;
                                dataD["eventFee"] = subscribedEvents;
                                dataD["subscribedTeamEventsID"] = teamEventsID;
                                playerListArr.push(dataD)
                            }
                        }


                            if (playerListArr.length == 0) {
                                return 0;
                            } else {
                                playerListArr.sort(sortClubName_HTML("playerName"));
                                var routerIndex = 0;
                                if (Router.current().params.page == 1) {
                                    routerIndex = 1
                                } else {
                                    routerIndex = parseInt(parseInt((Router.current().params.page - 1) * 10) + 1)
                                }

                                playerListArr.map(function(document, index) {
                                    document["slNo"] = parseInt(index) + parseInt(routerIndex);
                                });
                                Template.instance().HTMLViewOFFee_player_finance.set(playerListArr);

                                return playerListArr;
                            }
                        }
                    }

            } catch (e) {
            }
        }

    },

    eventId: function() {
        return Router.current().params._id
    },


    eventListsFees: function() {
        var jsonS = [];
        var sum = 0;
        var sum2 = 0
        var arrayId = [];
        var tourIdsForOver = [];
        var lis = [];
        var slNo = 0;
        try {
            var thisID = this.userIdD;
            var userNameD = this.userNameD;
            var userId = Meteor.users.findOne({
                "_id": Meteor.userId()
            });
            if (userId && userId.userId)
                var eve = events.find({
                    "eventOrganizer": userId.userId,
                    "tournamentEvent": true
                }).fetch().forEach(function(lEvents, i) {
                    sum2 = 0;
                    slNo = 0;
                    slNo = parseInt(i);
                    var checksent = sentReceipt.find({
                        "sentReceiptTournamentId": lEvents._id,
                        "sentReceiptUserId": thisID
                    }).fetch();
                    if (lEvents._id != Router.current().params._id && checksent.length == 0) {
                        var getCountryId = timeZone.findOne({
                            "state": {
                                $elemMatch: {
                                    "stateId": lEvents.domainId.toString()
                                }
                            }
                        });
                        if (getCountryId != undefined) {
                            var uf = moment.utc(getCountryId.timeStamp * 1000).format("YYYY/DD/MMM") // hh:mm a");
                            var uf1 = new Date(uf).getTime() / 1000;
                            var d1 = moment(getCountryId.timeStampUpdatedDate).format();
                            var diff = Math.abs(new Date(d1) - new Date());
                            var diffh = (diff / 1000)
                            var now = new Date(uf1 * 1000);
                            now.setSeconds(now.getSeconds() + diffh);
                            var nowing = new Date(now).getTime() / 1000;
                            var dateT2 = (new Date(lEvents.eventStartDate1)).getTime() / 1000;
                            var dateT3 = (new Date(lEvents.eventEndDate1)).getTime() / 1000;
                            var uf4 = moment.utc(dateT2 * 1000).zone(lEvents.offset).format("YYYY/DD/MMM") // hh:mm a");
                            var uf6 = moment.utc(dateT3 * 1000).zone(lEvents.offset).format("YYYY/DD/MMM") // hh:mm a");
                            var uf5 = new Date(uf4).getTime() / 1000;
                            var uf7 = new Date(uf6).getTime() / 1000;
                            if ((moment(uf7 * 1000).startOf('day') < moment(nowing * 1000).startOf('day'))) {
                                var eveUnd = events.find({
                                    "tournamentId": lEvents._id,
                                    eventParticipants: {
                                        $in: [thisID]
                                    }
                                }).fetch();
                                if (eveUnd.length != 0) {
                                    for (var i = 0; i < eveUnd.length; i++) {
                                        sum = parseInt(sum + parseInt(eveUnd[i].prize))
                                        sum2 = parseInt(sum2 + parseInt(eveUnd[i].prize));
                                    };
                                    var data2 = {
                                        tournamentId: lEvents._id,
                                        total: sum2,
                                        slNo: slNo
                                    }
                                    tourIdsForOver.push(lEvents._id)
                                    arrayId.push(data2)
                                }
                            }
                        }
                    }
                });

            var data = {
                userId: thisID,
                userNameD: userNameD,
                tournamentId: arrayId,
                sums: sum
            }
            lis.push(data);
            return lis
        } catch (e) {}
    }
});

Template.playerTeamWise.events({
    "click #sendRec": function(e,template) {
        e.preventDefault();
        $("#confirmPasswordRender").empty();
  
        Session.set("useridToSend",undefined);
        Session.set("detailsToSendReciept",undefined);
        Session.set("useridToSend",this.playerId);
        Session.set("detailsToSendReciept",this);
        Blaze.render(Template.confirmPasswordPlayerTeamSendRec, $("#confirmPasswordRender")[0]);
        $("#confirmPasswordPlayerTeamSendRec").modal({backdrop: 'static'});
    },
    'click #dueId': function(e) {
        e.preventDefault()
        $("#duesOfTournaRender").empty();
        Session.set("userNameOfDues", this.userNameD);
        Session.set("userIdOfDues", this.userId);
        Session.set("tournDetails", this);
        Blaze.render(Template.duesOfTourn, $("#duesOfTournaRender")[0]);
        $('#duesOfTourn').modal({
            backdrop: 'static'
        });
    },
    "click #clearInputField": function(e) {
        Template.instance().SearchByIDData.set(undefined);
        Template.instance().searchBy.set(undefined);
        $("#searchByAfilID").val("");
    },
    "keydown #searchByAfilID": function(e) {
        if (e.keyCode == 8 || e.keyCode == 46)
        {
            Template.instance().SearchByIDData.set(undefined);
            Template.instance().searchBy.set(undefined);
          
        }

    },
    "click #searchByBtn": function(e) {
        try {
            var affiliationID = $("#searchByAfilID").val();
            Template.instance().searchBy.set("1");
            Router.go("feeList", {_id:Router.current().params._id,page:1})
        } catch (e) {}
    }
});



function sortClubName_HTML(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function(a, b) {
        var result = (a[property].toUpperCase() < b[property].toUpperCase()) ? -1 : (a[property].toUpperCase() > b[property].toUpperCase()) ? 1 : 0;
        return result * sortOrder;
    }
}




// on payment
Template.confirmPasswordPlayerTeamSendRec.onCreated(function() {
    //this.subscribe("users")
});

Template.confirmPasswordPlayerTeamSendRec.events({
    'submit form': function(e) {
        e.preventDefault();
        $("#changePasswordSucc").html("")
    },
    'focus #oldPassword': function(e) {
        $("#changePasswordSucc").html("")
    },
});

Template.confirmPasswordPlayerTeamSendRec.onRendered(function() {
    $('#application-confirmPasswordPlayerTeamSendRec').validate({
        onkeyup: false,
        rules: {
            oldPassword: {
                required: true,
                minlength: 6,
            },
        },
        showErrors: function(errorMap, errorList) {
            $("#application-confirmPasswordPlayerTeamSendRec").find("input").each(function() {
                $(this).removeClass("error");
            });
            if (errorList.length) {
                $("#changePasswordError").html("<span class='glyphicon glyphicon-remove-sign red'></span> " + errorList[0]['message']);
                $(errorList[0]['element']).addClass("error");
            }
        },
        messages: {
            oldPassword: {
                required: "Please enter  your password ",
                minlength: "Please enter a valid  password.",
            },
        },
        submitHandler: function() {
            $("#changePasswordError").html("");
            var digest = Package.sha.SHA256($('#oldPassword').val());
            try {
                Meteor.call('checkPassword', digest, function(err, result) {
                    try {
                        if (result.error == null) {
                            $("#confirmPasswordPlayerTeamSendRec").modal('hide');

                            var details = Session.get("detailsToSendReciept");
                            var emailToPlayer = details.playerMailID;
                            var emailToclub = details.academyMailID;
                            emailToPlayer = "";
                            if (emailToPlayer == ""||emailToPlayer==null) 
                            {
                                var sentData = {
                                    sentReceiptUserId: details.playerId,
                                    sentReceiptTournamentId: details.tourID,
                                    academyId: details.academyId,
                                    total: details.total,
                                    abbName: details.eventNames,
                                    events_value: details.eventFee
                                }

                                Meteor.call("insertPlayerTeamReceipt", sentData, playerTeamEntries, function(e, r) {
                                    if (r) 
                                    {                                      
                                        var academyContactPerson = details.academyContactPerson;
                                        var subscribedTeamEventsID = details.subscribedTeamEventsID;
                                        Meteor.call("getTeamInfo",subscribedTeamEventsID,function(error,result){
                                            if(result)
                                            {
                                                $("#sendingMailPopup2").modal({backdrop: 'static'});
                                                var dataContext = {
                                                    message: "Here is confirmation for recent subscription of your academy/school player, tournamentName",
                                                    tournament: details.tournamentName,
                                                    eventName: details.eventNames,
                                                    prize: details.eventFee,
                                                    myName: academyContactPerson,
                                                    total: details.total,
                                                    playerName: details.playerName,
                                                    playerPhone: details.phoneNumber,
                                                    teamDetails:result
                                                }

                                                var html = Blaze.toHTMLWithData(Template.sendReceiptOfSubscriptionForOnlyClub, dataContext);
                                                var options = {
                                                    from: "iplayon.in@gmail.com",
                                                    to: emailToclub,
                                                    //cc:["shalini.krishnan90@gmail.com"],
                                                    subject: "iPlayOn:Receipt of subscription",
                                                    html: html
                                                }
                                                var smsTemplate = "Hi,Here is confirmation for recent subscription of your academy/school player "+details.playerName+" of tournament "+details.tournamentName;
                                                for(var v=0;v<details.eventNames.length;v++)
                                                {
                                                    if(v == 0)
                                                        smsTemplate += "\n Events:\n";
                                                    if(details.eventFee[v] != null && parseInt(details.eventFee[v]) > 0)
                                                        smsTemplate += details.eventNames[v]+" - Rs."+details.eventFee[v]+"\n";
                                                }

                                                smsTemplate += "Entry fee total: Rs."+details.total;

                                                var ccUserId = [];
                                                Meteor.call("sendSMSEmailNotification",details.academyId,smsTemplate,options,ccUserId,function(error,result)
                                                {
                                                    if(error)
                                                        displayMessage(error);
                                                    else if(result){}
                                                        //displayMessage(result);
                                                });

                                               
                                                setTimeout(function(){
                                                    $("#sendingMailPopup2").modal('hide');
                                                    }, 1000);
                                            }
                                        });
                                    }
                                });
                            } 
                            else 
                            {
                                var emailToclub;
                                var emailToPlayer;
                                emailToclub = details.academyMailID;
                                emailToPlayer = details.playerMailID;

                                var sentData = {
                                    sentReceiptUserId: details.playerId,
                                    sentReceiptTournamentId: details.tourID,
                                    academyId: details.academyId,
                                    total: details.total,
                                    abbName: details.eventNames,
                                    events_value: details.eventFee
                                }

                                Meteor.call("insertPlayerTeamReceipt", sentData, playerTeamEntries,function(error, result) {
                                    if (result) 
                                    {       
                                        var subscribedTeamEventsID = details.subscribedTeamEventsID;
                                        Meteor.call("getTeamInfo",subscribedTeamEventsID,function(error,result)
                                            {
                                                if(result)
                                                {

                                                    $("#sendingMailPopup2").modal({backdrop: 'static'});                         
                                                    var dataContext = {
                                                        message: "Here is your confirmation for your last subscription on iPlayOn",
                                                        tournament: details.tournamentName,
                                                        myName: details.playerName,
                                                        eventName: details.eventNames,
                                                        total: details.total,
                                                        prize: details.eventFee,
                                                        playerName: details.playerName,
                                                        playerPhone: details.phoneNumber,
                                                        teamDetails:result
                                                    }

                                                    var html = Blaze.toHTMLWithData(Template.sendReceiptOfSubscription, dataContext);
                                                    var options = {
                                                        from: "iplayon.in@gmail.com",
                                                        to: emailToPlayer,
                                                        cc: emailToclub,
                                                        subject: "iPlayOn:Receipt of subscription",
                                                        html: html
                                                    }


                                                                var smsTemplate = "Hi,Here is confirmation for recent subscription of your academy/school player "+details.playerName+" of tournament "+details.tournamentName;
                                                for(var v=0;v<details.eventNames.length;v++)
                                                {
                                                    if(v == 0)
                                                        smsTemplate += "\n Events:\n";
                                                    if(details.eventFee[v] != null && parseInt(details.eventFee[v]) > 0)
                                                        smsTemplate += details.eventNames[v]+" - Rs."+details.eventFee[v]+"\n";
                                                }

                                                smsTemplate += "Entry fee total: Rs."+details.total;
                                                var ccUserId = [];

                                                Meteor.call("sendSMSEmailNotification",details.playerId,smsTemplate,options,ccUserId,function(error,result)
                                                {
                                                    if(error)
                                                        displayMessage(error);
                                                    else if(result)
                                                        displayMessage(result);
                                                });
                                               



                                                    setTimeout(function(){
                                                        $("#sendingMailPopup2").modal('hide');
                                                    }, 1000);



                                                }
                                            });


                                        

                                       
                                    }

                                });
                            }
                        } else {
                            $("#changePasswordError").html("<span class='glyphicon glyphicon-remove-sign red'></span> " + result.error.reason);
                        }
                    } catch (e) {}
                });
            } catch (e) {}
        }
    });
});



//register helper
Template.registerHelper('checkReceiptSent_playerTeam', function(data) {
    try {
        var j = global[playerTeamEntries].findOne({
            "playerId": data,
            "tournamentId": Router.current().params._id,
            "paidOrNot": true
        });
        if (j != undefined) {
            return "re-send"
        } else {
            return "send"
        }
    } catch (e) {}

});
