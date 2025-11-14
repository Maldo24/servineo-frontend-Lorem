import { Input } from '../../../atoms/inputs';

interface MeetingLinkSectionProps {
  meetingLink: string;
  error?: string;
  onChange: (value: string) => void;
  readonly?: boolean;
}

export const MeetingLinkSection = ({ meetingLink, error, onChange ,readonly}: MeetingLinkSectionProps) => {
  return (
    <div className="space-y-2">
      <Input
        label="Enlace de reunión"
        value={meetingLink}
        readOnly={readonly}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://meet.example.com/abcd"
        error={error}
      />
      <p className="text-xs text-gray-600">Si no ingresa enlace, se generará uno automáticamente.</p>
    </div>
  );
};