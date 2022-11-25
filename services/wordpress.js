import WPAPI from "wpapi";

var wp = new WPAPI({
  endpoint: "https://appartementvars.fr/wp-json",
  username: "booseo",
  password: "bg71aIPCm7GqO@Rs$$99e8g0",
});

wp.settings()
  .get()
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  });
