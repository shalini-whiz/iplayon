mainProjects = new Meteor.Collection('mainProjects');

var mainProjectsSchema  =  new SimpleSchema({
	projectMainName:{
		type:String
	}
});
mainProjects.attachSchema(mainProjectsSchema);