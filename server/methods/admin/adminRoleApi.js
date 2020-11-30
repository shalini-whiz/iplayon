import { playerDBFind } from '../dbRequiredRole.js'

Meteor.methods({

	"removeAcademy":function(userId)
	{
		try{
			var academyInfo = userExistsByRole(userId,"academy");
			if(academyInfo && academyInfo.interestedProjectName)
			{
				var toret = "userDetailsTT";
				var acaSport = academyInfo.interestedProjectName;

                if(acaSport && acaSport.length != 0)
                {
                    var dbtoret = playerDBFind(acaSport)
                    if(dbtoret != false)
                        toret = dbtoret
                        
                }

                var userExists = global[toret].find({"clubNameId": academyInfo.userId}).fetch();
                if(userExists.length > 0)
                {
                	return userExists.length+" players exists under "+academyInfo.clubName+" and cannot be removed"
                }
                else
                {
                	var res1 = Meteor.users.remove({"userId":userId});
                	var res2 = academyDetails.remove({"userId":userId})
                	if(res1 && res2)
                		return removeAcaMsg;
                	
                }
			}
			else
			{
				return invalidAcaMsg;

			}
		}catch(e){
			console.log(e)
			return e;
		}
	},
    "playerAcademySwap":function(playerId,academyId)
    {
        try{

            var playerInfo = userExistsByRole(playerId,"player");
            var academyInfo = userExistsByRole(academyId,"academy");
            let acaDetails = academyDetails.findOne({"userId":academyId})

            if(playerInfo && academyInfo && academyInfo.interestedProjectName && acaDetails)
            {
                var toret = "userDetailsTT";
                var playerSport = playerInfo.interestedProjectName;

                if(playerSport && playerSport.length != 0)
                {
                    var dbtoret = playerDBFind(playerSport)
                    if(dbtoret != false)
                        toret = dbtoret    
                }

                var userExists = global[toret].findOne({"userId": playerId});
                if(userExists)
                {
                    //set club and relevant association here
                    let interestedDomainName = [];
                    let interestedProjectName = [];
                    let parentAssociationId = "";
                    let associationId = "";
                    if(acaDetails.interestedDomainName) interestedDomainName = acaDetails.interestedDomainName
                    if(acaDetails.interestedProjectName)  interestedProjectName = acaDetails.interestedProjectName;
                        
                    var academyParent = associationDetails.findOne({
                            "userId": acaDetails.associationId
                        });
                    if (academyParent && academyParent.associationType == "District/City") 
                    {
                        if(academyParent.parentAssociationId)
                            parentAssociationId = academyParent.parentAssociationId;
                        if(academyParent.userId)
                            associationId = academyParent.userId
                    }
                    if (academyParent && academyParent.associationType == "State/Province/County") {
                        parentAssociationId = "";
                        if(academyParent.userId)
                            associationId = academyParent.userId;
                    }

                    let setQuery = {};
                    setQuery["associationId"] = associationId;
                    setQuery["interestedProjectName"] = interestedProjectName;
                    setQuery["interestedDomainName"] =interestedDomainName;
                    setQuery["affiliatedTo"] = "academy"
                    setQuery["clubNameId"] = academyId
                    if (academyParent && academyParent.associationType == "District/City") 
                    {
                        setQuery["parentAssociationId"] = parentAssociationId
                    }
                    let userDetailUpdate = global[toret].update({
                        "userId": playerId
                        }, {$set: setQuery});
                            
                    let userUpdate = Meteor.users.update({
                        "userId":playerId},
                        {$set:{"interestedProjectName": interestedProjectName}})

                    if(userDetailUpdate || userUpdate)
                    {
                        return userExists.userName+" : New academy "+acaDetails.clubName;
                    }
                }
                else
                {
                    return "Use rprofile doesn't exist";

                }
            }
            else
            {
                return "Invalid player/academy"
            }
        }catch(e){
            console.log(e)
            return e;
        }
    }
})