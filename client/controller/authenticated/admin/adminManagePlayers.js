Template.adminManagePlayers.onCreated(function() {
    this.subscribe("authAddress");
    //this.subscribe("users");
    this.subscribe("lastInsertedAffId");
});

//userDetailsTTUsed
Template.adminManagePlayers.onRendered(function() {

});

Template.adminManagePlayers.helpers({
    "notAdmin": function() {
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
});

Template.adminManagePlayers.events({
    "change #managePlayerType": function(e) {
        e.preventDefault();
        if ($("#managePlayerType").val() == 1) {
            $("#templRenderOnFunction").empty();
            Blaze.render(Template.adminDeletePlayer, $("#templRenderOnFunction")[0]);
        } else if ($("#managePlayerType").val() == 2) {
            $("#templRenderOnFunction").empty();
            //Blaze.render(Template.adminChangeDateOfBirth, $("#templRenderOnFunction")[0]);
            Blaze.render(Template.adminChangeDateOfBirth, $("#templRenderOnFunction")[0]);
        } else if ($("#managePlayerType").val() == 3) {
            $("#templRenderOnFunction").empty();
            //Blaze.render(Template.movePlayersAcrossClub, $("#templRenderOnFunction")[0]);
            Blaze.render(Template.adminDobForEmpty, $("#templRenderOnFunction")[0]);
        } else if ($("#managePlayerType").val() == 4) {
            $("#templRenderOnFunction").empty();
            Blaze.render(Template.adminSETGENDEROfUserT, $("#templRenderOnFunction")[0]);
            //Blaze.render(Template.adminFinancePlayers, $("#templRenderOnFunction")[0]);
        } else if ($("#managePlayerType").val() == 5) {
            $("#templRenderOnFunction").empty();
            Blaze.render(Template.moveToPastEvents, $("#templRenderOnFunction")[0]);
        } else if ($("#managePlayerType").val() == 6) {
            $("#templRenderOnFunction").empty();
            Blaze.render(Template.moveAssociation, $("#templRenderOnFunction")[0]);
        } else if ($("#managePlayerType").val() == 7) {
            $("#templRenderOnFunction").empty();
            Blaze.render(Template.updateADDCity, $("#templRenderOnFunction")[0]);
        } else if ($("#managePlayerType").val() == 8) {
            $("#templRenderOnFunction").empty();
            Blaze.render(Template.dwonloadUploadGender, $("#templRenderOnFunction")[0]);
        }else if ($("#managePlayerType").val() == 9) {
            $("#templRenderOnFunction").empty();
            Blaze.render(Template.dwonloadUploadDOB,$("#templRenderOnFunction")[0]);
        }
        else if ($("#managePlayerType").val() == 10) {
            $("#templRenderOnFunction").empty();
            Blaze.render(Template.testAPI,$("#templRenderOnFunction")[0]);
        }
        else if($("#managePlayerType").val() == 11){
            $("#templRenderOnFunction").empty();
            Blaze.render(Template.DELETSChool,$("#templRenderOnFunction")[0])
        }
        else if($("#managePlayerType").val() == 12){
            $("#templRenderOnFunction").empty();
            Blaze.render(Template.testAPICoach,$("#templRenderOnFunction")[0])
        }
        else if($("#managePlayerType").val() == 13){
            $("#templRenderOnFunction").empty();
            Blaze.render(Template.adminAPI,$("#templRenderOnFunction")[0])
        }
        else if($("#managePlayerType").val() == 14){
            $("#templRenderOnFunction").empty();
            Blaze.render(Template.adminCustomAPI,$("#templRenderOnFunction")[0])
            Router.go("/adminCustomAPI");

        }
        else if($("#managePlayerType").val() == 15){
            $("#templRenderOnFunction").empty();
            Blaze.render(Template.tournamentProjects,$("#templRenderOnFunction")[0])
            Router.go("/tournamentProjects");
        }
        else if($("#managePlayerType").val() == 16){
            $("#templRenderOnFunction").empty();
            Blaze.render(Template.adminAddCategories,$("#templRenderOnFunction")[0])
            Router.go("/adminAddCategories");
        }
        else if($("#managePlayerType").val() == 17){
            $("#templRenderOnFunction").empty();
            Blaze.render(Template.adminChangeUserDetails,$("#templRenderOnFunction")[0])
            Router.go("/adminChangeUserDetails");
        }
        else if($("#managePlayerType").val() == 18){
            $("#templRenderOnFunction").empty();
            Blaze.render(Template.getUserDetailsForGivenEmailOrPhone,$("#templRenderOnFunction")[0])
            Router.go("/getUserDetailsForGivenEmailOrPhone");
        }
        else if($("#managePlayerType").val()==19){
            Router.go("/tournamentEventOrg_FANAPP")
        }
    }
});

Template.adminDeletePlayer.onRendered(function() {
    Session.set("selectAssociationValueAdmin", undefined);
    Session.set('searchForAcademy_P', undefined);
    Session.set("addAcademyArraySess_P", undefined);
    Session.set("deleteSelectedClub_P", undefined);
    Session.set("userIdToDeleteSess", undefined);
    Session.set("DeletedLogs", undefined)
});

Template.adminDeletePlayer.onCreated(function() {
    this.subscribe("authAddress");
    //this.subscribe("users");
    this.subscribe("onlyLoggedIn");

    this.subscribe("userDetailsTT")
    this.subscribe("associationDetails")
    this.subscribe("academyDetails")
    this.subscribe("lastInsertedAffId");
    this.subscribe("timeZone")
});

Template.adminDeletePlayer.helpers({
    "notAdmin": function() {
        try {
            var emailAddress = Meteor.user().emails[0].address;
            var boolVal = false
            var auth = authAddress.find({}).fetch();
            if (auth) {
                for (var i = 0; i < auth.length; i++) {
                    if (emailAddress && emailAddress == auth[i].data) {
                        boolVal = false;
                    } else {
                        boolVal = true;
                        break;
                    }
                };
            }
            return boolVal
        } catch (e) {}
    },
    "stateAssocChecked": function() {
        try {
            return associationDetails.find({
                "role": "Association",
                associationType: "State/Province/County"
            }).fetch();
        } catch (e) {

        }
    },
    "assocSet":function(){
        if(Session.get("selectAssociationValueAdmin") != undefined)
            return true;
    },  
    searchResultsOfMNM_P: function() {
        if (Session.get("selectAssociationValueAdmin") !== undefined && Session.get('searchForAcademy_P') != undefined && Session.get('searchForAcademy_P').trim().length != 0) {
            if (Session.get('searchForAcademy_P') != undefined && Session.get('searchForAcademy_P').trim().length != 0) {
                try {
                    var reObj = new RegExp(Session.get('searchForAcademy_P'), 'i');
                    var search = "";
                    search = userDetailsTT.find({
                        userName: {
                            $regex: reObj
                        },
                        role: "Player",
                        $or: [{
                            associationId: Session.get("selectAssociationValueAdmin")
                        }, {
                            parentAssociationId: Session.get("selectAssociationValueAdmin")
                        }]
                    }).fetch();
                    if (search.length != 0) {
                        Session.set("searResults", search)
                        return search;
                    } else if (Session.get('searchForAcademy_P') && search.length == 0) {
                        var x = [];
                        data = {
                            _id: 0,
                            userName: "No Results"
                        }
                        x.push(data)
                        return x
                    }
                } catch (e) {}
            }
        } else if (Session.get('searchForAcademy_P') != undefined && Session.get('searchForAcademy_P').trim().length != 0) {
            var x = [];
            data = {
                _id: 0,
                userName: "Select state association"
            }
            x.push(data)
            return x
        }
    },
    addedAcademyArray_P: function() {
        if (Session.get("addAcademyArraySess_P")) {
            if (Session.get("addAcademyArraySess_P")) {
                return Session.get("addAcademyArraySess_P")
            }
        }
    },
    "deleteSelectedClub_P": function() {
        if (Session.get("deleteSelectedClub_P")) {
            return Session.get("deleteSelectedClub_P")
        }
    },
    "deletedLogs": function() {
        if (Session.get("DeletedLogs") != undefined) {
            return Session.get("DeletedLogs")
        }
    },
    "deletedPlayerCount": function() {
        if (Session.get("DeletedLogs") != undefined) {
            return Session.get("DeletedLogs").length;
        }
    },
    "getCityName": function() {
        var find = associationDetails.findOne({
            "userId": this.userId
        });
        if (find && find.city)
            return find.city
    }
});

Template.adminDeletePlayer.events({
    "change #selectAssociationSELECT": function(e) {
        e.preventDefault();
        $("#selectAssociationSELECT").val();

        Session.set("selectAssociationValueAdmin", $("#selectAssociationSELECT").val())
    },

    'keyup #searchUserManage_P, change #searchUserManage_P,input #searchUserManage_P,keydown #searchUserManage_P ': function(e) {
        e.preventDefault();
        Session.set('searchForAcademy_P', e.target.value);

        $("#searchUserManage_P").text("")
    },
    'focus #searchUserManage_P': function() {
        $("#searchUserManage_P").text("")
    },
    'click #downloadAssocPlayers':function(){
        if(Session.get("selectAssociationValueAdmin") != undefined)
        {
            Meteor.call("assocPlayersCSV",Session.get("selectAssociationValueAdmin"),function(error,result){
                if(result)
                {
                    if(result.status == "success" && result.data)
                    {
                        var csv = Papa.unparse({
                                data:result.data
                            });
                        var fileName = "iplayonUsers";
                        var uri = 'data:text/csv;charset=utf-8,' + escape(csv);
                        var link = document.createElement("a");    
                        link.href = uri;
                        link.style = "visibility:hidden";
                        link.download = fileName + ".csv";
    
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                    else
                    {
                        if(result.message)
                            displayMessage(result.message)
                    }


                }
                else
                {
                    displayMessage(error)
                }
            });
        }
        else
        {
            displayMessage("Please choose association")
        }

    },
    "click #deleteAssocPlayers":function(){
        if(Session.get("selectAssociationValueAdmin") != undefined)
        {
           Blaze.render(Template.confirmPasswordRemoveDBUsers, $("#confirmPasswordDeletePlayerAdminRen")[0]);
            $("#confirmPasswordRemoveDBUsers").modal({
                backdrop: 'static'
            });

        }
        else
        {
            displayMessage("Please choose association")
        }

    },
    'click div[name=addAcademyMNM_P]': function(e) {
        e.preventDefault()
        Session.set("DeletedLogs", undefined)
        if (e.target.id != 0) {
            var addAcademyArray_P = []
            var data = {
                userId: this.userId,
                _id: this.userId,
                guardianName: this.guardianName,
                address: this.address,
                userName: this.userName,
                state: this.state,
                pinCode: this.pinCode,
                city: this.city,
                phoneNumber: this.phoneNumber,
                emailAddress: this.emailAddress
            }
            if (_.findWhere(addAcademyArray_P, this) == null) {
                addAcademyArray_P.push(this);
            }
            Session.set("addAcademyArraySess_P", addAcademyArray_P);
            $("#searchUserManage_P").val("");
            Session.set("searchForAcademy_P", undefined)
            $('input:checkbox').removeAttr('checked');
            Session.set("deleteSelectedClub_P", undefined);
        }
    },
    'mouseover p[name=userName]': function(e) {
        $("#searchUserManage_P").text("")
        if (e.target.id != 0)
            $("#" + e.target.id).css("color", "green");
    },
    'mouseout p[name=userName]': function(e) {
        $("#searchUserManage_P").text("")
        if (e.target.id != 0)
            $("#" + e.target.id).css("color", "rgb(56,56,56)");
    },
    "click #addSearchedPLayers": function(e) {
        e.preventDefault()
        if (Session.get("searResults")) {
            Session.set("DeletedLogs", undefined)
            $("#searchUserManage_P").val("");
            Session.set("searchForAcademy_P", undefined)
            Session.set('addAcademyArraySess_P', Session.get("searResults"));
            $('input:checkbox').removeAttr('checked');
            Session.set("deleteSelectedClub_P", undefined);
        }
    },
    "change #checkedPlayers": function(e) {
        var num = $('#checkedPlayers:checked').size();
        if ($(e.target).is(":checked")) {
            var id = this._id
            if (num != 0)
                Session.set("deleteSelectedClub_P", num);
            else
                Session.set("deleteSelectedClub_P", undefined);
        } else if (!$(e.target).is(":checked")) {
            var id = this._id;
            if (num != 0)
                Session.set("deleteSelectedClub_P", num);
            else
                Session.set("deleteSelectedClub_P", undefined);
        }
    },
    "click #deleteSelectedPlayers": function(e) {
        var userIdToDelete = []
        $("#checkedPlayers:checked").each(function() {
            userIdToDelete.push($(this).attr("name"))
            Session.set("userIdToDeleteSess", userIdToDelete);
        });
        $("#confirmModalRedirectLog").html("Delete " + Session.get("deleteSelectedClub_P") + " Players?")
        $("#confirmDeletePlayersAdmin").modal({
            backdrop: 'static',
            keyboard: false
        })
    },
    "click #confirmModalRedirectYes": function(e) {


        $("#confirmDeletePlayersAdmin").modal('hide')

        Meteor.call("deleteUsersByAdmin", Session.get("userIdToDeleteSess"), function(e, r) {
                                if (r) {
                                    JSONToCSVConvertorUsersDeletedByAdmin(r, "", true, "deleteUsersByAdminLog")
                                    Session.set("DeletedLogs", r)
                                    Session.set('searchForAcademy_P', undefined);
                                    Session.set("addAcademyArraySess_P", undefined);
                                    Session.set("deleteSelectedClub_P", undefined);
                                    Session.set("userIdToDeleteSess", undefined);
                                } else {
                                    alert(r.reason)
                                }
                            });



       /* Blaze.render(Template.confirmPasswordDeletePlayerAdmin, $("#confirmPasswordDeletePlayerAdminRen")[0]);
        $("#confirmPasswordDeletePlayerAdmin").modal({
            backdrop: 'static'
        });*/
    },
    "click #adminDeletedLog": function(e) {
        e.preventDefault();
        JSONToCSVConvertorUsersDeletedByAdmin(Session.get("DeletedLogs"), "", true, "deleteUsersByAdminLog")
    }
});

Template.registerHelper('getCLubNAme_User', function(data) {
    try {

        var j = academyDetails.findOne({
            userId: data
        });;
        if (j != undefined) {
            if (j.clubName) {
                return j.clubName
            }
        }
    } catch (e) {}

});

Template.confirmPasswordDeletePlayerAdmin.onCreated(function() {
    //this.subscribe("users")
        this.subscribe("onlyLoggedIn");

});

Template.confirmPasswordDeletePlayerAdmin.events({
    'submit form': function(e) {
        e.preventDefault();
        $("#changePasswordSucc").html("")
    },
    'focus #oldPassword': function(e) {
        $("#changePasswordSucc").html("")
    },
});

Template.confirmPasswordDeletePlayerAdmin.onRendered(function() {
    $('#application-confirmPasswordDeletePlayerAdmin').validate({
        onkeyup: false,
        rules: {
            oldPassword: {
                required: true,
                minlength: 6,
            },
        },
        // Display only one error at a time
        showErrors: function(errorMap, errorList) {
            $("#application-confirmPasswordDeletePlayerAdmin").find("input").each(function() {
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
                            $("#confirmPasswordDeletePlayerAdmin").modal('hide');
                            Meteor.call("deleteUsersByAdmin", Session.get("userIdToDeleteSess"), function(e, r) {
                                if (r) {
                                    JSONToCSVConvertorUsersDeletedByAdmin(r, "", true, "deleteUsersByAdminLog")
                                    Session.set("DeletedLogs", r)
                                    Session.set('searchForAcademy_P', undefined);
                                    Session.set("addAcademyArraySess_P", undefined);
                                    Session.set("deleteSelectedClub_P", undefined);
                                    Session.set("userIdToDeleteSess", undefined);
                                } else {
                                    alert(r.reason)
                                }
                            });
                        } else {
                            $("#changePasswordError").html("<span class='glyphicon glyphicon-remove-sign red'></span> " + result.error.reason);
                        }
                    } catch (e) {}
                });
            } catch (e) {

            }
        }
    });
});



