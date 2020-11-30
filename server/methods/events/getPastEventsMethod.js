/*Meteor.methods({
    "getPastdatedEvents":function(){
var jsonS = []
lUserId = Meteor.users.find({"_id":Meteor.userId()}).fetch();
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
                    var getCountryId = timeoffset.findOne({
                         "state": { $elemMatch: { "stateId": lEvents.domainId.toString() } }
                        });
                    var uf = moment.utc(getCountryId.timeStamp*1000).format("YYYY/DD/MMM")// hh:mm a");
                    var uf1 = new Date(uf).getTime()/1000;
                    var d1 = moment(getCountryId.timeStampUpdatedDate).format();
                    var diff = Math.abs(new Date(d1) - new Date());
                    var diffh = (diff/1000)
                    var now = new Date(uf1*1000);
                    now.setSeconds(now.getSeconds() + diffh);
                    var nowing = new Date(now).getTime()/1000;
                    var dateT2 = (new Date(lEvents.eventEndDate1)).getTime()/1000;
                    var uf4 = moment.utc(dateT2*1000).offset(lEvents.offset).format("YYYY/DD/MMM")// hh:mm a");
                    var uf5 = new Date(uf4).getTime()/1000;
                    if(moment(uf5*1000).startOf('day')<moment(nowing*1000).startOf('day')){
                    jsonS.push(lEvents)
                    }
                    else{
                    }
                })
return jsonS
    }
});


Meteor.methods({
    "getPastEventsEventNameSort":function(){
var jsonS = []
lUserId = Meteor.users.find({"_id":Meteor.userId()}).fetch();
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
         }, {sort:{eventName:1}}).fetch().forEach(function(lEvents,i){
                    var getCountryId = timeoffset.findOne({
                         "state": { $elemMatch: { "stateId": lEvents.domainId.toString() } }
                        });
                    var uf = moment.utc(getCountryId.timeStamp*1000).format("YYYY/DD/MMM");
                    var uf1 = new Date(uf).getTime()/1000;
                    var d1 = moment(getCountryId.timeStampUpdatedDate).format();
                    var diff = Math.abs(new Date(d1) - new Date());
                    var diffh = (diff/1000)
                    var now = new Date(uf1*1000);
                    now.setSeconds(now.getSeconds() + diffh);
                    var nowing = new Date(now).getTime()/1000;
                    var dateT2 = (new Date(lEvents.eventEndDate1)).getTime()/1000;
                    var uf4 = moment.utc(dateT2*1000).offset(lEvents.offset).format("YYYY/DD/MMM");
                    var uf5 = new Date(uf4).getTime()/1000;
                    if(moment(uf5*1000).startOf('day')<moment(nowing*1000).startOf('day')){
                    jsonS.push(lEvents)
                    }
                    else{
                    }
                })
return jsonS
    }
});


Meteor.methods({
    "getPastEventsDomainNameSort":function(){
var jsonS = []
lUserId = Meteor.users.find({"_id":Meteor.userId()}).fetch();
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
         }, {sort:{domainName:1}}).fetch().forEach(function(lEvents,i){
                    var getCountryId = timeoffset.findOne({
                         "state": { $elemMatch: { "stateId": lEvents.domainId.toString() } }
                        });
                    var uf = moment.utc(getCountryId.timeStamp*1000).format("YYYY/DD/MMM")// hh:mm a");
                    var uf1 = new Date(uf).getTime()/1000;
                    var d1 = moment(getCountryId.timeStampUpdatedDate).format();
                    var diff = Math.abs(new Date(d1) - new Date());
                    var diffh = (diff/1000)
                    var now = new Date(uf1*1000);
                    now.setSeconds(now.getSeconds() + diffh);
                    var nowing = new Date(now).getTime()/1000;
                    var dateT2 = (new Date(lEvents.eventEndDate1)).getTime()/1000;
                    var uf4 = moment.utc(dateT2*1000).offset(lEvents.offset).format("YYYY/DD/MMM")// hh:mm a");
                    var uf5 = new Date(uf4).getTime()/1000;
                    if(moment(uf5*1000).startOf('day')<moment(nowing*1000).startOf('day')){
                    jsonS.push(lEvents)
                    }
                    else{
                    }
                })
return jsonS
    }
});

Meteor.methods({
    "getPastEventsEventStartDateSort":function(){
var jsonS = []
lUserId = Meteor.users.find({"_id":Meteor.userId()}).fetch();
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
         }, {sort:{eventStartDate1:1}}).fetch().forEach(function(lEvents,i){
                    var getCountryId = timeoffset.findOne({
                         "state": { $elemMatch: { "stateId": lEvents.domainId.toString() } }
                        });
                    var uf = moment.utc(getCountryId.timeStamp*1000).format("YYYY/DD/MMM")// hh:mm a");
                    var uf1 = new Date(uf).getTime()/1000;
                    var d1 = moment(getCountryId.timeStampUpdatedDate).format();
                    var diff = Math.abs(new Date(d1) - new Date());
                    var diffh = (diff/1000)
                    var now = new Date(uf1*1000);
                    now.setSeconds(now.getSeconds() + diffh);
                    var nowing = new Date(now).getTime()/1000;
                    var dateT2 = (new Date(lEvents.eventEndDate1)).getTime()/1000;
                    var uf4 = moment.utc(dateT2*1000).offset(lEvents.offset).format("YYYY/DD/MMM")// hh:mm a");
                    var uf5 = new Date(uf4).getTime()/1000;
                    if(moment(uf5*1000).startOf('day')<moment(nowing*1000).startOf('day')){
                    jsonS.push(lEvents)
                    }
                    else{
                    }
                })
return jsonS
    }
});

Meteor.methods({
    "eventsPastUnderTournHelper":function(xData){
        
        try{
        check(xData,String)
        }catch(e){}
        var jsonSaa="";
        var s = events.find({"_id":xData}).forEach(function(lEvents,i){
                    var getCountryId = timeoffset.findOne({
                         "state": { $elemMatch: { "stateId": lEvents.domainId.toString() } }
                        });
                    var uf = moment.utc(getCountryId.timeStamp*1000).format("YYYY/DD/MMM")// hh:mm a");
                    var uf1 = new Date(uf).getTime()/1000;
                    var d1 = moment(getCountryId.timeStampUpdatedDate).format();
                    var diff = Math.abs(new Date(d1) - new Date());
                    var diffh = (diff/1000)
                    var now = new Date(uf1*1000);
                    now.setSeconds(now.getSeconds() + diffh);
                    var nowing = new Date(now).getTime()/1000;
                    var dateT2 = (new Date(lEvents.eventEndDate1)).getTime()/1000;
                    var uf4 = moment.utc(dateT2*1000).offset(lEvents.offset).format("YYYY/DD/MMM")// hh:mm a");
                    var uf5 = new Date(uf4).getTime()/1000;
                    if(moment(uf5*1000).startOf('day')<moment(nowing*1000).startOf('day')){
                        jsonSaa=lEvents.eventName
                        //return true
                    }
                    else{
                        jsonSaa=false
                        //return false
                        
                    }
                })return jsonSaa;
    }
});

Meteor.methods({
    "eventSubLastUnderTournHelper":function(xData){
        try{
        check(xData,String)
        }catch(e){}
        var jsonSaa="";
        var s = events.find({"_id":xData}).fetch().forEach(function(lEvents,i){
                    var getCountryId = timeoffset.findOne({
                         "state": { $elemMatch: { "stateId": lEvents.domainId.toString() } }
                        });
                    var uf = moment.utc(getCountryId.timeStamp*1000).format("YYYY/DD/MMM");
                    var uf1 = new Date(uf).getTime()/1000;
                    var d1 = moment(getCountryId.timeStampUpdatedDate).format();
                    var diff = Math.abs(new Date(d1) - new Date());
                    var diffh = (diff/1000)
                    var now = new Date(uf1*1000);
                    now.setSeconds(now.getSeconds() + diffh);
                    var nowing = new Date(now).getTime()/1000;
                    var dateT2 = (new Date(lEvents.eventSubscriptionLastDate1)).getTime()/1000;
                    var uf4 = moment.utc(dateT2*1000).offset(lEvents.offset).format("YYYY/DD/MMM");
                    var uf5 = new Date(uf4).getTime()/1000;
                    //to use only date.startOf('day')
                    if(moment(uf5*1000).startOf('day')<moment(nowing*1000).startOf('day')){
                        jsonSaa=false
                        //return true
                    }
                    else{
                        jsonSaa=true
                    }
                })
return jsonSaa;
    }
});*/

