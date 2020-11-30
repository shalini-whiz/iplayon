tourExists = function(tourId){

	var tourInfo = events.findOne({"_id":tourId,"tournamentEvent":true});
	if(tourInfo == undefined)
	{
		tourInfo = pastEvents.findOne({"_id":tourId,"tournamentEvent":true});
	}
	return tourInfo;
}


tourCategoryExists = function(tourId,eventName)
{
	var categoryInfo = events.findOne({"tournamentId":tourId,"eventName":eventName});
	if(categoryInfo == undefined)
	{
		categoryInfo = pastEvents.findOne({"tournamentId":tourId,"eventName":eventName});
	}
	return categoryInfo;
}
