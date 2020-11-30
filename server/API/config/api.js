import {Meteor} from 'meteor/meteor';
API = {
    authentication: function(apiKey) {
        try {
            var getUser = apiUsers.findOne({
                "apiKey": apiKey
            });
            if (getUser) {
                return getUser;
            } else {
                return false;
            }
        } catch (e) {}

    },

    connection: function(request) {
        try {
            if (request.method == "GET") 
            {
                apiKey = request.query.apiKey;
                validUser = API.authentication(apiKey);
                if (validUser) {

                    return {
                        apiUser: validUser.apiUser,
                        data: request.query
                    };
                } else {
                    return {
                        error: 401,
                        message: "Invalid GET API key."
                    };
                }
            } else if (request.method == "POST" || request.method == "PUT") {
                
                apiKey = request.body.apiKey;
                validUser = API.authentication(apiKey);

                if (validUser) {
                    var dataJson = {};
                    dataJson["apiUser"] = validUser.apiUser;
                    dataJson["data"] = request.body;
                    return dataJson;
                } else {
                    return {
                        error: 401,
                        message: "Invalid POST API key."
                    };
                }
            }
        } catch (e) {}
    },

    handleRequest: function(context, resource, method) {
        try {
            var connection = API.connection(context.request);
            if (!connection.error) {
                API.methods[resource][method](context, connection);
            } else {
                response(context, 401, connection);
            }
        } catch (e) {}
    },

    methods: {

        userLogin: {
            POST: function(context, connection) {
                            //
                            
                var userName = connection.data.userName;
                var userPassword = connection.data.userPassword;
                var typeOfLogin = "1"
                var loginRole = "Player"

                if (connection.data.emailOrPhone) {
                    typeOfLogin = connection.data.emailOrPhone;
                }
                if(connection.data.loginRole){
                    loginRole = connection.data.loginRole
                }

                try {
                    var userNamesBySport = Meteor.call("PuserValidation", userName, userPassword, typeOfLogin,loginRole);
                    if (userNamesBySport) {
                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },

        apiUserLogin: {
            POST: function(context, connection) {
                var userName = connection.data.userName;
                var userPassword = connection.data.userPassword;
                try {
                    var userNamesBySport = Meteor.call("PapiUserValidation", userName, userPassword);
                    if (userNamesBySport) {
                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },

        fetchProfileSettings: {
            POST: function(context, connection) {

                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    var userNamesBySport = Meteor.call("PfetchProfileSettings", caller, apiKey, connection.data.data);
                    if (userNamesBySport) {
                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },

        profileUpdateViaApp: {
            POST: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;

                    var userNamesBySport = Meteor.call("PprofileUpdateViaApp", caller, apiKey, connection.data.data);
                    if (userNamesBySport) {
                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },


        listOfPlayersBySport: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    var sport = "";
                    var sportID = "";
                    if(connection.data.sport)
                        sport = connection.data.sport;
                    if(connection.data.sportID)
                        sportID = connection.data.sportID;

                    //var sport = connection.data.sport;
                    //var sportID = connection.data.sportId;
                    var filterBy = connection.data.filterBy;
                    var filterData = connection.data.filterData;



                    var userNamesBySport = Meteor.call("PgetPlayerList", caller, apiKey, filterBy, filterData, "");
                    if (userNamesBySport) {
                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },

        rankFilters: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    var userId = connection.data.userId;
                    var userNamesBySport = Meteor.call("PrankFilters", caller, apiKey, userId);

                    if (userNamesBySport) {
                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },

        listOfPlayersRank: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    var sportID = connection.data.sportId;
                    var eventName = connection.data.eventName;
                    var filterData = connection.data.filterData;

                    var userNamesBySport = Meteor.call("PgetRankList", caller, apiKey, sportID, eventName, filterData);
                    if (userNamesBySport.length > 0) {

                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },

        playerInfo: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    var playerID = connection.data.playerId;
                    var userNamesBySport = Meteor.call("PgetPlayerInfo", caller, apiKey, playerID);
                    if (userNamesBySport) {

                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }

            }
        },



        listOfPlayersByAssociation: {
            GET: function(context, connection) {
                try {
                    var availableName = associations.find({
                        associationName: connection.data.association
                    }).fetch();
                    var hasQuery = Object.keys(connection.data).length > 0 ? true : false;
                    if (hasQuery && (availableName.length != 0)) {
                        var userNamesByAssociation = [];
                        var associationId = associations.findOne({
                            associationName: connection.data.association
                        }, {
                            associationId: 1
                        });
                        var getListOfPlayers = Meteor.users.find({
                            associationId: associationId.associationId
                        }, {
                            userName: 1
                        }).fetch();
                        for (var i = 0; i < getListOfPlayers.length; i++) {
                            userNamesByAssociation.push(getListOfPlayers[i].userName);
                        }
                        if (getListOfPlayers.length > 0) {
                            response(context, 200, userNamesByAssociation);
                        } else {
                            response(context, 404, {
                                error: 404,
                                message: "No users found."
                            });
                        }

                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "Invalid data."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },

        listOfPlayersByGender: {
            GET: function(context, connection) {
                try {
                    var availableName = Meteor.users.find({
                        gender: connection.data.gender
                    }).fetch();
                    var hasQuery = Object.keys(connection.data).length > 0 ? true : false;
                    if (hasQuery && (availableName.length != 0)) {
                        var userNamesByGender = [];
                        var getListOfPlayers = Meteor.users.find({
                            gender: connection.data.gender
                        }, {
                            userName: 1
                        }).fetch();
                        for (var i = 0; i < getListOfPlayers.length; i++) {
                            userNamesByGender.push(getListOfPlayers[i].userName);
                        }
                        if (getListOfPlayers.length > 0) {
                            response(context, 200, userNamesByGender);
                        } else {
                            response(context, 404, {
                                error: 404,
                                message: "No users found."
                            });
                        }

                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "Invalid data."
                        });
                    }
                } catch (e) {}
            }
        },

        listOfEntries: {
            GET: function(context, connection) {
                try {

                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    var tournamentId = connection.data.tournamentId;
                    var eventId = connection.data.eventId;

                    try {
                        Meteor.call("PgetEntriesList", caller, apiKey, tournamentId, eventId, function(e, r) {
                            if (r) {
                                if (r.length > 0)
                                    response(context, 200, r);
                                else
                                    response(context, 200, r);
                            } else {
                                response(context, 404, {
                                    error: 404,
                                    message: "Invalid data."
                                });
                            }

                        });

                    } catch (e) {
                        response(context, 404, {
                            error: 404,
                            message: "Invalid data."
                        });
                    }
                } catch (e) {}
            }
        },

        //@Author vinayashree
        listOfUpcomingEvents: {
            GET: function(context, connection) {
                try {
                    //Meteor.call("resultSummaryInHaul","GG6qt6B6GacPD4z2R","Davis Cup");
                    var hasQuery = Object.keys(connection.data).length > 0 ? true : false;
                    if (hasQuery) {
                        Meteor.call("getUpcomingEvents", connection.data.caller, connection.data.apiKey, connection.data.userId, function(e, r) {

                            if (r) {
                                if (r.length != 0)
                                    response(context, 200, r);
                                else
                                    response(context, 200, {
                                        message: "No upcoming events"
                                    });
                            } else {
                                response(context, 404, {
                                    error: 404,
                                    message: "Invalid data."
                                });
                            }
                        });
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "Invalid data."
                        });
                    }
                } catch (e) {}
            }
        },

        listOfUpcomingEventsBasedOnRole: {
            GET: function(context, connection) {
                try {
                    var hasQuery = Object.keys(connection.data).length > 0 ? true : false;
                    if (hasQuery) {
                        Meteor.call("upcominEventsForAllRoles", connection.data.userId, function(e, r) {
                            if (r && r.length != 0) {
                                response(context, 200, r);
                            } else if (r.length == 0) {
                                response(context, 200, r);
                            } else {
                                response(context, 404, {
                                    error: 404,
                                    message: "Invalid data."
                                });
                            }
                        });
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "Invalid data."
                        });
                    }
                } catch (e) {}
            }
        },

        //@Author vinayashree
        listOfEventsUnderTourn: {
            GET: function(context, connection) {
                try {
                    var hasQuery = Object.keys(connection.data).length > 0 ? true : false;
                    if (hasQuery) {
                        Meteor.call("getListOfEventsUnderTourn", connection.data.caller, connection.data.apiKey, connection.data.tournamentId, connection.data.userId, function(e, r) {
                            if (r) {
                                if (r && r.length != 0) {
                                    response(context, 200, r);
                                } else if (r.length == 0) {
                                    response(context, 200, "No events under tournament");
                                }
                            } else {
                                response(context, 404, {
                                    error: 404,
                                    message: "Invalid data."
                                });
                            }
                        });
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "Invalid data."
                        });
                    }
                } catch (e) {}
            }
        },

        //@Author vinayashree
        //required apiKey,caller,userId, tournamentId,array of event ids to subscribe(eventIDs)
        //key format userId, tournamentId, eventIDs
        //POST data
        eventSubscribe123: {
            POST: function(context, connection) {
                try {
            var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var userDet = Meteor.users.findOne({
                            "_id": connection.data.userId,
                            "role": "Player"
                        })
                        if (userDet) {
                            var findAssocPer = events.findOne({
                                "_id": connection.data.tournamentId
                            });
                            if (findAssocPer.eventOrganizer) {
                                var eventOrganizerDet = Meteor.users.findOne({
                                    "_id": findAssocPer.eventOrganizer,
                                })
                                if (eventOrganizerDet && eventOrganizerDet.role == "Association" && eventOrganizerDet.associationType == "State/Province/County") {
                                    var findPermissionsToSub = associationPermissions.findOne({
                                        "associationId": findAssocPer.eventOrganizer
                                    })
                                    if (findPermissionsToSub) {
                                        if (userDet.associationId == "other" || userDet.associationId == null || userDet.associationId == undefined) {
                                            if (findPermissionsToSub.playerEntry == "other" || findPermissionsToSub.playerEntry == "yes") {
                                                Meteor.call("eventSubLastUnderTournHelper", connection.data.tournamentId, function(e, r) {
                                                    if (r) {
                                                        Meteor.call("eventSubscribe", connection.data, function(e, r) {
                                                            if (r) {
                                                                response(context, 200, {
                                                                    message: "subscription success"
                                                                });
                                                            } else if (e) {
                                                                throw e
                                                            }
                                                        });
                                                    } else {
                                                        response(context, 200, {
                                                            message: "error subscription, crossed subscription last date."
                                                        });
                                                    }
                                                });

                                            } else {
                                                response(context, 200, {
                                                    message: "you are not permitted,please contact your association."
                                                });
                                            }
                                        } else {
                                            if (findPermissionsToSub.playerEntry == "yes") {
                                                Meteor.call("eventSubLastUnderTournHelper", connection.data.tournamentId, function(e, r) {
                                                    if (r) {
                                                        Meteor.call("eventSubscribe", connection.data, function(e, r) {
                                                            if (r) {
                                                                response(context, 200, {
                                                                    message: "subscription success"
                                                                });
                                                            } else if (e) {
                                                                throw e
                                                            }
                                                        });
                                                    } else {
                                                        response(context, 200, {
                                                            message: "error subscription, crossed subscription last date."
                                                        });
                                                    }
                                                });
                                            } else if (findPermissionsToSub.playerEntry == "no") {
                                                response(context, 200, {
                                                    message: "you are not permitted,please contact your association."
                                                });
                                            }
                                        }
                                    } else {
                                        response(context, 200, {
                                            message: "you are not permitted,please contact your association."
                                        });
                                    }
                                } else if (eventOrganizerDet && eventOrganizerDet.associationType == undefined) {
                                    Meteor.call("eventSubscribe", connection.data, function(e, r) {
                                        if (r) {
                                            response(context, 200, {
                                                message: "subscription success"
                                            });
                                        } else if (e) {
                                            throw e
                                        }
                                    });
                                }
                            }
                        } else {
                            response(context, 200, {
                                message: "player not found."
                            });
                        }
                    }

                } catch (e) {}
            }
        },

        //@Author vinayashree
        //required apiKey,caller,userId, tournamentId,array of event ids to subscribe(eventIDs)
        //key format userId, tournamentId, eventIDs
        //POST data
        eventUnSubscribe123: {
            POST: function(context, connection) {
                try {
            var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var userDet = Meteor.users.findOne({
                            "_id": connection.data.userId.trim(),
                            "role": "Player"
                        })
                        if (userDet) {
                            var findAssocPer = events.findOne({
                                "_id": connection.data.tournamentId
                            });
                            if (findAssocPer.eventOrganizer) {
                                var eventOrganizerDet = Meteor.users.findOne({
                                    "_id": findAssocPer.eventOrganizer,
                                })
                                if (eventOrganizerDet && eventOrganizerDet.role == "Association" && eventOrganizerDet.associationType == "State/Province/County") {
                                    var findPermissionsToSub = associationPermissions.findOne({
                                        "associationId": findAssocPer.eventOrganizer
                                    })
                                    if (findPermissionsToSub) {
                                        if (userDet.associationId == "other" || userDet.associationId == null || userDet.associationId == undefined) {
                                            if (findPermissionsToSub.playerEntry == "other" || findPermissionsToSub.playerEntry == "yes") {
                                                Meteor.call("eventSubLastUnderTournHelper", connection.data.tournamentId, function(e, r) {
                                                    if (r) {
                                                        Meteor.call("eventUnSubscribe", connection.data, function(e, r) {
                                                            if (r) {
                                                                response(context, 200, {
                                                                    message: "unsubscription success"
                                                                });
                                                            } else if (e) {
                                                                throw e
                                                            }
                                                        });
                                                    } else {
                                                        response(context, 200, {
                                                            message: "error unsubscription, crossed subscription last date."
                                                        });
                                                    }
                                                });
                                            } else {
                                                response(context, 200, {
                                                    message: "you are not permitted,please contact your association."
                                                });
                                            }
                                        } else {
                                            if (findPermissionsToSub.playerEntry == "yes") {
                                                Meteor.call("eventSubLastUnderTournHelper", connection.data.tournamentId, function(e, r) {
                                                    if (r) {
                                                        Meteor.call("eventUnSubscribe", connection.data, function(e, r) {
                                                            if (r) {
                                                                response(context, 200, {
                                                                    message: "unsubscription success"
                                                                });
                                                            } else if (e) {
                                                                throw e
                                                            }
                                                        });
                                                    } else {
                                                        response(context, 200, {
                                                            message: "error unsubscription, crossed subscription last date."
                                                        });
                                                    }
                                                });
                                            } else if (findPermissionsToSub.playerEntry == "no") {
                                                response(context, 200, {
                                                    message: "you are not permitted,please contact your association."
                                                });
                                            }
                                        }
                                    } else {
                                        response(context, 200, {
                                            message: "you are not permitted,please contact your association."
                                        });
                                    }
                                } else if (eventOrganizerDet && eventOrganizerDet.associationType == undefined) {
                                    Meteor.call("eventUnSubscribe", connection.data, function(e, r) {
                                        if (r) {
                                            response(context, 200, {
                                                message: "unsubscription success"
                                            });
                                        } else if (e) {
                                            throw e
                                        }
                                    });
                                }
                            }
                        } else {
                            response(context, 200, {
                                message: "player not found."
                            });
                        }
                    }
                } catch (e) {}
            }
        },

        //@Author vinayashree
        myEntriesAPI: {
            GET: function(context, connection) {
                try {
                    var hasQuery = Object.keys(connection.data).length > 0 ? true : false;
                    if (hasQuery) {
                        Meteor.call("myEntriesAPI", connection.data.caller, connection.data.apiKey, connection.data.userId, function(e, r) {
                            if (r) {
                                response(context, 200, r);
                            } else {
                                response(context, 404, {
                                    message: "Invalid data."
                                });
                            }
                        })
                    }
                } catch (e) {}
            }
        },

        listOfPastTournaments: {
            GET: function(context, connection) {
                try {
                    var hasQuery = Object.keys(connection.data).length > 0 ? true : false;
                    if (hasQuery) {
                        Meteor.call("getPastTournaments", connection.data.caller, connection.data.apiKey, connection.data.userId, function(e, r) {
                            if (r) {
                                if (r.length != 0)
                                    response(context, 200, r);
                                else if (r.length == 0)
                                    response(context, 200, r);

                            } else {
                                response(context, 404, {
                                    error: 404,
                                    message: "Invalid data."
                                });
                            }
                        });
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "Invalid data."
                        });
                    }
                } catch (e) {}
            }
        },

        listOfEventsUnderPastTourn: {
            GET: function(context, connection) {
                try {
                    var hasQuery = Object.keys(connection.data).length > 0 ? true : false;
                    if (hasQuery) {
                        Meteor.call("getListOfEventsUnderPastTourn", connection.data.caller, connection.data.apiKey, connection.data.tournamentId, connection.data.userId, function(e, r) {
                            if (r) {
                                if (r.length != 0) {
                                    response(context, 200, r);
                                } else if (r.length == 0) {
                                    response(context, 200, "No events under tournament");
                                }
                            } else {
                                response(context, 404, {
                                    error: 404,
                                    message: "Invalid data."
                                });
                            }
                        });
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "Invalid data."
                        });
                    }
                } catch (e) {}
            }
        },

        listOfPastEntries: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    var tournamentId = connection.data.tournamentId;
                    var eventId = connection.data.eventId;
                    var userNamesBySport = Meteor.call("PgetPastEntriesList", caller, apiKey, tournamentId, eventId);
                    if (userNamesBySport.length > 0) {
                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },


        listOfAcademiesUnderAssoc: {
            GET: function(context, connection) {
                try {
                    var hasQuery = Object.keys(connection.data).length > 0 ? true : false;
                    if (hasQuery) {
                        Meteor.call("getAcademyUnderAssociation", connection.data.caller, connection.data.apiKey, connection.data.userId, connection.data.associationId, function(e, r) {
                            if (r && r.length != 0) {
                                response(context, 200, r);
                            } else if (r.length == 0) {
                                response(context, 200, "Empty academies");
                            } else {
                                response(context, 404, {
                                    error: 404,
                                    message: "Invalid data."
                                });
                            }
                        });
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "Invalid data."
                        });
                    }
                } catch (e) {}
            }
        },

        getStrokesData: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    var userId = connection.data.userId;

                    Meteor.call("PanalyticsAccess", caller, apiKey, userId, function(error, result) {
                        if (result == true) {
                            var userNamesBySport = Meteor.call("PgetStrokesData", caller, apiKey, userId);
                            if (userNamesBySport) {
                                response(context, 200, userNamesBySport);
                            } else {
                                response(context, 404, {
                                    error: 404,
                                    message: "No users found."
                                });
                            }
                        } else {
                            response(context, 200, {
                                message: "Access forbidden"
                            });
                        }
                    });
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },



        getResultsFilters: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    var userId = connection.data.userId;
                    //var res = Meteor.call("getResultsFilters");
                    var userNamesBySport = Meteor.call("PgetResultsFilters", caller, apiKey, userId);
                    if (userNamesBySport) {
                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        getResults: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    var userId = connection.data.userId;
                    var tournamentId = connection.data.tournamentId;
                    var eventName = connection.data.eventName;
                    //var res = Meteor.call("getResultsFilters");
                    var userNamesBySport = Meteor.call("PgetResults", caller, apiKey, userId, tournamentId, eventName);
                    if (userNamesBySport) {
                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        otpForgotPassword: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    var userId = connection.data.userId;
                    var emailIdOrPhone = "1"
                    var loginRole = "Player"

                    if (connection.data.emailIdOrPhone) {
                        emailIdOrPhone = connection.data.emailIdOrPhone
                    }
                    if(connection.data.loginRole){
                        loginRole = connection.data.loginRole
                    }

                    Meteor.call("PotpForgotPassword", caller, apiKey, userId, connection.data.emailId, emailIdOrPhone,loginRole, function(e, r) {
                        if (r) {
                            response(context, 200, r);
                        } else {
                            response(context, 404, {
                                error: 404,
                                message: "Invalid data."
                            });
                        }
                    });

                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },

        playerRegisterViaApp: {
            POST: function(context, connection) {
                try {

            var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PplayerRegisterViaApp", caller, apiKey, connection.data, function(e, r) {
                            if(r && r.status && r.status == "failure"){
                                response(context, 200, {
                                    message:r.response
                                });
                            }
                            else if (r) {
                                response(context, 200, {
                                    message: "Registered"
                                });
                            } else {
                                response(context, 404, {
                                    error: 404,
                                    message: "Invalid data."
                                });
                            }
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },

        registerOtpCheck: {
            POST: function(context, connection) {
                try {
            var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        /*Meteor.call("PregisterOtpCheck",caller,apiKey,connection.data.data,function(e,r){ 
                          if(e)
                          {
                            response(context, 200, {status:"failure",message: "Invalid data"});              
                          } 
                          else
                          {          
                            response(context, 200,r);                                     
                          }           
                          
                        }); */

                        if (connection.data.data) {
                            var data = connection.data.data
                            if (typeof data == "string") {
                                data = data.replace("\\", "");
                                data = JSON.parse(data);
                            }
                           

                            var data = {
                                emailId: data.mailId
                            }

                            Meteor.call("PRegisterOtpGeneralized", "registerOtpCheck",caller, apiKey, data, function(e, r) {
                                if (e) {
                                    response(context, 200, {
                                        status: "failure",
                                        message: "Invalid data"
                                    });
                                } else {
                                    response(context, 200, r);
                                }
                            })
                        }
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data"
                    });
                }
            }
        },

        registerOtp: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    /* Meteor.call("PregisterOtp",caller,apiKey,userId,connection.data.emailId,function(e,r){              
                       if(r){
                           response(context, 200, r);
                         }               
                       else{
                           response(context, 404, {error: 404,message: "Invalid data."});
                         }
                     });       */
                    if (connection.data.emailId) {

                        var data = {
                            emailId: connection.data.emailId
                        }

                        Meteor.call("PRegisterOtpGeneralized","registerOtp", caller, apiKey, data, function(e, r) {
                            if (e) {
                                response(context, 404, {
                                    error: 404,
                                    message: "Invalid data."
                                });
                            } else {
                                response(context, 200, r);
                            }
                        })
                    }

                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },

        registerOtpWithOptions: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    

                    if (connection.data) {
                        Meteor.call("PRegisterOtpGeneralized","registerOtpWithOptions",caller, apiKey, connection.data, function(e, r) {
                            if (e) {
                                response(context, 404, {
                                    error: 404,
                                    message: "Invalid data."
                                });
                            } else {
                                response(context, 200, r);
                            }
                        })
                    }

                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },

        setNewPassword: {
            POST: function(context, connection) {
                try {
            var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PsetNewPassword", caller, apiKey, connection.data, function(e, r) {

                            if (e) {
                                response(context, 200, {
                                    status: "failure",
                                    message: "Invalid data"
                                });
                            } else {
                                if (r == true)
                                    response(context, 200, {
                                        status: "success",
                                        message: "Password Set"
                                    });
                                else if (r == false) {
                                    response(context, 200, {
                                        status: "failure",
                                        message: "Invalid data"
                                    });

                                }
                            }

                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data"
                    });
                }
            }
        },

        recordPlayerSequence: {
            POST: function(context, connection) {
                try {
            var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var userDet = Meteor.users.findOne({
                            "_id": connection.data.userId,
                            "role": "Player"
                        })
                        if (userDet) {
                            var caller = connection.data.caller;
                            var apiKey = connection.data.apiKey;
                            var userId = connection.data.userId;
                            Meteor.call("PrecordPlayerSequence", caller, apiKey, userId, connection.data.playerSequence, function(e, r) {
                                if (r) {
                                    response(context, 200, "sequence recorded");
                                } else if (e) {
                                    throw e
                                }
                            });
                        } else {
                            response(context, 200, {
                                message: "player not found."
                            });
                        }
                    }
                } catch (e) {}
            }
        },

        fetchSummarizedSequence: {
            GET: function(context, connection) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var userId = connection.data.userId;
                var userName = connection.data.userName;
                try {
                    var userNamesBySport = Meteor.call("PfetchSummarizedSequence", caller, apiKey, userId, connection.data);
                    if (userNamesBySport) {

                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        fetchSummarizedServiceSequence: {
            GET: function(context, connection) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var userId = connection.data.userId;
                var userName = connection.data.userName;
                try {
                    var userNamesBySport = Meteor.call("PfetchServicePoints", caller, apiKey, userId, connection.data);
                    if (userNamesBySport) {

                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        fetchSummarizedServiceLossSequence: {
            GET: function(context, connection) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var userId = connection.data.userId;
                var userName = connection.data.userName;
                try {
                    var userNamesBySport = Meteor.call("PfetchServiceLoss", caller, apiKey, userId, connection.data);
                    if (userNamesBySport) {

                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        fetchSummarizedServiceFaultSequence: {
            GET: function(context, connection) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var userId = connection.data.userId;
                var userName = connection.data.userName;
                try {
                    var userNamesBySport = Meteor.call("PfetchServiceFault", caller, apiKey, userId, connection.data);
                    if (userNamesBySport) {

                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        fetchSummarizedReceiverSequence: {
            GET: function(context, connection) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var userId = connection.data.userId;
                var userName = connection.data.userName;
                try {
                    var userNamesBySport = Meteor.call("PfetchReceiverPoints", caller, apiKey, userId, connection.data);
                    if (userNamesBySport) {

                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        fetchRallyAnalysis: {
            GET: function(context, connection) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var userId = connection.data.userId;
                var userName = connection.data.userName;
                try {
                    var userNamesBySport = Meteor.call("PfetchRallyAnalysis", caller, apiKey, userId, connection.data);
                    if (userNamesBySport) {

                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        fetchStrokeAnalysis: {
            GET: function(context, connection) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var userId = connection.data.userId;
                var userName = connection.data.userName;
                try {
                    var userNamesBySport = Meteor.call("PfetchStrokeAnalysis", caller, apiKey, userId, connection.data);
                    if (userNamesBySport) {

                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        fetchErrorAnalysis: {
            GET: function(context, connection) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var userId = connection.data.userId;
                var userName = connection.data.userName;
                try {
                    var userNamesBySport = Meteor.call("PfetchErrorAnalysis", caller, apiKey, userId, connection.data);
                    if (userNamesBySport) {

                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        fetchServiceResponseAnalysis: {
            GET: function(context, connection) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var userId = connection.data.userId;
                var userName = connection.data.userName;
                try {
                    var userNamesBySport = Meteor.call("PfetchServiceResponseAnalysis", caller, apiKey, userId, connection.data);
                    if (userNamesBySport) {

                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },

        fetch3BallAttack: {
            GET: function(context, connection) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var userId = connection.data.userId;
                var userName = connection.data.userName;
                try {
                    var userNamesBySport = Meteor.call("Pfetch3BallAttack", caller, apiKey, userId, connection.data);
                    if (userNamesBySport) {

                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        fetch4BallShot: {
            GET: function(context, connection) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var userId = connection.data.userId;
                var userName = connection.data.userName;
                try {
                    var userNamesBySport = Meteor.call("Pfetch4BallShot", caller, apiKey, userId, connection.data);
                    if (userNamesBySport) {

                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        viewSequence: {
            GET: function(context, connection) {

                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var userId = connection.data.userId;
                try {
                    var userNamesBySport = Meteor.call("PviewSequence", caller, apiKey, userId, connection.data);
                    if (userNamesBySport) {

                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        getSchoolPlayerDetails: {
            GET: function(context, connection) {

                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var userId = connection.data.userId;
                try {
                    var userNamesBySport = Meteor.call("PgetPlayerDetails", caller, apiKey, connection.data.data, connection.data);
                    if (userNamesBySport) {
                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 200, {
                            message: "No user found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        deleteSequence: {
            POST: function(context, connection) {
                try {
            var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var userDet = Meteor.users.findOne({
                            "_id": connection.data.userId,
                            "role": "Player"
                        })
                        if (userDet) {
                            var caller = connection.data.caller;
                            var apiKey = connection.data.apiKey;
                            var userId = connection.data.userId;
                            Meteor.call("PdeleteSequence", caller, apiKey, userId, connection.data, function(e, r) {
                                if (r) {
                                    response(context, 200, r);
                                } else if (e) {
                                    throw e
                                }
                            });
                        } else {
                            response(context, 200, {
                                message: "player not found."
                            });
                        }
                    }
                } catch (e) {}
            }
        },
        shareSequence: {
            POST: function(context, connection) {
                try {
            var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        var data = connection.data.data;
                        Meteor.call("PshareSequence", caller, apiKey, data, function(e, r) {
                            if (r) {
                                response(context, 200, {
                                    message: "sequence shared"
                                });
                            } else if (e) {
                                throw e
                            }
                        });
                    }
                } catch (e) {}
            }
        },
        getShareHistory: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    var userId = connection.data.userId;
                    var userNamesBySport = Meteor.call("PgetShareHistory", caller, apiKey, userId);
                    if (userNamesBySport) {
                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        getPlayerSetData: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    var userId = connection.data.userId;
                    var userNamesBySport = Meteor.call("PgetPlayerSetData", caller, apiKey, userId);
                    if (userNamesBySport) {
                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        getVsPlayerList: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    var userId = connection.data.userId;
                    var userNamesBySport = Meteor.call("PgetVsPlayerList", caller, apiKey, userId, connection.data.loggerSeqId);
                    if (userNamesBySport) {
                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        recordPlayerProfile: {
            POST: function(context, connection) {
                try {
            var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var userDet = Meteor.users.findOne({
                            "_id": connection.data.userId,
                            "role": "Player"
                        })
                        if (userDet) {
                            var caller = connection.data.caller;
                            var apiKey = connection.data.apiKey;
                            var userId = connection.data.userId;
                            Meteor.call("PrecordPlayerProfile", caller, apiKey, userId, connection.data.playerProfile, function(e, r) {
                                if (r) {
                                    response(context, 200, "profile recorded");
                                } else if (e) {
                                    throw e
                                }
                            });
                        } else {
                            response(context, 200, {
                                message: "player not found."
                            });
                        }
                    }
                } catch (e) {}
            }
        },
        fetchPlayerProfile: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    var userId = connection.data.userId;
                    var player1Name = connection.data.player1Name;
                    var player2Name = connection.data.player2Name;
                    var player1Id = connection.data.player1Id;
                    var player2Id = connection.data.player2Id;
                    var userNamesBySport = Meteor.call("PfetchPlayerProfile", caller, apiKey, userId, player1Name, player2Name, player1Id, player2Id);
                    if (userNamesBySport) {
                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        getPlayerSetPoints: {
            GET: function(context, connection) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var userId = connection.data.userId;
                try {
                    var userNamesBySport = Meteor.call("PgetPlayerSetPoints", caller, apiKey, userId, connection.data);
                    if (userNamesBySport) {
                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        downloadAnalytics: {
            GET: function(context, connection) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var userId = connection.data.userId;
                var userName = connection.data.userName;
                try {
                    var userNamesBySport = Meteor.call("PdownloadAnalytics", caller, apiKey, userId, connection.data);
                    if (userNamesBySport) {

                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },

        /******* school related *********/

        registerEntity: {
            POST: function(context, connection) {
                try {
            var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PregisterEntity", caller, apiKey, connection.data.data, function(e, result) {
                            if (result) {
                                response(context, 200, result);
                            } else if (e) {
                                throw e
                            }
                        });
                    }
                } catch (e) {}
            }
        },

        registerIndividual: {
            POST: function(context, connection) {
                try {
            var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PregisterIndividual", caller, apiKey, connection.data.data, function(e, result) {
                            if (result) {
                                response(context, 200, result);
                            } else if (e) {
                                throw e
                            }
                        });
                    }
                } catch (e) {}
            }
        },

        viewProfileIndividual: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;

                    Meteor.call("PviewProfileIndividual", caller, apiKey, connection.data.data, function(error, result) {
                        if (result)
                            response(context, 200, result);
                        else
                            response(context, 200, "No user found")

                    });
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },


        updateProfile: {
            POST: function(context, connection) {
                try {
            var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PupdateProfile", caller, apiKey, connection.data.data, function(e, result) {
                            if (result) {
                                response(context, 200, result);
                            } else if (e) {
                                throw e
                            }
                        });
                    }
                } catch (e) {}
            }
        },

        editSchool: {
            POST: function(context, connection) {
                try {
            var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PeditSchool", caller, apiKey, connection.data.data, function(e, result) {
                            if (result) {
                                response(context, 200, result);
                            } else if (e) {
                                throw e
                            }
                        });
                    }
                } catch (e) {}
            }
        },


        getSchoolCreationDetails: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    var userId = connection.data.userId;
                    var userNamesBySport = Meteor.call("PschoolDetails", caller, apiKey, userId);
                    if (userNamesBySport) {
                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        addSchoolPlayer: {
            POST: function(context, connection) {
                try {
            var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PaddSchoolPlayer", caller, apiKey, connection.data.data, function(e, result) {
                            if (result) {
                                response(context, 200, result);
                            } else if (e) {
                                throw e
                            }
                        });
                    }
                } catch (e) {}
            }
        },

        editSchoolPlayer: {
            POST: function(context, connection) {
                try {
            var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PeditSchoolPlayer", caller, apiKey, connection.data.data, function(e, result) {
                            if (result) {
                                response(context, 200, result);
                            } else if (e) {
                                throw e
                            }
                        });
                    }
                } catch (e) {}
            }
        },

        fetchSchoolPlayerDetails: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    Meteor.call("PfetchSchoolPlayerDetails", caller, apiKey, connection.data.data, function(error, result) {
                        if (result)
                            response(context, 200, result);
                        else
                            response(context, 404, {
                                error: 404,
                                message: "No users found."
                            });
                    });
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },

        deleteSchoolPlayer: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    Meteor.call("PdeleteSchoolPlayer", caller, apiKey, connection.data.data, function(error, result) {
                        if (result)
                            response(context, 200, result);
                        else
                            response(context, 404, {
                                error: 404,
                                message: "No users found."
                            });
                    });
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },

        getPlayerDetails: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    Meteor.call("PgetPlayerDetailsApp", caller, apiKey, connection.data.userId, connection.data, function(error, result) {
                        if (result)
                            response(context, 200, result);
                        else
                            response(context, 404, {
                                error: 404,
                                message: "No users found."
                            });
                    });
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        getTournamentIdForGivenType:{
            POST: function(context, connection) {
                try {
                    var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PgetTournamentIdForGivenType", caller, apiKey, connection.data.data, function(e, result) {
                            if (result) {
                                response(context, 200, result);
                            } else if (e) {
                                throw e
                            }
                        });
                    }
                } catch (e) {}
            }
        },
        getWinnersListFromFinals:{
            POST: function(context, connection) {
                try {
                    var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        var data = connection.data.data
                        Meteor.call("PgetWinnersListFromFinals", caller, apiKey,data,function(e, result) {
                            if (result) {
                                response(context, 200, result);
                            } else if (e) {
                                throw e
                            }
                        });
                    }
                } catch (e) {}
            }
        },
        getAllSchoolDetails:{
            POST: function(context, connection) {
                try {
                    var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PgetAllSchoolDetails", caller, apiKey,function(e, result) {
                            if (result) {
                                response(context, 200, result);
                            } else if (e) {
                                throw e
                            }
                        });
                    }
                } catch (e) {}
            }
        },
        getTournamentTypesAndState:{
            POST: function(context, connection) {
                try {
                    var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PgetTournamentTypesAndState", caller, apiKey,function(e, result) {
                            if (result) {
                                response(context, 200, result);
                            } else if (e) {
                                throw e
                            }
                        });
                    }
                } catch (e) {}
            }
        },
        subscribedEventList: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    Meteor.call("PsubscribedEventList", caller, apiKey, connection.data.data, function(error, result) {
                        if (result)
                            response(context, 200, result);
                        else
                            response(context, 404, {
                                error: 404,
                                message: "No users found."
                            });
                    });
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        eventWiseSubscribersDownload: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    var temp = [];
                    Meteor.call("PeventWiseSubscribersDownload", caller, apiKey, connection.data.eventId, connection.data.userId, function(error, result) {
                        if (error) {
                            response(context, 404, {
                                error: 404,
                                message: "Invalid data."
                            });
                        } else {
                            if (result)
                                response(context, 200, result);
                            else
                                response(context, 200, temp);
                        }

                    });
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        eventWiseSubscribersDownload_school: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    var temp = [];
                    Meteor.call("PeventWiseSubscribersDownload_School", caller, apiKey, connection.data.eventId, connection.data.userId, function(error, result) {
                        if (error) {
                            response(context, 404, {
                                error: 404,
                                message: "Invalid data."
                            });
                        } else {
                            if (result)
                                response(context, 200, result);
                            else
                                response(context, 200, temp);
                        }

                    });
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },


        pasteventWiseSubscribersDownload_school: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;

                    Meteor.call("PpasteventWiseSubscribersDownload_School", caller, apiKey, connection.data.eventId, connection.data.userId, function(error, result) {
                        if (result)
                            response(context, 200, result);
                        else
                            response(context, 404, {
                                error: 404,
                                message: "No users found."
                            });
                    });
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },


        pasteventWiseSubscribersDownload: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    Meteor.call("PpasteventWiseSubscribersDownload", caller, apiKey, connection.data.eventId, connection.data.userId, function(error, result) {
                        if (result)
                            response(context, 200, result);
                        else
                            response(context, 404, {
                                error: 404,
                                message: "No users found."
                            });
                    });
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },

        createTeamFormatFilters: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    var userId = connection.data.userId;

                    Meteor.call("PcreateTeamFormatFilters", caller, apiKey, userId, function(error, result) {
                        if (result)
                            response(context, 200, result);
                        else
                            response(context, 404, {
                                error: 404,
                                message: "No users found."
                            });
                    });
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },

        fetchPlayersOnTeamValidation: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    var userId = connection.data.userId;
                    var teamformatID = connection.data.teamformatID;


                    Meteor.call("PfetchPlayersOnTeamValidation", caller, apiKey, userId, teamformatID, function(error, result) {
                        if (result)
                            response(context, 200, result);
                        else
                            response(context, 404, {
                                error: 404,
                                message: "No users found."
                            });
                    });
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },

        myTeams: {
            GET: function(context, connection) {
                try {

                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    var userId = connection.data.userId;
                    Meteor.call("PmyTeams", caller, apiKey, userId, function(error, result) {
                        if (result)
                            response(context, 200, result);
                        else
                            response(context, 404, {
                                error: 404,
                                message: "No users found."
                            });
                    });
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        editTeamDetails: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    var teamId = connection.data.teamId;
                    var userId = connection.data.userId;
                    Meteor.call("PeditTeamDetails", caller, apiKey, userId, teamId, function(error, result) {
                        if (result)
                            response(context, 200, result);
                        else
                            response(context, 404, {
                                error: 404,
                                message: "No users found."
                            });
                    });
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }

        },
        viewPlayerTeam: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    Meteor.call("PviewPlayerTeam", caller, apiKey, connection.data.teamId, function(error, result) {
                        if (result)
                            response(context, 200, result);
                        else
                            response(context, 404, {
                                error: 404,
                                message: "No users found."
                            });
                    });
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }

        },
        organizerTournaments: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    var userId = connection.data.userId;
                    Meteor.call("PorganizerTournaments", caller, apiKey, userId, function(error, result) {
                        if (result)
                            response(context, 200, result);
                        else
                            response(context, 404, {
                                error: 404,
                                message: "No users found."
                            });
                    });
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }

        },


        genericMailTemplate: {
            POST: function(context, connection) {
                try {
            var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PgenericMailTemplate", caller, apiKey, connection.data.data, function(error, result) {
                            if (error) {
                                response(context, 404, {
                                    error: 404,
                                    message: "Invalid data."
                                });
                            } else {
                                if (result)
                                    response(context, 200, {
                                        message: "Mail Sent"
                                    });
                                else
                                    response(context, 200, {
                                        message: "Could not send mail"
                                    });
                            }
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },


        updateTeam: {
            POST: function(context, connection) {
                try {
            var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PupdateTeam", caller, apiKey, connection.data.data, function(error, result) {
                            if (error) {
                                response(context, 404, {
                                    error: 404,
                                    message: "Invalid data."
                                });
                            } else {
                                if (result)
                                    response(context, 200, {
                                        message: "Team Modified"
                                    });
                                else
                                    response(context, 200, {
                                        message: "Could not modify team "
                                    });
                            }
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },

        createTeamViaApp: {
            POST: function(context, connection) {
                try {
            var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;

                        Meteor.call("PcreateTeamViaApp", caller, apiKey, connection.data.data, function(error, result) {
                            if (error) {
                                response(context, 200, {
                                    message: "could not create team"
                                })
                            } else {
                                if (result)
                                    response(context, 200, {
                                        message: "Team Created"
                                    });
                                else
                                    response(context, 200, {
                                        message: "could not create team"
                                    })
                            }
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        updateTeamViaApp: {
            POST: function(context, connection) {
                try {
            var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PupdateTeamViaApp", caller, apiKey, connection.data.data, function(error, result) {
                            if (error) {
                                response(context, 200, {
                                    message: "could not edit team"
                                })
                            } else {
                                if (result)
                                    response(context, 200, {
                                        message: "Team Modified"
                                    });
                                else
                                    response(context, 200, {
                                        message: "could not edit team"
                                    })
                            }
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        deleteTeam: {
            POST: function(context, connection) {
                try {
            var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        var subscribedTour = playerTeamEntries.find({
                            "subscribedTeamID": {
                                $in: [connection.data.teamId]
                            }
                        }).fetch();
                        if (subscribedTour.length > 0) {
                            response(context, 200, {
                                message: "Current Team has subscribed to tournaments "
                            });

                        } else {
                            Meteor.call("PdeleteTeam", caller, apiKey, connection.data.teamId, function(error, result) {
                                if (error) {
                                    response(context, 404, {
                                        error: 404,
                                        message: "Invalid data."
                                    });
                                } else {
                                    if (result)
                                        response(context, 200, {
                                            message: "Team Removed"
                                        });
                                    else
                                        response(context, 200, {
                                            message: "Could not remove team "
                                        });
                                }
                            });
                        }

                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },

        addSchoolCoach: {
            POST: function(context, connection) {
                try {
            var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PaddSchoolCoach", caller, apiKey, connection.data.data, function(e, result) {
                            if (result) {
                                response(context, 200, result);
                            } else if (e) {
                                throw e
                            }
                        });
                    }
                } catch (e) {}
            }
        },



        editSchoolCoach: {
            POST: function(context, connection) {
                try {
            var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PeditSchoolCoach", caller, apiKey, connection.data.data, function(e, result) {
                            if (result) {
                                response(context, 200, result);
                            } else if (e) {
                                throw e
                            }
                        });
                    }
                } catch (e) {}
            }
        },

        deleteSchoolCoach: {
            POST: function(context, connection) {
                try {
            var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PdeleteSchoolCoach", caller, apiKey, connection.data.data, function(e, result) {
                            if (result) {
                                response(context, 200, result);
                            } else if (e) {
                                throw e
                            }
                        });
                    }
                } catch (e) {}
            }
        },

        changeUserPassword: {
            POST: function(context, connection) {
                try {
            var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PchangeUserPassword", caller, apiKey, connection.data.data, function(e, result) {
                            if (result) {
                                response(context, 200, result);
                            } else if (e) {
                                throw e
                            }
                        });
                    }
                } catch (e) {}
            }
        },
        getCoachesList: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    Meteor.call("PgetCoachesList", caller, apiKey, connection.data.data, function(error, result) {
                        if (result) {
                            response(context, 200, result);
                        } else {
                            response(context, 404, {
                                error: 404,
                                message: "Invalid data"
                            })
                        }
                    });
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        getTeamFormatList: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    Meteor.call("PgetTeamFormatList", caller, apiKey, connection.data.data, function(error, result) {
                        if (result) {
                            response(context, 200, result);
                        } else {
                            response(context, 404, {
                                error: 404,
                                message: "Invalid data"
                            })
                        }
                    });
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },

        getDomainList: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    Meteor.call("PgetDomainList", caller, apiKey, function(error, result) {
                        if (result) {
                            response(context, 200, result);
                        } else {
                            response(context, 404, {
                                error: 404,
                                message: "Invalid data"
                            })
                        }
                    });
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        //coach APIS
        /*sendConnectionRequest:{
          POST: function(context, connection) {
            try
            {
            var hasdata = (connection && connection.data) ? true : false;
              if (hasdata) 
              {                  
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                Meteor.call("PsendConnectionRequest",caller,apiKey,connection.data.data,function(e,result){
                  if(result){
                    response(context, 200,result); 
                  }
                  else if(e){
                    throw e
                  }
                });                                                  
              }       
            }catch(e){}
          }
        },

         getSentConnectionDetailsToPlayers: {
              GET: function(context, connection) {
                  try {
                      var caller = connection.data.caller;
                      var apiKey = connection.data.apiKey;
                      Meteor.call("PgetSentConnectionDetailsToPlayers", caller, apiKey, connection.data.data, function(error, result) {
                          if (result) {
                              response(context, 200, result);
                          } else {
                              response(context, 404, {
                                  error: 404,
                                  message: "Invalid data"
                              })
                          }
                      });
                  } catch (e) {
                      response(context, 404, {
                          error: 404,
                          message: "Invalid data."
                      });
                  }
              }
          },
          getSentConnectionDetailsToCoachByPlayers: {
              GET: function(context, connection) {
                  try {
                      var caller = connection.data.caller;
                      var apiKey = connection.data.apiKey;
                      Meteor.call("PgetSentConnectionDetailsToCoachByPlayers", caller, apiKey, connection.data.data, function(error, result) {
                          if (result) {
                              response(context, 200, result);
                          } else {
                              response(context, 404, {
                                  error: 404,
                                  message: "Invalid data"
                              })
                          }
                      });
                  } catch (e) {
                      response(context, 404, {
                          error: 404,
                          message: "Invalid data."
                      });
                  }
              }
          },
          getSentConnectionDetailsToCoachByCoach: {
              GET: function(context, connection) {
                  try {
                      var caller = connection.data.caller;
                      var apiKey = connection.data.apiKey;
                      Meteor.call("PgetSentConnectionDetailsToCoachByCoach", caller, apiKey, connection.data.data, function(error, result) {
                          if (result) {
                              response(context, 200, result);
                          } else {
                              response(context, 404, {
                                  error: 404,
                                  message: "Invalid data"
                              })
                          }
                      });
                  } catch (e) {
                      response(context, 404, {
                          error: 404,
                          message: "Invalid data."
                      });
                  }
              }
          },
          getSentConnectionDetailsToCoachPlayerByCoach: {
              GET: function(context, connection) {
                  try {
                      var caller = connection.data.caller;
                      var apiKey = connection.data.apiKey;
                      Meteor.call("PgetSentConnectionDetailsToCoachPlayerByCoach", caller, apiKey, connection.data.data, function(error, result) {
                          if (result) {
                              response(context, 200, result);
                          } else {
                              response(context, 404, {
                                  error: 404,
                                  message: "Invalid data"
                              })
                          }
                      });
                  } catch (e) {
                      response(context, 404, {
                          error: 404,
                          message: "Invalid data."
                      });
                  }
              }
          },
          getDetailsOfReceivedConnectionReq: {
              GET: function(context, connection) {
                  try {
                      var caller = connection.data.caller;
                      var apiKey = connection.data.apiKey;
                      Meteor.call("PgetDetailsOfReceivedConnectionReq", caller, apiKey, connection.data.data, function(error, result) {
                          if (result) {
                              response(context, 200, result);
                          } else {
                              response(context, 404, {
                                  error: 404,
                                  message: "Invalid data"
                              })
                          }
                      });
                  } catch (e) {
                      response(context, 404, {
                          error: 404,
                          message: "Invalid data."
                      });
                  }
              }
          },*/

        //school team creation and update
        //create
        createTeamAndSubscribe: {
            POST: function(context, connection) {
                try {
            var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PcreateTeamAndSubscribe", caller, apiKey, connection.data.data, function(e, result) {
                            if (result) {
                                response(context, 200, result);
                            } else if (e) {
                                throw e
                            }
                        });
                    }
                } catch (e) {}
            }
        },

        updateTeamAndSubscribe: {
            POST: function(context, connection) {
                try {
            var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PupdateTeamAndSubscribe", caller, apiKey, connection.data.data, function(e, result) {
                            if (result) {
                                response(context, 200, result);
                            } else if (e) {
                                throw e
                            }
                        });
                    }
                } catch (e) {}
            }
        },
        "deletePlayerFromTeam": {
            POST: function(context, connection) {
                try {
            var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PdeletePlayerFromTeam", caller, apiKey, connection.data.data, function(e, result) {
                            if (result) {
                                response(context, 200, result);
                            } else if (e) {
                                throw e
                            }
                        });
                    }
                } catch (e) {}
            }
        },
        teamEventSubscribe: {
            POST: function(context, connection) {
                try {
            var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PteamEventSubscribe", caller, apiKey, connection.data.data, function(error, result) {
                            if (error) {
                                response(context, 200, {
                                    message: "could not subscribe"
                                })
                            } else {
                                if (result)
                                    response(context, 200, {
                                        message: "subscription success"
                                    });
                                else
                                    response(context, 200, {
                                        message: "could not subscribe"
                                    })
                            }
                        });
                    }
                } catch (e) {}
            }
        },
        getTeamEntryDetailsForTeamEvent: {

            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    Meteor.call("PgetTeamEntryDetailsForTeamEvent", caller, apiKey, connection.data.data, function(error, result) {
                        if (result) {
                            response(context, 200, result);
                        } else {
                            response(context, 404, {
                                error: 404,
                                message: "Invalid data"
                            })
                        }
                    });
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        getEntriesOfTeamEvent: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    Meteor.call("PgetEntriesOfTeamEvent", caller, apiKey, connection.data.data, function(error, result) {
                        if (result) {
                            response(context, 200, result);
                        } else {
                            response(context, 404, {
                                error: 404,
                                message: "Invalid data"
                            })
                        }
                    });
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },

        getEntriesOfEvent: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    Meteor.call("PgetEntriesOfEvent", caller, apiKey, connection.data.data, function(error, result) {
                        if (result) {
                            response(context, 200, result);
                        } else {
                            response(context, 404, {
                                error: 404,
                                message: "Invalid data"
                            })
                        }
                    });
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        getEntriesForGivenStateIdAndAbbName: {
            GET: function(context, connection) {
                try {
                    
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    Meteor.call("PgetEntriesForGivenStateIdAndAbbName", caller, apiKey, connection.data.data, function(error, result) {
                        if (result) {
                            response(context, 200, result);
                        } else {
                            response(context, 404, {
                                error: 404,
                                message: "Invalid data"
                            })
                        }
                    });
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        getLiveLinksForStateAndOrganizer: {
            POST: function(context, connection) {
                try {
                    var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PgetLiveLinksForStateAndOrganizer", caller, apiKey, connection.data.data, function(e, result) {
                            if (result) {
                                response(context, 200, result);
                            } else if (e) {
                                throw e
                            }
                        });
                    }
                } catch (e) {}
            }
        },
        getEventsNameBasedOnStateAndUser: {
            POST: function(context, connection) {
                try {
                    var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PgetEventsNameBasedOnStateAndUser", caller, apiKey, connection.data.data, function(e, result) {
                            if (result) {
                                response(context, 200, result);
                            } else if (e) {
                                throw e
                            }
                        });
                    }
                } catch (e) {}
            }
        },
        getRoundsBasedOnStateAndUser: {
            POST: function(context, connection) {
                try {
                    var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PgetRoundsBasedOnStateAndUser", caller, apiKey, connection.data.data, function(e, result) {
                            if (result) {
                                response(context, 200, result);
                            } else if (e) {
                                throw e
                            }
                        });
                    }
                } catch (e) {}
            }
        },
        getMatchRecordsOnTournamentEventRound: {
            POST: function(context, connection) {
                try {
                    var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PgetMatchRecordsOnTournamentEventRound", caller, apiKey, connection.data.data, function(e, result) {
                            if (result) {
                                response(context, 200, result);
                            } else if (e) {
                                throw e
                            }
                        });
                    }
                } catch (e) {}
            }
        },
        getMatchRecordsOnTournamentEventFinal: {
            POST: function(context, connection) {
                try {
                    var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PgetMatchRecordsOnTournamentEventFinal", caller, apiKey, connection.data.data, function(e, result) {
                            if (result) {
                                response(context, 200, result);
                            } else if (e) {
                                throw e
                            }
                        });
                    }
                } catch (e) {}
            }
        },
        getSchoolPlayerDetailsFan: {
            POST: function(context, connection) {
                try {
                    var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PgetSchoolPlayerDetailsFan", caller, apiKey, connection.data.data, function(e, result) {
                            if (result) {
                                response(context, 200, result);
                            } else if (e) {
                                throw e
                            }
                        });
                    }
                } catch (e) {}
            }
        },
        teamDetailedDrawsForTournamenIdEvent: {
            POST: function(context, connection) {
                try {
                    var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PteamDetailedDrawsForTournamenIdEvent", caller, apiKey, connection.data.data, function(e, result) {
                            if (result) {
                                response(context, 200, result);
                            } else if (e) {
                                throw e
                            }
                        });
                    }
                } catch (e) {}
            }
        },
        teamDetailsSchoolsAPI: {
            POST: function(context, connection) {
                try {
                    var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PteamDetailsSchoolsAPI", caller, apiKey, connection.data.data, function(e, result) {
                            if (result) {
                                response(context, 200, result);
                            } else if (e) {
                                throw e
                            }
                        });
                    }
                } catch (e) {}
            }
        },
        getevenSportsDates: {
            POST: function(context, connection) {
                try {
                    var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PgetevenSportsDates", caller, apiKey, connection.data.data, function(e, result) {
                            if (result) {
                                response(context, 200, result);
                            } else if (e) {
                                throw e
                            }
                        });
                    }
                } catch (e) {}
            }
        },
        getEntriesOfIndividualEvent: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    Meteor.call("PgetEntriesOfIndividualEvent", caller, apiKey, connection.data.data, function(error, result) {
                        if (result) {
                            response(context, 200, result);
                        } else {
                            response(context, 404, {
                                error: 404,
                                message: "Invalid data"
                            })
                        }
                    });
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        getTeamDetailsForSchool: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    Meteor.call("PgetTeamDetailsForSchool", caller, apiKey, connection.data.data, function(error, result) {
                        if (result) {
                            response(context, 200, result);
                        } else {
                            response(context, 404, {
                                error: 404,
                                message: "Invalid data"
                            })
                        }
                    });
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        academySubscriptionToTournament: {
            POST: function(context, connection) {
                try {
            var hasdata = (connection && connection.data) ? true : false;
                    if (hasdata) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PacademySubscriptionToTournament", caller, apiKey, connection.data.data, function(e, result) {
                            if (result) {
                                response(context, 200, result);
                            } else if (e) {
                                throw e
                            }
                        });
                    }
                } catch (e) {}
            }
        },
        academySubscriptionDetails: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    Meteor.call("PacademySubscriptionDetails", caller, apiKey, connection.data.data, function(error, result) {
                        if (result) {
                            response(context, 200, result);
                        } else {
                            response(context, 404, {
                                error: 404,
                                message: "Invalid data"
                            })
                        }
                    });
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        getTournamentDetailsForState: {
            GET: function(context, connection) {
                try {
                    var caller = connection.data.caller;
                    var apiKey = connection.data.apiKey;
                    Meteor.call("PgetTournamentDetailsForState", caller, apiKey, connection.data.data, function(error, result) {
                        if (result) {
                            response(context, 200, result);
                        } else {
                            response(context, 404, {
                                error: 404,
                                message: "Invalid data"
                            })
                        }
                    });
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },


        /************* organizer api ********************/

        upcomingTournamentsOnApiKey: {
            GET: function(context, connection) {
                try {
                    var hasQuery = Object.keys(connection.data).length > 0 ? true : false;
                    if (hasQuery) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        var location = connection.data.location;
                        Meteor.call("PupcomingTournamentsOnApiKey", caller, apiKey, location, function(e, r) {
                            if (r) {
                                response(context, 200, r);
                            } else {
                                response(context, 200, {
                                    message: "Invalid data."
                                });
                            }
                        });
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "Invalid data."
                        });
                    }
                } catch (e) {}
            }
        },

        downloadEntriesView: {
            GET: function(context, connection) {
                try {
                    var hasQuery = Object.keys(connection.data).length > 0 ? true : false;
                    if (hasQuery) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        var userId = connection.data.userId;
                        Meteor.call("PdownloadEntriesView", caller, apiKey, connection.data.data, function(e, r) {
                            if (r) {
                                response(context, 200, r);
                            } else {
                                response(context, 200, {
                                    message: "Invalid data."
                                });
                            }
                        });
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "Invalid data."
                        });
                    }
                } catch (e) {}
            }
        },

        organizerTournamentsBasedOnApiDomain: {
            GET: function(context, connection) {
                try {
                    var hasQuery = Object.keys(connection.data).length > 0 ? true : false;
                    if (hasQuery) {
                        var caller = connection.data.caller;
                        var apiKey = connection.data.apiKey;
                        Meteor.call("PorganizerTournamentsBasedOnApiDomain", caller, apiKey, connection.data.domainId, function(e, r) {
                            if (r) {
                                response(context, 200, r);
                            } else {
                                response(context, 200, {
                                    message: "Invalid data."
                                });
                            }
                        });
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "Invalid data."
                        });
                    }
                } catch (e) {}
            }
        },


        getEventsOfTourn: {
            GET: function(context, connection) {
                try {
                    var hasQuery = Object.keys(connection.data).length > 0 ? true : false;
                    if (hasQuery) {
                        Meteor.call("getEventsOfTourn", connection.data.caller, connection.data.apiKey, connection.data.tournamentId, connection.data.userId, function(e, r) {
                            if (r && r.length != 0) {
                                response(context, 200, r);
                            } else if (r.length == 0) {
                                response(context, 200, "No events under tournament");
                            } else {
                                response(context, 404, {
                                    error: 404,
                                    message: "Invalid data."
                                });
                            }
                        });
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "Invalid data."
                        });
                    }
                } catch (e) {}
            }
        },
        /********* temp *********************/
        fetchSummarizedSequence1: {
            GET: function(context, connection) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var userId = connection.data.userId;
                var userName = connection.data.userName;
                try {
                    var userNamesBySport = Meteor.call("PfetchSummarizedSequence1", caller, apiKey, userId, connection.data);
                    if (userNamesBySport) {

                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        fetchSummarizedServiceSequence1: {
            GET: function(context, connection) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var userId = connection.data.userId;
                var userName = connection.data.userName;
                try {
                    var userNamesBySport = Meteor.call("PfetchServicePoints1", caller, apiKey, userId, connection.data);
                    if (userNamesBySport) {

                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        fetchSummarizedServiceLossSequence1: {
            GET: function(context, connection) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var userId = connection.data.userId;
                var userName = connection.data.userName;
                try {
                    var userNamesBySport = Meteor.call("PfetchServiceLoss1", caller, apiKey, userId, connection.data);
                    if (userNamesBySport) {

                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        fetchSummarizedServiceFaultSequence1: {
            GET: function(context, connection) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var userId = connection.data.userId;
                var userName = connection.data.userName;
                try {
                    var userNamesBySport = Meteor.call("PfetchServiceFault1", caller, apiKey, userId, connection.data);
                    if (userNamesBySport) {

                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        fetchSummarizedReceiverSequence1: {
            GET: function(context, connection) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var userId = connection.data.userId;
                var userName = connection.data.userName;
                try {
                    var userNamesBySport = Meteor.call("PfetchReceiverPoints1", caller, apiKey, userId, connection.data);
                    if (userNamesBySport) {

                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        fetchRallyAnalysis1: {
            GET: function(context, connection) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var userId = connection.data.userId;
                var userName = connection.data.userName;
                try {
                    var userNamesBySport = Meteor.call("PfetchRallyAnalysis1", caller, apiKey, userId, connection.data);
                    if (userNamesBySport) {

                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        fetchStrokeAnalysis1: {
            GET: function(context, connection) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var userId = connection.data.userId;
                var userName = connection.data.userName;
                try {
                    var userNamesBySport = Meteor.call("PfetchStrokeAnalysis1", caller, apiKey, userId, connection.data);
                    if (userNamesBySport) {

                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        fetchErrorAnalysis1: {
            GET: function(context, connection) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var userId = connection.data.userId;
                var userName = connection.data.userName;
                try {
                    var userNamesBySport = Meteor.call("PfetchErrorAnalysis1", caller, apiKey, userId, connection.data);
                    if (userNamesBySport) {

                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        fetchServiceResponseAnalysis1: {
            GET: function(context, connection) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var userId = connection.data.userId;
                var userName = connection.data.userName;
                try {
                    var userNamesBySport = Meteor.call("PfetchServiceResponseAnalysis1", caller, apiKey, userId, connection.data);
                    if (userNamesBySport) {

                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },

        fetch3BallAttack1: {
            GET: function(context, connection) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var userId = connection.data.userId;
                var userName = connection.data.userName;
                try {
                    var userNamesBySport = Meteor.call("Pfetch3BallAttack1", caller, apiKey, userId, connection.data);
                    if (userNamesBySport) {

                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        fetch4BallShot1: {
            GET: function(context, connection) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var userId = connection.data.userId;
                var userName = connection.data.userName;
                try {
                    var userNamesBySport = Meteor.call("Pfetch4BallShot1", caller, apiKey, userId, connection.data);
                    if (userNamesBySport) {

                        response(context, 200, userNamesBySport);
                    } else {
                        response(context, 404, {
                            error: 404,
                            message: "No users found."
                        });
                    }
                } catch (e) {
                    response(context, 404, {
                        error: 404,
                        message: "Invalid data."
                    });
                }
            }
        },
        utility: {
            getRequestContents: function(request) {
                if (request.method == "GET") {}
            }
        }

    }
};

export var response = function(context, statusCode, data) {
    context.response.setHeader('Content-Type', 'application/json');
    context.response.statusCode = statusCode;
    context.response.end(JSON.stringify(data));
}