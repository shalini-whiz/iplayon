//class
export const TeamMembers = function(playerNumber,playerId){
    this.playerNumber = playerNumber;
    this.playerId = playerId;
}

export const PlayerTeams = function(teamFormatId,teamName,teamManager,teamPlayersArray,teamOwners,teamCoach)
{
  this.teamFormatId = teamFormatId;
  this.teamName = teamName;
  this.teamManager = teamManager;
  this.teamPlayersArray = teamPlayersArray;
  this.teamOwners = teamOwners;
  this.teamCoach = teamCoach;

  this.save = function(routeValue){
      var data = {
        teamFormatId:this.teamFormatId,
        teamName:this.teamName,
        teamManager:this.teamManager,
        teamMembers:this.teamPlayersArray,
        "teamOwners":this.teamOwners,
        "teamCoach":this.teamCoach
      }
      var result;
      Meteor.call("saveNewTeamData",data,function(err,res){
        if(err){
            result = err
        }
        else{
            result = res;
            return true;
        }
      });
  };
  this.update = function(routeValue,teamId)
  {
    var data = {
        teamFormatId:this.teamFormatId,
        teamName:this.teamName,
        teamManager:this.teamManager,
        teamMembers:this.teamPlayersArray,
        "teamOwners":this.teamOwners,
        "teamCoach":this.teamCoach

    }
    var result;
    Meteor.call("updatePlayerTeam",data,teamId,function(err,res){
        if(err){
            result = err
        }
        else{
            result = res;
            return true;
        }
    });
  };
}

Template.teamCreation.onCreated(function() {
    this.subscribe("teamFormatForUsers");    
    this.searchForTeamPlayer = new ReactiveVar(undefined);
    this.searchWithPlayerNumber = new ReactiveVar(undefined);
    this.searchWithMAndatory = new ReactiveVar(undefined);
    this.playerNumToDel = new ReactiveVar(undefined);
    this.playerIdToDel = new ReactiveVar(undefined); 
    var self = this;
    self.autorun(function () {
     self.subscribe("usersForTeams", Session.get("searchingPlayerName"),Session.get("searchCriteriaForPlayer"));
    });
});

var arrayOFIdsPlayer = []; var onlyPlayerIds = []; 
var mandatoryPlayers = [];

Template.teamCreation.onRendered(function() {
    Meteor.call("getSportsMainDB",false,function(e,res){
        if(res != undefined && res != null && res != false){
            toRet = res
            Session.set("playerDBName",toRet)
        }
        else if(res != undefined && res != null && res == 2){
            toRet = false
            displayMessage("select sport first")
            Session.set("playerDBName",toRet)
        }
        else if(e){
            toRet = false
            Session.set("playerDBName",toRet)
        }
    })

    $('#scrollableLisstPLAYER').slimScroll({
        height: '9.5em',
        color: 'black',
        size: '3px',
        width: '100%',
        alwaysVisible: true
    });
    $('#projectName').select2({
        width: "495",
        selectOnClose: true,
        cursor:"pointer"
    });
    $(".select2-selection__rendered").removeAttr('title');
    $('b[role="presentation"]').hide();
    Session.set("selectedTeamFormatId",undefined)
    Session.set("playerNumberForData",undefined)
    Session.set("playerNumberSess",undefined)
    arrayOFIdsPlayer = [];
    arrayOFIdsPlayerIds = [];
    mandatoryPlayers = [];
    onlyPlayerIds = [];
    teamCreationValidate();
    Session.set("searchingPlayerName",undefined);
    Session.set("searchCriteriaForPlayer",undefined);
    Session.set("selectedPlayerNameSess",undefined);
    Session.set("arrayOFIdsPlayerSess",undefined);
    Session.set("mandatoryPlayersArray",undefined)
});

var nameToCollection = function(name) {
  return this[name];
}

