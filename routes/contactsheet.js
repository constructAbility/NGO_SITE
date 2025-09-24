const express = require('express');
const router = express.Router();  
const { google } = require("googleapis");
// const contact = require('../model/contactform');
// const donet=require('../model/donet_form')

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const SHEET_ID = process.env.GOOGLE_SHEET_ID;

const appendToSheet = async (range, values) => {
  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: authClient });
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  });
};

function getFormattedDateTime() {
  const now = new Date();

  const istDateTime = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true, 
  }).formatToParts(now);

  let dateParts = {};
  istDateTime.forEach(({ type, value }) => {
    dateParts[type] = value;
  });

  const formattedDate = `${dateParts.day}/${dateParts.month}/${dateParts.year}`;
  const formattedTime = `${dateParts.hour}:${dateParts.minute}:${dateParts.second} ${dateParts.dayPeriod}`;

  return `${formattedDate} ${formattedTime}`;
}

router.post("/contact-resone", async (req, res) => {
  try {
    const { full_name, phone_number, email, resone } = req.body;

   
    if (!full_name || !phone_number || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Save to DB
    // const newContact = new contact({
    //   full_name,
    //   phone_number,
    //   email,
    //   resone,
    // });

    // await newContact.save();

    
    const datetime = getFormattedDateTime();
    await appendToSheet("contactform!A1:E", [
      full_name,
      email,
      phone_number,
      resone || "",  
      datetime,
    ]);

    res.status(201).json({ message: "Inquiry saved successfully" });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Failed to save inquiry", error: err.message });
  }
});
router.post("/donet-form", async (req, res) => {
  try {
    const { name, phone_number, email } = req.body;


    if (!name || !phone_number || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    
    // const newDonet = new donet({
    //   name,
    //   phone_number,
    //   email,
  
    // });

    // await newDonet.save();

   
    const datetime = getFormattedDateTime();
    await appendToSheet("Donetform!A1:c", [
      name,
      email,
      phone_number,
datetime,
    ]);

    res.status(201).json({ message: "donet  saved successfully" });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Failed to save donet details ", error: err.message });
  }
});
module.exports = router;
