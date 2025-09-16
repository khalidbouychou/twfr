import tawfirProducts from '../Products/Tawfir_Products.json';

class RecommendationEngine {
  constructor() {
    this.products = tawfirProducts;
    this.riskWeights = {
      age: 0.15,
      income: 0.20,
      investmentExperience: 0.25,
      lossReaction: 0.20,
      marketCrashReaction: 0.20
    };
    
    this.durationWeights = {
      savingsDuration: 0.40,
      savingsGoals: 0.30,
      familyStatus: 0.15,
      recurringExpenses: 0.15
    };
  }

  // Calculate user risk profile
  calculateRiskProfile(userData) {
    let riskScore = 0;
    let riskFactors = [];

    // Age factor
    if (userData.age === '0-18') {
      riskScore += 1;
      riskFactors.push({ factor: 'Age jeune', score: 1, weight: this.riskWeights.age });
    } else if (userData.age === '19-59') {
      riskScore += 3;
      riskFactors.push({ factor: 'Age adulte', score: 3, weight: this.riskWeights.age });
    } else if (userData.age === '60+') {
      riskScore += 1;
      riskFactors.push({ factor: 'Age senior', score: 1, weight: this.riskWeights.age });
    }

    // Income factor
    if (userData.incomeRange === 'Moins de 3000 MAD') {
      riskScore += 1;
      riskFactors.push({ factor: 'Revenu faible', score: 1, weight: this.riskWeights.income });
    } else if (userData.incomeRange === '3000 - 6000 MAD') {
      riskScore += 2;
      riskFactors.push({ factor: 'Revenu moyen', score: 2, weight: this.riskWeights.income });
    } else if (userData.incomeRange === 'Plus de 6000 MAD') {
      riskScore += 3;
      riskFactors.push({ factor: 'Revenu élevé', score: 3, weight: this.riskWeights.income });
    }

    // Investment experience factor
    const experienceCount = userData.investmentExperience.length;
    if (experienceCount === 0) {
      riskScore += 1;
      riskFactors.push({ factor: 'Aucune expérience', score: 1, weight: this.riskWeights.investmentExperience });
    } else if (experienceCount <= 2) {
      riskScore += 2;
      riskFactors.push({ factor: 'Expérience limitée', score: 2, weight: this.riskWeights.investmentExperience });
    } else {
      riskScore += 3;
      riskFactors.push({ factor: 'Expérience avancée', score: 3, weight: this.riskWeights.investmentExperience });
    }

    // Loss reaction factor
    if (userData.lossReaction === 'Vendre tout') {
      riskScore += 1;
      riskFactors.push({ factor: 'Réaction conservative', score: 1, weight: this.riskWeights.lossReaction });
    } else if (userData.lossReaction === 'Attendre') {
      riskScore += 2;
      riskFactors.push({ factor: 'Réaction modérée', score: 2, weight: this.riskWeights.lossReaction });
    } else if (userData.lossReaction === 'Investir davantage') {
      riskScore += 3;
      riskFactors.push({ factor: 'Réaction agressive', score: 3, weight: this.riskWeights.lossReaction });
    }

    // Market crash reaction factor
    if (userData.marketCrashReaction === 'Je vends tout') {
      riskScore += 1;
      riskFactors.push({ factor: 'Panique en crash', score: 1, weight: this.riskWeights.marketCrashReaction });
    } else if (userData.marketCrashReaction === 'J\'attends de voir') {
      riskScore += 2;
      riskFactors.push({ factor: 'Attente en crash', score: 2, weight: this.riskWeights.marketCrashReaction });
    } else if (userData.marketCrashReaction === 'J\'investis davantage') {
      riskScore += 3;
      riskFactors.push({ factor: 'Opportunisme en crash', score: 3, weight: this.riskWeights.marketCrashReaction });
    }

    // Determine risk level
    let riskLevel = 'Faible';
    if (riskScore >= 8) {
      riskLevel = 'Élevé';
    } else if (riskScore >= 5) {
      riskLevel = 'Modéré';
    }

    return {
      riskScore,
      riskLevel,
      riskFactors,
      maxRiskScore: 15
    };
  }

