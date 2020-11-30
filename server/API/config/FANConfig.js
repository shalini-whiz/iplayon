import {
    Meteor
}
from 'meteor/meteor';
import {
    response
}
from './api.js';

API.methods["getLatestResultsForFanApp"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if (connection.data.data) {
                    if (typeof connection.data.data == "string") {
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }
                Meteor.call("PgetLatestResultsForFanApp", caller, apiKey, data, function(e, r) {
                    if (r) {
                        response(context, 200, r);
                    } else {
                        response(context, 200, {
                            message: "Invalid data"
                        });
                    }
                });
            } else {
                response(context, 404, {
                    error: 404,
                    message: "Invalid data"
                });
            }
        } catch (e) {}
    }
}

API.methods["getListOfTournamentsForState"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if (connection.data.data) {
                    if (typeof connection.data.data == "string") {
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }
                Meteor.call("PgetListOfTournamentsForState", caller, apiKey, data, function(e, r) {
                    if (r) {
                        response(context, 200, r);
                    } else {
                        response(context, 200, {
                            message: "Invalid data"
                        });
                    }
                });
            } else {
                response(context, 404, {
                    error: 404,
                    message: "Invalid data"
                });
            }
        } catch (e) {}
    }
}

API.methods["getListOfTournamentsForStateAndPlayer"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if (connection.data.data) {
                    if (typeof connection.data.data == "string") {
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }
                Meteor.call("PgetListOfTournamentsForStateAndPlayer", caller, apiKey, data, function(e, r) {
                    if (r) {
                        response(context, 200, r);
                    } else {
                        response(context, 200, {
                            message: "Invalid data"
                        });
                    }
                });
            } else {
                response(context, 404, {
                    error: 404,
                    message: "Invalid data"
                });
            }
        } catch (e) {}
    }
}

API.methods["getHeadsOnDetailsOfPlayerOfATournament"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if (connection.data.data) {
                    if (typeof connection.data.data == "string") {
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }
                Meteor.call("PgetHeadsOnDetailsOfPlayerOfATournament", caller, apiKey, data, function(e, r) {
                    if (r) {
                        response(context, 200, r);
                    } else {
                        response(context, 200, {
                            message: "Invalid data"
                        });
                    }
                });
            } else {
                response(context, 404, {
                    error: 404,
                    message: "Invalid data"
                });
            }
        } catch (e) {}
    }
}


API.methods["getMatchRecordsforEventAndRound"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if (connection.data.data) {
                    if (typeof connection.data.data == "string") {
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }
                Meteor.call("PgetMatchRecordsforEventAndRound", caller, apiKey, data, function(e, r) {
                    if (r) {
                        response(context, 200, r);
                    } else {
                        response(context, 200, {
                            message: "Invalid data"
                        });
                    }
                });
            } else {
                response(context, 404, {
                    error: 404,
                    message: "Invalid data"
                });
            }
        } catch (e) {}
    }
}

API.methods["getLatestResultsForTournamentId"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if (connection.data.data) {
                    if (typeof connection.data.data == "string") {
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }

                Meteor.call("PgetLatestResultsForTournamentId", caller, apiKey, data, function(e, r) {
                    if (r) {
                        response(context, 200, r);
                    } else {
                        response(context, 200, {
                            message: "Invalid data"
                        });
                    }
                });
            } else {
                response(context, 404, {
                    error: 404,
                    message: "Invalid data"
                });
            }
        } catch (e) {}
    }
}

API.methods["getTeamDetailedDrawsForOtherFormats"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if (connection.data.data) {
                    if (typeof connection.data.data == "string") {
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }

                Meteor.call("PgetTeamDetailedDrawsForOtherFormats", caller, apiKey, data, function(e, r) {
                    if (r) {
                        response(context, 200, r);
                    } else {
                        response(context, 200, {
                            message: "Invalid data"
                        });
                    }
                });
            } else {
                response(context, 404, {
                    error: 404,
                    message: "Invalid data"
                });
            }
        } catch (e) {}
    }
}

API.methods["getPlayerDetailsForFanAPP"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if (connection.data.data) {
                    if (typeof connection.data.data == "string") {
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }

                Meteor.call("PgetPlayerDetailsForFanAPP", caller, apiKey, data, function(e, r) {
                    if (r) {
                        response(context, 200, r);
                    } else {
                        response(context, 200, {
                            message: "Invalid data"
                        });
                    }
                });
            } else {
                response(context, 404, {
                    error: 404,
                    message: "Invalid data"
                });
            }
        } catch (e) {}
    }
}

