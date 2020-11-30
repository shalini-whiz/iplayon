Meteor.methods( {
	"changeclubNameIdHidden":function(){
		var recName=[];
		var readMeteorUsers=Meteor.users.find({
			"role":"Player"
		}).fetch().forEach(function(u, j) {
			if(u.clubNameId==undefined){
				var s = Meteor.users.update({
					"_id":u._id
				},{$set:{
					clubNameId:"other",
					clubName:"other"
				}});
				recName.push(u.userName)
			}
		});
		if(recName.length!=0)
		return recName;
		else{
			recName.push("none");
			return recName;
		}
	}
});
