import React from 'react';
import MainLayout from '../layouts/MainLayout';
import Profile from '../components/profile/Profile';

const ProfilePage: React.FC = () => {
  return (
    <MainLayout>
      <Profile />
    </MainLayout>
  );
};

export default ProfilePage;
