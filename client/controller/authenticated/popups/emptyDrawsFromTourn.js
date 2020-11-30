Template.emptyDrawsFromTourn.onCreated(function(){

});

Template.emptyDrawsFromTourn.onRendered(function(){
	
});

Template.emptyDrawsFromTourn.helpers({

});

Template.emptyDrawsFromTourn.events({
	"keyup #entries_EMP":function(event){
		$('#setForErrors2').html("")
		 	var key = window.event ? event.keyCode : event.which;

		    if (event.keyCode === 8 || event.keyCode === 46
		        || event.keyCode === 37 || event.keyCode === 39) {
		        return true;
		    }
		    else if ( key < 48 || key > 57 ) {
		        return false;
		    }
		    else return true;
	},
	"click #DownloadEmptyDraws":function(e){
		e.preventDefault();
		if($("#entries_EMP").val().trim().length==0){
			$('#setForErrors2').css("color", "rgb(179,0,0)");
	            $("#setForErrors2").html("<span class='glyphicon glyphicon-remove-sign red'></span> "+"Required Number of Entries");
		}
		else{
		    var numPlayers = $("#entries_EMP").val();
			  var gPlayerVec = [];
		    gPlayerVec = computeBrackets(numPlayers);
		    show(gPlayerVec);
		}
	}
});


var BOTTOM = 0;
var TOP 	 = 1;

var Player = {
	mRank: 0, 
	mAt: 0
};
// var gPlayerVec = [];

function show(gPlayerVec) {
	var arrayToDown = []
	for(var i=0; i<gPlayerVec.length; i++) {
		var data = {
			"Rank":gPlayerVec[i].mRank
		}
		arrayToDown.push(data)
	}
	if(arrayToDown.length!=0){
		JSONToCSVConvertor_Download_Empty(arrayToDown, "", true,"Empty_Draws")
	}
}

function getIndexOf(gPlayerVec, lRank) {
  for(var i=0; i < gPlayerVec.length; i++) {
  	if (gPlayerVec[i].mRank == lRank) {
  		return i;
  	}
  }
  return -1;
}


function  splitVec(lPlayerVec) {
	var gPlayerVec = lPlayerVec;
  if(gPlayerVec.length == 0) {
  	var p = {}; // {mRank: 1, mAt: TOP};
  	p.mRank = 1;
  	p.mAt = TOP;
  	gPlayerVec.push(p);
  	return gPlayerVec;
  } // set 'gPlayerVec' vector

  var LOOP_COUNT = gPlayerVec.length;
  // loop 'gPlayerVec'
  for(var i=0, counter=0; counter<LOOP_COUNT; i+=2, counter++) {
    if(i>=gPlayerVec.length) break;
    // if(gPlayerVec[i].mAt==TOP) insert at 'i+1' else at 'i-1'
    var p = {};
    p.mRank = 0;
    if(gPlayerVec[i].mAt==TOP) {
    	p.mAt = BOTTOM;
    	gPlayerVec.splice(i+1, 0, p);
    }
    else {
    	p.mAt = TOP;
    	gPlayerVec.splice(i, 0, p);
    }
  }
  return gPlayerVec;
}

function insert(lPlayerVec, playerCount) {
  var gPlayerVec = lPlayerVec;
  var curMax = 0;
  if(gPlayerVec.length % 2 == 0) {
   curMax = gPlayerVec.length / 2;
  } 
  else {
   curMax = (gPlayerVec.length-1) / 2;
  }
  var curMax_i = getIndexOf(gPlayerVec, curMax);
  if(curMax_i==-1) {
  	return gPlayerVec;
  }

  // initialise 'next' variables
  var next   = 0;
  next = curMax;
  var next_i = 0;

  // repeat for every new entries
  while(next < playerCount) {
    var nextPos = (gPlayerVec[curMax_i].mAt==TOP)?BOTTOM:TOP;
    next = next+1; // next Rank
    next_i = (nextPos == TOP) ? (curMax_i-1) : (curMax_i+1);

    gPlayerVec[next_i].mRank = next;
    gPlayerVec[next_i].mAt = nextPos; // set rank & position

    curMax--;
    curMax_i = getIndexOf(gPlayerVec, curMax);
    if(curMax_i==-1) {
    	return gPlayerVec;
    }
  }
  return gPlayerVec;
}

function computeBrackets (numPlayers) {
	var gPlayerVec = [];
	while(gPlayerVec.length < numPlayers) {
		var lPlayerVec = splitVec(gPlayerVec);
		gPlayerVec = insert(lPlayerVec, numPlayers);
	}
  return gPlayerVec;
}


function JSONToCSVConvertor_Download_Empty(JSONData, ReportTitle, ShowLabel,filNam) {
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
        displayMessage("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = filNam+"_Template";
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

