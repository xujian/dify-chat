import { FC } from 'react'
import { Label } from '@/app/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import { InputProps } from '@/models'

const select: FC<InputProps> = (props) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label>{props.label}</Label>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={props.label} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{props.label}</SelectLabel>
            {props.options?.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default select