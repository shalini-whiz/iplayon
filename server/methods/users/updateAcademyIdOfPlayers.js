Meteor.methods({
	insertPlayerFromAca:function(xData){
		var nationalAffiliationID="";
		var statusOfUsers = "Active";
		if(xData.statusOfUser){
			statusOfUsers=xData.statusOfUser
		}
		if(xData.nationalAffiliationId){
			nationalAffiliationID=xData.nationalAffiliationId
		}
		var hh = Meteor.users.findOne({"_id":xData.associationId});
		if(hh&&hh.associationType=="District/City"){
			xData.parentAssociationId=hh.parentAssociationId
		}
		else{
			xData.parentAssociationId=""
		}
  		var s4="";
		if(xData.s1&&xData.s2&&xData.s3){

            var sa = parseInt(xData.s1)
            var sb = parseInt(xData.s2)
            var sc = parseInt(xData.s3)
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
			  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
			];

			var d = new Date(sb+"/"+sa+"/"+sc);
			s4 = sa+" "+monthNames[d.getMonth()]+" "+sc;
        }
        else if(xData.dateOfBirth){
        	s4=new Date(xData.dateOfBirth)
        }

        var checkDuplicate = Meteor.users.findOne({
			userName: xData.userName,
			clubName:xData.clubName,
			phoneNumber : xData.phoneNumber,
			associationId:xData.associationId,
			"parentAssociationId":xData.parentAssociationId,
			clubNameId:xData.clubNameId,
			role:"Player",
			contactPerson:xData.userName,
			state:xData.state,
			guardianName:xData.guardianName,
			dateOfBirth:s4,
			gender:xData.gender,
			country:xData.country,
			address:xData.address,
			city:xData.city,
			pinCode:xData.pinCode,
			year:new Date().getFullYear(),
			statusOfUser:statusOfUsers,
			nationalAffiliationId:nationalAffiliationID
		})
        if(checkDuplicate!==undefined){
        	return "0"
        }
        else
  		if(xData.password&&xData.emailAddress&&xData.emailAddress.trim().length!=0&&xData.password.trim().length!=0){
  			var r = Accounts.createUser({
    			email: xData.emailAddress,
    			password:xData.password,
    			userName:xData.userName
  			});
  			if(r){
  				var meteorUser = Meteor.users.update({
					"_id": r
				}, {
					$set: {
						interestedDomainName: xData.interestedDomainName,
						interestedProjectName: xData.interestedProjectName,
						interestedSubDomain1Name: xData.interestedSubDomain1Name,
						interestedSubDomain2Name: xData.interestedSubDomain2Name,
						profileSettingStatus:true,
						userName: xData.userName,
						clubName:xData.clubName,
						phoneNumber : xData.phoneNumber,
						emailAddress:xData.emailAddress,
						//awayToDate : xData.awayToDate,
						associationId:xData.associationId,
						"parentAssociationId":xData.parentAssociationId,
						//awayToDate: lAwayToDate,
						clubNameId:xData.clubNameId,
						role:"Player",
						contactPerson:xData.userName,
						state:xData.state,
						guardianName:xData.guardianName,
						dateOfBirth:s4,
						gender:xData.gender,
						country:xData.country,
						address:xData.address,
						city:xData.city,
						pinCode:xData.pinCode,
						userId:r,
						year:new Date().getFullYear(),
						statusOfUser:statusOfUsers,
						nationalAffiliationId:nationalAffiliationID
				}
			});
  				if(meteorUser){
  					if(!xData.affiliationId){
  						//getAffiliationId(r,xData,function(res){
						//});
						Meteor.users.update({_id: meteorUser}, {$set:{"clubNameId":xData.clubNameId,"clubName":xData.clubName,"associationId":xData.associationId,"interestedProjectName":hh.interestedProjectName,"interestedDomainName":hh.interestedDomainName,"parentAssociationId":xData.parentAssociationId}});
  					}
  					else{
  						Meteor.users.update({_id: r}, {$set:{"clubNameId":xData.clubNameId,"clubName":xData.clubName,"associationId":xData.associationId,"interestedProjectName":hh.interestedProjectName,"interestedDomainName":hh.interestedDomainName,"parentAssociationId":xData.parentAssociationId}});
  					}
  					var k = academies.update({"academyId":xData.clubNameId},{
						$addToSet:{
							playerUserId:r
						}
					});
					if(k)
  					return true;
  				}
  			}
  		}
  		else{
  			var meteorUser = Meteor.users.insert({
						interestedDomainName: xData.interestedDomainName,
						interestedProjectName: xData.interestedProjectName,
						interestedSubDomain1Name: xData.interestedSubDomain1Name,
						interestedSubDomain2Name: xData.interestedSubDomain2Name,
						profileSettingStatus:true,
						userName: xData.userName,
						clubName:xData.clubName,
						clubNameId:xData.clubNameId,
						phoneNumber : xData.phoneNumber,
						emailAddress:xData.emailAddress,
						"parentAssociationId":xData.parentAssociationId,
						//awayToDate : xData.awayToDate,
						associationId:xData.associationId,
						//awayToDate: lAwayToDate,
						role:"Player",
						userName:xData.userName,
						state:xData.state,
						guardianName:xData.guardianName,
						dateOfBirth:s4,
						gender:xData.gender,
						country:xData.country,
						address:xData.address,
						city:xData.city,
						pinCode:xData.pinCode,
						year:new Date().getFullYear(),
						statusOfUser:statusOfUsers,
						nationalAffiliationId:nationalAffiliationID
				});
  			if(meteorUser){
  				var meteorUser2 = Meteor.users.update({
					"_id": meteorUser
				}, {
					$set: {
						userId:meteorUser
					}
				});
				if(meteorUser2){
					if(!xData.affiliationId){
  						//getAffiliationId(meteorUser,xData,function(res){
						//});
						Meteor.users.update({_id: meteorUser}, {$set:{"clubNameId":xData.clubNameId,"clubName":xData.clubName,"associationId":xData.associationId,"interestedProjectName":hh.interestedProjectName,"interestedDomainName":hh.interestedDomainName,"affiliationId":xData.affiliationId,"parentAssociationId":xData.parentAssociationId}});
  					}
  					else{

  						Meteor.users.update({_id: meteorUser}, {$set:{"clubNameId":xData.clubNameId,"clubName":xData.clubName,"associationId":xData.associationId,"interestedProjectName":hh.interestedProjectName,"interestedDomainName":hh.interestedDomainName,"affiliationId":xData.affiliationId,"parentAssociationId":xData.parentAssociationId}});
  					}
					var k = academies.update({"academyId":xData.clubNameId},{
						$addToSet:{
							playerUserId:meteorUser
						}
					});
					if(k)
  					return true;
				}
  			}
  		}
	}
});