Template.confirmPasswordRemoveDBUsers.onCreated(function() {
    //this.subscribe("users")
        this.subscribe("onlyLoggedIn");

});

Template.confirmPasswordRemoveDBUsers.events({
    'submit form': function(e) {
        e.preventDefault();
        $("#changePasswordSucc").html("")
    },
    'focus #oldPassword': function(e) {
        $("#changePasswordSucc").html("")
    },
});

Template.confirmPasswordRemoveDBUsers.onRendered(function() {
    $('#application-confirmPasswordRemoveDBUsers').validate({
        onkeyup: false,
        rules: {
            oldPassword: {
                required: true,
                minlength: 6,
            },
        },
        // Display only one error at a time
        showErrors: function(errorMap, errorList) {
            $("#application-confirmPasswordRemoveDBUsers").find("input").each(function() {
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
                            $("#confirmPasswordRemoveDBUsers").modal('hide');
                            Meteor.call("removalAssocPlayers", Session.get("selectAssociationValueAdmin"), function(error, result) {
                                if (result) 
                                {
                                    if(result.status == "success" && result.data)
                                    {
                                        if(result.message)
                                            alert(result.message)
                                        var csv = Papa.unparse({
                                                data:result.data
                                            });

                                        var fileName = "iplayonUsers";
                                        if(result.fileName)
                                            fileName = result.fileName
                                        var uri = 'data:text/csv;charset=utf-8,' + escape(csv);
                                        var link = document.createElement("a");    
                                        link.href = uri;
                                        link.style = "visibility:hidden";
                                        link.download = fileName + ".csv";
                    
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);

                                    }   
                                    else if(result.message)
                                        alert(result.message)

                                   
                                } else {
                                    alert(error)
                                }
                            });
                        } else {
                            $("#changePasswordError").html("<span class='glyphicon glyphicon-remove-sign red'></span> " + result.error.reason);
                        }
                    } catch (e) {}
                });
            } catch (e) {

            }
        }
    });
});



