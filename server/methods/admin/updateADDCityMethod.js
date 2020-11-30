Meteor.methods({
    'updateADDCityMethodForUsers': function() {
        try {
            var UserDetails = [];
            //userDetailsTTUsed
            var findCityNUll = userDetailsTT.find({
                $or: [{
                    city: null
                }, {
                    state: null
                }, {
                    pinCode: null
                }, {
                    country: null
                }]
            }).fetch().forEach(function(e, i) {
                if (e.city == null || e.city == undefined) {
                    e.city = "city";
                }
                if (e.state == null || e.state == undefined) {
                    e.state = "state";
                }
                if (e.pinCode == null || e.pinCode == undefined) {
                    e.pinCode = "111111";
                }
                if (e.country == null || e.country == undefined) {
                    e.country = "India";
                }
                userDetailsTT.update({
                    "userId": e.userId
                }, {
                    $set: {
                        city: e.city,
                        state: e.state,
                        pinCode: e.pinCode,
                        country: e.country
                    }
                })
            })
            return true
        } catch (e) {}
    },
    'updateADDCityMethodForAcademy': function() {
        try {
            var UserDetails = [];
            var findCityNUll = academyDetails.find({
                $or: [{
                    city: null
                }, {
                    state: null
                }, {
                    pinCode: null
                }, {
                    country: null
                }]
            }).fetch().forEach(function(e, i) {
                if (e.city == null || e.city == undefined) {
                    e.city = "city";
                }
                if (e.state == null || e.state == undefined) {
                    e.state = "state";
                }
                if (e.pinCode == null || e.pinCode == undefined) {
                    e.pinCode = "111111";
                }
                if (e.country == null || e.country == undefined) {
                    e.country = "India";
                }
                academyDetails.update({
                    "userId": e.userId
                }, {
                    $set: {
                        city: e.city,
                        state: e.state,
                        pinCode: e.pinCode,
                        country: e.country
                    }
                })
            })
            return true
        } catch (e) {}
    },

    'updateADDCityMethodForOther': function() {
        try {
            var UserDetails = [];
            var findCityNUll = otherUsers.find({
                $or: [{
                    city: null
                }, {
                    state: null
                }, {
                    pinCode: null
                }, {
                    country: null
                }]
            }).fetch().forEach(function(e, i) {
                if (e.city == null || e.city == undefined) {
                    e.city = "city";
                }
                if (e.state == null || e.state == undefined) {
                    e.state = "state";
                }
                if (e.pinCode == null || e.pinCode == undefined) {
                    e.pinCode = "111111";
                }
                if (e.country == null || e.country == undefined) {
                    e.country = "India";
                }
                otherUsers.update({
                    "userId": e.userId
                }, {
                    $set: {
                        city: e.city,
                        state: e.state,
                        pinCode: e.pinCode,
                        country: e.country
                    }
                })
            })
            return true
        } catch (e) {}
    },
    updateADDCityMethodForAssoc: function() {
        try {
            var UserDetails = [];
            var findCityNUll = associationDetails.find({
                $or: [{
                    city: null
                }, {
                    state: null
                }, {
                    pinCode: null
                }, {
                    country: null
                }]
            }).fetch().forEach(function(e, i) {
                if (e.city == null || e.city == undefined) {
                    e.city = "city";
                }
                if (e.state == null || e.state == undefined) {
                    e.state = "state";
                }
                if (e.pinCode == null || e.pinCode == undefined) {
                    e.pinCode = "111111";
                }
                if (e.country == null || e.country == undefined) {
                    e.country = "India";
                }
                associationDetails.update({
                    "userId": e.userId
                }, {
                    $set: {
                        city: e.city,
                        state: e.state,
                        pinCode: e.pinCode,
                        country: e.country
                    }
                })
            })
            return true
        } catch (e) {}
    },

    "updateTournamentEventsOfDataBaseSep": function() {
        try {
            try {
                var tournamentEventsDet = tournamentEvents.find({}).fetch()
                if (tournamentEventsDet.length !== 0) {
                    for (var i = 0; i < tournamentEventsDet.length; i++) {
                        var projectSubEvents;

                        if (tournamentEventsDet[i].projectSubName) {
                            projectSubEvents = tournamentEventsDet[i].projectSubName;
                        }

                        var projectSubEventsToUpdate = [];

                        var categoryOrderFind;

                        if (tournamentEventsDet[i].categoryOrder) {
                            categoryOrderFind = tournamentEventsDet[i].categoryOrder
                        }
                        if (projectSubEvents.length != 0) {
                            for (var j = 0; j < projectSubEvents.length; j++) {
                                var data = {
                                    "_id": projectSubEvents[j]._id,
                                    "projectName": projectSubEvents[j].projectName,
                                    "abbName": projectSubEvents[j].abbName,
                                    "projectType": projectSubEvents[j].projectType,
                                    "gender": projectSubEvents[j].gender,
                                    "dob": moment(new Date("1992-10-08")).format("YYYY-MM-DD"),
                                    "dobType": "A"
                                }
                                projectSubEventsToUpdate.push(data);
                            }
                        }
                        var updateTourn = tournamentEvents.update({
                            "_id": tournamentEventsDet[i]._id
                        }, {
                            $set: {
                                projectSubName: projectSubEventsToUpdate,
                                singleEventsOrder: categoryOrderFind
                            }
                        })
                    }
                }
                return true
            } catch (e) {}
        } catch (e) {}
    },
    "updateEventFeeSettingsSep": function() {
        try {
            var findEventFeeSettings = eventFeeSettings.find({}).fetch();
            if (findEventFeeSettings.length != 0) {
                for (var l = 0; l < findEventFeeSettings.length; l++) {
                    if (findEventFeeSettings[l].events && findEventFeeSettings[l].eventFees) {
                        eventFeeSettings.update({
                            "_id": findEventFeeSettings[l]._id
                        }, {
                            $set: {
                                singleEvents: findEventFeeSettings[l].events,
                                singleEventFees: findEventFeeSettings[l].eventFees
                            }
                        })
                    }
                }
                return true
            }
        } catch (e) {}
    },
    "updateCustomCollection": function() {
        try {
            try {
                var updateCustomCollection = customCollection.remove({
                    "data2": "tweetKeys",
                    "consumer_key": "tr2uwDg2XB7OBAKDBGOO0FH3o",
                    "consumer_secret": "AMqceXoCJO1YLPxioXu8ZBe58VycL5SqmJUL1wPcTn7q8Dcu86",
                    "access_token_key": "821266657561624578-ls9QlsT2w6zv4xABgHrbvJy2cQF1RZD",
                    "access_token_secret": "GH4LYGdAnidZhDRgX7w8uqyhLyaXNmZwU4A8UNv5uMyFl"
                });
                var updateCustomCollection = customCollection.insert({
                    "data3": "tweetKeys",
                    "consumer_key": "tr2uwDg2XB7OBAKDBGOO0FH3o",
                    "consumer_secret": "AMqceXoCJO1YLPxioXu8ZBe58VycL5SqmJUL1wPcTn7q8Dcu86",
                    "access_token_key": "821266657561624578-ls9QlsT2w6zv4xABgHrbvJy2cQF1RZD",
                    "access_token_secret": "GH4LYGdAnidZhDRgX7w8uqyhLyaXNmZwU4A8UNv5uMyFl"
                });
                myPastEvents.remove({
                    "_id": "PAqkt7zaoMQQJaKts"
                });
                myPastEvents.remove({
                    "tournamentId": "PAqkt7zaoMQQJaKts"
                });
                pastEvents.remove({
                    "tournamentId": "PAqkt7zaoMQQJaKts"
                });
                pastEvents.remove({
                    "_id": "PAqkt7zaoMQQJaKts"
                });
                playerTeams.remove({
                    "_id": "LdCQ6ai7swtCTDf62"
                })
                playerTeams.remove({
                    "_id": "33ePcdNGE4KZG3Lcw"
                })
                playerEntries.remove({
                    "tournamentId": "PAqkt7zaoMQQJaKts"
                });
                playerTeamEntries.remove({
                    "tournamentId": "PAqkt7zaoMQQJaKts"
                });
                return true
            } catch (e) {}
        } catch (e) {}
    },
    "updateschoolEventsToFind": function() {
        try {
            try {
                var schoolDet = schoolEventsToFind.findOne({
                    key: "School"
                });
                /*var inserttournDet = tournamentEvents.insert({ "_id" : "QvHXDftiwsnc8gyfJ", "projectMainName" : "Table Tennis", "projectSubName" : [ { "_id" : "ksHHDWReSe7N2uux7", "projectName" : "Cadet Boy's Singles", "abbName" : "CB", "projectType" : "1", "gender" : "Male", "dob" : new Date("1992-10-08"), "dobType" : "A" }, { "_id" : "AJ5LtgFtStmL6KgsD", "projectName" : "Cadet Girl's Singles", "abbName" : "CG", "projectType" : "1", "gender" : "Female", "dob" : new Date("1992-10-08"), "dobType" : "A" }, { "_id" : "H8NKgBHk6JYrycCvf", "projectName" : "Sub-junior Boy's Singles", "abbName" : "SJB", "projectType" : "1", "gender" : "Female", "dob" : new Date("1992-10-08"), "dobType" : "A" }, { "_id" : "tXpQ4DwgrAfFGR4oj", "projectName" : "Sub-junior Girl's Singles", "abbName" : "SJG", "projectType" : "1", "gender" : "Female", "dob" : new Date("1992-10-08"), "dobType" : "A" }, { "_id" : "nPnrTCix3yAD3TmAz", "projectName" : "Junior Boy's Singles", "abbName" : "JB", "projectType" : "1", "gender" : "Male", "dob" : new Date("1992-10-08"), "dobType" : "A" }, { "_id" : "arGJsShtr9sjRXwyT", "projectName" : "Junior Girl's Singles", "abbName" : "JG", "projectType" : "1", "gender" : "Female", "dob" : new Date("1992-10-08"), "dobType" : "A" }, { "_id" : "2XMzYon6GbE9TxmGN", "projectName" : "Youth Girl's Singles", "abbName" : "YG", "projectType" : "1", "gender" : "Female", "dob" : new Date("1992-10-08"), "dobType" : "A" }, { "_id" : "5ioxxYpoPuox8huWC", "projectName" : "Youth Boy's Singles", "abbName" : "YB", "projectType" : "1", "gender" : "Male", "dob" : new Date("1992-10-08"), "dobType" : "A" }, { "_id" : "Bn9emodsjqgWEi2pK", "projectName" : "Men's Singles", "abbName" : "M", "projectType" : "1", "gender" : "Male", "dob" : new Date("1992-10-08"), "dobType" : "A" }, { "_id" : "giR4SJEhDJ6mtNGW7", "projectName" : "Women's Singles", "abbName" : "W", "projectType" : "1", "gender" : "Female", "dob" : new Date("1992-10-08"), "dobType" : "A" }, { "_id" : "Sv6rNBU8IaiAozRXE", "projectName" : "NMS", "abbName" : "NMS", "projectType" : "1", "gender" : "All", "dob" : new Date("1992-10-08"), "dobType" : "A" }, { "_id" : "Sv6rQkgf8pH87NbYZ", "projectName" : "NMD", "abbName" : "NMD", "projectType" : "1", "gender" : "All", "dob" : new Date("1992-10-08"), "dobType" : "A" }, { "_id" : "Sv6rQkgf8FiAozRXE", "projectName" : "Open Singles", "abbName" : "OS", "projectType" : "1", "gender" : "All", "dob" : new Date("1992-10-08"), "dobType" : "A" }, { "_id" : "pC8uK9wv9KycDEBpE", "projectName" : "Open Doubles", "abbName" : "OD", "projectType" : "1", "gender" : "All", "dob" : new Date("1992-10-08"), "dobType" : "A" }, { "_id" : "oC8uK9wv9KycDEBkE", "projectName" : "Others", "abbName" : "O", "projectType" : "1", "gender" : "All", "dob" : new Date("1992-10-08"), "dobType" : "A" }, { "_id" : "SoELkyvfuh5BaYnoB", "projectName" : "Junior Boy's Team", "abbName" : "Junior Boy's Team", "projectType" : "2", "gender" : "NA", "dobType" : "NA", "teamType" : "Junior Boy's Team" }, { "_id" : "H9CRaTSFyXiT6XEWr", "projectName" : "5s TEAM", "abbName" : "5s TEAM", "projectType" : "2", "gender" : "NA", "dobType" : "NA", "teamType" : "5s TEAM" }, { "_id" : "N3pKjogB8NipuXQwi", "projectName" : "teamDraw", "abbName" : "teamDraw", "projectType" : "2", "gender" : "NA", "dobType" : "NA", "teamType" : "teamDraw" }, { "_id" : "87yNhyJtiwPQFk5Xb", "projectName" : "Apple Cup", "abbName" : "Apple Cup", "projectType" : "2", "gender" : "NA", "dobType" : "NA", "teamType" : "Apple Cup" }, { "_id" : "ipx9TM4MGo2Aoidt3", "projectName" : "test JUN 6", "abbName" : "test JUN 6", "projectType" : "2", "gender" : "NA", "dobType" : "NA", "teamType" : "test JUN 6" }, { "_id" : "w9NJ3WxFzSRHy9jAH", "projectName" : "test JUN 6 8", "abbName" : "test JUN 6 8", "projectType" : "2", "gender" : "NA", "dobType" : "NA", "teamType" : "test JUN 6 8" }, { "_id" : "nATejZnCQDLup3N6L", "projectName" : "Junior Girl's Team", "abbName" : "Junior Girl's Team", "projectType" : "2", "gender" : "NA", "dobType" : "NA", "teamType" : "Junior Girl's Team" }, { "_id" : "qrSmrhGGefnjp6sJW", "projectName" : "TeamFormat1", "abbName" : "TeamFormat1", "projectType" : "2", "gender" : "NA", "dobType" : "NA", "teamType" : "TeamFormat1" }, { "_id" : "vDwbRRW65kmzMEHP5", "projectName" : "TeamFormat2", "abbName" : "TeamFormat2", "projectType" : "2", "gender" : "NA", "dobType" : "NA", "teamType" : "TeamFormat2" } ], "categoryOrder" : [ "MCB", "MCG", "CB", "CG", "SJB", "SJG", "JB", "JG", "YB", "YG", "M", "W", "NMS", "NMD", "OS", "OD", "O", "Davis Cup", "5s", "Sunil Gavaskar Trophy", "Team TT", "5ss", "JR BOYS", "JR GIRLS", "JR BOYS TEAM", "JR GIRLS TEAM", "JR BOYS 1", "St.Peter Cup", "5s TEAM", "teamDraw", "Apple Cup", "test JUN 6", "test JUN 6 8", "Junior Girl's Team", "Junior Boy's Team", "TeamFormat1", "TeamFormat2" ], "singleEventsOrder" : [ "MCB", "MCG", "CB", "CG", "SJB", "SJG", "JB", "JG", "YB", "YG", "M", "W", "NMS", "NMD", "OS", "OD", "O", "Davis Cup", "5s", "Sunil Gavaskar Trophy", "Test Team" ], "teamEventsOrder" : [ "Davis Cup", "5s", "Sunil Gavaskar Trophy", "Team TT", "5ss", "JR BOYS", "JR GIRLS", "JR BOYS TEAM", "JR GIRLS TEAM", "JR BOYS 1", "St.Peter Cup", "5s TEAM", "teamDraw", "Apple Cup", "test JUN 6", "test JUN 6 8", "Junior Girl's Team", "Junior Boy's Team", "TeamFormat1", "TeamFormat2" ] })*/
                //var inserttournDet = tournamentEvents.insert({"_id":"QvHXDftiwsnc8gyfJ","projectMainName":"Table Tennis","categoryOrder":["MCB","MCG","CB","CG","SJB","SJG","JB","JG","SB","SG","YB","YG","M","W","NMS","NMD","OS","OD","O","11Even Junior Boy's Team","11Even Junior Girl's Team","11Even Senior Boy's Team","11Even Senior Girl's Team","5s","Executive Cup","Team Events","Sub Junior Girls Team","Sub Junior Boy's Doubles","Sub Junior Boys Team","Cadet Boys Team","Cadet Girls Team","Sub Junior Girl's Doubles","Men's Doubles","Women's Doubles","Junior Girl's Doubles","Junior Boy's Doubles","Junior Mixed Double's","Junior Boy's Team","Junior Girl's Team","Youth Girl's Doubles","Youth Boy's Doubles","Youth Boy's Team","Youth Girl's Team","Davis Cup"],"projectSubName":[{"_id":"kslkebduo27N2uux7","projectName":"Mini Cadet Boy's Singles","abbName":"MCB","projectType":"1","gender":"Male","dob":new Date("1992-10-08"),"dobType":"A"},{"_id":"kscge09m1u7N2uux7","projectName":"Mini Cadet Girl's Singles","abbName":"MCG","projectType":"1","gender":"Female","dob":new Date("1992-10-08"),"dobType":"A"},{"_id":"ksHHDWReSe7N2uux7","projectName":"Cadet Boy's Singles","abbName":"CB","projectType":"1","gender":"Male","dob":new Date("1992-10-08"),"dobType":"A"},{"_id":"AJ5LtgFtStmL6KgsD","projectName":"Cadet Girl's Singles","abbName":"CG","projectType":"1","gender":"Female","dob":new Date("1992-10-08"),"dobType":"A"},{"_id":"H8NKgBHk6JYrycCvf","projectName":"Sub-junior Boy's Singles","abbName":"SJB","projectType":"1","gender":"Male","dob":new Date("1992-10-08"),"dobType":"A"},{"_id":"tXpQ4DwgrAfFGR4oj","projectName":"Sub-junior Girl's Singles","abbName":"SJG","projectType":"1","gender":"Female","dob":new Date("1992-10-08"),"dobType":"A"},{"_id":"nPnrTCix3yAD3TmAz","projectName":"Junior Boy's Singles","abbName":"JB","projectType":"1","gender":"Male","dob":new Date("1992-10-08"),"dobType":"A"},{"_id":"arGJsShtr9sjRXwyT","projectName":"Junior Girl's Singles","abbName":"JG","projectType":"1","gender":"Female","dob":new Date("1992-10-08"),"dobType":"A"},{"_id":"nPnrTCix3yAD3TmAzz","projectName":"Senior Boy's Singles","abbName":"SB","projectType":"1","gender":"Male","dob":new Date("1992-10-08"),"dobType":"A"},{"_id":"arGJsShtr9sjRXwyTz","projectName":"Senior Girl's Singles","abbName":"SG","projectType":"1","gender":"Female","dob":new Date("1992-10-08"),"dobType":"A"},{"_id":"2XMzYon6GbE9TxmGN","projectName":"Youth Girl's Singles","abbName":"YG","projectType":"1","gender":"Female","dob":new Date("1992-10-08"),"dobType":"A"},{"_id":"5ioxxYpoPuox8huWC","projectName":"Youth Boy's Singles","abbName":"YB","projectType":"1","gender":"Male","dob":new Date("1992-10-08"),"dobType":"A"},{"_id":"Bn9emodsjqgWEi2pK","projectName":"Men's Singles","abbName":"M","projectType":"1","gender":"Male","dob":new Date("1992-10-08"),"dobType":"A"},{"_id":"giR4SJEhDJ6mtNGW7","projectName":"Women's Singles","abbName":"W","projectType":"1","gender":"Female","dob":new Date("1992-10-08"),"dobType":"A"},{"_id":"Sv6rNBU8IaiAozRXE","projectName":"NMS","abbName":"NMS","projectType":"1","gender":"All","dob":new Date("1992-10-08"),"dobType":"A"},{"_id":"Sv6rQkgf8pH87NbYZ","projectName":"NMD","abbName":"NMD","projectType":"1","gender":"All","dob":new Date("1992-10-08"),"dobType":"A"},{"_id":"Sv6rQkgf8FiAozRXE","projectName":"Open Singles","abbName":"OS","projectType":"1","gender":"All","dob":new Date("1992-10-08"),"dobType":"A"},{"_id":"pC8uK9wv9KycDEBpE","projectName":"Open Doubles","abbName":"OD","projectType":"1","gender":"All","dob":new Date("1992-10-08"),"dobType":"A"},{"_id":"oC8uK9wv9KycDEBkE","projectName":"Others","abbName":"O","projectType":"1","gender":"All","dob":new Date("1992-10-08"),"dobType":"A"},{"_id":"mb86CTD5HStbcM3wx","projectName":"5s","abbName":"5s","projectType":"2","gender":"NA","dob":new Date("1992-10-08"),"dobType":"A"},{"_id":"PHxz45Yhd7LX4iynG","projectName":"11Even Junior Boy's Team","abbName":"11Even Junior Boy's Team","projectType":"2","gender":"NA","dob":new Date("1992-10-08"),"dobType":"A"},{"_id":"3HJs3eXdRaf7aNt5p","projectName":"11Even Junior Girl's Team","abbName":"11Even Junior Girl's Team","projectType":"2","gender":"NA","dob":new Date("1992-10-08"),"dobType":"A"},{"_id":"zbeGzHksJ5oTf56wf","projectName":"11Even Senior Boy's Team","abbName":"11Even Senior Boy's Team","projectType":"2","gender":"NA","dob":new Date("1992-10-08"),"dobType":"A"},{"_id":"rgjM56p5f9ckAfYs5","projectName":"11Even Senior Girl's Team","abbName":"11Even Senior Girl's Team","projectType":"2","gender":"NA","dob":new Date("1992-10-08"),"dobType":"A"},{"_id":"u5Pjh9kaZ62uoqTxn","projectName":"Executive Cup","abbName":"Executive Cup","projectType":"2","gender":"NA","dob":new Date("1992-10-08"),"dobType":"A"},{"_id":"tqqphDyKxWAM4ADiX","projectName":"Team Events","abbName":"Team Events","projectType":"2","gender":"NA","dobType":"NA","teamType":"Team Events"},{"_id":"Ge33Y3NBhkzMaeg6z","projectName":"Sub Junior Boys Team","abbName":"Sub Junior Boys Team","projectType":"2","gender":"NA","dobType":"NA","teamType":"Sub Junior Boys Team"},{"_id":"v8ayRS6GDoepiLCMs","projectName":"Sub Junior Girls Team","abbName":"Sub Junior Girls Team","projectType":"2","gender":"NA","dobType":"NA","teamType":"Sub Junior Girls Team"},{"_id":"fm9c6G6csc3jNnHCJ","projectName":"Cadet Boys Team","abbName":"Cadet Boys Team","projectType":"2","gender":"NA","dobType":"NA","teamType":"Cadet Boys Team"},{"_id":"NcFRr3ceqwAy4HrjW","projectName":"Cadet Girls Team","abbName":"Cadet Girls Team","projectType":"2","gender":"NA","dobType":"NA","teamType":"Cadet Girls Team"},{"_id":"x6tZ8hrzoDcoaxK86","projectName":"Sub Junior Boy's Doubles","abbName":"Sub Junior Boy's Doubles","projectType":"2","gender":"NA","dobType":"NA","teamType":"Sub Junior Boy's Doubles"},{"_id":"sK8Mc9k4HWQFxc5g3","projectName":"Sub Junior Girl's Doubles","abbName":"Sub Junior Girl's Doubles","projectType":"2","gender":"NA","dobType":"NA","teamType":"Sub Junior Girl's Doubles"},{"_id":"ik3ckN39ATwMQcAW9","projectName":"Men's Doubles","abbName":"Men's Doubles","projectType":"2","gender":"NA","dobType":"NA","teamType":"Men's Doubles"},{"_id":"FFfWMYzmyiiq2B7Dq","projectName":"Women's Doubles","abbName":"Women's Doubles","projectType":"2","gender":"NA","dobType":"NA","teamType":"Women's Doubles"},{"_id":"HZmiA3GLHK3HFoHPv","projectName":"Junior Girl's Doubles","abbName":"Junior Girl's Doubles","projectType":"2","gender":"NA","dobType":"NA","teamType":"Junior Girl's Doubles"},{"_id":"aCeuT3FzNbcW4aior","projectName":"Junior Boy's Doubles","abbName":"Junior Boy's Doubles","projectType":"2","gender":"NA","dobType":"NA","teamType":"Junior Boy's Doubles"},{"_id":"xLfPMyDSGK7BoiHKK","projectName":"Junior Mixed Double's","abbName":"Junior Mixed Double's","projectType":"2","gender":"NA","dobType":"NA","teamType":"Junior Mixed Double's"},{"_id":"SgwPeJ6c2fWbQu7zq","projectName":"Junior Boy's Team","abbName":"Junior Boy's Team","projectType":"2","gender":"NA","dobType":"NA","teamType":"Junior Boy's Team"},{"_id":"5pMFtotvsi2S7q3sg","projectName":"Junior Girl's Team","abbName":"Junior Girl's Team","projectType":"2","gender":"NA","dobType":"NA","teamType":"Junior Girl's Team"},{"_id":"KDb3egsKiM4Aq3zbC","projectName":"Youth Boy's Doubles","abbName":"Youth Boy's Doubles","projectType":"2","gender":"NA","dobType":"NA","teamType":"Youth Boy's Doubles"},{"_id":"MP49Q2JtNLzzkwzB9","projectName":"Youth Girl's Doubles","abbName":"Youth Girl's Doubles","projectType":"2","gender":"NA","dobType":"NA","teamType":"Youth Girl's Doubles"},{"_id":"LQWq6EfJoyLiNdSW2","projectName":"Youth Boy's Team","abbName":"Youth Boy's Team","projectType":"2","gender":"NA","dobType":"NA","teamType":"Youth Boy's Team"},{"_id":"a8G9tdbqKwz4RKSLD","projectName":"Youth Girl's Team","abbName":"Youth Girl's Team","projectType":"2","gender":"NA","dobType":"NA","teamType":"Youth Girl's Team"},{"_id":"fxbKknvgFPsve7Laa","projectName":"Davis Cup","abbName":"Davis Cup","projectType":"2","gender":"NA","dobType":"NA","teamType":"Davis Cup"}],"singleEventsOrder":["MCB","MCG","CB","CG","SJB","SJG","JB","JG","SB","SG","YB","YG","M","W","NMS","NMD","OS","OD","O","11Even Junior Boy's Team","11Even Junior Girl's Team","11Even Senior Boy's Team","11Even Senior Girl's Team","5s","Executive Cup"],"teamEventsOrder":["11Even Junior Boy's Team","11Even Junior Girl's Team","11Even Senior Boy's Team","11Even Senior Girl's Team","5s","Executive Cup","Team Events","Sub Junior Girls Team","Sub Junior Boy's Doubles","Sub Junior Boys Team","Cadet Boys Team","Cadet Girls Team","Sub Junior Girl's Doubles","Men's Doubles","Women's Doubles","Junior Girl's Doubles","Junior Boy's Doubles","Junior Mixed Double's","Junior Boy's Team","Junior Girl's Team","Youth Girl's Doubles","Youth Boy's Doubles","Youth Boy's Team","Youth Girl's Team","Davis Cup"]})
                /*var insertTeamsFormat = teamsFormat.insert([{
                        "_id": "mb86CTD5HStbcM3wx",
                        "teamFormatName": "5s",
                        "selectedProjectId": "QvHXDftiwsnc8gyfJ",
                        "minPlayers": "2",
                        "maxPlayers": "4",
                        "rankedOrNot": "no",
                        "mandatoryPlayersArray": ["p1", "p2"],
                        "playerFormatArray": [{
                            "playerNo": "p1",
                            "mandatory": "yes",
                            "dateType": "onBefore",
                            "dateValue":new Date(),
                            "gender": "any",
                            "locationType": "any"
                        }, {
                            "playerNo": "p2",
                            "mandatory": "yes",
                            "dateType": "onBefore",
                            "dateValue":new Date(),
                            "gender": "any",
                            "locationType": "any"
                        }, {
                            "playerNo": "p3",
                            "mandatory": "no",
                            "dateType": "onBefore",
                            "dateValue":new Date(),
                            "gender": "any",
                            "locationType": "any"
                        }, {
                            "playerNo": "p4",
                            "mandatory": "no",
                            "dateType": "onBefore",
                            "dateValue":new Date(),
                            "gender": "any",
                            "locationType": "any"
                        }]
                    }, {
                        "_id": "PHxz45Yhd7LX4iynG",
                        "teamFormatName": "11Even Junior Boy's Team",
                        "selectedProjectId": "QvHXDftiwsnc8gyfJ",
                        "minPlayers": "3",
                        "maxPlayers": "5",
                        "rankedOrNot": "no",
                        "formatType": "schoolOnly",
                        "mandatoryPlayersArray": ["p1", "p2", "p3"],
                        "playerFormatArray": [{
                            "playerNo": "p1",
                            "mandatory": "yes",
                            "dateType": "onBefore",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "5",
                            "maxClass": "7"
                        }, {
                            "playerNo": "p2",
                            "mandatory": "yes",
                            "dateType": "onBefore",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "5",
                            "maxClass": "7"
                        }, {
                            "playerNo": "p3",
                            "mandatory": "yes",
                            "dateType": "onBefore",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "5",
                            "maxClass": "7"
                        }, {
                            "playerNo": "p4",
                            "mandatory": "no",
                            "dateType": "onBefore",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "5",
                            "maxClass": "7"
                        }, {
                            "playerNo": "p5",
                            "mandatory": "no",
                            "dateType": "onBefore",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "5",
                            "maxClass": "7"
                        }]
                    }, {
                        "_id": "3HJs3eXdRaf7aNt5p",
                        "teamFormatName": "11Even Junior Girl's Team",
                        "selectedProjectId": "QvHXDftiwsnc8gyfJ",
                        "minPlayers": "3",
                        "maxPlayers": "5",
                        "rankedOrNot": "no",
                        "formatType": "schoolOnly",
                        "mandatoryPlayersArray": ["p1", "p2", "p3"],
                        "playerFormatArray": [{
                            "playerNo": "p1",
                            "mandatory": "yes",
                            "dateType": "onBefore",
                            "dateValue": new Date(),
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "5",
                            "maxClass": "7"
                        }, {
                            "playerNo": "p2",
                            "mandatory": "yes",
                            "dateType": "onBefore",
                            "dateValue": new Date(),
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "5",
                            "maxClass": "7"
                        }, {
                            "playerNo": "p3",
                            "mandatory": "yes",
                            "dateType": "onBefore",
                            "dateValue": new Date(),
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "5",
                            "maxClass": "7"
                        }, {
                            "playerNo": "p4",
                            "mandatory": "no",
                            "dateType": "onBefore",
                            "dateValue": new Date(),
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "5",
                            "maxClass": "7"
                        }, {
                            "playerNo": "p5",
                            "mandatory": "no",
                            "dateType": "onBefore",
                            "dateValue": new Date(),
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "5",
                            "maxClass": "7"
                        }]
                    }, {
                        "_id": "zbeGzHksJ5oTf56wf",
                        "teamFormatName": "11Even Senior Boy's Team",
                        "selectedProjectId": "QvHXDftiwsnc8gyfJ",
                        "minPlayers": "3",
                        "maxPlayers": "5",
                        "rankedOrNot": "no",
                        "formatType": "schoolOnly",
                        "mandatoryPlayersArray": ["p1", "p2", "p3"],
                        "playerFormatArray": [{
                            "playerNo": "p1",
                            "mandatory": "yes",
                            "dateType": "onBefore",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "8",
                            "maxClass": "10"
                        }, {
                            "playerNo": "p2",
                            "mandatory": "yes",
                            "dateType": "onBefore",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "8",
                            "maxClass": "10"
                        }, {
                            "playerNo": "p3",
                            "mandatory": "yes",
                            "dateType": "onBefore",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "8",
                            "maxClass": "10"
                        }, {
                            "playerNo": "p4",
                            "mandatory": "no",
                            "dateType": "onBefore",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "8",
                            "maxClass": "10"
                        }, {
                            "playerNo": "p5",
                            "mandatory": "no",
                            "dateType": "onBefore",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "8",
                            "maxClass": "10"
                        }]
                    }, {
                        "_id": "rgjM56p5f9ckAfYs5",
                        "teamFormatName": "11Even Senior Girl's Team",
                        "selectedProjectId": "QvHXDftiwsnc8gyfJ",
                        "minPlayers": "3",
                        "maxPlayers": "5",
                        "rankedOrNot": "no",
                        "formatType": "schoolOnly",
                        "mandatoryPlayersArray": ["p1", "p2", "p3"],
                        "playerFormatArray": [{
                            "playerNo": "p1",
                            "mandatory": "yes",
                            "dateType": "onBefore",
                            "dateValue": new Date(),
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "8",
                            "maxClass": "10"
                        }, {
                            "playerNo": "p2",
                            "mandatory": "yes",
                            "dateType": "onBefore",
                            "dateValue": new Date(),
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "8",
                            "maxClass": "10"
                        }, {
                            "playerNo": "p3",
                            "mandatory": "yes",
                            "dateType": "onBefore",
                            "dateValue": new Date(),
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "8",
                            "maxClass": "10"
                        }, {
                            "playerNo": "p4",
                            "mandatory": "no",
                            "dateType": "onBefore",
                            "dateValue": new Date(),
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "8",
                            "maxClass": "10"
                        }, {
                            "playerNo": "p5",
                            "mandatory": "no",
                            "dateType": "onBefore",
                            "dateValue": new Date(),
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "8",
                            "maxClass": "10"
                        }]
                    }, {
                        "_id": "u5Pjh9kaZ62uoqTxn",
                        "teamFormatName": "Executive Cup",
                        "selectedProjectId": "QvHXDftiwsnc8gyfJ",
                        "minPlayers": "2",
                        "maxPlayers": "4",
                        "rankedOrNot": "no",
                        "formatType": "allExceptSchool",
                        "mandatoryPlayersArray": ["p1", "p2"],
                        "playerFormatArray": [{
                            "playerNo": "p1",
                            "mandatory": "yes",
                            "dateType": "any",
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p2",
                            "mandatory": "yes",
                            "dateType": "any",
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p3",
                            "mandatory": "no",
                            "dateType": "any",
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p4",
                            "mandatory": "no",
                            "dateType": "any",
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }]
                    }, db.teamsFormat.insert({
                        "_id": "tqqphDyKxWAM4ADiX",
                        "teamFormatName": "Team Events",
                        "selectedProjectId": "QvHXDftiwsnc8gyfJ",
                        "minPlayers": "2",
                        "maxPlayers": "5",
                        "rankedOrNot": "no",
                        "formatType": "allExceptSchool",
                        "mandatoryPlayersArray": ["p1", "p2"],
                        "playerFormatArray": [{
                            "playerNo": "p1",
                            "mandatory": "yes",
                            "dateType": "any",
                            "gender": "any",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p2",
                            "mandatory": "yes",
                            "dateType": "any",
                            "gender": "any",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p3",
                            "mandatory": "no",
                            "dateType": "any",
                            "gender": "any",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p4",
                            "mandatory": "no",
                            "dateType": "any",
                            "gender": "any",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p5",
                            "mandatory": "no",
                            "dateType": "any",
                            "gender": "any",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }]
                    }), db.teamsFormat.insert({
                        "_id": "Ge33Y3NBhkzMaeg6z",
                        "teamFormatName": "Sub Junior Boys Team",
                        "selectedProjectId": "QvHXDftiwsnc8gyfJ",
                        "minPlayers": "2",
                        "maxPlayers": "4",
                        "rankedOrNot": "no",
                        "formatType": "allExceptSchool",
                        "mandatoryPlayersArray": ["p1", "p2"],
                        "playerFormatArray": [{
                            "playerNo": "p1",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p2",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p3",
                            "mandatory": "no",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p4",
                            "mandatory": "no",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }]
                    }), db.teamsFormat.insert({
                        "_id": "v8ayRS6GDoepiLCMs",
                        "teamFormatName": "Sub Junior Girls Team",
                        "selectedProjectId": "QvHXDftiwsnc8gyfJ",
                        "minPlayers": "2",
                        "maxPlayers": "4",
                        "rankedOrNot": "no",
                        "formatType": "allExceptSchool",
                        "mandatoryPlayersArray": ["p1", "p2"],
                        "playerFormatArray": [{
                            "playerNo": "p1",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p2",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p3",
                            "mandatory": "no",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p4",
                            "mandatory": "no",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }]
                    }), db.teamsFormat.insert({
                        "_id": "fm9c6G6csc3jNnHCJ",
                        "teamFormatName": "Cadet Boys Team",
                        "selectedProjectId": "QvHXDftiwsnc8gyfJ",
                        "minPlayers": "2",
                        "maxPlayers": "4",
                        "rankedOrNot": "no",
                        "formatType": "allExceptSchool",
                        "mandatoryPlayersArray": ["p1", "p2"],
                        "playerFormatArray": [{
                            "playerNo": "p1",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p2",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p3",
                            "mandatory": "no",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p4",
                            "mandatory": "no",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }]
                    }), db.teamsFormat.insert({
                        "_id": "NcFRr3ceqwAy4HrjW",
                        "teamFormatName": "Cadet Girls Team",
                        "selectedProjectId": "QvHXDftiwsnc8gyfJ",
                        "minPlayers": "2",
                        "maxPlayers": "4",
                        "rankedOrNot": "no",
                        "formatType": "allExceptSchool",
                        "mandatoryPlayersArray": ["p1", "p2"],
                        "playerFormatArray": [{
                            "playerNo": "p1",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p2",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p3",
                            "mandatory": "no",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p4",
                            "mandatory": "no",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }]
                    }), db.teamsFormat.insert({
                        "_id": "x6tZ8hrzoDcoaxK86",
                        "teamFormatName": "Sub Junior Boy's Doubles",
                        "selectedProjectId": "QvHXDftiwsnc8gyfJ",
                        "minPlayers": "2",
                        "maxPlayers": "2",
                        "rankedOrNot": "no",
                        "formatType": "allExceptSchool",
                        "mandatoryPlayersArray": ["p1", "p2"],
                        "playerFormatArray": [{
                            "playerNo": "p1",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p2",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }]
                    }), db.teamsFormat.insert({
                        "_id": "sK8Mc9k4HWQFxc5g3",
                        "teamFormatName": "Sub Junior Girl's Doubles",
                        "selectedProjectId": "QvHXDftiwsnc8gyfJ",
                        "minPlayers": "2",
                        "maxPlayers": "2",
                        "rankedOrNot": "no",
                        "formatType": "allExceptSchool",
                        "mandatoryPlayersArray": ["p1", "p2"],
                        "playerFormatArray": [{
                            "playerNo": "p1",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p2",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }]
                    }), db.teamsFormat.insert({
                        "_id": "ik3ckN39ATwMQcAW9",
                        "teamFormatName": "Men's Doubles",
                        "selectedProjectId": "QvHXDftiwsnc8gyfJ",
                        "minPlayers": "2",
                        "maxPlayers": "2",
                        "rankedOrNot": "no",
                        "formatType": "allExceptSchool",
                        "mandatoryPlayersArray": ["p1", "p2"],
                        "playerFormatArray": [{
                            "playerNo": "p1",
                            "mandatory": "yes",
                            "dateType": "any",
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p2",
                            "mandatory": "yes",
                            "dateType": "any",
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }]
                    }), db.teamsFormat.insert({
                        "_id": "FFfWMYzmyiiq2B7Dq",
                        "teamFormatName": "Women's Doubles",
                        "selectedProjectId": "QvHXDftiwsnc8gyfJ",
                        "minPlayers": "2",
                        "maxPlayers": "2",
                        "rankedOrNot": "no",
                        "formatType": "allExceptSchool",
                        "mandatoryPlayersArray": ["p1", "p2"],
                        "playerFormatArray": [{
                            "playerNo": "p1",
                            "mandatory": "yes",
                            "dateType": "any",
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p2",
                            "mandatory": "yes",
                            "dateType": "any",
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }]
                    }), db.teamsFormat.insert({
                        "_id": "HZmiA3GLHK3HFoHPv",
                        "teamFormatName": "Junior Girl's Doubles",
                        "selectedProjectId": "QvHXDftiwsnc8gyfJ",
                        "minPlayers": "2",
                        "maxPlayers": "2",
                        "rankedOrNot": "no",
                        "formatType": "allExceptSchool",
                        "mandatoryPlayersArray": ["p1", "p2"],
                        "playerFormatArray": [{
                            "playerNo": "p1",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p2",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }]
                    }), db.teamsFormat.insert({
                        "_id": "aCeuT3FzNbcW4aior",
                        "teamFormatName": "Junior Boy's Doubles",
                        "selectedProjectId": "QvHXDftiwsnc8gyfJ",
                        "minPlayers": "2",
                        "maxPlayers": "2",
                        "rankedOrNot": "no",
                        "formatType": "allExceptSchool",
                        "mandatoryPlayersArray": ["p1", "p2"],
                        "playerFormatArray": [{
                            "playerNo": "p1",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p2",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }]
                    }), db.teamsFormat.insert({
                        "_id": "xLfPMyDSGK7BoiHKK",
                        "teamFormatName": "Junior Mixed Double's",
                        "selectedProjectId": "QvHXDftiwsnc8gyfJ",
                        "minPlayers": "2",
                        "maxPlayers": "2",
                        "rankedOrNot": "no",
                        "formatType": "allExceptSchool",
                        "mandatoryPlayersArray": ["p1", "p2"],
                        "playerFormatArray": [{
                            "playerNo": "p1",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "any",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p2",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "any",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }]
                    }), db.teamsFormat.insert({
                        "_id": "SgwPeJ6c2fWbQu7zq",
                        "teamFormatName": "Junior Boy's Team",
                        "selectedProjectId": "QvHXDftiwsnc8gyfJ",
                        "minPlayers": "2",
                        "maxPlayers": "4",
                        "rankedOrNot": "no",
                        "formatType": "allExceptSchool",
                        "mandatoryPlayersArray": ["p1", "p2"],
                        "playerFormatArray": [{
                            "playerNo": "p1",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p2",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p3",
                            "mandatory": "no",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p4",
                            "mandatory": "no",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }]
                    }), db.teamsFormat.insert({
                        "_id": "5pMFtotvsi2S7q3sg",
                        "teamFormatName": "Junior Girl's Team",
                        "selectedProjectId": "QvHXDftiwsnc8gyfJ",
                        "minPlayers": "2",
                        "maxPlayers": "4",
                        "rankedOrNot": "no",
                        "formatType": "allExceptSchool",
                        "mandatoryPlayersArray": ["p1", "p2"],
                        "playerFormatArray": [{
                            "playerNo": "p1",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "any",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p2",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "any",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p3",
                            "mandatory": "no",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "any",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p4",
                            "mandatory": "no",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "any",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }]
                    }), db.teamsFormat.insert({
                        "_id": "KDb3egsKiM4Aq3zbC",
                        "teamFormatName": "Youth Boy's Doubles",
                        "selectedProjectId": "QvHXDftiwsnc8gyfJ",
                        "minPlayers": "2",
                        "maxPlayers": "2",
                        "rankedOrNot": "no",
                        "formatType": "allExceptSchool",
                        "mandatoryPlayersArray": ["p1", "p2"],
                        "playerFormatArray": [{
                            "playerNo": "p1",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p2",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }]
                    }), db.teamsFormat.insert({
                        "_id": "MP49Q2JtNLzzkwzB9",
                        "teamFormatName": "Youth Girl's Doubles",
                        "selectedProjectId": "QvHXDftiwsnc8gyfJ",
                        "minPlayers": "2",
                        "maxPlayers": "2",
                        "rankedOrNot": "no",
                        "formatType": "allExceptSchool",
                        "mandatoryPlayersArray": ["p1", "p2"],
                        "playerFormatArray": [{
                            "playerNo": "p1",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p2",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }]
                    }), db.teamsFormat.insert({
                        "_id": "LQWq6EfJoyLiNdSW2",
                        "teamFormatName": "Youth Boy's Team",
                        "selectedProjectId": "QvHXDftiwsnc8gyfJ",
                        "minPlayers": "2",
                        "maxPlayers": "4",
                        "rankedOrNot": "no",
                        "formatType": "allExceptSchool",
                        "mandatoryPlayersArray": ["p1", "p2"],
                        "playerFormatArray": [{
                            "playerNo": "p1",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p2",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p3",
                            "mandatory": "no",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p4",
                            "mandatory": "no",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Male",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }]
                    }), db.teamsFormat.insert({
                        "_id": "a8G9tdbqKwz4RKSLD",
                        "teamFormatName": "Youth Girl's Team",
                        "selectedProjectId": "QvHXDftiwsnc8gyfJ",
                        "minPlayers": "2",
                        "maxPlayers": "4",
                        "rankedOrNot": "no",
                        "formatType": "allExceptSchool",
                        "mandatoryPlayersArray": ["p1", "p2"],
                        "playerFormatArray": [{
                            "playerNo": "p1",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p2",
                            "mandatory": "yes",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p3",
                            "mandatory": "no",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p4",
                            "mandatory": "no",
                            "dateType": "any",
                            "dateValue": new Date(),
                            "gender": "Female",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }]
                    }), db.teamsFormat.insert({
                        "_id": "fxbKknvgFPsve7Laa",
                        "teamFormatName": "Davis Cup",
                        "selectedProjectId": "QvHXDftiwsnc8gyfJ",
                        "minPlayers": "2",
                        "maxPlayers": "4",
                        "rankedOrNot": "no",
                        "formatType": "allExceptSchool",
                        "mandatoryPlayersArray": ["p1", "p2"],
                        "playerFormatArray": [{
                            "playerNo": "p1",
                            "mandatory": "yes",
                            "dateType": "any",
                            "gender": "any",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p2",
                            "mandatory": "yes",
                            "dateType": "any",
                            "gender": "any",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p3",
                            "mandatory": "no",
                            "dateType": "any",
                            "gender": "any",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }, {
                            "playerNo": "p4",
                            "mandatory": "no",
                            "dateType": "any",
                            "gender": "any",
                            "locationType": "any",
                            "minClass": "any",
                            "maxClass": "any"
                        }]
                    })])
                    /*var inserttournDet = tournamentEvents.insert({
                        "_id": "QvHXDftiwsnc8gyfJ",
                        "projectMainName": "Table Tennis",
                        "projectSubName": [{
                            "_id": "ksHHDWReSe7N2uux7",
                            "projectName": "Cadet Boy's Singles",
                            "abbName": "CB",
                            "projectType": "1",
                            "gende": "Male",
                            "dob": new Date("1992-10-08"),
                            "dobType": "A"
                        }, {
                            "_id": "AJ5LtgFtStmL6KgsD",
                            "projectName": "Cadet Girl's Singles",
                            "abbName": "CG",
                            "projectType": "1",
                            "gender": "Female",
                            "dob": new Date("1992-10-08"),
                            "dobType": "A"
                        }, {
                            "_id": "H8NKgBHk6JYrycCvf",
                            "projectName": "Sub-junior Boy's Singles",
                            "abbName": "SJB",
                            "projectType": "1",
                            "gender": "Female",
                            "dob": new Date("1992-10-08"),
                            "dobType": "A"
                        }, {
                            "_id": "tXpQ4DwgrAfFGR4oj",
                            "projectName": "Sub-junior Girl's Singles",
                            "abbName": "SJG",
                            "projectType": "1",
                            "gender": "Female",
                            "dob": new Date("1992-10-08"),
                            "dobType": "A"
                        }, {
                            "_id": "nPnrTCix3yAD3TmAz",
                            "projectName": "Junior Boy's Singles",
                            "abbName": "JB",
                            "projectType": "1",
                            "gender": "Male",
                            "dob": new Date("1992-10-08"),
                            "dobType": "A"
                        }, {
                            "_id": "arGJsShtr9sjRXwyT",
                            "projectName": "Junior Girl's Singles",
                            "abbName": "JG",
                            "projectType": "1",
                            "gender": "Female",
                            "dob": new Date("1992-10-08"),
                            "dobType": "A"
                        }, {
                            "_id": "nPnrTCix3yAD3TmAzz",
                            "projectName": "Senior Boy's Singles",
                            "abbName": "SB",
                            "projectType": "1",
                            "gender": "Male",
                            "dob": new Date("1992-10-08"),
                            "dobType": "A"
                        }, {
                            "_id": "arGJsShtr9sjRXwyTz",
                            "projectName": "Senior Girl's Singles",
                            "abbName": "SG",
                            "projectType": "1",
                            "gender": "Female",
                            "dob": new Date("1992-10-08"),
                            "dobType": "A"
                        }, {
                            "_id": "2XMzYon6GbE9TxmGN",
                            "projectName": "Youth Girl's Singles",
                            "abbName": "YG",
                            "projectType": "1",
                            "gender": "Female",
                            "dob": new Date("1992-10-08"),
                            "dobType": "A"
                        }, {
                            "_id": "5ioxxYpoPuox8huWC",
                            "projectName": "Youth Boy's Singles",
                            "abbName": "YB",
                            "projectType": "1",
                            "gender": "Male",
                            "dob": new Date("1992-10-08"),
                            "dobType": "A"
                        }, {
                            "_id": "Bn9emodsjqgWEi2pK",
                            "projectName": "Men's Singles",
                            "abbName": "M",
                            "projectType": "1",
                            "gender": "Male",
                            "dob": new Date("1992-10-08"),
                            "dobType": "A"
                        }, {
                            "_id": "giR4SJEhDJ6mtNGW7",
                            "projectName": "Women's Singles",
                            "abbName": "W",
                            "projectType": "1",
                            "gender": "Female",
                            "dob": new Date("1992-10-08"),
                            "dobType": "A"
                        }, {
                            "_id": "Sv6rNBU8IaiAozRXE",
                            "projectName": "NMS",
                            "abbName": "NMS",
                            "projectType": "1",
                            "gender": "All",
                            "dob": new Date("1992-10-08"),
                            "dobType": "A"
                        }, {
                            "_id": "Sv6rQkgf8pH87NbYZ",
                            "projectName": "NMD",
                            "abbName": "NMD",
                            "projectType": "1",
                            "gender": "All",
                            "dob": new Date("1992-10-08"),
                            "dobType": "A"
                        }, {
                            "_id": "Sv6rQkgf8FiAozRXE",
                            "projectName": "Open Singles",
                            "abbName": "OS",
                            "projectType": "1",
                            "gender": "All",
                            "dob": new Date("1992-10-08"),
                            "dobType": "A"
                        }, {
                            "_id": "pC8uK9wv9KycDEBpE",
                            "projectName": "Open Doubles",
                            "abbName": "OD",
                            "projectType": "1",
                            "gender": "All",
                            "dob": new Date("1992-10-08"),
                            "dobType": "A"
                        }, {
                            "_id": "aewykxSHqPJH4Q6fD",
                            "projectName": "Junior Boy's Team",
                            "abbName": "Junior Boy's Team",
                            "projectType": "2",
                            "gender": "NA",
                            "dobType": "NA",
                            "teamType": "Junior Boy's Team"
                        }, {
                            "_id": "DomYa9ovaePagfTt6",
                            "projectName": "Junior Girl's Team",
                            "abbName": "Junior Girl's Team",
                            "projectType": "2",
                            "gender": "NA",
                            "dobType": "NA",
                            "teamType": "Junior Girl's Team"
                        }, {
                            "_id": "Gs3rvrB6g5PKcJzBr",
                            "projectName": "Senior Boy's Team",
                            "abbName": "Senior Boy's Team",
                            "projectType": "2",
                            "gender": "NA",
                            "dobType": "NA",
                            "teamType": "Senior Boy's Team"
                        }, {
                            "_id": "eNPhspMvieRbgHRg9",
                            "projectName": "Senior Girl's Team",
                            "abbName": "Senior Girl's Team",
                            "projectType": "2",
                            "gender": "NA",
                            "dobType": "NA",
                            "teamType": "Senior Girl's Team"
                        }],
                        "categoryOrder": ["MCB", "MCG", "CB", "CG", "SJB", "SJG", "JB", "JG", "SB", "SG", "YB", "YG", "M", "W", "NMS", "NMD", "OS", "OD", "O", "Junior Boy's Team", "Junior Girl's Team", "Senior Boy's Team", "Senior Girl's Team"],
                        "singleEventsOrder": ["MCB", "MCG", "CB", "CG", "SJB", "SJG", "JB", "JG", "SB", "SG", "YB", "YG", "M", "W", "NMS", "NMD", "OS", "OD", "O"],
                        "teamEventsOrder": ["Junior Boy's Team", "Junior Girl's Team", "Senior Boy's Team", "Senior Girl's Team"]
                    })*/
                if (schoolDet == undefined) {
                   /* schoolEventsToFind.insert({
                        key: "School",
                        individualEventNAME: ["JB", "JG", "SB", "SG"],
                        teamEventNAME: ["Junior Boy's Team", "Junior Girl's Team", "Senior Boy's Team", "Senior Girl's Team"],
                    })*/
                    return true
                }
            } catch (e) {
            }
        } catch (e) {
        }
    },
    "calenderEventsCreate": function() {
        try {
            var upEvents;
            var paEvents;
            var s = 0;
            upEvents = events.find({
                tournamentEvent: true
            }, {
                fields: {
                    eventName: 1,
                    eventStartDate: 1,
                    eventStartDate1: 1,
                }
            }).fetch();

            paEvents = pastEvents.find({
                tournamentEvent: true
            }, {
                fields: {
                    eventName: 1,
                    eventStartDate: 1,
                    eventStartDate1: 1,
                }
            }).fetch();


            for (var i = 0; i < upEvents.length; i++) {
                if (calenderEvents.findOne({
                        "_id": upEvents[i]._id
                    }) == undefined) {
                    var r = calenderEvents.insert(upEvents[i])
                    if (r) {
                        s = parseInt(s) + 1;
                    }
                }
            }
            for (var j = 0; j < paEvents.length; j++) {
                if (calenderEvents.findOne({
                        "_id": paEvents[j]._id
                    }) == undefined) {
                    var r = calenderEvents.insert(paEvents[j])
                    if (r)
                        s = parseInt(s) + 1;
                }
            }
            return s;
        } catch (e) {}
    },
    "lengthOfEventsUp": function() {
        try {
            var s = events.find({
                tournamentEvent: true
            }).fetch();
            if (s.length)
                return s.length;
            else return 0
        } catch (e) {}
    },
    "lengthOfPastEventsLen": function() {
        try {
            var s = pastEvents.find({
                tournamentEvent: true
            }).fetch();
            if (s.length)
                return s.length;
            else
                return 0;
        } catch (e) {}
    },
    lengthOfcalenderEventsCAll: function() {
        try {
            var s = calenderEvents.find({}).fetch();
            if (s.length)
                return s.length;
            else
                return 0;
        } catch (e) {}
    },
    movePastTournamentToUpcoming: function(tournamentId, startDate, endDate, entryDate) {
        try {

            if (tournamentId && startDate && endDate && entryDate && new Date(startDate) && new Date(endDate) && new Date(entryDate)) {
                var l = pastEvents.findOne({
                    tournamentEvent: true,
                    "_id": tournamentId
                })
                if (l) {
                    var toMoveToUpEvents; //
                    var toMoveToMyUpEvents; //
                    var toMoveToScrollEvents; //
                    var toUpdateCalenderTourn; //
                    var toRemoveFromPastEvents;
                    var toRemoveFromMyPastEvents;
                    var fetchCAtegories; //
                    var toMoveCategories; //
                    var toDeleteCategories;

                    if (events.findOne({
                            "_id": l._id
                        }) == undefined) {
                        var stateAssocId = ""
                        if (l.paymentEntry == null || l.paymentEntry == undefined) {
                            l.paymentEntry = "no"
                        }
                        if(l.stateAssocId){
                            stateAssocId = l.stateAssocId
                        }
                        toMoveToUpEvents = events.insert({
                            "_id": l._id,
                            "eventName": l.eventName,
                            "projectId": l.projectId,
                            "eventStartDate": startDate,
                            "eventEndDate": endDate,
                            "eventSubscriptionLastDate": entryDate,
                            "domainId": l.domainId,
                            "eventOrganizer": l.eventOrganizer,
                            "description": l.description,
                            "sponsorPdf": l.sponsorPdf,
                            "sponsorLogo": l.sponsorLogo,
                            "sponsorUrl": l.sponsorUrl,
                            "sponsorMailId": l.sponsorMailId,
                            "rulesAndRegulations": l.rulesAndRegulations,
                            "domainName": l.domainName,
                            "projectName": l.projectName,
                            "venueLatitude": l.venueLatitude,
                            "venueLongitude": l.venueLongitude,
                            "venueAddress": l.venueAddress,
                            "eventStartDate1": moment(new Date(startDate)).format("YYYY-MM-DD"),
                            "eventEndDate1": moment(new Date(endDate)).format("YYYY-MM-DD"),
                            "eventSubscriptionLastDate1": moment(new Date(entryDate)).format("YYYY-MM-DD"),
                            "offsetOfDomain": l.offsetOfDomain,
                            "timeZoneName": l.timeZoneName,
                            "timezoneIdEventLat": l.timezoneIdEventLat,
                            "timezoneIdEventLng": l.timezoneIdEventLng,
                            "tournamentEvent": l.tournamentEvent,
                            "offset": l.offset,
                            "subscriptionTypeDirect": l.subscriptionTypeDirect,
                            "subscriptionTypeHyper": l.subscriptionTypeHyper,
                            "hyperLinkValue": l.hyperLinkValue,
                            "subscriptionTypeMail": l.subscriptionTypeMail,
                            "subscriptionTypeMailValue": l.subscriptionTypeMailValue,
                            "eventsUnderTournament": l.eventsUnderTournament,
                            "eventsProjectIdUnderTourn": l.eventsProjectIdUnderTourn,
                            "eventCreatedDate": l.eventCreatedDate,
                            "paymentEntry": l.paymentEntry,
                            "stateAssocId":stateAssocId
                                //"eventUpdatedDate":l.eventUpdatedDate
                        });

                        if(l.tournamentType){
                            events.update({
                                "_id": l._id,
                            },{
                                $set:{
                                    "tournamentType":l.tournamentType
                                }
                            })
                        }

                        if (toMoveToUpEvents) {
                            toMoveToMyUpEvents = myUpcomingEvents.insert({
                                "_id": l._id,
                                "tournamentId": l._id,
                                eventName: l.eventName,
                                projectId: l.projectId,
                                projectName: l.projectName,
                                eventStartDate: startDate,
                                eventEndDate: endDate,
                                eventSubscriptionLastDate: entryDate,
                                domainId: l.domainId,
                                domainName: l.domainName,
                                eventOrganizer: l.eventOrganizer,
                                "eventStartDate1": moment(new Date(startDate)).format("YYYY-MM-DD"),
                                "eventEndDate1": moment(new Date(endDate)).format("YYYY-MM-DD"),
                                "eventsUnderTournament": l.eventsUnderTournament
                            });


                            toMoveToScrollEvents = scrollableevents.insert({
                                "_id": l._id,
                                "eventName": l.projectName + ":" + l.eventName + ", " + "@" + l.domainName,
                                "domainId": l.domainId,
                                "eventStartDate": startDate,
                                "eventEndDate": endDate,
                                "eventStartDate1": moment(new Date(startDate)).format("YYYY-MM-DD"),
                                "eventEndDate1": moment(new Date(endDate)).format("YYYY-MM-DD"),
                                "offset": l.offset,
                                "offsetOfDomain": l.offsetOfDomain,
                                "timeZoneName": l.timeZoneName
                            });


                            toUpdateCalenderTourn = calenderEvents.update({
                                "_id": l._id
                            }, {
                                $set: {
                                    eventName: l.eventName,
                                    eventStartDate1: moment(new Date(startDate)).format("YYYY-MM-DD"),
                                }
                            });


                            fetchCAtegories = pastEvents.find({
                                "tournamentId": l._id
                            }).fetch();


                            if (fetchCAtegories && fetchCAtegories.length != 0) {
                                for (var x = 0; x < fetchCAtegories.length; x++) {
                                    xData = fetchCAtegories[x];
                                    var toMoveCategories = events.insert({
                                        "_id": xData._id,
                                        "eventName": xData.eventName,
                                        "projectId": xData.projectId,
                                        "eventStartDate": startDate,
                                        "eventEndDate": endDate,
                                        "eventSubscriptionLastDate": entryDate,
                                        "domainId": xData.domainId,
                                        "eventSubId": xData.eventSubId,
                                        "abbName": xData.abbName,
                                        "prize": xData.prize,
                                        "projectType": xData.projectType,
                                        "eventOrganizer": xData.eventOrganizer,
                                        "description": xData.description,
                                        "sponsorPdf": xData.sponsorPdf,
                                        "sponsorLogo": xData.sponsorLogo,
                                        "sponsorUrl": xData.sponsorUrl,
                                        "sponsorMailId": xData.sponsorMailId,
                                        "rulesAndRegulations": xData.rulesAndRegulations,
                                        "domainName": xData.domainName,
                                        "projectName": xData.projectName,
                                        "venueLatitude": xData.venueLatitude,
                                        "venueLongitude": xData.venueLongitude,
                                        "venueAddress": xData.venueAddress,
                                        "eventStartDate1": moment(new Date(startDate)).format("YYYY-MM-DD"),
                                        "eventEndDate1": moment(new Date(endDate)).format("YYYY-MM-DD"),
                                        "eventSubscriptionLastDate1": moment(new Date(entryDate)).format("YYYY-MM-DD"),
                                        "offsetOfDomain": xData.offsetOfDomain,
                                        "timeZoneName": xData.timeZoneName,
                                        "timezoneIdEventLat": xData.timezoneIdEventLat,
                                        "timezoneIdEventLng": xData.timezoneIdEventLng,
                                        "tournamentEvent": false,
                                        "tournamentId": l._id,
                                        "offset": l.offset,
                                        "eventParticipants": xData.eventParticipants,
                                        "eventCreatedDate": xData.eventCreatedDate,
                                        stateAssocId:stateAssocId
                                        //"eventUpdatedDate":xData.eventUpdatedDate
                                    });

                                    if(xData.tournamentType){
                                        events.update({
                                            "_id": xData._id,
                                        },{
                                            $set:{
                                                "tournamentType":xData.tournamentType
                                            }
                                        })
                                    }


                                }
                                toRemoveFromPastEvents = pastEvents.remove({
                                    "_id": l._id
                                })
                                toRemoveFromMyPastEvents = myPastEvents.remove({
                                    "_id": l._id
                                })
                                toDeleteCategories = pastEvents.remove({
                                    tournamentId: l._id
                                });
                            }
                        }
                    }
                }
            }
        } catch (e) {

        }
    }
});

