# Clean Architecture & Design Patterns Documentation

## نظرة عامة (Overview)

تم إعادة هيكلة المشروع باستخدام **Clean Architecture** و **Design Patterns** و **Clean Code Principles** لتحسين قابلية الصيانة والتوسع والاختبار.

## البنية المعمارية (Architecture Layers)

### 1. Domain Layer (`lib/domain/`)
**الطبقة الأساسية - تحتوي على منطق الأعمال الأساسي**

- **Entities**: الكيانات الأساسية (User, Session)
- **Interfaces**: واجهات التعريف للـ Repositories و Services
  - `IUserRepository`: واجهة للوصول لبيانات المستخدم
  - `ISessionRepository`: واجهة للوصول لبيانات الجلسات
  - `IAuthService`: واجهة لخدمات المصادقة
  - `IOAuthStrategy`: واجهة لاستراتيجيات OAuth

### 2. Application Layer (`lib/application/`)
**طبقة التطبيق - تحتوي على منطق التطبيق**

- **Services**: خدمات التطبيق (AuthService)
- **Validators**: قواعد التحقق من البيانات
- **Constants**: الثوابت المركزية
- **Hooks**: Custom Hooks لفصل منطق UI
- **DI**: Dependency Injection Container

### 3. Infrastructure Layer (`lib/infrastructure/`)
**طبقة البنية التحتية - تنفيذ الوصول للبيانات والخدمات الخارجية**

- **Repositories**: تنفيذ واجهات Repository
  - `UserRepository`: تنفيذ IUserRepository باستخدام Prisma
  - `SessionRepository`: تنفيذ ISessionRepository باستخدام Prisma
- **Security**: خدمات الأمان
  - `PasswordHasher`: تشفير كلمات المرور
  - `SessionTokenGenerator`: توليد رموز الجلسات
- **OAuth**: خدمات OAuth
  - `OAuthStrategyFactory`: Factory Pattern لإنشاء استراتيجيات OAuth
  - `OAuthTokenExchange`: تبادل رموز OAuth
  - `OAuthUserInfoFetcher`: جلب معلومات المستخدم من OAuth
  - `OAuthUserService`: خدمة إدارة مستخدمي OAuth
  - **Strategies**: استراتيجيات OAuth المختلفة
    - `GoogleOAuthStrategy`
    - `GitHubOAuthStrategy`
    - `AppleOAuthStrategy`

### 4. Presentation Layer (`components/`, `app/`)
**طبقة العرض - واجهة المستخدم**

- **Components**: مكونات UI منفصلة
  - `LoginForm`: نموذج تسجيل الدخول
  - `OAuthButtons`: أزرار OAuth
  - `LoadingSpinner`: مؤشر التحميل
- **Pages**: صفحات التطبيق

## Design Patterns المستخدمة

### 1. Repository Pattern
**فصل منطق الوصول للبيانات عن منطق الأعمال**

```typescript
// Interface
interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(userData: CreateUserData): Promise<User>;
}

// Implementation
class UserRepository implements IUserRepository {
  // Prisma implementation
}
```

### 2. Service Layer Pattern
**فصل منطق الأعمال عن طبقة العرض**

```typescript
class AuthService implements IAuthService {
  async login(email: string, password: string): Promise<LoginResult> {
    // Business logic here
  }
}
```

### 3. Strategy Pattern
**للمصادقة عبر OAuth providers المختلفة**

```typescript
interface IOAuthStrategy {
  getAuthorizationUrl(redirectUri: string): Promise<OAuthAuthorizationUrl>;
  handleCallback(code: string, state: string): Promise<OAuthCallbackResult>;
}

class GoogleOAuthStrategy implements IOAuthStrategy { }
class GitHubOAuthStrategy implements IOAuthStrategy { }
class AppleOAuthStrategy implements IOAuthStrategy { }
```

### 4. Factory Pattern
**لإنشاء استراتيجيات OAuth المناسبة**

```typescript
class OAuthStrategyFactory {
  static create(provider: OAuthProvider): IOAuthStrategy {
    switch (provider) {
      case 'google': return new GoogleOAuthStrategy(...);
      case 'github': return new GitHubOAuthStrategy(...);
      case 'apple': return new AppleOAuthStrategy(...);
    }
  }
}
```

### 5. Dependency Injection Pattern
**لإدارة التبعيات بشكل مركزي**

```typescript
class ServiceContainer {
  private _authService: IAuthService;
  
  get authService(): IAuthService {
    return this._authService;
  }
}
```

