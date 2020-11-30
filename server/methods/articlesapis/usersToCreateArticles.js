
Meteor.publish('usersToCreateArticles', function(searchValue, searchRole) {
    try{
    if (searchValue != null && searchValue != undefined) {
        var reObj = new RegExp('^'+searchValue.trim(), 'i');
        if (searchRole) {
            if (searchRole == "Coach") {
                var lData = otherUsers.find({userName: {
                            $regex: reObj
                        },role:"Coach"
                    }, {
                sort: {
                    userName: 1
                },
                fields: {
                    userName: 1,
                    userId: 1
                },
                limit: 15
            	});    
            	return lData
            } 
            else if (searchRole == "Player") {
            	var lData = Meteor.users.find(
                    {userName: {
                            $regex: reObj
                        },"role":"Player"}, {
                sort: {
                    userName: 1
                },
                fields: {
                    userName: 1,
                    userId: 1
                },
                limit: 15
            	});   
            	return lData 
            }
        }
    }
    }catch(e){
    }
});


Meteor.publish('packsOfPublisherPacks', function(searchValue, searchRole) {
    try{
        var lData = packsOfPublisher.find({});
        return lData
    }catch(e){
    }   
});

Meteor.publish('userSubscribedPacks',function(){
    try{
        var lData = userSubscribedPacks.find({});
        return lData
    }catch(e){
    } 
})

Meteor.publish('packsOfCategoriesPacks', function(searchValue, searchRole) {
    try{
        var lData = categoryOfPublisher.find({});
        return lData
    }catch(e){
    }   
});



Meteor.publish('publishPackages', function() {
    try{
        var raw = userSubscribedPacks.rawCollection();
        var distinct = Meteor.wrapAsync(raw.distinct, raw);                
        var packIdList = distinct('packId');
        //var lData = articlesOfPublisher.find({type:"Packs","_id":{$in:packIdList}});
        var lData = articlesOfPublisher.find({type:"Packs"});

        return lData
    }catch(e){
    }   
});


Meteor.publish('usersInPackage', function() {
    try{
        var raw = userSubscribedPacks.rawCollection();
        var distinct = Meteor.wrapAsync(raw.distinct, raw);                
        var sellerList = distinct('packPayToUserId');
        var buyerList = distinct('userId');
        var userList = sellerList.concat(buyerList);
        var lData = Meteor.users.find({userId:{$in:userList}});
        return lData
    }catch(e){
    }   
});





Meteor.publish('mySubscribedPacks',function(){
    try{
        var lData = userSubscribedPacks.find({"packPayToUserId":this.userId});
        return lData
    }catch(e){
    } 
})



Meteor.publish('myPublishedPackages', function() {
    try{
        var lData = articlesOfPublisher.find({type:"Packs","userId":this.userId});
        return lData
    }catch(e){
    }   
});