  // Calculate investment duration preference
  calculateDurationPreference(userData) {
    let durationScore = 0;
    let durationFactors = [];

    // Savings duration factor
    if (userData.savingsDuration.includes('Court terme')) {
      durationScore += 1;
      durationFactors.push({ factor: 'Objectif court terme', score: 1, weight: this.durationWeights.savingsDuration });
    } else if (userData.savingsDuration.includes('Moyen terme')) {
      durationScore += 2;
      durationFactors.push({ factor: 'Objectif moyen terme', score: 2, weight: this.durationWeights.savingsDuration });
    } else if (userData.savingsDuration.includes('Long terme')) {
      durationScore += 3;
      durationFactors.push({ factor: 'Objectif long terme', score: 3, weight: this.durationWeights.savingsDuration });
    }

    // Savings goals factor
    const goals = userData.savingsGoals;
    if (goals.includes('Voyage') || goals.includes('Fonds de sécurité')) {
      durationScore += 1;
      durationFactors.push({ factor: 'Objectifs courts', score: 1, weight: this.durationWeights.savingsGoals });
    }
    if (goals.includes('Retraite') || goals.includes('Immobilier')) {
      durationScore += 3;
      durationFactors.push({ factor: 'Objectifs longs', score: 3, weight: this.durationWeights.savingsGoals });
    }

    // Family status factor
    if (userData.familyStatus === 'Avec enfant(s)') {
      durationScore += 2;
      durationFactors.push({ factor: 'Famille avec enfants', score: 2, weight: this.durationWeights.familyStatus });
    }

    // Expenses factor
    const expenses = parseFloat(userData.recurringExpenses) || 0;
    if (expenses > 5000) {
      durationScore += 1;
      durationFactors.push({ factor: 'Dépenses élevées', score: 1, weight: this.durationWeights.recurringExpenses });
    }

    // Determine duration preference
    let durationPreference = 'COURT';
    if (durationScore >= 6) {
      durationPreference = 'LONG TERME';
    } else if (durationScore >= 3) {
      durationPreference = 'MOYEN';
    }

    return {
      durationScore,
      durationPreference,
      durationFactors,
      maxDurationScore: 10
    };
  }

  // Calculate ESG compatibility
  calculateESGCompatibility(userData) {
    let esgScore = 0;
    let esgFactors = [];

    // Environmental impact factor
    if (userData.environmentalImpact === 'Très important') {
      esgScore += 3;
      esgFactors.push({ factor: 'Impact environnemental', score: 3 });
    } else if (userData.environmentalImpact === 'Assez important') {
      esgScore += 2;
      esgFactors.push({ factor: 'Impact environnemental', score: 2 });
    }

    // Inclusion policies factor
    if (userData.inclusionPolicies === 'Très important') {
      esgScore += 3;
      esgFactors.push({ factor: 'Politiques d\'inclusion', score: 3 });
    } else if (userData.inclusionPolicies === 'Assez important') {
      esgScore += 2;
      esgFactors.push({ factor: 'Politiques d\'inclusion', score: 2 });
    }

    return {
      esgScore,
      esgFactors,
      maxESGScore: 6
    };
  }

