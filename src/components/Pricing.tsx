import React, { useState } from 'react';
import { Check } from 'lucide-react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { simulateCheckout } from '../api/stripe';

interface PricingProps {
  onClose: () => void;
}

const pricingPlans = [
  {
    id: 'plus',
    name: 'Plus',
    price: '$3.99',
    period: '/month',
    description: 'Enhanced prompt generation and features',
    productId: 'prod_SrBrU9a43Ry72h',
    features: [
      'Unlimited prompts with advanced reasoning',
      'Faster response times',
      'More built in templates',
      'Expanded memory'
    ],
    popular: true,
    buttonText: 'Get Plus',
    buttonColor: 'bg-gray-800 hover:bg-gray-900'
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: '$14.99',
    period: '/month',
    description: 'Ultimate prompt creation experience',
    productId: 'prod_SrBrnHx5E3KfSZ',
    features: [
      'Unlimited prompts with pro reasoning',
      'The fastest response times',
      'Customizable template settings'
    ],
    popular: false,
    buttonText: 'Get Platinum',
    buttonColor: 'bg-gray-900 hover:bg-black'
  }
];

export const Pricing: React.FC<PricingProps> = ({ onClose }) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string, productId: string) => {
    setLoading(planId);
    
    try {
      console.log(`Redirecting to Stripe checkout for ${planId} with product ID: ${productId}`);
      
      // For now, we'll simulate the checkout process
      // In production, you'd create a checkout session with your backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Successfully subscribed to ${planId}! This is a demo - in production, you'd integrate with Stripe checkout using product ID: ${productId}`);
      onClose();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Upgrade your plan</h1>
              <p className="text-gray-600 mt-2">Choose the perfect plan for your prompt creation needs</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-xl border-2 p-8 ${
                  plan.popular ? 'border-gray-800 shadow-lg' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gray-800 text-white px-4 py-1 rounded-full text-sm font-medium">
                      POPULAR
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSubscribe(plan.id, plan.productId)}
                  disabled={loading === plan.id}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                    loading === plan.id ? 'opacity-50 cursor-not-allowed' : plan.buttonColor
                  }`}
                >
                  {loading === plan.id ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    plan.buttonText
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Free Plan Info */}
          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Plan</h3>
                <p className="text-gray-600">Basic prompt generation with limited features</p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Your current plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 