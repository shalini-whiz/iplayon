connectionRequests.after.insert(function (userId, doc) {
	try{
		if(doc && doc.receiverId && doc.loggedInId){
			var userName = Meteor.users.findOne({
				userId:doc.loggedInId
			})
			if(userName && userName.userName){
				var data = {
					"title":"A New Connection Request", 
		            "body":"From " + userName.userName, 
		            "sound":"default", 
		            "badge": "0",
		            "topic":doc.receiverId,
		            "categoryIdentifier":"connectionRequest"
				}
				var data2 = {
					"senderId":doc.loggedInId
				}

				var topictype = 1
				Meteor.call("sendNotification",data,data2,topictype,function(e,res){})
			}
		}
	}catch(e){
	}
});

connectionRequests.after.update(function (userId, doc) {
    try{
        if(doc && doc.receiverId && doc.loggedInId && doc.status && doc.status == "accepted"){
            var userName = Meteor.users.findOne({
                userId:doc.receiverId
            })
            if(userName && userName.userName){
                var data = {
                    "title":userName.userName, 
                    "body":"Accepted your connection request", 
                    "sound":"default", 
                    "badge": "0",
                    "topic":doc.loggedInId,
                    "categoryIdentifier":"connectionRequestAccepted"
                }
                var data2 = {
                    "senderId":doc.receiverId
                }

                var topictype = 1
                Meteor.call("sendNotification",data,data2,topictype,function(e,res){})
            }
        }
    }catch(e){
    }
});

Meteor.methods({
    rejectedRequestNotification:function(rejectedBy,doc){
        try{

            var topic = ""

            if(doc && doc.receiverId && doc.loggedInId){
                var userName = Meteor.users.findOne({
                    userId:rejectedBy
                })
                if(doc.receiverId == rejectedBy){
                    topic = doc.loggedInId
                }
                else{
                    topic = doc.receiverId
                }
                if(userName && userName.userName){

                    var data = {
                        "title":userName.userName, 
                        "body":"Rejected your connection request", 
                        "sound":"default", 
                        "badge": "0",
                        "topic":topic,
                        "categoryIdentifier":"connectionRejected"
                    }

                    var data2 = {
                        "senderId":rejectedBy
                    }

                    var topictype = 1
                    Meteor.call("sendNotification",data,data2,topictype,function(e,res){})
                }
            }
        }catch(e){
        }
    }
})


coachConnectedGroups.after.insert(function (userId, doc, fieldNames, modifier) {
    try{
 
        if(doc && doc.loggedInId && doc.groupName && doc.groupMembers
            && doc.groupMembers.length){

            var userName = Meteor.users.findOne({
                userId:doc.loggedInId
            })

            if(userName && userName.userName){
                var data = {
                    "body":"You are now a member to the group " + doc.groupName , 
                    "title":userName.userName, 
                    "sound":"default", 
                    "badge": "0",
                    "topic":doc.groupMembers,
                    "categoryIdentifier":"groupCreation"                    
                }
                var data2 = {
                    "senderId":doc._id,
                    "doc":doc
                }

                var topictype = 3
                Meteor.call("sendNotification",data,data2,topictype,function(e,res){})
            }
        }
    }catch(e){
    }
});

coachConnectedGroups.after.update(function (userId, doc, fieldNames, modifier) {
    try{
        beforeGroupUpdate = doc
        var prev = this.previous

        if(prev._id && doc._id && prev._id == doc._id && doc.loggedInId){

            var userName = Meteor.users.findOne({
                userId:doc.loggedInId
            })

            //check for group name updated
            if(userName && userName.userName && doc.groupName && prev.groupName && doc.groupName != prev.groupName){
                var data = {
                    "body": "Renamed the group from " + prev.groupName + " to " + doc.groupName, 
                    "title":userName.userName, 
                    "sound":"default", 
                    "badge": "0",
                    "topic":prev.groupMembers,
                    "categoryIdentifier":"renamedGroup"                    
                }

                var data2 = {
                    "senderId":doc._id,
                    "doc":doc
                }

                var topictype = 3
                Meteor.call("sendNotification",data,data2,topictype,function(e,res){})
            }

            //check for group members
            if(doc.groupMembers && prev.groupMembers){
                var a = doc.groupMembers
                var b = prev.groupMembers

                var addedMem = _.difference(a,b)
                var removedMem = _.difference(b,a);

                if(addedMem && addedMem.length){
                    if(userName && userName.userName){
                        var data = {
                            "body":"You are now a member to the group " + doc.groupName , 
                            "title":userName.userName, 
                            "sound":"default", 
                            "badge": "0",
                            "topic":addedMem,
                            "categoryIdentifier":"addedToGroup"                    
                        }
                        var data2 = {
                            "senderId":doc._id,
                            "doc":doc
                        }

                        var topictype = 3
                        Meteor.call("sendNotification",data,data2,topictype,function(e,res){})
                    }
                }
                if(removedMem && removedMem.length){
                    var data = {
                            "body":"You are no longer a member to the group " + prev.groupName , 
                            "title":userName.userName, 
                            "sound":"default", 
                            "badge": "0",
                            "topic":removedMem,
                            "categoryIdentifier":"removedFromGroup"                    
                        }
                        var data2 = {
                            "senderId":doc._id,
                            "doc":doc
                        }

                        var topictype = 3
                        Meteor.call("sendNotification",data,data2,topictype,function(e,res){})
                }
            }
        }
    }catch(e){
    }
});

coachConnectedGroups.after.remove(function (userId, doc, fieldNames, modifier) {
    try{
 
        if(doc && doc.loggedInId && doc.groupName && doc.groupMembers
            && doc.groupMembers.length){

            var userName = Meteor.users.findOne({
                userId:doc.loggedInId
            })

            if(userName && userName.userName){
                var data = {
                    "body":"Group " + doc.groupName + " has deleted" , 
                    "title":userName.userName, 
                    "sound":"default", 
                    "badge": "0",
                    "topic":doc.groupMembers,
                    "categoryIdentifier":"groupDeleted"                    
                }
                var data2 = {
                    "senderId":doc.loggedInId
                }

                var topictype = 3
                Meteor.call("sendNotification",data,data2,topictype,function(e,res){})
            }
        }
    }catch(e){
    }
});
