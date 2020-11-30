//get coachId, array of userIds, groupname
//check valid coach
//check array of userIds array
//create group
Meteor.methods({
    //create group by coach, consists of connected group members
    "createCoachConnectedGroup": function(xDATA) {
        var messageValidations = [];
        try {
            if (xDATA) {
                //var data = xDATA.replace("\\", "");
                //xDATA = JSON.parse(data);
            } else {
                var message = "Require all parameters"
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = message.toString();
                resultJson["data"] = false;
                //messageValidations.push(resultJson);
                return resultJson
            }
            //check for params
            if (xDATA && xDATA.coachId && xDATA.groupName && xDATA.groupMembers) {

                if(xDATA.groupMembers.length <= 0)
                {
                    var message = "Group contains empty members"
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = message.toString();
                    resultJson["data"] = false;
                    return resultJson
                }
                //check for valid coach
                var coachDet = Meteor.users.findOne({
                    userId: xDATA.coachId.trim(),
                    role: "Coach"
                });
                var otherUsersCoach = otherUsers.findOne({
                        userId: xDATA.coachId,
                        role: "Coach"
                    })
                    //if coach is valid
                if (coachDet && otherUsersCoach) {
                    if (xDATA.groupMembers.length !== 0) {
                        var groupName = xDATA.groupName.trim();
                        var groupMembers = xDATA.groupMembers;
                        var coachId = xDATA.coachId.trim();
                        var coachInsert = coachConnectedGroups.insert({
                            groupName: groupName,
                            loggedInId: coachId,
                            groupMembers: groupMembers
                        })
                        if (coachInsert) {
                            
                            var findMygroups = coachConnectedGroups.find({
                                "loggedInId": xDATA.coachId
                            },{fields:{"_id":1,"groupName":1}}).fetch();
                            if (findMygroups.length != 0) {
                                
                                var message = "Group created"
                                var resultJson = {};
                                resultJson["status"] = "success";
                                resultJson["response"] = message.toString();
                                resultJson["data"] = true;
                                resultJson["groups"] = findMygroups;
                                return resultJson

                            } else {
                                
                                var message = "Group created"
                                var resultJson = {};
                                resultJson["status"] = "success";
                                resultJson["response"] = message.toString();
                                resultJson["data"] = true;
                                return resultJson
                            }

                            
                            
                        } else {
                            var message = "Cannot create group"
                            var resultJson = {};
                            resultJson["status"] = "failure";
                            resultJson["response"] = message.toString();
                            resultJson["data"] = false;
                            //messageValidations.push(resultJson);
                            return resultJson
                        }
                    } else {
                        var message = "Group members cannot be empty"
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = message.toString();
                        resultJson["data"] = false;
                        //messageValidations.push(resultJson);
                        return resultJson
                    }
                } else {
                    var message = "Invalid coach"
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = message.toString();
                    resultJson["data"] = false;
                    //messageValidations.push(resultJson);
                    return resultJson
                }
            } else {
                var message = "Require all parameters"
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = message.toString();
                resultJson["data"] = false;
                //messageValidations.push(resultJson);
                return resultJson
            }

        } catch (e) {
            var message = "Invalid data"
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = e;
            resultJson["data"] = false;
            //messageValidations.push(resultJson);
            return resultJson
        }
    }
})


//get connected members
//validate coachId
//query for loggedInId or coachId, status: accepted
//based on toEntity query the details of group member

