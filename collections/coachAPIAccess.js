

connectionRequests.allow({
  insert: function(){
    // Disallow user inserts on the client by default.
    return true;
  },
  update: function(){
    // Disallow user updates on the client by default.
    return true;
  },
  remove: function(){
    // Disallow user removes on the client by default.
    return true;
  }
});

connectionRequests.deny({
  insert: function(){
    // Disallow user inserts on the client by default.
    return false;
  },
  update: function(){
    // Disallow user updates on the client by default.
    return false;
  },
  remove: function(){
    // Disallow user removes on the client by default.
    return false;
  }
});




coachAPPINSentBOX.allow({
  insert: function(){
    // Disallow user inserts on the client by default.
    return true;
  },
  update: function(){
    // Disallow user updates on the client by default.
    return true;
  },
  remove: function(){
    // Disallow user removes on the client by default.
    return true;
  }
});

coachAPPINSentBOX.deny({
  insert: function(){
    // Disallow user inserts on the client by default.
    return false;
  },
  update: function(){
    // Disallow user updates on the client by default.
    return false;
  },
  remove: function(){
    // Disallow user removes on the client by default.
    return false;
  }
});


workAssignments.allow({
  insert: function(){
    // Disallow user inserts on the client by default.
    return true;
  },
  update: function(){
    // Disallow user updates on the client by default.
    return true;
  },
  remove: function(){
    // Disallow user removes on the client by default.
    return true;
  }
});

workAssignments.deny({
  insert: function(){
    // Disallow user inserts on the client by default.
    return false;
  },
  update: function(){
    // Disallow user updates on the client by default.
    return false;
  },
  remove: function(){
    // Disallow user removes on the client by default.
    return false;
  }
});

coachConnectedGroups.allow({
  insert: function(){
    // Disallow user inserts on the client by default.
    return true;
  },
  update: function(){
    // Disallow user updates on the client by default.
    return true;
  },
  remove: function(){
    // Disallow user removes on the client by default.
    return true;
  }
});

coachConnectedGroups.deny({
  insert: function(){
    // Disallow user inserts on the client by default.
    return false;
  },
  update: function(){
    // Disallow user updates on the client by default.
    return false;
  },
  remove: function(){
    // Disallow user removes on the client by default.
    return false;
  }
});
