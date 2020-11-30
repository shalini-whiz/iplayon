/**
 * @PublicationName users 
 * to publish the list of users from collection users
 * @CollectionName domains
 */

Meteor.publish('users', function() {
  var lData = Meteor.users.find();

  if (lData) {
    return lData;
  }
  return this.ready();
});

Meteor.publish('PlayerPoints', function() {
  
  var lData = PlayerPoints.find({});
  if (lData) {
    return lData;
  }
  return this.ready();
});
Meteor.publish('PlayerPointsUnderTourn', function(tournamentId) {
  var lData = PlayerPoints.find({"eventPoints.tournamentId":tournamentId});
  if (lData) {

    return lData;
  }
  return this.ready();
});

Meteor.publish('PlayerPointsUnderExtTourn', function(tournamentId) {
  var lData = PlayerPoints.find({"eventPoints.tournamentId":"0"});
  if (lData) {
    return lData;
  }
  return this.ready();
});


Meteor.publish('apiUsers', function() {
  var lData = apiUsers.find();
  var sdf = apiUsers.find({}).fetch();
  if (lData) {
    return lData;
  }
  return this.ready();
});

Meteor.publish('testUsers', function() {
  var lData = Meteor.users.find();
  if (lData) {
    return lData;
  }
  return this.ready();
});

// server/publications.js
Meteor.publish("usersCount", function (limit) {
  var lData = Meteor.users.find({},{limit:limit});
    if (lData) {
    return lData;
  }
  return this.ready();
});

Meteor.publish("onlyLoggedIn", function () {
  var lData = Meteor.users.find({"_id":this.userId});
    if (lData) {
    return lData;
  }
  return this.ready();
});

Meteor.publish("coachUsers",function(){
    var lData = otherUsers.find({"role":"Coach"});
    if (lData) {
    return lData;
  }
  return this.ready();
})

Meteor.publish("loginBasedProfile", function () {
  var userInfo = Meteor.users.findOne({"_id":this.userId});
    if (userInfo) 
    {
      if(userInfo.role == "Coach")
      {
        var lData = otherUsers.find({"userId":this.userId});
        if (lData) {
        return lData;
        }
      }
    }
  return this.ready();
});




 Meteor.publish('checkForApiAccess', function() {
  var lData = apiUsers.find({"userId" : this.userId});
  if (lData) {
    return lData;
  }
  return this.ready();
});

Meteor.publish("eventOrganizerUser",function(para){
  var Organizer = events.findOne({"_id":para})
  if(Organizer)
  var lData = Meteor.users.find({"_id":Organizer.eventOrganizer});
    if (lData) {
    return lData;
  }
  return this.ready();
});



//back up
/*try {
            var loggedIn = Meteor.users.findOne({"_id":Meteor.userId()})
            if (loggedIn.userId) {
                var players, lplayers=[];
                if (loggedIn.role &&loggedIn.role == "Academy")
                    players = Meteor.users.find({
                        "clubNameId":loggedIn.userId
                    }).fetch();
                else if (loggedIn.role && (Meteor.user().role == "Association") && loggedIn.associationType == "State/Province/County") {
                    players = Meteor.users.find({"role": "Player",$or:[{
                        "associationId":loggedIn.userId},
                        {"parentAssociationId": loggedIn.userId,
                        }],
                    }).fetch();
                    lplayers = Meteor.users.find({
                        "parentAssociationId": Meteor.user().userId,
                        "role": "Player"
                    }).fetch()
                } else if (loggedIn.role && (loggedIn.role == "Association") && Meteor.user().associationType == "District/City") {
                    players = Meteor.users.find({
                        "associationId": loggedIn.userId,
                        "role": "Player"
                    }).fetch();
                }
                var details = [];
                var lEvents = events.findOne({
                    "_id": Router.current().params._PostId
                });
                if (players) {
                    //for each player 
                    for (var i = 0; i < players.length; i++) {
                        k = i;
                        var data = {
                            "slNo":parseInt(i + 1),
                            userName: players[i].userName,
                            emailAddress: players[i].emailAddress,
                            phoneNumber: players[i].phoneNumber,
                            clubName: players[i].clubName,
                            affiliationId: players[i].affiliationId,
                            guardianName: players[i].guardianName,
                            dateOfB: players[i].dateOfBirth,
                            address: players[i].address,
                            userId: players[i].userId,
                            gender:players[i].gender
                        }

                        details.push(data);
                    }
                    if (lplayers) {
                        for (var j = 0; j < lplayers.length; j++) {
                            k = i;
                            var data = {
                                "slNo": parseInt(k + j + 1),
                                userName: lplayers[j].userName,
                                emailAddress: lplayers[j].emailAddress,
                                phoneNumber: lplayers[j].phoneNumber,
                                clubName: lplayers[j].clubName,
                                affiliationId: lplayers[j].affiliationId,
                                guardianName: lplayers[j].guardianName,
                                dateOfB: lplayers[j].dateOfBirth,
                                address: lplayers[j].address,
                                userId: lplayers[j].userId,
                                gender:lplayers[j].gender
                            }

                            details.push(data);
                        }
                    }
                }
                return details
            }
        } catch (e) {
        }
        */

/***************************statistics related *********************/

Meteor.publish("onlyLoggedIn_stat", function (limit) {
  var lData = Meteor.users.find({"_id":this.userId});
    if (lData) {

    return lData;
  }
  return this.ready();
});
//
Meteor.publish("loginCheck_Players",function(limit){
  var lData = Meteor.users.find({"_id":this.userId,"role":{$nin:["Player"]}});
    if (lData) {

    return lData;
  }
  return this.ready();
});

