Template.duesOfTourn.onCreated(function() {
    //this.subscribe('users');
    this.subscribe('sentReceipt');
    this.subscribe('allEvents');
    this.subscribe('overrideDueTotal')
});

Template.duesOfTourn.onRendered(function() {
    Session.set("lEventsUp",undefined)
    Session.set("arrDetails",undefined)
});

Template.duesOfTourn.helpers({
    userName: function() {
        return Session.get("userNameOfDues")
    },

    eventLists: function() {
        try {
            var arrayD=[];
            if(Session.get("tournDetails")){
                return Session.get("tournDetails").tournamentId;
            }
        } catch (e) {
        }
    },
    overidedAmt:function(){
        try{
            var arrayT=Session.get("tournDetails").tournamentId;
            var tournamentIds=[]
            var sum="";
            var lEvents = events.findOne({"_id":Router.current().params._id});
            if(lEvents){
                for(var i=0;i<arrayT.length;i++){
                    var ifOverrideDue = overrideDueTotal.findOne({
                        overrideUserId:Session.get("userIdOfDues"),
                        eventOrganizer:lEvents.eventOrganizer,
                        tournamentIds:{$in:[arrayT[i].tournamentId]}
                    })
                    if(ifOverrideDue&&ifOverrideDue.overrideDueAmt){
                        sum = parseInt(ifOverrideDue.overrideDueAmt)
                    }
                }
            }
            return sum
        }
        catch(e){
        }
    },
    marginTop:function(){
        try{
            var arrayT=Session.get("tournDetails").tournamentId;
            var tournamentIds=[]
            var sum=0;
            var lEvents = events.findOne({"_id":Router.current().params._id});
            if(lEvents){
                for(var i=0;i<arrayT.length;i++){
                    var ifOverrideDue = overrideDueTotal.findOne({
                        overrideUserId:Session.get("userIdOfDues"),
                        eventOrganizer:lEvents.eventOrganizer,
                        tournamentIds:{$in:[arrayT[i].tournamentId]}
                    })
                    if(ifOverrideDue&&ifOverrideDue.overrideDueAmt){
                        sum = parseInt(ifOverrideDue.overrideDueAmt)
                    }
                }
            }
            if(sum==0){
                return "50px";
            }
            else{
                return "61px";
            }
        }
        catch(e){
        }
    }
});

