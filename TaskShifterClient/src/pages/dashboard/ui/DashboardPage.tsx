import { Separator } from "@/shared/ui/separator";
import { Aside } from "@/widgets/aside/ui/Aside";
import { Board } from "./Board";


export function DashboardPage() {
    return (
        <main className="flex w-full h-full px-[100px] py-[15px] flex-row">
            <div className="flex flex-row gap-5 items-start w-full h-full">
                <Aside />
                <Separator orientation="vertical" />
                <Board />
            </div>
        </main>
    );
}
