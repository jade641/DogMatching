import { Dog, MatchResult, MatchingPreferences } from '../types';

interface MatchingCriteria {
    breedCompatibility: number;
    temperamentMatch: number;
    healthScore: number;
    distanceScore: number;
    ageCompatibility: number;
    sizeCompatibility: number;
    verificationBonus: number;
}

export class MatchingService {
    private static readonly WEIGHTS = {
        breed: 0.25,
        temperament: 0.20,
        health: 0.20,
        distance: 0.15,
        age: 0.10,
        size: 0.05,
        verification: 0.05
    };

    // Enhanced breed compatibility matrix
    private static readonly BREED_COMPATIBILITY: Record<string, string[]> = {
        'Golden Retriever': ['Labrador Retriever', 'German Shepherd', 'Border Collie'],
        'Labrador Retriever': ['Golden Retriever', 'German Shepherd', 'Poodle'],
        'German Shepherd': ['Golden Retriever', 'Labrador Retriever', 'Rottweiler'],
        'Border Collie': ['Australian Shepherd', 'Golden Retriever', 'Poodle'],
        'French Bulldog': ['English Bulldog', 'Boston Terrier', 'Pug'],
        'Poodle': ['Labrador Retriever', 'Golden Retriever', 'Border Collie'],
        'Husky': ['Alaskan Malamute', 'German Shepherd', 'Samoyed'],
        'Beagle': ['Basset Hound', 'Cocker Spaniel', 'Brittany']
    };

    // Temperament compatibility scoring
    private static readonly TEMPERAMENT_SYNERGY: Record<string, Record<string, number>> = {
        'Friendly': { 'Friendly': 1.0, 'Calm': 0.9, 'Energetic': 0.8, 'Protective': 0.6 },
        'Energetic': { 'Energetic': 1.0, 'Playful': 0.9, 'Friendly': 0.8, 'Calm': 0.4 },
        'Calm': { 'Calm': 1.0, 'Gentle': 0.9, 'Friendly': 0.8, 'Energetic': 0.4 },
        'Protective': { 'Protective': 0.8, 'Loyal': 0.9, 'Alert': 0.8, 'Aggressive': 0.3 },
        'Playful': { 'Playful': 1.0, 'Energetic': 0.9, 'Friendly': 0.8, 'Calm': 0.5 }
    };

    static calculateMatch(candidateDog: Dog, userDog: Dog, preferences?: MatchingPreferences): MatchResult {
        const criteria = this.evaluateMatchingCriteria(candidateDog, userDog, preferences);
        const overallScore = this.calculateOverallScore(criteria);
        const reasons = this.generateMatchReasons(criteria, candidateDog, userDog);

        return {
            dog: candidateDog,
            score: Math.round(overallScore * 100) / 100,
            reasons,
            compatibility: {
                breed: criteria.breedCompatibility,
                temperament: criteria.temperamentMatch,
                health: criteria.healthScore,
                distance: criteria.distanceScore,
                overall: overallScore
            }
        };
    }

    private static evaluateMatchingCriteria(
        candidateDog: Dog,
        userDog: Dog,
        preferences?: MatchingPreferences
    ): MatchingCriteria {
        return {
            breedCompatibility: this.calculateBreedCompatibility(candidateDog.breed, userDog.breed, preferences),
            temperamentMatch: this.calculateTemperamentMatch(candidateDog.temperament, userDog.temperament),
            healthScore: this.calculateHealthScore(candidateDog),
            distanceScore: this.calculateDistanceScore(candidateDog.location, userDog.location),
            ageCompatibility: this.calculateAgeCompatibility(candidateDog.age, userDog.age, preferences),
            sizeCompatibility: this.calculateSizeCompatibility(candidateDog.size, userDog.size),
            verificationBonus: this.calculateVerificationBonus(candidateDog.verificationTier)
        };
    }

    private static calculateBreedCompatibility(
        candidateBreed: string,
        userBreed: string,
        preferences?: MatchingPreferences
    ): number {
        // Exact breed match
        if (candidateBreed === userBreed) return 100;

        // Check user preferences
        if (preferences?.preferredBreeds?.includes(candidateBreed)) return 95;

        // Check breed compatibility matrix
        const compatibleBreeds = this.BREED_COMPATIBILITY[userBreed] || [];
        if (compatibleBreeds.includes(candidateBreed)) return 85;

        // Size-based compatibility fallback
        const userSize = this.getBreedSize(userBreed);
        const candidateSize = this.getBreedSize(candidateBreed);
        if (userSize === candidateSize) return 70;

        return 40; // Low compatibility for unrelated breeds
    }

    private static calculateTemperamentMatch(
        candidateTemperament: string[],
        userTemperament: string[]
    ): number {
        let totalScore = 0;
        let comparisons = 0;

        for (const userTrait of userTemperament) {
            for (const candidateTrait of candidateTemperament) {
                const synergy = this.TEMPERAMENT_SYNERGY[userTrait]?.[candidateTrait] || 0.5;
                totalScore += synergy;
                comparisons++;
            }
        }

        return comparisons > 0 ? (totalScore / comparisons) * 100 : 50;
    }

