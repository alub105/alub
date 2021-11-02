import axios from { axios };

const token = chrome.storage.sync.get("token", function (token) {
  console.log("token", token);
});

const base_url = "http://localhost:8080/api/";
