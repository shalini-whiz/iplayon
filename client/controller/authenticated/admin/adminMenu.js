Template.adminMenu.events({
	"click #uploadPoints":function(e){
		Router.go("/adminUploadPoints");
	},

	"click #uploadPlayers":function(e){
		e.preventDefault();
		Router.go("/adminUploadPlayers");
	},
	"click #uploadPlayersToAssoc":function(e){
		e.preventDefault();
		Router.go("/adminUploadPlayersAssociation");
	},
	"click #createMenuCoaching":function(e){
		e.preventDefault();
		$("#alreadySubscribed").modal({
			backdrop: 'static',
			keyboard:false
		});	
		$("#alreadySubscribedText").text("This feature is not enabled in this version");
	},
	"click #tournScheduler":function(e){
		e.preventDefault();
		Router.go("/tournScheduleMainMenu");
	},
	"click #managePlayers":function(e){
		e.preventDefault();
		Router.go("/adminManagePlayers");
	},
	/*
	 * onClick of cancel button of create events
	 * if the response from meteor method is true,
	 * check the previous location path,
	 * if it is undefined go to myEvents
	 * else to previous path from where create events is called.
	 */
	"click #cancelMenu": function() {
		if (Session.get("previousLocationPath") !== undefined) {
			var previousPath = Session.get("previousLocationPath");
			Session.set("previousLocationPath", undefined);
			Session.set("previousLocationPath", null);
			Router.go(previousPath);
		} else {
			Router.go("/myEvents");
		}

	},
	'click #aYesButton': function(e) {
		e.preventDefault();
		$("#alreadySubscribed").modal('hide');
	},
	'click #setSubscribeDOB':function(e){
		e.preventDefault();
		$("#subscriptionDOBRen").empty()
		Blaze.render(Template.subscriptionDOB, $("#subscriptionDOBRen")[0]);
		$("#subscriptionDOB").modal({
			backdrop: 'static',
			keyboard:false
		});
	},
	"click #adminTeamFormat":function(e){
		e.preventDefault();
		Router.go("/adminTeamFormat");
	},
	"click #createStrokes":function(e){
		e.preventDefault();
		Router.go("/adminStrokes");
	},
	"click #createArticles":function(e){
		e.preventDefault();
		Router.go("/articlesMainMenu");
	},
	"click #twitterHASHTags":function(e){
		e.preventDefault();
		Router.go("/adminManageHashTags");
	},
	"click #manageTournament":function(e){
		e.preventDefault();
		Router.go("/adminManageTournament");


	}
});