import { playerDBFind}from '../../methods/dbRequiredRole.js'

Meteor.publish('fetchEventPlayers',function(tournamentId,eventName){
	try{
		var tournamentInfo = events.findOne({
      		"_id": tournamentId
    	})

    	var eventInfo = events.findOne({
    		"tournamentId":tournamentId,"eventName":eventName,
    	})
    	if(tournamentInfo && eventInfo && eventInfo.eventParticipants)
    	{
	 		var dbsrequired = ["userDetailsTT"]
		    var userDetailsTT = "userDetailsTT"

	    	var res =  Meteor.call("changeDbNameForDraws", tournamentInfo, dbsrequired)
	        if (res) 
	        {
	            if (res.changeDb && res.changeDb == true) {
	                if (res.changedDbNames.length != 0) 
	                {
	                   	userDetailsTT = res.changedDbNames[0];
        				var dataInfo = global[userDetailsTT].find({userId: {$in:eventInfo.eventParticipants}});        				        			

        				if(dataInfo != undefined)
        				{
        					return dataInfo;
        				}
	                }
	            }
	        }
    	}
	}catch(e)
	{
	}


})

Meteor.publish('adminSportPlayers', function(sportId) {
	try{
		var toret = playerDBFind(sportId);
		if(toret)
		{
			lData = global[toret].find({});
            if (lData != undefined) {
                return lData;
            }
		}
			return this.ready();


	}catch(e){
	}
	
});


 Meteor.publish('adminUserDetailsTT', function(sportId) {

	var lData = Meteor.users.find({},{userId:1,userName:1});
	if (lData) {
		return lData;
	}
	return this.ready();
});

  Meteor.publish('adminDobFilterSubscribeOnParam', function(param) {
	var lData = dobFilterSubscribe.find({"tournamentId":param});
	if (lData) {
		return lData;
	}
	return this.ready();
})


 