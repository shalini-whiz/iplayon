Meteor.publish('subscriptionRestrictionsPub', function(){
    var lData;
    if(this.userId!==undefined){
        var userId = Meteor.users.findOne({"_id":this.userId})
        if(userId!=undefined){
            lData = subscriptionRestrictions.find({});
            if(lData!=undefined){
                return lData;
            }
            else return this.ready(); 
        }
    }
    else return this.ready(); 
});

Meteor.publish('subscriptionRestrictionsParam', function(param){
    var lData;
    if(this.userId!==undefined){
        var userId = Meteor.users.findOne({"_id":this.userId})
        if(userId!=undefined){
            lData = subscriptionRestrictions.find({"eventOrganizerId":userId.userId,"tournamentId":param});
            if(lData!=undefined){
                return lData;
            }
            else return this.ready(); 
        }
    }
    else return this.ready(); 
});