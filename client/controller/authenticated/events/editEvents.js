//Template helpers, events for template editEvents.html
/**
 * @Author Vinayashree
 */
/**
 * client side subscription to the server side publications
 * @SubscribeName: projects(used to subscribe to projects)
 *                 to get the list of projects.
 * @SubscribeName: eventUploads (used to subscribe to eventUploads)
 *                  to get the eventUploads list
 * @SubscribeName: subDomain1 (used to subscribe to subDomain1)
 *                  to get the subDomain1 list
 * @SubscribeName: subDomain2 (used to subscribe to subDomain1)
 *                  to get the subDomain2 list
 * @SubscribeName: users (used to subscribe to users)
 *                 to get the list of users.
 * @SubscribeName: domains (used to subscribe to domains)
 *                 to get the list of domains.
 * @SubscribeName: allEvents (used to subscribe to all events)
 *                 to get the list of events.
 *
 */
Template.editEvents.onCreated(function() {
    this.subscribe("tournamentEVENT",Router.current().params._PostId);
    this.subscribe("eventsLIST",Router.current().params._PostId)
    this.subscribe("subscriptionRestrictionsParam",Router.current().params._PostId)
   // this.subscribe("projects");
    this.subscribe("domains");
    this.subscribe("eventUploads");
    this.subscribe("subDomain1");
    this.subscribe("subDomain2");
    this.subscribe("onlyLoggedIn");
    this.subscribe("onlyLoggedInALLRoles")
    this.subscribe("tournamentEvents");
    //not used
    this.subDomain1Check = new ReactiveVar();

});
    var venLat = 0, venLong = 0;
    var timezoneIdEventLat=0 ,timezoneIdEventLng=0,clickOKeditaddEvents=0;
    var addEveStartSet=0, endEveStartSet=0;
/**
 * OnDestroy of template editEvents, set changeEditVenue
 * and changeEditVenue to zero (to reinitiate)
 */
Template.editEvents.onDestroyed(function(){
    changeEditVenue = 0;
    changeDragVenue = 0 ;
    changeSearchbefore=0;
    timezoneIdEventLat=0 ,timezoneIdEventLng=0;
    Session.set("addEventArray",undefined);
    Session.set("addEventArray",null);
    Session.set("dateChanged1",undefined)
    Session.set("dateChanged0",null)
    Session.set("dateChanged1",null)
    Session.set("dateChanged0",undefined)
    Session.set("editEventDateChange",undefined)
    Session.set("editEventDateChange",null)
    Session.set("subscriptionTypeDirect",undefined);
    Session.set("subscriptionTypeHyper",undefined);
    Session.set("hyperLinkValue",undefined)
    Session.set("subscriptionTypeMail",undefined);
    Session.set("subscriptionTypeMailValue",undefined)
    Session.set("subscriptionTypeDirect",null);
    Session.set("subscriptionTypeHyper",null);
    Session.set("hyperLinkValue",null)
    Session.set("subscriptionTypeMail",null);
    Session.set("subscriptionTypeMailValue",null)
});

/**
 *  Onrendered  of template editEvents.html
 *  initialize css bootstrap datetimepicker
 *
 *
 */
Template.editEvents.onRendered(function() {
    $('#editDomainName').select2({
        width: "100%",
    });

    $('b[role="presentation"]').hide();
    
    // $('.select2-selection__arrow').append('<i class="fa fa-angle-down"></i>');
    
    //call validation function for edit events fields
    editEventValidate();
    
    $('#sponImg').hide();
    
    //call validation function for sponsor upload fields
    editSponsorUploadValidate();
    
    /*
     * initialize bootstrap datetimepicker for #closureDate,#endDate and #startDate
     */
    $('#closureDate').datetimepicker({
        toolbarPlacement: 'bottom',
        showClose: true,
        widgetPositioning: {
            vertical: 'bottom',
            horizontal: 'left',
        },
        useCurrent: false,
        format:"YYYY MMM DD"
        //defaultDate: new Date(),
        //minDate: moment(new Date())//.add(-1, 'days').startOf('day'),
        //disabledDates: [moment(new Date())/*.add(-1, 'days').startOf('day')*/],
    });
    
    $('#startDate').datetimepicker({
        toolbarPlacement: 'bottom',
        showClose: true,
        widgetPositioning: {
            vertical: 'bottom',
            horizontal: 'left',
        },
        useCurrent: false,
        format:"YYYY MMM DD"
        //defaultDate: new Date(),
        //minDate: moment(new Date())/*.add(-1, 'days').startOf('day')*/,
        //disabledDates: [moment(new Date())/*.add(-1, 'days').startOf('day')*/],
    });
    
    $('#endDate').datetimepicker({
        toolbarPlacement: 'bottom',
        showClose: true,
        widgetPositioning: {
            vertical: 'bottom',
            horizontal: 'left',
        },
        useCurrent: false,
        format:"YYYY MMM DD"
        //defaultDate: new Date(),
        //minDate: moment(new Date())/*.add(-1, 'days').startOf('day')*/,
        //disabledDates: [moment(new Date())/*.add(-1, 'days').startOf('day')*/],
    });
    $("#closureDate").keypress(function(event) {event.preventDefault();});
    $("#startDate").keypress(function(event) {event.preventDefault();});
    $("#endDate").keypress(function(event) {event.preventDefault();});
    Session.set("sponsorLogoDispUpdate", null);
    Session.set("sponsorLogoDispUpdate", undefined);
    Session.set("subDomain2ID", undefined)
    Session.set("subDomain2ID", null)
    Session.set("subDomain1ID", undefined)
    Session.set("subDomain1ID", null)
    /*
     * initialize slim scroll for select main tags
     * and select secondary tags
     */
    $('#selectMainTag').slimScroll({
        height: '8em',
        color: 'black',
        size: '3px',
        width: '100%'
    });

    $('#selectSecTag').slimScroll({
        height: '8em',
        color: 'black',
        size: '3px',
        width: '100%'
    });
});

/**
 * template helpers which connects editEvents.html
 * lEvent is a function to fetch events for an Id
 *          lId holds the event id which comes as request
 *          parameters.
 * lProjectName is a function to fetch projectNames.
 * lDomainName is  a function to fetch domainNames.
 * lSponsorPdf is a function to fetch the uploaded sponsor
 *           files details for lId
 *           lId holds the event id which comes as request
 *           parameters.
 * lrulesAndRegulations is a function fetch uploaded rules and
 *           regulations file details for lId
 *           lId holds the event id which comes as request
 *           parameters.
 */
var gSponsorFileId = "";
var gRulesAndReg = "";
var gSponsorUrl = "";
var gSponsorLogo = "";
var gSponsorPdf = "";
var gSponsorMailId = "";
var gEventId = "";
var gEditSponsorPdf = "";
var gEditSponsorLogo = "";

Template.editEvents.onDestroyed(function(){
        Session.set("markLatSessEdit",undefined);
        Session.set("markLongSessEdit",undefined);
        Session.set("pacinputSessEdit",undefined);
        Session.set("markLatSessEdit",null);
        Session.set("markLongSessEdit",null);
        Session.set("pacinputSessEdit",null);
        Session.set("markLatSess1Edit",undefined);
        Session.set("markLongSess1Edit",undefined);
        Session.set("pacinputSess1Edit",undefined);
        Session.set("markLatSess1Edit",null);
        Session.set("markLongSess1Edit",null);
        Session.set("pacinputSess1Edit",null);
})
/**
 * template helpers which connects createEvents.html.
 * @methodName : lEvent is a function to fetch events,
 * @methodName : lProjectName is a function to fetch projectNames,
 * @methodName : lDomainName is a function to fetch domainNames,
 * @methodName : lSponsorLogo is a function to fetch uploaded sponsor logo
 */
Template.editEvents.helpers({

    lEvent: function() {
        gEventId = Router.current().params._PostId;
        try{
        var lEvents = events.find({
            "_id": gEventId
        }).fetch();
        if (lEvents) {

            try{
            for(var i=0;i<lEvents.length;i++){
                var selDomainName = domains.findOne({
                "_id": lEvents[i].domainId.toString()
                })
                Session.set("setSelectedEventEdit",selDomainName.domainName.toString())

                if(selDomainName!=undefined){
                    $('#editDomainName + .select2-container--default .select2-selection--single .select2-selection__rendered').text(selDomainName.domainName.toString());
                }

                $("#closureDate").data("DateTimePicker").date(new Date(lEvents[i].eventSubscriptionLastDate));
                $("#startDate").data("DateTimePicker").date(new Date(lEvents[i].eventStartDate));
                $("#endDate").data("DateTimePicker").date(new Date(lEvents[i].eventEndDate));
                $('#closureDate').data("DateTimePicker").minDate(new Date(lEvents[0].eventStartDate));
                $('#closureDate').data("DateTimePicker").maxDate(new Date(lEvents[i].eventStartDate));
                $('#startDate').data("DateTimePicker").minDate(new Date(lEvents[i].eventSubscriptionLastDate));
                $('#startDate').data("DateTimePicker").maxDate(new Date(lEvents[i].eventEndDate));
                $('#endDate').data("DateTimePicker").minDate(new Date(lEvents[i].eventStartDate));
                $("#prizeTitleIdName").val(lEvents[i].prize)
            }
                
            }catch(e){}

            return lEvents;
        }
        }catch(e){}
    },
    setSelectedEvent:function(id){
        try{
            var lEvents = events.findOne({
            "_id": gEventId
            })
            if(lEvents && lEvents.domainId && 
                lEvents.domainId == 
                id){
                return true
            }else{
                return false
            }
        }catch(e){

        }
    },
    lPaymentTypeMandatory:function(){
        try{
        gEventId = Router.current().params._PostId;
        var lProjectNames = events.find({
            "_id": gEventId
        }).fetch();// projects.find().fetch();
        if (lProjectNames && lProjectNames.length != 0) {
            if(lProjectNames[0].paymentEntry == undefined){
                return false
            }
            else{
                if(lProjectNames[0].paymentEntry == "yes"){
                    return true
                }
                else{
                    return false
                }
            }
            
        }
        else{
            return false
        }
        }catch(e){}
    },
    lPaymentTypeOptional:function(){
        try{
        gEventId = Router.current().params._PostId;
        var lProjectNames = events.find({
            "_id": gEventId
        }).fetch();// projects.find().fetch();
        if (lProjectNames && lProjectNames.length != 0) {
            if(lProjectNames[0].paymentEntry == undefined){
                return false
            }
            else{
                if(lProjectNames[0].paymentEntry == "optional"){
                    return true
                }
                else{
                    return false
                }
            }
            
        }
        else{
            return false
        }
        }catch(e){}
    },
    lPaymentTypeNone:function(){
        try{
       gEventId = Router.current().params._PostId;
        var lProjectNames = events.find({
            "_id": gEventId
        }).fetch();// projects.find().fetch();
        if (lProjectNames && lProjectNames.length != 0) {
            if(lProjectNames[0].paymentEntry == undefined){
                return false
            }
            else{
                if(lProjectNames[0].paymentEntry == "no"){
                    return true
                }
                else{
                    return false
                }
            }
            
        }
        else{
            return true
        }
        }catch(e){}
    },
    lPaymentTypeDefault:function(){
        try{
       gEventId = Router.current().params._PostId;
        var lProjectNames = events.find({
            "_id": gEventId
        }).fetch();// projects.find().fetch();
        if (lProjectNames && lProjectNames.length != 0) {
            if(lProjectNames[0].paymentEntry == undefined){
                return false
            }
            else{
                return  true
            }
        }
        else{
            return false
        }
        }catch(e){}
    },
    lProjectName: function() {
        var lProjectNames = tournamentEvents.find().fetch();// projects.find().fetch();
        if (lProjectNames) {
            return lProjectNames;
        }
    },
    
    lDomainName: function() {
        var lDomainNames = domains.find().fetch();
        if (lDomainNames) {
            return lDomainNames;
        }
    },
    
    lSponsorLogo: function() {
        if (Meteor.user()) {
            gEventId = Router.current().params._PostId;
            var lData;
            var lEvents = events.find({
                "_id": gEventId
            }).fetch();
            for (var j = 0; j < lEvents.length; j++) {
                lData = eventUploads.find({
                    "_id": lEvents[j].sponsorLogo
                }).fetch();
            }
            return lData;
        }
    },
        /*  lSponsorPdf : function() {
                if (Meteor.user()) {
                    var lId = Router.current().params._PostId;
                    var lData = [];
                    var lEvents = events.find({
                        "_id" : lId
                    }).fetch();
                    for(var j = 0;j<lEvents.length;j++){
                        for (var i = 0; i < lEvents[j].sponsorPdf.length; i++) {
                            lData.push(eventUploads.find({
                                "_id" : lEvents[j].sponsorPdf[i]
                            }).fetch());
                        }   
                    }
                return lData;
                }
            },
            lRulesAndReg : function() {
                if (Meteor.user()) {
                    var lId = Router.current().params._PostId;
                    var lData = [];
                    var lEvents = events.find({
                        "_id" : lId
                    }).fetch();
                    for(var j = 0;j<lEvents.length;j++){
                        for (var i = 0; i < lEvents[j].rulesAndRegulations.length; i++) {
                            lData.push(eventUploads.find({
                                "_id" : lEvents[j].rulesAndRegulations[i]
                            }).fetch());
                        }   
                    }
                return lData;
                }
            }*/
    lEventid:function(){
        for(var i=0;i<50;i++){
            if(i===49)
            return Router.current().params._PostId;
        }
    },
    /*checkSubLASTTochangeEntryDate:function(){
        try{
        Meteor.call("eventSubLastUnderTournHelper",Router.current().params._PostId,function(e,r){
            if(r){
                return true
            }
            else return false
        });
        }catch(e){
        }
    }*/
    checkWHOTOView:function(){
        if(Meteor.user().role=="Association"||Meteor.user().role=="Academy"||Meteor.user().role=="Organiser"){
            return true
        }
        else return false
    }
});

/**
 * template helpers which connects editSelectSubDomains.html(pop up on click of star).
 * @methodName : lSubDomain1Name is a function to find subDomain1,
 * @methodName : SubDomain2Name is a function to find subDomain2
 */
Template.editSelectSubDomains.helpers({
    lSubDomain1Name: function() {
        var lSubDomain1Names = subDomain1.find().fetch();
        if (lSubDomain1Names) {
            return lSubDomain1Names;
        }
    },
    lSubDomain2Name: function() {
        var lSubDomain2Names = subDomain2.find().fetch();
        if (lSubDomain2Names) {
            return lSubDomain2Names;
        }
    },
});

var gLogoFlag = 0;
var gPdfFlag1 = 0;
var gLogoFlag1 = 0;
var gPdfFlag = 0;
var gRulesFlag = 0;
var changeEditVenue = 0;
var changeDragVenue = 0 ;
/**
 * Events handler for the template editEvents.html
 */
