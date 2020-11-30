Meteor.publish( 'myTeams', function(){
		 var lData = teams.find({"teamOwner":this.userId});
		 if(lData){
			 return lData;
		 }
	 	 return this.ready(); 
});

Meteor.publish( 'teamsWithId', function(){
	 var lData = teams.find({});
	 if(lData){
		 return lData;
	 }
	 return this.ready(); 
});

Meteor.publish('teamFormat',function(){
	var data = teamsFormat.find({});
	if(data)
		return data;
	return this.ready();
})

Meteor.publish('organizerPlayerTeams', function(param) {
  var lData =playerTeams.find({
  	$or:[{"teamManager": this.userId},
  		 {"teamMembers.playerId": {$in:[this.userId]}}]},{eventName:1})
  if (lData) {
    return lData;
  }
  return this.ready();
});

Meteor.publish('teamsFormatName',function(){
	var data = teamsFormat.find({},{"teamFormatName":1, "_id":1});
	if(data)
		return data;
	return this.ready();
});


Meteor.publish('teamListPub',function(){
	var data = playerTeams.find({},{sort:{"teamName":1}});
	if(data)
		return data;
	return this.ready();
});


Meteor.publish('tournamentBasedPlayerTeam', function(tournamentId) {
  var lData =playerTeams.find({
  	"tournamentId":tournamentId
  	},)
  if (lData) {
    return lData;
  }
  return this.ready();
});

