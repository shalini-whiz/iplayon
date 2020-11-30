import {
    HTTP
}
from 'meteor/http'

Template.testTTFIAPITest.onCreated(function() {
    this.subscribe("onlyLoggedIn")
    this.subscribe("authAddress");

});

Template.testTTFIAPITest.onRendered(function() {

    Session.set("exampleJson", undefined);
    Session.set("resultJson", undefined);
});

Template.testTTFIAPITest.helpers({
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
    "apiList": function() {
        try {
            //"viewTeams","deleteTeam",
            var listOfApi = ["PregisterTTFIAdmin", "getDetailsOfCountryState",
                "getDetailsOfCountryForGivenCountryName", "PsendRegOtpWithValidations",
                "PsendNewPasswordOtpWithValidations", "PsetNewPasswordWithValidations",
                "PloginUserWithValidations", "PregisterTTFIStateAssocAPI", 
                "PregisterTTFIDistAssocAPI", "PregisterTTFIAcademyAPI", 
                "registerAcademy5s", "PgetListOfStateAssociations",
                "PgetAffiliatedDistAssociations", "PgetUnAffiliatedDistAssociations", "PgetListOfDistAssociations",
                "affiliateValidatinonsAssocsUnderSa", "PaffiliateAcademyToSA",
                "PgetAffiliatedStateAcademies", "PgetAffiliatedDistAcademies",
                "PgetUnAffiliatedAcademies", "PgetListOfAcademiesAPI",
                "PaffiliateAcademyToDA", "PaffiliateDAToSA", "PgetAffiliatedDistAssociationsForState",
                "PgetAffiliatedDistAcademiesForDistrict",
                "PgetAffiliatedStateAcademiesForState", "PgetDetailsOfGivenAcademyId",
                "PenableUsersAPI", "PgetListOfActiveStateAssociations", 
                "PgetListOfInActiveStateAssociations", "PgetListOfActiveAcademiesAPI",
                "PgetListOfInActiveAcademiesAPI", "PgetListOfActiveDistAssociations",
                "PgetListOfInActiveDistAssociations", "PremoveAffiliatedDAFromSA", 
                "PgetDetailsOfGivenStateAssoc", "PgetDetailsOfGivenDistAssoc", 
                "PremoveAffiliatedAcadFromDA", "PremoveAffiliatedAcadFromSA", "PupdateProfileOfSAAPI",
                "PupdateProfileOfDAAPI", "PupdateProfileOfAcademyAPI" , "PupdatePhoneOrEmailAddress",
                "PregisterAndAffiliateDistToSa","PregisterAndAffiliateAcadToDA",
                "PregisterAndAffiliateAcadToSA", "PaffiliatePlayerToSA",
                "PaffiliatePlayerToDistrict" , "PaffiliatePlayerToAcademyOfSA",

                "PaffiliatePlayerToAcademyOfDA", "registerTTFIPlayersAPI","PgetTournamentTypesForState",
                "PgetTournamentIdForGivenType","getWinnersListFromFinals",

                "PaffiliatePlayerToAcademyOfDA", "registerTTFIPlayersAPI"
                , "getMatchRecordsforEventAndRound","getListOfTournamentsForStateAndPlayer",
                "getHeadsOnDetailsOfPlayerOfATournament","getListOfTournamentsForState",
                "sendSubscriptionEmailAPI","getStateListByYear","PregisterSchoolExtAPI",
                "getRoundsBasedOnStateAndUser"

            ]
            return listOfApi
        } catch (e) {

        }
    },
    "sampleJson": function() {
        if (Session.get("exampleJson")) {
            return Session.get("exampleJson");
        }

    },
    "resultJson": function() {
        if (Session.get("resultJson"))
            return Session.get("resultJson");
    }

});


