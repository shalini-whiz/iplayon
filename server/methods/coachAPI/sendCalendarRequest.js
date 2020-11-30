import {nameToCollection} from '../dbRequiredRole.js'

//insert as calendar request
//only coach to coach
//coach  to player
//coach to group
//check for loggedInId
//check for receiverId
//if coach to coach
//check loggedInId role and receiverId role
//if it is coach to coach
//check coachdet
//then check for calendar date and time
//check for calendar link or call
//check for text
//save to insertSentBoxInBoxDetCoachA

//coach to coach req

Meteor.methods({
    "calendarRequestMessageInsert":async function(xDATA){
        try{
            //check for valid sender and valid receiver
            var senderId = xDATA.senderId
            var senderRole
            var receiverRole
            var receiverId = xDATA.receiverId
            var statusOfWholeMessage = "active"
            var readUnreadWholeMessageStatus = "unread"
            var messagesBox_id
            var messagesBox_receivedDateAndTime
            var messagesBox_messageType = "calendarRequest"
            var messagesBox_message
            var messagesBox_senderId 
            var messagesBox_receiverId
            var messagesBox_senderRole
            var messagesBox_receiverRole
            var messagesBox_calendarAcceptedIds
            var messagesBox_calendarRejectedIds
            var receivedDateAndTime
            var senderName
            var receiverName
            var calendarDateTime
            //validate sender
            if(senderId){
                //validate player or coach is the sender
                var det = Meteor.users.findOne({"userId":senderId,
                    $or:[
                        {role:"Coach"},
                        {role:"Player"}
                    ]
                });
                var detailedDet;
                if(det&&det.role=="Coach"){
                    detailedDet = otherUsers.findOne({
                        "userId":senderId
                    });
                    //check coach sending message to player,coach,group

                    if(receiverId){
                        //validate coach or player
                        var recvrDet = Meteor.users.findOne({"userId":receiverId,
                            $or:[
                                {role:"Coach"},
                                {role:"Player"}
                            ]
                        });

                        //check rcver is group
                        var recDetGroup = coachConnectedGroups.findOne({
                            "_id": receiverId
                        });
                        if(recvrDet==undefined&&recDetGroup==undefined){
                            var message = "Invalid receiver"
                            var resultJson = {};
                            resultJson["status"] = "failure";
                            resultJson["response"] = message;
                            resultJson["data"] = false;
                            return resultJson 
                        }

                        //if recvr not group
                        if(recvrDet){
                            var recvrDetDetailed;
                            //check recvr main det
                             //coach to player
                            if(recvrDet&&recvrDet.role=="Player"){
                                recvrDetDetailed = nameToCollection(receiverId).findOne({
                                    "userId":receiverId,
                                    "role":"Player"
                                });

                                xDATA.senderId = senderId;
                                xDATA.senderRole = detailedDet.role;
                                xDATA.messageType = xDATA.messageType.trim().toLowerCase();
                                xDATA.receiverRole = recvrDetDetailed.role;
                                xDATA.receiverId = receiverId;
                                
                                if(xDATA.textMessage&&xDATA.textMessage.trim().length!=0){
                                    xDATA.textMessage = xDATA.textMessage;
                                }
                                else
                                    xDATA.textMessage = " ";
                                
                                if(xDATA.linkCall&&xDATA.linkCall.trim().length){
                                    xDATA.linkCall = xDATA.linkCall
                                }
                                else 
                                    xDATA.linkCall = " ";

                                xDATA.receiverName = recvrDetDetailed.userName;
                                xDATA.senderName = detailedDet.userName;
                                var dateFormat = 'DD-MM-YYYY hh:mm:ss';
                                xDATA.calendarDateTime = moment(new Date(xDATA.calendarDate+" "+xDATA.calendarTime)).format(dateFormat)
                                
                                var res = await Meteor.call("insertSentBoxInBoxDetCoachAPI", xDATA)
                                try {
                                    if (res) {
                                        resultJson = res;
                                    }
                                }catch(e){
                                    var message = "Failed"
                                    var resultJson = {};
                                    resultJson["status"] = "failure";
                                    resultJson["response"] = e;
                                    resultJson["data"] = false;
                                }

                            }
                             //coach to coach
                            else if(recvrDet&&recvrDet.role=="Coach"){
                                recvrDetDetailed = otherUsers.findOne({
                                    "userId":receiverId,
                                    "role":"Coach"
                                })
                            }
                            else{
                                var message = "Invalid receiver"
                                var resultJson = {};
                                resultJson["status"] = "failure";
                                resultJson["response"] = message;
                                resultJson["data"] = false;
                                return resultJson
                            }
                        }

                        //if recvr is group
                        else if(recDetGroup){
                            //coach to group
                        }
                        else {
                            var message = "Invalid receiver"
                            var resultJson = {};
                            resultJson["status"] = "failure";
                            resultJson["response"] = message;
                            resultJson["data"] = false;
                            return resultJson 
                        }
                    }
                    else{
                        var message = "Invalid receiver"
                        var resultJson = {};
                        resultJson["status"] = "failure";
                        resultJson["response"] = message;
                        resultJson["data"] = false;
                        return resultJson 
                    }
                }
                else if(det&&det.role=="Player"){
                    detailedDet = nameToCollection(senderId).findOne({
                        "userId":senderId,
                        "role":"Player"
                    })
                }
                else{
                   var message = "Invalid sender"
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = message;
                    resultJson["data"] = false;
                    return resultJson 
                }

                if(det&&detailedDet){

                } 
                else{
                    var message = "Invalid sender"
                    var resultJson = {};
                    resultJson["status"] = "failure";
                    resultJson["response"] = message;
                    resultJson["data"] = false;
                    return resultJson 
                }
            }
            else{
                var message = "Invalid sender"
                var resultJson = {};
                resultJson["status"] = "failure";
                resultJson["response"] = message;
                resultJson["data"] = false;
                return resultJson 
            }
   
        }catch(e){
            var message = "Invalid data"
            var resultJson = {};
            resultJson["status"] = "failure";
            resultJson["response"] = e;
            resultJson["data"] = false;
            return resultJson
        }
    }
})



