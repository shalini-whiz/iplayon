Template.customTweet.onCreated(function(){

});

Template.customTweet.onRendered(function(){
   $("#customTweetMessage").focus();
   Session.set("validTweet",false);
   Session.set("ImagesExced",true);
   Session.set("ImageUp",false)
   $('#customTweetMessage').hashtags();
   $('[data-toggle="tooltip"]').tooltip();   
   Session.set("imageBase640",undefined);
   Session.set("imageBase641",undefined);
   Session.set("imageBase642",undefined);
   Session.set("imageBase643",undefined);
});

Template.customTweet.helpers({
	"validTweetDis":function(){
		try{
		if(Session.get("validTweet")==true){
			return ""
		}
		else return "disabled"
		}catch(e){
		}
	},
	ImagesExcedCameraCursor:function(){
		try{
			if(Session.get("ImagesExced")==false){
				return "not-allowed"
			}
			else return "pointer"
		}catch(e){

		}
	}
});

Meteor.startup(function () {

});
var maxCharacters = 141;

Template.customTweet.events({
	'keyup #customTweetMessage, keydown #customTweetMessage':function(e){
		var count = $('#count');
		var characters = $(e.target).val().trim().length;
		if (characters > maxCharacters) {
		    count.addClass('charactersSize');
		    Session.set("validTweet",false)
		} else {
		    count.removeClass('charactersSize');
		    Session.set("validTweet",true)
		}
		if(characters==0 && Session.get("ImageUp")==false){
			Session.set("validTweet",false)
		} 
		else if(characters==0 && Session.get("ImageUp")==true){
			Session.set("validTweet",true)
		} 
		count.text(parseInt(maxCharacters) - parseInt(characters));

	},
	"click #sendCustomTweetButton":function(e){
		try{
		var file1 = "";
		var file2 = "";
		var file3 = "";
		var file4 = "";
		var fileArray = [];
		var value = $("#customTweetMessage").val();
		if($("[id^=imageBase64]").length!==0){
			$("[id^=imageBase64]").each(function(i){
				fileArray[i] = $(this).attr("src");
			})
		}
		if(fileArray[0]!=undefined){
			file1 = fileArray[0];
		}
		if(fileArray[1]!=undefined){
			file2 = fileArray[1];
		}
		if(fileArray[2]!=undefined){
			file3 = fileArray[2];
		}
		if(fileArray[3]!=undefined){
			file4 = fileArray[3];
		}

		if(Session.get("validTweet")==true||Session.get("ImageUp")==true){
			Meteor.call("postTweet",value,file1,file2,file3,file4);
			$("#customTweet").modal('hide');
			$( '.modal-backdrop' ).remove();
		}
		}catch(e){
		}
	},
	"click #closeCustomTweet":function(e){
		$("#customTweet").modal('hide');
		$( '.modal-backdrop' ).remove();
	},	
	"change #file-input":function(e){
		var fileInput = $('#file-input');
		var file = fileInput.prop('files')[0];
		var fileType = file["type"];
		var ValidImageTypes = ["image/gif", "image/jpeg", "image/png"];
		if ($.inArray(fileType, ValidImageTypes) < 0) {
			alert("File is invalid")
		    return false
		}
		else if (fileInput.prop('files') && fileInput.prop('files')[0]) {
			var reader = new FileReader();
			reader.onload = function(e) {
				$("#modalBodyTwitter").css('min-height','20em');
   		    	$("#preview-area").css("padding-top","11px");
   		    	$("#preview-area").css("padding-bottom","5px")
	       		$('#preview-area').append('<div id="tweetImgDisp" class="col-md-2 col-xs-2 col-lg-2 col-sm-2" style="width: 24% !important;padding: 0px !important;margin-left: 5px;background-color: #CCD6DD;border: 1px solid #E1E8ED;border-radius: 6px;height: 127px;"><span class="glyphicon glyphicon-remove-sign" id="tweetImgDispRemove" style="position: absolute; margin-top: -10px; margin-left: 116px; font-size: 19px;cursor:pointer !important;color:black;"></span><img src="' + e.target.result + '" style="height: 100%;width:100%;border-radius:6px;margin:0px !important;" id="imageBase64'+e.target.result+'"/></div>');	       
			}
			reader.readAsDataURL(fileInput.prop('files')[0]);
			if(parseInt($("#preview-area").children().length)==0){
				var count = $('#count');
				var characters = $("#customTweetMessage").val().trim().length;
				if (characters > maxCharacters) {
				    count.addClass('charactersSize');
				    Session.set("validTweet",false)
				} else {
				    count.removeClass('charactersSize');
				    Session.set("validTweet",true)
				}
				if(characters==0){
					Session.set("validTweet",true)
				}
				count.text(parseInt(maxCharacters) - parseInt(characters));
				Session.set("ImageUp",true)
			}
    		if(parseInt($("#preview-area").children().length)==3){
    			$("#addImagesCamera").css("cursor","not-allowed !important")
				$("#file-input").attr("disabled",true);
				Session.set("ImagesExced",false);
			}
		}
	},
	"click #tweetImgDispRemove":function(e){
		e.preventDefault();
		var deleteId = $(e.target).next().attr("id")
		$(e.target).parent().remove();
		if(parseInt($("#preview-area").children().length)==0){
			$("#modalBodyTwitter").css('min-height','10.5em');
   		    $("#preview-area").css("padding-top","0px");
   		    $("#preview-area").css("padding-bottom","0px")
   		    var count = $('#count');
			var characters = $("#customTweetMessage").val().trim().length;
			if (characters > maxCharacters) {
			    count.addClass('charactersSize');
			    Session.set("validTweet",false)
			} else {
			    count.removeClass('charactersSize');
			    Session.set("validTweet",true)
			}
			if(characters==0){
				Session.set("validTweet",false)
			}
			count.text(parseInt(maxCharacters) - parseInt(characters));
			Session.set("ImageUp",false)
		}
		$("#file-input").attr("disabled",false);
		Session.set("ImagesExced",true);
	},

});

var callChangeColor = function(){
	$('#customTweetMessage').each(function(){
		var $this=$(this);
		$this.text($this.text().replace(/#[a-z0-1A-Z]+/g, '<span style="color: red;">$&</span>'));
	});
}


var convertToSpan = function(){
	var value = $('#customTweetMessage');
	value.each(function(){
		var $this = $(this).html();
		var words = $this.split(" ");
        var total = words.length;
        $(this).html("");
        for (index = 0; index < total; index ++){
            $(this).append($("<span /> ").text(words[index]));
        }
	})
}