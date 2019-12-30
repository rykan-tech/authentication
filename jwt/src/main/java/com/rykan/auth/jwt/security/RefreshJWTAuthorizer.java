package com.rykan.auth.jwt.security;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.rykan.auth.jwt.utils.Constants;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.WebUtils;

// https://auth0.com/blog/implementing-jwt-authentication-on-spring-boot/
public class RefreshJWTAuthorizer extends OncePerRequestFilter {

	Logger logger = LoggerFactory.getLogger(RefreshJWTAuthorizer.class);

	@Override
	protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
			throws IOException, ServletException {
		// Grab the cookie
		Cookie jwtRefreshCookie = WebUtils.getCookie(req, Constants.JWT_REFRESH_COOKIE);

		if (jwtRefreshCookie == null) {
			chain.doFilter(req, res);
			return;
		}

		// Now get its value after making sure it exists
		String jwtRefreshToken = jwtRefreshCookie.getValue();

		UsernamePasswordAuthenticationToken authentication = getAuthentication(jwtRefreshToken);
		SecurityContextHolder.getContext().setAuthentication(authentication);
		chain.doFilter(req, res);
	}

	private UsernamePasswordAuthenticationToken getAuthentication(String jwtRefreshToken) {
		// Parse the token
		DecodedJWT user = JWT.require(Constants.JWT_REFRESH_ALGO).build().verify(jwtRefreshToken);
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
				return new UsernamePasswordAuthenticationToken(user_id, null, new ArrayList<>());
			}
			return null;
		} catch (JWTDecodeException err) {
			logger.error("An invalid JWT was received.  User claim was wrong type.");
			return null;
		}
	}
}