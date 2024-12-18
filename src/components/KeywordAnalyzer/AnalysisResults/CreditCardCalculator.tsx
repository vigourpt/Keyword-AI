import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';

interface CalculatorProps {
  monthlySpending: number;
  interestRate: number;
  minimumPayment: number;
}

export const CreditCardCalculator: React.FC = () => {
  const [values, setValues] = useState<CalculatorProps>({
    monthlySpending: 1000,
    interestRate: 18.99,
    minimumPayment: 25
  });

  const [results, setResults] = useState({
    totalInterest: 0,
    monthsToPayoff: 0,
    totalPayment: 0,
    isValid: true,
    errorMessage: ''
  });

  const validateInputs = () => {
    if (values.monthlySpending <= 0) {
      return { isValid: false, message: 'Monthly spending must be greater than 0' };
    }
    if (values.interestRate <= 0 || values.interestRate > 100) {
      return { isValid: false, message: 'Interest rate must be between 0 and 100' };
    }
    if (values.minimumPayment <= 0) {
      return { isValid: false, message: 'Minimum payment must be greater than 0' };
    }
    return { isValid: true, message: '' };
  };

  const calculateResults = () => {
    const validation = validateInputs();
    if (!validation.isValid) {
      setResults({
        ...results,
        isValid: false,
        errorMessage: validation.message
      });
      return;
    }

    const monthlyRate = values.interestRate / 100 / 12;
    let balance = values.monthlySpending;
    let totalInterest = 0;
    let months = 0;
    let totalPayment = 0;

    while (balance > 1 && months < 360) { // Cap at 30 years, use 1 to account for floating point
      const interest = balance * monthlyRate;
      totalInterest += interest;
      
      const minRequired = Math.max(
        values.minimumPayment,
        balance * 0.02 // 2% of balance minimum payment
      );
      
      const payment = Math.min(balance + interest, minRequired);
      balance = balance + interest - payment;
      totalPayment += payment;
      months++;
    }

    setResults({
      totalInterest: Math.round(totalInterest * 100) / 100,
      monthsToPayoff: months >= 360 ? -1 : months,
      totalPayment: Math.round(totalPayment * 100) / 100,
      isValid: true,
      errorMessage: ''
    });
  };

  useEffect(() => {
    calculateResults();
  }, [values]);

  const handleInputChange = (field: keyof CalculatorProps, value: string) => {
    const numValue = parseFloat(value) || 0;
    setValues(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Credit Card Payment Calculator</h3>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Monthly Spending ($)
            </label>
            <input
              type="number"
              value={values.monthlySpending}
              onChange={(e) => handleInputChange('monthlySpending', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              min="0"
              step="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Interest Rate (%)
            </label>
            <input
              type="number"
              value={values.interestRate}
              onChange={(e) => handleInputChange('interestRate', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              min="0"
              max="100"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Minimum Payment ($)
            </label>
            <input
              type="number"
              value={values.minimumPayment}
              onChange={(e) => handleInputChange('minimumPayment', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              min="0"
              step="5"
            />
          </div>
        </div>

        {!results.isValid && (
          <div className="text-red-500 text-sm mt-2">
            {results.errorMessage}
          </div>
        )}

        {results.isValid && (
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Total Interest</h4>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                ${results.totalInterest.toLocaleString()}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Time to Pay Off</h4>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                {results.monthsToPayoff === -1 
                  ? 'Over 30 years'
                  : `${results.monthsToPayoff} months`}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Total Payment</h4>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                ${results.totalPayment.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
