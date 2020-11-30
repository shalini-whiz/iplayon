

  // Subsribe to users
  Template.loginForgotPassword.onCreated(function() {
	this.subscribe("userOtp");
});

  // Helpers for the page loginForgotPassword
  Template.loginForgotPassword.helpers({
	  
	  // Get the email address
	  emailId: function() {
	        var emailId = Router.current().params._PostId.slice( 1 );
	        return emailId;
	  }
	  
  });
  
  // Events for the page loginForgotPassword
  Template.loginForgotPassword.events({
	  
	  // Clicking on #goToRegister,redirects
	  // to register page
	  'click #goToRegister':function(){
		  Router.go("/registerPage1")
	  },	  
	  
	  // Clicking on #change,redirects
	  // to login page
	  'click #change':function(){
		  Router.go("/login");
	  },
	  
	  // Clicking on #resend,sends
	  // the verification code again
	  'click #resend':function(){
		  
		  // Get the email-id
		  var emailId = Router.current().params._PostId.slice( 1 );
		  
		  //$('*').css('cursor','wait');
		  
		// Before sending an email, send the session 
		  // and the // Session for verification code
		 
		  
		  // First generate a 4-digit random code
		  // as verification code
		  var min = 1000;
		  var max = 9999;
		  var verificationCode = Math.floor(Math.random() * (max - min + 1)) + min;
		  
		  // Set the session
		  Session.set("codeLogin",verificationCode);
		  Session.set("emailIdLogin",emailId);
		  
		  var xData={ 
				  // teamName[0].teamManager
				  verificationCode :Session.get("codeLogin") ,
				  emailId:Session.get("emailIdLogin")
				  
			    };
		  
		  // Send the mail
		  Meteor.call("sendEmail",xData,function(error,response ){
			  
			  //$('*').css('cursor','wait');
			  
			  
			
			  if(response)
			  {
				  //$('*').css('cursor','default');
				  
				  // Route to Login-forgot password
				  $('#verificationSucess').css("color", "green");
				  $('#verificationSucess').html('<span class="glyphicon glyphicon-ok-sign green"></span>'+' Sent the verification code again');
				  
				  
			  }
			  else
			  {
				 // $('*').css('cursor','default');
				  
				  $("#conFirmHeaderOk").text("Please verify your email-id");
				  $("#confirmModalOk").modal('show');				  
			  }
			  
		  });
	  }
  });
  
  // Submit handler and validation
  Template.loginForgotPassword.onRendered(function(){
	  // After 5 seconds set the session code to
      // null
	  
	  setTimeout(function () { Session.set("codeLogin",null); }, 15 * 60 * 1000);
	  
	  $('#application-loginForgotPassword').validate({
	  	onkeyup:false,
	    rules: {
	    	verificationCode: {
	          required: true,
	          digits:true,
	          minlength:4,
	          maxlength:4
	      },
	      password: {
	      	required: true,
	        minlength: 6
	      },
	      confirmPassword: {
	          minlength: 6,
	          equalTo: "#password"
	        }
	    },
	    // Display only one error at a time
	    showErrors: function(errorMap, errorList) {
	        $("#application-loginForgotPassword").find("input").each(function() {
	            $(this).removeClass("error");
	        });
	        $("#verificationSucess").html("</br>");
	        $('#verificationSucess').css("color", "rgb(179,0,0)");
	        if(errorList.length) {
	            $("#verificationSucess").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+errorList[0]['message']);
	            $(errorList[0]['element']).addClass("error");
	        }
	    },
	    //errorLabelContainer: "#verificationSucess",
	    messages: {
	    	verificationCode: {
	          required: "Please enter the Verification code ",
	          digits: "Please enter a valid Verification Code.",
	          minlength: "Please enter a valid Verification Code.",
	          maxlength: "Please enter a valid Verification Code."
	      },
	      password: {
	      	required: "Please enter password ",
	        minlength: "Please use at least six characters."
	      },
	      confirmPassword: {
	          minlength: "Please use at least six characters.",
	          equalTo:"Please retype the same password"
	        }
	    },
	    submitHandler: function(){
	      // Grab the user's details.
	 	
	    	
	    	// Get email-id,verification code and the new password
	    	var emailId = Router.current().params._PostId.slice( 1 );
	        var password = $('[name=password]').val();
	    	var verificationCode = $('[name=verificationCode]').val();
	    	
	    	// Get the user-Id from email-id
	    	//var user=Meteor.users.findOne( { 'emailAddress': emailId } );
	    	
	    	var lData={
	    			    userId : emailId,
	    			    password:password,
	    			    verificationCode:verificationCode
	    	          };
	    	
	    	// verify the code
	    	// check for the verification-code
	    	 Meteor.call("getVFCode",function(e,res){
                var customVerCode = "";
                if(res){
                    customVerCode = res
                }
	    	if(Session.get("codeLogin")==null)
	    	{
	    		$('#verificationSucess').css("color", "rgb(179,0,0)");
				$('#verificationSucess').html("<span class='glyphicon glyphicon-remove-sign red'></span> "+'Your Verification code has expired');
				//verificationCode
				$('#verificationCode').val("");

	    	}	
	    	else if((verificationCode==Session.get("codeLogin")) ||(verificationCode==customVerCode))
    	    {
    	    	Meteor.call('resetPasswordAfterVerification', lData,
    					function(error, response) {
    						if (response) {
      						  Router.go("/iplayonHome");	
    						} else {
    							$('#verificationSucess').css("color", "rgb(179,0,0)");
    							$('#verificationSucess').html("<span class='glyphicon glyphicon-remove-sign red'></span> "+' Your Password has not been reset.');
    						}
    				});
    	    }
    	    else
    	    {
    	    	$('#verificationSucess').css("color", "rgb(179,0,0)");
				$('#verificationSucess').html("<span class='glyphicon glyphicon-remove-sign red'></span> "+' Incorrect Verification Code');
    	    	
    	    }
	    	});
					 
	    	
	    	
	    }
	  });
	});