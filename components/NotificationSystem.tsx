import { Bell, Calendar, Heart, MessageCircle, Shield } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Animated, Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { FONT, T, useV3 } from '../contexts/AppContext';
import { Notification } from '../types';

const { width } = Dimensions.get('window');

interface NotificationToastProps {
    notification: Notification;
    onDismiss: () => void;
    onPress?: () => void;
}

function NotificationToast({ notification, onDismiss, onPress }: NotificationToastProps) {
    const [slideAnim] = useState(new Animated.Value(-width));
    const [opacityAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        // Slide in animation
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start();

        // Auto dismiss after 4 seconds
        const timer = setTimeout(() => {
            dismiss();
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    const dismiss = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: -width,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            })
        ]).start(() => onDismiss());
    };

    const getIcon = () => {
        switch (notification.type) {
            case 'match_request':
                return <Heart size={20} color={T.primary} />;
            case 'message':
                return <MessageCircle size={20} color={T.accent} />;
            case 'verification':
                return <Shield size={20} color={T.success} />;
            case 'event':
                return <Calendar size={20} color={T.secondary} />;
            default:
                return <Bell size={20} color={T.medium} />;
        }
    };

    const getBackgroundColor = () => {
        switch (notification.type) {
            case 'match_request':
                return T.primaryLight;
            case 'message':
                return T.accentLight;
            case 'verification':
                return T.mintGreenLight;
            case 'event':
                return T.secondaryLight;
            default:
                return T.bg;
        }
    };

    return (
        <Animated.View
            style={{
                position: 'absolute',
                top: 60,
                left: 16,
                right: 16,
                zIndex: 1000,
                transform: [{ translateX: slideAnim }],
                opacity: opacityAnim,
            }}
        >
            <TouchableOpacity
                onPress={() => {
                    onPress?.();
                    dismiss();
                }}
                onLongPress={dismiss}
                style={{
                    backgroundColor: getBackgroundColor(),
                    borderRadius: 12,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 4,
                    borderLeftWidth: 4,
                    borderLeftColor: notification.type === 'match_request' ? T.primary :
                        notification.type === 'message' ? T.accent :
                            notification.type === 'verification' ? T.success : T.secondary
                }}
            >
                <View style={{ marginRight: 12, marginTop: 2 }}>
                    {getIcon()}
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: T.dark,
                        marginBottom: 2,
                        fontFamily: FONT
                    }}>
                        {notification.title}
                    </Text>

                    <Text style={{
                        fontSize: 12,
                        color: T.medium,
                        lineHeight: 16,
                        fontFamily: FONT
                    }}>
                        {notification.description}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={dismiss}
                    style={{
                        padding: 4,
                        marginLeft: 8
                    }}
                >
                    <Text style={{ fontSize: 16, color: T.medium }}>×</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        </Animated.View>
    );
}

export function NotificationSystem() {
    const { state, markNotificationRead, navigate } = useV3();
    const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);

    useEffect(() => {
        const unreadNotifications = state.notifications.filter(n => !n.read);
        if (unreadNotifications.length > 0 && !currentNotification) {
            setCurrentNotification(unreadNotifications[0]);
        }
    }, [state.notifications, currentNotification]);

    const handleNotificationPress = (notification: Notification) => {
        markNotificationRead(notification.id);

        // Navigate based on notification type
        switch (notification.type) {
            case 'match_request':
                navigate('notifications');
                break;
            case 'message':
                navigate('conversation');
                break;
            case 'verification':
                navigate('verify-status');
                break;
            case 'event':
                navigate('events');
                break;
            default:
                navigate('notifications');
        }
    };

    const handleDismiss = () => {
        if (currentNotification) {
            markNotificationRead(currentNotification.id);
            setCurrentNotification(null);
        }
    };

    if (!currentNotification) {
        return null;
    }

    return (
        <NotificationToast
            notification={currentNotification}
            onDismiss={handleDismiss}
            onPress={() => handleNotificationPress(currentNotification)}
        />
    );
}

// Notification Badge Component
export function NotificationBadge() {
    const { state } = useV3();
    const unreadCount = state.notifications.filter(n => !n.read).length;

    if (unreadCount === 0) {
        return null;
    }

    return (
        <View style={{
            position: 'absolute',
            top: -6,
            right: -6,
            backgroundColor: T.error,
            borderRadius: 10,
            minWidth: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: T.white
        }}>
            <Text style={{
                color: 'white',
                fontSize: 10,
                fontWeight: '700',
                fontFamily: FONT
            }}>
                {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
        </View>
    );
}

// Helper function to create notifications
export function createNotification(
    type: Notification['type'],
    title: string,
    description: string,
    actionData?: any
): Omit<Notification, 'id'> {
    return {
        type,
        title,
        description,
        timestamp: new Date().toISOString(),
        read: false,
        actionData
    };
}