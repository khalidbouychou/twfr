const products = [
  {
    id:"Compte-sur-Carnet",
    title: "Compte sur Carnet",
    icon: "../../public/assets/saving.svg",
    description: "Un produit d'épargne garanti, offrant une liquidité immédiate. Il est destiné aux investisseurs conservateurs à la recherche de sécurité, avec une fiscalité de 30% de retenue à la source.",
    features: [
      "Sécurité du capital",
      "Accès immédiat aux fonds",
      "Faible risque",
      "Idéal pour l'épargne de précaution"
    ],
  },
  {
    id:"Dépôt-à-Terme",
    title: "Dépôt à Terme",
    icon: "../../public/assets/deposit.svg",
    description: "Un produit bancaire garanti avec un rendement fixe, mais avec des pénalités si retiré avant l’échéance. Il est adapté aux investisseurs à faible risque et aux objectifs de court terme.",
    features: [
      "Taux d'intérêt fixe",
      "Durée déterminée",
      "Retrait anticipé pénalisé",
      "Garantie du capital"
    ],
  },
  {
    id:"Gestion-sous-Mandat",
    title: "OPCVM Actions",
    icon: "../../public/assets/OPCVM.svg",
    description: "Fonds d'investissement en actions, permettant aux investisseurs d'accéder aux marchés boursiers tout en diversifiant leurs placements. Ce produit est destiné aux investisseurs prêts à prendre plus de risques pour un potentiel de rendement plus élevé.",
    features: [
      "Accès à des marchés diversifiés",
      "Potentiel de rendement élevé",
      "Gestion professionnelle",
      "Risque de perte en capital"
    ],
  },
  {
    id:"OPCVM-Monétaires",
    title: "Gestion sous Mandat",
    icon: "../../public/assets/service.svg",
    description: "Un service où les portefeuilles d'investissement sont gérés par des professionnels, afin d'optimiser la performance selon les objectifs financiers du client. Ce produit est destiné à ceux qui souhaitent déléguer la gestion de leurs investissements dans des actions.",
    features: [
      "Gestion déléguée à des experts",
      "Stratégies personnalisées",
      "Suivi régulier",
      "Potentiel de rendement élevé"
    ],
  },
  {
    id:"OPCVM-Actions",
    title: "OPCVM Monétaires",
    icon: "../../public/assets/marketstock.png",
    description: "Un produit d'investissement à court terme, sécurisé et peu risqué, adapté aux investisseurs cherchant à conserver leur capital tout en obtenant un rendement modéré. Il est souvent utilisé pour des objectifs à court terme, comme des économies de précaution.",
    features: [
      "Placement à court terme",
      "Faible volatilité",
      "Liquidité élevée",
      "Idéal pour la gestion de trésorerie"
    ],
  },
  {
    id:"Produits_Structurés-Capital_Garanti",
    title: "Produits Structurés - Capital Garanti",
    icon: "../../public/assets/products.svg",
    description: "Des produits financiers qui offrent une garantie de capital, tout en offrant une exposition à des rendements potentiels plus élevés en fonction des performances du marché. Idéal pour les investisseurs qui recherchent à la fois sécurité et potentiel de gain.",
    features: [
      "Protection partielle ou totale du capital",
      "Rendement conditionné à la performance d'un indice",
      "Durée déterminée",
      "Adapté aux investisseurs avertis"
    ],
  },
];

export default function Products() {
  return (
    <section id="products" className="py-16 px-4 bg-gray-50 rounded-2xl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 text-center">
          <h2 className="text-4xl font-bold mb-2 text-gray-900">Découvrez nos produits d'investissement</h2>
          <p className="text-lg text-gray-500">Des solutions adaptées à chaque profil pour faire fructifier votre épargne en toute sécurité.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
             id ={product.id}
              key={product.title}
              className="bg-white border border-gray-200 rounded-2xl p-7 flex flex-col items-center shadow-sm hover:shadow-xl hover:scale-105  transition-shadow duration-200 min-h-[340px]" data-aos="fade-up"
            >
              <img src={product.icon} alt={product.title} className="w-35 h-35 object-contain mb-4" />
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">{product.title}</h3>
              <p className="text-gray-500 text-center text-sm mb-3">{product.description}</p>
              <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 text-left w-full max-w-xs mx-auto">
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
