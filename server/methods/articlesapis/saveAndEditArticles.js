export const gcm = require('node-gcm');
export const  sender = new gcm.Sender('AAAAjdrIfDQ:APA91bFa7zLdwBWBYg5Dr8zoMDAJDNC-sg6W3FCVMCh9-I_4TCV94h_P1WaAL4jWflgvHZPj1oJWYEIwHvhPgh2D6s74ZmJv3MVoZaX6S4S4JUVoHG1usgaWK1xEixT-I0hb-2lhmY-a');

Meteor.methods({
    //create articles
    'createArticlesPublished': function(xData) {
        try {

            var response;
            if (xData != undefined && xData != null) {
                if (xData.userId != undefined && xData.userId != null && xData.userId.trim().length != 0) {
                    if (xData.types != undefined && xData.types != null && xData.types.trim().length != 0 && (xData.type != "Article" || xData.type != "Pack")) {
                        if (xData.role != undefined && xData.role != null && xData.role.trim().length != 0) {
                            if (xData.titles != undefined && xData.titles != null && xData.titles.trim().length != 0) {
                                if (xData.articleDesc != undefined && xData.articleDesc != null && xData.articleDesc.trim().length != 0) {
                                    if (xData.category != undefined && xData.category != null && xData.category.trim().length != 0) {
                                        var articleInsert = articlesOfPublisher.insert({
                                            type: xData.types,
                                            userId: xData.userId,
                                            role: xData.role,
                                            title: xData.titles,
                                            articleDesc: xData.articleDesc,
                                            offset: new Date().getTimezoneOffset(),
                                            status: "active",
                                            category: xData.category
                                        })
                                        if (articleInsert) {
                                            var s = articlesOfPublisher.findOne({
                                                "_id": articleInsert.toString()
                                            })
                                            if (s) {
                                                var data = {
                                                    "message": "article inserted",
                                                    "result": true,
                                                    "data": s
                                                }
                                                response = data
                                            } else {
                                                var data = {
                                                    "message": "cannot insert article",
                                                    "result": false,
                                                    "data": 0
                                                }
                                                response = data
                                            }
                                        } else {
                                            var data = {
                                                "message": "cannot insert article",
                                                "result": false,
                                                "data": 0
                                            }
                                            response = data
                                        }
                                    } else {
                                        var data = {
                                            "message": "category is not valid",
                                            "result": false,
                                            "data": 0
                                        }
                                        response = data
                                    }
                                } else {
                                    var data = {
                                        "message": "article desc is not valid",
                                        "result": false,
                                        "data": 0
                                    }
                                    response = data
                                }

                            } else {
                                var data = {
                                    "message": "title is not valid",
                                    "result": false,
                                    "data": 0
                                }
                                response = data
                            }

                        } else {
                            var data = {
                                "message": "role is not valid",
                                "result": false,
                                "data": 0
                            }
                            response = data
                        }

                    } else {
                        var data = {
                            "message": "type is not valid",
                            "result": false,
                            "data": 0
                        }
                        response = data
                    }
                } else {
                    var data = {
                        "message": "userId is not valid",
                        "result": false,
                        "data": 0
                    }
                    response = data
                }
            } else {
                var data = {
                    "message": "data is empty",
                    "result": false,
                    "data": 0
                }
                response = data
            }
            return response
        } catch (e) {
            var response;
            var data = {
                "message": "cannot insert article",
                "result": false,
                "data": 0
            }
            response = data
            return response
        }
    }
})

