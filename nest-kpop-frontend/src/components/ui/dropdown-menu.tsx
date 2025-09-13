"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownMenuProps {
  children: React.ReactNode;
  className?: string;
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  className?: string;
  onSelect?: () => void;
  disabled?: boolean;
}

interface DropdownMenuSeparatorProps {
  className?: string;
}

const DropdownMenuContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  children,
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div className={cn("relative", className)}>{children}</div>
    </DropdownMenuContext.Provider>
  );
};

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
  children,
  className,
  asChild = false,
}) => {
  const { isOpen, setIsOpen } = React.useContext(DropdownMenuContext);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
      className: cn(
        (children as React.ReactElement<any>).props.className,
        className
      ),
    });
  }

  return (
    <button
      onClick={handleClick}
      className={cn("outline-none", className)}
      type="button"
    >
      {children}
    </button>
  );
};

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  children,
  className,
  align = "end",
  side = "bottom",
  sideOffset = 4,
}) => {
  const { isOpen, setIsOpen } = React.useContext(DropdownMenuContext);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  const alignmentClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  };

  const sideClasses = {
    top: "bottom-full mb-2",
    right: "left-full ml-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
  };

  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute z-50 min-w-[200px] rounded-lg border bg-white dark:bg-gray-900 shadow-lg animate-in fade-in-0 zoom-in-95 duration-200",
        alignmentClasses[align],
        sideClasses[side],
        className
      )}
      style={{ marginTop: side === "bottom" ? sideOffset : undefined }}
    >
      <div className="p-1">{children}</div>
    </div>
  );
};

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  children,
  className,
  onSelect,
  disabled = false,
}) => {
  const { setIsOpen } = React.useContext(DropdownMenuContext);

  const handleClick = () => {
    if (!disabled && onSelect) {
      onSelect();
      setIsOpen(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        "focus:bg-gray-100 dark:focus:bg-gray-800",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
};

export const DropdownMenuSeparator: React.FC<DropdownMenuSeparatorProps> = ({
  className,
}) => {
  return (
    <div className={cn("h-px bg-gray-200 dark:bg-gray-700 my-1", className)} />
  );
};
