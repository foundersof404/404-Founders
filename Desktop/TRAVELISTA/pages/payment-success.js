import { useEffect } from "react";
import { useRouter } from "next/router";

export default function PaymentSuccess() {
  const router = useRouter();

  useEffect(() => {
    localStorage.setItem("hasBooked", "true");
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h1>Payment Successful!</h1>
      <p>Your booking is confirmed. You can now access your flight details.</p>
      <button onClick={() => router.push("/")}>Go to Home</button>
    </div>
  );
} 