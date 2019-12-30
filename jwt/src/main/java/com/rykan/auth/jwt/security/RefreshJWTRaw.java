package com.rykan.auth.jwt.security;

import java.util.Map;

import com.auth0.jwt.JWT;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.rykan.auth.jwt.utils.Constants;

/**
 * Represents a JWT Refresh Token
 */
public class RefreshJWTRaw {

	private String token;

  public RefreshJWTRaw(String token) {
		this.token = token;
		// Set stuff
	}

	public String getRawToken() {
		return token;
	}

	public static Map<String, Object> parseTokenforClaims(String token) {
		DecodedJWT user = JWT.require(Constants.JWT_REFRESH_ALGO).build().verify(token);
		Claim userClaim = user.getClaim("user");
		// Check something is there
		if (userClaim == null) {
			logger.error("An invalid JWT was received.  No user claim was found.");
			return null;
		}

		try {
			Map<String, Object> userClaimMap = userClaim.asMap();
			String user_id = (String) userClaimMap.get("user_id");
			if (user_id != null) {
				return userClaimMap;
			}
			return null;
		} catch (JWTDecodeException err) {
			logger.error("An invalid JWT was received.  User claim was wrong type.");
			return null;
		}
	}
}