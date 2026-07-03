import {
    ArrowLeft,
    Clock3,
    HeartHandshake,
    MapPin,
    MessageCircle,
    PawPrint,
    Send,
    ShieldCheck,
    Sparkles
} from "lucide-react-native";
import { useMemo, useState } from "react";
import {
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { FONT, MOCK_DOGS, T, useV3 } from "../contexts/AppContext";

type ChatMessage = {
  id: string;
  from: "me" | "owner";
  text: string;
  time: string;
};

function ChatBubble({ message }: { message: ChatMessage }) {
  const isMe = message.from === "me";

  return (
    <View
      style={{
        alignSelf: isMe ? "flex-end" : "flex-start",
        maxWidth: "82%",
        paddingHorizontal: 14,
        paddingVertical: 11,
        borderRadius: 18,
        backgroundColor: isMe ? T.primary : T.white,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isMe ? 0.08 : 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          lineHeight: 20,
          color: isMe ? "#fff" : T.dark,
          fontFamily: FONT,
          fontWeight: "500",
        }}
      >
        {message.text}
      </Text>
      <Text
        style={{
          marginTop: 6,
          fontSize: 11,
          color: isMe ? "rgba(255,255,255,0.75)" : T.medium,
          textAlign: "right",
        }}
      >
        {message.time}
      </Text>
    </View>
  );
}

export function ConversationScreen() {
  const { goBack, selectedDog, navigate } = useV3();
  const dog = selectedDog || MOCK_DOGS[0];
  const [draft, setDraft] = useState("");

  const owner = useMemo(() => {
    const [city] = dog.ownerLocation.split(",");
    return {
      name: dog.ownerName,
      location: city,
      initials: dog.ownerAvatar,
      verified: dog.verified,
    };
  }, [dog]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      from: "owner",
      text: `Hi! I'm ${owner.name}. I saw your interest in ${dog.name}. We'd be happy to discuss the pairing details.`,
      time: "10:12 AM",
    },
    {
      id: "m2",
      from: "me",
      text: `Hello! ${dog.name} looks like a strong match. I’d like to know more about temperament, schedule, and health documentation.`,
      time: "10:14 AM",
    },
    {
      id: "m3",
      from: "owner",
      text: "Sure. I can share the latest vet record and we can coordinate a meet-up first so the owners can agree on the plan.",
      time: "10:16 AM",
    },
  ]);

  const sendMessage = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;

    setMessages((current) => [
      ...current,
      {
        id: `m-${Date.now()}`,
        from: "me",
        text: trimmed,
        time: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
      },
    ]);
    setDraft("");
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 48,
          paddingBottom: 14,
          backgroundColor: T.white,
          borderBottomWidth: 1,
          borderBottomColor: T.border,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity
            onPress={goBack}
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: T.bg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowLeft size={20} color={T.dark} strokeWidth={1.5} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "800",
                color: T.dark,
                fontFamily: FONT,
              }}
            >
              Owner-to-Owner Chat
            </Text>
            <Text style={{ fontSize: 12, color: T.medium, marginTop: 2 }}>
              Discuss the pairing, schedule, and next steps.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigate("match-profile", dog)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 999,
              backgroundColor: T.primaryLight,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <PawPrint size={14} color={T.primaryDark} strokeWidth={2} />
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: T.primaryDark,
                fontFamily: FONT,
              }}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 18,
          paddingBottom: 140,
        }}
      >
        <View
          style={{
            borderRadius: 28,
            overflow: "hidden",
            backgroundColor: T.white,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 14,
            elevation: 3,
          }}
        >
          <View
            style={{
              padding: 16,
              backgroundColor: T.primary,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Image
              source={{ uri: dog.img }}
              style={{
                width: 58,
                height: 58,
                borderRadius: 18,
                borderWidth: 2,
                borderColor: "rgba(255,255,255,0.55)",
              }}
              resizeMode="cover"
            />
            <View style={{ flex: 1 }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "800",
                    color: "#fff",
                    fontFamily: FONT,
                  }}
                >
                  {dog.name}
                </Text>
                {owner.verified && (
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 999,
                      backgroundColor: "rgba(255,255,255,0.18)",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <ShieldCheck size={12} color="#fff" strokeWidth={2} />
                    <Text
                      style={{ fontSize: 11, fontWeight: "700", color: "#fff" }}
                    >
                      Verified owner
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.9)",
                  marginTop: 3,
                }}
              >
                {dog.breed} • {owner.name}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 4,
                }}
              >
                <MapPin
                  size={12}
                  color="rgba(255,255,255,0.9)"
                  strokeWidth={2}
                />
                <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.9)" }}>
                  {owner.location}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ padding: 16, gap: 10 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Sparkles size={16} color={T.primaryDark} strokeWidth={2} />
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "800",
                  color: T.dark,
                  fontFamily: FONT,
                }}
              >
                Conversation started after selecting a match
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
              {dog.temperament.map((item) => (
                <View
                  key={item}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 999,
                    backgroundColor: T.bg,
                  }}
                >
                  <Text style={{ fontSize: 12, color: T.dark }}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={{ marginTop: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <MessageCircle size={16} color={T.dark} strokeWidth={1.7} />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "800",
                color: T.dark,
                fontFamily: FONT,
              }}
            >
              Messages
            </Text>
          </View>
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
        </View>

        <View
          style={{
            marginTop: 8,
            borderRadius: 22,
            padding: 16,
            backgroundColor: T.white,
            gap: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 14,
            elevation: 3,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <HeartHandshake size={16} color={T.primaryDark} strokeWidth={2} />
            <Text
              style={{
                fontSize: 13,
                fontWeight: "800",
                color: T.dark,
                fontFamily: FONT,
              }}
            >
              Ready to reply
            </Text>
          </View>
          <View
            style={{
              borderRadius: 16,
              borderWidth: 1,
              borderColor: T.border,
              backgroundColor: T.bg,
              paddingHorizontal: 14,
              paddingVertical: 12,
              minHeight: 96,
            }}
          >
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Write your message to the owner..."
              placeholderTextColor={T.medium}
              multiline
              style={{
                fontSize: 14,
                color: T.dark,
                fontFamily: FONT,
                minHeight: 72,
                textAlignVertical: "top",
              }}
            />
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={sendMessage}
                style={{
                  borderRadius: 16,
                  backgroundColor: T.primary,
                  paddingVertical: 13,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  gap: 8,
                }}
              >
                <Send size={16} color="#fff" strokeWidth={2} />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "800",
                    color: "#fff",
                    fontFamily: FONT,
                  }}
                >
                  Send Message
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => navigate("request-received")}
              style={{
                paddingHorizontal: 16,
                borderRadius: 16,
                borderWidth: 1.5,
                borderColor: T.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "800",
                  color: T.primary,
                  fontFamily: FONT,
                }}
              >
                Request
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Clock3 size={12} color={T.medium} strokeWidth={2} />
            <Text style={{ fontSize: 12, color: T.medium }}>
              Responses are only shared between owners.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
