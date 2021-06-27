const jwt = require("express-jwt");
const jwtAuthz = require("express-jwt-authz");
const jwksRsa = require("jwks-rsa");

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://dev-07mdy7q4.jp.auth0.com/.well-known/jwks.json",
  }),
  audience: "https://booknews/api",
  issuer: "https://dev-07mdy7q4.jp.auth0.com/",
  algorithms: ["RS256"],
});

const checkScopes = jwtAuthz(["read:messages"]);

exports.checkJwt = checkJwt;
exports.checkScopes = checkScopes;
