import crypto from "crypto";
import OAuth from "oauth-1.0a";

const CONSUMERKEY = "ck_c21c76f3032f8cc74f9b79353192bfd04b222ecd";
const CONSUMERSECRET = "cs_574df9a514463bd5c3588a74c034efd14b9c6fa1";

class OAuthHelper {
  static getAuthHeaderForRequest(request) {
    const oauth = OAuth({
      consumer: { key: CONSUMERKEY, secret: CONSUMERSECRET },
      signature_method: "HMAC-SHA1",
      hash_function(base_string, key) {
        return crypto
          .createHmac("sha1", key)
          .update(base_string)
          .digest("base64");
      },
    });

    const authorization = oauth.authorize(request);
    return authorization;
  }
}

export default OAuthHelper;
