Template.changePassword.onCreated(function(){

});

Template.changePassword.onRendered(function(){
	$('#application-changePassword').validate({
	  	onkeyup:false,
	    rules: {
	    	oldPassword: {
	          required: true,
	          minlength:6,
	      },
	      newPassword: {
	      	required: true,
	        minlength: 6
	      },
	      confirmPassword: {
	          minlength: 6,
	          equalTo: "#newPassword"
	        }
	    },
	    // Display only one error at a time
	    showErrors: function(errorMap, errorList) {
	        $("#application-changePassword").find("input").each(function() {
	            $(this).removeClass("error");
	        });
	        if(errorList.length) {
	            $("#changePasswordError").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+errorList[0]['message']);
	            $(errorList[0]['element']).addClass("error");
	        }
	    },
	    messages: {
	    	oldPassword: {
	          required: "Please enter the current password ",
	          minlength: "Please enter a valid current password.",
	      },
	      newPassword: {
	      	required: "Please enter new password ",
	        minlength: "Please use at least six characters."
	      },
	      confirmPassword: {
	          minlength: "Please use at least six characters.",
	          equalTo:"Please retype the same password"
	        }
	    },
	    submitHandler: function(){
	    	$("#changePasswordError").html("");

	    	var digest = Package.sha.SHA256($('#oldPassword').val());
	    	Meteor.call('checkPassword', digest, function(err, result) {
		      if (result.error==null) {
		      	if($('#newPassword').val()==$('#oldPassword').val()){
		        	$("#changePasswordError").html("<span class='glyphicon glyphicon-exclamation-sign red'></span> "+"New password is same as current password");
		    	}
		    	else{
			      	Accounts.changePassword($("#oldPassword").val(), $("#newPassword").val(), function(error) {
					    if (error) {
					        $("#changePasswordError").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+error.reason);
					    } else {
	    					$("#changePasswordSucc").html("<span class='glyphicon glyphicon-ok green'></span> "+"Password changed");
					    	$("#oldPassword").val("")
					    	$("#newPassword").val("")
					    	$("#confirmPassword").val("");
					    	$("#changePasswordSubmit").val("Re-Change");
					    }
					})
			    }
		      }
		      else{
				$("#changePasswordError").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+result.error.reason);
		      }
		    });
	    	/*var lData={
	    		oldPassword:$("#oldPassword").val(),
	    		newPassword:$("#newPassword").val()
	    	}
			Accounts.changePassword($("#oldPassword").val(), $("#newPassword").val(), function(error) {
			    if (error) {
			        $("#changePasswordError").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+error.reason);
			    } else {
			    }
			});*/
	    }
	  });
});

Template.changePassword.events({
	'submit form': function(e) {
		e.preventDefault();
		$("#changePasswordSucc").html("")
	},
	'focus #oldPassword':function(e){
		$("#changePasswordSucc").html("")
	},
	'focus #newPassword':function(e){
		$("#changePasswordSucc").html("")
	},
	'focus #confirmPassword':function(e){
		$("#changePasswordSucc").html("")
	}
});
