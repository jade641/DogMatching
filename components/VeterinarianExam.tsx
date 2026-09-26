import {
  ArrowLeft,
  Calendar,
  Check,
  FileText,
  Save,
  Stethoscope,
  Syringe,
  ThermometerSun,
  Weight,
} from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Btn, Field, FONT, T, useV3 } from "../contexts/AppContext";
import type { VeterinaryExamination, VeterinaryRequest } from "../types";
import { MOCK_VET_EXAMINATIONS } from "./Veterinarian";

/* ── Veterinary Examination Form ─────────────────────────────── */
export function VetExamination() {
  const { navigate, goBack, selectedDog } = useV3();
  const [request] = useState<VeterinaryRequest | null>(null);

  const [formData, setFormData] = useState({
    weight: "",
    temperature: "",
    physicalExamination: "",
    findings: "",
    diagnosis: "",
    treatment: "",
    medication: "",
    vaccination: "",
    recommendations: "",
    followUpDate: "",
    veterinarianNotes: "",
  });

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Validation
    if (!formData.findings || !formData.diagnosis || !formData.recommendations) {
      Alert.alert("Required Fields", "Please fill in all required fields.");
      return;
    }

    Alert.alert(
      "Save Examination",
      "Are you sure you want to save this examination record?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Save",
          onPress: () => {
            // Save examination record
            Alert.alert("Success", "Examination record saved successfully!");
            navigate("vet-dashboard");
          },
        },
      ]
    );
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
            Veterinary Examination
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100, gap: 20 }}
      >
        {/* Basic Measurements */}
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <Stethoscope size={20} color={T.primary} strokeWidth={2} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: T.dark,
                fontFamily: FONT,
              }}
            >
              Basic Measurements
            </Text>
          </View>

          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Field
                  label="Weight (kg)"
                  value={formData.weight}
                  onChange={(text) => updateField("weight", text)}
                  placeholder="e.g., 8.5"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Field
                  label="Temperature (°C)"
                  value={formData.temperature}
                  onChange={(text) => updateField("temperature", text)}
                  placeholder="e.g., 38.5"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Physical Examination */}
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
              marginBottom: 16,
            }}
          >
            Physical Examination
          </Text>
          <Field
            value={formData.physicalExamination}
            onChange={(text) => updateField("physicalExamination", text)}
            placeholder="Describe physical condition, coat, eyes, ears, etc."
            multiline
          />
        </View>

        {/* Findings & Diagnosis */}
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
              marginBottom: 16,
            }}
          >
            Findings & Diagnosis *
          </Text>
          <View style={{ gap: 12 }}>
            <Field
              label="Findings *"
              value={formData.findings}
              onChange={(text) => updateField("findings", text)}
              placeholder="Main findings from examination"
              multiline
            />
            <Field
              label="Diagnosis *"
              value={formData.diagnosis}
              onChange={(text) => updateField("diagnosis", text)}
              placeholder="Clinical diagnosis"
              multiline
            />
          </View>
        </View>

        {/* Treatment & Medication */}
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
              marginBottom: 16,
            }}
          >
            Treatment & Medication
          </Text>
          <View style={{ gap: 12 }}>
            <Field
              label="Treatment"
              value={formData.treatment}
              onChange={(text) => updateField("treatment", text)}
              placeholder="Describe treatment provided"
              multiline
            />
            <Field
              label="Medication"
              value={formData.medication}
              onChange={(text) => updateField("medication", text)}
              placeholder="List medications prescribed"
              multiline
            />
            <Field
              label="Vaccination"
              value={formData.vaccination}
              onChange={(text) => updateField("vaccination", text)}
              placeholder="Vaccination status or vaccines given"
              multiline
            />
          </View>
        </View>

        {/* Recommendations */}
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
              marginBottom: 16,
            }}
          >
            Recommendations *
          </Text>
          <Field
            value={formData.recommendations}
            onChange={(text) => updateField("recommendations", text)}
            placeholder="Care instructions, diet, exercise, follow-up, etc."
            multiline
          />
        </View>

        {/* Additional Notes */}
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
              marginBottom: 16,
            }}
          >
            Additional Notes
          </Text>
          <View style={{ gap: 12 }}>
            <Field
              label="Follow-up Date"
              value={formData.followUpDate}
              onChange={(text) => updateField("followUpDate", text)}
              placeholder="YYYY-MM-DD"
            />
            <Field
              label="Veterinarian Notes"
              value={formData.veterinarianNotes}
              onChange={(text) => updateField("veterinarianNotes", text)}
              placeholder="Private notes (not visible to owner)"
              multiline
            />
          </View>
        </View>
      </ScrollView>

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
        <Btn onClick={handleSave} size="large" icon={<Save size={20} color="#fff" />}>
          Save Examination
        </Btn>
      </View>
    </View>
  );
}

/* ── Veterinary Records List ─────────────────────────────────── */
export function VetRecords() {
  const { navigate, goBack } = useV3();
  const [records] = useState(MOCK_VET_EXAMINATIONS);

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
            Medical Records
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 80, gap: 12 }}
      >
        {records.map((record) => (
          <VetRecordCard key={record.id} record={record} />
        ))}

        {records.length === 0 && (
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
              No records found
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* ── Veterinary Record Card ──────────────────────────────────── */
function VetRecordCard({ record }: { record: VeterinaryExamination }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      onPress={() => setExpanded(!expanded)}
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
          source={{ uri: record.dog.images[0] }}
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
              {record.dog.name}
            </Text>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
                backgroundColor: "#E8F5E9",
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "700",
                  color: T.success,
                }}
              >
                COMPLETED
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 12, color: T.medium, marginTop: 2 }}>
            {record.dog.breed} • {record.dog.age} years old
          </Text>
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
              {new Date(record.examinationDate).toLocaleDateString()}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 12,
              color: T.dark,
              marginTop: 4,
              fontWeight: "500",
            }}
          >
            {record.reasonForVisit}
          </Text>
        </View>
      </View>

      {expanded && (
        <View
          style={{
            marginTop: 16,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: T.border,
            gap: 12,
          }}
        >
          <View>
            <Text style={{ fontSize: 12, color: T.medium, fontWeight: "600" }}>
              Diagnosis
            </Text>
            <Text style={{ fontSize: 14, color: T.dark, marginTop: 4 }}>
              {record.diagnosis}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 12, color: T.medium, fontWeight: "600" }}>
              Findings
            </Text>
            <Text style={{ fontSize: 14, color: T.dark, marginTop: 4 }}>
              {record.findings}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 12, color: T.medium, fontWeight: "600" }}>
              Recommendations
            </Text>
            <Text style={{ fontSize: 14, color: T.dark, marginTop: 4 }}>
              {record.recommendations}
            </Text>
          </View>
          {record.followUpDate && (
            <View>
              <Text style={{ fontSize: 12, color: T.medium, fontWeight: "600" }}>
                Follow-up Date
              </Text>
              <Text style={{ fontSize: 14, color: T.dark, marginTop: 4 }}>
                {new Date(record.followUpDate).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