Template.teamCreation.helpers({
    lProjectName: function() {
        try{
        var lProjectNames = teamsFormat.find({}).fetch();
        if (lProjectNames) {
            return lProjectNames;
        }
        }catch(e){

        }
    },
    playerCriterias:function(){
        try{
        if(Session.get("selectedTeamFormatId")!==undefined){
            var find = teamsFormat.findOne({"_id":Session.get("selectedTeamFormatId")});
            if(find&&find.playerFormatArray){
                return find.playerFormatArray;
            }
        }
        }catch(e){

        }
    },
    GenderCriteria:function(){
        try{
        var gender_H = this.gender;
        var mandatory_H = this.mandatory;
        var stringToDisp = "";
        var gender_H_D = "";
        var mandatory_H_D;
        if(gender_H.toLowerCase()=="male"){
            gender_H_D = "Male"+" ";
        }
        else if(gender_H.toLowerCase()=="female"){
            gender_H_D = "Female"+" ";
        }
        if(gender_H.toLowerCase()=="any"){
            gender_H_D = "Any";
        }
        stringToDisp = gender_H_D;
        return stringToDisp;
        }catch(e){
        }
    },
    dobCriteria:function(){
        try{
        var dateType_H = this.dateType;
        var dateValue_H = moment(new Date(this.dateValue)).format("DD MMM YYYY");
        var dateType_H_D = "";
        var stringToDisp = "";
        if(dateType_H.toLowerCase()=="onbefore"){
            dateType_H_D = "on or before "+dateValue_H
        }
        else if(dateType_H.toLowerCase()=="before"){
            dateType_H_D = "before "+dateValue_H
        }
        else if(dateType_H.toLowerCase()=="onafter"){
            dateType_H_D = "on or after "+dateValue_H
        }
        else if(dateType_H.toLowerCase()=="after"){
           dateType_H_D = "after "+dateValue_H
        }
        else if(dateType_H.toLowerCase()=="any"){
            dateType_H_D = "any"
        }
        stringToDisp = dateType_H_D;
        return stringToDisp;
        }catch(e){
        }
    },
    locCriteria:function(){
        try{
            var locationType_H = this.locationType;
            if(locationType_H.toLowerCase()=="imported"){
                locationType_H_D = "imported"+" "
            }
            else if(locationType_H.toLowerCase()=="local"){
                locationType_H_D = "local"+" "
            }
            else if(locationType_H.toLowerCase()=="any"){
                locationType_H_D = "any";
            }
            stringToDisp = locationType_H_D;
            return stringToDisp;
        }catch(e){
        }
    },
    requiredAffiliation:function(){
        var find = teamsFormat.findOne({"_id":Session.get("selectedTeamFormatId")});
        if(find&&find.rankedOrNot){
            if(find.rankedOrNot=="yes"){
                return "required"
            }
            else return false
        }
    },
    "mandatoryCriteria":function(){
        try{
        var mandatory_H = this.mandatory;
        if(mandatory_H.toLowerCase()=="yes"){
            return "*"
        } 
        else if(mandatory_H.toLowerCase()=="no"){
            return " "+""
        }
        }catch(e){

        }
    },
    "mandatoryColor":function(){
        try{
        var mandatory_H = this.mandatory;
        if(mandatory_H.toLowerCase()=="yes"){
            return "maroon;"
        } 
        else if(mandatory_H.toLowerCase()=="no"){
            return "black;"
        }
        }catch(e){

        }
    },
    searchResultsForTeams:function(){
        try{
        var searchValue = Template.instance().searchForTeamPlayer.get();
        var playerNumber = this.playerNo;
        var typingPlayerNumber = Template.instance().searchWithPlayerNumber.get();
        if(typingPlayerNumber==playerNumber && Session.get("playerDBName")){
            if(searchValue!=undefined&&searchValue.length!=0){
                var search="";
                search = nameToCollection(Session.get("playerDBName")).find({}).fetch();
                if(search.length!=0){
                    return search;
                }
                else if(searchValue&&search.length==0){
                    var x=[];
                    data={
                        _id:0,
                        userName:"No Results"
                    }
                    x.push(data)
                    return x
                }
            }
        }
        }catch(e){
        }
    },
    "selectedPlayerName":function(){
        if(Session.get("selectedPlayerNameSess")){
            var playerDet = Session.get("selectedPlayerNameSess");
            var playerNumber = this.playerNo;
            for(var i=0;i<playerDet.length;i++){
                if(playerDet[i].playerNumber==playerNumber){
                    var arr = [];
                    arr.push(playerDet[i])
                    return arr
                }
            }
        }
    }
});

