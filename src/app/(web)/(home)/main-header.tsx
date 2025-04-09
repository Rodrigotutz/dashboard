"use client";
import { useEffect } from "react";
import Banner from "../../../../public/web/main-banner.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MainHeader() {
  useEffect(() => {});

  return (
    <div className="bg-white text-gray-800">
      <div className="w-full h-[70vh] flex items-center justify-between">
        <div className="flex justify-center p-5 sm:p-0 s-full sm:w-3/4 flex-col items-center">
          <div className="w-full sm:w-3/4">
            <h2 className="text-5xl font-bold mb-10 text-center">
              Tutz Dashboard
            </h2>
            <p className="text-center">
              Gerencie e publique tudo em um só lugar com praticidade e poder.
            </p>
            <Link href={"/login"} title="dashboard">
              <Button className="mt-10 p-6 w-full">Acessar Dashboard</Button>
            </Link>
          </div>
        </div>
        <div className=" hidden sm:flex w-full justify-center">
          <Image src={Banner} alt="Banner" className="w-3/4" />
        </div>
      </div>
      <div className="sm:-mt-36">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#0a0a0a"
            d="M0,96L60,112C120,128,240,160,360,160C480,160,600,128,720,112C840,96,960,96,1080,122.7C1200,149,1320,203,1380,229.3L1440,256L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
}
