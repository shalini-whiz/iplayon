Meteor.methods ({
  "initSNSMatchRecords": function (userDetails) {
  	check(userDetails,String)
  	var JSONArray=[];
  	//for all events of project type single
  	var getEvents = events.find({"tournamentId":userDetails,"projectType":1}).fetch().forEach(function(lEvents,i){
  		//find snscollection already have the event
  		var SNSCollectionDBRec = SNSCollectionDB.findOne({"tournamentId":userDetails,"eventId":lEvents._id});
  		//if its undefined
  		if(SNSCollectionDBRec==undefined){
	  		var mainPlayer=[]; 
	  		//loop through eventParticipants
	  		for(var i=0;i<lEvents.eventParticipants.length;i++){
				var playsWith=[];
				//find the user details of main player
	  			var users = Meteor.users.findOne({"userId":lEvents.eventParticipants[i].toString()});
				if(users!=undefined){
					var eveParts = lEvents.eventParticipants
					for(var j=0;j<eveParts.length;j++){
						//if player is not the main player to set array as playsWith
						if(lEvents.eventParticipants[i]!==eveParts[j]){
							//set the data of all players
				  			var users2 = Meteor.users.findOne({"userId":eveParts[j].toString()});
							if(users2!=undefined){
								var data2 ={
									playerId:users2.userId,
									//playerName:users2.userName,
									matchStatus:"yetToPlay",
									approvalStatus:"waiting",
									color:"otherUserName_SNS",
									points:0,
									scores:{
										"setScoresA":["0","0","0","0","0","0","0"],
										"setScoresB":["0","0","0","0","0","0","0"]
									},
								}
								playsWith.push(data2);
							}
						}
					}
					//set the main player deatils with sub players
					var data={
						"mainPlayerID":users.userId,
						"playsWith":playsWith,
						//"mainPlayerName":users.userName,
						"mainPlayerID":users.userId,
						"playsWith":playsWith,
						"totalPoints":0,
					}
					mainPlayer.push(data)
				}
	  		}
	  		//json for players and event list
	  		var setJSONForSNS = {
	  			"eventId":lEvents._id,
	  			"tournamentId":userDetails,
	  			"eventParticipants":lEvents.eventParticipants,
	  			"eventName":lEvents.eventName,
	  			"snsRecords":mainPlayer
	  		}
	  		//JSONArray.push(setJSONForSNS)

	  		//insert into the SNSCollection
	  		var s = SNSCollectionDB.insert(setJSONForSNS);
  		}
  		else{
  			//if snscollection already contains the event
  			//check eventParticipants in the snscollection is lesser than events eventPArticipatns
  			//(if unsubscribed)
  			if(SNSCollectionDBRec.eventParticipants.length>lEvents.eventParticipants.length){
	  			var x = lEvents.eventParticipants
				var y = SNSCollectionDBRec.eventParticipants;
				//filter both arrays to search which id is more in snscollectiondb
				myArray = y.filter( function( el ) {
  					return x.indexOf( el ) < 0;
				});
				//get the snsRecords of snscollectiondb
				var snsRecordsRec = SNSCollectionDBRec.snsRecords;
				//for each of snsRecord
				for(var i=0;i<snsRecordsRec.length;i++){
					//for each of filtered array
					for(var j=0;j<myArray.length;j++){
							//remove the playwith array element
							var remove = SNSCollectionDB.update(
								{ "_id":SNSCollectionDBRec._id,
								"snsRecords.playsWith.playerId":myArray[j]}, 
								{$pull:{ "snsRecords.$.playsWith":{"playerId":myArray[j]}} },
								{multi: true});


							//pull mainPlayerId
							var remove1 = SNSCollectionDB.update({
								"_id":SNSCollectionDBRec._id
							},{$pull:{
								"snsRecords":{"mainPlayerID":myArray[j]}
							}});


							//pull from eventParticipants array
							var remove2 = SNSCollectionDB.update({
								"_id":SNSCollectionDBRec._id
							},{$pull:{
								"eventParticipants":myArray[j]
							}})

					}
				}
  			}
  			//if eventParticipants list of events is equal or greater than snscollection db eventparticipants list
  			else if(SNSCollectionDBRec.eventParticipants.length<=lEvents.eventParticipants.length){
  				var x = SNSCollectionDBRec.eventParticipants;
				var y = lEvents.eventParticipants;

				//filter both arrays to search which id is different in lEvents
				myArray2 = y.filter( function( el ) {
					return x.indexOf( el ) < 0;
				});
				var snsRecordsRec2 = SNSCollectionDBRec.snsRecords;
				var mainUsersArray = []
				//loop through the myArray2
				for(var j=0;j<myArray2.length;j++){
					//push extra participant to eventparticipants to SNSCollectionDB
					var addRec = SNSCollectionDB.update({
					"_id":SNSCollectionDBRec._id
					},{$push:{
					"eventParticipants":myArray2[j]
					}});
					var subUsersArray = []
					//find the user details for the extra eventParticipant
					var users = Meteor.users.findOne({"userId":myArray2[j].toString()});
					if(users!=undefined){
						var eveParts = lEvents.eventParticipants
						for(var i=0;i<eveParts.length;i++){
							if(myArray2[j]!==eveParts[i]){
								
								//set data of each participant
								var users2 = Meteor.users.findOne({"userId":eveParts[i].toString()});
								if(users2!=undefined){
							
									var data2 ={
											playerId:users2.userId,
											//playerName:users2.userName,
											matchStatus:"yetToPlay",
											approvalStatus:"waiting",
											color:"otherUserName_SNS",
											points:0,
											scores:{
												"setScoresA":["0","0","0","0","0","0","0"],
												"setScoresB":["0","0","0","0","0","0","0"]
											},
										}
								}
							}
							subUsersArray.push(data2)
						}//eveParts for loop ends

						//set data of snsrecord
						var data1 = {
							"mainPlayerID":users.userId,
							"playsWith":subUsersArray,
							"totalPoints":0,
						}
						//push into snsRecords
						var addRecSNS=1;
						var addRecSNS = SNSCollectionDB.update(
							{ "_id":SNSCollectionDBRec._id}, 
							{$push:{ "snsRecords":data1}});
			
						if(addRecSNS){
							//push extra participant details to old participant list
							var SNSCollectionDBRec2 = SNSCollectionDB.findOne({"tournamentId":userDetails,"eventId":lEvents._id});
							var snsRecordsRec2 = SNSCollectionDBRec2.snsRecords;
							for(var k=0;k<snsRecordsRec2.length;k++){
								var data3 ={
										playerId:users.userId,
										matchStatus:"yetToPlay",
										approvalStatus:"waiting",
										color:"otherUserName_SNS",
										points:0,
										scores:{
										"setScoresA":["0","0","0","0","0","0","0"],
										"setScoresB":["0","0","0","0","0","0","0"]
										},
									}
								//
								if(snsRecordsRec2[k].mainPlayerID!==users.userId){
									var addRecSNSPlaysWith = SNSCollectionDB.update(
										{ "_id":SNSCollectionDBRec._id,
										"snsRecords.mainPlayerID":snsRecordsRec2[k].mainPlayerID},
										{$push:{ "snsRecords.$.playsWith":data3} },
										);
									
								}
							}
						}
					}	
				}//end of myarray2 for loop
  			}
  		}
  	});
  }
});

