/**
 * Index of JWT
 */
import authenticate from "./authenticate";
import issueJWT from "./issue";
import { validatePassword } from "./password";

export default authenticate;
export { issueJWT, validatePassword };