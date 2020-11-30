import {
    HTTP
}
from 'meteor/http'

Template.testAPICoach.onCreated(function() {
    this.subscribe("onlyLoggedIn")
    this.subscribe("authAddress");

});

Template.testAPICoach.onRendered(function() {

    Session.set("exampleJson", undefined);
    Session.set("resultJson",undefined);
});

Template.testAPICoach.helpers({
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
    "apiList": function() {
        try {
            //"viewTeams","deleteTeam",
            var listOfApi = ["sendConnectionRequest","getSentConnectionDetailsToPlayers","getSentConnectionDetailsToCoachByPlayers","getSentConnectionDetailsToCoachByCoach",
                            "getSentConnectionDetailsToCoachPlayerByCoach","getDetailsOfReceivedConnectionReq","acceptConnectionRequest",
                            "rejectConnectionRequest","createCoachConnectedGroup","getConnectedMembersToCreateGroup"
                            ,"getCoachGroups","groupDetailsOfCoach", "updateCoachConnectedGroup",
                            "deleteGroupMemberFromCoach","getConnectedMembersForGivenPlayerID","deleteConnectionRequestSentByLoggedInId",
                            "deleteAllConnectionReqReceivedByLoggedInId","sendTextMessageToPlayerByCoach",
                            "getInboxMessagesForLoggedInId","getALLEVEnts",
                            "getAssigments"
                            ];
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


Template.testAPICoach.events({
    "click #apiList": function(e) {
        var apiSelected = $("[name='apiList'] option:selected").attr("name");
        var xData = {};
            Session.set("resultJson",undefined)
       
        if(apiSelected=="sendConnectionRequest"){
            xData = {
                loggedInId:"otBbPe8YvxBYDcqfY",
                toEntity:"Player",
                receiverId:"DPysWR75iPkrGTGfv",
                loggedInRole:"Coach"
            }
        }
        else if(apiSelected =="getSentConnectionDetailsToPlayers")
        {
            xData = {
                "coachId": "otBbPe8YvxBYDcqfY"
            } 
        }
        else if(apiSelected == "getSentConnectionDetailsToCoachByPlayers"){
            xData = {
                "playerId":"25hnFwWRgHpcAPMK8"
            }
        }
        else if(apiSelected =="getSentConnectionDetailsToCoachByCoach")
        {
            xData = {
                "coachId": "otBbPe8YvxBYDcqfY"
            } 
        }
        else if(apiSelected =="getSentConnectionDetailsToCoachPlayerByCoach")
        {
            xData = {
                "coachId": "otBbPe8YvxBYDcqfY"
            } 
        }
        else if(apiSelected =="getDetailsOfReceivedConnectionReq")
        {
            xData = {
                "loggedInId": "otBbPe8YvxBYDcqfY",
                "statusType":"accepted" //pending //""
            } 
        }
        else if(apiSelected == "acceptConnectionRequest"){
            xData = {
                "loggedInId":"DPysWR75iPkrGTGfv",
                "connectionReqId":"uFD2ee3ySKw2iYpfA"
            }
        }
        else if(apiSelected == "rejectConnectionRequest"){
            xData = {
                "loggedInId":"DPysWR75iPkrGTGfv",
                "connectionReqId":"uFD2ee3ySKw2iYpfA"
            }
        }
        else if(apiSelected == "createCoachConnectedGroup"){
            xData = {
                "coachId":"ufAzaejdw3DEEJfGu",
                "groupName":"asd",
                "groupMembers":["otBbPe8YvxBYDcqfY"]
            }
        }
        else if(apiSelected == "getConnectedMembersToCreateGroup"){
            xData = {
                coachId:"ufAzaejdw3DEEJfGu"
            }
        }
        else if(apiSelected == "getCoachGroups"){
            xData = {
                coachId:"ufAzaejdw3DEEJfGu"
            }
        }
        else if(apiSelected == "groupDetailsOfCoach"){
            xData = {
                coachId:"ufAzaejdw3DEEJfGu",
                groupId:""
            }
        }
        else if(apiSelected == "updateCoachConnectedGroup"){
            xData = {
                "coachId":"ufAzaejdw3DEEJfGu",
                "groupName":"asd",
                "groupMembers":["otBbPe8YvxBYDcqfY"],
                "groupId":"JZh8NvjSXxeqLrb5ha"
            }
        }
        else if(apiSelected == "deleteGroupMemberFromCoach"){
            xData = {
                "coachId":"ufAzaejdw3DEEJfGu",
                "memeberId":"otBbPe8YvxBYDcqfY",
                "groupId":"JZh8NvjSXxeqLrb5ha"
            }
        }
        else if(apiSelected == "getConnectedMembersForGivenPlayerID"){
            xData = {
                playerId:"ufAzaejdw3DEEJfGu"
            }
        }
        else if(apiSelected == "deleteConnectionRequestSentByLoggedInId"){
            xData = {
                loggedInId:"",
                connectionReqId:""
            }
        }
        else if(apiSelected == "deleteAllConnectionReqReceivedByLoggedInId"){
            xData = {
                loggedInId:"",
                connectionReqId:""
            }
        }
        else if(apiSelected == "sendTextMessageToPlayerByCoach"){
            xData = {
                "senderId":"DPysWR75iPkrGTGfv",
                "messageType":"text",
                "receiverId":"otBbPe8YvxBYDcqfY",
                "textMessage":"Hi coach otBbPe8YvxBYDcqfY",
                "receiverType":"group"
            }
        }
        else if(apiSelected == "getInboxMessagesForLoggedInId"){
            xData = {
                "loggedInId":"DPysWR75iPkrGTGfv",
                /*"dateSortOrder":"-1",
                "senderNameSortOrder":"-1"*/
            }
        }
        else if(apiSelected == "getAssigments")
        {
            xData = {
                "loggedInId":"Z3ctorrNX2ywSpfjA",

            }
        }

        $("#inputJson").val(JSON.stringify(xData));

        Session.set("exampleJson", JSON.stringify(xData));
    },

    "click #testAPI": function(e) {

        var apiKey = "3b7dfced3428af5e22bf25461c8c54a2";
        var apiSelected = $("[name='apiList'] option:selected").attr("name");
        var inputJSON = $("#inputJson").val();
        var url = Meteor.absoluteUrl().toString();
        try {
            if (
                apiSelected == "sendConnectionRequest"||apiSelected == "acceptConnectionRequest" ||
                apiSelected == "rejectConnectionRequest"||apiSelected == "createCoachConnectedGroup"
                ||apiSelected == "updateCoachConnectedGroup"||apiSelected == "deleteGroupMemberFromCoach"
                ||apiSelected == "deleteConnectionRequestSentByLoggedInId" ||
                apiSelected == "deleteAllConnectionReqReceivedByLoggedInId" ||
                apiSelected == "sendTextMessageToPlayerByCoach") {

                HTTP.call("POST", url+"/dev/"+ apiSelected, {
                
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
            else if(apiSelected == "getALLEVEnts"){
                HTTP.call("GET", url+"/dev/"+ apiSelected, {
                    params: {
                        caller: "KTTA",
                        apiKey: "3b7dfced3428af5e22bf25461c8c54a2",
                    }
                }, function(error, result) {
                    if (!error) {
                        Session.set("resultJson",JSON.stringify(result.data))
                    }
                });
            }
            else {
                alert(apiSelected+" ... "+inputJSON);
                HTTP.call("GET", url+"/dev/"+ apiSelected, {
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