/*for (var i = 0; i < l.length; i++) {
    var e = l[i];
    if (e.timeZoneName) {
        if (events.findOne({
                "_id": e._id
            }) == undefined) {
            if (moment(moment(new Date(e.eventEndDate1)).format("YYYY-MM-DD")) < moment(moment.tz(e.timeZoneName).format("YYYY-MM-DD"))) {
                pastEvents.insert(e);
                if (myPastEvents.findOne({
                        "_id": e._id
                    }) == undefined) {
                    myPastEvents.insert({
                        "_id": e._id,
                        "tournamentId": e._id.toString(),
                        eventName: e.eventName,
                        projectId: e.projectId,
                        projectName: e.projectName,
                        eventStartDate: e.eventStartDate,
                        eventEndDate: e.eventEndDate,
                        eventSubscriptionLastDate: e.eventSubscriptionLastDate,
                        domainId: e.domainId,
                        domainName: e.domainName,
                        eventOrganizer: e.eventOrganizer,
                        eventsUnderTournament: e.eventsUnderTournament,
                        "eventStartDate1": moment(new Date(e.eventStartDate)).format("YYYY-MM-DD"),
                        "eventEndDate1": moment(new Date(e.eventEndDate)).format("YYYY-MM-DD"),
                    });
                }

                events.remove(e);
                myUpcomingEvents.remove({
                    tournamentId: e._id
                });
                scrollableevents.remove({
                    "_id": e._id
                })
                events.find({
                    "tournamentId": e._id
                }).fetch().forEach(function(eve, i) {

                    if (pastEvents.findOne({
                            "_id": eve._id
                        }) == undefined) {
                        pastEvents.insert(eve)
                        events.remove(eve)
                    }

                })
            } else {
                break;
            }
        }
    }
}*/