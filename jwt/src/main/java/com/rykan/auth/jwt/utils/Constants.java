package com.rykan.auth.jwt.utils;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.security.PublicKey;
import java.security.interfaces.RSAPublicKey;

import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.RSAKeyProvider;

public class Constants {
	public static final String RABBITMQ_APP_QUEUE_NAME = "service.auth.jwt"; // Queue used for events specific to this
	public static final String JWT_REFRESH_COOKIE = "_AuthRefresh";

	// Refresh public key
	public static final String JWT_REFRESH_PUB_KEY_NAME = "/jwt-rs256-public.pem";
	public static final PublicKey JWT_REFRESH_PUB_KEY;
	static {
		try {
			JWT_REFRESH_PUB_KEY = PublicKeyReader.get(JWT_REFRESH_PUB_KEY_NAME);
		} catch (Exception err) {
			throw new RuntimeException(err);
		}
	}
	// No private key given as we don't need it
	public static final Algorithm JWT_REFRESH_ALGO = Algorithm.RSA256((RSAPublicKey) JWT_REFRESH_PUB_KEY, null);
}