Template.teamCreation.events({
    "change #projectName":function(e,template){
        e.preventDefault();
        var selectedId = $("#projectName").children(":selected").attr("id");
        if ($("#projectName").valid()) {
            $('#projectName + .select2-container--default .select2-selection--single .select2-selection__rendered').css('color', 'white');
        }
        if(selectedId.trim().length!=0){
            Session.set("selectedTeamFormatId",selectedId);
            Session.set("playerNumberForData",undefined)
            Session.set("playerNumberSess",undefined)
            Session.set("searchingPlayerName",undefined);
            Session.set("searchCriteriaForPlayer",undefined);
            Session.set("selectedPlayerNameSess",undefined);
            Session.set("arrayOFIdsPlayerSess",undefined);
            Session.set("mandatoryPlayersArray",undefined);
            template.playerNumToDel.set(undefined);
            template.searchForTeamPlayer.set(undefined);
            template.searchWithPlayerNumber.set(undefined);
            template.searchWithMAndatory.set(undefined);
            template.playerIdToDel.set(undefined);
            Session.set("arrayOFIdsPlayerSess",undefined);
            arrayOFIdsPlayer = [];
            arrayOFIdsPlayerIds = [];
            mandatoryPlayers = [];
            onlyPlayerIds = [];
            $('[name^=searchUserForTeam]').val("");
        }
    },
    'submit form': function(e) {
        e.preventDefault();
    },
    'click #errorPopupClose': function(e) {
        e.preventDefault();
        $('#errorPopup').modal('hide');
    },
    "click #addCoach":function(e){

    },
    'keyup #searchUserForTeam, change #searchUserForTeam,input #searchUserForTeam,keydown #searchUserForTeam ': function(e,template){
        e.preventDefault();
        if(e.target.value.trim().length>=3){
            template.searchForTeamPlayer.set(e.target.value);
            template.searchWithPlayerNumber.set(this.playerNo);
            template.searchWithMAndatory.set(this.mandatory)
            var gender_H = this.gender;
            var idOfSelec = e.target.id
            var dateType_H = this.dateType;
            var dateValue_H = this.dateValue;
            var locationType_H = this.locationType;
            var mandatory_H = this.mandatory;
            var rankedOrNot_H = "no";
            
            var find = teamsFormat.findOne({"_id":Session.get("selectedTeamFormatId")});
            if(find&&find.rankedOrNot){
                rankedOrNot_H = find.rankedOrNot;
            }

            var data = {
                gender_HD:gender_H,
                dateType_HD:dateType_H,
                dateValue_HD:dateValue_H,
                locationType_HD:locationType_H,
                mandatory_HD:mandatory_H,
                rankedOrNot_HD:rankedOrNot_H
            }
            Session.set("searchingPlayerName",e.target.value)
            Session.set("searchCriteriaForPlayer",data)
        }
        if(e.target.value.trim().length<3&&(e.keyCode == 8 ||e.keyCode == 46)){
            template.searchForTeamPlayer.set(e.target.value);
            template.searchWithPlayerNumber.set(this.playerNo);
            template.searchWithMAndatory.set(this.mandatory)
        }
    },
    'focus #searchUserForTeam':function(){
         $("#searchUserForTeam").text("")
    },
    'mouseover p[name=userName]':function(e){
        $("#searchUserManage_P").text("")
        if(e.target.id!=0)
        $("#"+e.target.id).css("color", "green");
    },
    'mouseout p[name=userName]':function(e){
        $("#searchUserManage_P").text("")
        if(e.target.id!=0)
        $("#"+e.target.id).css("color", "rgb(56,56,56)");
    },
    'click div[name=addAcademyMNM_P]':function(e,template){
        try{
        e.preventDefault();
        if(this.userId!=undefined){
        var typingPlayerNumber = Template.instance().searchWithPlayerNumber.get()
        var alreadAdded = true;
        var mandatoryValue = Template.instance().searchWithMAndatory.get();
        var valueIdToPull;
        var data = {
            playerNumber:typingPlayerNumber,
            userName:this.userName,
            userId:this.userId
        }
        if(onlyPlayerIds.indexOf(data.userId)!=-1){
            alreadAdded = false;
            $("#conFirmHeaderOk").text("Player already added");
            $("#confirmOkDelete").modal({
                            backdrop: 'static',
                            keyboard: false
                        });;
            return;
        }
        if(alreadAdded==true){
            $.each(arrayOFIdsPlayer, function(i){
                if(arrayOFIdsPlayer[i].playerNumber === typingPlayerNumber&&arrayOFIdsPlayer[i].userId!==data.userId) {
                    valueIdToPull = arrayOFIdsPlayer[i].userId;
                    var index3 = onlyPlayerIds.indexOf(valueIdToPull)
                    if(index3 > -1){
                        onlyPlayerIds.splice(index3, 1);
                    }
                    arrayOFIdsPlayer.splice(i,1);
                    return false;
                }
            });
            /*$.each(arrayOFIdsPlayer, function(i){
                if(arrayOFIdsPlayer[i].playerNumber === typingPlayerNumber&&arrayOFIdsPlayer[i].userId!==data.userId) {
                    arrayOFIdsPlayer.splice(i,1);
                    return false;
                }
                else if(arrayOFIdsPlayer[i].playerNumber !== typingPlayerNumber&&arrayOFIdsPlayer[i].userId==data.userId){
                    $("#conFirmHeaderOk").text("Player already added");
                    $("#confirmOkDelete").modal('show');
                    alreadAdded = false
                    return;
                }
            });*/

            if (_.findWhere(arrayOFIdsPlayer, data) == null) {
                arrayOFIdsPlayer.push(data);
            }

            if (_.findWhere(onlyPlayerIds, data.userId) == null) {
                onlyPlayerIds.push(data.userId);
            }

            if(mandatoryValue.trim().toLowerCase()=="yes"){
                if (_.findWhere(mandatoryPlayers, typingPlayerNumber) == null) {
                    mandatoryPlayers.push(typingPlayerNumber);
                }
            }

            $('[name=searchUserForTeam'+typingPlayerNumber+']').val("");
            Session.set("selectedPlayerNameSess",arrayOFIdsPlayer)
            Session.set("mandatoryPlayersArray",mandatoryPlayers)
            Session.set("arrayOFIdsPlayerSess",onlyPlayerIds)
            template.searchForTeamPlayer.set(undefined);
        }
        }
        }catch(e){
        }
    },
    'click [name=userSelectedForTeamP]':function(e,template){
        if(this.userId){
            Meteor.call("getPlayerDetails",this.userId,function(err,res){
                if(err){
                    result = err
                }
                else{
                    result = res;
                    Session.set("statPlayerInfo",undefined);
                    Session.set("statPlayerInfo", result);
                    $("#displayPlayerProfile").empty();
                    Blaze.render(Template.statPlayerInfo, $("#displayPlayerProfile")[0]);
                    $("#statPlayerInfo").modal({
                        backdrop: 'static'
                    });
                }
            });
        }
    },
    "click [name=deleteAddedUser]":function(e,template){
        try{
        e.preventDefault();
        $("#confirmModal").modal({
            backdrop: 'static'
        });
        var userName = this.userName;
        var userId = this.userId
        template.playerNumToDel.set($(e.target).attr('id').trim());
        template.playerIdToDel.set(userId.trim());
        $("#conFirmHeader").text("Delete");
        if (userName.toString().length >= 35) {
            userName = eventId.toString().substring(0, 35).trim() + "..";
            $('.modal-sm').css("width", "342px");
            $('.confirmPopup').css("width", "342px");
        } else {
            $('.modal-sm').css("width", "242px");
            $('.confirmPopup').css("width", "242px");
        }
        $('#conFirmHeader').append('<span id="dataConfirm">&nbsp;' + userName + '&nbsp;</span>');
        $('#conFirmHeader').append('<span id="questConfirm">?</span>');
        }catch(e){
        }
    },
    'click #yesButton': function(e, template) {
        try{
        e.preventDefault();
        var playerNum = Template.instance().playerNumToDel.get();
        var userId = Template.instance().playerIdToDel.get();
        var index = mandatoryPlayers.indexOf(playerNum.trim());
        var index2 = onlyPlayerIds.indexOf(userId.trim())

        $.each(arrayOFIdsPlayer, function(i){
            if(arrayOFIdsPlayer[i].playerNumber === playerNum&&arrayOFIdsPlayer[i].userId==userId) {
                arrayOFIdsPlayer.splice(i,1);
                return false;
            }
        });

        if (index > -1) {
            mandatoryPlayers.splice(index, 1);
        }
        if (index2 > -1) {
            onlyPlayerIds.splice(index2, 1);
        }
        Session.set("mandatoryPlayersArray",mandatoryPlayers);
        Session.set("selectedPlayerNameSess",arrayOFIdsPlayer);
        Session.set("arrayOFIdsPlayerSess",onlyPlayerIds)
        $("#confirmModal").modal('hide');
        $('.modal-sm').css("width", "300px");
        $('.confirmPopup').css("width", "300px");
        }catch(e){
        }
    },
    'click #noButton': function(e) {
        e.preventDefault();
        $("#confirmModal").modal('hide');
        $('.modal-sm').css("width", "300px");
        $('.confirmPopup').css("width", "300px");
    },
    'click #cancel':function(e){
        e.preventDefault();
        if (Session.get("previousLocationPath") !== undefined) {
            var previousPath = Session.get("previousLocationPath");
            Session.set("previousLocationPath", undefined);
            Session.set("previousLocationPath", null);
            Router.go(previousPath);
        } else {
            Router.go("/myTeams");
        }
    }
});

