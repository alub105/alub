package com.a105.alub.security;

import java.util.Date;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.a105.alub.config.AppConfig;
import com.a105.alub.domain.enums.Platform;

@Slf4j
@Service
@RequiredArgsConstructor
public class TokenProvider {

  private final AppConfig appConfig;

  public String createToken(Authentication authentication, Platform platform) {
    UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

    Date now = new Date();
    long expirationMsec = platform == Platform.EXTENSION ? 
        appConfig.getTokenExpirationExtension() : appConfig.getTokenExpirationWeb();
    Date expiryDate = new Date(now.getTime() + expirationMsec);

    return Jwts.builder().setSubject(userPrincipal.getUsername()).claim("platform", platform)
        .setIssuedAt(new Date()).setExpiration(expiryDate)
        .signWith(SignatureAlgorithm.HS512, appConfig.getTokenSecret()).compact();
  }

  public String getUserIdFromToken(String token) {
    Claims claims =
        Jwts.parser().setSigningKey(appConfig.getTokenSecret()).parseClaimsJws(token).getBody();

    return claims.getSubject();
  }

  public Platform getPlatformFromToken(String token) {
    Claims claims =
        Jwts.parser().setSigningKey(appConfig.getTokenSecret()).parseClaimsJws(token).getBody();

    return Platform.valueOf((String) claims.get("platform"));
  }

  public boolean validateToken(String authToken) {
    try {
      Jwts.parser().setSigningKey(appConfig.getTokenSecret()).parseClaimsJws(authToken);
      return true;
    } catch (SignatureException ex) {
      log.error("Invalid JWT signature");
    } catch (MalformedJwtException ex) {
      log.error("Invalid JWT token");
    } catch (ExpiredJwtException ex) {
      log.error("Expired JWT token");
    } catch (UnsupportedJwtException ex) {
      log.error("Unsupported JWT token");
    } catch (IllegalArgumentException ex) {
      log.error("JWT claims string is empty.");
    }
    return false;
  }

}
