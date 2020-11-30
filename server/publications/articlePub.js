Meteor.publish('packageFeatures', function(searchValue, searchRole) {
    try{
        var lData = packFeatures.find({});
        return lData
    }catch(e){
    }   
});



Meteor.publish('accountDetailsPub', function() {
    try{
    	var raw = userSubscribedPacks.rawCollection();
        var distinct = Meteor.wrapAsync(raw.distinct, raw);                
        var userIdList = distinct('packPayToUserId');
        var lData = accountDetails.find({"userId":{$in:userIdList}});
        return lData
    }catch(e){
    }   
});


Meteor.publish('myAccountDetailsPub', function() {
    try{

        var lData = accountDetails.find({"userId":this.userId});
        return lData
    }catch(e){
    }   
});

Meteor.publish('taxDetailsPub', function() {
    try{
        var lData = taxDetails.find({});
        return lData
    }catch(e){
    }    
});


Meteor.publish('customDataDBPub', function() {
    try{
        var lData = customDataDB.find({});
        return lData
    }catch(e){
    }    
});


Meteor.publish('articlesPub', function() {
    try{
        var lData = articlesOfPublisher.find({"type":"Articles","adminStatus":"pending"});
        return lData
    }catch(e){
    }    
});


Meteor.publish('usersInArticles', function() {
    try{
        var raw = articlesOfPublisher.rawCollection();
        var distinct = Meteor.wrapAsync(raw.distinct, raw);                
        var userList = distinct('userId',{"type":"Articles","adminStatus":"pending"});
        var lData = Meteor.users.find({userId:{$in:userList}});
        return lData
    }catch(e){
    }   
});


/****************************************************/

Meteor.publish('workAssPub', function() {
    try{
        var lData = workAssignments.find({});
        return lData
    }catch(e){
    }    
});


Meteor.publish('senderInworkAssPub', function() {
    try{
        
        var raw = workAssignments.rawCollection();
        var distinct = Meteor.wrapAsync(raw.distinct, raw);                
        var userList1 = distinct('senderId');
        var userList2 = distinct('receiverId',{"receiverRole":{$nin:["Group"]}});
        var userList = userList1.concat(userList2);
        var lData = Meteor.users.find({userId:{$in:userList}});
        return lData
    }catch(e){
    }    
});

Meteor.publish('groupInworkAssPub', function() {
    try{
        
        var raw = workAssignments.rawCollection();
        var distinct = Meteor.wrapAsync(raw.distinct, raw);                
        var userList = distinct('receiverId',{"receiverRole":"Group"});
        var lData = coachConnectedGroups.find({"_id":{$in:userList}});
        return lData
    }catch(e){
    }    
});

/*******************************************************/


Meteor.publish('messagesSentPub', function() {
    try{
        var lData = coachAPPINSentBOX.find({});
        return lData
    }catch(e){
    }    
});


Meteor.publish('senderInmessagesSentPub', function() {
    try{
        
        var raw = coachAPPINSentBOX.rawCollection();
        var distinct = Meteor.wrapAsync(raw.distinct, raw);                
        var userList1 = distinct('senderId');
        var userList2 = distinct('receiverId',{"receiverRole":{$nin:["Group"]}});
        var userList = userList1.concat(userList2);
        var lData = Meteor.users.find({userId:{$in:userList}});
        return lData
    }catch(e){
    }    
});

Meteor.publish('groupInmessagesSentPub', function() {
    try{
        
        var raw = coachAPPINSentBOX.rawCollection();
        var distinct = Meteor.wrapAsync(raw.distinct, raw);                
        var userList = distinct('receiverId',{"receiverRole":"Group"});
        var lData = coachConnectedGroups.find({"_id":{$in:userList}});
        return lData
    }catch(e){
    }    
});


/************************************************************/

