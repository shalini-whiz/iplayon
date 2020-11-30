Meteor.methods({
	'updateAssociationPermissions': function(xData) {
		check(xData,Object);
		var update=associationPermissions.update({
			associationId:xData.associationId
		},{$set:xData});
	}
});