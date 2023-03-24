import { useRouter } from "vue-router"
import { getJumpUrl } from "./utils"
import { useAppData } from "@/stores/appData"
import bridge from '@/common/bridge'

export default function () {
  const { isInApp } = useAppData()
  const router = useRouter()

  return (id: number, templateType: number) => {
    const jumpUrl = getJumpUrl(id, templateType)
    if (isInApp) {
      bridge.nativeJump(jumpUrl)
    } else {
      router.push(jumpUrl)
    }
  }
}