Meteor.methods({
    'fetchArticlesForGivenUserIds': function(xData) 
    {
        try {
            var response;
            if (xData != undefined && xData != null) {
                if (xData.userIds != undefined && xData.userIds != null) {
                    if (xData.userIds.length == 0) {
                        var s = articlesOfPublisher.find(
                            {$or:[
                                {
                                    "type":"Articles",
                                    "adminStatus":"approved",
                                    "status":"active"
                                },
                                {
                                    "type":"Packs",
                                    "status":"active"
                                }
                               
                            ]}).fetch()
                        if (s && s.length != 0) {

                            var raw = articlesOfPublisher.rawCollection();
                            var distinct = Meteor.wrapAsync(raw.distinct, raw);
                            var userList = distinct('userId', {
                                "role": "Coach"
                            });
                            var userData = Meteor.users.find({
                                "_id": {
                                    $in: userList
                                }
                            }, {
                                fields: {
                                    userName: 1,
                                    userId: 1
                                }
                            }).fetch();

                            var articleCategoryList = [];
                            var categoryInfo = categoryOfPublisher.findOne({});
                            if(categoryInfo && categoryInfo.category)
                                articleCategoryList = categoryInfo.category;

                            var packCategoryList = [];
                            var packCategoryInfo = packsOfPublisher.findOne({});
                            if(packCategoryInfo && packCategoryInfo.packs)
                                packCategoryList = packCategoryInfo.packs;

                            var r = {}
                            r["articles"] = s
                            r["userData"] = userData
                            var data = {
                                "message": "Articles List",
                                "result": true,
                                "status": "success",
                                "data": r.articles,
                                "userData": r.userData,
                                "articleCategory":articleCategoryList,
                                "packCategory":packCategoryList
                            }

                            response = data
                        } else {
                            var data = {
                                "message": "No Articles",
                                "result": true,
                                "data": 0
                            }
                            response = data
                        }
                    } else {
                        var s = articlesOfPublisher.find({
                            userId: {
                                $in: xData.userIds
                            }
                        }).fetch()
                        if (s && s.length != 0) {
                            var raw = articlesOfPublisher.rawCollection();
                            var distinct = Meteor.wrapAsync(raw.distinct, raw);
                            var userList = distinct('userId', {
                                "role": "Coach",
                                userId: {
                                    $in: xData.userIds
                                }
                            });
                            var userData = Meteor.users.find({
                                "_id": {
                                    $in: userList
                                }
                            }, {
                                fields: {
                                    userName: 1,
                                    userId: 1
                                }
                            }).fetch();

                           
                            var articleCategoryList = [];
                            var categoryInfo = categoryOfPublisher.findOne({});
                            if(categoryInfo && categoryInfo.category)
                                articleCategoryList = categoryInfo.category;

                            var packCategoryList = [];
                            var packCategoryInfo = packsOfPublisher.findOne({});
                            if(packCategoryInfo && packCategoryInfo.packs)
                                packCategoryList = packCategoryInfo.packs;
                            var r = {}
                            r["articles"] = s
                            r["userData"] = userData

                            var data = {
                                "message": "Articles List",
                                "result": true,
                                "status": "success",
                                "data": r.articles,
                                "userData": r.userData,
                                "articleCategory":articleCategoryList,
                                "packCategory":packCategoryList

                            }

                            response = data
                        } else {
                            var data = {
                                "message": "No Articles",
                                "result": true,
                                "data": 0
                            }
                            response = data
                        }
                    }
                }
            } else {
                var data = {
                    "message": "data is empty",
                    "result": false,
                    "data": 0
                }
                response = data
            }
            return response
        } catch (e) {
            var response;
            var data = {
                "message": "cannot insert article",
                "result": false,
                "data": 0
            }
            response = data
            return response
        }
    }
})
Meteor.methods({
    //fetch my articles and all coach articles
    'fetchArticlesForGivenUserIdsAdmin': function(xData) {
        try {
            var response;
            if (xData != undefined && xData != null) {
                if (xData.userIds != undefined && xData.userIds != null) {
                    if (xData.userIds.length == 0) {
                        var s = articlesOfPublisher.find({
                            "type": "Articles","status" : "active"
                        }).fetch();

                        if (s && s.length != 0) {

                            var raw = articlesOfPublisher.rawCollection();
                            var distinct = Meteor.wrapAsync(raw.distinct, raw);
                            var userList = distinct('userId', {
                                "role": "Coach",
                                "type": "Articles"
                            });
                            var userData = Meteor.users.find({
                                "_id": {
                                    $in: userList
                                }
                            }, {
                                fields: {
                                    userName: 1,
                                    userId: 1
                                }
                            }).fetch();
                            var r = {}
                            r["articles"] = s
                            r["userData"] = userData
                            var data = {
                                "message": "Articles List",
                                "result": true,
                                "status": "success",
                                "data": r
                            }

                            response = data
                        } else {
                            var data = {
                                "message": "No Articles",
                                "result": true,
                                "data": 0
                            }
                            response = data
                        }
                    } else {
                        var s = articlesOfPublisher.find({
                            userId: {
                                $in: xData.userIds
                            },
                            "type": "Articles"
                        }).fetch()
                        if (s && s.length != 0) {
                            var raw = articlesOfPublisher.rawCollection();
                            var distinct = Meteor.wrapAsync(raw.distinct, raw);
                            var userList = distinct('userId', {
                                "role": "Coach",
                                "type": "Articles",
                                userId: {
                                    $in: xData.userIds
                                }
                            });
                            var userData = Meteor.users.find({
                                "_id": {
                                    $in: userList
                                }
                            }, {
                                fields: {
                                    userName: 1,
                                    userId: 1
                                }
                            }).fetch();
                            var r = {}
                            r["articles"] = s
                            r["userData"] = userData

                            var data = {
                                "message": "Articles List",
                                "result": true,
                                "status": "success",
                                "data": r
                            }

                            response = data
                        } else {
                            var data = {
                                "message": "No Articles",
                                "result": true,
                                "data": 0
                            }
                            response = data
                        }
                    }
                }
            } else {
                var data = {
                    "message": "data is empty",
                    "result": false,
                    "data": 0
                }
                response = data
            }
            return response
        } catch (e) {
            var response;
            var data = {
                "message": "cannot fetch article",
                "result": false,
                "data": 0
            }
            response = data
            return response
        }
    }
});

