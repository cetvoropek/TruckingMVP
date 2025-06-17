import React, { useState } from 'react';
import { 
  CreditCard, 
  Check, 
  Star, 
  Calendar, 
  DollarSign,
  Users,
  MessageSquare,
  BarChart3,
  Shield,
  Zap
} from 'lucide-react';

export function RecruiterSubscription() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const currentPlan = {
    name: 'Pro',
    price: 199,
    contactsUsed: 45,
    contactsLimit: 100,
    renewalDate: '2024-03-15',
    features: [
      'Unlimited candidate search',
      '100 contact unlocks per month',
      'Advanced filtering',
      'Analytics dashboard',
      'Priority support'
    ]
  };

  const plans = [
    {
      name: 'Starter',
      price: { monthly: 99, yearly: 990 },
      contacts: 25,
      features: [
        'Basic candidate search',
        '25 contact unlocks per month',
        'Standard filtering',
        'Basic analytics',
        'Email support'
      ],
      popular: false
    },
    {
      name: 'Pro',
      price: { monthly: 199, yearly: 1990 },
      contacts: 100,
      features: [
        'Advanced candidate search',
        '100 contact unlocks per month',
        'Advanced filtering & AI matching',
        'Full analytics dashboard',
        'Priority support',
        'Interview scheduling'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: { monthly: 399, yearly: 3990 },
      contacts: 'Unlimited',
      features: [
        'Unlimited candidate search',
        'Unlimited contact unlocks',
        'Custom AI matching criteria',
        'Advanced analytics & reporting',
        'Dedicated account manager',
        'API access',
        'Custom integrations'
      ],
      popular: false
    }
  ];

  const payPerContactRate = 5; // $5 per contact

  const usageStats = [
    { name: 'Contacts Unlocked', value: currentPlan.contactsUsed, limit: currentPlan.contactsLimit, icon: Users },
    { name: 'Messages Sent', value: 127, limit: 'Unlimited', icon: MessageSquare },
    { name: 'Searches Performed', value: 89, limit: 'Unlimited', icon: BarChart3 },
    { name: 'Days Remaining', value: 23, limit: 30, icon: Calendar },
  ];

  const recentTransactions = [
    { id: 1, date: '2024-01-15', description: 'Pro Plan - Monthly', amount: 199, status: 'paid' },
    { id: 2, date: '2023-12-15', description: 'Pro Plan - Monthly', amount: 199, status: 'paid' },
    { id: 3, date: '2023-11-15', description: 'Pro Plan - Monthly', amount: 199, status: 'paid' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscription & Billing</h1>
          <p className="text-gray-600">Manage your subscription and view usage statistics</p>
        </div>
        <button
          onClick={() => setShowUpgradeModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Upgrade Plan
        </button>
      </div>

      {/* Current Plan Status */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 bg-blue-600 rounded-full mr-4">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{currentPlan.name} Plan</h3>
              <p className="text-sm text-gray-600">
                ${currentPlan.price}/month • Renews on {currentPlan.renewalDate}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {currentPlan.contactsUsed}/{currentPlan.contactsLimit}
            </div>
            <div className="text-sm text-gray-600">Contacts Used</div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Contact Usage</span>
            <span>{Math.round((currentPlan.contactsUsed / currentPlan.contactsLimit) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${(currentPlan.contactsUsed / currentPlan.contactsLimit) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {usageStats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                      {typeof stat.limit === 'number' && `/${stat.limit}`}
                      {stat.limit === 'Unlimited' && ' / ∞'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pay-per-Contact Option */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pay-per-Contact</h3>
          <div className="text-center py-6">
            <div className="text-3xl font-bold text-gray-900 mb-2">${payPerContactRate}</div>
            <div className="text-sm text-gray-600 mb-4">per contact unlock</div>
            <p className="text-sm text-gray-600 mb-6">
              Perfect for occasional recruiting needs. No monthly commitment required.
            </p>
            <button className="bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 transition-colors">
              Buy Credits
            </button>
          </div>
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-2">What's included:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Instant contact information access</li>
              <li>• No expiration on purchased credits</li>
              <li>• Full candidate profile access</li>
              <li>• Basic messaging capabilities</li>
            </ul>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-xs text-gray-500">{transaction.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">${transaction.amount}</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-500 font-medium">
            View all transactions
          </button>
        </div>
      </div>

      {/* Plan Features */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Current Plan Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentPlan.features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Choose Your Plan</h3>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              {/* Billing Toggle */}
              <div className="flex justify-center mb-8">
                <div className="bg-gray-100 rounded-lg p-1 flex">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      billingCycle === 'monthly' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      billingCycle === 'yearly' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600'
                    }`}
                  >
                    Yearly
                    <span className="ml-1 text-green-600 text-xs">Save 17%</span>
                  </button>
                </div>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`relative rounded-lg border-2 p-6 ${
                      plan.popular 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        ${plan.price[billingCycle]}
                      </div>
                      <div className="text-sm text-gray-600">
                        per {billingCycle === 'monthly' ? 'month' : 'year'}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        {typeof plan.contacts === 'number' 
                          ? `${plan.contacts} contacts/month` 
                          : plan.contacts}
                      </div>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                        plan.popular
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {plan.name === currentPlan.name ? 'Current Plan' : 'Upgrade'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  All plans include a 14-day free trial. Cancel anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}