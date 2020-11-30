  Template.certificate_RR.onCreated(function() {
        $("#configurationDropDown").select2("close");
  });
  
  Template.certificate_RR.onRendered(function(){
    $('#configurationDropDown').select2({
        width: '100%',
        color:"black"
    });
    Session.set("progressBar",undefined);

  });


  Template.certificate_RR.helpers({
    thiss:function(){
      if(Session.get("eventName"))
        return Session.get("eventName");
      else
        return "Select Event"
    },

    selectedSportOrNot:function(){
      if(Session.get("selectedSportFromLive")!==undefined&&Session.get("selectedSportFromLive")!==null){
        if(Session.get("selectedSportFromLive")===0){
          return false
        }
        else return true
      }
    },

    tourIdDraws:function(){
      return Router.current().params._id;
    },

    eventName: function (){
      return (Session.get("eventName"))
    },
    "progressBar":function(){
      if(Session.get("progressBar") != undefined && Session.get("progressBar") == true)
        return true;
    },
    certificateEvents:function()
    {
      try
      {
        if(Session.get("selectedSportFromLive")!=undefined&&
          Session.get("selectedSportFromLive")!=null){
          if(Session.get("selectedSportFromLive")!==0){
            Session.set("eventName", Session.get("selectedSportFromLive").trim());
            Session.set("showDraws", true);
          }
        }
      }catch(e){}

      try
      {
        var sport = Session.get("selectedSport");
        if(Session.get("uploadedDraws") != undefined)
          return Session.get("uploadedDraws");
      }catch(e){}
    }
  });


  Template.certificate_RR.events ({

    "click #certificate_event": function (event, template) {
      event.preventDefault();
      var selectedEvent = event.target.value;
      var tournamentId = Session.get("tournamentId"); 
      var eventType ="";
      if(Router.current().params._eventType)
        eventType = Router.current().params._eventType;



      Meteor.call("fetchPlayers", tournamentId, selectedEvent, eventType,function (error, result) {

        if (error) {
        }
        else 
        {
          var optionHTML = "<option value='' selected disabled>--select--</option>";
          if(result.length > 0)
          {
            for(var i=0;i< result.length;i++)
            {
              if(result[i].roundName != "Winner")
                  optionHTML +="<option value="+result[i].playerID+">"+result[i].playerName+"</option>";
            }
          }
          $("[name='certificatePlayerList']").html(optionHTML);
        }
      });
    },

    'click #printCertificate': function(e) 
    {
        e.preventDefault();
        var playerID = $("[name='certificatePlayerList']").val(); 
        var player = $("[name='certificatePlayerList'] option:selected").text();
        var selectedEvent = $("[name='certificateEventList']").val(); 
        var tournamentId = Session.get("tournamentId");
        if(selectedEvent == null)
          $("#impMsg").text("* Event Selection required");

        else if(player.trim() == "--select--" || playerID.trim() == null)
          $("#impMsg").text("* Player Selection required");
   
        else
        {
          try
          {
            var eventType ="";
            if(Router.current().params._eventType)
              eventType = Router.current().params._eventType;
            Session.set("progressBar",true);

            Meteor.call('generate_certificate_RR',tournamentId,selectedEvent,playerID,player,eventType,function(err, res) {
              Session.set("progressBar",undefined);

              if (err) {
              } else if (res) {
                window.open("data:application/pdf;base64, " + res);
                $( '.modal-backdrop' ).remove();
              }
            })
          }catch(e){

          }
        }
    }
  });


