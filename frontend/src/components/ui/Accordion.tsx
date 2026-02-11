import { useState, memo, type ReactNode } from 'react';

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  defaultOpen?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

export const Accordion = memo(function Accordion({ items, allowMultiple = false }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(() => {
    const initialOpen = new Set<string>();
    items.forEach((item) => {
      if (item.defaultOpen) {
        initialOpen.add(item.id);
      }
    });
    return initialOpen;
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const isOpen = openItems.has(item.id);

        return (
          <div
            key={item.id}
            className="border border-light-grey rounded-[5px] overflow-hidden bg-white"
          >
            {/* Accordion Header */}
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between px-4 py-3 text-left
                       hover:bg-primary-lighter/20 transition-colors"
            >
              <div className="flex-1">{item.title}</div>
              <svg
                className={`w-5 h-5 text-navy-dark transition-transform duration-200 flex-shrink-0 ml-2
                          ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Accordion Content */}
            {isOpen && (
              <div className="px-4 py-3 border-t border-light-grey">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});
