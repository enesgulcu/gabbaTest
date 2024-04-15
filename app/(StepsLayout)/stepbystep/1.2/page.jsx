"use client"
import SendDocument from "@/components/stepbystep/SendDocument"
import { useParams } from "next/navigation"

const StepPage = () => {
  const { id } = useParams()

  return <SendDocument lang={"tr"} id={id}/>
}

export default StepPage