/**
 * Allows us to add Middleware to Express
 * by extending its type defs
 */

declare namespace Express {
	export interface Response {
		jsonMessage: (message: string, extraJSON?: object) => void; // Easy send of JSON messages
	}
}