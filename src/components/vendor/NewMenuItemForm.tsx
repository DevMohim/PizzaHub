"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Plus, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MENU_CATEGORIES } from "@/config/menuCategories";
import { createMenuItem } from "@/lib/actions/menuitems";

type MenuCategory = (typeof MENU_CATEGORIES)[number]["value"];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const FREE_ACTIVE_LIMIT = 3;

type FormField =
  | "itemName"
  | "category"
  | "description"
  | "price"
  | "location"
  | "image";
type FieldErrors = Partial<Record<FormField, string>>;

interface NewMenuItemFormProps {
  menuCount: number;
  isPremium: boolean;
}

const NewMenuItemForm = ({ menuCount, isPremium }: NewMenuItemFormProps) => {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState<MenuCategory | "">("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setImageError = (message: string | undefined) =>
    setFieldErrors((prev) => ({ ...prev, image: message }));

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageError(undefined);

    if (!file.type.startsWith("image/")) {
      setImageError("Please choose an image file.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Image must be 10 MB or smaller.");
      return;
    }

    setImage(file);

    const url = URL.createObjectURL(file);
    setImagePreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  /** Server route দিয়ে ImgBB তে upload হয়, API key browser এ যায় না। */
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result.imageUrl) {
      throw new Error(result.message || "Image upload failed");
    }

    return result.imageUrl as string;
  };

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};

    if (!itemName.trim()) errors.itemName = "Item name is required.";
    if (!category) errors.category = "Please choose a category.";
    if (!description.trim()) errors.description = "Description is required.";

    const parsedPrice = Number(price);
    if (!price.trim()) errors.price = "Price is required.";
    else if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      errors.price = "Enter a valid price greater than 0.";
    }

    if (!location.trim()) errors.location = "Location is required.";
    if (!image) errors.image = "An item image is required.";

    return errors;
  };

  const resetForm = () => {
    setItemName("");
    setCategory("");
    setDescription("");
    setPrice("");
    setLocation("");
    setFieldErrors({});
    handleRemoveImage();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Free plan এ 3টির বেশি active item আনা যাবে না
    if (menuCount >= FREE_ACTIVE_LIMIT && !isPremium) {
      toast.error("Free plan এ 3টি active item। Premium এ upgrade করুন।");
      router.push("/dashboard/vendor/subscription");
      return;
    }

    const errors = validate();
    setFieldErrors(errors);

    if (Object.values(errors).some(Boolean) || !image || !category) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const imageUrl = await uploadImage(image);

      await createMenuItem({
        itemName: itemName.trim(),
        category,
        description: description.trim(),
        price: Number(price),
        location: location.trim(),
        images: [imageUrl],
      } as Parameters<typeof createMenuItem>[0]);

      toast.success("Menu item submitted for admin review.");
      resetForm();
      router.push("/dashboard/vendor/menu-items");
    } catch (error) {
      console.error("Create menu item error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">Item Details</CardTitle>
        <CardDescription>
          All fields are required. The image is uploaded to ImgBB.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Item name + Category */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="item-name">Item Name</Label>
              <Input
                id="item-name"
                name="itemName"
                type="text"
                placeholder="e.g. Margherita Classic"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                aria-invalid={!!fieldErrors.itemName}
                className="h-10"
              />
              {fieldErrors.itemName && (
                <p className="text-destructive text-sm">
                  {fieldErrors.itemName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as MenuCategory)}
              >
                <SelectTrigger
                  id="category"
                  className="h-10 w-full"
                  aria-invalid={!!fieldErrors.category}
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {MENU_CATEGORIES.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.category && (
                <p className="text-destructive text-sm">
                  {fieldErrors.category}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the ingredients, taste, and size…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-invalid={!!fieldErrors.description}
              className="min-h-28"
            />
            {fieldErrors.description && (
              <p className="text-destructive text-sm">
                {fieldErrors.description}
              </p>
            )}
          </div>

          {/* Price + Location */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 12.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                aria-invalid={!!fieldErrors.price}
                className="h-10"
              />
              {fieldErrors.price && (
                <p className="text-destructive text-sm">{fieldErrors.price}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location (area / city)</Label>
              <Input
                id="location"
                name="location"
                type="text"
                placeholder="e.g. Dhanmondi, Dhaka"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                aria-invalid={!!fieldErrors.location}
                className="h-10"
              />
              {fieldErrors.location && (
                <p className="text-destructive text-sm">
                  {fieldErrors.location}
                </p>
              )}
            </div>
          </div>

          {/* Item image */}
          <div className="space-y-2">
            <Label htmlFor="item-image">Item Image</Label>
            <Label
              htmlFor="item-image"
              className={
                imagePreviewUrl
                  ? "hover:bg-accent/70 border-input bg-card flex cursor-pointer items-center gap-3 rounded-lg border p-2 transition-colors"
                  : "hover:bg-accent/70 border-input flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-6 text-center transition-colors"
              }
            >
              {imagePreviewUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreviewUrl}
                    alt="Menu item preview"
                    className="size-14 shrink-0 rounded-md object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {image?.name ?? "Selected image"}
                    </span>
                    <span className="text-muted-foreground block text-xs">
                      Click to change image
                    </span>
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Remove selected image"
                    onClick={handleRemoveImage}
                    className="text-muted-foreground"
                  >
                    <X />
                  </Button>
                </>
              ) : (
                <>
                  <ImagePlus className="text-muted-foreground size-5" />
                  <span className="text-muted-foreground text-sm">
                    Click to upload a JPG, PNG or WEBP
                  </span>
                </>
              )}
              <Input
                ref={imageInputRef}
                id="item-image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="sr-only"
              />
            </Label>
            {fieldErrors.image && (
              <p className="text-destructive text-sm">{fieldErrors.image}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="h-10 w-full cursor-pointer bg-(image:--gradient-primary) text-white hover:opacity-90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Adding Menu Item
              </>
            ) : (
              <>
                <Plus />
                Create Menu Item
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewMenuItemForm;
