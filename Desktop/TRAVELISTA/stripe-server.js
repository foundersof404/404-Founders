import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51RSIHl2M2AI1wPEZygrdBj2tv3D0csEiZi3G2VtQiYXBzs6y9alFOaRNxnobygJhPv3OVxQe85x8GrN8mSDoytJY00pYQCeuAO');

const app = express();
app.use(cors());
app.use(express.json());

// Helper function to create line items
const createLineItems = (items) => {
  return items.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        description: item.description,
        images: item.images || [],
        metadata: {
          type: item.type,
          duration: item.duration,
          location: item.location,
          ...item.metadata
        }
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity || 1,
  }));
};

// Travel Package Payment
app.post('/create-travel-package-session', async (req, res) => {
  const { packageDetails } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: createLineItems([{
        name: packageDetails.name,
        description: packageDetails.description,
        price: packageDetails.price,
        type: 'travel_package',
        duration: packageDetails.duration,
        location: packageDetails.location,
        images: packageDetails.images,
        metadata: {
          startDate: packageDetails.startDate,
          endDate: packageDetails.endDate,
          numberOfPeople: packageDetails.numberOfPeople,
          accommodation: packageDetails.accommodation,
          activities: packageDetails.activities
        }
      }]),
      success_url: 'http://localhost:3000/success?type=travel_package',
      cancel_url: 'http://localhost:3000/cancel',
      metadata: {
        type: 'travel_package',
        packageId: packageDetails.id
      }
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Car Rental Payment
app.post('/create-car-rental-session', async (req, res) => {
  const { rentalDetails } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: createLineItems([{
        name: rentalDetails.carName,
        description: `${rentalDetails.carType} - ${rentalDetails.duration} days rental`,
        price: rentalDetails.totalPrice,
        type: 'car_rental',
        duration: rentalDetails.duration,
        location: rentalDetails.pickupLocation,
        images: rentalDetails.carImages,
        metadata: {
          pickupDate: rentalDetails.pickupDate,
          returnDate: rentalDetails.returnDate,
          carType: rentalDetails.carType,
          insurance: rentalDetails.insurance
        }
      }]),
      success_url: 'http://localhost:3000/success?type=car_rental',
      cancel_url: 'http://localhost:3000/cancel',
      metadata: {
        type: 'car_rental',
        rentalId: rentalDetails.id
      }
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Taxi Service Payment
app.post('/create-taxi-session', async (req, res) => {
  const { taxiDetails } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: createLineItems([{
        name: 'Taxi Service',
        description: `From ${taxiDetails.pickupLocation} to ${taxiDetails.dropoffLocation}`,
        price: taxiDetails.price,
        type: 'taxi',
        duration: taxiDetails.estimatedDuration,
        location: taxiDetails.pickupLocation,
        metadata: {
          pickupTime: taxiDetails.pickupTime,
          vehicleType: taxiDetails.vehicleType,
          distance: taxiDetails.distance,
          estimatedDuration: taxiDetails.estimatedDuration
        }
      }]),
      success_url: 'http://localhost:3000/success?type=taxi',
      cancel_url: 'http://localhost:3000/cancel',
      metadata: {
        type: 'taxi',
        bookingId: taxiDetails.id
      }
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Webhook endpoint to handle successful payments
app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, 'your_webhook_secret');
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Handle successful payment based on metadata.type
      switch (session.metadata.type) {
        case 'travel_package':
          // Handle travel package booking confirmation
          console.log('Travel package booking confirmed:', session.metadata.packageId);
          break;
        case 'car_rental':
          // Handle car rental confirmation
          console.log('Car rental confirmed:', session.metadata.rentalId);
          break;
        case 'taxi':
          // Handle taxi booking confirmation
          console.log('Taxi booking confirmed:', session.metadata.bookingId);
          break;
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

// Keep the original checkout session endpoint for backward compatibility
app.post('/create-checkout-session', async (req, res) => {
  const { productName, price } = req.body;
  const numericPrice = Number(price);
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: productName },
            unit_amount: Math.round(numericPrice * 100),
          },
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(4242, () => console.log('Stripe server running on port 4242')); 