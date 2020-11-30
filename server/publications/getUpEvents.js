/*Meteor.publish( 'upEvents', function(){
        //check(limit,Number);
        //check(userId,String)
        // Meteor.http.call("PUT", "http://blah");
       //  var sss = Meteor.http.call("GET",  "http://api.timezonedb.com/?zone=Australia/Melbourne&format=json&key=MR22FNA90DU3")
         
        if(this.userId!==undefined){
        lUserId = Meteor.users.find({"_id":this.userId}).fetch();

        if(lUserId.length!=0){
         var s = events.find({
            $or: [{
                    domainId: {
                        $in: lUserId[0].interestedDomainName
                    }
                }, {
                    subDomain1Name: {
                        $in: lUserId[0].interestedSubDomain1Name
                    }
                }, {
                    subDomain2Name: {
                        $in: lUserId[0].interestedSubDomain2Name
                    }
                }],
                projectId: {
                    $in:lUserId[0].interestedProjectName
                }
         });

        if(s)
            return s;
        else
            return this.ready()
    }
}        else
            return this.ready()

});*/