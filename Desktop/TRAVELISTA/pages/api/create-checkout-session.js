const stripe = require('stripe')('sk_test_51RSIHl2M2AI1wPEZygrdBj2tv3D0csEiZi3G2VtQiYXBzs6y9alFOaRNxnobygJhPv3OVxQe85x8GrN8mSDoytJY00pYQCeuAO');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { flight, seat } = req.body;

  const line_items = [
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: `Flight ${flight.flightNumber} - Seat ${seat.seatId}`,
          description: `From ${flight.departureAirport} to ${flight.arrivalAirport}`,
        },
        unit_amount: Math.round(Number(flight.price.split(' ')[1]) * 100),
      },
      quantity: 1,
    },
  ];

  if (seat.price) {
    line_items.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `Seat ${seat.seatId}`,
        },
        unit_amount: Math.round(Number(seat.price.split(' ')[1]) * 100),
      },
      quantity: 1,
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${req.headers.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/payment-cancel`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
} 