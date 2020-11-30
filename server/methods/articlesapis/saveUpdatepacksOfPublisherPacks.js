Meteor.methods({
    //create packTypes
    'createpacksOfPublisherPacks': function(xData) {
        var response;
        try {
            if (xData && xData.length != 0) {
                var s2 = packsOfPublisher.findOne({
                })
                if(s2 == undefined || s2 == null || s2._id == undefined || s2._id == null){
                    let s = packsOfPublisher.insert({
                        packs: xData
                    })
                    if (s) {
                        var s1 = packsOfPublisher.findOne({
                            "_id": s.toString()
                        })
                        if (s1) {
                            var data = {
                                "message": "pack type inserted",
                                "result": true,
                                "data": s
                            }
                            response = data
                        } else {
                            var data = {
                                "message": "cannot insert pack type",
                                "result": false,
                                "data": 0
                            }
                            response = data
                        }
                    }else{
                        var data = {
                            "message": "cannot insert pack type",
                            "result": false,
                            "data": 0
                        }
                        response = data
                    }
                }else{
                    let s = packsOfPublisher.update({"_id":s2._id},{$set:{
                        packs: xData
                    }})
                    if (s) {
                            var data = {
                                "message": "pack type updated",
                                "result": true,
                                "data": s
                            }
                            response = data
                        } else {
                            var data = {
                                "message": "cannot update pack type",
                                "result": false,
                                "data": 0
                            }
                            response = data
                        }
                }
            } else {
                var response;
                var data = {
                    "message": "xData is invalid",
                    "result": false,
                    "data": 0
                }
                response = data

            }
            return response
        } catch (e) {
            var response;
            var data = {
                "message": "cannot insert pack type",
                "result": false,
                "data": 0
            }
            response = data
            return response
        }
    }
})

Meteor.methods({
    //create packTypes
    'removeInsertedPacksCall': function(xData) {
        var response;
        try {
            if (xData && xData.length != 0) {
                var s2 = packsOfPublisher.findOne({
                })
                if(s2 != undefined || s2 != null || s2._id != undefined || s2._id != null){
                    let s = packsOfPublisher.findOne({
                    })
                    if (s) {
                        let r = articlesOfPublisher.findOne({planType:xData})
                        if(r==undefined){
                            var s1 = packsOfPublisher.update({},{$pull:{"packs":xData}})
                            if (s1) {
                                var data = {
                                    "message": "pack type removed",
                                    "result": true,
                                    "data": s
                                }
                                response = data
                            } else {
                                var data = {
                                    "message": "cannot remove pack type",
                                    "result": false,
                                    "data": 0
                                }
                                response = data
                            }
                        }else{
                            var data = {
                                "message": "cannot remove pack type, there are packs on this plan type",
                                "result": false,
                                "data": 0
                            }
                            response = data
                        }
                    }else{
                        var data = {
                            "message": "cannot remove pack type",
                            "result": false,
                            "data": 0
                        }
                        response = data
                    }
                }else{
                    var data = {
                            "message": "no pack types to remove",
                            "result": false,
                            "data": 0
                        }
                        response = data
                }
            } else {
                var response;
                var data = {
                    "message": "xData is invalid",
                    "result": false,
                    "data": 0
                }
                response = data

            }
            return response
        } catch (e) {
            var response;
            var data = {
                "message": "cannot remove pack",
                "result": false,
                "data": 0
            }
            response = data
            return response
        }
    }
})
