"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ImagePlus, Loader2, Pencil, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { updateMenuItem } from "@/lib/actions/menuitems";
import type { IMenuItem } from "@/types/menuItem.type";

type MenuCategory = (typeof MENU_CATEGORIES)[number]["value"];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB

type FormField =
  | "itemName"
  | "category"
  | "description"
  | "price"
  | "location"
  | "image";
type FieldErrors = Partial<Record<FormField, string>>;

const MenuEditDialog = ({ item }: { item: IMenuItem }) => {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);

  const originalImage = item.images?.[0] ?? null;

  const [itemName, setItemName] = useState(item.itemName ?? "");
  const [category, setCategory] = useState<MenuCategory | "">(
    (item.category as MenuCategory) ?? "",
  );
  const [description, setDescription] = useState(item.description ?? "");
  const [price, setPrice] = useState(String(item.price ?? ""));
  const [location, setLocation] = useState(item.location ?? "");

  // নতুন select করা file (না থাকলে null, তখন পুরনো image থাকবে)
  const [image, setImage] = useState<File | null>(null);
  const [newPreviewUrl, setNewPreviewUrl] = useState<string | null>(null);
  const previewUrl = newPreviewUrl ?? originalImage;

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setImageError = (message: string | undefined) =>
    setFieldErrors((prev) => ({ ...prev, image: message }));

  const clearNewImage = () => {
    setImage(null);
    setNewPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const resetFormToItem = () => {
    setItemName(item.itemName ?? "");
    setCategory((item.category as MenuCategory) ?? "");
    setDescription(item.description ?? "");
    setPrice(String(item.price ?? ""));
    setLocation(item.location ?? "");
    setFieldErrors({});
    clearNewImage();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    resetFormToItem();
    setOpen(nextOpen);
  };

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
    setNewPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  };

  /** ImgBB upload, server-side route দিয়ে। */
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

    // Edit এ image optional, কিন্তু পুরনো বা নতুন যেকোনো একটি থাকতেই হবে
    if (!image && !originalImage) {
      errors.image = "An item image is required.";
    }

    return errors;
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = validate();
    setFieldErrors(errors);

    if (Object.values(errors).some(Boolean) || !category) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // নতুন image থাকলে upload, না থাকলে পুরনো URL
      const imageUrl = image ? await uploadImage(image) : originalImage!;

      await updateMenuItem(item._id, {
        itemName: itemName.trim(),
        category,
        description: description.trim(),
        price: Number(price),
        location: location.trim(),
        images: [imageUrl],
      });

      toast.success("Menu item updated and sent for review.");
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Update menu item error:", error);
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={`Edit ${item.itemName}`}
            title="Edit item"
            className="shrink-0 cursor-pointer"
          >
            <Pencil />
          </Button>
        }
      />
      <DialogContent className="max-h-[90vh] w-full overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit menu item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="min-w-0 space-y-5" noValidate>
          {/* Item name + Category */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="min-w-0 space-y-2">
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

            <div className="min-w-0 space-y-2">
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
                  {MENU_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
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
          <div className="min-w-0 space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the ingredients, taste, and size…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-invalid={!!fieldErrors.description}
              className="min-h-28 w-full resize-y"
            />
            {fieldErrors.description && (
              <p className="text-destructive text-sm">
                {fieldErrors.description}
              </p>
            )}
          </div>

          {/* Price + Location */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="min-w-0 space-y-2">
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

            <div className="min-w-0 space-y-2">
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

          {/* Item image (edit এ optional) */}
          <div className="min-w-0 space-y-2">
            <Label htmlFor="item-image">Item Image</Label>
            <Label
              htmlFor="item-image"
              className={
                previewUrl
                  ? "hover:bg-accent/70 border-input bg-card flex cursor-pointer items-center gap-3 rounded-lg border p-2 transition-colors"
                  : "hover:bg-accent/70 border-input flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-6 text-center transition-colors"
              }
            >
              {previewUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Menu item preview"
                    className="size-14 shrink-0 rounded-md object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {image?.name ?? "Current image"}
                    </span>
                    <span className="text-muted-foreground block text-xs">
                      Click to change image
                    </span>
                  </span>
                  {image && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Discard new image"
                      title="Keep the current image"
                      onClick={(e) => {
                        e.preventDefault(); // label click এ file picker খুলবে না
                        clearNewImage();
                      }}
                      className="text-muted-foreground"
                    >
                      <X />
                    </Button>
                  )}
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

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="h-10 w-full cursor-pointer bg-(image:--gradient-primary) text-white hover:opacity-90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save />
                Save updates
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MenuEditDialog;
