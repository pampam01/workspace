"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PortfolioItem } from "@prisma/client";

export default function SenimanProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [portofolioItem, setPortofolioItem] = useState<PortfolioItem | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    const fetchPortfolioItem = async () => {
      try {
        const response = await fetch(`/api/browse/?id=${params.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch seniman profile");
        }
        const data = await response.json();
        setPortofolioItem(data.data[0]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching seniman profile:", error);
        setIsLoading(false);
      }
    };
    fetchPortfolioItem();
  }, [params.id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Seniman Profile</h1>
      <p className="text-red-700">{portofolioItem?.seniman_id}</p>
    </div>
  );
}
