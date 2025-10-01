
'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { 
  Hospital, 
  User, 
  FileText, 
  Settings, 
  LogOut, 
  Plus,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Shield,
  Database,
  ArrowRight
} from 'lucide-react';
import { useToast } from '../../../../hooks/use-toast';
import { motion } from 'framer-motion';

interface Props {
  user: any;
  patientData: any[];
  ehrSystems: any[];
}

export default function PatientDashboardClient({ user, patientData, ehrSystems }: Props) {
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/' });
      toast({
        title: 'Signed out successfully',
        description: 'You have been logged out of your account.'
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to sign out. Please try again.'
      });
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getLatestRecord = () => {
    return patientData?.[0] || null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                <Hospital className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Patient Portal</h1>
                <p className="text-xs text-gray-500">EHR Integration System</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Welcome Section */}
          <motion.div variants={itemVariants}>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-xl text-gray-600">
                Manage your health information and EHR integrations
              </p>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Link href="/patient/data/new">
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                      <Plus className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Health Data</h3>
                    <p className="text-gray-600 text-sm">Create new patient record</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/patient/records">
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">View Records</h3>
                    <p className="text-gray-600 text-sm">Browse your health data</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/patient/transform">
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                      <Database className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Transform Data</h3>
                    <p className="text-gray-600 text-sm">Convert to EHR formats</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/patient/settings">
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                      <Settings className="h-6 w-6 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings</h3>
                    <p className="text-gray-600 text-sm">Manage your account</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Latest Health Record */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <span>Your Latest Health Record</span>
                  </CardTitle>
                  <CardDescription>
                    {patientData?.length > 0 ? 'Most recently updated information' : 'No health records found'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {patientData?.length > 0 ? (
                    <div className="space-y-6">
                      {(() => {
                        const record = getLatestRecord();
                        return (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-xl font-semibold text-gray-900">{record?.name}</h3>
                              {record?.ehrSystem && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                  {record.ehrSystem.name}
                                </Badge>
                              )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-3">
                                {record?.email && (
                                  <div className="flex items-center space-x-2 text-gray-600">
                                    <Mail className="h-4 w-4" />
                                    <span className="text-sm">{record.email}</span>
                                  </div>
                                )}
                                
                                {record?.phone && (
                                  <div className="flex items-center space-x-2 text-gray-600">
                                    <Phone className="h-4 w-4" />
                                    <span className="text-sm">{record.phone}</span>
                                  </div>
                                )}

                                {record?.dateOfBirth && (
                                  <div className="flex items-center space-x-2 text-gray-600">
                                    <Calendar className="h-4 w-4" />
                                    <span className="text-sm">{formatDate(record.dateOfBirth)}</span>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-3">
                                {(record?.city || record?.state) && (
                                  <div className="flex items-center space-x-2 text-gray-600">
                                    <MapPin className="h-4 w-4" />
                                    <span className="text-sm">
                                      {[record?.city, record?.state].filter(Boolean).join(', ')}
                                    </span>
                                  </div>
                                )}

                                {record?.gender && (
                                  <div className="text-sm text-gray-600">
                                    <span className="font-medium">Gender:</span> {record.gender}
                                  </div>
                                )}

                                <div className="text-sm text-gray-500">
                                  Last updated: {formatDate(record?.updatedAt)}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t">
                              <div className="text-sm text-gray-500">
                                {patientData.length} health record{patientData.length !== 1 ? 's' : ''} total
                              </div>
                              <Link href="/patient/records">
                                <Button variant="outline" size="sm">
                                  View All Records
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Health Records</h3>
                      <p className="text-gray-600 mb-4">Get started by adding your health information</p>
                      <Link href="/patient/data/new">
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Health Data
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* EHR Systems */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-green-600" />
                    <span>Available EHR Systems</span>
                  </CardTitle>
                  <CardDescription>
                    Supported healthcare platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ehrSystems?.map((system) => (
                      <div key={system.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{system.name}</h4>
                          <p className="text-xs text-gray-600">
                            {system._count.fieldMappings} field mappings
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                      </div>
                    ))}

                    {ehrSystems?.length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-gray-600">No EHR systems configured</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Card className="shadow-lg border-0 mt-6">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">HIPAA Compliant</h4>
                      <p className="text-xs text-gray-600">
                        Your health data is encrypted and protected according to healthcare privacy standards.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
