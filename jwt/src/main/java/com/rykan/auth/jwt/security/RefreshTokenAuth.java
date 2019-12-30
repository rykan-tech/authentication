package com.rykan.auth.jwt.security;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import com.rykan.auth.jwt.db.UserRecord;
import com.rykan.auth.jwt.db.UserRecordsDAO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * Contains the class responsbile for validating Refresh tokens
 */
@Component
class RefreshTokenAuth implements AuthenticationProvider {
	
	Logger logger = LoggerFactory.getLogger(RefreshJWTAuthorizer.class);
	UserRecordsDAO userRecords = new UserRecord();

	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		String rawToken = (String) authentication.getCredentials();

		// Parse token
		// Basic is valid checks, and expiration
		Map<String, Object> claims = RefreshJWTRaw.parseTokenforClaims(rawToken);
		String user_id = (String) claims.get("user_id");
		
		if (claims == null) {
			throw new BadCredentialsException("Something happened, and so that Refresh JWT is invalid");
		}
		if (user_id == null) {
			throw new BadCredentialsException("JWT did not have a user_id claims");
		}
		// Check redis DB
		// TODO

		// Find user
		Optional<UserRecord> user = userRecords.findById(UUID.fromString(user_id));

		if (user.isEmpty()) {
			throw new BadCredentialsException("Could not find a user_id");
		}


	}	

	@Override
	public boolean supports(Class<?> authentication) {
		// TODO Auto-generated method stub
		return (RefreshJWTAuthToken.class.isAssignableFrom(authentication));
	}

}