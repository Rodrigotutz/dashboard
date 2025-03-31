"use client";

import { Tips } from "@prisma/client";
import { useEffect, useState } from "react";

export default function Page() {
  const [tips, setTips] = useState<Tips[]>([]);

  useEffect(() => {});

  return (
    <div>
      <div className="">
        <h2>Inicio</h2>
      </div>
    </div>
  );
}
