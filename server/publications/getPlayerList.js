import {nameToCollection} from '../methods/dbRequiredRole.js'

//userDetailsTTUsed



//to be commented
/*
Meteor.publish('getassociatedusers', function(skipCount, sportID, filterID, gender, approval) {
    var players;
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

//to be commented
Meteor.publish('getacademyusers', function(skipCount, sportID, filterID, gender, approval) {
    var players;

    if (gender.trim() == "" && approval.trim() == "" && nameToCollection(sportID)) {

        Counts.publish(this, 'playersCount', nameToCollection(sportID).find({
            "interestedProjectName": {
                $in: [sportID]
            },
            "clubNameId": filterID,
            "role": "Player"
        }), {
            noReady: true
        });

        players = nameToCollection(sportID).find({
            "interestedProjectName": {
                $in: [sportID]
            },
            "role": "Player",
            "clubNameId": filterID
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
            "clubNameId": filterID
        }), {
            noReady: true
        });

        players = nameToCollection(sportID).find({
            "gender": gender,
            "interestedProjectName": {
                $in: [sportID]
            },
            "role": "Player",
            "clubNameId": filterID
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
                "clubNameId": filterID,
                $and: [{
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
                }],
            }), {
                noReady: true
            });

            players = nameToCollection(sportID).find({
                "interestedProjectName": {
                    $in: [sportID]
                },
                "role": "Player",
                "clubNameId": filterID,
                $and: [{
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
                }],
            }, {
                limit: 10,
                skip: skipCount
            });

        } else if (approval.trim() == "Approved" && nameToCollection(sportID)) {

            test = Counts.publish(this, 'playersCount', nameToCollection(sportID).find({
                "interestedProjectName": {
                    $in: [sportID]
                },
                "role": "Player",
                "clubNameId": filterID,
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
                "interestedProjectName": {
                    $in: [sportID]
                },
                "role": "Player",
                "clubNameId": filterID,
                $and: [{
                    $or: [{
                        "affiliationId": {
                            $nin: [null, "", "other"]
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
            test = Counts.publish(this, 'playersCount', nameToCollection(sportID).find({
                "gender": gender,
                "interestedProjectName": {
                    $in: [sportID]
                },
                "role": "Player",
                "clubNameId": filterID,
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
                "clubNameId": filterID,
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
            }, {
                limit: 10,
                skip: skipCount
            });
        } else if (approval.trim() == "Approved" && nameToCollection(sportID)) {
            test = Counts.publish(this, 'playersCount', nameToCollection(sportID).find({
                "gender": gender,
                "interestedProjectName": {
                    $in: [sportID]
                },
                "role": "Player",
                "clubNameId": filterID,
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
                "clubNameId": filterID,
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


//to be commented
Meteor.publish('getregionusers', function(skipCount, sportID, filterID, gender, approval) {
    var players;

    if (gender.trim() == "" && approval.trim() == "" && nameToCollection(sportID)) {

        Counts.publish(this, 'playersCount', nameToCollection(sportID).find({
            "interestedProjectName": {
                $in: [sportID]
            },
            "interestedDomainName": {
                $in: [filterID]
            },
            "role": "Player"
        }), {
            noReady: true
        });

        players = nameToCollection(sportID).find({
            "interestedProjectName": {
                $in: [sportID]
            },
            "role": "Player",
            "interestedDomainName": {
                $in: [filterID]
            }
        }, {
            limit: 10,
            skip: skipCount
        });

    } else if (gender.trim() != "" && approval.trim() == "" && nameToCollection(sportID)) {
        Counts.publish(this, 'playersCount', nameToCollection(sportID).find({
            "interestedProjectName": {
                $in: [sportID]
            },
            "interestedDomainName": {
                $in: [filterID]
            },
            "role": "Player",
            "gender": gender
        }), {
            noReady: true
        });

        players = nameToCollection(sportID).find({
            "interestedProjectName": {
                $in: [sportID]
            },
            "interestedDomainName": {
                $in: [filterID]
            },
            "role": "Player",
            "gender": gender,
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
                "interestedDomainName": {
                    $in: [filterID]
                },
                "role": "Player",
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
                }]
            }), {
                noReady: true
            });

            players = nameToCollection(sportID).find({
                "interestedProjectName": {
                    $in: [sportID]
                },
                "interestedDomainName": {
                    $in: [filterID]
                },
                "role": "Player",
                $and: [{
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
                "interestedDomainName": {
                    $in: [filterID]
                },
                "role": "Player",
                $and: [{
                    $or: [{
                        "affiliationId": {
                            $nin: [null, "", "other" ]
                        }
                    }]
                }, {
                    "statusOfUser": "Active"
                }],
            }), {
                noReady: true
            });

            players = nameToCollection(sportID).find({
                "interestedProjectName": {
                    $in: [sportID]
                },
                "interestedDomainName": {
                    $in: [filterID]
                },
                "role": "Player",
                $and: [{
                    $or: [{
                        "affiliationId": {
                            $nin: [null, "", "other" ]
                        }
                    }]
                }, {
                    "statusOfUser": "Active"
                }],
            }, {
                limit: 10,
                skip: skipCount
            });
        }
    } else if (gender.trim() != "" && approval.trim() != "" && nameToCollection(sportID)) {
        if (approval.trim() == "Pending") {
            Counts.publish(this, 'playersCount', nameToCollection(sportID).find({
                "interestedProjectName": {
                    $in: [sportID]
                },
                "interestedDomainName": {
                    $in: [filterID]
                },
                "role": "Player",
                "gender": gender,
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
                "interestedProjectName": {
                    $in: [sportID]
                },
                "interestedDomainName": {
                    $in: [filterID]
                },
                "role": "Player",
                "gender": gender,
                $and: [{
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
                "interestedDomainName": {
                    $in: [filterID]
                },
                "role": "Player",
                "gender": gender,
                $and: [{
                    $or: [{
                        "affiliationId": {
                            $nin: [null, "", "other" ]
                        }
                    }]
                }, {
                    "statusOfUser": "Active"
                }],
            }), {
                noReady: true
            });

            players = nameToCollection(sportID).find({
                "interestedProjectName": {
                    $in: [sportID]
                },
                "interestedDomainName": {
                    $in: [filterID]
                },
                "role": "Player",
                "gender": gender,
                $and: [{
                    $or: [{
                        "affiliationId": {
                            $nin: [null, "", "other" ]
                        }
                    }]
                }, {
                    "statusOfUser": "Active"
                }],
            }, {
                limit: 10,
                skip: skipCount
            });
        }
    }

    return players
})
*/

