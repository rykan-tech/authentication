import { RYKAN_EMAIL_SUFFIX } from "./constants";
import createLogger from "./logger";

const logger = createLogger("validate");

/**
 * Auto adds a @rykanmail.com suffix to an email
 * @param email Email to test
 */
export default function appendEmail(email: string): string {
	 if (!email.includes("@")) {
		 logger.warn("A email did not contain the @rykan.com suffix, adding it.");
		 email += RYKAN_EMAIL_SUFFIX;
	 }
	 return email;
 }