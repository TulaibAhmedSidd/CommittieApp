"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import Sheet from "./Sheet";
import Button from "./Button";

// const confirm = useConfirm();
// if (await confirm({ title: "End this BC?", text: "...", confirmText: "End BC", danger: true })) { ... }

const ConfirmContext = createContext(async () => false);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null);
  const resolver = useRef(null);

  const confirm = useCallback((opts) => {
    setState(opts);
    return new Promise((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const close = (value) => {
    resolver.current?.(value);
    resolver.current = null;
    setState(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Sheet
        open={!!state}
        onClose={() => close(false)}
        title={state?.title}
        urdu={state?.urdu}
        size="sm"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" full onClick={() => close(false)}>
              {state?.cancelText || "Cancel"}
            </Button>
            <Button variant={state?.danger ? "dangerSolid" : "primary"} full onClick={() => close(true)}>
              {state?.confirmText || "Yes"}
            </Button>
          </div>
        }
      >
        {state?.text && <p className="text-[15px] text-ink-700">{state.text}</p>}
      </Sheet>
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => useContext(ConfirmContext);
