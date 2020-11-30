
Template.myServices.onCreated(function(){
	Session.set("viewPackID",undefined);

	this.subscribe("myPublishedPackages");
	this.subscribe("myAccountDetailsPub");

})

function loadFunction()
{
	$('#example').DataTable( {
		  	"paging": false,
            "sPaginationType": "bs_four_button",
            "lengthChange": false,
            "searching": false,
            "bDestroy": true,
            "info": false
    });
}

Template.myServices.onRendered(function(){
	
	this.autorun(() => { 
       // loadFunction();
    })

})


Template.myServices.helpers({

	"myServicePack":function()
	{
		try{	
			var packList = articlesOfPublisher.find({"type":"Packs", "userId" : Meteor.userId()}).fetch();
			if(packList.length > 0)
			{
				return packList;
			}
				
			else
				return [];
	    }catch(e){
	    }
	}

})

Template.myServices.events({

	"click #createPack":function(e)
	{

		var accountInfo = accountDetails.findOne({"userId":Meteor.userId()});
        if(accountInfo)
        {
        	$("#createMyPackDiv").empty();
			$("#viewMyServiceDiv").empty();
			$("#editMyServiceDiv").empty();

			Blaze.render(Template.createMyPack, $("#createMyPackDiv")[0]);
			$("#createMyPack").modal({
				backdrop: 'static',
				keyboard: false
			});
        }
        else
        {
        	displayMessage("Please fill your account details to create packs!!")
        }

		
	},
	"click #viewPack":function(e)
	{
		Session.set("viewPackID",this._id);
		$("#viewMyServiceDiv").empty();
		$("#editMyServiceDiv").empty();

		Blaze.render(Template.viewMyService, $("#viewMyServiceDiv")[0]);
		$("#viewMyService").modal({
			backdrop: 'static',
			keyboard: false
		});

	},
	"click #editPack":function(e){
		Session.set("viewPackID",this._id);
		$("#viewMyServiceDiv").empty();
		$("#editMyServiceDiv").empty();
		Blaze.render(Template.editMyService, $("#editMyServiceDiv")[0]);
		$("#editMyService").modal({
			backdrop: 'static',
			keyboard: false
		});
	}
})