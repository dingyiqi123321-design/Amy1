"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const SettingsFilled = ({ className }: { className?: string }) => (
  <svg
    className={className}
    data-testid="geist-icon"
    height="12"
    strokeLinejoin="round"
    viewBox="0 0 16 16"
    width="12"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.49999 0H6.49999L6.22628 1.45975C6.1916 1.64472 6.05544 1.79299 5.87755 1.85441C5.6298 1.93996 5.38883 2.04007 5.15568 2.15371C4.98644 2.2362 4.78522 2.22767 4.62984 2.12136L3.40379 1.28249L1.28247 3.40381L2.12135 4.62986C2.22766 4.78524 2.23619 4.98646 2.1537 5.15569C2.04005 5.38885 1.93995 5.62981 1.8544 5.87756C1.79297 6.05545 1.6447 6.19162 1.45973 6.2263L0 6.5V9.5L1.45973 9.7737C1.6447 9.80838 1.79297 9.94455 1.8544 10.1224C1.93995 10.3702 2.04006 10.6112 2.1537 10.8443C2.23619 11.0136 2.22767 11.2148 2.12136 11.3702L1.28249 12.5962L3.40381 14.7175L4.62985 13.8786C4.78523 13.7723 4.98645 13.7638 5.15569 13.8463C5.38884 13.9599 5.6298 14.06 5.87755 14.1456C6.05544 14.207 6.1916 14.3553 6.22628 14.5403L6.49999 16H9.49999L9.77369 14.5403C9.80837 14.3553 9.94454 14.207 10.1224 14.1456C10.3702 14.06 10.6111 13.9599 10.8443 13.8463C11.0135 13.7638 11.2147 13.7723 11.3701 13.8786L12.5962 14.7175L14.7175 12.5962L13.8786 11.3701C13.7723 11.2148 13.7638 11.0135 13.8463 10.8443C13.9599 10.6112 14.06 10.3702 14.1456 10.1224C14.207 9.94455 14.3553 9.80839 14.5402 9.7737L16 9.5V6.5L14.5402 6.2263C14.3553 6.19161 14.207 6.05545 14.1456 5.87756C14.06 5.62981 13.9599 5.38885 13.8463 5.1557C13.7638 4.98647 13.7723 4.78525 13.8786 4.62987L14.7175 3.40381L12.5962 1.28249L11.3701 2.12137C11.2148 2.22768 11.0135 2.2362 10.8443 2.15371C10.6111 2.04007 10.3702 1.93996 10.1224 1.85441C9.94454 1.79299 9.80837 1.64472 9.77369 1.45974L9.49999 0ZM8 11C9.65685 11 11 9.65685 11 8C11 6.34315 9.65685 5 8 5C6.34315 5 5 6.34315 5 8C5 9.65685 6.34315 11 8 11Z"
      fill="currentColor"
    ></path>
  </svg>
);

const buttonVariants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline"
};

const sizeVariants = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10"
};

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const Comp = asChild ? Slot : "button";

    const iconVariants = {
      hidden: { x: 0, y: 0, opacity: 0, rotate: 0, scale: 0 },
      visible: (custom: { x: number; y: number }) => ({
        x: custom.x,
        y: custom.y,
        opacity: 0.6,
        rotate: 360,
        scale: 1,
        transition: {
          x: { duration: 0.2, ease: "easeOut" },
          y: { duration: 0.2, ease: "easeOut" },
          opacity: { duration: 0.2 },
          scale: { duration: 0.2 },
          rotate: {
            duration: 0.6,
            type: "spring",
            stiffness: 100,
            damping: 10,
          },
        },
      }),
    };

    return (
      <motion.div
        className="relative inline-block"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <AnimatePresence>
          <motion.div
            initial="hidden"
            animate={isHovered ? "visible" : "hidden"}
            variants={iconVariants}
            custom={{ x: -8, y: -8 }}
            className="pointer-events-none absolute left-[2px] top-[2px] z-10"
          >
            <SettingsFilled className="text-blue-500 dark:text-blue-400" />
          </motion.div>
          <motion.div
            initial="hidden"
            animate={isHovered ? "visible" : "hidden"}
            variants={iconVariants}
            custom={{ x: 8, y: 8 }}
            className="pointer-events-none absolute bottom-[2px] right-[2px] z-10"
          >
            <SettingsFilled className="text-blue-500 dark:text-blue-400" />
          </motion.div>
        </AnimatePresence>
        
        <Comp
          className={cn(
            "relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            buttonVariants[variant],
            sizeVariants[size],
            "border border-blue-200 bg-blue-50 text-blue-900 hover:bg-blue-100 hover:border-blue-300 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100 dark:hover:bg-blue-900",
            className
          )}
          ref={ref}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          {...props}
        >
          <motion.span
            className="relative z-20"
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.span>
        </Comp>
      </motion.div>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";