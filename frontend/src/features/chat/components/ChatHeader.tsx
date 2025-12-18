import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import RoomsSidebar from "./RoomsSidebar"

export default function ChatHeader() {
    return (
        <header className="sticky top-0 z-10 border-b bg-background/60 backdrop-blur">
            <div className="h-14 px-4 flex items-center justify-between">
                <div className="lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="Abrir menu">
                                <Menu className="size-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0">
                            <RoomsSidebar className="h-full w-72" />
                        </SheetContent>
                    </Sheet>
                </div>

                <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold">
                    Chat do ENTERness
                </h1>

                <div className="opacity-0">
                    <Button variant="ghost" size="icon" />
                </div>
            </div>
        </header>
    )
}
