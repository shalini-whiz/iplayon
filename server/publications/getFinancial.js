


Meteor.publish('getPlayersFinancial', function(skipCount, tournamentId) {
    var players;
    try {
        var dbsrequired = ["playerEntries"]
        var playerEntries = "playerEntries"

        if (tournamentId) {
            var tournamentId = tournamentId;
            var tournamentFind = events.findOne({"_id":tournamentId})
            if(tournamentFind==undefined||tournamentFind==null){
                    tournamentFind = pastEvents.findOne({
                        "_id": tournamentId
                    })
                }
            if(tournamentFind==undefined||tournamentFind==null){
                tournamentFind = pastEvents.findOne({
                    "_id": tournamentId
                })
            }
            var res = Meteor.call("changeDbNameForDraws", tournamentFind,dbsrequired)
            try {
                if(res){
                    if(res.changeDb && res.changeDb == true){
                        if(res.changedDbNames.length!=0){
                            playerEntries = res.changedDbNames[0]
                        }
                    }
                }
            }catch(e){}
        }

        var sum = 0;
        var feesValue = eventFeeSettings.findOne({
            "tournamentId": tournamentId
        })
        if (feesValue && feesValue.singleEventFees) {
            var arrayFees = feesValue.singleEventFees
            sum = _.reduce(arrayFees, function(memo, num) {
                return parseInt(memo) + parseInt(num);
            }, 0)
        }
        if (sum > 0) {
            Counts.publish(this, 'players_financial_Count', global[playerEntries].find({
                "tournamentId": tournamentId,
                "totalFee": {
                    $nin: ["0", 0]
                }
            }), {
                noReady: true
            });
            players = global[playerEntries].find({
                "tournamentId": tournamentId,
                "totalFee": {
                    $nin: ["0", 0]
                }
            }, {
                limit: 10,
                skip: skipCount
            });
        } else {

            Counts.publish(this, 'players_financial_Count', global[playerEntries].find({
                "tournamentId": tournamentId
            }), {
                noReady: true
            });
            players = global[playerEntries].find({
                "tournamentId": tournamentId
            }, {
                limit: 10,
                skip: skipCount
            });
        }
        return players;
    } catch (e) {
    }
})


Meteor.publish('getPlayersFinancialOnSearch',  function(skipCount, tournamentId, playerSearchValue) {
    try{

    var dbsrequired = ["playerEntries"]
    var playerEntries = "playerEntries"

    if (tournamentId) {
        var tournamentId = tournamentId;
        var tournamentFind = events.findOne({"_id":tournamentId})
        if(tournamentFind==undefined||tournamentFind==null){
            tournamentFind = pastEvents.findOne({
                "_id": tournamentId
            })
        }
        var res =  Meteor.call("changeDbNameForDraws", tournamentFind,dbsrequired)
        try {
            if(res){
                if(res.changeDb && res.changeDb == true){
                    if(res.changedDbNames.length!=0){
                        playerEntries = res.changedDbNames[0]
                    }
                }
            }
        }catch(e){}
    }        

    var reObj = new RegExp(playerSearchValue, 'i');
    var userIds = Meteor.users.find({
        userName: {
            $regex: reObj
        }
    }).map(function(userInfo) {
        return userInfo.userId;
    });
    var players;

    var sum = 0;
    var feesValue = eventFeeSettings.findOne({
        "tournamentId": tournamentId
    })
    if (feesValue && feesValue.singleEventFees) {
        var arrayFees = feesValue.singleEventFees
        sum = _.reduce(arrayFees, function(memo, num) {
            return parseInt(memo) + parseInt(num);
        }, 0)
    }
    if (sum > 0) {
        Counts.publish(this, 'players_financial_Count', global[playerEntries].find({
            "tournamentId": tournamentId,
            "playerId": {
                "$in": userIds
            },
            "totalFee": {
                $nin: ["0", 0]
            }
        }), {
            noReady: true
        });
        players = global[playerEntries].find({
            "tournamentId": tournamentId,
            "playerId": {
                "$in": userIds
            },
            "totalFee": {
                $nin: ["0", 0]
            }
        }, {
            limit: 10,
            skip: skipCount
        });
    } else {
        Counts.publish(this, 'players_financial_Count', global[playerEntries].find({
            "tournamentId": tournamentId,
            "playerId": {
                "$in": userIds
            }
        }), {
            noReady: true
        });
        players = global[playerEntries].find({
            "tournamentId": tournamentId,
            "playerId": {
                "$in": userIds
            }
        }, {
            limit: 10,
            skip: skipCount
        });
    }
    return players;
    }catch(e){
    }
})


