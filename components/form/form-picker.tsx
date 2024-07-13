'use client';

import { unsplash } from "@/lib/unsplash";
import { cn } from "@/lib/utils";
import { Check, FileDiff, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { FormErrors } from "./form-errors";

interface FormPickerProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
}

export const FormPicker = ({
  id,
  errors,
}: FormPickerProps) => {
  const { pending } = useFormStatus();
  const [images, setImages] = useState<Record<string, any>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await unsplash.photos.getRandom({
          count: 9,
        });

        if(result && result.response) {
          const newImages = (result.response as Array<Record<string, any>>);
          setImages(newImages);
        } else {
          console.error('Error fetching images', result);
        }
      } catch (error) {
        console.error('Error fetching images', error);
        setImages([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchImages();
  }, [])

  if(isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-sky-700 animate-spin" />
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {images.map((image: Record<string, any>) => (
          <div
            key={image.id}
            className={cn('cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted', pending && 'opacity-50 hover:opacity-50 cursor-auto')}
            onClick={() => {
              if(pending) return;
              setSelectedImage(image.id)
            }}
          >
            <input
              type="radio"
              id={id}
              name={id}
              checked={selectedImage === image.id}
              className="hidden"
              disabled={pending}
              value={`${image.id} | ${image.urls.thumb} | ${image.urls.full} | ${image.links.html} | ${image.user.name}`}
            />
            <Image
              src={image.urls.thumb}
              alt='unsplash'
              fill
              className="object-cover rounded-sm"
            />
            {selectedImage === image.id && (
              <div className="absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
            <Link
              href={image.links.html}
              target="_blank"
              className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline bg-black/40"
            >
              {image.user.name}
            </Link>
          </div>
        ))}
      </div>
      <FormErrors
        id='image'
        errors={errors}
      />
    </div>
  )
}