Meteor.methods({
	"getMatchedPlaysWith":function(id){
		check(id,Object)
		try{
			var r = SNSCollectionDB.findOne(
					{
					 	"tournamentId":id.tourn,"eventName":id.eventName,
					  	"snsRecords": { $elemMatch: { "mainPlayerID":id.mainPlayerID} }
					},{fields:{"_id":0,"snsRecords.$":1}})
			if(r!=undefined){
				var returnData=false;
				//get snsRecords into an array
				var snsRecordsArray = r.snsRecords;
				//for the length of snrecords array, find the playswith array
				//for the length of palywith array find the given playerId
				// if it matches return the respective scores
				for(var i=0;i<snsRecordsArray.length;i++){
					var playsWithArray = snsRecordsArray[i].playsWith;
					for(var j=0;j<playsWithArray.length;j++){
						if(playsWithArray[j].playerId==id.subPlayerID){
							returnData = playsWithArray[j].scores;
							break;
						}
						
					}
				}
				return returnData;
			}
			else return false
		}catch(e){
		}
	}
});

Meteor.methods({
	"getScoresSNSForPlayer":function(xData){
		check(xData,Object);
		try{
			//get scores of each player
			getScores(xData,function(res){
				if(res){
					var setScoresA = res.setScoresA;
					var setScoresB = res.setScoresB;
					//if player is a or b set the scoreA with value or scoreB resp.
					if(xData.player=='A'){
						setScoresA[xData.indexP]=xData.scoreValue
					}
					if(xData.player=='B'){
						setScoresB[xData.indexP]=xData.scoreValue+""
					}

					var dataum = undefined, dataum2 = undefined; addAgain =undefined, addAgain2 =undefined, remove=undefined;

					//set the data to push to mainPlayerID playsWith array
					dataum ={
						playerId:xData.subPlayerID,
						matchStatus:"yetToPlay",
						approvalStatus:"waiting",
						color:"otherUserName_SNS",
						points:0,
						scores:{
							"setScoresA":setScoresA,
							"setScoresB":setScoresB
						},
					}

					//set the data to push to subPlayerID playsWith array
					dataum2 ={
						playerId:xData.mainPlayerID,
						matchStatus:"yetToPlay",
						approvalStatus:"waiting",
						color:"otherUserName_SNS",
						points:0,
						scores:{
							"setScoresA":setScoresB,
							"setScoresB":setScoresA
						},
					}

					if(dataum){
						//pull the data subplayer from mainplayer playswith
						var remove = SNSCollectionDB.update(
							{ "tournamentId":xData.tourn,"eventName":xData.eventName,
							"snsRecords.mainPlayerID":xData.mainPlayerID}, 
							{$pull:{ "snsRecords.$.playsWith":{"playerId":xData.subPlayerID}} });


						//pull the data mainPlayer from subplayer playswith
						var remove2 = SNSCollectionDB.update(
							{ "tournamentId":xData.tourn,"eventName":xData.eventName,
							"snsRecords.mainPlayerID":xData.subPlayerID}, 
							{$pull:{ "snsRecords.$.playsWith":{"playerId":xData.mainPlayerID}} });

					}

					if(dataum&&remove&&dataum2&&remove2){
						//push to mainPlayerID playsWith array 
						addAgain = SNSCollectionDB.update(
							{ "tournamentId":xData.tourn,"eventName":xData.eventName,
							"snsRecords.mainPlayerID":xData.mainPlayerID},
							{$push:{ "snsRecords.$.playsWith":dataum} });


						//push to subPlayerID playsWith array
						var addAgain2 = SNSCollectionDB.update(
							{ "tournamentId":xData.tourn,"eventName":xData.eventName,
							"snsRecords.mainPlayerID":xData.subPlayerID},
							{$push:{ "snsRecords.$.playsWith":dataum2} });

					}

					//update points 
					if(addAgain&&addAgain2){
						getThePointsAndWinner(setScoresA,setScoresB,function(resp){
							var dataum3=undefined; var dataum4=undefined;
							var remove3 = undefined, remove4=undefined;
							//if winner is player A
							if(resp.winner=='A') {
								resp.winner=xData.mainPlayerID;
								resp.pointsA=3;
								resp.pointsB=1;
								resp.colorsA='otherUserName_SNSWin';
								resp.colorsB='otherUserName_SNSLost';
							}

							//if winner is player B
							else if(resp.winner=='B'){ 
								resp.winner=xData.subPlayerID;
								resp.pointsB=3;
								resp.pointsA=1;
								resp.colorsB='otherUserName_SNSWin';
								resp.colorsA='otherUserName_SNSLost';
							}

							//if no wins
							else{
								resp.winner="";
								resp.pointsB=0;
								resp.pointsA=0;
								resp.colorsA='otherUserName_SNS';
								resp.colorsB='otherUserName_SNS';
							}

							//set the data to push to mainPlayerID playsWith array
							dataum3 ={
								playerId:xData.subPlayerID,
								matchStatus:resp.matchStatus,
								approvalStatus:"waiting",
								winner:resp.winner,
								color:resp.colorsB,
								points:resp.pointsA,
								scores:{
									"setScoresA":setScoresA,
									"setScoresB":setScoresB
								},
							}

							//set the data to push to subPlayerID playsWith array
							dataum4 ={
								playerId:xData.mainPlayerID,
								matchStatus:resp.matchStatus,
								approvalStatus:"waiting",
								winner:resp.winner,
								color:resp.colorsA,
								points:resp.pointsB,
								scores:{
									"setScoresA":setScoresB,
									"setScoresB":setScoresA
								},
							}

							if(dataum3&&dataum4){

								//pull the data subplayer from mainplayer playswith
								remove3 = SNSCollectionDB.update(
								{ "tournamentId":xData.tourn,"eventName":xData.eventName,
								"snsRecords.mainPlayerID":xData.mainPlayerID}, 
								{$pull:{ "snsRecords.$.playsWith":{"playerId":xData.subPlayerID}} });


								//pull the data mainPlayer from subplayer playswith
								remove4 = SNSCollectionDB.update(
								{ "tournamentId":xData.tourn,"eventName":xData.eventName,
								"snsRecords.mainPlayerID":xData.subPlayerID}, 
								{$pull:{ "snsRecords.$.playsWith":{"playerId":xData.mainPlayerID}} });

							}
							if(dataum3&&dataum4&&remove3&&remove4){

								//push to mainPlayerID playsWith array 
								var addAgain3 = SNSCollectionDB.update(
									{ "tournamentId":xData.tourn,"eventName":xData.eventName,
									"snsRecords.mainPlayerID":xData.mainPlayerID},
									{$push:{ "snsRecords.$.playsWith":dataum3} });


								//push to subPlayerID playsWith array
								var addAgain4 = SNSCollectionDB.update(
									{ "tournamentId":xData.tourn,"eventName":xData.eventName,
									"snsRecords.mainPlayerID":xData.subPlayerID},
									{$push:{ "snsRecords.$.playsWith":dataum4} });


								//get the total points
								getThePointsofA(xData,function(rTotal){
									if(rTotal!=undefined){
										var addAgain5 = SNSCollectionDB.update(
										{ "tournamentId":xData.tourn,"eventName":xData.eventName,
										"snsRecords.mainPlayerID":xData.mainPlayerID},
										{$set:{ "snsRecords.$.totalPoints":rTotal} });
									}
								});
								getThePointsofB(xData,function(rTotal2){
									if(rTotal2!=undefined){
										var addAgain5 = SNSCollectionDB.update(
										{ "tournamentId":xData.tourn,"eventName":xData.eventName,
										"snsRecords.mainPlayerID":xData.subPlayerID},
										{$set:{ "snsRecords.$.totalPoints":rTotal2} });
									}
								})
							}
						});
					}
				}
			});
		}catch(e){
		}
	}
});

