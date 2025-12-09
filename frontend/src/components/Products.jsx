import products from './products.json';

export default function Products() {
  return (
    <section id="products" className="py-8 lg:py-16 px-3 lg:px-4 bg-gray-50 rounded-2xl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 lg:mb-14 text-center">
          <h2 className="text-2xl lg:text-4xl font-bold mb-2 text-gray-900">Découvrez nos produits d'investissement</h2>
          <p className="text-base lg:text-lg text-gray-500 px-4">Des solutions adaptées à chaque profil pour faire fructifier votre épargne en toute sécurité.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 xl:gap-8">
          {products.map((product) => (
            <div
             id ={product.id}
              key={product.title}
              className="bg-white border border-gray-200 rounded-2xl p-4 lg:p-7 flex flex-col items-center shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-200 min-h-[280px] lg:min-h-[340px]" data-aos="fade-up"
            >
              <img src={product.icon} alt={product.title} className="w-20 h-20 lg:w-35 lg:h-35 object-contain mb-3 lg:mb-4" />
              <h3 className="text-base lg:text-lg font-bold text-gray-900 text-center mb-2">{product.title}</h3>
              <p className="text-gray-500 text-center text-xs lg:text-sm mb-3 px-2">{product.description}</p>
              <ul className="list-disc list-inside text-gray-600 text-xs lg:text-sm space-y-1 text-left w-full max-w-xs mx-auto">
                {product.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