/*Meteor.methods({
    "eventSubLastUnderTournHelper2":function(xData){
        try{
        check(xData,String)
        }catch(e){}
        var jsonSaa="";
        var s = events.find({"_id":xData}).fetch().forEach(function(lEvents,i){
                    var getCountryId = timeoffset.findOne({
                         "state": { $elemMatch: { "stateId": lEvents.domainId.toString() } }
                        });
                    var uf = moment.utc(getCountryId.timeStamp*1000).format("YYYY/DD/MMM");
                    var uf1 = new Date(uf).getTime()/1000;
                    var d1 = moment(getCountryId.timeStampUpdatedDate).format();
                    var diff = Math.abs(new Date(d1) - new Date());
                    var diffh = (diff/1000)
                    var now = new Date(uf1*1000);
                    now.setSeconds(now.getSeconds() + diffh);
                    var nowing = new Date(now).getTime()/1000;
                    var dateT2 = (new Date(lEvents.eventEndDate1)).getTime()/1000;
                    var dateT = (new Date(lEvents.eventStartDate1)).getTime()/1000;
                    var dateT3 = (new Date(lEvents.eventEndDate1)).getTime()/1000;
                    var uf4 = moment.utc(dateT2*1000).offset(lEvents.offset).format("YYYY/DD/MMM");
                    var uf5 = new Date(uf4).getTime()/1000;
//
                        var uf2 = moment.utc(dateT*1000).offset(lEvents.offset).format("YYYY/DD/MMM");
                        var uf3 = new Date(uf2).getTime()/1000
                        var uf6 = moment.utc(dateT3*1000).offset(lEvents.offset).format("YYYY/DD/MMM");
                        var uf7 = new Date(uf6).getTime()/1000
                        if((moment(uf3*1000).startOf('day')<=moment(uf1*1000).startOf('day')&&moment(uf7*1000).startOf('day')>=moment(uf1*1000).startOf('day'))||(moment(uf5*1000).startOf('day')<moment(nowing*1000).startOf('day'))){
                            jsonSaa=true
                        }


                    else{
                        jsonSaa=false
                    }
                })
return jsonSaa;
    }
});*/


