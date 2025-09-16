import tawfirProducts from '../Products/Tawfir_Products.json';

class NewRecommendationEngine {
  constructor() {
    this.products = tawfirProducts;
  }

  // Extract lightweight user intent from free-form answers
  deriveUserIntent(userAnswers) {
    const text = (userAnswers || [])
      .map(a => `${a.q || ''} ${Array.isArray(a.answer) ? a.answer.join(' ') : a.answer || ''}`)
      .join(' ') 
      .toLowerCase();

    const wantsESG = /esg|durable|responsable|environnement|social|gouvernance/.test(text);
    const longTerm = /long|retraite|10\s*ans|5\s*ans/.test(text);
    const mediumTerm = /moyen|3\s*ans|2\s*ans|1\s*an/.test(text);
    const shortTerm = /court|6\s*mois|12\s*mois|urgent|liquidité|liquidite/.test(text);

    const conservative = /(faible risque|peu de risque|sécur|secur|capital garanti|monétaire|monetaire|obligations)/.test(text);
    const aggressive = /(rendement élevé|agressif|actions|dynamique|croissance|performance)/.test(text);

    let risk = 'modere';
    if (conservative && !aggressive) risk = 'faible';
    if (aggressive && !conservative) risk = 'eleve';

    let horizon = 'MOYEN';
    if (longTerm) horizon = 'LONG TERME';
    else if (shortTerm) horizon = 'COURT';
    else if (mediumTerm) horizon = 'MOYEN';

    return { wantsESG, risk, horizon };
  }

  // Compatibility scoring between a product and intent
  computeCompatibility(product, intent) {
    // Base score from 60 to ensure some ordering even with sparse data
    let score = 60;

    // Risk alignment
    const pRisk = Number(product.risque) || 3;
    if (intent.risk === 'faible') {
      if (pRisk <= 2) score += 25; else if (pRisk <= 4) score += 10; else score -= 10;
    } else if (intent.risk === 'modere') {
      if (pRisk <= 4) score += 20; else if (pRisk <= 6) score += 5; else score -= 10;
    } else if (intent.risk === 'eleve') {
      if (pRisk >= 5) score += 25; else if (pRisk >= 3) score += 10; else score -= 10;
    }

    // Horizon alignment
    const dur = (product.duree_recommandee || '').toUpperCase();
    if (intent.horizon === 'COURT' && /COURT/.test(dur)) score += 15;
    else if (intent.horizon === 'MOYEN' && /MOYEN/.test(dur)) score += 12;
    else if (intent.horizon === 'LONG TERME' && /LONG/.test(dur)) score += 15;
    else if (/COURT\/MOYEN\/LONG/.test(dur)) score += 10; // flexible duration

    // ESG preference: lightly reward all funds for now
    if (intent.wantsESG) score += 5;

    // ROI sweetener
    const roi = Number(product.rendement_annuel_moyen ?? product.roi_annuel ?? 5);
    if (!Number.isNaN(roi)) score += Math.min(10, Math.max(0, (roi - 3)));

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  // Build allocation list from ranked products (top 4)
  buildAllocation(rankedProducts) {
    const top = rankedProducts.slice(0, 4);
    const weights = [40, 30, 20, 10];
    const palette = ['#3CD4AB', '#89559F', '#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF'];
    return top.map((p, i) => ({
      name: p.nom_produit,
      value: weights[i] || 10,
      color: palette[i % palette.length]
    }));
  }

  // Public API: generate using userAnswers array
  generateFromUserAnswers(userAnswers) {
    const intent = this.deriveUserIntent(userAnswers);

    const enriched = this.products.map(p => {
      const overallCompatibility = this.computeCompatibility(p, intent);
      const annual = Number(p.rendement_annuel_moyen ?? p.roi_annuel ?? 5);
      return {
        ...p,
        overallCompatibility,
        roi_annuel: Number.isNaN(annual) ? 5 : annual,
        volatilite: Number(p.volatilite) || (Number(p.risque) >= 5 ? 8 : Number(p.risque) <= 2 ? 2 : 5),
        liquidite: p.liquidite || 'Standard',
      };
    }).sort((a, b) => b.overallCompatibility - a.overallCompatibility);

    const allocation = this.buildAllocation(enriched);

    const riskProfile = {
      riskLevel: intent.risk === 'faible' ? 'Faible' : intent.risk === 'eleve' ? 'Élevé' : 'Modéré',
      scoreHint: intent.risk,
    };

    const durationProfile = {
      durationPreference: intent.horizon,
    };

    return {
      riskProfile,
      durationProfile,
      allocation,
      matchedProducts: enriched,
      recommendations: [],
      alternativeScenarios: [],
      compatibilityScore: Math.round(enriched.slice(0, 5).reduce((s, p) => s + p.overallCompatibility, 0) / Math.max(1, Math.min(5, enriched.length)))
    };
  }

  // Backward-compatible method name used elsewhere
  generateCompleteRecommendation(userAnswers) {
    return this.generateFromUserAnswers(userAnswers);
  }
}

export default NewRecommendationEngine; 