Meteor.publish('playersList_stat', function(skipCount) {


  var positiveIntegerCheck = Match.Where(function(x) {
    check(x, Match.Integer);
    return x >= 0;
  });

  check(skipCount, positiveIntegerCheck);
  var loggedIn = Meteor.users.findOne({"_id":this.userId});
  var players;
  if (loggedIn&&loggedIn.userId) {

 if (loggedIn.role &&loggedIn.role == "Player")
 {
  if(loggedIn.associationId || loggedIn.parentAssociationId)
  {
    if(loggedIn.interestedProjectName && loggedIn.interestedProjectName.length > 0)
    {
       Counts.publish(this, 'playersCount', Meteor.users.find({
          "role":"Player",
          "interestedProjectName":{$in:[loggedIn.interestedProjectName[0]]},
          $or:[{
        "associationId":loggedIn.associationId},
        {"parentAssociationId": loggedIn.associationId,
        }]
      }), { 
        noReady: true
      });
      players = Meteor.users.find({
          "role":"Player",
          "interestedProjectName":{$in:[loggedIn.interestedProjectName[0]]},
          $or:[{
        "associationId":loggedIn.associationId},
        {"parentAssociationId": loggedIn.associationId,
        }],
      },{
      limit: 10, // records to show per page
      skip: skipCount
      });
    }
   
  }
  else
  {
    /*if(loggedIn.interestedProjectName && loggedIn.interestedDomainName)
    {

       Counts.publish(this, 'playersCount', Meteor.users.find({
        "interestedProjectName":{$in:[loggedIn.interestedProjectName[0]]},
        "interestedDomainName":{$in:[loggedIn.interestedDomainName[0]]},
        "role": "Player"
      }), { 
        noReady: true
      });
      players = Meteor.users.find({        
        "interestedProjectName":{$in:[loggedIn.interestedProjectName[0]]},
        "role": "Player",
        "interestedDomainName":{$in:[loggedIn.interestedDomainName[0]]},
      },{
      limit: 10,
      skip: skipCount
      });
    }*/
    
  }
      
    }



    else if (loggedIn.role &&loggedIn.role == "Academy"){
      if(loggedIn.interestedProjectName)
      {
        Counts.publish(this, 'playersCount', Meteor.users.find({
          "role":"Player",
          "clubNameId":loggedIn.userId,
          "interestedProjectName":{$in:[loggedIn.interestedProjectName[0]]}
            
          }), { 
          noReady: true
        });

        players = Meteor.users.find({
            "role":"Player",
            "clubNameId":loggedIn.userId,
            "interestedProjectName":{$in:[loggedIn.interestedProjectName[0]]}
        },{
        limit: 10, // records to show per page
        skip: skipCount
        });
      }
      else
      {
        Counts.publish(this, 'playersCount', Meteor.users.find({
          "role":"Player",
          "clubNameId":loggedIn.userId    
          }), { 
          noReady: true
        });

        players = Meteor.users.find({
            "role":"Player",
            "clubNameId":loggedIn.userId
        },{
        limit: 10, // records to show per page
        skip: skipCount
        });


        /*if(loggedIn.interestedProjectName && loggedIn.interestedDomainName)
        {

           Counts.publish(this, 'playersCount', Meteor.users.find({
            "interestedProjectName":{$in:[loggedIn.interestedProjectName[0]]},
            "interestedDomainName":{$in:[loggedIn.interestedDomainName[0]]},
            "role": "Player"
          }), { 
            noReady: true
          });
          players = Meteor.users.find({        
            "interestedProjectName":{$in:[loggedIn.interestedProjectName[0]]},
            "role": "Player",
            "interestedDomainName":{$in:[loggedIn.interestedDomainName[0]]},
          },{
          limit: 10,
          skip: skipCount
          });
        }*/

      }
      
    }
    else if (loggedIn.role && (loggedIn.role == "Association") && loggedIn.associationType == "State/Province/County") {

      if(loggedIn.interestedProjectName)
      {
        Counts.publish(this, 'playersCount', Meteor.users.find({
          "role": "Player",
          "interestedProjectName":{$in:[loggedIn.interestedProjectName[0]]},
          $or:[{
          "associationId":loggedIn.userId},
          {"parentAssociationId": loggedIn.userId,
          }],
        }), { 
          noReady: true
        });
        players = Meteor.users.find({"role": "Player",
          "interestedProjectName":{$in:[loggedIn.interestedProjectName[0]]},
          $or:[{
          "associationId":loggedIn.userId},
          {"parentAssociationId": loggedIn.userId,
          }],
        },{
        limit: 10, // records to show per page
        skip: skipCount
        });
      }
    }
    else if (loggedIn.role && (loggedIn.role == "Association") && loggedIn.associationType == "District/City") {
      
      if(loggedIn.interestedProjectName)
      {
        Counts.publish(this, 'playersCount', Meteor.users.find({
          "role":"Player",
          "interestedProjectName":{$in:[loggedIn.interestedProjectName[0]]},
          "associationId": loggedIn.userId,
        }), { 
          noReady: true
        });
        players = Meteor.users.find({
          "role": "Player",
          "interestedProjectName":{$in:[loggedIn.interestedProjectName[0]]},
          "associationId": loggedIn.userId,
        },{
      
        limit: 10, // records to show per page
        skip: skipCount
        });
      }
    }
  }
  return players
});

Meteor.publish('getpendingusers', function(skipCount) {
  var loggedIn = Meteor.users.findOne({"_id":this.userId});
  var players;
  if (loggedIn&&loggedIn.userId) {
    if (loggedIn.role && (loggedIn.role == "Association") && loggedIn.associationType == "State/Province/County") {
      Counts.publish(this, 'playersCount', Meteor.users.find({
        "role": "Player",$or:[{
        "associationId":loggedIn.userId},
        {"parentAssociationId": loggedIn.userId,
        }],
        $and:[{
            $or:[{
              $and:[
                {$or:[{"affiliationId":null},
                {"affiliationId":undefined},
                {"affiliationId":""},
                {"affiliationId":"other"}]},{"statusOfUser":"Active"}
              ]},
              {$and:[
                {"affiliationId":{$nin:[null,"","other",undefined]}},
                {"statusOfUser":"notApproved"}
              ]}
            ]
        }],
      }), { 
        noReady: true
      });
      players = Meteor.users.find({"role": "Player",$or:[{
        "associationId":loggedIn.userId},
        {"parentAssociationId": loggedIn.userId,
        }],
        $and:[{
            $or:[{
              $and:[
                {$or:[{"affiliationId":null},
                {"affiliationId":undefined},
                {"affiliationId":""},
                {"affiliationId":"other"}]},{"statusOfUser":"Active"}
              ]},
              {$and:[
                {"affiliationId":{$nin:[null,"","other",undefined]}},
                {"statusOfUser":"notApproved"}
              ]}
            ]
        }],          
      },{
      limit: 10, // records to show per page
      skip: skipCount
      });
    }
  }
  return players
})


Meteor.publish('getapprovedusers', function(skipCount) {
  var loggedIn = Meteor.users.findOne({"_id":this.userId});
  var players;
  if (loggedIn&&loggedIn.userId) {
    if (loggedIn.role && (loggedIn.role == "Association") && loggedIn.associationType == "State/Province/County") {
      Counts.publish(this, 'playersCount', Meteor.users.find({
        "role": "Player",$or:[{
        "associationId":loggedIn.userId},
        {"parentAssociationId": loggedIn.userId,
        }],
        $and:[{$or:[
              {"affiliationId":{$nin:[null,"","other",undefined]}}
            ]},{"statusOfUser":"Active"}] 
      }), { 
        noReady: true
      });
      players = Meteor.users.find({"role": "Player",$or:[{
        "associationId":loggedIn.userId},
        {"parentAssociationId": loggedIn.userId,
        }],
        $and:[{$or:[
              {"affiliationId":{$nin:[null,"","other",undefined]}}
            ]},{"statusOfUser":"Active"}]         
      },{
      limit: 10, // records to show per page
      skip: skipCount
      });
    }
  }
  return players
})

/*
Meteor.publish('playerNameSearch', function(skipCount,value) {
  var positiveIntegerCheck = Match.Where(function(x) {
    check(x, Match.Integer);
    return x >= 0;
  });

  check(skipCount, positiveIntegerCheck);
  var loggedIn = Meteor.users.findOne({"_id":this.userId});
  var players;
  var reObj = new RegExp(value, 'i');
  if (loggedIn&&loggedIn.userId) {

if (loggedIn.role &&loggedIn.role == "Player"){
  if(loggedIn.associationId || loggedIn.parentAssociationId)
  {
    Counts.publish(this, 'playersCount', Meteor.users.find({
          "role":"Player",
          userName: {$regex:reObj},
          $or:[{
        "associationId":loggedIn.associationId},
        {"parentAssociationId": loggedIn.associationId,
        }]
      }), { 
        noReady: true
      });
      players = Meteor.users.find({
          "role":"Player",
          userName: {$regex:reObj},
          $or:[{
        "associationId":loggedIn.associationId},
        {"parentAssociationId": loggedIn.associationId,
        }],
      },{
      limit: 10, 
      skip: skipCount
      });


  }
      

    }





    if (loggedIn.role &&loggedIn.role == "Academy"){
      Counts.publish(this, 'playersCount', Meteor.users.find({
          "role":"Player",
          "clubNameId":loggedIn.userId,
          userName: {$regex:reObj}
      }), { 
        noReady: true
      });
      players = Meteor.users.find({
          "role":"Player",
          "clubNameId":loggedIn.userId,
          userName: {$regex:reObj}
      },{
      limit: 10, 
      skip: skipCount
      });
    }
    else if (loggedIn.role && (loggedIn.role == "Association") && loggedIn.associationType == "State/Province/County") {
      Counts.publish(this, 'playersCount', Meteor.users.find({
        "role": "Player",
        userName: {$regex:reObj},
        $or:[{
        "associationId":loggedIn.userId},
        {"parentAssociationId": loggedIn.userId,
        }],
      }), { 
        noReady: true
      });
      players = Meteor.users.find({"role": "Player",
        userName: {$regex:reObj},
        $or:[{
        "associationId":loggedIn.userId},
        {"parentAssociationId": loggedIn.userId,
        }],
      },{
      limit: 10, 
      skip: skipCount
      });
    }
    else if (loggedIn.role && (loggedIn.role == "Association") && loggedIn.associationType == "District/City") {
      Counts.publish(this, 'playersCount', Meteor.users.find({
        "role":"Player",
        userName: {$regex:reObj},
        "associationId": loggedIn.userId,
      }), { 
        noReady: true
      });
      players = Meteor.users.find({
        "role": "Player",
        userName: {$regex:reObj},
        "associationId": loggedIn.userId,
      },{
    
      limit: 10, 
      skip: skipCount
      });
    }
  }
  return players
});*/

