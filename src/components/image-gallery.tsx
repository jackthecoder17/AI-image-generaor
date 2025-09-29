"use client";

import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shuffle, Trash2, GripVertical, Download } from "lucide-react";
import Image from "next/image";
import { GeneratedImage } from "./ai-image-generator";
import { formatDistanceToNow } from "date-fns";

interface ImageGalleryProps {
  images: GeneratedImage[];
  onUpdateImages: (images: GeneratedImage[]) => void;
  onDeleteImage: (id: string) => void;
  onRemixImage: (prompt: string) => void;
  onDownloadImage: (image: GeneratedImage) => void;
}

interface SortableImageProps {
  image: GeneratedImage;
  onDelete: (id: string) => void;
  onRemix: (prompt: string) => void;
  onDownload: (image: GeneratedImage) => void;
}

function SortableImage({ image, onDelete, onRemix, onDownload }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-md overflow-hidden border transition-all duration-200 ${
        isDragging ? "shadow-xl scale-105" : "hover:shadow-lg"
      }`}
    >
      {/* Drag Handle */}
      <div
        className="flex items-center justify-center p-2 bg-gray-50 border-b cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>

      {/* Image */}
      <div className="relative aspect-square">
        <Image
          src={image.url}
          alt={image.prompt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
        />
      </div>

      {/* Image Info */}
      <div className="p-3 space-y-2">
        <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
          {image.prompt}
        </p>
        
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {formatDistanceToNow(image.timestamp, { addSuffix: true })}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex gap-1 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onRemix(image.prompt)}
            className="flex-1 text-xs h-8"
          >
            <Shuffle className="mr-1 h-3 w-3" />
            Remix
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDownload(image)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8"
          >
            <Download className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(image.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ImageGallery({ 
  images, 
  onUpdateImages, 
  onDeleteImage, 
  onRemixImage,
  onDownloadImage 
}: ImageGalleryProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = images.findIndex((item) => item.id === active.id);
      const newIndex = images.findIndex((item) => item.id === over?.id);

      const newOrder = arrayMove(images, oldIndex, newIndex);
      onUpdateImages(newOrder);
      
      // Save to localStorage
      localStorage.setItem("ai-generated-images", JSON.stringify(newOrder));
    }
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Image 
            src="/placeholder-image.svg" 
            alt="No images" 
            width={48} 
            height={48} 
            className="opacity-50"
          />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
        <p className="text-gray-500 mb-4">
          Generate your first AI image to get started!
        </p>
        <p className="text-sm text-gray-400">
          Your generated images will appear here and you can drag to reorder them
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={images} strategy={verticalListSortingStrategy}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
          {images.map((image) => (
            <SortableImage
              key={image.id}
              image={image}
              onDelete={onDeleteImage}
              onRemix={onRemixImage}
              onDownload={onDownloadImage}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}