API.methods["getLiveScores11Even"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if (connection.data.data) {
                    if (typeof connection.data.data == "string") {
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }

                Meteor.call("PgetLiveScores11Even", caller, apiKey, data, function(e, r) {
                    if (r) {
                        response(context, 200, r);
                    } else {
                        response(context, 200, {
                            message: "Invalid data"
                        });
                    }
                });
            } else {
                response(context, 404, {
                    error: 404,
                    message: "Invalid data"
                });
            }
        } catch (e) {}
    }
}
API.methods["getStateListByYearNEW"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if (connection.data.data) {
                    if (typeof connection.data.data == "string") {
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }

                Meteor.call("PgetStateListByYearNEW", caller, apiKey, data, function(e, r) {
                    if (r) {
                        response(context, 200, r);
                    } else {
                        response(context, 200, {
                            message: "Invalid data"
                        });
                    }
                });
            } else {
                response(context, 404, {
                    error: 404,
                    message: "Invalid data"
                });
            }
        } catch (e) {}
    }
}


API.methods["getStateListByYear"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if (connection.data.data) {
                    if (typeof connection.data.data == "string") {
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }

                Meteor.call("PgetStateListByYear", caller, apiKey, data, function(e, r) {
                    if (r) {
                        response(context, 200, r);
                    } else {
                        response(context, 200, {
                            message: "Invalid data"
                        });
                    }
                });
            } else {
                response(context, 404, {
                    error: 404,
                    message: "Invalid data"
                });
            }
        } catch (e) {}
    }
}

API.methods["getLiveLinksOfTournament"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if (connection.data.data) {
                    if (typeof connection.data.data == "string") {
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }

                Meteor.call("PgetLiveLinksOfTournament", caller, apiKey, data, function(e, r) {
                    if (r) {
                        response(context, 200, r);
                    } else {
                        response(context, 200, {
                            message: "Invalid data"
                        });
                    }
                });
            } else {
                response(context, 404, {
                    error: 404,
                    message: "Invalid data"
                });
            }
        } catch (e) {}
    }
}



API.methods["fetchStateEvents"] = {
      POST: function(context, connection){
        try{
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata)
            {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if(connection.data.data){
                    if(typeof connection.data.data == "string"){
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }

                Meteor.call("PfetchStateEvents",caller,apiKey,data,function(e,r){
                  if(r){
                    response(context, 200, r);                           
                  }                         
                  else{
                    response(context, 200, {message: "Invalid data"});
                  }
                });
              }
            else{
                response(context, 404, {error: 404,message: "Invalid data"});
            }
        }catch(e){
        }
      }
}

API.methods["fetchStateWinners"] = {
      POST: function(context, connection){
        try{
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata)
            {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if(connection.data.data){
                    if(typeof connection.data.data == "string"){
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }

                Meteor.call("PfetchStateWinners",caller,apiKey,data,function(e,r){
                  if(r){
                    response(context, 200, r);                           
                  }                         
                  else{
                    response(context, 200, {message: "Invalid data"});
                  }
                });
              }
            else{
                response(context, 404, {error: 404,message: "Invalid data"});
            }
        }catch(e){
        }
      }
}

API.methods["getStateListByYearRoundRobin"] = {
    POST: function(context, connection) {
        try {
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if (connection.data.data) {
                    if (typeof connection.data.data == "string") {
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }

                Meteor.call("PgetStateListByYearRoundRobin", caller, apiKey, data, function(e, r) {
                    if (r) {
                        response(context, 200, r);
                    } else {
                        response(context, 200, {
                            message: "Invalid data"
                        });
                    }
                });
            } else {
                response(context, 404, {
                    error: 404,
                    message: "Invalid data"
                });
            }
        } catch (e) {}
    }
}

API.methods["fetchRRDrawEvents"] = {
      POST: function(context, connection){
        try{
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata)
            {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if(connection.data.data){
                    if(typeof connection.data.data == "string"){
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }

                Meteor.call("PfetchRRDrawEvents",caller,apiKey,data,function(e,r){
                  if(r){
                    response(context, 200, r);                           
                  }                         
                  else{
                    response(context, 200, {message: "Invalid data"});
                  }
                });
              }
            else{
                response(context, 404, {error: 404,message: "Invalid data"});
            }
        }catch(e){
        }
      }
}


API.methods["getListOf11SportsTourTypes"] = {
      POST: function(context, connection){
        try{
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata)
            {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if(connection.data.data){
                    if(typeof connection.data.data == "string"){
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }

                Meteor.call("PgetListOf11SportsTourTypes",caller,apiKey,data,function(e,r){
                  if(r){
                    response(context, 200, r);                           
                  }                         
                  else{
                    response(context, 200, {message: "Invalid data"});
                  }
                });
              }
            else{
                response(context, 404, {error: 404,message: "Invalid data"});
            }
        }catch(e){
        }
      }
}

