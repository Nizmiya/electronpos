import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Globe, Heart, TrendingUp, Shield } from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    { number: '50K+', label: 'Happy Customers', icon: Users },
    { number: '10K+', label: 'Products', icon: Award },
    { number: '99%', label: 'Satisfaction Rate', icon: Heart },
    { number: '24/7', label: 'Customer Support', icon: Shield },
  ];

  const values = [
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Serving customers across Sri Lanka with fast and reliable delivery services.'
    },
    {
      icon: TrendingUp,
      title: 'Quality First',
      description: 'We carefully curate our products to ensure the highest quality standards.'
    },
    {
      icon: Heart,
      title: 'Customer Care',
      description: 'Your satisfaction is our priority. We go above and beyond to serve you better.'
    },
    {
      icon: Shield,
      title: 'Secure Shopping',
      description: 'Shop with confidence knowing your data and payments are completely secure.'
    }
  ];

  return (
    <section id="about" className="section-padding bg-white">
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
            <span className="gradient-text">About</span> NZ Mart
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're NZ Mart, Sri Lanka's premier online retail destination, committed to bringing you 
            the best products at unbeatable prices with exceptional customer service.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-800">
                Your Trusted Shopping Partner Since 2020
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                NZ Mart was founded with a simple mission: to make quality products accessible 
                to every customer in Sri Lanka. We believe that great shopping shouldn't be complicated 
                or expensive.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our team of experts carefully selects each product in our catalog, ensuring 
                that you get the best value for your money. From the latest electronics to 
                everyday essentials, we've got you covered.
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-2 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl hover:shadow-lg transition-shadow duration-300"
                >
                  <value.icon className="w-8 h-8 text-blue-600 mb-4" />
                  <h4 className="font-semibold text-gray-800 mb-2">{value.title}</h4>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-8 text-center">Our Impact</h3>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <stat.icon className="w-8 h-8 mx-auto mb-3" />
                    <div className="text-3xl font-bold mb-1">{stat.number}</div>
                    <div className="text-sm opacity-90">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Achievement Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { title: 'Best Online Store 2023', color: 'from-yellow-400 to-orange-500' },
                { title: 'Customer Choice Award', color: 'from-green-400 to-blue-500' },
                { title: 'Fastest Delivery', color: 'from-purple-400 to-pink-500' },
                { title: 'Most Trusted Brand', color: 'from-blue-400 to-purple-500' },
              ].map((badge, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className={`bg-gradient-to-r ${badge.color} p-4 rounded-xl text-white text-center shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <Award className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm font-semibold">{badge.title}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12"
        >
          <h3 className="text-3xl font-bold mb-6 gradient-text">Our Mission</h3>
          <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
            "To revolutionize online shopping in Sri Lanka by providing exceptional products, 
            unbeatable prices, and outstanding customer service. We're committed to making 
            quality accessible to everyone, everywhere."
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-8 flex justify-center"
          >
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-semibold">Made with ❤️ in Sri Lanka</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
