'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, CreditCard, ShoppingBag, ChevronRight, Lock } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const steps = ['Address', 'Payment', 'Summary'];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { items, total, count } = useCartStore();

  const [address, setAddress] = useState({
    name: '',
    phone: '',
    pincode: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');

  const savings = items.reduce((acc, item) => {
    if (item.product.discountPrice) {
      return acc + (item.product.price - item.product.discountPrice) * item.quantity;
    }
    return acc;
  }, 0);
  const shipping = total > 999 ? 0 : 49;
  const finalTotal = total + shipping;

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    await new Promise((res) => setTimeout(res, 1500));
    setIsPlacingOrder(false);
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🎉</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h1>
        <p className="text-gray-500 text-sm mb-6">
          Your order has been placed successfully. You&apos;ll receive a confirmation email shortly.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/account/orders">
            <Button variant="outline">View Orders</Button>
          </Link>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <button
              onClick={() => i < currentStep && setCurrentStep(i)}
              className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
                i === currentStep
                  ? 'text-[#ff3f6c]'
                  : i < currentStep
                  ? 'text-gray-800 hover:text-[#ff3f6c]'
                  : 'text-gray-400'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  i === currentStep
                    ? 'bg-[#ff3f6c] text-white'
                    : i < currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i < currentStep ? '✓' : i + 1}
              </span>
              {step}
            </button>
            {i < steps.length - 1 && (
              <ChevronRight className="h-4 w-4 text-gray-300" />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          {/* Step 0: Address */}
          {currentStep === 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="h-5 w-5 text-[#ff3f6c]" />
                <h2 className="text-lg font-bold text-gray-900">Delivery Address</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={address.name}
                  onChange={(e) => setAddress({ ...address, name: e.target.value })}
                  required
                />
                <Input
                  label="Phone Number"
                  placeholder="10-digit mobile number"
                  type="tel"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  required
                />
                <Input
                  label="Pincode"
                  placeholder="6-digit pincode"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  required
                />
                <Input
                  label="City"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  required
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Address Line 1"
                    placeholder="House No, Building, Street, Area"
                    value={address.addressLine1}
                    onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="Address Line 2 (optional)"
                    placeholder="Landmark, Area (optional)"
                    value={address.addressLine2}
                    onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                  />
                </div>
                <Input
                  label="State"
                  placeholder="State"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  required
                />
              </div>

              <Button
                fullWidth
                size="lg"
                className="mt-6"
                onClick={() => setCurrentStep(1)}
              >
                Deliver to this Address
              </Button>
            </div>
          )}

          {/* Step 1: Payment */}
          {currentStep === 1 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="h-5 w-5 text-[#ff3f6c]" />
                <h2 className="text-lg font-bold text-gray-900">Payment Options</h2>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay & more' },
                  { id: 'upi', label: 'UPI', icon: '📱', desc: 'Google Pay, PhonePe, Paytm' },
                  { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive' },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? 'border-[#ff3f6c] bg-pink-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id as typeof paymentMethod}
                      onChange={() => setPaymentMethod(method.id as typeof paymentMethod)}
                      className="text-[#ff3f6c] focus:ring-[#ff3f6c]"
                    />
                    <span className="text-xl">{method.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{method.label}</p>
                      <p className="text-xs text-gray-500">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="mt-5 p-4 bg-gray-50 rounded-lg space-y-3">
                  <Input label="Card Number" placeholder="1234 5678 9012 3456" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Expiry Date" placeholder="MM / YY" />
                    <Input label="CVV" placeholder="• • •" type="password" />
                  </div>
                  <Input label="Name on Card" placeholder="As on card" />
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="mt-5 p-4 bg-gray-50 rounded-lg">
                  <Input label="UPI ID" placeholder="yourname@bank" />
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(0)}
                >
                  Back
                </Button>
                <Button
                  fullWidth
                  onClick={() => setCurrentStep(2)}
                >
                  Review Order
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Summary */}
          {currentStep === 2 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <ShoppingBag className="h-5 w-5 text-[#ff3f6c]" />
                <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
              </div>

              <div className="space-y-3 mb-6">
                {items.map((item) => {
                  const primaryImage =
                    item.product.images.find((img) => img.isPrimary) || item.product.images[0];
                  return (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="relative w-14 h-[72px] bg-gray-100 rounded overflow-hidden shrink-0">
                        {primaryImage && (
                          <Image
                            src={primaryImage.url}
                            alt={item.product.name}
                            fill
                            className="object-cover object-top"
                            sizes="56px"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-700 uppercase">{item.product.brand}</p>
                        <p className="text-sm text-gray-600 truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900 shrink-0">
                        {formatPrice((item.product.discountPrice ?? item.product.price) * item.quantity)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-6 text-sm">
                <div className="flex gap-2 items-start">
                  <MapPin className="h-4 w-4 text-[#ff3f6c] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800">{address.name || 'Your Name'}</p>
                    <p className="text-gray-500 text-xs">
                      {[address.addressLine1, address.city, address.state, address.pincode]
                        .filter(Boolean)
                        .join(', ') || 'Your delivery address'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                <Button
                  fullWidth
                  isLoading={isPlacingOrder}
                  onClick={handlePlaceOrder}
                >
                  <Lock className="h-4 w-4" />
                  Place Order • {formatPrice(finalTotal)}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-card sticky top-24">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
              Price Details ({count} items)
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-700">
                <span>Total MRP</span>
                <span>{formatPrice(total + savings)}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount on MRP</span>
                  <span>− {formatPrice(savings)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-700">
                <span>Shipping Fee</span>
                {shipping === 0 ? (
                  <span className="text-green-600 font-semibold">FREE</span>
                ) : (
                  <span>{formatPrice(shipping)}</span>
                )}
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between font-bold text-gray-900 text-base">
                <span>Total Amount</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
              {savings > 0 && (
                <p className="text-green-600 text-xs font-semibold">
                  🎉 You save {formatPrice(savings)}!
                </p>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
              <Lock className="h-3.5 w-3.5 text-gray-400" />
              <span>Safe and Secure Payments. Easy returns.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