Meteor.methods({
	'updateAcademyIdOfPlayers': function(xData) {
		check(xData, Object);
			for(var i=0;i<xData.userId.length;i++){
			var hh = Meteor.users.findOne({"_id":xData.associationId});
			if(hh&&hh.associationType=="District/City"){
				xData.parentAssociationId=hh.parentAssociationId
			}
			else{
				xData.parentAssociationId=""
			}
			var userId = xData.userId[i]

			var j = Meteor.users.update({_id: userId}, {$set:{"clubNameId":xData.clubNameId,"clubName":xData.clubName,"associationId":xData.associationId,"interestedProjectName":xData.interestedProjectName,"interestedDomainName":xData.interestedDomainName,"parentAssociationId":xData.parentAssociationId}});
				//var j = Meteor.users.update({_id: {$in: xData.userId}}, {$set:{"clubNameId":xData.clubNameId,"clubName":xData.clubName,"associationId":xData.associationId,"interestedProjectName":xData.interestedProjectName,"interestedDomainName":xData.interestedDomainName}}, {multi:true});
				//call function for each userId
			
				//getAffiliationId(xData.userId[i],xData,function(res){
				//});
			}
			var k = academies.update({"academyId":xData.clubNameId},{
					$addToSet:{
						playerUserId:{ $each:xData.userId
						}
					}
			});
			if(k){
				return true
			}
	}
});


