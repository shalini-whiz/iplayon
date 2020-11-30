
Meteor.methods({
    "setLiveLink": function(xData) 
    {

        var res = {
            "status": "failure",
            "data": 0,
            "message": "live links cannot be inserted"
        }

        try {
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }

            if (xData) {

                if (true) {
                    if (xData.tournamentId) {
                        var eveDet = events.findOne({
                            _id: xData.tournamentId
                        })
                        if(eveDet==undefined){
                            eveDet = pastEvents.findOne({
                                _id: xData.tournamentId
                            })
                        }
                        if(eveDet){
                            if(xData.livelinks)
                            {
                                
                                    var findLive = liveLinks.findOne({
                                        "tournamentId":xData.tournamentId
                                    });
                                    xData.livelinks.linkDate = moment(new Date(xData.livelinks.linkDate)).format("DD MMM YYYY");


                                    if(findLive==undefined||findLive==null)
                                    {

                                        var insetLive = liveLinks.insert({
                                            "tournamentId":xData.tournamentId,
                                            "links":[xData.livelinks]
                                        })
                                        if(insetLive){
                                            res.message = "live links inserted"
                                            res.data = insetLive
                                            res.status = "success"
                                        }else{
                                            res.message = "live links cannot be inserted"
                                        }
                                    }else{


                                        var result = liveLinks.update({
                                            "tournamentId":xData.tournamentId
                                        },
                                        {$addToSet:{"links":xData.livelinks}})
                                        if(result)
                                        {
                                            res.message = "live links inserted"
                                            res.data = result
                                            res.status = "success"

                                        }
                                        else
                                        {
                                            res.message = "live links cannot be inserted"

                                        }

                                       // res.message = "live links are present for this tournamentId"
                                    }
                                
                            }
                            else{
                                res.message = "livelinks are required"
                            }
                        }
                        else{
                            res.message = "Invalid tournament details"
                        }

                    } else {
                        res.message = "Invalid tournamentId"
                    }
                }
            } else {
                res.message = "xData is null"
            }
            return res
        } catch (e) {
            res.message = e
            if (e && e.toString()) {
                res.error = e.toString()
            }
            return res
        }
    },
    "removeLiveLink": function(xData) {

        var res = {
            "status": "failure",
            "data": 0,
            "message": "live links cannot be inserted"
        }

        try {
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }

            if (xData) {

                if (true) {
                    if (xData.tournamentId) {
                        var eveDet = events.findOne({
                            _id: xData.tournamentId
                        })
                        if(eveDet==undefined){
                            eveDet = pastEvents.findOne({
                                _id: xData.tournamentId
                            })
                        }
                        if(eveDet){
                            if(xData.linkData)
                            {
                                
                                    var findLive = liveLinks.findOne({
                                        "tournamentId":xData.tournamentId,
                                        "links":{$in:[xData.linkData]}
                                    });

                                    xData.linkData.linkDate = new Date(xData.linkData.linkDate);



                                    if(findLive!=undefined||findLive!=null)
                                    {
                                        var removeLive = liveLinks.update({
                                            "tournamentId":xData.tournamentId},
                                            {$pull:{"links":
                                                {"link":xData.linkData.link,
                                                "title":xData.linkData.title,
                                                "linkDate":xData.linkData.linkDate
                                                }}}
                                        );
                                        if(removeLive){
                                            res.message = "live links removed"
                                            res.data = removeLive
                                            res.status = "success"
                                        }else{
                                            res.message = "live links cannot be inserted"
                                        }
                                    }else{
                                        res.message = "live links cannot be removed"                                 
                                    }
                                
                            }
                            else{
                                res.message = "livelinks are required"
                            }
                        }
                        else{
                            res.message = "Invalid tournament details"
                        }

                    } else {
                        res.message = "Invalid tournamentId"
                    }
                }
            } else {
                res.message = "xData is null"
            }
            return res
        } catch (e) {
            res.message = e
            if (e && e.toString()) {
                res.error = e.toString()
            }
            return res
        }
    },

})

