import React from 'react';

// Mock products data - in a real app this would come from an API
const MOCK_PRODUCTS = [
  {
    id: 1,
    nom_produit: "Livret A",
    type: "Épargne",
    risque: 1,
    duree_recommandee: "Court terme",
    rendement: "3%",
    montant_min: 100,
    avatar: "/assets/saving.svg",
    categories: ["Épargne", "Sécurité"],
    compatibilite: {
      age: { "0-18": 0.9, "19-59": 0.8, "60+": 0.9 },
      incomeRange: { "Moins de 3000 Dhs": 0.9, "3000 - 6000 Dhs": 0.8, "Plus de 6000 Dhs": 0.7 },
      savingsDuration: { "Court terme": 0.9, "Moyen terme": 0.7, "Long terme": 0.5 },
      riskTolerance: { "Faible": 0.9, "Modéré": 0.7, "Élevé": 0.4 }
    }
  },
  {
    id: 2,
    nom_produit: "Fonds Équilibré",
    type: "Fonds",
    risque: 4,
    duree_recommandee: "Moyen terme",
    rendement: "6-8%",
    montant_min: 1000,
    avatar: "/assets/products.svg",
    categories: ["Fonds", "Équilibré"],
    compatibilite: {
      age: { "0-18": 0.6, "19-59": 0.8, "60+": 0.7 },
      incomeRange: { "Moins de 3000 Dhs": 0.6, "3000 - 6000 Dhs": 0.8, "Plus de 6000 Dhs": 0.9 },
      savingsDuration: { "Court terme": 0.5, "Moyen terme": 0.9, "Long terme": 0.8 },
      riskTolerance: { "Faible": 0.5, "Modéré": 0.9, "Élevé": 0.7 }
    }
  },
  {
    id: 3,
    nom_produit: "Actions Tech",
    type: "Actions",
    risque: 6,
    duree_recommandee: "Long terme",
    rendement: "10-15%",
    montant_min: 5000,
    avatar: "/assets/stock.png",
    categories: ["Actions", "Croissance"],
    compatibilite: {
      age: { "0-18": 0.7, "19-59": 0.8, "60+": 0.5 },
      incomeRange: { "Moins de 3000 Dhs": 0.4, "3000 - 6000 Dhs": 0.7, "Plus de 6000 Dhs": 0.9 },
      savingsDuration: { "Court terme": 0.3, "Moyen terme": 0.6, "Long terme": 0.9 },
      riskTolerance: { "Faible": 0.3, "Modéré": 0.6, "Élevé": 0.9 }
    }
  },
  {
    id: 4,
    nom_produit: "Obligations d'État",
    type: "Obligations",
    risque: 2,
    duree_recommandee: "Moyen terme",
    rendement: "4-5%",
    montant_min: 2000,
    avatar: "/assets/OPCVM.jpg",
    categories: ["Obligations", "Sécurité"],
    compatibilite: {
      age: { "0-18": 0.5, "19-59": 0.7, "60+": 0.8 },
      incomeRange: { "Moins de 3000 Dhs": 0.7, "3000 - 6000 Dhs": 0.8, "Plus de 6000 Dhs": 0.8 },
      savingsDuration: { "Court terme": 0.6, "Moyen terme": 0.8, "Long terme": 0.7 },
      riskTolerance: { "Faible": 0.8, "Modéré": 0.7, "Élevé": 0.5 }
    }
  },
  {
    id: 5,
    nom_produit: "Immobilier Locatif",
    type: "Immobilier",
    risque: 5,
    duree_recommandee: "Long terme",
    rendement: "8-12%",
    montant_min: 100000,
    avatar: "/assets/managed.jpg",
    categories: ["Immobilier", "Rendement"],
    compatibilite: {
      age: { "0-18": 0.3, "19-59": 0.8, "60+": 0.6 },
      incomeRange: { "Moins de 3000 Dhs": 0.2, "3000 - 6000 Dhs": 0.6, "Plus de 6000 Dhs": 0.9 },
      savingsDuration: { "Court terme": 0.2, "Moyen terme": 0.5, "Long terme": 0.9 },
      riskTolerance: { "Faible": 0.4, "Modéré": 0.7, "Élevé": 0.8 }
    }
  },
  {
    id: 6,
    nom_produit: "Cryptomonnaies",
    type: "Crypto",
    risque: 7,
    duree_recommandee: "Long terme",
    rendement: "20-50%",
    montant_min: 100,
    avatar: "/assets/marketstock.png",
    categories: ["Crypto", "Spéculatif"],
    compatibilite: {
      age: { "0-18": 0.8, "19-59": 0.7, "60+": 0.4 },
      incomeRange: { "Moins de 3000 Dhs": 0.6, "3000 - 6000 Dhs": 0.7, "Plus de 6000 Dhs": 0.8 },
      savingsDuration: { "Court terme": 0.4, "Moyen terme": 0.6, "Long terme": 0.8 },
      riskTolerance: { "Faible": 0.2, "Modéré": 0.5, "Élevé": 0.9 }
    }
  }
];

