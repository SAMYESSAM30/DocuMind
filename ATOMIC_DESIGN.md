# Atomic Design Pattern Documentation

## نظرة عامة (Overview)

تم تطبيق **Atomic Design Pattern** على الفرونت إند لتقسيم المكونات بشكل هرمي ومنظم. هذا النمط يساعد في:
- إعادة استخدام المكونات
- سهولة الصيانة
- قابلية التوسع
- تنظيم الكود بشكل أفضل

## هيكل Atomic Design

### 1. Atoms (الذرات) - `components/atoms/`
**أصغر المكونات الأساسية التي لا يمكن تقسيمها أكثر**

المكونات الحالية:
- `Icon.tsx` - أيقونة قابلة لإعادة الاستخدام
- `Label.tsx` - تسمية مع مؤشر اختياري للإلزامية
- `ErrorMessage.tsx` - رسالة خطأ
- `Spinner.tsx` - مؤشر تحميل
- `FileIcon.tsx` - أيقونة ملف مع خلفية

**خصائص Atoms:**
- لا تحتوي على منطق معقد
- قابلة لإعادة الاستخدام في أي مكان
- مستقلة تماماً

### 2. Molecules (الجزيئات) - `components/molecules/`
**مكونات مركبة من Atoms**

المكونات الحالية:
- `FormField.tsx` - حقل نموذج (Label + Input + ErrorMessage)
- `FileCard.tsx` - بطاقة ملف (FileIcon + معلومات الملف + أزرار)
- `Dropzone.tsx` - منطقة رفع الملفات
- `ProgressBar.tsx` - شريط التقدم مع التسمية والنسبة
- `UserInfo.tsx` - معلومات المستخدم (User + Email + Plan + Usage)

**خصائص Molecules:**
- تتكون من عدة Atoms
- لها وظيفة محددة
- يمكن إعادة استخدامها في سياقات مختلفة

### 3. Organisms (الكائنات) - `components/organisms/`
**مكونات معقدة من Molecules و Atoms**

المكونات الحالية:
- `AppHeader.tsx` - رأس التطبيق (UserInfo + Navigation + Actions)
- `FileUpload.tsx` - رفع الملفات الكامل (Dropzone + FileCard + Validation)
- `ProcessingStatus.tsx` - حالة المعالجة (ProgressBar + Error Handling + Skeleton)

**خصائص Organisms:**
- تتكون من Molecules و Atoms
- لها منطق معقد
- تمثل أقسام كاملة من الواجهة

### 4. Templates (القوالب) - `components/templates/`
**تخطيطات الصفحات**

المكونات الحالية:
- `AnalyzePageTemplate.tsx` - قالب صفحة التحليل
- `AuthPageTemplate.tsx` - قالب صفحات المصادقة

**خصائص Templates:**
- تحدد هيكل الصفحة
- لا تحتوي على بيانات فعلية
- قابلة لإعادة الاستخدام

### 5. Pages (الصفحات) - `app/`
**الصفحات الفعلية مع البيانات**

الصفحات الحالية:
- `app/analyze/page.tsx` - صفحة التحليل
- `app/login/page.tsx` - صفحة تسجيل الدخول

**خصائص Pages:**
- تستخدم Templates
- تحتوي على البيانات والمنطق
- الصفحات الفعلية للتطبيق

## هيكل الملفات

```
components/
├── atoms/                    # أصغر المكونات
│   ├── Icon.tsx
│   ├── Label.tsx
│   ├── ErrorMessage.tsx
│   ├── Spinner.tsx
│   └── FileIcon.tsx
│
├── molecules/                 # مكونات مركبة
│   ├── FormField.tsx
│   ├── FileCard.tsx
│   ├── Dropzone.tsx
│   ├── ProgressBar.tsx
│   └── UserInfo.tsx
│
├── organisms/                 # مكونات معقدة
│   ├── AppHeader.tsx
│   ├── FileUpload.tsx
│   └── ProcessingStatus.tsx
│
├── templates/                 # قوالب الصفحات
│   ├── AnalyzePageTemplate.tsx
│   └── AuthPageTemplate.tsx
│
├── auth/                      # مكونات المصادقة (Organisms)
│   ├── LoginForm.tsx
│   ├── OAuthButtons.tsx
│   └── LoadingSpinner.tsx
│
└── ui/                        # مكونات UI الأساسية (shadcn/ui)
    ├── button.tsx
    ├── card.tsx
    └── ...
```

