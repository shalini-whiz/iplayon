
Template.teamDrawsCapture.onCreated(function bodyOnCreated() {

 
    
});

Template.teamDrawsCapture.onRendered(function () {
    
});


Template.teamDrawsCapture.helpers({
	
});

Template.teamDrawsCapture.events({

	 "click #viewTeamSpecificationRR":function(e){
        e.preventDefault();
        $("#teamDrawsCapture").modal('hide');
        $( '.modal-backdrop' ).remove();
        $("#teamDrawsCapturePopUp").empty();   
     
    
        Blaze.render(Template.teamSpecification, $("#teamDrawsSpecificationPopUp")[0]);
            $("#teamSpecification").modal({
                backdrop: 'static',
                keyboard: false

            });
    },
   
    "click #cancelTeamSpecForm":function(e){
        e.preventDefault();
        $("#teamDrawsSpecificationPopUp").empty();
        $( '.modal-backdrop' ).remove();
        $("#teamSpecification").modal('hide');

       
    },
    "click #closeTeamPopupIplayonMain":function(e){
        e.preventDefault();
        $("#teamDrawsCapturePopUp").empty();
        $("#teamDrawsCapture").empty();
        $( '.modal-backdrop' ).remove();
        $("#teamDrawsCapture").modal('hide');

         


    },
    "click #viewDetailedScoreRR":function(e){
        var tournamentId = Session.get("tournamentId");
        var det = Session.get("currentPlayerMatchDetails");
        var eventName = Session.get("eventName");
       
        var teamAId = det.teamsID.teamAId;
        var teamBId = det.teamsID.teamBId;

        Meteor.call("checkTeamSpecification",tournamentId,eventName,teamAId,teamBId,function(e,res){
            if(res==true){
                $("#teamDrawsCapture").modal('hide')
                $( '.modal-backdrop' ).remove();
                $("#teamDrawsDetailsPopUp").empty();

                Blaze.render(Template.teamDetailScore,$("#teamDrawsDetailsPopUp")[0])
                $("#teamDetailScore").modal({
                    backdrop: 'static',
                    keyboard: false
                });


                
            }
            else{
                displayMessage("Team Specification for this match is not set");
            }
        });  

    }


    
})