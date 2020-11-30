
Meteor.methods({
	'updateUserProfileSettingsFromRegister': function(xData) {
		check(xData, Object);
		var s4="";
		if(xData.s1&&xData.s2&&xData.s3){
			var sa = parseInt(xData.s1)
            var sb = parseInt(xData.s2)
            var sc = parseInt(xData.s3)
            s4 = moment.utc(new Date(sc + "/" + sb + "/" + sa)).format("DD MMM YYYY");
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
			  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
			];

			var d = new Date(sb+"/"+sa+"/"+sc);
			s4 = new Date(sa+" "+monthNames[d.getMonth()]+" "+sc);
        }
		if(xData.userName==null){
			xData.userName=xData.contactPerson
		}
		var lUsers = Meteor.users.find({
			"emailAddress": xData.emailAddress
		}).fetch();
		var meteorUser = Meteor.users.update({
			"emailAddress": xData.emailAddress
		}, {
			$set: {
				interestedDomainName: xData.interestedDomainName,
				interestedProjectName: xData.interestedProjectName,
				interestedSubDomain1Name: xData.interestedSubDomain1Name,
				interestedSubDomain2Name: xData.interestedSubDomain2Name,
				profileSettingStatus:true,
				userName: xData.userName,
				phoneNumber : xData.phoneNumber,
				//awayToDate : xData.awayToDate,
				clubName:xData.clubName,
				//awayToDate: lAwayToDate,
				dateOfBirth: s4,
				role:xData.role,
				gender:xData.gender,
				contactPerson:xData.contactPerson,
				address:xData.address,
				city:xData.city,
				pinCode:xData.pinCode,
				clubNameId:xData.clubNameId,
				associationId:xData.associationId,
				guardianName:xData.guardianName,
				address:xData.address,
				state:xData.state,
				country:xData.country,
				statusOfUser:"Active",
				year:new Date().getFullYear()
			}
		});
		return meteorUser;
	}
});





Meteor.methods({
	'associationAcademyUserProfile': function(xData) {
		check(xData, Object);
		var s3="";
		if(xData.MonthINC&&xData.YearINC&&xData.DDINC){
			/*var s = parseInt(xData.DDINC)
            var s1 = parseInt(xData.MonthINC)
            var s2 = parseInt(xData.YearINC)
            s3 = moment.utc(new Date(s2 + "/" + s1 + "/" + s)).format("DD MMM YYYY");*/
            var sa = parseInt(xData.DDINC)
            var sb = parseInt(xData.MonthINC)
            var sc = parseInt(xData.YearINC)
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
			  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
			];

			var d = new Date(sb+"/"+sa+"/"+sc);
			s3 = sa+" "+monthNames[d.getMonth()]+" "+sc;
        }
		if(xData.userName==null){
			xData.userName=xData.contactPerson
		}
		var lUsers = Meteor.users.findOne({
			"emailAddress": xData.emailAddress
		});
		var meteorUser = Meteor.users.update({
			"emailAddress": xData.emailAddress
		}, {
			$set: {
				interestedDomainName: xData.interestedDomainName,
				interestedProjectName: xData.interestedProjectName,
				interestedSubDomain1Name: xData.interestedSubDomain1Name,
				interestedSubDomain2Name: xData.interestedSubDomain2Name,
				profileSettingStatus:true,
				userName: xData.userName,
				phoneNumber : xData.phoneNumber,
				//awayToDate : xData.awayToDate,
				clubName:xData.clubName,
				//awayToDate: lAwayToDate,
				role:xData.role,
				contactPerson:xData.contactPerson,
				address:xData.address,
				city:xData.city,
				pinCode:xData.pinCode,
				state:xData.state,
				country:xData.country,
				dateOfInc:s3,
				abbrevationAssociation:xData.assocAbbrevation.toUpperCase(),
				statusOfUser:"Active",
				associationType:xData.associationType,
				associationId:lUsers.userId,
				year:new Date().getFullYear()
			}
		});
		if(meteorUser){
			if(xData.associationType=="District/City"){
				Meteor.users.update({
					"emailAddress": xData.emailAddress
				}, {$set:{
					parentAssociationId:xData.parentAssociationId,
					interestedDomainName: [""],
					interestedProjectName:[""],
				}});
				var r = associations.insert({
					associationName:xData.clubName,
					associationId:xData.newUserId,
					parentAssociationType:xData.parentAssociationId,
					associationType:xData.associationType
				});
			}
			else{
				var r = associations.insert({
					associationName:xData.clubName,
					associationId:xData.newUserId,
					associationType:xData.associationType
				});
			}
			
			if(xData.associationType=="State/Province/County"){
				var j = associationPermissions.insert({
					associationId:lUsers.userId,
					playerEntry:"yes",
					districtAssocEntry:"yes",
					academyEntry:"yes",
					playerEditSet:"yes",
					districtAssocEditSet:"yes",
					academyEditSet:"yes",
					playerChangePass:"yes",
					districtAssocChangePass:"yes",
					academyChangePass:"yes"
				})
				
			}
			return meteorUser
		}
	}
});

