Template.RankingAnalytics.onCreated(function(){
	this.subscribe("users");
	this.subscribe("PlayerPoints");
	this.subscribe("tournamentEvents");
});

Template.RankingAnalytics.onRendered(function(){
Session.set("sport_RANK",undefined);
});

Template.RankingAnalytics.helpers({
	"playersRanking":function(){
		var id=Router.current().params._id;
		var arrayUser1=[],arrayUser2=[];
		checkAssocType = Meteor.users.findOne({"_id":id});
		if(checkAssocType&&checkAssocType.associationType=="State/Province/County"){
			if(Session.get("sport_RANK")){
				try{
					var playerRankingList=[],playerRankingList2=[];
					var playerDetails = PlayerPoints.find({"associationId":id}).fetch();
					if(playerDetails.length!=0){
						for(var i=0;i<playerDetails.length;i++){
							for(var j=0;j<playerDetails[i].categories.length;j++){
								var categories = playerDetails[i].categories[j]
								if(categories.eventName==Session.get("sport_RANK")){
									var userDetails=Meteor.users.findOne({"userId":playerDetails[i].playerId});
									if(userDetails!=undefined){
										var data={
											userId:userDetails.userId,
											userName:userDetails.userName,
											academyName:userDetails.clubName,
											points:categories.totalPoints
										}
										playerRankingList.push(data)
									}
								}
							}
						}
					}
					var playerDetails2 = PlayerPoints.find({"parentAssociationId":id}).fetch();
					if(playerDetails2.length!=0){
						for(var i=0;i<playerDetails2.length;i++){
							for(var j=0;j<playerDetails2[i].categories.length;j++){
								var categories = playerDetails2[i].categories[j]
								if(categories.eventName==Session.get("sport_RANK")){
									var userDetails=Meteor.users.findOne({"userId":playerDetails2[i].playerId});
									if(userDetails!=undefined){
										var data={
											userId:userDetails.userId,
											userName:userDetails.userName,
											academyName:userDetails.clubName,
											points:categories.totalPoints
										}
										playerRankingList2.push(data)
									}
								}
							}
						}
					}

					
					mergeByProperty(playerRankingList, playerRankingList2, 'userId');
					if(playerRankingList.length!=0){
						playerRankingList.sort(function(a, b){
						 return parseInt(b.points) - parseInt(a.points);
						});
						playerRankingList.map(function(document, index){
							document["rank"]=parseInt(index+1);
						});
						return playerRankingList;
					}

					else{
					}
				}catch(e){
				}
			}
		}
		if(checkAssocType&&checkAssocType.associationType=="District/City"){
			var playerRankingList=[],playerRankingList2=[];
			var playerDetails = PlayerPoints.find({"associationId":id}).fetch();
			if(playerDetails.length!=0){
				for(var i=0;i<playerDetails.length;i++){
					for(var j=0;j<playerDetails[i].categories.length;j++){
						var categories = playerDetails[i].categories[j]
							if(categories.eventName==Session.get("sport_RANK")){
								var userDetails=Meteor.users.findOne({"userId":playerDetails[i].playerId});
								if(userDetails!=undefined){
									var data={
										userId:userDetails.userId,
										userName:userDetails.userName,
										academyName:userDetails.clubName,
										points:categories.totalPoints
									}
								playerRankingList.push(data)
							}
						}
					}
				}
			}		
			if(playerRankingList.length!=0){
				playerRankingList.sort(function(a, b){
				 return parseInt(b.points) - parseInt(a.points);
				});
				playerRankingList.map(function(document, index){
					document["rank"]=parseInt(index+1);
				});
				return playerRankingList;
			}	
		}
	},
	categoryList:function(){
		try{
			if(Meteor.user()!=null&&Meteor.user().interestedProjectName!=undefined){
				var findProj=tournamentEvents.findOne({"_id":Meteor.user().interestedProjectName.toString()});
				if(findProj!=undefined&&findProj.projectSubName!=undefined){
					return findProj.projectSubName;
				}
			}
		}catch(e){
		}
	}
});


Template.RankingAnalytics.events({
	"change #sportSelect":function(e){
		e.preventDefault();
		Session.set("sport_RANK",$("#sportSelect").val());
	}
});

function mergeByProperty(arr1, arr2, prop) {
    _.each(arr2, function(arr2obj) {
        var arr1obj = _.find(arr1, function(arr1obj) {
            return arr1obj[prop] === arr2obj[prop];
        });
         
        //If the object already exist extend it with the new values from arr2, otherwise just add the new object to arr1
        arr1obj ? _.extend(arr1obj, arr2obj) : arr1.push(arr2obj);
    });
}