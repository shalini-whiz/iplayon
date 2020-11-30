/*
* Allow
*/

users.allow({
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

/*
* Deny
*/

users.deny({
  insert: function(){
    // Deny user inserts on the client by default.
    return false;
  },
  update: function(){
    // Deny user updates on the client by default.
    return false;
  },
  remove: function(){
    // Deny user removes on the client by default.
    return false;
  }
});

/*
* Allow
*/

apiUsers.allow({
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

/*
* Deny
*/

apiUsers.deny({
  insert: function(){
    // Deny user inserts on the client by default.
    return false;
  },
  update: function(){
    // Deny user updates on the client by default.
    return false;
  },
  remove: function(){
    // Deny user removes on the client by default.
    return false;
  }
});