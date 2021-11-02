const keys = require("./keys");

export const API_BASE_URL = keys.apiBaseUrl;

export const OAUTH_REDIRECT_URI = keys.redirectUri;

export const GOOGLE_AUTH_URL =
  API_BASE_URL + "/oauth/authorize/google?redirect_uri=" + OAUTH_REDIRECT_URI;
