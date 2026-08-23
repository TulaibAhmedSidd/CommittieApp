# CommittieApp Social Media Brand Kit & Metadata Specifications
**Date of Creation**: August 23, 2026  
**File Location**: `/2026-08-23/SOCIAL_MEDIA_KIT.md`

---

## 1. Visual Brand Assets & Logomarks

The visual identity of **CommittieApp** uses a premium dark navy background (`#020617`), emerald green security shield accents (`#16a34a`), metallic gold savings loop rings (`#f59e0b`), and the **Verified Blue Tick** checkmark.

### Asset Directory & Files
* **Main App Logo / Favicon**: [`/public/images/committie_logo_app.jpg`](file:///d:/ReactProjects/Committie/CommittieApp/public/images/committie_logo_app.jpg) *(1:1 Square, 1024x1024)*
* **YouTube / Social Avatar**: [`/public/images/committie_logo_app.jpg`](file:///d:/ReactProjects/Committie/CommittieApp/public/images/committie_logo_app.jpg) *(1:1 Profile Avatar)*
* **YouTube Channel Banner**: [`/public/images/youtube_banner_committie.jpg`](file:///d:/ReactProjects/Committie/CommittieApp/public/images/youtube_banner_committie.jpg) *(16:9 Landscape Banner, 2560x1440 TV / Mobile Safe Area)*

---

## 2. YouTube Channel Metadata

### Channel Setup
* **Channel Name**: `CommittieApp - Digital Savings Circles`
* **Channel Handle**: `@CommittieApp`
* **Category**: `Finance & Technology`

### Channel About / Description (English)
> Welcome to the official YouTube channel of **CommittieApp** — Pakistan’s premier digitized savings circle (Committee / ROSCA) platform!  
>  
> CommittieApp digitizes traditional saving committees with bank-grade security, identity verification (CNIC & Utility Bills), automated fair draws, real-time receipt verification, and complete audit logging. Whether you are a member looking to save or a verified organizer managing savings circles, CommittieApp brings total transparency and peace of mind.  
>  
> 🔗 **Official Website**: https://committie-app.vercel.app  
> 📱 **Download / Web Access**: https://committie-app.vercel.app/login  
> 🛡️ **Verified Identity Portal**: https://committie-app.vercel.app/userDash/profile  

### Channel About / Description (Urdu · اردو)
> **کمیٹی ایپ** کے آفیشل یوٹیوب چینل میں خوش آمدید!  
>  
> کمیٹی ایپ پاکستان کا پہلا بااعتماد اور ڈیجیٹل کمیٹی پلیٹ فارم ہے جو آپ کی روایتی کمیٹی کے نظام کو محفوظ، شفاف اور آسان بناتا ہے۔ شناختی تصدیق (سی این آئی سی)، خودکار شفاف قرعہ اندازی، اور وصولی کی رسیدوں کی آن لائن تصدیق کے ساتھ اب ہر ممبر اور آرگنائزر کے لیے کمیٹی چلانا انتہائی آسان ہے۔  
>  
> 🌐 **آفیشل ویب سائٹ**: https://committie-app.vercel.app  

### Channel Keywords & Tags
```text
CommittieApp, Digital Committee, ROSCA Pakistan, Committee App, Saving Circle, Online Committee System, Verified Organizers, CNIC Verification, Financial Savings Pakistan, Committee Draw Algorithm, BCO Management, Committee Receipt Verification
```

---

## 3. Video Title & Description Templates

### Video Template 1: App Introduction & Overview
* **Title**: `How to Use CommittieApp: Complete Digital Savings & Committee Guide (English & Urdu)`
* **Description**:
```text
Learn how to use CommittieApp to join verified savings circles or create your own committee in 5 simple steps!

📌 TIMESTAMPS:
0:00 - Introduction to CommittieApp
0:45 - Member Identity Verification & Blue Tick
1:30 - How to Explore & Join Open Committees
2:45 - Monthly Payment Receipt Upload
4:00 - Organizer 5-Step Committee Creation
5:15 - Automated Fair Draw Announcement
6:30 - Security & Audit Logs

🌐 Visit Web App: https://committie-app.vercel.app
#CommittieApp #DigitalCommittee #FintechPakistan #SavingsCircle
```

---

## 4. Instagram Profile Metadata

* **Name**: `CommittieApp · ڈیجیٹل کمیٹی`
* **Username**: `@committie.app`
* **Category**: `Fintech / Financial Service`
* **Bio**:
```text
🛡️ Pakistan’s #1 Digital Committee Platform
✨ Verified Members & Blue Tick Profiles
💰 100% Transparent Monthly Payments & Draws
🌐 Join or Organize Savings Circles Today👇
linktr.ee/committieapp
```
* **Story Highlights Setup**:
  1. 🛡️ **Verification**: CNIC & Document Upload guide.
  2. 📱 **How To Join**: Step-by-step pool registration.
  3. 👑 **Organizers**: 5-step pool creation wizard.
  4. 💬 **Reviews**: Member testimonials & trust stats.

---

## 5. Facebook Page Metadata

* **Page Name**: `CommittieApp`
* **Username**: `@CommittieAppOfficial`
* **Category**: `Financial Technology Company`
* **Action Button**: `Use App` -> `https://committie-app.vercel.app`
* **About Story**:
```text
CommittieApp modernizes traditional Pakistani committee savings. Our platform bridges trust gaps through mandatory CNIC identity verification, organizer governance, real-time payment reconciliation, and automated fair drawing algorithms. Experience effortless community savings today.
```

---

## 6. Website OpenGraph & Meta Tags Code

Add the following metadata configuration snippet into `app/layout.tsx` for optimal SEO and social media link previews:

```typescript
export const metadata = {
  title: "CommittieApp — Smart, Transparent & Verified Savings Circles",
  description: "Digitize your traditional saving committees with bank-grade identity verification, automated fair draws, and real-time payment reconciliation.",
  keywords: ["CommittieApp", "Digital Committee", "ROSCA Pakistan", "Savings Circle", "Committee Management"],
  authors: [{ name: "CommittieApp Team" }],
  openGraph: {
    title: "CommittieApp — Smart, Transparent & Verified Savings Circles",
    description: "Join verified savings circles in Pakistan with instant identity checks, transparent payment receipts, and automated draws.",
    url: "https://committie-app.vercel.app",
    siteName: "CommittieApp",
    images: [
      {
        url: "https://committie-app.vercel.app/images/youtube_banner_committie.jpg",
        width: 1200,
        height: 630,
        alt: "CommittieApp Platform Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CommittieApp — Digital Savings Circles",
    description: "Bank-grade identity verification and transparent ROSCA saving circles.",
    images: ["https://committie-app.vercel.app/images/youtube_banner_committie.jpg"],
  },
};
```