Template.editEvents.events({
    
    /* click of startDate text field,
     * onChange of startDate,if  startDate is set, set endDate minDate to startDate, and if
     * closureDate is set check startDate is less than closureDate
     * set closureDate to startDate and minDate of closureDate to
     * current date and closureDate maxDate
     * to startDate value. else if startDate is empty set closureDate maxDate
     * to false,minDate to current.
     */
    'focus #startDate': function(e) {
        $('#startDate').datetimepicker().on('dp.show dp.update', function () {
            $(".datepicker-years .picker-switch").removeAttr('title')
                .css('cursor', 'default')
                .css('background', 'inherit')
                .on('click', function (e) {
                    e.stopPropagation();
                });
        });
        if($('#closureDate').val()==""){
             $('#startDate').data("DateTimePicker").minDate(false);
        }
        else if($('#closureDate').val()!==""){
             $('#startDate').data("DateTimePicker").minDate(new Date($('#closureDate').val()));
        }
        if($('#endDate').val()==""){
             $('#startDate').data("DateTimePicker").maxDate(false);
        }
        else if($('#endDate').val()!==""){
             $('#startDate').data("DateTimePicker").maxDate(new Date($('#endDate').val()));
        }
        if($('#closureDate').val()===$('#endDate').val()&&$('#closureDate').val()!=""&&$('#endDate').val()!=""){
        //if($('#closureDate').val()!=""&&$('#endDate').val()!="")
                $('#startDate').data("DateTimePicker").date(new Date($('#closureDate').val()))

                $("#alreadySubscribed").modal({
                        backdrop: 'static'
                });
                $("#alreadySubscribedText").text("This changes date of event list also");
                Session.set("editEventDateChange",1)
                addEveStartSet=0;
                changeeditAddeveDate(1);
        }

        $("#startDate").on("dp.change", function(e) {
            try{
            if($("#startDate").val()!==""){
                var data = $("#startDate").val().toString()+""
                //$("#endDate").data("DateTimePicker").minDate(moment(moment(data).format("YYYY-MM-DD")));
                //$("#closureDate").data("DateTimePicker").minDate(moment(data).format("YYYY-MM-DD"));
                /*if($("#closureDate").val()!==""&&$("#closureDate").val()!==data){
                    $("#closureDate").data("DateTimePicker").maxDate(moment(data));
                }*/
                //$("#closureDate").data("DateTimePicker").minDate(new Date(data));
                //$("#closureDate").data("DateTimePicker").maxDate(new Date(data));
                $("#endDate").data("DateTimePicker").minDate(new Date(data));
                if($("#closureDate").val()==""){
                    $("#closureDate").data("DateTimePicker").date(new Date($("#startDate").val()))
                    //$("#closureDate").val($("#startDate").val())
                }
            }  
            if($("#startDate").val()!==""){
               // $("#startDate").on("dp.change", function(e) {
                    //if(e.date!=e.oldDate){
                if(e.date!=e.oldDate){
                    $("#alreadySubscribed").modal({
                                backdrop: 'static'
                    });
                    $("#alreadySubscribedText").text("This changes date of event list also");
                   // }
                //})
                     Session.set("editEventDateChange",1)
                     addEveStartSet=0;
                }
            }   
                Session.set("dateChanged0",1);
                changeeditAddeveDate(1);
            }catch(e){
            }
            });

    },
    
    /* click of closureDate text field,
     * onChange of closureDate,if  closureDate is set,  and if
     * startDate  is not set, set the endDate minDate to closureDate.
     * and set startDate minDate to closureDate.
     * else if closureDate is empty set, and if
     * startDate  is not set endDate minDate
     * to current date, startDate minDate to current date
     */
    'focus #closureDate': function(e) {
        e.preventDefault();
        Meteor.call("eventSubLastUnderTournHelper",Router.current().params._PostId,function(e,r){
            r = true
        if(r==true){
            try{
            $('#closureDate').datetimepicker().on('dp.show dp.update', function () {
                $(".datepicker-years .picker-switch").removeAttr('title')
                    .css('cursor', 'default')
                    .css('background', 'inherit')
                    .on('click', function (e) {
                        e.stopPropagation();
                    });
            });
            if($('#startDate').val()==""){
                if($('#endDate').val()!=="")
                 $('#closureDate').data("DateTimePicker").maxDate(new Date($('#endDate').val()));
             else
                $('#closureDate').data("DateTimePicker").maxDate(false);
            }
            else if($('#endDate').val()==""){
                if($('#startDate').val()!="")
                 $('#closureDate').data("DateTimePicker").maxDate(new Date($('#startDate').val()));
                else
                 $('#closureDate').data("DateTimePicker").minDate(false);
            }else if($('#startDate').val()!==""){
                $('#closureDate').data("DateTimePicker").maxDate(new Date($('#startDate').val()));
            }
        }catch(e){
        }
            $("#closureDate").on("dp.change", function(e) {
                try{
                    $("#startDate").data("DateTimePicker").minDate(new Date($("#closureDate").val()));
                    $("#endDate").data("DateTimePicker").minDate(new Date($("#closureDate").val()));
                }catch(e){
                }

            });
        }else{
            $("#alreadySubscribed").modal({
                backdrop: 'static'
            });
            $("#alreadySubscribedText").text("not allowed to change after closure date");
        }
        })
    },
    
    /* click of endDate text field,
     * onChange of endDate,if  endDate is set,  and if
     * closureDate  is  set, check endDate is less than closureDate
     * set the closureDate and startDate to endDate and startDate, closureDate
     * minDate to new date .
     * and set startDate,closure date maxDate to endDate.
     * else if endDate is empty set, and if
     * set closureDate and startDate maxDate
     * to false
     */
    'focus #endDate': function(e) {
      //  e.preventDefault();
        $('#endDate').datetimepicker().on('dp.show dp.update', function () {
            $(".datepicker-years .picker-switch").removeAttr('title')
                .css('cursor', 'default')
                .css('background', 'inherit')
                .on('click', function (e) {
                    e.stopPropagation();
                });
        });

        if($('#closureDate').val()==""){
            if($('#startDate').val()!="")
             $('#endDate').data("DateTimePicker").minDate(new Date($('#startDate').val()));
            else
             $('#endDate').data("DateTimePicker").minDate(false);
        }
        else if($('#startDate').val()==""){
            if($('#closureDate').val()!="")
             $('#endDate').data("DateTimePicker").minDate(new Date($('#closureDate').val()));
            else
             $('#endDate').data("DateTimePicker").minDate(false);
        }
        $("#endDate").on("dp.change", function(e) {
            try{
            $("#startDate").data("DateTimePicker").maxDate(new Date($("#endDate").val()));
            //$("#endDate").data("DateTimePicker").minDate($("#closureDate").val());

            if($("#endDate").val()!==""){
                    if(e.date!=e.oldDate){
                    $("#alreadySubscribed").modal({
                                backdrop: 'static'
                    });
                    $("#alreadySubscribedText").text("This changes date of event list also");
                    Session.set("editEventDateChange",1);
                    endEveStartSet=0
                    }
                Session.set("dateChanged1",1);
            }
            Session.set("dateChanged1",1);
            changeeditAddeveDate(2);
            }catch(e){}
        });
    },

    'click #aYesButton': function(e) {
        e.preventDefault();
        $("#alreadySubscribed").modal('hide');
    },
    
    "click #clearClosureDate":function(e){
        //e.preventDefault();
        Meteor.call("eventSubLastUnderTournHelper",Router.current().params._PostId,function(e,r){
            r = true
            if(r){
                $("#closureDate").val("");
                try{
                    $("#closureDate").data("DateTimePicker").date(new Date($("#startDate").val()));
                    $("#closureDate").data("DateTimePicker").minDate(false);
                    $("#closureDate").data("DateTimePicker").maxDate(false);
                }catch(e){}
            }else{
                $("#alreadySubscribed").modal({
                    backdrop: 'static'
                });
                $("#alreadySubscribedText").text("not allowed to change after closure date");
            }
        });
    },
    "click #clearStartDate":function(e){
        e.preventDefault();
        $("#startDate").val("");
        try{
            $("#startDate").data("DateTimePicker").date(null);
            $("#startDate").data("DateTimePicker").minDate(false);
            $("#startDate").data("DateTimePicker").maxDate(false);
        }catch(e){}
        //$("#startDate").data("DateTimePicker").destroy();

    },
    "click #clearEndDate":function(e){
       // e.preventDefault();
        $("#endDate").val("");
        try{
            $("#endDate").data("DateTimePicker").date(null);
            $("#endDate").data("DateTimePicker").minDate(false);
            $("#endDate").data("DateTimePicker").maxDate(false);
        }catch(e){}

    },
    /*
     * onClick of star icon open select subDomain pop up
     */
    'click #selectSubDomainsStar': function(e) {
        e.preventDefault();
        $("#editSelectSubDomainsPopUp").modal({
            backdrop: 'static'//this disallow background pointer events
        });
    },
    
    /*
     * on select of subdomains and click
     * of ok button if subDomaProvideDetails
     * form is valid according to validation of subDomain pop up
     * template, hide the popup
     */
    'click #yesButtonSubDomains': function(e) {
        e.preventDefault();
        subDomainsSelectValidate();
        if ($("#subDomProvideDetails").valid())
            $("#editSelectSubDomainsPopUp").modal('hide');
        Session.set("subDomain2ID", "0")
        Session.set("subDomain1ID", "0")
    },
    
    /*
     * on click of cancel button, hide
     * editSelectSubDomainsPopUp validation errors.
     * then set subDomain radio buttons to none option.
     */
    'click #noButtonSubDomains': function(e) {
        e.preventDefault();
        if (Session.get("subDomain1ID")) {
            $('#' + Session.get("subDomain1ID")).prop("checked", true);
        } else if (Session.get("subDomain1ID") == undefined) {
            $("#noneSubDomain1").prop("checked", true);
        }
        if (Session.get("subDomain2ID")) {
            $('#' + Session.get("subDomain2ID")).prop("checked", true);
        } else if (Session.get("subDomain2ID") == undefined) {
            $("#noneSubDomain2").prop("checked", true);
        }
        $("#editSelectSubDomainsPopUp").modal('hide');
        $("#subDomProvideDetails-error").hide();
    },
    
    /*
     * onClick of sponsor,show sponsor upload modal
     */
    'click #sponsor': function(e) {
        e.preventDefault();
        $('#editUploadModal').modal({
            backdrop: 'static'
        });
        if ($('#sponsorMailIdName').val() == "") {
            var lEvents = events.findOne({
                "_id": Router.current().params._PostId
            });
            $('#sponsorMailIdName').val(lEvents.sponsorUrl);
        }
    },
    
    /*
     * onClick of sponsor upload modal ok button
     * of the form of sponsor upload modal is valid,
     * hide the modal
     */
    'click #sponsorUpload': function(e) {
        e.preventDefault();
        if ($('#editSponsorDetails').valid()) {
            /*  if (gLogoFlag == 1) {
                  gLogoFlag = 0;
                  gLogoFlag1 = 1;
                  fileUpload($('#sponsorLogo').prop('files'), function(response) {
                      if (response) {
                          gEditSponsorLogo = response;
                          $("#sponsor1").hide();
                          $('#sponH').hide();
                          $('#sponH1').hide();
                          $('#sponH2').hide();
                          $('#sponImg').show();
                          Session.set("sponsorLogoDispUpdate", eventUploads.find({
                              "_id": response
                          }).fetch());
                      } else {
                          gLogoFlag1 = 0;
                      }
                  });
              }
              if (gPdfFlag == 1) {
                  gPdfFlag = 0;
                  gPdfFlag1 = 1;
                  fileUpload($('#sponsorPdf').prop('files'), function(response) {
                      if (response) {
                          gEditSponsorPdf = response;
                      } else {
                          gPdfFlag1 = 0;
                      }
                  });
              }
              gSponsorUrl = $("#sponsorUrl").val();
              gSponsorMailId = $("#sponsorMailIdName").val();*/
            $("#editUploadModal").modal('hide')
        } else {

        }
        // gSponsorLogo = $('#sponsorLogo').prop('files');
        // gSponsorPdf = $('#sponsorPdf').prop('files');
        // gSponsorUrl = $('#sponsorUrl').val();
        //  gSponsorMailId = $('#sponsorMailId').val();
        //$('#uploadModal').modal('hide');
    },
    
    /*
     * onClick of sponsor pop up cancel button,
     * retain the old data and place holders,
     * and reset the error form
     */
    'click #sponsorCanceled': function(e) {
        e.preventDefault();
        var lEvents = events.find({
            "_id": Router.current().params._PostId.toString()
        }).fetch();
        if (lEvents) {
            for (var i = 0; i < lEvents.length; i++) {
                gSponsorMailId = lEvents[0].sponsorUrl;
            }
        }
        /*$('#sponsorLogoName').css('color', 'black');
        $('#sponsorPdfName').css('color', 'black');
        $('#sponsorMailIdName').css('color', 'black');
        $('#sponsorLogoName').attr('placeholder', "Sponsor's Logo Filename");
        $('#sponsorPdfName').attr('placeholder', "Sponsor's PDF Filename");
        $('#sponsorMailIdName').attr('placeholder', "Sponsor's URL");
        $('#editUploadModal').modal('hide');
        $('#sponsorUrl').val(gSponsorUrl);
        $('#sponsorPdf').val("");
        $('#sponsorLogo').val("");
        $('#sponsorLogoName').val("");
        $('#sponsorPdfName').val("");
        $('#sponsorMailIdName').val(gSponsorMailId);
        $("#sponsor1").show();
        $('#sponH').show();
        $('#sponH1').show();
        $('#sponH2').show();
        $('#sponImg').hide();
        sponsorValidate.resetForm();*/
        $('#editUploadModal').modal('hide');
        $("#provideDetails-error").hide();
        if(!$("#sponsorLogo").valid()){//if sponsor logo is not valid reset it
            $("#sponsorLogo").val("");
            $('#sponsorLogoName').text("Sponsor's Logo Filename");
            $('#sponsorLogoName').css('color',"#808080");
        }
        if(!$("#sponsorPdf").valid()){//if sponsor pdf is not valid reset it
            $("#sponsorPdf").val("");
            $('#sponsorPdfName').text("Sponsor's Pdf Filename");
            $('#sponsorPdfName').css('color',"#808080");
        }
    },
    
    /*
     * onClick of clear button of sponsor logo
     * check if its valid, clear sponsorLogo file, image display
     * show other attributes
     * and if its not valid clear sponsorLogo file 
     */
    "click #clearSponsorLogo":function(e){
        e.preventDefault();
        if ($("#sponsorLogo").valid()) {
            $("#sponsorLogo").val("");
            $("#sponsorLogoName").text("Sponsor's Logo Filename");
            $("#sponsorLogoName").css("color","#808080");
            $('#sponImg').attr("src", "");
            $("#sponsor1").show();
            $('#sponH').show();
            $('#sponH1').show();
            $('#sponH2').show();
            $('#sponImg').hide();
        }
        else{
            $("#sponsorLogo").val("");
            $("#sponsorLogoName").text("Sponsor's Logo Filename");
            $("#sponsorLogoName").css("color","#808080");
        }
    },

    /*
     * onClick of clear button of sponsor pdf
     * clear sponsorPdf file and name
     */
    "click #clearSponsorPdf":function(e){
        e.preventDefault();
            $("#sponsorPdf").val("");
            $("#sponsorPdfName").text("Sponsor's PDF Filename");
            $("#sponsorPdfName").css("color","#808080");
    },

    /*
     * onClick of clear button of sponsor url
     * clear sponsorMailIdName 
     */
    "click #clearSponsorURL":function(e){
        e.preventDefault();
            $("#sponsorMailIdName").val("");
    },


    /*
     * onClick of error pop up close button
     * hide the error popup
     */
    'click #errorPopupClose': function(e) {
        e.preventDefault();
        $('#errorPopup').modal('hide');
    },
    
    /*
     * close the popup of sponsor
     */
    'click #popupClose': function(e) {
        e.preventDefault();
        $('#editUploadModal').modal('hide');
        //sponsorValidate.resetForm();
    },
    
    /*
     * onChange of rules and regulations pdf file
     * check if its valid change color to white
     * and if the filename string is more than 45 characters
     * add ... to it.
     */
    "change #rulesAndReg": function(e) {
        e.preventDefault();
        if ($('#rulesAndReg').valid()) {
            $('#editRules').css('color', '#fff');
            var fileName = $("#rulesAndReg").val().toString();
            if ($("#rulesAndReg").val().toString().length > 30) {
                fileName = $("#rulesAndReg").val().toString().substring(0, 30) + "...";
                $('#editRules').text(fileName);
            } else
                $('#editRules').text(fileName);
        } else {
            var fileName = $("#rulesAndReg").val().toString();
            if ($("#rulesAndReg").val().toString().length > 30) {
                fileName = $("#rulesAndReg").val().toString().substring(0, 30) + "...";
                $('#rules').text(fileName);
            } else
                $('#rules').text(fileName);
            $('#rules').css('color', 'red');
        }


    },

    "change #rulesAndRegResults": function(e) {
        e.preventDefault();
        if ($('#rulesAndRegResults').valid()) {
            $('#editRulesResults').css('color', '#fff');
            var fileName = $("#rulesAndRegResults").val().toString();
            if ($("#rulesAndRegResults").val().toString().length > 30) {
                fileName = $("#rulesAndRegResults").val().toString().substring(0, 30) + "...";
                $('#editRulesResults').text(fileName);
            } else
                $('#editRulesResults').text(fileName);
        } else {
            var fileName = $("#rulesAndRegResults").val().toString();
            if ($("#rulesAndRegResults").val().toString().length > 30) {
                fileName = $("#rulesAndRegResults").val().toString().substring(0, 30) + "...";
                $('#rulesResults').text(fileName);
            } else
                $('#rulesResults').text(fileName);
            $('#rulesResults').css('color', 'red');
        }


    },
    /*
     * onChange of domain name
     * check if its valid change color to white
     * else change to red,
     * and set changeEditVenue to 1 (shows venue is changed)
     * and set changeDragVenue to 0 (to set marker position of google map)
     */
    "change #editDomainName": function(e) {
        e.preventDefault();
        if (!$("#editDomainName").valid()) {
            $('#editDomainName + .select2-container--default .select2-selection--single .select2-selection__rendered').css('color', 'red');
        } else {
            changeEditVenue =1;
            changeDragVenue =0
            $('#editDomainName + .select2-container--default .select2-selection--single .select2-selection__rendered').css('color', '#fff');
            $("#content").empty();
            var dgeocoder = new google.maps.Geocoder();
            var setTimeZoneLatLong=0;
            
             dgeocoder.geocode({
                'address': $("#editDomainName").find(":selected").text()
             }, function(results, status) {
                //setTimeZoneLatLong = results[0].geometry.location.lat()+","+results[0].geometry.location.lng()
                /*var url = 'https://maps.googleapis.com/maps/api/timezone/json?location='+setTimeZoneLatLong;
                $.get("https://maps.googleapis.com/maps/api/timezone/json?location="+setTimeZoneLatLong+"&timestamp=1331766000", function(data, status){
                    timezoneIdEvent = data.timeZoneId;
                    $.get("http://api.timezonedb.com/?lat="+results[0].geometry.location.lat()+"&lng="+results[0].geometry.location.lng()+"&format=json&key=MR22FNA90DU3", function(data1, status){
                        var d = moment.utc(data1.timestamp*1000);
                    })
                });
                //http://api.timezonedb.com/?zone=America/Toronto&format=json&key=MR22FNA90DU3
                //http://api.timezonedb.com/?lat=53.7833&lng=-1.75&key=MR22FNA90DU3*/
                timezoneIdEventLat = results[0].geometry.location.lat();
                timezoneIdEventLng = results[0].geometry.location.lng();

            });
          //  var instance = UI.renderWithData(Template.editGoogleDetailsVenue, { });
            Blaze.render(Template.editGoogleDetailsVenue, $("#content")[0]); 
            //UI.insert(instance, $("#content")[0]);  
            changeSearchbefore=0
        }
    },
    
    /*
     * onClick of prizeUpload open prizeUploadModal  pop up,
     * set prize title value (value is the prize title when events created) 
     */
    'click #prizeUpload': function(e) {
        e.preventDefault();
        $('#editPrizeUploadModal').modal({
            backdrop: 'static'
        });

        if ($('#prizeTitleIdName').val() == "") {
            var lEvents = events.findOne({
                "_id": Router.current().params._PostId
            });
            //$('#prizeTitleIdName').val(lEvents.prize.toString());
        }
    },

    "click #prize": function(e) {
        e.preventDefault();
        $("#prize").valid();
    },
    
    /*
     * onClick of prize upload modal ok button
     * if prizeDetailsUploadFormID is valid
     * hide the modal.
     * and set prizePdf file name as value of prize.
     * if prize title is not empty set value of prize to
     * prize title
     */
    "click #prizeUploadYes": function(e) {
        e.preventDefault();
        $("#editPrizeDetailsUploadFormID").valid();
        //if($("#prizePdf").valid()){}
        if ($("#editPrizeDetailsUploadFormID").valid()) {
            $("#editPrizeUploadModal").modal('hide');
            /*if ($('#prizePdf').val() != "") {
                if ($('#prizePdf').val().toString().length > 45) {
                    $("#prizeUpload").val($('#prizePdf').val().toString().substring(0, 45) + "...").css("color", "white");
                } else
                    $("#prizeUpload").val($('#prizePdf').val().toString()).css("color", "white");
            } else */if ($('#prizeTitleIdName').val() != "") {
                if ($('#prizeTitleIdName').val().toString().length > 45) {
                    $("#prizeUpload").val($('#prizeTitleIdName').val().toString().substring(0, 45) + "...").css("color", "white");
                } else
                    $("#prizeUpload").val($('#prizeTitleIdName').val().toString()).css("color", "white");

            }
        }
    },
    
    /*
     * if there are validation errors hide it
     */
    'click #prizeTitleIdName': function(e) {
        e.preventDefault();
        $("#providePrizeDetails-error").hide();
    },
    
    /*
     * when prize pdf is changed, get the
     * prize pdf name a to prize pdf file
     */
    'change #prizePdf': function(e) {
        if($('#prizePdf').valid()){
            $('#prizePdfName').text($('#prizePdf').val());
            $("#providePrizeDetails-error").hide();
            //$('#prizePdfName').text("Prize Details PDF Filename");
            $('#prizePdfName').css('color', 'black');
        }
        else{
            $('#prizePdfName').text($('#prizePdf').val());
            $("#providePrizeDetails-error").hide();
            //$('#prizePdfName').text("Prize Details PDF Filename");
            $('#prizePdfName').css('color', '#cc3300');
        }
    },

    /*
     * onClick of clear button of prize details pdf clear
     * clear the value of file
     */
    "click #clearPrizeTitle":function(e){
        e.preventDefault();
        if($("#prizeUpload").val()===$("#prizeTitleIdName").val()){
            $("#prizeUpload").val("Uplaod Prize Details");
            $("#prizeUpload").css("color","#d8d8d8");
        }
        $("#prizeTitleIdName").val("");
    },

    /*
     * onClick of clear button of prize details pdf clear
     * clear the value of file
     */
    "click #clearRulesPdf":function(e){
        e.preventDefault();
        $("#rulesAndReg").val("");
        $("#editRules").text("Rules & Regulations");
        $("#editRules").css("color","#d9d9d9");
    },

    "click #clearRulesPdfResults":function(e){
        e.preventDefault();
        $("#rulesAndRegResults").val("");
        $("#editRulesResults").text("Uplaod Results");
        $("#editRulesResults").css("color","#d9d9d9");
    },
    /*
     * onClick of clear button of prize details pdf clear
     * clear the value of file
     */
    "click #clearPrizePdf":function(e){
            e.preventDefault();
            $("#prizePdf").val("");
            $("#prizePdfName").text("Prize Details PDF Filename");
            $("#prizePdfName").css("color","#808080");
            if($("#prizeUpload").val()!==$("#prizeTitleIdName").val()){
                $("#prizeUpload").val("Uplaod Prize Details");
                $("#prizeUpload").css("color","#d8d8d8");
            }
    },

    /*
     * if prize pdf details is canceled
     * set place holders and some css
     */
    'click #prizeUploadCanceled': function(e) {
    /*  $("#providePrizeDetails-error").hide();
        $("#prizeUpload").val("Uplaod Prize Details").css("color", "#d9d9d9");
        $('#prizePdf').val("");
        $('#prizePdfName').val("");
        $('#prizeTitleIdName').val("");
        $("#editPrizeUploadModal").modal('hide');
        $('#prizePdfName').css('color', 'black');
        $('#prizeTitleIdName').css('color', 'black');
        $('#prizeTitleIdName').attr('placeholder', "Prize Title");
        $('#prizePdfName').attr('placeholder', "Prize Details PDF Filename");*/
        //$("#providePrizeDetails-error").hide();
        $("#editPrizeUploadModal").modal('hide');
        if(!$("#prizeTitleIdName").valid()){//if sponsor pdf is not valid reset it
        $("#prizeTitleIdName").val("");
        //  $('#prizePdfName').text("Prize Details PDF Filename");
        //  $('#prizePdfName').css('color',"#808080");
        //  if($('#prizeTitleIdName').val()!=''){
        //      $("#prizeUpload").val($('#prizeTitleIdName').val());
        //      $("#prizeUpload").css("color","white");
            }
        //  else
        //  $("#prizeUpload").val("Uplaod Prize Details");
        //  $("#prizeUpload").css("color","#d8d8d8");
        //}
    },

    "blur #editDescription": function(e) {
        e.preventDefault();
        if (!$('#editDescription').valid()) {
            $('#editDescription').css('color', 'red');
        } else {
            $('#editDescription').css('color', '#fff');
        }
    },

    /*
     * set the select html attribute #domainName
     * to remove duplicate domainNames as option
     *
     */
    "blur #editDomainName + .select2-container ": function() {
        var lExist = {};
        $('select > option').each(function() {
            if (lExist[$(this).val()])
                $(this).remove();
            else
                lExist[$(this).val()] = true;
        });
    },
    
    /*
     * set the select html attribute #domainName
     * to remove duplicate domainNames as option
     *
     */
    "mouseover #editDomainName + .select2-container ": function() {
        var lExist = {};
        $('select > option').each(function() {
            if (lExist[$(this).val()])
                $(this).remove();
            else
                lExist[$(this).val()] = true;
        });
    },
    
    /*
     * on change of sponsor logo, if sponsor logo file
     * size is according to validation, get the prop of sponsor logo,
     * then use new FileReader plugin to store the unicode of logo(image)
     * then, the result of FileReader's result is set as src of image
     * of #sponImg div.
     * if its not valid set css ,and place holders
     */
    'change #sponsorLogo': function(e) {
        //eventUploads.remove({"_id":gSponsorLogo});
        if ($("#sponsorLogo").valid()) {
            var fileInput = $('#sponsorLogo');
            var file = fileInput.prop('files')[0];
            if (fileInput.prop('files') && fileInput.prop('files')[0]) {
                var reader = new FileReader();

                reader.onload = function(e) {
                    $('#sponImg').attr("src", e.target.result);
                    $("#sponsor1").hide();
                    $('#sponH').hide();
                    $('#sponH1').hide();
                    $('#sponH2').hide();
                    $('#sponImg').show();
                    //$('#blah').attr('src', e.target.result);
                }

                reader.readAsDataURL(fileInput.prop('files')[0]);
            }
            $('#sponsorLogoName').text("Sponsor's logo Filename");
            $('#sponsorLogoName').css('color', 'black');
            $("#provideDetails-error").hide();
            $('#sponsorLogoName').text($('#sponsorLogo').val());
        }
        else{
            $('#sponImg').attr("src", "");
            $("#sponsor1").show();
            $('#sponH').show();
            $('#sponH1').show();
            $('#sponH2').show();
            $('#sponImg').hide();
            /*$('#sponsorLogo-error').attr('style','display: block !important');
            $('#sponsorLogo-error').css('top','5px');
            $('#sponsorLogo-error').css('color',"maroon");
            $('#sponsorLogo-error').css('right',"31px");
            $('#sponsorLogo-error').css('font-size',"12px");
            //$('#sponsorLogo').val("");
            $('#sponsorLogoName').text("");
            $('#sponsorLogoName').css('color', 'black');
            //"#provideDetails-error").hide();
            //'#sponsorLogoName').text($('#sponsorLogo').val());*/
            $('#sponsorLogoName').text("Sponsor's logo Filename");
            $('#sponsorLogoName').css('color', '#cc3300');
            $("#provideDetails-error").hide();
            $('#sponsorLogoName').text($('#sponsorLogo').val());
        }

    },
    
    /*
     * change of sponsor pdf file
     * set placeholder, css
     */
    'change #sponsorPdf': function(e) {
        if($('#sponsorPdf').valid()){
            $('#sponsorPdfName').text("Sponsor's PDF Filename");
            $('#sponsorPdfName').css('color', 'black');
            $('#sponsorPdfName').text($('#sponsorPdf').val());
            $("#provideDetails-error").hide();
        }
        else{
            $('#sponsorPdfName').text("Sponsor's PDF Filename");
            $('#sponsorPdfName').css('color', '#cc3300');
            $('#sponsorPdfName').text($('#sponsorPdf').val());
            $("#provideDetails-error").hide();
        }
        //$('#sponsorLogo').valid();
        //$('#sponsorPdf').valid();
    },

    'click #sponsorUrl': function(e) {
        $('#sponsorLogo').valid();
        $('#sponsorPdf').valid();
       // $('#sponsorUrl').valid();
    },

    'click #sponsorMailIdName': function(e) {
        $('#sponsorLogo').valid();
        $('#sponsorPdf').valid();
       // $('#sponsorUrl').valid();
        $('#sponsorMailIdName').valid();
    },

    'submit form': function(e) {
        e.preventDefault();
    },

    /**
     * on click of html attribute id #cancel
     * route to userLandingPage
     */
    "click #cancel": function() {
        if (gLogoFlag === 1) {
            eventUploads.remove({
                "_id": gEditSponsorLogo
            });
        }
        if (gPdfFlag === 1) {
            eventUploads.remove({
                "_id": gEditSponsorPdf
            });
        }
        Session.set("sponsorLogoDispUpdate", null);
        Session.set("sponsorLogoDispUpdate", undefined);
        Router.go("myEvents");
    },
    
    /*
     * mouseover on sponImg show image alt
     */
    'mouseover #sponImg': function(e) {
        e.preventDefault();
        $('.sponsorHoverText').css("visibility", "visible");
    },
    
    /*
     * mouseout of sponImg
     * hide the visibility of image alt
     */
    'mouseout #sponImg': function(e) {
        e.preventDefault();
        $('.sponsorHoverText').css("visibility", "hidden");
    },

    /*
     * onclick of google map image 
     * check if domain name is valid, open popup of google map 
     */
    'click #googlePopup':function(e){
        e.preventDefault()
        if($("#editDomainName").valid())
        {   
            //if google map marker is not dragged, changeDragVenue is 0
            //remove and insert the template editGoogleDetailsVenue
            if(changeDragVenue===0){
                $("#content").empty();
                //var instance = UI.renderWithData(Template.editGoogleDetailsVenue, { });
               // UI.insert(instance, $("#content")[0]);  
                Blaze.render(Template.editGoogleDetailsVenue, $("#content")[0]);        
                //this disallow background pointer events
            }
            //else show inserted template editGoogleDetailsVenue
            $('#googlePopup').css("cursor","pointer");
            $("#editGoogleDetailsVenue").modal({
                backdrop: 'static'
            })
        }
    },

    "focus #googlePopup":function(e){
        $('#googlePopup').css("cursor","pointer");
    },

    'click #addEventsForTourn':function(e){
        e.preventDefault();
        if($("#startDate").val()!==""&&$("#endDate").val()!==""&&$("#closureDate").val()!==""){
            $("#editaddEventsPopup").modal({
                    backdrop: 'static'
            })
        }
    },

    "click #savebyewalkover":function(e){
        e.preventDefault();
        if($('#application-mailOrHyperLinkOnSubscribeEdit').valid()){
            $("#httpSettingsPopupError").html("")
            $('#mailOrHyperLinkOnSubscribeEdit').modal('hide');
        
            var checked1 = $("#setAnysetDirect").prop("checked");
            var checked2 = $("#setAnysetHyper").prop("checked")
            var checked3 = $("#setAnysetmail").prop("checked")
            if(checked1){
                Session.set("subscriptionTypeDirect",1);
                Session.set("subscriptionTypeHyper",0);
                Session.set("hyperLinkValue",0)
                Session.set("subscriptionTypeMail",0);
                Session.set("subscriptionTypeMailValue",0)
            }
            if(checked2){
                Session.set("subscriptionTypeHyper",1);
                Session.set("hyperLinkValue",$("#Httpcheck").val());
                Session.set("subscriptionTypeDirect",0);
                Session.set("subscriptionTypeMail",0);
                Session.set("subscriptionTypeMailValue",0)
            }
            if(checked3){
                Session.set("subscriptionTypeMail",1);
                Session.set("hyperLinkValue",0);
                Session.set("subscriptionTypeHyper",0)
                Session.set("subscriptionTypeDirect",0);
                Session.set("subscriptionTypeMailValue",Meteor.user().emails[0].address)
            }
            if(checked1&&checked2){
                Session.set("subscriptionTypeHyper",1);
                Session.set("hyperLinkValue",$("#Httpcheck").val());
                Session.set("subscriptionTypeDirect",1);
                Session.set("subscriptionTypeMail",0);
                Session.set("subscriptionTypeMailValue",0)
            }
            if(checked1&&checked3){
                Session.set("subscriptionTypeHyper",0);
                Session.set("hyperLinkValue",0);
                Session.set("subscriptionTypeDirect",1);
                Session.set("subscriptionTypeMail",1);
                Session.set("subscriptionTypeMailValue",Meteor.user().emails[0].address)
            }
            if(checked2&&checked3){
                Session.set("subscriptionTypeHyper",1);
                Session.set("hyperLinkValue",$("#Httpcheck").val());
                Session.set("subscriptionTypeDirect",0);
                Session.set("subscriptionTypeMail",1);
                Session.set("subscriptionTypeMailValue",Meteor.user().emails[0].address)
            }
            if(checked1&&checked2&&checked3){
                Session.set("subscriptionTypeHyper",1);
                Session.set("hyperLinkValue",$("#Httpcheck").val());
                Session.set("subscriptionTypeDirect",1);
                Session.set("subscriptionTypeMail",1);
                Session.set("subscriptionTypeMailValue",Meteor.user().emails[0].address)
            }
            updateEventToServer(e);
        }
    },
    "click #viewWhoCanSub":function(e){
        e.preventDefault();
        $("#renderWhoSub").empty()
        Blaze.render(Template.whoCanSubscribeEdit, $("#renderWhoSub")[0]);
        $('#whoCanSubscribeEdit').modal({
            backdrop: 'static',keyboard: false
        });
    },
    "click #viewWhoCanDOB":function(e){
        e.preventDefault();
        $("#renderWhoDOB").empty();
        Blaze.render(Template.subscriptionDOB_editEvents, $("#renderWhoDOB")[0]);
        $('#subscriptionDOB_editEvents').modal({
            backdrop: 'static',keyboard: false
        })
    },
    "click #sendCustomTweet":function(e){
        e.preventDefault();
        $("#rendercustomTweet").empty();
        Blaze.render(Template.customTweet,$("#rendercustomTweet")[0]);
        $("#customTweet").modal({
            backdrop: 'static',
            keyboard: false
        });
    }
});
var changeeditAddeveDate = function(idofDate){
    var eveArr = Session.get("addEventArray");
            if(eveArr===undefined||eveArr==null){
            $('.eventAddTourCheckBoxDiv').find('input[type="checkbox"]:checked').each(function(){
                    //if(idofDate)
                    $("#" + $(this).attr("id")).prop('checked', false);

                    $(this).next().next().next().children().val("");//start
                    $(this).next().next().next().next().children().val("");//end

                    $(this).next().next().next().next().next().prop('disabled', false);
    
                    $("#" + $(this).attr("id")).prop('checked', true);
                    $(this).next().next().next().next().next().prop('disabled', false);
                    $(this).next().next().next().children().remove();//start
                    $(this).next().next().next().next().children().remove();//end
                    var divId = $(this).next().next().next().attr("id");
                    $(this).next().next().next().append('<input  type="text" readonly id="startDateAddEve" class="datepicker datePickPopup" placeholder="starts on">')
                    $(this).next().next().next().next().append('<input  type="text" readonly id="startEndAddEve" class="datepicker datePickPopup" placeholder="ends on">');
                    $(this).next().next().next().children().val($("#startDate").val());
                    $(this).next().next().next().next().children().val($("#endDate").val());
                    });
                $('.eventAddTourCheckBoxDiv').find('input:checkbox:not(:checked)').each(function(){
                    $("#" + $(this).attr("id")).prop('checked', false);
                    $(this).next().next().next().children().val("");//start
                    $(this).next().next().next().next().children().val("");//end
                    $(this).next().next().next().next().next().prop('disabled', false);
                    //$("#" + $(this).attr("id")).prop('checked', true);
                    $(this).next().next().next().next().next().prop('disabled', false);
                    $(this).next().next().next().children().remove();//start
                    $(this).next().next().next().next().children().remove();//end
                    var divId = $(this).next().next().next().attr("id");
                    $(this).next().next().next().append('<input  type="text" readonly id="startDateAddEve" class="datepicker datePickPopup" placeholder="starts on">')
                    $(this).next().next().next().next().append('<input  type="text" readonly id="startEndAddEve" class="datepicker datePickPopup" placeholder="ends on">');
                    $(this).next().next().next().children().val($("#startDate").val());
                    $(this).next().next().next().next().children().val($("#endDate").val());
                });
                }
            else if(eveArr!==undefined||eveArr!==null){
                $('.eventAddTourCheckBoxDiv').find('input[type="checkbox"]:checked').each(function(){
                    if(idofDate==1){
                        $(this).next().next().next().children().val("");//start
                        $(this).next().next().next().children().remove();//start
                        var divId = $(this).next().next().next().attr("id");
                        $(this).next().next().next().append('<input  type="text" readonly id="startDateAddEve" class="datepicker datePickPopup" placeholder="starts on">')
                        $(this).next().next().next().children().val($("#startDate").val());
                        var endDateValue = moment(new Date($(this).next().next().next().next().children().val())).format("YYYY-MM-DD");
                        //var startDateValue = moment($(e.target).parent().prev().children().val()).format("YYYY-MM-DD");
                        if(endDateValue<moment(new Date($("#startDate").val())).format("YYYY-MM-DD")){
                            $(this).next().next().next().next().children().val(new Date($("#startDate").val()))
                        }
                    }
                    else if(idofDate==2){
                        $(this).next().next().next().next().children().val("");//end
                        $(this).next().next().next().next().children().remove();//end
                        var divId = $(this).next().next().next().attr("id");
                        $(this).next().next().next().next().append('<input  type="text" readonly id="startEndAddEve" class="datepicker datePickPopup" placeholder="ends on">');
                        $(this).next().next().next().next().children().val($("#endDate").val());
                    }
                    $("#" + $(this).attr("id")).prop('checked', false);

                    //$(this).next().next().next().children().val("");//start
                    //$(this).next().next().next().next().children().val("");//end

                    $(this).next().next().next().next().next().prop('disabled', false);
    
                    $("#" + $(this).attr("id")).prop('checked', true);
                    $(this).next().next().next().next().next().prop('disabled', false);
                    //$(this).next().next().next().children().remove();//start
                    //$(this).next().next().next().next().children().remove();//end
                    //var divId = $(this).next().next().next().attr("id");
                    //$(this).next().next().next().append('<input  type="text" readonly id="startDateAddEve" class="datepicker datePickPopup" placeholder="starts on">')
                    //$(this).next().next().next().next().append('<input  type="text" readonly id="startEndAddEve" class="datepicker datePickPopup" placeholder="ends on">');
                    //$(this).next().next().next().children().val($("#startDate").val());
                    //$(this).next().next().next().next().children().val($("#endDate").val());
                    });
                $('.eventAddTourCheckBoxDiv').find('input:checkbox:not(:checked)').each(function(){
                    $("#" + $(this).attr("id")).prop('checked', false);
                    if(idofDate==1){
                        $(this).next().next().next().children().val("");//start
                        $(this).next().next().next().children().remove();//start
                        var divId = $(this).next().next().next().attr("id");
                        $(this).next().next().next().append('<input  type="text" readonly id="startDateAddEve" class="datepicker datePickPopup" placeholder="starts on">')
                        $(this).next().next().next().children().val($("#startDate").val());
                    }
                    else if(idofDate==2){
                        $(this).next().next().next().next().children().val("");//end
                        $(this).next().next().next().next().children().remove();//end
                        var divId = $(this).next().next().next().attr("id");
                        $(this).next().next().next().next().append('<input  type="text" readonly id="startEndAddEve" class="datepicker datePickPopup" placeholder="ends on">');
                        $(this).next().next().next().next().children().val($("#endDate").val());
                    }
                    //$(this).next().next().next().children().val("");//start
                    //$(this).next().next().next().next().children().val("");//end

                    $(this).next().next().next().next().next().prop('disabled', false);
    
                    $("#" + $(this).attr("id")).prop('checked', true);
                    $(this).next().next().next().next().next().prop('disabled', false);
                    //$(this).next().next().next().children().remove();//start
                    //$(this).next().next().next().next().children().remove();//end
                    //var divId = $(this).next().next().next().attr("id");
                    //$(this).next().next().next().append('<input  type="text" readonly id="startDateAddEve" class="datepicker datePickPopup" placeholder="starts on">')
                    //$(this).next().next().next().next().append('<input  type="text" readonly id="startEndAddEve" class="datepicker datePickPopup" placeholder="ends on">');
                    //$(this).next().next().next().children().val($("#startDate").val());
                    //$(this).next().next().next().next().children().val($("#endDate").val());
                    $("#" + $(this).attr("id")).prop('checked', false);
                    });
                    

            }
            setSessAddAgain2();
}
var setSessAddAgain2 = function(){
    var addEvent = [];
        $('.eventAddTourCheckBoxDiv').find('input[type="checkbox"]:checked').each(function(){
            var data={
                "eventId":$(this).attr("id"),
                "projectType":$(this).next().children().attr("id"),
                "eventName":$(this).next().children().text(),
                "eventStartDate":$(this).next().next().next().children().val(),
                "eventEndDate":$(this).next().next().next().next().children().val(),
                "prize":$(this).next().next().next().next().next().children().val()
            }
            addEvent.push(data);
        });
        Session.set("addEventArray",addEvent);
}
/**
 * function to update an event called from submit handler
 * of edit events form
 */
