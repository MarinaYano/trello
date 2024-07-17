import { Separator } from "@/components/ui/separator"
import { Info } from "lucide-react"
import ActivityList from "./_components/activity-list"
import { Suspense } from "react"


const ActivityPage = () => {
  return (
    <div className="w-full">
      <Info className="" />
      <Separator />
      <Suspense fallback={<ActivityList.Skeleton />}>
        <ActivityList />
      </Suspense>
    </div>
  )
}

export default ActivityPage