Meteor.methods({
	'updatePullPlayers': function(xData) {
		var j = Meteor.users.update({_id:{$in: xData.userId}}, {$set:{"clubNameId":"other","clubName":"other","interestedProjectName":[""],"interestedDomainName":[""], "associationId":"other","parentAssociationId":"other","statusOfUser":"notApproved"}}, {multi:true});
		if(j){
			var k = academies.update({"academyId":xData.academyId},{
				$pullAll:{
					playerUserId:xData.userId
				}
			});
		}
	}
});

Meteor.methods({
    "geneAffId":function(affIdFormat,xData){
        check(xData,Object);
        check(affIdFormat,String);
        var hh ;
        var userDet = Meteor.users.findOne({"_id":xData.userId});
        if(userDet.statusOfUser!=="notApproved"&&(userDet.affiliationId==null||userDet.affiliationId==undefined||userDet.affiliationId.length==0)){
            hh = Meteor.users.findOne({"_id":userDet.associationId});
            var aPId="";
            if(hh&&hh.associationType=="District/City"){
                    aPId=hh._id
            }
            else{
                aPId=xData.associationId
            }
            var lastInsertedAffIdget = lastInsertedAffId.findOne({"assocId":aPId});
            if(lastInsertedAffIdget){
                lasInsertedIdN=lastInsertedAffIdget.lastInsertedId
            }
            else{
                lasInsertedIdN=0
            }
            var padded = ('0000'+parseInt(parseInt(lasInsertedIdN)+1)).slice(-5);
            var AId=affIdFormat.toUpperCase()+xData.year.toString().substring(2, 4)+padded;
            var j = Meteor.users.update({_id: xData.userId}, {$set:{"affiliationId":AId,"statusOfUser":"Active"}});
            var l = lastInsertedAffId.remove({"assocId":aPId});
            var k = lastInsertedAffId.insert({"assocId":aPId,"lastInsertedId":parseInt(parseInt(lasInsertedIdN)+1)})
            return true
        }
        else if(userDet.statusOfUser!="Active"&&(userDet.affiliationId!=null||userDet.affiliationId!=undefined||userDet.affiliationId.trim().length!==0)){
            var j = Meteor.users.update({_id: xData.userId}, {$set:{"statusOfUser":"Active"}});
            return true
        }
        else{
            var j = Meteor.users.update({_id: xData.userId}, {$set:{"statusOfUser":"Active"}});
            return true
        }
    }
});


