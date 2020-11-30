import {nameToCollection} from '../methods/dbRequiredRole.js'

/* 
    default publication on loading player list
    publication to fetch users based on login based on selection criteria
    params - 
        skipcount - limit to show in page
    if logged in as player - 
        returns only if he is affiliated
        if affiliated to association - return player list of that affiliated association
        if affiliated to academy - return player list of that affiliated academy
    if logged in as association - return player list of his association only
    if logged in as academy - return player list of his academy only

*/
Meteor.publish('getPlayerListOnLogin', function(skipCount) {
    var positiveIntegerCheck = Match.Where(function(x) {
        check(x, Match.Integer);
        return x >= 0;
    });

    check(skipCount, positiveIntegerCheck);
    var loggedIn = Meteor.users.findOne({
        "_id": this.userId
    });
    var players;
    if (loggedIn && loggedIn.userId) {
        if (loggedIn.role && loggedIn.role == "Player" && nameToCollection(this.userId)) {

            var userDetailsTTInfo = nameToCollection(this.userId).findOne({
                "userId": this.userId
            });
            var userSport = userDetailsTTInfo.interestedProjectName[0];
            if (userDetailsTTInfo.associationId || userDetailsTTInfo.parentAssociationId) {
                if (userDetailsTTInfo.interestedProjectName && userDetailsTTInfo.interestedProjectName.length > 0) {
                    Counts.publish(this, 'playersCount', nameToCollection(userSport).find({
                        "role": "Player",
                        "interestedProjectName": {
                            $in: [userDetailsTTInfo.interestedProjectName[0]]
                        },
                        $or: [{
                            "associationId": userDetailsTTInfo.associationId
                        }, {
                            "parentAssociationId": userDetailsTTInfo.associationId,
                        }]
                    }), {
                        noReady: true
                    });
                    players = nameToCollection(userSport).find({
                        "role": "Player",
                        "interestedProjectName": {
                            $in: [userDetailsTTInfo.interestedProjectName[0]]
                        },
                        $or: [{
                            "associationId": userDetailsTTInfo.associationId
                        }, {
                            "parentAssociationId": userDetailsTTInfo.associationId
                        }],
                    }, {
                        limit: 10,
                        skip: skipCount
                    });
                }
            }
        } else if (loggedIn.role && loggedIn.role == "Academy") {
            var projectName = loggedIn.interestedProjectName;
            var userSport = loggedIn.interestedProjectName[0];
            if (loggedIn.interestedProjectName && projectName != "" && nameToCollection(userSport)) {
                Counts.publish(this, 'playersCount', nameToCollection(userSport).find({
                    "role": "Player",
                    "clubNameId": loggedIn.userId,
                    "interestedProjectName": {
                        $in: [loggedIn.interestedProjectName[0]]
                    }
                }), {
                    noReady: true
                });

                players = nameToCollection(userSport).find({
                    "role": "Player",
                    "clubNameId": loggedIn.userId,
                    "interestedProjectName": {
                        $in: [loggedIn.interestedProjectName[0]]
                    }
                }, {
                    limit: 10,
                    skip: skipCount
                });
            } else {

                /*Counts.publish(this, 'playersCount', userDetailsTT.find({
                    "role": "Player",
                    "clubNameId": loggedIn.userId
                }), {
                    noReady: true
                });

                players = userDetailsTT.find({
                    "role": "Player",
                    "clubNameId": loggedIn.userId
                }, {
                    limit: 10,
                    skip: skipCount
                });*/
            }

        } else if (loggedIn.role && (loggedIn.role == "Association") && loggedIn.associationType == "State/Province/County") {

            if (loggedIn.interestedProjectName && nameToCollection(loggedIn.interestedProjectName[0])) 
            {
                var userSport = loggedIn.interestedProjectName[0];
                Counts.publish(this, 'playersCount', nameToCollection(userSport).find({
                    "role": "Player",
                    "interestedProjectName": {
                        $in: [loggedIn.interestedProjectName[0]]
                    },
                    $or: [{
                        "associationId": loggedIn.userId
                    }, {
                        "parentAssociationId": loggedIn.userId
                    }],
                }), {
                    noReady: true
                });
                players = nameToCollection(userSport).find({
                    "role": "Player",
                    "interestedProjectName": {
                        $in: [loggedIn.interestedProjectName[0]]
                    },
                    $or: [{
                        "associationId": loggedIn.userId
                    }, {
                        "parentAssociationId": loggedIn.userId
                    }],
                }, {
                    limit: 10,
                    skip: skipCount
                });
            }
        } else if (loggedIn.role && (loggedIn.role == "Association") && loggedIn.associationType == "District/City") {
            if (loggedIn.interestedProjectName && nameToCollection(loggedIn.interestedProjectName[0])) {

                var userSport = loggedIn.interestedProjectName[0];

                Counts.publish(this, 'playersCount', nameToCollection(userSport).find({
                    "role": "Player",
                    "interestedProjectName": {
                        $in: [loggedIn.interestedProjectName[0]]
                    },
                    "associationId": loggedIn.userId,
                }), {
                    noReady: true
                });
                players = nameToCollection(userSport).find({
                    "role": "Player",
                    "interestedProjectName": {
                        $in: [loggedIn.interestedProjectName[0]]
                    },
                    "associationId": loggedIn.userId
                }, {
                    limit: 10,
                    skip: skipCount
                });
            }
        }
    }
    return players;
});


