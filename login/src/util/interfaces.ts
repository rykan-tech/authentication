import amqplib from "amqplib";

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

/**
 * Database Schema
 */
export interface DBSchema {
	email: string;
	password: string;
	user_id: string;
}

/**
 * JWT schema, from https://app.quicktype.io/
 * Describes the schema to be used by deserialised JSON Web Tokens.
 * Header not included
 * (see RFC 7519)
 */
export interface JWTSchema {
	/**
	 * Time in Unix time when the token expires
	 */
	exp: number;
	/**
	 * Time in Unix time for when the token was issued
	 */
	iat: number;
	/**
	 * Unique ID for the JWT
	 */
	jti: string;
	/**
	 * Contains information about the user
	 */
	user: JWTSchemaUser;
}
/**
 * Contains information about the user
 */
export interface JWTSchemaUser {
	email: string;
	permissions: string[];
	user_id: string;
}

/**
 * Interface to defines queues
 */
export interface RabbitMQQueue {
	name: string;
	options: amqplib.Options.AssertQueue;
	description: string;
}

/**
 * Interface for rabbitmq exchange spec
 */
export interface RabbitMQExchange {
	name: string;
	description: string;
	type: string;
	options: amqplib.Options.AssertExchange;
	queues: { [key: string]: RabbitMQQueue };
}