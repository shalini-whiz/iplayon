Meteor.methods({
    "liveTourSubscription": async function(data) {
       
        try {
            var successJson = succesData();
            var failureJson = failureData();
            var errorMsg = [];
            if (typeof data == "string") {
                data = data.replace("\\", "");
                data = JSON.parse(data);
            }

            var objCheck = false;
            if (data) 
            {
                objCheck = Match.test(data, {
                        "country": String,"stateId":String,"userId":String           
                });
                var validCountryData = validCountry(data.country);
                var validStateData = validStateAssoc(data.stateId);
                if(validCountryData == false)
                    errorMsg.push("Invalid country");
                if(validStateData == false)
                    errorMsg.push("Invalid association");

                var checkUser = userExistsByRole(data.userId,"player");
                if(checkUser == undefined)
                    errorMsg.push(invalidUserMsg);

                if(errorMsg.length == 0)
                {
                    var tourList = events.find({"eventOrganizer":validStateData,
                        "tournamentEvent":true},{sort:{
                        "eventEndDate1":1
                    }}).fetch();

                    var tourInfo = undefined;
                    if(tourList.length > 0)
                    {
                        tourInfo = tourList[0];
                    }


                    if(tourInfo)
                    {
                        var subscriptionEvents = await Meteor.call("eventListUnderTourn",tourInfo._id,data.userId)
                        successJson["message"] = "Tournament Subscription details";

                        if(subscriptionEvents.status == "success")
                        {
                            if(subscriptionEvents.eventFeeSettings)
                                successJson["eventFeeSettings"] = subscriptionEvents.eventFeeSettings;
                            if(subscriptionEvents.data1)
                                successJson["eventsData"] = subscriptionEvents.data1;
                            if(subscriptionEvents.data)
                                successJson["data"] = subscriptionEvents.data;
                            if(subscriptionEvents.playerEntries)
                                successJson["playerEntries"] = subscriptionEvents.playerEntries;

                            successJson["subscribeBoolean"] = subscriptionEvents.subscribeBoolean
                            tourInfo["subscribeBoolean"] =subscriptionEvents.subscribeBoolean;
                        }

                        successJson["tourInfo"] = tourInfo;

                        return successJson;
                    }
                    else
                    {
                        failureJson["message"] = "Tournament yet to be announced";
                        return failureJson;
                    }
                }
                else
                {
                    failureJson["message"] = "Invalid data";
                    failureJson["errorMsg"] = errorMsg;
                    return failureJson;
                }
            }
            else
            {
                failureJson["message"] = paramMsg;
                return failureJson;
            }

        } catch (e) {
            errorLog(e)
            failureJson["message"] = "Could not fetch tournament "+e;
            return failureJson;
        }
    }
})