var getAffiliationId = function(userId,xData,xcallback){
	
	var hh = Meteor.users.findOne({"_id":xData.associationId});
	if(hh&&hh.associationType=="District/City"){
		xData.parentAssociationId=hh.parentAssociationId
	}
	else{
		xData.parentAssociationId=""
	}



	//find associd details to know dist or state
	var stateAssocId=Meteor.users.findOne({"_id":xData.associationId});
	var type ="",lasInsertedIdN=0;

	//if fetched
	if(stateAssocId){
		//if dist. assoc
		if(stateAssocId.associationType=="District/City"){
			//find lastinserted numb
			var lastInsertedAffIdget = lastInsertedAffId.findOne({"assocId":stateAssocId.parentAssociationId});
			//if fetched, fetch last inserted num
			if(lastInsertedAffIdget){
				lasInsertedIdN=lastInsertedAffIdget.lastInsertedId
			}
			//else set to 0
			else{
				lasInsertedIdN=0
			}
			//find type aff id set by state assoc
			type=affiliationIdType.findOne({"stateAssocId":stateAssocId.parentAssociationId});
			//if fetched
			if(type){
				//find user details to get registered year
				iduser = Meteor.users.findOne({"userId":userId});
				//if fetched
				if(iduser){
					//concat strings
					var padded = ('0000'+parseInt(parseInt(lasInsertedIdN)+1)).slice(-5);
					//if aff id set by assoc is fixed type fetch the fixed characters
					if(type.firTCharType=="fixed"){
						type.firTCharType=type.fixedCharcters
					}
					//fetch abrevation
					else if(type.firTCharType=="SA"){
						var abbr = Meteor.users.findOne({"userId":stateAssocId.parentAssociationId})
						type.firTCharType=abbr.abbrevationAssociation.substring(0, 3)
					}
					else if(type.firTCharType=="DA"){
						var abbr = Meteor.users.findOne({"userId":xData.associationId})
						type.firTCharType=abbr.abbrevationAssociation.substring(0, 3)
					}
					
					//concat all strings
					var AId=type.firTCharType+iduser.year.toString().substring(2, 4)+padded;
					//update user with aid
					var j = Meteor.users.update({_id: userId}, {$set:{"clubNameId":xData.clubNameId,"clubName":xData.clubName,"associationId":xData.associationId,"interestedProjectName":xData.interestedProjectName,"interestedDomainName":xData.interestedDomainName,"affiliationId":AId,"parentAssociationId":xData.parentAssociationId}});
					//remove the last inserted
					var l = lastInsertedAffId.remove({"assocId":stateAssocId.parentAssociationId});
					//insert the new inserted id
					var k = lastInsertedAffId.insert({"assocId":stateAssocId.parentAssociationId,"lastInsertedId":parseInt(parseInt(lasInsertedIdN)+1)})
					return true
				}
			}
		}

		//if not district
		else{
			var lastInsertedAffIdget = lastInsertedAffId.findOne({"assocId":stateAssocId.associationId});
			//if fetched, fetch last inserted num
			if(lastInsertedAffIdget){
				lasInsertedIdN=lastInsertedAffIdget.lastInsertedId
			}
			//else set to 0
			else{
				lasInsertedIdN=0
			}
			
			//fetch type set by st ass using association id
			type=affiliationIdType.findOne({"stateAssocId":stateAssocId.associationId});
			if(type){
				iduser = Meteor.users.findOne({"userId":userId});
				if(iduser){
					
					//concat strings
					var padded = ('0000'+parseInt(parseInt(lasInsertedIdN)+1)).slice(-5);
					//if aff id set by assoc is fixed type fetch the fixed characters
					if(type.firTCharType=="fixed"){
						type.firTCharType=type.fixedCharcters
					}
					//fetch abrevation
					else if(type.firTCharType=="SA"){
						var abbr = Meteor.users.findOne({"userId":xData.associationId})
						type.firTCharType=abbr.abbrevationAssociation.substring(0, 3)
					}
					else if(type.firTCharType=="DA"){
						var abbr = Meteor.users.findOne({"userId":xData.associationId})
						type.firTCharType=abbr.abbrevationAssociation.substring(0, 3)
					}
					//concat all strings
					
					var AId=type.firTCharType+iduser.year.toString().substring(2, 4)+padded;
					//update user with aid
					var j = Meteor.users.update({_id: userId}, {$set:{"clubNameId":xData.clubNameId,"clubName":xData.clubName,"associationId":xData.associationId,"interestedProjectName":xData.interestedProjectName,"interestedDomainName":xData.interestedDomainName,"affiliationId":AId,"parentAssociationId":xData.parentAssociationId}});
					//remove the last inserted
					var l = lastInsertedAffId.remove({"assocId":xData.associationId});
					//insert the new inserted id
					var k = lastInsertedAffId.insert({"assocId":xData.associationId,"lastInsertedId":parseInt(parseInt(lasInsertedIdN)+1)})
					return true
				}
			}
		}
	}
}


