const createError = require("http-errors");
const stripe = require("stripe")(process.env.STRIPE_KEY);

export default async function handler(req, res) {
  console.log("Time Travel");

  try {
    // Only handle valid HTTP request methods
    if (req.method === "POST") {
      await postHandler(req, res);
    } else if (req.method === "GET") {
      await getHandler(req, res);
    } else {
      throw createError(405, `${req.method} not allowed`);
    }
  } catch (error) {
    // Something went wrong, log it
    console.error("Time Travel", error.message);

    // Respond with error code and message
    res.status(error.statusCode || 500).json({
      message: error.expose ? error.message : "Faulty time ship",
    });
  }
}

export const postHandler = async (req, res) => {
  // 1. Validate

  // Deconstruct the needed data
  const { city, year, successUrl, cancelUrl } = req.body;

  // Make sure we have the travel data needed
  if (!city || !year) {
    throw createError(422, "Missing travel data");
  }

  // Make sure we have the redirect urls needed
  if (!successUrl || !cancelUrl) {
    throw createError(422, "Missing checkout redirect urls");
  }

  // 2. Do the thing

  // Create a stripe checkout session
  const session = await stripe.checkout.sessions.create({
    success_url: successUrl,
    cancel_url: cancelUrl,
    payment_method_types: ["card"],
    line_items: [
      {
        price: "price_1JT1tdJxjwgedgz9by4X6cgK",
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      year: year.trim(),
      city: city.trim(),
    },
  });

  // Respond with the redirect url
  res.status(200).json({
    url: session.url,
  });
};

const getHandler = async (req, res) => {
  // 1. Validate

  if (!req.query.session_id) {
    throw createError(422, "Missing Stripe Session Id", { expose: false });
  }

  // 2. Do the thing

  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  const { city, year } = session.metadata || {};

  // Make sure we have the travel data needed
  if (!city || !year) {
    throw createError(404, "Travel data for payment not found");
  }

  // Make sure the travel is paid for
  if (session.payment_status !== "paid") {
    throw createError(402, "Payment for travel still required");
  }

  // 3. Respond

  res.status(200).json({
    message: `You time traveled to ${city} in the year ${year}. Check your email to see if you found the Pirate Princess!`,
  });
};
 