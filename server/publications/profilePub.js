Meteor.publish('languagesPub', function(searchValue, searchRole) {
    try{
        var lData = languages.find({});
        return lData
    }catch(e){
    }   
});

Meteor.publish('expertisePub', function(searchValue, searchRole) {
    try{
        var lData = expertise.find({});
        return lData
    }catch(e){
    }   
});
