/**
 * @PublicationName : eventUploads
 * @CollectionName : eventUploads
 * @publishDescription : to publish the list of eventUpload files details
 *  from collection eventUploads
 */
Meteor.publish( 'eventUploads', function(){
		 var lData = eventUploads.find();

		 if(lData){
			 return lData;
		 }
	 	 return this.ready(); 
	 
});
Meteor.publish( 'allEvents', function(){
		 var lData = events.find({});
		 if(lData!=undefined){
			 return lData;
		 }
	 	 return this.ready(); 
});

Meteor.publish( 'pastEventsDB', function(){
		 var lData = pastEvents.find({});
		 if(lData!=undefined){
			 return lData;
		 }
	 	 return this.ready(); 
});

Meteor.publish( 'scrollableevents', function(){
		 var lData = scrollableevents.find({});
		 if(lData!=undefined){
			 return lData;
		 }
	 	 return this.ready(); 
});

Meteor.publish( 'layoutDefaultBottom', function(){
		 var lData = layoutDefaultBottom.find({});
		 if(lData!=undefined){
			 return lData;
		 }
	 	 return this.ready(); 
});

//not used
/*Meteor.publish( 'tryEvents29', function(){
	var jsonS={}
	lUserId = Meteor.users.findOne({"_id":this.userId});
	var eve=events.find({$or: [{
		domainId: {
		    $in: lUserId.interestedDomainName
			}
		}, {
		subDomain1Name: {
		    $in: lUserId.interestedSubDomain1Name
			}
		}, {
		subDomain2Name: {
		    $in: lUserId.interestedSubDomain2Name
		    }
		}],
		projectId: {
		    $in:lUserId.interestedProjectName
			},
		tournamentEvent:true
		},{sort:{eventName:1}}).fetch().forEach(function(lEvents,i){
		    var getCountryId = timeZone.findOne({
		        "state": { $elemMatch: { "stateId": lEvents.domainId.toString() } }
		    });
		    if(getCountryId!=undefined){
		    var uf = moment.utc(getCountryId.timeStamp*1000).format("YYYY/DD/MMM")// hh:mm a");
		    var uf1 = new Date(uf).getTime()/1000;
		    var d1 = moment(getCountryId.timeStampUpdatedDate).format();
		    var diff = Math.abs(new Date(d1) - new Date());
		    var diffh = (diff/1000)
		    var now = new Date(uf1*1000);
		    now.setSeconds(now.getSeconds() + diffh);
		    var nowing = new Date(now).getTime()/1000;
		    var dateT2 = (new Date(lEvents.eventEndDate1)).getTime()/1000;
		    var uf4 = moment.utc(dateT2*1000).zone(lEvents.offset).format("YYYY/DD/MMM")// hh:mm a");
		    var uf5 = new Date(uf4).getTime()/1000;
		    if(moment(uf5*1000).startOf('day')>=moment(nowing*1000).startOf('day')){
		        jsonS.push(lEvents)
		   }
		    else{
		  		}
		    }
	})
	return jsonS;
});*/
Meteor.publish( 'getDrawsUpcomingTournaments', function(tournamentId){
	var lData = events.find({$or:[
		{"_id":tournamentId},
		{"tournamentId":tournamentId}
	]});
	if(lData!=undefined){
		return lData;
	}
	else if(lData == undefined)
	{
		lData = pastEvents.find({$or:[
		 	{"_id":tournamentId},
		 	{"tournamentId":tournamentId}
		 	]
		 });
		if(lData != undefined)
			return lData;
	}
		 
	return this.ready(); 
});

Meteor.publish( 'getDrawsPastTournaments', function(tournamentId){
		 var lData = pastEvents.find({
		 	$or:[
		 	{"_id":tournamentId},
		 	{"tournamentId":tournamentId}
		 	]
		 });
		 if(lData!=undefined){
			 return lData;
		 }
		
	 	 return this.ready(); 
});