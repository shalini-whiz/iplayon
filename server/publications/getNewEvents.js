/*Meteor.publish('upcomingListsChanged', function() {
var jsonS = []
lUserId = Meteor.users.find({"_id":this.userId}).fetch();
                var eve=events.find({$or: [{
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
                },
                tournamentEvent:true
 }).fetch().forEach(function(lEvents,i){
                    var getCountryId = timeZone.findOne({
                         "state": { $elemMatch: { "stateId": lEvents.domainId.toString() } }
                        });
                    var uf = moment.utc(getCountryId.timeStamp*1000).format("YYYY/DD/MMM hh:mm a");
                    var uf1 = new Date(uf).getTime()/1000;
                    var d1 = moment(getCountryId.timeStampUpdatedDate).format();
                    var diff = Math.abs(new Date(d1) - new Date());
                    var diffh = (diff/1000)
                    var now = new Date(uf1*1000);
                    now.setSeconds(now.getSeconds() + diffh);
                    var nowing = new Date(now).getTime()/1000;
                    var dateT2 = (new Date(lEvents.eventEndDate1)).getTime()/1000;
                    var uf4 = moment.utc(dateT2*1000).zone(lEvents.offset).format("YYYY/DD/MMM hh:mm a");
                    var uf5 = new Date(uf4).getTime()/1000;
                    if(moment(uf5*1000)>=moment(nowing*1000)){
                    jsonS.push(lEvents)
                    }
                    else{
                    }
                })
return jsonS
});*/