Meteor.publish("itemsUSers", function(criteria,skipCount) {

   var self = this;
   var players =  Meteor.users.find({});

 
    
  if (criteria) {
    return players;

  } else {
    this.onStop(function() {
      if(players)
      {
        players = "";
        //players.fetch().stop();


      }
      
    });


    //***//
    var positiveIntegerCheck = Match.Where(function(x) {
    check(x, Match.Integer);
    return x >= 0;
  });

  check(skipCount, positiveIntegerCheck);
  var loggedIn = Meteor.users.findOne({"_id":this.userId});
  if (loggedIn&&loggedIn.userId) {
    if (loggedIn.role &&loggedIn.role == "Academy"){
      Counts.publish(this, 'playersCount', Meteor.users.find({
          "role":"Player",
          "clubNameId":loggedIn.userId
      }), { 
        noReady: true
      });
      players = Meteor.users.find({
          "role":"Player",
          "clubNameId":loggedIn.userId,
      },{
      limit: 10, // records to show per page
      skip: skipCount
      });
    }
    else if (loggedIn.role && (loggedIn.role == "Association") && loggedIn.associationType == "State/Province/County") {
      Counts.publish(this, 'playersCount', Meteor.users.find({
        "role": "Player",$or:[{
        "associationId":loggedIn.userId},
        {"parentAssociationId": loggedIn.userId,
        }],
      }), { 
        noReady: true
      });
      players = Meteor.users.find({"role": "Player",$or:[{
        "associationId":loggedIn.userId},
        {"parentAssociationId": loggedIn.userId,
        }],
      },{
      limit: 10, // records to show per page
      skip: skipCount
      });
    }
    else if (loggedIn.role && (loggedIn.role == "Association") && loggedIn.associationType == "District/City") {
      Counts.publish(this, 'playersCount', Meteor.users.find({
        "role":"Player",
        "associationId": loggedIn.userId,
      }), { 
        noReady: true
      });
      players = Meteor.users.find({
        "role": "Player",
        "associationId": loggedIn.userId,
      },{
    
      limit: 10, // records to show per page
      skip: skipCount
      });
    }
  }
  return players
  }
});

/*
Meteor.publish('getassociatedusers', function(skipCount,sportID,filterID,gender,approval) 
{  
  var players;
  if(gender.trim() == "" && approval.trim() == "")
  {
      Counts.publish(this, 'playersCount', Meteor.users.find({
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",$or:[{
        "associationId":filterID},
        {"parentAssociationId": filterID,
        }]
       
      }), { 
        noReady: true
      });
      players = Meteor.users.find({        
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",$or:[{
        "associationId":filterID},
        {"parentAssociationId": filterID,
        }]         
      },{
      limit: 10, 
      skip: skipCount
      });

    
  }
  else if(gender.trim() != "" && approval.trim() == "")
  {
     Counts.publish(this, 'playersCount', Meteor.users.find({
        "gender":gender,
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",$or:[{
        "associationId":filterID},
        {"parentAssociationId": filterID,
        }]
       
      }), { 
        noReady: true
      });
      players = Meteor.users.find({  
        "gender":gender,
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",$or:[{
        "associationId":filterID},
        {"parentAssociationId": filterID,
        }]         
      },{
      limit: 10, 
      skip: skipCount
      });
    
  }
  else if(gender.trim() == "" && approval.trim() != "")
  {
    if(approval.trim() == "Pending")
    {
      Counts.publish(this, 'playersCount', Meteor.users.find({
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",$or:[{
        "associationId":filterID},
        {"parentAssociationId": filterID,
        }],
         $and:[{
            $or:[{
              $and:[
                {$or:[{"affiliationId":null},
                {"affiliationId":undefined},
                {"affiliationId":""},
                {"affiliationId":"other"}]},{"statusOfUser":"Active"}
              ]},
              {$and:[
                {"affiliationId":{$nin:[null,"","other",undefined]}},
                {"statusOfUser":"notApproved"}
              ]}
            ]
        }],
       
      }), { 
        noReady: true
      });
      players = Meteor.users.find({  
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",$or:[{
        "associationId":filterID},
        {"parentAssociationId": filterID,
        }],
         $and:[{
            $or:[{
              $and:[
                {$or:[{"affiliationId":null},
                {"affiliationId":undefined},
                {"affiliationId":""},
                {"affiliationId":"other"}]},{"statusOfUser":"Active"}
              ]},
              {$and:[
                {"affiliationId":{$nin:[null,"","other",undefined]}},
                {"statusOfUser":"notApproved"}
              ]}
            ]
        }],          
      },{
      limit: 10, 
      skip: skipCount
      });
    
    }
    else if(approval.trim() == "Approved")
    {

        Counts.publish(this, 'playersCount', Meteor.users.find({
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",$or:[{
        "associationId":filterID},
        {"parentAssociationId": filterID,
        }],
       $and:[{$or:[
              {"affiliationId":{$nin:[null,"","other",undefined]}}
            ]},{"statusOfUser":"Active"}] 
       
      }), { 
        noReady: true
      });
      players = Meteor.users.find({  
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",$or:[{
        "associationId":filterID},
        {"parentAssociationId": filterID,
        }],
        $and:[{$or:[
              {"affiliationId":{$nin:[null,"","other",undefined]}}
            ]},{"statusOfUser":"Active"}]   
      },{
      limit: 10, 
      skip: skipCount
      });
    }
     
  }
   else if(gender.trim() != "" && approval.trim() != "")
  {
    if(approval.trim() == "Pending")
    {
      Counts.publish(this, 'playersCount', Meteor.users.find({
        "gender":gender,
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",$or:[{
        "associationId":filterID},
        {"parentAssociationId": filterID,
        }],
         $and:[{
            $or:[{
              $and:[
                {$or:[{"affiliationId":null},
                {"affiliationId":undefined},
                {"affiliationId":""},
                {"affiliationId":"other"}]},{"statusOfUser":"Active"}
              ]},
              {$and:[
                {"affiliationId":{$nin:[null,"","other",undefined]}},
                {"statusOfUser":"notApproved"}
              ]}
            ]
        }],
       
      }), { 
        noReady: true
      });
      players = Meteor.users.find({  
        "gender":gender,
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",$or:[{
        "associationId":filterID},
        {"parentAssociationId": filterID,
        }],
         $and:[{
            $or:[{
              $and:[
                {$or:[{"affiliationId":null},
                {"affiliationId":undefined},
                {"affiliationId":""},
                {"affiliationId":"other"}]},{"statusOfUser":"Active"}
              ]},
              {$and:[
                {"affiliationId":{$nin:[null,"","other",undefined]}},
                {"statusOfUser":"notApproved"}
              ]}
            ]
        }],          
      },{
      limit: 10, 
      skip: skipCount
      });
    }
    else if(approval.trim() == "Approved")
    {
       Counts.publish(this, 'playersCount', Meteor.users.find({
        "gender":gender,
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",$or:[{
        "associationId":filterID},
        {"parentAssociationId": filterID,
        }],
       $and:[{$or:[
              {"affiliationId":{$nin:[null,"","other",undefined]}}
            ]},{"statusOfUser":"Active"}] 
       
      }), { 
        noReady: true
      });
      players = Meteor.users.find({  
        "gender":gender,
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",$or:[{
        "associationId":filterID},
        {"parentAssociationId": filterID,
        }],
      $and:[{$or:[
              {"affiliationId":{$nin:[null,"","other",undefined]}}
            ]},{"statusOfUser":"Active"}]           
      },{
      limit: 10, 
      skip: skipCount
      });
    }
     
    
  }

  return players
})*/


