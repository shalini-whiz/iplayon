Meteor.methods({
    //create packs
    'createPacksPublished': function(xData) {
        try {
            var response;
            if (xData != undefined && xData != null) {
                if (xData.userId != undefined && xData.userId != null && xData.userId.trim().length != 0) {
                    if (xData.palnType != undefined && xData.palnType != null && xData.palnType.trim().length != 0 && xData.amount != undefined && xData.amount != null && 
                        xData.amount.trim().length != 0 && 
                        //xData.messageLimit != undefined && xData.messageLimit != null && 
                       // xData.messageLimit.trim().length != 0 && xData.videoMinutesLimit != undefined && 
                        //xData.videoMinutesLimit != null && xData.videoMinutesLimit.trim().length != 0 && 
                        //xData.videoAnalysisLimit != undefined && xData.videoAnalysisLimit != null && xData.videoAnalysisLimit.trim().length != 0 && 

                        xData.validityDays != undefined && xData.validityDays != null && xData.validityDays.trim().length != 0) {
                        if (xData.types != undefined && xData.types != null && xData.types.trim().length != 0 && (xData.type != "Article" || xData.type != "Pack")) {
                            if (xData.role != undefined && xData.role != null && xData.role.trim().length != 0) {
                                if (xData.titles != undefined && xData.titles != null && xData.titles.trim().length != 0) {
                                    if (xData.articleDesc != undefined && xData.articleDesc != null && xData.articleDesc.trim().length != 0) {
                                        if (xData.category != undefined && xData.category != null && xData.category.trim().length != 0) {


                                            var validInt = true
                                            if (true) {
                                                let samt = xData.amount
                                                //let s1 = xData.messageLimit
                                                //let s2 = xData.videoMinutesLimit
                                                //let s3 = xData.videoAnalysisLimit
                                                let s4 = xData.validityDays
                                                var reg = new RegExp('^\\d+$');
                                                let valid = reg.test(samt);
                                                validInt = valid

                                                if (validInt) {
                                                    let valid = reg.test(s4);
                                                    validInt = valid
                                                    if (validInt) {
                                                        let valid = reg.test(s4);
                                                        validInt = valid
                                                        if (validInt) {
                                                            let valid = reg.test(s4);
                                                            validInt = valid
                                                            if (validInt) {
                                                                let valid = reg.test(s4);
                                                                validInt = valid
                                                                if (validInt) {
                                                                    //check players are subscribed to this pack
                                                                    var articleInsert = articlesOfPublisher.insert({
                                                                        type: xData.types,
                                                                        userId: xData.userId,
                                                                        role: xData.role,
                                                                        title: xData.titles,
                                                                        articleDesc: xData.articleDesc,
                                                                        offset: new Date().getTimezoneOffset(),
                                                                        status: "active",
                                                                        amount: xData.amount,
                                                                        //messageLimit: xData.messageLimit,
                                                                        //videoMinutesLimit: xData.videoMinutesLimit,
                                                                        //videoAnalysisLimit: xData.videoAnalysisLimit,
                                                                        validityDays: xData.validityDays,
                                                                        planType: xData.palnType,
                                                                        category: xData.category,
                                                                        "features":xData.features
                                                                    })
                                                                    if (articleInsert) {
                                                                        var s = articlesOfPublisher.findOne({
                                                                            "_id": articleInsert.toString()
                                                                        })
                                                                        if (s) {
                                                                            var data = {
                                                                                "message": "Pack inserted",
                                                                                "result": true,
                                                                                "data": s
                                                                            }
                                                                            response = data
                                                                        } else {
                                                                            var data = {
                                                                                "message": "cannot insert Pack",
                                                                                "result": false,
                                                                                "data": 0
                                                                            }
                                                                            response = data
                                                                        }
                                                                    } else {
                                                                        var data = {
                                                                            "message": "cannot insert Pack",
                                                                            "result": false,
                                                                            "data": 0
                                                                        }
                                                                        response = data
                                                                    }
                                                                } else {
                                                                    var data = {
                                                                        "message": "validityDays is not valid",
                                                                        "result": false,
                                                                        "data": 0
                                                                    }
                                                                    response = data
                                                                }
                                                            } else {
                                                                var data = {
                                                                    "message": "videoAnalysisLimit is not valid",
                                                                    "result": false,
                                                                    "data": 0
                                                                }
                                                                response = data
                                                            }
                                                        } else {
                                                            var data = {
                                                                "message": "videoMinutesLimit is not valid",
                                                                "result": false,
                                                                "data": 0
                                                            }
                                                            response = data
                                                        }
                                                    } else {
                                                        var data = {
                                                            "message": "message limit is not valid",
                                                            "result": false,
                                                            "data": 0
                                                        }
                                                        response = data
                                                    }
                                                } else {
                                                    var data = {
                                                        "message": "Amount is not valid",
                                                        "result": false,
                                                        "data": 0
                                                    }
                                                    response = data
                                                }

                                            } else {
                                                var data = {
                                                    "message": "Pack id is not valid",
                                                    "result": false,
                                                    "data": 0
                                                }
                                                response = data
                                            }
                                        } else {
                                            var data = {
                                                "message": "category is invalid",
                                                "result": false,
                                                "data": 0
                                            }
                                            response = data
                                        }
                                    } else {
                                        var data = {
                                            "message": "Pack desc is not valid",
                                            "result": false,
                                            "data": 0
                                        }
                                        response = data
                                    }

                                } else {
                                    var data = {
                                        "message": "title is not valid",
                                        "result": false,
                                        "data": 0
                                    }
                                    response = data
                                }

                            } else {
                                var data = {
                                    "message": "role is not valid",
                                    "result": false,
                                    "data": 0
                                }
                                response = data
                            }

                        } else {
                            var data = {
                                "message": "type is not valid",
                                "result": false,
                                "data": 0
                            }
                            response = data
                        }
                    } else {
                        var data = {
                            "message": "amount or messageLimit or videoMinutesLimit or videoAnalysisLimit or validityDays is not valid",
                            "result": false,
                            "data": 0
                        }
                        response = data
                    }
                } else {
                    var data = {
                        "message": "userId is not valid",
                        "result": false,
                        "data": 0
                    }
                    response = data
                }
            } else {
                var data = {
                    "message": "data is empty",
                    "result": false,
                    "data": 0
                }
                response = data
            }
            return response
        } catch (e) {
            var response;
            var data = {
                "message": "cannot insert Pack",
                "result": false,
                "data": 0
            }
            response = data
            return response
        }
    }
});

