eventUploads = new FS.Collection('eventUploads',{
	stores:[new FS.Store.FileSystem('eventUploads', {path: "eventUploads"})],
});

eventUploads.allow({
	insert:function(){
		return true;
	},
	update:function(){
		return true;
	},
	remove:function(){
		return true;
	},
	download:function(){
	    return true;
	  }
})