/*Meteor.publish('getacademyusers', function(skipCount,sportID,filterID,gender,approval) 
{  
  var players;
  var test;

  if(gender.trim() =="" && approval.trim() == "")
  {
    test = Counts.publish(this, 'playersCount', Meteor.users.find({
        "interestedProjectName":{$in:[sportID]},
        "clubNameId":filterID,
        "role": "Player"
      }), { 
        noReady: true
      });
      players = Meteor.users.find({        
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",
        "clubNameId":filterID         
      },{
      limit: 10, 
      skip: skipCount
      });
    
  }
  else if(gender.trim() != "" && approval.trim() == "")
  {
     test = Counts.publish(this, 'playersCount', Meteor.users.find({
        "gender":gender,
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",
        "clubNameId":filterID,

       
      }), { 
        noReady: true
      });
      players = Meteor.users.find({  
        "gender":gender,
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",
        "clubNameId":filterID,
     
      },{
      limit: 10, 
      skip: skipCount
      });
    
  }
  else if(gender.trim() == "" && approval.trim() != "")
  {
if(approval.trim() == "Pending")
    {
      test = Counts.publish(this, 'playersCount', Meteor.users.find({
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",        
        "clubNameId":filterID ,        
         $and:[{
            $or:[{
              $and:[
                {$or:[{"affiliationId":null},
                {"affiliationId":undefined},
                {"affiliationId":""},
                {"affiliationId":"other"}]},{"statusOfUser":"Active"}
              ]},
              {$and:[
                {"affiliationId":{$nin:[null,"","other",undefined]}},
                {"statusOfUser":"notApproved"}
              ]}
            ]
        }],
       
      }), { 
        noReady: true
      });
      players = Meteor.users.find({  
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",
        "clubNameId":filterID,        
         $and:[{
            $or:[{
              $and:[
                {$or:[{"affiliationId":null},
                {"affiliationId":undefined},
                {"affiliationId":""},
                {"affiliationId":"other"}]},{"statusOfUser":"Active"}
              ]},
              {$and:[
                {"affiliationId":{$nin:[null,"","other",undefined]}},
                {"statusOfUser":"notApproved"}
              ]}
            ]
        }],          
      },{
      limit: 10, 
      skip: skipCount
      });
    
    }
    else if(approval.trim() == "Approved")
    {

        test = Counts.publish(this, 'playersCount', Meteor.users.find({
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",
        "clubNameId":filterID,        
       $and:[{$or:[
              {"affiliationId":{$nin:[null,"","other",undefined]}}
            ]},{"statusOfUser":"Active"}] 
       
      }), { 
        noReady: true
      });
      players = Meteor.users.find({  
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",
        "clubNameId":filterID,        
        $and:[{$or:[
              {"affiliationId":{$nin:[null,"","other",undefined]}}
            ]},{"statusOfUser":"Active"}]   
      },{
      limit: 10, 
      skip: skipCount
      });
    }
     
  }
  else if(gender.trim() != "" && approval.trim() != "")
  {
    if(approval.trim() == "Pending")
    {
      test = Counts.publish(this, 'playersCount', Meteor.users.find({
        "gender":gender,
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",        
        "clubNameId":filterID,
         $and:[{
            $or:[{
              $and:[
                {$or:[{"affiliationId":null},
                {"affiliationId":undefined},
                {"affiliationId":""},
                {"affiliationId":"other"}]},{"statusOfUser":"Active"}
              ]},
              {$and:[
                {"affiliationId":{$nin:[null,"","other",undefined]}},
                {"statusOfUser":"notApproved"}
              ]}
            ]
        }],
       
      }), { 
        noReady: true
      });
      players = Meteor.users.find({  
        "gender":gender,
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",
        "clubNameId":filterID,        
         $and:[{
            $or:[{
              $and:[
                {$or:[{"affiliationId":null},
                {"affiliationId":undefined},
                {"affiliationId":""},
                {"affiliationId":"other"}]},{"statusOfUser":"Active"}
              ]},
              {$and:[
                {"affiliationId":{$nin:[null,"","other",undefined]}},
                {"statusOfUser":"notApproved"}
              ]}
            ]
        }],          
      },{
      limit: 10, 
      skip: skipCount
      });
    }
    else if(approval.trim() == "Approved")
    {
        test = Counts.publish(this, 'playersCount', Meteor.users.find({
        "gender":gender,
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",        
        "clubNameId":filterID,        
       $and:[{$or:[
              {"affiliationId":{$nin:[null,"","other",undefined]}}
            ]},{"statusOfUser":"Active"}] 
       
      }), { 
        noReady: true
      });
      players = Meteor.users.find({  
        "gender":gender,
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",        
        "clubNameId":filterID,        
      $and:[{$or:[
              {"affiliationId":{$nin:[null,"","other",undefined]}}
            ]},{"statusOfUser":"Active"}]           
      },{
      limit: 10, 
      skip: skipCount
      });
    }
     
    
  }
      
  return players
})*/






/*Meteor.publish('getregionusers', function(skipCount,sportID,filterID,gender,approval) 
{  
  var players;

  if(gender.trim() == "" && approval.trim() == "")
  {
     Counts.publish(this, 'playersCount', Meteor.users.find({
        "interestedProjectName":{$in:[sportID]},
        "interestedDomainName":{$in:[filterID]},
        "role": "Player"
      }), { 
        noReady: true
      });
      players = Meteor.users.find({        
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",
        "interestedDomainName":{$in:[filterID]}
      },{
      limit: 10,
      skip: skipCount
      });
  }
  else if(gender.trim() != "" && approval.trim() == "")
  {
    Counts.publish(this, 'playersCount', Meteor.users.find({
        "interestedProjectName":{$in:[sportID]},
        "interestedDomainName":{$in:[filterID]},
        "role": "Player",
        "gender":gender
      }), { 
        noReady: true
      });
      players = Meteor.users.find({        
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",
        "gender":gender,
        "interestedDomainName":{$in:[filterID]}
      },{
      limit: 10, 
      skip: skipCount
      });
  }
  else if(gender.trim() == "" && approval.trim() != "")
  {
    if(approval.trim() == "Pending")
    {
      Counts.publish(this, 'playersCount', Meteor.users.find({
        "interestedProjectName":{$in:[sportID]},
        "interestedDomainName":{$in:[filterID]},
        "role": "Player",
         $and:[{
            $or:[{
              $and:[
                {$or:[{"affiliationId":null},
                {"affiliationId":undefined},
                {"affiliationId":""},
                {"affiliationId":"other"}]},{"statusOfUser":"Active"}
              ]},
              {$and:[
                {"affiliationId":{$nin:[null,"","other",undefined]}},
                {"statusOfUser":"notApproved"}
              ]}
            ]
        }],
      }), { 
        noReady: true
      });
      players = Meteor.users.find({        
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",
        "interestedDomainName":{$in:[filterID]},
           $and:[{
            $or:[{
              $and:[
                {$or:[{"affiliationId":null},
                {"affiliationId":undefined},
                {"affiliationId":""},
                {"affiliationId":"other"}]},{"statusOfUser":"Active"}
              ]},
              {$and:[
                {"affiliationId":{$nin:[null,"","other",undefined]}},
                {"statusOfUser":"notApproved"}
              ]}
            ]
        }],
      },{
      limit: 10, 
      skip: skipCount
      });
    }
    else if(approval.trim() == "Approved")
    {
      Counts.publish(this, 'playersCount', Meteor.users.find({
        "interestedProjectName":{$in:[sportID]},
        "interestedDomainName":{$in:[filterID]},
        "role": "Player",
         $and:[{$or:[
              {"affiliationId":{$nin:[null,"","other",undefined]}}
            ]},{"statusOfUser":"Active"}],
      }), { 
        noReady: true
      });
      players = Meteor.users.find({        
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",
        "interestedDomainName":{$in:[filterID]},
         $and:[{$or:[
              {"affiliationId":{$nin:[null,"","other",undefined]}}
            ]},{"statusOfUser":"Active"}],
      },{
      limit: 10, 
      skip: skipCount
      });
    }

    
  }
  else if(gender.trim() != "" && approval.trim() != "")
  {
    if(approval.trim() == "Pending")
    {
      Counts.publish(this, 'playersCount', Meteor.users.find({
        "interestedProjectName":{$in:[sportID]},
        "interestedDomainName":{$in:[filterID]},
        "role": "Player",
        "gender":gender,
         $and:[{
            $or:[{
              $and:[
                {$or:[{"affiliationId":null},
                {"affiliationId":undefined},
                {"affiliationId":""},
                {"affiliationId":"other"}]},{"statusOfUser":"Active"}
              ]},
              {$and:[
                {"affiliationId":{$nin:[null,"","other",undefined]}},
                {"statusOfUser":"notApproved"}
              ]}
            ]
        }],
      }), { 
        noReady: true
      });
      players = Meteor.users.find({        
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",
        "gender":gender,
        "interestedDomainName":{$in:[filterID]},
           $and:[{
            $or:[{
              $and:[
                {$or:[{"affiliationId":null},
                {"affiliationId":undefined},
                {"affiliationId":""},
                {"affiliationId":"other"}]},{"statusOfUser":"Active"}
              ]},
              {$and:[
                {"affiliationId":{$nin:[null,"","other",undefined]}},
                {"statusOfUser":"notApproved"}
              ]}
            ]
        }],
      },{
      limit: 10, 
      skip: skipCount
      });
    }
    else if(approval.trim() == "Approved")
    {
      Counts.publish(this, 'playersCount', Meteor.users.find({
        "interestedProjectName":{$in:[sportID]},
        "interestedDomainName":{$in:[filterID]},
        "role": "Player",
        "gender":gender,
         $and:[{$or:[
              {"affiliationId":{$nin:[null,"","other",undefined]}}
            ]},{"statusOfUser":"Active"}],
      }), { 
        noReady: true
      });
      players = Meteor.users.find({        
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",
        "gender":gender,
        "interestedDomainName":{$in:[filterID]},
         $and:[{$or:[
              {"affiliationId":{$nin:[null,"","other",undefined]}}
            ]},{"statusOfUser":"Active"}],
      },{
      limit: 10, 
      skip: skipCount
      });
    }
  }
     
    
  return players
})*/


