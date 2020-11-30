import {nameToCollection} from '../dbRequiredRole.js'

//not checking connected or not
Meteor.methods({
  //send message
  "sendTextMessageToPlayerByCoach": async function(xDATA) {

    var resultJson = {};

    try {
      if (xDATA) {
        if (typeof xDATA == "string") {
          var data = xDATA.replace("\\", "");
          xDATA = JSON.parse(data);
        }

      } else {
        var message = "Require all parameters"
        resultJson["status"] = "failure";
        resultJson["response"] = message.toString();
        resultJson["data"] = false;
        return resultJson
      }

      //check for message type is text
      if (xDATA.messageType && xDATA.messageType.trim().toLowerCase() == "text") {
        //check for receiver type
        if (xDATA.receiverType &&
          (xDATA.receiverType.trim().toLowerCase() == "group" ||
            xDATA.receiverType.trim().toLowerCase() == "coach" || 
            xDATA.receiverType.trim().toLowerCase() == "player" ||
            xDATA.receiverType.trim().toLowerCase() == "all")) {
          //ceck if receiver type other than all
          if (xDATA.receiverType.toLowerCase() !== "all") {
            //check for params
            if (xDATA.senderId && xDATA.messageType && xDATA.receiverId) {
              //if message type is text
              if (xDATA.messageType.trim().toLowerCase() == "text") {
                if (xDATA.textMessage && xDATA.textMessage.trim().length != 0) {

                  //fields for sent box
                  var senderId = xDATA.senderId.trim();
                  var senderRole = ""
                  var messageType = xDATA.messageType.trim().toLowerCase()
                  var receiverRole = ""
                  var receiverId = xDATA.receiverId
                  var textMessage = xDATA.textMessage.trim()
                  var statusOfSentMessage = "active"
                  var receiverName = "";

                  //fields for inbox
                  var messageSentBoxId
                  var readUnreadStatus = "unread"
                  var statusOfRecvdMessage = "active"
                  var senderName = ""
                  var receiverRole = ""
                  var receiverId = xDATA.receiverId
                  var messageType = xDATA.messageType.trim().toLowerCase()

                  //check for senderId
                  if (senderId) {
                    var det = Meteor.users.findOne({
                      "userId": senderId,
                      $or: [{
                        role: "Player"
                      }, {
                        role: "Coach"
                      }]
                    });
                    //check for role to fetch coachdet
                    var senderDet;
                    if (det && det.role == "Coach") {
                      senderDet = otherUsers.findOne({
                        "userId": senderId,
                        role: "Coach"
                      });
                    }
                    //check for role to fetch player det
                    else if (det && det.role == "Player") {
                      senderDet = nameToCollection(senderId).findOne({
                        "userId": senderId,
                        role: "Player"
                      })

                    }
                    //send error
                    else {
                      var message = "Invalid sender"
                      resultJson["status"] = "failure";
                      resultJson["response"] = message.toString();
                      resultJson["data"] = false;
                      return resultJson
                    }

                    //sender details is not undefined
                    if (det && senderDet) {
                      //player to coach
                      //check for receiver role if sender is player
                      if (senderDet.role == "Player") 
                      {
                        //find the recver role is coach
                        var recDet = Meteor.users.findOne({
                          userId: receiverId,
                          role: "Coach"
                        })
                        var otherUserDet;
                        if (recDet) {
                          //there are coach det
                          otherUserDet = otherUsers.findOne({
                            userId: receiverId,
                            role: "Coach"
                          })
                        } else {
                          var message = "Invalid Receiver"
                          resultJson["status"] = "failure";
                          resultJson["response"] = message.toString();
                          resultJson["data"] = false;
                          return resultJson
                        }

                        if (recDet && otherUserDet) {

                          xDATA.senderId = senderId;
                          xDATA.senderRole = senderDet.role;
                          xDATA.messageType = xDATA.messageType.trim().toLowerCase();
                          xDATA.receiverRole = recDet.role;
                          xDATA.receiverId = receiverId;
                          xDATA.textMessage = textMessage;
                          xDATA.receiverName = recDet.userName;
                          xDATA.senderName = senderDet.userName;




                          var packExists = userSubscribedPacks.find({
                            "packPayToUserId": receiverId,
                            "userId": senderId,
                            "planEndsOn": {
                              $gte: new Date()
                            },
                            "features": {
                              $elemMatch: {
                                  "key": "Message Limit",
                                  "value": {$ne:"0"}
                              }
                            },           
                            "acknowledgeStatus" : "accept"
                          },
                          {
                            sort: {
                              "paidDate": 1
                            }
                          },
                           {
                            fields: {
                              _id: 1,
                              "features": {
                                $elemMatch: {
                                  "key": "Message Limit"
                                }
                              },
                              "acknowledgeStatus": 1,
                              "packId": 1
                            }
                          }, {
                            limit: 2
                          }, ).fetch();



                          if (packExists && packExists.length > 0 && packExists[0]) 
                          {

                           if (packExists[0].acknowledgeStatus == "accept") {
                              var res = await Meteor.call("insertSentBoxInBoxDetCoachAPI", xDATA)
                              try {
                                if (res) {
                                  resultJson = res;
                                  var paramData = {};
                                  paramData["senderId"] = senderId;
                                  paramData["receiverId"] = receiverId;
                                  var aa = await Meteor.call("updateSubscribedPack", paramData);
                                  //make a call decrement message count if any pack available

                                }
                              }catch(e){
                                  var message = "Failed"
                                  resultJson["status"] = "failure";
                                  resultJson["response"] = e;
                                  resultJson["data"] = false;
                              }
                            } else {
                              var existPack = articlesOfPublisher.findOne({
                                "_id": packExists[0].packId
                              }, {
                                "title": 1,
                                "_id": 0
                              })
                              var packageTitle = "";
                              if (existPack)
                                packageTitle = existPack.title;
                              
                              var message = recDet.userName + " has to acknowledge your subscribed package " + packageTitle + " package";

                              resultJson["status"] = "failure";
                              resultJson["packageTitle"] = packageTitle;
                              resultJson["response"] = message.toString();
                              resultJson["data"] = false;
                              return resultJson
                            }

                          } else {

                            var freePackage = articlesOfPublisher.findOne({
                              type: "Packs",
                              "status": "Active",
                              "userId": receiverId,
                              "planType": "Free"
                            }, {
                              "title": 1,
                              "_id": 0
                            })
                            if (freePackage) {
                              var message = "Please subscribe to " + recDet.userName + "'s " + freePackage.title + " package";
                              resultJson["status"] = "failure";
                              resultJson["packageTitle"] = freePackage.title;
                              resultJson["response"] = message.toString();
                              resultJson["data"] = false;
                              return resultJson
                            } else {
                              var message = "Please subscribe to " + recDet.userName + "'s package";
                              resultJson["status"] = "failure";
                              resultJson["response"] = message.toString();
                              resultJson["data"] = false;
                              return resultJson
                            }

                          }



                          //return resultJson;
                        } else {
                          var message = "Invalid Receiver"
                          resultJson["status"] = "failure";
                          resultJson["response"] = message.toString();
                          resultJson["data"] = false;
                          return resultJson
                        }




                      }

                      //check for receiver role, if sender is coach
                      else if (senderDet.role == "Coach") 
                      {
                        //check recver is coach or player

                        var recDet = Meteor.users.findOne({
                          userId: receiverId,
                          $or: [{
                            role: "Coach"
                          }, {
                            role: "Player"
                          }]
                        });

                        //check rcver is group
                        var recDetGroup = coachConnectedGroups.findOne({
                          "_id": receiverId
                        })


                        //if not to player, coach or group, send error message
                        if (recDet == undefined && recDetGroup == undefined) {
                          var message = "Invalid Receiver"
                          resultJson["status"] = "failure";
                          resultJson["response"] = message.toString();
                          resultJson["data"] = false;
                          return resultJson
                        }
                        //if rec is player or coach
                        else if (recDet) {
                          //coach to player
                          if (recDet && recDet.role == "Player") 
                          {
                            //check for playerDet
                            var recDBDet = nameToCollection(receiverId).findOne({
                              "userId": receiverId,
                              role: "Player"
                            })

                            if (recDBDet) {
                              //call send and in method
                              xDATA.senderId = senderId;
                              xDATA.senderRole = senderDet.role;
                              xDATA.messageType = xDATA.messageType.trim().toLowerCase();
                              xDATA.receiverRole = recDet.role;
                              xDATA.receiverId = receiverId;
                              xDATA.textMessage = textMessage;
                              xDATA.receiverName = recDBDet.userName;
                              xDATA.senderName = senderDet.userName;



                              var res = await Meteor.call("insertSentBoxInBoxDetCoachAPI", xDATA)
                              try {
                                if (res) {
                                  resultJson = res;

                                }
                              }catch(e){
                                var message = "Failed"
                                resultJson["status"] = "failure";
                                resultJson["response"] = e;
                                resultJson["data"] = false;
                              }
                              //return resultJson;

                            } else {
                              var message = "Invalid Receiver"
                              resultJson["status"] = "failure";
                              resultJson["response"] = message.toString();
                              resultJson["data"] = false;
                              return resultJson
                            }
                          }

                          //if rec is coach
                          else if (recDet && recDet.role == "Coach") 
                          {
                            //check for coachdet
                            var recDBDet = otherUsers.findOne({
                              "userId": receiverId,
                              role: "Coach"
                            })

                            if (recDBDet) {
                              //call send and in method
                              xDATA.senderId = senderId;
                              xDATA.senderRole = senderDet.role;
                              xDATA.messageType = xDATA.messageType.trim().toLowerCase();
                              xDATA.receiverRole = recDet.role;
                              xDATA.receiverId = receiverId;
                              xDATA.textMessage = textMessage;
                              xDATA.receiverName = recDBDet.userName;
                              xDATA.senderName = senderDet.userName; 


                

                              var packExists = userSubscribedPacks.find({
                                $or:[
                                {
                                  "packPayToUserId": receiverId,
                                  "userId": senderId
                                },
                                {
                                  "packPayToUserId": senderId,
                                  "userId": receiverId
                                }],
                                //"packPayToUserId": receiverId,
                                //"userId": senderId,
                                "planEndsOn": {
                                  $gte: new Date()
                                },
                                "features": {
                                  $elemMatch: {
                                    "key": "Message Limit",
                                    "value": {$ne:"0"}
                                  }
                                },
                                "acknowledgeStatus" : "accept"
                              },
                              {
                                sort: {
                                  "paidDate": 1
                                }
                              }, {
                                fields: {
                                  _id: 1,
                                  "features": {
                                    $elemMatch: {
                                      "key": "Message Limit"
                                    }
                                  },
                                  "acknowledgeStatus": 1,
                                  "packId": 1
                                }
                              },  
                              {
                                limit: 1
                              }, ).fetch();


                              if (packExists && packExists.length > 0 && packExists[0]) {
                                if (packExists[0].acknowledgeStatus == "accept") 
                                {

                                  var res = await Meteor.call("insertSentBoxInBoxDetCoachAPI", xDATA)
                                    try {
                                     if (res) {


                                      resultJson = res;
                                      var paramData = {};
                                      paramData["senderId"] = senderId;
                                      paramData["receiverId"] = receiverId;
                                      var aa = await Meteor.call("updateSubscribedPack", paramData)

                                    }
                                  }catch(e){
                                     var message = "Failed"
                                      resultJson["status"] = "failure";
                                      resultJson["response"] = e;
                                      resultJson["data"] = false;
                                  }
                                } 
                                else {
                                  var existPack = articlesOfPublisher.findOne({
                                    "_id": packExists[0].packId
                                  }, {
                                    "title": 1,
                                    "_id": 0
                                  });

                                  var packageTitle = "";
                                  if (existPack)
                                    packageTitle = existPack.title;
                              
                                  var message = recDet.userName + " has to acknowledge your subscribed package " + packageTitle + " package";

                                  if (existPack)
                                    packageTitle = recDet.userName + " has to acknowledge your subscribed package " + existPack.title + "";
                                  resultJson["status"] = "failure";
                                  resultJson["packageTitle"] = packageTitle;
                                  resultJson["response"] = message.toString();
                                  resultJson["data"] = false;
                                  return resultJson
                                }
                              } else {
                                var freePackage = articlesOfPublisher.findOne({
                                  type: "Packs",
                                  "status": "Active",
                                  "userId": receiverId,
                                  "planType": "Free"
                                }, {
                                  "title": 1,
                                  "_id": 0
                                })
                                if (freePackage) {
                                  var message = "Please subscribe to " + recDet.userName + "'s " + freePackage.title + " package";
                                  resultJson["status"] = "failure";
                                  resultJson["packageTitle"] = freePackage.title;
                                  resultJson["response"] = message.toString();
                                  resultJson["data"] = false;
                                  return resultJson
                                } else {
                                  var message = "Please subscribe to " + recDet.userName + "'s package";
                                  resultJson["status"] = "failure";
                                  resultJson["response"] = message.toString();
                                  resultJson["data"] = false;
                                  return resultJson
                                }
                              }
                              //return resultJson;

                            } else {
                              var message = "Invalid Receiver"
                              resultJson["status"] = "failure";
                              resultJson["response"] = message.toString();
                              resultJson["data"] = false;
                              return resultJson
                            }
                          } else {
                            var message = "Invalid Receiver"
                            resultJson["status"] = "failure";
                            resultJson["response"] = message.toString();
                            resultJson["data"] = false;
                            return resultJson
                          }
                        }

                        //if rec is group
                        else if (recDetGroup) {
                          //call send and in method
                          xDATA.senderId = senderId;
                          xDATA.senderRole = senderDet.role;
                          xDATA.messageType = xDATA.messageType.trim().toLowerCase();
                          xDATA.receiverRole = "Group";
                          xDATA.receiverId = receiverId;
                          xDATA.textMessage = textMessage;
                          xDATA.receiverName = recDetGroup.groupName;
                          xDATA.senderName = senderDet.userName;

                          var res = await Meteor.call("insertSentBoxInBoxDetCoachAPI", xDATA)
                           try {
                             if (res) {
                              resultJson = res;
                            }
                          }catch(e){
                            var message = "Failed"
                              resultJson["status"] = "failure";
                              resultJson["response"] = e;
                              resultJson["data"] = false;

                          }
                          //return resultJson;
                        }

                      }

                      //else send error message
                      else {
                        var message = "Invalid sender"
                        resultJson["status"] = "failure";
                        resultJson["response"] = message.toString();
                        resultJson["data"] = false;
                        return resultJson
                      }
                    } else {
                      var message = "Invalid sender"
                      resultJson["status"] = "failure";
                      resultJson["response"] = message.toString();
                      resultJson["data"] = false;
                      return resultJson
                    }
                  } else {
                    var message = "Invalid sender"
                    resultJson["status"] = "failure";
                    resultJson["response"] = message.toString();
                    resultJson["data"] = false;
                    return resultJson
                  }
                } else {
                  var message = "Require all parameters"
                  resultJson["status"] = "failure";
                  resultJson["response"] = message.toString();
                  resultJson["data"] = false;
                  return resultJson
                }
              }
              //else part is remaining
            } else {
              var message = "Require all parameters"
              resultJson["status"] = "failure";
              resultJson["response"] = message.toString();
              resultJson["data"] = false;
              return resultJson
            }
          } else if (xDATA.receiverType.trim().toLowerCase() == "all") {
            //check for params
            if (xDATA.senderId && xDATA.messageType) {
              //if message type is text
              if (xDATA.messageType.trim().toLowerCase() == "text") {
                if (xDATA.textMessage && xDATA.textMessage.trim().length != 0) {

                  //fields for sent box
                  var senderId = xDATA.senderId.trim();
                  var senderRole = ""
                  var messageType = xDATA.messageType.trim().toLowerCase()
                  var receiverRole = ""
                  var receiverId = xDATA.receiverId
                  var textMessage = xDATA.textMessage.trim()
                  var statusOfSentMessage = "active"
                  var receiverName = "";

                  //fields for inbox
                  var messageSentBoxId
                  var readUnreadStatus = "unread"
                  var statusOfRecvdMessage = "active"
                  var senderName = ""
                  var receiverRole = ""
                  var receiverId = xDATA.receiverId
                  var messageType = xDATA.messageType.trim().toLowerCase()

                  //check for senderId
                  if (senderId) {
                    var det = Meteor.users.findOne({
                      "userId": senderId,
                      $or: [{
                        role: "Player"
                      }, {
                        role: "Coach"
                      }]
                    });

                    //check for role to fetch coachdet
                    var senderDet;
                    if (det && det.role == "Coach") {
                      senderDet = otherUsers.findOne({
                        "userId": senderId,
                        role: "Coach"
                      });
                    }
                    //doubt on this
                    /*else if (det && det.role == "Player") {
                        senderDet = userDetailssTT.findOne({
                            "userId": senderId,
                            role: "Player"
                        });
                    }*/
                    else {
                      var message = "Invalid sender"
                      resultJson["status"] = "failure";
                      resultJson["response"] = message.toString();
                      resultJson["data"] = false;
                      return resultJson
                    }

                    //sender details is not undefined
                    if (det && senderDet) {
                      //check for receiver role, if sender is coach

                      if (senderDet.role == "Coach") {
                        //call send and in method

                        xDATA.senderId = senderId;
                        xDATA.senderRole = senderDet.role;
                        xDATA.messageType = xDATA.messageType.trim().toLowerCase();
                        xDATA.receiverRole = "All";
                        xDATA.receiverId = "All";
                        xDATA.textMessage = textMessage;
                        xDATA.receiverName = "All";
                        xDATA.senderName = senderDet.userName;

                        var res = await Meteor.call("insertSentBoxInBoxDetCoachAPI", xDATA)
                        try {
                          if (res) {
                            resultJson = res;
                          }
                        }catch(e){
                           var message = "Failed"
                            resultJson["status"] = "failure";
                            resultJson["response"] = e;
                            resultJson["data"] = false;
                        }
                      }

                      //check for receiver role, if sender is player
                      //doubt on this
                      /* else if (senderDet.role == "Player") {
                           //call send and in method
                           xDATA.senderId = senderId;
                           xDATA.senderRole = senderDet.role;
                           xDATA.messageType = xDATA.messageType.trim().toLowerCase();
                           xDATA.receiverRole = "All";
                           xDATA.receiverId = "All";
                           xDATA.textMessage = textMessage;
                           xDATA.receiverName = "All";
                           xDATA.senderName = senderDet.userName;

                           Meteor.call("insertSentBoxInBoxDetCoachAPI", xDATA, function(e, res) {
                              if (e) {
                                  var message = "Failed"
                                  resultJson["status"] = "failure";
                                  resultJson["response"] = e.reason;
                                  resultJson["data"] = false;
                                  messageValidations.push(resultJson);
                             } else if (res) {
                                  messageValidations.push(res)
                              }
                           });
                       }*/
                      else {
                        var message = "Invalid sender"
                        resultJson["status"] = "failure";
                        resultJson["response"] = message.toString();
                        resultJson["data"] = false;
                        return resultJson
                      }
                    } else {
                      var message = "Invalid sender"
                      resultJson["status"] = "failure";
                      resultJson["response"] = message.toString();
                      resultJson["data"] = false;
                      return resultJson
                    }

                  } else {
                    var message = "Invalid sender"
                    resultJson["status"] = "failure";
                    resultJson["response"] = message.toString();
                    resultJson["data"] = false;
                    return resultJson
                  }
                } else {
                  var message = "Require all parameters"
                  resultJson["status"] = "failure";
                  resultJson["response"] = message.toString();
                  resultJson["data"] = false;
                  return resultJson
                }
              }
              //else part is remaining
            } else {
              var message = "Require all parameters"
              resultJson["status"] = "failure";
              resultJson["response"] = message.toString();
              resultJson["data"] = false;
              return resultJson
            }
          }
        } else {
          var message = "Require receiverType, it should be group or player or coach or all"
          resultJson["status"] = "failure";
          resultJson["response"] = message.toString();
          resultJson["data"] = false;
          return resultJson
        }
      } else if (xDATA.messageType && xDATA.messageType.trim().toLowerCase() == "calendarrequest") {
        //check receiverType coach group or player
        /*if (xDATA.receiverType &&
            (xDATA.receiverType.trim().toLowerCase() == "group" ||
                xDATA.receiverType.trim().toLowerCase() == "coach" || xDATA.receiverType.trim().toLowerCase() == "player" 
               )) {
                //check for params
                if (xDATA.senderId && xDATA.messageType && xDATA.receiverId) {
                    //check for calendar date and time
                    if(xDATA.calendarDate&&xDATA.calendarTime)
                    {
                        var dateFormat = 'DD-MM-YYYY hh:mm:ss';
                        //validate date and time of calendar request
                        var momeCheck = moment(moment(new Date(xDATA.calendarDate+" "+xDATA.calendarTime)).format(dateFormat),dateFormat,true).isValid()


                        //if calendar date and time is valid
                        if(momeCheck){
                            Meteor.call("calendarRequestMessageInsert",xDATA,function(e,res){
                                if (e) {
                                    var message = "Failed"
                                    resultJson["status"] = "failure";
                                    resultJson["response"] = e.reason;
                                    resultJson["data"] = false;

                                } else if (res) {
                                    resultJson = res;

                                }
                            })
                        }
                        //else
                        else{
                            var message = "calendar request date and time is not valid"
                            resultJson["status"] = "failure";
                            resultJson["response"] = message.toString();
                            resultJson["data"] = false;
                            return resultJson
                        }
                    }
                    else {
                        var message = "calendar request date and time is not valid"
                        resultJson["status"] = "failure";
                        resultJson["response"] = message.toString();
                        resultJson["data"] = false;
                        return resultJson
                    }
                }
                else {
                    var message = "Require all parameters"
                    resultJson["status"] = "failure";
                    resultJson["response"] = message.toString();
                    resultJson["data"] = false;
                    return resultJson
                }
        } */
        if (xDATA.receiverType && (xDATA.receiverType.trim().toLowerCase() == "group" ||
            xDATA.receiverType.trim().toLowerCase() == "coach" ||
            xDATA.receiverType.trim().toLowerCase() == "player")) {

          if (xDATA.senderId && xDATA.messageType && xDATA.receiverId) {
            if (xDATA.calendarDate && xDATA.calendarTime) {

              var dateFormat = 'DD-MM-YYYY hh:mm:ss';
              var validateDate = moment(moment(new Date(xDATA.calendarDate + " " + xDATA.calendarTime)).format(dateFormat), dateFormat, true).isValid();
              if (validateDate) {
                //fields for sent box
                var senderId = xDATA.senderId.trim();
                var senderRole = ""
                var messageType = xDATA.messageType.trim().toLowerCase()
                var receiverRole = ""
                var receiverId = xDATA.receiverId
                var textMessage = xDATA.textMessage.trim()
                var statusOfSentMessage = "active"
                var receiverName = "";

                //fields for inbox
                var messageSentBoxId
                var readUnreadStatus = "unread"
                var statusOfRecvdMessage = "active"
                var senderName = ""
                var receiverRole = ""
                var receiverId = xDATA.receiverId
                var messageType = xDATA.messageType.trim().toLowerCase();

                if (xDATA.textMessage && xDATA.textMessage.trim().length != 0) {
                  xDATA.textMessage = xDATA.textMessage;
                } else
                  xDATA.textMessage = " ";

                if (xDATA.linkCall && xDATA.linkCall.trim().length) {
                  xDATA.linkCall = xDATA.linkCall
                } else
                  xDATA.linkCall = " ";
                var dateFormat = 'DD MMM YYYY hh:mm:ss';
                xDATA.calendarDateTime = moment(new Date(xDATA.calendarDate + " " + xDATA.calendarTime)).format(dateFormat);
                //xDATA.calendarDateTime = moment(new Date(xDATA.calendarDate)).format("DD MMM YYYY"),

                //check for senderId
                if (senderId) {
                  var det = Meteor.users.findOne({
                    "userId": senderId,
                    $or: [{
                      role: "Player"
                    }, {
                      role: "Coach"
                    }]
                  });

                  //check for role to fetch coachdet
                  var senderDet;
                  if (det && det.role == "Coach") {
                    senderDet = otherUsers.findOne({
                      "userId": senderId,
                      role: "Coach"
                    });
                  }
                  //check for role to fetch player det
                  else if (det && det.role == "Player") {
                    senderDet = nameToCollection(senderId).findOne({
                      "userId": senderId,
                      role: "Player"
                    });
                  }

                  //send error
                  else {
                    var message = "Invalid sender"
                    resultJson["status"] = "failure";
                    resultJson["response"] = message.toString();
                    resultJson["data"] = false;
                    return resultJson
                  }

                  //sender details is not undefined
                  if (det && senderDet) {
                    //player to coach
                    //check for receiver role coach if sender is player
                    if (senderDet.role == "Player") {
                      //find the recver role is coach
                      var recDet = Meteor.users.findOne({
                        userId: receiverId,
                        role: "Coach"
                      })
                      var otherUserDet = otherUsers.findOne({
                        userId: receiverId,
                        role: "Coach"
                      });
                      if (recDet && otherUserDet) {
                        xDATA.senderId = senderId;
                        xDATA.senderRole = senderDet.role;
                        xDATA.messageType = xDATA.messageType.trim().toLowerCase();
                        xDATA.receiverRole = recDet.role;
                        xDATA.receiverId = receiverId;
                        xDATA.textMessage = textMessage;
                        xDATA.receiverName = recDet.userName;
                        xDATA.senderName = senderDet.userName;

                        var res = await Meteor.call("calendarRequestAPI", xDATA)
                        try {
                          if (res) {
                            resultJson = res;
                          }
                        }catch(e){
                          var message = "Failed"
                            resultJson["status"] = "failure";
                            resultJson["response"] = e;
                            resultJson["data"] = false;
                        }
                      } else {
                        var message = "Invalid Receiver"
                        resultJson["status"] = "failure";
                        resultJson["response"] = message.toString();
                        resultJson["data"] = false;
                        return resultJson
                      }


                    }

                    //check for receiver role, if sender is coach
                    else if (senderDet.role == "Coach") {
                      //coach to player/coach/group
                      //check recver is coach or player
                      var recDet = Meteor.users.findOne({
                        userId: receiverId,
                        $or: [{
                          role: "Coach"
                        }, {
                          role: "Player"
                        }]
                      });

                      //check rcver is group
                      var recDetGroup = coachConnectedGroups.findOne({
                        "_id": receiverId
                      })


                      //if not to player, coach or group, send error message
                      if (recDet == undefined && recDetGroup == undefined) 
                        {
                        var message = "Invalid Receiver"
                        resultJson["status"] = "failure";
                        resultJson["response"] = message.toString();
                        resultJson["data"] = false;
                        return resultJson
                      } else if (recDet) {
                        //coach to player
                        if (recDet && recDet.role == "Player") {
                          //check for playerDet
                          var recDBDet = nameToCollection(receiverId).findOne({
                            "userId": receiverId,
                            role: "Player"
                          })

                          if (recDBDet) {
                            //call send and in method
                            xDATA.senderId = senderId;
                            xDATA.senderRole = senderDet.role;
                            xDATA.messageType = xDATA.messageType.trim().toLowerCase();
                            xDATA.receiverRole = recDet.role;
                            xDATA.receiverId = receiverId;
                            xDATA.textMessage = textMessage;
                            xDATA.receiverName = recDBDet.userName;
                            xDATA.senderName = senderDet.userName;

                            var res = await Meteor.call("calendarRequestAPI", xDATA)
                            try {
                               if (res) {
                                resultJson = res;
                              }
                            }catch(e){
                               var message = "Failed"
                                resultJson["status"] = "failure";
                                resultJson["response"] = e;
                                resultJson["data"] = false;
                            }

                          } else {
                            var message = "Invalid Receiver"
                            resultJson["status"] = "failure";
                            resultJson["response"] = message.toString();
                            resultJson["data"] = false;
                            return resultJson
                          }
                        }


                        //if rec is coach
                        else if (recDet && recDet.role == "Coach") {
                          //check for coachdet
                          var recDBDet = otherUsers.findOne({
                            "userId": receiverId,
                            role: "Coach"
                          })

                          if (recDBDet) {
                            //call send and in method
                            xDATA.senderId = senderId;
                            xDATA.senderRole = senderDet.role;
                            xDATA.messageType = xDATA.messageType.trim().toLowerCase();
                            xDATA.receiverRole = recDet.role;
                            xDATA.receiverId = receiverId;
                            xDATA.textMessage = textMessage;
                            xDATA.receiverName = recDBDet.userName;
                            xDATA.senderName = senderDet.userName;

                            var res = await Meteor.call("calendarRequestAPI", xDATA)
                            try {
                              if (e) {
                                
                              } else if (res) {
                                resultJson = res;
                              }
                            }catch(e){
                              var message = "Failed"
                                resultJson["status"] = "failure";
                                resultJson["response"] = e;
                                resultJson["data"] = false;
                            }

                          } else {
                            var message = "Invalid Receiver"
                            resultJson["status"] = "failure";
                            resultJson["response"] = message.toString();
                            resultJson["data"] = false;
                            return resultJson
                          }
                        }
                      }


                      //if rec is group
                      else if (recDetGroup) {
                        //call send and in method
                        xDATA.senderId = senderId;
                        xDATA.senderRole = senderDet.role;
                        xDATA.messageType = xDATA.messageType.trim().toLowerCase();
                        xDATA.receiverRole = "Group";
                        xDATA.receiverId = receiverId;
                        xDATA.textMessage = textMessage;
                        xDATA.receiverName = recDetGroup.groupName;
                        xDATA.senderName = senderDet.userName;

                        var res = await Meteor.call("calendarRequestAPI", xDATA)
                        try {
                          if (res) {
                            resultJson = res;
                          }
                        }catch(e){
                          var message = "Failed"
                            resultJson["status"] = "failure";
                            resultJson["response"] = e;
                            resultJson["data"] = false;
                        }
                      }

                    }

                    //else send error message
                    else {
                      var message = "Invalid sender"
                      resultJson["status"] = "failure";
                      resultJson["response"] = message.toString();
                      resultJson["data"] = false;
                      return resultJson
                    }
                  } else {
                    var message = "Invalid sender"
                    resultJson["status"] = "failure";
                    resultJson["response"] = message.toString();
                    resultJson["data"] = false;
                    return resultJson
                  }
                } else {
                  var message = "Invalid sender"
                  resultJson["status"] = "failure";
                  resultJson["response"] = message.toString();
                  resultJson["data"] = false;
                  return resultJson
                }

              } else {
                var message = "Invalid calendar date and time"
                resultJson["status"] = "failure";
                resultJson["response"] = message.toString();
                resultJson["data"] = false;
                return resultJson
              }
            } else {
              var message = "calendar request date and time required"
              resultJson["status"] = "failure";
              resultJson["response"] = message.toString();
              resultJson["data"] = false;
              return resultJson
            }

          } else {
            var message = "Require all parameters"
            resultJson["status"] = "failure";
            resultJson["response"] = message.toString();
            resultJson["data"] = false;
            return resultJson
          }


        } else {
          var message = "Require receiverType, it should be group or player or coach or all"
          resultJson["status"] = "failure";
          resultJson["response"] = message.toString();
          resultJson["data"] = false;
          return resultJson
        }

      } else if (xDATA.messageType && xDATA.messageType.trim().toLowerCase() == "assignment") {
        // entered assignment
        //check for receiver type
        if (xDATA.receiverType && (xDATA.receiverType.trim().toLowerCase() == "group" ||
            xDATA.receiverType.trim().toLowerCase() == "coach" ||
            xDATA.receiverType.trim().toLowerCase() == "player")) {

          if (xDATA.senderId && xDATA.messageType && xDATA.receiverId) {
            if (xDATA.textMessage && xDATA.textMessage.trim().length != 0) {

              //fields for sent box
              var senderId = xDATA.senderId.trim();
              var senderRole = ""
              var messageType = xDATA.messageType.trim().toLowerCase()
              var receiverRole = ""
              var receiverId = xDATA.receiverId
              var textMessage = xDATA.textMessage.trim()
              var statusOfSentMessage = "active"
              var receiverName = "";

              //fields for inbox
              var messageSentBoxId
              var readUnreadStatus = "unread"
              var statusOfRecvdMessage = "active"
              var senderName = ""
              var receiverRole = ""
              var receiverId = xDATA.receiverId
              var messageType = xDATA.messageType.trim().toLowerCase()

              //check for senderId
              if (senderId) {
                var det = Meteor.users.findOne({
                  "userId": senderId,
                  $or: [{
                    role: "Player"
                  }, {
                    role: "Coach"
                  }]
                });

                //check for role to fetch coachdet
                var senderDet;
                if (det && det.role == "Coach") {
                  senderDet = otherUsers.findOne({
                    "userId": senderId,
                    role: "Coach"
                  });
                }
                //check for role to fetch player det
                else if (det && det.role == "Player") {
                  senderDet = nameToCollection(senderId).findOne({
                    "userId": senderId,
                    role: "Player"
                  })

                }

                //send error
                else {
                  var message = "Invalid sender"
                  resultJson["status"] = "failure";
                  resultJson["response"] = message.toString();
                  resultJson["data"] = false;
                  return resultJson
                }

                //sender details is not undefined
                if (det && senderDet) {
                  //player to coach
                  //check for receiver role coach if sender is player
                  if (senderDet.role == "Player") {
                    //find the recver role is coach
                    var recDet = Meteor.users.findOne({
                      userId: receiverId,
                      role: "Coach"
                    })
                    var otherUserDet = otherUsers.findOne({
                      userId: receiverId,
                      role: "Coach"
                    });
                    if (recDet && otherUserDet) {
                      xDATA.senderId = senderId;
                      xDATA.senderRole = senderDet.role;
                      xDATA.messageType = xDATA.messageType.trim().toLowerCase();
                      xDATA.receiverRole = recDet.role;
                      xDATA.receiverId = receiverId;
                      xDATA.textMessage = textMessage;
                      xDATA.receiverName = recDet.userName;
                      xDATA.senderName = senderDet.userName;

                      var res = await Meteor.call("createAssignment", xDATA)
                      try {
                       if (res) {
                          resultJson = res;
                        }
                      }catch(e){
                        var message = "Failed"
                          resultJson["status"] = "failure";
                          resultJson["response"] = e;
                          resultJson["data"] = false;

                      }
                    } else {
                      var message = "Invalid Receiver"
                      resultJson["status"] = "failure";
                      resultJson["response"] = message.toString();
                      resultJson["data"] = false;
                      return resultJson
                    }


                  }

                  //check for receiver role, if sender is coach
                  else if (senderDet.role == "Coach") {
                    //coach to player/coach/group
                    //check recver is coach or player
                    var recDet = Meteor.users.findOne({
                      userId: receiverId,
                      $or: [{
                        role: "Coach"
                      }, {
                        role: "Player"
                      }]
                    });

                    //check rcver is group
                    var recDetGroup = coachConnectedGroups.findOne({
                      "_id": receiverId
                    })


                    //if not to player, coach or group, send error message
                    if (recDet == undefined && recDetGroup == undefined) {
                      var message = "Invalid Receiver"
                      resultJson["status"] = "failure";
                      resultJson["response"] = message.toString();
                      resultJson["data"] = false;
                      return resultJson
                    } else if (recDet) {
                      //coach to player
                      if (recDet && recDet.role == "Player") {
                        //check for playerDet
                        var recDBDet = nameToCollection(receiverId).findOne({
                          "userId": receiverId,
                          role: "Player"
                        })

                        if (recDBDet) {
                          //call send and in method
                          xDATA.senderId = senderId;
                          xDATA.senderRole = senderDet.role;
                          xDATA.messageType = xDATA.messageType.trim().toLowerCase();
                          xDATA.receiverRole = recDet.role;
                          xDATA.receiverId = receiverId;
                          xDATA.textMessage = textMessage;
                          xDATA.receiverName = recDBDet.userName;
                          xDATA.senderName = senderDet.userName;

                          var res = await Meteor.call("createAssignment", xDATA)
                          try {
                            if (res) {
                              resultJson = res;
                            }
                          }catch(e){
                             var message = "Failed"
                              resultJson["status"] = "failure";
                              resultJson["response"] = e;
                              resultJson["data"] = false;
                          }

                        } else {
                          var message = "Invalid Receiver"
                          resultJson["status"] = "failure";
                          resultJson["response"] = message.toString();
                          resultJson["data"] = false;
                          return resultJson
                        }
                      }


                      //if rec is coach
                      else if (recDet && recDet.role == "Coach") {
                        //check for coachdet
                        var recDBDet = otherUsers.findOne({
                          "userId": receiverId,
                          role: "Coach"
                        })

                        if (recDBDet) {
                          //call send and in method
                          xDATA.senderId = senderId;
                          xDATA.senderRole = senderDet.role;
                          xDATA.messageType = xDATA.messageType.trim().toLowerCase();
                          xDATA.receiverRole = recDet.role;
                          xDATA.receiverId = receiverId;
                          xDATA.textMessage = textMessage;
                          xDATA.receiverName = recDBDet.userName;
                          xDATA.senderName = senderDet.userName;

                          var res = await Meteor.call("createAssignment", xDATA)
                          try {
                           if (res) {
                              resultJson = res;
                            }
                          }catch(e){
                             var message = "Failed"
                              resultJson["status"] = "failure";
                              resultJson["response"] = e;
                              resultJson["data"] = false;
                          }

                        } else {
                          var message = "Invalid Receiver"
                          resultJson["status"] = "failure";
                          resultJson["response"] = message.toString();
                          resultJson["data"] = false;
                          return resultJson
                        }
                      }
                    }


                    //if rec is group
                    else if (recDetGroup) {
                      //call send and in method
                      xDATA.senderId = senderId;
                      xDATA.senderRole = senderDet.role;
                      xDATA.messageType = xDATA.messageType.trim().toLowerCase();
                      xDATA.receiverRole = "Group";
                      xDATA.receiverId = receiverId;
                      xDATA.textMessage = textMessage;
                      xDATA.receiverName = recDetGroup.groupName;
                      xDATA.senderName = senderDet.userName;

                      var res = await Meteor.call("createAssignment", xDATA)
                      try {
                         if (res) {
                          resultJson = res;
                        }
                      }catch(e){
                        var message = "Failed"
                          resultJson["status"] = "failure";
                          resultJson["response"] = e;
                          resultJson["data"] = false;
                      }
                    }

                  }

                  //else send error message
                  else {
                    var message = "Invalid sender"
                    resultJson["status"] = "failure";
                    resultJson["response"] = message.toString();
                    resultJson["data"] = false;
                    return resultJson
                  }
                } else {
                  var message = "Invalid sender"
                  resultJson["status"] = "failure";
                  resultJson["response"] = message.toString();
                  resultJson["data"] = false;
                  return resultJson
                }
              } else {
                var message = "Invalid sender"
                resultJson["status"] = "failure";
                resultJson["response"] = message.toString();
                resultJson["data"] = false;
                return resultJson
              }
            } else {
              var message = "Require all parameters"
              resultJson["status"] = "failure";
              resultJson["response"] = message.toString();
              resultJson["data"] = false;
              return resultJson
            }

          } else {
            var message = "Require all parameters"
            resultJson["status"] = "failure";
            resultJson["response"] = message.toString();
            resultJson["data"] = false;
            return resultJson
          }


        } else {
          var message = "Require receiverType, it should be group or player or coach"
          resultJson["status"] = "failure";
          resultJson["response"] = message.toString();
          resultJson["data"] = false;
          return resultJson
        }
      } else {
        var message = "messageType should be text or assignment or calendar request"
        resultJson["status"] = "failure";
        resultJson["response"] = e;
        resultJson["data"] = false;
        return resultJson;
      }

      return resultJson
    } catch (e) {
      var message = "Invalid data"
      resultJson["status"] = "failure";
      resultJson["response"] = e;
      resultJson["data"] = false;
      return resultJson
    }
  }
});


