//Template helpers, events for myTeams.html
//Template is myTeams.html


Template.myTeams.onCreated(function(){
	this.subscribe("onlyLoggedIn");
	this.subscribe("organizerPlayerTeams");
	//this.subscribe("teamsFormatName");
	this.teamId = new ReactiveVar(0);
	this.subscribe("teamFormatForUsers");
	Session.set("previousLocationPath", Iron.Location.get().path);

});
Template.myTeams.onRendered(function() {
   
    $('#eventDataParent1').slimScroll({
        height: '16em',
        color: 'black',
        size: '2px',
        width: '100%'
    });
    $('#myTeams').removeClass("ip_button_DarkGrey");
    $('#myTeams').addClass("ip_button_White");
});


Template.myTeams.helpers({

    lTeam: function()
    {
        try
        {   
            var allTeams=[];
            var lLoggedInUser = Meteor.users.findOne({"_id" : Meteor.userId()});
            var lTeamLists = playerTeams.find({"teamManager":lLoggedInUser.userId}).fetch();
            var teamMemberList =  playerTeams.find({"teamMembers.playerId":{$in:[lLoggedInUser.userId]}}).fetch();
            lTeamLists = lTeamLists.concat(teamMemberList);
            lTeamLists = uniqueCity(lTeamLists);

            for (i = 0; i < lTeamLists.length; i++)
            {
                if(lTeamLists[i].teamName.length>25)
                {
                    lTeamLists[i].teamName = lTeamLists[i].teamName.substring(0,25).trim() + "..";              
                }
            }
            return lTeamLists;
        }catch(e){}
    }
});


Template.myTeams.events({
   
    'click #viewTeam':function(e)
    {
        Router.go("viewTeam", {_PostId: this._id});
    },
    'click #editTeam':function(e)
    {   
        try{
        e.preventDefault();
        var setArray = playerTeams.findOne({"_id":this._id});
        var onlyIDs=[];
        var arrayMAndPlayers = [];
        if(setArray&&setArray.teamMembers&&setArray.teamFormatId){
            var find = teamsFormat.findOne({"_id":setArray.teamFormatId});
            //if(find&&find.mandatoryPlayersArray){
                //Session.set("mandatoryPlayersArrayEdit",find.mandatoryPlayersArray);
            //}
            var teamMembers = setArray.teamMembers;
            $.each(teamMembers, function(j){
                onlyIDs.push(teamMembers[j].playerId);
                var indexOfP;
                if(find&&find.mandatoryPlayersArray){
                   indexOfP = find.mandatoryPlayersArray.indexOf(teamMembers[j].playerNumber)
                }
                if(indexOfP!==-1){
                    arrayMAndPlayers.push(teamMembers[j].playerNumber);
                }
                
            })
            Session.set("arrayOFIdsPlayerSessEdit",onlyIDs);
            Session.set("mandatoryPlayersArrayEdit",arrayMAndPlayers);
            Session.set("selectedPlayerNameSessEdit",setArray.teamMembers);
        }
        Router.go("editTeams",{_PostId:this._id});
        }catch(e){
        }
    },
    'click #deleteTeam':function(e,template)
    {
        try
        {
            e.preventDefault();
            $("#confirmModal").modal('show');
            $("#infoMsg").text("");    
            $("#yesButton").show();
     

            var teamName=this.teamName;       
            template.teamId.set(this._id);
            if(teamName.length>35)
            {
                   teamNameTrim = teamName.substring(0,35).trim() + "..";
                   $("#conFirmHeader").text("Delete ");
                   $('#conFirmHeader').append('<span id="dataConfirm">&nbsp;'+teamNameTrim+'&nbsp;</span>');
                   $('#conFirmHeader').append('<span id="questConfirm">?</span>');
            }
            else
            {
                $("#conFirmHeader").text("Delete ");
                $('#conFirmHeader').append('<span id="dataConfirm">&nbsp;'+teamName+'&nbsp;</span>');
                $('#conFirmHeader').append('<span id="questConfirm">?</span>');
            }
        }catch(e){}
    },
   
    'click #yesButton':function(e,template)
    {
        try
        {
            e.preventDefault();
            var teamId = Template.instance().teamId.get();
            Meteor.call("checkTeamEntryTour",teamId,function(error,response){
                if(response)
                {
                    Meteor.call("deleteTeam",teamId,function(error,response){
                        if(response)
                            template.teamId.set(0);                      
                    });
                    $("#confirmModal").modal('hide');   
                    $( '.modal-backdrop' ).remove();
                }
                else
                {
                    $("#infoMsg").text("Current Team has subscribed to tournaments");
                    $("#yesButton").hide();
                }
                   
            });

            
        }catch(e){}    
    },
    'click #noButton':function(e,template)
    {
        try
        {
            e.preventDefault();
            $("#confirmModal").modal('hide');   
            $( '.modal-backdrop' ).remove();
        }catch(e){}    
    },
    'click #userDropDown': function(e) {
        e.preventDefault();

        if ($("#userDropDown").hasClass("open")) {
            $("#userDropDown").removeClass("open");
            $("#userDropDown").children("ul").slideUp("fast");
        } else {
            $("#userDropDown").addClass("open");
            $("#userDropDown").children("ul").slideDown("fast");
        }
    },

});

Template.registerHelper('checkTeamFormatType',function(data)
{
    var teamFormatInfo  = teamsFormat.findOne({"_id":data.trim()});
    if(teamFormatInfo)
        return teamFormatInfo.teamFormatName;
})

Template.registerHelper('checkTeamManager', function(managerID,paramID)
{    try
    {
        if(managerID.trim() == Meteor.userId())
            return paramID;
        else       
            return paramID+"disabled";
    }catch(e){}
});


Template.registerHelper('checkTeamManager_Style', function(managerID)
{    try
    {
        if(managerID.trim() == Meteor.userId())
            return "cursor: pointer !important;";
        else       
            return "cursor: default !important;";
    }catch(e){}
});


// To find out the unique elements in an array

var uniqueCity =function (array) {
    var processed = [];
    for (var i=array.length-1; i>=0; i--){
        if (processed.indexOf(array[i]._id)<0) {
            processed.push(array[i]._id);
        } else {
            array.splice(i, 1);
        }
    }
    return array;
}