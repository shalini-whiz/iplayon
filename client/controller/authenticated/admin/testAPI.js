import {
    HTTP
}
from 'meteor/http'

Template.testAPI.onCreated(function() {
    this.subscribe("onlyLoggedIn")
    this.subscribe("authAddress");

});

Template.testAPI.onRendered(function() {

    Session.set("exampleJson", undefined);
    Session.set("resultJson",undefined);
});

Template.testAPI.helpers({
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
            var listOfApi = ["getResults","registerOtpCheck","changeUserPassword", "organizerTournamentsBasedOnApiDomain","downloadEntriesView","upcomingTournamentsOnApiKey","organizerTournaments","genericMailTemplate","registerIndividual","viewProfileIndividual","updateProfile","userLogin","otpForgotPassword","setNewPassword","getDomainList","getSchoolCreationDetails", "getResultsFilters", "registerEntity", "editSchool", "addSchoolPlayer", "editSchoolPlayer", "fetchSchoolPlayerDetails", "deleteSchoolPlayer", "getSchoolPlayerDetails", "addSchoolCoach", "editSchoolCoach", "deleteSchoolCoach","getCoachesList", "getTeamFormatList", "createTeamAndSubscribe", "updateTeamAndSubscribe","deletePlayerFromTeam","getTeamDetailsForSchool","subscribedEventList","eventWiseSubscribersDownload_school","pasteventWiseSubscribersDownload_school","downloadConsolidatedSubscribers","getTournamentDetailsForState","academySubscriptionDetails","academySubscriptionToTournament","getEntriesOfTeamEvent","getTeamEntryDetailsForTeamEvent","getEntriesOfIndividualEvent","getEntriesOfEvent"];
            return listOfApi;
        } catch (e) {

        }
    },
    "sampleJson": function() {
        if (Session.get("exampleJson")) {
            return Session.get("exampleJson");
        }

    },
    "resultJson":function()
    {
        if(Session.get("resultJson"))
            return Session.get("resultJson");
    }

});


