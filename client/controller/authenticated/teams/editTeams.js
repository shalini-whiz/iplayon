//Template helpers, events for editEvents
//Template is editEvents.html
/**
 * client side subscription to the server side publications
 * @SubscribeName: events (used to subscribe to events)
 *                 to get the list of events
 * @SubscribeName: projects(used to subscribe to projects)
 *           to get the list of projects
 * @SubscribeName: domains (used to subscribe to domains)
 *                 to get the list of domains
 * @SubscribeName: eventUploads (used to subscribe to eventUploads)
 *                 to get the details of files
 *                 (saved to folder /public/eventUploads)
 *
 *
 */

//The added elements
var elementsAdded=[];


Template.editTeams.onCreated(function() {
    this.subscribe("teamsWithId");
  this.subscribe("users");
    //this.subscribe("projects");
    this.subscribe("tournamentEvents");
    this.subscribe("domains");
    this.subscribe("teamUploads");
  this.subscribe("inbox");    
});



//checkTeamManager returns true if the user whose id is taken as input is the manager of the team getting edited,
// returns false if the user whose id is taken as input is not the manager of the team getting edited
Template.registerHelper('checkManager', function(data) {
  
      // Get the Team-id to be edited
      var gRouteParameter = Router.current().params._PostId;
        gTeamId = gRouteParameter.slice( 1 );
      // Find the team with that id and with that manager 
      var a = teams.find({
          "_id": gTeamId,
          "teamManager": data
      }).fetch();
      if (a.length == 1)
      {
          return true;          

      }
      else 
      {
          return false;         

      }
      
  });



// "checkVenue" returns true if the venue is present 
// in the intreseted venue list for the team otherwise
// returns false
Template.registerHelper('checkVenue', function(domain) {
  
  // Get the interedted domains or venues for team
  var gRouteParameter = Router.current().params._PostId;
    gTeamId = gRouteParameter.slice( 1 );

    var lEvents = teams.find({
        "_id": gTeamId
    }).fetch();
    
    var interestedDomains=lEvents[0].venues;
    
    if((interestedDomains.indexOf(domain))!=-1 )
    {
      return true;
    } 
    else
    {
      return false;
    } 
});

 /**
 *  Onrendered  of template editEvents.html
 *  initialize css bootstrap datetimepicker
 *
 *
 */
Template.editTeams.onRendered(function() {
  
  
    
    // initializes all typeahead instances
  // so that user suggestions are available when
  // required
  
  // To initialise the custom scroll bar
  $('.scrollAdd').slimScroll({
       color:'rgb(176,176,176)',
        height: '8em'
    });
  
  $('#selectMainTag').slimScroll({
        height: '8em',
        color: 'black',
        size: '3px',
        width: '100%'
    });

    $('#selectSecTag').slimScroll({
        height: '8em',
        color: 'black',
        size: '3px',
        width: '100%'
    });
  
  
    $('b[role="presentation"]').hide();
    $('.select2-selection__arrow').append('<i class="fa fa-angle-down"></i>');
    editEventValidate();
    editSponsorUploadValidate();
    
    Session.set('searchQueryEditTeam', "")
    
    Session.set("sponsorLogoDispUpdate",null);
    Session.set("sponsorLogoDispUpdate",undefined);
    
    // Validate the enetered Details of the Team
    editTeamValidate();
});

/**
 * template helpers which connects editEvents.html
 * lEvent is a function to fetch events for an Id
 *      lId holds the event id which comes as request
 *      parameters.
 * lProjectName is a function to fetch projectNames.
 * lDomainName is  a function to fetch domainNames.
 * lSponsorPdf is a function to fetch the uploaded sponsor
 *           files details for lId
 *           lId holds the event id which comes as request
 *       parameters.
 * lrulesAndRegulations is a function fetch uploaded rules and
 *         regulations file details for lId
 *           lId holds the event id which comes as request
 *       parameters.
 */
var gSponsorFileId = "";
var gRulesAndReg = "";
var gSponsorUrl = "";
var gSponsorLogo = "";
var gSponsorPdf = "";
var gSponsorMailId = "";
var gEventId = "";
var gEditSponsorPdf = "";
var gEditSponsorLogo ="";


Template.aboutTeam.helpers({
 logoFileName: function() { 
  // Get the Team-id to be edited
    var gRouteParameter = Router.current().params._PostId;
    gTeamId = gRouteParameter.slice( 1 );
    // Find the team with that id and with that manager 
    var a = teams.find({
        "_id": gTeamId,
    }).fetch();
    if (a[0].sponsorLogo )
    {
      // Get the File Name
      var b = teamUploads.find({
            "_id": a[0].sponsorLogo,
        }).fetch();
        return b[0].original.name;  
        

    }
    else 
    {
        return null;          

    }
    
  },
  logoPdfName: function() { 
    // Get the Team-id to be edited
      var gRouteParameter = Router.current().params._PostId;
      gTeamId = gRouteParameter.slice( 1 );
      // Find the team with that id and with that manager 
      var a = teams.find({
          "_id": gTeamId,
      }).fetch();
      if (a[0].sponsorPdf )
      {
        // Get the File Name
        var b = teamUploads.find({
              "_id": a[0].sponsorPdf,
          }).fetch();
          return b[0].original.name;  
          

      }
      else 
      {
        return null;          

      }
      
    }
  
  
});