/********************************** player list on search *****************************/
Meteor.publish('playerNameSearch', function(skipCount, value) {
    var positiveIntegerCheck = Match.Where(function(x) {
        check(x, Match.Integer);
        return x >= 0;
    });

    check(skipCount, positiveIntegerCheck);
    var loggedIn = Meteor.users.findOne({
        "_id": this.userId
    });
    var players;
    var reObj = new RegExp(value, 'i');
    if (loggedIn && loggedIn.userId) {

        if (loggedIn.role && loggedIn.role == "Player") 
        {
            var userDetailsTTInfo = nameToCollection(this.userId).findOne({
                "userId": this.userId
            });

            if ( nameToCollection(userDetailsTTInfo.interestedProjectName[0]) && (userDetailsTTInfo.associationId || userDetailsTTInfo.parentAssociationId)) {
                
                var userSport = nameToCollection(userDetailsTTInfo.interestedProjectName[0]);
                Counts.publish(this, 'playersCount', nameToCollection(userSport).find({
                    "role": "Player",
                    userName: {
                        $regex: reObj
                    },
                    $or: [{
                        "associationId": loggedIn.associationId
                    }, {
                        "parentAssociationId": loggedIn.associationId,
                    }]
                }), {
                    noReady: true
                });

                players = nameToCollection(userSport).find({
                    "role": "Player",
                    userName: {
                        $regex: reObj
                    },
                    $or: [{
                        "associationId": loggedIn.associationId
                    }, {
                        "parentAssociationId": loggedIn.associationId,
                    }],
                }, {
                    limit: 10,
                    skip: skipCount
                });
            }
        }

        if (loggedIn.role && loggedIn.role == "Academy" && nameToCollection(loggedIn.interestedProjectName[0])) 
        {
            var userSport = loggedIn.interestedProjectName[0];
            
            Counts.publish(this, 'playersCount', nameToCollection(userSport).find({
                "role": "Player",
                "clubNameId": loggedIn.userId,
                userName: {
                    $regex: reObj
                }
            }), {
                noReady: true
            });

            players = nameToCollection(userSport).find({
                "role": "Player",
                "clubNameId": loggedIn.userId,
                userName: {
                    $regex: reObj
                }
            }, {
                limit: 10,
                skip: skipCount
            });

        } else if (loggedIn.role && (loggedIn.role == "Association") && 
            loggedIn.associationType == "State/Province/County" && loggedIn.interestedProjectName[0]) {

            var userSport = loggedIn.interestedProjectName[0];
            
            Counts.publish(this, 'playersCount', nameToCollection(userSport).find({
                "role": "Player",
                userName: {
                    $regex: reObj
                },
                $or: [{
                    "associationId": loggedIn.userId
                }, {
                    "parentAssociationId": loggedIn.userId,
                }],
            }), {
                noReady: true
            });

            players = nameToCollection(userSport).find({
                "role": "Player",
                userName: {
                    $regex: reObj
                },
                $or: [{
                    "associationId": loggedIn.userId
                }, {
                    "parentAssociationId": loggedIn.userId,
                }],
            }, {
                limit: 10,
                skip: skipCount
            });
        } else if (loggedIn.role && (loggedIn.role == "Association") && 
            loggedIn.associationType == "District/City"
            && loggedIn.interestedProjectName[0]) {
            var userSport = loggedIn.interestedProjectName[0];
            Counts.publish(this, 'playersCount', nameToCollection(userSport).find({
                "role": "Player",
                userName: {
                    $regex: reObj
                },
                "associationId": loggedIn.userId,
            }), {
                noReady: true
            });

            players = nameToCollection(userSport).find({
                "role": "Player",
                userName: {
                    $regex: reObj
                },
                "associationId": loggedIn.userId,
            }, {
                limit: 10,
                skip: skipCount
            });
        }
    }
    return players
});

