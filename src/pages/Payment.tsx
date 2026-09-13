import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ShieldCheck, CreditCard, X, Loader2, CheckCircle2 } from "lucide-react";

interface PaymentGatewayProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  onSuccess?: () => void;
}

export default function PaymentGateway({ isOpen, onClose, amount, onSuccess }: PaymentGatewayProps) {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const successContainerRef = useRef(null);
  const checkmarkRef = useRef(null);
  
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const handleClose = () => {
    setStatus('idle');
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      const tl = gsap.timeline();
      tl.to(overlayRef.current, { opacity: 1, duration: 0.3 })
        .fromTo(modalRef.current, 
          { y: "100%", opacity: 0 }, 
          { y: "0%", opacity: 1, duration: 0.6, ease: "power4.out" }, "-=0.1"
        );
    }
  }, [isOpen]);

  const handlePayment = () => {
    setStatus('processing');
    setTimeout(() => {
      setStatus('success');
    }, 2000);
  };

  // FULLSCREEN SUCCESS ANIMATION
  useEffect(() => {
    if (status === 'success') {
      const tl = gsap.timeline();
      
      // 1. Scale up the success background to cover the whole screen
      tl.fromTo(successContainerRef.current, 
        { opacity: 0, scale: 0.8 }, 
        { opacity: 1, scale: 1, duration: 0.5, ease: "expo.out" }
      );

      // 2. Pop the checkmark with a bounce
      tl.fromTo(checkmarkRef.current, 
        { scale: 0, rotation: -45 }, 
        { scale: 1, rotation: 0, duration: 0.8, ease: "back.out(2)" }, "-=0.2"
      );
    }
  }, [status]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      {/* Background Overlay */}
      <div ref={overlayRef} className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0" />

      {/* FULLSCREEN SUCCESS MASK */}
      {status === 'success' && (
        <div 
          ref={successContainerRef}
          className="absolute inset-0 z-110 bg-white flex flex-col items-center justify-center p-6 text-center"
        >
          <div ref={checkmarkRef} className="mb-8">
            <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
              <CheckCircle2 size={70} className="text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Successful</h1>
          <p className="text-xl text-gray-500 mb-12">₹{amount} paid to Bespoke Couture</p>
          
          <div className="space-y-2 mb-12">
            <p className="text-sm text-gray-400 font-mono tracking-tighter">TRANS ID: BPK-772-9910</p>
            <p className="text-sm text-gray-400 font-mono tracking-tighter">{new Date().toLocaleString()}</p>
          </div>

          <button 
            onClick={() => (onSuccess ? onSuccess() : handleClose())}
            className="px-12 py-4 bg-blue-600 text-white rounded-full font-bold tracking-wide hover:bg-blue-700 transition shadow-xl"
          >
            {onSuccess ? "VIEW MY ORDERS" : "BACK TO STORE"}
          </button>
        </div>
      )}

      {/* Razorpay-style Modal (Only visible when NOT success) */}
      {status !== 'success' && (
        <div 
          ref={modalRef}
          className="relative w-full max-w-105 bg-white rounded-xl shadow-2xl overflow-hidden mx-4"
        >
          {/* Header */}
          <div className="bg-[#2B3445] p-6 text-white flex justify-between items-center">
            <div>
              <p className="text-[10px] uppercase tracking-widest opacity-60">Paying</p>
              <h2 className="text-xl font-bold">Bespoke Couture</h2>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
          </div>

          {/* Processing State */}
          {status === 'processing' ? (
            <div className="h-75 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="animate-spin text-blue-600" size={48} />
              <p className="font-medium text-gray-600">Contacting your bank...</p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
               <div className="flex justify-between items-center mb-4 border-b pb-4">
                  <span className="text-gray-500 text-sm">Amount to pay</span>
                  <span className="text-xl font-bold text-gray-800">₹{amount}</span>
               </div>
              
              <button onClick={handlePayment} className="w-full flex items-center gap-4 p-4 border rounded-xl hover:bg-blue-50 transition-colors">
                <CreditCard className="text-blue-600" />
                <div className="text-left">
                  <p className="text-sm font-bold">Cards</p>
                  <p className="text-xs text-gray-400">Visa, Mastercard, RuPay</p>
                </div>
              </button>

              <button onClick={handlePayment} className="w-full flex items-center gap-4 p-4 border rounded-xl hover:bg-blue-50 transition-colors">
                <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center font-bold text-[10px]">UPI</div>
                <div className="text-left">
                  <p className="text-sm font-bold">UPI / Google Pay / PhonePe</p>
                  <p className="text-xs text-gray-400">Pay using any UPI app</p>
                </div>
              </button>
            </div>
          )}

          <div className="bg-gray-50 p-4 flex justify-center items-center gap-2 border-t">
            <ShieldCheck size={14} className="text-green-600" />
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Secure Payments by Razorpay</p>
          </div>
        </div>
      )}
    </div>
  );
}