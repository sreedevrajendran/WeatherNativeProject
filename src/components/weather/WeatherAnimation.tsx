import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    Easing,
    withDelay,
    interpolate,
    Extrapolation,
    withSpring,
} from 'react-native-reanimated';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, CloudFog, Moon } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface WeatherAnimationProps {
    condition: string;
    isDay?: boolean;
}

const CLOUD_COLOR = "rgba(255,255,255,0.8)";
const RAIN_COLOR = "#60A5FA";
const SNOW_COLOR = "#E0F2FE";
const SUN_COLOR = "#FDB813";
const MOON_COLOR = "#FEF3C7";

export const WeatherAnimation: React.FC<WeatherAnimationProps> = ({ condition, isDay = true }) => {
    const conditionLower = condition.toLowerCase();

    // Shared Values
    const sunRotation = useSharedValue(0);
    const sunGlowScale = useSharedValue(1);
    const cloudX = useSharedValue(0);
    const cloudY = useSharedValue(0); // For floating bob
    const rainY = useSharedValue(0);
    const snowY = useSharedValue(0);
    const snowSway = useSharedValue(0);
    const thunderOpacity = useSharedValue(0);
    const thunderShake = useSharedValue(0);
    const mistOpacity = useSharedValue(0.4);

    useEffect(() => {
        // Clear / Sunny: Rotate & Pulse
        sunRotation.value = withRepeat(
            withTiming(360, { duration: 20000, easing: Easing.linear }),
            -1,
            false
        );
        sunGlowScale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );

        // Clouds: Drift & Float (Bob)
        cloudX.value = withRepeat(
            withSequence(
                withTiming(10, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
                withTiming(-10, { duration: 4000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
        cloudY.value = withRepeat(
            withSequence(
                withTiming(5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                withTiming(-5, { duration: 2000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );

        // Rain: Fast Linear Drop
        rainY.value = withRepeat(
            withTiming(100, { duration: 800, easing: Easing.linear }),
            -1,
            false
        );

        // Snow: Slow Fall & Sway
        snowY.value = withRepeat(
            withTiming(50, { duration: 3000, easing: Easing.linear }),
            -1,
            false
        );
        snowSway.value = withRepeat(
            withSequence(
                withTiming(15, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                withTiming(-15, { duration: 2000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );

        // Mist: Pulse
        mistOpacity.value = withRepeat(
            withSequence(
                withTiming(0.8, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.4, { duration: 3000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );

        // Thunder: Random Flash & Shake
        const triggerThunder = () => {
            thunderOpacity.value = withSequence(
                withTiming(1, { duration: 100 }),
                withTiming(0, { duration: 100 }),
                withTiming(1, { duration: 50 }),
                withTiming(0, { duration: 300 })
            );
            thunderShake.value = withSequence(
                withTiming(-5, { duration: 50 }),
                withTiming(5, { duration: 50 }),
                withTiming(-5, { duration: 50 }),
                withTiming(5, { duration: 50 }),
                withTiming(0, { duration: 50 })
            );
        };

        if (conditionLower.includes('storm') || conditionLower.includes('thunder')) {
            const interval = setInterval(() => {
                if (Math.random() > 0.6) triggerThunder();
            }, 3000);
            return () => clearInterval(interval);
        }

    }, [condition]);

    // Styles
    const sunStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${sunRotation.value}deg` }, { scale: sunGlowScale.value }],
    }));

    const cloudStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: cloudX.value }, { translateY: cloudY.value }],
    }));

    const rainStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: rainY.value }],
        opacity: interpolate(rainY.value, [0, 80, 100], [0, 1, 0]),
    }));

    const snowStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: snowY.value }, { translateX: snowSway.value }],
        opacity: interpolate(snowY.value, [0, 40, 50], [0, 1, 0]),
    }));

    const thunderStyle = useAnimatedStyle(() => ({
        opacity: thunderOpacity.value,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        zIndex: -1,
    }));

    const shakeStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: thunderShake.value }],
    }));

    const mistStyle = useAnimatedStyle(() => ({
        opacity: mistOpacity.value,
        transform: [{ scale: 1.2 }],
    }));

    const getAnimationContent = () => {
        if (conditionLower.includes('sunny') || (conditionLower.includes('clear') && isDay)) {
            return (
                <View style={styles.centerContainer}>
                    <Animated.View style={sunStyle}>
                        <Sun size={140} color={SUN_COLOR} style={{ opacity: 0.9 }} />
                    </Animated.View>
                </View>
            );
        }

        if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
            return (
                <View style={styles.centerContainer}>
                    <Animated.View style={cloudStyle}>
                        <Cloud size={120} color={CLOUD_COLOR} />
                    </Animated.View>
                </View>
            );
        }

        if (conditionLower.includes('rain') || conditionLower.includes('drizzle') || conditionLower.includes('shower')) {
            return (
                <View style={styles.centerContainer}>
                    <Animated.View style={cloudStyle}>
                        <CloudRain size={110} color="#CBD5E1" />
                    </Animated.View>
                    <View style={styles.rainContainer}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Animated.View
                                key={i}
                                style={[
                                    styles.rainDrop,
                                    rainStyle,
                                    { left: i * 20, top: i % 2 === 0 ? 0 : 20 }
                                ]}
                            />
                        ))}
                    </View>
                </View>
            );
        }

        if (conditionLower.includes('storm') || conditionLower.includes('thunder')) {
            return (
                <View style={styles.centerContainer}>
                    <Animated.View style={thunderStyle} />
                    <Animated.View style={shakeStyle}>
                        <CloudLightning size={130} color="#475569" />
                    </Animated.View>
                </View>
            );
        }

        if (conditionLower.includes('snow') || conditionLower.includes('blizzard')) {
            return (
                <View style={styles.centerContainer}>
                    <Animated.View style={cloudStyle}>
                        <CloudSnow size={120} color={SNOW_COLOR} />
                    </Animated.View>
                    <View style={styles.rainContainer}>
                        {[1, 2, 3].map((i) => (
                            <Animated.View
                                key={i}
                                style={[
                                    styles.snowFlake,
                                    snowStyle,
                                    { left: i * 30 }
                                ]}
                            />
                        ))}
                    </View>
                </View>
            );
        }

        if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
            return (
                <View style={styles.centerContainer}>
                    <Animated.View style={mistStyle}>
                        <CloudFog size={140} color="rgba(255,255,255,0.7)" />
                    </Animated.View>
                </View>
            );
        }

        // Default: Moon
        return (
            <View style={styles.centerContainer}>
                <Animated.View style={cloudStyle}>
                    <Moon size={120} color={MOON_COLOR} fill={MOON_COLOR} style={{ opacity: 0.9 }} />
                </Animated.View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {getAnimationContent()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 280,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    centerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    rainContainer: {
        flexDirection: 'row',
        position: 'absolute',
        top: 80,
        width: 140,
        justifyContent: 'center',
    },
    rainDrop: {
        width: 3,
        height: 18,
        backgroundColor: RAIN_COLOR,
        borderRadius: 2,
        marginHorizontal: 4,
        position: 'absolute',
    },
    snowFlake: {
        width: 8,
        height: 8,
        backgroundColor: '#fff',
        borderRadius: 4,
        position: 'absolute',
    },
});