## أمثلة الاستخدام

### استخدام Atom
```tsx
import { Spinner } from "@/components/atoms/Spinner";

<Spinner size="lg" />
```

### استخدام Molecule
```tsx
import { FormField } from "@/components/molecules/FormField";

<FormField
  name="email"
  label="Email"
  type="email"
  required
/>
```

### استخدام Organism
```tsx
import { FileUpload } from "@/components/organisms/FileUpload";

<FileUpload
  onFileSelect={handleFileSelect}
  isProcessing={isProcessing}
/>
```

### استخدام Template
```tsx
import { AnalyzePageTemplate } from "@/components/templates/AnalyzePageTemplate";

<AnalyzePageTemplate
  header={<AppHeader user={user} onLogout={handleLogout} />}
  title={title}
  subtitle={subtitle}
  content={content}
/>
```

## مبادئ Atomic Design

### 1. التدرج الهرمي
```
Atoms → Molecules → Organisms → Templates → Pages
```

### 2. إعادة الاستخدام
- Atoms يمكن استخدامها في أي مكان
- Molecules يمكن استخدامها في عدة Organisms
- Organisms يمكن استخدامها في عدة Templates

### 3. الاستقلالية
- كل مكون مستقل ويمكن اختباره بشكل منفصل
- لا تعتمد المكونات الصغيرة على المكونات الكبيرة

### 4. التخصص
- كل مكون له مسؤولية واحدة واضحة
- لا تخلط بين مستويات Atomic Design

## الفوائد

1. **قابلية الصيانة**: سهولة العثور على المكونات وتعديلها
2. **إعادة الاستخدام**: المكونات قابلة لإعادة الاستخدام في أماكن مختلفة
3. **الاختبار**: سهولة اختبار كل مكون بشكل منفصل
4. **التنظيم**: بنية واضحة ومنظمة
5. **التوسع**: سهولة إضافة مكونات جديدة

## إرشادات الاستخدام

### متى تستخدم Atom؟
- عندما تحتاج مكون أساسي بسيط
- عندما لا يحتوي على منطق معقد
- عندما يمكن إعادة استخدامه في أماكن كثيرة

### متى تستخدم Molecule?
- عندما تحتاج مكون مركب من عدة Atoms
- عندما يكون له وظيفة محددة
- عندما يمكن إعادة استخدامه في سياقات مختلفة

### متى تستخدم Organism?
- عندما تحتاج مكون معقد من Molecules و Atoms
- عندما يمثل قسم كامل من الواجهة
- عندما يحتوي على منطق معقد

### متى تستخدم Template?
- عندما تحتاج تخطيط صفحة
- عندما تريد فصل الهيكل عن المحتوى
- عندما يمكن إعادة استخدام التخطيط

## ملاحظات مهمة

1. **لا تقفز المستويات**: استخدم المستويات بالترتيب (Atom → Molecule → Organism)
2. **الاستقلالية**: لا تجعل Atom يعتمد على Molecule
3. **التخصص**: كل مكون له مسؤولية واحدة
4. **إعادة الاستخدام**: فكر في إعادة الاستخدام عند إنشاء المكونات

## التكامل مع Clean Architecture

Atomic Design يعمل جنباً إلى جنب مع Clean Architecture:
- **Atoms/Molecules/Organisms**: في طبقة Presentation
- **Templates**: في طبقة Presentation
- **Pages**: في طبقة Application/Presentation
- **Business Logic**: في طبقة Application (Hooks, Services)

## أمثلة من المشروع

### مثال 1: FormField (Molecule)
```tsx
// يتكون من: Label (Atom) + Input + ErrorMessage (Atom)
<FormField
  name="email"
  label="Email"
  type="email"
  required
/>
```

### مثال 2: FileUpload (Organism)
```tsx
// يتكون من: Dropzone (Molecule) + FileCard (Molecule) + Validation Logic
<FileUpload
  onFileSelect={handleFileSelect}
  isProcessing={isProcessing}
/>
```

### مثال 3: AnalyzePageTemplate (Template)
```tsx
// يستخدم: AppHeader (Organism) + Content (Organisms/Molecules)
<AnalyzePageTemplate
  header={<AppHeader user={user} onLogout={handleLogout} />}
  title={title}
  subtitle={subtitle}
  content={content}
/>
```

