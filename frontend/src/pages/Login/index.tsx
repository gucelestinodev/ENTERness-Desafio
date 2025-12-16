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
    <Card className="w-dvw h-dvh rounded-none border-0">
      <CardContent className="h-full flex items-center justify-center p-6">
        <div className="w-full max-w-sm text-center space-y-5 animate-fade-in">
          <h2 className="text-2xl font-semibold">Entrar no chat</h2>

          <div className="space-y-2">
            <Label className="w-full text-center">Seu nome</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Gustavo"
              onKeyDown={(e) => e.key === "Enter" && enter()}
            />
          </div>

          <div className="space-y-2">
            <Label className="w-full text-center">Sala (opcional)</Label>
            <Input
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



        </div>
      </CardContent>
    </Card>
  );
}
