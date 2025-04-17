import { FC } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Field } from '@/models'

const number: FC<Field> = (props) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label>{props.label}</Label>
      <Input type="number" name={props.name}
        value={props.value}
        onChange={(e) => props.onChange?.(e.target.value)} />
    </div>
  );
};

export default number