    private static calculateHealthScore(dog: Dog): number {
        const baseScore = 70;
        let bonuses = 0;

        // Verification tier bonus
        bonuses += dog.verificationTier * 10;

        // Health records bonus
        const verifiedRecords = dog.healthRecords.filter(r => r.status === 'verified').length;
        bonuses += Math.min(verifiedRecords * 5, 20);

        return Math.min(baseScore + bonuses, 100);
    }

    private static calculateDistanceScore(candidateLocation: string, userLocation: string): number {
        // Simple location matching for now
        if (candidateLocation === userLocation) return 100;

        // Could implement proper geolocation distance calculation
        const isSameCity = candidateLocation.split(',')[0] === userLocation.split(',')[0];
        return isSameCity ? 85 : 60;
    }

    private static calculateAgeCompatibility(
        candidateAge: number,
        userAge: number,
        preferences?: MatchingPreferences
    ): number {
        if (preferences?.ageRange) {
            const [minAge, maxAge] = preferences.ageRange;
            if (candidateAge < minAge || candidateAge > maxAge) return 30;
        }

        const ageDiff = Math.abs(candidateAge - userAge);
        if (ageDiff === 0) return 100;
        if (ageDiff <= 1) return 90;
        if (ageDiff <= 2) return 75;
        if (ageDiff <= 3) return 60;
        return 40;
    }

    private static calculateSizeCompatibility(candidateSize: string, userSize: string): number {
        if (candidateSize === userSize) return 100;

        const sizeOrder = ['small', 'medium', 'large'];
        const candidateIndex = sizeOrder.indexOf(candidateSize);
        const userIndex = sizeOrder.indexOf(userSize);

        const sizeDiff = Math.abs(candidateIndex - userIndex);
        if (sizeDiff === 1) return 75;
        return 50;
    }

    private static calculateVerificationBonus(tier: number): number {
        return tier * 25; // 25 points per tier
    }

    private static calculateOverallScore(criteria: MatchingCriteria): number {
        return (
            criteria.breedCompatibility * this.WEIGHTS.breed +
            criteria.temperamentMatch * this.WEIGHTS.temperament +
            criteria.healthScore * this.WEIGHTS.health +
            criteria.distanceScore * this.WEIGHTS.distance +
            criteria.ageCompatibility * this.WEIGHTS.age +
            criteria.sizeCompatibility * this.WEIGHTS.size +
            (criteria.verificationBonus * this.WEIGHTS.verification)
        );
    }

    private static generateMatchReasons(
        criteria: MatchingCriteria,
        candidateDog: Dog,
        userDog: Dog
    ): string[] {
        const reasons: string[] = [];

        if (criteria.breedCompatibility > 90) {
            reasons.push(candidateDog.breed === userDog.breed
                ? 'Same breed - excellent genetic compatibility'
                : 'Highly compatible breeds for breeding'
            );
        }

        if (criteria.temperamentMatch > 85) {
            reasons.push('Excellent temperament match for balanced offspring');
        }

        if (criteria.healthScore > 90) {
            reasons.push('Excellent health verification and records');
        }

        if (criteria.distanceScore > 90) {
            reasons.push('Located in your area - easy meetups');
        }

        if (criteria.ageCompatibility > 85) {
            reasons.push('Optimal age compatibility for breeding');
        }

        if (candidateDog.verificationTier >= 2) {
            reasons.push(`Tier ${candidateDog.verificationTier} verified - trusted breeder`);
        }

        if (reasons.length === 0) {
            reasons.push('Potential match based on your preferences');
        }

        return reasons.slice(0, 3); // Limit to top 3 reasons
    }

    private static getBreedSize(breed: string): string {
        const smallBreeds = ['French Bulldog', 'Pug', 'Boston Terrier', 'Beagle'];
        const largeBreeds = ['German Shepherd', 'Golden Retriever', 'Labrador Retriever', 'Husky'];

        if (smallBreeds.includes(breed)) return 'small';
        if (largeBreeds.includes(breed)) return 'large';
        return 'medium';
    }

    // Batch matching for multiple dogs
    static findMatches(
        dogs: Dog[],
        userDog: Dog,
        preferences?: MatchingPreferences,
        limit: number = 10
    ): MatchResult[] {
        const matches = dogs
            .filter(dog => dog.id !== userDog.id && dog.sex !== userDog.sex) // Basic filters
            .map(dog => this.calculateMatch(dog, userDog, preferences))
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);

        return matches;
    }

    // Get personalized matching tips
    static getMatchingTips(userDog: Dog): string[] {
        const tips: string[] = [];

        if (userDog.verificationTier < 2) {
            tips.push('Complete Tier 2 verification to increase match quality');
        }

        if (userDog.healthRecords.length < 2) {
            tips.push('Add more health records to build trust with potential matches');
        }

        if (!userDog.matchingPreferences) {
            tips.push('Set your matching preferences for better compatibility scoring');
        }

        tips.push('Update your location for accurate distance-based matching');
        tips.push('Keep your dog\'s profile active and photos current');

        return tips;
    }
}