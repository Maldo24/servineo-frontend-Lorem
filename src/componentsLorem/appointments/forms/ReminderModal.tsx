import React, { useRef, useEffect, useState, useMemo } from "react";

interface ReminderModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reminderTime: number) => void;
}

const ReminderModal: React.FC<ReminderModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const amountBtnRef = useRef<HTMLButtonElement | null>(null);

  const [amount, setAmount] = useState<number>(12);
  const [unit, setUnit] = useState<"minutes" | "hours" | "days">("hours");
  const [amountOpen, setAmountOpen] = useState(false);
  const [dropdownDirection, setDropdownDirection] = useState<"up" | "down">(
    "down"
  );
  const [dropdownMaxHeight, setDropdownMaxHeight] = useState<number>(96);

  const timeOptions = useMemo(() => {
    if (unit === "minutes") return [5, 10, 15, 30, 45];
    if (unit === "hours") return [1, 2, 3, 6, 12];
    return [1];
  }, [unit]);

  useEffect(() => {
    if (!timeOptions.includes(amount)) {
      setAmount(timeOptions[0]);
    }
  }, [unit, timeOptions, amount]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!amountOpen || !amountBtnRef.current || !dialogRef.current) return;

    const btnRect = amountBtnRef.current.getBoundingClientRect();
    const dialogRect = dialogRef.current.getBoundingClientRect();

    const margin = 10;
    const desiredHeight = 90;

    const spaceBelow = dialogRect.bottom - btnRect.bottom - margin;
    const spaceAbove = btnRect.top - dialogRect.top - margin;

    if (spaceBelow >= desiredHeight || spaceBelow >= spaceAbove) {
      setDropdownDirection("down");
      setDropdownMaxHeight(Math.max(50, Math.min(spaceBelow, desiredHeight)));
    } else {
      setDropdownDirection("up");
      setDropdownMaxHeight(Math.max(50, Math.min(spaceAbove, desiredHeight)));
    }
  }, [amountOpen]);

  const handleConfirm = () => {
    let multiplier = 1;
    if (unit === "hours") multiplier = 60;
    if (unit === "days") multiplier = 60 * 24;

    const reminderTime = amount * multiplier;
    onConfirm(reminderTime);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reminder-title"
        className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto"
      >
        <div className="p-6 pb-4">
          <h3
            id="reminder-title"
            className="text-lg font-semibold text-black mb-3"
          >
            Recordatorio
          </h3>

          <div className="flex items-center gap-4 mt-2">
            <div className="relative">
              <button
                ref={amountBtnRef}
                type="button"
                onClick={() => setAmountOpen((prev) => !prev)}
                className="w-20 h-10 border border-gray-300 rounded overflow-hidden text-sm text-black focus:outline-none"
              >
                <div className="flex w-full h-full">
                  <span className="flex-1 flex items-center justify-center bg-white text-black">
                    {amount}
                  </span>
                  <span className="w-6 flex items-center justify-center bg-gray-200 text-xs text-black">
                    ▾
                  </span>
                </div>
              </button>

              {amountOpen && (
                <div
                  className={`absolute left-0 w-20 border border-gray-300 rounded bg-white shadow-lg overflow-y-auto text-sm text-black z-20 ${
                    dropdownDirection === "down"
                      ? "mt-1 top-full"
                      : "mb-1 bottom-full"
                  }`}
                  style={{ maxHeight: dropdownMaxHeight }}
                >
                  {timeOptions.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        setAmount(n);
                        setAmountOpen(false);
                      }}
                      className="w-full text-left px-2 py-1 hover:bg-gray-100 text-black"
                    >
                      {n}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <select
                value={unit}
                onChange={(e) =>
                  setUnit(e.target.value as "minutes" | "hours" | "days")
                }
                className="h-10 pl-3 pr-8 border border-gray-300 rounded bg-gray-100 text-sm text-black focus:outline-none appearance-none"
              >
                <option value="hours">Horas</option>
                <option value="minutes">Minutos</option>
                <option value="days">Días</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-black text-xs">
                ▾
              </span>
            </div>

            <span className="text-sm text-gray-700 whitespace-nowrap">
              Antes de la Cita
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 text-sm hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-4 py-2 rounded bg-[#2B6AE0] text-white text-sm hover:bg-[#1e4fb8] transition-colors"
            >
              Configurar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;