var getThePointsAndWinner=function(setScoresA,setScoresB,xCallback){
	var minScore=11, minDiff=2, numSets=5, numSetWinsReqd=3;
  	var curMatchRecord={};
	if (setScoresA.length < numSetWinsReqd) return;

	if (setScoresA.length != setScoresB.length) return;

	let winsA = 0, winsB = 0;

	for (let i=0; i<setScoresA.length; i++) {
	    if ((setScoresA[i]-setScoresB[i] >= minDiff) && (setScoresA[i] >= minScore)) {
	      winsA++;
	    }
	    if ((setScoresB[i]-setScoresA[i] >= minDiff) && (setScoresB[i] >= minScore)) {
	      winsB++;
	    }
  	}
  	curMatchRecord['matchStatus']="completed";
  	if (winsA == numSetWinsReqd) {
  		curMatchRecord["winner"] ="A";
	    curMatchRecord["getStatusColorB"] = 'otherUserName_SNSLost';
	    curMatchRecord["getStatusColorA"] = 'otherUserName_SNS';
	} else
	if (winsB == numSetWinsReqd) {
		curMatchRecord["winner"] ="B";
		curMatchRecord["getStatusColorB"] = 'otherUserName_SNSWin';
	    curMatchRecord["getStatusColorA"] = 'otherUserName_SNS';
	}
	return xCallback(curMatchRecord)
}

