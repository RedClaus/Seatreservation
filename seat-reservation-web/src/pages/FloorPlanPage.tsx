import React from 'react';
import MainLayout from '../layouts/MainLayout';
import FloorPlan from '../components/floorplan/FloorPlan';

const FloorPlanPage: React.FC = () => {
  return (
    <MainLayout>
      <FloorPlan />
    </MainLayout>
  );
};

export default FloorPlanPage;