var updateEventToServer = function() {
    var cancLat = 0;
    var cancLng = 0;
    var cacPacNa = "";
    //pacinputSessEdit
    if(Session.get("markLatSessEdit")==undefined||Session.get("markLatSessEdit")==null){
        if(Session.get("markLatSess1Edit")==undefined||Session.get("markLatSess1Edit")==null){
            try{
             var lat = events.findOne({"_id":Router.current().params._PostId});
             cancLat = lat.venueLatitude;
            }catch(e){}
        }
        else cancLat = Session.get("markLatSess1Edit");
        if(Session.get("markLongSess1Edit")==undefined||Session.get("markLongSess1Edit")==null){
            try{
             var lat = events.findOne({"_id":Router.current().params._PostId});
             cancLng = lat.venueLongitude;
            }catch(e){}
        }
        else cancLng = Session.get("markLongSess1Edit");
        if(Session.get("pacinputSess1Edit")==undefined||Session.get("pacinputSess1Edit")==null){
            try{
             var lat = events.findOne({"_id":Router.current().params._PostId});
             cacPacNa = lat.venueAddress;
            }catch(e){}
        } 
        else cacPacNa = Session.get("pacinputSess1Edit");
    }
    else{
        cancLat = Session.get("markLatSessEdit");
        cancLng = Session.get("markLongSessEdit");
        cacPacNa = Session.get("pacinputSessEdit");
    }
        /*if (gLogoFlag1 === 1 && gEditSponsorLogo !== "") {
            eventUploads.remove({
                "_id": gSponsorLogo
            });
            gLogoFlag1 = 0;
            gSponsorLogo = gEditSponsorLogo;
        }
        if (gPdfFlag1 === 1 && gEditSponsorPdf !== "") {
            eventUploads.remove({
                "_id": gSponsorPdf
            });
            gSponsorPdf = gEditSponsorPdf;
            gPdfFlag1 = 0;
        }*/
    
    /*
     * variables to store projectId, domainId,
     * subDomain1Name, subDomain2Name.
     */

        var lProjectName = [],
            lDomainId = [],
            lProjectId = [],
            lDomainName = $("#editDomainName").children(":selected").attr("id"),
            lSubDomain1Name = [],
            lSubDomain2Name = [];
        /*
         * set project name and domain name
         */
        var lProjectName = $('#editProjectNameId').attr("class");
        var selectSubDomain1 = "";
        var selectSubDomain2 = "";
        var lVenueAddress = "";
        lVenueAddress = $("#pac-input").val();
        /*
         * set eventName, projectId, eventStartDate, eventEndDate,
         * event closureDate, domainId, prizeTitle, description,
         * sponsor url, sponsor mail Id, rules and regulations and prize pdf files
         */
        var lEventName = $("#eventName").val()
        lProjectId.push($('#editProjectNameId').val());
        var lEventStartDate = $('#startDate').val();
        var lEventEndDate = $('#endDate').val();
        var lEventSubscriptionLastDate = $('#closureDate').val();
        lDomainId.push($('#editDomainName').val().toString());
        var jhad = $('#prizeTitleIdName').val();
        var lDescription = $('#description').val();
        var lSponsorPdf = "";
        var lSponsorLogo = "";
        var prizePdfId = "";
        var lSponsorUrl = $("#sponsorMailIdName").val();
        var lRulesAndReg = $('#rulesAndReg').prop('files');
        var lRulesAndRegResults = $('#rulesAndRegResults').prop('files');
        /*
         * set selected sub domain1 and sub domain2
         */
        //selectSubDomain1 = $('input[name="mainTag"]:checked').val().toString();
        //selectSubDomain2 = $('input[name="secondaryTag"]:checked').val().toString();
        /*
         * if sub domain1 and 2 are not set, set those values to 0
         */
        /*if (selectSubDomain1 == "None") {
            selectSubDomain1 = "0";
        }
        if (selectSubDomain2 == "None") {
            selectSubDomain2 = "0";
        }
        lSubDomain1Name.push(selectSubDomain1);
        lSubDomain2Name.push(selectSubDomain2);*/
        var userId = Meteor.users.findOne({
            "_id": Meteor.userId()
        });
        
        /*
         * set id of event organizer by fetching userId  from
         * users db and current logged in meteor user id
         */
        var lEventOrganizer = userId.userId;
        var rulesAndRegulations = "";
        var resultsofevent = "";
        
        /*
         *call fileUpload function to upload rules and regulations
         *and save fileId(response) as rulesAndRegulations
         */
        fileUpload(lRulesAndRegResults, function(response){
            resultsofevent = response;
            fileUpload(lRulesAndReg, function(response) {
                rulesAndRegulations = response;
                /*
                 *call fileUpload function to upload prize pdf
                 *and save fileId(response) as prizePdfId
                 */
                fileUpload($('#prizePdf').prop('files'), function(response) {
                    prizePdfId = response
                    /*
                     *call fileUpload function to sponsorLogo
                     *and save fileId(response) as lSponsorLogo
                     */
                    fileUpload($('#sponsorLogo').prop('files'), function(response) {
                        lSponsorLogo = response;
                        /*
                         *call fileUpload function to sponsorPdf
                         *and save fileId(response) as lSponsorPdf
                         */
                        fileUpload($('#sponsorPdf').prop('files'), function(response) {
                            /*
                             * set all the values as object
                             */

                        var paymentEntry = "no"
                        if($("#radioButtonNone").is(":checked") == true){
                            paymentEntry = "no"
                        }
                        else if($("#radioButtonOptional").is(":checked") == true){
                            paymentEntry = "optional"
                        }
                        else if($("#radioButtonMandatory").is(":checked") == true){
                            paymentEntry = "yes"
                        }

                            var lData = {
                                eventId: Router.current().params._PostId.toString(),
                                eventName: lEventName,
                                projectId: lProjectId,
                                eventStartDate: lEventStartDate,
                                eventEndDate: lEventEndDate,
                                eventSubscriptionLastDate: lEventSubscriptionLastDate,
                                domainId: lDomainId,
                                prize: $('#prizeTitleIdName').val(),
                                description: lDescription,
                                eventOrganizer: lEventOrganizer,
                                sponsorPdf: response,
                                sponsorLogo: lSponsorLogo,
                                sponsorUrl: lSponsorUrl,
                                rulesAndRegulations: rulesAndRegulations,
                                resultsOfTheEvents: resultsofevent,
                                //subDomain1Name: lSubDomain1Name,
                                //subDomain2Name: lSubDomain2Name,
                                prizePdfId: prizePdfId,
                                projectName: lProjectName,
                                domainName: lDomainName,
                                venueLatitude: cancLat,
                                venueLongitude: cancLng,
                                venueAddress:cacPacNa,
                                timezoneIdEventLat:timezoneIdEventLat,
                                timezoneIdEventLng:timezoneIdEventLng,
                                subEvents:Session.get("addEventArray"),
                                subscriptionTypeDirect:Session.get("subscriptionTypeDirect"),
                                subscriptionTypeHyper:Session.get("subscriptionTypeHyper"),
                                hyperLinkValue:Session.get("hyperLinkValue"),
                                subscriptionTypeMail:Session.get("subscriptionTypeMail"),
                                subscriptionTypeMailValue:Session.get("subscriptionTypeMailValue"),
                            };
                            /*
                             * then call updateEvents function
                             */
                             Meteor.call("eventSubLastUnderTournHelper", Router.current().params._PostId.toString(),function(e,r){
                                r = true
                                var canChangeSubLAstDAte = true;
                                if(r==true){
                                    canChangeSubLAstDAte = r;
                                    updateEvents(lData,canChangeSubLAstDAte);
                                }
                                else if(r==false){
                                   canChangeSubLAstDAte = r;
                                    updateEvents(lData,canChangeSubLAstDAte);
                                }
                             })
                            
                        });
                    });
                });
            });
        });
    }

