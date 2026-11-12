"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== passwordRepeat) {
      setError("Hasła nie są takie same");
      return;
    }

    setLoading(true);
    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
    });
    setLoading(false);

    if (error) {
      setError(error.message ?? "Rejestracja nieudana");
      return;
    }

    router.push("/garage");
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="justify-center">
        <CardTitle className="text-center">Rejestracja</CardTitle>
        <CardDescription className="text-center">
          Załóż konto w Telemetryx
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nazwa użytkownika</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="mail@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Hasło</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="passwordRepeat">Powtórz hasło</Label>
            <Input
              id="passwordRepeat"
              type="password"
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
              required
              minLength={8}
            />
          </div>

          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Rejestracja..." : "Zarejestruj się"}
          </Button>
        </form>

        <div className="mt-4 space-y-2">
          <Label className="justify-center">Masz już konto?</Label>
          <Link href="/login">
            <Button className="w-full" type="button" variant="outline">
              Zaloguj się
            </Button>
          </Link>
        </div>
      </CardContent>

      <CardFooter className="justify-center">
        <Link
          href="/"
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Wróć na stronę główną
        </Link>
      </CardFooter>
    </Card>
  );
}