import {
    regEm
}
from '../../../regexExp.js'

Template.adminUploadPlayersAssociation.onCreated(function() {

});

Template.adminUploadPlayersAssociation.onRendered(function() {

});

Template.adminUploadPlayersAssociation.onCreated(function() {
    this.subscribe("authAddress");
    this.subscribe("users");
    this.subscribe("academyDetails")
    this.subscribe("associationDetails")
    this.subscribe("insertedUsersCount")
    this.subscribe("lastInsertedAffId");
});
var insertedREc = 0;
Template.adminUploadPlayersAssociation.onRendered(function() {
    Session.set("acadDetails", undefined);
    Session.set("assocDetails", undefined);
    Session.set("checkedVar2", undefined);
    Session.set("selectedAssocId", undefined)
    Session.set("selectedAcadId", undefined)
    Session.set("acadDetails", undefined)
    Session.set("checkedVar1", 1);
    Session.set("checkedVar2", undefined)
    Session.set("fileHandleData", undefined)
    Session.set("selectedAcadId", undefined)
    Session.set("errorLogsSession", undefined);
    Session.set("errorsInHead", 0);
    Session.set("duplicatedPlayer", undefined)
    Session.set("playersDetailsArray", undefined)
    Session.set("playersDetailsCounter", undefined)
    Session.set("numberOfPlayersInserted", undefined)
    Session.set("numberOfPlayersInsertedFinally", undefined)
    Session.set("previousInsertedCounter", undefined)
    Session.set("NewInsertedCounter", undefined)
    Session.set("logSuccessBeforeUpload", 0)
    Session.set("checkForMailPhone", 0)
    Session.set("checkForMailPhoneCSV", 0)
});

Template.adminUploadPlayersAssociation.helpers({
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
        var checkedVar1 = Session.get("checkedVar1");
        if (checkedVar1 == 1) {
            var assocDetails = Meteor.users.find({
                role: "Association",
                associationType: "State/Province/County"
            }).fetch();
            Session.set("assocDetails", assocDetails);
            if (Session.get("assocDetails"))
                return Session.get("assocDetails");
        }
    },
    'selectAcadChecked': function() {
        var checkedVar2 = Session.get("checkedVar2");
        if (checkedVar2 == 2) {
            var acadDetails = [];
            associationDetails.find({
                role: "Association",
                associationType: "District/City"
            }).fetch().forEach(function(u, i) {
                if (u.userId !== null && u.userId !== "other" && u.userId !== undefined && u.userId !== "") {
                    if (u.parentAssociationId) {
                        if (u.parentAssociationId !== "other" && u.parentAssociationId !== null && u.parentAssociationId !== undefined && u.associationId !== "") {
                            acadDetails.push(u)
                        }
                    } else {
                        acadDetails.push(u)
                    }
                }
            });
            Session.set("acadDetails", acadDetails)
            if (Session.get("acadDetails"))
                return Session.get("acadDetails");
        }
    },
    'selectedAssocLast': function() {
        if (Session.get("selectedAssocId")) {
            var id = Session.get("selectedAssocId");
            var counterVal = lastInsertedAffId.findOne({
                "assocId": id.trim()
            });
            if (counterVal && counterVal.lastInsertedId) {
                Session.set("NewInsertedCounter", counterVal.lastInsertedId)
                return counterVal.lastInsertedId
            } else {
                Session.set("NewInsertedCounter", 0)
                return 0;
            }
        } else {
            return ""
        }
    },
    'selectedAcadLast': function() {
        try {
            if (Session.get("selectedAcadId")) {
                var id = Session.get("selectedAcadId");
                var acadDetails = associationDetails.findOne({
                    "userId": id
                }).parentAssociationId;
                if (acadDetails) {
                    var counterVal = lastInsertedAffId.findOne({
                        "assocId": acadDetails.trim()
                    });
                    if (counterVal && counterVal.lastInsertedId)
                        return counterVal.lastInsertedId
                    else if (associationDetails.findOne({
                            "userId": id
                        }).parentAssociationId) {
                        var acadDetails = associationDetails.findOne({
                            "userId": id
                        }).parentAssociationId;
                        var counterVal = lastInsertedAffId.findOne({
                            "assocId": acadDetails.trim()
                        });
                        if (counterVal && counterVal.lastInsertedId) {
                            Session.set("NewInsertedCounter", counterVal.lastInsertedId)
                            return counterVal.lastInsertedId;
                        }
                    } else {
                        Session.set("NewInsertedCounter", 0)
                        return 0
                    };
                }

            } else {
                return ""
            }
        } catch (e) {}
    },
    'selectedAcadStateNAME': function() {
        try {
            if (Session.get("selectedAcadId")) {
                var id = Session.get("selectedAcadId");
                var acadDetails = associationDetails.findOne({
                    "userId": id
                }).parentAssociationId;
                if (acadDetails) {
                    var counterVal = associationDetails.findOne({
                        "userId": acadDetails.trim()
                    });
                    if (counterVal)
                        return counterVal.associationName
                } else {
                    if (associationDetails.findOne({
                            "userId": id
                        }).associationId) {
                        var acadDetails = associationDetails.findOne({
                            "userId": id
                        }).associationId;
                        var counterVal = associationDetails.findOne({
                            "userId": acadDetails.trim()
                        });
                        if (counterVal)
                            return counterVal.associationName
                    }
                }
            } else {
                return ""
            }
        } catch (e) {}
    },
    'selectedAcadStateCITY': function() {
        try {
            if (Session.get("selectedAcadId")) {
                var id = Session.get("selectedAcadId");
                var acadDetails = associationDetails.findOne({
                    "userId": id
                }).parentAssociationId;
                if (acadDetails) {
                    var counterVal = associationDetails.findOne({
                        "userId": acadDetails.trim()
                    });
                    if (counterVal)
                        return counterVal.city
                    else return 0;
                } else {
                    if (associationDetails.findOne({
                            "userId": id
                        }).userId) {
                        var acadDetails = associationDetails.findOne({
                            "userId": id
                        }).userId;;
                        var counterVal = associationDetails.findOne({
                            "userId": acadDetails.trim()
                        });
                        if (counterVal)
                            return counterVal.city
                    }
                }
            } else {
                return ""
            }
        } catch (e) {}
    },
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
    "numberOfPlayersInsertedFinally": function() {
        if (Session.get("numberOfPlayersInsertedFinally") != undefined && Session.get("numberOfPlayersInsertedFinally") != 0) {
            var i = insertedUsersCount.findOne({
                "_id": "6dSDPs2sZgjAMKL"
            });
            if (i) {
                return i.counterValue
            }
        } else if (Session.get("numberOfPlayersInsertedFinally") != undefined && Session.get("numberOfPlayersInsertedFinally") == 0) {
            return "0"
        }
    },
    "numberOfCollecUpdated": function() {
        if (Session.get("numberOfPlayersInsertedFinally") == 0) {
            return 0
        } else {
            return 2
        }
    },
    previousInsertedCounter: function() {
        if (Session.get("previousInsertedCounter") != undefined) {
            return Session.get("previousInsertedCounter")
        }
    },
    logSuccessBeforeUpload: function() {
        if (Session.get("logSuccessBeforeUpload") == 1) {
            return true
        }
    },
    //new helpers
    getCityName: function() {
        if (Meteor.userId()) {
            var idToFindCity = this._id;
            if (idToFindCity) {
                var find = Meteor.users.findOne({
                    "_id": idToFindCity.toString()
                });
                if (find.role == "Association") {
                    var findCitOfAssoc = associationDetails.findOne({
                        "userId": idToFindCity.toString()
                    });
                    if (findCitOfAssoc && findCitOfAssoc) {
                        return findCitOfAssoc.city
                    }
                }
            }
        }
    }
});

