import { useMemo, useState } from "react";
import { Button } from "../../../atoms/button";
import { AlertPopup } from "../popups/AlertPopup";

export type FormType = "create" | "edit" | "view";

interface EditAppointmentActionsProps {
  loading: boolean;
  changesDetected: boolean;
  onCancel: () => void;
  onDelete?: () => void;
  submitDisabled?: boolean;
  formType?: FormType;
  appointmentStart?: string | Date;
  onRequestReprogram?: () => void; // ← SOLO se notifica al padre; el padre abre Justificación
}

const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

export const EditAppointmentActions = ({
  loading,
  changesDetected,
  onCancel,
  onDelete,
  submitDisabled = false,
  formType = "edit",
  appointmentStart,
  onRequestReprogram,
}: EditAppointmentActionsProps) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupVariant, setPopupVariant] = useState<"info" | "confirm">("info");
  const [popupMessage, setPopupMessage] = useState<React.ReactNode>(null);
  const [popupConfirmLabel, setPopupConfirmLabel] = useState<string>("Confirmar");
  const [popupOnConfirm, setPopupOnConfirm] = useState<(() => void) | undefined>(undefined);
  
  const within3h = useMemo(() => {
    if (!appointmentStart) return false;
    const start = new Date(appointmentStart).getTime();
    return start - Date.now() < THREE_HOURS_MS;
  }, [appointmentStart]);

  const openInfo = (message: React.ReactNode) => {
    setPopupVariant("info");
    setPopupMessage(message);
    setPopupOnConfirm(undefined);
    setPopupOpen(true);
  };

  const openConfirm = (
    message: React.ReactNode,
    confirmLabel = "Confirmar",
    onConfirm?: () => void
  ) => {
    setPopupVariant("confirm");
    setPopupMessage(message);
    setPopupConfirmLabel(confirmLabel);
    setPopupOnConfirm(() => onConfirm);
    setPopupOpen(true);
  };

  const askConfirmCancel = () => {
    if (within3h) {
      openInfo(
        <>No es posible cancelar una cita con menos de <b>3 horas</b> de anticipación.</>
      );
      return;
    }
    openConfirm(
      <>
        ¿Está seguro que desea cancelar la cita actual?
        <br />
        <span className="text-gray-500 text-xs">
          *En caso de cancelación,la cita dejara de ser accesible.
        </span>

      </>,
      "Confirmar",
      () => { onDelete?.(); } // ← aquí recién se pide justificación (en el padre)
    );
  };

  const askConfirmReprogram = () => {
    if (within3h) {
      openInfo(
        <>La reprogramación de citas deberá realizarse con al menos <b>3 horas</b> de anticipación.</>
      );
      return;
    }
    openConfirm(
      <>
        ¿Esta seguro que desea reprogramar la cita actual?
        <br />
        <span className="text-gray-500 text-xs">
          *En caso de reprogramación, la cita actual será cancelada.
        </span>
      </>,
      "Confirmar",
      () => { onRequestReprogram?.(); }
    );
  };

  return (
    <div className="flex items-center justify-end gap-2 pt-2">
      <Button variant="secondary" onClick={onCancel}>Volver</Button>

      {formType === "create" && (
        <Button type="submit" loading={loading} disabled={!changesDetected || submitDisabled}>
          Crear Cita
        </Button>
      )}

      {formType === "edit" && (
        <>
          <Button type="submit" onClick={askConfirmReprogram}>Reprogramar</Button>
          <Button type="submit" loading={loading} disabled={!changesDetected || submitDisabled}>
            Editar
          </Button>
        </>
      )}

      {formType === "view" && onDelete && (
        <Button onClick={askConfirmCancel}>Cancelar Cita</Button>
      )}

      <AlertPopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        variant={popupVariant}
        title={popupVariant === "confirm" ? "Confirmar acción" : "Atención"}
        message={popupMessage ?? ""}
        confirmLabel={popupConfirmLabel}
        cancelLabel="Volver"
        onConfirm={popupOnConfirm}

      />
    </div>
  );
};
