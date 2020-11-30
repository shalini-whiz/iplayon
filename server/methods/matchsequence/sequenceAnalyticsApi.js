
function computeDateFilter(dateFilter)
{
	var lastWeek = new Date();
	lastWeek.setDate(lastWeek.getDate() -7);

	var lastMonth = new Date();
	lastMonth.setMonth(lastMonth.getMonth() -1);

	var lastThreeMonths = new Date();
	lastThreeMonths.setMonth(lastThreeMonths.getMonth() - 3);

	var lastYear = new Date();
	lastYear.setFullYear(lastYear.getFullYear()  - 1);
		 
	var dateQuery = "";
	if(dateFilter == "Since" || dateFilter == "None" || dateFilter == "Any time")
		dateQuery = "";
	else if(dateFilter == "Beginning")
		dateQuery = "";
	else if(dateFilter == "Last Week")
		dateQuery = lastWeek;
	else if(dateFilter == "Last 3 Months")
		dateQuery = lastThreeMonths;
	else if(dateFilter == "Last Month")
		dateQuery = lastMonth;
	return dateQuery;

}


Meteor.methods({

	fetchSummarizedSequence:function(userId,data)
  	{
    	try
    	{
	      	var player1Name = data.player1Name;
	      	var player2Name = data.player2Name;
	      	var player1ID =  data.player1ID;
      		var player2ID = data.player2ID;
	      	var sort = data.sortFilterValue;
	      	var dateFilter = data.dateFilter;
	     	dateQuery = computeDateFilter(dateFilter);
	      	var  info = "";
	      	var queryForDate2 = {$nin:[null]};
		    if(dateQuery != "")
		    {
				queryForDate2 = {$gte:dateQuery};
		    }
		    var sortQuery = "";
		    if(sort == "Win Effectiveness")		    	      
		        sortQuery = {"efficiency":1};		    
		    else if(sort == "Loss Percentage")	    
		        sortQuery = {"loss":-1};    
		    else if(sort == "Stroke Type")		    
		       	sortQuery = {"strokeKey":1};	    		    
		    else		    
		       	sortQuery = {"efficiency":1};
		    


	      	var raw = playerDetailsRecord.rawCollection();
      		var distinct = Meteor.wrapAsync(raw.distinct, raw);
      		var leftHandPlayers =  distinct('_id',{"loggerId":userId,playerHand:"LeftHand"});
      		var rightHandPlayers =  distinct('_id',{"loggerId":userId,playerHand:"RightHand"});

      		if(player2Name.trim() != "All" && player2Name.trim() != "All L/H" && player2Name.trim() != "All R/H")
	      	{
		        
		        info = sequenceDataRecord.aggregate([
			        {$match:{"loggerId":userId,
			            "player1Id":player1ID,"player2Id":player2ID,
			            "sequence.analyticsCache.sequenceLen":{$gte:3},
			            "sequence.sequenceRecordDate" :  queryForDate2
			        }},
			        {$unwind:"$sequence"},
			        {$unwind:"$sequence.analyticsCache.strokeSum"},        
			        {$match: { "sequence.sequenceRecordDate" :  queryForDate2,
			           	"sequence.analyticsCache.strokeSum.p1Count":{$gt:0},
			            $or:[
			            	{"sequence.analyticsCache.strokeSum.p1Win":{$gt:0}},
			            	{"sequence.analyticsCache.strokeSum.p1Loss":{$gt:0}}
			            ]
			        }},
			        {$group:{"_id":{"strokeKey":"$sequence.analyticsCache.strokeSum.strokeKey"},
			            "strokesPlayed":{$sum:"$sequence.analyticsCache.strokeSum.p1Count"},
			            "win":{$sum:"$sequence.analyticsCache.strokeSum.p1Win"},
			            "loss":{$sum:"$sequence.analyticsCache.strokeSum.p1Loss"}
			        }},
			        {$project:{
			            "strokeKey":"$_id.strokeKey",
			            "_id":0,"win":1,"loss":1,
			            "strokesPlayed":{$add:["$win","$loss"]},
			            "efficiency": { $cond: [ { $eq: [ "$win", 0 ] }, "0", {$multiply:[{"$divide":["$win", {$add:["$win","$loss"]}]},100]}]}

			        }},
			        {$sort:sortQuery}
		        ]);


		        info1 = sequenceDataRecord.aggregate([
			        {$match:{"loggerId":userId,
			            "player1Id":player2ID,"player2Id":player1ID,
			            "sequence.analyticsCache.sequenceLen":{$gte:3},
			            "sequence.sequenceRecordDate" :  queryForDate2
			       	}},
			        {$unwind:"$sequence"},
			        {$unwind:"$sequence.analyticsCache.strokeSum"},
			        {$match: { "sequence.sequenceRecordDate" :  queryForDate2,
			            "sequence.analyticsCache.strokeSum.p2Count":{$gt:0},
			            $or:[
			            	{"sequence.analyticsCache.strokeSum.p2Win":{$gt:0}},
			            	{"sequence.analyticsCache.strokeSum.p2Loss":{$gt:0}}
			            ]
			        }},
			        {$group:{"_id":{"strokeKey":"$sequence.analyticsCache.strokeSum.strokeKey"},
			            "strokesPlayed":{$sum:"$sequence.analyticsCache.strokeSum.p2Count"},
			            "win":{$sum:"$sequence.analyticsCache.strokeSum.p2Win"},
			            "loss":{$sum:"$sequence.analyticsCache.strokeSum.p2Loss"}
			        }},
			        {$project:{
			            "strokeKey":"$_id.strokeKey",
			            "_id":0,"win":1,"loss":1,
			            "strokesPlayed":{$add:["$win","$loss"]},
			            "efficiency": { $cond: [ { $eq: [ "$win", 0 ] }, "0", {$multiply:[{"$divide":["$win", {$add:["$win","$loss"]}]},100]}]}

			        }},
			        {$sort:sortQuery}
		        ]);

				
		        info = info.concat(info1);

		                
	      	}
	      	else if(player2Name.trim() == "All L/H" || player2Name.trim() == "All R/H" || player2Name.trim() == "All")
	      	{
	      		var handPlayers = [];
	      		var queryJson;
	      		if(player2Name.trim() == "All L/H")
	      		{
	      			handPlayers = leftHandPlayers;
	      			queryJson = {$in:handPlayers};
	      		}
	      		else if(player2Name.trim() == "All R/H")
	      		{
	      			handPlayers = rightHandPlayers;
	      			queryJson = {$in:handPlayers};
	      		}
	      		else if(player2Name.trim() == "All")
	      		{
	      			handPlayers = [null,""]
	      			queryJson = {$nin:handPlayers};
	      		}



	      		info = sequenceDataRecord.aggregate([
			        {$match:
			          	{$or:[
			          		{
			          			"loggerId":userId,
			          			"player1Id":player1ID,
			          			"player2Id":queryJson,
			         	 		"sequence.analyticsCache.sequenceLen":{$gte:3},
			         	 		"sequence.sequenceRecordDate":queryForDate2
			         	 	},
			         		{
			         			"loggerId":userId,
			         			"player2Id":player1ID,
			         			"player1Id":queryJson,
			          			"sequence.analyticsCache.sequenceLen":{$gte:3},
			          			"sequence.sequenceRecordDate":queryForDate2
			         	 	}
			         	 ]}
			         	},
			        {$unwind:"$sequence"},
			        {$unwind:"$sequence.analyticsCache.strokeSum"},
			        {$match: 
			          	{$or:[
			          		{
			          			"player1Id":player1ID,
			          			"player2Id":queryJson,
			          			"sequence.sequenceRecordDate":queryForDate2,
			          			"sequence.analyticsCache.strokeSum.p1Count":{$gt:0},
			            		$or:[
			            			{"sequence.analyticsCache.strokeSum.p1Win":{$gt:0}},
			            			{"sequence.analyticsCache.strokeSum.p1Loss":{$gt:0}}
			            		]
			          		},
			          		{
			          			"player2Id":player1ID,
			          			"player1Id":queryJson,
			          			"sequence.sequenceRecordDate":queryForDate2,
			          			"sequence.analyticsCache.strokeSum.p2Count":{$gt:0},
			            		$or:[
			            			{"sequence.analyticsCache.strokeSum.p2Win":{$gt:0}},
			            			{"sequence.analyticsCache.strokeSum.p2Loss":{$gt:0}}
			            		]
			          		}
			          	]}					
					},			            
				    {$group:{"_id":{"strokeKey":"$sequence.analyticsCache.strokeSum.strokeKey"},
				        "strokesPlayed":{$sum:{
				          		"$cond": { 
                					"if": { "$eq": [ "$player1Id", player1ID ] }, 
                					"then": "$sequence.analyticsCache.strokeSum.p1Count",
                					"else": {
                    					"$cond": {
                        					"if": { "$eq": ["$player2Id",player1ID]}, 
                        					"then": "$sequence.analyticsCache.strokeSum.p2Count", 
                        					"else": 0
                    					}
                					}
            					}			          		
				    	}},
				    	"win":{$sum:{
				        	"$cond": { 
                				"if": { "$eq": [ "$player1Id", player1ID ] }, 
                				"then": "$sequence.analyticsCache.strokeSum.p1Win",
                				"else": {
                    				"$cond": {
                        				"if": { "$eq": ["$player2Id",player1ID]}, 
                        				"then": "$sequence.analyticsCache.strokeSum.p2Win", 
                        				"else": 0
                    				}
                				}
            				}
				        }},
				        "loss":{$sum:{
    						"$cond": { 
                				"if": { "$eq": [ "$player1Id", player1ID ] }, 
                				"then": "$sequence.analyticsCache.strokeSum.p1Loss",
                				"else": {
                    				"$cond": {
                        				"if": { "$eq": ["$player2Id",player1ID]}, 
                        				"then": "$sequence.analyticsCache.strokeSum.p2Loss", 
                        				"else": 0
                    				}
                				}
            				}
				        }},			         
				    }},
				    {$project:{
				        "playerName":"$_id.playerName",
		            	"strokeKey":"$_id.strokeKey",
		            	"_id":0,"win":1,"loss":1,
		            	"strokesPlayed":{$add:["$win","$loss"]},
		            	"efficiency": { $cond: [ { $eq: [ "$win", 0 ] }, "0", {$multiply:[{"$divide":["$win", {$add:["$win","$loss"]}]},100]}]}

		        	}},
		        	{$sort:sortQuery}		        		          		
		        ]);
	      	}

		  
		    return info;
    	}catch(e){
    		errorLog(e)
    	}
  	},

  	fetchStrokeAnalysis:function(userId,data)
  	{
  		try
    	{
	      	var player1Name = data.player1Name;
	      	var player2Name = data.player2Name;
	      	var player1ID =  data.player1ID;
      		var player2ID = data.player2ID;
	      	var sort = data.sortFilterValue;
	      	var dateFilter = data.dateFilter;
	     	dateQuery = computeDateFilter(dateFilter);
	      	var  info = "";
	      	var raw = playerDetailsRecord.rawCollection();
      		var distinct = Meteor.wrapAsync(raw.distinct, raw);
      		var leftHandPlayers =  distinct('_id',{"loggerId":userId,playerHand:"LeftHand"});
      		var rightHandPlayers =  distinct('_id',{"loggerId":userId,playerHand:"RightHand"});
			var queryForDate2 = {$nin:[null]};
		    if(dateQuery != "")	    
				queryForDate2 = {$gte:dateQuery};
			var analysisType = data.analysisType;
		    if(analysisType == "App")
		    	sortQuery = {"totalPlayed":-1}
		    else
		    	sortQuery = {"totalPlayed":-1,"dataSet.played":-1}

		    var player1RegObj = new RegExp('^' +player1Name+'$', 'i');
      		if(player2Name.trim() != "All" && player2Name.trim() != "All L/H" && player2Name.trim() != "All R/H")
	      	{        	  
		        info = sequenceDataRecord.aggregate([
		            {$match:{"loggerId":userId,
		            	"player1Id":player1ID,"player2Id":player2ID,
		            	"sequence.analyticsCache.sequenceLen":{$gte:3},		        	 
		            	"sequence.sequenceRecordDate" :  queryForDate2
					}},
		            {$unwind:"$sequence"},
		            {$unwind:"$sequence.strokesPlayed"},
		            {$match: {
		            	$or:[
		            		{"sequence.strokesPlayed.strokePlayed": {$regex:player1RegObj}},
		            		{"sequence.strokesPlayed.strokePlayed": player1ID}
		            	],
		            	"sequence.sequenceRecordDate" :  queryForDate2,
		            	"sequence.strokesPlayed.previousDestination":{$nin:["",null]}
		            }},
		            {$group:{"_id":{
		            	"fromDestination":"$sequence.strokesPlayed.previousDestination",
		            	"strokeHand":"$sequence.strokesPlayed.strokeHand",
		            	"p1Set":"$sequence.playerA.set",
		            	"p1Points":"$sequence.playerA.points",
		            	"p2Set":"$sequence.playerB.set",
		            	"p2Points":"$sequence.playerB.points",
		            	},         		
		            	"strokesPlayed":{$sum:1}
		            }},
		            {$project:{
		            	"fromDestination":"$_id.fromDestination",
		            	"strokeHand":"$_id.strokeHand","_id":0,
		            	"strokesPlayed":1,"p1Set":"$_id.p1Set","p2Set":"$_id.p2Set",
		            	"p1Points":"$_id.p1Points","p2Points":"$_id.p2Points"
		            }},
		            {$sort:{"strokesPlayed":-1}},
		            {$group:{
                        _id:{"strokeHand":"$strokeHand",
                            "fromDestination":"$fromDestination"
                        },
        				"dataSet":{
        					$push:{
        						"strokeHand":"$strokeHand","fromDestination":"$fromDestination",
        						"played":"$strokesPlayed",
                                "p1Set":"$p1Set","p2Set":"$p2Set",
                                "p1Points":"$p1Points","p2Points":"$p2Points",
                        }},
                        "totalPlayed": { $sum: "$strokesPlayed" }
                    }},
                    {$project:{
                        "fromDestination":"$_id.fromDestination",
                        "strokeHand":"$_id.strokeHand",
                        "dataSet":1,
                        "totalPlayed":1,
                        "_id":0
                    }},
                    {$sort:sortQuery}
                ]);

               	info1 = sequenceDataRecord.aggregate([
		            {$match:{"loggerId":userId,
		            	"player2Id":player1ID,"player1Id":player2ID,
		            	"sequence.analyticsCache.sequenceLen":{$gte:3},
		            	"sequence.sequenceRecordDate" :  queryForDate2
					}},
		            {$unwind:"$sequence"},
		            {$unwind:"$sequence.strokesPlayed"},
		            {$match: {
		            	$or:[
		            		{"sequence.strokesPlayed.strokePlayed":{$regex:player1RegObj}},
		            		{"sequence.strokesPlayed.strokePlayed":player1ID}
		            	],
		            	"sequence.sequenceRecordDate" :  queryForDate2,
		            	"sequence.strokesPlayed.previousDestination":{$nin:[null,""]},	         		
		            }},
		            {$group:{"_id":{
		            	"fromDestination":"$sequence.strokesPlayed.previousDestination",
		            	"strokeHand":"$sequence.strokesPlayed.strokeHand",
		            	"p2Set":"$sequence.playerA.set",
		            	"p2Points":"$sequence.playerA.points",
		            	"p1Set":"$sequence.playerB.set",
		            	"p1Points":"$sequence.playerB.points",
		            	},         		
		            	"strokesPlayed":{$sum:1}
		            }},           	
		            {$project:{
		            	"fromDestination":"$_id.fromDestination",
		            	"strokeHand":"$_id.strokeHand","_id":0,
		            	"strokesPlayed":1,"p1Set":"$_id.p1Set","p2Set":"$_id.p2Set",
		            	"p1Points":"$_id.p1Points","p2Points":"$_id.p2Points"
		            }},
		            {$sort:{"strokesPlayed":-1}},
		            {$group:{
                        _id:{"strokeHand":"$strokeHand",
                            "fromDestination":"$fromDestination"
                        },
        				"dataSet":{
        					$push:{
        						"strokeHand":"$strokeHand","fromDestination":"$fromDestination",
        						"played":"$strokesPlayed",
                                "p1Set":"$p1Set","p2Set":"$p2Set",
                                "p1Points":"$p1Points","p2Points":"$p2Points",
                        }},
                        "totalPlayed": { $sum: "$strokesPlayed" }
                    }},
                    {$project:{
                        "fromDestination":"$_id.fromDestination",
                        "strokeHand":"$_id.strokeHand",
                        "dataSet":1,
                        "totalPlayed":1,
                        "_id":0
                    }},
                    {$sort:sortQuery}      
		        ]);

				info = info.concat(info1);	              
	      	}
	      	else if(player2Name.trim() == "All L/H" || player2Name.trim() == "All R/H" || player2Name.trim() == "All")
	      	{
	      		var handPlayers = [];
	      		var queryJson;
	      		if(player2Name.trim() == "All L/H")
	      		{
	      			handPlayers = leftHandPlayers;
	      			queryJson = {$in:handPlayers};
	      		}
	      		else if(player2Name.trim() == "All R/H")
	      		{
	      			handPlayers = rightHandPlayers;
	      			queryJson = {$in:handPlayers};
	      		}
	      		else if(player2Name.trim() == "All")
	      		{
	      			handPlayers = [null,""]
	      			queryJson = {$nin:handPlayers};
	      		}

	      		 info = sequenceDataRecord.aggregate([
			        {$match:
			          	{$or:[
			          		{			          			
			          			"loggerId":userId,
			          			"player2Id":queryJson,
			          			"player1Id":player1ID,
		            			"sequence.analyticsCache.sequenceLen":{$gte:3},		        	 
		        	 			"sequence.sequenceRecordDate" :  queryForDate2
			         	 	},
			         		{
			         			"loggerId":userId,
			         			"player1Id":queryJson,
			         			"player2Id":player1ID,
		            			"sequence.analyticsCache.sequenceLen":{$gte:3},
		            			"sequence.sequenceRecordDate" :  queryForDate2
			         	 	}
			         	 ]}
			         },
			        {$unwind:"$sequence"},
		            {$unwind:"$sequence.strokesPlayed"},
			        {$match: 
			          	{$or:[
			          		{
			          			"player2Id":queryJson,
			          			"player1Id":player1ID,
			          			$or:[
				            		{"sequence.strokesPlayed.strokePlayed": {$regex:player1RegObj}},
				            		{"sequence.strokesPlayed.strokePlayed": player1ID}
		            			],
		            	        //"sequence.strokesPlayed.strokePlayed": {$regex:player1RegObj},
		            			"sequence.sequenceRecordDate" :  queryForDate2,
		            			"sequence.strokesPlayed.previousDestination":{$nin:[null,""]},	         		
			          		},
			          		{
			          			"player1Id":queryJson,
			          			"player2Id":player1ID,
			          			$or:[
		            				{"sequence.strokesPlayed.strokePlayed": {$regex:player1RegObj}},
		            				{"sequence.strokesPlayed.strokePlayed": player1ID}
		            			],
		            			//"sequence.strokesPlayed.strokePlayed": {$regex:player1RegObj},
		            			"sequence.sequenceRecordDate" :  queryForDate2,
		            			"sequence.strokesPlayed.previousDestination":{$nin:[null,""]},			          			
			          		}
			          	]}					
					},			            
				    {$group:
				    	{"_id":{
							"fromDestination":"$sequence.strokesPlayed.previousDestination",
		            		"strokeHand":"$sequence.strokesPlayed.strokeHand",
				        	"p1Set":{
				          		"$cond": { 
                					"if": { "$eq": [ "$player1Id", player1ID ] }, 
                					"then": "$sequence.playerA.set",
                					"else": {
                    					"$cond": {
                        					"if": { "$eq": ["$player2Id",player1ID]}, 
                        					"then": "$sequence.playerB.set", 
                        					"else": 0
                    					}
                					}
            					}			          		
				    		},
  							"p1Points":{
				          		"$cond": { 
                					"if": { "$eq": [ "$player1Id", player1ID ] }, 
                					"then": "$sequence.playerA.points",
                					"else": {
                    					"$cond": {
                        					"if": { "$eq": ["$player2Id",player1ID]}, 
                        					"then": "$sequence.playerB.points", 
                        					"else": 0
                    					}
                					}
            					}			          		
				    		},
 							"p2Set":{
				          		"$cond": { 
                					"if": { "$eq": [ "$player1Id", player1ID ] }, 
                					"then": "$sequence.playerB.set",
                					"else": {
                    					"$cond": {
                        					"if": { "$eq": ["$player2Id",player1ID]}, 
                        					"then": "$sequence.playerA.set", 
                        					"else": 0
                    					}
                					}
            					}			          		
				    		},
							"p2Points":{
				          		"$cond": { 
                					"if": { "$eq": [ "$player1Id", player1ID ] }, 
                					"then": "$sequence.playerB.points",
                					"else": {
                    					"$cond": {
                        					"if": { "$eq": ["$player2Id",player1ID]}, 
                        					"then": "$sequence.playerA.points", 
                        					"else": 0
                    					}
                					}
            					}			          		
				    		}
						},
						"strokesPlayed":{$sum:1}		         
				    }},
				    {$project:{
		            		"fromDestination":"$_id.fromDestination",
		            		"strokeHand":"$_id.strokeHand","_id":0,
		            		"strokesPlayed":1,"p1Set":"$_id.p1Set","p2Set":"$_id.p2Set",
		            		"p1Points":"$_id.p1Points","p2Points":"$_id.p2Points"
		            }},
		            {$sort:{"strokesPlayed":-1}},
		            {$group:{
                        _id:{"strokeHand":"$strokeHand",
                            "fromDestination":"$fromDestination"
                        },
        				"dataSet":{
        					$push:{
        						"strokeHand":"$strokeHand","fromDestination":"$fromDestination",
        						"played":"$strokesPlayed",
                                "p1Set":"$p1Set","p2Set":"$p2Set",
                                "p1Points":"$p1Points","p2Points":"$p2Points",
                        }},
                        "totalPlayed": { $sum: "$strokesPlayed" }
                    }},
                    {$project:{
                         "fromDestination":"$_id.fromDestination",
                         "strokeHand":"$_id.strokeHand",
                         "dataSet":1,
                         "totalPlayed":1,
                         "_id":0
                    }},
                    {$sort:sortQuery}
                ]);

	      	}

      		

		    return info;
    	}catch(e){}
  	},
  	fetchErrorAnalysis:function(userId,data)
  	{
  		try{
	      	var player1Name = data.player1Name;
	      	var player2Name = data.player2Name;
	      	var player1ID = data.player1ID;
	      	var player2ID = data.player2ID;
	      	var sort = data.sortFilterValue;
	      	var dateFilter = data.dateFilter;
	     	dateQuery = computeDateFilter(dateFilter);
	      	var  info = "";
	      	var raw = playerDetailsRecord.rawCollection();
      		var distinct = Meteor.wrapAsync(raw.distinct, raw);
      		var leftHandPlayers =  distinct('_id',{"loggerId":userId,playerHand:"LeftHand"});
      		var rightHandPlayers =  distinct('_id',{"loggerId":userId,playerHand:"RightHand"});
  		 	var losingStrokesInfo = losingStrokes.findOne({});
		    var losingStrokesList = [];
	      	if(losingStrokesInfo)
	        	losingStrokesList = losingStrokesInfo.losingStrokes;
	        var queryForDate2 = {$nin:[null]};
		    if(dateQuery != "")	    
				queryForDate2 = {$gte:dateQuery};

			var sortQuery = {"totalPlayed":-1};
		    
		    
      		if(player2Name.trim() != "All" && player2Name.trim() != "All L/H" && player2Name.trim() != "All R/H")
	      	{
		        info = sequenceDataRecord.aggregate([
		            {$match:
		            	{$or:[
		            		{
		            			"loggerId":userId,
		            			"player1Id":player1ID,"player2Id":player2ID,
		            			"sequence.analyticsCache.sequenceLen":{$gte:3},
								"sequence.sequenceRecordDate" :  queryForDate2
							},
							{
								"loggerId":userId,
								"player2Id":player1ID,"player1Id":player2ID,
		            			"sequence.analyticsCache.sequenceLen":{$gte:3},
		            			"sequence.sequenceRecordDate" :  queryForDate2
							}
						]}
					},
		            {$unwind:"$sequence"},
		            {$unwind:"$sequence.strokesPlayed"},
		            {$match: {
		            	"sequence.strokesPlayed.strokePlayed": {$in:[player1Name,player1ID]},
		            	"sequence.strokesPlayed.strokeDestination":{$in:losingStrokesList},
		            	"sequence.sequenceRecordDate" :  queryForDate2,
		            	"sequence.strokesPlayed.previousDestination":{$nin:["",null]}
		            }},
		            {$group:{"_id":{
		            	"fromDestination":"$sequence.strokesPlayed.previousDestination",
		            	"strokeHand":"$sequence.strokesPlayed.strokeHand",
		            	"strokeDestination":"$sequence.strokesPlayed.strokeDestination",	      		
		            	},         		
		            	"strokesPlayed":{$sum:1}
		            }},
		            {$project:{
		            	"fromDestination":"$_id.fromDestination",
		            	"strokeHand":"$_id.strokeHand",
		            	"strokeDestination":"$_id.strokeDestination","_id":0,
		            	"strokesPlayed":1,
		            }},
		            {$group:{
                        _id:{"strokeHand":"$strokeHand",
                            "fromDestination":"$fromDestination"
                        },
        				"dataSet":{
        					$push:{
        						"strokeHand":"$strokeHand","fromDestination":"$fromDestination",
        						"strokeDestination":"$strokeDestination",
        						"played":"$strokesPlayed",                                  
                        }},
                        "totalPlayed": { $sum: "$strokesPlayed" }
                    }},
                    {$project:{
                        "fromDestination":"$_id.fromDestination",
                        "strokeHand":"$_id.strokeHand",
                        "strokeDestination":"$_id.strokeDestination",
                        "dataSet":1,
                        "totalPlayed":1,
                        "_id":0
                    }},
                    {$sort:sortQuery}
                ]);					
		    }
		    else if(player2Name.trim() == "All L/H" || player2Name.trim() == "All R/H" || player2Name.trim() == "All")
	      	{
	      		var handPlayers = [];
	      		var queryJson;
	      		if(player2Name.trim() == "All L/H")
	      		{
	      			handPlayers = leftHandPlayers;
	      			queryJson = {$in:handPlayers};
	      		}
	      		else if(player2Name.trim() == "All R/H")
	      		{
	      			handPlayers = rightHandPlayers;
	      			queryJson = {$in:handPlayers};
	      		}
	      		else if(player2Name.trim() == "All")
	      		{
	      			handPlayers = [null,""]
	      			queryJson = {$nin:handPlayers};
	      		}
	      		info = sequenceDataRecord.aggregate([
		            {$match:
		            	{$or:[
		            		{
			            		"loggerId":userId,
			            		"player2Id":queryJson,
			            		"player1Id":player1ID,
			            		"sequence.analyticsCache.sequenceLen":{$gte:3},
			            		"sequence.sequenceRecordDate" :  queryForDate2
							},
							{
								"loggerId":userId,
								"player1Id":queryJson,
								"player2Id":player1ID,
		            			"sequence.analyticsCache.sequenceLen":{$gte:3},
		            			"sequence.sequenceRecordDate" :  queryForDate2
							}
						]}
					},
		            {$unwind:"$sequence"},
		            {$unwind:"$sequence.strokesPlayed"},
		            {$match: {"sequence.strokesPlayed.strokePlayed": {$in:[player1Name,player1ID]},
		            	"sequence.strokesPlayed.strokeDestination":{$in:losingStrokesList},
		            	"sequence.sequenceRecordDate" :  queryForDate2,
		            	"sequence.strokesPlayed.previousDestination":{$nin:["",null]}

		            }},
		            {$group:{"_id":{
		            	"fromDestination":"$sequence.strokesPlayed.previousDestination",
		            	"strokeHand":"$sequence.strokesPlayed.strokeHand",
		            	"strokeDestination":"$sequence.strokesPlayed.strokeDestination",	      		
		            	},         		
		            	"strokesPlayed":{$sum:1}
		            }},
		            {$project:{
		            	"fromDestination":"$_id.fromDestination",
		            	"strokeHand":"$_id.strokeHand",
		            	"strokeDestination":"$_id.strokeDestination","_id":0,
		            	"strokesPlayed":1,
		            }},
		            {$group:{
                        _id:{"strokeHand":"$strokeHand",
                            "fromDestination":"$fromDestination"
                        },
        				"dataSet":{
        					$push:{
        						"strokeHand":"$strokeHand","fromDestination":"$fromDestination",
        						"strokeDestination":"$strokeDestination",
        						"played":"$strokesPlayed",                                   
                        }},
                        "totalPlayed": { $sum: "$strokesPlayed" }
                    }},
                    {$project:{
                        "fromDestination":"$_id.fromDestination",
                        "strokeHand":"$_id.strokeHand",
                        "strokeDestination":"$_id.strokeDestination",
                        "dataSet":1,
                        "totalPlayed":1,
                        "_id":0
                    }},
                    {$sort:sortQuery}

                ]);
	      	}
	      	
		    return info;
  		}catch(e){}
  	},
	fetchServicePoints:function(userId,data)
  	{
    	try{
		    var player1Name = data.player1Name;
		    var player2Name = data.player2Name;
		    var player1ID = data.player1ID;
		    var player2ID = data.player2ID;
		    var sort = data.sortFilterValue;
		    var dateFilter = data.dateFilter;
		    var info;
	     	var raw = playerDetailsRecord.rawCollection();
      		var distinct = Meteor.wrapAsync(raw.distinct, raw);
      		var leftHandPlayers =  distinct('_id',{"loggerId":userId,playerHand:"LeftHand"});
      		var rightHandPlayers =  distinct('_id',{"loggerId":userId,playerHand:"RightHand"});
	     	dateQuery = computeDateFilter(dateFilter);
		    var queryForDate2 = {$nin:[null]};
		    queryForPlayer2 = "";
		    var sortQuery = {"win":-1}

		    if(dateQuery != "")
		    {
				queryForDate2 = {$gte:dateQuery};
		    }		 
      		if(player2Name.trim() != "All" && player2Name.trim() != "All L/H" && player2Name.trim() != "All R/H")
		    {  	
			    info = sequenceDataRecord.aggregate([
				    {$match:
				       	{$or:[
					        {
						        "loggerId":userId,
							    "player1Id":player1ID,"player2Id":player2ID,							  
							    sequence: { $elemMatch: {"analyticsCache.serviceBy": {$in:[player1Name,player1ID]}}},
							    sequence: { $elemMatch: {"analyticsCache.serviceWin": "yes"}},
							    sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:1}}},
							    "sequence.sequenceRecordDate":queryForDate2			        				        						        
					        },
					        {
								"loggerId":userId,
					        	"player1Id":player2ID,"player2Id":player1ID,
					        	sequence: { $elemMatch: {"analyticsCache.serviceBy": {$in:[player1Name,player1ID]}}},
							    sequence: { $elemMatch: {"analyticsCache.serviceWin": "yes"}},
							    sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:1}}},
					        	"sequence.sequenceRecordDate":queryForDate2			        				        						        
					        }
				        ]}
				    },
				    {$unwind:"$sequence"},
				    {$match:{
						"sequence.analyticsCache.sequenceLen": {$eq:1},
						"sequence.analyticsCache.serviceWin": "yes",
						"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
						"sequence.sequenceRecordDate":queryForDate2			        				        						        
					}}, 
			 		{$group:{
				 		"_id":{
				 			"serviceHand":"$sequence.serviceHand",
				 			"serviceDestination":"$sequence.serviceDestination"
				 		},
							"win":{$sum:1},
					}},
					{$project:{
						    "serviceHand":"$_id.serviceHand","serviceDestination":"$_id.serviceDestination","win":1,"_id":0,
					}},
					{$sort:sortQuery}
				]);		       	   	      			       				      
		    }	   
		    else if(player2Name.trim() == "All L/H" || player2Name.trim() == "All R/H" || player2Name.trim() == "All")
		    {		
		    	var handPlayers = [];
	      		var queryJson;
	      		if(player2Name.trim() == "All L/H")
	      		{
	      			handPlayers = leftHandPlayers;
	      			queryJson = {$in:handPlayers};
	      		}
	      		else if(player2Name.trim() == "All R/H")
	      		{
	      			handPlayers = rightHandPlayers;
	      			queryJson = {$in:handPlayers};
	      		}
	      		else if(player2Name.trim() == "All")
	      		{
	      			handPlayers = [null,""]
	      			queryJson = {$nin:handPlayers};
	      		}

       
	 			info = sequenceDataRecord.aggregate([
				    {$match:
				        {$or:[
				        	{
						        "loggerId":userId,
							    "player2Id":queryJson,
							    "player1Id":player1ID,
							    sequence: { $elemMatch: {"analyticsCache.serviceBy": {$in:[player1Name,player1ID]}}},
							    sequence: { $elemMatch: {"analyticsCache.serviceWin": "yes"}},
							    sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:1}}},
							    "sequence.sequenceRecordDate": queryForDate2, 
							},
							{
							    "loggerId":userId,
					        	"player1Id":queryJson,
					        	"player2Id":player1ID,
					        	sequence: { $elemMatch: {"analyticsCache.serviceBy": {$in:[player1Name,player1ID]}}},
							    sequence: { $elemMatch: {"analyticsCache.serviceWin": "yes"}},
							    sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:1}}},
					        	"sequence.sequenceRecordDate": queryForDate2,
							}
						]}
				    },
				    {$unwind:"$sequence"},
				   	{$match:{
				    	"sequence.analyticsCache.sequenceLen": {$eq:1},
						"sequence.analyticsCache.serviceWin": "yes",
						"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
						"sequence.sequenceRecordDate": queryForDate2

					}},
			 		{$group:{
				 		"_id":{
				 			"serviceHand":"$sequence.serviceHand",
				 			"serviceDestination":"$sequence.serviceDestination"
				 		},
						"win":{$sum:1},
					}},
					{$project:{
						"serviceHand":"$_id.serviceHand","serviceDestination":"$_id.serviceDestination","win":1,"_id":0,
					}},
					{$sort:sortQuery}

				]);							      	
		    }
		  
    		return info;
    	}catch(e){}
  	},
  	fetchReceiverPoints:function(userId,data)
  	{
    	try{
		    var player1Name = data.player1Name;
		    var player2Name = data.player2Name;
		    var player1ID = data.player1ID;
		    var player2ID = data.player2ID;
		    var sort = data.sortFilterValue;
		    var dateFilter = data.dateFilter;
		    var info;
	     	var raw = playerDetailsRecord.rawCollection();
      		var distinct = Meteor.wrapAsync(raw.distinct, raw);
      		var leftHandPlayers =  distinct('_id',{"loggerId":userId,playerHand:"LeftHand"});
      		var rightHandPlayers =  distinct('_id',{"loggerId":userId,playerHand:"RightHand"});
		    dateQuery = computeDateFilter(dateFilter);
		    queryForPlayer2 = "";
		    var queryForDate2 = {$nin:[null]};
		    var sortQuery = {"win":-1};
		    if(dateQuery != "")
		    {
				queryForDate2 = {$gte:dateQuery};
		    }

      		if(player2Name.trim() != "All" && player2Name.trim() != "All L/H" && player2Name.trim() != "All R/H")
		    {      	
		       	info = sequenceDataRecord.aggregate([
				    {$match:
				        {$or:[
				        	{
						        "loggerId":userId,
						        "player1Id":player1ID,"player2Id":player2ID,
							    sequence: { $elemMatch: {"analyticsCache.serviceBy": {"$nin":[player1Name,player1ID]}}},
						        sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:2}}},
						        "sequence.sequenceRecordDate" :  queryForDate2,
				        	},
				        	{
				        		"loggerId":userId,
				        		"player2Id":player1ID,"player1Id":player2ID,
					        	sequence: { $elemMatch: {"analyticsCache.serviceBy": {"$nin":[player1Name,player1ID]}}},
				        		sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:2}}},
						        "sequence.sequenceRecordDate" :  queryForDate2,
				        	}
				        ]}		        	
				    },
				    {$unwind:"$sequence"},
				    {$unwind:"$sequence.strokesPlayed"},
				    { $match: { 
				        "sequence.sequenceRecordDate" :  queryForDate2,
				        "sequence.strokesPlayed.strokePlayed":{$in:[player1Name,player1ID]},
				        "sequence.analyticsCache.serviceBy": {"$nin":[player1Name,player1ID]},
					    "sequence.analyticsCache.sequenceLen": {$eq:2}
				    }},
				    {$group:{
			 			"_id":{
			 				"strokeHand":"$sequence.strokesPlayed.strokeHand",
			 				"strokeDestination":"$sequence.strokesPlayed.strokeDestination",
							"serviceHand":"$sequence.serviceHand",
						    "serviceDestination":"$sequence.serviceDestination"
			 			},
						"win":{$sum:1},
					}},
					{$project:{
					    "strokeKey":"$_id.strokeKey",
					    "strokeHand":"$_id.strokeHand","strokeDestination":"$_id.strokeDestination",
					    "serviceHand":"$_id.serviceHand","serviceDestination":"$_id.serviceDestination",
					    "win":1,"_id":0
					}},
					{$sort:sortQuery}
				]);								
		    }
		    else if(player2Name.trim() == "All L/H" || player2Name.trim() == "All R/H" ||player2Name.trim() == "All")
		    {
		    	var handPlayers = [];
	      		var queryJson;
	      		if(player2Name.trim() == "All L/H")
	      		{
	      			handPlayers = leftHandPlayers;
	      			queryJson = {$in:handPlayers};
	      		}
	      		else if(player2Name.trim() == "All R/H")
	      		{
	      			handPlayers = rightHandPlayers;
	      			queryJson = {$in:handPlayers};
	      		}
	      		else if(player2Name.trim() == "All")
	      		{
	      			handPlayers = [null,""]
	      			queryJson = {$nin:handPlayers};
	      		}
	      			info = sequenceDataRecord.aggregate([
				    {$match:
				        {$or:[
				        	{
						        "loggerId":userId,
						        "player2Id":queryJson,
						        "player1Id":player1ID,
							    sequence: { $elemMatch: {"analyticsCache.serviceBy": {"$nin":[player1Name,player1ID]}}},
						        sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:2}}},
						        "sequence.sequenceRecordDate" :  queryForDate2,
				        	},
				        	{
				        		"loggerId":userId,
				        		"player1Id":queryJson,
				        		"player2Id":player1ID,
					       		sequence: { $elemMatch: {"analyticsCache.serviceBy": {"$nin":[player1Name,player1ID]}}},
				        		sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:2}}},
						        "sequence.sequenceRecordDate" :  queryForDate2,
				        	}
				        ]}			       	
				    },
				    {$unwind:"$sequence"},
				    {$unwind:"$sequence.strokesPlayed"},
				    { $match: { 
				        	"sequence.sequenceRecordDate" :  queryForDate2,
				            "sequence.strokesPlayed.strokePlayed":{$in:[player1Name,player1ID]},
				            "sequence.analyticsCache.serviceBy": {"$nin":[player1Name,player1ID]},
					        "sequence.analyticsCache.sequenceLen": {$eq:2}
				    }},
				    {$group:{
			 			"_id":{
			 				"strokeHand":"$sequence.strokesPlayed.strokeHand",
			 				"strokeDestination":"$sequence.strokesPlayed.strokeDestination",
							"serviceHand":"$sequence.serviceHand",
						    "serviceDestination":"$sequence.serviceDestination"
			 			},
						"win":{$sum:1},
					}},
					{$project:{
					    "strokeKey":"$_id.strokeKey",
					    "strokeHand":"$_id.strokeHand","strokeDestination":"$_id.strokeDestination",
					    "serviceHand":"$_id.serviceHand","serviceDestination":"$_id.serviceDestination",
					    "win":1,"_id":0
					}},
					{$sort:sortQuery}

				]);	
		    }
		   
    		return info;
    	}catch(e){

    	}
  	},
  	fetchServiceLoss:function(userId,data)
  	{
  		try{
		    var player1Name = data.player1Name;
		    var player2Name = data.player2Name;
		    var player1ID = data.player1ID;
		    var player2ID = data.player2ID;
		    var sort = data.sortFilterValue;
		    var dateFilter = data.dateFilter;
		    var info;
	     
	     	dateQuery = computeDateFilter(dateFilter);
	     	var queryForDate2 = {$nin:[null]};
		    if(dateQuery != "")
		    {
				queryForDate2 = {$gte:dateQuery};
		    }
		    var sortQuery = {"win":-1};
	     	var raw = playerDetailsRecord.rawCollection();
     		var distinct = Meteor.wrapAsync(raw.distinct, raw);
      		var leftHandPlayers =  distinct('_id',{"loggerId":userId,playerHand:"LeftHand"});
      		var rightHandPlayers =  distinct('_id',{"loggerId":userId,playerHand:"RightHand"});
		    var losingStrokesInfo = losingStrokes.findOne({});
		    var losingStrokesList = [];
	      	if(losingStrokesInfo)
	        	losingStrokesList = losingStrokesInfo.losingStrokes;
     
      		if(player2Name.trim() != "All" && player2Name.trim() != "All L/H" && player2Name.trim() != "All R/H")
		    {	      			                			       
			    info = sequenceDataRecord.aggregate([
				    {$match:
				       	{$or:[
				       		{
					        	"loggerId":userId,
						    	"player1Id":player1ID,"player2Id":player2ID,
						    	sequence: { $elemMatch: {"analyticsCache.serviceBy": {"$in":[player1Name,player1ID]}}},
						    	sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:2}}},
						    	"sequence.sequenceRecordDate" :  queryForDate2,
						    },
						    {
						    	"loggerId":userId,
						    	"player2Id":player1ID,"player1Id":player2ID,
						    	sequence: { $elemMatch: {"analyticsCache.serviceBy": {"$in":[player1Name,player1ID]}}},
						    	sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:2}}},
						    	"sequence.sequenceRecordDate" :  queryForDate2,
						    }
						]}	
				    },
				    {$unwind:"$sequence"},
					{$match:{
					    "sequence.analyticsCache.serviceBy": {"$in":[player1Name,player1ID]},
						"sequence.analyticsCache.sequenceLen": {$eq:2},
						"sequence.sequenceRecordDate" :  queryForDate2,
					}},
				 	{$group:{
				 		"_id":{			
							"serviceHand":"$sequence.serviceHand",
							"serviceDestination":"$sequence.serviceDestination"
				 		},
							"win":{$sum:1},
					}},
					{$project:{
						"serviceHand":"$_id.serviceHand","serviceDestination":"$_id.serviceDestination",
						"win":1,"_id":0
					}},
					{$sort:sortQuery}
				]);      
		    }
		    else if(player2Name.trim() == "All L/H" || player2Name.trim() == "All R/H" || player2Name.trim() == "All")
		    {
		    	var handPlayers = [];
	      		var queryJson;
	      		if(player2Name.trim() == "All L/H")
	      		{
	      			handPlayers = leftHandPlayers;
	      			queryJson = {$in:handPlayers};
	      		}
	      		else if(player2Name.trim() == "All R/H")
	      		{
	      			handPlayers = rightHandPlayers;
	      			queryJson = {$in:handPlayers};
	      		}
	      		else if(player2Name.trim() == "All")
	      		{
	      			handPlayers = [null,""]
	      			queryJson = {$nin:handPlayers};
	      		}
	      		 info = sequenceDataRecord.aggregate([
				    {$match:
				        {$or:[
				       		{
							    "loggerId":userId,
								"player2Id":queryJson,
								"player1Id":player1ID,
								sequence: { $elemMatch: {"analyticsCache.serviceBy": {"$in":[player1Name,player1ID]}}},
								sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:2}}},
								"sequence.sequenceRecordDate" :  queryForDate2,
				        	},
				        	{
				        		"loggerId":userId,
						    	"player1Id":queryJson,
						    	"player2Id":player1ID,
						    	sequence: { $elemMatch: {"analyticsCache.serviceBy": {"$in":[player1Name,player1ID]}}},
						   		sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:2}}},
								"sequence.sequenceRecordDate" :  queryForDate2,
				        	}
				        ]}
				    },
				    {$unwind:"$sequence"},
					{$match:{
					   	"sequence.analyticsCache.serviceBy": {"$in":[player1Name,player1ID]},
						"sequence.analyticsCache.sequenceLen": {$eq:2},
						"sequence.sequenceRecordDate" :  queryForDate2,
					}},
				 	{$group:{
				 		"_id":{			
							"serviceHand":"$sequence.serviceHand",
							"serviceDestination":"$sequence.serviceDestination"
				 		},
							"win":{$sum:1},
					}},
					{$project:{
						"serviceHand":"$_id.serviceHand","serviceDestination":"$_id.serviceDestination",
						"win":1,"_id":0
					}},
					{$sort:sortQuery}
				]);  
	      	}
		   
		    return info;
    	}catch(e){}
  	},
  	fetchServiceFault:function(userId,data)
  	{
  		try{
		    var player1Name = data.player1Name.trim();
		    var player2Name = data.player2Name.trim();
		    var player1ID = data.player1ID;
		    var player2ID = data.player2ID;
		    var sort = data.sortFilterValue;
		    var dateFilter = data.dateFilter;
		    var info;
	     
	     	dateQuery = computeDateFilter(dateFilter);
	     	var queryForDate2 = {$nin:[null]};
		    if(dateQuery != "")
		    {
				queryForDate2 = {$gte:dateQuery};
		    }
		    var sortQuery;
		    var analysisType = data.analysisType;
		    if(analysisType == "App")
		    	sortQuery = {"totalPlayed":-1}
		    else
		    	sortQuery = {"dataSet.count":-1}
	     	var raw = playerDetailsRecord.rawCollection();
     		var distinct = Meteor.wrapAsync(raw.distinct, raw);
      		var leftHandPlayers =  distinct('_id',{"loggerId":userId,playerHand:"LeftHand"});
      		var rightHandPlayers =  distinct('_id',{"loggerId":userId,playerHand:"RightHand"});
		    var losingStrokesInfo = losingStrokes.findOne({});
		    var losingStrokesList = [];
	      	if(losingStrokesInfo)
	        	losingStrokesList = losingStrokesInfo.losingStrokes;
     
      		if(player2Name.trim() != "All" && player2Name.trim() != "All L/H" && player2Name.trim() != "All R/H")
		    {	      			                			       
			    info = sequenceDataRecord.aggregate([
				    {$match:
				       	{$or:[
				       		{
					        	"loggerId":userId,
						    	"player1Id":player1ID,"player2Id":player2ID,
						    	sequence: { $elemMatch: {"analyticsCache.serviceBy": {$in:[player1Name,player1ID]}}},
						    	sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:0}}},
						    	"sequence.sequenceRecordDate" :  queryForDate2,
						    	sequence: { $elemMatch: {"analyticsCache.winner": {$nin:[player1Name,player1ID]}}},
						    },
						    {
						    	"loggerId":userId,
						    	"player2Id":player1ID,"player1Id":player2ID,
						    	sequence: { $elemMatch: {"analyticsCache.serviceBy": {$in:[player1Name,player1ID]}}},
						    	sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:0}}},
						    	"sequence.sequenceRecordDate" :  queryForDate2,
						    	sequence: { $elemMatch: {"analyticsCache.winner": {$nin:[player1Name,player1ID]}}},

						    }
						]}	
				    },
				    {$unwind:"$sequence"},
					{$match:{
					    "sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
						"sequence.analyticsCache.sequenceLen": {$eq:0},
						"sequence.sequenceRecordDate" :  queryForDate2,
						"sequence.analyticsCache.winner":{$nin:[player1Name,player1ID]}

					}},
				 	{$group:{
				 		"_id":{			
							"serviceHand":"$sequence.serviceHand",
							"serviceDestination":"$sequence.serviceDestination",
							"p1Set":{
				          		"$cond": { 
                					"if": { "$eq": [ "$player1Id", player1ID ] }, 
                					"then": "$sequence.playerA.set",
                					"else": {
                    					"$cond": {
                        					"if": { "$eq": ["$player2Id",player1ID]}, 
                        					"then": "$sequence.playerB.set", 
                        					"else": 0
                    					}
                					}
            					}			          		
				    		},
  							"p1Points":{
				          		"$cond": { 
                					"if": { "$eq": [ "$player1Id", player1ID ] }, 
                					"then": "$sequence.playerA.points",
                					"else": {
                    					"$cond": {
                        					"if": { "$eq": ["$player2Id",player1ID]}, 
                        					"then": "$sequence.playerB.points", 
                        					"else": 0
                    					}
                					}
            					}			          		
				    		},
 							"p2Set":{
				          		"$cond": { 
                					"if": { "$eq": [ "$player1Id", player1ID ] }, 
                					"then": "$sequence.playerB.set",
                					"else": {
                    					"$cond": {
                        					"if": { "$eq": ["$player2Id",player1ID]}, 
                        					"then": "$sequence.playerA.set", 
                        					"else": 0
                    					}
                					}
            					}			          		
				    		},
							"p2Points":{
				          		"$cond": { 
                					"if": { "$eq": [ "$player1Id", player1ID ] }, 
                					"then": "$sequence.playerB.points",
                					"else": {
                    					"$cond": {
                        					"if": { "$eq": ["$player2Id",player1ID]}, 
                        					"then": "$sequence.playerA.points", 
                        					"else": 0
                    					}
                					}
            					}			          		
				    		}

				 		},
							"count":{$sum:1},
					}},
					{$project:{
						"serviceHand":"$_id.serviceHand",
						"serviceDestination":"$_id.serviceDestination",
						"count":1,"_id":0,
						"p1Set":"$_id.p1Set","p2Set":"$_id.p2Set",
		            	"p1Points":"$_id.p1Points","p2Points":"$_id.p2Points"
					}},
					{$sort:{"count":-1}},
		            {$group:{
                        _id:{"serviceHand":"$serviceHand",
                            "serviceDestination":"$serviceDestination"
                        },
        				"dataSet":{
        					$push:{
                                "p1Set":"$p1Set","p2Set":"$p2Set",
                                "p1Points":"$p1Points","p2Points":"$p2Points",
                                "count":"$count"
                        }},
                        "totalPlayed": { $sum: "$count" }
                    }},
                    {$project:{
                         "serviceHand":"$_id.serviceHand",
                         "serviceDestination":"$_id.serviceDestination",
                         "dataSet":1,
                         "totalPlayed":1,
                         "_id":0
                    }},
                    {$sort:sortQuery}

				]);  
		    }
		    else if(player2Name.trim() == "All L/H" || player2Name.trim() == "All R/H" || player2Name.trim() == "All")
		    {
		    	var handPlayers = [];
	      		var queryJson;
	      		if(player2Name.trim() == "All L/H")
	      		{
	      			handPlayers = leftHandPlayers;
	      			queryJson = {$in:handPlayers};
	      		}
	      		else if(player2Name.trim() == "All R/H")
	      		{
	      			handPlayers = rightHandPlayers;
	      			queryJson = {$in:handPlayers};
	      		}
	      		else if(player2Name.trim() == "All")
	      		{
	      			handPlayers = [null,""]
	      			queryJson = {$nin:handPlayers};
	      		}
	      		info = sequenceDataRecord.aggregate([
				    {$match:
				        {$or:[
				       		{
							    "loggerId":userId,
								"player2Id":queryJson,
								"player1Id":player1ID,
								sequence: { $elemMatch: {"analyticsCache.serviceBy": {"$in":[player1Name,player1ID]}}},
								sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:0}}},
								"sequence.sequenceRecordDate" :  queryForDate2,
						    	sequence: { $elemMatch: {"analyticsCache.winner": {$nin:[player1Name,player1ID]}}},

				        	},
				        	{
				        		"loggerId":userId,
						    	"player1Id":queryJson,
						    	"player2Id":player1ID,
								sequence: { $elemMatch: {"analyticsCache.serviceBy": {"$in":[player1Name,player1ID]}}},
						   		sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$eq:0}}},
								"sequence.sequenceRecordDate" :  queryForDate2,
						    	sequence: { $elemMatch: {"analyticsCache.winner": {$nin:[player1Name,player1ID]}}},

				        	}
				        ]}
				    },
				    {$unwind:"$sequence"},
					{$match:{
					   	"sequence.analyticsCache.serviceBy": {"$in":[player1Name,player1ID]},
						"sequence.analyticsCache.sequenceLen": {$eq:0},
						"sequence.sequenceRecordDate" :  queryForDate2,
						"sequence.analyticsCache.winner":{$nin:[player1Name,player1ID]},						
					}},
				 	{$group:{
				 		"_id":{			
							"serviceHand":"$sequence.serviceHand",
							"serviceDestination":"$sequence.serviceDestination",
							"p1Set":{
				          		"$cond": { 
                					"if": { "$eq": [ "$player1Id", player1ID ] }, 
                					"then": "$sequence.playerA.set",
                					"else": {
                    					"$cond": {
                        					"if": { "$eq": ["$player2Id",player1ID]}, 
                        					"then": "$sequence.playerB.set", 
                        					"else": 0
                    					}
                					}
            					}			          		
				    		},
  							"p1Points":{
				          		"$cond": { 
                					"if": { "$eq": [ "$player1Id", player1ID ] }, 
                					"then": "$sequence.playerA.points",
                					"else": {
                    					"$cond": {
                        					"if": { "$eq": ["$player2Id",player1ID]}, 
                        					"then": "$sequence.playerB.points", 
                        					"else": 0
                    					}
                					}
            					}			          		
				    		},
 							"p2Set":{
				          		"$cond": { 
                					"if": { "$eq": [ "$player1Id", player1ID ] }, 
                					"then": "$sequence.playerB.set",
                					"else": {
                    					"$cond": {
                        					"if": { "$eq": ["$player2Id",player1ID]}, 
                        					"then": "$sequence.playerA.set", 
                        					"else": 0
                    					}
                					}
            					}			          		
				    		},
							"p2Points":{
				          		"$cond": { 
                					"if": { "$eq": [ "$player1Id", player1ID ] }, 
                					"then": "$sequence.playerB.points",
                					"else": {
                    					"$cond": {
                        					"if": { "$eq": ["$player2Id",player1ID]}, 
                        					"then": "$sequence.playerA.points", 
                        					"else": 0
                    					}
                					}
            					}			          		
				    		}
				 		},
							"count":{$sum:1},
					}},
					{$project:{
						"serviceHand":"$_id.serviceHand",
						"serviceDestination":"$_id.serviceDestination",
						"count":1,"_id":0,
						"p1Set":"$_id.p1Set","p2Set":"$_id.p2Set",
		            	"p1Points":"$_id.p1Points","p2Points":"$_id.p2Points"
					}},
					{$sort:{"count":-1}},
		            {$group:{
                        _id:{"serviceHand":"$serviceHand",
                            "serviceDestination":"$serviceDestination"
                        },
        				"dataSet":{
        					$push:{
                                "p1Set":"$p1Set","p2Set":"$p2Set",
                                "p1Points":"$p1Points","p2Points":"$p2Points",
                                "count":"$count"
                        }},
                        "totalPlayed": { $sum: "$count" }
                    }},
                    {$project:{
                         "serviceHand":"$_id.serviceHand",
                         "serviceDestination":"$_id.serviceDestination",
                         "dataSet":1,
                         "totalPlayed":1,
                         "count":1,
                         "_id":0
                    }},
                    {$sort:sortQuery}
					
				]);  
	      	}
		   
		    return info;
    	}catch(e){}
  	},
  	fetchRallyAnalysis:function(userId,data)
  	{
  		try
  		{
  			data.sequenceLen = "10+"
  			var player1Name = data.player1Name;
		    var player2Name = data.player2Name;
		    var player1ID = data.player1ID;
		    var player2ID = data.player2ID;
		    var sequenceLen = data.sequenceLen;

		    var checkEntries = [];
		    checkEntries.push(player1Name);
		    checkEntries.push(player1ID);

		    regex = checkEntries.map(function (e) { return new RegExp('^' +e, "i"); });


		    if(data.sequenceLen == "10+")
		    	sequenceLen = 3;

		    var sort = data.sortFilterValue;
		    var dateFilter = data.dateFilter;
		    dateQuery = computeDateFilter(dateFilter);
		    var queryForDate2 = {$nin:[null]};
		    if(dateQuery != "")	    
				queryForDate2 = {$gte:dateQuery};
		    var sortQuery = {"sequenceLen":1}
		    var raw = playerDetailsRecord.rawCollection();
      		var distinct = Meteor.wrapAsync(raw.distinct, raw);
      		var leftHandPlayers =  distinct('_id',{"loggerId":userId,playerHand:"LeftHand"});
      		var rightHandPlayers =  distinct('_id',{"loggerId":userId,playerHand:"RightHand"});
      		if(player2Name.trim() != "All" && player2Name.trim() != "All L/H" && player2Name.trim() != "All R/H")
		    {		      		      				     		
				info = sequenceDataRecord.aggregate([
			        {$match:
			        	{$or:[
			        		{
			        			"loggerId":userId,
					        	"player1Id":player1ID,"player2Id":player2ID,
					        	sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$gte:sequenceLen}}},
					    		"sequence.sequenceRecordDate" :  queryForDate2,
			        		},
			        		{
				        		"loggerId":userId,
					        	"player2Id":player1ID,"player1Id":player2ID,
					        	sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$gte:sequenceLen}}},	
					    		"sequence.sequenceRecordDate" :  queryForDate2,
			        		}			       		
			        	]}
			        },
			       	{$unwind:"$sequence"},
				    {$match:{
					    "sequence.analyticsCache.sequenceLen": {$gte:sequenceLen},
					    "sequence.sequenceRecordDate" :  queryForDate2,
				    }},
			 		{$group:{
			 			"_id":{								
							"sequenceLen":"$sequence.analyticsCache.sequenceLen"
			 			},	 			
						"played":{$sum:1},
						"winCount" :  {
							$sum : {
								$cond : { 
									if: {$eq: ["$sequence.analyticsCache.winner", player1Name]}, 
									then: 1, 
									else:{ 
										"$cond": {
											if: {$eq: ["$sequence.analyticsCache.winner", player1ID]}, 
											then: 1, 
											else: 0
										}
									}
								}
							}
						},
						"lossCount" :  {
							$sum : {
								$cond : { 
									if: { $eq: ["$sequence.analyticsCache.winner",  player1Name]}, 
									then: 0, 
									else:{ 
										"$cond": {
											if: {$eq: ["$sequence.analyticsCache.winner", player1ID]}, 
											then: 0,
											else: 1
										}
									}
								}
							}
						},
					}},
					{$project:{
					    "sequenceLen":"$_id.sequenceLen","played":1,"_id":0,"winCount":1,"lossCount":1,
					    "efficiency": { $cond: [ { $eq: [ "$winCount", 0 ] }, "0", {$multiply:[{"$divide":["$winCount", "$played"]},100]}]}
					}},
					{$sort:sortQuery}
				]);

		    }
		    else if(player2Name.trim() == "All L/H" || player2Name.trim() == "All R/H" || player2Name.trim() == "All")
		    {
		    	var handPlayers = [];
	      		var queryJson;
	      		if(player2Name.trim() == "All L/H")
	      		{
	      			handPlayers = leftHandPlayers;
	      			queryJson = {$in:handPlayers};
	      		}
	      		else if(player2Name.trim() == "All R/H")
	      		{
	      			handPlayers = rightHandPlayers;
	      			queryJson = {$in:handPlayers};
	      		}
	      		else if(player2Name.trim() == "All")
	      		{
	      			handPlayers = [null,""]
	      			queryJson = {$nin:handPlayers};
	      		}
	      		info = sequenceDataRecord.aggregate([
			        {$match:
			        	{$or:[
			        		{
				        		"loggerId":userId,
					        	"player2Id":queryJson,
					        	"player1Id":player1ID,
					        	sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$gte:sequenceLen}}},
					        	"sequence.sequenceRecordDate" :  queryForDate2
			        		},
			        		{
			        			"loggerId":userId,
					        	"player1Id":queryJson,
					        	"player2Id":player1ID,
					       	 	sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$gte:sequenceLen}}},	
					        	"sequence.sequenceRecordDate" :  queryForDate2
			        		}
			        	]}
			        },
			       	{$unwind:"$sequence"},
				    {$match:{
					    "sequence.analyticsCache.sequenceLen": {$gte:sequenceLen},
					    "sequence.sequenceRecordDate" :  queryForDate2
				    }},
			 		{$group:{
			 			"_id":{								
							"sequenceLen":"$sequence.analyticsCache.sequenceLen"
			 			},	 			
						"played":{$sum:1},
						"winCount" :  {
							$sum : {
								$cond : { 
									if: {$eq: ["$sequence.analyticsCache.winner", player1Name]}, 
									then: 1, 
									else:{ 
										"$cond": {
											if: {$eq: ["$sequence.analyticsCache.winner", player1ID]}, 
											then: 1, 
											else: 0
										}
									}
								}
							}
						},
						"lossCount" :  {
							$sum : {
								$cond : { 
									if: { $eq: ["$sequence.analyticsCache.winner",  player1Name]}, 
									then: 0, 
									else:{ 
										"$cond": {
											if: {$eq: ["$sequence.analyticsCache.winner", player1ID]}, 
											then: 0,
											else: 1
										}
									}
								}
							}
						},
					}},
					{$project:{
					    "sequenceLen":"$_id.sequenceLen","played":1,"_id":0,"winCount":1,"lossCount":1,
					    "efficiency": { $cond: [ { $eq: [ "$winCount", 0 ] }, "0", {$multiply:[{"$divide":["$winCount", "$played"]},100]}
					       	]}
					}},
					{$sort:sortQuery}
				]);	


	      	}
		   
		    return info;
  		}catch(e){}
  	},
  	fetch3BallAttack:function(userId,data)
  	{
  		try{
		    var player1Name = data.player1Name;
		    var player2Name = data.player2Name;
		    var player1ID = data.player1ID;
		    var player2ID = data.player2ID;
		    var sort = data.sortFilterValue;
		    var dateFilter = data.dateFilter;
		    var info;
		    var dateQuery = "";
		    var losingStrokesList = [];

	     	dateQuery = computeDateFilter(dateFilter);
		    var queryForDate2 = {$nin:[null]};
		    if(dateQuery != "")	    
				queryForDate2 = {$gte:dateQuery};
		    var analysisType = data.analysisType;
		    if(analysisType == "App")
		    	sortQuery = {"totalEfficiency":-1}
		    else
		    	sortQuery = {"totalEfficiency":-1}
	     	var raw = strokes.rawCollection();
      		var distinct = Meteor.wrapAsync(raw.distinct, raw);

		    var losingStrokesInfo = losingStrokes.findOne({});
	      	if(losingStrokesInfo)
	        	losingStrokesList = losingStrokesInfo.losingStrokes;
     		var strokesInfo = distinct('strokeShortCode',{"strokeStyle":"offensive"});

     		var raw = playerDetailsRecord.rawCollection();
      		var distinct = Meteor.wrapAsync(raw.distinct, raw);
      		var leftHandPlayers =  distinct('_id',{"loggerId":userId,playerHand:"LeftHand"});
      		var rightHandPlayers =  distinct('_id',{"loggerId":userId,playerHand:"RightHand"});
				
      		if(player2Name.trim() != "All" && player2Name.trim() != "All L/H" && player2Name.trim() != "All R/H")
		    {
		        info = sequenceDataRecord.aggregate([
					{$match:
						{$or:[
							{
								"loggerId":userId,
				        		"player1Id":player1ID,"player2Id":player2ID,
				        		"sequence.analyticsCache.sequenceLen":{$gte:3},
				        		"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
				        		"sequence.analyticsCache.thirdBall":{$in:strokesInfo},
				        		"sequence.sequenceRecordDate" :  queryForDate2,
				        	},
				        	{
				        		"loggerId":userId,
				        		"player2Id":player1ID,"player1Id":player2ID,
				        		"sequence.analyticsCache.sequenceLen":{$gte:3},
				        		"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
				        		"sequence.analyticsCache.thirdBall":{$in:strokesInfo},
				        		"sequence.sequenceRecordDate" :  queryForDate2,
				        	}
				        ]}
				    },
					{$unwind:"$sequence"},
					{$match:{			
						"sequence.analyticsCache.thirdBall":{$in:strokesInfo},	
						"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},	
						"sequence.sequenceRecordDate" :  queryForDate2,				
					}},
					{$group:{
						"_id":{
							"strokeHand":"$sequence.analyticsCache.thirdBall",
							"serviceHand":"$sequence.serviceHand",
							"serviceDestination":"$sequence.serviceDestination",
							"recvShot":"$sequence.analyticsCache.secondBallShot",
							"recvDestination":"$sequence.analyticsCache.secondBallDestination"
						},
						"count":{$sum:1},
						"winCount" :  {
							$sum : {
								$cond : { 
									if: { $eq: ["$sequence.analyticsCache.winner", player1Name]},
									then: 1, 
									else: 
										{ 
										"$cond": {
											if: {$eq: ["$sequence.analyticsCache.winner", player1ID]}, 
											then: 1, 
											else: 0
										}
									}
								}
							}
						}
						
					}},
					{$project:{
						"strokeHand":"$_id.strokeHand","serviceHand":"$_id.serviceHand",
						"serviceDestination":"$_id.serviceDestination",
						"recvShot":"$_id.recvShot","recvDestination":"$_id.recvDestination",
						"count":1,"_id":0,"winCount":1,
						"efficiency": { $cond: [ { $eq: [ "$winCount", 0 ] }, 0, {$multiply:[{"$divide":["$winCount","$count"]},100]}]}
					}},
					{$sort:{"efficiency":-1}},
					{$group:{
                        _id:{"serviceHand":"$serviceHand",
                            "serviceDestination":"$serviceDestination"
                        },
        				"dataSet":{
        					$push:{
        						"recvShot":"$recvShot","recvDestination":"$recvDestination",
        						"strokeHand":"$strokeHand","count":"$count","winCount":"$winCount",
        					}},
                        "totalPlayed": { $sum: "$count" },
                        "totalWinCount":{$sum:"$winCount"}
                    }},
                    {$project:{
                        "serviceDestination":"$_id.serviceDestination",
                        "serviceHand":"$_id.serviceHand",
                        "dataSet":1,
                        "totalPlayed":1,
                        "totalWinCount":1,
                        "_id":0,
                        "totalEfficiency": { $cond: [ { $eq: [ "$totalWinCount", 0 ] }, 0, {$multiply:[{"$divide":["$totalWinCount","$totalPlayed"]},100]}]}
                    }},
                    {$sort:sortQuery}

				]);	
				
		    	
			}
			else if(player2Name.trim() == "All L/H" || player2Name.trim() == "All R/H" || player2Name.trim() == "All")
		    {
		    	var handPlayers = [];
	      		var queryJson;
	      		if(player2Name.trim() == "All L/H")
	      		{
	      			handPlayers = leftHandPlayers;
	      			queryJson = {$in:handPlayers};
	      		}
	      		else if(player2Name.trim() == "All R/H")
	      		{
	      			handPlayers = rightHandPlayers;
	      			queryJson = {$in:handPlayers};
	      		}
	      		else if(player2Name.trim() == "All")
	      		{
	      			handPlayers = [null,""]
	      			queryJson = {$nin:handPlayers};
	      		}
	      		info = sequenceDataRecord.aggregate([
					{$match:
						{$or:[
							{
								"loggerId":userId,
				        		"player2Id":queryJson,
				        		"player1Id":player1ID,
				        		"sequence.analyticsCache.sequenceLen":{$gte:3},
				        		"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
				        		"sequence.analyticsCache.thirdBall":{$in:strokesInfo},
				        		"sequence.sequenceRecordDate" :  queryForDate2, 
				        	},
				        	{
				        		"loggerId":userId,
				        		"player1Id":queryJson,
				        		"player2Id":player1ID,
				        		"sequence.analyticsCache.sequenceLen":{$gte:3},
				        		"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
				        		"sequence.analyticsCache.thirdBall":{$in:strokesInfo},
				        		"sequence.sequenceRecordDate" :  queryForDate2, 
				        	}
				        ]}
				    },
					{$unwind:"$sequence"},
					{$match:{			
						"sequence.analyticsCache.thirdBall":{$in:strokesInfo},	
						"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},	
						"sequence.sequenceRecordDate" :  queryForDate2,				
					}},
					{$group:{
						"_id":{
							"strokeHand":"$sequence.analyticsCache.thirdBall",
							"serviceHand":"$sequence.serviceHand",
							"serviceDestination":"$sequence.serviceDestination",
							"recvShot":"$sequence.analyticsCache.secondBallShot",
							"recvDestination":"$sequence.analyticsCache.secondBallDestination"
						},
						"count":{$sum:1},
						"winCount" :  {
							$sum : {
								$cond : { 
									if: { $eq: ["$sequence.analyticsCache.winner", player1Name]}, 
									then: 1, 
									else: 
										{ 
										"$cond": {
											if: {$eq: ["$sequence.analyticsCache.winner", player1ID]}, 
											then: 1, 
											else: 0
										}
									}
								}
							}
						}
						
					}},
					{$project:{
						"strokeHand":"$_id.strokeHand","serviceHand":"$_id.serviceHand",
						"serviceDestination":"$_id.serviceDestination",
						"recvShot":"$_id.recvShot","recvDestination":"$_id.recvDestination",
						"count":1,"_id":0,"winCount":1,
						"efficiency": { $cond: [ { $eq: [ "$winCount", 0 ] }, 0, {$multiply:[{"$divide":["$winCount","$count"]},100]}]}
					}},
					{$sort:{"efficiency":-1}},
					{$group:{
                        _id:{"serviceHand":"$serviceHand",
                            "serviceDestination":"$serviceDestination"
                        },
        				"dataSet":{
        					$push:{
        						"recvShot":"$recvShot","recvDestination":"$recvDestination",
        						"strokeHand":"$strokeHand","count":"$count","winCount":"$winCount"
        					}},
                        "totalPlayed": { $sum: "$count" },
                        "totalWinCount":{$sum:"$winCount"}
                    }},
                    {$project:{
                        "serviceDestination":"$_id.serviceDestination",
                        "serviceHand":"$_id.serviceHand",
                        "dataSet":1,
                        "totalPlayed":1,
                        "totalWinCount":1,
                        "_id":0,
                        "totalEfficiency": { $cond: [ { $eq: [ "$totalWinCount", 0 ] }, 0, {$multiply:[{"$divide":["$totalWinCount","$totalPlayed"]},100]}]}
                    }},
                    {$sort:sortQuery}

				]);	
	      	}
      		
			return info;

    	}catch(e){}
  	},
  	fetch4BallShot:function(userId,data)
  	{
  		try{
		    var player1Name = data.player1Name;
		    var player2Name = data.player2Name;
		    var player1ID = data.player1ID;
		    var player2ID = data.player2ID;
		    var sort = data.sortFilterValue;
		    var dateFilter = data.dateFilter;
		    var info;
		    var dateQuery = "";
		    var losingStrokesList = [];
	     	dateQuery = computeDateFilter(dateFilter);
	     	var raw = strokes.rawCollection();
      		var distinct = Meteor.wrapAsync(raw.distinct, raw);
		    var losingStrokesInfo = losingStrokes.findOne({});
	      	if(losingStrokesInfo)
	        	losingStrokesList = losingStrokesInfo.losingStrokes;
     		var offensiveStrokes = distinct('strokeShortCode',{"strokeStyle":"offensive"});
     		var defensiveStrokes = distinct('strokeShortCode',{"strokeStyle":"defensive"});

     		var raw = playerDetailsRecord.rawCollection();
      		var distinct = Meteor.wrapAsync(raw.distinct, raw);
      		var leftHandPlayers =  distinct('_id',{"loggerId":userId,playerHand:"LeftHand"});
      		var rightHandPlayers =  distinct('_id',{"loggerId":userId,playerHand:"RightHand"});
			
      		
		    var queryForDate1;
		    var queryForDate2 = {$nin:[null]};
		    queryForPlayer2 = "";

		    if(dateQuery != "")
		    {
				queryForDate2 = {$gte:dateQuery};
		    }
				
		    if(player2Name.trim() == "All L/H")
		    	queryForPlayer2 = {$in:leftHandPlayers};
		    else if(player2Name.trim() == "All R/H")
		    	queryForPlayer2 = {$in:rightHandPlayers};
		    else 
		    	queryForPlayer2 = player2Name;

		      			
		    var checkEntry = sequenceDataRecord.findOne({
		      	"loggerId":userId,"player1Id":player1ID
		     })

		    var matchJson={};
		    if(player2Name.trim() != "All")
		   	{
		      	if(player2Name.trim() != "All L/H" && player2Name.trim() != "All R/H")
		      	{
					matchJson = {"loggerId":userId,
						"player1Id":player1ID,
						"player2Id":player2ID,
						"sequence.analyticsCache.sequenceLen":{$gte:4},
						"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
						"sequence.analyticsCache.thirdBall":{$in:offensiveStrokes},
						"sequence.analyticsCache.fourthBall":{$in:defensiveStrokes},
						"sequence.sequenceRecordDate":queryForDate2			        				        						        
					}
					matchJson1 = {"loggerId":userId,
						"player2Id":player1ID,"player1Id":player2ID,
						"sequence.analyticsCache.sequenceLen":{$gte:4},
						"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
						"sequence.analyticsCache.thirdBall":{$in:offensiveStrokes},
						"sequence.analyticsCache.fourthBall":{$in:defensiveStrokes},
						"sequence.sequenceRecordDate":queryForDate2			        				        						        
					}
					offensive_lostmatchJson = {"loggerId":userId,
						"player1Id":player1ID,"player2Id":player2ID,
						"sequence.combinedStrokes":{$size:"4"},
						"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
						"sequence.analyticsCache.thirdBall":{$in:offensiveStrokes},
						"sequence.analyticsCache.winner":{$nin:[player1Name,player1ID]},
						"sequence.sequenceRecordDate":queryForDate2			        				        						        
					}

					offensive_lostmatchJson1 = {"loggerId":userId,
						"player2Id":player1ID,"player1Id":player2ID,
						"sequence.combinedStrokes":{$size:4},
						"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
						"sequence.analyticsCache.thirdBall":{$in:offensiveStrokes},
						"sequence.analyticsCache.winner":{$nin:[player1Name,player1ID]},
						"sequence.sequenceRecordDate":queryForDate2			        				        						        
					}	

					defensive_lostmatchJson = {"loggerId":userId,
						"player1Id":player1ID,"player2Id":player2ID,
						"sequence.combinedStrokes":{$size:4},
						"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
						"sequence.analyticsCache.thirdBall":{$in:defensiveStrokes},
						"sequence.analyticsCache.winner":{$nin:[player1Name,player1ID]},
						"sequence.sequenceRecordDate":queryForDate2			        				        						        
					}

					defensive_lostmatchJson1 = {"loggerId":userId,
						"player2Id":player1ID,"player1Id":player2ID,
						"sequence.combinedStrokes":{$size:4},
						"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
						"sequence.analyticsCache.thirdBall":{$in:defensiveStrokes},
						"sequence.analyticsCache.winner":{$nin:[player1Name,player1ID]},
						"sequence.sequenceRecordDate":queryForDate2			        				        						        
					}

					offensive_wonmatchJson = {"loggerId":userId,
						"player1Id":player1ID,"player2Id":player2ID,
						"sequence.analyticsCache.sequenceLen":{$eq:3},
						"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
						"sequence.analyticsCache.thirdBall":{$in:offensiveStrokes},
						"sequence.analyticsCache.winner":{$in:[player1Name,player1ID]},
						"sequence.sequenceRecordDate":queryForDate2			        				        						        
					}

					offensive_wonmatchJson1 = {"loggerId":userId,
						"player2Id":player1ID,"player1Id":player2ID,
						"sequence.analyticsCache.sequenceLen":{$eq:3},
						"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
						"sequence.analyticsCache.thirdBall":{$in:offensiveStrokes},
						"sequence.analyticsCache.winner":{$in:[player1Name,player1ID]},
						"sequence.sequenceRecordDate":queryForDate2			        				        						        
					}	

					defensive_wonmatchJson = {"loggerId":userId,
						"player1Id":player1ID,"player2Id":player2ID,
						"sequence.analyticsCache.sequenceLen":{$eq:3},
						"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
						"sequence.analyticsCache.thirdBall":{$in:defensiveStrokes},
						"sequence.analyticsCache.winner":{$in:[player1Name,player1ID]},
						"sequence.sequenceRecordDate":queryForDate2			        				        						        
					}

					defensive_wonmatchJson1 = {"loggerId":userId,
						"player2Id":player1ID,"player1Id":player2ID,
						"sequence.analyticsCache.sequenceLen":{$eq:3},
						"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
						"sequence.analyticsCache.thirdBall":{$in:defensiveStrokes},
						"sequence.analyticsCache.winner":{$in:[player1Name,player1ID]},
						"sequence.sequenceRecordDate":queryForDate2			        				        						        
					}

		      	}
		      	else
		      	{
		      		matchJson = {"loggerId":userId,
						"player2Id":queryForPlayer2,
						"player1Id":player1ID,
						"sequence.analyticsCache.sequenceLen":{$gte:4},
						"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
						"sequence.analyticsCache.thirdBall":{$in:offensiveStrokes},
						"sequence.analyticsCache.fourthBall":{$in:defensiveStrokes},
						"sequence.sequenceRecordDate":queryForDate2			        				        						        
					}

					matchJson1 = {"loggerId":userId,
					"player1Id":queryForPlayer2,
						"player2Id":player1ID,
						"sequence.analyticsCache.sequenceLen":{$gte:4},
						"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
						"sequence.analyticsCache.thirdBall":{$in:offensiveStrokes},
						"sequence.analyticsCache.fourthBall":{$in:defensiveStrokes},
						"sequence.sequenceRecordDate":queryForDate2			        				        						        
					}	
					offensive_lostmatchJson = {"loggerId":userId,
						"player2Id":queryForPlayer2,
						"player1Id":player1ID,
						"sequence.combinedStrokes":{$size:"4"},
						"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
						"sequence.analyticsCache.thirdBall":{$in:offensiveStrokes},
						"sequence.analyticsCache.winner":{$nin:[player1Name,player1ID]},
						"sequence.sequenceRecordDate":queryForDate2			        				        						        
					}

					offensive_lostmatchJson1 = {"loggerId":userId,
						"player1Id":queryForPlayer2,
						"player2Id":player1ID,
						"sequence.combinedStrokes":{$size:4},
						"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
						"sequence.analyticsCache.thirdBall":{$in:offensiveStrokes},
						"sequence.analyticsCache.winner":{$nin:[player1Name,player1ID]},
						"sequence.sequenceRecordDate":queryForDate2			        				        						        
					}	

					defensive_lostmatchJson = {"loggerId":userId,
						"player2Id":queryForPlayer2,
						"player1Id":player1ID,
						"sequence.combinedStrokes":{$size:4},
						"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
						"sequence.analyticsCache.thirdBall":{$in:defensiveStrokes},
						"sequence.analyticsCache.winner":{$nin:[player1Name,player1ID]},
						"sequence.sequenceRecordDate":queryForDate2			        				        						        
					}

					defensive_lostmatchJson1 = {"loggerId":userId,
						"player1Id":queryForPlayer2,
						"player2Id":player1ID,
						"sequence.combinedStrokes":{$size:4},
						"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
						"sequence.analyticsCache.thirdBall":{$in:defensiveStrokes},
						"sequence.analyticsCache.winner":{$nin:[player1Name,player1ID]},
						"sequence.sequenceRecordDate":queryForDate2			        				        						        
					}

					offensive_wonmatchJson = {"loggerId":userId,
						"player2Id":queryForPlayer2,
						"player1Id":player1ID,
						"sequence.analyticsCache.sequenceLen":{$eq:3},
						"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
						"sequence.analyticsCache.thirdBall":{$in:offensiveStrokes},
						"sequence.analyticsCache.winner":{$in:[player1Name,player1ID]},
						"sequence.sequenceRecordDate":queryForDate2			        				        						        
					}

					offensive_wonmatchJson1 = {"loggerId":userId,
						"player1Id":queryForPlayer2,
						"player2Id":player1ID,
						"sequence.analyticsCache.sequenceLen":{$eq:3},
						"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
						"sequence.analyticsCache.thirdBall":{$in:offensiveStrokes},
						"sequence.analyticsCache.winner":{$in:[player1Name,player1ID]},
						"sequence.sequenceRecordDate":queryForDate2			        				        						        
					}	

					defensive_wonmatchJson = {"loggerId":userId,
						"player2Id":queryForPlayer2,
						"player1Id":player1ID,
						"sequence.analyticsCache.sequenceLen":{$eq:3},
						"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
						"sequence.analyticsCache.thirdBall":{$in:defensiveStrokes},
						"sequence.analyticsCache.winner":{$in:[player1Name,player1ID]},
						"sequence.sequenceRecordDate":queryForDate2			        				        						        
					}

					defensive_wonmatchJson1 = {"loggerId":userId,
						"player1Id":queryForPlayer2,
						"player2Id":player1ID,
						"sequence.analyticsCache.sequenceLen":{$eq:3},
						"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
						"sequence.analyticsCache.thirdBall":{$in:defensiveStrokes},
						"sequence.analyticsCache.winner":{$in:[player1Name,player1ID]},
						"sequence.sequenceRecordDate":queryForDate2			        				        						        
					}


		      	}
				
		      		      	
		      	

				
			}      	    
		    else
		    {
		      	
				matchJson = {"loggerId":userId,
					"player1Id":player1ID,
					"sequence.analyticsCache.sequenceLen":{$gte:4},
					"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
					"sequence.analyticsCache.thirdBall":{$in:offensiveStrokes},
					"sequence.analyticsCache.fourthBall":{$in:defensiveStrokes},
					"sequence.sequenceRecordDate":queryForDate2			        				        						        
				}
		      		      	
		      	matchJson1 = {"loggerId":userId,
					"player2Id":player1ID,
					"sequence.analyticsCache.sequenceLen":{$gte:4},
					"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
					"sequence.analyticsCache.thirdBall":{$in:offensiveStrokes},
					"sequence.analyticsCache.fourthBall":{$in:defensiveStrokes},
					"sequence.sequenceRecordDate":queryForDate2			        				        						        
				}

		      		      	
		      
				offensive_lostmatchJson = {"loggerId":userId,
					"player1Id":player1ID,
					"sequence.combinedStrokes":{$size:"4"},
					"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
					"sequence.analyticsCache.thirdBall":{$in:offensiveStrokes},
					"sequence.analyticsCache.winner":{$nin:[player1Name,player1ID]},
					"sequence.sequenceRecordDate":queryForDate2			        				        						        
				}

				offensive_lostmatchJson1 = {"loggerId":userId,
					"player2Id":player1ID,
					"sequence.combinedStrokes":{$size:4},
					"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
					"sequence.analyticsCache.thirdBall":{$in:offensiveStrokes},
					"sequence.analyticsCache.winner":{$nin:[player1Name,player1ID]},
					"sequence.sequenceRecordDate":queryForDate2			        				        						        
				}	

				defensive_lostmatchJson = {"loggerId":userId,
					"player1Id":player1ID,
					"sequence.combinedStrokes":{$size:4},
					"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
					"sequence.analyticsCache.thirdBall":{$in:defensiveStrokes},
					"sequence.analyticsCache.winner":{$nin:[player1Name,player1ID]},
					"sequence.sequenceRecordDate":queryForDate2			        				        						        
				}

				defensive_lostmatchJson1 = {"loggerId":userId,
					"player2Id":player1ID,
					"sequence.combinedStrokes":{$size:4},
					"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
					"sequence.analyticsCache.thirdBall":{$in:defensiveStrokes},
					"sequence.analyticsCache.winner":{$nin:[player1Name,player1ID]},
					"sequence.sequenceRecordDate":queryForDate2			        				        						        
				}

				offensive_wonmatchJson = {"loggerId":userId,
					"player1Id":player1ID,
					"sequence.analyticsCache.sequenceLen":{$eq:3},
					"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
					"sequence.analyticsCache.thirdBall":{$in:offensiveStrokes},
					"sequence.analyticsCache.winner":{$in:[player1Name,player1ID]},
					"sequence.sequenceRecordDate":queryForDate2			        				        						        
				}

				offensive_wonmatchJson1 = {"loggerId":userId,
					"player2Id":player1ID,
					"sequence.analyticsCache.sequenceLen":{$eq:3},
					"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
					"sequence.analyticsCache.thirdBall":{$in:offensiveStrokes},
					"sequence.analyticsCache.winner":{$in:[player1Name,player1ID]},
					"sequence.sequenceRecordDate":queryForDate2			        				        						        
				}	

				defensive_wonmatchJson = {"loggerId":userId,
					"player1Id":player1ID,
					"sequence.analyticsCache.sequenceLen":{$eq:3},
					"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
					"sequence.analyticsCache.thirdBall":{$in:defensiveStrokes},
					"sequence.analyticsCache.winner":{$in:[player1Name,player1ID]},
					"sequence.sequenceRecordDate":queryForDate2			        				        						        
				}

				defensive_wonmatchJson1 = {"loggerId":userId,
					"player2Id":player1ID,
					"sequence.analyticsCache.sequenceLen":{$eq:3},
					"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
					"sequence.analyticsCache.thirdBall":{$in:defensiveStrokes},
					"sequence.analyticsCache.winner":{$in:[player1Name,player1ID]},
					"sequence.sequenceRecordDate":queryForDate2			        				        						        
				}
		      	
		    }
		      
		      	 

		      	
		    var offensive_defensive = sequenceDataRecord.aggregate([
				{$match:
					{$or:[matchJson,matchJson1]}
				},
				{$unwind:"$sequence"},
				{$match:{			
					"sequence.analyticsCache.thirdBall":{$in:offensiveStrokes},	
					"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},	
					"sequence.analyticsCache.fourthBall":{$in:defensiveStrokes},
					"sequence.sequenceRecordDate":queryForDate2	
				}},
				{$group:{
					"_id":null,	"count":{$sum:1},
				}},
				{$project:{
					"strokeHand1": { $literal: "offensive"},
					"strokeHand2":{ $literal: "defensive" },"count":1,"_id":0
				}}
			]);

			var offensive_offensive = sequenceDataRecord.aggregate([
				{$match:
					{$or:[matchJson,matchJson1]}
				},
				{$unwind:"$sequence"},
				{$match:{			
					"sequence.analyticsCache.thirdBall":{$in:offensiveStrokes},	
					"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},	
					"sequence.analyticsCache.fourthBall":{$in:offensiveStrokes},	
					"sequence.sequenceRecordDate":queryForDate2			        			        		
				}},
				{$group:{
					"_id":null,"count":{$sum:1},
				}},
				{$project:{
					"strokeHand1": { $literal: "offensive"},
					"strokeHand2":{ $literal: "offensive" },"count":1,"_id":0
				}}
			]);

			var defensive_offensive = sequenceDataRecord.aggregate([
				{$match:
					{$or:[matchJson,matchJson1]}
				},
				{$unwind:"$sequence"},
				{$match:{			
					"sequence.analyticsCache.thirdBall":{$in:defensiveStrokes},	
					"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},	
					"sequence.analyticsCache.fourthBall":{$in:offensiveStrokes},	
					"sequence.sequenceRecordDate":queryForDate2			        		        		
				}},
				{$group:{
					"_id":null,"count":{$sum:1},
				}},
				{$project:{
					"strokeHand1": { $literal: "defensive"},
					"strokeHand2":{ $literal: "offensive" },"count":1,"_id":0
				}}
			]);

			var defensive_defensive = sequenceDataRecord.aggregate([
				{$match:
					{$or:[matchJson,matchJson1]}
				},
				{$unwind:"$sequence"},
				{$match:{			
					"sequence.analyticsCache.thirdBall":{$in:defensiveStrokes},	
					"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},	
					"sequence.analyticsCache.fourthBall":{$in:defensiveStrokes},
					"sequence.sequenceRecordDate":queryForDate2			        		        	
				}},
				{$group:{
					"_id":null,	
					"count":{$sum:1},
				}},
				{$project:{
					"strokeHand1": { $literal: "defensive"},
					"strokeHand2":{ $literal: "defensive" },"count":1,"_id":0
				}}
			]);

			var offensive_lost = sequenceDataRecord.aggregate([
				{$match:
					{$or:[offensive_lostmatchJson,offensive_lostmatchJson1]}
				},
				{$unwind:"$sequence"},
				{$match:{			
					"sequence.analyticsCache.thirdBall":{$in:offensiveStrokes},	
					"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},	
					"sequence.analyticsCache.winner":{$nin:[player1Name,player1ID]},
					"sequence.sequenceRecordDate":queryForDate2	,
					"sequence.combinedStrokes":{$size:4},
				}},
				{$group:{
					"_id":null,	"count":{$sum:1},
				}},
				{$project:{
					"strokeHand1": { $literal: "offensive"},
					"strokeHand2":{ $literal: "lost" },"count":1,"_id":0
				}}
			]);

			var defensive_lost = sequenceDataRecord.aggregate([
				{$match:
					{$or:[defensive_lostmatchJson,defensive_lostmatchJson1]}
				},
				{$unwind:"$sequence"},
				{$match:{			
					"sequence.analyticsCache.thirdBall":{$in:defensiveStrokes},	
					"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
					"sequence.analyticsCache.winner":{$nin:[player1Name,player1ID]},
					"sequence.combinedStrokes":{$size:4},
					"sequence.sequenceRecordDate":queryForDate2	
				}},
				{$group:{
					"_id":null,	"count":{$sum:1},
				}},
				{$project:{
					"strokeHand1": { $literal: "defensive"},
					"strokeHand2":{ $literal: "lost" },"count":1,"_id":0
				}}
			]);

			var offensive_win = sequenceDataRecord.aggregate([
				{$match:
					{$or:[offensive_wonmatchJson,offensive_wonmatchJson1]}
				},
				{$unwind:"$sequence"},
				{$match:{			
					"sequence.analyticsCache.thirdBall":{$in:offensiveStrokes},	
					"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
					"sequence.analyticsCache.winner":{$in:[player1Name,player1ID]},
					"sequence.analyticsCache.sequenceLen":{$eq:3},
					"sequence.sequenceRecordDate":queryForDate2
				}},
				{$group:{
					"_id":null,				
					"count":{$sum:1},
				}},
				{$project:{
					"strokeHand1": { $literal: "offensive"},
					"strokeHand2":{ $literal: "win" },"count":1,"_id":0,"thirdBall":1
				}}
			]);

			var defensive_win = sequenceDataRecord.aggregate([
				{$match:
					{$or:[defensive_wonmatchJson,defensive_wonmatchJson1]}
				},
				{$unwind:"$sequence"},
				{$match:{			
					"sequence.analyticsCache.thirdBall":{$in:defensiveStrokes},	
					"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},	
					"sequence.analyticsCache.winner":{$in:[player1Name,player1ID]},
					"sequence.analyticsCache.sequenceLen":{$eq:3},	
					"sequence.sequenceRecordDate":queryForDate2
				}},
				{$group:{
					"_id":null,	"count":{$sum:1},
				}},
				{$project:{
					"strokeHand1": { $literal: "defensive"},
					"strokeHand2":{ $literal: "win" },"count":1,"_id":0
				}}
			]);

			
			

			var result = offensive_defensive.concat(offensive_offensive);
			result = result.concat(defensive_offensive);
			result = result.concat(defensive_defensive);
			result = result.concat(offensive_lost);
			result = result.concat(defensive_lost);
			result = result.concat(offensive_win);
			result = result.concat(defensive_win);
			return result;
		}catch(e){}
  	},
  	fetchServiceResponse:function(userId,data)
  	{
  		try{
		    var player1Name = data.player1Name;
		    var player2Name = data.player2Name;
		    var player1ID = data.player1ID;
		    var player2ID = data.player2ID;
		    var sort = data.sortFilterValue;
		    var dateFilter = data.dateFilter;
		    var info;
		    var dateQuery = "";
		    var losingStrokesList = [];
		    var sortQuery;
		    var analysisType = data.analysisType;
		    if(analysisType == "App")
		    	sortQuery = {"totalPlayed":-1}
		    else
		    	sortQuery = {"dataSet.count":-1}

	     	dateQuery = computeDateFilter(dateFilter);
		    var queryForDate2 = {$nin:[null]};
		    if(dateQuery != "")	    
				queryForDate2 = {$gte:dateQuery};
		    
	     	var raw = strokes.rawCollection();
      		var distinct = Meteor.wrapAsync(raw.distinct, raw);

		    var losingStrokesInfo = losingStrokes.findOne({});
	      	if(losingStrokesInfo)
	        	losingStrokesList = losingStrokesInfo.losingStrokes;
     		var strokesInfo = distinct('strokeShortCode',{"strokeStyle":"offensive"});

     		var raw = playerDetailsRecord.rawCollection();
      		var distinct = Meteor.wrapAsync(raw.distinct, raw);
      		var leftHandPlayers =  distinct('_id',{"loggerId":userId,playerHand:"LeftHand"});
      		var rightHandPlayers =  distinct('_id',{"loggerId":userId,playerHand:"RightHand"});
				
      		if(player2Name.trim() != "All" && player2Name.trim() != "All L/H" && player2Name.trim() != "All R/H")
		    {
		        info = sequenceDataRecord.aggregate([
					{$match:
						{$or:[
							{
								"loggerId":userId,
				        		"player1Id":player1ID,"player2Id":player2ID,
				        		"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
				        		"sequence.sequenceRecordDate" :  queryForDate2,
				        		"sequence.analyticsCache.sequenceLen":{$gte:2},

				        	},
				        	{
				        		"loggerId":userId,
				        		"player2Id":player1ID,"player1Id":player2ID,
				        		"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
				        		"sequence.sequenceRecordDate" :  queryForDate2,
				        		"sequence.analyticsCache.sequenceLen":{$gte:2},
				        	}
				        ]}
				    },
					{$unwind:"$sequence"},
					{$match:{			
						"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},	
						"sequence.sequenceRecordDate" :  queryForDate2,	
						"sequence.analyticsCache.sequenceLen":{$gte:2},
			
					}},
					{$group:{
						"_id":{
							"strokeHand":"$sequence.analyticsCache.secondBallShot",
							"serviceHand":"$sequence.serviceHand",
							"serviceDestination":"$sequence.serviceDestination",				
						},
						"count":{$sum:1},												
					}},
					{$project:{
						"strokeHand":"$_id.strokeHand",
						"serviceHand":"$_id.serviceHand",
						"serviceDestination":"$_id.serviceDestination",
						"count":1,"_id":0,
					}},
					{$sort:{"count":-1}},
					{$group:{
                        _id:{"serviceHand":"$serviceHand",
                            "serviceDestination":"$serviceDestination"
                        },
        				"dataSet":{
        					$push:{
        						"strokeHand":"$strokeHand","count":"$count"
        					}},
                        "totalPlayed": { $sum: "$count" },
                    }},
                    {$project:{
                        "serviceDestination":"$_id.serviceDestination",
                        "serviceHand":"$_id.serviceHand",
                        "dataSet":1,
                        "totalPlayed":1,
                        "_id":0
                    }},
                    {$sort:sortQuery}
				]);						    	
			}
      		else if(player2Name.trim() == "All L/H")
			{				
		        info = sequenceDataRecord.aggregate([
					{$match:
						{$or:[
							{
								"loggerId":userId,
				        		"player2Id":{$in:leftHandPlayers},
				        		"player1Id":player1ID,
				        		"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
				        		"sequence.sequenceRecordDate" :  queryForDate2, 
				        		"sequence.analyticsCache.sequenceLen":{$gte:2},

				        	},
				        	{
				        		"loggerId":userId,
				        		"player1Id":{$in:leftHandPlayers},"player2Id":player1ID,
				        		"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
				        		"sequence.sequenceRecordDate" :  queryForDate2, 
				        		"sequence.analyticsCache.sequenceLen":{$gte:2},

				        	}
				        ]}
				    },
					{$unwind:"$sequence"},
					{$match:{			
						"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},	
						"sequence.sequenceRecordDate" :  queryForDate2,	
						"sequence.analyticsCache.sequenceLen":{$gte:2},
			
					}},
					{$group:{
						"_id":{
							"strokeHand":"$sequence.analyticsCache.secondBallShot",
							"serviceHand":"$sequence.serviceHand",
							"serviceDestination":"$sequence.serviceDestination",
						},
						"count":{$sum:1},												
					}},

					{$project:{
						"strokeHand":"$_id.strokeHand","serviceHand":"$_id.serviceHand",
						"serviceDestination":"$_id.serviceDestination",
						"count":1,"_id":0
					}},
					{$sort:{"count":-1}},
					{$group:{
                        _id:{"serviceHand":"$serviceHand",
                            "serviceDestination":"$serviceDestination"
                        },
        				"dataSet":{
        					$push:{
        						"strokeHand":"$strokeHand","count":"$count",
        					}},
                        "totalPlayed": { $sum: "$count" },
                    }},
                    {$project:{
                        "serviceDestination":"$_id.serviceDestination",
                        "serviceHand":"$_id.serviceHand",
                        "dataSet":1,
                        "totalPlayed":1,
                        "_id":0
                    }},
                    {$sort:sortQuery}
				]);		
			}
			else if(player2Name.trim() == "All R/H")
			{
		        info = sequenceDataRecord.aggregate([
					{$match:
						{$or:[
							{	
								"loggerId":userId,
				        		"player1Id":player1ID,"player2Id":{$in:rightHandPlayers},
				        		"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
				        		"sequence.sequenceRecordDate" :  queryForDate2,
				        		"sequence.analyticsCache.sequenceLen":{$gte:2},

				        	},
				        	{
				        		"loggerId":userId,
				        		"player1Id":{$in:rightHandPlayers},"player2Id":player1ID,
				        		"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
				        		"sequence.sequenceRecordDate" :  queryForDate2, 
				        		"sequence.analyticsCache.sequenceLen":{$gte:2},

				        	}
				        ]}
				    },
					{$unwind:"$sequence"},
					{$match:{			
						"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},	
						"sequence.sequenceRecordDate" :  queryForDate2,	
						"sequence.analyticsCache.sequenceLen":{$gte:2},
				
					}},
					{$group:{
						"_id":{
							"strokeHand":"$sequence.analyticsCache.secondBallShot",
							"serviceHand":"$sequence.serviceHand",
							"serviceDestination":"$sequence.serviceDestination",
						},
						"count":{$sum:1},											
					}},
					{$project:{
						"strokeHand":"$_id.strokeHand","serviceHand":"$_id.serviceHand",
						"serviceDestination":"$_id.serviceDestination",
						"count":1,"_id":0
					}},
					{$sort:{"count":-1}},
					{$group:{
                        _id:{"serviceHand":"$serviceHand",
                            "serviceDestination":"$serviceDestination"
                        },
        				"dataSet":{
        					$push:{
        						"strokeHand":"$strokeHand","count":"$count"
        					}},
                        "totalPlayed": { $sum: "$count" },
                    }},
                    {$project:{
                        "serviceDestination":"$_id.serviceDestination",
                        "serviceHand":"$_id.serviceHand",
                        "dataSet":1,
                        "totalPlayed":1,
                        "_id":0
                    }},
                    {$sort:sortQuery}
				]);	
			}
			else if(player2Name.trim() == "All")
			{		
		        info = sequenceDataRecord.aggregate([
					{$match:
						{$or:[
							{
								"loggerId":userId,
				        		"player1Id":player1ID,
				        		"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
				        		"sequence.sequenceRecordDate" :  queryForDate2,
				        		"sequence.analyticsCache.sequenceLen":{$gte:2},
		        	 
				        	},
				        	{
				        		"loggerId":userId,
				        		"player2Id":player1ID,
				        		"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},
				        		"sequence.sequenceRecordDate" :  queryForDate2,
				        		"sequence.analyticsCache.sequenceLen":{$gte:2},


				       	 	}
				        ]}
				    },
					{$unwind:"$sequence"},
					{$match:{			
						"sequence.analyticsCache.serviceBy": {$in:[player1Name,player1ID]},	
						"sequence.sequenceRecordDate" :  queryForDate2,
						"sequence.analyticsCache.sequenceLen":{$gte:2},

					}},
					{$group:{
						"_id":{
							"strokeHand":"$sequence.analyticsCache.secondBallShot",
							"serviceHand":"$sequence.serviceHand",
							"serviceDestination":"$sequence.serviceDestination",
						},
						"count":{$sum:1},												
					}},
					{$project:{
						"strokeHand":"$_id.strokeHand","serviceHand":"$_id.serviceHand",
						"serviceDestination":"$_id.serviceDestination",
						"count":1,"_id":0
					}},
					{$sort:{"count":-1}},
					{$group:{
                        _id:{"serviceHand":"$serviceHand",
                            "serviceDestination":"$serviceDestination"
                        },
        				"dataSet":{
        					$push:{
        						"strokeHand":"$strokeHand","count":"$count"
        					}},
                        "totalPlayed": { $sum: "$count" },
                    }},
                    {$project:{
                        "serviceDestination":"$_id.serviceDestination",
                        "serviceHand":"$_id.serviceHand",
                        "dataSet":1,
                        "totalPlayed":1,
                        "_id":0
                    }},
                    {$sort:sortQuery}
				]);				
			}
			return info;

    	}catch(e){}
  	},

});