Template.duesOfTourn.events({

    "click #sendRecDue":function(e){
        e.preventDefault();
        Session.set("arrDetails",this)
        $("#askPasswordCheck").show();
        $("#askPasswordText").val("")
    },

    "click #passwordAskOK":function(e){
        e.preventDefault();
        var arrDetails = Session.get("arrDetails");
        $("#editSettingsPopupError").html("")
        if($("#askPasswordText").val().trim().length!==0)
        {
            try{
            var digest = Package.sha.SHA256($("#askPasswordText").val());
            Meteor.call('checkPassword', digest, function(err, result) {
                try{
                   
                if(result.error==null){
                    var details = Session.get("arrDetails");

                    //$("#sendRecDue").val("re-send")
                    $("#askPasswordCheck").hide();
                    
                    var emailAddress=Meteor.users.findOne({"userId":Session.get("userIdOfDues")});
                    $('[name='+details.tournamentId+']').val("re-send"); 

                    if(emailAddress){
                        var emailAddCC="";
                        if(emailAddress.clubNameId){
                             emailAddCC=Meteor.users.findOne({"userId":emailAddress.clubNameId});
                        }
                        else{
                            emailAddCC=""
                        }
                        if(!emailAddress.emails||emailAddress.emails==null){
                            var j = events.findOne({"_id":details.tournamentId,
                            "tournamentEvent":true});
                            if(j){
                               details["tournamentName"]=j.eventName;
                            }
                            else{
                               details["tournamentName"]=""
                            }
                            var sentData={
                                sentReceiptUserId:Session.get("userIdOfDues"),
                                sentReceiptTournamentId:details.tournamentId
                            }
                            if(emailAddCC.emails){
                                emailToclub=emailAddCC.emails[0].address
                            }
                            Meteor.call("insertSentREceipt",sentData,function(e,r){

                            });
                            $("#editSettingsPopupError").html("sending email..")
                            var dataContext = {
                                message: "Here is confirmation for recent subscription of your academy player, tournamentName is",
                                tournament: details.tournamentName,
                                myName: emailAddCC.contactPerson,
                                total:details.total,
                                playerName:Session.get("userNameOfDues"),
                                playerPhone:emailAddress.phoneNumber
                            }
                            var html = Blaze.toHTMLWithData(Template.sendReceiptOfSubscriptionForOnlyClub, dataContext);
                
                            var options = {
                               from: "iplayon.in@gmail.com",
                               to: emailToclub,
                               subject: "iPlayOn:Receipt of subscription",
                               html: html
                            }
                            
                            Meteor.call("sendShareEmail", options, function(e, re) {
                                if(re){
                                    alert("Network issue, Please Check your subscription and try again")
                                }
                                else{
                                 $("#editSettingsPopupError").html("")
                                }
                            });
                        }
                        else{
                            var details = Session.get("arrDetails");
                            var emailToclub;
                            if(emailAddCC.emails){
                                emailToclub=emailAddCC.emails[0].address
                            }
                            else{
                                emailToclub=""
                            }
                            var sentData={
                                sentReceiptUserId:Session.get("userIdOfDues"),
                                sentReceiptTournamentId:details.tournamentId
                            }
                            $("#editSettingsPopupError").html("sending email..")
                            Meteor.call("insertSentREceipt",sentData,function(e,r){

                            });
                            var j = events.findOne({"_id":details.tournamentId,
                            "tournamentEvent":true});
                            if(j){
                               details["tournamentName"]=j.eventName;
                            }
                            else{
                               details["tournamentName"]=""
                            }
                            emailsDd= emailAddress.emails[0].address
                            var dataContext = {
                                message: "Here is your confirmation for your recent payment of due subscription fee on iPlayOn, tournamentName is",
                                tournament: details.tournamentName,
                                myName: Session.get("userNameOfDues"),
                                total:details.total
                            }
                            var html = Blaze.toHTMLWithData(Template.sendReceiptOfSubscription, dataContext);
                
                            var options = {
                               from: "iplayon.in@gmail.com",
                               to: emailsDd,
                               cc:emailToclub,
                               subject: "Heloo1: iPlayOn:Receipt of subscription",
                               html: html
                            }
                            Meteor.call("sendShareEmail", options, function(e, re) {
                                if(re){
                                    //alert("Network issue, Please Check your subscription and try again")
                                }
                                else{
                                 $("#editSettingsPopupError").html("")
                                }
                            });
                        }
                    }
                }
                else $("#editSettingsPopupError").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+result.error.reason);
                }catch(e){
                }
            });
            }catch(e){
            }
        }
        else{
            $("#editSettingsPopupError").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+"Password required");
        }
    },

    "keyup #askPasswordText":function(e){
         e.preventDefault()
        $("#editSettingsPopupError").html("");
    },

    "click #passwordAskCancel":function(e){
        $("#editSettingsPopupError").html("");
        $("#askPasswordCheck").hide();
    },

    "keyup #overRideDueAmt":function(e){
        e.preventDefault()
        $("#editSettingsPopupError").html("");
    },

    "click #overRideDueAmtAskOK":function(e){
         e.preventDefault()
         if($("#overRideDueAmt").val().trim().length==0){
            $("#editSettingsPopupError").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+"Enter amount to override");
         }
         else{
            $("#askPasswordCheck2").show();
            $("#askPasswordText2").val("")
         }
    },

    "keyup #askPasswordText2":function(e){
         e.preventDefault()
        $("#editSettingsPopupError").html("");
    },

    "click #passwordAskCancel2":function(e){
        $("#editSettingsPopupError").html("");
        $("#askPasswordCheck2").hide();
    },

    "click #passwordAskOK2":function(e){
        e.preventDefault();
        if($("#askPasswordText2").val().trim().length!==0){
            try{
            var digest = Package.sha.SHA256($("#askPasswordText2").val());
            Meteor.call('checkPassword', digest, function(err, result) {
                try{
                if(result.error==null){

                    $("#askPasswordCheck2").hide();
                    $("#askPasswordText2").val("");
                    var arrayT=Session.get("tournDetails").tournamentId;
                    var tournamentIds=[]
                    for(var i=0;i<arrayT.length;i++){
                        tournamentIds.push(arrayT[i].tournamentId)
                    }
                    var eventOrganizer = events.findOne({"_id":Router.current().params._id});
                    if(eventOrganizer&&eventOrganizer.eventOrganizer){
                        eventOrganizer=eventOrganizer.eventOrganizer
                    }
                    else{
                        eventOrganizer=""
                    }
                    var data={
                        overrideUserId:Session.get("userIdOfDues"),
                        eventOrganizer:eventOrganizer,
                        tournamentIds:tournamentIds,
                        overrideDueAmt:$("#overRideDueAmt").val()
                    }
                    Meteor.call("insertOverrideDues",data,function(e,res){

                    })
                }
                else $("#editSettingsPopupError").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+result.error.reason);
                }catch(e){
                }
            });
            }catch(e){
            }
        }
        else{
            $("#editSettingsPopupError").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+"Password required");
        }
    },

    "click #overRideDueAmtSendRec":function(e){
        if($("#overRideDueAmt").val().trim().length==0){
            $("#editSettingsPopupError").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+"Enter amount to override");
        }
        else{
            $("#askPasswordCheck3").show();
            $("#askPasswordText3").val("")
         }
    },

    "keyup #askPasswordText3":function(e){
        e.preventDefault()
        $("#editSettingsPopupError").html("");
    },

    "click #passwordAskCancel3":function(e){
        e.preventDefault()
        $("#editSettingsPopupError").html("");
        $("#askPasswordCheck3").hide();
    },

    "click #passwordAskOK3":function(e){
        e.preventDefault()
        if($("#askPasswordText3").val().trim().length!==0){
            try{
                var digest = Package.sha.SHA256($("#askPasswordText2").val());
                Meteor.call('checkPassword', digest, function(err, result) {
                    try{
                        if(result.error==null){
                            $("#askPasswordCheck3").hide();
                            $("#askPasswordText3").val("");
                        }
                        else{
                            $("#editSettingsPopupError").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+result.error.reason);
                        }
                    }catch(e){

                    }
                });
            }catch(e){

            }
        }
    }
});

