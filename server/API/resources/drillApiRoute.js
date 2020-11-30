Router.route( '/dev/upsertDrill', function() {
  this.response.setHeader( 'Access-Control-Allow-Origin', '*' );
  if ( this.request.method === "OPTIONS" ) {
    this.response.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
    this.response.setHeader( 'Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS' );
    this.response.end( 'Set OPTIONS.' );
  } else {
    API.handleRequest( this, 'upsertDrill', this.request.method );
  }
}, { where: 'server' } );

Router.route( '/dev/removeDrill', function() {
  this.response.setHeader( 'Access-Control-Allow-Origin', '*' );
  if ( this.request.method === "OPTIONS" ) {
    this.response.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
    this.response.setHeader( 'Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS' );
    this.response.end( 'Set OPTIONS.' );
  } else {
    API.handleRequest( this, 'removeDrill', this.request.method );
  }
}, { where: 'server' } );

Router.route( '/dev/fetchDrill', function() {
  this.response.setHeader( 'Access-Control-Allow-Origin', '*' );
  if ( this.request.method === "OPTIONS" ) {
    this.response.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
    this.response.setHeader( 'Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS' );
    this.response.end( 'Set OPTIONS.' );
  } else {
    API.handleRequest( this, 'fetchDrill', this.request.method );
  }
}, { where: 'server' } );


Router.route( '/dev/dataToAssignDrill', function() {
  this.response.setHeader( 'Access-Control-Allow-Origin', '*' );
  if ( this.request.method === "OPTIONS" ) {
    this.response.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
    this.response.setHeader( 'Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS' );
    this.response.end( 'Set OPTIONS.' );
  } else {
    API.handleRequest( this, 'dataToAssignDrill', this.request.method );
  }
}, { where: 'server' } );


Router.route( '/dev/assignDrill', function() {
  this.response.setHeader( 'Access-Control-Allow-Origin', '*' );
  if ( this.request.method === "OPTIONS" ) {
    this.response.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
    this.response.setHeader( 'Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS' );
    this.response.end( 'Set OPTIONS.' );
  } else {
    API.handleRequest( this, 'assignDrill', this.request.method );
  }
}, { where: 'server' } );

Router.route( '/dev/getDrillTypes', function() {
  this.response.setHeader( 'Access-Control-Allow-Origin', '*' );
  if ( this.request.method === "OPTIONS" ) {
    this.response.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
    this.response.setHeader( 'Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS' );
    this.response.end( 'Set OPTIONS.' );
  } else {
    API.handleRequest( this, 'getDrillTypes', this.request.method );
  }
}, { where: 'server' } );

Router.route( '/dev/dataToAnalyze', function() {
  this.response.setHeader( 'Access-Control-Allow-Origin', '*' );
  if ( this.request.method === "OPTIONS" ) {
    this.response.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
    this.response.setHeader( 'Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS' );
    this.response.end( 'Set OPTIONS.' );
  } else {
    API.handleRequest( this, 'dataToAnalyze', this.request.method );
  }
}, { where: 'server' } );

Router.route( '/dev/saveDataToAnalyze', function() {
  this.response.setHeader( 'Access-Control-Allow-Origin', '*' );
  if ( this.request.method === "OPTIONS" ) {
    this.response.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
    this.response.setHeader( 'Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS' );
    this.response.end( 'Set OPTIONS.' );
  } else {
    API.handleRequest( this, 'saveDataToAnalyze', this.request.method );
  }
}, { where: 'server' } );

Router.route( '/dev/fetchAnalyzedPlayers', function() {
  this.response.setHeader( 'Access-Control-Allow-Origin', '*' );
  if ( this.request.method === "OPTIONS" ) {
    this.response.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
    this.response.setHeader( 'Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS' );
    this.response.end( 'Set OPTIONS.' );
  } else {
    API.handleRequest( this, 'fetchAnalyzedPlayers', this.request.method );
  }
}, { where: 'server' } );

Router.route( '/dev/fetchAnalyzedDataForGivenPlayer', function() {
  this.response.setHeader( 'Access-Control-Allow-Origin', '*' );
  if ( this.request.method === "OPTIONS" ) {
    this.response.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
    this.response.setHeader( 'Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS' );
    this.response.end( 'Set OPTIONS.' );
  } else {
    API.handleRequest( this, 'fetchAnalyzedDataForGivenPlayer', this.request.method );
  }
}, { where: 'server' } );

Router.route( '/dev/saveTtData', function() {
  this.response.setHeader( 'Access-Control-Allow-Origin', '*' );
  if ( this.request.method === "OPTIONS" ) {
    this.response.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
    this.response.setHeader( 'Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS' );
    this.response.end( 'Set OPTIONS.' );
  } else {
    API.handleRequest( this, 'saveTtData', this.request.method );
  }
}, { where: 'server' } );