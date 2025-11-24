# إعداد OAuth (Google, GitHub, Apple)

تم إضافة دعم تسجيل الدخول عبر OAuth للمنصة. يمكن للمستخدمين الآن التسجيل والدخول باستخدام Google أو GitHub أو Apple.

## الخطوات المطلوبة

### 1. تحديث قاعدة البيانات

قم بتشغيل migration لإضافة جدول OAuth accounts:

```bash
npx prisma migrate dev --name add_oauth_support
npx prisma generate
```

### 2. إعداد Google OAuth

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع جديد أو اختر مشروع موجود
3. اذهب إلى **APIs & Services** > **Credentials**
4. انقر على **Create Credentials** > **OAuth client ID**
5. اختر **Web application**
6. أضف **Authorized redirect URIs**:
   - للتطوير: `http://localhost:3000/api/auth/oauth/google/callback`
   - للإنتاج: `https://yourdomain.com/api/auth/oauth/google/callback`
7. انسخ **Client ID** و **Client Secret**

### 3. إعداد GitHub OAuth

1. اذهب إلى [GitHub Developer Settings](https://github.com/settings/developers)
2. انقر على **New OAuth App**
3. املأ المعلومات:
   - **Application name**: DocuMind
   - **Homepage URL**: `http://localhost:3000` (أو رابط الإنتاج)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/oauth/github/callback`
4. انقر على **Register application**
5. انسخ **Client ID** و **Client Secret**

### 4. إعداد Apple OAuth

1. اذهب إلى [Apple Developer Portal](https://developer.apple.com/account/)
2. اذهب إلى **Certificates, Identifiers & Profiles**
3. أنشئ **Services ID** جديد
4. فعّل **Sign in with Apple**
5. أضف **Return URLs**:
   - `http://localhost:3000/api/auth/oauth/apple/callback`
   - `https://yourdomain.com/api/auth/oauth/apple/callback`
6. أنشئ **Key** جديد لـ Sign in with Apple
7. انسخ **Client ID** و **Client Secret** (Key ID)

### 5. إعداد متغيرات البيئة

أضف المتغيرات التالية إلى ملف `.env`:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# Apple OAuth
APPLE_CLIENT_ID=your_apple_client_id_here
APPLE_CLIENT_SECRET=your_apple_client_secret_here
```

### 6. إعادة تشغيل الخادم

بعد إضافة المتغيرات، أعد تشغيل خادم التطوير:

```bash
npm run dev
```

## الميزات

- ✅ تسجيل الدخول والتسجيل عبر Google
- ✅ تسجيل الدخول والتسجيل عبر GitHub
- ✅ تسجيل الدخول والتسجيل عبر Apple
- ✅ ربط حسابات OAuth بحسابات موجودة (نفس البريد الإلكتروني)
- ✅ حفظ tokens للتحديث التلقائي
- ✅ دعم PKCE للأمان

## ملاحظات

- جميع مزودي OAuth مجانيون للاستخدام الأساسي
- المستخدمون الذين يسجلون عبر OAuth لا يحتاجون إلى كلمة مرور
- يمكن ربط حساب OAuth بحساب موجود إذا كان البريد الإلكتروني متطابقاً

