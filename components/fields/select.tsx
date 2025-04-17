import { FC } from 'react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field } from '@/models'

const select: FC<Field> = (props) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label>{props.label}</Label>
      <Select value={props.value} onValueChange={(value) => props.onChange?.(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={props.label} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{props.label}</SelectLabel>
            {props.options?.map((option) => (
              <SelectItem
                value={typeof option === 'string'
                  ? option
                  : option.value}
                key={typeof option === 'string'
                  ? option
                  : option.value}>
                {typeof option === 'string'
                  ? option
                  : option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default select