Template.editTeams.helpers({
  
  searchResults: function() 
  {
       // var re = new RegExp(Session.get('searchQuery'), 'i');

        var search=ReactiveMethod.call('search',Session.get('searchQueryEditTeam'));
        return search;
    },
  
  logoFileName: function() {  
    // Get the Team-id to be edited
      var gRouteParameter = Router.current().params._PostId;
      gTeamId = gRouteParameter.slice( 1 );
      // Find the team with that id and with that manager 
      var a = teams.find({
          "_id": gTeamId,
      }).fetch();
      if (a[0].sponsorLogo )
      {
        // Get the File Name
        var b = teamUploads.find({
              "_id": a[0].sponsorLogo,
          }).fetch();
        
          return b[0].createdAt;  
          

      }
      else 
      {
          return null;          

      }
      
    },

    lEvent: function() {
      var gRouteParameter = Router.current().params._PostId;
        gTeamId = gRouteParameter.slice( 1 );

        var lEvents = teams.find({
            "_id": gTeamId
        }).fetch();

             
        // get the project name from project-id
      for (i = 0; i < lEvents.length; i++) {

        projectName =tournamentEvents.find({"_id":lEvents[i].projectName.toString()}).fetch();
        lEvents[i].projectName=projectName[0].projectMainName;

      }

        
        if (lEvents.length!=0) {
          
          gSponsorLogo = lEvents[0].sponsorLogo;
          gSponsorPdf = lEvents[0].sponsorPdf;
          
          // Retrieve the Logo from DB
        Session.set("sponsorLogoDispUpdate",teamUploads.find({
          "_id" : lEvents[0].sponsorLogo
        }).fetch());
        
        // set the session so that while displaying
        // the ABOUT US page, the team-name gets displayed
      Session.set('teamName', lEvents[0].teamName); 
        
          return lEvents;
        }
      
    },
    lVenues:function(){
      var gRouteParameter = Router.current().params._PostId;
        gTeamId = gRouteParameter.slice( 1 );

        var lEvents = teams.find({
            "_id": gTeamId
        }).fetch();
        
        return lEvents[0].venues;
    },
 /**   lSponsorLogo: function() {
  //  var lData = Session.get("sponsorLogoDisp");
    //if(lData){
      // Once the response is recieved
      // hide all the divs where
      // Team Logo has to be displayed
      // and show only Team Logo
        $("#sponsor1").hide(); 
      $('#sponH').hide();
      $('#sponH1').hide();
      $('#sponH2').hide();
      $('.sponsorHeaderDetails1').hide();
      $('#sponImg').show();

      // Get the Team-Id from router
      var gRouteParameter = Router.current().params._PostId;
          gTeamId = gRouteParameter.slice( 1 );
          
          // Find the Team details,once the team-id is obtained
      var lEvents = teams.find({
              "_id": gTeamId
          }).fetch();
      
      // Fetch the corresponding team logo
      var s = teamUploads.find({
            "_id" : lEvents[0].sponsorLogo
          }).fetch();

        return s;
      /**for( var i=0, l=lData.length; i<l; i++ ) {
          var s = teamUploads.find({"_id":lData[i]._id}).fetch();
          return s;
      }**/    
    //},
  
    
       lSponsorLogo: function() {
    var lData = Session.get("sponsorLogoDispUpdate");
    if(lData){
      $("#sponsor1").hide(); 
      $('#sponH').hide();
      $('#sponH1').hide();
      $('#sponH2').hide();
      $('.sponsorHeaderDetails1').hide();
      $('#sponImg').show();
      for( var i=0, l=lData.length; i<l; i++ ) {
          var s = teamUploads.find({"_id":lData[i]._id}).fetch();
          return s;
      }   
      
    } 
    else
    {
      // Get the Team-Id from router
      var gRouteParameter = Router.current().params._PostId;
          gTeamId = gRouteParameter.slice( 1 );
          
          // Find the Team details,once the team-id is obtained
      var lEvents = teams.find({
              "_id": gTeamId
          }).fetch();
      
      // Fetch the corresponding team logo
      var s = teamUploads.find({
            "_id" : lEvents[0].sponsorLogo
          }).fetch();
            
      if(s.length!=0)
      {
        $("#sponsor1").hide(); 
        $('#sponH').hide();
        $('#sponH1').hide();
        $('#sponH2').hide();
        $('.sponsorHeaderDetails1').hide();
        $('#sponImg').show();
        
          return s;
      }           
    }
  },
  
    lTeamMember: function() {
      
 
      
      var lTeamMembers=new Array();
      var gRouteParameter = Router.current().params._PostId;
        gTeamId = gRouteParameter.slice( 1 );

        var lEvents = teams.find({
            "_id": gTeamId
        }).fetch();
        // Find out the user names
        for(i=0;i<lEvents[0].teamMembers.length;i++)
        {
          // Find the user-name
          var userId=lEvents[0].teamMembers[i];
          var user=Meteor.users.find({"_id":userId}).fetch();

          if(user[0].userName.length>40){
            user[0].userName = user[0].userName.substring(0,40).trim() + "..";
      }
          
          lTeamMembers.push(user[0]);

        }
        if (lTeamMembers) {
          return lTeamMembers;
        }
      
    },
    lTeamMemberResigned: function() {
      var lTeamMembersResigned=new Array();
      var lUserDetailsWhoResigned=new Array();
      
      // Get those members who want resigned
      // to resign from the team
      var gRouteParameter = Router.current().params._PostId;
        gTeamId = gRouteParameter.slice( 1 );
        
     // Get the user-id of the logged-in user
     var lLoggedInUser = Meteor.users.findOne({"_id" : Meteor.userId()});
    
     var lTeamMembersResigned=inbox.find( { $and: [ { "userToAct": lLoggedInUser.userId }, { "teamId":gTeamId},{"messages":"resigned"}  ] } ).fetch();
     
     for(i=0;i<lTeamMembersResigned.length;i++)
     {
      // Find the user-name
      var userId=lTeamMembersResigned[i].userId;
      var user=Meteor.users.find({"userId":userId}).fetch();
      lUserDetailsWhoResigned.push(user[0]);

     }
     if (lUserDetailsWhoResigned) {
       return lUserDetailsWhoResigned;
     }
      
    
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
    lProjectName: function() {
        var lProjectNames = tournamentEvents.find().fetch();
        if (lProjectNames) {
            return lProjectNames;
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
        local: function() { return Meteor.users.find().fetch(); },

                // name of the template where the suggestions
        // should be displayed
        template: 'team',
        
        // Limit of results
        limit:10
      }
    ];
    
  }
   /** lSponsorLogo: function() {
        var lData = Session.get("sponsorLogoDispUpdate");
        if(lData){
            for( var i=0, l=lData.length; i<l; i++ ) {
                var s = eventUploads.find({"_id":lData[i]._id}).fetch();
                return s;
            }       
        }   
    }**/
    /*  lSponsorPdf : function() {
        if (Meteor.user()) {
          var lId = Router.current().params._PostId;
          var lData = [];
          var lEvents = events.find({
            "_id" : lId
          }).fetch();
          for(var j = 0;j<lEvents.length;j++){
            for (var i = 0; i < lEvents[j].sponsorPdf.length; i++) {
              lData.push(eventUploads.find({
                "_id" : lEvents[j].sponsorPdf[i]
              }).fetch());
            } 
          }
        return lData;
        }
      },
      lRulesAndReg : function() {
        if (Meteor.user()) {
          var lId = Router.current().params._PostId;
          var lData = [];
          var lEvents = events.find({
            "_id" : lId
          }).fetch();
          for(var j = 0;j<lEvents.length;j++){
            for (var i = 0; i < lEvents[j].rulesAndRegulations.length; i++) {
              lData.push(eventUploads.find({
                "_id" : lEvents[j].rulesAndRegulations[i]
              }).fetch());
            } 
          }
        return lData;
        }
      }*/
});
var gLogoFlag = 0;
var gPdfFlag1 =  0;
var gLogoFlag1 =  0;
var gPdfFlag = 0;
var gRulesFlag = 0;
/**
 * Events handler for the template editEvents.html
 */
