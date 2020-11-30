

Template.matchRROrder.onCreated(function bodyOnCreated() {
    Session.set("matchRROrderData",undefined)
});

Template.matchRROrder.onRendered(function () {
    Session.set("matchRROrderData",undefined)
});


Template.matchRROrder.helpers({
    "groupMemList":function()
    {
        var result2 = ReactiveMethod.call("fetchRRMemSizeList",Session.get("tournamentId"),Session.get("eventName"));
        return result2
    },
	"fetchDetailOrderPlay":function()
    {
        if(Session.get("matchRROrderData"))
        {
            return Session.get("matchRROrderData")
        }

    }, 
});


Template.matchRROrder.events({
      "change #selectWhich": function(event, template) {
        event.preventDefault();
        var selectedEvent = event.target.value;
        Meteor.call("fetchRROrderPlayList",Session.get("tournamentId"),Session.get("eventName"),selectedEvent,function(error,result){
            if(result)
            {
                Session.set("matchRROrderData",result)
            }

        })



        
        
    },

	"click #saveRROrderForm":function(e){
        try{
              //orderSet
           
            var selectedEvent = $("#selectWhich").val();
            if(selectedEvent != null && selectedEvent != undefined)
            {

                var groupMemVal = "";
                if(Session.get("matchRROrderData"))
                {
                    var matchRROrderData = Session.get("matchRROrderData");
                    if(matchRROrderData.length > 0 && matchRROrderData[0] && matchRROrderData[0].groupMem)
                        groupMemVal = matchRROrderData[0].groupMem;
                }

                var values = [];
                $("input[name='orderSet']").each(function() {
                    var dataJson = {};
                    var arrOfStr = $(this).val().split(","); 
                    dataJson["groupMem"] = groupMemVal;
                    dataJson["matchOrder"] = arrOfStr;
                    values.push(dataJson)
                });

                var groupMemSize = parseInt(selectedEvent);

                var paramJson = {};
                paramJson["tournamentId"] = Session.get("tournamentId");
                paramJson["eventName"] = Session.get("eventName");
                paramJson["orderPlay"] = values;
                paramJson["groupMemSize"] = groupMemSize

                Meteor.call("updateRROrderPlay",paramJson,function(error,result)
                {
                    if(result)
                    {
                        displayMessage("Match Order updated!!")
                        if(result.type && result.matchRecords)
                        {
                            if(result.type.trim() == "individual")
                            {
                                Session.set("roundRobinDraws",result.matchRecords);  
                                Session.set("roundRobinTeamDraws",undefined);         
                            }
                            else if(result.type.trim() == "team")
                            {
                                Session.set("roundRobinDraws",undefined);  
                                Session.set("roundRobinTeamDraws",result.matchRecords);    
                            }

                        }
                        $("#matchRROrder").modal('hide');
                        $("#matchRROrderPopUp").empty();   
                        $( '.modal-backdrop' ).remove();
                    }
                })


            }
            else
            {
                displayMessage("Choose Group Size!!")
            }

            


            
           

        }
        catch(e)
        {
        }

    },
    "click #cancelRROrderForm":function(e){
        e.preventDefault();
        $("#matchRROrder").modal('hide');
        $("#matchRROrderPopUp").empty();   
        $( '.modal-backdrop' ).remove();
    },

})