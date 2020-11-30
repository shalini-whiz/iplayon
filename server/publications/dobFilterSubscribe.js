
 Meteor.publish('dobFilterSubscribe', function() {
	var lData = dobFilterSubscribe.find({});
	if (lData) {
		return lData;
	}
	return this.ready();
});


 

 Meteor.publish('dobFilterSubscribeTour',function(param){
  	if(param){
       	var lData = dobFilterSubscribe.find({"tournamentId":param});
		if (lData) {
			return lData;
		}
		return this.ready();
  }
});