//Template helpers, events for template teamSubscribePopup.html
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
Template.teamSubscribePopup.onCreated(function(){
	this.subscribe("teams");
	//this.subscribe("projects");
	//this.subscribe("users");
});

/**
 * On rendered of template teamSubscribePopup.html initialize css bootstrap
 * slimScroll for teams list div to scroll
 */
Template.teamSubscribePopup.onRendered(function(){
	$('#selectMainTag').slimScroll({
		height: '8em',
		color: 'black',
		size: '3px',
		width: '100%'
	});
});

/**
 * template helpers which connects teamSubscribePopup.html
 * @methodName : lTeams is a function to find teams
 */
Template.teamSubscribePopup.helpers({
	/*
	 * get the eventId using router parameters,
	 * find the type of event (individual=1 or team!=1)
	 * find the teams for Meteor.userId as owner of team
	 * and type of project of that team
	 * if teams fetched matches with eventType return the teams
	 */
	"lTeams":function(){
		try{
		var eventId = Router.current().params._PostId;
		var eveType = events.findOne({"_id":eventId});
		//change
		var eveTourType = events.findOne({"_id":eveType.tournamentId.toString()})
		var userId = Meteor.users.findOne({"_id":Meteor.userId().toString()})
		var teamList = teams.find({"teamOwner":userId.userId.toString(),"projectName":eveTourType.projectId.toString()}).fetch();
	 	if(teamList){
	 		if(teamList.length==2){
	 			$('#selectMainTag').slimScroll({
					height: '5.5em',
					color: 'black',
					size: '3px',
					width: '100%'
				});
	 		}
	 		if(teamList.length==1){
	 			$('#selectMainTag').slimScroll({
					height: '2.7em',
					color: 'black',
					size: '3px',
					width: '100%'
				});
	 		}
	 		return teamList;
	 	}

	 }catch(e){}
	}
});
Template.teamSubscribePopup.events({

});
