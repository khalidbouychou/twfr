/**
 * ROI Calculator Utility
 * Provides comprehensive ROI calculations for investment products
 */

export class ROICalculator {
  /**
   * Calculate simple ROI for a given period
   * @param {number} initialInvestment - Initial investment amount
   * @param {number} annualReturn - Annual return percentage
   * @param {number} years - Investment period in years
   * @returns {Object} ROI calculation results
   */
  static calculateSimpleROI(initialInvestment, annualReturn, years) {
    const annualReturnDecimal = annualReturn / 100;
    const finalValue = initialInvestment * Math.pow(1 + annualReturnDecimal, years);
    const totalReturn = finalValue - initialInvestment;
    const roiPercentage = ((finalValue - initialInvestment) / initialInvestment) * 100;
    const averageAnnualROI = roiPercentage / years;

    return {
      initialInvestment,
      finalValue: Math.round(finalValue * 100) / 100,
      totalReturn: Math.round(totalReturn * 100) / 100,
      roiPercentage: Math.round(roiPercentage * 100) / 100,
      averageAnnualROI: Math.round(averageAnnualROI * 100) / 100,
      years
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
    const monthlyReturn = annualReturn / 12 / 100;
    const totalMonths = years * 12;
    
    // Future value of initial investment
    const futureValueInitial = initialInvestment * Math.pow(1 + monthlyReturn, totalMonths);
    
    // Future value of monthly contributions (annuity)
    const futureValueContributions = monthlyContribution * 
      ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn);
    
    const finalValue = futureValueInitial + futureValueContributions;
    const totalInvested = initialInvestment + (monthlyContribution * totalMonths);
    const totalReturn = finalValue - totalInvested;
    const roiPercentage = (totalReturn / totalInvested) * 100;
    const averageAnnualROI = roiPercentage / years;

    return {
      initialInvestment,
      monthlyContribution,
      totalInvested: Math.round(totalInvested * 100) / 100,
      finalValue: Math.round(finalValue * 100) / 100,
      totalReturn: Math.round(totalReturn * 100) / 100,
      roiPercentage: Math.round(roiPercentage * 100) / 100,
      averageAnnualROI: Math.round(averageAnnualROI * 100) / 100,
      years
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
    const sharpeRatio = (annualReturn - riskFreeRate) / volatility;
    const riskAdjustedReturn = annualReturn - (volatility * 0.5); // Simple risk adjustment
    
    return {
      annualReturn,
      volatility,
      riskFreeRate,
      sharpeRatio: Math.round(sharpeRatio * 100) / 100,
      riskAdjustedReturn: Math.round(riskAdjustedReturn * 100) / 100,
      riskRewardRatio: Math.round((annualReturn / volatility) * 100) / 100
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
        spread: Math.round((optimistic.roiPercentage - pessimistic.roiPercentage) * 100) / 100
      }
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
    // Calculate gross ROI
    const grossROI = this.calculateSimpleROI(initialInvestment, annualReturn, years);
    
    // Calculate fees impact
    const totalFees = (annualFees / 100) * initialInvestment * years;
    
    // Calculate tax impact on gains
    const taxableGains = grossROI.totalReturn - totalFees;
    const taxes = Math.max(0, (taxableGains * taxRate) / 100);
    
    // Calculate net values
    const netReturn = grossROI.totalReturn - totalFees - taxes;
    const netFinalValue = initialInvestment + netReturn;
    const netROIPercentage = (netReturn / initialInvestment) * 100;
    const netAnnualROI = netROIPercentage / years;

    return {
      ...grossROI,
      totalFees: Math.round(totalFees * 100) / 100,
      taxes: Math.round(taxes * 100) / 100,
      netReturn: Math.round(netReturn * 100) / 100,
      netFinalValue: Math.round(netFinalValue * 100) / 100,
      netROIPercentage: Math.round(netROIPercentage * 100) / 100,
      netAnnualROI: Math.round(netAnnualROI * 100) / 100,
      fees: {
        annual: annualFees,
        total: Math.round(totalFees * 100) / 100
      },
      taxRate
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
    return products.map(product => {
      const roi = this.calculateSimpleROI(
        investmentAmount, 
        product.roi_annuel !== undefined ? product.roi_annuel : 5, 
        years
      );
      
      const riskAdjusted = this.calculateRiskAdjustedROI(
        product.roi_annuel !== undefined ? product.roi_annuel : 5,
        product.volatilite !== undefined ? product.volatilite : 5
      );

      return {
        ...product,
        roiCalculation: roi,
        riskAdjustedROI: riskAdjusted,
        comparisonScore: (roi.roiPercentage * 0.6) + (riskAdjusted.sharpeRatio * 0.4)
      };
    }).sort((a, b) => b.comparisonScore - a.comparisonScore);
  }

  /**
   * Calculate break-even point
   * @param {number} initialInvestment - Initial investment amount
   * @param {number} annualReturn - Annual return percentage
   * @param {number} annualFees - Annual fees percentage
   * @returns {Object} Break-even analysis
   */
  static calculateBreakEven(initialInvestment, annualReturn, annualFees) {
    const netReturn = annualReturn - annualFees;
    if (netReturn <= 0) {
      return {
        breakEvenYears: Infinity,
        breakEvenPossible: false,
        message: "Break-even impossible with current fees"
      };
    }

    const breakEvenYears = annualFees / netReturn;
    const breakEvenMonths = breakEvenYears * 12;

    return {
      breakEvenYears: Math.round(breakEvenYears * 100) / 100,
      breakEvenMonths: Math.round(breakEvenMonths * 100) / 100,
      breakEvenPossible: true,
      netReturn: Math.round(netReturn * 100) / 100
    };
  }

  /**
   * Format ROI for display
   * @param {number} roi - ROI percentage
   * @param {string} format - Display format ('percentage', 'decimal', 'currency')
   * @returns {string} Formatted ROI string
   */
  static formatROI(roi, format = 'percentage') {
    switch (format) {
      case 'percentage':
        return `${roi >= 0 ? '+' : ''}${roi.toFixed(2)}%`;
      case 'decimal':
        return (roi / 100).toFixed(4);
      case 'currency':
        return `${roi >= 0 ? '+' : ''}${roi.toFixed(2)} MAD`;
      default:
        return `${roi >= 0 ? '+' : ''}${roi.toFixed(2)}%`;
    }
  }

  /**
   * Get ROI color based on performance
   * @param {number} roi - ROI percentage
   * @returns {string} CSS color class
   */
  static getROIColor(roi) {
    if (roi >= 8) return 'text-green-500';
    if (roi >= 5) return 'text-blue-500';
    if (roi >= 2) return 'text-yellow-500';
    if (roi >= 0) return 'text-orange-500';
    return 'text-red-500';
  }

  /**
   * Calculate inflation-adjusted ROI
   * @param {number} nominalROI - Nominal ROI percentage
   * @param {number} inflationRate - Inflation rate percentage (default: 2%)
   * @returns {number} Real ROI percentage
   */
  static calculateRealROI(nominalROI, inflationRate = 2) {
    const realROI = ((1 + nominalROI / 100) / (1 + inflationRate / 100) - 1) * 100;
    return Math.round(realROI * 100) / 100;
  }
}

export default ROICalculator; 