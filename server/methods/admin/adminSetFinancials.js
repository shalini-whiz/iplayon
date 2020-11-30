
Meteor.methods({
	'adminSetFinancials': function(xData1,xData2) {
		check(xData1,String);
		check(xData2,String);
		var financeSaved = []
		var partcipants = []
		var eventDet = events.findOne({"_id":xData2.trim().toString()});
		if(eventDet){
			if(eventDet.eventParticipants!=undefined){
				for(var i = 0;i<eventDet.eventParticipants.length;i++){
					var data = {
						userId:eventDet.eventParticipants[i],
						eventId:xData2
					}
					computeTotalOFUserInsertAdmin(data,function(r){
						if(r){
							partcipants.push(eventDet.eventParticipants[i])
						}
					})
				}
				for(var j=0;j<partcipants.length;j++){
					var findFinancialsDet = financials.findOne({"playerId":partcipants[j],"tournamentId":xData1.trim().toString(),"eventAbbName":eventDet.abbName});
					var userDetails = Meteor.users.findOne({"_id":partcipants[j]})
					if(userDetails!=undefined){
						if(userDetails.clubName==undefined||userDetails.clubName==null){
							userDetails.clubName="other"
						}
						findFinancialsDet["userName"]=userDetails.userName;
						findFinancialsDet["clubName"]=userDetails.clubName;
						financeSaved.push(findFinancialsDet)
					}
				}
			}
			return financeSaved;
		}
	}
});

var computeTotalOFUserInsertAdmin = function(xData,callback){
	var eventFees = events.findOne({"_id":xData.eventId.toString()});
	if(eventFees){
		xData.eventId = eventFees.abbName
		var totalFee = 0;
		var findFinancials = financials.findOne({"playerId":xData.userId,"eventAbbName": xData.eventId,tournamentId:eventFees.tournamentId});
		var userDetails = Meteor.users.findOne({"_id":xData.userId});
		if(userDetails!=undefined||userDetails!=null){
			if(userDetails.clubNameId==undefined||userDetails.clubNameId==null){
				userDetails.clubNameId="other"
			}
			var findAcaFinance = academyfinancials.findOne({"tournamentId":eventFees.tournamentId,"academyId":userDetails.clubNameId,"eventAbbName": xData.eventId})
			if(findFinancials==undefined){
				var r = financials.insert({
					playerId:xData.userId,
					tournamentId:eventFees.tournamentId,
					paidOrNot:false,
					academyId:userDetails.clubNameId,
					"eventAbbName": xData.eventId,
					"eventFee":eventFees.prize
				});

				if(findAcaFinance==undefined){
					var total = 0;
					total = eventFees.prize;
					academyfinancials.insert({
						academyId:userDetails.clubNameId,
						tournamentId:eventFees.tournamentId,
						paidOrNot:false,
						"eventAbbName": xData.eventId,
						"eventFee":eventFees.prize
					});
					return callback(true)
				}
				else {
					var total = 0;
					total = 0;
					academyfinancials.find({academyId:userDetails.clubNameId,
						tournamentId:eventFees.tournamentId,"eventAbbName": xData.eventId}).map(function(doc) {
						total = parseInt(doc.eventFee)+parseInt(eventFees.prize);
					});
					var l = academyfinancials.update({academyId:userDetails.clubNameId,
						tournamentId:eventFees.tournamentId,"eventAbbName": xData.eventId},{$set:{eventFee:total}},{multi:true})
					return callback(true)
				}
				//return callback(true)
			}
			else{
				return callback(true)
			}
		}
	}
}