Template.editTeams.events({
  
  'mouseover .addIcon':function(e){
    $("#"+e.target.id).css("color", "green");

  },
  'mouseout .addIcon':function(e){
    $("#"+e.target.id).css("color", "rgb(56,56,56)");

  },

    'click #sponsor': function(e) {
        e.preventDefault();
     //   var searchUser=document.getElementById("searchUserEditTeam");
  //    document.getElementById('searchUserEditTeam').value='';
        $('#editUploadModal').modal('show');
    },
    'keyup #searchUserEditTeam ,change #searchUserEditTeam,input #searchUserEditTeam': function(e){
       Session.set('searchQueryEditTeam', e.target.value);
    },
    'click .addIcon':function(e){
      
      // Add the existing members
      if(elementsAdded.length==0)
      {
        //document.getElementById('searchUserEditTeam').value=' ';
        
        var elements = document.getElementsByClassName("eyeIconEditTeam");
        // Add all the existing members 
        for(i=0;i<elements.length;i++)
        {
          
          var id = elements[i].id.substring(0, elements[i].id.length - 9);
            elementsAdded.push(id);

        }
        
      }
      
      // If the user is already added dont
       // add the user again
       if(elementsAdded.indexOf(e.target.id)!=-1)
       {
         $("#conFirmHeaderOk").text("User already added");
        $("#confirmModalOk").modal('show');

         
       }
       else
      {  
      
      elementsAdded.push(e.target.id);
    
      // Clear the text present in input text-box
     // document.getElementById('searchUserEditTeam').value = " ";
              
      // Get the id of that div where the new users
      // must be placed
      var container = document.getElementById("addedUsers");
    
      // Create the eye-icon that must be place
      /**var input = document.createElement("input");
      input.type="button";
      input.className="eyeIconEditTeam" ;
      input.id=e.target.id+"deleteeye";
      container.appendChild(input);**/
      
      var input = document.createElement("span");
    input.style="color:#770000;font-size: 22px;top:0%;margin-top:2%;padding-top:0%; transform: rotate(0deg);cursor: pointer;background :none";
      input.className="glyphicon glyphicon-eye-open eyeIconEditTeam" ;
     input.id=e.target.id+"deleteeye";
     container.appendChild(input);
     
     // Get the corresponding user's details
      var a=Meteor.users.find({"_id":e.target.id}).fetch();
        //  gTeamLists = teams.find({"_id":this._id}).fetch();
      
      if(a[0].userName.length>40){
        a[0].userName = a[0].userName.substring(0,40).trim() + "..";
      }
    
      // Create the user-name field that must be placed that must be place
      var user=document.createElement("h12");
      // Get the user-name from the id
      user.innerHTML="&nbsp;&nbsp;"+a[0].userName;
      user.className="userEditTeam";
      user.style="color:white;";
      user.id=e.target.id+"deleteuser";
      container.appendChild(user);
      
      // Add the Star Icon
     /** var star=document.createElement("img");
      star.src="/star-xxl.png";
      star.id=e.target.id+"deleteStar";
      star.className="selectSubDomainsEditTeam";
    container.appendChild(star);**/
    
      // Create the delete icon that has to be added
      /**var deleteIcon = document.createElement("input");
      deleteIcon.type="button";
      deleteIcon.className="deleteIconEditTeam";
      deleteIcon.id=e.target.id+"delete";
      container.appendChild(deleteIcon);**/
    var deleteIcon = document.createElement("span");
     deleteIcon.style="color: rgb(119, 0, 0); font-size: 22px; transform: rotate(0deg); cursor: pointer; background: none repeat scroll 0% 0% transparent; margin-top: 0.5%;margin-right:7%";
     deleteIcon.className="glyphicon glyphicon-remove deleteIconEditTeam";
     deleteIcon.id=e.target.id+"delete";
     container.appendChild(deleteIcon);
     
     document.getElementById('searchUserEditTeam').value ="";
     $( "#searchUserEditTeam" ).keyup();

      }
      },

   

    'click #sponsorCanceled': function(e) {
        e.preventDefault();
      // Get the Team-id to be edited
      var gRouteParameter = Router.current().params._PostId;
        gTeamId = gRouteParameter.slice( 1 );
        
        var lEvents = teams.find({
            "_id": gTeamId
        }).fetch();
        
        $('#uploadModal').modal('hide');
        $('#sponsorPdf').val("");
        $('#sponsorLogo').val("");
        $('#sponsorLogoName').val("");
        $('#sponsorPdfName').val("");
    },
    
    // To view the online-status
  // of the user
  /**'click .eyeIconEditTeam':function(e){    
        
    // Remove the last 9 characters to
    // get the correct id
    var str=e.target.id;
    str = str.substring(0, str.length - 9);
        
    // Get the corresponding user's details
    var a=Meteor.users.find({"_id":str}).fetch();

    // Set the User-Name and mobile Number
    $('.modal-header').html('<h4 class="modal-title">'+a[0].userName+'<img  src="/tele-_2g-512.png" class="iconPhone" alt="Phone"><span class="mobileNumber">'+a[0].phoneNumber+'</span></h4>');
    
    // Initially awayFromDate will not exist(When the user is created)
    if((!(typeof(a[0].awayToDate) === "undefined")))
    {
      $('#animalsModal .modal-body').html('<img  src="/cropped-Letter-O-icon.png" class="iconBusy" alt="Phone"><label for="name" id="onlineText"> I am away from <span class="bold">'+a[0].awayFromDate+'</span> to <span class="bold">'+a[0].awayToDate+'</span></label>');
    }
    // But Once the user is created,he can change  awayFromDate to null or empty
    else if(a[0].awayToDate!=null)
    {
      $('#animalsModal .modal-body').html('<img  src="/cropped-Letter-O-icon.png" class="iconBusy" alt="Phone"><label for="name" id="onlineText"> I am away from <span class="bold">'+a[0].awayFromDate+'</span> to <span class="bold">'+a[0].awayToDate+'</span></label>');
    }
    //  If awayFromDate details are not available then display that the user online-status as available 
    else 
    {
      $('#animalsModal .modal-body').html('<img  src="/index.jpeg" class="iconAvailable" alt="Phone"><label for="name" id="onlineAvailableText"> I am available</label>');
    }

    // Clear the text present in input text-box
    document.getElementById('searchUserEditTeam').value = "";
      
    // Show the pop-up that shows the online
    // status
    e.preventDefault();
      $('#animalsModal').modal('show');
    },**/
    
 // To view the online-status
  // of the user
  /**'click .eyeIconEditTeam':function(e){    
    
              
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
    
      $(".createTeam").css("font-size", "15px");

    
    // Set the User-Name and mobile Number
    // If the Mobile -number is given then
    // display,otherwise dont display
    if(a[0].phoneNumber!="")
    { 
        //$('.createTeam').html('<h12 class="modal-title" title='+a[0].userName+' style="color:white;">'+a[0].userName+'<span class="mobileNumber">'+a[0].phoneNumber+'</span><img  src="/images.png" class="iconPhone" alt="Phone"></h4>');
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
    document.getElementById('searchUserEditTeam').value = "";
      
    // Show the pop-up that shows the online
    // status
    e.preventDefault();
      $('#animalsModal').modal('show');
    },**/
    
    // Once the OK button is closed in
    // the User-Online Pop-up,close the
    // pop-up
    "click #ok" : function(e) {
    e.preventDefault();
    $('#animalsModal').modal('hide');
  },
  
  // Changing the Manager 
  /**'click .selectSubDomainsEditTeam':function(e){
    
      // Remove the last 9 characters to
      // get the correct id
      var str=e.target.id;
      str = str.substring(0, str.length - 10);
      
      
      // Get the corresponding user's details
      var a=Meteor.users.find({"_id":str}).fetch();
      
            var userName=a[0].userName;
      if(a[0].userName.length>15){
        a[0].userName = a[0].userName.substring(0,15).trim() + "..";
      }
      
        $(".editTeamChangeManager").css("font-size", "13px");

      $('.editTeamChangeManager').html('<h12 class="modal-title" title='+a[0].userName+' style="color:white;">Change Team Manager to <span class="bold">'+a[0].userName+'</span> ?</h4>');

        // Change the font-size
      $("#animalsModalChangeManager .modal-body").css("font-size", "12px");
      
        $('#animalsModalChangeManager .modal-body').html('<p>You are about to handover the team<span class="bold"> '+ Session.get('teamName')+'</span> to <span class="bold"> '+userName+' </span>.</br>Do you want to confirm?</p>');
        
        // Change the user-attribute
        $("#okChangeManager").attr("userId", str);


      // Clear the text present in input text-box
      document.getElementById('searchUserEditTeam').value = "";
        
      // Show the pop-up that shows the online
      // status
      e.preventDefault();
        $('#animalsModalChangeManager').modal('show');
  },**/
  
  // Clicking on OK to change the Manager
  'click #okChangeManager':function(e){
    
    
    var manager=$("#okChangeManager").attr("userId");
        Session.set("manager",manager);   
        

        
        // Hide the pop-up
      $('#animalsModalChangeManager').modal('hide');
  },
  
  // Clicking on cancel just hides the popup
    'click #cancelChangeManager':function(e){
    
      // Change the user-attribute
      $("#okChangeManager").attr("userId",null);
         
      // Hide the pop-up
      $('#animalsModalChangeManager').modal('hide');
  },
  
  // To Delete User
  'click .deleteIconEditTeam':function(e){
  //  document.getElementById('searchUserEditTeam').value='';
    e.preventDefault();
    Session.set("deleteAddedUserToDiv",e.target.id);
        // Get the user Name
    
    // Remove the last 6 characters to
    // get the correct id
    var str=e.target.id;
    str = str.substring(0, str.length - 6);
    
    //document.getElementById('yesButton').id = str;

    $(".yesButton").attr("id", str);
    
    $("#confirmModal").modal('show');
    
    
    // Get the corresponding user's details
      var a=Meteor.users.find({"_id":str}).fetch();
        //  gTeamLists = teams.find({"_id":this._id}).fetch();
      
      if(a[0].userName.length>15){
        a[0].userName = a[0].userName.substring(0,15).trim() + "..";
      }
    
    
    
          
    // Get the corresponding user's details
  //  gTeamLists = teams.find({"_id":this._id}).fetch();
    $("#conFirmHeader").text("Delete "+ a[0].userName +"?");
    
  },
  
  // To Delete the User who wants to resign
  'click .deleteIconEditTeamResign':function(e){
    e.preventDefault();
    
    
    // Get the user Name
    
    // Remove the last 6 characters to
    // get the correct id
    var str=e.target.id;
    str = str.substring(0, str.length - 6);
    

    
    // Get those members who want resigned
      // to resign from the team
      var gRouteParameter = Router.current().params._PostId;
        gTeamId = gRouteParameter.slice( 1 );
        
        
        // Get the user-id of the logged-in user
        var lLoggedInUser = Meteor.users.findOne({"_id" : Meteor.userId()});
        
        var xData={
          userId : str,
          messages:"resigned",
          userToAct:lLoggedInUser.userId,
          teamId:gTeamId,
          };
      
      Meteor.call('deleteMessage', xData,
          function(error, response) {
            if (response) {
            } else {
            }
      });
        

  },
  
  // YES Confirmation To Delete Team
  'click #yesButton':function(ev){
    ev.preventDefault();
        $('[id^='+Session.get("deleteAddedUserToDiv")+']').remove()
    // Add the existing members
      if(elementsAdded.length==0)
      {
        
        var elements = document.getElementsByClassName("eyeIconEditTeam");
        // Add all the existing members 
        for(i=0;i<elements.length;i++)
        {
          
          var id = elements[i].id.substring(0, elements[i].id.length - 9);
            elementsAdded.push(id);

        }
        
      }
    
    
    
    // ev.target.id has the userid that has to be deleted
        // Remove the user with that id
      //  var eye=document.getElementById(ev.target.id+"deleteeye");
      //  var user=document.getElementById(ev.target.id+"deleteuser");
      //  var deleteIcon=document.getElementById(ev.target.id+"delete");
      //  var deleteStar=document.getElementById(ev.target.id+"deleteStar");
        
        var deleteId=ev.target.id;
        

     //   eye.remove();
     //   user.remove();
     //   deleteIcon.remove();
    
    //$(".yesButton").attr("id", 'yesButton');

    
    // Also remove the array element
      elementsAdded.splice(elementsAdded.indexOf(deleteId),1);

        
    // Hide the Confirmation box
    $("#confirmModal").modal('hide');

    //Click the cancel
    $('#confirmModalOk').modal('hide');
       
  },
  
  /**'mouseover .userEditTeam':function(e){
    $("#"+e.target.id).css("color", "rgb(179,0,0)");

  },
  
  'mouseout .userEditTeam':function(e){
    $("#"+e.target.id).css("color", "white");

  },**/
  
  // To view the online-status
  // of the user
  /**'click .userEditTeam':function(e){   
    
              
    // Remove the last 9 characters to
    // get the correct id
    var str=e.target.id;
    str = str.substring(0, str.length - 10);
    
    

    
    // Get the corresponding user's details
    var a=Meteor.users.find({"_id":str}).fetch();
    

    
    // Trim the user-name
    //a[0].userName = a[0].userName.substring(0,35).trim() + "..";
      
      // If the User-Name is more then
    // trim 
    if(a[0].userName.length>15){
      a[0].userName = a[0].userName.substring(0,15).trim() + "..";
    }
    
      $(".createTeam").css("font-size", "15px");

    
    // Set the User-Name and mobile Number
    // If the Mobile -number is given then
    // display,otherwise dont display
    if(a[0].phoneNumber!="")
    { 
        $('.createTeam').html('<h12 class="modal-title" title='+a[0].userName+' style="color:white;">'+a[0].userName+'<span class="mobileNumber">'+a[0].phoneNumber+'</span><img  src="/images.png" class="iconPhone" alt="Phone"></h4>');
    }
    else
    {
      $('.createTeam').html('<h12 class="modal-titleWithoutMobile" title='+a[0].userName+' style="color:white;">'+a[0].userName+'</h4>'); 

    }
    // If awayFromDate is not empty then this status should be displayed
    if(a[0].awayToDate!="")
    {
      $('#animalsModal .modal-body').html('<img  src="/cropped-Letter-O-icon.png" class="iconBusy" alt="Phone"><label for="name" id="onlineText"> I am away from <span class="bold">'+a[0].awayFromDate+'</span> to <span class="bold">'+a[0].awayToDate+'</span></label>');
    }
    else
    {
      $('#animalsModal .modal-body').html('<img  src="/index.jpeg" class="iconAvailable" alt="Phone"><label for="name" id="onlineAvailableText"> I am available</label>');
    }

    // Clear the text present in input text-box
    document.getElementById('searchUserEditTeam').value = "";
      
    // Show the pop-up that shows the online
    // status
    e.preventDefault();
      $('#animalsModal').modal('show');
    },**/
  // NO or CANCEL Confirmation To Delete Team
  'click #noButton':function(e){
    e.preventDefault();
    $("#confirmModal").modal('hide');
    $('#confirmModalOk').modal('hide');
  },

    
    // To Upload the Team logo
  // and team description
  /**'click #sponsor': function(e) {
    e.preventDefault();
    $('#uploadModal').modal('show');
    },**/
    
    'click #sponsorUpload': function(e) {
    e.preventDefault();
    var lData, lData1,x;
    
        //TODO:Validation
    //gSponsorUrl = $('#sponsorUrl').val();
    //gSponsorMailId = $('#sponsorMailId').val();
    /**if($('#sponsorDetails').valid()){
            if(gLogoFlag==1){
                gLogoFlag = 0;
                gLogoFlag1 = 1;**/
                fileUpload($('#sponsorLogo').prop('files'), function(response) {
                    if(response){
                    gLogoFlag1 = 1;
                    gEditSponsorLogo = response;
                    $("#sponsor1").hide(); 
                    $('#sponH').hide();
                    $('#sponH1').hide();
                    $('#sponH2').hide();
                    $('#sponImg').show();
                    Session.set("sponsorLogoDispUpdate",teamUploads.find({
                        "_id" : response
                    }).fetch()); 
                    }
                    else{
                        gLogoFlag1 = 0;
                    }          
                 });
            //}
            /**if(gPdfFlag==1){
                gPdfFlag = 0;
                gPdfFlag1 = 1;**/
                fileUpload($('#sponsorPdf').prop('files'), function(response) {
                    if (response) {
                      gPdfFlag1 = 1;
                        gEditSponsorPdf = response;
                    }
                    else{
                        gPdfFlag1 = 0;
                    }   
                });
           // }
          $('#uploadModal').modal('hide');
        
       
    
    
      // Once the upload is completed
      // hide the pop-up
      $('#uploadModal').modal('hide');
    },

    "change #editDomainName": function(e) {
        e.preventDefault();
        if (!$("#editDomainName").valid()) {
            $('#editDomainName + .select2-container--default .select2-selection--single .select2-selection__rendered').css('color', 'red');
        } else {
            $('#editDomainName + .select2-container--default .select2-selection--single .select2-selection__rendered').css('color', '#fff');
        }
    },

    "click #prize":function(e){
        e.preventDefault();
        $("#prize").valid();
    },

    "blur #editDescription":function(e){
        e.preventDefault();
         if (!$('#editDescription').valid()) {
            $('#editDescription').css('color', 'red');
        } else {
            $('#editDescription').css('color', '#fff');
        }
    },

    /**
     * set the select html attribute #domainName
     * to remove duplicate domainNames as option
     *
     */
    "blur #editDomainName + .select2-container ": function() {
        var lExist = {};
        $('select > option').each(function() {
            if (lExist[$(this).val()])
                $(this).remove();
            else
                lExist[$(this).val()] = true;
        });
    },

    "mouseover #editDomainName + .select2-container ": function() {
        var lExist = {};
        $('select > option').each(function() {
            if (lExist[$(this).val()])
                $(this).remove();
            else
                lExist[$(this).val()] = true;
        });
    },

    'change #sponsorLogo': function(e) {
        //eventUploads.remove({"_id":gSponsorLogo});
        $('#sponsorLogoName').val($('#sponsorLogo').val());
        $('#sponsorLogo').valid();
        if(gLogoFlag1===1){
            teamUploads.remove({"_id":gEditSponsorLogo});
            gEditSponsorLogo="";
            $("#sponsor1").show(); 
            $('#sponH').show();
            $('#sponH1').show();
            $('#sponH2').show();
        }
       if($('#sponsorLogo').valid()){
            gLogoFlag = 1;
        }

    },

    'change #sponsorPdf': function(e) {
        //eventUploads.remove({"_id":gSponsorPdf});
        $('#sponsorPdfName').val($('#sponsorPdf').val());
        $('#sponsorLogo').valid();
        $('#sponsorPdf').valid();
        if(gPdfFlag1===1){
          teamUploads.remove({"_id":gEditSponsorPdf});
            gEditSponsorPdf = "";
        }
        if($('#sponsorPdf').valid()){
            gPdfFlag = 1;
        }
    },

    'submit form': function(e) {
        e.preventDefault();
    },

    /**
     * on click of html attribute id #cancel
     * route to userLandingPage
     */
    "click #cancel": function() {
       /** if(gLogoFlag===1){
        teamUploads.remove({
            "_id": gEditSponsorLogo
        });
        }
        if(gPdfFlag===1){
        teamUploads.remove({
            "_id": gEditSponsorPdf
        });
        }**/
      elementsAdded=[];
        Session.set("sponsorLogoDispUpdate",null);
        Session.set("sponsorLogoDispUpdate",undefined);
        Router.go("myTeams");
    },

    'click .dropdownSelectedDomains dt a': function (event) {
    
      // If the dropdown menu is displayed
      // then the search box for the users
      // should be hidden
      $('.dropdownSelectedDomains dd ul').slideToggle('fast', function(){
        });   
    
  },
  'click .dropdownSelectedDomains dd ul li a': function () {
    $(".dropdownSelectedDomains dd ul").hide();
  },
  'click .hida': function (e) {
    var $clicked = $(e.target);
    if (!$clicked.parents().hasClass("dropdownSelectedDomains")) $(".dropdownSelectedDomains dd ul").hide();
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
      $('.dropdownSelectedDomains dt a').append(ret);
       
      // Check if the checkboxes are checked or not
      var checked = $("#venue input:checkbox:checked").length;
      
      // If there are no checked check-boxes then just display venue 
      if(checked==0){
        $(".multiSel").hide();
        $(".hida").show();
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

});

var updateTeamToServer = function(){
   
        if(gLogoFlag1===1 && gEditSponsorLogo!==""){
        teamUploads.remove({
            "_id": gSponsorLogo
        });
        gLogoFlag1=0;
        gSponsorLogo = gEditSponsorLogo;
        }
        if(gPdfFlag1===1 && gEditSponsorPdf!==""){
          teamUploads.remove({
              "_id": gSponsorPdf
            });
        gSponsorPdf = gEditSponsorPdf;
        gPdfFlag1=0;
        }
            
        // Call the edit-Team Method
        editTeam();

            
}



var editEventValidate = function() {
    var s = $('#eventEditing').validate({
        rules: {
            eventName: {
                required: true,
                minlength: 5
            },
            prize: {
                required: true,
                minlength: 5
            },
            rulesAndReg: {
                accept: 'application/pdf',
                filesize: 1048576
            },
            domainName: {
                required: true
            },
            projectName: {
                required: true
            },
            closureDate: {
                required: true
            },
            startDate: {
                required: true
            },
            endDate: {
                required: true
            },
            description: {
                required: true
            },
        },
        messages: {
            eventName: {
                required: "Please enter the event name.",
                minlength: "The Event name should contain atleast 5 characters",
            },
            prize: {
                required: "Please enter the prize details.",
                minlength: "The Prize details should contain atleast 5 characters",
            },
            rulesAndReg: {
               // required: "Please upload the rules and regulations pdf",
                accept: 'Please upload only pdf files',
                filesize: 'Rules and Regulations file size should be less than 1MB'
            },
            domainName: {
                required: "Please select the venue",
            },
            projectName: {
                required: "Please select the game"
            },
            closureDate: {
                required: "Please select the entry closure date and time"
            },
            startDate: {
                required: "Please select the event start date and time"
            },
            endDate: {
                required: "Please select the event end date and time"
            },
            description: {
                required: "Please provide the event description"
            },
            /* sponsorPdf:{
            required:"Please upload sponsors pdf",
            filesize:'the file size should be less than 1MB'
           }*/
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
                    $('#editRules').css('color', 'red')
                }
                if (q.name === 'domainName') {
                    $('#editDomainName + .select2-container--default .select2-selection--single .select2-selection__rendered').css('color', 'red');
                }
                if (q.name == 'description') {
                    $('#editDescription').css('color', 'red')
                }
            }

        },
        submitHandler: function(event) {
          elementsAdded=[];
           updateTeamToServer();
        }
    });
}

