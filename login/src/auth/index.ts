/**
 * Index of JWT
 */
import authenticate from "./authenticate";
import issueJWT from "./issue";
import { validatePassword } from "./password";
import registerUser from "./register";

export default authenticate;
export { issueJWT, validatePassword, registerUser };