//Template helpers, events for meteor register
//Template is register.html
/**
 * @Author : Vinayashree
 */

/**
 * client side subscription to the server side publications
 * @SubscribeName: users (used to subscribe to users)
 *                 to get the list of users.
 *                 
 *                 
 */
/**Template.register.onCreated(function() {
	this.subscribe("users");
});**/

Template.meteorLogin.onCreated(function() {
	this.subscribe("onlyLoggedIn");
});

/**
 * Validation for meteor register form id application-signup
 * if validation is successful submitHandler calls
 * the meteor method updateMeteorUserLogin to insert user
 * and update user fields
 */
/**Template.register.onRendered(function(){
  $('#application-signup').validate({
    rules: {
      emailAddress: {
        required: true,
        email: true
      },
      password: {
        minlength: 6
      },
      retypePassword: {
          minlength: 6,
          equalTo: "#password"
        }
    },
    messages: {
      emailAddress: {
        required: "Please enter your email address to sign up.",
        email: "Please enter a valid email address."
      },
      password: {
        minlength: "Please use at least six characters."
      },
      retypePassword: {
          minlength: "Please use at least six characters.",
          equalTo:"Please retype the same password"
        }
    },
    submitHandler: function(){
      // Grab the user's details.
 		var email = $('[name=emailAddress]').val();
        var password = $('[name=password]').val();
    	var userName = $('[name=emailAddress]').val();

    	var s = Accounts.createUser({
    		email: email,
       	 	password: password,
       	 	userName:userName
    	}, function(err) {
			  if (err)
			  {
               $("#conFirmHeaderOk").text("Error :" +err.reason);
			   $("#confirmModalOk").modal('show');
			  }
			  else{
			  	 var newUserId = Meteor.userId();
			  	  Meteor.call("updateMeteorUserLogin",newUserId,function(err,response){
			  	 	if(response){
			  	 	
			  	 	}
			  	 	else{
			  	 		$("#conFirmHeaderOk").text("Error :" +err.reason);
						$("#confirmModalOk").modal('show');
			  	 	}
			  	 })
			}
		});

    }
  });
});**/


/**Template.register.events({
  'submit form': function(e){
    // Prevent form from submitting.
    e.preventDefault();
  },
  
  
  'click .redFont':function(e){
    e.preventDefault();
    $('#application-signup').css('display','none !important');

    Router.go("/login")
  }

});**/