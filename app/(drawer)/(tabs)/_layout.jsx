import { USER_ROLES, useRaffleContext } from '../../../context/RaffleContext';

import TabAdminLayout from '../../../components/tabs/TabAdmin';
import TabCompradorLayout from '../../../components/tabs/TabCompradorLayout';
import TabVendedorLayout from '../../../components/tabs/TabVendedor';

const getTabLayout = (role) => {
  switch (role) {
    case USER_ROLES.ADMIN:
      return <TabAdminLayout />; 
    case USER_ROLES.SELLER:
      return <TabVendedorLayout />; 
    case USER_ROLES.BUYER:
      return <TabCompradorLayout />;
  }
};

export default function TabLayout() {
  const { userRole } = useRaffleContext();

  return getTabLayout(userRole);
}