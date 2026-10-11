import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { TextMorph } from "./TextMorph";

export type TabItem = string | { label: string; id: string; words?: string[] };

export type AnimatedTabsProps = {
  tabs?: Array<TabItem>;
  variant?: "default" | "underline";
  activeTab?: string;
  onChange?: (tab: string, id?: string) => void;
  className?: string;
  tabClassName?: string;
  layoutId?: string;
  morphInterval?: number;
};

const defaultTabs: TabItem[] = ["Home", "Components", "Docs", "Templates"];

export const AnimatedTabs = ({
  tabs = defaultTabs,
  variant = "default",
  activeTab: controlledActiveTab,
  onChange,
  className,
  tabClassName,
  layoutId = "active-tab",
  morphInterval,
}: AnimatedTabsProps) => {
  const getTabLabel = (tab: TabItem) => (typeof tab === "string" ? tab : tab.label);
  const getTabId = (tab: TabItem) => (typeof tab === "string" ? tab : tab.id);
  const getTabWords = (tab: TabItem): string[] => {
    if (typeof tab === "string") return [tab];
    if (tab.words && tab.words.length > 0) return tab.words;
    return [tab.label];
  };

  const isControlled = controlledActiveTab !== undefined;
  const initialTab = tabs.length > 0 ? getTabId(tabs[0]) : "";
  const [internalActiveTab, setInternalActiveTab] = useState(initialTab);

  const currentActive = isControlled ? controlledActiveTab : internalActiveTab;

  const handleTabClick = (tab: TabItem) => {
    const id = getTabId(tab);
    const label = getTabLabel(tab);
    if (!isControlled) {
      setInternalActiveTab(id);
    }
    if (onChange) {
      onChange(label, id);
    }
  };

  if (variant === "underline") {
    return (
      <div className={cn("border-border relative flex items-center border-b", className)}>
        {tabs.map((tab, index) => {
          const id = getTabId(tab);
          const label = getTabLabel(tab);
          const tabWords = getTabWords(tab);
          const isActive = currentActive === id;

          return (
            <button
              key={id || index}
              type="button"
              onClick={() => handleTabClick(tab)}
              className={cn(
                "relative flex h-10 items-center px-4 text-sm font-medium transition-colors duration-200 cursor-pointer focus:outline-none",
                isActive
                  ? "text-primary dark:text-white font-semibold"
                  : "text-muted-foreground hover:text-foreground",
                tabClassName
              )}
            >
              {isActive && (
                <motion.div
                  layoutId={`${layoutId}-underline`}
                  className="bg-orange-500 absolute right-0 bottom-0 left-0 h-0.5"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center">
                {tabWords.length > 1 ? (
                  <TextMorph
                    prefix=""
                    words={tabWords}
                    interval={morphInterval ?? (isActive ? 2800 : 3600)}
                    className="inline-flex items-center"
                    charClassName={isActive ? "text-primary dark:text-white font-semibold" : undefined}
                  />
                ) : (
                  <span>{label}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative mx-auto flex w-fit items-center rounded-full border border-stone-200/80 bg-stone-100/80 p-1 dark:border-stone-800/80 dark:bg-stone-900/80 backdrop-blur-md shadow-xs",
        className
      )}
    >
      {tabs.map((tab, index) => {
        const id = getTabId(tab);
        const label = getTabLabel(tab);
        const tabWords = getTabWords(tab);
        const isActive = currentActive === id;

        return (
          <button
            key={id || index}
            type="button"
            onClick={() => handleTabClick(tab)}
            className={cn(
              "relative flex h-8 items-center rounded-full px-4 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer focus:outline-none select-none active:scale-[0.97]",
              isActive
                ? "text-white font-semibold"
                : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-stone-800/50",
              tabClassName
            )}
          >
            {isActive && (
              <motion.div
                layoutId={`${layoutId}-background`}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 shadow-md shadow-orange-500/30"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 32,
                }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center">
              {tabWords.length > 1 ? (
                <TextMorph
                  prefix=""
                  words={tabWords}
                  interval={morphInterval ?? (isActive ? 2800 : 3600)}
                  className="inline-flex items-center"
                  charClassName={isActive ? "text-white" : undefined}
                />
              ) : (
                <span>{label}</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default AnimatedTabs;
