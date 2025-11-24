# File Structure Documentation

## نظرة عامة (Overview)

هذا المشروع يستخدم **Clean Architecture** للباك إند و **Atomic Design Pattern** للفرونت إند.

## البنية الكاملة

```
DocuMind Web App/
│
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Marketing routes group
│   ├── analyze/                  # Analyze page
│   │   └── page.tsx              # Uses Atomic Design
│   ├── api/                      # API Routes
│   │   ├── analyses/             # Analysis endpoints
│   │   └── auth/                 # Authentication endpoints
│   │       ├── login/            # Login endpoint
│   │       ├── signup/           # Signup endpoint
│   │       ├── logout/           # Logout endpoint
│   │       ├── me/               # Current user endpoint
│   │       └── oauth/            # OAuth endpoints
│   ├── checkout/                 # Checkout page
│   ├── dashboard/                # Dashboard page
│   ├── login/                    # Login page (Atomic Design)
│   ├── signup/                   # Signup page
│   ├── page.tsx                   # Home page
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles
│
├── components/                    # React Components (Atomic Design)
│   ├── atoms/                     # Atomic Components
│   │   ├── Icon.tsx
│   │   ├── Label.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── Spinner.tsx
│   │   ├── FileIcon.tsx
│   │   └── index.ts               # Barrel export
│   │
│   ├── molecules/                 # Molecular Components
│   │   ├── FormField.tsx
│   │   ├── FileCard.tsx
│   │   ├── Dropzone.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── UserInfo.tsx
│   │   └── index.ts               # Barrel export
│   │
│   ├── organisms/                 # Organism Components
│   │   ├── AppHeader.tsx
│   │   ├── FileUpload.tsx
│   │   ├── ProcessingStatus.tsx
│   │   └── index.ts               # Barrel export
│   │
│   ├── templates/                 # Template Components
│   │   ├── AnalyzePageTemplate.tsx
│   │   ├── AuthPageTemplate.tsx
│   │   └── index.ts               # Barrel export
│   │
│   ├── auth/                      # Auth-specific components
│   │   ├── LoginForm.tsx
│   │   ├── OAuthButtons.tsx
│   │   └── LoadingSpinner.tsx
│   │
│   ├── ui/                        # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   │
│   ├── file-upload.tsx             # Legacy (to be migrated)
│   ├── results-display.tsx         # Results display
│   ├── role-selector.tsx           # Role selector
│   ├── contact-sales-form.tsx      # Contact form
│   ├── i18n-provider.tsx           # i18n provider
│   ├── loader.tsx                  # Loader
│   └── redux-provider.tsx          # Redux provider
│
├── lib/                            # Library Code (Clean Architecture)
│   ├── domain/                     # Domain Layer
│   │   ├── entities/              # Domain Entities
│   │   │   ├── User.ts
│   │   │   └── Session.ts
│   │   └── interfaces/            # Domain Interfaces
│   │       ├── IUserRepository.ts
│   │       ├── ISessionRepository.ts
│   │       ├── IAuthService.ts
│   │       └── IOAuthStrategy.ts
│   │
│   ├── application/                # Application Layer
│   │   ├── services/              # Application Services
│   │   │   └── AuthService.ts
│   │   ├── validators/             # Validation Schemas
│   │   │   └── AuthValidators.ts
│   │   ├── constants/              # Constants
│   │   │   └── AuthConstants.ts
│   │   ├── hooks/                  # Custom Hooks
│   │   │   └── useAuth.ts
│   │   └── di/                     # Dependency Injection
│   │       └── ServiceContainer.ts
│   │
│   ├── infrastructure/             # Infrastructure Layer
│   │   ├── repositories/           # Repository Implementations
│   │   │   ├── UserRepository.ts
│   │   │   └── SessionRepository.ts
│   │   ├── security/               # Security Services
│   │   │   ├── PasswordHasher.ts
│   │   │   └── SessionTokenGenerator.ts
│   │   └── oauth/                  # OAuth Services
│   │       ├── OAuthStrategyFactory.ts
│   │       ├── OAuthTokenExchange.ts
│   │       ├── OAuthUserInfoFetcher.ts
│   │       ├── OAuthUserService.ts
│   │       └── strategies/         # OAuth Strategies
│   │           ├── GoogleOAuthStrategy.ts
│   │           ├── GitHubOAuthStrategy.ts
│   │           └── AppleOAuthStrategy.ts
│   │
│   ├── slices/                      # Redux Slices
│   │   ├── authSlice.ts
│   │   └── uiSlice.ts
│   │
│   ├── auth.ts                     # Legacy auth utilities
│   ├── auth-context.tsx             # Auth context
│   ├── db.ts                       # Database connection
│   ├── frontend-llm.ts             # Frontend LLM
│   ├── frontend-parser.ts          # Frontend parser
│   ├── hooks.ts                    # Redux hooks
│   ├── i18n-config.ts             # i18n configuration
│   ├── oauth.ts                    # Legacy OAuth utilities
│   ├── pdf-generator.ts            # PDF generator
│   ├── store.ts                    # Redux store
│   ├── types.ts                    # TypeScript types
│   └── utils.ts                    # Utility functions
│
├── prisma/                         # Prisma ORM
│   ├── schema.prisma               # Database schema
│   ├── migrations/                 # Database migrations
│   └── dev.db                      # SQLite database
│
├── public/                         # Static files
│   ├── locales/                    # i18n translations
│   │   └── en/
│   │       ├── common.json
│   │       └── translation.json
│   ├── sample-brd.txt              # Sample BRD
│   └── training-brds/              # Training BRDs
│
├── ARCHITECTURE.md                  # Clean Architecture docs
├── ATOMIC_DESIGN.md                 # Atomic Design docs
├── FILE_STRUCTURE.md                # This file
├── OAUTH_SETUP.md                   # OAuth setup guide
├── GROQ_SETUP.md                    # Groq setup guide
├── README.md                        # Project README
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── tailwind.config.ts               # Tailwind config
└── next.config.mjs                  # Next.js config
```

