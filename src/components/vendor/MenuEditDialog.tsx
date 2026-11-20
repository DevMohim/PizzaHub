"use client";
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
import { IMenuItem } from "@/types/menuItem.type";
import { ImagePlus, Loader2, Pencil, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { MENU_CATEGORIES } from "@/config/menuCategories";
import { Textarea } from "../ui/textarea";
import { updateMenuItem } from "@/lib/actions/menuitems";
// TODO: nijer update function import koro
// import { updateMenuItem } from "@/actions/menuItem";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB

type FieldErrors = Partial<
  Record<
    "itemName" | "category" | "description" | "price" | "location" | "image",
    string
  >
>;

const MenuEditDialog = ({ item }: { item: IMenuItem }) => {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);

  // Form state — item theke prefill
  const [itemName, setItemName] = useState(item.itemName ?? "");
  const [category, setCategory] = useState<string | null>(
    item.category ?? null,
  );
  const [description, setDescription] = useState(item.description ?? "");
  const [price, setPrice] = useState(String(item.price ?? ""));
  const [location, setLocation] = useState(item.location ?? "");

  // image = notun select kora file (na thakle null => purono image thakbe)
  const [image, setImage] = useState<File | null>(null);
  // preview = notun file er blob url, na thakle purono imageUrl
  const [newPreviewUrl, setNewPreviewUrl] = useState<string | null>(null);
  const previewUrl = newPreviewUrl ?? item.imageUrl ?? null;

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** Form ke abar item er original value e niye ashe */
  const resetFormToItem = () => {
    setItemName(item.itemName ?? "");
    setCategory(item.category ?? null);
    setDescription(item.description ?? "");
    setPrice(String(item.price ?? ""));
    setLocation(item.location ?? "");
    setFieldErrors({});
    clearNewImage();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    // Dialog khulle ba bondho hole fresh data diye shuru
    resetFormToItem();
    setOpen(nextOpen);
  };

  const clearNewImage = () => {
    setImage(null);
    setNewPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFieldErrors((prev) => ({ ...prev, image: undefined }));

    if (!file.type.startsWith("image/")) {
      setFieldErrors((prev) => ({
        ...prev,
        image: "Please choose an image file.",
      }));
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setFieldErrors((prev) => ({
        ...prev,
        image: "Image must be 10 MB or smaller.",
      }));
      return;
    }

    setImage(file);

    const url = URL.createObjectURL(file);
    setNewPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  };

  /** Uploads the selected file to ImgBB through the server-side proxy. */
  const uploadImageToImgbb = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

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

    // Edit e image optional, kintu purono ba notun — kono ekta thakte hobe
    if (!image && !item.imageUrl) errors.image = "An item image is required.";

    return errors;
  };

  const handleUpdateMenuItem = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const errors = validate();
    setFieldErrors(errors);

    if (Object.values(errors).some(Boolean)) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1) Notun image select kora thakle tabei upload korbo, nahole purono url
      const imageUrl = image
        ? await uploadImageToImgbb(image)
        : (item.imageUrl as string);

      // 2) Update payload (userEmail/userId update e pathano lagbe na — item er owner change hobe na)
      const menuItemPayload = {
        itemName: itemName.trim(),
        category,
        description: description.trim(),
        price: Number(price),
        location: location.trim(),
        imageUrl,
      };

      // TODO: nijer backend call boshao. Item er id field-er nam onujayi
      // (item._id naki item.id) thik koro.
      const result = await updateMenuItem(item._id as string, menuItemPayload as IMenuItem);
      if (!result) throw new Error("Failed to update menu item");

      toast.success("Menu item updated.");
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

        <form
          onSubmit={handleUpdateMenuItem}
          className="min-w-0 space-y-5"
          noValidate
        >
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
                <p className="text-destructive text-sm wrap:anywhere">
                  {fieldErrors.itemName}
                </p>
              )}
            </div>

            <div className="min-w-0 space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                items={MENU_CATEGORIES}
                value={category}
                onValueChange={(value) => setCategory(value as string)}
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
                <p className="text-destructive text-sm wrap:anywhere">
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
              className="min-h-28 w-full resize-y wrap:anywhere"
            />
            {fieldErrors.description && (
              <p className="text-destructive text-sm wrap:anywhere">
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
                <p className="text-destructive text-sm wrap:anywhere">
                  {fieldErrors.price}
                </p>
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
                <p className="text-destructive text-sm wrap:anywhere">
                  {fieldErrors.location}
                </p>
              )}
            </div>
          </div>

          {/* Item image (optional on edit) */}
          <div className="min-w-0 space-y-2">
            <Label htmlFor="item-image">Item Image</Label>
            <Label
              htmlFor="item-image"
              className={
                previewUrl
                  ? "hover:bg-accent/70 flex cursor-pointer items-center gap-3 rounded-lg border border-input bg-card p-2 transition-colors"
                  : "hover:bg-accent/70 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-input px-3 py-6 text-center transition-colors"
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
                  {/* Shudhu notun image select korle "undo" button dekhabe */}
                  {image && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Discard new image"
                      title="Keep the current image"
                      onClick={(e) => {
                        e.preventDefault(); // label click e file picker khulte dibe na
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
              <p className="text-destructive text-sm wrap:anywhere">
                {fieldErrors.image}
              </p>
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
