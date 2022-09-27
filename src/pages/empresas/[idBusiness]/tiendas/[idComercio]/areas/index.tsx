import { Dashboard } from "../../../../../../layout/Dashboard/Dashboard";
import { Index } from "../../../../../../app/business/areas";
const Areas = (): JSX.Element => {
    return (
        <div className="bg-white">
            <Dashboard>
                <Index />
            </Dashboard>
        </div>
    )
}
export default Areas;