Meteor.methods({
    //fetch my articles and all coach articles
    'fetchPacksForGivenUserIdsAdmin': function(xData) {
        try {
            var response;
            if (xData != undefined && xData != null) {
                if (xData.userIds != undefined && xData.userIds != null) {
                    if (xData.userIds.length == 0) {
                        var s = articlesOfPublisher.find({
                            "type": "Packs"
                        }).fetch()
                        if (s && s.length != 0) {

                            var raw = articlesOfPublisher.rawCollection();
                            var distinct = Meteor.wrapAsync(raw.distinct, raw);
                            var userList = distinct('userId', {
                                "role": "Coach",
                                "type": "Packs"
                            });
                            var userData = Meteor.users.find({
                                "_id": {
                                    $in: userList
                                }
                            }, {
                                fields: {
                                    userName: 1,
                                    userId: 1
                                }
                            }).fetch();
                            var r = {}
                            r["articles"] = s
                            r["userData"] = userData
                            var data = {
                                "message": "Packs List",
                                "result": true,
                                "status": "success",
                                "data": r
                            }

                            response = data
                        } else {
                            var data = {
                                "message": "No Packs",
                                "result": true,
                                "data": 0
                            }
                            response = data
                        }
                    } else {
                        var s = articlesOfPublisher.find({
                            userId: {
                                $in: xData.userIds
                            },
                            "type": "Packs"
                        }).fetch()
                        if (s && s.length != 0) {
                            var raw = articlesOfPublisher.rawCollection();
                            var distinct = Meteor.wrapAsync(raw.distinct, raw);
                            var userList = distinct('userId', {
                                "role": "Coach",
                                "type": "Packs",
                                userId: {
                                    $in: xData.userIds
                                }
                            });
                            var userData = Meteor.users.find({
                                "_id": {
                                    $in: userList
                                }
                            }, {
                                fields: {
                                    userName: 1,
                                    userId: 1
                                }
                            }).fetch();
                            var r = {}
                            r["articles"] = s
                            r["userData"] = userData

                            var data = {
                                "message": "Packs List",
                                "result": true,
                                "status": "success",
                                "data": r
                            }

                            response = data
                        } else {
                            var data = {
                                "message": "No Packs",
                                "result": true,
                                "data": 0
                            }
                            response = data
                        }
                    }
                }
            } else {
                var data = {
                    "message": "data is empty",
                    "result": false,
                    "data": 0
                }
                response = data
            }
            return response
        } catch (e) {
            var response;
            var data = {
                "message": "cannot fetch Packs",
                "result": false,
                "data": 0
            }
            response = data
            return response
        }
    }
});