Template.testTTFIAPITest.events({
    "change #apiList": function(e) {
        $("#inputJson").val("")
        Session.set("exampleJson", "");
        if($("#apiList").val().trim()=="PregisterSchoolExtAPI"){
            var data = {"role":"school","emailAddress":"ww@ff.com","phoneNumber":"2123231434","userName":"sdfmghdfs","state":"sPEgrvmKbRjkDahwj","city":"jfdgh","pinCode":"123123","address":"fhgds","abbrevation":"dfhh"}
            Session.set("exampleJson", JSON.stringify(data));
            $("#inputJson").val(JSON.stringify(data))
        }
        if(
            $("#apiList").val().trim()=="registerTTFIPlayersAPI"||
           $("#apiList").val().trim()=="PupdateProfileOfSAAPI"||
           $("#apiList").val().trim()=="PupdateProfileOfDAAPI"||
           $("#apiList").val().trim()== "PupdateProfileOfAcademyAPI"||
           $("#apiList").val().trim()== "PupdatePhoneOrEmailAddress"||
            $("#apiList").val().trim()== "PaffiliatePlayerToSA"||
            $("#apiList").val().trim()== "PaffiliatePlayerToDistrict" ||
            $("#apiList").val().trim()== "PaffiliatePlayerToAcademyOfSA"||

            $("#apiList").val().trim()=="PgetTournamentTypesForState"||
            $("#apiList").val().trim()== "PaffiliatePlayerToAcademyOfDA"||
            $("#apiList").val().trim()=="PgetTournamentIdForGivenType" ||

            $("#apiList").val().trim()== "PaffiliatePlayerToAcademyOfDA"||
            $("#apiList").val().trim()=="getMatchRecordsforEventAndRound"||
            $("#apiList").val().trim()=="getListOfTournamentsForStateAndPlayer" ||
            $("#apiList").val().trim()=="getHeadsOnDetailsOfPlayerOfATournament"||
            $("#apiList").val().trim()=="sendSubscriptionEmailAPI" || 
            $('#apiList').val().trim()=="getStateListByYear"){

            var data = {
                "role": "stateAssociation",
                "loggedInId": "5tLCALe5SENaDpaBt",
                "usersRole": "districtAssociation",
                "enableValue": "Active",
                "userIds": ["nJtoEwdKPQ5yKnu2Z", "yJcNFXp57AT2HajnN"]
            }
            Session.set("exampleJson", JSON.stringify(data));
            $("#inputJson").val(JSON.stringify(data))
        }
        if ($("#apiList").val().trim() == "PenableUsersAPI") {
            var data = {
                "role": "stateAssociation",
                "loggedInId": "5tLCALe5SENaDpaBt",
                "usersRole": "districtAssociation",
                "enableValue": "Active",
                "userIds": ["nJtoEwdKPQ5yKnu2Z", "yJcNFXp57AT2HajnN"]
            }
            Session.set("exampleJson", JSON.stringify(data));
            $("#inputJson").val(JSON.stringify(data))
        }
        if ($("#apiList").val().trim() == "PgetDetailsOfGivenAcademyId" ||
            $("#apiList").val().trim() == "PgetDetailsOfGivenStateAssoc" ||
            $("#apiList").val().trim() == "PgetDetailsOfGivenDistAssoc"||
            $("#apiList").val().trim() == "getWinnersListFromFinals") {
            var data = {
                "academyId": "K8neoSxpZDMjdAcNz",
                "eventOrganizer" : "RCLSqzrDpFfsRwjY8",
                "eventName" : "JG",
                "year" : "2018",
                "tournamentType" : "NITTC-State-2018",
                "teamFormatId" : "3HJs3eXdRaf7aNt5p",
                "stateId":"8va5A8N3EKAeKtmeB"
            }
            Session.set("exampleJson", JSON.stringify(data));
            $("#inputJson").val(JSON.stringify(data))
        }
        if ($("#apiList").val().trim() == "PgetAffiliatedStateAcademiesForState") {
            var data = {
                "stateAssociationId": "K8neoSxpZDMjdAcNz"
            }
            Session.set("exampleJson", JSON.stringify(data));
            $("#inputJson").val(JSON.stringify(data))
        }
        if ($("#apiList").val().trim() == "PgetAffiliatedDistAcademiesForDistrict") {
            var data = {
                "districtAssociationId": "K8neoSxpZDMjdAcNz"
            }
            Session.set("exampleJson", JSON.stringify(data));
            $("#inputJson").val(JSON.stringify(data))
        }
        if ($("#apiList").val().trim() == "PgetAffiliatedDistAssociationsForState") {
            var data = {
                "stateAssociationId": "K8neoSxpZDMjdAcNz"
            }
            Session.set("exampleJson", JSON.stringify(data));
            $("#inputJson").val(JSON.stringify(data))
        }
        if ($("#apiList").val().trim() == "PaffiliateDAToSA" ||
            $("#apiList").val().trim() == "PremoveAffiliatedDAFromSA" ||
            $("#apiList").val().trim() == "PremoveAffiliatedAcadFromDA" ||
            $("#apiList").val().trim() == "PremoveAffiliatedAcadFromSA") {
            var data = {
                "stateAssociationId": "5tLCALe5SENaDpaBt",
                "districts": ["nJtoEwdKPQ5yKnu2Z", "yJcNFXp57AT2HajnN", "5tLCALe5SENaDpaBt"]
            }
            Session.set("exampleJson", JSON.stringify(data));
            $("#inputJson").val(JSON.stringify(data))
        }
        if ($("#apiList").val().trim() == "PaffiliateAcademyToDA") {
            var data = {
                "districtAssociationId": "K8neoSxpZDMjdAcNz",
                "academies": ["X8kQrpJpvc3Cxjnrw", " "]
            }
            Session.set("exampleJson", JSON.stringify(data));
            $("#inputJson").val(JSON.stringify(data))
        }
        if ($("#apiList").val().trim() == "affiliateValidatinonsAssocsUnderSa" ||
            $("#apiList").val().trim() == "PaffiliateAcademyToSA") {
            var data = {
                "stateAssociationId": "K8neoSxpZDMjdAcNz",
                "districts": ["X8kQrpJpvc3Cxjnrw", " "]
            }
            Session.set("exampleJson", JSON.stringify(data));
            $("#inputJson").val(JSON.stringify(data))
        }
        if ($("#apiList").val().trim() == "PregisterTTFIAdmin") {
            var data = {
                "emailAddress": "dkfjg@kldfj.com",
                "phoneNumber": "1234567899",
                "registerType": "individual",
                "role": "organiser",
                "verifiedBy": ["email"],
                "interestedProjectName": ["QvHXDftiwsnc8gyfJ"],
                "userName": "hkjdfhg",
                "password": "abcdef",
                "dateOfBirth": "12 JUN 2018",
                "gender": "Male",
                "country": "India",
                "state": "CrXhXZnM3BNtzzoJK",
                "city": "sdf",
                "pinCode": "123124",
                "address": "dsf"
            }
            Session.set("exampleJson", JSON.stringify(data));
            $("#inputJson").val(JSON.stringify(data))
        }
        if ($("#apiList").val().trim() == "PgetAffiliatedStateAcademies" ||
            $("#apiList").val().trim() == "PgetAffiliatedDistAcademies" ||
            $("#apiList").val().trim() == "PgetUnAffiliatedAcademies" ||
            $("#apiList").val().trim() == "PgetListOfAcademiesAPI" ||
            $("#apiList").val().trim() == "PgetListOfActiveAcademiesAPI" ||
            $("#apiList").val().trim() == "PgetListOfInActiveAcademiesAPI" ||
            $("#apiList").val().trim() == "PgetListOfActiveDistAssociations" ||
            $("#apiList").val().trim() == "PgetListOfInActiveDistAssociations"
        ) {
            var data = {}
            Session.set("exampleJson", JSON.stringify(data));
            $("#inputJson").val(JSON.stringify(data))
        } else if ($("#apiList").val().trim() == "PgetListOfStateAssociations" ||
            $("#apiList").val().trim() == "PgetListOfDistAssociations" ||
            $("#apiList").val().trim() == "PgetListOfActiveStateAssociations" ||
            $("#apiList").val().trim() == "PgetListOfInActiveStateAssociations") {
            var data = {}
            Session.set("exampleJson", JSON.stringify(data));
            $("#inputJson").val(JSON.stringify(data))
        } else if ($("#apiList").val().trim() == "PgetAffiliatedDistAssociations") {
            var data = {}
            Session.set("exampleJson", JSON.stringify(data));
            $("#inputJson").val(JSON.stringify(data))
        } else if ($("#apiList").val().trim() == "PgetUnAffiliatedDistAssociations") {
            var data = {}
            Session.set("exampleJson", JSON.stringify(data));
            $("#inputJson").val(JSON.stringify(data))
        } else if ($("#apiList").val().trim() == "registerAcademy5s") {
            var data = {
                "emailAddress": "dkfjg@133klsdfj.cosm",
                "phoneNumber": "1325118092",
                "registerType": "individual",
                "role": "academy",
                "verifiedBy": ["email"],
                "interestedProjectName": ["QvHXDftiwsnc8gyfJ"],
                "userName": "hkjdfhg",
                "password": "abcdef",
                "dateOfBirth": "12 JUN 2018",
                "gender": "Male",
                "country": "India",
                "state": "CrXhXZnM3BNtzzoJK",
                "city": "sdf",
                "pinCode": "123124",
                "address": "dsf",
                "abbrevation": "asasasdsdfdda",
                "associationType": "District/City",
                "clubName": "associationName ",
                "emailIdOrPhone": 2,
                "interestedDomainName": ["hsTNDPxZjqmGz3sZv"]
            }
            Session.set("exampleJson", JSON.stringify(data));
            $("#inputJson").val(JSON.stringify(data))
        } else if (
            $("#apiList").val().trim()=="PregisterAndAffiliateAcadToDA" ||
            $("#apiList").val().trim()=="PregisterAndAffiliateAcadToSA" ||
            $("#apiList").val().trim() =="PregisterAndAffiliateDistToSa"||
            $("#apiList").val().trim() ==
            "PregisterTTFIDistAssocAPI" || $("#apiList").val().trim() ==
            "PregisterTTFIStateAssocAPI" || $("#apiList").val().trim() == "PregisterTTFIAcademyAPI") {
            var data = {
                "emailAddress": "dkfjg@klsdfj.com",
                "phoneNumber": "1234568899",
                "registerType": "individual",
                "role": "organiser",
                "verifiedBy": ["email"],
                "interestedProjectName": ["QvHXDftiwsnc8gyfJ"],
                "userName": "hkjdfhg",
                "password": "abcdef",
                "dateOfBirth": "12 JUN 2018",
                "gender": "Male",
                "country": "India",
                "state": "CrXhXZnM3BNtzzoJK",
                "city": "sdf",
                "pinCode": "123124",
                "address": "dsf",
                "assocAbbrevation": "dsf",
                "associationType": "State/Province/County",
                "associationName": "associationName ",
                "emailIdOrPhone": 1,
                "interestedDomainName": ["hsTNDPxZjqmGz3sZv"]
            }
            Session.set("exampleJson", JSON.stringify(data));
            $("#inputJson").val(JSON.stringify(data))
        } else if ($("#apiList").val().trim() == "getDetailsOfCountryForGivenCountryName") {
            var data = {
                "country": "India"
            }
            Session.set("exampleJson", JSON.stringify(data));
            $("#inputJson").val(JSON.stringify(data))
        } else if ($("#apiList").val().trim() == "PsendRegOtpWithValidations") {
            var data = {
                "emailIdOrPhone": 1,
                "emailOrPhoneValue": "apttastateentries@gmails.com"
            }
            Session.set("exampleJson", JSON.stringify(data));
            $("#inputJson").val(JSON.stringify(data))
        } else if ($("#apiList").val().trim() == "PsendNewPasswordOtpWithValidations") {
            var data = {
                "emailIdOrPhone": 1,
                "emailOrPhoneValue": "apttastateentries@gmail.com",
                "role": "Coach"
            }
            Session.set("exampleJson", JSON.stringify(data));
            $("#inputJson").val(JSON.stringify(data))
        } else if ($("#apiList").val().trim() == "PsetNewPasswordWithValidations") {
            var data = {
                "emailIdOrPhone": 1,
                "emailOrPhoneValue": "apttastateentries@gmail.com"
            }
            Session.set("exampleJson", JSON.stringify(data));
            $("#inputJson").val(JSON.stringify(data))
        } else if ($("#apiList").val().trim() == "PloginUserWithValidations") {
            var data = {
                "emailIdOrPhone": 1,
                "emailOrPhoneValue": "apttastateentries@gmail.com"
            }
            Session.set("exampleJson", JSON.stringify(data));
            $("#inputJson").val(JSON.stringify(data))
        }

    },
    "click #testAPINOWW": function(e) {

        var apiKey = "3b7dfced3428af5e22bf25461c8c54a2";
        var apiSelected = $("[name='apiList'] option:selected").attr("name");
        alert(apiSelected)
        var inputJSON = $("#inputJson").val();
        var url = Meteor.absoluteUrl().toString();
        alert(url)
        Session.set("exampleJson", inputJSON);
        Session.set("resultJson", "")
        try {
            if (apiSelected == "registerTTFIPlayersAPI" ||
                apiSelected == "getDetailsOfCountryForGivenCountryName" ||
                apiSelected == "registerAcademy5s" ||
               apiSelected == "affiliateValidatinonsAssocsUnderSa" ||
                apiSelected == "getWinnersListFromFinals" ||
                apiSelected == "affiliateValidatinonsAssocsUnderSa"||
                apiSelected == "getMatchRecordsforEventAndRound"||
                apiSelected == "getListOfTournamentsForStateAndPlayer"||
                apiSelected == "getHeadsOnDetailsOfPlayerOfATournament"||
                apiSelected == "sendSubscriptionEmailAPI" || apiSelected == "getStateListByYear" || 
                apiSelected == "getRoundsBasedOnStateAndUser") {
                Meteor.call(apiSelected, inputJSON, function(e, res) {

                    if (res) {
                        Session.set("resultJson", JSON.stringify(res))
                    } else if (e) {
                        alert(e.reason)
                    }
                })
            } else if (
                
                apiSelected == "PaffiliatePlayerToSA"||
                apiSelected == "PaffiliatePlayerToDistrict" ||
                apiSelected == "PaffiliatePlayerToAcademyOfSA"||
                apiSelected== "PaffiliatePlayerToAcademyOfDA"||
                apiSelected == "PregisterAndAffiliateAcadToDA" ||
                apiSelected == "PregisterAndAffiliateAcadToSA" ||
                apiSelected == "PregisterAndAffiliateDistToSa"||
                apiSelected == "PupdatePhoneOrEmailAddress" ||
                apiSelected == "PupdateProfileOfSAAPI"||
                apiSelected == "PupdateProfileOfDAAPI"||
                apiSelected == "PupdateProfileOfAcademyAPI"||
                apiSelected == "PremoveAffiliatedAcadFromDA" ||
                apiSelected == "PremoveAffiliatedAcadFromSA" ||
                apiSelected == "PgetDetailsOfGivenStateAssoc" ||
                apiSelected == "PgetDetailsOfGivenDistAssoc" ||
                apiSelected == "PremoveAffiliatedDAFromSA" ||
                apiSelected == "PgetListOfActiveDistAssociations" ||
                apiSelected == "PgetListOfInActiveDistAssociations" ||
                apiSelected == "PgetListOfActiveAcademiesAPI" ||
                apiSelected == "PgetListOfInActiveAcademiesAPI" ||
                apiSelected == "PgetListOfActiveStateAssociations" ||
                apiSelected == "PgetListOfInActiveStateAssociations" ||
                apiSelected == "PsendRegOtpWithValidations" || 
                apiSelected == "PenableUsersAPI" ||
                apiSelected == "PsendNewPasswordOtpWithValidations" ||
                apiSelected == "PsetNewPasswordWithValidations" ||
                apiSelected == "PloginUserWithValidations" || 
                apiSelected == "PregisterTTFIDistAssocAPI" ||
                apiSelected == "PregisterTTFIStateAssocAPI" || 
                apiSelected == "PregisterTTFIAcademyAPI" ||
                apiSelected == "PgetListOfStateAssociations" ||
                apiSelected == "PgetAffiliatedDistAssociations" ||
                apiSelected == "PgetUnAffiliatedDistAssociations" ||
                apiSelected == "PgetListOfDistAssociations" ||
                apiSelected == "PaffiliateAcademyToSA" || 
                apiSelected == "PregisterTTFIAdmin" ||
                apiSelected == "PgetAffiliatedStateAcademies" ||
                apiSelected == "PgetAffiliatedDistAcademies" ||
                apiSelected == "PgetDetailsOfGivenAcademyId" ||
                apiSelected == "PgetUnAffiliatedAcademies" || 
                apiSelected == "PaffiliateDAToSA" ||
                apiSelected == "PgetListOfAcademiesAPI" || 
                apiSelected == "PaffiliateAcademyToDA" ||
                apiSelected == "PgetAffiliatedDistAssociationsForState" ||
                apiSelected == "PgetAffiliatedStateAcademiesForState" || 
                apiSelected == "PgetAffiliatedDistAcademiesForDistrict"||
                apiSelected == "PgetTournamentTypesForState"||
                apiSelected == "PgetTournamentIdForGivenType"||
                apiSelected == "PregisterSchoolExtAPI") {
                Meteor.call(apiSelected, "11EvenSports", "021ab44154102aa8ba4089bc38ad3017", inputJSON, function(e, res) {
                    if (res) {
                        Session.set("resultJson", JSON.stringify(res))
                    } else if (e) {
                        alert(e.reason)
                    }
                })
            } else if (apiSelected == "getDetailsOfCountryState") {
                Meteor.call(apiSelected, function(e, res) {
                    if (res) {
                        Session.set("resultJson", JSON.stringify(res))
                    } else if (e) {
                        alert(e.reason)
                    }
                })
            }
        } catch (e) {
            alert(e)
        }
    }
})
