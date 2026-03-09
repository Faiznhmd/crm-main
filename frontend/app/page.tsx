'use client';

import FAQ from './dashboard/components/FAQ';
import Hero from './dashboard/components/Hero';
import RecentBookings from './dashboard/components/RecentBookings';
import Recommended from './dashboard/components/Recommended';
import Stats from './dashboard/components/Stat';
import Upcoming from './dashboard/components/Upcoming';

export default function Page() {
  return (
    <div>
      <Hero />
      <Stats />
      <RecentBookings />
      <Recommended />
      <Upcoming />
      <FAQ />
    </div>
  );
}
