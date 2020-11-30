import {
    Meteor
}
from 'meteor/meteor';
import {
    response
}
from './api.js';

API.methods["sendOtpToVerify"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                
                var data = connection.data.data
                var data2 = data


                if(typeof data == "string"){
                    data = data.replace("\\", "");
                    data2 = JSON.parse(data);
                }

                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;

                Meteor.call("PsendOtpToVerify", caller, apiKey, data2, function(e, r) {
                    if (r) {
                        response(context, 200, 
                            r
                        );
                    } else {
                        response(context, 200, {
                            message: "Invalid data"
                        });
                    }
                });
            } else {
                response(context, 404, {
                    error: 404,
                    message: "Invalid data"
                });
            }
        } catch (e) {}
    }
}

API.methods["updateVerifiedMailPhone"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {

                var data = connection.data.data
                var data2 = data;

                if(typeof data == "string"){
                    data = data.replace("\\", "");
                    data2 = JSON.parse(data);
                }
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;

                Meteor.call("PupdateVerifiedMailPhone", caller, apiKey, data2, function(e, r) {
                    if (r) {
                        response(context, 200, 
                            r
                        );
                    } else {
                        response(context, 200, {
                            message: "Invalid data"
                        });
                    }
                });
            } else {
                response(context, 404, {
                    error: 404,
                    message: "Invalid data"
                });
            }
        } catch (e) {}
    }
}