/*
//to be commented
Meteor.publish('getassociatedusersOnSearch', function(skipCount, sportID, filterID, gender, approval, playerSearchValue) {
    var players;
    var reObj = new RegExp(playerSearchValue, 'i');

    if (gender.trim() == "" && approval.trim() == "" && nameToCollection(sportID)) {

        Counts.publish(this, 'playersCount', nameToCollection(sportID).find({
            "interestedProjectName": {
                $in: [sportID]
            },
            "userName": {
                $regex: reObj
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
            "userName": {
                $regex: reObj
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
            "userName": {
                $regex: reObj
            },
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
            "userName": {
                $regex: reObj
            },
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
                "userName": {
                    $regex: reObj
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
                "interestedProjectName": {
                    $in: [sportID]
                },
                "userName": {
                    $regex: reObj
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
            }, {
                limit: 10,
                skip: skipCount
            });

        } else if (approval.trim() == "Approved" && nameToCollection(sportID)) {

            Counts.publish(this, 'playersCount', nameToCollection(sportID).find({
                "interestedProjectName": {
                    $in: [sportID]
                },
                "userName": {
                    $regex: reObj
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
                "interestedProjectName": {
                    $in: [sportID]
                },
                "userName": {
                    $regex: reObj
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
                "userName": {
                    $regex: reObj
                },
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
                "userName": {
                    $regex: reObj
                },
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
                }],
            }, {
                limit: 10,
                skip: skipCount
            });
        } else if (approval.trim() == "Approved" && nameToCollection(sportID)) {
            Counts.publish(this, 'playersCount', nameToCollection(sportID).find({
                "gender": gender,
                "userName": {
                    $regex: reObj
                },
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
                "userName": {
                    $regex: reObj
                },
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
            }, {
                limit: 10,
                skip: skipCount
            });
        }
    }
    return players
})

//to be commented
Meteor.publish('getacademyusersOnSearch', function(skipCount, sportID, filterID, gender, approval, playerSearchValue) {
    var players;
    var reObj = new RegExp(playerSearchValue, 'i');


    if (gender.trim() == "" && approval.trim() == "" && nameToCollection(sportID)) {
        Counts.publish(this, 'playersCount', nameToCollection(sportID).find({
            "interestedProjectName": {
                $in: [sportID]
            },
            "userName": {
                $regex: reObj
            },
            "clubNameId": filterID,
            "role": "Player"
        }), {
            noReady: true
        });

        players = nameToCollection(sportID).find({
            "interestedProjectName": {
                $in: [sportID]
            },
            "role": "Player",
            "userName": {
                $regex: reObj
            },
            "clubNameId": filterID
        }, {
            limit: 10,
            skip: skipCount
        });

    } else if (gender.trim() != "" && approval.trim() == "" && nameToCollection(sportID)) {
        Counts.publish(this, 'playersCount', nameToCollection(sportID).find({
            "gender": gender,
            "userName": {
                $regex: reObj
            },
            "interestedProjectName": {
                $in: [sportID]
            },
            "role": "Player",
            "clubNameId": filterID,
        }), {
            noReady: true
        });

        players = nameToCollection(sportID).find({
            "gender": gender,
            "userName": {
                $regex: reObj
            },
            "interestedProjectName": {
                $in: [sportID]
            },
            "role": "Player",
            "clubNameId": filterID,
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
                "userName": {
                    $regex: reObj
                },
                "clubNameId": filterID,
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
                "interestedProjectName": {
                    $in: [sportID]
                },
                "role": "Player",
                "userName": {
                    $regex: reObj
                },
                "clubNameId": filterID,
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
                "userName": {
                    $regex: reObj
                },
                "clubNameId": filterID,
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
                "userName": {
                    $regex: reObj
                },
                "clubNameId": filterID,
                $and: [{
                    $or: [{
                        "affiliationId": {
                            $nin: [null, "", "other"]
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
                "userName": {
                    $regex: reObj
                },
                "interestedProjectName": {
                    $in: [sportID]
                },
                "role": "Player",
                "clubNameId": filterID,
                $and: [{
                    $or: [{
                        $and: [{
                            $or: [{
                                "affiliationId": null
                            },
                             {
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
                "gender": gender,
                "userName": {
                    $regex: reObj
                },
                "interestedProjectName": {
                    $in: [sportID]
                },
                "role": "Player",
                "clubNameId": filterID,
                $and: [{
                    $or: [{
                        $and: [{
                            $or: [{
                                "affiliationId": null
                            },
                             {
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
                "gender": gender,
                "userName": {
                    $regex: reObj
                },
                "interestedProjectName": {
                    $in: [sportID]
                },
                "role": "Player",
                "clubNameId": filterID,
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
                "gender": gender,
                "userName": {
                    $regex: reObj
                },
                "interestedProjectName": {
                    $in: [sportID]
                },
                "role": "Player",
                "clubNameId": filterID,
                $and: [{
                    $or: [{
                        "affiliationId": {
                            $nin: [null, "", "other"]
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


//to be commented
Meteor.publish('getregionusersOnSearch', function(skipCount, sportID, filterID, gender, approval, playerSearchValue) {
    var players;
    var reObj = new RegExp(playerSearchValue, 'i');

    if (gender.trim() == "" && approval.trim() == "" && nameToCollection(sportID)) {
        Counts.publish(this, 'playersCount', nameToCollection(sportID).find({
            "interestedProjectName": {
                $in: [sportID]
            },
            "userName": {
                $regex: reObj
            },
            "interestedDomainName": {
                $in: [filterID]
            },
            "role": "Player"
        }), {
            noReady: true
        });

        players = nameToCollection(sportID).find({
            "interestedProjectName": {
                $in: [sportID]
            },
            "role": "Player",
            "userName": {
                $regex: reObj
            },
            "interestedDomainName": {
                $in: [filterID]
            }
        }, {
            limit: 10,
            skip: skipCount
        });
    } else if (gender.trim() != "" && approval.trim() == "" && nameToCollection(sportID)) {
        Counts.publish(this, 'playersCount', nameToCollection(sportID).find({
            "interestedProjectName": {
                $in: [sportID]
            },
            "role": "Player",
            "userName": {
                $regex: reObj
            },
            "interestedDomainName": {
                $in: [filterID]
            },
            "gender": gender,
        }), {
            noReady: true
        });

        players = nameToCollection(sportID).find({
            "interestedProjectName": {
                $in: [sportID]
            },
            "role": "Player",
            "userName": {
                $regex: reObj
            },
            "gender": gender,
            "interestedDomainName": {
                $in: [filterID]
            }
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
                "interestedDomainName": {
                    $in: [filterID]
                },
                "role": "Player",
                "userName": {
                    $regex: reObj
                },
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
                "interestedProjectName": {
                    $in: [sportID]
                },
                "role": "Player",
                "userName": {
                    $regex: reObj
                },
                "interestedDomainName": {
                    $in: [filterID]
                },
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
            }, {
                limit: 10,
                skip: skipCount
            });
        } else if (approval.trim() == "Approved" && nameToCollection(sportID)) {
            Counts.publish(this, 'playersCount', nameToCollection(sportID).find({
                "interestedProjectName": {
                    $in: [sportID]
                },
                "interestedDomainName": {
                    $in: [filterID]
                },
                "role": "Player",
                "userName": {
                    $regex: reObj
                },
                $and: [{
                    $or: [{
                        "affiliationId": {
                            $nin: [null, "", "other" ]
                        }
                    }]
                }, {
                    "statusOfUser": "Active"
                }],
            }), {
                noReady: true
            });

            players = nameToCollection(sportID).find({
                "interestedProjectName": {
                    $in: [sportID]
                },
                "role": "Player",
                "userName": {
                    $regex: reObj
                },
                "interestedDomainName": {
                    $in: [filterID]
                },
                $and: [{
                    $or: [{
                        "affiliationId": {
                            $nin: [null, "", "other" ]
                        }
                    }]
                }, {
                    "statusOfUser": "Active"
                }],
            }, {
                limit: 10,
                skip: skipCount
            });
        }
    } else if (gender.trim() != "" && approval.trim() != "" && nameToCollection(sportID)) {
        if (approval.trim() == "Pending") {
            Counts.publish(this, 'playersCount', nameToCollection(sportID).find({
                "interestedProjectName": {
                    $in: [sportID]
                },
                "interestedDomainName": {
                    $in: [filterID]
                },
                "role": "Player",
                "userName": {
                    $regex: reObj
                },
                "gender": gender,
                $and: [{
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
                }],
            }), {
                noReady: true
            });

            players = nameToCollection(sportID).find({
                "interestedProjectName": {
                    $in: [sportID]
                },
                "role": "Player",
                "userName": {
                    $regex: reObj
                },
                "gender": gender,
                "interestedDomainName": {
                    $in: [filterID]
                },
                $and: [{
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
                "interestedDomainName": {
                    $in: [filterID]
                },
                "role": "Player",
                "userName": {
                    $regex: reObj
                },
                "gender": gender,
                $and: [{
                    $or: [{
                        "affiliationId": {
                            $nin: [null, "", "other" ]
                        }
                    }]
                }, {
                    "statusOfUser": "Active"
                }],
            }), {
                noReady: true
            });

            players = nameToCollection(sportID).find({
                "interestedProjectName": {
                    $in: [sportID]
                },
                "role": "Player",
                "userName": {
                    $regex: reObj
                },
                "gender": gender,
                "interestedDomainName": {
                    $in: [filterID]
                },
                $and: [{
                    $or: [{
                        "affiliationId": {
                            $nin: [null, "", "other" ]
                        }
                    }]
                }, {
                    "statusOfUser": "Active"
                }],
            }, {
                limit: 10,
                skip: skipCount
            });
        }
    }
    return players
})
*/
/******************************** approval count ***************************************/
Meteor.methods({

//to be commented
    /*"getApprovalCount": function(sportID, filterBy, filterID, gender, approval, associationId) {
        var approvalCount = "";
        if (filterBy == "Association") {
            if (gender.trim() == "" && approval.trim() == "" && nameToCollection(sportID)) {
                

                approvalCount = nameToCollection(sportID).find({
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    $or: [{
                        "associationId": associationId
                    }, {
                        "parentAssociationId": associationId
                    }],
                    $and: [{
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
                                    $nin: [null, "", "other"]
                                }
                            }, {
                                "statusOfUser": "notApproved"
                            }]
                        }]
                    }]
                });
            } else if (gender.trim() != "" && approval.trim() == "" && nameToCollection(sportID)) {
                approvalCount = nameToCollection(sportID).find({
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    "gender": gender,
                    $or: [{
                        "associationId": associationId
                    }, {
                        "parentAssociationId": associationId
                    }],
                    $and: [{
                        $or: [{
                            $and: [{
                                $or: [{
                                    "affiliationId": null
                                }, 
                                {
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
                });
            } else if (gender.trim() == "" && approval.trim() != "" && nameToCollection(sportID)) {
                approvalCount = nameToCollection(sportID).find({
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    $or: [{
                        "associationId": associationId
                    }, {
                        "parentAssociationId": associationId,
                    }],
                    $and: [{
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
                                    $nin: [null, "", "other"]
                                }
                            }, {
                                "statusOfUser": "notApproved"
                            }]
                        }]
                    }],
                })
            } else if (gender.trim() != "" && approval.trim() != "" && nameToCollection(sportID)) {
                approvalCount = nameToCollection(sportID).find({
                    "gender": gender,
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    $or: [{
                        "associationId": associationId
                    }, {
                        "parentAssociationId": associationId,
                    }],
                    $and: [{
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
                                    $nin: [null, "", "other"]
                                }
                            }, {
                                "statusOfUser": "notApproved"
                            }]
                        }]
                    }],
                })
            }
        } else if (filterBy == "Institution/Academy" && nameToCollection(sportID)) {
            if (gender.trim() == "" && approval.trim() == "") {
                approvalCount = nameToCollection(sportID).find({
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    "clubNameId": filterID,
                    $or: [{
                        "associationId": associationId
                    }, {
                        "parentAssociationId": associationId
                    }],
                    $and: [{
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
                                    $nin: [null, "", "other"]
                                }
                            }, {
                                "statusOfUser": "notApproved"
                            }]
                        }]
                    }]
                })
            } else if (gender.trim() != "" && approval.trim() == "" && nameToCollection(sportID)) {
                approvalCount = nameToCollection(sportID).find({
                    "gender": gender,
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    "clubNameId": filterID,
                    $or: [{
                        "associationId": associationId
                    }, {
                        "parentAssociationId": associationId
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
                    }]
                })
            } else if (gender.trim() == "" && approval.trim() != "" && nameToCollection(sportID)) {
                approvalCount = nameToCollection(sportID).find({
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    "clubNameId": filterID,
                    $or: [{
                        "associationId": associationId
                    }, {
                        "parentAssociationId": associationId
                    }],
                    $and: [{
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
                                    $nin: [null, "", "other"]
                                }
                            }, {
                                "statusOfUser": "notApproved"
                            }]
                        }]
                    }],
                })
            } else if (gender.trim() != "" && approval.trim() != "" && nameToCollection(sportID)) {
                approvalCount = nameToCollection(sportID).find({
                    "gender": gender,
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    "clubNameId": filterID,
                    $or: [{
                        "associationId": associationId
                    }, {
                        "parentAssociationId": associationId
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
                })
            }
        } else if (filterBy == "Region") {
            if (gender.trim() == "" && approval.trim() == "" && nameToCollection(sportID)) {
                approvalCount = nameToCollection(sportID).find({
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    "interestedDomainName": {
                        $in: [filterID]
                    },
                    $or: [{
                        "associationId": associationId
                    }, {
                        "parentAssociationId": associationId
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
                    }]
                });
            } else if (gender.trim() != "" && approval.trim() == "" && nameToCollection(sportID)) {
                approvalCount = nameToCollection(sportID).find({
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    "gender": gender,
                    "interestedDomainName": {
                        $in: [filterID]
                    },
                    $or: [{
                        "associationId": associationId
                    }, {
                        "parentAssociationId": associationId
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
                    }]
                });
            } else if (gender.trim() == "" && approval.trim() != "" && nameToCollection(sportID)) {
                approvalCount = nameToCollection(sportID).find({
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    "interestedDomainName": {
                        $in: [filterID]
                    },
                    $or: [{
                        "associationId": associationId
                    }, {
                        "parentAssociationId": associationId
                    }],
                    $and: [{
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
                                    $nin: [null, "", "other"]
                                }
                            }, {
                                "statusOfUser": "notApproved"
                            }]
                        }]
                    }],
                })
            } else if (gender.trim() != "" && approval.trim() != "" && nameToCollection(sportID)) {
                approvalCount = nameToCollection(sportID).find({
                    "gender": gender,
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    "interestedDomainName": {
                        $in: [filterID]
                    },
                    $or: [{
                        "associationId": associationId
                    }, {
                        "parentAssociationId": associationId
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
                                    $nin: [null, "", "other"]
                                }
                            }, {
                                "statusOfUser": "notApproved"
                            }]
                        }]
                    }],
                })  
            }
        }
        return approvalCount.fetch().length;
    },

    "getApprovalCountOnSelectionSearch": function(sportID, filterBy, filterID, gender, approval, associationId, value) {
        var approvalCount = "";
        var reObj = new RegExp(value, 'i');

        if (filterBy == "Association") {
            if (gender.trim() == "" && approval.trim() == "" && nameToCollection(sportID)) {
                approvalCount = nameToCollection(sportID).find({
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    "userName": {
                        $regex: reObj
                    },
                    $or: [{
                        "associationId": associationId
                    }, {
                        "parentAssociationId": associationId
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
                    }]
                });
            } else if (gender.trim() != "" && approval.trim() == "" && nameToCollection(sportID)) {
                approvalCount = nameToCollection(sportID).find({
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    "gender": gender,
                    "userName": {
                        $regex: reObj
                    },
                    $or: [{
                        "associationId": associationId
                    }, {
                        "parentAssociationId": associationId
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
                    }]
                });
            } else if (gender.trim() == "" && approval.trim() != "" && nameToCollection(sportID)) {
                approvalCount = nameToCollection(sportID).find({
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    "userName": {
                        $regex: reObj
                    },
                    $or: [{
                        "associationId": associationId
                    }, {
                        "parentAssociationId": associationId,
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
                })
            } else if (gender.trim() != "" && approval.trim() != "" && nameToCollection(sportID)) {
                approvalCount = nameToCollection(sportID).find({
                    "gender": gender,
                    "userName": {
                        $regex: reObj
                    },
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    $or: [{
                        "associationId": associationId
                    }, {
                        "parentAssociationId": associationId,
                    }],
                    $and: [{
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
                                    $nin: [null, "", "other"]
                                }
                            }, {
                                "statusOfUser": "notApproved"
                            }]
                        }]
                    }],
                })
            }
        } else if (filterBy == "Institution/Academy") {
            if (gender.trim() == "" && approval.trim() == "" && nameToCollection(sportID)) {
                approvalCount = nameToCollection(sportID).find({
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    "userName": {
                        $regex: reObj
                    },
                    "clubNameId": filterID,
                    $or: [{
                        "associationId": associationId
                    }, {
                        "parentAssociationId": associationId
                    }],
                    $and: [{
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
                                    $nin: [null, "", "other"]
                                }
                            }, {
                                "statusOfUser": "notApproved"
                            }]
                        }]
                    }]
                })
            } else if (gender.trim() != "" && approval.trim() == "" && nameToCollection(sportID)) {
                approvalCount = nameToCollection(sportID).find({
                    "gender": gender,
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    "userName": {
                        $regex: reObj
                    },
                    "clubNameId": filterID,
                    $or: [{
                        "associationId": associationId
                    }, {
                        "parentAssociationId": associationId
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
                    }]
                })
            } else if (gender.trim() == "" && approval.trim() != "" && nameToCollection(sportID)) {
                approvalCount = nameToCollection(sportID).find({
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    "userName": {
                        $regex: reObj
                    },
                    "clubNameId": filterID,
                    $or: [{
                        "associationId": associationId
                    }, {
                        "parentAssociationId": associationId
                    }],
                    $and: [{
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
                                    $nin: [null, "", "other"]
                                }
                            }, {
                                "statusOfUser": "notApproved"
                            }]
                        }]
                    }],
                })
            } else if (gender.trim() != "" && approval.trim() != "" && nameToCollection(sportID)) {

                approvalCount = nameToCollection(sportID).find({
                    "gender": gender,
                    "clubNameId": filterID,
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    "userName": {
                        $regex: reObj
                    },
                    $or: [{
                        "associationId": associationId
                    }, {
                        "parentAssociationId": associationId
                    }],
                    $and: [{
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
                                    $nin: [null, "", "other"]
                                }
                            }, {
                                "statusOfUser": "notApproved"
                            }]
                        }]
                    }],
                })
            }
        } else if (filterBy == "Region") {
            if (gender.trim() == "" && approval.trim() == "" && nameToCollection(sportID)) {
                approvalCount = nameToCollection(sportID).find({
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    "userName": {
                        $regex: reObj
                    },
                    "interestedDomainName": {
                        $in: [filterID]
                    },
                    $or: [{
                        "associationId": associationId
                    }, {
                        "parentAssociationId": associationId
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
                    }]
                });
            } else if (gender.trim() != "" && approval.trim() == "" && nameToCollection(sportID)) {
                approvalCount = nameToCollection(sportID).find({
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    "gender": gender,
                    "userName": {
                        $regex: reObj
                    },
                    "interestedDomainName": {
                        $in: [filterID]
                    },
                    $or: [{
                        "associationId": associationId
                    }, {
                        "parentAssociationId": associationId
                    }],
                    $and: [{
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
                                    $nin: [null, "", "other"]
                                }
                            }, {
                                "statusOfUser": "notApproved"
                            }]
                        }]
                    }]
                });
            } else if (gender.trim() == "" && approval.trim() != "" && nameToCollection(sportID)) {
                approvalCount = nameToCollection(sportID).find({
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    "userName": {
                        $regex: reObj
                    },
                    "interestedDomainName": {
                        $in: [filterID]
                    },
                    $or: [{
                        "associationId": associationId
                    }, {
                        "parentAssociationId": associationId
                    }],
                    $and: [{
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
                                    $nin: [null, "", "other"]
                                }
                            }, {
                                "statusOfUser": "notApproved"
                            }]
                        }]
                    }],
                })
            } else if (gender.trim() != "" && approval.trim() != "" && nameToCollection(sportID)) {
                approvalCount = nameToCollection(sportID).find({
                    "gender": gender,
                    "userName": {
                        $regex: reObj
                    },
                    "interestedProjectName": {
                        $in: [sportID]
                    },
                    "role": "Player",
                    "interestedDomainName": {
                        $in: [filterID]
                    },
                    $or: [{
                        "associationId": associationId
                    }, {
                        "parentAssociationId": associationId
                    }],
                    $and: [{
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
                                    $nin: [null, "", "other"]
                                }
                            }, {
                                "statusOfUser": "notApproved"
                            }]
                        }]
                    }],
                })
            }

        }
        return approvalCount.fetch().length;
        return approvalCount.fetch().length;
    },
    */
    
});

