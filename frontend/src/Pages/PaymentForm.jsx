import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Load your Stripe publishable key
const stripePromise = loadStripe("your_publishable_key");

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Fetch the client secret from the backend
    const res = await fetch("http://127.0.0.1:8000/create-payment-intent/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const { clientSecret } = await res.json();

    // Confirm the payment with Stripe
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: "Test User",
        },
      },
    });

    if (error) {
      setMessage(`Payment failed: ${error.message}`);
    } else if (paymentIntent.status === "succeeded") {
      setMessage("Payment successful!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || !elements}>
        Pay
      </button>
      <p>{message}</p>
    </form>
  );
};

const App = () => (
  <Elements stripe={stripePromise}>
    <PaymentForm />
  </Elements>
);

export default App;
