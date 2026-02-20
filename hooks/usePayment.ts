import { useSafeSession } from "@/hooks/use-safe-session";
import { useRouter } from "next/navigation";

export const usePayment = () => {
  const router = useRouter();
  const session = useSafeSession();
  const { data: sessionData } = session || {};

  const handleOrderCreation = async (
    workId: string,
    transactionId: string,
    price: number
  ) => {
    if (!sessionData?.user?.id) {
      alert("Please log in to place an order.");
      return;
    }

    const payload = {
      transactionId,
      workId,
      userId: sessionData?.user.id,
      amount: price,
      status: "pending",
    };

    try {
      const result = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (result.ok) {
        alert("Order created successfully!");
        router.push("/orders");
      } else {
        alert("Order creation failed. Please try again.");
      }
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  return { session: sessionData, handleOrderCreation };
};