// on search //

/*Meteor.publish('getassociatedusersOnSearch', function(skipCount,sportID,filterID,gender,approval,playerSearchValue) 
{  
  var players;
  var reObj = new RegExp(playerSearchValue, 'i');

  if(gender.trim() == "" && approval.trim() == "")
  {
      Counts.publish(this, 'playersCount', Meteor.users.find({
        "interestedProjectName":{$in:[sportID]},
        "userName": {$regex:reObj},
        "role": "Player",$or:[{
        "associationId":filterID},
        {"parentAssociationId": filterID,
        }]
       
      }), { 
        noReady: true
      });
      players = Meteor.users.find({        
        "interestedProjectName":{$in:[sportID]},
        "userName": {$regex:reObj},
        "role": "Player",$or:[{
        "associationId":filterID},
        {"parentAssociationId": filterID,
        }]         
      },{
      limit: 10, 
      skip: skipCount
      });
    
  }
  else if(gender.trim() != "" && approval.trim() == "")
  {
     Counts.publish(this, 'playersCount', Meteor.users.find({
        "gender":gender,
        "userName": {$regex:reObj},
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",$or:[{
        "associationId":filterID},
        {"parentAssociationId": filterID,
        }]
       
      }), { 
        noReady: true
      });
      players = Meteor.users.find({  
        "gender":gender,
        "userName": {$regex:reObj},
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",$or:[{
        "associationId":filterID},
        {"parentAssociationId": filterID,
        }]         
      },{
      limit: 10, 
      skip: skipCount
      });
    
  }
  else if(gender.trim() == "" && approval.trim() != "")
  {
    if(approval.trim() == "Pending")
    {
      Counts.publish(this, 'playersCount', Meteor.users.find({
        "interestedProjectName":{$in:[sportID]},
        "userName": {$regex:reObj},
        "role": "Player",$or:[{
        "associationId":filterID},
        {"parentAssociationId": filterID,
        }],
         $and:[{
            $or:[{
              $and:[
                {$or:[{"affiliationId":null},
                {"affiliationId":undefined},
                {"affiliationId":""},
                {"affiliationId":"other"}]},{"statusOfUser":"Active"}
              ]},
              {$and:[
                {"affiliationId":{$nin:[null,"","other",undefined]}},
                {"statusOfUser":"notApproved"}
              ]}
            ]
        }],
       
      }), { 
        noReady: true
      });
      players = Meteor.users.find({  
        "interestedProjectName":{$in:[sportID]},
        "userName": {$regex:reObj},
        "role": "Player",$or:[{
        "associationId":filterID},
        {"parentAssociationId": filterID,
        }],
         $and:[{
            $or:[{
              $and:[
                {$or:[{"affiliationId":null},
                {"affiliationId":undefined},
                {"affiliationId":""},
                {"affiliationId":"other"}]},{"statusOfUser":"Active"}
              ]},
              {$and:[
                {"affiliationId":{$nin:[null,"","other",undefined]}},
                {"statusOfUser":"notApproved"}
              ]}
            ]
        }],          
      },{
      limit: 10, 
      skip: skipCount
      });
    
    }
    else if(approval.trim() == "Approved")
    {

        Counts.publish(this, 'playersCount', Meteor.users.find({
        "interestedProjectName":{$in:[sportID]},
        "userName": {$regex:reObj},
        "role": "Player",$or:[{
        "associationId":filterID},
        {"parentAssociationId": filterID,
        }],
       $and:[{$or:[
              {"affiliationId":{$nin:[null,"","other",undefined]}}
            ]},{"statusOfUser":"Active"}] 
       
      }), { 
        noReady: true
      });
      players = Meteor.users.find({  
        "interestedProjectName":{$in:[sportID]},
        "userName": {$regex:reObj},
        "role": "Player",$or:[{
        "associationId":filterID},
        {"parentAssociationId": filterID,
        }],
        $and:[{$or:[
              {"affiliationId":{$nin:[null,"","other",undefined]}}
            ]},{"statusOfUser":"Active"}]   
      },{
      limit: 10, 
      skip: skipCount
      });
    }
     
  }
   else if(gender.trim() != "" && approval.trim() != "")
  {
    if(approval.trim() == "Pending")
    {
      Counts.publish(this, 'playersCount', Meteor.users.find({
        "gender":gender,"userName": {$regex:reObj},
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",$or:[{
        "associationId":filterID},
        {"parentAssociationId": filterID,
        }],
         $and:[{
            $or:[{
              $and:[
                {$or:[{"affiliationId":null},
                {"affiliationId":undefined},
                {"affiliationId":""},
                {"affiliationId":"other"}]},{"statusOfUser":"Active"}
              ]},
              {$and:[
                {"affiliationId":{$nin:[null,"","other",undefined]}},
                {"statusOfUser":"notApproved"}
              ]}
            ]
        }],
       
      }), { 
        noReady: true
      });
      players = Meteor.users.find({  
        "gender":gender,"userName": {$regex:reObj},
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",$or:[{
        "associationId":filterID},
        {"parentAssociationId": filterID,
        }],
         $and:[{
            $or:[{
              $and:[
                {$or:[{"affiliationId":null},
                {"affiliationId":undefined},
                {"affiliationId":""},
                {"affiliationId":"other"}]},{"statusOfUser":"Active"}
              ]},
              {$and:[
                {"affiliationId":{$nin:[null,"","other",undefined]}},
                {"statusOfUser":"notApproved"}
              ]}
            ]
        }],          
      },{
      limit: 10, 
      skip: skipCount
      });
    }
    else if(approval.trim() == "Approved")
    {
       Counts.publish(this, 'playersCount', Meteor.users.find({
        "gender":gender,"userName": {$regex:reObj},
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",$or:[{
        "associationId":filterID},
        {"parentAssociationId": filterID,
        }],
       $and:[{$or:[
              {"affiliationId":{$nin:[null,"","other",undefined]}}
            ]},{"statusOfUser":"Active"}] 
       
      }), { 
        noReady: true
      });
      players = Meteor.users.find({  
        "gender":gender,"userName": {$regex:reObj},
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",$or:[{
        "associationId":filterID},
        {"parentAssociationId": filterID,
        }],
      $and:[{$or:[
              {"affiliationId":{$nin:[null,"","other",undefined]}}
            ]},{"statusOfUser":"Active"}]           
      },{
      limit: 10, 
      skip: skipCount
      });
    }
     
    
  }

  return players
})

Meteor.publish('getacademyusersOnSearch', function(skipCount,sportID,filterID,gender,approval,playerSearchValue) 
{  
  var players;
  var test;
  var reObj = new RegExp(playerSearchValue, 'i');


  if(gender.trim() =="" && approval.trim() == "")
  {
    test = Counts.publish(this, 'playersCount', Meteor.users.find({
        "interestedProjectName":{$in:[sportID]},
        "userName": {$regex:reObj},
        "clubNameId":filterID,
        "role": "Player"
      }), { 
        noReady: true
      });
      players = Meteor.users.find({        
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",
        "userName": {$regex:reObj},
        "clubNameId":filterID         
      },{
      limit: 10, 
      skip: skipCount
      });
    
  }
  else if(gender.trim() != "" && approval.trim() == "")
  {
     test = Counts.publish(this, 'playersCount', Meteor.users.find({
        "gender":gender,"userName": {$regex:reObj},
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",
        "clubNameId":filterID,

       
      }), { 
        noReady: true
      });
      players = Meteor.users.find({  
        "gender":gender,"userName": {$regex:reObj},
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",
        "clubNameId":filterID,
     
      },{
      limit: 10, 
      skip: skipCount
      });
    
  }
  else if(gender.trim() == "" && approval.trim() != "")
  {
if(approval.trim() == "Pending")
    {
      test = Counts.publish(this, 'playersCount', Meteor.users.find({
        "interestedProjectName":{$in:[sportID]},
        "role": "Player","userName": {$regex:reObj},
        "clubNameId":filterID ,        
         $and:[{
            $or:[{
              $and:[
                {$or:[{"affiliationId":null},
                {"affiliationId":undefined},
                {"affiliationId":""},
                {"affiliationId":"other"}]},{"statusOfUser":"Active"}
              ]},
              {$and:[
                {"affiliationId":{$nin:[null,"","other",undefined]}},
                {"statusOfUser":"notApproved"}
              ]}
            ]
        }],
       
      }), { 
        noReady: true
      });
      players = Meteor.users.find({  
        "interestedProjectName":{$in:[sportID]},
        "role": "Player","userName": {$regex:reObj},
        "clubNameId":filterID,        
         $and:[{
            $or:[{
              $and:[
                {$or:[{"affiliationId":null},
                {"affiliationId":undefined},
                {"affiliationId":""},
                {"affiliationId":"other"}]},{"statusOfUser":"Active"}
              ]},
              {$and:[
                {"affiliationId":{$nin:[null,"","other",undefined]}},
                {"statusOfUser":"notApproved"}
              ]}
            ]
        }],          
      },{
      limit: 10, 
      skip: skipCount
      });
    
    }
    else if(approval.trim() == "Approved")
    {

        test = Counts.publish(this, 'playersCount', Meteor.users.find({
        "interestedProjectName":{$in:[sportID]},
        "role": "Player","userName": {$regex:reObj},
        "clubNameId":filterID,        
       $and:[{$or:[
              {"affiliationId":{$nin:[null,"","other",undefined]}}
            ]},{"statusOfUser":"Active"}] 
       
      }), { 
        noReady: true
      });
      players = Meteor.users.find({  
        "interestedProjectName":{$in:[sportID]},
        "role": "Player","userName": {$regex:reObj},
        "clubNameId":filterID,        
        $and:[{$or:[
              {"affiliationId":{$nin:[null,"","other",undefined]}}
            ]},{"statusOfUser":"Active"}]   
      },{
      limit: 10, 
      skip: skipCount
      });
    }
     
  }
  else if(gender.trim() != "" && approval.trim() != "")
  {
    if(approval.trim() == "Pending")
    {
      test = Counts.publish(this, 'playersCount', Meteor.users.find({
        "gender":gender,"userName": {$regex:reObj},
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",        
        "clubNameId":filterID,
         $and:[{
            $or:[{
              $and:[
                {$or:[{"affiliationId":null},
                {"affiliationId":undefined},
                {"affiliationId":""},
                {"affiliationId":"other"}]},{"statusOfUser":"Active"}
              ]},
              {$and:[
                {"affiliationId":{$nin:[null,"","other",undefined]}},
                {"statusOfUser":"notApproved"}
              ]}
            ]
        }],
       
      }), { 
        noReady: true
      });
      players = Meteor.users.find({  
        "gender":gender,"userName": {$regex:reObj},
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",
        "clubNameId":filterID,        
         $and:[{
            $or:[{
              $and:[
                {$or:[{"affiliationId":null},
                {"affiliationId":undefined},
                {"affiliationId":""},
                {"affiliationId":"other"}]},{"statusOfUser":"Active"}
              ]},
              {$and:[
                {"affiliationId":{$nin:[null,"","other",undefined]}},
                {"statusOfUser":"notApproved"}
              ]}
            ]
        }],          
      },{
      limit: 10, 
      skip: skipCount
      });
    }
    else if(approval.trim() == "Approved")
    {
        test = Counts.publish(this, 'playersCount', Meteor.users.find({
        "gender":gender,"userName": {$regex:reObj},
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",        
        "clubNameId":filterID,        
       $and:[{$or:[
              {"affiliationId":{$nin:[null,"","other",undefined]}}
            ]},{"statusOfUser":"Active"}] 
       
      }), { 
        noReady: true
      });
      players = Meteor.users.find({  
        "gender":gender,"userName": {$regex:reObj},
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",        
        "clubNameId":filterID,        
      $and:[{$or:[
              {"affiliationId":{$nin:[null,"","other",undefined]}}
            ]},{"statusOfUser":"Active"}]           
      },{
      limit: 10, 
      skip: skipCount
      });
    }
     
    
  }
      
  return players
})

Meteor.publish('getregionusersOnSearch', function(skipCount,sportID,filterID,gender,approval,playerSearchValue) 
{  
  var players;
  var reObj = new RegExp(playerSearchValue, 'i');

  if(gender.trim() == "" && approval.trim() == "")
  {
     Counts.publish(this, 'playersCount', Meteor.users.find({
        "interestedProjectName":{$in:[sportID]},"userName": {$regex:reObj},
        "interestedDomainName":{$in:[filterID]},
        "role": "Player"
      }), { 
        noReady: true
      });
      players = Meteor.users.find({        
        "interestedProjectName":{$in:[sportID]},
        "role": "Player","userName": {$regex:reObj},
        "interestedDomainName":{$in:[filterID]}
      },{
      limit: 10, // records to show per page
      skip: skipCount
      });
  }
  else if(gender.trim() != "" && approval.trim() == "")
  {
    Counts.publish(this, 'playersCount', Meteor.users.find({
        "interestedProjectName":{$in:[sportID]},
        "interestedDomainName":{$in:[filterID]},
        "role": "Player","userName": {$regex:reObj},
        "gender":gender
      }), { 
        noReady: true
      });
      players = Meteor.users.find({        
        "interestedProjectName":{$in:[sportID]},
        "role": "Player","userName": {$regex:reObj},
        "gender":gender,
        "interestedDomainName":{$in:[filterID]}
      },{
      limit: 10, // records to show per page
      skip: skipCount
      });
  }
  else if(gender.trim() == "" && approval.trim() != "")
  {
    if(approval.trim() == "Pending")
    {
      Counts.publish(this, 'playersCount', Meteor.users.find({
        "interestedProjectName":{$in:[sportID]},
        "interestedDomainName":{$in:[filterID]},
        "role": "Player","userName": {$regex:reObj},
         $and:[{
            $or:[{
              $and:[
                {$or:[{"affiliationId":null},
                {"affiliationId":undefined},
                {"affiliationId":""},
                {"affiliationId":"other"}]},{"statusOfUser":"Active"}
              ]},
              {$and:[
                {"affiliationId":{$nin:[null,"","other",undefined]}},
                {"statusOfUser":"notApproved"}
              ]}
            ]
        }],
      }), { 
        noReady: true
      });
      players = Meteor.users.find({        
        "interestedProjectName":{$in:[sportID]},
        "role": "Player","userName": {$regex:reObj},
        "interestedDomainName":{$in:[filterID]},
           $and:[{
            $or:[{
              $and:[
                {$or:[{"affiliationId":null},
                {"affiliationId":undefined},
                {"affiliationId":""},
                {"affiliationId":"other"}]},{"statusOfUser":"Active"}
              ]},
              {$and:[
                {"affiliationId":{$nin:[null,"","other",undefined]}},
                {"statusOfUser":"notApproved"}
              ]}
            ]
        }],
      },{
      limit: 10, // records to show per page
      skip: skipCount
      });
    }
    else if(approval.trim() == "Approved")
    {
      Counts.publish(this, 'playersCount', Meteor.users.find({
        "interestedProjectName":{$in:[sportID]},
        "interestedDomainName":{$in:[filterID]},
        "role": "Player","userName": {$regex:reObj},
         $and:[{$or:[
              {"affiliationId":{$nin:[null,"","other",undefined]}}
            ]},{"statusOfUser":"Active"}],
      }), { 
        noReady: true
      });
      players = Meteor.users.find({        
        "interestedProjectName":{$in:[sportID]},
        "role": "Player","userName": {$regex:reObj},
        "interestedDomainName":{$in:[filterID]},
         $and:[{$or:[
              {"affiliationId":{$nin:[null,"","other",undefined]}}
            ]},{"statusOfUser":"Active"}],
      },{
      limit: 10, // records to show per page
      skip: skipCount
      });
    }

    
  }
  else if(gender.trim() != "" && approval.trim() != "")
  {
    if(approval.trim() == "Pending")
    {
      Counts.publish(this, 'playersCount', Meteor.users.find({
        "interestedProjectName":{$in:[sportID]},
        "interestedDomainName":{$in:[filterID]},
        "role": "Player","userName": {$regex:reObj},
        "gender":gender,
         $and:[{
            $or:[{
              $and:[
                {$or:[{"affiliationId":null},
                {"affiliationId":undefined},
                {"affiliationId":""},
                {"affiliationId":"other"}]},{"statusOfUser":"Active"}
              ]},
              {$and:[
                {"affiliationId":{$nin:[null,"","other",undefined]}},
                {"statusOfUser":"notApproved"}
              ]}
            ]
        }],
      }), { 
        noReady: true
      });
      players = Meteor.users.find({        
        "interestedProjectName":{$in:[sportID]},
        "role": "Player","userName": {$regex:reObj},
        "gender":gender,
        "interestedDomainName":{$in:[filterID]},
           $and:[{
            $or:[{
              $and:[
                {$or:[{"affiliationId":null},
                {"affiliationId":undefined},
                {"affiliationId":""},
                {"affiliationId":"other"}]},{"statusOfUser":"Active"}
              ]},
              {$and:[
                {"affiliationId":{$nin:[null,"","other",undefined]}},
                {"statusOfUser":"notApproved"}
              ]}
            ]
        }],
      },{
      limit: 10, // records to show per page
      skip: skipCount
      });
    }
    else if(approval.trim() == "Approved")
    {
      Counts.publish(this, 'playersCount', Meteor.users.find({
        "interestedProjectName":{$in:[sportID]},
        "interestedDomainName":{$in:[filterID]},
        "role": "Player","userName": {$regex:reObj},
        "gender":gender,
         $and:[{$or:[
              {"affiliationId":{$nin:[null,"","other",undefined]}}
            ]},{"statusOfUser":"Active"}],
      }), { 
        noReady: true
      });
      players = Meteor.users.find({        
        "interestedProjectName":{$in:[sportID]},
        "role": "Player","userName": {$regex:reObj},
        "gender":gender,
        "interestedDomainName":{$in:[filterID]},
         $and:[{$or:[
              {"affiliationId":{$nin:[null,"","other",undefined]}}
            ]},{"statusOfUser":"Active"}],
      },{
      limit: 10, // records to show per page
      skip: skipCount
      });
    }
  }
     
    
  return players
})
*/
//*********** approval count **************************//

