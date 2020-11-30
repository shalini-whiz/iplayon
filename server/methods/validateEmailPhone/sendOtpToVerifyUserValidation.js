Meteor.methods({
    PsendOtpToVerify: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                return (Meteor.call("sendOtpToVerify", data));
            }

        } catch (e) {}
    },

})
Meteor.methods({
    PupdateVerifiedMailPhone: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                return (Meteor.call("updateVerifiedMailPhone", data));
            }

        } catch (e) {}
    },

})
