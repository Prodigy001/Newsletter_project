const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const API_KEY = "1b5dc892ce1f4e8396746745af6d7c6a-us21";
const LIST_ID = "63aa6e420c";
const API_SERVER = "us21"; // Replace with your Mailchimp API server prefix

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  let firstName = req.body.Fname;
  let lastName = req.body.Lname;
  let emailAddress = req.body.email;

  const data = {
    members: [
      {
        email_address: emailAddress,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const options = {
    method: "POST",
    url: `https://${API_SERVER}.api.mailchimp.com/3.0/lists/${LIST_ID}`,
    headers: {
      Authorization: `anystring ${API_KEY}`,
      "Content-Type": "application/json",
    },
    data: jsonData,
  };

  axios(options)
    .then((response) => {
      console.log("Subscriber added:");
      res.sendFile(__dirname + "/success.html");
    })
    .catch((error) => {
      console.error("Error adding subscriber:");
      res.sendFile(__dirname + "/Failure.html");
    });
});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server started at port 3000");
});