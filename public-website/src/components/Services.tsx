import React from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, 
  Shield, 
  Headphones, 
  RotateCcw, 
  CreditCard, 
  Package,
  Clock,
  Star
} from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: Truck,
      title: 'Free Delivery',
      description: 'Enjoy free delivery on orders over $50. Fast and reliable shipping across New Zealand.',
      features: ['Free on orders $50+', '2-3 business days', 'Track your order', 'Nationwide coverage'],
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Shop with confidence using our secure payment system with multiple payment options.',
      features: ['SSL encryption', 'Multiple payment methods', 'PCI compliant', 'Fraud protection'],
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Our dedicated customer support team is available around the clock to help you.',
      features: ['Live chat support', 'Phone support', 'Email support', 'FAQ database'],
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      description: 'Not satisfied? Return any item within 30 days for a full refund or exchange.',
      features: ['30-day return policy', 'Free return shipping', 'Quick refunds', 'Exchange options'],
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: CreditCard,
      title: 'Flexible Payment',
      description: 'Choose from multiple payment options including buy now, pay later services.',
      features: ['Credit/Debit cards', 'PayPal', 'Buy now, pay later', 'Bank transfers'],
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: Package,
      title: 'Gift Services',
      description: 'Perfect for special occasions with our gift wrapping and delivery services.',
      features: ['Gift wrapping', 'Gift messages', 'Surprise delivery', 'Gift cards'],
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Browse Products',
      description: 'Explore our extensive catalog of quality products across all categories.',
      icon: Package
    },
    {
      step: '02',
      title: 'Add to Cart',
      description: 'Select your favorite items and add them to your shopping cart.',
      icon: CreditCard
    },
    {
      step: '03',
      title: 'Secure Checkout',
      description: 'Complete your purchase with our secure and easy checkout process.',
      icon: Shield
    },
    {
      step: '04',
      title: 'Fast Delivery',
      description: 'Receive your order quickly with our reliable delivery service.',
      icon: Truck
    }
  ];

  return (
    <section id="services" className="section-padding bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We provide comprehensive services to ensure your shopping experience is seamless, 
            secure, and satisfying from start to finish.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg transition-shadow duration-300`}
              >
                <service.icon className="w-8 h-8 text-white" />
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-800 mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

              {/* Features */}
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <motion.li
                    key={featureIndex}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index * 0.1) + (featureIndex * 0.05) }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-2 text-sm text-gray-600"
                  >
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Shopping Process */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-12 shadow-xl"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 gradient-text">How It Works</h3>
            <p className="text-lg text-gray-600">
              Shopping with NZ Mart is simple, secure, and satisfying
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                {/* Step Number */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl shadow-lg"
                >
                  {step.step}
                </motion.div>

                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4"
                >
                  <step.icon className="w-6 h-6 text-gray-600" />
                </motion.div>

                {/* Content */}
                <h4 className="text-lg font-semibold text-gray-800 mb-3">{step.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>

                {/* Connector Line */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 transform translate-x-4"></div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
            <Clock className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Ready to Start Shopping?</h3>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of satisfied customers and experience the NZ Mart difference today.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Browse Products
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