Meteor.methods({
    //update articles
    'updateArticlesPublished': function(xData) {
        try {
            var response;
            if (xData != undefined && xData != null) {
                if (xData.userId != undefined && xData.userId != null && xData.userId.trim().length != 0) {
                    if (xData.types != undefined && xData.types != null && xData.types.trim().length != 0 && (xData.type != "Article" || xData.type != "Pack")) {
                        if (xData.role != undefined && xData.role != null && xData.role.trim().length != 0) {
                            if (xData.titles != undefined && xData.titles != null && xData.titles.trim().length != 0) {
                                if (xData.articleDesc != undefined && xData.articleDesc != null && xData.articleDesc.trim().length != 0) {
                                    if (xData.category != undefined && xData.category != null && xData.category.trim().length != 0) {
                                        if (xData.articleId != undefined && xData.articleId != null && xData.articleId.trim().length != 0) {
                                            var s = articlesOfPublisher.findOne({
                                                "_id": xData.articleId.toString()
                                            })
                                            if (xData.statusOfArticles == undefined || xData.statusOfArticles == null) {
                                                xData.statusOfArticles = "active"
                                            }
                                            if (s) {

                                                var articleUpdate = articlesOfPublisher.update({
                                                    "_id": xData.articleId
                                                }, {
                                                    $set: {
                                                        type: xData.types,
                                                        userId: xData.userId,
                                                        role: xData.role,
                                                        title: xData.titles,
                                                        articleDesc: xData.articleDesc,
                                                        offset: new Date().getTimezoneOffset(),
                                                        status: xData.statusOfArticles.toLowerCase(),
                                                        category: xData.category
                                                    }
                                                })
                                                if (articleUpdate) {
                                                    var data = {
                                                        "message": "article updated",
                                                        "result": true,
                                                        "data": s
                                                    }
                                                    response = data
                                                } else {
                                                    var data = {
                                                        "message": "cannot update article",
                                                        "result": false,
                                                        "data": 0
                                                    }
                                                    response = data
                                                }

                                            } else {
                                                var data = {
                                                    "message": "articleId is invalid",
                                                    "result": false,
                                                    "data": 0
                                                }
                                                response = data
                                            }

                                        } else {
                                            var data = {
                                                "message": "cannot update article",
                                                "result": false,
                                                "data": 0
                                            }
                                            response = data
                                        }
                                    } else {
                                        var data = {
                                            "message": "category is not valid",
                                            "result": false,
                                            "data": 0
                                        }
                                        response = data
                                    }
                                } else {
                                    var data = {
                                        "message": "article desc is not valid",
                                        "result": false,
                                        "data": 0
                                    }
                                    response = data
                                }

                            } else {
                                var data = {
                                    "message": "title is not valid",
                                    "result": false,
                                    "data": 0
                                }
                                response = data
                            }

                        } else {
                            var data = {
                                "message": "role is not valid",
                                "result": false,
                                "data": 0
                            }
                            response = data
                        }

                    } else {
                        var data = {
                            "message": "type is not valid",
                            "result": false,
                            "data": 0
                        }
                        response = data
                    }
                } else {
                    var data = {
                        "message": "userId is not valid",
                        "result": false,
                        "data": 0
                    }
                    response = data
                }
            } else {
                var data = {
                    "message": "data is empty",
                    "result": false,
                    "data": 0
                }
                response = data
            }
            return response
        } catch (e) {
            var response;
            var data = {
                "message": "cannot update article",
                "result": false,
                "data": 0
            }
            response = data
            return response
        }
    }
})