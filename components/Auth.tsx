import { Eye, EyeOff, Heart, PawPrint, ShieldCheck, Users } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Btn, Field, FONT, T, useV3 } from "../contexts/AppContext";
import { RegistrationForm } from "../types";
import { FormValidator, registrationSchema, useFormValidation } from "../utils/validation";
import { LoadingSpinner } from "./LoadingSpinner";

/* ── Splash Screen ────────────────────────────────────────────── */
export function Splash() {
  const { navigate } = useV3();

  useEffect(() => {
    const timer = setTimeout(() => navigate("onboarding"), 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <View style={[styles.container, { backgroundColor: T.primary }]}>
      <View style={styles.centerContent}>
        <View style={styles.splashLogoContainer}>
          <Heart size={60} color="#fff" strokeWidth={2} />
        </View>
        <View>
          <Text style={[styles.splashTitle, { fontFamily: FONT }]}>
            PawMatch
          </Text>
          <Text style={[styles.splashSubtitle, { fontFamily: FONT }]}>
            Verified. Local. Trusted.
          </Text>
        </View>
      </View>
      <View style={styles.loadingDots}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={styles.dot} />
        ))}
      </View>
    </View>
  );
}

/* ── Onboarding Carousel ─────────────────────────────────────── */
const SLIDES = [
  {
    Icon: Heart,
    title: "Find Your Dog's Perfect Match",
    sub: "Smart compatibility scoring for responsible breeding in Davao City.",
  },
  {
    Icon: ShieldCheck,
    title: "Verified Health Records",
    sub: "Upload documents and get verified by licensed vets or certified breeders.",
  },
  {
    Icon: Users,
    title: "Trusted Community",
    sub: "Connect with verified dog owners and build lasting relationships.",
  },
];

export function Onboarding() {
  const { navigate } = useV3();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <View style={[styles.container, { backgroundColor: T.primary }]}>
      <View style={styles.centerContent}>
        <View style={styles.onboardingIconContainer}>
          <slide.Icon size={80} color="#fff" strokeWidth={1.5} />
        </View>
        <Text style={[styles.onboardingTitle, { fontFamily: FONT }]}>
          {slide.title}
        </Text>
        <Text style={[styles.onboardingSub, { fontFamily: FONT }]}>
          {slide.sub}
        </Text>
      </View>

      <View style={styles.onboardingFooter}>
        <View style={styles.slideIndicators}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.slideIndicator,
                { opacity: i === currentSlide ? 1 : 0.4 },
              ]}
            />
          ))}
        </View>
        <View style={styles.onboardingButtons}>
          <Btn
            onClick={() => navigate("register")}
            variant="secondary"
          >
            Get Started
          </Btn>
          <TouchableOpacity
            onPress={() => navigate("login")}
            style={styles.loginLink}
          >
            <Text style={[styles.loginLinkText, { fontFamily: FONT }]}>
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

