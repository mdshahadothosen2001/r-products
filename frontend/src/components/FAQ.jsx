import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, SparklesIcon } from '@heroicons/react/24/solid';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-md p-6 border border-pink-100 hover:shadow-lg transition-shadow duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left font-semibold text-lg text-pink-700 hover:text-pink-900 transition-colors"
      >
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-5 h-5 text-pink-500" />
          {question}
        </div>
        {isOpen ? (
          <ChevronUpIcon className="w-6 h-6 text-pink-700" />
        ) : (
          <ChevronDownIcon className="w-6 h-6 text-pink-700" />
        )}
      </button>
      <div
        className={`mt-3 text-gray-700 text-base transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p>{answer}</p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "What are the best products for sensitive skin?",
      answer: "We recommend hypoallergenic and dermatologist-tested products specifically formulated for sensitive skin."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes! We ship worldwide. Shipping charges and delivery time vary depending on the destination."
    },
    {
      question: "Can I return a product if I don’t like it?",
      answer: "Yes, returns are accepted within 14 days of purchase, following our return policy."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order is shipped, you will receive a tracking number via email to track your delivery."
    },
    {
      question: "Are your products cruelty-free?",
      answer: "Absolutely! All our cosmetics are cruelty-free and made with ethically sourced ingredients."
    },
  ];

  return (
    <div className="mx-[10%] md:mx-[15%] lg:mx-[20%] my-16">
      <h2 className="text-4xl font-extrabold mb-12 text-center text-pink-600 bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 bg-clip-text text-transparent">
        Frequently Asked Questions (FAQ)
      </h2>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

export default FAQ;
