Meteor.methods({

	PupsertDrill: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({"apiUser": caller}).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("upsertDrill", data));
        } catch (e) {
        }
    },
    PremoveDrill: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({"apiUser": caller}).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("removeDrill", data));
        } catch (e) {
        }
    },
    PfetchDrill: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({"apiUser": caller}).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("fetchDrill", data));
        } catch (e) {
        }
    },
    PdataToAssignDrill: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({"apiUser": caller}).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("dataToAssignDrill", data));
        } catch (e) {
        }
    },
    PassignDrill: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({"apiUser": caller}).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("assignDrill", data));
        } catch (e) {
        }
    },
    PgetDrillTypes: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({"apiUser": caller}).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("getDrillTypes", data));
        } catch (e) {
        }
    },
    PdataToAnalyze: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({"apiUser": caller}).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("dataToAnalyze", data));
        } catch (e) {
        }
    },
    PsaveDataToAnalyze: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({"apiUser": caller}).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("validSaveDataToAnalyze", data));
        } catch (e) {
        }
    },
    PfetchAnalyzedPlayers: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({"apiUser": caller}).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("fetchAnalyzedPlayers", data));
        } catch (e) {
        }
    },
    PfetchAnalyzedDataForGivenPlayer:function(caller, apiKey, data){
        try {
            if (apiUsers.findOne({"apiUser": caller}).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("fetchAnalyzedDataForGivenPlayerDate", data));
        } catch (e) {
        }
    },
    PsaveTtData:function(caller,apiKey,data){
        try {
            if (apiUsers.findOne({"apiUser": caller}).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("saveTtData", data));
        } catch (e) {
        }
    }
})