export const initDBS = function(type) {
    return initDBSCol(type)    
}

export const getDbNameforARole = function(role){
    return getDbNameforARoleCol(role)
}

Meteor.methods({
    "getDbNameforARoleMethod":function(role){
        try{
            var roleFind = getDbNameforARole(role)
            return roleFind
        }catch(e){
            return false
        }
    }
})

export const emailRegex = function(email) {
    return emailRegexCol(email)
}

export const tourSelectionType = function(userId){
    return tourSelectionTypeCol(userId)
}

export const nameToCollection = function(userId) {
    return nameToCollectionCol(userId)
};


export const playerDBFind = function(sportId) {
    return playerDBFindCol(sportId)
}

//use this only for client
Meteor.methods({
    "getSportsMainDB": function(sportId) 
    {
        try{
        if (sportId == undefined || sportId == null || sportId == false) {
            var usersd = Meteor.users.findOne({
                userId: this.userId
            })
            if (usersd && usersd.interestedProjectName &&
                usersd.interestedProjectName.length != 0) {
                if (usersd.interestedProjectName[0]) {
                    sportId = usersd.interestedProjectName[0]
                } else {
                    return 2
                }
            } else {
                return 2
            }
        }
        if (sportId) {
            var toret = playerDBFind(sportId);
            return toret
        } else {
            return 2
        }
        }catch(e){
        }
    }
})

/*
Meteor.call("getSportsMainDB",false,function(e,res){
        if(res != undefined && res != null && res != false){
            toRet = res
            Session.set("playerDBName",toRet)
        }
        else if(res != undefined && res != null && res == false){
            toRet = false
            Session.set("playerDBName",toRet)
        }
        else if(e){
            toRet = false
            Session.set("playerDBName",toRet)
        }
    })
var nameToCollection = function(name) {
  // pluralize and capitalize name, then find it on the global object
  // 'post' -> global['Posts'] (server)
  // 'post' -> window['Posts'] (client)
  return this[name];
};
nameToCollection(Session.get("playerDBName")).find({ userName: {$regex:reObj},role:"Player"}).fetch();*/