/**
 * function to handle file upload eventUploads is a collection which saves file
 * to the folder /public/eventUploads. call eventUploads.insert function to save
 * the data about file fileObj is a reference variable which holds all the
 * details of file and save as fileObj_id as FileId. then return the FileId to
 * the called function
 */
var fileUpload = function(xData, xCallback) {
    if (xData.length != 0) {
        for (var i = 0, ln = xData.length; i < ln; i++) {
            theFile = new FS.File(xData[i]);
            eventUploads.insert(theFile, function(err, fileObj) {
                // Inserted new doc with ID fileObj._id, and kicked off the data
                // upload using HTTP
                FileId = fileObj._id;
                return xCallback(FileId);
            });
        }
    } else {
        return xCallback(false);
    }
};

/**
 * function to insert events,
 * call meteor method inserEvents with xData
 * as parameters.
 * if the response from meteor method is true,
 * check the previous location path,
 * if it is undefined go to myEvents
 * else to previous path from where create events is called.
 */
var updateEvents = function(xData,canChangeSubLAstDAte) {

    $("#savingDataPopupNew").modal({
        backdrop: 'static',
        keyboard: false
    });
    $("#alreadySubscribedText_NEW").html("Saving Details..")

    Meteor.call('updateEvents', xData,canChangeSubLAstDAte,
        function(error, response) {
            if (response) {
                var tweetAutoChecked = $("#checkAcceptboxTweett").prop("checked")
                Meteor.call('changeUpcomingListsAndStatus', Router.current().params._PostId);
                Meteor.call('testOnLogin')
                Meteor.call("tournamentModifyAutoTweet",tweetAutoChecked,xData,function(e,res){
                    if(e){
                    }
                })
                if (Session.get("previousLocationPath") !== undefined) {
                    var previousPath = Session.get("previousLocationPath");
                    Session.set("previousLocationPath", undefined);
                    Session.set("previousLocationPath", null);
                    $("#savingDataPopupNew").modal('hide')
                    $(".modal-backdrop").remove();

                    Router.go(previousPath);
                } else {
                    $("#savingDataPopupNew").modal('hide')
                    $(".modal-backdrop").remove();
                    Router.go("/myEvents");
                }
                Session.set("sponsorLogoDispUpdate", null);
                Session.set("sponsorLogoDispUpdate", undefined);
                Session.set("sponsorPdfDispUpdate", null);
                Session.set("sponsorPdfDispUpdate", undefined);
            } else {
            }
        });
}