$.validator.addMethod('filesize', function(value, element, param) {
    // param = size (en bytes) 
    // element = element to validate (<input>)
    // value = value of the element (file name)
    return this.optional(element) || (element.files[0].size <= param)
});

$.validator.addMethod('sponsorFiles', function(value, element) {
    // param = size (en bytes) 
    // element = element to validate (<input>)
    // value = value of the element (file name)
    //theFile = new FS.File(gSponsorPdf[0]);

    if ($('#sponsorPdf').prop('files') === "" || $('#sponsorLogo').prop('files') === "") {
        return false;
    } else {
        return true
    }
});




var sponsorValidate = "";
var editSponsorUploadValidate = function() {
    sponsorValidate = $('#editSponsorDetails').validate({
        rules: {
            sponsorLogo: {
                filesize: 10000
            },
            sponsorPdf: {
                filesize: 1048576
            }
        },
        messages: {
            sponsorLogo: {
                required: "*please upload sponsors logo",
                filesize: "*sponsors logo size should be less than 5 kilo bytes"
            },
            sponsorPdf: {
                required: "*please upload sponsors Pdf file",
                filesize: "*sponsors pdf file should be less than 1Mega Bytes"
            }
        },
        errorElement: 'div',
    });
}


//File-Upload Method
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

var editTeam = function(){
   // var lTeamName = $('#teamName').val();
  //  var lProjectName = $('#sportName :selected').text();
    var lPlacesOfInterest= $('#domain').text();
    
    // If the Manager session is set then
    // edit the new manager,otherwise retain
    // the old manager who is the logged-in user
    if(Session.get("manager"))
    {
       var lTeamOwner=Session.get("manager");
     var lTeamManager=Session.get("manager");
    }   
    else{
    // Get the user-id of the logged-in user
      var lLoggedInUser = Meteor.users.findOne({"_id" : Meteor.userId()});
      var lTeamOwner=lLoggedInUser.userId;
      var lTeamManager=lLoggedInUser.userId;
    }
    
    
    var elements=$("#domain");
    var intrestedDomains = [];
    $('#venue input:checked').each(function() {
      intrestedDomains.push($(this).attr('value'));
    });
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
    
  // Get the Team-id to be edited
  var gRouteParameter = Router.current().params._PostId;
    gTeamId = gRouteParameter.slice( 1 );
      
    var lData={
            teamId:gTeamId,
          teamOwner:lTeamOwner,
          venues:intrestedDomains,
          users:users,
          teamManager:lTeamManager,
          sponsorPdf:lSponsorPdf,
          sponsorLogo:lSponsorLogo
          };
      //  updateTeams(lData);
        Meteor.call('updateTeams', lData,
                function(error, response) {
                   if (response) {
                        Router.go("myTeams");
                        Session.set("sponsorLogoDispUpdate",null);
                        Session.set("sponsorLogoDispUpdate",undefined);
                        Session.set("sponsorPdfDispUpdate",null);
                        Session.set("sponsorPdfDispUpdate",undefined);
                        Session.set("manager",null);    
                    } else {
                    }
                });
  }

//Validation
var editTeamValidate = function() {
  var s = $('#teamCreation').validate({
    rules: {
      eventName: {
        required: true
      //  minlength: 5
      },
/**     prize: {
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
        required: "Please enter the Team name."
      },
      
    /** prize: {
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
      updateTeamToServer();
    }
  });
};
