import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { MatchCollectionDB } from '../../publications/MatchCollectionDb.js';
import { teamMatchCollectionDB } from '../../publications/MatchCollectionDbTeam.js';

import { emailRegex } from '../dbRequiredRole.js'
import {nameToCollection} from '../dbRequiredRole.js'
import { initDBS } from '../dbRequiredRole.js'

Meteor.methods({
    PuserValidation: function(username, password, typeOfLogin, loginRole,giveDBDetails) {
        try {
           var dbsrequiredAll = initDBS("dbsrequiredAll")
           var roles = initDBS("roles")
           var indexToSkip = initDBS("indexToSkip")
           var indicesOfPlayers = initDBS("indicesOfPlayers")

            var userID = ""
            var verify = ""
            var dataFetchedFrom = ""

            if (typeOfLogin == "1") 
            {
                var regExpObj = {
                    $regex: emailRegex(username)
                }
                userID = Meteor.users.findOne({
                    $and: [{
                        "emailAddress": {
                            $regex: emailRegex(username)
                        },
                        'emails.0.address': {
                            $regex: emailRegex(username)
                        },
                    }]
                });
                verify = 'email'
            }
            else if(typeOfLogin == "2"){
                userID = Meteor.users.findOne({
                    phoneNumber:username,
                });
                verify = 'phone'
                if(giveDBDetails && userID && userID.role){
                    loginRole = userID.role
                }
            }
            if (userID) 
            {
                if(userID.role && userID.role == loginRole)
                {
                    var digest = Package.sha.SHA256(password);
                    var passwords = {
                        digest: digest,
                        algorithm: 'sha-256'
                    };
                    var result = ""

                    if (true) {
                        if (userID.verifiedBy) 
                        {
                            if (_.contains(userID.verifiedBy, verify)) {
                                var userInfo;
                                if (loginRole && _.contains(roles, loginRole.toLowerCase())) {
                                    var ind = _.indexOf(roles, loginRole.toLowerCase())
                                    if(loginRole.toLowerCase() == "player")
                                    {
                                        for(var j = 0;j<indicesOfPlayers.length;j++){
                                            userInfo = global[dbsrequiredAll[j]].findOne({
                                                "userId": userID.userId
                                            })
                                            if(userInfo){
                                                dataFetchedFrom = dbsrequiredAll[j]
                                                break;
                                            }
                                        }
                                    }
                                    else if(loginRole.toLowerCase() == "reporter")
                                    {
                                        if (ind > parseInt(indexToSkip)) {
                                            ind = parseInt(indexToSkip + 1)
                                        }

                                        userInfo = global[dbsrequiredAll[ind]].findOne({
                                            "userId": userID.userId
                                        })
                                        if(userInfo && userInfo.emailAddress)
                                        {
                                            var userAccess = userLogins.findOne({
                                                "email":emailRegex(userInfo.emailAddress)
                                            });
                                            if(userAccess && userAccess.approveStatus && userAccess.approveStatus == true)
                                            {

                                                dataFetchedFrom = dbsrequiredAll[ind];

                                            }
                                            else
                                            {
                                                return "Only authorized user can login!!"
                                            }
                                        }
                                        

                                        
                   

                                    }
                                    else{
                                        if (ind > parseInt(indexToSkip)) {
                                            ind = parseInt(indexToSkip + 1)
                                        }

                                        userInfo = global[dbsrequiredAll[ind]].findOne({
                                            "userId": userID.userId
                                        })
                                        dataFetchedFrom = dbsrequiredAll[ind]
                                    }

                                    if (userInfo) 
                                    {
                                        var digest = Package.sha.SHA256(password);
                                        var passwords = {
                                            digest: digest,
                                            algorithm: 'sha-256'
                                        };
                                        var result = Accounts._checkPassword(userID, passwords);
                                        if(result && result.error == null){
                                            userInfo.dataFetchedFrom = dataFetchedFrom
                                            return userInfo
                                        }
                                        else if (result && result.error != null) {
                                            return result.error.reason
                                        }
                                        else{
                                            return "Invalid password";
                                        }                                        
                                    } else {
                                        return "Invalid user info";
                                    }

                                } else {
                                    return "Invalid user role";
                                }
                            } else {
                                var data = {
                                    verify:true,
                                    type:verify,
                                    userId:userID.userId
                                }
                                return data
                            }
                        } else {
                            return "Invalid user details";
                        }
                    } 
                } else{
                    return "Only " + loginRole + " can login !" 
                }
            }
            else{
                return "Invalid user information"
            }
        } catch (exc) {
            return "Invalid user information";
        }
    },

  

    PapiUserValidation: function(username, password) {
        try {
            var regExpObj = {
                $regex: new RegExp(username, "i")
            }
            if (ApiPassword.validate({
                    email: {
                        $regex: new RegExp('^' + username + '$', "i")
                    },
                    password: password
                })) {
                var userID = Meteor.users.findOne({
                    "emails.address": regExpObj,
                    verifiedBy: {
                        $in: ["email"]
                    }
                });
                if (userID && (userID.role == "School")) {
                    var userInfo = schoolDetails.findOne({
                        "emailAddress": new RegExp('^' + username + '$', "i")
                    });
                    if (userInfo)
                        return userInfo;
                } else {
                    return "You are not authorized to login"
                }
            } else {
                return "Invalid password"
            }
        } catch (exc) {
            return "Invalid user";
        }
    },

    PfetchProfileSettings: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("fetchProfileSettings", data));
        } catch (e) {
        }
    },

    PprofileUpdateViaApp: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("profileUpdateViaApp", data));
        } catch (e) {}
    },

    PfetchProfileStatistics: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("fetchProfileStatistics", data));
        } catch (e) {}
    },

    PanalyticsAccess: function(caller, apiKey, userId) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("analyticsAccess", userId));
        } catch (e) {}
    },

    PregisterOtp: function(caller, apiKey, userId, emailId) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("registerOtp", emailId));
        } catch (e) {}
    },

    PplayerRegisterViaApp: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("playerRegisterationViaApp", data));
        } catch (e) {}
    },

    PplayerRegisterUnderAssoc: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("playerRegisterUnderAssoc", data));
        } catch (e) {}
    },


    PaffiliateToAssoc: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("affiliateToAssoc", data));
        } catch (e) {}
    },

    PvalidateAffiliateOther: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("validateAffiliateOther", data));
        } catch (e) {}
    },

    PrenewalUnderAssoc: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("renewalUnderAssoc", data));
        } catch (e) {}
    },

    PotpForgotPassword: function(caller, apiKey, userId, emailId, emailIdOrPhone,loginRole) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("otpForgotPassword", emailId, emailIdOrPhone,loginRole));
        } catch (e) {}
    },

    PsetNewPassword: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("resetPasswordAfterVerification", data));
        } catch (e) {}
    },
    PregisterOtpCheck: function(caller, apiKey, data) {
        try {            
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("registerOtpCheck", data));
        } catch (e) {}
    },

    PchangeUserPassword: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("changeUserPassword", data));
        } catch (e) {}
    },

    PgetPlayerList: function(caller, apiKey, filterBy, filterData, filterGender) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("getPlayerList", filterBy, filterData, filterGender));
        } catch (e) {}
    },

    PgetRankList: function(caller, apiKey, sportID, eventName, filterData) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("getRankData", sportID, eventName, filterData));
        } catch (e) {}
    },

    PplayerRankList: function(caller, apiKey, sportID, eventName, filterData) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("getRankData12", sportID, eventName, filterData));
        } catch (e) {}
    },
    
    PgetEntriesList: function(caller, apiKey, tournamentId, eventId) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("getEntriesList", tournamentId, eventId));
        } catch (e) {}
    },

    PgetPastEntriesList: function(caller, apiKey, tournamentId, eventId) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("getPastEntriesList", tournamentId, eventId));
        } catch (e) {}
    },

    PgetPlayerInfo: function(caller, apiKey, playerID) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("getPlayerInfo", playerID));
        } catch (e) {}
    },

    PrankFilters: function(caller, apiKey, playerID) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("rankFilters", playerID));
        } catch (e) {}
    },

    PgetStrokesData: function(caller, apiKey, userId) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("getStrokesData", userId));
        } catch (e) {}
    },

    PgetResultsFilters: function(caller, apiKey, userId) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("getResultsFilters"));
        } catch (e) {}
    },

    PgetResults: function(caller, apiKey, userId, tournamentId, eventName) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            var tournamentInfo = MatchCollectionDB.findOne({
                'tournamentId': tournamentId,
                'eventName': eventName,
            });
            if (tournamentInfo) {
                if (tournamentInfo.matchRecords) {
                    return (Meteor.call("printDrawsSheet", tournamentId, eventName));
                } else
                    return "No results";
            } else
                return "Invalid Data"
                    //return (Meteor.call("getResults",tournamentId,eventName));
        } catch (e) {}
    },

    PgetPlayerSetData: function(caller, apiKey, userId) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("getPlayerSetData", userId));
        } catch (e) {}
    },

    PgetVsPlayerList: function(caller, apiKey, userId, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("getVsPlayerList", userId, data));
        } catch (e) {}
    },

    PrecordPlayerSequence: function(caller, apiKey, userId, sequenceData) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("recordPlayerSequence", userId, sequenceData));
        } catch (e) {}
    },

    PrecordPlayerProfile: function(caller, apiKey, userId, profileDate) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("recordPlayerProfile", userId, profileDate));
        } catch (e) {}
    },

    PfetchSummarizedSequence: function(caller, apiKey, playerID, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("fetchSummarizedSequence", playerID, data));
        } catch (e) {}
    },

    PfetchServicePoints: function(caller, apiKey, playerID, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("fetchServicePoints", playerID, data));
        } catch (e) {}
    },

    PfetchServiceLoss: function(caller, apiKey, playerID, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("fetchServiceLoss", playerID, data));
        } catch (e) {}
    },

    PfetchServiceFault: function(caller, apiKey, playerID, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("fetchServiceFault", playerID, data));
        } catch (e) {}
    },

    PfetchReceiverPoints: function(caller, apiKey, playerID, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("fetchReceiverPoints", playerID, data));
        } catch (e) {}
    },

    PfetchRallyAnalysis: function(caller, apiKey, playerID, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("fetchRallyAnalysis", playerID, data));
        } catch (e) {}
    },

    PfetchStrokeAnalysis: function(caller, apiKey, playerID, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("fetchStrokeAnalysis", playerID, data));
        } catch (e) {}
    },

    PfetchErrorAnalysis: function(caller, apiKey, playerID, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("fetchErrorAnalysis", playerID, data));
        } catch (e) {}
    },

    PfetchServiceResponseAnalysis: function(caller, apiKey, playerID, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("fetchServiceResponse", playerID, data));
        } catch (e) {}
    },

    Pfetch3BallAttack: function(caller, apiKey, playerID, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("fetch3BallAttack", playerID, data));
        } catch (e) {}
    },

    Pfetch4BallShot: function(caller, apiKey, playerID, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("fetch4BallShot", playerID, data));
        } catch (e) {}
    },

    PviewSequence: function(caller, apiKey, playerID, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("viewSequence", playerID, data));
        } catch (e) {}
    },

    PdownloadAnalytics: function(caller, apiKey, playerID, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("serAPI", data, playerID));
        } catch (e) {}
    },

    PdeleteSequence: function(caller, apiKey, userId, sequenceData) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("deleteSequence", userId, sequenceData));
        } catch (e) {}
    },

    PfetchSequenceRecord: function(caller, apiKey, userId, sequenceData) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("fetchSequenceRecord", userId, sequenceData));
        } catch (e) {}
    },

    PshareSequence: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("shareSequence", data));
        } catch (e) {}
    },

    PgetShareHistory: function(caller, apiKey, userId) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("sharedHistory", userId));
        } catch (e) {}
    },

    PgetPlayerDetailsApp: function(caller, apiKey, userId, sequenceData) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("getPlayerDetailsInfo", userId, sequenceData));
        } catch (e) {}
    },

    PgetPlayerSetPoints: function(caller, apiKey, userId, sequenceData) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("getPlayerSetPoints", userId, sequenceData));
        } catch (e) {}
    },

    PfetchPlayerProfile: function(caller, apiKey, userId, player1Name, player2Name, player1Id, player2Id) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("fetchPlayerProfile", userId, player1Name, player2Name, player1Id, player2Id));
        } catch (e) {}
    },

    PregisterEntity: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                return (Meteor.call("registerEntity", data));
            }
        } catch (e) {}
    },

    PregisterIndividual: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                return (Meteor.call("registerIndividual", data, apiKey));
            }
        } catch (e) {}
    },

    PviewProfileIndividual: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                return (Meteor.call("viewProfileIndividual", data));
            }
        } catch (e) {}
    },

    PupdateProfile: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                return (Meteor.call("updateProfile", data));
            }
        } catch (e) {}
    },

    PeditSchool: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("editSchool", data));
        } catch (e) {}
    },

    PschoolDetails: function(caller, apiKey, userId) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("schoolAbbrevationList"));
        } catch (e) {}
    },

    PaddSchoolPlayer: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("addSchoolPlayer", data, apiKey));
        } catch (e) {}
    },

    PeditSchoolPlayer: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("editSchoolPlayer", data));
        } catch (e) {}
    },

    PfetchSchoolPlayerDetails: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("fetchSchoolPlayerDetails", data));
        } catch (e) {}
    },

    PdeleteSchoolPlayer: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("deleteSchoolPlayer_NoTeam", data));
        } catch (e) {}
    },

    PgetPlayerDetails: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            data = data.replace("\\", "");
            var xData = JSON.parse(data);
            return (Meteor.call("getPlayerDetails", xData.userId));
        } catch (e) {}
    },
    PgetTournamentTypesAndState:function(caller,apiKey){
        try{
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("getTournamentTypesAndState"));
        }catch(e){}
    },
    PgetWinnersListFromFinals:function(caller,apiKey,data){
        try{
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }

            var xData = data;

            if(typeof xData=="string"){
                data = data.replace("\\", "");
                xData = JSON.parse(data);
            }
            return (Meteor.call("getWinnersListFromFinals",xData));
        }catch(e){}
    },
    PgetAllSchoolDetails:function(caller,apiKey){
        try{
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("getAllSchoolDetails"));
        }catch(e){}
    },
    PgetTournamentIdForGivenType:function(caller,apiKey,data){
        try{
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }

            var xData = data

            if(typeof data == "string"){
                data = data.replace("\\", "");
                xData = JSON.parse(data);
            }
            return (Meteor.call("getTournamentIdForGivenType", xData));
        }catch(e){}
    },
    PaddSchoolCoach: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("addSchoolCoach", data));
        } catch (e) {}
    },

    PeditSchoolCoach: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("editSchoolCoach", data));
        } catch (e) {}
    },

    PdeleteSchoolCoach: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("deleteSchoolCoach", data));
        } catch (e) {}
    },

    PgetCoachesList: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("getCoachesList", data));
        } catch (e) {}
    },

    PgetTeamFormatList: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("getTeamFormatList", data));
        } catch (e) {}
    },

    PgetDomainList: function(caller, apiKey) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("getDomainList"));
        } catch (e) {}
    },

    //create and team for school
    PcreateTeamAndSubscribe: function(caller, apiKey, data) {
        try {
         
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                return (Meteor.call("createTeamForSchoolWithArguement", data, apiKey));
            }
        } catch (e) {}
    },

    PupdateTeamAndSubscribe: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                return (Meteor.call("updateTeamForSchoolWithArguement", data, apiKey));
            }
        } catch (e) {}
    },

    PdeletePlayerFromTeam: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                return (Meteor.call("deletePlayerFromTeam", data, apiKey));
            }
        } catch (e) {}
    },

    PorganizerTournamentsBasedOnApiDomain: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                return (Meteor.call("organizerTournamentsBasedOnApiDomain", apiKey, data));
            }
        } catch (e) {}
    },

    PgetEntriesOfTeamEvent: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                data = data.replace("\\", "");
                var param = JSON.parse(data);
                return (Meteor.call("getEntriesOfTeamEvent", param, apiKey));
            }
        } catch (e) {}
    },

    PgetEntriesOfEvent: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                var param = data;
                
                if(typeof data == "string"){
                    data = data.replace("\\", "");
                    param = JSON.parse(data);
                }
                
                var doa = events.findOne({
                    "tournamentId": param.tournamentId,
                    "eventName": param.eventName
                });
                if (doa == undefined) {
                    doa = pastEvents.findOne({
                        "tournamentId": param.tournamentId,
                        "eventName": param.eventName
                    });
                }
                if (doa) {
                    if (doa.projectType) {
                        projectType = doa.projectType;
                        if (projectType == 1)
                            return (Meteor.call("getEntriesOfIndividualEvent", apiKey, param));
                        else if (projectType == 2)
                            return (Meteor.call("getEntriesOfTeamEvent", param, apiKey));
                    }
                }
            }
        } catch (e) {}
    },
    PgetEventsNameBasedOnStateAndUser: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                var param = data;
                
                if(typeof data == "string"){
                    data = data.replace("\\", "");
                    param = JSON.parse(data);
                }
                
                if(data.apiUserId == undefined)
                {
                    var apiInfo = apiUsers.findOne({"apiUser": caller,"apiKey":apiKey});
                    if(apiInfo.userId)
                        data.apiUserId = apiInfo.userId;
                }
                return (Meteor.call("getEventsNameBasedOnStateAndUser", data));
            }
        } catch (e) {}
    },
    PgetLiveLinksForStateAndOrganizer: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                var param = data;
                
                if(typeof data == "string"){
                    data = data.replace("\\", "");
                    param = JSON.parse(data);
                }
                if(data.eventOrganizer == undefined)
                {
                    var apiInfo = apiUsers.findOne({"apiUser": caller,"apiKey":apiKey});
                    if(apiInfo.userId)
                        data.eventOrganizer = apiInfo.userId;
                }
                return (Meteor.call("getLiveLinksForStateAndOrganizer", data));
            }
        } catch (e) {}
    },
    PgetRoundsBasedOnStateAndUser: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                var param = data;
                
                if(typeof data == "string"){
                    data = data.replace("\\", "");
                    param = JSON.parse(data);
                }
                
                return (Meteor.call("getRoundsBasedOnStateAndUser", data));
            }
        } catch (e) {}
    },
    PgetMatchRecordsOnTournamentEventRound: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                var param = data;
                
                if(typeof data == "string"){
                    data = data.replace("\\", "");
                    param = JSON.parse(data);
                }
                
                return (Meteor.call("getMatchRecordsOnTournamentEventRound", data));
            }
        } catch (e) {}
    },
    PgetMatchRecordsOnTournamentEventFinal: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                var param = data;
                
                if(typeof data == "string"){
                    data = data.replace("\\", "");
                    param = JSON.parse(data);
                }
                
                if(data.apiUserId == undefined)
                {
                    var apiInfo = apiUsers.findOne({"apiUser": caller,"apiKey":apiKey});
                    if(apiInfo.userId)
                        data.apiUserId = apiInfo.userId;
                }
                return (Meteor.call("getMatchRecordsOnTournamentEventFinal", data));
            }
        } catch (e) {}
    },
    PgetSchoolPlayerDetailsFan: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                var param = data;
                
                if(typeof data == "string"){
                    data = data.replace("\\", "");
                    param = JSON.parse(data);
                }
                
                return (Meteor.call("getSchoolPlayerDetailsFan", data));
            }
        } catch (e) {}
    },
    PgetevenSportsDates:function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                var param = data;
                
                if(typeof data == "string"){
                    data = data.replace("\\", "");
                    param = JSON.parse(data);
                }
                
                if(data.eventOrganizer == undefined)
                {
                    var apiInfo = apiUsers.findOne({"apiUser": caller,"apiKey":apiKey});
                    if(apiInfo.userId)
                        data.eventOrganizer = apiInfo.userId;
                }
                return (Meteor.call("getevenSportsDates", data));
            }
        } catch (e) {}
    },
    PteamDetailsSchoolsAPI:function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                var param = data;
                
                if(typeof data == "string"){
                    data = data.replace("\\", "");
                    param = JSON.parse(data);
                }
                
                return (Meteor.call("teamDetailsSchoolsAPI", data));
            }
        } catch (e) {}
    },
    PteamDetailedDrawsForTournamenIdEvent:function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                var param = data;
                
                if(typeof data == "string"){
                    data = data.replace("\\", "");
                    param = JSON.parse(data);
                }
                
                return (Meteor.call("teamDetailedDrawsForTournamenIdEvent", data));
            }
        } catch (e) {}
    },
    PgetEntriesForGivenStateIdAndAbbName: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                var param = data;
                
                if(typeof data == "string"){
                    data = data.replace("\\", "");
                    param = JSON.parse(data);
                }
                
                var doa = events.findOne({
                    "tournamentId": param.tournamentId,
                    "eventName": param.eventName
                });
                if (doa == undefined) {
                    doa = pastEvents.findOne({
                        "tournamentId": param.tournamentId,
                        "eventName": param.eventName
                    });
                }
                if (doa) {
                    if (doa.projectType) {
                        return (Meteor.call("getEntriesForGivenStateIdAndAbbName", data));
                    }
                }
            }
        } catch (e) {}
    },
    PgetTeamEntryDetailsForTeamEvent: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                return (Meteor.call("getTeamEntryDetailsForTeamEvent", data, apiKey));
            }
        } catch (e) {}
    },

    PgetEntriesOfIndividualEvent: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                return (Meteor.call("getEntriesOfIndividualEvent", data, apiKey));
            }
        } catch (e) {}
    },

    PgetTeamDetailsForSchool: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                return (Meteor.call("getTeamDetailsForSchool", data, apiKey));
            }
        } catch (e) {}
    },

    PgetTournamentDetailsForState: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                return (Meteor.call("getTournamentDetailsForState", data, apiKey));
            }
        } catch (e) {}
    },

    PsubscribedEventList: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                return (Meteor.call("subscribedEventList", apiKey, data));
            }
        } catch (e) {}
    },

    PdownloadEntriesView: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                return (Meteor.call("downloadEntriesView", data));
            }
        } catch (e) {}
    },

    PeventWiseSubscribersDownload_School: function(caller, apiKey, eventId, loggedID) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                var userId = Meteor.users.findOne({
                    "_id": loggedID
                })
                var doa = events.findOne({
                    "eventOrganizer": userId.userId.toString(),
                    "_id": eventId
                });
                if (doa) {
                    if (doa.projectType) {
                        projectType = doa.projectType;
                        if (projectType == 1)
                            return (Meteor.call("eventWiseSubscribersDownload_School", eventId, loggedID));
                        else if (projectType == 2)
                            return (Meteor.call("team_eventWiseSubscribersDownload_School", eventId, loggedID));
                    }
                } else {
                    var resultjson = {};
                    resultjson["status"] = "failure";
                    resultjson["resultID"] = "";
                    resultjson["response"] = "Event doesnt exist"
                    return resultjson;
                }
            }
        } catch (e) {}
    },

    PpasteventWiseSubscribersDownload: function(caller, apiKey, eventId, userId) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("pasteventWiseSubscribersDownload", eventId, userId));
        } catch (e) {}
    },

    PpasteventWiseSubscribersDownload_School: function(caller, apiKey, eventId, loggedID) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                var userId = Meteor.users.findOne({
                    "_id": loggedID
                })
                var doa = pastEvents.findOne({
                    "eventOrganizer": userId.userId.toString(),
                    "_id": eventId
                });
                //return (Meteor.call("pasteventWiseSubscribersDownload_School",eventId,userId));
                if (doa) {
                    if (doa.projectType) {
                        projectType = doa.projectType;
                        if (projectType == 1)
                            return (Meteor.call("pasteventWiseSubscribersDownload_School", eventId, loggedID));
                        else if (projectType == 2)
                            return (Meteor.call("pastteam_eventWiseSubscribersDownload_School", eventId, loggedID));
                    }
                } else {
                    var resultjson = {};
                    resultjson["status"] = "failure";
                    resultjson["resultID"] = "";
                    resultjson["response"] = "Event doesnt exist"
                    return resultjson;
                }
            }
        } catch (e) {}
    },

    PdownloadConsolidatedSubscribers_Team: function(caller, apiKey, tournamentId, userId) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            var eventList = "";
            var keyFields = ["Sl.No", "Name", "Affiliation ID", "Academy Name", "emailAddress", "Phone Number", "DOB"];
            var eventSettingsInfo = eventFeeSettings.findOne({
                "tournamentId": tournamentId
            })
            if (eventSettingsInfo) {
                eventList = eventSettingsInfo.teamEvents;
                for (var h = 0; h < eventList.length; h++) {
                    keyFields.push(eventList[h]);
                }
            }
            keyFields.push("Total");
            keyFields.push("Receipt");
            var response = Meteor.call("downloadConsolidatedSubscribers_Team", tournamentId, userId);
            var csv = Papa.unparse({
                fields: keyFields,
                data: response
            });
            return csv;
        } catch (e) {}
    },

    PdownloadConsolidatedSubscribers: function(caller, apiKey, tournamentId, userId) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            var eventList = "";
            var keyFields = ["Sl.No", "Name", "Affiliation ID", "Academy Name", "emailAddress", "Phone Number", "DOB"];
            var eventSettingsInfo = eventFeeSettings.findOne({
                "tournamentId": tournamentId
            })
            if (eventSettingsInfo) {
                eventList = eventSettingsInfo.singleEvents;
                for (var h = 0; h < eventList.length; h++) {
                    keyFields.push(eventList[h]);
                }
            }
            keyFields.push("Total");
            keyFields.push("Receipt");
            keyFields.push("Affiliation Status");
            var response = Meteor.call("downloadConsolidatedSubscribers", tournamentId, userId);
            var csv = Papa.unparse({
                fields: keyFields,
                data: response
            });
            return csv;
        } catch (e) {}
    },

    PacademySubscriptionDetails: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                return (Meteor.call("academySubscriptionDetails", data, apiKey));
            }
        } catch (e) {}
    },

    PacademySubscriptionToTournament: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                return (Meteor.call("academySubscriptionToTournament", data, apiKey));
            }
        } catch (e) {}
    },

    PgenericMailTemplate: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                data = data.replace("\\", "");
                var param = JSON.parse(data);
                return (Meteor.call("genericMailTemplate", param.tournamentId, param.eventName, param.toList, param.includeResults, param.message));
            }
        } catch (e) {
            return false;
        }
    },

    PanalyticsSummary: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("analyticsSummary", caller, apiKey, data));
        } catch (e) {}
    },



   


    PprintDrawsFrom5s: function(caller, apiKey, tournamentId, eventName, withScores) {
        try {


            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                var eventDetails = events.findOne({
                    "tournamentId": tournamentId,
                    "_id": eventName
                });

                if (eventDetails == undefined) {
                    eventDetails = pastEvents.findOne({
                        "tournamentId": tournamentId,
                        "_id": eventName
                    });
                    if (eventDetails == undefined) {
                        eventDetails = pastEvents.findOne({
                            "tournamentId": tournamentId,
                            "eventName": eventName
                        })
                        if (eventDetails == undefined) {
                            eventDetails = events.findOne({
                                "tournamentId": tournamentId,
                                "eventName": eventName
                            });
                        }
                    }
                }
                if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 1) {
                    var tournamentInfo = MatchCollectionDB.findOne({
                        'tournamentId': tournamentId,
                        'eventName': eventDetails.eventName,
                    });
                    if (tournamentInfo) {
                        if (tournamentInfo.matchRecords) {
                            return (Meteor.call("printDrawsSheet", tournamentId, eventDetails.eventName, withScores));
                            // return drawResults;
                        } else{
                            return "No results";
                        }
                    } else {
                        return "Invalid Data1"
                    }
                } else if (eventDetails && eventDetails.projectType && parseInt(eventDetails.projectType) == 2) {
                    var tournamentInfo = teamMatchCollectionDB.findOne({
                        'tournamentId': tournamentId,
                        'eventName': eventDetails.eventName,
                    });
                    if (tournamentInfo) {
                        if (tournamentInfo.matchRecords) {
                            return (Meteor.call("printDrawsSheetForTeamEvents", tournamentId, eventDetails.eventName, withScores));
                        } else
                            return "No results";
                    } else {
                        return "Invalid Data2"
                    }
                } else {
                    return "Invalid Data3"
                }
            }
        } catch (e) {
        }
    },

    PvalidatePromo: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("validatePromo", data));
        } catch (e) {}
    },
});