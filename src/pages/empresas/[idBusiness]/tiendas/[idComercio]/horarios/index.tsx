
import { useRouter } from "next/router";
import Horary from "../../../../../../app/business/horary/Horary";
import { Dashboard } from "../../../../../../layout/Dashboard/Dashboard";


 const Schedules=()=>{
  const router=useRouter()

   return (
    <Dashboard>
      <Horary/>
     
    </Dashboard>
    
   )
}
export default Schedules;
