const createError = require("http-errors");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const sendgrid = require("@sendgrid/mail");
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  try {
    // Only handle POST requests for webhooks
    if (req.method === "POST") {
      await webhookHandler(req, res);
    } else {
      throw createError(405, `${req.method} not allowed`);
    }
  } catch (error) {
    // Something went wrong, log it
    console.error("Stripe Webhook", error.message);

    // Respond with error code and message
    res.status(error.statusCode || 500).json({
      message: error.expose ? error.message : "Faulty time ship",
    });
  }
}

const webhookHandler = async (req, res) => {
  console.log("Stripe event type", req.body.type);
  // 1. Validate
  const { type, data } = req.body;

  if (type !== "checkout.session.completed") {
    throw createError(422, `${req.body.type} not allowed`, { expose: false });
  }

  const sessionFromStripe = await stripe.checkout.sessions.retrieve(
    data.object.id,
    { expand: ["customer"] }
  );

  const { city, year } = sessionFromStripe.metadata || {};

  // Make sure we have the travel data needed
  if (!city || !year) {
    throw createError(404, "Travel data for payment not found");
  }

  // Make sure the travel is paid for
  if (sessionFromStripe.payment_status !== "paid") {
    throw createError(402, "Payment for travel still required");
  }

  // Make sure we have a customer
  if (!sessionFromStripe.customer) {
    throw createError(404, "Customer data not found");
  }

  // 2. Do the thing

  const correctCity = city === process.env.CORRECT_CITY;
  const correctYear = year === process.env.CORRECT_YEAR;

  const message = {
    to: sessionFromStripe.customer.email,
    text: `You time traveled to ${city} in the year ${year} `,
    subject: `You time traveled to ${city} in the year ${year}.`,
    from: process.env.SENDGRID_AUTHORIZED_EMAIL,
  };

  if (correctCity && correctYear) {
    message.text += `and there you found the Pirate Princess.`;
  } else {
    message.text += `and there you did NOT find the Pirate Princess.`;
  }

  await sendgrid.send(message);

  // 3. Respond
  res.send("OK");
};
