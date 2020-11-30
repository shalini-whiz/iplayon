specifications = new SimpleSchema ({
	"no": {
	    type: Number,
	    label: "The unique match number for each match typpe",
	},
	"displayLabel": {
	    type: String,
	    label: "to display unique label (can contain space) for each match type",
	},
	"label":{
	    type: String,
	    label: "to use unique label (without space) for each match type",
	},
	"type":{
	    type: Number,
	    label: "type of match 1 or 2",
	},
	"order":{
		type:Number,
		label:"order of this match"
	}
});

orgTeamMatchFormat = new Meteor.Collection('orgTeamMatchFormat');
var orgTeamMatchFormatSchema  =  new SimpleSchema({
	projectId:{
		type:String,
		label:"projectId"
	},
	organizerId:{
		type:String,
		label:"organizerId"
	},
	formatName:{
		type:String,
		label:"name of the format given by organizer"
	},
	specifications:{
		type:[specifications],
		label:"specifications of each match"
	},
	sortOrder:{
		type:[Number],
		label:"array conatining match numbers in given order (used to sort team detailed draws match nos)"
	}
});
orgTeamMatchFormat.attachSchema(orgTeamMatchFormatSchema);	

