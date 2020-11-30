Meteor.methods({




    "PfetchRRDrawEvents": function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                var param = data;         
                if(typeof data == "string"){
                    data = data.replace("\\", "");
                    param = JSON.parse(data);
                }
                
              
                return (Meteor.call("fetchRRDrawEvents", data));
            }
        } catch (e) {}
    },


    "PfetchStateEvents": function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                var param = data;
                
                if(typeof data == "string"){
                    data = data.replace("\\", "");
                    param = JSON.parse(data);
                }
                
                if(data.apiUserId == undefined)
                {
                    var apiInfo = apiUsers.findOne({"apiUser": caller,"apiKey":apiKey});
                    if(apiInfo.userId)
                        data.apiUserId = apiInfo.userId;
                }
                return (Meteor.call("fetchStateEvents", data));
            }
        } catch (e) {}
    },


    //fetchStateWinners

     "PfetchStateWinners": function(caller, apiKey, data) {
        try {
            if (apiUsers.findOne({
                    "apiUser": caller
                }).apiKey != apiKey) {
                return;
            } else {
                var param = data;
                
                if(typeof data == "string"){
                    data = data.replace("\\", "");
                    param = JSON.parse(data);
                }
                
                if(data.apiUserId == undefined)
                {
                    var apiInfo = apiUsers.findOne({"apiUser": caller,"apiKey":apiKey});
                    if(apiInfo.userId)
                        data.apiUserId = apiInfo.userId;
                }
                return (Meteor.call("fetchStateWinners", data));
            }
        } catch (e) {}
    },
});