

// Collection for Team uploads
teamUploads = new FS.Collection('teamUploads',{
	stores:[new FS.Store.FileSystem('teamUploads', {path: "teamUploads"})],
});

/*teamUploads.allow({
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
});*/
