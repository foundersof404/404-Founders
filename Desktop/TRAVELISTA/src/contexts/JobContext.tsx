import React, { createContext, useContext, useState, ReactNode } from 'react';

interface JobOffer {
  id: number;
  title: string;
  description: string;
  requirements: string;
  location: string;
  salary: string;
  type: string;
  postedDate: string;
}

interface JobContextType {
  jobOffers: JobOffer[];
  addJobOffer: (job: Omit<JobOffer, 'id' | 'postedDate'>) => void;
  updateJobOffer: (id: number, job: Partial<JobOffer>) => void;
  deleteJobOffer: (id: number) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

const initialJobOffers: JobOffer[] = [
  {
    id: 1,
    title: "Senior Travel Consultant",
    description: "We are looking for an experienced travel consultant to join our team.",
    requirements: "5+ years of experience in travel industry, excellent communication skills",
    location: "New York, USA",
    salary: "$60,000 - $80,000",
    type: "Full-time",
    postedDate: "2024-03-15"
  },
  {
    id: 2,
    title: "Customer Service Representative",
    description: "Join our customer service team to help travelers with their bookings.",
    requirements: "2+ years of customer service experience, multilingual preferred",
    location: "Remote",
    salary: "$40,000 - $50,000",
    type: "Full-time",
    postedDate: "2024-03-14"
  }
];

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobOffers, setJobOffers] = useState<JobOffer[]>(initialJobOffers);

  const addJobOffer = (job: Omit<JobOffer, 'id' | 'postedDate'>) => {
    const newId = Math.max(...jobOffers.map(j => j.id), 0) + 1;
    const newJob: JobOffer = {
      ...job,
      id: newId,
      postedDate: new Date().toISOString().split('T')[0]
    };
    setJobOffers([...jobOffers, newJob]);
  };

  const updateJobOffer = (id: number, job: Partial<JobOffer>) => {
    setJobOffers(jobOffers.map(j => j.id === id ? { ...j, ...job } : j));
  };

  const deleteJobOffer = (id: number) => {
    setJobOffers(jobOffers.filter(j => j.id !== id));
  };

  return (
    <JobContext.Provider value={{ jobOffers, addJobOffer, updateJobOffer, deleteJobOffer }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
}; 