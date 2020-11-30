import { Meteor } from 'meteor/meteor';
import { response } from './api.js';

API.methods["upsertDrill"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if (connection.data.data) {
                    if (typeof connection.data.data == "string") {
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }
                Meteor.call("PupsertDrill", caller, apiKey, data, function(e, r) {
                    if (r) {
                        response(context, 200, r);
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

API.methods["removeDrill"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if (connection.data.data) {
                    if (typeof connection.data.data == "string") {
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }
                Meteor.call("PremoveDrill", caller, apiKey, data, function(e, r) {
                    if (r) {
                        response(context, 200, r);
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


API.methods["fetchDrill"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if (connection.data.data) {
                    if (typeof connection.data.data == "string") {
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }
                Meteor.call("PfetchDrill", caller, apiKey, data, function(e, r) {
                    if (r) {
                        response(context, 200, r);
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

//dataToAssignDrill


API.methods["dataToAssignDrill"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if (connection.data.data) {
                    if (typeof connection.data.data == "string") {
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }
                Meteor.call("PdataToAssignDrill", caller, apiKey, data, function(e, r) {
                    if (r) {
                        response(context, 200, r);
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


API.methods["assignDrill"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if (connection.data.data) {
                    if (typeof connection.data.data == "string") {
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }
                Meteor.call("PassignDrill", caller, apiKey, data, function(e, r) {
                    if (r) {
                        response(context, 200, r);
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

API.methods["getDrillTypes"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if (connection.data.data) {
                    if (typeof connection.data.data == "string") {
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }
                Meteor.call("PgetDrillTypes", caller, apiKey, data, function(e, r) {
                    if (r) {
                        response(context, 200, r);
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

API.methods["dataToAnalyze"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if (connection.data.data) {
                    if (typeof connection.data.data == "string") {
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }
                Meteor.call("PdataToAnalyze", caller, apiKey, data, function(e, r) {
                    if (r) {
                        response(context, 200, r);
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

API.methods["saveDataToAnalyze"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if (connection.data.data) {
                    if (typeof connection.data.data == "string") {
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }
                Meteor.call("PsaveDataToAnalyze", caller, apiKey, data, function(e, r) {
                    if (r) {
                        response(context, 200, r);
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

API.methods["fetchAnalyzedPlayers"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if (connection.data.data) {
                    if (typeof connection.data.data == "string") {
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }
                Meteor.call("PfetchAnalyzedPlayers", caller, apiKey, data, function(e, r) {
                    if (r) {
                        response(context, 200, r);
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

API.methods["fetchAnalyzedDataForGivenPlayer"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if (connection.data.data) {
                    if (typeof connection.data.data == "string") {
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }
                Meteor.call("PfetchAnalyzedDataForGivenPlayer", caller, apiKey, data, function(e, r) {
                    if (r) {
                        response(context, 200, r);
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


API.methods["saveTtData"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if (connection.data.data) {
                    if (typeof connection.data.data == "string") {
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }
                Meteor.call("PsaveTtData", caller, apiKey, data, function(e, r) {
                    if (r) {
                        response(context, 200, r);
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
