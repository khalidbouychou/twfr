/**
 * Knowledge Base for RAG (Retrieval Augmented Generation)
 * Contains structured information about Tawfir investment platform
 */

export const knowledgeBase = [
  {
    id: 1,
    category: "platform",
    topic: "À propos de Tawfir",
    content: `Tawfir est une plateforme d'investissement intelligente qui utilise l'IA pour aider les utilisateurs à prendre des décisions d'investissement éclairées. 
    La plateforme offre des recommandations personnalisées basées sur le profil de risque, les objectifs financiers et les conditions du marché.
    Tawfir propose une analyse en temps réel du portefeuille, des outils de calcul de ROI, et un assistant IA pour guider les investisseurs.`,
    keywords: [
      "tawfir",
      "plateforme",
      "investissement",
      "à propos",
      "présentation",
    ],
    weight: 1.0,
  },
  {
    id: 2,
    category: "investment",
    topic: "Stratégies d'investissement",
    content: `Les principales stratégies d'investissement incluent:
    1. Dollar Cost Averaging (DCA): Investir régulièrement des montants fixes pour lisser la volatilité
    2. Diversification: Répartir les investissements sur différents secteurs et classes d'actifs
    3. Buy and Hold: Investissement à long terme (5+ ans) pour bénéficier de la croissance composée
    4. Value Investing: Acheter des actifs sous-évalués avec un potentiel de croissance
    5. Growth Investing: Cibler des entreprises à forte croissance
    
    Pour les débutants, nous recommandons de commencer avec 60% actions, 30% obligations, 10% liquidités, et d'ajuster selon l'âge et la tolérance au risque.`,
    keywords: [
      "stratégie",
      "investissement",
      "DCA",
      "diversification",
      "buy and hold",
      "long terme",
    ],
    weight: 1.0,
  },
  {
    id: 3,
    category: "risk",
    topic: "Gestion des risques",
    content: `La gestion des risques est essentielle pour protéger votre capital:
    1. Ne jamais investir plus de 5-10% dans un seul actif
    2. Diversifier sur au moins 5-6 secteurs différents
    3. Adapter l'allocation selon la formule: (100 - âge) = % en actions
    4. Maintenir une réserve d'urgence de 3-6 mois de dépenses
    5. Rééquilibrer le portefeuille tous les 3-6 mois
    6. Utiliser des stop-loss pour limiter les pertes
    7. Investir uniquement l'argent que vous pouvez vous permettre de perdre
    
    Le risque et le rendement sont corrélés: les investissements plus risqués offrent potentiellement des rendements plus élevés.`,
    keywords: [
      "risque",
      "gestion",
      "protection",
      "capital",
      "stop-loss",
      "diversification",
    ],
    weight: 1.0,
  },
  {
    id: 4,
    category: "assets",
    topic: "Classes d'actifs",
    content: `Les principales classes d'actifs disponibles:
    
    ACTIONS: 
    - Potentiel de croissance élevé (8-12% annuel historique)
    - Volatilité plus importante
    - Idéal pour horizon >5 ans
    - Dividendes possibles
    
    OBLIGATIONS:
    - Revenus fixes et prévisibles (3-6% annuel)
    - Moins volatiles que les actions
    - Protection contre l'inflation
    - Idéal pour stabiliser le portefeuille
    
    IMMOBILIER (REIT/SCPI):
    - Revenus locatifs réguliers
    - Diversification hors marchés financiers
    - Protection contre l'inflation
    - Rendement moyen 4-8% annuel
    
    MATIÈRES PREMIÈRES:
    - Or, argent, pétrole
    - Protection contre l'inflation
    - Diversification du risque
    - Volatilité élevée
    
    LIQUIDITÉS/MONÉTAIRE:
    - Faible rendement (1-3%)
    - Haute liquidité
    - Aucun risque de capital
    - Pour besoins à court terme`,
    keywords: [
      "actions",
      "obligations",
      "immobilier",
      "REIT",
      "SCPI",
      "matières premières",
      "liquidités",
      "actifs",
    ],
    weight: 1.0,
  },
  {
    id: 5,
    category: "beginner",
    topic: "Conseils pour débutants",
    content: `Guide pour bien démarrer dans l'investissement:
    
    1. ÉDUCATION: Apprenez les bases avant d'investir
    2. OBJECTIFS: Définissez clairement vos objectifs financiers (retraite, achat immobilier, etc.)
    3. BUDGET: Établissez un budget et identifiez votre capacité d'épargne
    4. URGENCE: Constituez d'abord une épargne de précaution (3-6 mois de dépenses)
    5. PROFIL: Évaluez votre tolérance au risque et votre horizon d'investissement
    6. DIVERSIFICATION: Ne mettez pas tous vos œufs dans le même panier
    7. RÉGULARITÉ: Investissez régulièrement, même de petits montants (DCA)
    8. PATIENCE: L'investissement est un marathon, pas un sprint
    9. ÉMOTIONS: Ne vendez pas en panique lors des baisses
    10. RÉVISION: Réévaluez votre stratégie annuellement
    
    Montant minimum recommandé pour débuter: 1000-5000 MAD
    Allocation débutant type: 50% actions, 30% obligations, 20% liquidités`,
    keywords: [
      "débutant",
      "commencer",
      "premier",
      "investissement",
      "guide",
      "conseils",
      "débuter",
    ],
    weight: 1.0,
  },
  {
    id: 6,
    category: "portfolio",
    topic: "Rééquilibrage du portefeuille",
    content: `Le rééquilibrage maintient votre allocation d'actifs cible:
    
    QUAND RÉÉQUILIBRER:
    - Tous les 3-6 mois (calendrier fixe)
    - Quand une classe d'actifs dévie de >5% de l'allocation cible
    - Après un événement majeur du marché
    - Lors de changement de situation personnelle
    
    COMMENT RÉÉQUILIBRER:
    1. Vérifier l'allocation actuelle vs allocation cible
    2. Identifier les actifs surpondérés et sous-pondérés
    3. Vendre une partie des actifs surpondérés
    4. Acheter des actifs sous-pondérés
    5. Tenir compte des frais et impacts fiscaux
    
    AVANTAGES:
    - Maintient le niveau de risque souhaité
    - Force à "vendre haut, acheter bas"
    - Discipline et automatisation
    - Améliore les rendements à long terme
    
    ASTUCE: Utilisez les nouveaux apports pour rééquilibrer sans vendre`,
    keywords: [
      "rééquilibrage",
      "allocation",
      "portefeuille",
      "ajustement",
      "rebalancing",
    ],
    weight: 1.0,
  },
  {
    id: 7,
    category: "performance",
    topic: "Analyse de performance",
    content: `Comment évaluer la performance de vos investissements:
    
    MÉTRIQUES CLÉS:
    1. Rendement Total (%): (Valeur finale - Valeur initiale) / Valeur initiale × 100
    2. Rendement Annualisé: Rendement moyen par an sur la période
    3. Volatilité: Mesure des fluctuations (écart-type)
    4. Ratio Sharpe: Rendement ajusté du risque (>1 est bon)
    5. Drawdown Maximum: Plus grande perte depuis un pic
    6. Benchmark: Comparaison avec un indice de référence
    
    BONNES PRATIQUES:
    - Comparer sur des périodes >1 an
    - Tenir compte des frais et taxes
    - Comparer à un indice pertinent (S&P 500, CAC 40, etc.)
    - Évaluer le risque pris, pas seulement le rendement
    - Ne pas surréagir aux fluctuations court terme
    
    RENDEMENTS RÉALISTES:
    - Portefeuille équilibré: 6-8% annuel
    - Portefeuille agressif: 8-12% annuel
    - Portefeuille conservateur: 3-5% annuel`,
    keywords: [
      "performance",
      "rendement",
      "analyse",
      "métrique",
      "sharpe",
      "benchmark",
    ],
    weight: 1.0,
  },
  {
    id: 8,
    category: "tax",
    topic: "Fiscalité et optimisation",
    content: `Aspects fiscaux des investissements au Maroc:
    
    IMPÔTS SUR LES GAINS:
    - Plus-values sur actions: 15-20% selon montant
    - Dividendes: 15% à la source
    - Intérêts obligataires: 20-30% selon type
    - Revenus locatifs: Barème progressif IR
    
    OPTIMISATION FISCALE:
    1. Utiliser les comptes d'épargne défiscalisés si disponibles
    2. Étaler les prises de bénéfices sur plusieurs années
    3. Compenser gains et pertes (tax-loss harvesting)
    4. Privilégier les dividendes aux plus-values si taux IR élevé
    5. Investir via des structures appropriées (holding familiale, etc.)
    6. Conserver les actions >1 an pour bénéficier d'abattements
    
    DÉCLARATION:
    - Déclarer tous les revenus d'investissement
    - Conserver les justificatifs 10 ans
    - Utiliser les services d'un expert-comptable si portefeuille >500K MAD
    
    Note: Ces informations sont générales, consultez un fiscaliste pour votre situation.`,
    keywords: [
      "fiscalité",
      "impôts",
      "taxes",
      "optimisation",
      "plus-values",
      "dividendes",
    ],
    weight: 1.0,
  },
  {
    id: 9,
    category: "market",
    topic: "Conditions de marché",
    content: `Comprendre les cycles et conditions de marché:
    
    MARCHÉ HAUSSIER (Bull Market):
    - Prix en hausse générale
    - Optimisme des investisseurs
    - Croissance économique forte
    - Stratégie: Rester investi, acheter les corrections
    
    MARCHÉ BAISSIER (Bear Market):
    - Baisse >20% depuis les sommets
    - Pessimisme généralisé
    - Récession possible
    - Stratégie: Garder son calme, acheter progressivement, privilégier la qualité
    
    CORRECTION:
    - Baisse de 10-20%
    - Normale et saine
    - Opportunité d'achat
    
    VOLATILITÉ:
    - Mesurée par l'indice VIX
    - Normale en bourse
    - Augmente en période d'incertitude
    
    CONSEILS:
    - Ne pas essayer de "timer" le marché
    - Investir régulièrement quelle que soit la conjoncture (DCA)
    - Les crises sont des opportunités à long terme
    - Garder des liquidités pour profiter des baisses
    - Éviter les décisions émotionnelles`,
    keywords: [
      "marché",
      "bull",
      "bear",
      "volatilité",
      "correction",
      "crise",
      "cycle",
    ],
    weight: 1.0,
  },
  {
    id: 10,
    category: "platform_features",
    topic: "Fonctionnalités Tawfir",
    content: `Tawfir offre de nombreuses fonctionnalités pour optimiser vos investissements:
    
    1. ASSISTANT IA:
    - Conseils personnalisés 24/7
    - Analyse de portefeuille en temps réel
    - Réponses aux questions financières
    
    2. RECOMMANDATIONS INTELLIGENTES:
    - Basées sur votre profil de risque
    - Analyse des tendances du marché
    - Suggestions d'allocation optimale
    
    3. TABLEAU DE BORD:
    - Vue d'ensemble de votre patrimoine
    - Graphiques de performance
    - Suivi des objectifs
    
    4. CALCULATEURS:
    - ROI et rendement
    - Simulation de scénarios
    - Planification retraite
    
    5. PROFILING FINANCIER:
    - Évaluation du profil de risque
    - Identification des objectifs
    - Recommandations personnalisées
    
    6. ACTUALITÉS ET MARCHÉS:
    - Flux d'actualités en temps réel
    - Cotations de marché
    - Analyses sectorielles
    
    7. PORTFOLIO TRACKING:
    - Suivi de performance
    - Alertes personnalisées
    - Rapports détaillés`,
    keywords: [
      "tawfir",
      "fonctionnalités",
      "assistant",
      "dashboard",
      "calculateur",
      "profiling",
      "recommandations",
    ],
    weight: 1.0,
  },
];