Template.registerHelper("getSlNoPlayerTeam", function(data) {
    if (data) {
        return data.replace(/\D/g,'');
    }
});

var teamCreationValidate = function(){
    var s = $('#teamCreationForm').validate({
        rules: {
            teamNameCreate: {
                required: true,
                minlength: 5,
                maxlength: 40,
                whiteSpace : /\S/
            },
            projectName: {
                required: true,
            },
            addPlayersMandatory:{
              checkMandatoryPlayers:true
            },
            checkAcceptbox:{
                acceptTermscond:true
            },
        },
        messages: {
            teamNameCreate: {
                required: "Please enter the team name.",
                minlength: "Team name should contain atleast 5 characters",
                maxlength: "Team name should be within 30 characters",
                whiteSpace: "Team Name is not valid",
            },
            projectName: {
                required: "Please select the team type",
            },
            addPlayersMandatory:{
              checkMandatoryPlayers:"select manatory players"
            },
            checkAcceptbox:{
                acceptTermscond:"Please accept terms & conditions"
            },
        },
        errorContainer: $('#errorContainer'),
        errorLabelContainer: $('#errorContainer ul'),
        wrapper: 'li',
        invalidHandler: function(form, validator, element) {
            var elem = $(element);//set error element
            var errors = s.numberOfInvalids();
            //if there are errors open errorPopup modal
            if (errors) $('#errorPopup').modal({
                backdrop: 'static',keyboard: false
            });
            //set colors, on error of rulesAndReg, projectName and domainName
            for (var i = 0; i < validator.errorList.length; i++) {
                var q = validator.errorList[i].element;
                if (q.name === 'projectName') {
                    $('#projectName + .select2-container--default .select2-selection--single .select2-selection__rendered').css('color', 'red');
                }
            }
        },
        submitHandler: function(event) {
            try{
            var playersArray = []
            if(Session.get("selectedPlayerNameSess")==undefined){
                playersArray = []
            }
            else
                playersArray = Session.get("selectedPlayerNameSess"); 
            var teamPlayersArray = [];
            for(var i=0;i<playersArray.length;i++){
                var playerNumber = playersArray[i].playerNumber;
                var playerId = playersArray[i].userId;
                var playerObject = new TeamMembers(playerNumber,playerId);
                teamPlayersArray.push(playerObject);
            }
            var teamFormatId = Session.get("selectedTeamFormatId").trim()
            var teamName = $("#teamNameCreate").val().trim();
            var teamOwners = $("#teamOwners").val().trim();
            var teamCoach = $("#teamCoach").val().trim();
            var teamManager = Meteor.userId();
            var teamObject = new PlayerTeams(teamFormatId,teamName,teamManager,teamPlayersArray,teamOwners,teamCoach);
            
            teamObject.save("myTeams");
            if (Session.get("previousLocationPath") !== undefined) {
                var previousPath = Session.get("previousLocationPath");
                Router.go(previousPath);
            } else {
                Router.go("/upcomingEvents")
            } 
            }catch(e){
            }
        }
    });
}


$.validator.addMethod(
    "checkMandatoryPlayers",
    function(value, element, regexp) {
        try{
        var check = false;
        var find = teamsFormat.findOne({"_id":Session.get("selectedTeamFormatId")});
        if(find&&find.mandatoryPlayersArray&&find.mandatoryPlayersArray.length!=0){
            var mandPlayers = find.mandatoryPlayersArray.sort();
            var addedPlayers = Session.get("mandatoryPlayersArray").sort();
            if(mandPlayers.length !== addedPlayers.length){
                return false;
            }
            if(mandPlayers.length!=0){
                for(var i = mandPlayers.length; i--;) {
                    if(mandPlayers[i] !== addedPlayers[i]){
                        return false;
                    }
                    else{
                        if(i==0){
                            if(mandPlayers[i] !== addedPlayers[i]){
                                return false;
                            } 
                            else{
                                return true
                            }
                        }
                    }
                }
            }
            else{
                return true
            }
        }
        else{ 
            return true
        }
        }catch(e){
        }
    }

);