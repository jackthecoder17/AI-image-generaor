import { NextRequest, NextResponse } from "next/server";

// Note: Most Hugging Face models now require authentication
// Users need to provide their own API key for image generation
export async function POST(request: NextRequest) {
  try {
    const { prompt, apiKey } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required and must be a string" },
        { status: 400 }
      );
    }

    // Check if we have an API key (server-side or user-provided)
    const token = apiKey || process.env.HUGGINGFACE_API_KEY;
    
    if (!token) {
      return NextResponse.json(
        { 
          error: "No API key available",
          suggestion: "Please add your Hugging Face API key or contact the administrator."
        },
        { status: 401 }
      );
    }

    // Enhanced prompt for better results
    const enhancedPrompt = `${prompt}, high quality, detailed, beautiful, masterpiece, best quality`;

    // Models to try (in order of preference)
    const models = [
      "black-forest-labs/FLUX.1-schnell",
      "stabilityai/stable-diffusion-xl-base-1.0",
      "runwayml/stable-diffusion-v1-5",
      "stabilityai/stable-diffusion-2-1",
    ];

    let lastError = null;

    // Try each model until one works
    for (const model of models) {
      try {
        const HF_API_URL = `https://api-inference.huggingface.co/models/${model}`;
        
        console.log(`Trying model: ${model} with API key`);
        
        const response = await fetch(HF_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            inputs: enhancedPrompt,
            parameters: {
              guidance_scale: 7.5,
              num_inference_steps: 20,
            },
          }),
        });

        if (response.ok) {
          const imageBuffer = await response.arrayBuffer();
          
          if (imageBuffer.byteLength > 0) {
            console.log(`Success with model: ${model}`);
            // Return the image as a response
            return new NextResponse(imageBuffer, {
              headers: {
                "Content-Type": "image/png",
                "Cache-Control": "no-cache",
              },
            });
          }
        }

        const errorText = await response.text();
        console.log(`Model ${model} failed:`, response.status, errorText);
        lastError = { status: response.status, text: errorText };

        // If it's a model loading error (503), try next model
        if (response.status === 503) {
          console.log(`Model ${model} is loading, trying next model...`);
          continue;
        }
        
        // If it's an auth error, the API key might be invalid
        if (response.status === 401 || response.status === 403) {
          console.log(`Authentication failed for model ${model}`);
          // Don't break here, try other models in case it's model-specific
          continue;
        }

        // If it's a rate limit, try next model
        if (response.status === 429) {
          console.log(`Rate limited for model ${model}, trying next model...`);
          continue;
        }

      } catch (error) {
        console.log(`Error with model ${model}:`, error);
        lastError = { status: 500, text: String(error) };
        continue;
      }
    }

    // If all models failed, return appropriate error
    if (lastError) {
      if (lastError.status === 401 || lastError.status === 403) {
        return NextResponse.json(
          { 
            error: "Invalid API key or insufficient permissions", 
            suggestion: "Please check your Hugging Face API key has 'Write' permissions and try again. Get one at https://huggingface.co/settings/tokens"
          },
          { status: 401 }
        );
      }
      
      if (lastError.status === 429) {
        return NextResponse.json(
          { error: "Rate limit exceeded for all models. Please wait a few minutes and try again." },
          { status: 429 }
        );
      }

      if (lastError.status === 503) {
        return NextResponse.json(
          { error: "All AI models are currently loading. Please wait a few minutes and try again." },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: "All AI models are currently unavailable", 
        suggestion: "Please try again later or check your API key permissions."
      },
      { status: 503 }
    );

  } catch (error) {
    console.error("Error in generate-image API:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}