  // Match products with user profile
  matchProducts(userData) {
    const riskProfile = this.calculateRiskProfile(userData);
    const durationProfile = this.calculateDurationPreference(userData);
    const esgProfile = this.calculateESGCompatibility(userData);

    const matchedProducts = this.products.map(product => {
      const productRisk = parseInt(product.risque);
      const productDuration = product.duree_recommandee;
      
      // Calculate risk compatibility
      let riskCompatibility = 0;
      if (riskProfile.riskLevel === 'Faible' && productRisk <= 2) {
        riskCompatibility = 100;
      } else if (riskProfile.riskLevel === 'Modéré' && productRisk <= 4) {
        riskCompatibility = 100;
      } else if (riskProfile.riskLevel === 'Élevé' && productRisk <= 7) {
        riskCompatibility = 100;
      } else {
        riskCompatibility = Math.max(0, 100 - Math.abs(productRisk - this.getRiskScore(riskProfile.riskLevel)) * 20);
      }

      // Calculate duration compatibility
      let durationCompatibility = 0;
      if (productDuration.includes(durationProfile.durationPreference) || 
          productDuration.includes('COURT/MOYEN/LONG TERME')) {
        durationCompatibility = 100;
      } else {
        durationCompatibility = 50;
      }

      // Calculate ESG compatibility (if applicable)
      let esgCompatibility = 100;
      if (esgProfile.esgScore > 0) {
        // For now, all products are considered ESG compatible
        // In a real system, you'd have ESG ratings for each product
        esgCompatibility = 100;
      }

      // Calculate overall compatibility score
      const overallCompatibility = (riskCompatibility * 0.6 + durationCompatibility * 0.3 + esgCompatibility * 0.1);

      return {
        ...product,
        riskCompatibility,
        durationCompatibility,
        esgCompatibility,
        overallCompatibility,
        riskProfile: riskProfile.riskLevel,
        durationProfile: durationProfile.durationPreference
      };
    });

    // Sort by compatibility score
    matchedProducts.sort((a, b) => b.overallCompatibility - a.overallCompatibility);

    return {
      matchedProducts,
      riskProfile,
      durationProfile,
      esgProfile
    };
  }

  // Get risk score for a risk level
  getRiskScore(riskLevel) {
    switch (riskLevel) {
      case 'Faible': return 1.5;
      case 'Modéré': return 3.5;
      case 'Élevé': return 6;
      default: return 3.5;
    }
  }

  // Generate allocation recommendations
  generateAllocation(matchedProducts, userData) {
    const highCompatibility = matchedProducts.filter(p => p.overallCompatibility >= 80);
    const mediumCompatibility = matchedProducts.filter(p => p.overallCompatibility >= 60 && p.overallCompatibility < 80);
    const lowCompatibility = matchedProducts.filter(p => p.overallCompatibility < 60);

    let allocation = [];

    // Allocate based on compatibility levels
    if (highCompatibility.length > 0) {
      const highAllocation = Math.round(70 / highCompatibility.length);
      highCompatibility.forEach((product, index) => {
        allocation.push({
          name: product.nom_produit,
          value: index === highCompatibility.length - 1 ? 70 - (highAllocation * (highCompatibility.length - 1)) : highAllocation,
          color: this.getProductColor(index),
          product: product,
          compatibility: product.overallCompatibility
        });
      });
    }

    if (mediumCompatibility.length > 0 && allocation.length < 3) {
      const mediumAllocation = Math.round(25 / mediumCompatibility.length);
      mediumCompatibility.forEach((product, index) => {
        allocation.push({
          name: product.nom_produit,
          value: index === mediumCompatibility.length - 1 ? 25 - (mediumAllocation * (mediumCompatibility.length - 1)) : mediumAllocation,
          color: this.getProductColor(allocation.length + index),
          product: product,
          compatibility: product.overallCompatibility
        });
      });
    }

    if (lowCompatibility.length > 0 && allocation.length < 4) {
      const lowAllocation = Math.round(5 / lowCompatibility.length);
      lowCompatibility.forEach((product, index) => {
        allocation.push({
          name: product.nom_produit,
          value: index === lowCompatibility.length - 1 ? 5 - (lowAllocation * (lowCompatibility.length - 1)) : lowAllocation,
          color: this.getProductColor(allocation.length + index),
          product: product,
          compatibility: product.overallCompatibility
        });
      });
    }

    return allocation;
  }

  // Get product color based on index
  getProductColor(index) {
    const colors = ['#3CD4AB', '#89559F', '#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF', '#FF9FF3', '#54A0FF'];
    return colors[index % colors.length];
  }