/**
 * function to validate edit events
 *  @fieldName: eventName
 *      @required : true
 *      @minLength:5 characters
 *      @maxLength:40 characters
 *      @validText2:/^\w\/ (this is to validates if unwanted space) 
 * @fieldName: rulesAndReg
 *      @fileSize : 1048576 (1MB of file size)
 *      @accept : 'application/pdf' accepts only pdf files
 * @fieldName : domainName
 *      @required : true
 * @fieldName : projectName
 *      @required : true
 * @fieldName : closureDate
 *      @required : true
 * @fieldName : startDate
 *      @required : true
 * @fieldName : endDate
 *      @required : true
 * @fieldName : subDomain1Area, subDomain2Area
 *      @maxLength :200 characters
 *      @validText :regex to validate csv format
 * @fieldName : description
 *      @required : true
 *      @minLength:5 characters
 *      @maxLength:100 characters
 *      @validText2:/^\w\/ (this is to validates if unwanted space) 
 * @fieldName : sponsor
 *      @sponsorPdfSize : 1048576, (1MB of file size)
 *      @sponsorLogoSize: 100000 (less than 4kb of file size)
 */
var editEventValidate = function() {
    var s = $('#eventEditing').validate({
        rules: {
            eventName: {
                required: true,
                minlength: 5,
            },
            prize: {
                eventFee: true,
                //minlength: 5
            },
            /*prize: {
                required: true,
                minlength: 5
            },*/
            rulesAndReg: {
                accept: 'application/pdf',
                filesize: 1048576
            },
            rulesAndRegResults: {
                accept: 'application/pdf',
                filesize: 1048576
            },
            domainName: {
                required: true
            },
            projectName: {
                required: true
            },
            closureDate: {
                required: true
            },
            startDate: {
                required: true
            },
            endDate: {
                required: true
            },
            /*description: {
                //required: true,
                validText2: /^\w/,
                minlength: 5
            },*/
        },
        messages: {
            eventName: {
                required: "Please enter the event name.",
                minlength: "The Event name should contain atleast 5 characters",
            },
            prize: {
                eventFee: "Please provide entry fee",
                //minlength: 5
            },
            rulesAndReg: {
                // required: "Please upload the rules and regulations pdf",
                accept: 'Please upload only pdf files',
                filesize: 'Rules and Regulations file size should be less than 1MB'
            },
            rulesAndReg: {
                // required: "Please upload the rules and regulations pdf",
                accept: 'Please upload only pdf files',
                filesize: 'Results file size should be less than 1MB'
            },
            domainName: {
                required: "Please select the venue",
            },
            projectName: {
                required: "Please select the game"
            },
            closureDate: {
                required: "Please select the entry closure date and time"
            },
            startDate: {
                required: "Please select the event start date and time"
            },
            endDate: {
                required: "Please select the event end date and time"
            },
            /*description: {
                //required: "Please provide the event description",
                minlength: "Please provide the event description with minimum of 5 charactes",
                validText2: "Events Description is not valid",
            },*/
            /* sponsorPdf:{
                    required:"Please upload sponsors pdf",
                    filesize:'the file size should be less than 1MB'
                 }*/
        },
        /*
         * setting error container and errorLabelConatiner to ul
         * and wrap it inside li
         */
        errorContainer: $('#errorContainer'),
        errorLabelContainer: $('#errorContainer ul'),
        wrapper: 'li',
        /*
         * handles error 
         */
        invalidHandler: function(form, validator, element) {
            var elem = $(element);//set error element
            var errors = s.numberOfInvalids();
            //if there are errors open errorPopup modal
            if (errors) $('#errorPopup').modal({
                backdrop: 'static'
            });
            //set colors, on error of rulesAndReg, projectName and domainName
            for (var i = 0; i < validator.errorList.length; i++) {
                var q = validator.errorList[i].element;
                if (q.name == 'rulesAndReg') {
                    $('#editRules').css('color', 'red')
                }
                if (q.name == 'rulesAndRegResults') {
                    $('#editRulesResults').css('color', 'red')
                }
                if (q.name === 'domainName') {
                    $('#editDomainName + .select2-container--default .select2-selection--single .select2-selection__rendered').css('color', 'red');
                }
                if (q.name == 'description') {
                    $('#editDescription').css('color', 'red')
                }
                if (q.name === 'prize') {
                    $('#prizeUpload').css('color', 'red');
                }
            }

        },
        submitHandler: function(event) {
            //on success of validation call update event function
            //updateEventToServer();
            $("#mailOrHyperLinkOnSubscribeEditR").empty()
            Blaze.render(Template.mailOrHyperLinkOnSubscribeEdit,$("#mailOrHyperLinkOnSubscribeEditR")[0]);
            $("#mailOrHyperLinkOnSubscribeEdit").modal({
                backdrop: 'static',
                keyboard: false
            });
        }
    });
}

/**
 * validation method to check no fields with invalid spaces
 */
$.validator.addMethod(
    "validText2",
    function(value, element, regexp) {
        var check = false;
        return this.optional(element) || regexp.test(value);
    }
);

/**
 * validation method to check no fields with invalid spaces
 */
$.validator.addMethod('filesize', function(value, element, param) {
    return this.optional(element) || (element.files[0].size <= param)
});

/*not used*/
$.validator.addMethod('sponsorFiles', function(value, element) {
    if ($('#sponsorPdf').prop('files') === "" || $('#sponsorLogo').prop('files') === "" || $('#sponsorUrl').val() === "" || $('#sponsorMailId').val() === "") {
        return false;
    } else {
        return true
    }
});

/*$.validator.addMethod('sponsorPdfSize', function(value, element, param) {
    // param = size (en bytes) 
    // element = element to validate (<input>)
    // value = value of the element (file name)
    if($('#sponsorPdfName').val()!==""){
    theFile = new FS.File($('#sponsorPdf').prop('files')[0]);
        if (theFile.original.size <= param) {
            return true;
        } else {
            return false;
        }
    }
    else return false;
});
$.validator.addMethod('sponsorLogoSize', function(value, element, param) {
    // param = size (en bytes) 
    // element = element to validate (<input>)
    // value = value of the element (file name)
    if($('#sponsorLogoName').val()!==""){
        theFile = new FS.File($('#sponsorLogo').prop('files')[0]);
        if (theFile.original.size <= param) {
            return true;
        } else {
            return false;
        }
    }
    else return false;
});*/

var sponsorValidate = "";
/**
 * function to validate sponsor upload
 * @fieldName : provideDetails
 * 
 * @fieldName : sponsorMailId
 * 
 * @fieldName : sponsorUrl
 *      @required : true
 * @fieldName : sponsorPdf
 *      @filesize : 1048576, (1MB of file size)
 * @fieldName : sponsorLogo
 *      @sponsorPdfSize : 1048576, (1MB of file size)
 *      @filesize : 100000 (less than 4kb of file size)
 */
var editSponsorUploadValidate = function() {
    sponsorValidate = $('#editSponsorDetails').validate({
        rules: {
            sponsorLogo: {
                /*required: true,*/
                filesize: 1000000
            },
            sponsorPdf: {
                /*required: true,*/
                filesize: 1048576
            },
            sponsorUrl: {
                required: true
            },
            sponsorMailId: {
                /*required: true*/
            },
            provideDetails: {
                /*
                 * invisible HTML field used to validate sponsor upload
                 * popup, if user clicks save without filling any of the fields,
                 * set the color to red
                 * */
                required: function(e) {
                    if ($("#sponsorPdf").val() == "" &&
                        $("#sponsorLogo").val() == "" &&
                        $("#sponsorMailIdName").val() == "" &&
                        $("#sponsorLogoName").css("color") != "rgb(204, 51, 0)" &&
                        $("#sponsorPdfName").css("color") != "rgb(204, 51, 0)" &&
                        $("#sponsorMailIdName").css("color") != "rgb(204, 51, 0)") {
                        return true
                    } else return false
                }
            }
        },
        messages: {
            sponsorLogo: {
                /*required: "please upload sponsors logo",*/
                filesize: "Sponsor's logo size should be less than 5 kilo bytes"
            },
            sponsorPdf: {
                /*required: "please upload sponsors Pdf file",*/
                filesize: "Sponsor's pdf file should be less than 1Mega Bytes"
            },
            sponsorUrl: {
                required: "Please provide sponsor Url"
            },
            sponsorMailId: {
                /*required: "please provide sponsor mail id"*/
            },
            provideDetails: {
                required: "Please provide atleast one field"
            }
        },      
        /*
         * set error element to div
         */
        errorElement: 'div',
        /*
         * handles error 
         */
        invalidHandler: function(form, validator, element) {
            var errors = validator.numberOfInvalids();
            if (errors) {
                /*
                 * if there are errors change the color of corresponding fields
                 */
                if (validator.errorList.length > 0) {
                    for (x = 0; x < validator.errorList.length; x++) {
                        var q = validator.errorList[x].element;
                        var elementName = [];
                        $("#" + q.name + "Name").val("");
                        $("#" + q.name + "Name").text(validator.errorList[x].message)
                            .css("color", "#cc3300");
                    }
                }
            }
            validator.focusInvalid();
        },
        submitHandler: function(event) {
            //saveUserProfileSettings(event);
        }
    });
}
/*not used*/
var display = function(xSponsorLogo) {
    Meteor.call('sponsorLogoUrl', xSponsorLogo,
        function(error, response) {
            if (response) {
                $("#sponsor1").remove();
                $('#sponH').remove();
                $('#sponH1').remove();
                $('#sponH2').remove();
                $('#sponsor').append('<img id="sponImg"/>');
                $('#sponImg').attr("src", response);
                $('#sponImg').attr("class", "sponImg");
            }
            if (error) {
            }
        });
}

var subDomainsValidate = "";

/**
 * function to validate select subDomains pop up
 * @fieldName : subDomProvideDetails
 *      @CheckSubDomains1or2 : true (check whether sub domains are selected)
 */
var subDomainsSelectValidate = function() {
    var subDomainsValidate = $('#editSelectSubDomainsFormId').validate({
        rules: {
            subDomProvideDetails: {
                CheckSubDomains1or2: true
            }
        },
        messages: {
            subDomProvideDetails: {
                CheckSubDomains1or2: "Please select atleast one tag"
            }
        },
        errorElement: 'div',
        submitHandler: function(event) {
            //saveUserProfileSettings(event);
        }
    });
}

/**
 * On rendered of sponsor up validate sponsor 
 * modal form
 */
Template.selectSubDomains.onRendered(function() {
    subDomainsSelectValidate();
});

/**
 * template events which connects sponsorUpload pop up
 */
Template.selectSubDomains.events({
    'submit form': function(e) {
        e.preventDefault();
    },
});
/**
 * if atleast one project or sport is not selected return false,
 * else true
 */
$.validator.addMethod(
    "CheckSubDomains1or2",
    function(value, element, regexp) {
        if ($("input[name=secondaryTag]:checked").map(
                function() {
                    return this.value;
                }).get() == "" && $("input[name=mainTag]:checked").map(
                function() {
                    return this.value;
                }).get() == "") {
            return false
        } else return true
    }

);

/**
 * onRendered of prize pop up call prizeUploadsValidate function
 */
Template.editPrizeDetailstemp.onRendered(function() {
    prizeUploadsValidate();
});

/**
 * function to validate select subDomains pop up
 * @fieldName : prizePdf
 *      @filesize : 1048576 (less than 1MB of file size)
 * @fieldName : providePrizeDetails
 *      @checkPrizeDetails : true (check any of the fields is filled or not) 
 */
var prizeUploadsValidate = function() {
    $('#editPrizeDetailsUploadFormID').validate({
        rules: {
            prizePdf: {
                filesize: 1048576
            },
            providePrizeDetails: {
                checkPrizeDetailsCreate: true
            },
            prizeTitleId:{
                //required:true,
                regexpPrize:/^[0-9]*$/
            }
        },
        messages: {
            prizePdf: {
                filesize: "Prize details pdf file should be less than 1Mega Bytes"
            },
            providePrizeDetails: {
                checkPrizeDetailsCreate: "Entry fee is required"
            },
            prizeTitleId:{
                //required:"";
                regexpPrize:""
            }
        },
        /*
         * set error element to div
         */
        errorElement: 'div',
        //handles error
        invalidHandler: function(form, validator, element) {
            var errors = validator.numberOfInvalids();
            if (errors) {
                /*
                 * if there are errors change the color of corresponding fields
                 */
                if (validator.errorList.length > 0) {
                    for (x = 0; x < validator.errorList.length; x++) {
                        var q = validator.errorList[x].element;
                        var elementName = [];
                        $("#prizeTitleIdName-error").hide();
                        $("#" + q.name + "Name").val("");
                        $("#" + q.name + "Name").text(validator.errorList[x].message)
                            .css("color", "#cc3300");
                        if(q.name=="providePrizeDetails"){
                            $("#prizeTitleIdName").css("color", "#cc3300");
                        }
                        if(q.name=="prizeTitleId"){
                            $("#prizeTitleIdName-error").hide();
                            $("#" + q.name + "Name").attr("placeholder", "Entry fee should be valid amount")
                            $("#prizeTitleIdName").css("color", "#cc3300");
                        }
                    }
                }
            }
            validator.focusInvalid();
        },

        submitHandler: function(event) {
        }
    });
}
/**
 * validation to check the prize details,
 * whether at least one field is filled
 */
$.validator.addMethod(
    "checkPrizeDetails",
    function(value, element, regexp) {
        if ($("#prizeTitleIdName").val() == "" && $("#prizePdf").val() == "") {
            return false
        } else return true
    }

);

var geocoder,map,markLat=0,markLong=0,viewportSouth=0,viewportNorth=0;
/**
 * onRendered of google map pop up call initialize google map
 */
Template.editGoogleDetailsVenue.onRendered(function() {
        Session.set("markLatSessEdit",undefined);
        Session.set("markLongSessEdit",undefined);
        Session.set("pacinputSessEdit",undefined);
        Session.set("markLatSessEdit",null);
        Session.set("markLongSessEdit",null);
        Session.set("pacinputSessEdit",null);
    this.autorun(function () {
        geocoder = new google.maps.Geocoder();
        if (GoogleMaps.loaded()) {
            if($("input[name=subLat]").attr("id")!="0" && $("input[name=subLong]").attr("id")!="0" && changeEditVenue!=1){
                $("#pac-input-view1").geocomplete({
                    map: '#map',
                    mapOptions: {
                    scrollwheel:true,
                        panControl: true,
                        zoomControl: true,
                    },
                    markerOptions: {
                        draggable: true,
                    },
                    bounds:true,
                    location:new google.maps.LatLng($("input[name=subLat]").attr("id"),$("input[name=subLong]").attr("id"))
                    });
                    //$("#pac-input").geocomplete("find",$("input[name=subLat]").attr("id")+','+$("input[name=subLong]").attr("id"));
                    $("#pac-input").val($("input[name=subAddress]").attr("id"));
                    geocoderFunction()
            }
            else if($("input[name=subLat]").attr("id")=="0" && $("input[name=subLong]").attr("id")=="0" && changeEditVenue!=1){
                $("#pac-input-view1").geocomplete({
                    map: '#map',
                    mapOptions: {
                    scrollwheel:true,
                        panControl: true,
                        zoomControl: true,
                    },
                    markerOptions: {
                        draggable: true,
                    },
                    location:$("#editDomainName").find(":selected").text()
                });
                $("#pac-input").val($("#editDomainName").find(":selected").text());
                geocoderFunction()
            }
            else if(changeEditVenue==1){
                $("#pac-input-view1").geocomplete({
                    map: '#map',
                    mapOptions: {
                    scrollwheel:true,
                        panControl: true,
                        zoomControl: true,
                    },
                    markerOptions: {
                        draggable: true,
                    },
                    location:$("#editDomainName").find(":selected").text()
                });
                $("#pac-input").val($("#editDomainName").find(":selected").text());
                geocoderFunction();
            }
        }
    });
});