Meteor.methods({
    //update packs
    'updatePacksPublished': function(xData) {
        try {
            var response;
            if (xData != undefined && xData != null) {
                if (xData.userId != undefined && xData.userId != null && xData.userId.trim().length != 0) {
                    if (xData.packId != undefined && xData.packId != null && xData.packId.trim().length != 0 && xData.palnType != undefined && xData.palnType != null && xData.palnType.trim().length != 0 && xData.amount != undefined && xData.amount != null && xData.amount.trim().length != 0 && 
                        //xData.messageLimit != undefined && xData.messageLimit != null && xData.messageLimit.trim().length != 0 && 
                       // xData.videoMinutesLimit != undefined && xData.videoMinutesLimit != null && xData.videoMinutesLimit.trim().length != 0 && 
                        //xData.videoAnalysisLimit != undefined && xData.videoAnalysisLimit != null && xData.videoAnalysisLimit.trim().length != 0 && 

                        xData.validityDays != undefined && xData.validityDays != null && xData.validityDays.trim().length != 0) {
                        if (xData.types != undefined && xData.types != null && xData.types.trim().length != 0 && (xData.type != "Article" || xData.type != "Pack")) 
                        {
                            if (xData.role != undefined && xData.role != null && xData.role.trim().length != 0) {
                                if (xData.titles != undefined && xData.titles != null && xData.titles.trim().length != 0) {
                                    if (xData.articleDesc != undefined && xData.articleDesc != null && xData.articleDesc.trim().length != 0) {
                                        if (xData.category != undefined && xData.category != null && xData.category.trim().length != 0) {
                                            var s1 = articlesOfPublisher.findOne({
                                                "_id": xData.packId.toString()
                                            })
                                            var validInt = true
                                            if (s1) {
                                                let samt = xData.amount
                                                //let s1 = xData.messageLimit
                                                //let s2 = xData.videoMinutesLimit
                                                //let s3 = xData.videoAnalysisLimit
                                                let s4 = xData.validityDays
                                                var reg = new RegExp('^\\d+$');
                                                let valid = reg.test(samt);
                                                validInt = valid

                                                if (validInt) {
                                                    let valid = reg.test(s4);
                                                    validInt = valid
                                                    if (validInt) {
                                                        let valid = reg.test(s4);
                                                        validInt = valid
                                                        if (validInt) {
                                                            let valid = reg.test(s4);
                                                            validInt = valid
                                                            if (validInt) {
                                                                let valid = reg.test(s4);
                                                                validInt = valid
                                                                if (validInt) {
                                                                    //check players are subscribed to this pack
                                                                    var SubscribedPacks = userSubscribedPacks.findOne({
                                                                        packId: xData.packId
                                                                    })
                                                                    if (SubscribedPacks == undefined) {
                                                                        var articleInsert = articlesOfPublisher.update({
                                                                            "_id": xData.packId
                                                                        }, {
                                                                            $set: {
                                                                                type: xData.types,
                                                                                userId: xData.userId,
                                                                                role: xData.role,
                                                                                title: xData.titles,
                                                                                articleDesc: xData.articleDesc,
                                                                                offset: new Date().getTimezoneOffset(),
                                                                                status: xData.status,
                                                                                amount: xData.amount,
                                                                                //messageLimit: xData.messageLimit,
                                                                                //videoMinutesLimit: xData.videoMinutesLimit,
                                                                                //videoAnalysisLimit: xData.videoAnalysisLimit,
                                                                                validityDays: xData.validityDays,
                                                                                planType: xData.palnType,
                                                                                category: xData.category,
                                                                                "features":xData.features
                                                                            }
                                                                        })
                                                                        if (articleInsert) {
                                                                            var s = articlesOfPublisher.findOne({
                                                                                "_id": xData.packId.toString()
                                                                            })
                                                                            if (s) {
                                                                                var data = {
                                                                                    "message": "Pack updated",
                                                                                    "result": true,
                                                                                    "data": s
                                                                                }
                                                                                response = data
                                                                            } else {
                                                                                var data = {
                                                                                    "message": "cannot update Pack",
                                                                                    "result": false,
                                                                                    "data": 0
                                                                                }
                                                                                response = data
                                                                            }
                                                                        } else {
                                                                            var data = {
                                                                                "message": "cannot update Pack",
                                                                                "result": false,
                                                                                "data": 0
                                                                            }
                                                                            response = data
                                                                        }
                                                                    } else {
                                                                        var data = {
                                                                            "message": "There are subscribers, cannot update",
                                                                            "result": false,
                                                                            "data": 0
                                                                        }
                                                                        response = data
                                                                    }
                                                                } else {
                                                                    var data = {
                                                                        "message": "validityDays is not valid",
                                                                        "result": false,
                                                                        "data": 0
                                                                    }
                                                                    response = data
                                                                }
                                                            } else {
                                                                var data = {
                                                                    "message": "videoAnalysisLimit is not valid",
                                                                    "result": false,
                                                                    "data": 0
                                                                }
                                                                response = data
                                                            }
                                                        } else {
                                                            var data = {
                                                                "message": "videoMinutesLimit is not valid",
                                                                "result": false,
                                                                "data": 0
                                                            }
                                                            response = data
                                                        }
                                                    } else {
                                                        var data = {
                                                            "message": "message limit is not valid",
                                                            "result": false,
                                                            "data": 0
                                                        }
                                                        response = data
                                                    }
                                                } else {
                                                    var data = {
                                                        "message": "Amount is not valid",
                                                        "result": false,
                                                        "data": 0
                                                    }
                                                    response = data
                                                }

                                            } else {
                                                var data = {
                                                    "message": "Pack id is not valid",
                                                    "result": false,
                                                    "data": 0
                                                }
                                                response = data
                                            }
                                        } else {
                                            var data = {
                                                "message": "category is not valid",
                                                "result": false,
                                                "data": 0
                                            }
                                            response = data
                                        }
                                    } else {
                                        var data = {
                                            "message": "Pack desc is not valid",
                                            "result": false,
                                            "data": 0
                                        }
                                        response = data
                                    }

                                } else {
                                    var data = {
                                        "message": "title is not valid",
                                        "result": false,
                                        "data": 0
                                    }
                                    response = data
                                }

                            } else {
                                var data = {
                                    "message": "role is not valid",
                                    "result": false,
                                    "data": 0
                                }
                                response = data
                            }

                        } else {
                            var data = {
                                "message": "type is not valid",
                                "result": false,
                                "data": 0
                            }
                            response = data
                        }
                    } else {
                        var data = {
                            "message": "pack id or amount or messageLimit or videoMinutesLimit or videoAnalysisLimit or validityDays is not valid",
                            "result": false,
                            "data": 0
                        }
                        response = data
                    }
                } else {
                    var data = {
                        "message": "userId is not valid",
                        "result": false,
                        "data": 0
                    }
                    response = data
                }
            } else {
                var data = {
                    "message": "data is empty",
                    "result": false,
                    "data": 0
                }
                response = data
            }
            return response
        } catch (e) {
            var response;
            var data = {
                "message": "cannot update Pack",
                "result": false,
                "data": 0
            }
            response = data
            return response
        }
    }
});


