teamDetailsSpecification = new SimpleSchema ({
	"rowNo" : {
	    type: Number,
	    optional:true,
	    label: "The unique match number within the said event",
	},
	"colNo": {
	    type: Number,
	   	optional:true,
	    label: "The round to which this match belongs to",
	},
    teamAID:{
		type:String,
		label:"teamAID",
		defaultValue: function() {
			if (this.isInsert) {
				return "";
			} else if (this.isUpdate) {
				return ""
			}
		}
	},
	teamBID:{
		type:String,
		label:"teamBID",
		defaultValue: function() {
			if (this.isInsert) {
				return "";
			} else if (this.isUpdate) {
				return ""
			}
		}
	},
	teamAPlayerAId:{
		type:String,
		label:"teamAPlayerAId",
		defaultValue: function() {
			if (this.isInsert) {
				return "";
			} else if (this.isUpdate) {
				return ""
			}
		}
	},
	teamAPlayerBId:{
		type:String,
		label:"teamAPlayerBId",
		defaultValue: function() {
			if (this.isInsert) {
				return "";
			} else if (this.isUpdate) {
				return ""
			}
		}
	},
	teamBPlayerAId:{
		type:String,
		label:"teamBPlayerAId",
		defaultValue: function() {
			if (this.isInsert) {
				return "";
			} else if (this.isUpdate) {
				return ""
			}
		}
	},
	teamBPlayerBId:{
		type:String,
		label:"teamBPlayerBId",
		defaultValue: function() {
			if (this.isInsert) {
				return "";
			} else if (this.isUpdate) {
				return ""
			}
		}
	},
	teamADoubles1PlayerId:{
		type:String,
		label:"teamADoubles1PlayerId",
		defaultValue: function() {
			if (this.isInsert) {
				return "";
			} else if (this.isUpdate) {
				return ""
			}
		}
	},
	teamADoubles2PlayerId:{
		type:String,
		label:"teamADoubles2PlayerId",
		defaultValue: function() {
			if (this.isInsert) {
				return "";
			} else if (this.isUpdate) {
				return ""
			}
		}
	},
	teamBDoubles1PlayerId:{
		type:String,
		label:"teamBDoubles1PlayerId",
		defaultValue: function() {
			if (this.isInsert) {
				return "";
			} else if (this.isUpdate) {
				return ""
			}
		}
	},
	teamBDoubles2PlayerId:{
		type:String,
		label:"teamBDoubles2PlayerId",
		defaultValue: function() {
			if (this.isInsert) {
				return "";
			} else if (this.isUpdate) {
				return ""
			}
		}
	},
});



teamRRSpecification = new Meteor.Collection('teamRRSpecification');

var teamRRSpecificationSchema  =  new SimpleSchema({
	tournamentId:{
		type:String,
		label:"tournamentId"
	},
	eventName:{
		type:String,
		label:"eventName"
	},
	teamDetails :{
		type:[teamDetailsSpecification],
		label:"team details"
	}
});
teamRRSpecification.attachSchema(teamRRSpecificationSchema);	