Meteor.publish('getPlayerTeamFinancial',  function(skipCount, tournamentId) {
    try{


    var dbsrequired = ["playerTeamEntries"]
    var playerTeamEntries = "playerTeamEntries"

    if (tournamentId) {
        var tournamentId = tournamentId;
        var tournamentFind = events.findOne({"_id":tournamentId})
        if(tournamentFind==undefined||tournamentFind==null){
            tournamentFind = pastEvents.findOne({
                "_id": tournamentId
            })
        }
        var res =  Meteor.call("changeDbNameForDraws", tournamentFind,dbsrequired)
        try {
            if(res){
                if(res.changeDb && res.changeDb == true){
                    if(res.changedDbNames.length!=0){
                        playerTeamEntries = res.changedDbNames[0]
                    }
                }
            }
        }catch(e){}
    }

    var players;
    var sum = 0;
    var feesValue = eventFeeSettings.findOne({
        "tournamentId": tournamentId
    })
    if (feesValue && feesValue.teamEventFees) {
        var arrayFees = feesValue.teamEventFees
        sum = _.reduce(arrayFees, function(memo, num) {
            return parseInt(memo) + parseInt(num);
        }, 0)
    }
    if (sum > 0) {
        Counts.publish(this, 'players_team_financial_Count', global[playerTeamEntries].find({
            "tournamentId": tournamentId,
            "totalFee": {
                $nin: ["0", 0]
            }
        }), {
            noReady: true
        });

        players = global[playerTeamEntries].find({
            "tournamentId": tournamentId,
            "totalFee": {
                $nin: ["0", 0]
            }
        }, {
            limit: 10,
            skip: skipCount
        });
    }
    else{
        Counts.publish(this, 'players_team_financial_Count', global[playerTeamEntries].find({
            "tournamentId": tournamentId
        }), {
            noReady: true
        });

        players = global[playerTeamEntries].find({
            "tournamentId": tournamentId
        }, {
            limit: 10,
            skip: skipCount
        });    
    }
    return players;
    }catch(e){
    }
})

