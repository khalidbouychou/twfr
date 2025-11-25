/**
 * ROI Calculator Utility (optimized)
 * Provides comprehensive ROI calculations for investment products
 */

const round2 = (n) => (Number.isFinite(n) ? Math.round(n * 100) / 100 : 0);

export class ROICalculator {
  /**
   * Calculate simple ROI for a given period
   * @param {number} initialInvestment - Initial investment amount
   * @param {number} annualReturn - Annual return percentage
   * @param {number} years - Investment period in years
   * @returns {Object} ROI calculation results
   */
  static calculateSimpleROI(initialInvestment, annualReturn, years) {
    const annualReturnDecimal = (annualReturn ?? 0) / 100;
    const safeYears = Number(years) || 0;
    const base = Number(initialInvestment) || 0;

    const finalValue = base * Math.pow(1 + annualReturnDecimal, safeYears);
    const totalReturn = finalValue - base;
    const roiPercentage = base !== 0 ? ((finalValue - base) / base) * 100 : 0;
    const averageAnnualROI = safeYears > 0 ? roiPercentage / safeYears : roiPercentage;

    return {
      initialInvestment: base,
      finalValue: round2(finalValue),
      totalReturn: round2(totalReturn),
      roiPercentage: round2(roiPercentage),
      averageAnnualROI: round2(averageAnnualROI),
      years: safeYears,
    };
  }

  /**
   * Calculate compound ROI with monthly contributions
   * @param {number} initialInvestment - Initial investment amount
   * @param {number} monthlyContribution - Monthly contribution amount
   * @param {number} annualReturn - Annual return percentage
   * @param {number} years - Investment period in years
   * @returns {Object} Compound ROI calculation results
   */
  static calculateCompoundROI(initialInvestment, monthlyContribution, annualReturn, years) {
    const base = Number(initialInvestment) || 0;
    const contrib = Number(monthlyContribution) || 0;
    const safeYears = Number(years) || 0;
    const totalMonths = safeYears * 12;
    const monthlyReturn = (Number(annualReturn) || 0) / 12 / 100;

    // Future value of initial investment
    const futureValueInitial = base * Math.pow(1 + monthlyReturn, totalMonths);

    // Future value of monthly contributions (annuity), handle 0% rate safely
    let futureValueContributions;
    if (monthlyReturn === 0) {
      futureValueContributions = contrib * totalMonths;
    } else {
      futureValueContributions = contrib * ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn);
    }

    const finalValue = futureValueInitial + futureValueContributions;
    const totalInvested = base + contrib * totalMonths;
    const totalReturn = finalValue - totalInvested;
    const roiPercentage = totalInvested !== 0 ? (totalReturn / totalInvested) * 100 : 0;
    const averageAnnualROI = safeYears > 0 ? roiPercentage / safeYears : roiPercentage;

