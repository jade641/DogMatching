import {
  Activity,
  ArrowLeft,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  FileText,
  MapPin,
  MessageSquare,
  Stethoscope,
  User
} from "lucide-react-native";
import { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Btn, FONT, MOCK_DOGS, T, useV3 } from "../contexts/AppContext";
import type { VeterinaryExamination, VeterinaryRequest } from "../types";

// Mock data for veterinary requests
const MOCK_VET_REQUESTS: VeterinaryRequest[] = [
  {
    id: "vr1",
    dogId: "1",
    dog: MOCK_DOGS[0],
    ownerId: "owner1",
    owner: MOCK_DOGS[0].owner,
    requestDate: "2024-01-15",
    preferredDate: "2024-01-20",
    reason: "Annual health checkup and vaccination",
    status: "pending",
    notes: "Dog seems healthy, just need routine checkup",
  },
  {
    id: "vr2",
    dogId: "2",
    dog: MOCK_DOGS[1],
    ownerId: "owner2",
    owner: MOCK_DOGS[1].owner,
    requestDate: "2024-01-16",
    preferredDate: "2024-01-18",
    reason: "Pre-breeding health assessment",
    status: "scheduled",
    notes: "Owner wants comprehensive breeding health check",
  },
  {
    id: "vr3",
    dogId: "3",
    dog: MOCK_DOGS[2],
    ownerId: "owner3",
    owner: MOCK_DOGS[2].owner,
    requestDate: "2024-01-14",
    reason: "Follow-up consultation",
    status: "completed",
  },
];

const MOCK_VET_EXAMINATIONS: VeterinaryExamination[] = [
  {
    id: "ve1",
    requestId: "vr3",
    dogId: "3",
    dog: MOCK_DOGS[2],
    veterinarianId: "vet1",
    veterinarian: {
      id: "vet1",
      name: "Dr. Maria Santos",
      avatar: "MS",
      location: "Davao City",
      memberSince: "2020-01-01",
      reputation: 4.9,
      totalMatches: 0,
      successfulBreedings: 0,
      verificationStatus: "verified",
      badges: [],
      role: "veterinarian",
      licenseNumber: "VET-2020-001",
      specialties: ["Breeding Health", "Vaccinations", "General Practice"],
      clinic: "Davao Veterinary Clinic",
      yearsOfExperience: 10,
      email: "vet@pawmatch.com",
    },
    ownerId: "owner3",
    owner: MOCK_DOGS[2].owner,
    examinationDate: "2024-01-14",
    reasonForVisit: "Follow-up consultation",
    weight: 8.5,
    temperature: 38.5,
    physicalExamination: "Overall good condition. Coat healthy, eyes clear, no abnormalities detected.",
    findings: "Dog is in excellent health",
    diagnosis: "Healthy - suitable for breeding",
    treatment: "None required",
    medication: "None",
    vaccination: "Up to date - Rabies, DHPP",
    recommendations: "Continue regular exercise and balanced diet. Next checkup in 6 months.",
    followUpDate: "2024-07-14",
    veterinarianNotes: "Owner very responsible. Dog well-maintained.",
    status: "completed",
  },
];

