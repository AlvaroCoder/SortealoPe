import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';
import Title from '../../components/common/Titles/Title';
import { Colors } from '../../constants/theme';

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const RED_500 = Colors.principal.red[500];
const RED_900 = Colors.principal.red[900];
const WHITE = 'white';

const { width, height } = Dimensions.get('window');
const WHEEL_SIZE = width * 0.8;
const SEGMENTS_COUNT = 8;
const SEGMENT_ANGLE = 360 / SEGMENTS_COUNT;
const SEGMENT_COLORS = [
    GREEN_500, 
    WHITE,
];

const LOGO_URL =
  'https://res.cloudinary.com/dabyqnijl/image/upload/v1764234644/COSAI_LOGOS_1_1_dbzabh.png';

const polarToCartesian = (cx, cy, r, angle) => {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
};

const describeArc = (cx, cy, r, startAngle, endAngle) => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return `
    M ${cx} ${cy}
    L ${start.x} ${start.y}
    A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}
    Z
  `;
};


const WheelSegments = () => {
  const radius = WHEEL_SIZE / 2;
  const cx = radius;
  const cy = radius;

  return (
    <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
      <G>
        {Array.from({ length: SEGMENTS_COUNT }).map((_, index) => {
          const startAngle = index * SEGMENT_ANGLE;
          const endAngle = startAngle + SEGMENT_ANGLE;
          const color = SEGMENT_COLORS[index % SEGMENT_COLORS.length];

          return (
            <G key={index}>
              <Path
                d={describeArc(cx, cy, radius, startAngle, endAngle)}
                fill={color}
                stroke={RED_900} 
                strokeWidth={3} 
              />

              <SvgText
                x={cx}
                y={cy - radius * 0.65}
                fill={color === WHITE ? GREEN_900 : WHITE} 
                fontSize="14"
                fontWeight="bold"
                textAnchor="middle"
                transform={`rotate(${startAngle + SEGMENT_ANGLE / 2} ${cx} ${cy})`}
              >
                {index + 1}
              </SvgText>
            </G>
          );
        })}
      </G>
    </Svg>
  );
};

export default function AnimationHome() {
  const rotation = useRef(new Animated.Value(0)).current;
  const wheelScale = useRef(new Animated.Value(1)).current;
  const wheelTranslateY = useRef(new Animated.Value(0)).current;
  const indicatorOpacity = useRef(new Animated.Value(1)).current; 
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();
  }, [rotation]);

useEffect(() => {
  const bottomTargetYTranslation = height / 2;
  const targetScale = width / WHEEL_SIZE * 2;

  Animated.sequence([
          Animated.parallel([
      Animated.timing(wheelScale, {
        toValue: targetScale,
        duration: 1100,
        useNativeDriver: true,
      }),

      Animated.timing(wheelTranslateY, {
        toValue: bottomTargetYTranslation,
        duration: 1100,
        useNativeDriver: true,
      }),

      Animated.timing(indicatorOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
          ]),
        Animated.delay(500),
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 7,
        tension: 90,
        useNativeDriver: true,
      }),
    ]),

  ]).start();
}, [indicatorOpacity, logoOpacity, logoScale, wheelScale, wheelTranslateY]);
  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });


  return (
    <View style={styles.container}>
      
      <Animated.View
        style={[
          styles.logoCenter,
          {
            opacity: logoOpacity, 
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.poweredBy}>Powered By Cosai</Text>
          <Image
            source={{ uri: LOGO_URL }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Title styleTitle={styles.titleText}>SORTEALO PE</Title>
          
        </View>
      </Animated.View>

      <Animated.View style={[styles.indicator, { opacity: indicatorOpacity }]}>
        <Ionicons name="caret-down" size={42} color={RED_500} />
      </Animated.View>

      <Animated.View
        style={[
          styles.wheel,
          { 
              transform: [
                  { translateY: wheelTranslateY }, 
             { scale: wheelScale },
              { rotate: rotateInterpolate },
              
             
            ] 
          },
        ]}
      >
        <WheelSegments />

        <View style={styles.centerCircle}>
          <Ionicons name="gift" size={WHEEL_SIZE * 0.15} color={GREEN_900} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GREEN_900,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    color: WHITE,
    marginTop: 10,
  },

  logo: {
    width: width * 0.6,
    height: 100,
  },
  logoCenter: {
    position: 'absolute',
    alignItems: 'center',
      justifyContent: 'center',
    top: height * 0.3,
  },

  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    borderWidth: 8,
    borderColor: GREEN_900,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },

  centerCircle: {
    position: 'absolute',
    width: WHEEL_SIZE * 0.3,
    height: WHEEL_SIZE * 0.3,
    borderRadius: (WHEEL_SIZE * 0.3) / 2,
    backgroundColor: WHITE,
    borderWidth: 4,
    borderColor: RED_500,
    alignItems: 'center',
    justifyContent: 'center',
  },

  indicator: {
    position: 'absolute',
    top: height / 2 - WHEEL_SIZE / 2 - 25, 
    zIndex: 10,
  },
  poweredBy: {
    color: WHITE,
    marginTop: 4,
    fontSize: 12,
  },
});