//insert message when new schem
Meteor.methods({
    "calendarRequestAPI": function(xDATA) {
        try {

            var coachAPPSentBOX
            var sentInsert = true;

           
            var senderId = xDATA.senderId
            var senderIdOutArr;
            var senderNameOutArr;
            var senderRoleOutArr;

            senderIdOutArr = xDATA.senderId
            senderRoleOutArr = xDATA.senderRole
            senderNameOutArr = xDATA.senderName
            senderRoleOutArr = xDATA.senderRole
          
            var senderRole = xDATA.senderRole
            var receiverRole = xDATA.receiverRole
            var receiverId = xDATA.receiverId
            var statusOfWholeMessage = "active"
            var readUnreadWholeMessageStatus = "unread"

            var messageType = xDATA.messageType.trim().toLowerCase()
            var message = xDATA.textMessage

            var senderName = xDATA.senderName
            var receiverName = xDATA.receiverName

            //check for already received
            var coachAPPINSentBOXDEt = coachAPPINSentBOX.findOne({
                $or: [{
                    $and: [{
                        senderId: senderIdOutArr
                    }, {
                        receiverId: xDATA.receiverId
                    }],
                }, {
                    $and: [{
                        receiverId: senderIdOutArr
                    }, {
                        senderId: xDATA.receiverId
                    }],
                }]
            });

            //insert
            if (coachAPPINSentBOXDEt == undefined) 
            {
                        
                var dataREc = {
                    senderId: senderIdOutArr,
                    senderRole: senderRoleOutArr,
                    receiverRole: receiverRole,
                    receiverId: receiverId,
                    statusOfWholeMessage: statusOfWholeMessage,
                    readUnreadWholeMessageStatus: readUnreadWholeMessageStatus,
                    senderName: senderNameOutArr,
                    receiverName: receiverName,
                    receivedDateAndTime:new Date(),
                    message:message,
                    messagesBox: [{
                        _id:Random.id(),
                        messageType: messageType,
                        message: message,
                        receivedDateAndTime: new Date(),
                        senderId: senderId,
                        receiverId: receiverId,
                        senderRole: senderRole,
                        receiverRole: receiverRole
                    }]
                }

                if(xDATA.messageType.trim().toLowerCase()=="calendarrequest")
                {
                    dataREc.messagesBox[0].calendarDateTime = xDATA.calendarDateTime
                    dataREc.messagesBox[0].linkCall = xDATA.linkCall
                }

               


                var inboxInsert = coachAPPINSentBOX.insert(
                    dataREc
                );
                //if inbox is saved
                if (inboxInsert) 
                {               
                    var findRecDet = coachAPPINSentBOX.findOne({
                        "_id": inboxInsert
                    })

                    var message = "Message sent"
                    var resultJson = {};
                    resultJson["status"] = "success";
                    resultJson["response"] = message.toString();
                    var data = {};
                   
                    if (findRecDet) 
                        data["inboxDet"] = findRecDet;
                    else 
                        data["inboxDet"] = {}
                    

                    resultJson["data"] = data;
                    return resultJson
                }
                
            }        
            //update
            else if(coachAPPINSentBOXDEt != undefined)
            {
         
                var statusOfWholeMessage = "active"
                var readUnreadWholeMessageStatus = "unread"

                var messagesBoxDET = [{
                    _id:Random.id(),
                    messageType: messageType,
                    message: message,
                    receivedDateAndTime: new Date(),
                    senderId: senderId,
                    receiverId: receiverId,
                    senderRole: senderRole,
                    receiverRole: receiverRole
                }]

                if(xDATA.messageType.trim().toLowerCase()=="calendarrequest"){
                    messagesBoxDET[0].calendarDateTime = xDATA.calendarDateTime
                    messagesBoxDET[0].linkCall = xDATA.linkCall
                }
                

                var updateINBOX = coachAPPINSentBOX.update({
                    "_id": coachAPPINSentBOXDEt._id
                    }, {$set: {
                        statusOfWholeMessage: statusOfWholeMessage,
                        readUnreadWholeMessageStatus: readUnreadWholeMessageStatus,
                        receivedDateAndTime:new Date(),
                        message:message
                    },
                    "$push": {
                        messagesBox: {
                            $each: messagesBoxDET,
                            $position: 0
                        },
                    }
                });

                if (updateINBOX) 
                {
                    var findRecDet = coachAPPINSentBOX.findOne({
                        "_id": coachAPPINSentBOXDEt._id
                    })

                    var message = "Message sent"
                    var resultJson = {};
                    resultJson["status"] = "success";
                    resultJson["response"] = message.toString();
                    var data = {};

                    if (findRecDet) 
                         data["inboxDet"] = findRecDet;
                    else 
                        data["inboxDet"] = {}
                    
                    resultJson["data"] = data;
                    return resultJson
                }     
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