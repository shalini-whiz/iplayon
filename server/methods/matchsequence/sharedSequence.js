Meteor.methods({
	"shareDistinctSequence":function(data)
	{
		try
		{
      		var loggerId = data.loggerId;
      		var sharedId = data.sharedId;
      		var player1Name = data.player1Name;
      		var player2Name = data.player2Name;
      		var player1ID = data.player1ID;
      		var player2ID = data.player2ID;
      		var sequenceDataRecordID = "";

        	var sequenceDataRecordInfo = sequenceDataRecord.findOne({"loggerId":loggerId,"player1Id" : player1ID,"player2Id":player2ID});
	        if(sequenceDataRecordInfo)
	          sequenceDataRecordID = sequenceDataRecordInfo._id;
	        else
	        {
	          var sequenceDataRecordInfo = sequenceDataRecord.findOne({"loggerId":loggerId,"player2Id" : player1ID,"player1Id":player2ID});
	          if(sequenceDataRecordInfo)
	            sequenceDataRecordID = sequenceDataRecordInfo._id;
	        }
	        var oldDetailsEntry = sequenceDataRecord.findOne({"_id":sequenceDataRecordID});
	       	var sequenceCount = 0;
	        if(oldDetailsEntry)
	        {
	          	oldPlayer2Id = oldDetailsEntry.player2Id;
	          	oldPlayer1Id = oldDetailsEntry.player1Id;
	          	var newPlayer1Id;
	          	var newPlayer2Id;

        		var player1RegObj = new RegExp('^' +oldDetailsEntry.player1Name+'$',"i");
       			var player2RegObj = new RegExp('^' +oldDetailsEntry.player2Name+'$',"i");

       			var player1Details = playerDetailsRecord.findOne({"loggerId":loggerId,"_id":oldPlayer1Id});
				var player2Details = playerDetailsRecord.findOne({"loggerId":loggerId,"_id":oldPlayer2Id});

				var player1Check = {};
				player1Check["loggerId"] = sharedId;
				player1Check["playerName"] = {$regex:player1RegObj};

				var player2Check = {};
				player2Check["loggerId"] = sharedId;
				player2Check["playerName"] = {$regex:player2RegObj};


				if(player1Details.userId)	
					player1Check["userId"] = player1Details.userId;

				if(player2Details.userId)
					player2Check["userId"] = player2Details.userId;

	          	var firstPlayerEntry = playerDetailsRecord.findOne(player1Check);

	        	var secondPlayerEntry = playerDetailsRecord.findOne(player2Check);

	        	if (firstPlayerEntry == undefined) 
	        	{
	        		var player1Details = playerDetailsRecord.findOne({"loggerId":loggerId,"_id":oldPlayer1Id});
	        		var newPlayer1Details = player1Details;
	        		newPlayer1Details.loggerId = sharedId;
	        		newPlayer1Details._id = Random.id();
	     
	        		var player_id = playerDetailsRecord.insert(newPlayer1Details);
	        		newPlayer1Id = player_id;

	        	}
	        	else
	        		newPlayer1Id = firstPlayerEntry._id;

	        	if(secondPlayerEntry == undefined)
	        	{
					var player2Details = playerDetailsRecord.findOne({"loggerId":loggerId,"_id":oldPlayer2Id});
	        		var newPlayer2Details = player2Details;
	        		newPlayer2Details.loggerId = sharedId;
	        		newPlayer2Details._id = Random.id();
	     
	        		var player_id = playerDetailsRecord.insert(newPlayer2Details);
	        		newPlayer2Id = player_id;

	        	}
	        	else
	        		newPlayer2Id = secondPlayerEntry._id;



	        	var newDetailsEntry = {};
	        	
	        	sequenceCount = oldDetailsEntry.sequence.length;
	            for(var m=0; m<oldDetailsEntry.sequence.length;m++)
	            {
	              if(oldDetailsEntry.sequence[m].analyticsCache.serviceBy == oldPlayer2Id)
	                oldDetailsEntry.sequence[m].analyticsCache.serviceBy = newPlayer2Id;
	              else if(oldDetailsEntry.sequence[m].analyticsCache.serviceBy == oldPlayer1Id)
	                oldDetailsEntry.sequence[m].analyticsCache.serviceBy = newPlayer1Id;

	              if(oldDetailsEntry.sequence[m].analyticsCache.winner == oldPlayer2Id)
	                oldDetailsEntry.sequence[m].analyticsCache.winner = newPlayer2Id;
	              else if(oldDetailsEntry.sequence[m].analyticsCache.winner == oldPlayer1Id)
	                oldDetailsEntry.sequence[m].analyticsCache.winner = newPlayer1Id;

	                    
	              for(var n=0;n<oldDetailsEntry.sequence[m].strokesPlayed.length;n++)
	              {
	                if(oldDetailsEntry.sequence[m].strokesPlayed[n].strokePlayed == oldPlayer2Id)
	                  oldDetailsEntry.sequence[m].strokesPlayed[n].strokePlayed = newPlayer2Id;
	                else if(oldDetailsEntry.sequence[m].strokesPlayed[n].strokePlayed == oldPlayer1Id)
	                  oldDetailsEntry.sequence[m].strokesPlayed[n].strokePlayed = newPlayer1Id;
	              }	            
	            }
	            newDetailsEntry["sequence"] = oldDetailsEntry.sequence;


	            sequenceDataRecord.update({
	            	"_id":sequenceDataRecordID
	            },
	            {$set:{
	            	"sequence":newDetailsEntry.sequence,
	            	"player1Id":newPlayer1Id,
	            	"player2Id":newPlayer2Id,
	            	"loggerId":sharedId
	            }}
	            )


	        }

        	var setOfPlayers = [{"userId":oldPlayer1Id,"playerName":player1Name},{"userId":oldPlayer2Id,"playerName":player2Name}];

	        var shareCount = sequenceCount;
        
	        var sharedHistory = {"loggerId":loggerId,
	          "sharedId":sharedId,
	          "player1Name":player1Name,
	          "player2Name":player2Name,
	          "sequenceCount":shareCount,
	          "playerList":setOfPlayers
	        };
        	sequenceShareHistory.insert(sharedHistory);

	        return true;





		}catch(e)
		{
			return false;
		}
	},
	"shareSequenceInHaul":function(data)
	{
		try{
			var loggerId = data.loggerId;
      		var sharedId = data.sharedId;
      		var player1Name = data.player1Name;
      		var player2Name = data.player2Name;
      		var player1ID = data.player1ID;
      		var player2ID = data.player2ID;

			var raw = playerDetailsRecord.rawCollection();
      		var distinct = Meteor.wrapAsync(raw.distinct, raw);
      		var leftHandPlayers =  distinct('_id',{"loggerId":loggerId,playerHand:"LeftHand"});
      		var rightHandPlayers =  distinct('_id',{"loggerId":loggerId,playerHand:"RightHand"});

			var searchPlayers = {$nin:[null,""]};
        	if(player2Name.trim() == "All L/H")
          		searchPlayers = {$in:leftHandPlayers};
        	if(player2Name.trim() == "All R/H")
          		searchPlayers = {$in:rightHandPlayers};

      		var sequenceDataRecordInfo = sequenceDataRecord.find(
      			
      			{$or:[
      				{"loggerId":loggerId,"player1Id":player1ID,"player2Id":searchPlayers},
      				{"loggerId":loggerId,"player2Id":player1ID,"player1Id":searchPlayers}
      				]}
      			

      			).fetch();
      		if(sequenceDataRecordInfo.length > 0)
      		{
      			for(var i=0;i<sequenceDataRecordInfo.length;i++)
      			{
      				
			        var dataRecord = sequenceDataRecordInfo[i];
      				var sequenceDataRecordID = "";
      				var sequenceCount = 0;

			        if(dataRecord)
			        {
			        	sequenceDataRecordID = dataRecord._id;
	      				var oldPlayer1Id = dataRecord.player1Id;
	      				var oldPlayer2Id = dataRecord.player2Id;


			          	var newPlayer1Id;
			          	var newPlayer2Id;

		        		var player1RegObj = new RegExp('^' +dataRecord.player1Name+'$',"i");
		       			var player2RegObj = new RegExp('^' +dataRecord.player2Name+'$',"i");

		       			var player1Details = playerDetailsRecord.findOne({"loggerId":loggerId,"_id":oldPlayer1Id});
						var player2Details = playerDetailsRecord.findOne({"loggerId":loggerId,"_id":oldPlayer2Id});

						var player1Check = {};
						player1Check["loggerId"] = sharedId;
						player1Check["playerName"] = {$regex:player1RegObj};

						var player2Check = {};
						player2Check["loggerId"] = sharedId;
						player2Check["playerName"] = {$regex:player2RegObj};


						if(player1Details.userId)	
							player1Check["userId"] = player1Details.userId;

						if(player2Details.userId)
							player2Check["userId"] = player2Details.userId;

			          	var firstPlayerEntry = playerDetailsRecord.findOne(player1Check);

			        	var secondPlayerEntry = playerDetailsRecord.findOne(player2Check);

			        	if (firstPlayerEntry == undefined) 
			        	{
			        		var player1Details = playerDetailsRecord.findOne({"loggerId":loggerId,"_id":oldPlayer1Id});
			        		var newPlayer1Details = player1Details;
			        		newPlayer1Details.loggerId = sharedId;
			        		newPlayer1Details._id = Random.id();
			     
			        		var player_id = playerDetailsRecord.insert(newPlayer1Details);
			        		newPlayer1Id = player_id;

			        	}
			        	else
			        		newPlayer1Id = firstPlayerEntry._id;

			        	if(secondPlayerEntry == undefined)
			        	{
							var player2Details = playerDetailsRecord.findOne({"loggerId":loggerId,"_id":oldPlayer2Id});
			        		var newPlayer2Details = player2Details;
			        		newPlayer2Details.loggerId = sharedId;
			        		newPlayer2Details._id = Random.id();
			     
			        		var player_id = playerDetailsRecord.insert(newPlayer2Details);
			        		newPlayer2Id = player_id;

			        	}
			        	else
			        		newPlayer2Id = secondPlayerEntry._id;



			        	var newDetailsEntry = {};
			        	sequenceCount = dataRecord.sequence.length;

			            for(var m=0; m<dataRecord.sequence.length;m++)
			            {
			              	if(dataRecord.sequence[m].analyticsCache.serviceBy == oldPlayer2Id)
			                	dataRecord.sequence[m].analyticsCache.serviceBy = newPlayer2Id;
			             	 else if(dataRecord.sequence[m].analyticsCache.serviceBy == oldPlayer1Id)
			                	dataRecord.sequence[m].analyticsCache.serviceBy = newPlayer1Id;

			              	if(dataRecord.sequence[m].analyticsCache.winner == oldPlayer2Id)
			                	dataRecord.sequence[m].analyticsCache.winner = newPlayer2Id;
			              	else if(dataRecord.sequence[m].analyticsCache.winner == oldPlayer1Id)
			                	dataRecord.sequence[m].analyticsCache.winner = newPlayer1Id;

			                    
			              	for(var n=0;n<dataRecord.sequence[m].strokesPlayed.length;n++)
			              	{
			                	if(dataRecord.sequence[m].strokesPlayed[n].strokePlayed == oldPlayer2Id)
			                  		dataRecord.sequence[m].strokesPlayed[n].strokePlayed = newPlayer2Id;
			                	else if(dataRecord.sequence[m].strokesPlayed[n].strokePlayed == oldPlayer1Id)
			                  		dataRecord.sequence[m].strokesPlayed[n].strokePlayed = newPlayer1Id;
			              	}	            
			            }
			            newDetailsEntry["sequence"] = dataRecord.sequence;


			            var status = sequenceDataRecord.update({
			            	"_id":sequenceDataRecordID
			            	},
				            {$set:{
				            	"sequence":newDetailsEntry.sequence,
				            	"player1Id":newPlayer1Id,
				            	"player2Id":newPlayer2Id,
				            	"loggerId":sharedId
				            }});
			            var setOfPlayers = [{"userId":oldPlayer1Id,"playerName":dataRecord.player1Name},{"userId":oldPlayer2Id,"playerName":dataRecord.player2Name}];

	        			var shareCount = sequenceCount;
        
				        var sharedHistory = {"loggerId":loggerId,
				          "sharedId":sharedId,
				          "player1Name":player1Name,
				          "player2Name":player2Name,
				          "sequenceCount":shareCount,
				          "playerList":setOfPlayers
				        };
        				sequenceShareHistory.insert(sharedHistory);
			        }
      			}

      			
      		}
      		return true;
	       
		}catch(e)
		{
			return false;
		}
	},
	sharedHistory:function(userId)
	{
	    try
	    {
	      var result = sequenceShareHistory.aggregate([
	        {$match:{"loggerId":userId}},
	        {$project:{
	          "sharedId":1,
	          "player1Name":1,
	          "player2Name":1,
	          "sequenceCount":1,
	          "playerList":1,
	          "sequenceSharedDate":1
	        }},
	        {
                $lookup:{
                    from: "users",       // other table name
                    localField: "sharedId",   // name of users table field
                    foreignField: "userId", // name of userinfo table field
                    as: "shareUserDetails"         // alias for userinfo table
                }
            },
            {$unwind:"$shareUserDetails" },
            { 
                            $project : { 
                                "_id":1,
                                "sharedId":1,
                                "player1Name":1,
                                "player2Name":1,
                                "sequenceCount":1,
                                "sequenceSharedDate":1,
                                "sharedUser":"$shareUserDetails.userName",
                                "playerList":1
                            } 
            }     
	      ]);
	     

	      return result;
	    }catch(e){}
	},
})