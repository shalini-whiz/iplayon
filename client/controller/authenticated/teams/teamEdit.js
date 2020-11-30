
import { TeamMembers } from './teamCreation.js'
import { PlayerTeams } from './teamCreation.js'

var arrayOFIdsPlayerEdit = []; var onlyPlayerIdsEdit = [];
var mandatoryPlayersEdit = [];

Template.teamEdit.onCreated(function() {
	this.subscribe("teamFormatForUsers");
	this.subscribe("teamForEdit",Router.current().params._PostId);
	this.searchForTeamPlayerEdit = new ReactiveVar(undefined);
    this.searchWithPlayerNumberEdit = new ReactiveVar(undefined);
    this.searchWithMAndatoryEdit = new ReactiveVar(undefined);
    this.playerNumToDelEdit = new ReactiveVar(undefined);
    this.playerIdToDelEdit = new ReactiveVar(undefined); 
    this.fecthArrayFromDb = new ReactiveVar(true); 
	var self = this;
    self.autorun(function () {
    	self.subscribe("usersForTeams", Session.get("searchingPlayerNameEdit"),Session.get("searchCriteriaForPlayerEdit"));
    });
});



Template.teamEdit.onRendered(function() {
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

	$('#scrollableLisstPLAYEREdit').slimScroll({
        height: '9.5em',
        color: 'black',
        size: '3px',
        width: '100%',
        alwaysVisible: true
    });
	arrayOFIdsPlayerEdit = Session.get("selectedPlayerNameSessEdit");
	mandatoryPlayersEdit = Session.get("mandatoryPlayersArrayEdit");
	onlyPlayerIdsEdit = Session.get("arrayOFIdsPlayerSessEdit");
	Session.set("searchingPlayerNameEdit",undefined);
    Session.set("searchCriteriaForPlayerEdit",undefined);
    teamEditValidate();
});

var nameToCollection = function(name) {
  return this[name];
}

Template.teamEdit.onDestroyed(function(){
	Session.set("selectedPlayerNameSessEdit",undefined);
    Session.set("mandatoryPlayersArrayEdit",undefined);
    Session.set("arrayOFIdsPlayerSessEdit",undefined);
    Session.set("teamMemberValidationEdit_Ses",undefined);
	arrayOFIdsPlayerEdit = [];
	mandatoryPlayersEdit = [];
	onlyPlayerIdsEdit = [];
});

