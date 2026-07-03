import { ChevronRight, Eye, MapPin, Send, Sparkles } from "lucide-react-native";
import { Image, Text, TouchableOpacity, View } from "react-native";
import {
    Btn,
    FONT,
    MOCK_DOGS,
    ScoreBar,
    T,
    VeriBadge,
} from "../contexts/AppContext";

export type RankedDog = {
  dog: (typeof MOCK_DOGS)[number];
  score: number;
  reasons: string[];
};

type FloatingMatchResultsProps = {
  rankedDogs: RankedDog[];
  selectedDogId: string | null;
  onSelectDog: (dogId: string) => void;
  onViewDog: (dog: RankedDog["dog"]) => void;
  onRequestDog: (dog: RankedDog["dog"]) => void;
  onContinueSelectedDog: (dog: RankedDog["dog"]) => void;
};

function FloatingMatchCard({
  item,
  selected,
  onSelect,
  onView,
  onRequest,
}: {
  item: RankedDog;
  selected: boolean;
  onSelect: () => void;
  onView: () => void;
  onRequest: () => void;
}) {
  const { dog, score, reasons } = item;

  return (
    <View
      style={{
        borderRadius: 28,
        overflow: "hidden",
        backgroundColor: T.white,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? T.primary : T.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.12,
        shadowRadius: 18,
        elevation: 7,
      }}
    >
      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: dog.img }}
          style={{ width: "100%", height: 200 }}
          resizeMode="cover"
        />
        <View
          style={{
            position: "absolute",
            left: 14,
            top: 14,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.94)",
          }}
        >
          <Sparkles size={14} color={T.primary} strokeWidth={2} />
          <Text
            style={{
              fontSize: 12,
              fontWeight: "800",
              color: T.dark,
              fontFamily: FONT,
            }}
          >
            {score}% match
          </Text>
        </View>
        <View style={{ position: "absolute", right: 14, top: 14 }}>
          <VeriBadge verified={dog.verified} tier={dog.tier} />
        </View>
      </View>

      <View style={{ padding: 16, gap: 12 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "800",
                color: T.dark,
                fontFamily: FONT,
              }}
            >
              {dog.name}
            </Text>
            <Text style={{ fontSize: 13, color: T.medium, marginTop: 2 }}>
              {dog.breed} • {dog.color} • {dog.size}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 12, color: T.medium }}>Owner</Text>
            <Text style={{ fontSize: 13, fontWeight: "700", color: T.dark }}>
              {dog.ownerAvatar}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {dog.temperament.map((temp) => (
            <View
              key={temp}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 999,
                backgroundColor: T.bg,
              }}
            >
              <Text style={{ fontSize: 12, color: T.dark }}>{temp}</Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: T.teal,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "700", color: "#fff" }}>
              {dog.ownerAvatar}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              flex: 1,
            }}
          >
            <Text style={{ fontSize: 12, color: T.medium }}>
              {dog.ownerName} •
            </Text>
            <MapPin size={10} color={T.medium} strokeWidth={2} />
            <Text style={{ fontSize: 12, color: T.medium }}>
              {dog.ownerLocation.split(",")[0]}
            </Text>
          </View>
        </View>

        <ScoreBar score={score} />

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {reasons.map((reason) => (
            <View
              key={reason}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 999,
                backgroundColor: T.primaryLight,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: T.primaryDark,
                  fontWeight: "600",
                }}
              >
                {reason}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            onPress={onSelect}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 14,
              backgroundColor: selected ? T.primaryDark : T.primary,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#fff",
                fontFamily: FONT,
              }}
            >
              {selected ? "Selected" : "Choose"}
            </Text>
            <ChevronRight size={16} color="#fff" strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onView}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 14,
              backgroundColor: T.white,
              borderWidth: 1.5,
              borderColor: T.primary,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 6,
            }}
          >
            <Eye size={14} color={T.primary} strokeWidth={2} />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: T.primary,
                fontFamily: FONT,
              }}
            >
              View
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={onRequest}
          style={{
            alignSelf: "flex-start",
            paddingHorizontal: 6,
            paddingTop: 2,
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Send size={12} color={T.medium} strokeWidth={2} />
          <Text style={{ fontSize: 12, fontWeight: "600", color: T.medium }}>
            Send request to this match
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function FloatingMatchResults({
  rankedDogs,
  selectedDogId,
  onSelectDog,
  onViewDog,
  onRequestDog,
  onContinueSelectedDog,
}: FloatingMatchResultsProps) {
  const selectedDog =
    rankedDogs.find((item) => item.dog.id === selectedDogId) ??
    rankedDogs[0] ??
    null;

  return (
    <View style={{ gap: 12 }}>
      <View
        style={{
          borderRadius: 24,
          padding: 16,
          backgroundColor: T.white,
          borderWidth: 1,
          borderColor: T.border,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 3,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Sparkles size={16} color={T.primary} strokeWidth={2} />
          <Text
            style={{
              fontSize: 15,
              fontWeight: "800",
              color: T.dark,
              fontFamily: FONT,
            }}
          >
            Top 3 floating matches
          </Text>
        </View>
        <Text
          style={{
            fontSize: 13,
            color: T.medium,
            marginTop: 6,
            lineHeight: 18,
          }}
        >
          These three dogs are your best matches based on the preferences you
          entered.
        </Text>
      </View>

      <View style={{ gap: 16 }}>
        {rankedDogs.slice(0, 3).map((item, index) => {
          const selected = item.dog.id === selectedDogId;
          const rotation =
            index === 0 ? "-2.5deg" : index === 1 ? "1deg" : "-0.75deg";

          return (
            <View
              key={item.dog.id}
              style={{
                transform: [{ translateY: index * 6 }, { rotate: rotation }],
                zIndex: rankedDogs.length - index,
              }}
            >
              <View
                style={{
                  position: "absolute",
                  left: 18,
                  right: 18,
                  bottom: -8,
                  height: 16,
                  borderRadius: 999,
                  backgroundColor:
                    index === 0
                      ? "rgba(255, 110, 67, 0.18)"
                      : index === 1
                        ? "rgba(45, 212, 191, 0.16)"
                        : "rgba(251, 191, 36, 0.16)",
                  opacity: 0.9,
                }}
              />
              <FloatingMatchCard
                item={item}
                selected={selected}
                onSelect={() => onSelectDog(item.dog.id)}
                onView={() => onViewDog(item.dog)}
                onRequest={() => onRequestDog(item.dog)}
              />
            </View>
          );
        })}
      </View>

      {selectedDog && (
        <View
          style={{
            borderRadius: 24,
            padding: 16,
            backgroundColor: T.white,
            borderWidth: 1,
            borderColor: T.border,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 3,
            gap: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: T.medium }}>
                Selected dog
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "800",
                  color: T.dark,
                  fontFamily: FONT,
                }}
              >
                {selectedDog.dog.name}
              </Text>
            </View>
            <Text
              style={{ fontSize: 12, fontWeight: "700", color: T.primaryDark }}
            >
              {selectedDog.score}% match
            </Text>
          </View>

          <Btn onClick={() => onContinueSelectedDog(selectedDog.dog)}>
            Continue with selected dog
          </Btn>
        </View>
      )}
    </View>
  );
}