  // Generate alternative scenarios
  generateAlternativeScenarios(matchedProducts, userData) {
    const riskProfile = this.calculateRiskProfile(userData);
    
    return [
      {
        name: 'Scénario Conservateur',
        products: this.products.filter(p => parseInt(p.risque) <= 2),
        compatibility: Math.max(60, 100 - (riskProfile.riskScore * 3)),
        description: 'Privilégie la sécurité et la liquidité',
        type: 'conservative'
      },
      {
        name: 'Scénario Équilibré',
        products: matchedProducts.filter(p => p.overallCompatibility >= 70),
        compatibility: Math.min(95, 70 + (matchedProducts.filter(p => p.overallCompatibility >= 70).length * 5)),
        description: 'Équilibre entre rendement et sécurité',
        type: 'balanced'
      },
      {
        name: 'Scénario Dynamique',
        products: this.products.filter(p => parseInt(p.risque) >= 5),
        compatibility: Math.max(40, 100 - (riskProfile.riskScore * 2)),
        description: 'Optimise le rendement à long terme',
        type: 'aggressive'
      },
      {
        name: 'Scénario Court Terme',
        products: this.products.filter(p => p.duree_recommandee.includes('COURT')),
        compatibility: 75,
        description: 'Investissements à court terme',
        type: 'short-term'
      },
      {
        name: 'Scénario Long Terme',
        products: this.products.filter(p => p.duree_recommandee.includes('LONG')),
        compatibility: 80,
        description: 'Investissements à long terme',
        type: 'long-term'
      }
    ];
  }

  // Generate personalized recommendations
  generateRecommendations(userData, matchedProducts) {
    const recommendations = [];
    const riskProfile = this.calculateRiskProfile(userData);
    const durationProfile = this.calculateDurationPreference(userData);
    const esgProfile = this.calculateESGCompatibility(userData);

    // Goal-based recommendations
    if (userData.savingsGoals.includes('Retraite')) {
      recommendations.push({
        type: 'goal',
        text: 'Pensez à un PER pour optimiser votre retraite',
        priority: 'high'
      });
    }

    if (userData.savingsGoals.includes('Voyage')) {
      recommendations.push({
        type: 'goal',
        text: 'Privilégiez des placements liquides pour vos projets de voyage',
        priority: 'medium'
      });
    }

    if (userData.savingsGoals.includes('Immobilier')) {
      recommendations.push({
        type: 'goal',
        text: 'Envisagez un PEL pour votre projet immobilier',
        priority: 'high'
      });
    }

    // Risk-based recommendations
    if (riskProfile.riskLevel === 'Faible') {
      recommendations.push({
        type: 'risk',
        text: 'Votre profil prudent vous permet de sécuriser votre épargne',
        priority: 'medium'
      });
    } else if (riskProfile.riskLevel === 'Élevé') {
      recommendations.push({
        type: 'risk',
        text: 'Votre tolérance au risque vous permet d\'envisager des placements plus dynamiques',
        priority: 'medium'
      });
    }

    // ESG-based recommendations
    if (esgProfile.esgScore > 3) {
      recommendations.push({
        type: 'esg',
        text: 'Nos fonds ESG correspondent à vos valeurs environnementales',
        priority: 'high'
      });
    }

    // Experience-based recommendations
    if (userData.investmentExperience.length === 0) {
      recommendations.push({
        type: 'experience',
        text: 'Commencez par des produits simples pour vous familiariser',
        priority: 'high'
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // Main recommendation method
  generateCompleteRecommendation(userData) {
    const matching = this.matchProducts(userData);
    const allocation = this.generateAllocation(matching.matchedProducts, userData);
    const scenarios = this.generateAlternativeScenarios(matching.matchedProducts, userData);
    const recommendations = this.generateRecommendations(userData, matching.matchedProducts);

    // Calculate overall compatibility score
    const compatibilityScore = Math.min(95, 70 + (matching.matchedProducts.filter(p => p.overallCompatibility >= 70).length * 5));

    return {
      riskProfile: matching.riskProfile,
      durationProfile: matching.durationProfile,
      esgProfile: matching.esgProfile,
      allocation,
      compatibilityScore,
      alternativeScenarios: scenarios,
      recommendations,
      matchedProducts: matching.matchedProducts,
      excludedProducts: matching.matchedProducts.filter(p => p.overallCompatibility < 50)
    };
  }
}

export default RecommendationEngine; 