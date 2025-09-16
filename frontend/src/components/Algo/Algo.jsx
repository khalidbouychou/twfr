import React from 'react';
import realProducts from '../Products/Tawfir_Products.json';

// Real products data from Tawfir_Products.json with ROI information
const REAL_PRODUCTS = realProducts.map(product => ({
  id: product.id,
  nom_produit: product.nom_produit,
  type: product.famille,
  risque: product.risque,
  duree_recommandee: product.duree_recommandee,
  rendement: `${product.rendement_annuel_moyen}%`,
  rendement_annuel_moyen: product.rendement_annuel_moyen,
  montant_min: product.ticket_entree_minimum,
  avatar: product.avatar,
  categories: [product.famille, product.type_investissement],
  description: product.description,
  // Add ROI fields for better display
  roi_annuel: product.rendement_annuel_moyen,
  roi_3_ans: product.rendement_annuel_moyen * 3,
  roi_5_ans: product.rendement_annuel_moyen * 5,
  roi_10_ans: product.rendement_annuel_moyen * 10,
  volatilite: product.volatilite === "très faible" ? 1 : 
              product.volatilite === "faible" ? 2 : 
              product.volatilite === "modérée" ? 4 : 
              product.volatilite === "élevée" ? 7 : 5,
  frais_annuels: product.famille === "actions" ? 1.5 : 
                 product.famille === "obligations" ? 1.0 : 
                 product.famille === "épargne" ? 0.5 : 1.0,
  compatibilite: {
    age: { "0-18": 0.9, "19-59": 0.8, "60+": 0.9 },
    incomeRange: { "Moins de 3000 MAD": 0.9, "3000 - 6000 MAD": 0.8, "Plus de 6000 MAD": 0.7 },
    savingsDuration: { "Court terme": 0.9, "Moyen terme": 0.7, "Long terme": 0.5 },
    riskTolerance: { "Faible": 0.9, "Modéré": 0.7, "Élevé": 0.4 }
  }
}));

export class RecommendationEngine {
  constructor() {
    this.products = REAL_PRODUCTS;
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
    
    if (product.montant_min > 5000 && userAnswers.incomeRange === "Moins de 3000 MAD") {
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