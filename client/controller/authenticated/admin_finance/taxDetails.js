/*********************** tax ******************************/
Template.taxForm.onCreated(function(){

})

Template.taxForm.helpers({
	"getCurrentTax":function(){
		try{
			var taxEntry  = taxDetails.findOne({});
			if(taxEntry)
			{
				Session.set("currentTax",taxEntry.taxRate);
				Session.set("currentCGST",taxEntry.cgst);
				Session.set("currentSGST",taxEntry.sgst);
				return taxEntry.taxRate;
			}

			/*
			var taxEntry = lastInsertedAffId.findOne({"assocId" : "Tax"})
			if(taxEntry && taxEntry.lastInsertedId)
			{
				Session.set("currentTax",taxEntry.lastInsertedId);

				return taxEntry.lastInsertedId;
			}*/
		}catch(e)
		{

		}

	}
})

Template.taxForm.events({
	"click #editTax":function(e){
        e.preventDefault();
		$("#editTaxForm").empty();
		 Blaze.render(Template.editTaxTemplate, $("#editTaxForm")[0]);
        $("#editTaxTemplate").modal({
            backdrop: 'static'
        });


	}
})


Template.editTaxTemplate.onCreated(function(){

})

Template.editTaxTemplate.helpers({
	
	"fetchCurrentTax":function()
	{
		var taxEntry  = taxDetails.findOne({});
		if(taxEntry)
			return taxEntry

		//if(Session.get("currentTax") != undefined)
			//return Session.get("currentTax")
	}
})

Template.editTaxTemplate.events({
	"click #taxSubmit":function(){

		var taxData = $("#newTax").val();
		var cgstData = $("#newCgst").val();
		var sgstData = $("#newSgst").val();

		if(taxData.trim().length > 0 && cgstData.trim().length > 0 && sgstData.trim().length > 0)
		{	
			var totSub = parseFloat(cgstData) + parseFloat(sgstData)

			if(parseFloat(cgstData) + parseFloat(sgstData) == parseFloat(taxData))
			{

				Meteor.call("setTax",taxData,cgstData,sgstData,function(error,result)
				{
					if(result)
					{
						displayMessage("Tax is been set!!");
						$('#editTaxTemplate').modal('hide');
						$("#editTaxForm").empty();


					}
					else
						displayMessage("Could not set tax")
				})
			}
			else
			{
				displayMessage("Please enter valid cgst and sgst taxes");
			}
		}
		else
		{
			displayMessage("Please enter tax");
		}

	},
	 "keyup #newTax": function(event) {
        var key = window.event ? event.keyCode : event.which;
         if (key != 46 && key > 31 
            && (key < 48 || key > 57))
             return false;
         return true;
    }
})

