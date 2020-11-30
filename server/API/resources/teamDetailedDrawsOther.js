Router.route( '/dev/fetchOrganizerTeamFormats', function() {
  this.response.setHeader( 'Access-Control-Allow-Origin', '*' );
  if ( this.request.method === "OPTIONS" ) {
    this.response.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
    this.response.setHeader( 'Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS' );
    this.response.end( 'Set OPTIONS.' );
  } else {
    API.handleRequest( this, 'fetchOrganizerTeamFormats', this.request.method );
  }
}, { where: 'server' } );

Router.route( '/dev/createTeamsFormatByOrganizer', function() {
  this.response.setHeader( 'Access-Control-Allow-Origin', '*' );
  if ( this.request.method === "OPTIONS" ) {
    this.response.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
    this.response.setHeader( 'Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS' );
    this.response.end( 'Set OPTIONS.' );
  } else {
    API.handleRequest( this, 'createTeamsFormatByOrganizer', this.request.method );
  }
}, { where: 'server' } );

Router.route( '/dev/selectedTeamFormatIdDetails', function() {
  this.response.setHeader( 'Access-Control-Allow-Origin', '*' );
  if ( this.request.method === "OPTIONS" ) {
    this.response.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
    this.response.setHeader( 'Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS' );
    this.response.end( 'Set OPTIONS.' );
  } else {
    API.handleRequest( this, 'selectedTeamFormatIdDetails', this.request.method );
  }
}, { where: 'server' } );

Router.route( '/dev/initTeamMatchRecords', function() {
  this.response.setHeader( 'Access-Control-Allow-Origin', '*' );
  if ( this.request.method === "OPTIONS" ) {
    this.response.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
    this.response.setHeader( 'Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS' );
    this.response.end( 'Set OPTIONS.' );
  } else {
    API.handleRequest( this, 'initTeamMatchRecords', this.request.method );
  }
}, { where: 'server' } );

Router.route( '/dev/getMatchRecordsAfterCreate', function() {
  this.response.setHeader( 'Access-Control-Allow-Origin', '*' );
  if ( this.request.method === "OPTIONS" ) {
    this.response.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
    this.response.setHeader( 'Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS' );
    this.response.end( 'Set OPTIONS.' );
  } else {
    API.handleRequest( this, 'getMatchRecordsAfterCreate', this.request.method );
  }
}, { where: 'server' } );

Router.route( '/dev/getTeamDetailedDrawsForToss', function() {
  this.response.setHeader( 'Access-Control-Allow-Origin', '*' );
  if ( this.request.method === "OPTIONS" ) {
    this.response.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
    this.response.setHeader( 'Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS' );
    this.response.end( 'Set OPTIONS.' );
  } else {
    API.handleRequest( this, 'getTeamDetailedDrawsForToss', this.request.method );
  }
}, { where: 'server' } );

Router.route( '/dev/getTeamDetailsForToss', function() {
  this.response.setHeader( 'Access-Control-Allow-Origin', '*' );
  if ( this.request.method === "OPTIONS" ) {
    this.response.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
    this.response.setHeader( 'Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS' );
    this.response.end( 'Set OPTIONS.' );
  } else {
    API.handleRequest( this, 'getTeamDetailsForToss', this.request.method );
  }
}, { where: 'server' } );

