Template.viewTeam.onCreated(function() {
   this.subscribe("organizerPlayerTeams");
   this.subscribe("teamsFormatName");
   this.subscribe("domains");

});


Template.viewTeam.onRendered(function() {

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

	$('#scrollableLisstPLAYER_View').slimScroll({
        height: '9.5em',
        color: 'black',
        size: '3px',
        width: '100%'
    });

	
});


var nameToCollection = function(name) {
  return this[name];
}

Template.viewTeam.helpers({

	"viewTeamInfo":function()
	{
		try
		{
			var gRouteParameter = Router.current().params._PostId;
	        var playerTeamInfo  = playerTeams.findOne({"_id": Router.current().params._PostId});
	        if(playerTeamInfo)
	        {
				var teamFormatInfo  = teamsFormat.findOne({"_id":playerTeamInfo.teamFormatId});
				if(teamFormatInfo)
					playerTeamInfo.teamFormatName = teamFormatInfo.teamFormatName;
	        	return playerTeamInfo;
	        }
    	}catch(e){}          
	},
	playerCriterias:function()
	{
        try
        {
			var teamInfo = ReactiveMethod.call("fetchTeamDetails",Router.current().params._PostId);
	       	return teamInfo;
        }catch(e){}
    },
    "mandatoryCriteria":function()
    {
        try{
	        var mandatory_H = this.criteria.mandatory;
	        if(mandatory_H.toLowerCase()=="yes"){
	            return "*"
	        } 
	        else if(mandatory_H.toLowerCase()=="no"){
	            return " "+""
	        }
        }catch(e){}
    },
    GenderCriteria:function()
    {
        try{
	        var gender_H = this.criteria.gender;
	        var mandatory_H = this.criteria.mandatory;
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
        }catch(e){}
    },
    dobCriteria:function()
    {
        try{
	        var dateType_H = this.criteria.dateType;

	        var dateValue_H = moment(new Date(this.criteria.dateValue)).format("DD MMM YYYY");
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
	        else if(dateValue_H.toLowerCase()=="any"){
	            dateType_H_D = "any"
	        }
	        stringToDisp = dateType_H_D;
	        return stringToDisp;
        }catch(e){}
    },
    locCriteria:function()
    {
        try
        {
            var locationType_H = this.criteria.locationType;
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
        }catch(e){}
    },
})


Template.viewTeam.events({

	'click #viewTeamCancel': function(e) {
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
	'click [name=userSelectedForTeamP]':function(e,template){

        Meteor.call("getPlayerDetails",this.playerId,function(err,res){
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
    },
})