/**
 * template helpers which connects googleDetailsVenue.html(pop up on click of google map).
 * @methodName : mapOptions is a function to set map with given lattitude and longitude
 */
Template.editGoogleDetailsVenue.helpers({  
  mapOptions: function() {
        if (GoogleMaps.loaded()) {
            //venue = Session.get("googleDomainName")
            var loc =  new google.maps.LatLng(22.0427983,-50.3580818);
              geocoder = new google.maps.Geocoder();
                 return {
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    center: new google.maps.LatLng(22.0427983,-50.3580818),
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                }
            }    //return map;
        }

});

/**
 * client side subscription to the server side publications
 * @SubscribeName: allEvents (used to subscribe to events)
 *                  to get the events list
 */
/**
 * on created of pop up template  googleDetailsVenue.html(pop up on click of google map image).
 */
Template.editGoogleDetailsVenue.onCreated(function() {  
    this.subscribe("allEvents");
})
var changeSearchbefore=0
Template.editGoogleDetailsVenue.events({


    'click #clearGooSe':function(){
        $("#pac-input-view1").geocomplete("find",$("#pac-input").val());
    },

    'keyup #pac-input':function(){
        changeSearchbefore=1
    },

    /*
     * onclick of ok button of google map popup window
     * hide the popup googleDetailsVenue, save dragged google 
     * lattiutde and longitude to the variables venLat 
     * and venLong respectively. then set changeDragVenue
     * to 1 (shows marker on map is dragged)
     */
    'click #googleVenueYes':function(e,template){
        e.preventDefault();
        venLat = markLat
        venLong = markLong;
        if(markLat==0&&markLong==0&&changeSearchbefore==1){
            venLat=$("input[name=subLat]").attr("id")  
            venLong=$("input[name=subLong]").attr("id")
        }
        Session.set("markLatSessEdit",undefined);
        Session.set("markLongSessEdit",undefined);
        Session.set("pacinputSessEdit",undefined);
        Session.set("markLatSessEdit",null);
        Session.set("markLongSessEdit",null);
        Session.set("pacinputSessEdit",null);
        Session.set("markLatSessEdit",venLat);
        Session.set("markLongSessEdit",venLong);
        Session.set("pacinputSessEdit",$("#pac-input").val());
        
        changeDragVenue = 1;
        $("#editGoogleDetailsVenue").modal('hide');
        //$("#googleDetailsVenue").modal('hide');
    },
        /*
     * onclick of cancel button of google map popup window
     * hide the popup googleDetailsVenue
     */
    'click #googleVenueCanceled':function(e, t){
         e.preventDefault();
         var cgeocoder = new google.maps.Geocoder();
       /* if(Session.get("pacinputSessEdit")==null || Session.get("pacinputSessEdit") ==undefined){
            try{
             var lat = events.findOne({"_id":Router.current().params._PostId});
             Session.set("markLatSessEdit",lat.venueLatitude);
            }catch(e){}
        
            try{
             var lat = events.findOne({"_id":Router.current().params._PostId});
             Session.get("markLongSessEdit",lat.venueLongitude)
            // cancLng = lat.venueLongitude;
            }catch(e){}
       
            try{
             var lat = events.findOne({"_id":Router.current().params._PostId});
             cacPacNa = lat.venueAddress;
             Session.set("pacinputSessEdit",lat.venueAddress)
            }catch(e){}

         }*/
         
          $("#pac-input").val(Session.get("pacinputSessEdit"));

         //$("#pac-input-view1").geocomplete("find",Session.get("markLatSess")+","+Session.get("markLongSess"));
         cgeocoder.geocode({
            'latLng': new google.maps.LatLng(Session.get("markLatSessEdit"),Session.get("markLongSessEdit")) 
         }, function(response, status) {
            //set formatted address to pac-input-view1 box value
            //$("#pac-input").val(response[0].formatted_address);
            //split result on comma and remove brackets
            try{
                $("#pac-input-view1").geocomplete("find",response[0].formatted_address);
            }catch(e){}
        });
            /*var selDomainName = domains.findOne({
                "_id": lEvents[0].domainId.toString()
            })
            $('#editDomainName + .select2-container--default .select2-selection--single .select2-selection__rendered').text(selDomainName.domainName.toString());*/
         $("#editGoogleDetailsVenue").modal('hide');
    },
})

    var geocoderFunction = function(){
            //convert domain name to formatted address and set the input box value
            //set markLat and markLong to zero
            geocoder.geocode({
             //address is taken from html #domainName
              'address': $("#editDomainName").find(":selected").text()
            }, function(response, status) {
                //$("#pac-input").val(response[0].formatted_address);
                //markLat=0;
                //markLong =0
            });

            //on drag of marker
            $("#pac-input-view1")
            .geocomplete()
            .bind("geocode:dragged", function(event, result){
            
                /*geocoder.geocode({
                        'address': $("#editDomainName").find(":selected").text()
                    }, function(results, status) {
                        viewportSouth = results[0].geometry.viewport.getSouthWest();
                        viewportNorth = results[0].geometry.viewport.getNorthEast();
                        //set mapbounds to view port of domain name
                var MapBounds = new google.maps.LatLngBounds(
                    new google.maps.LatLng(results[0].geometry.viewport.getSouthWest().lat(),results[0].geometry.viewport.getSouthWest().lng()),
                    new google.maps.LatLng(results[0].geometry.viewport.getNorthEast().lat(),results[0].geometry.viewport.getNorthEast().lng()));*/
                //check dragged marker position is within view port
                /*if (MapBounds.contains(result)){*/
                    //set latLng to dragged marker position
                    geocoder.geocode({
                        'latLng': result 
                    }, function(response, status) {
                        //set formatted address to pac-input box value
                        try{
                            $("#pac-input").val(response[0].formatted_address);
                        }catch(e){}
                        //split result on comma and remove brackets
                        var j  = result.toString().replace(/["'()]/g,"");
                        var k = j.split(",");
                        //set markLat and markLong
                        markLat = k[0];
                        markLong = k[1];
                    });
                //}
                /*else{//if marker pos is out of view port set the marker to domain name
                    $("#pac-input").geocomplete("find",$("input[name=subLat]").attr("id"),$("input[name=subLong]").attr("id"));
                    $("#pac-input").geocomplete({
                    map: '#map',
                    mapOptions: {
                    scrollwheel:true,
                        panControl: true,
                        zoomControl: true,
                    },
                    markerOptions: {
                        draggable: true,
                    },
                    bounds:true,
                    location:new google.maps.LatLng($("input[name=subLat]").attr("id"),$("input[name=subLong]").attr("id"))
                    });
                }*/
            });
                //});
                
            
            //set viewport s and markLat, markLong as result of geocomplete
            $("#pac-input-view1")
            .geocomplete()
            .bind("geocode:result", function(event, result){
                    markLat = result.geometry.location.lat();
                    markLong = result.geometry.location.lng();
                    venLat=result.geometry.location.lat();
                    venLong=result.geometry.location.lng();
                                        Session.set("markLatSess1Edit",venLat);
                    Session.set("markLongSess1Edit",venLong);
                    Session.set("pacinputSess1Edit",$("#pac-input").val())
                    viewportSouth = result.geometry.viewport.getSouthWest();
                    viewportNorth = result.geometry.viewport.getNorthEast();
            });

            $("#pac-input-view1")
            .geocomplete()
            .bind("geocode:error", function(event, result){
            });
    }


Template.editaddEventsPopup.onCreated(function(){
    this.subscribe("tournamentEvents");
});

Template.editaddEventsPopup.onRendered(function(){
    $("#editaddEventsPopup").on('show.bs.modal', function() {
        $('#selectEventstoAdd').slimScroll({
            height: '16em',
            color: 'black',
            size: '3px',
            width: '100%'
        });

        $('#ppp').select2({
            width: 117,
        });
    });
       $('.datepicker').pickadate();
        $('#eveStartDate').select2({
            width: 117,
        });
        $('#selectEventstoAdd').slimScroll({
            height: '16em',
            color: 'black',
            size: '3px',
            width: '100%'
        });
      /*  $('#selectMainTag').niceScroll({
            cursorborderradius: '0px', // Scroll cursor radius
            background: '#E5E9E7', // The scrollbar rail color
            cursorwidth: '4px', // Scroll cursor width
            cursorcolor: '#999999' // Scroll cursor color
        });*/
});

Template.editaddEventsPopup.events({
    'click #closeAddEve':function(e){
        e.preventDefault()
        $("#editaddEventsPopup").modal('hide');
    },

 'focus #startDateAddEve':function(e){
        e.preventDefault();
        $("#eveDomProvideDetails").val("")
        var check = $(e.target).parent().prev().prev().prev().prop("checked")
        if(check==undefined){
            check= $(e.target).parent().prev().prev().prev().prev().prop("checked")
        }
        if(check){
            Session.set("dateChanged1",0)
            Session.set("dateChanged0",0)
            var startDateValue = moment(new Date($("#startDate").val())).format("YYYY-MM-DD");
            var endDateValue = moment(new Date($("#endDate").val())).format("YYYY-MM-DD");
            var sy = moment.utc(new Date(startDateValue)).format("YYYY");
            var sm  =moment.utc(new Date(startDateValue)).format("M");
            var sd = moment.utc(new Date(startDateValue)).format("D");
            var ey = moment.utc(new Date(endDateValue)).format("YYYY");
            var em = moment.utc(new Date(endDateValue)).format("M");
            var ed = moment.utc(new Date(endDateValue)).format("D");
            var em1=parseInt(em)-1
            var sm1=parseInt(sm)-1
            var input2 = $(e.target).pickadate({
                format:'yyyy mmm dd',
                selectYears: true,
                selectMonths: true,
                clear:'',
                min:[parseInt(sy),parseInt(sm1),parseInt(sd)],
                max:[parseInt(ey),parseInt(em1),parseInt(ed)],
                onSet: function(context) {
                        addEveStartSet = new Date(context.select);
                        endD = moment(new Date($(e.target).parent().next().children().val())).format("YYYY-MM-DD");
                        startD =  moment(new Date(addEveStartSet)).format("YYYY-MM-DD");
                        if(moment.utc(new Date(endD))<moment.utc(new Date(startD))){
                            $(e.target).parent().next().children().val(moment(new Date(startD)).format("YYYY MMM DD"))
                        }
                        endEveStartSet = 0;
                        //Session.set("editEventDateChange",1)
                    },
                onClose: function() {
                            if(addEveStartSet==0||isNaN(new Date(addEveStartSet).getTime())){
                                addEveStartSet=$(e.target).val()
                            }
                    }
            });
            if(Session.get("editEventDateChange")==1){
                var startDateValue = moment(new Date($(e.target).val())).format("YYYY-MM-DD");
                var endDateValue = moment(new Date($(e.target).parent().next().children().val())).format("YYYY-MM-DD");
                var sy = moment.utc(new Date(startDateValue)).format("YYYY");
                var sm  =moment.utc(new Date(startDateValue)).format("M");
                var sd = moment.utc(new Date(startDateValue)).format("D");
                var ey = moment.utc(new Date(endDateValue)).format("YYYY");
                var em = moment.utc(new Date(endDateValue)).format("M");
                var ed = moment.utc(new Date(endDateValue)).format("D");
                var em1=parseInt(em)-1
                var sm1=parseInt(sm)-1
                var ed1 = parseInt(ed)-1
                var sd1 = parseInt(sd)-1
                /*var input2 = $(e.target).pickadate({
                    format:'yyyy mmm dd',
                    selectYears: true,
                    selectMonths: true,
                    clear:'',
                    min:[parseInt(sy),parseInt(sm1),parseInt(sd)],
                    max:[parseInt(ey),parseInt(em1),parseInt(ed)],
                    onSet: function(context) {
                        addEveStartSet = new Date(context.select);
                        endD = moment($(e.target).parent().next().children().val()).format("YYYY-MM-DD");
                        startD =  moment(addEveStartSet).format("YYYY-MM-DD");
                        if(moment.utc(endD)<moment.utc(startD)){
                            $(e.target).parent().next().children().val(moment(startD).format("YYYY MMM DD"))
                        }
                        endEveStartSet = 0;
                    },
                    onClose: function() {
                            if(addEveStartSet==0||isNaN(new Date(addEveStartSet).getTime())){
                                addEveStartSet=$(e.target).val()
                            }
                    }
                });*/
                var picker2 = input2.pickadate('picker');
                 picker2.set('min',[parseInt(sy),parseInt(sm1),parseInt(sd)])
                 picker2.set('max',[parseInt(ey),parseInt(em1),parseInt(ed)])   
                if(endEveStartSet!==0){
                    var startDateValue = moment(new Date(endEveStartSet)).format("YYYY-MM-DD");
                    var endDateValue = moment(new Date($("#startDate").val())).format("YYYY-MM-DD");
                    var csy = moment.utc(new Date(startDateValue)).format("YYYY");
                    var csm  =moment.utc(new Date(startDateValue)).format("M");
                    var csd = moment.utc(new Date(startDateValue)).format("D");
                    var cey = moment.utc(new Date(endDateValue)).format("YYYY");
                    var cem = moment.utc(new Date(endDateValue)).format("M");
                    var ced = moment.utc(new Date(endDateValue)).format("D");
                    var cem1 = parseInt(cem)-1
                    var csm1=parseInt(csm)-1;
                    picker2.set('max',[parseInt(csy),parseInt(csm1),parseInt(csd)])
                }
                else if(endEveStartSet==0){
                    var endDateValue = moment(new Date($(e.target).parent().next().children().val())).format("YYYY-MM-DD");
                    var ey = moment.utc(new Date(endDateValue)).format("YYYY");
                    var em = moment.utc(new Date(endDateValue)).format("M");
                    var ed = moment.utc(new Date(endDateValue)).format("D");
                    var startDateValue = moment(new Date($("#startDate").val())).format("YYYY-MM-DD");
                    var csy = moment.utc(new Date(startDateValue)).format("YYYY");
                    var csm  =moment.utc(new Date(startDateValue)).format("M");
                    var csd = moment.utc(new Date(startDateValue)).format("D");
                    var csm1=parseInt(csm)-1;
                    picker2.set('min',[parseInt(csy),parseInt(csm1),parseInt(csd)])
                    var em1=parseInt(em)-1
                    var sm1=parseInt(sm)-1
                    var ed1 = parseInt(ed)-1
                    var sd1 = parseInt(sd)-1
                    picker2.set('max',[parseInt(ey),parseInt(em1),parseInt(ed)])

                }
            }
            else {
                var startDateValue = moment(new Date($("#startDate").val())).format("YYYY-MM-DD");
                var endDateValue = moment(new Date($(e.target).parent().next().children().val())).format("YYYY-MM-DD");
                var sy = moment.utc(new Date(startDateValue)).format("YYYY");
                var sm  =moment.utc(new Date(startDateValue)).format("M");
                var sd = moment.utc(new Date(startDateValue)).format("D");
                var ey = moment.utc(new Date(endDateValue)).format("YYYY");
                var em = moment.utc(new Date(endDateValue)).format("M");
                var ed = moment.utc(new Date(endDateValue)).format("D");
                var em1=parseInt(em)-1
                var sm1=parseInt(sm)-1
                var ed1 = parseInt(ed)-1
                var sd1 = parseInt(sd)-1
                /*var input2 = $(e.target).pickadate({
                    format:'yyyy mmm dd',
                    selectYears: true,
                    selectMonths: true,
                    clear:'',
                    min:[parseInt(sy),parseInt(sm1),parseInt(sd)],
                    max:[parseInt(ey),parseInt(em1),parseInt(ed)],
                    onSet: function(context) {
                        addEveStartSet = new Date(context.select);
                        endD = moment($(e.target).parent().next().children().val()).format("YYYY-MM-DD");
                        startD =  moment(addEveStartSet).format("YYYY-MM-DD");
                        if(moment.utc(endD)<moment.utc(startD)){
                            $(e.target).parent().next().children().val(moment(startD).format("YYYY MMM DD"))
                        }
                        endEveStartSet = 0;
                    },
                    onClose: function() {
                            if(addEveStartSet==0||isNaN(new Date(addEveStartSet).getTime())){
                                addEveStartSet=$(e.target).val()
                            }
                    }
                });*/
                var picker2 = input2.pickadate('picker');
                 picker2.set('min',[parseInt(sy),parseInt(sm1),parseInt(sd)])
                 picker2.set('max',[parseInt(ey),parseInt(em1),parseInt(ed)])   
                if(endEveStartSet!==0){
                    var startDateValue = moment(new Date(endEveStartSet)).format("YYYY-MM-DD");
                    var endDateValue = moment(new Date($("#startDate").val())).format("YYYY-MM-DD");
                    var csy = moment.utc(new Date(startDateValue)).format("YYYY");
                    var csm  =moment.utc(new Date(startDateValue)).format("M");
                    var csd = moment.utc(new Date(startDateValue)).format("D");
                    var cey = moment.utc(new Date(endDateValue)).format("YYYY");
                    var cem = moment.utc(new Date(endDateValue)).format("M");
                    var ced = moment.utc(new Date(endDateValue)).format("D");
                    var cem1 = parseInt(cem)-1
                    var csm1=parseInt(csm)-1;
                    picker2.set('max',[parseInt(csy),parseInt(csm1),parseInt(csd)])
                }
                else if(endEveStartSet==0){
                    var endDateValue = moment(new Date($(e.target).parent().next().children().val())).format("YYYY-MM-DD");
                    var ey = moment.utc(new Date(endDateValue)).format("YYYY");
                    var em = moment.utc(new Date(endDateValue)).format("M");
                    var ed = moment.utc(new Date(endDateValue)).format("D");
                    var em1=parseInt(em)-1
                    var sm1=parseInt(sm)-1
                    var ed1 = parseInt(ed)-1
                    var sd1 = parseInt(sd)-1
                    picker2.set('max',[parseInt(ey),parseInt(em1),parseInt(ed)])
                }
            } 
        }
    },
    'focus #startEndAddEve':function(e){
        $("#eveDomProvideDetails").val("")
        e.preventDefault();
        var check = $(e.target).parent().prev().prev().prev().prop("checked")
        if(check==undefined){
            check= $(e.target).parent().prev().prev().prev().prev().prop("checked")
        }
        if(check){
            Session.set("dateChanged1",0)
            Session.set("dateChanged0",0)
            $(e.target).css("cursor","pointer")
            var startDateValue = moment(new Date($("#startDate").val())).format("YYYY-MM-DD");
            var endDateValue = moment(new Date($("#endDate").val())).format("YYYY-MM-DD");
            var sy = moment.utc(new Date(startDateValue)).format("YYYY");
            var sm  =moment.utc(new Date(startDateValue)).format("M");
            var sd = moment.utc(new Date(startDateValue)).format("D");
            var ey = moment.utc(new Date(endDateValue)).format("YYYY");
            var em = moment.utc(new Date(endDateValue)).format("M");
            var ed = moment.utc(new Date(endDateValue)).format("D");
            var em1=parseInt(em)-1
            var sm1=parseInt(sm)-1
            var input = $(e.target).pickadate({
                format:'yyyy mmm dd',
                selectYears: true,
                selectMonths: true,
                clear:'',
                min:[parseInt(sy),parseInt(sm1),parseInt(sd)],
                max:[parseInt(ey),parseInt(em1),parseInt(ed)],
                onSet: function(context) {
                         addEveStartSet = 0;
                         endEveStartSet = new Date(context.select);
                },
                onClose: function() {
                            if(endEveStartSet==0||isNaN(new Date(endEveStartSet).getTime())){
                                endEveStartSet=$(e.target).val()
                            }
                }                
            });
             if(Session.get("editEventDateChange")==1){
                var startDateValue = moment(new Date($(e.target).parent().prev().children().val())).format("YYYY-MM-DD");
                var endDateValue = moment(new Date($(e.target).val())).format("YYYY-MM-DD");
                var sy = moment.utc(new Date(startDateValue)).format("YYYY");
                var sm  =moment.utc(new Date(startDateValue)).format("M");
                var sd = moment.utc(new Date(startDateValue)).format("D");
                var ey = moment.utc(new Date(endDateValue)).format("YYYY");
                var em = moment.utc(new Date(endDateValue)).format("M");
                var ed = moment.utc(new Date(endDateValue)).format("D");
                var em1=parseInt(em)-1
                var sm1=parseInt(sm)-1
                var ed1 = parseInt(ed)-1
                var sd1 = parseInt(sd1)-1
               /* var input = $(e.target).pickadate({
                        format:'yyyy mmm dd',
                        selectYears: true,
                        selectMonths: true,
                        clear:'',
                        min:[parseInt(sy),parseInt(sm1),parseInt(sd)],
                        max:[parseInt(ey),parseInt(em1),parseInt(ed)],
                        onSet: function(context) {
                         addEveStartSet = 0;
                         endEveStartSet = new Date(context.select);
                        },
                        onClose: function() {
                            if(endEveStartSet==0||isNaN(new Date(endEveStartSet).getTime())){
                                endEveStartSet=$(e.target).val()
                            }
                        }
                    });*/
                var picker = input.pickadate('picker');
                picker.set('min',[parseInt(sy),parseInt(sm1),parseInt(sd)])
                picker.set('max',[parseInt(ey),parseInt(em1),parseInt(ed)])   
                if(addEveStartSet!==0){
                    var startDateValue = moment(new Date(addEveStartSet)).format("YYYY-MM-DD");
                    var endDateValue = moment(new Date($("#endDate").val())).format("YYYY-MM-DD");
                    var csy = moment.utc(new Date(startDateValue)).format("YYYY");
                    var csm  =moment.utc(new Date(startDateValue)).format("M");
                    var csd = moment.utc(new Date(startDateValue)).format("D");
                    var cey = moment.utc(new Date(endDateValue)).format("YYYY");
                    var cem = moment.utc(new Date(endDateValue)).format("M");
                    var ced = moment.utc(new Date(endDateValue)).format("D");
                    var cem1 = parseInt(cem)-1
                    var csm1=parseInt(csm)-1;
                    picker.set('min',[parseInt(csy),parseInt(csm1),parseInt(csd)])

                }
                else if(addEveStartSet==0){
                        var startDateValue = moment(new Date($(e.target).parent().prev().children().val())).format("YYYY-MM-DD");
                        var endDateValue = moment(new Date($("#endDate").val())).format("YYYY-MM-DD");
                        var sy = moment.utc(new Date(startDateValue)).format("YYYY");
                        var sm  =moment.utc(new Date(startDateValue)).format("M");
                        var sd = moment.utc(new Date(startDateValue)).format("D");
                        var ey = moment.utc(new Date(endDateValue)).format("YYYY");
                        var em = moment.utc(new Date(endDateValue)).format("M");
                        var ed = moment.utc(new Date(endDateValue)).format("D");
                        var em1=parseInt(em)-1
                        var sm1=parseInt(sm)-1
                        var ed1 = parseInt(ed)-1
                        var sd1 = parseInt(sd1)-1
                        picker.set('min',[parseInt(sy),parseInt(sm1),parseInt(sd)])
                        picker.set('max',[parseInt(ey),parseInt(em1),parseInt(ed)])
                    /*var Ppicker = $(e.target).pickadate({
                        format:'yyyy mmm dd',
                        selectYears: true,
                        selectMonths: true,
                        clear:'',
                        min:[parseInt(sy),parseInt(sm1),parseInt(sd)],
                        max:[parseInt(ey),parseInt(em1),parseInt(ed)]
                    });*/
                }

             }
             else{
                var startDateValue = moment(new Date($(e.target).parent().prev().children().val())).format("YYYY-MM-DD");
                var endDateValue = moment(new Date($("#endDate").val())).format("YYYY-MM-DD");
                var sy = moment.utc(new Date(startDateValue)).format("YYYY");
                var sm  =moment.utc(new Date(startDateValue)).format("M");
                var sd = moment.utc(new Date(startDateValue)).format("D");
                var ey = moment.utc(new Date(endDateValue)).format("YYYY");
                var em = moment.utc(new Date(endDateValue)).format("M");
                var ed = moment.utc(new Date(endDateValue)).format("D");
                var em1=parseInt(em)-1
                var sm1=parseInt(sm)-1
                var ed1 = parseInt(ed)-1
                var sd1 = parseInt(sd1)-1
               /* var input = $(e.target).pickadate({
                        format:'yyyy mmm dd',
                        selectYears: true,
                        selectMonths: true,
                        clear:'',
                        min:[parseInt(sy),parseInt(sm1),parseInt(sd)],
                        max:[parseInt(ey),parseInt(em1),parseInt(ed)],
                        onSet: function(context) {
                         addEveStartSet = 0;
                         endEveStartSet = new Date(context.select);
                        },
                        onClose: function() {
                            if(endEveStartSet==0||isNaN(new Date(endEveStartSet).getTime())){
                                endEveStartSet=$(e.target).val()
                            }
                        }
                    });*/
                var picker = input.pickadate('picker');
                picker.set('min',[parseInt(sy),parseInt(sm1),parseInt(sd)])
                picker.set('max',[parseInt(ey),parseInt(em1),parseInt(ed)])   
                if(addEveStartSet!==0){
                    var startDateValue = moment(new Date(addEveStartSet)).format("YYYY-MM-DD");
                    var endDateValue = moment(new Date($("#endDate").val())).format("YYYY-MM-DD");
                    var csy = moment.utc(new Date(startDateValue)).format("YYYY");
                    var csm  =moment.utc(new Date(startDateValue)).format("M");
                    var csd = moment.utc(new Date(startDateValue)).format("D");
                    var cey = moment.utc(new Date(endDateValue)).format("YYYY");
                    var cem = moment.utc(new Date(endDateValue)).format("M");
                    var ced = moment.utc(new Date(endDateValue)).format("D");
                    var cem1 = parseInt(cem)-1
                    var csm1=parseInt(csm)-1;
                    picker.set('min',[parseInt(csy),parseInt(csm1),parseInt(csd)])

                }
                else if(addEveStartSet==0){
                        var startDateValue = moment(new Date($(e.target).parent().prev().children().val())).format("YYYY-MM-DD");
                        var endDateValue = moment(new Date($("#endDate").val())).format("YYYY-MM-DD");
                        var sy = moment.utc(new Date(startDateValue)).format("YYYY");
                        var sm  =moment.utc(new Date(startDateValue)).format("M");
                        var sd = moment.utc(new Date(startDateValue)).format("D");
                        var ey = moment.utc(new Date(endDateValue)).format("YYYY");
                        var em = moment.utc(new Date(endDateValue)).format("M");
                        var ed = moment.utc(new Date(endDateValue)).format("D");
                        var em1=parseInt(em)-1
                        var sm1=parseInt(sm)-1
                        var ed1 = parseInt(ed)-1
                        var sd1 = parseInt(sd1)-1
                        picker.set('min',[parseInt(sy),parseInt(sm1),parseInt(sd)])

                    /*var Ppicker = $(e.target).pickadate({
                        format:'yyyy mmm dd',
                        selectYears: true,
                        selectMonths: true,
                        clear:'',
                        min:[parseInt(sy),parseInt(sm1),parseInt(sd)],
                        max:[parseInt(ey),parseInt(em1),parseInt(ed)]
                    });*/
                }
            }
        }

    },
    //set datepicker only if check box is checked
    'change .checkboxevents':function(e){
        e.preventDefault();
        Session.set("dateChanged1",0)
        Session.set("dateChanged0",0)
        $("#eveDomProvideDetails").val("")
        if($(e.target).prop('checked')==true){
            $(e.target).next().next().next().children().css("cursor","pointer")
            $(e.target).next().next().next().next().children().css("cursor","pointer")
            $(e.target).next().next().next().children().prop('disabled', false);
            $(e.target).next().next().next().next().children().prop('disabled', false);
            $(e.target).next().next().next().next().next().children().prop('readonly', false);
        }
        else{
            $(e.target).next().next().next().children().prop('disabled', true);
            $(e.target).next().next().next().children().css("cursor","default")
            $(e.target).next().next().next().next().children().css("cursor","default")
            $(e.target).next().next().next().next().children().prop('disabled', true);
            $(e.target).next().next().next().next().next().children().prop('readonly', true);
            //$(e.target).next().next().next().next().children().class("cursor","pointer")
        }
    },
    //click of ok get the data as json
    'click #yesAddEvents':function(e){
        e.preventDefault();
        var addEvent = [];
        var setFlag=[];
        var cc= []
        clickOKeditaddEvents=1
        var s = $("input[name=mainTag]:checked").map(
                function() {
                    cc.push(this.value)
                    return this.value;
                });

        if((cc.indexOf("None")==0&&s.length!==1)||(cc.indexOf("None")==-1&&s.length!==0)){
            //validation here
        $('.eventAddTourCheckBoxDiv').find('input[type="checkbox"]:checked').each(function(t,i){
            var patt = new RegExp(/^[0-9]*$/);
            var res = patt.test($(this).next().next().next().next().next().children().val());
            if($(this).next().next().next().next().next().children().val()==""){
                $(this).next().next().next().next().next().children().css("color","red");
                //setFlag=0;
                $("#eveDomProvideDetails").val("Provide Entry Fee").css("color","red");
                $("#eveDomProvideDetails").val("Provide Entry Fee").css("font-size","10px");
            }
            if($(this).next().next().next().next().next().children().val()!==""&&res===false){
                $(this).next().next().next().next().next().children().css("color","red");
                $("#eveDomProvideDetails").val("Entry Fee is not valid").css("color","red");
                $("#eveDomProvideDetails").val("Entry Fee is not valid").css("font-size","10px");
            }
            if($(this).next().next().next().next().next().children().val()!==""&&res==true){
                //$(this).next().next().next().next().next().children().css("color","red");
                setFlag.push(i);
            }
        });
        /*$('.eventAddTourCheckBoxDiv').find('input[type="checkbox"]:checked').each(function(){
            if($(this).next().next().next().next().next().children().val()!==""){
                $(this).next().next().next().next().next().children().css("color","red");
                setFlag=1;
            }
        });*/
        if(setFlag.length===$('.eventAddTourCheckBoxDiv').find('input[type="checkbox"]:checked').length){
        var addEvent = [];
        $('.eventAddTourCheckBoxDiv').find('input[type="checkbox"]:checked').each(function(){
            var prizeDD = 0;
            var prizeDet = events.findOne({"projectId":$(this).attr("id").toString(),tournamentId:Router.current().params._PostId});
            if(prizeDet){
                prizeDD = prizeDet.prize;
            }
            var data={
                "eventId":$(this).attr("id"),
                "projectType":$(this).next().children().attr("id"),
                "eventName":$(this).next().children().text(),
                "eventStartDate":$(this).next().next().next().children().val(),
                "eventEndDate":$(this).next().next().next().next().children().val(),
                "prize":prizeDD
            }
            addEvent.push(data);
        });
        Session.set("addEventArray",addEvent);
        $("#editaddEventsPopup").modal('hide');}
        }else{
            $("#eveDomProvideDetails").val("Please select one event").css("color","red");
            $("#eveDomProvideDetails").css("font-size","10px");
        }

      /*  $('.eventAddTourCheckBoxDiv').find('input[type="checkbox"]:checked').each(function(){
            var data={
                "eventId":$(this).attr("id"),
                "projectType":$(this).next().children().attr("id"),
                "eventName":$(this).next().children().text(),
                "eventStartDate":$(this).next().next().next().children().val(),
                "eventEndDate":$(this).next().next().next().next().children().val(),
                "prize":$(this).next().next().next().next().next().children().val()
            }
            addEvent.push(data);
        });
        Session.set("addEventArray",addEvent);
        $("#editaddEventsPopup").modal('hide');*/
    },
        "click #noAddEvents":function(e){
        e.preventDefault();
        $("#eveDomProvideDetails").val("")
        var eveArr = Session.get("addEventArray");
        var eveArr2;
        //if(addEveStartSet==0&&Session.get("dateChanged0")==0){;$("#editaddEventsPopup").modal('hide');}
        if(Session.get("dateChanged1")==1||Session.get("dateChanged0")==1){ $("#editaddEventsPopup").modal('hide');}
        else{
        if(eveArr==undefined||eveArr==null){            
            eveArr2=events.find({"tournamentId": Router.current().params._PostId}).fetch();
        }

        $('.eventAddTourCheckBoxDiv').find('input[type="checkbox"]:checked').each(function(){
                $("#" + $(this).attr("id")).prop('checked', false);
                $(this).next().next().next().children().prop('disabled', true);
                $(this).next().next().next().children().css("cursor","default");
                $(this).next().next().next().children().val($("#startDate").val());//start
                $(this).next().next().next().next().children().val($("#endDate").val());//end
                $(this).next().next().next().next().children().prop('disabled', true);
                $(this).next().next().next().next().children().css("cursor","default");
                $(this).next().next().next().next().next().children().val("")//fee
                $(this).next().next().next().next().next().prop('disabled', true);
                $(this).next().next().next().next().next().css("cursor","default");
        });
        if(eveArr==undefined||eveArr==null){
            for(var i=0;i<eveArr2.length;i++){
                    $("#" + eveArr2[i].projectId.toString()).prop('checked', true);
                    $("#" + eveArr2[i].projectId.toString()).next().next().next().children().val(eveArr2[i].eventStartDate);//start
                    $("#" + eveArr2[i].projectId.toString()).next().next().next().children().prop('disabled', false);
                    $("#" + eveArr2[i].projectId.toString()).next().next().next().children().css("cursor","pointer");
                    $("#" + eveArr2[i].projectId.toString()).next().next().next().next().children().val(eveArr2[i].eventEndDate);//end
                    $("#" + eveArr2[i].projectId.toString()).next().next().next().next().children().prop('disabled', false);
                    $("#" + eveArr2[i].projectId.toString()).next().next().next().next().children().css("cursor","pointer");
                    $("#" + eveArr2[i].projectId.toString()).next().next().next().next().next().children().val(eveArr2[i].prize)//fee
                    $("#" + eveArr2[i].projectId.toString()).next().next().next().next().next().prop('disabled', false);
                    $("#" + eveArr2[i].projectId.toString()).next().next().next().next().next().css("cursor","pointer");
            }
        }
        else if(eveArr!=undefined||eveArr!=null){
            for(var i=0;i<eveArr.length;i++){
                    $("#" + eveArr[i].eventId.toString()).prop('checked', true);
                    $("#" + eveArr[i].eventId.toString()).next().next().next().children().val(eveArr[i].eventStartDate);//start
                    $("#" + eveArr[i].eventId.toString()).next().next().next().children().prop('disabled', false);
                    $("#" + eveArr[i].eventId.toString()).next().next().next().children().css("cursor","pointer");
                    $("#" + eveArr[i].eventId.toString()).next().next().next().next().children().val(eveArr[i].eventEndDate);//end
                    $("#" + eveArr[i].eventId.toString()).next().next().next().next().children().prop('disabled', false);
                    $("#" + eveArr[i].eventId.toString()).next().next().next().next().children().css("cursor","pointer");
                    $("#" + eveArr[i].eventId.toString()).next().next().next().next().next().children().val(eveArr[i].prize)//fee
                    $("#" + eveArr[i].eventId.toString()).next().next().next().next().next().prop('disabled', false);
                    $("#" + eveArr[i].eventId.toString()).next().next().next().next().next().css("cursor","pointer");
            }
        }
        
        $("#editaddEventsPopup").modal('hide');
        }
    },

    "keyup #addEentryFee":function(event){

        $("#eveDomProvideDetails").val("")
        $("#eveDomProvideDetails").css("color","black");
           var key = window.event ? event.keyCode : event.which;

            if (event.keyCode === 8 || event.keyCode === 46
                || event.keyCode === 37 || event.keyCode === 39) {
                return true;
            }
            else if ( key < 48 || key > 57 ) {
                return false;
            }
            else return true;
    },

    "focus #addEentryFee":function(e){
        $(e.target).css("color","black");
        $("#eveDomProvideDetails").val("")
    }

});

Template.editaddEventsPopup.helpers({
    "lEventsUnderTourn":function(){
        var tournamentEventId = events.findOne({"_id":Router.current().params._PostId})
       try{
        var tournamentEventId = events.findOne({"_id":Router.current().params._PostId})
        if(tournamentEventId!=undefined){

        var r = tournamentEvents.findOne({"_id":tournamentEventId.projectId.toString()});
        if(r!=undefined)
        return r.projectSubName;
        }
    }catch(e){}
        
    },
    "tournID":function(){
        return Router.current().params._PostId;
    },
    "lEventStartDate":function(){
        var tournamentEventId = events.findOne({"_id":Router.current().params._PostId});
        if(tournamentEventId!=undefined)
        return tournamentEventId.eventStartDate;
    },
    "lEventEndDate":function(){
        var tournamentEventId = events.findOne({"_id":Router.current().params._PostId});
         if(tournamentEventId!=undefined)
        return tournamentEventId.eventEndDate;
    },
});


var arrayToAdd_selectedIds = [];
Template.whoCanSubscribeEdit.onCreated(function(){
    this.subscribe("associationOrAcademies");
    this.subscribe("onlyLoggedIn");
    this.subscribe("onlyLoggedInALLRoles");
    this.PickAssocsSelected  = new ReactiveVar(undefined)
    this.selected_id_acasoc = new ReactiveVar(undefined)
});

Template.whoCanSubscribeEdit.onRendered(function(){
    arrayToAdd_selectedIds = [];
});

Template.whoCanSubscribeEdit.helpers({
    "associationNameOrAcademyName":function(){
        try{
            if(Meteor.user().role=="Association"&&Meteor.user().associationType=="District/City"){
                var associtionDetailsFind = associationDetails.find({}).fetch();
                if(associtionDetailsFind){
                    return associtionDetailsFind
                }
            }
            else if(Meteor.user().role=="Academy"){
                var associtionDetailsFind = academyDetails.find({}).fetch();
                if(associtionDetailsFind){
                    return associtionDetailsFind
                }
            }
        }catch(e){

        }
    },
    getrolename:function(){
        try{
            if(Meteor.user().role=="Association"){
                return "associations";
            }
            if(Meteor.user().role=="Academy"){
                return "academies";
            }
        }catch(e){

        }
    },
    PickAssocs:function(){
        try{
            if(Template.instance().PickAssocsSelected.get()==1){
                return true
            }
        }catch(e){

        }
    },
    thisDaOrAcaCheck:function(){
        try{
            if(this.userId==Meteor.user().userId){
                return true;
            }
        }catch(e){

        }
    },
    thisDaOrAcaRead:function(){
        try{
            if(this.userId==Meteor.user().userId){
                return "readonly";
            }
        }catch(e){

        }
    },
    thisDaOrAcaDis:function(){
        try{
            if(this.userId==Meteor.user().userId){
                return "disabled";
            }
        }catch(e){

        }
    },
    roleWhoValid:function(){
        try{
            if(Meteor.user().role=="Association"&&Meteor.user().associationType=="State/Province/County"){
                return false;
            }
            else if(Meteor.user().role=="Organiser"){
                return false
            }
            else return true
        }catch(e){

        }
    },
    checkedORNOtSelf:function(){
        try{
            var findType = subscriptionRestrictions.findOne({"tournamentId":Router.current().params._PostId});
            if(findType.selectionType=="self"){
                return "checked"
            }
        }catch(e){

        }
    },
    checkedORNOtAll:function(){
        try{
            var findType = subscriptionRestrictions.findOne({"tournamentId":Router.current().params._PostId});
            if(findType.selectionType=="all"){
                return "checked"
            }
        }catch(e){
            
        }
    },
    checkedORNOtRest:function(){
        try{
            var findType = subscriptionRestrictions.findOne({"tournamentId":Router.current().params._PostId});
            if(findType.selectionType=="restrict"){
                return "checked"
            }
        }catch(e){
            
        }
    },
    checkedORNOtPick:function(){
        try{
            var findType = subscriptionRestrictions.findOne({"tournamentId":Router.current().params._PostId});
            if(findType.selectionType=="pick"){
                return "checked"
            }
        }catch(e){
            
        }
    },
    checkPicked:function(){
        try{
            var findType = subscriptionRestrictions.findOne({"tournamentId":Router.current().params._PostId});
            if(findType.selectionType=="pick"){
                var selectedIds_id = findType.selectedIds;
                if(_.contains(selectedIds_id,this.userId)){
                    return "checked"
                }
            }
        }catch(e){
            
        }  
    },
    checkNotOrganizer:function(){
        try{
            if(Meteor.user().role=="Organiser"){
                return false;
            }
            else return true
        }catch(e){

        }
    },
    checkedORNOtAllExceptSchool:function(){
        try{
            var findType = subscriptionRestrictions.findOne({"tournamentId":Router.current().params._PostId});
            if(findType&&findType.selectionType=="allExceptSchool"){
                return "checked"
            }
            else if(findType==undefined){
                return "checked"
            }
        }catch(e){
            
        }
    },
    checkedORNOtSchoolOnly:function(){
        try{
            var findType = subscriptionRestrictions.findOne({"tournamentId":Router.current().params._PostId});
            if(findType&&findType.selectionType=="schoolOnly"){
                return "checked"
            }
        }catch(e){
            
        }
    },
    schoolSelectedType:function(){
        try{
            var findType = subscriptionRestrictions.findOne({"tournamentId":Router.current().params._PostId});
            if(findType&&findType.selectionType=="schoolOnly" && findType.tournamentType){
                return findType.tournamentType
            } else{
                return ""
            }
        }catch(e){
            
        }
    },
});

Template.whoCanSubscribeEdit.events({
    "change input[name=selectSubcriptionType]":function(e,template){
        e.preventDefault();
        if ($(e.target).is(":checked")) {
            if($(e.target).attr("id")=="pickASSAC"){
                template.PickAssocsSelected.set(1)
                $("#changeHeightOfModal").css("min-height","225px")
            }
            else{
                template.PickAssocsSelected.set(undefined)
                $("#changeHeightOfModal").css("min-height","110px")
            }
        }
    },
    "change input[name=selectedNamesAssocAcad]":function(e,template){
        e.preventDefault();
        var userId = this.userId
        if(Meteor.user().userId==userId){
            return false;
        }
        if ($(e.target).is(":checked")&&$('input[name=selectSubcriptionType]:checked').attr("id")=="pickASSAC") {
            var id = this.userId;
            if(arrayToAdd_selectedIds!=undefined){
                if (_.findWhere(arrayToAdd_selectedIds, userId) == null) {
                    arrayToAdd_selectedIds.push(userId);
                }
            }
            else{
                arrayToAdd_selectedIds.push(userId);    
            }
            template.selected_id_acasoc.set(arrayToAdd_selectedIds);        
        }
    },
    "click #SaveSubRest":function(e,template){
        e.preventDefault();
        var selectionType = $('input[name=selectSubcriptionType]:checked').attr("id");
        var tournamentId;
        var eventOrganizerId;
        var role;
        var selectedIds;
        if(selectionType=="pickASSAC"){
            selectedIds = Template.instance().selected_id_acasoc.get();
        }
        var data = {
            selectionType:selectionType,
            selectedIds:selectedIds
        }
        Session.set("susbcriptionRest",data)
        $("#whoConSubscribe").modal('hide')
        Blaze.render(Template.subscriptionDOB_createEvents, $("#dobFilterRender")[0]);
        $("#subscriptionDOB_createEvents").modal({
            backdrop: 'static',
            keyboard:false
        });

    },
    "click #CancelSubRest":function(e,template){
        e.preventDefault();
        $('#whoCanSubscribeEdit').modal('hide');
        $("#dobFilterRender").empty()
        Session.set("susbcriptionRest",undefined);
        var checked1 = $("#selfOnly").prop("checked",true);
        var checked2 = $("#selectedNamesAssocAcad").prop("checked",false);
        template.PickAssocsSelected.set(undefined);
        template.selected_id_acasoc.set(undefined);
        $("#changeHeightOfModal").css("min-height","110px")
        $("#httpSettingsPopupError").html("");
        $("#Httpcheck").val("")
        var checked1 = $("#setAnysetDirect").prop("checked",false);
        var checked2 = $("#setAnysetHyper").prop("checked",false)
        var checked3 = $("#setAnysetmail").prop("checked",false)
    },
    "click #cancelFromDob":function(e){
        e.preventDefault();
        $("#subscriptionDOB").modal('hide')
        $("#dobFilterRender").empty()
        $('#whoCanSubscribeEdit').modal({
            backdrop: 'static',keyboard: false
        });
        Session.set("LdataToSaveFromDOB",undefined)
    }
});


Template.subscriptionDOB_editEvents.onCreated(function(){
    this.subscribe("tournamentEvents");
    this.subscribe("dobFilterSubscribe")
});

Template.selectedEventsCategories_editEvents.onCreated(function(){
    this.subscribe("tournamentEvents");
    this.subscribe("dobFilterSubscribe")
});

Template.subscriptionDOB_editEvents.onRendered(function(){
    Session.set("getEventListForSelectedTorun",undefined);
    Session.set("errorsValid",undefined);
});

Template.subscriptionDOB_editEvents.helpers({
    lTourns: function() {
        var lProjectNames = tournamentEvents.find().fetch();
        if (lProjectNames) {
            return lProjectNames;
        }
    },
    asdad:function(){
        try{
        if(Session.get("tournIdForEvAdd")){
            var r = tournamentEvents.findOne({"_id":$('#projectName :selected').val().toString()});
            if(r!=undefined)
            return r.projectSubName;
        }
        }catch(e){}
    }
});

Template.selectedEventsCategories_editEvents.helpers({
    lTourns_Sports2:function(){
        try{
       // if(Session.get("tournIdForEvAdd")){
            var r = dobFilterSubscribe.find({"tournamentId":Router.current().params._PostId}).fetch();
            if(r!=undefined)
            return r;
        //}
        }catch(e){}
    },
    checkROLESub:function(){
        if(Meteor.user().role=="Academy"||Meteor.user().role=="Association"){
            return true
        }
        else{
            return false;
        }
    }
});

Template.selectedEventsCategories_editEvents.events({
    'submit form': function(e) {
        e.preventDefault();
    },
    "keyup .setDOB_Input":function(e){
        e.preventDefault();
        $(e.target).css("color","black");
        Session.set("errorsValid",0)
    },
    "click #noAddEvents":function(e){
        $("#subscriptionDOB").modal('hide')
    }
});

Template.subscriptionDOB_editEvents.events({
    'click #changeOfTourn': function(e) {
        e.preventDefault();
        $('#changeOfTourn').bind("keydown change", function() {
            var obj = $(this);
            setTimeout(function() {
                var eventName = obj.val();
                $("#eveDomProvideDetails_NEW").html("")
                Session.set("getEventListForSelectedTorun",eventName);
                $("#renderselectedEventsCategories").empty()
                Blaze.render(Template.selectedEventsCategories, $("#renderselectedEventsCategories")[0]);
            }, 0);
        });
    },
    'submit form': function(e) {
        e.preventDefault();
    },
    "click #cancelFromDob":function(e){
        $("#subscriptionDOB_editEvents").modal('hide')
        if(Meteor.user().role=="Association"||Meteor.user().role=="Academy"){
            $('#whoConSubscribe').modal({
                backdrop: 'static',keyboard: false
            })
        }
        Session.set("LdataToSaveFromDOB",undefined)
    },
    "click #prevFromDOB":function(e){
        e.preventDefault();
        $("#subscriptionDOB_editEvents").modal('hide')
        $('#whoConSubscribe').modal({
            backdrop: 'static',keyboard: false
        })
    },

});

Template.registerHelper('getEVENTNAME_DOB',function(data){
    try{
        var gEventId = Router.current().params._PostId;
        var lEvents = events.findOne({
            "tournamentId":gEventId,
            "projectId":data
        })
        if(lEvents){
            return lEvents.eventName
        }
       
    }catch(e){

    }
})
Template.registerHelper('savedRankingRender', function(data) {
  //if team event selected array is not undefined
  //get the list of selected event and team
  //if data(team id) coming from html template is inside the list
  //return checked to the check box
  //if (Session.get("getEventListForSelectedTorun") != undefined) {
    try{
     var gEventId = Router.current().params._PostId;
        var lEvents = events.findOne({
            "_id":gEventId
        })
        var eventOrganizer = Meteor.user()._id;
        var find  = dobFilterSubscribe.findOne({
                eventOrganizer:eventOrganizer.toString(),
                mainProjectId:lEvents.projectId.toString(),
                tournamentId:Router.current().params._PostId
        });
        if(find&&find.details){
            for(var i=0;i<find.details.length;i++){
                if(find.details[i].eventId==data){
                    return find.details[i].ranking
                    break;
                }
            }
        }
        else return "";
 // }
}catch(e){
}
});

Template.registerHelper('savedDOBRender', function(data) {
  //if team event selected array is not undefined
  //get the list of selected event and team
  //if data(team id) coming from html template is inside the list
  //return checked to the check box
  //if (Session.get("getEventListForSelectedTorun") != undefined) {
    try{
         var gEventId = Router.current().params._PostId;
        var lEvents = events.findOne({
            "_id":gEventId,
        })
        var eventOrganizer = Meteor.user()._id;
        var find  = dobFilterSubscribe.findOne({
                eventOrganizer:eventOrganizer.toString(),
                mainProjectId:lEvents.projectId.toString(),
                tournamentId:Router.current().params._PostId
        });
        if(find&&find.details){
            for(var i=0;i<find.details.length;i++){
                if(find.details[i].eventId==data){
                    return find.details[i].dateOfBirth
                    break;
                }
            }
        }
        else return "";
  //}
}catch(e){
}
});