Meteor.methods({
	'associationAcademyUserProfile2': function(xData) {
		check(xData, Object);
		var s3="";
		if(xData.MonthINC&&xData.YearINC&&xData.DDINC){
			/*var s = parseInt(xData.DDINC)
            var s1 = parseInt(xData.MonthINC)
            var s2 = parseInt(xData.YearINC)
            s3 = moment.utc(new Date(s2 + "/" + s1 + "/" + s)).format("DD MMM YYYY");*/
            var sa = parseInt(xData.DDINC)
            var sb = parseInt(xData.MonthINC)
            var sc = parseInt(xData.YearINC)
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
			  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
			];

			var d = new Date(sb+"/"+sa+"/"+sc);
			s3 = sa+" "+monthNames[d.getMonth()]+" "+sc;
        }
		if(xData.userName==null){
			xData.userName=xData.contactPerson
		}
		var lUsers = Meteor.users.find({
			"emailAddress": xData.emailAddress
		}).fetch();
		var meteorUser = Meteor.users.update({
			"emailAddress": xData.emailAddress
		}, {
			$set: {
				interestedDomainName: xData.interestedDomainName,
				interestedProjectName: xData.interestedProjectName,
				interestedSubDomain1Name: xData.interestedSubDomain1Name,
				interestedSubDomain2Name: xData.interestedSubDomain2Name,
				profileSettingStatus:true,
				userName: xData.userName,
				clubName:xData.academyName,
				phoneNumber : xData.phoneNumber,
				//awayToDate : xData.awayToDate,
				associationId:'other',
				//awayToDate: lAwayToDate,
				role:xData.role,
				contactPerson:xData.contactPerson,
				address:xData.address,
				city:xData.city,
				pinCode:xData.pinCode,
				state:xData.state,
				country:xData.country,
				dateOfInc:s3,
				abbrevationAcademy:xData.abbrevation.toUpperCase(),
				statusOfUser:"Active",
				year:new Date().getFullYear()
			}
		});
		if(meteorUser){
			/*var academyArray = [];
			academyArray.push({"academyId":xData.newUserId,"academyName":xData.academyName})*/
			var s= academies.insert({
				"academyId":xData.newUserId,
				"academyName":xData.academyName
			}, 
			);
			return meteorUser
		}
	}
});