API.methods["getListOf11SportsTourTypes2"] = {
      POST: function(context, connection){
        try{
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata)
            {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if(connection.data.data){
                    if(typeof connection.data.data == "string"){
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }


                Meteor.call("PgetEventListOfNationalKO",caller,apiKey,data,function(e,r){
                  
                  if(r){
                    response(context, 200, r);                           
                  }                         
                  else{
                    response(context, 200, {message: "No draws yet, await for results!!"});
                  }
                });
              }
            else{
                response(context, 404, {error: 404,message: "Invalid data"});
            }
        }catch(e){
        }
      }
}

API.methods["getEventListOfNationalRR"] = {
      POST: function(context, connection){
        try{
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata)
            {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data

                if(connection.data.data){
                    if(typeof connection.data.data == "string"){
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }

                Meteor.call("PgetEventListOfNationalRR",caller,apiKey,data,function(e,r){
                  if(r){
                    response(context, 200, r);                           
                  }                         
                  else{
                    response(context, 200, {message: "Invalid data"});
                  }
                });
              }
            else{
                response(context, 404, {error: 404,message: "Invalid data"});
            }
        }catch(e){
        }
      }
}

API.methods["getRRWithEvents"] = {
      POST: function(context, connection){
        try{
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata)
            {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data
                if(connection.data.data){
                    if(typeof connection.data.data == "string"){
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }
                
                Meteor.call("PgetRRWithEvents",caller,apiKey,data,function(e,r){
                  if(r){
                    response(context, 200, r);                           
                  }                         
                  else{
                    response(context, 200, {message: "Invalid data"});
                  }
                });
              }
            else{
                response(context, 404, {error: 404,message: "Invalid data"});
            }
        }catch(e){
        }
      }
}


API.methods["getDetailsOfCountryOrganizers"] = {
    POST: function(context, connection){
        try{
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata) 
            {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var userId = connection.data.data;  
                var data = {}
                if(connection.data.data){
                    if(typeof connection.data.data == "string"){
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }else{
                        data = connection.data.data
                    }
                }
                Meteor.call("PgetDetailsOfCountryOrganizers",caller,apiKey,data,function(e,r){
                  if(r){
                    response(context, 200, r);                            
                  }                          
                  else{
                    response(context, 200, {message: "Invalid data"});
                  }
                });
              } 
            else{
                response(context, 404, {error: 404,message: "Invalid data"});
            }
        }catch(e){
        }
    } 
}

API.methods["getLiveScores11Even"] = {
      POST: function(context, connection){
        try{
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata)
            {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data
                if(connection.data.data){
                    if(typeof connection.data.data == "string"){
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }
                
                Meteor.call("PgetLiveScores11Even",caller,apiKey,data,function(e,r){
                  if(r){
                    response(context, 200, r);                           
                  }                         
                  else{
                    response(context, 200, {message: "Invalid data"});
                  }
                });
              }
            else{
                response(context, 404, {error: 404,message: "Invalid data"});
            }
        }catch(e){
        }
      }
}

API.methods["getTeamDetailedDrawsLive"] = {
      POST: function(context, connection){
        try{
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata)
            {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data
                if(connection.data.data){
                    if(typeof connection.data.data == "string"){
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }
                
                Meteor.call("PgetTeamDetailedDrawsLive",caller,apiKey,data,function(e,r){
                  if(r){
                    response(context, 200, r);                           
                  }                         
                  else{
                    response(context, 200, {message: "Invalid data"});
                  }
                });
              }
            else{
                response(context, 404, {error: 404,message: "Invalid data"});
            }
        }catch(e){
        }
      }
}

//liveTourSubscription


API.methods["liveTourSubscription"] = {
      POST: function(context, connection){
        try{
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata)
            {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data
                if(connection.data.data){
                    if(typeof connection.data.data == "string"){
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }
                
                Meteor.call("PliveTourSubscription",caller,apiKey,data,function(e,r){
                  if(r){
                    response(context, 200, r);                           
                  }                         
                  else{
                    response(context, 200, {message: "Invalid data"});
                  }
                });
              }
            else{
                response(context, 404, {error: 404,message: "Invalid data"});
            }
        }catch(e){
        }
      }
}





API.methods["seedingPlayers"] = {
      POST: function(context, connection){
        try{
            var hasdata = (connection && connection.data) ? true : false;
            if (hasdata)
            {
                var caller = connection.data.caller;
                var apiKey = connection.data.apiKey;
                var data = connection.data.data
                if(connection.data.data){
                    if(typeof connection.data.data == "string"){
                        data = connection.data.data.replace("\\", "");
                        data = JSON.parse(data);
                    }
                }
                
                Meteor.call("PseedingPlayers",caller,apiKey,data,function(e,r){
                  if(r){
                    response(context, 200, r);                           
                  }                         
                  else{
                    response(context, 200, {message: "Invalid data"});
                  }
                });
              }
            else{
                response(context, 404, {error: 404,message: "Invalid data"});
            }
        }catch(e){
        }
      }
}
