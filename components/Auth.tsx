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
        <Text style={styles.backButtonText}> </Text>
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

      // Check if veterinarian login
      if (email === 'vet@pawmatch.com' && password === 'vet123') {
        // Veterinarian login
        const vet = {
          id: "vet1",
          name: "Dr. Maria Santos",
          avatar: "https://via.placeholder.com/100x100/4A90E2/ffffff?text=MS",
          location: "Davao City",
          memberSince: "2020-01-01",
          reputation: 4.9,
          totalMatches: 0,
          successfulBreedings: 0,
          verificationStatus: 'verified' as const,
          badges: [],
          role: 'veterinarian' as const,
          email: 'vet@pawmatch.com',
        };

        setUser(vet);
        setLoading('login', 'success');
        navigate("vet-dashboard");
      } else {
        // Regular user login
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
          badges: [],
          role: 'breeder' as const,
        };

        setUser(user);
        setLoading('login', 'success');
        navigate("home");
      }
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
        <Text style={styles.backButtonText}></Text>
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

        <TouchableOpacity 
          onPress={() => navigate("forgot-password")}
          style={styles.forgotPassword}
        >
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
            style={[styles.socialButton, { backgroundColor: 'rgba(0, 85, 255, 0.18)' }]}
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
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={() => {
                setEmail('demo@pawmatch.com');
                setPassword('demo123');
              }}
              style={[styles.demoButton, { flex: 1 }]}
            >
              <Text style={[styles.demoButtonText, { fontFamily: FONT }]}>
                Dog Breeder
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setEmail('vet@pawmatch.com');
                setPassword('vet123');
              }}
              style={[styles.demoButton, { flex: 1, backgroundColor: T.accentLight }]}
            >
              <Text style={[styles.demoButtonText, { fontFamily: FONT, color: T.accent }]}>
                Veterinarian
              </Text>
            </TouchableOpacity>
          </View>
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

/* ── Forgot Password ──────────────────────────────────────────── */
export function ForgotPassword() {
  const { navigate, goBack, setLoading, isLoading } = useV3();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

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

  const handleSendResetLink = async () => {
    if (!validateEmail(email)) {
      return;
    }

    setLoading('forgot-password', 'loading');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setLoading('forgot-password', 'success');
      navigate("forgot-password-sent");
    } catch (error) {
      setLoading('forgot-password', 'error');
      Alert.alert('Error', 'Failed to send reset link. Please try again.');
    }
  };

  if (isLoading('forgot-password')) {
    return (
      <View style={styles.container}>
        <LoadingSpinner message="Sending reset link..." />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <TouchableOpacity
        onPress={goBack}
        style={styles.backButton}
      >
        <Text style={[styles.backButtonText, { fontFamily: FONT }]}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.authHeader}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: T.primaryLight,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <PawPrint size={40} color={T.primary} />
        </View>
        <Text style={[styles.authTitle, { fontFamily: FONT }]}>
          Forgot Password?
        </Text>
        <Text style={[styles.authSubtitle, { fontFamily: FONT, textAlign: 'center', paddingHorizontal: 20 }]}>
          No worries! Enter your email address and we'll send you a link to reset your password.
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

        <Btn onClick={handleSendResetLink} size="large">
          Send Reset Link
        </Btn>

        <TouchableOpacity
          onPress={() => navigate("login")}
          style={styles.switchAuthMode}
        >
          <Text style={[styles.switchAuthText, { fontFamily: FONT }]}>
            Remember your password? <Text style={styles.switchAuthLink}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* ── Forgot Password Sent ─────────────────────────────────────── */
export function ForgotPasswordSent() {
  const { navigate } = useV3();

  return (
    <View style={[styles.container, { padding: 20, justifyContent: 'center' }]}>
      <View style={styles.authHeader}>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: T.primaryLight,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
          }}
        >
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: T.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 32 }}>📧</Text>
          </View>
        </View>
        <Text style={[styles.authTitle, { fontFamily: FONT }]}>
          Check Your Email
        </Text>
        <Text style={[styles.authSubtitle, { fontFamily: FONT, textAlign: 'center', paddingHorizontal: 20, lineHeight: 24 }]}>
          We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
        </Text>
      </View>

      <View style={{ gap: 16, marginTop: 32 }}>
        <Btn onClick={() => navigate("login")} size="large">
          Back to Sign In
        </Btn>

        <TouchableOpacity
          onPress={() => navigate("forgot-password")}
          style={{
            paddingVertical: 12,
            alignItems: 'center',
          }}
        >
          <Text style={[styles.switchAuthText, { fontFamily: FONT }]}>
            Didn't receive the email? <Text style={styles.switchAuthLink}>Resend</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          marginTop: 40,
          padding: 16,
          backgroundColor: T.bg,
          borderRadius: 12,
          borderLeftWidth: 4,
          borderLeftColor: T.primary,
        }}
      >
        <Text style={{ fontSize: 14, color: T.dark, fontWeight: '600', marginBottom: 8 }}>
          💡 Tip
        </Text>
        <Text style={{ fontSize: 12, color: T.medium, lineHeight: 18 }}>
          If you don't see the email, check your spam or junk folder. The reset link will expire in 24 hours for security reasons.
        </Text>
      </View>
    </View>
  );
}

