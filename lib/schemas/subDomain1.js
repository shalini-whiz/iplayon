subDomain1 = new Meteor.Collection('subDomain1');

var subDomain1Schema  =  new SimpleSchema({
	subDomain1Name:{
		type:String
	}
	
});
subDomain1.attachSchema(subDomain1Schema);