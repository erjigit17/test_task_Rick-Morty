const fs = require( 'fs' ),
    es = require( 'event-stream' ),
    parse = require( "csv-parse" ),
    iconv = require( 'iconv-lite' );
const pgp = require( 'pg-promise' )( {
    capSQL: true
} );


// const client = {
//   connectionString: 'postgres://ubbmdkfcbfgkfn:89fbe24d9cf50335a0667757d318797cebda6f1d6c2904560a8431aeb9f0040d@ec2-54-75-248-49.eu-west-1.compute.amazonaws.com:5432/ddbimqs3ehvtug',
//   ssl: {
//       rejectUnauthorized: false
//   }
// }

const client = {
host: '127.0.0.1',
  port: 5432,
  database: 'erjigit',
  user: 'erjigit',
  password: '',
}

class CSVReader {
  constructor ( filename, batchSize, columns ) {
      this.reader = fs.createReadStream( filename ).pipe( iconv.decodeStream( 'utf8' ) )
      this.batchSize = batchSize || 1000
      this.lineNumber = 0
      this.data = []
      this.parseOptions = { delimiter: ',', columns: true, escape: '/', relax: true }
  }

  read( callback ) {
      this.reader
          .pipe( es.split() )
          .pipe( es.mapSync( line => {
              ++this.lineNumber

              parse( line, this.parseOptions, ( err, d ) => {
                  console.log( line )
              } )

              if ( this.lineNumber % this.batchSize === 0 )
              {
                  callback( this.data )
              }
          } )
              .on( 'error', function () {
                  console.log( 'Error while reading file.' )
              } )
              .on( 'end', function () {
                  console.log( 'Read entirefile.' )
              } ) )
  }

  continue() {
      this.data = []
      this.reader.resume()
  }
}


let intializeDBAndInsert = () => {
  const db = pgp( client );
  let sco;

  db.connect()
      .then( obj => {
          sco = obj;
          let reader = new CSVReader( './data.csv' )
          reader.read( () => reader.continue() )
      } )
      .then( data => {
          // success
          console.log( data )
      } )
      .catch( error => {
          // error
          console.log( error )
      } )
      .finally( () => {
          // release the connection, if it was successful:
          if ( sco )
          {
              sco.done();
          }
      } );

}

intializeDBAndInsert();