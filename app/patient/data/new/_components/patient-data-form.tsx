
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Label } from '../../../../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { Alert, AlertDescription } from '../../../../../components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../components/ui/select';
import { Textarea } from '../../../../../components/ui/textarea';
import { 
  Hospital, 
  ArrowLeft, 
  Save, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin,
  Heart,
  Shield,
  Users,
  CreditCard,
  AlertCircle,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { useToast } from '../../../../../hooks/use-toast';
import { motion } from 'framer-motion';

interface Props {
  user: any;
  ehrSystems: any[];
  mode: 'create' | 'edit';
  initialData?: any;
}

export default function PatientDataForm({ user, ehrSystems, mode, initialData }: Props) {
  const [formData, setFormData] = useState({
    // Basic Demographics
    name: initialData?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
    email: initialData?.email || user?.email || '',
    phone: initialData?.phone || '',
    gender: initialData?.gender || '',
    dateOfBirth: initialData?.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split('T')[0] : '',
    
    // Address Information
    address: initialData?.address || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zipCode: initialData?.zipCode || '',
    country: initialData?.country || 'US',
    
    // Medical Information
    allergies: initialData?.allergies || '',
    medications: initialData?.medications || '',
    medicalHistory: initialData?.medicalHistory || '',
    socialHistory: initialData?.socialHistory || '',
    familyHistory: initialData?.familyHistory || '',
    
    // Emergency Contact
    emergencyContactName: initialData?.emergencyContactName || '',
    emergencyContactPhone: initialData?.emergencyContactPhone || '',
    emergencyContactRelation: initialData?.emergencyContactRelation || '',
    
    // Insurance Information
    insuranceProvider: initialData?.insuranceProvider || '',
    insuranceNumber: initialData?.insuranceNumber || '',
    insuranceGroup: initialData?.insuranceGroup || '',
    
    // EHR System
    ehrSystemId: initialData?.ehrSystemId || ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }

    if (formData.email && !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.dateOfBirth && new Date(formData.dateOfBirth) > new Date()) {
      setError('Date of birth cannot be in the future');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = mode === 'create' ? '/api/patient/data' : `/api/patient/data/${initialData?.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          dateOfBirth: formData.dateOfBirth || null,
          ehrSystemId: formData.ehrSystemId || null
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: mode === 'create' ? 'Health data saved successfully!' : 'Health data updated successfully!',
          description: 'Your information has been securely stored.',
          duration: 5000,
        });
        router.push('/patient/dashboard');
      } else {
        setError(data.error || 'Failed to save health data');
        toast({
          variant: 'destructive',
          title: 'Failed to save data',
          description: data.error || 'An error occurred while saving your information'
        });
      }
    } catch (error) {
      console.error('Save error:', error);
      setError('An unexpected error occurred');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/patient/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Hospital className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {mode === 'create' ? 'Add Health Data' : 'Edit Health Data'}
                </h1>
                <p className="text-xs text-gray-500">Patient Information Form</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Page Title */}
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {mode === 'create' ? 'Add Your Health Information' : 'Update Your Health Information'}
            </h1>
            <p className="text-xl text-gray-600">
              Please provide accurate information for better healthcare integration
            </p>
          </motion.div>

          {/* Error Alert */}
          {error && (
            <motion.div variants={itemVariants}>
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Demographics */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <span>Basic Demographics</span>
                  </CardTitle>
                  <CardDescription>
                    Your personal identification information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          required
                          disabled={isLoading}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          disabled={isLoading}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          disabled={isLoading}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select 
                        value={formData.gender} 
                        onValueChange={(value) => handleChange('gender', value)}
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                          <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                          disabled={isLoading}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ehrSystemId">Preferred EHR System</Label>
                      <Select 
                        value={formData.ehrSystemId} 
                        onValueChange={(value) => handleChange('ehrSystemId', value)}
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select EHR system (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No preference</SelectItem>
                          {ehrSystems?.map((system) => (
                            <SelectItem key={system.id} value={system.id}>
                              {system.name} {system.version && `(v${system.version})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Address Information */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <span>Address Information</span>
                  </CardTitle>
                  <CardDescription>
                    Your residential address details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="123 Main Street, Apt 4B"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        type="text"
                        placeholder="New York"
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        type="text"
                        placeholder="NY"
                        value={formData.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                      <Input
                        id="zipCode"
                        type="text"
                        placeholder="12345"
                        value={formData.zipCode}
                        onChange={(e) => handleChange('zipCode', e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Medical Information */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-red-600" />
                    <span>Medical Information</span>
                  </CardTitle>
                  <CardDescription>
                    Your health history and current medical information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Known Allergies</Label>
                    <Textarea
                      id="allergies"
                      placeholder="List any known allergies (medications, food, environmental, etc.)"
                      value={formData.allergies}
                      onChange={(e) => handleChange('allergies', e.target.value)}
                      disabled={isLoading}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medications">Current Medications</Label>
                    <Textarea
                      id="medications"
                      placeholder="List all current medications, dosages, and frequency"
                      value={formData.medications}
                      onChange={(e) => handleChange('medications', e.target.value)}
                      disabled={isLoading}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicalHistory">Medical History</Label>
                    <Textarea
                      id="medicalHistory"
                      placeholder="Previous diagnoses, surgeries, hospitalizations, chronic conditions"
                      value={formData.medicalHistory}
                      onChange={(e) => handleChange('medicalHistory', e.target.value)}
                      disabled={isLoading}
                      rows={4}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="socialHistory">Social History</Label>
                      <Textarea
                        id="socialHistory"
                        placeholder="Smoking, alcohol use, exercise habits, occupation"
                        value={formData.socialHistory}
                        onChange={(e) => handleChange('socialHistory', e.target.value)}
                        disabled={isLoading}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="familyHistory">Family History</Label>
                      <Textarea
                        id="familyHistory"
                        placeholder="Family history of diseases, genetic conditions"
                        value={formData.familyHistory}
                        onChange={(e) => handleChange('familyHistory', e.target.value)}
                        disabled={isLoading}
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Emergency Contact */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-orange-600" />
                    <span>Emergency Contact</span>
                  </CardTitle>
                  <CardDescription>
                    Person to contact in case of medical emergency
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactName">Contact Name</Label>
                      <Input
                        id="emergencyContactName"
                        type="text"
                        placeholder="Jane Doe"
                        value={formData.emergencyContactName}
                        onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                      <Input
                        id="emergencyContactPhone"
                        type="tel"
                        placeholder="(555) 987-6543"
                        value={formData.emergencyContactPhone}
                        onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="emergencyContactRelation">Relationship</Label>
                      <Select 
                        value={formData.emergencyContactRelation} 
                        onValueChange={(value) => handleChange('emergencyContactRelation', value)}
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Spouse">Spouse</SelectItem>
                          <SelectItem value="Parent">Parent</SelectItem>
                          <SelectItem value="Child">Child</SelectItem>
                          <SelectItem value="Sibling">Sibling</SelectItem>
                          <SelectItem value="Friend">Friend</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Insurance Information */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    <span>Insurance Information</span>
                  </CardTitle>
                  <CardDescription>
                    Your health insurance details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                      <Input
                        id="insuranceProvider"
                        type="text"
                        placeholder="Blue Cross Blue Shield"
                        value={formData.insuranceProvider}
                        onChange={(e) => handleChange('insuranceProvider', e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="insuranceNumber">Policy/Member ID</Label>
                      <Input
                        id="insuranceNumber"
                        type="text"
                        placeholder="ABC123456789"
                        value={formData.insuranceNumber}
                        onChange={(e) => handleChange('insuranceNumber', e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="insuranceGroup">Group Number</Label>
                      <Input
                        id="insuranceGroup"
                        type="text"
                        placeholder="GRP001"
                        value={formData.insuranceGroup}
                        onChange={(e) => handleChange('insuranceGroup', e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Privacy Notice */}
            <motion.div variants={itemVariants}>
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 mb-1">Privacy & Security</h4>
                      <p className="text-sm text-blue-800">
                        Your health information is encrypted and stored securely in compliance with HIPAA regulations. 
                        This data will only be used for healthcare purposes and EHR system integration as authorized by you.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Form Actions */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <Link href="/patient/dashboard">
                      <Button variant="outline" disabled={isLoading}>
                        Cancel
                      </Button>
                    </Link>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {mode === 'create' ? 'Saving...' : 'Updating...'}
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          {mode === 'create' ? 'Save Health Data' : 'Update Health Data'}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
