import { useState } from "react";
import { useChat } from "@/features/chat/store/chat";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const { setUserRoom } = useChat();
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [room, setRoom] = useState(localStorage.getItem("room") || "");

  const enter = () => {
    if (!name.trim()) return;
    localStorage.setItem("name", name);
    localStorage.setItem("room", room);
    setUserRoom(name, room || undefined);
  };

  return (
    <div className="w-dvw h-dvh bg-linear-to-b from-background to-muted/40">
      <div className="h-full grid place-items-center p-6">
        <Card className="w-full max-w-md shadow-sm">
          <CardContent className="pt-8 flex flex-col items-center text-center gap-5">
            <div className="w-full max-w-sm text-center space-y-5 animate-fade-in">
              <h2 className="text-2xl font-semibold">Entrar no chat</h2>

              <div className="space-y-2">
                <Label htmlFor="name" className="w-full text-center">Seu nome</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Gustavo"
                  onKeyDown={(e) => e.key === "Enter" && enter()}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="room" className="w-full text-center">Sala (opcional)</Label>
                <Input
                  id="room" 
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="geral, suporte..."
                  onKeyDown={(e) => e.key === "Enter" && enter()}
                />
              </div>

              <Button
                variant="brand"
                className="w-full"
                onClick={enter}
                disabled={!name.trim()}
              >
                Entrar
              </Button>
              <div className="p-3 text-xs text-muted-foreground">
                Se entrar sem sala, você vai para <strong>#geral</strong>.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
