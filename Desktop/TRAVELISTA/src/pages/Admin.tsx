import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, MapPin, Briefcase, MessageSquare, Building2, FileText, Download, Edit, Trash2, Plus, Save, Eye, Mail, Phone, Calendar, MapPinIcon, Star, Globe, Heart, Trophy, Image, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ADMIN_API_URL = 'http://localhost:5003/api/admin';

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

interface PopularDestination {
  id: number;
  country: string;
  name: string;
  image: string;
  description: string;
  rating: number;
}

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

interface JobOffer {
  id: number;
  title: string;
  description: string;
  requirements: string;
  location: string;
  salary: string;
  type: string;
  created_at: string;
}

interface JobApplication {
  id: number;
  job_id: number;
  job_title: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  cv_path: string;
  status: string;
  created_at: string;
}

interface CompanyValue {
  id: number;
  title: string;
  description: string;
  icon: string;
  display_order: number;
}

interface CompanyStory {
  id: number;
  title: string;
  content: string;
  image: string;
  short_description: string;
}

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image_path: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  user: {
    name: string;
    email: string;
  };
  created_at: string;
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [destinations, setDestinations] = useState<PopularDestination[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [companyValues, setCompanyValues] = useState<CompanyValue[]>([]);
  const [companyStory, setCompanyStory] = useState<CompanyStory | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [editJob, setEditJob] = useState<JobOffer | null>(null);
  const [addJobOpen, setAddJobOpen] = useState(false);
  const [newJob, setNewJob] = useState<Omit<JobOffer, 'id' | 'created_at'>>({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary: '',
    type: '',
  });
  const [editDestination, setEditDestination] = useState<PopularDestination | null>(null);
  const [replyMessageId, setReplyMessageId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  // Fetch all data from backend
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        // Users
        const usersRes = await fetch(`${ADMIN_API_URL}/users`);
        const usersData = await usersRes.json();
        setUsers(usersData);
        // Destinations
        const destRes = await fetch(`${ADMIN_API_URL}/destinations`);
        const destData = await destRes.json();
        setDestinations(destData);
        // Contact Messages
        const msgRes = await fetch(`${ADMIN_API_URL}/messages`);
        const msgData = await msgRes.json();
        setContactMessages(msgData);
        // Job Offers
        const jobsRes = await fetch(`${ADMIN_API_URL}/jobs`);
        const jobsData = await jobsRes.json();
        setJobOffers(jobsData);
        // Job Applications
        const appsRes = await fetch(`${ADMIN_API_URL}/applications`);
        const appsData = await appsRes.json();
        setJobApplications(appsData);
        // Company Values
        const valuesRes = await fetch(`${ADMIN_API_URL}/values`);
        const valuesData = await valuesRes.json();
        setCompanyValues(valuesData);
        // Company Story
        const storyRes = await fetch(`${ADMIN_API_URL}/story`);
        const storyData = await storyRes.json();
        setCompanyStory(storyData);
        // Gallery Items
        const galleryRes = await fetch(`${ADMIN_API_URL}/gallery`);
        const galleryData = await galleryRes.json();
        setGalleryItems(galleryData);
      } catch (err) {
        toast({ title: 'Error', description: 'Failed to fetch admin data', variant: 'destructive' });
      }
      setLoading(false);
    };
    fetchAll();
  }, [toast]);

  const StatCard = ({ title, value, icon: Icon, color, gradient }: { title: string; value: number; icon: any; color: string; gradient: string }) => (
    <Card className={`overflow-hidden border-0 shadow-xl ${gradient} transform hover:scale-105 transition-all duration-300`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white/90">{title}</CardTitle>
        <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
          <Icon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-white">{value}</div>
        <div className="flex items-center mt-2">
          <Star className="h-3 w-3 text-white/70 mr-1" />
          <span className="text-xs text-white/70">Active</span>
        </div>
      </CardContent>
    </Card>
  );

  const downloadCV = (cvUrl: string, applicantName: string) => {
    // Simulate CV download
    toast({
      title: "CV Downloaded",
      description: `Downloaded CV for ${applicantName}`,
    });
  };

  const deleteJobOffer = (id: number) => {
    setJobOffers(prev => prev.filter(job => job.id !== id));
    toast({
      title: "Job Deleted",
      description: "Job offer has been removed",
    });
  };

  const updateDestination = (id: number, field: string, value: string) => {
    setDestinations(prev => prev.map(dest => 
      dest.id === id ? { ...dest, [field]: value } : dest
    ));
    toast({
      title: "Destination Updated",
      description: "Changes saved successfully",
    });
  };

  // CRUD for jobs
  const handleEditJob = (job: JobOffer) => {
    setEditJob(job);
  };

  const handleEditJobChange = (field: keyof JobOffer, value: string) => {
    if (editJob) setEditJob({ ...editJob, [field]: value });
  };

  const handleSaveEditJob = async () => {
    if (!editJob) return;
    // Only send the required fields
    const { title, description, requirements, location, salary, type } = editJob;
    if (!title || !description || !requirements || !location || !salary || !type) {
      toast({ title: 'Error', description: 'All fields are required', variant: 'destructive' });
      return;
    }
    try {
      await fetch(`${ADMIN_API_URL}/jobs/${editJob.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, requirements, location, salary, type }),
      });
      setEditJob(null);
      // Refresh jobs
      const jobsRes = await fetch(`${ADMIN_API_URL}/jobs`);
      setJobOffers(await jobsRes.json());
      toast({ title: 'Success', description: 'Job updated', variant: 'default' });
    } catch {
      toast({ title: 'Error', description: 'Failed to update job', variant: 'destructive' });
    }
  };

  const handleDeleteJob = async (id: number) => {
    try {
      await fetch(`${ADMIN_API_URL}/jobs/${id}`, { method: 'DELETE' });
      setJobOffers(prev => prev.filter(j => j.id !== id));
      toast({ title: 'Deleted', description: 'Job deleted', variant: 'default' });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete job', variant: 'destructive' });
    }
  };

  const handleAddJob = () => {
    setAddJobOpen(true);
    setNewJob({ title: '', description: '', requirements: '', location: '', salary: '', type: '' });
  };

  const handleAddJobChange = (field: keyof typeof newJob, value: string) => {
    setNewJob(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveNewJob = async () => {
    // Only send the required fields
    const { title, description, requirements, location, salary, type } = newJob;
    if (!title || !description || !requirements || !location || !salary || !type) {
      toast({ title: 'Error', description: 'All fields are required', variant: 'destructive' });
      return;
    }
    try {
      await fetch(`${ADMIN_API_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, requirements, location, salary, type }),
      });
      setAddJobOpen(false);
      // Refresh jobs
      const jobsRes = await fetch(`${ADMIN_API_URL}/jobs`);
      setJobOffers(await jobsRes.json());
      toast({ title: 'Success', description: 'Job added', variant: 'default' });
    } catch {
      toast({ title: 'Error', description: 'Failed to add job', variant: 'destructive' });
    }
  };

  // Edit destination logic
  const handleEditDestination = (destination: PopularDestination) => {
    setEditDestination(destination);
  };

  const handleEditDestinationChange = (field: keyof PopularDestination, value: string | number) => {
    if (editDestination) setEditDestination({ ...editDestination, [field]: value });
  };

  const handleSaveEditDestination = async () => {
    if (!editDestination) return;
    const { country, name, image, description, rating, id } = editDestination;
    if (!country || !name || !image || !description || !rating) {
      toast({ title: 'Error', description: 'All fields are required', variant: 'destructive' });
      return;
    }
    try {
      await fetch(`${ADMIN_API_URL}/destinations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country, name, image, description, rating }),
      });
      setEditDestination(null);
      // Refresh destinations
      const destRes = await fetch(`${ADMIN_API_URL}/destinations`);
      setDestinations(await destRes.json());
      toast({ title: 'Success', description: 'Destination updated', variant: 'default' });
    } catch {
      toast({ title: 'Error', description: 'Failed to update destination', variant: 'destructive' });
    }
  };

  // Send admin reply
  const handleSendReply = async () => {
    if (!replyMessageId || !replyText.trim()) {
      toast({ title: 'Error', description: 'Reply cannot be empty', variant: 'destructive' });
      return;
    }
    setReplying(true);
    try {
      await fetch(`http://localhost:5003/api/admin/messages/${replyMessageId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply_text: replyText, admin_id: 1 }),
      });
      setReplyMessageId(null);
      setReplyText('');
      toast({ title: 'Success', description: 'Reply sent', variant: 'default' });
    } catch {
      toast({ title: 'Error', description: 'Failed to send reply', variant: 'destructive' });
    }
    setReplying(false);
  };

  // Add gallery management functions
  const handleUpdateGalleryStatus = async (id: number, status: 'approved' | 'rejected') => {
    try {
      await fetch(`${ADMIN_API_URL}/gallery/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setGalleryItems(prev => prev.map(item => 
        item.id === id ? { ...item, status } : item
      ));
      toast({ title: 'Success', description: `Image ${status}`, variant: 'default' });
    } catch {
      toast({ title: 'Error', description: 'Failed to update image status', variant: 'destructive' });
    }
  };

  const handleDeleteGalleryItem = async (id: number) => {
    try {
      await fetch(`${ADMIN_API_URL}/gallery/${id}`, { method: 'DELETE' });
      setGalleryItems(prev => prev.filter(item => item.id !== id));
      toast({ title: 'Success', description: 'Image deleted', variant: 'default' });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete image', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(214,57%,51%)] mx-auto mb-4"></div>
          <div className="text-gray-700 text-xl">Loading admin panel...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-[hsl(214,57%,51%)] to-[hsl(214,57%,41%)] rounded-xl shadow-2xl p-8 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-white/90 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Manage your travel agency efficiently
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Building2, gradient: 'from-blue-500 to-blue-600' },
            { id: 'users', label: 'Users', icon: Users, gradient: 'from-purple-500 to-purple-600' },
            { id: 'destinations', label: 'Destinations', icon: MapPin, gradient: 'from-green-500 to-green-600' },
            { id: 'messages', label: 'Messages', icon: MessageSquare, gradient: 'from-orange-500 to-orange-600' },
            { id: 'jobs', label: 'Job Offers', icon: Briefcase, gradient: 'from-indigo-500 to-indigo-600' },
            { id: 'applications', label: 'Applications', icon: FileText, gradient: 'from-pink-500 to-pink-600' },
            { id: 'gallery', label: 'Gallery', icon: Image, gradient: 'from-teal-500 to-teal-600' },
          ].map(tab => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              variant="outline"
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                activeTab === tab.id 
                  ? `bg-gradient-to-r ${tab.gradient} text-white border-transparent shadow-lg` 
                  : "bg-white/80 text-gray-700 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Users" value={users.length} icon={Users} color="text-white" gradient="bg-gradient-to-br from-[hsl(214,57%,51%)] to-[hsl(214,57%,41%)]" />
              <StatCard title="Destinations" value={destinations.length} icon={MapPinIcon} color="text-white" gradient="bg-gradient-to-br from-green-500 to-green-600" />
              <StatCard title="Job Offers" value={jobOffers.length} icon={Briefcase} color="text-white" gradient="bg-gradient-to-br from-purple-500 to-purple-600" />
              <StatCard title="Applications" value={jobApplications.length} icon={FileText} color="text-white" gradient="bg-gradient-to-br from-orange-500 to-orange-600" />
            </div>
            
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 shadow-xl rounded-xl">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-t-xl">
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-[hsl(214,57%,51%)]" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {companyStory && (
                  <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-200">
                    <Label className="text-sm font-medium capitalize text-gray-700 flex items-center gap-2">
                      <Edit className="h-4 w-4 text-[hsl(214,57%,51%)]" />
                      Story
                    </Label>
                    <Textarea
                      value={companyStory.content}
                      onChange={(e) => {
                        setCompanyStory(prev => prev ? { ...prev, content: e.target.value } : null);
                      }}
                      className="mt-2 border-blue-300 focus:border-[hsl(214,57%,51%)] focus:ring-[hsl(214,57%,51%)]"
                      rows={4}
                    />
                  </div>
                )}
                {companyValues.map(value => (
                  <div key={value.id} className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-200">
                    <Label className="text-sm font-medium capitalize text-gray-700 flex items-center gap-2">
                      <Edit className="h-4 w-4 text-[hsl(214,57%,51%)]" />
                      {value.title}
                    </Label>
                    <Textarea
                      value={value.description}
                      onChange={(e) => {
                        setCompanyValues(prev => prev.map(item => 
                          item.id === value.id ? { ...item, description: e.target.value } : item
                        ));
                      }}
                      className="mt-2 border-blue-300 focus:border-[hsl(214,57%,51%)] focus:ring-[hsl(214,57%,51%)]"
                      rows={4}
                    />
                  </div>
                ))}
                <Button className="bg-gradient-to-r from-[hsl(214,57%,51%)] to-[hsl(214,57%,41%)] hover:from-[hsl(214,57%,46%)] hover:to-[hsl(214,57%,36%)] text-white shadow-lg">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 shadow-xl rounded-xl">
            <CardHeader className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-t-xl">
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                User Management
              </CardTitle>
              <CardDescription className="text-gray-600 flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Current users: {users.length}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-blue-200 bg-gradient-to-r from-blue-50 to-white">
                    <TableHead className="text-gray-700 font-semibold">ID</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Name</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Email</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id} className="border-blue-100 hover:bg-blue-50/50 transition-colors">
                      <TableCell className="text-gray-800 font-medium">{user.id}</TableCell>
                      <TableCell className="font-medium text-gray-900">{user.name}</TableCell>
                      <TableCell className="text-gray-800 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[hsl(214,57%,51%)]" />
                        {user.email}
                      </TableCell>
                      <TableCell className="text-gray-800 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        {user.created_at}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Destinations Tab */}
        {activeTab === 'destinations' && (
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 shadow-xl rounded-xl">
            <CardHeader className="bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-t-xl">
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Popular Destinations
              </CardTitle>
              <CardDescription className="text-gray-600">Manage your featured destinations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {destinations.map(destination => (
                <div key={destination.id} className="border-2 border-blue-200 rounded-xl p-6 space-y-4 bg-gradient-to-r from-blue-50/50 to-white shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700 flex items-center gap-2">
                        <Edit className="h-4 w-4 text-[hsl(214,57%,51%)]" />
                        Title
                      </Label>
                      <Input
                        value={destination.name}
                        readOnly
                        className="border-blue-300 focus:border-[hsl(214,57%,51%)] focus:ring-[hsl(214,57%,51%)]"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 flex items-center gap-2">
                        <MapPinIcon className="h-4 w-4 text-green-600" />
                        Location
                      </Label>
                      <Input
                        value={destination.country}
                        readOnly
                        className="border-blue-300 focus:border-[hsl(214,57%,51%)] focus:ring-[hsl(214,57%,51%)]"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-700 flex items-center gap-2">
                      <Globe className="h-4 w-4 text-[hsl(214,57%,51%)]" />
                      Image URL
                    </Label>
                    <Input
                      value={destination.image}
                      readOnly
                      className="border-blue-300 focus:border-[hsl(214,57%,51%)] focus:ring-[hsl(214,57%,51%)]"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[hsl(214,57%,51%)]" />
                      Description
                    </Label>
                    <Textarea
                      value={destination.description}
                      readOnly
                      className="border-blue-300 focus:border-[hsl(214,57%,51%)] focus:ring-[hsl(214,57%,51%)]"
                    />
                  </div>
                  <img src={destination.image} alt={destination.name} className="w-full h-48 object-cover rounded-xl border-2 border-blue-200 shadow-md" />
                  <div className="flex justify-end mt-2">
                    <Button variant="outline" size="sm" className="border-blue-300 text-[hsl(214,57%,51%)] hover:bg-blue-50" onClick={() => handleEditDestination(destination)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 shadow-xl rounded-xl">
            <CardHeader className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-t-xl">
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-orange-600" />
                Contact Messages
              </CardTitle>
              <CardDescription className="text-gray-600">Customer inquiries and feedback</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {contactMessages.map(message => (
                  <div key={message.id} className="border-2 border-blue-200 rounded-xl p-6 bg-gradient-to-r from-orange-50/50 to-white shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          <Users className="h-4 w-4 text-[hsl(214,57%,51%)]" />
                          {message.name}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {message.email}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {message.created_at}
                      </span>
                    </div>
                    <Textarea
                      value={message.message}
                      onChange={(e) => {
                        setContactMessages(prev => prev.map(msg => 
                          msg.id === message.id ? { ...msg, message: e.target.value } : msg
                        ));
                      }}
                      className="mt-2 border-blue-300 focus:border-[hsl(214,57%,51%)] focus:ring-[hsl(214,57%,51%)]"
                    />
                    <div className="flex justify-end mt-2">
                      <Button size="sm" onClick={() => { setReplyMessageId(message.id); setReplyText(''); }}>Respond</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Job Offers Tab */}
        {activeTab === 'jobs' && (
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 shadow-xl rounded-xl">
            <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-indigo-600/10 rounded-t-xl">
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-indigo-600" />
                Job Offers
              </CardTitle>
              <CardDescription className="text-gray-600">Manage job postings</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg" onClick={handleAddJob}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Job
                </Button>
                {jobOffers.map(job => (
                  <div key={job.id} className="border-2 border-blue-200 rounded-xl p-6 bg-gradient-to-r from-indigo-50/50 to-white shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <Briefcase className="h-5 w-5 text-[hsl(214,57%,51%)]" />
                          {job.title}
                        </h3>
                        <p className="text-gray-600 flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          {job.location}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-blue-300 text-[hsl(214,57%,51%)] hover:bg-blue-50" onClick={() => handleEditJob(job)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteJob(job.id)}
                          className="bg-gradient-to-r from-red-500 to-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-700 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[hsl(214,57%,51%)]" />
                          Description
                        </Label>
                        <Textarea value={job.description} rows={3} className="border-blue-300 focus:border-[hsl(214,57%,51%)] focus:ring-[hsl(214,57%,51%)]" />
                      </div>
                      <div>
                        <Label className="text-gray-700 flex items-center gap-2">
                          <Star className="h-4 w-4 text-[hsl(214,57%,51%)]" />
                          Requirements
                        </Label>
                        <Textarea value={job.requirements} rows={3} className="border-blue-300 focus:border-[hsl(214,57%,51%)] focus:ring-[hsl(214,57%,51%)]" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label className="text-gray-700 flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-green-600" />
                        Salary Range
                      </Label>
                      <Input value={job.salary} className="border-blue-300 focus:border-[hsl(214,57%,51%)] focus:ring-[hsl(214,57%,51%)]" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Job Applications Tab */}
        {activeTab === 'applications' && (
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 shadow-xl rounded-xl">
            <CardHeader className="bg-gradient-to-r from-pink-500/10 to-pink-600/10 rounded-t-xl">
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-pink-600" />
                Job Applications
              </CardTitle>
              <CardDescription className="text-gray-600">Review candidate applications</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-blue-200 bg-gradient-to-r from-blue-50 to-white">
                    <TableHead className="text-gray-700 font-semibold">Applicant</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Email</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Phone</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Applied Date</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobApplications.map(application => (
                    <TableRow key={application.id} className="border-blue-100 hover:bg-blue-50/50 transition-colors">
                      <TableCell className="font-medium text-gray-900 flex items-center gap-2">
                        <Users className="h-4 w-4 text-[hsl(214,57%,51%)]" />
                        {application.name}
                      </TableCell>
                      <TableCell className="text-gray-800 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[hsl(214,57%,51%)]" />
                        {application.email}
                      </TableCell>
                      <TableCell className="text-gray-800 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-green-600" />
                        {application.phone}
                      </TableCell>
                      <TableCell className="text-gray-800 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        {application.created_at}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => downloadCV(application.cv_path, application.name)}
                          className="bg-gradient-to-r from-[hsl(214,57%,51%)] to-[hsl(214,57%,41%)] hover:from-[hsl(214,57%,46%)] hover:to-[hsl(214,57%,36%)] text-white shadow-lg"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download CV
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Add Gallery Tab */}
        {activeTab === 'gallery' && (
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 shadow-xl rounded-xl">
            <CardHeader className="bg-gradient-to-r from-teal-500/10 to-teal-600/10 rounded-t-xl">
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Image className="h-5 w-5 text-teal-600" />
                Gallery Management
              </CardTitle>
              <CardDescription className="text-gray-600">Manage user-submitted gallery images</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryItems.map(item => (
                  <div key={item.id} className="border-2 border-blue-200 rounded-xl p-4 bg-gradient-to-r from-teal-50/50 to-white shadow-lg">
                    <div className="aspect-w-16 aspect-h-9 mb-4">
                      <img
                        src={`/storage/${item.image_path}`}
                        alt={item.title}
                        className="object-cover w-full h-full rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                      <p className="text-sm text-gray-500">Category: {item.category}</p>
                      <p className="text-sm text-gray-500">
                        Submitted by: {item.user.name} ({item.user.email})
                      </p>
                      <p className="text-sm text-gray-500">
                        Status: <span className={`font-medium ${
                          item.status === 'approved' ? 'text-green-600' :
                          item.status === 'rejected' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>{item.status}</span>
                      </p>
                      <div className="flex gap-2 mt-4">
                        {item.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateGalleryStatus(item.id, 'approved')}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateGalleryStatus(item.id, 'rejected')}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteGalleryItem(item.id)}
                          className="bg-gradient-to-r from-red-500 to-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      {/* Add/Edit Job Dialogs */}
      {editJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit Job</h2>
            {(['title', 'description', 'requirements', 'location', 'salary', 'type'] as (keyof JobOffer)[]).map(field => (
              <div key={field} className="mb-2">
                <Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                <Input
                  value={editJob[field] as string}
                  onChange={e => handleEditJobChange(field, e.target.value)}
                  className="w-full"
                />
              </div>
            ))}
            <div className="flex gap-2 mt-4">
              <Button onClick={() => setEditJob(null)} variant="outline">Cancel</Button>
              <Button onClick={handleSaveEditJob}>Save</Button>
            </div>
          </div>
        </div>
      )}
      {addJobOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Add New Job</h2>
            {(['title', 'description', 'requirements', 'location', 'salary', 'type'] as (keyof typeof newJob)[]).map(field => (
              <div key={field} className="mb-2">
                <Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                <Input
                  value={newJob[field] as string}
                  onChange={e => handleAddJobChange(field, e.target.value)}
                  className="w-full"
                />
              </div>
            ))}
            <div className="flex gap-2 mt-4">
              <Button onClick={() => setAddJobOpen(false)} variant="outline">Cancel</Button>
              <Button onClick={handleSaveNewJob}>Add</Button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Destination Dialog */}
      {editDestination && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit Destination</h2>
            {(['country', 'name', 'image', 'description', 'rating'] as (keyof PopularDestination)[]).map(field => (
              <div key={field} className="mb-2">
                <Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                {field === 'rating' ? (
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    value={editDestination[field] as number}
                    onChange={e => handleEditDestinationChange(field, Number(e.target.value))}
                    className="w-full"
                  />
                ) : (
                  <Input
                    value={editDestination[field] as string}
                    onChange={e => handleEditDestinationChange(field, e.target.value)}
                    className="w-full"
                  />
                )}
              </div>
            ))}
            <div className="flex gap-2 mt-4">
              <Button onClick={() => setEditDestination(null)} variant="outline">Cancel</Button>
              <Button onClick={handleSaveEditDestination}>Save</Button>
            </div>
          </div>
        </div>
      )}
      {/* Admin Reply Dialog */}
      {replyMessageId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Reply to Message</h2>
            <Textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              rows={4}
              className="w-full mb-4"
              placeholder="Type your reply here..."
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={() => setReplyMessageId(null)} variant="outline">Cancel</Button>
              <Button onClick={handleSendReply} disabled={replying}>Send</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