var getScores = function(xData,xCallback){
		try{
			var r = SNSCollectionDB.findOne(
					{
					 	"tournamentId":xData.tourn,"eventName":xData.eventName,
					  	"snsRecords": { $elemMatch: { "mainPlayerID":xData.mainPlayerID} }
					},{fields:{"_id":0,"snsRecords.$":1}})
			if(r!=undefined){
				var returnData=false;
				//get snsRecords into an array
				var snsRecordsArray = r.snsRecords;
				//for the length of snrecords array, find the playswith array
				//for the length of palywith array find the given playerId
				// if it matches return the respective scores
				for(var i=0;i<snsRecordsArray.length;i++){
					var playsWithArray = snsRecordsArray[i].playsWith;
					for(var j=0;j<playsWithArray.length;j++){
						if(playsWithArray[j].playerId==xData.subPlayerID){
							returnData = playsWithArray[j].scores;
							break;
						}
						
					}
				}
				return xCallback(returnData);
			}
			else return false
		}catch(e){
		}
}

var getThePointsofA = function(xData,xCallback){
		try{
			var total=0;
			var r = SNSCollectionDB.findOne(
					{
					 	"tournamentId":xData.tourn,"eventName":xData.eventName,
					  	"snsRecords": { $elemMatch: { "mainPlayerID":xData.mainPlayerID} }
					},{fields:{"_id":0,"snsRecords.$":1}})
			if(r!=undefined){
				var returnData=[];
				//get snsRecords into an array
				var snsRecordsArray = r.snsRecords;
				//for the length of snrecords array, find the playswith array
				//for the length of palywith array find the given playerId
				// if it matches return the respective scores
				for(var i=0;i<snsRecordsArray.length;i++){
					var playsWithArray = snsRecordsArray[i].playsWith;
					for(var j=0;j<playsWithArray.length;j++){
							total=parseInt(total+parseInt(playsWithArray[j].points));
					}
				}
				return xCallback(total);
			}
			else return undefined
		}catch(e){
		}
}