Meteor.methods({
    "getConnectedMembersToCreateGroup": function(xDATA) {
        try {
            //check for params
            if (xDATA) {
                if(typeof xDATA == "string")
                {
                    var data = xDATA.replace("\\", "");
                    xDATA = JSON.parse(data);  
                }
                
            } else {
                var message = "Require all parameters"
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = message.toString();
                resultJson["data"] = false;
                return resultJson
            }

            //check for valid coachId
            if (xDATA && xDATA.coachId) {
                //find coach id in db
                var det = Meteor.users.findOne({
                    "userId": xDATA.coachId,
                    role: "Coach"
                });;
                var otherUsersCoach = otherUsers.findOne({
                    "userId": xDATA.coachId,
                    role: "Coach"
                })
                if (det && otherUsersCoach) {
                    //find accepted connections for given coach
                    //player --> coach -- loggedInId
                    //coach --> coach -- loggedInId or coachId
                    //coach --> player -- playerId
                    var conreq = connectionRequests.aggregate([{
                        $match: {
                            $or: [{
                                loggedInId: xDATA.coachId
                            }, {
                                coachId: xDATA.coachId
                            }],
                            status: "accepted"
                        }
                    }]);
                    //if there are any accepted connection
                    if (conreq && conreq.length) {
                        var conreqAcc = conreq;
                        var membersAndMemberDet = [];
                        for (var i = 0; i < conreqAcc.length; i++) {
                            if (conreqAcc[i].toEntity && conreqAcc[i].loggedInRole) {
                                var entity = conreqAcc[i].toEntity.trim();
                                var role = conreqAcc[i].loggedInRole.trim();
                                //if loggedInrole is player and toentity is coach
                                //use loggedInId and db is player
                                if (entity.toLowerCase() == "coach" && role.toLowerCase() == "player") {
                                    if (conreqAcc[i].loggedInId) {
                                        var playerDet = Meteor.users.findOne({
                                            "userId": conreqAcc[i].loggedInId,
                                            "role":"Player"
                                        },{fields:{"userId":1,"userName":1,"_id":0,"role":1}})

                                        playerDet.requestSentById = conreqAcc[i].loggedInId
                                        playerDet.connectedReqId = conreqAcc[i]._id;
                                        playerDet.requestSentBy = role
                                        if (playerDet)
                                            membersAndMemberDet.push(playerDet)
                                    }
                                }
                                //if loggedInrole is coach and toentity is coach
                                else if (entity.toLowerCase() == "coach" && role.toLowerCase() == "coach") {
                                    //when current logid eq loggedIn, use coachId and otherUsers db
                                    if (conreqAcc[i].loggedInId && conreqAcc[i].loggedInId == xDATA.coachId) {
                                        var coachIdDet = conreqAcc[i].coachId;
                                        var coachDet = otherUsers.findOne({
                                            userId: coachIdDet
                                        },{fields:{"userId":1,"userName":1,"_id":0,"role":1}})
                                        coachDet.requestSentBy = role
                                        coachDet.connectedReqId = conreqAcc[i]._id;
                                        coachDet.requestSentById = conreqAcc[i].loggedInId
                                        if (coachDet)
                                            membersAndMemberDet.push(coachDet)
                                    }
                                    //when current logid eq coachID,user  loggedInId and otherUsers db   
                                    if (conreqAcc[i].coachId && conreqAcc[i].coachId == xDATA.coachId) {
                                        var coachIdDet = conreqAcc[i].loggedInId;
                                        var coachDet = otherUsers.findOne({
                                            userId: coachIdDet
                                        },{fields:{"userId":1,"userName":1,"_id":0,"role":1}})
                                        coachDet.requestSentBy = role
                                        coachDet.requestSentById = conreqAcc[i].loggedInId
                                        coachDet.connectedReqId = conreqAcc[i]._id;
                                        if (coachDet)
                                            membersAndMemberDet.push(coachDet)
                                    }
                                }

                                //if loggedInrole is coach and toentity is player
                                //use playerId and db is player
                                else if (entity.toLowerCase() == "player" && role.toLowerCase() == "coach") {
                                    if (conreqAcc[i].playerId) {
                                        var playerDet = Meteor.users.findOne({
                                            "userId": conreqAcc[i].playerId,
                                            "role":"Player"
                                        },{fields:{"userId":1,"userName":1,"_id":0,"role":1}})
                                        playerDet.requestSentById = conreqAcc[i].loggedInId
                                        playerDet.requestSentBy = role
                                        playerDet.connectedReqId = conreqAcc[i]._id;
                                        if (playerDet)
                                            membersAndMemberDet.push(playerDet)
                                    }
                                }
                            }
                        }
                        //if there are connected members
                        if (membersAndMemberDet.length != 0) {
                            var message = "Connected Members"
                            var resultJson = {};
                            resultJson["status"] = "success";
                            resultJson["response"] = message.toString();
                            resultJson["data"] = membersAndMemberDet;
                            return resultJson
                        } else {
                            var message = "There are no connected members"
                            var resultJson = {};
                            resultJson["status"] = "failure";
                            resultJson["response"] = message.toString();
                            resultJson["data"] = false;
                            return resultJson
                        }
                    } else {
                        var message = "There are no connected members"
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = message.toString();
                        resultJson["data"] = false;
                        return resultJson
                    }
                } else {
                    var message = "Coach is not valid"
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = message.toString();
                    resultJson["data"] = false;
                    return resultJson
                }
            } else {
                var message = "Coach is not valid"
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = message.toString();
                resultJson["data"] = false;
                return resultJson
            }

        } catch (e) {
            var message = "Invalid data"
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = e;
            resultJson["data"] = false;
            return resultJson
        }
    }
});

