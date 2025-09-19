import StatsCount from "./ui/statscount";

const stats = [
  { value: 9, suffix: "+", label: "Produits financiers disponibles" },
  { value: 3, suffix: "", label: "Banques partenaires engagées" },
  { value: 300, suffix: "K+", label: "Utilisateurs prévus d'ici 2026" },
  { value: 85, suffix: "%", label: "Technologie déjà développée" },
];

export default function TawfirStats() {
  return (
    <StatsCount
      stats={stats}
      title="Démocratiser L'épargne Et L'investissement avec Tawfirai"
      titleClassName="text-green-500 text-2xl font-bold font-medium"
      showDividers={true}
      className="text-gray-100   rounded-lg"
    />
  );
}