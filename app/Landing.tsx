import { Heart, ShieldCheck, Users } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FONT, T, useV3 } from "../contexts/AppContext";

/**
 * 🐾 3-PAGE LANDING CAROUSEL
 * 
 * Tatlong landing pages bago mag-login:
 * 1. Find Your Dog's Perfect Match �
 * 2. Verified Health Records ✓
 * 3. Connect with Confidence 🤝
 */

const landingPages = [
  {
    icon: Heart,
    title: "Find Your Dog's Perfect Match",
    description:
      "Smart compatibility scoring for responsible breeding in Davao City.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Health Records",
    description:
      "Upload documents and get verified by licensed vets or certified breeders.",
  },
  {
    icon: Users,
    title: "Connect with Confidence",
    description:
      "Reputation pages, badges, and interaction history so you always know who you're dealing with.",
  },
];

export default function Landing({ onLaunch }: { onLaunch: () => void }) {
  const [currentPage, setCurrentPage] = useState(0);
  const { navigate } = useV3();

  const handleNext = () => {
    if (currentPage < landingPages.length - 1) {
      // Go to next page
      setCurrentPage(currentPage + 1);
    } else {
      // Last page - go to login
      navigate("login");
    }
  };

  const handleSkip = () => {
    // Skip directly to login
    navigate("login");
  };

  const currentContent = landingPages[currentPage];
  const isLastPage = currentPage === landingPages.length - 1;
  const IconComponent = currentContent.icon;

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Icon Box */}
        <View style={styles.iconBox}>
          <IconComponent 
            size={80} 
            color={T.primary}
            strokeWidth={1.5}
          />
        </View>

        {/* Title & Description */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{currentContent.title}</Text>
          <Text style={styles.description}>{currentContent.description}</Text>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Dots Indicator */}
        <View style={styles.dotsContainer}>
          {landingPages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentPage === index ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Next / Get Started Button */}
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {isLastPage ? "Get Started" : "Next →"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Neutral white background
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  topBar: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "500",
    color: T.medium,
    fontFamily: FONT,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  iconBox: {
    width: 200,
    height: 200,
    borderRadius: 32,
    backgroundColor: T.primaryLight, // Light orange background 🟠
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: T.dark,
    fontFamily: FONT,
    marginBottom: 16,
    textAlign: "center",
    lineHeight: 36,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: T.medium,
    paddingHorizontal: 12,
  },
  bottomSection: {
    width: "100%",
    paddingTop: 20,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: T.primary, // Orange for active dot 🟠
  },
  dotInactive: {
    width: 8,
    backgroundColor: T.light,
  },
  button: {
    backgroundColor: T.primary, // Orange button 🟠
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: FONT,
    textAlign: "center",
  },
});
