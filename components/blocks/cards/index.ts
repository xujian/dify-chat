import { CustomBlockProps } from '../types'
import Ticket from './ticket'

const presets: Record<string, React.FC<CustomBlockProps>> = {
  ticket: Ticket
}

export default presets