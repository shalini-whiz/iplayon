Meteor.methods({
	'updateAssociationIdOfAcademies': function(xData) {
		check(xData, Object);
		var hh = Meteor.users.findOne({"_id":xData.associationId});
		if(hh&&hh.associationType=="District/City"){
			xData.parentAssociationId=hh.parentAssociationId
		}
		else{
			xData.parentAssociationId=""
		}
		var j = Meteor.users.update({_id: {$in: xData.academiesId}}, {$set:{"associationId":xData.associationId,"interestedProjectName":xData.interestedProjectName,"interestedDomainName":xData.interestedDomainName,"parentAssociationId":xData.parentAssociationId}}, {multi:true});
		var l = Meteor.users.update({clubNameId: {$in: xData.academiesId}}, {$set:{"associationId":xData.associationId,"interestedProjectName":xData.interestedProjectName,"interestedDomainName":xData.interestedDomainName,"parentAssociationId":xData.parentAssociationId}}, {multi:true});
		if(j){
			var k = associations.update({"associationId":xData.associationId},{
				$addToSet:{
					academyId:{$each:xData.academiesId}
				}
			});
		}
	}
});


Meteor.methods({
	'updatePullAcademy': function(xData) {
		var j = Meteor.users.update({_id: {$in: xData.academiesId}}, {$set:{"associationId":"other","interestedDomainName":[""],"interestedProjectName":[""],"parentAssociationId":"other"}}, {multi:true});
		var l = Meteor.users.update({clubNameId: {$in: xData.academiesId}}, {$set:{"associationId":"other","parentAssociationId":"other"}}, {multi:true});
		if(j){
			var k = associations.update({"associationId":xData.associationId},{
				$pullAll:{
					academyId:xData.academiesId,
				}
			});
		}
	}
});