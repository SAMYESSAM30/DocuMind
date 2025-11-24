# إعداد Groq API

## الخطوات:

### 1. الحصول على API Key مجاناً:
1. اذهب إلى: https://console.groq.com/
2. سجّل حساب جديد (مجاني)
3. اذهب إلى "API Keys" في القائمة
4. أنشئ API Key جديد
5. انسخ الـ Key (يبدأ بـ `gsk_`)

### 2. إضافة الـ Key إلى `.env.local`:

افتح ملف `.env.local` وأضف:

```env
NEXT_PUBLIC_GROQ_API_KEY=gsk_your_actual_key_here
NEXT_PUBLIC_GROQ_MODEL=llama-3.1-70b-versatile
```

### 3. الموديلات المتاحة في Groq:

- `llama-3.1-70b-versatile` - الأفضل (موصى به)
- `llama-3.1-8b-instant` - الأسرع
- `mixtral-8x7b-32768` - بديل جيد

### 4. إعادة تشغيل السيرفر:

```bash
# أوقف السيرفر (Ctrl+C)
# ثم أعد تشغيله
npm run dev
```

## مميزات Groq:

✅ **مجاني تماماً** - لا توجد رسوم  
✅ **سريع جداً** - أسرع من OpenAI  
✅ **لا يوجد quota limits** - استخدام غير محدود  
✅ **متوافق مع OpenAI API** - نفس الـ format

## ملاحظات:

- الـ API key سيكون مرئياً في المتصفح (frontend)
- هذا آمن للاستخدام في التطوير
- للـ production، يُفضل استخدام backend API route

