import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import React, { useMemo, useState } from "react";

export default function Dashboardchart({ userInvestments }) {
  console.log("---------------", userInvestments);
  const [selectedProduct, setSelectedProduct] = useState("all");

  const allProducts = useMemo(() => {
    const names = (userInvestments || []).map((p) => p.nameProduct || p.name).filter(Boolean);
    return Array.from(new Set(names));
  }, [userInvestments]);

  const data = useMemo(() => {
    const base = (userInvestments || []).map((p) => ({
      name: p.nameProduct || p.name,
      invested: p.valueInvested || p.investedAmount || 0,
      current: p.currentValue || 0,
      roi: p.roi_product || 0,
    }));
    if (selectedProduct && selectedProduct !== "all") {
      return base.filter((d) => d.name === selectedProduct);
    }
    return base;
  }, [userInvestments, selectedProduct]);

  return (
    <div className="w-full h-72 mt-10">
      <div className="flex items-center justify-between mb-3">
        <div className="text-white/80 text-sm">Filtrer par produit</div>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="bg-[#0F0F19] border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:border-[#3CD4AB] focus:outline-none"
          style={{ backgroundColor: "#0F0F19", color: "white" }}
        >
          <option value="all" style={{ backgroundColor: "#0F0F19", color: "white" }}>Tous</option>
          {allProducts.map((name) => (
            <option key={name} value={name} style={{ backgroundColor: "#0F0F19", color: "white" }}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {
        userInvestments && userInvestments.length > 0 ? (
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="invested" fill="#3CD4AB" name="Investi" />
              <Bar dataKey="current" fill="#89559F" name="Valeur Actuelle" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-50 text-2xl font-bold">Aucun investissement trouvé </p>
          </div>
        )
      }
    </div>
  );
}
