import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, MapPin, Briefcase, DollarSign, Clock, Calendar, Building2, Send } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

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

const JobOffers = () => {
  const { toast } = useToast();
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [generalApplication, setGeneralApplication] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    fetchJobs();
  }, [selectedType, selectedLocation]);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (selectedType && selectedType !== 'all') {
        queryParams.append('type', selectedType);
      }
      if (selectedLocation && selectedLocation !== 'all') {
        queryParams.append('location', selectedLocation);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs?${queryParams.toString()}`
      );
      const data = await response.json();
      
      if (data.status === 'success') {
        setJobOffers(data.data);
      } else {
        console.error('Error fetching jobs:', data.message);
        setJobOffers([]);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobOffers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = (jobId: number) => {
    setSelectedJob(jobId);
    setApplicationData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!cvFile || !selectedJob) return;
    if (!applicationData.name || !applicationData.email) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    setUploadStatus('uploading');
    
    const formData = new FormData();
    formData.append('name', applicationData.name);
    formData.append('email', applicationData.email);
    
    if (applicationData.phone) {
      formData.append('phone', applicationData.phone);
    }
    
    if (applicationData.message) {
      formData.append('message', applicationData.message);
    }
    
    formData.append('cv', cvFile);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs/${selectedJob}/apply`,
        {
          method: 'POST',
          body: formData
        }
      );
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setUploadStatus('success');
        toast({
          title: "Application Submitted",
          description: "Your application has been submitted successfully!",
          variant: "default",
        });
        
        // Reset after 2 seconds
        setTimeout(() => {
          setUploadStatus('idle');
          setCvFile(null);
          setSelectedJob(null);
        }, 2000);
      } else {
        setUploadStatus('error');
        toast({
          title: "Error",
          description: data.message || "Failed to submit application",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setUploadStatus('error');
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleGeneralApplication = async () => {
    if (!generalApplication.name || !generalApplication.email) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', generalApplication.name);
    formData.append('email', generalApplication.email);
    
    if (generalApplication.phone) {
      formData.append('phone', generalApplication.phone);
    }
    
    if (generalApplication.message) {
      formData.append('message', generalApplication.message);
    }
    
    if (cvFile) {
      formData.append('cv', cvFile);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs/general-application`,
        {
          method: 'POST',
          body: formData
        }
      );
      
      const data = await response.json();
      
      if (data.status === 'success') {
        toast({
          title: "Application Submitted",
          description: "Thank you for your interest! We'll review your application soon.",
          variant: "default",
        });
        setGeneralApplication({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
        setCvFile(null);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to submit application",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting general application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* General Application Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">OUR JOB OFFERS</h2>
        <p className="text-gray-600 mb-4">
          No suitable job but still want to join us?
          We're always looking for talented, passionate individuals to join our team. 
          If you believe your skills and creativity can make a difference, we'd love to hear from you!
        </p>
        <h3 className="text-xl font-semibold text-blue-600 mb-4">
          Your dream job starts here!
        </h3>
        <p className="text-gray-600 mb-6">
          Take the first step and show us what makes you stand out.
          Show us what sets you apart and why you're the perfect fit for our company. 
          Send us your CV, and let's explore how we can work together to achieve great things.
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Send className="w-4 h-4 mr-2" />
              Apply Now
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>General Application</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={generalApplication.email}
                  onChange={(e) => setGeneralApplication({ ...generalApplication, email: e.target.value })}
                  placeholder="Enter your email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={generalApplication.name}
                  onChange={(e) => setGeneralApplication({ ...generalApplication, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={generalApplication.phone}
                  onChange={(e) => setGeneralApplication({ ...generalApplication, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Why should we hire you?</Label>
                <Textarea
                  id="message"
                  value={generalApplication.message}
                  onChange={(e) => setGeneralApplication({ ...generalApplication, message: e.target.value })}
                  placeholder="Tell us why you're the perfect fit for our team"
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cv">Upload your CV</Label>
                <Input
                  id="cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </div>
              <Button onClick={handleGeneralApplication}>
                Submit Application
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Full-time">Full-time</SelectItem>
            <SelectItem value="Part-time">Part-time</SelectItem>
            <SelectItem value="Contract">Contract</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="New York">New York</SelectItem>
            <SelectItem value="Remote">Remote</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Loading job offers...</p>
        </div>
      ) : jobOffers.length > 0 ? (
        <div className="grid gap-6">
          {jobOffers.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow max-w-2xl mx-auto w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-gray-600">Travelista</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.location}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    <Briefcase className="w-4 h-4 mr-1" />
                    {job.type}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Posted {new Date(job.posted_date).toLocaleDateString()}</span>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{job.description}</p>

              <div className="mb-4">
                <h4 className="font-semibold mb-2">Requirements:</h4>
                <ul className="list-disc list-inside text-gray-600">
                  {job.requirements.split('\n').map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full md:w-auto"
                    onClick={() => handleApply(job.id)}
                  >
                    Apply Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Apply for {job.title}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="appName">Full Name</Label>
                      <Input
                        id="appName"
                        type="text"
                        value={applicationData.name}
                        onChange={(e) => setApplicationData({ ...applicationData, name: e.target.value })}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="appEmail">Email</Label>
                      <Input
                        id="appEmail"
                        type="email"
                        value={applicationData.email}
                        onChange={(e) => setApplicationData({ ...applicationData, email: e.target.value })}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="appPhone">Phone</Label>
                      <Input
                        id="appPhone"
                        type="tel"
                        value={applicationData.phone}
                        onChange={(e) => setApplicationData({ ...applicationData, phone: e.target.value })}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="appMessage">Cover Message</Label>
                      <Textarea
                        id="appMessage"
                        value={applicationData.message}
                        onChange={(e) => setApplicationData({ ...applicationData, message: e.target.value })}
                        placeholder="Briefly tell us why you're interested in this position"
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cv">Upload your CV</Label>
                      <Input
                        id="cv"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        required
                      />
                      <p className="text-xs text-gray-500">PDF, DOC, or DOCX (max 5MB)</p>
                    </div>
                    {uploadStatus === 'success' && (
                      <div className="text-green-600 text-sm">
                        CV uploaded successfully!
                      </div>
                    )}
                    {uploadStatus === 'error' && (
                      <div className="text-red-600 text-sm">
                        Error uploading CV. Please try again.
                      </div>
                    )}
                    <Button 
                      onClick={handleUpload}
                      disabled={!cvFile || uploadStatus === 'uploading'}
                    >
                      {uploadStatus === 'uploading' ? 'Uploading...' : 'Submit Application'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Building2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Suitable Jobs Found</h3>
          <p className="text-gray-600">
            We couldn't find any jobs matching your criteria. Please try adjusting your filters or check back later.
          </p>
        </div>
      )}
    </div>
  );
};

export default JobOffers; 