//get my groups
//validate coachId
//check for groups
//get the groups (groupId, group name, group membrs, created date)
Meteor.methods({
    "getCoachGroups": function(xDATA) {
        try {
            if (xDATA) {
                var data = xDATA.replace("\\", "");
                xDATA = JSON.parse(data);
            } else {
                var message = "Require all parameters"
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = message.toString();
                resultJson["data"] = false;
                return resultJson
            }
            //check for params
            if (xDATA && xDATA.coachId) {
                //check for valid coach
                var coachDet = Meteor.users.findOne({
                    userId: xDATA.coachId.trim(),
                    role: "Coach"
                });
                var otherUsersCoach = otherUsers.findOne({
                        userId: xDATA.coachId,
                        role: "Coach"
                    })
                    //if coach is valid
                if (coachDet && otherUsersCoach) {
                    var findMygroups = coachConnectedGroups.find(
                        {$or:[
                            {"loggedInId": xDATA.coachId},
                            {"groupMembers":{$in:[xDATA.coachId]}}
                        ]}).fetch();
                    if (findMygroups.length != 0) {
                        var message = "Groups"
                        var resultJson = {};
                        resultJson["status"] = "success";
                        resultJson["response"] = message.toString();
                        resultJson["data"] = findMygroups;
                        return resultJson
                    } else {
                        var message = "No groups"
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = message.toString();
                        resultJson["data"] = false;
                        return resultJson
                    }
                } else {
                    var message = "Invalid coach"
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = message.toString();
                    resultJson["data"] = false;
                    return resultJson
                }
            } else {
                var message = "Require all parameters"
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = message.toString();
                resultJson["data"] = false;
                return resultJson
            }

        } catch (e) {
            var message = "Invalid data"
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = e;
            resultJson["data"] = false;
            return resultJson
        }
    }
});

//get my group details
//validate coachId
//validate groupId
//send group details along with member details
Meteor.methods({
    "groupDetailsOfCoach": function(xDATA) {
        try {
            if (xDATA) {
                var data = xDATA.replace("\\", "");
                xDATA = JSON.parse(data);
            } else {
                var message = "Require all parameters"
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = message.toString();
                resultJson["data"] = false;
                return resultJson
            }
            //check for params
            if (xDATA && xDATA.coachId && xDATA.groupId) {
                //check for valid coach
                var coachDet = Meteor.users.findOne({
                    userId: xDATA.coachId.trim(),
                });
               
                    //if coach is valid
                if (coachDet ) {
                    var findMygroups = coachConnectedGroups.findOne({
                        "_id": xDATA.groupId
                    },{fields:{"groupName":1,"_id":1,"groupMembers":1,"loggedInId":1}})
                    if (findMygroups) {
                        var memberIDs = [];
                        var memebersDet = [];

                        if(findMygroups.loggedInId)
                        {
                            findMygroups.teamManager = findMygroups.loggedInId;
                            var teamManagerInfo = Meteor.users.findOne({"userId":findMygroups.loggedInId});
                            if(teamManagerInfo)
                                findMygroups.teamManagerName = teamManagerInfo.userName;
                        }
                        //if there are group members
                        if (findMygroups.groupMembers) {
                            memberIDs = findMygroups.groupMembers
                        }
                        //find group member details
                        if (memberIDs) {
                            var memberDetailsInfo = Meteor.users.find({"userId":{$in:memberIDs}},{fields:{"userId":1,"userName":1,"_id":0,"role":1}}).fetch();

                            /*for (var i = 0; i < memberIDs.length; i++) {
                                var memId = memberIDs[i];
                                //find role
                                var memROle = Meteor.users.findOne({
                                    "userId": memId
                                });
                                //if role is player, fetch details from userDetailssTT
                                if (memROle && memROle.role == "Player") {
                                    var userDet = userDetailssTT.findOne({
                                        "userId": memId
                                    });
                                    if (userDet)
                                        memebersDet.push(userDet)
                                }
                                //if role is coach find det from otherUsers db
                                else if (memROle && memROle.role == "Coach") {
                                    var coachDet = otherUsers.findOne({
                                        "userId": memId
                                    })
                                    if (coachDet)
                                        memebersDet.push(coachDet)
                                }

                            }*/
                            findMygroups.membersDetails = memberDetailsInfo
                        }

                        var message = "Group details"
                        var resultJson = {};
                        resultJson["status"] = "success";
                        resultJson["response"] = message.toString();
                        resultJson["data"] = findMygroups;
                        return resultJson
                    } else {
                        var message = "No group"
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = message.toString();
                        resultJson["data"] = false;
                        return resultJson
                    }
                } else {
                    var message = "Invalid user"
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = message.toString();
                    resultJson["data"] = false;
                    return resultJson
                }
            } else {
                var message = "Require all parameters"
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = message.toString();
                resultJson["data"] = false;
                return resultJson
            }

        } catch (e) {
            var message = "Invalid data"
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = e;
            resultJson["data"] = false;
            return resultJson
        }
    }
})