/* publication to fetch users under academy based on selection criteria
    params - 
        skipcount - limit to show in page
        sportID - id of the sport
        filterID - id of the academy
        gender - gender selection done by the user(Male/Female/All)
        approval - approval selection done by the user(Approved/Pending/All)
        playerSearchValue -  search input value

*/
Meteor.publish('getacademyusersPub', function(skipCount, sportID, filterID, gender, approval,playerSearchValue) {
    var players;
    var queryJson = {};
    var approvalQuery = {};
    if(nameToCollection(sportID))
    {
       
        queryJson["interestedProjectName"] = {
                $in: [sportID]
            };
        queryJson["clubNameId"] = filterID;
        queryJson["role"] = "Player";
        
        if(gender.trim() != "")
            queryJson["gender"] = gender;
        if(playerSearchValue != undefined && playerSearchValue != null && playerSearchValue.trim() != "")
        {
            var reObj = new RegExp(playerSearchValue, 'i');
            queryJson["userName"] = {
                $regex: reObj
            }
        }

        if (approval != "" && approval.trim() == "Pending")
            queryJson["$and"] =  [{
                    $or: [{
                        $and: [{
                            $or: [{
                                "affiliationId": null
                            }, {
                                "affiliationId": ""
                            }, {
                                "affiliationId": "other"
                            }]
                        }, {
                            "statusOfUser": "Active"
                        }]
                    }, {
                        $and: [{
                            "affiliationId": {
                                $nin: [null, "", "other" ]
                            }
                        }, {
                            "statusOfUser": "notApproved"
                        }]
                    }]
                }]
            
        if (approval != "" && approval.trim() == "Approved")
            queryJson["$and"] =  [{
                    $or: [{
                        "affiliationId": {
                            $nin: [null, "", "other" ]
                        }
                    }]
                }, {
                    "statusOfUser": "Active"
                }]
            


        Counts.publish(this, 'playersCount', nameToCollection(sportID).find(
            queryJson
        ), {
            noReady: true
        });



        players = nameToCollection(sportID).find(
            queryJson
        , {
            limit: 10,
            skip: skipCount
        });


    }

    

    return players
})

