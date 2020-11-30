import { routeForsubscription } from '../../routes/hooks.js'

Template.schoolRegistrationTabs.onCreated(function() {
    this.subscribe("userOtp");
    this.subscribe("timeZone")
    this.subscribe("onlyLoggedIn")
});

Template.schoolRegistrationTabs.onRendered(function() {
    try
    {
        if (Session.get("DDofdateOfBirth") == null) 
        {
            var monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];
            $('#days').append($('<option />').val("DD").html("DD").prop('disabled', true).prop('selected', true))
            for (i = new Date().getFullYear(); i > 1900; i--) {
                $('#years').append($('<option />').val(i).html(i));
            }

            for (i = 1; i < 13; i++) {
                $('#months').append($('<option />').val(i).html(i));
            }
            updateNumberOfDays();
        }
    }catch(e){};
    Session.set("clubName",null);

});

Template.schoolRegistrationTabs.helpers({

    
    "stateList_2_academy":function(){
        try{
        var stateList=timeZone.findOne({"countryName":"India"});
        if(stateList!=undefined&&stateList.state){
            return stateList.state;
        }
        }catch(e){
        }
    },
    "associationList_school":function()
    {
        try{       
            if(Session.get("associationList_school"))
            {

                return Session.get("associationList_school")
            }
             
        }catch(e){}
    },
    "setDays_2":function(){
        try{
            var s=[];
            for (i = 1; i<32; i++) {
                s.push(i);
            }
            return s;
        }catch(e){
        }
    },
    setMonths_2:function(){
        try{
        var monthNames = ["January", "February", "March", "April", "May", "June",
               "July", "August", "September", "October", "November", "December"
        ];
        var s=[];
        for (i = 1; i < 13; i++) {
            s.push(i);
        }
        return s;
        }catch(e){
        }
    },
    setYears_2:function(){
        try{
        var s=[];
        for (i = new Date().getFullYear(); i > 1900; i--) {
            s.push(i);
        }
        return s;
        }catch(e){
        }
    },
   
});