Template.adminUploadPlayersAssociation.events({
    "change [name=selectAcademyOrASS]": function(e) {
        e.preventDefault();
        var input = $("input[type='file']");
        input.html(input.html()).val('');
        Session.set("errorLogsSession", undefined)
        Session.set("numberOfPlayersInserted", undefined)
        Session.set("numberOfPlayersInsertedFinally", undefined)
        Session.set("previousInsertedCounter", undefined)
        Session.set("NewInsertedCounter", undefined)
        Session.set("checkForMailPhone", 0)
        Session.set("checkForMailPhoneCSV", 0)

        insertedREc = 0;
        if (e.target.id == "selectAssociation") {
            Session.set("acadDetails", undefined)
            Session.set("checkedVar1", 1);
            Session.set("checkedVar2", undefined)
            Session.set("selectedAcadId", undefined)
            Session.set("fileHandleData", undefined)
        } else if (e.target.id == "selectAcademy") {
            Session.set("assocDetails", undefined)
            Session.set("checkedVar2", 2);
            Session.set("checkedVar1", undefined);
            Session.set("selectedAssocId", undefined)
            Session.set("fileHandleData", undefined)
        }
    },
    "change #selectAssociationSELECT": function(e) {
        e.preventDefault();
        Session.set("selectedAssocId", $("#selectAssociationSELECT").val())
        Session.set("selectedAcadId", undefined)
        Session.set("previousInsertedCounter", undefined)
        Session.set("NewInsertedCounter", undefined)
        Session.set("checkForMailPhone", 0)
        Session.set("checkForMailPhoneCSV", 0)

        var input = $("input[type='file']");
        input.html(input.html()).val('');
        Session.set("errorLogsSession", undefined)
        Session.set("numberOfPlayersInserted", undefined)
        Session.set("numberOfPlayersInsertedFinally", undefined)
        Session.set("fileHandleData", undefined)
    },
    "change #selectAcademySELECT": function(e) {
        e.preventDefault();
        Session.set("selectedAcadId", $("#selectAcademySELECT").val())
        Session.set("selectedAssocId", undefined)
        Session.set("previousInsertedCounter", undefined)
        Session.set("NewInsertedCounter", undefined)
        Session.set("checkForMailPhone", 0)
        Session.set("checkForMailPhoneCSV", 0)

        var input = $("input[type='file']");
        input.html(input.html()).val('');
        Session.set("errorLogsSession", undefined)
        Session.set("numberOfPlayersInserted", undefined)
        Session.set("numberOfPlayersInsertedFinally", undefined)
        Session.set("fileHandleData", undefined)
    },
    'change [name="insertPlayersADMIN1"]': function(event, template) {
        var fileHandle = event.target.files[0];
        var errorsArray = [];
        Session.set("numberOfPlayersInserted", undefined)
        Session.set("numberOfPlayersInsertedFinally", undefined)
        Session.set("checkForMailPhone", 0)
        Session.set("checkForMailPhoneCSV", 0)

        insertedREc = 0;
        Session.set("errorLogsSession", undefined)
        Session.set("fileHandleData", undefined)
        Session.set("logSuccessBeforeUpload", 0)
        insertedUsersCount.remove({
            "_id": "6dSDPs2sZgjAMKL"
        })
        if (Session.get("selectedAssocId")) {
            try {
                Papa.parse(fileHandle, {
                    header: true,
                    keepEmptyRows: false,
                    skipEmptyLines: true,
                    beforeFirstChunk: function(chunk) {
                        var rows = chunk.split(/\r\n|\r|\n/);
                        var headings = rows[0].split(',');
                        var key = ["Sl.No", "emailAddress", "userName", "guardianName", "phoneNumber", "dateOfBirth", "affiliationId", "gender", "address", "city", "pinCode", "nationalAffiliationId", "stateAssociationId", "userStatus"];
                        if (_.isEqual(headings, key)) {
                            Session.set("errorsInHead", 0)
                            return chunk;
                        } else {
                            var data = {
                                line: 1,
                                message: "Unequal headers, headers should be in the following format:[Sl.No,emailAddress,userName,guardianName,phoneNumber,dateOfBirth,affiliationId,gender,address,city,pinCode,nationalAffiliationId,stateAssociationId,userStatus]"
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
                                    fileData.data[i]["Sl.No"] = fileData.data[i]["Sl.No"].trim().replace(/\s+/g,' ')
                                    fileData.data[i].emailAddress = fileData.data[i].emailAddress.trim().replace(/\s+/g,' ');
                                    fileData.data[i].userName = fileData.data[i].userName.trim().replace(/\s+/g,' ');
                                    fileData.data[i].guardianName = fileData.data[i].guardianName.trim().replace(/\s+/g,' ');
                                    fileData.data[i].phoneNumber = fileData.data[i].phoneNumber.trim().replace(/\s+/g,' ');
                                    fileData.data[i].dateOfBirth = fileData.data[i].dateOfBirth.trim().replace(/\s+/g,' ');
                                    fileData.data[i].affiliationId = fileData.data[i].affiliationId.trim().replace(/\s+/g,' ');
                                    fileData.data[i].gender = fileData.data[i].gender.trim().replace(/\s+/g,' ');
                                    fileData.data[i].address = fileData.data[i].address.trim().replace(/\s+/g,' ');
                                    fileData.data[i].city = fileData.data[i].city.trim().replace(/\s+/g,' ');
                                    fileData.data[i].pinCode = fileData.data[i].pinCode.trim().replace(/\s+/g,' ');
                                    fileData.data[i].nationalAffiliationId = fileData.data[i].nationalAffiliationId.trim().replace(/\s+/g,' ');
                                    fileData.data[i].stateAssociationId = fileData.data[i].stateAssociationId.trim().replace(/\s+/g,' ');
                                    fileData.data[i].userStatus = fileData.data[i].userStatus.trim().replace(/\s+/g,' ');

                                    Session.set("fileHandleData", fileData.data)

                                    var findForEmptyslno = fileData.data[i]["Sl.No"];
                                    var findForEmptyemailAddress = fileData.data[i].emailAddress;
                                    var findForEmptyUserName = fileData.data[i].userName;
                                    var findForEmptyGuardianName = fileData.data[i].guardianName
                                    var findForEmptyPhoneNumber = fileData.data[i].phoneNumber
                                    var findForEmptyDateOfBirth = fileData.data[i].dateOfBirth;
                                    var findForEmptyAffiliationId = fileData.data[i].affiliationId;
                                    var findForEmptyGender = fileData.data[i].gender;
                                    var findForEmptyAddress = fileData.data[i].address;
                                    var findForEmptyCity = fileData.data[i].city;
                                    var findForEmptyPinCode = fileData.data[i].pinCode;
                                    var findForEmptynationalAffiliationId = fileData.data[i].nationalAffiliationId;
                                    var findForEmptyAssociationId = fileData.data[i].stateAssociationId;

                                    var findForStatus = fileData.data[i].userStatus
                                        //find for null and empty values
                                        //1
                                    var linNumber = parseInt(i + 1 + 1)
                                    if (findForEmptyUserName == null || findForEmptyUserName == "null" ||
                                        findForEmptyUserName.trim().length == 0 ||
                                        findForEmptyUserName == undefined || findForEmptyUserName == "undefined") {
                                        var data = {
                                            line: linNumber,
                                            message: "userName row is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //2
                                    if (findForEmptyGuardianName == null || findForEmptyGuardianName == "null" ||
                                        findForEmptyGuardianName.trim().length == 0 ||
                                        findForEmptyGuardianName == undefined || findForEmptyGuardianName == 'undefined') {
                                        var data = {
                                            line: linNumber,
                                            message: "guardianName row is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //3
                                    /*if(findForEmptyClubName==null||findForEmptyClubName=="null"||
                                       findForEmptyClubName.trim().length==0||
                                       findForEmptyClubName==undefined||
                                       findForEmptyClubName=='undefined'){
                                        var data = {
                                            line:linNumber,
                                            message:"clubName row is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession",errorsArray)
                                    }
                                    //4
                                    if(findForEmptyClubNameId==null||findForEmptyClubNameId=="null"||
                                       findForEmptyClubNameId.trim().length==0||
                                       findForEmptyClubNameId==undefined||
                                       findForEmptyClubNameId=="undefined"){
                                        var data = {
                                            line:linNumber,
                                            message:"clubNameId row is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession",errorsArray)
                                    }*/
                                    //5
                                    if (findForEmptyPhoneNumber == null || findForEmptyPhoneNumber == "null" ||
                                        findForEmptyPhoneNumber == undefined || findForEmptyPhoneNumber == "undefined") {
                                        var data = {
                                            line: linNumber,
                                            message: "phoneNumber row is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //6
                                    if (findForEmptyDateOfBirth == null || findForEmptyDateOfBirth == "null" ||
                                        findForEmptyDateOfBirth.trim().length == 0 ||
                                        findForEmptyDateOfBirth == undefined ||
                                        findForEmptyDateOfBirth == "undefined" ||
                                        moment(findForEmptyDateOfBirth, 'DD MMM YYYY', true).isValid() == false) {
                                        var data = {
                                            line: linNumber,
                                            message: "dateOfBirth row is not valid, format should be (DD MMM YYYY)"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    
                                    //7
                                    if (findForEmptyAffiliationId == null || findForEmptyAffiliationId == "null" ||
                                        findForEmptyAffiliationId == undefined ||
                                        findForEmptyAffiliationId == "undefined") {
                                        var data = {
                                            line: linNumber,
                                            message: "affiliationId row is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //8
                                    if (findForEmptyGender == null || findForEmptyGender == "null" ||
                                        findForEmptyGender.trim().length == 0 ||
                                        findForEmptyGender == undefined ||
                                        findForEmptyGender == "undefined") {
                                        var data = {
                                            line: linNumber,
                                            message: "gender row is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //9
                                    if (findForEmptyAddress == null || findForEmptyAddress == "null" ||
                                        findForEmptyAddress.trim().length == 0 ||
                                        findForEmptyAddress == undefined ||
                                        findForEmptyAddress == "undefined") {
                                        var data = {
                                            line: linNumber,
                                            message: "address row is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //10
                                    if (findForEmptyCity == null || findForEmptyCity == "null" ||
                                        findForEmptyCity.trim().length == 0 ||
                                        findForEmptyCity == undefined ||
                                        findForEmptyCity == "undefined") {
                                        var data = {
                                            line: linNumber,
                                            message: "city row is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //11
                                    if (findForEmptyPinCode == null ||
                                        findForEmptyPinCode == undefined ||
                                        findForEmptyPinCode == "null" ||
                                        findForEmptyPinCode == "undefined") {
                                        var data = {
                                            line: linNumber,
                                            message: "pinCode row is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //12
                                    if (findForEmptynationalAffiliationId == null || findForEmptynationalAffiliationId == "null" ||
                                        findForEmptynationalAffiliationId == undefined ||
                                        findForEmptynationalAffiliationId == "undefined") {
                                        var data = {
                                            line: linNumber,
                                            message: "nationalAffiliationId row is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //13
                                    if (findForEmptyslno == null || findForEmptyslno == "null" ||
                                        findForEmptyslno.trim().length == 0 ||
                                        findForEmptyslno == undefined || findForEmptyslno == "undefined") {
                                        var data = {
                                            line: linNumber,
                                            message: "Sl.No row is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //14
                                    if (findForEmptyemailAddress == null || findForEmptyemailAddress == "null" ||
                                        findForEmptyemailAddress == undefined ||
                                        findForEmptyemailAddress == "undefined") {
                                        var data = {
                                            line: linNumber,
                                            message: "emailAddress row is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //15
                                    if (findForEmptyAssociationId == null || findForEmptyAssociationId == "null" ||
                                        findForEmptyAssociationId == undefined ||
                                        findForEmptyAssociationId == "undefined" || findForEmptyAssociationId.trim().length == 0) {
                                        var data = {
                                            line: linNumber,
                                            message: "stateAssociationId row is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //validations
                                    //16
                                    if (findForEmptyPhoneNumber.trim().length && findForEmptyPhoneNumber.trim().length !== 10) {
                                        var data = {
                                            line: linNumber,
                                            message: "phoneNumber length is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //17
                                    if (findForEmptyPhoneNumber.trim().length == 10) {
                                        var patt = new RegExp("^[0-9]{1,10}$");
                                        var res = patt.test(findForEmptyPhoneNumber);
                                        if (!res) {
                                            var data = {
                                                line: linNumber,
                                                message: "phoneNumber row is not valid"
                                            }
                                            errorsArray.push(data)
                                            Session.set("errorLogsSession", errorsArray)
                                        }
                                    }
                                    //18
                                    if (findForEmptyPinCode.trim().length !== 6) {
                                        var data = {
                                            line: linNumber,
                                            message: "pinCode length is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //19
                                    if (findForEmptyPinCode.trim().length == 6) {
                                        var patt = new RegExp("^[0-9]{1,10}$");
                                        var res = patt.test(findForEmptyPinCode);
                                        if (!res) {
                                            var data = {
                                                line: linNumber,
                                                message: "pinCode row is not valid"
                                            }
                                            errorsArray.push(data)
                                            Session.set("errorLogsSession", errorsArray)
                                        }
                                    }
                                    //20
                                    if (findForEmptyGender !== null || findForEmptyGender !== "null" ||
                                        findForEmptyGender.trim().length !== 0 ||
                                        findForEmptyGender !== undefined ||
                                        findForEmptyGender !== "undefined") {
                                        if (findForEmptyGender.trim().toLowerCase() == "male") {
                                            if (findForEmptyGender.trim() !== "Male") {
                                                var data = {
                                                    line: linNumber,
                                                    message: "gender is not valid, it should be Male"
                                                }
                                                errorsArray.push(data)
                                                Session.set("errorLogsSession", errorsArray)
                                            }
                                        } else if (findForEmptyGender.trim().toLowerCase() == "female") {
                                            if (findForEmptyGender.trim() !== "Female") {
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
                                    //21
                                    if (findForEmptyAssociationId !== null && findForEmptyAssociationId !== "null" &&
                                        findForEmptyAssociationId !== undefined &&
                                        findForEmptyAssociationId !== "undefined") {
                                        if (findForEmptyAssociationId.trim() !== Session.get("selectedAssocId").trim()) {
                                            var data = {
                                                line: linNumber,
                                                message: "stateAssociationId is different from selected association"
                                            }
                                            errorsArray.push(data)
                                            Session.set("errorLogsSession", errorsArray)
                                        }
                                    }
                                    //22
                                    /*if(findForEmptyClubNameId!==null&&findForEmptyClubNameId!=="null"&&
                                       findForEmptyClubNameId.trim().length!==0&&
                                       findForEmptyClubNameId!==undefined&&
                                       findForEmptyClubNameId!=="undefined"){
                                        var clubNameDet = academyDetails.findOne({"userId":findForEmptyClubNameId.trim(),
                                            $or:[
                                                {parentAssociationId:Session.get("selectedAssocId").trim()},
                                                {associationId:Session.get("selectedAssocId").trim()}
                                                ]}
                                        )
                                        if(!clubNameDet||clubNameDet==undefined){
                                            var data = {
                                                line:linNumber,
                                                message:"clubNameId is not affiliated under selected associationId"
                                            }
                                            errorsArray.push(data)
                                            Session.set("errorLogsSession",errorsArray)
                                        }
                                    }*/
                                    //23
                                    //affiliation id validation
                                    if (findForEmptyAffiliationId !== null && findForEmptyAffiliationId !== "null" &&
                                        findForEmptyAffiliationId !== undefined &&
                                        findForEmptyAffiliationId !== "undefined" && findForEmptyAffiliationId != "other") {
                                        if (findForEmptyAffiliationId.trim().length != 0) {
                                            var affID = findForEmptyAffiliationId.substr(3, findForEmptyAffiliationId.length);
                                            if (findForEmptyAffiliationId.trim().length < 3) {
                                                var data = {
                                                    line: linNumber,
                                                    message: "affiliationId length is not valid"
                                                }


                                                errorsArray.push(data)
                                                Session.set("errorLogsSession", errorsArray)
                                            } else if (findForEmptyAffiliationId.trim().length >= 3) {
                                                var str = findForEmptyAffiliationId.trim().substr(0, 3)
                                                if (str && str.trim().length == 3) {
                                                    if (str.toLowerCase().match(/[a-z]/i)) {

                                                    } else {
                                                        var data = {
                                                            line: linNumber,
                                                            message: "affiliationId first three letters are not valid"
                                                        }
                                                        errorsArray.push(data)
                                                        Session.set("errorLogsSession", errorsArray)
                                                    }
                                                } else {
                                                    var data = {
                                                        line: linNumber,
                                                        message: "affiliationId is not valid"
                                                    }
                                                    errorsArray.push(data)
                                                    Session.set("errorLogsSession", errorsArray)
                                                }
                                            }

                                            if (affID.match(/^\d+$/)) {

                                                /*toFetchUserDetails(true,"affiliationId",findForEmptyAffiliationId,function(resf){
                                                    var validAffId =  resf
                                                    if (validAffId) {
                                                        var data = {
                                                            line: linNumber,
                                                            message: "affiliationId is repeated"
                                                        }
                                                        errorsArray.push(data)
                                                        Session.set("errorLogsSession", errorsArray)
                                                    }
                                                })*/
                                            } else if (!affID.match(/^\d+$/)) {
                                                var data = {
                                                    line: linNumber,
                                                    message: "affiliationId is not valid after 3 letters"
                                                }
                                                errorsArray.push(data)
                                                Session.set("errorLogsSession", errorsArray)
                                            }
                                        }
                                    }
                                    //24 check for both email and phone
                                    if ((findForEmptyPhoneNumber == null || findForEmptyPhoneNumber == "null" || findForEmptyPhoneNumber == undefined &&
                                            findForEmptyPhoneNumber == "undefined" || findForEmptyPhoneNumber.trim().length == 0) && (findForEmptyemailAddress == null ||
                                            findForEmptyemailAddress == "null" || findForEmptyemailAddress == undefined &&
                                            findForEmptyemailAddress == "undefined" || findForEmptyemailAddress.trim().length == 0)) {
                                        var data = {
                                            line: linNumber,
                                            message: "Email address or phone number is required"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //25 email address validation
                                    if ((findForEmptyemailAddress != null && findForEmptyemailAddress != "null" && findForEmptyPhoneNumber != undefined &&
                                            findForEmptyemailAddress != "undefined" && findForEmptyemailAddress.trim().length != 0)) {
                                        var re = /\S+@\S+\.\S+/;
                                        var re = regEm
                                        if (re.test(findForEmptyemailAddress) == false) {
                                            var data = {
                                                line: linNumber,
                                                message: "Email address is invalid"
                                            }
                                            errorsArray.push(data)
                                            Session.set("errorLogsSession", errorsArray)
                                        }
                                    }
                                    //26
                                    if (findForStatus == null || findForStatus == undefined ||
                                        findForStatus == "null" || findForStatus == "undefined" || findForStatus.trim().length == 0) {
                                        var data = {
                                            line: linNumber,
                                            message: "userStatus is invalid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //27
                                    if (findForStatus.trim().length != 0) {
                                        if (findForStatus == "Active" || findForStatus == "notApproved") {

                                        } else {
                                            var data = {
                                                line: linNumber,
                                                message: "userStatus is invalid, sholuld be Active or notApproved"
                                            }
                                            errorsArray.push(data)
                                            Session.set("errorLogsSession", errorsArray)
                                        }
                                    }
                                    if (i == fileData.data.length - 1 && Session.get("errorLogsSession") == undefined) {
                                        Session.set("logSuccessBeforeUpload", 1)
                                        Session.set("fileHandleData", fileData.data)
                                            //Do something if the end of the loop    
                                    }
                                }

                            }
                        }
                    }
                });
            } catch (e) {}
        } else {
            var input = $("input[type='file']");
            input.html(input.html()).val('');
            alert("Select State Association")
        }
    },

    'change [name="insertPlayersADMIN2"]': function(event, template) {
        var fileHandle = event.target.files[0];
        var errorsArray = [];
        Session.set("numberOfPlayersInserted", undefined)
        Session.set("numberOfPlayersInsertedFinally", undefined)
        insertedREc = 0;
        Session.set("errorLogsSession", undefined)
        Session.set("fileHandleData", undefined)
        Session.set("logSuccessBeforeUpload", 0)
        Session.set("checkForMailPhone", 0)
        Session.set("checkForMailPhoneCSV", 0)

        insertedUsersCount.remove({
            "_id": "6dSDPs2sZgjAMKL"
        })
        if (Session.get("selectedAcadId")) {
            try {
                Papa.parse(fileHandle, {
                    header: true,
                    keepEmptyRows: false,
                    skipEmptyLines: true,
                    beforeFirstChunk: function(chunk) {
                        var rows = chunk.split(/\r\n|\r|\n/);
                        var headings = rows[0].split(',');
                        var key = ["Sl.No", "emailAddress", "userName", "guardianName", "districtAssociationId", "phoneNumber", "dateOfBirth", "affiliationId", "gender", "address", "city", "pinCode", "nationalAffiliationId", "stateAssociationId", "userStatus"];
                        if (_.isEqual(headings, key)) {
                            Session.set("errorsInHead", 0)
                            return chunk;
                        } else {
                            var data = {
                                line: 1,
                                message: "Unequal headers, headers should be in the following format:[Sl.No,emailAddress,userName,guardianName,districtAssociationId,phoneNumber,dateOfBirth,affiliationId,gender,address,city,pinCode,nationalAffiliationId,stateAssociationId,userStatus]"
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
                                    fileData.data[i]["Sl.No"] = fileData.data[i]["Sl.No"].trim().replace(/\s+/g,' ')
                                    fileData.data[i].emailAddress = fileData.data[i].emailAddress.trim().replace(/\s+/g,' ');
                                    fileData.data[i].userName = fileData.data[i].userName.trim().replace(/\s+/g,' ');
                                    fileData.data[i].guardianName = fileData.data[i].guardianName.trim().replace(/\s+/g,' ');
                                    fileData.data[i].districtAssociationId = fileData.data[i].districtAssociationId.trim().replace(/\s+/g,' ');
                                    fileData.data[i].phoneNumber = fileData.data[i].phoneNumber.trim().replace(/\s+/g,' ');
                                    fileData.data[i].dateOfBirth = fileData.data[i].dateOfBirth.trim().replace(/\s+/g,' ');
                                    fileData.data[i].affiliationId = fileData.data[i].affiliationId.trim().replace(/\s+/g,' ');
                                    fileData.data[i].gender = fileData.data[i].gender.trim().replace(/\s+/g,' ');
                                    fileData.data[i].address = fileData.data[i].address.trim().replace(/\s+/g,' ');
                                    fileData.data[i].city = fileData.data[i].city.trim().replace(/\s+/g,' ');
                                    fileData.data[i].pinCode = fileData.data[i].pinCode.trim().replace(/\s+/g,' ');
                                    fileData.data[i].nationalAffiliationId = fileData.data[i].nationalAffiliationId.trim().replace(/\s+/g,' ');
                                    fileData.data[i].stateAssociationId = fileData.data[i].stateAssociationId.trim().replace(/\s+/g,' ');
                                    fileData.data[i].userStatus = fileData.data[i].userStatus.trim().replace(/\s+/g,' ');

                                    Session.set("fileHandleData", fileData.data)

                                    var findForEmptyslno = fileData.data[i]["Sl.No"];
                                    var findForEmptyemailAddress = fileData.data[i].emailAddress;
                                    var findForEmptyUserName = fileData.data[i].userName;
                                    var findForEmptyGuardianName = fileData.data[i].guardianName
                                    var findForEmptyDId = fileData.data[i].districtAssociationId;
                                    var findForEmptyPhoneNumber = fileData.data[i].phoneNumber
                                    var findForEmptyDateOfBirth = fileData.data[i].dateOfBirth;
                                    var findForEmptyAffiliationId = fileData.data[i].affiliationId;
                                    var findForEmptyGender = fileData.data[i].gender;
                                    var findForEmptyAddress = fileData.data[i].address;
                                    var findForEmptyCity = fileData.data[i].city;
                                    var findForEmptyPinCode = fileData.data[i].pinCode;
                                    var findForEmptynationalAffiliationId = fileData.data[i].nationalAffiliationId;
                                    var findForEmptyAssociationId = fileData.data[i].stateAssociationId;
                                    var findForStatus = fileData.data[i].userStatus

                                    //find for null and empty values
                                    //1
                                    var linNumber = parseInt(i + 1 + 1)
                                    if (findForEmptyUserName == null || findForEmptyUserName == "null" ||
                                        findForEmptyUserName.trim().length == 0 ||
                                        findForEmptyUserName == undefined || findForEmptyUserName == "undefined") {
                                        var data = {
                                            line: linNumber,
                                            message: "userName row is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //2
                                    if (findForEmptyGuardianName == null || findForEmptyGuardianName == "null" ||
                                        findForEmptyGuardianName.trim().length == 0 ||
                                        findForEmptyGuardianName == undefined || findForEmptyGuardianName == 'undefined') {
                                        var data = {
                                            line: linNumber,
                                            message: "guardianName row is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //3
                                    /*if(findForEmptyClubName==null||findForEmptyClubName=="null"||
                                       findForEmptyClubName.trim().length==0||
                                       findForEmptyClubName==undefined||
                                       findForEmptyClubName=='undefined'){
                                        var data = {
                                            line:linNumber,
                                            message:"clubName row is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession",errorsArray)
                                    }*/
                                    //4
                                    if (findForEmptyDId == null || findForEmptyDId == "null" ||
                                        findForEmptyDId.trim().length == 0 ||
                                        findForEmptyDId == undefined ||
                                        findForEmptyDId == "undefined") {
                                        var data = {
                                            line: linNumber,
                                            message: "districtAssociationId row is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //5
                                    if (findForEmptyPhoneNumber == null || findForEmptyPhoneNumber == "null" ||
                                        findForEmptyPhoneNumber == undefined || findForEmptyPhoneNumber == "undefined") {
                                        var data = {
                                            line: linNumber,
                                            message: "phoneNumber row is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //6
                                    if (findForEmptyDateOfBirth == null || findForEmptyDateOfBirth == "null" ||
                                        findForEmptyDateOfBirth.trim().length == 0 ||
                                        findForEmptyDateOfBirth == undefined ||
                                        findForEmptyDateOfBirth == "undefined" ||
                                        moment(findForEmptyDateOfBirth, 'DD MMM YYYY', true).isValid() == false) {
                                        var data = {
                                            line: linNumber,
                                            message: "dateOfBirth row is not valid, format should be (DD MMM YYYY)"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //7
                                    if (findForEmptyAffiliationId == null || findForEmptyAffiliationId == "null" ||
                                        findForEmptyAffiliationId == undefined ||
                                        findForEmptyAffiliationId == "undefined") {
                                        var data = {
                                            line: linNumber,
                                            message: "affiliationId row is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //8
                                    if (findForEmptyGender == null || findForEmptyGender == "null" ||
                                        findForEmptyGender.trim().length == 0 ||
                                        findForEmptyGender == undefined ||
                                        findForEmptyGender == "undefined") {
                                        var data = {
                                            line: linNumber,
                                            message: "gender row is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //9
                                    if (findForEmptyAddress == null || findForEmptyAddress == "null" ||
                                        findForEmptyAddress.trim().length == 0 ||
                                        findForEmptyAddress == undefined ||
                                        findForEmptyAddress == "undefined") {
                                        var data = {
                                            line: linNumber,
                                            message: "address row is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //10
                                    if (findForEmptyCity == null || findForEmptyCity == "null" ||
                                        findForEmptyCity.trim().length == 0 ||
                                        findForEmptyCity == undefined ||
                                        findForEmptyCity == "undefined") {
                                        var data = {
                                            line: linNumber,
                                            message: "city row is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //11
                                    if (findForEmptyPinCode == null ||
                                        findForEmptyPinCode == undefined ||
                                        findForEmptyPinCode == "null" ||
                                        findForEmptyPinCode == "undefined") {
                                        var data = {
                                            line: linNumber,
                                            message: "pinCode row is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //12
                                    if (findForEmptynationalAffiliationId == null || findForEmptynationalAffiliationId == "null" ||
                                        findForEmptynationalAffiliationId == undefined ||
                                        findForEmptynationalAffiliationId == "undefined") {
                                        var data = {
                                            line: linNumber,
                                            message: "nationalAffiliationId row is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //13
                                    if (findForEmptyslno == null || findForEmptyslno == "null" ||
                                        findForEmptyslno.trim().length == 0 ||
                                        findForEmptyslno == undefined || findForEmptyslno == "undefined") {
                                        var data = {
                                            line: linNumber,
                                            message: "Sl.No row is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //14
                                    if (findForEmptyemailAddress == null || findForEmptyemailAddress == "null" ||
                                        findForEmptyemailAddress == undefined ||
                                        findForEmptyemailAddress == "undefined") {
                                        var data = {
                                            line: linNumber,
                                            message: "emailAddress row is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //15
                                    if (findForEmptyAssociationId == null || findForEmptyAssociationId == "null" ||
                                        findForEmptyAssociationId == undefined ||
                                        findForEmptyAssociationId == "undefined" || findForEmptyAssociationId.trim().length == 0) {
                                        var data = {
                                            line: linNumber,
                                            message: "associationId row is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //validations
                                    //16
                                    if (findForEmptyPhoneNumber.trim().length && findForEmptyPhoneNumber.trim().length !== 10) {
                                        var data = {
                                            line: linNumber,
                                            message: "phoneNumber length is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //17
                                    if (findForEmptyPhoneNumber.trim().length == 10) {
                                        var patt = new RegExp("^[0-9]{1,10}$");
                                        var res = patt.test(findForEmptyPhoneNumber);
                                        if (!res) {
                                            var data = {
                                                line: linNumber,
                                                message: "phoneNumber row is not valid"
                                            }
                                            errorsArray.push(data)
                                            Session.set("errorLogsSession", errorsArray)
                                        }
                                    }
                                    //18
                                    if (findForEmptyPinCode.trim().length !== 6) {
                                        var data = {
                                            line: linNumber,
                                            message: "pinCode length is not valid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //19
                                    if (findForEmptyPinCode.trim().length == 6) {
                                        var patt = new RegExp("^[0-9]{1,10}$");
                                        var res = patt.test(findForEmptyPinCode);
                                        if (!res) {
                                            var data = {
                                                line: linNumber,
                                                message: "pinCode row is not valid"
                                            }
                                            errorsArray.push(data)
                                            Session.set("errorLogsSession", errorsArray)
                                        }
                                    }

                                    //25 email address validation
                                    if ((findForEmptyemailAddress != null && findForEmptyemailAddress != "null" && findForEmptyPhoneNumber != undefined &&
                                            findForEmptyemailAddress != "undefined" && findForEmptyemailAddress.trim().length != 0)) {
                                        var re = /\S+@\S+\.\S+/;
                                        var re = regEm
                                        if (re.test(findForEmptyemailAddress) == false) {
                                            var data = {
                                                line: linNumber,
                                                message: "Email address is invalid"
                                            }
                                            errorsArray.push(data)
                                            Session.set("errorLogsSession", errorsArray)
                                        }
                                    }
                                    //20
                                    if (findForEmptyGender !== null || findForEmptyGender !== "null" ||
                                        findForEmptyGender.trim().length !== 0 ||
                                        findForEmptyGender !== undefined ||
                                        findForEmptyGender !== "undefined") {
                                        if (findForEmptyGender.trim().toLowerCase() == "male") {
                                            if (findForEmptyGender.trim() !== "Male") {
                                                var data = {
                                                    line: linNumber,
                                                    message: "gender is not valid, it should be Male"
                                                }
                                                errorsArray.push(data)
                                                Session.set("errorLogsSession", errorsArray)
                                            }
                                        } else if (findForEmptyGender.trim().toLowerCase() == "female") {
                                            if (findForEmptyGender.trim() !== "Female") {
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
                                    //21
                                    if (findForEmptyDId !== null && findForEmptyDId !== "null" &&
                                        findForEmptyDId !== undefined &&
                                        findForEmptyDId !== "undefined") {
                                        if (findForEmptyDId.trim() !== Session.get("selectedAcadId").trim()) {
                                            var data = {
                                                line: linNumber,
                                                message: "districtAssociationId is different from selected district association"
                                            }
                                            errorsArray.push(data)
                                            Session.set("errorLogsSession", errorsArray)
                                        }
                                    }
                                    //22
                                    if (findForEmptyAssociationId !== null && findForEmptyAssociationId !== "null" &&
                                        findForEmptyAssociationId.trim().length !== 0 &&
                                        findForEmptyAssociationId !== undefined &&
                                        findForEmptyAssociationId !== "undefined") {
                                        var clubNameDet = associationDetails.findOne({
                                            "userId": Session.get("selectedAcadId").trim(),
                                            parentAssociationId: findForEmptyAssociationId.trim()
                                        })
                                        if (!clubNameDet || clubNameDet == undefined) {
                                            var data = {
                                                line: linNumber,
                                                message: "selected districtAssociationId is not affiliated under given state associationId"
                                            }
                                            errorsArray.push(data)
                                            Session.set("errorLogsSession", errorsArray)
                                        }
                                    }
                                    //23
                                    //affiliation id validation
                                    if (findForEmptyAffiliationId !== null && findForEmptyAffiliationId !== "null" &&
                                        findForEmptyAffiliationId !== undefined &&
                                        findForEmptyAffiliationId !== "undefined" && findForEmptyAffiliationId != "other") {
                                        if (findForEmptyAffiliationId.trim().length != 0) {
                                            var affID = findForEmptyAffiliationId.substr(3, findForEmptyAffiliationId.length);
                                            if (findForEmptyAffiliationId.trim().length < 3) {
                                                var data = {
                                                    line: linNumber,
                                                    message: "affiliationId length is not valid"
                                                }
                                                errorsArray.push(data)
                                                Session.set("errorLogsSession", errorsArray)
                                            } else if (findForEmptyAffiliationId.trim().length >= 3) {
                                                var str = findForEmptyAffiliationId.trim().substr(0, 3)
                                                if (str && str.trim().length == 3) {
                                                    if (str.toLowerCase().match(/[a-z]/i)) {

                                                    } else {
                                                        var data = {
                                                            line: linNumber,
                                                            message: "affiliationId first three letters are not valid"
                                                        }
                                                        errorsArray.push(data)
                                                        Session.set("errorLogsSession", errorsArray)
                                                    }
                                                } else {
                                                    var data = {
                                                        line: linNumber,
                                                        message: "affiliationId is not valid"
                                                    }
                                                    errorsArray.push(data)
                                                    Session.set("errorLogsSession", errorsArray)
                                                }
                                            }

                                            if (affID.match(/^\d+$/)) {

                                                /*toFetchUserDetails(true,"affiliationId",findForEmptyAffiliationId,function(resf){
                                                    var validAffId =  resf
                                                    if (validAffId) {
                                                        var data = {
                                                            line: linNumber,
                                                            message: "affiliationId is repeated"
                                                        }
                                                        errorsArray.push(data)
                                                        Session.set("errorLogsSession", errorsArray)
                                                    }
                                                })*/

                                            } else if (!affID.match(/^\d+$/)) {
                                                var data = {
                                                    line: linNumber,
                                                    message: "affiliationId is not valid after 3 letters"
                                                }
                                                errorsArray.push(data)
                                                Session.set("errorLogsSession", errorsArray)
                                            }
                                        }
                                    }
                                    //24 check for both email and phone
                                    if ((findForEmptyPhoneNumber == null || findForEmptyPhoneNumber == "null" || findForEmptyPhoneNumber == undefined &&
                                            findForEmptyPhoneNumber == "undefined" || findForEmptyPhoneNumber.trim().length == 0) && (findForEmptyemailAddress == null ||
                                            findForEmptyemailAddress == "null" || findForEmptyemailAddress == undefined &&
                                            findForEmptyemailAddress == "undefined" || findForEmptyemailAddress.trim().length == 0)) {
                                        var data = {
                                            line: linNumber,
                                            message: "Email address or phone number is required"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //26
                                    if (findForStatus == null || findForStatus == undefined ||
                                        findForStatus == "null" || findForStatus == "undefined" || findForStatus.trim().length == 0) {
                                        var data = {
                                            line: linNumber,
                                            message: "userStatus is invalid"
                                        }
                                        errorsArray.push(data)
                                        Session.set("errorLogsSession", errorsArray)
                                    }
                                    //27
                                    if (findForStatus.trim().length != 0) {
                                        if (findForStatus == "Active" || findForStatus == "notApproved") {

                                        } else {
                                            var data = {
                                                line: linNumber,
                                                message: "userStatus is invalid, sholuld be Active or notApproved"
                                            }
                                            errorsArray.push(data)
                                            Session.set("errorLogsSession", errorsArray)
                                        }
                                    }
                                    if (i == fileData.data.length - 1 && Session.get("errorLogsSession") == undefined) {
                                        Session.set("logSuccessBeforeUpload", 1)
                                        Session.set("fileHandleData", fileData.data)
                                            //Do something if the end of the loop    
                                    }
                                }

                            }
                        }
                    }
                });
            } catch (e) {}
        } else {
            var input = $("input[type='file']");
            input.html(input.html()).val('');
            alert("Select District Association")
        }
    },

    "click #adminUpload_button11": function(e) {
        try {
            if (Session.get("selectedAssocId")) {
                if (Session.get("fileHandleData")) {
                    if (Session.get("errorLogsSession")) {
                        alert("cannot upload, correct the errors and try again")
                    } else {
                        var err = []
                        var sres;
                        Session.set("checkForMailPhone", 1)
                        var id = Session.get("selectedAssocId").trim();
                        var lastInsertedId_Pre = 0;
                        try {
                            Session.set("logSuccessBeforeUpload", 0)
                            var acadDetails = associationDetails.findOne({
                                "userId": id
                            }).userId;
                            if (acadDetails)
                                var h = lastInsertedAffId.findOne({
                                    "assocId": acadDetails.trim()
                                })
                            if (h && h.lastInsertedId)
                                lastInsertedId_Pre = h.lastInsertedId
                        } catch (e) {}
                        Session.set("previousInsertedCounter", lastInsertedId_Pre)
                        var fileHandle = Session.get("fileHandleData")
                        var playersDetails = fileHandle;
                        Session.set("playersDetailsArray", playersDetails)
                        for (var i = 0; i < playersDetails.length; i++) {
                            var associationDetails_p = "";
                            var nationalAffiliationID = "";
                            if (playersDetails[i].nationalAffiliationId) {
                                nationalAffiliationID = playersDetails[i].nationalAffiliationId.trim()
                            }
                            var affiliationId = "";
                            if (playersDetails[i].affiliationId && playersDetails[i].affiliationId != "other") {
                                affiliationId = playersDetails[i].affiliationId.trim()
                            }
                            var clubDetails = associationDetails.findOne({
                                "userId": playersDetails[i].stateAssociationId.trim()
                            });
                            if (clubDetails) { //5
                                if (clubDetails.country == undefined || clubDetails.country == null) {
                                    clubDetails.country = ""
                                }
                                if (clubDetails.state == undefined || clubDetails.state == null) {
                                    clubDetails.state = ""
                                }

                                var data = {
                                    "emailAddress": playersDetails[i].emailAddress.trim(),
                                    "userName": playersDetails[i].userName.trim(),
                                    "guardianName": playersDetails[i].guardianName.trim(),
                                    "associationId": playersDetails[i].stateAssociationId.trim(),
                                    "phoneNumber": playersDetails[i].phoneNumber.trim(),
                                    "dateOfBirth": playersDetails[i].dateOfBirth.trim(),
                                    "gender": playersDetails[i].gender.trim(),
                                    "address": playersDetails[i].address.trim(),
                                    "city": playersDetails[i].city.trim(),
                                    "pinCode": playersDetails[i].pinCode.trim(),
                                    "affiliationId": affiliationId.trim(),
                                    "nationalAffiliationId": nationalAffiliationID.trim()
                                }

                                Meteor.call("registerValidationForUploadPlayers", data.emailAddress, 1, (i + 2), function(e, resv) {
                                    if (resv != false) {
                                        //alert(resv)
                                        var data = {
                                            line: "-",
                                            message: resv
                                        }
                                        err.push(data)
                                        Session.set("errorLogsSession", err)
                                    }
                                    if (e) {
                                        alert(e.reason)
                                    }
                                })

                                Meteor.call("registerValidationForUploadPlayers", data.phoneNumber, 2, (i + 2), function(e, resv) {
                                    if (resv != false) {
                                        var data = {
                                            line: "-",
                                            message: resv
                                        }
                                        err.push(data)
                                        Session.set("errorLogsSession", err)
                                    }
                                    if (e) {
                                        alert(e.reason)
                                    }
                                })

                                Meteor.call("affiliationIdRepeat", data.affiliationId, id,(i + 2), function(e, resv) {
                                    if (resv != undefined && resv != null && resv != false) {
                                        var data = {
                                            line: "-",
                                            message: resv
                                        }
                                        err.push(data)
                                        Session.set("errorLogsSession", err)
                                    }
                                    if (e) {
                                        alert(e.reason)
                                    }
                                })

                                var query = {
                                    "userName": {
                                        '$regex':  '^'+playersDetails[i].userName.trim()+'$' ,
                                        '$options': 'i'
                                    },
                                    "guardianName": playersDetails[i].guardianName.trim(),
                                    "gender": playersDetails[i].gender.trim(),
                                    "address": playersDetails[i].address.trim(),
                                    "city": playersDetails[i].city.trim(),
                                    "pinCode": playersDetails[i].pinCode.trim()
                                }

                                Meteor.call('fieldsRepeatedInUserDB',query,i,data, function(e, resv){
                                    if (resv != undefined && resv != null && resv.res != false) {
                                        var s = fileHandle[resv.i]
                                        s["duplicate"] = true
                                        fileHandle[resv.i] = s
                                        Session.set("fileHandleData",fileHandle)
                                    }
                                    else if (resv != undefined && resv != null && resv.res != true) {
                                        var s = fileHandle[resv.i]
                                        s["duplicate"] = false
                                        fileHandle[resv.i] = s
                                        Session.set("fileHandleData",fileHandle)
                                    }
                                    if (e) {
                                        alert(e.reason)
                                    }
                                });
                            }
                            if (i == playersDetails.length - 1) {
                                if (err.length == 0) {
                                    alert("correct errors if any , else click upload")
                                }
                            }
                        }
                    }
                } else {
                    alert("Browse file to upload")
                }
            } else {
                alert("Select State Association")
            }
        } catch (e) {
            alert(e)
        }
    },
    'click #adminUpload_button21': function(e) {
        try {
            e.preventDefault();
            if (Session.get("selectedAcadId")) {
                if (Session.get("fileHandleData")) {
                    if (Session.get("errorLogsSession")) {
                        alert("cannot upload, correct the errors and try again")
                    } else {
                        var err = []
                        var sres;
                        Session.set("checkForMailPhone", 1)
                        var id = Session.get("selectedAcadId").trim();
                        var lastInsertedId_Pre = 0;
                        try {
                            Session.set("logSuccessBeforeUpload", 0)
                            var acadDetails = associationDetails.findOne({
                                "userId": id
                            });
                            if (acadDetails) {
                                var h = lastInsertedAffId.findOne({
                                    "assocId": acadDetails.parentAssociationId.trim()
                                })
                                if (h && h.lastInsertedId)
                                    lastInsertedId_Pre = h.lastInsertedId
                            }
                        } catch (e) {
                            alert(e)
                        }
                        Session.set("previousInsertedCounter", lastInsertedId_Pre)
                        var fileHandle = Session.get("fileHandleData")
                        var playersDetails = fileHandle;
                        Session.set("playersDetailsArray", playersDetails)
                        for (var i = 0; i < playersDetails.length; i++) {
                            var associationDetails_p = "";
                            var nationalAffiliationID = "";
                            if (playersDetails[i].nationalAffiliationId) {
                                nationalAffiliationID = playersDetails[i].nationalAffiliationId.trim()
                            }
                            var affiliationId = "";
                            if (playersDetails[i].affiliationId && playersDetails[i].affiliationId != "other") {
                                affiliationId = playersDetails[i].affiliationId.trim()
                            }
                            if (playersDetails[i].phoneNumber == undefined || playersDetails[i].phoneNumber == null) {
                                playersDetails[i].phoneNumber = ""
                            }

                            var clubDetails = associationDetails.findOne({
                                "userId": playersDetails[i].districtAssociationId.trim()
                            });
                            if (clubDetails) { //1
                                if (clubDetails.country == undefined || clubDetails.country == null) {
                                    clubDetails.country = ""
                                }
                                if (clubDetails.state == undefined || clubDetails.state == null) {
                                    clubDetails.state = ""
                                }

                                var data = {
                                    "interestedDomainName": [""],
                                    "interestedProjectName": [""],
                                    "interestedSubDomain1Name": [""],
                                    "interestedSubDomain2Name": [""],
                                    "role": "Player",
                                    "emailAddress": playersDetails[i].emailAddress.trim(),
                                    "userName": playersDetails[i].userName.trim(),
                                    "guardianName": playersDetails[i].guardianName.trim(),
                                    "associationId": playersDetails[i].districtAssociationId.trim(),
                                    "phoneNumber": playersDetails[i].phoneNumber.trim(),
                                    "state": clubDetails.state.trim(),
                                    "dateOfBirth": playersDetails[i].dateOfBirth.trim(),
                                    "gender": playersDetails[i].gender.trim(),
                                    "country": clubDetails.country.trim(),
                                    "address": playersDetails[i].address.trim(),
                                    "city": playersDetails[i].city.trim(),
                                    "pinCode": playersDetails[i].pinCode.trim(),
                                    "affiliationId": affiliationId.trim(),
                                    "statusOfUser": "Active",
                                    "userStatus": playersDetails[i].userStatus,
                                    "nationalAffiliationId": nationalAffiliationID.trim()
                                }

                                Meteor.call("registerValidationForUploadPlayers", data.emailAddress, 1, (i + 2), function(e, resv) {
                                    if (resv != false) {
                                        //alert(resv)
                                        var data = {
                                            line: "-",
                                            message: resv
                                        }
                                        err.push(data)
                                        Session.set("errorLogsSession", err)
                                    }
                                    if (e) {
                                        alert(e.reason)
                                    }
                                })

                                Meteor.call("registerValidationForUploadPlayers", data.phoneNumber, 2, (i + 2), function(e, resv) {
                                    if (resv != false) {
                                        var data = {
                                            line: "-",
                                            message: resv
                                        }
                                        err.push(data)
                                        Session.set("errorLogsSession", err)
                                    }
                                    if (e) {
                                        alert(e.reason)
                                    }
                                })

                                Meteor.call("affiliationIdRepeat", data.affiliationId,acadDetails.parentAssociationId, (i + 2), function(e, resv) {
                                    if (resv != undefined && resv != null && resv != false) {
                                        var data = {
                                            line: "-",
                                            message: resv
                                        }
                                        err.push(data)
                                        Session.set("errorLogsSession", err)
                                    }
                                    if (e) {
                                        alert(e.reason)
                                    }
                                })

                                var query = {
                                    "userName": {
                                        '$regex':  '^'+playersDetails[i].userName.trim()+'$' ,
                                        '$options': 'i'
                                    },
                                    "guardianName": playersDetails[i].guardianName.trim(),
                                    "gender": playersDetails[i].gender.trim(),
                                    "address": playersDetails[i].address.trim(),
                                    "city": playersDetails[i].city.trim(),
                                    "pinCode": playersDetails[i].pinCode.trim()
                                }

                                Meteor.call('fieldsRepeatedInUserDB', query,i,data, function(e, resv){
                                    if (resv != undefined && resv != null && resv.res != false) {
                                        var s = fileHandle[resv.i]
                                        s["duplicate"] = true
                                        fileHandle[resv.i] = s
                                        Session.set("fileHandleData",fileHandle)
                                    }
                                    else if (resv != undefined && resv != null && resv.res != true) {
                                        var s = fileHandle[resv.i]
                                        s["duplicate"] = false
                                        fileHandle[resv.i] = s
                                        Session.set("fileHandleData",fileHandle)
                                    }
                                    if (e) {
                                        alert(e.reason)
                                    }
                                });
                            }
                            if (i == playersDetails.length - 1) {
                                if (err.length == 0) {
                                    alert("correct errors if any , else click upload")
                                }
                            }
                        }
                    }
                } else {
                    alert("Browse file to upload")
                }
            } else {
                alert("Select District Association")
            }
        } catch (e) {
            alert(e)
        }
    },
    'click #checkPhoneMailRepeat': function(e) {
        //phone repeated
        //email repeated
        try {
            e.preventDefault();
            if (Session.get("selectedAssocId")) {
                if (Session.get("fileHandleData")) {
                    if (Session.get("errorLogsSession")) {
                        alert("cannot upload, correct the errors and try again")
                    } else {
                        var err = []
                        var sres;

                        Session.set("checkForMailPhoneCSV", 1)
                        var id = Session.get("selectedAssocId").trim();
                        var lastInsertedId_Pre = 0;

                        Session.set("previousInsertedCounter", lastInsertedId_Pre)
                        var fileHandle = Session.get("fileHandleData")
                        var playersDetails = fileHandle;
                        Session.set("playersDetailsArray", playersDetails)

                        var dupArr = [];
                        var groupedByCount = _.countBy(playersDetails, function(item) {
                            return item.phoneNumber;
                        });

                        var dupArr2 = []
                        var groupedByCount2 = _.countBy(playersDetails, function(item) {
                            return item.emailAddress.trim().toLowerCase();
                        });

                        var dupArr3 = []
                        var groupedByCount3 = _.countBy(playersDetails, function(item) {
                            return item.affiliationId.trim().toLowerCase();
                        });

                        var dupArr4 = []
                        var groupedByCount4 = _.countBy(playersDetails, function(item) {
                            return item.userName.trim().toLowerCase();
                        });


                        for (var emailAddress in groupedByCount2) {
                            if (groupedByCount2[emailAddress] > 1 && emailAddress.trim().length != 0) {
                                 dupArr2.push(emailAddress.toUpperCase());
                            }
                        };


                        for (var affiliationId in groupedByCount3) {
                            if (groupedByCount3[affiliationId] > 1 && affiliationId.trim().length != 0) {
                                dupArr3.push(affiliationId);
                            }
                        };

                        for (var phoneNumber in groupedByCount) {
                            if (groupedByCount[phoneNumber] > 1 && phoneNumber.trim().length != 0) {
                                dupArr.push(phoneNumber);
                            }
                        };

                        for (var userName in groupedByCount4) {
                            if (groupedByCount4[userName] > 1 && userName.trim().length != 0) {

                                filter = function (playersDetails, userName) {
                                    return _.filter(playersDetails, function(obj){ return obj["userName"].match('^'+userName.trim()+'$');});
                                };
                                dupArr4.push(userName.toUpperCase());
                                /*_.where(playersDetails, {
                                    userName: {
                                        '$regex':  '^'+userName.trim()+'$' ,
                                        '$options': 'i'
                                    }
                                }).map(function(item) {
                                    dupArr4.push(item);
                                });*/
                            }
                        };
                        if (dupArr.length != 0) {
                            var data = {
                                line: "repeated phone numbers",
                                message: JSON.stringify(dupArr)
                            }
                            err.push(data)
                            Session.set("errorLogsSession", err)
                        }
                        if (dupArr2.length != 0) {
                            var data = {
                                line: "repeated emailAddress",
                                message: JSON.stringify(dupArr2)
                            }
                            err.push(data)
                            Session.set("errorLogsSession", err)
                        } 
                        if (dupArr3.length != 0) {
                            var data = {
                                line: "repeated affiliationId",
                                message: JSON.stringify(dupArr3)
                            }
                            err.push(data)
                            Session.set("errorLogsSession", err)
                        }
                        if (dupArr4.length != 0) {
                            var data = {
                                line: "repeated userName",
                                message: JSON.stringify(dupArr4)
                            }
                            err.push(data)
                            Session.set("errorLogsSession", err)
                        }
                        else {
                            alert("correct errors if any , else click upload")
                        }
                    }
                } else {
                    alert("Browse file to upload")
                }
            } else {
                alert("Select State Association")
            }
        } catch (e) {
            alert(e)
        }
    },
    'click #checkPhoneMailRepeat11': function(e) {
        //phone repeated
        //email repeated
        try {
            e.preventDefault();
            if (Session.get("selectedAcadId")) {
                if (Session.get("fileHandleData")) {
                    if (Session.get("errorLogsSession")) {
                        alert("cannot upload, correct the errors and try again")
                    } else {
                        var err = []
                        var sres;

                        Session.set("checkForMailPhoneCSV", 1)
                        var id = Session.get("selectedAcadId").trim();
                        var lastInsertedId_Pre = 0;

                        Session.set("previousInsertedCounter", lastInsertedId_Pre)
                        var fileHandle = Session.get("fileHandleData")
                        var playersDetails = fileHandle;
                        Session.set("playersDetailsArray", playersDetails)

                        var dupArr = [];
                        var groupedByCount = _.countBy(playersDetails, function(item) {
                            return item.phoneNumber;
                        });

                        var dupArr2 = []
                        var groupedByCount2 = _.countBy(playersDetails, function(item) {
                            return item.emailAddress.trim().toLowerCase();
                        });

                        var dupArr3 = []
                        var groupedByCount3 = _.countBy(playersDetails, function(item) {
                            return item.affiliationId.trim().toLowerCase();
                        });

                        var dupArr4 = []
                        var groupedByCount4 = _.countBy(playersDetails, function(item) {
                            return item.userName.trim().toLowerCase();
                        });


                        for (var emailAddress in groupedByCount2) {
                            if (groupedByCount2[emailAddress] > 1 && emailAddress.trim().length != 0) {
                                dupArr2.push(emailAddress.toUpperCase());
                            }
                        };


                        for (var affiliationId in groupedByCount3) {
                            if (groupedByCount3[affiliationId] > 1 && affiliationId.trim().length != 0) {
                                dupArr3.push(affiliationId);
                            }
                        };

                        for (var phoneNumber in groupedByCount) {
                            if (groupedByCount[phoneNumber] > 1 && phoneNumber.trim().length != 0) {
                                dupArr.push(phoneNumber);
                            }
                        };

                        for (var userName in groupedByCount4) {
                            if (groupedByCount4[userName] > 1 && userName.trim().length != 0) {
                                dupArr4.push(userName.toUpperCase());
                            }
                        };

                        if (dupArr.length != 0) {
                            var data = {
                                line: "repeated phone numbers",
                                message: JSON.stringify(dupArr)
                            }
                            err.push(data)
                            Session.set("errorLogsSession", err)
                        }
                        if (dupArr2.length != 0) {
                            var data = {
                                line: "repeated emailAddress",
                                message: JSON.stringify(dupArr2)
                            }
                            err.push(data)
                            Session.set("errorLogsSession", err)
                        } 
                        if (dupArr3.length != 0) {
                            var data = {
                                line: "repeated affiliationId",
                                message: JSON.stringify(dupArr3)
                            }
                            err.push(data)
                            Session.set("errorLogsSession", err)
                        }
                        if (dupArr4.length != 0) {
                            var data = {
                                line: "repeated userName",
                                message: JSON.stringify(dupArr4)
                            }
                            err.push(data)
                            Session.set("errorLogsSession", err)
                        }
                        else {
                            alert("correct errors if any , else click upload")
                        }
                    }
                } else {
                    alert("Browse file to upload")
                }
            } else {
                alert("Select District Association")
            }
        } catch (e) {
            alert(e)
        }
    },
    "click #adminUpload_button1": function(e) {
        if (Session.get("selectedAssocId")) {
            if (Session.get("fileHandleData")) {
                if (Session.get("errorLogsSession")) {
                    alert("cannot upload, correct the errors and try again")
                } else if (Session.get("checkForMailPhone") != 1) {
                    alert("please click Check Before Upload button to check for duplicate phone or emails")
                } else if (Session.get("checkForMailPhoneCSV") != 1) {
                    alert("please click Check Before Upload CSV button to check for duplicate phone or emails in csv file")
                } else {
                    var id = Session.get("selectedAssocId").trim();
                    var lastInsertedId_Pre = 0;
                    try {
                        Session.set("logSuccessBeforeUpload", 0)
                        var acadDetails = associationDetails.findOne({
                            "userId": id
                        }).userId;
                        if (acadDetails)
                            var h = lastInsertedAffId.findOne({
                                "assocId": acadDetails.trim()
                            })
                        if (h && h.lastInsertedId)
                            lastInsertedId_Pre = h.lastInsertedId
                    } catch (e) {}
                    Session.set("previousInsertedCounter", lastInsertedId_Pre)
                    var fileHandle = Session.get("fileHandleData")
                    var playersDetails = fileHandle;
                    Session.set("playersDetailsArray", playersDetails)
                    for (var i = 0; i < playersDetails.length; i++) {
                        var associationDetails_p = "";
                        var nationalAffiliationID = "";
                        if (playersDetails[i].nationalAffiliationId) {
                            nationalAffiliationID = playersDetails[i].nationalAffiliationId.trim()
                        }
                        var affiliationId = "";
                        if (playersDetails[i].affiliationId && playersDetails[i].affiliationId != "other") {
                            affiliationId = playersDetails[i].affiliationId.trim()
                        }
                        var clubDetails = associationDetails.findOne({
                            "userId": playersDetails[i].stateAssociationId.trim()
                        });
                        if (clubDetails) { //5
                            if (clubDetails.country == undefined || clubDetails.country == null) {
                                clubDetails.country = ""
                            }
                            if (clubDetails.state == undefined || clubDetails.state == null) {
                                clubDetails.state = ""
                            }

                            var data = {
                                "emailAddress": playersDetails[i].emailAddress.trim(),
                                "userName": playersDetails[i].userName.trim(),
                                "guardianName": playersDetails[i].guardianName.trim(),
                                "associationId": playersDetails[i].stateAssociationId.trim(),
                                "phoneNumber": playersDetails[i].phoneNumber.trim(),
                                "dateOfBirth": playersDetails[i].dateOfBirth.trim(),
                                "gender": playersDetails[i].gender.trim(),
                                "address": playersDetails[i].address.trim(),
                                "city": playersDetails[i].city.trim(),
                                "pinCode": playersDetails[i].pinCode.trim(),
                                "affiliationId": affiliationId.trim(),
                                "userStatus":playersDetails[i].userStatus,
                                "nationalAffiliationId": nationalAffiliationID.trim()
                            }

                            var findDuplicate = playersDetails[i].duplicate

                            if (findDuplicate) {
                                $("#inserted").html("");
                                Session.set("duplicatedPlayer", playersDetails[i]);
                                Session.set("playersDetailsCounter", i)
                                Blaze.render(Template.confirmInsertPlayerSA, $("#confirmInsertPlayerRender")[0]);
                                $("#confirmInsertPlayerSA").modal({
                                    backdrop: 'static',
                                    keyboard: false
                                });
                                var input = $("input[type='file']");
                                input.html(input.html()).val('');
                                break;
                            } else {
                                Meteor.call("csvUploadStateAndAcademy", data, Session.get("selectedAssocId"), function(e, res) {
                                    if (e) {} else {
                                        insertedREc = parseInt(insertedREc + 1);
                                        Session.set("numberOfPlayersInserted", insertedREc)
                                    }
                                });
                            }
                        }
                        if (i == playersDetails.length - 1) {
                            alert("Done")
                            Session.set("numberOfPlayersInsertedFinally", Session.get("numberOfPlayersInserted"))
                                //Do something if the end of the loop    
                        }
                    }
                }
            } else {
                alert("Browse file to upload")
            }
        } else {
            alert("Select State Association")
        }
    },
    'click #adminUpload_button2': function(e) {
        e.preventDefault();
        if (Session.get("selectedAcadId")) {
            if (Session.get("fileHandleData")) {
                if (Session.get("errorLogsSession")) {
                    alert("cannot upload, correct the errors and try again")
                } else if (Session.get("checkForMailPhone") != 1) {
                    alert("please click Check Before Upload button to check for duplicate phone or emails")
                } else if (Session.get("checkForMailPhoneCSV") != 1) {
                    alert("please click Check Before Upload CSV button to check for duplicate phone or emails in csv file")
                } else {
                    var id = Session.get("selectedAcadId").trim();
                    var lastInsertedId_Pre = 0;
                    try {
                        Session.set("logSuccessBeforeUpload", 0)
                        var acadDetails = associationDetails.findOne({
                            "userId": id
                        });
                        if (acadDetails) {
                            var h = lastInsertedAffId.findOne({
                                "assocId": acadDetails.parentAssociationId.trim()
                            })
                            if (h && h.lastInsertedId)
                                lastInsertedId_Pre = h.lastInsertedId
                        }
                    } catch (e) {}
                    Session.set("previousInsertedCounter", lastInsertedId_Pre)
                    var fileHandle = Session.get("fileHandleData")
                    var playersDetails = fileHandle;
                    Session.set("playersDetailsArray", playersDetails)
                    for (var i = 0; i < playersDetails.length; i++) {
                        var associationDetails_p = "";
                        var nationalAffiliationID = "";
                        if (playersDetails[i].nationalAffiliationId) {
                            nationalAffiliationID = playersDetails[i].nationalAffiliationId.trim()
                        }
                        var affiliationId = "";
                        if (playersDetails[i].affiliationId && playersDetails[i].affiliationId != "other") {
                            affiliationId = playersDetails[i].affiliationId.trim()
                        }
                        if(playersDetails[i].phoneNumber == undefined || playersDetails[i].phoneNumber == null){
                            playersDetails[i].phoneNumber = ""
                        }

                        var clubDetails = associationDetails.findOne({
                            "userId": playersDetails[i].districtAssociationId.trim()
                        });
                        if (clubDetails) { //1
                            if (clubDetails.country == undefined || clubDetails.country == null) {
                                clubDetails.country = ""
                            }
                            if (clubDetails.state == undefined || clubDetails.state == null) {
                                clubDetails.state = ""
                            }

                            var data = {
                                "interestedDomainName": [""],
                                "interestedProjectName": [""],
                                "interestedSubDomain1Name": [""],
                                "interestedSubDomain2Name": [""],
                                "role": "Player",
                                "emailAddress": playersDetails[i].emailAddress.trim(),
                                "userName": playersDetails[i].userName.trim(),
                                "guardianName": playersDetails[i].guardianName.trim(),
                                "associationId": playersDetails[i].districtAssociationId.trim(),
                                "phoneNumber": playersDetails[i].phoneNumber.trim(),
                                "state": clubDetails.state.trim(),
                                "dateOfBirth": playersDetails[i].dateOfBirth.trim(),
                                "gender": playersDetails[i].gender.trim(),
                                "country": clubDetails.country.trim(),
                                "address": playersDetails[i].address.trim(),
                                "city": playersDetails[i].city.trim(),
                                "pinCode": playersDetails[i].pinCode.trim(),
                                "affiliationId": affiliationId.trim(),
                                "statusOfUser": "Active",
                                "userStatus":playersDetails[i].userStatus,
                                "nationalAffiliationId": nationalAffiliationID.trim()
                            }

                            var findDuplicate = playersDetails[i].duplicate

                            if (findDuplicate) {
                                $("#inserted").html("");
                                Session.set("selectedAssocId", Session.get("selectedAcadId"))
                                Session.set("duplicatedPlayer", playersDetails[i]);
                                Session.set("playersDetailsCounter", i)
                                Blaze.render(Template.confirmInsertPlayerDA, $("#confirmInsertPlayerRender")[0]);
                                $("#confirmInsertPlayerDA").modal({
                                    backdrop: 'static',
                                    keyboard: false
                                });
                                var input = $("input[type='file']");
                                input.html(input.html()).val('');
                                break;
                                
                            } else {
                                Meteor.call("csvUploadStateAndAcademy", data, Session.get("selectedAcadId"), function(e, res) {
                                    if (e) {
                                        alert(e)
                                    } else {
                                        insertedREc = parseInt(insertedREc + 1);
                                        Session.set("numberOfPlayersInserted", insertedREc)
                                    }
                                });
                            }
                        }
                        if (i == playersDetails.length - 1) {
                            alert("Done")
                            Session.set("numberOfPlayersInsertedFinally", Session.get("numberOfPlayersInserted"))
                                //Do something if the end of the loop    
                        }
                    }
                }
            } else {
                alert("Browse file to upload")
            }
        } else {
            alert("Select District Association")
        }
    },
    'click #downloadErrorLogs': function(e) {
        e.preventDefault();
        var fileName = "UploadErrors";
        var TXT = 'Cannot Upload, correct the following errors and try again' + '\r\n';
        var errors = Session.get("errorLogsSession")
        for (var key in errors) {
            if (errors.hasOwnProperty(key)) {
                // here you have access to
                var MNGR_NAME = errors[key].line + '\r\n';
                var MGR_ID = errors[key].message + '\r\n';
                TXT += "Line Number: " + errors[key].line + '\r\n' + "Error: " + errors[key].message + '\r\n'
            }
        }
        //this will remove the blank-spaces from the title and replace it with an underscore
        fileName += "".replace(/ /g, "_");

        //Initialize file format you want csv or xls
        var uri = 'data:text;charset=utf-8,' + escape(TXT);

        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension    

        //this trick will generate a temp <a /> tag
        var link = document.createElement("a");
        link.href = uri;

        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName + ".txt";

        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    "click #adminInserted_2": function(e) {
        e.preventDefault();
        var fileName = "UploadSuccess";
        var TXT = '';
        var success = 0
        var i = insertedUsersCount.findOne({
            "_id": "6dSDPs2sZgjAMKL"
        });
        if (i) {
            success = i.counterValue
        }
        var Collectionss = 0;
        if (success != 0) {
            Collectionss = 2;
        }
        var id, seleType;
        if (Session.get("selectedAssocId")) {
            id = Session.get("selectedAssocId").trim();
            seleType = "State Association"
        } else if (Session.get("selectedAcadId")) {
            id = Session.get("selectedAcadId").trim();
            seleType = "District Association";
            try {
                var acadDetails = associationDetails.findOne({
                    "userId": id
                });
                if (acadDetails) {
                    var h = lastInsertedAffId.findOne({
                        "assocId": acadDetails.parentAssociationId.trim()
                    }).lastInsertedId
                    if (h && h.lastInsertedId) {
                        lastInsertedId_Pre = h.lastInsertedId
                        Session.set("NewInsertedCounter", lastInsertedId_Pre)
                    }
                }
            } catch (e) {}
        }

        TXT += "Type of upload selected: " + seleType + '\r\n' + "Number of Players inserted: " + success + '\r\n' + "Number of Collection Updated:" + Collectionss + '\r\n' +
            "Previous value of affiliation Id counter: " + Session.get("previousInsertedCounter") + '\r\n' +
            "Current value of affiliation Id counter: " + Session.get("NewInsertedCounter")

        //this will remove the blank-spaces from the title and replace it with an underscore
        fileName += "".replace(/ /g, "_");

        //Initialize file format you want csv or xls
        var uri = 'data:text;charset=utf-8,' + escape(TXT);

        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension    

        //this trick will generate a temp <a /> tag
        var link = document.createElement("a");
        link.href = uri;

        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName + ".txt";

        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    "click #adminDownloadCSV_button2": function(e) {
        e.preventDefault();
        if (Session.get("selectedAcadId")) {
            var arrayToUp = []
            var sportID = associationDetails.findOne({
                userId: Session.get("selectedAcadId")
            })
            if(sportID && sportID.interestedProjectName && sportID.interestedProjectName.length != 0){
                sportID = sportID.interestedProjectName[0]

                var query1 = {
                    role: "Player",
                    associationId: Session.get("selectedAcadId")
                }

                var fields = {
                    "emailAddress": 1,
                    "userName": 1,
                    "guardianName": 1,
                    "clubName": 1,
                    "clubNameId": 1,
                    "phoneNumber": 1,
                    "associationId": 1,
                    "state": 1,
                    "dateOfBirth": 1,
                    "gender": 1,
                    "country": 1,
                    "address": 1,
                    "city": 1,
                    "pinCode": 1,
                    "affiliationId": 1,
                    "nationalAffiliationId": 1,
                    "userId": 1,
                    "affiliatedTo": 1,
                    "statusOfUser": 1,
                }

                Meteor.call("downloadUsersUploaded",sportID,query1,fields,function(e,res){
                    if(res){
                        var arrayToDown = res
                        alert("Number of players:" + arrayToDown.length)

                        if (arrayToDown.length != 0) {
                            _.each(arrayToDown, function(user) {
                                //if (user.affiliationId !== undefined && user.affiliationId !== null && user.affiliationId.trim().length != 0 && user.affiliationId !== undefined) {
                                if (user.clubNameId == undefined || user.clubNameId == null) {
                                    user.clubNameId = "other"
                                }
                                if (user.address == undefined || user.address == null) {
                                    user.address = ""
                                }
                                if (user.emailAddress == undefined || user.emailAddress == null) {
                                    user.emailAddress = ""
                                }
                                if (user.phoneNumber == undefined || user.phoneNumber == null) {
                                    user.phoneNumber = ""
                                }
                                if (user.dateOfBirth == undefined || user.dateOfBirth == null) {
                                    user.dateOfBirth = ""
                                } else if (user.dateOfBirth !== undefined && user.dateOfBirth !== null && user.dateOfBirth.length != 0) {
                                    user.dateOfBirth = moment(new Date(user.dateOfBirth)).format("YYYY MMM DD")
                                }
                                if (user.clubName == undefined || user.clubName == null || user.clubName.trim().length == 0) {
                                    var j = academyDetails.findOne({
                                        "userId": user.clubNameId
                                    })
                                    if (j)
                                        user.clubName = j.clubName;
                                    else {
                                        user.clubName = "other"
                                    }
                                }
                                if (user.city == undefined || user.city == null) {
                                    user.city = " ";
                                }
                                if (user.userName == undefined || user.userName == null) {
                                    user.userName = " ";
                                }
                                if (user.gender == undefined || user.gender == null) {
                                    user.gender = " ";
                                }
                                if (user.pinCode == undefined || user.pinCode == null) {
                                    user.pinCode = " ";
                                }
                                if (user.userId == undefined || user.userId == null) {
                                    user.userId = " ";
                                }
                                if (user.address == undefined || user.address == null) {
                                    user.address = " ";
                                }
                                if (user.guardianName == undefined || user.guardianName == null) {
                                    user.guardianName = " ";
                                }
                                var data = {
                                    "emailAddress": user.emailAddress.trim(),
                                    "userName": user.userName.toUpperCase().trim(),
                                    "guardianName": user.guardianName.toUpperCase().trim(),
                                    "clubName": user.clubName.toUpperCase().trim(),
                                    "clubNameId": user.clubNameId.trim(),
                                    "phoneNumber": user.phoneNumber.trim(),
                                    "dateOfBirth": user.dateOfBirth,
                                    "gender": user.gender.trim(),
                                    "address": user.address.toUpperCase().trim(),
                                    "city": user.city.toUpperCase().trim(),
                                    "pinCode": user.pinCode.trim(),
                                    "userId": user.userId,
                                    "userStatus": user.userStatus,
                                    "affiliatedTo": user.affiliatedTo,
                                    "statusOfUser": user.statusOfUser
                                }
                                if (user.affiliationId == null || user.affiliationId == undefined || user.affiliationId.trim().length == 0) {
                                    data["affiliationId"] = ""
                                } else {
                                    data["affiliationId"] = user.affiliationId
                                }

                                if (user.nationalAffiliationId == null || user.nationalAffiliationId == undefined) {
                                    data["nationalAffiliationId"] = ""
                                } else {
                                    data["nationalAffiliationId"] = user.nationalAffiliationId.trim()
                                }
                                if (user.associationId == null || user.associationId == undefined) {
                                    data["associationId"] = "other"
                                } else {
                                    data["associationId"] = user.associationId.trim()
                                }
                                arrayToUp.push(data)
                                    //}
                            });
                        }
                        //d
                        JSONToCSVConvertorUsers(arrayToUp, "", true, "iplayonusers")
                    }
                    else if(e){
                        alert(e)
                    }
                })
            }
            else{
                alert("sport is not selected by this association")
            }
            
            
            
        } else {
            alert("Select District Association")
        }
    },
    "click #adminDownloadCSV_button1": function(e) {
        e.preventDefault();
        if (Session.get("selectedAssocId")) {
            var arrayToUp = []

            var arrayToUp = []
            var sportID = associationDetails.findOne({
                userId: Session.get("selectedAssocId")
            })
            if(sportID && sportID.interestedProjectName && sportID.interestedProjectName.length != 0){
                sportID = sportID.interestedProjectName[0]

                var query1 = {
                    role: "Player",
                    "$or": [{
                        associationId: Session.get("selectedAssocId")
                    }, {
                        parentAssociationId: Session.get("selectedAssocId")
                    }]
                }

                var fields = {
                    "emailAddress": 1,
                    "userName": 1,
                    "guardianName": 1,
                    "clubName": 1,
                    "clubNameId": 1,
                    "phoneNumber": 1,
                    "associationId": 1,
                    "state": 1,
                    "dateOfBirth": 1,
                    "gender": 1,
                    "country": 1,
                    "address": 1,
                    "city": 1,
                    "pinCode": 1,
                    "affiliationId": 1,
                    "nationalAffiliationId": 1,
                    "userId": 1,
                    "affiliatedTo": 1,
                    "statusOfUser": 1
                }

                Meteor.call("downloadUsersUploaded",sportID,query1,fields,function(e,res){
                    if(res){
                        var arrayToDown = res
                        alert("Number of players:" + arrayToDown.length)
                        if (arrayToDown.length != 0) {
                            _.each(arrayToDown, function(user) {
                                if (user.address == undefined || user.address == null) {
                                    user.address = ""
                                }
                                if (user.emailAddress == undefined || user.emailAddress == null) {
                                    user.emailAddress = ""
                                }
                                if (user.phoneNumber == undefined || user.phoneNumber == null) {
                                    user.phoneNumber = ""
                                }
                                if (user.dateOfBirth == undefined || user.dateOfBirth == null) {
                                    user.dateOfBirth = ""
                                } else if (user.dateOfBirth !== undefined && user.dateOfBirth !== null && user.dateOfBirth.length != 0) {
                                    user.dateOfBirth = moment(new Date(user.dateOfBirth)).format("YYYY MMM DD")
                                }
                                if (user.pinCode == undefined || user.pinCode == null || user.pinCode.trim().length == 0) {
                                    user.pinCode = "";
                                }

                                if (user.clubNameId == undefined || user.clubNameId == null || user.clubNameId.trim().length == 0) {
                                    user.clubNameId = " ";
                                }
                                if (user.clubNameId !== undefined || user.clubNameId !== null || user.clubNameId.trim().length !== 0) {
                                    var j = academyDetails.findOne({
                                        "userId": user.clubNameId
                                    })
                                    if (j)
                                        user.clubName = j.clubName;
                                    else {
                                        user.clubName = "other"
                                    }
                                }
                                if (user.city == undefined || user.city == null) {
                                    user.city = " ";
                                }
                                if (user.userName == undefined || user.userName == null) {
                                    user.userName = " ";
                                }
                                if (user.gender == undefined || user.gender == null) {
                                    user.gender = " ";
                                }
                                if (user.pinCode == undefined || user.pinCode == null) {
                                    user.pinCode = " ";
                                }
                                if (user.userId == undefined || user.userId == null) {
                                    user.userId = " ";
                                }
                                if (user.address == undefined || user.address == null) {
                                    user.address = " ";
                                }
                                if (user.guardianName == undefined || user.guardianName == null) {
                                    user.guardianName = " ";
                                }
                                //if (user.affiliationId !== undefined && user.affiliationId !== null && user.affiliationId.trim().length != 0 && user.affiliationId !== undefined) {
                                var data = {
                                    "emailAddress": user.emailAddress.trim(),
                                    "userName": user.userName.toUpperCase().trim(),
                                    "guardianName": user.guardianName.toUpperCase().trim(),
                                    "clubName": user.clubName.toUpperCase().trim(),
                                    "clubNameId": user.clubNameId.trim(),
                                    "phoneNumber": user.phoneNumber.trim(),
                                    "dateOfBirth": user.dateOfBirth,
                                    "gender": user.gender.trim(),
                                    "address": user.address.toUpperCase().trim(),
                                    "city": user.city.toUpperCase().trim(),
                                    "pinCode": user.pinCode.trim(),
                                    "userId": user.userId,
                                    "affiliatedTo": user.affiliatedTo,
                                    "userStatus": user.userStatus,
                                    "statusOfUser": user.statusOfUser
                                }
                                if (user.affiliationId == null || user.affiliationId == undefined || user.affiliationId.trim().length == 0) {
                                    data["affiliationId"] = " "
                                } else {
                                    data["affiliationId"] = user.affiliationId
                                }

                                if (user.nationalAffiliationId == null || user.nationalAffiliationId == undefined) {
                                    data["nationalAffiliationId"] = " "
                                } else {
                                    data["nationalAffiliationId"] = user.nationalAffiliationId.trim()
                                }
                                if (user.associationId == null || user.associationId == undefined) {
                                    data["associationId"] = "other"
                                } else {
                                    data["associationId"] = user.associationId.trim()
                                }
                                arrayToUp.push(data)
                                    //}
                            });
                        }
                        //d
                        JSONToCSVConvertorUsers(arrayToUp, "", true, "iplayonusers")
                    }
                    else if(e){
                        alert(e)
                    }
                })
            }
            else{
                alert("sport is not selected by this association")
            }           
        } else {
            alert("Select State Association")
        }
    },

});

Template.confirmInsertPlayerSA.onRendered(function() {

});

Template.confirmInsertPlayerSA.onCreated(function() {

});

Template.confirmInsertPlayerSA.helpers({
    duplicatePlayers: function() {
        if (Session.get("duplicatedPlayer")) {
            var arra = [];
            arra.push(Session.get("duplicatedPlayer"))
            return arra;
        }
    }
});

Template.confirmInsertPlayerSA.events({
    "click #skipDuplicate": function(e) {
        e.preventDefault();
        var playersDetails = Session.get("playersDetailsArray")
        var couV = parseInt(Session.get("playersDetailsCounter")) + 1;
        for (var i = couV; i < playersDetails.length; i++) {
            var associationDetails_p = "";
            var nationalAffiliationID = "";
            if (playersDetails[i].nationalAffiliationId) {
                nationalAffiliationID = playersDetails[i].nationalAffiliationId.trim()
            }
            var affiliationId = "";
            if (playersDetails[i].affiliationId && playersDetails[i].affiliationId !== "other") {
                affiliationId = playersDetails[i].affiliationId.trim()
            }
            if(playersDetails[i].phoneNumber == undefined || playersDetails[i].phoneNumber == null){
                playersDetails[i].phoneNumber = ""
            }
            var clubDetails = associationDetails.findOne({
                "userId": playersDetails[i].stateAssociationId.trim()
            })
            if (clubDetails) { //4
                if (clubDetails.country == undefined || clubDetails.country == null) {
                    clubDetails.country = ""
                }
                if (clubDetails.state == undefined || clubDetails.state == null) {
                    clubDetails.state = ""
                }
                if(playersDetails[couV].phoneNumber == undefined || playersDetails[couV].phoneNumber == null){
                    playersDetails[i].phoneNumber = ""
                }
                //Session.set("passwordDirect", randomPassword_PlayerDirect(7))
                var data = {
                    "interestedDomainName": [""],
                    "interestedProjectName": [""],
                    "interestedSubDomain1Name": [""],
                    "interestedSubDomain2Name": [""],
                    "role": "Player",
                    "emailAddress": playersDetails[i].emailAddress.trim(),
                    "userName": playersDetails[i].userName.trim(),
                    "guardianName": playersDetails[i].guardianName.trim(),
                    "phoneNumber": playersDetails[i].phoneNumber.trim(),
                    "associationId": playersDetails[i].stateAssociationId.trim(),
                    "state": clubDetails.state.trim(),
                    "dateOfBirth": playersDetails[i].dateOfBirth.trim(),
                    "gender": playersDetails[i].gender.trim(),
                    "country": clubDetails.country.trim(),
                    "address": playersDetails[i].address.trim(),
                    "city": playersDetails[i].city.trim(),
                    "pinCode": playersDetails[i].pinCode.trim(),
                    "affiliationId": affiliationId.trim(),
                    "statusOfUser": "Active",
                    "userStatus":playersDetails[i].userStatus,
                    "nationalAffiliationId": nationalAffiliationID.trim()
                }
                var findDuplicate = playersDetails[i].duplicate

                if (findDuplicate) {
                    $("#inserted").html("");
                    Session.set("duplicatedPlayer", playersDetails[i]);
                    Session.set("playersDetailsCounter", i)
                    var input = $("input[type='file']");
                    input.html(input.html()).val('');
                    Session.set("numberOfPlayersInsertedFinally", insertedREc)
                    Blaze.render(Template.confirmInsertPlayerSA, $("#confirmInsertPlayerRender")[0]);
                    $("#confirmInsertPlayerSA").modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                    break;
                } else {
                    Meteor.call("csvUploadStateAndAcademy", data, Session.get("selectedAssocId"), function(e, res) {
                        if (e) {
                            alert(e)
                        } else {
                            insertedREc = parseInt(insertedREc + 1);
                            Session.set("numberOfPlayersInserted", insertedREc)
                        }
                    })
                }
            }
            if (i == playersDetails.length - 1) {
                alert("Done")
                Session.set("numberOfPlayersInsertedFinally", Session.get("numberOfPlayersInserted"))
                    //Do something if the end of the loop    
            }
        }
    },
    "click #addDuplicate": function(e) {
        var playersDetails = Session.get("playersDetailsArray")
        var couV = parseInt(Session.get("playersDetailsCounter"));
        var nationalAffiliationID = "";
        if (playersDetails[couV].nationalAffiliationId) {
            nationalAffiliationID = playersDetails[couV].nationalAffiliationId.trim()
        }
        var affiliationId = "";
        if (playersDetails[couV].affiliationId && playersDetails[couV].affiliationId !== "other") {
            affiliationId = playersDetails[couV].affiliationId.trim()
        }
        var clubDetails = associationDetails.findOne({
            "userId": playersDetails[couV].stateAssociationId.trim()
        })
        if(playersDetails[couV].phoneNumber == undefined || playersDetails[couV].phoneNumber == null){
            playersDetails[couV].phoneNumber = ""
        }
        if (clubDetails) {
            if (clubDetails.country == undefined || clubDetails.country == null) {
                clubDetails.country = ""
            }
            if (clubDetails.state == undefined || clubDetails.state == null) {
                clubDetails.state = ""
            }
            var data = {
                "interestedDomainName": [""],
                "interestedProjectName": [""],
                "interestedSubDomain1Name": [""],
                "interestedSubDomain2Name": [""],
                "role": "Player",
                "emailAddress": playersDetails[couV].emailAddress.trim(),
                "userName": playersDetails[couV].userName.trim(),
                "guardianName": playersDetails[couV].guardianName.trim(),
                "phoneNumber": playersDetails[couV].phoneNumber.trim(),
                "associationId": playersDetails[couV].stateAssociationId.trim(),
                "state": clubDetails.state.trim(),
                "dateOfBirth": playersDetails[couV].dateOfBirth.trim(),
                "gender": playersDetails[couV].gender.trim(),
                "country": clubDetails.country.trim(),
                "address": playersDetails[couV].address.trim(),
                "city": playersDetails[couV].city.trim(),
                "pinCode": playersDetails[couV].pinCode.trim(),
                "affiliationId": affiliationId.trim(),
                "statusOfUser": "Active",
                "userStatus":playersDetails[couV].userStatus,
                "nationalAffiliationId": nationalAffiliationID.trim()
            }
            Meteor.call("csvUploadStateAndAcademy", data, Session.get("selectedAssocId"), function(e, res) {
                if (e) {
                    alert(e)
                } else {
                    insertedREc = parseInt(insertedREc + 1);
                    Session.set("numberOfPlayersInsertedFinally", insertedREc)
                }
            })
        }

        for (var i = parseInt(couV + 1); i < playersDetails.length; i++) {
            var associationDetails_p = "";
            var nationalAffiliationID = "";
            if (playersDetails[i].nationalAffiliationId) {
                nationalAffiliationID = playersDetails[i].nationalAffiliationId.trim()
            }
            var affiliationId = "";
            if (playersDetails[i].affiliationId && playersDetails[i].affiliationId !== "other") {
                affiliationId = playersDetails[i].affiliationId.trim()
            }
            if(playersDetails[i].phoneNumber == undefined || playersDetails[i].phoneNumber == null){
                playersDetails[i].phoneNumber = ""
            }
            var clubDetails = associationDetails.findOne({
                "userId": playersDetails[i].stateAssociationId.trim()
            })
            if (clubDetails) { //3
                if (clubDetails.country == undefined || clubDetails.country == null) {
                    clubDetails.country = ""
                }
                if (clubDetails.state == undefined || clubDetails.state == null) {
                    clubDetails.state = ""
                }

                //Session.set("passwordDirect", randomPassword_PlayerDirect(7))
                var data = {
                    "interestedDomainName": [""],
                    "interestedProjectName": [""],
                    "interestedSubDomain1Name": [""],
                    "interestedSubDomain2Name": [""],
                    "role": "Player",
                    "emailAddress": playersDetails[i].emailAddress.trim(),
                    "userName": playersDetails[i].userName.trim(),
                    "guardianName": playersDetails[i].guardianName.trim(),
                    "phoneNumber": playersDetails[i].phoneNumber.trim(),
                    "associationId": playersDetails[i].stateAssociationId.trim(),
                    "state": clubDetails.state.trim(),
                    "dateOfBirth": playersDetails[i].dateOfBirth.trim(),
                    "gender": playersDetails[i].gender.trim(),
                    "country": clubDetails.country.trim(),
                    "address": playersDetails[i].address.trim(),
                    "city": playersDetails[i].city.trim(),
                    "pinCode": playersDetails[i].pinCode.trim(),
                    "affiliationId": affiliationId.trim(),
                    "statusOfUser": "Active",
                    "userStatus":playersDetails[i].userStatus,
                    "nationalAffiliationId": nationalAffiliationID.trim()
                }
                var findDuplicate = playersDetails[i].duplicate


                if (findDuplicate) {
                    Session.set("duplicatedPlayer", playersDetails[i]);
                    Session.set("playersDetailsCounter", i)
                    Blaze.render(Template.confirmInsertPlayerSA, $("#confirmInsertPlayerRender")[0]);
                    $("#confirmInsertPlayerSA").modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                    var input = $("input[type='file']");
                    input.html(input.html()).val('');
                    break;
                } else {
                    Meteor.call("csvUploadStateAndAcademy", data, Session.get("selectedAssocId"), function(e, res) {
                        if (e) {
                            alert(e)
                        } else {
                            insertedREc = parseInt(insertedREc + 1);
                            Session.set("numberOfPlayersInserted", insertedREc)
                        }
                    })
                }
            }
            if (i == playersDetails.length - 1) {
                alert("Done")
                Session.set("numberOfPlayersInsertedFinally", Session.get("numberOfPlayersInserted"))
                    //Do something if the end of the loop    
            }
        }
    }
});


Template.confirmInsertPlayerDA.onRendered(function() {

});

Template.confirmInsertPlayerDA.onCreated(function() {

});

Template.confirmInsertPlayerDA.helpers({
    duplicatePlayers: function() {
        if (Session.get("duplicatedPlayer")) {
            var arra = [];
            arra.push(Session.get("duplicatedPlayer"))
            return arra;
        }
    }
});

Template.confirmInsertPlayerDA.events({
    "click #skipDuplicate": function(e) {
        e.preventDefault();
        var playersDetails = Session.get("playersDetailsArray")
        var couV = parseInt(Session.get("playersDetailsCounter")) + 1;
        for (var i = couV; i < playersDetails.length; i++) {
            var associationDetails_p = "";
            var nationalAffiliationID = "";
            if (playersDetails[i].nationalAffiliationId) {
                nationalAffiliationID = playersDetails[i].nationalAffiliationId.trim()
            }
            var affiliationId = "";
            if (playersDetails[i].affiliationId && playersDetails[i].affiliationId !== "other") {
                affiliationId = playersDetails[i].affiliationId.trim()
            }
            var clubDetails = associationDetails.findOne({
                "userId": playersDetails[i].districtAssociationId.trim()
            })
            if (clubDetails) { //3
                if (clubDetails.country == undefined || clubDetails.country == null) {
                    clubDetails.country = ""
                }
                if (clubDetails.state == undefined || clubDetails.state == null) {
                    clubDetails.state = ""
                }
                if(playersDetails[i].phoneNumber == undefined || playersDetails[i].phoneNumber == null){
                    playersDetails[i].phoneNumber = ""
                }
                //Session.set("passwordDirect", randomPassword_PlayerDirect(7))
                var data = {
                    "interestedDomainName": [""],
                    "interestedProjectName": [""],
                    "interestedSubDomain1Name": [""],
                    "interestedSubDomain2Name": [""],
                    "role": "Player",
                    "emailAddress": playersDetails[i].emailAddress.trim(),
                    "userName": playersDetails[i].userName.trim(),
                    "guardianName": playersDetails[i].guardianName.trim(),
                    "phoneNumber": playersDetails[i].phoneNumber.trim(),
                    "associationId": playersDetails[i].districtAssociationId.trim(),
                    "state": clubDetails.state.trim(),
                    "dateOfBirth": playersDetails[i].dateOfBirth.trim(),
                    "gender": playersDetails[i].gender.trim(),
                    "country": clubDetails.country.trim(),
                    "address": playersDetails[i].address.trim(),
                    "city": playersDetails[i].city.trim(),
                    "pinCode": playersDetails[i].pinCode.trim(),
                    "affiliationId": affiliationId.trim(),
                    "statusOfUser": "Active",
                    "userStatus":playersDetails[i].userStatus,
                    "nationalAffiliationId": nationalAffiliationID.trim()
                }
                var findDuplicate = playersDetails[i].duplicate


                if (findDuplicate) {
                    $("#inserted").html("");
                    Session.set("duplicatedPlayer", playersDetails[i]);
                    Session.set("playersDetailsCounter", i)
                    var input = $("input[type='file']");
                    input.html(input.html()).val('');
                    Session.set("numberOfPlayersInsertedFinally", insertedREc)
                    Blaze.render(Template.confirmInsertPlayerSA, $("#confirmInsertPlayerRender")[0]);
                    $("#confirmInsertPlayerSA").modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                    break;
                } else {
                    Meteor.call("csvUploadStateAndAcademy", data, Session.get("selectedAcadId"), function(e, res) {
                        if (e) {
                            alert(e)
                        } else {
                            insertedREc = parseInt(insertedREc + 1);
                            Session.set("numberOfPlayersInserted", insertedREc)
                        }
                    })
                }
            }
            if (i == playersDetails.length - 1) {
                alert("Done")
                Session.set("numberOfPlayersInsertedFinally", Session.get("numberOfPlayersInserted"))
                    //Do something if the end of the loop    
            }
        }
    },
    "click #addDuplicate": function(e) {
        var playersDetails = Session.get("playersDetailsArray")
        var couV = parseInt(Session.get("playersDetailsCounter"));
        var nationalAffiliationID = "";
        if (playersDetails[couV].nationalAffiliationId) {
            nationalAffiliationID = playersDetails[couV].nationalAffiliationId.trim()
        }
        var affiliationId = "";
        if (playersDetails[couV].affiliationId && playersDetails[couV].affiliationId !== "other") {
            affiliationId = playersDetails[couV].affiliationId.trim()
        }
        if(playersDetails[couV].phoneNumber == undefined || playersDetails[couV].phoneNumber == null){
            playersDetails[couV].phoneNumber = ""
        }
        var clubDetails = associationDetails.findOne({
            "userId": playersDetails[couV].districtAssociationId.trim()
        })
        if (clubDetails) {
                if (clubDetails.country == undefined || clubDetails.country == null) {
                    clubDetails.country = ""
                }
                if (clubDetails.state == undefined || clubDetails.state == null) {
                    clubDetails.state = ""
                }

            var data = {
                "interestedDomainName": [""],
                "interestedProjectName": [""],
                "interestedSubDomain1Name": [""],
                "interestedSubDomain2Name": [""],
                "role": "Player",
                "emailAddress": playersDetails[couV].emailAddress.trim(),
                "userName": playersDetails[couV].userName.trim(),
                "guardianName": playersDetails[couV].guardianName.trim(),
                "phoneNumber": playersDetails[couV].phoneNumber.trim(),
                "associationId": playersDetails[couV].districtAssociationId.trim(),
                "state": clubDetails.state.trim(),
                "dateOfBirth": playersDetails[couV].dateOfBirth.trim(),
                "gender": playersDetails[couV].gender.trim(),
                "country": clubDetails.country.trim(),
                "address": playersDetails[couV].address.trim(),
                "city": playersDetails[couV].city.trim(),
                "pinCode": playersDetails[couV].pinCode.trim(),
                "affiliationId": affiliationId.trim(),
                "statusOfUser": "Active",
                "userStatus":playersDetails[couV].userStatus,
                "nationalAffiliationId": nationalAffiliationID.trim()
            }
            Meteor.call("csvUploadStateAndAcademy", data, Session.get("selectedAcadId"), function(e, res) {
                if (e) {
                    alert(e)
                } else {
                    insertedREc = parseInt(insertedREc + 1);
                    Session.set("numberOfPlayersInsertedFinally", insertedREc)
                }
            })
        }

        for (var i = parseInt(couV + 1); i < playersDetails.length; i++) {
            var associationDetails_p = "";
            var nationalAffiliationID = "";
            if (playersDetails[i].nationalAffiliationId) {
                nationalAffiliationID = playersDetails[i].nationalAffiliationId.trim()
            }
            var affiliationId = "";
            if (playersDetails[i].affiliationId && playersDetails[i].affiliationId !== "other") {
                affiliationId = playersDetails[i].affiliationId.trim()
            }
            var clubDetails = associationDetails.findOne({
                "userId": playersDetails[i].districtAssociationId.trim()
            })
            if(playersDetails[i].phoneNumber == undefined || playersDetails[i].phoneNumber == null){
                playersDetails[i].phoneNumber = ""
            }
            if (clubDetails) { //2
                if (clubDetails.country == undefined || clubDetails.country == null) {
                    clubDetails.country = ""
                }
                if (clubDetails.state == undefined || clubDetails.state == null) {
                    clubDetails.state = ""
                }

                //Session.set("passwordDirect", randomPassword_PlayerDirect(7))
                var data = {
                    "interestedDomainName": [""],
                    "interestedProjectName": [""],
                    "interestedSubDomain1Name": [""],
                    "interestedSubDomain2Name": [""],
                    "role": "Player",
                    "emailAddress": playersDetails[i].emailAddress.trim(),
                    "userName": playersDetails[i].userName.trim(),
                    "guardianName": playersDetails[i].guardianName.trim(),
                    "phoneNumber": playersDetails[i].phoneNumber.trim(),
                    "associationId": playersDetails[i].districtAssociationId.trim(),
                    "state": clubDetails.state.trim(),
                    "dateOfBirth": playersDetails[i].dateOfBirth.trim(),
                    "gender": playersDetails[i].gender.trim(),
                    "country": clubDetails.country.trim(),
                    "address": playersDetails[i].address.trim(),
                    "city": playersDetails[i].city.trim(),
                    "pinCode": playersDetails[i].pinCode.trim(),
                    "affiliationId": affiliationId.trim(),
                    "statusOfUser": "Active",
                    "userStatus":playersDetails[i].userStatus,
                    "nationalAffiliationId": nationalAffiliationID.trim()
                }
                var findDuplicate = playersDetails[i].duplicate

                if (findDuplicate) {
                    Session.set("duplicatedPlayer", playersDetails[i]);
                    Session.set("playersDetailsCounter", i)
                    Blaze.render(Template.confirmInsertPlayerDA, $("#confirmInsertPlayerRender")[0]);
                    $("#confirmInsertPlayerDA").modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                    var input = $("input[type='file']");
                    input.html(input.html()).val('');
                    break;
                } else {
                    Meteor.call("csvUploadStateAndAcademy", data, Session.get("selectedAcadId"), function(e, res) {
                        if (e) {
                            alert(e)
                        } else {
                            insertedREc = parseInt(insertedREc + 1);
                            Session.set("numberOfPlayersInserted", insertedREc)
                        }
                    })
                }
            }
            if (i == playersDetails.length - 1) {
                alert("Done")
                Session.set("numberOfPlayersInsertedFinally", Session.get("numberOfPlayersInserted"))
                    //Do something if the end of the loop    
            }
        }
    }
});

function JSONToCSVConvertorUsers(JSONData, ReportTitle, ShowLabel, filNam) {
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