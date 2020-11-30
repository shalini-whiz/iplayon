insertedPlayersFromCsv = new Meteor.Collection('insertedPlayersFromCsv');

var insertedPlayersFromCsvSchema  =  new SimpleSchema({
	userId:{
		type:String,
		label:"userId"
	},
});
insertedPlayersFromCsv.attachSchema(insertedPlayersFromCsvSchema);

deletedPlayers = new Meteor.Collection('deletedPlayers');

var deletedPlayersSchema  =  new SimpleSchema({
	"userId" : {
		type:String,
		label:"userId"
	},
});
deletedPlayers.attachSchema(deletedPlayersSchema);
