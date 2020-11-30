Meteor.publish('eventsForHomePage',function(){
    var lData = events.find({tournamentEvent:true},{limit:2});
    if(lData){
        return lData
    }
    else return this.ready(); 
});