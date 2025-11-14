import { boolean } from 'zod';
import { TextArea } from '../../../atoms/textArea';

interface DescriptionSectionProps {
  description: string;
  error?: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export const DescriptionSection = ({ description, error, onChange,readOnly=false }: DescriptionSectionProps) => {
  return (
    <TextArea
      label="Descripción del trabajo"
      value={description}
      onChange={readOnly ? undefined : (e) => onChange?.(e.target.value)}
      placeholder={readOnly ? "" : "Breve descripción de lo que se requiere"}
      rows={3}
      error={error}
      readOnly={readOnly}
    />
  );
};