/* ── Veterinarian Dashboard ──────────────────────────────────── */
export function VetDashboard() {
  const { navigate, goBack, currentUser } = useV3();
  const [requests] = useState(MOCK_VET_REQUESTS);

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const scheduledCount = requests.filter((r) => r.status === "scheduled").length;
  const completedCount = requests.filter((r) => r.status === "completed").length;
  const todayAppointments = requests.filter(
    (r) => r.preferredDate === new Date().toISOString().split("T")[0]
  ).length;

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 48,
          paddingBottom: 16,
          backgroundColor: T.white,
          borderBottomWidth: 1,
          borderBottomColor: T.border,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: T.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Stethoscope size={20} color="#fff" strokeWidth={2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "800",
                color: T.dark,
                fontFamily: FONT,
              }}
            >
              Veterinarian Portal
            </Text>
            <Text style={{ fontSize: 14, color: T.medium, marginTop: 2 }}>
              Welcome, {currentUser?.name || "Dr. Maria Santos"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigate("vet-profile")}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: T.bg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User size={20} color={T.dark} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 80, gap: 20 }}
      >
        {/* Stats Cards */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          <View
            style={{
              flex: 1,
              minWidth: "45%",
              backgroundColor: T.white,
              borderRadius: 16,
              padding: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: T.primaryLight,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <Clock size={20} color={T.primary} strokeWidth={2} />
            </View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "800",
                color: T.dark,
                fontFamily: FONT,
              }}
            >
              {pendingCount}
            </Text>
            <Text style={{ fontSize: 12, color: T.medium, marginTop: 4 }}>
              Pending Requests
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              minWidth: "45%",
              backgroundColor: T.white,
              borderRadius: 16,
              padding: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#E3F2FD",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <Calendar size={20} color={T.accent} strokeWidth={2} />
            </View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "800",
                color: T.dark,
                fontFamily: FONT,
              }}
            >
              {todayAppointments}
            </Text>
            <Text style={{ fontSize: 12, color: T.medium, marginTop: 4 }}>
              Today's Appointments
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              minWidth: "45%",
              backgroundColor: T.white,
              borderRadius: 16,
              padding: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#E8F5E9",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <CheckCircle size={20} color={T.success} strokeWidth={2} />
            </View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "800",
                color: T.dark,
                fontFamily: FONT,
              }}
            >
              {completedCount}
            </Text>
            <Text style={{ fontSize: 12, color: T.medium, marginTop: 4 }}>
              Completed Today
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              minWidth: "45%",
              backgroundColor: T.white,
              borderRadius: 16,
              padding: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#FFF3E0",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <Activity size={20} color={T.warning} strokeWidth={2} />
            </View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "800",
                color: T.dark,
                fontFamily: FONT,
              }}
            >
              {scheduledCount}
            </Text>
            <Text style={{ fontSize: 12, color: T.medium, marginTop: 4 }}>
              Scheduled
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: T.dark,
              fontFamily: FONT,
              marginBottom: 12,
            }}
          >
            Quick Actions
          </Text>
          <View style={{ gap: 12 }}>
            <TouchableOpacity
              onPress={() => navigate("vet-requests")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: T.white,
                borderRadius: 16,
                padding: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: T.primaryLight,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FileText size={24} color={T.primary} strokeWidth={2} />
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: T.dark,
                    fontFamily: FONT,
                  }}
                >
                  View All Requests
                </Text>
                <Text style={{ fontSize: 12, color: T.medium, marginTop: 2 }}>
                  {pendingCount} pending requests
                </Text>
              </View>
              <ChevronRight size={20} color={T.medium} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigate("vet-records")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: T.white,
                borderRadius: 16,
                padding: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: "#E3F2FD",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FileText size={24} color={T.accent} strokeWidth={2} />
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: T.dark,
                    fontFamily: FONT,
                  }}
                >
                  Medical Records
                </Text>
                <Text style={{ fontSize: 12, color: T.medium, marginTop: 2 }}>
                  View all examination records
                </Text>
              </View>
              <ChevronRight size={20} color={T.medium} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Requests */}
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: T.dark,
                fontFamily: FONT,
              }}
            >
              Recent Requests
            </Text>
            <TouchableOpacity onPress={() => navigate("vet-requests")}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: T.primary,
                  fontFamily: FONT,
                }}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ gap: 12 }}>
            {requests.slice(0, 3).map((request) => (
              <VetRequestCard key={request.id} request={request} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/* ── Veterinary Request Card ─────────────────────────────────── */
function VetRequestCard({ request }: { request: VeterinaryRequest }) {
  const { navigate } = useV3();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return { bg: T.primaryLight, color: T.primary };
      case "scheduled":
        return { bg: "#E3F2FD", color: T.accent };
      case "completed":
        return { bg: "#E8F5E9", color: T.success };
      case "cancelled":
        return { bg: "#FFEBEE", color: T.error };
      default:
        return { bg: T.bg, color: T.medium };
    }
  };

  const statusColors = getStatusColor(request.status);

  return (
    <TouchableOpacity
      onPress={() => navigate("vet-request-detail", request)}
      style={{
        backgroundColor: T.white,
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: "row", gap: 12 }}>
        <Image
          source={{ uri: request.dog.images[0] }}
          style={{ width: 60, height: 60, borderRadius: 12 }}
        />
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: T.dark,
                fontFamily: FONT,
              }}
            >
              {request.dog.name}
            </Text>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
                backgroundColor: statusColors.bg,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "700",
                  color: statusColors.color,
                  textTransform: "capitalize",
                }}
              >
                {request.status}
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 12, color: T.medium, marginTop: 2 }}>
            {request.dog.breed} • {request.dog.age} years old
          </Text>
          <Text style={{ fontSize: 12, color: T.medium, marginTop: 4 }}>
            Owner: {request.owner.name}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: T.dark,
              marginTop: 4,
              fontWeight: "500",
            }}
          >
            {request.reason}
          </Text>
          {request.preferredDate && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                marginTop: 4,
              }}
            >
              <Calendar size={12} color={T.medium} />
              <Text style={{ fontSize: 12, color: T.medium }}>
                {new Date(request.preferredDate).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

/* ── Veterinary Requests List ────────────────────────────────── */
export function VetRequests() {
  const { navigate, goBack } = useV3();
  const [requests] = useState(MOCK_VET_REQUESTS);
  const [filter, setFilter] = useState<"all" | "pending" | "scheduled" | "completed">("all");

  const filteredRequests = requests.filter((r) =>
    filter === "all" ? true : r.status === filter
  );

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 48,
          paddingBottom: 16,
          backgroundColor: T.white,
          borderBottomWidth: 1,
          borderBottomColor: T.border,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity
            onPress={goBack}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: T.bg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowLeft size={20} color={T.dark} strokeWidth={1.5} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "800",
              color: T.dark,
              fontFamily: FONT,
              flex: 1,
            }}
          >
            Veterinary Requests
          </Text>
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, marginTop: 16 }}
        >
          {(["all", "pending", "scheduled", "completed"] as const).map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: filter === f ? T.primary : T.bg,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: filter === f ? "#fff" : T.dark,
                  textTransform: "capitalize",
                }}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 80, gap: 12 }}
      >
        {filteredRequests.map((request) => (
          <VetRequestCard key={request.id} request={request} />
        ))}

        {filteredRequests.length === 0 && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 60,
            }}
          >
            <FileText size={48} color={T.light} strokeWidth={1.5} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: T.medium,
                marginTop: 16,
                textAlign: "center",
              }}
            >
              No requests found
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* ── Veterinary Request Detail ───────────────────────────────── */
export function VetRequestDetail() {
  const { navigate, goBack, selectedDog } = useV3();
  const [request] = useState<VeterinaryRequest>(
    MOCK_VET_REQUESTS[0]
  );

  const handleStartExamination = () => {
    navigate("vet-examination", request);
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 48,
          paddingBottom: 16,
          backgroundColor: T.white,
          borderBottomWidth: 1,
          borderBottomColor: T.border,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity
            onPress={goBack}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: T.bg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowLeft size={20} color={T.dark} strokeWidth={1.5} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "800",
              color: T.dark,
              fontFamily: FONT,
              flex: 1,
            }}
          >
            Request Details
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100, gap: 20 }}
      >
        {/* Dog Information */}
        <View
          style={{
            backgroundColor: T.white,
            borderRadius: 16,
            padding: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: T.dark,
              fontFamily: FONT,
              marginBottom: 12,
            }}
          >
            Dog Information
          </Text>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <Image
              source={{ uri: request.dog.images[0] }}
              style={{ width: 80, height: 80, borderRadius: 12 }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: T.dark,
                  fontFamily: FONT,
                }}
              >
                {request.dog.name}
              </Text>
              <Text style={{ fontSize: 14, color: T.medium, marginTop: 2 }}>
                {request.dog.breed}
              </Text>
              <View style={{ flexDirection: "row", gap: 16, marginTop: 8 }}>
                <Text style={{ fontSize: 12, color: T.medium }}>
                  Age: {request.dog.age} years
                </Text>
                <Text style={{ fontSize: 12, color: T.medium }}>
                  Sex: {request.dog.sex}
                </Text>
              </View>
              <Text style={{ fontSize: 12, color: T.medium, marginTop: 4 }}>
                Color: {request.dog.color}
              </Text>
            </View>
          </View>
        </View>

        {/* Owner Information */}
        <View
          style={{
            backgroundColor: T.white,
            borderRadius: 16,
            padding: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: T.dark,
              fontFamily: FONT,
              marginBottom: 12,
            }}
          >
            Owner Information
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: T.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "700", color: "#fff" }}>
                {request.owner.name.charAt(0)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: T.dark,
                  fontFamily: FONT,
                }}
              >
                {request.owner.name}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
                <MapPin size={12} color={T.medium} />
                <Text style={{ fontSize: 12, color: T.medium }}>
                  {request.owner.location}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Request Details */}
        <View
          style={{
            backgroundColor: T.white,
            borderRadius: 16,
            padding: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: T.dark,
              fontFamily: FONT,
              marginBottom: 12,
            }}
          >
            Request Details
          </Text>
          <View style={{ gap: 12 }}>
            <View>
              <Text style={{ fontSize: 12, color: T.medium }}>Request Date</Text>
              <Text style={{ fontSize: 14, color: T.dark, fontWeight: "500", marginTop: 4 }}>
                {new Date(request.requestDate).toLocaleDateString()}
              </Text>
            </View>
            {request.preferredDate && (
              <View>
                <Text style={{ fontSize: 12, color: T.medium }}>Preferred Date</Text>
                <Text style={{ fontSize: 14, color: T.dark, fontWeight: "500", marginTop: 4 }}>
                  {new Date(request.preferredDate).toLocaleDateString()}
                </Text>
              </View>
            )}
            <View>
              <Text style={{ fontSize: 12, color: T.medium }}>Reason for Visit</Text>
              <Text style={{ fontSize: 14, color: T.dark, fontWeight: "500", marginTop: 4 }}>
                {request.reason}
              </Text>
            </View>
            {request.notes && (
              <View>
                <Text style={{ fontSize: 12, color: T.medium }}>Additional Notes</Text>
                <Text style={{ fontSize: 14, color: T.dark, fontWeight: "500", marginTop: 4 }}>
                  {request.notes}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {request.status === "pending" && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 20,
            backgroundColor: T.white,
            borderTopWidth: 1,
            borderTopColor: T.border,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Btn onClick={handleStartExamination} size="large">
            Start Examination
          </Btn>
        </View>
      )}
    </View>
  );
}

