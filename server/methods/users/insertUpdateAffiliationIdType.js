Meteor.methods({
	'insertUpdateAffiliationIdType': function(xData) {
		check(xData,Object);
		var r = affiliationIdType.find({"stateAssocId":xData.stateAssocId}).fetch();
		if(r.length==0){
			var k = affiliationIdType.insert({
				stateAssocId:xData.stateAssocId,
				firTCharType:xData.firTCharType,
				fixedCharcters:xData.fixedCharcters
			})
			return true;
		}
	}
});