"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { buyItem } from "../actions/shop";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  item_type: string;
}

interface Props {
  items: ShopItem[];
  owned: string[];
  userXp: number;
}

export default function ShopClient({ items, owned, userXp }: Props) {
  const router = useRouter();
  const { t, lang } = useTranslation();
  const [buying, setBuying] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [localXp, setLocalXp] = useState(userXp);
  const [localOwned, setLocalOwned] = useState(owned);

  const handleBuy = async (itemId: string) => {
    setBuying(itemId);
    const result = await buyItem(itemId);
    setBuying(null);
    if (result.error) {
      setMessage(result.error);
    } else {
      const item = items.find((i) => i.id === itemId);
      if (item) {
        setLocalXp((x) => x - item.price);
        setLocalOwned((o) => [...o, itemId]);
      }
      setMessage(lang === "es" ? "¡Comprado!" : "Purchased!");
    }
    setTimeout(() => setMessage(""), 2000);
  };

  const skins = items.filter((i) => i.item_type === "dragon_skin");
  const themes = items.filter((i) => i.item_type === "theme");

  return (
    <div className="flex min-h-dvh flex-col" style={{ background: "var(--bg-primary)" }}>
      <header className="flex items-center justify-between px-6 py-4">
        <button onClick={() => router.push("/stats")} className="text-sm" style={{ color: "var(--text-secondary)" }}>← {t("stats", "back")}</button>
        <span className="text-lg font-bold text-jade-600">{t("shop", "title")}</span>
        <span className="text-sm font-bold text-gold-500">{localXp} XP</span>
      </header>

      {message && (
        <div className="mx-6 mb-2 rounded-xl bg-jade-500/20 px-4 py-2 text-center text-sm text-jade-600 font-semibold">
          {message}
        </div>
      )}

      <main className="flex flex-1 flex-col gap-6 px-6 py-4">
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
            {t("shop", "skins")}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {skins.map((item) => {
              const isOwned = localOwned.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="flex flex-col items-center gap-2 rounded-xl px-4 py-5 text-center"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--bg-card-border)" }}
                >
                  <span className="text-4xl">{item.icon}</span>
                  <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{item.name}</span>
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{item.description}</span>
                  {isOwned ? (
                    <span className="rounded-full bg-jade-500/20 px-4 py-1 text-xs font-semibold text-jade-600">
                      {t("shop", "owned")}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleBuy(item.id)}
                      disabled={buying === item.id || localXp < item.price}
                      className="rounded-full bg-jade-500 px-4 py-1 text-xs font-semibold text-white transition-transform active:scale-95 disabled:opacity-50"
                    >
                      {buying === item.id ? "..." : `${item.price} XP`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {themes.length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
              {t("shop", "themes")}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {themes.map((item) => {
                const isOwned = localOwned.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="flex flex-col items-center gap-2 rounded-xl px-4 py-5 text-center"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--bg-card-border)" }}
                  >
                    <span className="text-4xl">{item.icon}</span>
                    <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{item.name}</span>
                    <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{item.description}</span>
                    {isOwned ? (
                      <span className="rounded-full bg-jade-500/20 px-4 py-1 text-xs font-semibold text-jade-600">
                        {t("shop", "owned")}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleBuy(item.id)}
                        disabled={buying === item.id || localXp < item.price}
                        className="rounded-full bg-jade-500 px-4 py-1 text-xs font-semibold text-white transition-transform active:scale-95 disabled:opacity-50"
                      >
                        {buying === item.id ? "..." : `${item.price} XP`}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
