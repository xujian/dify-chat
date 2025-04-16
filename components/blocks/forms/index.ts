import { CustomBlockProps } from '../types'
import BankForm from "./bank"

const presets: Record<string, React.FC<CustomBlockProps>> = {
  bank: BankForm
}

export default presets