Template.registerHelper('getTournamentName',function(data){
    try{
        var j = events.findOne({"_id":data,
        "tournamentEvent":true});
        if(j!=undefined){
            return j.eventName
        }
    }catch(e){
    }

});




/** Academy wise due template functionalities **/
Template.duesOfAcademyTourn.onCreated(function() {
    //this.subscribe('users');
    this.subscribe('sentReceipt');
    this.subscribe('allEvents');
    this.subscribe('overrideDueTotal')
});

Template.duesOfAcademyTourn.onRendered(function() {
    Session.set("lEventsUp",undefined)
    Session.set("arrDetails",undefined)
});

Template.duesOfAcademyTourn.helpers({
    
    eventLists: function() {
        try {
            var arrayD=[];
            if(Session.get("tournDetails")){
                return Session.get("tournDetails").tournamentId;
            }
        } catch (e) {
        }
    },
    overidedAmt:function(){
        try{
            var arrayT=Session.get("tournDetails").tournamentId;
            var tournamentIds=[]
            var sum="";
            var lEvents = events.findOne({"_id":Router.current().params._id});
            if(lEvents){
                for(var i=0;i<arrayT.length;i++){
                    var ifOverrideDue = overrideDueTotal.findOne({
                        overrideUserId:Session.get("userIdOfDues"),
                        eventOrganizer:lEvents.eventOrganizer,
                        tournamentIds:{$in:[arrayT[i].tournamentId]}
                    })
                    if(ifOverrideDue&&ifOverrideDue.overrideDueAmt){
                        sum = parseInt(ifOverrideDue.overrideDueAmt)
                    }
                }
            }
            return sum
        }
        catch(e){
        }
    },
    marginTop:function(){
        try{
            var arrayT=Session.get("tournDetails").tournamentId;
            var tournamentIds=[]
            var sum=0;
            var lEvents = events.findOne({"_id":Router.current().params._id});
            if(lEvents){
                for(var i=0;i<arrayT.length;i++){
                    var ifOverrideDue = overrideDueTotal.findOne({
                        overrideUserId:Session.get("userIdOfDues"),
                        eventOrganizer:lEvents.eventOrganizer,
                        tournamentIds:{$in:[arrayT[i].tournamentId]}
                    })
                    if(ifOverrideDue&&ifOverrideDue.overrideDueAmt){
                        sum = parseInt(ifOverrideDue.overrideDueAmt)
                    }
                }
            }
            if(sum==0){
                return "50px";
            }
            else{
                return "61px";
            }
        }
        catch(e){
        }
    }
});

