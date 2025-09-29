# 🎨 AI Image Generator

A modern, responsive web application for generating stunning images using AI-powered Stable Diffusion models from Hugging Face. Built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui.

![AI Image Generator](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-teal)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-purple)

## ✨ Features

- 🎯 **Ready-to-Use AI Image Generation** - Works immediately with built-in API access
- 🎨 **Intuitive Interface** - Clean, modern UI built with shadcn/ui components
- 🖼️ **Drag & Drop Gallery** - Organize your generated images with smooth drag and drop
- 🔄 **Remix Feature** - Create variations of existing prompts with AI-powered modifications
- 💾 **Local Storage** - All your images are saved locally in your browser
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ⚡ **Real-time Progress** - Visual progress indicator during image generation
- 🌓 **Dark Mode Ready** - Built with dark mode support
- 🔑 **Optional Personal API Key** - Add your own for priority access

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-image-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Optional: Add your own API key for priority access**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Hugging Face API key:
   ```env
   HUGGINGFACE_API_KEY=your_huggingface_api_key_here
   ```
   
   **Note**: The app works out of the box! Adding your own API key gives you priority access.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 🔑 Optional: Get Your Own Hugging Face API Key

The app works immediately with shared API access, but you can add your own key for priority access:

1. Go to [huggingface.co](https://huggingface.co) and create a free account
2. Navigate to [Settings > Access Tokens](https://huggingface.co/settings/tokens)
3. Click "New token" and create a token with **"Write"** permissions
4. Make sure to enable **"Inference API"** permissions
5. Copy the token and add it in the app's settings or your `.env.local` file

**Benefits of your own API key**: Priority access, higher rate limits, and no shared usage.

## 🎯 How to Use

### 1. Generate Images
- Enter a detailed prompt describing the image you want
- Click "Generate Image" and wait 30-60 seconds
- The more detailed your prompt, the better the results!

### 2. Save to Gallery
- Click "Save to Gallery" to add the image to your personal collection
- Images are stored locally in your browser

### 3. Remix Prompts
- Use the "Remix" button to create variations of existing prompts
- The AI will automatically add creative modifications to your prompt

### 4. Organize Gallery
- Drag and drop images to reorder them
- Delete images you don't want to keep
- View generation timestamp for each image

## 💡 Prompt Tips for Better Results

### Good Prompt Examples:
- "A serene mountain landscape at sunset with a crystal clear lake reflecting the orange sky"
- "Portrait of a cyberpunk character with neon blue hair and glowing eyes, detailed digital art"
- "A cozy coffee shop interior with warm lighting, wooden furniture, and plants"

### Prompt Enhancement Tips:
- **Be specific**: Include details about style, lighting, colors, mood
- **Add quality terms**: "high quality", "detailed", "beautiful", "masterpiece"
- **Specify art style**: "digital art", "oil painting", "watercolor", "photograph"
- **Include lighting**: "soft lighting", "dramatic shadows", "golden hour"

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React
- **Notifications**: Sonner
- **AI Model**: Stable Diffusion v1.5 via Hugging Face

## 📁 Project Structure

```
src/
├── app/
│   ├── api/generate-image/    # API endpoint for image generation
│   ├── globals.css           # Global styles and Tailwind config
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── ai-image-generator.tsx # Main generator component
│   └── image-gallery.tsx    # Drag & drop gallery
└── lib/
    └── utils.ts             # Utility functions
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in the Vercel dashboard
   - Deploy!

### Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `out` folder to Netlify
   - Or connect your GitHub repository

## 🔧 Configuration

### Environment Variables

- `HUGGINGFACE_API_KEY` - Your Hugging Face API key (optional)

### Customization

You can customize the app by modifying:

- **Colors**: Edit the CSS variables in `src/app/globals.css`
- **Models**: Change the model endpoint in `src/app/api/generate-image/route.ts`
- **Prompts**: Modify the remix variations in `src/components/ai-image-generator.tsx`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co) for providing free AI model access
- [shadcn/ui](https://ui.shadcn.com) for the beautiful UI components
- [Stable Diffusion](https://stability.ai/stable-diffusion) for the AI model
- [Next.js](https://nextjs.org) for the amazing framework

## 📞 Support

If you have any questions or run into issues:

1. Check the [GitHub Issues](issues) page
2. Create a new issue with detailed information
3. Include screenshots and error messages if applicable

---

**Happy Creating! 🎨✨**
