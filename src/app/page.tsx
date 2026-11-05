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
export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex flex-row">
      <Label className="text-6xl m-5">OBDGarage PWA</Label>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()} render={<Link href="/">Strona główna</Link>} />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()} render={<Link href="/garage">Garaż</Link>} />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()} render={<Link href="/login">Zaloguj się</Link>} />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      </div>
      <div className="flex flex-row">
        <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <Image
        src="/images/zaslepka-auto.jpg"
        alt="Event cover"
        width="1920"
        height="1080"
        loading="eager"
        className="relative z-20 aspect-video w-full object-cover brightness-80"
      />
      <CardHeader>
        <CardTitle>Marka Model</CardTitle>
        <CardDescription>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">Przejdź do auta</Button>
      </CardFooter>
    </Card>
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <Image
        src="/images/zaslepka-auto.jpg"
        alt="Event cover"
        width="1920"
        height="1080"
        loading="eager"
        className="relative z-20 aspect-video w-full object-cover brightness-80"
      />
      <CardHeader>
        <CardTitle>Marka Model</CardTitle>
        <CardDescription>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">Przejdź do auta</Button>
      </CardFooter>
    </Card>
      </div>
      
      <Button className="ml-5">Przycisk</Button>
    </div>
    
  );
}