function JSONToCSVConvertorUsersDeletedByAdmin(JSONData, ReportTitle, ShowLabel, filNam) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var CSV = '';
    //Set Report title in first row or line

    // CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = '"' + "Sl.No" + '",';

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {

            //Now convert each value to string and comma-seprated
            row += '"' + index + '",';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    var s = 0
    for (var i = 0; i < arrData.length; i++) {
        s = s + 1;
        var row = s + ",";
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            if (typeof arrData[i][index] == "string")
                row += '"' + arrData[i][index] + '",';
            else {
                row += arrData[i][index] + ","

            }
        }

        row = row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    //Generate a file name
    var fileName = filNam + "";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g, "_");

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

Template.adminChangeDateOfBirth.onCreated(function() {

});

Template.adminChangeDateOfBirth.onRendered(function() {

});

Template.adminChangeDateOfBirth.helpers({

});

Template.adminChangeDateOfBirth.events({
    "click #changeDatatype": function(e) {
        e.preventDefault();
        Meteor.call("adminSETStatusOfUser", function(e, r) {
                if (e) {
                    alert(e.reason)
                } else {
                    alert(r)
                }
            })
            /*Meteor.call("changeDatatypeOfPlayers",function(e,r){
            if(e){
                alert(e.reason)
            }
            else{
                alert("changed..")
                JSONToCSVConvertorUsersDeletedByAdmin(r, "", true, "changedDateOfBirth")
            }
        })*/
    }
});