Template.schoolRegistrationTabs.events({
    "click #confirmModalRedirectYes": function(e) {
        e.preventDefault();
        var id = "";
        if (Session.get("clickedIDToRed"))
            id = Session.get("clickedIDToRed")
        else
            id = "";
        Meteor.call("upcomingListsAndStatus", id, function(error, response) {})
        $("#confirmModalRedirect").modal('hide');
        $("#alreadySubscribed_entryFromAca").modal('hide');
        var type = Session.get("hyperLINKValue")
        $( '.modal-backdrop' ).remove();
        //if the subscription type is hyperlink
        //route to hyper link
        if (type) {
            var s = type
                //if the web site doesn't contains https
            if (!s.match(/^https?:\/\//i)) {
                s = 'http://' + s;
            }
            window.open(s, '_blank');
        }
    },
    'change #clubName': function() {
        $("#clubName").css({"color": ""});
        Session.set('clubName', $("#clubName").val());
    },
    'keyup #clubName': function() {
        $("#clubName").css({"color": ""});
        Session.set('clubName', $("#clubName").val());
    },
    'change #userNameContactmodReg2': function() {
        $("#userNameContactmodReg2").css({"color": ""});
        Session.set('userNameContactmodReg2', $("#userNameContactmodReg2").val());
    },

    'keyup #userNameContactmodReg2': function() {
        $("#userNameContactmodReg2").css({"color": ""});
        Session.set('userNameContactmodReg2', $("#userNameContactmodReg2").val());
    },
    'change  #months_I2': function(e) {
        Session.set("MMOfINC2", $("#months_I2").val())
        updateNumberOfDays_L();
    },
    'change #years_I2': function(e) {
        Session.set("YYOfINC2", $("#years_I2").val())
        updateNumberOfDays_L();
    },
    'change #days_I2': function(e) {
        Session.set("DDOfINC2", $("#days_I2").val());
    },
   
    "change #state2":function(){
        $("#state2").css({"color": ""});
        Session.set("stateOfAssoc2",$("#state2").val());
       
        Meteor.call("associationList_school",$("#state2").val(),function(e,res){
            if(e)
                {}
            else{
                Session.set("associationList_school",res);                
            }
            
        });
            
    },
    'change #abbrevationclubName':function(e){
        $("#abbrevationclubName").css({"color": ""});

        $("#setForOthersAssociation").html("")
        if($("#abbrevationclubName").val().trim().length!=0){
            Meteor.call("schoolAbbrevationDuplicates",$("#abbrevationclubName").val().trim(),function(e,res){
                if(res){
                    $("#setForOthersAssociation").html("Use different abbrevation name");
                    Session.set("abbrevationclubNameSe",null)
                }
                else{
                    Session.set("abbrevationclubNameSe",$("#abbrevationclubName").val());
                }
            })
        }
    },
    'keyup #abbrevationclubName':function(e){
        $("#abbrevationclubName").css({"color": ""});
        $("#setForOthersAssociation").html("")
        if($("#abbrevationclubName").val().trim().length!=0){
            Meteor.call("schoolAbbrevationDuplicates",$("#abbrevationclubName").val().trim(),function(e,res){
                if(res){
                    $("#setForOthersAssociation").html("Use different abbrevation name");
                    Session.set("abbrevationclubNameSe",null)
                }
                else{
                    Session.set("abbrevationclubNameSe",$("#abbrevationclubName").val());
                }
            })
        }
    },

     'change #city': function() {
        $("#city").css({"color": ""});
        Session.set('city', $("#city").val());
    },

    'keyup #city': function() {
        $("#city").css({"color": ""});
        Session.set('city', $("#city").val());
    },

    //pinCode
    'change #pinCode': function() {
        $("#pinCode").css({"color": ""});
        Session.set('pinCode', $("#pinCode").val());
    },

    'keyup #pinCode': function() {
        $("#pinCode").css({"color": ""});
        Session.set('pinCode', $("#pinCode").val());
    },

    "keyup #pinCode": function(event) {
        var key = window.event ? event.keyCode : event.which;

        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
     "keyup #mobileNumber": function(event) {
        var key = window.event ? event.keyCode : event.which;

        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    },
    'keyup #mobileNumber': function(e) {
        $("#mobileNumber").css({"color": ""});
        Session.set('mobileNumber', e.target.value);
    },
    "change #terms2": function(e) {
        if ($("input[id=terms2]:checked").length !== 0) {
            Session.set('termsLength2', $("input[id=terms2]:checked").length);
        } else {
            Session.set('termsLength2', undefined);
            Session.set('termsLength2', null);
        }
    },
    "click #previous_role_selection":function()
    {
        $('#schoolRegistrationTabs').modal('hide');
        $('#modReg1').modal('show');

    },
    'click  #schoolRegisterSubmit': function(e) {
        
        var s = parseInt(Session.get('DDofdateOfBirth'))
        var s1 = parseInt(Session.get('MMofdateOfBirth'))
        var s2 = parseInt(Session.get('YYofdateOfBirth')+1)
        var s3 = moment.utc(new Date(s2 + "/" + s1 + "/" + s)).format("DD MMM YYYY");
        Session.set('dateOfBirth', s3);
    


        if ((Session.get("abbrevationclubNameSe")==null)||
            (!Session.get("abbrevationclubNameSe").trim().length)||
            (Session.get("stateOfAssoc2")==null)||
            (Session.get('clubName') == null) || 
            (!Session.get('clubName').trim().length) || 
            (Session.get('clubName') == "") || 
            (Session.get('mobileNumber') == null) || 
            (Session.get('mobileNumber') == "") || 
            (Session.get('mobileNumber').length != 10) || 
            (Session.get('userNameContactmodReg2') == null) || 
            (!Session.get('userNameContactmodReg2').trim().length) || 
            (Session.get('userNameContactmodReg2') == "") || 
            (Session.get('city') == null) || 
            (!Session.get('city').trim().length) || (Session.get('city') == "") || 
            (Session.get('pinCode') == null) || (Session.get('pinCode').length != 6) || 
            (Session.get('pinCode') == "") ) 

        {
            if(Session.get("abbrevationclubNameSe")==null || (!Session.get("abbrevationclubNameSe").trim().length))
                $("#abbrevationclubName").css({"color": "red"});
            if(Session.get("stateOfAssoc2")==null)
                $("#state2").css({"color": "red"});
            if(Session.get('clubName') == null || Session.get('clubName') == "" || (!Session.get('clubName').trim().length))
                $("#clubName").css({"color": "red"});
            if(Session.get('mobileNumber') == null || Session.get('mobileNumber') == "" || (Session.get('mobileNumber').length != 10))
                $("#mobileNumber").css({"color": "red"});
            if(Session.get('userNameContactmodReg2') == null || Session.get('userNameContactmodReg2') == "" || (!Session.get('userNameContactmodReg2').trim().length))
                $("#userNameContactmodReg2").css({"color": "red"});
            if(Session.get('city') == null || Session.get('city') == "" || (!Session.get('city').trim().length))
                $("#city").css({"color": "red"});
            if(Session.get('pinCode') == null || Session.get('pinCode') == "" || (Session.get('pinCode').length != 6))
                $("#pinCode").css({"color": "red"});

            $("#schoolRegistrationTabs").find("#impMsg").text("* Please fill mandatory fields")

        }
        else if(Session.get("termsLength2") != "1")
        {
            $("#schoolRegistrationTabs").find("#impMsg").text("* Please accept terms and conditions");
        }
        else
        {
            $("#schoolRegistrationTabs").find("#impMsg").text("")
            Session.set("country","India");

            var associationIdVal = $("#associationIdVal").val();

             var lData = {
                emailAddress: Session.get('emailAddress'),
                password: $("#password").val(),
                interestedProjectName: [""],
                interestedDomainName: [""],
                interestedSubDomain1Name: [""],
                interestedSubDomain2Name: [""],
                clubName: Session.get("clubName"),
                phoneNumber: Session.get('mobileNumber'),
                associationId: associationIdVal,
                role: Session.get('role'), 
                contactPerson: Session.get('userNameContactmodReg2'),
                address: Session.get('address'),
                city: Session.get('city'),
                pinCode: Session.get('pinCode'),
                country:Session.get("country"),
                state:Session.get("stateOfAssoc2"),         
                abbrevation:Session.get("abbrevationclubNameSe"),
            };

            Meteor.call("registerSchool",lData,function(error,response)
            {
                if(response)
                {
                    $('#schoolRegistrationTabs').modal('hide');
                    $("#alreadySubscribedText").text("Sending confirmation email");
                    $("#sendingMailPopup3").modal({backdrop: 'static'});;
                    var dataContext = {
                        message: "Welcome,"+name,
                        academyPersonName: Session.get('userNameContactmodReg2'),
                        academyName: Session.get("clubName"),
                        imageURL:Meteor.absoluteUrl()
                    }
                    var html = Blaze.toHTMLWithData(Template.sendRegisterationEmailToAcademy, dataContext);
                    var options = {
                        from: "iplayon.in@gmail.com",
                        to:Session.get('emailAddress'),
                        subject: "Welcome,"+Session.get('userNameContactmodReg2'),
                        html: html
                    }

                    Meteor.call("sendShareEmail", options, function(e, re) {
                        if(re)
                            displayMessage("Network issue, Cannot send email")                                         
                        else{}
                    });

                    Meteor.loginWithPassword(Session.get('emailAddress'),$("#password").val(), function(error){
                        if(error){} 
                        else 
                        {
                            setTimeout(function(){
                                $("#sendingMailPopup3").modal('hide');
                                if (Meteor.userId()) {
                                    var s = Meteor.users.findOne({
                                            _id: Meteor.userId()
                                        });
                                    if (s&&s.profileSettingStatus == true) {
                                        routeForsubscription(s)
                                    }
                                }
                                //Router.go("/upcomingEvents");
                            }, 1000);
              
                        }
                    });
                   
                }
                else
                {
                    $("#conFirmHeaderOk").text(error.reason);
                    $("#confirmModalOk").modal({backdrop: 'static'});;
                }
            });
        }

    }
});


function updateNumberOfDays_L() {
    $('#days_I2').html('');
    month = $('#months_I2').val();
    year = $('#years_I2').val();
    days = daysInMonth_L(month, year);
    Session.set("DDofdateOfBirth", null);
    $('#days_I2').append($('<option />').val("DD").html("DD").prop('disabled', true).prop('selected', true))
    for (i = 1; i < days + 1; i++) {
        $('#days_I2').append($('<option />').val(i).html(i));
    }
}

function daysInMonth_L(month, year) {
    return new Date(year, month, 0).getDate();
}