/* ── Enhanced Registration ─────────────────────────────────────── */
export function Register() {
  const { navigate, setUser, setLoading, isLoading } = useV3();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    data,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    validateForm
  } = useFormValidation<RegistrationForm>({
    ownerName: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: 'Davao City',
    phoneNumber: '',
    agreeToTerms: false
  }, {
    ...registrationSchema,
    confirmPassword: [
      FormValidator.required('Please confirm your password')
    ]
  });

  // Update confirm password validation when password changes
  useEffect(() => {
    if (data.password && touched.confirmPassword) {
      const matchRule = FormValidator.matchField(data.password, 'password');
      const error = FormValidator.validateField(data.confirmPassword, [matchRule]);
      // Update errors manually since we can't modify the schema dynamically
    }
  }, [data.password, data.confirmPassword, touched.confirmPassword]);

  const handleRegister = async () => {
    const validation = validateForm();
    if (!validation.isValid) {
      Alert.alert('Validation Error', 'Please fix the errors before continuing.');
      return;
    }

    if (data.password !== data.confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    if (!data.agreeToTerms) {
      Alert.alert('Terms Required', 'Please agree to the terms and conditions.');
      return;
    }

    setLoading('register', 'loading');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful registration
      const newUser = {
        id: Date.now().toString(),
        name: data.ownerName,
        avatar: `https://via.placeholder.com/100x100/4A90E2/ffffff?text=${data.ownerName.charAt(0)}`,
        location: data.location,
        memberSince: new Date().toISOString(),
        reputation: 0,
        totalMatches: 0,
        successfulBreedings: 0,
        verificationStatus: 'unverified' as const,
        badges: []
      };

      setUser(newUser);
      setLoading('register', 'success');
      navigate("home");
    } catch (error) {
      setLoading('register', 'error');
      Alert.alert('Registration Failed', 'Please try again later.');
    }
  };

  if (isLoading('register')) {
    return (
      <View style={styles.container}>
        <LoadingSpinner message="Creating your account..." />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <TouchableOpacity
        onPress={() => navigate("onboarding")}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.authHeader}>
        <PawPrint size={40} color={T.primary} />
        <Text style={[styles.authTitle, { fontFamily: FONT }]}>
          Join PawMatch
        </Text>
        <Text style={[styles.authSubtitle, { fontFamily: FONT }]}>
          Create your account to start matching
        </Text>
      </View>

      <View style={styles.authForm}>
        <Field
          label="Full Name"
          value={data.ownerName}
          onChange={(text) => setFieldValue('ownerName', text)}
          onBlur={() => setFieldTouched('ownerName')}
          placeholder="Enter your full name"
          error={touched.ownerName ? errors.ownerName : undefined}
        />

        <Field
          label="Email Address"
          value={data.email}
          onChange={(text) => setFieldValue('email', text)}
          onBlur={() => setFieldTouched('email')}
          placeholder="Enter your email"
          autoCapitalize="none"
          error={touched.email ? errors.email : undefined}
        />

        <View style={{ position: 'relative' }}>
          <Field
            label="Password"
            value={data.password}
            onChange={(text) => setFieldValue('password', text)}
            onBlur={() => setFieldTouched('password')}
            placeholder="Create a password"
            secure={!showPassword}
            error={touched.password ? errors.password : undefined}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.passwordToggle}
          >
            {showPassword ?
              <EyeOff size={20} color={T.medium} /> :
              <Eye size={20} color={T.medium} />
            }
          </TouchableOpacity>
        </View>

        <View style={{ position: 'relative' }}>
          <Field
            label="Confirm Password"
            value={data.confirmPassword}
            onChange={(text) => setFieldValue('confirmPassword', text)}
            onBlur={() => setFieldTouched('confirmPassword')}
            placeholder="Confirm your password"
            secure={!showConfirmPassword}
            error={touched.confirmPassword && data.password !== data.confirmPassword ? 'Passwords do not match' : undefined}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.passwordToggle}
          >
            {showConfirmPassword ?
              <EyeOff size={20} color={T.medium} /> :
              <Eye size={20} color={T.medium} />
            }
          </TouchableOpacity>
        </View>

        <Field
          label="Location"
          value={data.location}
          onChange={(text) => setFieldValue('location', text)}
          onBlur={() => setFieldTouched('location')}
          placeholder="Your city"
          error={touched.location ? errors.location : undefined}
        />

        <Field
          label="Phone Number"
          value={data.phoneNumber}
          onChange={(text) => setFieldValue('phoneNumber', text)}
          onBlur={() => setFieldTouched('phoneNumber')}
          placeholder="Your phone number"
          error={touched.phoneNumber ? errors.phoneNumber : undefined}
        />

        <TouchableOpacity
          onPress={() => setFieldValue('agreeToTerms', !data.agreeToTerms)}
          style={styles.checkboxContainer}
        >
          <View style={[styles.checkbox, data.agreeToTerms && styles.checkboxChecked]}>
            {data.agreeToTerms && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={[styles.checkboxLabel, { fontFamily: FONT }]}>
            I agree to the Terms of Service and Privacy Policy
          </Text>
        </TouchableOpacity>

        <Btn onClick={handleRegister} size="large">
          Create Account
        </Btn>

        <TouchableOpacity
          onPress={() => navigate("login")}
          style={styles.switchAuthMode}
        >
          <Text style={[styles.switchAuthText, { fontFamily: FONT }]}>
            Already have an account? <Text style={styles.switchAuthLink}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* ── Enhanced Login ─────────────────────────────────────────── */
export function Login() {
  const { navigate, setUser, setLoading, isLoading } = useV3();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const emailRule = FormValidator.email();
    const requiredRule = FormValidator.required('Email is required');

    let error = FormValidator.validateField(email, [requiredRule]);
    if (!error) {
      error = FormValidator.validateField(email, [emailRule]);
    }

    setEmailError(error || '');
    return !error;
  };

  const validatePassword = (password: string) => {
    const requiredRule = FormValidator.required('Password is required');
    const error = FormValidator.validateField(password, [requiredRule]);
    setPasswordError(error || '');
    return !error;
  };

  const handleLogin = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setLoading('login', 'loading');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock successful login
      const user = {
        id: "1",
        name: "Juan dela Cruz",
        avatar: "https://via.placeholder.com/100x100/4A90E2/ffffff?text=JC",
        location: "Davao City",
        memberSince: "2023-01-15",
        reputation: 4.8,
        totalMatches: 12,
        successfulBreedings: 8,
        verificationStatus: 'verified' as const,
        badges: []
      };

      setUser(user);
      setLoading('login', 'success');
      navigate("home");
    } catch (error) {
      setLoading('login', 'error');
      Alert.alert('Login Failed', 'Invalid email or password.');
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert('Social Login', `${provider} login will be implemented soon!`);
  };

  if (isLoading('login')) {
    return (
      <View style={styles.container}>
        <LoadingSpinner message="Signing you in..." />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <TouchableOpacity
        onPress={() => navigate("onboarding")}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.authHeader}>
        <PawPrint size={40} color={T.primary} />
        <Text style={[styles.authTitle, { fontFamily: FONT }]}>
          Welcome Back
        </Text>
        <Text style={[styles.authSubtitle, { fontFamily: FONT }]}>
          Sign in to your PawMatch account
        </Text>
      </View>

      <View style={styles.authForm}>
        <Field
          label="Email Address"
          value={email}
          onChange={setEmail}
          onBlur={() => validateEmail(email)}
          placeholder="Enter your email"
          autoCapitalize="none"
          error={emailError}
        />

        <View style={{ position: 'relative' }}>
          <Field
            label="Password"
            value={password}
            onChange={setPassword}
            onBlur={() => validatePassword(password)}
            placeholder="Enter your password"
            secure={!showPassword}
            error={passwordError}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.passwordToggle}
          >
            {showPassword ?
              <EyeOff size={20} color={T.medium} /> :
              <Eye size={20} color={T.medium} />
            }
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={[styles.forgotPasswordText, { fontFamily: FONT }]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <Btn onClick={handleLogin} size="large">
          Sign In
        </Btn>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={[styles.dividerText, { fontFamily: FONT }]}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialLogins}>
          <TouchableOpacity
            onPress={() => handleSocialLogin('Google')}
            style={[styles.socialButton, { backgroundColor: '#ffffffff' }]}
          >
            <Text style={[styles.socialButtonText, { fontFamily: FONT }, { color: '#ff631bff' }]}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSocialLogin('Facebook')}
            style={[styles.socialButton, { backgroundColor: 'rgba(0, 85, 255, 0.11)' }, { borderColor: 'rgba(0, 86, 255, 1)' }, { borderWidth: 2 }]}
          >
            <Text style={[styles.socialButtonText, { fontFamily: FONT }, { color: 'rgba(0, 86, 255, 1)' }]}>
              Continue with Facebook
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => navigate("register")}
          style={styles.switchAuthMode}
        >
          <Text style={[styles.switchAuthText, { fontFamily: FONT }]}>
            Don't have an account? <Text style={styles.switchAuthLink}>Sign Up</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.demoSection}>
          <Text style={[styles.demoTitle, { fontFamily: FONT }]}>Demo Access</Text>
          <TouchableOpacity
            onPress={() => {
              setEmail('demo@pawmatch.com');
              setPassword('demo123');
            }}
            style={styles.demoButton}
          >
            <Text style={[styles.demoButtonText, { fontFamily: FONT }]}>
              Fill Demo Credentials
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.white,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  splashLogoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  splashTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  splashSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  loadingDots: {
    flexDirection: "row",
    gap: 8,
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  onboardingIconContainer: {
    marginBottom: 32,
  },
  onboardingTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  onboardingSub: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 32,
  },
  onboardingFooter: {
    padding: 20,
  },
  slideIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 32,
  },
  slideIndicator: {
    width: 24,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#fff",
  },
  onboardingButtons: {
    gap: 12,
  },
  loginLink: {
    alignItems: "center",
    paddingVertical: 12,
  },
  loginLinkText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: T.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  authHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: T.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 16,
    color: T.medium,
    textAlign: 'center',
  },
  authForm: {
    gap: 16,
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    top: 38,
    padding: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: T.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: T.primary,
    borderColor: T.primary,
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: T.dark,
    lineHeight: 20,
  },
  switchAuthMode: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  switchAuthText: {
    fontSize: 14,
    color: T.medium,
  },
  switchAuthLink: {
    color: T.primary,
    fontWeight: '600',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: T.primary,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: T.border,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: T.medium,
  },
  socialLogins: {
    gap: 12,
  },
  socialButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  socialButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  demoSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: T.bg,
    borderRadius: 8,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: T.dark,
    marginBottom: 8,
  },
  demoButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  demoButtonText: {
    fontSize: 12,
    color: T.primary,
    fontWeight: '600',
  },
});