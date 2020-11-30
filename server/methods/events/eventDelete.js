import { MatchCollectionDB }from '../../publications/MatchCollectionDb.js';
import { teamMatchCollectionDB } from '../../publications/MatchCollectionDbTeam.js';




/**
 * Meteor Method to delete an event
 * @collectionName : events, eventUploads
 * @passedByValues : eventId
 * @dataType : String
 * @dbQuery : remove
 * @methodDescription : for given eventId fetch the sponsorLogoId, sponsorPdfId and rulesAndRegulationsID
 *                      remove the corresponding files from eventUploads folder and eventUploads collection.
 *                      then remove the event for given eventId
 */
Meteor.methods({
    'deleteEvents': function(xId) {
        try{
            check(xId, String);

            var evId = events.find({
                "_id": xId
            }).fetch();
            if (evId) 
            {
                var tournamentId = xId;
                var eventOrganizer = evId[0].eventOrganizer;
                var sportID = evId[0].projectId[0];

                if (evId[0].sponsorPdf)
                    for (var i = 0; i < evId[0].sponsorPdf.length; i++) {
                        eventUploads.remove({
                            "_id": evId[0].sponsorPdf[i]
                        }); //remove corresponding sponsorspdf file
                    }
                if (evId[0].sponsorLogo)
                    for (var i = 0; i < evId[0].sponsorLogo.length; i++) {
                        eventUploads.remove({
                            "_id": evId[0].sponsorLogo[i]
                        }); //remove corresponding sponsorLogo file
                    }
                if (evId[0].rulesAndRegulations)
                    for (var i = 0; i < evId[0].rulesAndRegulations.length; i++) {
                        eventUploads.remove({
                            "_id": evId[0].rulesAndRegulations
                        }); //remove corresponding rules and regulations pdf file
                    }



                //individual draws
                //team draws
                // roundrobin individual & team draws (draws, spec, detail score)
                //player points
                var totEventList = [];
                var eventList1 = [];
                var eventList2 = [];

                var raw1 = MatchCollectionDB.rawCollection();
                var distinct1 = Meteor.wrapAsync(raw1.distinct, raw1);
                eventList1 = distinct1('eventName', {"tournamentId":xId});

                var raw2 = teamMatchCollectionDB.rawCollection();
                var distinct2 = Meteor.wrapAsync(raw2.distinct, raw2);
                eventList2 = distinct2('eventName', {"tournamentId":xId});

                totEventList = eventList1.concat(eventList2);
                for(var i =0; i<totEventList.length;i++)
                {
                    var eventName = totEventList[i];
                    var playerTournEntry = PlayerPoints.find({
                        'sportId':sportID,
                        "organizerId":eventOrganizer,"eventName":eventName,
                        "eventPoints.tournamentId":tournamentId}).fetch();

                    if(playerTournEntry.length > 0)
                    {
                        for(var l=0; l<playerTournEntry.length;l++)
                        {
                            //tournament removed
                            var playerId = playerTournEntry[l].playerId;
                            var removeTournEntry = PlayerPoints.update(
                                {"playerId":playerId,'sportId':sportID,
                                "organizerId":eventOrganizer,"eventName":eventName},
                                {$pull:{"eventPoints":{"tournamentId":tournamentId}}});
                        
                            //re compute totalpoints of event
                            var totalInfo = PlayerPoints.findOne(
                                {"playerId":playerId,'sportId':sportID,
                                "organizerId":eventOrganizer,"eventName":eventName},
                                {fields:{"eventPoints.tournamentPoints":1,"_id":0}})

                            if(totalInfo)
                            {
                                var tourPointsList = totalInfo.eventPoints;
                                var total="0";
                                for(var x=0; x<tourPointsList.length; x++)
                                {
                                    total = parseInt(total)+parseInt(tourPointsList[x].tournamentPoints);
                                }
                                var totalPointsUpdate = PlayerPoints.update(
                                    {"playerId":playerId,'sportId':sportID,
                                    "organizerId":eventOrganizer,"eventName":eventName},
                                    {$set:{"totalPoints":total}});

                            }
                        }
                    }
                }


                var ind_Draws = MatchCollectionDB.remove({ 
                    tournamentId: tournamentId
                }); 

                var indConfig_Draws = MatchCollectionConfig.remove({
                    tournamentId: tournamentId
                }); 


                var team_Draws = teamMatchCollectionDB.remove({
                    tournamentId: tournamentId,
                });


                var teamConfig_Draws = MatchTeamCollectionConfig.remove({
                    tournamentId: tournamentId,
                    eventName: eventName
                })


                var individualRR_Draws = roundRobinEvents.remove({
                   tournamentId: tournamentId
                });

 
                var teamRR_Draws = roundRobinTeamEvents.remove({
                   tournamentId: tournamentId
                });


                var teamRR_DrawsSpec = teamRRSpecification.remove({
                   tournamentId: tournamentId
                });


                var teamRR_DrawsDetScore = teamRRDetailScore.remove({
                   tournamentId: tournamentId
                });

                var rr_teamConfig = roundRobinTeamConfig.remove({
                    "tournamentId": tournamentId    
                })

                var rr_matchScore = roundRobinMatchScore.remove({
                    "tournamentId": tournamentId    
                })

                var dob_filter = dobFilterSubscribe.remove({
                    "tournamentId": tournamentId    
                })

                var liveScoresRes = liveScores.remove({
                    "tournamentId": tournamentId    
                })

                var financialRes = financials.remove({
                    "tournamentId": tournamentId    
                })

                var lS = events.remove({
                    "_id": xId
                }); //remove the event from events collection
                var lS2 = events.remove({
                    "tournamentId": xId
                });
                var lS3 = liveUpdates.remove({
                    "tournamentId": xId
                });
                var lS4 = scrollableevents.remove({
                    "_id": xId
                })
                var ls5 = eventFeeSettings.remove({
                    "tournamentId": xId
                });
                var ls6 = playerEntries.remove({
                    "tournamentId": xId
                });
                var ls7 = academyEntries.remove({
                    "tournamentId": xId
                });
                var ls8 = districtAssociationEntries.remove({
                    "tournamentId": xId
                });
                var ls8 = subscriptionRestrictions.remove({
                    "tournamentId": xId
                });
                var ls9 = myUpcomingEvents.remove({
                    "tournamentId": xId
                });
                var ls10 = myPastEvents.remove({
                    "tournamentId": xId
                });

                var ls11 = playerTeamEntries.remove({
                    "tournamentId": xId
                });
                var ls12 = calenderEvents.remove({
                    "_id": xId
                })
                var payDel = paymentTransaction.remove({
                    "tournamentId": xId

                })
                var sched = tournamentSchedule.remove({
                    "tournamentId" :xId
                })
                var sched = tournamentScheduleTableNos.remove({
                    "tournamentId" :xId
                })
                
               // var schDel = playerCategory
                var schDel2 = schoolPlayerEntries.remove({
                    "tournamentId" :xId
                })

                var schDel3 = schoolPlayerTeamEntries.remove({
                    "tournamentId" :xId
                })

                if (lS) 
                    return true;
                else
                    return false;
                
            }
            
        }catch(e){
            return e
        }
    }
})