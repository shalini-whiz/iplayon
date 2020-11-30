Meteor.publish('academyDetails_OTHER', function(){
    var lData;
    if(this.userId!==undefined){
        var userId = Meteor.users.findOne({"_id":this.userId})
        if(userId!=undefined&&(userId.role=="Association")){
            lData = academyDetails.find({"affiliatedTo":"other"});
            if(lData!=undefined){
                return lData;
            }
            else return this.ready(); 
        }
    }
    else return this.ready(); 
});

Meteor.publish('academiesAffiliatedTo',function(skipCount){
    var lData;
    if(this.userId!=undefined){
        var loggedIn = Meteor.users.findOne({"_id":this.userId});
        if (loggedIn&&loggedIn.userId) {

            if (loggedIn.role&& (loggedIn.role == "Association") && loggedIn.associationType == "State/Province/County"){

                Counts.publish(this, 'academyDetailsTTCOunt', academyDetails.find({
                    associationId:loggedIn.userId,
                    affiliatedTo:"stateAssociation"
                }), { 
                    noReady: true
                });
                lData = academyDetails.find({
                   associationId:loggedIn.userId,
                   affiliatedTo:"stateAssociation"
                },{
                    limit: 10, // records to show per page
                    skip: skipCount
                });
            }

            else if (loggedIn.role&& (loggedIn.role == "Association") && loggedIn.associationType == "District/City"){

                Counts.publish(this, 'academyDetailsTTCOunt', academyDetails.find({
                    associationId:loggedIn.userId,
                    affiliatedTo:"districtAssociation"
                }), { 
                    noReady: true
                });
                lData = academyDetails.find({
                   associationId:loggedIn.userId,
                   affiliatedTo:"districtAssociation"
                },{
                    limit: 10, // records to show per page
                    skip: skipCount
                });

            }
        }
        return lData;
    }
});

Meteor.publish('academiesAffiliatedToSearch_Academy',function(searchValue,skipCount){
    var lData;
    var reObj = new RegExp(searchValue.trim(), 'i');
    if(this.userId!=undefined){
        var loggedIn = Meteor.users.findOne({"_id":this.userId});
        if (loggedIn&&loggedIn.userId) {

            if (loggedIn.role&& (loggedIn.role == "Association") && loggedIn.associationType == "State/Province/County"){

                Counts.publish(this, 'academyDetailsTTCOunt', academyDetails.find({
                    associationId:loggedIn.userId,
                    affiliatedTo:"stateAssociation",
                    clubName: {$regex:reObj},
                }), { 
                    noReady: true
                });
                lData = academyDetails.find({
                   associationId:loggedIn.userId,
                   affiliatedTo:"stateAssociation",
                   clubName: {$regex:reObj},
                },{
                    limit: 10, // records to show per page
                    skip: skipCount
                });
            }

            else if (loggedIn.role&& (loggedIn.role == "Association") && loggedIn.associationType == "District/City"){

                Counts.publish(this, 'academyDetailsTTCOunt', academyDetails.find({
                    associationId:loggedIn.userId,
                    affiliatedTo:"districtAssociation",
                    clubName: {$regex:reObj},
                }), { 
                    noReady: true
                });
                lData = academyDetails.find({
                   associationId:loggedIn.userId,
                   affiliatedTo:"districtAssociation",
                   clubName: {$regex:reObj},
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
    "findBYAbbName",function(abbName){
        check(abbName,String)
        try{
            if(abbName.trim().length!=0){
                var findWho = academyDetails.find(
                        {'abbrevationAcademy':abbName.toUpperCase()}
                    );
                if(findWho){
                    return findWho
                }
                else return undefined
            }        
        }catch(e){
            
        }
    }
);

