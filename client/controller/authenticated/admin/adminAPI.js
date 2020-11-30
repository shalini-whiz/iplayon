import {
    HTTP
}
from 'meteor/http'

Template.adminAPI.onCreated(function() {
    this.subscribe("onlyLoggedIn")
    this.subscribe("authAddress");

});

Template.adminAPI.onRendered(function() {

    Session.set("inputJson", undefined);
    Session.set("resultJson",undefined);
});

Template.adminAPI.helpers({
    "notAdmin": function() {
        try {
            var emailAddress = Meteor.user().emails[0].address;
            var boolVal = false
            var auth = authAddress.find({}).fetch();
            if (auth) {
                for (var i = 0; i < auth.length; i++) {
                    if (emailAddress && emailAddress == auth[i].data) {
                        boolVal = false;
                    } else {
                        boolVal = true;
                        break;
                    }
                };
            }
            return boolVal
        } catch (e) {}
    },
    "apiList": function() {
        try {
            //"viewTeams","deleteTeam",
            var listOfApi = ["getCustomData","addCustomData","editCustomData"];
            return listOfApi;
        } catch (e) {

        }
    },
    "sampleJson": function() {
        if (Session.get("exampleJson")) {
            return Session.get("exampleJson");
        }

    },
    "resultJson":function()
    {
        if(Session.get("resultJson"))
            return Session.get("resultJson");
    }

});


Template.adminAPI.events({
    "click #apiList": function(e) {
        var apiSelected = $("[name='apiList'] option:selected").attr("name");
        var xData = {};
            Session.set("resultJson",undefined)

        if (apiSelected == "editCustomData"){
            xData = {
                "type": "accountType"
            } 
        }
        else if (apiSelected == "addCustomData"){
            xData = {
                "type": "accountType",
                "customData": ["Current Account","Savings Bank Account"],     
            } 
        }
        else if(apiSelected == "getCustomData"){
            xData = {
                type:"accountType"
            }
        }
      
        $("#inputJson").val(JSON.stringify(xData));

        Session.set("inputJson", xData);
    },

    "click #testAPI": function(e) {

        var apiSelected = $("[name='apiList'] option:selected").attr("name");
        
        var inputJSON1 = $("#inputJson").val();
         //var  data = data.replace("\\", "");
        var inputJSON = JSON.parse(inputJSON1);
alert("clicked"+JSON.stringify(inputJSON))

        try {
            if (apiSelected == "addCustomData" || apiSelected == "editCustomData" ||apiSelected == "getCustomData" ) {

                Meteor.call(apiSelected,inputJSON,function(error, result) {
                    if (!error) {
                        Session.set("resultJson",JSON.stringify(result))

                    }
                });
            }
            
           
           
        } catch (e) {
            alert(e)
        }
    }
})