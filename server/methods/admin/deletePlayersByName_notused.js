Meteor.methods( {
	"deletePlayersByName":function(xData){
		var playerName = xData;
		var r = Meteor.users.findOne({
			userName:xData
		});
		if(r){
			var s =	Meteor.users.remove({
				userName:xData
			});
			var t = academies.update({
				academyId:r.clubNameId
			},{
				$pull:{playerUserId:r._id}
			})
			if(s){
				deletedPlayers.insert({
					"userId":r._id
				})
			}
		}
	}
});