/* publication to fetch users under association based on selection criteria
    params - 
        skipcount - limit to show in page
        sportID - id of the sport
        filterID - id of the association
        gender - gender selection done by the user(Male/Female/All)
        approval - approval selection done by the user(Approved/Pending/All)
        playerSearchValue -  search input value

*/
Meteor.publish('getassociatedusersPub', function(skipCount, sportID, filterID, gender, approval,playerSearchValue) {
    var players;
    var queryJson = {};
    var approvalQuery = {};
    if(nameToCollection(sportID))
    {
       
        queryJson["interestedProjectName"] = {
                $in: [sportID]
            };
        //queryJson["clubNameId"] = filterID;
        queryJson["role"] = "Player";

        queryJson["$or"] =  [{
                "associationId": filterID
            }, {
                "parentAssociationId": filterID
            }]
        
        if(gender.trim() != "")
            queryJson["gender"] = gender;
        if(playerSearchValue != undefined && playerSearchValue != null && playerSearchValue.trim() != "")
        {
            var reObj = new RegExp(playerSearchValue, 'i');
            queryJson["userName"] = {
                $regex: reObj
            }

        }
        

        if (approval != "" && approval.trim() == "Pending")
            queryJson["$and"] =  [{
                    $or: [{
                        $and: [{
                            $or: [{
                                "affiliationId": null
                            },  {
                                "affiliationId": ""
                            }, {
                                "affiliationId": "other"
                            }]
                        }, {
                            "statusOfUser": "Active"
                        }]
                    }, {
                        $and: [{
                            "affiliationId": {
                                $nin: [null, "", "other"]
                            }
                        }, {
                            "statusOfUser": "notApproved"
                        }]
                    }]
                }]
            
        if (approval != "" && approval.trim() == "Approved")
            queryJson["$and"] =  [{
                    $or: [{
                        "affiliationId": {
                            $nin: [null, "", "other"]
                        }
                    }]
                }, {
                    "statusOfUser": "Active"
                }]
            




        Counts.publish(this, 'playersCount', nameToCollection(sportID).find(
            queryJson
        ), {
            noReady: true
        });



        players = nameToCollection(sportID).find(
            queryJson
        , {
            limit: 10,
            skip: skipCount
        });

        return players;
        

    }

    
    if (gender.trim() == "" && approval.trim() == "" && nameToCollection(sportID)) {
        Counts.publish(this, 'playersCount', nameToCollection(sportID).find({
            "interestedProjectName": {
                $in: [sportID]
            },
            "role": "Player",
            $or: [{
                "associationId": filterID
            }, {
                "parentAssociationId": filterID
            }]
        }), {
            noReady: true
        });
        players = nameToCollection(sportID).find({
            "interestedProjectName": {
                $in: [sportID]
            },
            "role": "Player",
            $or: [{
                "associationId": filterID
            }, {
                "parentAssociationId": filterID
            }]
        }, {
            limit: 10,
            skip: skipCount
        });

        var mx = userDetailsTT.find({
            "interestedProjectName": {
                $in: [sportID]
            },
            "role": "Player",
            $or: [{
                "associationId": filterID
            }, {
                "parentAssociationId": filterID
            }]
        }, {
            limit: 10,
            skip: skipCount
        });

    } else if (gender.trim() != "" && approval.trim() == "" && nameToCollection(sportID)) {
        Counts.publish(this, 'playersCount', nameToCollection(sportID).find({
            "gender": gender,
            "interestedProjectName": {
                $in: [sportID]
            },
            "role": "Player",
            $or: [{
                "associationId": filterID
            }, {
                "parentAssociationId": filterID
            }]
        }), {
            noReady: true
        });
        players = nameToCollection(sportID).find({
            "gender": gender,
            "interestedProjectName": {
                $in: [sportID]
            },
            "role": "Player",
            $or: [{
                "associationId": filterID
            }, {
                "parentAssociationId": filterID
            }]
        }, {
            limit: 10,
            skip: skipCount
        });
    } else if (gender.trim() == "" && approval.trim() != "" && nameToCollection(sportID)) {
        if (approval.trim() == "Pending") {
            Counts.publish(this, 'playersCount', nameToCollection(sportID).find({
                "interestedProjectName": {
                    $in: [sportID]
                },
                "role": "Player",
                $or: [{
                    "associationId": filterID
                }, {
                    "parentAssociationId": filterID
                }],
                $and: [{
                    $or: [{
                        $and: [{
                            $or: [{
                                "affiliationId": null
                            },  {
                                "affiliationId": ""
                            }, {
                                "affiliationId": "other"
                            }]
                        }, {
                            "statusOfUser": "Active"
                        }]
                    }, {
                        $and: [{
                            "affiliationId": {
                                $nin: [null, "", "other"]
                            }
                        }, {
                            "statusOfUser": "notApproved"
                        }]
                    }]
                }],

            }), {
                noReady: true
            });

            players = nameToCollection(sportID).find({
                "interestedProjectName": {
                    $in: [sportID]
                },
                "role": "Player",
                $or: [{
                    "associationId": filterID
                }, {
                    "parentAssociationId": filterID
                }],
                $and: [{
                    $or: [{
                        $and: [{
                            $or: [{
                                "affiliationId": null
                            },  {
                                "affiliationId": ""
                            }, {
                                "affiliationId": "other"
                            }]
                        }, {
                            "statusOfUser": "Active"
                        }]
                    }, {
                        $and: [{
                            "affiliationId": {
                                $nin: [null, "", "other"]
                            }
                        }, {
                            "statusOfUser": "notApproved"
                        }]
                    }]
                }],
            }, {
                limit: 10,
                skip: skipCount
            });

        } else if (approval.trim() == "Approved" && nameToCollection(sportID)) {

            Counts.publish(this, 'playersCount', nameToCollection(sportID).find({
                "interestedProjectName": {
                    $in: [sportID]
                },
                "role": "Player",
                $or: [{
                    "associationId": filterID
                }, {
                    "parentAssociationId": filterID
                }],
                $and: [{
                    $or: [{
                        "affiliationId": {
                            $nin: [null, "", "other"]
                        }
                    }]
                }, {
                    "statusOfUser": "Active"
                }]
            }), {
                noReady: true
            });

            players = nameToCollection(sportID).find({
                "interestedProjectName": {
                    $in: [sportID]
                },
                "role": "Player",
                $or: [{
                    "associationId": filterID
                }, {
                    "parentAssociationId": filterID
                }],
                $and: [{
                    $or: [{
                        "affiliationId": {
                            $nin: [null, "", "other" ]
                        }
                    }]
                }, {
                    "statusOfUser": "Active"
                }]
            }, {
                limit: 10,
                skip: skipCount
            });
        }
    } else if (gender.trim() != "" && approval.trim() != "" && nameToCollection(sportID)) {
        if (approval.trim() == "Pending") {
            Counts.publish(this, 'playersCount', nameToCollection(sportID).find({
                "gender": gender,
                "interestedProjectName": {
                    $in: [sportID]
                },
                "role": "Player",
                $or: [{
                    "associationId": filterID
                }, {
                    "parentAssociationId": filterID
                }],
                $and: [{
                    $or: [{
                        $and: [{
                            $or: [{
                                "affiliationId": null
                            },  {
                                "affiliationId": ""
                            }, {
                                "affiliationId": "other"
                            }]
                        }, {
                            "statusOfUser": "Active"
                        }]
                    }, {
                        $and: [{
                            "affiliationId": {
                                $nin: [null, "", "other" ]
                            }
                        }, {
                            "statusOfUser": "notApproved"
                        }]
                    }]
                }],
            }), {
                noReady: true
            });

            players = nameToCollection(sportID).find({
                "gender": gender,
                "interestedProjectName": {
                    $in: [sportID]
                },
                "role": "Player",
                $or: [{
                    "associationId": filterID
                }, {
                    "parentAssociationId": filterID
                }],
                $and: [{
                    $or: [{
                        $and: [{
                            $or: [{
                                "affiliationId": null
                            },{
                                "affiliationId": ""
                            }, {
                                "affiliationId": "other"
                            }]
                        }, {
                            "statusOfUser": "Active"
                        }]
                    }, {
                        $and: [{
                            "affiliationId": {
                                $nin: [null, "", "other" ]
                            }
                        }, {
                            "statusOfUser": "notApproved"
                        }]
                    }]
                }],
            }, {
                limit: 10,
                skip: skipCount
            });
        } else if (approval.trim() == "Approved" && nameToCollection(sportID)) {
            Counts.publish(this, 'playersCount', nameToCollection(sportID).find({
                "gender": gender,
                "interestedProjectName": {
                    $in: [sportID]
                },
                "role": "Player",
                $or: [{
                    "associationId": filterID
                }, {
                    "parentAssociationId": filterID
                }],
                $and: [{
                    $or: [{
                        "affiliationId": {
                            $nin: [null, "", "other" ]
                        }
                    }]
                }, {
                    "statusOfUser": "Active"
                }]
            }), {
                noReady: true
            });

            players = nameToCollection(sportID).find({
                "gender": gender,
                "interestedProjectName": {
                    $in: [sportID]
                },
                "role": "Player",
                $or: [{
                    "associationId": filterID
                }, {
                    "parentAssociationId": filterID
                }],
                $and: [{
                    $or: [{
                        "affiliationId": {
                            $nin: [null, "", "other" ]
                        }
                    }]
                }, {
                    "statusOfUser": "Active"
                }]
            }, {
                limit: 10,
                skip: skipCount
            });
        }
    }
    return players
})