// Export mock data for use in other components
export { MOCK_VET_EXAMINATIONS, MOCK_VET_REQUESTS };

/* ── Veterinarian Profile ───────────────────────────────────── */
export function VetProfile() {
  const { navigate, goBack, currentUser } = useV3();

  const vetInfo = {
    name: currentUser?.name || "Dr. Maria Santos",
    licenseNumber: "VET-2020-001",
    specialties: ["Breeding Health", "Vaccinations", "General Practice"],
    clinic: "Davao Veterinary Clinic",
    yearsOfExperience: 10,
    location: "Davao City",
    memberSince: "January 2020",
    rating: 4.9,
    totalExams: 156,
    completedToday: 3,
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 48,
          paddingBottom: 12,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          backgroundColor: T.white,
          borderBottomWidth: 1,
          borderBottomColor: T.border,
        }}
      >
        <TouchableOpacity onPress={goBack}>
          <ArrowLeft size={20} color={T.dark} strokeWidth={1.5} />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            flex: 1,
          }}
        >
          <Stethoscope size={18} color={T.dark} strokeWidth={1.5} />
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: T.dark,
              fontFamily: FONT,
            }}
          >
            Veterinarian Profile
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigate("vet-settings")}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: T.bg,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Settings size={20} color={T.dark} strokeWidth={1.5} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Profile header */}
        <View
          style={{
            alignItems: "center",
            paddingTop: 24,
            paddingBottom: 20,
            paddingHorizontal: 20,
            backgroundColor: T.white,
          }}
        >
          <View style={{ position: "relative", marginBottom: 12 }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: T.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 24, fontWeight: "700", color: "#fff" }}>
                {vetInfo.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <View style={{ position: "absolute", bottom: -4, right: -4 }}>
              <CheckCircle
                size={20}
                color={T.success}
                fill={T.white}
                strokeWidth={2}
              />
            </View>
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: T.dark,
              fontFamily: FONT,
            }}
          >
            {vetInfo.name}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <MapPin size={12} color={T.medium} strokeWidth={1.5} />
            <Text style={{ fontSize: 14, color: T.medium }}>{vetInfo.location}</Text>
            <Text style={{ fontSize: 14, color: T.medium }}> • </Text>
            <Calendar size={12} color={T.medium} strokeWidth={1.5} />
            <Text style={{ fontSize: 14, color: T.medium }}>
              Member since {vetInfo.memberSince}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              marginTop: 4,
            }}
          >
            <CheckCircle size={14} color={T.success} strokeWidth={2} />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: T.success,
              }}
            >
              Verified Veterinarian
            </Text>
          </View>
        </View>

        {/* Professional Info */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 20,
            marginBottom: 20,
            padding: 16,
            borderRadius: 16,
            backgroundColor: T.white,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <FileText size={18} color={T.dark} strokeWidth={1.5} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: T.dark,
                fontFamily: FONT,
              }}
            >
              Professional Information
            </Text>
          </View>
          <View style={{ gap: 12 }}>
            <View>
              <Text style={{ fontSize: 12, color: T.medium }}>License Number</Text>
              <Text style={{ fontSize: 14, fontWeight: "600", color: T.dark, marginTop: 4 }}>
                {vetInfo.licenseNumber}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 12, color: T.medium }}>Clinic</Text>
              <Text style={{ fontSize: 14, fontWeight: "600", color: T.dark, marginTop: 4 }}>
                {vetInfo.clinic}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 12, color: T.medium }}>Experience</Text>
              <Text style={{ fontSize: 14, fontWeight: "600", color: T.dark, marginTop: 4 }}>
                {vetInfo.yearsOfExperience} years
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 12, color: T.medium, marginBottom: 8 }}>Specialties</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {vetInfo.specialties.map((specialty) => (
                  <View
                    key={specialty}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 12,
                      backgroundColor: T.primaryLight,
                    }}
                  >
                    <Text style={{ fontSize: 12, color: T.primary, fontWeight: "600" }}>
                      {specialty}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Statistics */}
        <View
          style={{
            marginHorizontal: 20,
            marginBottom: 20,
            padding: 16,
            borderRadius: 16,
            backgroundColor: T.white,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <Activity size={18} color={T.dark} strokeWidth={1.5} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: T.dark,
                fontFamily: FONT,
              }}
            >
              Statistics
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 24, fontWeight: "800", color: T.primary }}>
                {vetInfo.totalExams}
              </Text>
              <Text style={{ fontSize: 12, color: T.medium, marginTop: 2 }}>
                Total Examinations
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Text style={{ fontSize: 24, fontWeight: "800", color: T.primary }}>
                  {vetInfo.rating}
                </Text>
                <CheckCircle size={16} color={T.success} strokeWidth={2} />
              </View>
              <Text style={{ fontSize: 12, color: T.medium, marginTop: 2 }}>
                Average Rating
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <FileText size={18} color={T.dark} strokeWidth={1.5} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: T.dark,
                fontFamily: FONT,
              }}
            >
              Quick Actions
            </Text>
          </View>
          <View style={{ gap: 12 }}>
            <TouchableOpacity
              onPress={() => navigate("vet-requests")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderRadius: 12,
                backgroundColor: T.white,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <FileText size={20} color={T.primary} strokeWidth={1.5} />
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  fontWeight: "600",
                  color: T.dark,
                  fontFamily: FONT,
                }}
              >
                View All Requests
              </Text>
              <ChevronRight size={20} color={T.medium} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigate("vet-records")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderRadius: 12,
                backgroundColor: T.white,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <FileText size={20} color={T.accent} strokeWidth={1.5} />
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  fontWeight: "600",
                  color: T.dark,
                  fontFamily: FONT,
                }}
              >
                Medical Records
              </Text>
              <ChevronRight size={20} color={T.medium} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Help Section */}
        <View
          style={{
            marginHorizontal: 20,
            marginBottom: 20,
            padding: 16,
            borderRadius: 16,
            backgroundColor: T.primaryLight,
            borderWidth: 1,
            borderColor: T.primary + "30",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <MessageSquare size={18} color={T.primary} strokeWidth={1.5} />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: T.primary,
                fontFamily: FONT,
              }}
            >
              Need Help?
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: T.primaryDark, marginBottom: 12 }}>
            Contact PawMatch support for assistance with your veterinary account.
          </Text>
          <TouchableOpacity
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 8,
              backgroundColor: T.primary,
              alignSelf: "flex-start",
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "600", color: "#fff" }}>
              Contact Support
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