## طبقات Clean Architecture

### 1. Domain Layer (`lib/domain/`)
- **Entities**: كيانات المجال الأساسية
- **Interfaces**: واجهات التعريف للخدمات والمستودعات

### 2. Application Layer (`lib/application/`)
- **Services**: خدمات التطبيق
- **Validators**: قواعد التحقق
- **Constants**: الثوابت
- **Hooks**: Custom Hooks
- **DI**: Dependency Injection

### 3. Infrastructure Layer (`lib/infrastructure/`)
- **Repositories**: تنفيذ واجهات Repository
- **Security**: خدمات الأمان
- **OAuth**: خدمات OAuth

## مستويات Atomic Design

### 1. Atoms (`components/atoms/`)
- أصغر المكونات الأساسية
- لا تحتوي على منطق معقد
- قابلة لإعادة الاستخدام

### 2. Molecules (`components/molecules/`)
- مكونات مركبة من Atoms
- لها وظيفة محددة
- قابلة لإعادة الاستخدام

### 3. Organisms (`components/organisms/`)
- مكونات معقدة من Molecules و Atoms
- تمثل أقسام كاملة من الواجهة
- تحتوي على منطق معقد

### 4. Templates (`components/templates/`)
- تخطيطات الصفحات
- تحدد هيكل الصفحة
- قابلة لإعادة الاستخدام

### 5. Pages (`app/`)
- الصفحات الفعلية
- تحتوي على البيانات والمنطق
- تستخدم Templates

## إرشادات التنظيم

### إضافة مكون جديد

1. **Atom**: ضعه في `components/atoms/`
2. **Molecule**: ضعه في `components/molecules/`
3. **Organism**: ضعه في `components/organisms/`
4. **Template**: ضعه في `components/templates/`

### إضافة خدمة جديدة

1. **Interface**: ضعها في `lib/domain/interfaces/`
2. **Service**: ضعها في `lib/application/services/`
3. **Repository**: ضعها في `lib/infrastructure/repositories/`

### إضافة صفحة جديدة

1. أنشئ ملف `page.tsx` في `app/[route]/`
2. استخدم Templates المناسبة
3. استخدم Organisms و Molecules و Atoms

## ملاحظات مهمة

1. **لا تقفز المستويات**: استخدم المستويات بالترتيب
2. **الاستقلالية**: لا تجعل المكونات الصغيرة تعتمد على الكبيرة
3. **إعادة الاستخدام**: فكر في إعادة الاستخدام عند إنشاء المكونات
4. **التخصص**: كل مكون له مسؤولية واحدة

