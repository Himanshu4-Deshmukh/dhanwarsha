# 🎰 Slot-Based Number Betting Game - NestJS Backend

A production-ready NestJS backend for a controlled betting game where users bet coins on numbers (0-99) in time-based slots, with admin-controlled outcomes.

## 🎯 System Overview

This is a **controlled betting game** (not random):
- Users bet 10 coins on numbers from 0–99 in fixed time slots
- Admin selects the winning number before slot closes
- At slot end, results are declared automatically via cron jobs
- Winning bets receive 95 coins payout

## 🛠️ Tech Stack

- **Framework:** NestJS (TypeScript)
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT with Passport
- **Authorization:** Role-Based Access Control (RBAC)
- **Security:** bcrypt for password hashing
- **Scheduling:** NestJS Cron for automated slot processing
- **Validation:** class-validator & class-transformer

## 📁 Project Structure

```
backend/
├── src/
│   ├── auth/                 # JWT authentication module
│   │   ├── dto/             # Login & Signup DTOs
│   │   ├── strategies/      # JWT strategy
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── users/               # User management
│   │   ├── schemas/         # User schema
│   │   ├── dto/             # User DTOs
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── wallet/              # Wallet management
│   │   ├── schemas/         # Wallet schema
│   │   ├── wallet.controller.ts
│   │   ├── wallet.service.ts
│   │   └── wallet.module.ts
│   ├── wallet-transactions/ # Transaction ledger
│   │   ├── schemas/         # Transaction schema
│   │   ├── dto/             # Transaction DTOs
│   │   ├── wallet-transactions.controller.ts
│   │   ├── wallet-transactions.service.ts
│   │   └── wallet-transactions.module.ts
│   ├── slots/               # Slot CRUD & automation
│   │   ├── schemas/         # Slot schema
│   │   ├── dto/             # Slot DTOs
│   │   ├── slots.controller.ts
│   │   ├── slots.service.ts (includes cron jobs)
│   │   └── slots.module.ts
│   ├── bets/                # Betting logic
│   │   ├── schemas/         # Bet schema
│   │   ├── dto/             # Bet DTOs
│   │   ├── bets.controller.ts
│   │   ├── bets.service.ts
│   │   └── bets.module.ts
│   ├── payments/            # Payment requests
│   │   ├── schemas/         # PaymentRequest schema
│   │   ├── dto/             # Payment DTOs
│   │   ├── payments.controller.ts
│   │   ├── payments.service.ts
│   │   └── payments.module.ts
│   ├── admin/               # Admin dashboard APIs
│   │   ├── dto/             # Admin DTOs
│   │   ├── admin.controller.ts
│   │   ├── admin.service.ts
│   │   └── admin.module.ts
│   ├── common/              # Shared resources
│   │   ├── enums/           # All enums
│   │   ├── decorators/      # Custom decorators
│   │   └── guards/          # Auth & Role guards
│   ├── app.module.ts        # Root module
│   ├── main.ts              # Application entry point
│   └── seed.ts              # Database seeding script
├── .env                     # Environment variables
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## 🗄️ Database Models

### User
```typescript
{
  name: string
  email: string (unique)
  password: string (hashed)
  role: 'USER' | 'ADMIN'
  isActive: boolean
  timestamps: true
}
```

### Wallet
```typescript
{
  userId: ObjectId (ref User, unique)
  balance: number (min: 0)
  timestamps: true
}
```

### WalletTransaction
```typescript
{
  userId: ObjectId (ref User)
  amount: number (+ credit / - debit)
  type: 'BET' | 'WIN' | 'ADMIN_CREDIT'
  referenceId: string (optional)
  timestamps: true
}
```

### Slot
```typescript
{
  startTime: Date
  endTime: Date
  status: 'OPEN' | 'CLOSED' | 'RESULT_DECLARED'
  betAmount: number (default: 10)
  winAmount: number (default: 95)
  winningNumber: number (0-99, nullable)
  timestamps: true
}
```

### Bet
```typescript
{
  slotId: ObjectId (ref Slot)
  userId: ObjectId (ref User)
  number: number (0-99)
  amount: number (default: 10)
  status: 'PENDING' | 'WON' | 'LOST'
  timestamps: true
}
```

### PaymentRequest
```typescript
{
  userId: ObjectId (ref User)
  amount: number (min: 1)
  screenshotUrl: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  adminRemark: string (optional)
  timestamps: true
}
```

## 🎮 Game Logic

### Betting Flow
1. User checks active slot (`GET /api/slots/active`)
2. User places bet with 10 coins (`POST /api/bets`)
3. Coins are instantly deducted from wallet
4. Bet is stored with status `PENDING`
5. Transaction record created with type `BET`

### Slot Lifecycle
1. **OPEN** - Betting allowed (startTime ≤ now ≤ endTime)
2. **CLOSED** - Slot ended, processing results
3. **RESULT_DECLARED** - Winners credited, all bets finalized

### Result Declaration (Automated)
- Cron job runs every 10 seconds
- Finds slots where `endTime < now` and `status = OPEN`
- If winning number is set:
  - Mark slot as `CLOSED`
  - Process all bets:
    - `number === winningNumber` → status: `WON`, credit 95 coins
    - `number !== winningNumber` → status: `LOST`
  - Mark slot as `RESULT_DECLARED`
- If winning number not set:
  - Mark slot as `CLOSED` (no results)

### Payment Flow
1. User submits payment request with screenshot
2. Admin reviews and approves/rejects
3. If approved → wallet credited, transaction recorded
4. If rejected → no wallet change

## 🔐 Authentication & Authorization

### Roles
- **USER** - Can bet, view own data, request payments
- **ADMIN** - Full access to all endpoints + admin panel

### Protected Routes
```typescript
// User-only routes
@UseGuards(JwtAuthGuard)

