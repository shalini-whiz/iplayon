

Meteor.methods({

	analyticsSummary:function(caller,apiKey,mData)
  	{
  		try{

  			if(typeof mData == "string")
            {
                data = mData.replace("\\", "");
                data = JSON.parse(data);
            }
            else
            	data = mData;

               
  			var resultSet = [];;
  			var userExists = apiUsers.findOne({"apiUser":caller,"apiKey":apiKey});

  			var matchDate = new Date(data.matchDate);

  			if(userExists)
  			{
  				if(userExists.userId)
  				{
  					var userId = userExists.userId;
  					var queryForDate2 = {$nin:[null]};
		    
				    var losingStrokesInfo = losingStrokes.findOne({});
				    var losingStrokesList = [];
			      	if(losingStrokesInfo)
			        	losingStrokesList = losingStrokesInfo.losingStrokes;


			        var luckyShots = [];
				  	luckyShots.push("TE");
				  	luckyShots.push("NET");
				  	luckyShotsRegEx = luckyShots.map(function (e) { return new RegExp(e+"$", "i"); });

		      		///^BH-C/i

			        var raw = strokes.rawCollection();
		      		var distinct = Meteor.wrapAsync(raw.distinct, raw);
		      		var strokesInfo = distinct('strokeShortCode',{"strokeStyle":"offensive"});

  					//var sequenceList = sequenceDataRecord.find({"loggerId":userExists.userId}).fetch();
  					//if(sequenceList.length > 0)
  					//{
  						//for(var i=0; i< sequenceList.length;i++)
  						//{
  							var player1ID = data.player1Id;
  							var player2ID = data.player2Id;
  							var player1Name = data.player1Name;
  							var player2Name = data.player2Name;
  							var json = {};
  							json["playerAName"] = player1Name;
  							json["playerBName"] = player2Name;


  							/***** service fault ****************/
	     		   			                			       
							playerASF = sequenceDataRecord.aggregate([
								{$match:
								    {$or:[
								       {
									        "loggerId":userId,
										    "player1Id":player1ID,"player2Id":player2ID,
										    sequence: { $elemMatch: {"analyticsCache.serviceBy": {$in:[player1Name,player1ID]}}},
										    sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:0}}},
										    "sequence.sequenceRecordDate" :  queryForDate2,
										    sequence: { $elemMatch: {"analyticsCache.winner": {$nin:[player1Name,player1ID]}}},
										    "sequence.matchDate" : matchDate
										},
										{
										    "loggerId":userId,
										    "player2Id":player1ID,"player1Id":player2ID,
										    sequence: { $elemMatch: {"analyticsCache.serviceBy": {$in:[player1Name,player1ID]}}},
										    sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:0}}},
										    "sequence.sequenceRecordDate" :  queryForDate2,
										    sequence: { $elemMatch: {"analyticsCache.winner": {$nin:[player1Name,player1ID]}}},
											"sequence.matchDate" : matchDate

										}
									]}	
								},
								{$unwind:"$sequence"},
								{$match:{
									"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
									"sequence.analyticsCache.sequenceLen": {$eq:0},
									"sequence.sequenceRecordDate" :  queryForDate2,
									"sequence.analyticsCache.winner":{$nin:[player1Name,player1ID]},
									"sequence.matchDate" : matchDate

								}},
								{$group:{
								 	"_id":	null,			 
									"playerACount":{$sum:1},
								}}
							]);  

							playerBSF = sequenceDataRecord.aggregate([
								{$match:
								    {$or:[
								       	{
									        "loggerId":userId,
										    "player1Id":player1ID,"player2Id":player2ID,
										    sequence: { $elemMatch: {"analyticsCache.serviceBy": {$in:[player2Name,player2ID]}}},
										    sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:0}}},
										    "sequence.sequenceRecordDate" :  queryForDate2,
										    sequence: { $elemMatch: {"analyticsCache.winner": {$nin:[player2Name,player2ID]}}},
										    "sequence.matchDate" : matchDate

										},
										{
										    "loggerId":userId,
										    "player2Id":player1ID,"player1Id":player2ID,
										    sequence: { $elemMatch: {"analyticsCache.serviceBy": {$in:[player2Name,player2ID]}}},
										    sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:0}}},
										    "sequence.sequenceRecordDate" :  queryForDate2,
										    sequence: { $elemMatch: {"analyticsCache.winner": {$nin:[player2Name,player2ID]}}},
										    "sequence.matchDate" : matchDate

										}
									]}	
								},
								{$unwind:"$sequence"},
								{$match:{
									"sequence.analyticsCache.serviceBy": {$in:[player2Name,player2ID]}, //doubt
									"sequence.analyticsCache.sequenceLen": {$eq:0},
									"sequence.sequenceRecordDate" :  queryForDate2,
									"sequence.analyticsCache.winner":{$nin:[player2Name,player2ID]},
									"sequence.matchDate" : matchDate

								}},
								{$group:{
								 	"_id":	null,			 
									"playerBCount":{$sum:1},
								}}

							]); 

							var playerJson = {};
							var playerACount = 0;
							var playerBCount = 0;
							if(playerASF[0] && playerASF[0].playerACount)
								playerACount = playerASF[0].playerACount;
							if(playerBSF[0] && playerBSF[0].playerBCount)
								playerBCount = playerBSF[0].playerBCount;

							playerJson["playerACount"] = playerACount;
							playerJson["playerBCount"] = playerBCount;


							json["serviceFault"] = playerJson;


						  	/***** service points ****************/

						  	playerASP = sequenceDataRecord.aggregate([
								{$match:
								    {$or:[
									    {
										    "loggerId":userId,
											"player1Id":player1ID,"player2Id":player2ID,							  
											sequence: { $elemMatch: {"analyticsCache.serviceBy": {$in:[player1Name,player1ID]}}},
											sequence: { $elemMatch: {"analyticsCache.serviceWin": "yes"}},
											sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:1}}},
											"sequence.sequenceRecordDate":queryForDate2,
											"sequence.matchDate" : matchDate
		        				        						        
									    },
									    {
											"loggerId":userId,
									        "player1Id":player2ID,"player2Id":player1ID,
									        sequence: { $elemMatch: {"analyticsCache.serviceBy": {$in:[player1Name,player1ID]}}},
											sequence: { $elemMatch: {"analyticsCache.serviceWin": "yes"}},
											sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:1}}},
									        "sequence.sequenceRecordDate":queryForDate2,
									        "sequence.matchDate" : matchDate
		        				        						        
									    }
								    ]}
								},
								{$unwind:"$sequence"},
								{$match:{
									"sequence.analyticsCache.sequenceLen": {$eq:1},
									"sequence.analyticsCache.serviceWin": "yes",
									"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
									"sequence.sequenceRecordDate":queryForDate2,
									"sequence.matchDate" : matchDate
		        				        						        
								}}, 
							 	{$group:{
								 	"_id":null,
									"playerACount":{$sum:1},
								}}
							]);		

							playerBSP = sequenceDataRecord.aggregate([
								{$match:
								    {$or:[
									    {
										    "loggerId":userId,
											"player1Id":player1ID,"player2Id":player2ID,							  
											sequence: { $elemMatch: {"analyticsCache.serviceBy": {$in:[player2Name,player2ID]}}},
											sequence: { $elemMatch: {"analyticsCache.serviceWin": "yes"}},
											sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:1}}},
											"sequence.sequenceRecordDate":queryForDate2,
											"sequence.matchDate" : matchDate
	        				        						        
									    },
									    {
											"loggerId":userId,
									        "player1Id":player2ID,"player2Id":player1ID,
									        sequence: { $elemMatch: {"analyticsCache.serviceBy": {$in:[player2Name,player2ID]}}},
											sequence: { $elemMatch: {"analyticsCache.serviceWin": "yes"}},
											sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:1}}},
									        "sequence.sequenceRecordDate":queryForDate2,
									        "sequence.matchDate" : matchDate
	        				        						        
									    }
								    ]}
								},
								{$unwind:"$sequence"},
								{$match:{
									"sequence.analyticsCache.sequenceLen": {$eq:1},
									"sequence.analyticsCache.serviceWin": "yes",
									"sequence.analyticsCache.serviceBy": {$in:[player2Name,player2ID]},
									"sequence.sequenceRecordDate":queryForDate2,
									"sequence.matchDate" : matchDate
		        				        						        
								}}, 
							 	{$group:{
								 	"_id":null,
									"playerBCount":{$sum:1},
								}}
							]);	

							var playerJson = {};
							var playerACount = 0;
							var playerBCount = 0;
							if(playerASP[0] && playerASP[0].playerACount)
								playerACount = playerASP[0].playerACount;
							if(playerBSP[0] && playerBSP[0].playerBCount)
								playerBCount = playerBSP[0].playerBCount;

							playerJson["playerACount"] = playerACount;
							playerJson["playerBCount"] = playerBCount;

							json["servicePoints"] = playerJson;

							/************ receive points *******************/

							playerARP = sequenceDataRecord.aggregate([
								{$match:
								    {$or:[
								        {
										    "loggerId":userId,
										    "player1Id":player1ID,"player2Id":player2ID,
											sequence: { $elemMatch: {"analyticsCache.serviceBy": {"$nin":[player1Name,player1ID]}}},
										    sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:2}}},
										    "sequence.sequenceRecordDate" :  queryForDate2,
										    "sequence.matchDate" : matchDate

								        },
								        {
								        	"loggerId":userId,
								        	"player2Id":player1ID,"player1Id":player2ID,
									        sequence: { $elemMatch: {"analyticsCache.serviceBy": {"$nin":[player1Name,player1ID]}}},
								        	sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:2}}},
										    "sequence.sequenceRecordDate" :  queryForDate2,
										    "sequence.matchDate" : matchDate
								        }
								    ]}		        	
								},
								{$unwind:"$sequence"},
								{$match:{
									"sequence.matchDate" : matchDate
								}},
								{$unwind:"$sequence.strokesPlayed"},
								{ $match: { 
								    "sequence.sequenceRecordDate" :  queryForDate2,
								    "sequence.strokesPlayed.strokePlayed":{"$in":[player1Name,player1ID]},
								    "sequence.analyticsCache.serviceBy": {"$nin":[player1Name,player1ID]},
									"sequence.analyticsCache.sequenceLen": {$eq:2},
									"sequence.matchDate" : matchDate
								}},
								{$group:{
							 		"_id":null,	 		
									"playerACount":{$sum:1},
								}}
							]);	

							playerBRP = sequenceDataRecord.aggregate([
								{$match:
								    {$or:[
								        {
										    "loggerId":userId,
										    "player1Id":player1ID,"player2Id":player2ID,
											sequence: { $elemMatch: {"analyticsCache.serviceBy": {"$nin":[player2Name,player2ID]}}},
										    sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:2}}},
										    "sequence.sequenceRecordDate" :  queryForDate2,
										    "sequence.matchDate" : matchDate

								        },
								        {
								        	"loggerId":userId,
								        	"player2Id":player1ID,"player1Id":player2ID,
									        sequence: { $elemMatch: {"analyticsCache.serviceBy": {"$nin":[player1Name,player2ID]}}},
								        	sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:2}}},
										    "sequence.sequenceRecordDate" :  queryForDate2,
										    "sequence.matchDate" : matchDate

								        }
								    ]}		        	
								},
								{$unwind:"$sequence"},
								{$match:{
									"sequence.matchDate" : matchDate
								}},
								{$unwind:"$sequence.strokesPlayed"},
								{ $match: { 
								    "sequence.sequenceRecordDate" :  queryForDate2,
								    "sequence.strokesPlayed.strokePlayed":{"$in":[player2Name,player2ID]},
								    "sequence.analyticsCache.serviceBy": {"$nin":[player2Name,player2ID]},
									"sequence.analyticsCache.sequenceLen": {$eq:2},
									"sequence.matchDate" : matchDate
								}},
								{$group:{
							 		"_id":null,	 		
									"playerBCount":{$sum:1},
								}}
							]);	
							var playerJson = {};
							var playerACount = 0;
							var playerBCount = 0;
							if(playerARP[0] && playerARP[0].playerACount)
								playerACount = playerARP[0].playerACount;
							if(playerBRP[0] && playerBRP[0].playerBCount)
								playerBCount = playerBRP[0].playerBCount;
							
							playerJson["playerACount"] = playerACount;
							playerJson["playerBCount"] = playerBCount;
							json["receivePoints"] = playerJson;

							/************* service loss ********************/
							playerASL = sequenceDataRecord.aggregate([
								{$match:
								    {$or:[
								       	{
									        "loggerId":userId,
										    "player1Id":player1ID,"player2Id":player2ID,
										    sequence: { $elemMatch: {"analyticsCache.serviceBy": {"$in":[player1Name,player1ID]}}},
										    sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:2}}},
										    "sequence.sequenceRecordDate" :  queryForDate2,
										    "sequence.matchDate" : matchDate
										},
										{
										    "loggerId":userId,
										    "player2Id":player1ID,"player1Id":player2ID,
										    sequence: { $elemMatch: {"analyticsCache.serviceBy": {"$in":[player1Name,player1ID]}}},
										    sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:2}}},
										    "sequence.sequenceRecordDate" :  queryForDate2,
										    "sequence.matchDate" : matchDate
										}
									]}	
								},
								{$unwind:"$sequence"},
								{$match:{
									"sequence.analyticsCache.serviceBy": {"$in":[player1Name,player1ID]},
									"sequence.analyticsCache.sequenceLen": {$eq:2},
									"sequence.sequenceRecordDate" :  queryForDate2,
									"sequence.matchDate" : matchDate
								}},
								{$group:{
								 	"_id":null,			 	
									"playerACount":{$sum:1},
								}}
								
							]);

							playerBSL = sequenceDataRecord.aggregate([
								{$match:
								    {$or:[
								       	{
									        "loggerId":userId,
										    "player1Id":player1ID,"player2Id":player2ID,
										    sequence: { $elemMatch: {"analyticsCache.serviceBy": {"$in":[player2Name,player2ID]}}},
										    sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:2}}},
										    "sequence.sequenceRecordDate" :  queryForDate2,
										    "sequence.matchDate" : matchDate
										},
										{
										    "loggerId":userId,
										    "player2Id":player1ID,"player1Id":player2ID,
										    sequence: { $elemMatch: {"analyticsCache.serviceBy": {"$in":[player2Name,player2ID]}}},
										    sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:2}}},
										    "sequence.sequenceRecordDate" :  queryForDate2,
										    "sequence.matchDate" : matchDate
										}
									]}	
								},
								{$unwind:"$sequence"},
								{$match:{
									"sequence.analyticsCache.serviceBy": {"$in":[player2Name,player2ID]},
									"sequence.analyticsCache.sequenceLen": {$eq:2},
									"sequence.sequenceRecordDate" :  queryForDate2,
									"sequence.matchDate" : matchDate
								}},
								{$group:{
								 	"_id":null,			 	
									"playerBCount":{$sum:1},
								}}
								
							]);    
							
							var playerJson = {};
							var playerACount = 0;
							var playerBCount = 0;
							if(playerASL[0] && playerASL[0].playerACount)
								playerACount = playerASL[0].playerACount;
							if(playerBSL[0] && playerBSL[0].playerBCount)
								playerBCount = playerBSL[0].playerBCount;
							
							playerJson["playerACount"] = playerACount;
							playerJson["playerBCount"] = playerBCount;
							json["serviceLoss"] = playerJson;

							/*********** errors *************************/
							playerAError = sequenceDataRecord.aggregate([
						        {$match:
						            {$or:[
						            	{
						            		"loggerId":userId,
						            		"player1Id":player1ID,"player2Id":player2ID,
						            		"sequence.analyticsCache.sequenceLen":{$gte:3},
											"sequence.sequenceRecordDate" :  queryForDate2,
											"sequence.matchDate":matchDate
										},
										{
											"loggerId":userId,
											"player2Id":player1ID,"player1Id":player2ID,
						            		"sequence.analyticsCache.sequenceLen":{$gte:3},
						            		"sequence.sequenceRecordDate" :  queryForDate2,
											"sequence.matchDate":matchDate

										}
									]}
								},
						        {$unwind:"$sequence"},
						        {$match:{
						        	"sequence.analyticsCache.sequenceLen": {$gte:3},
						        	"sequence.matchDate":matchDate


						        }},
						        {$unwind:"$sequence.strokesPlayed"},
						        {$match: {"sequence.strokesPlayed.strokePlayed": {$in:[player1Name,player1ID]},
						            "sequence.strokesPlayed.strokeDestination":{$in:losingStrokesList},
						            "sequence.sequenceRecordDate" :  queryForDate2,
						            "sequence.strokesPlayed.previousDestination":{$nin:["",null]},
						        }},
						        {$group:{
						        	"_id":null,         		
						            "playerACount":{$sum:1}
						        }}	      
				            ]);	

							playerBError = sequenceDataRecord.aggregate([
						        {$match:
						            {$or:[
						            	{
						            		"loggerId":userId,
						            		"player1Id":player1ID,"player2Id":player2ID,
						            		"sequence.analyticsCache.sequenceLen":{$gte:3},
											"sequence.sequenceRecordDate" :  queryForDate2,
											"sequence.matchDate":matchDate

										},
										{
											"loggerId":userId,
											"player2Id":player1ID,"player1Id":player2ID,
						            		"sequence.analyticsCache.sequenceLen":{$gte:3},
						            		"sequence.sequenceRecordDate" :  queryForDate2,
						            		"sequence.matchDate":matchDate
										}
									]}
								},
						        {$unwind:"$sequence"},
						        {$match:{
						        	"sequence.analyticsCache.sequenceLen": {$gte:3},
						        	"sequence.matchDate":matchDate

						        }},
						        {$unwind:"$sequence.strokesPlayed"},
						        {$match: {
						        	"sequence.strokesPlayed.strokePlayed": {$in:[player2Name,player2ID]},
						            "sequence.strokesPlayed.strokeDestination":{$in:losingStrokesList},
						            "sequence.sequenceRecordDate" :  queryForDate2,
						            "sequence.strokesPlayed.previousDestination":{$nin:["",null]},
						        }},
						        {$group:{
						        	"_id":null,         		
						            "playerBCount":{$sum:1}
						        }}
						        
				            ]);	

							var playerJson = {};
							var playerACount = 0;
							var playerBCount = 0;
							if(playerAError[0] && playerAError[0].playerACount)
								playerACount = playerAError[0].playerACount;
							if(playerBError[0] && playerBError[0].playerBCount)
								playerBCount = playerBError[0].playerBCount;

							playerJson["playerACount"] = playerACount;
							playerJson["playerBCount"] = playerBCount;
							json["error"] = playerJson;


							/************* winner points **************/
							regex = strokesInfo.map(function (e) { return new RegExp('^' +e, "i"); });

							var playerACheck = sequenceDataRecord.findOne({
								"loggerId":userId,
							    "player1Id":player1ID,
							    "player2Id":player2ID});
							
							if(playerACheck)
							{
								playerAWP = sequenceDataRecord.aggregate([
							        {$match:{"loggerId":userId,
							            "player1Id":player1ID,"player2Id":player2ID,
							            "sequence.analyticsCache.sequenceLen":{$gte:3},
							            "sequence.sequenceRecordDate" :  queryForDate2,
							            "sequence.matchDate" : matchDate
							        }},
							        {$unwind:"$sequence"},
							        {$match:{
							        	"sequence.matchDate":matchDate
							        }},
							        {$unwind:"$sequence.analyticsCache.strokeSum"},        
							        {$match: { 
							        	"sequence.sequenceRecordDate" :  queryForDate2,
							           	"sequence.analyticsCache.strokeSum.p1Count":{$gt:0},	     
							            "sequence.analyticsCache.strokeSum.p1Win":{$gt:0},
							            "sequence.analyticsCache.strokeSum.strokeKey":{$in:regex},
							            "sequence.matchDate" : matchDate
							        }},
							        {$group:{
							        	"_id":null,
							            "count":{$sum:"$sequence.analyticsCache.strokeSum.p1Win"},
							        }},
							        {$project:{
							            "_id":0,"count":1
							        }}
						        ]);

						        playerBWP = sequenceDataRecord.aggregate([
							        {$match:{"loggerId":userId,
							            "player1Id":player1ID,"player2Id":player2ID,
							            "sequence.analyticsCache.sequenceLen":{$gte:3},
							            "sequence.sequenceRecordDate" :  queryForDate2,
							            "sequence.matchDate" : matchDate
							        }},
							        {$unwind:"$sequence"},
							        {$match:{
							        	"sequence.matchDate":matchDate
							        }},
							        {$unwind:"$sequence.analyticsCache.strokeSum"},        
							        {$match: { 
							        	"sequence.sequenceRecordDate" :  queryForDate2,
							           	"sequence.analyticsCache.strokeSum.p2Count":{$gt:0},	     
							            "sequence.analyticsCache.strokeSum.p2Win":{$gt:0},
							            "sequence.analyticsCache.strokeSum.strokeKey":{$in:regex},
							            "sequence.matchDate" : matchDate
							        }},
							        {$group:{
							        	"_id":null,
							            "count":{$sum:"$sequence.analyticsCache.strokeSum.p2Win"},
							        }},
							        {$project:{
							            "_id":0,"count":1
							        }}
						        ]);

							}
							else
							{
								playerAWP = sequenceDataRecord.aggregate([
							        {$match:{"loggerId":userId,
							            "player1Id":player2ID,"player2Id":player1ID,
							            "sequence.analyticsCache.sequenceLen":{$gte:3},
							            "sequence.sequenceRecordDate" :  queryForDate2,
							            "sequence.matchDate" : matchDate
							       	}},
							        {$unwind:"$sequence"},
							        {$match:{
							        	"sequence.matchDate":matchDate
							        }},
							        {$unwind:"$sequence.analyticsCache.strokeSum"},
							        {$match: { "sequence.sequenceRecordDate" :  queryForDate2,
							            "sequence.analyticsCache.strokeSum.p2Count":{$gt:0},
							            "sequence.analyticsCache.strokeSum.strokeKey":{$in:regex},
										"sequence.analyticsCache.strokeSum.p2Win":{$gt:0},	    
										"sequence.matchDate" : matchDate       
							        }},
							        {$group:{
							        	"_id":null,
							            "count":{$sum:"$sequence.analyticsCache.strokeSum.p2Win"},
							        }},
							        {$project:{
							            "_id":0,"count":1,
							        }}
						        ]);

						        playerBWP = sequenceDataRecord.aggregate([
							        {$match:{"loggerId":userId,
							            "player1Id":player2ID,"player2Id":player1ID,
							            "sequence.analyticsCache.sequenceLen":{$gte:3},
							            "sequence.sequenceRecordDate" :  queryForDate2,
							            "sequence.matchDate" : matchDate
							       	}},
							        {$unwind:"$sequence"},
							        {$match:{
							        	"sequence.matchDate":matchDate
							        }},
							        {$unwind:"$sequence.analyticsCache.strokeSum"},
							        {$match: { "sequence.sequenceRecordDate" :  queryForDate2,
							            "sequence.analyticsCache.strokeSum.p1Count":{$gt:0},
							            "sequence.analyticsCache.strokeSum.strokeKey":{$in:regex},
										"sequence.analyticsCache.strokeSum.p1Win":{$gt:0},	 
										"sequence.matchDate" : matchDate          
							        }},
							        {$group:{
							        	"_id":null,
							            "count":{$sum:"$sequence.analyticsCache.strokeSum.p1Win"},
							        }},
							        {$project:{
							            "_id":0,"count":1,
							        }}
						        ]);
							}

							

							var playerJson = {};
							var playerACount = 0;
							var playerBCount = 0;
							if(playerAWP[0] && playerAWP[0].count)
								playerACount = playerAWP[0].count;
							if(playerBWP[0] && playerBWP[0].count)
								playerBCount = playerBWP[0].count;

							
							playerJson["playerACount"] = playerACount;
							playerJson["playerBCount"] = playerBCount;
							json["winnerPoints"] = playerJson;

				  			/************* lucky points **************/

							var playerACheck = sequenceDataRecord.findOne({
								"loggerId":userId,
							    "player1Id":player1ID,
							    "player2Id":player2ID});
							
							if(playerACheck)
							{
								
     							playerALP = sequenceDataRecord.aggregate([
							        {$match:{"loggerId":userId,
							            "player1Id":player1ID,"player2Id":player2ID,
							            "sequence.analyticsCache.sequenceLen":{$gte:1},
							            "sequence.sequenceRecordDate" :  queryForDate2,
							            "sequence.analyticsCache.winner":{$in:[player1Name,player1ID]},
							            "sequence.matchDate" : matchDate

							        }},
							        {$unwind:"$sequence"},
							        {$match:{
							        	"sequence.matchDate":matchDate
							        }},
							        {$unwind:"$sequence.analyticsCache.strokeSum"},        
							        {$match: { 
							        	"sequence.sequenceRecordDate" :  queryForDate2,
							           	"sequence.analyticsCache.strokeSum.p2Count":{$gt:0},	     
							            "sequence.analyticsCache.strokeSum.p2Loss":{$gt:0},
							            "sequence.analyticsCache.strokeSum.strokeKey":{$in:[/NET/]},
							        	"sequence.analyticsCache.winner":{$in:[player1Name,player1ID]},
							        	"sequence.matchDate" : matchDate
							        }},
							        {$group:{
							        	"_id":null,
							            "count":{$sum:"$sequence.analyticsCache.strokeSum.p2Loss"},
							        }},
							        {$project:{
							            "_id":0,"count":1
							        }}
						        ]);

								playerALP1 = sequenceDataRecord.aggregate([
							        {$match:{"loggerId":userId,
							            "player1Id":player1ID,"player2Id":player2ID,
							            "sequence.analyticsCache.sequenceLen":{$gte:1},
							            "sequence.sequenceRecordDate" :  queryForDate2,
							            "sequence.analyticsCache.winner":{$in:[player1Name,player1ID]},
							            "sequence.matchDate" : matchDate

							        }},
							        {$unwind:"$sequence"},
							        {$match:{
							        	"sequence.matchDate":matchDate
							        }},
							        {$unwind:"$sequence.analyticsCache.strokeSum"},        
							        {$match: { 	        	
							        	$or:[
							        	{
							        		"sequence.analyticsCache.strokeSum.p1Count":{$gt:0},	     
							            	"sequence.analyticsCache.strokeSum.p1Win":{$gt:0},
							            	"sequence.analyticsCache.strokeSum.strokeKey":{$in:luckyShotsRegEx},
							        		"sequence.matchDate" : matchDate
							        	},
							        	{
							        		"sequence.analyticsCache.strokeSum.p2Count":{$gt:0},	     
							            	"sequence.analyticsCache.strokeSum.p2Loss":{$gt:0},
							            	"sequence.analyticsCache.strokeSum.strokeKey":{$in:["Unknown-Unknown"]},
							        		"sequence.matchDate" : matchDate
							        	}
							        	]
							           	,
							        	"sequence.analyticsCache.winner":{$in:[player1Name,player1ID]}
							        }},
							        {$group:{
							        	"_id":null,
							            "count":{$sum:"$sequence.analyticsCache.strokeSum.p1Win"},
							        }},
							        {$project:{
							            "_id":0,"count":1
							        }}
						        ]);


						        playerBLP = sequenceDataRecord.aggregate([
							        {$match:{"loggerId":userId,
							            "player1Id":player1ID,"player2Id":player2ID,
							            "sequence.analyticsCache.sequenceLen":{$gte:1},
							            "sequence.sequenceRecordDate" :  queryForDate2,
							            "sequence.analyticsCache.winner":{$in:[player2Name,player2ID]},
							            "sequence.matchDate" : matchDate

							        }},
							        {$unwind:"$sequence"},
							        {$match:{
							        	"sequence.matchDate" : matchDate
							        }},
							        {$unwind:"$sequence.analyticsCache.strokeSum"},        
							        {$match: { 
							        	"sequence.sequenceRecordDate" :  queryForDate2,
							           	"sequence.analyticsCache.strokeSum.p1Count":{$gt:0},	     
							            "sequence.analyticsCache.strokeSum.p1Loss":{$gt:0},
							            "sequence.analyticsCache.strokeSum.strokeKey":{$in:[/NET/]},
							        	"sequence.analyticsCache.winner":{$in:[player2Name,player2ID]},
							        	"sequence.matchDate" : matchDate

							        }},
							        {$group:{
							        	"_id":null,
							            "count":{$sum:"$sequence.analyticsCache.strokeSum.p1Loss"},
							        }},
							        {$project:{
							            "_id":0,"count":1
							        }}
						        ]);


								playerBLP1 = sequenceDataRecord.aggregate([
							        {$match:{"loggerId":userId,
							            "player1Id":player1ID,"player2Id":player2ID,
							            "sequence.analyticsCache.sequenceLen":{$gte:1},
							            "sequence.sequenceRecordDate" :  queryForDate2,
							            "sequence.analyticsCache.winner":{$in:[player2Name,player2ID]},
										"sequence.matchDate" : matchDate
							        }},
							        {$unwind:"$sequence"},
							        {$match:{
							        	"sequence.matchDate" : matchDate
							        }},
							        {$unwind:"$sequence.analyticsCache.strokeSum"},        
							        {$match: { 	        	
							        	$or:[
							        	{
							        		"sequence.analyticsCache.strokeSum.p2Count":{$gt:0},	     
							            	"sequence.analyticsCache.strokeSum.p2Win":{$gt:0},
							            	"sequence.analyticsCache.strokeSum.strokeKey":{$in:luckyShotsRegEx}
							        	},
							        	{
							        		"sequence.analyticsCache.strokeSum.p1Count":{$gt:0},	     
							            	"sequence.analyticsCache.strokeSum.p1Loss":{$gt:0},
							            	"sequence.analyticsCache.strokeSum.strokeKey":{$in:["Unknown-Unknown"]}
							        	}
							        	]
							           	,
							        	"sequence.analyticsCache.winner":{$in:[player2Name,player2ID]}
							        }},
							        {$group:{
							        	"_id":null,
							            "count":{$sum:"$sequence.analyticsCache.strokeSum.p2Win"},
							        }},
							        {$project:{
							            "_id":0,"count":1
							        }}
						        ]);

							}
							else
							{

								playerBLP = sequenceDataRecord.aggregate([
							        {$match:{"loggerId":userId,
							            "player1Id":player2ID,"player2Id":player1ID,
							            "sequence.analyticsCache.sequenceLen":{$gte:1},
							            "sequence.sequenceRecordDate" :  queryForDate2,
							            "sequence.analyticsCache.winner":{$in:[player2Name,player2ID]},
							        	"sequence.matchDate" : matchDate

							       	}},
							        {$unwind:"$sequence"},
							        {$match:{
							        	"sequence.matchDate" : matchDate
							        }},
							        {$unwind:"$sequence.analyticsCache.strokeSum"},
							        {$match: { "sequence.sequenceRecordDate" :  queryForDate2,
							            "sequence.analyticsCache.strokeSum.p2Count":{$gt:0},
							            "sequence.analyticsCache.strokeSum.strokeKey":{$in:[/NET/]},
										"sequence.analyticsCache.strokeSum.p2Loss":{$gt:0},	 
										"sequence.analyticsCache.winner":{$in:[player2Name,player2ID]}
          
							        }},
							        {$group:{
							        	"_id":null,
							            "count":{$sum:"$sequence.analyticsCache.strokeSum.p2Loss"},
							        }},
							        {$project:{
							            "_id":0,"count":1,
							        }}
						        ]);

								playerBLP1 = sequenceDataRecord.aggregate([
							        {$match:{"loggerId":userId,
							            "player1Id":player2ID,"player2Id":player1ID,
							            "sequence.analyticsCache.sequenceLen":{$gte:1},
							            "sequence.sequenceRecordDate" :  queryForDate2,
							            "sequence.analyticsCache.winner":{$in:[player2Name,player2ID]},
							        	"sequence.matchDate" : matchDate

							       	}},
							        {$unwind:"$sequence"},
							        {$match:{
							        	"sequence.matchDate" : matchDate
							        }},
							        {$unwind:"$sequence.analyticsCache.strokeSum"},
							        {$match: { 
							        	"sequence.sequenceRecordDate" :  queryForDate2,
										"sequence.analyticsCache.winner":{$in:[player2Name,player2ID]},
										$or:[
							        	{
							        		"sequence.analyticsCache.strokeSum.p1Count":{$gt:0},	     
							            	"sequence.analyticsCache.strokeSum.p1Win":{$gt:0},
							            	"sequence.analyticsCache.strokeSum.strokeKey":{$in:luckyShotsRegEx}
							        	},
							        	{
							        		"sequence.analyticsCache.strokeSum.p2Count":{$gt:0},	     
							            	"sequence.analyticsCache.strokeSum.p2Loss":{$gt:0},
							            	"sequence.analyticsCache.strokeSum.strokeKey":{$in:["Unknown-Unknown"]}
							        	}]
          
							        }},
							        {$group:{
							        	"_id":null,
							            "count":{$sum:"$sequence.analyticsCache.strokeSum.p1Win"},
							        }},
							        {$project:{
							            "_id":0,"count":1,
							        }}
						        ]);

						        playerALP = sequenceDataRecord.aggregate([
							        {$match:{"loggerId":userId,
							            "player1Id":player2ID,"player2Id":player1ID,
							            "sequence.analyticsCache.sequenceLen":{$gte:1},
							            "sequence.sequenceRecordDate" :  queryForDate2,
							            "sequence.analyticsCache.winner":{$in:[player1Name,player1ID]},
							       		"sequence.matchDate" : matchDate

							       	}},
							        {$unwind:"$sequence"},
							        {$match:{
							        	"sequence.matchDate" : matchDate
							        }},
							        {$unwind:"$sequence.analyticsCache.strokeSum"},
							        {$match: { "sequence.sequenceRecordDate" :  queryForDate2,
							            "sequence.analyticsCache.strokeSum.p1Count":{$gt:0},
							            "sequence.analyticsCache.strokeSum.strokeKey":{$in:[/NET/]},
										"sequence.analyticsCache.strokeSum.p1Loss":{$gt:0},	  
										"sequence.analyticsCache.winner":{$in:[player1Name,player1ID]}
         
							        }},
							        {$group:{
							        	"_id":null,
							            "count":{$sum:"$sequence.analyticsCache.strokeSum.p1Loss"},
							        }},
							        {$project:{
							            "_id":0,"count":1,
							        }}
						        ]);

								playerALP1 = sequenceDataRecord.aggregate([
							        {$match:{"loggerId":userId,
							            "player1Id":player2ID,"player2Id":player1ID,
							            "sequence.analyticsCache.sequenceLen":{$gte:1},
							            "sequence.sequenceRecordDate" :  queryForDate2,
							            "sequence.analyticsCache.winner":{$in:[player1Name,player1ID]},
							       		"sequence.matchDate" : matchDate

							       	}},
							        {$unwind:"$sequence"},
							        {$match:{
							        	"sequence.matchDate" : matchDate
							        }},
							        {$unwind:"$sequence.analyticsCache.strokeSum"},
							        {$match: { "sequence.sequenceRecordDate" :  queryForDate2,
							           
										"sequence.analyticsCache.winner":{$in:[player1Name,player1ID]},
										$or:[
							        	{
							        		"sequence.analyticsCache.strokeSum.p2Count":{$gt:0},	     
							            	"sequence.analyticsCache.strokeSum.p2Win":{$gt:0},
							            	"sequence.analyticsCache.strokeSum.strokeKey":{$in:luckyShotsRegEx}
							        	},
							        	{
							        		"sequence.analyticsCache.strokeSum.p1Count":{$gt:0},	     
							            	"sequence.analyticsCache.strokeSum.p1Loss":{$gt:0},
							            	"sequence.analyticsCache.strokeSum.strokeKey":{$in:["Unknown-Unknown"]}
							        	}
							        	]
         
							        }},
							        {$group:{
							        	"_id":null,
							            "count":{$sum:"$sequence.analyticsCache.strokeSum.p2Win"},
							        }},
							        {$project:{
							            "_id":0,"count":1,
							        }}
						        ]);


							}
							var playerJson = {};
							var playerACount = 0;
							var playerBCount = 0;
							if(playerALP[0] && playerALP[0].count)
								playerACount += playerALP[0].count;
							if(playerALP1[0] && playerALP1[0].count)
								playerACount += playerALP1[0].count;
							if(playerBLP[0] && playerBLP[0].count)
								playerBCount += playerBLP[0].count;
							if(playerBLP1[0] && playerBLP1[0].count)
								playerBCount += playerBLP1[0].count;
							playerJson["playerACount"] = playerACount;
							playerJson["playerBCount"] = playerBCount;
						    json["luckyPoints"] = playerJson;

						    resultSet.push(json);



  						//}
  					//}

  					

  				}
  				else
  				{
  					var resultJson = {};
  					resultJson["status"] = "failure";
  					resultJson["response"] = "Invalid User";
  					return resultJson;

  				}
  			};


			var resultJson = {};
  			resultJson["status"] = "success";
  			resultJson["response"] = "User Exists";
  			resultJson["data"] = resultSet;

  			return resultJson;

    	}catch(e){
    	}
  	},
  	


})