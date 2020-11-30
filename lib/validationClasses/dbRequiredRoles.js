initDBSCol = function(type) {
    try{
    var toretty = false
    var getDB = adminSportsRoles.findOne({})
    if (getDB && getDB.dbNames && type == "dbsrequiredAll") {
        dbsrequiredAll = getDB.dbNames
        toretty = dbsrequiredAll
    } else if (getDB && getDB.roles && type == "roles") {
        roles = getDB.roles
        toretty = roles
    } else if (getDB && getDB.sports && type == "sports") {
        sports = getDB.sports
        toretty = sports
    } else if (getDB && getDB.playersDB && type == "playersDB") {
        playersDB = getDB.playersDB
        toretty = playersDB
    } else if (getDB && getDB.indexToSkip && type == "indexToSkip") {
        indexToSkip = getDB.indexToSkip
        toretty = indexToSkip
    } else if (getDB && getDB.indicesOfPlayers && type == "indicesOfPlayers") {
        indicesOfPlayers = getDB.indicesOfPlayers
        toretty = indicesOfPlayers
    }
    return toretty
    }catch(e){
        console.log(e)
    }   
}

getDbNameforARoleCol = function(role){
    try{
    var toretty = false
    var getDB = adminSportsRoles.findOne({})
    if (getDB && getDB.roles && getDB.dbNames) {
        var roles = getDB.roles
        var dbNames = getDB.dbNames
        if(_.contains(roles,role.toLowerCase())){
            var ind = _.indexOf(roles,role.toLowerCase())
            if(ind>=0){
                if(ind<=getDB.indexToSkip&&dbNames[ind]){
                    toretty = dbNames[ind]
                }else if(dbNames[getDB.dbNames.length-1]){
                    toretty = dbNames[getDB.dbNames.length-1]
                }
            }
        }
    }

    return toretty
    }catch(e){
        console.log(e)
    }
}



emailRegexCol = function(email) {
    try{
        if(email)
        {
            var s = new RegExp('^' + email.trim() + '$', "i")
            return s
        }
    
    }catch(e){
        console.log(e)
    }
}

tourSelectionTypeCol = function(userId){
    try{
        var selectionTypeArr = ["selfOnly","allSub","resrictP","pickASSAC","allExceptSchool","schoolOnly"]
        var genericSelectionTypeArr = ["selfOnly","allSub"]
        var organizerSelectionTypeArr = ["allExceptSchool","schoolOnly"];
        var affilitedSelectionTypeArr = ["selfOnly","allSub","resrictP","pickASSAC"];

        var userInfo = Meteor.users.findOne({"userId":userId});
        if(userInfo)
        {
            if(userInfo.role == "Organiser")
            {
                var data  = {};
                data["selectionType"] = organizerSelectionTypeArr;
                data["selectionId"] = [];
                return data;
            }
            else if(userInfo.role == "Association" && userInfo.associationType == "State/Province/Country")
            {
                var data  = {};
                data["selectionType"] = genericSelectionTypeArr;
                data["selectionId"] = [];
                return data;
            }
            else if(userInfo.role == "Association" && userInfo.associationType == "District/City")
            {
                var assocInfo = associationDetails.findOne({"userId":userId});
                if(assocInfo){
                    if(assocInfo.affiliatedTo == "other")
                    {
                        var data  = {};
                        data["selectionType"] = genericSelectionTypeArr;
                        data["selectionId"] = [];
                        return data;
                    }
                    else if(assocInfo.affiliatedTo == "stateAssociation")
                    {
                        var selectedIdsInfo  = associationDetails.find({
                            "parentAssociationId" : assocInfo.parentAssociationId,
                            "affiliatedTo" :"stateAssociation",
                            },{
                                fields: {
                                "_id": 0,
                                "userId":1,
                                "associationName":1
                            }}).fetch()
                        var data  = {};
                        data["selectionType"] = affilitedSelectionTypeArr;
                        data["selectionId"] = selectedIdsInfo;
                        return data;
                    }  
                }
                
            }
            else if(userInfo.role == "Academy")
            {
                var academyInfo = academyDetails.findOne({"userId":userId})
                if(academyInfo)
                {
                    if(academyInfo.affiliatedTo == "other" )
                    {
                        var data  = {};
                        data["selectionType"] = genericSelectionTypeArr;
                        data["selectionId"] = [];
                        return data;
                    }
                    else if(academyInfo.affiliatedTo == "districtAssociation")
                    {
                        //clubName userId
                        var selectedIdsInfo  = academyDetails.find({
                            "associationId":academyInfo.associationId,
                            "parentAssociationId" : academyInfo.parentAssociationId,
                            "affiliatedTo" :"districtAssociation",
                            },{
                                fields: {
                                "_id": 0,
                                "userId":1,
                                "clubName":1
                            }}).fetch();
                        var data  = {};
                        data["selectionType"] = affilitedSelectionTypeArr;
                        data["selectionId"] = selectedIdsInfo;
                        return data;
                    }
                    else if(academyInfo.affiliatedTo == "stateAssociation")
                    {
                        var selectedIdsInfo  = academyDetails.find({
                            "associationId" : academyInfo.associationId,
                            "affiliatedTo" :"stateAssociation",
                            },{
                                fields: {
                                "_id": 0,
                                "userId":1,
                                "clubName":1
                            }}).fetch();

                         var data  = {};
                        data["selectionType"] = affilitedSelectionTypeArr;
                        data["selectionId"] = selectedIdsInfo;
                        return data;
                    }
                }
            }



        }
    }catch(e){
        console.log(e)
    }
}

nameToCollectionCol = function(userId) {
    try{
    var userInfo = Meteor.users.findOne({
        "userId": userId
    });
    //userDetailsTTUsed
    if (userInfo) 
    {
        if (userInfo.interestedProjectName && userInfo.interestedProjectName.length > 0) 
        {
            if(userInfo.interestedProjectName[0] == null || userInfo.interestedProjectName[0] == "")
                return this["userDetailsTT"];
            else
            {
              var dbName = playerDBFindCol(userInfo.interestedProjectName[0]);
                return this[dbName]  
            }
            
        } else
            return this["userDetailsTT"];

    } else if (userId) {
        var dbName = playerDBFindCol(userId);
        if (dbName) {
            return this[dbName];
        } else
            return this["userDetailsTT"];
    } else
        return this["userDetailsTT"];
    }catch(e){
        console.log(e)
    }
};


playerDBFindCol = function(sportId) {
    try {
        var playersDB = initDBSCol("playersDB")
        var sports = initDBSCol("sports")
        if(sportId){
            var projectFind = mainProjects.findOne({
                "_id": sportId.toString().trim()
            })

            if (projectFind && projectFind.projectMainName) 
            {
                if (_.contains(sports, projectFind.projectMainName)) {
                    var indOfsport = _.indexOf(sports, projectFind.projectMainName)

                    if (playersDB[indOfsport]) {
                        return playersDB[indOfsport]
                    } else {
                        return false
                    }
                } else {
                    return false
                }
            } else {
                return false
            }
        }
    } catch (e) {
        console.log(e)
        return false
    }
}



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