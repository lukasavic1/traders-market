"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

interface UserProfile {
  firstName: string;
  lastName: string;
  location: string;
  dateOfBirth: string;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Profile form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [location, setLocation] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Loading and message states
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  // Access status state
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'inactive'>('inactive');
  const [isActivating, setIsActivating] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [activationMessage, setActivationMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Store original values for canceling
  const [originalProfile, setOriginalProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    location: '',
    dateOfBirth: '',
  });

  // Load user profile data and access status from Firestore
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            
            // Load profile data
            const profileData = {
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              location: data.location || '',
              dateOfBirth: data.dateOfBirth || '',
            };
            setFirstName(profileData.firstName);
            setLastName(profileData.lastName);
            setLocation(profileData.location);
            setDateOfBirth(profileData.dateOfBirth);
            setOriginalProfile(profileData);

            // Load access status
            setSubscriptionStatus(data.accessStatus || 'inactive');
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        } finally {
          setIsLoadingStatus(false);
        }
      }
    };

    loadUserData();
  }, [user]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSavingProfile(true);
    setProfileMessage(null);

    try {
      // Save profile data to Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const profileData: UserProfile = {
        firstName,
        lastName,
        location,
        dateOfBirth,
      };
      
      await setDoc(userDocRef, profileData, { merge: true });

      // Update Firebase Auth displayName
      if (auth.currentUser) {
        const displayName = `${firstName} ${lastName}`.trim() || null;
        await updateProfile(auth.currentUser, { displayName });
      }

      // Update original profile state
      setOriginalProfile(profileData);

      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditingProfile(false);

      // Clear success message after 5 seconds
      setTimeout(() => setProfileMessage(null), 5000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setProfileMessage({ 
        type: 'error', 
        text: 'Failed to update profile. Please try again.' 
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    // Restore original values
    setFirstName(originalProfile.firstName);
    setLastName(originalProfile.lastName);
    setLocation(originalProfile.location);
    setDateOfBirth(originalProfile.dateOfBirth);
    setIsEditingProfile(false);
    setProfileMessage(null);
  };

  const handleActivateAccess = async () => {
    if (!user) return;

    setIsActivating(true);
    setActivationMessage(null);

    try {
      // Update access status in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { accessStatus: 'active' }, { merge: true });

      // Update local state
      setSubscriptionStatus('active');

      // Show success message
      setActivationMessage({ 
        type: 'success', 
        text: 'Access activated successfully! You now have full access to all premium features.' 
      });

      // Clear success message after 5 seconds
      setTimeout(() => setActivationMessage(null), 5000);
    } catch (error) {
      console.error('Error activating access:', error);
      setActivationMessage({ 
        type: 'error', 
        text: 'Failed to activate access. Please try again or contact support.' 
      });
    } finally {
      setIsActivating(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user || !user.email) return;

    // Reset errors
    setPasswordErrors({});
    setPasswordMessage(null);

    // Validation
    const errors: typeof passwordErrors = {};

    if (!currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!newPassword) {
      errors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setIsUpdatingPassword(true);

    try {
      // Reauthenticate user with current password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      
      if (auth.currentUser) {
        await reauthenticateWithCredential(auth.currentUser, credential);
        
        // Update password
        await updatePassword(auth.currentUser, newPassword);

        setPasswordMessage({ 
          type: 'success', 
          text: 'Password updated successfully!' 
        });
        
        setIsChangingPassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');

        // Clear success message after 5 seconds
        setTimeout(() => setPasswordMessage(null), 5000);
      }
    } catch (error: any) {
      console.error('Error updating password:', error);
      
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setPasswordErrors({ 
          currentPassword: 'Current password is incorrect' 
        });
      } else if (error.code === 'auth/weak-password') {
        setPasswordErrors({ 
          newPassword: 'Password is too weak' 
        });
      } else {
        setPasswordMessage({ 
          type: 'error', 
          text: 'Failed to update password. Please try again.' 
        });
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl border border-blue-600/25 bg-gradient-to-br from-blue-950/30 via-[#0f1f4a]/25 to-blue-900/20 p-8 shadow-2xl backdrop-blur-sm">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600/20 via-blue-700/20 to-blue-600/20 blur-xl" />
          
          <div className="relative">
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome to Your Dashboard
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Hello, {user.displayName || user.email}!
            </p>

            {/* Profile Card */}
            <div className="mb-8 rounded-xl border border-blue-600/30 bg-gradient-to-br from-blue-950/40 to-blue-900/30 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-white">Profile</h2>
                </div>
                {!isEditingProfile && (
                  <button
                    onClick={() => {
                      setIsEditingProfile(true);
                      setProfileMessage(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-blue-600/20 border border-blue-600/30 text-blue-400 hover:bg-blue-600/30 transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Success/Error Messages */}
              {profileMessage && (
                <div className={`mb-6 p-4 rounded-lg border ${
                  profileMessage.type === 'success'
                    ? 'bg-green-500/10 border-green-500/50 text-green-400'
                    : 'bg-red-500/10 border-red-500/50 text-red-400'
                } animate-fade-in`}>
                  <div className="flex items-center gap-2">
                    {profileMessage.type === 'success' ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className="font-medium">{profileMessage.text}</span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {/* Email (read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <div className="w-full rounded-lg border border-blue-600/30 bg-blue-950/30 px-4 py-3 text-gray-500">
                    {user.email}
                  </div>
                </div>

                {/* First Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={!isEditingProfile}
                      placeholder="Enter first name"
                      className="w-full rounded-lg border border-blue-600/30 bg-blue-950/30 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={!isEditingProfile}
                      placeholder="Enter last name"
                      className="w-full rounded-lg border border-blue-600/30 bg-blue-950/30 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={!isEditingProfile}
                    placeholder="Enter location (e.g., New York, USA)"
                    className="w-full rounded-lg border border-blue-600/30 bg-blue-950/30 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    onKeyDown={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                    disabled={!isEditingProfile}
                    className="w-full rounded-lg border border-blue-600/30 bg-blue-950/30 px-4 py-3 text-white focus:border-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                  <p className="mt-1 text-xs text-gray-500">Click the calendar icon to select a date</p>
                </div>

                {/* Save/Cancel buttons */}
                {isEditingProfile && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSavingProfile}
                      className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSavingProfile ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSavingProfile}
                      className="px-6 py-2 rounded-lg bg-gray-600/20 border border-gray-600/30 text-gray-300 hover:bg-gray-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Change Password Section */}
                <div className="pt-6 border-t border-blue-600/20">
                  {/* Success/Error Messages for Password */}
                  {passwordMessage && (
                    <div className={`mb-4 p-4 rounded-lg border ${
                      passwordMessage.type === 'success'
                        ? 'bg-green-500/10 border-green-500/50 text-green-400'
                        : 'bg-red-500/10 border-red-500/50 text-red-400'
                    } animate-fade-in`}>
                      <div className="flex items-center gap-2">
                        {passwordMessage.type === 'success' ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        <span className="font-medium">{passwordMessage.text}</span>
                      </div>
                    </div>
                  )}

                  {!isChangingPassword ? (
                    <button
                      onClick={() => {
                        setIsChangingPassword(true);
                        setPasswordMessage(null);
                        setPasswordErrors({});
                      }}
                      className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      Change Password
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => {
                            setCurrentPassword(e.target.value);
                            if (passwordErrors.currentPassword) {
                              setPasswordErrors({ ...passwordErrors, currentPassword: undefined });
                            }
                          }}
                          disabled={isUpdatingPassword}
                          placeholder="Enter current password"
                          className={`w-full rounded-lg border ${
                            passwordErrors.currentPassword ? 'border-red-500/60' : 'border-blue-600/30'
                          } bg-blue-950/30 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
                        />
                        {passwordErrors.currentPassword && (
                          <p className="mt-1 text-sm text-red-400">{passwordErrors.currentPassword}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            if (passwordErrors.newPassword) {
                              setPasswordErrors({ ...passwordErrors, newPassword: undefined });
                            }
                          }}
                          disabled={isUpdatingPassword}
                          placeholder="Enter new password (min. 6 characters)"
                          className={`w-full rounded-lg border ${
                            passwordErrors.newPassword ? 'border-red-500/60' : 'border-blue-600/30'
                          } bg-blue-950/30 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
                        />
                        {passwordErrors.newPassword && (
                          <p className="mt-1 text-sm text-red-400">{passwordErrors.newPassword}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (passwordErrors.confirmPassword) {
                              setPasswordErrors({ ...passwordErrors, confirmPassword: undefined });
                            }
                          }}
                          disabled={isUpdatingPassword}
                          placeholder="Confirm new password"
                          className={`w-full rounded-lg border ${
                            passwordErrors.confirmPassword ? 'border-red-500/60' : 'border-blue-600/30'
                          } bg-blue-950/30 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
                        />
                        {passwordErrors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-400">{passwordErrors.confirmPassword}</p>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleChangePassword}
                          disabled={isUpdatingPassword}
                          className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isUpdatingPassword ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Updating...</span>
                            </>
                          ) : (
                            'Update Password'
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setIsChangingPassword(false);
                            setCurrentPassword('');
                            setNewPassword('');
                            setConfirmPassword('');
                            setPasswordErrors({});
                            setPasswordMessage(null);
                          }}
                          disabled={isUpdatingPassword}
                          className="px-6 py-2 rounded-lg bg-gray-600/20 border border-gray-600/30 text-gray-300 hover:bg-gray-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Access Status Section - Centered & Emphasized */}
            <div className="mt-12 mb-8">
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent mb-8">
                Access Status
              </h2>

              {/* Activation Success/Error Message */}
              {activationMessage && (
                <div className={`max-w-3xl mx-auto mb-6 p-4 rounded-lg border ${
                  activationMessage.type === 'success'
                    ? 'bg-green-500/10 border-green-500/50 text-green-400'
                    : 'bg-red-500/10 border-red-500/50 text-red-400'
                } animate-fade-in`}>
                  <div className="flex items-center gap-3">
                    {activationMessage.type === 'success' ? (
                      <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <span className="font-medium">{activationMessage.text}</span>
                  </div>
                </div>
              )}
              
              <div className="max-w-3xl mx-auto">
                {/* Loading State */}
                {isLoadingStatus ? (
                  <div className="relative rounded-2xl border-[3px] border-blue-500/50 bg-gradient-to-br from-blue-950/40 via-[#0f172a]/95 to-blue-900/30 p-12 backdrop-blur-sm shadow-2xl">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-gray-400 text-lg">Loading access status...</p>
                    </div>
                  </div>
                ) : (
                  /* Unified Access Card - Blue Accent */
                  <div className="group relative transition-all duration-300">
                    {/* Enhanced outer glow - Always Blue */}
                    <div className="absolute -inset-2 rounded-2xl blur-xl transition duration-500 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 opacity-50"></div>
                  
                  <div className="relative rounded-2xl border-[3px] p-8 backdrop-blur-sm transition-all duration-300 shadow-2xl border-blue-500/50 bg-gradient-to-br from-blue-950/40 via-[#0f172a]/95 to-blue-900/30 hover:border-blue-500/70 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.01]">
                    {/* Decorative top accent line - Always Blue */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 rounded-b-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

                    {/* Status Badge - Changes Color Based on Status */}
                    <div className="absolute top-6 right-6">
                      {subscriptionStatus === 'active' ? (
                        <div className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500/40 to-emerald-600/40 border-2 border-green-500/60 flex items-center gap-2 shadow-lg shadow-green-500/20">
                          <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50"></div>
                          <span className="text-sm font-bold text-green-300 uppercase tracking-wider">Active</span>
                        </div>
                      ) : (
                        <div className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/30 to-blue-700/30 border-2 border-blue-600/50 flex items-center gap-2 shadow-lg shadow-blue-600/20">
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                          <span className="text-sm font-bold text-blue-400 uppercase tracking-wider">Inactive</span>
                        </div>
                      )}
                    </div>

                    {/* Icon - Always Blue */}
                    <div className="mb-6 inline-flex p-4 rounded-xl shadow-lg bg-blue-600/30 shadow-blue-500/20">
                      <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>

                    {/* Content - Always Same */}
                    <h3 className="text-3xl font-bold text-white mb-3">
                      Premium Access
                    </h3>
                    <p className="text-base mb-8 text-blue-400/90">
                      Full access to all trading bots and premium features
                    </p>

                    {/* Features List - Always Blue */}
                    <div className="space-y-4 mb-8">
                      {[
                        'Access to 10+ Trading Bots',
                        'Premium Strategy Arsenal',
                        'Priority Support',
                        'Regular Updates & New Bots',
                        'Advanced Risk Management'
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-blue-500/20 border border-blue-500/40">
                            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-base text-gray-200 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Footer with Button */}
                    <div className="pt-6 border-t-2 border-blue-500/30">
                      <button
                        onClick={subscriptionStatus === 'active' ? undefined : handleActivateAccess}
                        disabled={subscriptionStatus === 'active' || isActivating}
                        className={`w-full py-4 px-8 rounded-xl text-white text-lg font-bold transition-all duration-300 flex items-center justify-center gap-3 ${
                          subscriptionStatus === 'active'
                            ? 'bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 hover:from-blue-500 hover:via-blue-600 hover:to-blue-500 hover:shadow-2xl hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none'
                        }`}
                      >
                        {subscriptionStatus === 'active' ? (
                          <>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Activated</span>
                          </>
                        ) : isActivating ? (
                          <>
                            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Activating...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span>Activate Access</span>
                          </>
                        )}
                      </button>
                      <p className="text-center text-blue-400/80 text-sm mt-4 font-medium">
                        Get full access to all premium features
                      </p>
                    </div>
                  </div>
                </div>
                )}
              </div>
            </div>

            {/* Account Information */}
            <div className="mt-8 rounded-xl border border-blue-600/30 bg-gradient-to-br from-blue-950/40 to-blue-900/30 p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Account Information</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-blue-600/20">
                  <span className="text-gray-400">Email</span>
                  <span className="text-white font-medium">{user.email}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-blue-600/20">
                  <span className="text-gray-400">Access Status</span>
                  <span className={`font-medium flex items-center gap-2 ${
                    subscriptionStatus === 'active' ? 'text-green-400' : 'text-blue-500'
                  }`}>
                    {subscriptionStatus === 'active' ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50"></div>
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                        <span>Inactive</span>
                      </>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-400">Account Created</span>
                  <span className="text-white font-medium">
                    {user.metadata.creationTime 
                      ? new Date(user.metadata.creationTime).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