/**
 * Simple similarity search for RAG
 * @param {string} query - User query
 * @param {number} topK - Number of results to return
 * @returns {Array} - Top matching knowledge entries
 */
export const searchKnowledge = (query, topK = 3) => {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter((word) => word.length > 2);

  // Score each knowledge entry
  const scored = knowledgeBase.map((entry) => {
    let score = 0;

    // Check keywords
    entry.keywords.forEach((keyword) => {
      if (queryLower.includes(keyword)) {
        score += 3;
      }
      queryWords.forEach((word) => {
        if (keyword.includes(word) || word.includes(keyword)) {
          score += 1;
        }
      });
    });

    // Check topic
    if (queryLower.includes(entry.topic.toLowerCase())) {
      score += 5;
    }

    // Check content
    const contentLower = entry.content.toLowerCase();
    queryWords.forEach((word) => {
      const matches = (contentLower.match(new RegExp(word, "g")) || []).length;
      score += matches * 0.5;
    });

    // Apply weight
    score *= entry.weight;

    return { ...entry, score };
  });

  // Sort by score and return top K
  return scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
};

/**
 * Get context string for LLM from knowledge base results
 */
export const formatContextForLLM = (results) => {
  if (!results || results.length === 0) {
    return "Aucune information spécifique trouvée dans la base de connaissances.";
  }

  return results
    .map(
      (result) =>
        `[${result.category.toUpperCase()} - ${result.topic}]\n${
          result.content
        }\n`
    )
    .join("\n---\n\n");
};
