"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { 
  Wand2, 
  Download, 
  Save, 
  Shuffle, 
  Trash2, 
  Image as ImageIcon,
  Loader2,
  Settings,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import { ImageGallery } from "@/components/image-gallery";

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: Date;
  seed?: number;
}

export function AIImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [savedImages, setSavedImages] = useState<GeneratedImage[]>([]);
  const [apiKey, setApiKey] = useState("");
  const [progress, setProgress] = useState(0);

  // Load saved images and API key from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ai-generated-images");
    if (saved) {
      try {
        const parsedImages = JSON.parse(saved).map((img: Omit<GeneratedImage, 'timestamp'> & { timestamp: string }) => ({
          ...img,
          timestamp: new Date(img.timestamp),
        }));
        setSavedImages(parsedImages);
      } catch (error) {
        console.error("Error loading saved images:", error);
      }
    }

    const savedApiKey = localStorage.getItem("hf-api-key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Save images to localStorage
  const saveToLocalStorage = (images: GeneratedImage[]) => {
    localStorage.setItem("ai-generated-images", JSON.stringify(images));
  };

  // Save API key to localStorage
  const saveApiKey = (key: string) => {
    localStorage.setItem("hf-api-key", key);
    setApiKey(key);
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGeneratedImage(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 1000);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          apiKey: apiKey || undefined,
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Failed to generate image. Please try again.";
        let suggestion = "";
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
          suggestion = errorData.suggestion || "";
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        // Show specific error messages to help users
        if (response.status === 401 || response.status === 403) {
          if (!apiKey) {
            errorMessage = "This requires a Hugging Face API key. " + (suggestion || "Get one free at https://huggingface.co/settings/tokens");
          } else {
            errorMessage = "API key issue: " + errorMessage;
          }
        } else if (response.status === 503) {
          errorMessage = errorMessage + " " + (suggestion || "");
        } else if (response.status === 429) {
          errorMessage = "Rate limit exceeded. Please wait a moment and try again.";
        }
        
        throw new Error(errorMessage);
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImage(imageUrl);
      setCurrentPrompt(prompt.trim());

      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate image");
    } finally {
      setIsGenerating(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const saveImage = () => {
    if (!generatedImage || !currentPrompt) return;

    const newImage: GeneratedImage = {
      id: Date.now().toString(),
      url: generatedImage,
      prompt: currentPrompt,
      timestamp: new Date(),
    };

    const updatedImages = [newImage, ...savedImages];
    setSavedImages(updatedImages);
    saveToLocalStorage(updatedImages);

    toast.success("Image saved to gallery!");
  };

  const downloadImage = async (imageUrl?: string, filename?: string) => {
    const urlToDownload = imageUrl || generatedImage;
    if (!urlToDownload) return;

    try {
      const response = await fetch(urlToDownload);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || `ai-generated-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Image downloaded!");
    } catch {
      toast.error("Failed to download image");
    }
  };

  const downloadFromGallery = (image: GeneratedImage) => {
    const timestamp = new Date(image.timestamp).toISOString().slice(0, 19).replace(/[:.]/g, '-');
    const filename = `ai-generated-${timestamp}.png`;
    downloadImage(image.url, filename);
  };

  const remixPrompt = () => {
    if (!currentPrompt) return;

    const variations = [
      "in the style of Van Gogh",
      "as a watercolor painting",
      "in cyberpunk style",
      "as a pencil sketch",
      "with dramatic lighting",
      "in anime style",
      "as a vintage photograph",
      "with neon colors",
      "in minimalist style",
      "with surreal elements",
    ];

    const randomVariation = variations[Math.floor(Math.random() * variations.length)];
    const remixedPrompt = `${currentPrompt}, ${randomVariation}`;
    setPrompt(remixedPrompt);

    toast.info(`Prompt remixed with: ${randomVariation}`);
  };

  const clearGallery = () => {
    setSavedImages([]);
    localStorage.removeItem("ai-generated-images");
    toast.success("Gallery cleared!");
  };

  const deleteImage = (id: string) => {
    const updatedImages = savedImages.filter((img) => img.id !== id);
    setSavedImages(updatedImages);
    saveToLocalStorage(updatedImages);
    toast.success("Image deleted!");
  };

  const remixFromGallery = (galleryPrompt: string) => {
    setPrompt(galleryPrompt);
    toast.info("Prompt loaded from gallery");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          <Sparkles className="inline-block mr-2 mb-2" size={48} />
          AI Image Generator
        </h1>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
          Create stunning images with AI using Stable Diffusion models - ready to use right away!
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Generator Section */}
        <div className="space-y-6">
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                Generate Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Textarea
                  placeholder="Describe the image you want to generate... (e.g., 'A serene mountain landscape at sunset with a lake reflecting the sky')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px] resize-none"
                  disabled={isGenerating}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={generateImage}
                  disabled={isGenerating || !prompt.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Image
                    </>
                  )}
                </Button>
                
                {currentPrompt && (
                  <Button
                    onClick={remixPrompt}
                    variant="outline"
                    disabled={isGenerating}
                  >
                    <Shuffle className="mr-2 h-4 w-4" />
                    Remix
                  </Button>
                )}
              </div>

              {/* API Key Input */}
              <div className={`space-y-2 p-4 rounded-lg border transition-colors ${apiKey ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Hugging Face API Key (Optional)
                  </span>
                </div>
                <Input
                  type="password"
                  placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={apiKey}
                  onChange={(e) => saveApiKey(e.target.value)}
                  className="text-xs"
                />
                <p className="text-xs text-muted-foreground">
                  {apiKey ? (
                    <>✅ Using your personal API key - priority access to models</>
                  ) : (
                    <>� Using shared API key - ready to generate images! Optionally add your own for priority access from{" "}
                    <a 
                      href="https://huggingface.co/settings/tokens" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      huggingface.co
                    </a></>
                  )}
                </p>
              </div>

              {/* Progress Bar */}
              {isGenerating && (
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-muted-foreground text-center">
                    Generating your image... This may take 30-60 seconds
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generated Image Preview */}
          {generatedImage && (
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden">
                    <Image
                      src={generatedImage}
                      alt="Generated image"
                      width={512}
                      height={512}
                      className="w-full h-auto object-cover"
                      unoptimized
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs">
                      {currentPrompt}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button onClick={saveImage} size="sm" variant="default">
                      <Save className="mr-2 h-4 w-4" />
                      Save to Gallery
                    </Button>
                    <Button onClick={() => downloadImage()} size="sm" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button onClick={remixPrompt} size="sm" variant="outline">
                      <Shuffle className="mr-2 h-4 w-4" />
                      Remix
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Gallery Section */}
        <div>
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Your Gallery
                  <Badge variant="secondary" className="ml-2">
                    {savedImages.length}
                  </Badge>
                </CardTitle>
                {savedImages.length > 0 && (
                  <Button
                    onClick={clearGallery}
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ImageGallery
                images={savedImages}
                onUpdateImages={setSavedImages}
                onDeleteImage={deleteImage}
                onRemixImage={remixFromGallery}
                onDownloadImage={downloadFromGallery}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}