Template.adminDobForEmpty.onCreated(function() {

});

Template.adminDobForEmpty.onRendered(function() {

});

Template.adminDobForEmpty.helpers({

});

Template.adminDobForEmpty.events({
    "click #changeDatatype": function(e) {
        e.preventDefault();
        Meteor.call("adminSETDOBOfUser", function(e, r) {
                if (e) {
                    alert(e.reason)
                } else {
                    alert(r)
                }
            })
            /*Meteor.call("changeDatatypeOfPlayers",function(e,r){
            if(e){
                alert(e.reason)
            }
            else{
                alert("changed..")
                JSONToCSVConvertorUsersDeletedByAdmin(r, "", true, "changedDateOfBirth")
            }
        })*/
    }
});



Template.adminSETGENDEROfUserT.onCreated(function() {

});

Template.adminSETGENDEROfUserT.onRendered(function() {

});

Template.adminSETGENDEROfUserT.helpers({

});

Template.adminSETGENDEROfUserT.events({
    "click #changeDatatype": function(e) {
        e.preventDefault();
        Meteor.call("adminSETGENDEROfUser", function(e, r) {
                if (e) {
                    alert(e.reason)
                } else {
                    alert(r)
                }
            })
            /*Meteor.call("changeDatatypeOfPlayers",function(e,r){
            if(e){
                alert(e.reason)
            }
            else{
                alert("changed..")
                JSONToCSVConvertorUsersDeletedByAdmin(r, "", true, "changedDateOfBirth")
            }
        })*/
    }
});