Meteor.methods({
	'updateAcademyInsertedFromAss': function(xData) {
		check(xData, Object);
		var s4="";
		var parentAssociationId = "";
		var findAsType=Meteor.users.findOne({"_id":xData.associationId});
		if(findAsType.associationType=="District/City"){
			parentAssociationId=findAsType.parentAssociationId
		}
		else{
			parentAssociationId=""
		}
		if(xData.s1&&xData.s2&&xData.s3){
			/*var sa = parseInt(xData.s1)
            var sb = parseInt(xData.s2)
            var sc = parseInt(xData.s3)
            s4 = moment.utc(new Date(sc + "/" + sb + "/" + sa)).format("DD MMM YYYY");*/
            var sa = parseInt(xData.s1)
            var sb = parseInt(xData.s2)
            var sc = parseInt(xData.s3)
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
			  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
			];

			var d = new Date(sb+"/"+sa+"/"+sc);
			s4 = sa+" "+monthNames[d.getMonth()]+" "+sc;
        }
		if(xData.userName==null){
			xData.userName=xData.contactPerson
		}

		var meteorUser = Meteor.users.update({
			"_id": xData.newUserId
		}, {
			$set: {
				interestedDomainName: xData.interestedDomainName,
				interestedProjectName: xData.interestedProjectName,
				interestedSubDomain1Name: xData.interestedSubDomain1Name,
				interestedSubDomain2Name: xData.interestedSubDomain2Name,
				profileSettingStatus:true,
				userName: xData.userName,
				clubName:xData.clubName,
				phoneNumber : xData.phoneNumber,
				emailAddress:xData.emailAddress,
				//awayToDate : xData.awayToDate,
				associationId:xData.associationId,
				//awayToDate: lAwayToDate,
				role:xData.role,
				contactPerson:xData.userName,
				address:xData.address,
				city:xData.city,
				state:xData.state,
				country:xData.country,
				dateOfInc:s4,
				pinCode:xData.pinCode,
				userId:xData.newUserId,
				statusOfUser:"Active",
				parentAssociationId:parentAssociationId,
				abbrevationAcademy:xData.abbrevationAcademy.toUpperCase(),
				year:new Date().getFullYear()
			}
		});
		if(meteorUser){
			var academyArray = [];
			academyArray.push({"academyId":xData.newUserId,"academyName":xData.clubName})
			var s= associations.update({
				"associationId":xData.associationId
			}, 
			{ $addToSet: {academyId:xData.newUserId}}
			);
			if(s){
				var s= academies.insert({
				"academyId":xData.newUserId,
				"academyName":xData.clubName
				}, 
				);
				return meteorUser
			}
		}
	}
});

Meteor.methods({
	'updateAcademyInsertedFromAss_DN': function(xData) {
		check(xData, Object);
		var s4="";
		if(xData.s1&&xData.s2&&xData.s3){
			/*var sa = parseInt(xData.s1)
            var sb = parseInt(xData.s2)
            var sc = parseInt(xData.s3)
            s4 = moment.utc(new Date(sc + "/" + sb + "/" + sa)).format("DD MMM YYYY");*/
            var sa = parseInt(xData.s1)
            var sb = parseInt(xData.s2)
            var sc = parseInt(xData.s3)
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
			  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
			];

			var d = new Date(sb+"/"+sa+"/"+sc);
			s4 = sa+" "+monthNames[d.getMonth()]+" "+sc;
        }
		if(xData.userName==null){
			xData.userName=xData.contactPerson
		}

		var meteorUser = Meteor.users.update({
			"_id": xData.newUserId
		}, {
			$set: {
				interestedDomainName: xData.interestedDomainName,
				interestedProjectName: xData.interestedProjectName,
				interestedSubDomain1Name: xData.interestedSubDomain1Name,
				interestedSubDomain2Name: xData.interestedSubDomain2Name,
				profileSettingStatus:true,
				userName: xData.userName,
				clubName:xData.clubName,
				phoneNumber : xData.phoneNumber,
				emailAddress:xData.emailAddress,
				//awayToDate : xData.awayToDate,
				associationId:[xData.newUserId],
				//awayToDate: lAwayToDate,
				role:xData.role,
				contactPerson:xData.userName,
				address:xData.address,
				city:xData.city,
				state:xData.state,
				country:xData.country,
				dateOfInc:s4,
				pinCode:xData.pinCode,
				userId:xData.newUserId,
				statusOfUser:"Active",
				associationType:xData.associationType,
				parentAssociationId:xData.parentAssociationId,
				abbrevationAssociation:xData.abbrevationAcademy.toUpperCase(),
				year:new Date().getFullYear()
			}
		});
		if(meteorUser){

			var s= associations.insert({
				"associationId":xData.newUserId,
				associationName:xData.clubName,
				parentAssociationType:xData.parentAssociationId,
				associationType:xData.associationType,
			}
			);
			if(s){

				return meteorUser
			}
		}
	}
})