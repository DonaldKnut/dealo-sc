# 🚀 Comprehensive NestJS Backend for Dealo Platform

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Database Models](#database-models)
5. [API Endpoints](#api-endpoints)
6. [Security & Performance](#security--performance)
7. [Setup & Deployment](#setup--deployment)
8. [Integration with Next.js](#integration-with-nextjs)

## 🎯 Overview

This NestJS backend is a **production-grade** API server that mirrors the Next.js app's functionality while providing additional features for mobile apps and external services. It uses the **same MongoDB endpoint** as the Next.js app, ensuring data consistency across platforms.

### **Key Benefits**

- ✅ **Same Database**: Uses identical MongoDB models as Next.js app
- ✅ **Production Ready**: Rate limiting, security, monitoring, logging
- ✅ **Mobile Optimized**: CORS, compression, mobile-friendly responses
- ✅ **Scalable**: Microservices architecture, caching, load balancing
- ✅ **Comprehensive**: All features from Next.js + additional APIs

## 🏗️ Architecture

### **Project Structure**

```
nest-backend/
├── src/
│   ├── config/                 # Configuration & validation
│   │   ├── configuration.ts    # Environment config
│   │   └── validation.ts       # Joi validation schema
│   ├── auth/                   # Authentication & OAuth
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/         # JWT, Google, LinkedIn
│   │   ├── guards/            # Auth guards
│   │   └── dto/               # Auth DTOs
│   ├── users/                  # User management
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── schemas/           # User schema (mirrors Next.js)
│   │   └── dto/               # User DTOs
│   ├── social/                 # Social features
│   │   ├── likes/             # Like system
│   │   ├── comments/          # Comment system
│   │   └── follows/           # Follow system
│   ├── messaging/              # Real-time messaging
│   ├── courses/                # Course marketplace
│   ├── certifications/         # AI-powered certifications
│   ├── search/                 # Search functionality
│   ├── upload/                 # File upload (R2)
│   ├── notifications/          # Push notifications
│   ├── analytics/              # User analytics
│   └── health/                 # Health checks
├── logs/                       # Winston logs
├── test/                       # Tests
└── docker/                     # Docker configuration
```

### **Technology Stack**

- **Framework**: NestJS 10.x
- **Database**: MongoDB (same as Next.js)
- **Authentication**: JWT + OAuth (Google, LinkedIn)
- **File Storage**: Cloudflare R2
- **AI**: Google Gemini
- **Real-time**: Socket.IO
- **Caching**: Redis
- **Queue**: Bull
- **Logging**: Winston
- **Monitoring**: Health checks, metrics
- **Security**: Helmet, CORS, Rate limiting

## ✨ Features

### **1. Authentication System**

```typescript
// Mirrors Next.js auth exactly
- JWT-based authentication
- OAuth 2.0 (Google, LinkedIn)
- Password reset functionality
- Email verification
- Role-based access control
- Session management
```

### **2. User Management**

```typescript
// Identical User model to Next.js
- User CRUD operations
- Profile management
- Credit system
- Verification system
- Role management
- Statistics & analytics
```

### **3. Social Features**

```typescript
- Like system (videos, images, works, courses, posts)
- Comment system (threaded, editing, deletion)
- Follow system (Instagram-style)
- Social feed
- Notifications
```

### **4. Real-time Communication**

```typescript
- Socket.IO integration
- Live messaging
- Typing indicators
- Online/offline status
- Push notifications
```

### **5. Course Marketplace**

```typescript
- Course CRUD operations
- Enrollment system
- Revenue sharing (70/30)
- Subscription management
- Payment processing
```

### **6. AI-Powered Certifications**

```typescript
- Google Gemini integration
- Dynamic assessment generation
- Certificate creation
- Progress tracking
- Skill validation
```

### **7. File Management**

```typescript
- Cloudflare R2 integration
- Image/video upload
- File validation
- CDN optimization
- Presigned URLs
```

## 🗄️ Database Models

### **User Model (Mirrors Next.js)**

```typescript
@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: false })
  password?: string;

  @Prop({ default: null })
  avatar?: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ type: String, enum: Role, default: Role.STUDENT })
  role: Role;

  @Prop({ default: 5 })
  credits: number;

  @Prop({ type: [String], default: [] })
  interests: string[];

  @Prop({ type: String, enum: Experience })
  experience?: Experience;

  // ... all other fields from Next.js User model
}
```

### **Social Models**

```typescript
// Like Model
export class Like extends Document {
  user: Types.ObjectId;
  content: {
    type: "video" | "image" | "work" | "course" | "post";
    id: Types.ObjectId;
  };
  createdAt: Date;
}

// Comment Model
export class Comment extends Document {
  user: Types.ObjectId;
  content: {
    type: "video" | "image" | "work" | "course" | "post";
    id: Types.ObjectId;
  };
  text: string;
  parentComment?: Types.ObjectId;
  likes: Types.ObjectId[];
  isEdited: boolean;
  editHistory: Array<{ text: string; editedAt: Date }>;
  isDeleted: boolean;
}

// Follow Model
export class Follow extends Document {
  follower: Types.ObjectId;
  following: Types.ObjectId;
  isActive: boolean;
  followedAt: Date;
  unfollowedAt?: Date;
}
```

## 🔌 API Endpoints

### **Authentication Endpoints**

```
POST   /api/v1/auth/signup          # Register new user
POST   /api/v1/auth/signin          # Sign in user
POST   /api/v1/auth/oauth           # OAuth sign in
POST   /api/v1/auth/refresh         # Refresh token
POST   /api/v1/auth/forgot-password # Password reset
POST   /api/v1/auth/reset-password  # Reset password
GET    /api/v1/auth/me              # Get current user
POST   /api/v1/auth/logout          # Logout
GET    /api/v1/auth/google          # Google OAuth URL
GET    /api/v1/auth/linkedin        # LinkedIn OAuth URL
```

### **User Endpoints**

```
GET    /api/v1/users                # Get all users (paginated)
GET    /api/v1/users/:id            # Get user by ID
PUT    /api/v1/users/:id            # Update user
DELETE /api/v1/users/:id            # Delete user
GET    /api/v1/users/stats          # Get user statistics
GET    /api/v1/users/search         # Search users
PUT    /api/v1/users/:id/credits    # Update user credits
PUT    /api/v1/users/:id/status     # Update user status
GET    /api/v1/users/:id/profile-completion # Get profile completion
```

### **Social Endpoints**

```
# Likes
POST   /api/v1/social/likes         # Like content
DELETE /api/v1/social/likes         # Unlike content
GET    /api/v1/social/likes/check   # Check like status

# Comments
POST   /api/v1/social/comments      # Add comment
GET    /api/v1/social/comments      # Get comments
PUT    /api/v1/social/comments/:id  # Edit comment
DELETE /api/v1/social/comments/:id  # Delete comment
POST   /api/v1/social/comments/:id/replies  # Reply to comment
GET    /api/v1/social/comments/:id/replies  # Get replies

# Follows
POST   /api/v1/social/follows       # Follow user
DELETE /api/v1/social/follows       # Unfollow user
GET    /api/v1/social/follows       # Get follow relationships
GET    /api/v1/social/follows/check/:userId  # Check follow status
GET    /api/v1/social/follows/mutual/:userId # Get mutual followers
```

### **Course Endpoints**

```
GET    /api/v1/courses              # Get courses
POST   /api/v1/courses              # Create course
GET    /api/v1/courses/:id          # Get course details
PUT    /api/v1/courses/:id          # Update course
DELETE /api/v1/courses/:id          # Delete course
POST   /api/v1/courses/:id/enroll   # Enroll in course
GET    /api/v1/courses/:id/students # Get enrolled students
POST   /api/v1/courses/:id/reviews  # Add course review
```

### **Certification Endpoints**

```
GET    /api/v1/certifications       # Get certifications
POST   /api/v1/certifications/initialize # Initialize assessment
POST   /api/v1/certifications/:id/start   # Start assessment
POST   /api/v1/certifications/:id/submit  # Submit assessment
GET    /api/v1/certifications/stats # Get certification stats
GET    /api/v1/certifications/:id/certificate # Get certificate
```

### **Search Endpoints**

```
POST   /api/v1/search               # Comprehensive search
GET    /api/v1/search/suggestions   # Search suggestions
GET    /api/v1/search/trending      # Trending searches
```

### **Upload Endpoints**

```
POST   /api/v1/upload/image         # Upload image
POST   /api/v1/upload/video         # Upload video
POST   /api/v1/upload/document      # Upload document
GET    /api/v1/upload/presigned-url # Get presigned URL
DELETE /api/v1/upload/:id           # Delete file
```

## 🔒 Security & Performance

### **Security Features**

```typescript
// Helmet security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// CORS configuration
app.enableCors({
  origin: [
    "http://localhost:3000", // Next.js web app
    "https://dealo.com", // Production web
    "capacitor://localhost", // Mobile app
  ],
  credentials: true,
});
```

### **Performance Features**

```typescript
// Compression
app.use(compression());

// Database optimization
MongooseModule.forRootAsync({
  useFactory: (configService) => ({
    uri: configService.get<string>("MONGODB_URI"),
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  }),
});

// Caching with Redis
@Injectable()
export class CacheService {
  constructor(@InjectRedis() private readonly redis: Redis) {}
}
```

### **Monitoring & Logging**

```typescript
// Winston logging
const logger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, context }) => {
          return `${timestamp} [${context}] ${level}: ${message}`;
        })
      ),
    }),
    new winston.transports.DailyRotateFile({
      filename: "logs/application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

// Health checks
@Controller("health")
export class HealthController {
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.mongooseHealthIndicator.pingCheck("database"),
      () => this.redisHealthIndicator.pingCheck("redis"),
    ]);
  }
}
```

## 🚀 Setup & Deployment

### **Environment Variables**

```env
# Server
NODE_ENV=production
PORT=3001

# Database (SAME AS NEXT.JS)
MONGODB_URI=mongodb://localhost:27017/dealo

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://api.dealo.com/api/v1/auth/google/callback

LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_CALLBACK_URL=https://api.dealo.com/api/v1/auth/linkedin/callback

# Cloudflare R2
R2_ACCOUNT_ID=your-r2-account-id
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=dealo-storage
R2_REGION=auto
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com

# AI
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-pro

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@dealo.com

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Rate limiting
THROTTLE_TTL=60000
THROTTLE_LIMIT=100

# CORS
CORS_ORIGINS=http://localhost:3000,https://dealo.com,https://www.dealo.com

# App URLs
WEB_URL=https://dealo.com
API_URL=https://api.dealo.com
MOBILE_URL=capacitor://localhost

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=your-session-secret-min-32-chars

# Logging
LOG_LEVEL=info
LOG_MAX_FILES=14d
LOG_MAX_SIZE=20m
```

### **Installation**

```bash
# Clone repository
git clone <repository-url>
cd nest-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Create logs directory
mkdir logs

# Run database migrations (if needed)
npm run migration:run

# Start development server
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod
```

### **Docker Deployment**

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist
COPY logs ./logs

EXPOSE 3001

CMD ["node", "dist/main"]
```

```yaml
# docker-compose.yml
version: "3.8"

services:
  api:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/dealo
      - REDIS_HOST=redis
    depends_on:
      - mongo
      - redis
    volumes:
      - ./logs:/app/logs

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  mongo_data:
  redis_data:
```

## 🔄 Integration with Next.js

### **Same Database Connection**

Both the Next.js app and NestJS backend use the **exact same MongoDB URI**:

```typescript
// Next.js (database/index.ts)
export const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

// NestJS (app.module.ts)
MongooseModule.forRootAsync({
  useFactory: (configService) => ({
    uri: configService.get<string>('MONGODB_URI'), // SAME URI
  }),
  inject: [ConfigService],
}),
```

### **Identical User Models**

```typescript
// Both apps use the same User schema structure
interface User {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  avatar?: string;
  isEmailVerified: boolean;
  role: Role;
  credits: number;
  interests: string[];
  experience?: Experience;
  // ... all other fields identical
}
```

### **Shared Authentication**

```typescript
// Both apps can authenticate the same users
// JWT tokens work across both platforms
// OAuth flows are compatible
// User sessions are shared
```

### **API Response Format**

```typescript
// Consistent response format across both APIs
{
  success: true,
  data: {
    // Response data
  },
  pagination?: {
    page: number,
    limit: number,
    total: number,
    hasMore: boolean,
  },
  message?: string,
}
```

## 📊 Performance Metrics

### **Expected Performance**

- **Response Time**: < 200ms average
- **Throughput**: 1000+ requests/second
- **Uptime**: 99.9%+
- **Error Rate**: < 0.1%

### **Monitoring**

- **Application Metrics**: Request/response times, error rates
- **Database Metrics**: Query performance, connection pool status
- **Infrastructure Metrics**: CPU, memory, disk usage
- **Business Metrics**: User engagement, feature usage

## 🔮 Future Enhancements

### **Planned Features**

1. **Microservices Architecture**

   - Split into separate services
   - Service mesh implementation
   - Event-driven architecture

2. **Advanced Caching**

   - Redis cluster
   - CDN integration
   - Browser caching optimization

3. **Machine Learning**

   - Content recommendation engine
   - User behavior analysis
   - Automated moderation

4. **Real-time Analytics**
   - Live user tracking
   - Performance monitoring
   - Business intelligence

---

## 📞 Support

For technical support or questions about the implementation:

- **Documentation**: Check the `/docs` folder
- **API Reference**: Visit `/api/docs` when server is running
- **Issues**: Create an issue in the repository
- **Discussions**: Use GitHub Discussions

---

_This NestJS backend provides a production-grade, scalable API that perfectly mirrors the Next.js app's functionality while adding enterprise-level features for mobile apps and external services._
