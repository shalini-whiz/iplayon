//Template helpers, events for template teamMultiSubscribePopup.html
//which is included in myEvents.html

/**
 * @Author Vinayashree
 */
/**
 * client side subscription to the server side publications
 * @SubscribeName: teams (used to subscribe to teams)
 *                 to get the list of teams.
 * @SubscribeName: projects(used to subscribe to projects)
 *                 to get the list of projects.
 * @SubscribeName: users (used to subscribe to users)
 *                 to get the list of users.
 *
 */
Template.teamMultiSubscribePopup.onCreated(function(){
	this.subscribe("onlyLoggedIn");
    this.subscribe("onlyLoggedInALLRoles")
    this.subscribe("teamsOfUserBasedOnTeamType");
    this.subscribe("teamFormatForUsers");
	//this.subscribe("projects");
	//this.subscribe("users");
});

/**
 * On rendered of template teamMultiSubscribePopup.html initialize css bootstrap
 * slimScroll for teams list div to scroll
 */
Template.teamMultiSubscribePopup.onRendered(function(){

    Session.set("teamMemberValidation_Ses",undefined);
	/*$('#selectMainTag').slimScroll({
		height: '8em',
		color: 'black',
		size: '3px',
		width: '100%'
	});*/
	$("#teamMultiSubscribePopup").on('show.bs.modal', function(event) {
		$(".teamSubscribeMainTitle").scrollTop(0);;
		$('.modal-content').scrollTop(0);
	});
	$("#teamMultiSubscribePopup").on('hide.bs.modal', function(event) {
		$(".teamSubscribeMainTitle").scrollTop(0);;
		$('.modal-content').scrollTop(0);
		Session.set("checkedEventForTeamSel",undefined);
		Session.set("checkedTeamForEvent",undefined);
		Session.set("che",undefined);
	});
	
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
            displayMessage(e)
        }
    })

});

var nameToCollection = function(name) {
  return this[name];
};
/**
 * template helpers which connects teamMultiSubscribePopup.html
 * @methodName : lTeams is a function to find teams
 */
Template.teamMultiSubscribePopup.helpers({
     lEventid: function() {
        return Router.current().params._PostId;

    },
	/*
	 * get the eventId using router parameters,
	 * find the type of event (individual=1 or team!=1)
	 * find the teams for Meteor.userId as owner of team
	 * and type of project of that team
	 * if teams fetched matches with eventType return the teams
	 */
	"lTeams":function(){
		try{
            if(Session.get("playerDBName")){
		var eventId = Router.current().params._PostId;
		var eveType = events.findOne({"_id":eventId});
		var teamList;
		//change
		//var eveTourType = events.findOne({"_id":eveType.tournamentId.toString()})
		var userId = nameToCollection(Session.get("playerDBName")).findOne({"userId":Meteor.userId().toString()})
		if(userId&&userId.userId&&Session.get("eventIdOFSelectedTeamEvent")!=undefined&&Session.get("eventIdOFSelectedTeamEvent")!=null)
			teamList = playerTeams.find({"teamManager":userId.userId.toString(),teamFormatId:Session.get("eventIdOFSelectedTeamEvent").trim().toString()}).fetch();
	 	if(teamList){
	 		if(teamList.length==2){
	 			/*$('#selectMainTag').slimScroll({
					height: '5.5em',
					color: 'black',
					size: '3px',
					width: '100%'
				});*/
	 		}
	 		if(teamList.length==1){
	 			/*$('#selectMainTag').slimScroll({
					height: '2.7em',
					color: 'black',
					size: '3px',
					width: '100%'
				});*/
	 		}
	 		return teamList;
	 	}
     }
	 }catch(e){}
	},
	"selectedPlayerNameEdit":function(){
		try{
			if(Session.get("TeamCheckedSession")){
				var selectedTeamID = Session.get("TeamCheckedSession")
				if(selectedTeamID){
					var players = playerTeams.findOne({"_id":selectedTeamID});
					if(players&&players.teamMembers){
						return players.teamMembers
					}
				}
			}	
		}catch(e){
		}
	},
	playerCriteriasEdit:function(){
        try{
        if(Session.get("eventIdOFSelectedTeamEvent")!==undefined){
            var find = teamsFormat.findOne({"_id":Session.get("eventIdOFSelectedTeamEvent")});
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
            return "black;"
        } 
        else if(mandatory_H.toLowerCase()=="no"){
            return "black;"
        }
        }catch(e){

        }
    },
    requiredAffiliation:function(){
        var find = teamsFormat.findOne({"_id":Session.get("eventIdOFSelectedTeamEvent")});
        if(find&&find.rankedOrNot){
            if(find.rankedOrNot=="yes"){
                return "required"
            }
            else return false
        }
    },
    CriteriaValidOrNot:function(){
    	try{
    		var s = ReactiveMethod.call("teamMemberValidation",this.playerNumber,this.playerId,Session.get("eventIdOFSelectedTeamEvent"),Meteor.userId().toString())
    		if(s!=undefined)
            {
	    		if(s == "invalid")
                {
	                Session.set("teamMemberValidation_Ses",1);
	                return "red"
	            }
	            else 
	    		return "black";
    		}
    	}catch(e){}
    },
    MandatoryValidationPlayers:function(){
    	if(Session.get("TeamCheckedSession")&&Session.get("eventIdOFSelectedTeamEvent")){
    		var test = ReactiveMethod.call("MandatoryValidationMethod",Session.get("TeamCheckedSession"),Session.get("eventIdOFSelectedTeamEvent"));
    		if(test)
    			return true
    		else
    			return false
    	}
    },
    validationMsg:function()
    {
        try{
            if(Session.get("teamMemberValidation_Ses") != undefined)
                return true;
            else
                return false;
        }catch(e){}
    }
});
Template.teamMultiSubscribePopup.events({


});

Template.registerHelper('teamNameCheckSubString', function(d) {
	try{

	var data = playerTeams.findOne({
		"_id": d.toString()
	});
	//if the string is more than length of 42 characters add ..
	if (data.teamName.toString().length >= 45) {
		$(".selectTeamSubsPopup").css("width", "424px");
		$(".subTeamSubsModal-sm").css("width", "424px")
		data = data.teamName.toString().substring(0, 45).trim() + "..";
		return data;
	} else {
		return data.teamName.toString()
	};
	}catch(e){
	}

});

Template.registerHelper('checkForThisPlayerNumber', function(d1,d2) {
	if(d1==d2){
		return true
	}
});