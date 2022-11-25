import request from "request";
import OAuthHelper from "./oauthhelper.js";
import { getCheckDates } from "./wp_database.js";

var getUrl = (type) => {
  return `https://appartementvars.fr/wp-json/wc/v3/${type}?per_page=25`;
};

var getAuthUrl = (type) => {
  return `https://appartementvars.fr/wp-json/wc/v3/${type}?per_page=25&oauth_consumer_key=${oauth.oauth_consumer_key}&oauth_signature_method=${oauth.oauth_signature_method}&oauth_timestamp=${oauth.oauth_timestamp}&oauth_nonce=${oauth.oauth_nonce}&oauth_version=${oauth.oauth_version}&oauth_signature=${oauth.oauth_signature}`;
};

var request_data = {
  method: "GET",
  url: getUrl("orders"),
};

const oauth = OAuthHelper.getAuthHeaderForRequest(request_data);

var options = {
  method: "GET",
  url: getAuthUrl("orders"),
};

request(options, function (error, response) {
  if (error) throw new Error(error);
  var data = response.body;
  data = JSON.parse(data);
  console.log(response.headers);
  //   console.log(data.length);
  //   data.forEach((item) => console.log(item.id));
});
