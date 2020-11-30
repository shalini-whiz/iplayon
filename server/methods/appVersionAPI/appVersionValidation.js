Meteor.methods({

	PcheckAppUpdate: function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            }
            return (Meteor.call("checkAppUpdate", data));
        } catch (e) {
        }
    },

})