Meteor.methods({
    //update packs
    'updatePacksStatus': function(xData) {
        try {
            var response;
            if (xData != undefined && xData != null) {
                if (xData.userId != undefined && xData.userId != null && xData.userId.trim().length != 0) {
                    if (xData.packId != undefined && xData.packId != null && xData.packId.trim().length != 0) {
                        if (xData.types != undefined && xData.types != null && xData.types.trim().length != 0 && (xData.type != "Article" || xData.type != "Pack")) {
                            if (xData.role != undefined && xData.role != null && xData.role.trim().length != 0) {
                                if (true) {
                                    if (true) {
                                        var s1 = articlesOfPublisher.findOne({
                                            "_id": xData.packId.toString()
                                        })
                                        if (s1) {
                                            //check players are subscribed to this pack
                                            var SubscribedPacks = true
                                            if (SubscribedPacks) {
                                                var articleInsert = articlesOfPublisher.update({
                                                    "_id": xData.packId
                                                }, {
                                                    $set: {
                                                        status: xData.status,
                                                    }
                                                })
                                                if (articleInsert) {
                                                    var s = articlesOfPublisher.findOne({
                                                        "_id": xData.packId.toString()
                                                    })
                                                    if (s) {
                                                        var data = {
                                                            "message": "Pack status updated",
                                                            "result": true,
                                                            "data": s
                                                        }
                                                        response = data
                                                    } else {
                                                        var data = {
                                                            "message": "cannot update Pack status",
                                                            "result": false,
                                                            "data": 0
                                                        }
                                                        response = data
                                                    }
                                                } else {
                                                    var data = {
                                                        "message": "cannot update Pack status",
                                                        "result": false,
                                                        "data": 0
                                                    }
                                                    response = data
                                                }
                                            } else {
                                                var data = {
                                                    "message": "There are subscribers, cannot update",
                                                    "result": false,
                                                    "data": 0
                                                }
                                                response = data
                                            }
                                        } else {
                                            var data = {
                                                "message": "Pack id is not valid",
                                                "result": false,
                                                "data": 0
                                            }
                                            response = data
                                        }
                                    } else {
                                        var data = {
                                            "message": "Pack desc is not valid",
                                            "result": false,
                                            "data": 0
                                        }
                                        response = data
                                    }

                                } else {
                                    var data = {
                                        "message": "title is not valid",
                                        "result": false,
                                        "data": 0
                                    }
                                    response = data
                                }

                            } else {
                                var data = {
                                    "message": "role is not valid",
                                    "result": false,
                                    "data": 0
                                }
                                response = data
                            }

                        } else {
                            var data = {
                                "message": "type is not valid",
                                "result": false,
                                "data": 0
                            }
                            response = data
                        }
                    } else {
                        var data = {
                            "message": "pack id or amount or messageLimit or videoMinutesLimit or videoAnalysisLimit or validityDays is not valid",
                            "result": false,
                            "data": 0
                        }
                        response = data
                    }
                } else {
                    var data = {
                        "message": "userId is not valid",
                        "result": false,
                        "data": 0
                    }
                    response = data
                }
            } else {
                var data = {
                    "message": "data is empty",
                    "result": false,
                    "data": 0
                }
                response = data
            }
            return response
        } catch (e) {
            var response;
            var data = {
                "message": "cannot update Pack status",
                "result": false,
                "data": 0
            }
            response = data
            return response
        }
    }
});