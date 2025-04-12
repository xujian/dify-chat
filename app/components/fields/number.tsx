import { FC } from 'react'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { InputProps } from '@/models';

const number: FC<InputProps> = (props) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label>{props.label}1</Label>
      <Input type="number" name={props.name} />
    </div>
  );
};

export default number