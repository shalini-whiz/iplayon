                    
			/**
			 * client side subscription to the server side publications 
			 * 
			 * @SubscribeName: projects(used to subscribe to projects)
			 * 				   to get the list of projects
			 * 
			 * @SubscribeName: domains (used to subscribe to domains)
			 *                 to get the list of domains 
			 *  
			 * @SubscribeName: users (used to subscribe to users)
			 *                 to get the user details
			 *                 
			 */
			Template.createTeams.onCreated(function() {
								
				//this.subscribe("projects");
				this.subscribe("tournamentEvents");
				this.subscribe("domains");
				this.subscribe("users");
				//this.subscribe("usersPredicton", Session.get('searchQuery'));
				this.subscribe("subDomain1");
				this.subscribe("subDomain2");
				this.subscribe("teamUploads");


			});

			/**
			 *  Onrendered  of template createTeams.html
			 *  initialize the typeahead instance
			 */
			Template.createTeams.onRendered(function() {
				
				// initializes all typeahead instances
				// so that user suggestions are available when
				//Meteor.typeahead.inject();
				
				// To initialise the custom scroll bar
				$('.addedUsers').slimScroll({
					color:'rgb(176,176,176)',
			        height: '100%'
			    });
				
				$('#sportName').select2({
					width: "295",
				});
				
			
				// To initialise the custom scroll bar
			/**	$('.dropdown dd ul').slimScroll({
					color:'rgb(176,176,176)',
			        height: '6em',
				    /** width is given in pixel because of 
			        adding the domains 
			        is increasing the height
			        if percentage is given **/
				/**width:'346px'
			    });**/
				
				createTeamValidate();
				
			   Session.set("sponsorLogoDispTeam",null);
			   Session.set("sponsorLogoDispTeam",undefined);
			   
			   Session.set('searchQuery', "");
			   //Session.set("previousLocationPath", Iron.Location.get().path);
				
			   $('.select2-selection__arrow').append('<i class="fa fa-angle-down"></i>');
			   
			   // For Check Mark on checkbox
			  /** $("input[name=domainName]").prop('checked', 'checked');**/
			   
			   
				
		

			});
			
			Template.aboutTeam.onRendered(function() {
				sponsorUploadValidate();
			});

			/**
			 * Template helpers for createTeams.html
			 * lProjectName : A function to fetch all the projectNames 
			 * lDomainName  : A function to fetch all the domainNames 
			 * domains      : A function that is used to configure the
			 *                typeahead functionality to get suggestions
			 *                of user-names
			 * lSponsorLogo : A function that is used to display the
			 *                team logo              
			 */

			Template.createTeams.helpers({
				
				searchResults: function() {
				   // var re = new RegExp(Session.get('searchQuery'), 'i');

				    var search=ReactiveMethod.call('search',Session.get('searchQuery'));
				    return search;
				  },
				
				lProjectName : function() {
					
					
					// Fetch all the project-Names
                    var lProjectNames = tournamentEvents.find().fetch();					
					//var lProjectNames = projects.find({ }).fetch();
					

										
					// If the list of projects is not
					// empty then return project-names
					if (lProjectNames) {
						return lProjectNames;
					}
					
				},
				
				// Manager id
                lManagerId : function() {
					
					// Get the logged-in users Id
         			var lLoggedInUser = Meteor.users.findOne({"_id" : Meteor.userId()});
         			
         			// Add the manager id to elements
         			elementsAdded.push(lLoggedInUser.userId);
                    return lLoggedInUser.userId;
                	
			    },
			    
			    // Manager Name
                lManagerName : function() {
					
					// Get the logged-in users Id
         			var lLoggedInUser = Meteor.users.findOne({"_id" : Meteor.userId()});
         			
         			if(lLoggedInUser.userName.length>40){
         				lLoggedInUser.userName = lLoggedInUser.userName.substring(0,40).trim() + "..";
					}
                    
         			return lLoggedInUser.userName;
                	
			    },
				

				lDomainName : function() {
					
					// Fetch all the domain-Names
					var lDomainNames = domains.find().fetch();
					// If the list of domains is not
					// empty then return domain-names
					if (lDomainNames) {
						return lDomainNames;
					}
					
				},
					
				domains: function(){
					
					return [
						{
							// name given to the result returned
							name: 'user',
							// Field-Name to search
							valueKey: 'userName',
							// Method to fetch the results from
							// DB
							local: function() { return Meteor.users.find({ "_id": { $not:{ $in: elementsAdded }} }).fetch(); },
                            // name of the template where the suggestions
							// should be displayed
							template: 'team',
							
							// Limit of results
							limit:10
						}
					];
					
				},
				
				lSponsorLogo: function() {
					var lData = Session.get("sponsorLogoDispTeam");
					if(lData){
						for( var i=0, l=lData.length; i<l; i++ ) {
						    var s = teamUploads.find({"_id":lData[i]._id}).fetch();
						    return s;
						}		
					}	
				}
			});
			
			//TODO:Textareas for tag selection
          /**  Template.sponsorUpload.helpers({
		      subDomain1Name:function() {
			    // Fetch all the domain-Names
				var subDomain1Names = subDomain1.find().fetch();
				// If the list of domains is not
				// empty then return domain-names
				if (subDomain1Names) {
				  return subDomain1Names;
				}
			  },
			  subDomain2Name:function() {
			    // Fetch all the domain-Names
				var subDomain2Names = subDomain2.find().fetch();
				// If the list of domains is not
				// empty then return domain-names
				if (subDomain2Names) {
			      return subDomain2Names;
				}
			  }
			});**/
			
			Template.aboutTeam.helpers({
				
				logoFileName : function() {
					
					// Get the logo-id
					
					
				},
				
			});
			
			/**
			 * Template helpers for createTeams.html
			 * teamName : A function to fetch the Team Name
			 * */
			Template.aboutTeam.events({
				// Clicking on Cancel button hides the
				  // pop-up
				  'click .cancelCreateTeam': function(e) {
					  e.preventDefault();
					  $('#uploadModal').modal('hide');
				  },
				  
				 
				  
				
					

					'click .uploadCreateTeam': function(e) {
						
						e.preventDefault();
						var lData, lData1,x;
						
	                    //TODO:Validation
						//gSponsorUrl = $('#sponsorUrl').val();
						//gSponsorMailId = $('#sponsorMailId').val();
	                    /**	if ($('#sponsorDetails').valid()) {
							if (gSponsorLogo !== "") {
								eventUploads.remove({
									"_id": gSponsorLogo
								});
							}
							if (gSponsorPdf !== "") {
								eventUploads.remove({
									"_id": gSponsorPdf
								});
							}**/
						var mainTag=[];
						var secondaryTag=[];

						
						
						
						// Upload Team Logo
						fileUpload($('#sponsorLogo').prop('files'),function(response){
						  
	 					  gSponsorLogo  = response;
						  if(response){
							// Once the response is recieved
							// hide all the divs where
							// Team Logo has to be displayed
							// and show only Team Logo
						    $("#sponsor1").hide(); 
							$('#sponH').hide();
							$('#sponH1').hide();
							$('#sponH2').hide();
						    $('.sponsorHeaderDetails1CreateTeam').hide();
						 // Retrieve the Logo from DB
							Session.set("sponsorLogoDispTeam",teamUploads.find({
							  "_id" : response.toString()
							}).fetch());
							$('#sponImg').show();
							
	                      }
						});

						// Upload Team Description PDF
						fileUpload($('#sponsorPdf').prop('files'), function(response) {
						  gSponsorPdf = response;
	                      if (response!==false) {
	                    	// Retrieve the About-us PDF from DB
						    lData1 = teamUploads.find({
							           "_id": response
									 }).fetch();
							}
						  });
						  // Once the upload is completed
						  // hide the pop-up
						  $('#uploadModal').modal('hide');
						}
			});
			
			Template.aboutTeam.events({
				teamName: function(){ return Session.get('teamName')}
			});
			
			            
            /**
			 * Events for createTeams.html(createTeams)
			 */
			var gSponsorLogo="";
			var gSponsorPdf="";
			var gSponsorUrl="";
			var gSponsorMailId="";
			
			// The added elements
		    var elementsAdded=[];
			
		    Template.createTeams.events({
			  // To Upload the Team logo
			  // and team description
			 /** 'click #sponsor': function(e) {
			    e.preventDefault();
			    var teamName=document.getElementById("teamName");
			    var searchUser=document.getElementById("searchUser");
			    document.getElementById('searchUser').value='Type Name';
			    Session.set('teamName', teamName.value); 
				$('#uploadModal').modal('show');
			  },**/
		    	
		    	'mouseover .addIcon':function(e){
		    		$("#"+e.target.id).css("color", "green");

		    	},
		    	'mouseout .addIcon':function(e){
		    		$("#"+e.target.id).css("color", "rgb(56,56,56)");

		    	},
			  
			  'keyup #searchUser, change #searchUser,input #searchUser,keydown #searchUser ': function(e){
				   Session.set('searchQuery', e.target.value);

				  
				  
				  
				  
				  
				  
			  },
			  
			  'input #searchUser ': function(e){
			   Session.set('searchQuery', e.target.value);

			  
			  
			  ;
			  
			  
			  
		  },
			  
			  'mouseout #searchUser':function(e){
				  //document.getElementById('searchUser').value='Search_User';

				},
			  
			  
			  
			  // Clicking on Cancel button hides the
			  // pop-up
			  'click #sponsorCanceled': function(e) {
				  e.preventDefault();
				  $('#uploadModal').modal('hide');
			  },
			  
			
				

				'click #sponsorUpload': function(e) {
					e.preventDefault();
					var lData, lData1,x;
					
                    //TODO:Validation
					//gSponsorUrl = $('#sponsorUrl').val();
					//gSponsorMailId = $('#sponsorMailId').val();
                    /**	if ($('#sponsorDetails').valid()) {
						if (gSponsorLogo !== "") {
							eventUploads.remove({
								"_id": gSponsorLogo
							});
						}
						if (gSponsorPdf !== "") {
							eventUploads.remove({
								"_id": gSponsorPdf
							});
						}**/
					var mainTag=[];
					var secondaryTag=[];

					
					
					
					
					
					// Upload Team Logo
					fileUpload($('#sponsorLogo').prop('files'),function(response){
					  
 					  gSponsorLogo  = response;
					  if(response){
						// Once the response is recieved
						// hide all the divs where
						// Team Logo has to be displayed
						// and show only Team Logo
					    $("#sponsor1").hide(); 
						$('#sponH').hide();
						$('#sponH1').hide();
						$('#sponH2').hide();
					    $('.sponsorHeaderDetails1CreateTeam').hide();
					 // Retrieve the Logo from DB
						Session.set("sponsorLogoDispTeam",teamUploads.find({
						  "_id" : response.toString()
						}).fetch());
						$('#sponImg').show();
						
                      }
					});

					// Upload Team Description PDF
					fileUpload($('#sponsorPdf').prop('files'), function(response) {
					  gSponsorPdf = response;
                      if (response!==false) {
                    	// Retrieve the About-us PDF from DB
					    lData1 = teamUploads.find({
						           "_id": response
								 }).fetch();
						}
					  });
					  // Once the upload is completed
					  // hide the pop-up
					  $('#uploadModal').modal('hide');
					},
					/*	if(!$('#uploadModal').hasClass('in')){
						sponsorValidate.resetForm();
					};*/
					
				    'click .addIcon':function(e){
				    
				    // document.getElementById('searchUser').value = "Search_User";
				    	
				     // If the user is already added dont
				     // add the user again
				     if(elementsAdded.indexOf(e.target.id)!=-1)
				    	 
				     {
					     //document.getElementById('searchUser').value = "Search_User";

				    	 
							$("#conFirmHeaderOk").text("User already added");
							$("#confirmModalOk").modal('show');

				    	 //document.getElementById('searchUser').value = "Search_User";
				    	 

				    	 
				     }
				     else
				     {	
				    	 
 
					    // document.getElementById('searchUser').value = "Search_User";

				       elementsAdded.push(e.target.id);
					
					   // Clear the text present in input text-box
			    	  // document.getElementById('searchUser').value = "Search_User";
			    						
					   // Get the id of that div where the new users
			    	   // must be placed
			    	   var container = document.getElementById("addedUsers");
			    	
			    	   // Create the eye-icon that must be place
			    	   /**var input = document.createElement("input");
			    	   input.type="button";
			           input.className="eyeIcon" ;
			    	   input.id=e.target.id+"deleteeye";
			    	   container.appendChild(input);**/
			    	   
			    	   var input = document.createElement("span");
			    	   input.style="color:#770000;font-size: 22px;top:0%;margin-top:2%;padding-top:0%; transform: rotate(0deg);cursor: pointer;background :none";
			           input.className="glyphicon glyphicon-eye-open eyeIcon" ;
			    	   input.id=e.target.id+"deleteeye";
			    	   container.appendChild(input);
			    	   
			    	   
			    	   
			    	   var userNameTrim=document.getElementById(e.target.id).textContent;
			    	   
			    	   // Get the corresponding user's details
						  var a=Meteor.users.find({"_id":e.target.id}).fetch();
					      //	gTeamLists = teams.find({"_id":this._id}).fetch();
						  
						  if(a[0].userName.length>40){
								a[0].userName = a[0].userName.substring(0,40).trim() + "..";
							}
			    	
			    	   // Create the user-name field that must be placed that must be place
			    	   var user=document.createElement("h12");
              		   // Get the user-name from the id
			    	   user.innerHTML="&nbsp;&nbsp;"+a[0].userName;
			    	   user.className="user";
			    	   user.style="color:white;";
			    	   user.id=e.target.id+"deleteuser";
			    	   container.appendChild(user);
			    	
			    	   // Create the delete icon that has to be added
			    	   /**var deleteIcon = document.createElement("input");
			    	   deleteIcon.type="button";
			    	   deleteIcon.className="deleteIcon";
			    	   deleteIcon.id=e.target.id+"delete";
			    	   container.appendChild(deleteIcon);**/
			    	   
			    	   var deleteIcon = document.createElement("span");
			    	   deleteIcon.style="color:#770000;font-size: 22px;transform: rotate(0deg);cursor: pointer;background :none;margin-top:1.5%";
			    	   deleteIcon.className="glyphicon glyphicon-remove deleteIcon";
			    	   deleteIcon.id=e.target.id+"delete";
			    	   container.appendChild(deleteIcon);
			    	   
			    	   document.getElementById('searchUser').value ="";
			    	   $( "#searchUser" ).keyup();
			    	   

				      }
				    },
				
				// Once the button with class "deleateUser",
				// then corresponding user must be deleted
				'click .deleteIcon': function(e){
					

					
					// Clear the text present in input text-box
			    	  // document.getElementById('searchUser').value = "Search_User";
															
					// Get the user Name
					
					// Remove the last 6 characters to
					// get the correct id
					var str=e.target.id;
					str = str.substring(0, str.length - 6);
					
					var lLoggedInUser = Meteor.users.findOne({"_id" : Meteor.userId()});
					
					// Check if the user who is about to
					// get deleted is not a manager
					if(str==lLoggedInUser.userId)
					{
						$("#conFirmHeaderOk").text("You are the team manager");
						$("#confirmModalOk").modal('show');
						
					}
					
					else
					{
						
						$(".yesButton").attr("id", str);
						$("#confirmModal").modal('show');

					  // Get the corresponding user's details
					  var a=Meteor.users.find({"_id":str}).fetch();
				      //	gTeamLists = teams.find({"_id":this._id}).fetch();
					  
					  if(a[0].userName.length>15){
							a[0].userName = a[0].userName.substring(0,15).trim() + "..";
						}
					  
					  
					  $("#conFirmHeader").text("Delete "+ a[0].userName +"?");
					  //document.getElementById('yesButton').id = str;
					  Session.set("deleteAddedUserToDiv",e.target.id);
	
				
				      // ev.target.id has the userid that has to be deleted
		              // Remove the user with that id
		                /**   var eye=document.getElementById(e.target.id+"eye");
		                      var user=document.getElementById(e.target.id+"user");
		                      var deleteIcon=document.getElementById(e.target.id);
		                      eye.remove();
		                      user.remove();
		                      deleteIcon.remove();**/
		          
		              // Clear the text present in input text-box
			         // document.getElementById('searchUser').value = "Search_User";
				    }
				},
				
				// To Delete the added users
				'click #yesButton':function(ev){
					// Clear the text present in input text-box
			    	  // document.getElementById('searchUser').value = "Search_User";
			    	 //  var deleteId=ev.target.id;
					// Remove the added-user
				//	var eye=document.getElementById(ev.target.id+"deleteeye");
			       // var user=document.getElementById(ev.target.id+"deleteuser");
			      //  var deleteIcon=document.getElementById(ev.target.id+"delete");
			       // eye.remove();
			      //  user.remove();
			      //  deleteIcon.remove();
			      //  $("#yesButton").attr("id", "yesButton");
			        
			        // Also remove the array element
			      //  elementsAdded.splice(elementsAdded.indexOf(Session.get("deleteAddedUserToDiv")), 1);
				  //  elementsAdded.pop(Session.get("deleteAddedUserToDiv"));
				  //  elementsAdded.splice(elementsAdded.indexOf(deleteId),1);
				    
				  //$("#"+Session.get("deleteAddedUserToDiv")+"deleteeye").remove()
				 // $("#"+Session.get("deleteAddedUserToDiv")+"deleteuser").remove()
			     // $("#"+Session.get("deleteAddedUserToDiv")+"delete").remove()  
			       $('[id^='+Session.get("deleteAddedUserToDiv")+']').remove()
			        
				    // Change the id of the OK button
			        // in confirm pop-up
			        // so that next user can be deleated
			        //$("#yesButton").attr("id", "yesButton");
			        
			        // Hide the confirm popup
				    $("#confirmModal").modal('hide');

				},
				    
						
				// To view the online-status
				// of the user
				/**'click .eyeIcon':function(e){  


// Clear the text present in input text-box
			    	   document.getElementById('searchUser').value = "";				
										
				  // Remove the last 9 characters to
				  // get the correct id
				  var str=e.target.id;
		    	  str = str.substring(0, str.length - 9);
					
				  // Get the corresponding user's details
				  var a=Meteor.users.find({"_id":str}).fetch();
				  
				  // Trim the user-name
				  //a[0].userName = a[0].userName.substring(0,35).trim() + "..";
				    
				    // If the User-Name is more then
					// trim 
					if(a[0].userName.length>15){
						a[0].userName = a[0].userName.substring(0,15).trim() + "..";
					}
				  // Set the User-Name and mobile Number
				  // If the Mobile -number is given then
				  // display,otherwise dont display
					if(a[0].phoneNumber!="")
					{	
				      $('.createTeam').html('<h12 class="modal-title" title='+a[0].userName+' style="color:white;">'+a[0].userName+'<span class="mobileNumber">'+'</span></h4>');
					}
					else
					{
					  $('.createTeam').html('<h12 class="modal-titleWithoutMobile" title='+a[0].userName+' style="color:white;">'+a[0].userName+'</h4>');						
					}
				  // If awayFromDate is not empty then this status should be displayed
				  if(a[0].awayToDate!="")
				  {
				    $('#animalsModal .modal-body').html('<label for="name" id="onlineText"> Mobile Number: '+a[0].phoneNumber+' </label>');
				  }
				  else
				  {
				    $('#animalsModal .modal-body').html('<label for="name" id="onlineText"> Mobile Number: '+a[0].phoneNumber+'</label>');

				  }
 
				  // Clear the text present in input text-box
				  document.getElementById('searchUser').value = "";
				    
				  // Show the pop-up that shows the online
				  // status
				  e.preventDefault();
			   	  $('#animalsModal').modal('show');
			   	},**/

				

				'change #sponsorLogo':function(e){
					teamUploads.remove({"_id":gSponsorLogo});
					$('#sponsorLogoName').val($('#sponsorLogo').val());
					$('#sponsorLogo').valid();
				},
				'change #sponsorPdf':function(e){
					eventUploads.remove({"_id":gSponsorPdf});
					$('#sponsorPdfName').val($('#sponsorPdf').val());
					$('#sponsorLogo').valid();
					$('#sponsorPdf').valid();
				},

				/**
				 *on submit form of read all the values of html fields data
				 *call the function fileUpload to handle the sponsors file which are 
				 *uploaded and save the response(which is file id) as lSponsorPdf
				 *call fileUpload again to handle the rules and regulations file 
				 *which are uploaded and save response(file id) as rulesAndRegulations.
				 *save all the data as object.    
				 *call the meteor server method insertEvent with lData as argument
				 * 
				 */
				'submit form' : function(event) {
					event.preventDefault();
				},
				
				/**
				 * on click of html attribute id #cancel
				 * route to userLandingPage
				 */
				"click #cancel" : function() {
					
					elementsAdded=[];
					
					// Clear the text present in input text-box
			    	   //document.getElementById('searchUser').value = "";
					teamUploads.remove({
						"_id": gSponsorLogo
					});
					teamUploads.remove({
						"_id": gSponsorPdf
					});
					gSponsorLogo="";
					gSponsorPdf="";
					Session.set("sponsorLogoDispTeam",null);
					Session.set("sponsorLogoDispTeam",undefined);
					//Router.go("myTeams");
					if (Session.get("previousLocationPath") !== undefined) {
						var previousPath = Session.get("previousLocationPath");
						Session.set("previousLocationPath", undefined);
						Session.set("previousLocationPath", null);
						Router.go(previousPath);
					} else {
						Router.go("/myTeams");
					}
				},
				
				"click #ok" : function(e) {
					
					// Clear the text present in input text-box
			    	//   document.getElementById('searchUser').value = "Search_User";
					e.preventDefault();
					$('#animalsModal').modal('hide');
				},
				"click #noButton" : function(e) {
					// Clear the text present in input text-box
			    	//   document.getElementById('searchUser').value = "Search_User";
					e.preventDefault();
					$('#confirmModal').modal('hide');
					$('#confirmModalOk').modal('hide');
				},
				'click #errorPopupClose':function(e){
					
					// Clear the text present in input text-box
			    	//   document.getElementById('searchUser').value = "Search_User";
					e.preventDefault();
					$('#errorPopup').modal('hide');
				},
				"change #rulesAndReg":function(event){
					
					// Clear the text present in input text-box
			    	//   document.getElementById('searchUser').value = "Search_User";
					event.preventDefault();
					if($('#rulesAndReg').valid()){
						$('#rules').css('color','#fff');
					}
					else{$('#rules').css('color','red');}
                },
				'click .dropdown dt a': function (event) {
					
					// Clear the text present in input text-box
			    	//   document.getElementById('searchUser').value = "Search_User";
					
					  // If the dropdown menu is displayed
					  // then the search box for the users
					  // should be hidden
					
					  $('.dropdown dd ul').slideToggle('fast', function(){
				      });		
					
				},
				'click .dropdown dd ul li a': function () {
					
					// Clear the text present in input text-box
			    	//   document.getElementById('searchUser').value = "Search_User";
				  $(".dropdown dd ul").hide();
				},
				'click .hida': function (e) {
					
					// Clear the text present in input text-box
			    	//   document.getElementById('searchUser').value = "Search_User";
				  var $clicked = $(e.target);
				  if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
				},
				
				
				'click .mutliSelect input[type="checkbox"]': function (e) {
					
				 
			    	
				  // $(this) in meteor should be
				  // used in this way
				  var $this = $(e.target);
				  var title = $this.val();
				  
				  				  
				  // If the list is empty then dont add the comma
				  var listLength=$("#domain span").length;
				  if(listLength==0){
					  title =$this.val();
				  }
				  else{
					  title ="," + $this.val();
                  }
				  if ($this.is(':checked')) {
					$(".multiSel").show();
				    var html = '<span title="' + $this.val() + '">' + title + '</span>';
				    $('.multiSel').append(html); 
				    $(".hida").hide();
				  } 
				  else {
				    $('span[title="' + $this.val() + '"]').remove();
				    var ret = $(".hida");
				    $('.dropdown dt a').append(ret);
				     
				    // Check if the checkboxes are checked or not
				    var checked = $("#venue input:checkbox:checked").length;
				    
				    // If there are no checked check-boxes then just display venue 
				    if(checked==0){
				    	$(".multiSel").hide();
					    $(".hida").show();
				    }
				   
				  }
				},
				'click .dropdown1 dt a': function (event) {
					
					// Clear the text present in input text-box
			    	//   document.getElementById('searchUser').value = "Search_User";
				 	  // If the dropdown menu is displayed
					  // then the search box for the users
					  // should be hidden
					  $('.dropdown1 dd ul').slideToggle('fast', function(){
				          /**if($('.dropdown dd ul').is(':hidden')){
				          	$('.rulesAndReg').show(); 
				          }else{
				        	  $('.rulesAndReg').hide(); 
				          }**/
				      });		
					
				},
				'click .dropdown1 dd ul li a': function () {
				  $(".dropdown1 dd ul").hide();
				},
				'click .hida1': function (e) {
				  var $clicked = $(e.target);
				  if (!$clicked.parents().hasClass("dropdown1")) $(".dropdown1 dd ul").hide();
				},
				'click .mutliSelect1 input[type="checkbox"]': function (e) {
				  // $(this) in meteor should be
				  // used in this way
				  var $this = $(e.target);
				  var title = $this.val();
				  				  
				  // If the list is empty then dont add the comma
				  var listLength=$("#domain1 span").length;
				  if(listLength==0){
					  title =$this.val();
				  }
				  else{
					  title ="," + $this.val();
                  }
				  if ($this.is(':checked')) {
					$(".multiSel1").show();
				    var html = '<span title="' + $this.val() + '">' + title + '</span>';
				    $('.multiSel1').append(html); 
				    $(".hida1").hide();
				  } 
				  else {
				    $('span[title="' + $this.val() + '"]').remove();
				    var ret = $(".hida1");
				    $('.dropdown1 dt a').append(ret);
				     
				    // Check if the checkboxes are checked or not
				    var checked = $("#venue1 input:checkbox:checked").length;
				    
				    // If there are no checked check-boxes then just display venue 
				    if(checked==0){
				    	$(".multiSel1").hide();
					    $(".hida1").show();
				    }
				   
				  }
				},
				'click .dropdown2 dt a': function (event) {
					
					  // If the dropdown menu is displayed
					  // then the search box for the users
					  // should be hidden
					  $('.dropdown2 dd ul').slideToggle('fast', function(){
				          /**if($('.dropdown dd ul').is(':hidden')){
				          	$('.rulesAndReg').show(); 
				          }else{
				        	  $('.rulesAndReg').hide(); 
				          }**/
				      });		
					
				},
				'click .dropdown2 dd ul li a': function () {
				  $(".dropdown2 dd ul").hide();
				},
				'click .hida2': function (e) {
				  var $clicked = $(e.target);
				  if (!$clicked.parents().hasClass("dropdown2")) $(".dropdown2 dd ul").hide();
				},
				'click .mutliSelect2 input[type="checkbox"]': function (e) {
				  // $(this) in meteor should be
				  // used in this way
				  var $this = $(e.target);
				  var title = $this.val();
				  				  				  
				  // If the list is empty then dont add the comma
				  var listLength=$("#domain2 span").length;
				  if(listLength==0){
					  title =$this.val();
				  }
				  else{
					  title ="," + $this.val();
                  }
				  if ($this.is(':checked')) {
					$(".multiSel2").show();
				    var html = '<span title="' + $this.val() + '">' + title + '</span>';
				    $('.multiSel2').append(html); 
				    $(".hida2").hide();
				  } 
				  else {
				    $('span[title="' + $this.val() + '"]').remove();
				    var ret = $(".hida2");
				    $('.dropdown2 dt a').append(ret);
				     
				    // Check if the checkboxes are checked or not
				    var checked = $("#venue2 input:checkbox:checked").length;
				    
				    // If there are no checked check-boxes then just display venue 
				    if(checked==0){
				    	$(".multiSel2").hide();
					    $(".hida2").show();
					    title=null;
				    }
				   
				  }
				},
				
			'click ': function (e) {
					
			       // Check if the dropdown is open or not
				   if((e.target.id!="venuesSelected")&(e.target.id!="domain"))
				   {
				      
					   if($("#venue").css("display")=="block")
					   {	   
						   $("#venue").hide();
					   }
				   }
			        
					
				},
				    'click .dropdown dt a': function(event) {

        // Clear the text present in input text-box
        //   document.getElementById('searchUser').value = "Search_User";

        // If the dropdown menu is displayed
        // then the search box for the users
        // should be hidden

        $('.dropdown dd ul').slideToggle('fast', function() {});

    },

    'click .dropdown dd ul li a': function() {

        // Clear the text present in input text-box
        //   document.getElementById('searchUser').value = "Search_User";
        $(".dropdown dd ul").hide();
    },

    'click .hida': function(e) {

        // Clear the text present in input text-box
        //   document.getElementById('searchUser').value = "Search_User";
        var $clicked = $(e.target);
        if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
    },

    'click .mutliSelect input[type="checkbox"]': function(e) {
        // $(this) in meteor should be
        // used in this way
        var idOfDomain = this._id;
        var $this = $(e.target);
        var title = $this.val();


        // If the list is empty then dont add the comma
        var listLength = $("#domain span").length;
        if (listLength == 0) {
            title = $this.val();
        } else {
            title = "," + $this.val();
        }
        if ($this.is(':checked')) {
            var selectedIds_id = idOfDomain;
            if(!_.contains(selectedIds_id,idOfDomain)){
                arrayOFIds.push(selectedIds_id)
            }
            $(".multiSel").show();
            var html = '<span title="' + $this.val() + '">' + title + '</span>';
            $('.multiSel').append(html);
            $(".hida").hide();
            Session.set("selectedDomainId",arrayOFIds)
        } else {
            $('span[title="' + $this.val() + '"]').remove();
            var ret = $(".hida");
            $('.dropdown dt a').append(ret);

            // Check if the checkboxes are checked or not
            var checked = $("#venue input:checkbox:checked").length;

            // If there are no checked check-boxes then just display venue 
            if (checked == 0) {
                $(".multiSel").hide();
                $(".hida").show();
            }
            arrayOFIds =  _.reject(arrayOFIds, function(item) {
                return item === idOfDomain; 
            });
            Session.set("selectedDomainId",arrayOFIds)
        }
    },

    'click .hida1': function(e) {
        var $clicked = $(e.target);
        if (!$clicked.parents().hasClass("dropdown1")) $(".dropdown1 dd ul").hide();
    },

    
    'click ': function(e) {
        // Check if the dropdown is open or not
        if ((e.target.id != "venuesSelected") & (e.target.id != "domain")) {
            if ($("#venue").css("display") == "block") {
                $("#venue").hide();
            }
        }
    },

    'click #save':function(e){
        e.preventDefault();
    }
			});

			var insertTeams = function(xData){
				Meteor.call('insertTeams', xData,
					function(error, response) {
						if (response) {
							Router.go("myTeams");
							gSponsorLogo="";
							gSponsorPdf="";
							Session.set("sponsorLogoDispTeam",null);
					        Session.set("sponsorLogoDispTeam",undefined);
						} else {
						}
				});
			}

			var confirmData = function(xCallback){
				$("#confirmModal").show();
				$("#yesButton").click(function(){
					$("#confirmModal").hide();
					xCallback(true);
				});
				$("#noButton").click(function(){
					$("#confirmModal").hide();
					xCallback(false);
				})
			}
			
			var getSelectedValue=function (id) {
			      return $("#" + id).find("dt a span.value").html();
			 }

			var createTeam = function(team){
			  // Get the user-id of the logged-in user
			  var lLoggedInUser = Meteor.users.findOne({"_id" : Meteor.userId()});
				
				
              var lTeamName = $('#teamName').val();
			  var lProjectName = $('#sportName :selected').val();
			  lProjectName=new Array(lProjectName);
			  var lPlacesOfInterest= $('#domain').text();
			  var lTeamOwner=lLoggedInUser.userId;
			  var lTeamManager=lLoggedInUser.userId;
			  var elements=$("#domain");
			  var lSponsorPdf = gSponsorPdf; //$('#sponsorPdf').prop('files') ;
			  var lSponsorLogo = gSponsorLogo; // $('#sponsorLogo').prop('files');
			  for(var i = 0; i < elements.length; i++) {
			    var current = elements[i];
				var venues=current.textContent
			  } 
			  // Split the venues by using comma as
			  // the seperator
		      var lVenues=venues.split(',');
			  // Filter the empty values
			  lVenues = lVenues.filter(Boolean);
				    	    	
			  // Add all the users(who were selected by the team owner) 
			  // to an array 
			  var users=[];
			  var elementsUsers=$("#addedUsers h12");
			  for(var i = 0; i < elementsUsers.length; i++) {
			    var str=elementsUsers[i].id;
				str = str.substring(0, str.length - 10);
				users.push(str);
              }
			  
			  //Get the Main Tag and secondary 
			  var lMainTag=Session.get("mainTag");
			  var lSecondaryTag=Session.get("secondaryTag");


			  
			  
			  var lData={
						  teamName : lTeamName,
						  projectName:lProjectName,
						  teamOwner:lTeamOwner,
						  venues:lVenues,
						  users:users,
						  teamManager:lTeamManager,
						  sponsorPdf:lSponsorPdf,
						  sponsorLogo:lSponsorLogo
						/**  mainTag:lMainTag,
						  secondaryTag:lSecondaryTag**/
					    };
						insertTeams(lData);
			}

			//TODO:
			/**
			var createTeamValidate = function(team){
			
		      // Check If the User has given the team title or not
			  var lTeamName = $('#teamName').val();
			  if(lTeamName=="")
			  {
				  
				  // Change the colour of the placeholder
				  $("#teamName" + ":-ms-input-placeholder").css("color", "red");
				  $("#teamName" + ":-moz-placeholder").css("color", "red");
				  $("#teamName").attr("placeholder", "Please Enter your Team Name").placeholder();
			  }
			  
			  
			};
	   

			$.validator.addMethod('filesize', function(value, element, param) {
			    // param = size (en bytes) 
			    // element = element to validate (<input>)
			    // value = value of the element (file name)
			    return this.optional(element) || (element.files[0].size <= param) 
			});**/

			$.validator.addMethod('sponsorFiles', function(value, element) {
			    // param = size (en bytes) 
			    // element = element to validate (<input>)
			    // value = value of the element (file name)
			     //theFile = new FS.File(gSponsorPdf[0]);

			    if($('#sponsorPdf').prop('files')===""||$('#sponsorLogo').prop('files')===""){
			    	return false;
			    }
			 	else{
			 		return true
			 	}
			});

			
			/**$.validator.addMethod('sponsorPdfSize', function(value, element, param) {
			    // param = size (en bytes) 
			    // element = element to validate (<input>)
			    // value = value of the element (file name)
			    theFile = new FS.File($('#sponsorPdf').prop('files')[0]);
			    if(theFile.original.size<=param){
			    	return true;
			    }
			    else{
			    return false;
				}
			});
			
			$.validator.addMethod('sponsorLogoSize', function(value, element, param) {
			    // param = size (en bytes) 
			    // element = element to validate (<input>)
			    // value = value of the element (file name)
			    theFile = new FS.File($('#sponsorLogo').prop('files')[0]);
			    if(theFile.original.size<=param){
			    	return true;
			    }
			    else{
			    return false;
				}
			});**/
			
			
			// Validation
			var createTeamValidate = function() {
				var s = $('#teamCreation').validate({
					rules: {
						eventName: {
							required: true,
						    maxlength: 35,
						},
			/**			prize: {
							required: true,
							minlength: 5
						},**/
						/**rulesAndReg: {
							required: function() {
								if ($('#rulesAndReg').val() == "") {
									return true;
								} else {
									return false;
								}
							},
							accept: 'application/pdf',
							filesize: 1048576

						},**/
						domainName: {
							/**remote: function() {
							    // Atleast one domain must be selectd
							    var checked = $("#venue input:checkbox:checked").length;
								if (checked >= 1) {
									return false;
								} else {
									return true;
								}
							}**/
							required: true
						},
						projectName: {
							required: true
						}
						/**closureDate: {
							required: true,
						},
						startDate: {
							required: true
						},
						endDate: {
							required: true
						},
						description: {
							required: true
						},**/
						/**sponsor: {
							sponsorFiles: true,
							sponsorPdfSize: 1048576,
							sponsorLogoSize: 100000
						}**/
						/** sponsorPdf:{
						 	 	required:function(){
						    			if($('#sponsorPdf').val()=="")
						    				{return true;}
						    			else
						    				{return false;}
						    		},
						    	accept:'application/pdf',
						    	filesize:1048576
						 	 }**/
					},
					messages: {
						eventName: {
							required: "Please enter the Team name.",
							maxlength: "The Team name should be within 35 characters",
						},
						
					/**	prize: {
							required: "Please enter the prize details.",
							minlength: "The Prize details should contain atleast 5 characters",
						},**/
						/**rulesAndReg: {
							required: "Please upload the rules and regulations pdf",
							accept: 'Please upload only pdf files',
							filesize: 'Rules and Regulations file size should be less than 1MB'
						},**/
						domainName: {
							required: "Please select your places of interest",
						},
						projectName: {
							required: "Please select the game"
						}
						/**closureDate: {
							required: "Please select the entry closure date and time"
						},**/
						/**startDate: {
							required: "Please select the event start date and time"
						},**/
						/**endDate: {
							required: "Please select the event end date and time"
						},**/
						/**description: {
							required: "Please provide the event description"
						},
						sponsor: {
							sponsorFiles: "Please upload  all the sponsor details",
							sponsorPdfSize: "Sponsor Pdf size should be less than 1MB",
							sponsorLogoSize: "Sponsor logo size should be less than 4kb"
						}
						 sponsorPdf:{
						     	required:"Please upload sponsors pdf",
						     	filesize:'the file size should be less than 1MB'
						     }**/
					},

					errorContainer: $('#errorContainer'),
					errorLabelContainer: $('#errorContainer ul'),
					wrapper: 'li',
					invalidHandler: function(form, validator, element) {
						var elem = $(element);
						var errors = s.numberOfInvalids();
						if (errors) $('#errorPopup').modal('show');
						for (var i = 0; i < validator.errorList.length; i++) {
							var q = validator.errorList[i].element;
							if (q.name == 'rulesAndReg') {
								$('#rules').css('color', 'red')
							}
							if (q.name === 'projectName') {
								$('#projectName + .select2-container--default .select2-selection--single .select2-selection__rendered').css('color', 'red');
							}
							/**if (q.name === 'domainName') {
								$('#domainName + .select2-container--default .select2-selection--single .select2-selection__rendered').css('color', 'red');
							}**/
						}

					},
					submitHandler: function(event) {
						elementsAdded=[];
						createTeam(event);
					}
				});
			}


		
		
		var sponsorUploadValidate = function(){
			sponsorValidate = $('#sponsorDetails').validate({
				rules:{
					sponsorLogoName:{
						required:true,
						filesize:4000
					},
					sponsorPdfName:{
						required:true,
						filesize:1048576
					},
					provideDetails:{
						required:function(e){
							if($("#sponsorPdfName").val()=="" &&
								 $("#sponsorLogoName").val()==""  &&
								 $("#sponsorLogoName").css("color") != "rgb(204, 51, 0)"&&
								 $("#sponsorPdfName").css("color") != "rgb(204, 51, 0)")
								{
								return true
							}
							else return false
						}
					}
				},
				messages:{
					sponsorLogoName:{
						required:"*please upload sponsors logo",
						filesize:"*sponsors logo size should be less than 5 kilo bytes"
					},
					sponsorPdfName:{
						required:"*please upload sponsors Pdf file",
						filesize:"*sponsors pdf file should be less than 1Mega Bytes"
					},
					
					provideDetails : {
						required : "Please provide atleast one field"
					}
				},
				errorElement: 'div',
				invalidHandler: function(form, validator, element) {
				   var errors = validator.numberOfInvalids();
		   		   if (errors) {		        
		     	   if (validator.errorList.length > 0) {
		            for (x=0;x<validator.errorList.length;x++) {
		            	var q = validator.errorList[x].element;
		            	var elementName = [];
		            	$("#"+q.name+"Name").val("");
		            	$("#"+q.name+"Name").attr("placeholder", validator.errorList[x].message)
		            	.css("color","#cc3300");
		            }
		        }
		      }
		        validator.focusInvalid();
			  },
			  submitHandler: function(event) {
					//saveUserProfileSettings(event);
				}
			});
		}
		
		// File-Upload Method
		var fileUpload = function(xData, xCallback) {

			if (xData.length != 0) {
				for (var i = 0, ln = xData.length; i < ln; i++) {
					theFile = new FS.File(xData[i]);
					teamUploads.insert(theFile, function(err, fileObj) {
						// Inserted new doc with ID fileObj._id, and kicked off the data
						// upload using HTTP
						FileId = fileObj._id;
						return xCallback(FileId);

					});
				}
			} else {
				return xCallback(false);
			}
		};
	