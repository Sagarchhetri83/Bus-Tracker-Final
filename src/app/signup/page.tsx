'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Bus, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { auth, rtdb } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';

export default function SignupPage() {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [formData, setFormData] = useState({
    role: 'user',
    phone: '+91 ',
    fullName: '',
    username: '',
    password: ''
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [isGoogleSignup, setIsGoogleSignup] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLoginInputChange = (field: string, value: string) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
  };

  const saveUserToDatabase = async (uid: string, userData: any, userEmail: string) => {
    try {
      const userRef = ref(rtdb, `users/${uid}`);
      await set(userRef, {
        uid,
        role: userData.role,
        fullName: userData.fullName,
        username: userData.username,
        email: userEmail,
        phone: userData.phone,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving user to database:', error);
      throw new Error('Failed to save user data');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName.trim() || !formData.username.trim() || !formData.password) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Password Error',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create user with Firebase Auth
      const email = `${formData.username}@bustracker.com`;
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        email, 
        formData.password
      );

      const user = userCredential.user;

      // Update user profile with display name
      await updateProfile(user, {
        displayName: formData.fullName
      });

      // Save user data to Realtime Database
      await saveUserToDatabase(user.uid, formData, user.email || email);

      // Store user data in localStorage for immediate access
      localStorage.setItem('userData', JSON.stringify({
        uid: user.uid,
        role: formData.role,
        fullName: formData.fullName,
        username: formData.username,
        email: user.email || email
      }));

      toast({
        title: 'Account Created Successfully!',
        description: `Welcome to Bus Tracker, ${formData.fullName}!`,
      });

      // Redirect based on role
      console.log('Signup role:', formData.role, 'Redirecting to appropriate dashboard...');
      if (formData.role === 'driver') {
        console.log('Redirecting driver to /driver-dashboard');
        router.push('/driver-dashboard');
      } else {
        console.log('Redirecting user to /home');
        router.push('/home');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      
      let errorMessage = 'Something went wrong. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Username already exists. Please choose a different one.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      }

      toast({
        title: 'Signup Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast({
        title: 'Validation Error',
        description: 'Please enter both email and password.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        loginData.email, 
        loginData.password
      );

      const user = userCredential.user;

      // Fetch user role from Realtime Database
      const userRef = ref(rtdb, `users/${user.uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        
        // Store user data in localStorage
        localStorage.setItem('userData', JSON.stringify({
          uid: user.uid,
          role: userData.role,
          fullName: userData.fullName,
          username: userData.username,
          email: user.email
        }));

        // Update last login time
        await set(ref(rtdb, `users/${user.uid}/lastLogin`), new Date().toISOString());

        toast({
          title: 'Login Successful!',
          description: `Welcome back, ${userData.fullName}!`,
        });

        // Redirect based on role
        console.log('User role:', userData.role, 'Redirecting to appropriate dashboard...');
        if (userData.role === 'driver') {
          console.log('Redirecting driver to /driver-dashboard');
          router.push('/driver-dashboard');
        } else if (userData.role === 'admin') {
          console.log('Redirecting admin to /admin');
          router.push('/admin');
        } else {
          console.log('Redirecting user to /home');
          router.push('/home');
        }
      } else {
        // Fallback for users without role data
        toast({
          title: 'Login Successful!',
          description: 'Welcome back to Bus Tracker!',
        });
        router.push('/home');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Invalid credentials. Please try again.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with these credentials.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format.';
      }

      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userRef = ref(rtdb, 'users/' + user.uid);

      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        // Existing user, handle login
        const userData = snapshot.val();
        console.log("Existing user logged in:", userData);
        
        // Store user data in localStorage
        localStorage.setItem('userData', JSON.stringify({
          uid: user.uid,
          role: userData.role,
          fullName: userData.fullName || user.displayName,
          username: userData.username || (user.email ? user.email.split('@')[0] : ''),
          email: user.email
        }));

        // Update last login
        await set(ref(rtdb, `users/${user.uid}/lastLogin`), new Date().toISOString());

        toast({
          title: 'Login Successful!',
          description: `Welcome back, ${userData.fullName || user.displayName}!`,
        });

        // Redirect based on role
        if (userData.role === 'admin') {
          router.push('/admin');
        } else if (userData.role === 'driver') {
          router.push('/driver-dashboard');
        } else {
          router.push('/home');
        }
      } else {
        // New user, prompt for additional details
        setIsGoogleSignup(true);
        setFormData(prev => ({
          ...prev,
          fullName: user.displayName || '',
          username: user.email ? user.email.split('@')[0] : '',
        }));
        
        toast({
          title: 'Google Sign-in Successful!',
          description: 'Please complete your profile to continue.',
        });
      }
    } catch (error: any) {
      console.error('Google Sign-in error:', error);
      
      let errorMessage = 'Google sign-in failed. Please try again.';
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in was cancelled.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Pop-up was blocked. Please allow pop-ups for this site.';
      }

      toast({
        title: 'Google Sign-in Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.username.trim() || !formData.phone.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields for Google signup.',
        variant: 'destructive',
      });
      return;
    }

    const email = `${formData.username}@bustracker.com`;

    setIsLoading(true);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No authenticated user found for Google signup completion.");
      }

      // Check if user already exists
      const userRef = ref(rtdb, 'users/' + currentUser.uid);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        toast({
          title: 'Error',
          description: 'User already exists.',
          variant: 'destructive',
        });
        return;
      }

      // Save user data to Realtime Database
      await saveUserToDatabase(currentUser.uid, formData, currentUser.email || email);
      
      // Update user profile with display name
      await updateProfile(currentUser, {
        displayName: formData.fullName
      });

      // Store user data in localStorage for immediate access
      localStorage.setItem('userData', JSON.stringify({
        uid: currentUser.uid,
        role: formData.role,
        fullName: formData.fullName,
        username: formData.username,
        email: currentUser.email || email
      }));

      toast({
        title: 'Google Signup Successful!',
        description: `Welcome to Bus Tracker, ${formData.fullName}!`,
      });

      console.log('Google signup role:', formData.role, 'Redirecting to appropriate dashboard...');
      if (formData.role === 'driver') {
        console.log('Redirecting driver to /driver-dashboard');
        router.push('/driver-dashboard');
      } else {
        console.log('Redirecting user to /home');
        router.push('/home');
      }
    } catch (error: any) {
      console.error('Google Signup error:', error);
      
      let errorMessage = 'Something went wrong. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Username already exists. Please choose a different one.';
      }
      
      toast({
        title: 'Google Signup Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setIsGoogleSignup(false);
    setFormData({
      role: 'user',
      phone: '+91 ',
      fullName: '',
      username: '',
      password: ''
    });
    setLoginData({ email: '', password: '' });
  };

  // If this is a Google signup completion, show the form
  if (isGoogleSignup) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-b from-blue-600 to-cyan-400 p-8 text-white text-center">
            <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
            <p className="text-lg opacity-90">Please provide additional details to complete your registration</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleGoogleSignup} className="space-y-6">
              

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="googlePhone" className="text-sm font-medium text-gray-700">Phone number *</Label>
                <div className="flex">
                  <div className="flex items-center gap-2 px-3 py-2 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 min-w-[100px]">
                    <span className="text-lg">🇮🇳</span>
                    <span className="text-sm font-medium">+91</span>
                  </div>
                  <Input
                    id="googlePhone"
                    type="tel"
                    value={formData.phone.replace('+91 ', '')}
                    onChange={(e) => {
                      const phoneNumber = e.target.value;
                      setFormData(prev => ({ 
                        ...prev, 
                        phone: `+91 ${phoneNumber}` 
                      }));
                    }}
                    placeholder="Enter phone number"
                    className="rounded-l-none border-l-0"
                    required
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="googleUsername" className="text-sm font-medium text-gray-700">Username *</Label>
                <Input
                  id="googleUsername"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Choose a username"
                  required
                />
              </div>
              
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="googleFullName" className="text-sm font-medium text-gray-700">Full Name *</Label>
                <Input
                  id="googleFullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Continue Button */}
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
                disabled={isLoading}
              >
                {isLoading ? 'Completing Profile...' : 'Complete Profile'}
              </Button>

              {/* Back to Signup */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsGoogleSignup(false);
                    auth.signOut();
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Back to Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {/* Main Container */}
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          
          {/* Left Panel - Blue Gradient */}
          <div className="lg:w-1/2 bg-gradient-to-b from-blue-600 to-cyan-400 p-8 text-white relative">
            {/* Top-left Logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Bus className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xl font-bold">Bus Tracker</span>
            </div>

            {/* Call to Action */}
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
              <span className="text-sm">
                {isLoginMode ? 'Welcome Back! 🚌' : 'Join Us to Ride 🚌'}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl font-bold mb-4">
              {isLoginMode ? 'Welcome Back' : 'Start your Journey'}
            </h1>
            <p className="text-lg opacity-90 mb-12">
              {isLoginMode 
                ? 'Access your account and continue tracking buses in real-time.'
                : 'Follow these simple steps to set up your account.'
              }
            </p>

            {/* Steps - Only show for signup mode */}
            {!isLoginMode && (
              <div className="flex gap-4">
                <div className="bg-white text-blue-600 rounded-2xl p-4 flex-1 relative">
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <p className="text-sm font-medium mt-4">Register your account</p>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex-1 relative">
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <p className="text-sm font-medium mt-4">Personalize your experience</p>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex-1 relative">
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <p className="text-sm font-medium mt-4">Explore bus routes</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - White Form */}
          <div className="lg:w-1/2 bg-white p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {isLoginMode ? 'Welcome Back' : 'Join Us'}
            </h2>
            
            {isLoginMode ? (
              // Login Form
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="loginEmail" className="text-sm font-medium text-gray-700">Email or Username</Label>
                  <Input
                    id="loginEmail"
                    type="text"
                    placeholder="Enter your email or username"
                    value={loginData.email}
                    onChange={(e) => handleLoginInputChange('email', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loginPassword" className="text-sm font-medium text-gray-700">Password</Label>
                  <div className="relative">
                    <Input
                      id="loginPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => handleLoginInputChange('password', e.target.value)}
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>

                                 {/* Google Sign In */}
                 <Button 
                   type="button" 
                   variant="outline" 
                   className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl shadow-sm"
                   onClick={handleGoogleSignIn}
                   disabled={isLoading}
                 >
                   <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                     G
                   </div>
                   Sign in with Google
                 </Button>

                {/* Toggle to Signup */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Don't have an account? Sign up
                  </button>
                </div>
              </form>
            ) : (
              // Signup Form
              <form onSubmit={handleSubmit} className="space-y-6">
                

                {/* Phone Number with India Flag */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone number</Label>
                  <div className="relative">
                    <div className="flex">
                      {/* India Country Code Display */}
                      <div className="flex items-center gap-2 px-3 py-2 border border-r-0 border-gray-100 rounded-l-lg bg-gray-50 min-w-[100px]">
                        <span className="text-lg">🇮🇳</span>
                        <span className="text-sm font-medium text-gray-900">+91</span>
                      </div>
                      
                      {/* Phone Input */}
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone.replace('+91 ', '')}
                        onChange={(e) => {
                          const phoneNumber = e.target.value;
                          setFormData(prev => ({ 
                            ...prev, 
                            phone: `+91 ${phoneNumber}` 
                          }));
                        }}
                        placeholder="Enter phone number"
                        className="rounded-l-none border-l-0 dark:bg-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-gray-700">Username *</Label>
                  <div className="relative">
                    <Input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="Choose a username"
                      className="pr-10"
                      required
                    />
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Create a strong password"
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    At least 6 characters required.
                  </p>
                </div>

                {/* Continue Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Continue'}
                </Button>

                                 {/* Google Sign Up - More Prominent */}
                 <Button 
                   type="button" 
                   variant="outline" 
                   className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-medium shadow-sm"
                   onClick={handleGoogleSignIn}
                   disabled={isLoading}
                 >
                   <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                     G
                   </div>
                   Sign up with Google
                 </Button>

                {/* Toggle to Login */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Already have an account? Log in
                  </button>
                </div>

                {/* Legal Text */}
                <p className="text-xs text-gray-500 text-center">
                  By signing up I confirm that I carefully have read and agree to the{' '}
                  <a href="#" className="text-blue-600 hover:underline">Bus Tracker Privacy Policy</a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}