/* publication to fetch users under region based on selection criteria
    params - 
        skipcount - limit to show in page
        sportID - id of the sport
        filterID - id of the donain
        gender - gender selection done by the user(Male/Female/All)
        approval - approval selection done by the user(Approved/Pending/All)
        playerSearchValue -  search input value

*/
Meteor.publish('getregionusersPub', function(skipCount, sportID, filterID, gender, approval,playerSearchValue) {
    var players;
    var queryJson = {};
    var approvalQuery = {};
    if(nameToCollection(sportID))
    {
       
        queryJson["interestedProjectName"] = {
                $in: [sportID]
            };
        queryJson["interestedDomainName"] =  {
                $in: [filterID]
            }
        queryJson["role"] = "Player";
        
        if(gender.trim() != "")
            queryJson["gender"] = gender;
        if(playerSearchValue != undefined && playerSearchValue != null && playerSearchValue.trim() != "")
        {
            var reObj = new RegExp(playerSearchValue, 'i');
            queryJson["userName"] = {
                $regex: reObj
            }
        }

        if (approval != "" && approval.trim() == "Pending")
            queryJson["$and"] =  [{
                    $or: [{
                        $and: [{
                            $or: [{
                                "affiliationId": null
                            },  {
                                "affiliationId": ""
                            }, {
                                "affiliationId": "other"
                            }]
                        }, {
                            "statusOfUser": "Active"
                        }]
                    }, {
                        $and: [{
                            "affiliationId": {
                                $nin: [null, "", "other" ]
                            }
                        }, {
                            "statusOfUser": "notApproved"
                        }]
                    }]
                }]
            
        if (approval != "" && approval.trim() == "Approved")
            queryJson["$and"] =  [{
                    $or: [{
                        "affiliationId": {
                            $nin: [null, "", "other" ]
                        }
                    }]
                }, {
                    "statusOfUser": "Active"
                }]
            


        Counts.publish(this, 'playersCount', nameToCollection(sportID).find(
            queryJson
        ), {
            noReady: true
        });



        players = nameToCollection(sportID).find(
            queryJson
        , {
            limit: 10,
            skip: skipCount
        });


    }

   

    return players
})