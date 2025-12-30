import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Title from '../../../components/common/Titles/Title';
import { Colors, Typography } from '../../../constants/theme';

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const WHITE = Colors.principal.white;
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_700 = Colors.principal.neutral[700];
const GREEN_100 = Colors.principal.green[100];

const mockVendors = [
  { id: 1, name: "Ana Torres", email: "ana.t@email.com", sales: 15500, avatarUrl: "https://placehold.co/50x50/16CD91/FFFFFF?text=AT" },
  { id: 2, name: "Carlos Ruiz", email: "carlos.r@email.com", sales: 12800, avatarUrl: "https://placehold.co/50x50/34D399/FFFFFF?text=CR" },
  { id: 3, name: "Maria López", email: "maria.l@email.com", sales: 9950, avatarUrl: "https://placehold.co/50x50/059669/FFFFFF?text=ML" },
  { id: 4, name: "Javier Vargas", email: "javier.v@email.com", sales: 8100, avatarUrl: "https://placehold.co/50x50/14B8A6/FFFFFF?text=JV" },
  { id: 5, name: "Elena Gómez", email: "elena.g@email.com", sales: 5500, avatarUrl: "https://placehold.co/50x50/059669/FFFFFF?text=EG" },
  { id: 6, name: "Roberto Diaz", email: "roberto.d@email.com", sales: 3200, avatarUrl: "https://placehold.co/50x50/34D399/FFFFFF?text=RD" },
];

const VendorListItem = ({ vendor }) => (
  <TouchableOpacity style={styles.vendorItem}>
    <Image source={{ uri: vendor.avatarUrl }} style={styles.vendorAvatar} />
    
    <View style={styles.vendorInfo}>
      <Text style={styles.vendorName}>{vendor.name}</Text>
      <Text style={styles.vendorEmail}>{vendor.email}</Text>
    </View>
    
    <View style={styles.vendorSales}>
      <Text style={styles.salesValue}>S/ {vendor.sales.toLocaleString('es-PE')}</Text>
      <Text style={styles.salesLabel}>Ventas Totales</Text>
    </View>
    
    <Ionicons name="chevron-forward" size={20} color={NEUTRAL_700} />
  </TouchableOpacity>
);


export default function PageVendedores() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredVendors = useMemo(() => {
    if (!searchTerm) {
      return mockVendors;
    }
    const lowerCaseSearch = searchTerm.toLowerCase();
    return mockVendors.filter(vendor => 
      vendor.name.toLowerCase().includes(lowerCaseSearch) ||
      vendor.email.toLowerCase().includes(lowerCaseSearch)
    );
  }, [searchTerm]);

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <Title>
            Gestión de Vendedores
        </Title>
        <Text style={styles.subtitle}>Listado de su equipo de ventas activo ({filteredVendors.length})</Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={NEUTRAL_700} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o correo..."
            placeholderTextColor={Colors.principal.green[700]}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>

      <FlatList
        data={filteredVendors}
        renderItem={({ item }) => <VendorListItem vendor={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="alert-circle-outline" size={50} color={NEUTRAL_200} />
            <Text style={styles.emptyText}>No se encontraron vendedores para {searchTerm}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
    paddingBottom: 15,
  },
  mainTitle: {
    color: GREEN_900,
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.extrabold,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_700,
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GREEN_100,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: GREEN_500,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.sizes.base,
    color: GREEN_900,
    marginLeft: 10,
    height: 40,
  },
  
  listContent: {
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  vendorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
  },
  vendorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: GREEN_500,
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
  },
  vendorEmail: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
  },
  vendorSales: {
    alignItems: 'flex-end',
    marginRight: 10,
  },
  salesValue: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.extrabold,
    color: Colors.principal.red[500],
  },
  salesLabel: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_700,
  },
  
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50,
    backgroundColor: GREEN_100,
    borderRadius: 12,
    marginTop: 20,
  },
  emptyText: {
    fontSize: Typography.sizes.lg,
    color: GREEN_900,
    marginTop: 10,
    textAlign: 'center',
  }
});