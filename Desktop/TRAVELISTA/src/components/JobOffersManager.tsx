import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Save, X, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface JobOffer {
  id: number;
  title: string;
  description: string;
  requirements: string;
  location: string;
  salary: string;
  type: string;
  posted_date: string;
}

const JobOffersManager: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [newJobOffer, setNewJobOffer] = useState<Partial<JobOffer>>({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary: '',
    type: 'Full-time'
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch jobs",
        variant: "destructive",
      });
    }
  };

  const handleAddJobOffer = async () => {
    if (!newJobOffer.title || !newJobOffer.description || !newJobOffer.requirements || 
        !newJobOffer.location || !newJobOffer.salary || !newJobOffer.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(newJobOffer)
      });

      if (!response.ok) throw new Error('Failed to add job');

      const addedJob = await response.json();
      setJobs([addedJob, ...jobs]);
      setNewJobOffer({
        title: '',
        description: '',
        requirements: '',
        location: '',
        salary: '',
        type: 'Full-time'
      });
      setIsEditing(null);

      toast({
        title: "Job offer added",
        description: "New job offer has been added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add job offer",
        variant: "destructive",
      });
    }
  };

  const handleEditJobOffer = (id: number) => {
    const jobToEdit = jobs.find(job => job.id === id);
    if (jobToEdit) {
      setNewJobOffer({
        title: jobToEdit.title,
        description: jobToEdit.description,
        requirements: jobToEdit.requirements,
        location: jobToEdit.location,
        salary: jobToEdit.salary,
        type: jobToEdit.type
      });
      setIsEditing(id);
    }
  };

  const handleSaveJobOffer = async (id: number) => {
    if (!newJobOffer.title || !newJobOffer.description || !newJobOffer.requirements || 
        !newJobOffer.location || !newJobOffer.salary) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(newJobOffer)
      });

      if (!response.ok) throw new Error('Failed to update job');

      const updatedJob = await response.json();
      setJobs(jobs.map(job => job.id === id ? updatedJob : job));
      setIsEditing(null);
      setNewJobOffer({
        title: '',
        description: '',
        requirements: '',
        location: '',
        salary: '',
        type: 'Full-time'
      });

      toast({
        title: "Job offer updated",
        description: "Job offer has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update job offer",
        variant: "destructive",
      });
    }
  };

  const handleDeleteJobOffer = async (id: number) => {
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete job');

      setJobs(jobs.filter(job => job.id !== id));
      toast({
        title: "Job offer deleted",
        description: "Job offer has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete job offer",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">Job Offers</h2>
        <Button onClick={() => setIsEditing(-1)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Job Offer
        </Button>
      </div>

      {/* Add/Edit Job Offer Form */}
      {isEditing !== null && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-medium mb-4">
            {isEditing === -1 ? 'Add New Job Offer' : 'Edit Job Offer'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={newJobOffer.title}
                onChange={(e) => setNewJobOffer({ ...newJobOffer, title: e.target.value })}
                placeholder="Enter job title"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={newJobOffer.location}
                onChange={(e) => setNewJobOffer({ ...newJobOffer, location: e.target.value })}
                placeholder="Enter location"
              />
            </div>
            <div>
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                value={newJobOffer.salary}
                onChange={(e) => setNewJobOffer({ ...newJobOffer, salary: e.target.value })}
                placeholder="Enter salary range"
              />
            </div>
            <div>
              <Label htmlFor="type">Job Type</Label>
              <select
                id="type"
                value={newJobOffer.type}
                onChange={(e) => setNewJobOffer({ ...newJobOffer, type: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newJobOffer.description}
                onChange={(e) => setNewJobOffer({ ...newJobOffer, description: e.target.value })}
                placeholder="Enter job description"
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                value={newJobOffer.requirements}
                onChange={(e) => setNewJobOffer({ ...newJobOffer, requirements: e.target.value })}
                placeholder="Enter job requirements"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            {isEditing && (
              <Button variant="outline" onClick={() => {
                setIsEditing(null);
                setNewJobOffer({
                  title: '',
                  description: '',
                  requirements: '',
                  location: '',
                  salary: '',
                  type: 'Full-time'
                });
              }}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            )}
            <Button onClick={() => isEditing === -1 ? handleAddJobOffer() : handleSaveJobOffer(isEditing)}>
              {isEditing === -1 ? (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Job Offer
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Job Offers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posted Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{job.title}</div>
                    <div className="text-sm text-gray-500">{job.salary}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(job.posted_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditJobOffer(job.id)}
                        title="Edit job offer"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteJobOffer(job.id)}
                        title="Delete job offer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JobOffersManager; 