/* ── Veterinarian Settings ──────────────────────────────────── */
export function VetSettings() {
  const { navigate, goBack, setUser } = useV3();

  const handleLogout = () => {
    // Clear user data
    setUser(null);
    // Navigate to login screen
    navigate("login");
  };

  const settingsOptions = [
    {
      Icon: Bell,
      title: "Notification Preferences",
      description: "Manage your notification settings",
    },
    {
      Icon: Lock,
      title: "Privacy & Security",
      description: "Update password and security settings",
    },
    {
      Icon: FileText,
      title: "License & Credentials",
      description: "View and update professional credentials",
    },
    {
      Icon: HelpCircle,
      title: "Help & Support",
      description: "Get help or contact support",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 48,
          paddingBottom: 12,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          backgroundColor: T.white,
          borderBottomWidth: 1,
          borderBottomColor: T.border,
        }}
      >
        <TouchableOpacity onPress={goBack}>
          <ArrowLeft size={20} color={T.dark} strokeWidth={1.5} />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            flex: 1,
          }}
        >
          <Settings size={18} color={T.dark} strokeWidth={1.5} />
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: T.dark,
              fontFamily: FONT,
            }}
          >
            Settings
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Settings Options */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <View
            style={{
              borderRadius: 16,
              overflow: "hidden",
              backgroundColor: T.white,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            {settingsOptions.map((option, index) => (
              <TouchableOpacity
                key={option.title}
                onPress={() => {
                  // Handle navigation to specific settings
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  borderBottomWidth: index < settingsOptions.length - 1 ? 1 : 0,
                  borderBottomColor: T.border,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: T.primaryLight,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <option.Icon size={20} color={T.primary} strokeWidth={1.5} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: T.dark,
                      fontFamily: FONT,
                    }}
                  >
                    {option.title}
                  </Text>
                  <Text style={{ fontSize: 12, color: T.medium, marginTop: 2 }}>
                    {option.description}
                  </Text>
                </View>
                <ChevronRight size={20} color={T.medium} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Account Section */}
        <View style={{ paddingHorizontal: 20, marginTop: 32 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: T.medium,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              marginBottom: 12,
            }}
          >
            Account
          </Text>
          <View
            style={{
              borderRadius: 16,
              overflow: "hidden",
              backgroundColor: T.white,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <TouchableOpacity
              onPress={handleLogout}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingHorizontal: 16,
                paddingVertical: 16,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#FFEBEE",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LogOut size={20} color={T.error} strokeWidth={1.5} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: T.error,
                    fontFamily: FONT,
                  }}
                >
                  Log Out
                </Text>
                <Text style={{ fontSize: 12, color: T.medium, marginTop: 2 }}>
                  Sign out of your veterinarian account
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Version */}
        <View style={{ paddingHorizontal: 20, marginTop: 32, alignItems: "center" }}>
          <Text style={{ fontSize: 12, color: T.light }}>
            PawMatch Veterinarian Portal
          </Text>
          <Text style={{ fontSize: 12, color: T.light, marginTop: 4 }}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
