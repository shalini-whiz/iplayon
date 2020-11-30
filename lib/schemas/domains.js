domains = new Meteor.Collection('domains');

var domainsSchema  =  new SimpleSchema({
	domainName:{
		type:String
	},
	countryName:{
		type:String,
		optional:true
	}
	
});
domains.attachSchema(domainsSchema);