import {
    playerDBFind
}
from '../dbRequiredRole.js'
//userDetailsTTUsed
    /*Meteor.methods({
    	"insertSentREceipt":function(xData){
    		check(xData,Object);
    		var found = sentReceipt.findOne({
    			"sentReceiptUserId":xData.sentReceiptUserId,
    			"sentReceiptTournamentId":xData.sentReceiptTournamentId
    		});
    		if(found==undefined){
    			var r = sentReceipt.insert({
    				"sentReceiptUserId":xData.sentReceiptUserId,
    				"sentReceiptTournamentId":xData.sentReceiptTournamentId
    			});
    			return r;
    		}
    	}
    });*/

Meteor.methods({
    "getTounName":function(tournId)
    {
        try{
            var tournInfo =  events.findOne({"_id":tournId,"tournamentEvent":true});
            if(tournInfo)
                return tournInfo;
            else
            {
                tournInfo =pastEvents.findOne({"_id":tournId,"tournamentEvent":true});
                if(tournInfo)
                    return tournInfo
            }

        }catch(e){

        }
    },
    "getPlayerDetailToSendReceipt": function(userId, whichDB) {
        var playerInfo = global[whichDB].findOne({
            "userId": userId
        })
        if (playerInfo) {
            return playerInfo
        }
    },
    "getPlayerDetail": function(userId) {
        var toret = "userDetailsTT"

        var usersMet = Meteor.users.findOne({
            userId: userId
        })

        if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
            var dbn = playerDBFind(usersMet.interestedProjectName[0])
            if (dbn) {
                toret = dbn
            }
        }
        var playerInfo = global[toret].findOne({
            "userId": userId
        })
        if (playerInfo) {
            return playerInfo
        }
    },
    "getAcademyDetail": function(userId) {
        var academyInfo = academyDetails.findOne({
            "userId": userId
        })
        if (academyInfo) {
            return academyInfo
        }
    },
    getAssociationInfo_financial: function(userId) {
        var associationInfo = associationDetails.findOne({
            "userId": userId
        });
        if (associationInfo)
            return associationInfo;
    }
})


Meteor.methods({
    "insertSentREceipt": function(xData) {
        check(xData, Object);
        var found = sentReceipt.findOne({
            "sentReceiptUserId": xData.sentReceiptUserId,
            "sentReceiptTournamentId": xData.sentReceiptTournamentId
        });
        if (found == undefined) {
            var r = sentReceipt.insert({
                "sentReceiptUserId": xData.sentReceiptUserId,
                "sentReceiptTournamentId": xData.sentReceiptTournamentId
            });
            return r;
        }
    },
    
    "changeFinancialsPlayer": function(xData, whichDB) {
        try {
            var x = global[whichDB].update({
                "playerId": xData.sentReceiptUserId,
                "tournamentId": xData.sentReceiptTournamentId
            }, {
                $set: {
                    "paidOrNot": true
                }
            });




            return true;
        } catch (e) {
            return false
        }
    },

    "insertPlayerReceipt": function(xData) {

        check(xData, Object);
        var playerFee = xData.sentTotalFee;
        var playerUpdate = financials.update({
            "playerId": xData.sentReceiptUserId,
            "tournamentId": xData.sentReceiptTournamentId,
            "academyId": xData.sentReceiptAcademyId
        }, {
            $set: {
                "paidOrNot": true
            }
        });


        var academy_financeInfo = academyfinancials.findOne({
            "academyId": xData.sentReceiptAcademyId,
            "tournamentId": xData.sentReceiptTournamentId
        });

        if (academy_financeInfo) {
            var academyFee = academy_financeInfo.totalFees;
            var updatedAcademyFee = parseInt(academyFee) - parseInt(playerFee);
            var x = academyfinancials.update({
                "academyId": xData.sentReceiptAcademyId,
                "tournamentId": xData.sentReceiptTournamentId
            }, {
                $set: {
                    "totalFees": updatedAcademyFee
                }
            })
        }
    },
    "insertAcademyReceipt": function(xData) {
        try {
            check(xData, Object);
            var academyEntriesUpdate = academyEntries.update({
                "academyId": xData.sentReceiptUserId,
                "tournamentId": xData.sentReceiptTournamentId
            }, {
                $set: {
                    "paidOrNot": true
                }
            })


            var playerEntriesUpdate = playerEntries.update({
                "academyId": xData.sentReceiptUserId,
                "tournamentId": xData.sentReceiptTournamentId
            }, {
                $set: {
                    "paidOrNot": true
                }
            }, {
                multi: true
            });

            return true;

        } catch (e) {
            return false
        }
    },
    "insertDAReceipt": function(xData) {
        try {
            check(xData, Object);

            var districtEntriesUpdate = districtAssociationEntries.update({
                "associationId": xData.sentReceiptUserId,
                "tournamentId": xData.sentReceiptTournamentId
            }, {
                $set: {
                    "paidOrNot": true
                }
            });

            if (districtEntriesUpdate) {
                var playerEntriesUpdate = playerEntries.update({
                    "associationId": xData.sentReceiptUserId,
                    "academyId": "other",
                    "tournamentId": xData.sentReceiptTournamentId
                }, {
                    $set: {
                        "paidOrNot": true
                    }
                }, {
                    multi: true
                });

                if (playerEntriesUpdate)
                    return true;
            }


        } catch (e) {
            return false;
        }
    },
    "insertPlayerTeamReceipt": function(xData, dbNAme) {
        try {
            check(xData, Object);
            var x = global[dbNAme].update({
                "playerId": xData.sentReceiptUserId,
                "tournamentId": xData.sentReceiptTournamentId
            }, {
                $set: {
                    "paidOrNot": true
                }
            });

            return true;
        } catch (e) {
            return false
        }
    },
    "getSchoolDetailForTeamSendReceipt": function(xData) {
        try {
            var x = schoolDetails.findOne({
                "userId": xData
            })
            if (x)
                return x;
        } catch (e) {
            return false
        }
    },

});