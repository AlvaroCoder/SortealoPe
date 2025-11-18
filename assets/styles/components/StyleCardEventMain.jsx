import { StyleSheet } from "react-native";
import { Colors } from "../../../constants/theme";

export default StyleSheet.create({
  mainContent: {
    flexGrow : 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContent: {
    gap : 4
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.black, 
    textDecorationLine : 'underline'
  },
  infoContainer: {
    gap: 6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.dark, 
  },
  statsContainer: {
    flexDirection: "row",
    gap: 24,
    marginTop: 8,
    marginBottom : 10
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statIconContainer: {
    backgroundColor: Colors.principal.red[50] || "#FEE2E2",
    padding: 6,
    borderRadius: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.principal.red[500],
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light, 
    marginTop: 2,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.principal.yellow[100] || "#FEF3C7", 
  },
  statusStarted: {
    backgroundColor: Colors.success || "#DCFCE7", 
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.principal.red[700], 
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light || "#E5E5E5", 
    marginVertical: 16,
  },
  bodyContent: {

  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 8,
  },
  descriptionContainer: {

  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.black,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.dark, 
    lineHeight: 20,
  },
  viewEventButton: {
    backgroundColor: Colors.principal.red[500],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  viewEventText: {
    color: Colors.principal.neutral[200],
    fontSize: 16,
    fontWeight: "600",
  },
});