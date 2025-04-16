import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const BankForm: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>开户行资料</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bankName">开户行</Label>
          <Input id="bankName" placeholder="Enter bank name" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountNumber">卡号</Label>
          <Input id="accountNumber" placeholder="Enter account number" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountHolder">户名</Label>
          <Input id="accountHolder" placeholder="Enter account holder name" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="idNumber">身份证号</Label>
          <Input id="idNumber" placeholder="Enter ID number" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">手机号</Label>
          <Input id="phoneNumber" placeholder="Enter phone number" />
        </div>
      </CardContent>
    </Card>
  )
}

export default BankForm

