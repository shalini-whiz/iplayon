newRegisterPages = new Meteor.Collection('newRegisterPages');

var newRegisterPagesSchema  =  new SimpleSchema({
	domainName:{
		type:String
	}
	
});
newRegisterPages.attachSchema(newRegisterPagesSchema);