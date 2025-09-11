import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useAnimations } from './AnimationEngine';

interface InteractiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'magic' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  onHover?: () => void;
  onPress?: () => void;
}

export const InteractiveButton: React.FC<InteractiveButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  onHover,
  onPress
}) => {
  const { triggerAnimation } = useAnimations();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: string; x: number; y: number }>>([]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left - rect.width / 2);
    mouseY.set(event.clientY - rect.top - rect.height / 2);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    triggerAnimation('button-hover', { intensity: 'gentle' });
    onHover?.();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleMouseDown = () => {
    setIsPressed(true);
    triggerAnimation('button-click', { intensity: 'moderate' });
    onPress?.();
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    // Create ripple effect
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const newRipple = {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    triggerAnimation('button-click', { intensity: 'intense' });
    onClick?.();
  };

  const getVariantStyles = () => {
    const variants = {
      primary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500',
      secondary: 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600',
      magic: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500',
      danger: 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500',
      success: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500'
    };
    return variants[variant];
  };

  const getSizeStyles = () => {
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };
    return sizes[size];
  };

  return (
    <motion.button
      className={`
        relative overflow-hidden rounded-xl font-wizard text-white
        transition-all duration-300 ease-out
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      disabled={disabled}
      style={{
        transformStyle: 'preserve-3d',
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        scale: isPressed ? 0.95 : isHovered ? 1.05 : 1,
        boxShadow: isHovered 
          ? '0 20px 40px rgba(139, 92, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          : '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}
      whileHover={{
        y: -2,
        transition: { duration: 0.2 }
      }}
      whileTap={{
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
    >
      {/* Background Glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
        initial={{ opacity: 0, x: '-100%' }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          x: isHovered ? '100%' : '-100%'
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
      
      {/* Ripple Effects */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            className="absolute bg-white/30 rounded-full"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
      
      {/* Content */}
      <span className="relative z-10">
        {children}
      </span>
      
      {/* Magic Sparkles */}
      <AnimatePresence>
        {isHovered && variant === 'magic' && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-yellow-300"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`
                }}
                animate={{
                  y: [0, -20, -40],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: 'easeOut'
                }}
              >
                ✨
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// Interactive Card Component
interface InteractiveCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  hoverEffect?: 'lift' | 'glow' | 'tilt' | 'magic';
  onHover?: () => void;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  onClick,
  className = '',
  hoverEffect = 'lift',
  onHover
}) => {
  const { triggerAnimation } = useAnimations();
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    triggerAnimation('card-glow', { intensity: 'gentle' });
    onHover?.();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    if (hoverEffect === 'tilt') {
      setIsFlipped(!isFlipped);
    }
    triggerAnimation('card-flip', { intensity: 'moderate' });
    onClick?.();
  };

  const getHoverStyles = () => {
    switch (hoverEffect) {
      case 'lift':
        return {
          y: isHovered ? -8 : 0,
          scale: isHovered ? 1.02 : 1,
          boxShadow: isHovered 
            ? '0 20px 40px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            : '0 4px 12px rgba(0, 0, 0, 0.1)'
        };
      case 'glow':
        return {
          boxShadow: isHovered 
            ? '0 0 30px rgba(139, 92, 246, 0.6), 0 0 60px rgba(236, 72, 153, 0.4)'
            : '0 4px 12px rgba(0, 0, 0, 0.1)'
        };
      case 'tilt':
        return {
          rotateY: isFlipped ? 180 : 0,
          scale: isHovered ? 1.05 : 1
        };
      case 'magic':
        return {
          y: isHovered ? -4 : 0,
          scale: isHovered ? 1.03 : 1,
          boxShadow: isHovered 
            ? '0 15px 30px rgba(139, 92, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2)'
            : '0 4px 12px rgba(0, 0, 0, 0.1)'
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      className={`
        relative rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50
        backdrop-blur-lg border border-slate-700/50
        cursor-pointer overflow-hidden
        ${className}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      animate={getHoverStyles()}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Background Effects */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Magic Sparkles for magic effect */}
      {hoverEffect === 'magic' && (
        <AnimatePresence>
          {isHovered && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-purple-400"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                  animate={{
                    y: [0, -30, -60],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: 'easeOut'
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      )}
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </motion.div>
  );
};

// Interactive Input Component
interface InteractiveInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'search';
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const InteractiveInput: React.FC<InteractiveInputProps> = ({
  value,
  onChange,
  placeholder = '',
  type = 'text',
  className = '',
  onFocus,
  onBlur
}) => {
  const { triggerAnimation } = useAnimations();
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    setIsFocused(true);
    triggerAnimation('input-focus', { intensity: 'gentle' });
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    setIsTyping(false);
    onBlur?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsTyping(true);
    
    // Stop typing animation after a delay
    setTimeout(() => setIsTyping(false), 1000);
  };

  return (
    <div className={`relative ${className}`}>
      <motion.input
        ref={inputRef}
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3 rounded-xl
          bg-slate-800/50 backdrop-blur-lg
          border-2 border-slate-600/50
          text-white placeholder-slate-400
          focus:outline-none focus:ring-0
          transition-all duration-300 ease-out
          font-arcane
        `}
        animate={{
          borderColor: isFocused 
            ? 'rgba(139, 92, 246, 0.8)' 
            : 'rgba(100, 116, 139, 0.5)',
          boxShadow: isFocused 
            ? '0 0 20px rgba(139, 92, 246, 0.3)'
            : '0 0 0 rgba(139, 92, 246, 0)'
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Focus Indicator */}
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-purple-400/50 pointer-events-none"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: isFocused ? 1 : 0,
          scale: isFocused ? 1 : 0.95
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Typing Indicator */}
      <AnimatePresence>
        {isTyping && (
          <motion.div
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="w-2 h-2 bg-purple-400 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveButton;
