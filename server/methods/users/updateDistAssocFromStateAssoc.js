Meteor.methods({
	'updateAssociationIdOfDistrict': function(xData) {
		check(xData, Object);
		var m = Meteor.users.update({_id: {$in: xData.districtAssocId}}, {$set:{"parentAssociationId":xData.associationId,"interestedProjectName":xData.interestedProjectName,"interestedDomainName":xData.interestedDomainName}}, {multi:true});
		//var j = Meteor.users.update({_id: {$in: xData.districtAssocId}}, {$set:{"associationId":xData.districtAssocId,"interestedProjectName":xData.interestedProjectName,"interestedDomainName":xData.interestedDomainName}}, {multi:true});
		//var j2 = Meteor.users.update({_id: {$in: xData.districtAssocId}}, {$set:{"associationId":xData.districtAssocId,"interestedProjectName":xData.interestedProjectName,"interestedDomainName":xData.interestedDomainName}}, {multi:true});
		//var l = Meteor.users.update({clubNameId: {$in: xData.academiesId}}, {$set:{"associationId":xData.associationId,"interestedProjectName":xData.interestedProjectName,"interestedDomainName":xData.interestedDomainName}}, {multi:true});
		if(m){
			var k = associations.update({associationId: {$in: xData.districtAssocId}},{
				$set:{
					parentAssociationType:xData.associationId
				}
			},{multi:true});
		}
	}
});


Meteor.methods({
	'updatePullDistrictAssoc': function(xData) {
		var j = Meteor.users.update({_id: {$in: xData.districtAssocId}}, {$set:{"parentAssociationId":"other","interestedDomainName":[""],"interestedProjectName":[""]}}, {multi:true});
		var l = Meteor.users.update({associationId: {$in: xData.districtAssocId},$or:[{role:"Player"},{role:"Academy"}]}, {$set:{"associationId":"other",parentAssociationId:"other"}}, {multi:true});
		if(j){
			var k = associations.update({"associationId":{$in: xData.districtAssocId}},{
				$set:{
					parentAssociationType:'other'
				}
			},{multi:true});
		}
	}
});