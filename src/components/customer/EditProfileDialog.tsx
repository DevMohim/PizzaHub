"use client";

import { isValidElement, useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUser } from "@/lib/auth-client";
import { useRouter } from "next/navigation";


const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB

type FieldErrors = Partial<Record<"name" | "image", string>>;

interface EditProfileDialogProps {
  user: { name: string; email: string; image?: string; role?: string };
  /** Optional custom trigger (defaults to an "Edit Profile" button). */
  trigger?: React.ReactNode;
}

/**
 * Dialog for editing the signed-in user's name and profile image.
 *
 * Saves through Better Auth's `updateUser` (see `@/lib/auth-client`). Per the
 * project context, role, blocked status, and subscription can never be changed
 * here — only `name` and `image` are sent to the server.
 */
const EditProfileDialog = ({ user, trigger }: EditProfileDialogProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user.name ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(
    user.image || null,
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter()

  const resetForm = () => {
    setName(user.name ?? "");
    setImage(null);
    setImagePreviewUrl(user.image || null);
    setFieldErrors({});
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleOpenChange = (next: boolean) => {
    if (isSaving) return;
    if (!next) resetForm();
    setOpen(next);
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

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (!name.trim()) errors.name = "Name is required.";
    return errors;
  };

  /**
   * Uploads the selected file to ImgBB through the server-side proxy
   * (`/api/upload`) and returns the hosted image URL.
   */
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

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = validate();
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setIsSaving(true);
    try {
      // If the user picked a new image, upload it to ImgBB first and use the
      // hosted URL. Otherwise keep the existing image (or clear it if removed).
      let imageUrl: string | null = imagePreviewUrl;
      if (image) {
        imageUrl = await uploadImageToImgbb(image);
      }

      await updateUser({
        name: name.trim(),
        image: imageUrl ?? undefined,
      });

      toast.success("Profile updated");
      resetForm();
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          isValidElement(trigger) ? (
            trigger
          ) : (
            <Button type="button" size="sm" className="cursor-pointer">
              {trigger ?? "Edit Profile"}
            </Button>
          )
        }
      />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Update your display name and profile image. Your role, blocked
            status, and subscription cannot be changed here.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-5" noValidate>
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="profile-name">Full name</Label>
            <Input
              id="profile-name"
              name="name"
              type="text"
              required
              placeholder="Your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setFieldErrors((prev) => ({ ...prev, name: undefined }));
              }}
              aria-invalid={!!fieldErrors.name}
              className="h-10"
            />
            {fieldErrors.name && (
              <p className="text-destructive text-sm">{fieldErrors.name}</p>
            )}
          </div>

          {/* Email (read-only) */}
          <div className="space-y-2">
            <Label htmlFor="profile-email">Email address</Label>
            <Input
              id="profile-email"
              type="email"
              value={user.email}
              readOnly
              disabled
              className="h-10"
            />
            <p className="text-muted-foreground text-xs">
              Your email cannot be changed here.
            </p>
          </div>

          {/* Image */}
          <div className="space-y-2">
            <Label htmlFor="profile-image">Profile image</Label>
            <Label
              htmlFor="profile-image"
              className={
                imagePreviewUrl
                  ? "hover:bg-accent/70 flex cursor-pointer items-center gap-3 rounded-lg border border-input bg-card p-2 transition-colors"
                  : "hover:bg-accent/70 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-input px-3 py-6 text-center transition-colors"
              }
            >
              {imagePreviewUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreviewUrl}
                    alt="Profile preview"
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
                id="profile-image"
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

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSaving}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="cursor-pointer bg-(image:--gradient-primary) text-white hover:opacity-90"
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin" />
                  Saving…
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
