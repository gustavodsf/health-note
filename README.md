# EHR Integration System

A comprehensive Electronic Health Record (EHR) integration platform built with Next.js, TypeScript, and PostgreSQL. This system enables seamless data transformation between different EHR systems with enterprise-grade security and comprehensive audit trails.

## 🏥 Features

### Core Functionality
- **Multi-EHR Support**: Connect with Athena, Allscripts, Epic, and other major EHR systems
- **Real-time Data Transformation**: Instantly transform patient data between different EHR formats
- **Field Mapping Configuration**: Configurable field mappings for different EHR systems
- **Patient Portal**: User-friendly interface for patients to manage their health information
- **Admin Dashboard**: Comprehensive management tools for EHR mappings and user administration

### Security & Compliance
- **HIPAA Compliant**: Enterprise-grade security with comprehensive audit trails
- **Data Encryption**: Secure data handling and transmission
- **Access Controls**: Role-based access control (Patient, Admin, Super Admin)
- **Audit Logging**: Complete audit trail for all data operations

### Technical Features
- **Scalable Architecture**: Built to handle millions of patient records
- **High Availability**: Performance optimization and reliability
- **Modern UI**: Built with Tailwind CSS and Radix UI components
- **Type Safety**: Full TypeScript implementation

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **React Hook Form** - Form handling
- **Zustand** - State management

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **NextAuth.js** - Authentication
- **bcryptjs** - Password hashing
- **JWT** - Token-based authentication

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Prisma Studio** - Database management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gustavodsf/health-note
   cd health-note
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/ehr_integration"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"

   # Optional: For production
   NEXT_DIST_DIR=".next"
   NEXT_OUTPUT_MODE="standalone"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma db push

   # Seed the database (optional)
   npm run prisma:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
health-note/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── ehr/           # EHR system management
│   │   ├── patient/       # Patient data endpoints
│   │   └── admin/         # Admin endpoints
│   ├── auth/              # Authentication pages
│   ├── patient/           # Patient portal pages
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # UI component library
│   └── providers.tsx     # Context providers
├── lib/                  # Utility libraries
│   ├── auth-config.ts    # NextAuth configuration
│   ├── db.ts            # Database connection
│   ├── ehr-service.ts   # EHR integration service
│   ├── types.ts         # TypeScript type definitions
│   └── utils.ts         # Utility functions
├── prisma/              # Database schema and migrations
│   └── schema.prisma   # Prisma schema
├── hooks/              # Custom React hooks
└── scripts/           # Database seeding scripts
```

## 🗄️ Database Schema

### Core Models
- **User**: Authentication and user management
- **EHRSystem**: Supported EHR systems (Athena, Allscripts, Epic, etc.)
- **EHRFieldMapping**: Field mappings between standard and EHR-specific fields
- **PatientData**: Comprehensive patient health information
- **AuditLog**: Complete audit trail for compliance

### User Roles
- **PATIENT**: Can view and manage their own health data
- **ADMIN**: Can manage EHR systems and field mappings
- **SUPER_ADMIN**: Full system access and user management

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication

### EHR Management
- `GET /api/ehr/systems` - List all EHR systems
- `POST /api/ehr/systems` - Create new EHR system
- `GET /api/ehr/systems/[id]` - Get specific EHR system
- `GET /api/ehr/mappings` - Get field mappings
- `POST /api/ehr/transform` - Transform patient data

### Patient Data
- `GET /api/patient/data` - Get patient data
- `POST /api/patient/data` - Create patient data
- `GET /api/patient/data/[id]` - Get specific patient data

### Admin
- `GET /api/admin/audit` - Get audit logs

## 🔐 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Tokens**: Secure session management
- **Role-based Access**: Granular permission system
- **Audit Logging**: Complete activity tracking
- **Input Validation**: Zod schema validation
- **CORS Protection**: Secure API endpoints

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
# Build the Docker image
docker build -t ehr-integration .

# Run the container
docker run -p 3000:3000 ehr-integration
```

### Environment Variables for Production
```env
DATABASE_URL="postgresql://user:password@host:port/database"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-production-secret"
NEXT_DIST_DIR=".next"
NEXT_OUTPUT_MODE="standalone"
```

## 📊 Monitoring & Analytics

- **Audit Logs**: Track all user actions and data changes
- **Performance Metrics**: Monitor system performance
- **Error Tracking**: Comprehensive error logging
- **User Analytics**: Track user engagement and usage patterns

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation for common solutions

## 🔄 Roadmap

- [ ] Additional EHR system integrations
- [ ] Advanced analytics dashboard
- [ ] Mobile application
- [ ] API rate limiting
- [ ] Advanced security features
- [ ] Multi-tenant support
- [ ] Real-time notifications
- [ ] Data export/import tools

---

Built with ❤️ for healthcare excellence.
