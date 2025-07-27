import { motion } from "framer-motion";
import { Leaf, Award, TrendingUp, Heart } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Leaf,
      title: "Produtos Orgânicos",
      description: "Produtos frescos e orgânicos diretamente dos produtores locais",
    },
    {
      icon: Award,
      title: "Qualidade Garantida",
      description: "Produtos selecionados com os mais altos padrões de qualidade",
    },
    {
      icon: TrendingUp,
      title: "Preços Justos",
      description: "Preços acessíveis e competitivos para toda a comunidade",
    },
    {
      icon: Heart,
      title: "Comunidade Unida",
      description: "Apoio aos produtores locais e fortalecimento da economia regional",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white scroll-overscroll">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Por que escolher nossa feira?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Descubra as vantagens de comprar na Feira Livre de Buritizeiro
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center h-full min-h-[280px] flex flex-col justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed flex-1">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 