Template.duesOfAcademyTourn.events({

    "click #sendRecDue":function(e){
        e.preventDefault();
        Session.set("arrDetails",this)
        $("#askPasswordCheck").show();
        $("#askPasswordText").val("")
    },

    "click #passwordAskOK":function(e){
        e.preventDefault();
        var arrDetails = Session.get("arrDetails");
        $("#editSettingsPopupError").html("")
        if($("#askPasswordText").val().trim().length!==0){
            try{
            var digest = Package.sha.SHA256($("#askPasswordText").val());
            Meteor.call('checkPassword', digest, function(err, result) {
                try{
                    if(result.error==null){
                        $("#askPasswordCheck").hide();
                        var details = Session.get("arrDetails");
                        $('[name='+details.tournamentId+']').val("re-send"); 
                        var clubInfo= Meteor.users.findOne({"userId":Session.get("userIdOfDues")});
                        var emailToclub = "";
                        var academyName="";
                        var tournamentID = details.tournamentId;
                        var playerList = details.playerList;
                    
                        if(clubInfo)
                        {
                            emailToclub = clubInfo.emails[0].address;
                            academyName = clubInfo.userName;
                            var sentData={
                                sentReceiptUserId:Session.get("userIdOfDues"),
                                sentReceiptTournamentId:tournamentID
                            }
                            Meteor.call("insertSentREceipt",sentData,function(e,r){

                            });
                            $("#editSettingsPopupError").html("sending email..");

                            var j = events.findOne({"_id":tournamentID,
                                    "tournamentEvent":true});
                            if(j)
                                details["tournamentName"]=j.eventName;
                            else
                                details["tournamentName"]=""
                                
                            var dataContext = {
                                message: "Here is your confirmation for your recent payment of due subscription fee on iPlayOn, tournamentName is",
                                tournament: details.tournamentName,
                                myName:academyName,
                                total:details.total
                            }
                            var html = Blaze.toHTMLWithData(Template.sendReceiptOfSubscription, dataContext);


                            var options = {
                                from: "iplayon.in@gmail.com",
                                to: emailToclub,
                                subject: "iPlayOn:Receipt of subscription",
                                html: html
                            }

                            Meteor.call("sendShareEmail", options, function(e, re) {
                                if(re){
                                    alert("Network issue, Please Check your subscription and try again")
                                }
                                else{
                                    $("#editSettingsPopupError").html("")
                                }
                            });
                        }
                            
                        for(var a=0; a<playerList.length; a++)
                        {
                            var playerID = playerList[a];
                            var sentData={
                                sentReceiptUserId:playerID,
                                sentReceiptTournamentId:tournamentID
                            }
                            Meteor.call("insertSentREceipt",sentData,function(e,r){

                            });
                        }
                    }
                    else 
                        $("#editSettingsPopupError").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+result.error.reason);
                }catch(e){}
                });
            }catch(e){}
        }
        else{
            $("#editSettingsPopupError").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+"Password required");
        }
    },

    "keyup #askPasswordText":function(e){
         e.preventDefault()
        $("#editSettingsPopupError").html("");
    },

    "click #passwordAskCancel":function(e){
        $("#editSettingsPopupError").html("");
        $("#askPasswordCheck").hide();
    },

    "keyup #overRideDueAmt":function(e){
        e.preventDefault()
        $("#editSettingsPopupError").html("");
    },

    "click #overRideDueAmtAskOK":function(e){
         e.preventDefault()
         if($("#overRideDueAmt").val().trim().length==0){
            $("#editSettingsPopupError").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+"Enter amount to override");
         }
         else{
            $("#askPasswordCheck2").show();
            $("#askPasswordText2").val("")
         }
    },

    "keyup #askPasswordText2":function(e){
         e.preventDefault()
        $("#editSettingsPopupError").html("");
    },

    "click #passwordAskCancel2":function(e){
        $("#editSettingsPopupError").html("");
        $("#askPasswordCheck2").hide();
    },

    "click #passwordAskOK2":function(e){
        e.preventDefault();
        if($("#askPasswordText2").val().trim().length!==0){
            try{
            var digest = Package.sha.SHA256($("#askPasswordText2").val());
            Meteor.call('checkPassword', digest, function(err, result) {
                try{
                if(result.error==null){
                    $("#askPasswordCheck2").hide();
                    $("#askPasswordText2").val("");
                    var arrayT=Session.get("tournDetails").tournamentId;
                    var tournamentIds=[]
                   
                    for(var i=0;i<arrayT.length;i++){
                        tournamentIds.push(arrayT[i].tournamentId)
                    }
                    var eventOrganizer = events.findOne({"_id":Router.current().params._id});
                    if(eventOrganizer&&eventOrganizer.eventOrganizer){
                        eventOrganizer=eventOrganizer.eventOrganizer
                    }
                    else{
                        eventOrganizer=""
                    }
                    var data={
                        overrideUserId:Session.get("userIdOfDues"),
                        eventOrganizer:eventOrganizer,
                        tournamentIds:tournamentIds,
                        overrideDueAmt:$("#overRideDueAmt").val()
                    }
                    Meteor.call("insertOverrideDues",data,function(e,res){

                    })
                }
                else $("#editSettingsPopupError").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+result.error.reason);
                }catch(e){
                }
            });
            }catch(e){
            }
        }
        else{
            $("#editSettingsPopupError").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+"Password required");
        }
    },

    "click #overRideDueAmtSendRec":function(e){
        if($("#overRideDueAmt").val().trim().length==0){
            $("#editSettingsPopupError").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+"Enter amount to override");
        }
        else{
            $("#askPasswordCheck3").show();
            $("#askPasswordText3").val("")
         }
    },

    "keyup #askPasswordText3":function(e){
        e.preventDefault()
        $("#editSettingsPopupError").html("");
    },

    "click #passwordAskCancel3":function(e){
        e.preventDefault()
        $("#editSettingsPopupError").html("");
        $("#askPasswordCheck3").hide();
    },

    "click #passwordAskOK3":function(e){
        e.preventDefault()
        if($("#askPasswordText3").val().trim().length!==0){
            try{
                var digest = Package.sha.SHA256($("#askPasswordText2").val());
                Meteor.call('checkPassword', digest, function(err, result) {
                    try{
                        if(result.error==null){
                            $("#askPasswordCheck3").hide();
                            $("#askPasswordText3").val("");
                        }
                        else{
                            $("#editSettingsPopupError").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+result.error.reason);
                        }
                    }catch(e){

                    }
                });
            }catch(e){

            }
        }
    }
});