Meteor.methods({
	insertPlayerFromAca_CSV:function(xData){
		var nationalAffiliationID="";
		if(xData.nationalAffiliationId){
			nationalAffiliationID=xData.nationalAffiliationId
		}
		if(!xData.emailAddress){
			xData.emailAddress = "";
		}
		if(!xData.address){
			xData.address = "";
		}
		 var findDuplicate = Meteor.users.findOne({
	            "role": "Player",
	            "emailAddress": xData.emailAddress.trim(),
	            "userName": xData.userName.trim(),
	            "guardianName": xData.guardianName.trim(),
	            "phoneNumber": xData.phoneNumber.trim(),
	            "dateOfBirth": new Date(xData.dateOfBirth.trim()),
	            "gender": xData.gender.trim(),
	            "address": xData.address.trim(),
	            "city": xData.city.trim(),
	            "pinCode": xData.pinCode.trim(),
	            "nationalAffiliationId": nationalAffiliationID.trim()
	       	})
		if(findDuplicate==undefined){
		var nationalAffiliationID="";
		var statusOfUsers = "Active";
		if(xData.statusOfUser){
			statusOfUsers=xData.statusOfUser
		}
		if(xData.nationalAffiliationId){
			nationalAffiliationID=xData.nationalAffiliationId
		}
		var hh = Meteor.users.findOne({"_id":xData.associationId});
		if(hh&&hh.associationType=="District/City"){
			xData.parentAssociationId=hh.parentAssociationId
		}
		else{
			xData.parentAssociationId=""
		}
  		var s4="";
		if(xData.s1&&xData.s2&&xData.s3){
			/*var sa = parseInt(xData.s1)
            var sb = parseInt(xData.s2)
            var sc = parseInt(xData.s3)
            s4 = moment.utc(new Date(sc + "/" + sb + "/" + sa)).format("DD MMM YYYY");*/
            var sa = parseInt(xData.s1)
            var sb = parseInt(xData.s2)
            var sc = parseInt(xData.s3)
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
			  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
			];

			var d = new Date(sb+"/"+sa+"/"+sc);
			s4 = sa+" "+monthNames[d.getMonth()]+" "+sc;
        }
        else if(xData.dateOfBirth){
        	s4=new Date(xData.dateOfBirth)
        }
  		if(xData.password&&xData.emailAddress&&xData.emailAddress.trim().length!=0&&xData.password.trim().length!=0){
  			var r = Accounts.createUser({
    			email: xData.emailAddress,
    			password:xData.password,
    			userName:xData.userName
  			});
  			if(r){
  				var insertCount = insertedUsersCount.findOne({"_id":"6dSDPs2sZgjAMKL"});
  				if(insertCount==undefined){
  					insertedUsersCount.insert({
  						"_id":"6dSDPs2sZgjAMKL",
  						counterValue:1
  					});
  				}
  				else{
  					insertedUsersCount.update({
  						"_id":"6dSDPs2sZgjAMKL"},{$set:{
  						counterValue:parseInt(insertCount.counterValue+1)}
  					});
  				}
  				var meteorUser = Meteor.users.update({
					"_id": r
				}, {
					$set: {
						interestedDomainName: xData.interestedDomainName,
						interestedProjectName: xData.interestedProjectName,
						interestedSubDomain1Name: xData.interestedSubDomain1Name,
						interestedSubDomain2Name: xData.interestedSubDomain2Name,
						profileSettingStatus:true,
						userName: xData.userName,
						clubName:xData.clubName,
						phoneNumber : xData.phoneNumber,
						emailAddress:xData.emailAddress,
						//awayToDate : xData.awayToDate,
						associationId:xData.associationId,
						"parentAssociationId":xData.parentAssociationId,
						//awayToDate: lAwayToDate,
						clubNameId:xData.clubNameId,
						role:"Player",
						contactPerson:xData.userName,
						state:xData.state,
						guardianName:xData.guardianName,
						dateOfBirth:s4,
						gender:xData.gender,
						country:xData.country,
						address:xData.address,
						city:xData.city,
						pinCode:xData.pinCode,
						userId:r,
						year:new Date().getFullYear(),
						statusOfUser:statusOfUsers,
						nationalAffiliationId:nationalAffiliationID
				}
			});
  				if(meteorUser){
  					if(!xData.affiliationId){
  						//getAffiliationId(r,xData,function(res){
						//});
						Meteor.users.update({_id: meteorUser}, {$set:{"clubNameId":xData.clubNameId,"clubName":xData.clubName,"associationId":xData.associationId,"interestedProjectName":hh.interestedProjectName,"interestedDomainName":hh.interestedDomainName,"parentAssociationId":xData.parentAssociationId}});
  					}
  					else{
  						Meteor.users.update({_id: r}, {$set:{"clubNameId":xData.clubNameId,"clubName":xData.clubName,"associationId":xData.associationId,"interestedProjectName":hh.interestedProjectName,"interestedDomainName":hh.interestedDomainName,"parentAssociationId":xData.parentAssociationId}});
  					}
  					var k = academies.update({"academyId":xData.clubNameId},{
						$addToSet:{
							playerUserId:r
						}
					});
					if(k)
  					return true;
  				}
  			}
  		}
  		else{
  			var meteorUser = Meteor.users.insert({
						interestedDomainName: xData.interestedDomainName,
						interestedProjectName: xData.interestedProjectName,
						interestedSubDomain1Name: xData.interestedSubDomain1Name,
						interestedSubDomain2Name: xData.interestedSubDomain2Name,
						profileSettingStatus:true,
						userName: xData.userName,
						clubName:xData.clubName,
						clubNameId:xData.clubNameId,
						phoneNumber : xData.phoneNumber,
						emailAddress:xData.emailAddress,
						"parentAssociationId":xData.parentAssociationId,
						//awayToDate : xData.awayToDate,
						associationId:xData.associationId,
						//awayToDate: lAwayToDate,
						role:"Player",
						userName:xData.userName,
						state:xData.state,
						guardianName:xData.guardianName,
						dateOfBirth:s4,
						gender:xData.gender,
						country:xData.country,
						address:xData.address,
						city:xData.city,
						pinCode:xData.pinCode,
						year:new Date().getFullYear(),
						statusOfUser:statusOfUsers,
						nationalAffiliationId:nationalAffiliationID
				});
  			if(meteorUser){
  				var insertCount = insertedUsersCount.findOne({"_id":"6dSDPs2sZgjAMKL"});
  				if(insertCount==undefined){
  					insertedUsersCount.insert({
  						"_id":"6dSDPs2sZgjAMKL",
  						counterValue:1
  					});
  				}
  				else{
  					insertedUsersCount.update({
  						"_id":"6dSDPs2sZgjAMKL"},{$set:{
  						counterValue:parseInt(insertCount.counterValue+1)}
  					});
  				}
  				var meteorUser2 = Meteor.users.update({
					"_id": meteorUser
				}, {
					$set: {
						userId:meteorUser
					}
				});
				if(meteorUser2){
					if(!xData.affiliationId){
  						//getAffiliationId(meteorUser,xData,function(res){
						//});
						Meteor.users.update({_id: meteorUser}, {$set:{"clubNameId":xData.clubNameId,"clubName":xData.clubName,"associationId":xData.associationId,"interestedProjectName":hh.interestedProjectName,"interestedDomainName":hh.interestedDomainName,"affiliationId":xData.affiliationId,"parentAssociationId":xData.parentAssociationId}});
  					}
  					else{
  						Meteor.users.update({_id: meteorUser}, {$set:{"clubNameId":xData.clubNameId,"clubName":xData.clubName,"associationId":xData.associationId,"interestedProjectName":hh.interestedProjectName,"interestedDomainName":hh.interestedDomainName,"affiliationId":xData.affiliationId,"parentAssociationId":xData.parentAssociationId}});
  						var affID  = xData.affiliationId.substr(xData.affiliationId.length - 5);
						if(affID.match(/^\d+$/)){
							var split1 = affID.split("");
							var numbStartsAt = 0
							for(var is=0;is<split1.length;is++){
								if(parseInt(split1[is])!==0){
									numbStartsAt = is;
									break
								}
							}
							var lastinserted = lastInsertedAffId.findOne({$or:[
								{"assocId":xData.associationId},
								{"assocId":xData.parentAssociationId}
								]});
							if(lastinserted){
								var afterValidSp = affID.slice(numbStartsAt);
								if(parseInt(lastinserted.lastInsertedId)<=parseInt(afterValidSp)){
									lastInsertedAffId.update({$or:[
										{"assocId":xData.associationId},
										{"assocId":xData.parentAssociationId}
									]},{$set:{lastInsertedId:afterValidSp}});
								}
							}
							else{
								var who = Meteor.users.findOne({
									"_id":xData.associationId,
									associationType:"State/Province/County"
								})
								if(who==undefined){
									who = Meteor.users.findOne({
									"_id":xData.parentAssociationId,
									associationType:"State/Province/County"
									});
									if(who){
										var afterValidSp = affID.slice(numbStartsAt);
										lastInsertedAffId.insert({
											"assocId":xData.associationId,
											lastInsertedId:afterValidSp
										});
									}
								}
								else{
									var afterValidSp = affID.slice(numbStartsAt);
									lastInsertedAffId.insert({
										"assocId":xData.associationId,
										lastInsertedId:afterValidSp
									});
								}
							}
						}
  					}
					var k = academies.update({"academyId":xData.clubNameId},{
						$addToSet:{
							playerUserId:meteorUser
						}
					});
					if(k)
  					return true;
				}
  			}
  		}
  		}
	}
});