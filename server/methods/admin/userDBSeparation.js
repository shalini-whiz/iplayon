//userDetailsTTUsed

Meteor.methods({
	"moveAssociationToNewDB":function()
	{
		try{
			var associationList = Meteor.users.find({role:"Association"}).fetch();
			var counter = 0;
			var message = [];
			message.push("actual association list"+associationList.length);

			if(associationList.length)
			{
				for(var i=0; i<associationList.length;i++)
				{
				
					var assocUser = associationList[i];

					var assocFound = associationDetails.findOne({userId:assocUser.userId});
					if(!assocFound)
					{
						var assocUser_userId = "";
						if(assocUser.userId)
							assocUser_userId = assocUser.userId;

						var assocUser_associationName = "";
						if(assocUser.clubName)
							assocUser_associationName = assocUser.clubName;

						var assocUser_emailAddress = "";
						if(assocUser.emailAddress)
						 assocUser_emailAddress = assocUser.emailAddress;

						var assocUser_associationType;
						if(assocUser.associationType)
							assocUser_associationType = assocUser.associationType;

						var assocUser_abbrevationAssociation = "";
						if(assocUser.abbrevationAssociation)
							assocUser_abbrevationAssociation = assocUser.abbrevationAssociation.toUpperCase();
					
						var assocUser_dateOfInc = "";
						if(assocUser.dateOfInc)
							assocUser_dateOfInc = assocUser.dateOfInc;

						var assocUser_phoneNumber = "";
						if(assocUser.phoneNumber)
							assocUser_phoneNumber = assocUser.phoneNumber;

						var assocUser_contactPerson = "";
						if(assocUser.contactPerson)
							assocUser_contactPerson = assocUser.contactPerson;

						var assocUser_address = "";
						if(assocUser.address)
							assocUser_address = assocUser.address;

						var assocUser_city = "";
						if(assocUser.city)
							assocUser_city = assocUser.city;

						var assocUser_state = "";
						if(assocUser.state)
							assocUser_state = assocUser.state;

						var assocUser_pinCode = "";
						if(assocUser.pinCode)
							assocUser_pinCode = assocUser.pinCode;

						var assocUser_country = "";
						if(assocUser.country)
							assocUser_country = assocUser.country;

						var assocUser_year = "";
						if(assocUser.year)
							assocUser_year = assocUser.year;

						var assocUser_profileSettingStatus = "";
						if(assocUser.profileSettingStatus)
							assocUser_profileSettingStatus = assocUser.profileSettingStatus
						
						var assocUser_interestedDomainName = "";
						if(assocUser.interestedDomainName)
							assocUser_interestedDomainName = assocUser.interestedDomainName
						
						var assocUser_interestedProjectName = "";
						if(assocUser.interestedProjectName)
							assocUser_interestedProjectName = assocUser.interestedProjectName;
						
						var assocUser_interestedSubDomain1Name = "";
						if(assocUser.interestedSubDomain1Name)
							assocUser_interestedSubDomain1Name = assocUser.interestedSubDomain1Name;
					
						var assocUser_interestedSubDomain2Name = "";
						if(assocUser.interestedSubDomain2Name)
							assocUser.interestedSubDomain2Name = assocUser.interestedSubDomain2Name;
						
						var assocUser_statusOfUser = "";
						if(assocUser.statusOfUser)
							assocUser.statusOfUser = assocUser.statusOfUser;

						var assocUser_affiliatedTo = "";
						var assocUser_parentAssociationId = "";
						if(assocUser.associationType == "State/Province/County")
						{
							assocUser_affiliatedTo = "other";
							assocUser_parentAssociationId = "";
						}
						else 
						{
							if(assocUser.parentAssociationId)
							{
								var assocUser_parentAssociationId = assocUser.parentAssociationId;
								if(assocUser_parentAssociationId == "other" || assocUser_parentAssociationId == null ||
								assocUser_parentAssociationId == undefined || assocUser_parentAssociationId == "")
									assocUser_affiliatedTo = "other";
								else
									assocUser_affiliatedTo = "stateAssociation";							
							}
						}	
						if(assocUser.interestedDomainName != undefined)
						{
							var associationInsert = associationDetails.insert({
							 	interestedDomainName: assocUser_interestedDomainName,
								interestedProjectName: ["QvHXDftiwsnc8gyfJ"],
								interestedSubDomain1Name: assocUser_interestedSubDomain1Name,
								interestedSubDomain2Name: assocUser_interestedSubDomain2Name,
								profileSettingStatus:assocUser_profileSettingStatus,
								phoneNumber : assocUser_phoneNumber,
								role:"Association",contactPerson:assocUser_contactPerson,
								address:assocUser_address,city:assocUser_city,
								pinCode:assocUser_pinCode,state:assocUser_state,
								country:assocUser_country,
								abbrevationAssociation:assocUser_abbrevationAssociation,
								statusOfUser:"Active",associationName:assocUser_associationName,
								associationType:assocUser_associationType,userId:assocUser_userId,
								year:assocUser_year,parentAssociationId:assocUser_parentAssociationId,
								emailAddress:assocUser_emailAddress,affiliatedTo:assocUser_affiliatedTo
						 	});	

							if(assocUser_dateOfInc != "" && assocUser_dateOfInc != undefined 
								 && assocUser_dateOfInc != "NaN undefined NaN" && assocUser_dateOfInc != null
								&& assocUser_dateOfInc.length > 0 && associationInsert )
							{
								var associationUpdate = associationDetails.update({userId:assocUser_userId},
									{$set:{dateOfInc:assocUser_dateOfInc}})

							}
							if(associationInsert)
							{
								Meteor.users.update({userId:assocUser_userId}, 
									{$set: {
									userName:assocUser.clubName}});
								Meteor.users.update({userId:assocUser_userId}, 
									{$unset: {
									interestedDomainName:1,
									interestedSubDomain1Name: 1,
									interestedSubDomain2Name: 1,
									phoneNumber : 1,
									contactPerson:1,
									address:1,city:1,
									pinCode:1,state:1,
									country:1,
									abbrevationAssociation:1,
									statusOfUser:1,clubName:1,
									year:1,
									associationId:1,
									parentAssociationId:1,
									dateOfBirth:1,
									dateOfInc : 1, nationalAffiliationId : 1
								}}, false, true);
								counter = parseInt(counter) + 1;
							}
						}
						

					}
									
				}
				message.push("moved association list"+counter);

			}
			return message;
		}catch(e){}
	},
	"moveAcademyToNewDB":function()
	{
		try{
			var academyList = Meteor.users.find({role:"Academy"}).fetch();
			var counter = 0;
			var message = [];
			message.push("actual academy list"+academyList.length);
			if(academyList.length)
			{
				for(var i=0; i<academyList.length;i++)
				{
				
					var academyUser = academyList[i];
					var academyFound = academyDetails.findOne({userId:academyUser.userId});
					if(!academyFound)
					{
						var academyUser_userId = "";
						if(academyUser.userId)
							academyUser_userId = academyUser.userId;

						var academyUser_clubName = "";
						if(academyUser.clubName)
							academyUser_clubName = academyUser.clubName;

						var academyUser_emailAddress = "";
						if(academyUser.emailAddress)
						 academyUser_emailAddress = academyUser.emailAddress;

						var academyUser_associationType;
						if(academyUser.associationType)
							academyUser_associationType = academyUser.associationType;

						var academyUser_abbrevationAssociation = "";
						if(academyUser.abbrevationAssociation)
							academyUser_abbrevationAssociation = academyUser.abbrevationAssociation.toUpperCase();
					
						var academyUser_dateOfInc = "";
						if(academyUser.dateOfInc)
							academyUser_dateOfInc = academyUser.dateOfInc;

						var academyUser_phoneNumber = "";
						if(academyUser.phoneNumber)
							academyUser_phoneNumber = academyUser.phoneNumber;

						var academyUser_contactPerson = "";
						if(academyUser.contactPerson)
							academyUser_contactPerson = academyUser.contactPerson;

						var academyUser_address = "";
						if(academyUser.address)
							academyUser_address = academyUser.address;

						var academyUser_city = "";
						if(academyUser.city)
							academyUser_city = academyUser.city;

						var academyUser_state = "";
						if(academyUser.state)
							academyUser_state = academyUser.state;

						var academyUser_pinCode = "";
						if(academyUser.pinCode)
							academyUser_pinCode = academyUser.pinCode;

						var academyUser_country = "";
						if(academyUser.country)
							academyUser_country = academyUser.country;

						var academyUser_year = "";
						if(academyUser.year)
							academyUser_year = academyUser.year;

						var academyUser_profileSettingStatus = "";
						if(academyUser.profileSettingStatus)
							academyUser_profileSettingStatus = academyUser.profileSettingStatus
						
						var academyUser_interestedDomainName = "";
						if(academyUser.interestedDomainName)
							academyUser_interestedDomainName = academyUser.interestedDomainName
						
						var academyUser_interestedProjectName = "";
						if(academyUser.interestedProjectName)
							academyUser_interestedProjectName = academyUser.interestedProjectName;
						
						var academyUser_interestedSubDomain1Name = "";
						if(academyUser.interestedSubDomain1Name)
							academyUser_interestedSubDomain1Name = academyUser.interestedSubDomain1Name;
					
						var academyUser_interestedSubDomain2Name = "";
						if(academyUser.interestedSubDomain2Name)
							academyUser.interestedSubDomain2Name = academyUser.interestedSubDomain2Name;
						
						var academyUser_statusOfUser = "";
						if(academyUser.statusOfUser)
							academyUser.statusOfUser = academyUser.statusOfUser;

						var academyUser_affiliatedTo = "other";
						var academyUser_parentAssociationId = "";
						var academyUser_associationId = "";
						
						if(academyUser.associationId)
						{
							var academyUser_associationId = academyUser.associationId;
							if(academyUser_associationId == "other" || academyUser_associationId == null ||
							academyUser_associationId == undefined || academyUser_associationId == "")
								academyUser_affiliatedTo = "other";
							else
							{
								if(academyUser.parentAssociationId)
								{
									var academyUser_parentAssociationId = academyUser.parentAssociationId;
									if(academyUser_parentAssociationId == "other" || academyUser_parentAssociationId == null ||
									academyUser_parentAssociationId == undefined || academyUser_parentAssociationId == "")
										academyUser_affiliatedTo = "stateAssociation";
									else
										academyUser_affiliatedTo = "districtAssociation";							
								}
								else
									academyUser_affiliatedTo = "stateAssociation";
							}
						}
						
							

						if(academyUser.interestedDomainName != undefined)
						{
							var academyInsert = academyDetails.insert({
							 	interestedDomainName: academyUser_interestedDomainName,
								interestedProjectName: ["QvHXDftiwsnc8gyfJ"],
								interestedSubDomain1Name: academyUser_interestedSubDomain1Name,
								interestedSubDomain2Name: academyUser_interestedSubDomain2Name,
								profileSettingStatus:academyUser_profileSettingStatus,
								phoneNumber : academyUser_phoneNumber,
								role:"Academy",contactPerson:academyUser_contactPerson,
								address:academyUser_address,city:academyUser_city,
								pinCode:academyUser_pinCode,state:academyUser_state,
								country:academyUser_country,
								abbrevationAcademy:academyUser_abbrevationAssociation,
								statusOfUser:"Active",clubName:academyUser_clubName,
								userId:academyUser_userId,year:academyUser_year,
								associationId:academyUser_associationId,
								parentAssociationId:academyUser_parentAssociationId,
								emailAddress:academyUser_emailAddress,affiliatedTo:academyUser_affiliatedTo
						 	});

							if(academyUser_dateOfInc != "" && academyUser_dateOfInc != undefined 
							 && academyUser_dateOfInc != "NaN undefined NaN" && academyUser_dateOfInc != "Invalid date"
							&& academyUser_dateOfInc.length > 0 && academyInsert )
							{
								var academyUpdate = academyDetails.update({userId:academyUser_userId},
								{$set:{dateOfInc:academyUser_dateOfInc}})

							}
							if(academyInsert)
							{
								Meteor.users.update({userId:academyUser_userId}, 
									{$set: {
									userName:academyUser.clubName}});
								Meteor.users.update({userId:academyUser_userId}, 
									{$unset: {
									interestedDomainName:1,
									interestedSubDomain1Name: 1,
									interestedSubDomain2Name: 1,
									phoneNumber : 1,
									contactPerson:1,
									address:1,city:1,
									pinCode:1,state:1,
									country:1,
									abbrevationAcademy:1,
									statusOfUser:1,clubName:1,
									year:1,
									associationId:1,
									parentAssociationId:1,
									dateOfBirth:1,
									dateOfInc : 1, nationalAffiliationId : 1
								}}, false, true);
								counter = parseInt(counter) + 1;

							}
						}
					}					
				}
				message.push("moved academy list"+counter);

			}
			return message;
		}catch(e){}
	},
	"movePlayersToNewDB":function()
	{
		try
		{
			var playerList = Meteor.users.find({role:"Player"}).fetch();
			var counter = 0;
			var message = [];
			message.push("actual player list"+playerList.length);
			if(playerList.length)
			{
				for(var i=0; i<playerList.length;i++)
				{
					var playerUser = playerList[i];
					var playerFound = userDetailsTT.findOne({userId:playerUser.userId});
					if(!playerFound)
					{
						var playerUser_userId = "";
						if(playerUser.userId)
							playerUser_userId = playerUser.userId;

						var playerUser_userName = "";
						if(playerUser.userName)
							playerUser_userName = playerUser.userName;

						var playerUser_emailAddress = "";
						if(playerUser.emailAddress)
						 playerUser_emailAddress = playerUser.emailAddress;

						var playerUser_gender;
						if(playerUser.gender)
							playerUser_gender = playerUser.gender;

						var playerUser_guardianName;
						if(playerUser.guardianName)
							playerUser_guardianName = playerUser.guardianName;

						var playerUser_abbrevationAssociation = "";
						if(playerUser.abbrevationAssociation)
							playerUser_abbrevationAssociation = playerUser.abbrevationAssociation.toUpperCase();
					
						var playerUser_dateOfBirth = "";
						if(playerUser.dateOfBirth)
							playerUser_dateOfBirth = playerUser.dateOfBirth;

						var playerUser_phoneNumber = "";
						if(playerUser.phoneNumber)
							playerUser_phoneNumber = playerUser.phoneNumber;

						var playerUser_affiliationId = "";
						if(playerUser.affiliationId)
							playerUser_affiliationId = playerUser.affiliationId;

						var playerUser_nationalaffiliationId = "";
						if(playerUser.nationalAffiliationId)
							playerUser_nationalaffiliationId = playerUser.nationalAffiliationId;
						
						var playerUser_contactPerson = "";
						if(playerUser.contactPerson)
							playerUser_contactPerson = playerUser.contactPerson;

						var playerUser_address = "";
						if(playerUser.address)
							playerUser_address = playerUser.address;

						var playerUser_city = "";
						if(playerUser.city)
							playerUser_city = playerUser.city;

						var playerUser_state = "";
						if(playerUser.state)
							playerUser_state = playerUser.state;

						var playerUser_pinCode = "";
						if(playerUser.pinCode)
							playerUser_pinCode = playerUser.pinCode;

						var playerUser_country = "";
						if(playerUser.country)
							playerUser_country = playerUser.country;

						var playerUser_year = "";
						if(playerUser.year)
							playerUser_year = playerUser.year;

						var playerUser_profileSettingStatus = "";
						if(playerUser.profileSettingStatus)
							playerUser_profileSettingStatus = playerUser.profileSettingStatus
						
						var playerUser_interestedDomainName = "";
						if(playerUser.interestedDomainName)
							playerUser_interestedDomainName = playerUser.interestedDomainName
						
						var playerUser_interestedProjectName = "";
						if(playerUser.interestedProjectName)
							playerUser_interestedProjectName = playerUser.interestedProjectName;
						
						var playerUser_interestedSubDomain1Name = "";
						if(playerUser.interestedSubDomain1Name)
							playerUser_interestedSubDomain1Name = playerUser.interestedSubDomain1Name;
					
						var playerUser_interestedSubDomain2Name = "";
						if(playerUser.interestedSubDomain2Name)
							playerUser.interestedSubDomain2Name = playerUser.interestedSubDomain2Name;
						
						var playerUser_statusOfUser = "";
						if(playerUser.statusOfUser)
						{
							if(playerUser.statusOfUser != "notApproved" || playerUser.statusOfUser  != "Active")
								playerUser_statusOfUser = "Active";
							else
								playerUser_statusOfUser = playerUser.statusOfUser;			

						}

						var playerUser_affiliatedTo = "other";
						var playerUser_parentAssociationId = "";
						var playerUser_associationId = "";
						var playerUser_clubNameId = "";
						
						if(playerUser.associationId)
							playerUser_associationId = playerUser.associationId;

						if(playerUser.parentAssociationId)
							playerUser_parentAssociationId = playerUser.parentAssociationId;

						if(playerUser.clubNameId)
							playerUser_clubNameId = playerUser.clubNameId;

						
							
						if(playerUser_clubNameId == "other" || playerUser_clubNameId == null ||
							playerUser_clubNameId == undefined || playerUser_clubNameId == "")
								playerUser_affiliatedTo = "other";
						else
							playerUser_affiliatedTo = "academy";	
						
						
							
						

							var playerInsert = userDetailsTT.insert({
							 	interestedDomainName: playerUser_interestedDomainName,
								interestedProjectName: ["QvHXDftiwsnc8gyfJ"],
								interestedSubDomain1Name: playerUser_interestedSubDomain1Name,
								interestedSubDomain2Name: playerUser_interestedSubDomain2Name,
								profileSettingStatus:playerUser_profileSettingStatus,
								phoneNumber : playerUser_phoneNumber,
								role:"Player",contactPerson:playerUser_contactPerson,
								address:playerUser_address,city:playerUser_city,
								pinCode:playerUser_pinCode,state:playerUser_state,
								country:playerUser_country,
								statusOfUser:playerUser_statusOfUser,userName:playerUser_userName,
								userId:playerUser_userId,year:playerUser_year,
								associationId:playerUser_associationId,
								parentAssociationId:playerUser_parentAssociationId,
								emailAddress:playerUser_emailAddress,
								affiliatedTo:playerUser_affiliatedTo,
								gender:playerUser_gender,
								guardianName:playerUser_guardianName,
								nationalAffiliationId : playerUser_nationalaffiliationId,
								clubNameId:playerUser_clubNameId,
								affiliationId:playerUser_affiliationId

						 	});	

							if(playerUser_dateOfBirth != "" && playerUser_dateOfBirth != undefined 
								 && playerUser_dateOfBirth != "NaN undefined NaN" && playerUser_dateOfBirth != "Invalid date"
								&& playerUser_dateOfBirth.length > 0 && playerInsert )
							{
								var playerUpdate = userDetailsTT.update({userId:playerUser_userId},
									{$set:{dateOfBirth:playerUser_dateOfBirth}})

							}
							if(playerInsert)
							{
								Meteor.users.update({userId:playerUser_userId}, 
									{$unset: {
									interestedDomainName:1,
									interestedSubDomain1Name: 1,
									interestedSubDomain2Name: 1,
									phoneNumber : 1,
									contactPerson:1,guardianName:1,
									address:1,city:1,gender:1,
									pinCode:1,state:1,
									country:1,
									abbrevationAcademy:1,
									statusOfUser:1,clubName:1,
									year:1,
									associationId:1,
									parentAssociationId:1,affiliationId:1,
									nationalAffiliationId:1,
									dateOfBirth:1,clubNameId:1,
									dateOfInc : 1, nationalAffiliationId : 1
								}}, false, true);

								counter = parseInt(counter) + 1;
							}	
							
					}				
				}
				message.push("moved player list"+counter);

			}
			return message;

		}catch(e){}
	},
	"moveOtherUsersToNewDB":function()
	{
		try{
			var otherUserList = Meteor.users.find({role:{$nin:["Player","Association","Academy"]}}).fetch();
			var counter = 0;
			var message = [];
			message.push("actual other users list"+otherUserList.length);
			if(otherUserList.length)
			{
				for(var i=0; i<otherUserList.length;i++)
				{
					var otherUser = otherUserList[i];
					var otherUserFound = otherUsers.findOne({userId:otherUser.userId});
					if(!otherUserFound)
					{
						var otherUser_userId = "";
						if(otherUser.userId)
							otherUser_userId = otherUser.userId;

						var otherUser_userName = "";
						if(otherUser.userName)
							otherUser_userName = otherUser.userName;

						var otherUser_emailAddress = "";
						if(otherUser.emailAddress)
						 otherUser_emailAddress = otherUser.emailAddress;

						var otherUser_role = "";
						if(otherUser.role)
							otherUser_role = otherUser.role;

						var otherUser_gender;
						if(otherUser.gender)
							otherUser_gender = otherUser.gender;

						var otherUser_guardianName;
						if(otherUser.guardianName)
							otherUser_guardianName = otherUser.guardianName;

						
						var otherUser_dateOfBirth = "";
						if(otherUser.dateOfBirth)
							otherUser_dateOfBirth = otherUser.dateOfBirth;

						var otherUser_phoneNumber = "";
						if(otherUser.phoneNumber)
							otherUser_phoneNumber = otherUser.phoneNumber;

						var otherUser_address = "";
						if(otherUser.address)
							otherUser_address = otherUser.address;

						var otherUser_city = "";
						if(otherUser.city)
							otherUser_city = otherUser.city;

						var otherUser_state = "";
						if(otherUser.state)
							otherUser_state = otherUser.state;

						var otherUser_pinCode = "";
						if(otherUser.pinCode)
							otherUser_pinCode = otherUser.pinCode;

						var otherUser_country = "";
						if(otherUser.country)
							otherUser_country = otherUser.country;

						var otherUser_year = "";
						if(otherUser.year)
							otherUser_year = otherUser.year;

						var otherUser_profileSettingStatus = "";
						if(otherUser.profileSettingStatus)
							otherUser_profileSettingStatus = otherUser.profileSettingStatus
						
						var otherUser_interestedDomainName = "";
						if(otherUser.interestedDomainName)
							otherUser_interestedDomainName = otherUser.interestedDomainName
						
						var otherUser_interestedProjectName = "";
						if(otherUser.interestedProjectName)
							otherUser_interestedProjectName = otherUser.interestedProjectName;
						
						var otherUser_interestedSubDomain1Name = "";
						if(otherUser.interestedSubDomain1Name)
							otherUser_interestedSubDomain1Name = otherUser.interestedSubDomain1Name;
					
						var otherUser_interestedSubDomain2Name = "";
						if(otherUser.interestedSubDomain2Name)
							otherUser.interestedSubDomain2Name = otherUser.interestedSubDomain2Name;
						
						var otherUser_statusOfUser = "";
						if(otherUser.statusOfUser)
							otherUser.statusOfUser = otherUser.statusOfUser;

						
						
						if(otherUser_role != "")
						{
							var otherUserInsert = otherUsers.insert({
							 	interestedDomainName: otherUser_interestedDomainName,
								interestedProjectName: ["QvHXDftiwsnc8gyfJ"],
								interestedSubDomain1Name: otherUser_interestedSubDomain1Name,
								interestedSubDomain2Name: otherUser_interestedSubDomain2Name,
								profileSettingStatus:otherUser_profileSettingStatus,
								phoneNumber : otherUser_phoneNumber,
								role:otherUser_role,
								address:otherUser_address,city:otherUser_city,
								pinCode:otherUser_pinCode,state:otherUser_state,
								country:otherUser_country,
								statusOfUser:"Active",userName:otherUser_userName,
								userId:otherUser_userId,year:otherUser_year,
								emailAddress:otherUser_emailAddress,
								gender:otherUser_gender,
								guardianName:otherUser_guardianName,
						 	});	

						 	if(otherUser_dateOfBirth != "" && otherUser_dateOfBirth != undefined 
							 && otherUser_dateOfBirth != "NaN undefined NaN" && otherUser_dateOfBirth != "Invalid date"
							&& otherUser_dateOfBirth.length > 0 && otherUserInsert )
							{
								var otherUserUpdate = otherUsers.update({userId:otherUser_userId},
								{$set:{dateOfBirth:otherUser_dateOfBirth}})

							}

							if(otherUserInsert)
							{
								Meteor.users.update({userId:otherUser_userId}, 
									{$unset: {
									interestedDomainName:1,
									interestedSubDomain1Name: 1,
									interestedSubDomain2Name: 1,
									phoneNumber : 1,
									contactPerson:1,guardianName:1,
									address:1,city:1,gender:1,
									pinCode:1,state:1,
									country:1,
									abbrevationAcademy:1,
									statusOfUser:1,clubName:1,
									year:1,
									associationId:1,
									parentAssociationId:1,affiliationId:1,
									nationalAffiliationId:1,
									dateOfBirth:1,clubNameId:1,
									dateOfInc : 1, nationalAffiliationId : 1
									}}, false, true);
								counter = parseInt(counter) + 1;
							}
						}
											
					}
					
									
				}
				message.push("moved other users list"+counter);

			}
			return message;
		}catch(e){}
	},
	"copyEntireUserDB":function()
	{
		try
		{
			var userList = Meteor.users.find({}).fetch();
			var counter = 0;
			var message = [];
			message.push("actual user list in db "+userList.length);
			if(userList.length)
			{
				for(var i=0; i<userList.length;i++)
				{
					var user = userList[i];
					if(user.userId)
						user.userId = user.userId;
					else
						user.userId = "";

					if(user.userName)
						user.userName = user.userName;
					else
						user.userName = "";

					if(user.emailAddress)
						 user.emailAddress = user.emailAddress;
					else
						user.emailAddress = "";

					if(user.gender)
						user.gender = user.gender;
					else
						user.gender = "";
					if(user.role)
						user.role = user.role;
					else
						user.role = "";

					if(user.guardianName)
						user.guardianName = user.guardianName;
					else
						user.guardianName = "";

					if(user.abbrevationAssociation)
						user.abbrevationAssociation = user.abbrevationAssociation.toUpperCase();
					else
						user.abbrevationAssociation = "";
					
					if(user.dateOfBirth)
						user.dateOfBirth = user.dateOfBirth;
					else
						user.dateOfBirth = "";

					if(user.dateOfInc)
						user.dateOfInc = user.dateOfInc;
					else
						user.dateOfInc = "";

					if(user.phoneNumber)
						user.phoneNumber = user.phoneNumber;
					else
						user.phoneNumber = "";

					if(user.affiliationId)
						user.affiliationId = user.affiliationId;
					else
						user.affiliationId = "";

					if(user.contactPerson)
						user.contactPerson = user.contactPerson;
					else
						user.affiliationId = "";

					if(user.address)
						user.address = user.address;
					else 
						user.address = "";

					if(user.city)
						user.city = user.city;
					else 
						user.city = "";

					if(user.state)
						user.state = user.state;
					else
						user.state = "";

					if(user.pinCode)
						user.pinCode = user.pinCode;
					else
						user.pinCode = "";

					if(user.country)
						user.country = user.country;
					else
						user.country = "";

					if(user.year)
						user.year = user.year;
					else
						user.year = "";

					if(user.profileSettingStatus)
						user.profileSettingStatus = user.profileSettingStatus
					else
						user.profileSettingStatus = "";
						
					if(user.interestedDomainName)
						user.interestedDomainName = user.interestedDomainName
					else
						user.interestedDomainName = [""];
						
					if(user.interestedProjectName)
						user.interestedProjectName = user.interestedProjectName;
					else
						user.interestedProjectName = [""];
						
					if(user.interestedSubDomain1Name)
						user.interestedSubDomain1Name = user.interestedSubDomain1Name;
					else
						user.interestedSubDomain1Name = [""];
					
					if(user.interestedSubDomain2Name)
						user.interestedSubDomain2Name = user.interestedSubDomain2Name;
					else
						user.interestedSubDomain2Name = [""];
						
					if(user.statusOfUser)
						user.statusOfUser = user.statusOfUser;
					else
						user.statusOfUser = "";

					if(user.associationId)
					{
						if (typeof user.associationId === 'string' || user.associationId instanceof String)
							user.associationId = user.associationId;
						else
							user.associationId = user.userId;
					}
					else
						user.associationId = "";

					if(user.parentAssociationId)
						user.parentAssociationId = user.parentAssociationId;
					else
						user.parentAssociationId = "";

					if(user.clubName)
						user.clubName = user.clubName;
					else
						user.clubName = "";

					if(user.clubNameId)
						user.clubNameId = user.clubNameId;
					else
						user.clubNameId = "";
							

					if(user.nationalAffiliationId)
						user.nationalAffiliationId  = user.nationalAffiliationId
					else
						user.nationalAffiliationId = "";					
					
				if(user.statusOfUser)
					user.statusOfUser = user.statusOfUser;
				else
					user.statusOfUser = "";

					if(user.abbrevationAcademy)
						user.abbrevationAcademy  = user.abbrevationAcademy
					else
						user.abbrevationAcademy = "";	

					/*if(user.emails)
					{
						user.emails[0].address  = user.emails[0].address;
						user.emails[0].verified = user.emails[0].verified;
					}
					else
					{
						user.emails[0].address  = "";
						user.emails[0].verified = "";
					}*/
					try
					{

						var userEntry = userTemp.findOne({userId:user.userId});
						if(userEntry == undefined)
						{
							var playerInsert = userTemp.insert({
							 	interestedDomainName: user.interestedDomainName,
								interestedProjectName: user.interestedProjectName,
								interestedSubDomain1Name: [""],
								interestedSubDomain2Name: [""],
								profileSettingStatus:user.profileSettingStatus,
								phoneNumber : user.phoneNumber,
								role:user.role,contactPerson:user.contactPerson,
								address:user.address,city:user.city,
								pinCode:user.pinCode,state:user.state,
								country:user.country,
								abbrevationAcademy:user.abbrevationAcademy,
								statusOfUser:user.statusOfUser,userName:user.userName,
								userId:user.userId,year:user.year,
								associationId:user.associationId,
								parentAssociationId:user.parentAssociationId,
								emailAddress:user.emailAddress,
								gender:user.gender,
								guardianName:user.guardianName,
								nationalAffiliationId : user.nationalAffiliationId,
								affiliationId:user.affiliationId,
								abbrevationAssociation:user.abbrevationAssociation,
								clubNameId:user.clubNameId,
								clubName:user.clubName,
						 	});	
							counter = parseInt(counter)+1;
						}
						
					}catch(e){}


				}
				message.push("copied user list in tmp db "+counter);
				return message;
			}
		}catch(e){
		}
	}

})