Meteor.methods({
    getLiveLinksOfTournament:function(xData){
        var res = {
            "status": "failure",
            "data": 0,
            "message": "No live links for this tournament"
        }

        try {
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }

            if (xData && xData.tournamentId) 
            {
                

                /*
                var getLiveLinkDdet = liveLinks.findOne({
                    "tournamentId":xData.tournamentId
                });*/
                var getLiveLinkDdet =  liveLinks.aggregate([
                    {$match:{"tournamentId":xData.tournamentId}},
                    {$unwind:"$links"},
                    {$sort:{"links.linkDate":-1}}, 
                    {$group:{
                        "_id":"$_id",
                        "links":{$push:"$links"}
                    }}
                ]);
                            
                if(getLiveLinkDdet && getLiveLinkDdet.length>0 && getLiveLinkDdet[0] && getLiveLinkDdet[0].links)
                {
                    res.message = "Live  links"
                    res.status = "success"
                    res.data = getLiveLinkDdet[0].links
                    if(xData.tournamentId=="livelinks_11sports"){
                        var eventDat = events.findOne({
                            "_id":"livelinks_11sports"
                        })
                        if(eventDat){
                            res.tournamentData = eventDat
                        }
                    }
                }
                else{
                    res.message = "No live links"
                }
                            
            } 
            else{
                res.message = "No live links"
                        
            } 
                   
        
            return res
        } catch (e) {
            res.message = e
            if (e && e.toString()) {
                res.error = e.toString()
            }
            return res
        }
    }
})



Meteor.methods({
    "insertLiveLink": async function(xData) {
        var res = {
            "status": "failure",
            "data": 0,
            "message": "live links cannot be inserted"
        }

        try {
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }

            if (xData) {

                if (true) {
                    if (xData.tournamentId) {
                        var eveDet = events.findOne({
                            _id: xData.tournamentId
                        })
                        if(eveDet==undefined){
                            eveDet = pastEvents.findOne({
                                _id: xData.tournamentId
                            })
                        }
                        if(eveDet){
                            if(xData.livelinks){
                                if(xData.livelinks.length>0){
                                    var findLive = liveLinks.findOne({
                                        "tournamentId":xData.tournamentId
                                    })
                                    if(findLive==undefined||findLive==null){
                                        var insetLive = liveLinks.insert({
                                            "tournamentId":xData.tournamentId,
                                            "links":xData.livelinks
                                        })
                                        if(insetLive){
                                            res.message = "live links inserted"
                                            res.data = insetLive
                                            res.status = "success"
                                        }else{
                                            res.message = "live links cannot be inserted"
                                        }
                                    }else{
                                        res.message = "live links are present for this tournamentId"
                                    }
                                }
                                else{
                                    res.message = "livelinks cannot be empty"
                                }
                            }
                            else{
                                res.message = "livelinks are required"
                            }
                        }
                        else{
                            res.message = "Invalid tournament details"
                        }

                    } else {
                        res.message = "Invalid tournamentId"
                    }
                }
            } else {
                res.message = "xData is null"
            }
            return res
        } catch (e) {
            res.message = e
            if (e && e.toString()) {
                res.error = e.toString()
            }
            return res
        }
    }
})

Meteor.methods({
    getLiveLinksForStateAndOrganizer:function(xData){
        var res = {
            "status": "failure",
            "data": 0,
            "message": "No live links for this state's tournament"
        }

        try {
            if (typeof xData == "string") {
                xData = xData.replace("\\", "");
                xData = JSON.parse(xData);
            }

            if (xData && xData.tournamentId) {

                if (true) {
                    var checkDomains = true
                    if (checkDomains) {
                        var query = {
                            "_id":xData.tournamentId
                        }
                        var det = events.findOne(query)

                        if (det == undefined || det == null) {
                            det = pastEvents.findOne(query)
                            db = "pastEvents"
                        }

                        if (det) {
                            var getLiveLinkDdet = [{
                                                "link": "https://www.youtube.com/watch?v=e-9AaBU-ir4",
                                                "linkDate": "2018-10-29T13:13:44.660Z"
                                            }, {
                                                "link": "https://www.youtube.com/watch?v=UUzv8AHQtdk",
                                                "linkDate": "2018-10-29T13:13:44.660Z"
                                            }, {
                                                "link": "https://www.youtube.com/watch?v=OgFL_9Opc4s",
                                                "linkDate": "2018-10-29T13:13:44.660Z"
                                            }]
                            if(getLiveLinkDdet && getLiveLinkDdet){
                                res.message = "Live  links"
                                res.status = "success"
                                res.data = getLiveLinkDdet
                            }
                            else{
                                res.message = "No live links for this state"
                            }
                            
                        } else{
                            res.message = "No tournament for this state"
                        }
                    } 
                    else{
                        res.message = "state is Invalid"
                    }
                } else{
                    res.message = "state is required"
                }
            } else {
                res.message = "eventOrganizer is required"
            }
            return res
        } catch (e) {
            res.message = e
            if (e && e.toString()) {
                res.error = e.toString()
            }
            return res
        }
    }
})