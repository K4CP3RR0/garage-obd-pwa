import Link from "next/link";
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

export default function LoginPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Logowanie</CardTitle>
        <CardDescription>Zaloguj się do OBDGarage PWA</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="mail@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Hasło</Label>
          <Input id="password" type="password" />
        </div>
        <Button className="w-full" type="button">
          Zaloguj się
        </Button>
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