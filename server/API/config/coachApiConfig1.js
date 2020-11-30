

import { Meteor } from 'meteor/meteor';
import { response } from './api.js';

API.methods["fetchNonConnectionUsers"] = {
    POST: function(context, connection) {
        try {   
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                Meteor.call("PfetchNonConnectionUsers", caller, apiKey, connection.data.userId, function(e, result) {
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

API.methods["fetchThreadMessages"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                Meteor.call("PfetchThreadMessages", caller, apiKey, connection.data.data, function(e, result) {
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







API.methods["deleteThreadMessage"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                Meteor.call("PdeleteThreadMessage", caller, apiKey, connection.data.data, function(e, result) {
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


API.methods["deleteAllThreadMessage"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                Meteor.call("PdeleteAllThreadMessage", caller, apiKey, connection.data.data, function(e, result) {
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



API.methods["coachRegisterViaApp"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                Meteor.call("PcoachRegisterViaApp", caller, apiKey, connection.data.data, function(e, result) {
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




API.methods["fetchNonConnectionUsersForPlayer"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                Meteor.call("PfetchNonConnectionUsersForPlayer", caller, apiKey, connection.data.userId, function(e, result) {
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


API.methods["getMyGroups"] = {
    GET: function(context, connection) {
        try {
            var caller = connection.data.caller;
            var apiKey = connection.data.apiKey;
            Meteor.call("PgetMyGroups", caller, apiKey, connection.data.data, function(error, result) {
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

API.methods["viewUserProfile"] = {
    POST: function( context, connection ){
        try{
            var hasdata = (connection && connection.data) ? true : false;                       
		    if (connection.data) 
		    {
		    	var caller = connection.data.caller;
	            var apiKey = connection.data.apiKey;
	            var userId = connection.data.userId;
	            var result = Meteor.call("PviewUserProfile",caller,apiKey,userId);
	            if ( result) 
	            	response( context, 200, result );
	            else 
	             	response( context, 404, { error: 404, message: "No user found." } );
		    }
		    else
		    {
		    	response(context, 404, {error: 404,message: "Invalid data"});

		    } 
        }
        catch(e){
            response( context, 404, { error: 404, message: "Invalid data." } );
        }
            
    }
}





API.methods["getDetailsOfReceivedNSentConnection"] = {
    POST: function( context, connection ){
        try{
            var hasdata = (connection && connection.data) ? true : false;
		    if (hasdata) 
		    {     
		    	var caller = connection.data.caller;
	            var apiKey = connection.data.apiKey;
	            var userId = connection.data.userId;
	            var result = Meteor.call("PgetDetailsOfReceivedNSentConnection",caller,apiKey,connection.data.data);
	            if ( result) 
	            	response( context, 200, result );
	            else 
	             	response( context, 404, { error: 404, message: "No user found." } );
		    }
		    else
		    {
		    	response(context, 404, {error: 404,message: "Invalid data"});

		    } 
        }
        catch(e){
            response( context, 404, { error: 404, message: "Invalid data." } );
        }
            
    }
}




API.methods["deleteGroupCoach"] = {
    POST: function( context, connection ){
        try{
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) 
            {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var result = Meteor.call("PdeleteGroupCoach",caller,apiKey,connection.data.data);
                if ( result) 
                    response( context, 200, result );
                else 
                    response( context, 404, { error: 404, message: "No user found." } );
            }
            else
            {
                response(context, 404, {error: 404,message: "Invalid data"});

            } 
        }
        catch(e){
            response( context, 404, { error: 404, message: "Invalid data." } );
        }
            
    }
}




API.methods["getConnectedMembersInHaul"] = {
    POST: function( context, connection ){
        try{
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) 
            {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var result = Meteor.call("PgetConnectedMembersInHaul",caller,apiKey,connection.data.data);
                if ( result) 
                    response( context, 200, result );
                else 
                    response( context, 404, { error: 404, message: "No user found." } );
            }
            else
            {
                response(context, 404, {error: 404,message: "Invalid data"});

            } 
        }
        catch(e){
            response( context, 404, { error: 404, message: "Invalid data." } );
        }
            
    }
}



API.methods["fetchGroupDetailsOfCoach"] = {
    GET: function(context, connection) {
        try {
            var caller = connection.data.caller;
            var apiKey = connection.data.apiKey;
            Meteor.call("PfetchGroupDetailsOfCoach", caller, apiKey, connection.data.data, function(error, result) {
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

/******************** work assignments ********************/
API.methods["getAssignments"] = {
    POST: function(context, connection) {
        try {
            var caller = connection.data.caller;
            var apiKey = connection.data.apiKey;
            Meteor.call("PgetAssignments", caller, apiKey, connection.data.data, function(error, result) {
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

API.methods["fetchThreadAssignments"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;

                Meteor.call("PfetchThreadAssignments", caller, apiKey, connection.data.data, function(e, result) {
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


API.methods["updateAssignmentStatus"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                Meteor.call("PupdateAssignmentStatus", caller, apiKey, connection.data.data, function(e, result) {
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



API.methods["saveAccountDetails"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                Meteor.call("PsaveAccountDetails", caller, apiKey, connection.data, function(e, result) {
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

API.methods["getAccountDetails"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                Meteor.call("PgetAccountDetails", caller, apiKey, connection.data.userId,function(e, result) {
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






API.methods["getMyConnectedMem"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                Meteor.call("PgetMyConnectedMem", caller, apiKey, connection.data,function(e, result) {
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


API.methods["getAssignmentsInHaul"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                Meteor.call("PgetAssignmentsInHaul", caller, apiKey, connection.data,function(e, result) {
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
