subDomain2 = new Meteor.Collection('subDomain2');

var subDomain2Schema  =  new SimpleSchema({
	subDomain2Name:{
		type:String
	}
	
});
subDomain2.attachSchema(subDomain2Schema);