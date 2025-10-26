import { useState } from "react";
import { Heart, Gift, Coins, ChevronLeft, ChevronLeftCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Support = () => {
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");

  const presetAmounts = [5, 10, 25, 50, 100];

  const handleDonate = (amt?: number) => {
    const donationAmount = amt || Number(amount);

    if (!donationAmount || donationAmount <= 0) {
      toast.error("Please enter or select a valid amount 💰");
      return;
    }

    const handler = (window as any).PaystackPop.setup({
      key: "pk_test_your_public_key_here", // Replace with your Paystack public key
      email: email || "guest@comicverse.com",
      amount: donationAmount * 100, // Paystack uses kobo/pesewas
      currency: "GHS",
      ref: "DON-" + Math.floor(Math.random() * 1000000000),
      callback: function () {
        toast.success("Donation successful! 🎉 Thank you for your support ❤️");
        setAmount("");
        setEmail("");
      },
      onClose: function () {
        toast("Donation window closed.");
      },
    });

    handler.openIframe();
  };

  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-4 py-10 text-white">
      <div className="max-w-lg w-full bg-[#1b2330]/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-gray-700/50">

        <div onClick={() => navigate(-1)} className="">
            <ChevronLeftCircle />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Heart size={40} className="text-pink-500 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Support Our Mission ❤️</h1>
          <p className="text-gray-400">
            Every cedi you donate helps us bring more exciting comics and empower local artists.
          </p>
        </div>

        {/* Donation Options */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-6">
          {presetAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => handleDonate(amt)}
              className="bg-gradient-to-tr from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black font-semibold py-2 rounded-lg shadow-md transition transform hover:scale-105"
            >
              GHS {amt}
            </button>
          ))}
        </div>

        <div className="text-center mb-4 text-gray-400 text-sm">
          or enter your own amount:
        </div>

        {/* Custom Amount */}
        <div className="flex flex-col gap-4">
          <input
            type="number"
            placeholder="Enter custom amount (GHS)"
            value={amount}
            onChange={(e: any) => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#2a3445] border border-gray-600 focus:border-yellow-500 text-white outline-none transition"
          />

          <input
            type="email"
            placeholder="Enter your email (optional)"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#2a3445] border border-gray-600 focus:border-yellow-500 text-white outline-none transition"
          />

          <button
            onClick={() => handleDonate()}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition transform hover:scale-105 shadow-md"
          >
            <Gift size={18} /> Donate Now
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400 text-sm flex flex-col items-center gap-2">
          <Coins size={16} className="text-yellow-400" />
          <p>
            100% of your donation goes directly to support artists and platform
            growth.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Support;
