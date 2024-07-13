import { Separator } from "@/components/ui/separator"
import { Info } from "./_components/info"
import { BoardList } from "./_components/board-list"

const OrganizationIdPage = async () => {

  return (
    <div className="flex flex-col space-y-4">
      <Info />
      <Separator />
      <BoardList />
    </div>
  )
}

export default OrganizationIdPage