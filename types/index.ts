// Core type definitions for the dog matching app

export interface Dog {
    id: string;
    name: string;
    breed: string;
    sex: 'male' | 'female';
    age: number;
    size: 'small' | 'medium' | 'large';
    color: string;
    temperament: string[];
    location: string;
    images: string[];
    verificationTier: 1 | 2 | 3;
    healthRecords: HealthRecord[];
    owner: Owner;
    description: string;
    lastActive: string;
    matchingPreferences?: MatchingPreferences;
}

export interface Owner {
    id: string;
    name: string;
    avatar: string;
    location: string;
    memberSince: string;
    reputation: number;
    totalMatches: number;
    successfulBreedings: number;
    verificationStatus: 'verified' | 'pending' | 'unverified';
    badges: Badge[];
}

export interface HealthRecord {
    id: string;
    type: 'vaccination' | 'veterinary' | 'pedigree' | 'genetic';
    title: string;
    date: string;
    verifiedBy?: string;
    documentUrl?: string;
    status: 'verified' | 'pending' | 'expired';
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedDate: string;
}

export interface MatchingPreferences {
    preferredBreeds: string[];
    preferredSizes: ('small' | 'medium' | 'large')[];
    temperamentMatch: 'any' | 'similar' | 'complementary';
    maxDistance: number;
    verificationRequired: boolean;
    ageRange: [number, number];
}

export interface MatchResult {
    dog: Dog;
    score: number;
    reasons: string[];
    compatibility: {
        breed: number;
        temperament: number;
        health: number;
        distance: number;
        overall: number;
    };
}

export interface MatchRequest {
    id: string;
    fromDog: Dog;
    toDog: Dog;
    message: string;
    status: 'pending' | 'accepted' | 'declined' | 'expired';
    createdAt: string;
    respondedAt?: string;
}

export interface Conversation {
    id: string;
    participants: Owner[];
    relatedDogs: Dog[];
    messages: Message[];
    lastMessage: Message;
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    id: string;
    senderId: string;
    content: string;
    type: 'text' | 'image' | 'match_request' | 'system';
    timestamp: string;
    read: boolean;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    location: string;
    date: string;
    attendees: Owner[];
    maxAttendees: number;
    fee?: number;
    organizer: Owner;
    category: 'meetup' | 'training' | 'show' | 'breeding';
}

// Screen types for navigation
export type Screen =
    | 'landing'
    | 'splash'
    | 'onboarding'
    | 'register'
    | 'login'
    | 'home'
    | 'match'
    | 'filter'
    | 'match-profile'
    | 'send-request'
    | 'request-received'
    | 'dog-profile'
    | 'add-dog'
    | 'owner-profile'
    | 'verify-upload'
    | 'verify-choose'
    | 'verify-status'
    | 'empty-verify'
    | 'reputation'
    | 'notifications'
    | 'events'
    | 'empty-notif'
    | 'empty-matches'
    | 'conversation'
    | 'settings';

export interface AppState {
    screen: Screen;
    selectedDog: Dog | null;
    currentUser: Owner | null;
    isAuthenticated: boolean;
    matchResults: MatchResult[];
    conversations: Conversation[];
    notifications: Notification[];
}

export interface Notification {
    id: string;
    type: 'match_request' | 'message' | 'verification' | 'event' | 'system';
    title: string;
    description: string;
    timestamp: string;
    read: boolean;
    actionData?: any;
}

// Form types
export interface RegistrationForm {
    ownerName: string;
    email: string;
    password: string;
    confirmPassword: string;
    location: string;
    phoneNumber: string;
    agreeToTerms: boolean;
}

export interface DogProfileForm {
    name: string;
    breed: string;
    sex: 'male' | 'female';
    age: number;
    size: 'small' | 'medium' | 'large';
    color: string;
    temperament: string[];
    description: string;
    images: string[];
}

export interface FilterForm {
    breeds: string[];
    sizes: ('small' | 'medium' | 'large')[];
    ageRange: [number, number];
    maxDistance: number;
    verificationRequired: boolean;
    temperament: string[];
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}