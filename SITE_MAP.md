# Prompthis - Website Sitemap

## 🌐 Main Website Structure

### 📄 **Pages & Routes**

#### 1. **Home Page** (`/`)
- **Priority**: High (1.0)
- **Description**: Main landing page with prompt builder
- **Features**:
  - Hero section with logo and tagline
  - Prompt template selection (6 templates)
  - Custom prompt input
  - AI-powered prompt generation
  - Copy/Download functionality
  - User authentication modal
  - Pricing modal
  - Prompt history (hamburger menu)

#### 2. **Success Page** (`/success`)
- **Priority**: Medium (0.3)
- **Description**: Post-payment confirmation page
- **Features**:
  - Payment confirmation message
- **Access**: Via Stripe checkout redirect

#### 3. **Pricing Page** (`/pricing`)
- **Priority**: High (0.8)
- **Description**: Subscription plans modal
- **Features**:
  - Plus Plan ($3.99/month)
  - Platinum Plan ($14.99/month)
  - Feature comparisons
  - Stripe checkout integration

#### 4. **Authentication** (`/auth`)
- **Priority**: Medium (0.6)
- **Description**: Login/Signup modal
- **Features**:
  - Email/password authentication
  - Supabase integration
  - Session management

### 🔧 **API Endpoints**

#### 1. **Stripe Checkout** (`/api/create-checkout-session`)
- **Priority**: Low (0.1)
- **Description**: Serverless function for payment processing
- **Features**:
  - Creates Stripe checkout sessions
  - Handles subscription creation

---

## 🎯 **User Journey Flow**

### **Free User Journey:**
1. **Landing** → Home page with prompt builder
2. **First Prompt** → Generate 1 prompt (no login required)
3. **Authentication Required** → Login/Signup modal appears
4. **Daily Limit** → 4 prompts per day after login
5. **Upgrade Prompt** → Pricing modal for subscription

### **Plus User Journey:**
1. **Landing** → Home page with prompt builder
2. **Unlimited Prompts** → No daily limits
3. **Advanced Features** → Enhanced AI reasoning
4. **Faster Response** → Improved performance

### **Platinum User Journey:**
1. **Landing** → Home page with prompt builder
2. **Premium Features** → Pro reasoning, fastest responses
3. **Custom Templates** → Personalized prompt settings

---

## 📱 **Component Structure**

### **Main Components:**
- **App.tsx** - Main application container
- **Auth.tsx** - Authentication modal
- **Pricing.tsx** - Subscription plans modal
- **Success.tsx** - Payment confirmation page

### **Features by Section:**

#### **Header Section:**
- Logo (Prompthis)
- Brand name with elegant font
- Hamburger menu (top-left)
- User info (bottom-left)
- Sign In button (top-right, when not logged in)
- Get Plus button (top-right)

#### **Main Content:**
- Hero section with tagline
- Prompt template grid (6 templates)
- Custom prompt input
- Generated prompt display
- Action buttons (Copy/Download)

#### **Sidebar/Menu:**
- Prompt History dropdown
- User authentication status
- Logout functionality

---

## 🎨 **Design Elements**

### **Color Scheme:**
- **Background**: Metallic gray gradient
- **Cards**: Glass-morphism effect
- **Text**: White/gray palette
- **Brand**: Elegant typography (Playfair Display)

### **Responsive Design:**
- **Desktop**: Full layout with all features
- **Mobile**: Compact design with 2 templates per row
- **Tablet**: Adaptive layout

---

## 🔐 **Authentication & Security**

### **User Management:**
- **Supabase**: User authentication and session management
- **Email Confirmation**: Optional (can be disabled)
- **Session Persistence**: Automatic token refresh

### **Payment Security:**
- **Stripe**: Secure payment processing
- **Webhook Handling**: Subscription management
- **PCI Compliance**: Stripe handles sensitive data

---

## 📊 **Analytics & Tracking**

### **User Metrics:**
- Daily prompt usage
- Template popularity
- Conversion rates (free to paid)
- User retention

### **Performance:**
- Page load times
- API response times
- Error rates
- User engagement

---

## 🚀 **Deployment & Infrastructure**

### **Platform:**
- **Vercel**: Frontend hosting and serverless functions
- **GitHub**: Version control and CI/CD
- **Environment Variables**: Secure API key management

### **External Services:**
- **OpenAI**: AI prompt generation
- **Supabase**: Database and authentication
- **Stripe**: Payment processing

---

## 📈 **SEO & Marketing**

### **Meta Information:**
- **Title**: "Prompthis - Better ChatGPT Prompts"
- **Description**: "Create better ChatGPT prompts with our AI-powered prompt builder"
- **Keywords**: AI prompts, ChatGPT, prompt engineering, AI writing

### **Social Media:**
- **Brand**: Prompthis
- **Tagline**: "Better AI prompts. Better AI answers."
- **Logo**: Professional gray logo design

---

*Last Updated: January 15, 2024*
*Version: 1.0* 