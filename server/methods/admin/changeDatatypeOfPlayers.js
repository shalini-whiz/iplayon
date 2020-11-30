Meteor.methods({
	'changeDatatypeOfPlayers': function(xData) {
		var arr = []
		Meteor.users.find({
			role:"Player"
		}).fetch().forEach(function(u,i){
			if(u.dateOfBirth){
				var r = Meteor.users.update({"_id":u._id},
				{
					$set:{
						dateOfBirth:new Date(u.dateOfBirth)
					}
				}
				);
				if(u){
					var changed = Meteor.users.findOne({"_id":u._id});
					var data = {
						"_id":u._id,
						"userName":u._id,
						"dateOfBirth":changed.dateOfBirth
					}
					arr.push(data)
				}
			}
		})
		return arr;
	}
});