Template.teamEdit.helpers({
	teamName:function(){
		try{
			var teamFind = playerTeams.findOne({"teamManager":Meteor.userId(),"_id":Router.current().params._PostId});
			if(teamFind&&teamFind.teamName){
				return teamFind.teamName
			}
		}catch(e){
		}
	},
	lTeam:function(){
		try{
			var teamFind = playerTeams.findOne({"teamManager":Meteor.userId(),"_id":Router.current().params._PostId});
			if(teamFind){
				return teamFind
			}
		}catch(e){
		}
	},
	playerCriteriasEdit:function(){
        try{
        var teamFind = playerTeams.findOne({"teamManager":Meteor.userId(),"_id":Router.current().params._PostId});
        if(teamFind&&teamFind.teamFormatId){
        	var find = teamsFormat.findOne({"_id":teamFind.teamFormatId});
        	if(find&&find.playerFormatArray){
                return find.playerFormatArray;
            }
        }
        }catch(e){

        }
    },
    GenderCriteriaEdit:function(){
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
    dobCriteriaEdit:function(){
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
    locCriteriaEdit:function(){
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
    "mandatoryCriteriaEdit":function(){
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
    "mandatoryColorEdit":function(){
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
    "selectedPlayerNameEdit":function(){
    	try{
        if(Session.get("selectedPlayerNameSessEdit")){
            var playerDet = Session.get("selectedPlayerNameSessEdit");
            var playerNumber = this.playerNo;
            for(var i=0;i<playerDet.length;i++){
                if(playerDet[i].playerNumber==playerNumber){
                    var arr = [];
                    arr.push(playerDet[i])
                    return arr
                }
            }
        }
        }catch(e){

        }
    },
    searchResultsForTeamsEdit:function(){
        try{
        var searchValue = Template.instance().searchForTeamPlayerEdit.get();
        var playerNumber = this.playerNo;
        var typingPlayerNumber = Template.instance().searchWithPlayerNumberEdit.get();
        if(typingPlayerNumber==playerNumber){
            if(searchValue!=undefined&&searchValue.length!=0 && 
                Session.get("playerDBName")){
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
    CriteriaValidOrNotTeamEdit:function(){
        try{
            var setArray = playerTeams.findOne({"_id":Router.current().params._PostId});
            var teamFormatId = "";
            var managerId = "";
            if(setArray&&setArray.teamFormatId){
                teamFormatId = setArray.teamFormatId
                managerId = setArray.teamManager;
            }
            var s = ReactiveMethod.call("teamMemberValidation",this.playerNumber,this.playerId,teamFormatId,managerId);
            if(s!=undefined)
            {
                if(s == "invalid")
                {   
                    Session.set("teamMemberValidationEdit_Ses",1);
                    return "red";
                }
                else 
                return "maroon";
            }
        }catch(e){}
    },
    requiredAffiliation:function(){
        var teamFind = playerTeams.findOne({"teamManager":Meteor.userId(),"_id":Router.current().params._PostId});
        if(teamFind&&teamFind.teamFormatId){
            var find = teamsFormat.findOne({"_id":teamFind.teamFormatId});
            if(find&&find.rankedOrNot){
                if(find.rankedOrNot=="yes"){
                    return "required"
                }
                else return false
            }
        }
    },
});

Template.teamEdit.events({
	'keyup #searchUserForTeam_Edit, change #searchUserForTeam_Edit,input #searchUserForTeam_Edit,keydown #searchUserForTeam ': function(e,template){
        e.preventDefault();
        if(e.target.value.trim().length>=3){
            template.searchForTeamPlayerEdit.set(e.target.value);
            template.searchWithPlayerNumberEdit.set(this.playerNo);
            template.searchWithMAndatoryEdit.set(this.mandatory)
            var gender_H = this.gender;
            var idOfSelec = e.target.id
            var dateType_H = this.dateType;
            var dateValue_H = this.dateValue;
            var locationType_H = this.locationType;
            var mandatory_H = this.mandatory;
            var rankedOrNot_H = "no";
            
            var teamFind = playerTeams.findOne({"teamManager":Meteor.userId(),"_id":Router.current().params._PostId});
            if(teamFind&&teamFind.teamFormatId){
                var find = teamsFormat.findOne({"_id":teamFind.teamFormatId});
                if(find&&find.rankedOrNot){
                    rankedOrNot_H = find.rankedOrNot;
                }
            }

            var data = {
                gender_HD:gender_H,
                dateType_HD:dateType_H,
                dateValue_HD:dateValue_H,
                locationType_HD:locationType_H,
                mandatory_HD:mandatory_H,
                rankedOrNot_HD:rankedOrNot_H
            }
            Session.set("searchingPlayerNameEdit",e.target.value)
            Session.set("searchCriteriaForPlayerEdit",data)
        }
        if(e.target.value.trim().length<3&&(e.keyCode == 8 ||e.keyCode == 46)){
            template.searchForTeamPlayerEdit.set(e.target.value);
            template.searchWithPlayerNumberEdit.set(this.playerNo);
            template.searchWithMAndatoryEdit.set(this.mandatory)
        }
    },
    'focus #searchUserForTeam_Edit':function(){
         $("#searchUserForTeam_Edit").text("")
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
    'click div[name=addAcademyMNM_PEdit]':function(e,template){
    	e.preventDefault();
    	try{
        if(this.userId!=undefined){
        var typingPlayerNumber = Template.instance().searchWithPlayerNumberEdit.get()
        var alreadAdded = true;
        var mandatoryValue = Template.instance().searchWithMAndatoryEdit.get();
        var valueIdToPull;
        var data = {
            playerNumber:typingPlayerNumber,
            playerId:this.userId
        }

        if(onlyPlayerIdsEdit.indexOf(data.playerId)!=-1){
        	alreadAdded = false;
        	$("#conFirmHeaderOk").text("Player already added");
            $("#confirmOkDelete").modal({
                        backdrop: 'static',
                        keyboard: false
                    });;
            return;
        }
        if(alreadAdded==true){
	        $.each(arrayOFIdsPlayerEdit, function(i){
	            if(arrayOFIdsPlayerEdit[i].playerNumber === typingPlayerNumber&&arrayOFIdsPlayerEdit[i].playerId!==data.playerId) {
	            	valueIdToPull = arrayOFIdsPlayerEdit[i].playerId;
	            	var index3 = onlyPlayerIdsEdit.indexOf(valueIdToPull)
	            	if(index3 > -1){
	            		onlyPlayerIdsEdit.splice(index3, 1);
	            	}
	                arrayOFIdsPlayerEdit.splice(i,1);
	                return false;
	            }
	        });
       
            if (_.findWhere(arrayOFIdsPlayerEdit, data) == null) {
                arrayOFIdsPlayerEdit.push(data);
            }
            if (_.findWhere(onlyPlayerIdsEdit, data.playerId) == null) {
                onlyPlayerIdsEdit.push(data.playerId);
            }
            if(mandatoryValue.trim().toLowerCase()=="yes"){
                if (_.findWhere(mandatoryPlayersEdit, typingPlayerNumber) == null) {
                    mandatoryPlayersEdit.push(typingPlayerNumber);
                }
            }
            $('[name=searchUserForTeam_Edit'+typingPlayerNumber+']').val("");
            Session.set("selectedPlayerNameSessEdit",arrayOFIdsPlayerEdit)
            Session.set("mandatoryPlayersArrayEdit",mandatoryPlayersEdit)
            Session.set("arrayOFIdsPlayerSessEdit",onlyPlayerIdsEdit)
            Session.set("teamMemberValidationEdit_Ses",undefined)
            template.searchForTeamPlayerEdit.set(undefined);
        }
        }
        }catch(e){
        }
    },
    "click [name=deleteAddedUserEdit]":function(e,template){
        try{
        e.preventDefault();
        $("#confirmModal").modal({
                        backdrop: 'static',
                        keyboard: false
                    });
        var find;
        var userId = this.playerId;
        template.playerNumToDelEdit.set($(e.target).attr('id').trim());
        template.playerIdToDelEdit.set(userId.trim());
        Meteor.call("whoisTeamMember" ,this.playerId,function(e,res){
        	if(res){
        		find = res;
        		var userName = "";
		        if(find&&find.userName){
		        	userName = find.userName
		        }
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
        	}
        });
        }catch(e){
        }
    },
    'click #yesButton': function(e, template) {
        try{
        e.preventDefault();
        var playerNum = Template.instance().playerNumToDelEdit.get();
        var userId = Template.instance().playerIdToDelEdit.get();
        var index = mandatoryPlayersEdit.indexOf(playerNum.trim());
        var index2 = onlyPlayerIdsEdit.indexOf(userId.trim());

        $.each(arrayOFIdsPlayerEdit, function(i){
            if(arrayOFIdsPlayerEdit[i].playerNumber === playerNum&&arrayOFIdsPlayerEdit[i].playerId==userId) {
                arrayOFIdsPlayerEdit.splice(i,1);
                return false;
            }
        });

        if (index > -1) {
            mandatoryPlayersEdit.splice(index, 1);
        }
		if (index2 > -1) {
            onlyPlayerIdsEdit.splice(index2, 1);
        }
        Session.set("mandatoryPlayersArrayEdit",mandatoryPlayersEdit);
        Session.set("selectedPlayerNameSessEdit",arrayOFIdsPlayerEdit);
        Session.set("arrayOFIdsPlayerSessEdit",onlyPlayerIdsEdit)
        Session.set("teamMemberValidationEdit_Ses",undefined)
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
    },
    'submit form': function(e) {
    	e.preventDefault();
    },
    'click #errorPopupClose': function(e) {
        e.preventDefault();
        $('#errorPopup').modal('hide');
    },
    'click [name=userSelectedForTeamPEdit]':function(e,template){
        var userIdProf ;
        if(this.userId){
            userIdProf = this.userId
        }
        else if(this.playerId){
            userIdProf = this.playerId
        }
        if(userIdProf){
            Meteor.call("getPlayerDetails",userIdProf,function(err,res){
                if(err){
                    result = err
                }
                else{
                    result = res;
                    Session.set("statPlayerInfo",undefined);
                    Session.set("statPlayerInfo", result);
                    $("#displayPlayerProfileEdit").empty();
                    Blaze.render(Template.statPlayerInfo, $("#displayPlayerProfileEdit")[0]);
                    $("#statPlayerInfo").modal({
                        backdrop: 'static'
                    });
                }
            });
            }
    },
});

Template.registerHelper("displayTeamProjectNAme", function(data) {
    if (data) {
    	try{
        	return teamsFormat.findOne({"_id":data}).teamFormatName
    	}catch(e){

    	}
    }
});

Template.registerHelper("checkNameForThisPlayer", function(data1,data2) {
    if (data1&&data2) {
    	try{
        	if(data1.toLowerCase()==data2.toLowerCase()){
        		return true
        	}
        	else{
        		return false
        	}
    	}catch(e){

    	}
    }
});






Template.registerHelper("userNAMeForThisId", function(data) {
    if (data) {
    	try{

    		var find = ReactiveMethod.call("whoisTeamMember" ,data);
        	if(find&&find.userName){
        		return find.userName
        	}
        	else{
        		return ""
        	}
    	}catch(e){

    	}
    }
});

var teamEditValidate = function(){
    var s = $('#teamEditForm').validate({
        rules: {
            addPlayersMandatoryEdit:{
              checkMandatoryPlayersEdit:true,
              checkForValidationTeamEdit:true,
            },
            checkAcceptbox:{
                acceptTermscond:true
            },
        },
        messages: {
            addPlayersMandatoryEdit:{
              checkMandatoryPlayersEdit:"select manatory players",
              checkForValidationTeamEdit:"Highlighted players does not match team criteria"
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
            if(Session.get("selectedPlayerNameSessEdit")==undefined){
                playersArray = []
            }
            else
                playersArray = Session.get("selectedPlayerNameSessEdit");
            var teamPlayersArray = [];
            for(var i=0;i<playersArray.length;i++){
                var playerNumber = playersArray[i].playerNumber;
                var playerId = playersArray[i].playerId;
                var playerObject = new TeamMembers(playerNumber,playerId);
                teamPlayersArray.push(playerObject);
            }
            var setArray = playerTeams.findOne({"_id":Router.current().params._PostId});
            var teamFormatId = "";
        	if(setArray&&setArray.teamMembers&&setArray.teamFormatId){
        		teamFormatId = setArray.teamFormatId
        	}
            var teamName = $("#teamName").val().trim();
            var teamManager = Meteor.userId();
            var teamOwners = $("#teamOwners").val().trim();
            var teamCoach = $("#teamCoach").val().trim();
            var teamObject = new PlayerTeams(teamFormatId,teamName,teamManager,teamPlayersArray,teamOwners,teamCoach);
            teamObject.update("myTeams",Router.current().params._PostId.trim());
            if (Session.get("previousLocationPath") !== undefined) {
                var previousPath = Session.get("previousLocationPath");
                Router.go(previousPath);
            } else {
                Router.go("myTeams")
            } 
            }catch(e){
            }
        }
    });
}

$.validator.addMethod(
    "checkMandatoryPlayersEdit",
    function(value, element, regexp) {
        try{
        var check = false;
        var setArray = playerTeams.findOne({"_id":Router.current().params._PostId});
        if(setArray&&setArray.teamMembers&&setArray.teamFormatId){
        	var find = teamsFormat.findOne({"_id":setArray.teamFormatId});
	        if(find&&find.mandatoryPlayersArray&&find.mandatoryPlayersArray.length!==0){
	            var mandPlayers = find.mandatoryPlayersArray.sort();
	            var addedPlayers = Session.get("mandatoryPlayersArrayEdit").sort();
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
    	}
    	else { 
            return true 
        }
        }catch(e){
        }
    }

);

$.validator.addMethod(
    "checkForValidationTeamEdit",function(value, element, regexp) {
        try{
            if(Session.get("teamMemberValidationEdit_Ses")==1)
                return false
            else
                return true
        } catch(e){
        }
});

