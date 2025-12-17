import { cn } from "@/lib/utils"
import { useChat } from "@/features/chat/store/chat"
import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

const normalize = (s?: string) => (s ?? "").trim().toLowerCase()

function RoomButton({
  name,
  active,
  count,
  onClick,
}: {
  name: string
  active: boolean
  count?: number
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2 rounded-md transition-colors flex items-center justify-between",
        active
          ? "bg-primary text-primary-foreground"
          : "hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <span>#{name}</span>
      {typeof count === "number" ? (
        <span
          className={cn(
            "text-xs opacity-80",
            active ? "text-primary-foreground" : "text-muted-foreground"
          )}
        >
          {count}
        </span>
      ) : null}
    </button>
  )
}

export default function RoomsSidebar({
  className,
}: {
  className?: string
}) {
  const {
    fixedRooms,
    roomsOnline,
    rooms: localRooms,
    room,
    switchRoom,
    logout,
  } = useChat()

  const fixedSet = new Set(fixedRooms.map(normalize))

  const countMap = new Map(roomsOnline.map((r) => [normalize(r.name), r.usersCount]))

  // Dinâmicas ONLINE: só salas não fixas com gente dentro
  const onlineDynamicActive = roomsOnline
    .map((r) => ({ name: normalize(r.name), usersCount: r.usersCount }))
    .filter((r) => r.name && !fixedSet.has(r.name) && (r.usersCount ?? 0) > 0)

  // fallback local: salas digitadas pelo usuário (não duplicar)
  const localDynamicFallback = (localRooms ?? [])
    .map(normalize)
    .filter((n) => n && !fixedSet.has(n))
    .filter((n) => !onlineDynamicActive.some((r) => r.name === n))
    .map((n) => ({ name: n, usersCount: countMap.get(n) }))

  const dynamicRooms = [...onlineDynamicActive, ...localDynamicFallback].sort((a, b) =>
    a.name.localeCompare(b.name)
  )

  const fixedRoomsWithCount = fixedRooms.map((fr) => {
    const n = normalize(fr)
    return { name: fr, usersCount: countMap.get(n) ?? 0 }
  })

  return (
    <aside className={cn("bg-background h-full flex flex-col", className)}>
      <div className="p-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Salas</h2>
      </div>

      <Separator />
      <div className="flex-1 overflow-auto">
        <nav className="p-2 space-y-1">
          {fixedRoomsWithCount.map((r) => (
            <RoomButton
              key={r.name}
              name={r.name}
              count={r.usersCount}
              active={normalize(r.name) === normalize(room)}
              onClick={() => switchRoom(r.name)}
            />
          ))}
        </nav>

        {/* Dinâmicas */}
        <div className="px-2 pb-2">
          <Accordion type="single" collapsible defaultValue="others">
            <AccordionItem value="others">
              <AccordionTrigger className="px-3 text-sm">
                Outras salas
                {dynamicRooms.length ? (
                  <span className="ml-2 text-muted-foreground">
                    ({dynamicRooms.length})
                  </span>
                ) : null}
              </AccordionTrigger>

              <AccordionContent>
                {dynamicRooms.length ? (
                  <div className="space-y-1">
                    {dynamicRooms.map((r) => (
                      <RoomButton
                        key={r.name}
                        name={r.name}
                        count={typeof r.usersCount === "number" ? r.usersCount : undefined}
                        active={normalize(r.name) === normalize(room)}
                        onClick={() => switchRoom(r.name)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="px-3 py-2 text-xs text-muted-foreground">
                    Nenhuma sala criada ainda.
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <div className="border-t p-3">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={logout}
        >
          <LogOut className="mr-2 size-4" />
          Sair
        </Button>
      </div>
    </aside>
  )
}
