import {nameToCollection} from '../dbRequiredRole.js'

Meteor.methods({

	"fetchNonConnectionUsers":function(userId)
	{
		try{
			var allList = [];
			var raw = connectionRequests.rawCollection();
	      	var distinct = Meteor.wrapAsync(raw.distinct, raw);
	      	var connectedList = [];
	      	var connectedList1 = distinct('receiverId',{"loggedInId":userId});
	      	var connectedList2 = distinct('loggedInId',{"receiverId":userId});
	      	connectedList1.push(userId);
			var resultJson = {};
			var connectedList = _.union(connectedList1,connectedList2);

			var raw1 = schoolPlayers.rawCollection();
	      	var distinct1 = Meteor.wrapAsync(raw1.distinct, raw1);
	      	var schoolPlayersList = distinct1('userId');


	      	var finalPlayerList = _.union(connectedList,schoolPlayersList);

			var playerList = Meteor.users.aggregate([
		        {$match:{
					role:"Player","userId":{$nin:schoolPlayersList}
		        }},           
		        {$group: { "_id":{
		          "userName":"$userName",
		          "userId":"$userId",
		          "role":"$role"
		      	}
		        }},
		        {$project:{   
		          "userId":"$_id.userId",     
		          "userName":"$_id.userName",
		          "role":"$_id.role",
		          "_id":0,
		          "insensitive": { "$toLower": "$_id.userName" },
		        }},
		        {$sort: {"insensitive":1}}
      		]);


      		var coachList = otherUsers.aggregate([
		        {$match:{
					role:"Coach","userId":{$nin:connectedList}
		        }},           
		        {$group: { "_id":{
		          "userName":"$userName",
		          "userId":"$userId",
		          "role":"$role"
		      	}
		        }},
		        {$project:{   
		          "userId":"$_id.userId",     
		          "userName":"$_id.userName",
		          "role":"$_id.role",

		          "_id":0,
		          "insensitive": { "$toLower": "$_id.userName" },

		        }},
		        {$sort: {"insensitive":1}}
      		]);
      		allList = playerList.concat(coachList);

      		allList.sort( function( a, b ) {
    			return a.insensitive < b.insensitive ? -1 : a.insensitive > b.insensitive ? 1 : 0;
			});

			resultJson["playerList"] = playerList;
			resultJson["coachList"] = coachList;
			resultJson["allList"] = allList;



			return resultJson;


		}catch(e){


		}
	},
	"fetchNonConnectionUsersForPlayer":function(userId)
	{
		try{
			var raw = connectionRequests.rawCollection();
	      	var distinct = Meteor.wrapAsync(raw.distinct, raw);
	      	var connectedList1 = distinct('receiverId',{"loggedInId":userId});
	      	var connectedList2 = distinct('loggedInId',{"receiverId":userId});

	      	connectedList1.push(userId);
			var resultJson = {};
			var connectedList = _.union(connectedList1,connectedList2);

      		var coachList = otherUsers.aggregate([
		        {$match:{
					role:"Coach","userId":{$nin:connectedList}
		        }},           
		        {$group: { "_id":{
		          "userName":"$userName",
		          "userId":"$userId"}
		        }},
		        {$project:{   
		          "userId":"$_id.userId",     
		          "userName":"$_id.userName",
		          "_id":0,
		          "insensitive": { "$toLower": "$_id.userName" }
		        }},
		        {$sort: {"insensitive":1}}
      		]);
      		    	
			resultJson["coachList"] = coachList;
			return resultJson;


		}catch(e){


		}
	},
	viewUserProfile:function(userId)
	{
		try{
			var resultJson = {};
			var userProfile = Meteor.users.findOne({"userId":userId});
			if(userProfile)
			{
				if(userProfile.role == "Player")
				{
					var userInfo = nameToCollection(userId).findOne({"userId":userId});
					if(userInfo)
					{
						if(userInfo.state)
						{
							var domainInfo = domains.findOne({"_id":userInfo.state});
							if(domainInfo)
								userInfo["domainName"] = domainInfo.domainName;
						}
						if(userInfo.interestedProjectName)
						{
							var raw = tournamentEvents.rawCollection();
					      	var distinct = Meteor.wrapAsync(raw.distinct, raw);
					      	var interestedSport = distinct('projectMainName',{"_id": {$in:userInfo.interestedProjectName}});
							userInfo["interestedSport"] = interestedSport;
						}
						resultJson["status"] = "success";
						resultJson["message"] = "user found!!";
						resultJson["response"] = userInfo;

					}
					else
					{
						resultJson["status"] = "failure";
						resultJson["message"] = "user not found!!"
					}
				}
				else if(userProfile.role == "Coach")
				{
					var userInfo = otherUsers.findOne({"userId":userId});
					if(userInfo)
					{
						if(userInfo.state)
						{
							var domainInfo = domains.findOne({"_id":userInfo.state});
							if(domainInfo)
								userInfo["domainName"] = domainInfo.domainName;
						}
						if(userInfo.interestedProjectName)
						{
							var raw = tournamentEvents.rawCollection();
					      	var distinct = Meteor.wrapAsync(raw.distinct, raw);
					      	var interestedSport = distinct('projectMainName',{"_id": {$in:userInfo.interestedProjectName}});
							userInfo["interestedSport"] = interestedSport;
						}
						resultJson["status"] = "success";
						resultJson["message"] = "user found!!";
						resultJson["response"] = userInfo;
					}
					else
					{
						resultJson["status"] = "failure";
						resultJson["message"] = "user not found!!"
					}
				}
			}
			else
			{
				resultJson["status"] = "failure";
				resultJson["message"] = "user not found!!"
			}
			return resultJson;

		}catch(e)
		{

		}
	},
	"getDetailsOfReceivedNSentConnection":function(xDATA)
	{
		try{
			var messageValidations = [];
			var connectionRequestsDEt = [];
			//var playerConnection = [];
			//var coachConnection = [];

			//check for all parameters
			if(xDATA&&xDATA.loggedInId&&xDATA.statusType && xDATA.connectionType && xDATA.connectionRole)
			{
				//find valid login id
				var logDet = Meteor.users.findOne({"userId":xDATA.loggedInId});
				if(logDet&&(logDet.role=="Player"||logDet.role=="Coach"))
				{
					
					if(logDet.role=="Coach")
					{
						var queryForstatus = {};
						var queryForConnectionType = {};
						var queryForCoach1 = {"loggedInId":xDATA.loggedInId};
						var queryForCoach2 = {"coachId":xDATA.loggedInId};

						//query for the status (pending,accepted,rejected)
						if(xDATA.statusType.trim().toLowerCase() !='all' && xDATA.connectionType.trim().toLowerCase() !='all')
						{
							if(xDATA.statusType.trim().toLowerCase() == 'requestPending' || xDATA.statusType.trim().toLowerCase() == 'request pending')
								queryForstatus = {
									"status":"pending",
									"receiverId":xDATA.loggedInId

								}
							else if(xDATA.statusType.trim().toLowerCase() == 'invitationPending' || xDATA.statusType.trim().toLowerCase() == 'invitation pending')
								queryForstatus = {
									"status":"pending",
									"loggedInId":xDATA.loggedInId
								}
							else if(xDATA.statusType.trim().toLowerCase() == "accepted")
								queryForstatus = {
									"status":xDATA.statusType.trim().toLowerCase()
								}			           
						}
						

						if(xDATA.connectionRole.trim().toLowerCase() != "all")
						{
							queryForCoach1 = {
								"loggedInId":xDATA.loggedInId,
								"toEntity":xDATA.connectionRole.trim()
							}

							queryForCoach2 = {
								"loggedInRole":xDATA.connectionRole.trim(),
								"coachId":xDATA.loggedInId,

							}
						}

							


						
						//find the request comes to coachId
						connectionRequests.find({	
							$and:[
								{
									$or:[
										queryForCoach1,
										queryForCoach2
									]
								},
								queryForstatus

							]					
						}).fetch().forEach(function(e,i){
							var coachIdF = e;
	                        var coachDet;
	                        //find who has sent request
	                        //if coach get details of coach
	                        if(coachIdF.loggedInId == xDATA.loggedInId)
	                        {
	                        	if(coachIdF.toEntity=="Coach")
		                        {
		                            coachDet = otherUsers.findOne({
		                                "userId":coachIdF.receiverId,
		                            });

		                            if(coachDet){
		                              

		                                var coachName = "";

		                                if(coachDet.userName){
		                                    coachName = coachDet.userName
		                                }
		                                
		                                var data  = {
		                                	"connectionReqId":coachIdF._id,
		                                    "connecterId":coachDet.userId,
		                                    "connecterName":coachDet.userName,		                                    
		                                    "statusOfConnection":coachIdF.status,
		                                    "connectionSentDate":coachIdF.sentDateTime,
		                                    "connecterRole":coachDet.role,
		                                    "connectionType":"sent"

		                                }
		                                connectionRequestsDEt.push(data);
		                                //coachConnection.push(data);

		                            }
		                        }
		                        //find who has sent request
		                        //if player get details of player
		                        else if(coachIdF.toEntity=="Player")
		                        {
		                            var playerIdF = e;
		                            var playerDEt = nameToCollection(playerIdF.receiverId).findOne({
		                                "userId":playerIdF.receiverId,
		                                "role":"Player"
		                            });

		                            if(playerDEt){
		                                
		                                var playerName = "";

		                                if(playerDEt.userName){
		                                    playerName = playerDEt.userName
		                                }
		                               
		                                var data  = {
		                                	"connectionReqId":playerIdF._id,
		                                    "connecterId":playerDEt.userId,
		                                    "connecterName":playerName,		                                  
		                                    "statusOfConnection":playerIdF.status,
		                                    "connectionSentDate":playerIdF.sentDateTime,
		                                    "connecterRole":playerDEt.role,
		                                    "connectionType":"sent"

		                                }
		                                connectionRequestsDEt.push(data);
		                                //playerConnection.push(data);
		                            }
		                        }


	                        }
	                        else if(coachIdF.coachId == xDATA.loggedInId)
	                        {
	                        	
	                        	if(coachIdF.loggedInRole=="Coach")
		                        {
		                            coachDet = otherUsers.findOne({
		                                "userId":coachIdF.loggedInId,
		                            });

		                            if(coachDet){
		                               
		                                var coachName = "";

		                                if(coachDet.userName){
		                                    coachName = coachDet.userName
		                                }
		                               
		                                var data  = {
		                                	"connectionReqId":coachIdF._id,
		                                    "connecterId":coachDet.userId,
		                                    "connecterName":coachName,	                                    
		                                    "statusOfConnection":coachIdF.status,
		                                    "connectionSentDate":coachIdF.sentDateTime,
		                                    "connecterRole":"Coach",
		                                    "connectionType":"received"
		                                }
		                                connectionRequestsDEt.push(data);
		                                //coachConnection.push(data);
		                            }
		                        }
		                        //find who has sent request
		                        //if player get details of player
		                        else if(coachIdF.loggedInRole=="Player"){
		                            var playerIdF = e;
		                            var playerDEt = nameToCollection(playerIdF.loggedInId).findOne({
		                                "userId":playerIdF.loggedInId,
		                                "role":"Player"
		                            });

		                            if(playerDEt){
		                                
		                                var playerName = "";

		                                if(playerDEt.userName){
		                                    playerName = playerDEt.userName
		                                }
		                               

		                                var data  = {
		                                	"connectionReqId":playerIdF._id,

		                                    "connecterId":playerDEt.userId,
		                                    "connecterName":playerName,		                                    
		                                    "statusOfConnection":playerIdF.status,
		                                    "connectionSentDate":playerIdF.sentDateTime,
		                                    "connecterRole":"Player",
		                                    "connectionType":"received"

		                                }
		                                connectionRequestsDEt.push(data);
		                                //playerConnection.push(data);
		                            }
		                        }

	                        }
	                        
						});



					}
					else if(logDet.role=="Player")
					{
						var queryForstatus = {};
						var queryForConnectionType = {};
						var queryForCoach1 = {"loggedInId":xDATA.loggedInId};
						var queryForCoach2 = {"playerId":xDATA.loggedInId};

						//query for the status (pending,accepted,rejected)
						if(xDATA.statusType.trim().toLowerCase() !='all' && xDATA.connectionType.trim().toLowerCase() !='all')
						{
							if(xDATA.statusType.trim().toLowerCase() == 'requestPending' || xDATA.statusType.trim().toLowerCase() == 'request pending')
								queryForstatus = {
									"status":"pending",

									"receiverId":xDATA.loggedInId

								}
							else if(xDATA.statusType.trim().toLowerCase() == 'invitationPending' || xDATA.statusType.trim().toLowerCase() == 'invitation pending')
								queryForstatus = {
									"status":"pending",
									"loggedInId":xDATA.loggedInId
								}
							else if(xDATA.statusType.trim().toLowerCase() == "accepted")
								queryForstatus = {
									"status":xDATA.statusType.trim().toLowerCase()
								}			           
						}
						

						if(xDATA.connectionRole.trim().toLowerCase() != "all")
						{
							queryForCoach1 = {
								"loggedInId":xDATA.loggedInId,
								"toEntity":xDATA.connectionRole.trim()
							}

							queryForCoach2 = {
								"loggedInRole":xDATA.connectionRole.trim(),
								"playerId":xDATA.loggedInId,

							}
						}

							


						
						//find the request comes to coachId
						connectionRequests.find({	
							$and:[
								{
									$or:[
										queryForCoach1,
										queryForCoach2
									]
								},
								queryForstatus

							]					
						}).fetch().forEach(function(e,i){
							var coachIdF = e;
	                        var coachDet;
	                        //find who has sent request
	                        //if coach get details of coach
	                        if(coachIdF.loggedInId == xDATA.loggedInId)
	                        {

	                        	if(coachIdF.toEntity=="Coach")
		                        {
		                            coachDet = otherUsers.findOne({
		                                "userId":coachIdF.receiverId,
		                            });

		                            if(coachDet){
		                              

		                                var coachName = "";

		                                if(coachDet.userName){
		                                    coachName = coachDet.userName
		                                }
		                                
		                                var data  = {
		                                	"connectionReqId":coachIdF._id,
		                                    "connecterId":coachDet.userId,
		                                    "connecterName":coachDet.userName,		                                    
		                                    "statusOfConnection":coachIdF.status,
		                                    "connectionSentDate":coachIdF.sentDateTime,
		                                    "connecterRole":coachDet.role,
		                                    "connectionType":"sent"

		                                }
		                                connectionRequestsDEt.push(data);
		                                //coachConnection.push(data);

		                            }
		                        }
		                        //find who has sent request
		                        //if player get details of player
		                        else if(coachIdF.toEntity=="Player"){
		                            var playerIdF = e;
		                            var playerDEt = nameToCollection(playerIdF.receiverId).findOne({
		                                "userId":playerIdF.receiverId,
		                                "role":"Player"
		                            });

		                            if(playerDEt){
		                                
		                                var playerName = "";

		                                if(playerDEt.userName){
		                                    playerName = playerDEt.userName
		                                }
		                               
		                                var data  = {
		                                	"connectionReqId":playerIdF._id,
		                                    "connecterId":playerDEt.userId,
		                                    "connecterName":playerName,		                                  
		                                    "statusOfConnection":playerIdF.status,
		                                    "connectionSentDate":playerIdF.sentDateTime,
		                                    "connecterRole":playerDEt.role,
		                                    "connectionType":"sent"

		                                }
		                                connectionRequestsDEt.push(data);
		                                //playerConnection.push(data);
		                            }
		                        }


	                        }
	                        else if(coachIdF.playerId == xDATA.loggedInId)
	                        {
	                        	if(coachIdF.loggedInRole=="Coach")
		                        {
		                            coachDet = otherUsers.findOne({
		                                "userId":coachIdF.loggedInId,
		                            });

		                            if(coachDet){
		                               
		                                var coachName = "";

		                                if(coachDet.userName){
		                                    coachName = coachDet.userName
		                                }
		                               
		                                var data  = {
		                                	"connectionReqId":coachIdF._id,
		                                    "connecterId":coachDet.userId,
		                                    "connecterName":coachName,	                                    
		                                    "statusOfConnection":coachIdF.status,
		                                    "connectionSentDate":coachIdF.sentDateTime,
		                                    "connecterRole":"Coach",
		                                    "connectionType":"received"
		                                }
		                                connectionRequestsDEt.push(data);
		                                //coachConnection.push(data);
		                            }
		                        }
		                        //find who has sent request
		                        //if player get details of player
		                        else if(coachIdF.loggedInRole=="Player"){
		                            var playerIdF = e;
		                            var playerDEt = nameToCollection(playerIdF.loggedInId).findOne({
		                                "userId":playerIdF.loggedInId,
		                                "role":"Player"
		                            });

		                            if(playerDEt){
		                                
		                                var playerName = "";

		                                if(playerDEt.userName){
		                                    playerName = playerDEt.userName
		                                }
		                               

		                                var data  = {
		                                	"connectionReqId":playerIdF._id,

		                                    "connecterId":playerDEt.userId,
		                                    "connecterName":playerName,		                                    
		                                    "statusOfConnection":playerIdF.status,
		                                    "connectionSentDate":playerIdF.sentDateTime,
		                                    "connecterRole":"Player",
		                                    "connectionType":"received"

		                                }
		                                connectionRequestsDEt.push(data);
		                                //playerConnection.push(data);
		                            }
		                        }

	                        }
	                        
						});



					}

					else{
						var message = "Invalid Login Credentials"
						var resultJson = {};
						resultJson["status"] = "failure";                
						resultJson["response"] = message.toString();
						resultJson["data"] = false;
						//messageValidations.push(resultJson);
						return resultJson
					}
				} else{
					var message = "Invalid Login Credentials"
					var resultJson = {};
					resultJson["status"] = "failure";                
					resultJson["response"] = message.toString();
					resultJson["data"] = false;
					//messageValidations.push(resultJson);
					return resultJson
				}
				//if details
                //if of details
                if(connectionRequestsDEt.length!=0){
                    var message = "Request received details"
                    var resultJson = {};
                    resultJson["status"] = "success";                
                    resultJson["response"] = message;
                    resultJson["data"] = connectionRequestsDEt;

                    //resultJson["playerConnection"] = playerConnection;
                    //resultJson["coachConnection"] = coachConnection;
                    //messageValidations.push(resultJson);

                    return resultJson;
                } else{
                    var message = "There are no requests received/invitations sent"
                    var resultJson = {};
                    resultJson["status"] = "failure";                
                    resultJson["response"] = message.toString();
                    resultJson["data"] = false;
                    //messageValidations.push(resultJson);
                    return resultJson
                }
			} else{
				var message = "Require all parameters"
				var resultJson = {};
				resultJson["status"] = "failure";                
				resultJson["response"] = message.toString();
				resultJson["data"] = false;
				//messageValidations.push(resultJson);
				return resultJson
			}
		}catch(e){
			var message = "Invalid data"
			var resultJson = {};
			resultJson["status"] = "failure";                
			resultJson["response"] = e;
			resultJson["data"] = false;
			//messageValidations.push(resultJson);
			return resultJson
		}
	},
	"getConnectedMembersInHaul":function(xDATA){
        try {
            //check for params
            //xDATA.userId = "EePtJ4LEaygnRtfxQ";
            if (xDATA) {
                //var data = xDATA.replace("\\", "");
                //xDATA = JSON.parse(data);
            } else {
                var message = "Require all parameters"
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = message.toString();
                resultJson["data"] = false;
                return resultJson;
            }

            //check for valid playerId
            if (xDATA && xDATA.userId) 
            {
            	xDATA.loggedInId = xDATA.userId;
                //find player id in db
                var det = Meteor.users.findOne({
                    "userId": xDATA.userId,
                });;
                if (det) {
					var conreq;
					var conGroups;
                	if(det.role.toLowerCase() == "coach")
                	{
                		conreq = connectionRequests.aggregate([{
	                        $match: {
	                            $or: [{
	                                loggedInId: xDATA.userId
	                            }, {
	                                coachId: xDATA.userId
	                            }],
	                            status: "accepted"
	                        }
                    	}]);
                	}
                	else if(det.role.toLowerCase() == "player")
                	{
                		conreq = connectionRequests.aggregate([{
	                        $match: {
	                            $or: [{
	                                loggedInId: xDATA.userId
	                            }, {
	                                playerId: xDATA.userId
	                            }],
	                            status: "accepted"
	                        }
                    	}]);
                	}
                	

					conGroups = coachConnectedGroups.aggregate([
						{$match: {
	                            
	                                loggedInId: xDATA.userId
	                            
	                    }},
	                    {$project:{
	                    	"_id":1,
	                    	"groupName":1

	                    }}
                    	]);
                    //find accepted connections for given player
                    //player --> coach -- loggedInId
                    //coach --> player -- coachId
                   

                    //if there are any accepted connection
                    if (conreq && conreq.length) 
                    {
                        var conreqAcc = conreq;
                        var membersAndMemberDet = [];
                        for (var i = 0; i < conreqAcc.length; i++) {
                            if (conreqAcc[i].toEntity && conreqAcc[i].loggedInRole) {
                                var entity = conreqAcc[i].toEntity.trim();
                                var role = conreqAcc[i].loggedInRole.trim();
                                //if loggedInrole is player and toentity is coach
                                //use loggedInId and db is otherUsers
                                if(conreqAcc[i].loggedInId == xDATA.loggedInId)
                                {
                                	if (entity.toLowerCase() == "coach") 
                                	{

	                                    if (conreqAcc[i].coachId) {
	                                        var coachDet =  Meteor.users.findOne({
	                                            "userId": conreqAcc[i].coachId
	                                        },{fields:{"userName":1,"userId":1,"role":1,"_id":0}})
	                                        if (coachDet)
	                                            membersAndMemberDet.push(coachDet)
	                                    }
                                	}
                                	else if (entity.toLowerCase() == "player") 
	                                {
	                                    if (conreqAcc[i].playerId) {
	                                        var coachDet = Meteor.users.findOne({
	                                            "userId": conreqAcc[i].playerId
	                                        },{fields:{"userName":1,"userId":1,"role":1,"_id":0}})
	                                        
	                                        if (coachDet)
	                                            membersAndMemberDet.push(coachDet)
	                                    }
	                                }
                                }
                                else if(conreqAcc[i].receiverId == xDATA.loggedInId)
                                {
                                	if (entity.toLowerCase() == "coach") 
                                	{

	                                    if (conreqAcc[i].loggedInId) {
	                                        var coachDet =  Meteor.users.findOne({
	                                            "userId": conreqAcc[i].loggedInId
	                                        },{fields:{"userName":1,"userId":1,"role":1,"_id":0}})
	                                        if (coachDet)
	                                            membersAndMemberDet.push(coachDet)
	                                    }
                                	}
                                	else if (entity.toLowerCase() == "player") 
	                                {
	                                    if (conreqAcc[i].loggedInId) {
	                                        var coachDet = Meteor.users.findOne({
	                                            "userId": conreqAcc[i].loggedInId
	                                        },{fields:{"userName":1,"userId":1,"role":1,"_id":0}})
	                                        
	                                        if (coachDet)
	                                            membersAndMemberDet.push(coachDet)
	                                    }
	                                }
                                }
                                

                                

                            }
                        }

                        
                    } 
                    
                    if(conreq || conGroups)
                    {
                    	if(conreq.length >0 || conGroups.length >0 )
                    	{
                    		
	                        var message = "Connected Members"
	                        var resultJson = {};
	                        resultJson["status"] = "success";
	                        resultJson["response"] = message.toString();
	                        resultJson["members"] = membersAndMemberDet;
	                        resultJson["groups"] = conGroups;
                            return resultJson
                        
                    	}
                    }
                    else {
                        var message = "There are no connected members or groups"
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = message.toString();
                        resultJson["data"] = false;
                        return resultJson
                    }



                } else {
                    var message = "User is not valid"
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = message.toString();
                    resultJson["data"] = false;
                    return resultJson
                }
            } else {
                var message = "Invalid User"
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