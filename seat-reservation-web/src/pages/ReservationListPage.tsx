import React from 'react';
import MainLayout from '../layouts/MainLayout';
import ReservationList from '../components/reservations/ReservationList';

const ReservationListPage: React.FC = () => {
  return (
    <MainLayout>
      <ReservationList />
    </MainLayout>
  );
};

export default ReservationListPage;