Template.testAPI.events({
    "click #apiList": function(e) {
        var apiSelected = $("[name='apiList'] option:selected").attr("name");
        var xData = {};
            Session.set("resultJson",undefined)
        if(apiSelected == "userLogin")
            xData = {
                "userName" :"school1@gmail.com",
                "userPassword" : "abcdef"
            }
        else if(apiSelected == "registerOtpCheck")
        {
            xData = {
                "mailId" :"shalinikrishna0991@gmail.com"
            }
        }
        else if(apiSelected == "changeUserPassword")
        {
            xData = {
                "userId":"nGn3Khwt4XXMA7a36",
                "oldPassword":"abcdef",
                "newPassword":"123123"
            }
        }
        else if(apiSelected == "getEntriesOfEvent")
        {
            xData = {
                "tournamentId":"jFSQ8Q5W82YAFaEfN",
                "eventName":"Junior Boy's Singles"
            }
        }
        else if(apiSelected == "otpForgotPassword")
            xData = {
                "emailId" :"shalinikrishna0991@gmail.com"
            }
        else if(apiSelected == "setNewPassword")
            xData = {
               "emailId":"shalinikrishna0991@gmail.com",
               "password":"123123",
               "verificationCode":"5185"
            }
        else if(apiSelected == "registerIndividual")     
            xData = {
                "emailAddress":"organizer4@gmail.com",
                "password":"123123",
                "interestedProjectName":[""],
                "userName":"organizer4",
                "phoneNumber":"3333333333",
                "dateOfBirth":"07 May 2009",
                "role":"Organiser","gender":"Male",
                "address":"sdfsdfsdfdsf","city":"sdfd",
                "pinCode":"333333","country":"India",
                "state":"8va5A8N3EKAeKtmeB",
                "guardianName":"organizer4"
            }
        else if(apiSelected == "viewProfileIndividual")
            xData = {
                emailAddress:"player1@gmail.com"
            }
        else if(apiSelected == "updateProfile")
        {

            xData = {
                "emailAddress":"organizer4@gmail.com",
                "userName":"organizer4",
                "phoneNumber":"3333333333",
                "dateParam":"07 May 2009",
                "gender":"Male",
                "address":"sdfsdfsdfdsf","city":"sdfd",
                "pinCode":"333333",
                "state":"8va5A8N3EKAeKtmeB",
                "contactPerson":"organizer4",
                "abbrevation":"hhh",
                "interestedDomainName":["8va5A8N3EKAeKtmeB"]
            }
        }
        else if (apiSelected == "registerEntity")
            xData = {
                "userName": "school4",
                "abbrevation": "sdfsdf",
                "contactPerson": "dfsdf",
                "landline": "333",
                "phoneNumber": "3333333333",
                "emailAddress": "school4@gmail.com",
                "city": "sdfd",
                "state": "8va5A8N3EKAeKtmeB",
                "pinCode": "333333",
                "password": "abcdef",
                "interestedSport": "Table Tennis",
                "address": "",
                "role":"School"
            };

        else if (apiSelected == "editSchool")
            xData = {
                "userName": "school1",
                "contactPerson": "dfsdf",
                "landline": "222",
                "phoneNumber": "22222222",
                "city": "sdfd",
                "state": "8va5A8N3EKAeKtmeB",
                "pinCode": "222222",
                "address": "school1 address",
                "userId": "ej7NW8jhDSSS8qq5S",
            };
        else if (apiSelected == "addSchoolCoach")
            xData = {
                "userName": "coach5",
                "phoneNumber": "3333333333",
                "gender": "Male",
                "schoolID": "xk2TL87fd4AeepeZA",
            } 
        else if (apiSelected == "editSchoolCoach")
            xData = {
                "userName": "coach4",
                "phoneNumber": "3333333333",
                "gender": "Male",
                "schoolID": "xk2TL87fd4AeepeZA",
                "oldUserName": "coach4",
                "oldGender": "Male"
            } 
        else if(apiSelected == "deleteSchoolCoach")
        {
            xData = {
                "userName": "coach4",
                "phoneNumber": "3333333333",
                "gender": "Male",
                "schoolID": "xk2TL87fd4AeepeZA",   
            }
        }
        else if (apiSelected == "getCoachesList")
            xData = {
                "schoolID": "xk2TL87fd4AeepeZA"
            } 
        else if (apiSelected == "addSchoolPlayer")
            xData = {
                "userName": "player11",
                "dateOfBirth": "05 Sep 2010",
                "gender": "Male",
                "class": "5",
                "guardianName": "",
                "phoneNumber": "",
                "emailAddress": "",
                "address": "",
                "city": "",
                "pinCode": "",
                "domainID": "8va5A8N3EKAeKtmeB",
                "schoolID": "ej7NW8jhDSSS8qq5S",
                "category":"JB"
            } 

        else if (apiSelected == "editSchoolPlayer")
            xData = {
                "userName": "player11",
                "dateOfBirth": "05 Sep 2011",
                "gender": "Male",
                "class": "6",
                "guardianName": "",
                "phoneNumber": "",
                "emailAddress": "",
                "address": "",
                "city": "",
                "pinCode": "",
                "domainID": "8va5A8N3EKAeKtmeB",
                "userId": "4v4wywNPSdSBWDtHK",
                "schoolID": "ej7NW8jhDSSS8qq5S"
            } 
            else if(apiSelected == "fetchSchoolPlayerDetails")
            {
                xData = {
                "playerID": "QsMAYXQpZnCwn8Nmn"
            } 
            }
            else if (apiSelected == "deleteSchoolPlayer")
            xData = {
                "schoolID": "ej7NW8jhDSSS8qq5S",
                "playerID": "4v4wywNPSdSBWDtHK",
                "category":"JB"
            } 
            else if(apiSelected == "genericMailTemplate")
            {
                
                xData = {
                    "tournamentId": "kLjcqWWmYkMwbnpo6",
                    "eventName": "Cadet Boy's Singles",
                    "toList":"shalinikrishna0991@gmail.com,shalini.krishnan90@gmail.com",
                    "includeResults":true,
                    "message":"hello"
                } 
            }
            else if (apiSelected == "getSchoolPlayerDetails")
            xData = {
                userId: "4v4wywNPSdSBWDtHK"
            } 
            else if (apiSelected == "createTeamAndSubscribe") {
            var teamFormatId = "A2iS7HnLcuHbE9Doj";
            var playersDetails = [];
            var schoolID = "oj9JXm6wS6zGDBvzy";
            var source = "11Sports";
            var minNumberOfPlayers = true;
            var tournamentId = "XaNNEp6Quy7y93Hpz";
            var individualEventId = "SXWEjDK6HTJMAddoB";
            var teamEventId = "ngQJWxiHMgNZMgz9g";
            var eventName = "JB";
            var playerNo1 = {
                "playerNumber": "p1",
                "playerId": "98xWfJgbZDcGrAqiA",
                "individualEvent":true,
                "teamEvent":true
            }
            var playerNo2 = {
                "playerNumber": "p2",
                "playerId": "45afjNgLA9SSPGkrx",
                "individualEvent":false,
                "teamEvent":true
            }
            var playerNo3 = {
                "playerNumber": "p3",
                "playerId": "89B4pWPhvsG9L97Fo",
                "individualEvent":true,
                "teamEvent":false
            }

            playersDetails.push(playerNo1);
            playersDetails.push(playerNo2);
            playersDetails.push(playerNo3);

            xData = {
                playersDetails: playersDetails,
                schoolId: schoolID,
                minNumberOfPlayers: minNumberOfPlayers,
                eventName:eventName
                //tournamentId: tournamentId,
                //individualEventId: individualEventId,
                //teamEventId: teamEventId,
                //teamFormatId: teamFormatId
            }
        } else if (apiSelected == "updateTeamAndSubscribe") {
            var teamFormatId = "A2iS7HnLcuHbE9Doj";
            var playersDetails = [];
            var schoolID = "oj9JXm6wS6zGDBvzy";
            var source = "11Sports";
            var minNumberOfPlayers = false;
            var teamId = "rkWK5B3TR7fxPvJZt";
            var individualEventId = "SXWEjDK6HTJMAddoB";
            var teamEventId = "ngQJWxiHMgNZMgz9g";
            var tournamentId = "XaNNEp6Quy7y93Hpz";

            var playerNo1 = {
                "playerNumber": "p1",
                "playerId": "98xWfJgbZDcGrAqiA",
                "individualEvent":true,
                "teamEvent":true
            }
            var playerNo2 = {
                "playerNumber": "p2",
                "playerId": "45afjNgLA9SSPGkrx",
                "individualEvent":true,
                "teamEvent":true
            }
            var playerNo3 = {
                "playerNumber": "p3",
                "playerId": "89B4pWPhvsG9L97Fo",
                "individualEvent":true,
                "teamEvent":true
            }

            playersDetails.push(playerNo1);
            playersDetails.push(playerNo2);
            playersDetails.push(playerNo3);

            xData = {
                playersDetails: playersDetails,
                schoolId: schoolID,
                minNumberOfPlayers: minNumberOfPlayers,
                eventName:"JB",
                teamId:teamId
            }

        }
        else if(apiSelected =="deletePlayerFromTeam"){
            xData = {
                teamId: "rkWK5B3TR7fxPvJZt",
                playerNumber: "p1",
                playerId: "98xWfJgbZDcGrAqiA",
                eventName:"JB",
                schoolId:"oj9JXm6wS6zGDBvzy"
            }
        }
        else if(apiSelected == "getTeamFormatList")
        {
            xData = {
                eventName:"JB"
            }
        }
        else if(apiSelected == "getTeamDetailsForSchool"){
            xData = {
                "stateId": "xk2TL87fd4AeepeZA",
                eventName:"JB"
            } 
        }
        else if(apiSelected == "getTeamEntryDetailsForTeamEvent"){
            xData = {
                "teamId":"rkWK5B3TR7fxPvJZt",
                "schoolId": "xk2TL87fd4AeepeZA",
            } 
        }
        else if(apiSelected == "getEntriesOfTeamEvent"){
            xData = {
                "tournamentId": "xk2TL87fd4AeepeZA",
                eventName:"JB"
            } 
        }
        else if(apiSelected == "getEntriesOfIndividualEvent")
        {
            xData = {
                "schoolId": "siNEQKYZDwAqn8B4X",
                eventName:"JB"
            }
        }
        else if(apiSelected =="downloadEntriesView")
        {
            xData = {
                "userId": "nGn3Khwt4XXMA7a36"
            } 
        }
        else if(apiSelected == "subscribedEventList")
            xData = {
                "tournamentId": "RggF62zzhGGH7P2qG"
            } 

        else if(apiSelected == "getTournamentDetailsForState"){
            xData = {
                stateId:"a3LkhsHt2rZGWp8wG"
            }
        }
        else if(apiSelected == "academySubscriptionDetails"){
            xData = {
                academyId:"a3LkhsHt2rZGWp8wG"
            }
        }
        else if(apiSelected=="academySubscriptionToTournament"){
            xData = {playersDetails:[
            {
                playerId:"3MtsZweBPeFWk6tyT",
                playerName:"RAJDIP KUNDU",
                gender:"Male",
                subscribedArrayList :["1","0","1","0","0","0"],
                dateOfBirth : "2004-03-07"
            },
            {
                playerId:"3cR93QeoAA7K2XKhd",
                playerName:"ABEER VICKY GUPTA",
                gender:"Male",
                subscribedArrayList :["1","0","1","0","0","0"],
                dateOfBirth : "2005-03-09"
            },
            {
                playerId:"2j54Y44LzfTRgmZic",
                playerName:"RAJANDRA PARMAR S S",
                gender:"Male",
                subscribedArrayList :["1","0","1","0","0","0"],
                dateOfBirth : "2004-04-17"
            },
            {
                playerId:"fsQCJcPvGPWfsw7zq",
                playerName:"PURVANSHI SANDEEP KOTIA",
                gender:"Female",
                subscribedArrayList :["1","0","1","0","0","0"],
                dateOfBirth : "2005-05-05"
            },
            {
                playerId:"9FsWwrPrGmZvTepva",
                playerName:"ANISHA SANJAY MEHTA",
                gender:"Female",
                subscribedArrayList :["1","0","1","0","0","0"],
                dateOfBirth : "1995-05-07"
            },
            {
                playerId:"83LzDmvAcDK2ueEip",
                playerName:"ARYA RAJENDRA THAKUR",
                gender:"Female",
                subscribedArrayList :["1","0","1","0","0","0"],
                dateOfBirth : "1995-05-07"
            },
            {
                playerId:"7L5REXFkHTwSch49u",
                playerName:"MANASI MAHENDRA CHIPLUNKAR",
                gender:"Female",
                subscribedArrayList :["1","0","1","0","0","0"],
                dateOfBirth : "2005-07-07"
            },
            {
                playerId:"7L5REXFkHTwSch495",
                playerName:"CHANDRAKANT VARADE",
                gender:"Female",
                subscribedArrayList :["1","0","1","0","0","0"],
                dateOfBirth : "2005-12-07"
            },
            {
                playerId:"2atNhkXwKEeuTmb2e",
                playerName:"ANSH SHARAD GOYAL",
                gender:"Male",
                subscribedArrayList :["1","0","1","0","0","0"],
                dateOfBirth : "2005-11-07"
            },
            {
                playerId:"2favjxQ6dSwpcRTYS",
                playerName:"HARSIMRAN SINGH HARDEEP SINGH NARANG",
                gender:"Male",
                subscribedArrayList :["1","0","1","0","0","0"],
                dateOfBirth : "2005-10-07"
            },
            {
                playerId:"2nYzxCRYaxneufSsB",
                playerName:"SARVESH NARESH CHIPLUNKAR",
                gender:"Male",
                subscribedArrayList :["1","0","1","0","0","0"],
                dateOfBirth : "2005-02-07"
            },
        ],
        tournamentId:"2nYzxCRYaxneufSs",
        academyId:"2FFFckjfdghdfjkg"
        };
        }
        $("#inputJson").val(JSON.stringify(xData));

        Session.set("exampleJson", JSON.stringify(xData));
    },

    "click #testAPI": function(e) {

        var apiKey = "3b7dfced3428af5e22bf25461c8c54a2";
        var apiSelected = $("[name='apiList'] option:selected").attr("name");
        var inputJSON = $("#inputJson").val();
        try {
            if (
                apiSelected == "registerIndividual" || apiSelected == "updateProfile" ||
                apiSelected == "registerEntity" || apiSelected == "editSchool" ||
                apiSelected == "addSchoolPlayer" || apiSelected == "editSchoolPlayer" ||
                apiSelected == "addSchoolCoach" || apiSelected == "editSchoolCoach" || 
                apiSelected == "deleteSchoolCoach" || 
                apiSelected == "createTeamAndSubscribe"||apiSelected == "deletePlayerFromTeam" || 
                apiSelected == "updateTeamAndSubscribe" || apiSelected=="academySubscriptionToTournament") {
                alert("jdghjdgf !!!")
                if(apiSelected == "createTeamAndSubscribe"){
                    inputJSON = {
                        "playersDetails": [{
                            "teamEvent": false,
                            "individualEvent": true,
                            "playerName": "Yashaswini Ghorpade",
                            "playerId": "E4FdCK2AiatYHZ5Q4",
                            "playerNumber": "p1"
                        }],
                        "schoolId": "wrj8qecNcLi6Jpupi",
                        "minNumberOfPlayers": true,
                        "eventName": "JG",
                        "tournamentId": "Q6RsWG35YfMgmEX4g"
                    }
                    apiSelected = "PcreateTeamAndSubscribe"
                }
                if(apiSelected == "updateTeamAndSubscribe"){
                    inputJSON = {
                        "playersDetails": [{
                            "teamEvent": true,
                            "individualEvent": true,
                            "playerId": "xHFiMWLcMomMBvZbM",
                            "playerNumber": "p1"
                        }],
                        "schoolId": "wrj8qecNcLi6Jpupi",
                        "minNumberOfPlayers": true,
                        "eventName": "JB",
                        "tournamentId": "Q6RsWG35YfMgmEX4g",
                        "teamId":"WXSikn3XwyJTbawZ7"
                    }
                    apiSelected = "PupdateTeamAndSubscribe"
                }
                else if(apiSelected == "registerIndividual"){
                    apiSelected = "PregisterIndividual"
                }
                alert(JSON.stringify(inputJSON))

                Meteor.call(apiSelected,"11EvenSports","021ab44154102aa8ba4089bc38ad3017",inputJSON,function(e,res){
                    if(e){
                        alert(JSON.stringify(e))
                    } else if(res){
                        alert(JSON.stringify(res))
                    }
                })

                /*HTTP.call("POST", "http://192.168.0.99:9080/dev/" + apiSelected, {
                
                    data: {
                        caller: "KTTA",
                        apiKey: "021ab44154102aa8ba4089bc38ad3017",
                        "data": inputJSON
                    }
                }, function(error, result) {
                    if (!error) {
                        Session.set("resultJson",JSON.stringify(result.data))

                    }
                });*/
            }
            else if(apiSelected == "genericMailTemplate")
            {
            
                HTTP.call("POST", "http://192.168.0.99:9080/dev/" + apiSelected, {
                        data: {
                            caller: "KTTA",
                            apiKey: "3b7dfced3428af5e22bf25461c8c54a2",
                            "data":inputJSON
                        }
                    }, function(error, result) {
                        if (!error) {
                            alert(JSON.stringify(result.data));
                            Session.set("resultJson",JSON.stringify(result.data))
                        }
                    });
            }
            else if(apiSelected == "deleteTeam")
            {
                  HTTP.call("POST", "http://192.168.0.99:9080/dev/" + apiSelected, {
                        data: {
                            caller: "KTTA",
                            apiKey: "3b7dfced3428af5e22bf25461c8c54a2",
                            "teamId":"TnzHsYRunPQCHLqPy",
                        }
                    }, function(error, result) {
                        if (!error) {
                            alert(JSON.stringify(result.data));
                            Session.set("resultJson",JSON.stringify(result.data))
                        }
                    });
            }
            else if(apiSelected == "userLogin" || apiSelected == "otpForgotPassword" || apiSelected == "setNewPassword")
            {

                var xData = JSON.parse(inputJSON);
                if(apiSelected == "userLogin")
                {

                    HTTP.call("POST", "http://192.168.0.99:9080/dev/apiUserLogin", {
                        data: {
                            caller: "KTTA",
                            apiKey: "3b7dfced3428af5e22bf25461c8c54a2",
                            "userName": xData.userName,
                            "userPassword":xData.userPassword
                        }
                    }, function(error, result) {
                        if (!error) {
                            Session.set("resultJson",JSON.stringify(result.data))
                        }
                    });
                }
                else if(apiSelected == "otpForgotPassword")
                {
                    HTTP.call("GET", "http://192.168.0.99:9080/dev/" + apiSelected, {
                        params: {
                            caller: "KTTA",
                            apiKey: "3b7dfced3428af5e22bf25461c8c54a2",
                            "emailId": xData.emailId,
                        }
                    }, function(error, result) {
                        if (!error) {
                            Session.set("resultJson",JSON.stringify(result.data))
                        }
                    });
                }
                else if(apiSelected == "setNewPassword")
                {

                    HTTP.call("POST", "http://192.168.0.99:9080/dev/" + apiSelected, {
                        data: {
                            caller: "KTTA",
                            apiKey: "3b7dfced3428af5e22bf25461c8c54a2",
                            "userId": xData.emailId,
                            "password":xData.password,
                            "verificationCode":xData.verificationCode
                        }
                    }, function(error, result) {
                        if (!error) {
                            Session.set("resultJson",JSON.stringify(result.data))
                        }
                    });


                }
                 
            }
            else if(apiSelected == "changeUserPassword")
            {
                HTTP.call("POST", "http://192.168.0.99:9080/dev/" + apiSelected, {
                        data: {
                            caller: "KTTA",
                            apiKey: "3b7dfced3428af5e22bf25461c8c54a2",
                            "data": inputJSON

                        }
                    }, function(error, result) {
                        if (!error) {
                            Session.set("resultJson",JSON.stringify(result.data))
                        }
                    });
            }
            else if(apiSelected == "registerOtpCheck")
            {
                HTTP.call("POST", "http://192.168.0.99:9080/dev/" + apiSelected, {
                        data: {
                            caller: "KTTA",
                            apiKey: "3b7dfced3428af5e22bf25461c8c54a2",
                            "data": inputJSON

                        }
                    }, function(error, result) {
                        if (!error) {
                            Session.set("resultJson",JSON.stringify(result.data))
                        }
                    });
            }
            else if(apiSelected == "getResults")
            {
                 HTTP.call("GET", "http://192.168.0.99:9080/dev/" + apiSelected, {
                        params: {
                            caller: "KTTA",
                            apiKey: "3b7dfced3428af5e22bf25461c8c54a2",
                            "tournamentId":"ZJg5u9K2jnP7uvvSk",
                            "eventName": "Cadet Boy's Singlesx",
                        }
                    }, function(error, result) {
                        if (!error) {
                            Session.set("resultJson",JSON.stringify(result.data))
                        }
                    });
            }
            else if(apiSelected == "eventWiseSubscribersDownload_school" || apiSelected == "pasteventWiseSubscribersDownload_school" || apiSelected == "downloadConsolidatedSubscribers")
            {
            	var param = ""
            	if(apiSelected == "eventWiseSubscribersDownload_school")
                {
                    param = "trLMGjqvt2xsPreRP"; //individual event
                    //param = "C5t3NuxNHviCxbzxG" //team event 
                }
            	else if(apiSelected == "pasteventWiseSubscribersDownload_school")
            		param = "BrGr5j47YHSruXwFe";
            	else if(apiSelected == "downloadConsolidatedSubscribers")
            	{
            		//param = "83DFJcddD8Ad9emkJ"; //upcoming
            		param = "rCrfexreAfxkfnnAk";
            	}

            	HTTP.call("GET", "http://192.168.0.99:9080/dev/" + apiSelected, {
                    params: {
                        caller: "KTTA",
                        apiKey: "3b7dfced3428af5e22bf25461c8c54a2",
                        "eventId": param,
                        "userId":"nGn3Khwt4XXMA7a36"
                    }
                }, function(error, result) {
                    if (!error) {
                        Session.set("resultJson",JSON.stringify(result.data))
                    }
                });
            }	
            else if(apiSelected =="organizerTournamentsBasedOnApiDomain")
            {
                 HTTP.call("GET", "http://192.168.0.99:9080/dev/" + apiSelected, {
                    params: {
                        caller: "KTTA",
                        apiKey: "3b7dfced3428af5e22bf25461c8c54a2",
                        "domainId":"8va5A8N3EKAeKtmeB"
                    }
                }, function(error, result) {
                    if (!error) {
                        Session.set("resultJson",JSON.stringify(result.data))
                    }
                });
            }
            else if(apiSelected == "organizerTournaments")
            {
                HTTP.call("GET", "http://192.168.0.99:9080/dev/" + apiSelected, {
                    params: {
                        caller: "KTTA",
                        apiKey: "3b7dfced3428af5e22bf25461c8c54a2",
                        "userId":"nGn3Khwt4XXMA7a36"
                    }
                }, function(error, result) {
                    if (!error) {
                        Session.set("resultJson",JSON.stringify(result.data))
                    }
                });
            }
            else if(apiSelected == "viewTeams")
            {
                HTTP.call("GET", "http://192.168.0.99:9080/dev/" + apiSelected, {
                    params: {
                        caller: "KTTA",
                        apiKey: "3b7dfced3428af5e22bf25461c8c54a2",
                        "userId":"EePtJ4LEaygnRtfxQ"
                    }
                }, function(error, result) {
                    if (!error) {
                        Session.set("resultJson",JSON.stringify(result.data))
                    }
                });
            }
            else {
                HTTP.call("GET", "http://192.168.0.99:9080/dev/" + apiSelected, {
                    params: {
                        caller: "KTTA",
                        apiKey: "3b7dfced3428af5e22bf25461c8c54a2",
                        "data": inputJSON
                    }
                }, function(error, result) {
                    if (!error) {
                        Session.set("resultJson",JSON.stringify(result.data))
                    }
                });
            }
        } catch (e) {
        }
    }
})