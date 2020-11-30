schoolDetails.allow({
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

schoolDetails.deny({
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

schoolEventsToFind.allow({
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

schoolEventsToFind.deny({
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


schoolPlayerEntries.allow({
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

schoolPlayerEntries.deny({
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


schoolPlayerTeamEntries.allow({
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

schoolPlayerTeamEntries.deny({
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

schoolPlayers.allow({
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

schoolPlayers.deny({
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

schoolTeams.allow({
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

schoolTeams.deny({
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

playerTeams.allow({
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

playerTeams.deny({
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

playerTeamEntries.allow({
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

playerTeamEntries.deny({
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

events.allow({
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

events.deny({
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

pastEvents.allow({
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

pastEvents.deny({
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

myPastEvents.allow({
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

myPastEvents.deny({
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

myUpcomingEvents.allow({
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

myUpcomingEvents.deny({
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

insertedUsersCount.allow({
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

insertedUsersCount.deny({
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