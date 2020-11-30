var mailRegex = /[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var dateRegex = /(((0|1)[0-9]|2[0-9]|3[0-1])\s(0[1-9]|1[0-2])\s((19|20)\d\d))$/;
var dateRegexddMMMyyyyWithSlash = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
var dateRegexyyyymmddWithHyphen = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/
var matchStatus = ["all","active","cancel","closed","inprogress"];
var drillType = ["tracking","physical capacity"];
var drillIntensity = ["low","medium","high"];
var drillDuration = ["sec","min","hour"];
var drillStatus = ["completed","partial"];

/********************************************************/

dateMsg = "Invalid date";
analystMsg = "Invalid analyst";
userMsg = "Invalid login user";
emptyMsg = " cannot be empty";
createAnalyticsReq_Suc_Msg = "Analytics request raised";
createAnalyticsReq_Fail_Msg = "Could not create analytics request";
paramMsg = "Require all parameters";
fetchAnalyticsReq_Suc_Msg = "Analytics request fetched";
fetchAnalyticsReq_Fail_Msg = "Could not fetch analytics request";
posStatusValMsg = "Match Status : allowed values are "+matchStatus.toString();
recordDoesNotExist = "Record does not exist";
cancelAnalyticsReq_Suc_Msg = "Analytics request updated";
cancelAnalyticsReq_Fail_Msg = "Could not cancel analytics request";
pdfSequenceProgress = "Sequence is in progress";
analystPdf_Suc_Msg = "Pdf downloaded";
analystPdf_Fail_Msg = "Could not download pdf";
analystPdf_Record_Invalid = "Invalid Sequence Record";
invalidUserMsg = "Invalid user"


fetchRequestUser_Suc_Msg = "Users found";
fetchRequestUser_Fail_Msg = "No users found";


posDrillTypeMsg = "Drill Type : allowed values are "+drillType.toString();
posDrillIntensityMsg = "Drill Intensity : allowed values are "+drillIntensity.toString();
posDrillDurationMsg = "Drill Duration : allowed values are "+drillDuration.toString();
posDrillStatusMsg = "Drill Status : allowed values are "+drillStatus.toString();


/********************************************************/

errorLog = function(e)
{
	if(arguments && arguments.callee && arguments.callee.caller && arguments.callee.caller.name)
		console.log("Error Msg : "+e+" in "+arguments.callee.caller.name+" function ");
	else
		console.log("Error Msg : "+e);
}
userExists = function(userId){
	var userInfo = Meteor.users.findOne({"userId":userId});
	return userInfo;
}

userExistsByRole = function(userId,role){
	if(role.toLowerCase() == "coach")
	{
		var userInfo = Meteor.users.findOne({"userId":userId,"role":"Coach"});
		return userInfo;
	}
	else if(role.toLowerCase() == "player")
	{
		var userInfo = Meteor.users.findOne({"userId":userId,"role":"Player"});
		return userInfo;
	}
	else if(role.toLowerCase() == "academy")
	{
		var userInfo = Meteor.users.findOne({"userId":userId,"role":"Academy"})
		if(userInfo)
		{
			var acaDetails = academyDetails.findOne({"userId":userId})
						console.log("acaDetails .. "+JSON.stringify(acaDetails))

			if(acaDetails)
				return acaDetails
		}
	}
	
}
succesData = function()
{
	var successJson = {};
	successJson["status"] = "success";
	successJson["message"] = "";
	return successJson;
}
failureData = function()
{
	var failureJson = {};
	failureJson["status"] = "failure";
	failureJson["message"] = "";
	return failureJson;
}
displayMessage = function(msg) {
    alert(msg)
}
reverseDate = function (str) {
	str = str.split(" ");
	str = str[2]+" "+str[1]+" "+str[0];
    return str;
}

validateDate = function(data)
{
	if (dateRegex.test(data)) 
	{

		var parts = data.split(" ");
        var dtDOB = new Date(parts[1] + " " + parts[0] + " " + parts[2]);
        return moment(dtDOB).format("DD MMM YYYY");

	}
	else return false;
}

strTrim = function(data)
{
	if(data != undefined && data != null)
		return data.trim();
	else 
		return undefined
}


posStatusValues = function(data)
{
	if(matchStatus.indexOf(data) > -1 )
		return true;
	else
		return false;
}

posValExists = function(data,type)
{
	if(type.toLowerCase() == "drilltype")
	{
		if(drillType.indexOf(data) > -1 )
			return true;
		
	}
	else if(type.toLowerCase() == "drillintensity")
	{
		if ((drillIntensity.toString()).indexOf(data.toString()) > -1 )
    		return true;
	}
	else if(type.toLowerCase() == "drillduration")
	{
		if ((drillDuration.toString()).indexOf(data.toString()) > -1 )
    		return true;
	}
	else if(type.toLowerCase() == "drillstatus")
	{
		if((drillStatus.toString()).indexOf(data.toString()) > -1)
			return true;
	}
	return false;

}


validCountry = function(countryId){
    try{
        var dataExists = timeZone.findOne({
            "countryName": countryId,
        });
        if(dataExists){
            return true;
        }
        else{
            return false;
        }
    }catch(e){
        return false;
    }
}

validStateAssoc = function(stateId){
    try{
        
        var dataExists = stateAssociationsForState.findOne({
            "stateId":stateId
        })
        if(dataExists){
            if(dataExists && dataExists.stateAssocIds){
                return dataExists.stateAssocIds
            }else{
                return false;
            }
        }else{
            var dataExists = stateAssociationsForState.findOne({
                "stateAssocIds":stateId
            })
            if(dataExists){
                return dataExists.stateAssocIds
            }
            else{
                return false;
            }
        }
    }catch(e){
        return false;
    }
}

validDateString = function(dateVal,format)
{
	if(format == "dd/MMM/yyyy")
	{
		if (dateRegexddMMMyyyyWithSlash.test(dateVal)) 
		{

			var parts = dateVal.split("/");
	        var dtDOB = new Date(parts[1] + " " + parts[0] + " " + parts[2]);
	       // return dtDOB;
	        return moment(dtDOB).format("DD MMM YYYY");

		}
	}
	else if(format == "yyyy-mm-dd")
	{
		if (dateRegexyyyymmddWithHyphen.test(dateVal)) 
		{
			return true;
			//var parts = dateVal.split("/");
	        //var dtDOB = new Date(parts[1] + " " + parts[0] + " " + parts[2]);
	       // return moment(dtDOB).format("DD MMM YYYY");

		}

	}
	
	 return false;
}


getMonth = function(data)
{
	return months.indexOf(data)
}

titleCase = function(str) {
	//[^\s]

  return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
}

