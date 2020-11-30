Meteor.methods( {
	"deleteUsersByAdmin":function(xData){
		var removedData = [];
		var r;
		try{
		for(var i=0;i<xData.length;i++)
		{
			var rId = Meteor.users.findOne({
				"userId":xData[i]
			});
			if(rId){
				//userDetailsTTUsed
				var findUsers = userDetailsTT.findOne({
					userId:xData[i]
				})
				if(findUsers){
				r = findUsers
				var s =	Meteor.users.remove({
					"userId":xData[i]
				});
				var eventsParticipatedId = [];
				events.find({eventParticipants:{$in:[r.userId.toString()]}}).fetch().forEach(function(l,i){
					eventsParticipatedId.push(l._id)
				});

				if(s){
				//userDetailsTTUsed
				var findUsersk = userDetailsTT.remove({
					userId:xData[i].toString()
				})
				var j = events.update({},{$pull:{eventParticipants:r.userId}},{multi:true});
				var k = myEntriesReadStatus.remove({ "userId" :r.userId});
				var l = sentReceipt.remove({ "sentReceiptUserId" :r.userId});
				var m = teams.remove({ "teamOwner" :r.userId});
				var n = playerEntries.remove({playerId:r.userId})
				//var n = teams.update({},{$pullAll:{teamMembers:[r._id]}},{multi:true});
				var o = upcomingListsReadStatus.remove({ "userId" :r.userId});

				var pointsRes = PlayerPoints.remove({"playerId":r.userId});
				var payRes = paymentTransaction.remove({"playerId":r.userId})



					var emails=""
					if(!r.parentAssociationId){
						r.parentAssociationId = ""
					}
					if(r.clubNameId ==undefined||r.clubNameId==null){
						r.clubNameId = ""
					}
					if(r.associationId==undefined||r.associationId==null){
						r.associationId = ""
					}
					if(r.emails==undefined||r.emails==null){
						emails=""
					}
					else{
						if(r.emails[0].address){
							emails = r.emails[0].address
						}
						else{
							emails = r.emails[0].address
						}
					}
					if(r.contactPerson==undefined||r.contactPerson==null){
						r.contactPerson = ""
					}
					if(r.address==undefined||r.address==null){
						r.address = ""
					}
					if(r.nationalAffiliationId==undefined||r.nationalAffiliationId==null){
						r.address = ""
					}
					if(r.affiliationId==undefined||r.affiliationId==null){
						r.affiliationId = ""
					}
					var data = {
						"_id":r._id,
						"affiliationId":r.affiliationId,
						"userName":r.userName,
						"guardianName":r.guardianName,
						"emailAddress":emails,
						"interestedDomainName":r.interestedDomainName,
						"interestedProjectName":r.interestedProjectName,
						"clubNameId":r.clubNameId,
						"associationId":r.associationId,
						"parentAssociationId":r.parentAssociationId,
						"profileSettingStatus" : true,
						"phoneNumber" : r.phoneNumber,
						"role" : "Player",
						"contactPerson" :r.contactPerson,
						"state" : r.state,
						"dateOfBirth" :r.dateOfBirth,
						"gender" : r.gender,
						"country" : r.country,
						"address" :r.address,
						"city" : r.city,
						"pinCode" :r.pinCode,
						"userId" : r.userId,
						"year" : r.year,
						"statusOfUser" :r.statusOfUser,
						"nationalAffiliationId" :r.nationalAffiliationId,
						"eventIds":eventsParticipatedId.toString()
					}
					removedData.push(data)
				}
				}
			}
		}
		return removedData;
		}catch(e){
		}
	}
});
