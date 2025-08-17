# Prompthis - Better ChatGPT Prompts

A modern web application that helps users create better ChatGPT prompts using AI-powered generation.

## 🚀 Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see below)
4. Start development server: `npm start`

## 🔐 Environment Variables

**⚠️ SECURITY WARNING: Never commit API keys to Git!**

Create a `.env` file in the root directory with the following variables:

```env
# OpenAI API Configuration
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
REACT_APP_STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 🔒 Security Best Practices

1. **Never share API keys publicly**
2. **Use environment variables for all sensitive data**
3. **Rotate API keys regularly**
4. **Monitor API usage for unusual activity**
5. **Use different keys for development and production**
6. **Keep your `.env` file in `.gitignore`**

## 🛠️ Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key
- Supabase account
- Stripe account (for payments)

### Installation
```bash
npm install
```

### Running the App
```bash
npm start
```

The app will be available at `http://localhost:3000`

### Building for Production
```bash
npm run build
```

## 🌐 Deployment

The app is deployed on Vercel. Make sure to set all environment variables in your Vercel dashboard:

1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add all required variables from the `.env` file

## 📁 Project Structure

```
src/
├── components/     # React components
├── api/           # API integrations
├── lib/           # Utility libraries
└── App.tsx        # Main application component

api/               # Vercel serverless functions
public/            # Static assets
```

## 🔧 Features

- **AI-Powered Prompt Generation**: Uses OpenAI's GPT-3.5-turbo
- **User Authentication**: Supabase email/password auth
- **Prompt History**: Save and manage your generated prompts
- **Subscription Plans**: Stripe integration for Plus/Platinum plans
- **Responsive Design**: Works on desktop and mobile
- **Modern UI**: Clean, professional interface

## 📝 Usage

1. **Free Users**: 1 prompt before login, then 4 prompts per day
2. **Plus Plan ($3.99/month)**: Unlimited prompts with advanced reasoning
3. **Platinum Plan ($14.99/month)**: Unlimited prompts with pro reasoning

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For support, please contact the development team. 