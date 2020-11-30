Meteor.publish('associationDetails_OTHER', function(){
    var lData;
    if(this.userId!==undefined){
        var userId = Meteor.users.findOne({"_id":this.userId})
        if(userId!=undefined&&(userId.role=="Association")){
            lData = associationDetails.find({"affiliatedTo":"other","associationType" : "District/City"});
            if(lData!=undefined){
                return lData;
            }
            else return this.ready(); 
        }
    }
    else return this.ready(); 
});


Meteor.publish('districtAssocsAffiliatedTo',function(skipCount){
    var lData;
    if(this.userId!=undefined){
        var loggedIn = Meteor.users.findOne({"_id":this.userId});
        if (loggedIn&&loggedIn.userId) {

            if (loggedIn.role&& (loggedIn.role == "Association") && loggedIn.associationType == "State/Province/County"){

                Counts.publish(this, 'daDetailsTTCOunt', associationDetails.find({
                    parentAssociationId:loggedIn.userId,
                    affiliatedTo:"stateAssociation"
                }), { 
                    noReady: true
                });
                lData = associationDetails.find({
                   parentAssociationId:loggedIn.userId,
                   affiliatedTo:"stateAssociation"
                },{
                    limit: 10, // records to show per page
                    skip: skipCount
                });
            }
        }
        return lData;
    }
});

Meteor.publish('daAffiliatedToSearch_da',function(searchValue,skipCount){
    var lData;
    var reObj = new RegExp(searchValue.trim(), 'i');
    if(this.userId!=undefined){
        var loggedIn = Meteor.users.findOne({"_id":this.userId});
        if (loggedIn&&loggedIn.userId) {

            if (loggedIn.role&& (loggedIn.role == "Association") && loggedIn.associationType == "State/Province/County"){

                Counts.publish(this, 'daDetailsTTCOunt', associationDetails.find({
                    parentAssociationId:loggedIn.userId,
                    affiliatedTo:"stateAssociation",
                    associationName: {$regex:reObj},
                }), { 
                    noReady: true
                });
                lData = associationDetails.find({
                   parentAssociationId:loggedIn.userId,
                   affiliatedTo:"stateAssociation",
                   associationName: {$regex:reObj},
                },{
                    limit: 10, // records to show per page
                    skip: skipCount
                });
            }
        }
        return lData;
    }
});

Meteor.publish(
    "findBYAbbNameDA",function(abbName){
        check(abbName,String)
        try{
            if(abbName.trim().length!=0){
                var findWho = associationDetails.find(
                        {'abbrevationAssociation':abbName.toUpperCase()}
                    )
                if(findWho){
                    return findWho
                }
                else return undefined
            }
        }catch(e){
            
        }
    }
);

Meteor.publish(
    "associationOrAcademies",function(){
        var userId = this.userId;
        if(userId){
            var findWho = Meteor.users.findOne({"userId":this.userId});
            /*if(findWho&&findWho.role="Association"&&findWho.associationType=="State/Province/County"){
                var assocDetails = associationDetails.find({parentAssociationId:findWho.userId,associationType:"District/City"})
                if(assocDetails)
                    return assocDetails
                return this.ready()
            }
            else*/ 
            if(findWho&&findWho.role=="Association"&&findWho.associationType=="District/City"){
                var assocDetails = associationDetails.findOne({userId:findWho.userId,affiliatedTo:"stateAssociation"});
                if(assocDetails&&assocDetails.parentAssociationId&&assocDetails.parentAssociationId!="other"){
                    var assocDetailsReturn = associationDetails.find({parentAssociationId:assocDetails.parentAssociationId,associationType:"District/City"},{fields:{associationName:1,userId:1}})
                    if(assocDetailsReturn){
                        return assocDetailsReturn;
                    }
                    return this.ready()
                }
            }
            else if(findWho&&findWho.role=="Academy"){
                var acadDetaisl = academyDetails.findOne({userId:findWho.userId,
                    $or:[
                        {affiliatedTo:"stateAssociation"},
                        {affiliatedTo:"districtAssociation"}
                    ]
                });
                if(acadDetaisl){
                    if(acadDetaisl.associationId&&acadDetaisl.associationId!="other"){
                        var asocDets = associationDetails.findOne({userId:acadDetaisl.associationId});
                        if(asocDets&&asocDets.associationType=="District/City"){
                            var acadDetailsReturn = academyDetails.find({associationId:acadDetaisl.associationId,affiliatedTo:"districtAssociation"},{fields:{clubName:1,userId:1}});
                            if(acadDetailsReturn)
                                return acadDetailsReturn;
                            return this.ready()
                        }
                        if(asocDets&&asocDets.associationType=="State/Province/County"){
                            var acadDetailsReturn = academyDetails.find({associationId:acadDetaisl.associationId,affiliatedTo:"stateAssociation"},{fields:{clubName:1,userId:1}});
                            if(acadDetailsReturn)
                                return acadDetailsReturn;
                            return this.ready()
                        }
                    }
                }
            }
        }
    }
)