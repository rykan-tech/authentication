package com.rykan.auth.jwt.utils;

// From https://blog.jonm.dev/posts/rsa-public-key-cryptography-in-java/
import java.io.*;
import java.security.*;
import java.security.spec.*;
import java.util.stream.Collectors;

public class PublicKeyReader {

  public static PublicKey get(String filename)
    throws Exception {

    InputStream in = Object.class.getClass().getResourceAsStream("/file.txt");
    BufferedReader reader = new BufferedReader(new InputStreamReader(in));

    X509EncodedKeySpec spec =
      new X509EncodedKeySpec((byte[]) reader.lines().collect(Collectors.joining()););
    KeyFactory kf = KeyFactory.getInstance("RSA");
    return kf.generatePublic(spec);
  }
}