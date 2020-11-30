var dbsrequiredIndLev = ["playerEntries","userDetailsTT"]
var playerEntriesLev = "playerEntries"
var userDetailsTTLev = "userDetailsTT"
//userDetailsTTUsed

  Template.leaveRequest.onCreated(function(){
    this.subscribe("playersOfTournBasedEntries",Router.current().params._id);

    this.subscribe("playerIndEntriesForReceipt",Router.current().params._id);
    if (Router.current().params._id) {
      var tournamentId = Router.current().params._id;
      Meteor.call("changeDbNameForDraws", tournamentId,dbsrequiredIndLev,function(e, res) {
        if(res){
          if(res.changeDb && res.changeDb == true){
            if(res.changedDbNames.length!=0){
              playerEntriesLev = res.changedDbNames[0]
              userDetailsTTLev = res.changedDbNames[1]

            }
          }
        }
      });
    }
            $("#configurationDropDown").select2("close");



  })
  
  Template.registerHelper("getPlayerName_Leave",function(data){
    if(data){
      var playerName = Meteor.users.findOne({role:"Player","_id":data}).userName;
      return playerName;
    }
  })
  
Template.registerHelper("getPlayerName_LeaveInd",function(data){
    try{
    if(data&&data.playerId){
        var playerName = ReactiveMethod.call("getPlayerDetailToSendReceipt",data.playerId,userDetailsTTLev);
        if(playerName&&playerName.userName)
        return playerName.userName;
    }
    }catch(e){
    }
  })

 Template.leaveRequest.onRendered(function(){


    $('#configurationDropDown').select2({
        width: '100%',
        color:"black"
    });
    Session.set("progressBar",undefined)
    
    
});


  Template.leaveRequest.helpers({

    fetchTournamentPlayers: function () 
    {
      try
      {
        var tournamentId = Session.get("tournamentId");
        var playerEntriesList = global[playerEntriesLev].find({"tournamentId":tournamentId,"paidOrNot":true}).fetch();
        return playerEntriesList;

     
      }catch(e){}
    },
    "progressBar":function(){
      if(Session.get("progressBar") != undefined && Session.get("progressBar") == true)
        return true;
    },

  });

  Template.leaveRequest.events ({

    'change [name=playerList]':function(e){
      var player = e.target.value;
      if(player.trim() == "" || player == null)
         $("#impMsg").text("* Player selection required ");
      else
         $("#impMsg").text("");
    },

    'click #printLeave': function(e) 
    {
      e.preventDefault();
      var tournamentId = Session.get("tournamentId");
      var playerID = $("[name='playerList']").val(); 
      var player = $("[name='playerList'] option:selected").text();
      if(player.trim() == "--select--" || playerID.trim() == null)
      {
          $("#impMsg").text("* Player Selection required");
      }
      else
      {
        try
        { 
          var eventType ="";
          if(Router.current().params._eventType)
            eventType = Router.current().params._eventType; 
          Session.set("progressBar",true);
          Meteor.call('generate_leaveRequest',tournamentId,playerID,player,eventType,function(err, res) {
            Session.set("progressBar",undefined)
            if (err) {
            } else if (res) {
              window.open("data:application/pdf;base64, " + res);
              $( '.modal-backdrop' ).remove();
            }
          });
        }catch(e){}
      }
  }

});
