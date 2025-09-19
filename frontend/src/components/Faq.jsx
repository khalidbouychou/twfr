import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./ui/accordion";

const faqData = [
  {
    question: "Qui est TawfirAI ?",
    answer: (
      <>
        TawfirAI est une fintech innovante spécialisée dans la démocratisation de l'épargne et de l'investissement. Fondée en 2025, notre mission est d’aider les particuliers à gérer leur épargne et à investir de manière simple, sécurisée et personnalisée, grâce à l'intelligence artificielle. Nous permettons à chaque utilisateur de prendre des décisions financières éclairées, via une expérience totalement numérique et sans jargon financier complexe.
      </>
    ),
  },
  {
    question: "Mon argent est-il bloqué ?",
    answer: (
      <>
        Non, avec TawfirAI, vous avez un accès flexible à vos fonds. Selon le produit choisi, la liquidité peut varier, mais nous nous assurons que vous puissiez gérer votre épargne selon vos besoins.
      </>
    ),
  },
  {
    question: "Quelle fiscalité s’applique aux placements TawfirAI ?",
    answer: (
      <>
        Les placements réalisés via TawfirAI peuvent être soumis à une fiscalité selon le type de produit choisi. Par exemple, les comptes titres et assurance-vie bénéficient de traitements fiscaux avantageux après certaines périodes. Nous vous fournissons une simulation personnalisée pour vous aider à comprendre l'impact fiscal de vos investissements.
      </>
    ),
  },
  {
    question: "Combien coûte TawfirAI ?",
    answer: (
      <>
        L’utilisation de TawfirAI est gratuite pour tous les utilisateurs. Nous appliquons des frais seulement sur certains produits d'investissement, tels que des fonds spécifiques ou des services premium. Tous les frais sont clairement affichés pour garantir une transparence totale.
      </>
    ),
  },
  {
    question: "Où va mon argent quand j’épargne sur TawfirAI ?",
    answer: (
      <>
        Votre argent est investi dans des produits financiers sûrs et diversifiés, tels que des comptes d’épargne, des OPCVM, ou encore des produits structurés. Nous sélectionnons uniquement des solutions de qualité, supervisées par des institutions financières réglementées.
      </>
    ),
  },
  {
    question: "Est-ce fiable ?",
    answer: (
      <>
        Oui, TawfirAI utilise des technologies de pointe pour sécuriser vos données et vos investissements. Grâce à l'authentification biométrique et le respect des normes de sécurité les plus strictes, vous pouvez investir en toute tranquillité.
      </>
    ),
  },
  {
    question: "Mon épargne est-elle placée sur des supports responsables ?",
    answer: (
      <>
        Oui, TawfirAI propose des investissements alignés avec vos valeurs. Vous pouvez choisir des produits conformes aux critères ESG (environnementaux, sociaux et de gouvernance) pour investir de manière responsable et durable.
      </>
    ),
  },
];

export default function Faq() {
  return (
    <div data-aos="fade-up">
    <div id="faq" className=" min-h-screen py-30 px-4 md:px-16" data-aos="fade-up">
      <h1  className="text-3xl font-bold mb-2 text-[#3CD4AB]">Il vous reste des questions ?</h1>
      <p className="mb-8 text-lg text-gray-50">
        Voici les réponses aux questions les plus fréquentes. Et si vous ne trouvez pas votre bonheur,{" "}
       Contacter Nous 
      </p>

      <Accordion type="single" collapsible defaultValue={"0"} className="flex flex-col gap-3">
        {faqData.map((item, idx) => (
          <AccordionItem key={idx} value={String(idx)} className="overflow-hidden">
            <AccordionTrigger value={String(idx)}>{item.question}</AccordionTrigger>
            <AccordionContent value={String(idx)}>
              <div className="text-gray-100 ] rounded-xl p-5">
                <div className=" font-medium">{item.answer}</div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
    </div>

  );
}
