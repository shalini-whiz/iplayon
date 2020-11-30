/******************* commision form ***********************/
Template.commissionForm.onCreated(function(){

})

Template.commissionForm.helpers({
	"getCurrentCommision":function(){
		try{
			var entry  = lastInsertedAffId.findOne({ "assocId" : "Commission"});
			if(entry)
			{
				Session.set("currentCommission",entry.lastInsertedId);
				
				return entry.lastInsertedId;
			}
		}catch(e)
		{

		}

	}
})

Template.commissionForm.events({
	"click #editCommission":function(e){
        e.preventDefault();
		$("#editCommissionForm").empty();
		 Blaze.render(Template.editCommissionTemplate, $("#editCommissionForm")[0]);
        $("#editCommissionTemplate").modal({
            backdrop: 'static'
        });


	}
})


Template.editCommissionTemplate.onCreated(function(){

})

Template.editCommissionTemplate.helpers({
	
	"fetchCurrentCommission":function()
	{
		//var taxEntry  = taxDetails.findOne({});
		//if(taxEntry)
			//return taxEntry

		if(Session.get("currentCommission") != undefined)
			return Session.get("currentCommission")
	}
})

Template.editCommissionTemplate.events({
	"click #commissionSubmit":function(){

		var taxData = $("#newCommission").val();
		

		if(taxData.trim().length > 0)
		{

			Meteor.call("setCommission",taxData,function(error,result)
			{
				if(result)
				{
					displayMessage("Commission is been set!!");
					$('#editCommissionTemplate').modal('hide');
					$("#editCommissionForm").empty();


				}
				else
					displayMessage("Could not set commission")
			})
		}
			
		
		else
		{
			displayMessage("Please enter commission");
		}

	},
	 "keyup #newCommission": function(event) {
        var key = window.event ? event.keyCode : event.which;
         if (key != 46 && key > 31 
            && (key < 48 || key > 57))
             return false;
         return true;
    }
})





/**************************ends here ***********************/