import { BindingContainer } from "@/libs/core/BindingContainer"
import { createContext } from "react"

export type CanvasContextType = {
  bdCon?: BindingContainer
  // processBinding: (binding: BindingSchema) => any
}

export const CanvasContext = createContext<CanvasContextType>({} as any)