/* ── Reset Password ───────────────────────────────────────────── */
export function ResetPassword() {
  const { navigate, setLoading, isLoading } = useV3();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validatePassword = (password: string) => {
    const minLengthRule = FormValidator.minLength(8);
    const requiredRule = FormValidator.required('Password is required');

    let error = FormValidator.validateField(password, [requiredRule]);
    if (!error) {
      error = FormValidator.validateField(password, [minLengthRule]);
    }

    setPasswordError(error || '');
    return !error;
  };

  const validateConfirmPassword = (confirmPassword: string, password: string) => {
    const requiredRule = FormValidator.required('Please confirm your password');
    
    let error = FormValidator.validateField(confirmPassword, [requiredRule]);
    if (!error && confirmPassword !== password) {
      error = 'Passwords do not match';
    }

    setConfirmPasswordError(error || '');
    return !error;
  };

  const handleResetPassword = async () => {
    const isPasswordValid = validatePassword(password);
    const isConfirmValid = validateConfirmPassword(confirmPassword, password);

    if (!isPasswordValid || !isConfirmValid) {
      return;
    }

    setLoading('reset-password', 'loading');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setLoading('reset-password', 'success');
      Alert.alert(
        'Success!',
        'Your password has been reset successfully. You can now sign in with your new password.',
        [
          {
            text: 'Sign In',
            onPress: () => navigate('login'),
          },
        ]
      );
    } catch (error) {
      setLoading('reset-password', 'error');
      Alert.alert('Error', 'Failed to reset password. Please try again.');
    }
  };

  if (isLoading('reset-password')) {
    return (
      <View style={styles.container}>
        <LoadingSpinner message="Resetting your password..." />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <View style={styles.authHeader}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: T.primaryLight,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <PawPrint size={40} color={T.primary} />
        </View>
        <Text style={[styles.authTitle, { fontFamily: FONT }]}>
          Reset Password
        </Text>
        <Text style={[styles.authSubtitle, { fontFamily: FONT, textAlign: 'center', paddingHorizontal: 20 }]}>
          Create a new password for your account. Make sure it's strong and secure.
        </Text>
      </View>

      <View style={styles.authForm}>
        <View style={{ position: 'relative' }}>
          <Field
            label="New Password"
            value={password}
            onChange={setPassword}
            onBlur={() => validatePassword(password)}
            placeholder="Enter your new password"
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

        <View style={{ position: 'relative' }}>
          <Field
            label="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            onBlur={() => validateConfirmPassword(confirmPassword, password)}
            placeholder="Confirm your new password"
            secure={!showConfirmPassword}
            error={confirmPasswordError}
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

        <View
          style={{
            padding: 12,
            backgroundColor: T.primaryLight,
            borderRadius: 8,
            marginBottom: 8,
          }}
        >
          <Text style={{ fontSize: 12, color: T.dark, fontWeight: '600', marginBottom: 4 }}>
            Password Requirements:
          </Text>
          <Text style={{ fontSize: 11, color: T.medium, lineHeight: 16 }}>
            • At least 8 characters long{'\n'}
            • Mix of uppercase and lowercase letters{'\n'}
            • Include numbers and special characters
          </Text>
        </View>

        <Btn onClick={handleResetPassword} size="large">
          Reset Password
        </Btn>

        <TouchableOpacity
          onPress={() => navigate("login")}
          style={styles.switchAuthMode}
        >
          <Text style={[styles.switchAuthText, { fontFamily: FONT }]}>
            Remember your password? <Text style={styles.switchAuthLink}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
