Template.playerSequenceMain.onCreated(function(){

});

Template.playerSequenceMain.onRendered(function(){
	Session.set("templateRenderedType",undefined)
});

Template.playerSequenceMain.helpers({
	backGroundColor:function(){
		if(Session.get("templateRenderedType")==1){
			return "white";
		}
	},
	heightOfNavBar:function(){
		if(Session.get("templateRenderedType")==1){
			return "117px !important;";
		}
	}
});

Template.playerSequenceMain.events({
	"click #hoverPLayerAnalyticsRecord":function(){
		$("#conFirmHeaderOk").text("This feature is not enabled in this version");
        $("#confirmOkDelete").modal({
            backdrop: 'static',
            keyboard: false
        });
        return false;
		/*$("#templRenderOnFunction").empty();
		$("#templRenderOnFunctionSub").empty()
        Blaze.render(Template.playerSequenceCreate,$("#templRenderOnFunction")[0]);
        Blaze.render(Template.playerSequenceCreateSub,$("#templRenderOnFunctionSub")[0]);
        Session.set("templateRenderedType",1)
        $("#hoverPLayerAnalyticsRecord").css("text-decoration","underline");
		$("#hoverPLayerAnalyticsRecord").css("color","#585858");
		$("#hoverPLayerAnalyticsAnalyze").css("text-decoration","none");
		$("#hoverPLayerAnalyticsAnalyze").css("color","white");
		$("#hoverPLayerAnalyticsReview").css("text-decoration","none");
		$("#hoverPLayerAnalyticsReview").css("color","white");*/
	},
	"click #hoverPLayerAnalyticsAnalyze":function(e){
		e.preventDefault();
		$("#templRenderOnFunction").empty();
		$("#templRenderOnFunctionSub").empty()
        Blaze.render(Template.playerSequenceAnalyze,$("#templRenderOnFunction")[0]);
        Blaze.render(Template.playerSequenceAnalyzeSub,$("#templRenderOnFunctionSub")[0]);
        $("#renderSequenceTypes").empty();
        Blaze.render(Template.playerSequenceErrors,$("#renderSequenceTypes")[0]);
        Session.set("templateRenderedType",1)
        $("#hoverPLayerAnalyticsAnalyze").css("text-decoration","underline");
		$("#hoverPLayerAnalyticsAnalyze").css("color","#585858");
		$("#hoverPLayerAnalyticsRecord").css("text-decoration","none");
		$("#hoverPLayerAnalyticsRecord").css("color","white");
		$("#hoverPLayerAnalyticsReview").css("text-decoration","none");
		$("#hoverPLayerAnalyticsReview").css("color","white");
	},
	"click #hoverPLayerAnalyticsReview":function(){
		$("#conFirmHeaderOk").text("This feature is not enabled in this version");
        $("#confirmOkDelete").modal({
            backdrop: 'static',
            keyboard: false
        });
        return false;
    }
})