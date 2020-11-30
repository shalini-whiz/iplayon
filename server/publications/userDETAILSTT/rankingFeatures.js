Meteor.publish('orgTourPointsPub', function() {
    try{
        var lData = orgTourPoints.find({"organizerId":this.userId});
        return lData
    }catch(e){
    }   
});