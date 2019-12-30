package com.rykan.auth.jwt.security;

import java.util.Collection;

import com.rykan.auth.jwt.db.UserRecord;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

/**
 * Class to represent JWT Refresh token
 */
// FROM:
// https://github.com/svlada/springboot-security-jwt/blob/master/src/main/java/com/svlada/security/auth/JwtAuthenticationToken.java

class RefreshJWTAuthToken extends AbstractAuthenticationToken {

	private static final long serialVersionUID = 973340455432455478L;
	
	private String rawAccessToken;
	private UserRecord userContext;

	public RefreshJWTAuthToken(String unsafeToken) {
		// from:
		// https://github.com/svlada/springboot-security-jwt/blob/master/src/main/java/com/svlada/security/auth/JwtAuthenticationToken.java
    super(null);
    this.rawAccessToken = unsafeToken;
    this.setAuthenticated(false);
	}
	
	public RefreshJWTAuthToken(UserRecord userContext, Collection<? extends GrantedAuthority> authorities) {
		// TODO
    super(authorities);
    this.eraseCredentials();
    this.userContext = userContext;
    super.setAuthenticated(true);
	}
	
	@Override
	public void setAuthenticated(boolean authenticated) {
		if (authenticated) {
			throw new IllegalArgumentException(
					"Cannot set this token to trusted - use constructor which takes a GrantedAuthority list instead");
		}
		super.setAuthenticated(false);
	}

	@Override
	public Object getCredentials() {
		// TODO Auto-generated method stub
		return rawAccessToken;
	}

	@Override
	public Object getPrincipal() {
		// TODO Auto-generated method stub
		// TODO
		return this.userContext;
	}

	@Override
	public void eraseCredentials() {
		super.eraseCredentials();
		this.rawAccessToken = null;
	}

}