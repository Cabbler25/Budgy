package services;

import java.security.Key;
import java.util.Date;

import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;

import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

public class JwtHandler {

	public static String createJWT(String id, String aud, String subject, long ttlMillis) {

		// The JWT signature algorithm we will be using to sign the token
		SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;

		long nowMillis = System.currentTimeMillis();
		Date now = new Date(nowMillis);

		// We will sign our JWT with our ApiKey secret
		byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary(System.getenv("A_SECRET_KEY"));
		Key signingKey = new SecretKeySpec(apiKeySecretBytes, signatureAlgorithm.getJcaName());

		// Let's set the JWT Claims
		JwtBuilder builder = Jwts.builder().setId(id).setIssuedAt(now).setSubject(subject).setAudience(aud)
				.signWith(signingKey, signatureAlgorithm);

		// if it has been specified, let's add the expiration
		if (ttlMillis > 0) {
			long expMillis = nowMillis + ttlMillis;
			Date exp = new Date(expMillis);
			builder.setExpiration(exp);
		}

		// Builds the JWT and serializes it to a compact, URL-safe string
		return builder.compact();
	}

	public static boolean checkAuth(String token, int id) {
		try {

		    Jwts.parser().setSigningKey(System.getenv("A_SECRET_KEY")).parseClaimsJws(token).


		} catch (JwtException e) {

		    //don't trust the JWT!
		}
		
		
		
		return false;
		
	}

	public static boolean checkAuth(String token, String role) {
		try {

			String tokenRole = Jwts.parser().setSigningKey(System.getenv("A_SECRET_KEY")).parseClaimsJws(token)
					.getBody().getSubject();

			if (tokenRole == role)
				return true;

		} catch (JwtException e) {

			return false;
		}

		return false;

	}

}