//update group
Meteor.methods({
    "updateCoachConnectedGroup": async function(xDATA) {
        try {
            if (xDATA) {
                //var data = xDATA.replace("\\", "");
                //xDATA = JSON.parse(data);
            } else {
                var message = "Require all parameters"
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = message.toString();
                resultJson["data"] = false;
                return resultJson
            }
            //check for params
            if (xDATA && xDATA.coachId && xDATA.groupName && xDATA.groupMembers && xDATA.groupId) {
                //check for valid coach
                var coachDet = Meteor.users.findOne({
                    userId: xDATA.coachId.trim(),
                    role: "Coach"
                });
                var otherUsersCoach = otherUsers.findOne({
                        userId: xDATA.coachId,
                        role: "Coach"
                    })
                    //if coach is valid
                if (coachDet && otherUsersCoach) {
                    //if there are group members
                    if (xDATA.groupMembers.length !== 0) {
                        var groupName = xDATA.groupName.trim();
                        var groupMembers = xDATA.groupMembers;
                        var coachId = xDATA.coachId.trim();
                        //find the group exists
                        var coachGroupFind = coachConnectedGroups.findOne({
                            "_id": xDATA.groupId
                        })
                        if (coachGroupFind) {
                            //update the group
                            var updateGroupDet = coachConnectedGroups.update({
                                "_id": xDATA.groupId
                            }, {
                                $set: {
                                    groupName: xDATA.groupName,
                                    groupMembers: xDATA.groupMembers,
                                }
                            });

                            var groupMessageExists = coachAPPINSentBOX.find({"receiverRole" : "Group", "receiverId" :xDATA.groupId}).fetch();
                            if(groupMessageExists)
                            {
                                coachAPPINSentBOX.update({"receiverRole" : "Group", "receiverId" :xDATA.groupId},
                                    {$set:{"receiverName":xDATA.groupName}},
                                    {multi:true}

                                    );
                            }
                            if (updateGroupDet) {

                                var findGroup = coachConnectedGroups.findOne({
                                    "_id": xDATA.groupId
                                });
                                if (findGroup)
                                    updateGroupDet = findGroup;

                                var findMygroups = coachConnectedGroups.find({
                                    "loggedInId": xDATA.coachId},
                                    {fields:{"_id":1,"groupName":1}}).fetch();                       

                                //code to be done

                                var findMygroups = coachConnectedGroups.findOne({
                                "_id": xDATA.groupId
                                },{fields:{"groupName":1,"_id":1,"groupMembers":1}});
                                var message = "Group updated"
                                var resultJson = {};
                                resultJson["status"] = "success";
                                resultJson["response"] = message.toString();
                                if (findMygroups) 
                                {
                                    var memberIDs = [];
                                    var memebersDet = [];
                                    //if there are group members
                                    if (findMygroups.groupMembers) 
                                    {
                                        memberIDs = findMygroups.groupMembers
                                    }
                                    //find group member details
                                    if (memberIDs) 
                                    {
                                        var memberDetailsInfo = Meteor.users.find({"userId":{$in:memberIDs}},{fields:{"userId":1,"userName":1,"_id":0,"role":1}}).fetch();                  
                                        findMygroups.membersDetails = memberDetailsInfo
                                    }
                                    var connectedUsers = [];
                                    var connectedResult = await Meteor.call("getConnectedMembersToCreateGroup",xDATA);
                                    try{
                                        if(connectedResult)
                                        {
                                            if(connectedResult.status)
                                            {
                                                if(connectedResult.status == "success")
                                                {
                                                    if(connectedResult.data)
                                                        connectedUsers = connectedResult.data
                                                }
                                            }
                                        }
                                    }catch(e){

                                    }
                                resultJson["groupDetails"] = findMygroups;
                                if(connectedUsers.length > 0)
                                    resultJson["connectedUsers"] = connectedUsers;
                                }
                                
                                return resultJson
                            } else {
                                var message = "Group cannot be updated"
                                var resultJson = {};
                                resultJson["status"] = "failure";
                                resultJson["response"] = message.toString();
                                resultJson["data"] = false;
                                return resultJson
                            }
                        } else {
                            var message = "Invalid Group"
                            var resultJson = {};
                            resultJson["status"] = "failure";
                            resultJson["response"] = message.toString();
                            resultJson["data"] = false;
                            return resultJson
                        }
                    } else {
                        var message = "Group members cannot be empty"
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = message.toString();
                        resultJson["data"] = false;
                        return resultJson
                    }
                } else {
                    var message = "Invalid coach"
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = message.toString();
                    resultJson["data"] = false;
                    return resultJson
                }
            } else {
                var message = "Require all parameters"
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = message.toString();
                resultJson["data"] = false;
                return resultJson
            }

        } catch (e) {
            var message = "Invalid data"
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = e;
            resultJson["data"] = false;
            return resultJson
        }
    }
});

