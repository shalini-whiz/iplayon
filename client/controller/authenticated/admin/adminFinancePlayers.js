Template.adminFinancePlayers.onCreated(function(){
	this.subscribe("allEvents")
});

Template.adminFinancePlayers.onRendered(function(){
	Session.set("selectedTournament",undefined)
	Session.set("selectedEvent",undefined);
});

Template.adminFinancePlayers.helpers({
	eventListSelect:function(){
		var eventList = events.find({"tournamentEvent":true}).fetch()
		return eventList;
	},
	eventCategoriesSelect:function(){
		if(Session.get("selectedTournament")){
			var eventList=events.find({"tournamentEvent":false,"tournamentId":Session.get("selectedTournament")}).fetch();
			return eventList
		}
	}
});

Template.adminFinancePlayers.events({
	"change #manageEventType1":function(e){
		e.preventDefault();
		Session.set("selectedTournament",$("#manageEventType1").val());
	},
	'change #manageEventType2':function(e){
		e.preventDefault();
		Session.set("selectedEvent",$("#manageEventType2").val());
	},
	'click #setFinancials':function(e){
		e.preventDefault()
		Meteor.call("adminSetFinancials",Session.get("selectedTournament"),Session.get("selectedEvent"),function(e,r){
			if(e){
				alert(e)
			}
			else {
				try{
				var eve = events.findOne({"_id":Session.get("selectedEvent")})
				JSONToCSVConvertorUsersSetByAdmin(r, "", true, eve.abbName+"_"+"result");
				}catch(e){
					alert(e)
				}
			}
		})
	}
})

function JSONToCSVConvertorUsersSetByAdmin(JSONData, ReportTitle, ShowLabel, filNam) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var CSV = '';
    //Set Report title in first row or line

    // CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = '"' + "Sl.No" + '",';

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {

            //Now convert each value to string and comma-seprated
            row += '"' + index + '",';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    var s = 0
    for (var i = 0; i < arrData.length; i++) {
        s = s + 1;
        var row = s + ",";
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            if (typeof arrData[i][index] == "string")
                row += '"' + arrData[i][index] + '",';
            else {
                row += arrData[i][index] + ","

            }
        }

        row = row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    //Generate a file name
    var fileName = filNam + "";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g, "_");

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}