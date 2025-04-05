import React from 'react'
import { CodeLanguage } from '@/types/app'
import CodeEditor from '../code-editor'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/app/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form"
import { Input } from "@/app/components/ui/input"

interface FormProps {
  data: any
}

const CustomBlock: React.FC<FormProps> = ({ data }) => {
  console.log('f------------form:data', data)

  const formSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  if (Array.isArray(data.fields)) {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>需要提供您的手机号</FormLabel>
                <FormControl>
                  <Input placeholder="请输入手机号"
                    type="number"
                    maxLength={11}
                    {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    )
  }
  return (
    <div className="json-output-wrapper">
      <CodeEditor
        value={data}
        title={<div className='text-sm text-gray-500'>JSON Output</div>}
        language={CodeLanguage.json}
        readOnly={true}
        isJSONStringifyBeauty={true}
      />
    </div>
  )
}

export default CustomBlock