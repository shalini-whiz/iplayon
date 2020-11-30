Meteor.methods({

	fetchRallyAnalysisSummation:function(userId,data)
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
		    else if(player2Name.trim() == "All L/H")
		    {		    	
		      	info = sequenceDataRecord.aggregate([
			        {$match:
			        	{$or:[
			        		{
				        		"loggerId":userId,
					        	"player2Id":{$in:leftHandPlayers},
					        	"player1Id":player1ID,
					        	sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$gte:sequenceLen}}},
					        	"sequence.sequenceRecordDate" :  queryForDate2
			        		},
			        		{
			        			"loggerId":userId,
					        	"player1Id":{$in:leftHandPlayers},
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
		    else if(player2Name.trim() == "All R/H")
		    {    	
		      	info = sequenceDataRecord.aggregate([
			        {$match:
			        	{$or:[
			        		{
				        		"loggerId":userId,
					        	"player2Id":{$in:rightHandPlayers},
					        	"player1Id":player1ID,
					        	sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$gte:sequenceLen}}},
					        	"sequence.sequenceRecordDate" :  queryForDate2	
			        		},
			        		{
			        			"loggerId":userId,
					        	"player1Id":{$in:rightHandPlayers},
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
		    else
		    {  	
		      	info = sequenceDataRecord.aggregate([
			        {$match:
			        	{$or:[
			        		{
				        		"loggerId":userId,
					        	"player1Id":player1ID,
					        	sequence: { $elemMatch: {"analyticsCache.sequenceLen": {$gte:sequenceLen}}},
					        	"sequence.sequenceRecordDate" :  queryForDate2	
			        		},
			        		{
			        			"loggerId":userId,
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
					    ]},
					    
					}},
					{$sort:sortQuery}

				]);					
		    }

		    return info;
  		}catch(e){}
  	},

})