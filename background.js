/**
 * A Chrome extension to help me record my Leetcode progress to Notion database.
 */

// Notion api and database id
const api_url = "https://api.notion.com/v1/pages"
const database_id = ""
const api_key = ""

// Data scheme
data_scheme = {
  "parent": {
      "database_id": database_id
  },
  "properties": {
      "#": {
          "id": "iPDn",
          "name": "#",
          "number": {}
      },
      "Name": {
          "id": "title",
          "name": "Name",
          "title":  [
              {
                  "type": "text",
                  "text": { "content": "" }
              }
          ]
      },
      "URL": {
        "id": "gWri",
        "name": "URL",
        "url": ""
    }
  }
}

// Listener for onClick event which will get the Leetcode problem number and name from problem page
chrome.browserAction.onClicked.addListener(function(activeTab){
  chrome.tabs.executeScript(null, {
    file: "main.js"
  }, receiveText);
});

// Write row values (Leetcode Problem attributes) from received input (Problem number and name)
function receiveText(resultsArray){
  var title = resultsArray[0].split(".");
  var problem_number = parseInt(title[0]);
  var problem_name =  title[1].trim();
  var problem_url = "https://leetcode.com/problems/" + problem_name.toLowerCase().replace(/\s+/g, '-');
  console.log(problem_number);
  console.log(problem_name);
  console.log(problem_url);
  create_row(problem_number, problem_name, problem_url);
  alert("Create row for this problem !!");
}

// Create row in my Notion database
function create_row(problem_number, problem_name, problem_url){
  data_scheme["properties"]["#"]["number"] = problem_number;
  data_scheme["properties"]["Name"]["title"][0]["text"]["content"] = problem_name;
  data_scheme["properties"]["URL"]["url"] = problem_url;
  fetch(api_url, {
    method: 'POST',
    headers: new Headers({
      'Authorization': "Bearer " + api_key,
      'Notion-Version': "2021-05-13",
      'Content-Type': "application/json"
    }),
    body: JSON.stringify(data_scheme)
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(myJson);
  });
}