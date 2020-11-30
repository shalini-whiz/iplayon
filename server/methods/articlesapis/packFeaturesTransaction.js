Meteor.methods({
    'createPackFeatures': function(xData) {
        var response;
        try {
            if (xData && xData.length != 0) {
                var s2 = packFeatures.findOne({
                })
                if(s2 == undefined || s2 == null || s2._id == undefined || s2._id == null){
                    let s = packFeatures.insert({
                        features: xData
                    })
                    if (s) {
                        var s1 = packFeatures.findOne({
                            "_id": s.toString()
                        })
                        if (s1) {
                            var data = {
                                "message": "pack features inserted",
                                "result": true,
                                "data": s
                            }
                            response = data
                        } else {
                            var data = {
                                "message": "cannot insert pack feature",
                                "result": false,
                                "data": 0
                            }
                            response = data
                        }
                    }else{
                        var data = {
                            "message": "cannot insert pack feature",
                            "result": false,
                            "data": 0
                        }
                        response = data
                    }
                }else{
                    let s = packFeatures.update({"_id":s2._id},{$set:{
                        features: xData
                    }})
                    if (s) {
                            var data = {
                                "message": "pack features updated",
                                "result": true,
                                "data": s
                            }
                            response = data
                        } else {
                            var data = {
                                "message": "cannot update pack feature",
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
                "message": "cannot insert pack feature",
                "result": false,
                "data": 0
            }
            response = data
            return response
        }
    },
    'removePackFeatures': function(xData) {
        var response;
        try {
            if (xData && xData.length != 0) {
                var s2 = packFeatures.findOne({
                })
                if(s2 != undefined || s2 != null || s2._id != undefined || s2._id != null){
                    let s = packFeatures.findOne({
                    })
                    if (s) {
                        let r = articlesOfPublisher.findOne({"features.key":xData})
                        if(r==undefined){
                            var s1 = packFeatures.update({},{$pull:{"features":xData}})
                            if (s1) {
                                var data = {
                                    "message": "pack feature removed",
                                    "result": true,
                                    "data": s
                                }
                                response = data
                            } else {
                                var data = {
                                    "message": "cannot remove pack feature",
                                    "result": false,
                                    "data": 0
                                }
                                response = data
                            }
                        }else{
                            var data = {
                                "message": "cannot remove pack feature, there are packs on this feature",
                                "result": false,
                                "data": 0
                            }
                            response = data
                        }
                    }else{
                        var data = {
                            "message": "cannot remove pack feature",
                            "result": false,
                            "data": 0
                        }
                        response = data
                    }
                }else{
                    var data = {
                            "message": "no pack feature to remove",
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
                "message": "cannot remove pack feature",
                "result": false,
                "data": 0
            }
            response = data
            return response
        }
    }
})