Template.dwonloadUploadGender.onCreated(function() {
    this.subscribe("userDetailsTT")
});

Template.dwonloadUploadGender.onRendered(function() {
    Session.set("fileHandleData",undefined)
    Session.set("logSuccessBeforeUpload", undefined)
    Session.set("playersDetailsArray",undefined)  
});

Template.dwonloadUploadGender.helpers({
    "logsError": function() {
        if (Session.get("errorLogsSession")) {
            return Session.get("errorLogsSession")
        }
    },
    "logsErrorEx": function() {
        if (Session.get("errorLogsSession")) {
            return true
        }
    },
    "logsErrorNumber": function() {
        if (Session.get("errorLogsSession")) {
            return Session.get("errorLogsSession").length
        }
    },
    "notAdmin": function() {
        try {
            var emailAddress = Meteor.user().emails[0].address;
            var boolVal = false
            var auth = authAddress.find({}).fetch();
            if (auth) {
                for (var i = 0; i < auth.length; i++) {
                    if (emailAddress && emailAddress == auth[i].data) {
                        boolVal = false;
                    } else {
                        boolVal = true;
                        break;
                    }
                };
            }
            return boolVal
        } catch (e) {}
    },
    logSuccessBeforeUpload:function(){
        if(Session.get("logSuccessBeforeUpload")==1){
            return true
        }
    },
    PlayersWithoutGender:function(){
        var find = userDetailsTT.find({gender:null}).fetch();
        if(find){
            return find.length
        }
    }
});

