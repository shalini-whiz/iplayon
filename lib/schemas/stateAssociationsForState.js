stateAssociationsForState = new Meteor.Collection('stateAssociationsForState');

var stateAssociationsForStateSchema  =  new SimpleSchema({
	stateId:{
		type:String,
		label:"State Id",
		optional:true
	},
	stateAssocIds:{
		type:String,
		label:"state Assoc Ids",
		optional:true
	},
	associationName:{
		type:String,
		label:"state associationName"
	},
	country:{
		type:String,
		label:"country name"
	},
	status:{
		type:Boolean,
		label:"which is to fetch"
	}
});
stateAssociationsForState.attachSchema(stateAssociationsForStateSchema);