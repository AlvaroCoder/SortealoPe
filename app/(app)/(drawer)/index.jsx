
import { useRouter } from 'expo-router';
import { USER_ROLES, useRaffleContext } from '../../../context/RaffleContext';
import DataCardEvent from "../../../mock/DataCardEvent.json";
import MonitorAdminDashboard from '../../../screens/MonitorAdminDashboard';
import MonitorBuyerDashboard from '../../../screens/MonitorBuyerDashboard';
import MonitorSellerDashboard from '../../../screens/MonitorSellerDashboard';

export default function Index() {
  const router = useRouter();
  const { userRole, updateRole } = useRaffleContext(); 
  const dataCards = DataCardEvent;

  if (userRole === USER_ROLES.ADMIN) {
    return <MonitorAdminDashboard userRole={userRole} updateRole={updateRole}/>
  }

  if ( userRole === USER_ROLES.SELLER) {
    return <MonitorSellerDashboard router={router} dataCards={dataCards} userRole={userRole} updateRole={updateRole} />;
  }
  
  if (userRole === USER_ROLES.BUYER) {
    return <MonitorBuyerDashboard />
  }

  return <MonitorBuyerDashboard />;
}