export class RecommendationEngine {
  constructor() {
    this.products = MOCK_PRODUCTS;
  }

  // Calculate risk tolerance based on user answers
  calculateRiskTolerance(userAnswers) {
    let riskScore = 0;
    
    // Investment experience
    if (userAnswers.investmentExperience.includes('Cryptomonnaies')) riskScore += 2;
    if (userAnswers.investmentExperience.includes('Actions')) riskScore += 1;
    if (userAnswers.investmentExperience.includes('Obligations')) riskScore += 0;
    if (userAnswers.investmentExperience.includes('Immobilier')) riskScore += 1;
    if (userAnswers.investmentExperience.includes('Aucun')) riskScore -= 1;
    
    // Loss reaction
    if (userAnswers.lossReaction === 'Investir davantage') riskScore += 2;
    if (userAnswers.lossReaction === 'Attendre') riskScore += 1;
    if (userAnswers.lossReaction === 'Vendre tout') riskScore -= 1;
    
    // Market crash reaction
    if (userAnswers.marketCrashReaction === "J'investis davantage") riskScore += 2;
    if (userAnswers.marketCrashReaction === "J'attends de voir") riskScore += 1;
    if (userAnswers.marketCrashReaction === "Je vends tout") riskScore -= 1;
    
    // Investment basis
    if (userAnswers.investmentBasis === "Mon intuition") riskScore += 1;
    if (userAnswers.investmentBasis === "L'avis d'un proche ou expert") riskScore += 0;
    if (userAnswers.investmentBasis === "Des analyses fiables") riskScore += 1;
    
    // Normalize to 0-2 scale
    riskScore = Math.max(0, Math.min(2, riskScore));
    
    if (riskScore <= 0.5) return "Faible";
    if (riskScore <= 1.5) return "Modéré";
    return "Élevé";
  }

  // Calculate product compatibility score
  calculateProductCompatibility(userAnswers, product) {
    let totalScore = 0;
    let maxScore = 0;
    
    // Age compatibility
    if (product.compatibilite.age[userAnswers.age]) {
      totalScore += product.compatibilite.age[userAnswers.age] * 25;
      maxScore += 25;
    }
    
    // Income compatibility
    if (product.compatibilite.incomeRange[userAnswers.incomeRange]) {
      totalScore += product.compatibilite.incomeRange[userAnswers.incomeRange] * 25;
      maxScore += 25;
    }
    
    // Duration compatibility
    if (product.compatibilite.savingsDuration[userAnswers.savingsDuration]) {
      totalScore += product.compatibilite.savingsDuration[userAnswers.savingsDuration] * 25;
      maxScore += 25;
    }
    
    // Risk tolerance compatibility
    const riskTolerance = this.calculateRiskTolerance(userAnswers);
    if (product.compatibilite.riskTolerance[riskTolerance]) {
      totalScore += product.compatibilite.riskTolerance[riskTolerance] * 25;
      maxScore += 25;
    }
    
    // Additional factors
    if (userAnswers.savingsGoals.includes('Retraite') && product.type === 'Obligations') {
      totalScore += 10;
      maxScore += 10;
    }
    
    if (userAnswers.savingsGoals.includes('Immobilier') && product.type === 'Immobilier') {
      totalScore += 10;
      maxScore += 10;
    }
    
    if (userAnswers.savingsGoals.includes('Fonds de sécurité') && product.risque <= 2) {
      totalScore += 10;
      maxScore += 10;
    }
    
    return maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  }

