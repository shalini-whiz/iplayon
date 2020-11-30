
var dbsrequiredInd = ["playerEntries","userDetailsTT"]
var playerEntries = "playerEntries"
var userDetailsTTRec = "userDetailsTT"
//userDetailsTTUsed

  Template.receipt.onCreated(function() {


    this.subscribe("playerIndEntriesForReceipt",Router.current().params._id);
    this.subscribe("playersOfTournBasedEntries",Router.current().params._id);

    if (Router.current().params._id) {
      var tournamentId = Router.current().params._id;
      Meteor.call("changeDbNameForDraws", tournamentId,dbsrequiredInd,function(e, res) {
        if(res){
          if(res.changeDb && res.changeDb == true){
            if(res.changedDbNames.length!=0){
              playerEntries = res.changedDbNames[0]
              userDetailsTTRec = res.changedDbNames[1]

            }
          }
        }
      });
    }

        $("#configurationDropDown").select2("close");

  });

  Template.registerHelper("getPlayerName_ReceiptInd",function(data){
    try{
    if(data&&data.playerId){
        var playerName = ReactiveMethod.call("getPlayerDetailToSendReceipt",data.playerId,userDetailsTTRec);
        if(playerName&&playerName.userName)
        return playerName.userName;
    }
    }catch(e){
    }
  })


  Template.registerHelper("getPlayerName_Leave",function(data){
    if(data){
      var playerName = Meteor.users.findOne({role:"Player","_id":data}).userName;
      return playerName;
    }
  })

  Template.receipt.onRendered(function(){


    $('#configurationDropDown').select2({
        width: '100%',
        color:"black"
    });
    Session.set("progressBar",undefined)
    
    
});


  Template.receipt.helpers({
 
    fetchTournamentPlayers: function () 
    {
      var tournamentId = Session.get("tournamentId");
      arr=[]
      var playerEntriesList = global[playerEntries].find({"tournamentId":tournamentId,"paidOrNot":true}).fetch();
      return playerEntriesList;
    },
    "progressBar":function(){
      if(Session.get("progressBar") != undefined && Session.get("progressBar") == true)
        return true;
    },

  });

  Template.receipt.events ({

    'change [name=playerList]':function(e){
      var player = e.target.value;
      if(player.trim() == "" || player == null)
         $("#impMsg").text("* Player selection required ");
      else
         $("#impMsg").text("");
    },

    'click #printReceipt': function(e) 
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
        var eventType ="";
        if(Router.current().params._eventType)
          eventType = Router.current().params._eventType;
        Session.set("progressBar",true)
        Meteor.call('generate_receipt',tournamentId,playerID,player,eventType,function(err, res) {
          Session.set("progressBar",undefined)
          if (err) {
          } else if (res) {
            window.open("data:application/pdf;base64, " + res);
            $( '.modal-backdrop' ).remove();
          }
        });
      }
    }
});

var dbsrequiredteam = ["playerTeamEntries","userDetailsTT"]
var playerTeamEntries = "playerTeamEntries"
var userDetailsTTRecTeam = "userDetailsTT"

Template.receiptForTeams.onCreated(function() {
    this.subscribe("playerTeamEntriesForReceipt",Session.get("tournamentId"))
    this.subscribe("playersOfTournBasedEntries",Router.current().params._id);

    if (Router.current().params._id) {
      var tournamentId = Router.current().params._id;
      Meteor.call("changeDbNameForDraws", tournamentId,dbsrequiredteam,function(e, res) {
        if(res){
          if(res.changeDb && res.changeDb == true){
            if(res.changedDbNames.length!=0){
              playerTeamEntries = res.changedDbNames[0]
              userDetailsTTRecTeam = res.changedDbNames[1]

            }
          }
        }
      });
    }
            $("#configurationDropDown").select2("close");

  });

  Template.registerHelper("getPlayerName_ReceiptTeam",function(data){
    if(data&&data.playerId){
      if(playerTeamEntries == "playerTeamEntries"){
        var playerName = ReactiveMethod.call("getPlayerDetailToSendReceipt",data.playerId,userDetailsTTRecTeam);
        if(playerName&&playerName.userName)
          return playerName.userName;
      } else if(playerTeamEntries == "schoolPlayerTeamEntries"){
        var schoolInfo = ReactiveMethod.call("getSchoolDetailForTeamSendReceipt",data.schoolId);
        if(schoolInfo&&schoolInfo.schoolName){
          return schoolInfo.schoolName
        }
      }
    }
  })


  Template.receiptForTeams.onRendered(function(){

    $('#configurationDropDown').select2({
        width: '100%',
        color:"black"
    });
    Session.set("progressBar",undefined)
    
  });

  Template.receiptForTeams.helpers({
 
    fetchTournamentPlayers: function () 
    {
      var tournamentId = Session.get("tournamentId");
      var arr=[]
      var playerEntriesList = global[playerTeamEntries].find({"tournamentId":tournamentId,"paidOrNot":true}).fetch();
      return playerEntriesList;
    },
    "progressBar":function(){
      if(Session.get("progressBar") != undefined && Session.get("progressBar") == true)
        return true;
    },

  });

  Template.receiptForTeams.events ({

    'change [name=playerList]':function(e){
      var player = e.target.value;
      if(player.trim() == "" || player == null)
         $("#impMsg").text("* Player selection required ");
      else
         $("#impMsg").text("");
    },

    'click #printReceipt': function(e) 
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
        var eventType ="";
        if(Router.current().params._eventType)
          eventType = Router.current().params._eventType;
        Session.set("progressBar",true)
        Meteor.call('generate_receiptForTeam',tournamentId,playerID,player,eventType,function(err, res) {
          Session.set("progressBar",undefined)
          if (err) {
          } else if (res) {
            window.open("data:application/pdf;base64, " + res);
            $( '.modal-backdrop' ).remove();
          }
        });
      }
    }
});