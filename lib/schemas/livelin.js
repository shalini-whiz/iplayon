liveLinks = new Meteor.Collection('liveLinks');


var linkSchema = new SimpleSchema({
	"title":{
		type:String,
		label:"url title",
	},
	"description":{
		type:String,
		label:"url description",
		optional:true
	},
	"link":{
		type:String,
		label:"url link",
	},
	"linkDate":{
		type:Date,
		label:"link date"
	},
})

liveLinksSchema = new SimpleSchema({
	"tournamentId":{
		type:String,
		optional:true
	},
	"links":{
		type:[linkSchema],
		optional:true
	}
})

liveLinks.attachSchema(liveLinksSchema);