/*Meteor.publish('associationApprovalCount', function(sportID,filterBy,filterID,gender,approval,associationId) 
{  
  var players;
  var skipCount;
  if(filterBy == "Association")
  {
    if(gender.trim() == "" && approval.trim() == "")
    {
      Counts.publish(this, 'associationApprovalCount', Meteor.users.find({
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",
        $or:[{"associationId":associationId},{"parentAssociationId": associationId}],
        $and:[{
              $or:[{
                $and:[
                  {$or:[{"affiliationId":null},
                  {"affiliationId":undefined},
                  {"affiliationId":""},
                  {"affiliationId":"other"}]},{"statusOfUser":"Active"}
                ]},
                {$and:[
                  {"affiliationId":{$nin:[null,"","other",undefined]}},
                  {"statusOfUser":"notApproved"}
                ]}
              ]
        }]       
      }),{noReady: true});
    }

    else if(gender.trim() != "" && approval.trim() == "")
    {
      Counts.publish(this, 'associationApprovalCount', Meteor.users.find({
          "gender":gender,
          "interestedProjectName":{$in:[sportID]},
          "role": "Player",
          $or:[{
          "associationId":associationId},
          {"parentAssociationId": associationId,
          }]
         
        }), { 
          noReady: true
        });
    }

    else if(gender.trim() == "" && approval.trim() != "")
    {
      if(approval.trim() == "Pending")
      {
        Counts.publish(this, 'associationApprovalCount', Meteor.users.find({
          "interestedProjectName":{$in:[sportID]},
          "role": "Player",
          $or:[{
          "associationId":associationId},
          {"parentAssociationId": associationId,
          }],
           $and:[{
              $or:[{
                $and:[
                  {$or:[{"affiliationId":null},
                  {"affiliationId":undefined},
                  {"affiliationId":""},
                  {"affiliationId":"other"}]},{"statusOfUser":"Active"}
                ]},
                {$and:[
                  {"affiliationId":{$nin:[null,"","other",undefined]}},
                  {"statusOfUser":"notApproved"}
                ]}
              ]
          }],
         
        }), { 
          noReady: true
        });
      }
      else if(approval.trim() == "Approved")
      {
          Counts.publish(this, 'associationApprovalCount', Meteor.users.find({
          "interestedProjectName":{$in:[sportID]},
          "role": "Player",
          $or:[{
          "associationId":associationId},
          {"parentAssociationId": associationId,
          }],
         $and:[{$or:[
                {"affiliationId":{$nin:[null,"","other",undefined]}}
              ]},{"statusOfUser":"Active"}] 
         
        }), { 
          noReady: true
        });
      }
     
    }
    else if(gender.trim() != "" && approval.trim() != "")
    {
      if(approval.trim() == "Pending")
      {
        Counts.publish(this, 'associationApprovalCount', Meteor.users.find({
          "gender":gender,
          "interestedProjectName":{$in:[sportID]},
          "role": "Player",
          $or:[{
          "associationId":associationId},
          {"parentAssociationId": associationId,
          }],
           $and:[{
              $or:[{
                $and:[
                  {$or:[{"affiliationId":null},
                  {"affiliationId":undefined},
                  {"affiliationId":""},
                  {"affiliationId":"other"}]},{"statusOfUser":"Active"}
                ]},
                {$and:[
                  {"affiliationId":{$nin:[null,"","other",undefined]}},
                  {"statusOfUser":"notApproved"}
                ]}
              ]
          }],
         
        }), { 
          noReady: true
        });
      
      }
      else if(approval.trim() == "Approved")
      {
         Counts.publish(this, 'associationApprovalCount', Meteor.users.find({
          "gender":gender,
          "interestedProjectName":{$in:[sportID]},
          "role": "Player",
          $or:[{
          "associationId":associationId},
          {"parentAssociationId": associationId,
          }],
         $and:[{$or:[
                {"affiliationId":{$nin:[null,"","other",undefined]}}
              ]},{"statusOfUser":"Active"}] 
         
        }), { 
          noReady: true
        });
      
      }
    }
  }
  else if(filterBy == "Institution/Academy")
  {
    if(gender.trim() == "" && approval.trim() == "")
    {
      Counts.publish(this, 'associationApprovalCount', Meteor.users.find({
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",
        "clubNameId":filterID,
        $or:[{"associationId":associationId},{"parentAssociationId": associationId}],
        $and:[{
              $or:[{
                $and:[
                  {$or:[{"affiliationId":null},
                  {"affiliationId":undefined},
                  {"affiliationId":""},
                  {"affiliationId":"other"}]},{"statusOfUser":"Active"}
                ]},
                {$and:[
                  {"affiliationId":{$nin:[null,"","other",undefined]}},
                  {"statusOfUser":"notApproved"}
                ]}
              ]
        }]       
      }),{noReady: true});
    }

    else if(gender.trim() != "" && approval.trim() == "")
    {
      Counts.publish(this, 'associationApprovalCount', Meteor.users.find({
          "gender":gender,
          "interestedProjectName":{$in:[sportID]},
          "role": "Player",
          "clubNameId":filterID,
          $or:[{"associationId":associationId},{"parentAssociationId": associationId}],

        }), { 
          noReady: true
        });
    }

    else if(gender.trim() == "" && approval.trim() != "")
    {
      if(approval.trim() == "Pending")
      {
        Counts.publish(this, 'associationApprovalCount', Meteor.users.find({
          "interestedProjectName":{$in:[sportID]},
          "role": "Player",
          "clubNameId":filterID,
          $or:[{"associationId":associationId},{"parentAssociationId": associationId}],
           $and:[{
              $or:[{
                $and:[
                  {$or:[{"affiliationId":null},
                  {"affiliationId":undefined},
                  {"affiliationId":""},
                  {"affiliationId":"other"}]},{"statusOfUser":"Active"}
                ]},
                {$and:[
                  {"affiliationId":{$nin:[null,"","other",undefined]}},
                  {"statusOfUser":"notApproved"}
                ]}
              ]
          }],
         
        }), { 
          noReady: true
        });
      }
      else if(approval.trim() == "Approved")
      {
          Counts.publish(this, 'associationApprovalCount', Meteor.users.find({
          "interestedProjectName":{$in:[sportID]},
          "role": "Player",
          "clubNameId":filterID,
          $or:[{"associationId":associationId},{"parentAssociationId": associationId}],
          $and:[{$or:[
                {"affiliationId":{$nin:[null,"","other",undefined]}}
              ]},{"statusOfUser":"Active"}] 
         
        }), { 
          noReady: true
        });
      }
     
    }
    else if(gender.trim() != "" && approval.trim() != "")
    {
      if(approval.trim() == "Pending")
      {
        Counts.publish(this, 'associationApprovalCount', Meteor.users.find({
          "gender":gender,
          "interestedProjectName":{$in:[sportID]},
          "role": "Player",
          "clubNameId":filterID,
          $or:[{"associationId":associationId},{"parentAssociationId": associationId}],
           $and:[{
              $or:[{
                $and:[
                  {$or:[{"affiliationId":null},
                  {"affiliationId":undefined},
                  {"affiliationId":""},
                  {"affiliationId":"other"}]},{"statusOfUser":"Active"}
                ]},
                {$and:[
                  {"affiliationId":{$nin:[null,"","other",undefined]}},
                  {"statusOfUser":"notApproved"}
                ]}
              ]
          }],
         
        }), { 
          noReady: true
        });
      
      }
      else if(approval.trim() == "Approved")
      {
         Counts.publish(this, 'associationApprovalCount', Meteor.users.find({
          "gender":gender,
          "interestedProjectName":{$in:[sportID]},
          "role": "Player",
          "clubNameId":filterID,
          $or:[{"associationId":associationId},{"parentAssociationId": associationId}],
          $and:[{$or:[
                {"affiliationId":{$nin:[null,"","other",undefined]}}
              ]},{"statusOfUser":"Active"}] 
         
        }), { 
          noReady: true
        });
      
      }
    }
  }
  else if(filterBy == "Region")
  {
    if(gender.trim() == "" && approval.trim() == "")
    {
      Counts.publish(this, 'associationApprovalCount', Meteor.users.find({
        "interestedProjectName":{$in:[sportID]},
        "role": "Player",
        "interestedDomainName":{$in:[filterID]},
        $or:[{"associationId":associationId},{"parentAssociationId": associationId}],
        $and:[{
              $or:[{
                $and:[
                  {$or:[{"affiliationId":null},
                  {"affiliationId":undefined},
                  {"affiliationId":""},
                  {"affiliationId":"other"}]},{"statusOfUser":"Active"}
                ]},
                {$and:[
                  {"affiliationId":{$nin:[null,"","other",undefined]}},
                  {"statusOfUser":"notApproved"}
                ]}
              ]
        }]       
      }),{noReady: true});
    }

    else if(gender.trim() != "" && approval.trim() == "")
    {
      Counts.publish(this, 'associationApprovalCount', Meteor.users.find({
          "gender":gender,
          "interestedProjectName":{$in:[sportID]},
          "role": "Player",
          "interestedDomainName":{$in:[filterID]},
          $or:[{"associationId":associationId},{"parentAssociationId": associationId}],

        }), { 
          noReady: true
        });
    }

    else if(gender.trim() == "" && approval.trim() != "")
    {
      if(approval.trim() == "Pending")
      {
        Counts.publish(this, 'associationApprovalCount', Meteor.users.find({
          "interestedProjectName":{$in:[sportID]},
          "role": "Player",
          "interestedDomainName":{$in:[filterID]},
          $or:[{"associationId":associationId},{"parentAssociationId": associationId}],
           $and:[{
              $or:[{
                $and:[
                  {$or:[{"affiliationId":null},
                  {"affiliationId":undefined},
                  {"affiliationId":""},
                  {"affiliationId":"other"}]},{"statusOfUser":"Active"}
                ]},
                {$and:[
                  {"affiliationId":{$nin:[null,"","other",undefined]}},
                  {"statusOfUser":"notApproved"}
                ]}
              ]
          }],
         
        }), { 
          noReady: true
        });
      }
      else if(approval.trim() == "Approved")
      {
          Counts.publish(this, 'associationApprovalCount', Meteor.users.find({
          "interestedProjectName":{$in:[sportID]},
          "role": "Player",
          "interestedDomainName":{$in:[filterID]},
          $or:[{"associationId":associationId},{"parentAssociationId": associationId}],
          $and:[{$or:[
                {"affiliationId":{$nin:[null,"","other",undefined]}}
              ]},{"statusOfUser":"Active"}] 
         
        }), { 
          noReady: true
        });
      }
     
    }
    else if(gender.trim() != "" && approval.trim() != "")
    {
      if(approval.trim() == "Pending")
      {
        Counts.publish(this, 'associationApprovalCount', Meteor.users.find({
          "gender":gender,
          "interestedProjectName":{$in:[sportID]},
          "role": "Player",
          "interestedDomainName":{$in:[filterID]},
          $or:[{"associationId":associationId},{"parentAssociationId": associationId}],
           $and:[{
              $or:[{
                $and:[
                  {$or:[{"affiliationId":null},
                  {"affiliationId":undefined},
                  {"affiliationId":""},
                  {"affiliationId":"other"}]},{"statusOfUser":"Active"}
                ]},
                {$and:[
                  {"affiliationId":{$nin:[null,"","other",undefined]}},
                  {"statusOfUser":"notApproved"}
                ]}
              ]
          }],
         
        }), { 
          noReady: true
        });
      
      }
      else if(approval.trim() == "Approved")
      {
         Counts.publish(this, 'associationApprovalCount', Meteor.users.find({
          "gender":gender,
          "interestedProjectName":{$in:[sportID]},
          "role": "Player",
          "interestedDomainName":{$in:[filterID]},
          $or:[{"associationId":associationId},{"parentAssociationId": associationId}],
          $and:[{$or:[
                {"affiliationId":{$nin:[null,"","other",undefined]}}
              ]},{"statusOfUser":"Active"}] 
         
        }), { 
          noReady: true
        });
      
      }
    }
  }

})
*/





/******** userDetails TT publish ***********/
Meteor.publish('userDetailsTT', function() {
  var lData = userDetailsTT.find();

  if (lData) {
    return lData;
  }
  return this.ready();
});