Meteor.publish('getPlayerTeamFinancialOnSearch',  function(skipCount, tournamentId, playerSearchValue) {
    try{

    var dbsrequired = ["playerTeamEntries"]
    var playerTeamEntries = "playerTeamEntries"

    if (tournamentId) {
        var tournamentId = tournamentId;
        var tournamentFind = events.findOne({"_id":tournamentId})
        if(tournamentFind==undefined||tournamentFind==null){
            tournamentFind = pastEvents.findOne({
                "_id": tournamentId
            })
        }
        var res =  Meteor.call("changeDbNameForDraws", tournamentFind,dbsrequired)
        try {
            if(res){
                if(res.changeDb && res.changeDb == true){
                    if(res.changedDbNames.length!=0){
                        playerTeamEntries = res.changedDbNames[0]
                    }
                }
            }
        }catch(e){}
    }
    var reObj = new RegExp(playerSearchValue, 'i');
    var userIds = Meteor.users.find({
        userName: {
            $regex: reObj
        }
    }).map(function(userInfo) {
        return userInfo.userId;
    });
    var sum = 0;
    var feesValue = eventFeeSettings.findOne({
        "tournamentId": tournamentId
    })
    if (feesValue && feesValue.teamEventFees) {
        var arrayFees = feesValue.teamEventFees
        sum = _.reduce(arrayFees, function(memo, num) {
            return parseInt(memo) + parseInt(num);
        }, 0)
    }
    if (sum > 0) {
        var players;
        Counts.publish(this, 'players_team_search_financial_Count',global[playerTeamEntries].find({
            "tournamentId": tournamentId,
            "totalFee": {
                $nin: ["0", 0]
            },
            "playerId": {
                "$in": userIds
            }
        }), {
            noReady: true
        });

        players = global[playerTeamEntries].find({
            "tournamentId": tournamentId,
            "totalFee": {
                $nin: ["0", 0]
            },
            "playerId": {
                "$in": userIds
            }
        }, {
            limit: 10,
            skip: skipCount
        });

        return players;
    } 
    else{
        var players;
        Counts.publish(this, 'players_team_search_financial_Count', global[playerTeamEntries].find({
            "tournamentId": tournamentId,
            "playerId": {
                "$in": userIds
            }
        }), {
            noReady: true
        });

        players = global[playerTeamEntries].find({
            "tournamentId": tournamentId,
            "playerId": {
                "$in": userIds
            }
        }, {
            limit: 10,
            skip: skipCount
        });

        return players;
    }
    }catch(e){
    }
})


Meteor.publish('getAcademyFinancial', function(skipCount, tournamentId) {
    try{
    var academies;
    var sum = 0;
    var feesValue = eventFeeSettings.findOne({
        "tournamentId": tournamentId
    })
    if (feesValue && feesValue.singleEventFees) {
        var arrayFees = feesValue.singleEventFees
        sum = _.reduce(arrayFees, function(memo, num) {
            return parseInt(memo) + parseInt(num);
        }, 0)
    }
    if (sum > 0) {
        Counts.publish(this, 'academy_financial_Count', academyEntries.find({
            "tournamentId": tournamentId,
            "totalFee": {
                $nin: ["0", 0]
            }
        }), {
            noReady: true
        });

        academies = academyEntries.find({
            "tournamentId": tournamentId,
            "totalFee": {
                $nin: ["0", 0]
            }
        }, {
            limit: 10,
            skip: skipCount
        });
    }
    else{        
        Counts.publish(this, 'academy_financial_Count', academyEntries.find({
            "tournamentId": tournamentId
        }), {
            noReady: true
        });

        academies = academyEntries.find({
            "tournamentId": tournamentId
        }, {
            limit: 10,
            skip: skipCount
        }); 
    }

    return academies;
    }catch(e){
    }
})

Meteor.publish('getDAFinancial', function(skipCount, tournamentId) {
    try{
    var academies;
    var sum = 0;
    var feesValue = eventFeeSettings.findOne({
        "tournamentId": tournamentId,
    })
    if (feesValue && feesValue.singleEventFees) {
        var arrayFees = feesValue.singleEventFees
        sum = _.reduce(arrayFees, function(memo, num) {
            return parseInt(memo) + parseInt(num);
        }, 0)
    }
    if (sum > 0) {
        Counts.publish(this, 'districtAssociation_financial_Count', districtAssociationEntries.find({
            "tournamentId": tournamentId,
            "totalFee": {
                $nin: ["0", 0]
            }
        }), {
            noReady: true
        });

        districtAssociation = districtAssociationEntries.find({
            "tournamentId": tournamentId,
            "totalFee": {
                $nin: ["0", 0]
            }
        }, {
            limit: 10,
            skip: skipCount
        });

        return districtAssociation;
    }else{
        Counts.publish(this, 'districtAssociation_financial_Count', districtAssociationEntries.find({
            "tournamentId": tournamentId
        }), {
            noReady: true
        });

        districtAssociation = districtAssociationEntries.find({
            "tournamentId": tournamentId
        }, {
            limit: 10,
            skip: skipCount
        });

        return districtAssociation;
    }
    }catch(e){
    }
})