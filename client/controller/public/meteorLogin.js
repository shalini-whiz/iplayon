//Template helpers, events for meteor login
//Template is login.html

/**
 * @Author : Vinayashree
 */

Template.meteorLogin.onCreated(function(){
  // Code to run when template is created goes here.
	//this.subscribe("users");
	this.subscribe("userOtp");
});

/**
 * Validation for meteor login form id application-login
 * if validation is successful submitHandler calls
 * the meteor method loginWithPassword to insert user
 * and update user fields
 */
Template.meteorLogin.onRendered(function(){
  $('#application-login').validate({
    rules: {
    	password: {
            required: true
          },
      emailAddress: {
        required: true,
        email: true
      }
      
    },
    
    // Display only one error at a time
    showErrors: function(errorMap, errorList) {
        $("#application-login").find("input").each(function() {
            $(this).removeClass("error");
        });
        $("#emailIdForget").html("");
        if(errorList.length) {
            $("#emailIdForget").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+errorList[0]['message']);
            $(errorList[0]['element']).addClass("error");
        }
    },
	 
    messages: {
    	password: {
            required: "Please enter your password to login."
          },
      emailAddress: {
        required: "Please enter your email address to login.",
        email: "Please enter a valid email address."
      }
      
    },
    submitHandler: function(){
      // Grab the user's details.
      user = {
        email: $('[name="emailAddress"]').val(),
        password: $('[name="password"]').val()
      }
              var emailId=$('[name="emailAddress"]').val();
          
         var status = emailId.search(/dispostable/i);
        //var status = -1;
    if (status>=0) {
      $("#conFirmHeaderOk").text("Invalid email-id");
      $("#confirmModalOk").modal('show');
      $("#userName").value = "";
    } else {
      // Log the user in.
      Meteor.loginWithPassword(user.email, user.password, function(error){
        if(error){
      
          $("#conFirmHeaderOk").text("Invalid User-Name or Password");
		  $("#confirmModalOk").modal('show');
        } else {

          // Generate the Api KEY
          // Call createApi() server call
          
        }
      });
    }
    }
  });
});

/*
* Helpers
*/

Template.meteorLogin.helpers({
  example: function(){
    // Code to run for helper function.
  }
});

/*
* Events
*/

Template.meteorLogin.events({
  'submit form': function(e){
    // Prevent form from submitting.
    e.preventDefault();
  }
});