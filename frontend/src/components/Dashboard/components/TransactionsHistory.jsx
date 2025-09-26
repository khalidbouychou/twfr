import React from 'react';

const TransactionsHistory = ({ transactionsHistory }) => {
  return (
    <div className="p-4 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
      <div className="flex  mb-4">
        <h3 className="text-white font-semibold">
          Historique des Transactions
        </h3>
      </div>
      <div className={`relative ${transactionsHistory.length > 8 ? "pt-8" : ""}`}>
        {transactionsHistory.length > 8 && (
          <div className="absolute -top-1 right-0 flex gap-2">
            <button 
              onClick={() => document.getElementById('txHistory')?.scrollBy({ top: -72, behavior: 'smooth' })} 
              className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs border border-white/10"
            >
              ↑
            </button>
            <button 
              onClick={() => document.getElementById('txHistory')?.scrollBy({ top: 72, behavior: 'smooth' })} 
              className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs border border-white/10"
            >
              ↓
            </button>
          </div>
        )}
        <ul
          id="txHistory"
          className={`${transactionsHistory.length > 8 ? "max-h-80 overflow-y-scroll no-scrollbar" : ""} divide-y divide-white/10`}
          style={{ scrollBehavior: 'smooth' }}
        >
          {transactionsHistory.map((t) => (
            <li
              key={t.id}
              className="py-3 flex items-center justify-between"
            >
              <div>
                <p className="text-white font-medium">
                  {t.type === "deposit" && (
                    <span className="text-[#3CD4AB]">
                      +{t.amount.toLocaleString()} MAD
                    </span>
                  )}
                  {t.type === "withdraw" && (
                    <span className="text-red-400">
                      -{t.amount.toLocaleString()} MAD
                    </span>
                  )}
                  {t.type === "profit_withdraw" && (
                    <span className="text-orange-400">
                      -{t.amount.toLocaleString()} MAD
                    </span>
                  )}
                  {t.type === "profit_to_balance" && (
                    <span className="text-green-400">
                      +{t.amount.toLocaleString()} MAD
                    </span>
                  )}
                </p>
                <p className="text-white/60 text-sm">
                  {t.method} • {t.date}
                </p>
              </div>
              <span className="text-white/60 text-xs bg-white/10 px-2 py-1 rounded">
                {t.type === "deposit" && "Dépôt"}
                {t.type === "withdraw" && "Retrait"}
                {t.type === "profit_withdraw" && "Retrait Profits"}
                {t.type === "profit_to_balance" && "Profits → Solde"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TransactionsHistory;