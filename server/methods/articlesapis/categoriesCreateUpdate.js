Meteor.methods({
    //create packTypes
    'createcategoriesOfPublisherPacks': function(xData) {
        var response;
        try {
            if (xData && xData.length != 0) {
                var s2 = categoryOfPublisher.findOne({
                })
                if(s2 == undefined || s2 == null || s2._id == undefined || s2._id == null){
                    let s = categoryOfPublisher.insert({
                        category: xData
                    })
                    if (s) {
                        var s1 = categoryOfPublisher.findOne({
                            "_id": s.toString()
                        })
                        if (s1) {
                            var data = {
                                "message": "category type inserted",
                                "result": true,
                                "data": s
                            }
                            response = data
                        } else {
                            var data = {
                                "message": "cannot insert category type",
                                "result": false,
                                "data": 0
                            }
                            response = data
                        }
                    }else{
                        var data = {
                            "message": "cannot insert category type",
                            "result": false,
                            "data": 0
                        }
                        response = data
                    }
                }else{
                    let s = categoryOfPublisher.update({"_id":s2._id},{$set:{
                        category: xData
                    }})
                    if (s) {
                            var data = {
                                "message": "category type updated",
                                "result": true,
                                "data": s
                            }
                            response = data
                        } else {
                            var data = {
                                "message": "cannot update category type",
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
                "message": "cannot insert category type",
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
    'removeInsertedcategoriesCall': function(xData) {
        var response;
        try {
            if (xData && xData.length != 0) {
                var s2 = categoryOfPublisher.findOne({
                })
                if(s2 != undefined || s2 != null || s2._id != undefined || s2._id != null){
                    let s = categoryOfPublisher.findOne({
                    })
                    if (s) {
                        let r = articlesOfPublisher.findOne({category:xData})
                        if(r==undefined){
                            var s1 = categoryOfPublisher.update({},{$pull:{"category":xData}})
                            if (s1) {
                                var data = {
                                    "message": "category type removed",
                                    "result": true,
                                    "data": s
                                }
                                response = data
                            } else {
                                var data = {
                                    "message": "cannot remove category type",
                                    "result": false,
                                    "data": 0
                                }
                                response = data
                            }
                        }else{
                            var data = {
                                "message": "cannot remove category type, there are packs on this category type",
                                "result": false,
                                "data": 0
                            }
                            response = data
                        }
                    }else{
                        var data = {
                            "message": "cannot remove category type",
                            "result": false,
                            "data": 0
                        }
                        response = data
                    }
                }else{
                    var data = {
                            "message": "no category types to remove",
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
                "message": "cannot remove category",
                "result": false,
                "data": 0
            }
            response = data
            return response
        }
    }
})
