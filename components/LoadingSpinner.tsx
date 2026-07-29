import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { FONT, T } from '../contexts/AppContext';

interface LoadingSpinnerProps {
    size?: 'small' | 'large';
    message?: string;
    color?: string;
}

export function LoadingSpinner({ size = 'large', message, color = T.primary }: LoadingSpinnerProps) {
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20
        }}>
            <ActivityIndicator size={size} color={color} />
            {message && (
                <Text style={{
                    marginTop: 12,
                    fontSize: 14,
                    color: T.medium,
                    textAlign: 'center',
                    fontFamily: FONT
                }}>
                    {message}
                </Text>
            )}
        </View>
    );
}

interface ErrorBoundaryProps {
    error?: string;
    onRetry?: () => void;
    showRetry?: boolean;
}

export function ErrorBoundary({ error, onRetry, showRetry = true }: ErrorBoundaryProps) {
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20
        }}>
            <View style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: T.error + '20',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 16
            }}>
                <Text style={{ fontSize: 24 }}>⚠️</Text>
            </View>

            <Text style={{
                fontSize: 18,
                fontWeight: '600',
                color: T.dark,
                marginBottom: 8,
                textAlign: 'center',
                fontFamily: FONT
            }}>
                Oops! Something went wrong
            </Text>

            <Text style={{
                fontSize: 14,
                color: T.medium,
                textAlign: 'center',
                marginBottom: 20,
                lineHeight: 20,
                fontFamily: FONT
            }}>
                {error || 'An unexpected error occurred. Please try again.'}
            </Text>

            {showRetry && onRetry && (
                <TouchableOpacity
                    onPress={onRetry}
                    style={{
                        backgroundColor: T.primary,
                        paddingHorizontal: 24,
                        paddingVertical: 12,
                        borderRadius: 8
                    }}
                >
                    <Text style={{
                        color: 'white',
                        fontWeight: '600',
                        fontFamily: FONT
                    }}>
                        Try Again
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

export function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    onAction
}: {
    icon: string;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}) {
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 40
        }}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>{icon}</Text>

            <Text style={{
                fontSize: 18,
                fontWeight: '600',
                color: T.dark,
                marginBottom: 8,
                textAlign: 'center',
                fontFamily: FONT
            }}>
                {title}
            </Text>

            <Text style={{
                fontSize: 14,
                color: T.medium,
                textAlign: 'center',
                lineHeight: 20,
                marginBottom: actionLabel ? 24 : 0,
                fontFamily: FONT
            }}>
                {description}
            </Text>

            {actionLabel && onAction && (
                <TouchableOpacity
                    onPress={onAction}
                    style={{
                        backgroundColor: T.primary,
                        paddingHorizontal: 24,
                        paddingVertical: 12,
                        borderRadius: 8
                    }}
                >
                    <Text style={{
                        color: 'white',
                        fontWeight: '600',
                        fontFamily: FONT
                    }}>
                        {actionLabel}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}