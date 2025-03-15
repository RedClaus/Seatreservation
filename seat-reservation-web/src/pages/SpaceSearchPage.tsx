import React from 'react';
import MainLayout from '../layouts/MainLayout';
import SpaceSearch from '../components/spaces/SpaceSearch';

const SpaceSearchPage: React.FC = () => {
  return (
    <MainLayout>
      <SpaceSearch />
    </MainLayout>
  );
};

export default SpaceSearchPage;