Template.dwonloadUploadGender.events({
    "click #changeDatatype": function(e) {
        e.preventDefault();
        try{
        Meteor.call("downloadNullGenderPlayers", function(e, r) {
            if (e) {
                alert(e.reason)
            } else {
                alert("Players count without gender:" + r.length)
                JSONTOCSVCONVERTERGENDER(r, "", true, "genderNullPlayers")
            }
        })
        }catch(e){
            alert(e)
        }
    },
    'change [name="insertPlayersADMIN1"]': function(event, template) {
        var fileHandle = event.target.files[0];
        var errorsArray = [];
        Session.set("numberOfPlayersInserted", undefined)
        Session.set("numberOfPlayersInsertedFinally", undefined)
        insertedREc = 0;
        Session.set("errorLogsSession", undefined)
        Session.set("fileHandleData", undefined)
        Session.set("logSuccessBeforeUpload", 0)

        try {
            Papa.parse(fileHandle, {
                header: true,
                keepEmptyRows: false,
                skipEmptyLines: true,
                beforeFirstChunk: function(chunk) {
                    var rows = chunk.split(/\r\n|\r|\n/);
                    var headings = rows[0].split(',');
                    var key = ["Sl.No", "_id", "userName", "userId","gender"];
                    if (_.isEqual(headings, key)) {
                        Session.set("errorsInHead", 0)
                        return chunk;
                    } else {
                        var data = {
                            line: 1,
                            message: "Unequal headers, headers should be in the following format:[Sl.No,_id,userName,userId,gender]"
                        }
                        Session.set("errorsInHead", 1)
                        errorsArray.push(data)
                        Session.set("errorLogsSession", errorsArray)
                        return false;
                    }
                },
                complete: function(fileData, file) {
                    if (Session.get("errorsInHead") == 0) {
                        Session.set("fileHandleData", fileData.data)
                        if (fileData.errors.length == 0) {
                            if (fileData.data.length == 0) {
                                var data = {
                                    line: 2,
                                    message: "data is empty"
                                }
                                errorsArray.push(data)
                                Session.set("errorLogsSession", errorsArray)
                            }
                        } else if (fileData.errors.length !== 0) {
                            for (var e = 0; e < fileData.errors.length; e++) {
                                var data = {
                                    line: "CSV PARSE ERROR",
                                    message: JSON.stringify(fileData.errors[e])
                                }
                                errorsArray.push(data)
                            }
                            Session.set("errorLogsSession", errorsArray)
                        }
                        if (fileData.errors.length == 0 && fileData.data.length != 0) {
                            for (var i = 0; i < fileData.data.length; i++) {
                                var findForEmpty1 = fileData.data[i]["Sl.No"];
                                var findForEmpty2 = fileData.data[i]._id;
                                
                                var findForEmpty3 = fileData.data[i].userName;
                                var findForEmpty4 = fileData.data[i].userId

                                var findForEmpty7 = fileData.data[i].gender


                                //find for null and empty values
                                //1
                                var linNumber = parseInt(i + 1 + 1)
                                    //3
                                if (findForEmpty3 == null || findForEmpty3 == "null" ||
                                    findForEmpty3.trim().length == 0 ||
                                    findForEmpty3 == undefined || findForEmpty3 == "undefined") {
                                    var data = {
                                        line: linNumber,
                                        message: "userName row is not valid"
                                    }
                                    errorsArray.push(data)
                                    Session.set("errorLogsSession", errorsArray)
                                }

                                //2
                                if (findForEmpty2 == null || findForEmpty2 == "null" ||
                                    findForEmpty2.trim().length == 0 ||
                                    findForEmpty2 == undefined || findForEmpty2 == 'undefined') {
                                    var data = {
                                        line: linNumber,
                                        message: "_id row is not valid"
                                    }
                                    errorsArray.push(data)
                                    Session.set("errorLogsSession", errorsArray)
                                }

                                //4
                                if (findForEmpty4 == null || findForEmpty4 == "null" ||
                                    findForEmpty4.trim().length == 0 ||
                                    findForEmpty4 == undefined || findForEmpty4 == 'undefined') {
                                    var data = {
                                        line: linNumber,
                                        message: "userId row is not valid"
                                    }
                                    errorsArray.push(data)
                                    Session.set("errorLogsSession", errorsArray)
                                }

                                //5
                               


                          
                                //7
                                if (findForEmpty7 == null || findForEmpty7 == "null" ||
                                    findForEmpty7.trim().length == 0 ||
                                    findForEmpty7 == undefined || findForEmpty7 == 'undefined') {
                                    var data = {
                                        line: linNumber,
                                        message: "gender row is not valid"
                                    }
                                    errorsArray.push(data)
                                    Session.set("errorLogsSession", errorsArray)
                                }

                               

                                if (findForEmpty4 !== null || findForEmpty4 !== "null" ||
                                    findForEmpty4.trim().length !== 0 ||
                                    findForEmpty4 !== undefined || findForEmpty4 !== 'undefined') {
                                    var findUserIDValid = userDetailsTT.findOne({"userId":findForEmpty4.trim()});
                                    if(findUserIDValid==undefined||findUserIDValid==null){
                                        var data = {
                                            line: linNumber,
                                            message: "userId is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                }
                                //10
                                if (findForEmpty7 !== null || findForEmpty7 !== "null" ||
                                    findForEmpty7.trim().length !== 0 ||
                                    findForEmpty7 !== undefined ||
                                    findForEmpty7 !== "undefined") {
                                    if (findForEmpty7.trim().toLowerCase() == "male") {
                                        if (findForEmpty7.trim() !== "Male") {
                                            var data = {
                                                line: linNumber,
                                                message: "gender is not valid, it should be Male"
                                            }
                                            errorsArray.push(data)
                                            Session.set("errorLogsSession", errorsArray)
                                        }
                                    } else if (findForEmpty7.trim().toLowerCase() == "female") {
                                        if (findForEmpty7.trim() !== "Female") {
                                            var data = {
                                                line: linNumber,
                                                message: "gender is not valid, it should be Female"
                                            }
                                            errorsArray.push(data)
                                            Session.set("errorLogsSession", errorsArray)
                                        }
                                    } else {
                                        var data = {
                                            line: linNumber,
                                            message: "gender is not valid, it should be Male or Female"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                }

                                if (i == fileData.data.length - 1 && Session.get("errorLogsSession") == undefined) {
                                    Session.set("logSuccessBeforeUpload", 1)
                                        //Do something if the end of the loop    
                                }
                            }
                        }
                    }
                }
            });
        } catch (e) {}
    },
    "click #adminUpload_button1": function(e) {
        try{
            if (Session.get("fileHandleData")) {
                if (Session.get("errorLogsSession")) {
                    alert("cannot upload, correct the errors and try again")
                } else {
                    try {
                        Session.set("logSuccessBeforeUpload", 0)
                     
                    } catch (e) {}
                    
                    var fileHandle = Session.get("fileHandleData")
                    var playersDetails = fileHandle;
                    Session.set("playersDetailsArray", playersDetails)
                    Meteor.call("updateGenderPlayers",fileHandle,function(e,r){
                        alert("Players count dob updated:" + r)
                        Session.set("fileHandleData",undefined)
                        Session.set("logSuccessBeforeUpload", undefined)
                        Session.set("playersDetailsArray",undefined)  
                    })
                }
            } else {
                alert("Browse file to upload")
            }
        }catch(e) {
        }
    },



});


function JSONTOCSVCONVERTERGENDER(JSONData, ReportTitle, ShowLabel, filNam) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var CSV = '';
    //Set Report title in first row or line

    // CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = '"' + "Sl.No" + '",';

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {

            //Now convert each value to string and comma-seprated
            row += '"' + index + '",';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    var s = 0
    for (var i = 0; i < arrData.length; i++) {
        s = s + 1;
        var row = s + ",";
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            if (typeof arrData[i][index] == "string")
                row += '"' + arrData[i][index] + '",';
            else {
                row += arrData[i][index] + ","

            }
        }

        row = row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    //Generate a file name
    var fileName = filNam + "";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g, "_");

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


Template.dwonloadUploadDOB.onCreated(function() {
    this.subscribe("userDetailsTT")
});

Template.dwonloadUploadDOB.onRendered(function() {
    Session.set("fileHandleData",undefined)
    Session.set("logSuccessBeforeUpload", undefined)
    Session.set("playersDetailsArray",undefined)
});

Template.dwonloadUploadDOB.helpers({
    "logsError": function() {
        if (Session.get("errorLogsSession")) {
            return Session.get("errorLogsSession")
        }
    },
    "logsErrorEx": function() {
        if (Session.get("errorLogsSession")) {
            return true
        }
    },
    "logsErrorNumber": function() {
        if (Session.get("errorLogsSession")) {
            return Session.get("errorLogsSession").length
        }
    },
    "notAdmin": function() {
        try {
            var emailAddress = Meteor.user().emails[0].address;
            var boolVal = false
            var auth = authAddress.find({}).fetch();
            if (auth) {
                for (var i = 0; i < auth.length; i++) {
                    if (emailAddress && emailAddress == auth[i].data) {
                        boolVal = false;
                    } else {
                        boolVal = true;
                        break;
                    }
                };
            }
            return boolVal
        } catch (e) {}
    },
    logSuccessBeforeUpload:function(){
        if(Session.get("logSuccessBeforeUpload")==1){
            return true
        }
    },
    PlayersWithoutGender:function(){
        var find = userDetailsTT.find({dateOfBirth:null}).fetch();
        if(find){
            return find.length
        }
    }
});

Template.dwonloadUploadDOB.events({
    "click #changeDatatype": function(e) {
        e.preventDefault();
        Meteor.call("downloadNullDOBPlayers", function(e, r) {
            if (e) {
                alert(e.reason)
            } else {
                alert("Players count without gender:" + r.length)
                JSONTOCSVCONVERTERGENDER(r, "", true, "genderNullPlayers")
            }
        })
    },
    'change [name="insertPlayersADMIN1"]': function(event, template) {
        var fileHandle = event.target.files[0];
        var errorsArray = [];
        Session.set("numberOfPlayersInserted", undefined)
        Session.set("numberOfPlayersInsertedFinally", undefined)
        insertedREc = 0;
        Session.set("errorLogsSession", undefined)
        Session.set("fileHandleData", undefined)
        Session.set("logSuccessBeforeUpload", 0)

        try {
            Papa.parse(fileHandle, {
                header: true,
                keepEmptyRows: false,
                skipEmptyLines: true,
                beforeFirstChunk: function(chunk) {
                    var rows = chunk.split(/\r\n|\r|\n/);
                    var headings = rows[0].split(',');
                    var key = ["Sl.No", "_id", "userName", "userId","dateOfBirth"];
                    if (_.isEqual(headings, key)) {
                        Session.set("errorsInHead", 0)
                        return chunk;
                    } else {
                        var data = {
                            line: 1,
                            message: "Unequal headers, headers should be in the following format:[Sl.No,_id,userName,userId,dateOfBirth]"
                        }
                        Session.set("errorsInHead", 1)
                        errorsArray.push(data)
                        Session.set("errorLogsSession", errorsArray)
                        return false;
                    }
                },
                complete: function(fileData, file) {
                    if (Session.get("errorsInHead") == 0) {
                        alert(JSON.stringify(fileData.data))
                        Session.set("fileHandleData", fileData.data)
                        if (fileData.errors.length == 0) {
                            if (fileData.data.length == 0) {
                                var data = {
                                    line: 2,
                                    message: "data is empty"
                                }
                                errorsArray.push(data)
                                Session.set("errorLogsSession", errorsArray)
                            }
                        } else if (fileData.errors.length !== 0) {
                            for (var e = 0; e < fileData.errors.length; e++) {
                                var data = {
                                    line: "CSV PARSE ERROR",
                                    message: JSON.stringify(fileData.errors[e])
                                }
                                errorsArray.push(data)
                            }
                            Session.set("errorLogsSession", errorsArray)
                        }
                        if (fileData.errors.length == 0 && fileData.data.length != 0) {
                            for (var i = 0; i < fileData.data.length; i++) {
                                var findForEmpty1 = fileData.data[i]["Sl.No"];
                                var findForEmpty2 = fileData.data[i]._id;
                                
                                var findForEmpty3 = fileData.data[i].userName;
                                var findForEmpty4 = fileData.data[i].userId

                                var findForEmpty7 = fileData.data[i].dateOfBirth


                                //find for null and empty values
                                //1
                                var linNumber = parseInt(i + 1 + 1)
                                    //3
                                if (findForEmpty3 == null || findForEmpty3 == "null" ||
                                    findForEmpty3.trim().length == 0 ||
                                    findForEmpty3 == undefined || findForEmpty3 == "undefined") {
                                    var data = {
                                        line: linNumber,
                                        message: "userName row is not valid"
                                    }
                                    errorsArray.push(data)
                                    Session.set("errorLogsSession", errorsArray)
                                }

                                //2
                                if (findForEmpty2 == null || findForEmpty2 == "null" ||
                                    findForEmpty2.trim().length == 0 ||
                                    findForEmpty2 == undefined || findForEmpty2 == 'undefined') {
                                    var data = {
                                        line: linNumber,
                                        message: "_id row is not valid"
                                    }
                                    errorsArray.push(data)
                                    Session.set("errorLogsSession", errorsArray)
                                }

                                //4
                                if (findForEmpty4 == null || findForEmpty4 == "null" ||
                                    findForEmpty4.trim().length == 0 ||
                                    findForEmpty4 == undefined || findForEmpty4 == 'undefined') {
                                    var data = {
                                        line: linNumber,
                                        message: "userId row is not valid"
                                    }
                                    errorsArray.push(data)
                                    Session.set("errorLogsSession", errorsArray)
                                }

                                //5
                               


                          
                                //7
                                if (findForEmpty7 == null || findForEmpty7 == "null" ||
                                    findForEmpty7.trim().length == 0 ||
                                    findForEmpty7 == undefined || findForEmpty7 == 'undefined') {
                                    var data = {
                                        line: linNumber,
                                        message: "dateOfBirth row is not valid"
                                    }
                                    errorsArray.push(data)
                                    Session.set("errorLogsSession", errorsArray)
                                }

                               

                                if (findForEmpty4 !== null || findForEmpty4 !== "null" ||
                                    findForEmpty4.trim().length !== 0 ||
                                    findForEmpty4 !== undefined || findForEmpty4 !== 'undefined') {
                                    var findUserIDValid = userDetailsTT.findOne({"userId":findForEmpty4.trim()});
                                    if(findUserIDValid==undefined||findUserIDValid==null){
                                        var data = {
                                            line: linNumber,
                                            message: "userId is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                }
                                //10
                                /*if (findForEmpty7 !== null || findForEmpty7 !== "null" ||
                                    findForEmpty7.trim().length !== 0 ||
                                    findForEmpty7 !== undefined ||
                                    findForEmpty7 !== "undefined") {
                                    if (findForEmpty7.trim().toLowerCase() == "male") {
                                        if (findForEmpty7.trim() !== "Male") {
                                            var data = {
                                                line: linNumber,
                                                message: "gender is not valid, it should be Male"
                                            }
                                            errorsArray.push(data)
                                            Session.set("errorLogsSession", errorsArray)
                                        }
                                    } else if (findForEmpty7.trim().toLowerCase() == "female") {
                                        if (findForEmpty7.trim() !== "Female") {
                                            var data = {
                                                line: linNumber,
                                                message: "gender is not valid, it should be Female"
                                            }
                                            errorsArray.push(data)
                                            Session.set("errorLogsSession", errorsArray)
                                        }
                                    } else {
                                        var data = {
                                            line: linNumber,
                                            message: "gender is not valid, it should be Male or Female"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                }*/

                                if (i == fileData.data.length - 1 && Session.get("errorLogsSession") == undefined) {
                                    Session.set("logSuccessBeforeUpload", 1)
                                        //Do something if the end of the loop    
                                }
                            }
                        }
                    }
                }
            });
        } catch (e) {}
    },
    "click #adminUpload_button1": function(e) {
        try{
            if (Session.get("fileHandleData")) {
                if (Session.get("errorLogsSession")) {
                    alert("cannot upload, correct the errors and try again")
                } else {
                    try {
                        Session.set("logSuccessBeforeUpload", 0)
                     
                    } catch (e) {}
                    
                    var fileHandle = Session.get("fileHandleData")
                    var playersDetails = fileHandle;
                    Session.set("playersDetailsArray", playersDetails)
                    Meteor.call("updateDOBPlayers",fileHandle,function(e,r){
                        if(r){
                            alert("Players count dob updated:" + r)
                            Session.set("fileHandleData",undefined)
                            Session.set("logSuccessBeforeUpload", undefined)
                            Session.set("playersDetailsArray",undefined)    
                        }
                    })
                }
            } else {
                alert("Browse file to upload")
            }
        }catch(e) {
        }
    },



});