var getThePointsofB = function(xData,xCallback){
		try{
			var total=0;
			var r = SNSCollectionDB.findOne(
					{
					 	"tournamentId":xData.tourn,"eventName":xData.eventName,
					  	"snsRecords": { $elemMatch: { "mainPlayerID":xData.subPlayerID} }
					},{fields:{"_id":0,"snsRecords.$":1}})
			if(r!=undefined){
				var returnData=[];
				//get snsRecords into an array
				var snsRecordsArray = r.snsRecords;
				//for the length of snrecords array, find the playswith array
				//for the length of palywith array find the given playerId
				// if it matches return the respective scores
				for(var i=0;i<snsRecordsArray.length;i++){
					var playsWithArray = snsRecordsArray[i].playsWith;
					for(var j=0;j<playsWithArray.length;j++){
							total=parseInt(total+parseInt(playsWithArray[j].points));
					}
				}
				return xCallback(total);
			}
			else return undefined
		}catch(e){
		}
}

//set walkover
Meteor.methods({
	"setWalkoverSNS":function(xData){
		//getScores(xData,function(res){
			//if(res){
				var setScoresA = [0,0,0,0,0,0,0];
				var setScoresB = [0,0,0,0,0,0,0];
				var pointsA=0;
				var pointsB=0;
				var colorsA="otherUserName_SNS";
				var colorsB="otherUserName_SNS";
				var matchStatusA="completedWalk";
				var matchStatusB="completedWalk";
				//if player is a or b set the points for a and b.
				if(xData.walkoverPlayerId=='A'){
					pointsA=4;
					pointsB=0;
					colorsA="otherUserName_SNSWalkOver2";
					colorsB="otherUserName_SNSWalkover";
					matchStatusA="walkover";
					matchStatusB="completedWalk";
				}
				if(xData.walkoverPlayerId=='B'){
					pointsB=4;
					pointsA=0;
					colorsB="otherUserName_SNSWalkOver2";
					colorsA="otherUserName_SNSWalkover";
					matchStatusB="walkover",
					matchStatusA="completedWalk"
				}

				var dataum = undefined, dataum2 = undefined; addAgain =undefined, addAgain2 =undefined, remove=undefined;

				//set the data to push to mainPlayerID playsWith array
				dataum ={
					playerId:xData.subPlayerID,
					matchStatus:matchStatusA,
					approvalStatus:"waiting",
					color:colorsB,
					points:pointsA,
					scores:{
						"setScoresA":setScoresA,
						"setScoresB":setScoresB
					},
				}

				//set the data to push to subPlayerID playsWith array
				dataum2 ={
					playerId:xData.mainPlayerID,
					matchStatus:matchStatusB,
					approvalStatus:"waiting",
					color:colorsA,
					points:pointsB,
					scores:{
						"setScoresA":setScoresB,
						"setScoresB":setScoresA
					},
				}
				if(dataum){
					//pull the data subplayer from mainplayer playswith
					var remove = SNSCollectionDB.update(
						{ "tournamentId":xData.tourn,"eventName":xData.eventName,
						"snsRecords.mainPlayerID":xData.mainPlayerID}, 
						{$pull:{ "snsRecords.$.playsWith":{"playerId":xData.subPlayerID}} });


					//pull the data mainPlayer from subplayer playswith
					var remove2 = SNSCollectionDB.update(
						{ "tournamentId":xData.tourn,"eventName":xData.eventName,
						"snsRecords.mainPlayerID":xData.subPlayerID}, 
						{$pull:{ "snsRecords.$.playsWith":{"playerId":xData.mainPlayerID}} });

				}

				if(dataum&&remove&&dataum2&&remove2){
					//push to mainPlayerID playsWith array 
					addAgain = SNSCollectionDB.update(
						{ "tournamentId":xData.tourn,"eventName":xData.eventName,
						"snsRecords.mainPlayerID":xData.mainPlayerID},
						{$push:{ "snsRecords.$.playsWith":dataum} });


						//push to subPlayerID playsWith array
					var addAgain2 = SNSCollectionDB.update(
						{ "tournamentId":xData.tourn,"eventName":xData.eventName,
							"snsRecords.mainPlayerID":xData.subPlayerID},
						{$push:{ "snsRecords.$.playsWith":dataum2} });


					if(addAgain&&addAgain2){
						//get the total points
						getThePointsofA(xData,function(rTotal){
							if(rTotal!==undefined){
								var addAgain5 = SNSCollectionDB.update(
								{ "tournamentId":xData.tourn,"eventName":xData.eventName,
								"snsRecords.mainPlayerID":xData.mainPlayerID},
								{$set:{ "snsRecords.$.totalPoints":rTotal} });
							}
						});
						getThePointsofB(xData,function(rTotal2){
							if(rTotal2!=undefined){
								var addAgain5 = SNSCollectionDB.update(
								{ "tournamentId":xData.tourn,"eventName":xData.eventName,
								"snsRecords.mainPlayerID":xData.subPlayerID},
								{$set:{ "snsRecords.$.totalPoints":rTotal2} });
							}
						})
					}
				}				
			//}
		//});
	}
})