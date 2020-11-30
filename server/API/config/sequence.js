
import { Meteor } from 'meteor/meteor';
import { response } from './api.js';

API.methods["createAnalyticsRequest"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = {};
                if(connection.data.data)
                	data = connection.data.data;

                Meteor.call("PcreateAnalyticsRequest", caller, apiKey,data, function(e, result) {
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


API.methods["fetchAnalyticsRequest"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = {};
                if(connection.data.data)
                	data = connection.data.data;

                Meteor.call("PfetchAnalyticsRequest", caller, apiKey,data, function(e, result) {
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



API.methods["cancelAnalyticsRequest"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = {};
                if(connection.data.data)
                	data = connection.data.data;

                Meteor.call("PcancelAnalyticsRequest", caller, apiKey,data, function(e, result) {
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



API.methods["downloadAnalyticsRequestPdf"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = {};
                if(connection.data.data)
                	data = connection.data.data;

                Meteor.call("PdownloadAnalyticsRequestPdf", caller, apiKey,data, function(e, result) {
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

//fetchRequestUser

API.methods["fetchRequestUser"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = {};
                if(connection.data.data)
                    data = connection.data.data;

                Meteor.call("PfetchRequestUser", caller, apiKey,data, function(e, result) {
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