Meteor.methods({

	"insertStroke":function(strokeObj,serviceType)
	{
		try{
			check(strokeObj, Object);
			if(serviceType == "stroke")
			{
				strokeObj.shortCode = strokeObj.shortCode.toUpperCase();
				var strokeInfo = strokes.findOne({"strokeShortCode":strokeObj.shortCode.toUpperCase(),"strokeName":strokeObj.strokeName,"sportId":strokeObj.sportId
				});
				if(strokeInfo == undefined)
				{
					var strokeInsert = strokes.insert({
					"strokeShortCode":strokeObj.shortCode.toUpperCase(),"strokeName":strokeObj.strokeName,"strokeComment":strokeObj.comments,
					"strokeHand":strokeObj.shotHand,"sportId":strokeObj.sportId,"strokeStyle":strokeObj.strokeStyle}
					);
					/*if(strokeInsert)
					{
						var wholeArr = [];
						var serviceList = serviceStrokes.find({}).fetch();
						var strokeList = strokes.find({}).fetch();
						var destinationList = destinationPoints.find({}).fetch();
						var wholeArr = [];
						var combinedStrokeArr = [];
						if(serviceList.length > 0 && destinationList.length > 0)
						{
							for(var k=0;k<serviceList.length;k++)
							{
								for(var h=0; h<destinationList.length;h++)
								{
									var combinedStroke = serviceList[k].serviceShortName+"-"+destinationList[h].destinationShortName;
									combinedStrokeArr.push(combinedStroke);	
									var newJson = {};
									newJson["strokeKey"] = combinedStroke;
									newJson["strokesPlayed"]= "0";
									newJson["win"] = "0";
									newJson["loss"] = "0";
									newJson["efficiency"] = "0";

									newJson["strokeHand"] = serviceList[k].serviceName;
									newJson["strokeDestination"] = destinationList[h].destinationName;
									wholeArr.push(newJson);	
								}
							}
						}

						if(strokeList.length > 0  && destinationList.length > 0)
						{						
							for(var i=0; i<strokeList.length;i++)
							{
								for(var j=0; j<destinationList.length;j++)
								{
									var combinedStroke = strokeList[i].strokeShortCode+"-"+destinationList[j].destinationShortName;
									combinedStrokeArr.push(combinedStroke);	
									var newJson = {};
									newJson["strokeKey"] = combinedStroke;
									newJson["strokesPlayed"]= "0";
									newJson["win"] = "0";
									newJson["loss"] = "0";
									newJson["efficiency"] = "0";
									newJson["strokeHand"] = strokeList[i].strokeName;
									newJson["strokeDestination"] = destinationList[j].destinationName;
									wholeArr.push(newJson);				
								}
							}
							var combinedStrokeInfo = combinationStroke.findOne({});
							if(combinedStrokeInfo)
							{
								combinationStroke.update({_id:combinedStrokeInfo._id},
									{$set:{"combinedStroke":combinedStrokeArr,
									"combinedStrokeArr":wholeArr}});
							}
							else
							{
								combinationStroke.insert({"combinedStroke":combinedStrokeArr,"combinedStrokeArr":wholeArr});
							}
						}
					} */
					return strokeInsert;
				}
			}
			else if(serviceType == "serviceStroke")
			{
				strokeObj.shortCode = strokeObj.shortCode.toUpperCase();
				var serviceInfo = serviceStrokes.findOne({"serviceShortName":strokeObj.shortCode,"serviceName":strokeObj.strokeName,"sportId":strokeObj.sportId
				});
				if(serviceInfo == undefined)
				{
					var strokeInsert = serviceStrokes.insert({
					"serviceShortName":strokeObj.shortCode,"serviceName":strokeObj.strokeName,"serviceComment":strokeObj.comments,"serviceHand":strokeObj.shotHand,"sportId":strokeObj.sportId}
					);
					/*if(strokeInsert)
					{
						var wholeArr = [];
						var combinedStrokeArr = [];
						var serviceList = serviceStrokes.find({}).fetch();						
						var strokeList = strokes.find({}).fetch();
						var destinationList = destinationPoints.find({}).fetch();	
						if(serviceList.length > 0 && destinationList.length > 0)
						{
							for(var k=0;k<serviceList.length;k++)
							{
								for(var h=0; h<destinationList.length;h++)
								{
									var combinedStroke = serviceList[k].serviceShortName+"-"+destinationList[h].destinationShortName;
									combinedStrokeArr.push(combinedStroke);	
									var newJson = {};
									newJson["strokeKey"] = combinedStroke;
									newJson["strokesPlayed"]= "0";
									newJson["win"] = "0";
									newJson["loss"] = "0";
									newJson["efficiency"] = "0";

									newJson["strokeHand"] = serviceList[k].serviceName;
									newJson["strokeDestination"] = destinationList[h].destinationName;
									wholeArr.push(newJson);	
								}
							}
						}					
						if(strokeList.length > 0  && destinationList.length > 0)
						{						
							for(var i=0; i<strokeList.length;i++)
							{
								for(var j=0; j<destinationList.length;j++)
								{
									var combinedStroke = strokeList[i].strokeShortCode+"-"+destinationList[j].destinationShortName;
									combinedStrokeArr.push(combinedStroke);	
									var newJson = {};
									newJson["strokeKey"] = combinedStroke;
									newJson["strokesPlayed"]= "0";
									newJson["win"] = "0";
									newJson["loss"] = "0";
																	newJson["efficiency"] = "0";

									newJson["strokeHand"] = strokeList[i].strokeName;
									newJson["strokeDestination"] = destinationList[j].destinationName;
									wholeArr.push(newJson);				
								}
							}
							var combinedStrokeInfo = combinationStroke.findOne({});
							if(combinedStrokeInfo)
							{
								combinationStroke.update({_id:combinedStrokeInfo._id},
									{$set:{"combinedStroke":combinedStrokeArr,
									"combinedStrokeArr":wholeArr}});
							}
							else
							{
								combinationStroke.insert({"combinedStroke":combinedStrokeArr,"combinedStrokeArr":wholeArr});
							}
						}
					}*/
					return strokeInsert;
				}			
			}
			else if(serviceType == "destinationPoints")
			{
				var losingStrokeVal = strokeObj.losingStroke;
				strokeObj.shortCode = strokeObj.shortCode.toUpperCase();
				var destinationInfo = destinationPoints.findOne({"destinationShortName":strokeObj.shortCode,"destinationName":strokeObj.strokeName,"sportId":strokeObj.sportId
				});
				if(destinationInfo == undefined)
				{
					var strokeInsert = destinationPoints.insert({
					"destinationShortName":strokeObj.shortCode,"destinationName":strokeObj.strokeName,"destinationComment":strokeObj.comments,
					"sportId":strokeObj.sportId,"destinationType":strokeObj.destinationType}
					);

					if(strokeObj.destinationType == "P6")
					{
						var strokeInsert = p6DestinationPoints.insert({
						"destinationShortName":strokeObj.shortCode,"destinationName":strokeObj.strokeName});
					}
					else if(strokeObj.destinationType == "P8")
					{
						var strokeInsert = p8DestinationPoints.insert({
						"destinationShortName":strokeObj.shortCode,"destinationName":strokeObj.strokeName});
					}
					else if(strokeObj.destinationType == "P9")
					{
						var strokeInsert = p9DestinationPoints.insert({
						"destinationShortName":strokeObj.shortCode,"destinationName":strokeObj.strokeName});
					}
					else if(strokeObj.destinationType == "P14")
					{
						var strokeInsert = p14DestinationPoints.insert({
						"destinationShortName":strokeObj.shortCode,"destinationName":strokeObj.strokeName});
					}

					if(losingStrokeVal == "yes")
					{
						var losingStrokeInfo = losingStrokes.findOne({});
						if(losingStrokeInfo != undefined)
						{
							losingStrokes.update({},{ $addToSet: { "losingStrokes":strokeObj.shortCode }});
						}
						else
						{
							var losingStrokesArr = [strokeObj.shortCode];
							losingStrokes.insert({"losingStrokes":losingStrokesArr});
						}
					}
					
					/*if(strokeInsert)
					{
						var serviceList = serviceStrokes.find({}).fetch();
						var strokeList = strokes.find({}).fetch();
						var destinationList = destinationPoints.find({}).fetch();
						var combinedStrokeArr = [];
						var wholeArr = [];
						if(serviceList.length > 0 && destinationList.length > 0)
						{
							for(var k=0;k<serviceList.length;k++)
							{
								for(var h=0; h<destinationList.length;h++)
								{
									var combinedStroke = serviceList[k].serviceShortName+"-"+destinationList[h].destinationShortName;
									combinedStrokeArr.push(combinedStroke);	
									var newJson = {};
									newJson["strokeKey"] = combinedStroke;
									newJson["strokesPlayed"]= "0";
									newJson["win"] = "0";
									newJson["loss"] = "0";
																	newJson["efficiency"] = "0";

									newJson["strokeHand"] = serviceList[k].serviceName;
									newJson["strokeDestination"] = destinationList[h].destinationName;
									wholeArr.push(newJson);	
								}
							}
						}
						if(strokeList && destinationList)
						{
							for(var i=0; i<strokeList.length;i++)
							{
								for(var j=0; j<destinationList.length;j++)
								{
									var combinedStroke = strokeList[i].strokeShortCode+"-"+destinationList[j].destinationShortName;
									combinedStrokeArr.push(combinedStroke);	
									var newJson = {};
									newJson["strokeKey"] = combinedStroke;
									newJson["strokesPlayed"]= "0";
									newJson["win"] = "0";
									newJson["loss"] = "0";
																	newJson["efficiency"] = "0";

									newJson["strokeHand"] = strokeList[i].strokeName;
									newJson["strokeDestination"] = destinationList[j].destinationName;
									wholeArr.push(newJson);					
								}
							}
							var combinedStrokeInfo = combinationStroke.findOne({});
							if(combinedStrokeInfo)
							{
								combinationStroke.update({_id:combinedStrokeInfo._id},
									{$set:{"combinedStroke":combinedStrokeArr,
									"combinedStrokeArr":wholeArr}});

							}
							else
							{
								combinationStroke.insert({"combinedStroke":combinedStrokeArr,"combinedStrokeArr":wholeArr});
							}
						}
					}*/
					return strokeInsert;
				}
			}
			
		}catch(e){}
	},
	"deleteStroke":function(id,serviceType)
	{
		try
		{
			if(serviceType == "stroke")
			{
				var strokeDelete = strokes.remove({"_id":id});
				/*if(strokeDelete)
				{
					var wholeArr = [];
					var combinedStrokeArr = [];	
					var serviceList = serviceStrokes.find({}).fetch();

					var strokeList = strokes.find({}).fetch();
					var destinationList = destinationPoints.find({}).fetch();	
					if(serviceList.length > 0 && destinationList.length > 0)
						{
							for(var k=0;k<serviceList.length;k++)
							{
								for(var h=0; h<destinationList.length;h++)
								{
									var combinedStroke = serviceList[k].serviceShortName+"-"+destinationList[h].destinationShortName;
									combinedStrokeArr.push(combinedStroke);	
									var newJson = {};
									newJson["strokeKey"] = combinedStroke;
									newJson["strokesPlayed"]= "0";
									newJson["win"] = "0";
									newJson["loss"] = "0";
																	newJson["efficiency"] = "0";

									newJson["strokeHand"] = serviceList[k].strokeName;
									newJson["strokeDestination"] = destinationList[h].destinationName;
									wholeArr.push(newJson);	
								}
							}
						}								
					if(strokeList.length > 0  && destinationList.length > 0)
					{
						for(var i=0; i<strokeList.length;i++)
						{
							for(var j=0; j<destinationList.length;j++)
							{
								var combinedStroke = strokeList[i].strokeShortCode+"-"+destinationList[j].destinationShortName;
								combinedStrokeArr.push(combinedStroke);	
								var newJson = {};
								newJson["strokeKey"] = combinedStroke;
								newJson["strokesPlayed"]= "0";
								newJson["win"] = "0";
								newJson["loss"] = "0";
																newJson["efficiency"] = "0";

								newJson["strokeHand"] = strokeList[i].strokeName;
								newJson["strokeDestination"] = destinationList[j].destinationName;
								wholeArr.push(newJson);				
							}
						}
						var combinedStrokeInfo = combinationStroke.findOne({});
						if(combinedStrokeInfo)
						{
							combinationStroke.update({_id:combinedStrokeInfo._id},
								{$set:{"combinedStroke":combinedStrokeArr,
								"combinedStrokeArr":wholeArr}});
						}
						else
						{
								combinationStroke.insert({"combinedStroke":combinedStrokeArr,"combinedStrokeArr":wholeArr});
						}
					}
				}*/
				return strokeDelete;
			}
			else if(serviceType == "serviceStroke")
			{
				var strokeDelete = serviceStrokes.remove({"_id":id});
				/*if(strokeDelete)
				{
					var wholeArr = [];
					var combinedStrokeArr = [];					
					var serviceList = serviceStrokes.find({}).fetch();
					var strokeList = strokes.find({}).fetch();
					var destinationList = destinationPoints.find({}).fetch();	
					if(serviceList.length > 0 && destinationList.length > 0)
						{
							for(var k=0;k<serviceList.length;k++)
							{
								for(var h=0; h<destinationList.length;h++)
								{
									var combinedStroke = serviceList[k].serviceShortName+"-"+destinationList[h].destinationShortName;
									combinedStrokeArr.push(combinedStroke);	
									var newJson = {};
									newJson["strokeKey"] = combinedStroke;
									newJson["strokesPlayed"]= "0";
									newJson["win"] = "0";
									newJson["loss"] = "0";
																	newJson["efficiency"] = "0";

									newJson["strokeHand"] = serviceList[k].serviceName;
									newJson["strokeDestination"] = destinationList[h].destinationName;
									wholeArr.push(newJson);	
								}
							}
						}								
					if(strokeList.length > 0  && destinationList.length > 0)
					{			
						for(var i=0; i<strokeList.length;i++)
						{
							for(var j=0; j<destinationList.length;j++)
							{
								var combinedStroke = strokeList[i].strokeShortCode+"-"+destinationList[j].destinationShortName;
								combinedStrokeArr.push(combinedStroke);	
								var newJson = {};
								newJson["strokeKey"] = combinedStroke;
								newJson["strokesPlayed"]= "0";
								newJson["win"] = "0";
								newJson["loss"] = "0";
																newJson["efficiency"] = "0";

								newJson["strokeHand"] = strokeList[i].strokeName;
								newJson["strokeDestination"] = destinationList[j].destinationName;
								wholeArr.push(newJson);				
							}
						}
						var combinedStrokeInfo = combinationStroke.findOne({});
						if(combinedStrokeInfo)
						{
							combinationStroke.update({_id:combinedStrokeInfo._id},
								{$set:{"combinedStroke":combinedStrokeArr,
								"combinedStrokeArr":wholeArr}});
						}
						else
						{
							combinationStroke.insert({"combinedStroke":combinedStrokeArr,"combinedStrokeArr":wholeArr});
						}
					}
					return strokeDelete;
				}*/
			}
			else if(serviceType == "destinationPoints")
			{
				var strokeDelete = destinationPoints.remove({"_id":id});
				/*if(strokeDelete)
				{
					var wholeArr = [];
					var combinedStrokeArr = [];
					var serviceList = serviceStrokes.find({}).fetch();
					var strokeList = strokes.find({}).fetch();
					var destinationList = destinationPoints.find({}).fetch();	
					if(serviceList.length > 0 && destinationList.length > 0)
					{
						for(var k=0;k<serviceList.length;k++)
						{
							for(var h=0; h<destinationList.length;h++)
							{
								var combinedStroke = serviceList[k].serviceShortName+"-"+destinationList[h].destinationShortName;
								combinedStrokeArr.push(combinedStroke);	
								var newJson = {};
								newJson["strokeKey"] = combinedStroke;
								newJson["strokesPlayed"]= "0";
								newJson["win"] = "0";
								newJson["loss"] = "0";
																newJson["efficiency"] = "0";

								newJson["strokeHand"] = serviceList[k].serviceName;
								newJson["strokeDestination"] = destinationList[h].destinationName;
								wholeArr.push(newJson);	
							}
						}
					}								
					if(strokeList.length > 0  && destinationList.length > 0)
					{					
						for(var i=0; i<strokeList.length;i++)
						{
							for(var j=0; j<destinationList.length;j++)
							{
								var combinedStroke = strokeList[i].strokeShortCode+"-"+destinationList[j].destinationShortName;
								combinedStrokeArr.push(combinedStroke);	
								var newJson = {};
								newJson["strokeKey"] = combinedStroke;
								newJson["strokesPlayed"]= "0";
								newJson["win"] = "0";
								newJson["loss"] = "0";
								newJson["efficiency"] = "0";
								newJson["strokeHand"] = strokeList[i].strokeName;
								newJson["strokeDestination"] = destinationList[j].destinationName;
								wholeArr.push(newJson);				
							}
						}
						var combinedStrokeInfo = combinationStroke.findOne({});
						if(combinedStrokeInfo)
						{
							combinationStroke.update({_id:combinedStrokeInfo._id},
								{$set:{"combinedStroke":combinedStrokeArr,
								"combinedStrokeArr":wholeArr}});
						}
						else
						{
								combinationStroke.insert({"combinedStroke":combinedStrokeArr,"combinedStrokeArr":wholeArr});
						}
					}
					return strokeDelete;

				}*/
			}

		}catch(e){}
	}
});