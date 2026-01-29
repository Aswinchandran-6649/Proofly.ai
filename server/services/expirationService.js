
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const Warranty = require("../model/user/warrantyModel"); 
const User = require("../model/user/UserModel"); 
const Notification = require('../model/user/notificationModel'); 

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.user,
    pass: process.env.pass, 
  },
});

const startExpirationCheck = () => {
  cron.schedule("0 9 * * *", async () => {
    console.log("-----------------------------------------");
    console.log("Cron Triggered: Checking for warranties...");

    try {
      const now = new Date();
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(now.getDate() + 7);

      // Find warranties. We try to populate, but we will handle it if it fails.
      const warranties = await Warranty.find({
        warrantyExpiryDate: {
          $lte: sevenDaysFromNow,
          $gte: now,
        },
      }).populate("userId");

      console.log(` Result: Found ${warranties.length} warranties expiring soon.`);

      if (warranties.length === 0) return;


      for (const warranty of warranties) {
        
        let targetEmail = "";
        let targetName = "";


        if (warranty.userId && warranty.userId.email) {
          targetEmail = warranty.userId.email;
          targetName = warranty.userId.username;
        } 

        else if (warranty.userId) {
          const userDoc = await User.findById(warranty.userId);
          if (userDoc) {
            targetEmail = userDoc.email;
            targetName = userDoc.username;
          }
        }

        if (!targetEmail) {
          console.log(` Skipping Warranty ${warranty._id}: No email found for userId ${warranty.userId}`);
          continue; 
        }

        const rawDate = warranty.warrantyExpiryDate;
        const expiryString = rawDate ? new Date(rawDate).toDateString() : "Date Not Set";
        const pName = Array.isArray(warranty.productName) ? warranty.productName[0] : warranty.productName;

        const mailOptions = {
          from: `"Proofly Alerts" <${process.env.user}>`,
          to: targetEmail, 
          subject: ` Warranty Alert: ${pName}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
                <h2 style="color: #d32f2f;">Warranty Expiring Soon!</h2>
                <p>Hello <strong>${targetName || 'User'}</strong>,</p>
                <p>The warranty for your <strong>${pName}</strong> is expiring on <strong>${expiryString}</strong>.</p>
                <br>
                <a href="http://localhost:5173/user/dashboard" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Dashboard</a>
            </div>
          `,
        };

        // Send Email
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) console.error(` NODEMAILER ERROR for ${targetEmail}:`, err.message);
          else console.log(` SUCCESS: Email sent to ${targetEmail}`);
        });

        // Save In-app notification
        try {
          await Notification.create({
            userId: warranty.userId._id || warranty.userId,
            message: `Alert: ${pName} expires on ${expiryString}!`,
          });
          console.log(` In-app notification saved for ${targetName}`);
        } catch (err) {
          console.error("Error saving notification:", err);
        }
      }
    } catch (error) {
      console.error(" CRITICAL CRON ERROR:", error);
    }
  });
};

module.exports = startExpirationCheck;