//insert message when new schem
Meteor.methods({
  "insertSentBoxInBoxDetCoachAPI": function(xDATA) {
    try {

      var coachAPPSentBOX
      var sentInsert = true;

      //check for already sent
      /*var coachAPPSentBoxDEt = coachAPPSentBOX.findOne({
          senderId:xDATA.senderId,
          receiverId:xDATA.receiverId
      });*/
      var senderId = xDATA.senderId
      var senderIdOutArr;
      var senderNameOutArr;
      var senderRoleOutArr;

      senderIdOutArr = xDATA.senderId
      senderRoleOutArr = xDATA.senderRole
      senderNameOutArr = xDATA.senderName
      senderRoleOutArr = xDATA.senderRole


      //need to check with vinaya
      /*
      //if msg to group then sender becomes group id
      if (xDATA.receiverRole.toLowerCase() == "group") {
          senderIdOutArr = xDATA.receiverId
      } 
      //if msg to all, then sender id becomes all
      else if (xDATA.receiverRole.toLowerCase() == "all") {
          senderIdOutArr = xDATA.receiverId
      } 
      else {
          senderIdOutArr = xDATA.senderId
      }*/

      /*
      //if msg to group then sender becomes group senderName
      if (xDATA.receiverRole.toLowerCase() == "group") {
          senderNameOutArr = xDATA.receiverName
      }
      //if msg to all, then sender name becomes all 
      //else if (xDATA.receiverRole.toLowerCase() == "all") {
         // senderNameOutArr = xDATA.receiverName
      //}
      else {
          senderNameOutArr = xDATA.senderName
      }
      */

      /*
      //if msg to group then sender becomes group senderName
      if (xDATA.receiverRole.toLowerCase() == "group") {
          senderRoleOutArr = xDATA.receiverRole
      }
      //if msg to all, then sender name becomes all 
      else if (xDATA.receiverRole.toLowerCase() == "all") {
          senderRoleOutArr = xDATA.receiverRole
      }
      else {
          senderRoleOutArr = xDATA.senderRole
      }
      */


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
      if (coachAPPINSentBOXDEt == undefined) {

        var dataREc = {
          senderId: senderIdOutArr,
          senderRole: senderRoleOutArr,
          receiverRole: receiverRole,
          receiverId: receiverId,
          statusOfWholeMessage: statusOfWholeMessage,
          readUnreadWholeMessageStatus: readUnreadWholeMessageStatus,
          senderName: senderNameOutArr,
          receiverName: receiverName,
          receivedDateAndTime: new Date(),
          message: message,
          messagesBox: [{
            _id: Random.id(),
            messageType: messageType,
            message: message,
            receivedDateAndTime: new Date(),
            senderId: senderId,
            receiverId: receiverId,
            senderRole: senderRole,
            receiverRole: receiverRole
          }]
        }

        if (xDATA.messageType.trim().toLowerCase() == "calendarrequest") {
          dataREc.messagesBox[0].calendarDateTime = xDATA.calendarDateTime
          dataREc.messagesBox[0].linkCall = xDATA.linkCall
        }

        if (xDATA.messageType.trim().toLowerCase() == "assignment") {
          dataREc.messagesBox[0].set = xDATA.set;
          dataREc.messagesBox[0].setRepeat = xDATA.setRepeat;
          dataREc.messagesBox[0].startBy = new Date();
          dataREc.messagesBox[0].finishBy = new Date();
        }


        var inboxInsert = coachAPPINSentBOX.insert(
          dataREc
        );
        //if inbox is saved
        if (inboxInsert) {
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
      else if (coachAPPINSentBOXDEt != undefined) {

        var statusOfWholeMessage = "active"
        var readUnreadWholeMessageStatus = "unread"

        var messagesBoxDET = [{
          _id: Random.id(),
          messageType: messageType,
          message: message,
          receivedDateAndTime: new Date(),
          senderId: senderId,
          receiverId: receiverId,
          senderRole: senderRole,
          receiverRole: receiverRole
        }]

        if (xDATA.messageType.trim().toLowerCase() == "calendarrequest") {
          messagesBoxDET[0].calendarDateTime = xDATA.calendarDateTime
          messagesBoxDET[0].linkCall = xDATA.linkCall
        }
        if (xDATA.messageType.trim().toLowerCase() == "assignment") {
          messagesBoxDET[0].set = xDATA.set;
          messagesBoxDET[0].setRepeat = xDATA.setRepeat;
          messagesBoxDET[0].startBy = new Date();
          messagesBoxDET[0].finishBy = new Date();
        }


        var updateINBOX = coachAPPINSentBOX.update({
          "_id": coachAPPINSentBOXDEt._id
        }, {
          $set: {
            statusOfWholeMessage: statusOfWholeMessage,
            readUnreadWholeMessageStatus: readUnreadWholeMessageStatus,
            //senderName: senderNameOutArr,
            //receiverName: receiverName,
            receivedDateAndTime: new Date(),
            message: message
          },
          "$push": {
            messagesBox: {
              $each: messagesBoxDET,
              $position: 0
            },
          }
        });

        if (updateINBOX) {
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