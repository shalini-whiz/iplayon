/**
 * Meteor Method to find sponsorLogoUrl
 * @collectionName : eventUploads
 * @dbQuery : find
 * @dataType : String
 * @passedByValues : sponsorLogoId
 * @methodDescription : find the sponsorLogo url for the given sponsorLogoId  
 */
Meteor.methods({
	"sponsorLogoUrl":function(xData){
		try{
		check(xData,String);
		var lData = eventUploads.find({
                        "_id": xData
            }).fetch();
		if(lData.length!==0){
			return lData[0].url();
		}
		}catch(e){}
	}
});
