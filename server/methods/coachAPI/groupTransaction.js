Meteor.methods({

    "updateCoachGroupName":function(xDATA)
    {
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
            if (xDATA && xDATA.coachId && xDATA.groupName  && xDATA.groupId) {
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
                    if (xDATA.groupName.length !== 0) 
                    {
                        var groupName = xDATA.groupName.trim();
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

                                
                                var message = "Group updated"
                                var resultJson = {};
                                resultJson["status"] = "success";
                                resultJson["response"] = message.toString();
                                resultJson["data"] = updateGroupDet;
                                resultJson["groups"] = findMygroups;
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
    },
    "deleteGroupCoach": function(xDATA) {
        try {
            if (xDATA) {
                
            } else {
                var message = "Require all parameters"
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = message.toString();
                resultJson["data"] = false;
                return resultJson
            }
            //check for params
            if (xDATA && xDATA.coachId && xDATA.groupId) 
            {
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
                if (coachDet && otherUsersCoach) 
                {
                    var coachId = xDATA.coachId.trim();
                    var coachGroupFind = coachConnectedGroups.findOne({
                        "_id": xDATA.groupId
                    })
                    if (coachGroupFind) 
                    {
                        //update the group by pulling the member


                        var groupMessageExists = coachAPPINSentBOX.find({"receiverRole" : "Group", "receiverId" :xDATA.groupId}).fetch();
                        var groupAssignmentExists = workAssignments.find({"receiverRole" : "Group", "receiverId" :xDATA.groupId}).fetch();

                        if(groupMessageExists.length > 0)
                        {
                          
                        
                            var resultJson = {};
                            resultJson["status"] = "failure";
                            resultJson["response"] = "Could not delete group as group contains messages";
                            return resultJson
                        
                        }
                        else if(groupAssignmentExists.length > 0)
                        {
                              var resultJson = {};
                            resultJson["status"] = "failure";
                            resultJson["response"] = "Could not delete group as group contains work assignments";
                            return resultJson
                        }
                        else
                        {
                            var deleteGroupTransc = coachConnectedGroups.remove(
                            {"_id": xDATA.groupId});

                            var findMygroups = coachConnectedGroups.find({
                                    "loggedInId": xDATA.coachId
                                },{fields:{"_id":1,"groupName":1}}).fetch();                       

                            if (deleteGroupTransc) 
                            {               
                                var resultJson = {};
                                resultJson["status"] = "success";
                                resultJson["response"] = "Group Deleted";
                                resultJson["groups"] = findMygroups;

                                return resultJson
                            } 
                            else 
                            {
                                var resultJson = {};
                                resultJson["status"] = "failure";
                                resultJson["response"] = "Could not delete group";
                                return resultJson
                            }
                        }
                        
                    } 
                    else 
                    {
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = "Invalid Group";
                        return resultJson
                    }

                } else {
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = "Invalid coach";
                    return resultJson
                }
            } 
            else 
            {
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = "Require all parameters";
                return resultJson;
            }

        } catch (e) {
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = e;
            return resultJson
        }
    },
    
    "fetchGroupDetailsOfCoach": async function(xDATA) {        
        try {
            var paramData = xDATA;
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
                    role: "Coach"
                });
                var otherUsersCoach = otherUsers.findOne({
                        userId: xDATA.coachId,
                        role: "Coach"
                    })
                    //if coach is valid
                if (coachDet && otherUsersCoach) {
                    var findMygroups = coachConnectedGroups.findOne({
                        "_id": xDATA.groupId
                    },{fields:{"groupName":1,"_id":1,"groupMembers":1}})
                    if (findMygroups) {
                        var memberIDs = [];
                        var memebersDet = [];
                        //if there are group members
                        if (findMygroups.groupMembers) {
                            memberIDs = findMygroups.groupMembers
                        }
                        //find group member details
                        if (memberIDs) {
                            var memberDetailsInfo = Meteor.users.find({"userId":{$in:memberIDs}},{fields:{"userId":1,"userName":1,"_id":0,"role":1}}).fetch();                  
                            findMygroups.membersDetails = memberDetailsInfo
                        }
                        var connectedUsers = [];
                        var connectedResult = await Meteor.call("getConnectedMembersToCreateGroup",paramData);
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

                        var message = "Group details"
                        var resultJson = {};
                        resultJson["status"] = "success";
                        resultJson["response"] = message.toString();
                        resultJson["data"] = findMygroups;
                        if(connectedUsers.length > 0)
                            resultJson["connectedUsers"] = connectedUsers;
                        


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