
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth-config';
import { redirect } from 'next/navigation';
import { Hospital, Shield, Database, Zap, Users, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import Link from 'next/link';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    // Redirect based on user role
    if (session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN') {
      redirect('/admin/dashboard');
    } else {
      redirect('/patient/dashboard');
    }
  }

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
                <h1 className="text-xl font-bold text-gray-900">EHR Integration</h1>
                <p className="text-xs text-gray-500">Healthcare Data Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-6 text-5xl font-bold leading-tight text-gray-900 md:text-6xl">
              Seamless <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">EHR Integration</span> 
              <br />for Healthcare Systems
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600 leading-relaxed">
              Transform patient data between different Electronic Health Record systems with enterprise-grade security, 
              real-time mapping, and comprehensive audit trails.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                  Start Free Trial
                  <Zap className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful EHR Integration Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for healthcare organizations that need reliable, secure, and scalable patient data management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Multi-EHR Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with Athena, Allscripts, Epic, and other major EHR systems through configurable field mappings.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">HIPAA Compliant</h3>
              <p className="text-gray-600 leading-relaxed">
                Enterprise-grade security with comprehensive audit trails, data encryption, and access controls.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Transformation</h3>
              <p className="text-gray-600 leading-relaxed">
                Instantly transform patient data between different EHR formats with intelligent field mapping.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Patient Portal</h3>
              <p className="text-gray-600 leading-relaxed">
                User-friendly interface for patients to manage their health information and consent preferences.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                <FileText className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Admin Dashboard</h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive management tools for EHR mappings, user administration, and system monitoring.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-8 rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                <Hospital className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Scalable Architecture</h3>
              <p className="text-gray-600 leading-relaxed">
                Built to handle millions of patient records with high availability and performance optimization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Healthcare Data?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join healthcare organizations already using our platform to streamline patient data management.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Create Account
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Hospital className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">EHR Integration System</span>
            </div>
            <p className="text-gray-400 mb-4">
              Secure, scalable healthcare data integration platform
            </p>
            <p className="text-sm text-gray-500">
              © 2024 EHR Integration System. Built for healthcare excellence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
