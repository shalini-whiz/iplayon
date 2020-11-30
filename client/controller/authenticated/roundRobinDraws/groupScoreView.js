
Template.groupScoreView.onCreated(function() {
    Session.set("progressBar",undefined)

});

Template.certificate.helpers({
    "progressBar":function(){
      if(Session.get("progressBar") != undefined && Session.get("progressBar") == true)
        return true;
    },
});


Template.groupScoreView.events({

    'click #printGroupScore': function(e) 
    {
        e.preventDefault();
        try{
            var groupID = Session.get("currentStandingGroup");
            if(groupID)
            {
                var tournamentId = Session.get("tournamentId");
                var eventName = Session.get("eventName");

                Session.set("progressBar",true);
                var scoreSheetType = $("input[name=scoreSheetType]:checked").attr("value");
                var dataJson = {};
                dataJson["groupID"] = groupID;
                dataJson["tournamentId"] = tournamentId;
                dataJson["eventName"] = eventName;
                dataJson["type"] =  scoreSheetType;

            
                Meteor.call('groupWiseScoreSheet', dataJson, function(err, res) {
                    Session.set("progressBar",undefined);

                    if (err) {} else if (res) {
                        window.open("data:application/pdf;base64, " + res);
                        $('.modal-backdrop').remove();
                    }
                }) 
            }
        } catch (e) {}
        
    }
});