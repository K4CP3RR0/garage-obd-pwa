import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <div className="mx-auto grid h-14 w-full max-w-6xl grid-cols-3 items-center px-4">
      <Label className="text-xl animate-in fade-in slide-in-from-bottom-2 justify-self-start font-semibold text-primary"><Link href="/">Telemetryx</Link></Label>
      <NavigationMenu className="animate-in fade-in slide-in-from-bottom-2 justify-self-center">
        <NavigationMenuList >
          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()} render={<Link href="/">Strona główna</Link>} />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()} render={<Link href="/login">Garaż</Link>} />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()} render={<Link href="#funkcje">Funkcje</Link>} />
          </NavigationMenuItem>
          
        </NavigationMenuList>
      </NavigationMenu>
      <NavigationMenu className="animate-in fade-in slide-in-from-bottom-2 justify-self-end">
      <NavigationMenuList>
      <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()} render={<Link href="/login">Zaloguj się</Link>} />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      </div>
      <div className="relative flex flex-1 flex-col items-center justify-center text-center overflow-hidden px-4 mt-10 animate-in fade-in slide-in-from-bottom-2">
        <Button className="text-pretty font-bold py-4">TELEMETRYX</Button>
        <Label className="text-4xl text-primary font-semibold mt-5">Twoje auto w liczbach.</Label>
        <Label className="text-4xl font-semibold">Telemetria, której możesz zaufać.</Label>
        <Label className="mt-5 text-base text-pretty">Precyzyjna analiza korekt paliwowych, obciążeń <br/> i wypadania zapłonów na przejrzystych wykresach.</Label>
        <div className="space-x-5 mt-10">
        <Link href="/register"><Button className="text-xl p-5 font-semibold">Załóż konto</Button></Link>
        <Link href="/login"><Button className="text-xl p-5 font-semibold">Zaloguj się</Button></Link>
        </div>
       
      </div>

      <SiteFooter />
    </div>
  );
}
