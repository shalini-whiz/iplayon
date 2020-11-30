import {emailRegex}from '../dbRequiredRole.js'


Meteor.methods({

	analyticsAccess:function(userId){
		try{
		  	var userAccess = analyticsApproval.findOne({"userId":userId,"status" : "Active"});
		  	if(userAccess && userAccess.validity)
		  	{
				
				var currentDate = moment(new Date()).format("YYYY/DD/MMM");
				var userAccessDate = moment(new Date(userAccess.validity)).format("YYYY/DD/MMM");
				if (new Date(userAccessDate) >= new Date(currentDate)) 
					return true;
				else 
					return false; 
				            
		  	} 
		  	else 
				return false;
		}catch(e){}
	},
	'getStrokesData':async function(userId)
	{
		try{
			var json = {};        
		  var aa = await Meteor.call("updateDomainDetails",userId);       

		 
		  var serviceAgg = serviceStrokes.aggregate([	  
				{$group:{
	            "_id":null,
	            "serviceKeys":{$push:{
	            	"serviceShortCode":"$serviceShortName",
	            	"serviceName":"$serviceName"}},

            }},
            {$project:{
               "_id":0,
               "serviceKeys":1
            }}
		  	]);
		  if(serviceAgg.length > 0 && serviceAgg[0].serviceKeys && serviceAgg[0].serviceKeys.length>0)
		  {
				json["serviceKeysJson"] = serviceAgg[0].serviceKeys;
		  }
		  
			
		   var strokesAgg = strokes.aggregate([	  
				{$group:{
	            "_id":null,
	            "strokeKeys":{$push:{
	            	"strokeShortCode":"$strokeShortCode",
	            	"strokeName":"$strokeName"}},

            }},
            {$project:{
               "_id":0,
               "strokeKeys":1
            }}
		  	]);
		  	if(strokesAgg.length > 0 && strokesAgg[0].strokeKeys && strokesAgg[0].strokeKeys.length>0)
		  	{
				json["shortKeysJson"] = strokesAgg[0].strokeKeys;
		  	}

		  
			
		  var destPointsAgg = destinationPoints.aggregate([	  
				{$group:{
	            "_id":null,
	            "destinationKeys":{$push:{
	            	"destinationShortCode":"$destinationShortName",
	            	"destinationName":"$destinationName"}},
            }},
            {$project:{
               "_id":0,
               "destinationKeys":1
            }}
		  	]);
		  	if(destPointsAgg.length > 0 && destPointsAgg[0].destinationKeys && destPointsAgg[0].destinationKeys.length>0)
		  	{
				json["destinationKeysJson"] = destPointsAgg[0].destinationKeys;
		  	}


			var p6destPointsAgg = p6DestinationPoints.aggregate([	  
				{$group:{
	            "_id":null,
	            "destinationKeys":{$push:{
	            	"destinationShortCode":"$destinationShortName",
	            	"destinationName":"$destinationName"
	            	}},
            }},
            {$project:{
               "_id":0,
               "destinationKeys":1
            }}
		  	]);
		  	if(p6destPointsAgg.length > 0 && p6destPointsAgg[0].destinationKeys && p6destPointsAgg[0].destinationKeys.length>0)
		  	{
				json["p6destinationKeysJson"] = p6destPointsAgg[0].destinationKeys;

		  	}



		  var p8destPointsAgg = p8DestinationPoints.aggregate([	  
				{$group:{
	            "_id":null,
	            "destinationKeys":{$push:{
	            	"destinationShortCode":"$destinationShortName",
	            	"destinationName":"$destinationName"}},
            }},
            {$project:{
               "_id":0,
               "destinationKeys":1
            }}
		  	]);
		  	if(p8destPointsAgg.length > 0 && p8destPointsAgg[0].destinationKeys && p8destPointsAgg[0].destinationKeys.length>0)
		  	{
				json["p8destinationKeysJson"] = p8destPointsAgg[0].destinationKeys;
		  	}



		  var p9destPointsAgg = p9DestinationPoints.aggregate([	  
				{$group:{
	            "_id":null,
	            "destinationKeys":{$push:{
	            	"destinationShortCode":"$destinationShortName",
	            	"destinationName":"$destinationName"}},
            }},
            {$project:{
               "_id":0,
               "destinationKeys":1
            }}
		  	]);
		  	if(p9destPointsAgg.length > 0 && p9destPointsAgg[0].destinationKeys && p9destPointsAgg[0].destinationKeys.length>0)
		  	{
				json["p9destinationKeysJson"] = p9destPointsAgg[0].destinationKeys;
		  	}

		  	var p14destPointsAgg = p14DestinationPoints.aggregate([	  
				{$group:{
	            "_id":null,
	            "destinationKeys":{$push:{
	            	"destinationShortCode":"$destinationShortName",
	            	"destinationName":"$destinationName"}},
            }},
            {$project:{
               "_id":0,
               "destinationKeys":1
            }}
		  	]);
		  	if(p14destPointsAgg.length > 0 && p14destPointsAgg[0].destinationKeys && p14destPointsAgg[0].destinationKeys.length>0)
		  	{
				json["p14destinationKeysJson"] = p14destPointsAgg[0].destinationKeys;
		  	}

		  var raw = playerDetailsRecord.rawCollection();
		  var distinct = Meteor.wrapAsync(raw.distinct, raw);

		
		  var playerDetailsArr = playerDetailsRecord.aggregate([
				{$match:{"loggerId":userId,"userId":{$in:["",null]}}},           
				{$group: { "_id":{
				  "playerName":"$playerName",
				  "userId":"$_id"}
				}
			  },
				{$project:{
				  "playerName":"$_id.playerName",
				  "userId":"$_id.userId",
				  "_id":0
				}},
				{$sort: {"playerName":1}}

				]
			);


		  //var playerDetailsID = distinct('userId',{"loggerId":userId});

		   var registeredPlayersArr = userDetailsTT.aggregate([
				{$match:{      
					userName:{$nin:["",null]},
					//userId:{$nin:playerDetailsID}                             
				}},           
				{$group: { "_id":{
				  "playerName":"$userName",
				  "userId":"$userId"}
				}},
				{$project:{
				  "playerName":"$_id.playerName" ,
				  "userId":"$_id.userId",
				  "_id":0,
				  "insensitive": { "$toLower": "$_id.playerName" }
				}},
				{$sort: {"insensitive":1}}
				]
			);

		  



		  json["registeredPlayers"] = registeredPlayersArr;

		  //json["registeredPlayers"] = _.union(registeredPlayersArr,registeredOrganizersArr);

		  var losingStrokesInfo = losingStrokes.findOne({});
		  if(losingStrokesInfo)
			json["losingStrokes"] = losingStrokesInfo.losingStrokes;



		  var userDetailsArr = [];
		  var player2List = [];
		  var loggerUserId = "";
		  var loggerSeqId = "";
		  player2List.push({userId:"","playerName":"All"},{userId:"",playerName:"All L/H"},{userId:"",playerName:"All R/H"});
		  var raw = sequenceDataRecord.rawCollection();
		  var distinct = Meteor.wrapAsync(raw.distinct, raw);

		  var playerDetailsRecordInfo = playerDetailsRecord.findOne({"loggerId":userId,"userId":userId});
		  if(playerDetailsRecordInfo)
			loggerSeqId = playerDetailsRecordInfo._id;

		  var userInfo = userDetailsTT.findOne({"userId":userId});
		  if(userInfo)
		  {
			loggerUserId = userInfo.userId;
			userDetailsArr.push({"userId":loggerSeqId,"playerName":userInfo.userName}); 
		  }

		  var player1Sett = sequenceDataRecord.aggregate([
			{$match:{"loggerId":userId,
			  "player1Id":{$nin:[userId]}
			}},           
			{$group: { "_id":{
			  "playerName":"$player1Name",
			  "userId":"$player1Id",
			  }
			}},
			{$project:{            
			  "playerName":"$_id.playerName",
			  "userId":"$_id.userId",
			  "_id":0
			}}
		  ]);

		  var player1IDList = distinct('player1Id',{"loggerId":userId,"player1Id":{$nin:[userId]}});
		  var player2IDList = distinct('player2Id',{"loggerId":userId,"player2Id":{$nin:[userId]}});

		  var player2Sett = sequenceDataRecord.aggregate([
			{$match:{"loggerId":userId,
				$and:[{"player2Id":{$nin:[userId]}},{player2Id:{$nin:player1IDList}}]
			}},           
			{$group: { "_id":{
			  "playerName":"$player2Name",
			  "userId":"$player2Id"}
			}},
			{$project:{            
			  "playerName":"$_id.playerName",
			  "userId":"$_id.userId",
			  "_id":0
			}}
		  ]);


		  json["player1Set"] = _.union(userDetailsArr,player1Sett,player2Sett);
		  json["player1SetKeyMap"] = _.union(player1Sett,player2Sett,registeredPlayersArr);              
		  
		  var player1Played = sequenceDataRecord.aggregate([
			{$match:{"loggerId":userId,
			  player1Id:loggerSeqId
			}},           
			{$group: {
			  _id:{"playerName":"$player2Name","userId":"$player2Id"}
			}},
			{$project:{
			   "playerName":"$_id.playerName",
			  "userId":"$_id.userId",
			  "_id":0
			}}
		  ]);    


		 var player2Played = sequenceDataRecord.aggregate([
			{$match:{"loggerId":userId,
			  player2Id:loggerSeqId
			}},           
			{$group: {
			  _id:{
			  "playerName":"$player1Name",
			  "userId":"$player1Id"}
			}},
			{$project:{
			  "playerName":"$_id.playerName",
			  "userId":"$_id.userId",
			  "_id":0
			}}
		  ]);

		  json["player2Set"] = _.union(player2List,player1Played,player2Played);
		  
		  return json;
		}catch(e){
		}
	},

	getMatchStrokes:function()
	{
		var json = {};
		var serviceAgg = serviceStrokes.aggregate([	  
				{$group:{
	            "_id":null,
	            "serviceKeys":{$push:{
	            	"serviceShortCode":"$serviceShortName",
	            	"serviceName":"$serviceName"}},

            }},
            {$project:{
               "_id":0,
               "serviceKeys":1
            }}
		  	]);
		  if(serviceAgg.length > 0 && serviceAgg[0].serviceKeys && serviceAgg[0].serviceKeys.length>0)
		  {
				json["serviceKeysJson"] = serviceAgg[0].serviceKeys;
		  }
		  
			
		   var strokesAgg = strokes.aggregate([	  
				{$group:{
	            "_id":null,
	            "strokeKeys":{$push:{
	            	"strokeShortCode":"$strokeShortCode",
	            	"strokeName":"$strokeName"}},

            }},
            {$project:{
               "_id":0,
               "strokeKeys":1
            }}
		  	]);
		  	if(strokesAgg.length > 0 && strokesAgg[0].strokeKeys && strokesAgg[0].strokeKeys.length>0)
		  	{
				json["shortKeysJson"] = strokesAgg[0].strokeKeys;
		  	}

		  
			
		  var destPointsAgg = destinationPoints.aggregate([	  
				{$group:{
	            "_id":null,
	            "destinationKeys":{$push:{
	            	"destinationShortCode":"$destinationShortName",
	            	"destinationName":"$destinationName"}},
            }},
            {$project:{
               "_id":0,
               "destinationKeys":1
            }}
		  	]);
		  	if(destPointsAgg.length > 0 && destPointsAgg[0].destinationKeys && destPointsAgg[0].destinationKeys.length>0)
		  	{
				json["destinationKeysJson"] = destPointsAgg[0].destinationKeys;
		  	}


			var p6destPointsAgg = p6DestinationPoints.aggregate([	  
				{$group:{
	            "_id":null,
	            "destinationKeys":{$push:{
	            	"destinationShortCode":"$destinationShortName",
	            	"destinationName":"$destinationName"
	            	}},
            }},
            {$project:{
               "_id":0,
               "destinationKeys":1
            }}
		  	]);
		  	if(p6destPointsAgg.length > 0 && p6destPointsAgg[0].destinationKeys && p6destPointsAgg[0].destinationKeys.length>0)
		  	{
				json["p6destinationKeysJson"] = p6destPointsAgg[0].destinationKeys;

		  	}



		  var p8destPointsAgg = p8DestinationPoints.aggregate([	  
				{$group:{
	            "_id":null,
	            "destinationKeys":{$push:{
	            	"destinationShortCode":"$destinationShortName",
	            	"destinationName":"$destinationName"}},
            }},
            {$project:{
               "_id":0,
               "destinationKeys":1
            }}
		  	]);
		  	if(p8destPointsAgg.length > 0 && p8destPointsAgg[0].destinationKeys && p8destPointsAgg[0].destinationKeys.length>0)
		  	{
				json["p8destinationKeysJson"] = p8destPointsAgg[0].destinationKeys;
		  	}



		  var p9destPointsAgg = p9DestinationPoints.aggregate([	  
				{$group:{
	            "_id":null,
	            "destinationKeys":{$push:{
	            	"destinationShortCode":"$destinationShortName",
	            	"destinationName":"$destinationName"}},
            }},
            {$project:{
               "_id":0,
               "destinationKeys":1
            }}
		  	]);
		  	if(p9destPointsAgg.length > 0 && p9destPointsAgg[0].destinationKeys && p9destPointsAgg[0].destinationKeys.length>0)
		  	{
				json["p9destinationKeysJson"] = p9destPointsAgg[0].destinationKeys;
		  	}

		  	var p14destPointsAgg = p14DestinationPoints.aggregate([	  
				{$group:{
	            "_id":null,
	            "destinationKeys":{$push:{
	            	"destinationShortCode":"$destinationShortName",
	            	"destinationName":"$destinationName"}},
            }},
            {$project:{
               "_id":0,
               "destinationKeys":1
            }}
		  	]);
		  	if(p14destPointsAgg.length > 0 && p14destPointsAgg[0].destinationKeys && p14destPointsAgg[0].destinationKeys.length>0)
		  	{
				json["p14destinationKeysJson"] = p14destPointsAgg[0].destinationKeys;
		  	}

		  	var losingStrokesInfo = losingStrokes.findOne({});
		  if(losingStrokesInfo)
			json["losingStrokes"] = losingStrokesInfo.losingStrokes;

		var registeredPlayersArr = userDetailsTT.aggregate([
				{$match:{      
					userName:{$nin:["",null]},
					//userId:{$nin:playerDetailsID}                             
				}},           
				{$group: { "_id":{
				  "playerName":"$userName",
				  "userId":"$userId"}
				}},
				{$project:{
				  "playerName":"$_id.playerName" ,
				  "userId":"$_id.userId",
				  "_id":0,
				  "insensitive": { "$toLower": "$_id.playerName" }
				}},
				{$sort: {"insensitive":1}}
				]
			);

		  

		  json["registeredPlayers"] = registeredPlayersArr;

		return json;
	},
	getPlayerSetData:async function(userId)
  	{
	try{

	  var json = {};
	  var userDetailsArr = [];
	  var player2List = [];
	  var loggerUserId = "";
	  var loggerSeqId = "";
	  player2List.push({userId:"","playerName":"All"},{userId:"",playerName:"All L/H"},{userId:"",playerName:"All R/H"});
	  var raw = sequenceDataRecord.rawCollection();
	  var distinct = Meteor.wrapAsync(raw.distinct, raw);
	  var player1IDList = [];
	  var player2IDLIst = [];

	  var playerDetailsRecordInfo = playerDetailsRecord.findOne({"loggerId":userId,"userId":userId});
	  if(playerDetailsRecordInfo)
	  {
		loggerSeqId = playerDetailsRecordInfo._id;
		userDetailsArr.push({"userId":playerDetailsRecordInfo._id,"playerName":playerDetailsRecordInfo.playerName}); 
		player1IDList = distinct('player1Id',{"loggerId":userId,"player1Id":{$nin:[playerDetailsRecordInfo._id]}});
		player2IDList = distinct('player2Id',{"loggerId":userId,"player2Id":{$nin:[playerDetailsRecordInfo._id]}});
	  }
	  else
	  {
		var userInfo = userDetailsTT.findOne({"userId":userId});
		if(userInfo)
		{
		  loggerUserId = userInfo.userId;
		  userDetailsArr.push({"userId":"","playerName":userInfo.userName}); 
		}
	  }
	  

	  var player1Sett = sequenceDataRecord.aggregate([
		{$match:{"loggerId":userId,
		  "player1Id":{$nin:[loggerSeqId]}
		}},           
		{$group: { "_id":{
		  "playerName":"$player1Name",
		  "userId":"$player1Id",
		  }
		}},
		{$project:{  
		  "userId":"$_id.userId",       
		  "playerName":"$_id.playerName",
		  "_id":0,
		  "insensitive": { "$toLower": "$_id.playerName" }
		}},
		{$sort: {"insensitive":1}}

	  ]);

	  

	  var player2Sett = sequenceDataRecord.aggregate([
		{$match:{"loggerId":userId,
			$and:[{"player2Id":{$nin:[loggerSeqId]}},{player2Id:{$nin:player1IDList}}]
		}},           
		{$group: { "_id":{
		  "playerName":"$player2Name",
		  "userId":"$player2Id"}
		}},
		{$project:{   
		  "userId":"$_id.userId",     
		  "playerName":"$_id.playerName",
		  "_id":0,
		  "insensitive": { "$toLower": "$_id.playerName" }
		}},
		{$sort: {"insensitive":1}}

	  ]);



	  var consolidateSet = _.union(player1Sett,player2Sett);
	  consolidateSet.sort(function SortByName(x,y) {
		return ((x.insensitive == y.insensitive) ? 0 : ((x.insensitive > y.insensitive) ? 1 : -1 ));
	  });

	 
	 
	  json["player1Set"] = _.union(userDetailsArr,consolidateSet);


	   
	  var vsPlayers = sequenceDataRecord.aggregate([
		{$match:
		  {$or:[
			{"loggerId":userId,player1Id:loggerSeqId},
			{"loggerId":userId,player2Id:loggerSeqId}
		  ]}       
		},           
		{$group: {
		  _id:{
		  "playerName":{
			"$cond": {
			  "if": { "$eq": ["$player1Id",loggerSeqId]}, 
			  "then": "$player2Name", 
			  "else": "$player1Name"
			}
		  },
		  "userId":{
			"$cond": {
			  "if": { "$eq": ["$player1Id",loggerSeqId]}, 
			  "then": "$player2Id", 
			  "else": "$player1Id"
			}
		  }}     
		}},
		{$project:{
		  "userId":"$_id.userId",
		  "playerName":"$_id.playerName",
		  "_id":0,
		  "insensitive": { "$toLower": "$_id.playerName" }
		}},
		{$sort: {"insensitive":1}}
	  ]);

	 

	  json["player2Set"] = _.union(player2List,vsPlayers);


	  json["matchStrokes"]= await Meteor.call("getMatchStrokes");



	  return json;


	}catch(e){}
  },
  getVsPlayerList:function(userId,loggerSeqId)
  {
	try
	{
	  var json = {};
	  var player2List = [];
	  player2List.push({userId:"","playerName":"All"},{userId:"",playerName:"All L/H"},{userId:"",playerName:"All R/H"});
	  
	  var vsPlayers = sequenceDataRecord.aggregate([
		{$match:
		  {$or:[
			{"loggerId":userId,player1Id:loggerSeqId},
			{"loggerId":userId,player2Id:loggerSeqId}
		  ]}       
		},           
		{$group: {
		  _id:{
		  "playerName":{
			"$cond": {
			  "if": { "$eq": ["$player1Id",loggerSeqId]}, 
			  "then": "$player2Name", 
			  "else": "$player1Name"
			}
		  },
		  "userId":{
			"$cond": {
			  "if": { "$eq": ["$player1Id",loggerSeqId]}, 
			  "then": "$player2Id", 
			  "else": "$player1Id"
			}
		  }}     
		}},
		{$project:{
		  "userId":"$_id.userId",
		  "playerName":"$_id.playerName",
		  "_id":0,
		  "insensitive": { "$toLower": "$_id.playerName" }
		}},
		{$sort: {"insensitive":1}}
	  ]);

	  

	  json["player2Set"] = _.union(player2List,vsPlayers);
	  return json;
	}catch(e){}
  },
  getPlayerDetailsInfo:function(userId,data)
  {
	var playerID = data.playerID;
	var playerName = data.playerName;
	var json = {};
	try
	{

	  var userInfo = userDetailsTT.findOne(
		{"userId":playerID,
		 "userName": {
			$regex: emailRegex(playerName)
		  }
		
	  });
	  if(userInfo)
	  {      
		if(userInfo.clubNameId)
		{
		  var academyInfo = academyDetails.findOne({"userId":userInfo.clubNameId})
		  if(academyInfo)
			userInfo["academy"] = academyInfo.clubName;        
		}
		if(userInfo.associationId)
		{
		  var assocInfo = associationDetails.findOne({"userId":userInfo.associationId})
		  if(assocInfo)
			userInfo["association"] = assocInfo.associationName;  
		}
		return userInfo;       
	  }
	  else
	  {
		var userInfo = playerDetailsRecord.findOne({
			"loggerId":userId,
			"playerName": {
			$regex: emailRegex(playerName)
		  }

		});
		if(userInfo)
		{
		  if(userInfo.playerName)
			userInfo["userName"] = userInfo.playerName;
		  return userInfo;
		}
	  }
	  return {};
	}catch(e){
	}
  }
  
})


Meteor.methods({
  "getFullNameOfDest":function(destShortName){
	if(destShortName)
	{
	  var findDet = destinationPoints.findOne({"destinationShortName":destShortName})
	  if(findDet&&findDet.destinationName){
		return findDet.destinationName
	  }
	  else return "Unknown"
	}
  }
});

Meteor.methods({
  "getFullNameServiceStrokes":function(serShortName){
	if(serShortName)
	{
	  var findDet = serviceStrokes.findOne({"serviceShortName":serShortName})
	  if(findDet&&findDet.serviceName){
		return findDet.serviceName
	  }
	  else return "Unknown"
	}
  }
});

Meteor.methods({
  "getCombinedNAmeOfstrokes":function(data1,data2){
	if(data1&&data2){
	  var findDet = strokes.findOne({"strokeShortCode":data1})
	  var strokeName = " ";
	  var destNAme = " ";
	  if(findDet&&findDet.strokeName){
		strokeName = findDet.strokeName
	  }
	  var findDet2 = destinationPoints.findOne({"destinationShortName":data2})
	  if(findDet2&&findDet2.destinationName){
		destNAme = ":"+findDet2.destinationName
	  }      
	  return strokeName+destNAme
	}
  }
})