    return {
      initialInvestment: base,
      monthlyContribution: contrib,
      totalInvested: round2(totalInvested),
      finalValue: round2(finalValue),
      totalReturn: round2(totalReturn),
      roiPercentage: round2(roiPercentage),
      averageAnnualROI: round2(averageAnnualROI),
      years: safeYears,
    };
  }

  /**
   * Calculate risk-adjusted ROI
   * @param {number} annualReturn - Annual return percentage
   * @param {number} volatility - Volatility percentage
   * @param {number} riskFreeRate - Risk-free rate (default: 2%)
   * @returns {Object} Risk-adjusted ROI results
   */
  static calculateRiskAdjustedROI(annualReturn, volatility, riskFreeRate = 2) {
    const vol = Number(volatility) || 0;
    const ar = Number(annualReturn) || 0;
    const rfr = Number(riskFreeRate) || 0;

    const sharpeRatio = vol > 0 ? (ar - rfr) / vol : null;
    const riskAdjustedReturn = ar - vol * 0.5; // Simple risk adjustment
    const riskReward = vol > 0 ? ar / vol : null;

    return {
      annualReturn: ar,
      volatility: vol,
      riskFreeRate: rfr,
      sharpeRatio: sharpeRatio !== null ? round2(sharpeRatio) : null,
      riskAdjustedReturn: round2(riskAdjustedReturn),
      riskRewardRatio: riskReward !== null ? round2(riskReward) : null,
    };
  }

  /**
   * Calculate ROI scenarios (optimistic, realistic, pessimistic)
   * @param {number} initialInvestment - Initial investment amount
   * @param {number} baseAnnualReturn - Base annual return percentage
   * @param {number} years - Investment period in years
   * @returns {Object} ROI scenarios
   */
  static calculateROIScenarios(initialInvestment, baseAnnualReturn, years) {
    const optimistic = this.calculateSimpleROI(initialInvestment, baseAnnualReturn * 1.3, years);
    const realistic = this.calculateSimpleROI(initialInvestment, baseAnnualReturn, years);
    const pessimistic = this.calculateSimpleROI(initialInvestment, baseAnnualReturn * 0.7, years);

    return {
      optimistic,
      realistic,
      pessimistic,
      range: {
        min: pessimistic.roiPercentage,
        max: optimistic.roiPercentage,
        spread: round2(optimistic.roiPercentage - pessimistic.roiPercentage),
      },
    };
  }

  /**
   * Calculate ROI with fees and taxes
   * @param {number} initialInvestment - Initial investment amount
   * @param {number} annualReturn - Annual return percentage
   * @param {number} years - Investment period in years
   * @param {number} annualFees - Annual fees percentage
   * @param {number} taxRate - Tax rate on gains (default: 30%)
   * @returns {Object} Net ROI after fees and taxes
   */
  static calculateNetROI(initialInvestment, annualReturn, years, annualFees, taxRate = 30) {
    const base = Number(initialInvestment) || 0;
    const feesPct = Number(annualFees) || 0;
    const taxPct = Number(taxRate) || 0;

    const grossROI = this.calculateSimpleROI(base, annualReturn, years);

    const totalFees = (feesPct / 100) * base * (Number(years) || 0);
    const taxableGains = grossROI.totalReturn - totalFees;
    const taxes = Math.max(0, (taxableGains * taxPct) / 100);

    const netReturn = grossROI.totalReturn - totalFees - taxes;
    const netFinalValue = base + netReturn;
    const netROIPercentage = base !== 0 ? (netReturn / base) * 100 : 0;
    const netAnnualROI = (Number(years) || 0) > 0 ? netROIPercentage / years : netROIPercentage;

    return {
      ...grossROI,
      totalFees: round2(totalFees),
      taxes: round2(taxes),
      netReturn: round2(netReturn),
      netFinalValue: round2(netFinalValue),
      netROIPercentage: round2(netROIPercentage),
      netAnnualROI: round2(netAnnualROI),
      fees: {
        annual: feesPct,
        total: round2(totalFees),
      },
      taxRate: taxPct,
    };
  }

  /**
   * Calculate ROI comparison between products
   * @param {Array} products - Array of products with ROI data
   * @param {number} investmentAmount - Investment amount to compare
   * @param {number} years - Investment period
   * @returns {Array} Sorted products by ROI
   */
  static compareProductsROI(products, investmentAmount, years) {
    return products
      .map((product) => {
        const annual = product.roi_annuel !== undefined ? product.roi_annuel : 5;
        const roi = this.calculateSimpleROI(investmentAmount, annual, years);

        const riskAdjusted = this.calculateRiskAdjustedROI(
          annual,
          product.volatilite !== undefined ? product.volatilite : 5
        );

        return {
          ...product,
          roiCalculation: roi,
          riskAdjustedROI: riskAdjusted,
          comparisonScore: roi.roiPercentage * 0.6 + (riskAdjusted.sharpeRatio ?? 0) * 0.4,
        };
      })
      .sort((a, b) => b.comparisonScore - a.comparisonScore);
  }

  /**
   * Calculate break-even point
   * @param {number} initialInvestment - Initial investment amount
   * @param {number} annualReturn - Annual return percentage
   * @param {number} annualFees - Annual fees percentage
   * @returns {Object} Break-even analysis
   */
  static calculateBreakEven(initialInvestment, annualReturn, annualFees) {
    const ar = Number(annualReturn) || 0;
    const fees = Number(annualFees) || 0;
    const netReturn = ar - fees;
    if (netReturn <= 0) {
      return {
        breakEvenYears: Infinity,
        breakEvenPossible: false,
        message: 'Break-even impossible with current fees',
      };
    }

    const breakEvenYears = fees / netReturn;
    const breakEvenMonths = breakEvenYears * 12;

    return {
      breakEvenYears: round2(breakEvenYears),
      breakEvenMonths: round2(breakEvenMonths),
      breakEvenPossible: true,
      netReturn: round2(netReturn),
    };
  }

  /**
   * Format ROI for display
   * @param {number} roi - ROI percentage
   * @param {string} format - Display format ('percentage', 'decimal', 'currency')
   * @returns {string} Formatted ROI string
   */
  static formatROI(roi, format = 'percentage') {
    const n = Number(roi) || 0;
    switch (format) {
      case 'percentage':
        return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
      case 'decimal':
        return (n / 100).toFixed(4);
      case 'currency':
        return `${n >= 0 ? '+' : ''}${n.toFixed(2)} MAD`;
      default:
        return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
    }
  }

  /**
   * Get ROI color based on performance
   * @param {number} roi - ROI percentage
   * @returns {string} CSS color class
   */
  static getROIColor(roi) {
    const n = Number(roi) || 0;
    if (n >= 8) return 'text-green-500';
    if (n >= 5) return 'text-blue-500';
    if (n >= 2) return 'text-yellow-500';
    if (n >= 0) return 'text-orange-500';
    return 'text-red-500';
  }

  /**
   * Calculate inflation-adjusted ROI
   * @param {number} nominalROI - Nominal ROI percentage
   * @param {number} inflationRate - Inflation rate percentage (default: 2%)
   * @returns {number} Real ROI percentage
   */
  static calculateRealROI(nominalROI, inflationRate = 2) {
    const realROI = ((1 + (Number(nominalROI) || 0) / 100) / (1 + (Number(inflationRate) || 0) / 100) - 1) * 100;
    return round2(realROI);
  }
}

export default ROICalculator;
