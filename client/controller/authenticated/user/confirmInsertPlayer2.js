Template.confirmInsertPlayer2.onRendered(function(){
	this.subscribe('deletedPlayers')
});

Template.confirmInsertPlayer2.onCreated(function(){

});

Template.confirmInsertPlayer2.helpers({
	deletedPlayersId:function(){
		var deletedPlayersIds = deletedPlayers.find({}).fetch();
		if(deletedPlayersIds){
			return deletedPlayersIds
		}
	}
});
