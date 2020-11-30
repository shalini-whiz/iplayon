
Template.moveToPastEvents.onRendered(function(){

});

Template.moveToPastEvents.onCreated(function(){

})

Template.moveToPastEvents.helpers({
	"notAdmin":function(){
		try{
			var emailAddress = Meteor.user().emails[0].address;
			var boolVal = false
			var auth = authAddress.find({}).fetch();
			if(auth){
				for(var i=0;i<auth.length;i++){
					if(emailAddress&&emailAddress==auth[i].data){
						boolVal=false;
					}
					else{
						boolVal=true;
						break;
					}
				};
			}
			return boolVal
		}catch(e){
		}
	},
});

Template.moveToPastEvents.events({
	"click #moveToPastEventsOk":function(e){
		e.preventDefault();
		//var tournamentID = $("#tournamentIdValue").val().trim();
		Meteor.call("moveTomyPastEventsMethod",function(e,res){
			if(e){}
			else{
				JSONToCSVConvertorTocopyevents(res, "", true,"")
			}
		});
	}
});

function JSONToCSVConvertorTocopyevents(JSONData, ReportTitle, ShowLabel,filNam) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    
   // CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = '"' +"Sl.No"+'",';
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row +=  '"' +index + '",';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    var s=0
    for (var i = 0; i < arrData.length; i++) {
    	s=s+1;
        var row = s+",";
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
        	if(typeof arrData[i][index]=="string")
            row +='"' + arrData[i][index] + '",';
        	else{
            row += arrData[i][index]+","
        	
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
    var fileName = filNam+"COPIEDEVENTS";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");   
    
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