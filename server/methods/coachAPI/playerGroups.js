
Meteor.methods({
    "getMyGroups": function(xDATA) {
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
            if (xDATA && xDATA.userId) {
                //check for valid coach
                var userInfo = Meteor.users.findOne({
                    userId: xDATA.userId.trim(),
                });
                
                    //if user is valid
                if (userInfo) {
                    var findMygroups = coachConnectedGroups.find(
                    	{$or:[
                    		{"loggedInId": xDATA.userId},
                    		{"groupMembers":{$in:[xDATA.userId]}}
                    	]
                    }).fetch();
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
});

