import tawfirProducts from '../Products/Tawfir_Products.json';

// Precompiled regex for intent extraction
const ESG_REGEX = /\b(?:esg|durable|responsable|environnement|social|gouvernance)\b/i;
const LONG_REGEX = /long|retraite|10\s*ans|5\s*ans/i;
const MED_REGEX = /moyen|3\s*ans|2\s*ans|1\s*an/i;
const SHORT_REGEX = /court|6\s*mois|12\s*mois|urgent|liquidit[é|e]/i;
const CONSERVATIVE_REGEX = /(faible risque|peu de risque|sécur|secur|capital garanti|mon[ée]taire|obligations)/i;
const AGGRESSIVE_REGEX = /(rendement [ée]lev[ée]|agressif|actions|dynamique|croissance|performance)/i;

class NewRecommendationEngine {
  constructor() {
    this.products = tawfirProducts;
  }

  // Extract lightweight user intent from free-form answers
  deriveUserIntent(userAnswers) {
    const text = (userAnswers || [])
      .map((a) => `${a.q || ''} ${Array.isArray(a.answer) ? a.answer.join(' ') : a.answer || ''}`)
      .join(' ');

    const wantsESG = ESG_REGEX.test(text);
    const longTerm = LONG_REGEX.test(text);
    const mediumTerm = MED_REGEX.test(text);
    const shortTerm = SHORT_REGEX.test(text);

    const conservative = CONSERVATIVE_REGEX.test(text);
    const aggressive = AGGRESSIVE_REGEX.test(text);

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
    let score = 60; // base score ensures stable ordering

    // Risk alignment
    const pRisk = Number(product.risque) || 3;
    if (intent.risk === 'faible') {
      if (pRisk <= 2) score += 25;
      else if (pRisk <= 4) score += 10;
      else score -= 10;
    } else if (intent.risk === 'modere') {
      if (pRisk <= 4) score += 20;
      else if (pRisk <= 6) score += 5;
      else score -= 10;
    } else if (intent.risk === 'eleve') {
      if (pRisk >= 5) score += 25;
      else if (pRisk >= 3) score += 10;
      else score -= 10;
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
    if (!Number.isNaN(roi)) score += Math.min(10, Math.max(0, roi - 3));

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
      color: palette[i % palette.length],
    }));
  }

  // Public API: generate using userAnswers array
  generateFromUserAnswers(userAnswers) {
    const intent = this.deriveUserIntent(userAnswers);

    const enriched = this.products
      .map((p) => {
        const overallCompatibility = this.computeCompatibility(p, intent);
        const annual = Number(p.rendement_annuel_moyen ?? p.roi_annuel ?? 5);
        return {
          ...p,
          overallCompatibility,
          roi_annuel: Number.isNaN(annual) ? 5 : annual,
          volatilite:
            Number(p.volatilite) || (Number(p.risque) >= 5 ? 8 : Number(p.risque) <= 2 ? 2 : 5),
          liquidite: p.liquidite || 'Standard',
        };
      })
      .sort((a, b) => b.overallCompatibility - a.overallCompatibility);

    const allocation = this.buildAllocation(enriched);

    const riskProfile = {
      riskLevel: intent.risk === 'faible' ? 'Faible' : intent.risk === 'eleve' ? 'Élevé' : 'Modéré',
      scoreHint: intent.risk,
    };

    const durationProfile = {
      durationPreference: intent.horizon,
    };

    const compatibilityScore = Math.round(
      enriched
        .slice(0, 5)
        .reduce((s, p) => s + p.overallCompatibility, 0) / Math.max(1, Math.min(5, enriched.length))
    );

    return {
      riskProfile,
      durationProfile,
      allocation,
      matchedProducts: enriched,
      recommendations: [],
      alternativeScenarios: [],
      compatibilityScore,
    };
  }

  // Backward-compatible method name used elsewhere
  generateCompleteRecommendation(userAnswers) {
    return this.generateFromUserAnswers(userAnswers);
  }
}

export default NewRecommendationEngine;
