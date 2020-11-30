Meteor.methods({
	'moveToPastEventsMethod': function(tournamentId) {
		check(tournamentId,String);
		var find = events.findOne({
			"_id":tournamentId
		});
		var movedArray = [];
		if(find==undefined){
			find = pastEvents.findOne({
				"_id":tournamentId
			});
			if(find){
				var catgories = events.find({
					tournamentId:tournamentId
				}).fetch();
				if(catgories.length!=0&&find.offsetOfDomain){
					for(var i = 0;i<catgories.length;i++){
						catgories[i]['timeZoneName'] = "Asia/Kolkata";
						catgories[i]['offsetOfDomain'] = find.offsetOfDomain
						pastEvents.insert(
							catgories[i]
						);
						movedArray.push({"_id":catgories[i]})
						events.remove(catgories[i])
					}
				}
			}
			if(movedArray.length!==0){
				return movedArray;
			}
			else{
				return true;
			}
		}
	}
});



Meteor.methods({
	'moveAllToPastEventsMethod': function(tournamentId) {
		var find = events.find({
		}).fetch();
		var movedArray = [];
		if(find==undefined){
			find = pastEvents.findOne({
				"_id":tournamentId
			});
			if(find){
				var catgories = events.find({
					tournamentId:tournamentId
				}).fetch();
				if(catgories.length!=0&&find.offsetOfDomain){
					for(var i = 0;i<catgories.length;i++){
						catgories[i]['timeZoneName'] = "Asia/Kolkata";
						catgories[i]['offsetOfDomain'] = find.offsetOfDomain
						pastEvents.insert(
							catgories[i]
						);
						movedArray.push(catgories[i])
						events.remove({"_id":catgories[i]._id})
					}
				}
			}
			if(movedArray.length!==0){
				return movedArray;
			}
			else{
				return true;
			}
		}
	}
});


Meteor.methods({
    "moveTomyPastEventsMethod":function(){
        var l = pastEvents.find({
            tournamentEvent:true
        },{sort:{eventEndDate1:1}}).fetch();
        var movedArray = [];
        for(var i=0;i<l.length;i++){
            var e = l[i];
            if(e.timeZoneName){
                if(myPastEvents.findOne({"tournamentId":e._id})==undefined){
                    //if(moment(moment(new Date(e.eventEndDate1)).format("YYYY-MM-DD"))<moment(moment.tz(e.timeZoneName).format("YYYY-MM-DD"))){
                        myPastEvents.insert({
                            "_id":e._id,
                            "tournamentId":e._id.toString(),
                            eventName:e.eventName,
                            projectId:e.projectId,
                            projectName:e.projectName,
                            eventStartDate:e.eventStartDate,
                            eventEndDate:e.eventEndDate,
                            eventSubscriptionLastDate:e.eventSubscriptionLastDate,
                            domainId:e.domainId,
                            domainName:e.domainName,
                            eventOrganizer:e.eventOrganizer,
                            eventsUnderTournament:e.eventsUnderTournament,
                            "eventStartDate1":moment(new Date(e.eventStartDate)).format("YYYY-MM-DD"),
                            "eventEndDate1":moment(new Date(e.eventEndDate)).format("YYYY-MM-DD"),
                        });
                        movedArray.push(e)
                        myUpcomingEvents.remove({
                            tournamentId:e._id
                        });
                    //}
                    //else{
                        //break;
                    //}
                }
            }
        }
        var lp = events.find({
            tournamentEvent:true
        },{sort:{eventEndDate1:1}}).fetch();
        for(var j=0;j<lp.length;j++){
            var e2 = lp[j];
            if(e2.timeZoneName){
                if(myUpcomingEvents.findOne({"tournamentId":e2._id})==undefined){
                    //if(moment(moment(new Date(e.eventEndDate1)).format("YYYY-MM-DD"))<moment(moment.tz(e.timeZoneName).format("YYYY-MM-DD"))){
                        myUpcomingEvents.insert({
                            "_id":e2._id,
                            "tournamentId":e2._id.toString(),
                            eventName:e2.eventName,
                            projectId:e2.projectId,
                            projectName:e2.projectName,
                            eventStartDate:e2.eventStartDate,
                            eventEndDate:e2.eventEndDate,
                            eventSubscriptionLastDate:e2.eventSubscriptionLastDate,
                            domainId:e2.domainId,
                            domainName:e2.domainName,
                            eventOrganizer:e2.eventOrganizer,
                            eventsUnderTournament:e2.eventsUnderTournament,
                            "eventStartDate1":moment(new Date(e2.eventStartDate)).format("YYYY-MM-DD"),
                            "eventEndDate1":moment(new Date(e2.eventEndDate)).format("YYYY-MM-DD"),
                        });
                        movedArray.push(e2)
                    //}
                    //else{
                        //break;
                    //}
                }
            }
        }
        if(movedArray.length!==0){
			return movedArray;
		}
		else{
			return true;
		}
    }
});