"use client";

import { Theme } from "@/@interfaces/theme";
import getThemes from "@/@utils/themes/getTheme";
import { useEffect, useState } from "react";
import { clsx } from "clsx";

export default function Page() {
  const [themes, setThemes] = useState<Theme[]>([]);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const result = await getThemes();
        if (result) setThemes(result);
      } catch (error) {
        console.error("Failed to fetch themes:", error);
      }
    };
    fetchThemes();
  }, []);

  console.log(themes);

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Temas Disponíveis</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className={`p-4 rounded-lg shadow-md border ${theme.isDefault ? "border-blue-500 border-2" : ""} transition-all bg-${theme.background}`}
          >
            <div
              className={`p-2 rounded-md mb-2 font-bold text-center text-${theme.primary}`}
            >
              {theme.name}
            </div>
            <div className="flex gap-2">
              <div
                className={`w-6 h-6 rounded-full border bg-${theme.primary}`}
              />
              <div
                className={`w-6 h-6 rounded-full border bg-${theme.primary}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
