Template.getListofPlayers.onCreated(function(){
	this.subscribe("users")
});

Template.getListofPlayers.onRendered(function(){
	
});

Template.getListofPlayers.helpers({
	usersList:function(){
		var usersList=Meteor.users.find({"role":"Player"}).fetch();
		return usersList
	}
})