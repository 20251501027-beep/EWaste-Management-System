// ─── Eco Reward Calculation ───────────────────────────────────────────────────
// IMPORTANT: This calculation is provisional (10 pts / kg).
// When the C++ OOP module is ready, replace POINTS_PER_KG with the
// value returned from the C++ integration endpoint and keep this file
// as the single place that owns the formula.

const POINTS_PER_KG = 10;

/**
 * Calculate eco points from a list of e-waste items.
 * @param {Array} items - Array of EWasteItem documents from the backend.
 * @returns {{ totalPoints: number, totalWeight: number }}
 */
export function calculateEcoRewards(items = []) {
  const totalWeight = items.reduce((sum, item) => sum + (item.weight || 0), 0);
  const totalPoints = Math.round(totalWeight * POINTS_PER_KG);
  return { totalPoints, totalWeight: parseFloat(totalWeight.toFixed(2)) };
}

/**
 * Calculate the environmental impact metrics from total weight.
 * Values are illustrative but grounded in common e-waste stats.
 * @param {number} totalWeight - Total e-waste weight in kg.
 * @returns {{ co2Saved: number, metalRecovered: number, waterSaved: number }}
 */
export function calculateEnvironmentalImpact(totalWeight = 0) {
  return {
    co2Saved: parseFloat((totalWeight * 2.3).toFixed(2)),       // kg CO₂
    metalRecovered: parseFloat((totalWeight * 0.3).toFixed(2)), // kg precious metals
    waterSaved: parseFloat((totalWeight * 7.5).toFixed(2)),     // litres
  };
}