### 6. Singleton Pattern
**لضمان وجود instance واحد من الخدمات**

```typescript
class ServiceContainer {
  private static instance: ServiceContainer;
  
  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }
}
```

## Clean Code Principles

### 1. Single Responsibility Principle (SRP)
كل كلاس أو دالة لها مسؤولية واحدة فقط:
- `PasswordHasher`: فقط تشفير كلمات المرور
- `SessionTokenGenerator`: فقط توليد رموز الجلسات
- `OAuthTokenExchange`: فقط تبادل رموز OAuth

### 2. Open/Closed Principle (OCP)
يمكن إضافة OAuth providers جديدة دون تعديل الكود الموجود:
- إضافة `TwitterOAuthStrategy` جديد دون تعديل `OAuthStrategyFactory`

### 3. Dependency Inversion Principle (DIP)
الاعتماد على الواجهات (Interfaces) وليس التنفيذ:
- `AuthService` يعتمد على `IUserRepository` وليس `UserRepository`

### 4. Separation of Concerns
فصل الاهتمامات:
- **Validation**: في `AuthValidators.ts`
- **Constants**: في `AuthConstants.ts`
- **Business Logic**: في `AuthService.ts`
- **UI Logic**: في `useAuth` hook

## هيكل الملفات

```
lib/
├── domain/                    # Domain Layer
│   ├── entities/            # Domain Entities
│   │   ├── User.ts
│   │   └── Session.ts
│   └── interfaces/          # Domain Interfaces
│       ├── IUserRepository.ts
│       ├── ISessionRepository.ts
│       ├── IAuthService.ts
│       └── IOAuthStrategy.ts
├── application/              # Application Layer
│   ├── services/            # Application Services
│   │   └── AuthService.ts
│   ├── validators/          # Validation Schemas
│   │   └── AuthValidators.ts
│   ├── constants/           # Constants
│   │   └── AuthConstants.ts
│   ├── hooks/               # Custom Hooks
│   │   └── useAuth.ts
│   └── di/                  # Dependency Injection
│       └── ServiceContainer.ts
└── infrastructure/          # Infrastructure Layer
    ├── repositories/        # Repository Implementations
    │   ├── UserRepository.ts
    │   └── SessionRepository.ts
    ├── security/            # Security Services
    │   ├── PasswordHasher.ts
    │   └── SessionTokenGenerator.ts
    └── oauth/               # OAuth Services
        ├── OAuthStrategyFactory.ts
        ├── OAuthTokenExchange.ts
        ├── OAuthUserInfoFetcher.ts
        ├── OAuthUserService.ts
        └── strategies/      # OAuth Strategies
            ├── GoogleOAuthStrategy.ts
            ├── GitHubOAuthStrategy.ts
            └── AppleOAuthStrategy.ts

components/
└── auth/                    # Auth Components
    ├── LoginForm.tsx
    ├── OAuthButtons.tsx
    └── LoadingSpinner.tsx
```

## كيفية الاستخدام

### استخدام AuthService

```typescript
import { serviceContainer } from '@/lib/application/di/ServiceContainer';

const authService = serviceContainer.authService;
const result = await authService.login(email, password);
```

### استخدام OAuth Strategy

```typescript
import { OAuthStrategyFactory } from '@/lib/infrastructure/oauth/OAuthStrategyFactory';

const strategy = OAuthStrategyFactory.create('google');
const { url, state } = await strategy.getAuthorizationUrl(redirectUri);
```

### استخدام Custom Hook

```typescript
import { useAuth } from '@/lib/application/hooks/useAuth';

function MyComponent() {
  const { handleLogin, handleOAuthLogin } = useAuth();
  // ...
}
```

## الفوائد

1. **قابلية الصيانة**: الكود منظم وواضح
2. **قابلية التوسع**: سهولة إضافة ميزات جديدة
3. **قابلية الاختبار**: كل طبقة قابلة للاختبار بشكل منفصل
4. **إعادة الاستخدام**: المكونات والخدمات قابلة لإعادة الاستخدام
5. **المرونة**: سهولة تغيير التنفيذ دون التأثير على الكود الآخر

## ملاحظات

- تم الحفاظ على التوافق مع الكود القديم حيث أمكن
- جميع الواجهات (Interfaces) في طبقة Domain
- جميع التنفيذات (Implementations) في طبقة Infrastructure
- منطق الأعمال في طبقة Application

