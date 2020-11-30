


Meteor.publish( 'orgTeamMatchFormatPub', function(){
    var userInfo = Meteor.users.findOne({"_id":this.userId})
    if(userInfo!=undefined)
    {
        var lData = orgTeamMatchFormat.find({"organizerId":userInfo.userId.toString()});
        if(lData!=undefined){
            return lData;
        }
        else return this.ready(); 
     }   
});