  // Generate portfolio allocation
  generatePortfolioAllocation(userAnswers) {
    const riskTolerance = this.calculateRiskTolerance(userAnswers);
    const age = userAnswers.age;
    
    let allocation = {
      conservative: 0,
      balanced: 0,
      aggressive: 0
    };
    
    if (riskTolerance === "Faible" || age === "60+") {
      allocation = { conservative: 60, balanced: 30, aggressive: 10 };
    } else if (riskTolerance === "Modéré" || age === "19-59") {
      allocation = { conservative: 40, balanced: 40, aggressive: 20 };
    } else {
      allocation = { conservative: 20, balanced: 40, aggressive: 40 };
    }
    
    return allocation;
  }

  // Generate complete recommendation
  generateCompleteRecommendation(userAnswers) {
    const riskProfile = {
      riskLevel: this.calculateRiskTolerance(userAnswers),
      description: this.getRiskDescription(this.calculateRiskTolerance(userAnswers))
    };
    
    const matchedProducts = this.products
      .map(product => ({
        ...product,
        overallCompatibility: this.calculateProductCompatibility(userAnswers, product)
      }))
      .filter(product => product.overallCompatibility > 50)
      .sort((a, b) => b.overallCompatibility - a.overallCompatibility);
    
    const portfolioAllocation = this.generatePortfolioAllocation(userAnswers);
    
    const excludedProducts = this.products
      .filter(product => this.calculateProductCompatibility(userAnswers, product) <= 50)
      .map(product => ({
        ...product,
        reason: this.getExclusionReason(userAnswers, product)
      }));
    
    return {
      riskProfile,
      matchedProducts,
      portfolioAllocation,
      excludedProducts,
      userAnswers,
      timestamp: new Date().toISOString()
    };
  }

  // Get risk description
  getRiskDescription(riskLevel) {
    const descriptions = {
      "Faible": "Vous préférez la sécurité et la stabilité. Vos investissements seront principalement orientés vers des produits à faible risque avec des rendements modérés mais réguliers.",
      "Modéré": "Vous acceptez un niveau de risque modéré pour obtenir de meilleurs rendements. Votre portefeuille sera équilibré entre sécurité et croissance.",
      "Élevé": "Vous êtes à l'aise avec le risque et recherchez des rendements élevés. Vos investissements incluront des produits plus volatils avec un potentiel de croissance important."
    };
    return descriptions[riskLevel] || descriptions["Modéré"];
  }

  // Get exclusion reason
  getExclusionReason(userAnswers, product) {
    const riskTolerance = this.calculateRiskTolerance(userAnswers);
    
    if (product.risque > 6 && riskTolerance === "Faible") {
      return "Risque trop élevé pour votre profil";
    }
    
    if (product.montant_min > 5000 && userAnswers.incomeRange === "Moins de 3000 Dhs") {
      return "Montant minimum trop élevé pour vos revenus";
    }
    
    if (product.duree_recommandee === "Long terme" && userAnswers.savingsDuration === "Court terme") {
      return "Durée incompatible avec vos objectifs";
    }
    
    return "Compatibilité insuffisante avec votre profil";
  }

  // Generate alternative scenarios
  generateAlternativeScenarios(userAnswers) {
    const scenarios = [
      {
        name: "Scénario Conservateur",
        description: "Focus sur la sécurité et la stabilité",
        allocation: { conservative: 70, balanced: 25, aggressive: 5 },
        products: this.products.filter(p => p.risque <= 3).slice(0, 3)
      },
      {
        name: "Scénario Équilibré",
        description: "Équilibre entre sécurité et croissance",
        allocation: { conservative: 40, balanced: 45, aggressive: 15 },
        products: this.products.filter(p => p.risque >= 2 && p.risque <= 5).slice(0, 3)
      },
      {
        name: "Scénario Croissance",
        description: "Focus sur la croissance et les rendements",
        allocation: { conservative: 20, balanced: 35, aggressive: 45 },
        products: this.products.filter(p => p.risque >= 4).slice(0, 3)
      },
      {
        name: "Scénario Retraite",
        description: "Optimisé pour la préparation à la retraite",
        allocation: { conservative: 50, balanced: 35, aggressive: 15 },
        products: this.products.filter(p => p.type === 'Obligations' || p.type === 'Fonds').slice(0, 3)
      },
      {
        name: "Scénario ESG",
        description: "Investissements responsables et durables",
        allocation: { conservative: 30, balanced: 50, aggressive: 20 },
        products: this.products.filter(p => p.categories.includes('Équilibré')).slice(0, 3)
      }
    ];
    
    return scenarios;
  }
}

export default RecommendationEngine; 