//delete group member
//validate coach
//validate group id
//validate member id in group
//remove the group member
//update the group -- doubt?
Meteor.methods({
    "deleteGroupMemberFromCoach": async function(xDATA) {
        try {
            if (xDATA) {

                //var data = xDATA.replace("\\", "");
                //xDATA = JSON.parse(data);
            
            } else {
                var message = "Require all parameters"
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = message.toString();
                resultJson["data"] = false;
                return resultJson
            }
            //check for params
            if (xDATA && xDATA.coachId && xDATA.memberId && xDATA.groupId) {
                //check for valid coach
                var coachDet = Meteor.users.findOne({
                    userId: xDATA.coachId.trim(),
                    role: "Coach"
                });
                var otherUsersCoach = otherUsers.findOne({
                        userId: xDATA.coachId,
                        role: "Coach"
                    })
                    //if coach is valid
                if (coachDet && otherUsersCoach) {
                    var coachId = xDATA.coachId.trim();
                    //find the group exists
                    var coachGroupFind = coachConnectedGroups.findOne({
                        "_id": xDATA.groupId
                    })
                    if (coachGroupFind) {
                        //update the group by pulling the member
                        var updateGroupDet = coachConnectedGroups.update({
                            "_id": xDATA.groupId
                        }, {
                            $pull: {
                                groupMembers: xDATA.memberId,
                            }
                        });
                        if (updateGroupDet) 
                        {
                           
                            var findMygroups = coachConnectedGroups.findOne({
                                "_id": xDATA.groupId
                                },{fields:{"groupName":1,"_id":1,"groupMembers":1}});

                            if (findMygroups) 
                            {
                                var memberIDs = [];
                                var memebersDet = [];
                                //if there are group members
                                if (findMygroups.groupMembers) 
                                {
                                    memberIDs = findMygroups.groupMembers
                                }
                                //find group member details
                                if (memberIDs) 
                                {
                                    var memberDetailsInfo = Meteor.users.find({"userId":{$in:memberIDs}},{fields:{"userId":1,"userName":1,"_id":0,"role":1}}).fetch();                  
                                    findMygroups.membersDetails = memberDetailsInfo
                                }
                                var connectedUsers = [];
                                var connectedResult = await Meteor.call("getConnectedMembersToCreateGroup",xDATA);
                                try{
                                    if(connectedResult)
                                    {
                                        if(connectedResult.status)
                                        {
                                            if(connectedResult.status == "success")
                                            {
                                                if(connectedResult.data)
                                                    connectedUsers = connectedResult.data
                                            }
                                        }
                                    }
                                }catch(e){
                                    
                                }
                                var message = "Deleted the member from group"
                                var resultJson = {};
                                resultJson["status"] = "success";
                                resultJson["response"] = message.toString();
                                resultJson["groupDetails"] = findMygroups;
                                if(connectedUsers.length > 0)
                                    resultJson["connectedUsers"] = connectedUsers;

                                return resultJson
                            }
                           
                        } else {
                            var message = "Group member cannot be deleted"
                            var resultJson = {};
                            resultJson["status"] = "failure";
                            resultJson["response"] = message.toString();
                            resultJson["data"] = false;
                            return resultJson
                        }
                    } else {
                        var message = "Invalid Group"
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = message.toString();
                        resultJson["data"] = false;
                        return resultJson
                    }

                } else {
                    var message = "Invalid coach"
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = message.toString();
                    resultJson["data"] = false;
                    return resultJson
                }
            } else {
                var message = "Require all parameters"
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = message.toString();
                resultJson["data"] = false;
                return resultJson
            }

        } catch (e) {
            var message = "Invalid data"
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = e;
            resultJson["data"] = false;
            return resultJson
        }
    }
});


