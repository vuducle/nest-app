"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "signup";
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = "login",
  onSuccess,
}) => {
  const [mode, setMode] = useState<"login" | "signup">(defaultMode);

  const handleClose = () => {
    setMode(defaultMode);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 bg-transparent border-0">
        <div className="relative">
          {mode === "login" ? (
            <LoginForm
              onSwitchToSignup={() => setMode("signup")}
              onSuccess={onSuccess}
            />
          ) : (
            <SignupForm
              onSwitchToLogin={() => setMode("login")}
              onSuccess={onSuccess}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
