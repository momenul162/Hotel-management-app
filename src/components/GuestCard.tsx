import { cn } from "../lib/utils";
import { Guest } from "../types";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { MailIcon, PhoneIcon, User } from "lucide-react";
import { Button } from "../components/ui/button";

interface GuestCardProps {
  guest: Guest;
  className?: string;
  onViewDetails?: (id: string) => void;
}

export function GuestCard({ guest, className, onViewDetails }: GuestCardProps) {
  const { _id, name, email, phone, nationality, visits, vip, avatar } = guest;

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]",
        "animate-in fade-in-delay",
        className
      )}
      style={{ "--index": "1" } as React.CSSProperties}
    >
      <CardContent className="p-5 flex flex-col items-center text-center">
        <div className="mb-3 transition-transform hover:scale-105 duration-300">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="h-20 w-20 rounded-full object-cover border-2 border-border"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
              <User className="h-10 w-10 text-muted-foreground/70" />
            </div>
          )}
        </div>

        <div className="space-y-1 mb-1">
          <h3 className="font-semibold text-base leading-none">{name}</h3>
          <p className="text-sm text-muted-foreground">{nationality}</p>
        </div>

        {vip && (
          <Badge className="mb-3 bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">
            VIP Guest
          </Badge>
        )}

        <div className="w-full space-y-2 mt-2">
          <div className="flex items-center gap-2 text-sm">
            <MailIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm truncate">{email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <PhoneIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{phone}</span>
          </div>
        </div>

        <div className="mt-4 text-sm">
          <span className="text-muted-foreground">Visits: </span>
          <span className="font-medium">{visits}</span>
        </div>
      </CardContent>

      <CardFooter className="border-t p-3 flex justify-center">
        <Button
          variant="ghost"
          className="w-full text-sm hover:bg-primary/10 transition-colors duration-300"
          onClick={() => onViewDetails?.(_id)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