// Admin-only routes
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
```

### JWT Configuration
- Secret: Configurable via `JWT_SECRET` env variable
- Expiry: 30 days
- Payload: `{ userId, email, role }`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- MongoDB running on localhost:27017 (or configured URL)
- Yarn package manager

### Installation

```bash
# Install dependencies
cd /app/backend
yarn install

# Build the project
yarn build
```

### Environment Variables

Create `.env` file in `/app/backend/`:

```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
CORS_ORIGINS="*"
JWT_SECRET="your-secret-key-change-in-production"
```

### Database Seeding

```bash
# Seed database with admin, test user, and sample slots
yarn seed
```

**Default Credentials:**
- **Admin:** admin@example.com / Admin@123
- **Test User:** test@example.com / Test@123 (1000 coins)

### Running the Application

```bash
# Development mode (with hot reload)
yarn start:dev

# Production mode
yarn build
yarn start:prod
```

The server will start on `http://0.0.0.0:8001`

## 📡 API Endpoints

All endpoints are prefixed with `/api`

### Public Endpoints
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login

### User Endpoints (JWT Required)
- `GET /api/users/profile` - Get user profile
- `GET /api/wallet` - Get wallet details
- `GET /api/wallet/balance` - Get wallet balance
- `GET /api/wallet-transactions` - Get transaction history
- `GET /api/slots` - Get all slots
- `GET /api/slots/active` - Get active slot
- `GET /api/slots/:id` - Get slot by ID
- `POST /api/bets` - Place a bet
- `GET /api/bets/my-bets` - Get user's bets
- `POST /api/payments/request` - Submit payment request
- `GET /api/payments/my-requests` - Get payment requests

### Admin Endpoints (Admin Role Required)
- `POST /api/slots` - Create new slot
- `POST /api/slots/:id/winning-number` - Set winning number
- `GET /api/slots/:id/exposure` - Get bet exposure
- `GET /api/admin/users` - Get all users
- `GET /api/admin/bets` - Get all bets
- `GET /api/admin/transactions` - Get all transactions
- `GET /api/admin/payment-requests` - Get all payment requests
- `POST /api/admin/payment-requests/:id/approve` - Approve payment
- `POST /api/admin/payment-requests/:id/reject` - Reject payment
- `POST /api/admin/credit-wallet` - Credit user wallet
- `GET /api/admin/slots/:id/profit` - Get slot profit

📖 **Full API documentation:** See `API_DOCUMENTATION.md`

## 🧪 Testing the APIs

### Test User Login & Betting
```bash
# Login
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123"}'

# Get wallet balance (use token from login)
curl http://localhost:8001/api/wallet/balance \
  -H "Authorization: Bearer <your_token>"

# Get active slot
curl http://localhost:8001/api/slots/active \
  -H "Authorization: Bearer <your_token>"

# Place bet
curl -X POST http://localhost:8001/api/bets \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"slotId":"<slot_id>","number":42}'
```

### Test Admin Functions
```bash
# Admin login
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@123"}'

# Set winning number
curl -X POST http://localhost:8001/api/slots/<slot_id>/winning-number \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"winningNumber":42}'

# Get bet exposure
curl http://localhost:8001/api/slots/<slot_id>/exposure \
  -H "Authorization: Bearer <admin_token>"
```

## 🔒 Security Features

✅ Passwords hashed with bcrypt (salt rounds: 10)  
✅ JWT token-based authentication  
✅ Role-based access control  
✅ Wallet balance validation (never negative)  
✅ Request validation with DTOs  
✅ CORS enabled with configurable origins  
✅ Atomic wallet operations  
✅ MongoDB injection protection via Mongoose

## ⚡ Production Considerations

### Security
- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Use HTTPS in production
- [ ] Enable rate limiting (e.g., @nestjs/throttler)
- [ ] Add helmet for HTTP headers security
- [ ] Implement refresh tokens
- [ ] Add request logging & monitoring

### Features
- [ ] File upload service for payment screenshots (currently URL-based)
- [ ] Email notifications for payment approvals
- [ ] Admin audit logs
- [ ] WebSocket for real-time updates
- [ ] Advanced analytics & reporting

### Infrastructure
- [ ] Database backups (automated)
- [ ] Redis for caching
- [ ] Queue system for heavy operations (BullMQ)
- [ ] Horizontal scaling with PM2 or Kubernetes
- [ ] Health check endpoints
- [ ] Prometheus metrics

### Monitoring
- [ ] Cron job execution monitoring
- [ ] Database query performance
- [ ] Error tracking (Sentry)
- [ ] Application logging (Winston)

## 🐛 Known Limitations

1. **Payment Screenshots:** Currently accepts URLs, should implement file upload
2. **Cron Interval:** 10 seconds might be too frequent for production
3. **Pagination:** Not implemented for large data sets
4. **Soft Delete:** Users/data are hard-deleted
5. **Timezone:** All times in UTC, no user timezone support

## 📝 Code Quality

### Best Practices Followed
✅ Clean service-controller separation  
✅ DTOs for all requests with validation  
✅ Proper error handling with HTTP exceptions  
✅ Mongoose schemas with timestamps  
✅ Enums instead of magic strings  
✅ Module-based architecture  
✅ TypeScript strict mode  
✅ No business logic in controllers  

## 🤝 Contributing

1. Create feature branch
2. Follow existing code structure
3. Add proper DTOs with validation
4. Test all endpoints
5. Update API documentation
6. Submit pull request

## 📄 License

This project is for demonstration purposes.

## 📞 Support

For issues, questions, or feature requests, please contact the development team.

---

**Built with ❤️ using NestJS**  
**Version:** 1.0.0  
**Last Updated:** February 15, 2026
