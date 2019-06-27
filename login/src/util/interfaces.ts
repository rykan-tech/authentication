/**
 * Interfaces
 */

 /**
  * Defines how a DB config environment should look like
  */
export interface DBConfigObject {
	host: string; // The host of the db, i.e. 0.0.0.0
	port: number;
	username: string;
	password: string;
	db_name: string;
}

/**
 * Defines an actual DB config
 */
export interface DBConfig {
	production: DBConfigObject;
	development: DBConfigObject;
	[key: string]: DBConfigObject; // For any other environments
}