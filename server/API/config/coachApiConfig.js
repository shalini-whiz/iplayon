import {
    Meteor
}
from 'meteor/meteor';
import {
    response
}
from './api.js';

API.methods["sendConnectionRequest"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                Meteor.call("PsendConnectionRequest", caller, apiKey, connection.data.data, function(e, result) {
                    if (result) {
                        response(context, 200, result);
                    } else if (e) {
                        throw e
                    }
                });
            }
        } catch (e) {}
    }
};

API.methods["getSentConnectionDetailsToPlayers"] = {
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
};

API.methods["getSentConnectionDetailsToCoachByPlayers"] = {
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
};

API.methods["getSentConnectionDetailsToCoachByCoach"] = {
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
};

API.methods["getSentConnectionDetailsToCoachPlayerByCoach"] = {
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
};

API.methods["getDetailsOfReceivedConnectionReq"] = {
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
};


API.methods["acceptConnectionRequest"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                Meteor.call("PacceptConnectionRequest", caller, apiKey, connection.data.data, function(e, result) {
                    if (result) {
                        response(context, 200, result);
                    } else if (e) {
                        throw e
                    }
                });
            }
        } catch (e) {}
    }
};

API.methods["rejectConnectionRequest"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                Meteor.call("PrejectConnectionRequest", caller, apiKey, connection.data.data, function(e, result) {
                    if (result) {
                        response(context, 200, result);
                    } else if (e) {
                        throw e
                    }
                });
            }
        } catch (e) {}
    }
};

API.methods["deleteConnectionRequest"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                Meteor.call("PdeleteConnectionRequest", caller, apiKey, connection.data.data,connection.data.param,function(e, result) {
                    if (result) {
                        response(context, 200, result);
                    } else if (e) {
                        throw e
                    }
                });
            }
        } catch (e) {}
    }
};




API.methods["createCoachConnectedGroup"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                Meteor.call("PcreateCoachConnectedGroup", caller, apiKey, connection.data.data, function(e, result) {
                    if (result) {
                        response(context, 200, result);
                    } else if (e) {
                        throw e
                    }
                });
            }
        } catch (e) {}
    }
};

API.methods["getConnectedMembersToCreateGroup"] = {
    GET: function(context, connection) {
        try {
            var caller = connection.data.caller;
            var apiKey = connection.data.apiKey;
            Meteor.call("PgetConnectedMembersToCreateGroup", caller, apiKey, connection.data.data, function(error, result) {
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
};


API.methods["getCoachGroups"] = {
    GET: function(context, connection) {
        try {
            var caller = connection.data.caller;
            var apiKey = connection.data.apiKey;
            Meteor.call("PgetCoachGroups", caller, apiKey, connection.data.data, function(error, result) {
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
};




API.methods["groupDetailsOfCoach"] = {
    GET: function(context, connection) {
        try {
            var caller = connection.data.caller;
            var apiKey = connection.data.apiKey;
            Meteor.call("PgroupDetailsOfCoach", caller, apiKey, connection.data.data, function(error, result) {
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
};

API.methods["updateCoachConnectedGroup"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                Meteor.call("PupdateCoachConnectedGroup", caller, apiKey, connection.data.data, function(e, result) {
                    if (result) {
                        response(context, 200, result);
                    } else if (e) {
                        throw e
                    }
                });
            }
        } catch (e) {}
    }
};

API.methods["updateCoachGroupName"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                Meteor.call("PupdateCoachGroupName", caller, apiKey, connection.data.data, function(e, result) {
                    if (result) {
                        response(context, 200, result);
                    } else if (e) {
                        throw e
                    }
                });
            }
        } catch (e) {}
    }
};


API.methods["deleteGroupMemberFromCoach"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                Meteor.call("PdeleteGroupMemberFromCoach", caller, apiKey, connection.data.data, function(e, result) {
                    if (result) {
                        response(context, 200, result);
                    } else if (e) {
                        throw e
                    }
                });
            }
        } catch (e) {}
    }
};

API.methods["getConnectedMembersForGivenPlayerID"] = {
    GET: function(context, connection) {
        try {
            var caller = connection.data.caller;
            var apiKey = connection.data.apiKey;
            Meteor.call("PgetConnectedMembersForGivenPlayerID", caller, apiKey, connection.data.data, function(error, result) {
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
};

API.methods["deleteConnectionRequestSentByLoggedInId"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                Meteor.call("PdeleteConnectionRequestSentByLoggedInId", caller, apiKey, connection.data.data, function(e, result) {
                    if (result) {
                        response(context, 200, result);
                    } else if (e) {
                        throw e
                    }
                });
            }
        } catch (e) {}
    }
};

API.methods["deleteAllConnectionReqReceivedByLoggedInId"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                Meteor.call("PdeleteAllConnectionReqReceivedByLoggedInId", caller, apiKey, connection.data.data, function(e, result) {
                    if (result) {
                        response(context, 200, result);
                    } else if (e) {
                        throw e
                    }
                });
            }
        } catch (e) {}
    }
};

API.methods["sendTextMessageToPlayerByCoach"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                Meteor.call("PsendTextMessageToPlayerByCoach", caller, apiKey, connection.data.data, function(e, result) {
                    if (result) {
                        response(context, 200, result);
                    } else if (e) {
                        throw e
                    }
                });
            }
        } catch (e) {
        }
    }
};

API.methods["getInboxMessagesForLoggedInId"] = {
    GET: function(context, connection) {
        try {
            var caller = connection.data.caller;
            var apiKey = connection.data.apiKey;
            Meteor.call("PgetInboxMessagesForLoggedInId", caller, apiKey, connection.data.data, function(error, result) {
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
};







API.methods["getALLEVEnts"] = {
    GET: function(context, connection) {
        try {
            var caller = connection.data.caller;
            var apiKey = connection.data.apiKey;
            Meteor.call("PgetALLEVEnts", caller, apiKey, function(error, result) {
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
};

API.methods["registerOtpForCoach"] = {
    GET: function(context, connection) {
        try {
            var caller = connection.data.caller;
            var apiKey = connection.data.apiKey;
            var emailId = connection.data
            Meteor.call("PregisterOtpForCoach", caller, apiKey, emailId, function(error, result) {
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
};


API.methods["fetchProfileSettingsForCoach"] = {
    GET: function( context, connection )
        {
          
          try
          {
            var caller = connection.data.caller;
            var apiKey = connection.data.apiKey;
            var userNamesBySport = Meteor.call("PfetchProfileSettingsForCoach",caller,apiKey,connection.data.data);  
            if ( userNamesBySport) {
             response( context, 200, userNamesBySport );
            } 
            else {
             response( context, 404, { error: 404, message: "No users found." } );
            }
          }
          catch(e)
          {
            response( context, 404, { error: 404, message: "Invalid data." } );
          }
        }
};